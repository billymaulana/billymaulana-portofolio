---
type: reference
slug: jasonbergh
title: Jason Bergh
source_url: https://www.jasonbergh.com/
captured: 2026-07-26
awwwards_status: Non-awwwards
category: [portfolio, editorial]
style: [editorial, cinematic]
fonts: [MonumentgroteskMono, Monumentgrotesk, Abcsimonmono]
grid: "3 kolom gap 0px · 3 kolom gap 0px · 2 kolom gap 0px"
grid_type: [editorial, swiss, asymmetric]
motion: [scroll-scrub, text-reveal, morph, cursor-driven]
libraries: [gsap, lenis, canvas ×1, video ×134, webflow]
mood: [premium, nocturnal, serene]
verdict: "typography bagus, motion bagus, cinematic, grid/layout bagus terutama di halaman /about"
influence: strengthen
thumb: assets/jasonbergh-desktop.png
summary: "MonumentgroteskMono 95.04px w200 ls-0.05 lh1.2 — rasio —× · 3 weight · ground #1E1E1C"
---

# Jason Bergh

![desktop](assets/jasonbergh-desktop.png)

![mobile](assets/jasonbergh-mobile.png)

![detail](assets/jasonbergh-about.png)

Dikirim Billy dalam kategori: **typography + motion + grid**.

> Kata Billy: "typography bagus, motion bagus, cinematic, grid/layout bagus terutama di halaman /about"

## 1. Typography

| Tier | Ukuran | Weight | Tracking | Leading |
| --- | --- | --- | --- | --- |
| Display | 95.04px | 200 | -0.05em | 1.2 |
| Body | —px | — | —em | — |
| Label | 11.952px | 400 | 0em | 1 |

- **rasio display : body** — **—×**
- **famili** — MonumentgroteskMono · Monumentgrotesk · Abcsimonmono · Editorialnew
- **weight dipakai** — 200 · 400 · 500 (**3 weight**)
- **case display** — sentence case

**PP Editorial New weight 200** (Ultralight) pada 149.76px, tracking −0.025em, leading 1.22. Teknik kuncinya: huruf kapital awal "J" dan "B" memakai varian **EditorialnewItalic**, sedangkan sisa kata ("ason", "ergh") tetap roman — italic dipakai per-huruf sebagai swash, bukan per-kata. Label memakai **Monument Grotesk Mono** turun sampai 7.2px.

## 2. Motion

GSAP + Lenis. Video latar 134 elemen. Scroll-scrub dan text-reveal.

Library terdeteksi: gsap, lenis, canvas ×1, video ×134, webflow.

## 3. Visual effect

Nama besar ditumpuk tepat di atas wajah pada video potret gelap, teks cream menembus bayangan. Tanpa shader — kekuatannya di kontras tipografi dan pemilihan frame.

## 4. Color

- ground `#1E1E1C` (gelap)
- warna dominan: #FFEEC8 · #1E1E1C · #000000

## 5. Feels

Sinematik dan tenang. Cream hangat di atas hijau-teal gelap. Yang membuatnya mahal adalah dua hal terukur: weight 200 pada ukuran 149.76px (tipis di ukuran besar — kebalikan refleks "besar harus tebal"), dan penggaris mono 7.2px yang memberi kesan instrumen presisi.

## Grid

Grid 2 dan 3 kolom dengan `gap: 0px` (flush). Di /about: penggaris numerik vertikal (0 10 20 … 180) dicetak di tepi kiri DAN kanan sebagai elemen struktural yang terlihat — grid tidak disembunyikan, justru dipamerkan. Label diletakkan counter-positioned: DIRECTOR menempel tepi kiri, FATHER menempel tepi kanan, DP di poros tengah.

Terdeteksi di DOM: 3 kolom gap 0px · 3 kolom gap 0px · 2 kolom gap 0px.

## Yang diambil

**PP Editorial New sudah ada di repo** (`public/assets/fonts/pp-editorial-new/`). Selama ini diperlakukan sebagai aksen italic; di sini ia jadi display utama pada weight 200. Rasio display:label = 149.76 ÷ 7.2 = **20.8×**.
