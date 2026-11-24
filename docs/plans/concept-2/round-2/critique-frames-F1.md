# Kritik frame putaran 2 — F1 "Rana Kedua"

Kritikus: agen art-director-critic (Fable), 2026-11-23 15:40 WIB. Tahap styleframe; audit browser tidak berlaku.

Yang dinilai: `styleframes/F1/splash-1440x900.jpg`, `hero-1440x900.jpg`, `touch-1440x900.jpg`, `hero-390x844.jpg`,
`type-spec.md`, dan render 2× tanpa grain di `billy-portfolio-assets/concept-2/r2-F1/comp/out/`.
Pembanding: empat contoh efek Billy (`reference style concept/effect/`), enam contact sheet, frame c putaran 1,
screenshot Concept 1.

Cara ukur: piksel dibaca dari `comp/out/audit/hero-type0.png` (tanpa teks), `hero-type1.png`, `hero-mask.png`, dan render 2×.
Luminans = luminans linear sRGB; kontras = (L₁ + 0,05) / (L₂ + 0,05); ground terukur 0,0016. Koordinat 1× (1440×900)
kecuali disebut lain. Angka pada contoh efek diambil dari JPG 735–1158 px, jadi bersifat indikatif.

## Skor

| | Nilai |
|---|---|
| A-score | **6,2** (6,15) — Design 6,0 · UX 6,5 · Creativity 5,5 · Content 7,0 |
| T-score | **5,7** (5,73) — Taste Profile 6,5 · Anti-Slop 5,0 · Editorial 6,0 · Mood 5,5 · Novelty 5,0 |
| min(A, T) | **5,7** → belum lolos gate 8,0 |
| Dimensi terendah | Anti-Slop 5,0 dan Novelty 5,0 |
| Uji gagal | **WOW** (plafon Anti-Slop 6). NEIGHBOR tidak bisa diuji; SWAP dan EMPTY lolos lemah |
| Prediksi verdict Billy | **reject** (±60%) · revise ±35% · ship ±5% |
| Kalimat lama yang paling mungkin terulang | *"fotor saya thermal juga tidak rapih"* · *"masih jelek jauh dari awwwards"* |

Skor ini tidak dikalibrasi terhadap angka kritikus putaran 1 (c = 6,8 / 6,5, lalu Billy menyebutnya *"jelek"*). Angka itu
terbukti terlalu tinggi, jadi F1 dinilai terhadap rubrik dan terhadap contoh efek Billy, bukan terhadap skor c.

| Dimensi | Skor | Alasan |
|---|---|---|
| Design 40% | 6,0 | Nama kuat dan terukur. Gambar utamanya belum setingkat: rambut satu nada 21,4% frame, wajah 2,9% frame, bercak di 2×, jejak berupa pita bergaris. |
| UX 30% | 6,5 | Terbaca dan berhierarki. Tidak ada navigasi atau isyarat interaksi di frame; ponsel kehilangan skala (4,65×) dan punya dua pita hitam mati. |
| Creativity 20% | 5,5 | Ide "eksposur panjang saat menoleh" tidak terbaca. Yang terlihat: potret termal + ekor garis + irisan glitch. |
| Content 10% | 7,0 | Tujuh fakta, semuanya ada di `profile.ts`, ringkas. Belum ada jalan keluar (karya, kontak). |
| Taste Profile 30% | 6,5 | Font, tiga foto, dan arah efek pilihan Billy dipakai. Pilar liquid absen; pilar premium dan cinematic lemah. |
| Anti-Slop 25% | 5,0 | WOW gagal. Wajah termal belum rapi di 2× dan splash menyerempet larangan potret garis-pindai. |
| Editorial 20% | 6,0 | Satu famili, ukuran terukur, tabular-nums. Rasio ponsel 4,65× < 5×, celah "LA" 4–5 px, leading 1,40 / 1,43 di luar tier 1,3 / 1,2, oklusi tanggung. `taste-lint` tidak dijalankan (frame gambar, bukan rute). |
| Mood 15% | 5,5 | Target cinematic · premium · mystic. Yang keluar monumental + nostalgic (scanline). Tidak ada anti-mood aktif. |
| Novelty 10% | 5,0 | Pola #27 dan #30 tidak diulang. Diulang dengan variasi: potret termal bergaris (Concept 1), kerangka frame c, dan #17. |

## Tiga alasan utama skor

1. **Subjeknya tidak menyala.** 89% tinta figur dingin dan area terang (L > 0,5) hanya 0,13% frame; pada empat contoh Billy 2–24%.
2. **Idenya tidak terbaca.** Tiga foto profil searah, pose awal tanpa wajah, jejak berupa pita bergaris bertepi lurus: terbaca "foto termal + ekor glitch".
3. **Huruf dan sosok tidak pernah bertemu.** "L" 6 px dari rambut, "Y" masuk 32 px, 99,4% tinta MAULANA di atas latar yang tidak terlihat (L ≤ 0,01): prinsip 7 yang membuat F1 terpilih tidak ada di gambar.

## Uji 30 detik

| Uji | Hasil | Catatan |
|---|---|---|
| OBJECT | lolos | Potret termal adalah elemen non-teks yang jelas. |
| SWAP | lolos lemah | Wajah dan siluet rambut Billy tidak bisa ditukar. Perlakuannya (peta gradien + nama raksasa) bisa dipakai siapa pun dengan fotonya; pengait "60fps = frame" hanya hidup di satu baris 14 px. |
| EMPTY | lolos lemah | Tanpa teks masih ada potret, tetapi yang tersisa bola rambut ungu, wajah 2,9% frame, dan pita garis. |
| WOW | **gagal** | Tidak ada bidang yang menyala; momen sentuh mengubah 2,03% frame; splash terbaca smear scanline. |
| NEIGHBOR | tidak diuji | Belum ada section tetangga. Splash dan hero cukup berbeda satu sama lain. |

## Yang terlihat (per frame)

### splash-1440x900
- **3 detik:** kapsul garis horizontal ungu yang melesat ke kanan dengan inti oranye; angka "47" kecil di kanan atas. Tidak terbaca sebagai orang.
- **Ide terbaca?** Tidak. "Rana terbuka" hanya ditopang angka 14 px tanpa satuan. Bacaan spontan: tracking VHS, pixel-stretch, komet.
- **Templat / garis-pindai?** Ya, dua-duanya. Ini frame yang paling dekat dengan potret garis-pindai Concept 1: wajah profil masih utuh di balik kerai horizontal, palet sama. Ia juga berisiko terbaca seperti *"bentuk shader yang muncul di awal"* yang Billy tolak pada 2026-08-02.

### hero-1440x900
- **3 detik:** BILLY / MAULANA krem raksasa; kepala profil termal berupa bola rambut ungu dengan wajah oranye kecil; gumpalan ungu bergaris di tepi kanan.
- **Ide terbaca?** Tidak. Yang terbaca "kepala melaju ke kiri dengan ekor garis", bukan satu eksposur saat menoleh. Sebabnya ada di bahan dan di eksekusi:
  - Ketiga foto adalah profil ke arah yang sama; yang berubah di antara foto adalah arah badan, bukan sudut wajah. "Menoleh" tidak ada di bahan.
  - Wajah dua pose awal tidak terbaca: yang tersisa massa rambut dan satu pita magenta–oranye, jadi tidak terbaca sebagai orang yang sama pada waktu sebelumnya.
  - Kepala akhir adalah potongan tajam di depan lapis bergaris; tidak ada goresan yang keluar dari wajahnya sendiri.
  - Tatapan ke penonton dan torsi tubuh yang dijanjikan konsep tidak ada: Billy menatap ke luar frame, badan tidak terlihat.
  - Diagonal dua baris nama yang dijanjikan konsep juga tidak ada: kedua kata mulai di x 48, MAULANA selebar frame. Semua sumbu mendatar atau tegak.
- **Templat / garis-pindai?** Figur utama terbaca peta gradien di atas foto (filter termal). Sepertiga kanan (x 1130–1439) terbaca scanline di atas foto rambut. Tata letak dan palet keseluruhan dekat dengan Concept 1: profil berambut besar di kanan, nama di kiri, ramp yang sama.

### touch-1440x900
- **3 detik:** sama dengan hero. Perubahan baru terlihat bila dicari: dahi dan mata terpotong menjadi irisan yang bergeser, rambut atas beriak.
- **Ide terbaca?** Tidak relevan; sebabnya (pointer) tidak tampak dan akibatnya terlalu kecil untuk dibaca sebagai peristiwa.
- **Templat?** Ya: irisan glitch + wave warp.

### hero-390x844
- **3 detik:** BILLY kecil di kiri atas, kepala termal di tengah, MAULANA selebar layar, enam baris teks.
- **Ide terbaca?** Tidak. Jejak tinggal gumpalan terpotong di tepi kanan.
- **Templat?** Peta gradien di atas foto, sama dengan desktop.

### Dibanding frame c putaran 1
Maju nyata pada dua keluhan Billy: nama utuh di font pilihannya (kontras minimum 10,4:1; pada c huruf "y" tertutup 26,8% dan
"ll" dilumuri panas) dan wajah terlihat (5,4:1; pada c 1,14:1). Yang belum berubah: kerangka nama dua baris + daftar meta +
sosok di tengah-kanan, dan mutu gambar sosoknya. Kemajuannya ada di sisi benar, belum di sisi indah.

## Cacat terbesar

### splash-1440x900
1. **Bentuk kapsul geometris.** Tinta x 488–1440, y 116–626; tepi atas (y 116–146) dan bawah (y 596–626) mendatar sepanjang x 800–1440, ujung kiri busur halus di x 488–620. Contoh sapuan Billy tidak pernah punya tepi lurus.
2. **Kerai seragam.** ±27 pita di kolom x 1000 (lebar median 4 px, maksimum 70 px), semuanya keluar tepi kanan sehingga tidak ada satu pun ujung goresan yang terlihat. Wajah profil tetap utuh di baliknya (x 630–860, y 320–560).
3. **Tanpa puncak cahaya dan tanpa sebab yang terbaca.** L > 0,5 hanya 0,11% frame, L > 0,2 hanya 0,90%; 91% tinta indigo–ungu. Penghitung "47" berukuran 14 px di x 1353–1368, y 56–66. Sepertiga kiri dan 30% bawah frame hitam tanpa jangkar.

### hero-1440x900
1. **Sosok tidak menyala dan tidak rapi.** Kepala x 480–1129, y 105–699 (24,7% frame).
   - Rambut 21,4% frame dalam satu nada ungu pada 1,72:1 terhadap ground, dengan serpih terang seperti debu.
   - Kulit wajah x 631–839, y 314–629 hanya 2,9% frame (oranye–kuning 1,4%); L > 0,5 hanya 1.681 px (0,13% frame).
   - Zona panas wajah (L > 0,2) pecah menjadi 85 pulau, 76 di antaranya < 50 px; 23,5% bidang di dalam kontur wajah adalah lubang ungu (helai rambut di pipi x 710–850, y 320–550, janggut, noise). Di crop 2× ini terlihat sebagai bercak dan blok.
   - Mata hanya baji oranye ±15×17 px di x 642–657, y 380–397, tanpa iris; kelopaknya satu bidang magenta.
2. **Jejak terbaca pita scanline yang ditempel.** x 1130–1439, y 116–634.
   - Tepi atas y 118–125 dan bawah y 615–620 mendatar; ±39 pita per 500 px di kolom x 1300.
   - Guratan rambut pose awal masih terlihat utuh di bawah garis (tidak ikut tersapu).
   - Sambungan tajam dengan kepala di x 1121–1178: luminans melompat 0,04–0,06 → 0,11–0,12.
   - Pita hangatnya (x 1130–1439, y 267–565) terpisah 291 px dari wajah, jadi tidak terbaca berasal dari wajah.
3. **Huruf dan sosok serba tanggung.**
   - Kaki "L" kedua berjarak 6,4 px dari rambut di (598, 191): nyaris singgung.
   - Batang "Y" masuk rambut hanya 32 px (x 634–677, y 159–190; 12,5% tinta "Y"); lengan kanannya menggantung ±10 px di atas kontur rambut.
   - Pelat bakar pelindung "Y" terlihat: rambut di x 700–760, y 130–200 berluminans 0,011–0,015 terhadap 0,025–0,032 di kanannya, dengan batas tegak di x 760–800.
   - MAULANA: hanya 0,6% tintanya berada di atas figur yang terlihat (L > 0,01). Leher terpotong mendatar di y 672–688 (0,096 → 0,017 dalam 16 px) menjadi trapezoid ungu rata x 720–915, y 630–683; bahu hanya garis rim 1–2 px dari (700, 680) ke (415, 900). Kepala melayang di atas nama.

Cacat lain di hero, lebih kecil: grain praktis nol (σ 0,13% di ground, 0,25% di huruf); celah "LA" 4–5 px di x 805–809 terhadap
"UL" 30 px dan "IL" 31 px; krem nama 12,6% frame pada L 0,90 mengalahkan area terang figur 0,13% frame (±97×).

### touch-1440x900
1. **Peristiwanya kecil dan jatuh di tempat yang salah.** Batas irisan terdeteksi di y 245–368 (tinggi pita 46 / 15 / 21 / 8 / 33 px); lebih dari separuhnya di atas rambut satu nada, tempat geseran tidak bisa terlihat (kulit wajah baru mulai di y 314). Piksel berubah > 8%: 2,03% frame (x 441–1227, y 146–593); > 20%: 0,82% (x 441–1030, y 208–444). Di jejak (x ≥ 1130) tidak ada piksel yang berubah di atas ambang 8%.
2. **Dua bahasa distorsi, tanpa pendar.** Irisan bertepi tajam bercampur riak sinus di rambut (x 560–800, y 270–330). Pada contoh Billy tiap pita lunak dan berpendar.
3. **Garis sobek.** Satu garis 1 px (pada 2×) di y ≈ 430,5, x 660–810 melintasi hidung dan pipi; terbaca bug. Mata hilang tertimpa irisan tipis; pada contoh FUTURE mata juga tertutup, tetapi oleh pita lebar yang berpendar.

### hero-390x844
1. **Nama kehilangan skala.** 55,8 px (kapital ±38 px), rasio display:meta 4,65× (lantai 5×, target 10–20×). BILLY hanya x 16–203 (48% lebar).
2. **Dua pita hitam mati dan nol oklusi.** y 62–164 (102 px) antara BILLY dan puncak rambut; y 520–610 (±90 px) antara pangkal leher dan MAULANA. 0,0% tinta kedua kata berada di atas figur. Leher terpotong mendatar di y 496–504.
3. **Jejak menjadi gumpalan tak terbaca.** Tepi kanan x 340–390, y 180–465, plus garis biru tipis lepas di y ≈ 173 (x 255–284) dan y ≈ 188.

## Klaim type-spec terhadap gambar

| Klaim | Terukur | Status |
|---|---|---|
| BILLY 209,4 px; tinta x 48–748,7; cap-top 48; baseline 192,1 | tinta x 48–748, y 47–191 | cocok |
| MAULANA tinta x 48–1392; cap-top 707,9; baseline 852 | x 48–1392, y 707–853 (overshoot "U") | cocok |
| Posisi tagline, tiga blok meta, baris etos | `layout.json` sama persis | cocok |
| Rasio display:meta 15,0× | 14,96× | cocok |
| Tepi kiri tinta semua teks di x 48 | 47,99–49,62 | cocok dalam 1,6 px |
| Ponsel: BILLY x 16–202,7; MAULANA x 16–374; rasio 4,65× | 15,99–202,71; 15,99–374,19 | cocok; 4,65× di bawah lantai 5× |
| Kontras minimum nama 10,49:1 / 11,53:1; ponsel 18,5 / 18,3 | 10,41:1 (di "Y") / 11,45:1 (di "L"); 18,4 / 18,2 | cocok |
| Wajah rata-rata 0,197 (4,8:1), puncak 0,98 | 0,230 pada masker kulit (5,4:1); puncak 0,979 | cocok, tetapi puncaknya hanya 0,13% frame |
| Tiga audit hijau, 12 dan 11 elemen | 12 dan 11 item di `layout/ink/align.json` | cocok |
| Splash: "47" tepat di posisi "60" | "47" x 1353–1368; "60" x 1353–1367,5 | cocok |
| Rambut lewat di belakang "LY", 0% tinta tertutup | "L": 0 px di atas rambut, rambut terdekat 6,4 px. "Y": 12,5% tinta, hanya ujung batang | **sebagian**: "L" tidak beroklusi; "Y" tanggung |
| MAULANA melintas di depan leher, dada, dan bahu | 0,6% tinta di atas figur terlihat; leher berakhir di y ≈ 683, 25 px di atas cap-top | **tidak terlihat di gambar** |
| Tidak ada huruf yang menyentuh wajah | wajah x 631–839, y 314–629 | cocok |
| Dua pose awal makin dingin dan tersapu | dingin: ya. Pose tengah tampil 85% tak-tersapu; wajah keduanya tidak terbaca | **sebagian** |

Semua angka yang ditulis type-spec benar. Yang meleset adalah dua niat oklusi, dan keduanya tidak punya angka di spec.
Ini pola #4 dalam bentuk baru: semua yang diukur hijau, sedangkan yang menentukan (wajah menyala, pendar, grain, oklusi) tidak diukur.

## Dibanding contoh efek Billy

Jawaban pendek: **belum setara**. Paletnya benar (ramp C0–C10, ground hitam), craft-nya belum.

| Ukuran | F1 hero | FUTURE `853dd` | STROBOSCOPIC `58fd1` | GRIND `ad72e` | BLURRED `20179` |
|---|---|---|---|---|---|
| Tinta subjek dari frame | 36% | 15,8% | 79,0% | 37,1% | 31,9% |
| Bagian subjek yang hangat (magenta → kuning) | 11,5% | 97,8% | 63,3% | palet hijau | hitam-putih |
| `thermal-zones` hot + peak dari bidang berwarna | 1,8% | 42,2% | 34,0% | — | — |
| Area terang L > 0,5 dari frame | 0,13% | 2,1% | 13,2% | 9,7% | 24,1% |
| Area menyala L > 0,2 dari frame | 1,5% | 9,3% | 29,5% | 25,0% | 27,6% |
| Lebar pendar tepi (10 → 90%) terhadap lebar subjek | 0,8–1,4% (5–9 px) | 9–28% (30–91 px) | tidak diukur | 3,3–5% (20–30 px) | tepi = goresan |
| Grain di bidang gelap (σ) | 0,13% | 0,34% + kisi titik | ±5,8% | 1,6% | tekstur ada di goresan |

Yang dimiliki tiap contoh dan belum dimiliki F1:

- **FUTURE (wajah termal + pita geser).** Wajah adalah seluruh tinta dan seluruhnya hangat. Bentuk wajah dibangun dari tiga zona tonal besar dengan bayangan hitam murni di rongga mata, bawah hidung, dan bibir. Setiap pita geser lunak dan berpendar. Tidak ada detail kulit sama sekali, sehingga rapi dengan sendirinya.
- **BLURRED PORTRAIT (sapuan hitam-putih).** Goresan berupa garis rambut 1–2 px dengan panjang acak dan ujung meruncing, plus bintik semprot. Selubung sapuan mengikuti bentuk kepala dan tepinya bergerigi. Kontras maksimum. Bentuk kepala tetap terbaca.
- **GRIND (peta panas berpendar).** Isoterm lunak membentuk pulau suhu di dahi, hidung, dan pipi dengan tepi berpendar. Huruf tebal melintas tepat di depan wajah dan ikut menerima medan: oklusi penuh di pusat gambar. Grain, kertas, dan goresan debu. Wajah close-up terpotong tepi.
- **STROBOSCOPIC (jejak stroboskop).** Empat sampai lima eksposur, masing-masing dengan mata yang tajam, sehingga waktu terbaca seketika. Satu wajah memuat gradasi penuh indigo → kuning. Lelehan vertikal sebagai arah kedua. Grain film dan debu.

Per aspek yang ditanyakan:

| Aspek | Contoh | F1 |
|---|---|---|
| Cahaya | Subjek adalah sumber cahaya; area terang 2–24% frame | 0,13% frame; huruf lebih terang dan lebih luas daripada wajah |
| Gradasi | Isoterm lunak dan kontinu mengikuti volume | Noise foto dipetakan langsung → bercak; rambut satu nada |
| Tekstur goresan | Garis rambut acak, meruncing, selubung organik | Pita seragam selebar frame, tepi lurus, tanpa ujung |
| Pendar | 3–28% lebar subjek, ada di tiap tepi dan tiap pita | 0,8–1,4%; zona panas tidak berpendar |
| Grain | σ 0,3–5,8% plus kisi, kertas, debu | σ 0,13% di ground: praktis tidak ada |

## Sebab yang terlihat di compositor

Dibaca dari `comp/index.html` dan `comp/frames.js`; ini menjelaskan cacat di atas dan menjadi dasar revisi.

- **Sumber luminans = foto flash mentah.** Kanal R `tex/src-6120.png` masih memuat latar kamar dan grafis putih kaus. Potret yang sudah direlight dan diretus (`figure-6120.png`, 3024×4032) tidak dipakai, padahal `effect-direction.md` menyebutnya sumber luminans. Kanal B berisi depth dan tidak dibaca shader.
- **Rambut satu nada:** `final[2]` (lantai suhu figur) 0,20 mengangkat semua bayangan ke nada yang sama.
- **Bercak:** `body[3]` (penajaman) 0,9 memperbesar noise; tekstur 1536×2048 diperbesar 1,86× pada render 2×.
- **Pendar tipis:** pendar digabung dengan nilai maksimum, bukan dijumlahkan. Ia tidak pernah menambah terang di zona panas, dan di luar siluet habis dalam ±14 px pada luminans ≤ 0,0036 (1,04:1 terhadap ground).
- **Dada hilang dan leher terpotong:** `body` memudarkan figur 90% pada y 622–772 dan `torso` membatasi luminans pada y 672–704. Keduanya ramp mendatar; tampaknya dipasang untuk menyembunyikan grafis putih kaus yang masih ada di kanal R (ini tafsiran saya, bukan hal yang tertulis).
- **Pita:** `trailY` adalah masker mendatar (y 70–160 dan 540–650); `comb` 0,90 membuat kerai; `trail1[3]` 0,85 menampilkan pose tak-tersapu; kedua pose awal diletakkan 215 px dan 40 px dari tepi kanan dan goresannya ditarik ke kanan, sehingga di gambar tidak ada satu pun ujung goresan yang terlihat.
- **Grain nol:** `post.sh` menumpuk noise dengan SoftLight, yang hampir tidak berpengaruh pada hitam dan krem, lalu mengecilkan gambar.
- **Kontras nama dibeli dengan oklusi (pola #17).** Latar di balik MAULANA dijaga ≤ 0,033 (11,45:1), padahal ambang 7:1 mengizinkan sampai 0,085. Dada dihapus untuk angka yang tidak diminta.

## Revisi prioritas

Nilai awal belum diuji; yang mengikat adalah targetnya. Koordinat dan nama parameter mengikuti `frames.js`.

1. **Wajah jadi subjek, rambut dipotong tepi (posisi dan skala pose).**
   - Pose 6120: skala 0,93 → ±1,27–1,35; pos [832, 388] → mulai dari ±[1040, 333]. Pakai tekstur dari figur 3024×4032 (skala setara 0,64–0,68).
   - Target: tinggi kulit wajah ≥ 430 px (kini 315); kulit ≥ 5,5% frame (kini 2,9%); rambut terpotong tepi atas ±60 px dan tepi kanan; wajah tetap di celah nama dengan jarak ≥ 36 px ke kedua baris.
   - Pose awal: terbaca sebagai wajah (alis, hidung, bibir terlihat) atau tidak tampil sama sekali di frame diam. Mulai dari satu pose (6096) di dalam massa rambut, 180–220 px di kanan wajah akhir, tinggi wajah sama ±5%; `ghostInside` 0,10 → 0,55–0,75. Tambah 6111 hanya bila masih terbaca satu orang yang bergerak.
   - Uji A/B pose akhir 6096: satu-satunya foto yang irisnya terlihat dan tampak mengarah ke kamera (walau tertutup helai rambut), jadi satu-satunya yang membuat "menoleh ke penonton" benar-benar ada. Pada 6120 kelopak setengah tertutup dan iris tidak terlihat.
   - Ponsel: skala 0,54 → ±0,70, sehingga pita hitam 102 px dan ±90 px menjadi ≤ 48 px.

2. **Suhu dari potret yang diterangi dan dari bentuk, bukan dari foto flash (cap suhu).**
   - Luminans diambil dari `figure-*.png` (retus, kaus polos). Suhu = luminans yang di-blur (σ 3–4 px di wajah, 12–20 px di rambut) dicampur depth ±40%.
   - `final[2]` 0,20 → 0,10–0,12; `body[3]` 0,9 → ≤ 0,25 dan hanya di garis kelopak, alis, dan bibir; gain disetel ulang sampai tulang pipi, batang hidung, dan kelopak mencapai C7–C8, C9 hanya di titik spekular.
   - Target: L > 0,2 ≥ 6% frame (kini 1,5%); L > 0,5 ≥ 1% frame (kini 0,13%); oranye tetap ≤ 25%. Zona panas wajah ≤ 15 pulau (kini 85), lubang ≤ 8% (kini 23,5%). Rambut bergradasi C1 → C3 dari belakang ke dekat wajah.
   - Batas sumber: mata di foto 6120 setengah tertutup dan lunak. Jangan mengejar detail mata; pilih bahasa isoterm lunak (FUTURE, GRIND).

3. **Pendar aditif dan rim lunak (pendar, rim).**
   - Pendar dijumlahkan dari bagian panas (suhu > 0,45) pada tiga radius ±12 / 36 / 90 px, bobot awal ±0,55 / 0,45 / 0,30, lalu soft-clip.
   - `rim` [0,30, 9] → lebar 20–28 px dengan falloff halus, kekuatan 0,15–0,20.
   - Target: lebar tepi 10 → 90% sebesar 30–60 px (5–9% lebar kepala; kini 5–9 px); halation oranye 12–20 px di sekitar highlight wajah; pendar tidak mengangkat latar di balik tinta huruf di atas 0,085.

4. **Sapuan menjadi goresan yang lahir dari wajah, bukan pita (panjang sapuan, pita geser).**
   - `comb` 0,90 → 0,25–0,35 (splash 0,94 → ≤ 0,35). `trailY` diganti selubung yang mengikuti kontur kepala; tidak ada tepi lurus > 120 px.
   - `trail1[3]` 0,85 → ≤ 0,25; `trail0[3]` 0,30 → ≤ 0,15.
   - `trailSelf`: cap 0,42 → 0,68–0,72, panjang 190 → 240–320 px, sehingga goresan oranye–magenta keluar dari pipi dan hidung melintasi rambut. Target: jarak wajah ke pita hangat 291 px → 0; lompatan luminans di x 1121–1178 hilang.
   - ≥ 60% ujung goresan berakhir di dalam frame dengan alpha meruncing.
   - Splash: tanpa kapsul; pada t ≈ 1,1 s garis profil (dahi, hidung, bibir) sudah tampil sebagai tepi tajam di sisi kiri sapuan.
   - Sentuh: pusat pita dari y 318 turun ke garis alis–mata (±370–390 sebelum revisi 1); `band[0]` 150 → 220–260; tinggi pita 14–44 px; tepi pita ikut berpendar; satu bahasa distorsi (tanpa riak); garis 1 px di y ≈ 430,5 hilang. Target: piksel berubah ≥ 6–8% frame (kini 2,03%).

5. **Grain yang benar-benar ada (grain).**
   - Grain luminans aditif atau overlay dengan lantai, diterapkan sesudah resize, monokrom, blur 0,4–0,6 px.
   - Target: σ 2,5–3,5% di ground (kini 0,13%), 1,5–2% di huruf (kini 0,25%). Bila masih terasa digital, tambah kisi titik halus di ground seperti FUTURE.

6. **Huruf bertemu sosok dengan tegas; rapikan tipografi (tata letak DOM).**
   - "LY": rambut lewat di belakang "Y" ≥ 40% tinggi kapital (≥ 58 px) dan bebas ≥ 36 px dari "L". Hapus `shade`; kontras dijaga dengan cap suhu rambut ≤ 0,36 di balik huruf (≥ 8:1).
   - MAULANA di depan dada: dengan sumber retus (kaus polos) torso bisa ditampilkan sebagai bentuk C1–C2 (suhu ±0,15–0,24) yang memudar ke ground pada y 800–900. Ramp `body` dan `torso` tidak lagi mendatar; pendinginan leher mengikuti garis kerah. Target: L torso 0,015–0,04 pada y 708–800; ≥ 35% tinta MAULANA di atas figur yang terlihat (kini 0,6%); kontras minimum ≥ 9:1; tanpa garis rim 1–2 px.
   - Kerning: "LA" +10–12 px (celah 4–5 → 14–16 px), "UL" −6 px (30 → 24 px), lalu fit ulang ke 1344 px.
   - Ponsel: BILLY di-fit ke 358 px (107 px), MAULANA tetap 55,8 px; rasio 4,65× → 8,9×; minimal satu oklusi (kini 0%).
   - Baris etos dan penghitung splash ikut pindah bila tertimpa rambut sesudah revisi 1; posisi "60" dan "47" tetap sama.

Revisi 1–4 mengubah gambar. Bila hanya 5 dan 6 yang dikerjakan, itu pola #8 (memperbaiki token, bukan komposisi) dan skornya tidak akan bergerak.

## Yang dipertahankan

- Nama utuh tanpa efek, Archivo Expanded 800 uppercase, 209,4 px, krem C9: 18,4:1 di ground.
- Satu famili, dua weight, grid 48 px, tiga audit geometri hijau dengan 12 dan 11 elemen.
- Semua konten dari `profile.ts`.
- Ramp termal tanpa hijau, pastel, atau putih layar.
- Penghitung splash yang jatuh tepat di posisi "60" pada baris etos.
- Kontras wajah ≥ 3:1 (kini 5,4:1).

## Prediksi tersegel

Belum ditulis ke `docs/awwwards/calibration/predictions.jsonl`, karena kritikus diminta tidak mengubah file lain. Baris siap tempel:

```json
{"ts":"2026-11-23T08:40:00Z","route":"/explore/concept/2#styleframes-r2-F1","a_score":6.15,"t_score":5.73,"scores":{"a":{"design":6,"ux":6.5,"creativity":5.5,"content":7},"t":{"profile":6.5,"antislop":5,"editorial":6,"mood":5.5,"novelty":5}},"mood":["monumental","nostalgic"],"predict":"reject","reasons":["min(A,T) 5,7 < 8,0; WOW gagal","subjek tidak menyala: tinta figur 89% dingin, L>0,5 hanya 0,13% frame vs 2-24% pada empat contoh efek Billy; hot+peak 1,8% bidang berwarna vs 34-42%","rambut satu nada 21,4% frame pada 1,72:1; wajah 2,9% frame; di 2x zona panas wajah 85 pulau dan 23,5% lubang; mata tidak terbaca","ide eksposur/tolehan tidak terbaca: tiga foto profil searah, pose awal tanpa wajah, jejak = pita bergaris bertepi lurus x1130-1439 y116-634 dengan lompatan di x1121-1178","oklusi tanggung: L 6,4px dari rambut, Y masuk 32px (12,5% tinta), MAULANA 0,6% tinta di atas figur terlihat","grain praktis nol: sigma ground 0,13%","momen sentuh mengubah 2,03% frame","ponsel: rasio 4,65x, dua pita hitam 102px dan ~90px, oklusi 0%","sumber luminans compositor = foto flash mentah, bukan potret retus"],"actual":null}
```

## Batas penilaian

- Hanya gambar diam. Gerak, easing, dan rasa splash → hero tidak bisa dinilai dari empat frame ini.
- `taste-lint` tidak dijalankan; nilai Editorial diturunkan dari type-spec dan dari `ink.json`.
- `effect-audit` dicoba pada hero tanpa teks (mode idle): idle-coverage 20,42% dan 12 pita hue. Alat itu dikalibrasi untuk fluida dan menghitung potret statis sebagai "menyala", jadi tidak dipakai sebagai dasar skor.
- `thermal-zones` dipakai hanya sebagai pembanding terhadap contoh Billy, bukan sebagai gate per frame.
- Saya tidak yakin pada dua hal: di layar apa Billy akan melihat frame (bercak wajah jauh lebih jelas di 2×), dan apakah pose 6096 sebagai pose akhir tetap rapi setelah dipetakan; yang kedua harus diuji sebagai gambar dulu.
- Bila setelah revisi 1–3 wajah masih belum bisa disandingkan dengan contoh pada zoom 2×, gate henti di `critique.md` berlaku: pemotretan ulang sederhana, bukan tambalan.
