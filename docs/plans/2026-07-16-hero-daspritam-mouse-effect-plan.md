# Hero daspritam Mouse Effect — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clone mouse effect daspritam.in ke hero existing — fluid jadi invisible velocity map yang melelehkan masthead + RGB fringe, sesuai spec `docs/plans/2026-07-16-hero-daspritam-mouse-effect.md`.

**Architecture:** Satu context WebGL (milik `useFluidSimulation`). Masthead dirasterisasi ke offscreen 2D canvas (putih di atas HITAM opak) → diupload sebagai texture → display pass baru (shader daspritam verbatim) men-displace texture dengan velocity field. Kompositing ke halaman via CSS `mix-blend-mode: difference` (hitam = identity), sehingga shader referensi TIDAK perlu alpha handling. Context WebGL kedua (`useTextDistortion`) dihapus; file di-repurpose jadi rasterizer murni.

**Tech Stack:** Nuxt 4.3, TypeScript strict, WebGL2 raw (tanpa dependency baru), GSAP.

## Amandemen (permintaan user 2026-07-16, mid-execution)

- **Pointer gate**: efek liquid HANYA aktif saat cursor benar-benar menyentuh area teks masthead. Implementasi: `init()` menerima `pointerGate?: (u: number, v: number) => boolean` (texcoord, v bottom-up); `updatePointerMoveData` hanya queue splat segment bila gate lolos. Hero menyediakan gate dari pita ink masthead (pad..width-pad × baseline−0.73em..baseline+0.06em), di-cache di `layoutMasthead` — TANPA measureText per event.

## Global Constraints

- TANPA dependency baru (OGL TIDAK dipasang)
- Perubahan sim HARUS opt-in via init options — `HeroVariantV3/Yakushev/Chdartmaker` masih pakai dye visible dan TIDAK boleh berubah feel
- Shader display = verbatim ekstraksi daspritam (13 baris, budget maks 30); channel R sengaja TIDAK digeser
- Nilai terkunci: `curl 20`, `splatRadius 0.3`; `SPLAT_FORCE 7200` & `dt` cap 0.016666 JANGAN disentuh (sudah ekuivalen referensi)
- Upload content texture HANYA saat resize/font-load, BUKAN per frame
- Layout POSTER "BILLYMAULANA" + Bebas Neue + entrance choreography existing TIDAK berubah
- Comment rules: block comment `/* */` only, WHY only, tanpa referensi dokumen planning/AI
- GLSL di template literal TIDAK hot-reload — full page reload setiap ubah shader
- Project tanpa test runner — gate per task = `pnpm typecheck` (+ lint/build di gate akhir); verifikasi visual = browser review wajib
- Commit HANYA setelah user approve (aturan global user) — satu commit di akhir, message satu baris

---

### Task 1: `useTextDistortion.ts` → masthead rasterizer murni

**Files:**
- Modify: `app/composables/useTextDistortion.ts` (rewrite penuh — WebGL dihapus)

**Interfaces:**
- Consumes: —
- Produces: `DistortionLine` (unchanged), `distortionTextPadding(width: number): number` (unchanged), `useMastheadRaster(config: MastheadRasterConfig)` → `{ render(cssWidth: number, cssHeight: number, scale: number): HTMLCanvasElement, updateLines(lines: DistortionLine[]): void }`. `MastheadRasterConfig = { fontFamily: string, fontWeight: number, letterSpacingEm: number, lines: DistortionLine[] }`

- [ ] **Step 1.1: Rewrite file**

Ganti SELURUH isi `app/composables/useTextDistortion.ts` dengan:

```ts
/**
 * Masthead rasterizer — menggambar teks hero ke offscreen 2D canvas sebagai
 * sumber texture untuk display pass useFluidSimulation. Displacement dan
 * chromatic split kini terjadi di GPU pass fluid, bukan di modul ini.
 */

export interface DistortionLine {
  text: string
  xAlign?: 'left' | 'center' | 'right'
  yFrac?: number
  indent?: number
  fontSize?: number
}

export interface MastheadRasterConfig {
  fontFamily: string
  fontWeight: number
  letterSpacingEm: number
  lines: DistortionLine[]
}

export function distortionTextPadding(width: number): number {
  const rootFs = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  return Math.min(Math.max(1.5 * rootFs, width * 0.04), 4 * rootFs)
}

export function useMastheadRaster(config: MastheadRasterConfig) {
  const cfg = { ...config, lines: [...config.lines] }
  const canvas = document.createElement('canvas')

  function applyFont(ctx: CanvasRenderingContext2D, fontSize: number) {
    ctx.font = `${cfg.fontWeight} ${fontSize}px ${cfg.fontFamily}`
    if ('letterSpacing' in ctx)
      ctx.letterSpacing = `${fontSize * cfg.letterSpacingEm}px`
  }

  /* Latar HITAM opak, bukan transparan: display pass fluid memakai shader
     referensi tanpa alpha handling — kompositing ke halaman terjadi lewat
     mix-blend-mode: difference pada elemen canvas (hitam = identity) */
  function render(cssWidth: number, cssHeight: number, scale: number): HTMLCanvasElement {
    const width = Math.max(1, Math.floor(cssWidth * scale))
    const height = Math.max(1, Math.floor(cssHeight * scale))
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = '#ffffff'
    ctx.textBaseline = 'alphabetic'

    const pad = distortionTextPadding(cssWidth) * scale

    for (let i = 0; i < cfg.lines.length; i++) {
      const line = cfg.lines[i]!
      const fontSize = (line.fontSize ?? 200) * scale
      applyFont(ctx, fontSize)
      const metrics = ctx.measureText(line.text)
      const indentPx = (line.indent ?? 0) * (fontSize / 200)
      const align = line.xAlign ?? 'left'
      let x = pad + indentPx
      if (align === 'right')
        x = width - pad - metrics.width - indentPx
      else if (align === 'center')
        x = (width - metrics.width) / 2 + indentPx
      const yFrac = line.yFrac ?? (i + 1) / (cfg.lines.length + 1)
      ctx.fillText(line.text, x, yFrac * height)
    }

    return canvas
  }

  function updateLines(lines: DistortionLine[]) {
    cfg.lines = lines
  }

  return { render, updateLines }
}
```

Catatan semantik yang dipertahankan dari versi lama (JANGAN diubah): konvensi `indent` dalam satuan `fontSize/200`, `yFrac` fraksi tinggi, `textBaseline: 'alphabetic'`, pad dari `distortionTextPadding(cssWidth)`. `scale` = devicePixelRatio; semua ukuran px dikali `scale` agar raster tajam di layar HiDPI.

- [ ] **Step 1.2: Typecheck (expected FAIL sementara)**

Run: `pnpm typecheck`
Expected: ERROR di `SectionHero.vue` (masih meng-import `useTextDistortion` yang sudah tidak ada). Error ini DIPERBAIKI di Task 3 — jangan perbaiki sekarang, lanjut Task 2.

---

### Task 2: `useFluidSimulation.ts` — init options + content display pass

**Files:**
- Modify: `app/composables/useFluidSimulation.ts`

**Interfaces:**
- Consumes: —
- Produces: `init(canvasEl, options?)` dengan options baru `{ curl?: number, splatRadius?: number, contentDisplay?: boolean }` (selain yang lama), dan fungsi publik baru `setContentCanvas(source: HTMLCanvasElement): void`. Return composable jadi `{ init, resize, destroy, multipleSplats, emitSplat, setContentCanvas }`.

- [ ] **Step 2.1: Tambah state module**

Setelah blok deklarasi FBO (setelah baris `let ditheringTexture: TextureObj | null = null`, ~line 182), tambah:

```ts
  // ── Content display (mode displacement daspritam) ──
  let contentDisplayEnabled = false
  let contentDisplayProgram: ProgramObj | null = null
  let contentTexture: TextureObj | null = null
```

(Header `// ──` mengikuti idiom section-marker yang sudah ada di file ini.)

- [ ] **Step 2.2: Tambah shader source**

Setelah `gradientSubtractShaderSource` (~line 602), tambah — body shader VERBATIM dari referensi, jangan diedit:

```ts
  /* Display pass daspritam: velocity fluid men-displace konten (uv - vel*0.001)
     dan menggeser channel G/B (vel*0.003) untuk fringe chromatic. Channel R
     sengaja tidak digeser — persis source referensi */
  const contentDisplayShaderSource = `
    precision highp float;

    uniform sampler2D tMap;
    uniform sampler2D tFluid;
    varying vec2 vUv;

    void main() {
      vec3 fluid = texture2D(tFluid, vUv).rgb;
      vec2 uv = vUv;
      vec2 uv2 = vUv - fluid.rg * 0.001;

      vec4 color = texture2D(tMap, uv2);

      vec3 rgb = fluid * 0.003;

      color.g = texture2D(tMap, vec2(uv.x - rgb.x, uv.y + rgb.y)).g;
      color.b = texture2D(tMap, vec2(uv.x - rgb.x, uv.y + rgb.y)).b;

      gl_FragColor = color;
    }
  `
```

(Satu-satunya adaptasi dari source asli: deklarasi `uniform float uTime` dibuang karena tidak pernah dipakai di body — GLSL compiler akan drop uniform inactive, membuang deklarasinya menghindari kebingungan. Vertex shader memakai `baseVertexShaderSource` existing yang sudah menyediakan `vUv`.)

- [ ] **Step 2.3: Terapkan options di `init()`**

Ubah signature init (line ~1629):

```ts
  function init(canvasEl: HTMLCanvasElement, options?: {
    skipInitialSplats?: boolean
    hueMin?: number
    hueMax?: number
    curl?: number
    splatRadius?: number
    contentDisplay?: boolean
  }): boolean {
```

Setelah `hueMax = options?.hueMax ?? 1`, tambah:

```ts
    if (options?.curl !== undefined)
      config.CURL = options.curl
    if (options?.splatRadius !== undefined)
      config.SPLAT_RADIUS = options.splatRadius
    contentDisplayEnabled = options?.contentDisplay ?? false
```

Setelah baris `displayMaterial = createMaterial(baseVertexShader, displayShaderSource)` (~line 1679), tambah:

```ts
    if (contentDisplayEnabled)
      contentDisplayProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, contentDisplayShaderSource))
```

- [ ] **Step 2.4: `setContentCanvas` + draw pass**

Setelah fungsi `drawDisplay` (~line 1203), tambah:

```ts
  function setContentCanvas(source: HTMLCanvasElement) {
    if (!gl)
      return
    const g = gl
    if (!contentTexture) {
      const texture = g.createTexture()!
      g.bindTexture(g.TEXTURE_2D, texture)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE)
      contentTexture = {
        texture,
        width: source.width,
        height: source.height,
        attach(id: number) {
          g.activeTexture(g.TEXTURE0 + id)
          g.bindTexture(g.TEXTURE_2D, texture)
          return id
        },
      }
    }
    g.bindTexture(g.TEXTURE_2D, contentTexture.texture)
    /* Raster 2D top-down, vUv WebGL bottom-up — flip saat upload agar
       searah dengan velocity field (texcoordY pointer sudah di-flip) */
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, true)
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, source)
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, false)
    contentTexture.width = source.width
    contentTexture.height = source.height
  }

  function drawContentDisplay(target: FBO | null) {
    if (!contentTexture || !contentDisplayProgram)
      return
    const g = gl!
    g.disable(g.BLEND)
    contentDisplayProgram.bind()
    g.uniform1i(contentDisplayProgram.uniforms.tMap!, contentTexture.attach(0))
    g.uniform1i(contentDisplayProgram.uniforms.tFluid!, velocity!.read.attach(1))
    blit!(target)
  }
```

- [ ] **Step 2.5: Route `render()` + skip dye pipeline**

Di awal fungsi `render(target)` (~line 1157), tambah:

```ts
  function render(target: FBO | null) {
    if (contentDisplayEnabled) {
      drawContentDisplay(target)
      return
    }
    ...(isi lama tidak berubah)...
```

Di fungsi `step(dt)`, tepat SEBELUM blok advection dye (sebelum baris `if (!ext!.supportLinearFiltering)` kedua, ~line 1148), tambah:

```ts
    /* Mode content: dye tak pernah ditampilkan — advection 512px-nya
       (pass termahal sim) di-skip. Velocity tetap penuh */
    if (contentDisplayEnabled)
      return
```

Di fungsi `splat(...)`, tepat SEBELUM bagian dye (sebelum baris `g.uniform1i(splatProgram!.uniforms.uTarget!, dye!.read.attach(0))`, ~line 1343), tambah:

```ts
    if (contentDisplayEnabled)
      return
```

- [ ] **Step 2.6: Cleanup di `destroy()` + export**

Di `destroy()` setelah `ditheringTexture = null`:

```ts
    contentTexture = null
    contentDisplayProgram = null
    contentDisplayEnabled = false
```

Ubah return composable (line 1755):

```ts
  return { init, resize, destroy, multipleSplats, emitSplat, setContentCanvas }
```

- [ ] **Step 2.7: Typecheck**

Run: `pnpm typecheck`
Expected: HANYA error `SectionHero.vue` sisa Task 1 (import lama). TIDAK boleh ada error baru dari `useFluidSimulation.ts`.

---

### Task 3: `SectionHero.vue` — rewiring canvas tunggal

**Files:**
- Modify: `app/components/SectionHero.vue`

**Interfaces:**
- Consumes: `useMastheadRaster` (Task 1), `fluid.init({ curl, splatRadius, contentDisplay })` + `fluid.setContentCanvas` (Task 2)
- Produces: — (leaf component)

- [ ] **Step 3.1: Script — imports & state**

Ganti blok import (line 2-6) menjadi:

```ts
import type { DistortionLine } from '~/composables/useTextDistortion'
import { useFluidSimulation } from '~/composables/useFluidSimulation'
import { useHeroStage } from '~/composables/useHeroStage'
import { distortionTextPadding, useMastheadRaster } from '~/composables/useTextDistortion'
import { profile } from '~/constants/profile'
```

(`distortionTextPadding` tetap di-import — masih dipakai `measureMasthead`. Yang berubah hanya `useTextDistortion` → `useMastheadRaster`.)

Hapus deklarasi: `const textCanvasRef = ref<HTMLCanvasElement>()`, `let textDistortion: ...`.

Tambah setelah `const fluid = useFluidSimulation()`:

```ts
const mastheadRaster = useMastheadRaster({
  fontFamily: NAME_FONT,
  fontWeight: 400,
  letterSpacingEm: NAME_TRACKING_EM,
  lines: [],
})

function uploadMasthead() {
  const section = sectionRef.value
  if (!section || !fluidReady)
    return
  mastheadRaster.updateLines(buildDistortionLines())
  const dpr = window.devicePixelRatio || 1
  fluid.setContentCanvas(mastheadRaster.render(section.clientWidth, section.clientHeight, dpr))
}
```

- [ ] **Step 3.2: Script — onMounted wiring**

Ubah `fluid.init` (line 156):

```ts
    fluidReady = fluid.init(fluidCanvasRef.value, {
      skipInitialSplats: true,
      hueMin: 0.52,
      hueMax: 0.75,
      curl: 20,
      splatRadius: 0.3,
      contentDisplay: true,
    })
```

Ubah callback ResizeObserver (line 159-161):

```ts
      resizeObserver = new ResizeObserver(() => {
        fluid.resize()
        uploadMasthead()
      })
```

Ganti blok textCanvas init (line 174-185) dengan satu panggilan:

```ts
  uploadMasthead()
```

Ubah `textResizeHandler` (line 187-190):

```ts
  textResizeHandler = () => {
    layoutMasthead()
    uploadMasthead()
  }
```

- [ ] **Step 3.3: Script — timeline crossfade**

HAPUS blok lama:

```ts
    if (fluidReady && fluidCanvasRef.value)
      tl.to(fluidCanvasRef.value, { opacity: 1, duration: 2, ease: 'power3.out' }, 1.4)

    if (textDistortion && textCanvasRef.value && namesRef.value) {
      tl.call(() => {
        textDistortion?.start()
      }, [], 1.25)
      tl.to(textCanvasRef.value, { opacity: 1, duration: 0.6, ease: 'power3.out' }, 1.35)
      tl.to(namesRef.value, { autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 1.4)
      tl.set(namesRef.value, { display: 'none' }, 2.15)
    }
```

GANTI dengan (timing crossfade DOM→canvas dipertahankan):

```ts
    if (fluidReady && fluidCanvasRef.value && namesRef.value) {
      tl.to(fluidCanvasRef.value, { opacity: 1, duration: 0.6, ease: 'power3.out' }, 1.35)
      tl.to(namesRef.value, { autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 1.4)
      tl.set(namesRef.value, { display: 'none' }, 2.15)
    }
```

- [ ] **Step 3.4: Script — scroll parallax**

Canvas kini MENAMPILKAN masthead, jadi harus bergerak identik dengan konten (dulu text canvas ikut `contentRef` -25%). Ganti SELURUH blok scroll (line 267-305) dengan:

```ts
    if (sectionRef.value && contentRef.value) {
      gsap.to([contentRef.value, fluidCanvasRef.value].filter(Boolean), {
        yPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })

      gsap.to(
        [contentRef.value, fluidCanvasRef.value, taglineRef.value, monoBRef.value, monoMRef.value, metaRef.value].filter(Boolean),
        {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top top',
            end: '50% top',
            scrub: true,
          },
        },
      )
    }
```

(Blok parallax lama canvas -12% — `if (sectionRef.value && fluidCanvasRef.value) { ... yPercent: -12 ... }` — TERHAPUS oleh penggantian ini; jangan disisakan.)

- [ ] **Step 3.5: Script — onUnmounted**

Hapus dua baris:

```ts
  textDistortion?.destroy()
  textDistortion = null
```

- [ ] **Step 3.6: Template**

Hapus elemen text canvas (line 339-343):

```html
      <canvas
        ref="textCanvasRef"
        class="hero__text-canvas"
        aria-hidden="true"
      />
```

DOM masthead `namesRef` + `<h1 class="sr-only">` TETAP (entrance + a11y/SEO).

- [ ] **Step 3.7: Style**

`.hero__canvas`: ganti `mix-blend-mode: screen` → `mix-blend-mode: difference` (raster hitam = identity, teks putih = invert di atas bg gelap — tampilan setara text canvas lama yang difference via `.hero__content`), dan `z-index: 3` → `z-index: 5` (text canvas lama hidup di z5 DI ATAS grain z4; tanpa ini masthead baru tertimpa grain — beda dari tampilan approved). Urutan DOM menjaga `.hero__content` (z5, muncul belakangan) tetap di atas canvas untuk crossfade; grain & content `pointer-events: none` sehingga mouse tetap sampai ke canvas.

Hapus seluruh rule `.hero__text-canvas { ... }` (line 421-428).

Di blok `@media (prefers-reduced-motion: reduce)` (line 606-611): hapus selector `.hero__text-canvas`, sisakan `.hero__canvas { display: none; }`.

- [ ] **Step 3.8: Typecheck penuh**

Run: `pnpm typecheck`
Expected: PASS, nol error.

---

### Task 4: Gate build

- [ ] **Step 4.1:** Run: `pnpm lint` — Expected: PASS (jalankan `pnpm lint:fix` dulu bila perlu)
- [ ] **Step 4.2:** Run: `pnpm build` — Expected: sukses tanpa error
- [ ] **Step 4.3:** Clean rebuild dev: stop dev server bila jalan → `rm -rf .nuxt` → `pnpm dev` — Expected: log bersih tanpa `[Vue warn]`

---

### Task 5: Browser review (art director) — WAJIB, full page reload (GLSL tidak HMR)

- [ ] **Step 5.1:** Buka halaman `/` → screenshot idle 3 detik TANPA mouse — masthead BILLYMAULANA harus tampil normal & tajam, nol distorsi, nol artefak, entrance choreography utuh (chars naik + blur-to-sharp, crossfade DOM→canvas mulus tanpa jump posisi)
- [ ] **Step 5.2:** Gerakkan mouse pelan melintasi masthead — glyph meleleh halus mengikuti arus, pulih ~1 detik
- [ ] **Step 5.3:** Flick cepat — fringe chromatic (G/B split) muncul di area velocity tinggi lalu hilang
- [ ] **Step 5.4:** Cek console: nol Vue warn / GL error
- [ ] **Step 5.5:** Cek halaman variant `/hero-v3`, `/hero-yakushev`, `/hero-chdartmaker` — dye visible masih tampil PERSIS seperti sebelumnya (options tidak diaktifkan di sana)
- [ ] **Step 5.6:** Resize window + reload di DPR berbeda — masthead tetap fit-to-width, raster tajam
- [ ] **Step 5.7:** Presentasi ke user: screenshot + GIF interaksi + "Ini hasilnya. Bagaimana menurutmu?" — TANPA klaim evaluatif, TANPA mark complete. Hapus semua file screenshot/GIF setelah dipakai (tidak boleh muncul di `git status`)

**Iteration limit:** 2× gagal match feel → STOP, konsultasi user.

---

### Task 6: Commit (gated)

- [ ] **Step 6.1:** HANYA setelah user approve visual: tunjukkan `git status` + summary → tanya "Approve commit?"
- [ ] **Step 6.2:** Setelah approve: pre-commit gate `pnpm typecheck && pnpm lint && pnpm build` harus pass, lalu:

```bash
git add app/composables/useTextDistortion.ts app/composables/useFluidSimulation.ts app/components/SectionHero.vue
git commit -m "feat(hero): fluid velocity displacement masthead + chromatic fringe"
```

(`git add` spesifik by name; docs/plans TIDAK di-stage; TANPA trailer AI apapun.)
