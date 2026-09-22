<script setup lang="ts">
definePageMeta({
  standalone: true,
})

useSeoMeta({
  title: 'Checkpoint — Hero 1',
  robots: 'noindex',
})

/* Rute checkpoint sengaja mandiri: seluruh engine, state, dan style yang dipakainya tinggal di
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
  const cfg = { ...defaultDistortionConfig, ...config }
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
    return cfg.renderText ? cfg.renderText(cfg.fontSize) : renderTextToCanvas()
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
    const velLerp = targetVel > smoothVelocity ? 0.3 : 0.05
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
      preserveDrawingBuffer: false,
    }) as WebGL2RenderingContext

    if (!gl) {
      gl = canvas.getContext('webgl', {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
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

/* ── engine: simulasi fluida ────────────────────────────────── */
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
  color: FluidColor
}

function useFluidSimulation() {
  // ── State ──
  let canvas: HTMLCanvasElement | null = null
  let gl: WebGL2RenderingContext | WebGLRenderingContext | null = null
  let ext: GLFormats | null = null
  let isWebGL2 = false
  let animFrameId = 0

  // ── Config (Pavel defaults) ──
  const config = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1024,
    DENSITY_DISSIPATION: 1.5,
    VELOCITY_DISSIPATION: 0.6,
    PRESSURE: 0.8,
    PRESSURE_ITERATIONS: 20,
    CURL: 18,
    SPLAT_RADIUS: 0.25,
    SPLAT_FORCE: 6000,
    SHADING: true,
    COLORFUL: true,
    COLOR_UPDATE_SPEED: 10,
    PAUSED: false,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    TRANSPARENT: false,
    BLOOM: true,
    BLOOM_ITERATIONS: 8,
    BLOOM_RESOLUTION: 256,
    BLOOM_INTENSITY: 0.8,
    BLOOM_THRESHOLD: 0.6,
    BLOOM_SOFT_KNEE: 0.7,
    SUNRAYS: true,
    SUNRAYS_RESOLUTION: 196,
    SUNRAYS_WEIGHT: 1.0,
  }

  // ── Pointers ──
  const pointers: Pointer[] = []
  let splatStack: number[] = []

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
    void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
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
    const params: WebGLContextAttributes = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false }

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
      ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering },
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

    pointers.forEach((p) => {
      if (p.moved) {
        p.moved = false
        splatPointer(p)
      }
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
    const width = target == null ? g.drawingBufferWidth : target.width
    const height = target == null ? g.drawingBufferHeight : target.height

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

  function splatPointer(pointer: Pointer) {
    const dx = pointer.deltaX * config.SPLAT_FORCE
    const dy = pointer.deltaY * config.SPLAT_FORCE
    splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color)
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

  function splat(x: number, y: number, dx: number, dy: number, color: FluidColor) {
    const g = gl!
    splatProgram!.bind()
    g.uniform1i(splatProgram!.uniforms.uTarget!, velocity!.read.attach(0))
    g.uniform1f(splatProgram!.uniforms.aspectRatio!, canvas!.width / canvas!.height)
    g.uniform2f(splatProgram!.uniforms.point!, x, y)
    g.uniform3f(splatProgram!.uniforms.color!, dx, dy, 0.0)
    g.uniform1f(splatProgram!.uniforms.radius!, correctRadius(config.SPLAT_RADIUS / 100.0))
    blit!(velocity!.write)
    velocity!.swap()

    g.uniform1i(splatProgram!.uniforms.uTarget!, dye!.read.attach(0))
    g.uniform3f(splatProgram!.uniforms.color!, color.r, color.g, color.b)
    blit!(dye!.write)
    dye!.swap()
  }

  function correctRadius(radius: number): number {
    const aspectRatio = canvas!.width / canvas!.height
    if (aspectRatio > 1)
      radius *= aspectRatio
    return radius
  }

  function generateColor(): FluidColor {
    const c = HSVtoRGB(Math.random(), 1.0, 1.0)
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
  }

  function updatePointerMoveData(pointer: Pointer, posX: number, posY: number) {
    pointer.prevTexcoordX = pointer.texcoordX
    pointer.prevTexcoordY = pointer.texcoordY
    pointer.texcoordX = posX / canvas!.width
    pointer.texcoordY = 1.0 - posY / canvas!.height
    pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX)
    pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY)
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0
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

  function update() {
    const dt = calcDeltaTime()
    if (resizeCanvas())
      initFramebuffers()
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

  function init(canvasEl: HTMLCanvasElement, options?: { skipInitialSplats?: boolean }): boolean {
    canvas = canvasEl

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
      compileShader(gl.FRAGMENT_SHADER, advectionShaderSource, ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']),
    )

    displayMaterial = createMaterial(baseVertexShader, displayShaderSource)

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
    initFramebuffers()

    // Initial splats (skip if hero wants black-first activation)
    if (!options?.skipInitialSplats)
      multipleSplats(Math.floor(Math.random() * 20) + 5)

    setupEventListeners()

    lastUpdateTime = Date.now()
    update()

    return true
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
    pointers.length = 0
    splatStack = []
  }

  return { init, resize, destroy }
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

const sectionRef = ref<HTMLElement>()
const headRef = ref<HTMLElement>()
const fluidCanvasRef = ref<HTMLCanvasElement>()
const textCanvasRef = ref<HTMLCanvasElement>()
const navRef = ref<HTMLElement>()
const footRef = ref<HTMLElement>()
const isTextReady = ref(false)

const fluid = useFluidSimulation()

let gsapCtx: gsap.Context | null = null
let resizeObserver: ResizeObserver | null = null
let fluidReady = false
let fluidActivated = false
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

  canvas.width = canSpace ? target : Math.ceil(natural)
  canvas.height = Math.ceil(padTop + cap + padBottom)

  applyFont(spacing)
  ctx.fillStyle = '#ffffff'
  ctx.textBaseline = 'alphabetic'
  ctx.fillText(MASTHEAD_TEXT, m.actualBoundingBoxLeft, padTop + m.actualBoundingBoxAscent)

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

onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  await document.fonts.load(`400 100px ${NAME_FONT}`)
  await document.fonts.ready

  if (fluidCanvasRef.value) {
    fluidReady = fluid.init(fluidCanvasRef.value, { skipInitialSplats: true })
    if (fluidReady) {
      fluidCanvasRef.value.style.opacity = '0'
      resizeObserver = new ResizeObserver(() => fluid.resize())
      resizeObserver.observe(fluidCanvasRef.value)
    }
  }

  if (prefersReduced) {
    paintStaticMasthead()
    textResizeHandler = paintStaticMasthead
    window.addEventListener('resize', textResizeHandler)
    isTextReady.value = true
    return
  }

  if (textCanvasRef.value) {
    const sim = useHeroTextWarp({
      fontSize: computeMastheadFontSize(),
      fontFamily: NAME_FONT,
      fontWeight: 400,
      intensity: 0.06,
      chromaticSpread: 0,
      lines: [{ text: MASTHEAD_TEXT, indent: 0 }],
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
  }

  function onFirstPointerMove() {
    if (fluidActivated || !fluidCanvasRef.value)
      return
    fluidActivated = true
    import('gsap').then(({ default: g }) => {
      g.to(fluidCanvasRef.value!, { opacity: 1, duration: 1.2, ease: 'power2.out' })
    })
  }
  sectionRef.value?.addEventListener('pointermove', onFirstPointerMove)

  const gsapModule = await import('gsap')
  const gsap = gsapModule.default

  gsap.set([navRef.value, footRef.value].filter(Boolean), { autoAlpha: 0 })

  gsapCtx = gsap.context(() => {
    const navItems = navRef.value
      ? Array.from(navRef.value.querySelectorAll<HTMLElement>('.chd__nav-item'))
      : []
    const footBlocks = footRef.value
      ? Array.from(footRef.value.querySelectorAll<HTMLElement>('.chd__foot-block'))
      : []

    gsap.set([...navItems, ...footBlocks], { autoAlpha: 0 })
    gsap.set([navRef.value, footRef.value].filter(Boolean), { autoAlpha: 1 })

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

    navItems.forEach((item, i) => {
      tl.to(item, { autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 0.5 + i * 0.08)
    })

    footBlocks.forEach((block, i) => {
      tl.to(block, { autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 0.75 + i * 0.1)
    })
  })
})

onUnmounted(() => {
  gsapCtx?.revert()
  fluid.destroy()
  textDistortion?.destroy()
  textDistortion = null
  resizeObserver?.disconnect()
  if (textResizeHandler)
    window.removeEventListener('resize', textResizeHandler)
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

    <div class="chd__grain" aria-hidden="true" />

    <div ref="headRef" class="chd__head" :class="{ 'chd__head--ready': isTextReady }">
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
  z-index: 3;
  pointer-events: auto;
  mix-blend-mode: screen;
}

.chd__grain {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  opacity: 0.05;
  mix-blend-mode: overlay;
  background-image: url('/assets/textures/grain.png');
  background-size: 200px 200px;
  background-repeat: repeat;
}

.chd__head {
  position: absolute;
  top: var(--chd-top);
  left: var(--chd-pad);
  right: var(--chd-pad);
  z-index: 5;
  pointer-events: none;
  mix-blend-mode: difference;
}

.chd__text-canvas {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1380 / 285;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.chd__head--ready .chd__text-canvas {
  opacity: 1;
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
  color: rgba(232, 232, 236, 0.78);
}

.chd__nav-links {
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 2.75rem);
}

.chd__nav-link {
  pointer-events: auto;
  color: rgba(232, 232, 236, 0.78);
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.chd__nav-link:hover {
  color: #F2EFEA;
}

.chd__nav-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(208, 208, 216, 0.62);
}

.chd__nav-status-label {
  margin-right: -0.18em;
}

.chd__foot {
  position: absolute;
  bottom: var(--chd-bottom);
  left: var(--chd-pad);
  right: var(--chd-pad);
  z-index: 6;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  pointer-events: none;
  font-family: 'Satoshi', 'Inter', system-ui, sans-serif;
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(208, 208, 216, 0.62);
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
  color: rgba(232, 232, 236, 0.78);
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.chd__foot-link:hover {
  color: #F2EFEA;
}

.chd__foot-scroll {
  color: rgba(208, 208, 216, 0.62);
}

.chd__foot-clients {
  text-align: right;
  margin-right: -0.18em;
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
