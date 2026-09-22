---
type: reference
slug: kaitonote
title: kaitonote.com
source_url: https://kaitonote.com/
captured: 2026-07-16
awwwards_status: Non-awwwards
category: [portfolio]
style: [cinematic, minimalism]
fonts: [Kumbh Sans, Noto Serif Display]
grid: Swiss geometris: orb gradient kanan-tengah + SVG circle grid sebagai konstruksi; corner labels di empat penjuru, wordmark kiri-atas, heading kiri-bawah
grid_type: [swiss, edge-anchored]
motion: [scroll-scrub, text-reveal, intro-choreography, scatter]
libraries: [gsap, lenis, alpine-js, lottie]
mood: [premium, cinematic, calm]
verdict: "circle transisi masuk ke hero lalu memudar, warna biru dan gradasinya stunning, accent grid dan lingkaran premium di atas hitam + biru, typography dan layout bagus, scroll motion circle membesar + manifesto blending sangat suka, circle biru pallettenya sangat suka, services section vibrant nuansa premium + thin object yang berubah-ubah di sebelah kiri"
influence: new
thumb: assets/kaitonote-desktop.png
typography:
  primary: Kumbh Sans (300 weight)
  accent: Noto Serif Display (italic, via wrapSpecificText)
color:
  gradient: ["#0f0a72", "#0166c9", "#a1e0e7"]
---

## Apa yang Menarik

| Aspek | Detail |
|-------|--------|
| **Intro circle transition** | Counter 000->100 (3 digit columns, y: -90%, 2.75s), SVG drawSVG circles drawn on, gradient orb scale 0.25->1 (3s), circle container width 0->"100%" + opacity->0.5. Dua bespoke CustomEase curves. ~7s total choreography |
| **Deep indigo->blue->cyan gradient** | `#0f0a72` -> `#0166c9` -> `#a1e0e7` tri-tone. Gradient orb = JPG image 1920x1079, bukan shader. Dua color-burn overlay layers menambah warm tonal depth |
| **SVG circle grid accents** | SVG ellipses (viewBox 825.5x825.5, strokeWidth 0.5px white/gray) + bg_circle.png (1441x1441, opacity 0.7). Grid lines tipis = precision engineering aesthetic |
| **Corner labels** | "MOTION DESIGN", "WEB DEVELOPMENT", "VISUAL DESIGN", "ART DIRECTION" di empat corner hero — framing + expertise declaration |
| **Scroll-scrubbed circle shrink + manifesto** | Pinned section (600vh): gradient/circles scale->0 (power3.in), work images scatter outward via x/y/z (expo.out, stagger 0.075), manifesto text revealed per-char. Lingkaran "melahirkan" konten |
| **Manifesto text blending** | Cloned text technique: setiap EN line di-clone, positioned absolute z[-1], `text-gray-600 mix-blend-difference` — ghost shadow yang invert di atas gradient |
| **Lottie morphing thin objects** | Sticky 2D canvas 328x328, Lottie canvas renderer, loop autoplay false. Thin geometric shapes (circles, crosshairs, lines) berubah seiring scroll melewati service items |

## Teknik yang Diidentifikasi

| Teknik | Implementation | Purpose |
|--------|----------------|---------|
| CustomEase intro choreography | `CustomEase.create("custom","M0,0 C0.11,0.282...")` — dua bespoke curves, counter+circle+orb sequenced | Intro yang terasa bespoke, bukan generic ease |
| drawSVG progressive reveal | `drawSVG: "0% 100%"` (semi-circles 2.5s) + `"100% live"` (ellipses 1s) + scaleX/Y 0->1 (lines 2-2.5s) | Grid "tergambar" secara perlahan — crafted entrance |
| Pinned scroll timeline | `ScrollTrigger { trigger: [data-reel], start: "top-=15% top", end: "bottom bottom", scrub: true }` | Continuous narrative scroll, bukan section jump |
| Work images scatter | `x/y/z rem` positioning, `expo.out`, stagger `0.075` per image, 10 images z[-1]->z[-10] | Images "meledak" keluar dari lingkaran — dramatic reveal |
| Cloned text + blend-difference | `.cloneNode(true)` -> add classes `z-[-1] text-gray-600 mix-blend-difference` | Ghost shadow layer tanpa CSS box-shadow — depth via blend |
| wrapSpecificText() | DOM text node search -> wrap matching words ("four","both","digital experiences") with `font-noto italic` | Programmatic serif italic injection — elegant inline accent |
| Lottie canvas renderer | `lottie.loadAnimation({ container, renderer:"canvas", loop:true, autoplay:false, animationData })` | Morphing decorative objects tanpa WebGL overhead |
| scrambleText numbers | GSAP registered effect: `chars:"0123456789"`, speed 1.5, duration 1.5s | Service numbering (01, 02, 03) dengan visual noise |
| Per-char service title | `inText(chars, { stagger: 0.05 })` — Kumbh Sans 300, 53px | Premium text entrance pada service items |
| SplitText nested lines | Split lines -> nested split for double-level animation control | Granular reveal: line-by-line lalu per-char |

## Timing & Feel

- **Intro**: ~7s total. Counter 2.75s, circles 2.5s, orb 3s (overlapping dari show+3.75). Dua CustomEase curves (custom bezier)
- **Scroll reel**: scrub true (direct), pin start "top top", end dynamic `window.innerHeight`. Gradient fade 1s, circles shrink 2s, images scatter 1.5s, video scale 1s
- **Service entrance**: per-char stagger 0.05s, number scramble 1.5s
- **Lottie**: loop true, autoplay false (scroll-driven), canvas renderer 328x328
- **Registered effects**: inTitle (CustomEase, stagger 0.1, 1.6s), inText (easeOutExpo, 2.4s), inScrambleText (scramble, 1.5s)
- **Dominant easing**: power3.in/out (structural), expo.out (scatter), CustomEase (intro)

## Kenapa Terasa Premium

1. **Gradient orb sebagai JPG** — bukan shader yang berat, tapi image yang di-animate dengan GSAP. Simple tech, stunning result
2. **Tri-tone gradient palette** — `#0f0a72` deep indigo -> `#0166c9` vibrant blue -> `#a1e0e7` light cyan. Bukan monochrome, bukan rainbow — curated 3-stop palette
3. **SVG grid accents** — strokeWidth 0.5px = hampir invisible tapi TERASA. Precision tanpa noise
4. **Circle sebagai universal motif** — intro circles, hero grid circles, scroll shrink circles, gradient orb circle, Lottie circles. Satu vocabulary visual yang kohesif
5. **Cloned text blend** — bukan CSS shadow, bukan text-shadow — DOM clone + mix-blend-difference. Engineering effort yang terlihat subtle
6. **Lottie sebagai craft indicator** — thin morphing objects bukan fungsional tapi communicates "we animate EVERYTHING"
7. **Two bespoke CustomEase curves** — bukan preset ease, bukan cubic-bezier standard. Custom-plotted curves = attention to feel
8. **Zero WebGL** — semua efek premium via 2D canvas (Lottie) + GSAP + CSS blend modes. Lightweight, accessible, performa tinggi

## Mobile Handling

- Responsive font sizing (Kumbh Sans scales with viewport)
- Lottie canvas likely smaller on mobile (328px -> responsive)
- Gradient orb JPG scales naturally
- SVG grid viewBox-based = resolution independent
- Lenis handles touch scroll

## Accessibility

- Corner labels provide context (expertise areas)
- Videos: no autoplay audio
- Canvas Lottie: `aria-hidden` implicit (decorative)
- **Gap**: Tidak ada explicit `prefers-reduced-motion` handling pada intro 7s sequence
- **Gap**: mix-blend-difference cloned text bisa mengurangi contrast pada certain gradient positions
- **Gap**: Pinned 600vh scroll section tanpa reduced-motion fallback

## Influence ke Taste Profile

- **Memperkuat**: Dark premium aesthetic (black + blue, pattern ke-6), mix-blend-mode: difference (pattern ke-5), circles as visual motif (pattern ke-2 setelah skizophonic), per-char text stagger, GSAP + Lenis combo
- **Menambah baru**: Tri-tone gradient palette (indigo->blue->cyan), SVG grid accent system, Lottie as decorative morphing object, cloned-text blend shadow technique, programmatic italic wrapping (`wrapSpecificText`), scrambleText for numbers, CustomEase bespoke curves, color-burn overlay layers, corner labels as expertise framing, JPG-as-gradient-orb (simple tech for stunning visual)
- **Konfirmasi**: Zero WebGL bisa achieve premium feel (CSS + GSAP + 2D canvas sufficient), circle as universal shape language (sama dengan skizophonic.com), light weight typography can be premium (300 != weak, 300 = elegant)
- **Nuansa baru**: Kaitonote menunjukkan bahwa ELEGANT (light, airy, blue) bisa sepremium BRUTAL (heavy, dark, glitch). User suka keduanya — portfolio Billy bisa blend kedua sensibilitas

## Section-by-Section

### 1. Hero — Synthesize Approaches (`assets/kaitonote-desktop.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Orb gradient biru kanan-tengah + SVG circle grid tipis (konstruksi geometris), corner labels {MOTION DESIGN}{WEB DEVELOPMENT}{VISUAL DESIGN}{ART DIRECTION}, KAITO NOTE kiri-atas, {MENU} kanan-atas, heading 'Synthesize Approaches, Refined Digital Experiences. For Vision and Brand.' kiri-bawah |
| Typography | Kumbh Sans 300 (light elegant) + Noto Serif Display italic accent (Digital/For/and via wrapSpecificText); heading YakuhanJP untuk JP |
| Motion | Intro circle transition (counter 000->100, drawSVG circles, orb scale 0.25->1, ~7s, 2 bespoke CustomEase); SVG grid tergambar |
| Color | Tri-tone gradient #0f0a72 -> #0166c9 -> #a1e0e7 (orb JPG), bg hitam, grid putih 0.5px |
| Konsep | 4 area (motion/web/visual/art) sebagai konstruksi geometris; logic + intuition |
| Teknik | Gradient orb (JPG GSAP-animated, bukan shader), SVG ellipse grid drawSVG, corner labels, CustomEase intro |

### 2. Manifesto — Blue Flame (`assets/kaitonote-manifesto.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Orb membesar mengisi viewport (scroll-scrub), manifesto text atas 'I strive to create experiences that quietly sear impact and emotion deep into the heart, like a blue flame.', profil JP kanan, PROFILE+ |
| Typography | Kumbh Sans + Noto Serif italic accents (experiences/emotion/blue flame); JP body YakuhanJP |
| Motion | Pinned 600vh: gradient/circle scale->0 lalu orb membesar (power3), manifesto per-char reveal, cloned-text mix-blend-difference ghost |
| Color | Orb biru penuh (#0166c9 / #a1e0e7), teks putih |
| Konsep | Manifesto blending — 'blue flame' metafora; bagian yang Billy 'sangat suka' |
| Teknik | Scroll-scrub pinned circle expand, cloned-text blend-difference shadow, wrapSpecificText serif italic |

### 3. Services — Art Direction (`assets/kaitonote-services.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Heading service 'Art Direction' + deskripsi kanan; Lottie thin-object icon (dashed circle morphing) di kiri; gradient vibrant bleed dari kiri |
| Typography | Kumbh Sans heading + body; number scramble (01/02/03) |
| Motion | Lottie thin geometric objects morph seiring scroll melewati service items; scrambleText numbers |
| Color | Black + vibrant blue gradient bleed kiri |
| Konsep | 4 layanan (motion/web/visual/art direction), tiap dengan Lottie morphing — 'we animate EVERYTHING'; thin object yang berubah di kiri (disukai Billy) |
| Teknik | Lottie canvas morphing icons (scroll-driven, autoplay false), scrambleText numbers, per-char service title |

