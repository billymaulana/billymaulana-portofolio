---
type: reference
slug: bruno-simon
title: Bruno Simon
source_url: https://bruno-simon.com/
captured: 2026-07-26
awwwards_status: SOTD
category: [portfolio, experimental]
style: [experimental, 3d-immersive]
fonts: []
grid: "tanpa CSS grid eksplisit di viewport awal"
grid_type: [editorial]
motion: [scroll-scrub, text-reveal]
libraries: [three, canvas ×1]
mood: [playful, kinetic]
verdict: "konsep paling gila dan bagus, totalitas dan kreatif"
influence: strengthen
thumb: assets/bruno-simon-desktop.png
summary: "? —px w— ls— lh— — rasio —× · 0 weight · ground #000000"
---

# Bruno Simon — SOTD Awwwards

![desktop](assets/bruno-simon-desktop.png)

![mobile](assets/bruno-simon-mobile.png)

Dikirim Billy dalam kategori: **concept**.

> Kata Billy: "konsep paling gila dan bagus, totalitas dan kreatif"

## 1. Typography

| Tier | Ukuran | Weight | Tracking | Leading |
| --- | --- | --- | --- | --- |
| Display | —px | — | —em | — |
| Body | —px | — | —em | — |


- **rasio display : body** — **—×**
- **famili** — tidak ada teks DOM
- **weight dipakai** — — (**0 weight**)
- **case display** — sentence case

Tidak ada teks DOM sama sekali di viewport awal (collector mengembalikan nol elemen teks). Semua huruf adalah **geometri 3D** di dalam scene, bukan tipografi CSS.

## 2. Motion

Three.js + physics engine. Mobil dikendalikan keyboard, punya suspensi, tabrakan, dan jejak ban. Objek portofolio dijatuhkan sebagai benda fisik.

Library terdeteksi: three, canvas ×1.

## 3. Visual effect

Level tertinggi hierarki anti-slop: bukan efek yang ditempel ke halaman, melainkan halaman yang **adalah** efeknya.

## 4. Color

- ground `#000000` (gelap)
- warna dominan: #FFFFFF

## 5. Feels

Bermain-main dan total. Tidak ada satu pun konvensi web yang dipertahankan — tanpa nav, tanpa scroll, tanpa heading. Yang menahannya dari terasa main-main murahan adalah eksekusi fisikanya yang benar-benar terasa berat.

## Grid

Tidak ada grid DOM. Seluruh halaman adalah satu canvas WebGL — portofolio disusun sebagai lanskap 3D yang dijelajahi dengan mengemudikan mobil.

Terdeteksi di DOM: tanpa CSS grid eksplisit di viewport awal.

## Yang diambil

Satu-satunya entri di library dengan **nol teks DOM**. Berguna sebagai patokan ujung ekstrem: kalau konsepnya cukup kuat, tipografi boleh absen sepenuhnya. Bukan pola yang bisa dipakai untuk portofolio yang perlu terbaca mesin pencari.
