---
type: reference
slug: art-yakushev
title: art-yakushev.com
source_url: https://www.art-yakushev.com/
captured: 2026-07-16
awwwards_status: SOTD
category: [portfolio]
style: [cinematic, editorial]
fonts: [Suisse, Apparel]
grid: Edge-anchored sinematik: statement atas, video kinescope tengah, nama full-width di baseline bawah; nav + jam YEREVAN + socials tersebar di empat sudut; section works memakai tipografi scatter over foto
grid_type: [edge-anchored, full-bleed, scattered]
motion: [scroll-scrub, text-reveal, blend-mode, hover-shuffle]
libraries: [gsap, splittype, lenis]
mood: [premium, cinematic, kinetic]
verdict: "motionnya smooth, typography keren, text di hero terlihat seperti prisma atau silver, scroll terasa smooth, typography boldnya saya suka, footernya text blend dengan warna dibelakangnya, secara keseluruhan motion dan feel terasa mahal, splashscreennya smooth"
influence: strengthen
thumb: assets/art-yakushev-desktop.png
typography:
  primary: Suisse (sans-serif)
  accent: Apparel (italic serif)
---

## Apa yang Menarik

| Aspek | Detail |
|-------|--------|
| **Prisma/silver text effect** | `mix-blend-mode: difference` pada `.hero-wrap` — white text over red Vimeo video → cyan/blue prismatic shifts. Area gelap video → text jadi silver/metallic |
| **Editorial serif/sans pairing** | "Artiom" dalam Suisse (sans-serif), "Yakushev" dalam Apparel (italic serif) — satu baris, dua personality |
| **Per-character kerning** | Custom letter-spacing per span: "A" -8.64px, "r" +2.16px, "Y" -36.72px — optical precision, bukan uniform |
| **Cinematic splashscreen** | Logo blur(20px)→sharp + scale 5x→1x + split dari center, lalu hero video blur-to-sharp, text chars slide dari bawah |
| **SVG monogram mask footer** | "AR-26" sebagai SVG cutout — video background terlihat melalui bentuk huruf → text "blend" dengan warna di belakang |
| **Scroll-driven text blur** | Per-char blur(10px)→blur(0px) scrubbed to scroll position — text terbaca seiring scroll |
| **Text shuffle hover** | Chars acak selama 400ms lalu reset ke asli — playful micro-interaction |
| **Circular narrative** | Footer menampilkan hero lagi (nama, video, tagline) — site terasa loop, bukan end |

## Teknik yang Diidentifikasi

| Teknik | Implementation | Purpose |
|--------|----------------|---------|
| mix-blend-mode: difference | `.hero-wrap` wrapper over Vimeo iframe | Prismatic color inversion — white menjadi complement dari video color |
| Vimeo background video | iframe `background=1&muted=1&loop=1`, object-fit cover | Atmospheric cinematic backdrop tanpa loading overhead sendiri |
| SplitType + GSAP SplitText | `new SplitType(el, { types: "words, chars, lines" })` | Granular per-char animation control |
| ScrambleTextPlugin | Hover shuffle pada nav/link text | Playful randomness yang controlled |
| Blur-to-sharp scroll reveal | `filter: blur(10px)` → `blur(0px)`, ScrollTrigger scrub: 0.15 | Progressive readability tied to scroll position |
| Logo cinematic intro | `filter: blur(20px)` + `scale: 5` + `x: ±43vw` → normal, expo.inOut 2s | Dramatic entrance dari center-split |
| Hero char slide-up | `yPercent: 150` → 0, stagger from center each 0.03s, expo.inOut 1.5s | Chars muncul dari bawah overflow clip |
| Stagger link hover | `yPercent: -96`, expo.inOut 0.5s, stagger each 0.011s | Per-char slide-up hover — premium feel |
| SVG monogram mask | SVG path dengan black fill, letter cutouts, z-index: -1 | Video terlihat melalui cutout → blend effect |
| Lenis smooth scroll | Lenis 1.2.3 via unpkg CDN | Buttery smooth scroll feel |
| Scroll lock during intro | Body fixed + prevent wheel/touch/key events | Memaksa user menonton intro sequence |
| Responsive breakpoint reload | localStorage scroll position + sessionStorage reload flag | Clean re-init saat breakpoint berubah |

## Timing & Feel

- **Intro timeline**: ~6-7s total (logo blur+scale 2s, hero bg blur 3s, text slide 1.5s overlapping)
- **Logo entrance**: blur(20px)→sharp, scale 5x→1x, x ±43vw→0, expo.inOut 2s
- **Hero text chars**: yPercent 150→0, from center, each 0.03s stagger, expo.inOut 1.5s
- **Scroll text blur**: blur(10px)→0, scrub 0.15, start "top 80%" end "bottom 20%"
- **Nav stagger hover**: yPercent 0→-96, expo.inOut 0.5s, stagger each 0.011s
- **Big stagger hover**: yPercent 0→-116, expo.inOut 0.65s, stagger each 0.02s
- **Text shuffle**: random chars every 100ms for 400ms, then reset
- **Dominant easing**: expo.inOut (intro), power2.out (reveals), power1.out (scroll)

## Kenapa Terasa Premium

1. **Video-as-atmosphere** — Vimeo video bukan konten, tapi MATERIAL visual yang berinteraksi dengan typography via blend mode
2. **mix-blend-mode: difference** — satu CSS property yang menciptakan seluruh prismatic identity. White → cyan over red, white → silver over dark
3. **Per-character kerning obsession** — "A" punya spacing berbeda dari "r", "Y" punya spacing berbeda dari "akushev". Optical, bukan mathematical
4. **Intro scroll lock** — memaksa user menonton cinematic opening, menciptakan moment of awe sebelum explore
5. **Blur-to-sharp readability** — text tidak langsung terbaca, tapi MENJADI terbaca seiring scroll — engagement through gradual reveal
6. **Circular narrative** — footer = hero repeat dengan video background → site tidak "berakhir"
7. **will-change management** — setiap animasi set willChange sebelum dan clear setelah → performance-conscious engineering
8. **Zero canvas/WebGL** — semua efek premium dicapai dengan CSS + GSAP saja → lightweight, accessible

## Mobile Handling

- Breakpoint di 1200px: intro timeline berbeda (line-based bukan char-based)
- 768-1200: tablet variant dengan `.text-hero_mob` (line stagger, bukan char stagger)
- < 768: blur element-level (bukan per-char), stagger links disabled
- Breakpoint change → page reload dengan scroll position preserved (localStorage)
- `.hero_social-mob` dan `.text-hero-mob_wrapp` sebagai mobile-specific elements

## Accessibility

- Semantic HTML terjaga (h1, h2, h4, section divs)
- Keyboard nav: scroll lock prevents keyboard during intro (restored after)
- **Gap**: Tidak ada explicit `prefers-reduced-motion` handling — intro selalu play
- **Gap**: Scroll lock bisa frustrasi user yang ingin skip intro

## Influence ke Taste Profile

- **Memperkuat**: Cinematic intro/preloader, smooth scroll (Lenis), per-char text animation, dark atmospheric aesthetic
- **Menambah baru**: mix-blend-mode: difference as prismatic strategy, serif/sans editorial pairing, blur-to-sharp scroll reveal, SVG monogram mask footer, video-as-visual-material (bukan content), per-character optical kerning
- **Konfirmasi**: expo.inOut sebagai dominant easing (sama dengan preference existing), circular narrative (sama pattern dengan daspritam.in)

## Section-by-Section

### 1. Hero (`assets/art-yakushev-desktop.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Nama 'Artiom Yakushev' full-width bawah, video kinescope tengah, statement 'A Creative Partner for companies and brands that decide to move forward.' atas; nav HOME/WORK/INFO/CONTACT, jam YEREVAN, socials |
| Typography | 'Artiom' Suisse sans + 'Yakushev' Apparel italic serif — satu baris dua personality; per-char optical kerning (A -8.64px, Y -36.72px) |
| Motion | Intro cinematic (logo blur+scale 5x, scroll-lock ~6-7s), per-char slide-up expo.inOut, mix-blend prismatic |
| Color | Dark + video musician; teks prismatik via mix-blend-difference (silver/cyan shift) |
| Konsep | Creative partner statement; nama sebagai identity, video sebagai material bukan konten |
| Teknik | mix-blend-mode difference over video (kinescope/Vimeo), SplitType per-char, cinematic intro scroll-lock |

### 2. Works / Folio (`assets/art-yakushev-works.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Case preview bernomor (00-1..00-8), tipografi scatter (mis. EKRUF) over foto proyek ter-tint, toggle PREVIEW; A®-mark sudut mix-blend |
| Typography | Nama proyek scatter Suisse besar; label mono '00-3 PREVIEW'; case study links |
| Motion | Preview toggle (hover reveal project), scroll-driven reveal, text shuffle hover (ScrambleText) |
| Color | Foto proyek ter-tint (ungu/warm), aksen kuning untuk scatter letters |
| Konsep | Folio sebagai showcase award (SOTD/HM); tiap case link ke Behance/live site |
| Teknik | Scattered per-letter over media, PREVIEW toggle interaction, hover shuffle |

### 3. Key Skills & Interests (`assets/art-yakushev-skills.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Heading raksasa 'KEY SKILLS & INTERESTS' + laptop mockup + kolom Capabilities/Expertise/Inspiration |
| Typography | Heading Suisse besar prismatik; label 'Capabilities' Apparel serif italic; list items Suisse |
| Motion | Heading mix-blend luminosity/difference; reveal per-char scrubbed |
| Color | Gradient MERAH hangat (kontras dari hero gelap), teks cyan prismatik |
| Konsep | Kapabilitas + interest (music, sci-fi, cinema) — personal + professional digabung |
| Teknik | mix-blend prismatic heading over warm gradient, serif-label + sans-list pairing |

### 4. Footer — Circular Narrative (`assets/art-yakushev-footer.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Nama 'Artiom Yakushev' diulang (mirror hero), 'CREATIVE DIGITAL DESIGNER / WORKING WORLDWIDE', BACK TO TOP, jam YEREVAN |
| Typography | Suisse + Apparel italic (sama seperti hero); gradient peach/coral |
| Motion | Teks blend dengan video biru di belakang; back-to-top |
| Color | Video biru blur + teks gradient peach/coral (mix-blend) |
| Konsep | Circular narrative: footer = hero repeat, site terasa loop bukan end |
| Teknik | Nama over video + mix-blend chromatic, circular narrative mirror |

