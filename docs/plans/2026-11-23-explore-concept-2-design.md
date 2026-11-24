# Explore Concept 2 — Splash → Hero · Design

Tanggal: 2026-11-23 · Status: draft, menunggu persetujuan Billy · Rute target: `/explore/concept/2`

## 1. Maksud dan alasannya

Billy ingin portofolio sekelas Awwwards SOTD / studio. Empat belas iterasi sebelumnya ditolak (`docs/awwwards/failures/INDEX.md`), dan pola yang paling sering bukan cacat teknis: **lolos semua gate, tetap ditolak** (5×). Dua sebabnya, dari kata-kata Billy sendiri pada 2026-11-23:

- *"saya ingin claude tidak disuapi referensi yang anda benar benar meniru tapi mempelajari taste sehingga ketika membuat benar benar mendekati taste tersebut … sisi kreatifitas tersebutlah yang saya capek dan frustasi jika kaku dan seperti robot semua step by step."*
- *"saya ingin anda bukan asal gunakan tapi mengolah atau membuat juga assets untuk menghasilkan karya yang bagus."*

Jadi proyek ini menguji cara kerja baru, bukan sekadar halaman baru: Claude bertindak sebagai art director yang **memahami** taste Billy lalu **mencipta** konsep orisinal, membuat asetnya sendiri, dan membawa Billy hanya ke dua keputusan yang bisa dilihat.

## 2. Cakupan

Splash (preloader) yang mengalir menjadi hero, sebagai satu sekuens, di rute eksplorasi terisolasi `/explore/concept/2`. **Production-ready**: aset, tekstur, efek, motion, tipografi, responsif, performa, reduced motion, aksesibilitas dasar. Section setelah hero tidak termasuk; dilanjutkan hanya bila Billy menyatakan hasil ini bagus.

## 3. Tujuan, non-tujuan, anti-tujuan

**Tujuan**
- Satu konsep orisinal yang bisa diucapkan dalam satu kalimat dan terasa milik Billy (uji SWAP: ganti nama → tidak lagi masuk akal).
- Craft setara SOTD: setiap teks di-set penuh (lihat `memory: typography-quality-bar`), nol tabrakan tak disengaja, gerak bermotivasi.
- Aset dibuat/diolah sendiri, bukan dipakai mentah.
- Billy hanya terlibat 2 kali: memilih konsep, menilai hasil akhir.

**Non-tujuan**
- Section selain splash dan hero. Integrasi ke halaman utama. Mengganti preloader global `AppPreloader`. Deploy produksi.

**Anti-tujuan** (gagal walau secara teknis jalan)
- Clone situs atau poster mana pun; konsep yang hanya bisa dijelaskan sebagai "seperti X".
- Kolase efek tanpa ide; teknik level 0–1 (partikel template, CSS statis).
- Video sebagai daya tarik utama (pola gagal #1, 4×).
- Font mono di peran apa pun; tipografi bernilai default.
- Proses yang membebani Billy dengan PR (rating panjang, mencari referensi).
- Fluida/efek menyala sendiri saat diam tanpa niat (pola gagal #20).

## 4. Master brief — kompas setiap prompt

Fase 0 menghasilkan `docs/awwwards/master-brief.md`, maksimal ±2 halaman, dan **wajib disalin utuh** ke setiap prompt delegasi. Isinya prinsip, bukan template:

1. **Suara Billy** — semua verdict verbatim yang mengatakan apa yang ia suka dan tolak, dikumpulkan dari `failures/*.md`, memori, dan profil taste, lalu dikelompokkan per dimensi (tipografi, warna, motion, efek, komposisi, rasa). Yang disetujui juga: liquid-2 plasma ("keren"), layout poster ACT V ("nice ini bagus"), layout Swiss ACT II.1 (disukai), efek liquid-collision daspritam yang ia minta dipertahankan.
2. **Esensi 129 referensi** — dibaca sebagai prinsip lintas gambar (bukan per gambar): colormap termal hitam→indigo→violet→magenta→oranye→kuning dengan zona dingin 50–60%, isoline tajam, grain wajib; tipografi "menyatu total" atau "datar penuh", tidak di tengah; liquid/melt/stretch letterform; struktur poster brutalist; chrome/refraksi; slit-scan & scanline; ruang negatif hitam bersisa.
3. **Identitas** — fakta dari `app/constants/profile.ts` (Frontend Engineer, Bandung, PLN Mobile 80M+ pengguna, design system 200+ developer, "that perfect 60fps"). Tidak mengarang angka atau klien.
4. **Mood** — `premium + austere + monumental` + satu atmosfer (`cinematic`/`mystic`); splash `[cinematic, mystic]`, hero `[monumental, austere, kinetic]`. Arc: hening → meledak lewat motion. Restraint before spectacle.
5. **Larangan inti** — ringkasan yang relevan dari `anti-slop-rules.md` dan 26 pola gagal, ditulis sebagai satu daftar pendek yang bisa diperiksa.

## 5. Pendekatan yang dipertimbangkan

| | Pendekatan | Trade-off |
|---|---|---|
| **A (dipilih Billy)** | Pitch konsep → bangun | Satu keputusan Billy di depan (3 styleframe) mencegah berhari-hari kerja salah arah; Billy hanya 2 titik sentuh |
| B | Langsung satu konsep | Titik sentuh paling sedikit, tapi setiap meleset membuang kerja produksi penuh |
| C | Tiga sketsa hidup | Motion terasa lebih awal, tapi sketsa kasar sering terbaca "jelek" walau idenya bagus |

Billy memilih A dan menyerahkan penulisan prompt serta delegasi kepada Claude, dengan izin memakai model Fable bila perlu.

## 6. Alur kerja

### Fase 0 — Master brief (Claude, tanpa Billy)
Hasil: `docs/awwwards/master-brief.md` (§4). Referensi dipelajari sendiri oleh Claude; tidak ada sesi rating untuk Billy.

Billy mengizinkan (2026-11-23) Claude melihat **Awwwards dan Pinterest** sendiri, kapan pun perlu, di fase mana pun. Tujuannya memahami standar craft SOTD terkini dan memperkaya prinsip di master brief, **bukan** mencari situs untuk ditiru. Aturan pakainya: lewat Claude in Chrome tempat Billy sudah login, volume rendah, tidak membobol login wall atau tantangan keamanan. Temuan dicatat sebagai prinsip ("isoline tajam di atas ground hitam bersisa"), bukan sebagai "tiru situs X".

### Fase 1 — Generasi konsep (agen Fable, paralel)
- 4 agen Fable bekerja terpisah, masing-masing dengan lensa berbeda agar ide tidak seragam: **material** (zat/permukaan yang menjadi medium), **tipografi** (nama sebagai objek), **waktu/narasi** (apa yang terjadi selama splash dan bagaimana ia menjadi hero), **interaksi** (apa yang dilakukan kursor/velocity).
- Setiap agen menyerahkan 2 konsep: kalimat ide, alasan konsep itu milik Billy, beat splash→hero (detik demi detik), momen signature, daftar aset dan cara membuatnya, risiko terbesar.
- 1 agen Fable kritikus menilai kedelapan konsep terhadap master brief: orisinalitas (uji SWAP, bukan clone), kecocokan taste, kelayakan produksi di stack ini.
- Claude (art director) memilih 3 konsep terkuat yang saling berbeda arah, termasuk minimal satu yang memakai sosok Billy dan satu yang tidak.

### Fase 2 — Styleframe (titik sentuh Billy #1)
- Per konsep: 1 frame splash + 1 frame hero pada 1440×900, ditambah hero 390×844.
- Dibuat dengan aset nyata: generate/edit di freefield (FLUX 3 Klein, depth map, upscale, remove-bg), diolah di Photoshop (gradient map termal, displacement, grain, komposit) dan Illustrator (tipografi/mark vektor); After Effects bila frame butuh tekstur gerak.
- Disajikan berlabel netral `a`/`b`/`c` dengan satu kalimat ide per frame. Billy memilih satu, atau menyatakan tidak ada yang kena → kembali ke Fase 1 dengan pelajaran dari penolakan.

### Fase 3 — Produksi
- `/explore/concept/2`, mengikuti aturan fase eksplorasi repo: CSS, token, dan motion inline di SFC; engine WebGL yang dipakai lebih dari satu rute tetap di `app/composables/`.
- Aset final dioptimasi (AVIF/WebP, tekstur berukuran pas, video hanya bila tak tergantikan dan kecil).
- Motion mengikuti Motion DNA repo (expo.inOut dominan, power3/4.out reveal, tanpa bounce/linear).
- Pembagian kerja: Claude memegang arah dan review; build boleh didelegasikan ke agen yang sudah didefinisikan di `.claude/agents/` (`builder`, `motion-choreographer`, `art-director-critic`) dengan prompt yang memuat master brief + spec lengkap (kontrak 14 blok di `CLAUDE.md` repo). **Blok 5 kontrak itu diganti untuk proyek ini**: bukan "nama situs + teknik yang diadopsi", melainkan "prinsip dari master brief + keluarga referensi asalnya" (lihat §8).
- **Durasi splash** (keputusan Claude): kunjungan pertama, splash bertahan sampai aset kritis termuat, minimal 1,8 detik dan maksimal 4 detik, lalu transisi 1–1,5 detik menjadi hero. Kunjungan ulang: versi ringkas ≤ 1 detik. Klik atau tombol apa pun melewatinya. Reduced motion: tanpa animasi splash, hero tampil statis.

### Fase 4 — Gerbang mutu (sebelum Billy melihat)
- Audit `layout`, `ink`, `align`, `effect` di 7 viewport wajib + tambahan dari `memory: audit-blind-spots`; keadaan diam diperiksa.
- Performa: 60fps di MacBook M1, tanpa long task saat interaksi, LCP wajar untuk SSG.
- Reduced motion punya versi statis yang tetap indah.
- Kritikus independen (agen Fable, definisi `.claude/agents/art-director-critic.md` bila ada) memberi skor; gate `min(A, T) ≥ 8,0` sesuai `evaluation-system.md`; prediksi tersegel dicatat.
- Kegagalan audit diperbaiki, bukan dijelaskan (pola gagal #24).
- **Batas putaran** (keputusan Claude): maksimal 2 putaran polish internal. Bila kritikus masih di bawah 8,0 setelah itu, hasil tetap disajikan ke Billy **bersama skornya dan tiga alasan utama kritikus**, bukan diputar diam-diam berminggu-minggu dan bukan disembunyikan seperti Concept 1 v2 (7,08). Putaran konsep (kembali ke Fase 1) tidak dibatasi jumlahnya karena Billy meminta "ganti konsep hingga mendekati", tapi setiap putaran wajib membawa arah baru. Pemakaian kredit GPU dilaporkan per fase.

### Fase 5 — Verdict (titik sentuh Billy #2)
Presentasi: screenshot + rekaman gerak + "Ini hasilnya. Bagaimana menurutmu?" tanpa klaim evaluatif. Ship → lanjut section berikut. Tolak → Rejection Protocol repo, lalu kembali ke Fase 1 dengan konsep baru, bukan menambal (Billy: *"jika jelek ganti konsep hingga mendekati yang saya inginkan"*).

## 7. Batasan

- **Stack**: Nuxt 4.3 (ssr: false, SSG), Vue 3 `<script setup>`, TypeScript strict, UnoCSS, GSAP 3.14 (plugin gratis), WebGL2 in-house + `three` 0.187 tersedia, Lenis. Package manager bun. Gate commit: `bun run typecheck && bun run lint && bun run generate`.
- **Mesin**: MacBook Air M1 RAM 8 GB, disk kosong ±8,9 GB. Hanya satu aplikasi Adobe terbuka pada satu waktu; render dan cache dibersihkan setelah dipakai.
- **Adobe**: Photoshop, Illustrator, After Effects 2026 terpasang; MCP butuh aplikasinya berjalan.
- **GPU cloud**: freefield di Modal, kredit gratis, spend limit $0. Aturan `~/.claude/CLAUDE.md` § GPU Cloud berlaku: matikan GPU setelah tiap pekerjaan, laporkan Billed Cost $0.00.
- **Tipografi**: tidak ada font mono. Font terpasang: Clash Display, PP Editorial New (cut "Regular" ternyata Italic), Switzer, Satoshi, Suisse, Obviously, Apparel, Animo, Bebas Neue, Cormorant, Instrument Serif, dll. Billy menyatakan (2026-11-23) punya lisensi web untuk Suisse, Obviously, PP Editorial New, Apparel, dan Animo, dan meminta agar soal lisensi tidak ditanyakan lagi. Font baru dicari dan diunduh sendiri, hanya dari sumber resmi yang gratis (Google Fonts, Fontshare, Velvetyne, rilisan OFL). Tabel "font yang pernah dipakai saat ditolak" dibaca sebelum memilih.
- **Concept 1 v2** (keputusan Claude): Billy belum memberi verdict, jadi diperlakukan sebagai belum disetujui. Konsep yang menampilkan sosok Billy boleh, memakai foto `bahan/profile` beserta matte-nya, tapi tidak mengulang teknik potret garis-pindai termal Concept 1. Verdict v1 (*"masih jauh kualitas uinya motionnya effect … foto saya thermal juga tidak rapih. semua yang saya lihat tidak aesthetic"*) masuk ke master brief.
- **Palet** (keputusan Claude): ramp termal dari poster Billy menjadi palet utama, dengan `#0f0a72` sebagai titik terdingin. `#0047FF` boleh dipakai sebagai aksen interaktif bila konsepnya membutuhkannya, tapi tidak wajib tampil; biru/cyan tidak boleh mendominasi. Catatan memori 2026-07-12 yang melarang biru (identitas kantor Gaja/GPay) sudah tertimpa keputusan sesudahnya (profil taste 2026-07-26, liquid hero-2 yang disetujui memakai tepi `#0047FF`). Karena itu `effect-audit --identity "#0047FF"` diganti pemeriksaan kepatuhan ramp termal.
- **Konten**: teks dari `app/constants/profile.ts`; tidak mengarang klaim.
- **Git**: commit hanya dengan persetujuan Billy; file planning AI tidak di-stage kecuali Billy meminta.

## 8. Revisi `CLAUDE.md` repo

`CLAUDE.md` repo kini 527 baris / 4.053 kata, sebagian besar daftar larangan yang tumbuh dari tiap kegagalan; aturan diproduksi lebih cepat daripada diikuti (pola gagal #15). Revisi:
- Bagian atas yang singkat: misi, cara kerja art director (§6), dua titik sentuh Billy, prinsip "pelajari taste, jangan clone", pipeline aset, dan Definition of Done.
- Semua aturan teknis yang sudah terbukti (audit, CustomEase, tipografi terukur, rejection protocol, kontrak spec/delegasi) dipertahankan; yang panjang dipindah ke dokumen rujukan di `docs/awwwards/` dengan penunjuk satu baris. Tidak ada aturan yang hilang tanpa persetujuan Billy.
- Bagian yang sudah usang (mis. arsitektur `pages/index.vue` single-page, versi Nuxt) diperbarui ke keadaan repo sekarang.
- Revisi ini menjadi **tugas pertama rencana**, sebelum Fase 0, dan diffnya ditunjukkan ke Billy sebelum di-commit (bagian dari persetujuan commit biasa, bukan titik sentuh baru).

**Aturan lama yang digantikan untuk proyek ini**, karena bertentangan dengan permintaan eksplisit Billy 2026-11-23 ("pelajari taste, jangan meniru", "tanpa proses robotik"). Persetujuan Billy atas dokumen ini adalah persetujuan atas penggantian berikut:

| Aturan lama | Sumber | Diganti dengan |
|---|---|---|
| Brief wajib memetakan setiap teknik ke situs referensi bernama, referensi di-scrape live | `CLAUDE.md` § Art Direction Mandate | Setiap keputusan dipetakan ke **prinsip** di master brief beserta keluarga referensi asalnya |
| Blok 5 kontrak delegasi: nama situs + teknik yang diadopsi | `CLAUDE.md` § Delegation Prompt Contract | Prinsip master brief + keluarga referensi; dilarang menulis "tiru X" |
| Setelah dua iterasi efek ditolak, berhenti dan minta referensi ke Billy | `anti-slop-rules.md` (2026-09-22) | Berhenti menambal dan kembali ke Fase 1 dengan konsep baru; Billy tidak diminta mencari referensi |
| Mode default "adapt dari referensi terdekat yang dirating"; Billy mengonfirmasi brief dan merating referensi hasil scouting | skill `taste` | Mode `create` dari master brief; tanpa sesi rating untuk Billy. Instrumen skill `taste` (cek floor, audit) tetap dipakai |

## 9. Keputusan Billy

- Cakupan: splash → hero dulu, production-ready.
- Pendekatan A: pitch konsep → bangun.
- Claude menulis prompt dan mendelegasikan sendiri; Fable boleh dipakai.
- Aset dibuat dan diolah, tidak dipakai mentah.
- Pelajari taste, jangan meniru; tanpa proses robotik untuk Billy.
- Bila hasil jelek: ganti konsep, bukan tambal.

## 10. Diserahkan ke pelaksana (keputusan Claude)

- Jumlah dan lensa agen konsep (usulan: 4 + 1 kritikus), pembagian model (Fable untuk konsep dan kritik).
- Teknik spesifik per aset dan alat mana yang dipakai.
- Struktur file rute dan composable.
- Format penyajian styleframe (halaman perbandingan lokal atau `taste:bench`).

## 11. Risiko

- **Kualitas aset generatif** belum terbukti untuk taste ini; mitigasi: aset generatif hanya bahan mentah, rupa akhir datang dari olahan deterministik.
- **MCP Adobe** bisa tidak stabil; jalur cadangan: skrip ExtendScript/UXP langsung, atau olahan setara di shader.
- **RAM 8 GB**: Photoshop/After Effects + Chrome + dev server bersamaan bisa macet; urutkan pekerjaan.
- **Konsep orisinal tetap bisa meleset** dari taste; itulah fungsi gerbang styleframe sebelum produksi.
