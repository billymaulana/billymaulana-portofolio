# Spec — hero-explore-4 · THERMAL BODY

Tanggal: 2026-07-26 · Route: `/hero-explore-4` · Status: spec, belum dibangun

---

## 1 — Header

Hero portofolio Billy Maulana di route baru `/hero-explore-4`, dibangun di atas stack
**Nuxt 4.3 + Vue 3 `<script setup>` + TypeScript strict + UnoCSS (Wind4) + GSAP + WebGL2**
(bukan React, bukan Tailwind CDN, bukan Framer Motion).

Mekanik utamanya satu kalimat: **masthead adalah sumber panas.** Nama "BILLYMAULANA" menyuntikkan
temperatur ke sebuah medan panas yang dipecahkan lewat persamaan difusi + buoyancy, sehingga
gumpalan panas naik dari letterform ke ruang kosong di atasnya. Kursor menambahkan turbulensi
lewat solver Navier-Stokes yang sudah ada di repo, yang menggeser plume itu dan melelehkan huruf
lewat displacement. Dua medan, satu colormap termal 9-stop — sehingga terbaca sebagai satu material
dengan dua skala waktu: ruangan yang hangat, dan kursor yang lebih panas.

Route ini TIDAK menyentuh `/`. Homepage tetap apa adanya.

---

## 2 — Fonts

Tidak ada dependency font baru. Tidak ada keputusan font baru yang diambil dari inventaris.

Acuan yang dibuka sebelum blok ini diisi (wajib per anti-slop rule 2026-07-26):
`references/typography-execution-patterns.md` §4 (italic selektif), §5 (pasangan sefamili),
§10 (weight ringan pada ukuran besar); entri library `jasonbergh` (149.76px w200),
`dulcedo` (140px w300), `silent-house` (160px w450).

| Peran | Famili | Weight | Cara load | Elemen |
|---|---|---|---|---|
| Masthead | **Bebas Neue** | 400 | `@fontsource/bebas-neue` (sudah di `package.json:22`) | `.h4__name` + raster WebGL |
| Body / tagline | **Suisse Int'l** | 400 | `@font-face` `main.css:80` → `/assets/fonts/suisse/SuisseIntl-Book.otf` | `.h4__tagline` |
| Aksen italic | **Apparel** | 400 italic | `@font-face` `main.css:88` → `/assets/fonts/apparel/Apparel-RegularIt.woff2` | `.h4__tagline-voice` |
| Label / meta | **Suisse Int'l** | 400 | sama dengan body | `.h4__meta` |

**Keputusan yang diambil di blok ini, beserta alasannya:**

1. **`'Obviously'` DIHAPUS dari font stack.** Satu-satunya file Obviously di repo adalah
   `Obviously-CondensedBlack.woff2` (`main.css:97-103`) — font yang tercatat ditolak **2×** di
   `failures/INDEX.md` baris 31. `SectionHero.vue:507` masih menempatkannya sebagai pilihan pertama
   sementara raster WebGL-nya diukur dengan Bebas Neue (`SectionHero.vue:25`), jadi DOM dan WebGL
   saat ini merender famili yang berbeda. Route baru memakai Bebas Neue di kedua jalur.
2. **Bebas Neue tidak ada di tabel font-ditolak.** Weight 400 pada ukuran display ekstrem sejalan
   dengan §10 — berat bukan syarat monumentalitas.
3. **Kontras skeleton terpenuhi**: Bebas Neue (grotesk kondens) × Apparel (serif italic) = sumbu
   serif vs sans aktif, bukan tiga sans yang diulang seperti kegagalan `2026-07-26-hero-explore-3-thermal`.
4. **Nol monospace** di seluruh route, termasuk label, meta, dan angka.

---

## 3 — Assets

Semua aset lokal. Tidak ada aset eksternal, tidak ada signature ber-expiry.
Status diverifikasi lewat `ls -la` pada 2026-07-26, bukan asumsi.

| KONSTANTA | Path | Status |
|---|---|---|
| `GRAIN_TEXTURE` | `public/assets/textures/grain.png` | **ADA** — 65.880 byte |
| `FONT_BEBAS` | `node_modules/@fontsource/bebas-neue` | **ADA** — `package.json:22` `^5.2.7` |
| `FONT_SUISSE` | `public/assets/fonts/suisse/SuisseIntl-Book.otf` | **ADA** |
| `FONT_APPAREL` | `public/assets/fonts/apparel/Apparel-RegularIt.woff2` | **ADA** |
| `LOGO_WHITE` | `public/assets/images/logo/billy-maulana-logo-white.svg` | **ADA** |

Tidak ada video. Tidak ada footage stock. Hapus semua teks dari halaman ini dan masih ada karya
yang bergerak — syarat EMPTY TEST terpenuhi by construction.

---

## 4 — Struktur per layer, urut z-index

Root: `app/hero-explore-4/ThermalBody.vue`, dipanggil dari `app/pages/hero-explore-4.vue`.

| # | z-index | Elemen | Class UnoCSS / CSS lengkap |
|---|---|---|---|
| 1 | — | `<section class="h4">` | `relative w-full h-[100dvh] overflow-hidden` + `background: #050507` |
| 2 | `z-1` | `<canvas class="h4__plasma">` | `absolute inset-0 z-1 w-full h-full pointer-events-none` |
| 3 | `z-3` | `<canvas class="h4__fluid">` | `absolute inset-0 z-3 w-full h-full` + `mix-blend-mode: screen` + `pointer-events: auto` |
| 4 | `z-4` | `<div class="h4__grain">` | `absolute inset-0 z-4 pointer-events-none` + `opacity: 0.07; mix-blend-mode: overlay` |
| 5 | `z-5` | `<div class="h4__names">` (masthead DOM, entrance saja) | `absolute inset-0 z-5 pointer-events-none` |
| 6 | `z-6` | `<p class="h4__tagline">` | `absolute z-6 pointer-events-none text-center` |
| 7 | `z-6` | `<div class="h4__meta">` | `absolute z-6 flex items-baseline justify-between pointer-events-none` |

`.h4__plasma` TIDAK memakai blend mode — ia adalah ground. `.h4__fluid` memakai `screen` supaya
panas kursor menambah energi di atas ground, bukan menggantikannya.

---

## 5 — Blok CSS/GLSL siap tempel

### 5A — Colormap termal (dipakai IDENTIK di kedua shader)

Diambil verbatim dari `app/composables/useThermalField.ts:48-68` — satu-satunya bagian yang
Billy setujui dari iterasi sebelumnya (*"shades thermalnya bagus"*). **DILARANG diubah.**

```glsl
const vec3 C0 = vec3(0.020, 0.020, 0.027);
const vec3 C1 = vec3(0.059, 0.039, 0.447);
const vec3 C2 = vec3(0.227, 0.102, 0.620);
const vec3 C3 = vec3(0.420, 0.184, 0.784);
const vec3 C4 = vec3(0.639, 0.169, 0.659);
const vec3 C5 = vec3(0.831, 0.361, 0.431);
const vec3 C6 = vec3(0.933, 0.541, 0.165);
const vec3 C7 = vec3(0.961, 0.784, 0.118);
const vec3 C8 = vec3(0.984, 0.863, 0.765);

vec3 thermal(float t) {
  t = clamp(t, 0.0, 1.0);
  if (t < 0.13) return mix(C0, C1, smoothstep(0.00, 0.13, t));
  if (t < 0.28) return mix(C1, C2, smoothstep(0.13, 0.28, t));
  if (t < 0.43) return mix(C2, C3, smoothstep(0.28, 0.43, t));
  if (t < 0.56) return mix(C3, C4, smoothstep(0.43, 0.56, t));
  if (t < 0.68) return mix(C4, C5, smoothstep(0.56, 0.68, t));
  if (t < 0.80) return mix(C5, C6, smoothstep(0.68, 0.80, t));
  if (t < 0.90) return mix(C6, C7, smoothstep(0.80, 0.90, t));
  return mix(C7, C8, smoothstep(0.90, 1.00, t));
}
```

Stop 0.13 = `#0F0A72` = identitas Billy. Titik terpanas `#FBDCC3` cream, **bukan** putih murni.

### 5B — Isoline + halftone + grain (finishing pass, dipakai di kedua shader)

Verbatim dari `useThermalField.ts:85-95`. Ini yang membuat gradien terbaca sebagai **data**,
bukan blur Photoshop.

```glsl
float band = fract(h * 5.0);
float iso = smoothstep(0.965, 0.995, band) - smoothstep(0.995, 1.0, band);
col += vec3(1.0, 0.62, 0.16) * iso * 0.34 * smoothstep(0.12, 0.4, h);

float px = 3.0;
vec2 cell = floor(gl_FragCoord.xy / px);
float dot_ = length(fract(gl_FragCoord.xy / px) - 0.5);
float halftone = smoothstep(0.52, 0.18, dot_ * (1.35 - h));
col = mix(col, col * 0.82, (1.0 - halftone) * smoothstep(0.30, 0.85, h) * 0.55);

col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.028;
```

### 5C — Shader simulasi background: persamaan panas + buoyancy

File baru `app/composables/useThermalPlasma.ts`. Fragment shader step, dijalankan pada FBO
ping-pong `RGBA16F` beresolusi **192 × 108**, filter `LINEAR`.

State per texel: `R = T` (temperatur 0..1) · `G = w` (kecepatan vertikal, bertanda) · `B = shear`
(kecepatan horizontal, bertanda) · `A` tidak dipakai.

```glsl
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uState;
uniform sampler2D uSource;
uniform vec2  uTexel;
uniform float uTime;
uniform float uDt;
uniform vec2  uPointer;
uniform float uPointerHeat;

const float KAPPA      = 0.14;
const float BUOYANCY   = 0.90;
const float T_AMBIENT  = 0.06;
const float W_DAMP     = 0.982;
const float COOL_MULT  = 0.9965;
const float COOL_RAD   = 0.0022;
const float ADVECT     = 0.62;
const float SOURCE_GAIN = 0.55;

void main() {
  vec4 s = texture(uState, vUv);
  float T = s.r;
  float w = s.g;
  float u = s.b;

  vec4 l = texture(uState, vUv - vec2(uTexel.x, 0.0));
  vec4 r = texture(uState, vUv + vec2(uTexel.x, 0.0));
  vec4 b = texture(uState, vUv - vec2(0.0, uTexel.y));
  vec4 t = texture(uState, vUv + vec2(0.0, uTexel.y));

  float lap = (l.r + r.r + b.r + t.r) - 4.0 * T;
  T += KAPPA * lap;

  w += (T - T_AMBIENT) * BUOYANCY * uDt;
  w *= W_DAMP;

  float shear = 0.18 * sin(vUv.y * 3.1 + uTime * 0.11)
              + 0.11 * sin(vUv.y * 7.3 - uTime * 0.07);
  u = mix(u, shear, 0.04);

  vec2 back = vUv - vec2(u, w) * uDt * ADVECT;
  vec4 adv = texture(uState, back);
  T = adv.r;
  w = adv.g;

  float src = texture(uSource, vUv).r;
  T += src * SOURCE_GAIN * uDt;

  float pd = length((vUv - uPointer) * vec2(uTexel.y / uTexel.x, 1.0));
  T += exp(-pd * pd / 0.0009) * uPointerHeat * uDt;

  T *= COOL_MULT;
  T -= COOL_RAD * T * T;
  T = clamp(T, 0.0, 1.0);

  fragColor = vec4(T, w, u, 1.0);
}
```

`uSource` = raster masthead (kanal merah = tinta huruf). **Huruf adalah sumber panas.**

### 5D — Mode display termal pada fluid yang sudah ada

Di `app/composables/useFluidSimulation.ts`, `contentDisplayShaderSource` (baris 635-674) ditambah
cabang `uMode == 2.0`. **Cabang 0 dan 1 tidak boleh disentuh** — mode 0 dipakai `/` dan sedang
approved. Solver (advection, divergence, tekanan, vorticity) **tidak boleh disentuh sama sekali.**

```glsl
} else {
  float speed = length(vel);
  float heat = clamp(presence * 0.62 + speed * 0.0042, 0.0, 1.0);
  heat = pow(heat, 0.82);

  vec3 hot = thermal(heat);
  float cover = smoothstep(0.015, 0.30, heat);

  base.g = sh.g;
  base.b = sh.b;
  col = mix(base, max(base, hot), cover);
}
```

`presence` = kanal `.b` dari buffer dye (density jejak kursor, `useFluidSimulation.ts:628-630`).
`speed` = magnitudo kanal `.rg` (vektor kecepatan). Panas = energi fluida — persis yang ditampilkan
kamera termal.

---

## 6 — Algoritma mekanik inti, langkah demi langkah

### 6A — Loop background (`useThermalPlasma.ts`), per frame

1. `dt = min((now - last) / 1000, 0.033)`, fixed clamp — cegah lompatan saat tab kembali aktif.
2. Bind FBO `write`, jalankan shader 5C dengan `uState = read`, `uDt = dt`, `uTime += dt`.
3. Swap `read` ↔ `write`.
4. Render pass tampilan: baca `T` dari `read`, terapkan `thermal(T)` (5A), lalu 5B, lalu tulis
   ke canvas.
5. `uPointerHeat` = `clamp(pointerSpeedPx * 0.0026, 0.0, 0.9)`, diturunkan ke 0 dengan
   lerp faktor `0.055` per frame saat pointer diam.

**Emitter tetap** selain masthead — 3 titik di bawah tepi bawah supaya plume masuk dari luar frame,
ditambahkan ke `uSource` di CPU sebagai gaussian pada texture sumber:

| # | posisi uv | radius | amplitudo | fase |
|---|---|---|---|---|
| 1 | `(0.18, -0.06)` | 0.090 | 0.85 | 0.0 |
| 2 | `(0.52, -0.08)` | 0.075 | 0.70 | 2.1 |
| 3 | `(0.83, -0.05)` | 0.085 | 0.80 | 4.2 |

Amplitudo dimodulasi `0.5 + 0.5 * sin(uTime * 0.23 + fase)` — periode ~27 detik, cukup lambat
untuk tidak terbaca sebagai loop.

### 6B — Distribusi bidang, WAJIB diukur bukan dikira

Aturan kategori termal (`references/visual/01-thermal-plasma.md`, Mode A — komposisi bertipografi):

| Zona | Target | Cara ukur |
|---|---|---|
| Ground gelap (`T < 0.13`) | **40–53%** | histogram piksel screenshot idle |
| Violet (`0.13 ≤ T < 0.56`) | 26–35% | idem |
| Magenta–pink (`0.56 ≤ T < 0.80`) | 11–17% | idem |
| Oranye ke atas (`T ≥ 0.80`) | **maksimal 25%, target 8–21%** | idem |

Verifikasi: screenshot idle 3 detik → histogram luminance 8 bucket. Kalau oranye-ke-atas > 25%,
turunkan `SOURCE_GAIN` bertahap 0.05 sampai masuk rentang. **Jangan** menurunkan `BUOYANCY` —
itu yang membuat geraknya hidup.

### 6C — Masthead sebagai sumber panas

1. `useMastheadRaster` (sudah ada, `useTextDistortion.ts`) merender "BILLYMAULANA" ke offscreen canvas.
2. Canvas itu di-upload ke DUA tempat: `fluid.setContentCanvas()` (sudah ada) DAN
   `plasma.setSourceCanvas()` (baru).
3. Di `useThermalPlasma`, raster diturunkan ke 192×108 sekali saat resize, dipakai sebagai `uSource`.
4. Konsekuensi komposisi: gumpalan panas naik DARI letterform ke ruang kosong di atasnya. Huruf
   selalu dikelilingi gradien panasnya sendiri, sehingga **terbaca penuh pada keadaan idle** —
   prasyarat yang hilang di `failures/2026-07-26-hero-explore-3-thermal.md` (knockout tanpa pita
   cahaya yang selalu menyala).

### 6D — Parameter fluid (tidak berubah dari `/`, kecuali mode)

```
mode: 2 (THERMAL)   curl: 20   splatRadius: 0.3   splatForce: 7200
displace: 0.001     chromatic: 0.003   whiteCore: 0.95
color: #0047FF (tetap — dipakai cabang 0, tidak dipakai cabang 2)
```

Efek daspritam (huruf meleleh + chromatic fringe) **dipertahankan** — keputusan Billy 2026-07-26.

---

## 7 — Tabel motion

| Elemen | dari → ke | duration | delay | easing |
|---|---|---|---|---|
| `.h4__name-char` (per huruf) | `yPercent 100, blur 8px` → `yPercent 0, blur 0` | 1.0 s | 0 s, stagger **+0.02 s** | `power4.out` |
| `.h4__tagline-line` | `autoAlpha 0, y 16, blur 10px` → `autoAlpha 1, y 0, blur 0` | 0.9 s | 0.5 s, stagger **+0.12 s** | `power3.out` |
| `.h4__meta-block` | `autoAlpha 0` → `autoAlpha 1` | 0.6 s | 1.0 s, stagger **+0.09 s** | `power3.out` |
| `.h4__plasma` | `opacity 0` → `opacity 1` | 1.2 s | 0.2 s | `expo.out` |
| `.h4__fluid` | `opacity 0` → `opacity 1` | 0.6 s | 1.35 s | `power3.out` |
| `.h4__names` (DOM → raster) | `autoAlpha 1` → `autoAlpha 0` | 0.6 s | 1.40 s | `power3.out` |
| `.h4__names` | `display: none` | — | 2.15 s | `set` |
| Scroll: konten + kanvas | `yPercent 0` → `yPercent -25` | scrub 0.5 | `top top` → `bottom top` | `none` |
| Scroll: fade | `opacity 1` → `opacity 0` | scrub true | `top top` → `50% top` | `none` |

**Tween scrub WAJIB `fromTo` dengan `immediateRender: false`** untuk elemen yang opacity-nya juga
ditulis timeline entrance. `.to()` merekam nilai saat render pertama (masih 0) → elemen mati
permanen sampai reload. Sudah tercatat di memory `gsap-scrub-fromto-rule`.

`uPointerHeat` lerp `0.055`/frame. `uTime` bertambah `dt` nyata, bukan `performance.now()` mentah —
supaya `prefers-reduced-motion` bisa menahannya di 0.

---

## 8 — Teks verbatim

Sumber: `app/constants/profile.ts`. Dilarang mengarang angka, klaim, atau nama klien.

- Masthead: `BILLYMAULANA`
- `<h1 class="sr-only">`: `Billy Maulana`
- Tagline baris 1: `A Frontend Architect` *(italic, Apparel)* + ` crafting interfaces`
- Tagline baris 2: `that move millions of people.`
- Meta kiri: `Bandung — {{ clockText }} GMT+7`
- Meta tengah: `GitHub` `/` `LinkedIn` `/` `Instagram`
- Meta kanan: `Work` `About` `Contact`
- `aria-label` section: `Billy Maulana — Frontend Architect & Creative Developer`

Tidak ada `N° 003`. Tidak ada `frame time`. Tidak ada `RUNNING HOT`. Metadata tentang implementasi
sendiri dilarang jadi konten (anti-slop rule 2026-07-25).

---

## 9 — Tabel responsif

| Breakpoint | Yang berubah |
|---|---|
| ≥ 1440 px | Semua tampil. Plasma sim 192×108. Fluid `DYE_RESOLUTION` 512. |
| 1024–1439 px | Tidak ada yang di-hidden. Plasma sim 192×108. |
| 768–1023 px | Plasma sim turun ke **160×90**. Tagline `font-size` clamp turun ke min. |
| ≤ 767 px | `.h4__meta-socials` `display: none`. Plasma sim **128×72**. Fluid `DYE_RESOLUTION` **256**. Masthead tetap fit-to-width. |
| `prefers-reduced-motion: reduce` | `.h4__fluid` `display: none`. Plasma tetap dirender **satu frame statis** (bukan hilang) — ground termal adalah identitas halaman, bukan animasi. `uDt = 0` setelah 120 step warm-up. |

Tipografi per tier: masthead fit-to-width (tidak pakai step), tagline
`clamp(1.0625rem, 1.9vw, 2.28rem)`, meta `0.625rem` tracking `0.28em`.
Zona 30–39px kosong di semua breakpoint.

---

## 10 — Notes / gotchas

1. **JANGAN sentuh solver `useFluidSimulation.ts`.** Yang boleh berubah hanya
   `contentDisplayShaderSource` (tambah cabang `uMode == 2.0`) dan penerusan uniform.
   Advection, divergence, tekanan Jacobi, vorticity confinement, splat — haram.
2. **JANGAN ubah cabang `uMode` 0 dan 1.** Route `/` memakai mode 0 dan sedang approved.
3. **JANGAN tulis simulasi fisika baru berbasis curl noise.** Sudah ditolak 2×. Background WAJIB
   berupa state yang berevolusi di ping-pong FBO (persamaan panas 5C), bukan noise yang
   di-resample tiap frame.
4. **GLSL di template literal TIDAK hot-reload lewat Vite HMR.** Wajib full page reload setelah
   mengubah shader. Jangan simpulkan shader tidak bekerja sebelum hard reload.
5. **`RGBA16F` butuh `EXT_color_buffer_float`.** Kalau tidak tersedia, fallback ke `RGBA8` dan
   naikkan `KAPPA` ke `0.16` (presisi rendah membuat difusi terlihat berjenjang). Deteksi lewat
   `gl.getExtension`, jangan asumsikan.
6. **`onUnmounted` harus didaftarkan SEBELUM `await` pertama** di `onMounted` — kalau tidak,
   listener dan `cancelAnimationFrame` tidak pernah terpasang.
7. **Dua konteks WebGL di satu halaman.** Pastikan `plasma.destroy()` memanggil
   `getExtension('WEBGL_lose_context')?.loseContext()`.
8. **JANGAN pakai foto potret ber-filter** sebagai subjek. Kehadiran manusia dibangkitkan
   prosedural lewat letterform yang memancarkan panas (anti-slop rule 2026-07-26).
9. **JANGAN beri drop shadow, glow lembut, atau outline pada tipografi** demi keterbacaan. Pilih
   salah satu ekstrem: menyatu total (yang dipakai di sini — displacement + chromatic + panas
   sendiri) atau datar penuh. Tidak ada di tengah.
10. **Masthead wajib terbaca pada keadaan idle.** Kalau saat idle huruf tidak terbaca, `SOURCE_GAIN`
    atau `cover` salah — perbaiki itu, jangan tambahkan shadow.
11. **Nol monospace** di seluruh route, termasuk label, meta, dan angka. Pakai
    `font-variant-numeric: tabular-nums` pada Suisse untuk jam.
12. **Jangan pakai `Obviously`** di mana pun di route ini.
13. Setelah mengubah parameter motion apa pun untuk memperbaiki bug, **nilai ulang kualitas
    geraknya** — kegagalan advection 42→15 di iterasi sebelumnya lolos karena perhatian sudah
    pindah ke gate berikutnya.

---

## 11 — Summary of the visual effect

Halaman dibuka gelap hampir total — ungu-hitam `#050507` dengan butiran film. Dalam dua detik
pertama, huruf "BILLYMAULANA" naik dari bawah per karakter, buram lalu menajam, dan begitu ia
berhenti, sesuatu mulai terjadi di sekelilingnya: letterform itu mulai **memancarkan panas.**
Gumpalan indigo `#0F0A72` merambat keluar dari batang huruf, berubah violet lalu magenta saat
naik, menipis jadi oranye di tepi atasnya, dan padam kembali ke hitam sebelum mencapai tagline.
Batas antar zona tidak mulus — ada kontur isoline tipis oranye yang membuatnya terbaca sebagai
pembacaan alat ukur, bukan gradien dekoratif. Di zona terpanas muncul raster titik halftone
sebesar 3 piksel, seperti cetakan koran termal.

Semuanya bergerak lambat, dengan periode sekitar 27 detik, sehingga tidak pernah terbaca sebagai
loop — plume naik, meliuk kena geseran horizontal, pecah, dingin.

Lalu kursor masuk. Di situ skala waktunya berubah total: gerakan tangan menyuntikkan pusaran
Navier-Stokes yang jauh lebih panas dan jauh lebih cepat daripada ruangan di sekitarnya — pita
cream `#FBDCC3` yang langsung merobek bidang violet, meliuk mengikuti vorticity, lalu mati dalam
sekitar satu detik. Dan pada saat yang sama, huruf-huruf di bawahnya **meleleh** mengikuti vektor
kecepatan yang sama, dengan pinggiran chromatic biru di sisi yang bergerak paling cepat.

Yang dirasakan: bukan halaman dengan latar animasi, tapi satu benda yang punya suhu. Diam, ia
berdenyut pelan. Disentuh, ia panas.

---

## Mood target (ditulis SEBELUM build)

`tense` · `austere` · `cinematic`

Penanda terukur yang harus keluar:
- **tense** — kontras luminance idle→interaksi ≥ 3×; hot zone muncul mendadak (< 200 ms) bukan
  ber-fade.
- **austere** — ≤ 3 famili, ≤ 3 weight, nol dekorasi non-fungsional, grid ketat, ground
  mendominasi 40–53%.
- **cinematic** — titik terpanas cream `#FBDCC3` bukan putih; grain wajib; halftone raster.

Kalau hasilnya terasa **playful** atau **luxurious**, itu meleset — sebutkan penanda mana yang
gagal, jangan tulis "kurang pas".
