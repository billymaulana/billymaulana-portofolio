---
type: reference
slug: origin-studio
title: Origin Studio
source_url: https://origin-studio-template.webflow.io/
captured: 2026-07-26
awwwards_status: Non-awwwards
category: [agency, portfolio]
style: [editorial, minimalism, swiss]
fonts: [Inter]
grid: "Grid 4 kolom gap 32px; wordmark per-karakter 173px uppercase; body 22px weight 300; label 13px tracking +0.16em"
grid_type: [swiss, editorial, edge-anchored]
motion: [scroll-scrub, text-reveal]
libraries: [gsap, lenis]
mood: [austere, premium, clinical]
verdict: "saya suka typographynya"
influence: strengthen
thumb: assets/origin-studio-desktop.png
summary: "Inter satu famili di weight 200-500 saja — display 173px weight 500, body 22px weight 300, label +0.1625em uppercase. Bukti bahwa Inter ringan pun disukai."
---

# Origin Studio

![desktop](assets/origin-studio-desktop.png)

![mobile](assets/origin-studio-mobile.png)

## 1. Typography

- **display** — 173px / Inter **500** / −0.03em / lh 1.00 / uppercase
- **body** — 22px / Inter **300** / −0.03em / lh 1.60 / capitalize
- **label** — 13px / Inter 400 / **+0.1625em** / lh 1.60 / uppercase
- **rasio display : body** — **7.9×**
- **weight yang dipakai di seluruh situs** — 200 · 300 · 400 · 500 (tidak ada 600+)

## 2. Motion

scroll-scrub · text-reveal — terdeteksi: gsap, lenis (di atas Webflow)

## 3. Visual effect

Tipografi itu sendiri, tanpa shader. Level 1–2 pada hierarki anti-slop; lolos karena proporsi
dan disiplin weight, bukan teknik.

## 4. Color

- ground `#050505` · ink `#F5F5F5` · lapis `rgba(255,255,255,0.02)` dan `0.05`
- Monokrom penuh. Kedalaman dibuat dari tiga tingkat putih transparan, bukan dari hue.

## 5. Feels

Tenang dan mahal tanpa satu pun elemen berat. Weight maksimum 500 pada display 173px membuat
huruf terbaca sebagai garis arsitektural, bukan blok. Label ber-tracking +0.16em memberi jeda
yang membuat bagian kecil terasa disengaja.

## Yang diambil

**Bukti tandingan untuk revisi weight 2026-07-26.** Kalibrasi sesi 2 menyimpulkan "default
display adalah berat 700–900" setelah Billy memilih Inter 800 di atas Switzer 300. Situs ini —
yang Billy sebut *"saya suka typographynya"* — memakai Inter **500** di display dan **300** di
body, tanpa satu pun weight ≥600.

Kesimpulan yang lebih tepat: **weight bukan diskriminator tunggal.** Inter 800 dan Inter 500
sama-sama diterima. Yang konsisten di keduanya adalah tracking negatif (−0.03em) dan disiplin
jumlah weight. Revisi "default berat" karena itu diturunkan statusnya jadi belum-terbukti dan
menunggu uji ulang isolatif.

Temuan kedua: label `+0.1625em` uppercase. Ini referensi **kedua** (setelah porto-template)
yang memakai tracking positif lebar pada label — jadi pola itu tidak selalu "AI slop";
yang menentukan adalah konteks dan disiplin sisanya.

## Grid

Grid 4 kolom dengan gap 32px (dan 14.4px di blok rapat). Wordmark dipecah per-karakter,
uppercase, mengisi lebar penuh.
