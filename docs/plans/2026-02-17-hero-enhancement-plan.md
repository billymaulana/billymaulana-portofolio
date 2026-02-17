# Hero Section Enhancement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix fluid sim grey-out, add WebGL text displacement with layered effects, upgrade hero to cinematic Awwwards-level layout.

**Architecture:** Modify the existing Navier-Stokes fluid sim (tone-mapping + decay tuning), create a new `useTextDistortion` composable for GPU-accelerated text displacement with flowmap/chromatic effects, restructure `SectionHero.vue` to full-bleed cinematic layout with top meta bar.

**Tech Stack:** Nuxt 4, Vue 3 Composition API, WebGL2 (fallback WebGL1), GSAP, GLSL shaders, CSS custom properties, UnoCSS

---

## Task 1: Fix Fluid Simulation Grey-Out

**Files:**
- Modify: `app/composables/useFluidSimulation.ts`

### Step 1: Update display shader with tone-mapping and gradient blending

In `app/composables/useFluidSimulation.ts`, replace the `displayShader` constant (lines 108-119) with a new version that applies filmic tone-mapping to prevent color saturation, and blends with an ambient blue gradient:

```glsl
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
      vec3(0.0, 0.18, 0.65),  // Electric Blue
      vec3(0.0, 0.5, 0.65),   // Cyan-Blue
      vUv.y
    );
    c = mix(ambient * 0.15, c, 0.85 + 0.15 * smoothstep(0.0, 0.3, length(c)));

    float a = max(c.r, max(c.g, c.b));
    gl_FragColor = vec4(c, a);
  }
`
```

**What this does:** The `exp()` tone-mapping compresses bright values so they approach 1.0 asymptotically instead of blowing past it. The ambient blend ensures that even fully saturated areas show blue hues rather than grey. The `smoothstep` makes the blend adaptive — areas with visible dye keep their color, empty areas get a subtle blue tint.

### Step 2: Update fluid config defaults

In the same file, change the `defaultConfig` object (lines 57-72):

```typescript
const defaultConfig: FluidConfig = {
  simResolution: 128,
  dyeResolution: 1024,
  densityDissipation: 1.5,       // was 0.3 — much faster fade
  velocityDissipation: 0.3,      // was 0.2 — slightly faster
  pressureIterations: 20,
  splatRadius: 8.0,
  splatForce: 6000,
  colorPalette: [
    [0, 0.28, 1],   // Electric Blue
    [0, 0.64, 1],   // Light Blue
    [0, 0.96, 1],   // Cyan
    [0.27, 0, 1],   // Deep Purple
    [0, 0.5, 1],    // Mid Blue
  ],
}
```

### Step 3: Reduce color multiplier from 1.5 to 0.6

In the `getNextColor` function (lines 259-263), change the multiplier:

```typescript
function getNextColor(): [number, number, number] {
  const c = cfg.colorPalette[colorIndex % cfg.colorPalette.length]
  colorIndex++
  return [c[0] * 0.6, c[1] * 0.6, c[2] * 0.6]
}
```

### Step 4: Add periodic soft-clear and touch throttling

In the `update` function (lines 513-532), add a soft-clear timer and adjust auto-splat:

```typescript
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
```

### Step 5: Add touch throttle to onTouchMove

Add a `lastTouchSplat` timestamp and throttle touch events in `onTouchMove` (lines 562-581):

```typescript
let lastTouchSplat = 0

function onTouchMove(e: TouchEvent) {
  if (!canvas)
    return
  e.preventDefault()

  // Throttle touch splats to prevent rapid accumulation
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
  pointer.deltaX = correctDelta(x - pointer.prevTexcoordX) * 2500  // reduced from splatForce
  pointer.deltaY = correctDelta(y - pointer.prevTexcoordY) * 2500
  pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0
  pointer.color = getNextColor()
}
```

### Step 6: Verify fluid sim fix

Run: `pnpm dev`
Open browser, move mouse rapidly across the hero section for 30+ seconds. Multi-touch on mobile. Verify colors stay vibrant (blue/cyan/purple) and never wash out to grey.

### Step 7: Commit

```bash
git add app/composables/useFluidSimulation.ts
git commit -m "fix: prevent fluid sim grey-out with tone-mapping, faster decay, touch throttle"
```

---

## Task 2: Create useTextDistortion Composable

**Files:**
- Create: `app/composables/useTextDistortion.ts`

This composable renders text to an offscreen canvas, uploads it as a WebGL texture, and applies GPU-based liquid displacement + chromatic aberration based on mouse proximity. It also exposes a `settling` animation state for the entrance.

### Step 1: Create the composable

Create `app/composables/useTextDistortion.ts` with the full implementation:

```typescript
/**
 * WebGL Text Distortion Effect
 * Renders text to offscreen canvas, applies GPU liquid displacement
 * with flowmap-based ink ripple and chromatic aberration.
 */

interface DistortionConfig {
  /** Font size in pixels for the offscreen text render */
  fontSize: number
  /** Font weight */
  fontWeight: number
  /** Font family */
  fontFamily: string
  /** Maximum displacement radius around cursor (0-1 normalized) */
  radius: number
  /** Displacement intensity */
  intensity: number
  /** Chromatic split amount */
  chromaticSpread: number
  /** Lines of text to render: [{text, indent}] */
  lines: { text: string, indent: number }[]
}

const defaultDistortionConfig: DistortionConfig = {
  fontSize: 200,
  fontWeight: 900,
  fontFamily: 'Satoshi, system-ui, sans-serif',
  radius: 0.15,
  intensity: 0.04,
  chromaticSpread: 0.006,
  lines: [
    { text: 'BILLY', indent: 0 },
    { text: 'MAULANA', indent: 60 },
  ],
}

// ─── GLSL Shaders ───────────────────────────────────

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
  uniform vec2 uMouse;          // normalized mouse position (0-1)
  uniform float uRadius;        // influence radius
  uniform float uIntensity;     // displacement strength
  uniform float uChromatic;     // chromatic split amount
  uniform float uTime;          // for noise animation
  uniform float uSettle;        // 0 = full noise, 1 = settled
  uniform float uHover;         // 0 = not hovering text area, 1 = hovering
  uniform vec2 uResolution;     // canvas dimensions

  // Simplex-like noise (hash-based, fast for GPU)
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

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;

    // --- Entrance noise (settles over time) ---
    float entranceNoise = (1.0 - uSettle) * 0.06;
    vec2 entranceOffset = vec2(
      noise(uv * 8.0 + uTime * 0.5) * entranceNoise,
      noise(uv * 8.0 + uTime * 0.5 + 100.0) * entranceNoise
    );

    // --- Mouse proximity displacement (liquid ink ripple) ---
    vec2 mouseUv = uMouse;
    vec2 diff = uv - mouseUv;
    diff.x *= aspect;
    float dist = length(diff);
    float influence = smoothstep(uRadius, 0.0, dist) * uHover;

    // Flowmap-style displacement: radial push + noise swirl
    vec2 flowDir = normalize(diff + 0.001);
    float swirl = noise(uv * 12.0 + uTime * 0.3) * 0.5;
    vec2 displacement = (flowDir * influence + vec2(-flowDir.y, flowDir.x) * swirl * influence) * uIntensity;

    // Combined offset
    vec2 totalOffset = displacement + entranceOffset;

    // --- Chromatic aberration (RGB split) ---
    float chromaticAmount = uChromatic * (influence * 2.0 + (1.0 - uSettle) * 1.5);
    vec2 rOffset = totalOffset + vec2(chromaticAmount, chromaticAmount * 0.5);
    vec2 gOffset = totalOffset;
    vec2 bOffset = totalOffset - vec2(chromaticAmount, chromaticAmount * 0.5);

    float r = texture2D(uText, uv + rOffset).r;
    float g = texture2D(uText, uv + gOffset).g;
    float b = texture2D(uText, uv + bOffset).b;

    // Alpha from green channel (most detail) with slight boost from displacement areas
    float a = texture2D(uText, uv + gOffset).a;
    a = max(a, max(texture2D(uText, uv + rOffset).a, texture2D(uText, uv + bOffset).a));

    gl_FragColor = vec4(r, g, b, a);
  }
`

// ─── Composable ─────────────────────────────────────

export function useTextDistortion(config: Partial<DistortionConfig> = {}) {
  const cfg = { ...defaultDistortionConfig, ...config }
  let gl: WebGL2RenderingContext | WebGLRenderingContext | null = null
  let canvas: HTMLCanvasElement | null = null
  let program: WebGLProgram | null = null
  let uniforms: Record<string, WebGLUniformLocation> = {}
  let textTexture: WebGLTexture | null = null
  let animationId = 0
  let startTime = 0

  // Mouse state
  let mouseX = 0.5
  let mouseY = 0.5
  let smoothMouseX = 0.5
  let smoothMouseY = 0.5
  let isHovering = false
  let smoothHover = 0
  let settleProgress = 0 // 0 = fully noised, 1 = fully settled

  function compileShader(type: number, source: string): WebGLShader | null {
    const shader = gl!.createShader(type)
    if (!shader) return null
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

    // Measure text to determine canvas size
    ctx.font = `${cfg.fontWeight} ${cfg.fontSize}px ${cfg.fontFamily}`

    let maxWidth = 0
    const lineMetrics: { width: number, indent: number }[] = []
    for (const line of cfg.lines) {
      const metrics = ctx.measureText(line.text)
      const totalWidth = metrics.width + line.indent
      lineMetrics.push({ width: totalWidth, indent: line.indent })
      maxWidth = Math.max(maxWidth, totalWidth)
    }

    const lineHeight = cfg.fontSize * 0.84 // tight leading matching design
    const totalHeight = lineHeight * cfg.lines.length + cfg.fontSize * 0.2 // padding

    // Set canvas size with padding
    const padding = cfg.fontSize * 0.15
    offscreen.width = Math.ceil(maxWidth + padding * 2)
    offscreen.height = Math.ceil(totalHeight + padding * 2)

    // Clear
    ctx.clearRect(0, 0, offscreen.width, offscreen.height)

    // Draw text
    ctx.font = `${cfg.fontWeight} ${cfg.fontSize}px ${cfg.fontFamily}`
    ctx.fillStyle = '#ffffff'
    ctx.textBaseline = 'top'

    for (let i = 0; i < cfg.lines.length; i++) {
      const line = cfg.lines[i]
      const x = padding + line.indent
      const y = padding + i * lineHeight
      ctx.fillText(line.text, x, y)
    }

    return offscreen
  }

  function createTexture(source: HTMLCanvasElement): WebGLTexture | null {
    const tex = gl!.createTexture()
    if (!tex) return null
    gl!.bindTexture(gl!.TEXTURE_2D, tex)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, source)
    return tex
  }

  function render() {
    if (!gl || !program || !canvas) return

    const now = (Date.now() - startTime) / 1000

    // Smooth mouse interpolation
    smoothMouseX += (mouseX - smoothMouseX) * 0.08
    smoothMouseY += (mouseY - smoothMouseY) * 0.08
    smoothHover += ((isHovering ? 1 : 0) - smoothHover) * 0.06

    // Settle animation: 0 -> 1 over ~0.8s after start
    settleProgress = Math.min(1.0, now / 0.8)
    // Apply ease-out curve
    const settleEased = 1.0 - Math.pow(1.0 - settleProgress, 3)

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, textTexture)
    gl.uniform1i(uniforms.uText, 0)
    gl.uniform2f(uniforms.uMouse, smoothMouseX, 1.0 - smoothMouseY) // flip Y for GL
    gl.uniform1f(uniforms.uRadius, cfg.radius)
    gl.uniform1f(uniforms.uIntensity, cfg.intensity)
    gl.uniform1f(uniforms.uChromatic, cfg.chromaticSpread)
    gl.uniform1f(uniforms.uTime, now)
    gl.uniform1f(uniforms.uSettle, settleEased)
    gl.uniform1f(uniforms.uHover, smoothHover)
    gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height)

    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
    animationId = requestAnimationFrame(render)
  }

  function onPointerMove(e: PointerEvent) {
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mouseX = (e.clientX - rect.left) / rect.width
    mouseY = (e.clientY - rect.top) / rect.height

    // Check if mouse is within the canvas bounds
    isHovering = mouseX >= 0 && mouseX <= 1 && mouseY >= 0 && mouseY <= 1
  }

  function handleResize() {
    if (!canvas || !gl) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.floor(canvas.clientWidth * dpr)
    const height = Math.floor(canvas.clientHeight * dpr)
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height

      // Re-render text texture at new size
      const textCanvas = renderTextToCanvas()
      if (textTexture) {
        gl.bindTexture(gl.TEXTURE_2D, textTexture)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas)
      }
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
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
    }) as WebGL2RenderingContext

    if (!gl) {
      gl = canvas.getContext('webgl', {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
      })
    }

    if (!gl) {
      console.warn('[textDistortion] WebGL not supported')
      return false
    }

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    gl.clearColor(0.0, 0.0, 0.0, 0.0)

    // Compile shaders
    const vs = compileShader(gl.VERTEX_SHADER, distortionVertexShader)
    const fs = compileShader(gl.FRAGMENT_SHADER, distortionFragmentShader)
    if (!vs || !fs) return false

    program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.bindAttribLocation(program, 0, 'aPosition')
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('[textDistortion] Link error:', gl.getProgramInfoLog(program))
      return false
    }

    // Get uniform locations
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
    for (let i = 0; i < uniformCount; i++) {
      const info = gl.getActiveUniform(program, i)!
      uniforms[info.name] = gl.getUniformLocation(program, info.name)!
    }

    // Fullscreen quad
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)

    const indexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)

    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)

    // Render text to texture
    handleResize()
    const textCanvas = renderTextToCanvas()
    textTexture = createTexture(textCanvas)

    return true
  }

  function start() {
    if (!gl) return
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
    if (gl && textTexture) {
      gl.deleteTexture(textTexture)
    }
    if (gl && program) {
      gl.deleteProgram(program)
    }
    gl = null
    canvas = null
    program = null
  }

  /** Update font size dynamically (e.g., on resize for responsive text) */
  function updateFontSize(newSize: number) {
    cfg.fontSize = newSize
    if (gl && textTexture) {
      const textCanvas = renderTextToCanvas()
      gl.bindTexture(gl.TEXTURE_2D, textTexture)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas)
    }
  }

  return {
    init,
    start,
    destroy,
    updateFontSize,
  }
}
```

### Step 2: Verify composable compiles

Run: `pnpm dev`
Check browser console for no `[textDistortion]` errors. The composable isn't used yet, but the import should resolve.

### Step 3: Commit

```bash
git add app/composables/useTextDistortion.ts
git commit -m "feat: add useTextDistortion composable for WebGL liquid text displacement"
```

---

## Task 3: Create UiTextDistortion Component

**Files:**
- Create: `app/components/UiTextDistortion.vue`

### Step 1: Create the component

Create `app/components/UiTextDistortion.vue`:

```vue
<script setup lang="ts">
const props = defineProps<{
  /** Lines of text to render: [{text, indent}] */
  lines: { text: string, indent: number }[]
  /** Delay in ms before starting the effect */
  startDelay?: number
}>()

const canvasRef = ref<HTMLCanvasElement>()
const isReady = ref(false)
const isGlitching = ref(false)
let distortionInstance: ReturnType<typeof import('~/composables/useTextDistortion').useTextDistortion> | null = null
let glitchIntervalId: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  if (!canvasRef.value)
    return

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced)
    return

  const { useTextDistortion } = await import('~/composables/useTextDistortion')

  // Compute font size from CSS --text-display (approximate for canvas rendering)
  const computed = getComputedStyle(document.documentElement)
  const displaySize = computed.getPropertyValue('--text-display').trim()
  // Parse clamp value — take the vw middle value and compute pixels
  const vwMatch = displaySize.match(/([\d.]+)vw/)
  const fontSize = vwMatch
    ? (parseFloat(vwMatch[1]) / 100) * window.innerWidth
    : 200

  const sim = useTextDistortion({
    fontSize: Math.min(fontSize, 300), // cap for performance
    lines: props.lines,
  })

  const success = sim.init(canvasRef.value)
  if (!success)
    return

  distortionInstance = sim

  const delay = props.startDelay ?? 300
  setTimeout(() => {
    sim.start()
    isReady.value = true

    // Start glitch interval (random glitch every 100-400ms, only on hover)
    startGlitchCycle()
  }, delay)
})

function startGlitchCycle() {
  function scheduleGlitch() {
    const delay = 2000 + Math.random() * 4000 // glitch every 2-6 seconds
    glitchIntervalId = setTimeout(() => {
      isGlitching.value = true
      // Glitch lasts 50-150ms
      setTimeout(() => {
        isGlitching.value = false
        scheduleGlitch()
      }, 50 + Math.random() * 100)
    }, delay)
  }
  scheduleGlitch()
}

onUnmounted(() => {
  distortionInstance?.destroy()
  distortionInstance = null
  if (glitchIntervalId) clearTimeout(glitchIntervalId)
})
</script>

<template>
  <div class="text-distortion" :class="{ 'text-distortion--ready': isReady }">
    <!-- WebGL canvas -->
    <canvas
      ref="canvasRef"
      class="text-distortion__canvas"
      aria-hidden="true"
    />

    <!-- Glitch slice overlay (CSS-based) -->
    <div
      v-if="isGlitching"
      class="text-distortion__glitch"
      aria-hidden="true"
    />

    <!-- Noise grain overlay -->
    <div class="text-distortion__grain" aria-hidden="true" />

    <!-- Scanline overlay -->
    <div class="text-distortion__scanlines" aria-hidden="true" />
  </div>
</template>

<style scoped>
.text-distortion {
  position: relative;
  width: 100%;
}

.text-distortion__canvas {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: auto;
  opacity: 0;
  transition: opacity 0.6s ease;
}

.text-distortion--ready .text-distortion__canvas {
  opacity: 1;
}

/* ─── Glitch Slice Effect ─────────── */
.text-distortion__glitch {
  position: absolute;
  inset: 0;
  pointer-events: none;
  /* Random horizontal band shift via clip-path */
  clip-path: polygon(
    0% 15%, 100% 15%, 100% 18%, 0% 18%,
    0% 45%, 100% 45%, 100% 50%, 0% 50%,
    0% 72%, 100% 72%, 100% 75%, 0% 75%
  );
  background: inherit;
  transform: translateX(3px);
  mix-blend-mode: screen;
  opacity: 0.6;
}

/* ─── Noise Grain ─────────── */
.text-distortion__grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 256px 256px;
  animation: grainShift 0.5s steps(4) infinite;
  mix-blend-mode: overlay;
}

@keyframes grainShift {
  0% { background-position: 0 0; }
  25% { background-position: -64px -32px; }
  50% { background-position: 32px -64px; }
  75% { background-position: -32px 64px; }
  100% { background-position: 64px 32px; }
}

/* ─── Scanlines ─────────── */
.text-distortion__scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.03;
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.05) 2px,
    rgba(255, 255, 255, 0.05) 4px
  );
}

/* ─── Reduced Motion ─────────── */
@media (prefers-reduced-motion: reduce) {
  .text-distortion__grain {
    animation: none;
    display: none;
  }
  .text-distortion__glitch {
    display: none;
  }
  .text-distortion__scanlines {
    display: none;
  }
}
</style>
```

### Step 2: Verify component renders

Run: `pnpm dev`
(Component isn't integrated into hero yet — will be in Task 4. Just verify no import/compile errors.)

### Step 3: Commit

```bash
git add app/components/UiTextDistortion.vue
git commit -m "feat: add UiTextDistortion component with glitch, grain, scanline layers"
```

---

## Task 4: Restructure SectionHero Layout

**Files:**
- Modify: `app/components/SectionHero.vue`

### Step 1: Rewrite SectionHero.vue completely

Replace the entire contents of `app/components/SectionHero.vue`:

```vue
<script setup lang="ts">
import { profile } from '~/constants/profile'

const heroRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
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

  // Title letters slide up with stagger
  tl.from('.hero__char', {
    y: '110%',
    duration: 1.0,
    stagger: 0.04,
    ease: 'power3.out',
  })

  // Top meta bar fades in
  tl.from('.hero__meta', {
    y: -10,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
  }, '-=0.3')

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

// Split text into individual characters for staggered animation
const firstName = 'BILLY'.split('')
const lastName = 'MAULANA'.split('')

// Text distortion lines config
const distortionLines = [
  { text: 'BILLY', indent: 0 },
  { text: 'MAULANA', indent: 60 },
]
</script>

<template>
  <section
    id="hero"
    ref="heroRef"
    class="hero"
    aria-label="Billy Maulana — Frontend Engineer"
    @mousemove="onMouseMove"
  >
    <!-- WebGL Fluid Background -->
    <UiFluidCanvas
      :start-delay="300"
      :initial-splats="5"
    />

    <!-- Ambient gradient -->
    <div class="hero__ambient" />

    <!-- Top Meta Bar -->
    <div class="hero__meta">
      <span class="hero__meta-role">{{ profile.title }} — {{ profile.location }}</span>
      <span class="hero__meta-years">({{ String(profile.yearsExperience).padStart(2, '0') }})</span>
    </div>

    <!-- Content -->
    <div ref="titleRef" class="hero__content">
      <!-- WebGL Text Distortion (visual layer) -->
      <UiTextDistortion
        :lines="distortionLines"
        :start-delay="600"
        class="hero__distortion"
      />

      <!-- Accessible HTML text (hidden when WebGL ready, visible for screen readers + SEO) -->
      <div class="hero__title-accessible" aria-hidden="false">
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
      </div>
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

/* Ambient gradient */
.hero__ambient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0, 71, 255, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 60% 80% at 30% 60%, rgba(0, 245, 255, 0.04) 0%, transparent 60%);
  pointer-events: none;
  z-index: 2;
}

/* ─── Top Meta Bar ─────────────── */
.hero__meta {
  position: absolute;
  top: clamp(1.5rem, 3vh, 2.5rem);
  left: var(--page-margin);
  right: var(--page-margin);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: var(--z-content, 10);
}

.hero__meta-role {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.hero__meta-years {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-tertiary);
  letter-spacing: 0.1em;
  font-variant-numeric: tabular-nums;
}

/* ─── Content ─────────────── */
.hero__content {
  --chromatic-x: 0px;
  --chromatic-y: 0px;
  position: relative;
  z-index: var(--z-content, 10);
  width: 100%;
  padding-left: var(--page-margin);
  padding-right: var(--page-margin);
}

/* WebGL distortion canvas — positioned over the HTML text */
.hero__distortion {
  position: relative;
  z-index: 2;
}

/* Accessible HTML text — visible by default, hidden when WebGL distortion loads */
.hero__title-accessible {
  position: relative;
  z-index: 1;
}

/* When distortion is ready, fade the HTML text but keep for screen readers */
.hero__distortion:deep(.text-distortion--ready) ~ .hero__title-accessible {
  opacity: 0;
  pointer-events: none;
  position: absolute;
  inset: 0;
}

/* Title wrapper */
.hero__title-wrap {
  overflow: hidden;
  line-height: 1;
}

/* Title base */
.hero__title {
  font-size: var(--text-display);
  font-weight: 900;
  line-height: 0.84;
  letter-spacing: -0.04em;
  color: var(--color-text-primary);
  margin: 0;
  display: flex;

  /* Chromatic aberration — active on HTML text fallback */
  text-shadow:
    var(--chromatic-x) var(--chromatic-y) 0 rgba(255, 51, 51, 0.25),
    calc(var(--chromatic-x) * -1) calc(var(--chromatic-y) * -1) 0 rgba(0, 71, 255, 0.3);
}

.hero__title--last {
  padding-left: clamp(1rem, 5vw, 6rem);
}

/* Character wrapper */
.hero__char-wrap {
  display: inline-block;
  overflow: hidden;
}

.hero__char {
  display: inline-block;
  will-change: transform;
}

/* ─── Scroll Indicator ─────────── */
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

/* ─── Responsive ─────────────── */
@media (max-width: 768px) {
  .hero__title--last {
    padding-left: 0.5rem;
  }
}

/* ─── Reduced Motion ─────────── */
@media (prefers-reduced-motion: reduce) {
  .hero__scroll-line {
    animation: none;
    opacity: 0.5;
  }
}
</style>
```

### Step 2: Verify the new layout

Run: `pnpm dev`
Open browser and verify:
- Top meta bar shows "Frontend Engineer — Bandung, Indonesia" on left and "(07)" on right
- BILLY and MAULANA display large and left-aligned with MAULANA indented
- WebGL text distortion canvas appears over the text
- Scroll indicator at bottom center

### Step 3: Commit

```bash
git add app/components/SectionHero.vue
git commit -m "feat: restructure hero to cinematic layout with meta bar + text distortion"
```

---

## Task 5: Update CSS Design Tokens

**Files:**
- Modify: `app/assets/css/main.css`

### Step 1: Update the display typography scale

In `app/assets/css/main.css`, change the `--text-display` value on line 33:

```css
--text-display:  clamp(4rem, 14vw, 16rem);
```

This increases the display size from the previous `clamp(3.5rem, 12vw, 14rem)` — bigger on large screens, slightly bigger minimum on mobile.

### Step 2: Verify typography change

Run: `pnpm dev`
Check that hero text is visibly larger, especially on desktop.

### Step 3: Commit

```bash
git add app/assets/css/main.css
git commit -m "style: increase display typography to cinematic scale"
```

---

## Task 6: Lint Fix and Final Verification

**Files:**
- All modified/created files

### Step 1: Run linter

Run: `pnpm lint:fix`
Fix any ESLint issues that arise from the new code.

### Step 2: Run typecheck

Run: `pnpm typecheck`
Fix any TypeScript errors.

### Step 3: Run build

Run: `pnpm generate`
Verify SSG generation succeeds with zero errors.

### Step 4: Visual verification checklist

Open `pnpm dev` in browser and verify ALL of the following:

1. **Fluid sim**: Move mouse rapidly for 30+ seconds — colors stay blue/cyan/purple, never grey
2. **Fluid sim**: On mobile (or DevTools touch simulation), multi-touch doesn't grey-out
3. **Text distortion**: "BILLY MAULANA" text starts noisy/displaced, settles into clarity
4. **Text distortion**: Moving mouse near text creates liquid ink displacement
5. **Text distortion**: Chromatic RGB split visible on hover
6. **Text distortion**: Occasional subtle glitch slice effect
7. **Text distortion**: Noise grain overlay barely visible
8. **Layout**: Top meta bar with role and years
9. **Layout**: Text fills ~85% viewport width on desktop
10. **Layout**: MAULANA indented more than before
11. **Entrance**: Fluid → text reveal → meta bar → scroll (sequential, choreographed)
12. **Responsive**: Works on 375px mobile viewport
13. **Accessibility**: screen reader can read "Billy Maulana"
14. **Performance**: maintains 60fps during hover interactions

### Step 5: Commit

```bash
git add -A
git commit -m "chore: lint fix and verify hero enhancement"
```

---

## Summary of All Changes

| File | Action | Purpose |
|------|--------|---------|
| `app/composables/useFluidSimulation.ts` | Modify | Tone-mapping display shader, faster decay, touch throttle, periodic soft-clear |
| `app/composables/useTextDistortion.ts` | Create | WebGL text-to-texture with liquid displacement + chromatic aberration |
| `app/components/UiTextDistortion.vue` | Create | Vue wrapper with glitch slice, noise grain, scanline CSS overlays |
| `app/components/SectionHero.vue` | Modify | Cinematic layout with top meta bar, integrated text distortion |
| `app/assets/css/main.css` | Modify | Larger display typography scale |
