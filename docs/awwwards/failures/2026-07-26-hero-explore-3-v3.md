---
type: failure
slug: hero-explore-3-v3
date: 2026-07-26
route: /hero-explore-3
concept: THERMAL iterasi 3 — masthead serif dua baris, brand row, HUD sudut
verdict: "saya ingin ubah typography nya jelek dan tidak terbaca!. ganti semua font family dan font pairingnya jelek ... available works dan email terlalu penuh dan design ini ai slop! ... anda lihat text billy maulana itu saling bertabrakkan dan bertumbuk itu jelek! saya tidak ingin ini terus terjadi"
severity: rejected
style_attempted: [editorial, cinematic, thermal]
fonts_used: [PP Editorial New 200, Switzer 300/400]
technique_level: 5
screenshot: assets/2026-07-26-hero-explore-3-v3-ink-collision.png
rule_added: leading display wajib diturunkan dari metrik tinta famili, bukan dari tabel agregat lintas famili
---

# hero-explore-3 v3 — tabrakan tinta, HUD berdempet, bidang kosong

![tinta Billy menembus Maulana 51,6px pada 1440x900](assets/2026-07-26-hero-explore-3-v3-ink-collision.png)

## Verdict Billy — verbatim

> "saya ingin ubah typography nya jelek dan tidak terbaca!. ganti semua font family dan font
> pairingnya jelek, saya ingin shader plasma/thermal yang lebih baik. anda lihat referensi saya
> untuk typography agar hasil baik!. available works dan email terlalu penuh dan design ini ai
> slop! saya tidak ingin ini terus terjadi, anda lihat text billy maulana itu saling bertabrakkan
> dan bertumbuk itu jelek! saya tidak ingin ini terus terjadi. evaluasi skills awwwards saya dalam
> eksekusi dan evaluasi skills art director saya tidak tahu masalah ini dari mana agar hasil output
> standar sotd awwwards"

## Semua gate hijau. Semuanya.

Ini yang membuat penolakan kali ini berbeda dari sembilan sebelumnya, dan yang menjawab pertanyaan
Billy *"saya tidak tahu masalah ini dari mana"*.

| Gate | Hasil | Yang sebenarnya terjadi di layar |
|---|---|---|
| `layout-audit` 7 viewport | **7/7 PASS**, 0 fail | Tiga tabrakan terlihat mata telanjang |
| `taste-lint` rule `leading-tier` | **PASS** (0.86 di dalam rentang display 0.68–1.25) | Tinta antar baris tumpang tindih 51,6px |
| Console `[Vue warn]` / error | **bersih** | — |
| Viewport 1440×780 & 1366×768 (gate baru kemarin) | **PASS** | — |

Gate yang dibangun **kemarin** khusus untuk mencegah tabrakan elemen meluluskan halaman yang
elemennya bertabrakan. Itu bukan kelalaian menjalankan gate — gate-nya dijalankan, dan gate-nya
salah.

## Diagnosis lewat adjective decoder

Rujukan: `references/editorial/03-art-direction.md` §7C.

### "saling bertabrakkan dan bertumbuk" → leading di bawah ambang tinta famili

Baris decoder: **"tidak terbaca" (a)** — jarak antar baris lebih kecil daripada rentang tinta.
Terukur pada 1440×900:

| Besaran | Nilai |
|---|---|
| `font-size` masthead | 266,4 px |
| `line-height` dipakai | 0,86 → 229,1 px |
| Tinta "Billy": ascent + descent | 218,7 + 62,0 = **280,7 px** |
| Leading minimum agar tinta tidak bersentuhan | **1,054** |
| **Defisit** | **51,6 px tumpang tindih** |

Tabrakan ini **tidak bergantung viewport**. Ia rasio murni: leading 0,86 < rasio tinta 1,054.
Setiap ukuran layar menabrak dengan proporsi yang persis sama. Tidak ada satu pun dari tujuh
viewport yang bisa menangkapnya, karena bukan itu variabelnya.

**Akar sebenarnya: angka leading disalin lintas famili.** Diukur langsung dari kedelapan famili
yang ada di repo lewat `TextMetrics`, pada glyph "Billy"/"Maulana":

| Famili | rasio tinta | leading 0,86 aman? |
|---|---|---|
| Clash Display | 0,840 | ya |
| Animo | 0,882–0,904 | tidak |
| Obviously | 0,892–0,916 | tidak |
| Suisse | 0,900–0,931 | tidak |
| Satoshi | 0,931–0,985 | tidak |
| Apparel | 0,942–0,978 | tidak |
| Switzer | 0,945–0,957 | tidak |
| **PP Editorial New** | **1,054–1,065** | tidak, selisih terjauh |

Leading 0,86 aman untuk **satu** famili dari delapan — Clash Display, famili yang dipakai di
iterasi-iterasi awal. Angkanya bertahan di kepala saya sebagai "leading display portfolio ini",
lalu ikut berpindah ke Obviously, lalu ke PP Editorial New, tanpa satu kali pun diukur ulang.
`typography-execution-patterns.md` mencatat median leading referensi **0,90–0,91**; saya memakai
0,86 dan tetap lolos karena rentang lint dibuka sampai 0,68.

Ini persis pola kegagalan #10 dan #13 di `INDEX.md` dalam bentuk baru: **bukan menyalin dari
inventaris, tapi menyalin angka dari konteks famili yang berbeda.**

### "available works dan email terlalu penuh" → gap nol, bukan "agak sempit"

`.th-status` (label "AVAILABLE FOR WORK") dan `.th-contact` (email) keduanya `inline`/`inline-block`
di dalam satu `div` tanpa `display: block`. Keduanya mengalir di baris yang sama:

| Besaran | Nilai |
|---|---|
| `.th-status` right | 1149,0 px |
| `.th-contact` left | **1149,0 px** |
| **Gap** | **0,0 px** |
| `.th-contact` top | 51,5 px — **16,8 px lebih tinggi** dari label di sebelahnya |

Dua elemen dengan peran berbeda (label 11px uppercase vs kontak 20px serif) berdempet tanpa
pemisah sama sekali, dengan baseline yang tidak sejajar. Hukum spacing di
`references/editorial/04-hierarchy-spacing-balance.md` — jarak antar grup ≥ 2× jarak dalam grup —
dilanggar dengan pembagi nol.

`layout-audit` melewatkannya karena keduanya tidak *tumpang tindih*; mereka bersentuhan persis.
Aturan `minGapPx: 8` ada di `DEFAULTS` tapi **tidak pernah dipanggil** — auditnya hanya
menghitung `overlapArea`, tidak pernah memeriksa gap positif yang terlalu kecil.

### "shader plasma/thermal yang lebih baik" → 60% bidang benar-benar kosong

Diukur dari piksel screenshot, bukan dari kesan. Tiga region, masing-masing bebas dari region lain:

| Region | mean luma | max luma | kerapatan tepi | gradien maks |
|---|---|---|---|---|
| Kanan atas 380×320 (shader murni) | **8,2**/255 | **18** | **0,00 %** | 10,9 |
| Kanan bawah 400×300 (bola panas) | 38,5 | 252 | 10,47 % | 167 |
| Kiri 420×300 (masthead) | 93,6 | 252 | 28,21 % | 320,1 |

Region shader murni punya **nol** piksel bertepi. Luma rata-rata 8 dari 255 — praktis tidak
terbedakan dari ground `#050507` (luma ≈ 5). Seluruh kejadian visual terkonsentrasi pada satu
bola tunggal di kanan bawah.

`anti-slop-rules.md` sudah memuat aturan ini, ditulis 2026-07-26, beberapa jam sebelum build:

> *"Batas antar zona wajib tajam (isoline terbaca) — gradien mulus tanpa kontur terbaca sebagai
> blur Photoshop, bukan citra termal."*

Skor kepatuhannya 0,00% — pelanggaran sekeras yang mungkin. Aturannya ada, ditulis oleh sistem
yang sama, dan tidak ada satu pun mekanisme yang memeriksanya karena ia hidup sebagai prosa.

Penyebab teknisnya bisa disebut: `PRESSURE_ITERATIONS = 3` di `useThermalField.ts`. Proyeksi
tekanan Jacobi butuh 20–50 iterasi untuk konvergen (port Pavel Dobryakov di
`useFluidSimulation.ts` memakai 20). Pada 3 iterasi medan tidak pernah bebas-divergensi, jadi
pusaran tidak pernah terbentuk — yang tersisa hanya difusi. `HEAT_DIFFUSION = 0.132` lalu
mengaburkan sisanya.

### "design ini ai slop" → bidang kosong + satu glow

Baris decoder: **"AI slop" (b)** — komposisi default generative. Bidang besar gelap kosong dengan
satu titik cahaya lembut adalah keluaran bawaan hampir setiap demo shader. Tidak ada di
`references/visual/` satu pun poster yang menyisakan 60% bidang tanpa struktur.

## Tes anti-slop yang gagal

- **EMPTY** — gagal. Hapus shader-nya: yang tersisa teks krem di atas hitam, dan 60% bidang
  memang sudah kosong sejak awal.
- **OBJECT** — gagal. Tidak ada objek; ada kabut dan satu bola.
- **NEIGHBOR** — gagal. HUD kanan atas, HUD kanan bawah, dan statement kiri bawah semuanya sudut
  yang diisi dengan cara yang sama.
- **SWAP** — gagal, lagi (ke-8). Ganti "Billy Maulana" jadi nama lain: identik.
- **WOW** — gagal.

## Sinyal taste baru

1. **Billy membaca tabrakan tinta, bukan tabrakan kotak.** Yang dilihatnya adalah bentuk huruf
   yang saling menembus. Semua pengukuran sistem sampai hari ini memakai `getBoundingClientRect`,
   yang pada `line-height` < 1 tidak memuat tintanya sendiri.
2. **"Terlalu penuh" berarti gap nol, bukan "kurang lega".** Dua elemen bersentuhan persis
   dibaca lebih buruk daripada dua elemen yang sedikit tumpang tindih.
3. **Bidang gelap kosong dihitung sebagai kegagalan, bukan sebagai negative space.** Batasnya
   terukur: luma rata-rata 8/255 dengan kerapatan tepi 0% bukan atmosfer, itu kanvas kosong.

## Rule baru

Lima, di-append ke `anti-slop-rules.md` dengan tanggal 2026-07-26.

## Perubahan proses

1. `scripts/ink-audit.mjs` — mengukur leading terhadap metrik tinta famili lewat `TextMetrics`,
   dan gap antar elemen berperan berbeda (bukan hanya tumpang tindih). Menutup dua kelas
   kegagalan yang `layout-audit` dan `taste-lint` sama-sama buta terhadapnya. Diverifikasi pada
   halaman ini: **11 kegagalan di 6 dari 7 viewport**, nol false positive, tepat dua rule yang
   berbunyi adalah dua hal yang Billy sebut.
2. Rentang `leading-tier` di `taste-lint` **tidak diubah**. Sempat direncanakan dinaikkan
   0,68 → 0,84, lalu dibatalkan: angka itu akan jadi tebakan kedua di atas tebakan pertama.
   Rentangnya dikalibrasi dari 104 referensi dan menaikkannya akan menolak Clash Display (rasio
   tinta 0,840) yang sah. Ambang leading sejati **bergantung famili**, jadi yang menegakkannya
   harus pengukur per-famili — `ink-audit` — bukan konstanta global.
3. `minGapPx` dihapus dari `DEFAULTS` di `layout-audit.mjs`. Ia dideklarasikan sejak awal dan
   tidak pernah dipanggil satu kali pun — config mati yang membuat audit tampak memeriksa jarak
   padahal tidak. Penegakan jarak sekarang milik `ink-audit`.
