# Hero "Liquid Prism" Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an Awwwards-level hero section with WebGL fluid simulation, massive bold typography with chromatic aberration, and GSAP entrance animations.

**Architecture:** Full-viewport hero with a WebGL fluid canvas as background. The fluid simulation uses Jos Stam's "Stable Fluids" algorithm running entirely on GPU via fragment shaders. Typography sits on top with CSS chromatic aberration driven by mouse position. GSAP handles entrance animation sequence. Everything encapsulated in Vue composables and components.

**Tech Stack:** Nuxt 4, Vue 3 Composition API, raw WebGL 2 (no Three.js), GSAP 3, UnoCSS, CSS custom properties

---

### Task 1: Update CSS Design Tokens

**Files:**
- Modify: `app/assets/css/main.css`

**Step 1: Replace main.css with hero design tokens**

Replace the entire file with design tokens for the new design system. This includes color palette, typography scale, animation timing, layout variables, and the grid background pattern.

```css
/* ═══════════════════════════════════════════
   BILLY MAULANA — Design Tokens
   "Liquid Prism" — Deep Black + Electric Blue
   ═══════════════════════════════════════════ */

/* ---------- Reset ---------- */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* ---------- Custom Properties ---------- */
:root {
  /* — Colors — */
  --color-bg:            #000000;
  --color-bg-elevated:   #0a0a0a;
  --color-surface:       #111111;

  --color-text-primary:  #ffffff;
  --color-text-secondary:#888888;
  --color-text-tertiary: #555555;

  --color-accent:        #0047FF;
  --color-accent-light:  #00A3FF;
  --color-accent-cyan:   #00F5FF;
  --color-accent-purple: #4400FF;
  --color-accent-glow:   rgba(0, 71, 255, 0.15);

  /* — Typography Scale (fluid) — */
  --text-display:  clamp(3.5rem, 12vw, 14rem);
  --text-h1:       clamp(2.5rem, 6vw, 6rem);
  --text-h2:       clamp(2rem, 4vw, 4rem);
  --text-h3:       clamp(1.5rem, 2.5vw, 2.5rem);
  --text-body:     clamp(1rem, 1.2vw, 1.25rem);
  --text-label:    clamp(0.75rem, 0.9vw, 0.875rem);
  --text-caption:  clamp(0.625rem, 0.7vw, 0.75rem);

  /* — Spacing — */
  --page-margin:   clamp(1.5rem, 4vw, 4rem);
  --section-gap:   clamp(6rem, 12vh, 12rem);

  /* — Animation — */
  --duration-fast:    0.2s;
  --duration-normal:  0.4s;
  --duration-slow:    0.8s;
  --duration-slower:  1.2s;
  --ease-out-expo:    cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out-quart:   cubic-bezier(0.25, 1, 0.5, 1);
  --ease-in-out:      cubic-bezier(0.65, 0, 0.35, 1);

  /* — Z-index layers — */
  --z-fluid:       1;
  --z-content:     10;
  --z-nav:         100;
  --z-cursor:      200;
  --z-preloader:   300;
}

/* ---------- Base ---------- */
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  font-family: 'Satoshi', system-ui, -apple-system, sans-serif;
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  line-height: 1.5;
  overflow-x: hidden;
}

/* ---------- Selection ---------- */
::selection {
  background-color: var(--color-accent-cyan);
  color: var(--color-bg);
}

/* ---------- Focus ---------- */
:focus-visible {
  outline: 2px solid var(--color-accent-cyan);
  outline-offset: 2px;
}

/* ---------- Reduced Motion ---------- */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Step 2: Verify dev server starts**

Run: `pnpm dev`
Expected: Dev server starts, page loads with black background and Satoshi font.

**Step 3: Commit**

```bash
git add app/assets/css/main.css
git commit -m "feat: add Liquid Prism design tokens — color, typography, animation"
```

---

### Task 2: Create WebGL Fluid Simulation Composable

**Files:**
- Create: `app/composables/useFluidSimulation.ts`

**Step 1: Write the fluid simulation composable**

This is the core of the effect — a complete GPU-accelerated fluid dynamics simulation. It compiles GLSL shaders, manages framebuffers, and runs the simulation loop.

The composable exports a function that takes a canvas element and returns start/stop/splat controls.

```typescript
/**
 * WebGL Fluid Simulation
 * Based on Jos Stam's "Stable Fluids" — GPU-accelerated via fragment shaders.
 * Implements: advection, divergence, pressure solve (Jacobi), gradient subtraction, splat.
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

type ShaderProgram = {
  program: WebGLProgram
  uniforms: Record<string, WebGLUniformLocation>
  bind: () => void
}

const defaultConfig: FluidConfig = {
  simResolution: 128,
  dyeResolution: 1024,
  densityDissipation: 1.5,
  velocityDissipation: 2.0,
  pressureIterations: 20,
  splatRadius: 0.25,
  splatForce: 6000,
  colorPalette: [
    [0, 0.28, 1],      // #0047FF — Electric Blue
    [0, 0.64, 1],      // #00A3FF — Light Blue
    [0, 0.96, 1],      // #00F5FF — Cyan
    [0.27, 0, 1],      // #4400FF — Deep Purple
    [0, 0.5, 1],       // mid blue
  ],
}

// ─── GLSL Shaders ───────────────────────────────────

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
    vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
    vec4 result = bilerp(uSource, coord, dyeTexelSize);
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
    float C = texture2D(uPressure, vUv).x;
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
  let clearProgram: ShaderProgram
  let displayProgram: ShaderProgram
  let splatProgram: ShaderProgram
  let advectionProgram: ShaderProgram
  let divergenceProgram: ShaderProgram
  let pressureProgram: ShaderProgram
  let gradientSubtractProgram: ShaderProgram

  // Pointers
  const pointers: Pointer[] = []
  let splatStack: number[] = []

  function getNextColor(): [number, number, number] {
    const c = cfg.colorPalette[colorIndex % cfg.colorPalette.length]
    colorIndex++
    return [c[0] * 0.3, c[1] * 0.3, c[2] * 0.3]
  }

  function compileShader(type: number, source: string): WebGLShader {
    const shader = gl!.createShader(type)!
    gl!.shaderSource(shader, source)
    gl!.compileShader(shader)
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS))
      console.error(gl!.getShaderInfoLog(shader))
    return shader
  }

  function createProgram(vertexSource: string, fragmentSource: string): ShaderProgram {
    const program = gl!.createProgram()!
    const vs = compileShader(gl!.VERTEX_SHADER, vertexSource)
    const fs = compileShader(gl!.FRAGMENT_SHADER, fragmentSource)
    gl!.attachShader(program, vs)
    gl!.attachShader(program, fs)
    gl!.linkProgram(program)

    if (!gl!.getProgramParameter(program, gl!.LINK_STATUS))
      console.error(gl!.getProgramInfoLog(program))

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
      swap() { [fbo1, fbo2] = [fbo2, fbo1] },
    }
  }

  function blit(target: FBO | null) {
    if (target == null) {
      gl!.viewport(0, 0, gl!.drawingBufferWidth, gl!.drawingBufferHeight)
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, null)
    }
    else {
      gl!.viewport(0, 0, target.width, target.height)
      gl!.bindFramebuffer(gl!.FRAMEBUFFER, target.fbo)
    }
    gl!.drawElements(gl!.TRIANGLES, 6, gl!.UNSIGNED_SHORT, 0)
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

    const texType = gl!.HALF_FLOAT || (gl!.getExtension('OES_texture_half_float') as any)?.HALF_FLOAT_OES || gl!.UNSIGNED_BYTE
    const rgba = isWebGL2 ? (gl as WebGL2RenderingContext).RGBA16F : gl!.RGBA
    const rg = isWebGL2 ? (gl as WebGL2RenderingContext).RG16F : gl!.RGBA
    const r = isWebGL2 ? (gl as WebGL2RenderingContext).R16F : gl!.RGBA
    const rgFormat = isWebGL2 ? (gl as WebGL2RenderingContext).RG : gl!.RGBA
    const rFormat = isWebGL2 ? (gl as WebGL2RenderingContext).RED : gl!.RGBA

    const filtering = gl!.LINEAR

    dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba, gl!.RGBA, texType, filtering)
    velocity = createDoubleFBO(simRes.width, simRes.height, rg, rgFormat, texType, filtering)
    divergenceFBO = createFBO(simRes.width, simRes.height, r, rFormat, texType, gl!.NEAREST)
    pressure = createDoubleFBO(simRes.width, simRes.height, r, rFormat, texType, gl!.NEAREST)
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

  function correctRadius(radius: number) {
    const aspectRatio = canvas!.width / canvas!.height
    if (aspectRatio > 1)
      return radius * aspectRatio
    return radius
  }

  function step(dt: number) {
    // Advect velocity
    advectionProgram.bind()
    gl!.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
    gl!.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY)
    gl!.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0))
    gl!.uniform1i(advectionProgram.uniforms.uSource, velocity.read.attach(0))
    gl!.uniform1f(advectionProgram.uniforms.dt, dt)
    gl!.uniform1f(advectionProgram.uniforms.dissipation, cfg.velocityDissipation)
    blit(velocity.write)
    velocity.swap()

    // Advect dye
    gl!.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY)
    gl!.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0))
    gl!.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1))
    gl!.uniform1f(advectionProgram.uniforms.dissipation, cfg.densityDissipation)
    blit(dye.write)
    dye.swap()

    // Divergence
    divergenceProgram.bind()
    gl!.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
    gl!.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0))
    blit(divergenceFBO)

    // Clear pressure
    clearProgram.bind()
    gl!.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0))
    gl!.uniform1f(clearProgram.uniforms.value, 0.8)
    blit(pressure.write)
    pressure.swap()

    // Pressure solve (Jacobi iteration)
    pressureProgram.bind()
    gl!.uniform1i(pressureProgram.uniforms.uDivergence, divergenceFBO.attach(0))
    for (let i = 0; i < cfg.pressureIterations; i++) {
      gl!.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1))
      blit(pressure.write)
      pressure.swap()
    }

    // Gradient subtract
    gradientSubtractProgram.bind()
    gl!.uniform1i(gradientSubtractProgram.uniforms.uPressure, pressure.read.attach(0))
    gl!.uniform1i(gradientSubtractProgram.uniforms.uVelocity, velocity.read.attach(1))
    blit(velocity.write)
    velocity.swap()

    // Display
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

  function update() {
    const now = Date.now()
    let dt = (now - lastUpdateTime) / 1000
    dt = Math.min(dt, 0.016666)
    lastUpdateTime = now

    if (splatStack.length > 0) {
      multipleSplats(splatStack.pop()!)
    }

    updatePointers()
    step(dt)
    animationId = requestAnimationFrame(update)
  }

  function multipleSplats(amount: number) {
    for (let i = 0; i < amount; i++) {
      const color = getNextColor()
      const x = Math.random()
      const y = Math.random()
      const dx = 1000 * (Math.random() - 0.5)
      const dy = 1000 * (Math.random() - 0.5)
      splatAtPoint(x, y, dx, dy, color)
    }
  }

  // ─── Event Handlers ─────────────────────

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

  function onTouchMove(e: TouchEvent) {
    if (!canvas)
      return
    e.preventDefault()
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
    pointer.deltaX = correctDelta(x - pointer.prevTexcoordX) * cfg.splatForce
    pointer.deltaY = correctDelta(y - pointer.prevTexcoordY) * cfg.splatForce
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0
    pointer.color = getNextColor()
  }

  function correctDelta(delta: number) {
    const aspectRatio = canvas!.width / canvas!.height
    if (aspectRatio < 1)
      return delta * aspectRatio
    return delta
  }

  function resize() {
    if (!canvas || !gl)
      return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.floor(canvas.clientWidth * dpr * 0.5) // Half res for performance
    const height = Math.floor(canvas.clientHeight * dpr * 0.5)
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
      initFramebuffers()
    }
  }

  // ─── Public API ─────────────────────────

  function init(canvasEl: HTMLCanvasElement) {
    canvas = canvasEl

    // Try WebGL2 first, fallback to WebGL1
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
      console.warn('WebGL not supported')
      return false
    }

    if (gl instanceof WebGL2RenderingContext) {
      (gl as WebGL2RenderingContext).getExtension('EXT_color_buffer_float')
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0)

    // Create quad geometry
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)

    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)

    // Compile all shader programs
    clearProgram = createProgram(baseVertexShader, clearShader)
    displayProgram = createProgram(baseVertexShader, displayShader)
    splatProgram = createProgram(baseVertexShader, splatShader)
    advectionProgram = createProgram(baseVertexShader, advectionShader)
    divergenceProgram = createProgram(baseVertexShader, divergenceShader)
    pressureProgram = createProgram(baseVertexShader, pressureShader)
    gradientSubtractProgram = createProgram(baseVertexShader, gradientSubtractShader)

    // Vertex attribute
    const positionLocation = gl.getAttribLocation(clearProgram.program, 'aPosition')
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    // Init framebuffers
    resize()

    // Create default pointer
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

    // Bind events
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    canvas?.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('resize', resize)
  }

  function stop() {
    cancelAnimationFrame(animationId)
    window.removeEventListener('pointermove', onPointerMove)
    canvas?.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('resize', resize)
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
    resize,
  }
}
```

**Step 2: Verify lint passes**

Run: `pnpm lint`
Expected: No errors in the new composable file (warnings OK).

**Step 3: Commit**

```bash
git add app/composables/useFluidSimulation.ts
git commit -m "feat: add WebGL fluid simulation composable — Navier-Stokes GPU shaders"
```

---

### Task 3: Create UiFluidCanvas Component

**Files:**
- Create: `app/components/UiFluidCanvas.vue`

**Step 1: Write the fluid canvas Vue component**

This is a thin wrapper that mounts the canvas and wires up the composable.

```vue
<script setup lang="ts">
const props = defineProps<{
  /** Delay in ms before starting the fluid simulation */
  startDelay?: number
  /** Number of initial splats when simulation starts */
  initialSplats?: number
}>()

const canvasRef = ref<HTMLCanvasElement>()
const fluid = ref<ReturnType<typeof import('~/composables/useFluidSimulation').useFluidSimulation>>()
const isReady = ref(false)

onMounted(async () => {
  if (!canvasRef.value)
    return

  // Respect reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced)
    return

  const { useFluidSimulation } = await import('~/composables/useFluidSimulation')
  const sim = useFluidSimulation()
  const success = sim.init(canvasRef.value)

  if (!success)
    return

  fluid.value = sim

  // Delayed start (waits for preloader to finish)
  const delay = props.startDelay ?? 300
  setTimeout(() => {
    sim.start()
    isReady.value = true

    // Initial splats for a dramatic entrance
    if (props.initialSplats) {
      sim.splat(props.initialSplats)
    }
  }, delay)
})

onUnmounted(() => {
  fluid.value?.destroy()
})

defineExpose({
  splat: (count?: number) => fluid.value?.splat(count),
})
</script>

<template>
  <canvas
    ref="canvasRef"
    class="fluid-canvas"
    :class="{ 'fluid-canvas--ready': isReady }"
    aria-hidden="true"
  />
</template>

<style scoped>
.fluid-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: var(--z-fluid, 1);
  opacity: 0;
  transition: opacity 1.5s ease;
  pointer-events: none;
}

.fluid-canvas--ready {
  opacity: 1;
}

@media (prefers-reduced-motion: reduce) {
  .fluid-canvas {
    display: none;
  }
}
</style>
```

**Step 2: Verify lint passes**

Run: `pnpm lint`
Expected: Clean pass.

**Step 3: Commit**

```bash
git add app/components/UiFluidCanvas.vue
git commit -m "feat: add UiFluidCanvas — Vue wrapper for WebGL fluid simulation"
```

---

### Task 4: Create SectionHero Component

**Files:**
- Create: `app/components/SectionHero.vue` (overwrite existing)

**Step 1: Write the full hero section**

The hero section contains the fluid canvas, massive typography with chromatic aberration, subtitle, and scroll indicator. GSAP handles entrance animations.

```vue
<script setup lang="ts">
import { profile } from '~/constants/profile'

const heroRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const fluidRef = ref<InstanceType<typeof UiFluidCanvas>>()
const mouse = reactive({ x: 0, y: 0 })
const smoothMouse = reactive({ x: 0, y: 0 })
let rafId = 0

function lerp(a: number, b: number, n: number) {
  return a + (b - a) * n
}

function onMouseMove(e: MouseEvent) {
  if (!heroRef.value)
    return
  const rect = heroRef.value.getBoundingClientRect()
  mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
  mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
}

function animateMouse() {
  smoothMouse.x = lerp(smoothMouse.x, mouse.x, 0.06)
  smoothMouse.y = lerp(smoothMouse.y, mouse.y, 0.06)

  if (titleRef.value) {
    const offsetX = smoothMouse.x * 4
    const offsetY = smoothMouse.y * 4
    titleRef.value.style.setProperty('--chromatic-x', `${offsetX}px`)
    titleRef.value.style.setProperty('--chromatic-y', `${offsetY}px`)
  }

  rafId = requestAnimationFrame(animateMouse)
}

onMounted(async () => {
  rafId = requestAnimationFrame(animateMouse)

  const gsap = (await import('gsap')).default

  // Entrance animation timeline
  const tl = gsap.timeline({ delay: 0.3 })

  // Fluid canvas initial splat (handled by UiFluidCanvas startDelay + initialSplats)

  // Title letters slide up with stagger
  tl.from('.hero__char', {
    y: '110%',
    duration: 1.0,
    stagger: 0.04,
    ease: 'power3.out',
  })

  // Subtitle fade in
  tl.from('.hero__subtitle', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  }, '-=0.4')

  // Scroll indicator
  tl.from('.hero__scroll', {
    opacity: 0,
    y: -10,
    duration: 0.6,
    ease: 'power2.out',
  }, '-=0.2')
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})

// Split text into individual characters
function splitChars(text: string) {
  return text.split('')
}

const firstName = splitChars('BILLY')
const lastName = splitChars('MAULANA')
</script>

<template>
  <section
    id="hero"
    ref="heroRef"
    class="hero"
    aria-label="Billy Maulana — Frontend Architect"
    @mousemove="onMouseMove"
  >
    <!-- WebGL Fluid Background -->
    <UiFluidCanvas
      ref="fluidRef"
      :start-delay="300"
      :initial-splats="3"
    />

    <!-- Ambient gradient (visible even without WebGL) -->
    <div class="hero__ambient" />

    <!-- Content -->
    <div ref="titleRef" class="hero__content">
      <!-- Title: BILLY -->
      <div class="hero__title-wrap">
        <h1 class="hero__title hero__title--first" aria-label="Billy">
          <span
            v-for="(char, i) in firstName"
            :key="`first-${i}`"
            class="hero__char-wrap"
          >
            <span class="hero__char">{{ char }}</span>
          </span>
        </h1>
      </div>

      <!-- Title: MAULANA -->
      <div class="hero__title-wrap">
        <h1 class="hero__title hero__title--last" aria-label="Maulana">
          <span
            v-for="(char, i) in lastName"
            :key="`last-${i}`"
            class="hero__char-wrap"
          >
            <span class="hero__char">{{ char }}</span>
          </span>
        </h1>
      </div>

      <!-- Subtitle -->
      <p class="hero__subtitle">
        {{ profile.title }} &mdash; {{ profile.location }}
      </p>
    </div>

    <!-- Scroll Indicator -->
    <div class="hero__scroll">
      <span class="hero__scroll-label">Scroll</span>
      <div class="hero__scroll-line" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: var(--color-bg);
}

/* Ambient gradient — fallback & additional depth */
.hero__ambient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0, 71, 255, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 60% 80% at 30% 60%, rgba(0, 245, 255, 0.04) 0%, transparent 60%);
  pointer-events: none;
  z-index: 2;
}

/* Content container */
.hero__content {
  --chromatic-x: 0px;
  --chromatic-y: 0px;
  position: relative;
  z-index: var(--z-content, 10);
  width: 100%;
  padding-left: var(--page-margin);
  padding-right: var(--page-margin);
}

/* Title wrapper — overflow hidden for slide-up animation */
.hero__title-wrap {
  overflow: hidden;
  line-height: 1;
}

/* Title base */
.hero__title {
  font-size: var(--text-display);
  font-weight: 900;
  line-height: 0.88;
  letter-spacing: -0.04em;
  color: var(--color-text-primary);
  margin: 0;
  display: flex;

  /* Chromatic aberration via text-shadow */
  text-shadow:
    var(--chromatic-x) var(--chromatic-y) 0 rgba(255, 51, 51, 0.25),
    calc(var(--chromatic-x) * -1) calc(var(--chromatic-y) * -1) 0 rgba(0, 71, 255, 0.3);
}

.hero__title--last {
  /* Slight indent on second line for visual rhythm */
  padding-left: clamp(0.5rem, 3vw, 4rem);
}

/* Character wrapper (overflow hidden for stagger animation) */
.hero__char-wrap {
  display: inline-block;
  overflow: hidden;
}

.hero__char {
  display: inline-block;
  will-change: transform;
}

/* Subtitle */
.hero__subtitle {
  font-size: var(--text-label);
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-top: clamp(1.5rem, 3vw, 3rem);
  padding-left: clamp(0.5rem, 3vw, 4rem);
}

/* Scroll Indicator */
.hero__scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  z-index: var(--z-content, 10);
}

.hero__scroll-label {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-tertiary);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hero__scroll-line {
  width: 1px;
  height: 48px;
  background: linear-gradient(to bottom, var(--color-text-tertiary), transparent);
  animation: scrollPulse 2.5s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% {
    opacity: 1;
    transform: scaleY(1);
  }
  50% {
    opacity: 0.2;
    transform: scaleY(0.5);
  }
}

/* ─── Responsive ─────────────────── */
@media (max-width: 768px) {
  .hero__title--last {
    padding-left: 0;
  }

  .hero__subtitle {
    padding-left: 0;
  }
}

/* ─── Reduced Motion ─────────────── */
@media (prefers-reduced-motion: reduce) {
  .hero__scroll-line {
    animation: none;
    opacity: 0.5;
  }
}
</style>
```

**Step 2: Verify lint passes**

Run: `pnpm lint`
Expected: Clean pass.

**Step 3: Commit**

```bash
git add app/components/SectionHero.vue
git commit -m "feat: add SectionHero — massive typography with chromatic aberration + fluid bg"
```

---

### Task 5: Wire Up index.vue and app.vue

**Files:**
- Modify: `app/pages/index.vue`
- Modify: `app/app.vue`

**Step 1: Update index.vue to render the hero**

```vue
<script setup lang="ts">
useHead({
  title: 'Billy Maulana | Frontend Architect',
  titleTemplate: '',
})
</script>

<template>
  <main>
    <SectionHero />
  </main>
</template>
```

**Step 2: Update app.vue to ensure proper setup**

```vue
<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'en' },
})
</script>

<template>
  <div class="app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--color-bg);
}
</style>
```

**Step 3: Verify in browser**

Run: `pnpm dev`
Expected: Black viewport, massive "BILLY MAULANA" text appears with slide-up animation, fluid simulation activates on mouse move, blue/cyan ink trails follow cursor.

**Step 4: Commit**

```bash
git add app/pages/index.vue app/app.vue
git commit -m "feat: wire hero section into index page"
```

---

### Task 6: Verify SSG Build

**Files:** None (verification only)

**Step 1: Run lint**

Run: `pnpm lint`
Expected: Zero errors.

**Step 2: Run type check**

Run: `pnpm typecheck`
Expected: Zero errors.

**Step 3: Run SSG build**

Run: `pnpm generate`
Expected: Build succeeds. Static files generated in `.output/public/`.

**Step 4: Preview**

Run: `pnpm preview`
Expected: Site loads at localhost, hero fully functional with fluid effect.

---

## Summary

| Task | Description | Files |
|------|-------------|-------|
| 1 | CSS design tokens | `main.css` |
| 2 | WebGL fluid composable | `useFluidSimulation.ts` |
| 3 | Fluid canvas component | `UiFluidCanvas.vue` |
| 4 | Hero section | `SectionHero.vue` |
| 5 | Wire into pages | `index.vue`, `app.vue` |
| 6 | Build verification | — |
