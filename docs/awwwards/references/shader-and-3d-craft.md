# Shader & 3D Craft untuk Awwwards

Knowledge dari The Book of Shaders (Patricio Gonzalez Vivo) dan Three.js Journey (Bruno Simon). Fokus pada teknik yang langsung applicable untuk award-winning web design.

Sources:
- https://thebookofshaders.com/
- https://threejs-journey.com/

---

## Kenapa Shader & 3D Penting untuk Awwwards

Awwwards Creativity (20%) + Design (40%) = 60% skor bergantung pada visual impact. WebGL/shader adalah pembeda antara "situs bagus" dan "situs yang bikin orang bilang wow". Tapi ingat: **WebGL hanya saat CSS tidak cukup** (Vladyslav Penev). Jangan default ke 3D — gunakan saat rendering layer butuh expression yang CSS tidak bisa.

---

## The Book of Shaders — Essential Concepts

### Foundation: Fragment Shader
Fragment shader = program yang berjalan per-pixel di GPU. Setiap pixel dihitung secara paralel. Ini yang bikin efek visual bisa real-time di browser.

### Shaping Functions (Chapter 5) — Fondasi Semua Efek
Fungsi yang mengontrol bagaimana nilai berubah dari 0.0 ke 1.0. Ini "alfabet" dari semua shader effects:

| Fungsi | Kegunaan di Web Design |
|--------|----------------------|
| `smoothstep(edge0, edge1, x)` | Transisi halus — reveal, fade, gradient boundary |
| `step(edge, x)` | Hard cut — mask, threshold, on/off |
| `mix(a, b, t)` | Blend dua nilai — color transition, morph |
| `sin(x)` / `cos(x)` | Oscillation — wave, pulse, breathing effect |
| `pow(x, n)` | Contrast curve — sharpen/soften gradient |
| `fract(x)` | Repeat pattern — tiling, grid, stripe |
| `abs(x)` | Mirror — symmetrical patterns |
| `clamp(x, min, max)` | Batas nilai — prevent overflow |

**Prinsip**: Semua efek visual kompleks pada akhirnya adalah kombinasi dari fungsi-fungsi sederhana ini. Kuasai ini = bisa bikin apapun.

### Noise (Chapter 11-13) — Organic Texture
Noise = "smooth randomness". Kunci untuk efek yang terasa natural, bukan mechanical.

| Tipe | Karakteristik | Kegunaan |
|------|--------------|----------|
| **Value Noise** | Interpolasi random values, agak blocky | Quick grain, static texture |
| **Perlin Noise** (Gradient) | Smooth, organic flow | Terrain, clouds, water, distortion |
| **Simplex Noise** | Lebih efisien, less artifacts | Real-time effects, mobile-friendly |
| **Fractal Brownian Motion (fBM)** | Layered noise di berbagai scale | Realistic terrain, smoke, atmosphere |

**Untuk Awwwards**: Noise overlay, fluid distortion, organic text warp, background atmosphere — semua pakai noise sebagai driver. Portfolio Billy sudah pakai ini di glass shader dan fluid sim.

### Patterns (Chapter 9) — Generative Visual
- `fract()` untuk repeating patterns
- `mod()` untuk grid systems
- Kombinasi sin/cos untuk moire, interference patterns
- Rotasi dan scaling untuk kaleidoscopic effects

### Colors (Chapter 6)
- Color space manipulation (RGB, HSB)
- `mix()` untuk smooth color transitions
- Gradient via shaping functions — bukan linear, tapi curved
- Atmospheric color shifts via noise-driven hue rotation

### Image Processing (Chapter 14-18)
- Texture sampling dan manipulation
- Kernel convolutions (blur, sharpen, edge detect)
- Displacement mapping — **distorsi gambar via texture** (inti dari displacement hover effects)
- Post-processing: bloom, vignette, chromatic aberration

---

## Three.js Journey — Teknik untuk Web

### Chapter 4: Shaders (18 lessons, paling relevan)

| Lesson | Relevansi Awwwards |
|--------|-------------------|
| **Shader Patterns** | Generative backgrounds, procedural textures — bukan foto |
| **Raging Sea** | Vertex displacement + fragment coloring = organic surface animation |
| **Animated Galaxy** | Particle system + custom shader = immersive hero background |
| **Coffee Smoke** | Organic fluid movement — applicable untuk fog, mist, atmosphere |
| **Hologram** | Fresnel effect + scan lines = futuristic UI overlay |
| **Fireworks** | Particle explosion — bisa jadi page transition effect |
| **Halftone Shading** | Stylized rendering — print/editorial aesthetic di web |
| **Particles Cursor Animation** | Cursor-driven particle system = interactive feedback |
| **Particles Morphing** | Shape-to-shape transition = section transition effect |
| **GPGPU Flow Field** | Massive particle system via GPU compute = ambient background |
| **Wobbly Sphere** | Organic deformation = living, breathing 3D element |
| **Procedural Terrain** | Generated landscape tanpa asset = lightweight hero visual |

### Chapter 2: Scroll-Based Animation (Lesson 19)
Cara sync Three.js scene dengan scroll position — kunci untuk Awwwards-style scroll storytelling dengan 3D elements.

### Chapter 5: Production Essentials

| Lesson | Kenapa Penting |
|--------|---------------|
| **Post-processing** | Bloom, DOF, chromatic aberration — atmosphere layer |
| **Performance tips** | Awwwards Usability 30% = performance. FPS drop = skor turun |
| **Mixing HTML and WebGL** | DOM + 3D in harmony — bukan replace, tapi layer |
| **Intro and loading** | Preloader = cinematic opening (Peak-End Rule) |

---

## Teknik Shader untuk Awwwards Use Cases

### Hero Background
```
Approach: GPGPU particles / procedural terrain / animated noise field
Shader: vertex displacement + fragment noise + time uniform
Referensi: Animated Galaxy, Procedural Terrain, GPGPU Flow Field
```

### Page Transition
```
Approach: Displacement/distortion shader between pages
Shader: texture sampling + displacement map + progress uniform (0→1)
Referensi: Fireworks (particle burst), Particles Morphing (shape transition)
```

### Hover Effect
```
Approach: Image distortion on hover via displacement map
Shader: 2 textures (image + displacement) + mouse uniform
Referensi: Image Processing chapters, Raging Sea (vertex displacement)
```

### Atmospheric Background
```
Approach: Noise-driven color field / fog / gradient animation
Shader: fBM noise + time + color mixing
Referensi: Coffee Smoke, Noise chapters, Wobbly Sphere
```

### Text Effect
```
Approach: Text as texture → shader distortion
Shader: SDF text + noise displacement + scroll/cursor uniforms
Referensi: Shader Patterns, 3D Text
```

### Cursor Trail / Interaction
```
Approach: Particles respond to cursor position
Shader: Particle system + cursor uniform + velocity/inertia
Referensi: Particles Cursor Animation, GPGPU Flow Field
```

---

## Performance Rules untuk Award-Level 3D

| Rule | Detail |
|------|--------|
| **Budget**: 60fps minimum | Di bawah 60fps = UX gagal. Jury notice. |
| **Mobile-first** | Start simple, enhance untuk desktop. Bukan sebaliknya |
| **Fallback** | CSS fallback untuk device tanpa WebGL2. Progressive enhancement |
| **Geometry complexity** | Low-poly + shader detail > high-poly. GPU lebih suka shader math daripada vertex count |
| **Texture resolution** | Power of 2 (512, 1024, 2048). Compress. Lazy load |
| **Dispose** | THREE.js objects harus di-dispose saat unmount. Memory leak = performance death |
| **Single render loop** | Satu rAF untuk semua — scroll, 3D, particles, transitions |
| **Shader LOD** | Simplify shader di mobile: kurangi noise octaves, kurangi particle count |

---

## Learning Path: Mana yang Perlu Dikuasai

### Priority 1 — Langsung Applicable
- Shaping functions (smoothstep, mix, step)
- Noise (Perlin, fBM) untuk organic textures
- Uniforms (time, mouse, scroll) untuk interactive shaders
- Post-processing (bloom, chromatic aberration)
- Displacement mapping untuk hover/transition effects

### Priority 2 — Untuk Signature Effects
- Particle systems (GPU-driven)
- Vertex displacement untuk organic surfaces
- Custom materials (modify Three.js built-in)
- GPGPU untuk massive particle counts

### Priority 3 — Deep Craft
- Ray marching untuk complex 3D tanpa geometry
- SDF (Signed Distance Functions) untuk procedural shapes
- Reaction diffusion untuk organic generative art
- Custom lighting models

---

## Hubungan dengan Portfolio Billy

Portfolio sudah punya:
- WebGL2/GLSL shaders (glass, fluid sim, text distortion) — **jangan sentuh**
- Liquid glass navigation
- Dark atmospheric theme

Teknik baru yang bisa ENHANCE tanpa mengganti:
- Noise-driven atmospheric background (fBM) untuk section transitions
- Displacement hover pada project images
- Particle cursor trail yang respond ke scroll inertia
- Post-processing layer (subtle bloom, vignette) sebagai atmosphere
- Scroll-driven shader uniforms untuk progressive reveal
