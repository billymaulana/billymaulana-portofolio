<script setup lang="ts">
import gsap from 'gsap'

definePageMeta({
  standalone: true,
})

useSeoMeta({
  title: 'Explore — Concept 2',
  robots: 'noindex',
})

/* Rute ini sengaja mandiri: seluruh engine, state, dan style yang dipakainya tinggal di
   file ini. Tidak ada composable, constant, atau token CSS global yang dirujuk, sehingga menghapus
   satu file ini menghapus seluruh eksplorasi tanpa meninggalkan sisa di mana pun. */

/* ── engine: warp tipografi ─────────────────────────────────── */
/**
 * WebGL Text Distortion Effect
 * Renders text to offscreen canvas, applies GPU liquid displacement
 * with flowmap-based ink ripple and chromatic aberration.
 *
 * Inspired by: daspritam.in (ink chroma), supersolid.agency (glitch liquid),
 * crz.digital (liquid splash proximity).
 *
 * Key principle: small displacement + strong chromatic = liquid ink look.
 * Text must WARP visibly, never disappear.
 */

interface DistortionConfig {
  fontSize: number
  fontWeight: number
  fontFamily: string
  radius: number
  intensity: number
  chromaticSpread: number
  lines: { text: string, indent: number }[]
  /* Override rasterisasi teks. Shader warp hanya butuh sebuah texture, jadi
     caller boleh menggambar sendiri (mis. masthead dua-font Switzer +
     Cormorant italik) selama origin baris kiri berhimpit dengan tepi kiri
     canvas — updateFontSize memanggilnya ulang dengan fontSize terkini */
  renderText?: (fontSize: number) => HTMLCanvasElement
}

const defaultDistortionConfig: DistortionConfig = {
  fontSize: 200,
  fontWeight: 700,
  fontFamily: '\'Switzer\', \'Helvetica Neue\', sans-serif',
  radius: 0.25,
  intensity: 0.08,
  chromaticSpread: 0.02,
  lines: [
    { text: 'BILLY', indent: 0 },
    { text: 'MAULANA', indent: 0 },
  ],
}

const distortionVertexShader = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`

const distortionFragmentShader = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;

  uniform sampler2D uText;
  uniform vec2 uMouse;
  uniform float uRadius;
  uniform float uIntensity;
  uniform float uChromatic;
  uniform float uTime;
  uniform float uSettle;
  uniform float uHover;
  uniform float uVelocity;
  uniform vec2 uResolution;

  // Gradient noise
  vec2 hash22(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash22(i), f), dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  // Fractal Brownian Motion — organic ink flow
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    vec2 shift = vec2(100.0);
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = p * 2.0 + shift;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;

    // Velocity boost — noticeable but liquid-like response
    float velBoost = 1.0 + uVelocity * 2.0;

    // Dynamic radius expands with velocity
    float dynamicRadius = uRadius * (1.0 + uVelocity * 0.4);

    // No idle effect — text is static until mouse interacts
    vec2 idleUndulation = vec2(0.0);
    float idleFactor = 0.0;

    // Entrance noise — organic reveal
    float entranceNoise = (1.0 - uSettle) * 0.02;
    vec2 entranceOffset = vec2(
      noise(uv * 8.0 + uTime * 0.5) * entranceNoise,
      noise(uv * 8.0 + uTime * 0.5 + 100.0) * entranceNoise
    );

    // ── Cursor interaction ──
    vec2 mouseUv = uMouse;
    vec2 diff = uv - mouseUv;
    diff.x *= aspect;
    float dist = length(diff);

    // Liquid blob falloff — soft outer halo + sharp inner core
    float outerInfluence = smoothstep(dynamicRadius * 1.5, dynamicRadius * 0.3, dist) * uHover;
    float innerInfluence = pow(smoothstep(dynamicRadius, 0.0, dist), 0.6) * uHover;
    float influence = mix(outerInfluence, innerInfluence, 0.6);

    // Flow direction from cursor
    vec2 flowDir = normalize(diff + 0.001);

    // Perpendicular swirl direction — liquid rotates around cursor
    vec2 perpDir = vec2(-flowDir.y, flowDir.x);

    // Organic vortex via FBM — layered turbulence
    float swirlAngle = fbm(uv * 6.0 + uTime * 0.25) * 3.14159;
    vec2 swirlDir = vec2(cos(swirlAngle), sin(swirlAngle));

    // Ripple waves — liquid surface tension
    float ripple = sin(dist * 12.0 - uTime * 3.0) * 0.08 * influence;

    // Turbulent micro-displacement via fbm — organic motion
    float turbX = fbm(uv * 10.0 + uTime * 0.25) * 0.12 * influence;
    float turbY = fbm(uv * 10.0 + uTime * 0.25 + 50.0) * 0.12 * influence;

    // Combine: visible liquid flow without glitch
    vec2 displacement = vec2(0.0);
    displacement += flowDir * influence * 0.12;        // push from cursor
    displacement += perpDir * influence * 0.25;        // perpendicular flow
    displacement += swirlDir * influence * 0.35;       // organic swirl
    displacement += flowDir * ripple;                  // surface ripple
    displacement += vec2(turbX, turbY);                // micro-turbulence
    displacement *= uIntensity * velBoost;

    vec2 totalOffset = displacement + entranceOffset + idleUndulation;

    // ── Chromatic aberration — ink iridescence ──
    // Angle follows cursor for directional rainbow
    float chromAngle = atan(diff.y, diff.x) + uTime * 0.15;
    vec2 chromDir = vec2(cos(chromAngle), sin(chromAngle));

    // Secondary chromatic axis — perpendicular for richer split
    vec2 chromDir2 = vec2(-chromDir.y, chromDir.x);

    float idleChromatic = idleFactor * 2.0;
    float chromaticAmount = uChromatic * (influence * 3.0 * velBoost + (1.0 - uSettle) * 1.0) + idleChromatic;

    // Cool-toned chromatic — blue/cyan dominant, minimal red fringing
    vec2 rOffset = totalOffset + chromDir * chromaticAmount * 0.25 + chromDir2 * chromaticAmount * 0.08;
    vec2 gOffset = totalOffset;
    vec2 bOffset = totalOffset - chromDir * chromaticAmount - chromDir2 * chromaticAmount * 0.3;

    float r = texture2D(uText, uv + rOffset).r;
    float g = texture2D(uText, uv + gOffset).g;
    float b = texture2D(uText, uv + bOffset).b;

    // Alpha combines all three channels for full coverage
    float a = texture2D(uText, uv + gOffset).a;
    a = max(a, max(texture2D(uText, uv + rOffset).a, texture2D(uText, uv + bOffset).a));

    gl_FragColor = vec4(r * a, g * a, b * a, a);
  }
`

function useHeroTextWarp(config: Partial<DistortionConfig> = {}) {
  const cfg = {
    ...defaultDistortionConfig,
    ...config,
  }
  let gl: WebGL2RenderingContext | WebGLRenderingContext | null = null
  let canvas: HTMLCanvasElement | null = null
  let program: WebGLProgram | null = null
  const uniforms: Record<string, WebGLUniformLocation> = {}
  let textTexture: WebGLTexture | null = null
  let animationId = 0
  let startTime = 0

  let mouseX = 0.5
  let mouseY = 0.5
  let smoothMouseX = 0.5
  let smoothMouseY = 0.5
  let isHovering = false
  let smoothHover = 0
  let smoothVelocity = 0
  let settleProgress = 0
  let rawDeltaX = 0
  let rawDeltaY = 0
  let lastRawX = 0.5
  let lastRawY = 0.5

  function compileShader(type: number, source: string): WebGLShader | null {
    const shader = gl!.createShader(type)
    if (!shader)
      return null
    gl!.shaderSource(shader, source)
    gl!.compileShader(shader)
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      console.error('[textDistortion] Shader error:', gl!.getShaderInfoLog(shader))
      return null
    }
    return shader
  }

  function renderTextToCanvas(): HTMLCanvasElement {
    const offscreen = document.createElement('canvas')
    const ctx = offscreen.getContext('2d')!

    ctx.font = `${cfg.fontWeight} ${cfg.fontSize}px ${cfg.fontFamily}`

    const indentScale = cfg.fontSize / 200

    // Measure left-side bearing to compensate font whitespace.
    // actualBoundingBoxLeft < 0 means the visual edge is to the RIGHT of origin (LSB gap).
    let leftBearing = 0
    for (const line of cfg.lines) {
      if (line.indent === 0) {
        const metrics = ctx.measureText(line.text)
        if (metrics.actualBoundingBoxLeft < 0) {
          leftBearing = Math.max(leftBearing, -metrics.actualBoundingBoxLeft)
        }
      }
    }

    let maxWidth = 0
    for (const line of cfg.lines) {
      const metrics = ctx.measureText(line.text)
      const totalWidth = metrics.width + line.indent * indentScale
      maxWidth = Math.max(maxWidth, totalWidth)
    }

    const lineHeight = cfg.fontSize * 0.84
    const totalHeight = lineHeight * cfg.lines.length + cfg.fontSize * 0.2

    const bleed = cfg.fontSize * 0.02
    offscreen.width = Math.ceil(maxWidth - leftBearing + bleed)
    offscreen.height = Math.ceil(totalHeight + bleed)

    ctx.clearRect(0, 0, offscreen.width, offscreen.height)

    ctx.font = `${cfg.fontWeight} ${cfg.fontSize}px ${cfg.fontFamily}`
    ctx.fillStyle = '#ffffff'
    ctx.textBaseline = 'top'

    for (let i = 0; i < cfg.lines.length; i++) {
      const line = cfg.lines[i]!
      const x = line.indent * indentScale - leftBearing
      const y = i * lineHeight
      ctx.fillText(line.text, x, y)
    }

    return offscreen
  }

  function renderSource(): HTMLCanvasElement {
    return cfg.renderText
      ? cfg.renderText(cfg.fontSize)
      : renderTextToCanvas()
  }

  function createTexture(source: HTMLCanvasElement): WebGLTexture | null {
    const tex = gl!.createTexture()
    if (!tex)
      return null
    gl!.bindTexture(gl!.TEXTURE_2D, tex)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
    gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, true)
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, source)
    gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, false)
    return tex
  }

  function render() {
    if (!gl || !program || !canvas)
      return

    const now = (Date.now() - startTime) / 1000

    // Liquid mouse tracking — responsive but with viscous drag
    smoothMouseX += (mouseX - smoothMouseX) * 0.14
    smoothMouseY += (mouseY - smoothMouseY) * 0.14
    smoothHover += ((isHovering ? 1 : 0) - smoothHover) * 0.15

    // Track mouse velocity from raw deltas for dynamic intensity
    const rawVelocity = Math.sqrt(rawDeltaX * rawDeltaX + rawDeltaY * rawDeltaY)
    const targetVel = Math.min(rawVelocity * 8, 1.0)
    // Asymmetric smoothing: fast attack, slow decay for viscous persistence
    const velLerp = targetVel > smoothVelocity
      ? 0.3
      : 0.05
    smoothVelocity += (targetVel - smoothVelocity) * velLerp
    rawDeltaX *= 0.45
    rawDeltaY *= 0.45

    settleProgress = Math.min(1.0, now / 0.8)
    const settleEased = 1.0 - (1.0 - settleProgress) ** 3

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textTexture)
    gl.uniform1i(uniforms.uText!, 0)
    gl.uniform2f(uniforms.uMouse!, smoothMouseX, smoothMouseY)
    gl.uniform1f(uniforms.uRadius!, cfg.radius)
    gl.uniform1f(uniforms.uIntensity!, cfg.intensity)
    gl.uniform1f(uniforms.uChromatic!, cfg.chromaticSpread)
    gl.uniform1f(uniforms.uTime!, now)
    gl.uniform1f(uniforms.uSettle!, settleEased)
    gl.uniform1f(uniforms.uHover!, smoothHover)
    gl.uniform1f(uniforms.uVelocity!, smoothVelocity)
    gl.uniform2f(uniforms.uResolution!, canvas.width, canvas.height)

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
    animationId = requestAnimationFrame(render)
  }

  function onPointerMove(e: PointerEvent) {
    if (!canvas)
      return
    const rect = canvas.getBoundingClientRect()
    const newX = (e.clientX - rect.left) / rect.width
    // Flip Y to match WebGL UV space (0 = bottom, 1 = top)
    const newY = 1.0 - (e.clientY - rect.top) / rect.height

    rawDeltaX = newX - lastRawX
    rawDeltaY = newY - lastRawY
    lastRawX = newX
    lastRawY = newY

    mouseX = newX
    mouseY = newY
    isHovering = newX >= 0 && newX <= 1 && newY >= 0 && newY <= 1
  }

  function handleResize() {
    if (!canvas || !gl)
      return

    // Render text first so we can set correct aspect-ratio before reading dimensions
    const textCanvas = renderSource()
    canvas.style.aspectRatio = `${textCanvas.width} / ${textCanvas.height}`

    const width = Math.floor(canvas.clientWidth)
    const height = Math.floor(canvas.clientHeight)
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height

      if (textTexture) {
        gl.bindTexture(gl.TEXTURE_2D, textTexture)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
      }
    }
  }

  function init(canvasEl: HTMLCanvasElement): boolean {
    canvas = canvasEl

    gl = canvas.getContext('webgl2', {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: true,
    }) as WebGL2RenderingContext

    if (!gl) {
      gl = canvas.getContext('webgl', {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: true,
      })
    }

    if (!gl) {
      console.warn('[textDistortion] WebGL not supported')
      return false
    }

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0.0, 0.0, 0.0, 0.0)

    const vs = compileShader(gl.VERTEX_SHADER, distortionVertexShader)
    const fs = compileShader(gl.FRAGMENT_SHADER, distortionFragmentShader)
    if (!vs || !fs)
      return false

    program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.bindAttribLocation(program, 0, 'aPosition')
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[textDistortion] Link error:', gl.getProgramInfoLog(program))
      return false
    }

    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
    for (let i = 0; i < uniformCount; i++) {
      const info = gl.getActiveUniform(program, i)!
      uniforms[info.name] = gl.getUniformLocation(program, info.name)!
    }

    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)

    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)

    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)

    handleResize()
    const textCanvas = renderSource()
    textTexture = createTexture(textCanvas)

    return true
  }

  function start() {
    if (!gl)
      return
    startTime = Date.now()
    settleProgress = 0
    render()
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    window.addEventListener('resize', handleResize)
  }

  function destroy() {
    cancelAnimationFrame(animationId)
    window.removeEventListener('pointermove', onPointerMove)
    window.removeEventListener('resize', handleResize)
    if (gl && textTexture)
      gl.deleteTexture(textTexture)
    if (gl && program)
      gl.deleteProgram(program)
    gl = null
    canvas = null
    program = null
  }

  function updateFontSize(newSize: number) {
    if (cfg.fontSize === newSize)
      return
    cfg.fontSize = newSize
    if (!canvas || !gl || !textTexture)
      return
    const textCanvas = renderSource()
    canvas.style.aspectRatio = `${textCanvas.width} / ${textCanvas.height}`
    canvas.width = Math.floor(canvas.clientWidth)
    canvas.height = Math.floor(canvas.clientHeight)
    gl.bindTexture(gl.TEXTURE_2D, textTexture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
  }

  return {
    init,
    start,
    destroy,
    updateFontSize,
  }
}

/* ── engine: simulasi fluida ─────────────────────────────────────────────── */
/**
 * useFluidSimulation — Faithful port of Pavel Dobryakov's WebGL-Fluid-Simulation
 * https://github.com/PavelDoGreat/WebGL-Fluid-Simulation (MIT License)
 *
 * Pipeline: Navier-Stokes velocity field → vorticity confinement → pressure solve →
 *           bilinear advection (dye + velocity) → bloom → sunrays → display
 *
 * Changes from original:
 * - Wrapped as Vue composable (init/resize/destroy)
 * - TypeScript strict types
 * - Mouse always tracks (no click-drag requirement — portfolio behavior)
 * - Dithering texture generated procedurally (no external PNG)
 * - No dat.GUI, no screenshot capture, no mobile promo
 */

interface FluidColor {
  r: number
  g: number
  b: number
}

interface FBO {
  texture: WebGLTexture
  fbo: WebGLFramebuffer
  width: number
  height: number
  texelSizeX: number
  texelSizeY: number
  attach: (id: number) => number
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

interface TextureObj {
  texture: WebGLTexture
  width: number
  height: number
  attach: (id: number) => number
}

interface GLFormats {
  formatRGBA: { internalFormat: number, format: number } | null
  formatRG: { internalFormat: number, format: number } | null
  formatR: { internalFormat: number, format: number } | null
  halfFloatTexType: number
  supportLinearFiltering: boolean
}

interface Pointer {
  id: number
  texcoordX: number
  texcoordY: number
  prevTexcoordX: number
  prevTexcoordY: number
  deltaX: number
  deltaY: number
  down: boolean
  moved: boolean
  seeded: boolean
  color: FluidColor
}

interface SplatSegment {
  fromX: number
  fromY: number
  toX: number
  toY: number
  deltaX: number
  deltaY: number
  color: FluidColor
}

const SCAN = {
  pitch: 4,
  bend: 40,
  duty: 0.56,
  gap: 0.18,
}
const COLD_CHROMA = 0.3
/* A thrown piece of the photograph covers half of its reach at a stored drag of `knee`. */
const DRAG = {
  knee: 160,
}

/* A harder touch breaks the photograph into shards, seven CSS px tall and three times as wide, laid in
   courses. Each shard is carried by the liquid under its centre, turned off the stroke by up to
   half of `spin` radians, and glows through the warm end of the ramp in proportion to how far it
   has been thrown. */
const SHATTER = {
  width: 21,
  height: 7,
  reach: 90,
  spin: 1.4,
  glow: 0.85,
  ember: [0.7, 0.985],
}

/* The other answers to a touch. `melt` lets each touched column of the photograph run down by
   up to `melt` CSS px, columns `column` CSS px wide, as heat would soften it; `echo` leaves four
   copies of the figure behind the stroke, spaced over `echo` CSS px and each a step colder;
   `liquid` bends the photograph through the liquid like glass, by `liquid` CSS px per unit of the
   heat's slope, so it warps hardest along the liquid's edges; `smear` drags each
   touched row out along the stroke, up to `smear` CSS px, into a pale streak; `wave` ripples the
   touched rows sideways by up to `wave` CSS px, like heat haze over water. */
const RIPPLE = {
  melt: 90,
  column: 3,
  echo: 150,
  liquid: 70,
  smear: 140,
  wave: 16,
}

const MOTIONS = [
  'wave',
  'shatter',
  'melt',
  'echo',
  'liquid',
  'smear',
  'still',
] as const

/* What the liquid itself looks like: the thermal ramp of the figure, its warm end only, its cold
   end only, cream smoke, or liquid chrome lit from the upper left. */
const LIQUIDS = [
  'thermal',
  'ember',
  'cold',
  'ink',
  'chrome',
] as const

/* Motion becomes heat. The figure is shown through the liquid's own ramp, read off a temperature
   plate graded in Photoshop (skin brightest, cloth and hair cooler, local contrast kept), between
   `lo` and `hi` with `gamma`. Heat added by the pointer closes up to `shift` of the distance to the
   top of the ramp, so cold parts gain the most and the face nears white without clipping; a part
   needs `lag` times its own coldness in heat before it starts to warm, so the face catches first
   and the hair and edges cool first. */
const INFRA = {
  lo: 0.16,
  hi: 0.8,
  gamma: 1.1,
  shift: 0.45,
  lag: 0.38,
}

/* How the name answers the liquid. `invert` leaves it to the masthead canvas, whose difference
   blend turns each letter into the negative of the ink under it; `marble` draws it on the stage,
   read back along the stored stroke by `displace` per unit of drag so the letters swirl with the
   ink, edged in the liquid's own hot colour where a sample `fringe` further along differs. */
const TEXT_MODES = [
  'invert',
  'marble',
] as const

const MARBLE = {
  displace: 0.001,
  fringe: 0.003,
}

/* A blurred look softens the temperature over `radius` CSS px, as a thermal camera's coarse sensor
   would, and steps it into `bands` with a faint line on each boundary. */
const THERMAL_BLUR = {
  radius: 9,
  bands: 9,
}

/* The heat the pointer leaves in the figure: moving across it at `full` CSS px per millisecond
   fills it in `fill` seconds, it falls to 1/e in `cool` seconds, and the warmed region spreads
   from where the pointer last crossed the figure at `spread` CSS px per second. */
const HEAT = {
  full: 1.2,
  fill: 0.35,
  cool: 1.7,
  spread: 760,
  start: 90,
}

/* Up to this many spans of the name can sit behind the figure; the display pass takes them as one
   uniform array. */
const BEHIND_SLOTS = 6

/* The masthead canvas is white text blended by difference, so over the ground it shows as this
   colour. Letters drawn behind the figure take the same value, worked back through the screen
   blend of the stage canvas. */
const GROUND = [6, 6, 16] as const

function useFluidSimulation() {
  // ── State ──
  let canvas: HTMLCanvasElement | null = null
  let gl: WebGL2RenderingContext | WebGLRenderingContext | null = null
  let ext: GLFormats | null = null
  let isWebGL2 = false
  let animFrameId = 0

  /* Kalibrasi perilaku fluid daspritam.in (decay multiplicative per-frame
     dikonversi ke bentuk divisive Pavel 1/(1+d*dt) pada dt 1/60):
     dye 0.93/frame -> 4.5 · velocity 0.90/frame -> 6.7 · curl 20 ·
     pressure iterations 3 · splat force deltaPx*5 ~ 7200 screen-normalized.
     Trail mati cepat = tidak ada akumulasi dye = tidak bisa blow-out putih */
  const config = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 512,
    /* 3.5, bukan 4.5 hasil konversi persis: trail butuh sisa napas ~1s agar
       smear terbaca sebagai air, bukan kilat. Clamp DYE_MAX tetap menjamin
       anti blow-out pada dissipation berapapun */
    DENSITY_DISSIPATION: 4.5,
    VELOCITY_DISSIPATION: 6.7,
    PRESSURE: 0.8,
    PRESSURE_ITERATIONS: 3,
    /* 14, bukan 20 forensik daspritam: tanpa shading, vorticity 20 masih
       menyisakan tendril keriting di tepi blob — referensi bertepi mulus */
    CURL: 14,
    SPLAT_RADIUS: 0.35,
    SPLAT_FORCE: 7200,
    /* Referensi daspritam tanpa shading/bloom/sunrays: normal-based shading
       memberi relief 3D kasar, sunrays flicker radial saat dye melewati
       threshold — keduanya sumber "kedip" dan tekstur berkerut */
    SHADING: false,
    COLORFUL: true,
    COLOR_UPDATE_SPEED: 10,
    PAUSED: false,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    TRANSPARENT: false,
    BLOOM: false,
    BLOOM_ITERATIONS: 8,
    BLOOM_RESOLUTION: 256,
    BLOOM_INTENSITY: 0.7,
    BLOOM_THRESHOLD: 0.8,
    BLOOM_SOFT_KNEE: 0.7,
    SUNRAYS: false,
    SUNRAYS_RESOLUTION: 196,
    SUNRAYS_WEIGHT: 1.0,
  }

  /* Dye di-clamp saat splat: dissipation cepat sekalipun, gerakan menetap di
     satu titik menumpuk deposit >1 dan bloom memutihkan layar. Clamp = plafon
     energi; velocity TIDAK di-clamp (butuh rentang ratusan, bertanda) */
  /* 0.85, bukan 1.0: hue cycling menumpuk deposit beda warna di titik dwell —
     ketiga channel mencapai plafon bersamaan = core memutih. Di bawah 1.0
     campuran tetap ber-tint dan bloom prefilter (threshold 0.8) nyaris diam */
  const DYE_MAX = 0.85
  const VELOCITY_CLAMP = 1e6
  /* Sub-splat interpolasi segmen: jarak antar deposit jauh di bawah FWHM
     gaussian radius 0.3 (~0.09 uv) supaya flick cepat tetap pita kontinu */
  const SPLAT_INTERP_SPACING = 0.02
  const MAX_SPLATS_PER_SEGMENT = 8
  /* 1.4, bukan 1.8: radius 0.35 menaikkan total deposit ~2x (terukur mean
     luminance 22 vs 11) — sustained sweep memenuhi layar dengan kabut,
     sedangkan referensi menjaga background tetap void */
  const DYE_SPLAT_MULT = 1.2

  // ── Pointers ──
  const pointers: Pointer[] = []
  let splatStack: number[] = []
  /* Cap 32: bila rAF macet (tab background) event menumpuk — segmen tertua
     dibuang daripada membanjiri GPU dengan ratusan splat sekali frame */
  const splatSegments: SplatSegment[] = []
  const MAX_QUEUED_SEGMENTS = 32

  // ── Programs ──
  let blurProgram: ProgramObj | null = null
  let copyProgram: ProgramObj | null = null
  let clearProgram: ProgramObj | null = null
  let colorProgram: ProgramObj | null = null
  let bloomPrefilterProgram: ProgramObj | null = null
  let bloomBlurProgram: ProgramObj | null = null
  let bloomFinalProgram: ProgramObj | null = null
  let sunraysMaskProgram: ProgramObj | null = null
  let sunraysProgram: ProgramObj | null = null
  let splatProgram: ProgramObj | null = null
  let advectionProgram: ProgramObj | null = null
  let divergenceProgram: ProgramObj | null = null
  let curlProgram: ProgramObj | null = null
  let vorticityProgram: ProgramObj | null = null
  let pressureProgram: ProgramObj | null = null
  let gradientSubtractProgram: ProgramObj | null = null
  let displayMaterial: MaterialObj | null = null

  // ── FBOs ──
  let dye: DoubleFBO | null = null
  let velocity: DoubleFBO | null = null
  let divergenceFBO: FBO | null = null
  let curlFBO: FBO | null = null
  let pressure: DoubleFBO | null = null
  let bloomFBO: FBO | null = null
  let bloomFramebuffers: FBO[] = []
  let sunraysFBO: FBO | null = null
  let sunraysTempFBO: FBO | null = null
  let ditheringTexture: TextureObj | null = null

  // ── Content display (mode displacement daspritam) ──
  let contentDisplayEnabled = false
  let contentDisplayProgram: ProgramObj | null = null
  let contentTexture: TextureObj | null = null
  let auxTexture: TextureObj | null = null
  let letterTexture: TextureObj | null = null
  let letterSource: HTMLCanvasElement | null = null
  const letterRect = [0, 0, 0, 0]
  let pointerGate: ((u: number, v: number) => boolean) | null = null

  const contentDisplay = {
    mode: 0,
    displace: 0.001,
    chromatic: 0.003,
    color: [0, 0.28, 1] as [number, number, number],
    whiteCore: 0.95,
    inkGain: 1,
    skinGain: 1,
    warm: 1,
    lookMode: 0,
    textMode: 0,
    heat: [0, 0, 0, 0] as [number, number, number, number],
    photo: 0,
    scan: 0,
    liquid: 0,
    motion: 0,
    reach: 0,
    behind: new Float32Array(BEHIND_SLOTS * 2).fill(2),
    letters: 0,
    shades: new Float32Array(12),
    shadeFade: [0, 0, 1] as [number, number, number],
  }

  function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '')
    const int = Number.parseInt(h.length === 3
      ? h.replace(/./g, c => c + c)
      : h, 16)
    return [(int >> 16 & 255) / 255, (int >> 8 & 255) / 255, (int & 255) / 255]
  }

  // ── Blit ──
  let blit: ((target: FBO | null, clear?: boolean) => void) | null = null

  // ── Timing ──
  let lastUpdateTime = Date.now()
  let colorUpdateTimer = 0.0

  // ══════════════════════════════════════════════════════════════════════
  // GLSL SHADER SOURCES
  // ══════════════════════════════════════════════════════════════════════

  const baseVertexShaderSource = `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
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

  const blurVertexShaderSource = `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    uniform vec2 texelSize;
    void main () {
        vUv = aPosition * 0.5 + 0.5;
        float offset = 1.33333333;
        vL = vUv - texelSize * offset;
        vR = vUv + texelSize * offset;
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `

  const blurShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    uniform sampler2D uTexture;
    void main () {
        vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
        sum += texture2D(uTexture, vL) * 0.35294117;
        sum += texture2D(uTexture, vR) * 0.35294117;
        gl_FragColor = sum;
    }
  `

  const copyShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
  `

  const clearShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;
    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
  `

  const colorShaderSource = `
    precision mediump float;
    uniform vec4 color;
    void main () {
        gl_FragColor = color;
    }
  `

  const displayShaderSource = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform sampler2D uBloom;
    uniform sampler2D uSunrays;
    uniform sampler2D uDithering;
    uniform vec2 ditherScale;
    uniform vec2 texelSize;

    vec3 linearToGamma (vec3 color) {
        color = max(color, vec3(0));
        return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
    }

    void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;

    #ifdef SHADING
        vec3 lc = texture2D(uTexture, vL).rgb;
        vec3 rc = texture2D(uTexture, vR).rgb;
        vec3 tc = texture2D(uTexture, vT).rgb;
        vec3 bc = texture2D(uTexture, vB).rgb;
        float dx = length(rc) - length(lc);
        float dy = length(tc) - length(bc);
        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
        vec3 l = vec3(0.0, 0.0, 1.0);
        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
        c *= diffuse;
    #endif

    #ifdef BLOOM
        vec3 bloom = texture2D(uBloom, vUv).rgb;
    #endif

    #ifdef SUNRAYS
        float sunrays = texture2D(uSunrays, vUv).r;
        c *= sunrays;
    #ifdef BLOOM
        bloom *= sunrays;
    #endif
    #endif

    #ifdef BLOOM
        float noise = texture2D(uDithering, vUv * ditherScale).r;
        noise = noise * 2.0 - 1.0;
        bloom += noise / 255.0;
        bloom = linearToGamma(bloom);
        c += bloom;
    #endif

        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
    }
  `

  const bloomPrefilterShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform vec3 curve;
    uniform float threshold;
    void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float br = max(c.r, max(c.g, c.b));
        float rq = clamp(br - curve.x, 0.0, curve.y);
        rq = curve.z * rq * rq;
        c *= max(rq, br - threshold) / max(br, 0.0001);
        gl_FragColor = vec4(c, 0.0);
    }
  `

  const bloomBlurShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL);
        sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT);
        sum += texture2D(uTexture, vB);
        sum *= 0.25;
        gl_FragColor = sum;
    }
  `

  const bloomFinalShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform float intensity;
    void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL);
        sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT);
        sum += texture2D(uTexture, vB);
        sum *= 0.25;
        gl_FragColor = sum * intensity;
    }
  `

  const sunraysMaskShaderSource = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    void main () {
        vec4 c = texture2D(uTexture, vUv);
        float br = max(c.r, max(c.g, c.b));
        c.a = 1.0 - min(max(br * 20.0, 0.0), 0.8);
        gl_FragColor = c;
    }
  `

  const sunraysShaderSource = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float weight;
    #define ITERATIONS 16
    void main () {
        float Density = 0.3;
        float Decay = 0.95;
        float Exposure = 0.7;
        vec2 coord = vUv;
        vec2 dir = vUv - 0.5;
        dir *= 1.0 / float(ITERATIONS) * Density;
        float illuminationDecay = 1.0;
        float color = texture2D(uTexture, vUv).a;
        for (int i = 0; i < ITERATIONS; i++) {
            coord -= dir;
            float col = texture2D(uTexture, coord).a;
            color += col * illuminationDecay * weight;
            illuminationDecay *= Decay;
        }
        gl_FragColor = vec4(color * Exposure, 0.0, 0.0, 1.0);
    }
  `

  const splatShaderSource = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;
    uniform float clampValue;
    void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 result = texture2D(uTarget, vUv).xyz + splat;
        /* Skala proporsional, bukan min() per-channel: min meratakan ketiga
           channel ke plafon yang sama sehingga titik dwell memutih abu-abu;
           skala mempertahankan rasio hue tinta */
        float peak = max(result.x, max(result.y, result.z));
        result *= peak > clampValue ? clampValue / peak : 1.0;
        gl_FragColor = vec4(result, 1.0);
    }
  `

  const advectionShaderSource = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform vec2 dyeTexelSize;
    uniform float dt;
    uniform float dissipation;

    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
    }

    void main () {
    #ifdef MANUAL_FILTERING
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        vec4 result = bilerp(uSource, coord, dyeTexelSize);
    #else
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
    #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
    }
  `

  const divergenceShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
  `

  const curlShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
    }
  `

  const vorticityShaderSource = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;
    void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel += force * dt;
        vel = min(max(vel, -1000.0), 1000.0);
        gl_FragColor = vec4(vel, 0.0, 1.0);
    }
  `

  const pressureShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float press = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(press, 0.0, 0.0, 1.0);
    }
  `

  const gradientSubtractShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(vel, 0.0, 1.0);
    }
  `

  /* Display pass daspritam: velocity fluid men-displace konten (uv - vel*0.001).
     Fringe chromatic R-vs-G/B (dulu merah+aqua) diganti tint dua-tone biru:
     TANDA aberration (hi-lo) memilih #0000ff (biru solid) vs #0061ff (azure),
     magnitudonya jadi kekuatan mix ke tepi huruf yang bergerak. */
  /* Buffer dye mode content menyimpan (vx, vy, presence): rg = vektor
     kecepatan (peta displacement, meluruh bersih), b = density presence 0..1
     penanda jejak kursor. Tiga mode display via uMode (semua parameter uniform
     supaya warna/displace/chromatic diubah dari config tanpa menyentuh GLSL):
       0 FAITHFUL — paritas mekanik daspritam: fluid invisible, teks meleleh +
         chromatic aberration; energi tepi diberi tint uColor (biru).
       1 DYE — tubuh cairan uColor terlihat dengan inti putih (non-daspritam).
       2 THERMAL — energi tepi (presence + speed) dipetakan lewat colormap
         termal 9-stop, dipakai identik dengan background heat field. */
  const contentDisplayShaderSource = `
    precision highp float;

    uniform sampler2D tMap;
    uniform sampler2D tAux;
    uniform sampler2D tFluid;
    uniform float uMode;
    uniform float uDisplace;
    uniform float uChromatic;
    uniform vec3 uColor;
    uniform float uWhite;
    uniform float uInkGain;
    uniform float uSkinGain;
    uniform float uWarm;
    uniform float uLook;
    uniform float uText;
    uniform float uClock;
    uniform vec3 uInfra;
    uniform vec4 uHeat;
    uniform float uPhoto;
    uniform float uScan;
    uniform float uLiquid;
    uniform float uMotion;
    uniform float uReach;
    uniform float uPx;
    uniform sampler2D tText;
    uniform vec4 uTextRect;
    uniform vec2 uBehind[${BEHIND_SLOTS}];
    uniform float uLetters;
    uniform vec2 uView;
    uniform vec4 uShade[3];
    uniform vec3 uShadeFade;
    varying vec2 vUv;

    const vec3 C0 = vec3(0.020, 0.020, 0.027);
    const vec3 C1 = vec3(0.059, 0.039, 0.447);
    const vec3 C2 = vec3(0.227, 0.102, 0.620);
    const vec3 C3 = vec3(0.420, 0.184, 0.784);
    const vec3 C4 = vec3(0.639, 0.169, 0.659);
    const vec3 C5 = vec3(0.831, 0.361, 0.431);
    const vec3 C6 = vec3(0.933, 0.541, 0.165);
    const vec3 C7 = vec3(0.973, 0.749, 0.153);
    const vec3 C8 = vec3(0.996, 0.898, 0.365);
    const vec3 C9 = vec3(0.999, 0.961, 0.702);
    const vec3 C10 = vec3(1.000, 0.996, 0.961);
    const float SCAN_PITCH = ${SCAN.pitch.toFixed(4)};
    const float SCAN_BEND = ${SCAN.bend.toFixed(4)};
    const float SCAN_DUTY = ${SCAN.duty.toFixed(4)};
    const float SCAN_GAP = ${SCAN.gap.toFixed(4)};
    const float COLD_CHROMA = ${COLD_CHROMA.toFixed(4)};
    const float DRAG_KNEE = ${DRAG.knee.toFixed(4)};
    const float MELT_COLUMN = ${RIPPLE.column.toFixed(4)};
    const vec2 SHARD = vec2(${SHATTER.width.toFixed(4)}, ${SHATTER.height.toFixed(4)});
    const float SHARD_SPIN = ${SHATTER.spin.toFixed(4)};
    const float SHARD_GLOW = ${SHATTER.glow.toFixed(4)};
    const float EMBER_LO = ${SHATTER.ember[0]!.toFixed(4)};
    const float EMBER_HI = ${SHATTER.ember[1]!.toFixed(4)};
    const float INFRA_SHIFT = ${INFRA.shift.toFixed(4)};
    const float MARBLE_DISPLACE = ${MARBLE.displace.toFixed(5)};
    const float MARBLE_FRINGE = ${MARBLE.fringe.toFixed(5)};
    const float BLUR_RADIUS = ${THERMAL_BLUR.radius.toFixed(4)};
    const float BLUR_BANDS = ${THERMAL_BLUR.bands.toFixed(4)};
    const float INFRA_LAG = ${INFRA.lag.toFixed(4)};
    const vec3 GROUND = vec3(${GROUND.map(channel => (channel / 255).toFixed(5)).join(', ')});

    float hash1(float n) {
      return fract(sin(n * 91.3458) * 47453.5453);
    }

    float noise1(float x) {
      float i = floor(x);
      float f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(hash1(i), hash1(i + 1.0), f);
    }

    vec3 thermal(float t) {
      t = clamp(t, 0.0, 1.0);
      if (t < 0.13) return mix(C0, C1, smoothstep(0.00, 0.13, t));
      if (t < 0.28) return mix(C1, C2, smoothstep(0.13, 0.28, t));
      if (t < 0.43) return mix(C2, C3, smoothstep(0.28, 0.43, t));
      if (t < 0.56) return mix(C3, C4, smoothstep(0.43, 0.56, t));
      if (t < 0.68) return mix(C4, C5, smoothstep(0.56, 0.68, t));
      if (t < 0.79) return mix(C5, C6, smoothstep(0.68, 0.79, t));
      if (t < 0.875) return mix(C6, C7, smoothstep(0.79, 0.875, t));
      if (t < 0.935) return mix(C7, C8, smoothstep(0.875, 0.935, t));
      if (t < 0.975) return mix(C8, C9, smoothstep(0.935, 0.975, t));
      return mix(C9, C10, smoothstep(0.975, 1.00, t));
    }

    vec3 figureColour(float t) {
      vec3 c = max(thermal(t) - C0, 0.0);
      float grey = dot(c, vec3(0.2126, 0.7152, 0.0722));
      return mix(vec3(grey), c, mix(COLD_CHROMA, 1.0, smoothstep(0.22, 0.50, t)));
    }

    float scanned(float t, float depth) {
      if (uScan < 0.5)
        return t;
      float y = gl_FragCoord.y * uPx - (depth - 0.5) * SCAN_BEND;
      float dist = abs(fract(y / SCAN_PITCH) - 0.5) * SCAN_PITCH;
      float halfWidth = SCAN_PITCH * SCAN_DUTY * 0.5;
      float aa = 0.6 * uPx;
      float line = 1.0 - smoothstep(halfWidth - aa, halfWidth + aa, dist);
      return mix(t - SCAN_GAP, t, line);
    }

    float grain(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    /* A second ramp for the speckled look: deep indigo through blue and cyan to a hard yellow,
       the palette of an older thermal sensor. */
    vec3 sensorColour(float t) {
      t = clamp(t, 0.0, 1.0);
      if (t < 0.3)
        return mix(vec3(0.03, 0.02, 0.18), vec3(0.14, 0.09, 0.58), smoothstep(0.0, 0.3, t));
      if (t < 0.5)
        return mix(vec3(0.14, 0.09, 0.58), vec3(0.08, 0.38, 0.98), smoothstep(0.3, 0.5, t));
      if (t < 0.68)
        return mix(vec3(0.08, 0.38, 0.98), vec3(0.22, 0.88, 0.98), smoothstep(0.5, 0.68, t));
      if (t < 0.86)
        return mix(vec3(0.22, 0.88, 0.98), vec3(0.96, 0.94, 0.24), smoothstep(0.68, 0.86, t));
      return mix(vec3(0.96, 0.94, 0.24), vec3(1.0, 0.98, 0.84), smoothstep(0.86, 1.0, t));
    }

    /* Temperature and matte averaged over a ring, for the blurred look. */
    vec2 softPlate(vec2 at) {
      vec2 r = vec2(BLUR_RADIUS) / uView;
      vec4 centre = texture2D(tMap, at);
      vec2 sum = vec2(centre.r * centre.r, centre.a) * 0.2;
      for (int i = 0; i < 8; i++) {
        float a = float(i) * 0.785398;
        vec4 ring = texture2D(tMap, at + vec2(cos(a), sin(a)) * r);
        sum += vec2(ring.r * ring.r, ring.a) * 0.1;
      }
      return sum;
    }

    float letterAt(vec2 at) {
      if (uTextRect.z <= 0.0)
        return 0.0;
      vec2 p = (at - uTextRect.xy) / uTextRect.zw;
      if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0)
        return 0.0;
      return texture2D(tText, p).a;
    }

    /* Whether this column of the name belongs to a letter that sits behind the figure. */
    float behindAt(vec2 at) {
      if (uTextRect.z <= 0.0)
        return 0.0;
      float x = (at.x - uTextRect.x) / uTextRect.z;
      float back = 0.0;
      for (int i = 0; i < ${BEHIND_SLOTS}; i++)
        back = max(back, step(uBehind[i].x, x) * step(x, uBehind[i].y));
      return back;
    }

    /* The figure at one point of the stage, seen in infrared: its temperature, square-root
       encoded in the content texture with the matte in alpha, read through the ramp and lifted by
       the heat the pointer has left there. A photograph shown in its own colours gives way to the
       same infrared wherever that heat is. The opening under the letters is read by the caller on
       the screen, because the photograph may slide while the letters stay put. */
    vec3 figureAt(vec2 at, float lift, float open, float boost) {
      vec4 plate = texture2D(tMap, at);
      float level = plate.r * plate.r;
      float cover = plate.a;
      if (uLook > 0.5 && uLook < 1.5) {
        vec2 soft = softPlate(at);
        level = soft.x;
        cover = soft.y;
      }
      float body = cover * uSkinGain * lift * open;
      float lag = INFRA_LAG * (1.0 - level);
      float rise = smoothstep(lag, lag + 0.3, boost) * boost;
      float rest = mix(uInfra.x, uInfra.y, pow(level, uInfra.z)) * mix(0.3, 1.0, uWarm);
      float t = rest + (1.0 - rest) * INFRA_SHIFT * rise;
      vec3 heat;
      if (uLook > 1.5) {
        heat = sensorColour(t + (grain(gl_FragCoord.xy) - 0.5) * 0.1) * body;
      }
      else if (uLook > 0.5) {
        float band = fract(clamp(t, 0.0, 1.0) * BLUR_BANDS);
        float banded = mix(t, (floor(t * BLUR_BANDS) + 0.5) / BLUR_BANDS, 0.5);
        float line = 1.0 - smoothstep(0.0, 0.07, min(band, 1.0 - band));
        heat = (figureColour(clamp(banded, 0.0, 1.0)) + line * 0.08) * body;
      }
      else {
        heat = figureColour(scanned(clamp(t, 0.0, 1.0), plate.g)) * body;
      }
      vec3 photo = texture2D(tAux, at).rgb * uSkinGain * lift * open;
      return mix(heat, photo, uPhoto * (1.0 - smoothstep(0.04, 0.5, rise)));
    }

    /* How far the piece of photograph under this pixel has moved, in CSS pixels, and how hot it
       is. The drag is read once per piece, at
       its centre, so its edges stay straight; it follows the stored stroke direction and fades
       with the ink, which is what brings the pieces back. A strip only slides sideways. */
    float heatAt(vec2 at) {
      vec3 ink = texture2D(tFluid, at).rgb;
      float raw = clamp(ink.b, 0.0, 1.6) * 0.62 + length(ink.rg) * 0.0042;
      return pow(1.0 - exp(-raw * uInkGain * uInkGain * 1.35), 0.62);
    }

    vec4 driftAt(vec2 px) {
      if (uMotion < 0.5 || uReach <= 0.0 || (uMotion > 2.5 && uMotion < 3.5) || (uMotion > 4.5 && uMotion < 5.5))
        return vec4(0.0);
      if (uMotion > 5.5) {
        vec2 at = px / uView;
        vec2 e = vec2(6.0) / uView;
        vec2 slope = vec2(heatAt(at + vec2(e.x, 0.0)) - heatAt(at - vec2(e.x, 0.0)), heatAt(at + vec2(0.0, e.y)) - heatAt(at - vec2(0.0, e.y)));
        float grip = smoothstep(0.02, 0.3, heatAt(at));
        return vec4(slope * uReach, grip * 0.3, 0.0);
      }
      if (uMotion > 3.5) {
        float swell = smoothstep(0.06, 0.5, clamp(texture2D(tFluid, vec2(vUv.x, px.y / uView.y)).b, 0.0, 1.3) * uInkGain);
        float wave = sin(px.y * 0.34 + uClock * 5.2) * 0.6 + sin(px.y * 0.11 - uClock * 2.3) * 0.4;
        return vec4(uReach * swell * wave, 0.0, swell * 0.55, 0.0);
      }
      if (uMotion < 1.5) {
        float column = floor(px.x / MELT_COLUMN);
        float x = (column + 0.5) * MELT_COLUMN / uView.x;
        float above = clamp(texture2D(tFluid, vec2(x, (px.y + uReach * 0.35) / uView.y)).b, 0.0, 1.3);
        float here = clamp(texture2D(tFluid, vec2(x, px.y / uView.y)).b, 0.0, 1.3);
        float grip = smoothstep(0.05, 0.5, max(above, here) * uInkGain);
        float drip = uReach * grip * mix(0.2, 1.0, hash1(column * 3.17 + 0.5)) * mix(0.55, 1.0, noise1(column * 0.37));
        return vec4(0.0, -drip, grip * 0.5, 0.0);
      }
      float course = floor(px.y / SHARD.y);
      float bond = mod(course, 2.0) * 0.5 * SHARD.x;
      vec2 cell = vec2(floor((px.x + bond) / SHARD.x), course);
      vec2 centre = vec2((cell.x + 0.5) * SHARD.x - bond, (cell.y + 0.5) * SHARD.y);
      vec3 drag = texture2D(tFluid, centre / uView).rgb;
      float grip = smoothstep(0.06, 0.55, clamp(drag.b, 0.0, 1.3) * uInkGain);
      if (grip <= 0.0)
        return vec4(0.0);
      vec2 thrown = drag.rg / (length(drag.rg) + DRAG_KNEE);
      float spin = (hash1(cell.x * 3.91 + cell.y * 17.3) - 0.5) * SHARD_SPIN;
      thrown = vec2(thrown.x * cos(spin) - thrown.y * sin(spin), thrown.x * sin(spin) + thrown.y * cos(spin));
      float weight = mix(0.35, 1.0, hash1(cell.x * 7.13 + cell.y * 31.7));
      vec2 move = uReach * weight * grip * thrown;
      float glow = clamp(length(thrown) * weight * 1.6, 0.0, 1.0) * grip;
      return vec4(move, glow, 0.0);
    }

    vec3 toStage(vec3 shown) {
      return clamp((shown - GROUND) / (1.0 - GROUND), 0.0, 1.0);
    }

    /* The colour of the liquid at a given heat, in the style asked for. Chrome takes its shape
       from the slope of the heat field and is lit from the upper left. */
    vec3 liquidColour(float h, vec2 at) {
      if (uLiquid < 0.5)
        return max(thermal(h) - C0, 0.0);
      if (uLiquid < 1.5)
        return max(thermal(mix(0.58, 1.0, h)) - C0, 0.0) * smoothstep(0.0, 0.25, h);
      if (uLiquid < 2.5)
        return max(thermal(h * 0.62) - C0, 0.0) * 1.2;
      if (uLiquid < 3.5)
        return (1.0 - GROUND) * pow(h, 1.3);
      vec2 e = vec2(1.5) / uView;
      float gx = heatAt(at + vec2(e.x, 0.0)) - heatAt(at - vec2(e.x, 0.0));
      float gy = heatAt(at + vec2(0.0, e.y)) - heatAt(at - vec2(0.0, e.y));
      vec3 n = normalize(vec3(-gx * 6.0, -gy * 6.0, 1.0));
      vec3 l = normalize(vec3(-0.45, 0.6, 0.65));
      float spec = pow(max(dot(reflect(-l, n), vec3(0.0, 0.0, 1.0)), 0.0), 28.0);
      float body = 0.12 + 0.55 * h * (0.4 + 0.6 * n.z);
      return vec3(body) * vec3(0.92, 0.94, 1.0) + spec * 0.9 * smoothstep(0.05, 0.3, h);
    }

    void main() {
      vec3 f = texture2D(tFluid, vUv).rgb;
      vec2 vel = f.rg;
      float presence = clamp(f.b, 0.0, 1.6);

      vec2 uv = vUv;
      vec2 uv2 = uv - vel * uDisplace;

      vec3 base = texture2D(tMap, uv2).rgb;

      vec2 shift = vel * uChromatic;
      vec3 sh = texture2D(tMap, vec2(uv.x - shift.x, uv.y + shift.y)).rgb;

      vec3 col;
      if (uMode < 0.5) {
        float aberr = clamp(length(sh - base), 0.0, 1.0);
        col = base + uColor * aberr;
      } else if (uMode < 1.5) {
        base.g = sh.g;
        base.b = sh.b;
        vec3 hue = mix(uColor, vec3(1.0), smoothstep(uWhite, uWhite + 0.4, presence));
        vec3 body = hue * smoothstep(0.0, 0.3, presence);
        float cover = smoothstep(0.04, 0.22, presence);
        col = mix(base, body, cover);
      } else {
        float speed = length(vel);
        /* Pemotongan keras di ujung panas memetakan semua energi di atas ambang
           ke warna identik, sehingga inti aliran runtuh jadi bidang cream rata
           dan detail yang sudah dihitung solver terbuang. Kurva eksponensial
           mendekati 1 tanpa pernah menyentuhnya — gradasi tetap hidup sampai
           piksel terpanas. */
        float raw = presence * 0.62 + speed * 0.0042;
        /* The ink arrives over the first second of movement. Its gain sits inside the curve:
           scaled after it, a fresh stroke whose core is already saturated lands on one value
           of the ramp and shows as a flat disc. */
        float heat = pow(1.0 - exp(-raw * uInkGain * uInkGain * 1.35), 0.62);
        float cover = smoothstep(0.015, 0.30, heat);

        /* The figure loses its light behind each small label that stands on it, so cloth of any
           colour ends up dark there and keeps its colour everywhere else. A shade is a property
           of the stage, not of the photograph, and the ink is not part of it. */
        float shade = 0.0;
        for (int i = 0; i < 3; i++) {
          vec4 s = uShade[i];
          float across = smoothstep(s.x - uShadeFade.x, s.x, uv.x) * (1.0 - smoothstep(s.y, s.y + uShadeFade.x, uv.x));
          float down = 1.0 - smoothstep(s.z, s.z + uShadeFade.y, uv.y);
          shade = max(shade, across * down * s.w);
        }
        float lift = mix(1.0, uShadeFade.z, shade);

        vec2 px = gl_FragCoord.xy * uPx;
        vec4 drift = driftAt(px);
        vec2 slid = uv - drift.xy / uView;
        vec2 mush = uText > 0.5
          ? vel * MARBLE_DISPLACE
          : vec2(0.0);
        float letter = letterAt(uv - mush) * (uText > 0.5 ? uLetters : 1.0);
        float back = behindAt(uv - mush);
        float open = 1.0 - letter * (1.0 - back);
        float matte = texture2D(tMap, slid).a * clamp(uSkinGain, 0.0, 1.0) * open;
        /* Heat in the figure: where the ink lies now, and the region the pointer has warmed,
           spreading from where it last crossed the figure. */
        float soaked = smoothstep(0.03, 0.45, presence * uInkGain);
        float warmed = (1.0 - smoothstep(uHeat.z * 0.55, uHeat.z, distance(px, uHeat.xy))) * uHeat.w;
        float boost = clamp(max(soaked, warmed), 0.0, 1.0);
        vec3 figure = figureAt(slid, lift, open, boost);
        if (matte > 0.001) {
          /* A thrown piece burns through the warm end of the ramp by its own brightness and keeps
             that brightness, so the hair stays dark with amber strands, a cheek turns amber and a
             highlight cream, and the face stays readable inside them. */
          if (drift.z > 0.001) {
            float glowTone = clamp(dot(figure, vec3(0.2126, 0.7152, 0.0722)) * 1.4, 0.0, 1.0);
            vec3 ember = max(thermal(mix(EMBER_LO, EMBER_HI, glowTone)) - C0, 0.0) * (0.18 + 0.82 * glowTone) * matte;
            figure = mix(figure, ember, drift.z * SHARD_GLOW);
          }
        }
        /* Echoes: copies of the figure left behind the stroke, each a step further and colder,
           like a thermal camera's stroboscope. */
        if (uMotion > 4.5 && uMotion < 5.5) {
          float grip = smoothstep(0.05, 0.5, presence * uInkGain);
          if (grip > 0.001) {
            vec2 toward = vel / (length(vel) + DRAG_KNEE);
            vec3 echoes = vec3(0.0);
            for (int i = 1; i <= 4; i++) {
              float k = float(i);
              vec2 at = slid + toward * uReach * k / 4.0 / uView;
              vec3 ghost = figureAt(at, lift, 1.0, boost);
              float tone = dot(ghost, vec3(0.2126, 0.7152, 0.0722));
              vec3 tinted = max(thermal(clamp(0.78 - 0.13 * k + 0.3 * tone, 0.0, 1.0)) - C0, 0.0) * texture2D(tMap, at).a;
              echoes = max(echoes, tinted * (1.0 - k * 0.16));
            }
            figure = mix(figure, max(figure, echoes), grip);
          }
        }

        /* A smeared row: the photograph read back along the stroke and averaged into a pale
           streak that can run past the figure's edge. */
        if (uMotion > 2.5 && uMotion < 3.5) {
          float row = floor(px.y / 2.0);
          vec3 stroke = texture2D(tFluid, vec2(vUv.x, (row + 0.5) * 2.0 / uView.y)).rgb;
          float grip = smoothstep(0.05, 0.5, clamp(stroke.b, 0.0, 1.3) * uInkGain);
          if (grip > 0.001) {
            float toward = stroke.r >= 0.0 ? 1.0 : -1.0;
            float reachPx = uReach * grip * mix(0.25, 1.0, hash1(row * 7.31 + 1.7));
            vec3 trail = vec3(0.0);
            for (int i = 1; i <= 6; i++)
              trail += figureAt(slid - vec2(toward * reachPx * float(i) / 6.0 / uView.x, 0.0), lift, 1.0, boost);
            trail /= 6.0;
            float pale = dot(trail, vec3(0.2126, 0.7152, 0.0722));
            figure = max(figure, mix(trail, vec3(pale) * vec3(1.0, 0.97, 0.9) * 1.3, 0.6) * grip);
          }
        }

        /* The name. Inverted, the masthead canvas draws the letters in front and only those behind
           the figure are laid here, at the negative the difference blend would give them. In
           marble, every letter is drawn here, cream with an accent-blue edge, and laid in front of
           or under the figure; both are worked back through the screen blend of this canvas. */
        vec3 under = liquidColour(heat, uv) * cover;
        if (uText < 0.5) {
          float behind = letter * back * uLetters;
          if (behind > 0.0)
            under = mix(under, toStage(1.0 - (under + GROUND - under * GROUND)), behind);
          col = figure + under * (1.0 - matte);
        }
        else {
          float rim = abs(letterAt(uv - vel * (MARBLE_DISPLACE + MARBLE_FRINGE)) * uLetters - letter);
          vec3 inked = toStage(1.0 - GROUND);
          vec3 edged = toStage(liquidColour(0.85, uv) + (1.0 - GROUND) * 0.15);
          under = mix(under, inked, letter * back);
          under = mix(under, edged, rim * back);
          col = figure + under * (1.0 - matte);
          col = mix(col, inked, letter * (1.0 - back));
          col = mix(col, edged, rim * (1.0 - back));
        }

        /* A half-step dither: the cold end of the ramp spans a few dozen 8-bit levels across
           hundreds of pixels and would band without it. */
        float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
        col += dither / 255.0;
      }

      gl_FragColor = vec4(col, 1.0);
    }
  `

  // ══════════════════════════════════════════════════════════════════════
  // CLASSES: Material + Program
  // ══════════════════════════════════════════════════════════════════════

  interface ProgramObj {
    program: WebGLProgram
    uniforms: Record<string, WebGLUniformLocation | null>
    bind: () => void
  }

  interface MaterialObj {
    vertexShader: WebGLShader
    fragmentShaderSource: string
    programs: Record<number, WebGLProgram>
    activeProgram: WebGLProgram | null
    uniforms: Record<string, WebGLUniformLocation | null>
    setKeywords: (keywords: string[]) => void
    bind: () => void
  }

  function createProgramObj(vertexShader: WebGLShader, fragmentShader: WebGLShader): ProgramObj {
    const g = gl!
    const program = g.createProgram()!
    g.attachShader(program, vertexShader)
    g.attachShader(program, fragmentShader)
    g.linkProgram(program)

    if (!g.getProgramParameter(program, g.LINK_STATUS))
      console.error('Program link error:', g.getProgramInfoLog(program))

    return {
      program,
      uniforms: getUniforms(program),
      bind() { g.useProgram(program) },
    }
  }

  function createMaterial(vertexShader: WebGLShader, fragmentShaderSource: string): MaterialObj {
    const material: MaterialObj = {
      vertexShader,
      fragmentShaderSource,
      programs: {},
      activeProgram: null,
      uniforms: {},
      setKeywords(keywords: string[]) {
        let hash = 0
        for (let i = 0; i < keywords.length; i++)
          hash += hashCode(keywords[i]!)

        let program = material.programs[hash]
        if (program == null) {
          const fragmentShader = compileShader(gl!.FRAGMENT_SHADER, material.fragmentShaderSource, keywords)
          program = gl!.createProgram()!
          gl!.attachShader(program, material.vertexShader)
          gl!.attachShader(program, fragmentShader)
          gl!.linkProgram(program)

          if (!gl!.getProgramParameter(program, gl!.LINK_STATUS))
            console.error('Material link error:', gl!.getProgramInfoLog(program))

          material.programs[hash] = program
        }

        if (program === material.activeProgram)
          return

        material.uniforms = getUniforms(program)
        material.activeProgram = program
      },
      bind() {
        gl!.useProgram(material.activeProgram)
      },
    }
    return material
  }

  function getUniforms(program: WebGLProgram): Record<string, WebGLUniformLocation | null> {
    const g = gl!
    const uniforms: Record<string, WebGLUniformLocation | null> = {}
    const uniformCount = g.getProgramParameter(program, g.ACTIVE_UNIFORMS)
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = g.getActiveUniform(program, i)!.name
      uniforms[uniformName] = g.getUniformLocation(program, uniformName)
    }
    return uniforms
  }

  function compileShader(type: number, source: string, keywords?: string[] | null): WebGLShader {
    const g = gl!
    source = addKeywords(source, keywords ?? null)
    const shader = g.createShader(type)!
    g.shaderSource(shader, source)
    g.compileShader(shader)

    if (!g.getShaderParameter(shader, g.COMPILE_STATUS))
      console.error('Shader compile error:', g.getShaderInfoLog(shader))

    return shader
  }

  function addKeywords(source: string, keywords: string[] | null): string {
    if (keywords == null)
      return source
    let keywordsString = ''
    keywords.forEach((keyword) => {
      keywordsString += `#define ${keyword}\n`
    })
    return keywordsString + source
  }

  function hashCode(s: string): number {
    if (s.length === 0)
      return 0
    let hash = 0
    for (let i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i)
      hash |= 0
    }
    return hash
  }

  // ══════════════════════════════════════════════════════════════════════
  // FBO MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════

  function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
    const g = gl!
    g.activeTexture(g.TEXTURE0)
    const texture = g.createTexture()!
    g.bindTexture(g.TEXTURE_2D, texture)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, param)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, param)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE)
    g.texImage2D(g.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)

    const fbo = g.createFramebuffer()!
    g.bindFramebuffer(g.FRAMEBUFFER, fbo)
    g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, texture, 0)
    g.viewport(0, 0, w, h)
    g.clear(g.COLOR_BUFFER_BIT)

    const texelSizeX = 1.0 / w
    const texelSizeY = 1.0 / h

    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX,
      texelSizeY,
      attach(id: number) {
        g.activeTexture(g.TEXTURE0 + id)
        g.bindTexture(g.TEXTURE_2D, texture)
        return id
      },
    }
  }

  function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): DoubleFBO {
    let fbo1 = createFBO(w, h, internalFormat, format, type, param)
    let fbo2 = createFBO(w, h, internalFormat, format, type, param)

    return {
      width: w,
      height: h,
      texelSizeX: fbo1.texelSizeX,
      texelSizeY: fbo1.texelSizeY,
      get read() { return fbo1 },
      set read(value) { fbo1 = value },
      get write() { return fbo2 },
      set write(value) { fbo2 = value },
      swap() {
        const temp = fbo1
        fbo1 = fbo2
        fbo2 = temp
      },
    }
  }

  function resizeFBO(target: FBO, w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
    const newFBO = createFBO(w, h, internalFormat, format, type, param)
    copyProgram!.bind()
    gl!.uniform1i(copyProgram!.uniforms.uTexture!, target.attach(0))
    blit!(newFBO)
    return newFBO
  }

  function resizeDoubleFBO(target: DoubleFBO, w: number, h: number, internalFormat: number, format: number, type: number, param: number): DoubleFBO {
    if (target.width === w && target.height === h)
      return target
    target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param)
    target.write = createFBO(w, h, internalFormat, format, type, param)
    target.width = w
    target.height = h
    target.texelSizeX = 1.0 / w
    target.texelSizeY = 1.0 / h
    return target
  }

  // ══════════════════════════════════════════════════════════════════════
  // TEXTURE + RESOLUTION
  // ══════════════════════════════════════════════════════════════════════

  function createDitheringTextureObj(): TextureObj {
    const g = gl!
    const texture = g.createTexture()!
    g.bindTexture(g.TEXTURE_2D, texture)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.REPEAT)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.REPEAT)

    const size = 128
    const data = new Uint8Array(size * size * 3)
    for (let i = 0; i < size * size * 3; i++) {
      data[i] = Math.floor(Math.random() * 256)
    }
    g.texImage2D(g.TEXTURE_2D, 0, g.RGB, size, size, 0, g.RGB, g.UNSIGNED_BYTE, data)

    return {
      texture,
      width: size,
      height: size,
      attach(id: number) {
        g.activeTexture(g.TEXTURE0 + id)
        g.bindTexture(g.TEXTURE_2D, texture)
        return id
      },
    }
  }

  function getResolution(resolution: number): { width: number, height: number } {
    const g = gl!
    let aspectRatio = g.drawingBufferWidth / g.drawingBufferHeight
    if (aspectRatio < 1)
      aspectRatio = 1.0 / aspectRatio

    const min = Math.round(resolution)
    const max = Math.round(resolution * aspectRatio)

    if (g.drawingBufferWidth > g.drawingBufferHeight)
      return { width: max, height: min }
    else
      return { width: min, height: max }
  }

  function getTextureScale(tex: TextureObj, width: number, height: number): { x: number, y: number } {
    return {
      x: width / tex.width,
      y: height / tex.height,
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // WEBGL CONTEXT
  // ══════════════════════════════════════════════════════════════════════

  function getWebGLContext(c: HTMLCanvasElement): { gl: WebGL2RenderingContext | WebGLRenderingContext, ext: GLFormats } | null {
    const params: WebGLContextAttributes = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    }

    let context: WebGL2RenderingContext | WebGLRenderingContext | null = c.getContext('webgl2', params) as WebGL2RenderingContext | null
    isWebGL2 = !!context
    if (!isWebGL2)
      context = (c.getContext('webgl', params) || c.getContext('experimental-webgl', params)) as WebGLRenderingContext | null

    if (!context)
      return null

    let halfFloatTexType: number
    let supportLinearFiltering: boolean

    if (isWebGL2) {
      (context as WebGL2RenderingContext).getExtension('EXT_color_buffer_float')
      supportLinearFiltering = !!(context as WebGL2RenderingContext).getExtension('OES_texture_float_linear')
      halfFloatTexType = (context as WebGL2RenderingContext).HALF_FLOAT
    }
    else {
      const halfFloat = context.getExtension('OES_texture_half_float')
      supportLinearFiltering = !!context.getExtension('OES_texture_half_float_linear')
      halfFloatTexType = halfFloat ? halfFloat.HALF_FLOAT_OES : 0
    }

    context.clearColor(0.0, 0.0, 0.0, 1.0)

    let formatRGBA: { internalFormat: number, format: number } | null
    let formatRG: { internalFormat: number, format: number } | null
    let formatR: { internalFormat: number, format: number } | null

    if (isWebGL2) {
      const gl2 = context as WebGL2RenderingContext
      formatRGBA = getSupportedFormat(context, gl2.RGBA16F, gl2.RGBA, halfFloatTexType)
      formatRG = getSupportedFormat(context, gl2.RG16F, gl2.RG, halfFloatTexType)
      formatR = getSupportedFormat(context, gl2.R16F, gl2.RED, halfFloatTexType)
    }
    else {
      formatRGBA = getSupportedFormat(context, context.RGBA, context.RGBA, halfFloatTexType)
      formatRG = getSupportedFormat(context, context.RGBA, context.RGBA, halfFloatTexType)
      formatR = getSupportedFormat(context, context.RGBA, context.RGBA, halfFloatTexType)
    }

    return {
      gl: context,
      ext: {
        formatRGBA,
        formatRG,
        formatR,
        halfFloatTexType,
        supportLinearFiltering,
      },
    }
  }

  function getSupportedFormat(
    context: WebGL2RenderingContext | WebGLRenderingContext,
    internalFormat: number,
    format: number,
    type: number,
  ): { internalFormat: number, format: number } | null {
    if (!supportRenderTextureFormat(context, internalFormat, format, type)) {
      if (isWebGL2) {
        const gl2 = context as WebGL2RenderingContext
        switch (internalFormat) {
          case gl2.R16F:
            return getSupportedFormat(context, gl2.RG16F, gl2.RG, type)
          case gl2.RG16F:
            return getSupportedFormat(context, gl2.RGBA16F, gl2.RGBA, type)
          default:
            return null
        }
      }
      return null
    }
    return { internalFormat, format }
  }

  function supportRenderTextureFormat(
    context: WebGL2RenderingContext | WebGLRenderingContext,
    internalFormat: number,
    format: number,
    type: number,
  ): boolean {
    const texture = context.createTexture()
    context.bindTexture(context.TEXTURE_2D, texture)
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST)
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST)
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE)
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE)
    context.texImage2D(context.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null)

    const fbo = context.createFramebuffer()
    context.bindFramebuffer(context.FRAMEBUFFER, fbo)
    context.framebufferTexture2D(context.FRAMEBUFFER, context.COLOR_ATTACHMENT0, context.TEXTURE_2D, texture, 0)

    const status = context.checkFramebufferStatus(context.FRAMEBUFFER)

    context.deleteTexture(texture)
    context.deleteFramebuffer(fbo)
    context.bindFramebuffer(context.FRAMEBUFFER, null)

    return status === context.FRAMEBUFFER_COMPLETE
  }

  // ══════════════════════════════════════════════════════════════════════
  // SIMULATION: step, render, bloom, sunrays
  // ══════════════════════════════════════════════════════════════════════

  function initFramebuffers() {
    const g = gl!
    const e = ext!
    const simRes = getResolution(config.SIM_RESOLUTION)
    const dyeRes = getResolution(config.DYE_RESOLUTION)

    const texType = e.halfFloatTexType
    const rgba = e.formatRGBA!
    const rg = e.formatRG!
    const r = e.formatR!
    const filtering = e.supportLinearFiltering ? g.LINEAR : g.NEAREST

    g.disable(g.BLEND)

    if (dye == null)
      dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering)
    else
      dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering)

    if (velocity == null)
      velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering)
    else
      velocity = resizeDoubleFBO(velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering)

    divergenceFBO = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, g.NEAREST)
    curlFBO = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, g.NEAREST)
    pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, g.NEAREST)

    initBloomFramebuffers()
    initSunraysFramebuffers()
  }

  function initBloomFramebuffers() {
    const g = gl!
    const e = ext!
    const res = getResolution(config.BLOOM_RESOLUTION)
    const texType = e.halfFloatTexType
    const rgba = e.formatRGBA!
    const filtering = e.supportLinearFiltering ? g.LINEAR : g.NEAREST

    bloomFBO = createFBO(res.width, res.height, rgba.internalFormat, rgba.format, texType, filtering)

    bloomFramebuffers.length = 0
    for (let i = 0; i < config.BLOOM_ITERATIONS; i++) {
      const width = res.width >> (i + 1)
      const height = res.height >> (i + 1)
      if (width < 2 || height < 2)
        break
      const fbo = createFBO(width, height, rgba.internalFormat, rgba.format, texType, filtering)
      bloomFramebuffers.push(fbo)
    }
  }

  function initSunraysFramebuffers() {
    const g = gl!
    const e = ext!
    const res = getResolution(config.SUNRAYS_RESOLUTION)
    const texType = e.halfFloatTexType
    const r = e.formatR!
    const filtering = e.supportLinearFiltering ? g.LINEAR : g.NEAREST

    sunraysFBO = createFBO(res.width, res.height, r.internalFormat, r.format, texType, filtering)
    sunraysTempFBO = createFBO(res.width, res.height, r.internalFormat, r.format, texType, filtering)
  }

  function updateKeywords() {
    const displayKeywords: string[] = []
    if (config.SHADING)
      displayKeywords.push('SHADING')
    if (config.BLOOM)
      displayKeywords.push('BLOOM')
    if (config.SUNRAYS)
      displayKeywords.push('SUNRAYS')
    displayMaterial!.setKeywords(displayKeywords)
  }

  function calcDeltaTime(): number {
    const now = Date.now()
    let dt = (now - lastUpdateTime) / 1000
    dt = Math.min(dt, 0.016666)
    lastUpdateTime = now
    return dt
  }

  function resizeCanvas(): boolean {
    const c = canvas!
    const pixelRatio = window.devicePixelRatio || 1
    const width = Math.floor(c.clientWidth * pixelRatio)
    const height = Math.floor(c.clientHeight * pixelRatio)
    if (c.width !== width || c.height !== height) {
      c.width = width
      c.height = height
      return true
    }
    return false
  }

  function updateColors(dt: number) {
    if (!config.COLORFUL)
      return

    colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED
    if (colorUpdateTimer >= 1) {
      colorUpdateTimer = wrap(colorUpdateTimer, 0, 1)
      pointers.forEach((p) => {
        p.color = generateColor()
      })
    }
  }

  function applyInputs() {
    if (splatStack.length > 0)
      multipleSplats(splatStack.pop()!)

    if (splatSegments.length > 0) {
      for (const seg of splatSegments)
        splatSegment(seg)
      splatSegments.length = 0
    }

    pointers.forEach((p) => {
      p.moved = false
    })
  }

  function step(dt: number) {
    const g = gl!
    g.disable(g.BLEND)

    curlProgram!.bind()
    g.uniform2f(curlProgram!.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY)
    g.uniform1i(curlProgram!.uniforms.uVelocity!, velocity!.read.attach(0))
    blit!(curlFBO)

    vorticityProgram!.bind()
    g.uniform2f(vorticityProgram!.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY)
    g.uniform1i(vorticityProgram!.uniforms.uVelocity!, velocity!.read.attach(0))
    g.uniform1i(vorticityProgram!.uniforms.uCurl!, curlFBO!.attach(1))
    g.uniform1f(vorticityProgram!.uniforms.curl!, config.CURL)
    g.uniform1f(vorticityProgram!.uniforms.dt!, dt)
    blit!(velocity!.write)
    velocity!.swap()

    divergenceProgram!.bind()
    g.uniform2f(divergenceProgram!.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY)
    g.uniform1i(divergenceProgram!.uniforms.uVelocity!, velocity!.read.attach(0))
    blit!(divergenceFBO)

    clearProgram!.bind()
    g.uniform1i(clearProgram!.uniforms.uTexture!, pressure!.read.attach(0))
    g.uniform1f(clearProgram!.uniforms.value!, config.PRESSURE)
    blit!(pressure!.write)
    pressure!.swap()

    pressureProgram!.bind()
    g.uniform2f(pressureProgram!.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY)
    g.uniform1i(pressureProgram!.uniforms.uDivergence!, divergenceFBO!.attach(0))
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
      g.uniform1i(pressureProgram!.uniforms.uPressure!, pressure!.read.attach(1))
      blit!(pressure!.write)
      pressure!.swap()
    }

    gradientSubtractProgram!.bind()
    g.uniform2f(gradientSubtractProgram!.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY)
    g.uniform1i(gradientSubtractProgram!.uniforms.uPressure!, pressure!.read.attach(0))
    g.uniform1i(gradientSubtractProgram!.uniforms.uVelocity!, velocity!.read.attach(1))
    blit!(velocity!.write)
    velocity!.swap()

    advectionProgram!.bind()
    g.uniform2f(advectionProgram!.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY)
    if (!ext!.supportLinearFiltering)
      g.uniform2f(advectionProgram!.uniforms.dyeTexelSize!, velocity!.texelSizeX, velocity!.texelSizeY)
    const velocityId = velocity!.read.attach(0)
    g.uniform1i(advectionProgram!.uniforms.uVelocity!, velocityId)
    g.uniform1i(advectionProgram!.uniforms.uSource!, velocityId)
    g.uniform1f(advectionProgram!.uniforms.dt!, dt)
    g.uniform1f(advectionProgram!.uniforms.dissipation!, config.VELOCITY_DISSIPATION)
    blit!(velocity!.write)
    velocity!.swap()

    if (!ext!.supportLinearFiltering)
      g.uniform2f(advectionProgram!.uniforms.dyeTexelSize!, dye!.texelSizeX, dye!.texelSizeY)
    g.uniform1i(advectionProgram!.uniforms.uVelocity!, velocity!.read.attach(0))
    g.uniform1i(advectionProgram!.uniforms.uSource!, dye!.read.attach(1))
    g.uniform1f(advectionProgram!.uniforms.dissipation!, config.DENSITY_DISSIPATION)
    blit!(dye!.write)
    dye!.swap()
  }

  function render(target: FBO | null) {
    if (contentDisplayEnabled) {
      drawContentDisplay(target)
      return
    }
    const g = gl!
    if (config.BLOOM)
      applyBloom(dye!.read, bloomFBO!)
    if (config.SUNRAYS) {
      applySunrays(dye!.read, dye!.write, sunraysFBO!)
      blur(sunraysFBO!, sunraysTempFBO!, 1)
    }

    if (target == null || !config.TRANSPARENT) {
      g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA)
      g.enable(g.BLEND)
    }
    else {
      g.disable(g.BLEND)
    }

    if (!config.TRANSPARENT)
      drawColor(target, normalizeColor(config.BACK_COLOR))
    drawDisplay(target)
  }

  function drawColor(target: FBO | null, color: FluidColor) {
    colorProgram!.bind()
    gl!.uniform4f(colorProgram!.uniforms.color!, color.r, color.g, color.b, 1)
    blit!(target)
  }

  function drawDisplay(target: FBO | null) {
    const g = gl!
    const width = target == null
      ? g.drawingBufferWidth
      : target.width
    const height = target == null
      ? g.drawingBufferHeight
      : target.height

    displayMaterial!.bind()
    if (config.SHADING)
      g.uniform2f(displayMaterial!.uniforms.texelSize!, 1.0 / width, 1.0 / height)
    g.uniform1i(displayMaterial!.uniforms.uTexture!, dye!.read.attach(0))
    if (config.BLOOM) {
      g.uniform1i(displayMaterial!.uniforms.uBloom!, bloomFBO!.attach(1))
      g.uniform1i(displayMaterial!.uniforms.uDithering!, ditheringTexture!.attach(2))
      const scale = getTextureScale(ditheringTexture!, width, height)
      g.uniform2f(displayMaterial!.uniforms.ditherScale!, scale.x, scale.y)
    }
    if (config.SUNRAYS)
      g.uniform1i(displayMaterial!.uniforms.uSunrays!, sunraysFBO!.attach(3))
    blit!(target)
  }

  function setContentCanvas(source: HTMLCanvasElement) {
    if (!gl)
      return
    const g = gl
    if (!contentTexture) {
      const texture = g.createTexture()!
      g.bindTexture(g.TEXTURE_2D, texture)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE)
      contentTexture = {
        texture,
        width: source.width,
        height: source.height,
        attach(id: number) {
          g.activeTexture(g.TEXTURE0 + id)
          g.bindTexture(g.TEXTURE_2D, texture)
          return id
        },
      }
    }
    g.bindTexture(g.TEXTURE_2D, contentTexture.texture)
    /* Raster 2D top-down, vUv WebGL bottom-up — flip saat upload agar
       searah dengan velocity field (texcoordY pointer sudah di-flip) */
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, true)
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, source)
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, false)
    contentTexture.width = source.width
    contentTexture.height = source.height
  }

  /* A second raster in register with the content: the photograph in its own colours, which the
     display pass shows wherever the temperature is not being looked at. */
  function setAuxCanvas(source: HTMLCanvasElement) {
    if (!gl)
      return
    const g = gl
    if (!auxTexture) {
      const texture = g.createTexture()!
      g.bindTexture(g.TEXTURE_2D, texture)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE)
      auxTexture = {
        texture,
        width: source.width,
        height: source.height,
        attach(id: number) {
          g.activeTexture(g.TEXTURE0 + id)
          g.bindTexture(g.TEXTURE_2D, texture)
          return id
        },
      }
    }
    g.bindTexture(g.TEXTURE_2D, auxTexture.texture)
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, true)
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, source)
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, false)
    auxTexture.width = source.width
    auxTexture.height = source.height
  }

  function setLetterSource(source: HTMLCanvasElement | null, left: number, bottom: number, width: number, height: number) {
    letterSource = source
    letterRect[0] = left
    letterRect[1] = bottom
    letterRect[2] = width
    letterRect[3] = height
  }

  function attachLetters(g: WebGL2RenderingContext | WebGLRenderingContext, id: number): boolean {
    if (!letterSource || !letterSource.width || !letterSource.height) {
      contentTexture!.attach(id)
      return false
    }
    if (!letterTexture) {
      const texture = g.createTexture()!
      g.bindTexture(g.TEXTURE_2D, texture)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE)
      letterTexture = {
        texture,
        width: 0,
        height: 0,
        attach(unit: number) {
          g.activeTexture(g.TEXTURE0 + unit)
          g.bindTexture(g.TEXTURE_2D, texture)
          return unit
        },
      }
    }
    letterTexture.attach(id)
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, true)
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, letterSource)
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, false)
    return true
  }

  function drawContentDisplay(target: FBO | null) {
    if (!contentTexture || !contentDisplayProgram)
      return
    const g = gl!
    g.disable(g.BLEND)
    contentDisplayProgram.bind()
    const hasLetters = attachLetters(g, 3)
    g.uniform1i(contentDisplayProgram.uniforms.tText!, 3)
    g.uniform4f(
      contentDisplayProgram.uniforms.uTextRect!,
      letterRect[0]!,
      letterRect[1]!,
      hasLetters
        ? letterRect[2]!
        : 0,
      letterRect[3]!,
    )
    g.uniform1i(contentDisplayProgram.uniforms.tMap!, contentTexture.attach(0))
    g.uniform1i(contentDisplayProgram.uniforms.tFluid!, dye!.read.attach(1))
    g.uniform1i(contentDisplayProgram.uniforms.tAux!, (auxTexture ?? contentTexture).attach(2))
    g.uniform1f(contentDisplayProgram.uniforms.uMode!, contentDisplay.mode)
    g.uniform1f(contentDisplayProgram.uniforms.uDisplace!, contentDisplay.displace)
    g.uniform1f(contentDisplayProgram.uniforms.uChromatic!, contentDisplay.chromatic)
    g.uniform3f(contentDisplayProgram.uniforms.uColor!, contentDisplay.color[0], contentDisplay.color[1], contentDisplay.color[2])
    g.uniform1f(contentDisplayProgram.uniforms.uWhite!, contentDisplay.whiteCore)
    g.uniform1f(contentDisplayProgram.uniforms.uInkGain!, contentDisplay.inkGain)
    g.uniform1f(contentDisplayProgram.uniforms.uSkinGain!, contentDisplay.skinGain)
    g.uniform1f(contentDisplayProgram.uniforms.uWarm!, contentDisplay.warm)
    g.uniform1f(contentDisplayProgram.uniforms.uLook!, contentDisplay.lookMode)
    g.uniform1f(contentDisplayProgram.uniforms.uText!, contentDisplay.textMode)
    g.uniform1f(contentDisplayProgram.uniforms.uClock!, performance.now() / 1000)
    g.uniform3f(contentDisplayProgram.uniforms.uInfra!, INFRA.lo, INFRA.hi, INFRA.gamma)
    g.uniform4f(contentDisplayProgram.uniforms.uHeat!, contentDisplay.heat[0], contentDisplay.heat[1], contentDisplay.heat[2], contentDisplay.heat[3])
    g.uniform1f(contentDisplayProgram.uniforms.uPhoto!, auxTexture ? contentDisplay.photo : 0)
    g.uniform1f(contentDisplayProgram.uniforms.uScan!, contentDisplay.scan)
    g.uniform1f(contentDisplayProgram.uniforms.uLiquid!, contentDisplay.liquid)
    g.uniform1f(contentDisplayProgram.uniforms.uMotion!, contentDisplay.motion)
    g.uniform1f(contentDisplayProgram.uniforms.uReach!, contentDisplay.reach)
    g.uniform2fv(contentDisplayProgram.uniforms['uBehind[0]']!, contentDisplay.behind)
    g.uniform1f(contentDisplayProgram.uniforms.uLetters!, contentDisplay.letters)
    const cssPerPixel = canvas && canvas.height
      ? canvas.clientHeight / canvas.height
      : 1
    g.uniform1f(contentDisplayProgram.uniforms.uPx!, cssPerPixel)
    g.uniform2f(contentDisplayProgram.uniforms.uView!, canvas?.clientWidth || 1, canvas?.clientHeight || 1)
    g.uniform4fv(contentDisplayProgram.uniforms['uShade[0]']!, contentDisplay.shades)
    g.uniform3f(contentDisplayProgram.uniforms.uShadeFade!, contentDisplay.shadeFade[0], contentDisplay.shadeFade[1], contentDisplay.shadeFade[2])
    blit!(target)
  }

  function applyBloom(source: FBO, destination: FBO) {
    if (bloomFramebuffers.length < 2)
      return

    const g = gl!
    let last: FBO = destination

    g.disable(g.BLEND)
    bloomPrefilterProgram!.bind()
    const knee = config.BLOOM_THRESHOLD * config.BLOOM_SOFT_KNEE + 0.0001
    const curve0 = config.BLOOM_THRESHOLD - knee
    const curve1 = knee * 2
    const curve2 = 0.25 / knee
    g.uniform3f(bloomPrefilterProgram!.uniforms.curve!, curve0, curve1, curve2)
    g.uniform1f(bloomPrefilterProgram!.uniforms.threshold!, config.BLOOM_THRESHOLD)
    g.uniform1i(bloomPrefilterProgram!.uniforms.uTexture!, source.attach(0))
    blit!(last)

    bloomBlurProgram!.bind()
    for (let i = 0; i < bloomFramebuffers.length; i++) {
      const dest = bloomFramebuffers[i]!
      g.uniform2f(bloomBlurProgram!.uniforms.texelSize!, last.texelSizeX, last.texelSizeY)
      g.uniform1i(bloomBlurProgram!.uniforms.uTexture!, last.attach(0))
      blit!(dest)
      last = dest
    }

    g.blendFunc(g.ONE, g.ONE)
    g.enable(g.BLEND)

    for (let i = bloomFramebuffers.length - 2; i >= 0; i--) {
      const baseTex = bloomFramebuffers[i]!
      g.uniform2f(bloomBlurProgram!.uniforms.texelSize!, last.texelSizeX, last.texelSizeY)
      g.uniform1i(bloomBlurProgram!.uniforms.uTexture!, last.attach(0))
      g.viewport(0, 0, baseTex.width, baseTex.height)
      blit!(baseTex)
      last = baseTex
    }

    g.disable(g.BLEND)
    bloomFinalProgram!.bind()
    g.uniform2f(bloomFinalProgram!.uniforms.texelSize!, last.texelSizeX, last.texelSizeY)
    g.uniform1i(bloomFinalProgram!.uniforms.uTexture!, last.attach(0))
    g.uniform1f(bloomFinalProgram!.uniforms.intensity!, config.BLOOM_INTENSITY)
    blit!(destination)
  }

  function applySunrays(source: FBO, mask: FBO, destination: FBO) {
    const g = gl!
    g.disable(g.BLEND)
    sunraysMaskProgram!.bind()
    g.uniform1i(sunraysMaskProgram!.uniforms.uTexture!, source.attach(0))
    blit!(mask)

    sunraysProgram!.bind()
    g.uniform1f(sunraysProgram!.uniforms.weight!, config.SUNRAYS_WEIGHT)
    g.uniform1i(sunraysProgram!.uniforms.uTexture!, mask.attach(0))
    blit!(destination)
  }

  function blur(target: FBO, temp: FBO, iterations: number) {
    blurProgram!.bind()
    for (let i = 0; i < iterations; i++) {
      gl!.uniform2f(blurProgram!.uniforms.texelSize!, target.texelSizeX, 0.0)
      gl!.uniform1i(blurProgram!.uniforms.uTexture!, target.attach(0))
      blit!(temp)

      gl!.uniform2f(blurProgram!.uniforms.texelSize!, 0.0, target.texelSizeY)
      gl!.uniform1i(blurProgram!.uniforms.uTexture!, temp.attach(0))
      blit!(target)
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // SPLAT + COLOR
  // ══════════════════════════════════════════════════════════════════════

  /* Paritas daspritam: setiap event pointer di-queue sebagai segmen lalu
     dipecah menjadi sub-splat sepanjang garis lama->baru. Satu splat per
     frame (perilaku lama) meninggalkan titik-titik terpisah saat flick
     karena delta satu frame bisa melampaui radius gaussian */
  function splatSegment(seg: SplatSegment) {
    const dist = Math.hypot(seg.deltaX, seg.deltaY)
    const count = Math.max(1, Math.min(Math.ceil(dist / SPLAT_INTERP_SPACING), MAX_SPLATS_PER_SEGMENT))
    /* Momentum dibagi rata antar sub-splat: total energi per segmen setara
       satu splat penuh, meniru deposit per-event kecil milik daspritam */
    const dx = seg.deltaX * config.SPLAT_FORCE / count
    const dy = seg.deltaY * config.SPLAT_FORCE / count
    /* Content mode used to drop one full splat per event at the newest position, so a fast
       flick (~86px between frames against a ~26px gaussian sigma) printed a row of separate
       beads. Presence is divided by the sub-splat count together with momentum: the segment
       deposits exactly what one splat did, only spread along the path instead of stacked at
       its end, so coverage does not grow with the count. */
    if (contentDisplayEnabled) {
      for (let i = 1; i <= count; i++) {
        const t = i / count
        splat(seg.fromX + (seg.toX - seg.fromX) * t, seg.fromY + (seg.toY - seg.fromY) * t, dx, dy, seg.color, 1 / count)
      }
      return
    }
    const dyeColor = {
      r: seg.color.r * DYE_SPLAT_MULT,
      g: seg.color.g * DYE_SPLAT_MULT,
      b: seg.color.b * DYE_SPLAT_MULT,
    }
    for (let i = 1; i <= count; i++) {
      const t = i / count
      const x = seg.fromX + (seg.toX - seg.fromX) * t
      const y = seg.fromY + (seg.toY - seg.fromY) * t
      splat(x, y, dx, dy, dyeColor)
    }
  }

  function multipleSplats(amount: number) {
    for (let i = 0; i < amount; i++) {
      const color = generateColor()
      color.r *= 10.0
      color.g *= 10.0
      color.b *= 10.0
      const x = Math.random()
      const y = Math.random()
      const dx = 1000 * (Math.random() - 0.5)
      const dy = 1000 * (Math.random() - 0.5)
      splat(x, y, dx, dy, color)
    }
  }

  /* 14 (dari 10): dissipation cepat kalibrasi daspritam memangkas umur splat
     tunggal — deposit awal dinaikkan agar splat programatik tetap terbaca
     tanpa mengubah kontrak pemanggil; plafon dijaga clamp DYE_MAX di shader */
  function emitSplat(x: number, y: number, dx: number, dy: number, brightness = 1, radius?: number) {
    const color = generateColor()
    color.r *= 14.0 * brightness
    color.g *= 14.0 * brightness
    color.b *= 14.0 * brightness
    if (radius === undefined) {
      splat(x, y, dx, dy, color)
      return
    }
    const previousRadius = config.SPLAT_RADIUS
    config.SPLAT_RADIUS = radius
    splat(x, y, dx, dy, color)
    config.SPLAT_RADIUS = previousRadius
  }

  function splat(x: number, y: number, dx: number, dy: number, color: FluidColor, presence = 1) {
    const g = gl!
    splatProgram!.bind()
    g.uniform1i(splatProgram!.uniforms.uTarget!, velocity!.read.attach(0))
    g.uniform1f(splatProgram!.uniforms.aspectRatio!, canvas!.width / canvas!.height)
    g.uniform2f(splatProgram!.uniforms.point!, x, y)
    g.uniform3f(splatProgram!.uniforms.color!, dx, dy, 0.0)
    /* Wiring OGL referensi memakai radius mentah tanpa koreksi aspect —
       correctRadius Pavel melebarkan blob ~2x di layar landscape */
    g.uniform1f(splatProgram!.uniforms.radius!, contentDisplayEnabled
      ? config.SPLAT_RADIUS / 100.0
      : correctRadius(config.SPLAT_RADIUS / 100.0))
    g.uniform1f(splatProgram!.uniforms.clampValue!, VELOCITY_CLAMP)
    blit!(velocity!.write)
    velocity!.swap()

    g.uniform1i(splatProgram!.uniforms.uTarget!, dye!.read.attach(0))
    if (contentDisplayEnabled) {
      /* Paritas daspritam: dye di-splat dengan vektor kecepatan (dx,dy,1) dan
         menjadi peta displacement — bukan velocity field. Velocity hasil
         pressure-projection punya lobus +/- berselang dan disustain vorticity
         (tearing zebra + residu saat idle); density murni ter-advect dan
         meluruh multiplicative sehingga teks selalu pulih utuh. Tanpa clamp
         DYE_MAX: nilai kecepatan ratusan akan tergencet ke 0.85 */
      g.uniform3f(splatProgram!.uniforms.color!, dx, dy, presence)
      g.uniform1f(splatProgram!.uniforms.clampValue!, VELOCITY_CLAMP)
    }
    else {
      g.uniform3f(splatProgram!.uniforms.color!, color.r, color.g, color.b)
      g.uniform1f(splatProgram!.uniforms.clampValue!, DYE_MAX)
    }
    blit!(dye!.write)
    dye!.swap()
  }

  function correctRadius(radius: number): number {
    const aspectRatio = canvas!.width / canvas!.height
    if (aspectRatio > 1)
      radius *= aspectRatio
    return radius
  }

  let hueMin = 0
  let hueMax = 1

  function generateColor(): FluidColor {
    const span = hueMax - hueMin
    const hue = ((hueMin + Math.random() * span) % 1 + 1) % 1
    const c = HSVtoRGB(hue, 1.0, 1.0)
    c.r *= 0.15
    c.g *= 0.15
    c.b *= 0.15
    return c
  }

  function HSVtoRGB(h: number, s: number, v: number): FluidColor {
    let r = 0
    let g = 0
    let b = 0
    const i = Math.floor(h * 6)
    const f = h * 6 - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)

    switch (i % 6) {
      case 0:
        r = v
        g = t
        b = p
        break
      case 1:
        r = q
        g = v
        b = p
        break
      case 2:
        r = p
        g = v
        b = t
        break
      case 3:
        r = p
        g = q
        b = v
        break
      case 4:
        r = t
        g = p
        b = v
        break
      case 5:
        r = v
        g = p
        b = q
        break
    }

    return { r, g, b }
  }

  function normalizeColor(input: { r: number, g: number, b: number }): FluidColor {
    return {
      r: input.r / 255,
      g: input.g / 255,
      b: input.b / 255,
    }
  }

  function wrap(value: number, min: number, max: number): number {
    const range = max - min
    if (range === 0)
      return min
    return (value - min) % range + min
  }

  function correctDeltaX(delta: number): number {
    const aspectRatio = canvas!.width / canvas!.height
    if (aspectRatio < 1)
      delta *= aspectRatio
    return delta
  }

  function correctDeltaY(delta: number): number {
    const aspectRatio = canvas!.width / canvas!.height
    if (aspectRatio > 1)
      delta /= aspectRatio
    return delta
  }

  function scaleByPixelRatio(input: number): number {
    const pixelRatio = window.devicePixelRatio || 1
    return Math.floor(input * pixelRatio)
  }

  // ══════════════════════════════════════════════════════════════════════
  // POINTER + INPUT
  // ══════════════════════════════════════════════════════════════════════

  function createPointer(): Pointer {
    return {
      id: -1,
      texcoordX: 0,
      texcoordY: 0,
      prevTexcoordX: 0,
      prevTexcoordY: 0,
      deltaX: 0,
      deltaY: 0,
      down: false,
      moved: false,
      seeded: false,
      color: { r: 30 * 0.15 / 255, g: 0, b: 300 * 0.15 / 255 },
    }
  }

  function updatePointerDownData(pointer: Pointer, id: number, posX: number, posY: number) {
    pointer.id = id
    pointer.down = true
    pointer.moved = false
    pointer.texcoordX = posX / canvas!.width
    pointer.texcoordY = 1.0 - posY / canvas!.height
    pointer.prevTexcoordX = pointer.texcoordX
    pointer.prevTexcoordY = pointer.texcoordY
    pointer.deltaX = 0
    pointer.deltaY = 0
    pointer.color = generateColor()
    pointer.seeded = true
  }

  function updatePointerMoveData(pointer: Pointer, posX: number, posY: number) {
    /* Pointer lahir di texcoord (0,0), bukan di posisi kursor sebenarnya. Karena
       mousemove di sini tidak lagi digerbangi `down` seperti port aslinya, event
       pertama akan menghitung delta dari sudut kanvas ke kursor dan meledak jadi
       satu splat sepanjang layar — cukup kursor kebetulan berada di atas viewport
       saat halaman dimuat. Event pertama hanya menanam posisi, tanpa gaya. */
    if (!pointer.seeded) {
      pointer.texcoordX = posX / canvas!.width
      pointer.texcoordY = 1.0 - posY / canvas!.height
      pointer.prevTexcoordX = pointer.texcoordX
      pointer.prevTexcoordY = pointer.texcoordY
      pointer.deltaX = 0
      pointer.deltaY = 0
      pointer.moved = false
      pointer.seeded = true
      return
    }

    pointer.prevTexcoordX = pointer.texcoordX
    pointer.prevTexcoordY = pointer.texcoordY
    pointer.texcoordX = posX / canvas!.width
    pointer.texcoordY = 1.0 - posY / canvas!.height
    pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX)
    pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY)
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0
    /* Segmen per event (bukan per frame): browser yang tidak meng-coalesce
       mousemove mengirim >1 event/frame — semua gerakan ikut ter-splat,
       bukan hanya delta event terakhir */
    if (pointer.moved && (!pointerGate || pointerGate(pointer.texcoordX, pointer.texcoordY))) {
      if (splatSegments.length >= MAX_QUEUED_SEGMENTS)
        splatSegments.shift()
      splatSegments.push({
        fromX: pointer.prevTexcoordX,
        fromY: pointer.prevTexcoordY,
        toX: pointer.texcoordX,
        toY: pointer.texcoordY,
        deltaX: pointer.deltaX,
        deltaY: pointer.deltaY,
        color: pointer.color,
      })
    }
  }

  function updatePointerUpData(pointer: Pointer) {
    pointer.down = false
  }

  // Event handlers stored for cleanup
  let onMouseDown: ((e: MouseEvent) => void) | null = null
  let onMouseMove: ((e: MouseEvent) => void) | null = null
  let onMouseUp: (() => void) | null = null
  let onTouchStart: ((e: TouchEvent) => void) | null = null
  let onTouchMove: ((e: TouchEvent) => void) | null = null
  let onTouchEnd: ((e: TouchEvent) => void) | null = null

  function setupEventListeners() {
    const c = canvas!

    onMouseDown = (e: MouseEvent) => {
      const posX = scaleByPixelRatio(e.offsetX)
      const posY = scaleByPixelRatio(e.offsetY)
      let pointer = pointers.find(p => p.id === -1)
      if (pointer == null) {
        pointer = createPointer()
        pointers.push(pointer)
      }
      updatePointerDownData(pointer, -1, posX, posY)
    }

    onMouseMove = (e: MouseEvent) => {
      const pointer = pointers[0]!
      // Portfolio behavior: always track mouse movement (not just when down)
      const posX = scaleByPixelRatio(e.offsetX)
      const posY = scaleByPixelRatio(e.offsetY)
      updatePointerMoveData(pointer, posX, posY)
    }

    onMouseUp = () => {
      updatePointerUpData(pointers[0]!)
    }

    onTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const touches = e.targetTouches
      while (touches.length >= pointers.length)
        pointers.push(createPointer())
      for (let i = 0; i < touches.length; i++) {
        const t = touches[i]!
        const posX = scaleByPixelRatio(t.pageX)
        const posY = scaleByPixelRatio(t.pageY)
        updatePointerDownData(pointers[i + 1]!, t.identifier, posX, posY)
      }
    }

    onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touches = e.targetTouches
      for (let i = 0; i < touches.length; i++) {
        const pointer = pointers[i + 1]
        if (!pointer?.down)
          continue
        const t = touches[i]!
        const posX = scaleByPixelRatio(t.pageX)
        const posY = scaleByPixelRatio(t.pageY)
        updatePointerMoveData(pointer, posX, posY)
      }
    }

    onTouchEnd = (e: TouchEvent) => {
      const touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        const pointer = pointers.find(p => p.id === touches[i]!.identifier)
        if (pointer == null)
          continue
        updatePointerUpData(pointer)
      }
    }

    c.addEventListener('mousedown', onMouseDown)
    c.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    c.addEventListener('touchstart', onTouchStart)
    c.addEventListener('touchmove', onTouchMove, false)
    window.addEventListener('touchend', onTouchEnd)
  }

  function removeEventListeners() {
    if (!canvas)
      return
    if (onMouseDown)
      canvas.removeEventListener('mousedown', onMouseDown)
    if (onMouseMove)
      canvas.removeEventListener('mousemove', onMouseMove)
    if (onMouseUp)
      window.removeEventListener('mouseup', onMouseUp)
    if (onTouchStart)
      canvas.removeEventListener('touchstart', onTouchStart)
    if (onTouchMove)
      canvas.removeEventListener('touchmove', onTouchMove)
    if (onTouchEnd)
      window.removeEventListener('touchend', onTouchEnd)
  }

  // ══════════════════════════════════════════════════════════════════════
  // MAIN LOOP
  // ══════════════════════════════════════════════════════════════════════

  /* resizeCanvas tidak boleh dipanggil per frame: membaca clientWidth tiap
     frame memicu forced reflow (terukur 92ms/5s trace) — resize ditangani
     ResizeObserver pemilik canvas via resize() publik */
  function update() {
    const dt = calcDeltaTime()
    updateColors(dt)
    applyInputs()
    if (!config.PAUSED)
      step(dt)
    render(null)
    animFrameId = requestAnimationFrame(update)
  }

  // ══════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ══════════════════════════════════════════════════════════════════════

  function init(canvasEl: HTMLCanvasElement, options?: {
    skipInitialSplats?: boolean
    hueMin?: number
    hueMax?: number
    curl?: number
    splatRadius?: number
    splatForce?: number
    contentDisplay?: boolean
    pointerGate?: (u: number, v: number) => boolean
    displayMode?: 'faithful' | 'dye' | 'thermal'
    displace?: number
    chromatic?: number
    color?: string
    whiteCore?: number
    densityDissipation?: number
    velocityDissipation?: number
    pressureIterations?: number
  }): boolean {
    canvas = canvasEl
    hueMin = options?.hueMin ?? 0
    hueMax = options?.hueMax ?? 1
    if (options?.curl !== undefined)
      config.CURL = options.curl
    if (options?.splatRadius !== undefined)
      config.SPLAT_RADIUS = options.splatRadius
    if (options?.splatForce !== undefined)
      config.SPLAT_FORCE = options.splatForce
    if (options?.densityDissipation !== undefined)
      config.DENSITY_DISSIPATION = options.densityDissipation
    if (options?.velocityDissipation !== undefined)
      config.VELOCITY_DISSIPATION = options.velocityDissipation
    if (options?.pressureIterations !== undefined)
      config.PRESSURE_ITERATIONS = options.pressureIterations
    contentDisplayEnabled = options?.contentDisplay ?? false
    pointerGate = options?.pointerGate ?? null
    contentDisplay.mode = options?.displayMode === 'dye'
      ? 1
      : options?.displayMode === 'thermal'
        ? 2
        : 0
    if (options?.displace !== undefined)
      contentDisplay.displace = options.displace
    if (options?.chromatic !== undefined)
      contentDisplay.chromatic = options.chromatic
    if (options?.color !== undefined)
      contentDisplay.color = hexToRgb(options.color)
    if (options?.whiteCore !== undefined)
      contentDisplay.whiteCore = options.whiteCore

    const ctx = getWebGLContext(canvas)
    if (!ctx || !ctx.ext.formatRGBA) {
      console.warn('[FluidSimulation] WebGL not supported or missing required extensions')
      return false
    }

    gl = ctx.gl
    ext = ctx.ext

    // Adjust for mobile
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      config.DYE_RESOLUTION = 512
    }
    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 512
      config.SHADING = false
      config.BLOOM = false
      config.SUNRAYS = false
    }

    // Compile shaders
    const baseVertexShader = compileShader(gl.VERTEX_SHADER, baseVertexShaderSource)
    const blurVertexShader = compileShader(gl.VERTEX_SHADER, blurVertexShaderSource)

    blurProgram = createProgramObj(blurVertexShader, compileShader(gl.FRAGMENT_SHADER, blurShaderSource))
    copyProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, copyShaderSource))
    clearProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, clearShaderSource))
    colorProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, colorShaderSource))
    bloomPrefilterProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, bloomPrefilterShaderSource))
    bloomBlurProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, bloomBlurShaderSource))
    bloomFinalProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, bloomFinalShaderSource))
    sunraysMaskProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, sunraysMaskShaderSource))
    sunraysProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, sunraysShaderSource))
    splatProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, splatShaderSource))
    divergenceProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, divergenceShaderSource))
    curlProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, curlShaderSource))
    vorticityProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, vorticityShaderSource))
    pressureProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, pressureShaderSource))
    gradientSubtractProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, gradientSubtractShaderSource))

    advectionProgram = createProgramObj(
      baseVertexShader,
      compileShader(gl.FRAGMENT_SHADER, advectionShaderSource, ext.supportLinearFiltering
        ? null
        : ['MANUAL_FILTERING']),
    )

    displayMaterial = createMaterial(baseVertexShader, displayShaderSource)

    if (contentDisplayEnabled)
      contentDisplayProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, contentDisplayShaderSource))

    // Setup blit (fullscreen quad)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)

    blit = (target: FBO | null, clear = false) => {
      const g = gl!
      if (target == null) {
        g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight)
        g.bindFramebuffer(g.FRAMEBUFFER, null)
      }
      else {
        g.viewport(0, 0, target.width, target.height)
        g.bindFramebuffer(g.FRAMEBUFFER, target.fbo)
      }
      if (clear) {
        g.clearColor(0.0, 0.0, 0.0, 1.0)
        g.clear(g.COLOR_BUFFER_BIT)
      }
      g.drawElements(g.TRIANGLES, 6, g.UNSIGNED_SHORT, 0)
    }

    ditheringTexture = createDitheringTextureObj()
    pointers.push(createPointer())

    updateKeywords()
    resizeCanvas()
    initFramebuffers()

    // Initial splats (skip if hero wants black-first activation)
    if (!options?.skipInitialSplats)
      multipleSplats(Math.floor(Math.random() * 20) + 5)

    setupEventListeners()

    lastUpdateTime = Date.now()
    update()

    return true
  }

  function setDisplayGains(ink: number, skin: number, warm: number) {
    contentDisplay.inkGain = ink
    contentDisplay.skinGain = skin
    contentDisplay.warm = warm
  }

  function setSceneLook(photo: number, scan: number, lookMode: number, textMode: number) {
    contentDisplay.lookMode = lookMode
    contentDisplay.textMode = textMode
    contentDisplay.photo = photo
    contentDisplay.scan = scan
  }

  function setTouchLook(liquid: number, motion: number, reach: number) {
    contentDisplay.liquid = liquid
    contentDisplay.motion = motion
    contentDisplay.reach = reach
  }

  function setHeat(x: number, y: number, radius: number, energy: number) {
    contentDisplay.heat = [x, y, radius, energy]
  }

  function setBehindLetters(ranges: Float32Array) {
    contentDisplay.behind.set(ranges.subarray(0, contentDisplay.behind.length))
  }

  function setLetterGain(gain: number) {
    contentDisplay.letters = gain
  }

  /* Up to three shades, four numbers each, in texture coordinates: left edge, right edge, top
     edge measured up from the bottom of the canvas, and whether the shade is on. The figure keeps
     `level` of its light inside a shade; `across` and `up` are the widths of its soft edges. */
  function setLabelShades(shades: Float32Array, across: number, up: number, level: number) {
    contentDisplay.shades.set(shades.subarray(0, contentDisplay.shades.length))
    contentDisplay.shadeFade = [
      across,
      up,
      level,
    ]
  }

  function resize() {
    if (canvas && gl) {
      if (resizeCanvas())
        initFramebuffers()
    }
  }

  function destroy() {
    cancelAnimationFrame(animFrameId)
    removeEventListeners()

    canvas = null
    gl = null
    ext = null
    blit = null
    dye = null
    velocity = null
    divergenceFBO = null
    curlFBO = null
    pressure = null
    bloomFBO = null
    bloomFramebuffers = []
    sunraysFBO = null
    sunraysTempFBO = null
    ditheringTexture = null
    contentTexture = null
    auxTexture = null
    letterTexture = null
    letterSource = null
    contentDisplayProgram = null
    contentDisplayEnabled = false
    pointerGate = null
    pointers.length = 0
    splatStack = []
    splatSegments.length = 0
  }

  return {
    init,
    resize,
    destroy,
    multipleSplats,
    emitSplat,
    setContentCanvas,
    setAuxCanvas,
    setDisplayGains,
    setSceneLook,
    setTouchLook,
    setHeat,
    setBehindLetters,
    setLetterGain,
    setLetterSource,
    setLabelShades,
  }
}

/* ── halaman ────────────────────────────────────────────── */
const MASTHEAD_TEXT = 'BILLYMAULANA'
const NAME_FONT = '\'Bebas Neue\', Impact, sans-serif'
const MASTHEAD_PROBE_PX = 200

/* Rasio grid diukur dari piksel chdartmaker.com pada 1440x900: tinggi tinta
   masthead 192px, tepi atas tinta 24px di bawah tepi kontainer, jarak tinta
   masthead ke tinta nav 69px. Disimpan sebagai rasio, bukan px, supaya
   proporsinya bertahan di setiap lebar viewport */
const CAP_PER_VIEWPORT = 192 / 1440
const INK_TOP_PER_CAP = 24 / 192
const NAV_GAP_PER_CAP = 69 / 192

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

interface SceneBox {
  left: number
  top: number
  width: number
  height: number
}

type Look = 'thermal' | 'void' | 'blur' | 'noise' | 'cinema' | 'colour' | 'grayscale'

interface Portrait {
  /* Every portrait is kept as five rasters in one register: the photograph in its own colours,
     cut to black; the same photograph relit as if taken against the dark (light falling off from
     the face, edges sinking into the ground, the sheen taken off the hair) and pulled into the
     amber and void of the page; its temperature; a coarse depth that bends the scan lines; and
     its matte. Its look is how it is shown when no filter is asked for. */
  look: Look
  width: number
  height: number
  /* Plate coordinates: the vertical axis through the middle of the hair, the distance from the
     eye line down to the chin, the top of the hair, the row where the forehead comes out from
     under it, and the first row on which the figure is cut off by the side of the plate. */
  axis: number
  faceUnit: number
  crownRow: number
  foreheadRow: number
  sleeveRow: number
}

/* Each photograph is used whole: skin, hair and cloth in their real outline, cropped by the
   viewport and by nothing else. */
const PORTRAITS: Record<string, Portrait> = {
  pattern: {
    look: 'thermal',
    width: 1216,
    height: 1536,
    axis: 607.5,
    faceUnit: 289.6,
    crownRow: 45,
    foreheadRow: 367,
    sleeveRow: 1459,
  },
  school: {
    look: 'thermal',
    width: 1216,
    height: 1536,
    axis: 608,
    faceUnit: 287.6,
    crownRow: 44,
    foreheadRow: 375,
    sleeveRow: 1475,
  },
  mural: {
    look: 'thermal',
    width: 1216,
    height: 1536,
    axis: 607.5,
    faceUnit: 254.7,
    crownRow: 61,
    foreheadRow: 358,
    sleeveRow: 1536,
  },
  neon: {
    look: 'thermal',
    width: 1792,
    height: 2400,
    axis: 788,
    faceUnit: 442.7,
    crownRow: 254,
    foreheadRow: 777,
    sleeveRow: 2245,
  },
  studio: {
    look: 'thermal',
    width: 2240,
    height: 3000,
    axis: 1142,
    faceUnit: 514.7,
    crownRow: 132,
    foreheadRow: 710.6,
    sleeveRow: 3000,
  },
  varsity: {
    look: 'thermal',
    width: 2280,
    height: 2880,
    axis: 1124,
    faceUnit: 517.3,
    crownRow: 31,
    foreheadRow: 657.8,
    sleeveRow: 2719,
  },
  geometric: {
    look: 'thermal',
    width: 2240,
    height: 2988,
    axis: 1108,
    faceUnit: 359.6,
    crownRow: 550,
    foreheadRow: 1030.8,
    sleeveRow: 2988,
  },
  room: {
    look: 'thermal',
    width: 2240,
    height: 2988,
    axis: 980,
    faceUnit: 583.9,
    crownRow: 304,
    foreheadRow: 972.3,
    sleeveRow: 2609,
  },
}
const PORTRAIT_DEFAULT = 'geometric'
const PORTRAIT_KEYS = Object.keys(PORTRAITS)
const LOOKS: Look[] = [
  'thermal',
  'void',
  'blur',
  'noise',
  'cinema',
  'colour',
  'grayscale',
]

function plateSrc(key: string, kind: 'cinema' | 'colour' | 'heat' | 'depth' | 'matte'): string {
  return `/assets/images/concept-2/portrait-${key}-${kind}.webp`
}

function thumbSrc(key: string): string {
  return `/assets/images/concept-2/thumbs/${key}.webp`
}

const MONO_MIX = [0.5, 0.4, 0.1] as const

/* The display pass maps temperature to colour in the shader. The static canvas has no shader,
   so the same ramp is kept here for a lookup table; both must hold the same stops. */
const RAMP_STOPS = [
  0,
  0.13,
  0.28,
  0.43,
  0.56,
  0.68,
  0.79,
  0.875,
  0.935,
  0.975,
  1,
]
const RAMP_COLOURS = [
  [5, 5, 7],
  [15, 10, 114],
  [58, 26, 158],
  [107, 47, 200],
  [163, 43, 168],
  [212, 92, 110],
  [238, 138, 42],
  [248, 191, 39],
  [254, 229, 93],
  [255, 245, 179],
  [255, 254, 245],
]

/* The top of the hair never rises above the middle of the letters, so the name keeps its upper
   half clear of the figure whichever letters the hair passes in front of. */
const NAME_CLEARANCE = 12
const CROWN_AT_CAP = 0.5

/* The page is set on twelve columns across the content width between the side margins, the
   width the name already fills. The head, hair edge to hair edge about HAIR_PER_FACE face units
   wide, spans a whole number of them centred on the middle line: four on a desktop, six on a
   tablet, ten on a phone. */
const GRID_COLUMNS = 12
const HAIR_PER_FACE = 3.1
const HAIR_COLUMNS = [
  { from: 1024, columns: 4 },
  { from: 600, columns: 8 },
  { from: 0, columns: 12 },
]

/* The plate fades to black over this share of its width at the sides and of its height at the
   bottom, so where the photograph's frame cuts the sleeves the figure sinks into the ground instead
   of ending on a straight line, and its size can follow the grid alone. */
const PLATE_FADE_SIDE = 0.08
const PLATE_FADE_FOOT = 0.06

/* Which letters of the name sit behind the figure: `front` keeps the whole name over it,
   `behind` sends every letter the hair reaches behind it (a letter counts as reached when
   COVER_MIN of its ink lies on the figure), `split` sends the first SPLIT_LETTERS, BILLYM,
   behind and keeps AULANA in front, and `lead` does the opposite. */
const NAME_DEPTHS = [
  'behind',
  'front',
  'split',
  'lead',
] as const
type NameDepth = typeof NAME_DEPTHS[number]
const COVER_MIN = 0.03
const SPLIT_LETTERS = 6

/* Behind each footer label that stands on it, the figure keeps SHADE_LEVEL of its light. The
   shade is as wide as the label plus SHADE_PAD, starts SHADE_GAP above it and runs to the bottom
   edge; it feathers out over SHADE_FEATHER sideways and over SHADE_FADE of the viewport height
   upwards, so the cloth beside and above a label keeps its colour. */
const SHADE_PAD = 16
const SHADE_GAP = 12
const SHADE_FEATHER = 140
const SHADE_FADE = 0.16
const SHADE_LEVEL = 0.3
const SHADE_SLOTS = 3

const STATIC_MAX_DPR = 2

const BACKDROP_REVEAL = { at: 0, duration: 0.35, warm: 1.2 }
const LETTER_REVEAL = 0.8
const INK_ARRIVAL = 1.2

/* Motion and ink must share one lifetime. At velocity 3.2 / density 1.1 the flow was dead after
   ~1.2s while the thermal curve kept faint presence visible for 4s+, so the trail sat frozen for
   about three seconds (measured: 2% of the visible trail still moving at t=3s). Velocity 1.2 lets
   the flow outlive the bright phase; density 1.8 retires the ink as the flow runs out (79% of the
   trail moving at 2s, nothing left at 4s). Pressure 20 turns the persisting momentum into coherent
   rolling vortices instead of stamped blobs, and curl 8 keeps those vortices large and smooth —
   curl 20 with long-lived velocity shredded the stroke into curly smoke within 0.3s. */
const FLUID = {
  mode: 'thermal' as const,
  color: '#0047FF',
  curl: 8,
  splatRadius: 0.3,
  splatForce: 7200,
  displace: 0.0007,
  chromatic: 0.003,
  whiteCore: 0.95,
  densityDissipation: 1.8,
  velocityDissipation: 1.2,
  pressureIterations: 20,
}

/* Display pass mode content tidak menggambar apa pun sebelum texture konten diunggah. Masthead
   sudah punya canvas warp sendiri, jadi texture konten fluida cukup raster hitam polos: yang
   tersisa di canvas ini hanya heat field termal, dan hitamnya hilang lewat blend screen. */
function createBlankContent(): HTMLCanvasElement {
  const blank = document.createElement('canvas')
  blank.width = 1
  blank.height = 1
  const ctx = blank.getContext('2d')!
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, 1, 1)
  return blank
}

const sectionRef = ref<HTMLElement>()
const headRef = ref<HTMLElement>()
const fluidCanvasRef = ref<HTMLCanvasElement>()
const textCanvasRef = ref<HTMLCanvasElement>()
const navRef = ref<HTMLElement>()
const footRef = ref<HTMLElement>()
const isTextReady = ref(false)
const stageDrawsName = ref(false)

const backdropCanvasRef = ref<HTMLCanvasElement>()
const showStaticBackdrop = ref(false)

const displayGains = { ink: 0, skin: 0, warm: 0 }

interface SceneLayout {
  axisX: number
  top: number
  figureScale: number
  shades: SceneBox[]
}

const route = useRoute()
const requestedPhoto = String(route.query.photo ?? '')
const portraitKey = Object.keys(PORTRAITS).includes(requestedPhoto)
  ? requestedPhoto
  : PORTRAIT_DEFAULT
const portrait = PORTRAITS[portraitKey]!
const requestedLook = LOOKS.find(look => look === route.query.filter)
const look: Look = requestedLook ?? portrait.look
const showsPhotograph = look === 'cinema' || look === 'colour' || look === 'grayscale'
const scansLines = look === 'void'
const requestedDepth = NAME_DEPTHS.find(depth => depth === route.query.name)
const nameDepth: NameDepth = requestedDepth ?? (route.query.front === 'photo'
  ? 'behind'
  : NAME_DEPTHS[0])
const liquidLook = Math.max(0, LIQUIDS.findIndex(name => name === route.query.liquid))
const motion = MOTIONS.find(name => name === route.query.motion) ?? MOTIONS[0]
const MOTION_LOOK = {
  shatter: { mode: 2, reach: SHATTER.reach },
  melt: { mode: 1, reach: RIPPLE.melt },
  smear: { mode: 3, reach: RIPPLE.smear },
  wave: { mode: 4, reach: RIPPLE.wave },
  echo: { mode: 5, reach: RIPPLE.echo },
  liquid: { mode: 6, reach: RIPPLE.liquid },
  still: { mode: 0, reach: 0 },
} as const
const textMode = TEXT_MODES.find(name => name === route.query.text) ?? TEXT_MODES[0]
const lookMode = look === 'blur'
  ? 1
  : look === 'noise'
    ? 2
    : 0
const showsPanel = import.meta.dev && route.query.panel !== '0'

interface PanelOption {
  label: string
  query: Record<string, string>
  active: boolean
}

interface PanelGroup {
  label: string
  options: PanelOption[]
}

const PANEL_GROUPS: PanelGroup[] = [
  {
    label: 'Filter',
    options: [
      {
        label: 'Termal',
        query: { filter: 'thermal' },
        active: look === 'thermal',
      },
      {
        label: 'Garis',
        query: { filter: 'void' },
        active: look === 'void',
      },
      {
        label: 'Blur',
        query: { filter: 'blur' },
        active: look === 'blur',
      },
      {
        label: 'Bintik',
        query: { filter: 'noise' },
        active: look === 'noise',
      },
      {
        label: 'Sinematik',
        query: { filter: 'cinema' },
        active: look === 'cinema',
      },
      {
        label: 'Asli',
        query: { filter: 'colour' },
        active: look === 'colour',
      },
    ],
  },
  {
    label: 'Cairan',
    options: [
      {
        label: 'Termal',
        query: { liquid: 'thermal' },
        active: liquidLook === 0,
      },
      {
        label: 'Bara',
        query: { liquid: 'ember' },
        active: liquidLook === 1,
      },
      {
        label: 'Dingin',
        query: { liquid: 'cold' },
        active: liquidLook === 2,
      },
      {
        label: 'Tinta',
        query: { liquid: 'ink' },
        active: liquidLook === 3,
      },
      {
        label: 'Krom',
        query: { liquid: 'chrome' },
        active: liquidLook === 4,
      },
    ],
  },
  {
    label: 'Gerak',
    options: [
      {
        label: 'Pecah',
        query: { motion: 'shatter' },
        active: motion === 'shatter',
      },
      {
        label: 'Leleh',
        query: { motion: 'melt' },
        active: motion === 'melt',
      },
      {
        label: 'Stroboskop',
        query: { motion: 'echo' },
        active: motion === 'echo',
      },
      {
        label: 'Cair',
        query: { motion: 'liquid' },
        active: motion === 'liquid',
      },
      {
        label: 'Gelombang',
        query: { motion: 'wave' },
        active: motion === 'wave',
      },
      {
        label: 'Sapuan',
        query: { motion: 'smear' },
        active: motion === 'smear',
      },
      {
        label: 'Diam',
        query: { motion: 'still' },
        active: motion === 'still',
      },
    ],
  },
  {
    label: 'Nama',
    options: [
      {
        label: 'Depan',
        query: { name: 'front' },
        active: nameDepth === 'front',
      },
      {
        label: 'Belakang',
        query: { name: 'behind' },
        active: nameDepth === 'behind',
      },
      {
        label: 'BILLYM belakang',
        query: { name: 'split' },
        active: nameDepth === 'split',
      },
      {
        label: 'BILLYM depan',
        query: { name: 'lead' },
        active: nameDepth === 'lead',
      },
    ],
  },
  {
    label: 'Teks',
    options: [
      {
        label: 'Balik',
        query: { text: 'invert' },
        active: textMode === 'invert',
      },
      {
        label: 'Marmer',
        query: { text: 'marble' },
        active: textMode === 'marble',
      },
    ],
  },
]

const PANEL_STATE_KEY = 'chd-panel-open'
const panelOpen = ref(false)

function panelHref(change: Record<string, string>): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(route.query)) {
    if (typeof value === 'string' && key !== 'front')
      query.set(key, value)
  }
  for (const [key, value] of Object.entries(change))
    query.set(key, value)
  return `${route.path}?${query.toString()}`
}

function togglePanel() {
  panelOpen.value = !panelOpen.value
  sessionStorage.setItem(PANEL_STATE_KEY, panelOpen.value ? '1' : '0')
}
let scene: SceneLayout = {
  axisX: 0,
  top: 0,
  figureScale: 1,
  shades: [],
}
let mastheadBox: SceneBox | null = null

const fluid = useFluidSimulation()

let gsapCtx: gsap.Context | null = null
let resizeObserver: ResizeObserver | null = null
let fluidReady = false
let figureCanvas: HTMLCanvasElement | null = null
let colourImage: HTMLImageElement | HTMLCanvasElement | null = null
let rampTable: Uint8ClampedArray | null = null
let restTable: Float32Array | null = null
let backdropResizeHandler: (() => void) | null = null
let textDistortion: ReturnType<typeof useHeroTextWarp> | null = null
let textResizeHandler: (() => void) | null = null

let mastheadCapRatio = 0

function inkHeightPerFontSize(): number {
  if (mastheadCapRatio)
    return mastheadCapRatio
  const ctx = document.createElement('canvas').getContext('2d')!
  ctx.font = `400 ${MASTHEAD_PROBE_PX}px ${NAME_FONT}`
  const m = ctx.measureText(MASTHEAD_TEXT)
  mastheadCapRatio = (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent) / MASTHEAD_PROBE_PX
  return mastheadCapRatio
}

function computeMastheadFontSize(): number {
  const w = sectionRef.value?.clientWidth ?? window.innerWidth
  return (w * CAP_PER_VIEWPORT) / inkHeightPerFontSize()
}

/* Gap referensi diukur tinta-ke-tinta, sedangkan nav diposisikan lewat tepi
   box-nya — selisih half-leading plus jarak ascender ke cap harus dibuang
   supaya jarak yang TERLIHAT sama, bukan jarak box-nya */
function navInkTopOffset(): number {
  const link = navRef.value?.querySelector<HTMLElement>('.chd__nav-link')
  if (!link)
    return 0
  const cs = getComputedStyle(link)
  const ctx = document.createElement('canvas').getContext('2d')!
  ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`
  const m = ctx.measureText(link.textContent ?? 'W')
  const lineBox = navRef.value?.getBoundingClientRect().height ?? 0
  const halfLeading = (lineBox - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2
  return Math.max(0, halfLeading + m.fontBoundingBoxAscent - m.actualBoundingBoxAscent)
}

function renderMasthead(fontSize: number): HTMLCanvasElement {
  const target = Math.max(1, Math.round(headRef.value?.clientWidth ?? window.innerWidth))
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const canSpace = 'letterSpacing' in ctx

  function applyFont(spacing: number) {
    ctx.font = `400 ${fontSize}px ${NAME_FONT}`
    if (canSpace)
      ctx.letterSpacing = `${spacing}px`
  }

  function inkWidth(spacing: number): number {
    applyFont(spacing)
    const m = ctx.measureText(MASTHEAD_TEXT)
    return m.actualBoundingBoxLeft + m.actualBoundingBoxRight
  }

  /* Lebar tinta linear terhadap letter-spacing, jadi dua sampel cukup untuk
     menyelesaikan spacing yang membuat teks pas selebar kontainer. Tanpa ini
     canvas di-stretch untuk mengisi lebar dan proporsi huruf Bebas ikut rusak */
  const natural = inkWidth(0)
  const widened = inkWidth(10)
  const spacing = canSpace && widened > natural
    ? ((target - natural) / (widened - natural)) * 10
    : 0

  applyFont(spacing)
  const m = ctx.measureText(MASTHEAD_TEXT)
  const cap = m.actualBoundingBoxAscent + m.actualBoundingBoxDescent
  const padTop = Math.round(cap * INK_TOP_PER_CAP)
  const padBottom = Math.max(0, Math.round(cap * NAV_GAP_PER_CAP - navInkTopOffset()))

  canvas.width = canSpace
    ? target
    : Math.ceil(natural)
  canvas.height = Math.ceil(padTop + cap + padBottom)

  applyFont(spacing)
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(MASTHEAD_TEXT, m.actualBoundingBoxLeft, padTop + m.actualBoundingBoxAscent)

  const starts = Array.from({ length: MASTHEAD_TEXT.length + 1 }, (_, index) => m.actualBoundingBoxLeft + ctx.measureText(MASTHEAD_TEXT.slice(0, index)).width)
  canvas.dataset.starts = starts.join(',')
  canvas.dataset.spacing = String(canSpace
    ? spacing
    : 0)

  return canvas
}

/* Jalur reduced-motion tidak pernah menyentuh WebGL, sedangkan masthead hanya
   ada di canvas — tanpa rasterisasi statis ini hero kosong dan cuma menyisakan
   h1 sr-only. Canvas hanya boleh punya satu jenis context, jadi jalur 2D di
   sini dan jalur WebGL di bawah bersifat saling eksklusif */
function paintStaticMasthead() {
  const canvas = textCanvasRef.value
  if (!canvas)
    return
  const source = renderMasthead(computeMastheadFontSize())
  canvas.width = source.width
  canvas.height = source.height
  canvas.style.aspectRatio = `${source.width} / ${source.height}`
  const ctx = canvas.getContext('2d')
  if (!ctx)
    return
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(source, 0, 0)
}

/* The top of the hair stays at or under the middle of the letters and the forehead under their
   baseline, so the name always meets the hair and never the face, and the upper half of every
   letter stays clear. Its size comes from the grid, and grows only where the photograph would
   otherwise end above the bottom edge. */
function computeScene() {
  const section = sectionRef.value
  const foot = footRef.value
  const text = textCanvasRef.value
  if (!section || !foot || !text)
    return
  const bounds = section.getBoundingClientRect()
  const relative = (element: Element): SceneBox => {
    const box = element.getBoundingClientRect()
    return {
      left: box.left - bounds.left,
      top: box.top - bounds.top,
      width: box.width,
      height: box.height,
    }
  }
  mastheadBox = relative(text)

  const cap = bounds.width * CAP_PER_VIEWPORT
  const inkTop = mastheadBox.top + Math.round(cap * INK_TOP_PER_CAP)
  const crownTop = inkTop + cap * CROWN_AT_CAP
  const faceTop = inkTop + cap + NAME_CLEARANCE
  const column = mastheadBox.width / GRID_COLUMNS
  const columns = HAIR_COLUMNS.find(step => bounds.width >= step.from)?.columns ?? GRID_COLUMNS
  const preferred = (columns * column) / (HAIR_PER_FACE * portrait.faceUnit)
  const axisX = bounds.width / 2
  const reachesFoot = (bounds.height - crownTop) / (portrait.height - portrait.crownRow)
  const figureScale = Math.max(preferred, reachesFoot)
  const left = axisX - portrait.axis * figureScale
  const right = left + portrait.width * figureScale
  scene = {
    axisX,
    top: Math.max(
      faceTop - portrait.foreheadRow * figureScale,
      crownTop - portrait.crownRow * figureScale,
      bounds.height - portrait.height * figureScale,
    ),
    figureScale,
    shades: Array.from(foot.querySelectorAll('.chd__foot-block'), relative)
      .filter(box => box.width > 0 && box.left + box.width > left && box.left < right)
      .slice(0, SHADE_SLOTS),
  }
}

function figureRect(): SceneBox {
  return {
    left: scene.axisX - portrait.axis * scene.figureScale,
    top: scene.top,
    width: portrait.width * scene.figureScale,
    height: portrait.height * scene.figureScale,
  }
}

function labelShades(width: number, height: number): Float32Array {
  const shades = new Float32Array(SHADE_SLOTS * 4)
  scene.shades.forEach((box, slot) => {
    shades.set([
      (box.left - SHADE_PAD) / width,
      (box.left + box.width + SHADE_PAD) / width,
      1 - (box.top - SHADE_GAP) / height,
      1,
    ], slot * 4)
  })
  return shades
}

async function loadImage(src: string): Promise<HTMLImageElement | null> {
  const image = new Image()
  image.decoding = 'async'
  image.src = src
  try {
    await image.decode()
  }
  catch {
    return null
  }
  return image
}

/* The plate the liquid moves: temperature in red, depth in green where the lines are scanned,
   and the matte in alpha. A 2D context can only mask by alpha, so the matte's luminance is
   moved into its alpha channel first. */
function composeFigure(heat: HTMLImageElement | null, matte: HTMLImageElement, depth: HTMLImageElement | null): HTMLCanvasElement | null {
  const width = matte.naturalWidth
  const height = matte.naturalHeight
  const figure = document.createElement('canvas')
  figure.width = width
  figure.height = height
  const mask = document.createElement('canvas')
  mask.width = width
  mask.height = height
  const ctx = figure.getContext('2d')
  const maskCtx = mask.getContext('2d', { willReadFrequently: true })
  if (!ctx || !maskCtx)
    return null
  maskCtx.drawImage(matte, 0, 0)
  const pixels = maskCtx.getImageData(0, 0, width, height)
  for (let i = 0; i < pixels.data.length; i += 4)
    pixels.data[i + 3] = pixels.data[i]!
  maskCtx.putImageData(pixels, 0, 0)

  ctx.imageSmoothingQuality = 'high'
  if (heat) {
    ctx.drawImage(heat, 0, 0, width, height)
  }
  else {
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)
  }
  if (depth)
    writeDepth(ctx, depth, width, height)
  ctx.globalCompositeOperation = 'destination-in'
  ctx.drawImage(mask, 0, 0)
  return figure
}

function writeDepth(ctx: CanvasRenderingContext2D, depth: HTMLImageElement, width: number, height: number) {
  const relief = document.createElement('canvas')
  relief.width = width
  relief.height = height
  const reliefCtx = relief.getContext('2d', { willReadFrequently: true })
  if (!reliefCtx)
    return
  reliefCtx.imageSmoothingQuality = 'high'
  reliefCtx.drawImage(depth, 0, 0, width, height)
  const source = reliefCtx.getImageData(0, 0, width, height).data
  const pixels = ctx.getImageData(0, 0, width, height)
  for (let i = 0; i < pixels.data.length; i += 4)
    pixels.data[i + 1] = source[i]!
  ctx.putImageData(pixels, 0, 0)
}

function toGrayscale(image: HTMLImageElement): HTMLCanvasElement | null {
  const canvas = document.createElement('canvas')
  canvas.width = image.naturalWidth
  canvas.height = image.naturalHeight
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx)
    return null
  ctx.drawImage(image, 0, 0)
  const curve = Uint8ClampedArray.from({ length: 256 }, (_, value) => {
    const x = value / 255
    return Math.round((x * 0.55 + x * x * (3 - 2 * x) * 0.45) * 255)
  })
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = pixels.data
  for (let i = 0; i < data.length; i += 4) {
    const grey = curve[Math.round(data[i]! * MONO_MIX[0] + data[i + 1]! * MONO_MIX[1] + data[i + 2]! * MONO_MIX[2])]!
    data[i] = grey
    data[i + 1] = grey
    data[i + 2] = grey
  }
  ctx.putImageData(pixels, 0, 0)
  return canvas
}

let scenePromise: Promise<boolean> | null = null

function ensureScene(): Promise<boolean> {
  scenePromise ??= loadScene()
  return scenePromise
}

function photoPlate(): 'cinema' | 'colour' {
  return look === 'cinema'
    ? look
    : 'colour'
}

async function loadScene(): Promise<boolean> {
  const [heat, colour, depth, matte] = await Promise.all([
    loadImage(plateSrc(portraitKey, 'heat')),
    showsPhotograph
      ? loadImage(plateSrc(portraitKey, photoPlate()))
      : null,
    loadImage(plateSrc(portraitKey, 'depth')),
    loadImage(plateSrc(portraitKey, 'matte')),
  ])
  const picture = showsPhotograph
    ? colour
    : heat
  if (!matte || !picture || !depth || !heat)
    return false
  figureCanvas = composeFigure(heat, matte, depth)
  colourImage = colour && look === 'grayscale'
    ? toGrayscale(colour)
    : colour
  return figureCanvas !== null && (!showsPhotograph || colourImage !== null)
}

/* Each letter of the masthead as the span of its advance, from where it starts to where the
   tracking after it begins. Ink can overhang the span (the arm of a Y over the foot of an L), so
   the spans come from the font's metrics rather than from gaps in the ink. */
function letterSpans(source: HTMLCanvasElement): Array<[number, number]> {
  const starts = (source.dataset.starts ?? '').split(',').map(Number)
  const spacing = Number(source.dataset.spacing ?? 0)
  if (starts.length !== MASTHEAD_TEXT.length + 1 || starts.some(value => !Number.isFinite(value)))
    return []
  return MASTHEAD_TEXT.split('').map((_, index) => [starts[index]!, starts[index + 1]! - spacing] as [number, number])
}

/* How much of each letter's ink lies on the figure, sampled at half the masthead's resolution. */
function letterCover(source: HTMLCanvasElement, runs: Array<[number, number]>): number[] {
  if (!figureCanvas || !mastheadBox)
    return runs.map(() => 0)
  const scale = 0.5
  const width = Math.max(1, Math.round(source.width * scale))
  const height = Math.max(1, Math.round(source.height * scale))
  const probe = document.createElement('canvas')
  probe.width = width
  probe.height = height
  const ctx = probe.getContext('2d', { willReadFrequently: true })
  if (!ctx)
    return runs.map(() => 0)
  const box = figureRect()
  const sx = width / mastheadBox.width
  const sy = height / mastheadBox.height
  ctx.drawImage(figureCanvas, (box.left - mastheadBox.left) * sx, (box.top - mastheadBox.top) * sy, box.width * sx, box.height * sy)
  const figure = ctx.getImageData(0, 0, width, height).data
  ctx.clearRect(0, 0, width, height)
  ctx.drawImage(source, 0, 0, width, height)
  const ink = ctx.getImageData(0, 0, width, height).data
  return runs.map(([from, to]) => {
    let inked = 0
    let covered = 0
    for (let x = Math.floor(from * scale); x < Math.min(width, Math.ceil(to * scale)); x++) {
      for (let y = 0; y < height; y++) {
        const i = (y * width + x) * 4 + 3
        if (ink[i]! > 127) {
          inked++
          if (figure[i]! > 127)
            covered++
        }
      }
    }
    return inked
      ? covered / inked
      : 0
  })
}

function chooseBehind(cover: number[]): boolean[] {
  if (nameDepth === 'split')
    return cover.map((_, index) => index < SPLIT_LETTERS)
  if (nameDepth === 'lead')
    return cover.map((_, index) => index >= SPLIT_LETTERS)
  return cover.map(value => nameDepth === 'behind' && value >= COVER_MIN)
}

/* Spans of the masthead, as fractions of its width, whose letters sit behind the figure.
   Neighbouring letters behind the figure share one span, cut halfway across the gaps. */
let behindRanges: number[] = []

function updateNameDepth() {
  if (!mastheadBox) {
    behindRanges = []
    return
  }
  const source = renderMasthead(computeMastheadFontSize())
  const runs = letterSpans(source)
  if (!runs.length) {
    behindRanges = []
    return
  }
  const behind = chooseBehind(letterCover(source, runs))
  const edge = (index: number) => index <= 0
    ? 0
    : index >= runs.length
      ? 1
      : (runs[index - 1]![1] + runs[index]![0]) / 2 / source.width
  const ranges: number[] = []
  for (let index = 0; index < runs.length; index++) {
    if (!behind[index])
      continue
    const from = edge(index)
    const to = edge(index + 1)
    const last = ranges.length - 1
    if (last > 0 && Math.abs(ranges[last]! - from) < 1e-6)
      ranges[last] = to
    else
      ranges.push(from, to)
  }
  behindRanges = ranges.slice(0, BEHIND_SLOTS * 2)
}

function maskBehindLetters() {
  const text = textCanvasRef.value
  if (!text)
    return
  if (!behindRanges.length) {
    text.style.removeProperty('mask-image')
    text.style.removeProperty('-webkit-mask-image')
    return
  }
  const stops: string[] = []
  let at = 0
  for (let index = 0; index < behindRanges.length; index += 2) {
    const from = (behindRanges[index]! * 100).toFixed(3)
    const to = (behindRanges[index + 1]! * 100).toFixed(3)
    stops.push(`#000 ${at}%`, `#000 ${from}%`, `transparent ${from}%`, `transparent ${to}%`)
    at = Number(to)
  }
  stops.push(`#000 ${at}%`, '#000 100%')
  const image = `linear-gradient(90deg, ${stops.join(', ')})`
  text.style.setProperty('mask-image', image)
  text.style.setProperty('-webkit-mask-image', image)
}

function behindUniforms(): Float32Array {
  const slots = new Float32Array(BEHIND_SLOTS * 2).fill(2)
  slots.set(behindRanges)
  return slots
}

function clipToRanges(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.beginPath()
  for (let index = 0; index < behindRanges.length; index += 2)
    ctx.rect(behindRanges[index]! * width, 0, (behindRanges[index + 1]! - behindRanges[index]!) * width, height)
}

/* Without a shader the letters behind the figure are painted once into the static scene: the
   masthead colour over the ground, cut away wherever the figure's matte covers it, then added
   onto the figure, which already sits on black. */
function paintBehindLetters(ctx: CanvasRenderingContext2D, ratio: number) {
  if (!mastheadBox || !behindRanges.length || !figureCanvas)
    return
  const width = Math.max(1, Math.round(mastheadBox.width * ratio))
  const height = Math.max(1, Math.round(mastheadBox.height * ratio))
  const layer = document.createElement('canvas')
  layer.width = width
  layer.height = height
  const layerCtx = layer.getContext('2d')
  if (!layerCtx)
    return
  layerCtx.drawImage(renderMasthead(computeMastheadFontSize()), 0, 0, width, height)
  layerCtx.globalCompositeOperation = 'destination-in'
  layerCtx.fillStyle = '#ffffff'
  clipToRanges(layerCtx, width, height)
  layerCtx.fill()
  const lettered = GROUND.map((channel) => {
    const ground = channel / 255
    return Math.round(((1 - 2 * ground) / (1 - ground)) * 255)
  })
  layerCtx.globalCompositeOperation = 'source-in'
  layerCtx.fillStyle = `rgb(${lettered.join(' ')})`
  layerCtx.fillRect(0, 0, width, height)
  layerCtx.globalCompositeOperation = 'destination-out'
  const box = figureRect()
  layerCtx.drawImage(figureCanvas, (box.left - mastheadBox.left) * ratio, (box.top - mastheadBox.top) * ratio, box.width * ratio, box.height * ratio)
  ctx.save()
  ctx.globalCompositeOperation = 'lighter'
  ctx.drawImage(layer, mastheadBox.left * ratio, mastheadBox.top * ratio)
  ctx.restore()
}

/* The masthead blends by difference, so anything warm behind a letter would tint it. On the
   static canvas the letters in front are painted into the plate as cold ground; on the live stage
   the display pass reads the warped letters themselves, so the opening always sits under the
   letter and never beside it. */
function knockOutMasthead(ctx: CanvasRenderingContext2D, ratio: number) {
  if (!mastheadBox)
    return
  const source = renderMasthead(computeMastheadFontSize())
  const ink = document.createElement('canvas')
  ink.width = source.width
  ink.height = source.height
  const inkCtx = ink.getContext('2d')
  if (!inkCtx)
    return
  inkCtx.drawImage(source, 0, 0)
  if (behindRanges.length) {
    inkCtx.globalCompositeOperation = 'destination-out'
    clipToRanges(inkCtx, ink.width, ink.height)
    inkCtx.fill()
  }
  inkCtx.globalCompositeOperation = 'source-in'
  inkCtx.fillStyle = '#000000'
  inkCtx.fillRect(0, 0, ink.width, ink.height)

  ctx.save()
  ctx.globalCompositeOperation = 'source-atop'
  ctx.drawImage(ink, mastheadBox.left * ratio, mastheadBox.top * ratio, mastheadBox.width * ratio, mastheadBox.height * ratio)
  ctx.restore()
}

/* Fades the plate's sides and foot into the ground. On the colour raster, which sits on black,
   black is laid over the edges; on the figure raster the matte is worn away instead, so the ink and
   the touch effects follow the same edge. */
function fadePlateEdges(ctx: CanvasRenderingContext2D, ratio: number, wearsMatte: boolean) {
  const box = figureRect()
  const left = box.left * ratio
  const top = box.top * ratio
  const width = box.width * ratio
  const height = box.height * ratio
  const side = width * PLATE_FADE_SIDE
  const foot = height * PLATE_FADE_FOOT
  ctx.save()
  ctx.globalCompositeOperation = wearsMatte
    ? 'destination-out'
    : 'source-over'
  const edges: Array<[number, number, number, number, number, number, number, number]> = [
    [
      left,
      0,
      left + side,
      0,
      left,
      top,
      side,
      height,
    ],
    [
      left + width,
      0,
      left + width - side,
      0,
      left + width - side,
      top,
      side,
      height,
    ],
    [
      0,
      top + height,
      0,
      top + height - foot,
      left,
      top + height - foot,
      width,
      foot,
    ],
  ]
  for (const [x0, y0, x1, y1, rx, ry, rw, rh] of edges) {
    const gradient = ctx.createLinearGradient(x0, y0, x1, y1)
    gradient.addColorStop(0, 'rgb(0 0 0 / 1)')
    gradient.addColorStop(1, 'rgb(0 0 0 / 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(rx, ry, rw, rh)
  }
  ctx.restore()
}

function paintScene(target: HTMLCanvasElement, ratio: number, bakesLetters: boolean) {
  const ctx = target.getContext('2d')
  if (!ctx || !figureCanvas)
    return
  computeScene()
  ctx.clearRect(0, 0, target.width, target.height)
  ctx.imageSmoothingQuality = 'high'
  const box = figureRect()
  ctx.drawImage(figureCanvas, box.left * ratio, box.top * ratio, box.width * ratio, box.height * ratio)
  fadePlateEdges(ctx, ratio, true)

  if (bakesLetters)
    knockOutMasthead(ctx, ratio)
}

/* The fluid display pass displaces whatever sits in its content texture by the velocity field,
   so painting the scene there is what lets the pointer smear and heat it. At rest the velocity
   is zero and the scene is drawn untouched. */
function paintSceneContent() {
  const canvas = fluidCanvasRef.value
  if (!canvas || !figureCanvas || !fluidReady)
    return
  const content = document.createElement('canvas')
  content.width = canvas.width
  content.height = canvas.height
  const ratio = canvas.width / Math.max(1, canvas.clientWidth)
  paintScene(content, ratio, false)
  updateNameDepth()
  maskBehindLetters()
  fluid.setContentCanvas(content)
  const width = Math.max(1, canvas.clientWidth)
  const height = Math.max(1, canvas.clientHeight)
  fluid.setLetterSource(
    mastheadBox
      ? textCanvasRef.value ?? null
      : null,
    (mastheadBox?.left ?? 0) / width,
    1 - ((mastheadBox?.top ?? 0) + (mastheadBox?.height ?? 0)) / height,
    (mastheadBox?.width ?? 0) / width,
    (mastheadBox?.height ?? 0) / height,
  )
  fluid.setBehindLetters(behindUniforms())
  buildHitGrid()
  fluid.setLabelShades(labelShades(width, height), SHADE_FEATHER / width, SHADE_FADE, SHADE_LEVEL)

  if (!colourImage)
    return
  const colours = document.createElement('canvas')
  colours.width = canvas.width
  colours.height = canvas.height
  paintColours(colours, ratio, false)
  fluid.setAuxCanvas(colours)
}

/* The colour plate sits on black and is laid out exactly like the figure, so the two rasters can
   be read with one coordinate. */
function paintColours(target: HTMLCanvasElement, ratio: number, bakesLetters: boolean) {
  const ctx = target.getContext('2d')
  if (!ctx || !colourImage)
    return
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, target.width, target.height)
  ctx.imageSmoothingQuality = 'high'
  const box = figureRect()
  ctx.drawImage(colourImage, box.left * ratio, box.top * ratio, box.width * ratio, box.height * ratio)
  fadePlateEdges(ctx, ratio, false)
  if (bakesLetters)
    knockOutMasthead(ctx, ratio)
}

/* Indexed by the square root of the temperature, like the plate, to keep the cold end fine. */
function buildRampTable(): Uint8ClampedArray {
  const table = new Uint8ClampedArray(256 * 3)
  const floor = RAMP_COLOURS[0]!
  for (let index = 0; index < 256; index++) {
    const t = (index / 255) ** 2
    let segment = 0
    while (segment < RAMP_STOPS.length - 2 && t >= RAMP_STOPS[segment + 1]!)
      segment++
    const from = RAMP_STOPS[segment]!
    const to = RAMP_STOPS[segment + 1]!
    const x = Math.min(1, Math.max(0, (t - from) / (to - from)))
    const k = x * x * (3 - 2 * x)
    const cold = RAMP_COLOURS[segment]!
    const hot = RAMP_COLOURS[segment + 1]!
    for (let channel = 0; channel < 3; channel++)
      table[index * 3 + channel] = cold[channel]! + (hot[channel]! - cold[channel]!) * k - floor[channel]!
  }
  return table
}

function buildRestTable(): Float32Array {
  const table = new Float32Array(256)
  for (let value = 0; value < 256; value++)
    table[value] = INFRA.lo + (INFRA.hi - INFRA.lo) * ((value / 255) ** 2) ** INFRA.gamma
  return table
}

/* Reduced motion and a missing WebGL context both end here: the same scene, painted once on a
   2D canvas, with the ramp, the hold at rest and the label shades done by hand instead of by the
   shader. */
function paintStaticScene() {
  const canvas = backdropCanvasRef.value
  if (!canvas || !figureCanvas)
    return
  const ratio = Math.min(window.devicePixelRatio || 1, STATIC_MAX_DPR)
  canvas.width = Math.round(canvas.clientWidth * ratio)
  canvas.height = Math.round(canvas.clientHeight * ratio)
  const inColour = showsPhotograph && colourImage !== null
  computeScene()
  updateNameDepth()
  maskBehindLetters()
  if (inColour)
    paintColours(canvas, ratio, true)
  else
    paintScene(canvas, ratio, true)
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx)
    return
  rampTable ??= buildRampTable()
  restTable ??= buildRestTable()
  const shades = labelShades(canvas.clientWidth, canvas.clientHeight)
  const feather = SHADE_FEATHER / canvas.clientWidth
  const ramp = (from: number, to: number, value: number) => {
    const x = Math.min(1, Math.max(0, (value - from) / (to - from)))
    return x * x * (3 - 2 * x)
  }
  const across = scene.shades.map((_, slot) => Float32Array.from({ length: canvas.width }, (_, x) => {
    const u = (x + 0.5) / canvas.width
    return ramp(shades[slot * 4]! - feather, shades[slot * 4]!, u) * (1 - ramp(shades[slot * 4 + 1]!, shades[slot * 4 + 1]! + feather, u))
  }))
  const down = scene.shades.map((_, slot) => Float32Array.from({ length: canvas.height }, (_, y) => {
    return 1 - ramp(shades[slot * 4 + 2]!, shades[slot * 4 + 2]! + SHADE_FADE, 1 - (y + 0.5) / canvas.height)
  }))
  const halfWidth = SCAN.pitch * SCAN.duty / 2
  const aa = 0.6 / ratio
  const scanned = (t: number, depth: number, row: number) => {
    const y = row + (depth - 0.5) * SCAN.bend
    const dist = Math.abs(y / SCAN.pitch - Math.floor(y / SCAN.pitch) - 0.5) * SCAN.pitch
    const line = 1 - ramp(halfWidth - aa, halfWidth + aa, dist)
    return Math.max(0, t - SCAN.gap * (1 - line))
  }
  const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = pixels.data
  for (let y = 0; y < canvas.height; y++) {
    const row = (y + 0.5) / ratio
    for (let x = 0; x < canvas.width; x++) {
      let shade = 0
      for (let slot = 0; slot < across.length; slot++)
        shade = Math.max(shade, across[slot]![x]! * down[slot]![y]!)
      const lift = 1 - (1 - SHADE_LEVEL) * shade
      const i = (y * canvas.width + x) * 4
      if (inColour) {
        data[i] = data[i]! * lift
        data[i + 1] = data[i + 1]! * lift
        data[i + 2] = data[i + 2]! * lift
        continue
      }
      const t = restTable[data[i]!]! * lift
      const shown = scansLines
        ? scanned(t, data[i + 1]! / 255, row)
        : t
      const entry = Math.round(Math.sqrt(shown) * 255) * 3
      const rise = Math.min(1, t * 8)
      const red = rampTable[entry]!
      const green = rampTable[entry + 1]!
      const blue = rampTable[entry + 2]!
      const grey = red * 0.2126 + green * 0.7152 + blue * 0.0722
      const keep = COLD_CHROMA + (1 - COLD_CHROMA) * ramp(0.22, 0.5, shown)
      data[i] = (grey + (red - grey) * keep) * rise
      data[i + 1] = (grey + (green - grey) * keep) * rise
      data[i + 2] = (grey + (blue - grey) * keep) * rise
    }
  }
  ctx.putImageData(pixels, 0, 0)
  paintBehindLetters(ctx, ratio)
}

async function showSceneAsImage() {
  showStaticBackdrop.value = true
  if (!await ensureScene())
    return
  await nextTick()
  paintStaticScene()
  backdropResizeHandler = paintStaticScene
  window.addEventListener('resize', backdropResizeHandler)
}

function applyDisplayGains() {
  fluid.setDisplayGains(displayGains.ink, displayGains.skin, displayGains.warm)
  textCanvasRef.value?.style.setProperty('--chd-figure', `${displayGains.skin}`)
}

/* The ink arrives over the first second of pointer movement instead of at full strength, the
   same way the source route fades its canvas in on first touch. */
function onFirstPointerMove() {
  gsap.to(displayGains, {
    ink: 1,
    duration: INK_ARRIVAL,
    ease: 'power2.out',
    onUpdate: applyDisplayGains,
  })
}

const letterGain = { value: 0 }

const heatState = {
  energy: 0,
  radius: HEAT.start,
  x: 0,
  y: 0,
  lastX: 0,
  lastY: 0,
  lastTime: 0,
}

interface HitGrid {
  alpha: Uint8ClampedArray
  width: number
  height: number
  box: SceneBox
}

let hitGrid: HitGrid | null = null

/* A coarse copy of the figure's matte in its on-screen box, so a pointer event can tell cheaply
   whether it crossed the figure. */
function buildHitGrid() {
  if (!figureCanvas)
    return
  const box = figureRect()
  const width = 160
  const height = Math.max(1, Math.round(width * box.height / Math.max(1, box.width)))
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx)
    return
  ctx.drawImage(figureCanvas, 0, 0, width, height)
  hitGrid = {
    alpha: ctx.getImageData(0, 0, width, height).data,
    width,
    height,
    box,
  }
}

function onFigure(x: number, y: number): boolean {
  if (!hitGrid)
    return false
  const u = (x - hitGrid.box.left) / hitGrid.box.width
  const v = (y - hitGrid.box.top) / hitGrid.box.height
  if (u < 0 || u >= 1 || v < 0 || v >= 1)
    return false
  return hitGrid.alpha[(Math.floor(v * hitGrid.height) * hitGrid.width + Math.floor(u * hitGrid.width)) * 4 + 3]! > 80
}

function onHeatMove(event: PointerEvent) {
  const bounds = sectionRef.value?.getBoundingClientRect()
  if (!bounds)
    return
  const x = event.clientX - bounds.left
  const y = event.clientY - bounds.top
  const now = performance.now()
  const elapsed = heatState.lastTime
    ? Math.min(100, now - heatState.lastTime)
    : 16
  const speed = Math.hypot(x - heatState.lastX, y - heatState.lastY) / Math.max(1, elapsed)
  heatState.lastX = x
  heatState.lastY = y
  heatState.lastTime = now
  if (!onFigure(x, y))
    return
  if (heatState.energy < 0.02) {
    heatState.x = x
    heatState.y = y
    heatState.radius = HEAT.start
  }
  heatState.x += (x - heatState.x) * 0.3
  heatState.y += (y - heatState.y) * 0.3
  heatState.energy = Math.min(1, heatState.energy + Math.min(1, speed / HEAT.full) * (elapsed / 1000) / HEAT.fill)
}

function tickHeat(_time: number, deltaMs: number) {
  const seconds = Math.min(0.1, deltaMs / 1000)
  heatState.energy *= Math.exp(-seconds / HEAT.cool)
  if (heatState.energy > 0.02)
    heatState.radius += HEAT.spread * seconds * (0.35 + heatState.energy)
  const height = sectionRef.value?.clientHeight ?? window.innerHeight
  fluid.setHeat(heatState.x, height - heatState.y, heatState.radius, heatState.energy)
}

/* Letters drawn behind the figure live in the stage canvas, so they fade in on the same curve as
   the masthead canvas does in CSS. */
watch(isTextReady, (ready) => {
  if (!ready)
    return
  gsap.to(letterGain, {
    value: 1,
    duration: LETTER_REVEAL,
    ease: 'expo.out',
    onUpdate: () => fluid.setLetterGain(letterGain.value),
  })
})

onMounted(async () => {
  void ensureScene()
  panelOpen.value = sessionStorage.getItem(PANEL_STATE_KEY) === '1'
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const introShells = [navRef.value, footRef.value].filter(Boolean)
  if (!prefersReduced)
    gsap.set(introShells, { autoAlpha: 0 })

  await document.fonts.load(`400 100px ${NAME_FONT}`)
  await document.fonts.ready

  if (fluidCanvasRef.value) {
    fluidReady = fluid.init(fluidCanvasRef.value, {
      skipInitialSplats: true,
      contentDisplay: true,
      displayMode: FLUID.mode,
      color: FLUID.color,
      curl: FLUID.curl,
      splatRadius: FLUID.splatRadius,
      splatForce: FLUID.splatForce,
      displace: FLUID.displace,
      chromatic: FLUID.chromatic,
      whiteCore: FLUID.whiteCore,
      densityDissipation: FLUID.densityDissipation,
      velocityDissipation: FLUID.velocityDissipation,
      pressureIterations: FLUID.pressureIterations,
    })
    if (fluidReady) {
      fluid.setContentCanvas(createBlankContent())
      fluid.setSceneLook(showsPhotograph ? 1 : 0, scansLines ? 1 : 0, lookMode, textMode === 'marble'
        ? 1
        : 0)
      fluid.setTouchLook(liquidLook, MOTION_LOOK[motion].mode, MOTION_LOOK[motion].reach)
      applyDisplayGains()
      resizeObserver = new ResizeObserver(() => {
        fluid.resize()
        paintSceneContent()
      })
      resizeObserver.observe(fluidCanvasRef.value)
    }
  }

  stageDrawsName.value = fluidReady && !prefersReduced && textMode === 'marble'

  if (prefersReduced) {
    paintStaticMasthead()
    textResizeHandler = paintStaticMasthead
    window.addEventListener('resize', textResizeHandler)
    isTextReady.value = true
    await nextTick()
    await showSceneAsImage()
    return
  }

  if (textCanvasRef.value) {
    const sim = useHeroTextWarp({
      fontSize: computeMastheadFontSize(),
      fontFamily: NAME_FONT,
      fontWeight: 400,
      intensity: 0.06,
      chromaticSpread: 0,
      lines: [
        { text: MASTHEAD_TEXT, indent: 0 },
      ],
      renderText: renderMasthead,
    })
    if (sim.init(textCanvasRef.value)) {
      textDistortion = sim
      textResizeHandler = () => textDistortion?.updateFontSize(computeMastheadFontSize())
      window.addEventListener('resize', textResizeHandler)
      setTimeout(() => {
        sim.start()
        isTextReady.value = true
      }, 300)
    }
    else {
      paintStaticMasthead()
      textResizeHandler = paintStaticMasthead
      window.addEventListener('resize', textResizeHandler)
      isTextReady.value = true
    }
  }

  await nextTick()
  if (fluidReady) {
    if (await ensureScene())
      paintSceneContent()
    sectionRef.value?.addEventListener('pointermove', onFirstPointerMove, { once: true })
    sectionRef.value?.addEventListener('pointermove', onHeatMove, { passive: true })
    gsap.ticker.add(tickHeat)
  }
  else {
    await showSceneAsImage()
  }

  gsapCtx = gsap.context(() => {
    const navItems = navRef.value
      ? Array.from(navRef.value.querySelectorAll<HTMLElement>('.chd__nav-item'))
      : []
    const footBlocks = footRef.value
      ? Array.from(footRef.value.querySelectorAll<HTMLElement>('.chd__foot-block'))
      : []

    gsap.set([
      ...navItems,
      ...footBlocks,
    ], { autoAlpha: 0 })
    gsap.set(introShells, { autoAlpha: 1 })

    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
    })

    /* The figure comes up at once as a cold silhouette and warms to its resting temperature,
       the way a thermal camera settles after it is switched on, instead of fading in as a
       finished picture. */
    if (fluidReady) {
      tl.to(displayGains, {
        skin: 1,
        duration: BACKDROP_REVEAL.duration,
        ease: 'power3.out',
        onUpdate: applyDisplayGains,
      }, BACKDROP_REVEAL.at)
      tl.to(displayGains, {
        warm: 1,
        duration: BACKDROP_REVEAL.warm,
        ease: 'expo.out',
        onUpdate: applyDisplayGains,
      }, BACKDROP_REVEAL.at)
    }

    navItems.forEach((item, i) => {
      tl.to(item, { autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 0.5 + i * 0.08)
    })

    footBlocks.forEach((block, i) => {
      tl.to(block, { autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 0.75 + i * 0.1)
    })
  })
})

onUnmounted(() => {
  gsap.killTweensOf([displayGains, letterGain])
  sectionRef.value?.removeEventListener('pointermove', onFirstPointerMove)
  sectionRef.value?.removeEventListener('pointermove', onHeatMove)
  gsap.ticker.remove(tickHeat)
  gsapCtx?.revert()
  fluid.destroy()
  textDistortion?.destroy()
  textDistortion = null
  resizeObserver?.disconnect()
  if (textResizeHandler)
    window.removeEventListener('resize', textResizeHandler)
  if (backdropResizeHandler)
    window.removeEventListener('resize', backdropResizeHandler)
})
</script>

<template>
  <section
    ref="sectionRef"
    class="chd"
    aria-label="Billy Maulana — Frontend Architect & Creative Developer"
  >
    <canvas
      ref="fluidCanvasRef"
      class="chd__canvas"
      aria-hidden="true"
    />

    <canvas
      v-if="showStaticBackdrop"
      ref="backdropCanvasRef"
      class="chd__backdrop"
      aria-hidden="true"
    />

    <div class="chd__grain" aria-hidden="true" />

    <div ref="headRef" class="chd__head" :class="{ 'chd__head--ready': isTextReady, 'chd__head--stage': stageDrawsName }">
      <canvas
        ref="textCanvasRef"
        class="chd__text-canvas"
        aria-hidden="true"
      />
      <h1 class="sr-only">
        Billy Maulana
      </h1>

      <nav ref="navRef" class="chd__nav" aria-label="Hero navigation">
        <ul class="chd__nav-links">
          <li v-for="link in NAV_LINKS" :key="link.href" class="chd__nav-item">
            <a class="chd__nav-link" :href="link.href">{{ link.label }}</a>
          </li>
        </ul>
        <div class="chd__nav-item chd__nav-status">
          <span class="chd__nav-status-label">Available for select work</span>
        </div>
      </nav>
    </div>

    <div ref="footRef" class="chd__foot">
      <div class="chd__foot-block chd__foot-role">
        <p class="chd__foot-lines">
          Frontend Architect &amp;<br>Creative Developer
        </p>
        <a class="chd__foot-link" href="#about">Explore <span aria-hidden="true">&#8600;</span></a>
      </div>
      <div class="chd__foot-block chd__foot-scroll" aria-hidden="true">
        Scroll
      </div>
      <div class="chd__foot-block chd__foot-clients">
        <p class="chd__foot-lines">
          PLN Mobile, Flexben,<br>UNESCO IHP
        </p>
        <a class="chd__foot-link" href="#work">View work <span aria-hidden="true">&#8600;</span></a>
      </div>
    </div>

    <aside
      v-if="showsPanel"
      class="chd__panel"
      aria-label="Pilihan eksplorasi"
      @pointermove.stop
    >
      <button
        type="button"
        class="chd__panel-toggle"
        :aria-expanded="panelOpen"
        @click="togglePanel"
      >
        Panel
      </button>
      <div v-show="panelOpen" class="chd__panel-body">
        <div class="chd__panel-group">
          <p class="chd__panel-label">
            Foto
          </p>
          <ul class="chd__panel-photos">
            <li v-for="key in PORTRAIT_KEYS" :key="key">
              <a
                class="chd__panel-photo"
                :class="{ 'chd__panel-photo--active': key === portraitKey }"
                :href="panelHref({ photo: key })"
                :aria-label="`Foto ${key}`"
                :aria-current="key === portraitKey ? 'true' : undefined"
              >
                <img
                  :src="thumbSrc(key)"
                  alt=""
                  width="48"
                  height="60"
                  decoding="async"
                >
              </a>
            </li>
          </ul>
        </div>
        <div v-for="group in PANEL_GROUPS" :key="group.label" class="chd__panel-group">
          <p class="chd__panel-label">
            {{ group.label }}
          </p>
          <div class="chd__panel-options">
            <a
              v-for="option in group.options"
              :key="option.label"
              class="chd__panel-option"
              :class="{ 'chd__panel-option--active': option.active }"
              :href="panelHref(option.query)"
              :aria-current="option.active ? 'true' : undefined"
            >{{ option.label }}</a>
          </div>
        </div>
      </div>
    </aside>
  </section>
</template>

<style scoped>
.chd {
  --chd-pad: clamp(0.9375rem, 2.08vw, 1.875rem);
  --chd-top: clamp(0.9375rem, 2.08vw, 1.875rem);
  --chd-bottom: clamp(2rem, 4vh, 3rem);

  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background:
    radial-gradient(ellipse 70% 50% at 50% 50%, rgba(6, 6, 16, 0.6) 0%, transparent 70%),
    #060610;
}

.chd__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: auto;
  mix-blend-mode: screen;
}

.chd__backdrop {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mix-blend-mode: screen;
}

.chd__grain {
  position: absolute;
  z-index: 50;
  inset: 0;
  background: url('/assets/textures/grain-generated-film-1024.png') repeat;
  background-size: 512px;
  mix-blend-mode: screen;
  opacity: 0.08;
  filter: contrast(1.9) brightness(0.62);
  pointer-events: none;
}

.chd__head {
  position: absolute;
  top: var(--chd-top);
  left: var(--chd-pad);
  right: var(--chd-pad);
  pointer-events: none;
}

.chd__text-canvas {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1380 / 285;
  mix-blend-mode: difference;
  opacity: 0;
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.chd__head--ready .chd__text-canvas {
  opacity: 1;
}

.chd__head--stage .chd__text-canvas,
.chd__head--stage.chd__head--ready .chd__text-canvas {
  opacity: 0;
}

.chd__nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: 'Satoshi', 'Inter', system-ui, sans-serif;
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(242, 239, 234, 0.96);
}

.chd__nav-links {
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 2.75rem);
}

.chd__nav-link {
  pointer-events: auto;
  color: rgba(242, 239, 234, 0.96);
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.chd__nav-link:hover {
  color: #F2EFEA;
}

.chd__nav-link,
.chd__foot-link {
  position: relative;
}

.chd__nav-link::after,
.chd__foot-link::after {
  content: '';
  position: absolute;
  inset: -1rem -0.5rem;
}

.chd__nav-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(232, 232, 236, 0.82);
}

.chd__nav-status-label {
  margin-right: -0.18em;
}

.chd__foot {
  position: absolute;
  bottom: var(--chd-bottom);
  left: var(--chd-pad);
  right: var(--chd-pad);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  pointer-events: none;
  font-family: 'Satoshi', 'Inter', system-ui, sans-serif;
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(232, 232, 236, 0.82);
}

.chd__foot-lines {
  line-height: 1.7;
}

.chd__foot-role .chd__foot-lines {
  text-indent: clamp(2rem, 4vw, 3.5rem);
}

.chd__foot-link {
  display: inline-block;
  margin-top: 0.85rem;
  pointer-events: auto;
  color: rgba(242, 239, 234, 0.96);
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.chd__foot-link:hover {
  color: #F2EFEA;
}

.chd__foot-scroll {
  color: rgba(232, 232, 236, 0.82);
}

.chd__foot-clients {
  text-align: right;
  margin-right: -0.18em;
}

.chd__panel {
  position: absolute;
  z-index: 60;
  top: 50%;
  right: var(--chd-pad);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
  transform: translateY(-50%);
  font-family: 'Satoshi', 'Inter', system-ui, sans-serif;
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 1.3;
  letter-spacing: 0.02em;
  color: rgba(242, 239, 234, 0.92);
}

.chd__panel-toggle {
  padding: 0.375rem 0.8125rem;
  border: 1px solid rgba(242, 239, 234, 0.16);
  border-radius: 999px;
  background: rgba(6, 6, 16, 0.72);
  backdrop-filter: blur(8px);
  color: inherit;
  font: inherit;
  letter-spacing: inherit;
  cursor: pointer;
  transition: border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.chd__panel-toggle:hover,
.chd__panel-toggle[aria-expanded='true'] {
  border-color: rgba(242, 239, 234, 0.48);
}

.chd__panel-body {
  display: flex;
  flex-direction: column;
  gap: 0.8125rem;
  width: 14.5rem;
  padding: 0.8125rem;
  border: 1px solid rgba(242, 239, 234, 0.12);
  border-radius: 0.75rem;
  background: rgba(6, 6, 16, 0.86);
  backdrop-filter: blur(12px);
}

.chd__panel-label {
  margin: 0 0 0.5rem;
  color: rgba(232, 232, 236, 0.56);
}

.chd__panel-photos {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.375rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.chd__panel-photo {
  display: block;
  overflow: hidden;
  border-radius: 0.25rem;
  outline: 1px solid transparent;
  outline-offset: 1px;
  opacity: 0.72;
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), outline-color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.chd__panel-photo img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

.chd__panel-photo:hover,
.chd__panel-photo--active {
  opacity: 1;
}

.chd__panel-photo--active {
  outline-color: #F2EFEA;
}

.chd__panel-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.chd__panel-option {
  padding: 0.3125rem 0.625rem;
  border: 1px solid rgba(242, 239, 234, 0.16);
  border-radius: 999px;
  color: inherit;
  text-decoration: none;
  transition: border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.chd__panel-option:hover {
  border-color: rgba(242, 239, 234, 0.48);
}

.chd__panel-option--active {
  border-color: #F2EFEA;
  background: #F2EFEA;
  color: #060610;
}

@media (max-width: 768px) {
  .chd__nav {
    font-size: 0.6875rem;
  }

  .chd__nav-status {
    display: none;
  }

  .chd__foot {
    bottom: 1.5rem;
  }

  .chd__foot-scroll,
  .chd__foot-clients {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chd__canvas {
    display: none;
  }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
