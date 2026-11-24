---
type: failure
slug: concept-2-backdrop-pasted
date: 2026-11-24
route: /explore/concept/2
concept: Rute hero salinan /hero/hero-3 dengan foto IMG_6094 utuh sebagai latar termal di ground hitam; nama di depan rambut; tinta fluida menggeser dan memanaskan foto
verdict: "saat ini masih terasa bahwa foto saya hanya seperti tempelan saja dan feels imersive dan lain lainnya tidak berasa"
severity: iterate
style_attempted: [thermal, portrait-backdrop]
fonts_used: [Bebas Neue, Satoshi]
technique_level: 3
screenshot: assets/2026-11-24-concept-2-backdrop-pasted-desktop.jpg
rule_added: "Foto menyatu lewat cahaya bersama, lapisan, dan elemen — bukan lewat ukuran. Sosok di ground hitam rata dengan kontur terang penuh tetap terbaca tempelan."
---

# Concept 2 rute hero — foto utuh pun masih tempelan

Bukti: `assets/2026-11-24-concept-2-backdrop-pasted-desktop.jpg` (1440×900 diam),
`assets/2026-11-24-concept-2-backdrop-pasted-mobile.jpg` (390×844), dan
`assets/2026-11-24-concept-2-backdrop-pasted-active.jpg` (tinta melintas di wajah). Billy menilai rute hidup di
`localhost:3000` sebelum presentasi resmi dan sebelum skor kritikus keluar.

## 1. Kutipan verbatim

> "entah mungkin saya perlu background images yang cocok untuk photo saya agar blend di hero dan effect ketika liquid mengenai foto saya. saat ini masih terasa bahwa foto saya hanya seperti tempelan saja dan feels imersive dan lain lainnya tidak berasa. mungkin juga perlu beberapa elemen. coba lihat ini terlihat menyatu di hero: [Image #7] [Image #8] [Image #9]. saya suka effect ini: [Image #10] [Image #11] [Image #12]."

Gambar yang ia tunjuk, semuanya dari `reference style concept/`:

| Label | Berkas | Yang ia katakan |
|---|---|---|
| #7 | `layout/60492ae0b8a27ec96a9951e2ccdb1b19.jpg` (siluet bertopi di bidang abu-toska, "MULTIVERSE") | "terlihat menyatu di hero" |
| #8 | `layout/eff1e953ded24dc3c9ac9893c1ac7315.jpg` (sosok berhoodie di depan glow oranye, "KONTOUR") | "terlihat menyatu di hero" |
| #9 | `layout/f06d38d934b05c21e1fc8c9cc4072cd3.jpg` (duotone merah, tangan ke kamera, "MAKEITPAY") | "terlihat menyatu di hero" |
| #10 | `effect/853dd5412880bf9a8c43805439b80ada.jpg` (wajah termal bersapuan horizontal, "FUTURE") | "saya suka effect ini" |
| #11 | `effect/20179c79d837d2d9da0f08fb1b159d1c.jpg` (potret hitam-putih bersapuan garis) | "saya suka effect ini" |
| #12 | `effect/ad72ee3e1708f0cfabe504354f8d4d08.jpg` (wajah termal lunak, "GRIND" terisi warna gambar) | "saya suka effect ini" |

## 2. Apa yang dibangun

Foto IMG_6094 utuh dipetakan ke suhu dan dilukis sebagai latar hero di atas ground `#060610`. Rambut violet bertekstur,
wajah oranye–kuning, kaus navy. Nama dilukis di depan rambut (knock-out). Tata letak, teks, dan fluida identik hero-3.
Efek tinta pada foto: geser `0,0007 × kecepatan` dan tambahan suhu.

## 3. Diagnosis

Memakai baris "Tidak menyatu" di adjective decoder §7C (ditambah pagi ini) dan ukuran pada tiga hero yang ia tunjuk.

| Dimensi | Rute ini | Hero yang ia tunjuk |
|---|---|---|
| Porsi hitam di frame | 61,3% (foto saja) | #7 15,2% · #8 67,8% · #9 1,6% |
| Cahaya latar yang juga jatuh di sosok | tidak ada: ground satu nilai, sosok menyala sendiri di seluruh konturnya | #8 glow oranye di belakang sosok + rim di wajah dan hoodie; #7 dan #9 bidang berwarna yang menjadi cahaya sosok |
| Tepi sosok | kontur terang penuh, 95–100% luas rambut ΔE ≥ 12 terhadap ground | sisi gelap sosok larut ke ground, sisi terang menyatu dengan glow |
| Kedalaman huruf–sosok | huruf di depan, sosok rata di belakang | #8 dan #9 sosok di depan huruf raksasa; #7 huruf melintas di depan badan |
| Elemen selain foto dan teks hero-3 | 0 | #8 kartu + dua statistik + tombol; #9 kurung, garis titik, tanda ®, bilah; #7 empat blok teks + tanda |
| Uji EMPTY (hapus foto) | struktur halaman tidak berubah satu piksel pun di luar foto | teks dan elemen disusun mengelilingi sosok |
| Bahasa efek saat tinta mengenai foto | geser halus + panas | #10 dan #11 sapuan horizontal bergaris, #12 kabur lunak berbutir |

- **Porsi hitam bukan sebabnya.** Hero #8 lebih hitam (67,8%) daripada rute ini (61,3%) dan tetap menyatu. Pagi ini saya
  menjawab "tidak menyatu" dengan memperbesar sosok dan mempertahankan siluet aslinya; itu menjawab "cutting", tidak
  menjawab "menyatu".
- **Sosok menyala sendiri di semua tepinya.** Rambut saya naikkan sampai terbaca di seluruh kontur (arahan rambut), sehingga
  sosok menjadi bentuk terang berbatas penuh di atas hitam: persis rupa stiker. Tidak ada sumber cahaya di adegan yang
  menjelaskan kenapa ia terang.
- **Tata letak tidak pernah menanggapi foto.** Selain kantong di balik teks, tidak ada satu elemen pun yang berubah karena
  ada foto. Itu arti "tempelan".
- **Efek tinta pada foto tidak punya watak.** Ia sudah menunjukkan sapuan bergaris ini di putaran 2
  (`round-2/effect-direction.md`); yang saya pasang hanya geser 0,0007 dan panas.
- **Semua gate teknis hijau lagi** (audit 9 viewport, kontras, 60 fps). Tidak satu pun mengukur cahaya bersama, kedalaman,
  atau jumlah elemen.

## 4. Tes yang gagal

EMPTY gagal (lihat tabel). WOW gagal menurut kata Billy sendiri: "feels imersive … tidak berasa".

## 5. Sinyal taste

- "Menyatu" bagi Billy = foto berada di dalam adegan yang dirancang: ada latar yang cocok, elemen, dan huruf yang berlapis
  dengan sosok. Ukuran dan siluet asli saja tidak cukup.
- Ia terbuka pada latar selain hitam rata ("background images yang cocok"), selama rambutnya tetap terbaca.
- Ia meminta elemen. Folder `reference style concept/element/` berisi tanda grafis (kurung, garis, globe kawat, pita
  barcode, lencana), `background/` dan `texture/` berisi bentuk cair lunak, gradien berbutir, dan riak halftone.
- Efek yang ia sukai pada wajah: sapuan horizontal bergaris dan kabur lunak berbutir, muncul saat tinta mengenai foto.

## 6. Rule baru

- Foto menyatu lewat **cahaya bersama, lapisan, dan elemen**: latar punya sumber cahaya atau bidang yang juga jatuh di
  sosok, huruf dan sosok berlapis, dan ada elemen yang disusun mengelilingi sosok. Sosok terang berbatas penuh di ground
  hitam rata dilarang walau sebesar apa pun.
- Sebelum presentasi, uji EMPTY dihitung: hapus foto, lalu bandingkan dengan rute asalnya; bila tidak ada elemen yang
  berubah, foto itu tempelan.
- Efek tinta pada foto memakai bahasa yang sudah ia tunjuk (sapuan horizontal bergaris), bukan geser generik.
