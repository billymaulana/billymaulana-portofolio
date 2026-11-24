---
type: failure
slug: explore-concept-2-styleframes
date: 2026-11-23
route: /explore/concept/2#styleframes
concept: Tiga styleframe splash→hero — a Kaca Sentuh (nama kaca di atas fluida termal) · b Piksel Pijar (piksel panas menulis nama lewat kerak retak) · c Bidang Depan (bidang nama menembus sosok Billy)
verdict: "a jelek typography tidak terbaca, c jelek font bentuk shape tidak jelas, b juga jelek kaku. diantara semua yang paling mending c. cuman hasil masih jelek jauh dari awwwards"
severity: rejected
style_attempted: [liquid, glass, editorial, cinematic, experimental]
fonts_used: [Clash Display, PP Editorial New, Cabinet Grotesk, Satoshi, Switzer]
technique_level: 5
screenshot: assets/2026-11-23-explore-concept-2-styleframes-desktop.png
rule_added: "Di keadaan diam nama Billy tampil utuh dan bersih; huruf DILARANG menjadi pembawa efek (diisi medan, dibiaskan, diretakkan, ditutup sebagian, dilumuri panas). Efek pada huruf hanya boleh sementara sebagai respons interaksi, lalu kembali utuh."
---

# Explore Concept 2 — tiga styleframe ditolak

Bukti: `assets/2026-11-23-explore-concept-2-styleframes-desktop.png` (baris atas a, tengah b, bawah c; kolom splash 1440×900 ·
hero 1440×900 · hero 390×844). Frame sumber tetap di `docs/plans/concept-2/styleframes/{a,b,c}/`. Ini keadaan setelah satu
putaran revisi; frame putaran pertama tidak disimpan di repo (versi compositornya ada di folder aset `comp-v1.html` /
`compose-r1.html`).

## 1. Kutipan verbatim

> "a jelek typography tidak terbaca, c jelek font bentuk shape tidak jelas, b juga jelek kaku. diantara semua yang paling
> mending c. cuman hasil masih jelek jauh dari awwwards"

## 2. Apa yang dibangun

Master brief baru (`docs/awwwards/master-brief.md`) → 8 konsep dari 4 agen Fable berlensa → kritikus konsep (maks
`min(orig, taste)` 6,0) → 3 konsep dikurasi → aset GPU (FLUX Klein: piksel makro, kerak cor, noda kaca, kaustik; MoGe depth
dan BiRefNet cutout untuk IMG_6094) → tiap konsep dirender oleh agen Fable lewat compositor WebGL2 sekali-pakai + Playwright
→ kritik frame (min 4,7 / 5,1 / 5,4) → satu putaran revisi → kritik ulang (min a 6,1 · b 5,4 · c 6,5).

| | Famili nama | Ukuran nama 1440 | Medium |
|---|---|---|---|
| a | Clash Display 700 | 265,29 px, dua baris bertingkat | kaca SDF bevel 0,11 em di atas 4 kolam tangkapan `/liquid/liquid-2` |
| b | PP Editorial New Ultrabold | 268 px, dua baris | kerak cor + retakan Voronoi 58 px, panas memudar geodesik dari titik i |
| c | Cabinet Grotesk 800 | 378,3 px, dua baris | sosok IMG_6094 sebagai volume indigo, pita panas σ 13 px di garis potong, filamen plasma |

Semua frame lolos gate mesin: dimensi, ≤ 600 KB, `thermal-zones` 9/9 HIJAU, 0 tabrakan teks.

## 3. Diagnosis jujur

Semua gate mesin hijau dan ketiganya tetap ditolak (pola #4). Gate mengukur hal yang benar secara teknis, tetapi tidak satu
pun mengukur dua hal yang Billy sebut: keterbacaan dan kejelasan bentuk.

**Adjective decoder (§7C)**
- **"typography tidak terbaca" (a):**
  - Kontras huruf tanpa panas ("ula", crop 60×90 di x 840 y 520) terhadap ground terukur **1,18:1**: luminans linear 0,0111 lawan 0,0018.
  - Kaca dibuat bening, jadi di bagian huruf tanpa panas nama nyaris hilang. Ini pelanggaran langsung baris AI slop (e) "efek sebagai overlay, bukan konten": efeknya justru memakan konten.
  - Di ponsel nama depan hampir tidak terlihat.
- **"font bentuk shape tidak jelas" (c):**
  - Wajah Billy terukur **1,14:1** terhadap ground: luminans 0,0087 lawan 0,0017. Sosok jadi siluet yang nyaris tidak ada.
  - Pada nama, "y" tertutup kepala 26,8% luas tintanya, "ll" dilumuri panas yang terserap, dan pita garis potong ±30 px melintang di huruf. Bentuk huruf dan bentuk sosok dua-duanya kabur.
- **"kaku" (b):** tidak ada baris decoder. Yang terlihat:
  - Bujur sangkar splash di tengah dengan garis tepi lurus.
  - Nama serif rata kiri dengan tekstur lava yang di-clip diam di dalam huruf.
  - Tidak ada satu pun gerak yang tersirat di gambar diam, padahal prinsip 4 master brief "waktu dijadikan ruang" justru absen.
  - Kotaknya simetris sempurna: AI slop (d).
- **"jauh dari awwwards":**
  - Kesembilan frame adalah render teknis compositor, bukan gambar yang dikomposisi dan diterangi.
  - Pembandingnya poster referensi Billy: subjek fotografis/3D yang diterangi, retus, lapisan tipografi bertingkat. Jaraknya terlihat di setiap frame.

**Akar di proses (kesalahan saya, bukan brief)**
1. **Gerbang konsep saya lompati.**
   - Kritikus konsep memberi maksimum 6,0. Saya memutuskan (ruling Task 3) membawa tiga konsep itu ke styleframe ditambah arahan perbaikan, alih-alih memutar ulang generasi.
   - Konsep di bawah ambang menghasilkan frame di bawah ambang.
2. **Delapan konsep, satu kerangka.**
   - Semuanya "nama raksasa + meta di sudut + satu efek pada/di sekitar nama". Kritikus konsep sudah mencatat ini, dan lensa yang berbeda tidak menghasilkan komposisi yang berbeda.
   - Itu kerangka yang sama dengan penolakan sebelumnya: thermal ink 2026-09-21, plasma burn 2026-09-22, MOLTEN INDEX 2026-07-25, Concept 1 dengan kaki huruf meleleh.
   - **Nama sebagai pembawa efek sudah gagal lima kali.**
3. **Metrik dioptimasi melawan gambar (pola #17).**
   - Kuota zona termal (dingin 50–60%) saya jadikan gate per frame.
   - Akibatnya agen c menggelapkan wajah sampai luma ≤ 0,18 dan agen b memindahkan suhu huruf, semata untuk lolos `thermal-zones`.
   - Kuota itu diturunkan dari poster, tetapi memaksakannya per frame merusak keterbacaan subjek.
4. **Jalur render.**
   - Saya memutuskan frame dibuat dengan compositor kode, bukan dikomposisi di Photoshop. Alasannya: harus bisa direproduksi shader dan tiga agen paralel.
   - Hasilnya kaku dan teknis. Aset FLUX dipakai sebagai tekstur, tidak pernah sebagai gambar hero yang diterangi.
5. **Tipografi dipilih per agen.**
   - Tiga famili berbeda, masing-masing diukur, tetapi tidak satu pun disusun sebagai komposisi tipografi (skala bertingkat, vertikal, terpotong tepi, berlapis dengan subjek) seperti di referensi.
   - Layout dua baris rata kiri + meta sudut sudah ditolak berkali-kali.

## 4. Tes yang gagal

- **WOW:** ketiganya.
- **SWAP:** a. Kaca di atas fluida bisa ditukar ke nama siapa pun.
- **EMPTY:** b. Sisi kanan hero kosong tanpa fungsi.
- **OBJECT:** c lolos secara niat (sosok Billy), tetapi objeknya tidak terlihat (1,14:1).

## 5. Sinyal taste yang didapat

- Dari tiga arah, **c paling mendekati**: sosok Billy sendiri + nama bold tanpa efek di badan huruf. Arah "figur + nama" punya peluang; eksekusinya yang gagal, karena sosok tidak terlihat dan huruf terganggu.
- **Keterbacaan nama tidak bisa ditawar**, sebagus apa pun efeknya. Kontras huruf dan subjek terhadap ground perlu gate angka.
- **"Kaku"** adalah penolakan baru. Billy menangkap ketiadaan gerak dan aliran pada gambar diam: simetri, kotak lurus, tekstur statis. Gambar diam harus menyiratkan gerak.
- Kualitas yang Billy tuntut ada di level gambar (komposisi, cahaya, material), bukan di level sistem atau shader.

## 6. Rule baru

- Di keadaan diam nama Billy tampil utuh dan bersih; huruf DILARANG menjadi pembawa efek (diisi medan, dibiaskan,
  diretakkan, ditutup sebagian, dilumuri panas). Efek pada huruf hanya boleh sementara sebagai respons interaksi, lalu
  kembali utuh.
- Konsep dengan `min(originality, taste_fit)` < 7,0 di tahap konsep DILARANG dibawa ke styleframe; putar ulang generasi.
- Kuota zona termal adalah panduan untuk halaman utuh, bukan gate per frame; ia tidak boleh mengalahkan kontras nama
  (≥ 7:1) atau kontras subjek terhadap ground (≥ 3:1 pada area wajah/bentuk utama).
