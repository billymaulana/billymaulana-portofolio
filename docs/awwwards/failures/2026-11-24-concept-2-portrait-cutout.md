---
type: failure
slug: concept-2-portrait-cutout
date: 2026-11-24
route: /explore/concept/2
concept: Rute hero salinan /hero/hero-3 dengan satu potret termal di panggung tengah; empat pilihan foto lewat ?photo= (bawaan IMG_6094 tiga-perempat)
verdict: "bagaimana jika photo itu sebagai background, dan perbaiki photo saya karna tidak enak di lihat cuttingnya. dan tidak terlihat menyatu di hero"
severity: iterate
style_attempted: [thermal, portrait-cutout]
fonts_used: [Bebas Neue, Satoshi]
technique_level: 3
screenshot: assets/2026-11-24-concept-2-portrait-cutout-desktop.jpg
rule_added: "Potret di hero adalah foto utuh sebagai latar: siluet asli dipertahankan dan dipotong oleh tepi viewport, bukan oleh topeng. Cacat matte diperbaiki di matte, bukan dengan membuang bagian sosok."
---

# Concept 2 rute hero — potret terbaca tempelan

Bukti: `assets/2026-11-24-concept-2-portrait-cutout-desktop.jpg` (bawaan, 1440×900),
`assets/2026-11-24-concept-2-portrait-cutout-mobile.jpg` (390×844), dan
`assets/2026-11-24-concept-2-portrait-cutout-options.jpg` (empat pilihan foto yang dibandingkan Billy).

## 1. Kutipan verbatim

> "bagaimana jika photo itu sebagai background, dan perbaiki photo saya karna tidak enak di lihat cuttingnya. dan tidak terlihat menyatu di hero"

## 2. Apa yang dibangun

Salinan `/hero/hero-3` dengan satu potret termal di panggung antara nav dan footer. Potret disimpan sebagai peta suhu dan
dilukis ke texture konten fluida. Tiga dari empat pilihan foto dipotong dengan topeng elips wajah, lalu dipudarkan di atas
(maksimal 56 px) dan di leher. Ground di sekelilingnya hitam rata `#050507`.

## 3. Diagnosis

Adjective decoder §7C belum punya baris untuk dua frasa ini; barisnya ditambahkan bersama catatan ini. Terukur pada frame
yang dinilai (1440×900):

| Dimensi | Terukur | Arti |
|---|---|---|
| Luas sosok terhadap frame | 5,6–11,0% (bawaan 8,1%) | 89–94% frame adalah hitam rata; sosok terbaca pulau |
| Tepi frame yang disentuh sosok | 0 dari 4 (bawaan 310×523 px, mulai y 340) | tidak ada pemotongan fotografis, hanya potongan topeng |
| Siluet asli yang tersisa | 0% — rambut (22,5% frame foto, separuh luas orang) dan badan dibuang | garis luar yang terlihat 100% buatan: elips + fade |
| Pertemuan huruf–sosok | 0 px tinta masthead di atas sosok | nama dan potret menempati zona terpisah |
| Hubungan nada sosok–ground | ground satu nilai, tanpa cahaya/suhu bersama | "tidak menyatu" |

- **"Cutting tidak enak dilihat" = garis luar buatan.** Topeng elips saya pasang untuk menyembunyikan bercak di tepi matte
  rambut IMG_6094 dan garis bahu swafoto. Itu menambal cacat matte dengan membuang ciri Billy yang paling kuat (rambut).
  Hasilnya topeng wajah mengambang.
- **"Tidak menyatu" = pulau di ground rata.** Sosok tidak menyentuh tepi frame, tidak berbagi nada dengan ground, dan tidak
  pernah bertemu huruf. Kritikus rute sudah menulis "sosok desktop berskala tengah" dan "84–86% puncak kepala terhapus
  fade"; saya membesarkan kotak panas tetapi tetap memperlakukan potret sebagai objek di panggung.
- **Semua gate teknis hijau** (audit 9 viewport, kontras 5,36:1, 60 fps). Gate itu mengukur teks dan performa; tidak ada
  yang mengukur apakah gambar dan halaman satu komposisi.
- **Prediksi `pick:c` meleset.** Billy tidak memilih satu pun dari empat foto; masalahnya perlakuan, bukan pilihan foto.

## 4. Tes yang gagal

NEIGHBOR lolos, OBJECT lolos (wajah Billy), SWAP lolos. Yang gagal EMPTY: bila potret dihapus, halaman tidak kehilangan
struktur apa pun — bukti bahwa potret menumpang, bukan bagian dari komposisi.

## 5. Sinyal taste

- Billy membayangkan fotonya sebagai **latar hero**, bukan objek di tengah panggung.
- Potongan (cutout) yang terlihat sebagai potongan ia tolak; ia menilai tepi sosok, bukan hanya wajah.
- "Menyatu" adalah syarat tersendiri: gambar dan tata letak harus terbaca satu komposisi.
- Perlakuan termal, layout hero-3, dan interaksi tidak ia singgung.

## 6. Rule baru

- Potret di hero adalah **foto utuh sebagai latar**: siluet asli (rambut, bahu) dipertahankan dan dipotong oleh tepi
  viewport, bukan oleh topeng elips atau fade pendek. Ground berbagi suhu dengan sosok.
- Cacat matte diperbaiki di matte. Membuang bagian sosok untuk menyembunyikan cacat dilarang.
- Sebelum presentasi potret: ukur kontak sosok dengan tepi frame, luas sosok terhadap frame, dan porsi garis luar yang
  berasal dari anatomi. Syarat awal "≥ 2 tepi tersentuh" diganti setelah arahan di §7: di layar lebar rambut harus utuh
  di dalam frame, sehingga yang diukur adalah kontak tepi bawah (≥ 15% lebar) dan pertemuan dengan huruf nama.

## 7. Arahan lanjutan (saat perbaikan berjalan)

> "di foto yang di edit saya ingin rambut saya terlihat di background hitam."

Rambut menjadi syarat tersendiri: seluruh massa rambut terbaca di atas ground hitam sampai helai terluar, dan ground tetap
hitam (tanpa kabut ambien). Ukuran yang dipakai: porsi luas matte rambut dengan ΔE ≥ 12 terhadap ground.

