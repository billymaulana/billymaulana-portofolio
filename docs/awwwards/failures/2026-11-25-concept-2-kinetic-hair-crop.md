---
type: failure
slug: concept-2-kinetic-hair-crop
date: 2026-11-25
route: /explore/concept/2
concept: Foto berwarna di depan nama; saat disentuh, foto terdorong aliran dengan jejak gerak dan tinta termal tembus di atasnya (`touch=kinetic`); rambut dipotong dengan matte RVM yang dirapikan morfologi
verdict: "effect di photo saya jelek, dan saya ragu apakah liquid perlu dipertahankan jika diatas foto saya. dan cropping dari foto saya tidak rapih seperti di area rambut. saya ingin kualitas awwwards untuk effect di photo dan photo saya."
severity: rejected
style_attempted: [natural-colour-photo, liquid, displacement, motion-blur]
fonts_used: [Bebas Neue, Satoshi]
technique_level: 3
screenshot: assets/2026-11-25-concept-2-kinetic-hair-crop-desktop.jpg
rule_added: "Tinta termal tidak digambar di atas foto berwarna natural; efek pada foto dibuat sebagai styleframe diam di balik flag sampai lolos, tidak di rute bawaan; rambut dipotong dengan model matting bertrimap dan diperiksa di atas hitam dan di atas warna huruf pada zoom 2×."
---

# Concept 2 rute hero — efek kinetik jelek, potongan rambut tidak rapi

Bukti: `assets/2026-11-25-concept-2-kinetic-hair-crop-desktop.jpg` (diam, 1440×900, DPR 2),
`assets/2026-11-25-concept-2-kinetic-hair-crop-hair.jpg` (rambut di depan huruf, 1:1),
`assets/2026-11-25-concept-2-kinetic-hair-crop-touch.jpg` (akhir satu sapuan, `touch=kinetic`).

## 1. Kutipan verbatim

> "effect di photo saya jelek, dan saya ragu apakah liquid perlu dipertahankan jika diatas foto saya. dan cropping dari foto saya tidak rapih seperti di area rambut. saya ingin kualitas awwwards untuk effect di photo dan photo saya."

## 2. Apa yang dibangun

- Efek sentuh keenam dalam satu sore. Foto digeser sesaat sebesar `0,075 × (1 − e^(−kecepatan/200))` searah aliran, dengan
  10 tap jejak dan pisah kanal merah–biru; tinta termal digambar di atas sosok pada 45%.
- Rambut: alpha RVM + kunci luminansi, lalu `open` 3 px dan `close` 5 px dan blur σ 1,6; nada rambut dikompresi.
- Nama diletakkan di belakang sosok lewat mask CSS dari matte yang sama.

## 3. Diagnosis

**"Effect jelek" dan ragu soal cairan di atas foto: baris "Tidak harmonis saat efek muncul".**

| Butir | Terukur (diam → akhir sapuan) | Lantai |
|---|---|---|
| (a) tumpang-tindih hue | 62,2% seluruh frame | ≥ 70% |
| (b) massa kroma | × 2,9 | ≤ × 10 (lolos) |
| (d) isi terang berkroma | 33,6% → 65,4% (keadaan campuran) | 0% atau ≥ 50% satu palet |

Tinta termal tembus di atas kulit dan jaket berwarna natural menghasilkan kuning-mustard dan merah muda di wajah: dua palet
ditumpuk. Ini kegagalan yang sama dengan `2026-11-24-concept-2-two-worlds` (subjek berwarna natural + efek berwarna), dan
aturan "tinta didinginkan sebelum ramp di atas bagian hangat sosok" sudah tertulis pagi ini. Saya mengulanginya.

Geseran sesaat + jejak merata membuat wajah menjadi gumpalan lunak; tidak ada struktur yang terbaca (garis, pita, tepi)
seperti di rujukan `referensi/effect/VoidPulse-1.jpg`, yang ia tunjuk dua kali. Saya tidak pernah membedah rujukan itu:
isinya benang vertikal ber-pitch ±9,4 px (lebar gambar 736), digeser per baris piksel oleh relief gambar sehingga
membentuk chevron, tebal benang mengikuti terang, isi biru di antara benang, dan pita baris yang terlempar menjadi
garis putus-putus di tepi siluet.

**"Cropping tidak rapih di area rambut": baris "Cutting tidak enak dilihat".**

- (a) Garis luar dari topeng, bukan anatomi: pita lunak matte (α 0,1–0,9) rata-rata 5,1 px plat (±2 px layar) di sepanjang
  5.364 px kontur rambut. Garis luarnya hasil `open`/`close`: tonjolan dan lekuk buatan, tanpa helai.
- (c) Tepi bercak: dua bidang abu di mahkota dan bintik lepas di kanan.
- Sejak nama dipindah ke belakang sosok, tepi rambut berdiri di depan huruf krem (kontras tertinggi di halaman); cacat yang
  dulu tenggelam di hitam sekarang paling terlihat.

**Cara kerja.** Enam efek dan empat versi potongan rambut saya pasang bergantian di rute bawaan yang sedang Billy tonton
(pola #34, sudah tertulis). Satu "bukti diam" yang saya kirim ternyata frame sebelum foto muncul; saya tidak melihatnya
sebelum mengirim. Frame itu juga membuka cacat intro: mask nama aktif sebelum foto tampil, sehingga nama tergigit bentuk
rambut selama ±2 detik.

## 4. Tes yang gagal

WOW gagal menurut kata Billy. SWAP gagal untuk efek (geser + blur bisa dipasang pada foto siapa pun).

## 5. Sinyal taste

- Cairan di atas foto berwarna diragukan Billy sendiri; yang ia sukai dari cairan adalah detailnya di ruang kosong.
- "Kualitas awwwards" untuk foto berarti potongan rambut yang lolos dilihat dekat, di depan huruf.
- Rujukan efek yang ia ulang adalah potret garis (VoidPulse): struktur dari foto, bukan lapisan warna.

## 6. Rule baru

- Tinta termal tidak digambar di atas foto berwarna natural. Cairan lewat di belakang sosok; yang terlihat di dalam
  siluet hanya yang berasal dari foto itu sendiri.
- Efek baru pada foto dibuat di balik flag dan dinilai sebagai frame diam sampai lolos; bawaan rute berubah satu kali.
- Rambut dipotong dengan model matting bertrimap + estimasi warna foreground, tanpa `open`/`close`. Sebelum presentasi
  diperiksa pada zoom 2× di atas hitam dan di atas warna huruf.
- Setiap gambar dilihat sebelum dikirim sebagai bukti.

## 7. Arahan lanjutan (saat perbaikan berjalan)

> "buat foto saya dibelakang text billy maulana saja"

> "ccoba ganti foto saya dengan foto lain"

> "jangan ada stroke di text billy maulana"

**"Stroke" di huruf nama.** Lubang hitam untuk huruf dipanggang ke plat foto sekali, dengan cincin bleed 0,75 px di
sembilan arah, sedangkan huruf di kanvasnya sendiri di-warp mengikuti pointer. Begitu pointer berada di atas nama,
huruf bergeser dan lubangnya tetap: bentuk huruf hitam tertinggal di samping huruf di atas rambut, dan tinta tampil di
dalam lubang itu. Keluhan pukul 14.44 (*"saya melihat ada seperti outline hitam di foto saya dan menganggu tulisan"*)
adalah cacat yang sama; waktu itu saya mendiagnosisnya sebagai matte yang terlalu lebar dan tidak memeriksa huruf saat
di-hover.

## 8. Yang diubah

- Foto bawaan diganti ke kente frontal berlatar hitam (`wjmaa0…`), berwarna. Sumber berlatar hitam tidak dipotong:
  hitam foto adalah hitam ground, rambut utuh. Foto berlatar hitam lain yang lolos: `block` (`2irfuk…`) dan `blazer`
  (`68dxcg…`). `neon` dan `dashiki` tidak dipasang: puncak rambutnya terpotong di sumber dan tambalan saya meninggalkan
  noda.
- Foto berlatar terang `alley` dipotong ulang dengan ViTMatte bertrimap + estimasi foreground. `studio`, `varsity`,
  `geometric`, `room` masih memakai potongan lama.
- Foto di belakang nama (bawaan). Lubang huruf dibaca tiap frame dari kanvas huruf yang sedang di-warp; cincin bleed
  dicabut.
- Cairan lewat di belakang sosok (`touch=behind`, bawaan). Enam efek percobaan dicabut dari kode.
- Efek pada foto dibangun di balik flag, belum bawaan: `touch=thread`. Rumusnya dibedah dari `VoidPulse-1.jpg`
  (benang vertikal, tebal mengikuti terang, digeser relief, zigzag per baris) tetapi benangnya memakai warna foto
  sendiri, celahnya foto yang digelapkan, dan kedalamannya naik kontinu mengikuti tinta di belakang sosok. Terukur pada
  kotak wajah + rambut: tumpang-tindih hue diam → efek 80,1% (lantai 70%), massa kroma × 1,49. `touch=pulse` = rumus
  yang sama dengan palet koral di atas biru.

## 9. Pilihan Billy sesudah melihat styleframe

> "pulse default yang lainnya hapus, dan ganti fotonya dengan foto lain coba foto potrait studio atau potrait geometric"

- `pulse` menjadi satu-satunya respons foto terhadap cairan; `behind`, `thread`, dan empat mode lama (split, whole, comb,
  rgb) dihapus dari kode beserta parameter `?touch=`.
- Foto bawaan: `studio` (`mjz15x…`, frontal, latar putih), dipotong ulang dengan ViTMatte bertrimap + estimasi warna
  foreground + penjinakan nada tepi rambut. Opsi `?photo=geometric` (`3che9m…`, tiga perempat) dipotong dengan cara yang
  sama; tepi kanannya memang tidak fokus di foto sumber dan dikencangkan hanya di pita yang buram.
- Opsi `varsity` (`fhwuoo…`) dan `room` (`wl9v77…`) menyusul dipotong dengan cara yang sama. Potongan lama berupa
  siluet stiker dengan lubang di puncak rambut, dan `room` membawa garis pucat dari dinding. Pita kabur `room` dikencangkan
  hanya di bagian yang halus. Di `varsity`, cemaran hijau-abu dari latar jalan dinetralkan ke warna helai yang terkena
  cahaya, dan kabut krem dari bokeh dipisahkan dari rambut hanya di bagian yang halus.
- Yang gagal di tengah jalan: mengunci warna tepi ke rata-rata rambut di dekatnya menghapus tekstur helai yang terkena
  cahaya, dan tepinya berubah menjadi pita krem rata yang terbaca seperti stroke. Memisahkan latar tanpa syarat tekstur
  melubangi helai yang warnanya mirip bokeh. Pemisahan latar hanya aman di area yang halus.
- Sesudah melihat potongan baru, Billy memindahkan foto bawaan ke `varsity`: *"set foto default ke ini: photo=varsity"*.
- Sinyal taste: palet koral di atas biru (rujukan VoidPulse) dipilih atas benang berwarna foto sendiri. Dari dua potret
  frontal, Billy memilih potret jalan bercahaya matahari dengan jaket varsity, bukan potret studio berlatar putih.
