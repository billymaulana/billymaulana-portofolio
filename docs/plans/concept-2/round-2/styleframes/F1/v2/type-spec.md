# Type spec — F1 · Rana Kedua (putaran 2, revisi 2)

Revisi 1 (min 5,7 menurut kritikus) diarsipkan di `v1/`. Semua posisi di bawah ini diukur dari **baris piksel hasil
render**, bukan dari metrik font: metrik `measureText` meleset 2,6 px dari piksel, sehingga konstanta baseline dikoreksi
dari 0,835 em ke 0,823 em.

Satu famili: Archivo (Google Fonts, OFL) dalam dua instance. Tanpa mono. Font hero dipilih Billy dari spesimen buta.

| Peran | Famili · instance | Weight · width |
|---|---|---|
| Nama | Archivo Expanded | 800 · `font-stretch: 125%` |
| Tagline, meta, etos | Archivo | 500 · 100% |

## Grid
- 1440×900: margin 48 di keempat sisi (cap-top BILLY y 48, baseline MAULANA y 852), 12 kolom (90 px, gutter 24).
  Tepi kiri tinta semua teks di x 48 (left bearing nama 0,085 em dikompensasi).
- 390×844: margin 16.

## hero-1440x900 · touch-1440x900

| Teks | Ukuran / leading | Tracking | Warna | Posisi (piksel) |
|---|---|---|---|---|
| BILLY | 207,8 px / 1,0 | −0,02 em | C9 `#FFF5B3` | tinta x 48–742 · cap-top 48 · baseline 191 |
| MAULANA | 207,8 px / 1,0 | −0,02 em; "L" +0,05 em | C9 `#FFF5B3` | tinta x 48–1392 (12 kolom) · cap-top 709 · baseline 852 |
| Transforming pixels into performance. / Building interfaces that move millions. | 20 px / 28 px | −0,01 em | C9 | x 48 · kotak y 236–292 |
| Always hunting for that perfect 60fps. | 14 px / 20 px | 0 | C9 α 0,72; "60fps." α 1 | x 48 · y 308–328 |
| Frontend Engineer / Bandung, Indonesia | 14 px / 20 px | 0 | C9 α 0,72 | x 48 · y 532–572 |
| 7+ years of Vue.js / Leading frontend at SigmaTech | 14 px / 20 px | 0, tabular-nums | C9 α 0,72 | x 48 · y 584–624 |
| PLN Mobile, 80M+ users / Design system for 200+ developers | 14 px / 20 px | 0, tabular-nums | C9 α 0,72 | x 48 · y 636–676 |

Rasio display:meta 207,8 : 14 = 14,8×. Dua kata nama berukuran sama.

Jarak antarhuruf MAULANA (titik terdekat, px): M–A 15 · A–U 11 · U–L 28 · L–A 13 · A–N 15 · N–A 15. Pasangan "LA" semula
4–5 px; "L" diberi +0,05 em dan ukuran nama diturunkan dari 209,4 ke 207,8 px agar lebar tetap 12 kolom.

## hero-390x844

| Teks | Ukuran / leading | Tracking | Warna | Posisi (piksel) |
|---|---|---|---|---|
| BILLY | 107 px / 1,0 | −0,02 em | C9 | tinta x 16–374 (selebar kolom) · cap-top 21 · baseline 94 |
| MAULANA | 55,3 px / 1,0 | −0,02 em; "L" +0,05 em | C9 | tinta x 16–374 · cap-top 621 · baseline 659 |
| Tagline (2 baris) | 16 px / 22 px | −0,01 em | C9 | x 16 · y 682–726 |
| Frontend Engineer · Bandung, Indonesia / 7+ years of Vue.js · PLN Mobile, 80M+ users / Design system for 200+ developers | 12 px / 17 px | 0, tabular-nums | C9 α 0,72 | x 16 · y 742–793 |
| Always hunting for that perfect 60fps. | 12 px / 17 px | 0 | C9 α 0,72; "60fps." α 1 | x 16 · y 806–823 |

Rasio display:meta di ponsel 107 : 12 = 8,9× (BILLY) dan 55,3 : 12 = 4,6× (MAULANA). Dua kata nama sengaja tidak sama
besar di ponsel: masing-masing di-fit selebar kolom 358 px.

## splash-1440x900
Beat t ≈ 1,1 s: rana masih terbuka, tiga eksposur tersapu, pose akhir belum beku. Satu teks: penghitung "47" (Archivo 500,
14 px, C9), tepat di posisi "60" pada kalimat etos di hero, sehingga angka itu tidak berpindah saat hero muncul.

## Niat oklusi (tertulis)
- Desktop: rambut lewat di belakang "LY" pada BILLY. Kaki "L" kedua menumpang rambut 86–111 px, "L" pertama bebas 41 px.
  25,5% tinta BILLY berada di atas sosok.
- Desktop: MAULANA melintas di depan leher dan bahu ketiga eksposur. 30,3% tinta MAULANA berada di atas sosok; di balik
  huruf, suhu sosok dibatasi sampai indigo.
- Ponsel: BILLY melintas di depan puncak rambut (37,8% tinta di atas sosok); MAULANA di depan bahu (25,5%).
- Tidak ada huruf yang menyentuh wajah panas: batas bawah kulit panas y 658, cap-top MAULANA y 709 (jarak 51 px).
- Huruf selalu di depan dan utuh (0% tinta tertutup).

## Hasil ukur (render 1×, tanpa grain)
- Kontras minimum nama terhadap piksel terpanas di balik huruf: BILLY 8,93:1 · MAULANA 10,22:1 · ponsel 8,30:1 dan 10,41:1.
- Wajah akhir: tinggi kulit panas 445 px, luminans linear rata-rata 0,201, puncak 0,875.
- Luas panas: L > 0,2 = 7,70% frame (tiga eksposur; wajah akhir sendiri 4,24%) · L > 0,5 = 1,52% frame.
- Momen sentuh mengubah 4,4% frame dibanding hero.
- Grain: σ 2,5% pada ground, ditambahkan sesudah resize.
- layout-audit, ink-audit, align-audit: HIJAU di 1440×900 (14 elemen teks) dan 390×844 (11 elemen teks).

## Sumber gambar
Satu dari tiga foto pilihan Billy, IMG_6111, dicerminkan dan dipakai sebagai tiga eksposur stroboskop yang sama
(skala 0,72; jarak antar-eksposur 296 px, naik 8 px tiap eksposur ke belakang). Peta panas dipanggang dari luminans foto
hanya pada kulit (matte rambut bawaan HEIC memisahkan rambut), dihaluskan tiga skala (σ 28 / 9 / 2,4 px, bobot
0,46 / 0,38 / 0,16; area mata memakai campuran lebih tajam), lalu dipetakan ke ramp termal C0–C10. Rambut dan badan
menjadi massa indigo (C1–C2) dengan cahaya tepi; eksposur lama makin dingin (penguatan 0,74 dan 0,52). Compositor WebGL2 di
`billy-portfolio-assets/concept-2/r2-F1/comp/` (`bake.sh` untuk peta panas, parameter per frame di `frames.js`).
