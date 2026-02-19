/**
 * WebGL2 Glass Shader — Liquid glass SDF with fBm edge perturbation
 * Renders a rounded-rectangle shape with organic wave boundaries,
 * semi-translucent glass tint, and surface tension meniscus.
 */

interface GlassConfig {
  ior: number
  waveAmplitude: number
  lensRadius: number
  dropletCount: number
  reducedMotion: boolean
}

const defaultGlassConfig: GlassConfig = {
  ior: 1.45,
  waveAmplitude: 12,
  lensRadius: 160,
  dropletCount: 10,
  reducedMotion: false,
}

interface FBO {
  texture: WebGLTexture
  framebuffer: WebGLFramebuffer
  width: number
  height: number
}

// ─── GLSL Shaders (ES 3.00) ─────────────────────────

const vertexShaderSource = /* glsl */ `#version 300 es
precision highp float;

in vec2 aPosition;
out vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const fragmentShaderSource = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uMouseVelocity;
uniform float uOpenProgress;
uniform float uScrollY;
uniform int uIsDesktop;
uniform sampler2D uWakeTexture;
uniform int uDropletCount;

// ─── Hash & Noise helpers ────────────────────────────

float hash21(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));

  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  float frequency = 1.0;
  for (int i = 0; i < octaves; i++) {
    value += amplitude * noise(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// ─── SDF ─────────────────────────────────────────────

float sdRoundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// ─── Synthesized Background ─────────────────────────

vec3 synthesizedBackground(vec2 uv, float time) {
  vec3 base = vec3(0.04); // Near-black (#0A0A0A)
  float n = fbm(uv * 3.0 + time * 0.1, 3);
  vec3 blue = vec3(0.0, 0.28, 1.0);    // #0047FF
  vec3 cyan = vec3(0.0, 0.96, 1.0);    // #00F5FF
  vec3 purple = vec3(0.27, 0.0, 1.0);  // #4400FF
  vec3 accent = mix(blue, mix(cyan, purple, n), n);
  return base + accent * 0.08;
}

// ─── Caustic Light Pattern ──────────────────────────

float causticPattern(vec2 uv, float time) {
  float c = 0.0;
  c += sin(dot(uv, vec2(3.0, 7.0)) * 12.0 + time * 0.5) * 0.5 + 0.5;
  c += sin(dot(uv, vec2(-5.0, 3.0)) * 10.0 + time * 0.7) * 0.5 + 0.5;
  c += sin(dot(uv, vec2(4.0, -6.0)) * 14.0 + time * 0.3) * 0.5 + 0.5;
  c /= 3.0;
  return c * c; // Square for sharper caustic lines
}

// ─── SDF with noise (reusable for central differences) ──

float sdfWithNoise(vec2 p, vec2 halfSize, float cornerRadius, float waveAmp, vec2 noiseUv, float t) {
  float d = sdRoundedBox(p, halfSize, cornerRadius);
  float edgeNoise = fbm(noiseUv + t, 3) * 2.0 - 1.0;
  d += edgeNoise * waveAmp;
  return d;
}

// ─── SDF gradient (surface normal) via central differences ──

vec2 sdfNormal(vec2 pixel, vec2 halfSize, float cornerRadius, float waveAmp, vec2 noiseUv, float t) {
  float eps = 1.5;
  vec2 center = uResolution * 0.5;
  float dx = sdfWithNoise(pixel - center + vec2(eps, 0.0), halfSize, cornerRadius, waveAmp, noiseUv, t)
           - sdfWithNoise(pixel - center - vec2(eps, 0.0), halfSize, cornerRadius, waveAmp, noiseUv, t);
  float dy = sdfWithNoise(pixel - center + vec2(0.0, eps), halfSize, cornerRadius, waveAmp, noiseUv, t)
           - sdfWithNoise(pixel - center - vec2(0.0, eps), halfSize, cornerRadius, waveAmp, noiseUv, t);
  return normalize(vec2(dx, dy));
}

// ─── UV refraction (Snell's law approximation) ──────

vec2 refractUV(vec2 uv, vec2 normal, float ior, float edgeDist) {
  // Strength proportional to proximity to edge (stronger refraction near SDF boundary)
  float strength = smoothstep(-40.0, 0.0, edgeDist);
  float offset = (1.0 / ior - 1.0) * strength * 0.03;
  return uv + normal * offset;
}

// ─── Condensation Droplets ──────────────────────────

const int MAX_DROPLETS = 12;

struct Droplet {
  vec2 basePos;
  float radius;
  float phase;
};

Droplet getDroplet(int i, float time) {
  float fi = float(i);
  Droplet d;
  float side = step(0.5, hash21(vec2(fi, 0.0)));
  d.basePos.x = mix(0.02, 0.12, hash21(vec2(fi, 1.0))) * (1.0 - side)
              + mix(0.2, 0.8, hash21(vec2(fi, 2.0))) * side;
  d.basePos.y = mix(0.3, 0.7, hash21(vec2(fi, 3.0))) * (1.0 - side)
              + mix(0.88, 0.98, hash21(vec2(fi, 4.0))) * side;
  d.basePos.y += time * 0.0003 * (1.0 + hash21(vec2(fi, 5.0)));
  d.basePos.y = fract(d.basePos.y);
  d.radius = mix(4.0, 16.0, hash21(vec2(fi, 6.0)));
  d.phase = hash21(vec2(fi, 7.0)) * 6.28;
  return d;
}

// ─── Main ────────────────────────────────────────────

void main() {
  vec2 uv = vUv;
  vec2 pixel = uv * uResolution;
  vec2 center = uResolution * 0.5;
  vec2 p = pixel - center;
  vec2 halfSize = center - 20.0;
  float cornerRadius = 24.0;

  // Organic edge perturbation via reusable SDF helper
  float t = uTime * 0.3;
  float waveAmp = 12.0 * uOpenProgress;
  vec2 noiseUv = uv * 8.0;

  float d;
  if (uIsDesktop == 1) {
    // Desktop: organic wave on left edge only
    float baseD = sdRoundedBox(p, halfSize, cornerRadius);
    float edgeNoise = fbm(noiseUv + t, 3) * 2.0 - 1.0;
    float leftEdgeDist = p.x + halfSize.x;
    float edgeMask = smoothstep(40.0, 0.0, leftEdgeDist);
    d = baseD + edgeNoise * waveAmp * edgeMask;
  } else {
    // Mobile: organic edges on all sides
    d = sdfWithNoise(p, halfSize, cornerRadius, waveAmp, noiseUv, t);
  }

  // Inside/edge masks
  float inside = 1.0 - smoothstep(-2.0, 0.0, d);
  float edgeFade = smoothstep(-40.0, -4.0, d); // 1 near edge, 0 deep inside

  // Glass body tint
  float baseTint = mix(0.1, 0.06, edgeFade); // thicker in center, thinner at edges
  vec3 glass = vec3(baseTint) * inside;

  // Simplified caustics on mobile
  float causticMult = uIsDesktop == 1 ? 0.04 : 0.02;

  // Caustic streaks (diagonal light bands)
  float streak = sin(dot(uv, vec2(1.5, 3.0)) * 20.0 + uTime * 0.2) * 0.5 + 0.5;
  streak *= smoothstep(-30.0, -5.0, d); // only inside glass
  glass += vec3(streak * causticMult);

  // Caustic light pattern (pool effect)
  float caustic = causticPattern(uv * 4.0, uTime);
  caustic *= smoothstep(-30.0, -5.0, d) * causticMult;
  glass += vec3(caustic);

  // ── Snell's law refraction with chromatic aberration ──

  // Compute surface normal from SDF gradient
  vec2 normalDir = sdfNormal(pixel, halfSize, cornerRadius, waveAmp, noiseUv, t);

  // Chromatic aberration: 3 refraction passes with different IOR
  vec2 uvR = refractUV(uv, normalDir, 1.42, d); // Red: less refraction
  vec2 uvG = refractUV(uv, normalDir, 1.45, d); // Green: medium
  vec2 uvB = refractUV(uv, normalDir, 1.48, d); // Blue: most refraction

  // ── Wake displacement (water ripples) ──────────────
  float wake = texture(uWakeTexture, uv).r;
  uvR += normalDir * wake * 0.012;
  uvG += normalDir * wake * 0.01;
  uvB += normalDir * wake * 0.008;

  // ── Mouse refraction lens ──────────────────────────
  vec2 mousePixel = uMouse * uResolution;
  float mouseDist = length(pixel - mousePixel);

  // Lens parameters (responsive)
  float lensRadius = uIsDesktop == 1 ? 160.0 : 120.0;
  float lensFactor = 1.0 - smoothstep(0.0, lensRadius, mouseDist);

  // Clear zone — inner 40% of lens = higher transparency
  float clearZone = 1.0 - smoothstep(0.0, lensRadius * 0.4, mouseDist);

  // Refraction boost — 1.5x inside lens
  float refractionBoost = 1.0 + lensFactor * 0.5;

  // Chromatic boost — 2x at lens boundary (ring-shaped)
  float chromaticBoost = smoothstep(lensRadius * 0.3, lensRadius * 0.6, mouseDist)
                       * (1.0 - smoothstep(lensRadius * 0.6, lensRadius, mouseDist));

  // Apply mouse lens boosts to refracted UVs
  vec2 mouseDir = normalize(pixel - mousePixel + 0.001);
  float lensRefract = lensFactor * 0.015;
  uvR += mouseDir * lensRefract * refractionBoost;
  uvG += mouseDir * lensRefract * refractionBoost * 0.8;
  uvB += mouseDir * lensRefract * refractionBoost * 0.6;

  // Extra chromatic split at lens boundary
  uvR += mouseDir * chromaticBoost * 0.008;
  uvB -= mouseDir * chromaticBoost * 0.008;

  // Sample background at each refracted UV
  float bgR = synthesizedBackground(uvR, uTime).r;
  float bgG = synthesizedBackground(uvG, uTime).g;
  float bgB = synthesizedBackground(uvB, uTime).b;
  vec3 refracted = vec3(bgR, bgG, bgB);

  // Apply glassTintMod — reduce glass tint in clear zone
  float glassTintMod = mix(1.0, 0.3, clearZone);
  float baseTintMod = mix(0.1, 0.06, edgeFade) * glassTintMod;
  vec3 glassMod = vec3(baseTintMod) * inside;

  // Background bleeds through at edges (refraction zones)
  float edgeReveal = edgeFade * 0.3; // 30% of background visible at edges

  // Refracted background (chromatic) instead of plain bg — using mouse-modified glass
  vec3 color = mix(glassMod, refracted, edgeReveal) * inside;
  // Add additional refraction visibility: slight refraction even in glass center
  color += refracted * inside * 0.15; // 15% of refracted bg always shows through

  // Surface tension meniscus
  float meniscus = exp(-abs(d) * 0.8) * 0.2;
  color += vec3(meniscus);

  // ─── Specular Highlights ───
  // Fresnel: brighter at glancing angles (near SDF edge)
  float fresnel = pow(1.0 - abs(dot(normalDir, vec2(0.0, 1.0))), 3.0);
  float specEdge = fresnel * smoothstep(-20.0, -2.0, d) * 0.25;

  // Top rim: bright line at very top of SDF
  float topRim = exp(-(pixel.y - (center.y - halfSize.y)) * 0.1)
               * smoothstep(-2.0, 0.0, d) * 0.2;

  // Mouse highlight: subtle hotspot near cursor
  float mouseHighlight = exp(-mouseDist * mouseDist / (80.0 * 80.0)) * 0.12;

  // Combine specular
  float specular = specEdge + topRim + mouseHighlight;

  // ─── Noise Grain ───
  float grain = hash21(uv * uResolution + uTime * 100.0) * 0.04;

  // ─── Shimmer ───
  float shimmer = sin(uv.x * 4.0 + uv.y * 2.0 + uTime * 0.5) * 0.5 + 0.5;
  shimmer *= sin(uv.x * 2.0 - uv.y * 3.0 + uTime * 0.3) * 0.5 + 0.5;
  shimmer *= smoothstep(-30.0, -5.0, d) * 0.03;

  // Final composition
  color += vec3(specular + grain + shimmer) * inside;

  // Alpha (keep existing meniscus + inside logic)
  float alpha = max(inside, meniscus * 0.5) * uOpenProgress;

  // ─── Condensation Droplets ───
  float dropletAlpha = 0.0;
  vec3 dropletColor = vec3(0.0);

  for (int i = 0; i < MAX_DROPLETS; i++) {
    if (i >= uDropletCount) break;
    Droplet drop = getDroplet(i, uTime);

    // Mouse scatter
    vec2 dropPixel = drop.basePos * uResolution;
    float mouseDistDrop = length(dropPixel - mousePixel);
    vec2 scatterDir = normalize(dropPixel - mousePixel + 0.001);
    float scatterAmt = smoothstep(100.0, 0.0, mouseDistDrop) * 30.0;
    dropPixel += scatterDir * scatterAmt;

    // Droplet SDF
    float dd = length(pixel - dropPixel) - drop.radius;
    float dropInside = 1.0 - smoothstep(-1.0, 0.0, dd);
    float dropMeniscus = exp(-abs(dd) * 1.5) * 0.3;

    // Mini refraction for each droplet
    vec2 dropUV = (dropPixel / uResolution);
    vec3 dropBg = synthesizedBackground(dropUV + normalize(pixel - dropPixel) * 0.01, uTime);

    dropletAlpha = max(dropletAlpha, dropInside * 0.6 + dropMeniscus);
    dropletColor = max(dropletColor, (dropBg * 0.5 + vec3(dropMeniscus)) * dropInside);
  }

  // Blend droplets with glass
  color += dropletColor;
  alpha = max(alpha, dropletAlpha * uOpenProgress);

  fragColor = vec4(color, alpha);
}
`

// ─── Wake Update Shader (wave equation propagation) ──

const wakeFragmentShaderSource = /* glsl */ `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform vec2 uTexelSize;
uniform vec2 uMousePos;
uniform float uMouseSpeed;
uniform float uDamping;

void main() {
  vec2 state = texture(uPrevState, vUv).rg;
  float height = state.r;
  float velocity = state.g;

  // Sample neighbors for wave equation (Laplacian)
  float left   = texture(uPrevState, vUv - vec2(uTexelSize.x, 0.0)).r;
  float right  = texture(uPrevState, vUv + vec2(uTexelSize.x, 0.0)).r;
  float top    = texture(uPrevState, vUv + vec2(0.0, uTexelSize.y)).r;
  float bottom = texture(uPrevState, vUv - vec2(0.0, uTexelSize.y)).r;

  // Wave equation: acceleration from neighbors
  float accel = (left + right + top + bottom) * 0.25 - height;
  velocity += accel * 2.0;
  velocity *= uDamping;
  height += velocity;

  // Add ripple at mouse position
  float mouseD = length(vUv - uMousePos);
  float ripple = exp(-mouseD * mouseD * 800.0) * uMouseSpeed * 0.3;
  height += ripple;

  fragColor = vec4(height, velocity, 0.0, 1.0);
}
`

// ─── Composable ──────────────────────────────────────

export function useGlassShader(config: Partial<GlassConfig> = {}) {
  const cfg = { ...defaultGlassConfig, ...config }

  let gl: WebGL2RenderingContext | null = null
  let canvas: HTMLCanvasElement | null = null
  let animationId = 0
  let startTime = 0
  let running = false

  // GL resources
  let program: WebGLProgram | null = null
  let vao: WebGLVertexArrayObject | null = null
  let vertexBuffer: WebGLBuffer | null = null

  // Uniform locations (main shader)
  let uResolution: WebGLUniformLocation | null = null
  let uTime: WebGLUniformLocation | null = null
  let uMouse: WebGLUniformLocation | null = null
  let uMouseVelocity: WebGLUniformLocation | null = null
  let uOpenProgress: WebGLUniformLocation | null = null
  let uScrollY: WebGLUniformLocation | null = null
  let uIsDesktop: WebGLUniformLocation | null = null
  let uWakeTexture: WebGLUniformLocation | null = null
  let uDropletCount: WebGLUniformLocation | null = null

  // Wake system (displacement ripples via ping-pong FBOs)
  let wakeFBO_A: FBO | null = null
  let wakeFBO_B: FBO | null = null
  let wakeProgram: WebGLProgram | null = null
  let wakeUniforms: Record<string, WebGLUniformLocation | null> = {}

  // Mutable state from external calls
  let mouseX = 0
  let mouseY = 0
  let mouseVX = 0
  let mouseVY = 0
  let openProgress = 0

  // Cached window dimensions (avoid reading window.innerWidth every frame)
  let cachedInnerWidth = 0

  // ─── Shader compilation ────────────────────────────

  function compileShader(type: number, source: string): WebGLShader | null {
    const shader = gl!.createShader(type)
    if (!shader)
      return null
    gl!.shaderSource(shader, source)
    gl!.compileShader(shader)
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      console.error('[glass] Shader compile error:', gl!.getShaderInfoLog(shader))
      gl!.deleteShader(shader)
      return null
    }
    return shader
  }

  function createProgramFromSource(vertSource: string, fragSource: string): WebGLProgram | null {
    const vs = compileShader(gl!.VERTEX_SHADER, vertSource)
    const fs = compileShader(gl!.FRAGMENT_SHADER, fragSource)
    if (!vs || !fs)
      return null

    const prog = gl!.createProgram()
    if (!prog)
      return null

    gl!.attachShader(prog, vs)
    gl!.attachShader(prog, fs)
    gl!.bindAttribLocation(prog, 0, 'aPosition')
    gl!.linkProgram(prog)

    if (!gl!.getProgramParameter(prog, gl!.LINK_STATUS)) {
      console.error('[glass] Program link error:', gl!.getProgramInfoLog(prog))
      gl!.deleteProgram(prog)
      return null
    }

    gl!.deleteShader(vs)
    gl!.deleteShader(fs)
    return prog
  }

  function getUniforms(prog: WebGLProgram, names: string[]): Record<string, WebGLUniformLocation | null> {
    const result: Record<string, WebGLUniformLocation | null> = {}
    for (const name of names) {
      result[name] = gl!.getUniformLocation(prog, name)
    }
    return result
  }

  function createFBO(w: number, h: number): FBO | null {
    if (!gl)
      return null
    const texture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, w, h, 0, gl.RG, gl.HALF_FLOAT, null)
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

  function createShaderProgram(): boolean {
    const vs = compileShader(gl!.VERTEX_SHADER, vertexShaderSource)
    const fs = compileShader(gl!.FRAGMENT_SHADER, fragmentShaderSource)
    if (!vs || !fs)
      return false

    program = gl!.createProgram()
    if (!program)
      return false

    gl!.attachShader(program, vs)
    gl!.attachShader(program, fs)
    gl!.bindAttribLocation(program, 0, 'aPosition')
    gl!.linkProgram(program)

    if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) {
      console.error('[glass] Program link error:', gl!.getProgramInfoLog(program))
      gl!.deleteProgram(program)
      program = null
      return false
    }

    // Clean up shader objects (linked into program already)
    gl!.deleteShader(vs)
    gl!.deleteShader(fs)

    // Cache uniform locations
    uResolution = gl!.getUniformLocation(program, 'uResolution')
    uTime = gl!.getUniformLocation(program, 'uTime')
    uMouse = gl!.getUniformLocation(program, 'uMouse')
    uMouseVelocity = gl!.getUniformLocation(program, 'uMouseVelocity')
    uOpenProgress = gl!.getUniformLocation(program, 'uOpenProgress')
    uScrollY = gl!.getUniformLocation(program, 'uScrollY')
    uIsDesktop = gl!.getUniformLocation(program, 'uIsDesktop')
    uWakeTexture = gl!.getUniformLocation(program, 'uWakeTexture')
    uDropletCount = gl!.getUniformLocation(program, 'uDropletCount')

    return true
  }

  // ─── Geometry (fullscreen quad via VAO) ────────────

  function createQuadVAO(): boolean {
    vao = gl!.createVertexArray()
    if (!vao)
      return false

    gl!.bindVertexArray(vao)

    vertexBuffer = gl!.createBuffer()
    gl!.bindBuffer(gl!.ARRAY_BUFFER, vertexBuffer)
    // Two triangles covering NDC -1..1
    gl!.bufferData(
      gl!.ARRAY_BUFFER,
      new Float32Array([
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
      ]),
      gl!.STATIC_DRAW,
    )

    gl!.enableVertexAttribArray(0)
    gl!.vertexAttribPointer(0, 2, gl!.FLOAT, false, 0, 0)

    gl!.bindVertexArray(null)
    return true
  }

  // ─── Render loop ───────────────────────────────────

  function render() {
    if (!gl || !program || !canvas)
      return

    const elapsed = cfg.reducedMotion ? 0 : (performance.now() - startTime) / 1000

    handleResize()

    // ── Pass 1: Update wake (write to FBO_B from FBO_A) ──
    if (wakeProgram && wakeFBO_A && wakeFBO_B) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, wakeFBO_B.framebuffer)
      gl.viewport(0, 0, wakeFBO_B.width, wakeFBO_B.height)

      gl.useProgram(wakeProgram)
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, wakeFBO_A.texture)
      gl.uniform1i(wakeUniforms.uPrevState!, 0)
      gl.uniform2f(wakeUniforms.uTexelSize!, 1.0 / wakeFBO_A.width, 1.0 / wakeFBO_A.height)
      gl.uniform2f(wakeUniforms.uMousePos!, mouseX, mouseY)
      gl.uniform1f(wakeUniforms.uMouseSpeed!, Math.sqrt(mouseVX * mouseVX + mouseVY * mouseVY) * 50)
      gl.uniform1f(wakeUniforms.uDamping!, 0.98)

      gl.bindVertexArray(vao)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
      gl.bindVertexArray(null)

      // Swap FBOs (ping-pong)
      const temp = wakeFBO_A
      wakeFBO_A = wakeFBO_B
      wakeFBO_B = temp
    }

    // ── Pass 2: Main glass render (to screen) ──
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)

    // Set uniforms
    gl.uniform2f(uResolution, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.uniform1f(uTime, elapsed)
    gl.uniform2f(uMouse, mouseX, mouseY)
    gl.uniform2f(uMouseVelocity, mouseVX, mouseVY)
    gl.uniform1f(uOpenProgress, openProgress)
    gl.uniform1f(uScrollY, 0)
    gl.uniform1i(uIsDesktop, cachedInnerWidth >= 1024 ? 1 : 0)
    gl.uniform1i(uDropletCount, cfg.dropletCount)

    // Bind wake texture for main shader
    if (wakeFBO_A) {
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, wakeFBO_A.texture)
      gl.uniform1i(uWakeTexture, 0)
    }

    gl.bindVertexArray(vao)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    gl.bindVertexArray(null)

    if (running)
      animationId = requestAnimationFrame(render)
  }

  // ─── DPR-aware resize ──────────────────────────────

  function handleResize() {
    if (!canvas || !gl)
      return
    cachedInnerWidth = window.innerWidth
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.floor(canvas.clientWidth * dpr)
    const height = Math.floor(canvas.clientHeight * dpr)
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height

      // Recreate wake FBOs at new half resolution
      const newWakeW = Math.floor(width / 2)
      const newWakeH = Math.floor(height / 2)
      if (wakeFBO_A && (wakeFBO_A.width !== newWakeW || wakeFBO_A.height !== newWakeH)) {
        gl.deleteTexture(wakeFBO_A.texture)
        gl.deleteFramebuffer(wakeFBO_A.framebuffer)
        if (wakeFBO_B) {
          gl.deleteTexture(wakeFBO_B.texture)
          gl.deleteFramebuffer(wakeFBO_B.framebuffer)
        }
        wakeFBO_A = createFBO(newWakeW, newWakeH)
        wakeFBO_B = createFBO(newWakeW, newWakeH)
      }
    }
  }

  // ─── Public API ────────────────────────────────────

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
      console.warn('[glass] WebGL2 not supported')
      return false
    }

    // Transparent blending
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    if (!createShaderProgram())
      return false

    if (!createQuadVAO())
      return false

    // Create wake program (wave equation propagation)
    wakeProgram = createProgramFromSource(vertexShaderSource, wakeFragmentShaderSource)
    if (wakeProgram) {
      wakeUniforms = getUniforms(wakeProgram, [
        'uPrevState',
        'uTexelSize',
        'uMousePos',
        'uMouseSpeed',
        'uDamping',
      ])
    }

    handleResize()

    // Create wake FBOs at half resolution
    const wakeW = Math.floor(canvas.width / 2)
    const wakeH = Math.floor(canvas.height / 2)
    wakeFBO_A = createFBO(wakeW, wakeH)
    wakeFBO_B = createFBO(wakeW, wakeH)

    return true
  }

  function start() {
    if (!gl || running)
      return
    running = true
    startTime = performance.now()
    animationId = requestAnimationFrame(render)
    window.addEventListener('resize', handleResize)
  }

  function stop() {
    running = false
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', handleResize)
  }

  function setMouse(x: number, y: number, vx: number, vy: number) {
    mouseX = x
    mouseY = y
    mouseVX = vx
    mouseVY = vy
  }

  function setOpenProgress(p: number) {
    openProgress = p
  }

  function destroy() {
    stop()
    if (gl) {
      if (wakeFBO_A) {
        gl.deleteTexture(wakeFBO_A.texture)
        gl.deleteFramebuffer(wakeFBO_A.framebuffer)
      }
      if (wakeFBO_B) {
        gl.deleteTexture(wakeFBO_B.texture)
        gl.deleteFramebuffer(wakeFBO_B.framebuffer)
      }
      if (wakeProgram)
        gl.deleteProgram(wakeProgram)
      if (vao)
        gl.deleteVertexArray(vao)
      if (vertexBuffer)
        gl.deleteBuffer(vertexBuffer)
      if (program)
        gl.deleteProgram(program)
    }
    wakeFBO_A = null
    wakeFBO_B = null
    wakeProgram = null
    wakeUniforms = {}
    vao = null
    vertexBuffer = null
    program = null
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
  }
}
