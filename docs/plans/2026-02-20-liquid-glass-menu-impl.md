# Liquid Glass Menu Revamp — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current WebGL-only glass shader with a hybrid SVG Filter + WebGL architecture for authentic Apple-style liquid glass with mouse-driven blue flow field.

**Architecture:** SVG filters handle the glass body (edge-concentrated refraction, chromatic aberration, Fresnel glow) via `backdrop-filter: url(#liquid-glass)`. A separate lightweight WebGL canvas renders only the blue Navier-Stokes flow field overlaid with `mix-blend-mode: screen`. The flow field couples back into the glass by dynamically modulating the SVG displacement scale from 77 to 180 where blue dye is present.

**Tech Stack:** Nuxt 4, Vue 3 Composition API, SVG filters (feTurbulence, feDisplacementMap, feDiffuseLighting, feColorMatrix), WebGL2 (Navier-Stokes fluid sim), CSS custom properties, GSAP (dynamic import)

**Design doc:** `docs/plans/2026-02-20-liquid-glass-menu-revamp-design.md`

---

### Task 1: Create UiLiquidGlassFilter.vue — SVG Filter Definitions

**Files:**
- Create: `app/components/ui/UiLiquidGlassFilter.vue`

**Step 1: Create the SVG filter component**

This component renders a hidden SVG element containing the multi-stage liquid glass filter. It accepts a `displacementScale` prop that controls the refraction intensity (77 baseline, up to 180 when blue flow is present).

```vue
<script setup lang="ts">
const props = withDefaults(defineProps<{
  displacementScale?: number
}>(), {
  displacementScale: 77,
})

// Compute R/G/B scales for chromatic aberration (~10% spread)
const scaleR = computed(() => Math.round(props.displacementScale * 0.91))
const scaleG = computed(() => props.displacementScale)
const scaleB = computed(() => Math.round(props.displacementScale * 1.09))
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="0"
    height="0"
    style="position: absolute; overflow: hidden; pointer-events: none;"
    aria-hidden="true"
  >
    <defs>
      <!-- Main liquid glass filter -->
      <filter id="liquid-glass" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
        <!-- 1. Organic noise texture -->
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.006 0.006"
          numOctaves="3"
          seed="42"
          result="noise"
        />

        <!-- 2. Smooth the noise for displacement -->
        <feGaussianBlur in="noise" stdDeviation="1.5" result="smoothNoise" />

        <!-- 3. Edge-concentrated displacement image -->
        <!-- Red channel = X displacement, Green channel = Y displacement -->
        <!-- Neutral center (128,128) = no displacement; edges ramp to 0 or 255 -->
        <feImage
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3ClinearGradient id='lx' x1='0' y1='0' x2='1' y2='0'%3E%3Cstop offset='0%25' stop-color='%23FF0000'/%3E%3Cstop offset='15%25' stop-color='%23800000'/%3E%3Cstop offset='50%25' stop-color='%23808000'/%3E%3Cstop offset='85%25' stop-color='%23008000'/%3E%3Cstop offset='100%25' stop-color='%2300FF00'/%3E%3C/linearGradient%3E%3ClinearGradient id='ly' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%230000FF'/%3E%3Cstop offset='15%25' stop-color='%23000080'/%3E%3Cstop offset='50%25' stop-color='%23000080'/%3E%3Cstop offset='85%25' stop-color='%23000080'/%3E%3Cstop offset='100%25' stop-color='%230000FF'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23lx)'/%3E%3Crect width='200' height='200' fill='url(%23ly)' style='mix-blend-mode:screen'/%3E%3Crect x='30' y='30' width='140' height='140' rx='20' fill='%23808080' filter='blur(15px)'/%3E%3C/svg%3E"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          result="edgeMap"
        />

        <!-- 4. Merge organic noise with edge map -->
        <feComposite in="smoothNoise" in2="edgeMap" operator="arithmetic" k1="0.5" k2="0.5" k3="0" k4="0" result="mergedDisplacement" />

        <!-- 5a. Red channel displacement -->
        <feDisplacementMap
          in="SourceGraphic"
          in2="mergedDisplacement"
          :scale="scaleR"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displacedR"
        />
        <feColorMatrix in="displacedR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="redOnly" />

        <!-- 5b. Green channel displacement -->
        <feDisplacementMap
          in="SourceGraphic"
          in2="mergedDisplacement"
          :scale="scaleG"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displacedG"
        />
        <feColorMatrix in="displacedG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="greenOnly" />

        <!-- 5c. Blue channel displacement -->
        <feDisplacementMap
          in="SourceGraphic"
          in2="mergedDisplacement"
          :scale="scaleB"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displacedB"
        />
        <feColorMatrix in="displacedB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blueOnly" />

        <!-- 5d. Recombine R+G+B with screen blend -->
        <feBlend in="redOnly" in2="greenOnly" mode="screen" result="rg" />
        <feBlend in="rg" in2="blueOnly" mode="screen" result="chromatic" />

        <!-- 6. Fresnel edge glow -->
        <feMorphology in="SourceGraphic" operator="dilate" radius="3" result="dilated" />
        <feGaussianBlur in="dilated" stdDeviation="4" result="glowBlur" />
        <feComposite in="glowBlur" in2="SourceGraphic" operator="out" result="edgeGlow" />
        <feColorMatrix in="edgeGlow" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.15 0" result="fresnelGlow" />

        <!-- 7. Final composite: chromatic refraction + Fresnel glow -->
        <feComposite in="fresnelGlow" in2="chromatic" operator="over" result="final" />
      </filter>
    </defs>
  </svg>
</template>
```

**Step 2: Verify component renders**

Run: `pnpm dev` and check browser devtools for the SVG element in DOM. The filter should exist as `#liquid-glass`.

**Step 3: Commit**

```bash
git add app/components/ui/UiLiquidGlassFilter.vue
git commit -m "feat: UiLiquidGlassFilter SVG filter with chromatic aberration"
```

---

### Task 2: Rewrite useGlassShader.ts — Flow-Field-Only WebGL

**Files:**
- Replace: `app/composables/useGlassShader.ts`

**Step 1: Replace the entire file with flow-field-only composable**

Strip out all glass rendering, SDF, caustics, specular, droplets. Keep only:
- Navier-Stokes velocity simulation (64x64)
- Dye advection (256x256)
- Blue-only display shader
- Mouse interaction with velocity tracking
- Opacity cap at 0.35

The composable also exposes a `readFlowIntensity(x, y)` method that samples the dye texture to report blue intensity at a given position — this feeds back into `useLiquidGlass` to modulate the SVG filter displacement scale.

```typescript
/**
 * WebGL2 Blue Flow Field — Navier-Stokes fluid sim for mouse-driven blue liquid.
 * Renders only the blue flow overlay; glass body is handled by SVG filters.
 */

interface FlowConfig {
  maxOpacity: number
  dyeDissipation: number
  splatRadius: number
  velocityThreshold: number
  reducedMotion: boolean
}

const defaultFlowConfig: FlowConfig = {
  maxOpacity: 0.35,
  dyeDissipation: 0.97,
  splatRadius: 0.02,
  velocityThreshold: 2,
  reducedMotion: false,
}

interface FBO {
  texture: WebGLTexture
  framebuffer: WebGLFramebuffer
  width: number
  height: number
}

// ─── Shader sources ─────────────────────────────────

const quadVert = /* glsl */ `#version 300 es
precision highp float;
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`

// Advection: moves dye/velocity along the velocity field
const advectFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uSource;
uniform float uDt;
uniform float uDissipation;
uniform vec2 uTexelSize;

void main() {
  vec2 vel = texture(uVelocity, vUv).xy;
  vec2 coord = vUv - vel * uDt * uTexelSize;
  fragColor = uDissipation * texture(uSource, coord);
}
`

// Divergence: computes velocity divergence
const divergenceFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

void main() {
  float l = texture(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).x;
  float r = texture(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).x;
  float b = texture(uVelocity, vUv - vec2(0.0, uTexelSize.y)).y;
  float t = texture(uVelocity, vUv + vec2(0.0, uTexelSize.y)).y;
  fragColor = vec4(0.5 * (r - l + t - b), 0.0, 0.0, 1.0);
}
`

// Pressure: Jacobi iteration to solve pressure from divergence
const pressureFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uPressure;
uniform sampler2D uDivergence;
uniform vec2 uTexelSize;

void main() {
  float l = texture(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
  float r = texture(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
  float b = texture(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
  float t = texture(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
  float div = texture(uDivergence, vUv).x;
  fragColor = vec4((l + r + b + t - div) * 0.25, 0.0, 0.0, 1.0);
}
`

// Gradient subtract: corrects velocity to be divergence-free
const gradientFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uPressure;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

void main() {
  float l = texture(uPressure, vUv - vec2(uTexelSize.x, 0.0)).x;
  float r = texture(uPressure, vUv + vec2(uTexelSize.x, 0.0)).x;
  float b = texture(uPressure, vUv - vec2(0.0, uTexelSize.y)).x;
  float t = texture(uPressure, vUv + vec2(0.0, uTexelSize.y)).x;
  vec2 vel = texture(uVelocity, vUv).xy;
  vel -= vec2(r - l, t - b) * 0.5;
  fragColor = vec4(vel, 0.0, 1.0);
}
`

// Splat: injects velocity/dye at mouse position
const splatFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTarget;
uniform vec2 uPoint;
uniform vec3 uColor;
uniform float uRadius;
uniform float uAspectRatio;

void main() {
  vec2 p = vUv - uPoint;
  p.x *= uAspectRatio;
  float d = dot(p, p);
  float splat = exp(-d / uRadius);
  vec3 base = texture(uTarget, vUv).xyz;
  fragColor = vec4(base + uColor * splat, 1.0);
}
`

// Vorticity: computes curl of velocity (for vorticity confinement)
const vorticityFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform vec2 uTexelSize;

void main() {
  float l = texture(uVelocity, vUv - vec2(uTexelSize.x, 0.0)).y;
  float r = texture(uVelocity, vUv + vec2(uTexelSize.x, 0.0)).y;
  float b = texture(uVelocity, vUv - vec2(0.0, uTexelSize.y)).x;
  float t = texture(uVelocity, vUv + vec2(0.0, uTexelSize.y)).x;
  fragColor = vec4((r - l) - (t - b), 0.0, 0.0, 1.0);
}
`

// Vorticity confinement: re-injects curl to counteract numerical dissipation
const vorticityForceFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uVelocity;
uniform sampler2D uVorticity;
uniform vec2 uTexelSize;
uniform float uCurl;
uniform float uDt;

void main() {
  float l = texture(uVorticity, vUv - vec2(uTexelSize.x, 0.0)).x;
  float r = texture(uVorticity, vUv + vec2(uTexelSize.x, 0.0)).x;
  float b = texture(uVorticity, vUv - vec2(0.0, uTexelSize.y)).x;
  float t = texture(uVorticity, vUv + vec2(0.0, uTexelSize.y)).x;
  float c = texture(uVorticity, vUv).x;
  vec2 force = vec2(abs(t) - abs(b), abs(r) - abs(l));
  float len = length(force) + 1e-5;
  force = force / len * c * uCurl;
  vec2 vel = texture(uVelocity, vUv).xy;
  fragColor = vec4(vel + force * uDt, 0.0, 1.0);
}
`

// Display: renders dye as blue flow with opacity cap
const displayFrag = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uDye;
uniform float uMaxOpacity;

void main() {
  vec3 dye = texture(uDye, vUv).rgb;
  float intensity = length(dye);

  // Blue palette: Electric Blue (#0047FF) -> Cyan (#00F5FF)
  vec3 blue = vec3(0.0, 0.28, 1.0);
  vec3 cyan = vec3(0.0, 0.96, 1.0);
  vec3 color = mix(blue, cyan, smoothstep(0.0, 1.5, intensity));

  // Opacity: proportional to intensity, capped at max
  float alpha = min(intensity * 0.6, uMaxOpacity);

  // Soft falloff at edges of flow
  alpha *= smoothstep(0.02, 0.1, intensity);

  fragColor = vec4(color * alpha, alpha);
}
`

// ─── Composable ─────────────────────────────────────

export function useGlassShader(config: Partial<FlowConfig> = {}) {
  const cfg = { ...defaultFlowConfig, ...config }

  let gl: WebGL2RenderingContext | null = null
  let canvas: HTMLCanvasElement | null = null
  let animationId = 0
  let running = false

  // GL resources
  let vao: WebGLVertexArrayObject | null = null
  let vertexBuffer: WebGLBuffer | null = null

  // Shader programs
  let advectProgram: WebGLProgram | null = null
  let divergenceProgram: WebGLProgram | null = null
  let pressureProgram: WebGLProgram | null = null
  let gradientProgram: WebGLProgram | null = null
  let splatProgram: WebGLProgram | null = null
  let vorticityProgram: WebGLProgram | null = null
  let vorticityForceProgram: WebGLProgram | null = null
  let displayProgram: WebGLProgram | null = null

  // FBOs
  const SIM_RES = 64
  const DYE_RES = 256
  let velFBO_A: FBO | null = null
  let velFBO_B: FBO | null = null
  let dyeFBO_A: FBO | null = null
  let dyeFBO_B: FBO | null = null
  let divFBO: FBO | null = null
  let pressureFBO_A: FBO | null = null
  let pressureFBO_B: FBO | null = null
  let vorticityFBO: FBO | null = null

  // For reading dye intensity back (readFlowIntensity)
  let dyeReadBuffer: Float32Array | null = null

  // Mouse state
  let mouseX = 0.5
  let mouseY = 0.5
  let mouseVX = 0
  let mouseVY = 0
  let prevMouseX = 0.5
  let prevMouseY = 0.5

  // Open progress (for controlling visibility)
  let openProgress = 0
  let openTarget = 0

  // ─── GL Helpers ──────────────────────────────────

  function compileShader(type: number, source: string): WebGLShader | null {
    const shader = gl!.createShader(type)
    if (!shader) return null
    gl!.shaderSource(shader, source)
    gl!.compileShader(shader)
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      console.error('[flow] Shader error:', gl!.getShaderInfoLog(shader))
      gl!.deleteShader(shader)
      return null
    }
    return shader
  }

  function createProgram(fragSource: string): WebGLProgram | null {
    const vs = compileShader(gl!.VERTEX_SHADER, quadVert)
    const fs = compileShader(gl!.FRAGMENT_SHADER, fragSource)
    if (!vs || !fs) return null
    const prog = gl!.createProgram()!
    gl!.attachShader(prog, vs)
    gl!.attachShader(prog, fs)
    gl!.bindAttribLocation(prog, 0, 'aPosition')
    gl!.linkProgram(prog)
    if (!gl!.getProgramParameter(prog, gl!.LINK_STATUS)) {
      console.error('[flow] Link error:', gl!.getProgramInfoLog(prog))
      gl!.deleteProgram(prog)
      return null
    }
    gl!.deleteShader(vs)
    gl!.deleteShader(fs)
    return prog
  }

  function createFBO(w: number, h: number, internalFormat: number, format: number, type: number): FBO | null {
    if (!gl) return null
    const texture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    const framebuffer = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    return { texture, framebuffer, width: w, height: h }
  }

  function bindFBO(fbo: FBO | null) {
    if (!gl) return
    if (fbo) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo.framebuffer)
      gl.viewport(0, 0, fbo.width, fbo.height)
    }
    else {
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    }
  }

  function drawQuad() {
    gl!.bindVertexArray(vao)
    gl!.drawArrays(gl!.TRIANGLES, 0, 6)
    gl!.bindVertexArray(null)
  }

  function uniform1i(prog: WebGLProgram, name: string, val: number) {
    gl!.uniform1i(gl!.getUniformLocation(prog, name), val)
  }

  function uniform1f(prog: WebGLProgram, name: string, val: number) {
    gl!.uniform1f(gl!.getUniformLocation(prog, name), val)
  }

  function uniform2f(prog: WebGLProgram, name: string, x: number, y: number) {
    gl!.uniform2f(gl!.getUniformLocation(prog, name), x, y)
  }

  function uniform3f(prog: WebGLProgram, name: string, x: number, y: number, z: number) {
    gl!.uniform3f(gl!.getUniformLocation(prog, name), x, y, z)
  }

  function bindTexture(unit: number, texture: WebGLTexture) {
    gl!.activeTexture(gl!.TEXTURE0 + unit)
    gl!.bindTexture(gl!.TEXTURE_2D, texture)
  }

  // ─── Simulation Step ─────────────────────────────

  function step(dt: number) {
    if (!gl || !velFBO_A || !velFBO_B || !dyeFBO_A || !dyeFBO_B) return

    const velTexelSize: [number, number] = [1.0 / SIM_RES, 1.0 / SIM_RES]
    const dyeTexelSize: [number, number] = [1.0 / DYE_RES, 1.0 / DYE_RES]

    // ── Vorticity computation ──
    gl.useProgram(vorticityProgram!)
    bindTexture(0, velFBO_A.texture)
    uniform1i(vorticityProgram!, 'uVelocity', 0)
    uniform2f(vorticityProgram!, 'uTexelSize', ...velTexelSize)
    bindFBO(vorticityFBO!)
    drawQuad()

    // ── Vorticity confinement ──
    gl.useProgram(vorticityForceProgram!)
    bindTexture(0, velFBO_A.texture)
    bindTexture(1, vorticityFBO!.texture)
    uniform1i(vorticityForceProgram!, 'uVelocity', 0)
    uniform1i(vorticityForceProgram!, 'uVorticity', 1)
    uniform2f(vorticityForceProgram!, 'uTexelSize', ...velTexelSize)
    uniform1f(vorticityForceProgram!, 'uCurl', 25.0) // Strong curl for wake patterns
    uniform1f(vorticityForceProgram!, 'uDt', dt)
    bindFBO(velFBO_B)
    drawQuad()
    // Swap velocity
    let temp = velFBO_A; velFBO_A = velFBO_B; velFBO_B = temp

    // ── Divergence ──
    gl.useProgram(divergenceProgram!)
    bindTexture(0, velFBO_A.texture)
    uniform1i(divergenceProgram!, 'uVelocity', 0)
    uniform2f(divergenceProgram!, 'uTexelSize', ...velTexelSize)
    bindFBO(divFBO!)
    drawQuad()

    // ── Pressure (10 Jacobi iterations) ──
    // Clear pressure
    bindFBO(pressureFBO_A!)
    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(pressureProgram!)
    uniform1i(pressureProgram!, 'uDivergence', 1)
    bindTexture(1, divFBO!.texture)
    uniform2f(pressureProgram!, 'uTexelSize', ...velTexelSize)
    for (let i = 0; i < 10; i++) {
      bindTexture(0, pressureFBO_A!.texture)
      uniform1i(pressureProgram!, 'uPressure', 0)
      bindFBO(pressureFBO_B!)
      drawQuad()
      temp = pressureFBO_A!; pressureFBO_A = pressureFBO_B; pressureFBO_B = temp
    }

    // ── Gradient subtract ──
    gl.useProgram(gradientProgram!)
    bindTexture(0, pressureFBO_A!.texture)
    bindTexture(1, velFBO_A.texture)
    uniform1i(gradientProgram!, 'uPressure', 0)
    uniform1i(gradientProgram!, 'uVelocity', 1)
    uniform2f(gradientProgram!, 'uTexelSize', ...velTexelSize)
    bindFBO(velFBO_B)
    drawQuad()
    temp = velFBO_A; velFBO_A = velFBO_B; velFBO_B = temp

    // ── Advect velocity ──
    gl.useProgram(advectProgram!)
    bindTexture(0, velFBO_A.texture)
    bindTexture(1, velFBO_A.texture)
    uniform1i(advectProgram!, 'uVelocity', 0)
    uniform1i(advectProgram!, 'uSource', 1)
    uniform1f(advectProgram!, 'uDt', dt)
    uniform1f(advectProgram!, 'uDissipation', 0.98)
    uniform2f(advectProgram!, 'uTexelSize', ...velTexelSize)
    bindFBO(velFBO_B)
    drawQuad()
    temp = velFBO_A; velFBO_A = velFBO_B; velFBO_B = temp

    // ── Advect dye ──
    bindTexture(0, velFBO_A.texture)
    bindTexture(1, dyeFBO_A.texture)
    uniform1i(advectProgram!, 'uVelocity', 0)
    uniform1i(advectProgram!, 'uSource', 1)
    uniform1f(advectProgram!, 'uDt', dt)
    uniform1f(advectProgram!, 'uDissipation', cfg.dyeDissipation)
    uniform2f(advectProgram!, 'uTexelSize', ...dyeTexelSize)
    bindFBO(dyeFBO_B)
    drawQuad()
    temp = dyeFBO_A; dyeFBO_A = dyeFBO_B; dyeFBO_B = temp
  }

  function splat(x: number, y: number, dx: number, dy: number) {
    if (!gl || !splatProgram || !velFBO_A || !velFBO_B || !dyeFBO_A || !dyeFBO_B) return

    const aspectRatio = canvas!.width / canvas!.height

    // Inject velocity
    gl.useProgram(splatProgram)
    bindTexture(0, velFBO_A.texture)
    uniform1i(splatProgram, 'uTarget', 0)
    uniform2f(splatProgram, 'uPoint', x, y)
    uniform3f(splatProgram, 'uColor', dx * 10.0, dy * 10.0, 0.0)
    uniform1f(splatProgram, 'uRadius', cfg.splatRadius * 0.5)
    uniform1f(splatProgram, 'uAspectRatio', aspectRatio)
    bindFBO(velFBO_B)
    drawQuad()
    const temp1 = velFBO_A; velFBO_A = velFBO_B; velFBO_B = temp1

    // Inject dye (blue only, intensity proportional to speed)
    const speed = Math.sqrt(dx * dx + dy * dy)
    const dyeIntensity = Math.min(speed * 8.0, 1.0)
    bindTexture(0, dyeFBO_A.texture)
    uniform1i(splatProgram, 'uTarget', 0)
    uniform2f(splatProgram, 'uPoint', x, y)
    uniform3f(splatProgram, 'uColor', dyeIntensity * 0.3, dyeIntensity * 0.6, dyeIntensity)
    uniform1f(splatProgram, 'uRadius', cfg.splatRadius)
    uniform1f(splatProgram, 'uAspectRatio', aspectRatio)
    bindFBO(dyeFBO_B)
    drawQuad()
    const temp2 = dyeFBO_A; dyeFBO_A = dyeFBO_B; dyeFBO_B = temp2
  }

  // ─── Render Loop ─────────────────────────────────

  function render() {
    if (!gl || !canvas) return

    handleResize()

    // Smooth open progress
    openProgress += (openTarget - openProgress) * 0.08

    // Only simulate when menu is opening/open
    if (openProgress > 0.01 && !cfg.reducedMotion) {
      const dt = 1.0 / 60.0

      // Inject mouse splat if moving fast enough
      const dx = mouseX - prevMouseX
      const dy = mouseY - prevMouseY
      const speed = Math.sqrt(dx * dx + dy * dy) * canvas.width
      if (speed > cfg.velocityThreshold) {
        splat(mouseX, mouseY, dx, dy)
      }
      prevMouseX = mouseX
      prevMouseY = mouseY

      step(dt)
    }

    // ── Display: render dye to screen ──
    bindFBO(null)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    if (dyeFBO_A && displayProgram && openProgress > 0.01) {
      gl.useProgram(displayProgram)
      bindTexture(0, dyeFBO_A.texture)
      uniform1i(displayProgram, 'uDye', 0)
      uniform1f(displayProgram, 'uMaxOpacity', cfg.maxOpacity * openProgress)
      drawQuad()
    }

    if (running) animationId = requestAnimationFrame(render)
  }

  function handleResize() {
    if (!canvas || !gl) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const width = Math.floor(canvas.clientWidth * dpr)
    const height = Math.floor(canvas.clientHeight * dpr)
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
    }
  }

  // ─── Read flow intensity at a point (for displacement coupling) ──

  function getFlowIntensity(): number {
    if (!gl || !dyeFBO_A) return 0
    // Read center pixel of dye texture (rough average)
    if (!dyeReadBuffer) dyeReadBuffer = new Float32Array(4)
    gl.bindFramebuffer(gl.FRAMEBUFFER, dyeFBO_A.framebuffer)
    // Sample at mouse position
    const px = Math.floor(mouseX * dyeFBO_A.width)
    const py = Math.floor(mouseY * dyeFBO_A.height)
    gl.readPixels(px, py, 1, 1, gl.RGBA, gl.FLOAT, dyeReadBuffer)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    return Math.min(Math.sqrt(
      dyeReadBuffer[0] * dyeReadBuffer[0]
      + dyeReadBuffer[1] * dyeReadBuffer[1]
      + dyeReadBuffer[2] * dyeReadBuffer[2],
    ), 1.0)
  }

  // ─── Public API ──────────────────────────────────

  function init(canvasEl: HTMLCanvasElement): boolean {
    canvas = canvasEl
    gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    }) as WebGL2RenderingContext | null

    if (!gl) {
      console.warn('[flow] WebGL2 not supported')
      return false
    }

    // Check for float texture support
    const ext = gl.getExtension('EXT_color_buffer_float')
    if (!ext) {
      console.warn('[flow] EXT_color_buffer_float not supported')
      return false
    }

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    // Compile all shader programs
    advectProgram = createProgram(advectFrag)
    divergenceProgram = createProgram(divergenceFrag)
    pressureProgram = createProgram(pressureFrag)
    gradientProgram = createProgram(gradientFrag)
    splatProgram = createProgram(splatFrag)
    vorticityProgram = createProgram(vorticityFrag)
    vorticityForceProgram = createProgram(vorticityForceFrag)
    displayProgram = createProgram(displayFrag)

    if (!advectProgram || !divergenceProgram || !pressureProgram
      || !gradientProgram || !splatProgram || !displayProgram
      || !vorticityProgram || !vorticityForceProgram) {
      console.error('[flow] Failed to compile one or more shaders')
      return false
    }

    // Create quad VAO
    vao = gl.createVertexArray()
    gl.bindVertexArray(vao)
    vertexBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW)
    gl.enableVertexAttribArray(0)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.bindVertexArray(null)

    handleResize()

    // Create FBOs
    velFBO_A = createFBO(SIM_RES, SIM_RES, gl.RG16F, gl.RG, gl.HALF_FLOAT)
    velFBO_B = createFBO(SIM_RES, SIM_RES, gl.RG16F, gl.RG, gl.HALF_FLOAT)
    dyeFBO_A = createFBO(DYE_RES, DYE_RES, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT)
    dyeFBO_B = createFBO(DYE_RES, DYE_RES, gl.RGBA16F, gl.RGBA, gl.HALF_FLOAT)
    divFBO = createFBO(SIM_RES, SIM_RES, gl.R16F, gl.RED, gl.HALF_FLOAT)
    pressureFBO_A = createFBO(SIM_RES, SIM_RES, gl.R16F, gl.RED, gl.HALF_FLOAT)
    pressureFBO_B = createFBO(SIM_RES, SIM_RES, gl.R16F, gl.RED, gl.HALF_FLOAT)
    vorticityFBO = createFBO(SIM_RES, SIM_RES, gl.R16F, gl.RED, gl.HALF_FLOAT)

    return true
  }

  function start() {
    if (!gl || running) return
    running = true
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

  function setOpenProgress(target: number) {
    openTarget = target
  }

  function destroy() {
    stop()
    if (gl) {
      const fbos = [velFBO_A, velFBO_B, dyeFBO_A, dyeFBO_B, divFBO, pressureFBO_A, pressureFBO_B, vorticityFBO]
      for (const fbo of fbos) {
        if (fbo) {
          gl.deleteTexture(fbo.texture)
          gl.deleteFramebuffer(fbo.framebuffer)
        }
      }
      const programs = [advectProgram, divergenceProgram, pressureProgram, gradientProgram, splatProgram, vorticityProgram, vorticityForceProgram, displayProgram]
      for (const prog of programs) {
        if (prog) gl.deleteProgram(prog)
      }
      if (vao) gl.deleteVertexArray(vao)
      if (vertexBuffer) gl.deleteBuffer(vertexBuffer)
    }
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
    getFlowIntensity,
  }
}
```

**Step 2: Verify the file compiles**

Run: `pnpm typecheck`
Expected: No errors in `useGlassShader.ts`

**Step 3: Commit**

```bash
git add app/composables/useGlassShader.ts
git commit -m "feat: rewrite useGlassShader as flow-field-only Navier-Stokes"
```

---

### Task 3: Create useLiquidGlass.ts — SVG Filter Management

**Files:**
- Create: `app/composables/useLiquidGlass.ts`

**Step 1: Create the composable**

This composable manages the coupling between the WebGL flow field and the SVG filter displacement scale. It reads the flow intensity from the flow field composable and computes the appropriate displacement scale.

```typescript
/**
 * useLiquidGlass — manages SVG filter displacement coupling with WebGL flow field.
 * Reads flow intensity from useGlassShader and computes displacement scale.
 */

interface LiquidGlassState {
  displacementScale: Ref<number>
  flowIntensity: Ref<number>
  startCoupling: (getIntensity: () => number) => void
  stopCoupling: () => void
}

export function useLiquidGlass(): LiquidGlassState {
  const BASE_SCALE = 77
  const MAX_SCALE = 180
  const LERP_SPEED = 0.06

  const displacementScale = ref(BASE_SCALE)
  const flowIntensity = ref(0)

  let rafId = 0
  let running = false
  let getIntensityFn: (() => number) | null = null

  function update() {
    if (!running) return

    // Read current flow intensity
    const intensity = getIntensityFn ? getIntensityFn() : 0
    flowIntensity.value = intensity

    // Compute target displacement scale (77 → 180 based on blue flow)
    const targetScale = BASE_SCALE + (MAX_SCALE - BASE_SCALE) * Math.min(intensity * 2.0, 1.0)

    // Smooth lerp toward target
    displacementScale.value += (targetScale - displacementScale.value) * LERP_SPEED

    rafId = requestAnimationFrame(update)
  }

  function startCoupling(getIntensity: () => number) {
    getIntensityFn = getIntensity
    running = true
    rafId = requestAnimationFrame(update)
  }

  function stopCoupling() {
    running = false
    cancelAnimationFrame(rafId)
    // Reset to base
    displacementScale.value = BASE_SCALE
    flowIntensity.value = 0
  }

  onUnmounted(() => {
    stopCoupling()
  })

  return {
    displacementScale,
    flowIntensity,
    startCoupling,
    stopCoupling,
  }
}
```

**Step 2: Verify compilation**

Run: `pnpm typecheck`

**Step 3: Commit**

```bash
git add app/composables/useLiquidGlass.ts
git commit -m "feat: useLiquidGlass composable for SVG-WebGL displacement coupling"
```

---

### Task 4: Update AppNavigation.vue — Template + Script

**Files:**
- Modify: `app/components/global/AppNavigation.vue`

**Step 1: Update the script setup**

Replace the glass shader integration with the new hybrid architecture. Key changes:
- Import `useLiquidGlass` for SVG displacement coupling
- Keep `useGlassShader` but it's now flow-field-only
- Add flow canvas ref (separate from glass body)
- Connect the coupling on menu open/close

Replace lines 1-87 of AppNavigation.vue with:

```vue
<script setup lang="ts">
import { profile } from '~/constants/profile'

const { scrollTo } = useSmoothScroll()

const logoSrc = '/assets/images/logo/logo-bm-white-origin.svg'

const isScrolled = ref(false)
const isHidden = ref(false)
const isMenuOpen = ref(false)
let lastScrollY = 0

// Flow field (WebGL blue liquid)
const flowCanvasRef = ref<HTMLCanvasElement | null>(null)
const hasWebGL = ref(true)

const flowShader = useGlassShader({
  reducedMotion: typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false,
})

// SVG filter displacement coupling
const { displacementScale, startCoupling, stopCoupling } = useLiquidGlass()

// Mouse state
let mouseTarget = { x: 0.5, y: 0.5 }

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

function handleNavClick(href: string) {
  isMenuOpen.value = false
  setTimeout(() => scrollTo(href, { offset: -80 }), 400)
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function handlePanelMove(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height
  const dx = x - mouseTarget.x
  const dy = y - mouseTarget.y
  mouseTarget.x = x
  mouseTarget.y = y
  flowShader.setMouse(x, y, dx, dy)
}

onMounted(() => {
  if (flowCanvasRef.value) {
    hasWebGL.value = flowShader.init(flowCanvasRef.value)
  }

  function onScroll() {
    const currentY = window.scrollY
    isScrolled.value = currentY > 50
    isHidden.value = currentY > lastScrollY && currentY > 300
    lastScrollY = currentY
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    flowShader.destroy()
  })
})

watch(isMenuOpen, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
  document.body.style.overflow = open ? 'hidden' : ''
  document.documentElement.classList.toggle('menu-open', open)

  if (open) {
    mouseTarget = { x: 0.5, y: 0.5 }
    if (hasWebGL.value) {
      flowShader.setOpenProgress(1)
      flowShader.resize()
      flowShader.start()
      // Start SVG-WebGL displacement coupling
      startCoupling(() => flowShader.getFlowIntensity())
    }
  }
  else {
    flowShader.setOpenProgress(0)
    flowShader.stop()
    stopCoupling()
  }
})
</script>
```

**Step 2: Update the template**

Replace the template (lines 89-191) with the new glass architecture:

```vue
<template>
  <header
    class="nav"
    :class="{
      'nav--scrolled': isScrolled && !isMenuOpen,
      'nav--hidden': isHidden && !isMenuOpen,
      'nav--open': isMenuOpen,
    }"
  >
    <nav class="nav__bar page-margin" aria-label="Main navigation">
      <a
        href="#"
        class="nav__logo"
        aria-label="Billy Maulana — Home"
        @click.prevent="() => { isMenuOpen = false; scrollTo(0) }"
      >
        <img
          :src="logoSrc"
          alt="BM"
          class="nav__logo-img"
        >
      </a>

      <button
        class="nav__trigger"
        :class="{ 'nav__trigger--open': isMenuOpen }"
        :aria-expanded="isMenuOpen"
        aria-label="Toggle menu"
        @click="toggleMenu"
      >
        <span class="nav__trigger-box">
          <span class="nav__trigger-bar" />
          <span class="nav__trigger-bar" />
          <span class="nav__trigger-bar" />
        </span>
      </button>
    </nav>

    <!-- Overlay: backdrop + side panel -->
    <Transition name="menu" :duration="{ enter: 1100, leave: 850 }">
      <div v-if="isMenuOpen" class="nav__overlay">
        <div class="nav__backdrop" @click="toggleMenu" />
        <div class="nav__panel" @pointermove="handlePanelMove">
          <!-- SVG Filter Definitions -->
          <UiLiquidGlassFilter :displacement-scale="displacementScale" />

          <!-- Glass body: SVG filter + noise grain -->
          <div class="nav__glass-body" />

          <!-- WebGL Blue Flow Canvas (overlay, pointer-events: none) -->
          <canvas
            v-if="hasWebGL"
            ref="flowCanvasRef"
            class="nav__flow-canvas"
          />

          <!-- Content (z-index 2, above glass) -->
          <div class="nav__panel-inner">
            <ul class="nav__menu" role="list">
              <li
                v-for="(item, i) in navItems"
                :key="item.href"
                class="nav__menu-item"
                :style="{ '--delay': `${0.2 + i * 0.1}s` }"
              >
                <a
                  :href="item.href"
                  class="nav__menu-link nav__chromatic-text"
                  @click.prevent="handleNavClick(item.href)"
                >
                  <span class="nav__menu-index">{{ String(i + 1).padStart(2, '0') }}</span>
                  <span class="nav__menu-word">
                    <span
                      v-for="(char, ci) in item.label.split('')"
                      :key="ci"
                      class="nav__menu-char"
                      :style="{ '--ci': ci }"
                    >
                      <span class="nav__menu-char-inner">
                        <span class="nav__menu-char-face">{{ char }}</span>
                        <span class="nav__menu-char-face nav__menu-char-face--alt">{{ char }}</span>
                      </span>
                    </span>
                  </span>
                </a>
                <span class="nav__menu-divider" :style="{ '--delay': `${0.2 + i * 0.1}s` }" />
              </li>
            </ul>

            <div class="nav__panel-footer">
              <div class="nav__footer-col">
                <span class="nav__footer-label">Get in touch</span>
                <a :href="`mailto:${profile.email}`" class="nav__footer-link nav__chromatic-text">{{ profile.email }}</a>
              </div>
              <div class="nav__footer-col">
                <span class="nav__footer-label">Social</span>
                <div class="nav__footer-socials">
                  <a :href="profile.github" target="_blank" rel="noopener" class="nav__footer-link nav__chromatic-text">GitHub</a>
                  <a :href="profile.linkedin" target="_blank" rel="noopener" class="nav__footer-link nav__chromatic-text">LinkedIn</a>
                  <a :href="profile.instagram" target="_blank" rel="noopener" class="nav__footer-link nav__chromatic-text">Instagram</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>
```

**Step 3: Commit template + script changes**

```bash
git add app/components/global/AppNavigation.vue
git commit -m "feat: update AppNavigation with hybrid SVG+WebGL glass architecture"
```

---

### Task 5: Update AppNavigation.vue CSS — Glass Body + Flow Canvas

**Files:**
- Modify: `app/components/global/AppNavigation.vue` (style section)

**Step 1: Replace the glass canvas CSS with new glass body + flow canvas styles**

In the `<style scoped>` section, replace `.nav__glass-canvas` and `.nav__glass-body` blocks (around lines 380-399) with:

```css
/* ─── Glass Body: SVG filter + organic border ─── */
.nav__glass-body {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  /* Apple-style liquid glass: SVG filter for refraction + minimal blur */
  backdrop-filter: url(#liquid-glass) blur(1px) saturate(1.2);
  -webkit-backdrop-filter: url(#liquid-glass) blur(1px) saturate(1.2);
  /* Near-clear glass: very subtle white tint */
  background: rgba(255, 255, 255, 0.04);
  /* Organic border: animated conic gradient shimmer */
  border: 1px solid rgba(255, 255, 255, 0.12);
  /* Inner glow */
  box-shadow:
    inset 0 0 20px -5px rgba(255, 255, 255, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  overflow: hidden;
}

/* Noise/grain texture overlay */
.nav__glass-body::before {
  content: '';
  position: absolute;
  inset: -50%;
  z-index: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.04;
  mix-blend-mode: overlay;
  pointer-events: none;
  animation: grainShimmer 30s linear infinite;
}

@keyframes grainShimmer {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-2px, 1px); }
  50% { transform: translate(1px, -2px); }
  75% { transform: translate(-1px, -1px); }
  100% { transform: translate(0, 0); }
}

/* Organic border glow (animated conic gradient) */
.nav__glass-body::after {
  content: '';
  position: absolute;
  inset: -1px;
  z-index: -1;
  border-radius: inherit;
  background: conic-gradient(
    from var(--border-angle, 0deg),
    rgba(255, 255, 255, 0.4),
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.25),
    rgba(255, 255, 255, 0.05),
    rgba(255, 255, 255, 0.4)
  );
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  padding: 1px;
  animation: borderRotate 20s linear infinite;
}

@keyframes borderRotate {
  to { --border-angle: 360deg; }
}

/* ─── Flow Canvas (WebGL blue liquid overlay) ─── */
.nav__flow-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mix-blend-mode: screen;
  border-radius: inherit;
}
```

**Step 2: Add the @property rule for border-angle animation**

Add this at the TOP of the `<style scoped>` block (before any rules):

```css
@property --border-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
```

**Step 3: Add chromatic text styles**

Add these CSS rules to the style section:

```css
/* ─── Chromatic text effect (RGB split) ─── */
.nav__chromatic-text {
  text-shadow:
    -1px 0 0 rgba(255, 0, 0, 0.12),
    1px 0 0 rgba(0, 100, 255, 0.12),
    0 0 4px rgba(255, 255, 255, 0.08);
  -webkit-text-stroke: 0.3px rgba(255, 255, 255, 0.2);
  transition: text-shadow 0.4s var(--ease-out-expo);
}

.nav__chromatic-text:hover {
  text-shadow:
    -3px 0 0 rgba(255, 0, 0, 0.18),
    3px 0 0 rgba(0, 100, 255, 0.18),
    0 0 8px rgba(255, 255, 255, 0.12);
}
```

**Step 4: Update reduced-motion styles**

Add to the `@media (prefers-reduced-motion: reduce)` block:

```css
.nav__glass-body::before {
  animation: none;
}

.nav__glass-body::after {
  animation: none;
}

.nav__chromatic-text {
  text-shadow: none;
  -webkit-text-stroke: none;
}
```

**Step 5: Commit CSS changes**

```bash
git add app/components/global/AppNavigation.vue
git commit -m "feat: glass body SVG filter styles, flow canvas, chromatic text, noise grain"
```

---

### Task 6: Register @property and Verify Build

**Files:**
- Modify: `app/assets/css/main.css` (add @property if needed for global scope)

**Step 1: Check if @property works in scoped style**

`@property` may not work in `<style scoped>` due to Vite's scoping. If it doesn't animate, move the `@property` declaration to `app/assets/css/main.css`:

```css
@property --border-angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
```

**Step 2: Run production build**

Run: `pnpm build`
Expected: Build succeeds with zero errors.

**Step 3: Run dev server and test**

Run: `pnpm dev`

Manual verification checklist:
- [ ] Menu opens with SVG filter distortion visible at edges
- [ ] Center of glass is near-clear (can see page behind)
- [ ] Moving mouse creates blue flow rivulets
- [ ] Blue never exceeds ~35% opacity
- [ ] Blue flow creates stronger displacement where it touches
- [ ] Text has subtle chromatic aberration (RGB split)
- [ ] Text chromatic widens on hover
- [ ] Organic border shimmers with conic gradient rotation
- [ ] Fine noise grain visible on glass surface
- [ ] Menu closes cleanly
- [ ] Reduced motion: no animations, static glass

**Step 4: Fix any issues found during testing**

Address any visual or functional issues.

**Step 5: Commit verified build**

```bash
git add -A
git commit -m "feat: liquid glass menu revamp — hybrid SVG filter + WebGL flow field"
```

---

### Task 7: Polish and Edge Cases

**Files:**
- Modify: `app/components/global/AppNavigation.vue`
- Modify: `app/composables/useGlassShader.ts`

**Step 1: Handle SVG filter fallback**

If the browser doesn't support SVG filters in `backdrop-filter`, the glass body should fall back to a simple `backdrop-filter: blur(18px)`. Add this check:

In the script, add:
```typescript
// Check SVG filter support in backdrop-filter
const supportsSvgFilter = ref(true)
onMounted(() => {
  // Test if backdrop-filter: url(#test) works
  const testEl = document.createElement('div')
  testEl.style.backdropFilter = 'url(#nonexistent)'
  supportsSvgFilter.value = testEl.style.backdropFilter !== ''
})
```

Add a conditional class to the glass body:
```vue
<div
  class="nav__glass-body"
  :class="{ 'nav__glass-body--fallback': !supportsSvgFilter }"
/>
```

Add fallback CSS:
```css
.nav__glass-body--fallback {
  backdrop-filter: blur(18px) saturate(1.3);
  -webkit-backdrop-filter: blur(18px) saturate(1.3);
  background: rgba(255, 255, 255, 0.08);
}
```

**Step 2: Desktop panel organic border radius**

Ensure the desktop panel border-radius is inherited by the glass body:

```css
@media (min-width: 1024px) {
  .nav__panel {
    border-radius: 28px 0 0 28px;
    overflow: hidden;
  }
}
```

**Step 3: Commit polish**

```bash
git add app/components/global/AppNavigation.vue app/composables/useGlassShader.ts
git commit -m "fix: SVG filter fallback, desktop border radius, edge cases"
```

---

### Task 8: Final Production Build Verification

**Step 1: Run linting**

Run: `pnpm lint:fix`

**Step 2: Run typecheck**

Run: `pnpm typecheck`

**Step 3: Run production build**

Run: `pnpm build`
Expected: Build succeeds, zero errors.

**Step 4: Preview production build**

Run: `pnpm preview`
Open browser, test menu interaction.

**Step 5: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: lint and build verification for liquid glass revamp"
```
