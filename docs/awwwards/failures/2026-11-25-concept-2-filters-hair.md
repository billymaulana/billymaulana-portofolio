---
type: failure
slug: concept-2-filters-hair
date: 2026-11-25
route: /explore/concept/2
concept: Enam foto edit Billy sebagai pilihan `?photo=` dengan empat filter `?filter=` (colour, grayscale, thermal, void); plat dibesarkan 2× Lanczos, matte RVM + kunci luminansi, tepi rambut alley memakai alpha plat lama
verdict: "Terlalu ungu filternya Tolong kualitas photographer, agar tetap layak bukan asal filter Disisi rambut jelek seperti rusak fotonya tolong buat agar hd dan tidak merusak kualitas"
severity: iterate
style_attempted: [thermal, void-pulse, grayscale, natural-colour-photo]
fonts_used: [Bebas Neue, Satoshi]
technique_level: 4
screenshot: assets/2026-11-25-concept-2-filters-hair-desktop.jpg
rule_added: "Filter atas foto dinilai sebagai foto: sumber diperbesar dengan model super-resolusi sampai ≥ 1× ukuran tampil di DPR 2 sebelum dipotong, detail foto tetap terbaca lewat filter, sosok tidak didominasi ungu, dan tepi rambut tidak lebih terang dari rambutnya."
---

# Concept 2 rute hero — filter terlalu ungu, tepi rambut seperti rusak

Bukti: `assets/2026-11-25-concept-2-filters-hair-desktop.jpg` (`?filter=void`, 1440×900, DPR 2),
`assets/2026-11-25-concept-2-filters-hair-thermal-desktop.jpg` (`?filter=thermal`),
`assets/2026-11-25-concept-2-filters-hair-colour-desktop.jpg` (bawaan berwarna),
`assets/2026-11-25-concept-2-filters-hair-zoom.jpg` (sisi kiri rambut, kiri warna, kanan void, 2×).

## 1. Kutipan verbatim

> "Terlalu ungu filternya
> Tolong kualitas photographer, agar tetap layak bukan asal filter
> Disisi rambut jelek seperti rusak fotonya tolong buat agar hd dan tidak merusak kualitas"

## 2. Apa yang dibangun

- Enam foto (896–912 px lebar) dibesarkan 2× dengan Lanczos menjadi plat 1792–1824 px. Tidak ada super-resolusi.
- Matte: Robust Video Matting pada plat 2×, ditambah kunci luminansi di zona rambut untuk latar terang. Tepi rambut alley
  memakai alpha yang diturunkan dari plat alley lama (smoothstep 0,10–0,55), sisanya alpha RVM.
- Peta suhu: kelas MediaPipe (kulit, rambut, kain) dengan suhu dinormalkan per kelas: kulit 0,50–0,96, rambut 0,20–0,62,
  kain 0,14–0,50; ramp termal concept 2. Void: garis 4 px, tekuk 40, duty 0,56, celah t − 0,24.

## 3. Diagnosis

Adjective decoder §7C, tiga baris:

**"Terlalu ungu" (baris baru).** Massa kroma sosok (HSV, S ≥ 0,35, V ≥ 0,12, berbobot kroma) di pita indigo–ungu
(hue 200–320):

| Frame | Indigo–ungu | Hangat (hue 330–70) |
|---|---|---|
| `?filter=void` (alley) | 91,2% | 8,2% |
| `?filter=thermal` (alley) | 87,3% | 11,9% |
| `?photo=kente&filter=void` | 89,6% | 8,6% |
| `?photo=room&filter=void` | 81,7% | 16,6% |
| kente termal (bawaan yang dulu dipilih) | 75,8% | 22,5% |
| concept 1 Void Pulse | 67,6% | 31,0% |
| `referensi/photo-effect/VoidPulse-1.jpg` | 62,3% | 33,0% |

Rambut dan kain (sekitar 70% luas sosok) saya petakan ke 0,14–0,62, yaitu C1–C4 ramp (indigo sampai ungu). Celah garis
void menurunkan separuh tiap siklus 0,24 lagi ke arah dingin. Hanya wajah yang hangat. Ini kedua kalinya ungu ditolak
pada foto (2026-11-24: "filter ungu terlalu tajam").

**"Kelas foto kualitas photography".** (a) Sumber terhadap ukuran tampil di DPR 2: sosok alley digambar 819 px CSS =
1638 px perangkat dari sumber 896 px, **0,55×**, angka yang sama dengan catatan pagi ini. Aturan "resolusi cukup untuk
DPR 2" saya langgar: plat 2× hasil Lanczos hanya menambah piksel, bukan detail. (b) Filter termal dan void mengganti nada
foto dengan peta suhu yang dihaluskan (kulit diblur σ 0,10 dan 0,018 unit wajah); helai rambut dan pori tidak terbawa,
sehingga hasilnya terbaca "filter", bukan foto. (c) Tanpa retus. (d) Grade hanya titik hitam + kurva S.

**"Cutting tidak enak dilihat", butir (c) tepi matte berhalo.** Profil luminansi melintang di sisi kiri rambut pada frame
bawaan: ground 12,7, pita tepi 28–41, rambut bagian dalam 16–20. Tepi rambut dua kali lebih terang dari rambutnya
sendiri. Penyebab: alpha yang diturunkan dari plat lama membawa sisa latar mural (garis coklat vertikal) dan helai tepi
yang tersinari latar terang. Di void, tepi rambut menjadi siluet bergerigi karena suhu di tepi mengikuti matte, bukan helai.

## 4. Tes yang gagal

WOW gagal menurut kata Billy. SWAP gagal untuk filter: gradient map ungu di atas potret bisa dipasang di portofolio
siapa pun.

## 5. Sinyal taste

- Filter dinilai dengan standar fotografer: nada, detail, dan resolusi foto harus tetap terbaca di balik filter.
- Ungu sebagai warna dominan sosok ditolak untuk kedua kalinya; yang tidak ditolak (concept 1, referensi Void Pulse)
  sepertiga massanya hangat.
- Tepi rambut dinilai paling dekat, di sisi rambut tempat latar dibuang.
- "HD" adalah syarat eksplisit, bukan bonus.

## 6. Rule baru

- Filter atas foto dinilai sebagai foto. Sebelum dipotong, sumber diperbesar dengan model super-resolusi sampai ≥ 1× ukuran
  tampil di DPR 2. Detail foto (helai, pori, tekstur kain) tetap terbaca lewat filter. Massa kroma sosok ≤ 60% indigo–ungu
  dan ≥ 25% hangat. Tepi rambut tidak lebih terang dari rambut di belakangnya, dan tidak membawa warna latar asal.

## 7. Verdict lanjutan (saat perbaikan dimulai)

> "di bagian sisi sisi rambut seperti kurang rapih. dan coba photo didepan text billy maulana."

> "filter=thermal sangat jelek. jauh kualitasnya dari yang saya inginkan"

Bukti: `assets/2026-11-25-concept-2-filters-hair-thermal-desktop.jpg`.

**"Kualitasnya jauh", baris "Kelas foto kualitas photography" butir (b).** Kerapatan tepi (Sobel > 0,25, wajah diperkecil
ke lebar 300 px): `?filter=thermal` 2,21%, foto berwarna yang sama 9,08%, referensi Billy `photo-effect/thermal.jpg`
(SOUL) 7,82% dan OVERHEAT 7,41%. Filter saya membuang sekitar tiga perempat detail wajah. Kedua referensi itu adalah
*gradient map* atas foto: luminansi foto yang menentukan warna, sehingga mata, bibir, jari, dan helai rambut tetap tajam;
kulit jatuh di oranye–kuning, bayangan dan rambut di ujung gelap. Peta suhu saya dibangun dari kelas yang dihaluskan
(σ 0,10 unit wajah) demi aturan "wajah kontinu", dan aturan itu saya tafsirkan sebagai "hilangkan fitur".

**Sisi rambut.** Lihat §3: pita tepi dua kali lebih terang dari rambut, sisa latar lama, siluet bergerigi di void.

Rule tambahan: detail wajah di dalam filter ≥ 80% referensi Billy (kerapatan tepi ≥ 6% pada ukuran yang sama).
Kontinuitas wajah berarti tanpa garis kelas dan tanpa lubang buatan, bukan tanpa fitur.

## 8. Verdict lanjutan: efek sentuh

> "saya expect yang lebih baik jika terkena liquid di photo saya bukan membuat photo saya terfill filter tapi motion yang membuat foto 2d jadi serasa real kineticnya. misal foto ikut hancur atau effect yang begitu real di photo bukan hanya tempelan saja"

> "effect dari benar benar dari object photo saya bukan sekedar effect yang di timpa."

> "dan liquid thermal tetap ada jika menyentuh foto saya jangan hilang"

> "Effect foto masih jelek. Buat agar bagus"

Bukti: `assets/2026-11-25-concept-2-filters-hair-touch-pulse.png` (`touch=pulse`, satu sapuan di wajah).

Dalam dua jam saya memasang lima efek sentuh berturut-turut: CRT, stream, shatter, flow, pulse. Empat di antaranya punya pola
gagal yang sama: di dalam gumpalan tinta, foto **diganti** oleh pola (garis, titik, atau palet koral–biru) yang berbatas bentuk
tinta. Hasilnya tambalan bulat yang terbaca sebagai filter yang ditempel. Wajah tidak terbaca di dalamnya, dan tinta saya
cabut dari atas sosok sehingga cairannya "hilang". Baris decoder "Tidak menyatu / tempelan" butir (e) (efek interaksi pada
gambar tanpa watak) dan "AI slop" butir (e) (efek sebagai overlay, bukan konten).

Rule: efek sentuh tidak mengganti piksel foto dengan pola di dalam area tinta. Foto bereaksi secara fisik terhadap aliran
(terdorong, terseret, meninggalkan jejak gerak), warnanya tetap warna foto, dan cairan tetap terlihat di atasnya. Tidak ada
batas tambalan; kekuatan efek mengikuti kecepatan aliran secara kontinu.
