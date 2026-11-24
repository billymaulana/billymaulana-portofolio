# Type spec — F1 · Rana Kedua (putaran 2, revisi 3)

Riwayat: revisi 1 di `v1/` (kritikus: min 5,7), revisi 2 di `v2/` (kritikus lain: min 6,26). Revisi 3 adalah putaran polish
kedua dan terakhir. Semua posisi di bawah ini diukur dari **baris piksel hasil render**, bukan dari metrik font.

Satu famili: Archivo (Google Fonts, OFL) dalam dua instance. Tanpa mono. Font hero dipilih Billy dari spesimen buta.

| Peran | Famili · instance | Weight · width |
|---|---|---|
| Nama | Archivo Expanded | 800 · `font-stretch: 125%` |
| Tagline, meta, etos | Archivo | 500 · 100% |

## Grid
- 1440×900: margin 48 di keempat sisi (cap-top BILLY y 48, baseline MAULANA y 852), 12 kolom (90 px, gutter 24).
  Tepi kiri tinta semua teks di x 48 (left bearing nama 0,085 em dikompensasi).
- Ritme vertikal desktop: baseline BILLY → cap-top tagline 48 px; baseline meta terakhir → cap-top MAULANA 48 px.
- 390×844: margin 16.

## hero-1440x900 · touch-1440x900

| Teks | Ukuran / leading | Tracking | Warna | Posisi (piksel) |
|---|---|---|---|---|
| BILLY | 207,8 px / 1,0 | −0,02 em | C9 `#FFF5B3` | tinta x 48–742 · cap-top 48 · baseline 191 |
| MAULANA | 207,8 px / 1,0 | −0,02 em; "L" +0,05 em | C9 `#FFF5B3` | tinta x 48–1392 (12 kolom) · cap-top 709 · baseline 852 |
| Transforming pixels into performance. / Building interfaces that move millions. | 20 px / 28 px | −0,01 em | C9 | x 48 · kotak y 233–289 |
| Always hunting for that perfect 60fps. | 14 px / 20 px | 0 | C9 α 0,72; "60fps." α 1 | x 48 · y 305–325 |
| Frontend Engineer / Bandung, Indonesia | 14 px / 20 px | 0 | C9 α 0,72 | x 48 · y 524–564 |
| 7+ years of Vue.js / Leading frontend at SigmaTech | 14 px / 20 px | 0, tabular-nums | C9 α 0,72 | x 48 · y 576–616 |
| PLN Mobile, 80M+ users / Design system for 200+ developers | 14 px / 20 px | 0, tabular-nums | C9 α 0,72 | x 48 · y 628–668 |

Rasio display:meta 207,8 : 14 = 14,8×. Dua kata nama berukuran sama di desktop.

Celah antar-kotak tinta huruf MAULANA (px): M–A 15 · A–U 11 · U–L 28 · L–A 13 · A–N 15 · N–A 15. Ini celah kotak, bukan
titik terdekat (untuk A–U titik terdekatnya ±30 px karena diagonal). Pasangan "LA" semula 4–5 px; "L" diberi +0,05 em.

## hero-390x844

| Teks | Ukuran / leading | Tracking | Warna | Posisi (piksel) |
|---|---|---|---|---|
| BILLY | 107 px / 1,0 | −0,02 em | C9 | tinta x 16–374 (selebar kolom) · cap-top 21 · baseline 94 |
| MAULANA | 55,3 px / 1,0 | −0,02 em; "L" +0,05 em | C9 | tinta x 16–374 · cap-top 621 · baseline 659 |
| Tagline (2 baris) | 16 px / 22 px | −0,01 em | C9 | x 16 · y 682–726 |
| Frontend Engineer · Bandung, Indonesia / 7+ years of Vue.js · PLN Mobile, 80M+ users / Design system for 200+ developers | 12 px / 17 px | 0, tabular-nums | C9 α 0,72 | x 16 · y 742–793 |
| Always hunting for that perfect 60fps. | 12 px / 17 px | 0 | C9 α 0,72; "60fps." α 1 | x 16 · y 806–823 |

Keputusan tertulis untuk ponsel: dua kata nama **tidak** sama besar (107 px dan 55,3 px), masing-masing di-fit selebar
kolom 358 px. Ini melepas syarat shortlist "nama dua kata sama besar" demi rasio display:meta 8,9× pada BILLY; bila dua
kata disamakan di 55,3 px, rasio jatuh ke 4,6×. Sosok dipudarkan ke hitam di bawah baseline MAULANA (y 664–692), sehingga
seluruh teks kecil berdiri di atas ground (±9,5:1).

## splash-1440x900
Beat t ≈ 1,1 s: rana masih terbuka. Eksposur kedua (pose IMG_6120) masih panas dan tersapu, eksposur ketiga mendingin,
wajah akhir belum ada. Satu teks: penghitung "47" (Archivo 500, 14 px, C9), tepat di posisi "60" pada kalimat etos di
hero, sehingga angka itu tidak berpindah saat hero muncul.

## Momen sentuh
Pointer di wajah menggeser irisan horizontal gambar (satu bahasa distorsi, tanpa sambungan keras; lebar irisan acak dari
noise kontinu). Nama dan teks tidak ikut bergeser. Lapis fluida termal dari konsep F1 (kosong saat diam, tinta hanya di
jalur pointer) tidak digambar di frame diam ini; lapis itu memakai engine `useFluidSimulation` apa adanya saat produksi.

## Niat oklusi (tertulis)
- Desktop: garis tepi kubah rambut lewat di belakang "L" kedua dan "Y" pada BILLY (2,5% tinta di atas sosok; "L" pertama
  0%); selebihnya BILLY berdiri di atas hitam. Pada revisi 2 angka ini 25,6%: pertemuan huruf–sosok di BILLY melemah.
- Desktop: MAULANA melintas di depan leher dan bahu ketiga eksposur; 28,0% tinta MAULANA di atas sosok, dan suhu sosok di
  balik huruf dibatasi sampai indigo.
- Ponsel: garis kubah lewat di belakang BILLY; MAULANA di depan bahu (20,1% tinta di atas sosok).
- Tidak ada huruf yang menyentuh kulit panas: batas bawah kulit panas wajah akhir y 628, cap-top MAULANA y 709 (81 px);
  dua eksposur lama dibatasi di bawah oranye, kecuali satu bercak 146 px di (1040–1068, 547–563) tempat jejak bertumpuk.
- Huruf selalu di depan dan utuh (0% tinta tertutup).

## Hasil ukur (render 1×, tanpa grain)
- Kontras minimum nama terhadap piksel terpanas di balik huruf: BILLY 12,59:1 · MAULANA 10,29:1 · ponsel 14,57:1 dan 11,45:1.
- Hitam terlihat (L < 0,009): tanpa teks 65,6% frame desktop dan 68,5% ponsel; dengan teks 54,7% dan 59,6%.
- Luas panas: L > 0,2 = 3,97% frame (wajah akhir sendiri 3,64%, tinggi 392 px) · L > 0,5 = 1,77% frame.
- Pulau panas: 9 dengan definisi L > 0,3 dan luas > 40 px; 36 dengan definisi kritik (L > 0,2, semua pulau), sama seperti
  revisi 2 (34).
- Momen sentuh mengubah 6,6–6,9% frame dibanding hero (ambang: selisih abu > 6%; 10,6% pada 20 level per kanal).
- Grain: σ 2,5% pada ground, ditambahkan sesudah resize.
- layout-audit, ink-audit, align-audit: HIJAU di 1440×900 (14 elemen teks) dan 390×844 (11 elemen teks). Dua viewport ini
  adalah ukuran frame; 390×664, 1180×820, dan lima viewport lain diaudit saat rute dibuat.

## Sumber gambar
Tiga foto pilihan Billy sebagai tiga eksposur satu tolehan, dicerminkan, masing-masing disejajarkan di ujung hidung:

| Eksposur | Foto | Skala | Ujung hidung (x, y) | Perlakuan |
|---|---|---|---|---|
| Akhir (kilat rana) | IMG_6111 | 0,720 | 702, 403 | tajam, paling panas |
| Kedua | IMG_6120 | 0,742 | 962, 391 (+260 px) | dilunakkan (LOD 2,0), dibatasi sampai magenta, tersapu 170 px |
| Ketiga | IMG_6096 | 0,639 | 1326, 413 (+364 px, rasio 1,40) | paling lunak (LOD 3,6), dibatasi sampai violet, tersapu 240 px |

Peta panas dipanggang (`comp/bake.sh`) dari luminans **potret retus** `r2-F1/figure-*.png`, hanya pada kulit (matte rambut
bawaan HEIC memisahkan rambut), dihaluskan tiga skala (σ 28 / 9 / 2,4 px; bobot wajah akhir 0,44 / 0,38 / 0,18, dua
eksposur lama 0,40 / 0,36 / 0,24; area mata wajah akhir memakai campuran lebih tajam), lalu dipetakan ke ramp termal
C0–C10. Rambut mengambil tekstur dari potret yang sama dan hanya menyala di dekat kulit, memudar ke hitam; tepi luar
kubah rambut diberi garis cahaya tipis. Compositor WebGL2 di `billy-portfolio-assets/concept-2/r2-F1/comp/`
(parameter per frame di `frames.js`).
