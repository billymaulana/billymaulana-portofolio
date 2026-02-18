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
}

const defaultDistortionConfig: DistortionConfig = {
  fontSize: 200,
  fontWeight: 700,
  fontFamily: '\'Clash Display\', Satoshi, system-ui, sans-serif',
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

    // Velocity boost — reactive but controlled
    float velBoost = 1.0 + uVelocity * 3.0;

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

    // Concentric ripple waves — surface tension
    float ripple = sin(dist * 18.0 - uTime * 4.0) * 0.12 * influence;

    // Secondary ripple — creates interference pattern
    float ripple2 = sin(dist * 30.0 - uTime * 2.5) * 0.04 * influence;

    // Turbulent micro-displacement via fbm
    float turbX = fbm(uv * 12.0 + uTime * 0.35) * 0.18 * influence;
    float turbY = fbm(uv * 12.0 + uTime * 0.35 + 50.0) * 0.18 * influence;

    // Combine: swirl + perpendicular rotation + push
    vec2 displacement = vec2(0.0);
    displacement += flowDir * influence * 0.15;        // gentle push away
    displacement += perpDir * influence * 0.4;         // strong perpendicular rotation
    displacement += swirlDir * influence * 0.6;        // organic turbulent swirl
    displacement += flowDir * (ripple + ripple2);      // ripple waves
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

export function useTextDistortion(config: Partial<DistortionConfig> = {}) {
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
    const textCanvas = renderTextToCanvas()
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
    const textCanvas = renderTextToCanvas()
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
    const textCanvas = renderTextToCanvas()
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
