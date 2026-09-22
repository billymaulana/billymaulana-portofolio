# Awwwards Evaluation System

Bagaimana situs dinilai di Awwwards. Pahami ini untuk tahu apa yang jury cari — bukan untuk gaming system, tapi untuk memastikan kualitas di semua dimensi.

> **PENTING (2026-07-26)** — rubrik di halaman ini menghasilkan **A-score** saja. A-score
> mengukur kesesuaian dengan standar Awwwards; ia **tidak mengukur taste Billy**. Karya bisa
> mendapat A-score 8.6 dan tetap ditolak mentah — sudah terjadi 2×
> (`../failures/INDEX.md`: "Lolos semua gate teknis, tetap ditolak").
>
> Gate sesungguhnya adalah **`min(A-score, T-score) ≥ 8.0`**. Rubrik T-score ada di bagian
> bawah halaman ini. Rata-rata DILARANG — rata-rata menyembunyikan kegagalan taste di balik
> skor Awwwards yang tinggi, dan itulah akar dua penolakan tersebut.

---

## Scoring System

**Skala**: 1-10 per kategori
**Threshold SOTD**: rata-rata >= 8.0
**Jury**: minimum 18 juri per site, 3 skor terjauh dari rata-rata otomatis dieliminasi
**Durasi voting**: 5 hari (bisa lebih cepat jika skor tinggi dari jury + minimal 10 PRO users)

---

## 4 Kriteria Utama

### 1. Design — 40% (bobot terbesar)

**Apa yang dinilai:**
- Visual appeal keseluruhan
- Pilihan warna dan color harmony
- Typography — font choices, hierarchy, spacing
- Imagery dan visual assets
- Layout dan composition
- Bagaimana desain ENHANCE user experience (bukan hanya "cantik")

**Yang membuat skor tinggi:**
- Font choices, spacing, dan hierarchy yang terasa intentional — jury notice dalam detik pertama
- Color combinations yang establish mood dan guide attention
- Desain yang cohesive — setiap elemen terasa milik satu keluarga visual

**Yang menurunkan skor:**
- Generic templates yang hanya di-reskin
- Inconsistent visual language antar halaman
- Typography yang tidak dipikirkan (default system fonts tanpa customization)

---

### 2. Usability/UX — 30%

**Apa yang dinilai:**
- Kemudahan navigasi — "apakah user navigate dengan senyum atau dengan umpatan?"
- Loading speed dan performance
- Responsiveness di berbagai device
- Clear information architecture
- Intuitive interactions

**Yang membuat skor tinggi:**
- Navigasi yang bisa di-test tanpa panduan — juri literally klik-klik tanpa guidance
- Fast load time — situs lambat atau poorly optimized = unacceptable
- Smooth experience di mobile dan desktop

**Yang menurunkan skor:**
- Situs yang sacrifice usability demi visual flashiness
- Broken pada device/browser tertentu
- Navigasi yang membingungkan atau menyembunyikan konten

---

### 3. Creativity — 20%

**Apa yang dinilai:**
- Originalitas konsep
- Penggunaan teknologi yang inovatif
- Fresh approach ke web design
- Keberanian push boundaries

**Yang membuat skor tinggi:**
- Genuinely BARU — juri lihat ratusan situs serupa, sesuatu yang benar-benar beda dapat perhatian
- Bold approaches yang well-executed (bukan bold karena broken)
- Microinteractions dan randomness — detail tak terduga yang membuat memorable
- Animasi yang immersive tapi tetap elegant dan tidak compromise fluidity

**Yang menurunkan skor:**
- Polished templates — tidak peduli seberapa rapi, template tetap template
- "Kreativitas" yang mengorbankan usability
- Copy-paste trends tanpa interpretasi sendiri

---

### 4. Content — 10% (bobot terkecil, tapi tetap penting)

**Apa yang dinilai:**
- Kualitas tulisan/copy
- Relevansi dan value untuk user
- Integrasi content dengan design dan functionality
- Content yang mendukung tujuan site, bukan filler

**Yang membuat skor tinggi:**
- Copy yang purposeful — setiap kata punya alasan
- Content dan design saling memperkuat (bukan terpisah)
- Storytelling yang engage

---

## Developer Award (Bonus — terpisah dari SOTD)

Semua SOTD winner otomatis dikirim ke developer jury. Skor > 7 = Developer Award.

**Kriteria teknis:**
- Performance (loading, runtime)
- SEO compliance
- Accessibility — inklusif untuk semua user (visual/hearing impairments)
- Responsive/mobile optimization
- Code quality
- Google Mobile Guidelines score >= 70/100

**Filosofi**: "Balancing innovative design with quality code. Inclusive of all people, regardless of device or browser."

---

## Award Tiers

| Award | Bagaimana Dapat |
|-------|----------------|
| **Honorable Mention** | Skor cukup tinggi tapi di bawah SOTD threshold |
| **SOTD** (Site of the Day) | Rata-rata >= 8.0, terbaik hari itu |
| **Developer Award** | SOTD winner + dev jury skor > 7 |
| **SOTM** (Site of the Month) | Dipilih dari pool SOTD winners bulan itu |
| **SOTY** (Site of the Year) | Paling prestigious — dari semua SOTM |
| **Mobile Excellence** | Honorable Mention + Google Mobile score >= 70/100 |

---

## Strategi: Apa yang Harus Diprioritaskan

Berdasarkan bobot scoring:

```
PRIORITAS 1: Design (40%)
├── Typography yang intentional dan distinctive
├── Color yang punya narasi
├── Layout composition yang tidak generic
└── Visual cohesion di semua halaman

PRIORITAS 2: Usability (30%)
├── Performance — fast load, smooth runtime
├── Mobile responsive — bukan afterthought
├── Navigasi intuitif tanpa panduan
└── Accessibility basics (contrast, keyboard nav, screen reader)

PRIORITAS 3: Creativity (20%)
├── Satu hal yang genuinely original
├── Microinteractions yang memorable
├── Fresh interpretation, bukan copy trends
└── Animasi yang immersive tapi smooth

PRIORITAS 4: Content (10%)
├── Copy yang purposeful
├── Content-design integration
└── Storytelling yang engage

BONUS: Developer Award
├── Lighthouse scores (performance, a11y, SEO)
├── Clean code
└── Progressive enhancement
```

---

## Insight Kunci

1. **Design 40% + Usability 30% = 70% skor** — site HARUS cantik DAN functional. Salah satu saja tidak cukup.
2. **Creativity 20%** — cukup SATU hal yang genuinely original untuk standout. Tidak perlu reinvent everything.
3. **Performance = non-negotiable** — situs lambat langsung mengurangi Usability score. Juri tidak sabar.
4. **Animasi = double-edged sword** — immersive animation boost Creativity + Design, tapi jika menurunkan performance = turunkan Usability.
5. **18 juri berarti diversity** — situs harus appeal ke designer DAN developer DAN creative director. Semua dimensi penting.

---

# T-Score Rubric — Kesesuaian Taste (2026-07-26)

A-score menjawab *"apakah ini pantas menang di Awwwards?"*. T-score menjawab pertanyaan yang
berbeda dan sama pentingnya: *"apakah ini karya Billy?"*. Sebuah situs bisa unggul di satu skor
dan jatuh di skor lain — dan itulah yang selama ini luput.

**Skala 1–10 per dimensi. Bobot di bawah. Gate: `min(A, T) ≥ 8.0`.**

## Dimensi 1 — Taste Profile Compliance (30%)

Sumber: `../personal-taste-profile.md` (kanonik).

| Skor | Kriteria |
|---|---|
| 9–10 | Semua locked decision dipatuhi; identity (Brutalist + Premium + Swiss + Dark Cinematic + Liquid/Glass + Extreme Typography) terbaca tanpa perlu dijelaskan |
| 7–8 | Dipatuhi, tapi satu pilar identity lemah atau tidak hadir |
| 5–6 | Dua pilar hilang; hasil bisa dipindah ke brand lain tanpa terasa aneh |
| 1–4 | Melanggar hard constraint (palet, easing, layout BANNED) |

Cek eksplisit: palet identity `#0047FF`/`#0166c9`/`#0f0a72`/`#a1e0e7` · easing hierarchy ·
grid Swiss sebagai vocabulary · setiap section punya identitas visual sendiri.

## Dimensi 2 — Anti-Slop Clearance (25%)

Sumber: `../anti-slop-rules.md`.

| Skor | Kriteria |
|---|---|
| 9–10 | Lolos kelima tes (OBJECT/SWAP/EMPTY/WOW/NEIGHBOR); teknik ≥ Level 4; tidak ada hard reject |
| 7–8 | Lolos kelima tes, tapi teknik Level 3 |
| 5–6 | Satu tes gagal |
| 1–4 | Dua tes gagal, atau ada hard reject aktif |

**Aturan keras**: satu tes gagal → dimensi ini **maksimum 6**, apa pun kualitas lainnya.

## Dimensi 3 — Editorial Craft (20%)

Sumber: `editorial/README.md` § Gate editorial + hasil `scripts/taste-lint.mjs`.

| Skor | Kriteria |
|---|---|
| 9–10 | `taste-lint` HIJAU; gate editorial 9 poin lolos; micro-typography dikerjakan |
| 7–8 | ≤ 2 rule lint FAIL, semuanya non-tipografi |
| 5–6 | 3–5 rule FAIL, atau ada rule tipografi yang FAIL |
| 1–4 | `tracking-not-global` FAIL, atau > 5 rule FAIL |

`tracking-not-global` FAIL berarti tipografi memakai satu nilai global — sinyal paling langsung
dari "font default diperbesar". Itu **plafon 4** untuk dimensi ini.

## Dimensi 4 — Mood Accuracy (15%)

Sumber: `editorial/05-developing-taste.md` §4 (taxonomy 18 token) + mood target per section di
`../personal-taste-profile.md`.

| Skor | Kriteria |
|---|---|
| 9–10 | Mood yang keluar = mood target, dan setiap penanda terukurnya bisa ditunjuk |
| 7–8 | Dua dari tiga token cocok |
| 5–6 | Satu token cocok |
| 1–4 | Tidak cocok, atau ada anti-mood aktif (`corporate`/`sterile`/`cute`/`sporty`/`template`) |

Anti-mood terdeteksi → dimensi ini **maksimum 3**.

## Dimensi 5 — Novelty vs Failures (10%)

Sumber: `../failures/INDEX.md` § Pola kegagalan yang berulang.

| Skor | Kriteria |
|---|---|
| 9–10 | Tidak mengulang satu pun pola yang sudah ditolak; mencoba arah dari daftar "Yang belum pernah dicoba" |
| 7–8 | Tidak mengulang pola yang ditolak |
| 5–6 | Mengulang satu pola dengan variasi |
| 1–4 | Mengulang pola yang sudah ditolak ≥ 2× (video-heavy, brushed metal grayscale, metadata implementasi sebagai konten) |

## Cara melaporkan

```
A-score  8.6   (Design 9 · UX 8 · Creativity 9 · Content 7)
T-score  6.2   (Profile 7 · Anti-slop 6 · Editorial 5 · Mood 7 · Novelty 8)
────────────────────────────────────────────────────────────
GATE     min = 6.2  → BELUM LOLOS

Penyebab utama: Editorial 5 — taste-lint 8 FAIL termasuk tracking-not-global.
```

Laporan **wajib** menyebutkan dimensi terendah beserta angkanya. Melaporkan rata-rata saja
adalah pelanggaran aturan.

---

Sources:
- [Awwwards Evaluation System](https://www.awwwards.com/about-evaluation/)
- [Sommo: Tips for Awwwards 2024](https://www.sommo.io/blog/why-submit-your-website-to-awwwards-tips-and-how-tos-for-2024)
- [Digidop: Complete Guide Awwwards](https://www.digidop.com/blog/complete-guide-awwards-digital-agencies)
- [Awwwards Developer Award](https://www.awwwards.com/developer-award/)
