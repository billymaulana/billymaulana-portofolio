# Liquid Glass Menu Revamp — Design Document

**Date:** 2026-02-20
**Branch:** experimental/landing-1
**Status:** Approved

## Overview

Complete replacement of the current WebGL-only glass shader (`useGlassShader.ts`) with a hybrid SVG Filter + WebGL architecture. The goal is authentic Apple-style liquid glass with mouse-driven blue flow field interaction, edge-concentrated refraction, chromatic aberration, and organic borders.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Hybrid SVG Filter + WebGL | SVG for glass body (DOM-native, GPU-accelerated), WebGL for blue flow field only |
| Replace vs enhance | Full replacement | Current WebGL shader is too coupled; starting fresh allows cleaner separation |
| Blue interaction | Continuous flow field | Navier-Stokes fluid sim responds to mouse velocity/direction, stays in rivulets |
| Glass transparency | Near-clear, edge refraction | Center almost fully transparent, strong refraction at edges only (Apple-style) |
| Text treatment | Chromatic aberration effect | RGB split text-shadow, text feels embedded IN the glass |
| Blue intensity | Controlled, never floods | Max 35% opacity, fast dissipation, exclusion zones around text |
| Displacement coupling | Dramatic bending | Where blue touches glass, displacement scale jumps from 77 to 180 (2.3x) |
| Surface texture | Procedural noise/grain | 4% opacity overlay with slow shimmer animation |

## Architecture

### Glass Body — SVG Filter Stack

Multi-stage SVG filter applied via `backdrop-filter: url(#liquid-glass)`:

```
Input (page behind menu)
  |
  v
1. feTurbulence (fractalNoise, baseFreq 0.006, 3 octaves)
   -> organic noise texture
  |
  v
2. feGaussianBlur (stdDeviation 1.5) on noise
   -> smoothed displacement source
  |
  v
3. Custom displacement image (generated SVG)
   -> edge-concentrated gradient (red=X, green=Y displacement)
   -> neutral gray center (no displacement in flat area)
   -> strong gradients at edges (maximum refraction at borders)
  |
  v
4. feComposite: merge turbulence + edge displacement
  |
  v
5. Three feDisplacementMap passes (R, G, B channels separately)
   -> R channel: scale=70, slight offset left
   -> G channel: scale=77, centered
   -> B channel: scale=84, slight offset right
   -> recombine via feBlend mode="screen"
   = CHROMATIC ABERRATION at glass edges
  |
  v
6. feDiffuseLighting (surfaceScale=2, 3 light sources)
   -> Fresnel edge glow (bright rim where glass catches light)
  |
  v
7. feComposite: blend refraction + Fresnel
  |
  v
Output (distorted, chromatically-split background with edge glow)
```

**Key parameters:**
- `baseFrequency: 0.006` — large organic patterns
- Edge displacement: neutral center (rgb(128,128,0)), strong edges (red/green ramps)
- Chromatic split: ~10% difference between R and B scales
- Fresnel: `feMorphology dilate radius=3` + `feComposite out`

### Blue Flow Field — WebGL Navier-Stokes

Small WebGL canvas for blue liquid flow only:

- **Resolution:** 64x64 velocity, 256x256 dye
- **Rendering:** Overlaid on glass panel, `pointer-events: none`, `mix-blend-mode: screen`
- **Color:** Electric Blue (#0047FF) to Cyan (#00F5FF)
- **Max opacity:** 0.35 (35%)
- **Dye dissipation:** 0.97/frame (fades in ~3 seconds)
- **Splat radius:** 0.02 normalized (thin rivulets)
- **Velocity threshold:** below 2px/frame = no new dye
- **Masking:** Flow limited to ~60% of panel area
- **Text exclusion zones:** Lower opacity near text regions

**Displacement coupling (dramatic):**
- Where blue flow is present, displacement scale ramps from 77 to 180 (2.3x)
- Chromatic aberration intensifies in blue zones
- "Water bending" via vorticity confinement creates wake patterns

### Text Chromatic Effect

```css
text-shadow:
  -1px 0 0 rgba(255,0,0,0.15),   /* Red offset left */
   1px 0 0 rgba(0,0,255,0.15),    /* Blue offset right */
   0   0 4px rgba(255,255,255,0.1) /* Subtle glow */
```

- On hover: chromatic split widens from 1px to 3px via GSAP
- Text color: white, `text-stroke: 0.5px rgba(255,255,255,0.3)`
- Hover interaction: localized blue pulse injected into flow field at hovered item coordinates

### Organic Borders

- `border-radius: 28px` with animated conic gradient shimmer
- `--border-angle` rotates slowly (20s loop via CSS @property)
- Inner glow: `box-shadow: inset 0 0 20px -5px rgba(255,255,255,0.5)`
- Border subtly distorts with the same SVG filter

### Noise/Grain Texture

- Procedural SVG feTurbulence noise as CSS background-image (data URL)
- `baseFrequency: 0.65` (fine grain)
- `opacity: 0.04` (4%)
- `mix-blend-mode: overlay`
- Slow CSS translate animation (30s loop) for shimmer
- Layered between glass body and flow canvas

## Component Hierarchy

```
AppNavigation
  +-- nav header bar (logo + hamburger trigger)
  +-- nav__panel (the glass menu)
       +-- UiLiquidGlassFilter (hidden SVG with filter defs)
       +-- div.glass-body (backdrop-filter: url(#liquid-glass))
       |    +-- ::before (noise/grain texture)
       |    +-- organic border + Fresnel glow
       +-- canvas.flow-canvas (WebGL blue flow, mix-blend-mode: screen)
       +-- div.menu-content (z-index: 2, DOM text with chromatic)
            +-- nav links with hover splat interaction
            +-- contact info
```

## File Changes

| File | Action | Purpose |
|------|--------|---------|
| `app/composables/useGlassShader.ts` | Replace | Strip WebGL glass, rebuild as flow-field-only composable |
| `app/composables/useLiquidGlass.ts` | Create | SVG filter generation, displacement image, flow-displacement coupling |
| `app/components/global/AppNavigation.vue` | Modify | Replace canvas glass with SVG filter + flow overlay, update handlers |
| `app/components/ui/UiLiquidGlassFilter.vue` | Create | Vue component rendering SVG filter definitions |

## Performance Budget

- SVG filter: GPU-accelerated, ~0 JS overhead
- WebGL flow: 64x64 velocity + 256x256 dye = lightweight
- Noise texture: static data URL, no runtime cost
- Target: 60fps on modern browsers, graceful degradation (CSS backdrop-filter blur fallback)

## Accessibility

- `prefers-reduced-motion`: disable flow animation, shimmer, border rotation; keep static glass with edge refraction
- Text remains DOM-based, fully accessible and selectable
- Skip links preserved
- ARIA labels maintained
