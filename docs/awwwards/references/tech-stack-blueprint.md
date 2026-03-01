# Technology Stack Blueprint — Awwwards Winners

Tech stack, tools, dan pendekatan teknis yang digunakan pemenang SOTD/SOTM/SOTY.

---

## Framework Landscape (2024-2025)

| Framework | Ekosistem | Contoh Pemenang |
|---|---|---|
| **Next.js** | React (dominan) | Darkroom Engineering, Lusion, Stefan Vitasovic |
| **Nuxt.js** | Vue (kuat) | Zentry (SOTM Sep 2024), Noomo (SOTY 2023), Federico Pian |
| **Astro** | Multi-page (naik pesat) | Stas Bondar portfolio 2025 |
| **Custom/Vanilla** | No framework | Aristide Benoist, one-off experiments |
| **SvelteKit** | Svelte (mulai muncul) | Beberapa experimental projects |

### Rendering Strategy
- **SSG** paling umum untuk portfolio/agency — performance terbaik, Lighthouse tinggi
- **SPA** untuk experience-heavy — full kontrol animasi, SEO trade-off
- **SSR** jarang untuk creative sites — lebih umum di e-commerce

---

## Animation & Motion

### GSAP — De-facto Standard
Webflow mengakuisisi GreenSock (2025) — SEMUA plugin sekarang **gratis**:

| Plugin | Fungsi |
|---|---|
| **ScrollTrigger** | Scroll-linked animations — hampir semua pemenang |
| **SplitText** | Per-character/word/line animation |
| **Flip** | State-to-state morphing, page transitions |
| **ScrollSmoother** | Smooth scroll (GSAP native) |
| **MorphSVG** | SVG path morphing |
| **DrawSVG** | SVG stroke animation |
| **Physics2D** | Physics-based animation |
| **ScrambleText** | Text decode/scramble effect |
| **Draggable** | Touch/drag interactions |

**Performance patterns:**
- `gsap.quickTo()` untuk continuous animations (mouse tracking, scroll)
- `gsap.ticker.add()` untuk single rendering heartbeat
- Timeline orchestration dengan staggered delays

### Lenis vs GSAP ScrollSmoother

| Aspek | Lenis | ScrollSmoother |
|---|---|---|
| Bundle | ~2KB gzipped | ~26KB |
| Approach | Lightweight, minimal | Full-featured, tight GSAP integration |
| DOM | Native structure preserved | Requires wrapper |
| Dipakai oleh | Darkroom Engineering, Bureau DAM | All-in GSAP sites |

**Rekomendasi:** Lenis lebih populer di creative developers — ringan dan fleksibel.

Sync pattern:
```typescript
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

### Barba.js — Page Transitions
~9KB, transition manager (bukan animation library). Butuh GSAP untuk animasi. Hook order: `beforeLeave → leave → afterLeave → beforeEnter → enter → afterEnter`.

### Theatre.js — Visual Animation Editor
Dipakai Darkroom Engineering. Timeline-based visual editor — designer bisa tweak timing tanpa coding.

### Framer Motion vs GSAP
Framer Motion populer di React tapi JARANG di Awwwards winners. GSAP dominan karena framework-agnostic, plugin ecosystem lebih kaya, performance lebih baik.

---

## WebGL & 3D

### Library Comparison

| Library | Bundle | Penggunaan | Contoh |
|---|---|---|---|
| **Three.js** | ~600KB+ | Paling mainstream | Lusion, Akaru |
| **R3F** | Three.js + React | Dominan di React | Roman Jean-Elie |
| **OGL** | Jauh lebih kecil | Naik untuk commercial | Adrian Gubrica (OFF+BRAND) |
| **TresJs** | Three.js + Vue | Nuxt ecosystem | Federico Pian |
| **Custom WebGL** | Minimal | Maximum control | Bespoke shader sites |

**OGL insight (Adrian Gubrica):** "Much smaller bundle sizes compared to Three.js, great performance when working with multiple render targets."

### Shader Techniques yang Umum

| Teknik | Deskripsi |
|---|---|
| Ordered Dithering | Bayer matrix + color quantization |
| Simplex/Perlin Noise | Organic distortion, turbulence |
| SDF (Signed Distance Field) | Rounded rect, text rendering |
| Chromatic Aberration | RGB channel splitting — premium feel |
| Scroll-velocity Distortion | `uScrollSpeed` driven warping |
| FBO / Render-to-texture | Bounded scenes, post-processing |
| Procedural Textures | `fract` + noise replacing 3D geometry |

### Post-Processing Stack
- Bloom (UnrealBloomPass) — glow
- Film Grain — analog/cinematic
- Chromatic Aberration — RGB shift
- Vignette — depth focus
- Filmic Tone-mapping — cinematic color

### WebGL Performance Optimization

1. **Texture Substitution:** Ganti raytraced glass dengan `fract` + noise
2. **Asset Pipeline:** Blender → gltf-transform CLI → optimized GLB
3. **Draw Call Reduction:** Merge objects, instancing, batching
4. **Memory Management:** `geometry.dispose()` + `material.dispose()` saat transition
5. **Selective Rendering:** Hanya render mesh visible
6. **OffscreenCanvas + Workers:** Rendering di worker thread
7. **Mobile Adaptation:** Scale down resolution, simplify shaders
8. **Lazy Init:** Dynamic import WebGL library
9. **Single RAF Loop:** `gsap.ticker.add()` — bukan multiple requestAnimationFrame

**Lusion vertex anim optimization:** Store values dalam 16-bit integer + PNG LZW compression. 983KB desktop, 246KB mobile.

---

## Design Tools & Workflow

| Tool | Fungsi |
|---|---|
| **Figma** | Primary design — hampir universal |
| **Blender** | 3D assets (Adrian Gubrica, Lusion) |
| **Houdini** | Vertex animation, procedural (Lusion) |
| **After Effects** | Motion prototyping sebelum coding |
| **Theatre.js** | Fine-tuning timing di browser |
| **Notion/Linear** | Project management (Niccolo Miranda) |

---

## Performance — 90+ Lighthouse WITH Heavy Animations

### Code Level
- **Code Splitting + Dynamic Import** — WebGL lazy-loaded
- **Single RAF Loop** — gsap.ticker sebagai satu-satunya heartbeat
- **gsap.quickTo()** — Reusable functions, bukan new tween per frame

### Image Optimization
- **Format:** AVIF (93% support) > WebP > JPEG
- **Lazy Loading:** IntersectionObserver, JANGAN lazy-load LCP element
- **Responsive:** `srcset` + `sizes` attributes
- **Compression:** 50-80% payload reduction

### Font Loading
- `font-display: swap` (FOUT > FOIT)
- **WOFF2** format
- **Preload** critical fonts
- **Subsetting:** Hanya include karakter yang dipakai

### Awwwards Mobile Excellence Metrics

| Metrik | Target |
|---|---|
| Page Load | < 3 detik |
| Speed Index | Serendah mungkin (ms) |
| First Meaningful Paint | Secepat mungkin |
| Response Time | < 50ms |
| Lighthouse Score | 90+ |

---

## CSS & Styling

| Approach | Status |
|---|---|
| **Tailwind CSS** | Naik pesat — Federico Pian, Darkroom Satus (v4) |
| **Custom CSS + Variables** | Masih sangat umum — Zentry |
| **CSS Modules** | Dengan React/Next.js |
| **UnoCSS** | Alternative Tailwind (Vue/Nuxt) |
| **SCSS** | Menurun tapi masih ada |

**Fluid Typography (universal pattern):**
```css
--text-display: clamp(3rem, 8vw, 13rem);
--text-heading: clamp(2rem, 5vw, 6rem);
--text-body: clamp(1rem, 1.2vw, 1.25rem);
```

---

## Emerging Tech (2025-2026)

### View Transitions API
- Baseline Newly Available di semua major browsers
- Bisa menggantikan Barba.js untuk transisi sederhana
- Untuk complex orchestration, Barba.js/GSAP masih lebih reliable

### CSS Scroll-Driven Animations
- `animation-timeline: scroll()` dan `view()`
- Mengurangi dependency ScrollTrigger untuk efek sederhana
- Belum bisa gantikan GSAP untuk complex orchestration

### WebGPU
- Three.js WebGPURenderer tersedia — fallback ke WebGL
- TSL (Three Shader Language) — syntax mirip JS, transpile ke GLSL/WGSL
- Chrome/Edge stable, Safari/Firefox experimental
- Belum mainstream di winners tapi adopsi accelerating

---

## Ideal Stack untuk Awwwards Target (2025)

### Tier 1: Core
- **Framework:** Nuxt 4 / Next.js 16 / Astro
- **Animation:** GSAP (ScrollTrigger + SplitText + Flip) — gratis
- **Smooth Scroll:** Lenis (2KB) atau ScrollSmoother
- **WebGL:** Three.js (mature) atau OGL (lightweight)
- **Build:** Vite (Nuxt/Astro) atau Turbopack (Next.js)

### Tier 2: Enhancement
- **Page Transitions:** Barba.js / View Transitions API
- **Visual Editor:** Theatre.js
- **3D Assets:** Blender → gltf-transform → GLB
- **Shaders:** Custom GLSL

### Tier 3: Infrastructure
- **Hosting:** Vercel / Netlify
- **Font:** WOFF2 + swap + preload + subset
- **Images:** AVIF/WebP + lazy loading + CDN
- **CSS:** Tailwind/UnoCSS + custom properties + fluid clamp()

---

## Sumber
- [GSAP becomes free via Webflow](https://webflow.com/blog/gsap-becomes-free)
- [Darkroom Engineering Satus](https://github.com/darkroomengineering/satus)
- [Lenis GitHub](https://github.com/darkroomengineering/lenis)
- [Adrian Gubrica - Codrops](https://tympanus.net/codrops/2025/12/05/from-illusions-to-optimization-the-creative-webgl-worlds-of-adrian-gubrica/)
- [Stas Bondar Portfolio - Codrops](https://tympanus.net/codrops/2025/03/25/stas-bondar-25-the-code-techniques-behind-a-next-level-portfolio/)
- [Federico Pian Portfolio - Codrops](https://tympanus.net/codrops/2024/10/02/case-study-federico-pian-portfolio-2024/)
- [Zentry Case Study](https://www.awwwards.com/zentry-case-study.html)
- [View Transitions 2025](https://developer.chrome.com/blog/view-transitions-in-2025)
- [Three.js WebGPU](https://sbcode.net/threejs/webgpu-renderer/)
