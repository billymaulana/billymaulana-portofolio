# Comprehensive Taste Design Profile — Billy Maulana

Dokumen ini adalah kompilasi LENGKAP dari seluruh data teknis yang diekstrak dari 62 reference websites.
Data ini menjadi sumber kebenaran untuk keputusan desain: font, warna, grid, motion, effect, dan interaction.

**Terakhir diupdate**: 2026-02-26
**Total references analyzed**: 62 (10 main + 46 partial + 6 educational)
**Sites deep-scraped for technical data**: 20

---

## 1. TYPOGRAPHY DNA

### 1.1 Font Families Teridentifikasi (dari HTML/CSS extraction)

#### Display/Headline Fonts (Condensed & Bold)
| Font | Site | Tipe | Weight | Catatan |
|------|------|------|--------|---------|
| **BebasNeue** | chdartmaker | Condensed sans-serif | 400 (regular only) | Hero 267px, 22.2vw. Extreme condensed = lebih banyak huruf di viewport |
| **Suisse Intl** | art-yakushev | Neo-grotesque sans | 500 (Medium) | Webflow self-hosted. Primary display. Clean Swiss heritage |
| **Anton** | nakula | Condensed sans-serif | 400 | Google Font. Ultra-condensed bold. Hero split-screen |
| **Clash Display** | porto | Display sans-serif | 400-700 | Indian Type Foundry. Geometric, bold. Hero "GREYO" viewport-filling |
| **Mona Sans** | bravestudio | Variable sans-serif | 400-900 | GitHub's open-source font. Counter-positioned hero |
| **Aspekta Variable** | mobius | Variable sans-serif | 100-1000 | Variable weight, rounded terminals. Hero "Mobius" |
| **Inter Display** | palmer, porto, mobius | Display sans-serif | 400-700 | Optical size variant of Inter. Large headings |
| **Inter Tight** | fieldtheory | Condensed sans-serif | 300-700 | Condensed variant. Hero "FIELD THEORY" |
| **Utara Variable** | minoarea | Variable display | 400-1000 | Hero "MINO AREA" glass text |
| **Host Grotesk** | creativeagency | Grotesque sans | 400-900 | Display. Hero "CREATIVE STUDIO" |
| **Maximanouva** | latchezar | Custom display | 700 | Webflow custom font. 216px hero |
| **Joyride Alt** | supersolid | Rounded display | — | Playful rounded hero wordmark |
| **PP Neue Montreal** | sileent | Neo-grotesque | 500 (Medium) | Pangram Pangram. `<link rel="preload">` (most performant loading). Clean, editorial |
| **Bodoni Moda SC** | junji | Serif display | variable (opsz 6-96) | Google Font. Small caps. Brutalist-premium |
| **Six Caps** | junji | Condensed display | 400 | Google Font. Ultra-condensed uppercase. Secondary display |
| **Limelight** | junji | Decorative display | 400 | Google Font. Art Deco inspired |

#### Body/Text Fonts (Sans-Serif)
| Font | Site | Tipe | Weight | Catatan |
|------|------|------|--------|---------|
| **Inter** | 12+ sites | System sans-serif | 400-700 | Default Framer font. Paling umum untuk body text |
| **Geist** | creativeagency, nakula, optunex | Neo-grotesque | 400-900 | Vercel's font. Clean, modern, tech aesthetic |
| **Satoshi** | daspritam, fieldtheory | Geometric sans | 400 (Regular) | Indian Type Foundry. Weight 400 only — "effortless" feel. Portfolio Billy juga pakai |
| **Kumbh Sans** | kaitonote | Geometric sans | 300 (Light) | Google Font. Weight 300 (Light!) untuk headline = elegant, bukan weak |
| **Okomito** | chdartmaker | Geometric sans | 500, 700 | Body text + expertises 100px. Aggressive -4px tracking |
| **Instrument Sans** | nivora | Humanist sans | 400-700 | Google Font. Clean, modern |
| **Manrope** | minoarea | Geometric sans | 400-1000 | Variable. Body text dan labels |
| **Montserrat** | supersolid | Geometric sans | 100-900 | Google Font. Body headings 700 |

#### Accent/Specialty Fonts
| Font | Site | Tipe | Purpose |
|------|------|------|---------|
| **Apparel** | art-yakushev | Italic serif | Serif accent words — "Yakushev". Paired with Suisse Intl 500 |
| **Noto Serif Display** | kaitonote | Serif italic | Programmatic `wrapSpecificText()` — "Digital", "For", "and" |
| **Playfair Display** | optunex | Serif display | Italic accent "of marketing" |
| **Noto Serif Balinese** | nivora | Decorative serif | Cultural accent |
| **Fragment Mono** | fieldtheory, bravestudio, minoarea, nivora | Monospace | Labels, metadata, technical text |
| **GT America Mono** | sileent | Monospace | Monospace accent, labels |
| **DM Sans** | junji | Geometric sans | Google Font. Body text. Clean, modern |
| **Plus Jakarta Sans** | kaitonote | Geometric sans | Secondary body text |
| **Zen Kaku Gothic New** | kaitonote | Japanese sans | Japanese text support |
| **Mono** (custom) | daspritam | Monospace | Custom self-hosted. Technical labels |

### 1.2 Font Pairing Patterns

| Pattern | Contoh | Frequency |
|---------|--------|-----------|
| **Condensed display + Geometric body** | BebasNeue + Okomito (chdartmaker), Anton + Geist (nakula) | 5 sites |
| **Display sans + Body sans (same family)** | Inter Display + Inter (palmer, porto, mobius) | 3 sites |
| **Grotesque display + System body** | Host Grotesk + Inter (creativeagency), Mona Sans + Inter (bravestudio) | 4 sites |
| **Display + Serif italic accent** | Suisse + Apparel (art-yakushev), Kumbh + Noto Serif (kaitonote), Geist + Playfair (optunex) | 3 sites |
| **Display + Monospace label** | Mona Sans + Fragment Mono (bravestudio), Inter Tight + Fragment Mono (fieldtheory) | 4 sites |
| **Variable display solo** | Aspekta Variable (mobius), Utara Variable (minoarea) | 2 sites |

### 1.3 Font Size Hierarchy (Extracted from CSS)

| Tier | Size Range | Usage | Key Examples |
|------|-----------|-------|--------------|
| **XXL Hero** | 200-450px / 18-22vw | Viewport-filling hero text | chdartmaker 22.2vw, palmer 453px, porto 397px, mobius 325px |
| **XL Display** | 100-200px | Section headers, manifesto | kaitonote 200rem, chdartmaker 20rem, nakula 140px |
| **L Heading** | 60-100px | Section titles | chdartmaker 10rem, nakula 100px, nivora 96px |
| **M Subheading** | 40-60px | Sub-sections | creativeagency 48-56px, minoarea 52px |
| **S Body** | 16-24px | Body text, descriptions | Semua sites |
| **XS Label** | 12-14px | Labels, metadata, captions | nakula 12px, porto 13px |

### 1.4 Letter-Spacing Values

| Range | Usage | Key Examples |
|-------|-------|--------------|
| **-0.05em to -0.07em** | Display headlines (extreme tight) | nakula -0.06em, -0.07em |
| **-0.03em to -0.04em** | Headlines | creativeagency -0.04em, chdartmaker -0.04em |
| **-0.02em** | Subheadings | art-yakushev -0.035em, fieldtheory -0.02em |
| **-4px to -8px** | Large display (absolute) | palmer -4px, -6px, -8px, -21.47px(!), bravestudio -5px |
| **0 to 0.02em** | Body text | Neutral spacing |
| **0.05em+** | Labels, uppercase small text | supersolid 0.0555em |

### 1.5 Font Weight Distribution

| Weight | Usage | Frequency |
|--------|-------|-----------|
| **100-200** | Ultra-light, decorative | Rare — kaitonote, supersolid |
| **300** | Light headlines (elegant, bukan weak) | kaitonote hero, fieldtheory |
| **400** | Body text, regular | Universal |
| **500** | Medium, subheadings | 15+ sites |
| **600** | Semi-bold, buttons | 10+ sites |
| **700** | Bold headlines | 15+ sites |
| **800-900** | Extra-bold, hero display | creativeagency, nakula, bravestudio |
| **1000** | Black/Ultra-bold | mobius (Aspekta Variable), minoarea (Manrope/Utara) |

### 1.6 Font Loading Methods (dari agent analysis)

| Method | Site | Technique | Performance |
|--------|------|-----------|-------------|
| **@font-face self-hosted** | Semua Framer sites | Framer CDN woff2 + `font-display: swap` | Standard. FOUT minimal |
| **Google Fonts** | junji (11 families), kaitonote, nakula | `<link>` preconnect + stylesheet | Convenient, tapi 11 families = heavy |
| **`<link rel="preload">`** | sileent | Preload PP Neue Montreal woff2 before render | Most performant. Zero FOUT |
| **Webflow custom font** | art-yakushev, latchezar | Self-hosted via Webflow CDN | Clean, fast |
| **Variable font single file** | mobius, minoarea, bravestudio | One woff2 covers all weights (100-1000) | Optimal — single request, all weights |

**Rekomendasi untuk Billy's Portfolio**: Variable font (single woff2) + `<link rel="preload">` = fastest possible. Self-host, jangan Google Fonts.

### 1.7 Billy's Typography Identity (Synthesis)

```
HERO: Extreme condensed bold (200-450px / 18-22vw)
      Letter-spacing: -0.04em to -0.07em
      Uppercase, viewport-filling

BODY: Geometric sans (Satoshi/Geist/Inter)
      16-18px, weight 400-500
      Letter-spacing: 0 to -0.02em

ACCENT: Italic serif for specific words (Apparel/Noto Serif/Cormorant)
        Monospace for labels/metadata (Fragment Mono)

PAIRING: Condensed display + Geometric body + Serif italic accent
         3 personality contrast: BOLD + CLEAN + ELEGANT
```

---

## 2. COLOR DNA

### 2.1 Background Colors

| Color | Hex/RGB | Site | Usage |
|-------|---------|------|-------|
| **Pure black** | `#000000` / `rgb(0,0,0)` | chdartmaker, bravestudio, palmer, nakula | Maximum contrast hero |
| **Near-black** | `#0a0a0a` / `rgb(10,10,10)` | nakula, porto | Portfolio Billy's `$bg-primary` |
| **Dark gray** | `#0f0f0f` - `#161616` | minoarea, porto | Subtle lift dari pure black |
| **Deep indigo** | `#0f0a72` | kaitonote | Gradient orb start color |
| **Dark teal** | `#1A2E3B` | art-yakushev, palmer | Dark cinematic blue-green |
| **Warm dark** | `#080a07` / `#090909` | creativeagency | Dark dengan warm undertone |

### 2.2 Primary Accent Colors (Blue Family — PALING DISUKAI)

| Color | Hex/RGB | Site | Usage |
|-------|---------|------|-------|
| **Electric blue** | `#0047FF` | Portfolio Billy | Identity primary |
| **Vibrant blue** | `#0166c9` | kaitonote | Gradient mid-point |
| **Light cyan** | `#a1e0e7` | kaitonote | Gradient end-point |
| **Blue accent** | `#0099ff` / `rgb(0,153,255)` | creativeagency, fieldtheory, bravestudio, nakula, porto, mobius, nivora, optunex | Framer default accent — muncul di 8+ sites |
| **Deep indigo** | `#0f0a72` | kaitonote | Gradient start |
| **Purple-blue** | `#7468fc` / `rgb(116,104,252)` | optunex | 3D glass sphere accent |
| **Blue-indigo** | `#110fdf` / `rgb(17,15,223)` | optunex | Deep blue accent |
| **Soft blue** | `rgb(77,101,255)` | latchezar | Button color overlay |
| **Blue tint** | `rgb(209,224,255)` | optunex | Light blue accent |

### 2.3 Secondary Accent Colors

| Color | Hex/RGB | Site | Usage |
|-------|---------|------|-------|
| **Vibrant red-orange** | `#FF4A25` / `#ff4925` | nakula | Split-screen accent panel |
| **Red** | `rgb(255,5,5)` - `rgb(255,50,50)` | daspritam | Fluid simulation red channel |
| **Pink-red** | `rgb(255,172,172)` | daspritam | Light fluid tint |
| **Neon red** | `#f24` / `#f51414` | fieldtheory | Vibrant warm accent |
| **Amber/gold** | `rgb(255,194,51)` | bravestudio | Gold text accent |
| **Warm amber** | `#a58f69` / `#c4b59c` | creativewebmanual | Warm swiss grid accent |
| **Green (AVOID)** | `#83ca16` / `#c1f12a` / `rgb(193,241,42)` | nivora | User TIDAK suka hijau dominant |
| **Neon green (AVOID)** | `rgb(140,255,150)` / `#8cff96` | mobius | Accent only, bukan background |

### 2.4 Neutral/Text Colors

| Color | Hex/RGB | Usage |
|-------|---------|-------|
| **Pure white** | `#ffffff` / `rgb(255,255,255)` | Primary text on dark |
| **Off-white** | `#ededed` / `rgb(237,237,237)` | Latchezar hero text (bukan pure white) |
| **Light gray** | `#d9d9d9` / `rgb(196,196,196)` - `rgb(202,202,202)` | Secondary text |
| **Mid gray** | `#858585` / `rgb(136,136,136)` | Tertiary text, captions |
| **Dark gray** | `#333` - `#555` | Subtle text elements |
| **Ghost gray** | `rgb(102,102,102)` / `#666666` | Ghost text, disabled states |

### 2.5 Gradient Palettes

| Gradient | Colors | Site | Teknik |
|----------|--------|------|--------|
| **Indigo→Blue→Cyan tri-tone** | `#0f0a72` → `#0166c9` → `#a1e0e7` | kaitonote | JPG gradient orb, bukan shader |
| **Red→Pink fluid** | `rgb(255,5,5)` → `rgb(255,172,172)` | daspritam | WebGL fluid sim |
| **Black→Gray cinematic** | `#000` → `rgb(132,132,132)` | chdartmaker | Monochrome silver |
| **Dark→Blue atmospheric** | `#080a07` → blue glow | creativeagency | Cinematic underwater |
| **Warm amber→cream** | `#a58f69` → `#eee2cd` → `#fbf6c0` | creativewebmanual | Swiss grid warm |

### 2.6 Color Usage Rules (dari preferensi)

```
BACKGROUND: #0a0a0a (near-black, BUKAN pure black)
            atau #000000 untuk maximum contrast

PRIMARY ACCENT: #0047FF (electric blue) — identity
                #0166c9 (vibrant blue) — depth
                #0f0a72 (deep indigo) — foundation
                #a1e0e7 (light cyan) — highlight

SECONDARY ACCENT: Gold/amber untuk premium sections
                  Red-orange untuk vibrant energy

TEXT: #ffffff (primary), #ededed (large display),
      #858585 (secondary), #666 (ghost)

BLEND COLORS: White text + blend:difference = prismatic
              White text + blend:luminosity = silver

BANNED: Pastel/muted, hijau dominant, kuning/orange background,
        pudar/washed-out, white backgrounds
```

---

## 3. MIX-BLEND-MODE DNA

### 3.1 Blend Mode Strategies Teridentifikasi

| Mode | Site | Element | Effect |
|------|------|---------|--------|
| **difference** | art-yakushev | `.hero-wrap` over video | Prismatic color inversion |
| **difference** | chdartmaker | `.o-heroHome_largeHeader` sticky | Auto-invert scroll through sections |
| **difference** | kaitonote | Cloned text, ghost shadow | Depth tanpa CSS shadow |
| **difference** | supersolid | Fixed nav, z:200 | Auto-invert nav |
| **difference** | skizophonic | Hero, logo, button | Cohesive visual language |
| **difference** | creativeagency | Multiple elements | Hero text blending |
| **difference** | fieldtheory | Elements | Text over vibrant photo |
| **difference** | bravestudio | Elements | Hero contrast |
| **difference** | palmer | Elements | Section contrast |
| **difference** | nakula | Elements | Contrast management |
| **difference** | porto | Elements | Text contrast |
| **difference** | mobius | Elements | Section contrast |
| **difference** | nivora | Elements | Section contrast |
| **difference** | minoarea | Elements | Glass text effect |
| **luminosity** | latchezar | `.hero-heading-wrapper` | Silver/prismatic — text brightness stays, chrominance from video |
| **color-burn** | kaitonote | Overlay layers (2x) | Warm tonal richness depth |
| **color** | latchezar | Button overlays | Blue tint injection |
| **overlay** | creativeagency | Elements | Depth enhancement |
| **exclusion** | nivora | Elements | Color inversion variant |
| **lighten** | mobius | Elements | Light blending |

### 3.2 Blend Strategy System (Rekomendasi)

```
HERO TEXT:       mix-blend-mode: luminosity (silver/prismatic)
                 ATAU difference (auto-invert)
NAV (fixed):     mix-blend-mode: difference (auto-invert semua section)
GHOST TEXT:      mix-blend-mode: difference (cloned shadow layer)
OVERLAY:         mix-blend-mode: color-burn (warm depth)
BUTTONS:         mix-blend-mode: color (brand accent injection)
```

---

## 4. LAYOUT & GRID DNA

### 4.1 Hero Layout Patterns

| Pattern | Sites | Composition |
|---------|-------|-------------|
| **Viewport-filling typography** | chdartmaker, fieldtheory, porto, nakula, mobius, palmer, bravestudio | Text = hero. 80-100vw width, 200-450px |
| **Counter-positioned dual** | latchezar, bravestudio, chdartmaker | Nama left + nama right = diagonal tension |
| **Split-screen** | nakula | Dark panel (brand) + vibrant panel (accent) |
| **Photo bleed + text overlay** | fieldtheory, bravestudio, minoarea | Full-bleed foto, text di atas |
| **Grid metadata** | palmer, porto, creativeagency | Copyright + serial number + role labels per section |
| **Swiss grid structured** | creativeagency, creativewebmanual, grids.obys | Grid-driven hero composition |
| **3D object centrepiece** | optunex | Glass sphere sebagai focal point |
| **Fluid/liquid background** | daspritam | WebGL canvas fixed di belakang text |

### 4.2 Section Layout Variations

| Section Tipe | Layout Pattern | Sites |
|-------------|---------------|-------|
| **About/Manifesto** | Large center-aligned text, generous whitespace | kaitonote (53px w300), art-yakushev |
| **Services** | Numbered grid (01-04), thin object sidebar | kaitonote (Lottie), bravestudio (001-003) |
| **Projects/Works** | Asymmetric cards, numbered indexing (00-1, 00-2) | art-yakushev, nakula |
| **Evolution/Process** | Numbered typography grid + stacked display | bravestudio (Through Design) |
| **Footer** | Marquee text + line accents + circular narrative | bravestudio, nivora, art-yakushev |
| **Awards/Recognition** | Premium typography on dark, serif accent | synchronized.studio |

### 4.3 Grid System Details

| System | Sites | Implementation |
|--------|-------|----------------|
| **Swiss/Van de Graaf** | creativewebmanual, grids.obys, kaitonote | Proportional margins, golden ratio |
| **Framer CSS Grid** | Semua Framer sites | CSS Grid auto-layout |
| **Asymmetric 2-column** | art-yakushev, latchezar | Content-driven, bukan 50/50 |
| **Metadata grid per section** | palmer | Copyright + Japanese + serial + role |
| **Bento grid** | — | Tidak ditemukan di references user |

### 4.4 Spacing & Proportion

| Aspect | Value | Source |
|--------|-------|--------|
| **Section padding** | 80-160px vertical | Varies per section identity |
| **Grid gap** | 16-32px | Standard |
| **Hero margin** | 20-40px horizontal | Breathing room |
| **Negative space** | Generous — minimal section = crowded = bad | Anti-pattern: "grid mepet" |
| **Line height display** | 0.9-1.0 | Tight for display text |
| **Line height body** | 1.5-1.75 | Comfortable reading |

---

## 5. MOTION DNA

### 5.1 Easing Hierarchy

| Easing | Usage | Dominance |
|--------|-------|-----------|
| **expo.inOut** | Intro/exit sequences, hero entrance | DOMINANT — art-yakushev, kaitonote |
| **power3/power4.out** | Reveals, scroll entrances | SECONDARY — skizophonic, kaitonote |
| **expo.out** | Scatter, explosive reveals | TERTIARY — kaitonote work scatter |
| **CustomEase** | Signature intro, bespoke curves | PREMIUM — kaitonote (2 custom curves) |
| **outQuad** | Per-letter entrance (anime.js) | chdartmaker specific |
| **back.out** | Overshoot, bouncy | skizophonic circles |
| **"0.16, 1, 0.35, 1"** | Custom cubic-bezier | supersolid secondary |
| **"0.25, 1, 0.5, 1"** | Preloader cubic-bezier | supersolid primary |
| **BANNED: linear, ease, power1, swing** | Generic, lifeless | — |

### 5.2 Duration & Stagger Values

| Animation | Duration | Stagger | Source |
|-----------|----------|---------|--------|
| **Cinematic intro** | 5-8s total | — | art-yakushev 6-7s, kaitonote 7s |
| **Logo entrance** | 2-3s | — | art-yakushev 2s blur+scale |
| **Hero text chars** | 1.5-2.5s | 0.02-0.05s per char | art-yakushev 0.03s, kaitonote 0.05s |
| **Per-letter slide** | 400ms | 20ms | chdartmaker (anime.js) |
| **Nav hover stagger** | 0.5-0.65s | 0.011-0.02s | art-yakushev |
| **Blur-to-sharp scroll** | scrub true | — | art-yakushev blur(10px), supersolid blur(5px) |
| **Work scatter** | 1.5s | 0.075s | kaitonote expo.out |
| **Number scramble** | 1.5s | — | kaitonote scrambleText |
| **Section transition** | 1s | — | Barba.js/supersolid |

### 5.3 Scroll-Driven Animation Patterns

| Pattern | Implementation | Site |
|---------|----------------|------|
| **Pinned timeline** | ScrollTrigger pin, scrub: true, 600-1300% viewport | skizophonic (1300%), kaitonote (600vh) |
| **Clip-path morph** | clip-path circle() expand/collapse between sections | skizophonic |
| **Blur-to-sharp** | filter: blur(10px) → blur(0px), scrub: 0.15 | art-yakushev |
| **CSS variable progress** | `--progress` 0→1 tied to scroll | chdartmaker |
| **Sticky + blend** | position: sticky + mix-blend-mode: difference | chdartmaker |
| **Circle shrink + scatter** | gradient scale→0, images scatter outward | kaitonote |
| **GSAP Flip scaling** | Small → fullscreen via GSAP Flip plugin | latchezar |
| **Parallax layers** | data-speed different per layer | Multiple sites |

### 5.4 Text Animation Techniques

| Technique | Implementation | Site |
|-----------|----------------|------|
| **Per-char stagger reveal** | SplitText + yPercent 100→0, stagger 0.02-0.05s | art-yakushev, kaitonote |
| **Blur-to-sharp per-char** | filter: blur → sharp, scrubbed to scroll | art-yakushev (10px), supersolid (5px) |
| **ScrambleText** | Random chars shuffle → settle | art-yakushev (hover), kaitonote (numbers) |
| **Slice/strip entrance** | SVG sliced 3 horizontal strips, yPercent 110→0 | supersolid |
| **Counter animation** | Digit columns, y: -90%, 3-digit scramble | kaitonote intro 000→100 |
| **drawSVG progressive** | SVG stroke drawn on scroll/time | kaitonote circles |
| **Chromatic shadow clone** | 3 RGB layers (pink/cyan/yellow) offset | supersolid |
| **wrapSpecificText()** | Programmatic italic injection for specific words | kaitonote |

### 5.5 Preloader/Intro Choreography

| Site | Duration | Sequence |
|------|----------|----------|
| **art-yakushev** | ~6-7s | Logo blur(20px)→sharp + scale 5x→1x + split (2s) → hero bg blur (3s) → text chars slide (1.5s) |
| **kaitonote** | ~7s | Counter 000→100 (2.75s) → SVG drawSVG circles (2.5s) → gradient orb scale 0.25→1 (3s) |
| **supersolid** | ~2s | Hero WebGL 3D entry: rotY 24, rotX -48, rotZ 3, scale 0.8→1 (1.5s) |
| **palmer** | ~3-4s | Splash animation → cinematic transition to landing |

---

## 6. EFFECT & TECHNIQUE DNA

### 6.1 WebGL/Shader Effects

| Effect | Implementation | Site |
|--------|----------------|------|
| **Navier-Stokes fluid sim** | OGL, double FBO ping-pong, Jacobi pressure | daspritam |
| **Text-to-texture pipeline** | DOM text → canvas → toDataURL → WebGL mesh | daspritam |
| **Chromatic aberration** | `fluid.rg * 0.001` UV displacement + `fluid * 0.003` RGB split | daspritam |
| **Flowmap text distortion** | Mouse velocity → UV displacement + chromatic (0.004) | supersolid (Three.js r160) |
| **3D glass sphere** | Three.js/WebGL transparent glass material | optunex |

### 6.2 CSS-Only Premium Effects

| Effect | CSS Property | Site |
|--------|-------------|------|
| **Silver/prismatic text** | `mix-blend-mode: luminosity` | latchezar |
| **Auto-invert text** | `mix-blend-mode: difference` + white text | art-yakushev, chdartmaker, supersolid |
| **Ghost shadow** | Cloned DOM + `mix-blend-mode: difference` + gray | kaitonote |
| **Image-as-reflection** | `<img> position: absolute; opacity: 0.7` behind text | chdartmaker |
| **Color-burn depth** | `mix-blend-mode: color-burn` overlay layers | kaitonote |
| **Glass text** | Text as window to blurred figure behind, light rays | minoarea |
| **Glitch texture** | 3-layer clip-path polygon, RGB channels, steps(1) | skizophonic |

### 6.3 Interaction Effects

| Effect | Trigger | Site |
|--------|---------|------|
| **Fluid simulation** | Mouse movement → splat velocity | daspritam |
| **Text pixel distortion** | Mouse/touch on text | creativewebmanual |
| **Cursor negative reveal** | Cursor over negative space | junji-yamazaki |
| **Cursor hologram** | Hover card → cursor becomes hologram + blending | creativeagency |
| **Cursor state change** | Hover clickable element → cursor changes | mobius |
| **Cursor magnifying glass** | Cursor as glass lens | inspirux |
| **Magnetic hover** | Button/element attracted to cursor | Multiple |
| **Text shuffle on hover** | Random chars 400ms → reset | art-yakushev |
| **Stagger link hover** | yPercent slide -96%, stagger 0.011s | art-yakushev |

---

## 7. CURSOR DESIGN DNA

### 7.1 Cursor Patterns (NEW — emerging strong pattern)

| Type | Behavior | Site | Feel |
|------|----------|------|------|
| **Hologram premium** | Blending negative space saat hover card | creativeagency | Premium, mahal |
| **Negative reveal** | Mengungkap konten tersembunyi | junji-yamazaki | Brutalist, discovery |
| **State change UX** | Berubah bentuk per context (card/video/link) | mobius | Accessible, intentional |
| **Magnifying glass** | Efek kaca pembesar + liquid glass | inspirux | Playful, craft |
| **Multi-layer mass** | Cursor dengan inertia, trailing layers | Portfolio Billy existing | Physical, weighted |

### 7.2 Cursor Design Rules

```
1. Cursor BUKAN hanya pointer — cursor adalah DESIGN ELEMENT
2. State change = UX indicator (berubah di clickable elements)
3. Premium feel = hologram/glass/blending effect saat hover
4. Reveal = cursor sebagai tool untuk discover hidden content
5. Physics = multi-layer dengan inertia, bukan instant snap
```

---

## 8. FOOTER DESIGN DNA

### 8.1 Footer Patterns

| Pattern | Implementation | Site |
|---------|----------------|------|
| **Circular narrative** | Footer mirrors hero (same typography, same layout) | daspritam, art-yakushev, chdartmaker |
| **SVG monogram mask** | Oversized brand mark sebagai visual anchor, video melalui cutout | art-yakushev |
| **Marquee text** | Running text sebagai design element, energetic | bravestudio |
| **Line accents** | Thin horizontal rules + typography elegan + structured grid | nivora |
| **City ticker** | Geographic authority marquee | chdartmaker |
| **Large CTA** | Full-screen centered big typography | Multiple |

---

## 9. ACCESSIBILITY & UX PATTERNS

### 9.1 UX dari References

| Pattern | Site | Implementation |
|---------|------|----------------|
| **Cursor state change** | mobius | Cursor berubah saat hover clickable elements |
| **Skip link** | chdartmaker | "Aller directement au contenu" |
| **Semantic HTML** | art-yakushev, chdartmaker | Proper h1/h2/section hierarchy |
| **Mobile fallback** | daspritam | WebGL off di mobile, static image |
| **Touch scroll** | Multiple | Lenis handles touch events |
| **Scroll lock intro** | art-yakushev | Body fixed during cinematic intro |

### 9.2 Gap Areas (Most References)
- Tidak ada `prefers-reduced-motion` handling (area dimana portfolio Billy sudah unggul!)
- mix-blend-mode bisa mengurangi contrast ratio
- Pinned scroll sections tanpa reduced-motion fallback

---

## 10. TECH STACK PATTERNS

### 10.1 Library Usage

| Library | Sites | Version | Purpose |
|---------|-------|---------|---------|
| **GSAP** | 15+ sites | 3.12-3.14 | Animation engine (dominant) |
| **Lenis** | 10+ sites | 1.0-1.2 | Smooth scroll |
| **SplitText** | 8+ sites | GSAP plugin | Per-char/word/line animation |
| **ScrollTrigger** | 12+ sites | GSAP plugin | Scroll-driven animation |
| **CustomEase** | 5+ sites | GSAP plugin | Bespoke easing curves |
| **Barba.js** | 3 sites | v2.10 | Page transitions |
| **Three.js** | 2 sites | r160 | 3D/WebGL |
| **OGL** | 1 site | v1.3.1 | Lightweight WebGL (fluid sim) |
| **Lottie** | 1 site | — | 2D canvas morphing shapes |
| **Alpine.js** | 1 site | — | Lightweight reactivity |
| **anime.js** | 1 site | v4.1.3 | Animation (chdartmaker) |
| **Framer Motion** | 10+ sites | Built-in | Framer templates |

### 10.2 Billy's Stack Advantage

```
Nuxt 4 + GSAP + Lenis + WebGL2 (custom GLSL)
= SEMUA yang dibutuhkan untuk achieve level references

Portfolio Billy sudah punya:
✅ GSAP full suite (ScrollTrigger, SplitText, CustomEase)
✅ Lenis smooth scroll
✅ WebGL2/GLSL shaders (lebih advanced dari kebanyakan references)
✅ Reduced motion accessibility (LEBIH BAIK dari semua references)
✅ Dark theme atmospheric
✅ Liquid glass navigation

Yang belum ada / bisa ditambah:
⬜ Custom cursor system (hologram/state-change)
⬜ Circular narrative footer
⬜ SVG monogram mask
⬜ Marquee text component
⬜ mix-blend-mode systematic strategy
⬜ Per-section visual identity (setiap section harus BERBEDA)
⬜ Cinematic preloader 5-8s
⬜ Counter-positioned hero typography
```

---

## 11. SYNTHESIS — BILLY'S DESIGN FORMULA

### The Formula

```
TYPOGRAPHY:  Condensed bold (200-450px) + Geometric sans + Italic serif accent
             Letter-spacing: -0.04em to -0.07em (hero), 0 (body)
             3 personality: BOLD + CLEAN + ELEGANT

COLOR:       Dark (#0a0a0a) + Blue gradient (#0f0a72→#0166c9→#a1e0e7)
             + Gold accent + Silver/prismatic text via blend modes
             VIBRANT > MUTED, always

LAYOUT:      Swiss Grid foundation + Counter-positioned typography
             + Vertical line accents + Metadata grid per section
             + Split-screen compositions + Generous negative space

MOTION:      expo.inOut (dominant) + CustomEase (signature)
             Cinematic intro 5-8s + Per-char stagger 0.02-0.05s
             Blur-to-sharp scroll + Pinned scroll timelines
             BUKAN opacity+y generic reveal

EFFECTS:     WebGL fluid sim + mix-blend-mode: difference/luminosity
             + Chromatic aberration + Glass/prisma materials
             + Ghost text shadows (cloned DOM + blend)

INTERACTION: Custom cursor (hologram/state-change/reveal)
             + Magnetic hover + Text shuffle + Scroll-driven state
             + Mouse-reactive fluid

STRUCTURE:   Cinematic preloader → Hero (viewport-filling type)
             → Sections (each with unique identity)
             → Circular narrative footer (mirrors hero)
```

### Quality Checklist (Before Any UI Code)

1. **Typography**: Apakah terlalu besar? (Jika tidak, belum cukup besar)
2. **Color**: Vibrant atau muted? (Harus vibrant)
3. **Layout**: Setiap section BERBEDA? (Monoton = gagal)
4. **Motion**: Expo.inOut? Per-char stagger? (Bukan generic fade)
5. **Effect**: Ada blend mode? Cursor custom? (Premium detail)
6. **Feel**: "Terasa mahal dan premium"? (User's #1 criteria)
7. **Slop test**: Apakah ini terlihat sama untuk portfolio lain? (Harus UNIK)
