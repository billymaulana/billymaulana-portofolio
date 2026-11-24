# Type spec — b · Piksel Pijar (W2) · revisi 1

Berkas: `splash-1440x900.jpg`, `hero-1440x900.jpg`, `hero-390x844.jpg`.

## Grid

| Frame | Kolom | Margin | Gutter | Lebar kolom | Garis kunci |
|---|---|---|---|---|---|
| 1440×900 | 12 | 32 px | 24 px | 92,67 px (pitch 116,67) | baseline nama y=500 dan y=800; kolom 11 mulai x=1198,67; margin kanan x=1408 |
| 390×844 | 4 | 16 px | 12 px | 80,5 px (pitch 92,5) | baseline nama y=560 dan y=654 |

Tidak ada garis saluran, tik, atau tanda registrasi di frame mana pun.

## Beat splash

`splash-1440x900.jpg` menggambarkan **t = 1,80 s**: 0–0,3 s ground C0 + grain · 0,3–1,5 s piksel makro hadap-depan (bujur sangkar 470 px, pusat 720/392) naik suhu dalam 9 cut C1→C9 · 1,5–1,75 s tahan di C10 · **1,75–1,9 s sisi bawah melorot dan lidah pertama turun (frame ini)** · 1,9 s dst. kamera mundur sampai piksel menjadi titik huruf i (68 px), panas merambat ke kerak nama.

## Pengukuran famili display

Diukur di canvas pada 400 px (alpha > 127).

| Famili | Cap height | Stem (l) | Stem:cap | Garis tipis (M) | Rasio tinta "Billy" | Rasio tinta "Maulana" | Tinta asc+desc "Billy" |
|---|---|---|---|---|---|---|---|
| PP Editorial New Ultrabold 800 | 0,800 em | 0,180 em | 0,225 | 0,055 em | 0,379 | 0,425 | 1,065 em |
| Clash Display 700 (pembanding) | 0,670 em | 0,1875 em | 0,280 | 0,180–0,1875 em | 0,554 | 0,580 | 0,840 em |

Dipakai: PP Editorial New Ultrabold.

Titik huruf i: bujur sangkar bermaterial sama dengan piksel splash (aset yang sama, diluruskan). 1440: sisi 68 px, pusat (271,3 / 300,5), sisi bawah sejajar dasar titik asli (y=334,5). 390: sisi 22 px, pusat (91,0 / 497,1).

## Tabel teks

Warna meta: C9 `#FFF5B3`; "72%" dan "62%" adalah opasitas C9 di atas C0 `#050507`. Semua meta `font-variant-numeric: tabular-nums`, sentence case, satu ukuran per frame.

### hero-1440x900

| Frame | Teks | Famili + berkas | Weight | Ukuran @1440 | Ukuran @390 | Tracking | Leading (rasio · tinta terukur) | Warna | Posisi |
|---|---|---|---|---|---|---|---|---|---|
| hero 1440 | Billy | PP Editorial New · `public/assets/fonts/pp-editorial-new/PPEditorialNew-Ultrabold.woff2` | 800 | 268 px | 84 px | −0,02 em | 1,119 (300 px) · tinta 1,065 | medan termal: kerak C2–C3, memanas ke C4–C5 dekat titik i; retakan dan inti stem sampai C8–C9 di dekat titik i, turun ke C3–C4 di ujung jauh; titik i = material piksel splash, inti C10 | kol 1–6, tepi tinta x=32, baseline y=500, tinta y 277,8–563,2 |
| hero 1440 | Maulana | PP Editorial New · `public/assets/fonts/pp-editorial-new/PPEditorialNew-Ultrabold.woff2` | 800 | 268 px | 84 px | −0,02 em | 1,119 (300 px) · tinta 0,849 | medan termal: kerak C2–C3, memanas ke C4–C5 dekat titik i; retakan dan inti stem sampai C8–C9 di dekat titik i, turun ke C3–C4 di ujung jauh | kol 1–10 (fit 1141,1 px), tepi tinta x=32, baseline y=800, tinta y 577,8–805,4 |
| hero 1440 | Transforming pixels into performance. | Satoshi · `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 500 | 14 px | 12 px | −0,005 em | 1,429 (20 px) · tinta 0,968 | C9 100% | kol 1–3, x=32, baseline y=48 |
| hero 1440 | Building interfaces that move millions. | Satoshi · `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 500 | 14 px | 12 px | −0,005 em | 1,429 (20 px) · tinta 0,968 | C9 62% | kol 1–3, x=32, baseline y=68 |
| hero 1440 | Frontend Engineer | Satoshi · `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 500 | 14 px | 12 px | −0,005 em | 1,429 (20 px) · tinta 0,968 | C9 100% | kol 11–12, x=1198,67, baseline y=48 |
| hero 1440 | Bandung, Indonesia | Satoshi · `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 500 | 14 px | 12 px | −0,005 em | 1,429 (20 px) · tinta 0,968 | C9 62% | kol 11–12, x=1198,67, baseline y=68 |
| hero 1440 | 7+ years in Vue.js | Satoshi · `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 500 | 14 px | 12 px | −0,005 em | 1,429 (20 px) · tinta 0,968 | C9 72% | kol 11–12, x=1198,67, baseline y=440 |
| hero 1440 | PLN Mobile, 80M+ users | Satoshi · `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 500 | 14 px | 12 px | −0,005 em | 1,429 (20 px) · tinta 0,968 | C9 72% | kol 11–12, x=1198,67, baseline y=460 |
| hero 1440 | Design system, 200+ developers | Satoshi · `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 500 | 14 px | 12 px | −0,005 em | 1,429 (20 px) · tinta 0,968 | C9 72% | kol 11–12, x=1198,67 s/d 1404,1, baseline y=480 |
| hero 1440 | Leading frontend at SigmaTech | Satoshi · `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 500 | 14 px | 12 px | −0,005 em | 1,429 (20 px) · tinta 0,968 | C9 72% | kol 11–12, x=1198,67, baseline y=500 |
| hero 1440 | Always hunting for that perfect 60fps. | Satoshi Italic · `public/assets/fonts/satoshi/Satoshi-VariableItalic.woff2` | 500 | 14 px | 12 px | −0,005 em | 1,429 (20 px) · tinta 0,968 | C9 72% | kol 11–12, rata kanan x=1408, baseline y=852 |

### hero-390x844

| Frame | Teks | Famili + berkas | Weight | Ukuran @1440 | Ukuran @390 | Tracking | Leading (rasio · tinta terukur) | Warna | Posisi |
|---|---|---|---|---|---|---|---|---|---|
| hero 390 | Billy | PP Editorial New · `public/assets/fonts/pp-editorial-new/PPEditorialNew-Ultrabold.woff2` | 800 | 268 px | 84 px | −0,02 em | 1,119 (94 px) · tinta 1,065 | medan termal: kerak C2–C3, memanas ke C4–C5 dekat titik i; retakan dan inti stem sampai C8–C9 di dekat titik i, turun ke C3–C4 di ujung jauh; titik i = material piksel splash | kol 1–3, tepi tinta x=16 s/d 206,3, baseline y=560, tinta y 490,4–579,8 |
| hero 390 | Maulana | PP Editorial New · `public/assets/fonts/pp-editorial-new/PPEditorialNew-Ultrabold.woff2` | 800 | 268 px | 84 px (fit 357,7 px) | −0,02 em | 1,119 (94 px) · tinta 0,849 | medan termal: kerak C2–C3, memanas ke C4–C5 dekat titik i; retakan dan inti stem sampai C8–C9 di dekat titik i, turun ke C3–C4 di ujung jauh | kol 1–4, tepi tinta x=16 s/d 373,7, baseline y=654, tinta y 584,4–655,7 |
| hero 390 | Transforming pixels into performance. | Satoshi · `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 500 | 14 px | 12 px | 0 em | 1,333 (16 px) · tinta 0,968 | C9 100% | kol 1–3, x=16, baseline y=36 |
| hero 390 | Building interfaces that move millions. | Satoshi · `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 500 | 14 px | 12 px | 0 em | 1,333 (16 px) · tinta 0,968 | C9 62% | kol 1–3, x=16, baseline y=52 |
| hero 390 | Frontend Engineer | Satoshi · `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 500 | 14 px | 12 px | 0 em | 1,333 (16 px) · tinta 0,968 | C9 100% | kol 3–4, rata kanan x=374, baseline y=36 |
| hero 390 | Bandung, Indonesia | Satoshi · `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 500 | 14 px | 12 px | 0 em | 1,333 (16 px) · tinta 0,968 | C9 62% | kol 3–4, rata kanan x=374, baseline y=52 |
| hero 390 | 7+ years in Vue.js | Satoshi · `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 500 | 14 px | 12 px | 0 em | 1,333 (16 px) · tinta 0,968 | C9 72% | kol 1–2, x=16, baseline y=716 |
| hero 390 | PLN Mobile, 80M+ users | Satoshi · `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 500 | 14 px | 12 px | 0 em | 1,333 (16 px) · tinta 0,968 | C9 72% | kol 1–2, x=16, baseline y=732 |
| hero 390 | Design system, 200+ developers | Satoshi · `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 500 | 14 px | 12 px | 0 em | 1,333 (16 px) · tinta 0,968 | C9 72% | kol 1–3, x=16, baseline y=748 |
| hero 390 | Leading frontend at SigmaTech | Satoshi · `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 500 | 14 px | 12 px | 0 em | 1,333 (16 px) · tinta 0,968 | C9 72% | kol 1–2, x=16, baseline y=764 |
| hero 390 | Always hunting for that perfect 60fps. | Satoshi Italic · `public/assets/fonts/satoshi/Satoshi-VariableItalic.woff2` | 500 | 14 px | 12 px | 0 em | 1,333 (16 px) · tinta 0,968 | C9 72% | kol 1–3, x=16, baseline y=812 |

### splash-1440x900

| Frame | Teks | Famili + berkas | Weight | Ukuran @1440 | Ukuran @390 | Tracking | Leading (rasio · tinta terukur) | Warna | Posisi |
|---|---|---|---|---|---|---|---|---|---|
| splash 1440 | Transforming pixels into performance. | Satoshi · `public/assets/fonts/satoshi/Satoshi-Variable.woff2` | 500 | 14 px | 12 px (splash 390 tidak digambar) | −0,005 em | 1,429 (20 px) · tinta 0,968 | C9 72% | kol 1–3, x=32, baseline y=868 |

## Rasio display:meta

| Frame | Display | Meta | Rasio |
|---|---|---|---|
| 1440 | 268 px | 14 px | 19,1× |
| 390 | 84 px (kedua baris) | 12 px | 7,0× (di bawah 10×; lihat catatan) |

Catatan 390: dua baris berukuran sama sesuai revisi; "Maulana" di-fit ke 358 px sehingga ukuran berhenti di 84 px, "Billy" pada ukuran itu selebar 190,3 px. Syarat ≥ 10× tidak terpenuhi di ponsel.

## Jumlah famili dan weight

Dua famili (PP Editorial New, Satoshi). Weight: 800 dan 500; 500 dipakai tegak dan italic.

## Tabrakan

Kotak tinta dari `measureText` (actualBoundingBox), semua pasangan diperiksa: 1440 = 55 pasangan, 0 bertumpuk; 390 = 55 pasangan, 0 bertumpuk; splash = 1 teks, 0 pasangan. Tidak ada tumpukan yang diniatkan. Celah vertikal tinta "Billy"–"Maulana": 14,6 px di 1440 (y 563,2 → 577,8), 4,6 px di 390 (y 579,8 → 584,4).

Titik i (68 px) dan jejaknya tidak masuk daftar kotak teks; jejak berakhir di y=118, x≈300–335, di kanan tagline (x ≤ 266,9).

## Medan termal (bukan teks)

- Suhu huruf = kerak + retakan, dikalikan kehangatan w = exp(−(G/780 px)²), G = jarak geodesik dari titik i (biaya 1 di dalam tinta, 4 di ground; G maksimum terukur 1701 px di 1440). Di 390 skala 84/268 dengan falloff ×1,15.
- Kerak: suhu 0,31 (jauh) → 0,60 (dekat), relief dari tekstur cast-crust (high-pass ±0,14, luminans ±0,20).
- Retakan: tepi sel Voronoi 58 px (dan 24 px di stem tebal) + retakan tekstur asli; suhu 0,44 (jauh) → 0,975 (dekat); retakan mati digelapkan 0,10. Pendar retakan lebar 10 px, amplitudo 0,34.
- Inti stem: hanya di jarak-dalam > 0,58 × setengah stem, dipecah pelat derau 70 px; suhu 0,34 → 0,88.
- Tidak ada pita kontur, rim, atau pendar di luar huruf selain pendar titik i (radius 40 px, suhu ≤ 0,43).
- Jejak: satu tangkapan `/liquid/liquid-2`, dipersempit ×0,42, panjang 148 px di 1440 (102 px di 390), suhu ≤ 0,58.
- Piksel splash: aset `pixel-macro-1.png` diluruskan perspektifnya ke bujur sangkar; di luar badan hanya pendar analitik (tanpa percik). Putih C9–C10 = 1,70% frame.
- Grain: monokrom, distribusi segitiga, amplitudo ±0,05, statis, di seluruh frame termasuk teks.
