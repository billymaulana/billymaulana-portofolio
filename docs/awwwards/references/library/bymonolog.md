---
type: reference
slug: bymonolog
title: "MONOLOG (bymonolog.com)"
source_url: https://bymonolog.com/
captured: 2026-07-18
category: [agency]
style: [brutalism, editorial, cinematic]
fonts: [Animo, Khteka, Suisse Mono]
grid: centered editorial copy + full-bleed masthead; section beralternasi dark/light
grid_type: [centered, editorial, full-bleed]
motion: [page-transition, smooth-scroll, text-reveal]
libraries: [gsap, three, lenis, barba-js]
mood: [brutal, monumental, premium]
verdict: "background hero membuat kesan elegan, texture dan detail sangat bagus, typography di logo bagus, semua typography di content bagus. Paling suka style font di section 'LET'S BUILD AN EXPERIENCE THAT MOVES -> PEOPLE' (font Animo, uppercase, tracking -4px) — nuansanya brutalist/creative."
influence: strengthen
thumb: assets/bymonolog-desktop.png
summary: "background hero elegan, texture & detail bagus, typography logo & content bagus; paling suka font display section CTA 'LET'S BUILD ... -> PEOPLE' (Animo, uppercase, brutalist/creative)."
typography:
  primary: "Animo (display, weight 500, uppercase, tracking ekstrem -4 s/d -6px) — masthead section 'SUCCESS STORIES' 199px & CTA; font yang paling disukai Billy"
  secondary: "Khteka (grotesk kustom, Pangram Pangram) — body, nav, copy, list layanan"
  label: "Suisse Mono — eyebrow/label ('REAL CLIENT STORIES', 'STEP • 01', counter)"
  accent: "Serif italic — kartu nilai (Ambitious/Intentional/Honest)"
  traits: [brutalist-display, extreme-negative-tracking, uppercase, grotesk, mono-label, serif-accent, custom-foundry]
color:
  bg: "#080807"
  mode: dark
  accent: ["#e8e8e3"]
---

## Apa yang Menarik
Masthead 'MONOLOG' ekstrem memenuhi viewport (ligatur 'O' spiral cair) — text IS the design. Situs beralternasi dark cinematic (#080807, grain halftone + glow hangat) dan section terang (Success Stories) — kontras keras yang memicu nav auto-invert. Sistem 4 peran font: Animo (display brutalist), Khteka (body), Suisse Mono (label), serif (accent nilai). Section CTA 'LET'S BUILD AN EXPERIENCE THAT MOVES -> PEOPLE' (Animo uppercase, tracking -4.185px) adalah bagian yang Billy paling suka.

## Teknik yang Diidentifikasi
Stack: GSAP + Three.js + Lenis (native smooth scroll — scrollIntoView berfungsi) + Barba.js (page transition). Section inversi dark<->light memicu nav mix-blend auto-invert. Teks display per-baris dirender leaf terpisah (pola per-line span). Case-study slider (01/05) + testimonial slider (01/03) + service menu bertumpuk hover-reveal (active putih / inactive abu). Palet monokrom hangat.

## Timing & Feel
Diamati: hero + sweep 5 section via scrollIntoView (Lenis native). Transisi Barba antar-halaman + smooth scroll Lenis terbukti dari stack. Hover-reveal service menu & slider case/testimonial teramati sebagai state; easing/durasi spesifik belum diukur.

## Kenapa Terasa Premium
1) Skala tipografi ekstrem (masthead memenuhi viewport, Animo 199px) = otoritas brand. 2) Inversi dark/light antar-section + nav auto-invert = engineering elegan. 3) Sistem 4 font disiplin (display/body/label/accent) masing-masing punya peran. 4) Bukti bisnis konkret ($2M+, $100k, enquiries) bukan klaim kosong. 5) Grain/halftone sebagai material film pada dark.

## Section-by-Section

### 1. Hero (`assets/bymonolog-desktop.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Masthead 'MONOLOG' full-bleed memenuhi viewport di dasar; copy editorial + globe wireframe di tengah; nav Swiss (logo kiri / menu tengah / mute + 'Start a project' kanan) |
| Typography | MONOLOG wordmark logo-glyph (ligatur 'O' spiral cair); copy hero Khteka |
| Motion | Idle grain + glow; smooth scroll Lenis; transisi halaman Barba.js |
| Color | Dark #080807, ink cream #e8e8e3, glow hangat smoky, tekstur halftone |
| Konsep | Otoritas brand: nama studio jadi objek visual utama |
| Teknik | Viewport-filling wordmark, halftone/grain overlay, atmospheric warm gradient |

### 2. Work — Success Stories (`assets/bymonolog-work.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Inversi ke BG terang; split: foto proyek besar kiri / teks kanan (counter 01/05, judul klien, stat $2M+ highlight); slider case-study |
| Typography | Section head 'SUCCESS STORIES' Animo ~199px (tracking -5.98px); judul klien Khteka 23.75px; label Suisse Mono |
| Motion | Slider case (01/05); nav auto-invert hitam via mix-blend saat lewat section terang; video per-card |
| Color | BG terang cream, ink hitam — kontras keras vs hero gelap |
| Konsep | Bukti hasil: case-study dengan metrik bisnis ($2M+, enquiries) |
| Teknik | Light/dark section inversion, mix-blend nav auto-invert, case slider + video, stat highlight chip |

### 3. Services (`assets/bymonolog-services.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Dark; multi-kolom: testimonial slider kiri (01/03), list layanan Khteka besar bertumpuk tengah (hover-reveal), kartu nilai serif kanan |
| Typography | List layanan Khteka besar (Brand Strategy/Visual Identity/Website Strategy/Design); label '(REAL CLIENT STORIES)' Suisse Mono 11.8px; kartu nilai serif |
| Motion | Hover-reveal state list (putih=aktif, abu=inaktif); testimonial slider 01/03 |
| Color | Dark #080807, ink cream + abu untuk inactive |
| Konsep | Layanan + social proof digabung: apa yang dikerjakan + suara klien |
| Teknik | Stacked hover-reveal service menu, testimonial slider, serif accent values card |

### 4. Process — Project Journey (`assets/bymonolog-process.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Dark; masthead 'PROJECT JOURNEY' Animo besar; lalu langkah bernomor (STEP • 01) split label+heading+copy kiri / video mockup kanan |
| Typography | Masthead Animo 139.5px; step heading Khteka 23.75px; label 'STEP • 01' Suisse Mono |
| Motion | Langkah sticky/berurutan; video pendukung per-step |
| Color | Dark, ink cream |
| Konsep | Metodologi transparan: perjalanan proyek langkah demi langkah |
| Teknik | Animo masthead + numbered step list (pinned/scrubbed), supporting video mockups |

### 5. CTA — LET'S BUILD ... -> PEOPLE (favorit Billy) (`assets/bymonolog-cta-type.png`)

| Aspek | Detail |
| --- | --- |
| Layout | CTA menjelang footer di atas foto studio monokrom; 4 baris Animo kiri-rata |
| Typography | Animo 139.5px weight 500 uppercase, letter-spacing -4.185px; panah '->' di-set Khteka (lintas-font) |
| Motion | Reveal (inferred); over foto grayscale desaturasi |
| Color | Foto studio grayscale, ink cream #e8e8e3 |
| Konsep | Ajakan pamungkas dengan pernyataan brutalist — bagian yang PALING disukai Billy |
| Teknik | Display Animo extreme negative tracking, per-line leaf render, glyph panah lintas-font |
