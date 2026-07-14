# VOID THEATRE — ACT III: "COUNTERWEIGHT"

**Basis feedback**: meta font jelek & "text sekedar text" · role line font+posisi
tidak disukai · nama tidak memenuhi layout ("space terpisah") · orb glow ditolak
(2×, buang permanen) · hover effect "masih biasa" (ragu, refine bukan ganti) ·
Swiss grid layout DISUKAI (pertahankan).

## Perubahan inti

### 1. Nama FIT-TO-WIDTH (fix "space terpisah")
- BILLY: kiri-atas, lebar target **60vw** dari page margin kiri, yFrac 0.34
- MAULANA: kanan-bawah, lebar target **78vw** ke page margin kanan, yFrac 0.80
- Ukuran font per baris dihitung dari pengukuran teks (scale = targetWidth /
  measuredWidth) — bukan vw statis. useTextDistortion: dukung fontSize per-line.
- Overlay DOM entrance pakai ukuran hasil ukur yang sama (sinkron crossfade).

### 2. Role = centerpiece artistik (ganti orb + ganti role line pojok)
- HAPUS: canvas orb + pemakaian useGradientOrb + blok role kiri-atas.
- BARU `.hero__ghost`: "frontend architect" PP Editorial New Italic lowercase,
  SATU baris, ukuran ~7vw, warna chrome rgba(208,208,216,0.14), letter-spacing
  0.01em, posisi diagonal di celah antara BILLY dan MAULANA (kira-kira x tengah,
  y 0.56, rotate -4deg), z di bawah text canvas (di atas fluid).
- Idle: drift parallax halus mengikuti mouse (gsap.quickTo, max ±18px, lerp feel
  0.15) + opacity breathing 0.12→0.17 sinus ~7s. Entrance: blur 18→0 + opacity,
  setelah MAULANA.

### 3. Meta corners: craft, bukan "sekedar text"
- BUANG JetBrains Mono dari hero (dep fontsource biarkan terpasang).
- Semua label meta → Switzer 500, 0.625rem, uppercase, tracking 0.28em,
  warna rgba(208,208,216,0.62).
- Micro-craft per item:
  - Status (kiri-bawah): titik 5px `#0047FF` pulsing (scale 1→1.35, opacity,
    sinus 2.2s) + label rotator tetap.
  - Kanan-bawah: `BANDUNG 6.9°S 107.6°E — HH:MM:SS` (koordinat = craft detail;
    clock tetap detik).
  - Kanan-atas: `PORTFOLIO — 2026` dengan `V.3` di baris kedua rata kanan
    opacity lebih rendah.
  - Index kiri-tengah vertikal: `01 — 05` + rule 1px vertikal 28px di atasnya.
- Angka jam: font-feature-settings "tnum" 1; jika Switzer tidak support, wrap
  digit dalam span width 1ch.

### 4. Refine hover effect (BUKAN ganti teknik)
- Chromatic split → keluarga cool SAJA: perkuat offset B (biru) & tambah bobot
  cyan pada channel G, kecilkan offset R ~50% (hilangkan kesan kuning/hijau;
  split terbaca cyan/biru/violet — identity).
- intensity 0.06 → 0.075 (warp sedikit lebih berdaging, tetap "ink").

## Yang TIDAK berubah
Fluid ink + params · counter-position + Swiss margin · clock/rotator logic ·
entrance beats nama (per-char blur) · scroll hint · reduced-motion pattern ·
crossfade DOM→canvas.

## Gates
typecheck + lint pass · console bersih · idle hidup (ghost drift + dot pulse +
clock + rotator) · nama mengisi lebar sesuai target di 1440/2560/mobile ·
tanpa forced reflow baru (rect di-cache).
