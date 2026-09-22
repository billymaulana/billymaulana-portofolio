---
type: reference
slug: chdartmaker
title: chdartmaker.com
source_url: https://www.chdartmaker.com/
captured: 2026-07-16
awwwards_status: Non-awwwards
category: [portfolio]
style: [brutalism, cinematic]
fonts: [Bebas Neue, Okomito]
grid: Poster edge-anchored: masthead BebasNeue fit-to-width di atas foto B&W full-bleed; nav kiri, FR/EN kanan, statement kiri-bawah, SCROLLER tengah, meta proyek kanan-bawah
grid_type: [edge-anchored, full-bleed, asymmetric]
motion: [scroll-progress, text-reveal, page-transition]
libraries: [anime-js, locomotive-scroll, barba-js]
mood: [premium, brutal, monumental]
verdict: "backgroundnya hitam terasa premium, hero layout dan typographynya bold, effect pada fontnya ada pantulan abu seakan silver/kaca, scroll text hero mengenai layar putih terjadi mix blend warnanya premium unik, Conception -> Realisation arrow interaction bagus. Aspek yang saya suka adalah typography dan layoutnya saja."
influence: confirm
thumb: assets/chdartmaker-desktop.png
typography:
  primary: BebasNeue (condensed display, 267px hero)
  secondary: Okomito (geometric sans-serif)
color:
  background: "#000000"
---

## Apa yang Menarik (Typography & Layout Only)

| Aspek | Detail |
|-------|--------|
| **BebasNeue 267px hero title** | Condensed display font at extreme size — per-letter wrapped in individual spans, `line-height: 1`, uppercase. Huruf memenuhi viewport width |
| **Sticky text + mix-blend-mode: difference** | `.o-heroHome_largeHeader` sticky di `top: 30px`, `z-index: 3`. White text di black hero → saat scroll ke white section, text auto-invert jadi hitam. Satu CSS property, dua identity |
| **3D render as reflection layer** | Monochrome image (Rick Owens sleeping pod) at `opacity: 0.7`, `position: absolute`, behind white text. Menciptakan ilusi silver/glass reflection tanpa shader |
| **Conception -> Realisation scroll arrow** | Okomito 72px uppercase, `letter-spacing: -2.88px`. Line 3px hitam + SVG chevron between words. Width driven by `--progress` CSS variable dari Locomotive Scroll (`data-scroll-offset="20%,50%"`) |
| **Expertises 100px typography** | Okomito 700, 100px, `letter-spacing: -4px` — extreme negative tracking. White on black, stacked vertically. Tiap item = link dengan hover reveal |
| **Circular narrative footer** | "CHDARTMAKER" title di footer identik dengan hero — same font, same per-letter spans, same 3D image behind. Site terasa loop |
| **City marquee ticker** | "PARIS FR SHANGHAI CN LONDRES UK NYC USA VENISE IT MTP FR" — horizontal auto-scroll di footer area. Geographic authority |

## Teknik yang Diidentifikasi

| Teknik | Implementation | Purpose |
|--------|----------------|---------|
| Sticky + mix-blend-mode: difference | `position: sticky; top: 30px; mix-blend-mode: difference; z-index: 3` | Auto color inversion saat scroll melintasi section boundaries — satu teknik, premium feel |
| Per-letter span wrapping | `.o-heroHome_letterWrapper` spans per huruf | Granular control untuk entrance animation (translateY -105%) |
| Locomotive Scroll CSS progress | `data-scroll-css-progress` + `_setCssProgress()` -> `--progress` CSS variable | Scroll position -> 0-1 float -> CSS variable -> drive any CSS animation |
| anime.js v4.1.3 | `ls(elements, { translateY: "-105%", easing: outQuad, duration: 400, delay: stagger(20) })` | Entrance/exit per-letter animations |
| Barba.js page transitions | `@barba/core` v2.10.3 + lifecycle hooks (beforeLeave, afterEnter, etc.) | Smooth page transitions tanpa full reload |
| Image opacity layering | `<img> position: absolute; opacity: 0.7` behind text | "Silver reflection" effect — monochrome 3D render at reduced opacity creates glass illusion |
| CSS variable line animation | `--line-width` + `--progress` computed in JS, applied via `style.setProperty()` | Arrow grows from left label to right label driven by scroll |
| Condensed + geometric font pairing | BebasNeue (condensed display) + Okomito (geometric sans-serif body) | Maximum impact on headlines, clarity on body — two distinct personalities |

## Timing & Feel

- **Hero entrance**: translateY -105% -> 0, easing outQuad, duration 400ms, stagger 20ms per letter
- **Hero exit (on navigate)**: translateY 0 -> -105%, same easing, same stagger
- **Scroll line progress**: scrubbed 0->1 over `scrollOffset: "20%,50%"` — line visible early, completes mid-scroll
- **Scroll CSS progress**: `_setCssProgress(progress)` sets `--progress` 0->1 pada el.style
- **Dominant library**: anime.js (NOT GSAP) — outQuad easing dominant
- **Smooth scroll**: Lenis (embedded in Locomotive Scroll module)

## Kenapa Terasa Premium (Typography & Layout)

1. **Extreme font size** — 267px BebasNeue = text IS the design. Tidak ada elemen lain yang compete dengan hero typography
2. **mix-blend-mode: difference sebagai state machine** — satu CSS property menangani dua konteks warna. Elegant engineering
3. **Opacity-as-texture** — 3D render at 0.7 opacity bukan ilustrasi, tapi MATERIAL visual yang memberikan depth ke flat text. Terlihat silver/glass tanpa WebGL
4. **Negative tracking obsession** — -4px pada 100px text, -2.88px pada 72px text. Tighter = more premium, lebih banyak huruf terkompresi = more authority
5. **Black background as luxury** — pure black (#000) memberikan maximum contrast. Text putih pada hitam = immediate premium perception
6. **Circular narrative confirmation** — pattern ketiga (setelah daspritam.in + art-yakushev.com) yang footer mirrors hero. Ini bukan coincidence — ini PATTERN award-winning

## Mobile Handling

- Breakpoint di 1023px: isMobile check pada ExpertisesPush (hover disabled di mobile)
- Hero likely responsive (font-size via viewport units atau media queries in CSS, not in JS)
- Barba.js transitions tetap bekerja di mobile
- Locomotive Scroll handles touch events

## Accessibility

- Semantic HTML: h1, h2, h3, section, nav, main, footer — proper hierarchy
- Skip link: "Aller directement au contenu" (skip to main content) — excellent
- `aria-hidden="true"` pada SVG icons
- `focusable="false"` pada decorative SVGs
- **Gap**: Tidak ada explicit `prefers-reduced-motion` handling
- **Gap**: mix-blend-mode: difference bisa mengurangi readability pada beberapa color combinations

## Influence ke Taste Profile

- **Memperkuat**: Black background as premium, circular narrative (pattern ketiga!), mix-blend-mode: difference (pattern kedua setelah art-yakushev.com), negative letter-spacing pada display
- **Menambah baru**: Condensed display font at extreme size, image-opacity-as-reflection-layer (no shader needed), scroll-driven CSS variable animation, sticky text with auto-inversion, condensed + geometric font pairing
- **Konfirmasi**: Uppercase hero title, aggressive negative tracking, per-letter animation control

## Section-by-Section

### 1. Hero — CHDARTMAKER Masthead (`assets/chdartmaker-desktop.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Masthead 'CHDARTMAKER' BebasNeue memenuhi width di atas foto B&W industrial; edge-anchored: nav kiri (PROJETS/EXPERTISES/À PROPOS/CONTACT), FR/EN kanan, statement 'STUDIO-ATELIER... EN SAVOIR PLUS' kiri-bawah, SCROLLER tengah, 'RICK OWENS... VOIR LE PROJET' kanan-bawah |
| Typography | 'CHDARTMAKER' BebasNeue condensed ~267px; body Okomito geometric sans; tracking negatif ekstrem |
| Motion | Per-letter entrance (anime.js translateY -105% outQuad stagger 20ms); Barba page transition; Locomotive smooth scroll |
| Color | Pure black + foto B&W monokrom (Rick Owens sleeping pod), teks putih |
| Konsep | Nama studio sebagai masthead; foto sebagai material silver/glass reflection |
| Teknik | BebasNeue viewport masthead per-letter span, image-as-reflection (opacity 0.7), edge-anchored type |

### 2. Conception -> Réalisation (`assets/chdartmaker-projets.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Inversi ke BG TERANG: 'CONCEPTION' kiri + arrow -> + 'RÉALISATION' kanan; image proyek Moncler kanan; 'PLUS SUR CHD' kanan-bawah |
| Typography | Okomito 72px uppercase, letter-spacing -2.88px; line 3px + SVG chevron antar kata |
| Motion | Arrow width driven by --progress (Locomotive CSS scroll progress); mix-blend-difference auto-invert saat lewat section terang |
| Color | BG terang putih, teks hitam (inversi dari hero gelap) — nav auto-invert |
| Konsep | Proses studio: conception -> realisation (interaksi arrow yang di-highlight Billy di verdict) |
| Teknik | Locomotive CSS --progress drive arrow line, mix-blend difference section inversion, SVG chevron |

### 3. Footer — Circular Narrative (`assets/chdartmaker-footer.png`)

| Aspek | Detail |
| --- | --- |
| Layout | City marquee 'PARIS SHANGHAI LONDRES NYC' (ticker), address Montpellier + tel + contact + socials (INSTAGRAM/LINKEDIN/FACEBOOK), masthead 'CHDARTMAKER' diulang di atas foto B&W sama |
| Typography | Marquee + masthead BebasNeue; body Okomito; monogram EPV |
| Motion | City marquee auto-scroll horizontal; masthead per-letter (mirror hero) |
| Color | Black + foto B&W, teks putih |
| Konsep | Circular narrative: masthead footer = hero, site loop; geographic authority (4 kota) |
| Teknik | Horizontal marquee ticker, circular narrative masthead repeat, image-as-material |

