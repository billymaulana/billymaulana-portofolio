# Design Constitution: Dari AI Slop ke SOTD

> Dokumen ini bukan analisis. Ini INSTRUKSI. Setiap kali menulis UI code, baca bagian yang relevan dan IKUTI.
> Dokumen ini adalah "taste brain" — pengetahuan design yang harus dipahami SEBELUM menulis satu baris CSS/GSAP.

**Awwwards Formula**: Design 40% | Usability 30% | Creativity 20% | Content 10%
**SOTD Threshold**: 8.0+ di semua area, superior di minimal 2.
**Developer Award**: Score > 7 dari developer jury + SOTD.

---

## BAGIAN 0: FATAL FAILURE PATTERN — BACA INI PERTAMA

> **PERINGATAN LEVEL 5**: Claude telah GAGAL menghasilkan output Awwwards-quality EMPAT KALI BERTURUT-TURUT. User memberikan feedback identik setiap kali: "jelek, AI slop, monoton, boring, tidak ada object apapun, tidak ada wow moment." Masalah ini bukan PENGETAHUAN (Claude tahu aturannya) tapi ENFORCEMENT (Claude tidak menjalankannya). Bagian ini menambah enforcement mekanisme setelah kegagalan ke-4.

### 4x Failure Timeline

| Attempt | Apa yang dibangun | User feedback | Apa yang SALAH |
|---------|-------------------|---------------|----------------|
| C1 Original | Sections dengan opacity+y reveals, centered layouts, gradient backgrounds | "AI slop, monoton, boring, tidak kreatif" | No visual objects, generic layout |
| C1 Polish | Improved animations, added effects | "masih AI slop" | Polish tanpa substance |
| C2 Rewrite (Maret 2026) | Complete rewrite: PP Editorial New, GSAP ScrollTrigger, Lenis, film noir. ZERO errors. | "jelek, AI slop, monoton boring, tidak ada object apapun, tidak ada wow moment" | Technically perfect, visually empty |
| C2 Polish (Maret 2026) | Added atmospheric gradients (0.03 opacity), chromatic text-shadows, blend modes, vignette. ALL CSS-only. | "jelek, ai slop, monoton boring tidak ada visual object apapun, tidak ada motion mewah, tidak ada wow moment" | Added INVISIBLE polish (0.03 opacity = invisible). Zero visual objects added. |

### Root Cause #1: Engineer vs Art Director

Claude bertindak sebagai **ENGINEER**: memastikan zero errors, smooth animations, proper Lenis bridge, correct TypeScript types, accessible HTML. Ini menghasilkan situs yang SECARA TEKNIS sempurna tapi SECARA VISUAL kosong.

Claude SEHARUSNYA bertindak sebagai **ART DIRECTOR**: memulai dari visual impact, memastikan setiap section punya "wow moment", membuat user BERHENTI scrolling untuk mengeksplorasi.

**Analogi**: Sebuah kamar hotel bintang 5 yang kosong — dindingnya sempurna, pintunya tidak berisik, lampunya bekerja — tapi tidak ada furnitur, tidak ada seni di dinding, tidak ada bantal. Secara teknis sempurna, secara pengalaman KOSONG.

### Root Cause #2: Priority Inversion

```
APA YANG CLAUDE LAKUKAN (4x berturut-turut):
  implement structure → fix TypeScript → fix lint → add animation → fix bugs → time runs out
  ─────────────────────────────────────────────────────────────────────────────────────────
  80% waktu = engineering                                    20% waktu = visual (sisanya)

APA YANG SEHARUSNYA TERJADI:
  define WOW moment → build visual object → add text → animate → polish → fix bugs
  ─────────────────────────────────────────────────────────────────────────────────────────
  60% waktu = visual craft                                   40% waktu = engineering
```

### Root Cause #3: "Text on Dark Background" Default

Setiap section yang Claude bangun defaults ke pattern ini:
```
dark background (#000 atau similar) + white text + subtle gradient overlay + GSAP animation
```

Ini adalah DEFINISI "AI slop" untuk portfolio. Ini adalah output paling generic yang mungkin dihasilkan.

### Root Cause #4: Gradient Placeholder = Visual Emptiness

Menggunakan `linear-gradient()` di tempat yang seharusnya ada gambar/visual content bukanlah DESIGN. Ini adalah TODO yang tidak pernah diselesaikan.

### Root Cause #5: Animation tanpa Visual Object = Empty Room

Smooth scroll-reveal dan crossfade animations membuat text BERGERAK tapi tidak menambah VISUAL CONTENT.

### Root Cause #6 (NEW — ditemukan setelah kegagalan ke-4): ENFORCEMENT GAP

Claude MEMBACA rules ini. Claude MENGAKUI rules ini penting. Lalu Claude MENGABAIKAN rules ini saat implementasi.

**Bukti**:
- "Priority Order (MANDATORY)" sudah ada di CLAUDE.md sejak attempt 3 — Claude tetap mulai dari engineering
- "Per-Section Visual Object Requirements" table sudah ada — tidak ada section yang memenuhinya
- "Hard Gates G1-G4" sudah ada — tidak pernah di-run sebagai actual check
- "What IS a Visual Object" sudah didefinisikan — tidak ada section yang berisi satu

**Solusi**: Menambah enforcement mechanisms yang MEMAKSA compliance:

### ENFORCEMENT MECHANISMS (NEW — added after 4th failure)

#### 1. Wow Moment Budget (fill BEFORE any code)
```
| Moment | Section | Visual Object | Interaction |
|--------|---------|---------------|-------------|
| WOW 1 | _____ | _____ | _____ |
| WOW 2 | _____ | _____ | _____ |
| WOW 3 | _____ | _____ | _____ |
```
**STOP GATE**: Jika tabel ini kosong → JANGAN MENULIS CODE.

#### 2. 30-Second Reject Test (run AFTER each section)
Screenshot section. Dalam 30 detik, jawab:
1. **OBJECT TEST**: Tunjuk elemen visual non-text. Bisa? Jika TIDAK → GAGAL.
2. **SWAP TEST**: Ganti "BILLY MAULANA" dengan "JOHN DOE". Terlihat beda? Jika TIDAK → GAGAL.
3. **EMPTY TEST**: Hapus semua text. Masih ada yang menarik dilihat? Jika TIDAK → GAGAL.
4. **WOW TEST**: Maukah kamu berhenti scroll untuk eksplorasi ini? Jujur? Jika TIDAK → GAGAL.
5. **NEIGHBOR TEST**: Terlihat beda dari section atas/bawahnya? Jika TIDAK → GAGAL.
**SATU SAJA yang gagal = section NOT DONE.**

#### 3. Emergency Escalation Ladder (when section feels empty)
| Level | Action | Contoh |
|-------|--------|--------|
| 0 | Text + gradient only | **DILARANG — NEVER ship at this level** |
| 1 | Add SVG grid/accent system | Thin lines (0.5px), dot grid, drawSVG entrance |
| 2 | Add generative canvas element | Noise field, particle system, reaction-diffusion |
| 3 | Add image treatment layer | Displacement map, blend-mode masked texture |
| 4 | Add interactive visual | Mouse-parallax layers, cursor-reveal, scroll-driven morph |
| 5 | Add WebGL effect | Fluid simulation, metaball system, shader visual |
**MINIMUM level 1 untuk setiap section.**

#### 4. Motion Variety Tracker (no pattern used twice adjacent)
```
| Section | Primary Entrance | Hover Effect | Scroll Effect |
|---------|-----------------|--------------|---------------|
| Preloader | _____ | N/A | N/A |
| Hero | _____ | _____ | _____ |
| ...dst... |
```
**RULES**: Minimum 5 pattern BERBEDA. Adjacent rows WAJIB berbeda.

#### 5. Atmospheric Opacity Floor
| Layer Type | Minimum Opacity |
|-----------|----------------|
| Gradient glow | 0.08 |
| Noise grain | 0.04 |
| Blend-mode accents | 0.15 |
| SVG strokes | 0.2 |
| Visual objects | 0.4+ |
**Di bawah 0.08 = INVISIBLE. Jangan buang waktu menambah yang tidak terlihat.**

#### 6. Mandatory Implementation Order
```
STEP 1: VISUAL OBJECTS (60% waktu) ──── STOP jika belum ada 3 wow moments
STEP 2: TEXT + LAYOUT (20% waktu) ───── STOP jika text tidak integrate dengan visual
STEP 3: ANIMATION (15% waktu) ────────── STOP jika ada adjacent duplicate patterns
STEP 4: ENGINEERING (5% waktu) ────────── TypeScript, lint, build
```

### HARD PREVENTION RULES (unchanged, still valid)

1. **SEBELUM menulis APAPUN untuk section baru**: tentukan WOW moment-nya. Apa visual object-nya? Jika jawaban hanya "text + gradient" → STOP, desain ulang.
2. **SETIAP section WAJIB punya minimal 1 non-text visual element**: canvas, SVG, WebGL, image treatment, generative art, CSS art, interactive visual.
3. **GRADIENT BUKAN visual object**: `linear-gradient()` sebagai "project image" adalah EMPTINESS. Replace dengan real visual content.
4. **Build order WAJIB**: visual object DULU → text → animation → bugs. JANGAN pernah skip ke bug-fixing tanpa menyelesaikan visual object.
5. **Slop test**: Screenshot section. Bisa dipakai untuk portfolio orang lain tanpa modifikasi? → GAGAL. Redesign.
6. **Budget waktu**: 60% untuk visual craft, 40% untuk engineering. BUKAN sebaliknya.
7. **NEW**: Opacity minimum 0.08 untuk semua design elements. Di bawah itu = INVISIBLE, jangan buang waktu.
8. **NEW**: JANGAN menambah "polish" (text-shadow, blend-mode, invisible gradients) tanpa menambah VISUAL OBJECTS terlebih dahulu. Polish tanpa substance = still empty.

---

## BAGIAN 1: MENTAL MODEL — Berpikir Seperti Creative Director

### Fundamental Shift

| AI Slop Thinking | Creative Director Thinking |
|------------------|---------------------------|
| "Section ini butuh heading + content + animation" | "Scene ini harus membuat user merasakan APA?" |
| "Tambah animasi opacity+y reveal" | "Reveal pattern apa yang BELUM dipakai di section sebelumnya?" |
| "Background hitam, text putih" | "Atmospheric layer apa yang memberi depth? Noise? Gradient? Blend?" |
| "Hover = scale 1.05" | "Hover ini harus terasa MAHAL. Magnetic? Displacement? Scramble?" |
| "Font size besar = bold" | "Letter-spacing NEGATIF + chromatic shadow + blend mode = dramatic" |
| "Tambah elemen dekoratif" | "Material visual apa yang BERINTERAKSI dengan konten?" |

### Pre-Implementation Protocol (WAJIB)

SEBELUM menulis code untuk section apapun, jawab 6 pertanyaan ini:

1. **FEEL** — Apa yang harus dirasakan user di section ini? (atmospheric / brutal / cinematic / premium / playful)
2. **DISTINCT** — Apa yang membedakan section ini dari section sebelum dan sesudahnya? (layout / warna / motion / material)
3. **MATERIAL** — Selain text, elemen visual apa yang ada? (noise / gradient / SVG accent / blend layer / generative)
4. **MOTION** — Animasi masuk apa yang BERBEDA dari section lain? (clipPath shape / blur-to-sharp / scramble / scale+rotate / parallax)
5. **INTERACTION** — Saat mouse/scroll berinteraksi, apa yang terjadi? (magnetic / displacement / color shift / parallax tilt)
6. **SLOP TEST** — Jika section ini di-screenshot dan ditaruh di portfolio ORANG LAIN, apakah terlihat identik? Jika YA → redesign.

---

## BAGIAN 2: VISUAL RECIPES — Teknik Konkret dari Taste DNA

### 2A. Typography Recipes

#### Recipe: Viewport-Filling Condensed Display
```css
/* BebasNeue di hero — HARUS terasa "terlalu besar" */
.hero__name {
  font-family: var(--font-display); /* BebasNeue */
  font-size: clamp(5rem, 20vw, 24rem);
  font-weight: 400;
  line-height: 0.88;
  letter-spacing: -0.04em; /* NEGATIF = premium, tighter = authority */
  text-transform: uppercase;
}
```
**Source**: chdartmaker.com — BebasNeue 267px, letter-spacing -4px pada 100px.

#### Recipe: Chromatic Shadow Clone (3-Layer RGB Split)
```css
/* Shadow yang VISIBLE — bukan 6% opacity */
.chromatic-text {
  text-shadow:
    4px 3px 0 rgba(0, 71, 255, 0.22),    /* Blue layer */
    -3px -2px 0 rgba(0, 245, 255, 0.14),  /* Cyan layer */
    7px 5px 16px rgba(0, 71, 255, 0.10);  /* Ambient glow */
}
```
**Source**: supersolid.agency — 3 clone layers (pink/cyan/yellow) positioned absolute behind original, offset driven by scroll/velocity.

#### Recipe: Serif Italic Accent Words
```typescript
// Programmatic serif injection — kata tertentu jadi italic serif
function wrapSpecificText(container: HTMLElement, words: string[]) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    words.forEach(word => {
      if (node.textContent?.includes(word)) {
        const span = document.createElement('span')
        span.className = 'accent-serif' // font-family: Cormorant Garamond, italic
        span.textContent = word
        // replace text node portion
      }
    })
  }
}
```
**Source**: kaitonote.com — `wrapSpecificText()` wraps "four", "both", "digital experiences" dengan `font-noto italic`.

#### Recipe: Per-Character Custom Kerning
```css
/* Optical kerning — BUKAN uniform letter-spacing */
.hero__char--A { letter-spacing: -8.64px; }
.hero__char--r { letter-spacing: +2.16px; }
.hero__char--Y { letter-spacing: -36.72px; }
```
**Source**: art-yakushev.com — setiap karakter punya spacing berbeda untuk optical balance.

### 2B. Color & Atmosphere Recipes

#### Recipe: Tri-Tone Gradient Orb (Identity Palette)
```css
/* Gradient orb — JPG image, bukan shader. Simple tech, stunning result */
.gradient-orb {
  position: absolute;
  width: 100%; height: 100%;
  background: radial-gradient(
    ellipse at center,
    #0f0a72 0%,   /* Deep indigo */
    #0166c9 40%,  /* Vibrant blue */
    #a1e0e7 80%,  /* Light cyan */
    transparent 100%
  );
  opacity: 0.7;
  mix-blend-mode: screen;
}
```
**Source**: kaitonote.com — `#0f0a72` → `#0166c9` → `#a1e0e7` tri-tone. JPG 1920x1079.

#### Recipe: Noise Grain Texture Overlay
```css
.grain-overlay {
  position: absolute;
  inset: -50%; /* overflow untuk animated translate */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 256px;
  opacity: 0.04;           /* Subtle — terasa tapi tidak mencolok */
  pointer-events: none;
  mix-blend-mode: overlay;  /* WAJIB overlay */
  animation: grain 0.8s steps(6) infinite;
}

@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  16% { transform: translate(-2%, 3%); }
  33% { transform: translate(3%, -1%); }
  50% { transform: translate(-1%, -3%); }
  66% { transform: translate(2%, 1%); }
  83% { transform: translate(-3%, 2%); }
}
```

#### Recipe: Color-Burn Overlay Layers
```css
/* Dua overlay layers — color-burn menambah warm tonal richness */
.color-burn-fixed {
  position: fixed; inset: 0;
  background: radial-gradient(ellipse at 50% 100%, rgba(0, 71, 255, 0.06) 0%, transparent 60%);
  mix-blend-mode: color-burn;
  pointer-events: none;
  z-index: 2;
}
.color-burn-local {
  position: absolute; inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 71, 255, 0.04) 100%);
  mix-blend-mode: color-burn;
  pointer-events: none;
}
```
**Source**: kaitonote.com — dua color-burn layers menciptakan warm depth tanpa mengubah hue.

#### Recipe: Systematic Blend Mode Strategy
```
Hero heading:    mix-blend-mode: luminosity   (silver/prismatic dari visual material)
Navigation:      mix-blend-mode: difference   (auto-invert hitam/putih melewati sections)
Ghost elements:  mix-blend-mode: difference   (shadow yang invert)
Button overlays: mix-blend-mode: color        (brand color injection)
Fluid canvas:    mix-blend-mode: screen       (warna vibrant di atas hitam)
Grain texture:   mix-blend-mode: overlay      (texture tanpa mengubah brightness)
```
**Source**: latchezarboyadjiev.com — SISTEM blend modes, bukan satu trick.

### 2C. Motion Recipes

#### Recipe: Blur-to-Sharp Per-Character (Scroll-Scrubbed)
```typescript
const split = new SplitText('.manifesto-text', { type: 'chars,words,lines' })
gsap.from(split.chars, {
  filter: 'blur(10px)',
  opacity: 0,
  stagger: 0.03,
  scrollTrigger: {
    trigger: '.manifesto-section',
    start: 'top 80%',
    end: 'bottom 20%',
    scrub: 0.15,  /* 0.15 = responsive tapi smooth */
  }
})
```
**Source**: art-yakushev.com — blur(10px) → blur(0px), scrub 0.15, stagger each 0.03s.

#### Recipe: Text Scramble/Decode on Hover
```typescript
// GSAP ScrambleTextPlugin
gsap.to('.nav-link', {
  scrambleText: {
    text: '{original}',
    chars: '!<>-_\\/[]{}=+*^?#_',
    revealDelay: 0.5,
    speed: 0.3,
  },
  duration: 0.8,
})
```
**Source**: art-yakushev.com — random chars every 100ms for 400ms, then reset.

#### Recipe: Number Scramble Counter
```typescript
// Service numbers (01, 02, 03) — visual noise sebelum settle
gsap.to('.service-number', {
  scrambleText: {
    text: '03',
    chars: '0123456789',
    speed: 1.5,
  },
  duration: 1.5,
})
```
**Source**: kaitonote.com — `scrambleText` plugin, chars "0123456789", speed 1.5.

#### Recipe: Stagger Link Hover (Per-Char Slide)
```typescript
// Premium hover — chars slide up dengan stagger
link.addEventListener('mouseenter', () => {
  gsap.to(split.chars, {
    yPercent: -96,
    ease: 'expo.inOut',
    duration: 0.5,
    stagger: { each: 0.011 },
  })
})
link.addEventListener('mouseleave', () => {
  gsap.to(split.chars, {
    yPercent: 0,
    ease: 'expo.inOut',
    duration: 0.5,
    stagger: { each: 0.011, from: 'end' },
  })
})
```
**Source**: art-yakushev.com — yPercent -96, expo.inOut 0.5s, stagger each 0.011s.

#### Recipe: Magnetic Button
```typescript
function magneticButton(el: HTMLElement, strength = 0.3, radius = 100) {
  const bounds = el.getBoundingClientRect()
  const cx = bounds.left + bounds.width / 2
  const cy = bounds.top + bounds.height / 2

  document.addEventListener('mousemove', (e) => {
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
    if (dist < radius) {
      const pull = 1 - (dist / radius)
      gsap.to(el, {
        x: (e.clientX - cx) * strength * pull,
        y: (e.clientY - cy) * strength * pull,
        duration: 0.4,
        ease: 'power2.out',
      })
    } else {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' })
    }
  })
}
```

#### Recipe: Cinematic Preloader Choreography (~5-7s)
```
Timeline:
0.0s — Atmospheric glow pulses in (radial gradient, scale 0.5→1, 2s)
0.0s — Counter 000→100 runs (power2.inOut, 4s)
0.2s — Counter + loading label appear (clipPath inset reveal, 0.5s)
0.3s — Year marker fades in (expo.out, 0.6s)
0.6s — Blue accent line draws center-out (scaleX 0→1, expo.inOut, 1.4s)
0.8s — Name "BILLY" enters from LEFT with blur trail (xPercent -120, blur 24px→0, expo.out, 1.3s)
1.0s — Name "MAULANA" enters from RIGHT with blur trail (xPercent 120, blur 24px→0, expo.out, 1.3s)
3.8s — Emit 'complete' (hero starts behind preloader)
4.0s — EXIT: Content scales 2.5x + blur 40px + fade (power3.in, 1s)
4.4s — EXIT: Background fades to reveal hero (power2.out, 0.6s)
5.0s — Remove from DOM
```
**Penting**: Preloader EMIT complete SEBELUM fully exit → hero entrance overlap.

#### Recipe: Scroll-Scrubbed Circle Transition Between Sections
```typescript
gsap.fromTo('.next-section', {
  clipPath: 'circle(0% at 50% 50%)',
}, {
  clipPath: 'circle(150% at 50% 50%)',
  scrollTrigger: {
    trigger: '.transition-zone',
    start: 'top center',
    end: 'bottom center',
    scrub: true,
  }
})
```
**Source**: kaitonote.com — circles scale→0 saat content "lahir" dari dalam lingkaran.

#### Recipe: drawSVG Progressive Grid Reveal
```typescript
// SVG grid lines dan circles drawn on satu per satu
gsap.from('.grid-circle', {
  drawSVG: '0% 100%',
  duration: 2.5,
  stagger: 0.1,
  ease: 'power2.inOut',
})
gsap.from('.grid-line', {
  scaleX: 0,
  duration: 2,
  stagger: 0.05,
  ease: 'expo.out',
  transformOrigin: 'left center',
})
```
**Source**: kaitonote.com — SVG ellipses strokeWidth 0.5px, entrance via drawSVG.

### 2D. Layout Recipes

#### Recipe: Counter-Positioned Dual H1 (Swiss Tension)
```html
<div class="hero__names">
  <h1 class="hero__name hero__name--first">BILLY</h1>
  <div class="hero__accent" /> <!-- blue gradient line -->
  <h1 class="hero__name hero__name--second">MAULANA</h1>
</div>
```
```css
.hero__names { display: flex; flex-direction: column; width: 100%; }
.hero__name--first { align-self: flex-start; font-size: clamp(5rem, 20vw, 24rem); }
.hero__name--second { align-self: flex-end; font-size: clamp(3.5rem, 15vw, 18rem); }
```
**Source**: latchezarboyadjiev.com + daspritam.in — nama depan kiri, nama belakang kanan. Diagonal reading path.

#### Recipe: Corner Labels as Expertise Framing
```html
<div class="hero__corners">
  <span class="corner corner--tl">FRONTEND</span>
  <span class="corner corner--tr">ARCHITECTURE</span>
  <span class="corner corner--bl">CREATIVE</span>
  <span class="corner corner--br">DEVELOPMENT</span>
</div>
```
```css
.corner { position: absolute; font-family: var(--font-mono); font-size: 0.6875rem;
  letter-spacing: 0.35em; color: rgba(255,255,255, 0.2); text-transform: uppercase; }
.corner--tl { top: var(--page-margin); left: var(--page-margin); }
.corner--tr { top: var(--page-margin); right: var(--page-margin); }
.corner--bl { bottom: var(--page-margin); left: var(--page-margin); }
.corner--br { bottom: var(--page-margin); right: var(--page-margin); }
```
**Source**: kaitonote.com — "MOTION DESIGN", "WEB DEVELOPMENT" di empat corner hero.

#### Recipe: Cloned Text + mix-blend-difference Shadow
```typescript
// Ghost shadow tanpa CSS box-shadow — DOM clone + blend
function createGhostShadow(textEl: HTMLElement) {
  const clone = textEl.cloneNode(true) as HTMLElement
  clone.classList.add('ghost-shadow')
  clone.setAttribute('aria-hidden', 'true')
  textEl.parentElement?.appendChild(clone)
}
```
```css
.ghost-shadow {
  position: absolute;
  z-index: -1;
  color: #4a4a4a; /* gray-600 */
  mix-blend-mode: difference;
  pointer-events: none;
}
```
**Source**: kaitonote.com — setiap text line di-clone, clone positioned absolute z[-1].

### 2E. Interaction Recipes

#### Recipe: Mouse Parallax on Ghost Elements
```typescript
const ghostXTo = gsap.quickTo(ghostEl, 'x', { duration: 1.2, ease: 'power3.out' })
const ghostYTo = gsap.quickTo(ghostEl, 'y', { duration: 1.2, ease: 'power3.out' })

heroEl.addEventListener('mousemove', (e) => {
  const mx = (e.clientX / window.innerWidth - 0.5) * 2  // -1 to 1
  const my = (e.clientY / window.innerHeight - 0.5) * 2
  ghostXTo(mx * 25)  // 25px maximum displacement
  ghostYTo(my * 15)  // 15px maximum displacement
})
```

#### Recipe: Negative Space Cursor Reveal
```typescript
// Cursor sebagai revealer — konten tersembunyi di-reveal saat cursor dekat
container.addEventListener('mousemove', (e) => {
  const rect = container.getBoundingClientRect()
  hiddenLayer.style.clipPath = `circle(80px at ${e.clientX - rect.left}px ${e.clientY - rect.top}px)`
})
container.addEventListener('mouseleave', () => {
  gsap.to(hiddenLayer, { clipPath: 'circle(0px at 50% 50%)', duration: 0.4, ease: 'power2.inOut' })
})
```
**Source**: junji-yamazaki.design — cursor negative space reveal, kesan brutalist.

#### Recipe: Context-Aware Cursor States
```typescript
// Cursor berubah bentuk berdasarkan konteks
document.addEventListener('mouseover', (e) => {
  const t = e.target as HTMLElement
  if (t.closest('a, button'))          { setCursor('link', 2, 'VIEW') }
  else if (t.closest('[data-drag]'))   { setCursor('drag', 1.5, 'DRAG') }
  else if (t.closest('.project-card')) { setCursor('view', 2.5, 'VIEW') }
  else if (t.closest('p, h1, h2'))     { setCursor('text', 1, '', 'difference') }
  else                                  { setCursor('default', 1) }
})
```
**Source**: mobius — cursor berubah state/bentuk saat hover interactive elements.

---

## BAGIAN 3: SECTION REQUIREMENTS — Minimum Complexity Per Section

Setiap section WAJIB memenuhi minimum requirements ini. Jika kurang → NOT READY.

### General Requirements (SEMUA sections)

| Requirement | Minimum |
|-------------|---------|
| Atmospheric layer | Noise grain OR gradient overlay OR blend layer — minimal 1 |
| Visual material selain text | SVG accent OR generative shape OR blend element — minimal 1 |
| Animasi masuk | BUKAN opacity+y reveal. Harus salah satu: clipPath / blur-to-sharp / scramble / scale+rotate / parallax |
| Hover interaction | BUKAN hanya color/opacity change. Harus: magnetic OR displacement OR scramble OR tilt |
| Easing | BUKAN power1/linear/ease. Harus: expo.inOut / power3.out / elastic.out / CustomEase |
| Section identity | HARUS berbeda dari section sebelum & sesudahnya |

### Per-Section Minimum Requirements

#### Preloader
- [x] Viewport-filling typography (nama "BILLY MAULANA")
- [x] Chromatic text shadows (visible, >15% opacity)
- [x] Atmospheric glow + noise grain
- [x] Blur trail entrance (filter: blur → 0)
- [x] Duration 5-7 detik dengan tension-release arc
- [x] Emit complete EARLY untuk hero overlap
- [ ] Bespoke CustomEase curve (bukan preset)

#### Hero
- [x] Negative letter-spacing (-0.04em+)
- [x] Chromatic text shadows (3-layer, visible)
- [x] Fluid canvas (opacity 60%+, mix-blend-mode: screen)
- [x] Noise grain overlay
- [x] Atmospheric gradient
- [x] Mouse parallax on ghost elements
- [ ] SVG grid accent system (thin lines, strokeWidth 0.5px)
- [ ] Corner labels (expertise framing)
- [ ] Grid dots mouse-proximity color change

#### About
- [ ] Asymmetric layout (BUKAN centered grid)
- [ ] Animated counter (scroll-triggered counting) untuk stats
- [ ] Scroll-scrubbed text reveal (bukan one-shot opacity)
- [ ] Visual material: generative art / photo with blend / abstract shape
- [ ] Section background berbeda dari hero (gradient shift / accent color)

#### Projects
- [ ] Real project screenshots/mockups (BUKAN gradient placeholder)
- [ ] Full-width immersive cards ATAU overlapping layers
- [ ] Hover: magnetic tilt + image parallax (bukan scale 1.05)
- [ ] Card entrance: clipPath reveal ATAU blur-to-sharp
- [ ] Index number: oversized, overlapping card boundary
- [ ] Cursor state: "VIEW" saat hover card

#### Marquee
- [ ] 3 rows (bukan 2) dengan arah berbeda
- [ ] Velocity response terhadap scroll speed
- [ ] Gradient mask on edges (fade ke background)
- [ ] Separator: animated SVG shapes (bukan static character)
- [ ] Stroke text with varying weight

#### Manifesto
- [ ] Full-screen pinned (600vh+ scroll distance)
- [ ] Per-word blur-to-sharp reveal (scroll-scrubbed)
- [ ] Background: gradient overlay (dark blue → darker)
- [ ] Cloned text ghost shadow (mix-blend-difference)
- [ ] Accent words: italic serif + scale 1.05x + glow
- [ ] Breathing space — generous padding

#### Contact
- [ ] Full-viewport typography (text menyentuh edges)
- [ ] Email: magnetic hover + text scramble
- [ ] Background: atmospheric gradient (blue glow from center)
- [ ] Social links: inline text (bukan bordered buttons)
- [ ] Animated underline (CSS gradient atau drawSVG)

#### Footer
- [ ] Mirrors hero: staircase "BILLY MAULANA" stroke-only
- [ ] Marquee ticker (lokasi / tagline)
- [ ] Accent rule lines (garis dekoratif tipis)
- [ ] Real-time clock / coordinate numbers
- [ ] Circular narrative (footer = hero closing credits)

---

## BAGIAN 4: ANIMATION VOCABULARY — 10+ Unique Patterns

### BANNED Patterns (JANGAN PERNAH pakai sebagai default)
1. `opacity: 0, y: 30 → opacity: 1, y: 0` — generic fade-up
2. `stagger: 0.08` tanpa variasi
3. `ease: 'power1.out'` atau `'linear'` atau `'ease'`
4. Scale 1.05 sebagai satu-satunya hover effect
5. Animasi identik di 2+ sections berturut-turut

### WAJIB Dipakai: Animation Palette (Pilih MINIMAL 5 berbeda per halaman)

| # | Pattern | Code Signature | Kapan Pakai |
|---|---------|----------------|-------------|
| 1 | **Blur-to-sharp per-char** | `filter: blur(10px)→0, stagger 0.03, scrub 0.15` | Text reveal utama (manifesto, about) |
| 2 | **ClipPath circle expand** | `clipPath: circle(0%)→circle(150%)` | Section transition |
| 3 | **ClipPath inset directional** | `clipPath: inset(0 100% 0 0)→inset(0 0% 0 0)` | Heading reveal |
| 4 | **ScaleX line draw** | `scaleX: 0→1, transformOrigin: left/center` | Accent lines, dividers |
| 5 | **Per-char yPercent slide** | `yPercent: 150→0, stagger: 0.02, from: center` | Hero entrance |
| 6 | **Scramble text** | `scrambleText: { chars: '!<>-_\\/[]{}', speed: 0.3 }` | Hover, number counters |
| 7 | **xPercent + blur trail** | `xPercent: ±120, filter: blur(24px)→0` | Preloader name entrance |
| 8 | **Scale + blur exit** | `scale: 2.5, filter: blur(40px), opacity: 0` | Preloader exit |
| 9 | **Elastic overshoot** | `ease: 'elastic.out(1, 0.3)'` | Magnetic return, playful elements |
| 10 | **Parallax depth layers** | `yPercent: -30/-60/-100, scrub: true` | Background/mid/foreground separation |
| 11 | **DrawSVG progressive** | `drawSVG: '0% 100%', stagger: 0.1` | SVG accent grid entrance |
| 12 | **Pinned scrub timeline** | `pin: true, scrub: true, end: '+=600%'` | Manifesto, section morph |

### Easing Hierarchy

| Priority | Easing | Kapan Pakai |
|----------|--------|-------------|
| 1 (dominant) | `expo.inOut` | Section transitions, preloader, hero entrance |
| 2 | `power3.out` / `power4.out` | Content reveals, text entrance |
| 3 | `expo.out` | Scatter animations, dramatic exits |
| 4 | `elastic.out(1, 0.3)` | Magnetic return, playful bounce |
| 5 | `power3.in` | Exit animations (before next scene) |
| 6 | `CustomEase` | Signature moments (preloader, hero — bespoke feel) |
| BANNED | `power1.out`, `linear`, `ease`, `swing` | JANGAN PERNAH |

---

## BAGIAN 5: ANTI-SLOP CHECKLIST — Verifikasi Sebelum Commit

### Per-Section Checklist (SEMUA harus ✅)

- [ ] **Unique structure** — Layout BERBEDA dari section sebelumnya
- [ ] **Not opacity+y** — Animasi masuk BUKAN generic fade-up
- [ ] **Has atmosphere** — Minimal 1 atmospheric layer (noise/gradient/blend)
- [ ] **Has visual material** — Minimal 1 elemen non-text (SVG/shape/generative)
- [ ] **Visible accent color** — Warna identity (#0047FF family) di opacity > 15%
- [ ] **Premium hover** — Hover BUKAN hanya color/opacity change
- [ ] **Easing quality** — BUKAN power1/linear/ease
- [ ] **Slop test passed** — Section ini TIDAK bisa dipakai untuk portfolio orang lain tanpa modifikasi

### Per-Page Checklist

- [ ] **5+ animation patterns** — Minimal 5 pattern BERBEDA dari palette di atas
- [ ] **Section variety** — Tidak ada 2 section berturut-turut dengan layout serupa
- [ ] **Circular narrative** — Footer mirrors hero
- [ ] **Scroll pacing** — Ada breathing space antar section (20vh+ gaps)
- [ ] **Color depth** — Background bukan flat #000. Ada gradient, noise, blend layers
- [ ] **Performance** — WebGL lazy-init saat visible, destroy off-screen
- [ ] **Reduced motion** — prefers-reduced-motion handling pada SEMUA animasi

---

## BAGIAN 6: USER TASTE DNA — Quick Reference

### Yang PALING Disukai (dari 100+ references)

| Category | Preference | Frequency |
|----------|-----------|-----------|
| Typography | Bold condensed viewport-filling | 40+ sites |
| Layout | Grid hero (Swiss foundation) | 25+ sites |
| Color | Electric blue + cyan + indigo gradients | Paling disukai |
| Material | Glass/liquid/prisma/chrome | 10+ sites |
| Cursor | Hologram/silver/negative/context-aware | 8+ sites |
| Motion | Cinematic splash → premium scroll | 10+ sites |
| Blend | mix-blend-mode: difference + luminosity | 10+ sites |
| Footer | Marquee + accent rules + bold typography | 3+ sites |

### Yang PALING Dibenci

| Anti-Pattern | User Quote |
|-------------|-----------|
| Monoton/boring | "hasil jelek, monoton, boring, tidak ada sentuhan creative" |
| AI slop | "hasil terlalu ai slop" |
| Pastel/muted | "ungu pastel saya tidak suka", "terlalu pudar" |
| White background | "background warna putih saya tidak begitu suka" |
| Full bright BG | "tidak suka full color kuning dan orange" |
| Green on dark | "warna hijaunya di heronya saya tidak suka" |
| Template look | "terlalu template", "terlalu biasa saja" |
| Video-heavy | "saya menghindari video" |
| Scale 1.05 hover | This is NOT "mahal". This is FREE and DEFAULT. |

### Sweet Spot Formula
```
Brutalist Expression + Premium Feel + Swiss Grid Structure
+ Dark Cinematic Background + Vibrant Accent Colors
+ Liquid/Glass Material Interaction + Bold Typography
+ Text Blending/Negative Space Effects + Metallic Accents
+ Hologram/Context-Aware Cursor + Cinematic Splash-to-Landing
+ Marquee Footer as Closing Statement
= Billy Maulana's Design DNA
```

Site paling mendekati: **junji-yamazaki.design** ("ini style yang mendekati saya")
Effect paling stunning: **daspritam.in** (fluid text masking)
Feel yang dicari: **"terasa mahal dan premium"** (15+ verdicts)

---

## BAGIAN 7: QUALITY GATES — Kapan Output Siap

### Gate 1: Visual Inspection (Browser)
Setelah implement, buka browser dan jawab:
1. Apakah ada elemen visual selain text? (noise, gradient, SVG, blend)
2. Apakah animasi masuk terasa "mahal" atau "generic"?
3. Apakah section ini bisa di-screenshot dan dikenali sebagai milik BILLY MAULANA?
4. Apakah hover effect terasa "premium" atau "default CSS"?

### Gate 2: Technical Verification
```bash
pnpm typecheck && pnpm lint && pnpm build
```

### Gate 3: Comparison Test
Bandingkan output dengan reference site terdekat:
- Hero → bandingkan dengan daspritam.in atau art-yakushev.com
- About → bandingkan dengan kaitonote.com (services section)
- Projects → bandingkan dengan art-yakushev.com (numbered portfolio)
- Manifesto → bandingkan dengan kaitonote.com (scroll manifesto)
- Footer → bandingkan dengan chdartmaker.com (circular narrative)

Jika output terasa "jauh lebih rendah" dari reference → REVISE.

---

## BAGIAN 8: STUDIO WISDOM — Pelajaran dari Pemenang

### Dari Exo Ape (SOTM)
> "Simplicity. 2 colors: white + dark gray. Complexity from PRECISION, not effect quantity."
- Motion di-prototype di After Effects DULU, baru translated ke GSAP
- Setiap timing curve divalidasi secara visual sebelum code

### Dari Lusion (SOTM)
> "Response feeling organic matters more than real-time accuracy."
- Pre-baked physics (Houdini), blend at runtime berdasarkan mouse position
- Mobile = accelerometer tilt sebagai interaction

### Dari Immersive Garden (SOTY + Developer SOTY)
> "Ask: Why does a frontend architect need fluid sim? Answer must be compelling."
- Effect HARUS serve content — watercolor untuk poet, glass untuk luxury brand
- Mobile quality levels per device capability

### Dari Aristide Benoist (3x Developer of Year)
> "Authored motion beats boilerplate. Every easing, every delay has PERSONALITY."
- Avoid libraries when possible — build from first principles
- Each portfolio iteration = clear EVOLUTION, bukan random redesign

### Dari Bruno Simon (Memorable)
> "Win via ONE idea executed perfectly, not many effects done okay."
- RC car 3D world IS the portfolio, bukan "portfolio with 3D effects"
- Conceptual clarity > technical complexity

---

*Dokumen ini adalah constitution — setiap perubahan UI HARUS dicek against checklists di atas. Jika gagal 1 gate, JANGAN commit.*
