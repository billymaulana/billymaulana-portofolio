# Type spec — c · Bidang Depan (I2)

Semua angka diukur di compositor (`measureText`, famili yang sama dengan yang dirender), lalu dibulatkan satu desimal.

## Famili dan weight

| Peran | Famili | Sumber berkas | Weight |
|---|---|---|---|
| Display (nama) | Cabinet Grotesk | Fontshare, `cdn.fontshare.com` (variable 100–900), disimpan di folder kerja `c/fonts/CabinetGrotesk-Variable.woff2` | 800 |
| Meta | Cabinet Grotesk | berkas yang sama | 500 |
| Tagline | PP Editorial New Italic | repo `public/assets/fonts/pp-editorial-new/PPEditorialNew-Regular.woff2` (berkas "Regular" berisi Italic) | 400 |

2 famili, 3 weight per frame. Tidak ada mono. Sentence case di semua peran.

Alasan sentence case untuk nama: uppercase dua baris + label kecil adalah pola yang dicatat kritikus; pada sentence case "Billy" membawa tiga ascender dan satu descender, dan descender `y` itulah yang dipakai sebagai titik tembus bidang (lihat Niat oklusi).

## Ukuran tinta display (Cabinet Grotesk 800)

| Teks | Ascent tinta / em | Descent tinta / em | Tinggi tinta / em |
|---|---|---|---|
| Billy | 0,670 | 0,180 | 0,850 |
| Maulana | 0,670 | 0,011 | 0,681 |

Lantai leading = 0,850 (tinta baris "Billy"). Leading terpasang 0,90 (jarak baseline 340 px pada 378,3 px; 91 px pada 100,8 px).
Tracking display −0,02 em (di dalam ambang −0,01 s/d −0,04; sentence case, bukan uppercase).
Fit-to-width: tinta "Maulana" termasuk tracking = 12 kolom (1344 px) di 1440 dan 358 px di 390.

## Grid

- 1440×900: 12 kolom, margin 48, gutter 24, lebar kolom 90. Awal kolom n = 48 + (n−1)·114 (kolom 4 = 390, kolom 10 = 1074). Baseline nama 446 dan 786; baris meta bawah 832 dan 852,3; garis rambut bawah y=810; garis rambut atas y=48.
- 390×844: 4 kolom, margin 16, gutter 12, lebar kolom 80,5. Semua teks mulai di kolom 1 (x=16). Baseline nama 500 (59,2 svh) dan 591.
- Tanda: garis rambut 1 px C3 `#6B2FC8`; tanda "+" 11×11 px, 1 px, C3, di (1392, 48) dan (1392, 446) pada 1440 serta (374, 28) pada 390.

## hero-1440x900

| Teks verbatim | Famili + berkas | Weight | px @1440 | px @390 | Tracking (em) | Leading (rasio · tinta terukur) | Warna | Posisi (kolom · baseline y) |
|---|---|---|---|---|---|---|---|---|
| Billy | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 800 | 378,3 | 100,8 | −0,02 | 0,90 · tinta 0,850 em (321,5 px) | "Bi" C9 `#FFF5B3`; "lly" C9 turun ke C7 `#F8BF27`–C6 `#EE8A2A` dalam radius 120 px dari titik tembus | kolom 1–6 (x 48–722,6) · 446 |
| Maulana | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 800 | 378,3 | 100,8 | −0,02 | 0,90 · tinta 0,681 em (257,4 px) | C9 `#FFF5B3` solid | kolom 1–12 (x 48–1392) · 786 |
| Transforming pixels into performance. | PP Editorial New Italic · PPEditorialNew-Regular.woff2 | 400 | 22 | 17 | −0,01 | 1,25 · tinta 23,3 px | C9 `#FFF5B3` α1 | kolom 1–3 (x 48) · 74 |
| Building interfaces that move millions. | PP Editorial New Italic · PPEditorialNew-Regular.woff2 | 400 | 22 | 17 | −0,01 | 1,25 · tinta 23,3 px | C9 `#FFF5B3` α1 | kolom 1–3 (x 48) · 101,5 |
| Frontend Engineer | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 500 | 14 | 12 | 0 | 1,45 · tinta 12,1 px | C9 `#FFF5B3` α0,72 | kolom 1–2 (x 48) · 832 |
| Bandung, Indonesia | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 500 | 14 | 12 | 0 | 1,45 · tinta 12,1 px | C9 `#FFF5B3` α0,72 | kolom 1–2 (x 48) · 852,3 |
| 7+ years of Vue.js | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 500 | 14 | 12 | 0 | 1,45 · tinta 12,2 px | C9 `#FFF5B3` α0,72, tabular-nums | kolom 4 (x 390) · 832 |
| Leading frontend at SigmaTech | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 500 | 14 | 12 | 0 | 1,45 · tinta 12,2 px | C9 `#FFF5B3` α0,72 | kolom 4–5 (x 390) · 852,3 |
| PLN Mobile, 80M+ users | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 500 | 14 | 12 | 0 | 1,45 · tinta 10,9 px | C9 `#FFF5B3` α0,72, tabular-nums | kolom 10–11 (x 1074) · 832 |
| Design system for 200+ developers | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 500 | 14 | 12 | 0 | 1,45 · tinta 12,2 px | C9 `#FFF5B3` α0,72, tabular-nums | kolom 10–11 (x 1074) · 852,3 |

Rasio display:meta = 378,3 : 14 = 27,0×.

## hero-390x844

| Teks verbatim | Famili + berkas | Weight | px @1440 | px @390 | Tracking (em) | Leading (rasio · tinta terukur) | Warna | Posisi (kolom · baseline y) |
|---|---|---|---|---|---|---|---|---|
| Billy | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 800 | 378,3 | 100,8 | −0,02 | 0,90 · tinta 0,850 em (85,6 px) | "B" C9 `#FFF5B3`; "illy" C9 turun ke C7 `#F8BF27`–C6 `#EE8A2A` dalam radius 60 px dari titik tembus | kolom 1–2 (x 16–195,7) · 500 |
| Maulana | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 800 | 378,3 | 100,8 | −0,02 | 0,90 · tinta 0,681 em (68,6 px) | C9 `#FFF5B3` solid | kolom 1–4 (x 16–374) · 591 |
| Frontend Engineer | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 500 | 14 | 12 | 0 | 1,45 · tinta 10,4 px | C9 `#FFF5B3` α0,72 | kolom 1 (x 16) · 28 |
| Bandung, Indonesia | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 500 | 14 | 12 | 0 | 1,45 · tinta 10,4 px | C9 `#FFF5B3` α0,72 | kolom 1 (x 16) · 45,4 |
| Leading frontend at SigmaTech | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 500 | 14 | 12 | 0 | 1,45 · tinta 10,6 px | C9 `#FFF5B3` α0,72 | kolom 1–2 (x 16) · 62,8 |
| Transforming pixels into performance. | PP Editorial New Italic · PPEditorialNew-Regular.woff2 | 400 | 22 | 17 | −0,01 | 1,30 · tinta 18,0 px | C9 `#FFF5B3` α1 | kolom 1–3 (x 16) · 645 |
| Building interfaces that move millions. | PP Editorial New Italic · PPEditorialNew-Regular.woff2 | 400 | 22 | 17 | −0,01 | 1,30 · tinta 18,0 px | C9 `#FFF5B3` α1 | kolom 1–3 (x 16) · 667,1 |
| 7+ years of Vue.js | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 500 | 14 | 12 | 0 | 1,45 · tinta 10,6 px | C9 `#FFF5B3` α0,72, tabular-nums | kolom 1 (x 16) · 776 |
| PLN Mobile, 80M+ users | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 500 | 14 | 12 | 0 | 1,45 · tinta 9,4 px | C9 `#FFF5B3` α0,72, tabular-nums | kolom 1–2 (x 16) · 793,4 |
| Design system for 200+ developers | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 500 | 14 | 12 | 0 | 1,45 · tinta 10,6 px | C9 `#FFF5B3` α0,72, tabular-nums | kolom 1–2 (x 16) · 810,8 |

Rasio display:meta = 100,8 : 12 = 8,4×. Di bawah ambang 10× brief: nama dua baris horizontal dengan fit 358 px ditetapkan teks konsep, dan meta sudah di batas bawah 12 px. Pada tinggi 664 svh tagline dipangkas ke kalimat pertama (tidak digambar).

## splash-1440x900

| Teks verbatim | Famili + berkas | Weight | px @1440 | px @390 | Tracking (em) | Leading (rasio · tinta terukur) | Warna | Posisi (kolom · baseline y) |
|---|---|---|---|---|---|---|---|---|
| Billy | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 800 | 378,3 | 100,8 | −0,02 | 0,90 · tinta 0,850 em (321,5 px) | C1 `#0F0A72`; "lly" naik ke C3 `#6B2FC8`–C4 `#A32BA8` dalam radius 120 px dari titik tembus | kolom 1–6 (x 48–722,6) · 446 |
| Maulana | Cabinet Grotesk · CabinetGrotesk-Variable.woff2 | 800 | 378,3 | 100,8 | −0,02 | 0,90 · tinta 0,681 em (257,4 px) | C1 `#0F0A72` solid (belum dipanaskan) | kolom 1–12 (x 48–1392) · 786 |

Beat yang digambarkan: t ≈ 1,84 s, di dalam fase 0,5–2,4 s (bidang huruf bergerak dari belakang sosok ke depan). zBidang = 0,46 dalam perjalanan −0,10 → 0,51 (progres 0,918 pada CustomEase `M0,0 C0.76,0 0.24,1 1,1`). Meta belum masuk (masuk di 3,3 s). Sosok hanya tampak sebagai volume C1–C2 di dekat bidang (jangkauan kedalaman 0,40 di depan, 0,16 di belakang); panas hanya di pita garis potong. Sisa plasma adalah tangkapan engine `/liquid/liquid-2` yang pointernya digerakkan sepanjang jalur garis potong frame ini, disaring menjadi filamen, dibatasi di C4, dan digambar di bawah nama.

## Niat oklusi (biner, tertulis)

- Uji per piksel: piksel sosok yang kedalamannya lebih dekat dari bidang huruf menutup huruf sepenuhnya; yang lebih jauh tertutup huruf sepenuhnya. Tepi 1 px AA, tidak pernah setengah transparan. Plasma berada di bidang huruf dan ikut aturan yang sama.
- hero-1440: pusat kepala x≈752 (52%). "lly" masuk ke belakang rambut di atas garis potong: 26,8% luas tinta "lly" tertutup (diukur per piksel). Di bawah garis potong batang dan ekor `y` berada di depan rambut. "Maulana" seluruhnya di depan leher, dada, dan bahu, terbaca penuh. Tidak ada huruf yang melintas di atas wajah.
- hero-390: kepala berada di belakang baris "Billy" (bukan di atasnya): 25,2% luas tinta "lly" tertutup rambut dan pipi; "Maulana" di depan dada, terbaca penuh.
- splash: bidang masih 0,05 di belakang posisi istirahat; 35,2% luas tinta "lly" tertutup, dan `l`/`a` pada "Maulana" terpotong siluet leher. Ini keadaan antara.
- Pita garis potong digambar di atas huruf pada titik tembus; huruf di sekitarnya menyerap panas (lihat kolom warna) dan tepinya bergrain 1 px sebanding dengan serapan itu. Huruf di luar radius serapan bertepi tajam.
- Teks–teks: tidak ada pasangan yang bertumpuk.

## Cek tabrakan (kotak tinta `measureText`)

| Frame | Teks | Pasangan diperiksa | Bertumpuk |
|---|---|---|---|
| hero-1440x900 | 10 | 45 | 0 |
| hero-390x844 | 10 | 45 | 0 |
| splash-1440x900 | 2 | 1 | 0 |

Jarak kotak tinta "Billy" (bawah 514,1) ke "Maulana" (atas 532,6) = 18,5 px di 1440; 5,4 px di 390 (518,1 ke 523,5). Jarak vertikal terkecil antar glyph yang bertumpang secara horizontal = 82,8 px di 1440; 22,5 px di 390.
