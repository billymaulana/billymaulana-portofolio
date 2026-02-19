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
  for (int i = 0; i < 3; i++) {
    if (i >= octaves) break;
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

// ─── Main ────────────────────────────────────────────

void main() {
  vec2 pixel = vUv * uResolution;
  vec2 center = uResolution * 0.5;
  vec2 p = pixel - center;
  vec2 halfSize = center - 20.0;
  float cornerRadius = 24.0;

  // Organic edge perturbation via fBm
  float t = uTime * 0.3;
  vec2 noiseCoord = vUv * 8.0 + t;
  float edgeNoise = fbm(noiseCoord, 3) * 2.0 - 1.0;
  float waveAmp = 12.0 * uOpenProgress;

  float d = sdRoundedBox(p, halfSize, cornerRadius) + edgeNoise * waveAmp;

  // Glass body — white semi-translucent tint inside SDF
  float inside = 1.0 - smoothstep(-2.0, 0.0, d);
  float baseTint = 0.1 * inside;

  // Surface tension meniscus — bright line at boundary
  float meniscus = exp(-abs(d) * 0.8) * 0.2;

  // Final output: glass tint + meniscus, alpha masked by SDF
  fragColor = vec4(vec3(baseTint + meniscus), inside * uOpenProgress);
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

  // Uniform locations
  let uResolution: WebGLUniformLocation | null = null
  let uTime: WebGLUniformLocation | null = null
  let uMouse: WebGLUniformLocation | null = null
  let uMouseVelocity: WebGLUniformLocation | null = null
  let uOpenProgress: WebGLUniformLocation | null = null
  let uScrollY: WebGLUniformLocation | null = null
  let uIsDesktop: WebGLUniformLocation | null = null

  // Mutable state from external calls
  let mouseX = 0
  let mouseY = 0
  let mouseVX = 0
  let mouseVY = 0
  let openProgress = 0

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

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)

    // Set uniforms
    const elapsed = cfg.reducedMotion ? 0 : (performance.now() - startTime) / 1000
    gl.uniform2f(uResolution, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.uniform1f(uTime, elapsed)
    gl.uniform2f(uMouse, mouseX, mouseY)
    gl.uniform2f(uMouseVelocity, mouseVX, mouseVY)
    gl.uniform1f(uOpenProgress, openProgress)
    gl.uniform1f(uScrollY, 0)
    gl.uniform1i(uIsDesktop, window.innerWidth >= 1024 ? 1 : 0)

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
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.floor(canvas.clientWidth * dpr)
    const height = Math.floor(canvas.clientHeight * dpr)
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
  }

  // ─── Public API ────────────────────────────────────

  function init(canvasEl: HTMLCanvasElement): boolean {
    canvas = canvasEl

    gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
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

    handleResize()
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
      if (vao)
        gl.deleteVertexArray(vao)
      if (vertexBuffer)
        gl.deleteBuffer(vertexBuffer)
      if (program)
        gl.deleteProgram(program)
    }
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
