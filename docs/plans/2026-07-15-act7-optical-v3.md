# ACT VII — Optical fix Signature · Typo fix Yakushev · Hero V3

## 1. Hero Signature (SectionHero.vue) — ilusi optik & typography

Keluhan: BILLYMAULANA "tidak terlihat full", container "terlihat tidak sama".
Dua akar + fix:
- **Optical overshoot**: "A" terakhir Bebas berdiagonal — tanpa overshoot, tepi
  kanan tampak masuk. Fit ink tetap, tapi tambah overshoot kanan **+0.5% dari
  target width** khusus karena glyph tepi kanan diagonal (scale dihitung ke
  (W − 2·pad + overshoot)); tepi kiri "B" (stem datar) tetap presisi di pad.
- **Satu sumber pad lintas komponen**: --hero-pad saat ini diset di section
  (clientWidth basis) sementara AppNavigation pakai clamp vw CSS (termasuk
  scrollbar) → beda beberapa px. Fix: set `--hero-pad` di `document.documentElement`
  (root) dari layoutMasthead, dan AppNavigation logo/burger pakai
  `var(--hero-pad, clamp(1.5rem, 4vw, 4rem))`.
- Typography pass: masthead line tetap; pastikan meta/tagline/monogram semua
  left/right = var(--hero-pad) tanpa margin tambahan; verifikasi numerik ink
  B/A vs logo/burger (target ≤ 0.5px).

## 2. hero-yakushev — perbaiki "Billy"

Keluhan: typography "Billy" jelek. Set ulang pairing:
- "Billy": Switzer **500** (dari 400), letter-spacing **-0.045em** (rapat),
  font-feature 'kern' 1.
- "Maulana": Cormorant Italic 600, font-size **1.07em** relatif sans (x-height
  Cormorant lebih kecil — tanpa ini serif tampak mengecil), letter-spacing
  -0.02em, margin-left -0.01em (junction sans→italic rapat seperti referensi).
- Baseline keduanya SATU garis (inline, vertical-align baseline).
- Overshoot optik kiri: descender/bowl "B" datar = tetap di pad; kanan "a"
  bundar = overshoot +0.4%.

## 3. hero-v3 (BARU) — pages/hero-v3.vue + components/HeroVariantV3.vue

Copy penuh dari HeroVariantChdartmaker (masthead Bebas atas + nav row + kaki
3 blok + fluid + wisps + difference), lalu ISI zona tengah-bawah yang kosong
(tension berat-atas) dengan **PROJECT INDEX EDITORIAL** (pola SOTD: hero =
index karya; ref: art-yakushev numbered projects, junji-yamazaki numbered
services):

- Posisi: blok mulai ~52% viewport height, left/right = pad.
- 3 baris proyek (data dari app/constants projects yang ada — PLN MOBILE,
  FLEXBEN, UNESCO IHP): tiap baris grid 3 kolom [nomor | judul | meta]:
  - Nomor `01` Switzer 500 0.6875rem tracking 0.28em chrome 45%, align kiri
  - Judul Bebas Neue 400 clamp(2.5rem, 5.2vw, 4.75rem), lh 0.92, cream 0.92,
    uppercase, tracking -0.005em
  - Meta kanan: `SUPER APP — 2023` dst, Switzer 500 0.625rem tracking 0.28em
    chrome 50%, align kanan, satu baseline dengan judul (align-items: baseline)
  - Baris dipisah rule 1px rgba(208,208,216,0.12); padding-block 1.1rem
  - Hover: judul geser x +0.35em expo.out 0.5s + warna → #0047FF; nomor →
    cream; SELURUH baris link ke #work
- Di atas index: satu **manifesto line** pendek — `Code is my material.` —
  Cormorant Italic 600 clamp(1.375rem, 2vw, 1.875rem) cream 0.85, align kiri,
  margin-bottom 1.75rem
- Entrance: manifesto blur-in setelah nav row; baris index stagger 0.09 rise
  16px + blur 6→0 power3.out
- Collision-check numerik WAJIB nol overlap; kaki 3 blok lama tetap.

## Gates (ketiganya)
typecheck + CI lint pass · console bersih · collision-check numerik nol ·
alignment ink vs pad ≤0.5px · screenshot per halaman.
