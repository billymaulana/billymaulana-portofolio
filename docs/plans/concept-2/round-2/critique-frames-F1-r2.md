# Kritik frame putaran 2 — F1 "Rana Kedua", revisi 2

Kritikus: agen art-director-critic (Fable), 2026-11-23 17:10 WIB. Tahap styleframe; audit browser tidak berlaku.
Kritikus ini berbeda dari kritikus revisi 1, jadi angka skor kedua laporan tidak bisa dikurangkan langsung.

Yang dinilai: `styleframes/F1/splash-1440x900.jpg`, `hero-1440x900.jpg`, `touch-1440x900.jpg`, `hero-390x844.jpg`,
`type-spec.md` (revisi 2), render 2× tanpa grain dan data ukur di `billy-portfolio-assets/concept-2/r2-F1/comp/out/`.
Pembanding: empat contoh efek Billy (`reference style concept/effect/`), frame putaran 1 yang ditolak, screenshot Concept 1,
foto sumber `crop-face-2x-6111/6096/6120.png`.

Urutan kerja: skor awal ditulis dan disegel pukul 09:38 UTC, sebelum `critique-frames-F1.md` dan frame `v1/` dibuka.
Skor awal: A 6,26 · T 6,34. Sesudah membaca kritik lama hanya satu subskor berubah (Novelty 6,0 → 5,5, alasannya di tabel).

## Cara ukur

- Piksel dibaca dari `comp/out/audit/hero-type0.png` (tanpa teks, tanpa grain), `hero-type1.png`, `hero-mask.png`, padanan
  `mobile-*`, render 2× (`*-2x.png`, juga diperkecil 50% dengan filter kotak), dan keempat JPG yang diserahkan.
- Luminans = luminans linear sRGB; kontras = (L₁ + 0,05) / (L₂ + 0,05); ground terukur 0,0016.
- Zona ramp dipilah dari luminans (titik tengah antar-stop C0–C10): hitam L < 0,0084; dingin C1–C3 < 0,108; magenta–oranye
  C4–C6 < 0,469; kuning–putih di atasnya.
- Koordinat 1× (1440×900 atau 390×844) kecuali disebut lain.
- `hero-mask.png` ternyata memuat semua tinta teks, bukan hanya nama. Nama dipisahkan lewat baris y 40–200 dan 700–870.
- Angka pada contoh efek diambil dari JPG 735–1158 px, jadi indikatif.
- Skrip repo yang dijalankan: `thermal-zones.mjs` dan `effect-audit.mjs` pada frame dan pada keempat contoh. Keduanya dipakai
  sebagai pembanding, bukan gate (lihat Batas penilaian).

## Skor

| | Nilai |
|---|---|
| A-score | **6,3** (6,26) — Design 6,4 · UX 6,0 · Creativity 6,0 · Content 7,0 |
| T-score | **6,3** (6,29) — Taste Profile 6,5 · Anti-Slop 5,5 · Editorial 7,2 · Mood 6,5 · Novelty 5,5 |
| min(A, T) | **6,3** (6,26) → belum lolos gate 8,0 |
| Dimensi terendah | Anti-Slop 5,5 dan Novelty 5,5 |
| Uji gagal | **WOW** (plafon Anti-Slop 6). NEIGHBOR tidak bisa diuji; SWAP lolos lemah |
| Prediksi verdict Billy | **reject** (±50%) · revise ±37% · ship ±13% |
| Kalimat lama yang paling mungkin terulang | *"masih jelek jauh dari awwwards"* · *"overall belum begitu impressive"* · untuk momen sentuh *"shader cacat"* · untuk tiga wajah kembar *"kaku"* |

Kalibrasi prediksi: sembilan baris `predictions.jsonl` yang sudah punya verdict, semuanya dengan min di bawah 8,0 (termasuk
7,3 dan 7,6), berakhir ditolak. Angka 6,3 di sini tidak setara dengan 6,5 yang dulu diberikan pada frame c; pada skala
laporan ini frame c berada di sekitar 5,0–5,3. Revisi 2 membalik dua sebab penolakan c (nama utuh di font pilihan Billy,
wajah terlihat), dan itu yang menahan peluang reject di ±50%, bukan lebih tinggi. Prediksi awal yang disegel bersama
skor adalah reject 40% · revise 42% · ship 18%; angkanya digeser setelah sembilan verdict itu dibaca.

| Dimensi | Skor | Alasan |
|---|---|---|
| Design 40% | 6,4 | Nama kuat: 207,8 px, kapital 144 px, tepi kiri 47,7 px dan kanan 47,8 px, kontras minimum 8,86:1. Gambarnya belum setingkat: tiga wajah adalah satu foto yang dicap tiga kali (korelasi 0,960 dan 0,950), 26,74% frame berupa bidang indigo tanpa gradien, hitam yang terlihat tinggal 34,8%. |
| UX 30% | 6,0 | Terbaca dan berhierarki (meta 9,39:1, rasio 14,8×). Tidak ada navigasi atau isyarat interaksi. Di ponsel 55–80% tinta meta 12 px berada di atas bahu pada 4,41–4,84:1. Hanya 2 dari 9 viewport wajib punya frame. |
| Creativity 20% | 6,0 | Penghitung "47" yang mendarat di "60fps" (x 241–256, 14 px) adalah satu-satunya gagasan yang tidak bisa dipindah ke orang lain. Sisanya: peta gradien termal, cap ulang tiga kali, irisan geser. Tolehan, inti konsep, tidak ada di gambar. |
| Content 10% | 7,0 | Tujuh fakta, semuanya cocok dengan `profile.ts`. Nama adalah subjek (12,3% frame). Belum ada jalan keluar (karya, kontak). |
| Taste Profile 30% | 6,5 | Font, foto, dan arah efek pilihan Billy dipakai. Pilar liquid absen di keempat frame. "Repeated patterns" (daftar HATES) hadir: tiga cap berjarak 296 px dan sambungan tiap 61 px. Prinsip 1 (hitam mayoritas) meleset di hero dan ponsel. |
| Anti-Slop 25% | 5,5 | WOW gagal. Momen sentuh membawa lima sambungan keras yang terbaca bug. Wajah rapi, tetapi halus tanpa detail (kerapatan tepi sosok 0,00%). |
| Editorial 20% | 7,2 | Satu famili, dua weight, tiga nilai tracking (−0,02 / −0,01 / 0), tepi kiri tinta 47,69–49,53 px, tiga audit pembuat hijau dengan 14 dan 11 elemen. Yang meleset: dua ukuran nama di ponsel (1,93×), ritme vertikal 51 vs 40 px, leading 1,40 / 1,43 di luar tabel gate editorial 1,3 / 1,2 (di dalam rentang `taste-lint`). `taste-lint` tidak dijalankan. |
| Mood 15% | 6,5 | Target cinematic · premium · mystic. Cinematic ada (grain σ 2,52%, sosok terpotong tepi). Mystic hanya di splash (hitam 58,7%, puncak 0,555); hero punya tiga sumber cahaya. Premium belum: bidang rata 26,74% dan sambungan 1 px. Tidak ada anti-mood aktif. |
| Novelty 10% | 5,5 | Pola #27 dan #30 tidak diulang. Diulang dengan variasi: kerangka frame c (nama dua baris + daftar meta + sosok kanan), wajah termal berpita horizontal di splash (Concept 1), dan #17: target "L > 0,2 ≥ 6% frame" dicapai lewat tiga salinan (7,70%), wajah akhir sendiri 4,19%. Turun 0,5 dari skor awal karena temuan #17 ini. |

## Tiga alasan utama skor

1. **Jejak waktunya adalah tiga cap dari satu foto.** Korelasi luminans jendela hidung–mata 0,960 dan 0,950 pada geser tepat 296 dan 592 px, tumpang-tindih antar-wajah ±2%, dan eksposur lama tidak lebih tersapu (tepi 14–26 px terhadap 22–25 px pada wajah akhir); tolehan dari tiga foto pilihan Billy tidak ada di gambar.
2. **Sosok menyala di atas indigo rata, bukan di atas hitam.** C1–C2 menempati 33,8% frame, 26,74% frame tidak punya gradien sama sekali, hitam yang terlihat 34,8% (ponsel 22,2%), dan porsi hangat tinta sosok 27,5% terhadap 60–82% pada dua contoh termal Billy; tekstur rambut ikal yang masih ada di revisi 1 hilang (lompatan luma > 12 level: 2,01% → 0,00%).
3. **Craft di zoom 2× dan di momen sentuh belum setingkat contoh.** Gradien rata-rata kotak mata 0,51 level/px terhadap 4,37 pada contoh stroboskop, zona panas wajah masih 34 pulau, dan pita sentuh punya 5 sambungan keras 1 px tepat tiap 61,0 px (y 244, 305, 366, 427, 488).

## Uji 30 detik

| Uji | Hasil | Catatan |
|---|---|---|
| OBJECT | lolos | Tiga wajah termal; sosok menempati 54,5% frame. |
| SWAP | lolos lemah | Profil dan kubah rambut Billy tidak bisa ditukar, tetapi tekstur ikalnya (ciri paling khas) sudah diratakan. Perlakuannya bisa dipakai siapa pun dengan fotonya; pengait "60fps" hidup di satu angka 14 px. |
| EMPTY | lolos | Tanpa teks masih ada tiga wajah. Yang ikut tersisa: 33,8% frame indigo rata. |
| WOW | **gagal** | Hero berhenti di "poster termal": cap ulang terbaca dalam dua detik. Momen sentuh mengubah 5,38% frame dan memperlihatkan sambungan periodik. Splash adalah hero yang diredupkan (korelasi 0,875). |
| NEIGHBOR | tidak diuji | Belum ada section tetangga. |

## Yang terlihat (per frame)

### splash-1440x900
- **3 detik:** tiga wajah profil redup bergaris horizontal di kanan; kiri hitam; angka "47" kecil.
- **Ide terbaca?** Sebagian. "Belum beku" terbaca dari keburaman; "rana" dan "frame" hanya ditopang angka 14 px tanpa satuan, karena sisa kalimat etos disembunyikan.
- **Templat / garis-pindai?** Dekat. Wajah profil utuh di balik pita mendatar, palet sama dengan Concept 1; pitanya lunak, bukan isoline keras.

### hero-1440x900
- **3 detik:** BILLY / MAULANA krem raksasa; tiga profil termal identik berjajar ke kanan di dalam tiga kubah ungu-biru.
- **Ide terbaca?** "Tiga eksposur" terbaca seketika. "Menoleh" dan "satu frame yang beku" tidak: ketiganya sama tajam dan sama posenya, hanya suhunya turun.
- **Templat?** Peta gradien di atas foto yang digandakan dengan langkah tetap.

### touch-1440x900
- **3 detik:** dahi sampai hidung wajah pertama terurai menjadi riak mendatar dengan inti kuning-putih; lima garis lurus memotongnya.
- **Ide terbaca?** Ya sebagai "sosok terganggu oleh pointer". Sebabnya (pointer) tidak digambar.
- **Templat?** Irisan glitch + riak; garis lurusnya terbaca kesalahan render.

### hero-390x844
- **3 detik:** BILLY selebar layar, dua wajah termal, MAULANA separuh ukuran, enam baris teks di atas bahu ungu.
- **Ide terbaca?** Dua eksposur masih terbaca; yang ketiga jatuh di luar layar.
- **Templat?** Sama dengan desktop; bacaan namanya berubah menjadi judul + subjudul.

### Dibanding revisi 1 (dilihat sesudah skor awal)
Maju: wajah jadi subjek (kulit panas 2,9% → 6,20% frame), ada puncak cahaya (L > 0,5: 0,13% → 1,52%), grain nyata
(0,13% → 2,52%), huruf bertemu sosok (tinta MAULANA di atas sosok 0,6% → 30,4%), pita scanline tempelan hilang.
Mundur: detail foto dan rambut ikal hilang (lompatan luma > 12 level pada sosok 4,72% → 0,78%), satu potret menjadi tiga
cap, massa satu nada membesar (21,4% → 33,8% frame). Kemajuannya di luas dan terang; kemundurannya di identitas dan tekstur.

## Cacat terbesar

### hero-1440x900
1. **Tiga cap identik.**
   - Korelasi luminans jendela x 700–840, y 200–520 terhadap geser (296, −9) = 0,960 dan (592, −16) = 0,950; rasio rata-rata 0,56 dan 0,36.
   - Jarak 296 : 296 px (rasio 1,00). Kotak kulit selebar 303 px, jadi wajah berjajar dengan tumpang-tindih 7 px (±2%), tidak menyatu.
   - Tepi hidung 90→10%: wajah akhir 22–25 px; eksposur tengah 14–24 px; eksposur awal 15–26 px. Yang lama tidak lebih tersapu.
   - Eksposur awal terpotong tepi kanan: hidungnya di x ±1289 (697 + 592), jadi dari lebar kulit 303 px hanya ±151 px yang masuk frame; ia berdiri 2,19:1 terhadap rambutnya sendiri.
2. **Massa indigo rata.**
   - Tanpa teks: hitam 45,49% · C1 18,19% · C2 15,61% · C3 5,75% · magenta–oranye 13,37% · kuning–putih 1,59%. Dengan teks, hitam yang terlihat 34,77%.
   - 26,74% frame (49,2% tinta sosok) punya selisih 4-tetangga < 0,0006: bidang rata sempurna.
   - Tiga kubah, tiga nada: 0,0147 (x 560–740), 0,0237 (x 860–1100), 0,0411 (x 1160–1400); kontras terhadap ground 1,29–1,45:1. Tidak ada gradasi di dalam satu kubah.
   - Massa C1–C2 berada di hue 243°–255° (biru 240°, violet 270°): risiko terbaca "biru dominan".
3. **Wajah di 2×.**
   - Mata (x 700–760, y 270–320): rongga indigo, sabit magenta, satu titik. Tanpa iris, tanpa kilau, padahal `crop-face-2x-6111.png` punya keduanya.
   - Bibir dan janggut (x 700–1000, y 500–690) menjadi marmer berurat. L > 0,2: 34 pulau, 25 di bawah 50 px.
   - 16,3% bidang di dalam rentang baris kontur wajah dingin (helai ikal di pipi x 830–880, y 230–500, garis mulut, janggut). Lubang tertutup hanya 0,6%.
   - Hidung satu bidang kuning (rata-rata 0,66 pada x 705–760, y 380–430): panas mengikuti terang foto, belum mengikuti bentuk.
   - Cincin oranye di tepi highlight 6–8 px; tepi 90→10% 22–28 px.
4. **Oklusi ada, tetapi di atas bidang kosong.** 25,6% tinta BILLY dan 30,4% tinta MAULANA berada di atas sosok; luminans tertinggi di balik huruf 0,057. Tidak ada huruf yang bertemu bentuk yang terbaca (wajah, helai, bahu bertekstur).
5. **Eksposur tengah mendekati huruf.** Magenta (L ≥ 0,108) turun sampai y 684 di x 1056: 25 px dari "N". L ≥ 0,2 sampai y 673: 36 px.
6. **Ritme kolom kiri.** Baseline BILLY (y 191) → kapital tagline (y 242) = 51 px. Baseline meta (±y 669) → kapital MAULANA (y 709) = 40 px; dari descender 37 px. Etos (y 324) → meta (y 535) kosong 211 px.

### touch-1440x900
1. **Lima sambungan keras.** Batas di y 244, 305, 366, 427, 488 (kelipatan 61). Transisi 1 px: di x 860 luminans 0,254 → 0,092 antara y 365 dan 366. Panjang kontinu sampai 122 px, terputus-putus sepanjang 248–533 px.
2. **Dua bahasa distorsi, tanpa pendar di tepi pita.** Di dalam tiap blok geseran diredam ke nol di tepi pita (riak zigzag); di batas blok ia melompat (garis lurus).
3. **Peristiwanya masih kecil.** Piksel berubah (kanal mana pun > 20 level) 5,38% frame, x 445–1170, y 122–571. C9+ hanya 0,37% frame. Lapis fluida termal yang tertulis di interaksi konsep F1 tidak ada di frame.

Yang benar di frame ini: 53 dari 171.489 piksel tinta teks berubah (anti-alias), nama utuh; piksel L > 0,5 terdekat 147 px dari tinta BILLY.

### splash-1440x900
1. **Pita horizontal di atas wajah.** 13 puncak pita di kolom x 720–840 (y 291–635), jarak 13–57 px, modulasi 49,8% dari rata-rata. Tidak periodik, tetapi wajah profil tetap utuh di baliknya.
2. **Tanpa puncak dan tanpa tepi.** L maksimum 0,555; L > 0,5 hanya 0,01% frame. Tepi profil 41–72 px (hero 32–46 px pada baris yang sama). `effect-audit` detail 1,74% (< 2%).
3. **Bukan gambar tersendiri.** Korelasi luminans terhadap hero tanpa teks 0,875; IoU siluet 0,756. Penghitung "47" (x 241–256, y 312–321) mengambang di 465 kolom hitam tanpa jangkar yang terlihat.

### hero-390x844
1. **Dua kata nama tidak sama besar.** BILLY 107 px (kapital 75 px), MAULANA 55,3 px (kapital 39 px): 1,93×. Syarat shortlist putaran 2: "nama dua kata sama besar". MAULANA terhadap tagline 3,5×, terhadap meta 4,6×.
2. **Indigo menguasai layar.** C1 37,75% · C1–C3 55,97% · hitam yang terlihat 22,20%.
3. **Teks kecil di atas sosok tanpa niat tertulis.** Tinta di atas sosok: tagline 24–38%, meta 55–75%, etos 80%. Kontras tinta median meta 12 px terhadap latar terpanas di baliknya 4,41–4,51:1; etos 4,84:1. Celah "LA" 2 px.
4. **Eksposur ketiga di luar layar** (jangkar x 484 pada lebar 390).

## Klaim type-spec terhadap gambar

| Klaim | Terukur | Status |
|---|---|---|
| BILLY tinta x 48–742, cap-top 48, baseline 191 | x 47,76–743,11; y 48–191 | cocok (kanan +1,1 px) |
| MAULANA tinta x 48–1392, cap-top 709, baseline 852 | x 47,69–1392,23; y 709–855 (overshoot "U") | cocok |
| Tepi kiri tinta semua teks di x 48 | 47,69–49,53 | cocok dalam 1,84 px |
| Rasio display:meta 14,8×; dua kata sama besar (desktop) | 207,8 : 14; kapital 144 px keduanya | cocok |
| Jarak antarhuruf MAULANA "titik terdekat": 15 · 11 · 28 · 13 · 15 · 15 | 15,0 · **29,9** · 28,0 · 13,0 · 15,0 · 15,0 | **A–U tidak cocok**: 11 px adalah celah kotak; titik terdekat 29,9 px |
| Ponsel: BILLY 107 px x 16–374; MAULANA 55,3 px x 16–374 | 15,91–373,99; 15,75–373,99 | cocok |
| 25,5% tinta BILLY dan 30,3% tinta MAULANA di atas sosok; ponsel 37,8% dan 25,5% | 25,6% · 30,4% · 38,1% · 25,5% | cocok |
| "L" pertama bebas 41 px; kaki "L" kedua menumpang 86–111 px | 41 px di baseline; tumpang sampai 111 px di baseline | cocok |
| Tidak ada huruf yang menyentuh wajah panas: batas bawah y 658, jarak 51 px | y 658 hanya untuk wajah akhir. Eksposur tengah: L ≥ 0,2 sampai y 673 (36 px), L ≥ 0,108 sampai y 684 (25 px) | **sebagian**: tidak ada sentuhan, tetapi 51 px hanya berlaku untuk satu dari tiga wajah |
| Huruf selalu di depan dan utuh | 0 huruf tertutup; 53 px berubah saat sentuh | cocok |
| Kontras minimum nama 8,93 · 10,22 · ponsel 8,30 · 10,41 | di balik huruf: 8,86 · 10,14 · 8,24 · 10,34. Dengan cincin 8 px di sekeliling huruf: 8,86 · 9,60 · 8,24 · 9,23 | cocok untuk "di balik huruf" (selisih < 1%); terhadap tetangga terdekat MAULANA 6–11% lebih rendah. Semua ≥ 7:1 |
| Wajah akhir: tinggi kulit panas 445 px, rata-rata 0,201, puncak 0,875 | 446 px (L ≥ 0,2); puncak 0,8748; rata-rata 0,224 (kotak x 697–999, y 213–658), 0,438 (hanya L ≥ 0,2), 0,345 (C4+) | tinggi dan puncak cocok; **0,201 tidak bisa direproduksi** tanpa definisi areanya |
| L > 0,2 = 7,70% (wajah akhir 4,24%); L > 0,5 = 1,52% | 7,70% (4,19%); 1,52% | cocok |
| Momen sentuh mengubah 4,4% frame | 4,52% pada ambang luminans 0,03; 5,38% pada ambang 20 level per kanal; 7,13% pada ambang 0,01 | cocok pada satu ambang; spec tidak menyebut ambangnya |
| Grain σ 2,5% di ground | 2,52% (di batang "Y" 2,77%) | cocok |
| Tiga audit hijau, 14 dan 11 elemen | 14 dan 11 item di `layout/ink/align.json`; dua viewport | cocok |
| "47" tepat di posisi "60" | "47" x 241–256; "60fps." mulai x 242 | cocok |
| Tiga eksposur dari IMG_6111 yang sama, jarak 296 px, naik 8 px | geser terbaik (296, −9) dan (592, −16) | cocok |
| Peta panas dihaluskan dengan bobot 0,46 / 0,38 / 0,16 | bawaan `bake.sh` 0,42 / 0,36 / 0,22; nilai spec hanya benar bila variabel `WB` disetel saat bake | **tidak bisa diverifikasi** |
| Ponsel: dua kata "sengaja tidak sama besar" | 1,93× | cocok dengan spec, **bertentangan dengan syarat shortlist** |

Angka geometri spec benar. Empat hal yang meleset semuanya soal label atau cakupan klaim, bukan soal piksel. Yang lebih
penting: spec menulis terus terang bahwa satu foto dipakai tiga kali, sedangkan `effect-direction.md` menulis tiga foto
sebagai satu tolehan dan potret retus sebagai sumber luminans. `bake.sh` membaca luminans dari
`c/src/IMG_6111-main.png` (foto asli); `figure-6111.png` hanya dipakai alfanya.

## Dibanding contoh efek Billy

Jawaban pendek: **lebih dekat daripada revisi 1, belum setara**. Luas nyala kini setara FUTURE; kekayaan gambar belum.

| Ukuran | F1 rev 2 hero | FUTURE `853dd` | STROBOSCOPIC `58fd1` | GRIND `ad72e` | BLURRED `20179` |
|---|---|---|---|---|---|
| Ground hitam (`thermal-zones`) | 45,4% tanpa teks; 36,1% di JPG | 85,4% | 20,5% (poster berbingkai) | 62,1% | 69,2% |
| Hangat dari bidang berwarna (mid + hot + peak) | 28,2% | 81,7% | 60,1% | palet hijau | hitam-putih |
| Hot + peak dari bidang berwarna | 7,8% | 42,2% | 34,0% | — | — |
| Area menyala L > 0,2 dari frame | 7,70% | 9,3% | 29,5% | 25,0% | 27,6% |
| Area terang L > 0,5 dari frame | 1,52% | 2,1% | 13,2% | 9,7% | 24,1% |
| Tepi 90→10% terhadap lebar subjek | 22–28 px = 7–9% lebar kulit wajah | 34–89 px = 12–31% | 25–34 px | 31–65 px = 3,6–7,6% | tepi = goresan |
| Detail kotak mata (dinormalkan 200×133) | 0,51 level/px; 0,0% lompatan > 12 level | mata tertutup pita | 4,37 level/px; 14,0% | mata tertutup | — |
| Eksposur | 3 cap identik, tumpang-tindih ±2% | 1 | 4–5 pose berbeda, tumpang-tindih ±45–60% (perkiraan dari posisi mata) | 1 | 1 |
| Grain σ di bidang gelap | 2,52% | 0,32% | 3,19% (tepi poster) | 1,61% | 0,00% di ground; tekstur ada di goresan |

Per aspek:

| Aspek | Contoh | F1 rev 2 |
|---|---|---|
| Cahaya | Subjek adalah sumber cahaya; bagian gelapnya jatuh ke hitam | Wajah menyala, tetapi rambut dan badan diangkat menjadi indigo rata 33,8% frame |
| Waktu | STROBOSCOPIC: tiap eksposur pose lain, saling menembus, mata tajam di semuanya | Satu pose dicap tiga kali dengan langkah tetap |
| Gradasi | FUTURE dan GRIND: tiga sampai empat zona tonal besar, bayangan hitam murni | Zona besar di hidung, marmer di janggut, 34 pulau |
| Pendar | FUTURE 12–31% lebar subjek | 7–9%: setara GRIND, di bawah FUTURE |
| Goresan | BLURRED: garis 1–2 px, panjang acak, ujung meruncing | Gigi sisir ungu di kanan tiap wajah, amplitudo 0,024 pada rata-rata 0,050; tidak terbaca sebagai sapuan |
| Grain | σ 0,3–3,2% | 2,52%: sudah setara |

## Status enam revisi prioritas lama

| # | Revisi lama | Status | Angka |
|---|---|---|---|
| 1 | Wajah jadi subjek, rambut dipotong tepi | **sebagian** | Tinggi kulit 446 px (target ≥ 430). Kulit 6,20% frame pada C4+ (target ≥ 5,5%). Rambut terpotong tepi atas dan kanan. Jarak ke BILLY 50,9 px; ke MAULANA 40 px untuk wajah akhir, 25 px untuk eksposur tengah (target ≥ 36). Pose awal terbaca sebagai wajah, tetapi lewat tiga salinan berjarak 296 px, bukan satu pose lain 180–220 px. Uji A/B pose 6096: tidak ada buktinya. Ponsel: pita hitam mati hilang. |
| 2 | Suhu dari potret yang diterangi dan dari bentuk | **sebagian** | L > 0,2 = 7,70% (target ≥ 6%), tetapi wajah akhir sendiri 4,19%. L > 0,5 = 1,52% (≥ 1%). Oranye C6 2,57%. Pulau 34 (target ≤ 15). Lubang tertutup 0,6%; bidang dingin di dalam kontur 16,3% (target ≤ 8%). Rambut tiga nada rata, C3 hanya di rim 0,054–0,067 (target gradasi C1 → C3). Sumber luminans tetap foto asli; depth tidak dipakai. |
| 3 | Pendar aditif dan rim lunak | **sebagian** | Tepi 22–28 px (target 30–60; dulu 5–9). Cincin oranye 6–8 px (target 12–20). Latar di balik huruf maks 0,057 (batas 0,085). Rim rambut puncak 0,046–0,067 selebar ±24 px. |
| 4 | Sapuan lahir dari wajah, bukan pita | **sebagian** | Tepi lurus terpanjang: hero 30 px, splash 80 px (batas 120). Kapsul splash hilang. Pita jejak dihapus, bukan diperbaiki: goresan oranye–magenta 240–320 px dari pipi dan hidung tidak ada. Sentuh: 5,38% frame (target ≥ 6–8%), tinggi pita dikunci blok 61 px, tepi pita tanpa pendar, masih dua bahasa distorsi, garis 1 px diganti lima sambungan. Profil splash 41–72 px, belum "tepi tajam". |
| 5 | Grain yang benar-benar ada | **terpenuhi** | σ 2,52% di ground (target 2,5–3,5%). Di huruf 2,77% (target 1,5–2%), tanpa menjatuhkan kontras: blok terburuk 7,16:1. |
| 6 | Huruf bertemu sosok; rapikan tipografi | **sebagian besar** | "Y" 100% di atas rambut; "L" kedua menumpang sampai 111 px (keputusan tegas, tertulis). Kontras 8,86:1 (≥ 8). Latar MAULANA rata-rata 0,021–0,028. Tinta MAULANA di atas sosok 30,4% (target ≥ 35%). Kontras MAULANA 9,60:1 (≥ 9). "LA" 13,0 px (target 14–16); "UL" 28,0 px (target 24). Ponsel: BILLY 107 px, oklusi 38,1% dan 25,5%. |

Catatan atas status ini:
- Target luas revisi 1 dan 2 tercapai lewat penggandaan. Itu pola #17 dan pola #16 sekaligus: angka lama hijau, cacat baru terbuka.
- Butir ponsel pada revisi 6 (BILLY 107 px, MAULANA 55,8 px) adalah saran kritik lama yang bertabrakan dengan syarat shortlist. Frame mengikuti sarannya; pelanggarannya tetap terhitung.
- Kritik lama menulis "jangan mengejar detail mata" karena mata 6120 setengah tertutup. Revisi 2 memakai 6111, yang irisnya terlihat di sumber, jadi alasan itu tidak berlaku lagi.

## Temuan baru yang belum ada di kritik lama

1. **Tiga cap identik** (korelasi 0,960 / 0,950, jarak 296 : 296, tumpang-tindih ±2%). Revisi 1 memakai tiga foto.
2. **Gambarnya bergeser dari F1 ke G1.** Konsep F1 menulis jejak "hanya memakai siluet rambut dan bahu (bukan wajah kedua)". Wajah berjajar adalah struktur G1 "Satu Eksposur", yang gagal gerbang konsep di 6,6 dengan catatan "melemahkan prinsip 1" dan "dekat keluarga stroboscopic recursion". G1 sendiri menulis bahannya "bukan salinan digital dari satu foto".
3. **Identitas rambut hilang.** Lompatan luma > 12 level di rambut 2,01% (v1) → 0,00%; pada seluruh sosok 4,72% → 0,78%. Konsep menyebut siluet rambut ikal sebagai "bentuk yang tidak bisa ditukar".
4. **Hitam bukan lagi mayoritas.** Terlihat 34,8% (desktop) dan 22,2% (ponsel); konsep F1 menulis "hitam sekitar 55% bidang".
5. **Sambungan periodik 61 px di momen sentuh**, berasal dari `floor(p.y / 61.0)` di `index.html`: tinggi pita diacak per blok 61 px, sehingga batas blok menjadi garis lurus.
6. **Target luas panas dicapai dengan tiga salinan** (7,70% vs 4,19%).
7. **Eksposur lama tidak lebih tersapu** (tepi 14–26 px vs 22–25 px), berlawanan dengan `effect-direction.md` ("pose awal paling dingin dan paling tersapu").
8. **Splash adalah hero yang diredupkan** (korelasi 0,875).
9. **Ponsel:** dua ukuran nama (1,93×), meta 12 px di atas bahu (4,41–4,84:1), hitam 22,2%.
10. **Sumber luminans** masih foto asli; yang berubah hanya masker kulit.
11. **Ritme vertikal** 51 vs 40 px; **eksposur tengah** 25 px dari "N".
12. **Tiga klaim spec** yang tidak cocok atau tidak bisa diverifikasi (A–U, 51 px, 0,201) dan satu yang bergantung variabel lingkungan (bobot blur).

## Sebab yang terlihat di compositor

Dibaca dari `comp/frames.js`, `comp/index.html`, `comp/bake.sh`.

- **Tiga cap:** `POSES_DESKTOP` memuat `heat-6111` tiga kali pada x 1316 / 1020 / 724; `trail0[3]` dan `trail1[3]` = 1,0 menampilkan pose tak-tersapu penuh.
- **Rambut rata:** suhu rambut = kanal B × `uHair.x` (0,14) × penguatan pose; kanal B adalah luminans yang di-blur σ 30 px lalu dijepit 55–100%.
- **Mata lunak:** campuran area mata 0,16 / 0,30 / 0,54 dari blur σ 14 / 4,5 / 1,2 px pada tekstur setengah resolusi, lalu masker elips di-blur σ 22 px.
- **Sambungan sentuh:** `bandH = mix(14, 46, h1(floor(p.y / 61.0) + 3.0))`; `soft` meredam geseran di tepi pita, sehingga satu-satunya tepi keras justru batas blok 61 px.
- **Bukan dari potret retus:** `bake.sh` baris 7 membaca `c/src/IMG_$id-main.png`; `figure-$id.png` hanya di `-alpha extract`.

## Revisi prioritas berikutnya

Ini revisi kedua. Definition of Done butir 6 membatasi polish pada dua putaran: bila frame disajikan, sajikan bersama skor
dan tiga alasan di atas. Gate henti `critique.md` (pemotretan ulang dua pose tolehan) tetap berlaku bila butir 1 dan 3 di
bawah tidak bisa dicapai dari foto yang ada.

### Yang mengubah gambar

1. **Jejak = waktu, bukan salinan.**
   - Korelasi luminans jendela hidung–mata antar-eksposur ≤ 0,80 (kini 0,960 dan 0,950).
   - Rasio dua jarak antar-eksposur ≥ 1,3 (kini 1,00), dan tumpang-tindih antar-wajah ≥ 30% lebar wajah (kini ±2%); atau wajah lama tidak tampil utuh (siluet rambut dan bahu saja, seperti mitigasi risiko 1 konsep F1).
   - Tepi 90→10% eksposur tertua ≥ 2× wajah akhir (kini 14–26 px vs 22–25 px).
2. **Hitam kembali jadi ground; rambut membawa tekstur.**
   - Hitam yang terlihat ≥ 50% frame di 1440×900 (kini 34,8%) dan ≥ 35% di 390×844 (kini 22,2%).
   - Bidang tanpa gradien pada render tanpa grain ≤ 8% frame (kini 26,74%).
   - Lompatan luma > 12 level di area rambut ≥ 1,5% (kini 0,00%; v1 2,01%), dengan gradasi C1 → C3 di dalam satu kubah (kini satu nada per kubah).
   - Porsi hangat tinta sosok 40–55% (kini 27,5%).
   - Nama tetap ≥ 7:1 (kini 8,86:1) dan ≥ 25% tintanya tetap di atas piksel sosok (kini 25,6% dan 30,4%).
3. **Wajah akhir tahan zoom 2×, dalam satu bahasa.**
   - Sumber luminans `figure-6111.png`, bukan `IMG_6111-main.png`.
   - Jalur detail: gradien rata-rata kotak mata ≥ 2,0 level/px (kini 0,51), lompatan > 12 level ≥ 5% (kini 0,0%), pulau L > 0,2 ≤ 15 (kini 34).
   - Atau jalur lunak penuh: tepi ≥ 36 px (≥ 12% lebar kulit wajah; kini 22–28 px), bayangan rongga mata, bawah hidung, dan bibir jatuh ke L < 0,0084, pulau ≤ 10.
   - Di kedua jalur: cincin oranye di tepi highlight 12–20 px (kini 6–8 px).
4. **Momen sentuh bersih dan lebih besar.**
   - 0 garis lurus > 60 px dengan transisi ≤ 1 px (kini 5 sambungan, kontinu sampai 122 px).
   - Simpangan baku jarak antar-batas pita ≥ 8 px (kini 0 px pada lima batas utama); transisi vertikal di tepi pita ≥ 4 px; satu bahasa distorsi.
   - Piksel berubah (kanal mana pun > 20 level) ≥ 6% frame (kini 5,38%).
   - Tulis keputusan tentang lapis fluida termal dari interaksi konsep F1. Bila dipertahankan, frame sentuh memuatnya di belakang sosok dan huruf.
5. **Splash berdiri sendiri.**
   - Korelasi luminans terhadap hero ≤ 0,70 (kini 0,875).
   - Tepi profil kiri ≤ 30 px (kini 41–72 px).
   - Modulasi pita horizontal di wajah ≤ 25% (kini 49,8%), atau pita diganti goresan halus dengan ≥ 60% ujung di dalam frame.
   - `effect-audit` detail ≥ 2% (kini 1,74%).

### Yang sekadar merapikan

6. **Ponsel, nama.** Rasio ukuran dua kata 1,00 (kini 1,93) dan rasio display terhadap tagline ≥ 5× untuk keduanya (kini 6,7× dan 3,5×). Dua syarat ini bertabrakan pada tata letak sekarang; perlu keputusan tertulis, bukan pengecualian diam-diam.
7. **Ponsel, teks kecil.** 0% tinta meta dan etos di atas sosok, atau kontras tinta median ≥ 7:1 (kini 4,41–4,84:1 dengan 55–80% tinta di atas sosok) dan niatnya ditulis.
8. **Desktop, ritme.** Selisih antara jarak baseline BILLY → kapital tagline dan baseline meta → kapital MAULANA ≤ 2 px (kini 51 vs 40 px).
9. **Jarak panas ke MAULANA untuk semua eksposur.** L ≥ 0,108 berjarak ≥ 36 px dari tinta (kini 25 px di x 1056, y 684).
10. **Spec.** Perbaiki label A–U (29,9 px), cakupan klaim 51 px, definisi 0,201, bobot blur; tulis ulang "Sumber gambar" sesuai `bake.sh`.
11. **Audit.** Tiga audit geometri di 390×664 dan 1180×820 begitu frame-nya ada (kini 2 viewport).

Bila hanya butir 6–11 yang dikerjakan, itu pola #8 dan skornya tidak akan bergerak.

## Yang dipertahankan

- Nama utuh tanpa efek: Archivo Expanded 800 uppercase, 207,8 px, dua kata sama besar di desktop, tepi 47,7 / 47,8 px, kontras ≥ 8,86:1, tidak berubah saat sentuh.
- Oklusi nama–sosok yang tegas dan tertulis ("L" kedua menumpang sampai 111 px, "Y" penuh di atas rambut).
- Satu famili, dua weight, tiga nilai tracking; tepi kiri satu garis (47,69–49,53 px).
- Grain σ 2,52%.
- Penghitung splash yang mendarat di "60" pada baris etos.
- Wajah akhir 6,68–7,65:1 terhadap ground; luas nyala setara FUTURE.
- Semua konten dari `profile.ts`.

## Prediksi tersegel

Belum ditulis ke `docs/awwwards/calibration/predictions.jsonl` (kritikus diminta tidak mengubah file lain). Baris siap tempel:

```json
{"ts":"2026-11-23T10:10:00Z","route":"/explore/concept/2#styleframes-r2-F1-rev2","a_score":6.26,"t_score":6.29,"scores":{"a":{"design":6.4,"ux":6,"creativity":6,"content":7},"t":{"profile":6.5,"antislop":5.5,"editorial":7.2,"mood":6.5,"novelty":5.5}},"mood":["cinematic","monumental"],"predict":"reject","reasons":["min(A,T) 6,26 < 8,0; WOW gagal (plafon Anti-Slop 6)","prediksi verdict: reject 50% / revise 37% / ship 13%","jejak stroboskop = tiga cap IMG_6111 yang sama: korelasi luminans 0,960 dan 0,950 pada geser 296 dan 592 px, tumpang-tindih antar-wajah 2%, eksposur lama tidak lebih tersapu (tepi 14-26 px vs 22-25 px); tolehan tiga foto pilihan Billy tidak ada; struktur jatuh ke G1 yang gagal gerbang konsep (6,6)","massa indigo rata: C1-C2 33,8% frame, 26,74% frame tanpa gradien, hitam terlihat 34,8% (ponsel 22,2%), porsi hangat tinta sosok 27,5% vs 60-82% pada contoh termal Billy; tekstur rambut ikal hilang (lompatan luma >12 level 2,01% di v1 -> 0,00%)","wajah di 2x: gradien kotak mata 0,51 level/px vs 4,37 pada contoh stroboskop; zona panas 34 pulau; cincin oranye 6-8 px","sentuh: 5 sambungan keras 1 px tepat tiap 61,0 px (y 244-488), dua bahasa distorsi, perubahan 5,38% frame (target lama 6-8%)","ponsel: BILLY 107 px vs MAULANA 55,3 px (1,93x) melanggar syarat nama dua kata sama besar; meta 12 px di atas bahu 4,41-4,84:1; hitam terlihat 22,2%","splash: korelasi 0,875 dengan hero, detail 1,74% (<2%), pita horizontal di wajah (modulasi 49,8%) dekat kosakata garis-pindai Concept 1","target luas panas dicapai lewat tiga salinan: L>0,2 7,70% frame vs 4,19% wajah akhir (pola #17); sumber luminans masih foto asli, bukan potret retus"],"actual":null}
```

## Batas penilaian

- Hanya gambar diam. Kilat rana, easing, dan rasa splash → hero tidak bisa dinilai; WOW bisa berubah bila gerak itu kuat.
- `taste-lint` tidak dijalankan (frame gambar, bukan rute). Dari angka spec saya tidak menemukan pelanggaran rentangnya; itu bukan pengganti menjalankannya.
- Tiga audit geometri adalah keluaran pembuat pada dua viewport. Yang saya periksa sendiri dari piksel: tepi tinta tiap baris dan ketiadaan tabrakan teks–teks.
- `effect-audit` mode idle pada hero: idle-coverage 43,67% (batas 2%) dan 19 pita hue (batas 4). Menurut aturan alat itu keduanya FAIL. Alat dikalibrasi untuk fluida: ia menghitung potret statis sebagai "menyala", dan ramp C0–C10 sendiri melintasi 250° sampai 50°. Saya melaporkannya sebagai temuan alat dan tidak memakainya untuk skor; pertanyaan yang sebenarnya (adakah yang bergerak sendiri saat diam) baru bisa dijawab di rute.
- `thermal-zones` dipakai sebagai pembanding terhadap contoh Billy. Master brief menyebut kuota zona sebagai panduan halaman, bukan gate per frame.
- Tumpang-tindih eksposur pada contoh stroboskop (±45–60%) adalah perkiraan dari posisi mata, tidak diukur.
- Saya tidak yakin pada dua hal: di layar apa Billy melihat frame (mata dan janggut jauh lebih lemah di 2×), dan apakah ketiga foto bisa diselaraskan menjadi satu tolehan tanpa terbaca tempelan. Yang kedua harus diuji sebagai gambar dulu.
