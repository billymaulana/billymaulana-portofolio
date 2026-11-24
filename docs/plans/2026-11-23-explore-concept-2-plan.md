# Explore Concept 2 — Rencana 1: Pra-produksi sampai Styleframe

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merapikan `CLAUDE.md` repo, menulis master brief dari taste Billy, menghasilkan konsep orisinal lewat agen Fable, dan menyajikan 3 styleframe (aset nyata) untuk dipilih Billy.

**Architecture:** Dokumen proses dulu (CLAUDE.md, master brief) karena keduanya menjadi isi setiap prompt delegasi. Konsep lahir dari 4 agen Fable berlensa berbeda, dinilai 1 kritikus Fable, dikurasi Claude. Styleframe dibuat di luar repo (sumber PSD/AI berat) dan hanya ekspor JPEG yang masuk `docs/plans/concept-2/`. **Rencana 2 (produksi rute `/explore/concept/2`) ditulis setelah Billy memilih**, karena file dan teknik produksinya bergantung pada konsep terpilih.

**Tech Stack:** Node `node:test` untuk skrip audit, Workflow + Agent (model `fable`), freefield CLI di Modal, Photoshop/Illustrator/After Effects MCP, ImageMagick (`magick`), `sips`.

**Spec:** `docs/plans/2026-11-23-explore-concept-2-design.md`

## Global Constraints

- Rute target: `/explore/concept/2`. Cakupan: splash → hero saja.
- Splash: kunjungan pertama minimal 1,8 detik, maksimal 4 detik, lalu transisi 1–1,5 detik ke hero; kunjungan ulang ≤ 1 detik; klik atau tombol apa pun melewatinya; reduced motion = tanpa animasi splash, hero statis.
- Palet: ramp termal poster Billy sebagai palet utama, `#0f0a72` titik terdingin; `#0047FF` opsional, biru/cyan tidak boleh mendominasi. Zona dingin 50–60% bidang berwarna, oranye ≤ 25%, kuning-putih ≤ 12%, ground hitam wajib bersisa, isoline tajam, grain wajib.
- Ramp termal (hex, dari `thermal()` liquid-2): C0 `#050507` · C1 `#0F0A72` · C2 `#3A1A9E` · C3 `#6B2FC8` · C4 `#A32BA8` · C5 `#D45C6E` · C6 `#EE8A2A` · C7 `#F8BF27` · C8 `#FEE55D` · C9 `#FFF5B3` · C10 `#FFFEF5`.
- Tipografi: tanpa font mono di peran apa pun; setiap teks punya spesifikasi angka penuh (font, weight, ukuran, tracking, leading, warna per frasa); tabel "font yang pernah dipakai saat ditolak" di `docs/awwwards/failures/INDEX.md` dibaca sebelum memilih. Font baru hanya dari Google Fonts, Fontshare, Velvetyne, atau rilisan OFL; jangan tanya lisensi ke Billy.
- Konten hanya dari `app/constants/profile.ts`; tidak mengarang klaim.
- Referensi = prinsip, bukan template. Dilarang menulis "tiru situs X" di prompt mana pun. Awwwards/Pinterest boleh dilihat lewat Claude in Chrome, volume rendah, tanpa membobol login wall.
- Billy hanya punya 2 titik sentuh: pilih styleframe (Task 5) dan verdict produksi (Rencana 2).
- GPU: setelah setiap pekerjaan freefield jalankan `"/Users/billymaulana/Data Billy/Works/freefield/tools/gpu_off.sh"` dan laporkan `Billed Cost` (harus `$0.00`). Pekerjaan GPU > ±10 menit butuh persetujuan.
- Mesin: M1 RAM 8 GB → hanya satu aplikasi Adobe terbuka; tutup sebelum membuka yang lain. Disk kosong harus tetap > 3 GB; hapus render/cache setelah dipakai.
- Commit hanya setelah Billy menjawab "Approve commit?", `git add` per nama file, gate `bun run typecheck && bun run lint && bun run generate`, pesan satu baris tanpa atribusi AI.
- Kode: tanpa komentar WHAT, komentar WHY berbentuk blok; tanpa referensi ke Claude/AI atau dokumen planning di kode.

## Review Focus

1. **Clone terselubung** — konsep terdengar orisinal di prosa, tapi struktur visualnya identik dengan satu situs/poster. Diuji di Task 3 (kritikus menandai, shortlist menolak yang ditandai).
2. **Rusak di ponsel** — frame 1440×900 indah, versi 390×844 terpotong atau kosong. Diuji di Task 4 (frame hero 390×844 wajib per konsep).
3. **Tipografi bernilai default di styleframe** — teks Photoshop dengan tracking/leading bawaan. Diuji di Task 4 (`type-spec.md` per konsep, setiap baris teks punya angka).
4. **GPU lupa dimatikan** setelah generate. Diuji di Task 4 (`gpu_off.sh` + `Billed Cost $0.00` per konsep).
5. **Palet melantur jadi pelangi** — zona panas mendominasi. Diuji di Task 4 (`thermal-zones.mjs` per frame).

---

### Task 1: Revisi `CLAUDE.md` repo tanpa kehilangan aturan

**Files:**
- Create: `docs/awwwards/scripts/claude-md-coverage.mjs`
- Create: `docs/awwwards/scripts/claude-md-coverage.test.mjs`
- Create: `docs/awwwards/process/audit-protocol.md` (isi § Browser Review, § Layout Audit, § Kerja shader, § Aturan turunan)
- Create: `docs/awwwards/process/spec-contract.md` (isi § Output Contract, 11 blok, gate sebelum spec)
- Create: `docs/awwwards/process/delegation-contract.md` (isi § Delegation Prompt Contract, 14 blok; blok 5 diganti sesuai design §8)
- Create: `docs/awwwards/process/rejection-protocol.md` (isi § Rejection Protocol + pengecualian screenshot)
- Create: `docs/awwwards/process/reference-capture.md` (isi § Reference Capture Protocol)
- Create: `docs/awwwards/process/taste-constraints.md` (isi § Hard Constraints Colors/Typography/Layout + § Palet Liquid Thermal)
- Modify: `CLAUDE.md` (tulis ulang, ≤ 200 baris)
- Modify: `docs/awwwards/anti-slop-rules.md` (satu entri bertanggal di akhir)
- Backup lokal: `CLAUDE.md.pre-2026-11-23` + baris `CLAUDE.md.pre-2026-11-23` di `.git/info/exclude`

**Interfaces:**
- Produces: `checkCoverage(oldMd: string, sources: string[], superseded: string[]): { missing: { heading: string, sample: string }[] }` — memecah `oldMd` per heading `##`/`###`; sebuah section tercakup bila ≥ 90% baris non-kosongnya (dinormalisasi: trim, spasi beruntun jadi satu) muncul di gabungan `sources`, atau heading-nya ada di `superseded`.

- [ ] **Step 1: Tulis test yang gagal** di `claude-md-coverage.test.mjs`:
  - `covers a section moved verbatim` — section yang disalin utuh ke sumber lain → `missing` kosong.
  - `reports a dropped section` — section yang tidak ada di sumber → `missing[0].heading === '## Dropped'`.
  - `honours superseded headings` — section hilang tapi heading-nya di `superseded` → `missing` kosong.
  - `ignores whitespace differences` — baris dengan spasi ganda/trailing → tetap tercakup.
- [ ] **Step 2: Jalankan, pastikan gagal.** `node --test docs/awwwards/scripts/claude-md-coverage.test.mjs` → FAIL (`checkCoverage` belum ada).
- [ ] **Step 3: Implementasikan `checkCoverage`** plus CLI: `node docs/awwwards/scripts/claude-md-coverage.mjs <old.md> <new-files...> --superseded "<heading>"...` yang mencetak section yang hilang dan keluar dengan kode 1 bila ada.
- [ ] **Step 4: Jalankan test, pastikan lulus.** Expected: 4 pass.
- [ ] **Step 5: Backup.** `cp CLAUDE.md CLAUDE.md.pre-2026-11-23` dan tambahkan namanya ke `.git/info/exclude`; `git status --short` tidak menampilkannya.
- [ ] **Step 6: Pindahkan section panjang** ke enam file `docs/awwwards/process/*.md` secara verbatim. Satu-satunya perubahan isi: blok 5 di `delegation-contract.md` dan `spec-contract.md` → "prinsip master brief + keluarga referensi asalnya; dilarang menulis 'tiru X'". Setiap section lama lain mendapat salah satu dari tiga nasib: tetap verbatim di `CLAUDE.md` baru (mis. Commands, Fase Eksplorasi, Hapus Fitur = Konfirmasi Dulu, router Taste Engine), dipindah verbatim ke file proses, atau masuk daftar `--superseded` di Step 8. Tidak ada nasib keempat.
- [ ] **Step 6b: Tandai aturan yang diganti di luar `CLAUDE.md`.** Tambahkan entri bertanggal di akhir `docs/awwwards/anti-slop-rules.md`: `- (2026-11-23) Aturan 2026-09-22 "setelah dua iterasi efek ditolak, minta referensi ke Billy" DIGANTI: berhenti menambal dan kembali ke generasi konsep baru; Billy tidak diminta mencari referensi (design explore-concept-2 §8).` Skill global `taste` tidak diubah; `CLAUDE.md` baru menyatakan bahwa untuk portofolio ini mode-nya `create` dari master brief tanpa sesi rating.
- [ ] **Step 7: Tulis ulang `CLAUDE.md`** dengan heading tetap, berurutan: `## Misi` · `## Cara kerja art director` (alur Fase 0–5 design §6, dua titik sentuh, pelajari taste jangan clone, aset dibuat sendiri, Fable dan agen boleh, Awwwards/Pinterest boleh sebagai prinsip) · `## Definition of Done` (gate commit, audit, kritikus ≥ 8,0 dengan batas 2 putaran, reduced motion, 60fps M1) · `## Stack & perintah` (Nuxt 4.6, bun, perintah dari `package.json`) · `## Fase eksplorasi — semua inline di SFC` (dipertahankan) · `## Aturan yang dipelajari dengan mahal` (satu baris per aturan + penunjuk ke `docs/awwwards/process/*`) · `## Rujukan` (tabel penunjuk, termasuk router taste engine).
- [ ] **Step 8: Verifikasi cakupan.**
  Run: `node docs/awwwards/scripts/claude-md-coverage.mjs CLAUDE.md.pre-2026-11-23 CLAUDE.md docs/awwwards/process/*.md --superseded "## Art Direction Mandate (standing — permintaan user 2026-07-15)" --superseded "## Architecture"`
  Expected: tidak ada section hilang, exit 0. Lalu `wc -l CLAUDE.md` ≤ 200.
- [ ] **Step 9: Simpan ringkasan diff** (`diff -u CLAUDE.md.pre-2026-11-23 CLAUDE.md | diffstat` atau daftar section dipindah/diganti) ke `docs/plans/concept-2/claude-md-diff.md` untuk ditunjukkan di Task 5.

### Task 2: Master brief

**Files:**
- Create: `docs/awwwards/master-brief.md`
- Create: `docs/awwwards/scripts/quote-check.mjs`
- Create: `docs/awwwards/scripts/quote-check.test.mjs`

**Interfaces:**
- Consumes: aturan baru `CLAUDE.md` (Task 1).
- Produces: `docs/awwwards/master-brief.md` dengan heading tetap `## 1. Suara Billy`, `## 2. Esensi referensi`, `## 3. Identitas`, `## 4. Mood`, `## 5. Larangan inti` — disalin utuh ke setiap prompt di Task 3 dan Task 4.
- Produces: `findUnsourcedQuotes(md: string, sources: string[]): string[]` — mengembalikan setiap kutipan berbentuk `*"…"*` yang tidak ditemukan verbatim (spasi dinormalisasi) di `sources`.

- [ ] **Step 1: Tulis test yang gagal** di `quote-check.test.mjs`: `accepts a quote present in a source` → `[]`; `flags a fabricated quote` → mengembalikan teks kutipannya; `normalizes whitespace and line breaks` → `[]`.
- [ ] **Step 2: Jalankan, pastikan gagal.** `node --test docs/awwwards/scripts/quote-check.test.mjs` → FAIL.
- [ ] **Step 3: Implementasikan `findUnsourcedQuotes`** plus CLI `node docs/awwwards/scripts/quote-check.mjs <brief.md> <sources...>` (exit 1 bila ada kutipan tanpa sumber).
- [ ] **Step 4: Jalankan test, pastikan lulus.** Expected: 3 pass.
- [ ] **Step 5: Kumpulkan suara Billy** — semua `verdict:` di `docs/awwwards/failures/*.md`, kutipan di `docs/awwwards/personal-taste-profile.md`, catatan memori proyek, dan kutipan di design doc. Kelompokkan per dimensi: tipografi, warna, motion, efek, komposisi, rasa; pisahkan "disukai" (liquid-2 "keren", poster ACT V "nice ini bagus", layout Swiss ACT II.1, efek liquid-collision daspritam) dari "ditolak".
- [ ] **Step 6: Pelajari 129 referensi** di `reference style concept/` per subfolder lewat contact sheet (`magick montage`), lalu buka penuh gambar yang menentukan prinsip. Opsional: ≤ 20 halaman Awwwards/Pinterest lewat Claude in Chrome. Tulis temuan sebagai prinsip lintas gambar, bukan daftar gambar.
- [ ] **Step 7: Tulis `master-brief.md`** dengan lima heading di atas, ≤ 1.200 kata.
- [ ] **Step 8: Verifikasi.**
  Run: `node docs/awwwards/scripts/quote-check.mjs docs/awwwards/master-brief.md docs/awwwards/failures/*.md docs/awwwards/personal-taste-profile.md docs/plans/2026-11-23-explore-concept-2-design.md ~/.claude/projects/-Users-billymaulana-Data-Billy-Works-2026-billy-portofolio/memory/*.md` → exit 0.
  Run: `wc -w docs/awwwards/master-brief.md` → ≤ 1200.
  Run: `grep -niE "tiru|clone|seperti situs" docs/awwwards/master-brief.md` → hanya muncul di `## 5. Larangan inti`.
- [ ] **Step 9: Render ke HTML dan buka di browser** (preferensi Billy, bukan titik sentuh): `npx -y marked@15.0.12 --gfm` ke scratchpad, bungkus template gelap, `open`.

### Task 3: Generasi konsep, kritik, kurasi

**Files:**
- Create: `docs/plans/concept-2/concepts.md`
- Create: `docs/plans/concept-2/critique.md`
- Create: `docs/plans/concept-2/shortlist.md`

**Interfaces:**
- Consumes: `docs/awwwards/master-brief.md` (Task 2), design doc §2, §3, §7.
- Produces: `shortlist.md` berisi tepat 3 konsep berlabel netral `a`, `b`, `c` (label diundi, tidak mengikuti urutan skor), masing-masing dengan semua field skema di bawah. Task 4 membaca label dan field `assets`.

Skema satu konsep (heading `### <id> — <judul>`; field sebagai daftar): `idea` (satu kalimat) · `why_billy` (kaitan ke identitas, uji SWAP) · `splash_beats` (per detik, total 1,8–4 s + transisi 1–1,5 s) · `hero` (komposisi + niat tipografi) · `signature_moment` · `interaction` (kursor/velocity) · `uses_billy_figure` (ya/tidak) · `assets` (nama → rantai alat pembuatnya) · `techniques` (shader/GSAP/three/AE) · `risks`.

Lensa (satu agen Fable per lensa, prompt berisi master brief utuh + design §2/§3/§7 + kemampuan repo: engine termal liquid-2, text warp hero-1, masthead raster hero-2, `three` 0.187, app freefield `create-image`/`edit`/`inpaint`/`moodboard`/`character-3`/`cinema-studio`/`depth-map`/`upscale`/`remove-bg`, MCP Photoshop/Illustrator/After Effects):
- `material` — zat/permukaan apa yang menjadi medium.
- `typography` — nama Billy sebagai objek, bukan label.
- `time` — apa yang terjadi selama splash dan bagaimana ia menjadi hero.
- `interaction` — apa yang dilakukan kursor dan velocity terhadap halaman.

- [ ] **Step 1: Muat skill `workflow-authoring`**, lalu jalankan Workflow dengan 4 agen (opsi `model: 'fable'`), masing-masing mengembalikan 2 konsep sesuai skema. Gabungkan hasilnya ke `concepts.md` (8 konsep).
- [ ] **Step 2: Verifikasi skema.** Setiap konsep di `concepts.md` punya kesepuluh field. Cek: `grep -c "^### " docs/plans/concept-2/concepts.md` → 8, dan tiap field muncul 8 kali (`grep -c "idea:"` dst.).
- [ ] **Step 3: Kritik.** Satu agen `general-purpose` model `fable`, prompt = isi `.claude/agents/art-director-critic.md` diadaptasi untuk tahap konsep (tanpa browser) + master brief + 8 konsep. Rubrik per konsep, skor 1–10: `originality` (uji SWAP; tandai `clone_flag: yes` bila struktur visualnya bisa dijelaskan sebagai "seperti situs/poster X"), `taste_fit` (prinsip master brief yang dipenuhi, disebut satu per satu), `producibility` (stack, M1 8 GB, freefield, Adobe), `top_risk`. Simpan ke `critique.md` sebagai tabel 8 baris.
- [ ] **Step 4: Kurasi ke `shortlist.md`.** Aturan: buang semua `clone_flag: yes`; urutkan menurut `min(originality, taste_fit)`; pilih 3 yang medium utamanya berbeda; minimal satu `uses_billy_figure: ya` dan satu `tidak`; undi label `a`/`b`/`c`. Tulis satu paragraf alasan kurasi.
- [ ] **Step 5: Verifikasi Review Focus #1.** `shortlist.md` berisi 3 konsep, tidak ada yang `clone_flag: yes` di `critique.md`, dan `grep -niE "seperti|ala |clone|tiru" docs/plans/concept-2/shortlist.md` tidak menemukan perbandingan dengan situs.

### Task 4: Styleframe dengan aset nyata

**Files:**
- Create: `docs/awwwards/scripts/thermal-zones.mjs`
- Create: `docs/awwwards/scripts/thermal-zones.test.mjs`
- Create (di luar repo, sumber berat): `/Users/billymaulana/Data Billy/Works/billy-portfolio-assets/concept-2/{a,b,c}/` (hasil freefield, PSD, AI)
- Create: `docs/plans/concept-2/styleframes/{a,b,c}/splash-1440x900.jpg`, `hero-1440x900.jpg`, `hero-390x844.jpg`
- Create: `docs/plans/concept-2/styleframes/{a,b,c}/type-spec.md`
- Create: `docs/plans/concept-2/styleframes/index.html`

**Interfaces:**
- Consumes: `shortlist.md` (Task 3) — label dan field `assets`.
- Produces: `zoneShares(rgb: Uint8Array): { ground: number, cold: number, mid: number, hot: number, peak: number }` — setiap piksel dipetakan ke stop ramp termal terdekat (jarak RGB): C0 → `ground`, C1–C3 → `cold`, C4–C5 → `mid`, C6–C7 → `hot`, C8–C10 → `peak`; nilai = fraksi dari semua piksel. Piksel netral (saturasi HSL < 0,12) di luar C0, misalnya teks putih atau abu, tidak dihitung.
- Produces: `thermalViolations(s): string[]` dengan aturan, diukur terhadap bidang berwarna `cold + mid + hot + peak`: `cold` 0,50–0,60 · `hot` ≤ 0,25 · `peak` ≤ 0,12 · `ground > 0`.

- [ ] **Step 1: Tulis test yang gagal** di `thermal-zones.test.mjs`: `classifies pure C1 as cold`; `ignores neutral white text pixels`; `passes a 55/20/15/10 cold/mid/hot/peak frame with ground`; `flags hot-dominant frame` (hot 0,40 → pesan menyebut `hot`); `flags missing ground`.
- [ ] **Step 2: Jalankan, pastikan gagal.** `node --test docs/awwwards/scripts/thermal-zones.test.mjs` → FAIL.
- [ ] **Step 3: Implementasikan** `zoneShares`, `thermalViolations`, dan CLI `node docs/awwwards/scripts/thermal-zones.mjs <image>` yang membaca piksel lewat `magick <image> -depth 8 rgb:-` (tanpa dependency baru), mencetak fraksi, dan exit 1 bila ada pelanggaran.
- [ ] **Step 4: Jalankan test, pastikan lulus.** Expected: 5 pass.
- [ ] **Step 5: Produksi per konsep (`a`, lalu `b`, lalu `c`).**
  - Generate bahan mentah lewat freefield (`cd "/Users/billymaulana/Data Billy/Works/freefield" && npm run app -- <app> --set ...`), simpan ke folder konsep di luar repo.
  - Setelah batch konsep selesai: jalankan `gpu_off.sh`; catat `Billed Cost` (harus `$0.00`) di catatan kerja.
  - Olah di Photoshop MCP (gradient map ramp termal dengan hex Global Constraints, displacement, grain, komposit) dan/atau Illustrator MCP (tipografi/mark vektor). Satu aplikasi Adobe terbuka pada satu waktu.
  - Ekspor tiga frame JPEG kualitas 85, masing-masing ≤ 600 KB.
  - Tulis `type-spec.md`: setiap baris teks di frame dengan font, weight, ukuran px di 1440 dan 390, tracking, leading, warna per frasa, posisi terhadap grid.
- [ ] **Step 6: Verifikasi per konsep.**
  - `sips -g pixelWidth -g pixelHeight docs/plans/concept-2/styleframes/<x>/*.jpg` → tepat 1440×900, 1440×900, 390×844 (Review Focus #2).
  - `node docs/awwwards/scripts/thermal-zones.mjs <frame>` → exit 0 untuk setiap frame yang memakai medan termal (Review Focus #5).
  - Setiap teks yang terlihat di frame punya baris di `type-spec.md` dengan kelima angka terisi (Review Focus #3).
  - `Billed Cost $0.00` tercatat (Review Focus #4); `df -h ~` → sisa > 3 GB setelah cache Adobe dibersihkan.
- [ ] **Step 7: Kritik frame.** Agen kritikus Fable (prompt seperti Task 3 Step 3, ditambah 9 frame) menilai `taste_fit` dan craft per konsep; maksimal 1 putaran revisi per konsep, lalu ekspor ulang dan ulangi Step 6.
- [ ] **Step 8: Halaman pembanding `index.html`.** Tiga kolom berlabel `a`/`b`/`c`, masing-masing berisi kalimat `idea` dan tiga frame (path relatif). Tanpa skor dan tanpa nama lensa. Buka dengan `open`.
- [ ] **Step 9: Segel prediksi.** Tambahkan satu baris ke `docs/awwwards/calibration/predictions.jsonl`: `{"ts":"<ISO>","route":"/explore/concept/2#styleframes","predict":"pick:<label>","reasons":["…"]}`.

### Task 5: Titik sentuh Billy #1 dan serah terima ke Rencana 2

**Files:**
- Modify: `docs/plans/concept-2/shortlist.md` (bagian `## Verdict Billy`)
- Modify: `docs/awwwards/calibration/predictions.jsonl` (isi `actual` pada baris Task 4)
- Create (hanya jika semua ditolak): `docs/awwwards/failures/<YYYY-MM-DD>-explore-concept-2-styleframes.md` + baris di `docs/awwwards/failures/INDEX.md`

**Interfaces:**
- Consumes: halaman pembanding (Task 4), `claude-md-diff.md` (Task 1).
- Produces: label konsep terpilih dan kata-kata Billy verbatim untuk Rencana 2.

- [ ] **Step 1: Sajikan.** Halaman pembanding sudah terbuka; pesan ke Billy: satu kalimat ide per label, ringkasan perubahan `CLAUDE.md` dari `claude-md-diff.md`, lalu "Ini hasilnya. Bagaimana menurutmu?" tanpa klaim evaluatif.
- [ ] **Step 2: Catat verdict** verbatim di `shortlist.md` dan isi `actual` pada prediksi.
- [ ] **Step 3a (bila memilih):** tanyakan "Approve commit?" untuk berkas Rencana 1. Setelah disetujui dan gate `bun run typecheck && bun run lint && bun run generate` hijau: `git add` per nama (design doc, rencana ini, `docs/awwwards/process/*.md`, `docs/awwwards/master-brief.md`, tiga skrip beserta test-nya, `docs/plans/concept-2/**`), lalu commit satu baris, misalnya `docs(concept-2): add master brief, process docs and styleframes`.
- [ ] **Step 3b (bila tidak ada yang kena):** jalankan Rejection Protocol (`docs/awwwards/process/rejection-protocol.md`), lalu kembali ke Task 3 dengan pelajaran dari penolakan sebagai masukan wajib di prompt tiap lensa.
- [ ] **Step 4: Tulis Rencana 2** (produksi `/explore/concept/2`: aset final, splash → hero, shader/GSAP, audit Fase 4, verdict) dengan skill `superpowers:writing-plans`, berdasarkan konsep terpilih.
