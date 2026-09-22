# Texture & Pattern Resources

Sumber tekstur untuk portofolio ini, beserta lisensi terverifikasi, argumen kapan tekstur harus
prosedural dan kapan harus berkas raster, dan snippet siap tempel.

Dipicu permintaan Billy 2026-07-26: *"tambahkan ini sebagai referensi assets texture, and tinggal
download image texturenya jika dibutuhkan https://texturelabs.org/ atau cari fre resources untuk
texture dan pattern yang lebih baguus yang bisa anda gunakan agar hasil standar awwwards"*.

Manifest berkas yang benar-benar ada di repo: `public/assets/textures/CREDITS.md`.

---

## Ringkasan keputusan

1. **Texturelabs lolos untuk pemakaian, gagal untuk di-commit.** Terms-nya eksplisit mengizinkan
   dipakai di website secara komersial tanpa atribusi, tapi sama eksplisitnya melarang
   redistribusi *"even for free"*. Repo ini publik (`"private": false` dari
   `api.github.com/repos/billymaulana/billymaulana-portofolio`), jadi berkas Texturelabs yang
   di-commit bisa diunduh sebagai berkas tersendiri oleh siapa pun. Karena itu tidak ada berkas
   Texturelabs yang di-download ke `public/assets/textures/`.
2. **Yang di-commit hanya CC0 dan berkas buatan sendiri** — ambientCG dan blue noise Christoph
   Peters, plus tiga peta yang dibangkitkan di repo ini.
3. **Grain #1 kebutuhan proyek ini tidak butuh berkas sama sekali** untuk kasus terbanyaknya:
   grain di dalam shader sudah dikerjakan `hash(gl_FragCoord.xy + uTime)` dengan 0 byte transfer,
   dan grain overlay CSS statis bisa 442 byte lewat SVG `feTurbulence` melawan 65.880 byte
   `grain.png` — selisih 149×.
4. **`grain.png` yang sekarang adalah white noise uniform** (σ = 74,113 ≈ 255/√12 = 73,6), bukan
   scan film, dan provenance-nya tidak tercatat di mana pun. Diganti blue noise CC0.

---

## Tabel sumber

Kolom **HTTP** adalah hasil nyata `curl -sIL -o /dev/null -w "%{http_code}"` pada 2026-07-26, bukan
asumsi. URL yang mati atau memblokir tetap dicantumkan dengan status apa adanya.

| Nama | URL | HTTP | Jenis aset | Resolusi / format | Lisensi (kutipan verbatim) | Komersial | Atribusi | Redistribusi |
|---|---|---|---|---|---|---|---|---|
| **Texturelabs** | https://texturelabs.org/ | 200 | Foto tekstur 18 kategori: Atmosphere, Brick, Concrete, Details, Fabric, Film, Glass, Grunge, Ink/Paint, Lens Effects, Metal, Paper, Sky, Soil, Stone, Vector, Water, Wood | JPG 4 tier: 960×640 · 1920×1281 · 4240×2828 · 7952×5304; kategori Vector = EPS | *"In other words, you're free to use these textures for any purpose, including commercial work."* · *"You are not required to credit Texturelabs in your work (but a shout-out is always appreciated)."* · *"Be sub-licensed, resold, shared, transferred, or otherwise redistributed (even for free)."* (larangan) · *"Constitute the entirety of a product, and must be incorporated into another product such as a film, advertisement, poster, website, or video game."* | Ya | Tidak | **Tidak** |
| Texturelabs — Terms of Use | https://texturelabs.org/terms/ | 200 | Halaman lisensi | — | *"The resources provided by Texturelabs.org are not permitted to be used for training or assisting AI image generation models or algorithms."* | — | — | — |
| Texturelabs — kategori Film | https://texturelabs.org/textures/film/ | 200 | Grain, emulsi, plat daguerreotype | contoh `Film 120`: 960×811 · 1920×1623 · 4240×3583 · 4700×3972 JPG, ditandai FREE FOR COMMERCIAL USE | idem | Ya | Tidak | Tidak |
| Texturelabs — kategori Grunge | https://texturelabs.org/textures/grunge/ | 200 | Goresan, debu, noda | idem 4 tier JPG | idem | Ya | Tidak | Tidak |
| **ambientCG** | https://ambientcg.com/ | 200 | Material PBR seamless (Paper001–006, Cardboard001–004, Concrete, Fabric, dll) | ZIP per material: 1K/2K/4K, JPG atau PNG; peta Color, Displacement, NormalDX/GL, Roughness | *"You can copy, modify, distribute and perform the assets, even for commercial purposes, all without asking permission"* · *"include the raw files in your project, for example a video game"* — CC0 1.0 Universal | Ya | Tidak | **Ya** |
| ambientCG — halaman lisensi | https://docs.ambientcg.com/license/ | 200 | — | — | Kredit opsional yang disarankan: `Created using <asset name> from ambientCG.com, licensed under the Creative Commons CC0 1.0 Universal License.` | — | — | — |
| ambientCG — `Paper001` | https://ambientcg.com/view?id=Paper001 | 200 | Serat kertas | 1K-JPG.zip = 5.028.873 byte; Color map 1024×600 JPG 398.173 byte | CC0 1.0 | Ya | Tidak | Ya |
| ambientCG — unduhan langsung | https://ambientcg.com/get?file=Paper001_1K-JPG.zip | 200 | ZIP | 5.028.873 byte terverifikasi | CC0 1.0 | Ya | Tidak | Ya |
| **Poly Haven** | https://polyhaven.com/textures | 200 | Tekstur PBR, HDRI, model | 1K–8K, JPG/PNG/EXR | *"You can use our assets for any purpose, including commercial work."* · *"You do not need to give credit or attribution when using them (although it is appreciated)."* · *"You can redistribute them, share them around, include them when sharing your own work, or even in a product you sell."* | Ya | Tidak | **Ya** |
| Poly Haven — halaman lisensi | https://polyhaven.com/license | 200 | — | — | CC0 | — | — | — |
| **Free blue noise textures** (Christoph Peters, *Moments in Graphics*) | https://momentsingraphics.de/BlueNoise.html | 200 | Blue noise tileable — void-and-cluster | 16² s/d 1024², 1/2/3/4 kanal, PNG 8-bit dan PNG 16-bit; banyak varian per ukuran | *"I have placed them in the public domain through CC0-licensing."* | Ya | Tidak | **Ya** |
| Blue noise — arsip zip | https://momentsingraphics.de/Media/BlueNoise/FreeBlueNoiseTextures.zip | 200 | ZIP koleksi lengkap | — | CC0 1.0 | Ya | Tidak | Ya |
| Blue noise — mirror Git (berkas per berkas) | https://github.com/Calinou/free-blue-noise-textures | 200 | Sama, bisa `curl` per berkas | `256_256/LDR_LLL1_0.png` 99.216 B · `256_256/LDR_RGB1_0.png` 225.447 B · `512_512/LDR_LLL1_0.png` 392.823 B · `512_512/LDR_RGBA_0.png` 1.049.488 B | `README.md`: *"Licensed under CC0 1.0 Universal, see COPYING.txt for details."* · `COPYING.txt` = teks penuh CC0 1.0 Universal | Ya | Tidak | **Ya** |
| **fffuel** — `nnnoise`, `tttexture`, `gggrain` | https://www.fffuel.co/nnnoise/ · https://www.fffuel.co/tttexture/ · https://www.fffuel.co/gggrain/ | 200 / 200 / 200 | Generator SVG: noise, grunge, grainy gradient. Memakai `feTurbulence` + `feComponentTransfer` + `feColorMatrix` | SVG (dan ekspor raster) | *"You are free to use the Images for both personal and commercial projects. No attribution is required, but a mention is really appreciated."* · *"You cannot sublicense, resell, share, transfer, or otherwise redistribute the Images."* | Ya | Tidak | **Tidak** |
| fffuel — halaman lisensi | https://www.fffuel.co/license/ | 200 | — | — | idem | — | — | — |
| **CSS-Tricks — Grainy Gradients** (Jimmy Chion) | https://css-tricks.com/grainy-gradients/ | 200 | **Teknik**, bukan aset: `feTurbulence` sebagai noise, dilapis gradient, dinaikkan kontrasnya | Kode SVG/CSS | Tidak ada aset berlisensi yang diunduh. `feTurbulence` adalah elemen filter di spesifikasi SVG 1.1 W3C — bebas diimplementasikan sendiri | Ya | Tidak | Tidak relevan |
| **surma.dev — Ditherpunk** | https://surma.dev/things/ditherpunk/ | 200 | Referensi ordered dithering, matriks Bayer, error diffusion | Artikel | Rujukan teknik. Matriks Bayer (Bayer 1973) adalah fakta matematis, tidak dilindungi hak cipta | Ya | Tidak | Tidak relevan |
| **Hero Patterns** | https://heropatterns.com/ | 200 | Pola SVG geometris siap pakai | SVG + CSS `data:` URI | CC BY 4.0 (badge lisensi terpasang di halaman) | Ya | **Ya** | Ya (dengan atribusi) |
| **Transparent Textures** | https://www.transparenttextures.com/ | 200 | 397 pola raster tileable transparan | PNG tileable | Teks lisensi **tidak berhasil diekstrak** dari halaman (scrape mengembalikan 0 baris). Halaman menyatakan *"Standing on the shoulders of Subtle Patterns"*; Subtle Patterns hulu berlisensi CC BY-SA 3.0 (ShareAlike, viral) | Belum terverifikasi | Kemungkinan ya | Kemungkinan ShareAlike |
| **Textures.com** | https://www.textures.com/ · https://www.textures.com/support/license | 200 / 200 | Foto tekstur besar | Beragam, akun gratis dibatasi kredit harian | Teks lisensi **tidak berhasil diekstrak** (halaman SPA, fetch hanya mengembalikan tagline *"Textures for 3D, graphic design and Photoshop!"*) | Belum terverifikasi | Belum terverifikasi | Belum terverifikasi |
| **cgbookcase** | https://www.cgbookcase.com/textures | 200 | Material PBR | 1K–8K | **Halaman lisensi tidak ada**: `/license` 404, `/faq` 404, `/about` 404, `/terms` 404. Klaim CC0 hanya dari tulisan pihak ketiga | Belum terverifikasi | Belum terverifikasi | Belum terverifikasi |
| **Pattern Monster** | https://pattern.monster/ | 200 | ±320 pola SVG parametrik | SVG / CSS / PNG | Halaman lisensi resmi tidak ditemukan; klaim MIT berasal dari tulisan pihak ketiga (`madewithsvelte.com`), bukan sumber primer | Belum terverifikasi | Belum terverifikasi | Belum terverifikasi |
| **Lost and Taken** | https://lostandtaken.com/ | 200 | Tekstur analog: kertas, grunge, film | JPG | `/terms-of-use/` mengembalikan **403** dari sini — teks lisensi tidak bisa diverifikasi | Belum terverifikasi | Belum terverifikasi | Belum terverifikasi |
| **Openverse** | https://openverse.org/ | **403** | Agregator media berlisensi CC | Beragam | Memblokir permintaan dari lingkungan ini. Lisensi bervariasi per item — harus dicek satu per satu | — | — | — |
| **Rawpixel — public domain** | https://www.rawpixel.com/public-domain | **403** | Scan kertas dan cetakan lawas domain publik | JPG/PNG | Memblokir permintaan dari lingkungan ini | — | — | — |

---

## Sumber yang ditolak, beserta alasannya

| Sumber | Alasan penolakan |
|---|---|
| Texturelabs (untuk di-commit) | Lisensi mengizinkan pemakaian di website, tapi melarang *"sub-licensed, resold, shared, transferred, or otherwise redistributed (even for free)"*. Repo publik = berkas bisa diunduh pihak ketiga sebagai berkas lepas. **Boleh dipakai, tidak boleh masuk Git.** |
| fffuel | Kalimat larangan identik: *"You cannot sublicense, resell, share, transfer, or otherwise redistribute the Images."* Tekniknya (`feTurbulence`) tetap dipakai — yang ditolak hanya meng-commit berkas keluarannya. |
| Hero Patterns | CC BY 4.0 mewajibkan atribusi. Polanya geometris-dekoratif, tidak menjawab satu pun dari 5 kebutuhan terukur proyek ini. Beban atribusi tanpa manfaat. |
| Transparent Textures | Teks lisensi tidak bisa diverifikasi dari halaman; hulunya CC BY-SA 3.0 yang ShareAlike (viral). Risiko lisensi tidak sepadan untuk pola dekoratif. |
| Textures.com | Teks lisensi tidak terekstrak (SPA). Aturan repo: aset yang belum diverifikasi membuat spec ditolak. |
| cgbookcase | Empat kandidat URL halaman lisensi semuanya 404. Tidak ada pernyataan lisensi primer yang bisa dikutip. |
| Pattern Monster | Klaim MIT hanya dari sumber sekunder. |
| Lost and Taken | Halaman terms 403. |
| Openverse, Rawpixel | 403 dari lingkungan ini; lisensi per-item bervariasi sehingga tidak bisa dijadikan sumber blanket. |
| Plat film grain video (tdcat, HolyGrain, Happy Editing, VisionColor) | Formatnya ProRes/MOV 4K untuk NLE, bukan still yang bisa dipakai sebagai `background-image`. Lisensinya juga tipe "personal + komersial, tanpa redistribusi" — masalah yang sama dengan Texturelabs. |
| Freepik / Magnific | Model lisensi berbasis akun dengan syarat atribusi yang berubah-ubah per aset; tidak bisa dikutip sebagai satu pernyataan stabil. |

---

## Prosedural vs raster — argumen berangka

### Ukuran transfer

Diukur pada berkas nyata di repo ini. `gzip -9` dipakai karena `netlify.toml` mengaktifkan gzip dan
brotli.

| Aset | Byte mentah | Byte setelah gzip -9 | Selisih |
|---|---|---|---|
| SVG `feTurbulence` inline (320×320, `fractalNoise`, 3 oktaf) | 377 | 264 | −30% |
| SVG yang sama sebagai `data:` URI di CSS (persis seperti snippet A) | 442 | — | — |
| `grain.png` (256², white noise) | 65.880 | 65.933 | **+53 (membesar)** |
| `grain-momentsingraphics-bluenoise-l512.png` | 392.823 | 392.846 | **+23 (membesar)** |
| `grain-generated-film-1024.png` | 794.420 | 794.689 | **+269 (membesar)** |

Angka terpenting di tabel ini adalah kolom ketiga: **noise tidak bisa dikompresi.** Kompresi
transport yang sudah dikonfigurasi di `netlify.toml` dan `vercel.json` memberi nol manfaat pada
tekstur grain, malah menambah beberapa puluh byte header. Sementara SVG prosedural justru menyusut
30%.

Rasio akhir: 65.880 ÷ 442 = **149×**; 794.420 ÷ 442 = **1.797×**.

### Artefak tiling

`app/hero-explore-3/thermal.css:232` memakai `grain.png` 256×256 dengan
`background-size: 180px 180px`. Konsekuensi terukur:

- Faktor skala 180 ÷ 256 = **0,703** — downsampling non-integer pada white noise menghasilkan
  aliasing; browser mengambil sampel bilinear dari butir 1-piksel yang tidak sejajar grid.
- Di viewport 1440×900 pola berulang 1440 ÷ 180 × 900 ÷ 180 = **8 × 5 = 40 ubin**. Setiap fitur
  low-frequency di dalam ubin akan terlihat 40 kali di layar yang sama.
- `app/hero-explore-4/thermal.css:10` memakai 200px → 7,2 × 4,5 ubin, dengan faktor skala 0,781.

SVG `feTurbulence` dengan `stitchTiles="stitch"` dan ukuran filter = ukuran elemen menghasilkan
**satu bidang tanpa pengulangan sama sekali**. Jumlah ubin = 1.

### Independensi resolusi

Pada layar DPR 2, viewport CSS 1440×900 berarti 2880×1800 piksel fisik. `grain.png` yang dirender
di 180px CSS menempati 360px fisik, artinya sumber 256px di-upscale 1,406×. Butir 1-piksel sumber
jadi 1,4 piksel di layar — kabur, dan justru karakter butiran-nya yang hilang.

`hash(gl_FragCoord.xy)` di shader bekerja pada koordinat framebuffer, jadi selalu tepat 1 piksel
fisik pada DPR berapa pun. Ini sudah dipakai di `app/composables/useThermalField.ts:134` dan
`app/composables/useThermalPlasma.ts:183`.

### Kontrol per frame

Film grain nyata berubah setiap frame; grain yang diam terbaca sebagai kotoran di layar, bukan
emulsi.

- Raster: satu berkas = satu pola tetap. Menganimasikan `background-position` hanya menggeser
  bidang yang sama — mata membaca gerakan tekstur, bukan butir baru. Untuk grain yang benar
  butuh N berkas terpisah (N = jumlah frame siklus) atau sprite sheet, biayanya N × 65 KB.
- Prosedural: `hash(gl_FragCoord.xy + uTime)` memberi seed baru setiap frame dengan nol byte
  tambahan. Amplitudo yang dipakai proyek ini 0,028 (≈ 7,1 dari 255) di
  `app/composables/useThermalField.ts:134`, dan ±1/255 untuk dither anti-banding di
  `app/composables/useGradientOrb.ts:47`.

### Biaya komputasi

| Jalur | Di mana dijalankan | Biaya per piksel | Catatan |
|---|---|---|---|
| `hash(gl_FragCoord.xy)` di fragment shader | GPU | 1 `dot` + 1 `sin` + 1 `fract` ≈ 3–5 ALU | Pada 2.880×1.800 = 5,18 juta piksel, di bawah 0,1 ms untuk GPU kelas apa pun |
| Sampling tekstur blue noise | GPU | 1 texture fetch | 512×512 R8 = 256 KB VRAM; cache-friendly, tapi memakan slot texture unit dan bandwidth memori |
| Tekstur dibangkitkan runtime dengan `Math.random()` | CPU sekali, lalu GPU | 1 texture fetch | Jalur ketiga yang sudah terbukti di repo: `app/composables/useFluidSimulation.ts:925–930` membuat tekstur dither 128×128 RGB = 49.152 byte VRAM dengan **0 byte transfer jaringan** |
| SVG `feTurbulence` | **CPU** (rasterizer browser, Skia) | Perlin noise per piksel per oktaf | Dirasterisasi sekali saat paint lalu di-cache jadi bitmap. Kalau `baseFrequency` atau `seed` dianimasikan, raster ulang tiap frame — inilah sumber jank. **Hanya untuk grain statis.** |
| `repeating-linear-gradient` (scanline) | GPU (compositor) | Praktis nol | ~90 byte CSS |

### Spektrum: white noise vs blue noise vs hash

Ini alasan teknis mengganti `grain.png`, bukan alasan selera.

- `grain.png` punya σ = 74,113 dari mean 127,713. Deviasi teoretis noise uniform 8-bit adalah
  255/√12 = 73,6. Kecocokannya berarti isinya **white noise uniform** — energi merata di semua
  frekuensi, termasuk frekuensi rendah.
- Pada opacity rendah yang dipakai proyek ini (0,16 di `thermal.css`, 0,07 di
  `hero-explore-4/thermal.css`), komponen frekuensi rendah itulah yang paling terlihat: hasilnya
  bercak lembut, bukan butiran.
- Blue noise dibangkitkan dengan metode void-and-cluster sehingga energi frekuensi rendahnya
  ditekan. Pada opacity yang sama hasilnya butiran halus merata tanpa gumpalan. σ-nya sama
  (73,900) tetapi distribusi spasialnya berbeda — dan distribusi spasial itulah yang dilihat mata.
- `hash()` di shader menghasilkan white noise. Untuk grain yang bergerak per frame ini justru
  benar (mata mengintegrasikan antar frame). Untuk dither statis pada gradien, blue noise dari
  tekstur menang.

### Matriks keputusan

| Situasi | Yang menang | Alasan berangka |
|---|---|---|
| Grain di dalam shader yang memang sudah berjalan | Prosedural `hash()` | 0 byte transfer, seed per frame gratis, tepat 1 piksel fisik di DPR berapa pun |
| Grain overlay CSS di atas DOM statis | SVG `feTurbulence` inline | 442 byte vs 65.880 byte (149×); `stitchTiles` membuat jumlah ubin = 1, bukan 40 |
| Grain overlay CSS yang harus bergerak | Raster + `animation` `steps()` | `feTurbulence` yang dianimasikan meraster ulang di CPU setiap frame |
| Dither anti-banding pada gradien gelap | Raster blue noise, atau matriks Bayer | Butuh distribusi spektral spesifik; `hash()` acak justru menambah energi frekuensi rendah |
| Halftone / dot screen | Prosedural | Butuh sudut, pitch, dan threshold terhadap luminance yang dihitung runtime |
| Serat kertas, print artifact, goresan | Raster foto | Struktur berkorelasi non-Gaussian; tidak ada fungsi noise pendek yang menirunya secara meyakinkan |
| Scanline / CRT | Prosedural CSS | `repeating-linear-gradient` ≈ 90 byte, resolution-independent |
| Risograph misregistration | Prosedural | Offset kanal RGB adalah tiga sampling bergeser, bukan berkas |

**Ambang praktis:** kalau polanya bisa ditulis di bawah 1 KB sebagai fungsi atau gradient, jangan
buat berkas. Kalau butuh di atas 1 KB **dan** datanya tidak bisa dikompresi (noise, foto), berkas
raster menang karena kode prosedural yang setara akan lebih mahal di CPU/GPU daripada satu texture
fetch.

---

## Pemetaan kebutuhan proyek ke sumber

Kelima kebutuhan di bawah berasal dari `references/visual/README.md` dan
`references/visual/01-thermal-plasma.md` — bukan daftar keinginan.

### 1. Film grain / dither — 14 dari 14 referensi termal punya ini

Aturan yang diturunkan di `visual/01-thermal-plasma.md`: *"Grain wajib. 14 dari 14 punya film grain
atau dither. Tanpa itu, gradien terlihat seperti CSS gradient."*

| Konteks | Pakai | Berkas / snippet |
|---|---|---|
| Di dalam shader termal yang sudah jalan | Prosedural | `hash(gl_FragCoord.xy + uTime)` amplitudo 0,028 — sudah ada di `app/composables/useThermalField.ts:134` |
| Dither anti-banding pada gradien gelap 8-bit | Prosedural, amplitudo ±1/255 | Sudah ada di `app/composables/useGradientOrb.ts:47` |
| Overlay CSS statis di atas DOM | SVG `feTurbulence` inline | Snippet A di bawah, 442 byte |
| Overlay CSS yang butuh butiran presisi 1 piksel | Raster blue noise | `public/assets/textures/grain-momentsingraphics-bluenoise-l512.png` (CC0) |
| Grain kromatik (butir R, G, B bergeser sendiri-sendiri) | Raster blue noise 3 kanal independen | `public/assets/textures/grain-momentsingraphics-bluenoise-rgb256.png` (CC0) |
| Grain menggumpal seperti emulsi, area besar | Raster | `public/assets/textures/grain-generated-film-1024.png` (σ 26,5 — menggumpal, bukan white noise) |

Sumber eksternal cadangan bila butuh scan emulsi asli: kategori **Film** di Texturelabs
(https://texturelabs.org/textures/film/, 200) — **jangan di-commit**, unduh manual dan simpan di
luar Git.

### 2. Halftone dot raster, pitch ~2–3 px — `vr-thermal-halftone-fluid`

Pitch 2–3 px berarti dot screen harus dihitung terhadap `gl_FragCoord`, bukan diambil dari ubin
raster: pada DPR 2 ubin 2 px akan di-resample dan moiré-nya langsung terlihat.

- **Utama: prosedural.** Sudah ada implementasinya di `app/composables/useThermalField.ts:131-132`
  dan `app/composables/useThermalPlasma.ts:180-181`.
- **Cadangan raster** untuk halftone yang di-CSS atau pitch besar:
  `public/assets/textures/halftone-generated-clustered-8x8.png` — matriks clustered-dot 8×8
  (screen 45°), 140 byte. Pasang dengan filter `NEAREST` dan wrap `REPEAT`.

### 3. Risograph misregistration / print artifact — `vr-overheat-portrait`

Misregistration adalah **offset kanal**, bukan tekstur: tiga sampling bergeser per kanal RGB.
`visual/README.md` sudah mencatat tekniknya sebagai *"chromatic fringe — tiga sampling offset per
kanal RGB"*. Tidak ada berkas yang perlu diunduh.

Yang memang butuh raster adalah **serat kertas tempat tinta itu duduk**:
`public/assets/textures/paper-ambientcg-paper001-1k.jpg` (CC0, ambientCG `Paper001`, 1024×600).
Perhatian: std dev-nya hanya 3,046/255, jadi wajib dinaikkan kontrasnya
(`filter: contrast(6) grayscale(1)`) sebelum di-blend, kalau tidak dia tidak terlihat sama sekali.

### 4. Scanline / CRT — kategori `visual/03-scanline-contour.md`

Prosedural menang mutlak. `repeating-linear-gradient` ≈ 90 byte, tajam di DPR berapa pun, dan
pitch-nya bisa diikat ke `1px` fisik lewat `@media (min-resolution: 2dppx)`. Tidak ada berkas yang
di-download untuk kebutuhan ini — snippet C di bawah.

Untuk scanline yang mengikuti kontur luminance (seperti `vr-scanline-face-coral`), tekniknya sudah
tercatat di `visual/README.md`: quantize `uv.y`, offset `uv.x` oleh luminance. Juga prosedural.

### 5. Paper / dust / scratch — tekstur analog

| Kebutuhan | Sumber | Status |
|---|---|---|
| Serat kertas | ambientCG `Paper001`–`Paper006`, `Cardboard001`–`Cardboard004` (CC0) | Sudah diunduh: `paper-ambientcg-paper001-1k.jpg` |
| Kertas beragam permukaan | Poly Haven (CC0) | Boleh di-commit |
| Debu dan goresan | Texturelabs kategori **Grunge** (https://texturelabs.org/textures/grunge/, 200) | Boleh dipakai, **jangan di-commit** |
| Goresan garis tipis | Prosedural: garis acak beramplitudo kecil di shader | Tidak butuh berkas |

---

## Snippet siap tempel

### A — Grain prosedural SVG `feTurbulence`

Blok CSS. SVG mentahnya 377 byte (gzip 264 byte); sebagai `data:` URI di dalam CSS seperti tertulis
di bawah = **442 byte**. `stitchTiles="stitch"` yang menghilangkan jahitan; `baseFrequency` 0.82
memberi butir ±1 piksel pada DPR 1.

Sudah diverifikasi merender di Chrome headless, bukan hanya divalidasi XML-nya. Diukur dari
screenshot 1020×330: panel dengan `data:` URI ini sendirian di atas `#808080` menghasilkan
standard deviation **18,49**; panel dengan parameter lengkap kelas di bawah (`opacity: 0.18` +
`mix-blend-mode: overlay`) di atas `#3A1A9E` menghasilkan **1,63**; panel `#3A1A9E` polos
menghasilkan **0**. ImageMagick tidak bisa dipakai untuk verifikasi ini — rasterizer SVG-nya
mengabaikan elemen filter dan mengembalikan bidang kosong (std dev 0).

```css
.grain-svg {
  position: absolute;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  opacity: 0.18;
  mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type='linear' slope='2.4' intercept='-0.7'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E");
}

@media (min-resolution: 2dppx) {
  .grain-svg {
    background-size: 160px 160px;
    opacity: 0.13;
  }
}

@media (prefers-reduced-motion: reduce) {
  .grain-svg { opacity: 0.1; }
}
```

Parameter yang boleh diubah dan efeknya:

| Atribut | Nilai di snippet | Efek |
|---|---|---|
| `baseFrequency` | `0.82` | Naik → butir lebih halus. 0.65 = butir kasar, 0.95 = nyaris 1 piksel |
| `numOctaves` | `3` | Naik → lebih banyak detail dan lebih mahal di CPU. Di atas 4 tidak terlihat bedanya pada opacity < 0,2 |
| `type` | `fractalNoise` | `turbulence` menghasilkan nilai absolut → gumpalan gelap, terbaca sebagai noda, bukan grain |
| `slope` / `intercept` | `2.4` / `-0.7` | Kontras alfa. Naikkan `slope` untuk butir lebih tegas |
| `stitchTiles` | `stitch` | **Wajib.** Tanpa ini ada jahitan terlihat di batas ubin |

Jangan menganimasikan `baseFrequency` atau `seed` — browser meraster ulang filter di CPU setiap
frame. Untuk grain bergerak, pakai jalur shader atau raster.

### B — Bayer 8×8 ordered dither di GLSL

Bentuk rekursif, tanpa array dan tanpa texture fetch. Terverifikasi menghasilkan persis matriks
kanonik Bayer 8×8 (permutasi lengkap 0–63; baris pertama × 64 = `0 32 8 40 2 34 10 42`).

```glsl
float bayer2(vec2 a) {
  a = floor(a);
  return fract(a.x * 0.5 + a.y * a.y * 0.75);
}

#define bayer4(a)  (bayer2(0.5 * (a)) * 0.25 + bayer2(a))
#define bayer8(a)  (bayer4(0.5 * (a)) * 0.25 + bayer2(a))

vec3 orderedDither(vec3 col, vec2 fragCoord, float levels) {
  float t = bayer8(fragCoord) - 0.5;
  return floor(col * levels + t) / (levels - 1.0);
}

vec3 debandDither(vec3 col, vec2 fragCoord) {
  float t = (bayer8(fragCoord) - 0.5) / 255.0;
  return col + t;
}
```

`bayer8()` mengembalikan nilai di rentang [0, 1) dengan langkah 1/64.

`orderedDither()` untuk posterisasi terkontrol — `levels = 6.0` menghasilkan tampilan cetak
6-tingkat. `debandDither()` untuk menghapus banding 8-bit pada gradien gelap; amplitudonya 1/255,
setara dengan yang sudah dipakai di `app/composables/useGradientOrb.ts:47`.

Kalau lebih suka jalur tekstur — misalnya karena ingin menukar matriks tanpa menyentuh shader —
pakai `public/assets/textures/dither-generated-bayer-8x8.png` dengan wrap `REPEAT` dan filter
`NEAREST`. Filter `LINEAR` akan menginterpolasi antar sel dan merusak ambangnya.

```glsl
uniform sampler2D uBayer;

float bayerFromTexture(vec2 fragCoord) {
  return texture(uBayer, fragCoord / 8.0).r;
}
```

```ts
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT)
```

### C — Scanline prosedural CSS

```css
.scanline {
  position: absolute;
  inset: 0;
  z-index: 41;
  pointer-events: none;
  opacity: 0.22;
  mix-blend-mode: multiply;
  background-image: repeating-linear-gradient(
    to bottom,
    rgba(5, 5, 7, 0.85) 0,
    rgba(5, 5, 7, 0.85) 1px,
    transparent 1px,
    transparent 4px
  );
}

@media (min-resolution: 2dppx) {
  .scanline {
    background-image: repeating-linear-gradient(
      to bottom,
      rgba(5, 5, 7, 0.85) 0,
      rgba(5, 5, 7, 0.85) 0.5px,
      transparent 0.5px,
      transparent 2px
    );
  }
}
```

### D — Halftone clustered-dot di GLSL

Pitch dalam piksel fisik, sudut 45° seperti screen cetak. Cocok untuk
`vr-thermal-halftone-fluid` (pitch ~2 px) tanpa berkas apa pun.

```glsl
float halftone(vec2 fragCoord, float luma, float pitch, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  vec2 p = mat2(c, -s, s, c) * fragCoord / pitch;
  float d = length(fract(p) - 0.5) * 2.0;
  return smoothstep(luma - 0.08, luma + 0.08, d);
}
```

Nilai `angle` yang dipakai cetak empat warna: 0,2618 rad (15°) untuk cyan, 1,3090 rad (75°) untuk
magenta, 0,0 untuk kuning, 0,7854 rad (45°) untuk hitam. Sudut yang sama untuk dua kanal
menghasilkan moiré.

---

## Aturan repo

1. Berkas tekstur apa pun yang di-commit wajib punya baris di `public/assets/textures/CREDITS.md`
   dengan kutipan lisensi verbatim.
2. Selama `github.com/billymaulana/billymaulana-portofolio` masih publik, hanya lisensi yang
   mengizinkan redistribusi (CC0, MIT, atau milik sendiri) yang boleh masuk `public/assets/`.
   Texturelabs dan fffuel boleh dipakai, tapi berkasnya disimpan di luar Git.
3. Sebelum menambah sumber ke tabel di atas, jalankan
   `curl -sIL -o /dev/null -w "%{http_code}" <url>` dan catat status codenya apa adanya.
4. Sebelum menambahkan berkas raster, jawab dulu matriks keputusan di atas. Kalau polanya bisa
   ditulis di bawah 1 KB sebagai fungsi atau gradient, berkas itu tidak boleh dibuat.
