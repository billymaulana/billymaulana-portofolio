---
type: failure
slug: concept-2-colour-portraits
date: 2026-11-25
route: /explore/concept/2
concept: Empat foto edit Billy (frontal, latar hitam) dalam warna asli sebagai bawaan; foto yang sama sebagai suhu di `?v=a`; shader latar dicabut
verdict: "jadikan ini default /explore/concept/2?v=a dan hapus yang lain dan coba tambah opsi juga jika foto ini: [Image #13] dan ini [Image #14], namun tanpa filter fulu saya ingin foto tanpa filter di edit dulu agar tonenya sesuai, dan foto saya yang /explore/concept/2?v=a yang di filter toolong buat enak di lihat filternya sayya melihat di area dagu aneh, saya ingin gunakan dulu preset filter atau apapun agar kelas foto kualitas photography, dan jika terkena liquid saya ingin seperti ini:https://www.daspritam.in/ lihat foto chain-labs."
severity: iterate
style_attempted: [natural-colour-photo, thermal, liquid]
fonts_used: [Bebas Neue, Satoshi]
technique_level: 5
screenshot: assets/2026-11-25-concept-2-thermal-chin-desktop.jpg
rule_added: "Peta suhu wajah harus kontinu (tanpa garis kelas, tanpa lubang mata atau janggut); bila aturan terukur memihak salah satu pilihan, pilihan itu yang jadi bawaan; foto diolah sampai kelas fotografi sebelum difilter."
---

# Concept 2 rute hero — bawaan salah pilih, filter suhu aneh di dagu

Bukti: `assets/2026-11-25-concept-2-thermal-chin-desktop.jpg` (`?v=a`, diam, 1440×900),
`assets/2026-11-25-concept-2-thermal-chin-zoom.jpg` (wajah, 3×),
`assets/2026-11-25-concept-2-colour-default-desktop.jpg` (bawaan berwarna yang tidak dipilih).

## 1. Kutipan verbatim

> "jadikan ini default /explore/concept/2?v=a dan hapus yang lain dan coba tambah opsi juga jika foto ini: [Image #13] dan ini [Image #14], namun tanpa filter fulu saya ingin foto tanpa filter di edit dulu agar tonenya sesuai, dan foto saya yang /explore/concept/2?v=a yang di filter toolong buat enak di lihat filternya sayya melihat di area dagu aneh, saya ingin gunakan dulu preset filter atau apapun agar kelas foto kualitas photography, dan jika terkena liquid saya ingin seperti ini:https://www.daspritam.in/ lihat foto chain-labs."

Gambar #13 = `Gemini_Generated_Image_f649agf649agf649.jpeg` (frontal di gang bermural, jaket warna);
gambar #14 = `Gemini_Generated_Image_wl9v77wl9v77wl9v.jpeg` (tiga perempat di kamar, kaus abu).

## 2. Apa yang dibangun

- Bawaan: foto kente dalam warna asli di ground hitam; `?photo=dashiki|neon|block`; `?v=a` = sosok yang sama sebagai suhu.
- Peta suhu dari tiga kelas bertopeng (kulit, rambut, kain): suhu kulit dari luminansi, janggut dan kumis masuk kelas rambut.
- Saat tersentuh: suhu naik, sapuan horizontal bergaris, tinta 8% di atas kulit.

## 3. Diagnosis

**Bawaan salah pilih.** Saya menjadikan warna asli bawaan walau ukuran saya sendiri memihak `?v=a`
(tumpang-tindih hue diam↔sentuh 22–33% lawan 77–84%; lantai tertulis 70%) dan kritikus menilai `?v=a` lebih
tinggi. Saya membaca "coba jangan hitam putih" sebagai "tampilkan warna pakaian"; sosok termal sudah
memenuhinya. Aturan 2026-11-24 "sosok saat diam memakai ramp termal" saya kalahkan dengan tafsir.

**"Di area dagu aneh" — baris baru §7C "Filter aneh".** Suhu di sepanjang sumbu wajah, dari pangkal hidung
ke leher, tiap 10 baris plat: 0,82 · 0,85 · 0,72 · 0,55 · 0,67 · 0,71 · 0,60 · 0,45 · 0,62 · 0,46 · 0,55 ·
0,39 · 0,49 · 0,44 · **0,29 · 0,21** · 0,37 · 0,45 · 0,54 · 0,62 · 0,65. Janggut jatuh ke 0,21 di antara dagu
0,44 dan leher 0,62: lubang dingin berbentuk topeng. Di kiri-kanan, garis kumis memisahkan pipi 0,75+ (oranye)
dari wajah bawah 0,35–0,45 (violet) dalam beberapa piksel, sehingga separuh wajah terbaca seperti bertopeng.
Mata menjadi dua lubang violet. Penyebabnya topeng kelas yang keras dan suhu yang diambil mentah dari
luminansi: semua yang gelap di foto (janggut, alis, mata) menjadi dingin.

**"Kelas foto kualitas photography".** Sumber 912 px diperbesar ±1,8× di retina dan saya hanya menyetel titik
hitam dan kurva. Tidak ada retus, tidak ada pemahatan nada, tidak ada peningkatan resolusi.

**Efek sentuh.** Di daspritam.in foto tidak diwarnai ulang. Shader tampilannya menggeser koordinat foto oleh
medan cairan (`uv − fluid.rg × 0,001`) dan mengambil kanal hijau-biru dari koordinat lain
(`uv.x − fluid.x × 0,003`, `uv.y + fluid.y × 0,003`): piksel foto sendiri terseret, merah terpisah dari cyan.
Yang saya pasang (suhu naik + sapuan bergaris) adalah tafsir saya atas contoh lama, bukan efek ini.

## 4. Tes yang gagal

WOW menurut kata Billy untuk filter ("aneh"); tidak ada tes yang mengukur kontinuitas peta suhu.

## 5. Sinyal taste

- Sosok termal saat diam dipilih untuk kedua kalinya; warna asli pakaian bukan yang ia cari pada foto berlatar hitam.
- Foto tanpa filter ia inginkan dari foto yang punya lingkungan (gang, kamar), dengan nada disunting agar cocok.
- Filter dinilai seperti foto: harus enak dilihat, wajah utuh, kelas fotografi.
- Respons foto terhadap cairan: meleleh terseret dengan pisah kanal, seperti contoh yang ia tunjuk.

## 6. Rule baru

- Peta suhu wajah kontinu: tanpa garis kelas yang terbaca, janggut dan alis hanya sedikit lebih dingin, mata tidak
  menjadi lubang. Ukur suhu di sepanjang sumbu wajah sebelum presentasi; tidak boleh ada lompatan > 0,15 dalam
  10 baris di luar tepi anatomi (lubang hidung, garis bibir).
- Bila dua pilihan disajikan dan aturan terukur memihak salah satunya, yang memihak aturan menjadi bawaan.
- Foto diolah sampai kelas fotografi (resolusi, retus, nada) sebelum difilter atau dipasang.
- Efek yang Billy tunjuk dari situs bernama ditiru dulu rumusnya, baru disesuaikan.
