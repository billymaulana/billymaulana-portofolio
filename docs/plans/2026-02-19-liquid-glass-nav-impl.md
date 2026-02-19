# Liquid Glass Navigation — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the CSS/SVG glassmorphism in AppNavigation with a full WebGL2 liquid glass shader featuring Snell's law refraction, organic SDF edges, chromatic aberration, mouse lens + displacement wake, condensation droplets, caustic patterns, and surface tension.

**Architecture:** A new `useGlassShader` composable creates a WebGL2 context on a `<canvas>` element inside the nav panel. One fragment shader renders all glass effects (SDF shape, refraction, chromatic, specular, mouse lens, wake, droplets). Two ping-pong FBOs maintain ripple state for the displacement wake. The HTML menu content overlays the canvas at z-index 2.

**Tech Stack:** WebGL2, GLSL ES 3.00, Vue 3 composable, existing Nuxt 4 auto-import

**Design doc:** `docs/plans/2026-02-19-liquid-glass-nav-design.md`

**Existing patterns to follow:** `app/composables/useFluidSimulation.ts` — same API shape: `init(canvas)`, `start()`, `stop()`, `destroy()`, `resize()`. Same FBO/Program interfaces. Inline GLSL strings.

---

### Task 1: WebGL2 Composable Skeleton + Minimal SDF Render

**Files:**
- Create: `app/composables/useGlassShader.ts`

**Context:** This composable follows the same pattern as `useFluidSimulation.ts`. It returns `{ init, start, stop, destroy, resize }`. The fluid sim uses WebGL2 context (`canvas.getContext('webgl2')`). We do the same.

**Step 1: Create composable with WebGL2 boilerplate**

Create `app/composables/useGlassShader.ts` with:

```typescript
/**
 * WebGL2 Liquid Glass Shader
 * Renders a liquid glass panel with Snell's law refraction, organic SDF edges,
 * chromatic aberration, mouse lens, displacement wake, and condensation droplets.
 */

interface GlassConfig {
  /** Index of refraction for glass (default 1.45) */
  ior: number
  /** Organic edge wave amplitude in pixels (default 12) */
  waveAmplitude: number
  /** Mouse lens radius in pixels (default 160 desktop, 120 mobile) */
  lensRadius: number
  /** Number of condensation droplets (default 10 desktop, 5 mobile) */
  dropletCount: number
  /** Whether reduced motion is preferred */
  reducedMotion: boolean
}

const defaultConfig: GlassConfig = {
  ior: 1.45,
  waveAmplitude: 12,
  lensRadius: 160,
  dropletCount: 10,
  reducedMotion: false,
}

// ─── GLSL Shaders ───────────────────────────────────

const vertexShader = `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUv;

void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

// Minimal fragment shader — just renders the SDF shape as white glass on black
const fragmentShader = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform vec2 uResolution;
uniform float uTime;
uniform float uOpenProgress;

// ─── SDF Helpers ─────────────────────────────────────

float sdRoundedBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

// Hash-based noise (no texture needed)
float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p, int octaves) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < octaves; i++) {
    value += amplitude * noise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = vUv;
  vec2 pixel = uv * uResolution;

  // Aspect-corrected coordinates centered on panel
  vec2 center = uResolution * 0.5;
  vec2 p = pixel - center;

  // Panel half-size (with margin for organic edge overflow)
  vec2 halfSize = center - 20.0;
  float cornerRadius = 24.0;

  // fBm noise perturbation on edges
  float t = uTime * 0.3;
  float edgeNoise = fbm(uv * 8.0 + t, 3) * 2.0 - 1.0;
  float waveAmp = 12.0 * uOpenProgress;

  // Perturb the SDF distance
  float d = sdRoundedBox(p, halfSize, cornerRadius);
  d += edgeNoise * waveAmp;

  // Glass body: white tint inside SDF
  float inside = 1.0 - smoothstep(-2.0, 0.0, d);
  float edgeFade = smoothstep(-40.0, -4.0, d);

  // Base glass color
  float baseTint = mix(0.1, 0.08, edgeFade);
  vec3 glass = vec3(baseTint) * inside;

  // Surface tension meniscus — bright line at SDF boundary
  float meniscus = exp(-abs(d) * 0.8) * 0.2;
  glass += vec3(meniscus);

  // Alpha: glass inside SDF, transparent outside
  float alpha = inside * uOpenProgress;

  fragColor = vec4(glass, alpha);
}
`

export function useGlassShader(config: Partial<GlassConfig> = {}) {
  const cfg = { ...defaultConfig, ...config }
  let gl: WebGL2RenderingContext | null = null
  let canvas: HTMLCanvasElement | null = null
  let animationId = 0
  let startTime = 0

  // Program
  let program: WebGLProgram | null = null
  let uniforms: Record<string, WebGLUniformLocation | null> = {}

  // Geometry
  let vao: WebGLVertexArrayObject | null = null

  // State
  let mouse = { x: 0.5, y: 0.5 }
  let mouseVel = { x: 0, y: 0 }
  let openProgress = 0

  function compileShader(source: string, type: number): WebGLShader | null {
    const shader = gl!.createShader(type)
    if (!shader) return null
    gl!.shaderSource(shader, source)
    gl!.compileShader(shader)
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      console.error('Shader compile error:', gl!.getShaderInfoLog(shader))
      gl!.deleteShader(shader)
      return null
    }
    return shader
  }

  function createProgram(vsSrc: string, fsSrc: string): WebGLProgram | null {
    const vs = compileShader(vsSrc, gl!.VERTEX_SHADER)
    const fs = compileShader(fsSrc, gl!.FRAGMENT_SHADER)
    if (!vs || !fs) return null

    const prog = gl!.createProgram()!
    gl!.attachShader(prog, vs)
    gl!.attachShader(prog, fs)
    gl!.linkProgram(prog)

    if (!gl!.getProgramParameter(prog, gl!.LINK_STATUS)) {
      console.error('Program link error:', gl!.getProgramInfoLog(prog))
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

  function initGeometry() {
    // Full-screen quad as triangle strip
    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])
    vao = gl!.createVertexArray()
    gl!.bindVertexArray(vao)

    const buffer = gl!.createBuffer()
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer)
    gl!.bufferData(gl!.ARRAY_BUFFER, vertices, gl!.STATIC_DRAW)

    const aPos = gl!.getAttribLocation(program!, 'aPosition')
    gl!.enableVertexAttribArray(aPos)
    gl!.vertexAttribPointer(aPos, 2, gl!.FLOAT, false, 0, 0)
    gl!.bindVertexArray(null)
  }

  function render() {
    if (!gl || !program) return
    const now = (performance.now() - startTime) / 1000

    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(program)
    gl.uniform2f(uniforms.uResolution, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.uniform1f(uniforms.uTime, now)
    gl.uniform1f(uniforms.uOpenProgress, openProgress)

    gl.bindVertexArray(vao)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.bindVertexArray(null)

    animationId = requestAnimationFrame(render)
  }

  function handleResize() {
    if (!canvas || !gl) return
    const dpr = Math.min(window.devicePixelRatio, 2)
    const w = canvas.clientWidth * dpr
    const h = canvas.clientHeight * dpr
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
  }

  function init(canvasEl: HTMLCanvasElement): boolean {
    canvas = canvasEl
    gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      preserveDrawingBuffer: false,
    })

    if (!gl) {
      console.warn('WebGL2 not supported — falling back to CSS glass')
      return false
    }

    // Enable blending for transparent canvas
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    program = createProgram(vertexShader, fragmentShader)
    if (!program) return false

    uniforms = getUniforms(program, [
      'uResolution', 'uTime', 'uMouse', 'uMouseVelocity',
      'uOpenProgress', 'uScrollY', 'uIsDesktop',
    ])

    initGeometry()
    handleResize()
    startTime = performance.now()
    return true
  }

  function start() {
    if (!gl) return
    handleResize()
    animationId = requestAnimationFrame(render)
  }

  function stop() {
    cancelAnimationFrame(animationId)
    animationId = 0
  }

  function destroy() {
    stop()
    if (gl && program) {
      gl.deleteProgram(program)
    }
    if (gl && vao) {
      gl.deleteVertexArray(vao)
    }
    gl = null
    canvas = null
    program = null
  }

  function setMouse(x: number, y: number, vx: number, vy: number) {
    mouse = { x, y }
    mouseVel = { x: vx, y: vy }
  }

  function setOpenProgress(p: number) {
    openProgress = p
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
```

**Step 2: Verify composable compiles**

Run: `pnpm typecheck`
Expected: No type errors from `useGlassShader.ts`

**Step 3: Commit**

```bash
git add app/composables/useGlassShader.ts
git commit -m "feat: WebGL2 glass shader composable skeleton with minimal SDF"
```

---

### Task 2: Glass Body + Synthesized Background + Caustics

**Files:**
- Modify: `app/composables/useGlassShader.ts` (fragment shader)

**Context:** Now that the skeleton renders a white SDF shape, add the synthesized background gradient, caustic light patterns, and the full glass body tinting described in the design doc.

**Step 1: Expand the fragment shader**

Replace the `main()` function in the fragment shader with the full glass body implementation:

- Synthesized background: dark base (`#0A0A0A`) + blue/cyan/purple gradient field using noise + sin waves
- Glass body: semi-translucent white tint (`0.08-0.12`) inside SDF, with edge opacity fade
- Caustic streaks: diagonal `sin()` light bands at `0.03-0.06` opacity
- Caustic light pattern: layered `sin()` waves creating swimming pool light effect
- Surface tension meniscus: 2-4px bright line at SDF boundary, animated with same fBm

The synthesized background function should look like:

```glsl
vec3 synthesizedBackground(vec2 uv, float time) {
  vec3 base = vec3(0.04); // Near-black
  // Blue/cyan/purple gradient from accent colors
  float n = fbm(uv * 3.0 + time * 0.1, 3);
  vec3 blue = vec3(0.0, 0.28, 1.0);    // #0047FF
  vec3 cyan = vec3(0.0, 0.96, 1.0);    // #00F5FF
  vec3 purple = vec3(0.27, 0.0, 1.0);  // #4400FF
  vec3 accent = mix(blue, mix(cyan, purple, n), n);
  return base + accent * 0.08;
}
```

The caustic pattern function:

```glsl
float causticPattern(vec2 uv, float time) {
  float c = 0.0;
  // 3 layers of sin waves at different angles
  c += sin(dot(uv, vec2(3.0, 7.0)) * 12.0 + time * 0.5) * 0.5 + 0.5;
  c += sin(dot(uv, vec2(-5.0, 3.0)) * 10.0 + time * 0.7) * 0.5 + 0.5;
  c += sin(dot(uv, vec2(4.0, -6.0)) * 14.0 + time * 0.3) * 0.5 + 0.5;
  c /= 3.0;
  return c * c; // Square for sharper caustic lines
}
```

**Step 2: Verify in browser**

Run: `pnpm dev`
Open nav menu — you should see the SDF shape with white glass body, subtle blue/cyan background showing through edges, and animated caustic patterns.

**Step 3: Commit**

```bash
git add app/composables/useGlassShader.ts
git commit -m "feat: glass body with synthesized background and caustic patterns"
```

---

### Task 3: Snell's Law Refraction + Chromatic Aberration

**Files:**
- Modify: `app/composables/useGlassShader.ts` (fragment shader)

**Context:** Add physics-based refraction. The SDF gradient gives us surface normals. Snell's law bends the UV sample coordinates. Three separate refraction passes with different IOR values (1.42, 1.45, 1.48) create chromatic aberration.

**Step 1: Add refraction functions to fragment shader**

```glsl
// Compute SDF gradient (surface normal) via central differences
vec2 sdfNormal(vec2 p, vec2 halfSize, float cornerRadius, float waveAmp, float t) {
  float eps = 1.0;
  float dx = sdfWithNoise(p + vec2(eps, 0.0), halfSize, cornerRadius, waveAmp, t)
           - sdfWithNoise(p - vec2(eps, 0.0), halfSize, cornerRadius, waveAmp, t);
  float dy = sdfWithNoise(p + vec2(0.0, eps), halfSize, cornerRadius, waveAmp, t)
           - sdfWithNoise(p - vec2(0.0, eps), halfSize, cornerRadius, waveAmp, t);
  return normalize(vec2(dx, dy));
}

// Snell's law 2D refraction
vec2 refractUV(vec2 uv, vec2 normal, float ior, float edgeDist) {
  // Refraction strength proportional to surface curvature (stronger at edges)
  float strength = smoothstep(-40.0, 0.0, edgeDist);
  float ratio = 1.0 / ior;
  float cosI = dot(normal, vec2(0.0, 0.0) - normal);
  float sinT2 = ratio * ratio * (1.0 - cosI * cosI);
  float offset = ratio * strength * 0.02;
  return uv + normal * offset;
}
```

The main pass becomes:

```glsl
// Chromatic aberration: 3 refraction passes
vec2 normalDir = sdfNormal(p, halfSize, cornerRadius, waveAmp, t);
vec2 uvR = refractUV(uv, normalDir, 1.42, d);
vec2 uvG = refractUV(uv, normalDir, 1.45, d);
vec2 uvB = refractUV(uv, normalDir, 1.48, d);

float bgR = synthesizedBackground(uvR, uTime).r;
float bgG = synthesizedBackground(uvG, uTime).g;
float bgB = synthesizedBackground(uvB, uTime).b;
vec3 refracted = vec3(bgR, bgG, bgB);
```

The chromatic aberration is strongest at the SDF edges (where `edgeDist` approaches 0 from inside). In the glass center, all 3 channels sample nearly the same UV so no color splitting occurs.

**Step 2: Verify in browser**

Open nav menu — edges should show iridescent blue/purple/cyan color fringing. Center should look clean white glass. The refraction effect should visibly bend the synthesized background.

**Step 3: Commit**

```bash
git add app/composables/useGlassShader.ts
git commit -m "feat: Snell's law refraction with chromatic aberration"
```

---

### Task 4: Mouse Refraction Lens

**Files:**
- Modify: `app/composables/useGlassShader.ts` (shader + JS uniforms)

**Context:** Pass mouse position to shader. The mouse creates a radial lens that increases transparency and refraction strength. Per the design: ~160px radius, inner 40% = higher transparency, 1.5x refraction boost, 2x chromatic boost at lens boundary.

**Step 1: Add mouse uniform to render loop**

In the `render()` function, add:

```typescript
gl.uniform2f(uniforms.uMouse, mouse.x, mouse.y)
gl.uniform2f(uniforms.uMouseVelocity, mouseVel.x, mouseVel.y)
```

**Step 2: Add mouse lens to fragment shader**

```glsl
uniform vec2 uMouse;
uniform vec2 uMouseVelocity;

// In main():
vec2 mousePixel = uMouse * uResolution;
float mouseDist = length(pixel - mousePixel);
float lensRadius = 160.0; // TODO: uniform for desktop/mobile
float lensFactor = 1.0 - smoothstep(0.0, lensRadius, mouseDist);

// Inner 40% = clear zone (higher transparency)
float clearZone = 1.0 - smoothstep(0.0, lensRadius * 0.4, mouseDist);

// Boost refraction inside lens (1.5x)
float refractionBoost = 1.0 + lensFactor * 0.5;

// Boost chromatic at lens boundary (2x)
float chromaticBoost = 1.0 + smoothstep(lensRadius * 0.3, lensRadius * 0.7, mouseDist)
                           * (1.0 - smoothstep(lensRadius * 0.7, lensRadius, mouseDist)) * 1.0;

// Apply: modify refractUV offset by refractionBoost
// Apply: reduce glass tint opacity in clearZone
float glassTintMod = mix(baseTint, baseTint * 0.3, clearZone);
```

**Step 3: Verify in browser**

Move mouse over the glass panel. Near the cursor, the glass should become more transparent (clearer) and the background refraction should intensify. At the lens boundary, chromatic aberration should be stronger (more color fringing).

**Step 4: Commit**

```bash
git add app/composables/useGlassShader.ts
git commit -m "feat: mouse-interactive refraction lens with chromatic boost"
```

---

### Task 5: Displacement Wake (Ping-Pong FBOs)

**Files:**
- Modify: `app/composables/useGlassShader.ts` (FBO management + wake shader)

**Context:** This is the most complex part. Two framebuffer objects store the "ripple state" texture. Each frame: (1) read previous state, (2) add ripple at mouse pos if moved, (3) run wave equation with damping, (4) write to alternate FBO, (5) swap. The main shader reads this ripple texture to modulate refraction.

**Step 1: Add FBO creation helpers**

Follow the same FBO pattern from `useFluidSimulation.ts`:

```typescript
interface FBO {
  texture: WebGLTexture
  framebuffer: WebGLFramebuffer
  width: number
  height: number
}

function createFBO(width: number, height: number): FBO {
  const texture = gl!.createTexture()!
  gl!.bindTexture(gl!.TEXTURE_2D, texture)
  gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RG16F, width, height, 0, gl!.RG, gl!.HALF_FLOAT, null)
  gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR)
  gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR)
  gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
  gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)

  const framebuffer = gl!.createFramebuffer()!
  gl!.bindFramebuffer(gl!.FRAMEBUFFER, framebuffer)
  gl!.framebufferTexture2D(gl!.FRAMEBUFFER, gl!.COLOR_ATTACHMENT0, gl!.TEXTURE_2D, texture, 0)

  return { texture, framebuffer, width, height }
}
```

Create two FBOs at half resolution for the ping-pong.

**Step 2: Create wake update shader**

A separate shader program that reads the previous ripple state, applies wave equation, adds new ripple at mouse position, and writes the new state:

```glsl
// Wake update fragment shader
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;
uniform vec2 uTexelSize;
uniform vec2 uMousePos;       // normalized
uniform float uMouseSpeed;    // 0-1
uniform float uDamping;       // ~0.98

void main() {
  // Read neighbors for wave equation
  vec2 state = texture(uPrevState, vUv).rg;
  float height = state.r;
  float velocity = state.g;

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
```

**Step 3: Integrate wake into render loop**

The render loop becomes 3 passes:
1. Wake update: read FBO A → write FBO B
2. Swap FBO references
3. Main glass render: read FBO B as ripple texture → modulate refraction

Add `uniform sampler2D uWakeTexture;` to the main fragment shader. In the refraction section, add the wake displacement:

```glsl
float wake = texture(uWakeTexture, uv).r;
// Wake displaces the refraction UV
uvR += normalDir * wake * 0.01;
uvG += normalDir * wake * 0.01;
uvB += normalDir * wake * 0.01;
```

**Step 4: Verify in browser**

Move mouse quickly across the glass panel — ripples should emanate from the cursor path and decay over ~1.5s. The ripples should visibly modulate the refraction (background bends where ripples are).

**Step 5: Commit**

```bash
git add app/composables/useGlassShader.ts
git commit -m "feat: displacement wake with ping-pong FBOs and wave equation"
```

---

### Task 6: Specular Highlights + Noise Grain + Shimmer

**Files:**
- Modify: `app/composables/useGlassShader.ts` (fragment shader)

**Context:** Add the finishing visual layers: Fresnel specular at edges, top rim highlight, mouse-following highlight hotspot, hash-based noise grain, and a slow-moving shimmer band.

**Step 1: Add specular and noise to fragment shader**

```glsl
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
vec3 finalColor = refracted + glass + vec3(specular + grain + shimmer);
float finalAlpha = inside * uOpenProgress;
fragColor = vec4(finalColor, finalAlpha);
```

**Step 2: Verify in browser**

Glass should have visible specular highlights — bright top rim, subtle glow near cursor, Fresnel brightening at edges. Fine noise grain gives texture. Slow shimmer band moves diagonally.

**Step 3: Commit**

```bash
git add app/composables/useGlassShader.ts
git commit -m "feat: specular highlights, noise grain, and shimmer animation"
```

---

### Task 7: Condensation Droplets

**Files:**
- Modify: `app/composables/useGlassShader.ts` (fragment shader)

**Context:** 8-12 small glass "droplets" positioned near panel edges. Each is a tiny SDF circle with its own refraction. They drift downward (gravity) and scatter when mouse approaches.

**Step 1: Add droplet system to fragment shader**

Define droplet positions as constants (or pseudo-random from hash):

```glsl
// Droplet parameters — positions/sizes generated from hash
const int MAX_DROPLETS = 12;

struct Droplet {
  vec2 basePos;   // normalized base position (0-1)
  float radius;   // pixels
  float phase;    // animation phase offset
};

Droplet getDroplet(int i, float time) {
  float fi = float(i);
  Droplet d;
  // Cluster near left edge (x: 0.02-0.12) and bottom (y: 0.7-0.95)
  float side = step(0.5, hash21(vec2(fi, 0.0))); // 0=left, 1=bottom
  d.basePos.x = mix(0.02, 0.12, hash21(vec2(fi, 1.0))) * (1.0 - side)
              + mix(0.2, 0.8, hash21(vec2(fi, 2.0))) * side;
  d.basePos.y = mix(0.3, 0.7, hash21(vec2(fi, 3.0))) * (1.0 - side)
              + mix(0.88, 0.98, hash21(vec2(fi, 4.0))) * side;
  // Gravity drift
  d.basePos.y += time * 0.0003 * (1.0 + hash21(vec2(fi, 5.0)));
  d.basePos.y = fract(d.basePos.y); // wrap around
  d.radius = mix(4.0, 16.0, hash21(vec2(fi, 6.0)));
  d.phase = hash21(vec2(fi, 7.0)) * 6.28;
  return d;
}

// In main():
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
finalColor += dropletColor;
finalAlpha = max(finalAlpha, dropletAlpha * uOpenProgress);
```

**Step 2: Add `uDropletCount` uniform**

In the JS `render()`, add:
```typescript
gl.uniform1i(uniforms.uDropletCount, cfg.dropletCount)
```

And add `'uDropletCount'` to the `getUniforms()` call.

**Step 3: Verify in browser**

Small glass droplets should appear near the left and bottom edges of the panel. They drift slowly downward. Moving the mouse near them should push them away slightly, then they resettle.

**Step 4: Commit**

```bash
git add app/composables/useGlassShader.ts
git commit -m "feat: condensation droplets with gravity drift and mouse scatter"
```

---

### Task 8: Integrate into AppNavigation.vue

**Files:**
- Modify: `app/components/global/AppNavigation.vue`

**Context:** Replace the 4 CSS glass layers and SVG filters with a single WebGL canvas. Wire up the existing mouse tracking to the shader. Handle menu open/close lifecycle. Add WebGL2 fallback.

**Step 1: Update the script section**

Remove refs that are no longer needed: `lensRef`, `surfaceRef`, `isGlassReady`, `currentDisplacementScale`, and the entire `animateLens()` function, `onAfterEnter()`, `onLeave()`.

Add new refs and composable:

```typescript
const glassCanvasRef = ref<HTMLCanvasElement | null>(null)
const hasWebGL = ref(true)

// Import and initialize the glass shader
const glassShader = useGlassShader({
  reducedMotion: false, // Will check on mount
})
```

Update mouse tracking — the existing `handlePanelMove()` stays but feeds the shader instead of CSS variables:

```typescript
function handlePanelMove(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height
  const dx = x - mouseTarget.x
  const dy = y - mouseTarget.y
  mouseTarget.x = x
  mouseTarget.y = y
  glassShader.setMouse(x, y, dx, dy)
}
```

Update the `watch(isMenuOpen)` handler:

```typescript
watch(isMenuOpen, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
  document.body.style.overflow = open ? 'hidden' : ''
  document.documentElement.classList.toggle('menu-open', open)

  if (open) {
    mouseTarget = { x: 0.5, y: 0.5 }
    if (hasWebGL.value) {
      glassShader.setOpenProgress(1)
      glassShader.resize()
      glassShader.start()
    }
  } else {
    glassShader.setOpenProgress(0)
    glassShader.stop()
  }
})
```

Update `onMounted`:

```typescript
onMounted(() => {
  // Init WebGL glass
  if (glassCanvasRef.value) {
    hasWebGL.value = glassShader.init(glassCanvasRef.value)
  }

  // Check reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Pass config for reduced motion
  }

  // Scroll handler (keep existing)
  function onScroll() {
    const currentY = window.scrollY
    isScrolled.value = currentY > 50
    isHidden.value = currentY > lastScrollY && currentY > 300
    lastScrollY = currentY
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    glassShader.destroy()
  })
})
```

**Step 2: Update the template**

Replace the 4 glass layers inside `nav__panel` with a single canvas:

```html
<div ref="panelRef" class="nav__panel" @pointermove="handlePanelMove">
  <!-- WebGL Glass (replaces 4 CSS layers) -->
  <canvas
    v-if="hasWebGL"
    ref="glassCanvasRef"
    class="nav__glass-canvas"
  />
  <!-- CSS fallback (shown only when WebGL unavailable) -->
  <template v-else>
    <div class="nav__glass-body" />
  </template>
  <!-- Content (unchanged) -->
  <div class="nav__panel-inner">
    <!-- ... existing menu content ... -->
  </div>
</div>
```

**Step 3: Update the styles**

Remove all CSS related to the old glass layers:
- `.nav__glass-body` and its mobile/desktop variants (keep for fallback but simplify)
- `.nav__glass-refract`
- `.nav__glass-lens`
- `.nav__glass-surface` (including `::before` and `::after`)
- `.nav__glass--ready`
- `@keyframes liquidShimmer`

Add new canvas CSS:

```css
.nav__glass-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
```

**Step 4: Remove SVG filter definitions**

Delete the entire `<svg class="nav__filters">` block from the template, along with `.nav__filters` CSS.

**Step 5: Verify in browser**

Run `pnpm dev`. Open menu:
- Desktop: right-side panel should show WebGL glass with all effects
- Mobile: full-screen panel with WebGL glass
- If WebGL2 not supported: falls back to simplified CSS glass body

**Step 6: Run lint**

Run: `pnpm lint:fix`
Fix any ESLint issues (unused imports from removed code, etc.)

**Step 7: Commit**

```bash
git add app/components/global/AppNavigation.vue app/composables/useGlassShader.ts
git commit -m "feat: integrate WebGL liquid glass into navigation, replace CSS layers"
```

---

### Task 9: Desktop vs Mobile Responsive Modes

**Files:**
- Modify: `app/composables/useGlassShader.ts` (shader uniforms)
- Modify: `app/components/global/AppNavigation.vue` (responsive detection)

**Context:** Desktop: organic wave on LEFT edge only, 160px lens, 10 droplets. Mobile: organic edges all sides, 120px lens, 5 droplets, simplified caustics.

**Step 1: Add `uIsDesktop` uniform handling**

In `AppNavigation.vue`, detect desktop and pass to shader:

```typescript
const isDesktop = ref(window.innerWidth >= 1024)

onMounted(() => {
  const mq = window.matchMedia('(min-width: 1024px)')
  isDesktop.value = mq.matches
  mq.addEventListener('change', (e) => { isDesktop.value = e.matches })
})
```

In the `render()` function of the composable, add:
```typescript
gl.uniform1i(uniforms.uIsDesktop, isDesktop ? 1 : 0)
```

**Step 2: Modify SDF in shader for desktop/mobile**

```glsl
uniform int uIsDesktop;

// In SDF calculation:
if (uIsDesktop == 1) {
  // Desktop: organic wave on left edge only
  // Right/top/bottom edges are off-screen or use clean border-radius
  float leftEdgeDist = p.x + halfSize.x;
  float edgeMask = smoothstep(40.0, 0.0, leftEdgeDist);
  d += edgeNoise * waveAmp * edgeMask;
} else {
  // Mobile: organic edges on all sides
  d += edgeNoise * waveAmp;
}
```

**Step 3: Adjust lens radius and droplet count**

```glsl
float lensRadius = uIsDesktop == 1 ? 160.0 : 120.0;
int dropletCount = uIsDesktop == 1 ? 10 : 5;
```

**Step 4: Verify both modes**

Test in browser: resize to desktop (>1024px) and mobile (<1024px). Desktop should have organic wave only on left edge. Mobile should have organic edges all around.

**Step 5: Commit**

```bash
git add app/composables/useGlassShader.ts app/components/global/AppNavigation.vue
git commit -m "feat: responsive desktop/mobile glass modes"
```

---

### Task 10: Reduced Motion + Accessibility

**Files:**
- Modify: `app/composables/useGlassShader.ts`
- Modify: `app/components/global/AppNavigation.vue`

**Context:** `prefers-reduced-motion: reduce` should disable animations (caustics, wake, droplet drift, shimmer) but keep static glass body with minimal refraction. Mouse lens still works without animation.

**Step 1: Add `uReducedMotion` uniform**

```glsl
uniform int uReducedMotion;

// In main():
float timeScale = uReducedMotion == 1 ? 0.0 : 1.0;
float animatedTime = uTime * timeScale;

// Use animatedTime instead of uTime for:
// - fBm edge animation
// - caustic patterns
// - shimmer
// - wake propagation
// - droplet drift

// Mouse lens still uses real uTime for responsive feel
```

**Step 2: Detect reduced motion in component**

```typescript
onMounted(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // Pass to shader config or uniform
})
```

**Step 3: Verify with browser DevTools**

In Chrome DevTools > Rendering > Emulate CSS media feature `prefers-reduced-motion: reduce`. All animations should stop. Glass body should remain visible as a static white glass with refraction.

**Step 4: Commit**

```bash
git add app/composables/useGlassShader.ts app/components/global/AppNavigation.vue
git commit -m "feat: reduced motion accessibility for glass shader"
```

---

### Task 11: Open/Close Animation + Final Polish

**Files:**
- Modify: `app/composables/useGlassShader.ts`
- Modify: `app/components/global/AppNavigation.vue`

**Context:** The `uOpenProgress` uniform should animate from 0→1 on open (600ms) and 1→0 on close (500ms). This drives the SDF scale (glass grows from center), caustic fade-in delay, and droplet stagger.

**Step 1: Animate openProgress with eased interpolation**

In the composable, add a JS-side animation for `openProgress`:

```typescript
let openTarget = 0
let openCurrent = 0

function setOpenProgress(target: number) {
  openTarget = target
}

// In render():
openCurrent += (openTarget - openCurrent) * 0.08 // Smooth lerp
gl.uniform1f(uniforms.uOpenProgress, openCurrent)
```

**Step 2: Use openProgress in shader**

```glsl
// SDF scale grows from center
vec2 scaledHalfSize = halfSize * uOpenProgress;

// Caustics fade in after 200ms delay
float causticFade = smoothstep(0.4, 0.8, uOpenProgress);

// Droplets fade in at 60-80% progress (staggered per droplet)
float dropletFade = smoothstep(0.6 + float(i) * 0.02, 0.8 + float(i) * 0.02, uOpenProgress);
```

**Step 3: Verify open/close animation**

Open and close the menu repeatedly. Glass should grow smoothly from center on open, shrink on close. Caustics should appear with a slight delay. Droplets fade in last.

**Step 4: Final visual QA**

Check in browser:
- [ ] Desktop: panel slides in with liquid glass
- [ ] Mobile: clip-path expand with liquid glass
- [ ] Mouse lens creates clear refraction zone
- [ ] Mouse wake creates visible ripples
- [ ] Chromatic aberration visible at edges
- [ ] Condensation droplets drift and scatter
- [ ] Surface tension meniscus visible at organic edges
- [ ] Caustic light patterns animate subtly
- [ ] Menu text (About, Work, Contact) is clearly readable over glass
- [ ] Close/reopen doesn't leak WebGL resources

**Step 5: Run lint and typecheck**

```bash
pnpm lint:fix && pnpm typecheck
```

**Step 6: Commit**

```bash
git add app/composables/useGlassShader.ts app/components/global/AppNavigation.vue
git commit -m "feat: open/close animation and visual polish for liquid glass nav"
```

---

### Task 12: Build Verification

**Files:** None (verification only)

**Step 1: Run production build**

```bash
pnpm generate
```

Expected: Build succeeds with zero errors. The WebGL shader strings are inlined and tree-shaken correctly.

**Step 2: Preview production build**

```bash
pnpm preview
```

Open in browser, test nav menu. All effects should work in production build.

**Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: production build adjustments for liquid glass shader"
```
