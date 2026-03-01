# Interaction Craft

Page transitions, preloader, hover patterns, dan DOM architecture dari situs award-winning.

---

## Page Transitions = Scene Cuts

Transisi bukan "fade ke halaman baru". Transisi adalah **narrative connective tissue** — entry/exit states dapat design care yang sama dengan visible layouts.

### Frozen Scroll (1820 Productions — Taxi.js)
Mencegah visual jump saat transisi:
1. Capture scroll position
2. Set outgoing page ke `position: absolute`
3. Offset inner content dengan `-scrollPosition` (top)
4. Animasi keluar
5. Tunggu page baru mount components
6. Destroy page lama
7. Remove old DOM

### State Persistence (Jason Bergh — Barba.js)
- Elemen persisten (garis analog) simpan state di `sessionStorage` sebelum navigasi
- Posisi di-restore sebelum JS load — ilusi continuous motion
- Background video terus play sebagai "glue" — tidak ada keheningan statis antar transisi

---

## Preloader = Opening Credits

Preloader bukan loading bar. Preloader adalah SCENE PEMBUKA yang set tone untuk seluruh pengalaman.

### Session-Aware
```
First visit  → Full cinematic intro (set mood, establish identity)
Return visit → Quick loader (respek waktu user yang sudah kenal)
```
Implementasi: `sessionStorage.getItem("firstSession")`

### Transition ke Page
Seamless bridge dari preloader ke halaman — user merasakan "zoom-in" ke situs, bukan lompatan.

---

## Hover Patterns yang Bukan Opacity

| Pattern | Deskripsi | Sumber |
|---------|-----------|--------|
| SVG morph | Cursor shape berubah context-aware (dot→play→arrow) | 1820 |
| Magnetic | Elemen "tertarik" ke cursor | Shared |
| Chromatic/displacement | Image distortion on hover | Shared |
| Text scramble | Character randomize lalu settle | Shared |
| Material spotlight | Button react seperti material di bawah cahaya bergerak | Penev |
| Noise-texture trails | Icon wake di belakang cursor via GPU texture | Penev |

---

## DOM Architecture Patterns

### Module Lifecycle (1820 — Webflow-Dev-Setup)
```
data-module="cursor"
├── onMount      → init, event listeners, start animation
├── onDestroy    → cleanup, remove listeners, kill animation
├── onPageIn     → animasi masuk halaman baru
└── onPageOut    → animasi keluar halaman lama
```
`onDestroy` WAJIB — mencegah zombie event listeners dan memory leak di SPA.

### DOM Switching (Jason Bergh)
Slider (cinematic) ↔ List (virtual scroll):
1. Fade Out current view
2. Rebuild DOM (chain of Promises)
3. Fade In new view
4. Background video terus play sebagai glue

### Video Player Growth
- `getBoundingClientRect` capture posisi saat klik
- Player grow dari posisi exact via CSS variables
- Close: scroll balik ke project → recalculate position → shrink ke thumbnail
- Handle DOM virtualization (elemen mungkin sudah di-destroy/re-create)

---

## Network-Aware Degradation

Premium, not frustrating. Full experience hanya untuk yang bisa menikmatinya.

```
4G connection         → Full Creative Mode (heavy animations, WebGL)
Slow connection       → Simplified animations
Data Saver mode       → Disable heavy preloads
No connection info    → Assume capable (fallback)
```

Implementasi: `navigator.connection.effectiveType === '4g'`

---

## Scroll-Driven Patterns

### Normalized Progress
Progress di-map ke range 0→1 → drive CSS variables. Text highlights, geometry reveals, transitions respond ke normalized progress tanpa hardcoded frame-by-frame logic.

### Marquee dengan Physics
- Direction multiplier flip on swipe detection
- Handle tab visibility: reset deltaTime saat tab visible — cegah catch-up jump
- Speed terikat pointer drag direction

### Persistent Ambient Motion
Elemen yang bergerak terus berdasarkan scroll inertia:
- Garis, parallax layers, background textures
- Kecepatan = fungsi dari scroll velocity, bukan scroll position
- Tersinkronisasi via single rAF loop

---

## Stack Pattern yang Konsisten

**Shared across award-winning sites:**
- GSAP (de facto standard untuk motion)
- Lenis (smooth scroll)
- Page transition library (Barba.js / Taxi.js / custom)
- ScrollTrigger (scroll-driven animation)

**Optional (case-by-case):**
- Three.js / WebGL (hanya saat CSS tidak cukup)
- SplitType (per-character animation)
- Custom shader (CRT, displacement, etc.)
