# Visual Reference Library — Poster & Still Image

Dikirim Billy 2026-07-26 sebagai dua folder (`Billy Web Portofolio` dan `Billy Web Portofolio (1)`),
dengan pernyataan: *"ini adalah style style warna yang ingin saya masukkan ke portofolio saya."*

26 gambar unik, seluruhnya sudah disalin ke `assets/` dan dianalisis satu per satu.

Berbeda dari `../library/` yang berisi **situs hidup** (typography terukur, grid, motion),
folder ini berisi **still image** — poster, cover, dan artwork. Yang diambil dari sini adalah
**palet, teknik render, dan hubungan tipografi↔latar**, bukan metrik tipografi.

---

## Temuan utama: satu sistem warna, bukan enam

Dari 26 gambar, **tidak ada satu pun** yang memakai warna aksen di luar sumbu **violet → oranye**.
Ini bukan koleksi selera acak; ini satu palet yang konsisten.

| Peran | Rentang hex terukur | Muncul di |
|---|---|---|
| **Ground** | `#140F16` – `#191022` | 26 / 26 |
| **Dingin** | `#2D2D5D` – `#471465` (indigo → violet dalam) | 24 / 26 |
| **Mid** | `#4F3DA5` – `#75327A` (violet) | 22 / 26 |
| **Transisi** | `#8C1BAB` – `#B84399` (magenta) | 18 / 26 |
| **Pink panas** | `#C371A1` – `#D56A92` | 15 / 26 |
| **Panas** | `#DE7147` – `#F39569` (oranye) | 16 / 26 |
| **Puncak** | `#EEAB17` – `#F8D221` (amber → kuning) | 14 / 26 |
| **Terpanas** | `#FBC294` – `#F6F2E6` (**cream, bukan putih**) | 12 / 26 |
| **Tipografi** | `#E9E4D8` – `#FFFFFF` | 26 / 26 |

Angka di atas **diekstrak dari piksel**, bukan dikira-kira: tiap gambar di-downsample ke 120px,
dikelompokkan ke 8 bucket luminance, diambil warna rata-rata per bucket. Prosedurnya diulang di
`01-thermal-plasma.md` lengkap dengan persentase bidang per zona.

Urutannya persis **colormap termal** (`inferno` / `magma` / `plasma` dari matplotlib):
hitam → violet → magenta → oranye → kuning → putih.

**Konsekuensi untuk portofolio:** palet identitas Billy `#0f0a72` (indigo dalam) jatuh **tepat di
zona "dingin"** ramp ini. Artinya thermal ramp bisa dibangun tanpa mengganti palet brand — indigo
identitas jadi titik terdingin sistem. Ini yang dipakai di
`../../specs/2026-07-26-hero-explore-3-thermal.md`.

Satu-satunya pengecualian: `vr-grind-thermal-face` memakai varian **hijau-neon → cyan** sebagai
zona panas, bukan oranye. Itu colormap termal juga, hanya kanal berbeda.

---

## Dua strategi tipografi, tegas terbagi

Setiap gambar jatuh ke salah satu — tidak ada yang di tengah.

**(a) Tipografi MENYATU dengan latar** — 11 gambar
Lewat oklusi (subjek menutupi huruf), warp (huruf ikut aliran), knockout (huruf memotong cahaya),
atau chromatic fringe. Contoh terkuat: `vr-listener-liquid-type`, `vr-wegodown-thermal-arc`,
`vr-ignite-thermal-hands`, `vr-distort-liquify-statue`.

**(b) Tipografi DATAR melawan latar** — 15 gambar
Grotesk putih tegak lurus, tanpa blend mode, sengaja kontras terhadap kekacauan di belakangnya.
Contoh: `vr-freedom-marble-isoline`, `vr-echo-magma-portrait`, `vr-ethereal-halftone-wing`.

Keduanya sah. Yang **tidak pernah muncul**: tipografi setengah-menyatu, drop shadow, glow lembut
di sekeliling huruf sebagai "keterbacaan". Kalau menyatu, menyatu total; kalau datar, datar penuh.

---

## Kategori

| File | Jumlah | Inti |
|---|---|---|
| [01 — Thermal / Plasma](01-thermal-plasma.md) | 14 | Colormap termal pada field fluid atau foto. Kategori terbesar dan paling dominan. |
| [02 — Liquid Chrome / Iridescent](02-liquid-chrome-iridescent.md) | 3 | Material 3D cair dengan thin-film interference. |
| [03 — Scanline / Contour](03-scanline-contour.md) | 2 | Siluet wajah dibangun dari garis kontur horizontal. |
| [04 — Grainy Gradient / Halftone](04-grainy-gradient.md) | 2 | Gradien bergrain kasar dan raster dot. |
| [05 — Cyber / Techno HUD](05-cyber-techno-hud.md) | 1 | Objek 3D + neon tendrils + tipografi teknis. |
| [06 — Sculptural Neon](06-sculptural-neon.md) | 2 | Patung klasik dengan rim-light neon. |
| [07 — Editorial Poster](07-editorial-poster.md) | 2 | Didone display + gradient noise, tanpa thermal. |

---

## Yang BUKAN diambil dari folder ini

Beberapa gambar memakai konvensi yang bertabrakan dengan aturan repo. Dicatat agar tidak
diterapkan secara tidak sengaja:

- **Blackletter/gothic display** (`vr-dominate-liquid-hand`) — huruf saling berpotongan sampai
  nyaris ilegibel. Sah untuk cover album, gagal untuk portofolio yang harus terbaca.
- **Poster padat tanpa ruang kosong** (`vr-overheat-portrait`, `vr-cddrive-cyber-hud`) — kepadatan
  itu bekerja pada cetakan A3, tapi melanggar "negative space as design element" untuk layar.
- **Foto stok manusia sebagai subjek utama** (`vr-echo-magma-portrait`, `vr-grind-thermal-face`) —
  yang bernilai adalah **tekniknya** (echo buffer, thermal LUT), bukan fotonya. Lihat catatan
  keputusan tidak-memakai-foto di blok 3 spec hero-explore-3.

---

## Teknik yang bisa langsung dijadikan shader

Diurutkan dari yang paling siap pakai:

| Teknik | Sumber | Inti implementasi |
|---|---|---|
| Colormap termal 7-stop | 14 gambar | `mix()` berantai dengan `smoothstep` per segmen |
| Domain-warped fbm | `vr-plasma-smooth-warp`, `vr-memories-rimlight-fold` | `fbm(p + fbm(p + fbm(p)))` |
| Isoline band tajam | `vr-freedom-marble-isoline` | `fract(n * 5.0)` + `smoothstep` sempit di batas |
| Directional blur vertikal | `vr-wegodown-thermal-arc` | akumulasi 10–32 sample berbobot menurun satu sumbu |
| Halftone dot raster | `vr-thermal-halftone-fluid`, `vr-ethereal-halftone-wing` | `length(fract(gl_FragCoord.xy / px) - 0.5)` vs luminance |
| Slit-scan horizontal | `vr-future-slitscan-face` | `uv.x += sin(uv.y * 90.0) * step(threshold, luma)` |
| Echo buffer / feedback | `vr-echo-magma-portrait` | ping-pong FBO, `mix(prev(uv - drift), current, 0.18)` |
| Rim-light tepi gradien | `vr-memories-rimlight-fold` | `pow(1.0 - abs(dot(normal, viewDir)), 3.0)` dari turunan height |
| Scanline kontur siluet | `vr-scanline-face-coral` | quantize `uv.y`, offset `uv.x` oleh luminance |
| Chromatic fringe | `vr-overheat-portrait` | tiga sampling offset per kanal RGB |
| Thin-film iridescence | `vr-dominate-liquid-hand` | cosine palette pada `dot(normal, viewDir)`, fase RGB 0.0/0.15/0.35 |

---

## Dipakai di mana

- **`hero-explore-3`** (`../../specs/2026-07-26-hero-explore-3-thermal.md`) memakai kategori 01
  sebagai basis: colormap termal 8-stop, domain-warped curl advection, isoline amber, halftone,
  directional bleed vertikal, dan tipografi sebagai **knockout** (`vr-wegodown-thermal-arc`).
