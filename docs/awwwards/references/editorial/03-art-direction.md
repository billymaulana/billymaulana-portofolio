---
type: editorial-lesson
lesson: 3
title: Art Direction
updated: 2026-07-26
covers: [what is art direction, information you need, competitors and audience, brand personality, brand values, typography colours images, eliminating subjective feedback]
prereq: 02-grid-fundamentals
---

# Lesson 3 — Art Direction

> Melengkapi `../visual-theory.md` §9 (yang hanya membahas art direction sebagai estetika).
> File ini membahas art direction sebagai **proses berulang yang menghasilkan keputusan
> dapat dipertahankan** — termasuk cara menghentikan loop revisi berbasis "kurang suka".

---

## 1. Apa Itu Art Direction

| Peran | Menjawab pertanyaan | Output |
|---|---|---|
| **Strategy / brand** | Kita ini siapa dan untuk siapa? | Positioning, values, audience |
| **Art direction** | **Seperti apa rasanya, dan kenapa begitu?** | Visual territory, rationale, aturan |
| **Design** | Bagaimana persisnya bentuknya? | Layout, komponen, spec |
| **Production** | Bagaimana membangunnya? | Kode, aset |

Art direction adalah **lapisan penerjemah**: mengubah kata (strategi, nilai, kepribadian)
menjadi keputusan visual yang bisa diperiksa. Bukan "membuat cantik" — melainkan **membuat
konsisten dan bermakna**.

Tes apakah art direction ada: tunjuk satu keputusan visual apa pun (warna, font, timing
easing) dan tanyakan "kenapa yang ini?". Kalau jawabannya "kelihatannya bagus", art direction
belum ada — yang ada baru dekorasi.

---

## 2. Informasi yang Dibutuhkan Sebelum Menyentuh Pixel

Intake yang tidak lengkap adalah penyebab nomor satu revisi tanpa ujung. Sembilan pertanyaan
di bawah wajib punya jawaban tertulis:

| # | Pertanyaan | Kalau tidak dijawab, yang rusak |
|---|---|---|
| 1 | Apa satu hal yang harus diingat orang setelah menutup tab? | Hierarki — semuanya jadi sama penting |
| 2 | Siapa yang melihat, dalam konteks apa? | Ukuran, densitas, ritme |
| 3 | Tindakan apa yang diharapkan setelah melihat? | Struktur CTA, page flow |
| 4 | Tiga kata sifat yang HARUS terasa? | Palet, typography, motion |
| 5 | Tiga kata sifat yang HARAM terasa? | Batas — ini lebih berguna daripada #4 |
| 6 | Siapa kompetitornya, dan bagaimana kita harus berbeda? | Diferensiasi |
| 7 | Aset apa yang sudah pasti ada (foto, video, 3D, tidak ada)? | Seluruh arah desain |
| 8 | Batas teknis dan waktu? | Level teknik yang realistis |
| 9 | Siapa yang mengambil keputusan akhir? | Siapa yang boleh bilang "selesai" |

**Untuk project ini, jawabannya dikunci di `../../personal-taste-profile.md`.** Pertanyaan 4
dan 5 dijawab oleh mood taxonomy (lihat Lesson 5 §4).

---

## 3. Kompetitor dan Audiens

### 3A. Analisis kompetitor — untuk BERBEDA, bukan untuk meniru

Ambil 5–7 situs sejenis. Untuk masing-masing catat hanya empat hal:

| Kolom | Isi |
|---|---|
| Ground | hex background dominan |
| Type | famili display + ukuran hero (px) |
| Gerak utama | satu teknik motion paling menonjol |
| Rasa | satu kata |

Lalu petakan ke sumbu. Kalau 6 dari 7 kompetitor mendarat di kuadran yang sama, **jangan
mendarat di sana**. Ruang kosong pada peta adalah peluang diferensiasi — dan itu argumen
objektif, bukan selera.

Untuk portfolio Frontend Architect, kompetitornya adalah portfolio developer lain di Awwwards.
Pola dominan mereka (terverifikasi dari `../library/` dan submission Awwwards): ground gelap +
mega-type sans + satu efek WebGL. **Artinya ground gelap + mega-type saja bukan lagi
diferensiasi** — itu sudah jadi baseline kategori. Diferensiasi harus datang dari lapisan lain:
kepadatan editorial, ritme antar section, atau material.

### 3B. Audiens — tiga lapis, prioritas berbeda

| Lapis | Siapa | Yang mereka nilai | Waktu perhatian |
|---|---|---|---|
| **Juri Awwwards** | Developer + designer jury | Kebaruan teknik, craft, konsistensi sistem | 30–90 detik |
| **Klien / recruiter** | Non-teknis | Kejelasan, bukti hasil, kredibilitas | 10–20 detik |
| **Peer developer** | Teknis | Kualitas implementasi, performa | Menit, membuka DevTools |

Konflik nyata: juri menghargai friksi dan misteri; recruiter menghukumnya. Resolusi yang
dipakai di project ini sudah ditulis di profil taste: **experience-centric avant-garde** —
juri diprioritaskan, tapi jalur cepat ke fakta (nama, peran, tahun pengalaman, kontak) tetap
harus ada dalam satu layar dari mana pun.

---

## 4. Brand Personality

Kepribadian adalah **bagaimana sesuatu terasa kalau ia manusia**. Cara paling berguna
mengukurnya bukan daftar kata sifat, melainkan **slider** — karena slider memaksa keputusan,
sedangkan daftar kata sifat memungkinkan semua dipilih sekaligus.

### 4A. Delapan slider

Isi posisi 1–5. Nilai 3 dilarang untuk lebih dari dua slider — netral di mana-mana artinya
tidak ada kepribadian.

| Slider | 1 | 5 | Portfolio ini |
|---|---|---|---|
| Klasik ↔ Kontemporer | Klasik | Kontemporer | **5** |
| Tenang ↔ Lantang | Tenang | Lantang | **2** (tenang, lalu meledak) |
| Ramah ↔ Berjarak | Ramah | Berjarak | **4** |
| Rapi ↔ Kasar | Rapi | Kasar | **2** (kasar hanya sebagai pelanggaran terencana) |
| Massal ↔ Elite | Massal | Elite | **5** |
| Hangat ↔ Dingin | Hangat | Dingin | **4** |
| Serius ↔ Jenaka | Serius | Jenaka | **2** |
| Statis ↔ Kinetik | Statis | Kinetik | **5** |

Profil di atas diturunkan dari verdict verbatim di `../library/`: "terasa mahal", "premium",
"membuat user terdiam lalu terpukau", "brutalist tapi berkelas".

### 4B. Dari slider ke keputusan

Slider tidak berguna kalau tidak diterjemahkan. Tabel penerjemah:

| Slider tinggi | Konsekuensi typography | Konsekuensi warna | Konsekuensi motion |
|---|---|---|---|
| Kontemporer (5) | Variable font, tracking negatif ekstrem | Ground non-netral, OKLCH | Scroll-scrub, physics |
| Tenang (2) | Ukuran ekstrem tapi sedikit elemen | Rentang nilai sempit, aksen langka | Durasi panjang, easing `expo.inOut` |
| Berjarak (4) | Uppercase, tracking lebar pada label | Kontras tinggi, sedikit warna | Delay sebelum respons, tidak "melayani" |
| Elite (5) | Font berlisensi/langka, detail micro-typography | Palet terbatas ≤ 5 warna | Tidak ada bounce, tidak ada elastic |
| Dingin (4) | Neo-grotesque, geometri | Suhu biru/abu, warm-black bukan hitam murni | Linear-ish constant velocity di layer atmosfer |
| Kinetik (5) | Teks sebagai material yang bisa terdistorsi | Warna lahir dari interaksi | Minimal satu efek merespons **velocity** |

**Baris terakhir kolom paling kanan adalah aturan wajib** di `../../anti-slop-rules.md`.

---

## 5. Brand Values

Values berbeda dari personality: personality = bagaimana terasa, values = **apa yang
dipertaruhkan**. Values berguna karena bisa dipakai untuk **menolak ide bagus yang tidak
sesuai**.

Tiga values untuk portfolio ini, masing-masing dengan konsekuensi desain yang bisa diperiksa:

| Value | Artinya | Konsekuensi yang mengikat |
|---|---|---|
| **Craft over volume** | Sedikit tapi dikerjakan sampai detail terakhir | Lebih baik 4 section sempurna daripada 9 section rata-rata. Micro-typography wajib. |
| **Engineering as material** | Kode adalah bahan seni, bukan alat | Minimal satu shader/WebGL yang tidak bisa ditiru dengan CSS. Efek harus JADI konten, bukan overlay. |
| **Restraint before spectacle** | Hening dulu, ledakan kemudian | Hero tidak boleh menampilkan seluruh perbendaharaan trik. Aksen warna baru muncul saat interaksi. |

Cara memakainya: setiap ide baru diuji ke tiga values. Ide yang melanggar satu value **ditolak
walaupun bagus**. Ini adalah mekanisme yang mencegah portfolio jadi tumpukan demo.

---

## 6. Typography, Warna, dan Gambar sebagai Turunan

Kesalahan paling umum: memilih font/warna lebih dulu, lalu mencari alasan. Urutannya harus
terbalik.

### 6A. Jalur turunan

```
Values + Personality slider
        ↓
Visual territory (3 kata sifat + 3 anti-kata-sifat)
        ↓
Moodboard 12–20 gambar (bukan 60)
        ↓
Design tokens: type scale · palet · grid · motion token
        ↓
Layout
```

### 6B. Moodboard yang benar

| Aturan | Alasan |
|---|---|
| 12–20 gambar, tidak lebih | Board besar = tidak ada keputusan yang diambil |
| Minimal 40% dari luar web design | Arsitektur, cetak, film, produk — mencegah rekursi tren |
| Setiap gambar diberi anotasi satu kalimat: **apa** yang diambil | Tanpa anotasi, board hanya "vibes" |
| Sertakan 2–3 gambar **anti-referensi** | Batas lebih informatif daripada arah |
| Board harus punya suhu warna yang bisa disebut | Kalau tidak bisa disebut hangat/dingin, board belum jadi |

Untuk project ini, moodboard sudah ada dalam bentuk terstruktur: `../library/` dengan 12 entri
beranotasi lima dimensi. **Itu lebih kuat daripada moodboard biasa** karena setiap entri punya
angka dan verdict verbatim.

### 6C. Gambar dan aset

Aturan yang mengikat di project ini (dari profil taste): **anti-video-heavy**. Karena itu
"art direction gambar" di sini berarti:

1. Material sintetis (glass, chrome, liquid) yang **dihasilkan**, bukan footage
2. Objek line-art / SVG / Lottie sebagai aksen editorial (pola `quantumbody`)
3. Tipografi itu sendiri diperlakukan sebagai citra

Uji: **hapus semua video dan foto. Masih ada karya?** Kalau tidak, art direction-nya bertumpu
pada aset, bukan pada desain.

---

## 7. Menghilangkan Feedback Subjektif

Ini bagian paling praktis. Loop "buat → 'kurang suka' → buat lagi" adalah kegagalan proses,
bukan kegagalan bakat.

### 7A. Tiga penyebab feedback subjektif

1. **Tidak ada kriteria yang disepakati sebelum kerja** → penilaian jatuh ke selera hari itu
2. **Feedback diminta pada tingkat yang salah** → menanyakan "bagaimana menurutmu?" atas
   seluruh halaman mengundang reaksi menyeluruh, bukan koreksi spesifik
3. **Kata sifat tidak diterjemahkan** → "terasa murah" tidak pernah jadi angka

### 7B. Kontrak sebelum kerja

Sebelum membangun, sepakati tiga hal tertulis:

```
1. Tiga kata sifat WAJIB terasa       → ...
2. Tiga kata sifat HARAM terasa       → ...
3. Tiga referensi + apa persisnya yang diambil dari masing-masing
```

Setelah build selesai, evaluasi **hanya terhadap tiga hal itu**. Feedback di luar kontrak
diperlakukan sebagai perubahan brief, bukan sebagai koreksi.

### 7C. Adjective decoder — mengubah kata sifat jadi angka

Ini kamus kerja untuk project ini. Dibangun dari verdict verbatim Billy di `../library/`
dan `../../failures/`.

| Kata sifat | Dimensi terukur yang sebenarnya dimaksud |
|---|---|
| **"Terasa mahal / premium"** | (a) rentang nilai warna sempit, ≤ 5 warna; (b) durasi motion ≥ 0.8s dengan `expo.inOut`; (c) tracking negatif konsisten per tier; (d) tidak ada bounce/elastic; (e) micro-typography dikerjakan |
| **"AI slop"** | (a) teknik Level 0–1 sebagai visual utama; (b) pasangan font tanpa kontras skeleton; (c) metadata tentang implementasi sendiri dijadikan konten; (d) simetri sempurna tanpa pelanggaran; (e) efek sebagai overlay, bukan konten |
| **"Biasa saja"** | (a) NEIGHBOR TEST gagal — section tidak berbeda dari tetangganya; (b) tidak ada elemen non-teks yang bisa ditunjuk; (c) satu teknik saja per section |
| **"Tidak harmoni"** | (a) x-height dua font berbeda > 15%; (b) leading tidak dikunci per tier; (c) suhu warna campur tanpa sistem; (d) motion CSS dan motion WebGL punya easing berbeda |
| **"Monoton"** | (a) padding section identik; (b) ritme padat/lapang tidak bergantian; (c) teknik visual sama diulang |
| **"Terlalu clean"** | (a) tidak ada planned imperfection; (b) tidak ada grain/noise; (c) grid tidak pernah dilanggar |
| **"Mepet"** | (a) margin < 4× gutter di desktop; (b) measure > 75ch; (c) tidak ada whitespace yang berfungsi sebagai elemen |

Cara memakainya: begitu muncul kata sifat, **jangan langsung memperbaiki**. Terjemahkan dulu
ke baris tabel, periksa mana yang benar-benar gagal, baru perbaiki yang itu. Ini mencegah
"perbaikan" yang mengubah hal-hal yang sebenarnya sudah benar.

### 7D. Meminta feedback pada tingkat yang benar

| Tingkat | Pertanyaan yang tepat | Pertanyaan yang salah |
|---|---|---|
| Territory | "Board mana yang lebih dekat ke arah yang kamu maksud, A atau B?" | "Suka yang ini?" |
| Sistem | "Skala tipografi ini terasa cukup ekstrem atau belum?" | "Bagaimana menurutmu?" |
| Section | "Section ini terasa berbeda dari yang di atasnya?" | "Sudah bagus?" |
| Detail | "Timing 0.9s ini terlalu lambat atau pas?" | "Ada yang kurang?" |

Selalu sertakan **dua opsi dengan tradeoff yang dijelaskan**, bukan satu opsi untuk disetujui.
Membandingkan menghasilkan feedback yang jauh lebih spesifik daripada menilai.

### 7E. Anotasi rasional

Setiap presentasi hasil wajib menyertakan alasan singkat untuk keputusan besar:

```
Masthead 272px / Bebas Neue / tracking −0.04em
→ slider "Elite 5" + "Kinetik 5"; ukuran diambil dari batas display scale,
  tracking mengikuti tabel ambang ≥160px.
```

Anotasi mengubah percakapan dari "suka/tidak suka" menjadi "premisnya benar/tidak benar" —
dan premis bisa didiskusikan secara objektif.

### 7F. Hubungan dengan Rejection Protocol

Project ini sudah punya **Rejection Protocol** di `CLAUDE.md` (screenshot → failure note →
diagnosis → rule baru → index). Adjective decoder §7C adalah **langkah 3 (diagnosis)** yang
selama ini paling sering dikerjakan asal-asalan. Mulai sekarang: setiap failure note wajib
menyebutkan baris decoder mana yang gagal, dengan angkanya.

---

## Checklist art direction

- [ ] Sembilan pertanyaan intake §2 punya jawaban tertulis
- [ ] Peta kompetitor dibuat, kuadran yang dihindari disebutkan
- [ ] Delapan slider diisi, maksimal dua slider bernilai 3
- [ ] Tiga values ditulis beserta konsekuensi mengikatnya
- [ ] Moodboard 12–20 gambar, ≥ 40% dari luar web design, semua beranotasi
- [ ] Ada 2–3 anti-referensi
- [ ] Setiap keputusan besar punya satu kalimat rasional
- [ ] Kontrak tiga-kata-sifat disepakati sebelum build
- [ ] Uji "hapus semua video/foto — masih ada karya?" lolos

---

## Sumber

- [Awwwards Academy — From Poster to Screen: Designing Editorial Based Websites (Cuchillo)](https://www.awwwards.com/academy/course/from-poster-to-screen-designing-editorial-based-websites)
- [Think Bold Studio — Why you should create a mood board for your design brief](https://thinkboldstudio.com/resources/insights/why-you-should-create-a-mood-board-for-your-design-brief)
- [Bookmarkify — How to use moodboards to improve creative feedback](https://www.bookmarkify.io/blog/how-to-use-moodboards-to-improve-creative-feedback)
- `../../failures/INDEX.md` — sumber verdict verbatim untuk adjective decoder
