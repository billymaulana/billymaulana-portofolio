# Manifest lisensi — `public/assets/textures/`

Setiap file yang di-commit ke folder ini wajib punya baris di tabel bawah. Repo ini **publik**
(`https://github.com/billymaulana/billymaulana-portofolio`, `"private": false` per respons
`api.github.com/repos/...`), jadi setiap berkas di sini bisa diunduh pihak ketiga sebagai berkas
tersendiri — bukan hanya dikonsumsi sebagai bagian halaman. Konsekuensinya: **hanya lisensi yang
mengizinkan redistribusi yang boleh masuk folder ini.** Lisensi bertipe
"boleh dipakai komersial, dilarang redistribusi" (Texturelabs, fffuel) tidak lolos syarat itu.

Riset sumber lengkap: `docs/awwwards/references/texture-resources.md`.

---

## Tabel file

| File | Sumber | URL | Lisensi | Atribusi diperlukan | Redistribusi diizinkan |
|---|---|---|---|---|---|
| `grain-momentsingraphics-bluenoise-l512.png` | Christoph Peters — *Free blue noise textures*, via mirror `Calinou/free-blue-noise-textures` (`512_512/LDR_LLL1_0.png`) | https://momentsingraphics.de/BlueNoise.html · https://raw.githubusercontent.com/Calinou/free-blue-noise-textures/master/512_512/LDR_LLL1_0.png | CC0 1.0 Universal — *"I have placed them in the public domain through CC0-licensing."* · `COPYING.txt` mirror: *"Licensed under CC0 1.0 Universal"* | Tidak | Ya |
| `grain-momentsingraphics-bluenoise-rgb256.png` | Sama, `256_256/LDR_RGB1_0.png` | https://raw.githubusercontent.com/Calinou/free-blue-noise-textures/master/256_256/LDR_RGB1_0.png | CC0 1.0 Universal (idem) | Tidak | Ya |
| `paper-ambientcg-paper001-1k.jpg` | ambientCG — `Paper001`, berkas `Paper001_1K-JPG_Color.jpg` dari `Paper001_1K-JPG.zip` | https://ambientcg.com/view?id=Paper001 · https://ambientcg.com/get?file=Paper001_1K-JPG.zip | CC0 1.0 Universal — *"You can copy, modify, distribute and perform the assets, even for commercial purposes, all without asking permission"* dan *"include the raw files in your project"* | Tidak (opsional: `Created using Paper001 from ambientCG.com, licensed under the Creative Commons CC0 1.0 Universal License.`) | Ya |
| `grain-generated-film-1024.png` | Dibuat di repo ini dengan ImageMagick | — | Milik proyek (tidak ada hak pihak ketiga) | Tidak | Ya |
| `dither-generated-bayer-8x8.png` | Dibuat di repo ini — matriks Bayer 8×8 (ordered/dispersed dither, Bayer 1973) | — | Matriks = fakta matematis, tidak dilindungi hak cipta; berkas milik proyek | Tidak | Ya |
| `halftone-generated-clustered-8x8.png` | Dibuat di repo ini — matriks clustered-dot 8×8 (screen 45°) | — | Idem | Tidak | Ya |
| `grain.png` | **Provenance tidak diketahui — kandidat untuk diganti** | — | **Tidak diketahui** | Tidak diketahui | Tidak diketahui |

---

## `grain.png` — catatan provenance

Masuk repo lewat commit `c76aac6` (`feat(text-effect-prisma): WebGL fluid text-mask + 8-layer hero
composition`, 1 Mar 2026) sebagai satu dari 24 berkas; commit itu tidak menyebut sumber tekstur,
dan tidak ada berkas lisensi yang menyertainya. Pencarian di seluruh `docs/` dan `app/` tidak
menemukan atribusi apa pun.

Karakter terukur: PNG 256×256, 8-bit grayscale, 65.880 byte, mean 127,713 (0,5008),
standard deviation 74,113 (0,2906). Deviasi 74,1 praktis identik dengan deviasi teoretis noise
uniform 8-bit (255/√12 = 73,6) — artinya isinya **white noise uniform tanpa korelasi antar piksel**,
bukan hasil scan film. Tidak ada bukti berkas ini berasal dari koleksi berlisensi, tapi juga tidak
ada bukti sebaliknya.

Dipakai di 9 tempat (`app/hero-explore-3/thermal.css:232`, `app/hero-explore-4/thermal.css:10`,
`app/components/SectionHero.vue:484`, `app/components/global/AppNavigation.vue:450`,
`app/components/HeroVariantChdartmaker.vue:318`, `app/components/HeroVariantV3.vue:484`,
`app/components/HeroVariantYakushev.vue:323`, `app/hero-snapshot/Hero.vue:366`,
`app/pages/hero-original.vue:486`). Penggantinya adalah
`grain-momentsingraphics-bluenoise-l512.png` (CC0, provenance terverifikasi, dan spektrum blue noise
yang tidak menggumpal saat di-scale turun).

---

## Verifikasi integritas

| File | Byte | SHA-256 |
|---|---|---|
| `dither-generated-bayer-8x8.png` | 140 | `c311bd02963c09184e5964836f400631a2f9aef88a2c482c9b0d7cabe4e15702` |
| `grain-generated-film-1024.png` | 794.420 | `7af9bb0f723d9e71bf6d04c6623f6168720f951c29c49f5c65f0d848536be4e9` |
| `grain-momentsingraphics-bluenoise-l512.png` | 392.823 | `df6f9a6ed8eaaeaa5d082b00c01397205920e6d4b6c485808d1db2da7f083843` |
| `grain-momentsingraphics-bluenoise-rgb256.png` | 225.447 | `9039f8406e9987e6bda1247a17c8ed7cc05203b367da887c5fbcc3548546568d` |
| `grain.png` | 65.880 | `ac214ac2b96e0fdea1cdc548a5c4b90355f872102050194593cffed228dfc822` |
| `halftone-generated-clustered-8x8.png` | 140 | `978b3563f7ec506aa65c2cdf8da836c0ed376cbf633454b5f68cd2986894f097` |
| `paper-ambientcg-paper001-1k.jpg` | 398.173 | `e8db6f5b91f7882f4711ab5b2dc5c2e91f822d4f80a7d0081991532cf5cd9b9a` |

`grain-momentsingraphics-*` dan `paper-ambientcg-*` byte-identik dengan berkas sumbernya —
hanya di-rename, tidak di-re-encode. Bandingkan SHA-256-nya dengan hasil unduhan langsung untuk
membuktikan provenance.

---

## Spesifikasi terukur tiap file

| File | Dimensi | Kanal | Mean | Std dev | Tileable | Peran |
|---|---|---|---|---|---|---|
| `grain-momentsingraphics-bluenoise-l512.png` | 512×512 | 3 kanal identik (L,L,L) + alpha=1 | 127,5 | 73,900 | Ya (dijamin sumber) | Grain overlay CSS, dither anti-banding |
| `grain-momentsingraphics-bluenoise-rgb256.png` | 256×256 | R/G/B independen + alpha=1 | 127,5 | 73,901 | Ya (dijamin sumber) | Grain kromatik per kanal di shader |
| `grain-generated-film-1024.png` | 1024×1024 | grayscale | 128,276 | 26,567 | Ya (terverifikasi, lihat bawah) | Film grain menggumpal, overlay besar |
| `dither-generated-bayer-8x8.png` | 8×8 | grayscale | 127,5 | 74,040 | Ya (matriks periodik) | Threshold map ordered dither |
| `halftone-generated-clustered-8x8.png` | 8×8 | grayscale | 127,5 | 74,040 | Ya (matriks periodik) | Threshold map halftone 45° |
| `paper-ambientcg-paper001-1k.jpg` | 1024×600 | sRGB | 244,471 | 3,046 | Ya (material seamless ambientCG) | Serat kertas / print artifact |

Catatan `paper-ambientcg-paper001-1k.jpg`: std dev hanya 3,046/255 (1,2%). Sebagai overlay mentah
dia praktis tak terlihat — wajib dinaikkan kontrasnya (`filter: contrast(6) grayscale(1)` atau
`-auto-level` saat build) sebelum di-blend.

---

## Cara membuat ulang berkas `*-generated-*`

Butuh ImageMagick 7 (`magick`). Jalankan dari folder ini.

Film grain 1024²:

```
magick -size 1024x1024 xc:gray50 +noise Gaussian -colorspace Gray \
  -virtual-pixel tile -blur 0x0.8 -auto-level -depth 8 grain-generated-film-1024.png
```

`+noise Gaussian` tidak menghormati `-seed` pada build ini (dua run dengan `-seed 20260726`
menghasilkan SHA-256 berbeda), jadi hasilnya **ekuivalen secara statistik, bukan bit-identik**.
Patokan verifikasi: 1024×1024 grayscale, mean ≈ 128, std dev ≈ 26,5, ukuran ≈ 794 KB.

`-virtual-pixel tile` yang membuatnya tileable — blur-nya membungkus tepi. Terverifikasi dengan
mean absolute difference antar kolom bersebelahan: interior kolom 500↔501 = 16,02 dan
kolom 0↔1 = 16,29, sedangkan pasangan wrap kolom 1023↔0 = 16,37. Selisih wrap berada di dalam
rentang interior, jadi tidak ada jahitan.

Bayer 8×8 dan clustered-dot 8×8 ditulis dari matriks berikut, dipetakan ke 8-bit lewat
`round((v + 0.5) * 255 / 64)` sehingga rentangnya 2–253 dan tidak pernah menyentuh 0 atau 255:

Bayer (dispersed, Bayer 1973):

```
 0 32  8 40  2 34 10 42
48 16 56 24 50 18 58 26
12 44  4 36 14 46  6 38
60 28 52 20 62 30 54 22
 3 35 11 43  1 33  9 41
51 19 59 27 49 17 57 25
15 47  7 39 13 45  5 37
63 31 55 23 61 29 53 21
```

Clustered-dot (screen 45°):

```
24 10 12 26 35 47 49 37
 8  0  2 14 45 59 61 51
22  6  4 16 43 57 63 53
30 20 18 28 33 41 55 39
34 46 48 36 25 11 13 27
44 58 60 50  9  1  3 15
42 56 62 52 23  7  5 17
32 40 54 38 31 21 19 29
```

Keduanya permutasi lengkap 0–63 (diperiksa saat generate). Baris pertama setelah pemetaan 8-bit:
Bayer `2 129 34 161 10 137 42 169`, clustered `98 42 50 106 141 189 197 149`.

---

## Aturan untuk penambahan berikutnya

1. Berkas tanpa baris di tabel ini tidak boleh di-commit.
2. Lisensi wajib dikutip verbatim dari halaman resmi sumbernya, bukan diringkas dari ingatan.
3. URL sumber wajib diverifikasi hidup dengan `curl -sIL -o /dev/null -w "%{http_code}"` dan status
   codenya dicatat di `docs/awwwards/references/texture-resources.md`.
4. Lisensi yang melarang redistribusi (Texturelabs, fffuel) **tidak boleh** masuk folder ini selama
   repo masih publik. Pakai jalur prosedural, atau simpan berkasnya di luar Git dan inject saat
   deploy.
