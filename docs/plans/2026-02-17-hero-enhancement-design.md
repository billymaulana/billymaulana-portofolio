# Hero Section Enhancement Design

**Date**: 2026-02-17
**Status**: Approved
**Branch**: experimental/landing-1

## Problem Statement

1. WebGL fluid simulation turns grey when too many touches/interactions accumulate
2. Typography and layout not at Awwwards level
3. "BILLY MAULANA" text lacks interactive effects

## Reference Inspiration

- **daspritam.in** — ink/chroma liquid distortion on text hover
- **supersolid.agency** — WebGL flowmap + glitch liquid text effect
- **crz.digital** — liquid splash preloader, proximity-based text effects

## Design Decisions

### 1. Fluid Sim — Aggressive Anti-Grey Fix

**Root cause**: Additive color accumulation (`base + splat`) with insufficient decay.

Changes:
- **Display shader**: Tone-mapping with `1.0 - exp(-c * exposure)` to compress instead of saturate
- **Density dissipation**: `0.3` -> `1.5`
- **Color multiplier**: `1.5` -> `0.6`
- **Periodic soft-clear**: Every 5s, clear program with `value: 0.92` for gentle dimming
- **Background gradient blending**: Display shader blends fluid with ambient gradient
- **Touch throttle**: Skip splats if last < 50ms ago
- **Touch splatForce**: `6000` -> `2500`

### 2. WebGL Text Displacement — Layered Effects

**New composable**: `useTextDistortion`
- Renders text to offscreen canvas, applies as WebGL texture
- Mouse proximity creates flowmap-based liquid ink displacement
- RGB channels offset by different noise octaves for chromatic split

**CSS overlay layers**:
- **Glitch slice**: Random horizontal band shifts on hover (clip-path, 100-400ms intervals)
- **Noise grain**: Tiny repeating noise pattern (opacity 0.03-0.05)
- **Scanline hint**: Ultra-subtle horizontal lines (opacity 0.02-0.04)

**New component**: `UiTextDistortion.vue`
- Wraps composable, positions WebGL canvas over text
- HTML h1 remains for SEO/accessibility (opacity: 0 when WebGL ready)

### 3. Layout — Full-Bleed With Breathing Room

Typography changes:
- `--text-display`: `clamp(4rem, 14vw, 16rem)`
- Line-height: `0.84`
- "MAULANA" indent: `clamp(1rem, 5vw, 6rem)`

Layout structure:
```
+-------------------------------------------+
|  Frontend Engineer -- Bandung       (07)  |  <- top meta bar
|                                           |
|                                           |
|  BILLY                                    |  <- massive, left-aligned
|     MAULANA                               |  <- indented
|                                           |
|                                           |
|              v Scroll                     |  <- bottom center
+-------------------------------------------+
```

- Subtitle removed from below name, moved to top meta bar
- More negative space around the name

### 4. Entrance Choreography

1. `0.0s` — Fluid canvas fades in + initial splats
2. `0.3s` — Name characters slide up with stagger
3. `0.6s` — WebGL displacement settles from noise to clarity
4. `0.9s` — Top meta bar fades in
5. `1.1s` — Scroll indicator appears

## Files to Create/Modify

- `app/composables/useTextDistortion.ts` (NEW)
- `app/components/UiTextDistortion.vue` (NEW)
- `app/composables/useFluidSimulation.ts` (MODIFY)
- `app/components/UiFluidCanvas.vue` (MODIFY)
- `app/components/SectionHero.vue` (MODIFY)
- `app/assets/css/main.css` (MODIFY)
