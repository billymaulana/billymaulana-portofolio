---
type: failure
slug: specimen-pair-01
date: 2026-07-26
route: /calibration
concept: Spesimen kalibrasi pasangan 01 — Inter dieksekusi disiplin vs Clash Display default
verdict: "kedua pilihan tersebut masih jelek."
severity: rejected
style_attempted: [swiss, editorial, minimalism]
fonts_used: [Inter, Clash Display, Switzer, JetBrains Mono]
technique_level: 5
screenshot: assets/2026-07-26-specimen-pair-01-desktop.png
rule_added: "Menaikkan level teknik dan memperbaiki angka tipografi TIDAK cukup — komposisi tipografi yang menentukan."
---

# SPESIMEN PASANGAN 01 — kedua varian ditolak

## 1. Kutipan verbatim

> "kedua pilihan tersebut masih jelek."

Billy langsung menyertakan solusinya: 11 URL contoh typography yang dinilai bagus, dikelompokkan
per font (Inter × 8, Clash × 1, Switzer × 1, PP Neue Montreal × 1).

## 2. Apa yang dibangun

Instrumen `/calibration` versi kedua (OPTICAL BENCH). Yang dinilai kali ini bukan UI-nya,
melainkan **spesimen tipografi di dalamnya**.

| Varian | Konfigurasi |
| --- | --- |
| A | Inter · display 92px · tracking −0.04em · leading 0.85 · weight 400 · lead 18px · label mono 11px +0.08em |
| B | Clash Display · display 92px · tracking 0 · leading 1.2 · weight 700 · lead 18px · label tanpa tracking |

Susunan keduanya identik: lead sebaris → masthead dua baris (BILLY / MAULANA) → hairline →
tiga baris proyek (nama · tahun · stack) dalam grid 3 kolom.

`taste-lint`: 14 pass · 1 fail. Rasio display:body 5.1×.

## 3. Diagnosis jujur

Lewat adjective decoder (`../references/editorial/03-art-direction.md` §7C), "jelek" pada
konteks tipografi mengarah ke baris **"tidak harmoni"** dan **"biasa saja"**:

- (a) **Susunan tipografinya generik.** Lead kecil di atas, masthead besar, garis, lalu daftar.
  Itu urutan paling default yang mungkin. Tidak ada counter-position, tidak ada ketegangan
  diagonal, tidak ada elemen yang keluar grid — padahal profil taste secara eksplisit menuntut
  "counter-positioned typography (diagonal tension)" dan "Swiss grid ketat lalu dilanggar sadar".
- (b) **Rasio 5.1× ada di batas bawah.** Aturan sendiri menargetkan 10–20×. Saya lolos gate
  dengan angka minimum, lalu memperlakukan lolos sebagai selesai.
- (c) **Hanya satu blok teks.** Tidak ada permainan ukuran di dalam satu komposisi — semua
  elemen sejajar kiri pada satu kolom. Tipografi editorial yang kuat memakai beberapa titik
  masuk, bukan satu tumpukan.
- (d) **Tidak ada yang diperlakukan sebagai material.** Teks hanya teks. Tidak ada blend,
  mask, atau interaksi antara tipografi dan field di belakangnya.

Kesalahan pola yang berulang: pada kegagalan sebelumnya saya menyimpulkan "instrumen harus
lolos standar taste", lalu menaikkan teknik ke Level 5 dan membenahi angka lint. **Keduanya
adalah perbaikan yang benar, tapi bukan yang menentukan.** Yang menentukan adalah komposisi
tipografi — dan itu tidak diperbaiki sama sekali; ia hanya dipindah dari dua panel ke satu panel.

Angka tracking/leading/weight yang benar hanya membuat tipografi **tidak salah**. Itu tidak
sama dengan membuatnya bagus.

## 4. Tes yang gagal

| Tes | Hasil | Alasan |
| --- | --- | --- |
| OBJECT | LOLOS | Field kontur WebGL hadir sebagai konten |
| SWAP | LOLOS | Konten proyek nyata ikut berubah bila identitas diganti |
| EMPTY | LOLOS | Field + hairline tetap berdiri |
| WOW | **GAGAL** | Susunan tipografi tidak menahan perhatian |
| NEIGHBOR | LOLOS | Tidak ada duplikasi struktur |

Satu gagal = belum selesai. Dan yang gagal justru satu-satunya tes yang mengukur daya tarik.

## 5. Sinyal taste yang didapat

**Terpenting**: Billy menolak *kedua* varian pada pasangan yang menguji "eksekusi vs identitas
font". Artinya pertanyaan pasangan 01 salah rumus — ia mengandaikan bahwa perbedaan eksekusi
angka sudah cukup untuk menghasilkan sesuatu yang layak dipilih. Ternyata tidak: **dua-duanya
bisa benar secara angka dan tetap jelek secara komposisi.**

Billy juga menegaskan ulang posisinya soal font lewat cara yang lebih kuat daripada pernyataan:
ia memberi **delapan** contoh Inter yang ia sebut bagus. Revisi 2026-07-26 (larangan font
berbasis identitas dicabut) diperkuat, bukan dibantah.

Sebelas referensi baru diberikan, dikelompokkan **per font** — bentuk pemberian yang belum
pernah terjadi. Ini menandakan yang ingin dipelajari adalah **bagaimana satu font tertentu
disusun**, bukan font mana yang dipilih.

## 6. Rule baru

- Menaikkan level teknik dan membenahi angka tipografi TIDAK cukup. Angka yang benar membuat
  tipografi tidak salah; komposisi yang membuatnya bagus. Setiap perbaikan setelah penolakan
  wajib menyentuh komposisi, bukan hanya token.
- Lolos `taste-lint` dengan angka di batas minimum (mis. rasio 5.1× terhadap ambang 5×) bukan
  lolos. Ambang adalah lantai, bukan target.
- Spesimen/komposisi tipografi DILARANG hanya berupa satu tumpukan rata kiri: lead → masthead →
  garis → daftar. Wajib ada minimal satu dari: counter-position, elemen keluar grid, dua titik
  masuk baca, atau tipografi yang diperlakukan sebagai material.
- Saat sebuah pasangan kalibrasi ditolak SELURUHNYA (bukan salah satu sisi), yang salah adalah
  rumusan pasangannya — bukan jawaban Billy. Rumuskan ulang, jangan minta memilih lagi.
