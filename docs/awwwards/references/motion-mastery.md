# Motion Mastery — Awwwards-Level Animation

"Motion Mastery" bukan satu award spesifik — ini istilah untuk advanced skill set yang membedakan situs biasa dari SOTD winner. Diajarkan di Awwwards Academy oleh Louis Ansa, Daniele Buffa, dan praktisi lainnya. Intinya: motion bukan dekorasi, motion adalah **material desain utama**.

Sources:
- https://www.awwwards.com/academy/courses/motion
- https://madewithgsap.com/
- https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/
- https://tympanus.net/codrops/2025/11/04/creating-3d-scroll-driven-text-animations-with-css-and-gsap/
- https://medium.com/design-bootcamp/awwward-winning-animation-techniques-for-websites-cb7c6b5a86ff (Arjun Kumar, Jan 2025)

---

## Awwwards Academy Motion Courses

### Louis Ansa — "Design Meaningful Experiences Through an Animation System"
Art Director di makemepulse. Fokus pada **animation system**, bukan tricks.
- Fundamental rules animasi dari film & motion design studios
- Cara pilih animation process sesuai tipe experience
- Timing dan emotions — bukan hanya grids dan margins
- Workflow: plugins untuk animate faster + handover ke dev team
- **Key insight**: Animation system = consistent personality across entire site

### Daniele Buffa — UI & Motion Design
10+ tahun experience, clients: Google, Sony, Headspace, Spotify.
- Meaningful animation — setiap gerakan punya purpose
- Purposeful UI transitions — bukan transisi demi transisi
- Rule: "master conventions dulu, baru subvert purposefully"

### Advanced Motion Techniques Mixing 2D & 3D
Instructors: Hitabarity_3D & Mestre Motion.
- Sketching → vectorize (Illustrator) → animate (After Effects) → 3D (Cinema 4D)
- Sound design sebagai "dimensi keempat"
- Compositing final untuk polished output

---

## 8 Teknik dari Awwward-Winning Websites (Arjun Kumar)

Dari artikel "Awwward-winning animation techniques for websites" — 8 teknik yang membentuk web design modern, dengan contoh website spesifik dan tools untuk setiap teknik.

### T1. Scroll Tracking & Scroll-Driven Animation
Monitor scroll position, direction, dan speed → trigger/sync animasi.

**Tools**: Lenis, Locomotive Scroll (smooth scrolling) + GSAP ScrollTrigger (animation sync)
**Sub-patterns**:
- **Animated Reveals**: fade, slide, scale saat element enter viewport
- **Parallax Scrolling**: background/foreground di speed berbeda
- **Interactive Data Viz**: charts/graphs animate berdasarkan scroll
- **Contoh**: C2MTL — seamless scroll-triggered text/image reveals, interactive storytelling

### T2. Text Splitting & Per-Character Animation
Text dipecah → setiap char/word/line jadi animatable individual.

**Tools**: Splitting.js (lightweight, CSS variables), GSAP SplitText (premium, lebih powerful)
**Pattern**: Library menambah `data-char` attributes + CSS variables ke HTML → target individual chars via CSS/JS
**Contoh**: Headline yang setiap hurufnya "jatuh" masuk satu per satu, atau text yang "dissolve" per-karakter saat scroll

### T3. Micro-Animations (Feedback yang Bikin Hidup)
Animasi kecil, subtle, fungsional — response ke user action (click, hover, submit).

**Tools**: Lottie (JSON-based dari After Effects — vector, tiny file size, crisp di semua layar), Rive (real-time, State Machine untuk interactive states)
**Contoh**: NEWPEACE — Lottie loading animations yang captivating + illustrations yang "hidup"
**Key**: Bukan dekorasi — ini feedback. User harus MERASAKAN bahwa sistem merespon.

### T4. SVG & Mask Animations
SVG morphing + clip-path/mask untuk reveal/hide elements secara dynamic.

**Tools**: GSAP MorphSVG, DrawSVG, native CSS clip-path
**Sub-patterns**:
- **Shape Morphing**: satu SVG path morph ke shape lain
- **Mask Reveals**: content muncul melalui animated mask opening
- **Stroke Drawing**: SVG outline yang "digambar" di depan mata
- **Contoh**: Lightship — SVG mask yang reveal video saat scroll, visually striking

### T5. Cursor Hover Effects
Custom cursor behavior + element responses saat hover/proximity.

**Tools**: Rive State Machine (define idle/hover/clicked states), GSAP (magnetic, displacement), custom JS
**Sub-patterns**:
- Button yang **follow cursor** dengan animated hover + click states
- Content yang **distort** saat cursor hover (displacement map)
- Letterforms yang **react dynamically** ke cursor proximity
- **Contoh**: Rive-powered footer dimana setiap letterform bereaksi ke cursor hovers

### T6. Page Transitions
Navigasi antar halaman terasa seamless, bukan "loading page baru".

**Tools**: Framer Motion + Next.js (AnimatePresence), GSAP (Barba.js/Taxi.js integration), Nuxt page transitions
**Sub-patterns**:
- Image **zoom-in** seamless → next page (Metalab)
- **Freeze scroll** + animate out/in sebagai scene cut
- **Shared element** transition (element dari page A "terbang" ke page B)
- **Contoh**: Metalab — click project image → image zooms in → seamless transition ke project page

### T7. 3D Transforms & Product Reveals
Scroll-driven 3D rotation dan interactive product showcase.

**Tools**: CSS transforms (perspective, rotateX/Y/Z), Three.js untuk complex 3D, GSAP ScrollTrigger
**Sub-patterns**:
- Product **rotate/flip** saat scroll (Apple-style product reveals)
- **Perspective** shifts yang follow scroll position
- **Contoh**: Mana Yerba Mate — product can yang rotates, flips, dan moves saat scroll, product selalu jadi focal point

### T8. Video Background & Scroll-Synchronized Playback
Video sebagai background atau scroll-controlled playback.

**Sub-patterns**:
- **Auto-play loop**: ambient background video (muted, low-res OK)
- **Scroll-scrub**: video.currentTime controlled by scroll progress
- **SVG mask + video**: reveal video through animated mask shape
- **Contoh**: Lightship — SVG mask reveal video on scroll

### Designer-Developer Insight
> "It's not about becoming a coder — it's about creating deeper awareness beyond design, which helps designers collaborate more effectively with development teams and broaden their creative toolkit." — Arjun Kumar

Memahami teknologi di balik animasi bikin designer lebih efektif berkomunikasi dengan developer. Bukan soal coding — soal **vocabulary bersama**.

---

## 7 Signature Motion Techniques (Deep Dive)

### 1. Scroll-Synchronized Video Scrub
Background video yang scrub forward/backward berdasarkan scroll position.

**Cara kerja**:
- Video element dengan `currentTime` di-control oleh ScrollTrigger progress
- `scrub: 1` = 1 detik delay antara scroll dan video response (terasa smooth)
- `scrub: true` = immediate sync (terasa direct)

**Pattern**:
```
ScrollTrigger → onUpdate(self) → video.currentTime = self.progress * video.duration
```

**Kapan pakai**: Hero section, product showcase, storytelling sequence. Efektif untuk narrative yang perlu user-paced consumption.

### 2. Parallax & Depth Masking
Depth illusion via layer speeds berbeda + SVG/CSS mask reveals.

**Parallax Layers**:
- `data-speed="0.5"` (background, lambat)
- `data-speed="1.0"` (content, normal)
- `data-speed="1.5"` (foreground, cepat)
- ScrollSmoother auto-applies parallax ke elements dengan `data-speed`

**SVG Mask Reveal**:
- SVG mask yang animate (expand/contract) saat scroll
- Content di-reveal melalui mask opening
- Lightship.com: SVG mask reveal video on scroll — SOTD technique

**CSS clip-path Mask**:
- `clip-path: circle(0%)` → `circle(100%)` untuk radial reveal
- `clip-path: inset(100% 0 0 0)` → `inset(0)` untuk directional reveal
- Polygon variations untuk non-standard shapes

### 3. Micro-Interactions (Delightful Feedback)
Subtle responses yang bikin interface terasa alive. 75% customer-facing apps di 2025 incorporate micro-interactions.

**Categories**:
| Type | Technique | Trigger |
|------|-----------|---------|
| **Button** | Scale + shadow shift + text scramble | Hover/press |
| **Magnetic** | Element "tertarik" ke cursor position | Proximity |
| **Hover image** | Displacement/chromatic distortion | Mouse enter/move |
| **Toggle** | Morphing icon (hamburger ↔ close) | Click |
| **Scroll hint** | Bouncing arrow atau animated line | Idle state |
| **Input focus** | Label float + border color + glow | Focus event |

**Rule**: Static areas provide visual rest. Tidak semua elemen perlu micro-interaction — strategic restraint penting.

### 4. Cinematic Scroll Experiences
Scroll = conductor's baton. Camera, typography, particles bergerak sebagai orchestrated timeline.

**Architecture** (dari Codrops tutorial):
- **Camera Path Choreography**: Camera sebagai narrative device, bukan objects yang di-animate
- **Custom Easing Curves**: 4 personality types:
  - `cinematicSilk` — ultra-smooth luxury
  - `cinematicSmooth` — natural organic
  - `cinematicFlow` — energetic momentum
  - `cinematicLinear` — mechanical precision
- **Dual Timeline Coordination**: Camera + typography follow separate timelines, anchored ke same scroll trigger
- **Momentum-Driven Opacity**: Element opacity tied ke scroll velocity, bukan position

**Key pattern**: `gsap.quickSetter(el, "width", "%")` untuk DOM updates tanpa animation overhead — ideal progress bars yang update setiap frame.

### 5. Preloader as Opening Credits
First impression = lasting impression (Peak-End Rule). Preloader bukan "waiting room" — ini scene pertama.

**Techniques**:
- Progress bar dengan easing (tidak linear — accelerate di akhir)
- Counter number yang increment (0% → 100%) dengan delay artifisial untuk dramatic effect
- Text reveal per-character saat loading
- Background color transition dari preloader ke hero
- Exit animation: preloader clip-path shrink / slide up / blur away → hero reveal

**Session-aware**: First visit = full preloader. Return visit = shortened atau skipped.

### 6. 3D Text Without 3D Library
CSS transforms + trigonometry untuk text yang terasa 3D tanpa Three.js overhead.

**3 Patterns** (dari Codrops):
| Effect | Method | Visual |
|--------|--------|--------|
| **Cylinder** | `rotateX()` + sin/cos positioning | Text melingkari cylinder vertical |
| **Circle** | Dual mirrored orbits dengan direction control | Text orbit clockwise/counter |
| **Tube** | `rotateY()` + Z-axis stacking | Tunnel effect ke viewer |

**CSS Requirements**:
- `perspective: 70vw` (desktop) / `400px` (mobile)
- `transform-style: preserve-3d` pada container
- `backface-visibility: hidden` cegah text terbalik
- Responsive: recalculate radius on resize

### 7. SplitText Character Animation
Text dipecah per-character → animate individually → reassemble.

**Patterns**:
- **Masked reveal**: chars di `overflow: hidden` container, animate `y` dari bawah ke posisi
- **Stagger cascade**: 0.01-0.02s per char, terasa "flowing"
- **Scroll-driven**: chars reveal proportional ke scroll progress
- **Exit reverse**: animate out = reverse of animate in

**Stagger math**: Total duration = `stagger × charCount + baseDuration`. Untuk 50 chars dengan 0.02s stagger: 1s base + 1s stagger = 2s total.

---

## GSAP Ecosystem untuk Motion Mastery

| Plugin | Fungsi | Kapan Pakai |
|--------|--------|-------------|
| **ScrollTrigger** | Link animation ke scroll position | Scroll-driven reveals, parallax, pinning |
| **ScrollSmoother** | Smooth scrolling + velocity data | Inertia-based effects, parallax |
| **SplitText** | Pecah text → chars/words/lines | Text reveals, per-char animation |
| **MorphSVG** | Morph satu SVG shape ke lainnya | Icon transitions, cursor morph |
| **DrawSVG** | Animate SVG stroke drawing | Line art reveals, progress indicators |
| **MotionPath** | Animate element sepanjang path | Orbital motion, curved trajectories |
| **Flip** | Layout animation (position A → B) | Grid reorganization, filter transitions |
| **CustomEase** | Define custom easing curves | Cinematic personality per scene |

**Alternative (React ecosystem)**: Framer Motion — gesture-based, layout animation, AnimatePresence untuk exit animations.

### Animation Format Tools

| Tool | Format | Kekuatan | Kapan Pakai |
|------|--------|----------|-------------|
| **Lottie** | JSON (dari After Effects) | Vector-perfect, tiny file size (KB), crisp di semua layar | Loading animations, icon animations, illustrasi yang "hidup" |
| **Rive** | Binary (real-time) | State Machine — idle/hover/clicked states, interactive | Buttons yang follow cursor, interactive illustrations, game-like UI |
| **Splitting.js** | HTML manipulation | Lightweight, CSS variables per char, zero dependencies | Alternative ke GSAP SplitText — gratis, CSS-driven per-char animation |

**Lottie vs Rive**: Lottie = pre-rendered animation (play/pause). Rive = real-time interactive (respond ke input). Pakai Lottie untuk illustrasi/loading, Rive untuk interactive elements yang butuh state management.

### Website Showcase (Artikel Arjun Kumar)

| Website | Teknik | Kenapa Award-Worthy |
|---------|--------|---------------------|
| **C2MTL** | Scroll-triggered reveals | Seamless text/image reveals, interactive storytelling flow |
| **Lightship** | SVG mask + video | SVG mask reveal video saat scroll — visually striking |
| **Mana Yerba Mate** | 3D product transforms | Product can rotates/flips/moves on scroll — always focal point |
| **NEWPEACE** | Lottie micro-animations | Captivating loading + illustrations yang hidup |
| **Metalab** | Page transitions | Project image zoom-in → seamless page transition |

---

## Performance & Best Practices

### Metrics
- 60fps minimum — di bawah ini, jury notice
- Animation response < 400ms (Doherty Threshold)
- Sites dengan well-implemented animation: **37% higher engagement**, **23% more conversions**

### Technical Rules
| Rule | Detail |
|------|--------|
| Single rAF loop | Unify scroll + particles + transitions |
| GPU acceleration | `will-change`, `transform`, `opacity` — avoid `top/left` |
| Scrub smoothing | `scrub: 1-2` untuk cinematic, `scrub: true` untuk direct |
| Dispose on unmount | Kill timelines, remove ScrollTriggers |
| deltaTime capping | Prevent jank after tab switch |
| Reduced motion | `prefers-reduced-motion` → disable or simplify |

### Strategic Restraint
> "Not every element animates — static areas provide visual rest and prevent overwhelming users."

Animate **priority content** saja: hero messages, featured projects, CTAs, transitions. Background/supporting content bisa static. Overanimation = noise.

---

## Learning Path

### Immediate (Langsung Applicable)
1. ScrollTrigger — scrub, pin, stagger reveals
2. SplitText — per-char/word/line animation
3. clip-path transitions — section reveals
4. Custom easing — beyond `power3.out`
5. Preloader sequence — cinematic opening

### Intermediate (Signature Effects)
1. Video scrub — scroll-synchronized playback
2. SVG mask reveals — complex shape transitions
3. MorphSVG — icon/cursor morphing
4. 3D text via CSS transforms — tanpa library 3D
5. Dual timeline coordination — camera + content

### Advanced (Mastery)
1. GPGPU particles synced ke scroll
2. Custom easing libraries per project personality
3. Momentum-driven opacity/scale systems
4. Cinematic camera path choreography
5. Sound design integration (dimensi keempat)

---

## Hubungan dengan Portfolio Billy

**Sudah ada**:
- GSAP + ScrollTrigger + Lenis (smooth scroll)
- useCharSplit composable (SplitText equivalent)
- clip-path animations
- Magnetic + chromatic + displacement hover effects
- Preloader system

**Bisa ENHANCE tanpa mengganti**:
- Video scrub untuk project showcase section
- Custom easing curves per section personality
- SVG mask reveals untuk section transitions
- 3D text effects via CSS transforms (tanpa Three.js overhead)
- Momentum-driven parallax (scroll velocity → visual intensity)
- Dual timeline: content + background animate independently
