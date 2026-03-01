# Site Analysis Framework — "Don't Copy, Understand"

Rule global saat mempelajari website award-winning. Bukan soal replicate, tapi soal MEMAHAMI kenapa sesuatu bekerja dan bagaimana mengadaptasi ke konteks sendiri.

---

## Mindset

> **"Don't Copy, Understand"** — Melihat situs keren bukan untuk di-clone. Ini untuk menambah VOCABULARY desain kamu.

Setiap situs award-winning adalah kumpulan keputusan desain yang bisa dipelajari. Tapi keputusan itu dibuat untuk KONTEKS mereka. Tugas kamu: ekstrak prinsip, bukan pixel.

---

## Framework Analisis (5 Layer)

### Layer 1: Identify the Technique
> Apa yang terjadi secara teknis?

| Pertanyaan | Contoh Jawaban |
|------------|----------------|
| Animasi/effect apa yang digunakan? | Fluid simulation, chromatic aberration, text masking |
| Library/tool apa? | OGL, Three.js, GSAP, vanilla WebGL |
| Shader pattern apa? | Navier-Stokes, FBM noise, SDF shapes |
| Layout system apa? | CSS Grid asymmetric, horizontal scroll, pinned sections |
| Typography technique apa? | SplitText per-char, text-stroke, variable font animation |

**Tools untuk investigasi:**
- Browser DevTools → Sources/Network tab untuk library detection
- `document.querySelectorAll('canvas')` → WebGL presence
- Bundle fetch + keyword search → shader strings, library versions
- Computed styles → typography values, z-index layers

### Layer 2: Understand the Purpose
> KENAPA teknik ini dipilih? Apa yang dikomunikasikan?

| Pertanyaan | Apa yang Dicari |
|------------|-----------------|
| Apa yang ingin dirasakan user? | Premium? Playful? Cinematic? Brutal? |
| Kenapa effect INI dan bukan yang lain? | Fluid = organic/alive. Glitch = edgy/broken. Glass = luxury |
| Apa metafora visualnya? | Text-as-window, cursor-as-brush, scroll-as-camera |
| Bagaimana effect mendukung content? | Effect memperkuat pesan, bukan mengalihkan perhatian |
| Apa yang terjadi jika effect dihilangkan? | Site masih bermakna? Atau bergantung pada gimmick? |

**Red flag**: Jika effect bisa dihilangkan tanpa kehilangan apapun, itu decorative, bukan purposeful.

### Layer 3: Analyze Timing & Feel
> Detail yang membuat perbedaan antara "keren" dan "murah"

| Parameter | Yang Harus Dicatat |
|-----------|-------------------|
| Easing curve | power3.out? expo.out? spring? custom bezier? |
| Duration | 0.3s untuk hover, 0.8-2s untuk reveals, 5-20s untuk ambient |
| Stagger | Per-char 0.02-0.05s, per-word 0.05-0.1s, per-element 0.1-0.15s |
| Delay | Intentional gaps antara animasi = breathing room |
| Multipliers | Displacement amount, blur radius, chromatic separation |
| Physics params | Dissipation rate, curl strength, splat radius, pressure iterations |

**Key insight**: Multiplier kecil (0.001-0.01) = subtle dan premium. Multiplier besar (0.1+) = flashy dan murah.

### Layer 4: Map to Implementation
> Bagaimana kamu akan BUILD ini?

| Pertanyaan | Yang Harus Dijawab |
|------------|-------------------|
| Composable/tool yang sudah ada? | Cek existing composables di project sebelum buat baru |
| Apa yang perlu dibangun dari scratch? | Shader baru? Composable baru? Atau modifikasi existing? |
| Performance impact? | FPS target? GPU usage? Bundle size? |
| Fallback strategy? | Mobile? Reduced motion? Low-end devices? |
| Integration complexity? | Bagaimana masuk ke existing architecture? |

**Rule**: Selalu mulai dari apa yang SUDAH ADA. Extend, bukan rebuild.

### Layer 5: Adapt to Context
> Bagaimana ini cocok dengan PROJECT kamu?

| Pertanyaan | Yang Harus Dijawab |
|------------|-------------------|
| Cocok dengan taste DNA? | Apakah ini sesuai dark cinematic aesthetic? |
| Cocok dengan brand story? | Apakah ini memperkuat narrative Billy Maulana? |
| Complement atau compete? | Apakah akan melengkapi existing effects atau clash? |
| User value? | Pengunjung akan merasa apa? Impressed? Confused? Annoyed? |
| Unique twist? | Bagaimana membuat ini BERBEDA dari sumbernya? |

**Golden Rule**: Adaptasi harus terasa seperti NATURAL EXTENSION dari existing design, bukan foreign transplant.

---

## Questions Checklist (Per-Site)

Jalankan semua pertanyaan ini saat menganalisis setiap reference site:

### Premium Feel
- [ ] Apa yang membuat ini terasa "mahal"?
- [ ] Detail mana yang subtle tapi impactful?
- [ ] Apa yang akan hilang jika dibuat "lebih sederhana"?

### Animation & Content
- [ ] Bagaimana animasi MENDUKUNG content (bukan mengalihkan)?
- [ ] Apa hierarchy of movement? (apa yang bergerak pertama, terakhir, paling banyak?)
- [ ] Ada breathing room antara animasi, atau semuanya bergerak sekaligus?

### Responsive & Mobile
- [ ] Bagaimana handle mobile? Degradasi graceful atau redesign?
- [ ] WebGL dimatikan atau disederhanakan?
- [ ] Layout berubah bagaimana?

### Accessibility
- [ ] Ada reduced-motion handling?
- [ ] Semantic HTML terjaga?
- [ ] Keyboard navigation berfungsi?
- [ ] Screen reader friendly?

### Color & Typography
- [ ] Berapa warna yang dipakai? (biasanya 2-3 saja)
- [ ] Warna responsive terhadap interaksi atau static?
- [ ] Contrast ratio headline vs body berapa?
- [ ] Font choice apa dan kenapa?

### Performance
- [ ] FPS smooth? (60fps target)
- [ ] Load time acceptable? (<3s)
- [ ] Bundle size reasonable?
- [ ] Lazy loading dipakai?

---

## Output Format

Setelah analisis, hasilnya disimpan di `taste-dna.md` section Reference Sites dengan format:

```markdown
### [N]. [domain]
- **URL**: https://...
- **Awwwards Status**: SOTD / Honorable Mention / nominee
- **User Verdict**: "quote langsung dari user tentang apa yang disukai"

#### Apa yang Menarik
| Aspek | Detail |
|-------|--------|
| ... | ... |

#### Teknik yang Diidentifikasi
| Teknik | Implementation | Purpose |
|--------|----------------|---------|
| ... | ... | ... |

#### Timing & Feel
- [parameter details]

#### Kenapa Terasa Premium
1. [reason]

#### Mobile Handling
- [details]

#### Accessibility
- [details]

#### Influence ke Taste Profile
- **Memperkuat**: [existing preferences yang dikonfirmasi]
- **Menambah baru**: [new preferences yang teridentifikasi]
- **Konfirmasi**: [choices yang tervalidasi]
```

---

## Common Technique Vocabulary

Quick reference teknik-teknik yang sering ditemui di situs award-winning:

### Fluid / Liquid
| Teknik | Complexity | Feel |
|--------|-----------|------|
| CSS backdrop-filter blur | Low | Soft, glassy |
| Canvas 2D fluid (metaballs) | Medium | Blobby, playful |
| WebGL Navier-Stokes | High | Organic, physically-accurate, premium |
| WebGL noise displacement | Medium | Wavy, dreamy |
| SVG filter turbulence | Low-Medium | Gooey, morphing |

### Text Effects
| Teknik | Complexity | Feel |
|--------|-----------|------|
| SplitText per-char stagger | Low | Typewriter, editorial |
| clipPath reveal | Low | Cinematic, dramatic |
| blur-to-sharp | Low | Focus pull, cinematic |
| Text-as-mask for fluid | High | Liquid text, premium |
| Variable font animation | Medium | Morphing, organic |
| Canvas text rasterization + WebGL | High | Full shader control |

### Color Techniques
| Teknik | Feel |
|--------|------|
| Chromatic aberration (RGB split) | Premium, cinematic, editorial |
| Velocity-driven color | Responsive, alive, organic |
| Blending modes (difference/exclusion) | Depth, surprise, layered |
| Monochrome + single accent | Focused, bold, minimal |
| Gradient glow (radial) | Atmospheric, warm/cool |

### Layout Patterns
| Pattern | When |
|---------|------|
| Counter-position | Hero sections — diagonal tension |
| Centered monumental | Statement/manifesto — maximum impact |
| Staircase indent | Subtitle/sub-elements — progressive hierarchy |
| Circular narrative | Footer mirrors hero — site feels complete |
| Asymmetric grid | Portfolio/works — visual variety |
