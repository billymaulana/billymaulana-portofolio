---
type: editorial-lesson
lesson: 4
title: Hierarchy, Spacing & Balance
updated: 2026-07-26
covers: [importance of hierarchy, ways of creating hierarchy, spacing for structure, whitespace and balance, page flow, scale, project breakdown]
prereq: 03-art-direction
---

# Lesson 4 — Hierarchy, Spacing & Balance

> Melengkapi `../visual-theory.md` §1 (8 faktor hierarchy) dan §8 (negative space).
> File ini mengisi yang belum ada: **hukum spacing**, **kurva ritme halaman**, dan
> **rumus keseimbangan asimetris** — semuanya dengan angka.

---

## 1. Kenapa Hierarki Adalah Yang Pertama

Hierarki menjawab satu pertanyaan: **mata melihat apa dulu, lalu apa, lalu apa.**

Kalau urutannya tidak diputuskan oleh desainer, urutan itu tetap terjadi — hanya saja
ditentukan secara acak oleh ukuran default dan urutan DOM. Halaman tanpa hierarki bukan
halaman netral; ia halaman dengan hierarki yang tidak disengaja.

### Tes hierarki — 3 detik, wajib dijalankan per section

1. **Squint test** — juling/blur 8px. Urutan apa yang muncul? Kalau semua muncul bersamaan
   atau tidak ada yang muncul → hierarki gagal.
2. **Grayscale test** — matikan warna. Hierarki masih terbaca? Kalau hilang, hierarki
   bergantung pada warna saja — terlalu rapuh.
3. **Tiga level test** — sebutkan elemen level 1, 2, dan 3. Kalau ada level yang berisi
   lebih dari dua elemen, level itu belum diputuskan.

**Aturan maksimum**: 3 level hierarki per layar. Level ke-4 tidak akan terbaca; ia hanya
menambah kebisingan.

---

## 2. Cara Menciptakan Hierarki

Ada tujuh alat. Yang membedakan pemula dan art director bukan tahu alatnya, tapi **berapa
banyak alat yang dipakai sekaligus dan seberapa ekstrem**.

| Alat | Lemah (jangan) | Cukup | Ekstrem (editorial premium) |
|---|---|---|---|
| **Ukuran** | 1.2× | 3× | **6–17×** |
| **Weight** | 400 vs 500 | 400 vs 700 | 300 vs 600 + lompatan ukuran |
| **Ruang** | margin sama | 2× | **4–8×** ruang di sekitar elemen utama |
| **Warna / nilai** | 80% vs 100% | 55% vs 100% | 35% vs 100% + satu aksen saturated |
| **Posisi** | semua flush-left | indent | counter-position, diagonal |
| **Case & style** | semua sentence | UPPERCASE label | UPPER tracked + italic serif accent |
| **Gerak** | fade seragam | stagger | urutan reveal = urutan hierarki |

**Hukum tiga alat**: setiap level hierarki wajib dibedakan oleh **minimal tiga alat sekaligus**.
Beda ukuran saja tidak cukup; beda ukuran + ruang + nilai warna baru terbaca sebagai keputusan.

### Kesalahan yang paling sering terjadi

Membuat elemen penting jadi besar, **tapi lupa memberinya ruang**. Elemen 272px yang dikelilingi
elemen lain pada jarak 24px tidak terbaca sebagai dominan — ia terbaca sebagai sesak. Ukuran
tanpa ruang bukan hierarki, hanya kebisingan yang lebih besar.

---

## 3. Spacing untuk Struktur

### 3A. Hukum spacing (yang paling sering dilanggar)

> **Ruang DI ANTARA grup harus lebih besar daripada ruang DI DALAM grup.**

Ini konsekuensi langsung dari prinsip Gestalt *proximity*. Rasio minimum yang bekerja:

| Hubungan | Rasio | Contoh nyata (baseline 24px) |
|---|---|---|
| Antar elemen dalam satu grup | 1× | 24px |
| Antar grup dalam satu blok | **2–3×** | 48–72px |
| Antar blok dalam satu section | **4–6×** | 96–144px |
| Antar section | **8–16×** | 192–384px |

Kalau judul dan paragrafnya berjarak 24px sementara paragraf dan judul berikutnya juga 24px,
pembaca tidak bisa tahu mana yang berpasangan. Ini kesalahan struktural, bukan estetik.

### 3B. Skala spacing yang mengikat ke baseline

```css
:root {
  --space-3xs: 4px;
  --space-2xs: 8px;
  --space-xs: 12px;
  --space-s: 24px;
  --space-m: 48px;
  --space-l: 72px;
  --space-xl: 120px;
  --space-2xl: 192px;
  --space-3xl: 288px;
}
```

Semua nilai kelipatan 4, dan semua nilai ≥ 24px kelipatan `--baseline` (24px), kecuali
`--space-l` (72px = 3×24 ✓) dan `--space-xl` (120px = 5×24 ✓). Diverifikasi: 24, 48, 72, 120,
192, 288 semuanya habis dibagi 24.

### 3C. Spacing responsif — fluid, bukan bertingkat

```css
:root {
  --space-section: clamp(6rem, 4rem + 10vw, 18rem);
  --space-block: clamp(3rem, 2rem + 5vw, 7.5rem);
  --space-group: clamp(1.5rem, 1.2rem + 1.5vw, 3rem);
}
```

`--space-section` bergerak 96px → 288px antara viewport 360px dan 1440px. Rasio spacing
tetap terjaga di seluruh rentang karena ketiganya memakai kurva yang sama.

### 3D. Padding section TIDAK boleh seragam

Ini BANNED di profil taste. Implementasi ritme:

```css
.section--dense { padding-block: var(--space-xl); }
.section--normal { padding-block: var(--space-2xl); }
.section--breathe { padding-block: var(--space-3xl); }
```

Urutan yang bekerja: `breathe → dense → normal → breathe → dense`. Jangan pernah dua section
`breathe` berturut-turut (halaman terasa kosong) atau dua `dense` berturut-turut (halaman
terasa sesak).

---

## 4. Whitespace dan Keseimbangan

### 4A. Dua jenis whitespace

| Jenis | Skala | Fungsi | Kalau kurang |
|---|---|---|---|
| **Macro** | Antar blok & section | Menciptakan mewah, memberi tekanan pada konten | Terasa murah, sesak, "template" |
| **Micro** | Antar huruf, baris, elemen kecil | Menciptakan keterbacaan dan kehalusan | Terasa amatir walau layout benar |

Sebagian besar portfolio gagal di **micro**. Macro relatif mudah (tambahkan padding); micro
menuntut tracking per tier, leading terkunci, dan optical alignment — pekerjaan Lesson 1.

### 4B. Whitespace sebagai elemen, bukan sisa

Whitespace jadi elemen desain ketika ia punya **bentuk yang bisa disebut**. Uji: bisakah
menunjuk area kosong dan menyebutnya "kolom kosong di sebelah kanan masthead" atau "jurang
horizontal sebelum statement"? Kalau area kosong hanya "sisa", ia belum jadi desain.

Teknik konkret:
- **Kolom sengaja dikosongkan** — di grid 6 kolom, isi 1–3 dan 5–6, biarkan 4 kosong permanen
- **Jurang vertikal** — satu jeda `--space-3xl` tunggal sebelum momen paling penting
- **Margin asimetris** — margin kiri 96px, margin kanan 192px; ketimpangan yang disengaja

### 4C. Keseimbangan — rumus bobot visual

Bobot visual sebuah elemen dapat diperkirakan:

```
bobot ≈ luas × kontras-terhadap-ground × (1 + faktor-warna) × (1 + faktor-gerak)
```

| Faktor | Nilai |
|---|---|
| kontras-terhadap-ground | 0 (sama) – 1 (maksimum) |
| faktor-warna | 0 untuk netral, 0.5 untuk aksen saturated |
| faktor-gerak | 0 untuk statis, 0.8 untuk bergerak terus-menerus |

Konsekuensi praktis: **elemen kecil yang bergerak dan berwarna dapat menyeimbangkan blok teks
raksasa yang diam.** Inilah mekanisme di balik komposisi asimetris yang tetap terasa stabil —
dan alasan mengapa satu aksen `#0047FF` kecil bisa mengimbangi masthead 272px.

### 4D. Tiga jenis keseimbangan

| Jenis | Kapan dipakai | Risiko |
|---|---|---|
| Simetris | Momen monumental tunggal (satu per halaman) | Membosankan kalau dipakai berulang; BANNED sebagai struktur utama |
| **Asimetris** | Default untuk seluruh situs | Butuh perhitungan bobot; asal-asalan = berantakan |
| Radial | Elemen tunggal (loader, cursor, orbit) | Jarang cocok untuk layout halaman |

---

## 5. Page Flow

Halaman bukan tumpukan section. Halaman adalah **kurva ketegangan** dari waktu ke waktu.

### 5A. Kurva ritme — struktur lima gerakan

| Momen | Section | Densitas | Amplitudo motion | Tujuan emosi |
|---|---|---|---|---|
| **1. Tarikan napas** | Hero | Sangat rendah | Tinggi (satu efek dominan) | Terdiam |
| **2. Tanah** | About / posisi | Sedang | Rendah | Orientasi, percaya |
| **3. Ledakan** | Statement / manifesto | Sangat rendah (satu kalimat raksasa) | Sangat tinggi | Terpukau |
| **4. Substansi** | Projects / index | Tinggi | Rendah–sedang | Bukti, kredibilitas |
| **5. Gema** | CTA + Footer | Rendah | Sedang (mencerminkan hero) | Ingatan, lingkar tertutup |

Kesalahan umum: menaruh amplitudo motion tinggi di **semua** section. Efeknya justru menghapus
puncak — kalau semua momen adalah puncak, tidak ada puncak.

### 5B. Aturan jeda

Setelah setiap momen amplitudo tinggi, wajib ada **satu section tenang**. Tanpa jeda, momen
berikutnya tidak akan terasa. Ini prinsip yang sama dengan pacing dalam film.

### 5C. Titik jangkar

Mata butuh sesuatu yang tetap saat scroll berjalan. Minimal satu elemen persisten:
nomor section, garis vertikal tipis, label sudut, atau progress. Elemen ini juga yang
memberi rasa "situs ini punya sistem".

### 5D. Lingkar tertutup

Footer harus mencerminkan hero — font yang sama, komposisi yang berkerabat, atau
pengulangan kalimat pembuka. Situs yang berputar terasa dirancang; situs yang berhenti terasa
kehabisan konten.

---

## 6. Scale

### 6A. Skala adalah alat hierarki paling kuat, dan paling jarang dipakai cukup jauh

Prinsip yang dikunci di profil taste: *If it doesn't feel too big, it's not big enough.*

Terjemahan terukurnya:

| Rasio display : body | Penilaian |
|---|---|
| < 3× | Aman, generik — gagal |
| 3–5× | Mulai terbaca, masih hati-hati |
| **5–10×** | Editorial premium |
| **10–20×** | Monumental, wilayah Awwwards |
| > 25× | Body copy jadi tidak terbaca — berlebihan |

Portfolio ini: 272px : 16px = **17×**.

### 6B. Skala butuh ruang, bukan hanya ukuran

Aturan pendamping: elemen berskala ekstrem harus punya ruang kosong **minimal 25% dari
tingginya sendiri** di sekitarnya. Masthead 272px → minimal 68px ruang bersih di atas dan
bawahnya sebelum elemen berikutnya. Tanpa itu, skala terbaca sebagai sesak.

### 6C. Skala di mobile

Kesalahan umum: mengecilkan display sampai jadi "aman" di mobile. Yang benar adalah
**mempertahankan rasio, mengurangi jumlah kata**. Masthead di mobile boleh 96px selama
body copy-nya 15px (rasio 6.4× — masih di zona premium) dan kalimatnya dipendekkan agar
tetap ≤ 3 baris.

---

## 7. Project Breakdown

Peta ritme untuk portfolio ini, siap dieksekusi:

| # | Section | padding-block | Densitas | Level hierarki | Bobot dominan |
|---|---|---|---|---|---|
| 1 | Hero | `--space-3xl` (288px) | breathe | Masthead 272px → meta 12px mono | Kiri-bawah (counter-position) |
| 2 | About | `--space-xl` (120px) | dense | Lead 28px → body 18px → label 12px | Kanan |
| 3 | Manifesto | `--space-3xl` (288px) | breathe | Satu kalimat 104px, tidak ada elemen lain | Tengah, simetris (satu-satunya) |
| 4 | Projects | `--space-2xl` (192px) | normal | Judul proyek 40px → meta 14px mono | Kiri, modular |
| 5 | CTA | `--space-xl` (120px) | dense | Statement 64px → link 18px | Kanan-bawah |
| 6 | Footer | `--space-2xl` (192px) | normal | Marquee 168px → kolom 14px | Full-bleed, mencerminkan hero |

Perhatikan urutan densitas: `breathe → dense → breathe → normal → dense → normal`.
Tidak ada dua yang sama berdampingan.

### Checklist verifikasi

- [ ] Setiap section lolos squint test dan grayscale test
- [ ] Maksimum 3 level hierarki per layar
- [ ] Setiap level dibedakan minimal 3 alat sekaligus
- [ ] Ruang antar grup ≥ 2× ruang dalam grup, di seluruh halaman
- [ ] Semua nilai spacing dari skala token, tidak ada angka liar
- [ ] Padding section bergantian — tidak ada dua densitas sama berdampingan
- [ ] Ada minimal satu area kosong yang bisa disebut namanya
- [ ] Amplitudo motion tinggi hanya di 2 section, masing-masing diikuti section tenang
- [ ] Ada elemen jangkar persisten sepanjang scroll
- [ ] Footer mencerminkan hero
- [ ] Rasio display : body ≥ 5× di semua breakpoint
- [ ] Elemen berskala ekstrem punya ruang bersih ≥ 25% tingginya

---

## Sumber

- [Fiveable — Magazine layout & editorial design (Art Direction)](https://fiveable.me/art-direction/unit-8/magazine-layout-editorial-design/study-guide/iDF75OIyIetSd5tj)
- [Composite — Scroll fatigue and the case for digital pacing](https://www.composite.global/news/scroll-fatigue-and-the-case-for-digital-pacing)
- `../visual-theory.md` §1 (8 faktor hierarchy), §5 (compositional balance), §8 (negative space)
