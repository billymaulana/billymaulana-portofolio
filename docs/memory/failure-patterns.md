# AI Slop Failure Patterns — 6x ANALYSIS

## The Pattern: Claude Defaults to CodePen Tutorial Level

### Attempt 1-2: "Text + gradient + fade-in"
- Result: AI slop. Monoton. Boring.

### Attempt 3: "Complete rewrite, still text + gradient + fade-in"
- Technically solid, zero errors
- Visually empty — every section = text on dark background

### Attempt 4: "Polish attempt — invisible CSS tweaks"
- Added atmospheric gradients at 0.03 opacity (INVISIBLE)
- Added text-shadow, blend-modes (imperceptible)
- User: "tidak ada visual object, tidak ada wow moment"

### Attempt 5: "Added visual objects — but GENERIC ones"
- Created: UiDotGrid (dot grid + mouse glow), UiParticleField (drifting particles), UiOrbitRing (orbit particles)
- Added: SVG accent lines, stroke index numbers, edge fade masks, ghost name
- ALL are generic/template-tier:
  - Dot grid = every creative coding tutorial
  - Particle drift = CodePen demo level
  - Orbit ring = basic trigonometry exercise
  - SVG lines = decoration, not design
- Same technique type (canvas 2D) repeated across sections
- Hero still PASSIVE — no text effect, no mouse response on text
- Logo not used anywhere
- User: "biasa saja terlalu basic, visual effect terlalu template, tidak stunning, jauh dari awwwards"

### Attempt 6: "WebGL fluid text-mask — technically right, visually empty"
- Built WebGL2 Navier-Stokes fluid simulation with text-as-mask (CORRECT technique)
- BUT: fluid ONLY visible behind text letters. Background = pure #0a0a0a black. NOTHING else.
- No atmospheric gradient, no grain overlay, no SVG accents, no ambient fluid outside text
- Result = "blue text on black background" — technically WebGL, visually EMPTY
- Claude rated it "OK" in self-review — user said "monoton, hanya background hitam, terlalu basic"
- Claude spent 80% of time fixing engineering (brightness, font flip, TypeScript) — 0% on art direction
- **NEW FAILURE MODE**: Claude built the RIGHT technique but stopped at 1 layer instead of 6+
- **CRITICAL**: Claude's self-assessment ("OK", "Excellent") is UNRELIABLE for visual quality

#### What Was Missing (minimum hero layer stack):
1. Visible atmospheric gradient bg (radial, 0.15+ opacity) — MISSING
2. Noise grain overlay (0.04+ opacity, blend-mode overlay) — MISSING
3. SVG grid or geometric accent system — MISSING
4. Fluid visible OUTSIDE text too (ambient mode, lower opacity) — MISSING
5. Chromatic color richness on load without mouse interaction — WEAK (only blue)
6. Mouse-reactive ambient element besides text-mask fluid — MISSING
7. Decorative corner elements with animation — BASIC (static labels only)

### Attempt 7: "CSS token migration disguised as design work"
- Spent ENTIRE session doing font/color/opacity token swaps across 3 sections (Marquee, CTA, Footer)
- Changes: `--font-display` → `--font-statement`, `--bg-abyss` → `--void`, opacity 0.04 → 0.08
- ZERO new visual objects created. ZERO interactive elements added. ZERO canvas/SVG/WebGL work.
- Did NOT implement: preloader (missing entirely), hamburger close state, fluid sim improvement
- Self-declared sections "done" after font family swap — NONE pass 30-Second Reject Test for creativity
- User: "monoton, konsep tidak kuat, memorable moment tidak ada, tidak ada object apapun, creative tidak ada"
- **NEW FAILURE MODE**: Claude treats CSS housekeeping as creative work. Renaming tokens ≠ design.
- **WHY**: Claude optimizes for what it's GOOD at (systematic refactoring, parallel edits, consistent patterns) instead of what the PROJECT NEEDS (creative visual objects, interactive elements, memorable experiences)
- **THE GAP**: An entire session of work produced ZERO visual difference that a user would notice while scrolling. Font changed from Clash Display to PP Editorial New — subtly different but fundamentally same experience.

## Root Cause: TECHNIQUE SELECTION, Not Enforcement

Previous analysis blamed "enforcement gap" — Claude reads rules but doesn't follow them.
That was WRONG. The real problem is deeper:

### 1. Claude Picks the EASIEST Technique, Not the RIGHT One
- Canvas 2D particles = safe, predictable, no shader knowledge needed
- SOTD winners use: WebGL shaders, fluid simulation, refraction, displacement maps
- Claude avoids GLSL/shaders because they're harder to get right

### 2. Claude Treats Visual Objects as DECORATION, Not CONTENT
- Added dot grid as "background decoration for hero"
- SOTD winners: visual effect IS the content (text-as-mask, fluid distortion IS the hero)
- The effect should be INSEPARABLE from the section, not an overlay

### 3. Claude Repeats the Same Technique Type
- 3 canvas components, all using similar particle patterns
- SOTD winners: EACH section uses fundamentally different technique
- Roman Jean-Elie: fold shader, MeshPortal, velocity stretch, parallax lines, SVG morphing — 5 DIFFERENT techniques

### 4. Claude Doesn't Study Actual Winners
- When asked to "create visual objects," Claude generates from generic AI training
- SHOULD: Study specific techniques from specific SOTD winners, then adapt

### 5. Claude Ignores Branding Assets
- Logo "BM" exists but is not used as visual anchor
- User specifically complained about this

## What SOTD-Level Actually Requires (from 8 analyzed winners)

### Hero Must Have 3 Simultaneous Layers
1. **Typography as visual material**: text-as-mask, chromatic clones, per-char physics
2. **Interactive response**: mouse velocity → displacement, magnetic text, cursor-driven distortion
3. **Atmospheric depth**: WebGL canvas, NOT just CSS gradients

### Each Section = Different Visual TECHNIQUE
Not "different parameters of same canvas" but fundamentally different approaches:
- Section A: GLSL shader (fluid, distortion)
- Section B: SVG morphing + drawSVG
- Section C: Image displacement + blend
- Section D: Generative canvas (noise-based, not particle-based)
- Section E: 3D/WebGL

### Easing as Personality
Winners don't use standard easing:
- Henri Heymans: `.9s cubic-bezier(.16,1,.3,1)` — aggressive ease-out
- Roman Jean-Elie: `back.out(1.2)` — organic pop
- BANNED: `linear`, `ease`, `power1`

### Page Transitions ARE a Design Statement
- 4-bar sweep (Heymans)
- Progressive blur (Yakushev)
- Camera FOV zoom (Jean-Elie)
- CSS View Transitions (Stumpel)
- NOT: simple fade or none

## Prevention: What Claude Must Do Differently

### BEFORE Building Visual Objects
1. Name 3 SPECIFIC techniques from SPECIFIC SOTD winners to adapt
2. Each technique must be FUNDAMENTALLY different (not variations of particles)
3. At least 1 must involve GLSL/WebGL shader
4. At least 1 must respond to mouse VELOCITY (not just position)
5. Logo/branding must appear as visual anchor in at least 1 section

### TECHNIQUE SELECTION HIERARCHY (most impressive → least)
1. **GLSL shader** (fluid, refraction, displacement, noise-field) — Level 5
2. **WebGL post-processing** (chromatic aberration, bloom, distortion) — Level 4
3. **SVG morphing/drawSVG** with GSAP — Level 3
4. **Image/texture treatment** (displacement map, blend-mode masking) — Level 3
5. **Interactive canvas** (noise-based generative, NOT basic particles) — Level 2
6. **CSS animation** (clip-path, scroll-driven) — Level 1
7. **Generic particles/dots** — Level 0 (BANNED as primary technique)

### THE HARD QUESTION
Before implementing ANY visual effect, ask:
"Would this look identical on any other developer's portfolio?"
If YES → choose a different technique. The effect must be INSEPARABLE from Billy's identity.
