# Audit sistem — kenapa output lolos semua gate lalu tetap ditolak

> Ditulis 2026-07-26 atas permintaan Billy: *"evaluasi skills awwwards saya dalam eksekusi dan
> evaluasi skills art director saya tidak tahu masalah ini dari mana agar hasil output standar
> sotd awwwards"*.
>
> Ini audit terhadap sistemnya sendiri, bukan terhadap satu halaman. Halamannya didokumentasikan
> di `failures/2026-07-26-hero-explore-3-v3.md`.

## Jawaban singkat

Masalahnya bukan skill yang kurang lengkap. Skill ini punya 75 aturan tertulis, 5 dokumen
editorial, 147 entri referensi, dan 3 lapis pengukuran. Halaman yang ditolak hari ini lolos
**semuanya**.

Masalahnya adalah **sistemnya mengukur hal yang tidak dilihat Billy, lalu menganggap hasil hijau
sebagai izin untuk berhenti.**

Tiga kegagalan spesifik, masing-masing terukur.

---

## Kegagalan 1 — Alat ukur membaca kotak, Billy membaca tinta

`layout-audit.mjs` dibangun 2026-07-26, sehari sebelum build ini, khusus untuk mencegah elemen
bertabrakan. Ia dijalankan. Hasilnya:

```
PASS  1920x1080 · 1600x900 · 1440x900 · 1440x780 · 1366x768 · 834x1112 · 390x844
HIJAU — tidak ada tabrakan di semua viewport
```

Kalimat Billy tentang halaman yang sama: *"text billy maulana itu saling bertabrakkan dan
bertumbuk itu jelek"*.

Keduanya benar. `getBoundingClientRect()` mengembalikan kotak **line-box**, bukan batas tinta
glyph. Pada `line-height: 0.86`, kotak itu 14% lebih pendek daripada huruf yang digambar:

| Besaran | Nilai |
|---|---|
| Kotak CSS "Billy" bottom | 440,8 px |
| Kotak CSS "Maulana" top | 440,8 px |
| **Gap menurut kotak** | **0 px — tidak tumpang tindih** |
| Tinta "Billy" bottom | 465,3 px |
| Tinta "Maulana" top | 413,7 px |
| **Gap menurut tinta** | **−51,6 px — tumpang tindih** |

Ini bukan kelalaian menjalankan gate. Gate-nya dijalankan dan gate-nya salah.

Yang membuatnya lebih buruk: pelajaran ini **sudah tercatat** di memori project sebagai
`reference-alignment-pixel-scan` — *"metrik font menipu; ukur batas tinta dari screenshot"* —
ditulis untuk teks canvas, dan tidak pernah dibawa ke teks DOM.

**Ditutup dengan**: `scripts/ink-audit.mjs`, mengukur dari `TextMetrics`. Pada halaman yang sama:
11 kegagalan di 6 dari 7 viewport, nol false positive, dan dua rule yang berbunyi persis dua hal
yang Billy sebut.

---

## Kegagalan 2 — Angka desain berpindah famili tanpa diukur ulang

Leading `0.86` dipakai sebagai "leading display portfolio ini" selama beberapa iterasi. Diukur
sekarang, rasio tinta kedelapan famili di repo:

| Famili | rasio tinta | leading 0,86 aman? |
|---|---|---|
| Clash Display | **0,840** | ya |
| Animo | 0,882–0,904 | tidak |
| Obviously | 0,892–0,916 | tidak |
| Suisse | 0,900–0,931 | tidak |
| Satoshi | 0,931–0,985 | tidak |
| Apparel | 0,942–0,978 | tidak |
| Switzer | 0,945–0,957 | tidak |
| PP Editorial New | **1,054–1,065** | tidak |

Angka itu sah **satu kali**, untuk Clash Display, di iterasi paling awal. Lalu ia bertahan sebagai
konstanta sementara familinya berganti tiga kali. Pada PP Editorial New selisihnya 0,214 — cukup
untuk 51,6 px tumpang tindih.

`taste-lint` meluluskannya karena rentang `leading-tier` display adalah 0,68–1,25. Rentang itu
dikalibrasi dari 104 referensi dan **benar sebagai statistik**; ia salah sebagai gate karena
ambang sejati bergantung famili, bukan konstanta.

Keputusan yang diambil: rentang `taste-lint` **tidak dinaikkan**. Menggantinya dengan angka lain
hanya memindahkan tebakan. Penegakan leading dipindah ke pengukur per-famili.

Ini pola berulang, bukan insiden. `failures/INDEX.md` sudah mencatat dua varian sebelumnya:
blok Fonts diisi dari inventaris repo alih-alih dari library; simulasi fluida ditulis dari nol
padahal `useFluidSimulation.ts` sudah ada. Bentuk ketiganya sama: **memakai sesuatu yang tersedia
tanpa memeriksa apakah konteksnya masih berlaku.**

---

## Kegagalan 3 — Aturan diproduksi lebih cepat daripada kemampuan menegakkannya

Rasio saat ini: **75 aturan prosa berbanding 24 aturan mesin.**

Konsekuensinya terlihat hari ini. Aturan berikut ditulis beberapa jam **sebelum** build:

> *"Batas antar zona wajib tajam (isoline terbaca) — gradien mulus tanpa kontur terbaca sebagai
> blur Photoshop, bukan citra termal."*

Diukur dari region 380×320 bebas teks pada build yang sama:

| Besaran | Nilai |
|---|---|
| Luma rata-rata | **8,2** / 255 |
| Luma maksimum | **18** |
| Kerapatan tepi | **0,00 %** |

Kepatuhan nol. Aturannya ada, ditulis oleh sistem yang sama, dan dilanggar sepenuhnya — karena
tidak ada satu pun mekanisme yang membacanya kembali saat build berjalan.

Aturan prosa hanya bekerja kalau dibaca pada saat yang tepat. Aturan ke-75 tidak akan dibaca.

**Ditutup sebagian dengan**: aturan baru mewajibkan setiap aturan yang bisa dinyatakan sebagai
angka mendapat pemeriksa mesin pada sesi yang sama. Belum ditutup: pemeriksa untuk distribusi
warna dan kerapatan tepi shader masih manual (prosedurnya kini ada di
`.claude/agents/art-director-critic.md` §2).

---

## Kegagalan 4 — Gate baru tidak pernah masuk ke agent yang melakukan review

`layout-audit` ditambahkan ke `CLAUDE.md` dan `SKILL.md` kemarin sebagai gate wajib.
`.claude/agents/art-director-critic.md` — agent yang benar-benar menjalankan review — tidak
diperbarui. Ia hanya menjalankan `taste-lint`.

Jadi gate wajib itu hanya wajib bagi pembaca dokumen, bukan bagi proses yang berjalan.

**Ditutup dengan**: agent diperbarui ke tiga audit, dengan tabel eksplisit tentang apa yang buta
di masing-masing, plus prosedur pengukuran bidang shader.

---

## Yang tidak berubah oleh audit ini

Perlu dikatakan terus terang: **tidak satu pun dari tiga audit mengukur kualitas desain.**

| Audit | Membuktikan |
|---|---|
| `taste-lint` | tidak ada properti tipografi yang salah nilai |
| `layout-audit` | tidak ada kotak yang bertabrakan |
| `ink-audit` | tidak ada tinta yang bertabrakan atau berdempet |

Ketiganya hijau tetap bisa berarti halaman yang membosankan. Yang ditutup hari ini adalah kelas
**cacat mekanis yang terlihat mata** — tabrakan, dempet, bidang kosong. Itu prasyarat, bukan
kualitas.

Untuk pertanyaan "kenapa belum standar SOTD", cacat mekanis adalah jawaban untuk hari ini karena
ia yang membuat Billy berhenti di tiga detik pertama. Setelah itu bersih, pertanyaannya berganti
jadi komposisi — dan itu belum punya alat ukur, hanya punya `min(A,T) ≥ 8.0` yang dinilai manusia.

## Perubahan yang dibuat hari ini

| File | Perubahan |
|---|---|
| `scripts/ink-audit.mjs` | **baru** — 3 rule dari `TextMetrics`, 12 test |
| `scripts/ink-audit.test.mjs` | **baru** — 12 test, semuanya diturunkan dari kegagalan nyata halaman ini |
| `scripts/layout-audit.mjs` | `minGapPx` dihapus dari `DEFAULTS` — dideklarasikan sejak awal, tidak pernah dipanggil |
| `anti-slop-rules.md` | +6 rule (69 → 75) |
| `failures/2026-07-26-hero-explore-3-v3.md` | **baru** — failure note lengkap |
| `failures/INDEX.md` | +1 entri, +2 baris tabel font, +3 pola kegagalan (13/14/15) |
| `SKILL.md` | `ink-audit` masuk alur wajib + tabel "buta terhadap" |
| `CLAUDE.md` | gate dua-audit, aturan leading per famili, aturan peran inline |
| `.claude/agents/art-director-critic.md` | tiga audit + prosedur ukur bidang shader |
