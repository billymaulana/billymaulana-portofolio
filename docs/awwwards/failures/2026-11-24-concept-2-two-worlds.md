---
type: failure
slug: concept-2-two-worlds
date: 2026-11-24
route: /explore/concept/2
concept: Foto IMG_6120 dalam warna asli bergrade gelap + berkas cahaya netral menembus kabut + paralaks relief; plasma termal hanya saat cairan menyentuh (sebelumnya: foto hitam-putih dengan cahaya yang sama)
verdict: "jauh lebih baik, tapi masih kurang. entah konsep tidak kuat, atau foto tidak cocok, atau filter foto tidak cocok, atau shader tidak cocok dan saat ada motion dengan muncul liquid plasma juga serasa tidak harmonies. saya tidak tahu apa yang salah yang tidak membuat immersive dan tidak merasakan feels yang bagus, entah layout tidak cocok. menurutmu kenapa. referensi yang saya suka /Users/billymaulana/Data\\ Billy/Works/2026-billy-portofolio/reference\\ style\\ concept atau buka list website awwwards. tapi sepertinya filter foto atau shader kurang cocok dan mendukung konsep plasma saya."
severity: iterate
style_attempted: [thermal, cinematic-light, natural-colour-photo, parallax]
fonts_used: [Bebas Neue, Satoshi]
technique_level: 3
screenshot: assets/2026-11-24-concept-2-two-worlds-desktop.jpg
rule_added: "Keadaan diam dan plasma harus satu palet (tumpang-tindih hue diam↔sentuh ≥ 70%); foto tidak digerakkan; shader latar memakai ramp yang sama dengan plasma."
---

# Concept 2 rute hero — foto dan plasma bukan satu dunia

Bukti: `assets/2026-11-24-concept-2-two-worlds-desktop.jpg` (diam, 1440×900),
`assets/2026-11-24-concept-2-two-worlds-touch.jpg` (plasma menyentuh foto berwarna),
`assets/2026-11-24-concept-2-two-worlds-thermal-pair.jpg` (`?v=a`: sosok termal, diam dan sentuh, untuk pembanding).

## 1. Kutipan verbatim

> "jauh lebih baik, tapi masih kurang. entah konsep tidak kuat, atau foto tidak cocok, atau filter foto tidak cocok, atau shader tidak cocok dan saat ada motion dengan muncul liquid plasma juga serasa tidak harmonies. saya tidak tahu apa yang salah yang tidak membuat immersive dan tidak merasakan feels yang bagus, entah layout tidak cocok. menurutmu kenapa. referensi yang saya suka /Users/billymaulana/Data\ Billy/Works/2026-billy-portofolio/reference\ style\ concept atau buka list website awwwards. tapi sepertinya filter foto atau shader kurang cocok dan mendukung konsep plasma saya."

> "saya tidak suka juga foto bergerak ketika ada motion"

Sesudah membuka halaman pembanding:

> "konsep /explore/concept/2?v=a jauh lebih baik dibanding hitam putih"

Rangkaian verdict sebelumnya atas keadaan diam yang sama: *"hero saya sangat mati sekali. dan shadernya saya kurang suka. saya berharap shader yang cinematic"* · *"coba ganti foto deh"* · *"lebih baik. tapi saya masih kurang sreg jika hitam putih fotonya"*.

## 2. Apa yang dibangun

- Foto `IMG_6120` (setengah badan, menoleh ke kanan) sebagai sosok beralfa; saat diam ditampilkan dari plat warna asli
  (level 2–86%, sigmoidal 2,4, saturasi 82%) di ground `#060610`.
- Shader latar: dua deret berkas cahaya dari atas sudut kanan, warna kertas `(0,93 · 0,91 · 0,88)`, terlihat di kabut fbm
  yang bergeser, goyang ±0,035 rad.
- Foto digeser oleh reliefnya: drift kamera 0,0045 dan condong ke pointer 0,011.
- Plasma (ramp C0–C10) dan sapuan horizontal hanya di tempat cairan menyentuh.

## 3. Diagnosis

Semua gate yang saya jalankan hijau (kontras teks 8,04–8,25:1, nama 10,3–13,9:1, console bersih). Yang gagal tidak punya gate.

**Baris "Tidak harmoni" §7C, butir (c) suhu warna campur tanpa sistem.** Diukur di pita antara nama dan footer
(1440×520), piksel terang L\* ≥ 14, berkroma C\* ≥ 20, histogram hue 24 bin berbobot kroma:

| Keadaan diam | Berkroma dari yang terang | Hue diam | Saat plasma menyentuh | Tumpang-tindih hue diam↔sentuh | Massa kroma |
|---|---|---|---|---|---|
| warna asli + berkas (ditolak) | 3% (0,6% frame) | 30–60° | 73–75% berkroma, 300–330° | **7–8%** | ×117–123 |
| hitam-putih + berkas | 0% | — | 83–84% berkroma, 300–330° | **0%** | dari nol |
| sosok termal `?v=a` | 97% (12,6% frame) | 300–330° | 98% berkroma, 300–330° | **90–93%** | ×2,0–2,3 |

Plasma datang sebagai warna yang tidak ada di frame, dalam dua keadaan diam terakhir. Di `?v=a` plasma adalah penguatan
dari yang sudah ada.

**Sebelas referensi yang Billy simpan** (`effect/`, `layout/`, `void pulse/`; tiga "suka", tiga "menyatu", lima termal
dan profil garis): isi terang frame 0% berkroma (monokrom murni: smear putih, MULTIVERSE) atau 54–99% berkroma dalam
satu palet. Tidak ada satu pun yang memadukan subjek berwarna natural dengan efek berwarna.

**Baris "Tidak menyatu / tidak imersif", butir (a).** Cahaya latar netral dan plasma adalah dua sistem cahaya; warna
plasma tidak pernah jatuh di adegan saat diam.

**Tiga perbaikan berturut-turut menjauhi konsep.** "Filter ungu terlalu tajam" saya jawab dengan mencabut termal dari
foto: termal → hitam-putih → warna asli. Tiap langkah ia sebut "lebih baik", sementara foto makin keluar dari palet
plasma. Saya tidak pernah mengukur frame diam terhadap frame sentuh.

**Foto bergerak.** Paralaks dan condong ke pointer melanggar aturan 2026-11-20 yang sudah tertulis ("gambar diam tidak
diberi kehidupan tempelan"). Saya menjawab "mati" dengan menggerakkan foto, bukan dengan menghidupkan latar.

**Dugaan saya, belum terbukti:** yang dulu terbaca "terlalu tajam" adalah pemetaan termal dua nada. Di `?v=a`, 90,3%
luas sosok ada di ruas terdingin ramp (hitam→indigo) dan hanya 3,1% di rentang tengah (ungu–magenta–mawar).

## 4. Tes yang gagal

SWAP (potret berwarna + berkas cahaya putih bisa milik siapa saja; konsep plasma tidak hadir saat diam) dan WOW menurut
kata Billy ("tidak merasakan feels yang bagus").

## 5. Sinyal taste

- Sosok termal saat diam jauh di atas hitam-putih: *"konsep /explore/concept/2?v=a jauh lebih baik dibanding hitam putih"*.
- Filter foto dan shader dinilai dari satu hal: apakah mendukung konsep plasma.
- Foto tidak boleh bergerak, baik sendiri maupun mengikuti pointer.
- Di referensinya subjek dirender oleh efeknya (termal, garis pindai, smear) dalam satu palet; tidak ada foto biasa yang
  didatangi efek.

## 6. Rule baru

- Keadaan diam dan plasma satu palet: tumpang-tindih hue antara frame diam dan frame sentuh ≥ 70%, diukur sebelum
  presentasi. Sosok saat diam memakai ramp termal.
- Foto tidak digerakkan: tanpa paralaks, drift kamera, atau condong ke pointer. Yang boleh hidup saat diam adalah latar.
- Shader latar memakai ramp yang sama dengan plasma. Cahaya netral di belakang sosok adalah sistem cahaya kedua.
- Kata sifat terakhir tidak dijawab dengan membuang bagian konsep. Sebelum mengganti perlakuan, ukur dulu apakah
  perlakuan baru masih berbagi palet dan struktur dengan efek yang sudah disetujui.
