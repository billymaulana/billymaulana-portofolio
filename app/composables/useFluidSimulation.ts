/**
 * useFluidSimulation — WebGL2 Navier-Stokes fluid simulation composable.
 *
 * Powers the fluid text masking effect in the hero section.
 * Renders a colorful fluid simulation (blues, cyans, indigos) that reacts
 * to mouse movement with velocity-driven splats. Fast mouse movement
 * produces chromatic aberration. A text mask pass composites the fluid
 * only where text pixels exist.
 *
 * Simulation pipeline:
 *   splat → advection → divergence → pressure (Jacobi x20) → gradient subtract → display
 *
 * Performance: half-float textures (RGBA16F), simulation at half resolution,
 * ping-pong FBOs for each field.
 */

import gsap from 'gsap'

/* ═══════════════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════════════ */

interface FBO {
  texture: WebGLTexture
  fbo: WebGLFramebuffer
  width: number
  height: number
}

interface DoubleFBO {
  width: number
  height: number
  texelSizeX: number
  texelSizeY: number
  read: FBO
  write: FBO
  swap: () => void
}

interface ShaderProgram {
  program: WebGLProgram
  uniforms: Map<string, WebGLUniformLocation>
}

interface Pointer {
  x: number
  y: number
  prevX: number
  prevY: number
  dx: number
  dy: number
  moved: boolean
  down: boolean
}

interface FluidConfig {
  simResolution: number
  dyeResolution: number
  densityDissipation: number
  velocityDissipation: number
  pressureIterations: number
  splatRadius: number
  splatForce: number
  curl: number
}

/* ═══════════════════════════════════════════════════════════════════════
   SHADER SOURCES
   ═══════════════════════════════════════════════════════════════════════ */

const VERTEX_SHADER = /* glsl */ `#version 300 es
precision highp float;

in vec2 aPosition;
out vec2 vUv;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;
uniform vec2 texelSize;

void main () {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const CLEAR_SHADER = /* glsl */ `#version 300 es
precision mediump float;
precision mediump sampler2D;

in vec2 vUv;
uniform sampler2D uTexture;
uniform float value;
out vec4 fragColor;

void main () {
  fragColor = value * texture(uTexture, vUv);
}
`

const SPLAT_SHADER = /* glsl */ `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
uniform sampler2D uTarget;
uniform float aspectRatio;
uniform vec3 color;
uniform vec2 point;
uniform float radius;
out vec4 fragColor;

void main () {
  vec2 p = vUv - point;
  p.x *= aspectRatio;
  vec3 splat = exp(-dot(p, p) / radius) * color;
  vec3 base = texture(uTarget, vUv).xyz;
  fragColor = vec4(base + splat, 1.0);
}
`

const ADVECTION_SHADER = /* glsl */ `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform vec2 texelSize;
uniform float dt;
uniform float dissipation;
out vec4 fragColor;

vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
  vec2 st = uv / tsize - 0.5;
  vec2 iuv = floor(st);
  vec2 fuv = fract(st);
  vec4 a = texture(sam, (iuv + vec2(0.5, 0.5)) * tsize);
  vec4 b = texture(sam, (iuv + vec2(1.5, 0.5)) * tsize);
  vec4 c = texture(sam, (iuv + vec2(0.5, 1.5)) * tsize);
  vec4 d = texture(sam, (iuv + vec2(1.5, 1.5)) * tsize);
  return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
}

void main () {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  vec4 result = bilerp(uSource, coord, texelSize);
  float decay = 1.0 + dissipation * dt;
  fragColor = result / decay;
}
`

const DIVERGENCE_SHADER = /* glsl */ `#version 300 es
precision mediump float;
precision mediump sampler2D;

in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uVelocity;
out vec4 fragColor;

void main () {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  float div = 0.5 * (R - L + T - B);
  fragColor = vec4(div, 0.0, 0.0, 1.0);
}
`

const PRESSURE_SHADER = /* glsl */ `#version 300 es
precision mediump float;
precision mediump sampler2D;

in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
out vec4 fragColor;

void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  float pressure = (L + R + B + T - divergence) * 0.25;
  fragColor = vec4(pressure, 0.0, 0.0, 1.0);
}
`

const GRADIENT_SUBTRACT_SHADER = /* glsl */ `#version 300 es
precision mediump float;
precision mediump sampler2D;

in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
out vec4 fragColor;

void main () {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy;
  velocity.xy -= vec2(R - L, T - B);
  fragColor = vec4(velocity, 0.0, 1.0);
}
`

const CURL_SHADER = /* glsl */ `#version 300 es
precision mediump float;
precision mediump sampler2D;

in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uVelocity;
out vec4 fragColor;

void main () {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  float vorticity = R - L - T + B;
  fragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
}
`

const VORTICITY_SHADER = /* glsl */ `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
in vec2 vL;
in vec2 vR;
in vec2 vT;
in vec2 vB;
uniform sampler2D uVelocity;
uniform sampler2D uCurl;
uniform float curl;
uniform float dt;
out vec4 fragColor;

void main () {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;

  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;

  vec2 velocity = texture(uVelocity, vUv).xy;
  velocity += force * dt;
  velocity = min(max(velocity, -1000.0), 1000.0);
  fragColor = vec4(velocity, 0.0, 1.0);
}
`

const DISPLAY_SHADER = /* glsl */ `#version 300 es
precision highp float;
precision highp sampler2D;

in vec2 vUv;
uniform sampler2D uTexture;
uniform sampler2D uMask;
uniform float uChromaticAberration;
uniform float uMaskEnabled;
uniform float uTime;
out vec4 fragColor;

void main () {
  // Chromatic aberration offset based on mouse velocity
  vec2 dir = vUv - 0.5;
  float dist = length(dir);
  vec2 offset = dir * dist * uChromaticAberration * 0.02;

  // Sample RGB channels with offset for chromatic split
  float r = texture(uTexture, vUv - offset * 1.0).r;
  float g = texture(uTexture, vUv).g;
  float b = texture(uTexture, vUv + offset * 1.2).b;

  vec3 color = vec3(r, g, b);

  // Boost vibrance — push saturation toward the dominant channel
  float lum = dot(color, vec3(0.2126, 0.7152, 0.0722));
  color = mix(vec3(lum), color, 1.4);

  // Subtle vignette
  float vignette = 1.0 - dist * 0.4;
  color *= vignette;

  // Apply text mask with ambient fluid glow
  if (uMaskEnabled > 0.5) {
    float maskAlpha = texture(uMask, vUv).r;

    // ── AMBIENT LAYER: living fluid glow across entire viewport ──
    // The viewport must NEVER be flat black — fluid creates atmosphere
    vec3 ambient = color * 2.8;
    ambient += vec3(0.0, 0.012, 0.055); // subtle blue floor
    float fluidEnergy = smoothstep(0.0, 0.06, lum);
    float ambientAlpha = fluidEnergy * 0.4;
    ambientAlpha = max(ambientAlpha, 0.025); // minimum ambient presence

    // ── TEXT MASK LAYER: concentrated brightness through letter shapes ──
    vec3 masked = color * 5.5;
    masked += vec3(0.0, 0.12, 0.45) * maskAlpha; // identity blue base tint
    masked = min(masked, vec3(1.6));

    // ── COMPOSITE: ambient everywhere + bright through text ──
    vec3 finalColor = mix(ambient, masked, maskAlpha);
    float finalAlpha = max(ambientAlpha, maskAlpha);

    fragColor = vec4(finalColor, finalAlpha);
  } else {
    fragColor = vec4(color, 1.0);
  }
}
`

/* ═══════════════════════════════════════════════════════════════════════
   COMPOSABLE
   ═══════════════════════════════════════════════════════════════════════ */

export function useFluidSimulation() {
  // --- State ---
  let gl: WebGL2RenderingContext | null = null
  let canvas: HTMLCanvasElement | null = null
  let animFrameId = 0
  let lastTime = 0
  let isDestroyed = false

  // Reduced motion
  let prefersReducedMotion = false

  // Text mask
  let maskTexture: WebGLTexture | null = null
  let maskEnabled = false

  // Chromatic aberration (driven by mouse velocity)
  let chromaticAberration = 0
  let targetChromaticAberration = 0

  // Ambient splat timer
  let ambientSplatTimer = 0
  const AMBIENT_SPLAT_INTERVAL = 2.5 // seconds

  // Time uniform for subtle effects
  let elapsedTime = 0

  // --- Simulation config ---
  const config: FluidConfig = {
    simResolution: 128,
    dyeResolution: 1024,
    densityDissipation: 0.97,
    velocityDissipation: 0.6,
    pressureIterations: 20,
    splatRadius: 0.25,
    splatForce: 6000,
    curl: 30,
  }

  // --- Pointer state ---
  const pointer: Pointer = {
    x: 0.5,
    y: 0.5,
    prevX: 0.5,
    prevY: 0.5,
    dx: 0,
    dy: 0,
    moved: false,
    down: false,
  }

  // --- WebGL resources ---
  let vertexBuffer: WebGLBuffer | null = null
  let velocity: DoubleFBO | null = null
  let dye: DoubleFBO | null = null
  let pressure: DoubleFBO | null = null
  let divergenceFBO: FBO | null = null
  let curlFBO: FBO | null = null

  // --- Shader programs ---
  let clearProgram: ShaderProgram | null = null
  let splatProgram: ShaderProgram | null = null
  let advectionProgram: ShaderProgram | null = null
  let divergenceProgram: ShaderProgram | null = null
  let pressureProgram: ShaderProgram | null = null
  let gradientSubtractProgram: ShaderProgram | null = null
  let curlProgram: ShaderProgram | null = null
  let vorticityProgram: ShaderProgram | null = null
  let displayProgram: ShaderProgram | null = null

  /* ─── WebGL Helpers ─── */

  /** Safe uniform location getter — returns null instead of undefined */
  function getUniform(prog: ShaderProgram, name: string): WebGLUniformLocation | null {
    return prog.uniforms.get(name) ?? null
  }

  function compileShader(type: number, source: string): WebGLShader | null {
    if (!gl)
      return null
    const shader = gl.createShader(type)
    if (!shader)
      return null
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('[FluidSim] Shader compile error:', gl.getShaderInfoLog(shader))
      gl.deleteShader(shader)
      return null
    }
    return shader
  }

  function createProgram(vertexSource: string, fragmentSource: string): ShaderProgram | null {
    if (!gl)
      return null
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource)
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource)
    if (!vertexShader || !fragmentShader)
      return null

    const program = gl.createProgram()
    if (!program)
      return null

    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[FluidSim] Program link error:', gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      return null
    }

    // Clean up individual shaders (they're linked now)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)

    // Extract all active uniforms into a Map for type-safe access
    const uniforms = new Map<string, WebGLUniformLocation>()
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number
    for (let i = 0; i < uniformCount; i++) {
      const info = gl.getActiveUniform(program, i)
      if (info) {
        const loc = gl.getUniformLocation(program, info.name)
        if (loc) {
          uniforms.set(info.name, loc)
        }
      }
    }

    return { program, uniforms }
  }

  function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, filter: number): FBO | null {
    if (!gl)
      return null

    const texture = gl.createTexture()
    if (!texture)
      return null
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)

    const fbo = gl.createFramebuffer()
    if (!fbo)
      return null
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    gl.viewport(0, 0, w, h)
    gl.clear(gl.COLOR_BUFFER_BIT)

    return { texture, fbo, width: w, height: h }
  }

  function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, filter: number): DoubleFBO | null {
    const fbo1 = createFBO(w, h, internalFormat, format, type, filter)
    const fbo2 = createFBO(w, h, internalFormat, format, type, filter)
    if (!fbo1 || !fbo2)
      return null

    const doubleFBO: DoubleFBO = {
      width: w,
      height: h,
      texelSizeX: 1.0 / w,
      texelSizeY: 1.0 / h,
      read: fbo1,
      write: fbo2,
      swap() {
        const temp = doubleFBO.read
        doubleFBO.read = doubleFBO.write
        doubleFBO.write = temp
      },
    }

    return doubleFBO
  }

  function bindProgram(prog: ShaderProgram) {
    if (!gl)
      return
    gl.useProgram(prog.program)
  }

  function drawQuad() {
    if (!gl)
      return
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  function bindFBO(target: FBO | null) {
    if (!gl)
      return
    if (target) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo)
      gl.viewport(0, 0, target.width, target.height)
    }
    else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    }
  }

  function bindTexture(unit: number, texture: WebGLTexture) {
    if (!gl)
      return
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, texture)
  }

  /* ─── Resolution helpers ─── */

  function getResolution(resolution: number): { width: number, height: number } {
    if (!gl)
      return { width: resolution, height: resolution }
    let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight
    if (aspectRatio < 1)
      aspectRatio = 1.0 / aspectRatio

    const min = Math.round(resolution)
    const max = Math.round(resolution * aspectRatio)

    if (gl.drawingBufferWidth > gl.drawingBufferHeight) {
      return { width: max, height: min }
    }
    return { width: min, height: max }
  }

  /* ─── Simulation FBO initialization ─── */

  function initFramebuffers() {
    if (!gl)
      return

    const simRes = getResolution(config.simResolution)
    const dyeRes = getResolution(config.dyeResolution)

    const halfFloat = gl.HALF_FLOAT
    const filtering = gl.LINEAR

    // Check if linear filtering for half-float is supported
    const ext = gl.getExtension('EXT_color_buffer_half_float')
    if (!ext) {
      console.warn('[FluidSim] EXT_color_buffer_half_float not supported, falling back')
    }
    gl.getExtension('OES_texture_half_float_linear')

    velocity = createDoubleFBO(simRes.width, simRes.height, gl.RG16F, gl.RG, halfFloat, filtering)
    dye = createDoubleFBO(dyeRes.width, dyeRes.height, gl.RGBA16F, gl.RGBA, halfFloat, filtering)
    pressure = createDoubleFBO(simRes.width, simRes.height, gl.R16F, gl.RED, halfFloat, filtering)
    divergenceFBO = createFBO(simRes.width, simRes.height, gl.R16F, gl.RED, halfFloat, gl.NEAREST)
    curlFBO = createFBO(simRes.width, simRes.height, gl.R16F, gl.RED, halfFloat, gl.NEAREST)
  }

  /* ─── Splat (add velocity + dye) ─── */

  function splat(x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
    if (!gl || !velocity || !dye || !splatProgram || !canvas)
      return

    bindProgram(splatProgram)

    // Splat into velocity field
    gl.uniform1i(getUniform(splatProgram, 'uTarget'), 0)
    gl.uniform1f(getUniform(splatProgram, 'aspectRatio'), canvas.width / canvas.height)
    gl.uniform2f(getUniform(splatProgram, 'point'), x, y)
    gl.uniform3f(getUniform(splatProgram, 'color'), dx, dy, 0)
    gl.uniform1f(getUniform(splatProgram, 'radius'), correctRadius(config.splatRadius / 100.0))

    bindTexture(0, velocity.read.texture)
    bindFBO(velocity.write)
    drawQuad()
    velocity.swap()

    // Splat into dye field
    gl.uniform3f(getUniform(splatProgram, 'color'), color[0], color[1], color[2])
    bindTexture(0, dye.read.texture)
    bindFBO(dye.write)
    drawQuad()
    dye.swap()
  }

  function correctRadius(radius: number): number {
    if (!canvas)
      return radius
    const aspectRatio = canvas.width / canvas.height
    if (aspectRatio > 1)
      return radius * aspectRatio
    return radius
  }

  /* ─── Color palette for splats ─── */

  function generateSplatColor(velocityMag: number): [number, number, number] {
    // Identity palette: #0047FF, #00A3FF, #00F5FF, #0f0a72
    // Map velocity to hue shift within blue-cyan-indigo range
    const palettes: [number, number, number][] = [
      [0.0, 0.278, 1.0], // #0047FF — electric blue (normalized)
      [0.0, 0.639, 1.0], // #00A3FF — bright azure
      [0.0, 0.961, 1.0], // #00F5FF — cyan
      [0.059, 0.039, 0.447], // #0f0a72 — deep indigo
      [0.004, 0.4, 0.788], // #0166c9 — medium blue
      [0.631, 0.878, 0.906], // #a1e0e7 — light cyan
    ]

    // Pick color based on a combination of velocity and some randomness
    const idx = Math.floor(Math.random() * palettes.length)
    const fallback: [number, number, number] = [0.0, 0.278, 1.0]
    const base = palettes[idx] ?? fallback

    // Intensity scales with velocity magnitude — boosted for text-mask visibility
    const intensity = 0.6 + Math.min(velocityMag * 0.001, 1.0) * 1.2

    return [
      base[0] * intensity * 1.4,
      base[1] * intensity * 1.4,
      base[2] * intensity * 1.4,
    ]
  }

  /* ─── Ambient splats for idle motion ─── */

  function addAmbientSplat() {
    if (!canvas)
      return

    const x = Math.random()
    const y = Math.random()
    const angle = Math.random() * Math.PI * 2
    const force = 200 + Math.random() * 400
    const dx = Math.cos(angle) * force
    const dy = Math.sin(angle) * force

    const color = generateSplatColor(force * 0.3)
    // Ambient splats — still visible through text mask
    color[0] *= 0.6
    color[1] *= 0.6
    color[2] *= 0.6

    splat(x, y, dx, dy, color)
  }

  /* ─── Simulation step ─── */

  function step(dt: number) {
    if (!gl || !velocity || !dye || !pressure || !divergenceFBO || !curlFBO)
      return

    // Clamp dt to avoid instability
    const dtClamped = Math.min(dt, 0.016667)

    // --- Curl ---
    if (curlProgram) {
      bindProgram(curlProgram)
      gl.uniform2f(getUniform(curlProgram, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY)
      gl.uniform1i(getUniform(curlProgram, 'uVelocity'), 0)
      bindTexture(0, velocity.read.texture)
      bindFBO(curlFBO)
      drawQuad()
    }

    // --- Vorticity confinement ---
    if (vorticityProgram) {
      bindProgram(vorticityProgram)
      gl.uniform2f(getUniform(vorticityProgram, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY)
      gl.uniform1i(getUniform(vorticityProgram, 'uVelocity'), 0)
      gl.uniform1i(getUniform(vorticityProgram, 'uCurl'), 1)
      gl.uniform1f(getUniform(vorticityProgram, 'curl'), config.curl)
      gl.uniform1f(getUniform(vorticityProgram, 'dt'), dtClamped)
      bindTexture(0, velocity.read.texture)
      bindTexture(1, curlFBO.texture)
      bindFBO(velocity.write)
      drawQuad()
      velocity.swap()
    }

    // --- Divergence ---
    if (divergenceProgram) {
      bindProgram(divergenceProgram)
      gl.uniform2f(getUniform(divergenceProgram, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY)
      gl.uniform1i(getUniform(divergenceProgram, 'uVelocity'), 0)
      bindTexture(0, velocity.read.texture)
      bindFBO(divergenceFBO)
      drawQuad()
    }

    // --- Clear pressure ---
    if (clearProgram) {
      bindProgram(clearProgram)
      gl.uniform1i(getUniform(clearProgram, 'uTexture'), 0)
      gl.uniform1f(getUniform(clearProgram, 'value'), 0.8) // Pressure dissipation
      bindTexture(0, pressure.read.texture)
      bindFBO(pressure.write)
      drawQuad()
      pressure.swap()
    }

    // --- Pressure solve (Jacobi iteration) ---
    if (pressureProgram) {
      bindProgram(pressureProgram)
      gl.uniform2f(getUniform(pressureProgram, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY)
      gl.uniform1i(getUniform(pressureProgram, 'uDivergence'), 1)
      bindTexture(1, divergenceFBO.texture)

      for (let i = 0; i < config.pressureIterations; i++) {
        gl.uniform1i(getUniform(pressureProgram, 'uPressure'), 0)
        bindTexture(0, pressure.read.texture)
        bindFBO(pressure.write)
        drawQuad()
        pressure.swap()
      }
    }

    // --- Gradient subtraction ---
    if (gradientSubtractProgram) {
      bindProgram(gradientSubtractProgram)
      gl.uniform2f(getUniform(gradientSubtractProgram, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY)
      gl.uniform1i(getUniform(gradientSubtractProgram, 'uPressure'), 0)
      gl.uniform1i(getUniform(gradientSubtractProgram, 'uVelocity'), 1)
      bindTexture(0, pressure.read.texture)
      bindTexture(1, velocity.read.texture)
      bindFBO(velocity.write)
      drawQuad()
      velocity.swap()
    }

    // --- Advect velocity ---
    if (advectionProgram) {
      bindProgram(advectionProgram)
      gl.uniform2f(getUniform(advectionProgram, 'texelSize'), velocity.texelSizeX, velocity.texelSizeY)
      gl.uniform1i(getUniform(advectionProgram, 'uVelocity'), 0)
      gl.uniform1i(getUniform(advectionProgram, 'uSource'), 0)
      gl.uniform1f(getUniform(advectionProgram, 'dt'), dtClamped)
      gl.uniform1f(getUniform(advectionProgram, 'dissipation'), config.velocityDissipation)
      bindTexture(0, velocity.read.texture)
      bindFBO(velocity.write)
      drawQuad()
      velocity.swap()

      // --- Advect dye ---
      gl.uniform2f(getUniform(advectionProgram, 'texelSize'), 1.0 / dye.width, 1.0 / dye.height)
      gl.uniform1i(getUniform(advectionProgram, 'uVelocity'), 0)
      gl.uniform1i(getUniform(advectionProgram, 'uSource'), 1)
      gl.uniform1f(getUniform(advectionProgram, 'dissipation'), config.densityDissipation)
      bindTexture(0, velocity.read.texture)
      bindTexture(1, dye.read.texture)
      bindFBO(dye.write)
      drawQuad()
      dye.swap()
    }
  }

  /* ─── Display pass ─── */

  function render() {
    if (!gl || !dye || !displayProgram)
      return

    bindProgram(displayProgram)
    gl.uniform1i(getUniform(displayProgram, 'uTexture'), 0)
    gl.uniform1f(getUniform(displayProgram, 'uChromaticAberration'), chromaticAberration)
    gl.uniform1f(getUniform(displayProgram, 'uTime'), elapsedTime)

    // Text mask
    if (maskEnabled && maskTexture) {
      gl.uniform1f(getUniform(displayProgram, 'uMaskEnabled'), 1.0)
      gl.uniform1i(getUniform(displayProgram, 'uMask'), 1)
      bindTexture(1, maskTexture)
    }
    else {
      gl.uniform1f(getUniform(displayProgram, 'uMaskEnabled'), 0.0)
    }

    bindTexture(0, dye.read.texture)
    bindFBO(null)
    drawQuad()
  }

  /* ─── Input handlers ─── */

  function onPointerMove(e: PointerEvent) {
    if (!canvas)
      return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = 1.0 - (e.clientY - rect.top) / rect.height // Flip Y for GL

    pointer.prevX = pointer.x
    pointer.prevY = pointer.y
    pointer.x = x
    pointer.y = y
    pointer.dx = (x - pointer.prevX) * config.splatForce
    pointer.dy = (y - pointer.prevY) * config.splatForce
    pointer.moved = Math.abs(pointer.dx) > 0 || Math.abs(pointer.dy) > 0
  }

  function onPointerDown() {
    pointer.down = true
  }

  function onPointerUp() {
    pointer.down = false
  }

  function onTouchMove(e: TouchEvent) {
    if (!canvas || e.touches.length === 0)
      return

    const touch = e.touches.item(0)
    if (!touch)
      return

    const rect = canvas.getBoundingClientRect()
    const x = (touch.clientX - rect.left) / rect.width
    const y = 1.0 - (touch.clientY - rect.top) / rect.height

    pointer.prevX = pointer.x
    pointer.prevY = pointer.y
    pointer.x = x
    pointer.y = y
    pointer.dx = (x - pointer.prevX) * config.splatForce
    pointer.dy = (y - pointer.prevY) * config.splatForce
    pointer.moved = true
  }

  function onTouchStart(e: TouchEvent) {
    if (!canvas || e.touches.length === 0)
      return

    const touch = e.touches.item(0)
    if (!touch)
      return

    const rect = canvas.getBoundingClientRect()
    pointer.x = (touch.clientX - rect.left) / rect.width
    pointer.y = 1.0 - (touch.clientY - rect.top) / rect.height
    pointer.prevX = pointer.x
    pointer.prevY = pointer.y
    pointer.down = true
  }

  /* ─── Main loop ─── */

  function update(timestamp: number) {
    if (isDestroyed)
      return

    const dt = Math.min((timestamp - lastTime) / 1000, 0.05)
    lastTime = timestamp
    elapsedTime += dt

    // --- Handle pointer input ---
    if (pointer.moved) {
      pointer.moved = false
      const velocityMag = Math.sqrt(pointer.dx * pointer.dx + pointer.dy * pointer.dy)
      const color = generateSplatColor(velocityMag)
      splat(pointer.x, pointer.y, pointer.dx, pointer.dy, color)

      // Chromatic aberration proportional to mouse speed
      targetChromaticAberration = Math.min(velocityMag * 0.015, 8.0)
    }

    // Decay chromatic aberration smoothly
    chromaticAberration = gsap.utils.interpolate(chromaticAberration, targetChromaticAberration, 0.08)
    targetChromaticAberration *= 0.92

    // --- Ambient splats ---
    ambientSplatTimer += dt
    if (ambientSplatTimer > AMBIENT_SPLAT_INTERVAL) {
      ambientSplatTimer = 0
      addAmbientSplat()
    }

    // --- Simulation + render ---
    step(dt)
    render()

    animFrameId = requestAnimationFrame(update)
  }

  /* ─── Reduced motion fallback ─── */

  function renderStaticGradient() {
    if (!gl)
      return

    // Render a static blue gradient as fallback for reduced motion
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.clearColor(0.0, 0.027, 0.15, 1.0) // Very dark blue
    gl.clear(gl.COLOR_BUFFER_BIT)
  }

  /* ═══════════════════════════════════════════════════════════════════════
     PUBLIC API
     ═══════════════════════════════════════════════════════════════════════ */

  function init(canvasEl: HTMLCanvasElement): boolean {
    canvas = canvasEl
    isDestroyed = false

    // Check reduced motion preference
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Get WebGL2 context
    gl = canvas.getContext('webgl2', {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
      premultipliedAlpha: false,
    })

    if (!gl) {
      console.error('[FluidSim] WebGL2 not supported')
      return false
    }

    // Required extensions
    gl.getExtension('EXT_color_buffer_float')
    gl.getExtension('OES_texture_float_linear')

    // Blending for text mask compositing
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.enable(gl.BLEND)
    gl.disable(gl.DEPTH_TEST)

    // Fullscreen quad vertex buffer
    vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,
      -1,
      -1,
      1,
      1,
      -1,
      1,
      1,
    ]), gl.STATIC_DRAW)

    // Compile all shader programs
    clearProgram = createProgram(VERTEX_SHADER, CLEAR_SHADER)
    splatProgram = createProgram(VERTEX_SHADER, SPLAT_SHADER)
    advectionProgram = createProgram(VERTEX_SHADER, ADVECTION_SHADER)
    divergenceProgram = createProgram(VERTEX_SHADER, DIVERGENCE_SHADER)
    pressureProgram = createProgram(VERTEX_SHADER, PRESSURE_SHADER)
    gradientSubtractProgram = createProgram(VERTEX_SHADER, GRADIENT_SUBTRACT_SHADER)
    curlProgram = createProgram(VERTEX_SHADER, CURL_SHADER)
    vorticityProgram = createProgram(VERTEX_SHADER, VORTICITY_SHADER)
    displayProgram = createProgram(VERTEX_SHADER, DISPLAY_SHADER)

    // Verify critical programs compiled
    if (!splatProgram || !advectionProgram || !divergenceProgram
      || !pressureProgram || !gradientSubtractProgram || !displayProgram) {
      console.error('[FluidSim] Failed to compile essential shader programs')
      return false
    }

    // Set canvas size
    resizeCanvas()

    // Initialize FBOs
    initFramebuffers()

    // Reduced motion: render static and bail
    if (prefersReducedMotion) {
      renderStaticGradient()
      return true
    }

    // Add initial splats to seed the simulation with life
    addInitialSplats()

    // Bind input events
    canvas.addEventListener('pointermove', onPointerMove, { passive: true })
    canvas.addEventListener('pointerdown', onPointerDown, { passive: true })
    canvas.addEventListener('pointerup', onPointerUp, { passive: true })
    canvas.addEventListener('touchmove', onTouchMove, { passive: true })
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })

    // Start render loop
    lastTime = performance.now()
    animFrameId = requestAnimationFrame(update)

    return true
  }

  function addInitialSplats() {
    // Seed the fluid aggressively — hero must be visually alive from frame 1
    // More splats + higher force = richer initial state through text mask + ambient
    const count = 8 + Math.floor(Math.random() * 5)
    for (let i = 0; i < count; i++) {
      const x = 0.1 + Math.random() * 0.8
      const y = 0.1 + Math.random() * 0.8
      const angle = Math.random() * Math.PI * 2
      const force = 800 + Math.random() * 1800
      const dx = Math.cos(angle) * force
      const dy = Math.sin(angle) * force
      const color = generateSplatColor(force)
      // Aggressive brightness for immediate visual impact
      color[0] *= 3.0
      color[1] *= 3.0
      color[2] *= 3.0
      splat(x, y, dx, dy, color)
    }
  }

  function resizeCanvas() {
    if (!canvas || !gl)
      return

    const dpr = Math.min(window.devicePixelRatio, 2)
    const width = canvas.clientWidth * dpr
    const height = canvas.clientHeight * dpr

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
  }

  function resize() {
    if (!gl || !canvas)
      return

    resizeCanvas()
    initFramebuffers()
    addInitialSplats()
  }

  function setTextMask(maskCanvas: HTMLCanvasElement) {
    if (!gl)
      return

    // Create or update mask texture from the provided canvas
    if (!maskTexture) {
      maskTexture = gl.createTexture()
    }

    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, maskTexture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    // Flip Y to match canvas top-left origin → WebGL bottom-left origin
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, maskCanvas)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)

    maskEnabled = true
  }

  function destroy() {
    isDestroyed = true

    // Stop render loop
    if (animFrameId) {
      cancelAnimationFrame(animFrameId)
      animFrameId = 0
    }

    // Unbind input events
    if (canvas) {
      canvas.removeEventListener('pointermove', onPointerMove)
      canvas.removeEventListener('pointerdown', onPointerDown)
      canvas.removeEventListener('pointerup', onPointerUp)
      canvas.removeEventListener('touchmove', onTouchMove)
      canvas.removeEventListener('touchstart', onTouchStart)
    }

    // Clean up all WebGL resources
    if (gl) {
      // Delete FBOs
      const deleteFBO = (fbo: FBO | null) => {
        if (!fbo || !gl)
          return
        gl.deleteTexture(fbo.texture)
        gl.deleteFramebuffer(fbo.fbo)
      }

      const deleteDoubleFBO = (dfbo: DoubleFBO | null) => {
        if (!dfbo)
          return
        deleteFBO(dfbo.read)
        deleteFBO(dfbo.write)
      }

      deleteDoubleFBO(velocity)
      deleteDoubleFBO(dye)
      deleteDoubleFBO(pressure)
      deleteFBO(divergenceFBO)
      deleteFBO(curlFBO)

      // Delete mask texture
      if (maskTexture) {
        gl.deleteTexture(maskTexture)
        maskTexture = null
      }

      // Delete programs
      const programs = [
        clearProgram,
        splatProgram,
        advectionProgram,
        divergenceProgram,
        pressureProgram,
        gradientSubtractProgram,
        curlProgram,
        vorticityProgram,
        displayProgram,
      ]
      for (const prog of programs) {
        if (prog)
          gl.deleteProgram(prog.program)
      }

      // Delete vertex buffer
      if (vertexBuffer) {
        gl.deleteBuffer(vertexBuffer)
        vertexBuffer = null
      }

      // Lose context
      const loseCtx = gl.getExtension('WEBGL_lose_context')
      if (loseCtx)
        loseCtx.loseContext()
    }

    // Null out references
    gl = null
    canvas = null
    velocity = null
    dye = null
    pressure = null
    divergenceFBO = null
    curlFBO = null
    clearProgram = null
    splatProgram = null
    advectionProgram = null
    divergenceProgram = null
    pressureProgram = null
    gradientSubtractProgram = null
    curlProgram = null
    vorticityProgram = null
    displayProgram = null
    maskEnabled = false
  }

  return {
    init,
    destroy,
    resize,
    setTextMask,
  }
}
