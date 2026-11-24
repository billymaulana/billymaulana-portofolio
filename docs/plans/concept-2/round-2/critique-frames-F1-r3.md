# Kritik frame putaran 2 — F1 "Rana Kedua", revisi 3

Kritikus: agen art-director-critic (Fable), 2026-11-23 17:40 WIB. Tahap styleframe; audit browser tidak berlaku.
Kritikus yang sama dengan `critique-frames-F1-r2.md`, rubrik dan skrip ukur yang sama, jadi angka r2 → r3 bisa dibandingkan.

Yang dinilai: `styleframes/F1/splash-1440x900.jpg`, `hero-1440x900.jpg`, `touch-1440x900.jpg`, `hero-390x844.jpg`,
`type-spec.md` (revisi 3), render 2× tanpa grain dan folder audit di `billy-portfolio-assets/concept-2/r2-F1/comp/out/`,
`comp/frames.js`, `comp/bake.sh`, `comp/index.html`. Pembanding: revisi 2 (`F1/v2/`) dan empat contoh efek Billy.

Revisi 3 adalah putaran polish kedua dan terakhir. Skor di bawah mengikuti gambar: saran yang diikuti tanpa mengubah
angka ukur tidak diberi nilai (lihat "Dari mana kenaikannya").

## Cara ukur

Sama dengan r2: luminans linear sRGB, kontras (L₁ + 0,05) / (L₂ + 0,05), ground 0,0016, zona ramp dari titik tengah
antar-stop, koordinat 1×. Semua masukan dibekukan lebih dulu ke scratchpad (salinan `audit/`, `frames.js`, `bake.sh`,
`index.html`, `type-spec.md`), lalu keempat JPG dicek ulang lewat md5 sesudah pengukuran: tidak berubah.
Angka pembanding revisi 2 diambil dari laporan r2 atau diukur ulang dengan definisi yang sama dari render 2× revisi 2.

## Skor

| | Revisi 3 | Revisi 2 |
|---|---|---|
| A-score | **6,6** (6,61) — Design 6,8 · UX 6,3 · Creativity 6,5 · Content 7,0 | 6,26 |
| T-score | **6,8** (6,76) — Taste Profile 7,0 · Anti-Slop 6,0 · Editorial 7,4 · Mood 7,2 · Novelty 6,0 | 6,29 |
| min(A, T) | **6,6** (6,61) → belum lolos gate 8,0 | 6,26 |
| Dimensi terendah | Anti-Slop 6,0 dan Novelty 6,0 | |
| Uji gagal | **WOW**, tipis (plafon Anti-Slop 6). NEIGHBOR tidak bisa diuji; SWAP lolos lemah | |
| Prediksi verdict Billy | **reject** (±44%) · revise ±39% · ship ±17% | 50 / 37 / 13 |
| Kalimat lama yang paling mungkin terulang | *"overall belum begitu impressive"* · *"masih jelek jauh dari awwwards"* · untuk sepertiga kanan frame *"bentuk shape tidak jelas"* | |

Kalibrasi tidak berubah: sembilan dari sembilan baris `predictions.jsonl` ber-verdict dengan min di bawah 8,0 ditolak,
termasuk 7,3 dan 7,6. Kenaikan 0,35 tidak menggeser frame keluar dari kelas itu.

| Dimensi | Skor | Alasan |
|---|---|---|
| Design 40% | 6,8 | Satu subjek di atas hitam kembali: hitam terlihat 34,8% → 53,3%, bidang rata 26,74% → 10,79%, tiga cap identik hilang (korelasi 0,960 → 0,489 untuk eksposur kedua). Yang menahan: wajah di 2× tidak berubah (mata 0,50 level/px), jejak berupa dua plateau lunak, BILLY tidak lagi bertemu sosok (2,5% tinta). |
| UX 30% | 6,3 | Teks kecil ponsel kini seluruhnya di atas ground (7,51–16,5:1; 0% tinta di atas sosok). Momen sentuh terbaca sebagai peristiwa (10,56% frame). Tetap tanpa navigasi atau isyarat interaksi; nama ponsel tetap 1,93×; 2 dari 9 viewport. |
| Creativity 20% | 6,5 | Ide "tolehan sebagai eksposur" kini ada di gambar: tiga foto berbeda, jarak 260 dan 364 px, usia terbaca dari ketajaman (tepi 16–24 → 39–70 → 66–77 px). Pita sentuh tidak lagi irisan glitch bersambungan. Tetap potret termal + nama raksasa. |
| Content 10% | 7,0 | Tidak berubah: tujuh fakta dari `profile.ts`, tanpa jalan keluar. |
| Taste Profile 30% | 7,0 | Prinsip 1 terpenuhi di desktop (53,3%) dan ponsel (59,3%); "repeated patterns" hilang. Pilar liquid hanya tersirat di riak sentuh; lapis fluida ditulis sebagai urusan produksi. Syarat "nama dua kata sama besar" dilepas lewat keputusan tertulis. |
| Anti-Slop 25% | 6,0 | WOW gagal tipis: momen sentuh menahan mata, frame diam dan splash belum. Tidak ada lagi cacat yang terbaca bug. Sosok tanpa grain tetap tanpa tepi internal (detail-density 0,01%). |
| Editorial 20% | 7,4 | Ritme desktop 48 / 48 px (r2: 51 / 40). Teks kecil ponsel bersih. Label spec diperbaiki. Yang tersisa: dua ukuran nama di ponsel (1,93×; MAULANA terhadap tagline 3,5×), garis rim menyinggung sudut dalam "L" kedua (3–5 px), leading 1,40 / 1,43 di luar tabel gate lama. `taste-lint` tidak dijalankan. |
| Mood 15% | 7,2 | Cinematic ada (grain 2,52%, rim, potong tepi). Mystic kini juga di hero: satu sumber cahaya, splash menahan wajah akhir (hitam 76,5%, puncak 0,416). Premium baru separuh: tiga plateau suhu 8,24% frame, rim berbintik, mata gumpalan. |
| Novelty 10% | 6,0 | Cap ulang dan pola #17 pada gambar hilang. Yang masih diulang dengan variasi: kerangka frame c dan pita horizontal di wajah termal splash (modulasi 47,7%). Dua klaim spec memakai definisi baru untuk angka lama (lihat tabel klaim). |

### Dari mana kenaikannya

Yang terlihat di gambar dan diberi nilai: ground hitam, satu subjek, jejak melunak menurut usia, pita sentuh tanpa
sambungan, splash yang berbeda dari hero, teks kecil ponsel, ritme 48 px.
Yang diikuti tetapi tidak mengubah angka, jadi tidak diberi nilai: sumber luminans potret retus (mata 0,51 → 0,50, pulau
34 → 34), "campuran mata lebih tajam", keputusan tertulis soal nama ponsel dan lapis fluida, perbaikan label spec.

## Tiga alasan utama skor

1. **Wajah akhir tidak membaik di 2× dan zona panasnya mengecil.** Gradien kotak mata 0,50 level/px (r2 0,51; contoh stroboskop 4,37), pulau panas L > 0,2 tetap 34, cincin oranye 4–10 px, tepi 19–25 px; bidang dingin di dalam kontur naik 24,3% → 29,3%, tinggi kulit panas turun 446 → 392 px, dan L > 0,2 wajah akhir turun 4,19% → 3,61% frame.
2. **Jejak kini lunak, tetapi sepertiga kanan frame tanpa bentuk yang terbaca.** Eksposur kedua adalah plateau magenta 2,02% frame dengan ketajaman relatif 0,030 (wajah akhir 0,051), eksposur ketiga gumpalan violet 2,59:1 yang hanya 114 px masuk frame; total nyala L > 0,2 turun 7,70% → 3,97% (FUTURE 9,3%).
3. **Huruf dan sosok kembali nyaris tidak bertemu, dan splash tetap keruh.** Tinta BILLY di atas sosok 25,6% → 2,5% (tinggal garis rim 1,2–1,8:1), MAULANA 28,1% di atas plateau C2; splash berpuncak 0,416 dengan detail 1,59%, pita 47,7%, dan tepi profil 31–99 px; ponsel tetap 107 vs 55,3 px.

## Uji 30 detik

| Uji | Hasil | Catatan |
|---|---|---|
| OBJECT | lolos | Satu wajah panas dengan dua gema; sosok 34,8% frame. |
| SWAP | lolos lemah | Profil dan garis kubah rambut milik Billy. Tekstur rambut hanya bintik gelap (luma 8-bit σ 5,1; lompatan > 12 level 0,00%). Pengait "60fps" tetap satu angka 14 px. |
| EMPTY | lolos | Tanpa teks tersisa wajah panas di atas 65,2% hitam. |
| WOW | **gagal, tipis** | Momen sentuh kini layak dimainkan (riak kontinu, 10,56% frame). Frame diam: wajah halus tanpa detail dan jejak dua plateau. Splash: puncak 0,416, tanpa kuning. |
| NEIGHBOR | tidak diuji | Belum ada section tetangga. Splash dan hero kini berbeda (korelasi 0,146). |

## Yang terlihat (per frame)

- **hero-1440x900.** 3 detik: nama krem raksasa; satu profil termal berhidung krem-kuning di atas hitam; gema magenta lalu violet ke kanan; busur biru tipis di atas kepala. Ide "jejak dingin, wajah akhir tajam" terbaca. Di ukuran kecil sepertiga kanan menjadi awan ungu.
- **touch-1440x900.** 3 detik: dahi sampai hidung terurai menjadi pita cair kuning-putih yang berkelok. Tidak ada garis lurus periodik. Frame terkuat dari keempatnya.
- **splash-1440x900.** 3 detik: busur rambut besar, satu wajah oranye bergaris mendatar, gumpalan magenta-violet di tepi kanan, angka "47". Berbeda dari hero, tetapi redup dan masih memakai kosakata wajah termal bergaris.
- **hero-390x844.** 3 detik: BILLY selebar layar, satu wajah panas dan satu gema magenta, MAULANA separuh ukuran, teks di atas hitam. Lebih rapi dari r2; hierarki nama tetap judul + subjudul.

## Yang memburuk dibanding revisi 2

| Hal | Revisi 2 | Revisi 3 |
|---|---|---|
| Tinta BILLY di atas sosok | 25,6% | 2,5% (huruf pertama "L" 0,0%, "L" kedua 10,3%, "Y" 4,0%) |
| Tinta MAULANA di atas sosok | 30,4% | 28,1% |
| Area menyala L > 0,2 | 7,70% frame | 3,97% frame |
| L > 0,2 wajah akhir saja | 4,19% | 3,61% |
| Tinggi kulit panas (L ≥ 0,2) | 446 px | 392 px (target kritik pertama ≥ 430) |
| Bidang dingin di dalam kontur zona panas wajah | 24,3% | 29,3%; hidung (27,1 ribu px) dan sayap rahang (17,0 ribu px) kini terpisah |
| Cincin oranye di tepi highlight | 7–8 px | 4–10 px (tiga dari empat baris 4–6 px) |
| Splash: puncak luminans | 0,555 | 0,416; L > 0,5 = 0% |
| Splash: detail (`effect-audit`) | 1,74% | 1,59% |
| Splash: tepi profil | 41–72 px | 31–99 px |
| Splash: tepi pita lurus terpanjang | 80 px | 125 px (di y 536, x 1120–1245) |
| Sentuh: puncak luminans | 0,987 | 0,899, di bawah hero 0,906; C9+ 0,37% → 0,26% (pointer menggeser, tidak memanaskan) |
| Latar di balik "A" terakhir MAULANA | rata-rata 0,0283 (12,12:1) | 0,0376 (10,82:1); minimum tetap 10,21:1 |

Catatan: sebagian penurunan luas nyala adalah harga yang wajar dari membuang dua cap wajah. Yang tidak wajar adalah
wajah akhir sendiri ikut mengecil dan terbelah.

## Status target revisi 1–11 (dari laporan r2)

| # | Target | Status | Angka |
|---|---|---|---|
| 1 | Jejak = waktu, bukan salinan | **sebagian besar** | Korelasi terhadap wajah akhir: eksposur kedua 0,489 (target ≤ 0,80); eksposur ketiga 0,895, tetapi hanya 128 kolom yang masuk frame dan ia sudah dilunakkan sampai LOD 3,6, jadi metrik ini tidak lagi membedakan apa pun di sana. Rasio jarak 364 : 260 = 1,40 (≥ 1,3). Tumpang-tindih wajah akhir–kedua 37 px = 12% (target ≥ 30%); kedua–ketiga terpisah 74 px. Tepi 16–24 px → 39–70 px → 66–77 px (≥ 2×). |
| 2 | Hitam jadi ground; rambut bertekstur | **sebagian** | Hitam terlihat 53,3% desktop (≥ 50%) dan 59,3% ponsel (≥ 35%). Bidang tanpa gradien 10,79% (target ≤ 8%). Rambut: lompatan > 12 level 0,00% (target ≥ 1,5%), nada 0,002–0,017, tanpa gradasi ke C3. Porsi hangat tinta sosok 29,2% desktop (target 40–55%), 45,1% ponsel. Nama ≥ 10,21:1. Tinta nama di atas sosok: BILLY 2,5% (target ≥ 25%), MAULANA 28,1%. |
| 3 | Wajah akhir tahan zoom 2× | **tidak** | Sumber luminans kini `figure-*.png` (terverifikasi di `bake.sh` baris 7). Hasilnya: mata 0,50 level/px (target ≥ 2,0), lompatan > 12 level 0,0% (≥ 5%), pulau 34 di antara dua baris nama dan 36 di seluruh frame (≤ 15). Jalur lunak juga tidak: tepi 19–25 px (≥ 36), rongga mata minimum 0,035 (bukan hitam). Cincin oranye 4–10 px (12–20). |
| 4 | Momen sentuh bersih dan lebih besar | **sebagian besar** | Sambungan periodik: 0 (r2: 5). Tepi lurus terpanjang 79 px pada ambang 0,02 (r2 121), 65 px pada 0,04, 46 px pada 0,08. Jarak antar-tepi 4–25,5 px, simpangan baku 7,1 px (target ≥ 8; tanpa periode tetap). Satu bahasa distorsi. Perubahan 10,56% frame (≥ 6%). Keputusan fluida tertulis. Belum: transisi tepi pita median 1 px (target ≥ 4), dan pointer tidak menambah panas. |
| 5 | Splash berdiri sendiri | **sebagian** | Korelasi terhadap hero 0,146 (≤ 0,70). Tepi profil 31–99 px (≤ 30). Modulasi pita 47,7% (≤ 25%). Detail 1,59% (≥ 2%). |
| 6 | Ponsel: dua kata nama sama besar | **tidak** | Tetap 107 vs 55,3 px (1,93×). Yang berubah: pelepasan syarat shortlist kini tertulis di spec. |
| 7 | Ponsel: teks kecil | **terpenuhi** | 0% tinta di atas sosok; kontras tinta median meta 7,51:1, etos 8,14:1, tagline 16,05–16,54:1. Batas sosok terdekat 9 px dari tinta tagline, pada L ≈ 0,008 (tidak terlihat). |
| 8 | Desktop: ritme | **terpenuhi** | Baseline BILLY 191 → kapital tagline 239 = 48 px; baseline meta 661 → kapital MAULANA 709 = 48 px. |
| 9 | Jarak panas ke MAULANA | **terpenuhi** | L ≥ 0,108 terendah y 665: 44 px dari tinta (target ≥ 36). L ≥ 0,2: 67,6 px. |
| 10 | Spec | **terpenuhi**, dengan dua klaim baru yang bermasalah | Label A–U, cakupan klaim jarak, bobot blur, dan "Sumber gambar" diperbaiki; 0,201 dihapus. Lihat tabel klaim. |
| 11 | Audit di 390×664 dan 1180×820 | **tidak** | Tetap dua viewport; spec menundanya ke tahap rute. |

Hitungan: 3 terpenuhi (7, 8, 9), 1 terpenuhi dengan catatan (10), 2 sebagian besar (1, 4), 2 sebagian (2, 5), 3 tidak (3, 6, 11).
Tiga yang tidak terpenuhi mencakup satu-satunya target yang menyangkut mutu wajah.

## Klaim type-spec terhadap gambar

| Klaim | Terukur | Status |
|---|---|---|
| Posisi nama, tagline, etos, meta; ritme 48 / 48 px | tinta nama x 47–743 dan 47–1392; baris kecil y 239, 267, 308, 527 … 651; 48 dan 48 px | cocok |
| Kontras minimum nama 12,59 · 10,29 · ponsel 14,57 · 11,45 | di balik huruf 12,49 · 10,22 · 14,45 · 11,37; dengan cincin 8 px 10,41 · 10,21 · 14,46 · 10,41 | cocok (< 1%); "Y" turun ke 10,41 karena bintik rim 0,041 |
| 2,5% tinta BILLY, 28,0% MAULANA, ponsel 20,1% di atas sosok | 2,5% · 28,1% · 20,6% | cocok |
| Garis kubah lewat di belakang "LLY" | "L" pertama 0,0%; hanya "L" kedua (10,3%) dan "Y" (4,0%) | **sebagian**: "LY", bukan "LLY" |
| Hitam terlihat (L < 0,009) 65,6% desktop, 68,5% ponsel | 65,59% dan 68,45% pada render tanpa teks; yang terlihat dengan teks 54,74% dan 59,62% | **tidak cocok dengan labelnya**: itu angka tanpa teks |
| L > 0,2 = 3,97% (wajah akhir 3,64%, tinggi 392 px); L > 0,5 = 1,77% | 3,97% (3,61%, 391 px); 1,77% | cocok |
| Pulau panas (L > 0,3, luas > 40 px): 9 | 9 dengan definisi itu; dengan definisi dua kritik sebelumnya (L > 0,2, semua pulau) 36 di frame, 34 di antara dua baris nama (r2: 34) | **angka benar, definisi diganti**; target lama tidak tercapai |
| Momen sentuh mengubah 6,85% frame (selisih abu > 6%) | 6,58% dengan ambang itu; 10,56% pada 20 level per kanal | cocok dalam 0,3 poin |
| Batas bawah kulit panas wajah akhir y 628, 81 px ke MAULANA | y 626 | cocok |
| Dua eksposur lama dibatasi di bawah oranye | 146 px oranye (puncak 0,340) di x 1040–1068, y 547–563, tempat jejak saling menumpuk | cocok kecuali satu bercak 0,011% frame |
| Tiga foto, ujung hidung 702 / 962 / 1326, skala 0,720 / 0,742 / 0,639, LOD 2,0 dan 3,6, sapuan 170 dan 240 px | sesuai `frames.js`; tepi tiap eksposur 16–24 / 39–70 / 66–77 px | cocok |
| Luminans dari potret retus | `bake.sh` membaca `figure-$id.png` | cocok |
| Ponsel: sosok dipudarkan y 664–692; teks kecil ±9,5:1 | baris sosok terakhir y 681; nominal 9,39:1 | cocok |
| Splash tanpa wajah akhir; "47" di posisi "60" | `skin[3]` = 0; "47" x 241–256, "60fps." mulai x 242 | cocok |
| Tiga audit hijau, 14 dan 11 elemen | 14 dan 11 item | cocok |

## Temuan baru

1. **Plateau suhu.** Batas suhu jejak menghasilkan tiga nada rata: magenta L 0,118–0,130 = 2,02% frame, violet 0,085–0,092 = 1,29%, C2 0,038–0,0435 = 4,93%. Bidang rata berpindah dari rambut ke jejak dan bahu.
2. **Eksposur ketiga tidak terbaca.** Ujung hidung di x 1326, jadi hanya 114 px yang masuk frame; nada rata 0,074 (σ 0,020), 2,59:1 terhadap hitam.
3. **Garis rim.** Luminans 0,014–0,041 (1,2–1,8:1). Ia melintas di celah "L" kedua dan menyinggung sudut dalamnya: di y 158 rim berada di x 506–534, tepi batang "L" di x 501–503. Lima bintik terang di sepanjang busur (y 63, 70, 118, 135, 205; puncak 0,060 terhadap median 0,018).
4. **Zona panas wajah terbelah** menjadi hidung dan sayap rahang oleh helai rambut di pipi (lihat tabel "memburuk").
5. **Pointer tidak memanaskan** (`band[1]` = 0): puncak frame sentuh 0,899, lebih rendah dari hero.
6. **Tumpukan jejak menembus batas suhu**: bercak oranye 146 px di (1040–1068, 547–563).
7. **Rambut "bertekstur"** berarti bintik gelap berkontras rendah (σ 5,1 level pada rata-rata 13,3), bukan helai ikal; identitas rambut tetap dibawa garis kubah saja.
8. **Dua definisi diganti di spec** (hitam "terlihat" dan jumlah pulau), keduanya ke arah angka yang lebih enak dibaca.
9. **Kepekatan ungu turun.** C1–C3 39,5% → 24,6% frame. Lebih dekat ke prinsip 1, tetapi Billy pernah memuji "vibrant deep ungu" dan "glow"; ini risiko selera, bukan cacat ukur.

## Bila dibawa lebih jauh

Ini sudah putaran polish kedua. Definition of Done butir 6: sajikan ke Billy bersama skor dan tiga alasan di atas, jangan
ditambal diam-diam. Gate henti `critique.md` (pemotretan ulang dua pose tolehan) berlaku untuk butir pertama di bawah,
karena dua revisi berturut-turut tidak menggerakkan angka wajah.

Yang masih mengikat bila konsep ini dipilih:
- Wajah akhir di 2×: mata ≥ 2,0 level/px atau jalur lunak penuh (tepi ≥ 36 px, bayangan ke hitam); pulau ≤ 15; cincin oranye 12–20 px (kini 0,50 · 19–25 px · 34 · 4–10 px).
- Jejak terbaca sebagai wajah atau hilang: tanpa plateau di atas 1% frame per nada (kini 2,02% dan 1,29%); eksposur ketiga ≥ 50% lebar wajahnya di dalam frame atau dibuang (kini 114 px).
- Satu pertemuan huruf–sosok yang terlihat: ≥ 25% tinta BILLY atau MAULANA di atas bagian sosok yang bertekstur, bukan plateau (kini 2,5% dan 28,1% di atas C2 rata).
- Garis rim: bebas ≥ 24 px dari sudut dalam "L" atau lewat di belakang batangnya; tanpa bintik (puncak ≤ 1,5× median).
- Splash: puncak ≥ 0,5; modulasi pita ≤ 25%; detail ≥ 2%.
- Pointer menambah panas: puncak frame sentuh di atas hero.
- Ponsel: nama tetap 1,93×; keputusan itu layak diperlihatkan sebagai pilihan, bukan disimpan di spec.
- Tiga audit geometri di tujuh viewport lain saat rute dibuat.

## Yang dipertahankan

- Nama: 207,8 px, kapital 144 px, tepi 47 / 47 px, kontras ≥ 10,21:1, 123 dari 171.489 piksel tinta berubah saat sentuh (anti-alias).
- Hitam 53,3% / 59,3%; satu wajah panas dengan puncak 0,906 dan L > 0,5 = 1,77%.
- Tiga foto, jarak 260 / 364 px, ketajaman menurun menurut usia.
- Riak sentuh kontinu tanpa sambungan.
- Ritme 48 / 48 px; teks kecil ponsel di atas ground; grain 2,52%.
- Penghitung "47" di posisi "60"; konten dari `profile.ts`.

## Prediksi tersegel

Belum ditulis ke `docs/awwwards/calibration/predictions.jsonl`. Baris siap tempel:

```json
{"ts":"2026-11-23T10:40:00Z","route":"/explore/concept/2#styleframes-r2-F1-rev3","a_score":6.61,"t_score":6.76,"scores":{"a":{"design":6.8,"ux":6.3,"creativity":6.5,"content":7},"t":{"profile":7,"antislop":6,"editorial":7.4,"mood":7.2,"novelty":6}},"mood":["cinematic","mystic","monumental"],"predict":"reject","reasons":["min(A,T) 6,61 < 8,0; WOW gagal tipis (plafon Anti-Slop 6)","prediksi verdict: reject 44% / revise 39% / ship 17%","wajah akhir tidak membaik di 2x: gradien kotak mata 0,50 level/px (r2 0,51; contoh stroboskop 4,37), pulau L>0,2 tetap 34, cincin oranye 4-10 px, tepi 19-25 px; bidang dingin di dalam kontur 24,3% -> 29,3%, tinggi kulit panas 446 -> 392 px","jejak lunak tetapi tak terbaca: plateau magenta 2,02% frame, gumpalan violet 2,59:1 dengan 114 px di dalam frame; L>0,2 turun 7,70% -> 3,97% frame","huruf-sosok: tinta BILLY di atas sosok 25,6% -> 2,5% (garis rim 1,2-1,8:1 menyinggung sudut dalam L 3-5 px), MAULANA 28,1% di atas plateau C2 4,93% frame","splash: puncak 0,416, detail 1,59% (<2%), pita 47,7%, tepi profil 31-99 px, tepi pita lurus 125 px","ponsel: BILLY 107 px vs MAULANA 55,3 px (1,93x), syarat shortlist dilepas lewat keputusan tertulis","yang membaik: hitam terlihat 34,8% -> 53,3% (ponsel 22,2% -> 59,3%), bidang rata 26,74% -> 10,79%, korelasi eksposur kedua 0,960 -> 0,489, jarak 260/364 px, sambungan sentuh 5 -> 0, perubahan sentuh 5,38% -> 10,56%, korelasi splash-hero 0,875 -> 0,146, ritme 48/48 px, teks kecil ponsel 7,51-16,5:1","dua klaim spec memakai definisi baru: hitam 'terlihat' 65,6% adalah angka tanpa teks (dengan teks 54,7%); pulau 9 memakai L>0,3 dan luas >40 px (definisi lama: 34-36)"],"actual":null}
```

## Batas penilaian

- Hanya gambar diam. Kilat rana dan gerak riak bisa mengubah hasil WOW; itu baru bisa dinilai di rute.
- `taste-lint` tidak dijalankan. Tiga audit geometri adalah keluaran pembuat pada dua viewport; tepi tinta dan ketiadaan tabrakan teks–teks saya periksa ulang dari piksel.
- `effect-audit` mode idle pada hero: idle-coverage 32,75% (batas 2%), 17 pita hue (batas 4): FAIL menurut alat, dilaporkan sebagai temuan alat dan tidak dipakai untuk skor, dengan alasan yang sama seperti di r2.
- Korelasi eksposur ketiga (0,895) tidak saya pakai untuk menyimpulkan "salinan": fotonya berbeda menurut `frames.js`, dan pada gumpalan yang terpotong tepi metrik itu hanya mengukur siluet kasar.
- Saya tidak yakin pada satu hal: apakah Billy membaca kepekatan ungu yang turun sebagai "lebih mahal" atau "lebih pudar". Tidak ada verdict yang memisahkan keduanya.
