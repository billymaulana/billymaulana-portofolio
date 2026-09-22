# Motion Architecture

Cara membangun motion system yang survive di production. Dari Vladyslav Penev, 1820 Productions, dan BL/S.

---

## Prinsip: Motion Bukan Dekorasi

"I don't trust ideas until they survive the browser." — Penev

Motion di situs award-winning bukan ornamen yang ditambahkan di akhir. Motion ADALAH material desain. Semakin sedikit elemen visual, semakin besar tanggung jawab motion untuk menyampaikan kualitas.

---

## Arsitektur Input-to-Output

### 3 Sinyal Input
1. **Scroll progress** — coupling ke viewport position (normalized 0-1)
2. **Cursor position** — spatial awareness untuk interactive feedback
3. **Velocity/inertia** — physics-based lag; scroll keras = efek kuat, scroll pelan = subtle

Sinyal di-feed ke **CSS variables** → komponen downstream bereaksi lokal tanpa koordinasi global.

### Separation of Concerns
Satu elemen bisa respond ke 3 driver simultan:
- Scripted keyframe poses
- Scroll-driven transitions
- Cursor parallax

Layer-layer ini **STACK** (additive), bukan compete — mencegah jitter.

### Inertia = State Signal
Velocity diperlakukan BEDA dari position. Text deformation terikat scroll inertia: bukan "di mana user scroll" tapi "seberapa keras user scroll". Position-only deformation terasa dekoratif. Inertia membuat motion terasa intentional.

---

## Cursor System (3 Layer)

| Layer | Easing | Fungsi |
|-------|--------|--------|
| Icon | 0.15 (cepat) | Direct feedback, SVG morph (play/pause/arrow) |
| Circle | 0.08 (medium) | Spatial context |
| Label | 0.05 (lambat) | Contextual info, perceived mass |

**Performance**: SVG path di-cache saat init. Morph via `morphSVG` (rotational, 0.5s expo.out). Event delegation di document-level (capture phase) — tidak re-attach setelah navigasi.

---

## Timing Rules

| Context | Duration | Alasan |
|---------|----------|--------|
| Desktop transition | 0.6s | Layar besar butuh waktu "settle" |
| Mobile transition | 0.3s | Thumb-swipe butuh feedback cepat |
| Hover morph | 0.5s | Terasa responsive tapi smooth |
| Stagger per-element | 0.08-0.1s | Orchestrated tapi tidak lambat |
| Mobile stagger | 0.05s | Snappy |
| Easing | power3+ atau expo | BUKAN linear atau power1 |

---

## Performance Patterns

| Teknik | Kapan |
|--------|-------|
| Single rAF loop | Unify smooth scroll + WebGL + entry anims + transitions |
| GPU-resident effects | Trail rendering via texture shader, bukan DOM nodes |
| Lazy loading | Dari real content pressure, bukan teori |
| WebGL hanya saat perlu | Jika CSS tidak bisa express — bukan default |
| CSS > JS untuk animation | CSS state drive animation; JS hanya orchestrate |
| Layout = source of truth | 3D objects track DOM position/size, bukan sebaliknya |
| deltaTime capping di rAF | Cegah jank setelah tab switch |
| Module cleanup | onDestroy: kill listeners, kill timelines — cegah zombie |

---

## Abstraksi

1. One-off experiment → validated pattern → library component
2. JANGAN abstract sebelum terbukti di production (real content, edge cases, responsive)
3. Clean structure prioritas cheap iteration, bukan complexity reduction

---

## Scrub-First Architecture (sumber: motion.zajno.com, dibedah 2026-07-26)

Angka di bawah dibaca dari `cdn.zajno.com/dev/motion/script.v33.min.js` (25.488 byte) dan
diverifikasi ulang lewat `ScrollTrigger.getAll()` di browser. Situs: GSAP 3.10.4 + ScrollTrigger +
MotionPathPlugin + CustomEase + Observer, Lenis, Matter.js 0.18.0, Lottie. Nol WebGL.
Catatan referensi lengkap: `library/zajno-motion.md`.

### 1. Durasi = bobot relatif, bukan detik

Di timeline scrubbed, `duration` tidak pernah dieksekusi sebagai waktu — ia hanya menentukan
proporsi panjang scroll tiap segmen.

```js
gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { scrub: 1 } })
  .to(ball, { duration: 4,  /* segmen 1 */ })
  .to(ball, { duration: 7,  motionPath: { start: 0,      end: 0.1477  } })
  .to(ball, { duration: 18, motionPath: { start: 0.1477, end: 0.43367 } })
  .to(ball, { duration: 14, motionPath: { start: 0.43367,end: 0.61329 } })
  .to(ball, { duration: 27, motionPath: { start: 0.61329,end: 1       } });
```

Total bobot 4+7+18+14+27 = 70. Segmen berbobot 27 memakan 27/70 = 38,6% dari panjang scroll
untuk menempuh 38,7% panjang path — artinya **kecepatan per-piksel-scroll dibuat tidak rata TANPA
satu pun easing curve**. Ini cara memberi pacing pada scroll-driven motion yang tidak bisa ditiru
dengan easing (easing di dalam scrub akan bertabrakan dengan smoothing Lenis).

### 2. Panjang pin diturunkan dari viewport, bukan hardcoded

```js
const d = vw * 0.75 + vw * slides * 0.75 + vw * slides * 0.5 + vw * 0.25;  // desktop
// <=991px: faktor 0.75 diganti 1;  mobile: d *= 3
scrollTrigger: { pin: true, anticipatePin: 1, start: "top top", end: () => "+" + d, scrub: true }
```

`end` ditulis sebagai **fungsi**, bukan string tetap, supaya `ScrollTrigger.refresh()` menghitung
ulang saat resize. Hasil terukur: dua section pinned masing-masing tepat 6840px pada viewport
1440px. Section rail horizontal memakai `end: () => "+=" + (scrollWidth - vw)` sehingga panjang
scroll = jarak geser yang sebenarnya (terukur 852px = 2292 - 1440), rasio 1:1 antara gerak jari
dan gerak konten.

### 3. Tiga tingkat `scrub` sebagai ritme antar-section

| Nilai | Dipakai untuk | Rasa |
| --- | --- | --- |
| `scrub: true` | Rail video pinned (2 section, 6840px masing-masing) | Terikat langsung ke jari, nol lag |
| `scrub: 1` | MotionPath intro (3847px), rail interactive (852px) | Smoothing 1 detik, terasa punya massa |
| `scrub: 3` | Section resources (paling akhir) | Smoothing 3 detik, sengaja berat — menandai penutup |

`scrub` adalah alat pacing tingkat-section, bukan setelan global. Menyeragamkannya menghapus
perbedaan karakter antar-section.

### 4. Disiplin durasi: tiga angka untuk seluruh situs

| Kelas | Durasi | Contoh |
| --- | --- | --- |
| Chrome UI | `0.4s` | Inversi nav (borderColor, backgroundColor, color, alpha — semuanya 0.4, tanpa kecuali), breadcrumb alpha, toggle |
| Reveal media | `0.7s` | `clip-path: circle(9px -> 1440px)` masuk dan keluar; alpha video `0.6s` dengan `delay 0.1s` |
| Keluar halaman | `0.3s` | `gsap.to("body", { opacity: 0, duration: .3 })` di `onbeforeunload` |

Semua transisi UI di situs itu memakai angka yang identik. Konsistensi ini yang membuat situs
terasa "satu sistem" meski tiap bab punya ground warna berbeda.

### 5. Reverse ditulis eksplisit, bukan diandalkan otomatis

```js
onEnter:      () => tl.to(divider, { scaleX: 0, duration: 1, transformOrigin: "center right" }),
onEnterBack:  () => tl.to(border,  { scale: 1,  duration: .5 }).to(divider, { scaleX: 1, ... }),
onComplete:        () => gsap.to(word, { y: 0,      overwrite: true }),
onReverseComplete: () => gsap.to(word, { y: "100%", overwrite: true }),
```

Setiap `onComplete` punya pasangan `onReverseComplete`, dan setiap `onEnter` punya `onEnterBack`
dengan urutan tween yang DIBALIK (bukan tween yang sama dijalankan mundur). `overwrite: true`
dipasang di semua tween yang bisa dipicu dua arah. Ini alasan situs tidak pernah "mati" saat user
scroll naik — kelas bug yang persis sama dengan catatan `gsap-scrub-fromto-rule` di memory project.

### 6. Gaya fisika dinormalisasi ke frame time nyata

```js
const scale = 1000 / 60 / engine.timing.lastDelta;      // 1 pada 60fps, >1 saat frame drop
const f = 0.03 * body.mass * scale;
Body.applyForce(body, body.position, { x: (f + rand()*f) * choose([1,-1]), y: -f - rand()*f });
```

Plus koreksi per-platform: `if (windowsMajor >= 13) engine.timing.timeScale = 0.35` — mereka
menguji di Windows 11 dan menemukan mesin fisikanya berjalan terlalu cepat, lalu menuliskannya.
Pelajaran: motion berbasis fisika WAJIB dinormalisasi terhadap `deltaTime` nyata; kalau tidak,
"rasa" berubah antar-mesin dan yang dinilai di review bukan yang dilihat user.

### 7. Input scroll dipakai sebagai sinyal fisika, bukan hanya progres

```js
ScrollTrigger.create({ trigger: rail, start: "top top", end: "100% top",
  onUpdate: self => { engine.gravity.x = -1 * self.direction / 2; } });   // +-0.5
ScrollTrigger.addEventListener("scrollEnd", () => { engine.gravity.x = 0; });
```

`self.direction` (bukan `self.progress`) memiringkan gravitasi, dan `scrollEnd` mengembalikannya
ke nol. Ini penerapan konkret dari "Inertia = State Signal" di bagian atas file ini: yang di-map
adalah **arah dan berhentinya** scroll, bukan posisinya.

### 8. Media adalah state, bukan aset

```js
// reveal selesai -> baru main
gsap.to(video, { alpha: 1, delay: .1, duration: .6, onComplete: () => video.play() });
// keluar -> pause
gsap.to(video, { alpha: 0, duration: .7, onComplete: () => video.pause() });
```

52 elemen `<video>` di satu halaman, nol yang berputar di luar layar. Kecepatan putar juga
diserahkan ke user lewat tombol `data-speed` yang menulis `video.playbackRate`.

### 9. Idle nudge dengan titik jeda yang dipilih

```js
ifvisible.setIdleDuration(4);                     // 4 detik diam
const nudge = gsap.timeline({ repeat: -1, paused: true })
  .to(el, { x: "-1.5%", duration: .4, ease: "none" })
  .to(el, { x: "0%",    duration: .4, ease: "none" })
  .to(el, { x: "1.5%",  duration: .4, ease: "none" })
  .to(el, { x: "0%",    duration: .4, ease: "none" });
ifvisible.on("idle",   () => nudge.restart());
ifvisible.on("wakeup", () => nudge.pause(0.8, false));   // 0.8s = titik x:0, bukan posisi acak
```

Amplitudo 1,5%, periode 1,6s. `pause(0.8)` memilih detik saat elemen tepat di posisi netral —
tanpa itu, kembalinya user menghasilkan lompatan posisi.

### 10. Bridge Lenis yang dipakai

```js
const lenis = new Lenis({ duration: 2, easing: e => Math.min(1, 1.001 - Math.pow(2, -10 * e)),
  smoothWheel: true, wheelMultiplier: 1, smoothTouch: false, infinite: false });
lenis.on("scroll", () => ScrollTrigger.update());
gsap.ticker.add(t => lenis.raf(t * 1000));
ScrollTrigger.scrollerProxy(document.body, { scrollTop(v) { ... }, getBoundingClientRect: () => ({...}) });
ScrollTrigger.defaults({ scroller: document.body });
// mobile: Lenis dimatikan total, diganti ScrollTrigger.normalizeScroll({ allowNestedScroll: true })
```

`duration: 2` dengan kurva expo.out adalah smoothing paling lambat yang masih terasa terkendali di
situs ini; nilai itu bekerja KARENA semua tween di dalamnya `ease: "none"`.
