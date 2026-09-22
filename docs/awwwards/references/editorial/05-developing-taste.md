---
type: editorial-lesson
lesson: 5
title: Developing Design Taste
updated: 2026-07-26
covers: [what taste is, taste gap, three practices, reference filter, mood taxonomy, taste as a queryable system, weekly loop]
prereq: 04-hierarchy-spacing-balance
---

# Lesson 5 — Developing Design Taste

> Ini lesson yang mengikat empat lesson sebelumnya. Taste bukan lapisan di atas teknik —
> taste adalah **kemampuan memilih teknik mana yang dipakai, dan kapan berhenti**.

---

## 1. Apa Itu Taste (dan Apa yang Bukan)

| Taste BUKAN | Taste ADALAH |
|---|---|
| Preferensi pribadi | Naluri terlatih untuk mengenali apa yang mengangkat karya di atas "sekadar berfungsi" |
| Bawaan lahir | Hasil paparan terstruktur + analisis + repetisi |
| Selera yang tidak bisa didiskusikan | Penilaian yang bisa dijelaskan alasannya |
| Sama untuk semua orang | Spesifik dan konsisten dengan kepribadian pemiliknya |

Pembedanya: **orang bertaste bisa menjelaskan kenapa.** Kalau alasannya berhenti di "bagus
saja", itu preferensi, bukan taste.

---

## 2. Taste Gap

Ira Glass:

> "Semua yang mengerjakan karya kreatif masuk ke bidang ini karena punya taste yang bagus.
> Tapi ada jurang. Beberapa tahun pertama, karyamu belum bagus. Ia berusaha bagus, ia punya
> potensi, tapi belum. Sementara taste-mu — hal yang membuatmu masuk ke bidang ini — masih
> tajam. Dan taste-mu itulah alasan karyamu mengecewakanmu."

**Implikasi yang penting untuk project ini**: setiap kali muncul verdict "jelek" atau "AI slop",
itu adalah **taste yang berfungsi**, bukan kegagalan penilaian. Jurangnya nyata dan normal.
Yang menutupnya bukan mencari kata penghibur, melainkan volume + diagnosis.

Konsekuensi operasional:
- Penolakan **wajib** menghasilkan artefak (failure note + rule baru), bukan sekadar revisi.
  Tanpa artefak, jurang yang sama akan dilewati lagi.
- Self-assessment ("menurut saya ini bagus") tidak reliabel — sudah jadi rule di
  `../../anti-slop-rules.md`.

---

## 3. Tiga Praktik yang Terbukti

### 3A. Kelilingi diri dengan karya terbaik — secara terstruktur

Bukan scroll pasif. Aturannya:

| Aturan | Angka |
|---|---|
| Frekuensi | 3–5 situs baru per minggu, dianalisis penuh |
| Sumber non-web | ≥ 40% (arsitektur, cetak, film, produk, tipografi cetak) |
| Kedalaman | Lima dimensi wajib (lihat §3B), dengan angka |
| Penyimpanan | Satu file per referensi, bukan folder screenshot |

Sumber non-web itu penting: kalau referensi hanya dari web, hasilnya adalah rata-rata tren
web — yang secara definisi tidak bisa memenangkan penghargaan web.

### 3B. Analisis kenapa — lima dimensi wajib

Protokol ini sudah terpasang di `CLAUDE.md` (Reference Capture Protocol). Ringkasnya:

| Dimensi | Bukti yang harus ditulis |
|---|---|
| **Typography** | Nama font persis (dari `getComputedStyle`), weight, px/vw, tracking, leading |
| **Motion** | Teknik, durasi ms, easing (cubic-bezier/nama GSAP), stagger, trigger |
| **Visual effect** | Teknik + level pada hierarki anti-slop (shader? blend? mask? displacement?) |
| **Color** | Hex ground, hex aksen, blend mode, rasio dominan/sekunder/aksen |
| **Feels** | Apa yang dirasakan, dan **elemen mana** yang menghasilkannya |

Aturan tunggal: **kalau ada kata "smooth", "premium", "bagus" tanpa angka atau nama teknik di
sebelahnya — analisisnya belum selesai.**

### 3C. Praktik — dan jenis feedback yang benar

Volume menutup jurang, tapi hanya kalau ada koreksi. Tiga jenis latihan yang berbeda nilainya:

| Latihan | Nilai untuk taste |
|---|---|
| Membangun ulang satu section dari referensi, lalu membandingkan side-by-side | **Tertinggi** — kesalahan jadi terlihat, tidak bisa disangkal |
| Membangun sesuatu baru lalu meminta feedback spesifik | Tinggi |
| Membangun sesuatu baru tanpa feedback | Rendah — hanya mengulang kebiasaan |
| Membaca teori tanpa membangun | Nyaris nol |

---

## 4. Mood Taxonomy

Kosakata mood lama hanya punya 6 token (`premium, brutal, playful, calm, tense, luxurious`).
Itu terlalu kasar: `art-yakushev` dan `hashgraphvc` sama-sama tertulis "premium" padahal
rasanya sangat berbeda. Taxonomy di bawah memperluasnya menjadi **18 token dalam 4 keluarga**,
masing-masing dengan penanda terukur sehingga bisa diverifikasi, bukan ditebak.

### 4A. Keluarga Ketegangan — seberapa tegang ruangnya

| Token | Rasa | Penanda terukur |
|---|---|---|
| `calm` | Tenang, tidak menuntut | Rentang nilai warna sempit (< 30%), motion durasi ≥ 1.2s, whitespace > 50% layar |
| `tense` | Waspada, ada yang akan terjadi | Kontras tinggi, elemen terpotong tepi viewport, motion dengan delay sebelum respons |
| `austere` | Hening, disiplin, nyaris keras | ≤ 3 warna, tidak ada dekorasi, grid ketat tanpa pelanggaran, mono label |
| `serene` | Damai, terbuka, lega | Ground terang hangat, leading longgar (≥ 1.5 pada body), gerak konstan lambat |

### 4B. Keluarga Status — seberapa mahal terasanya

| Token | Rasa | Penanda terukur |
|---|---|---|
| `premium` | Dikerjakan dengan craft, tidak murah | ≤ 5 warna, easing `expo`/`power4`, micro-typography dikerjakan, tanpa bounce |
| `luxurious` | Mewah, langka, eksklusif | Material reflektif/refraktif, ruang berlebih, tempo lambat, font berlisensi |
| `clinical` | Presisi dingin, laboratorium | Mono untuk data, angka `tabular-nums`, garis hairline 1px, palet netral + satu aksen |
| `raw` | Sengaja tidak dipoles | Grain terlihat, tepi kasar, grid dilanggar, tipografi mentah |

### 4C. Keluarga Energi — seberapa banyak yang terjadi

| Token | Rasa | Penanda terukur |
|---|---|---|
| `kinetic` | Bergerak terus, hidup | Motion tidak pernah benar-benar berhenti; velocity-driven |
| `brutal` | Kasar, langsung, menabrak | Mega-type, blok padat, kontras maksimum, transisi keras |
| `playful` | Ringan, mengundang main | Respons langsung ke input, elemen bisa diseret/dilempar |
| `monumental` | Raksasa, arsitektural | Rasio display:body ≥ 10×, satu elemen mengisi > 60% viewport |
| `energetic` | Cepat, optimis | Stagger rapat (≤ 0.03s), durasi pendek (≤ 0.5s), aksen saturated |

### 4D. Keluarga Atmosfer — dunia apa ini

| Token | Rasa | Penanda terukur |
|---|---|---|
| `cinematic` | Seperti film | Letterbox/framing, grain, depth-of-field, cut sebagai transisi |
| `mystic` | Misterius, ritual, tidak semua dijelaskan | Informasi ditahan, simbol/geometri, gelap dengan sumber cahaya tunggal |
| `organic` | Cair, tumbuh, alami | Bentuk non-geometris, noise/curl, tidak ada sudut tajam |
| `nostalgic` | Analog, punya masa lalu | CRT/scanline, grain film, warna ter-degradasi, tipografi periode |
| `surreal` | Janggal, seperti mimpi | Skala tidak masuk akal, fisika salah dengan sengaja |

### 4E. Anti-mood — haram di project ini

| Token | Penanda | Sumber penolakan |
|---|---|---|
| `corporate` | Ground netral tanpa suhu, tipografi aman, stock imagery | "sterile/corporate" — `taste-dna.md` |
| `sterile` | Bersih tanpa satu pun imperfection, tanpa grain | "terlalu clean, tidak dapat wow effect" |
| `cute` | Bentuk membulat, warna pastel, bounce | Pastel BANNED di profil taste |
| `sporty` | Diagonal dinamis, warna neon high-energy generik | "kesannya terlalu sporty" (rise2.studio) |
| `template` | Struktur yang bisa dipindah ke brand lain tanpa perubahan | SWAP TEST |

### 4F. Cara memakai taxonomy

1. **Saat capture referensi** — isi `mood[]` dengan 2–3 token, bukan satu. Kombinasi jauh
   lebih informatif: `[premium, austere, monumental]` menjelaskan `oharchitecture` dengan
   presisi yang tidak dicapai oleh `premium` saja.
2. **Saat brief section** — tulis mood target sebelum membangun. Setelah selesai, cek
   penanda terukurnya satu per satu.
3. **Saat menilai** — kalau mood yang keluar tidak sama dengan mood target, sebutkan penanda
   mana yang meleset. Ini mengubah "kurang pas" menjadi koreksi yang bisa dikerjakan.

### 4G. Mood target per section untuk portfolio ini

| Section | Mood target | Anti-mood yang diawasi |
|---|---|---|
| Preloader | `[cinematic, mystic]` | `template` |
| Hero | `[monumental, austere, kinetic]` | `sterile` |
| About | `[premium, clinical]` | `corporate` |
| Manifesto | `[austere, monumental]` | `sterile` |
| Projects | `[clinical, premium]` | `template` |
| CTA | `[tense, brutal]` | `corporate` |
| Footer | `[cinematic, calm]` | `template` |

Perhatikan tidak ada dua section berturut-turut dengan mood identik — konsekuensi langsung
dari aturan NEIGHBOR TEST.

---

## 5. Filter Referensi — Tiga Pertanyaan

Tidak semua yang menarik layak masuk library. Saring dengan tiga pertanyaan:

| Filter | Pertanyaan | Kalau gagal |
|---|---|---|
| **Spark** | Apakah ini benar-benar menghentikan saya? | Buang — "lumayan" mencemari library |
| **Strength** | Masih menarik setelah 7 hari? | Simpan sebagai partial, jangan jadi benchmark |
| **Service** | Melayani arah yang sedang dikerjakan? | Simpan, tapi tandai sebagai arah alternatif |

Library yang terlalu besar sama tidak bergunanya dengan library kosong. **Pangkas berkala**:
setiap 20 entri baru, tinjau ulang dan turunkan yang tidak lagi memenuhi *strength* menjadi
partial.

---

## 6. Taste sebagai Sistem yang Bisa Di-query

Keunggulan project ini dibanding "punya taste yang bagus": taste-nya **terkodifikasi**.

| Artefak | Peran | Kapan dibaca |
|---|---|---|
| `../library/` + `INDEX.md` | Bukti positif — apa yang disukai dan kenapa | Sebelum memilih arah |
| `../../failures/` + `INDEX.md` | Bukti negatif — apa yang sudah ditolak | Sebelum memilih font/teknik |
| `../../anti-slop-rules.md` | Aturan append-only dari kegagalan nyata | Setiap awal job visual |
| `../../personal-taste-profile.md` | Sumber kanonik | Sebelum keputusan desain apa pun |
| `../../scripts/taste-query.mjs` | Query terprogram atas library — mis. `node docs/awwwards/scripts/taste-query.mjs --mood=austere` | Saat butuh referensi dengan kriteria tertentu |

**Nilai sesungguhnya ada di bukti negatif.** Daftar hal yang sudah ditolak lebih jarang
dimiliki orang daripada daftar hal yang disukai — dan justru itu yang mempersempit ruang
pencarian dengan cepat.

---

## 7. Loop Mingguan

| Hari | Kegiatan | Output |
|---|---|---|
| Senin | Capture 2 referensi baru, analisis 5 dimensi | 2 file di `../library/` |
| Selasa–Kamis | Bangun satu section penuh | Kode + screenshot |
| Jumat | Review: squint, grayscale, 5 tes anti-slop, cek mood target | Verdict + failure note bila ditolak |
| Sabtu | Rebuild satu section referensi, bandingkan side-by-side | Catatan selisih |
| Minggu | Pangkas library, update `INDEX.md`, append rule baru | Sistem terbarui |

Yang membuat loop ini bekerja bukan volumenya, melainkan **hari Jumat dan Sabtu** — dua hari
yang secara eksplisit berisi konfrontasi dengan selisih antara niat dan hasil.

---

## Checklist taste

- [ ] Minimal 3 referensi baru per minggu, dianalisis lima dimensi dengan angka
- [ ] ≥ 40% referensi dari luar web design
- [ ] Setiap referensi punya verdict verbatim, bukan parafrase
- [ ] `mood[]` diisi 2–3 token dari taxonomy §4, bukan satu
- [ ] Setiap penolakan menghasilkan failure note + rule baru
- [ ] Library dipangkas setiap 20 entri baru
- [ ] Mood target ditulis SEBELUM membangun, diverifikasi SESUDAH
- [ ] Tidak ada dua section berdampingan dengan mood identik

---

## Sumber

- [Emil Kowalski — Developing Taste](https://emilkowal.ski/ui/developing-taste)
- [Readymag — How to train your taste](https://blog.readymag.com/how-to-train-your-taste/)
- [Vanseo Design — Taste/skill gap (Ira Glass)](https://vanseodesign.com/web-design/taste-skill-gap/)
- `../../personal-taste-profile.md` — sumber kanonik taste project ini
