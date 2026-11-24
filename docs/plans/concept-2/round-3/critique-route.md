# Kritik rute putaran 3 — `/explore/concept/2` (hero)

Kritikus: agen art-director-critic (Fable), 2026-11-23 19:02 WIB. Tahap: rute hidup, hero saja.

Yang dinilai: `app/pages/explore/concept/2.vue` (mtime 18:07:00, md5 `6307f262bdc4`) dan
`public/assets/images/concept-2/portrait-6111.webp`. Sumber tidak berubah selama pengukuran (18:13–19:02).
Pembanding: `/hero/hero-3`, styleframe putaran 2 "a" (`round-2/styleframes/F1/hero-1440x900.jpg`), empat contoh efek Billy.

Ringkasnya: tiga dari empat arahan verdict dijawab harfiah dan terukur (kerangka hero-3 utuh, satu potret, diam benar-benar
diam). Yang belum: hal baru di rute ini, yaitu pertemuan tinta dengan wajah, menghapus wajah alih-alih memanaskannya;
di desktop sosok berskala tengah dan kehilangan puncak kepala serta grain yang ada di frame yang dipuji; pembuka belum
berupa peristiwa. Skor `min(A, T) = 7,04`, belum lolos gate 8,0.

## 1. Cara ukur

- Playwright headless Chromium dengan GPU asli (`--use-angle=metal`) terhadap dev server yang sudah berjalan. Tidak ada
  berkas repo yang disentuh selain laporan ini. Lencana Nuxt devtools disembunyikan sebelum setiap pengukuran piksel.
- **Diam**: screenshot 3,0 dtk dan 6,0 dtk setelah `.chd__head--ready`, pointer tidak digerakkan. Sembilan viewport audit
  ditambah enam viewport di luar daftar (1280×620, 844×390, 2560×1440, 768×1024, 1024×1366, 360×640). DPR 1; wajah juga
  diambil pada DPR 2 (1440×900) dan DPR 3 (390×844).
- **Interaksi**: goresan sintetis tempo manusia. `wajah` 398 px dalam 0,62 dtk, `pelan` 2,0 dtk, `turun` dari masthead ke
  wajah, `masthead`, `kiri` (panggung kosong). Frame diambil di tengah goresan, di akhir, lalu +0,45, +1,35, +3,0, +5,5,
  +8,5 dtk. Goresan yang sama dijalankan di `/hero/hero-3`. Pembanding keadaan tunak memakai goresan setelah fade kanvas
  hero-3 selesai, masukan identik di kedua rute.
- **Definisi**: luminans linear sRGB; kontras (L₁ + 0,05)/(L₂ + 0,05); ground terukur rgb(6, 6, 16), L = 0,00206.
  "Kotak wajah" = zona panas potret yang dihitung rute (316×397 px pada 1440×900). "Krem rata" = luma 8-bit ≥ 235;
  saat diam kotak wajah sudah memuat 2,2% (punggung hidung). r = korelasi Pearson luma kotak wajah terhadap frame diam.
  Grain = rms luma setelah dikurangi rata-rata lokal 5×5. "Struktur kotak mata" = gradien luma rata-rata di kotak
  16% × 13% tinggi wajah setelah blur σ 0,4% tinggi wajah, per 1% tinggi wajah; tinggi wajah pada contoh Billy ditaksir,
  jadi angka contoh berketelitian ±10%.
- Potret tanpa veil direkonstruksi dari `portrait-6111-static.webp` untuk menghitung bagian sosok yang dihapus fade atas
  dan kantong footer.
- **Audit**: `layout-audit`, `ink-audit`, `align-audit` (diulang lewat `route-audit.mjs` pembuat), `effect-audit` (idle,
  active, `--ref` hero-3), `taste-lint` (kolektor disuntikkan lewat `page.evaluate`, tanpa menulis ke `public/`), ESLint
  pada berkas rute.
- **Tidak diulang**: `typecheck` dan `generate`. **Batas**: pointer dan sentuhan sintetis, bukan perangkat nyata; fps dari
  rAF headless.
- Berkas ukur (skrip `cap.mjs`, `m1`–`m11.mjs`, keluaran `out-*.txt`, 330 screenshot):
  `/private/tmp/claude-501/-Users-billymaulana-Data-Billy-Works-2026-billy-portofolio/6ac1e89d-0ece-42a1-b2a7-4775fdfc320e/scratchpad/critic-c2-route/`

## 2. Skor

| | Rute `/explore/concept/2` | Styleframe putaran 2 "a" |
|---|---|---|
| A-score | **7,0** (7,04) — Design 7,3 · UX 7,1 · Creativity 6,6 · Content 6,7 | 6,61 |
| T-score | **7,2** (7,22) — Taste Profile 7,5 · Anti-Slop 6,5 · Editorial 7,8 · Mood 7,2 · Novelty 7,0 | 6,76 |
| min(A, T) | **7,0** (7,04) → belum lolos gate 8,0, kurang 0,96 | 6,61 |
| Dimensi terendah | Anti-Slop 6,5 (T) dan Creativity 6,6 (A) | |
| Uji yang gagal | Tidak ada yang gagal mutlak. **WOW lolos tipis dan seluruhnya warisan fluida hero-3**; lapisan baru (tinta × wajah) tidak memberi puncak. NEIGHBOR tidak bisa diuji. SWAP dan EMPTY lolos lemah di desktop | |
| Prediksi verdict Billy | **revise ±55%** · ship ±27% · reject ±18% | reject 44 / revise 39 / ship 17 → aktual revise |
| Kalimat lama yang paling mungkin terulang | *"mendekati style saya bentuk ekspresinya tapi overall belum begitu impressive"* · untuk tinta di atas wajah *"saat putih tidak terlihat liqudi"* · untuk garis rim dan bintik rambut *"fotor saya thermal juga tidak rapih"* | |

Rata-rata A dan T tidak dipakai. Menurut aturan gate, kolom biner `predict` di `predictions.jsonl` berbunyi `reject`
(min < 8,0); verdict tiga-arah yang paling mungkin adalah **revise**. Arti ketiganya di sini: *ship* = hero diterima
sebagai dasar tanpa perubahan pada hero; *revise* = diminta mengubah hero dulu (foto, ukuran, atau efek); *reject* =
"jelek" atau ganti konsep.

Kalibrasi: dari sepuluh baris ber-verdict dengan min di bawah 8,0, sembilan berakhir reject dan satu revise; belum ada
yang diterima utuh. Subjeknya sendiri sudah diterima Billy dan tetap sama; yang menurunkan angka ada di interaksi,
skala, dan craft, bukan di wajahnya.

## 3. Alasan per dimensi

| Dimensi | Skor | Alasan |
|---|---|---|
| Design 40% | 7,3 | Kerangka hero-3 utuh: 0 piksel berbeda dari `/hero/hero-3` di luar kotak potret (x 607–1167, y 333–899 pada 1440×900). Nama 19,04:1 dan 0,000% piksel berkroma di 9 viewport. Satu subjek di atas hitam: ground 89,1%; dari bidang berwarna, dingin 61,8% · tengah 20,8% · oranye 8,8% · kuning-krem 8,6%. Pandangan sosok mengarah ke bidang kosong 55,8% lebar. Yang menahan: sosok desktop berskala tengah (≥ 3:1 hanya 2,64–4,61% frame; tinggi 46–53% viewport = 1,9–2,5× tinggi tinta masthead), 84–86% puncak kepala terhapus fade, garis rim tinggal 3–6 potong pada 1,26:1, 28,6% luas sosok di 1,1–1,5:1, grain 0,01% (frame yang dipuji 2,46%), pembuka seluruhnya fade. |
| UX 30% | 7,1 | 60,0–60,2 fps pada DPR 2 dan DPR 3 (p99 16,8 ms, 0 long task), console 0 pesan di 43 muatan, tanpa scroll horizontal, cincin fokus 2 px `#0047FF`, versi reduced-motion berselisih 0,11% luma, resize hidup identik dengan muat baru (0 px), kembali diam 0,026% pada +3,0 dtk. Yang menahan: 5 dari 5 tautan menuju jangkar yang tidak ada; target ketuk 14–19 px di ≤ 834 px (4–5 peringatan); usapan vertikal 300 px yang dimulai di kanvas hero menggulir 0 px (di luar kanvas 285 px), warisan hero-3; nav dan footer berkedip 140–299 ms sebelum disembunyikan; tidak ada isyarat bahwa wajah bisa disentuh; pada 844×390 wajah tinggal 59×74 px. |
| Creativity 20% | 6,6 | Menjumlahkan tinta dan kulit sebagai satu suhu sebelum ramp adalah gagasan yang koheren dan satu-satunya hal yang bukan milik hero-3. Eksekusinya menghapus wajah: krem rata 17,1–49,4% kotak wajah pada puncak tiap goresan, r −0,03 sampai 0,62 selama ±1 dtk. Dari empat contoh efek Billy (pita geser, sapuan, peta panas berpendar, jejak stroboskop) tidak satu pun terbaca; pergeseran potret oleh kecepatan ada di shader tetapi tertutup inti krem. Kerangka dan fluida adalah hero-3 (rasio gridnya diukur dari situs lain, komentar baris 2591). |
| Content 10% | 6,7 | Nama sebagai masthead, peran, tiga klien nyata dari `projects.ts`, status, tiga tautan nav, dua CTA. Label peran "Frontend Architect & Creative Developer" tidak sama dengan `profile.ts` ("Frontend Engineer"); tagline, etos 60fps, dan angka dampak (80M+, 200+) tidak hadir; 5 jangkar mati; "Scroll" tanpa tujuan. Semuanya warisan hero-3. |
| Taste Profile 30% | 7,5 | Keempat arahan verdict dipenuhi harfiah; ramp C0–C10 persis; nama utuh saat diam; tanpa mono. Yang melemah: aturan palet liquid-2 "inti tidak pernah runtuh jadi bidang cream rata" dilanggar di atas wajah; prinsip 5 (grain merata) tidak hadir; prinsip 6 (raksasa dan bisikan) terganggu sosok berskala tengah; syarat wajah ≥ 3:1 terpenuhi rata-rata (4,30:1, puncak 17,95:1) tetapi 60,7% kotak wajah di bawah 3:1 dan 33,9% di bawah 1,5:1. |
| Anti-Slop 25% | 6,5 | Tidak ada uji yang gagal mutlak; teknik Level 5 (Navier–Stokes dan displacement konten). Nilai ditahan karena WOW seluruhnya pinjaman hero-3 dan tiga pola hard-reject warisan masih aktif di rute ini: easing `ease` pada fade masthead (baris 3193), reveal universal berupa fade telanjang (9 tween, semuanya opacity), tekstur tak terlihat (lapis grain opacity 0,05; 0,02 level rms di ground). Menurut huruf rubrik, hard reject aktif berarti ≤ 4; saya menahannya di 6,5 karena ketiganya tersalin dari rute yang sudah disetujui Billy, bukan keputusan baru. |
| Editorial 20% | 7,8 | `taste-lint` 12 pass · 2 fail · 2 skip pada 13 elemen teks, identik dengan hero-3. `display-body-ratio` gagal karena masthead di canvas (ukur manual: tinggi tinta 192 px terhadap label 12 px = 16×); `easing-banned` non-tipografi. `ink-audit` dan `align-audit` hijau di 9 viewport. Satu ukuran label, satu weight, dua famili terlihat. Sisa: tepi profil sosok jatuh 8–13 px di kanan tepi kanan huruf ketujuh pada semua lebar desktop (nyaris sejajar). |
| Mood 15% | 7,2 | Target cinematic · premium · mystic. Premium 3 dari 4 penanda (palet terkunci, easing expo/power3 kecuali satu `ease`, mikro-tipografi hero-3; craft interaksi belum). Mystic 2 dari 3 (gelap, satu sumber cahaya, 28,6% sosok ditahan dalam gelap; tetapi tidak ada informasi yang ditahan saat masuk). Cinematic 1 dari 4 (framing; tanpa grain, tanpa kedalaman fokus, tanpa cut). Yang keluar: monumental dan mystic. Saat disentuh, inti krem 3–8% frame terasa meledak, bukan "panas yang tertahan". |
| Novelty 10% | 7,0 | Tidak mengulang pola yang ditolak: #27 (nama pembawa efek) 0,000%; #20 (keadaan diam tak diperiksa) diperiksa. Ulangan lunak: #24 (audit gagal lalu dijelaskan: idle-coverage 16,81%) dan aturan 2026-09-22 (yang sudah disetujui diubah lebih dari satu parameter sekaligus: `displace` 0,001 → 0,0011, komposit termal ditulis ulang, fade kanvas dipindah). Tidak ada arah dari daftar "belum pernah dicoba". |

## 4. Tiga alasan utama skor

1. **Tinta di atas wajah menghapus, bukan memanaskan.** Pada goresan tempo manusia, krem rata menutup 20,5–24,4% kotak
   wajah di keadaan tunak (hero-3 pada goresan dan kotak yang sama: 0,9–4,9%), 33,6% pada goresan pertama, 17,1% pada
   goresan pelan, 49,4% pada goresan turun, dan masih 6,5–8,3% pada +0,45 dtk (hero-3 0,0%). Korelasi dengan wajah
   diam jatuh ke r −0,03 sampai 0,62. Tepi gumpalan di atas wajah 3 px (hero-3 5–6 px) dengan garis rim ganda; gumpalan 588–661 px lebar terhadap
   wajah 236–316 px. Momen yang berhasil (tinta, huruf masthead yang berbaur) seluruhnya milik hero-3.
2. **Di desktop sosok berskala tengah dan belum terkunci ke kerangka.** Sosok ≥ 3:1 hanya 2,64–4,61% frame; tingginya
   46–53% viewport, 1,9–2,5× tinggi tinta masthead. Di frame putaran 2 yang dipuji, pulau panas yang sama 1,15× lebih
   besar daripada rute pada 1440×900 dan 1,54× lebih besar daripada rute pada 1440×780 (pulau hidung 163×342 px terhadap
   141×299 dan 105×223 px), dan sosoknya terpotong tepi kanan. Fade atas menghapus 84–86% piksel kepala di atas kotak
   wajah; garis rim tersisa 3–6 potong pada 1,26:1 dengan tebal 12,3 ± 3,8 px (CV 31%); 28,6% luas sosok berada di
   1,1–1,5:1; ekor leher berhenti 9–30 px di atas tepi bawah pada 4 dari 6 viewport desktop; grain 0,01% terhadap 2,46%
   di frame yang dipuji.
3. **Belum ada peristiwa pembuka, dan lintas perangkat belum rapi.** Sembilan tween pembuka semuanya opacity, masthead
   memakai `ease`, nav dan footer berkedip 140–299 ms sebelum disembunyikan, tidak ada jeda pengenalan. Pada 834×1112
   kantong footer memakan 50,0% sosok di zona footer, pada 1180×820 13,4%. Sumber kotak wajah 500×628 px diperbesar
   1,26× di laptop retina sampai 2,18× di iPad. Pada 844×390 wajah 59×74 px; pada 1024×1366 34,5% kotak wajah keluar
   tepi kanan. Usapan sentuh vertikal di hero menggulir 0 px.

## 5. Empat permintaan verdict

| Permintaan Billy | Status | Angka |
|---|---|---|
| Layout mengikuti `/hero/hero-3` | **Terjawab penuh** | 0 px berbeda dari hero-3 di luar kotak potret; `layout`/`ink`/`align` hijau di 9 viewport; `taste-lint` identik (12 · 2 · 2); tinta masthead berubah saat fluida lewat 49,1–55,2% (hero-3 50,2–57,2%) |
| Potret tunggal saat diam | **Terjawab, dengan sisa** | Satu komponen utama (74.117 px² pada ≥ 2:1), tanpa multi-eksposur; 0 px berubah antara 3,0 dan 6,0 dtk; dua muatan terpisah identik. Sisa: 3–6 potong garis rim (3.123 px², 1,26:1) dan 3 pulau kecil |
| Efek hanya saat interaksi | **Terjawab untuk "kapan", belum untuk "apa"** | Diam 0 px; kembali diam 0,026% pada +3,0 dtk dan 0,005% pada +5,5 dtk. Tetapi efeknya menutup wajah: krem rata 17,1–49,4% kotak wajah pada puncak tiap goresan, r −0,03 sampai 0,62 |
| Foto dipoles | **Terjawab sebagian** | Pulau panas L > 0,2 di bidang wajah 12 → 5 dengan definisi yang sama (blur σ 2 px, ≥ 40 px²; frame putaran 2 memuat dua eksposur lain; kritikus putaran 2 mencatat 34 dengan definisinya). Struktur kotak mata 17,9 → 19,1, contoh Billy 20,1–23,0. Belum: grain 2,46% → 0,01%; garis rim CV tebal 31%; 28,6% sosok di 1,1–1,5:1; tepi profil tetap 21–24 px (putaran 2: 19–25 px); sumber diperbesar 1,26× di laptop retina |

## 6. Empat lapis penilaian

Angka di bawah bukan dimensi rubrik; hanya memisahkan apa yang mengganjal.

| Lapis | Nilai | Temuan |
|---|---|---|
| Subjek | 7,6 | Wajah yang sama dengan yang Billy sebut bagus, lebih rapi (5 pulau panas, dulu 12), bentuk profil terbaca dari alis sampai dagu. Lebih kecil dari frame yang dipuji (pulau hidung 141×299 px pada 1440×900 dan 105×223 px pada 1440×780, dulu 163×342 px) dan tanpa grain. |
| Layout | 7,8 | Hero-3 persis. Penempatan potret punya alasan (pandangan ke bidang kosong). Belum terkunci: skala tengah, nyaris sejajar 8–13 px dengan huruf, ekor leher menggantung 9–30 px, puncak kepala terhapus. |
| Craft | 6,9 | Diam deterministik, kontras teks 5,38:1, tanpa tabrakan. Kurang: garis rim berbintik dan terputus, bintik rambut 2,96% frame di ambang terlihat, kantong footer di tablet, perbesaran sumber, kedip pembuka, bukti basi. |
| Interaksi | 6,2 | 60 fps, umur efek ±3 dtk, kembali bersih. Fase segar (0–0,45 dtk) menghapus wajah dengan cakram krem bertepi keras; fase tengah (0,45–1,35 dtk) memberi filamen di atas wajah yang justru menarik; fase akhir kabut violet (r 0,99). |

## 7. Uji 30 detik

- **OBJECT** lolos: potret termal.
- **SWAP** lolos, lemah pada konsep: wajah Billy sendiri tidak bisa ditukar, tetapi hanya foto yang memikul identitas.
  Kerangka, fluida, dan label cocok untuk nama lain; etos 60fps dan angka dampak dari `profile.ts` tidak dipakai.
- **EMPTY** lolos, lemah di desktop: tanpa teks tersisa sosok 2,64–4,61% frame dan potongan garis rim. Di ponsel kuat
  (15,6–19,3% frame).
- **WOW** lolos tipis: pengunjung baru akan berhenti untuk memainkan tinta dan melihat huruf berbaur, dan itu milik
  hero-3. Yang baru tidak menambah puncak: saat diam tidak ada peristiwa selain fade ±1,7 dtk, dan saat tinta bertemu
  wajah hasilnya bidang krem. Bila pertanyaannya "apa yang membuat berhenti dibanding hero-3", jawabannya belum ada.
- **NEIGHBOR** tidak bisa diuji: hero saja.

## 8. Klaim pembuat terhadap ukur saya

| Klaim | Ukur saya | Status |
|---|---|---|
| Kontras teks kecil terburuk 5,36:1 di semua viewport | 5,36:1 dengan skrip pembuat di 9 viewport; 5,38:1 dengan hitungan sendiri; tautan 10,01:1 | Cocok |
| Huruf masthead 0,000% piksel berkroma saat diam | 0,000% di 9 viewport; tinta rgb(249, 249, 239), 19,04:1 | Cocok |
| Tanpa scroll horizontal, console bersih | `scrollWidth` = lebar viewport di 15 viewport; 0 pesan | Cocok |
| Kembali diam, selisih 0,08% pada +5,5 dtk | Berkas pembuat 0,077%; ukur saya 0,026% (+3,0 dtk), 0,005% (+5,5 dtk) | Cocok |
| Reduced-motion berselisih 0,2% dari diam WebGL | Berkas pembuat 0,195% luma; ukur saya 0,114% luma (0,266% rgb) pada 1440×900, 0,346% pada 390×844 | Cocok |
| 61 fps di M1 | 60,0–60,2 fps pada DPR 1, 2, 3; p99 16,8 ms; 0 long task | Cocok |
| 11 elemen teks desktop/tablet, 6 ponsel | `layout` dan `ink` 11/6; `align` 12/7 elemen (8/5 tepi) | Cocok |
| effect-audit idle FAIL 16,81% dan 17 pita, "disengaja" | 16,76% dan 17 pita. Hero-3 sendiri gagal 9,91% dari tinta masthead; potret saja 6,85%. Alat ini tidak bisa dipakai di kerangka ini; bukti yang sah adalah 0 px berubah saat diam | Cocok, penjelasan diterima dengan bukti pengganti |
| effect-audit active PASS | `detail-density` 3,27–3,89% lolos; `source-fidelity` terhadap hero-3 lolos. **`flat-field` PASS kosong**: keluaran maksimum rute berluma 248,6, di bawah ambang klip 250; 0,03% "klip" di laporan pembuat adalah 432 px lencana Nuxt devtools (x 705–733, y 877–899). Dengan ambang 235: krem rata 6,33–8,07% frame, deret rata-rata 42–60 px | **Tidak cocok** |
| Fluida hero-3 tidak diubah | `displace` 0,001 → 0,0011; komposit termal ditulis ulang (baris 1236–1243); fade kanvas dipindah dari gerak pointer pertama (1,2 dtk) ke intro. Di panggung kosong keadaan tunak statistiknya setara. Yang berubah terlihat: goresan pertama berpuncak luma 239–248 (hero-3 207–209) dan menambah krem rata 0,94–1,44% frame di tengah goresan (hero-3 0,00%) | **Tidak cocok sebagian** |
| Goresan di wajah "memanaskan, tidak menghapus" (komentar baris 1231–1235) | r −0,03 sampai 0,62; krem rata 17,1–49,4% kotak wajah pada puncak tiap goresan | **Tidak cocok** |
| Bukti `c2/` | `d-*.png`, `m-idle.png`, `r-idle.png`, `alt-idle.png` diambil 18:00:09–18:01:13; sumber terakhir berubah 18:07:00. Pada 1440×900 gambarnya sama dengan muatan baru; pada 390×844 zona footer berbeda (x 163–302, y 720–843; kantong footer berubah) | **Basi** untuk ponsel dan reduced-motion |
| Gate `typecheck`, `lint`, `generate` hijau | ESLint pada berkas rute bersih; `.output/public/explore/concept/2/index.html` bertanda 18:09:57, sesudah sumber final. `typecheck` dan `generate` tidak saya ulang | Tidak diverifikasi penuh |
| `taste-lint` belum dijalankan | 12 pass · 2 fail · 2 skip pada 13 elemen (desktop dan ponsel), identik dengan hero-3 | Dikerjakan kritikus |

## 9. Warisan hero-3 dan yang baru

Sama dengan hero-3, jadi bukan kemunduran, tetapi tetap ada di rute ini:

- Huruf masthead berubah warna saat fluida lewat: 49,1–55,2% tinta berubah, 35,8% hilang (L < 0,2) sesaat, hijau sampai
  43,7% tinta pada +1,35 dtk (hero-3: 50,2–57,2%, 37,8%, 48,6%).
- Pembuka fade telanjang dan easing `ease`; kedip nav/footer.
- Usapan sentuh di kanvas tidak menggulir (0 px); target ketuk 14–19 px; 5 jangkar mati.
- Solver tetap berjalan saat diam: 180 rAF/dtk dan 1.740 draw call/dtk sementara 0 px berubah di layar.
- Pointer yang melompat (masuk kembali dari tepi lain) menghasilkan satu goresan lurus yang mengubah ±20% frame.

**Lebih buruk daripada `/hero/hero-3`:**

1. Sentuhan pertama lebih keras. Fade kanvas 1,2 dtk pada gerak pertama hilang: puncak luma gumpalan pertama 239–248
   terhadap 207–209, tambahan krem rata di tengah goresan pertama 0,94–1,44% frame terhadap 0,00%.
2. Bidang krem rata. Pada masukan identik, 20,5–24,4% kotak wajah terhadap 0,9–4,9%; pada +0,45 dtk 6,5% terhadap 0,0%;
   di tingkat frame 3,01–3,38% terhadap 0,08–0,76%.
3. Tepi gumpalan lebih keras di atas wajah: 3 px terhadap 5–6 px, ditambah garis rim ganda dari `EDGE_HEAT`.
4. Kedip pembuka lebih panjang: 140–299 ms (empat muatan: 299, 171, 140, 167) terhadap 129–178 ms; decode potret
   2480×1800 ditunggu sebelum nav dan footer disembunyikan (baris 3010 mendahului baris 3020).
5. Panggung yang tadinya bersih kini memuat potongan garis rim dan bintik rambut 1,1–1,5:1 seluas 2,96% frame.
6. Di tablet blok footer duduk di kantong gelap yang memotong sosok (50,0% pada 834×1112, 13,4% pada 1180×820).
7. Komposisi kini bergantung pada viewport: sosok ≥ 1,25:1 mengisi 5,8% frame (1440×780) sampai 41,5% (390×664).

## 10. Temuan per viewport

Keadaan diam. "Dimakan kantong" = piksel sosok di zona footer yang jatuh di bawah 1,25:1 karena veil. "Perbesaran" =
skala sumber pada DPR asli perangkat (laptop dan iPad 2, ponsel 3).

| Viewport | Kotak wajah | Sosok ≥ 3:1 | Tinggi sosok | Sosok : tinta masthead | Teks terdekat | Dimakan kantong | Perbesaran | Catatan |
|---|---|---|---|---|---|---|---|---|
| 1920×1080 | 369×464 | 3,50% | 51,9% | 2,19× | 139 px | 0% | 1,48× | leher menyentuh tepi bawah |
| 1600×900 | 294×369 | 3,19% | 49,7% | 2,10× | 112 px | 0% | 1,18× | ekor leher 16 px di atas tepi bawah |
| 1440×900 | 316×397 | 4,10% | 53,4% | 2,51× | 76 px | 0% | 1,26× | ekor 9 px; rim 3 potong (DPR 2: 6) |
| 1440×780 | 236×297 | 2,64% | 46,2% | 1,88× | 97 px | 0% | 0,95× | ekor 30 px; wajah terkecil di kelas laptop |
| 1366×768 | 239×300 | 2,88% | 47,3% | 1,99× | 95 px | 0% | 0,96× | ekor 29 px |
| 1180×820 | 302×379 | 4,61% | 44,9% | 2,34× | 38 px | 13,4% (+16,4% diredupkan) | 1,21× | leher menjadi ekor tipis di samping blok klien |
| 834×1112 | 545×685 | 15,93% | 61,5% | 6,16× | 42 px | 50,0% (+14,1%) | 2,18× | 5,7% sosok terpotong tepi kiri; tiga serpih rim 57–142 px² di tepi kiri |
| 390×844 | 312×392 | 15,57% | 57,1% | 9,09× | 59 px | 0% | 1,87× | 7,5% terpotong tepi kiri |
| 390×664 | 312×392 | 19,29% | 71,5% | 8,96× | 46 px | 3,8% (+8,0%) | 1,87× | sosok ≥ 1,25:1 = 41,5% frame |

Di luar sembilan viewport audit:

- **844×390** (ponsel lanskap): panggung 86 px, wajah 59×74 px di tengah, tidak terbaca sebagai wajah.
- **1280×620**: wajah 151×190 px (31% tinggi).
- **1024×1366** (iPad Pro tegak): kotak wajah 689×865 px mulai x 573; 34,5% lebarnya keluar tepi kanan. Lebar ≥ 900 px
  memakai `STAGE_HOT_LEFT_SHARE` 0,56 sementara lebar wajah boleh sampai 0,8 lebar viewport.
- **2560×1440**: 525×660 px, skala 1,05; pada layar 5K (DPR 2) sumber diperbesar 2,10×.
- **768×1024**, **360×640**: tata letak ponsel, wajah memenuhi layar, tanpa temuan baru.

Interaksi pada viewport lain: 1440×780 krem rata 13,7–17,1% kotak wajah, r 0,27–0,57; 834×1112 krem rata 7,5% frame
dengan deret rata-rata 80,7 px. Sentuhan sintetis pada 390×844 (DPR 3) menghasilkan gumpalan yang sama dan kembali
diam pada +5,9 dtk.

Detail 2× pada 1440×900:

- **Mata**: cincin kelopak dan titik magenta, tanpa iris; rentang luma 24–223. Strukturnya setara contoh (19,1 terhadap
  20,1–23,0), teksturnya tidak (dengan grain: 21,0 terhadap 30,6–62,0).
- **Tepi profil** (lebar 10–90%): 21–24 px di baris hidung, 44–65 px di bibir dan dagu.
- **Garis rim**: lihat alasan 2. Ujung atasnya 16 px di bawah baris nav, ujung kanannya 30–36 px dari kotak wajah.
- **Leher**: meruncing menjadi ekor; tidak ada bahu (kaus hitam = dingin).
- **Kantong footer**: tidak menyentuh sosok di desktop ≥ 1366 px.
- **Alternatif `?photo=6120`**: sosok ≥ 3:1 4,71% frame; 8 pulau; 9 potong di kiri wajah; bagian bawah berakhir sebagai
  lempeng 177×73 px pada 2,16:1 yang berhenti 50 px di atas tepi bawah. Kurang rapi daripada foto bawaan.

## 11. Pre-flight

| Audit | Elemen diperiksa | Hasil |
|---|---|---|
| `layout-audit` | 11 kotak (desktop, tablet), 6 (ponsel) × 9 viewport | PASS 9/9; 4–5 peringatan tap-target di ≤ 834 px |
| `ink-audit` | 11 / 6 | PASS 9/9 |
| `align-audit` | 12 / 7 elemen, 8 / 5 tepi teks | PASS 9/9 |
| `taste-lint` | 13 elemen teks (2 di antaranya tidak terlihat: skip link dan `h1` sr-only) | 12 pass · 2 fail · 2 skip |
| `effect-audit` idle | seluruh frame | FAIL idle-coverage 16,76%, 17 pita hue (lihat §8) |
| `effect-audit` active | seluruh frame | detail 3,27–3,89% PASS; `--ref` hero-3 PASS; flat-field memeriksa 0 piksel efek |
| ESLint | `app/pages/explore/concept/2.vue` | bersih |

Ketiga audit geometri tidak melihat masthead (canvas) maupun hubungan teks dengan potret; keduanya saya ukur dari
piksel (§3, §10). Audit hijau di sini membuktikan teks kecil tidak bertabrakan, bukan mutu komposisinya.

## 12. Revisi prioritas

Target mengikat diukur dengan definisi §1 pada 1440×900 kecuali disebut lain.

### Yang mengubah gambar

| # | Apa | Sekarang | Target mengikat |
|---|---|---|---|
| G1 | Tinta di atas wajah memanaskan, tidak menghapus | krem rata 17,1–49,4% kotak wajah pada puncak tiap goresan; r −0,03 sampai 0,62; deret krem 42–60 px; tepi gumpalan 3 px dengan garis ganda | krem rata ≤ 6% kotak wajah di setiap frame goresan `wajah`, `pelan`, `turun`; r ≥ 0,60 di tengah dan akhir goresan; deret krem ≤ 15 px; tepi ≥ 5 px tanpa garis ganda. Tetap berlaku: kembali diam ≤ 0,05% pada +3,5 dtk, masthead diam 0,000% |
| G2 | Sosok menjadi subjek di desktop | kotak wajah 38,1–46,2% tinggi viewport di enam viewport desktop (397 px pada 1440×900, 297 px pada 1440×780); ekor leher 9–30 px di atas tepi bawah; rim 3–6 potong pada 1,26:1, CV 31%; 28,6% sosok di 1,1–1,5:1 | kotak wajah ≥ 50% tinggi viewport di keenam viewport desktop (≥ 455 px pada 1440×900 = skala frame yang dipuji; ≥ 390 px pada 1440×780); leher keluar tepi bawah di semua viewport desktop; garis rim utuh atau hilang (≤ 1 potong, ≥ 2:1, CV ≤ 15%); zona 1,1–1,5:1 ≤ 10% sosok. Tetap berlaku: 0 piksel sosok ≥ 1,5:1 dalam 24 px dari blok teks, masthead diam 0,000% |
| G3 | Permukaan | grain rms 0,01% di ground, 1,2–1,4% di kulit | grain statis 1,5–2,5% di ground dan kulit (frame yang dipuji 2,46% dan 2,86%; contoh Billy 0,8–3,5%). Tetap berlaku: 0 px berubah antara 3 dan 6 dtk; teks kecil ≥ 4,5:1 |
| G4 | Pembuka | 9 tween opacity; masthead `ease`; kedip 140–299 ms; potret dan masthead masuk bersamaan | kedip 0 ms; potret punya reveal sendiri dengan ≥ 1 properti selain opacity, mulai ≥ 0,3 dtk setelah masthead ≥ 98%; 0 easing `ease` |
| G5 | Tablet dan ponsel | kantong memakan 50,0% (834×1112) dan 13,4% (1180×820); perbesaran 1,26–2,18×; 844×390 wajah 59×74 px; 1024×1366 34,5% keluar tepi kanan | dimakan kantong ≤ 10% di semua viewport; perbesaran ≤ 1,25× pada DPR asli (aset kotak wajah ≥ 1.100 px lebar); 844×390 tinggi kotak wajah ≥ 40% viewport atau sosok disembunyikan; 1024×1366 ≤ 5% keluar viewport atau potongan ditulis sebagai keputusan |

Sebab terukur G1: `t = 1 − (1 − skin)(1 − inkHeat)` (baris 1239) menjenuh ke C10 begitu suhu kulit melewati ±0,6, dan
`EDGE_HEAT` (baris 1240) menambah garis di batas kecepatan. Pergeseran potret oleh kecepatan sudah ada dan baru terlihat
bila inti krem tidak menutupinya.

### Yang merapikan

| # | Apa | Sekarang | Target mengikat |
|---|---|---|---|
| M1 | Sentuhan pertama setara hero-3 | puncak luma 239–248 pada 0,3 dtk goresan pertama | ≤ 215 (hero-3 207–209) |
| M2 | Tepi profil dikunci ke huruf | 8–13 px dari tepi huruf masthead terdekat di semua lebar desktop | ≤ 2 px atau ≥ 24 px |
| M3 | Bukti | empat kelompok screenshot `c2/` mendahului sumber final; lencana devtools ikut terukur; flat-field kosong | semua bukti diambil setelah mtime sumber; lencana disembunyikan; flat-field dengan ambang ≤ 235 (keluaran maksimum 248,6); idle dibuktikan dengan selisih frame 3 dtk terhadap 6 dtk |
| M4 | Sentuh | usapan vertikal di hero 0 px; target ketuk 14–19 px | usapan 300 px menggulir ≥ 250 px; target ketuk ≥ 44 px di ≤ 834 px; diuji di perangkat nyata |
| M5 | Konten | label peran berbeda dari `profile.ts`; 5 jangkar mati | label sama dengan `profile.ts`; 0 jangkar mati |
| M6 | Beban saat diam | 1.740 draw call/dtk, 180 rAF/dtk, 0 px berubah | ≤ 60 draw call/dtk saat energi fluida nol |
| M7 | Satu foto | `?photo=6120`: 8 pulau, 9 potong rim, lempeng bawah 177×73 px | dihapus, atau dipoles sampai setara foto bawaan (≤ 6 pulau, ≤ 1 potong rim) |

## 13. Belum dikerjakan

Splash; section lain (NEIGHBOR, jangkar, dan gulir tidak bisa dinilai); uji di perangkat sentuh nyata; `taste-lint` oleh
pembuat (dijalankan kritikus, §11); reveal potret; jalur tanpa WebGL tidak saya uji.

## 14. Baris untuk `docs/awwwards/calibration/predictions.jsonl`

Belum ditulis ke berkas. Kolom `predict` mengikuti aturan gate biner; `predict_verdict` dan `verdict_probs` memuat
prediksi tiga-arah.

```json
{"ts":"2026-11-23T12:02:49Z","route":"/explore/concept/2","a_score":7.04,"t_score":7.22,"scores":{"a":{"design":7.3,"ux":7.1,"creativity":6.6,"content":6.7},"t":{"profile":7.5,"antislop":6.5,"editorial":7.8,"mood":7.2,"novelty":7.0}},"mood":["monumental","mystic","premium"],"predict":"reject","predict_verdict":"revise","verdict_probs":{"ship":0.27,"revise":0.55,"reject":0.18},"reasons":["min(A,T) 7,04 < 8,0; tidak ada uji gagal mutlak, WOW lolos tipis lewat fluida warisan hero-3","prediksi verdict: revise 55% / ship 27% / reject 18%","tinta x wajah menghapus, bukan memanaskan: krem rata (luma>=235) 17,1-49,4% kotak wajah pada puncak tiap goresan, 20,5-24,4% pada keadaan tunak (hero-3 pada goresan dan kotak yang sama 0,9-4,9%), korelasi dengan wajah diam r -0,03 s.d. 0,62, tepi gumpalan 3 px (hero-3 5-6 px), gumpalan 588-661 px lebar vs wajah 236-316 px","sosok desktop berskala tengah: >=3:1 hanya 2,64-4,61% frame, tinggi 46-53% viewport = 1,9-2,5x tinggi tinta masthead (pulau panas yang sama di frame putaran 2 yang dipuji 1,15x lebih besar pada 1440x900 dan 1,54x pada 1440x780); 84-86% puncak kepala terhapus fade; garis rim 3-6 potong pada 1,26:1 (CV tebal 31%); 28,6% luas sosok di 1,1-1,5:1; grain 0,01% vs 2,46%","pembuka seluruhnya fade telanjang (9 tween opacity, masthead ease), nav+footer berkedip 140-299 ms (hero-3 129-178 ms), tanpa jeda pengenalan","lintas perangkat: kantong footer memakan 50,0% sosok di zona footer pada 834x1112 dan 13,4% pada 1180x820; sumber 500x628 px diperbesar 1,26x (laptop retina) s.d. 2,18x (iPad); 844x390 wajah 59x74 px; 1024x1366 34,5% kotak wajah keluar tepi kanan; usapan sentuh vertikal di hero menggulir 0 px (di luar kanvas 285 px), warisan hero-3","yang terjawab: 0 px beda dari hero-3 di luar kotak potret; nama 19,04:1 dan 0,000% berkroma; 0 px berubah saat diam; kembali diam 0,026% pada +3,0 dtk; pulau panas 12 -> 5 (definisi sama); 60 fps DPR 2/3; layout/ink/align hijau 9 viewport (11/6 elemen); taste-lint 12 pass 2 fail 2 skip (13 elemen, identik hero-3)","klaim pembuat yang meleset: fluida 'tidak diubah' (displace 0,001 -> 0,0011, komposit termal ditulis ulang, fade kanvas dipindah ke intro: puncak luma goresan pertama 239-248 vs 207-209); effect-audit flat-field PASS mengukur 432 px lencana Nuxt devtools, nol piksel efek (keluaran maksimum luma 248,6 < ambang 250); bukti c2/d-*, m-idle, r-idle, alt-idle diambil 18:00-18:01 sebelum sumber berubah 18:07:00"],"gates":{"layout_audit":"9/9 PASS (11/6 elemen, 4-5 peringatan tap-target <=834)","ink_audit":"9/9 PASS (11/6)","align_audit":"9/9 PASS (12/7)","taste_lint":"12 pass / 2 fail / 2 skip (13 elemen; display-body-ratio buta canvas, easing-banned ease)","effect_audit_idle":"FAIL idle-coverage 16,76% (hero-3 sendiri 9,91% dari tinta masthead), 17 pita hue","effect_audit_active":"detail 3,27-3,89% PASS, source-fidelity vs hero-3 PASS, flat-field kosong","console":"bersih","eslint_route":"bersih","typecheck_generate":"tidak diulang kritikus"},"actual":null}
```
