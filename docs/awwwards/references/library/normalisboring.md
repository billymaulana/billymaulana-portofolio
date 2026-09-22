---
type: reference
slug: normalisboring
title: Normal is Boring
source_url: https://normalisboring.es/
captured: 2026-07-26
awwwards_status: Non-awwwards
category: [agency]
style: [editorial, minimalism, swiss]
fonts: [Juana, PP Editorial New, Izmir]
grid: "Grid 2 kolom gap 0px (flush-gutter); wordmark dipecah per-karakter vertikal; body 25px kolom lebar"
grid_type: [editorial, swiss, split-panel]
motion: [scroll-scrub, text-reveal]
libraries: [gsap, lenis]
mood: [austere, premium, serene]
verdict: "saya suka grid layout dan typographynya"
influence: new
thumb: assets/normalisboring-desktop.png
summary: "Juana serif 180px w400 ls-0.007 lh1.23 uppercase + PP Editorial New Ultralight 25px body — satu-satunya referensi dengan display SERIF, dan memakai font yang sudah ada di repo."
---

# Normal is Boring

![desktop](assets/normalisboring-desktop.png)

![mobile](assets/normalisboring-mobile.png)

Dikirim Billy dalam kategori: **grid/layout + typography**.

## 1. Typography

| Tier | Ukuran | Weight | Tracking | Leading | Case |
| --- | --- | --- | --- | --- | --- |
| Display | 180px | 400 | −0.0069em | 1.23 | UPPERCASE |
| Body | 25px | 400 | 0em | 1.33 | sentence |
| Label | 13px | 400 | 0em | 1.35 | UPPERCASE |

- **rasio display : body** — **7.2×**
- **famili** — Juana (serif display) · PP Editorial New Ultralight (body) · Izmir (label)
- **weight dipakai** — 90 · 100 · 400 · 500 · 700 (**5 weight**)
- **pairing** — tiga famili dengan pembagian peran tegas: serif display, serif ultralight body,
  sans label

## 2. Motion

GSAP + Lenis. Scroll-scrub dan text-reveal; wordmark dipecah per-karakter vertikal
(`N-O-R-M-A-L`) di sisi kiri.

## 3. Visual effect

Tipografi dan grid sebagai elemen utama, tanpa shader. Level 1–2 pada hierarki anti-slop.

## 4. Color

- ground `#FFFFFF` (terang)
- ink `#000000` · cream `#ECE4DA` · **pink `#FFC0CB`**
- Aksen pink pastel di atas ground putih — kombinasi yang sebelumnya masuk daftar tidak-disukai
  Billy, tapi di sini diterima. Konteksnya: pink dipakai sebagai **blok ground section**,
  bukan sebagai aksen melayang.

## 5. Feels

Tenang dan mahal dengan cara yang berbeda dari mayoritas library. Display serif 180px pada
weight 400 dengan tracking nyaris netral (−0.0069em) membuat huruf terbaca sebagai bentuk
klasik, bukan blok padat. Leading 1.23 memberi udara yang tidak dimiliki referensi grotesk.

## Yang diambil

**Tiga hal yang belum ada di library sebelum entri ini:**

1. **Display SERIF.** Dari 95 entri sebelumnya, semua display adalah sans (grotesk/neo-grotesk/
   geometric). Ini yang pertama memakai serif (Juana) di ukuran display — dan Billy menyukainya.
   Kalibrasi sesi 2 menyimpulkan neo-grotesque menang atas serif editorial; entri ini
   menunjukkan serif **bisa** bekerja, kemungkinan karena dipasangkan dengan ground terang
   dan leading longgar, bukan di atas hitam.

2. **PP Editorial New sebagai BODY, bukan aksen.** Font ini sudah ada di repo
   (`public/assets/fonts/pp-editorial-new/`), selama ini diperlakukan sebagai aksen italic.
   Di sini dipakai Ultralight 25px untuk paragraf utama.

3. **Tracking display nyaris netral pada serif** (−0.0069em). Konsisten dengan temuan
   famili × weight: serif berkontras tidak butuh tracking rapat seperti grotesk.

## Grid

Grid 2 kolom dengan `gap: 0px` — flush-gutter, kolom bersentuhan langsung. Wordmark dipecah
per-karakter dan disusun vertikal di tepi kiri sebagai elemen struktural, bukan sebagai judul.
