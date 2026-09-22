---
type: editorial-lesson
lesson: 1
title: Typography Fundamentals
updated: 2026-07-26
covers: [typography groups, typography terms, display vs text, pairing, type scale, special characters, project breakdown]
prereq: none
---

# Lesson 1 — Typography Fundamentals

> Melengkapi `../typography-mastery.md` (yang sudah kuat di type scale, CSS technique, GSAP).
> File ini mengisi yang HILANG: klasifikasi, anatomi, optical size, dan micro-typography.

Typography bukan "pilih font yang bagus". Typography adalah **memilih kerangka huruf
(skeleton) yang benar, lalu mengatur ruang di sekitarnya**. Font hanya 20% dari pekerjaan;
80% sisanya adalah spacing, ukuran, dan ambang keputusan.

---

## 1. Typography Groups — Klasifikasi yang Wajib Bisa Dikenali

Tidak bisa memilih font tanpa bisa menamai kelompoknya. Kelompok menentukan **suhu emosi**
dan **perilaku di ukuran ekstrem**.

### 1A. Serif

| Grup | Ciri terukur | Sumbu (axis) | Kontras stroke | Rasa | Contoh |
|---|---|---|---|---|---|
| **Old Style / Humanist** | Serif masuk miring, serif ascender bersudut | Miring (~15–25°) | Rendah (1:1.5) | Hangat, literer, bersejarah | Garamond, Sabon |
| **Transitional** | Serif lebih horizontal, bracket lebih tajam | Nyaris vertikal | Sedang (1:3) | Netral-otoritatif | Baskerville, Times |
| **Didone / Modern** | Serif hairline lurus tanpa bracket | Vertikal penuh | Ekstrem (1:8+) | Mewah, dingin, fashion | Bodoni, Didot |
| **Slab** | Serif balok setebal stem | Vertikal | Sangat rendah (~1:1) | Mekanis, tegas, industrial | Rockwell |

**Aturan operasional**: kontras stroke berbanding lurus dengan ukuran minimum yang aman.
Didone di bawah 24px kehilangan hairline-nya di layar — jadi Didone = **display-only**.
Old Style bertahan sampai 14px.

### 1B. Sans-serif

| Grup | Penanda visual paling cepat | Rasa | Contoh |
|---|---|---|---|
| **Grotesque** (abad 19) | `G` ber-spur, `R` berkaki melengkung, terminal kurva horizontal, masih ada sedikit kontras | Kokoh, sedikit kasar, "vintage industrial" | Akzidenz-Grotesk |
| **Neo-grotesque** | Kontras nyaris nol, desain sangat reguler, **tanpa spur pada `G`**, aperture tertutup | Netral, Swiss, korporat-premium | Helvetica, Suisse Int'l, ABC Diatype |
| **Geometric** | `O` mendekati lingkaran sempurna, `a` **satu lantai** | Modern, optimis, kadang dingin | Futura, Poppins |
| **Humanist** | Proporsi dari inskripsi Romawi, `a` dan `g` **dua lantai**, aperture terbuka | Ramah, mudah dibaca, "manusiawi" | Gill Sans, Frutiger |

**Tes 4 detik untuk mengenali sans**: lihat huruf `a` dan `G`.
`a` satu lantai → geometric. `a` dua lantai + `G` tanpa spur → neo-grotesque.
`a` dua lantai + `G` ber-spur → grotesque. Aperture terbuka lebar → humanist.

### 1C. Kelompok sisanya

- **Display / Decorative** — dirancang HANYA untuk ukuran besar. Spacing default-nya
  sengaja longgar/aneh karena diasumsikan akan di-track manual. Bebas Neue, Clash Display, Obviously.
- **Monospace** — lebar setiap glyph identik. Fungsinya di editorial: **label, angka, metadata** —
  bukan body copy.
- **Script / Handwritten** — hampir selalu salah di web premium kecuali jadi satu aksen tunggal.

### 1D. Inventori font repo ini, sudah diklasifikasi

Diverifikasi dari `app/assets/css/main.css` + `package.json`:

| Font | Grup | Peran sah | Ambang ukuran aman |
|---|---|---|---|
| **Clash Display** (variable 200–700) | Display neo-grotesque, ultra-wide di weight berat, kontras tebal-tipis tajam | Masthead, statement | ≥ 64px |
| **Bebas Neue** (400) | Display condensed grotesque, uppercase-only secara praktis | Masthead vertikal, marquee | ≥ 48px |
| **Obviously Condensed Black** | Display condensed | **Ditolak Billy 2026-07-25** sebagai fondasi hero | — |
| **Switzer** (variable 100–900) | Neo-grotesque | Display alternatif + subhead | 16–200px |
| **Satoshi** (variable 300–900) | Geometric grotesque (ITF) | Body, UI, subhead | 14–48px |
| **Suisse Int'l Book** (400) | Neo-grotesque Swiss | Body editorial, label | 14–32px |
| **PP Editorial New** (200/400/800 + italic) | Serif narrow, proporsi condensed, kontras sedang-tinggi | Aksen serif, pull quote, italic accent | ≥ 20px |
| **Apparel Italic** | Serif italic display | Aksen tunggal per section | ≥ 28px |
| **Cormorant Italic** (500/600) | Old-style serif berkontras tinggi | Aksen italic halus | ≥ 24px |
| **JetBrains Mono** (400/500) | Monospace | Label, angka, metadata, index | 11–14px |
| **Instrument Serif / Italiana / Marck Script / Almarai / Barlow / Manrope / Inter** | — | **Tidak dipakai.** Inter secara eksplisit BANNED di `anti-slop-rules.md` | — |

---

## 2. Typography Terms — Kosakata yang Wajib Presisi

### 2A. Anatomi huruf

| Istilah | Definisi | Kenapa penting untuk web |
|---|---|---|
| **Baseline** | Garis tempat huruf "duduk" | Acuan semua penyelarasan vertikal |
| **x-height** | Tinggi huruf `x` | Penentu keterbacaan sesungguhnya, BUKAN font-size. x-height besar → terasa lebih besar di ukuran sama |
| **Cap height** | Tinggi huruf kapital | Menentukan optical alignment heading |
| **Ascender / Descender** | Bagian yang naik (`b`,`d`,`h`) / turun (`p`,`g`) | Menentukan line-height minimum sebelum bertabrakan |
| **Counter** | Ruang tertutup di dalam huruf (`o`,`a`,`e`) | Counter kecil = tidak boleh dipakai di ukuran kecil |
| **Aperture** | Bukaan pada `c`,`s`,`a` | Aperture sempit = terlihat "tercekik" di body copy |
| **Terminal** | Ujung stroke yang tidak berserif | Penanda kepribadian font |
| **Overshoot** | Huruf bundar (`O`,`o`) sedikit melampaui baseline/cap-height agar terlihat sama tinggi | Alasan kenapa alignment matematis kadang terlihat salah |
| **Spur** | Tonjolan kecil pada `G` | Pembeda grotesque vs neo-grotesque |

### 2B. Empat jenis ruang — sering tertukar

| Istilah | Ruang antara | Properti CSS | Rentang kerja |
|---|---|---|---|
| **Kerning** | Sepasang huruf spesifik (`AV`, `To`) | `font-kerning: normal` (default aktif) | Otomatis dari font |
| **Tracking / letter-spacing** | SEMUA huruf secara merata | `letter-spacing` | Lihat tabel ambang §4B |
| **Leading / line-height** | Baris ke baris | `line-height` (unitless) | 0.85 – 1.5 |
| **Measure** | Panjang baris | `max-width` dalam `ch` | 45–90 karakter |

**Kesalahan paling umum**: menyebut `letter-spacing` sebagai "kerning". Kerning adalah data
di dalam file font untuk pasangan tertentu; `letter-spacing` adalah tracking global.

### 2C. Measure — angka yang jarang dipatuhi

Butterick: **45–90 karakter per baris**, setara 2–3 alfabet lowercase.
Editorial sweet spot: **60–75 karakter**.

```css
.measure-body { max-width: 68ch; }
.measure-lead { max-width: 52ch; }
.measure-caption { max-width: 40ch; }
```

Untuk display, measure justru harus **pendek**: 18–34 karakter per baris supaya heading
terbaca sebagai satu bentuk, bukan paragraf besar.

---

## 3. Display vs Text/Body Copy — Konsep yang Paling Sering Dilewatkan

Satu font di 240px dan di 16px **bukan pekerjaan yang sama**. Secara historis type foundry
memotong versi berbeda per rentang ukuran: *Caption*, *Text*, *Display*. Variable font modern
menyimpannya sebagai sumbu **`opsz`** (optical size).

### 3A. Apa yang berubah antara cut Text dan cut Display

| Aspek | Text cut (kecil) | Display cut (besar) |
|---|---|---|
| Kontras stroke | Lebih rendah — hairline hilang di ukuran kecil | Lebih tinggi — hairline jadi elegan |
| Spacing default | Lebih longgar — agar tidak menempel | Lebih rapat — agar tidak berlubang |
| x-height | Relatif lebih tinggi | Relatif lebih rendah |
| Detail serif/terminal | Disederhanakan, ditebalkan | Diperhalus, ditajamkan |

### 3B. CSS

Optical sizing **aktif otomatis** untuk font yang punya sumbu `opsz`:

```css
h1 { font-optical-sizing: auto; }

.masthead {
  font-variation-settings: 'opsz' 96;
}

.body-copy {
  font-optical-sizing: none;
}
```

`font-variation-settings: 'opsz' <n>` memaksa nilai optical size lepas dari `font-size` —
berguna saat teks di-scale via `transform` (font-size tetap kecil, tampilan besar).

### 3C. Aturan pengganti kalau font TIDAK punya sumbu `opsz`

Semua font di repo ini **tidak punya** sumbu `opsz` (Clash Display & Satoshi variable hanya
punya `wght`). Jadi optical sizing harus disimulasikan manual:

> **Dikalibrasi 2026-07-26** dari pengukuran langsung **80 situs** di `../library/`
> (median = target, p10…p90 = rentang kerja). Tabel teoritis lama terbantah: yang menentukan
> tracking bukan ukuran melainkan **famili × weight** — median display konsisten `−0.03em`
> di semua bucket ≥56px.

| font-size | target (median) | rentang kerja (p10…p90) | font-weight | line-height |
|---|---|---|---|---|
| ≥ 160px | **−0.030em** | −0.115 … +0.025 | 100–900 (median 500) | 0.68 … 1.25 |
| 96–159px | **−0.030em** | −0.05 … +0.025 | 300–800 (median 500) | 0.70 … 1.20 |
| 56–95px | **−0.023em** | −0.07 … +0.025 | 400–500 | 0.70 … 1.20 |
| 32–55px | −0.015em | −0.06 … +0.025 | 400–600 | 0.95 … 1.75 |
| 20–31px | **0** | −0.07 … +0.03 | 400–600 | 0.95 … 1.75 |
| 14–19px | **0** | −0.07 … +0.03 | 400–700 | 0.95 … 1.75 |
| ≤ 13px | **0** | −0.065 … +0.07 (uppercase s/d +0.21) | 400–700 | 0.95 … 2.05 |

**Tiga koreksi terhadap versi sebelumnya** (detail di `../../personal-taste-profile.md`):
leading display median **0.95**, bukan 0.85 · body tracking median **0**, bukan negatif ·
weight display median **500**, sebaran nyaris simetris.

**Tracking dipilih dari famili dan weight, bukan dari tabel ukuran:**

| Famili @ weight | Tracking yang dipakai referensi |
|---|---|
| Switzer 300 | −0.10em (vitaeresume, 264px) |
| Inter 700 | −0.06 … −0.08em (lyniq 427px, vertical 409px) |
| Inter Display 700–900 | −0.03 … −0.04em (mobius, mugen, viper) |
| Switzer 400 · Satoshi 700 · PP Neue Montreal 400 | −0.02em (baselane, portrixe, creativewebmanual) |
| Clash Display 600 | −0.0075em — sudah rapat bawaan (porto-template) |
| Inter Display 800 | 0em (nexola) |

**Tracking negatif berlaku di semua tier, bukan hanya display.** Lyniq: body −0.05em, label
−0.04em. Creative Web Manual memakai −0.02em identik di 256px, 136px, dan 24px — konsistensi
sebagai sistem mengalahkan optimasi per tier.

**Aturan lama "≤13px → +0.08em uppercase" DICABUT.** Dari 15 referensi hanya satu memakai label
ber-tracking positif; sisanya netral/negatif dan mayoritas sentence case. Pola label mono
uppercase ber-tracking lebar justru yang Billy sebut "AI slop" (rule 2026-07-25).

**Aturan inti**: makin besar ukuran, makin negatif tracking dan makin ringan weight.
Weight berat + ukuran besar + tracking normal = tampilan "font default diperbesar" — inilah
sinyal AI slop yang paling gampang dikenali.

---

## 4. Pairing Fonts — Keputusan, Bukan Selera

### 4A. Tiga jalur sah (pilih satu, jangan campur)

**Jalur 1 — Superfamily.** Satu keluarga yang punya versi serif dan sans.
Paling aman, paling membosankan. Contoh: IBM Plex Sans + IBM Plex Serif.

**Jalur 2 — Kontras skeleton.** Dua font dengan **kerangka berbeda tajam** tapi
**x-height dan lebar mirip**. Ini yang dipakai referensi favorit Billy:
- Bebas Neue (condensed display) + Satoshi (geometric grotesque) — kontras lebar ekstrem
- Clash Display + Suisse Int'l — kontras karakter, kerangka sama-sama neo-grotesque
- Sans apa pun + PP Editorial New Italic sebagai **aksen tunggal** (bukan body)

**Jalur 3 — Single family disiplin.** Satu famili, hierarki lahir dari ukuran + case + ruang.
Sah sejak revisi 2026-07-26, dengan syarat keras:
- rasio display : body **≥ 5×** (mis. 120px vs 18px = 6.7× ✓)
- leading dikunci per tier (0.85 / 1.0 / 1.3)
- minimal 3 dari 5 dimensi kontras aktif (lihat §4C)

Bukti dari library: `wolverineworldwide` (ABC Diatype), `oharchitecture` (PP Neue Montreal),
`quantumbody` (Neue Haas Display 400 di 8 ukuran).

### 4B. Tes kelayakan pasangan — 3 pemeriksaan

1. **Tes x-height** — render kedua font di 40px berdampingan. Kalau x-height beda > 15%,
   pasangan akan terlihat "tidak sengaja". Perbaiki dengan `font-size-adjust`.
2. **Tes silhouette** — blur 6px. Kalau dua font jadi terlihat sama → kontrasnya kurang,
   pasangan tidak berguna. Kalau terlihat seperti dua desain berbeda → kontras berlebihan.
3. **Tes suhu** — kedua font berasal dari abad yang sama? Kalau berbeda (Didone + geometric),
   itu harus keputusan sadar, bukan kebetulan.

### 4C. Lima dimensi kontras — minimal 3 aktif

| Dimensi | Contoh lompatan yang cukup |
|---|---|
| **Ukuran** | 120px vs 18px (6.7×) |
| **Weight** | 600 vs 300 |
| **Case** | UPPERCASE tracked vs sentence case |
| **Warna/nilai** | `#FFFDF5` 100% vs 45% opacity |
| **Famili/style** | sans vs italic serif |

Kontras yang hanya bertumpu pada weight (bold vs regular) = **BANNED** di profil taste Billy.

### 4D. Maksimum

Maksimum **2 famili + 1 mono** per halaman. Maksimum **3 weight** per desain
(aturan `anti-slop-rules.md`).

---

## 5. Type Scale

### 5A. Editorial butuh DUA skala, bukan satu

Kesalahan umum: memakai satu rasio modular untuk semua. Editorial premium memakai
**skala terpisah** untuk display dan untuk text.

**Text scale — rasio kecil (1.2 Minor Third), karena harus terbaca:**

```
12 · 14 · 16 · 19 · 23 · 28
```

**Display scale — rasio besar (1.5–1.618), karena harus dramatis:**

```
40 · 64 · 104 · 168 · 272
```

Ada **jurang sengaja** antara 28 dan 40. Jurang inilah yang membuat hierarki terasa
"disetel", bukan "otomatis". Ukuran di zona 30–39px sebaiknya dihindari.

### 5B. Implementasi fluid

```css
:root {
  --step--1: clamp(0.75rem, 0.72rem + 0.15vw, 0.875rem);
  --step-0:  clamp(1rem, 0.95rem + 0.25vw, 1.1875rem);
  --step-1:  clamp(1.1875rem, 1.1rem + 0.38vw, 1.4375rem);
  --step-2:  clamp(1.4375rem, 1.3rem + 0.7vw, 1.75rem);

  --display-1: clamp(2.5rem, 1.8rem + 3.5vw, 4rem);
  --display-2: clamp(4rem, 2.5rem + 7.5vw, 6.5rem);
  --display-3: clamp(6.5rem, 3rem + 17.5vw, 10.5rem);
  --display-4: clamp(10.5rem, 4rem + 32.5vw, 17rem);
}
```

Rentang `vw` dihitung untuk viewport 360px → 1440px. Verifikasi setiap nilai `clamp()`
di 360, 768, 1024, 1440, 1920 sebelum dianggap selesai.

### 5C. Leading dikunci per tier (aturan Billy, dari `quantumbody`)

| Tier | line-height | Kapan |
|---|---|---|
| Display | **0.85** | ≥ 64px |
| Statement | **1.0** | 32–63px |
| Body | **1.3** | 15–24px |
| Caption/label | **1.2** | ≤ 14px |

---

## 6. Special Characters, Indents, dan Micro-Typography

Ini lapisan yang membedakan "web developer yang menaruh teks" dari "art director".
Hampir tidak ada portfolio yang mengurus ini — jadi mengurusnya adalah keunggulan langsung
pada scoring **Design** dan **Content**.

### 6A. Karakter yang benar

| Salah | Benar | Unicode | Pemakaian |
|---|---|---|---|
| `"kutipan"` | `"kutipan"` | U+201C / U+201D | Kutipan ganda |
| `'apostrof` | `'apostrof` | U+2019 | Apostrof & kutipan tunggal |
| `2020-2026` | `2020–2026` | U+2013 en dash | Rentang angka/tanggal |
| `kata - kata` | `kata — kata` | U+2014 em dash | Jeda kalimat |
| `...` | `…` | U+2026 | Elipsis |
| `x` | `×` | U+00D7 | Dimensi, perkalian (`1440 × 900`) |
| `(c)` | `©` | U+00A9 | Copyright footer |
| `->` | `→` | U+2192 | Arrow label |

Untuk kolom sempit, pakai **non-breaking space** (`&nbsp;`) di antara angka dan satuan
(`7&nbsp;tahun`, `2026&nbsp;→`) supaya tidak pernah patah.

### 6B. OpenType features

Gunakan properti `font-variant-*` (high-level, hasil lebih terprediksi) — bukan
`font-feature-settings`, yang dimaksudkan untuk kasus khusus saja.

```css
.tabular-figures {
  font-variant-numeric: tabular-nums;
}

.stat-number {
  font-variant-numeric: tabular-nums lining-nums;
}

.body-copy {
  font-variant-ligatures: common-ligatures contextual;
}

.label-small {
  font-variant-caps: all-small-caps;
}
```

**Aturan wajib**: setiap angka yang berubah saat animasi (counter, jam, persentase, scroll
progress) **HARUS** `tabular-nums`. Tanpa itu, angka bergoyang horizontal saat berubah —
detail kecil yang langsung terbaca sebagai "tidak dipoles".

### 6C. Widow, orphan, dan pengendalian baris

| Masalah | Definisi | Solusi |
|---|---|---|
| **Widow** | Satu kata sendirian di baris terakhir paragraf | `text-wrap: pretty` |
| **Orphan** | Satu baris paragraf tertinggal sendiri | `text-wrap: pretty` |
| **Heading pincang** | Baris pertama panjang, baris kedua satu kata | `text-wrap: balance` |

```css
h1, h2, h3, blockquote, figcaption {
  text-wrap: balance;
}

p, li {
  text-wrap: pretty;
}
```

Batas yang diverifikasi dari MDN:
- `balance` hanya berlaku untuk blok pendek — **≤ 6 baris di Chromium, ≤ 10 baris di Firefox**.
  Di luar itu browser mengabaikannya diam-diam.
- `pretty` memakai algoritma lebih lambat. Pakai hanya untuk body copy, jangan untuk seluruh
  halaman.
- Keduanya **Baseline sejak Maret 2024** — aman dipakai.

### 6D. Hanging punctuation

```css
.pull-quote {
  hanging-punctuation: first last;
  text-indent: -0.42em;
}
```

`hanging-punctuation` **BUKAN Baseline** — dukungan sangat terbatas (praktis Safari saja).
Karena itu **selalu sertakan fallback `text-indent` negatif** untuk optical alignment tanda
kutip pembuka. Tanpa fallback, pull quote akan terlihat tergeser masuk di Chrome.

### 6E. Indent vs space

Editorial print memakai **indent** (first-line indent, tanpa jarak antar paragraf).
Editorial **web** memakai **space** (jarak antar paragraf, tanpa indent). Jangan pakai
keduanya sekaligus — itu kesalahan amatir paling terlihat.

```css
.prose p + p {
  margin-block-start: 1.4em;
  text-indent: 0;
}
```

Kalau memang menginginkan rasa print murni, pakai indent saja:

```css
.prose--print p + p {
  margin-block-start: 0;
  text-indent: 2.2em;
}
```

### 6F. Optical alignment

Huruf berujung bundar/diagonal (`O`, `A`, `W`, `V`) terlihat masuk ke dalam padahal
matematis rata. Kompensasi manual pada elemen flush-left besar:

```css
.masthead--flush {
  margin-inline-start: -0.06em;
}
```

Nilai kompensasi: `-0.02em` untuk sans, `-0.06em` untuk display berat, `-0.09em` untuk
kutipan pembuka.

---

## 7. Project Breakdown — Terapkan ke Portfolio Ini

Contoh sistem tipografi lengkap yang lolos semua aturan di atas, memakai font yang **sudah ada**
di repo (tanpa dependency baru):

| Peran | Font | Size | Weight | Tracking | Leading | Case |
|---|---|---|---|---|---|---|
| Masthead hero | Bebas Neue | `--display-4` (168–272px) | 400 | −0.04em | 0.82 | UPPER |
| Statement section | Clash Display | `--display-2` (64–104px) | 500 | −0.03em | 0.85 | Sentence |
| Subhead | Switzer | `--display-1` (40–64px) | 500 | −0.02em | 0.95 | Sentence |
| Lead paragraph | Satoshi | `--step-2` (23–28px) | 400 | −0.005em | 1.25 | Sentence |
| Body | Satoshi | `--step-0` (16–19px) | 400 | 0 | 1.3 | Sentence |
| Aksen italic | PP Editorial New Italic | sama dengan induknya | 400 | 0 | mengikuti | Sentence |
| Label / meta | JetBrains Mono | `--step--1` (12–14px) | 500 | +0.08em | 1.2 | UPPER |

Rasio display : body = 272 : 16 = **17×** — jauh di atas ambang 5×.

### Checklist verifikasi sebelum klaim selesai

- [ ] Tidak ada ukuran di zona terlarang 30–39px
- [ ] Setiap tier memakai leading terkunci (0.85 / 1.0 / 1.3 / 1.2)
- [ ] Tracking mengikuti tabel ambang §3C, bukan satu nilai global
- [ ] `text-wrap: balance` di semua heading, `pretty` di body
- [ ] Semua angka dinamis pakai `tabular-nums`
- [ ] Semua tanda kutip, dash, dan elipsis memakai karakter yang benar
- [ ] Measure body ≤ 75ch, measure display ≤ 34 karakter/baris
- [ ] Maksimum 2 famili + 1 mono, maksimum 3 weight
- [ ] Optical alignment dikompensasi pada elemen flush-left besar

---

## Sumber

- [Butterick's Practical Typography — Typography in Ten Minutes](https://practicaltypography.com/typography-in-ten-minutes.html)
- [MDN — text-wrap](https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap)
- [MDN — hanging-punctuation](https://developer.mozilla.org/en-US/docs/Web/CSS/hanging-punctuation)
- [MDN — font-optical-sizing](https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing)
- [Pixelambacht — Optical size, the hidden superpower of variable fonts](https://pixelambacht.nl/2021/optical-size-hidden-superpower/)
- [Smashing Magazine — Making Sense of Type Classification](https://www.smashingmagazine.com/2013/06/making-sense-of-type-classification-part-2/)
- [Google Fonts Knowledge — Implementing OpenType features on the web](https://fonts.google.com/knowledge/choosing_type/implementing_open_type_features_on_the_web)
- [Pangram Pangram — Editorial New](https://pangrampangram.com/products/editorial-new)
