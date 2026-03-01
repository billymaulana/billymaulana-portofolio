# Kinetic Typography — Teks yang Hidup

"Kinetic typography" = moving text. Bukan hanya animasi teks biasa — ini seni membuat huruf menjadi **material ekspresif** yang menyampaikan emosi, ritme, dan narasi melampaui makna kata.

Sources:
- https://tympanus.net/codrops/2024/08/13/kinetic-typography-with-three-js/
- https://tympanus.net/codrops/2025/01/08/bringing-letters-to-life-svg-typography-animation/
- Barbara Brownie, *Transforming Type: New Directions in Kinetic Typography* (Bloomsbury, 2015)

---

## Klasifikasi Barbara Brownie

Barbara Brownie membagi kinetic typography menjadi dua kategori fundamental:

### 1. Motion Typography
Teks **bergerak sebagai unit** — posisi, rotasi, skala berubah, tapi bentuk huruf tetap utuh.

| Teknik | Deskripsi | Contoh |
|--------|-----------|--------|
| **Translation** | Teks berpindah posisi (slide, fly-in) | Headline yang masuk dari kiri |
| **Rotation** | Teks berputar pada sumbu | Kata yang rotate 360 saat scroll |
| **Scaling** | Teks membesar/mengecil | Zoom-in pada keyword penting |
| **Sequencing** | Kata muncul satu per satu | Subtitle-style reveal |
| **Scrolling** | Teks mengalir continuous | Credits, ticker tape |

**Karakter**: Controlled, structured, typographic integrity terjaga. Cocok untuk informational dan editorial.

### 2. Fluid Typography
Bentuk huruf itu sendiri **berubah, morph, atau distorsi** — letterform bukan fixed entity.

| Teknik | Deskripsi | Contoh |
|--------|-----------|--------|
| **Morphing** | Huruf A morph ke huruf B | Logo transition, loading state |
| **Warping** | Letterform di-distorsi (bend, twist, melt) | Hover effect pada headline |
| **Dissolving** | Huruf pecah/larut menjadi partikel | Exit animation, page transition |
| **Growing** | Huruf "tumbuh" — stroke expand, fill animate | Organic reveal |
| **Variable Font** | Weight/width/slant berubah real-time | Responsive ke scroll/cursor |

**Karakter**: Experimental, emosional, letterform sebagai visual material. Cocok untuk creative, artistic expression.

### Kapan Pakai Mana

| Konteks | Pilih | Alasan |
|---------|-------|--------|
| Portfolio headline | Motion | Readability preserved, dramatic entrance |
| Hero statement | Motion + hint Fluid | Per-char stagger + subtle warp pada hover |
| Creative agency site | Fluid | Letterform experimentation = brand personality |
| Loading/preloader | Fluid | Morphing text = engaging waiting experience |
| Section transition | Motion | Controlled exit/enter = narrative rhythm |
| Hover interaction | Fluid | Distortion = tactile, responsive feedback |
| Project title reveal | Motion | Stagger + clip-path = cinematic |

---

## Teknik 1: Three.js Render Target untuk Kinetic Type

Dari Codrops tutorial — teknik untuk menempatkan teks 2D pada permukaan 3D geometry menggunakan Render Target (off-screen rendering).

### Konsep Inti: Render Target Workflow

```
Step 1: Buat scene kedua (offscreen) → render teks/UI 2D ke texture
Step 2: Texture ini jadi material untuk 3D geometry (box, torus, sphere)
Step 3: Main scene render geometry dengan teks sebagai surface
```

**Analogi**: Bayangkan proyektor film. Kamu render "film" (teks 2D) ke layar virtual, lalu "tempelkan" layar itu ke permukaan 3D (kubus, donut, tabung).

### Implementasi Pattern

```
// Off-screen render target
renderTarget = new THREE.WebGLRenderTarget(width, height)

// Scene 2 (offscreen): teks 2D
offscreenScene.add(textMesh)  // menggunakan three-bmfont-text atau troika-three-text

// Material untuk geometry 3D
material = new ShaderMaterial({
  uniforms: {
    uTexture: { value: renderTarget.texture },
    uTime: { value: 0 }
  },
  fragmentShader: `
    // Sample dari render target texture
    vec4 texColor = texture2D(uTexture, vUv);
    // Apply effects: fract() untuk tiling, noise untuk distortion
    vec2 uv = fract(vUv * 3.0 + uTime * 0.1);
    gl_FragColor = texture2D(uTexture, uv);
  `
})

// Geometry 3D dengan teks sebagai surface
geometry = new THREE.TorusKnotGeometry(...)
mesh = new THREE.Mesh(geometry, material)
```

### Shader Techniques untuk Kinetic Text

| Effect | Shader Method | Visual |
|--------|---------------|--------|
| **Tiling** | `fract(uv * n)` | Teks diulang n kali di permukaan |
| **Scrolling** | `uv + vec2(0, time * speed)` | Teks mengalir di permukaan 3D |
| **Distortion** | `uv + noise(uv, time) * strength` | Teks bergelombang organic |
| **Reveal** | `step(progress, uv.y)` | Teks muncul progressively |
| **Glitch** | `uv + step(random, 0.95) * offset` | Random displacement per frame |

### Geometries yang Efektif

| Geometry | Karakter | Kapan Pakai |
|----------|----------|-------------|
| **BoxGeometry** | Clean, architectural | Editorial, minimal design |
| **TorusKnotGeometry** | Organic, flowing | Creative, artistic expression |
| **SphereGeometry** | All-encompassing | Globe/world metaphor |
| **CylinderGeometry** | Column, scroll | Text ticker, rotating menu |
| **PlaneGeometry** | Flat + shader distortion | Displacement effect, video-like |

---

## Teknik 2: SVG Stroke Drawing Animation

Dari Codrops "Bringing Letters to Life" — teknik menggambar huruf stroke-by-stroke menggunakan SVG `stroke-dashoffset`.

### Konsep Inti

```
SVG text → convert ke <path> → animate stroke-dashoffset dari total length ke 0
```

Efeknya: huruf terlihat "digambar" di depan mata, stroke demi stroke.

### Requirements

| Requirement | Detail |
|-------------|--------|
| **Font type** | Monoline (stroke-based) — BUKAN filled fonts |
| **SVG conversion** | Font → SVG path (via Illustrator, Figma, atau fontkit) |
| **stroke-dasharray** | Set ke total path length |
| **stroke-dashoffset** | Animate dari `pathLength` ke `0` |

### Monoline vs Filled Fonts

```
Monoline font (COCOK untuk stroke drawing):
  - Setiap huruf = single stroke path
  - stroke-dashoffset animasi terlihat natural
  - Contoh: Hershey fonts, single-line fonts

Filled font (TIDAK COCOK langsung):
  - Huruf = filled shape, bukan stroke
  - Perlu convert ke outline path dulu
  - Atau gunakan -webkit-text-stroke sebagai approximation
```

### GSAP Implementation Pattern

```javascript
// Get total path length
const pathLength = path.getTotalLength()

// Set initial state: fully hidden
gsap.set(path, {
  strokeDasharray: pathLength,
  strokeDashoffset: pathLength,
  fill: 'none',
  stroke: '#fff'
})

// Animate: "draw" the letter
gsap.to(path, {
  strokeDashoffset: 0,
  duration: 1.2,
  ease: 'power3.out'
})
```

### Multi-Letter Orchestration

```javascript
// Staggered drawing — setiap huruf mulai setelah sebelumnya
const tl = gsap.timeline()

paths.forEach((path, i) => {
  const length = path.getTotalLength()
  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length
  })
  tl.to(path, {
    strokeDashoffset: 0,
    duration: 1.2,
    ease: 'power3.out'
  }, i * 0.15) // 0.15s stagger per letter
})
```

### Path Duplication untuk Richer Effect

```
Technique: Duplicate setiap path → animate kedua dengan timing berbeda
- Path 1 (original): stroke drawing animation
- Path 2 (duplicate): delayed, different color/opacity
- Efek: "echo" atau "shadow" yang follow primary stroke
```

```javascript
// Duplicate path
const clone = path.cloneNode()
clone.style.stroke = 'rgba(255,255,255,0.3)'
path.parentNode.appendChild(clone)

// Stagger: clone starts 0.2s after original
tl.to(clone, {
  strokeDashoffset: 0,
  duration: 1.4,
  ease: 'power3.out'
}, '-=1.0') // overlap with original
```

---

## Teknik 3: Per-Character Animation (SplitText)

Foundation dari semua kinetic typography di web — pecah teks menjadi unit animatable.

### Split Levels

| Level | Apa yang Di-split | Kapan Pakai |
|-------|-------------------|-------------|
| **chars** | Setiap karakter individual | Hero headline reveal, creative effects |
| **words** | Setiap kata | Subtitle reveal, paragraph animation |
| **lines** | Setiap baris (berdasarkan wrapping) | Section heading, description reveal |

### Animation Patterns

| Pattern | Method | Feel |
|---------|--------|------|
| **Masked Reveal** | `overflow: hidden` + animate `y` dari bawah | Cinematic, professional |
| **Stagger Cascade** | 0.01-0.03s per char | Flowing, typewriter-like |
| **Scatter → Assemble** | Random position → final position | Playful, dynamic |
| **Blur Reveal** | `filter: blur(10px)` → `blur(0)` per char | Dreamlike, focus shift |
| **Scale Bounce** | `scale: 0` → `scale: 1` dengan back easing | Energetic, pop-in |
| **Rotation Flip** | `rotateX: -90` → `rotateX: 0` per char | 3D reveal, dramatic |
| **Clip Reveal** | `clip-path: inset(100% 0 0 0)` → `inset(0)` | Clean, geometric |

### Stagger Math

```
Total animation time = baseDuration + (stagger × charCount)

Contoh headline "CREATIVE DEVELOPER" (18 chars):
- Base: 0.8s per char animation
- Stagger: 0.02s
- Total: 0.8 + (0.02 × 18) = 1.16s

Rule of thumb:
- < 10 chars: stagger 0.03-0.05s (lebih visible per char)
- 10-30 chars: stagger 0.015-0.03s (balanced)
- > 30 chars: stagger 0.008-0.015s (harus cepat agar tidak boring)
```

---

## Teknik 4: Variable Font Animation

Variable fonts memungkinkan animasi weight, width, slant secara continuous — bukan discrete jump.

### Animatable Axes

| Axis | CSS Property | Range Contoh | Effect |
|------|-------------|-------------|--------|
| **wght** | `font-variation-settings: 'wght'` | 100-900 | Thin ↔ Black |
| **wdth** | `font-variation-settings: 'wdth'` | 75-125 | Condensed ↔ Extended |
| **slnt** | `font-variation-settings: 'slnt'` | -12-0 | Upright ↔ Italic |
| **opsz** | `font-variation-settings: 'opsz'` | 8-144 | Optical size adaptation |

### Scroll-Driven Variable Font

```javascript
// Weight berubah berdasarkan scroll position
ScrollTrigger.create({
  trigger: '.section',
  start: 'top center',
  end: 'bottom center',
  onUpdate: (self) => {
    const weight = gsap.utils.interpolate(100, 900, self.progress)
    element.style.fontVariationSettings = `'wght' ${weight}`
  }
})
```

### Cursor-Proximity Variable Font

```javascript
// Weight berubah berdasarkan jarak cursor ke teks
document.addEventListener('mousemove', (e) => {
  chars.forEach(char => {
    const rect = char.getBoundingClientRect()
    const dist = Math.hypot(
      e.clientX - (rect.left + rect.width/2),
      e.clientY - (rect.top + rect.height/2)
    )
    const weight = gsap.utils.clamp(100, 900,
      gsap.utils.mapRange(0, 300, 900, 100, dist)
    )
    char.style.fontVariationSettings = `'wght' ${weight}`
  })
})
```

---

## Teknik 5: MorphSVG untuk Fluid Typography

GSAP MorphSVGPlugin memungkinkan morph satu letterform ke yang lain — inti dari fluid typography.

### Pattern

```javascript
// Morph huruf A ke huruf B
gsap.to('#letter-A path', {
  morphSVG: '#letter-B path',
  duration: 1.5,
  ease: 'expo.inOut'
})
```

### Use Cases di Awwwards Sites

| Use Case | Deskripsi |
|----------|-----------|
| **Logo morph** | Logo morph ke nama brand dan sebaliknya |
| **Loading text** | Kata "Loading" morph ke "Welcome" |
| **Section label** | "01" morph ke "02" saat scroll ke section berikut |
| **Hover transform** | Huruf morph ke icon/symbol saat hover |
| **Language switch** | Kata morph ke terjemahan (subtle, bukan instant) |

---

## Performance Guidelines

| Rule | Detail |
|------|--------|
| **Char count limit** | > 50 chars per-character animation = too slow. Split per-word instead |
| **GPU friendly** | Animate `transform` dan `opacity`, bukan `font-size` atau `letter-spacing` |
| **Variable font overhead** | `font-variation-settings` per frame = OK untuk < 20 elements. Batch update untuk lebih |
| **SVG path complexity** | Simplify paths (reduce points) sebelum animate — complex paths = jank |
| **Three.js text** | `troika-three-text` lebih ringan dari geometry-based text. Prefer untuk banyak teks |
| **Dispose** | SplitText.revert() saat cleanup — kembalikan DOM ke original |
| **Reduced motion** | `prefers-reduced-motion`: skip per-char animation, tampilkan langsung |

---

## Trend Kinetic Typography 2025-2026

| Trend | Deskripsi | Example |
|-------|-----------|---------|
| **3D Text in Browser** | Teks pada permukaan 3D (cube, torus) via Three.js | Codrops Kinetic Type demo |
| **Variable Font Interaction** | Weight/width respond ke cursor/scroll real-time | Experimental foundries |
| **Text as Particle System** | Huruf dissolve/reform dari partikel | Page transitions |
| **AI-Driven Typography** | Text style respond ke content sentiment | Generative editorial |
| **Scroll-Driven Morphing** | Letterform morph berdasarkan scroll progress | Section transitions |
| **CSS-Only Kinetic** | `@property` + `@keyframes` tanpa JS | Lightweight alternative |

---

## Hubungan dengan Portfolio Billy

**Sudah ada**:
- `useCharSplit()` — SplitText equivalent untuk per-char animation
- `useTextScramble()` — text scramble effect pada hover
- GSAP + ScrollTrigger integration
- WebGL text distortion shader di hero

**Bisa ENHANCE tanpa mengganti**:
- SVG stroke drawing untuk preloader atau loading state
- Variable font weight animation respond ke scroll (jika pakai variable font)
- Per-char blur reveal sebagai alternative ke current char animation
- MorphSVG untuk section number transitions (01 → 02)
- Three.js render target untuk experimental section background
- Cursor-proximity font weight sebagai subtle interaction layer
