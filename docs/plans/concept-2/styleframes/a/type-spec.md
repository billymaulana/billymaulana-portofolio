# Type spec — konsep a, Kaca Sentuh (T2)

Semua angka diukur di compositor dengan `measureText` (famili yang sama dengan yang dirender), satuan px CSS pada ukuran frame 1×.
Kotak tinta = `actualBoundingBox*`. Baseline y dihitung dari tepi atas frame.

## Grid

| Frame | Kolom | Margin | Gutter | Lebar kolom | Awal kolom yang dipakai |
|---|---|---|---|---|---|
| 1440×900 | 12 | 64 | 24 | 87,33 | k1 = 64 · k3 = 286,67 · k9 = 954,67 · tepi kanan k12 = 1376 |
| 390×844 | 4 | 16 | 12 | 80,5 | k1 = 16 · k3 = 201 · tepi kanan k4 = 374 |

Tanda grid (bukan teks): garis rambut 1px `#FFFEF5` 16% di y = 804 (1440) dan y = 752 (390), dari margin ke margin. Tanda "+" dihapus pada revisi.

## Beat splash

`splash-1440x900.jpg` menggambarkan **t = 0,85 s**: sentuhan pertama (mulai 0,30 s) sudah mekar dan sedang ditahan, sebelum sentuhan kedua di 0,90 s.
Framing 1,35× dengan titik jangkar (64, 450), bukan pusat frame, supaya huruf "B" tetap di dalam frame. Meta belum tampil.
Bahan fluida: satu tangkapan `/liquid/liquid-2`, 440 ms setelah gestur 380 ms dilepas, diperbesar 1,9× dan dikalikan 0,965.
Dengan disipasi engine saat ini, keadaan itu baru tercapai 0,82 s setelah sentuhan mulai (1,12 s bila sentuhan mulai di 0,30 s), jadi jadwal 0,85 s menuntut gestur lebih pendek atau pendinginan lebih cepat di build.

## Famili

| Peran | Famili | Berkas | Weight |
|---|---|---|---|
| Nama | Clash Display | `public/assets/fonts/clash-display/ClashDisplay-Variable.woff2` | 700 |
| Meta | Satoshi | `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 400 |
| Suara | Satoshi Italic | `public/assets/fonts/satoshi/Satoshi-VariableItalic.woff2` | 400 |

Dua famili, tiga gaya per frame. Clash Display 700 dipertahankan karena terukur: lebar tinta "Maulana" 4,105 em pada tracking −0,02 em
mengunci tepat ke kolom 3–12 di 265,29px, dan "Billy" (2,006 em) berakhir di x = 596,2, yaitu tepi kanan kolom 5 (596,67).
Dengan bevel 0,11 em (29,2px) batang 700 menjadi tabung bulat penuh tanpa muka datar.

## Teks per frame

Warna nama bukan isian dan tidak ada lantai suhu: huruf hanya berwarna di tempat kolam fluida lewat di bawahnya.
Di dalam kolam: suhu fluida yang dibiaskan, C2 `#3A1A9E` – C6 `#EE8A2A` (suhu dijepit di t = 0,90); kaustik C6 `#EE8A2A`, naik ke C9 `#FFF5B3` hanya bila suhu lokal ≥ 0,72.
Di luar kolam: rim 1px t = 0,22–0,32 (C1 `#0F0A72` – C2 `#3A1A9E`) dan noda permukaan t ≤ 0,24 (C0–C1).
Luas huruf tanpa panas (t < 0,13 pada peta suhu): 37,6% di hero-1440, 46,6% di hero-390, 70,6% di splash.
Splash: rim t = 0,15 (C1), noda permukaan t ≤ 0,08.

| Frame | Teks | Famili + berkas | Weight | px @1440 | px @390 | Tracking (em) | Leading (rasio · tinta terukur) | Warna per frasa | Posisi grid |
|---|---|---|---|---|---|---|---|---|---|
| hero-1440 | Billy | Clash Display · ClashDisplay-Variable.woff2 | 700 | 265,29 | 87,21 | −0,02 | 0,901 (jarak baseline 239) · tinta 0,840 | kaca: C2–C6 di dalam kolam, kaustik C6–C9; di luar kolam rim C1–C2 + noda C0–C1 | k1–5, tinta x 64–596,2, baseline y 390 |
| hero-1440 | Maulana | Clash Display · ClashDisplay-Variable.woff2 | 700 | 265,29 | 87,21 | −0,02 | 0,901 (jarak baseline 239) · tinta 0,680 | kaca: C2–C6 di dalam kolam, kaustik C6–C9; di luar kolam rim C1–C2 + noda C0–C1 | k3–12, tinta x 287–1376, baseline y 629 |
| hero-1440 | Frontend Engineer | Satoshi · Satoshi-Variable.woff2 | 400 | 14 | 13 | +0,005 | 1,429 (20px) · tinta 0,951 | seluruhnya C9 `#FFF5B3` | k9, x 954,67, baseline y 222 |
| hero-1440 | Bandung, Indonesia | Satoshi · Satoshi-Variable.woff2 | 400 | 14 | 13 | +0,005 | 1,429 (20px) · tinta 0,951 | `#FFFEF5` 56% | k9, x 954,67, baseline y 242 |
| hero-1440 | Leading frontend at SigmaTech | Satoshi · Satoshi-Variable.woff2 | 400 | 14 | 13 | +0,005 | 1,429 (20px) · tinta 0,951 | `#FFFEF5` 56% | k9, x 954,67, baseline y 262 |
| hero-1440 | PLN Mobile, 80M+ users | Satoshi · Satoshi-Variable.woff2 | 400 | 14 | 13 | +0,005 | 1,429 (20px) · tinta 0,821 | "80M+" C9 `#FFF5B3`; sisanya `#FFFEF5` 56% | k1–2, x 64, baseline y 569 |
| hero-1440 | Design systems for | Satoshi · Satoshi-Variable.woff2 | 400 | 14 | 13 | +0,005 | 1,429 (20px) · tinta 0,951 | `#FFFEF5` 56% | k1–2, x 64, baseline y 589 |
| hero-1440 | 200+ developers | Satoshi · Satoshi-Variable.woff2 | 400 | 14 | 13 | +0,005 | 1,429 (20px) · tinta 0,940 | "200+" C9 `#FFF5B3`; sisanya `#FFFEF5` 56% | k1–2, x 64, baseline y 609 |
| hero-1440 | 7+ years of Vue.js | Satoshi · Satoshi-Variable.woff2 | 400 | 14 | 13 | +0,005 | 1,429 (20px) · tinta 0,950 | "7+" C9 `#FFF5B3`; sisanya `#FFFEF5` 56% | k1–2, x 64, baseline y 629 (= baseline "Maulana") |
| hero-1440 | Transforming pixels into performance. Building interfaces that move millions. | Satoshi · Satoshi-Variable.woff2 | 400 | 14 | 13 | +0,005 | 1,429 (satu baris) · tinta 0,951 | `#FFFEF5` 56% | k1–6, x 64–533,4, baseline y 836 |
| hero-1440 | Always hunting for that perfect 60fps. | Satoshi Italic · Satoshi-VariableItalic.woff2 | 400 | 20 | 16 | −0,005 | 1,25 (satu baris) · tinta 0,951 | "60fps." C9 `#FFF5B3`; sisanya `#FFFEF5` 56% | k9–12, x 954,67–1273,8, baseline y 836 |
| splash-1440 | Billy | Clash Display · ClashDisplay-Variable.woff2 | 700 | 358,14 (265,29 × 1,35) | tidak ada frame splash 390 | −0,02 | 0,901 (jarak baseline 322,65) · tinta 0,840 | kaca: C3–C5 di dalam jejak; rim C1 + noda C0–C1 di luar jejak | tinta x 64–782,4, baseline y 369 |
| splash-1440 | Maulana | Clash Display · ClashDisplay-Variable.woff2 | 700 | 358,14 (265,29 × 1,35) | tidak ada frame splash 390 | −0,02 | 0,901 (jarak baseline 322,65) · tinta 0,680 | rim C1 `#0F0A72` + noda C0–C1 (di luar jejak panas) | tinta x 365,1–1835,2 (terpotong tepi kanan 1440), baseline y 691,65 |
| hero-390 | Billy | Clash Display · ClashDisplay-Variable.woff2 | 700 | 265,29 | 87,21 | −0,02 | 0,906 (jarak baseline 79) · tinta 0,840 | kaca: C2–C6 di dalam kolam, kaustik C6–C9; di luar kolam rim C1–C2 + noda C0–C1 | k1–2, tinta x 16–190,9, baseline y 400 |
| hero-390 | Maulana | Clash Display · ClashDisplay-Variable.woff2 | 700 | 265,29 | 87,21 | −0,02 | 0,906 (jarak baseline 79) · tinta 0,680 | kaca: C2–C6 di dalam kolam, kaustik C6–C9; di luar kolam rim C1–C2 + noda C0–C1 | k1–4, tinta x 16–374, baseline y 479 |
| hero-390 | Frontend Engineer | Satoshi · Satoshi-Variable.woff2 | 400 | 14 | 13 | +0,005 | 1,462 (19px) · tinta 0,951 | seluruhnya C9 `#FFF5B3` | k1–2, x 16, baseline y 40 |
| hero-390 | Bandung, Indonesia | Satoshi · Satoshi-Variable.woff2 | 400 | 14 | 13 | +0,005 | 1,462 (19px) · tinta 0,951 | `#FFFEF5` 56% | k1–2, x 16, baseline y 59 |
| hero-390 | Leading frontend | Satoshi · Satoshi-Variable.woff2 | 400 | 14 | 13 | +0,005 | 1,462 (19px) · tinta 0,951 | `#FFFEF5` 56% | k3–4, x 201, baseline y 40 |
| hero-390 | at SigmaTech | Satoshi · Satoshi-Variable.woff2 | 400 | 14 | 13 | +0,005 | 1,462 (19px) · tinta 0,951 | `#FFFEF5` 56% | k3–4, x 201, baseline y 59 |
| hero-390 | PLN Mobile, 80M+ users | Satoshi · Satoshi-Variable.woff2 | 400 | 14 | 13 | +0,005 | 1,462 (19px) · tinta 0,821 | "80M+" C9 `#FFF5B3`; sisanya `#FFFEF5` 56% | k1–2, x 16, baseline y 690 |
| hero-390 | Design systems for 200+ developers | Satoshi · Satoshi-Variable.woff2 | 400 | 14 | 13 | +0,005 | 1,462 (19px) · tinta 0,952 | "200+" C9 `#FFF5B3`; sisanya `#FFFEF5` 56% | k1–3, x 16–225,9, baseline y 709 |
| hero-390 | 7+ years of Vue.js | Satoshi · Satoshi-Variable.woff2 | 400 | 14 | 13 | +0,005 | 1,462 (19px) · tinta 0,950 | "7+" C9 `#FFF5B3`; sisanya `#FFFEF5` 56% | k1–2, x 16, baseline y 728 |
| hero-390 | Transforming pixels into performance. | Satoshi · Satoshi-Variable.woff2 | 400 | 14 | 13 | +0,005 | 1,462 (19px) · tinta 0,951 | `#FFFEF5` 56% | k1–3, x 16–231,4, baseline y 776 |
| hero-390 | Building interfaces that move millions. | Satoshi · Satoshi-Variable.woff2 | 400 | 14 | 13 | +0,005 | 1,462 (19px) · tinta 0,951 | `#FFFEF5` 56% | k1–3, x 16–230,7, baseline y 795 |
| hero-390 | Always hunting for that perfect 60fps. | Satoshi Italic · Satoshi-VariableItalic.woff2 | 400 | 20 | 16 | −0,005 | 1,25 (satu baris) · tinta 0,951 | "60fps." C9 `#FFF5B3`; sisanya `#FFFEF5` 56% | k1–3, x 16–271,3, baseline y 824 |

Semua angka memakai `tabular-nums`. Kerning: tabel kerning bawaan font ditambah tracking; tidak ada pasangan manual.

## Rasio display : meta

| Frame | Display | Meta | Rasio |
|---|---|---|---|
| 1440×900 | 265,29 | 14 | 18,9× |
| 390×844 | 87,21 | 13 | 6,7× (di bawah 10×; lihat catatan) |

Catatan 390: kedua baris berukuran sama, dikunci ke lebar 358px pada "Maulana". Skala frame dibawa kolam panas (kotak kolam ≈ 461 × 497px, terpotong tepi kiri dan kanan frame 390), bukan ukuran huruf.

## Tabrakan

Tidak ada tumpang tindih yang diniatkan. Kotak tinta diperiksa berpasangan: 55 pasangan (hero-1440, 11 teks), 1 pasangan (splash, 2 teks), 66 pasangan (hero-390, 12 teks); 0 bertumpuk.
Celah terdekat nama: descender "y" (y 435,1) ke puncak "Maulana" (y 451,3) = 16,2px di 1440; 414,8 ke 420,6 = 5,8px di 390.

## Medan panas

Kolam = tangkapan asli `/liquid/liquid-2`, satu gestur per kolam, digabung dengan operasi maksimum. Tidak ada halo, lantai suhu, atau mask berbentuk huruf; ground C0 sampai tepi kaca di luar kolam.

| Frame | Kolam (berkas di `cap/`) | Ukuran di frame (px) | Pusat (x, y) | Bobot suhu |
|---|---|---|---|---|
| hero-1440 | pool-03-t0 | 402 × 455 | 215, 255 | 0,91 |
| hero-1440 | pool-09-t1 | 418 × 402 | 520, 490 | 0,88 |
| hero-1440 | pool-21-t3 | 447 × 482 | 960, 520 | 0,90 |
| hero-1440 | pool-16-t2 | 242 × 448 | 1300, 500 | 0,85 |
| hero-390 | pool-21-t3 | 461 × 497 | 165, 440 | 0,86 |
| hero-390 | pool-09-t1 | 188 × 181 | 70, 500 | 0,74 |
| splash | splash-06-t0 | plume × 1,9 | jejak di atas "Bil" | 0,965 |

## Kaca (angka untuk shader)

| Parameter | Nilai |
|---|---|
| Lebar bevel | 0,11 em (29,2px di 265,29 · 39,4px di splash · 9,6px di 390) |
| Profil tinggi | seperempat lingkaran penuh, h = √(1 − (1 − d/bevel)²) |
| Pelunakan heightmap | blur 0,02 em (3 × box, radius 5,3px di 265,29) sebelum gradien; tanpa arah dari SDF, jadi tanpa garis miter |
| Geser paralaks dalam huruf | (0,05, 0,057) em = (13,3, 15,1)px, panjang 20,1px di 265,29 · 27,1px di splash · 6,6px di 390 |
| Lensa | offset = arah gradien × bevel × s × (0,12 + 0,18 s²), s = kemiringan dijepit 1,5; maksimum 22,8px di tepi (265,29); suku linear 0,12 dipilih untuk pembesaran ≈ 1,15× di sumbu batang (tidak diukur terpisah pada render) |
| Dispersi | 5 tap, skala offset lensa 1 ± 0,16 per tap (sebaran ± 3,6 dan ± 7,3px di tepi), geser ramp ± 0,09 per tap × kemiringan |
| Kaustik | intensitas = smoothstep(0,42, 0,95, 1 − \|det J\|) dari pemetaan lensa × gerbang suhu smoothstep(0,50, 0,60) (≥ C4) × pemutus peta streak dan peta noda; warna C6, ke C9 bila suhu ≥ 0,72; lebar mengikuti gradien det J, tidak ditetapkan |
| Peredaman kemiringan | transmisi × (1 − 0,45 × smoothstep(0,75, 1,5, kemiringan)); menggantikan "garis gelap tepi 50%" yang dihapus |
| Rim | 1px di tepi luar, t = 0,32 × (0,7–1,0 dari peta streak), tanpa faktor arah |
| Noda / gores | di atas panas: noda meredam s/d 50%, gores +0,22 suhu; tanpa panas: t = 0,24 × (0,14 + 0,9 noda + 1,6 gores + 0,5 kabut) |
| Grain | monokrom, amplitudo 0,05, butir 1px CSS, statis |
