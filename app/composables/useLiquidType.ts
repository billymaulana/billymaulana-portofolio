import { liquidDisplayFragment, liquidTrailFragment, liquidTypeVertex } from '~/utils/liquidTypeShaders'

interface LiquidTypeConfig {
  lines: { text: string, indent: number }[]
  fontSize: number
  fontFamily: string
  fontWeight: number
  fillStyle: string
  accent: [number, number, number]
  strength: number
  decay: number
}

const defaults: LiquidTypeConfig = {
  lines: [{ text: 'VOID', indent: 0 }],
  fontSize: 240,
  fontFamily: '\'PP Editorial New\', Georgia, serif',
  fontWeight: 800,
  fillStyle: '#F2EFEA',
  accent: [1.0, 0.68, 0.35],
  strength: 0.11,
  decay: 0.955,
}

interface GLProgram {
  program: WebGLProgram
  uniforms: Record<string, WebGLUniformLocation>
}

interface Target {
  fbo: WebGLFramebuffer
  tex: WebGLTexture
}

export function useLiquidType(config: Partial<LiquidTypeConfig> = {}) {
  const cfg = { ...defaults, ...config }
  const fps = ref(0)

  let gl: WebGLRenderingContext | null = null
  let canvas: HTMLCanvasElement | null = null
  let trailProg: GLProgram | null = null
  let displayProg: GLProgram | null = null
  let textTex: WebGLTexture | null = null
  let trailA: Target | null = null
  let trailB: Target | null = null
  let trailW = 0
  let trailH = 0
  let raf = 0
  let running = false
  let frames = 0
  let lastFpsAt = 0

  let px = 0.5
  let py = 0.5
  let vx = 0
  let vy = 0
  let lastX = 0.5
  let lastY = 0.5

  function compile(type: number, src: string): WebGLShader | null {
    const s = gl!.createShader(type)
    if (!s)
      return null
    gl!.shaderSource(s, src)
    gl!.compileShader(s)
    if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
      console.error('[liquidType]', gl!.getShaderInfoLog(s))
      return null
    }
    return s
  }

  function makeProgram(fragSrc: string): GLProgram | null {
    const vs = compile(gl!.VERTEX_SHADER, liquidTypeVertex)
    const fs = compile(gl!.FRAGMENT_SHADER, fragSrc)
    if (!vs || !fs)
      return null
    const program = gl!.createProgram()!
    gl!.attachShader(program, vs)
    gl!.attachShader(program, fs)
    gl!.bindAttribLocation(program, 0, 'aPosition')
    gl!.linkProgram(program)
    if (!gl!.getProgramParameter(program, gl!.LINK_STATUS))
      return null
    const uniforms: Record<string, WebGLUniformLocation> = {}
    const n = gl!.getProgramParameter(program, gl!.ACTIVE_UNIFORMS)
    for (let i = 0; i < n; i++) {
      const info = gl!.getActiveUniform(program, i)!
      uniforms[info.name] = gl!.getUniformLocation(program, info.name)!
    }
    return { program, uniforms }
  }

  function makeTarget(w: number, h: number): Target {
    const tex = gl!.createTexture()!
    gl!.bindTexture(gl!.TEXTURE_2D, tex)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
    const bias = new Uint8Array(w * h * 4)
    for (let i = 0; i < bias.length; i += 4) {
      bias[i] = 128
      bias[i + 1] = 128
      bias[i + 3] = 255
    }
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, w, h, 0, gl!.RGBA, gl!.UNSIGNED_BYTE, bias)
    const fbo = gl!.createFramebuffer()!
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo)
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, tex, 0)
    return { fbo, tex }
  }

  function renderTextTexture() {
    const off = document.createElement('canvas')
    const ctx = off.getContext('2d')!
    ctx.font = `${cfg.fontWeight} ${cfg.fontSize}px ${cfg.fontFamily}`
    let maxW = 0
    for (const line of cfg.lines)
      maxW = Math.max(maxW, ctx.measureText(line.text).width + line.indent)
    const lineH = cfg.fontSize * 0.94
    off.width = Math.ceil(maxW + cfg.fontSize * 0.12)
    off.height = Math.ceil(lineH * cfg.lines.length + cfg.fontSize * 0.28)
    ctx.font = `${cfg.fontWeight} ${cfg.fontSize}px ${cfg.fontFamily}`
    ctx.fillStyle = cfg.fillStyle
    ctx.textBaseline = 'top'
    cfg.lines.forEach((line, i) => {
      ctx.fillText(line.text, line.indent, i * lineH + cfg.fontSize * 0.08)
    })

    canvas!.style.aspectRatio = `${off.width} / ${off.height}`
    const dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.5 : 2)
    canvas!.width = Math.floor(canvas!.clientWidth * dpr)
    canvas!.height = Math.floor(canvas!.clientHeight * dpr)

    textTex = gl!.createTexture()!
    gl!.bindTexture(gl!.TEXTURE_2D, textTex)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
    gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, true)
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, off)
    gl!.pixelStorei(gl!.UNPACK_FLIP_Y_WEBGL, false)
  }

  function frame(now: number) {
    if (!gl || !canvas || !trailProg || !displayProg || !trailA || !trailB)
      return

    frames++
    if (now - lastFpsAt >= 1000) {
      fps.value = frames
      frames = 0
      lastFpsAt = now
    }

    vx *= 0.86
    vy *= 0.86

    gl.bindFramebuffer(gl.FRAMEBUFFER, trailB.fbo)
    gl.viewport(0, 0, trailW, trailH)
    gl.useProgram(trailProg.program)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, trailA.tex)
    gl.uniform1i(trailProg.uniforms.uPrev!, 0)
    gl.uniform2f(trailProg.uniforms.uPointer!, px, py)
    gl.uniform2f(trailProg.uniforms.uVelocity!, vx, vy)
    gl.uniform1f(trailProg.uniforms.uAspect!, canvas.width / canvas.height)
    gl.uniform1f(trailProg.uniforms.uDecay!, cfg.decay)
    gl.uniform1f(trailProg.uniforms.uRadius!, 0.014)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(displayProg.program)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textTex)
    gl.uniform1i(displayProg.uniforms.uText!, 0)
    gl.activeTexture(gl.TEXTURE1)
    gl.bindTexture(gl.TEXTURE_2D, trailB.tex)
    gl.uniform1i(displayProg.uniforms.uTrail!, 1)
    gl.uniform1f(displayProg.uniforms.uStrength!, cfg.strength)
    gl.uniform3f(displayProg.uniforms.uAccent!, cfg.accent[0], cfg.accent[1], cfg.accent[2])
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

    const t = trailA
    trailA = trailB
    trailB = t

    if (running)
      raf = requestAnimationFrame(frame)
  }

  function onPointerMove(e: PointerEvent) {
    if (!canvas)
      return
    const rect = canvas.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width
    const ny = 1.0 - (e.clientY - rect.top) / rect.height
    vx = Math.max(-1, Math.min(1, vx + (nx - lastX) * 14))
    vy = Math.max(-1, Math.min(1, vy + (ny - lastY) * 14))
    lastX = nx
    lastY = ny
    px = nx
    py = ny
  }

  function start() {
    if (running || !gl)
      return
    running = true
    lastFpsAt = performance.now()
    raf = requestAnimationFrame(frame)
  }

  function pause() {
    running = false
    cancelAnimationFrame(raf)
  }

  function init(el: HTMLCanvasElement): boolean {
    canvas = el
    gl = el.getContext('webgl', { alpha: true, depth: false, antialias: false, premultipliedAlpha: true })
    if (!gl)
      return false

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0, 0, 0, 0)

    trailProg = makeProgram(liquidTrailFragment)
    displayProg = makeProgram(liquidDisplayFragment)
    if (!trailProg || !displayProg)
      return false

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)

    renderTextTexture()

    trailW = Math.max(64, Math.floor(canvas.width / 3))
    trailH = Math.max(64, Math.floor(canvas.height / 3))
    trailA = makeTarget(trailW, trailH)
    trailB = makeTarget(trailW, trailH)

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('visibilitychange', onVisibility)
    return true
  }

  function onVisibility() {
    if (document.hidden)
      pause()
    else
      start()
  }

  function destroy() {
    pause()
    window.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('visibilitychange', onVisibility)
    gl = null
    canvas = null
  }

  return { init, start, pause, destroy, fps }
}
