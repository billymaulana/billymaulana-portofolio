---
type: reference
slug: emotion-agency
title: "Emotion Agency (promo.emotion-agency.com)"
source_url: https://promo.emotion-agency.com/
captured: 2026-07-18
category: [agency, experimental]
style: [3d-immersive, cinematic, experimental]
fonts: [Aeonik, Aeonik Fono]
grid: counter-positioned split hero (diagonal tension) + narasi 3D kontinu antar-section
grid_type: [asymmetric, split-panel]
motion: [text-reveal, kinetic-type, scroll-scrub]
libraries: [nuxt3, three, gsap, webgl, escroll]
mood: [cinematic, mystic, tense]
thumb: assets/emotion-agency-desktop.png
summary: "Situs promo agency WebGL imersif: scene 3D pilar + lantai reflektif + cahaya volumetrik ungu, hero counter-positioned (Cutting edge / Frontend solutions) Aeonik cream, audio-gate 'neural interface', narasi 3D kontinu Problem->Solution->Projects->About (figur wireframe menempuh journey, kamera scroll-scrub)."
typography:
  primary: "Aeonik (weight 400) dengan stylistic alternates quirky (glyph 'e' terbalik jadi 'ǝ', ligatur tt/tl squared); ticker & eyebrow pakai mono Aeonik Fono"
  traits: [geometric-grotesk, stylistic-alternates, mono-ticker, cream-on-dark]
color:
  bg: "#25293c"
  mode: dark
  accent: ["#7c4dff", "#f6f5e9"]
---

> **Dikirim ulang Billy 2026-07-26** dalam kelompok **Aeonik** (bersama 14 situs lain), kali ini
> sebagai referensi *typography*. Verdict Billy untuk kelompok itu: "saya suka typographynya".
> Entri ini sudah ada sejak 2026-07-18 sebagai referensi motion/3D; sekarang ia juga jadi
> anggota kelompok Aeonik — dan datanya cocok dengan pola kelompok itu: **weight 400, tracking
> netral, satu-dua weight untuk seluruh situs**. Lihat `../typography-execution-patterns.md`.

## Apa yang Menarik
Audio-gate bertema sci-fi ('// INITIALIZING NEURAL INTERFACE...') dengan pilihan ENTER WITH/WITHOUT AUDIO — bagian dari experience, bukan sekadar loader. Setelah masuk: seluruh situs adalah satu narasi WebGL 3D kontinu. Hero: pilar monolitik + lantai reflektif + volumetric light. Lalu Problem->Solution->Projects->About memakai landscape ungu low-poly yang sama dengan figur wireframe soliter menempuh perjalanan (menghadapi pegunungan -> altar solusi -> puncak 'Recent Successes' -> canyon menuju horizon). Tipografi hero counter-positioned; heading section Aeonik 52px cream; eyebrow mono bracket '[ ... ]'.

## Teknik yang Diidentifikasi
Stack dideklarasikan di hero ticker: Nuxt3 + WebGL + GSAP + eScroll + Three.js + Storyblok. Diverifikasi live: canvas WebGL2 full-bleed. eScroll = transform-based smooth scroll (window.scrollY tetap 0; scroll harus di-trigger lewat anchor nav, bukan API browser). Teks di-split per-huruf/kata jadi node terpisah untuk reveal. Tipografi Aeonik 400 + stylistic alternates + Aeonik Fono mono. Narasi 3D memakai SATU scene yang kamera-nya scroll-scrubbed melintasi section (kontinuitas subjek + environment antar-section).

## Timing & Feel
Diamati: masuk gate (ENTER WITHOUT SOUND) -> intro reveal -> hero. Sweep 6 section dilakukan via klik anchor nav (eScroll menganimasikan). Teks per-huruf = text-reveal ber-stagger. Scene 3D scroll-scrubbed KUAT terbukti dari kontinuitas figur/kamera antar-section (Problem->About), meski parameter easing/durasi spesifik belum diukur.

## Kenapa Terasa Premium
1) Audio-gate sebagai ritual masuk menaikkan perceived value. 2) Bukan hero-3D lalu section flat — SELURUH halaman satu scene 3D naratif, langka & mahal. 3) Counter-positioned typography (diagonal tension) bukan hero center generik. 4) Type embedded dalam depth 3D (Projects) bukan overlay datar. 5) Typeface berlisensi Aeonik + Fono dengan alternates = identitas. 6) Ticker stack jujur-teknis memposisikan agency sebagai developer-first.

## Section-by-Section

### 1. Hero (`assets/emotion-agency-desktop.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Counter-position (diagonal tension): 'Cutting edge.' kiri-atas, 'Frontend solutions.' kanan-bawah; ticker stack kanan-atas; pill CTA 'Ready to Talk?' tengah; sub-copy kiri-bawah |
| Typography | Aeonik 400 display besar (stylistic alternates 'ǝ', ligatur squared) cream #f6f5e9; ticker mono Aeonik Fono |
| Motion | Audio-gate intro -> reveal; teks per-huruf (text-reveal); scene WebGL idle + partikel |
| Color | Ground #25293c, aksen violet #7c4dff (glow + gradient pill), ink cream #f6f5e9 |
| Konsep | Thesis brand: cutting-edge frontend; tipografi membingkai scene 3D |
| Teknik | WebGL2 scene (pilar + lantai reflektif + volumetric light + starfield), per-char split, marquee ticker |

### 2. What We Do (`assets/emotion-agency-what-we-do.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Centered monumental: eyebrow mono bracket -> heading 52px -> sub-copy, semua center |
| Typography | Eyebrow mono Aeonik Fono violet '[ WHAT'S NEXT-GENERATION FRONTEND? ]'; heading Aeonik 52px cream 'Complex Animations, and Modern Interfaces — That's Our Passion'; sub 16px |
| Motion | Objek 3D violet kecil mengambang inline di dalam teks heading; reveal per-word (inferred) |
| Color | Dark violet starfield, ink cream + body putih |
| Konsep | Pernyataan misi: passion untuk animasi kompleks + interface modern |
| Teknik | Floating inline WebGL object di tengah teks, centered statement layout, pola eyebrow mono bracket |

### 3. The Problem (`assets/emotion-agency-problem.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Kiri-rata (eyebrow + heading + sub-copy) di atas scene 3D full-bleed |
| Typography | Eyebrow mono '[ THE PROBLEM ]'; heading 'Solving complex visual challenges' Aeonik 52px cream; sub 16px |
| Motion | Scene 3D scroll-scrubbed (kamera menembus landscape); section tinggi ~4956px = pinned/scrubbed |
| Color | Landscape ungu low-poly malam, bulan sabit, arc bercahaya, starfield |
| Konsep | Metafora: figur wireframe soliter menghadapi pegunungan = tantangan visual kompleks |
| Teknik | WebGL low-poly terrain + karakter wireframe, pinned scroll-scrub camera, atmospheric depth |

### 4. The Solution (`assets/emotion-agency-solution.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Split: heading kiri-bawah, copy kanan-bawah; scene 3D mengisi atas |
| Typography | Eyebrow '[ INTERFACES THAT YOU NEED IN ONE TEAM ]'; heading 'Emotion solves any Frontend challenges' 52px cream; copy 16px kanan |
| Motion | Kontinuitas kamera 3D dari Problem (figur maju ke altar bercahaya); scroll-scrub (inferred) |
| Color | Ungu cinematic + glow violet, ink cream |
| Konsep | Resolusi journey: figur mencapai altar = solusi lengkap yang dijanjikan |
| Teknik | Continuous 3D narrative scene (kamera & subjek berlanjut antar-section), split-text layout |

### 5. Projects (`assets/emotion-agency-projects.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Centered: eyebrow '[ PROJECTS ]' + heading 'Recent Successes' ter-embed di lembah 3D (di antara puncak) |
| Typography | Heading Aeonik 52px cream centered; eyebrow mono |
| Motion | Type menyatu dengan scene 3D (kamera zoom -> teks duduk di antara puncak); project cards/video menyusul (4 video di halaman) |
| Color | Ungu landscape + moon + arc bercahaya |
| Konsep | Karya sebagai puncak narasi; type sebagai bagian environment, bukan overlay |
| Teknik | Type embedded in 3D depth (parallax teks vs terrain), project showreel video |

### 6. About (`assets/emotion-agency-about.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Asimetris 2 kolom: statement + body kiri; 'Vision' & 'Values' kanan; scene 3D canyon di belakang |
| Typography | Eyebrow '[ WHO ARE WE? ]'; heading 'We want to make your business easier' 52px cream; sub-heading 'Vision'/'Values' 32px; body 16px |
| Motion | Kamera 3D menyusuri canyon menuju horizon (akhir journey); scroll-scrub (inferred) |
| Color | Ungu + cream, body putih |
| Konsep | Penutup naratif: siapa kami + visi/nilai, journey 3D mencapai ujung horizon |
| Teknik | Asymmetric 2-col grid di atas scene 3D kontinu, kamera recede-to-horizon |
