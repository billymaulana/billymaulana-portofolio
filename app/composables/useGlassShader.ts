/**
 * WebGL2 Blue Flow Field — Navier-Stokes fluid sim for mouse-driven blue liquid.
 * Renders only the blue flow overlay; glass body is handled by SVG filters.
 */

interface FlowConfig {
  maxOpacity: number
  dyeDissipation: number
  splatRadius: number
  velocityThreshold: number
  reducedMotion: boolean
}

const defaultFlowConfig: FlowConfig = {
  maxOpacity: 0.35,
  dyeDissipation: 0.97,
  splatRadius: 0.02,
  velocityThreshold: 2,
  reducedMotion: false,
}

interface FBO {
  texture: WebGLTexture
  framebuffer: WebGLFramebuffer
  width: number
  height: number
}

// ─── Shader sources ─────────────────────────────────

const quadVert = /* glsl */ `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

// Advection: moves dye/velocity along the velocity field
const advectFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform float uDt;
uniform float uDissipation;
uniform vec2 uTexelSize;

void main() {
  vec2 vel = texture(uVelocity, vUv).xy;
  vec2 coord = vUv - vel * uDt * uTexelSize;
  fragColor = uDissipation * texture(uSource, coord);
}
`

// Divergence: computes velocity divergence
const divergenceFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

void main() {
  float l = texture(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
  float r = texture(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
  float b = texture(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
  float t = texture(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
  fragColor = vec4(0.5 * (r - l + t - b), 0.0, 0.0, 1.0);
}
`

// Pressure: Jacobi iteration to solve pressure from divergence
const pressureFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexelSize;

void main() {
  float l = texture(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
  float r = texture(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
  float b = texture(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
  float t = texture(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
  float div = texture(uDivergence, vUv).x;
  fragColor = vec4((l + r + b + t - div) * 0.25, 0.0, 0.0, 1.0);
}
`

// Gradient subtract: corrects velocity to be divergence-free
const gradientFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

void main() {
  float l = texture(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
  float r = texture(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
  float b = texture(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
  float t = texture(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
  vec2 vel = texture(uVelocity, vUv).xy;
  vel -= vec2(r - l, t - b) * 0.5;
  fragColor = vec4(vel, 0.0, 1.0);
}
`

// Splat: injects velocity/dye at mouse position
const splatFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTarget;
uniform vec2 uPoint;
uniform vec3 uColor;
uniform float uRadius;
uniform float uAspectRatio;

void main() {
  vec2 p = vUv - uPoint;
  p.x *= uAspectRatio;
  float d = dot(p, p);
  float splat = exp(-d / uRadius);
  vec3 base = texture(uTarget, vUv).xyz;
  fragColor = vec4(base + uColor * splat, 1.0);
}
`

// Vorticity: computes curl of velocity (for vorticity confinement)
const vorticityFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

void main() {
  float l = texture(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
  float r = texture(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
  float b = texture(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
  float t = texture(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
  fragColor = vec4((r - l) - (t - b), 0.0, 0.0, 1.0);
}
`

// Vorticity confinement: re-injects curl to counteract numerical dissipation
const vorticityForceFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uVorticity;
uniform vec2 uTexelSize;
uniform float uCurl;
uniform float uDt;

void main() {
  float l = texture(uVorticity, vUv - vec2(uTexelSize.x, 0.0)).x;
  float r = texture(uVorticity, vUv + vec2(uTexelSize.x, 0.0)).x;
  float b = texture(uVorticity, vUv - vec2(0.0, uTexelSize.y)).x;
  float t = texture(uVorticity, vUv + vec2(0.0, uTexelSize.y)).x;
  float c = texture(uVorticity, vUv).x;
  vec2 force = vec2(abs(t) - abs(b), abs(r) - abs(l));
  float len = length(force) + 1e-5;
  force = force / len * c * uCurl;
  vec2 vel = texture(uVelocity, vUv).xy;
  fragColor = vec4(vel + force * uDt, 0.0, 1.0);
}
`

// Display: renders dye as blue flow with opacity cap
const displayFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uDye;
uniform float uMaxOpacity;

void main() {
  vec3 dye = texture(uDye, vUv).rgb;
  float intensity = length(dye);

  // Blue palette: Electric Blue (#0047FF) -> Cyan (#00F5FF)
  vec3 blue = vec3(0.0, 0.28, 1.0);
  vec3 cyan = vec3(0.0, 0.96, 1.0);
  vec3 color = mix(blue, cyan, smoothstep(0.0, 1.5, intensity));

  // Opacity: proportional to intensity, capped at max
  float alpha = min(intensity * 0.6, uMaxOpacity);

  // Soft falloff at edges of flow
  alpha *= smoothstep(0.02, 0.1, intensity);

  fragColor = vec4(color * alpha, alpha);
}
`

// ─── Composable ─────────────────────────────────────

export function useGlassShader(config: Partial<FlowConfig> = {}) {
  const cfg = { ...defaultFlowConfig, ...config }

  let gl: WebGL2RenderingContext | null = null
  let canvas: HTMLCanvasElement | null = null
  let animationId = 0
  let running = false

  // GL resources
  let vao: WebGLVertexArrayObject | null = null
  let vertexBuffer: WebGLBuffer | null = null

  // Shader programs
  let advectProgram: WebGLProgram | null = null
  let divergenceProgram: WebGLProgram | null = null
  let pressureProgram: WebGLProgram | null = null
  let gradientProgram: WebGLProgram | null = null
  let splatProgram: WebGLProgram | null = null
  let vorticityProgram: WebGLProgram | null = null
  let vorticityForceProgram: WebGLProgram | null = null
  let displayProgram: WebGLProgram | null = null

  // FBOs
  const SIM_RES = 64
  const DYE_RES = 256
  let velFBO_A: FBO | null = null
  let velFBO_B: FBO | null = null
  let dyeFBO_A: FBO | null = null
  let dyeFBO_B: FBO | null = null
  let divFBO: FBO | null = null
  let pressureFBO_A: FBO | null = null
  let pressureFBO_B: FBO | null = null
  let vorticityFBO: FBO | null = null

  // For reading dye intensity back (readFlowIntensity)
  let dyeReadBuffer: Float32Array | null = null

  // Mouse state
  let mouseX = 0.5
  let mouseY = 0.5
  let prevMouseX = 0.5
  let prevMouseY = 0.5

  // Open progress (for controlling visibility)
  let openProgress = 0
  let openTarget = 0

  // ─── GL Helpers ──────────────────────────────────

  function compileShader(type: number, source: string): WebGLShader | null {
    const shader = gl!.createShader(type)
    if (!shader)
      return null
    gl!.shaderSource(shader, source)
    gl!.compileShader(shader)
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      console.error('[flow] Shader error:', gl!.getShaderInfoLog(shader))
      gl!.deleteShader(shader)
      return null
    }
    return shader
  }

  function createProgram(fragSource: string): WebGLProgram | null {
    const vs = compileShader(gl!.VERTEX_SHADER, quadVert)
    const fs = compileShader(gl!.FRAGMENT_SHADER, fragSource)
    if (!vs || !fs)
      return null
    const prog = gl!.createProgram()!
    gl!.attachShader(prog, vs)
    gl!.attachShader(prog, fs)
    gl!.bindAttribLocation(prog, 0, 'aPosition')
    gl!.linkProgram(prog)
    if (!gl!.getProgramParameter(prog, gl!.LINK_STATUS)) {
      console.error('[flow] Link error:', gl!.getProgramInfoLog(prog))
      gl!.deleteProgram(prog)
      return null
    }
    gl!.deleteShader(vs)
    gl!.deleteShader(fs)
    return prog
  }

  function createFBO(w: number, h: number, internalFormat: number, format: number, type: number): FBO | null {
    if (!gl)
      return null
    const texture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    const framebuffer = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    return { texture, framebuffer, width: w, height: h }
  }

  function bindFBO(fbo: FBO | null) {
    if (!gl)
      return
    if (fbo) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.framebuffer)
      gl.viewport(0, 0, fbo.width, fbo.height)
    }
    else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    }
  }

  function drawQuad() {
    gl!.bindVertexArray(vao)
    gl!.drawArrays(gl!.TRIANGLES, 0, 6)
    gl!.bindVertexArray(null)
  }

  function uniform1i(prog: WebGLProgram, name: string, val: number) {
    gl!.uniform1i(gl!.getUniformLocation(prog, name), val)
  }

  function uniform1f(prog: WebGLProgram, name: string, val: number) {
    gl!.uniform1f(gl!.getUniformLocation(prog, name), val)
  }

  function uniform2f(prog: WebGLProgram, name: string, x: number, y: number) {
    gl!.uniform2f(gl!.getUniformLocation(prog, name), x, y)
  }

  function uniform3f(prog: WebGLProgram, name: string, x: number, y: number, z: number) {
    gl!.uniform3f(gl!.getUniformLocation(prog, name), x, y, z)
  }

  function bindTexture(unit: number, texture: WebGLTexture) {
    gl!.activeTexture(gl!.TEXTURE0 + unit)
    gl!.bindTexture(gl!.TEXTURE_2D, texture)
  }

  // ─── Simulation Step ─────────────────────────────

  function step(dt: number) {
    if (!gl || !velFBO_A || !velFBO_B || !dyeFBO_A || !dyeFBO_B)
      return

    const velTexelSize: [number, number] = [1.0 / SIM_RES, 1.0 / SIM_RES]
    const dyeTexelSize: [number, number] = [1.0 / DYE_RES, 1.0 / DYE_RES]

    // ── Vorticity computation ──
    gl.useProgram(vorticityProgram!)
    bindTexture(0, velFBO_A.texture)
    uniform1i(vorticityProgram!, 'uVelocity', 0)
    uniform2f(vorticityProgram!, 'uTexelSize', ...velTexelSize)
    bindFBO(vorticityFBO!)
    drawQuad()

    // ── Vorticity confinement ──
    gl.useProgram(vorticityForceProgram!)
    bindTexture(0, velFBO_A.texture)
    bindTexture(1, vorticityFBO!.texture)
    uniform1i(vorticityForceProgram!, 'uVelocity', 0)
    uniform1i(vorticityForceProgram!, 'uVorticity', 1)
    uniform2f(vorticityForceProgram!, 'uTexelSize', ...velTexelSize)
    uniform1f(vorticityForceProgram!, 'uCurl', 25.0) // Strong curl for wake patterns
    uniform1f(vorticityForceProgram!, 'uDt', dt)
    bindFBO(velFBO_B)
    drawQuad()
    // Swap velocity
    let temp = velFBO_A
    velFBO_A = velFBO_B
    velFBO_B = temp

    // ── Divergence ──
    gl.useProgram(divergenceProgram!)
    bindTexture(0, velFBO_A.texture)
    uniform1i(divergenceProgram!, 'uVelocity', 0)
    uniform2f(divergenceProgram!, 'uTexelSize', ...velTexelSize)
    bindFBO(divFBO!)
    drawQuad()

    // ── Pressure (10 Jacobi iterations) ──
    // Clear pressure
    bindFBO(pressureFBO_A!)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(pressureProgram!)
    uniform1i(pressureProgram!, 'uDivergence', 1)
    bindTexture(1, divFBO!.texture)
    uniform2f(pressureProgram!, 'uTexelSize', ...velTexelSize)
    for (let i = 0; i < 10; i++) {
      bindTexture(0, pressureFBO_A!.texture)
      uniform1i(pressureProgram!, 'uPressure', 0)
      bindFBO(pressureFBO_B!)
      drawQuad()
      temp = pressureFBO_A!
      pressureFBO_A = pressureFBO_B
      pressureFBO_B = temp
    }

    // ── Gradient subtract ──
    gl.useProgram(gradientProgram!)
    bindTexture(0, pressureFBO_A!.texture)
    bindTexture(1, velFBO_A.texture)
    uniform1i(gradientProgram!, 'uPressure', 0)
    uniform1i(gradientProgram!, 'uVelocity', 1)
    uniform2f(gradientProgram!, 'uTexelSize', ...velTexelSize)
    bindFBO(velFBO_B)
    drawQuad()
    temp = velFBO_A
    velFBO_A = velFBO_B
    velFBO_B = temp

    // ── Advect velocity ──
    gl.useProgram(advectProgram!)
    bindTexture(0, velFBO_A.texture)
    bindTexture(1, velFBO_A.texture)
    uniform1i(advectProgram!, 'uVelocity', 0)
    uniform1i(advectProgram!, 'uSource', 1)
    uniform1f(advectProgram!, 'uDt', dt)
    uniform1f(advectProgram!, 'uDissipation', 0.98)
    uniform2f(advectProgram!, 'uTexelSize', ...velTexelSize)
    bindFBO(velFBO_B)
    drawQuad()
    temp = velFBO_A
    velFBO_A = velFBO_B
    velFBO_B = temp

    // ── Advect dye ──
    bindTexture(0, velFBO_A.texture)
    bindTexture(1, dyeFBO_A.texture)
    uniform1i(advectProgram!, 'uVelocity', 0)
    uniform1i(advectProgram!, 'uSource', 1)
    uniform1f(advectProgram!, 'uDt', dt)
    uniform1f(advectProgram!, 'uDissipation', cfg.dyeDissipation)
    uniform2f(advectProgram!, 'uTexelSize', ...dyeTexelSize)
    bindFBO(dyeFBO_B)
    drawQuad()
    temp = dyeFBO_A
    dyeFBO_A = dyeFBO_B
    dyeFBO_B = temp
  }

  function splat(x: number, y: number, dx: number, dy: number) {
    if (!gl || !splatProgram || !velFBO_A || !velFBO_B || !dyeFBO_A || !dyeFBO_B)
      return

    const aspectRatio = canvas!.width / canvas!.height

    // Inject velocity
    gl.useProgram(splatProgram)
    bindTexture(0, velFBO_A.texture)
    uniform1i(splatProgram, 'uTarget', 0)
    uniform2f(splatProgram, 'uPoint', x, y)
    uniform3f(splatProgram, 'uColor', dx * 10.0, dy * 10.0, 0.0)
    uniform1f(splatProgram, 'uRadius', cfg.splatRadius * 0.5)
    uniform1f(splatProgram, 'uAspectRatio', aspectRatio)
    bindFBO(velFBO_B)
    drawQuad()
    const temp1 = velFBO_A
    velFBO_A = velFBO_B
    velFBO_B = temp1

    // Inject dye (blue only, intensity proportional to speed)
    const speed = Math.sqrt(dx * dx + dy * dy)
    const dyeIntensity = Math.min(speed * 8.0, 1.0)
    bindTexture(0, dyeFBO_A.texture)
    uniform1i(splatProgram, 'uTarget', 0)
    uniform2f(splatProgram, 'uPoint', x, y)
    uniform3f(splatProgram, 'uColor', dyeIntensity * 0.3, dyeIntensity * 0.6, dyeIntensity)
    uniform1f(splatProgram, 'uRadius', cfg.splatRadius)
    uniform1f(splatProgram, 'uAspectRatio', aspectRatio)
    bindFBO(dyeFBO_B)
    drawQuad()
    const temp2 = dyeFBO_A
    dyeFBO_A = dyeFBO_B
    dyeFBO_B = temp2
  }

  /**
   * Inject a splat from external coordinates.
   * Used by navigation transition to create liquid expansion from button.
   */
  function injectSplat(x: number, y: number, strength: number = 1.0) {
    if (!gl || !running)
      return
    const angle = Math.random() * Math.PI * 2
    const dx = Math.cos(angle) * 0.1 * strength
    const dy = Math.sin(angle) * 0.1 * strength
    splat(x, y, dx, dy)
  }

  // ─── Render Loop ─────────────────────────────────

  function render() {
    if (!gl || !canvas)
      return

    handleResize()

    // Smooth open progress
    openProgress += (openTarget - openProgress) * 0.08

    // Only simulate when menu is opening/open
    if (openProgress > 0.01 && !cfg.reducedMotion) {
      const dt = 1.0 / 60.0

      // Inject mouse splat if moving fast enough
      const dx = mouseX - prevMouseX
      const dy = mouseY - prevMouseY
      const speed = Math.sqrt(dx * dx + dy * dy) * canvas.width
      if (speed > cfg.velocityThreshold) {
        splat(mouseX, mouseY, dx, dy)
      }
      prevMouseX = mouseX
      prevMouseY = mouseY

      step(dt)
    }

    // ── Display: render dye to screen ──
    bindFBO(null)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    if (dyeFBO_A && displayProgram && openProgress > 0.01) {
      gl.useProgram(displayProgram)
      bindTexture(0, dyeFBO_A.texture)
      uniform1i(displayProgram, 'uDye', 0)
      uniform1f(displayProgram, 'uMaxOpacity', cfg.maxOpacity * openProgress)
      drawQuad()
    }

    if (running)
      animationId = requestAnimationFrame(render)
  }

  function handleResize() {
    if (!canvas || !gl)
      return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.floor(canvas.clientWidth * dpr)
    const height = Math.floor(canvas.clientHeight * dpr)
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
  }

  // ─── Read flow intensity at a point (for displacement coupling) ──

  function getFlowIntensity(): number {
    if (!gl || !dyeFBO_A)
      return 0
    // Read center pixel of dye texture (rough average)
    if (!dyeReadBuffer)
      dyeReadBuffer = new Float32Array(4)
    gl.bindFramebuffer(gl.FRAMEBUFFER, dyeFBO_A.framebuffer)
    // Sample at mouse position
    const px = Math.floor(mouseX * dyeFBO_A.width)
    const py = Math.floor(mouseY * dyeFBO_A.height)
    gl.readPixels(px, py, 1, 1, gl.RGBA, gl.FLOAT, dyeReadBuffer)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    return Math.min(Math.sqrt(
      dyeReadBuffer[0] * dyeReadBuffer[0]
      + dyeReadBuffer[1] * dyeReadBuffer[1]
      + dyeReadBuffer[2] * dyeReadBuffer[2],
    ), 1.0)
  }

  // ─── Public API ──────────────────────────────────

  function init(canvasEl: HTMLCanvasElement): boolean {
    canvas = canvasEl
    gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    }) as WebGL2RenderingContext | null

    if (!gl) {
      console.warn('[flow] WebGL2 not supported')
      return false
    }

    // Check for float texture support
    const ext = gl.getExtension('EXT_color_buffer_float')
    if (!ext) {
      console.warn('[flow] EXT_color_buffer_float not supported')
      return false
    }

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // Compile all shader programs
    advectProgram = createProgram(advectFrag)
    divergenceProgram = createProgram(divergenceFrag)
    pressureProgram = createProgram(pressureFrag)
    gradientProgram = createProgram(gradientFrag)
    splatProgram = createProgram(splatFrag)
    vorticityProgram = createProgram(vorticityFrag)
    vorticityForceProgram = createProgram(vorticityForceFrag)
    displayProgram = createProgram(displayFrag)

    if (!advectProgram || !divergenceProgram || !pressureProgram
      || !gradientProgram || !splatProgram || !displayProgram
      || !vorticityProgram || !vorticityForceProgram) {
      console.error('[flow] Failed to compile one or more shaders')
      return false
    }

    // Create quad VAO
    vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1,
      -1,
      1,
      -1,
      -1,
      1,
      -1,
      1,
      1,
      -1,
      1,
      1,
    ]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.bindVertexArray(null)

    handleResize()

    // Create FBOs
    velFBO_A = createFBO(SIM_RES, SIM_RES, gl.RG16F, gl.RG, gl.HALF_FLOAT)
    velFBO_B = createFBO(SIM_RES, SIM_RES, gl.RG16F, gl.RG, gl.HALF_FLOAT)
    dyeFBO_A = createFBO(DYE_RES, DYE_RES, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT)
    dyeFBO_B = createFBO(DYE_RES, DYE_RES, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT)
    divFBO = createFBO(SIM_RES, SIM_RES, gl.R16F, gl.RED, gl.HALF_FLOAT)
    pressureFBO_A = createFBO(SIM_RES, SIM_RES, gl.R16F, gl.RED, gl.HALF_FLOAT)
    pressureFBO_B = createFBO(SIM_RES, SIM_RES, gl.R16F, gl.RED, gl.HALF_FLOAT)
    vorticityFBO = createFBO(SIM_RES, SIM_RES, gl.R16F, gl.RED, gl.HALF_FLOAT)

    return true
  }

  function start() {
    if (!gl || running)
      return
    running = true
    animationId = requestAnimationFrame(render)
    window.addEventListener('resize', handleResize)
  }

  function stop() {
    running = false
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', handleResize)
  }

  function setMouse(x: number, y: number, _vx: number, _vy: number) {
    mouseX = x
    mouseY = y
  }

  function setOpenProgress(target: number) {
    openTarget = target
  }

  function destroy() {
    stop()
    if (gl) {
      const fbos = [velFBO_A, velFBO_B, dyeFBO_A, dyeFBO_B, divFBO, pressureFBO_A, pressureFBO_B, vorticityFBO]
      for (const fbo of fbos) {
        if (fbo) {
          gl.deleteTexture(fbo.texture)
          gl.deleteFramebuffer(fbo.framebuffer)
        }
      }
      const programs = [advectProgram, divergenceProgram, pressureProgram, gradientProgram, splatProgram, vorticityProgram, vorticityForceProgram, displayProgram]
      for (const prog of programs) {
        if (prog)
          gl.deleteProgram(prog)
      }
      if (vao)
        gl.deleteVertexArray(vao)
      if (vertexBuffer)
        gl.deleteBuffer(vertexBuffer)
    }
    gl = null
    canvas = null
  }

  return {
    init,
    start,
    stop,
    destroy,
    resize: handleResize,
    setMouse,
    setOpenProgress,
    getFlowIntensity,
    injectSplat,
  }
}
