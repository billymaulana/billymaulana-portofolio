# Liquid Glass Navigation — Design Document

**Date**: 2026-02-19
**Status**: Approved
**Branch**: experimental/landing-1

## Summary

Revamp the navigation menu's glass effect from CSS/SVG-based glassmorphism to a full WebGL liquid glass shader. The nav panel will feature true Snell's law refraction, organic breathing edges, chromatic aberration, mouse-interactive refraction lens with displacement wake, condensation droplets, caustic light patterns, and surface tension effects.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Glass tone | Hybrid: white body + clear refraction zones | Readable text on white base; edges reveal refracted background |
| Panel edges | Organic wave edges (fBm noise on SDF) | Fluid, breathing border like water surface tension |
| Mouse interaction | Refraction lens + displacement wake | Full liquid behavior — lens reveals background, wake leaves ripples |
| Technical approach | Full WebGL glass shader (Approach A) | Self-contained, performant, all effects in one shader pass |
| Background | Synthesized gradient (not page capture) | Clean, no html2canvas latency; matches dark theme colors |
| Fallback | CSS/SVG glass layers (existing code) | For browsers without WebGL2 |

## Architecture

### Layer Stack

```
z-index 2: nav__panel-inner (HTML menu content — text, links, footer)
z-index 1: <canvas>           (WebGL glass shader — renders all glass effects)
```

Replaces the existing 4 CSS glass layers + SVG filter definitions entirely.

### New Composable: `useGlassShader`

```typescript
useGlassShader(canvasRef: Ref<HTMLCanvasElement | null>, options: {
  resolution: Ref<{ width: number; height: number }>
  mouse: Ref<{ x: number; y: number }>
  mouseVelocity: Ref<number>
  openProgress: Ref<number>
  isDesktop: Ref<boolean>
})
```

- Creates WebGL2 context
- Compiles vertex + fragment shader
- Manages 2 framebuffer objects (ping-pong for displacement wake)
- Runs render loop (requestAnimationFrame) while menu is open
- Stops render loop on close (battery saver)
- Cleans up on unmount

### Component Changes to `AppNavigation.vue`

- Remove: `nav__glass-body`, `nav__glass-refract`, `nav__glass-lens`, `nav__glass-surface` layers
- Remove: SVG `<defs>` filters (glass-distort, glass-lens, glass-gooey, glass-chromatic, glass-noise)
- Add: `<canvas ref="glassCanvasRef" class="nav__glass-canvas">` inside `nav__panel`
- Keep: `nav__panel-inner` (content overlay), transition system, menu logic, mouse tracking

## Shader Pipeline

### Fragment Shader (single pass + 2 FBO passes for wake)

```
Step 1: SDF Shape
├── Rounded rectangle SDF
├── fBm noise perturbation on edges (3 octaves, freq 0.008)
├── Wave amplitude: ±8-14px
├── Animation: 0.3x time multiplier (slow breathing)
└── Output: dist-to-edge, surface normal

Step 2: Glass Body
├── Base tint: rgba(255,255,255, 0.08-0.12) inside SDF
├── Edge opacity fade: transparent near SDF boundary
├── Caustic streaks: diagonal sin() light bands (opacity 0.03-0.06)
└── Caustic light pattern: layered sin() waves (pool-light effect)

Step 2b: Surface Tension Meniscus
├── 2-4px bright line at SDF boundary
├── Color: rgba(255,255,255, 0.15-0.25)
└── Animated with same fBm as edge wave

Step 3: Refraction / Displacement
├── Snell's law: n1*sin(θ1) = n2*sin(θ2), IOR ≈ 1.45
├── Surface normal from SDF gradient → refraction vector
├── Displace UV to sample synthesized background
└── Background: dark base + blue/cyan/purple gradients

Step 4: Chromatic Aberration
├── 3 refraction passes: R(IOR 1.42), G(IOR 1.45), B(IOR 1.48)
├── Strongest at SDF edges (high surface curvature)
└── Result: iridescent blue→purple→pink→cyan fringing

Step 5: Mouse Refraction Lens
├── Radius: ~160px (desktop), ~120px (mobile)
├── Clear zone: inner 40% = higher transparency
├── Refraction boost: 1.5x inside lens
├── Chromatic boost: 2x at lens boundary
└── Smooth falloff: smoothstep center→edge

Step 6: Displacement Wake (via ping-pong FBOs)
├── Read previous ripple state texture
├── Add ripple at mouse position (if moved)
├── Wave equation: propagation + damping
├── Write to alternate FBO
├── Ripple rings emanate from fast mouse movements
└── Ripples reflect off SDF boundary

Step 7: Specular Highlights
├── Fresnel effect: brighter at glancing angles
├── Top rim: bright white specular line
├── Mouse-following highlight hotspot
└── Shimmer: slow sin(time) light band

Step 8: Noise Grain
├── Hash-based noise (no texture)
├── Opacity: ~0.04
└── Glass surface micro-texture

Step 8b: Condensation Droplets
├── 8-12 small SDF circles near edges
├── Size: 4-16px radius (varying)
├── Position: clustered on left edge + bottom edge
├── Drift: ~0.3px/s downward (gravity)
├── Mouse: scatter within 100px, resettle 2s ease-out
└── Each droplet has own mini-refraction

Step 9: Compositing
├── Blend all layers
├── SDF alpha mask (organic edge shape)
└── Output: gl_FragColor
```

### Uniforms

```glsl
uniform vec2  uResolution;     // Canvas size in pixels
uniform float uTime;           // Animation clock (seconds)
uniform vec2  uMouse;          // Normalized mouse pos (0-1)
uniform vec2  uMouseVelocity;  // Mouse velocity vector
uniform float uOpenProgress;   // 0→1 menu open animation
uniform float uScrollY;        // Page scroll (for parallax)
uniform bool  uIsDesktop;      // Desktop vs mobile mode
```

## Visual Design

### Colors

| Element | Value |
|---------|-------|
| Base background | #0A0A0A (dark theme) |
| Glass tint | rgba(255,255,255, 0.08-0.12) |
| Chromatic R | Warm edge (IOR 1.42) |
| Chromatic G | Neutral (IOR 1.45) |
| Chromatic B | Cool edge (IOR 1.48) |
| Edge refraction | #0047FF → #00F5FF → #4400FF |
| Caustic streaks | rgba(255,255,255, 0.03-0.06) |
| Surface tension | rgba(255,255,255, 0.15-0.25) |
| Specular rim | rgba(255,255,255, 0.20-0.30) |

### Animation Timing

| Event | Duration | Detail |
|-------|----------|--------|
| Menu open | 600ms | Canvas fades in, SDF grows from center |
| Caustics start | +200ms delay, 400ms fade | After open completes |
| Droplets appear | +400ms staggered | Fade in individually |
| Menu close | 500ms | Glass shrinks + fades |
| Render loop | Start on open, stop on close | Battery optimization |
| Wake ripple decay | ~1.5s | After mouse stops |
| Droplet resettle | 2s ease-out | After mouse moves away |

## Responsive Behavior

### Desktop (>1024px)

- Panel: right-side slide-in, 30vw (360-480px)
- Canvas fills panel area
- SDF: rounded rectangle with organic LEFT edge only
- Mouse interaction: full lens + wake
- Chromatic: strongest on left edge (glass rim)
- Droplets: 8-12 count

### Mobile (<1024px)

- Panel: full-screen with clip-path circle expand
- Canvas: full viewport
- SDF: circle expanding → full-screen with organic edges on all 4 sides
- Touch interaction: touchmove → lens + wake
- Chromatic: all edges
- Droplets: reduced to 5 (performance)
- Caustics: simplified (fewer sin() layers)

## Fallback & Accessibility

### No WebGL2

- Check `canvas.getContext('webgl2')` on mount
- If null: skip canvas, show existing CSS glass layers as fallback
- Existing CSS code preserved in component (conditionally rendered)

### Reduced Motion (`prefers-reduced-motion: reduce`)

- Disable: caustics animation, wake ripples, droplet drift, shimmer
- Keep: static glass body with minimal refraction
- Mouse lens: still works but without animation
- Organic edges: static (no breathing)

## Performance Budget

| Metric | Target |
|--------|--------|
| Draw calls/frame | 3 (main pass + 2 FBO passes) |
| Shader complexity | ~200-250 lines GLSL |
| FBO size | Half resolution (panel_width/2 x panel_height/2) |
| Target FPS | 60fps on mid-range GPU |
| Memory | ~2MB (2 FBO textures + shader) |

## Files to Create/Modify

| File | Action |
|------|--------|
| `app/composables/useGlassShader.ts` | Create — WebGL composable |
| `app/components/global/AppNavigation.vue` | Modify — replace CSS layers with canvas |

## References

- [Mikhail Bespalov — Liquid Glass](https://codepen.io/Mikhail-Bespalov/pen/MYwrMNy) — transparent refraction
- [Cubiq — Liquid Glass](https://codepen.io/thecubiq/pen/ZYbQmZN) — organic blob borders
- [Den — Apple Liquid Glass Switcher](https://codepen.io/DenDionigi/pen/JodwNzX) — clean Apple aesthetic
- [CJ Gammon — Liquid Glass WebGPU](https://codepen.io/cjgammon/pen/xbGYdbQ) — chromatic iridescent edges
- [Florian Woelki — WWDC25](https://codepen.io/FlorianWoelki/pen/VYLyOLZ) — text distortion through glass
- [Roel — Liquid Glass](https://codepen.io/roealvarado/pen/ByzYjgP) — noise distortion + organic wave
- [kube.io — Liquid Glass CSS/SVG](https://kube.io/blog/liquid-glass-css-svg/) — Snell's law + displacement maps
- [specy.app — Liquid Glass Web](https://specy.app/blog/posts/liquid-glass-in-the-web) — Three.js approach
