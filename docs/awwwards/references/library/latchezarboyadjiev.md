---
type: reference
slug: latchezarboyadjiev
title: latchezarboyadjiev.com
source_url: https://www.latchezarboyadjiev.com/
captured: 2026-07-16
awwwards_status: Non-awwwards
category: [portfolio]
style: [glass, sculptural]
fonts: [Maximanouva]
grid: Counter-position: nama terbelah kiri (hitam) / kanan (cyan) over video glass full-bleed; sub-nav atas, menu kanan, copy kiri-bawah
grid_type: [asymmetric, edge-anchored, full-bleed]
motion: [scroll-scrub, flip-morph, blend-mode]
libraries: [gsap, lenis, swiper]
mood: [premium, monumental, clinical]
verdict: "layout heronya saya suka, typography boldnya saya suka, effect pantulan pada text heronya terlihat seperti glass/prisma/silver dan blendingnya di hero dan beberapa section, assets hero yang seperti kaca saya suka. Background warna putih saya tidak begitu suka. Hanya itu saja yang saya suka."
influence: new
thumb: assets/latchezarboyadjiev-desktop.png
typography:
  primary: Maximanouva (700 weight, 216px hero)
color:
  text: "#ededed"
  button_overlay: "rgb(86, 145, 239)"
---

## Apa yang Menarik (Hero Layout, Typography, Glass Effect, Blend, Glass Assets Only)

| Aspek | Detail |
|-------|--------|
| **Maximanouva 216px hero** | Custom font at 700 weight, color #ededed (light gray, bukan pure white). Dua H1: "Latchezar" left-aligned, "BOYADJIEV" right-aligned — counter-position Swiss tension |
| **mix-blend-mode: luminosity on hero text** | `.hero-heading-wrapper.is-luminosity` — text mengambil BRIGHTNESS sendiri (#ededed), CHROMINANCE dari video glass sculpture di belakang. Hasilnya: text terlihat silver/prismatic/glass tanpa shader |
| **Systematic blend mode strategy** | `luminosity` (hero heading + lightbox icons), `difference` (cursor, nav, content, about, contact), `color` (button overlays blue #5691EF) — bukan satu trick, tapi SISTEM per section |
| **Glass sculpture video as material** | MP4 1280x720, rotating glass art, autoplay/loop/muted, z-index -100, object-fit cover — video bukan konten, tapi CHROMATIC SOURCE untuk text blending |
| **GSAP Flip scaling asset** | `.scaling-video` starts 192x128px -> scales fullscreen via GSAP Flip plugin. Glass sculpture "grows" dari thumbnail ke hero background on scroll |
| **Sub-nav concept tags** | "Fluidity", "Light", "Emotion" — 16px, weight 400, `mix-blend-mode: difference` — conceptual anchors, bukan navigation biasa |
| **About: "THE ART OF SHAPING GLASS"** | Maximanouva 144px, 700 weight, line-height 144px, `mix-blend-mode: difference` pada wrapper — text inverts over dark/light zones |

## Teknik yang Diidentifikasi

| Teknik | Implementation | Purpose |
|--------|----------------|---------|
| mix-blend-mode: luminosity | `.hero-heading-wrapper.is-luminosity` over video background | Silver/prismatic text — text brightness stays, color from video |
| mix-blend-mode: difference | `.hero-content-wrapper.is-difference`, nav, about, contact wrappers | Auto-inverting text across dark/light zones — consistent readability |
| mix-blend-mode: color | `.button-image-overlay.is-blue` (`rgb(86,145,239)`) | Blue tint overlay on buttons — subtle brand color injection |
| GSAP Flip plugin | `data-flip-element="wrapper"` + `data-flip-element="target"` on scaling-video | Morph glass asset from thumbnail -> fullscreen with layout animation |
| Video-as-chromatic-source | MP4 autoplay/loop/muted, z-index -100, object-fit cover | Glass sculpture video provides color palette for luminosity text blend |
| Counter-positioned H1s | H1 "Latchezar" text-align-left + H1 "BOYADJIEV" text-align-right | Maximum asymmetric tension — diagonal reading path |
| GSAP 3.13.0 full suite | ScrollTrigger, Flip, Draggable, CustomEase, InertiaPlugin | 54 ScrollTrigger instances — heavy scroll-driven animation system |
| Lenis smooth scroll | Lenis (via CDN) | Smooth scroll feel, same as portfolio stack |
| Swiper slider | Swiper v8 for gallery sections | Touch-friendly gallery/artwork browsing |

## Timing & Feel

- **54 ScrollTrigger instances** — extremely scroll-driven, setiap section punya trigger
- **Flip scale animation**: small -> fullscreen, likely power3/expo easing (CustomEase loaded)
- **Lenis smooth scroll**: consistent buttery feel
- **Videos**: all autoplay, loop, muted — ambient background material, bukan content
- **Dominant library**: GSAP 3.13.0 (NOT anime.js — berbeda dari chdartmaker.com)

## Kenapa Terasa Premium (Glass/Prisma/Silver Effect)

1. **mix-blend-mode: luminosity** — teknik BARU yang belum ditemui di reference sebelumnya. Berbeda dari `difference` (inversi) — luminosity mengambil brightness dari foreground + chrominance dari background. Hasilnya HALUS, silver, prismatic
2. **Video sebagai palette** — glass sculpture yang berputar menciptakan warna yang terus berubah. Text "menampilkan" warna glass secara organik
3. **Systematic blend strategy** — bukan hanya hero trick. `luminosity` di hero, `difference` di nav/about/contact, `color` di buttons. Setiap blend mode punya TUJUAN spesifik
4. **Counter-positioned typography** — dua H1 di axis berbeda (kiri/kanan) menciptakan diagonal tension yang memaksa mata membaca dari top-left ke bottom-right
5. **Glass asset scaling** — GSAP Flip dari thumbnail ke fullscreen adalah "cinematic zoom" yang membuat glass sculpture terasa monumental
6. **Zero WebGL** — semua efek premium dicapai dengan CSS blend modes + video + GSAP. Lightweight, accessible

## Mobile Handling

- Webflow responsive system (breakpoints via CSS media queries)
- Videos likely degraded/hidden on mobile (Webflow standard practice)
- GSAP ScrollTrigger handles touch events natively
- Lenis handles touch scroll

## Accessibility

- Webflow generates semantic HTML (sections, headings, nav, links)
- Videos: autoplay/loop/muted — no audio distraction
- `w-background-video` pattern has built-in poster fallback
- **Gap**: Tidak ada explicit `prefers-reduced-motion` handling (common Webflow limitation)
- **Gap**: Luminosity blend bisa mengurangi contrast ratio pada beberapa video frames
- **Gap**: 54 ScrollTrigger instances = heavy animation tanpa reduced-motion opt-out

## Influence ke Taste Profile

- **Memperkuat**: Bold typography at extreme sizes (pattern ke-4), mix-blend-mode strategies (pattern ke-3 setelah art-yakushev + chdartmaker), video-as-visual-material (pattern ke-2 setelah art-yakushev), counter-positioned layout
- **Menambah baru**: `mix-blend-mode: luminosity` (teknik baru — silver/prismatic text), GSAP Flip scaling animation, systematic blend mode per-section, video-as-chromatic-source (bukan hanya atmosphere), sub-nav concept tags
- **Konfirmasi**: GSAP + Lenis combo (sama dengan portfolio Billy), zero-WebGL premium aesthetic achievable with CSS blend modes
- **TIDAK disukai**: White background — user explicitly prefers dark

## Section-by-Section

### 1. Hero — LATCHEZAR BOYADJIEV (`assets/latchezarboyadjiev-desktop.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Counter-position: 'LATCHEZAR' kiri (hitam) + 'BOYADJIEV' kanan (cyan) Maximanouva 216px over video glass sculpture oranye; sub-nav 'Fluidity / Light / Emotion' atas; menu ABOUT/ARTWORKS/REPRESENTATION/EXHIBITIONS kanan; copy 'Discover the artistry...' kiri-bawah |
| Typography | Maximanouva 216px 700; sub-nav concept tags 16px 400 |
| Motion | mix-blend-luminosity hero text (brightness sendiri #ededed, chrominance dari video glass -> silver/prismatic); GSAP Flip glass 'grow' dari thumbnail -> fullscreen on scroll |
| Color | BG putih/cream (Billy tidak suka), video glass oranye/merah, teks hitam + cyan (luminosity prismatic) |
| Konsep | Nama artis sebagai statement; glass sculpture video sebagai chromatic source |
| Teknik | mix-blend-mode luminosity over glass sculpture MP4, counter-positioned H1 (diagonal tension), GSAP Flip scaling |

### 2. About — The Art of Shaping Glass (`assets/latchezarboyadjiev-about.png`)

| Aspek | Detail |
| --- | --- |
| Layout | 'MEET THE ARTIST' label + 'THE ART OF SHAPING GLASS' Maximanouva 144px over video portrait artist; LB monogram kiri-atas |
| Typography | Maximanouva 144px 700, line-height 144px |
| Motion | mix-blend-mode difference wrapper (teks auto-invert over dark/light video zones); scroll reveal |
| Color | Video artist (warm/dark), teks inversi via difference |
| Konsep | Meet the artist — proses membentuk kaca (craft narrative) |
| Teknik | mix-blend-mode difference over video, Maximanouva extreme scale, 54 ScrollTrigger instances |

### 3. Catalog — Signature Sculptures (`assets/latchezarboyadjiev-gallery.png`)

| Aspek | Detail |
| --- | --- |
| Layout | 'CATALOG' heading + Swiper slider (prev/next arrows) + kartu sculpture (GRACE 2 / DANCE 2 / SOARING / QUEST) dengan judul + dimensi (mis. 52" x 19" x 6") |
| Typography | Maximanouva heading; card labels sans caps |
| Motion | Swiper horizontal drag gallery; scroll reveal cards |
| Color | BG putih, sculpture berwarna (green/grey/yellow/orange) di studio gradient netral |
| Konsep | Katalog karya glass — signature sculptures dengan dimensi fisik |
| Teknik | Swiper v8 slider, GSAP scroll reveal, image cards dengan meta dimensi |

