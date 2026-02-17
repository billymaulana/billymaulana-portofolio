# Hero "Liquid Prism" — Design Document

## Scope
Hero section MVP for Billy Maulana's portfolio. One section, Awwwards-level.

## Design Decisions

### Approach: WebGL Fluid Simulation
Full-screen WebGL canvas with GPU-accelerated fluid dynamics (Navier-Stokes).
Mouse interaction creates liquid ink/chroma splats.

### Color Palette
- Background: `#000000` (deep black)
- Fluid primary: `#0047FF` → `#00A3FF` (electric blue gradient)
- Fluid secondary: `#00F5FF` (cyan accent)
- Fluid tertiary: `#4400FF` (deep purple, subtle)
- Text: `#FFFFFF` primary, `#888888` secondary

### Typography
- "BILLY MAULANA": Satoshi Black (900), `clamp(4rem, 12vw, 14rem)`
- Chromatic aberration via CSS text-shadow (red/blue split, mouse-reactive)
- Subtitle: Satoshi Medium (500), small caps, wide tracking

### Layout
Full viewport hero. Text left-aligned with page margin. Fluid canvas behind.

### Entrance Animation (2.5s total)
1. Fluid canvas fade-in + center splat (0.3s)
2. "BILLY" letters stagger up (0.8s)
3. "MAULANA" letters stagger up (1.2s)
4. Chromatic aberration pulse (1.6s)
5. Subtitle fade-in (2.0s)
6. Scroll indicator + mouse activation (2.5s)

### Fluid Simulation Tech
- Jos Stam "Stable Fluids" algorithm
- Fragment shaders: advection, divergence, pressure, gradient subtraction, splat
- Framebuffer ping-pong
- Half-resolution canvas for performance
- Splat colors cycle blue-cyan-purple spectrum

### Responsive
- Desktop: Full WebGL fluid
- Tablet: Maintained with reduced resolution
- Mobile: Simplified ambient CSS gradient OR Canvas 2D fallback
- `prefers-reduced-motion`: Static gradient, no animation

### File Structure
```
app/
  components/
    SectionHero.vue           — Layout, text, GSAP entrance
    UiFluidCanvas.vue         — WebGL fluid component
  composables/
    useFluidSimulation.ts     — Shader compilation, sim loop, mouse
  assets/css/
    main.css                  — Design tokens, hero styles
```

### Performance
- Canvas at 50% viewport resolution, CSS-scaled
- RAF loop with frame skipping
- Lazy init after preloader
- ~4KB gzipped shader code
