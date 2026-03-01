# Cinematic Preloader Research: SVG Logo Drawing Animation
## Research Date: 2026-02-27

---

## 1. TECHNIQUE CATALOG: SVG Path Drawing

### 1A. Basic Stroke-DashOffset (Foundation)
```css
@keyframes draw {
  from { stroke-dashoffset: 482.6; }
  to { stroke-dashoffset: 0; }
}
path {
  stroke-dasharray: 482.6; /* getTotalLength() */
  stroke-dashoffset: 482.6;
  animation: draw 2.4s ease-in-out forwards;
}
```
- Get path length with `path.getTotalLength()`
- `stroke-linecap="round"` for smoother reveals
- Use `animation-fill-mode: forwards` to maintain final state

### 1B. DrawSVG Plugin (GSAP) - Advanced Control
```javascript
// Draw from center outward
gsap.from(".path", { drawSVG: "50% 50%", duration: 1.5 });

// Draw to specific percentage
gsap.to(".path", { drawSVG: "0% 100%", duration: 2 });

// Draw and undraw in sequence
gsap.to(".path", { drawSVG: "100%", duration: 0.5, ease: "power2.inOut" });
gsap.to(".path", { drawSVG: "100% 100%", duration: 0.5 }); // Undraw
```

### 1C. Direction Control Techniques
- **Inside-Out**: Animate dash array values so they trade places, growing outward
- **Outside-In**: Create "double pen" effect for closed paths
- **Custom Start Point**: Use `stroke-dashoffset` offset to change where drawing begins
- **Multi-directional**: Split path into segments, draw each from different origins

### 1D. Antfu Signature Technique (Variable Width Stroke)
```css
@keyframes grow {
  0%   { stroke-dashoffset: 1px; stroke-dasharray: 0 350px; opacity: 0; }
  10%  { opacity: 1; }
  40%  { stroke-dasharray: 350px 0; }
  85%  { stroke-dasharray: 350px 0; }
  95%, to { stroke-dasharray: 0 350px; }
}
```
- Uses SVG mask of the original logo shape over the animated stroke
- Creates illusion of variable stroke width during draw animation
- Pure CSS, no JavaScript required

---

## 2. TECHNIQUE CATALOG: SVG Filter Effects

### 2A. Neon Glow (Multi-Layer) - 9elements Technique
```xml
<filter id="glow" filterUnits="userSpaceOnUse">
  <!-- Layer 1: Tight glow -->
  <feOffset in="SourceAlpha" result="shadow1"/>
  <feGaussianBlur in="shadow1" result="blur1" stdDeviation="5"/>
  <feColorMatrix in="blur1" result="color1"
    values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0"/>

  <!-- Layer 2: Medium glow -->
  <feOffset dy="1" in="SourceAlpha" result="shadow2"/>
  <feGaussianBlur in="shadow2" result="blur2" stdDeviation="7"/>
  <feColorMatrix in="blur2" result="color2"
    values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.9 0"/>

  <!-- Layer 3: Wide glow -->
  <feOffset dy="2" in="SourceAlpha" result="shadow3"/>
  <feGaussianBlur in="shadow3" result="blur3" stdDeviation="10"/>
  <feColorMatrix in="blur3" result="color3"
    values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.8 0"/>

  <!-- Layer 4: Sharp shadow -->
  <feOffset dx="2" dy="2" in="SourceAlpha" result="shadow4"/>
  <feGaussianBlur in="shadow4" result="blur4" stdDeviation="1"/>
  <feColorMatrix in="blur4" result="color4"
    values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0"/>

  <!-- Layer 5: Colored accent glow (teal) -->
  <feOffset dy="2" in="SourceAlpha" result="shadow5"/>
  <feGaussianBlur in="shadow5" result="blur5" stdDeviation="8"/>
  <feColorMatrix in="blur5" result="color5"
    values="0 0 0 0 0.314  0 0 0 0 0.888  0 0 0 0 0.760  0 0 0 0.649 0"/>

  <feMerge>
    <feMergeNode in="color1"/>
    <feMergeNode in="color2"/>
    <feMergeNode in="color3"/>
    <feMergeNode in="color4"/>
    <feMergeNode in="color5"/>
  </feMerge>
</filter>
```

**Dual-layer rendering approach:**
- Layer 1: Black fill + glow filter = the glow halo
- Layer 2: White fill, no filter = crisp letterform on top
- Both using `<use>` referencing same `<symbol>`

### 2B. Neon Flicker Animation
```css
@keyframes flicker {
  0%    { opacity: 1; }
  3%    { opacity: 0.4; }
  6%    { opacity: 1; }
  7%    { opacity: 0.4; }
  8%    { opacity: 1; }
  9%    { opacity: 0.4; }
  10%   { opacity: 1; }
  100%  { opacity: 1; }
}
.neon-letter { animation: flicker 6s infinite step-end; }
```
- `step-end` timing = instant jump, no smooth fade (authentic neon)
- Different durations per letter (5s, 6s, 7s) = randomized feel
- Different `animation-delay` per letter for staggered flicker

### 2C. Chromatic Aberration (SVG Filter)
```xml
<filter id="chromatic">
  <!-- Red channel offset left -->
  <feOffset in="SourceGraphic" dx="-3" dy="0" result="red-shifted"/>
  <feColorMatrix in="red-shifted" result="red-only" type="matrix"
    values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/>

  <!-- Blue channel offset right -->
  <feOffset in="SourceGraphic" dx="3" dy="0" result="blue-shifted"/>
  <feColorMatrix in="blue-shifted" result="blue-only" type="matrix"
    values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"/>

  <!-- Green channel (center, no offset) -->
  <feColorMatrix in="SourceGraphic" result="green-only" type="matrix"
    values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"/>

  <feBlend in="red-only" in2="green-only" mode="screen" result="rg"/>
  <feBlend in="rg" in2="blue-only" mode="screen"/>
</filter>
```
- Animate `dx`/`dy` with GSAP for dynamic chromatic split
- Increase offset values during motion for velocity-based aberration

### 2D. Displacement Distortion
```xml
<filter id="displacement">
  <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="3" result="noise"/>
  <feDisplacementMap in="SourceGraphic" in2="noise" scale="0"
    xChannelSelector="R" yChannelSelector="B"/>
</filter>
```
- Animate `scale` from 50 -> 0 for "solidifying" effect
- Animate `baseFrequency` for evolving noise pattern
- P'(x,y) = P(x + scale*(XC(x,y) - 0.5), y + scale*(YC(x,y) - 0.5))

### 2E. Glitch Effect (Animated Flood Displacement)
```xml
<filter id="glitch">
  <feFlood flood-color="rgb(127,0,127)" width="100%" height="100%" result="base"/>
  <feFlood flood-color="rgb(255,0,127)" width="100%" height="20%" result="strip">
    <animate attributeName="y" from="0" to="80%" dur="0.5s" repeatCount="indefinite"/>
    <animate attributeName="height" values="20%;5%;30%;10%;25%" dur="0.7s" repeatCount="indefinite"/>
  </feFlood>
  <feMerge result="map"><feMergeNode in="base"/><feMergeNode in="strip"/></feMerge>
  <feDisplacementMap in="SourceGraphic" in2="map" scale="20" xChannelSelector="R"/>
</filter>
```

---

## 3. TECHNIQUE CATALOG: Multi-Phase Animation Patterns

### 3A. Cinematic Preloader Timeline (GSAP)
```javascript
const masterTL = gsap.timeline({ onComplete: revealSite });

// Phase 1: Logo Draw (0s - 2s)
masterTL.from(".logo-path", {
  drawSVG: "0%",
  duration: 2,
  ease: "power3.inOut",
  stagger: { each: 0.3, from: "center" }
});

// Phase 2: Fill Reveal (2s - 3s)
masterTL.to(".logo-path", {
  fill: "#0047FF",
  strokeOpacity: 0,
  duration: 0.8,
  ease: "expo.inOut"
}, "-=0.3");

// Phase 3: Glow Pulse (3s - 4.5s)
masterTL.to(".logo-glow", {
  opacity: 1,
  filter: "blur(15px)",
  scale: 1.05,
  duration: 0.6,
  ease: "power2.out",
  yoyo: true,
  repeat: 1
});

// Phase 4: Counter (parallel with Phase 1-3)
masterTL.fromTo(".counter",
  { innerText: 0 },
  { innerText: 100, duration: 4, snap: { innerText: 1 }, ease: "power1.inOut" },
  0
);

// Phase 5: Exit Transition (4.5s - 6s)
masterTL.to(".preloader", {
  clipPath: "inset(0 0 100% 0)",
  duration: 1,
  ease: "expo.inOut"
});
```

### 3B. Text Reveal with SplitText
```javascript
SplitText.create(".preloader-text", {
  type: "lines, words, chars",
  mask: "lines",
  linesClass: "line",
  charsClass: "letter"
});

tl.from(".letter", {
  y: 60,
  opacity: 0,
  filter: "blur(8px)",
  stagger: 0.03,
  duration: 0.8,
  ease: CustomEase.create("textReveal", "0.625, 0.05, 0, 1")
});
```

### 3C. Particle Assembly to Logo (Canvas 2D)
1. Extract coordinates from SVG path using `getPointAtLength()`
2. Initialize particles at random positions
3. Animate particles toward goal coordinates
4. Apply easing per-particle with slight random delay
5. Once assembled, cross-fade to actual SVG element
```javascript
// Extract points from SVG path
const path = document.querySelector('#logo-path');
const totalLength = path.getTotalLength();
const points = [];
for (let i = 0; i < numParticles; i++) {
  const point = path.getPointAtLength((i / numParticles) * totalLength);
  points.push({ goalX: point.x, goalY: point.y });
}

// Animate particles to goal positions using GSAP
particles.forEach((p, i) => {
  gsap.to(p, {
    x: points[i].goalX,
    y: points[i].goalY,
    duration: gsap.utils.random(1.5, 2.5),
    delay: gsap.utils.random(0, 0.5),
    ease: "expo.out"
  });
});
```

### 3D. Clip-Path Wipe Transitions
```javascript
// Venetian blinds reveal
gsap.to(".preloader-slat", {
  clipPath: "inset(0 0 100% 0)",
  stagger: { each: 0.1, from: "center" },
  duration: 0.8,
  ease: "power4.inOut"
});

// Circle wipe from center
gsap.to(".preloader", {
  clipPath: "circle(150% at 50% 50%)",
  duration: 1.2,
  ease: "expo.inOut"
});

// Diamond/polygon wipe
gsap.to(".preloader", {
  clipPath: "polygon(50% -50%, 150% 50%, 50% 150%, -50% 50%)",
  duration: 1,
  ease: "power3.inOut"
});
```

---

## 4. CINEMATIC TIMING & EASING PATTERNS

### 4A. Easing Hierarchy for Preloader
| Phase | Easing | Rationale |
|-------|--------|-----------|
| Logo stroke draw | `power3.inOut` or `CustomEase("0.625, 0.05, 0, 1")` | Organic, hand-drawn feel |
| Fill reveal | `expo.inOut` | Sharp, decisive moment |
| Glow pulse | `power2.out` | Natural light falloff |
| Chromatic flash | `expo.out` | Quick flash, slow decay |
| Counter ticking | `power1.inOut` | Steady progression feel |
| Exit wipe | `expo.inOut` | Cinematic curtain drop |
| Hero text entrance | `CustomEase` per-char | Premium, branded feel |

### 4B. Timing Architecture (5-8s Target)
```
0.0s ─── Background fade in (0.3s)
0.3s ─── Logo paths start drawing (staggered, 2.0s)
1.0s ─── Counter starts (parallel, 3.5s)
2.3s ─── Stroke fill transition begins (0.8s)
3.0s ─── Glow pulse + chromatic flash (0.8s)
3.5s ─── Hold beat (0.5s) - let logo breathe
4.0s ─── Subtitle/tagline reveal (0.6s)
4.5s ─── Counter hits 100%
5.0s ─── Exit transition begins (1.2s)
5.5s ─── Hero content starts entering (overlap)
6.2s ─── Preloader fully gone
6.5s ─── Hero animation complete
```

### 4C. CustomEase Curves for Cinematic Feel
```javascript
// Signature draw ease - slow start, quick middle, gentle end
CustomEase.create("cinematicDraw", "M0,0 C0.14,0 0.27,0.56 0.32,0.74 0.42,1.04 0.56,1 1,1");

// Sharp reveal - almost instant with micro-settle
CustomEase.create("sharpReveal", "M0,0 C0.62,0.05 0.01,0.99 1,1");

// Glow pulse - quick rise, slow luminous fade
CustomEase.create("glowPulse", "M0,0 C0.25,1 0.5,1 1,0");
```

---

## 5. AWARD-WINNING PRELOADER PATTERNS (Analysis)

### 5A. art-yakushev.com Pattern
- 5-7 second cinematic intro
- Per-character blur-to-sharp reveal
- Chromatic aberration offset per letter
- Dark background (#0a0a0a), white text
- Sequential: loader -> text reveal -> hero transition
- Each character has individual stagger timing

### 5B. daspritam.in Pattern
- Fluid text masks with chromatic aberration
- Swiss-inspired counter-positioned layout
- Circular narrative (footer mirrors intro)
- Blend-mode based color interactions
- Text as visual material, not just content

### 5C. Immersive Garden Pattern
- Vue.js + Nuxt stack (same as our project)
- GSAP for all animations
- Lenis for scroll management
- WebGL (three.js) for 3D elements
- Custom progress tracking tied to asset loading

### 5D. Lusion Pattern
- WebGL-heavy experiments
- Particle system transitions
- High-performance shader effects
- Portfolio pieces showcase technical mastery

### 5E. Common Patterns Across Award Winners
1. **Percentage counter** - Dynamic number counting from 0-100
2. **Staggered text reveals** - Per-character with blur + y-translate
3. **Dramatic pause** - Brief hold (0.3-0.5s) after logo assembly
4. **Exit choreography** - clip-path wipe or scale transition
5. **Seamless handoff** - Hero content starts entering before preloader fully exits
6. **Sound design** - Subtle audio cues (optional, muted by default)

---

## 6. IMPLEMENTATION IDEAS FOR "BM" MONOGRAM

### Concept A: "Precision Architect" (Recommended)
**Theme**: Engineering precision meets artistic expression

**Phase 1 - Void (0-0.3s)**
- Pure black screen, subtle grain texture fades in

**Phase 2 - Construction Lines (0.3-1.5s)**
- Thin hairline grid appears (0.5px, opacity 0.08)
- Horizontal + vertical guide lines draw from edges toward center
- `drawSVG: "50% 50%"` expanding outward from center intersections

**Phase 3 - Monogram Draw (1.5-3.5s)**
- "B" draws first: stroke from bottom-left, traveling up through curves
- Brief 0.15s pause
- "M" draws: strokes from multiple starting points converging
- Each stroke has slightly different timing/ease for organic feel
- `stagger: { each: 0.2, from: "edges" }`

**Phase 4 - Materialization (3.5-4.5s)**
- Stroke transitions from white (#fff) to electric blue (#0047FF)
- Fill fades in simultaneously with feGaussianBlur glow
- Construction lines fade out
- Chromatic aberration flash (3px offset, 0.15s duration)

**Phase 5 - Glow Settle (4.5-5.2s)**
- 5-layer neon glow pulses once (scale 1.0 -> 1.02 -> 1.0)
- Blue accent glow (#0047FF stdDeviation: 8)
- Subtle displacement turbulence ripple (scale: 5 -> 0)

**Phase 6 - Identity (5.2-5.8s)**
- Tagline text reveals: "Frontend Architect"
- Per-char stagger 0.03s, blur 8px -> 0px, y: 20 -> 0

**Phase 7 - Transition (5.8-7.0s)**
- Logo scales down slightly (0.95) and translates up
- clip-path: circle() expands from center to reveal hero
- Hero content begins entrance with 0.3s overlap

### Concept B: "Liquid Assembly"
- Particles scatter across screen (200-400 dots)
- Particles converge to form "BM" letterform
- Cross-fade from particles to solid SVG
- Liquid displacement ripple on settle
- Total: 5-6s

### Concept C: "Typographic Cinema"
- Single oversized "B" fills viewport (200vw)
- Dramatic clip-path reveals character in sections
- Camera-like zoom out to final size
- "M" slides in from right with momentum
- Letters lock together with satisfying settle bounce

---

## 7. SVG FILTER PRESETS FOR "BM" LOGO

### Electric Blue Glow
```xml
<filter id="bm-glow" filterUnits="userSpaceOnUse" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur1"/>
  <feColorMatrix in="blur1" result="glow1"
    values="0 0 0 0 0  0 0 0 0 0.278  0 0 0 0 1  0 0 0 0.8 0"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="10" result="blur2"/>
  <feColorMatrix in="blur2" result="glow2"
    values="0 0 0 0 0  0 0 0 0 0.278  0 0 0 0 1  0 0 0 0.5 0"/>
  <feGaussianBlur in="SourceAlpha" stdDeviation="20" result="blur3"/>
  <feColorMatrix in="blur3" result="glow3"
    values="0 0 0 0 0  0 0 0 0 0.278  0 0 0 0 1  0 0 0 0.3 0"/>
  <feMerge>
    <feMergeNode in="glow3"/>
    <feMergeNode in="glow2"/>
    <feMergeNode in="glow1"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>
```

### Chromatic Flash (Animated via GSAP)
```xml
<filter id="bm-chromatic">
  <feOffset in="SourceGraphic" dx="0" dy="0" result="red-shift">
    <!-- GSAP animates dx from -4 to 0 -->
  </feOffset>
  <feColorMatrix in="red-shift" result="red"
    values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
  <feOffset in="SourceGraphic" dx="0" dy="0" result="blue-shift">
    <!-- GSAP animates dx from 4 to 0 -->
  </feOffset>
  <feColorMatrix in="blue-shift" result="blue"
    values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"/>
  <feColorMatrix in="SourceGraphic" result="green"
    values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"/>
  <feBlend in="red" in2="green" mode="screen" result="rg"/>
  <feBlend in="rg" in2="blue" mode="screen"/>
</filter>
```

---

## 8. PERFORMANCE NOTES

- SVG filter animations can be expensive; limit filter region with explicit x/y/width/height
- `feGaussianBlur` stdDeviation > 20 causes noticeable lag on mobile
- Prefer `transform: scale()` + `transform-box: fill-box` over animating stroke-width
- `stroke-dashoffset` animation is cheap (no layout recalc)
- Use `will-change: filter` on glow layers
- Test on throttled 4x CPU in DevTools
- Keep total filter primitive count under 10 per filter chain
- `prefers-reduced-motion`: skip all animation, show final state immediately

---

## Sources

- [Codrops Preloader Tag](https://tympanus.net/codrops/tag/preloader/)
- [Codrops SVG Filters 101](https://tympanus.net/codrops/2019/01/15/svg-filters-101/)
- [Codrops MorphSVG & SplitText Creative Demos](https://tympanus.net/codrops/2025/05/14/from-splittext-to-morphsvg-5-creative-demos-using-free-gsap-plugins/)
- [9elements Animated SVG Neon Effect](https://9elements.com/blog/creating-an-animated-svg-neon-light-effect/)
- [Smashing Magazine SVG Displacement Filtering](https://www.smashingmagazine.com/2021/09/deep-dive-wonderful-world-svg-displacement-filtering/)
- [Cassie.codes Logo Animation](https://www.cassie.codes/posts/creating-my-logo-animation/)
- [Antfu Animated SVG Logo](https://antfu.me/posts/animated-svg-logo)
- [GSAP DrawSVGPlugin Docs](https://gsap.com/docs/v3/Plugins/DrawSVGPlugin/)
- [GSAP MorphSVGPlugin Docs](https://gsap.com/docs/v3/Plugins/MorphSVGPlugin/)
- [GSAP CustomEase Docs](https://gsap.com/docs/v3/Eases/CustomEase/)
- [Nick Hart Cyberpunk SVG Logo](https://www.nickhart.co.uk/2021/04/18/animated-svg-cyberpunk-logo-with-filters/)
- [SVG AI Animation Encyclopedia](https://www.svgai.org/blog/research/svg-animation-encyclopedia-complete-guide)
- [SVG AI Path Animation Tutorial](https://www.svgai.org/blog/svg-path-animation-tutorial)
- [Frontend Horse GSAP Techniques](https://frontend.horse/articles/amazing-animation-techniques-with-gsap/)
- [SimpleThread GSAP+SVG](https://www.simplethread.com/animating-with-gsap-and-svg/)
- [Awwwards Loading Animations Collection](https://www.awwwards.com/awwwards/collections/loading-page/)
- [Awwwards Best Loading Animations Roundup](https://www.awwwards.com/a-round-up-of-the-best-loading-animations-1.html)
- [GSAP Preloader CodePen Examples](https://codepen.io/gridmorphic/pen/pvjXqeJ)
- [DEV.to Animating SVG Filters](https://dev.to/hexshift/animating-svg-filters-for-motion-based-ui-and-art-effects-3l6)
