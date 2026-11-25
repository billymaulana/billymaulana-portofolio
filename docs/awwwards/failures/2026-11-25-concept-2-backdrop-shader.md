---
type: failure
slug: concept-2-backdrop-shader
date: 2026-11-25
route: /explore/concept/2
concept: Shader latar di belakang potret — berkas cahaya netral menembus kabut fbm (bawaan), plus tiga latar termal percobaan di `?v=d/e/f` (berkas, cakrawala, garis pindai)
verdict: "hapus saja shader karna jelek."
severity: deleted
style_attempted: [cinematic-light, volumetric-beams, thermal-ground]
fonts_used: [Bebas Neue, Satoshi]
technique_level: 5
screenshot: assets/2026-11-25-concept-2-backdrop-shader-desktop.jpg
rule_added: "Tanpa shader latar di belakang potret: ground hitam rata, gambar hanya dari foto dan dari cairan. Keadaan diam harus terbaca berwarna (isi terang ≥ 50% berkroma)."
---

# Concept 2 rute hero — shader latar dihapus

Bukti: `assets/2026-11-25-concept-2-backdrop-shader-desktop.jpg` (diam, 1440×900) dan
`assets/2026-11-25-concept-2-backdrop-shader-touch.jpg` (cairan menyentuh), diambil dari commit `d358d5f`
sebelum kode disentuh.

## 1. Kutipan verbatim

> "push semua ke development dan gunakan development sebagai default di sini. dan ganti foto saya dengan ini /Users/billymaulana/Data\ Billy/Works/2026-billy-portofolio/bahan/edit\ okeeeee dan coba jangan hitam putih."

> "hapus saja shader karna jelek."

Verdict sebelumnya atas latar ber-shader di rute yang sama: *"saat diam glow ungu tersebut entah mengapa saya merasa
jelek dan sangat slop"* (korona) · *"shadernya saya kurang suka. saya berharap shader yang cinematic"* (marmer cair) ·
*"sepertinya filter foto atau shader kurang cocok dan mendukung konsep plasma saya"* (berkas cahaya).

## 2. Apa yang dibangun

- Dua deret berkas cahaya dari atas sudut kanan, warna kertas `(0,93 · 0,91 · 0,88)`, hanya terlihat di kabut fbm
  empat oktaf yang bergeser; goyang ±0,035 rad. Di sosok, berkas yang sama menambah cahaya menurut plat relief.
- Tiga latar percobaan di balik `?v=d/e/f`, dibaca lewat ramp termal: berkas, cakrawala di garis bahu, garis pindai.
- Foto `IMG_6120` dari plat warna bergrade gelap (saturasi 82%) di ground `#060610`.

## 3. Diagnosis

Semua gate teknis hijau saat itu. Yang gagal terukur begini, pada tangkapan bukti, di bidang 480×460 px di kanan sosok:

| Ukuran | Berkas cahaya | Ground tanpa berkas |
|---|---|---|
| L\* median · p95 | 7,7 · 12,2 | 6,4 · 9,6 |
| Kontras p95 terhadap median | **1,10:1** | 1,07:1 |
| Piksel terang (L\* ≥ 14) | 0,5% | 0% |
| Kroma rata-rata (C\*) | 6,1 | 6,2 |
| Kerapatan tepi (ΔL\* > 4) | 0,64% | 0,03% |

**Baris "AI slop" §7C, butir (e) efek sebagai overlay, bukan konten.** Berkas itu hanya 1,10:1 di atas ground dan
nyaris tanpa tepi (0,64%; lantai `effect-audit` untuk efek yang terbaca adalah 2%). Ia terlalu lemah untuk menjadi
gambar dan cukup terang untuk mengotori hitam: terbaca sebagai noda kelabu di belakang kepala. `taste-constraints`
sudah melarang gradien yang nyaris tak terlihat; saya memasangnya juga.

**Baris "Tidak harmonis saat efek muncul", butir (c).** Kroma 6,1: cahaya netral, di luar ramp plasma. Sudah tercatat
di `2026-11-24-concept-2-two-worlds.md` sebagai sistem cahaya kedua, dan aturan tertulisnya sudah ada sehari sebelumnya.

**"Coba jangan hitam putih" diucapkan atas foto berwarna.** Plat yang tampil memang berwarna, tetapi di keadaan diam
hanya 3% dari isi terang frame yang berkroma (0,6% frame). Grade gelap dan saturasi 82% yang saya pilih membuat foto
berwarna terbaca hitam-putih. Billy menjawabnya dengan membuat sendiri 16 foto berpakaian warna jenuh.

**Pola.** Ini jenis latar prosedural keempat di belakang potret dalam dua hari: korona, marmer cair, berkas cahaya,
lalu tiga latar termal. Tiga yang sempat Billy nilai ditolak semuanya; yang keempat belum pernah ia lihat. Setiap
kali "mati" atau "tempelan" saya jawab dengan menambah lapisan di belakang sosok, dan tidak satu pun lewat styleframe
diam: semuanya dipasang di rute.

## 4. Tes yang gagal

EMPTY terbalik: shader dihapus, halaman tidak kehilangan apa pun. WOW menurut kata Billy ("jelek").

## 5. Sinyal taste

- Latar ber-shader di belakang potret tidak diinginkan; ground hitam rata lebih baik daripada latar yang ragu-ragu.
- Warna datang dari **subjek**: pakaian jenuh, banyak hue, motif (dashiki, kente, blok neon). Bukan dari cahaya atau filter.
- "Hitam putih" bagi Billy adalah kesan frame, bukan mode warna berkas: foto berwarna yang diredam tetap ia sebut hitam-putih.
- Ia mau turun tangan membuat aset sendiri bila arah saya meleset; foto pilihannya frontal, simetris, di latar hitam.

## 6. Rule baru

- Tanpa shader latar di belakang potret. Ground hitam rata; gambar hanya datang dari foto dan dari cairan. Latar baru
  hanya lewat styleframe diam yang Billy pilih, tidak dipasang di rute.
- Keadaan diam harus terbaca berwarna: isi terang frame ≥ 50% berkroma (L\* ≥ 14, C\* ≥ 20), diukur sebelum presentasi.
  Grade tidak boleh menurunkan saturasi foto yang Billy serahkan.
