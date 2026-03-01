# Layout Composition — Awwwards-Level Spatial Design

Practical reference for composition, layout patterns, depth systems, and spatial storytelling. Every spatial decision should serve narrative and feeling, not just aesthetics.

> Content dictates layout. Start from what the visitor should *feel*, then choose spatial logic that supports it.

---

## 1. Composition Theory

| System | Ratio | Use Case |
|--------|-------|----------|
| Golden Ratio | 1:1.618 (61.8%/38.2%) | Hero split, grid columns, text width |
| Rule of Thirds | 33.3%/66.7% | Focal point placement, axis lines |
| Fibonacci Spacing | 8, 13, 21, 34, 55, 89px | Padding increments, staircase indent |

**Visual Weight & Balance**:
- **Symmetric**: Centered monumental heroes — formal, confident
- **Asymmetric**: Counter-position, staircase indent — dynamic, editorial
- **Tension**: Intentional imbalance — one heavy element offset by whitespace
- Weight factors (descending): Size > color saturation > isolation > position (top-left heaviest)

---

## 2. Hero Section Patterns

### 2A. Centered Monumental

Display font 8-13rem centered. Nothing competes. Requires dramatic typography (weight 700+, >10vw). Sites: chdartmaker.com, grids.obys.agency, art-yakushev.com

```css
.hero-centered { height: 100dvh; display: grid; place-items: center; }
.hero-centered__title {
  font-size: clamp(4rem, 12vw, 13rem);
  font-weight: 700; line-height: 0.9; letter-spacing: -0.04em;
}
```

### 2B. Staircase Indent

Multi-line heading with progressive indent. Creates diagonal reading flow. Most versatile pattern.
Sites: eseagency.ch, creativewebmanual.com, supersolid.agency

```css
.line:nth-child(1) { padding-left: 0; }
.line:nth-child(2) { padding-left: 8%; }    /* Fibonacci progression */
.line:nth-child(3) { padding-left: 20%; }
.line:nth-child(4) { padding-left: 38%; }
```

Accent technique: alternate weight/style (bold vs light, italic) or color within lines. Subtitle aligns with last staircase line.

### 2C. Counter-Position (Swiss Asymmetric)

Text one side, visual/descriptor other. Golden ratio split. Creates horizontal "ping-pong" tension.
Sites: vitalinabender.com, kaitonote.com

```css
.hero-counter { display: grid; grid-template-columns: 1.618fr 1fr; align-items: center; }
```

**Rule**: Elements MUST share visual relationship (baseline alignment, horizontal axis, or connecting line).

### 2D. Overlapping Layers

All elements share same grid cell (`grid-area: 1/1`), controlled by z-index. Text over media.
Sites: daspritam.in, latchezarboyadjiev.com, kota.co.uk

```css
.hero-overlap { display: grid; grid-template: "stack" 1fr / 1fr; }
.hero-overlap > * { grid-area: stack; }
/* Use mix-blend-mode: difference for auto-readable text */
```

### 2E. Full-Bleed Media

Video/image full viewport. Minimal text overlay. Max first impression, readability risk.
Sites: leeroy.ca, rejouice.com

### 2F. Split Screen

Two panels (50/50), independent content. Hover shifts ratio (60/40). Mobile: stack.
Sites: studiobauhaus.eu

### 2G. Typography-Only

Zero images. Text IS design. Weight contrast 900 vs 100 in one composition.
Sites: chdartmaker.com, bluxstudio.com, synchronized.studio

### 2H. 3D/WebGL Hero

Canvas background + minimal text overlay. Mouse controls scene. Mobile: static poster fallback.
Sites: azizkhaldi.com, jesseermens.nl, kfadv.it

### 2I. Scroll-Into (Evolving) Hero

Pinned 200-400vh, content evolves through 3-5 phases. GSAP ScrollTrigger `pin: true` + `scrub`.
Sites: Igloo Inc (SOTY 2024), 15th.plus-ex.com, timrijkse.nl

### 2J. Cinematic Framing

Letterbox aspect ratio (2.39:1). Content framed like film still. Top/bottom space creates focus band.

---

## 3. Section Composition Patterns

### About/Bio

| Pattern | Layout | Best For |
|---------|--------|----------|
| Two-Column Photo+Text | `38.2fr 61.8fr` grid | Portfolio with portrait |
| Single Column Prose | Centered, max-width 740px | Intimate editorial |
| Stats/Numbers Grid | 4-col grid, large numbers + counter anim | Credentials (7+ years, 80M users) |
| Full-Width Statement | Big sentence + offset supporting text | Manifesto/philosophy |
| Scroll-Revealed Words | Per-word opacity 0.12→1.0 on scroll | High-impact statement |

### Project Showcase

| Pattern | Best For |
|---------|----------|
| Case Study Cards (2x2/3-col grid) | Standard project grid |
| Horizontal Scroll Gallery (pinned) | Visual-heavy work |
| Stacked Full-Width (each=100vh) | Max per-project impact |
| Bento Grid (mixed spans, `grid-auto-flow: dense`) | Visual hierarchy in layout |
| Numbered List + Hover Preview | Editorial sophistication |
| Featured Hero + Supporting Grid | Clear project hierarchy |

### CTA / Contact

| Pattern | Description |
|---------|-------------|
| Full-Screen Big Type | "Let's work together" at 10vw+, magnetic hover |
| Conversational Form | Large inputs, labels as headings, step-by-step |
| Minimal Email | Email at display size, centered |

---

## 4. Depth Layering System

| Layer | Z-Index | Content | Opacity | pointer-events |
|-------|---------|---------|---------|----------------|
| Background | 0-1 | Fluid sim, video, color | Full | none |
| Atmosphere | 2-3 | Gradient orbs, glow, fog, axis lines | 3-8% | none |
| Ghost | 3-5 | Section numbers, watermarks | 4-8% | none |
| Content | 10 | Text, buttons, images | Full | auto |
| Overlay | 50+ | Noise texture, film grain | 2-5% | none |
| Nav/Cursor/Preloader | 100/200/300 | UI chrome | Full | auto |

### Atmospheric Elements

```css
.glow {
  width: clamp(300px, 40vw, 800px); aspect-ratio: 1;
  background: radial-gradient(circle, rgba(0,71,255,0.08) 0%, transparent 70%);
  filter: blur(80px); pointer-events: none;
}
.ghost-num {
  font-size: clamp(4rem, 8vw, 10rem); font-weight: 700;
  color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.06);
}
```

### Parallax Depth Speeds

| Layer | Scroll Speed | GSAP yPercent Multiplier |
|-------|-------------|-------------------------|
| Background | 0.3x | 70 |
| Atmosphere | 0.5x | 50 |
| Ghost | 0.7x | 30 |
| Content | 1.0x | 0 |

### Blur Depth-of-Field

```css
.depth-bg  { filter: blur(clamp(4px, 1vw, 8px)); opacity: 0.3; }
.depth-mid { filter: blur(2px); opacity: 0.6; }
.depth-fg  { filter: blur(0); opacity: 1; }
```

---

## 5. Editorial Grid Details

### Corner Labels

Monospace, caption size, tertiary color, `letter-spacing: 0.25em`, `text-transform: uppercase`, `mix-blend-mode: difference`, `pointer-events: none`. Content: coordinates, section numbers, timestamps.

### Axis Lines

```css
.axis-vertical {
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(255,255,255,0.06) 50%, transparent);
}
```

Position at golden ratio (61.8%), center (50%), or thirds (33.3%/66.7%). Max 6% opacity.

### Section Numbering

1. **Inline label**: `01 / ABOUT` — common
2. **Ghost watermark**: Large text-stroke in depth layer
3. **Counter animation**: Numbers morph on scroll — highest effort

---

## 6. Scroll Composition

### Page Flow

```
PRELOADER → HERO → MANIFESTO → ABOUT → PROJECTS → SKILLS/MARQUEE → CTA → FOOTER
```

Sweet spot: 6-8 sections. Below 5 = thin, above 10 = fatigue.

### Rhythm: Dense/Sparse Alternation

```
HERO      → DENSE    ABOUT     → DENSE    MARQUEE   → SPARSE
MANIFESTO → SPARSE   PROJECTS  → DENSE    CTA       → SPARSE
```

### Section Transitions

| Technique | Method |
|-----------|--------|
| Overlapping reveal | Pin previous, scale 0.95 + blur, next slides over |
| Curtain clip-path | `clipPath: inset(100% 0 0 0)` → `inset(0)` |
| Focus pull | `blur(10px)` → `blur(0)` (cinematic) |
| Color morph | CSS variable transition between sections |
| Pinned content swap | Section pinned, content crossfades via GSAP scrub + snap |
| Horizontal scroll | Pinned, vertical scroll → horizontal xPercent |

### Breathing Sections

Minimal-content pauses between dense sections. Single accent line, ghost number, or atmospheric element. `min-height: 50vh; display: grid; place-items: center;`

---

## 7. Negative Space

1. Negative space is **active design**, not emptiness
2. More space = more premium (luxury brands: 60%+ whitespace)
3. Must be **proportional** — Fibonacci/golden ratio
4. Content blocks need generous `clamp()` breathing room

```css
--section-gap: clamp(5rem, 15vh, 12rem);
--content-breathing: clamp(2rem, 5vh, 4rem);
--subtitle-offset: clamp(2rem, 5vh, 3.5rem);
```

Analogy: silence in music. Without it, everything becomes noise.

---

## 8. Footer Composition

| Pattern | When to Use |
|---------|-------------|
| Large Typography (email at display size) | Confident, minimal portfolio |
| Marquee Ticker (infinite text-stroke loop) | Kinetic contrast to static page |
| Footer Reveal (fixed, revealed on scroll) | Cinematic ending |
| 3-Column Grid (`2fr 1fr 1fr`) | Information-rich |
| Full-Screen Contact (100vh CTA) | Agency/freelancer |
| Credits Style (monospace, roles) | Cinematic feel |
| Time/Location ("Jakarta / 14:32 / Available") | Human-presence warmth |

### Marquee Implementation

```css
.marquee__track { display: flex; width: max-content; animation: marquee 20s linear infinite; }
.marquee__text {
  font-size: clamp(3rem, 8vw, 10rem); font-weight: 800; white-space: nowrap;
  color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.15);
}
@keyframes marquee { to { transform: translateX(-50%); } }
```

---

## 9. Bottom Bar Patterns

### Hero Bottom Bar

```css
.hero-bottom { display: grid; grid-template-columns: 1fr auto 1fr; align-items: end; }
/* Left: meta | Center: year | Right: scroll indicator (justify-self: end) */
```

Mobile: 2-column (meta + scroll), center hidden.

### Persistent Bars

- **CTA bar**: Fixed bottom, appears after scroll past hero
- **Progress bar**: Thin line showing scroll %
- **Back-to-top**: Circle button, shown via ScrollTrigger

---

## 10. Responsive Layout Strategy

### Breakpoints

| Size | Behavior |
|------|----------|
| >1440px | Full editorial: all decorative elements, generous space |
| 1024-1440px | Proportional scale-down, everything visible |
| 768-1024px | Hide axis lines, reduce ghost text |
| 480-768px | Single-column, remove decorative layers |
| <480px | Content-only: name + subtitle + CTA |

### Element Removal Priority (first removed → last)

Axis lines → Ghost numbers → Corner labels → Bottom bar center → Atmospheric gradient (resize) → Subtitle (simplify) → Name (NEVER hidden)

### Pattern Suitability

| Pattern | Desktop | Tablet | Mobile |
|---------|---------|--------|--------|
| Centered Monumental | Excellent | Excellent | Good |
| Staircase Indent | Excellent | Reduce indent | Remove indent |
| Counter-Position | Excellent | Good | Stack vertically |
| Typography-Only | Excellent | Excellent | Excellent |
| 3D/WebGL | Excellent | Reduced | Static fallback |
| Bento Grid | Excellent | Fewer columns | Single column |

### Touch Adaptations

```css
@media (hover: none) and (pointer: coarse) {
  /* Show text always, disable custom cursor, use :active states */
}
```

Safe areas: `padding-top: max(1.5rem, env(safe-area-inset-top));`

---

## 11. Layout Anti-Patterns

| Mistake | Fix |
|---------|-----|
| Everything left-aligned | Indent/offset at least one element |
| Subtitle full right-aligned | Use staircase indent (padding-left) |
| Decorative elements blocking clicks | Always `pointer-events: none` |
| Axis lines too visible | Max 6% opacity, gradient fade |
| Ghost text competing with content | Max 6-8% stroke opacity, z < content |
| Same layout every section | Vary: asymmetric → centered → offset |
| Glow overlapping text readability | z-index: glow(2-3) < content(10) |
| No responsive simplification | Progressive removal per breakpoint |
| Animating width/height/margin | Use transform + opacity only |
| Linear easing everywhere | expo.out, power4.out, back.out |
| `will-change` on everything | Apply only before animation, remove after |

### Animation Performance Tiers

| Tier | Properties |
|------|-----------|
| **S** (compositor) | `transform`, `opacity` — always 60fps |
| **A** (no layout) | `filter`, `clip-path`, `background-color` |
| **B** (GSAP FLIP) | Measure once, animate S-tier |
| **D** (layout reflow) | `width`, `height`, `margin` — avoid animating |

---

## Advanced CSS Grid

### Full-Bleed Within Grid

```css
.layout {
  display: grid;
  grid-template-columns:
    [full-start] var(--page-margin) [wide-start] 1fr
    [content-start] min(65ch, 100%) [content-end]
    1fr [wide-end] var(--page-margin) [full-end];
}
.layout > * { grid-column: content; }
.layout > .full-bleed { grid-column: full; }
```

### Grid Animation (Hover Expand)

Use individual column values (not `repeat()`) for smooth transitions:

```css
.grid { grid-template-columns: 1fr 1fr 1fr 1fr; transition: grid-template-columns 0.6s; }
.grid:has(.item:nth-child(1):hover) { grid-template-columns: 3fr 1fr 1fr 1fr; }
```

### Subgrid (97%+ support)

```css
.card { display: grid; grid-template-rows: subgrid; grid-row: span 4; }
```

### Container Queries

```css
.wrapper { container-type: inline-size; }
@container (min-width: 500px) { .card { grid-template-columns: 1fr 1fr; } }
```

### Performance CSS

```css
.section:not(.hero) { content-visibility: auto; contain-intrinsic-size: auto 100vh; }
.section { contain: layout style paint; }
```

---

## SOTD/SOTY Meta-Patterns

1. **Intentional composition** — every spatial decision has a reason; grid violations deliberate
2. **Typography IS the design** — type-first hero carrying visual weight
3. **Depth and layering** — flat = average; depth via parallax, z-stacking, atmospherics
4. **Narrative scroll** — preloader=opening, hero=title, sections=chapters, footer=credits
5. **Grid as invisible architecture** — felt but not seen; 80% discipline, 20% drama
6. **Micro-randomness** — variation on reload, non-uniform timing, organic feel
7. **Extreme small-detail craft** — easing curves, custom cursors, "expensive" hover states
8. **Performance-aware creativity** — 60fps, progressive enhancement, reduced motion fallbacks
