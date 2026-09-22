# SPECIMEN 001 — hero-explore-3

> Spec eksekusi. Format: Output Contract `CLAUDE.md`. Art director: Claude.

---

## 1 — Header

Hero fullscreen (100vh) untuk portofolio **Billy Maulana**, Frontend Engineer.
Bentuknya **type specimen sheet brutalis**: grid Swiss hairline yang terlihat, kolom
anotasi teknis di kiri, masthead mega-type rata kanan yang sengaja melewati batas grid.

Mekanik utama: **kursor adalah sumber cahaya.** Masthead di-render sebagai pelat logam
brushed anisotropik; menggerakkan kursor memindahkan highlight spekular melintasi
permukaan huruf, seperti memiringkan pelat logam di bawah lampu. Cahaya tidak pernah
mendistorsi bentuk huruf — keterbacaan nama tidak pernah berkurang.

Stack: **Nuxt 4.3 (Vue 3 `<script setup>`) + UnoCSS presetWind4 + GSAP + WebGL2**.
Nol aset eksternal. Nol video.

---

## 2 — Fonts

| Peran | Famili | Weight | Cara load | Dipakai di |
|---|---|---|---|---|
| Masthead | **Obviously Condensed Black** | 900 | `@font-face` → `/assets/fonts/obviously/Obviously-CondensedBlack.woff2` (sudah di repo) | `BILLY` / `MAULANA` di texture WebGL |
| Anotasi & meta | **JetBrains Mono** | 400, 500 | `@import '@fontsource/jetbrains-mono/400.css'` + `/500.css` (sudah terpasang) | semua label, koordinat, counter |

Dua famili, tiga weight — sesuai batas anti-slop.
Tidak ada Inter / Roboto / Arial / system-ui.

---

## 3 — Assets

| Konstanta | Sumber | Status verifikasi |
|---|---|---|
| `LOGO_MARK` | `/assets/images/logo/logo-bm-white-origin.svg` | ada di repo (lokal) |
| `OBVIOUSLY_WOFF2` | `/assets/fonts/obviously/Obviously-CondensedBlack.woff2` | ada di repo, 76.936 byte |
| `GRAIN` | SVG `feTurbulence` inline (data URI) | prosedural, tidak bisa mati |
| Metal field | GLSL fbm + domain warp | prosedural |

**Nol URL eksternal.** Tidak ada yang bisa `401` atau kedaluwarsa.

---

## 4 — Struktur per layer (urut z-index)

| # | z | Elemen | Class UnoCSS lengkap |
|---|---|---|---|
| 1 | `z-0` | Canvas WebGL (metal + masthead) | `absolute inset-0 h-full w-full` |
| 2 | `z-10` | Grid hairline vertikal | `pointer-events-none absolute inset-y-0 w-px` + inline `left`, `background: rgba(255,255,255,0.10)` |
| 3 | `z-10` | Rule horizontal atas/bawah | `spec-rule absolute left-0 right-0 h-px` |
| 4 | `z-20` | Meta row atas | `absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5 md:px-9 md:py-6` |
| 5 | `z-20` | Kolom anotasi kiri | `absolute left-6 top-[27%] hidden w-[190px] flex-col gap-3 md:flex md:left-9` |
| 6 | `z-20` | Meta row bawah | `absolute inset-x-0 bottom-0 flex items-end justify-between px-6 py-5 md:px-9 md:py-6` |
| 7 | `z-30` | Grain overlay | `spec-grain pointer-events-none absolute inset-0` |

Masthead TIDAK ada di DOM — ia hidup di dalam canvas sebagai texture.

---

## 5 — Blok CSS siap tempel

`app/hero-explore-3/specimen.css`

```css
@import '@fontsource/jetbrains-mono/400.css';
@import '@fontsource/jetbrains-mono/500.css';

@font-face {
  font-family: 'Obviously';
  src: url('/assets/fonts/obviously/Obviously-CondensedBlack.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: block;
}

.spec-root,
.spec-root * {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}

.spec-rule { background: rgba(255, 255, 255, 0.10); }

.spec-grain {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23g)'/%3E%3C/svg%3E");
  mix-blend-mode: overlay;
  opacity: 0.05;
}
```

---

## 6 — Algoritma mekanik inti

### 6a. Texture masthead
1. Offscreen `<canvas>` 2D, ukuran = ukuran framebuffer (DPR di-clamp maks `2`).
2. `font = '900 ${size}px Obviously'`, `textAlign = 'right'`.
3. Fit-to-width: ukur `MAULANA` pada probe `200px`, lalu
   `size = (targetWidth / measured) * 200` dengan `targetWidth = width * 0.635`.
4. Gambar dua baris rata kanan pada `x = width * 0.985`:
   - `BILLY` di `y = height * 0.505`
   - `MAULANA` di `y = height * 0.505 + size * 0.80`
5. Upload dengan `UNPACK_FLIP_Y_WEBGL = true`, filter `LINEAR`, wrap `CLAMP_TO_EDGE`.

### 6b. Uniform

| Uniform | Tipe | Isi |
|---|---|---|
| `uResolution` | `vec2` | lebar × tinggi framebuffer |
| `uTime` | `float` | detik sejak mount |
| `uLight` | `vec2` | posisi kursor ternormalisasi, di-smooth GSAP |
| `uSweep` | `float` | `0 → 1`, progres entrance |
| `uText` | `sampler2D` | texture 6a |

### 6c. Fragment — angka literal
1. `p = uv * vec2(aspect, 1.0) * 2.6`
2. Anisotropic brushed: `streak = fbm(vec2(p.x * 1.0, p.y * 26.0))` — sumbu Y dikali **26** untuk goresan horizontal
3. Broad field: `body = fbm(p + vec2(uTime * 0.012, 0.0))`
4. `surface = body * 0.62 + streak * 0.38`
5. Jarak ke cahaya: `d = distance(uv * vec2(aspect,1.0), uLight * vec2(aspect,1.0))`
6. Spekular: `spec = pow(exp(-d * 2.3), 2.0)` → highlight lembut radius sedang
7. Gradien permukaan jadi normal semu: `nx = surface(p + e) - surface(p - e)`, `e = 1.4 / resolution.y`
8. `facet = clamp(0.5 + nx * 6.0, 0.0, 1.0)`
9. Ink: `0.26 + surface * 0.30 + spec * facet * 1.15`
10. Base (luar huruf): `0.085 + surface * 0.055`
11. Chroma: `tint = mix(vec3(1.0), vec3(0.62, 0.86, 1.0), spec * 0.45)` — biru-dingin HANYA di inti highlight
12. Entrance clip: `reveal = smoothstep(uSweep - 0.14, uSweep + 0.02, 1.0 - uv.x)` — sapuan kanan→kiri
13. `mask = texture(uText, uv).a * reveal`
14. `col = mix(base, ink * tint, mask)`

**Tanpa displacement. Tanpa pull. Huruf tidak pernah bergeser.**

### 6d. Smoothing cahaya
`gsap.quickTo(light, 'x' | 'y', { duration: 0.85, ease: 'expo.out' })`.
Idle: `uLight` diam di `(0.72, 0.60)`; `uTime` tetap jalan sehingga permukaan bernapas.

---

## 7 — Tabel motion

| Elemen | Dari → ke | Duration | Delay | Easing |
|---|---|---|---|---|
| `uSweep` | `0 → 1` | 1.5 s | 0.15 s | `expo.inOut` |
| Rule horizontal | `scaleX 0 → 1` | 1.2 s | 0.10 s, stagger `0.08` | `expo.inOut` |
| Grid vertikal | `scaleY 0 → 1` | 1.0 s | 0.30 s, stagger `0.05` | `expo.inOut` |
| Meta row atas | `yPercent 110 → 0`, `opacity 0 → 1` | 0.9 s | 0.45 s, stagger `0.04` | `power4.out` |
| Anotasi kiri | `yPercent 110 → 0`, `opacity 0 → 1` | 0.9 s | 0.70 s, stagger `0.06` | `power4.out` |
| Meta row bawah | `yPercent 110 → 0`, `opacity 0 → 1` | 0.9 s | 0.85 s, stagger `0.04` | `power4.out` |
| Highlight (runtime) | mengikuti kursor | 0.85 s | — | `expo.out` |

Tidak ada `linear` / `power1` / `ease` / `swing`.

---

## 8 — Teks verbatim

Semua dari `app/constants/profile.ts`.

**Meta atas**
- kiri: `BILLY MAULANA`
- tengah: `FRONTEND ENGINEER`
- kanan: `BANDUNG 6°55′S 107°37′E`

**Anotasi kiri** (label / value)
- `TYPEFACE` / `OBVIOUSLY CONDENSED BLACK`
- `SET AT` / `63.5% OF VIEWPORT`
- `TRACKING` / `−0.045EM`
- `MATERIAL` / `ANISOTROPIC CHROME`
- `LIGHT SOURCE` / `CURSOR`

**Meta bawah**
- `(07) YEARS` · `(23) PROJECTS` · `(80M) USERS`
- kanan: `SPECIMEN 001 / 023` dan `EST 2018`

---

## 9 — Tabel responsif

| Breakpoint | Yang berubah |
|---|---|
| `< 768px` | Kolom anotasi kiri `hidden`. Meta atas hanya nama + index. Meta bawah counter dibungkus 2 baris. Padding `px-6 py-5`. Masthead `targetWidth = 0.90` |
| `>= 768px` (`md`) | Anotasi kiri tampil (`w-[190px]`). Padding `px-9 py-6`. `targetWidth = 0.635` |
| `>= 1280px` (`xl`) | Anotasi `w-[220px]`, counter `text-[34px]` |

Grid vertikal: 2 garis di `< md`, 4 garis di `>= md`.

---

## 10 — Notes / gotchas

- **`onUnmounted` WAJIB didaftarkan sinkron di awal composable**, sebelum `await` pertama. Setelah await, Vue kehilangan active instance dan hook tidak terpasang → RAF + listener + konteks WebGL bocor.
- **Jangan decay velocity/light tiap frame.** Panggil `vTo(0)` hanya setelah pointer diam; kalau di-restart tiap frame, nilainya tidak pernah naik.
- **Anotasi tipe eksplisit untuk narrowing**: `const gl: WebGL2RenderingContext = context`. Tanpa itu TS kehilangan penyempitan di dalam function declaration bersarang.
- **`await document.fonts.load('900 200px Obviously')` sebelum menggambar texture.** Kalau tidak, canvas menggambar dengan fallback dan hasilnya salah lebar permanen.
- **JANGAN tambahkan displacement/melt.** Iterasi sebelumnya gagal karena amplitudo `0.09` menghancurkan keterbacaan.
- `mask-image` / `background-clip: text` DILARANG — itu failed technique #12.

---

## 11 — Summary of the visual effect

Layar hitam. Sebuah garis hairline menarik dirinya melintasi bagian atas, lalu bawah;
empat garis vertikal turun membelah bidang jadi grid Swiss yang terlihat. Dari kanan,
seberkas cahaya menyapu ke kiri dan meninggalkan sebuah nama di belakangnya —
`BILLY` di atas `MAULANA`, besar sekali, rata kanan sampai hampir keluar dari tepi layar,
permukaannya logam brushed dengan goresan horizontal halus.

Di kiri, kolom anotasi teknis naik satu per satu seperti keterangan pada lembar
spesimen huruf: nama typeface, ukuran, tracking, material, sumber cahaya.

Kemudian layar diam. Logamnya bernapas sangat pelan.

Saat kursor bergerak, highlight spekular ikut bergerak melintasi huruf — seolah pelat
logam itu dimiringkan di bawah lampu. Di inti highlight muncul semburat biru dingin,
lalu hilang lagi begitu cahaya menjauh. Nama itu tidak pernah bergoyang, tidak pernah
meleleh, tidak pernah kabur. Yang berubah hanya bagaimana cahaya jatuh di atasnya.
