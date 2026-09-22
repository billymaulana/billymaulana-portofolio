---
type: editorial-lesson
lesson: 2
title: Grid Fundamentals
updated: 2026-07-26
covers: [what is a grid, purpose, grid types, common mistakes, project breakdown, baseline grid]
prereq: 01-typography-fundamentals
---

# Lesson 2 — Grid Fundamentals

> Melengkapi `../grid-techniques.md` (CSS Grid API, bento, breaking the grid) dan
> `../layout-composition.md` (pattern per section). File ini mengisi **teori konstruksi**:
> dari mana angka grid berasal, dan kenapa grid tertentu dipilih.

---

## 1. Apa Itu Grid System

Grid adalah **kerangka pengambilan keputusan spasial** yang dibuat SEBELUM konten ditempatkan.
Fungsinya bukan merapikan — fungsinya **menghapus pertanyaan "taruh di mana"** supaya energi
kreatif habis untuk hal yang benar-benar penting.

### Anatomi — tujuh bagian

| Bagian | Definisi | Kesalahan umum |
|---|---|---|
| **Margin** | Ruang antara tepi grid dan tepi viewport | Dianggap sisa, padahal margin adalah keputusan pertama |
| **Column** | Pembagian vertikal tempat konten duduk | Terlalu banyak (lihat §4) |
| **Gutter** | Ruang antar kolom / antar baris | Diubah-ubah per section |
| **Module** | Pertemuan kolom × baris (grid modular) | Diabaikan; hanya kolom yang dipakai |
| **Field** | Kelompok modul yang dipakai sebagai unit | Tidak pernah didefinisikan |
| **Flowline** | Garis horizontal tempat konten "digantung" | Tidak ada — semua section mulai di ketinggian acak |
| **Marker / spatial zone** | Zona tetap untuk elemen berulang (nomor section, label sudut) | Dibuat ad-hoc per section |

### Prinsip konstruksi Müller-Brockmann

Grid **tidak dimulai dari angka favorit**. Grid dimulai dari **format halaman dan ukuran
teks body**, lalu column width, gutter, dan margin diturunkan dari kondisi itu.

Urutan yang benar:

```
1. Tentukan measure body copy      →  68ch @ 18px  ≈  612px
2. Tentukan gutter dari leading    →  line-height 1.3 × 18px = 23.4px → dibulatkan 24px
3. Tentukan margin dari gutter     →  margin = gutter × 2 (48px) atau × 4 (96px)
4. Baru hitung jumlah kolom        →  (1440 − 96×2) / (kolom + gutter)
```

Kebalikannya — memilih "12 kolom" lebih dulu lalu memaksa teks masuk — adalah alasan
kebanyakan situs terasa seperti template.

---

## 2. Apa Tujuannya

Lima fungsi nyata. Kalau grid yang dibuat tidak melayani minimal tiga dari ini, grid itu
hanya dekorasi:

1. **Kecepatan keputusan** — posisi bukan lagi pertanyaan terbuka
2. **Koherensi antar section** — mata mengenali sistem tanpa disadari
3. **Basis untuk dilanggar** — pelanggaran hanya terasa disengaja kalau ada aturan yang dilanggar
4. **Skalabilitas responsif** — satu sistem, banyak breakpoint
5. **Bahasa bersama** — "geser ke kolom 7" lebih presisi daripada "geser sedikit ke kanan"

Poin 3 adalah yang paling relevan untuk taste Billy: *Swiss grid ketat → lalu dilanggar secara
sadar*. Tanpa grid ketat di awal, pelanggaran hanya terbaca sebagai berantakan.

---

## 3. Tipe Grid dan Kapan Memakainya

| Tipe | Struktur | Paling cocok untuk | Rasa |
|---|---|---|---|
| **Manuscript** | Satu blok teks, margin lebar | Manifesto, long-form, halaman "About" | Hening, literer, otoritatif |
| **Column** | 2–12 kolom vertikal | Layout umum, editorial | Tergantung jumlah kolom |
| **Modular** | Kolom × baris = modul | Katalog proyek, arsip, index | Sistematis, terkendali |
| **Hierarchical** | Zona organik dari kebutuhan konten | Hero, halaman satu-satunya | Bebas tapi berisiko |
| **Baseline** | Ritme horizontal, dipakai BERSAMA tipe lain | Semua situs teks-berat | Presisi, "tercetak" |
| **Compound** | Dua grid ditumpuk (mis. 4 + 5) | Situs yang butuh variasi tanpa kehilangan sistem | Kaya, sulit ditiru |
| **Van de Graaf** | Konstruksi diagonal buku klasik, margin asimetris | Section editorial hening | Klasik, mahal |

### 3A. Berapa kolom sebenarnya

| Kolom | Kegunaan | Catatan |
|---|---|---|
| **2–3** | Editorial murni, situs teks | Paling "print", paling tenang |
| **4** | Portfolio, halaman proyek | Cukup untuk asimetri, cukup sederhana |
| **6** | **Sweet spot editorial web** | Habis dibagi 2 dan 3 → fleksibel |
| **8** | Editorial padat, majalah | Mulai butuh disiplin |
| **12** | Default industri | Fleksibel tapi generik — mudah terlihat seperti Bootstrap |
| **> 12** | Hampir selalu salah | Kolom jadi terlalu sempit untuk dipakai tunggal |

**Rekomendasi untuk portfolio ini: 6 kolom desktop.** Alasan: habis dibagi 2 dan 3, cukup
kasar untuk menghasilkan blok besar yang terasa editorial, dan tidak pernah terbaca sebagai
grid framework.

### 3B. Compound grid — cara mendapat variasi tanpa kekacauan

Tumpuk grid 4-kolom dan 5-kolom di atas area yang sama. Garis-garisnya menghasilkan
**9 posisi berbeda**, sehingga layout bisa berubah drastis antar section sambil tetap
berbagi sistem.

```css
.compound {
  display: grid;
  grid-template-columns:
    [c4-1] 1fr [c5-1] 0.25fr [c4-2] 0.75fr [c5-2] 0.5fr
    [c4-3] 0.5fr [c5-3] 0.75fr [c4-4] 0.25fr [c5-4] 1fr [end];
  gap: 0 var(--gutter);
}
```

Section A memakai garis `c4-*`, section B memakai `c5-*`. Hasilnya terasa berbeda tapi
diam-diam masih satu sistem — persis kebutuhan "adjacent sections MUST differ".

---

## 4. Kesalahan Umum

| # | Kesalahan | Kenapa fatal | Perbaikan |
|---|---|---|---|
| 1 | Memilih jumlah kolom sebelum menentukan measure | Grid tidak melayani teks | Ikuti urutan §1 |
| 2 | Terlalu banyak kolom (12+ di situs editorial) | Setiap kolom terlalu sempit, akhirnya selalu di-span → grid tidak berfungsi | Turunkan ke 6 |
| 3 | Gutter berubah-ubah per section | Sistem tidak terbaca | Satu nilai gutter untuk seluruh situs |
| 4 | Margin dianggap sisa | Margin adalah bingkai; bingkai yang goyah merusak semuanya | Margin = kelipatan gutter |
| 5 | Konten diletakkan di dalam gutter | Merusak alignment optis | Konten hanya di kolom |
| 6 | Grid hanya horizontal, vertikal dibiarkan bebas | Section terasa mengambang | Tambahkan flowline / baseline |
| 7 | Padding section identik di semua section | Ritme mati (BANNED di profil taste) | Ritme padat/lapang bergantian |
| 8 | Melanggar grid tanpa pernah menegakkannya | Terbaca berantakan, bukan berani | Tegakkan minimal 2 section dulu |
| 9 | Grid berubah total antar breakpoint | Identitas hilang di mobile | Kurangi kolom (6 → 4 → 2), jangan ganti sistem |
| 10 | Tidak ada elemen yang pernah full-bleed | Halaman terasa terkurung | Minimal satu elemen menembus margin per halaman |

---

## 5. Project Breakdown — Grid untuk Portfolio Ini

Diturunkan dengan urutan Müller-Brockmann, bukan dipilih dari selera.

### 5A. Angka

| Breakpoint | Margin | Kolom | Gutter | Lebar kolom (hitung) |
|---|---|---|---|---|
| ≥ 1440px | 96px | 6 | 24px | (1440 − 192 − 120) / 6 = **188px** |
| 1024–1439px | 64px | 6 | 24px | fluid |
| 768–1023px | 48px | 4 | 20px | fluid |
| 390–767px | 20px | 2 | 16px | fluid |

Margin `96px` = gutter `24px` × 4. Margin `48px` = gutter × 2. Semua turunan dari satu angka.

### 5B. Token CSS

```css
:root {
  --gutter: 16px;
  --margin: 20px;
  --columns: 2;
}

@media (min-width: 768px) {
  :root {
    --gutter: 20px;
    --margin: 48px;
    --columns: 4;
  }
}

@media (min-width: 1024px) {
  :root {
    --gutter: 24px;
    --margin: 64px;
    --columns: 6;
  }
}

@media (min-width: 1440px) {
  :root {
    --margin: 96px;
  }
}

.grid {
  display: grid;
  grid-template-columns: repeat(var(--columns), minmax(0, 1fr));
  column-gap: var(--gutter);
  padding-inline: var(--margin);
}
```

### 5C. Full-bleed di dalam grid

```css
.grid > .bleed {
  grid-column: 1 / -1;
  margin-inline: calc(var(--margin) * -1);
  width: calc(100% + var(--margin) * 2);
}
```

### 5D. Peta penempatan per section

| Section | Kolom yang dipakai | Alasan |
|---|---|---|
| Hero masthead | 1 / -1, flush ke margin kiri | Monumental, edge-anchored |
| Meta row hero | 1–2 dan 5–6 (kosong di tengah) | Ketegangan counter-position |
| About / manifesto | 2–5 (manuscript di dalam column grid) | Hening, measure terjaga |
| Project index | modular 6 × n, tiap baris tinggi sama | Sistematis, arsip |
| Statement / CTA | 1 / -1 full-bleed | Pemecah ritme |
| Footer | 1–2 (kontak), 5–6 (index), baris kedua full-bleed marquee | Cermin hero |

---

## 6. Bonus — Baseline Grid

Baseline grid adalah **ritme vertikal**: setiap baris teks jatuh pada kelipatan satu unit
yang sama. Ini yang membuat halaman terasa "tercetak" alih-alih "di-layout".

### 6A. Menentukan unit baseline

Unit baseline = line-height body copy, dibulatkan ke angka yang enak dibagi.

```
body 18px × line-height 1.3 = 23.4px  →  unit baseline = 24px
```

Lalu **semua** line-height dan spacing vertikal harus kelipatan 24 (atau setengahnya, 12).

| Tier | font-size | line-height (rasio) | line-height (px) | Kelipatan |
|---|---|---|---|---|
| Display 4 | 272px | 0.882 | 240px | 10 × 24 |
| Display 2 | 104px | 0.923 | 96px | 4 × 24 |
| Display 1 | 64px | 0.75 | 48px | 2 × 24 |
| Statement | 40px | 1.2 | 48px | 2 × 24 |
| Lead | 24px | 1.5 | 36px | 1.5 × 24 |
| Body | 18px | 1.333 | 24px | 1 × 24 |
| Label | 12px | 1.0 | 12px | 0.5 × 24 |

Perhatikan: rasio line-height jadi angka "aneh" (0.882, 0.923) — itu **benar**. Yang dikunci
adalah nilai piksel akhirnya, bukan rasionya.

### 6B. Implementasi

```css
:root {
  --baseline: 24px;
}

.rhythm > * {
  margin-block-start: 0;
  margin-block-end: var(--baseline);
}

.rhythm > h2 {
  margin-block-start: calc(var(--baseline) * 3);
  margin-block-end: var(--baseline);
}

.rhythm > blockquote {
  margin-block: calc(var(--baseline) * 2);
}
```

### 6C. Debug overlay — wajib dipakai saat menyetel

```css
.debug-baseline::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    rgb(255 0 90 / 0.35) 0,
    rgb(255 0 90 / 0.35) 1px,
    transparent 1px,
    transparent var(--baseline)
  );
}
```

Aktifkan dengan menambahkan class `debug-baseline` di `<body>` via DevTools. **Jangan pernah
di-commit dalam keadaan aktif.**

### 6D. Masalah half-leading, dan `text-box-trim`

Setiap font punya ruang ekstra di atas dan di bawah glyph (leading internal). Akibatnya
heading tidak pernah benar-benar rata dengan kotak yang membungkusnya — inilah kenapa
alignment yang "matematis benar" tetap terlihat meleset.

CSS modern menyediakan `text-box-trim` / `text-box-edge` untuk memangkasnya ke cap-height
dan baseline:

```css
.masthead {
  text-box: trim-both cap alphabetic;
}
```

**Status dukungan: Limited Availability — BUKAN Baseline.** Praktis hanya Chromium yang
mendukung; Firefox dan Safari belum. Karena itu perlakukan sebagai *progressive enhancement*
dan tetap sediakan kompensasi manual:

```css
.masthead {
  margin-block-start: -0.14em;
}

@supports (text-box: trim-both cap alphabetic) {
  .masthead {
    margin-block-start: 0;
    text-box: trim-both cap alphabetic;
  }
}
```

Nilai `-0.14em` adalah pendekatan untuk font ber-cap-height ~0.72em. Ukur ulang per font
dengan membandingkan cap-height terhadap tepi atas kotak di DevTools.

### 6E. Kapan baseline grid boleh dilonggarkan

Baseline ketat mahal untuk dipelihara di layout responsif. Praktik industri: **pertahankan
sistem kelipatannya, longgarkan snapping piksel-sempurna.** Artinya:

- WAJIB kelipatan: margin/padding vertikal antar blok
- WAJIB kelipatan: line-height semua tier teks
- BOLEH longgar: elemen media, canvas WebGL, elemen absolute/overlay
- BOLEH longgar: section yang memang dirancang "melayang" (hero full-viewport)

---

## Checklist verifikasi grid

- [ ] Angka grid diturunkan dari measure body, bukan dipilih duluan
- [ ] Satu nilai gutter untuk seluruh situs
- [ ] Margin = kelipatan gutter
- [ ] Tidak ada konten di dalam gutter
- [ ] Minimal satu elemen full-bleed per halaman
- [ ] Ritme padding section bergantian padat/lapang — tidak identik
- [ ] Jumlah kolom berkurang bertahap di breakpoint (6 → 4 → 2), sistem tidak berganti
- [ ] Semua line-height dan margin vertikal kelipatan `--baseline`
- [ ] Overlay debug baseline sudah dicek dan dimatikan sebelum commit
- [ ] Minimal 2 section menegakkan grid ketat sebelum ada section yang melanggarnya

---

## Sumber

- [Grid Systems in Graphic Design — Josef Müller-Brockmann (ringkasan)](https://superbook.ai/books/grid-systems-in-graphic-design/review)
- [GRIDS by Obys — 4 tipe grid interaktif](https://grids.obys.agency/)
- [MDN — text-box / text-box-trim / text-box-edge](https://developer.mozilla.org/en-US/docs/Web/CSS/text-box)
- [Grid Maker Pro — Baseline grid & vertical rhythm](https://gridmakerpro.com/grids/typography-grids/baseline-grid/)
- [Ramotion — Website grid design types & elements](https://www.ramotion.com/blog/website-grid-design/)
