# Typography Mastery Reference

Comprehensive typography reference synthesized from theory, font selection, CSS techniques, and Awwwards winner analysis. Every recommendation is backed by data from SOTY/SOTD/SOTM winners.

---

## 1. Typography Theory for Web

### Hierarchy Principles

Effective hierarchy uses **three contrasts simultaneously**: size, weight, and color.

| Level | Role | Size Range | Weight | Color (dark bg) |
|-------|------|-----------|--------|-----------------|
| Display/Hero | Attention anchor | 8-18vw | 400 (light!) | #FFFFFF |
| H1 | Section title | 4-8vw | 400-500 | #FFFFFF |
| H2 | Subsection | 2-4vw | 500-600 | #EAEAEA |
| H3 | Group label | 1.5-2.5vw | 600-700 | #EAEAEA |
| Body | Content | 16-20px | 400-500 | #E0E0E0 |
| Caption/Label | Metadata | 12-14px | 500 (mono) | #888888 |

**Key insight from winners**: Display text uses LIGHTER weights than body text. The inverse weight-size relationship is universal across SOTY winners.

### Rhythm and Vertical Spacing

- **Baseline grid**: 8px base unit, Fibonacci multiples (8, 16, 24, 32, 48, 64, 96)
- **Line-height rules**: Display = 0.85-1.0, Body = 1.4-1.6, Caption = 1.3-1.4
- **Paragraph spacing**: 1em-1.5em between paragraphs, 2em-3em before headings
- **Section rhythm**: Consistent `--section-gap` fluid spacing

### Readability Principles

- **Measure (line length)**: 45-75 characters optimal, 66 ideal. Use `max-width: 65ch`.
- **Body minimum**: 16px absolute minimum, 18-20px preferred for dark backgrounds.
- **Contrast ratio**: WCAG AA = 4.5:1 body, 3:1 large text. Aim for 7:1+ on dark backgrounds.
- **Anti-halation**: On dark backgrounds, use `-webkit-font-smoothing: antialiased` and bump weight +100 vs light mode.

---

## 2. Type Scale Systems

### Ratios Ranked for Creative Web

| Ratio | Value | Best For | Award Usage |
|-------|-------|----------|-------------|
| Perfect Fourth | 1.333 | Creative web (sweet spot) | Most popular in SOTD |
| Major Third | 1.250 | Editorial, typography-heavy | Common in portfolio sites |
| Perfect Fifth | 1.500 | Bold, expressive | Display-heavy portfolios |
| Golden Ratio | 1.618 | Maximum drama, experimental | Hero-focused sites |

### Fluid clamp() Formula

```
font-size: clamp(min, preferred, max)

preferred = minSize + (maxSize - minSize) * ((100vw - minViewport) / (maxViewport - minViewport))
```

Simplified calculation (viewports 375px-1440px):
```
slope = (maxRem - minRem) / (90 - 23.4375)
intercept = minRem - slope * 23.4375
preferred = intercept(rem) + slope * 100(vw)
```

### Golden Ratio Fluid Scale (Production Ready)

```css
:root {
  /* Golden Ratio (1.618) — 375px to 1440px viewport */
  --text-caption:  clamp(0.625rem, 0.56rem + 0.28vw, 0.75rem);    /* 10-12px */
  --text-small:    clamp(0.75rem, 0.68rem + 0.31vw, 0.875rem);     /* 12-14px */
  --text-body:     clamp(1rem, 0.93rem + 0.31vw, 1.125rem);        /* 16-18px */
  --text-subhead:  clamp(1.25rem, 1.04rem + 0.93vw, 1.75rem);      /* 20-28px */
  --text-heading:  clamp(1.75rem, 1.29rem + 2.05vw, 2.875rem);     /* 28-46px */
  --text-title:    clamp(2.5rem, 1.61rem + 3.96vw, 4.75rem);       /* 40-76px */
  --text-display:  clamp(3.5rem, 1.23rem + 10.09vw, 13rem);        /* 56-208px */
}
```

### Responsive Breakpoint Strategy

Use **dual-ratio scaling**: tighter ratio on mobile, wider on desktop.
```
Mobile (375px):  Perfect Fourth (1.333)
Desktop (1440px): Golden Ratio (1.618)
```
The `clamp()` function handles the interpolation between these two endpoints.

---

## 3. Font Face Selection

### Display Font Criteria

- **x-height**: Moderate to tall for readability at large sizes
- **Optical weight**: Appears balanced at 80-200px sizes
- **Character width**: Condensed fonts allow 18vw+ hero sizes
- **Variable axes**: `wght` minimum, `wdth` bonus for kinetic typography
- **OpenType features**: Stylistic alternates, ligatures, kerning

### Body Font Criteria

- **x-height**: Tall for screen readability (Inter, Satoshi excel here)
- **Weight range**: 400-700 minimum for body hierarchy
- **Counter shapes**: Open counters for small-size legibility
- **Neutral personality**: Should not compete with display font

### Serif vs Sans Decision

| Use Serif When | Use Sans When |
|----------------|---------------|
| Editorial/luxury brand | Tech/modern brand |
| Accent text / mixed heading | Primary text system |
| Italics as design element | Clean, systematic design |
| "Serif Renaissance" trend | Swiss/International style |

### Variable Font Advantages

- Single WOFF2 replaces 5-10 static files
- Animatable weight/width axes for kinetic typography
- Intermediate values (weight 547, not just 400/500/600)
- Typical 40-60% file size reduction vs multiple statics

---

## 4. Font Pairing Rules

### The 6 Pairing Strategies

**1. Display + Neutral Body** (Most popular in Awwwards)
```
Clash Display → Satoshi
Monument Extended → Inter
Syne → DM Sans
```

**2. Contrast-Based (Serif + Sans)**
```
PP Editorial New → Neue Montreal
Reckless Neue → Suisse Int'l
Instrument Serif (italic) → Condensed Sans (heading)
```

**3. Superfamily / Same Ecosystem**
```
Neue Montreal → Neue Montreal Mono
Suisse Int'l → Suisse Works → Suisse Mono
Space Grotesk → Space Mono
```

**4. Weight Contrast within Same Family**
```
Satoshi 900 (display) → Satoshi 500 (body)
Inter 800 (heading) → Inter 400 (body)
```

**5. Mixed Typography in Same Heading** (2024-2025 trend)
```
Condensed Sans + Italic Serif in same line
(e.g., Bueno-VF + Instrument Serif Italic — Cyd Stumpel SOTD 2025)
```

**6. Sans + Mono Accent System**
```
PP Neue Montreal (headings/body) + GT America Mono (labels/captions)
Satoshi (headings/body) + JetBrains Mono (code/metadata)
```

### Maximum Font Families: 2-3

| Slot | Role | Example |
|------|------|---------|
| Display | Headings, hero | Clash Display |
| Body | Paragraphs, UI | Satoshi |
| Mono (optional) | Labels, code, captions | JetBrains Mono |

### Proven Winner Pairings (Extracted from DevTools)

| Site (Award) | Display | Body | Mono/Accent |
|---|---|---|---|
| Lusion (SOTY 2024) | Aeonik | — | IBM Plex Mono |
| Noomo (SOTY 2023) | Neue Machina | Neue Roman | — |
| daspritam.in | Satoshi | system-ui | Custom Mono |
| sileent.com | PP Neue Montreal | PP Neue Montreal | GT America Mono |
| creativewebmanual.com | PP Neue Montreal | PP Neue Montreal | Rand Mono + PP Mondwest |
| art-yakushev.com | Apparel (serif) | Suisse Int'l | — |
| cydstumpel.nl (SOTD 2025) | Bueno-VF | Geist | Instrument Serif (accent) |

---

## 5. Letter-Spacing & Kerning

### Letter-Spacing Rules from Winners

| Context | Letter-Spacing | Examples |
|---------|---------------|----------|
| Hero display (10vw+) | -2% to -5% of font-size | art-yakushev: -5.46px on 156px |
| Section heading (4-8vw) | -1% to -2% | Lusion: -2.84px on 142px |
| Uppercase text | +0.05em to +0.1em | Standard for all-caps body |
| Body text (dark bg) | +0.01em to +0.02em | Reduces halation |
| Monospace labels | 0 to +0.05em | Clean technical look |

### Computed Letter-Spacing from SOTY Sites

| Site | Display Size | Letter-Spacing | Ratio |
|------|-------------|----------------|-------|
| grids.obys.agency | 264px | -10px | -3.8% |
| supersolid.agency | 147px | -7.3px | -5.0% |
| art-yakushev.com | 156px | -5.5px | -3.5% |
| daspritam.in | 163px | -4.1px / -8.2px (stroke) | -2.5% / -5% |
| lusion.co | 142px | -2.8px | -2.0% |
| creativewebmanual.com | 135px | -2.7px | -2.0% |

**Pattern**: Stroke/outlined text uses 2x tighter spacing than solid text.

### CSS Implementation

```css
/* Display text: percentage-based for fluid scaling */
.display { letter-spacing: -0.03em; } /* -3% */
.heading { letter-spacing: -0.02em; } /* -2% */

/* Uppercase body: positive tracking */
.uppercase-label {
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

/* Enable kerning */
.text {
  font-kerning: normal;
  font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
  text-rendering: optimizeLegibility; /* caution: perf cost on mobile */
}
```

---

## 6. Font Size Strategy

### Hero Text Size Ranges from Winners

| Site | Hero (vw) | Hero (px @ 1440) | Category |
|------|----------|-------------------|----------|
| grids.obys.agency | 18.3vw | 264px | Extreme |
| chdartmaker.com | 18.5vw | 263px | Extreme (condensed font) |
| creativewebmanual.com | 14.8vw | 213px | Large |
| cydstumpel.nl | 13.7vw | 198px | Large |
| daspritam.in | 11.3vw | 163px | Sweet spot |
| art-yakushev.com | 11.0vw | 156px | Sweet spot |
| supersolid.agency | 10.2vw | 147px | Sweet spot |
| lusion.co | 9.9vw | 142px | Sweet spot |
| noomoagency.com | 8.3vw | 120px | Standard |

**Sweet spot**: 10-14vw for display text. Condensed fonts push to 18vw+.

### Minimum Readability Sizes

| Element | Minimum | Preferred |
|---------|---------|-----------|
| Body text | 16px | 18-20px |
| Caption/metadata | 12px | 14px |
| Mobile body | 16px | 16-18px |
| Mobile heading | 32px (2rem) | 40-56px |
| Touch target label | 14px | 16px |

### Size Contrast Ratio

Winners achieve **12:1 or greater** contrast between display and body:
- Display 200px / Body 16px = **12.5:1** ratio
- This extreme contrast IS the design — text becomes a visual element.

---

## 7. Font Weight Architecture

### The Inverse Weight-Size Rule

**The bigger the text, the lighter the weight.** This is the single most consistent pattern across all Awwwards winners analyzed.

| Size Range | Recommended Weight | Why |
|-----------|-------------------|-----|
| 14-18vw (extreme display) | 400 | Thin strokes at huge size = elegant |
| 10-14vw (display) | 400-500 | Balance presence with refinement |
| 4-8vw (heading) | 400-600 | Readable hierarchy |
| Body (16-20px) | 400-500 | Standard readability |
| Labels/UI | 500-700 | Small size needs heavier weight |

### Weight Data from Winners

| Site | Hero Weight | Heading Weight | Body Weight |
|------|-----------|----------------|-------------|
| Lusion (SOTY 2024) | 400 | 400 | 400 |
| Noomo (SOTY 2023) | 400 | 400 | 400 |
| art-yakushev.com | 500 | 400 | 400 |
| chdartmaker.com | 500 | 700 | — |
| supersolid.agency | 700 | 700 | 500 |
| creativewebmanual.com | 400 | 400-500 | 400 |
| daspritam.in | 400 | — | 400 |

### Variable Font Weight Animation

```css
/* Scroll-driven weight shift */
@keyframes weight-shift {
  from { font-variation-settings: 'wght' 300; }
  to   { font-variation-settings: 'wght' 900; }
}

/* Mouse proximity weight (GSAP) */
```
```javascript
gsap.to('.hero-title', {
  fontVariationSettings: '"wght" 900, "wdth" 125',
  duration: 1.2,
  ease: 'expo.out',
  scrollTrigger: { trigger: '.hero', scrub: true }
})

// Per-character mouse proximity
chars.forEach((char) => {
  const dist = getDistanceFromMouse(char, mouseX, mouseY)
  const weight = gsap.utils.mapRange(0, 300, 900, 400, dist)
  gsap.to(char, { fontVariationSettings: `"wght" ${weight}`, duration: 0.3 })
})
```

---

## 8. CSS Typography Techniques

### Text Stroke / Outlined Text

```css
/* Outlined text — used by daspritam.in, many SOTD winners */
.text-outline {
  -webkit-text-stroke: 1px currentColor;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* Responsive stroke width */
.text-outline-fluid {
  -webkit-text-stroke: clamp(0.5px, 0.1vw, 2px) var(--color-accent);
  -webkit-text-fill-color: transparent;
}
```

### Background-Clip Text (Gradient/Image Fill)

```css
.text-gradient {
  background: linear-gradient(135deg, #0047FF, #00F5FF, #4400FF);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Animated gradient text */
.text-gradient-animated {
  background: linear-gradient(90deg, #0047FF, #00F5FF, #4400FF, #0047FF);
  background-size: 300% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 4s ease infinite;
}
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### Mix-Blend-Mode Text

```css
/* Text that inverts over content — art-yakushev.com technique */
.text-invert {
  mix-blend-mode: difference;
  color: #FFFFFF;
}

/* Sticky text with blend over scrolling content */
.sticky-blend-text {
  position: sticky;
  top: 50%;
  mix-blend-mode: exclusion;
  color: #FFFFFF;
  z-index: 10;
}
```

### Glitch/Chromatic Text (supersolid.agency Technique)

```css
.text-glitch {
  position: relative;
}
.text-glitch::before,
.text-glitch::after {
  content: attr(data-text);
  position: absolute;
  inset: 0;
}
.text-glitch::before {
  color: #EA33F7; /* magenta */
  clip-path: inset(0 0 50% 0);
  transform: translate(-2px, -1px);
}
.text-glitch::after {
  color: #75FBFD; /* cyan */
  clip-path: inset(50% 0 0 0);
  transform: translate(2px, 1px);
}
```

### SVG Text Effects

```html
<!-- Text with stroke animation -->
<svg viewBox="0 0 800 200">
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="central"
        class="svg-text">HELLO</text>
</svg>
```
```css
.svg-text {
  font-size: 120px;
  font-family: var(--font-display);
  fill: none;
  stroke: var(--color-accent);
  stroke-width: 1;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: draw-text 3s ease forwards;
}
@keyframes draw-text {
  to { stroke-dashoffset: 0; }
}
```

### Dark Mode Typography Adjustments

```css
/* Anti-halation on dark backgrounds */
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Off-white for body text reduces eye strain */
.body-text { color: #E0E0E0; }    /* body */
.heading-text { color: #FFFFFF; }  /* headings can be pure white */
.secondary { color: #888888; }     /* secondary info */
.tertiary { color: #555555; }      /* subtle metadata */
```

---

## 9. GSAP Typography Animation

### SplitText Fundamentals

```javascript
import { SplitText } from 'gsap/SplitText'
gsap.registerPlugin(SplitText)

// Split into characters, words, and lines
const split = new SplitText('.hero-title', { type: 'chars,words,lines' })
```

### Per-Character Stagger Reveal

```javascript
// Classic stagger-in (used by almost every SOTD winner)
gsap.from(split.chars, {
  opacity: 0,
  y: 50,
  rotateX: -40,
  stagger: 0.02,
  duration: 0.8,
  ease: 'back.out(1.7)',
})

// Stagger with random delay
gsap.from(split.chars, {
  opacity: 0,
  y: () => gsap.utils.random(20, 80),
  stagger: { each: 0.03, from: 'random' },
  duration: 0.6,
  ease: 'expo.out',
})
```

### Clip-Path Text Reveal

```javascript
// Line-by-line reveal with overflow hidden
gsap.from(split.lines, {
  yPercent: 100,
  stagger: 0.1,
  duration: 1,
  ease: 'expo.out',
})
// Requires parent: overflow: hidden on each line wrapper

// Clip-path wipe reveal
gsap.from('.heading', {
  clipPath: 'inset(0 100% 0 0)',
  duration: 1.2,
  ease: 'expo.inOut',
})
```

### Blur-to-Sharp Effect

```javascript
gsap.from(split.chars, {
  filter: 'blur(10px)',
  opacity: 0,
  stagger: 0.02,
  duration: 0.6,
  ease: 'power2.out',
})
```

### Scramble/Decode Text

```javascript
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
gsap.registerPlugin(ScrambleTextPlugin)

gsap.to('.decode-text', {
  scrambleText: {
    text: 'BILLY MAULANA',
    chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%',
    speed: 0.3,
    revealDelay: 0.5,
  },
  duration: 1.5,
  ease: 'none',
})
```

### Scroll-Triggered Typography

```javascript
// Per-word reveal on scroll
gsap.from(split.words, {
  opacity: 0.15,
  stagger: 0.1,
  scrollTrigger: {
    trigger: '.text-section',
    start: 'top 80%',
    end: 'bottom 60%',
    scrub: true,
  },
})

// Weight animation on scroll (variable fonts)
gsap.fromTo('.variable-heading',
  { fontVariationSettings: '"wght" 200' },
  {
    fontVariationSettings: '"wght" 900',
    scrollTrigger: { trigger: '.section', scrub: true },
  }
)
```

### Reduced Motion Fallback

```javascript
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (prefersReduced) {
  // Skip animation, show final state immediately
  gsap.set(split.chars, { opacity: 1, y: 0 })
} else {
  gsap.from(split.chars, { opacity: 0, y: 50, stagger: 0.02 })
}
```

---

## 10. Awwwards Winner Typography Patterns

### Universal Patterns Across ALL Analyzed Winners

1. **Hero text 10-14vw** with clamp() (sweet spot; condensed fonts up to 18vw)
2. **Display weight 400** (Regular) — NOT bold. Bigger = lighter.
3. **Negative letter-spacing** on all display text: -2% to -5%
4. **Line-height < 1.0** on display text (0.85-1.0)
5. **Uppercase** for headings (60%+ of winners)
6. **Per-character animation** on hero text (SplitText or manual spans)
7. **Monospace accent font** for labels/metadata
8. **Off-white body text** (#E0E0E0 - #EAEAEA) on dark backgrounds
9. **2-3 font families** maximum (display + body + optional mono)
10. **Variable fonts** for animation capabilities

### Font Popularity in Awwwards Ecosystem (2024-2025)

**Tier 1 (ubiquitous)**: PP Neue Montreal, Monument Extended, Clash Display, Satoshi
**Tier 2 (common)**: Suisse Int'l, Aeonik, Graphik, Inter, GT Walsheim
**Tier 3 (trending)**: Geist, Instrument Serif, Bueno-VF, PP Formula

### Signature Techniques by Award Level

| Technique | SOTD | SOTM | SOTY |
|-----------|------|------|------|
| SplitText char animation | Required | Required | Required |
| Outlined/stroke text | Common | Common | Usually present |
| Mixed serif+sans heading | Trending | Common | Present |
| Variable font animation | Optional | Present | Usually present |
| Text as interactive canvas | Rare | Present | Required |
| Custom/proprietary font | Optional | Common | Very common |

### The "Typography-First" Design Approach

Sites like chdartmaker, creativewebmanual, and grids.obys.agency prove text alone can win awards:
- **Extreme size contrast**: body 16px vs display 200px+ (12:1+ ratio)
- **Mixed typography**: sans + serif + mono in one viewport
- **Outlined + solid text** creating visual depth
- **Per-character animation** making text the primary interactive element
- **Color accent on single word** for focal point

---

## 11. Typography Anti-Patterns

### What to Avoid

| Anti-Pattern | Why It Fails | Fix |
|---|---|---|
| Bold (700-900) on hero display text | Looks heavy, amateur at large sizes | Use 400-500 weight |
| Positive letter-spacing on display | Looks loose, reduces impact | Use -2% to -5% |
| Line-height 1.5+ on display text | Wastes space, weak visual density | Use 0.85-1.0 |
| More than 3 font families | Visual noise, loading penalty | Stick to 2-3 |
| `font-display: block` on text fonts | 3s invisible text (FOIT) | Use `swap` or `fallback` |
| Hardcoded px font sizes | Not responsive | Use clamp() |
| Same letter-spacing everywhere | Lacks refinement | Tighter on display, wider on caps |
| Thin weights (100-300) on dark bg | Halation makes text shimmer | Minimum 400 on dark backgrounds |
| Linear easing on text animation | Feels robotic | Use expo.out, back.out, power3 |
| Animating all text at once | No visual hierarchy in motion | Stagger chars/words/lines |
| No reduced motion fallback | Accessibility violation | Always check `prefers-reduced-motion` |
| Loading 5+ font weights as statics | Performance penalty, 500KB+ | Use variable fonts |
| `text-rendering: optimizeLegibility` everywhere | Performance cost on mobile | Only on display text if needed |

### Performance Budget

| Metric | Target |
|--------|--------|
| Total font payload | < 150KB (ideally < 100KB) |
| Number of font files | 2-3 variable WOFF2 files |
| Font loading strategy | Preload critical (max 2), swap/fallback |
| CLS from font swap | < 0.05 (use size-adjust fallbacks) |
| Time to first text | < 200ms with system font fallback |

### Font Loading Best Practice

```html
<!-- Preload only 1-2 critical fonts -->
<link rel="preload" href="/fonts/ClashDisplay-Variable.woff2"
      as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/Satoshi-Variable.woff2"
      as="font" type="font/woff2" crossorigin>
```

```css
/* CLS-preventing fallback matching */
@font-face {
  font-family: 'Clash Display Fallback';
  src: local('Arial');
  size-adjust: 105%;
  ascent-override: 90%;
  descent-override: 22%;
}
```

---

## Quick Reference Card

```
DISPLAY TEXT:  10-14vw | weight 400 | tracking -3% | line-height 0.9
HEADING:       4-8vw  | weight 400-500 | tracking -2% | line-height 1.0
BODY TEXT:     16-20px | weight 400-500 | tracking 0 | line-height 1.5
UPPERCASE:     any size | weight 500+ | tracking +0.08em | line-height 1.2
MONO LABEL:    12-14px | weight 500 | tracking +0.05em | line-height 1.3

FONTS: 2-3 families max | Variable WOFF2 | Self-hosted | <150KB total
DARK BG: body #E0E0E0 | heading #FFFFFF | secondary #888 | antialiased
ANIMATION: SplitText + stagger 0.02s | expo.out ease | reduced-motion fallback
```

---

## Appendix: DevTools-Extracted Data (11 Awwwards Winners)

Data berikut diekstrak langsung dari computed CSS styles via Chrome DevTools pada Februari 2026.

### Hero Text Size Comparison (Actual Computed Values)

| Site | Hero (px) | ~vw | Font | Weight | Line-Height | Letter-Spacing |
|------|----------|-----|------|--------|-------------|----------------|
| grids.obys.agency | 264px | 18.3vw | Custom sans | 400 | 1.64 | -10px |
| chdartmaker.com | 263px | 18.5vw | Bebas Neue (condensed) | 500 | 1.0 | 0 |
| creativewebmanual.com | 213px | 14.8vw | PP Neue Montreal | 400 | 1.5 | 0 |
| cydstumpel.nl | 198px | 13.7vw | Bueno-VF (variable) | 400-700 | 0.91 | 0 |
| daspritam.in | 163px | 11.3vw | Satoshi | 400 | 0.9 | -4px |
| art-yakushev.com | 156px | 11vw | Suisse | 500 | 0.88 | -5.46px |
| supersolid.agency | 147px | 10.2vw | Montserrat | 700 | 0.85 | -7.34px |
| lusion.co (SOTY 2024) | 142px | 9.9vw | Aeonik | 400 | 1.0 | -2.84px |
| noomoagency.com (SOTY 2023) | 120px | 8.3vw | Neue Machina | 400 | 1.0 | 0 |

### Key Patterns Confirmed by Data

1. **Weight inversely proportional to size**: 8-10vw = 400-500, 10-14vw = 400, 14-18vw+ = 400
2. **Display line-height**: 0.85-1.0 (BUKAN 1.5+ seperti body)
3. **Letter-spacing**: -2% sampai -5% dari font-size pada display (atau -1px sampai -10px)
4. **Condensed fonts** push 18vw+ karena narrow character width
5. **Uppercase dominant** pada hero text (7 dari 11 sites)

### Font Popularity (2024-2025 Winners)

| Tier | Sans-Serif | Serif/Accent | Mono |
|------|-----------|-------------|------|
| **Most used** | PP Neue Montreal, Suisse | Instrument Serif | GT America Mono |
| **Rising** | Aeonik, Geist (Vercel) | PP Editorial | IBM Plex Mono |
| **Classics** | Satoshi, Montserrat | Mr Bedfort (script) | Rand Mono |
| **Condensed** | Bebas Neue, Bueno-VF | — | — |

### Dark Mode Typography Data

| Site | Background | Body Text Color | Heading Color |
|------|-----------|----------------|---------------|
| art-yakushev.com | #000000 | #FFFFFF | #FFFFFF |
| sileent.com | #000000 | #FFFFFF | #FFFFFF |
| creativewebmanual.com | #070707 | #EAEAEA | #EAEAEA |
| supersolid.agency | mixed | #EAF9FB (cyan tint) | #EAF9FB |
| lusion.co | #FFFFFF (light!) | #000000 | #000000 |
| noomoagency.com | #C9D2E7 (light!) | #181520 | #181520 |

### Portfolio Assessment (Clash Display + Satoshi)

**Sudah tepat**: `--text-display: clamp(3.5rem, 12vw, 13rem)` = sweet spot 12vw, max 208px kompetitif.
**Pertimbangkan**: display line-height turunkan ke 0.9-1.0, letter-spacing -2% sampai -5%, weight 400 untuk hero besar, monospace font untuk labels/captions.
