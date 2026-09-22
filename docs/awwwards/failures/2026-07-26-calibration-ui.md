---
type: failure
slug: calibration-ui
date: 2026-07-26
route: /calibration
concept: Sesi kalibrasi A/B typography — instrumen pengukuran taste
verdict: "typography masih terlihat biasa saja, dan ui calibration juga jelek."
severity: rejected
style_attempted: [swiss, editorial, minimalism]
fonts_used: [Inter, Clash Display, Switzer, Satoshi, Bebas Neue, PP Editorial New, JetBrains Mono]
technique_level: 1
screenshot: assets/2026-07-26-calibration-ui-desktop.png
rule_added: "Alat internal (halaman kalibrasi, debug, dashboard) TETAP tunduk pada 5 tes anti-slop."
---

# SESI KALIBRASI A/B — ditolak

## 1. Kutipan verbatim

> "typography masih terlihat biasa saja, dan ui calibration juga jelek."

Dua penolakan terpisah dalam satu kalimat: **spesimen tipografinya** dan **UI alatnya**.

## 2. Apa yang dibangun

Route `/calibration` — halaman sesi A/B untuk mengumpulkan preferensi tipografi Billy sebagai
dataset berlabel.

| Aspek | Angka |
| --- | --- |
| Struktur | dua panel identik berdampingan, `grid-template-columns: 1fr 1fr`, gap 16px |
| Panel | `border: 1px solid rgb(255 255 255 / 0.12)`, background `#0a0a0a` |
| Spesimen | label mono 12px uppercase tracking 0.08em → masthead `clamp(2.5rem, 15cqw, 9rem)` → body 18px → label mono foot |
| Kontrol | 3 tombol kotak 72px teks mono uppercase + input teks |
| Aksen | `#0047ff` pada nomor progress, border terpilih, dan label sisi |
| Teknik | CSS statis murni — **Level 1** pada hierarki anti-slop |
| Motion | tidak ada, kecuali `transition: border-color 0.4s` |
| Pasangan | 8, masing-masing berbeda pada satu dimensi |

Hasil sesi: **5 dari 8 pasangan di-skip (62.5%)**, 3 dijawab.

## 3. Diagnosis jujur

Lewat adjective decoder (`../references/editorial/03-art-direction.md` §7C):

**"biasa saja"** → tiga baris decoder aktif sekaligus:
- (a) **NEIGHBOR TEST gagal** — panel A dan B punya struktur, border, padding, dan hierarki yang
  identik. Satu-satunya pembeda adalah nilai CSS tipografi. Secara komposisi, halaman ini adalah
  satu pola yang diulang dua kali.
- (b) **Tidak ada elemen non-teks yang bisa ditunjuk** — nol.
- (c) **Satu teknik saja** — CSS statis, Level 1. Tidak ada shader, tidak ada material,
  tidak ada respons terhadap velocity.

**"jelek"** pada UI → mengulang pola yang **sudah ditolak sembilan hari sebelumnya**.
Rule 2026-07-25 di `../anti-slop-rules.md` berbunyi: *"Mega-type kondensat berat di atas hitam +
label mono kecil = kombinasi yang Billy sebut 'AI slop'."* Spesimen yang saya bangun adalah
persis konfigurasi itu: masthead besar di atas `#0a0a0a`, diapit dua label mono uppercase
ber-tracking lebar. Saya membaca rule itu di sesi yang sama saat menulisnya, lalu melanggarnya
di file berikutnya.

Kesalahan struktural yang lebih dalam: **saya membangun instrumen untuk mengukur taste, tapi
membangun instrumennya sendiri tanpa taste.** Saya memperlakukan `/calibration` sebagai
"alat internal, tidak dinilai" — asumsi itu tidak pernah dinyatakan Billy dan tidak ada dasarnya.

Konsekuensi teknisnya bukan sekadar estetika: **kalau spesimennya jelek, datanya tidak berarti.**
Skip 62.5% bukan keraguan Billy — itu tanda bahwa dua varian yang disodorkan sama-sama tidak
cukup menarik untuk dipilih salah satunya. Perbandingan hanya menghasilkan sinyal kalau minimal
satu sisi layak dipilih.

Saya tidak bisa menyalahkan brief: Billy tidak pernah mengecualikan alat internal dari standar.

## 4. Tes yang gagal

| Tes | Hasil | Alasan |
| --- | --- | --- |
| OBJECT | **GAGAL** | Tidak ada satu pun elemen visual non-teks di seluruh halaman |
| SWAP | **GAGAL** | Ganti "billy maulana" dengan nama lain — tampilan identik |
| EMPTY | **GAGAL** | Hapus semua teks → tersisa dua kotak berborder |
| WOW | **GAGAL** | Tidak ada momen yang menahan perhatian |
| NEIGHBOR | **GAGAL** | Panel A dan B identik strukturnya; itu justru disengaja, dan itulah kesalahannya |

**5 dari 5 gagal.** Ini skor terburuk yang tercatat di folder ini.

## 5. Sinyal taste yang didapat

Tiga jawaban yang tidak di-skip tetap membawa informasi:

| Dimensi | Pilihan Billy | Status aturan |
| --- | --- | --- |
| Tracking display | **A — longgar −0.015em** (aturan memprediksi −0.045em) | **CONTRADICTED** |
| Rasio display:body | **B — ekstrem 16×** | CONFIRMED |
| Kelas typeface display | **B — neo-grotesque** (bukan serif editorial) | CONFIRMED |

**Temuan baru #1**: tabel tracking di `editorial/01` §3C **terlalu rapat**. Pada ~144px Billy
memilih −0.015em, bukan −0.045em. Rentang di `taste-lint` ikut terlalu ketat. Perlu dilonggarkan —
tapi satu data point dari spesimen yang ditolak bukan bukti kuat; wajib diuji ulang dengan
spesimen yang layak.

**Temuan baru #2**: skala ekstrem dan neo-grotesque **terkonfirmasi**. Dua aturan ini bertahan.

**Temuan baru #3 (paling penting)**: alat internal tunduk pada standar yang sama. Instrumen
pengukur taste yang dibuat tanpa taste menghasilkan data yang tidak bisa dipercaya — bukan hanya
tampilan yang buruk.

## 6. Rule baru

- Alat internal (halaman kalibrasi, debug view, dashboard, playground) TETAP tunduk pada 5 tes
  anti-slop. Instrumen yang dipakai untuk menilai taste harus sendiri lolos standar taste,
  kalau tidak datanya tidak bisa dipercaya.
- Skip rate > 30% dalam sesi kalibrasi = kegagalan desain instrumen, bukan keraguan Billy.
- Spesimen tipografi DILARANG berupa mega-type di atas kotak polos yang diapit label mono
  uppercase — itu konfigurasi yang sudah ditolak 2026-07-25, berlaku juga di alat internal.
- Perbandingan A/B hanya sah kalau minimal satu sisi layak dipilih.
