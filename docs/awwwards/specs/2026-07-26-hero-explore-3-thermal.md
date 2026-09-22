# Spec Eksekusi — `hero-explore-3` · THERMAL READOUT

## 1 — Header

Hero fullscreen untuk portofolio Billy Maulana (Frontend Engineer, Bandung), rute
`/hero-explore-3`. Mekanik utamanya: **halaman adalah citra termal dari mesin yang sedang
bekerja.** Satu canvas WebGL2 fullscreen merender medan panas (heat field) yang disimulasikan di
FBO ping-pong; sumber panasnya adalah (a) posisi kursor sebagai probe, dan (b) SDF dari masthead
tipografi itu sendiri — huruf memancarkan panas. Medan itu diwarnai lewat colormap termal 8-stop
dan dipotong oleh masthead yang berperan sebagai **knockout hitam**, bukan teks berwarna. HUD
monospace di empat sudut menampilkan pembacaan yang **nyata**: FPS live diformat sebagai suhu.

Stack persisnya: **Nuxt 4.3 (Vue 3 `<script setup>`, TypeScript strict) + UnoCSS (Wind4) + GSAP
3.14.2 + WebGL2 murni** (tanpa Three.js — tidak ada geometri, hanya fullscreen triangle). Lenis
tidak dipakai: hero ini tidak scroll.

Metafora dipilih karena mengikat langsung ke isi `app/constants/profile.ts`: *"Transforming pixels
into performance"* dan *"Always hunting for that perfect 60fps"*. Thermal imaging adalah alat yang
dipakai untuk melihat beban kerja mesin. Angka di HUD bukan dekorasi — itu frame time sebenarnya.

---

## 2 — Fonts

Semua sudah ada di repo. **Tidak ada dependency baru.**

| Peran | Famili | Weight | Cara load | Dipakai di |
|---|---|---|---|---|
| Masthead | **Obviously Condensed Black** | 400 (file sudah black) | `@font-face` di `app/assets/css/main.css:95` → `/assets/fonts/obviously/Obviously-CondensedBlack.woff2` | `.th-masthead` |
| Statement | **Switzer Variable** | 300 | `@font-face` di `main.css:54` → `/assets/fonts/switzer/Switzer-Variable.woff2` | `.th-statement` |
| HUD / label / readout | **JetBrains Mono** | 400, 500 | `@import '@fontsource/jetbrains-mono/400.css'` sudah ada di `main.css:6-7` | `.th-hud`, `.th-readout` |

Alasan Obviously CondensedBlack: referensi `image 43` memakai grotesk kondens ekstra-bold
(Druk/Anton-like) yang dirotasi dan diberi chromatic fringe. Obviously adalah padanan terdekat
yang **sudah dimiliki** dan belum pernah dipakai di rute mana pun — jadi `hero-explore-3` langsung
punya identitas tipografi yang berbeda dari `hero-explore-1` dan `-2`.

**DILARANG** menambah `@fontsource/*` baru atau memakai Inter/Roboto/system-ui untuk masthead.

---

## 3 — Assets

| KONSTANTA | Path | Status verifikasi |
|---|---|---|
| `GRAIN_TEXTURE` | `/assets/textures/grain.png` | Ada di repo (`public/assets/textures/grain.png`) — dipakai lewat CSS `background-image`, bukan sampler WebGL |
| — | — | **Tidak ada aset eksternal. Tidak ada request jaringan. Tidak ada video.** |

### Keputusan art director: TIDAK memakai foto Billy

Tersedia `~/Downloads/2.billy.png` (600×600, RGBA). Diperiksa: pose korporat, senyum, latar
koridor terang, resolusi 600px. **Ditolak** untuk hero ini dengan tiga alasan yang bisa diuji:

1. **Bertentangan dengan mood.** Ground konsep ini hitam pekat dengan panas violet→amber. Foto
   berlatar terang dan pose formal akan terbaca sebagai tempelan, bukan bagian dari sistem.
2. **Referensi wajah di folder Billy justru menghapus identitas.** Pada `image 25`, `33`, `43`,
   `52` wajahnya nyaris tidak terbaca — yang jadi poin adalah **tekniknya** (slit-scan, kontur,
   colormap), bukan siapa orangnya. Memakai foto asli malah melawan maksud referensinya.
3. **600px terlalu kecil** untuk masthead-scale di layar 2× tanpa terlihat lunak.

Gantinya, "kehadiran manusia" dibangkitkan **prosedural**: sebuah *thermal ghost* — siluet
kepala-bahu dari SDF yang hanya muncul sebagai residu panas ketika kursor melintas, lalu mendingin
hilang. Nol aset, bisa dianimasi penuh, dan lebih tinggi di hierarki anti-slop (Level 5 vs Level 2
untuk foto ber-filter).

---

## 4 — Struktur per layer, urut z-index

```
<div class="th-root">                                    // relative w-full h-100dvh overflow-hidden bg-#050507
  <canvas class="th-canvas" />                            // absolute inset-0 z-0 h-full w-full block
  <div class="th-vignette" />                             // pointer-events-none absolute inset-0 z-10
  <h1 class="th-masthead">…</h1>                          // absolute left-0 right-0 z-20 px-[var(--th-pad)]
  <p class="th-statement">…</p>                           // absolute z-20 bottom-[var(--th-pad)] left-[var(--th-pad)] max-w-[34ch]
  <div class="th-hud th-hud--tl">…</div>                  // absolute z-30 top-[var(--th-pad)] left-[var(--th-pad)]
  <div class="th-hud th-hud--tr">…</div>                  // absolute z-30 top-[var(--th-pad)] right-[var(--th-pad)] text-right
  <div class="th-hud th-hud--br">…</div>                  // absolute z-30 bottom-[var(--th-pad)] right-[var(--th-pad)] text-right
  <svg class="th-reticle">…</svg>                         // pointer-events-none fixed z-30 h-[72px] w-[72px]
  <div class="th-grain" />                                // pointer-events-none absolute inset-0 z-40
</div>
```

Semua posisi memakai `--th-pad`; tidak ada nilai padding literal yang diketik dua kali.

---

## 5 — Blok CSS siap tempel

File: `app/hero-explore-3/thermal.css`

```css
.th-root {
  --th-pad: clamp(1.25rem, 3.2vw, 3rem);
  --th-void: #050507;
  --th-ink: #E9E4D8;
  --th-hud: #8A8A9E;
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  background: var(--th-void);
  cursor: none;
}

.th-canvas {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.th-vignette {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  background: radial-gradient(ellipse 120% 90% at 50% 52%, transparent 38%, rgba(5, 5, 7, 0.55) 78%, rgba(5, 5, 7, 0.92) 100%);
}

.th-masthead {
  position: absolute;
  z-index: 20;
  top: 50%;
  left: 0;
  right: 0;
  margin: 0;
  padding-inline: var(--th-pad);
  transform: translateY(-54%);
  font-family: 'Obviously', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  font-size: clamp(4.5rem, 19.5vw, 21rem);
  line-height: 0.78;
  letter-spacing: -0.028em;
  text-transform: uppercase;
  color: var(--th-void);
  mix-blend-mode: multiply;
  text-wrap: balance;
}

.th-masthead__line {
  display: block;
  white-space: nowrap;
}

.th-masthead__line--indent {
  padding-left: 8.5vw;
}

.th-statement {
  position: absolute;
  z-index: 20;
  bottom: var(--th-pad);
  left: var(--th-pad);
  max-width: 34ch;
  margin: 0;
  font-family: 'Switzer', 'Helvetica Neue', sans-serif;
  font-weight: 300;
  font-size: clamp(0.95rem, 1.15vw, 1.2rem);
  line-height: 1.32;
  letter-spacing: -0.012em;
  color: var(--th-ink);
  text-wrap: pretty;
}

.th-statement em {
  font-style: italic;
  font-weight: 400;
}

.th-hud {
  position: absolute;
  z-index: 30;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-weight: 400;
  font-size: 0.6875rem;
  line-height: 1.5;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--th-hud);
}

.th-hud--tl { top: var(--th-pad); left: var(--th-pad); }
.th-hud--tr { top: var(--th-pad); right: var(--th-pad); text-align: right; }
.th-hud--br { bottom: var(--th-pad); right: var(--th-pad); text-align: right; }

.th-readout {
  display: block;
  font-weight: 500;
  font-size: 0.8125rem;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
  color: var(--th-ink);
}

.th-readout--hot { color: #FFC81E; }

.th-reticle {
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 72px;
  height: 72px;
  pointer-events: none;
  opacity: 0;
  will-change: transform, opacity;
}

.th-reticle circle,
.th-reticle line {
  vector-effect: non-scaling-stroke;
}

.th-grain {
  position: absolute;
  inset: 0;
  z-index: 40;
  pointer-events: none;
  opacity: 0.16;
  mix-blend-mode: overlay;
  background-image: url('/assets/textures/grain.png');
  background-size: 180px 180px;
}

@media (max-width: 900px) {
  .th-root { cursor: auto; }
  .th-masthead { font-size: clamp(3.25rem, 17vw, 7rem); letter-spacing: -0.02em; }
  .th-masthead__line--indent { padding-left: 0; }
  .th-statement { max-width: 28ch; bottom: calc(var(--th-pad) * 2.6); }
  .th-hud--br { display: none; }
  .th-reticle { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .th-reticle { display: none; }
}
```

Catatan `mix-blend-mode: multiply` pada masthead: itu yang menghasilkan **knockout** seperti
`image 41` — huruf hitam memotong lapisan cahaya, bukan diwarnai. Di area yang dingin (hampir
hitam), huruf jadi tidak terlihat; di area panas, huruf muncul sebagai lubang gelap. Efeknya:
**tipografi hanya terbaca sepenuhnya ketika sistem sedang panas.**

---

## 6 — Blok GLSL siap tempel

File: `app/composables/useThermalField.ts` (string template).

### 6A — Vertex (dipakai kedua pass)

```glsl
#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
```

Buffer: satu **fullscreen triangle** dengan 3 verteks `[-1,-1, 3,-1, -1,3]`.
Panggilannya `gl.drawArrays(gl.TRIANGLES, 0, 3)` — **tiga**, bukan enam.

### 6B — Simulation pass (ping-pong, RGBA16F)

Menulis `R = heat`, `G = velocity.x`, `B = velocity.y`.

```glsl
#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrev;
uniform vec2  uTexel;
uniform vec2  uPointer;
uniform vec2  uPointerVel;
uniform float uPointerDown;
uniform float uTime;
uniform float uDt;
uniform float uAspect;
uniform float uTextHeat;
uniform sampler2D uTextMask;

const float DECAY      = 0.9885;
const float DIFFUSE    = 0.145;
const float CONVECTION = 0.42;
const float PROBE_R    = 0.052;
const float PROBE_GAIN = 0.85;
const float CURL_SCALE = 3.1;
const float CURL_SPEED = 0.085;

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453) * 2.0 - 1.0;
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
        dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
        dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * vnoise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

vec2 curl(vec2 p, float t) {
  float e = 0.035;
  float n1 = fbm(p + vec2(0.0, e) + t);
  float n2 = fbm(p - vec2(0.0, e) + t);
  float n3 = fbm(p + vec2(e, 0.0) + t);
  float n4 = fbm(p - vec2(e, 0.0) + t);
  return vec2(n1 - n2, n4 - n3) / (2.0 * e);
}

void main() {
  vec2 uv = vUv;
  vec2 asp = vec2(uAspect, 1.0);

  vec2 flow = curl(uv * CURL_SCALE, uTime * CURL_SPEED);
  flow.y += CONVECTION;

  vec2 back = uv - flow * uTexel * 42.0 * uDt * 60.0;
  vec4 prev = texture(uPrev, back);

  float heat = prev.r;

  float blur =
      texture(uPrev, back + vec2( uTexel.x, 0.0)).r
    + texture(uPrev, back + vec2(-uTexel.x, 0.0)).r
    + texture(uPrev, back + vec2(0.0,  uTexel.y)).r
    + texture(uPrev, back + vec2(0.0, -uTexel.y)).r;
  heat = mix(heat, blur * 0.25, DIFFUSE);

  float d = length((uv - uPointer) * asp);
  float probe = exp(-d * d / (PROBE_R * PROBE_R));
  float speed = clamp(length(uPointerVel) * 9.0, 0.0, 1.6);
  heat += probe * PROBE_GAIN * (0.30 + speed) * (1.0 + uPointerDown * 1.5) * uDt * 60.0 * 0.016;

  float mask = texture(uTextMask, uv).r;
  heat += mask * uTextHeat * uDt;

  heat *= DECAY;
  heat = clamp(heat, 0.0, 1.35);

  fragColor = vec4(heat, flow, 1.0);
}
```

### 6C — Render pass (colormap termal + isoline + halftone)

```glsl
#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uField;
uniform vec2  uResolution;
uniform float uTime;
uniform float uReveal;

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

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;
  float h = texture(uField, uv).r;

  float bleed = 0.0;
  for (int i = 1; i <= 10; i++) {
    float k = float(i);
    bleed += texture(uField, uv + vec2(0.0, k * 0.0075)).r * (1.0 - k / 11.0);
  }
  h = max(h, bleed * 0.085);

  vec3 col = thermal(h);

  float band = fract(h * 5.0);
  float iso = smoothstep(0.965, 0.995, band) - smoothstep(0.995, 1.0, band);
  col += vec3(1.0, 0.62, 0.16) * iso * 0.34 * smoothstep(0.12, 0.4, h);

  float px = 3.0;
  vec2 cell = floor(gl_FragCoord.xy / px);
  float dot_ = length(fract(gl_FragCoord.xy / px) - 0.5);
  float halftone = smoothstep(0.52, 0.18, dot_ * (1.35 - h));
  col = mix(col, col * 0.82, (1.0 - halftone) * smoothstep(0.30, 0.85, h) * 0.55);

  col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.028;

  col *= uReveal;

  fragColor = vec4(col, 1.0);
}
```

**Colormap diekstrak dari piksel referensi, bukan dikira-kira.** Lima gambar acuan
(`vr-thermal-halftone-fluid`, `vr-plasma-smooth-warp`, `vr-listener-liquid-type`,
`vr-wegodown-thermal-arc`, `vr-freedom-marble-isoline`) di-downsample ke 120px, dikelompokkan ke 8
bucket luminance, lalu diambil warna rata-rata per bucket. Tabel lengkapnya di
`../references/visual/01-thermal-plasma.md`.

Dua hal yang **tidak boleh "dibetulkan"** oleh siapa pun yang menyentuh shader ini:

- `C1 = vec3(0.059, 0.039, 0.447)` adalah `#0F0A72` — indigo identitas Billy, dipakai sebagai
  **jangkar dingin**. Palet brand tidak diganti; ia jadi titik terdingin sistem panas. `#0047FF`
  dipakai terpisah sebagai warna HUD aktif.
- `C8 = vec3(0.984, 0.863, 0.765)` adalah `#FBDCC3` — **cream hangat, bukan putih murni.** Pada
  kelima acuan, titik terpanas selalu peach/cream (`#FBDCC3`, `#F6F2E6`, `#FBC294`), tidak pernah
  `#FFFFFF`. Ini yang memberi kesan emulsi film, bukan layar.

**Distribusi bidang wajib mode ground-dominant**: gelap 40–53%, violet 10–28%, magenta–pink 11–17%,
oranye ke atas **maksimal 21%**. Mode full-bleed (violet 53–59%, hampir tanpa hitam) dipakai
referensi hanya untuk tekstur tanpa teks — memakainya di halaman bertipografi menghilangkan ruang
bernapas dan memaksa huruf dibaca lewat shadow, yang dilarang.

---

## 7 — Tabel motion

| # | Elemen | Dari → Ke | Duration | Delay | Easing |
|---|---|---|---|---|---|
| 1 | `uReveal` (uniform) | `0` → `1` | 1.5 s | 0.15 s | `power2.out` |
| 2 | `.th-masthead__line` (2 baris) | `y: 12%, opacity: 0` → `y: 0, opacity: 1` | 1.05 s | stagger `+0.085` dari 0.35 s | `expo.out` |
| 3 | `.th-statement` | `y: 18px, opacity: 0` → `y: 0, opacity: 1` | 0.9 s | 0.85 s | `power3.out` |
| 4 | `.th-hud` (3 blok) | `opacity: 0` → `opacity: 1` | 0.6 s | stagger `+0.07` dari 1.05 s | `power1.out` |
| 5 | `.th-reticle` | `opacity: 0` → `opacity: 1` | 0.4 s | pada `pointermove` pertama | `power2.out` |
| 6 | `.th-reticle` posisi | mengikuti kursor | — | lerp `0.18` per frame di RAF | — |
| 7 | `.th-reticle` saat idle >1.4 s | `opacity: 1 → 0.35` | 0.5 s | — | `power2.inOut` |
| 8 | `uTextHeat` saat hover masthead | `0.55 → 1.6` | 0.5 s | — | `power2.out` |
| 9 | `uTextHeat` saat leave | `1.6 → 0.55` | 1.1 s | — | `power2.inOut` |

Semua tween GSAP yang di-scrub **WAJIB `fromTo`**, bukan `.to()`. Di hero ini tidak ada
ScrollTrigger, tapi aturan tetap ditegakkan untuk timeline reveal agar aman terhadap replay.

`prefers-reduced-motion: reduce` → seluruh timeline di-set `duration: 0`, `uReveal = 1` langsung,
reticle disembunyikan, dan loop RAF simulasi tetap jalan tapi `CONVECTION` dan `CURL_SPEED`
dikalikan `0.25`.

---

## 8 — Teks verbatim

Sumber: `app/constants/profile.ts`. Dilarang mengarang angka.

**Masthead** (dua baris, baris kedua ber-indent):
```
RUNNING
HOT
```

**Statement** (kiri bawah):
```
Frontend Engineer. Bandung. Seven years turning Figma files into
interfaces that hold sixty frames a second — including PLN Mobile,
the utility super app eighty million Indonesians open every month.
```
Kata `sixty frames a second` dibungkus `<em>`.

**HUD kiri-atas** (`.th-hud--tl`):
```
BILLY MAULANA
FRONTEND ENGINEER
```

**HUD kanan-atas** (`.th-hud--tr`) — readout live:
```
FRAME TIME
<span class="th-readout">16.7 MS</span>
THERMAL / ACTIVE
```
`16.7` diganti nilai nyata setiap 500 ms dari rata-rata bergerak `performance.now()` delta.
Kelas `.th-readout--hot` ditambahkan ketika frame time > 20 ms.

**HUD kanan-bawah** (`.th-hud--br`):
```
N° 003
2026 / BANDUNG ID
```

`N° 003` merujuk urutan eksplorasi hero, bukan angka karangan.

---

## 9 — Tabel responsif

| Breakpoint | Yang berubah |
|---|---|
| ≥ 1440px | Masthead `clamp(...)` mencapai 21rem. Baris kedua indent `8.5vw`. Semua HUD tampil. Reticle aktif, `cursor: none`. |
| 900–1439px | Masthead ikut `19.5vw`. Indent tetap. Semua HUD tampil. |
| < 900px | Masthead turun ke `clamp(3.25rem, 17vw, 7rem)`, tracking dilonggarkan ke `-0.02em`, indent dihapus. `.th-hud--br` di-`display: none`. Reticle di-`display: none`, `cursor: auto`. Statement `max-width: 28ch` dan diangkat ke `calc(var(--th-pad) * 2.6)` agar tidak menabrak safe-area. |
| DPR | Canvas di-render pada `min(devicePixelRatio, 2)`. FBO simulasi pada **setengah** resolusi canvas (`SIM_SCALE = 0.5`) — medan panas berdifusi, jadi resolusi penuh tidak terlihat bedanya tapi biayanya 4×. |

---

## 10 — Notes / gotchas

- **`drawArrays` memakai 3, bukan 6.** Buffer fullscreen triangle hanya punya 3 verteks. Memakai 6
  menghasilkan `GL_INVALID_OPERATION` dan canvas kosong tanpa error yang jelas. Ini sudah pernah
  terjadi di rute `/calibration`.
- **GLSL di template literal TIDAK hot-reload lewat Vite HMR.** Setelah mengubah shader, WAJIB
  full page reload. Jangan menyimpulkan shader salah sebelum reload penuh.
- **`EXT_color_buffer_float` wajib dicek.** `gl.getExtension('EXT_color_buffer_float')` harus
  dipanggil sebelum membuat FBO `RGBA16F`. Kalau null, turunkan ke `gl.RGBA` + `UNSIGNED_BYTE` dan
  kalikan heat dengan `0.72` agar tidak clipping. Jangan biarkan gagal diam-diam.
- **`onUnmounted` harus didaftarkan sebelum `await` pertama** di composable, kalau tidak ia tidak
  akan terpanggil dan RAF bocor antar navigasi rute.
- **Text mask harus dibangkitkan ulang saat resize dan saat font selesai load.** Urutannya:
  `await document.fonts.ready` → ukur bounding box `.th-masthead` → gambar teks ke
  `OffscreenCanvas` → `texImage2D`. Kalau mask dibuat sebelum font siap, panasnya akan mengikuti
  bentuk font fallback.
- **Jangan pakai `mix-blend-mode: difference` pada masthead.** Sudah dicoba di `hero-explore-1` dan
  ditolak. Yang dipakai di sini `multiply` dengan warna `var(--th-void)`.
- **Jangan menambahkan partikel.** Level 0 pada hierarki anti-slop, otomatis ditolak.
- **Jangan menaikkan `DECAY` di atas `0.995`.** Sistem akan jenuh putih dalam ~4 detik dan seluruh
  colormap jadi rata.
- **Rute wajib `standalone: true`** di `definePageMeta` supaya `AppNavigation` global tidak
  menimpa HUD, mengikuti pola `hero-explore-2.vue`.
- **Tambahkan `robots: 'noindex'`** lewat `useSeoMeta`, sama seperti rute eksplorasi lain.
- **Comment di file CSS: NOL.** Aturan repo. Comment di TS hanya WHY, gaya blok.

---

## 11 — Summary of the visual effect

Layar dibuka hitam nyaris total. Dalam satu setengah detik sebuah kabut dingin berwarna indigo
naik dari bawah bingkai, bergerak dengan pusaran halus seperti asap yang terperangkap di balik
kaca. Dua kata — `RUNNING` dan `HOT` — muncul bukan sebagai teks putih, melainkan sebagai **lubang
gelap** yang dipotong dari kabut itu: di tempat yang masih dingin, huruf hampir tidak terlihat; di
tempat yang mulai panas, siluetnya menajam. Di keempat sudut, label monospace kecil menyala satu
per satu, dan salah satunya menampilkan angka yang benar-benar berdenyut mengikuti performa mesin
pembacanya.

Begitu kursor bergerak, semuanya berubah. Kursor adalah **probe**: ke mana pun ia lewat, medan itu
memanas — indigo berubah violet, violet jadi magenta, magenta pecah jadi oranye, dan di titik
paling panas muncul inti kuning-putih. Panasnya tidak berhenti di jejak kursor; ia **naik**,
menyeret pita-pita vertikal ke atas seperti udara di atas aspal, dan meninggalkan garis kontur
amber tipis di setiap batas suhu. Semakin cepat kursor digerakkan, semakin lebar jejaknya. Diam
sejenak, dan seluruh bidang mendingin kembali ke indigo, huruf-huruf perlahan menghilang ditelan
gelap.

Melintaskan kursor di atas masthead memicu hal terakhir: **huruf-hurufnya sendiri mulai
memancarkan panas**, memanaskan udara di sekitarnya, sampai kata `HOT` terbaca persis seperti
namanya. Yang tertinggal di kepala bukan "ada animasi bagus di hero", tapi satu kalimat yang lebih
spesifik: *halaman ini menunjukkan mesinnya sedang bekerja, dan angka di sudut itu jujur.*
