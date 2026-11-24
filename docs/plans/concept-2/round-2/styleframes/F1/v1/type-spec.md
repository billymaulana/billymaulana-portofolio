# Type spec — F1 · Rana Kedua (putaran 2)

Semua angka diukur dengan `measureText` pada famili yang dirender (`round-2/archivo-metrics.md`). Satu famili: Archivo
(Google Fonts, OFL) dalam dua instance. Tanpa mono. Font hero dipilih Billy dari spesimen buta.

| Peran | Famili · instance | Weight · width |
|---|---|---|
| Nama | Archivo Expanded | 800 · `font-stretch: 125%` |
| Tagline, meta | Archivo | 500 · 100% |

## Grid
- 1440×900: margin 48, 12 kolom (90 px, gutter 24). Tepi kiri tinta semua teks di x=48 (left bearing nama 0,085 em dikompensasi).
- 390×844: margin 16.

## hero-1440x900 · touch-1440x900

| Teks | Ukuran / leading | Tracking | Warna | Posisi |
|---|---|---|---|---|
| BILLY | 209,4 px / 1,0 (lantai tinta kapital 0,70) | −0,02 em | C9 `#FFF5B3` | tinta x 48–748,7 · cap-top 48 · baseline 192,1 |
| MAULANA | 209,4 px / 1,0 | −0,02 em | C9 `#FFF5B3` | tinta x 48–1392 (12 kolom) · cap-top 707,9 · baseline 852 |
| Transforming pixels into performance. / Building interfaces that move millions. | 20 px / 28 px | −0,01 em | C9 `#FFF5B3` | x 48 · kotak y 236–292 |
| Frontend Engineer / Bandung, Indonesia | 14 px / 20 px | 0 | C9 α 0,72 | x 48 · y 532–572 |
| 7+ years of Vue.js / Leading frontend at SigmaTech | 14 px / 20 px | 0, tabular-nums | C9 α 0,72 | x 48 · y 584–624 |
| PLN Mobile, 80M+ users / Design system for 200+ developers | 14 px / 20 px | 0, tabular-nums | C9 α 0,72 | x 48 · y 636–676 |
| Always hunting for that perfect 60fps. | 14 px / 20 px | 0 | C9 α 0,72; "60fps." α 1 | rata kanan x 1392 · y 52–72 |

Rasio display:meta 209,4 : 14 = 15,0×. Dua kata nama berukuran sama.

## hero-390x844

| Teks | Ukuran / leading | Tracking | Warna | Posisi |
|---|---|---|---|---|
| BILLY | 55,8 px / 1,0 | −0,02 em | C9 | tinta x 16–202,7 · baseline 62,4 |
| MAULANA | 55,8 px / 1,0 | −0,02 em | C9 | tinta x 16–374 · baseline 648 |
| Frontend Engineer / Bandung, Indonesia | 12 px / 17 px | 0 | C9 α 0,72 | rata kanan x 374 · y 24–58 |
| Tagline (2 baris) | 16 px / 22 px | −0,01 em | C9 | x 16 · y 672–716 |
| 7+ years of Vue.js / PLN Mobile, 80M+ users / Design system for 200+ developers | 12 px / 17 px | 0, tabular-nums | C9 α 0,72 | x 16 · y 736–787 |
| Always hunting for that perfect 60fps. | 12 px / 17 px | 0 | C9 α 0,72; "60fps." α 1 | x 16 · y 802–819 |

Rasio display:meta di ponsel 55,8 : 12 = 4,65× (di bawah 10×): Archivo Expanded uppercase selebar 358 px berhenti di 55,8 px.

## splash-1440x900
Beat t ≈ 1,1 s: rana terbuka, pose akhir belum beku. Satu teks: penghitung "47" (Archivo 500, 14 px, C9), tepat di posisi
"60" pada kalimat etos di hero, sehingga angka itu tidak berpindah saat hero muncul.

## Niat oklusi (tertulis)
- Rambut lewat di belakang "LY" pada BILLY; huruf di depan dan utuh (0% tinta tertutup).
- MAULANA melintas di depan leher, dada, dan bahu; huruf di depan dan utuh.
- Tidak ada huruf yang menyentuh wajah.

## Hasil ukur (render 1×, tanpa grain)
- Kontras minimum nama terhadap piksel terpanas di balik huruf: BILLY 10,49:1 · MAULANA 11,53:1 · ponsel 18,5:1 dan 18,3:1.
- Wajah: luminans linear rata-rata 0,197 (4,8:1 terhadap ground 0,0016), puncak 0,98.
- layout-audit, ink-audit, align-audit: HIJAU di 1440×900 (12 elemen teks) dan 390×844 (11 elemen teks).

## Sumber gambar
Tiga foto pilihan Billy sebagai satu tolehan (dicerminkan): IMG_6111 → IMG_6096 → IMG_6120. Luminans foto dipetakan ke ramp
termal C0–C10; pose akhir tajam dan terpanas, dua pose awal makin dingin dan tersapu horizontal. Compositor WebGL2 di
`billy-portfolio-assets/concept-2/r2-F1/comp/` (parameter per frame di `frames.js`).
