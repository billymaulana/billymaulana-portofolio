# Motion Design Principles — Expert Reference

Disintesis dari 3 expert: Emil Kowalski (Linear), Jakub Krehel (jakub.kr), Jhey Tompkins (@jh3yy).
Source: kylezantos/design-motion-principles

---

## Kapan HARUS vs JANGAN Animate

### Emil's Frequency Rule

| Frekuensi | Rekomendasi |
|-----------|-------------|
| Rare (bulanan) | Delightful, morphing animations OK |
| Occasional (harian) | Subtle, fast (180-250ms) |
| Frequent (100x/hari) | Tanpa animasi / instant |
| Keyboard-initiated | JANGAN PERNAH animate |

### Context-to-Perspective Map

| Project Type | Primary | Secondary | Selective |
|--------------|---------|-----------|-----------|
| Productivity (Linear, Raycast) | Emil | Jakub | Jhey (onboarding only) |
| Creative portfolio / Awwwards | Jakub | Jhey | Emil (high-freq interactions) |
| Marketing / landing page | Jakub | Jhey | Emil (forms, nav) |
| Kids app / educational | Jakub | Jhey | Emil (game interactions) |
| SaaS dashboard | Emil | Jakub | Jhey (empty states) |
| Mobile app | Jakub | Emil | Jhey (delighters) |

---

## Enter Animation Recipe (Jakub)

```jsx
initial={{ opacity: 0, translateY: 8, filter: "blur(4px)" }}
animate={{ opacity: 1, translateY: 0, filter: "blur(0px)" }}
transition={{ type: "spring", duration: 0.45, bounce: 0 }}
```

| Property | From | To | Why |
|----------|------|----|-----|
| Opacity | 0 | 1 | Fade in |
| TranslateY | 8px | 0 | Subtle upward |
| Blur | 4px | 0px | "Materializing" effect |

### Exit — Subtler Than Enter

```jsx
exit={{ translateY: "-12px", opacity: 0, filter: "blur(4px)" }}
```

Exits JANGAN sama prominent dengan enters — user focus pindah ke konten baru.

---

## Emil's 7 Practical Tips

### 1. Scale Buttons on Press
```css
button:active { transform: scale(0.97); }
```

### 2. Jangan Animate dari scale(0)
```jsx
/* BAD */  initial={{ scale: 0 }}
/* GOOD */ initial={{ scale: 0.9, opacity: 0 }}
```

### 3. Tooltip Delay Pattern
First tooltip: delay + animate. Subsequent: instant (no delay).
```css
[data-instant] { transition-duration: 0ms; }
```

### 4. Custom Easing Wajib
Built-in `ease`/`ease-in-out` terlalu lemah. Gunakan custom Bezier:
- `ease-out` untuk elements entering
- `ease-in-out` untuk elements changing state
- Springs untuk interactive elements
- Tools: easing.dev, easings.co

### 5. Origin-Aware Animations
```css
/* Dropdown dari button = expand dari button, bukan center */
.dropdown { transform-origin: top center; }
```

### 6. Keep Under 300ms
180ms terasa lebih responsive dari 400ms. Saat ragu, lebih cepat.

### 7. Blur Saat Tidak Ada Solusi Lain
```css
.transitioning { filter: blur(2px); }
```
Blur bridges gap antara state lama dan baru.

---

## Clip-Path Mastery (Emil)

Hardware-accelerated, no layout shifts, no extra DOM.

```css
/* Image reveal */
.reveal {
  clip-path: inset(0 0 100% 0);
  animation: reveal 1s forwards cubic-bezier(0.77, 0, 0.175, 1);
}
@keyframes reveal { to { clip-path: inset(0 0 0 0); } }
```

```js
/* Scroll-driven clip-path */
const clipPathY = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);
const motionClipPath = useMotionTemplate`inset(0 0 ${clipPathY} 0)`;
```

---

## Spring Physics (Emil)

| Parameter | Effect |
|-----------|--------|
| Stiffness | Kecepatan ke target (higher = faster) |
| Damping | Kecepatan settle (higher = less bounce) |
| Mass | Berat objek (higher = more momentum) |

```js
const springConfig = { stiffness: 300, damping: 30 };
const x = useSpring(mouseX, springConfig);
```

### Jakub's Spring Defaults
```jsx
/* Professional */ transition={{ type: "spring", duration: 0.45, bounce: 0 }}
/* Playful */     transition={{ type: "spring", duration: 0.55, bounce: 0.1 }}
```

---

## Visual Polish (Jakub)

### Shadows > Borders
```css
.card {
  box-shadow:
    0px 0px 0px 1px rgba(0, 0, 0, 0.06),
    0px 1px 2px -1px rgba(0, 0, 0, 0.06),
    0px 2px 4px 0px rgba(0, 0, 0, 0.04);
}
```
Shadows adapt ke background apapun via transparency. Borders = solid color yang bisa clash.

### oklch Gradients
```css
background: linear-gradient(in oklch, blue, red);
```
Hindari muddy midpoints di sRGB.

### Optical Alignment
- Buttons with icons: kurangi padding di sisi icon
- Play button triangle: shift sedikit ke kanan agar terlihat centered
- Rule: kalau terlihat salah meski mathematically correct, trust your eyes

### Icon Swap Animation
```jsx
<AnimatePresence mode="wait">
  <motion.div
    initial={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
    exit={{ opacity: 0, scale: 0.8, filter: "blur(4px)" }}
  >
    <CheckIcon />
  </motion.div>
</AnimatePresence>
```

---

## CSS Innovation (Jhey)

### linear() — Pure CSS Bounce/Elastic
```css
:root {
  --bounce-easing: linear(
    0, 0.004, 0.016, 0.035, 0.063, 0.098, 0.141 13.6%, 0.25, 0.391, 0.563, 0.765,
    1, 0.891 40.9%, 0.848, 0.813, 0.785, 0.766, 0.754, 0.75, 0.754, 0.766, 0.785,
    0.813, 0.848, 0.891 68.2%, 1 72.7%, 0.973, 0.953, 0.941, 0.938, 0.941, 0.953,
    0.973, 1, 0.988, 0.984, 0.988, 1
  );
}
```
Tool: https://linear-easing-generator.netlify.app/

### @property — Animate CSS Variables
```css
@property --hue {
  initial-value: 0;
  inherits: false;
  syntax: '<number>';
}
@keyframes rainbow { to { --hue: 360; } }
```

Tanpa `@property`, CSS variables = strings (tidak bisa interpolate). Dengan type declaration, browser tahu cara smooth-transition.

### Curved Motion via Decomposed Transforms
```css
@property --x { syntax: '<percentage>'; initial-value: 0%; inherits: false; }
@property --y { syntax: '<percentage>'; initial-value: 0%; inherits: false; }
.ball {
  transform: translateX(var(--x)) translateY(var(--y));
  animation: throw 1s;
}
@keyframes throw {
  0% { --x: -500%; }
  50% { --y: -250%; }
  100% { --x: 500%; }
}
```

### animation-fill-mode: backwards
WAJIB untuk fade-in sequences dengan delay — tanpa ini, elements flash di full opacity sebelum animasi mulai.

### Negative Delays untuk Stagger
```css
.element { animation-delay: calc(var(--index) * -0.2s); }
```
Animasi terlihat "sudah berjalan" dari awal.

### Scroll-Driven Animation
Decouple scroll speed dari animation duration:
1. Trigger animation: scroll-driven, toggle custom property saat element masuk view
2. Main animation: duration-based tradisional, diaktifkan via Style Query

```js
if (!CSS.supports('animation-timeline', 'scroll()')) {
  // Fallback: IntersectionObserver
}
```

---

## Performance Implementation (Emil)

### CSS Transitions > Keyframes untuk Interruptible
```jsx
// Keyframes TIDAK bisa di-interrupt mid-flight
// CSS transitions BISA retarget smoothly
.toast {
  transform: translateY(100%);
  transition: transform 400ms ease;
}
.toast.mounted { transform: translateY(0); }
```

### Direct Style > CSS Variables untuk Frequent Updates
```js
/* BAD: CSS variable cascade recalc */
element.style.setProperty('--drag-y', `${y}px`);
/* GOOD: direct style */
element.style.transform = `translateY(${y}px)`;
```

### Velocity-Based Dismissal > Distance Threshold
```js
const velocity = dragDistance / elapsedTime;
if (velocity > 0.11) dismiss(); // fast short gestures work
```

### will-change — Targeted Only
```css
/* GOOD */ .animated-button { will-change: transform, opacity; }
/* BAD */  * { will-change: auto; }
```
Properties yang benefit: transform, opacity, filter, clip-path, mask.

---

## Motion Audit Checklist (Quick)

### Critical (Must Fix)
- Missing `prefers-reduced-motion` support
- Animating layout properties (width, height, top, left)
- No exit animations (elements just disappear)
- Conditional renders tanpa AnimatePresence (motion gaps)
- Keyboard-initiated actions yang animate
- High-frequency actions (100x/day) dengan animasi

### Important (Should Fix)
- Exit animations sama prominent dengan enter
- Missing blur di enter animations
- Animate dari scale(0) instead of 0.9+
- Default CSS easing instead of custom curves
- Wrong transform-origin di dropdowns/popovers

### Nice to Have
- oklch color space untuk gradients
- Spring animations instead of ease
- Button scale feedback on press
- Tooltip delay pattern (first delayed, subsequent instant)
- Optical alignment refinements

---

## Red Flags in Code Review

```jsx
/* BAD: Animate layout */ animate={{ width: 200, height: 100 }}
/* GOOD: Transform */     animate={{ scale: 1.2 }}

/* BAD: Same enter/exit */ exit={{ opacity: 0, y: 20 }}
/* GOOD: Subtler exit */   exit={{ opacity: 0, y: -8 }}

/* BAD: No reduced motion */
.animated { animation: bounce 1s infinite; }
/* GOOD */
@media (prefers-reduced-motion: no-preference) {
  .animated { animation: bounce 1s infinite; }
}

/* BAD: scale(0) */ initial={{ scale: 0 }}
/* GOOD */          initial={{ scale: 0.9, opacity: 0 }}
```

---

## 3 Expert Summary

| Aspect | Emil | Jakub | Jhey |
|--------|------|-------|------|
| Focus | Restraint & speed | Subtle polish | Playful experimentation |
| Key question | "Should this animate?" | "Is this subtle enough?" | "What could this become?" |
| Signature | Frequency-based decisions | Blur + opacity + translateY | CSS @property |
| Best for | High-frequency tools | Production polish | Learning & exploration |
| Durations | Under 300ms (180ms ideal) | 200-500ms for smoothness | Whatever serves the effect |

**Synthesis**: Emil decides IF → Jakub decides HOW → Jhey explores WHAT IF.

---

## Easing Selection (Context-Dependent)

| Easing | Feel | Best For |
|--------|------|----------|
| `ease-out` | Fast start, gentle stop | Elements entering |
| `ease-in` | Gentle start, fast exit | Elements leaving |
| `ease-in-out` | Gentle both ends | State changes |
| `spring (bounce: 0)` | Natural decel | Professional UI |
| `spring (bounce > 0)` | Bouncy | Playful/kids |
| `elastic` | Overshoot | Attention-grab (sparingly) |
| `linear()` custom | Precise control | Complex curves in pure CSS |

---

## Emil-Anim 40 Rules — Specific Values (corysimmons)

### Timing Rules
- **Micro-interactions**: 150-250ms. **Standard**: 200-350ms. **Complex**: 400-600ms max
- **Exit faster than entrance**: enter 300ms, exit 200ms — user focus shifts to new content
- **Hard ceiling**: NEVER exceed 1 second total animation time
- **Stagger**: 30-60ms between items, max 3-7 items per group — more = boring chain
- **Hover**: instant on (0ms response), 150ms ease-out off — fast feedback, graceful departure

### Value Rules
- **Pressed state**: `scale(0.97-0.98)`, NEVER below `0.95` — subtle, not cartoonish
- **Modal open**: start at `scale(0.96) + opacity`, NOT `scale(0)` — "starting from nothing looks cheap"
- **Movement distances**: 4-16px for micro-movements, 20-40px for larger reveals
- **Opacity MUST accompany movement**: fade + translateY, NEVER fade alone — "naked fades feel broken"
- **NEVER use linear easing for UI** — only for progress bars, looping backgrounds, scrollbar indicators

### Orchestration Rules
- **Orchestration order**: backdrop > container > content > actions
- **Background elements animate first, foreground last** — creates layered depth
- **Transform-origin**: center for growth animations, trigger-point for menus/dropdowns/tooltips

### When NOT to Animate
- Form validation errors, critical error states — urgency over aesthetics
- Content user is actively reading — don't move what they're focused on
- High-frequency data updates (stock tickers, live scores) — data clarity wins
- Anything seen 100+ times per session — animate rare, skip frequent

### Motion Quality Test
- Does it feel good at **2x speed**? → If yes at 2x, your timing is too slow
- Would user notice if you **removed it**? → If they wouldn't notice, reconsider if it adds value
- Is the metaphor right? → Dropping = ease-in + bounce, Rising = ease-out, Sliding = ease-in-out

---

## Kurikulum Zajno motion.ed (sumber: motion.zajno.com, dibaca 2026-07-26)

Situs `motion.zajno.com` adalah kurikulum motion design 8 bab yang mendemonstrasikan tiap teknik
memakai teknik itu sendiri. Ringkasan di bawah adalah isi teks situsnya, bukan tafsiran. Analisis
implementasinya ada di `library/zajno-motion.md`.

### Tiga fungsi animasi UI (dipakai sebagai kriteria "layak dianimasikan")

| # | Fungsi | Uji |
| --- | --- | --- |
| 1 | Mengendalikan perhatian & navigasi | "menekankan detail yang harus diperhatikan user, membantu ia menavigasi situs" |
| 2 | Menyampaikan mood brand/produk | efek yang sama diganti konteks harus terasa berbeda (fitness = memompa, arsitektur = tenang) |
| 3 | Mendorong eksplorasi | animasi memberi petunjuk cara memakai slider/navigasi, dan membongkar informasi visual bertahap |

Kalau sebuah animasi tidak melakukan salah satu dari tiga hal itu, ia dekorasi.

### Dua kelas interface (istilah situs)

- **Real-time** — merespons SAAT user berinteraksi (fisika, drag, cursor-driven).
- **Not real-time** — merespons SETELAH interaksi selesai (playback rekaman, Lottie, video).

Zajno meletakkan keduanya berdampingan di satu layar dengan tampilan identik (kiri Matter.js,
kanan Lottie) — perbedaannya hanya terasa saat disentuh. Implikasi untuk brief: tentukan kelasnya
di awal, karena biaya implementasinya berbeda kelas, bukan berbeda derajat.

### Taksonomi 8 teknik (dipakai sebagai checklist variasi antar-section)

| # | Teknik | Definisi operasional dari situs |
| --- | --- | --- |
| 1 | Easing | "Di alam, kecepatan gerak tidak pernah linear" — objek mempercepat saat mulai, melambat saat berhenti. Skala yang diajarkan: Linear, Ease, Ease-in, Ease-out, Cubic |
| 2 | Offset & delay | Jeda kecil antar 2+ objek menciptakan rasa lembut dan gerak berlapis, DAN menandai posisi objek dalam hierarki |
| 3 | Fade-in/fade-out | Paling universal, tapi "bekerja paling baik bersama teknik lain: posisi, skala, atau (sesekali) bentuk" |
| 4 | Transform & morph | Mengubah objek A jadi objek B untuk menjaga kontinuitas perhatian antar-layar — "khususnya efektif untuk storytelling" |
| 5 | Masking | Objek morfik dipakai sebagai mask foto; foto di dalam mask boleh scale/move/spin |
| 6 | Dimension (Floating Dimensionality) | Cara paling populer menyampaikan volume; membuat interaksi terasa intuitif dan naratif |
| 7 | Parallax | "Makin jauh objeknya, makin sedikit ia bergerak" — perpindahan berbanding terbalik dengan kedalaman |
| 8 | Zoom | Kontinuitas naratif + memberi tahu user ada konten di luar pandangan |

Catatan: menu situs menamai bab ke-6 "scale" sementara heading dan `id` menyebutnya "dimension" —
inkonsistensi di sumbernya sendiri, bukan salah baca.

### Pemetaan ke prinsip Disney (eksplisit di situs)

| Prinsip Disney | Teknik web padanannya | Mekanik |
| --- | --- | --- |
| Slow in and slow out | Easing | "Menambah lebih banyak frame di awal dan akhir sekuens" — analog langsung dari easing curve |
| Follow through & overlapping action | Offset & delay | "Bagian-bagian objek berhenti pada kecepatan berbeda" — rambut berhenti beberapa frame setelah badan |

Implikasi: stagger BUKAN dekorasi ritmis, ia simulasi massa berbeda pada satu objek majemuk.

### Triad diagnostik (perbandingan 3 kolom di situs)

Situs menampilkan satu animasi yang sama dalam tiga keadaan berjajar:
`Missing easing & delay` -> `Correct easing` -> `Correct delay & animation`.

Artinya **easing dan delay adalah dua mode kegagalan terpisah dan diperbaiki berurutan**: perbaiki
kurva dulu, baru orkestrasi. Menambahkan stagger di atas easing yang salah tidak memperbaiki apa
pun. Pakai urutan ini saat mendiagnosis motion yang "terasa aneh tapi tidak jelas kenapa".

### Aturan fade yang lebih presisi daripada isi file ini sebelumnya

1. Fade sendirian = default yang lemah; pasangkan dengan posisi/skala/bentuk.
2. Bila beberapa objek muncul di satu layar, **wajib** tambahkan delay antar objek.
3. **Untuk membedakan dua elemen bertetangga: animasikan satu dengan opacity + posisi, dan yang
   lain dengan opacity SAJA.** Perbedaan perlakuan itulah yang memisahkan keduanya secara visual.

### Kontradiksi terhadap isi Taste Engine saat ini

**K1 — larangan easing linear.**

| | Isi |
| --- | --- |
| Klaim lama | `anti-slop-rules.md` BANNED: "Easing: `linear`, `ease`, `power1`, `swing`"; file ini: "NEVER use linear easing for UI — only for progress bars, looping backgrounds, scrollbar indicators" |
| Temuan baru | Di `motion.zajno.com`, **37 dari 40 deklarasi `ease` eksplisit memakai `"none"` (plus 4 blok `defaults:{ease:"none"}`)** (= linear), dan Billy menyebut situs itu "saya suka motionnya" |
| Yang menang | Keduanya, dengan pembagian ruang lingkup. Larangan linear BENAR untuk tween **berbasis waktu**. Untuk tween **scrubbed**, `ease: "none"` justru WAJIB — easing sudah tinggal di dua tempat lain: kurva smooth-scroll (Lenis `duration: 2`, `1.001 - 2^(-10t)`) dan `scrub` smoothing. Menaruh easing ketiga di atas keduanya menghasilkan double-easing yang terbaca sebagai rubber-band saat user berhenti scroll |
| Sisa yang tetap berlaku | Linear tetap dilarang untuk hover, klik, enter/exit, dan transisi state — apa pun yang durasinya dijalankan oleh waktu, bukan oleh scroll |

**K2 — "naked fades feel broken".**

| | Isi |
| --- | --- |
| Klaim lama | File ini, Emil-Anim 40 Rules: "Opacity MUST accompany movement: fade + translateY, NEVER fade alone" |
| Temuan baru | Zajno mengajarkan fade telanjang sebagai **alat kontras yang disengaja**: satu elemen dapat opacity + posisi, tetangganya dapat opacity saja, supaya keduanya terbaca terpisah |
| Yang menang | Klaim lama sebagai **default**, temuan baru sebagai **pengecualian bersyarat**. Fade telanjang sah HANYA bila ada tetangga langsung yang mendapat perlakuan penuh di saat yang sama. Fade telanjang untuk semua elemen tetap ditolak |

**K3 — plafon durasi.**

| | Isi |
| --- | --- |
| Klaim lama | File ini: "Complex: 400-600ms max", "Keep Under 300ms", "NEVER exceed 1 second" |
| Temuan baru | Zajno memakai **700ms** untuk reveal media (`clip-path: circle()`) dan **2000ms** untuk settle Lenis |
| Yang menang | Klaim lama untuk **UI chrome** (nav, tombol, tooltip — Zajno sendiri memakai 400ms di situ, konsisten). Reveal media adalah kelas terpisah: ia mengganti seluruh isi layar, bukan memberi umpan balik. Plafon 400-600ms tidak berlaku untuk pergantian konten skala penuh. Angka Lenis bukan animasi UI sama sekali — itu konstanta smoothing scroll |

**K4 — kualitas motion vs level teknik.**

Zajno mencapai motion yang Billy sukai dengan **nol WebGL dan nol Three.js** — satu-satunya canvas
adalah 2D Matter.js. Ini tidak mencabut aturan "minimum 1 GLSL/WebGL shader per project" di
`anti-slop-rules.md` (aturan itu tentang portofolio Billy, bukan tentang cara menilai referensi),
tapi ia membantah asumsi turunannya: **level teknik pada hierarki anti-slop mengukur ambisi
render, bukan kualitas motion.** Koreografi (bobot, jeda, kontinuitas subjek) berjalan di sumbu
yang berbeda dan bisa dinilai terpisah.

---

## Sumber
- Emil Kowalski: "Animations on the Web" course, Sonner & Vaul OSS libraries
- Jakub Krehel: jakub.kr production patterns
- Jhey Tompkins: Smashing Magazine articles, CSS-Tricks, creative demos
- Synthesized by: kylezantos/design-motion-principles v1.1
- Emil-anim 40 rules: corysimmons (Gist)
