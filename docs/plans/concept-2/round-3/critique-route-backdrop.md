# Kritik rute putaran 3 — `/explore/concept/2`, potret sebagai latar hero

Kritikus: agen art-director-critic, 2026-11-24 04:04–04:30 WIB. Tahap: rute hidup, hero saja.

## 0. Dua hal yang harus dibaca dulu

1. **Versi yang dinilai sudah tidak ada di dev server.** Semua tangkapan layar diambil 04:04–04:22 dari
   `app/pages/explore/concept/2.vue` md5 `f38f1d69fdb9` (mtime 03:58:31) dengan aset `backdrop-6094.webp` dan
   `backdrop-6094-static.webp`. Pada 04:23:08 berkas rute berubah (md5 `353b1c83fbee`, 3.437 → 3.601 baris), berubah lagi
   04:28:27 (md5 `7413a2fbe298`); aset diganti nama menjadi `figure-6094.webp` dan ditambah `figure-6094-matte.webp` serta
   `ground-ember.webp`. Versi hidup pukul 04:26 berbeda 17,9% piksel dari versi yang dinilai (1440×900). Skor di bawah
   hanya berlaku untuk versi 03:58:31. Versi sesudahnya **tidak dinilai**.
2. **Prediksi di laporan ini tidak tersegel.** Verdict Billy untuk versi ini sudah tercatat pukul 04:18 di
   `docs/awwwards/failures/2026-11-24-concept-2-backdrop-pasted.md` (*"foto saya hanya seperti tempelan saja dan feels
   imersive dan lain lainnya tidak berasa"*, severity iterate). Saya membacanya pukul 04:24, setelah semua tangkapan
   selesai tetapi **sebelum** skor dan peluang verdict ditulis. Angka ukur tidak terpengaruh; skor, lima tes, dan peluang
   verdict ditulis dengan verdict sudah terlihat. Tiga hitungan (uji hapus-foto, jarak rambut–nama, galat WebP)
   dijalankan sesudah 04:24 dari tangkapan dan aset lama. Baris di `predictions.jsonl` diberi `sealed: false`.

## 1. Cara ukur

- Playwright Chromium, GPU asli (`--use-angle=metal`), dev server yang sudah berjalan. Lencana Nuxt devtools disembunyikan.
- **Diam**: 7,5 dtk dan 10,5 dtk setelah `.chd__head--ready`, pointer tidak digerakkan, 9 viewport pada DPR 1, ditambah
  1440×900 DPR 2 dan 390×844 DPR 3. Tiga lapis per viewport: utuh, tanpa teks kecil, tanpa masthead.
- **Varian ukur** lewat intersepsi modul di browser uji (repo tidak disentuh): `nopocket` (alpha kantong 0), `noknock`
  (huruf tidak dilukis hitam ke plat), `nophoto` (plat diganti 1 px hitam).
- **Interaksi**: satu muatan halaman per goresan, goresan pemanas di panggung kanan lalu tunggu 6,5 dtk, kemudian goresan
  tempo manusia: `face` 374 px/0,85 dtk, `slow` 2,3 dtk, `hair`, `name`, `down` (masthead → wajah), `nav`. Frame di tengah,
  di akhir, lalu +0,2 · +0,45 · +0,9 · +1,35 · +2,0 · +3,0 · +5,5 · +8,5 dtk. `face`, `name`, `down` diulang di
  `/hero/hero-3`.
- **Definisi**: luminans linear sRGB; kontras (L₁ + 0,05)/(L₂ + 0,05); ground terukur rgb(6, 6, 16). Sosok = ΔE76 ≥ 12
  terhadap ground. Rambut = matte rambut HEIC (`hair-6094.png`, ≥ 60%) dipetakan dengan rumus tata letak rute. Krem rata =
  luma ≥ 235. Kotak wajah 1440×900: x 560–815, y 300–760. Feather tepi = jarak sepanjang sinar radial dari ΔE 50 ke ΔE 6
  (180 sinar, foto mentah = maks(`nopocket`, `noknock`)). Kontras teks kecil = median 30% piksel tinta paling kontras
  terhadap piksel yang sama tanpa teks (terukur dari render, bukan rumus).
- **Audit**: `taste-lint` (kolektor `--script` lewat `page.evaluate`), `effect-audit` idle, active, `--ref` hero-3,
  `perf.mjs` pembuat. **Tidak diulang**: `layout-audit`, `ink-audit`, `align-audit`, typecheck, lint, generate (angka
  pembuat dikutip apa adanya). **Batas**: pointer sintetis; satu run performa per konfigurasi; NEIGHBOR tidak bisa diuji.

## 2. Skor (versi 03:58:31)

| | Nilai |
|---|---|
| A-score | **7,22** — Design 7,4 · UX 7,3 · Creativity 7,0 · Content 6,7 |
| T-score | **7,07** — Taste Profile 7,4 · Anti-Slop 6,0 · Editorial 7,8 · Mood 7,4 · Novelty 6,8 |
| min(A, T) | **7,07** → **belum lolos** gate 8,0, kurang 0,93 |
| Plafon yang mengikat | Anti-Slop maksimum 6 (satu tes gagal: EMPTY versi hapus-foto). Tanpa plafon saya memberi 7,0 dan T = 7,32; status gate tidak berubah |
| Dimensi terendah | Anti-Slop 6,0, lalu Content 6,7 dan Novelty 6,8 |
| Pembanding | Versi potret bertopeng (kritikus lain): A 7,04 · T 7,22 · min 7,04 |

Rata-rata A dan T tidak dipakai.

## 3. Alasan per dimensi

| Dimensi | Skor | Alasan |
|---|---|---|
| Design 40% | 7,4 | Satu subjek di ground hitam, palet disiplin: ground 59,1% frame; dari sosok dingin 81,3% · magenta 11,7% · oranye 4,1% · kuning-krem 2,9%. Nama 19,04:1, huruf berkroma 0,000–0,023%. Wajah median 3,63:1, 65,2% kotak wajah ≥ 3:1, zona panas 52–60% tinggi viewport di desktop. Yang menahan: tata letak tidak menanggapi foto (hapus foto → 0 px berubah), kantong teks menjadi lubang di ≤ 1180 px, 73% garis luar berupa feather tanpa helai, ground tanpa butir (rms 0,035 level) dan tanpa cahaya bersama, wajah lunak berbercak di 2× |
| UX 30% | 7,3 | 60 fps (median 16,7 ms, p95 16,8 ms, 0 long task) pada 1440×900 DPR 2 dan 390×844 DPR 3; console 0 pesan; kembali diam persis pada +5,5 dtk; teks kecil terburuk per viewport terukur 4,98–5,30:1 ("Available for select work" di desktop). Yang menahan: jalur reduced-motion berbeda 3,0–11,6% piksel dari normal; di 390×844 sosok mengambang (rambut mulai 110 px di bawah nama, 15,0% sosok terhapus kantong); 5 jangkar mati dan target ketuk 14–15 px (warisan hero-3) |
| Creativity 20% | 7,0 | Foto sebagai peta suhu di texture konten fluida dan pembuka lewat kenaikan suhu adalah gagasan yang koheren. Kerangka, tipografi, dan fluida milik hero-3; efek tinta pada foto hanya geser 0,0007 dan tambahan suhu, tanpa watak sendiri |
| Content 10% | 6,7 | Sama dengan hero-3: label peran berbeda dari `profile.ts`, 5 jangkar mati, tagline dan angka dampak tidak hadir (hal terbuka yang sudah diketahui) |
| Taste Profile 30% | 7,4 | Arahan harfiah dipenuhi (foto latar, siluet asli, rambut di atas hitam, layout hero-3, diam saat diam). Prinsip 5 (butir di seluruh frame) tidak hadir di ground; prinsip 7 (huruf dan sosok saling menembus) hanya di desktop: 8,1–8,7% luas rambut di balik huruf, tablet 1,1%, ponsel 0% |
| Anti-Slop 25% | 6,0 | EMPTY versi hapus-foto gagal (0 px, 0,00 px geser teks). Teknik Level 5. Plafon 6 |
| Editorial 20% | 7,8 | `taste-lint` 13 pass · 1 fail · 2 skip pada 13 elemen (ponsel 8); satu-satunya fail `display-body-ratio` buta canvas (ukur manual tinta 192 px : label 12 px = 16×). Hero-3 sendiri 12 · 2 · 2. Keyline huruf seragam 1,5–2 px CSS |
| Mood 15% | 7,4 | Mystic terpenuhi (gelap, satu sumber cahaya, jeda 0,5 dtk sebelum foto menghangat). Cinematic sebagian (framing, pembuka lewat suhu; tanpa butir di ground, tanpa cut). Premium sebagian (palet dan easing; kantong berlubang dan tepi matte menurunkannya) |
| Novelty 10% | 6,8 | #27 dan #31 tidak diulang. Ulangan lunak #24 (audit gagal dijelaskan) dan aturan "≥ 2 tepi frame" diganti pada hari yang sama setelah desktop terukur 1 tepi |

## 4. Lima tes anti-slop

| Tes | Hasil | Dasar |
|---|---|---|
| OBJECT | Lolos | Potret termal Billy, 29,7–63,9% frame |
| SWAP | Lolos | Wajah dan rambut Billy sendiri. Kerangka, label, dan fluida tetap cocok untuk nama lain |
| EMPTY (hapus teks) | Lolos | Tanpa teks tersisa sosok 40,9% frame (1440×900) |
| EMPTY (hapus foto, definisi catatan kegagalan cutout §4 dan butir 8.2 penugasan) | **Gagal** | Varian `nophoto` terhadap `/hero/hero-3`: 0 px berbeda > 8 level di 1440×900 dan 390×844; kotak teks dan masthead bergeser 0,00 px. Tidak ada elemen yang ada karena foto, kecuali kantong dan knock-out yang melindungi teks dari foto |
| WOW | Lolos tipis menurut penilaian saya; **dibantah verdict** | Frame diam berhenti-layak karena potretnya; interaksi seluruhnya fluida hero-3. Billy: *"feels imersive … tidak berasa"*. Catat sebagai meleset kritikus |
| NEIGHBOR | Tidak bisa diuji | Hero saja |

## 5. Tiga alasan utama

1. **Foto menumpang di hero-3, tidak disusun bersama.** Hapus foto: 0 px berubah, 0,00 px geser teks. Ground satu nilai
   (rms butir 0,035 level; di sosok 0,61–2,09). Sosok menyentuh 1 dari 4 tepi frame di 6 viewport desktop (bawah 18–25%
   lebar). Huruf bertemu rambut hanya di desktop (139–219 px naik ke balik nama, 8,1–8,7% luas rambut); di 390×844
   rambut mulai 110 px di bawah nama. Sepertiga kanan frame terisi sosok 10,7%.
2. **Kantong teks adalah lubang di ≤ 1180 px.** Porsi sosok di dalam kotak kantong: nav 1180×820 57% → 23% (luminans
   −75%), kaki 834×1112 99% → 21% (−81%), kaki 390×844 93% → 2% (−71%). Di 390×844 15,0% sosok terhapus dan kontak tepi
   bawah tinggal 3%: badan berakhir dengan pudar ±60 px (y 680–740) di atas footer, pola "fade pendek" yang dilarang.
   Luas frame yang digelapkan ≥ 20%: 0,03% (1920) · 1,52% (1440×900) · 4,38% (1180) · 7,89% (834) · 10,44% (390×844).
3. **Kerapian di 2× belum merata.** Feather tepi luar median 9 px (p90 18 px, maks 38 px); 42% sinar > 10 px, hanya 22%
   ≤ 4 px; helai menonjol di 26% sinar, tepi mulus tanpa helai di 73% (foto asli berhelai di seluruh keliling). Wajah:
   galat WebP rms 1,24 level, p95 galat suhu 0,0133 terhadap butir sensor ±0,0045, jadi bercak kompresi lebih besar dari
   butir yang dirancang. Kumis dan janggut kiri terbaca goresan gelap tak beraturan; mata kiri berupa noda.

## 6. Temuan per butir pemeriksaan

### 6.1 Potongan dan kerapian di 2× (jawaban untuk "tidak enak dilihat cuttingnya")

| Bagian | Temuan | Bukti |
|---|---|---|
| Garis luar | Berasal dari anatomi, bukan topeng: siluet asli utuh. Ini menjawab keluhan cutting pada tingkat bentuk | `plate-static-half.png` |
| Tepi rambut luar | Dua bahasa tepi. Kanan atas: helai tajam menonjol 40–60 px. Kiri, kanan tengah, kanan bawah: pita kabur tanpa helai. Per sektor (0° = kanan, berlawanan jarum jam): feather median 2,5 px (0–45°) sampai 15,5 px (135–180°); sinar berhelai 0% (225–270°) sampai 59% (135–180°) | `z2-hairR-top.png`, `z2-hairL.png`, `z2-hairR-bot.png` |
| Halo dan bercak | Tidak ada pulau terpisah di luar siluet; halo berupa pendar matte, bukan garis rim | `c2-1440x900@2-photo.png` |
| Batas rambut–kulit | Kanan dahi tegas mengikuti helai; kiri gradien magenta lunak. Rapi | `z2-forehead.png` |
| Mata | Mata kanan terbaca (iris dan pantulan); mata kiri noda lunak | `z2-eyes.png` |
| Kumis, janggut | Garis gelap tipis tak beraturan dari sudut mulut ke dagu, terbaca goresan; garis mulut tipis | `z2-mouth.png` |
| Leher | Gradien oranye → magenta → violet mulus; lari piksel identik median 1, maks 4 px perangkat: tanpa banding | `z2-neck.png` |
| Kerah, kaus | Bidang indigo rata bertepi diagonal bersih; rms 0,61 level; lari identik median 1, maks 11 | `z2-neck.png` |
| Kompresi WebP | Wajah rms 1,24 level (14,9% piksel ≥ 2 level, maks 12); rambut rms 2,33 level (47,5% ≥ 2 level). Tanpa blok 8×8 kasat mata, tetapi menambah bercak di ujung panas ramp | `figure-6094.webp` terhadap `plate-6094.png` |
| Butir | Hanya di sosok (kaus 0,61 · leher 1,63 · pipi 2,09 level rms); ground 0,035 | 1440×900 DPR 2 |
| Resolusi sumber | 1,05× (1440×900 DPR 2) sampai 1,25× (1920×1080 DPR 2); 0,79× di ponsel DPR 3. Cukup | skala plat |

### 6.2 Menyatu atau tidak

- Rambut di balik nama: desktop naik 139–219 px, tablet 66 px (1,1% luas rambut), ponsel 0.
- Kantong di balik teks kecil: tak terlihat di 1920 dan 1600; gigitan di 1440×900 (nav −57%, kaki −41%); lubang di 1180,
  834, dan 390×844 (angka di §5.2).
- Leher dan label Scroll: tidak bertemu; kantong Scroll menggelapkan 0–2%.
- Sepertiga kanan: 89,3% hitam, berisi dua label. Wajah menghadap ke sana, jadi berfungsi sebagai ruang pandang; tidak
  ada elemen yang mengisinya.
- Sebaran sosok: kiri 33,3% · tengah 58,0% · kanan 8,7%; kotak batas x 158–1136 (68% lebar), pusat 0,449.

### 6.3 Rambut di atas hitam

| Ukuran (di luar huruf) | Rentang 9 viewport |
|---|---|
| ΔE76 ≥ 12 terhadap ground | 94,7–100% luas rambut (cocok dengan pembuat) |
| ΔL* ≥ 10 | 82,3–96,8%; median ΔL* 15,2–17,6 |
| Kontras luminans median | 1,41–1,51:1; ≥ 1,25:1 pada 80,5–95,7%; ≥ 1,5:1 pada 40,7–50,7% |
| Warna median | rgb(28, 16, 129), p10 rgb(15, 10, 110) = C1, p90 rgb(56, 26, 156) ≈ C2 |
| Tertutup huruf | 8,1–8,7% desktop · 1,1% tablet · 0% ponsel |
| Digelapkan kantong ≥ 20% | 0% (1920) · 4,4% (1440×900) · 10,4% (1180×820) · 7,5% (834×1112); hilang di bawah ΔE 12: 1,4–3,5% |

Rambut terbaca sebagai massa indigo bertekstur helai. Keterbacaannya bersandar pada kroma, bukan luminans (1,45:1): di
layar redup atau bersilau ia tenggelam lebih cepat daripada angka ΔE menyiratkan.

### 6.4 Nama

- Diam: 0 px berubah antara 7,5 dan 10,5 dtk di 9 viewport; huruf berkroma 0,000–0,023%; 19,04:1 terhadap ground.
- Keyline: sela huruf → rambut median 3–4 px perangkat pada DPR 2 (1,5–2 px CSS), p10 3, p90 4; piksel benar-benar hitam
  median 1. Seragam kiri–kanan (selisih 1 px perangkat). Terbaca garis tepi rapi, bukan cacat.
- Yang dicegah knock-out: tanpa knock-out 31,4% piksel huruf berwarna, median rgb(202, 230, 102) (kuning-hijau).
- Saat tinta lewat: huruf berkroma 49,6 → 75,9 → 79,1 → 64,0 → 46,5 → 6,6% (tengah, akhir, +0,2, +0,9, +1,35, +3,0 dtk);
  hero-3 49,5 → 75,7 → 78,3 → 64,1 → 48,3 → 5,3%. Setara.
- Saat foto bergeser di balik huruf: celah hitam di cincin 3–6 px sekeliling huruf maksimum 1,9% (`down`, +0,9 dtk) dan
  2,2% (`name`, +1,35 dtk), hilang pada +2 sampai +3 dtk. Tidak ada noda yang menetap: +5,5 dtk 0,018% piksel berbeda,
  sama dengan garis dasar kursor. Sisa 0,63% pada goresan `name` adalah lingkaran kursor di atas masthead; hero-3 0,62%.

### 6.5 Interaksi

| Goresan | Krem rata di kotak wajah | r terhadap wajah diam |
|---|---|---|
| `face` | 0,2% tengah · 1,0% akhir (diam 1,1%) | 0,79 · 0,86 · 0,96 pada +0,2 dtk |
| `slow` | 0,7% · 1,2% | 0,76 · 0,97 |
| `down` | 13,1% tengah · 2,2% akhir | 0,46 · 0,45 · 0,73 pada +0,45 dtk · 0,95 pada +1,35 dtk |
| `hair` | 6,0% tengah · 2,2% akhir | 0,37 · 0,80 |
| hero-3, kotak yang sama, `down` | 19,0% · 32,0% | — |

Versi sebelumnya 17,1–49,4% dan r −0,03 sampai 0,62: masalah "tinta menghapus wajah" terjawab. Fitur wajah bertahan pada
goresan mendatar; goresan tegak menutupnya ±0,5 dtk. Kembali diam: 0,018% pada +5,5 dtk di lima goresan. Tidak ada
regresi terhadap hero-3 pada huruf maupun umur tinta. Yang belum ada: watak efek pada foto (sapuan bergaris yang Billy
tunjuk); yang terlihat adalah cakram dan jamur tinta hero-3 di atas wajah.

### 6.6 Pembuka, reduced-motion, ponsel dan tablet, performa

- **Pembuka** (waktu sejak navigasi; siap pada 0,56 dtk): nama 0,65 → 1,15 dtk dengan riak warp hero-3; nav 0,90 → 1,30;
  kaki 1,10 → 1,42; jeda 0,5 dtk; foto 1,92 → 3,02 dtk naik dari violet dingin ke oranye. Bukan fade telanjang. Kenaikan
  suhunya serentak di seluruh sosok, tanpa arah dan tanpa cut.
- **Reduced-motion**: tidak ada gerak (goresan 0,016% = kursor), tampil seketika. Berbeda dari normal: selisih rata 0,67%,
  3,00% piksel > 20 level (1440×900); 1,28% dan 7,73% (834×1112); 1,19% dan 11,59% (390×844). Sebab: kantong bekerja di
  ruang suhu akar-kuadrat pada jalur WebGL (alpha 0,58 → suhu ×0,18 → hitam) dan di ruang warna pada jalur statis
  (×0,42), ditambah pendar tepi rambut aset statis. Di 390×844 jalur statis mempertahankan badan sampai tepi bawah.
- **390×844**: garis dasar nama y 74, rambut mulai y 184 (110 px di bawah nama, 82 px di bawah nav), wajah panas 31%
  tinggi, badan dipudarkan kantong, kontak tepi bawah 3%. **390×664**: rambut 7 px di bawah nav, kontak bawah 33%. **834×1112**: komposisi
  terkuat (sosok 63,9%, tiga tepi tersentuh) dengan lubang kantong kaki terjelas. **1180×820**: gigitan di nav dan kaki.
- **Performa**: 1440×900 DPR 2 dan 390×844 DPR 3 median 16,7 ms, p95 16,8 ms, maks 16,8 ms, 0 long task (1 run).

## 7. Klaim pembuat terhadap ukur saya

| Klaim | Ukur saya | Status |
|---|---|---|
| Diam, huruf berkroma ≤ 0,023% | 0 px berubah; 0,000–0,023% | Cocok |
| Sosok 30–64% frame | 29,7–63,9% | Cocok |
| Rambut ΔE ≥ 12: 94,7–100% | 94,7–100% (matte dan rumus yang sama) | Cocok; lihat catatan luminans §6.3 |
| Kontras teks kecil terburuk 4,64–5,37:1 (nominal) | 4,98–5,30:1 terukur dari render | Cocok |
| 60 fps DPR 2 | Median 16,7 ms, p95 16,8 ms, 0 long task | Cocok |
| Kembali diam 0,008% | 0,018% (kursor termasuk) | Cocok |
| Console bersih | 0 pesan pada 13 muatan yang dipantau | Cocok |
| effect-audit idle FAIL 29,32% dan 16 pita; active PASS 2,67% | 29,27% dan 16 pita; active 2,34% (ambang 2%), 17 pita, `source-fidelity` PASS | Cocok |
| Reduced-motion vs normal: 0,48% rata, 0,056% piksel > 8% | 0,67% rata, **3,00%** piksel > 8% (1440×900); berkas bukti pembuat sendiri (`bd/rm-1440-idle.png` vs `bd/fin-1440-idle.png`) memberi 3,001%. 0,055% adalah selisih lencana devtools | **Tidak cocok** |
| Spec §10: reduced-motion memakai kantong yang sama | Alpha sama, hasil berbeda (ruang suhu vs ruang warna) | **Tidak cocok** |
| "Kantong pendingin lunak" | Lubang di ≤ 1180 px (§5.2) | **Tidak cocok di 4 dari 9 viewport** |
| Bahu keluar tepi bawah; tepi kiri/bawah/kanan tersentuh di ponsel | 390×844: bawah 3%, 15,0% sosok terhapus kantong | **Tidak cocok di 390×844** |
| Rambut naik ke balik nama | Desktop ya; tablet 1,1% luas rambut; ponsel 0 | Benar sebagian |
| layout/ink/align hijau; typecheck/lint/generate hijau | Tidak diulang | Tidak diverifikasi |

**Pendapat pembuat tentang effect-audit.** `idle-coverage` saya terima sebagai tidak berlaku: alat itu mengukur piksel
menyala tanpa input, sedangkan foto adalah konten yang diminta dan 0 px bergerak saat diam (hero-3 sendiri 9,91% dari
tinta masthead). `hue-discipline` dan `identity-hue` tidak dirancang untuk ramp termal. Syaratnya: alat diberi mode konten
diam supaya penjelasan yang sama tidak diulang tiap putaran (pola #24).

## 8. Perbaikan, diurutkan dari yang paling menaikkan skor

Konstanta kantong dan knock-out masih sama di sumber 04:23 (`TEXT_POCKET` 0,7 / 0,58; `KNOCKOUT_BLEED` 0,75), jadi butir
2, 4, 5, 6 tetap berlaku untuk iterasi berikutnya. Pada versi hidup 04:26 ground sudah berpendar dan kantong nav terbaca
kotak gelap 1,54:1 terhadap sekelilingnya: butir 2 menjadi lebih mendesak, bukan kurang.

| # | Perbaikan | Angka sasaran | Satu putaran polish? |
|---|---|---|---|
| 1 | Susun halaman bersama foto: cahaya atau bidang latar yang juga jatuh di sosok, minimal satu elemen yang posisinya diturunkan dari sosok, dan huruf yang berlapis dengan sosok | Uji hapus-foto > 0 elemen berubah; sisi gelap sosok larut ke ground (ΔE tepi < 12 pada ≥ 25% keliling), sisi terang bertemu sumber cahaya | Tidak (perubahan komposisi) |
| 2 | Ganti kantong hitam dengan perlakuan yang tidak melubangi: kerjakan di ruang warna (kalikan warna akhir) atau turunkan alpha ke ≤ 0,22 sehingga suhu tersisa ≥ 60%, dan pindahkan teks keluar dari sosok di ≤ 1180 px | Luminans di kotak kantong turun ≤ 30% (kini 41–82%); sosok terhapus ≤ 1% (kini 15,0% di 390×844); teks tetap ≥ 4,5:1 | Ya |
| 3 | Beri watak pada tinta di atas foto: sapuan mendatar bergaris sesuai contoh Billy, hanya saat interaksi | Krem rata di kotak wajah tetap ≤ 5%; r ≥ 0,75 pada goresan mendatar; kembali diam ≤ 0,02% pada +5,5 dtk | Tidak (shader baru) |
| 4 | Ponsel: hubungkan nama dan sosok, biarkan badan keluar tepi bawah | 390×844: puncak rambut ≤ garis dasar nama + 12 px (kini +110 px); kontak tepi bawah ≥ 15% lebar (kini 3%) | Ya |
| 5 | Samakan tepi rambut: perbaiki matte di sektor 180–360° supaya helai menonjol, atau lunakkan sektor berhelai agar satu bahasa | Sinar berhelai ≥ 60% (kini 26%) atau simpangan feather antar sektor ≤ 4 px (kini 2,5–15,5 px) | Ya (bake ulang aset) |
| 6 | Ekspor plat tanpa rugi atau mutu lebih tinggi | Galat rms ≤ 0,5 level di wajah (kini 1,24); p95 galat suhu ≤ 0,0045 (kini 0,0133) | Ya |
| 7 | Rapikan kumis, janggut, dan mata kiri di plat | Tanpa garis gelap < 3 px yang terputus di zona mulut pada 2× | Ya |
| 8 | Butir di ground | rms luma ground 0,5–1,0 level (kini 0,035), setara kaus 0,61 | Ya |
| 9 | Samakan jalur reduced-motion setelah butir 2 | ≤ 0,5% piksel berbeda > 20 level di 1440×900, 834×1112, 390×844 (kini 3,0 · 7,7 · 11,6%) | Ya |

Butir 2, 4–9 menaikkan Design, UX, dan Mood kira-kira 0,2–0,4 poin; gate 8,0 baru terjangkau lewat butir 1 dan 3.

## 9. Prediksi verdict (tidak tersegel)

- Aturan gate: `predict` = `reject` (min 7,07 < 8,0).
- Peluang tiga-arah yang saya tulis setelah verdict terlihat: revise 57% · ship 23% · reject 20%. Angka ini tidak boleh
  dihitung sebagai tebakan buta.
- Verdict yang sudah tercatat: revise/iterate, dengan alasan "tempelan" dan "immersive tidak berasa".
- Yang ditangkap ukuran sebelum verdict terbaca: tangkapan `nophoto`, kantong, celah ponsel, ground tanpa butir. Yang
  tidak saya ukur sama sekali: cahaya bersama sosok–latar, kedalaman huruf–sosok, jumlah elemen. Yang meleset: WOW saya
  nilai lolos tipis.

## 10. Hal terbuka yang sudah diketahui pembuat (bobot, bukan temuan baru)

| Hal | Bobot pada skor |
|---|---|
| Belum ada splash | Tidak dihitung (di luar lingkup hero) |
| Grain DOM hampir tak terlihat | Sudah masuk Design, Taste Profile, Mood (ground rms 0,035) |
| Usapan sentuh vertikal di kanvas tidak menggulir | UX −0,1 |
| Label peran berbeda dari `profile.ts`; klien di footer | Content 6,7 |
| Masthead Bebas Neue, bukan Archivo Expanded | Tidak dipotong: arahan "copy hero-3" |

## 11. Berkas bukti

Semua di
`/private/tmp/claude-501/-Users-billymaulana-Data-Billy-Works-2026-billy-portofolio/6ac1e89d-0ece-42a1-b2a7-4775fdfc320e/scratchpad/critic-bd/`:
tangkapan `c2-<WxH>-{idle,idle2,bare,photo}.png`, `c2-1440x900@2-*.png`, varian `v-{nopocket,noknock,nophoto}-*.png`,
goresan `c2-1440x900-<goresan>-*.png` dan `h3-1440x900-<goresan>-*.png`, pembuka `c2-intro-*.jpg`, reduced-motion
`rm-*.png`, crop 2× `z2-*.png`, versi hidup 04:26 `live-*.png`, skrip `cap-*.mjs` dan `an-*.mjs`, keluaran
`an-static.out`, `an-craft.out`, `an-stroke.out`.
