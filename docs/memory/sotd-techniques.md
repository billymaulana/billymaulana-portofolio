# SOTD Winner Techniques — Concrete Reference

## Analyzed Winners (2024-2026)

### Artiom Yakushev (art-yakushev.com) — SOTD + SOTM Jan 2026
- **ScrambleTextPlugin** on navigation items
- **Progressive blur** (backdrop-filter: blur → 10px) during page transitions
- **Per-character opacity** control via `.char` elements
- **Animated favicon** alternation every 900ms (micro-detail that wins points)
- **Real-time clock** synced to location timezone
- **Constraint**: Only 2 colors. Premium through restraint.

### Henri Heymans (henriheymans.com) — SOTD 2025, Score 7.52
- **WebGL canvas** in hero header
- **4 animated transition bars** sweeping across viewport on page change
- **Clip-path reveal**: `inset(100%) → inset(0)` for video thumbnails on hover
- **Dual-layer hover text**: Secondary text slides from `translateY(4.5rem)`
- **Per-character stagger reveal**: chars from `translateY(5rem)`
- **Letter-spacing**: -0.08rem to -0.28rem (AGGRESSIVE)
- **Typography**: Montreal-Bold + Roobert Mono

### Roman Jean-Elie — SOTD 2025
- **3D scene → FBO texture** displayed on plane mesh with masking shaders
- **Fold/Sticker shader**: dot product, vector projection, circular arc math, fake shadow via smoothstep()
- **MeshPortal**: Separate scene renders to render target, portal shader clips content
- **Velocity-based vertex stretch**: `sin(uv.y * freq) * velocity * decay` — middle stretches more
- **Parallax lines with motion blur**: modulo for infinite repeat, edge smoothing scales with velocity
- **SVG path morphing**: MorphSVG rect → text cutout, `fill-rule: evenodd` for holes
- **Camera FOV zoom**: FOV → 150deg during contact transition
- **Easing**: `back.out(1.2)` for organic pop

### Dorian Lods (dorianlods.fr) — Honorable Mention
- **WebGL refraction hover**: IOR-based distortion on project thumbnails
- **Stack**: Vue.js + GLSL + GPGPU
- **Effect**: Glass-like distortion responds to mouse position, creates depth without 3D scene

### Elliott Mangham (elliott.mangham.dev) — SOTD Dec 2025 + Developer Award (17x SOTD!)
- **5-column grid system** with animated dots
- **Preloader as progress narrative**: scaleX line + column headings fade
- **Custom cubic-bezier**: `0.39, 0.575, 0.565, 1`
- **Score**: Meticulous micro-interactions + accessibility + performance > flashy WebGL

### Cyd Stumpel (cydstumpel.nl) — SOTD Mar 2025 + Developer Award
- **CSS View Transitions** (native, no JS)
- **CSS Scroll-driven Animations**
- **Proves**: Can win Developer Award with CSS mastery alone. No WebGL needed.
- **Typography**: Instrument Serif + Geist

### Kaito Note (kaitonote.com) — Honorable + FWA SOTD + CSS Design Awards
- **4-font system** with CJK support
- **"Blue flame" design concept** — conceptual narrative gives portfolio identity
- **Gradient orb, scatter reveals, counter animation, CustomEase**

## Technique Library — Specific to Billy's Stack (Nuxt + GSAP + WebGL2)

### HERO: Text-Responsive Fluid (Level 5)
```
Hero text rendered to texture → WebGL fluid sim behind →
text acts as mask revealing fluid →
mouse velocity drives fluid force → chromatic aberration post-process
```
Reference: daspritam.in

### HERO: Mouse Velocity Text Displacement (Level 4)
```
Track mouse velocity →
feed velocity as uniform to vertex shader →
text vertices displace proportional to velocity →
decay factor creates smooth ease-out
```
Reference: Roman Jean-Elie (velocity stretch)

### PROJECTS: Refraction Hover (Level 4)
```
Project thumbnail as texture →
on hover, apply IOR-based refraction shader →
mouse position drives distortion center →
chromatic aberration splits RGB channels
```
Reference: Dorian Lods

### NAV/HEADERS: ScrambleText (Level 3)
```
GSAP ScrambleTextPlugin →
on hover/transition, characters scramble through random set →
reveal final text with stagger →
combine with blur-to-sharp
```
Reference: Artiom Yakushev

### TRANSITIONS: Progressive Blur (Level 3)
```
Page exit: content blur from 0 → 10px over 0.5s →
simultaneous opacity fade →
page enter: blur from 10px → 0 with new content →
creates "focus pull" cinematic effect
```
Reference: Artiom Yakushev

### SECTION REVEALS: Clip-Path System (Level 2)
```
Variety of clip-path animations:
- inset(100%) → inset(0) (full reveal)
- inset(0 100% 0 0) → inset(0) (left wipe)
- circle(0% at 50% 50%) → circle(100%) (radial reveal)
- polygon morphing
```
Reference: Henri Heymans

### BRANDING: Logo as Visual Anchor (Level 3)
```
BM monogram rendered large →
used as mask for WebGL content/fluid →
or as SVG path for drawSVG entrance →
or as stencil cutout revealing background effect
```
Reference: art-yakushev.com (monogram treatment)

## Per-Section Technique Assignment (Billy's Portfolio)

| Section | Primary Technique | Level | Reference |
|---------|------------------|-------|-----------|
| Hero | Fluid/shader text interaction + mouse velocity | 5 | daspritam.in |
| Manifesto | SVG drawSVG with scroll-driven reveal | 3 | Clip-path system |
| About | BM logo as mask for generative noise field | 3 | Yakushev |
| Projects | Refraction/displacement hover on thumbnails | 4 | Dorian Lods |
| Marquee | Velocity-based letter spacing on scroll | 2 | Jean-Elie |
| CTA | Magnetic field shader (cursor attracts particles) | 4 | Original |
| Footer | ScrambleText on name + drawSVG separator | 3 | Yakushev |

## The Non-Negotiable Minimum
- At least 1 GLSL shader (hero or projects)
- At least 1 mouse-velocity-driven effect
- Logo used as visual element in at least 1 section
- ScrambleText on at least navigation items
- NO generic particles/dots as primary visual
- Each section's technique must be FUNDAMENTALLY different from adjacent
