/**
 * WebGL Fluid Simulation
 * Based on Jos Stam's "Stable Fluids" — GPU-accelerated Navier-Stokes via fragment shaders.
 * Closely follows Pavel Dobryakov's reference implementation.
 */

interface FluidConfig {
  simResolution: number
  dyeResolution: number
  densityDissipation: number
  velocityDissipation: number
  pressureIterations: number
  splatRadius: number
  splatForce: number
  colorPalette: [number, number, number][]
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
  color: [number, number, number]
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

interface Program {
  program: WebGLProgram
  uniforms: Record<string, WebGLUniformLocation>
  bind: () => void
}

const defaultConfig: FluidConfig = {
  simResolution: 128,
  dyeResolution: 1024,
  densityDissipation: 1.5,
  velocityDissipation: 0.3,
  pressureIterations: 20,
  splatRadius: 8.0,
  splatForce: 6000,
  colorPalette: [
    [0, 0.28, 1], // Electric Blue
    [0, 0.64, 1], // Light Blue
    [0, 0.96, 1], // Cyan
    [0.27, 0, 1], // Deep Purple
    [0, 0.5, 1], // Mid Blue
  ],
}

// ─── GLSL Shaders ───────────────────────────────────
// Single vertex shader for ALL programs (reference pattern)
const baseVertexShader = `
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

const clearShader = `
  precision mediump float;
  precision mediump sampler2D;
  varying highp vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;

  void main () {
    gl_FragColor = value * texture2D(uTexture, vUv);
  }
`

const displayShader = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTexture;

  void main () {
    vec3 c = texture2D(uTexture, vUv).rgb;

    // Filmic tone-mapping: prevents channels from saturating to white/grey
    float exposure = 1.8;
    c = 1.0 - exp(-c * exposure);

    // Blend with subtle ambient blue gradient so saturation shows palette, not grey
    vec3 ambient = mix(
      vec3(0.0, 0.18, 0.65),
      vec3(0.0, 0.5, 0.65),
      vUv.y
    );
    c = mix(ambient * 0.15, c, 0.85 + 0.15 * smoothstep(0.0, 0.3, length(c)));

    float a = max(c.r, max(c.g, c.b));
    gl_FragColor = vec4(c, a);
  }
`

const splatShader = `
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

const advectionShader = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform float dt;
  uniform float dissipation;

  void main () {
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = result / decay;
  }
`

const divergenceShader = `
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

const pressureShader = `
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
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`

const gradientSubtractShader = `
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
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`

// ─── Composable ─────────────────────────────────────

export function useFluidSimulation(config: Partial<FluidConfig> = {}) {
  const cfg = { ...defaultConfig, ...config }
  let gl: WebGL2RenderingContext | WebGLRenderingContext | null = null
  let canvas: HTMLCanvasElement | null = null
  let animationId = 0
  let lastUpdateTime = Date.now()
  let colorIndex = 0

  // Framebuffers
  let dye: DoubleFBO
  let velocity: DoubleFBO
  let divergenceFBO: FBO
  let pressure: DoubleFBO

  // Programs
  let clearProgram: Program
  let displayProgram: Program
  let splatProgram: Program
  let advectionProgram: Program
  let divergenceProgram: Program
  let pressureProgram: Program
  let gradientSubtractProgram: Program

  // Blit function (set up once during init)
  let blit: (target: FBO | null) => void

  // Pointers
  const pointers: Pointer[] = []
  const splatStack: number[] = []

  function getNextColor(): [number, number, number] {
    const c = cfg.colorPalette[colorIndex % cfg.colorPalette.length]
    colorIndex++
    return [c[0] * 0.6, c[1] * 0.6, c[2] * 0.6]
  }

  function compileShader(type: number, source: string): WebGLShader {
    const shader = gl!.createShader(type)!
    gl!.shaderSource(shader, source)
    gl!.compileShader(shader)
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS))
      console.error('[fluid] Shader compile error:', gl!.getShaderInfoLog(shader))
    return shader
  }

  function createProgram(vertexSource: string, fragmentSource: string): Program {
    const program = gl!.createProgram()!
    const vs = compileShader(gl!.VERTEX_SHADER, vertexSource)
    const fs = compileShader(gl!.FRAGMENT_SHADER, fragmentSource)
    gl!.attachShader(program, vs)
    gl!.attachShader(program, fs)
    gl!.bindAttribLocation(program, 0, 'aPosition')
    gl!.linkProgram(program)

    if (!gl!.getProgramParameter(program, gl!.LINK_STATUS))
      console.error('[fluid] Program link error:', gl!.getProgramInfoLog(program))

    const uniforms: Record<string, WebGLUniformLocation> = {}
    const uniformCount = gl!.getProgramParameter(program, gl!.ACTIVE_UNIFORMS)
    for (let i = 0; i < uniformCount; i++) {
      const info = gl!.getActiveUniform(program, i)!
      uniforms[info.name] = gl!.getUniformLocation(program, info.name)!
    }

    return {
      program,
      uniforms,
      bind() { gl!.useProgram(program) },
    }
  }

  function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, filter: number): FBO {
    gl!.activeTexture(gl!.TEXTURE0)
    const texture = gl!.createTexture()!
    gl!.bindTexture(gl!.TEXTURE_2D, texture)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, filter)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, filter)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
    gl!.texImage2D(gl!.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)

    const fbo = gl!.createFramebuffer()!
    gl!.bindFramebuffer(gl!.FRAMEBUFFER, fbo)
    gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0)
    gl!.viewport(0, 0, w, h)
    gl!.clear(gl!.COLOR_BUFFER_BIT)

    const status = gl!.checkFramebufferStatus(gl!.FRAMEBUFFER)
    if (status !== gl!.FRAMEBUFFER_COMPLETE)
      console.error(`[fluid] FBO incomplete: ${status} (${w}x${h})`)

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
        gl!.activeTexture(gl!.TEXTURE0 + id)
        gl!.bindTexture(gl!.TEXTURE_2D, texture)
        return id
      },
    }
  }

  function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, filter: number): DoubleFBO {
    let fbo1 = createFBO(w, h, internalFormat, format, type, filter)
    let fbo2 = createFBO(w, h, internalFormat, format, type, filter)
    return {
      width: w,
      height: h,
      texelSizeX: fbo1.texelSizeX,
      texelSizeY: fbo1.texelSizeY,
      get read() { return fbo1 },
      get write() { return fbo2 },
      swap() {
        const temp = fbo1
        fbo1 = fbo2
        fbo2 = temp
      },
    }
  }

  function getResolution(resolution: number) {
    let aspectRatio = gl!.drawingBufferWidth / gl!.drawingBufferHeight
    if (aspectRatio < 1)
      aspectRatio = 1.0 / aspectRatio
    const min = Math.round(resolution)
    const max = Math.round(resolution * aspectRatio)
    if (gl!.drawingBufferWidth > gl!.drawingBufferHeight)
      return { width: max, height: min }
    else
      return { width: min, height: max }
  }

  function initFramebuffers() {
    const simRes = getResolution(cfg.simResolution)
    const dyeRes = getResolution(cfg.dyeResolution)

    const isWebGL2 = gl instanceof WebGL2RenderingContext
    const gl2 = gl as WebGL2RenderingContext

    let texType: number
    let rgba: number
    let rg: number
    let r: number
    let rgFormat: number
    let rFormat: number

    if (isWebGL2) {
      texType = gl!.HALF_FLOAT as number
      rgba = gl2.RGBA16F
      rg = gl2.RG16F
      r = gl2.R16F
      rgFormat = gl2.RG
      rFormat = gl2.RED
    }
    else {
      const ext = gl!.getExtension('OES_texture_half_float')
      texType = ext ? ext.HALF_FLOAT_OES : gl!.UNSIGNED_BYTE
      rgba = gl!.RGBA
      rg = gl!.RGBA
      r = gl!.RGBA
      rgFormat = gl!.RGBA
      rFormat = gl!.RGBA
    }

    const filtering = gl!.LINEAR

    dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba, gl!.RGBA, texType, filtering)
    velocity = createDoubleFBO(simRes.width, simRes.height, rg, rgFormat, texType, filtering)
    divergenceFBO = createFBO(simRes.width, simRes.height, r, rFormat, texType, gl!.NEAREST)
    pressure = createDoubleFBO(simRes.width, simRes.height, r, rFormat, texType, gl!.NEAREST)
  }

  function correctRadius(radius: number) {
    const aspectRatio = canvas!.width / canvas!.height
    if (aspectRatio > 1)
      return radius * aspectRatio
    return radius
  }

  function splatAtPoint(x: number, y: number, dx: number, dy: number, color: [number, number, number]) {
    splatProgram.bind()
    gl!.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0))
    gl!.uniform1f(splatProgram.uniforms.aspectRatio, canvas!.width / canvas!.height)
    gl!.uniform2f(splatProgram.uniforms.point, x, y)
    gl!.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0)
    gl!.uniform1f(splatProgram.uniforms.radius, correctRadius(cfg.splatRadius / 100.0))
    blit(velocity.write)
    velocity.swap()

    gl!.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0))
    gl!.uniform3f(splatProgram.uniforms.color, color[0], color[1], color[2])
    blit(dye.write)
    dye.swap()
  }

  function step(dt: number) {
    gl!.disable(gl!.BLEND)

    // 1. Divergence
    divergenceProgram.bind()
    gl!.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
    gl!.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0))
    blit(divergenceFBO)

    // 2. Clear pressure
    clearProgram.bind()
    gl!.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0))
    gl!.uniform1f(clearProgram.uniforms.value, 0.8)
    blit(pressure.write)
    pressure.swap()

    // 3. Pressure solve (Jacobi)
    pressureProgram.bind()
    gl!.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
    gl!.uniform1i(pressureProgram.uniforms.uDivergence, divergenceFBO.attach(0))
    for (let i = 0; i < cfg.pressureIterations; i++) {
      gl!.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1))
      blit(pressure.write)
      pressure.swap()
    }

    // 4. Gradient subtract
    gradientSubtractProgram.bind()
    gl!.uniform2f(gradientSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
    gl!.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0))
    gl!.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1))
    blit(velocity.write)
    velocity.swap()

    // 5. Advect velocity
    advectionProgram.bind()
    gl!.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
    gl!.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0))
    gl!.uniform1i(advectionProgram.uniforms.uSource, velocity.read.attach(0))
    gl!.uniform1f(advectionProgram.uniforms.dt, dt)
    gl!.uniform1f(advectionProgram.uniforms.dissipation, cfg.velocityDissipation)
    blit(velocity.write)
    velocity.swap()

    // 6. Advect dye
    advectionProgram.bind()
    gl!.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
    gl!.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0))
    gl!.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1))
    gl!.uniform1f(advectionProgram.uniforms.dt, dt)
    gl!.uniform1f(advectionProgram.uniforms.dissipation, cfg.densityDissipation)
    blit(dye.write)
    dye.swap()

    // 7. Display
    displayProgram.bind()
    gl!.uniform1i(displayProgram.uniforms.uTexture, dye.read.attach(0))
    blit(null)
  }

  function updatePointers() {
    for (const p of pointers) {
      if (p.moved) {
        p.moved = false
        splatAtPoint(p.texcoordX, p.texcoordY, p.deltaX, p.deltaY, p.color)
      }
    }
  }

  function multipleSplats(amount: number) {
    for (let i = 0; i < amount; i++) {
      const color = getNextColor()
      const x = Math.random()
      const y = Math.random()
      const dx = 200 * (Math.random() - 0.5)
      const dy = 200 * (Math.random() - 0.5)
      splatAtPoint(x, y, dx, dy, color)
    }
  }

  let lastAutoSplat = 0
  let lastSoftClear = 0

  function update() {
    const now = Date.now()
    let dt = (now - lastUpdateTime) / 1000
    dt = Math.min(dt, 0.016666)
    lastUpdateTime = now

    if (splatStack.length > 0) {
      multipleSplats(splatStack.pop()!)
    }

    // Auto-splat every 3 seconds for ambient life
    if (now - lastAutoSplat > 3000) {
      lastAutoSplat = now
      multipleSplats(Math.floor(Math.random() * 2) + 1)
    }

    // Periodic soft-clear every 5 seconds — gently fades accumulated dye
    if (now - lastSoftClear > 5000) {
      lastSoftClear = now
      clearProgram.bind()
      gl!.uniform1i(clearProgram.uniforms.uTexture, dye.read.attach(0))
      gl!.uniform1f(clearProgram.uniforms.value, 0.92)
      blit(dye.write)
      dye.swap()
    }

    updatePointers()
    step(dt)
    animationId = requestAnimationFrame(update)
  }

  // ─── Event Handlers ─────────────────────

  function correctDelta(delta: number) {
    const aspectRatio = canvas!.width / canvas!.height
    if (aspectRatio < 1)
      return delta * aspectRatio
    return delta
  }

  function onPointerMove(e: PointerEvent) {
    if (!canvas)
      return
    const pointer = pointers[0]
    if (!pointer)
      return
    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = 1.0 - (e.clientY - rect.top) / rect.height
    pointer.prevTexcoordX = pointer.texcoordX
    pointer.prevTexcoordY = pointer.texcoordY
    pointer.texcoordX = x
    pointer.texcoordY = y
    pointer.deltaX = correctDelta(x - pointer.prevTexcoordX) * cfg.splatForce
    pointer.deltaY = correctDelta(y - pointer.prevTexcoordY) * cfg.splatForce
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0
    pointer.color = getNextColor()
  }

  let lastTouchSplat = 0

  function onTouchMove(e: TouchEvent) {
    if (!canvas)
      return
    e.preventDefault()

    const now = Date.now()
    if (now - lastTouchSplat < 50)
      return
    lastTouchSplat = now

    const touch = e.touches[0]
    const pointer = pointers[0]
    if (!pointer || !touch)
      return
    const rect = canvas.getBoundingClientRect()
    const x = (touch.clientX - rect.left) / rect.width
    const y = 1.0 - (touch.clientY - rect.top) / rect.height
    pointer.prevTexcoordX = pointer.texcoordX
    pointer.prevTexcoordY = pointer.texcoordY
    pointer.texcoordX = x
    pointer.texcoordY = y
    pointer.deltaX = correctDelta(x - pointer.prevTexcoordX) * 2500
    pointer.deltaY = correctDelta(y - pointer.prevTexcoordY) * 2500
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0
    pointer.color = getNextColor()
  }

  function handleResize() {
    if (!canvas || !gl)
      return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.floor(canvas.clientWidth * dpr * 0.5)
    const height = Math.floor(canvas.clientHeight * dpr * 0.5)
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
      initFramebuffers()
    }
  }

  // ─── Public API ─────────────────────────

  function init(canvasEl: HTMLCanvasElement): boolean {
    canvas = canvasEl

    gl = canvas.getContext('webgl2', {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    }) as WebGL2RenderingContext

    if (!gl) {
      gl = canvas.getContext('webgl', {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
      })
      if (gl) {
        gl.getExtension('OES_texture_half_float')
        gl.getExtension('OES_texture_half_float_linear')
      }
    }

    if (!gl) {
      console.warn('[fluid] WebGL not supported')
      return false
    }

    if (gl instanceof WebGL2RenderingContext) {
      gl.getExtension('EXT_color_buffer_float')
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    // Fullscreen quad — set up blit function (reference pattern)
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)

    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)

    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)

    // Create blit as closure (reference pattern)
    const glRef = gl
    blit = (target: FBO | null) => {
      if (target == null) {
        glRef.viewport(0, 0, glRef.drawingBufferWidth, glRef.drawingBufferHeight)
        glRef.bindFramebuffer(glRef.FRAMEBUFFER, null)
      }
      else {
        glRef.viewport(0, 0, target.width, target.height)
        glRef.bindFramebuffer(glRef.FRAMEBUFFER, target.fbo)
      }
      glRef.drawElements(glRef.TRIANGLES, 6, glRef.UNSIGNED_SHORT, 0)
    }

    // Compile all programs with the SAME vertex shader
    clearProgram = createProgram(baseVertexShader, clearShader)
    displayProgram = createProgram(baseVertexShader, displayShader)
    splatProgram = createProgram(baseVertexShader, splatShader)
    advectionProgram = createProgram(baseVertexShader, advectionShader)
    divergenceProgram = createProgram(baseVertexShader, divergenceShader)
    pressureProgram = createProgram(baseVertexShader, pressureShader)
    gradientSubtractProgram = createProgram(baseVertexShader, gradientSubtractShader)

    handleResize()

    pointers.push({
      id: -1,
      texcoordX: 0,
      texcoordY: 0,
      prevTexcoordX: 0,
      prevTexcoordY: 0,
      deltaX: 0,
      deltaY: 0,
      down: false,
      moved: false,
      color: getNextColor(),
    })

    return true
  }

  function start() {
    if (!gl)
      return
    lastUpdateTime = Date.now()
    update()

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    canvas?.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('resize', handleResize)
  }

  function stop() {
    cancelAnimationFrame(animationId)
    window.removeEventListener('pointermove', onPointerMove)
    canvas?.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('resize', handleResize)
  }

  function splat(count: number = 3) {
    splatStack.push(count)
  }

  function destroy() {
    stop()
    gl = null
    canvas = null
  }

  return {
    init,
    start,
    stop,
    splat,
    destroy,
    resize: handleResize,
  }
}
