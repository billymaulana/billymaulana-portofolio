# Pola Eksekusi Tipografi — Diukur dari 104 Referensi

Dokumen ini merekam pola yang **diukur**, bukan diyakini. Setiap angka berasal dari
`getComputedStyle` pada situs hidup, tercatat di `library/<slug>.md`. Ditulis 2026-07-26 setelah
library tumbuh dari 12 → 144 entri.

Alasan dokumen ini ada: dua kali aturan di `anti-slop-rules.md` ternyata mendeskripsikan gejala
eksekusi buruk lalu keliru dinaikkan jadi hukum kategori (larangan font, larangan ground terang).
Pola di bawah dicatat dengan `n` dan sebarannya supaya kesalahan yang sama tidak terulang.

---

## 1. Tracking bukan fungsi monoton dari ukuran

Asumsi lama — "makin besar makin rapat" — **terbantah**. Kurvanya berbentuk U.

| Tier | n | median tracking | rentang | % memakai tracking 0 | median leading |
|---|---|---|---|---|---|
| ≥300px | 19 | **0** | −0.058 … +0.015 | **58%** | 0.91 |
| 160–299px | 53 | **−0.03** | −0.07 … 0 | 32% | 0.90 |
| 96–159px | 20 | −0.02 | −0.05 … 0 | 40% | 1.00 |
| 56–95px | 16 | 0 | −0.08 … +0.0075 | 44% | 1.00 |
| 32–55px | 5 | −0.01 | −0.048 … 0 | 40% | 1.00 |
| <32px | 2 | 0 | 0 … 0 | 100% | 1.50 |

**Titik terapat ada di 160–299px, lalu melonggar lagi di atas 300px.**

Sebabnya bisa dijelaskan: display ≥300px cenderung memakai famili yang metriknya memang
dirancang untuk ukuran display — Humane, Bdo Grotesk, Mango Grotesque, OT Jubilee Platinum,
Times, Instrument Serif — dan sudah rapat sejak awal. Tier 160–299px lebih sering memakai
grotesk **teks** (Neue Haas, Helvetica Now, Aeonik, Switzer) yang metriknya dirancang untuk
ukuran baca dan karena itu perlu dirapatkan saat dibesarkan.

Ini adalah *optical sizing* yang bekerja lewat pemilihan famili, bukan lewat sumbu `opsz`.

Konsekuensi: `taste-lint` dikalibrasi ulang 2026-07-26 dengan bucket ≥300px yang targetnya
netral. Kalibrasi sebelumnya menyamakan semua tier ≥160px di −0.03em dan akan menolak **11 dari
19** referensi tier ≥300px yang Billy sukai.

---

## 2. Tracking ditentukan famili × weight, bukan ukuran

Dua bukti terkuat berasal dari dua batch yang polanya berlawanan.

**Kelompok Aeonik (n=15, dikirim Billy 2026-07-26).** 11 dari 15 memakai weight **400**, 10 dari
15 memakai tracking **0**. Aeonik pada 216px (prime-exits) dan 432px (rocketair) sama-sama
bertracking nol.

**Kelompok Inter (n=31).** Weight dominan **700–900**, tracking −0.03 … −0.08em.

Famili yang sama persis, tier ukuran yang tumpang tindih, tetapi resep tracking-nya berkebalikan.
Yang membedakan adalah metrik bawaan famili dan weight yang dipilih — bukan ukuran.

**Bukti paling tajam:** `jeskojets` memakai tracking **−0.08em** (terapat di batch SOTD) pada
display berukuran hanya **72px**, karena familinya **GT America Extended**. Huruf yang sudah
dilebarkan butuh dirapatkan lebih agresif agar kata tetap terbaca sebagai satu unit. Sementara
`obsidianassembly` pada **460.8px** memakai tracking **0** karena familinya Didone berkontras
tinggi yang sudah punya jarak sisi sempit.

Aturan operasionalnya: **ukur familinya, jangan hitung dari ukurannya.**

---

## 3. Rasio display:body ≥5× hanya berlaku bila tipografi adalah subjek

Tiga entri melanggar aturan rasio dan tetap disukai Billy:

| Slug | rasio | display | konteks |
|---|---|---|---|
| `nikolamiselpuklin` | **1×** | 18px w900 | seluruh situs satu ukuran, 92 karakter total |
| `kvs` | **1.1×** | 16px SF Mono | 9 canvas WebGL memikul beban visual |
| `savage-studio` | 1.7× | 41px | — |

Polanya konsisten dengan tiga situs motion-driven di batch SOTD:

| Slug | display | catatan |
|---|---|---|
| `hashgraphvc` | 36px w700 | laut 3D + kristal ber-caustics (Three.js, 2 canvas) |
| `oryzo` | 40.8px w500 | 6 canvas naratif |
| `steven` | 51px w400 | 2 canvas Three.js |

**Ketiganya menahan display di bawah 60px.** Ketika layar dikuasai scene 3D, tipografi mundur
jadi keterangan foto — dan itu pilihan sah, bukan kegagalan hierarki.

Aturan yang benar: rasio ≥5× berlaku untuk halaman **yang tipografinya adalah subjek**. Untuk
halaman yang subjeknya 3D atau footage, yang wajib dijaga adalah kejelasan peran, bukan rasio.

---

## 4. Italic selektif sebagai alat penekanan

Tiga entri batch SOTD memakai italic bukan sebagai gaya blok, melainkan sebagai tekanan lokal:

- **`jasonbergh`** — per-**huruf**: kapital awal "J" dan "B" memakai `EditorialnewItalic`,
  sedangkan "ason" dan "ergh" tetap roman. Efeknya seperti swash pada manuskrip.
- **`aupalevodka`** — per-**kata**: "Born From The *Untouched* Wilderness." Satu kata italic di
  tengah kalimat roman, pada Instrument Serif 441px.
- **`dulcedo`** — per-**penomoran**: "One" / "Two" / "Three" ditulis sebagai kata dalam serif
  Didone italic di atas judul grotesk bold uppercase.

Ketiganya menaikkan tekanan **tanpa** menambah ukuran atau ketebalan. Ini teknik yang belum
pernah dipakai di repo.

---

## 5. Pasangan sefamili berbeda lebar > dua famili asing

Empat entri mendapat kontras tanpa menambah famili kedua:

| Slug | pasangan |
|---|---|
| `1820productions` | Suisse Int'l + Suisse Int'l **Condensed** |
| `wolverineworldwide` | ABC Diatype + ABC Diatype **Mono** |
| `jeskojets` | GT America **Extended** + GT America **Expanded** |
| `zeekr-ava` | Aeonik Pro + IBM Plex Mono (mono dari famili lain) |

Relevan langsung untuk aturan "≤2 famili teks": lebar dan mono dari satu famili menghitung
sebagai satu, dan menghasilkan kontras yang koheren karena metriknya sudah cocok.

---

## 6. Grid yang diperlihatkan, bukan disembunyikan

Tiga cara berbeda menjadikan struktur sebagai elemen visual:

- **`madeinevolve`** — garis kolom grid vertikal putih semi-transparan dibiarkan menembus
  tipografi 187px. Grid dan huruf jadi satu lapisan.
- **`jasonbergh` /about** — penggaris numerik (0 10 20 … 180) dalam Monument Grotesk Mono
  **7.2px** dicetak di tepi kiri dan kanan. Halaman terasa seperti instrumen ukur.
- **`studiodado`** — garis rule horizontal melintang penuh viewport; teks digantung tepat pada
  garis itu, dengan tiga label counter-positioned pada baris yang sama.

---

## 7. Solusi terhadap larangan "3-column card grid"

`dulcedo` section PROFILES tetap memakai tiga kartu, tapi lolos karena tiga keputusan:

1. **Di-stagger diagonal menurun** — kartu 2 mulai lebih rendah dari kartu 1, kartu 3 lebih
   rendah lagi. Tidak ada baris sejajar.
2. **Void internal besar** — judul menempel di atas kartu, paragraf didorong ke dasar, bagian
   tengah sengaja kosong.
3. **Tanpa radius, tanpa bayangan, tanpa garis tepi** — kartu dibedakan dari ground hanya lewat
   selisih luminance beberapa persen (`#F2F2F2` vs `#FFFFFF`).

Larangannya ternyata soal **kesejajaran dan kepadatan**, bukan soal jumlah tiga.

---

## 8. Media sebagai glyph

`adcker` menempatkan **video kecil di dalam tanda kurung** — `( ▣ )` — sejajar baseline dan
berskala sama dengan huruf di sekitarnya. Glyph `*` dan `( )` diperlakukan sebagai elemen
komposisi seukuran display.

Belum ada padanannya di library. Memenuhi kriteria "typography as visual material" tanpa shader.

---

## 9. Ground terang hangat: dikonfirmasi lagi

Revisi 2026-07-26 melonggarkan larangan ground terang. Batch SOTD menambah tiga bukti:

| Slug | ground | display |
|---|---|---|
| `obsidianassembly` | gradient cokelat → krem hangat | Didone 460.8px cream |
| `adcker` | krem `#EFEEEA` | grotesk 184.8px hitam |
| `dulcedo` | abu terang `#F2F2F2` | Helvetica Now 140px w300 |

Ketiganya SOTD, ketiganya disukai Billy. Yang membedakan dari "putih layar" adalah **suhu
warnanya hangat** dan groundnya dipakai penuh satu section, bukan sebagai kotak melayang.

---

## 10. Weight ringan pada ukuran besar

Refleks "besar harus tebal" tidak didukung data. Median weight display adalah **400–500**, dan
beberapa entri terkuat justru memakai weight sangat ringan pada ukuran sangat besar:

| Slug | display | weight |
|---|---|---|
| `jasonbergh` /about | 149.76px | **200** |
| `dulcedo` | 140px | **300** |
| `unesco-museum` | 112px | **300** |
| `veauly` | 360px | **300** |
| `silent-house` | 160px | **450** |

`silent-house` memakai weight **450** — nilai variabel non-standar, bukan regular maupun medium —
dan **sentence case**, melawan pola uppercase yang dominan di library.

---

## 11. Inter yang dieksekusi benar bisa menang SOTD

`unesco-museum` memenangkan SOTD memakai **Inter**: weight 300, tracking −0.05em, dipasangkan
dengan Unbounded sebagai display sekunder, rasio 7.0×, hanya 2 weight di seluruh situs.

Ini bukti langsung untuk pernyataan Billy: *"sebenernya font inter juga tidak masalah karna yang
penting font pairing dan typography seperti tracking line height font weight optical dan lain
lain"*. Gate berpindah dari identitas font ke eksekusinya.

---

## Yang masih belum diketahui

- **Klasifikasi serif vs grotesk belum bisa diotomatiskan.** Collector merekam famili dengan
  karakter terbanyak, yang biasanya famili **body**, bukan display. Statistik serif (n=3) tidak
  bisa dipercaya. Perlu collector yang merekam famili per-tier, bukan per-halaman.
- **Easing dan durasi belum diukur** untuk batch mana pun. Semua catatan motion di library masih
  berupa daftar library terdeteksi, bukan angka timing.
- **38 dari 144 entri** masih berformat lama tanpa blok `summary` terukur, sehingga tidak masuk
  statistik di atas.
