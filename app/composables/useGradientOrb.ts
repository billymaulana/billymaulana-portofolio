interface GradientOrbAPI {
  init: (canvas: HTMLCanvasElement) => boolean
  setScale: (value: number) => void
  setEnergy: (value: number) => void
  resize: () => void
  destroy: () => void
}

const DPR_CAP = 1.5
const DRIFT_BASE_SPEED = 1
const DRIFT_ENERGY_GAIN = 1.5

const VERTEX_SOURCE = /* glsl */ `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

const FRAGMENT_SOURCE = /* glsl */ `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform float uScale;
uniform float uEnergy;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

vec3 spot(vec2 uv, vec2 center, float sigma, vec3 color) {
  float d = length(uv - center);
  return color * exp(-(d * d) / (2.0 * sigma * sigma));
}

void main() {
  vec2 uv = (gl_FragCoord.xy * 2.0 - uResolution) / min(uResolution.x, uResolution.y);
  vec2 c1 = 0.28 * vec2(sin(uTime * 0.31), sin(uTime * 0.47 + 1.6));
  vec2 c2 = 0.34 * vec2(sin(uTime * 0.23 + 2.1), sin(uTime * 0.37 + 4.0));
  vec2 c3 = 0.30 * vec2(sin(uTime * 0.41 + 5.3), sin(uTime * 0.29 + 0.7));
  vec3 col = spot(uv, c1, 0.34, vec3(0.631, 0.878, 0.906));
  col += spot(uv, c2, 0.44, vec3(0.0, 0.278, 1.0));
  col += spot(uv, c3, 0.52, vec3(0.290, 0.165, 0.502));
  col *= 1.0 + 0.8 * uEnergy;
  col *= 1.0 - smoothstep(0.30 * uScale, 0.92 * uScale, length(uv));
  /* dither +-1/255: tanpa ini gradien gelap menampilkan banding 8-bit */
  col += (hash(gl_FragCoord.xy + fract(uTime) * 61.7) - 0.5) / 127.5;
  gl_FragColor = vec4(col, 1.0);
}
`

export function useGradientOrb(): GradientOrbAPI {
  let canvasEl: HTMLCanvasElement | null = null
  let gl: WebGLRenderingContext | null = null
  let rafId: number | null = null
  let looping = false
  let lastFrameMs = 0
  let driftTime = 0
  let scale = 1
  let energy = 0
  let uResolution: WebGLUniformLocation | null = null
  let uTime: WebGLUniformLocation | null = null
  let uScale: WebGLUniformLocation | null = null
  let uEnergy: WebGLUniformLocation | null = null

  function compileShader(context: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
    const shader = context.createShader(type)
    if (!shader)
      return null
    context.shaderSource(shader, source)
    context.compileShader(shader)
    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
      context.deleteShader(shader)
      return null
    }
    return shader
  }

  function sizeCanvas() {
    if (!canvasEl || !gl)
      return
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP)
    const width = Math.max(1, Math.round(canvasEl.clientWidth * dpr))
    const height = Math.max(1, Math.round(canvasEl.clientHeight * dpr))
    if (canvasEl.width !== width || canvasEl.height !== height) {
      canvasEl.width = width
      canvasEl.height = height
    }
    gl.viewport(0, 0, width, height)
  }

  function renderFrame() {
    if (!gl)
      return
    gl.uniform2f(uResolution, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.uniform1f(uTime, driftTime)
    gl.uniform1f(uScale, scale)
    gl.uniform1f(uEnergy, energy)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  function loop(nowMs: number) {
    if (!looping)
      return
    rafId = requestAnimationFrame(loop)
    const dt = Math.min((nowMs - lastFrameMs) / 1000, 0.05)
    lastFrameMs = nowMs
    driftTime += dt * (DRIFT_BASE_SPEED + DRIFT_ENERGY_GAIN * energy)
    renderFrame()
  }

  function init(canvas: HTMLCanvasElement): boolean {
    /* alpha: false — latar hitam shader menjadi transparan lewat
       mix-blend-mode: screen pada wrapper, tanpa premultiplied edge */
    const context = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    })
    if (!context)
      return false

    const vertex = compileShader(context, context.VERTEX_SHADER, VERTEX_SOURCE)
    const fragment = compileShader(context, context.FRAGMENT_SHADER, FRAGMENT_SOURCE)
    const program = context.createProgram()
    if (!vertex || !fragment || !program)
      return false
    context.attachShader(program, vertex)
    context.attachShader(program, fragment)
    context.linkProgram(program)
    if (!context.getProgramParameter(program, context.LINK_STATUS))
      return false
    context.useProgram(program)

    const buffer = context.createBuffer()
    context.bindBuffer(context.ARRAY_BUFFER, buffer)
    context.bufferData(context.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), context.STATIC_DRAW)
    const aPosition = context.getAttribLocation(program, 'aPosition')
    context.enableVertexAttribArray(aPosition)
    context.vertexAttribPointer(aPosition, 2, context.FLOAT, false, 0, 0)

    uResolution = context.getUniformLocation(program, 'uResolution')
    uTime = context.getUniformLocation(program, 'uTime')
    uScale = context.getUniformLocation(program, 'uScale')
    uEnergy = context.getUniformLocation(program, 'uEnergy')

    canvasEl = canvas
    gl = context
    sizeCanvas()

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      renderFrame()
      return true
    }

    looping = true
    lastFrameMs = performance.now()
    rafId = requestAnimationFrame(loop)
    return true
  }

  function setScale(value: number) {
    scale = value
  }

  function setEnergy(value: number) {
    energy = value
  }

  function resize() {
    if (!gl)
      return
    sizeCanvas()
    if (!looping)
      renderFrame()
  }

  function destroy() {
    looping = false
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    gl = null
    canvasEl = null
    uResolution = null
    uTime = null
    uScale = null
    uEnergy = null
  }

  return { init, setScale, setEnergy, resize, destroy }
}
