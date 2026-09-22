---
type: reference
slug: zajno-motion
title: "motion.ed by Zajno (motion.zajno.com)"
source_url: https://motion.zajno.com/
captured: 2026-07-26
awwwards_status: SOTD
category: [editorial, agency, experimental]
style: [swiss, editorial, kinetic-type, minimalism, experimental]
fonts: [PP Neue Machina Plain, PP Neue Machina Inktrap, Magilio]
grid: "Gutter chrome 34px (logo/menu/sound pill flush ke 4 sudut); kolom editorial inset 133px (lebar 1174px = 3 x 391.34px, gap 0); display h3 full-bleed x=0 w=1440; marquee 215px meluber ke 2816px (196% viewport); rail interactive 2292px digeser -852px horizontal; root font-size fluid 6.94444vw desktop (=100px @1440) / 26.6667vw mobile (=104px @390)"
grid_type: [swiss, editorial, full-bleed, edge-anchored]
motion: [scroll-scrub, text-reveal, morph, parallax, cursor-driven, page-transition]
libraries: [gsap, scrolltrigger, motionpath, customease, observer, lenis, matter-js, lottie, webflow, jquery, splide]
mood: [kinetic, clinical, playful]
verdict: "saya suka motionnya"
influence: new
thumb: assets/zajno-motion-desktop.png
summary: "saya suka motionnya"
typography:
  primary: "PP Neue Machina Plain 400 — satu weight menopang seluruh skala 14px sampai 215px. Display 215px/-8.99999px/lh 220px (tracking -0.042em, leading 1.02); 195px/-8.6px; 160px/-6.4px/lh 170px; 140px/-5px/lh 144px; 74px/-3px/lh 80px; 64px w300/-0.7px/lh 64px. Body PP Neue Machina Inktrap 400 18px/lh 32px (1.78) dan 16px/-0.48px/lh 28px (1.75). Label 14px/lh 20px. Aksen serif Magilio 400: 115px/-2px/lh 126px dan 34px/lh 37px (dipakai HANYA 3 kali di seluruh situs)"
  traits: [single-family-dual-cut, inktrap-untuk-body, serif-aksen-langka, rasio-display-body-13.4x, tanpa-monospace]
color:
  bg: "#0C0B0B"
  mode: dark
  accent: ["#FDFCFA", "#C8CFE8", "#D2C8E8", "#E4E8C8", "#C8E8E8", "#E8C8E5", "#E8C8C8", "#D6E8C8", "#C2D5D7"]
---

> **Fokus capture ini: MOTION.** Billy mengirim link ini dengan verdict "saya suka motionnya".
> Isi situsnya sendiri adalah kurikulum motion design (8 bab teknik) — konten teksnya sudah
> diserap ke `../motion-principles.md` § "Zajno motion.ed" dan `../motion-architecture.md`
> § "Scrub-first architecture".

## Apa yang Menarik

Situs ini adalah **dokumentasi motion yang mendemonstrasikan dirinya sendiri**: setiap bab
menjelaskan satu teknik (easing, delay, fade, morph, masking, dimension, parallax, zoom) dan
mekanik scroll bab itu MEMAKAI teknik yang sedang dijelaskan. Halaman total 64.670px tinggi
dengan 44 instance ScrollTrigger, 52 elemen `<video>`, 35 animasi Lottie, dan 1 canvas Matter.js.

Hero-nya kosong secara sengaja: satu bola putih 18px duduk di atas garis hairline horizontal
selebar viewport, dengan lead 28px/lh 44px di bawahnya. Tidak ada masthead. Bola itulah subjek
situs — ia lalu menempuh SVG path sepanjang 4916,91 unit melewati seluruh section introduction,
dan setiap kali melewati satu pill kata ("It also" -> "controls" -> "your" -> "attention"), kata
itu ter-reveal dengan mask `y: 100% -> 0`. Narasi dibawa oleh SATU objek yang tidak pernah
menghilang.

Dua ground bergantian: `#0C0B0B` (hero, introduction, techniques) dan `#FDFCFA` (interactive,
resources). Delapan bab teknik masing-masing punya ground pastel sendiri (`#C8CFE8` easing ->
`#C2D5D7` zoom), dan **warna pill logo + menu + sound ikut berubah** ke warna bab aktif lewat
tiga fungsi (`nav-dark` / `nav-light` / `nav-color`) yang semuanya bertransisi dengan durasi
seragam 0,4s.

## Teknik yang Diidentifikasi

Stack terverifikasi dari `performance.getEntriesByType('resource')` — bukan tebakan:
Webflow + jQuery 3.5.1 + GSAP 3.10.4 (ScrollTrigger 3.10.4, CustomEase 3.10.4,
MotionPathPlugin 3.11.4, Observer 3.11.4) + Lenis (studio-freight bundled) +
Matter.js 0.18.0 + Splide 2.4.21 + Lottie (Webflow runtime) + Finsweet autovideo.
**Nol WebGL, nol Three.js** — `document.querySelectorAll('canvas')` hanya mengembalikan satu
canvas 2D milik Matter.js. Seluruh kesan "mahal" dibangun dari DOM + SVG + `clip-path` + video.

Script kustom: `https://cdn.zajno.com/dev/motion/script.v33.min.js` (25.488 byte).
Angka-angka di bawah dibaca langsung dari bundle itu dan diverifikasi ulang lewat
`ScrollTrigger.getAll()` di browser.

### 1. Lenis + ScrollTrigger scrollerProxy pada `document.body`
```js
new Lenis({ duration: 2, easing: e => Math.min(1, 1.001 - Math.pow(2, -10 * e)),
  smoothWheel: true, wheelMultiplier: 1, smoothTouch: false, infinite: false })
```
`duration: 2` (2 detik settle) dengan kurva expo.out. Bridge: `lenis.on('scroll', ScrollTrigger.update)`
+ `gsap.ticker.add(raf)` + `ScrollTrigger.scrollerProxy(document.body, ...)` +
`ScrollTrigger.defaults({ scroller: document.body })`. Di mobile Lenis DIMATIKAN, diganti
`ScrollTrigger.normalizeScroll({ allowNestedScroll: true })`.

### 2. Timeline ber-satuan proporsional, `ease: "none"` di mana-mana
37 dari 40 deklarasi `ease` eksplisit memakai `"none"` (plus 4 blok `defaults:{ease:"none"}`). Itu bukan kemalasan — semua tween itu **scrubbed**,
jadi easing datang dari kurva Lenis, bukan dari tween. Durasi dipakai sebagai **bobot relatif**,
bukan detik: `defaults: { ease: "none" }` lalu segmen 4 / 7 / 18 / 14 / 27. Konsekuensinya panjang
scroll tiap segmen = bobotnya dibagi total bobot, dan responsif dihitung ulang dari lebar viewport
(`d = vw*0.75 + vw*slides*0.75 + vw*slides*0.5 + vw*0.25`, desktop; faktor 0.75 jadi 1 di <=991px;
dikali 3 di mobile).

### 3. MotionPath 5 segmen dengan breakpoint progres per-breakpoint
```js
const stops = { desktop: [.1477, .43367, .61329, 1],
                tablet:  [.12336, .37553, .53228, 1],
                mobile:  [.13847, .348, .5061, 1] };
// setiap segmen: motionPath { path, align: path, alignOrigin: [.5,.5], curviness: 2,
//                             start: prev, end: next, immediateRender: true }
```
Bobot durasi 4 -> 7 -> 18 -> 14 -> 27: bagian tengah jalur (bobot 18 & 27) sengaja dibuat lambat
per-piksel-scroll sehingga bola *melambat* di tikungan panjang tanpa satupun easing curve.

### 4. Dua CustomEase signature (satu-satunya easing non-linear di situs)
```js
CustomEase.create("bounce",      "M0,0 C0.05222,-0.59802 0.31828,-1.38625 0.55039,0 0.65208,-0.78892 0.94566,-0.58262 1,1")
CustomEase.create("bounceSmall", "M0,0,C0.052,-0.598,0.246,-0.72,0.336,0,0.498,-0.502,0.792,-0.482,1,1")
```
Keduanya undershoot ke NEGATIF (turun ke -1.386 dan -0.72 sebelum naik) — bola "ditarik ke bawah"
dulu sebelum melompat. `bounce` dipakai sekali (duration 8, jatuh sejauh `d` px di akhir hero),
`bounceSmall` sekali (duration 0.7, mendarat di antar-section).

### 5. Reveal video via `clip-path: circle()` — bukan opacity
```js
// masuk
gsap.to(slide, { clipPath: `circle(${Math.max(vh, vw)}px at 50% 50%)`, duration: .7, ease: "none" });
gsap.to(video, { alpha: 1, delay: .1, duration: .6, ease: "none", onComplete: () => video.play() });
// keluar
gsap.to(slide, { clipPath: "circle(0.09rem at 50% 50%)", duration: .7, ease: "none" });
gsap.to(video, { alpha: 0, duration: .7, ease: "none", onComplete: () => video.pause() });
```
Radius kolaps `0.09rem` = **9px** pada root 100px. Video di-`play()` hanya setelah reveal selesai
dan di-`pause()` saat keluar — 52 video, tidak ada yang berputar di luar layar.

### 6. Fisika Matter.js yang gravitasinya digerakkan ARAH SCROLL
```js
engine.gravity.y = 1; engine.gravity.x = 0; engine.gravity.scale = 0.0025;
ScrollTrigger.create({ trigger: ".height-section.is-interactive", start: "top top", end: "100% top",
  onUpdate: self => { engine.gravity.x = -1 * self.direction / 2; } });   // +-0.5
ScrollTrigger.addEventListener("scrollEnd", () => { engine.gravity.x = 0; });
```
15 + 20 = 35 `Bodies.circle`, radius `canvasWidth/15`, `restitution 0.5`, `density 0.05`,
`collisionFilter` dua kategori (3/mask 3 dan 4/mask 5). 32 dinding statis disusun radial
(`angle = i/32 * 2PI + segment/2`, rect `0.01*w` x `0.4*w`) membentuk mangkuk lingkaran;
canvas di-`clip-path: circle(50%)`. `MouseConstraint` stiffness `0.2`. Hover mengusir bola:
`applyForce(body, pos, { x: (f + rand*f) * choose([1,-1]), y: -f - rand*f })` dengan
`f = 0.03 * mass * (1000/60/lastDelta)` — normalisasi terhadap frame time nyata.
Windows 11 (`platformVersion >= 13`) diberi `engine.timing.timeScale = 0.35` karena mesin fisika
berjalan terlalu cepat di sana.
Suara tabrakan hanya diputar bila penetrasi tabrakan > 1.5, volume `min(1, penetrasi/10)`,
maksimum 2 kanal serentak, cooldown acak 100-400ms.
**Sisi kanan yang berlabel "Not real-time" BUKAN fisika** — itu Lottie `not_real_time.json`.
Situs mendemonstrasikan perbedaan real-time vs pre-rendered dengan dua implementasi berbeda
yang terlihat identik.

### 7. Idle nudge setelah 4 detik diam
```js
ifvisible.setIdleDuration(4);
const nudge = gsap.timeline({ repeat: -1, paused: true })
  .to(".ui-slide", { x: "-1.5%", duration: .4, ease: "none" })
  .to(".ui-slide", { x: "0%",    duration: .4, ease: "none" })
  .to(".ui-slide", { x: "1.5%",  duration: .4, ease: "none" })
  .to(".ui-slide", { x: "0%",    duration: .4, ease: "none" });
ifvisible.on("idle",   () => nudge.restart());
ifvisible.on("wakeup", () => nudge.pause(0.8, false));   // pause DI titik netral, bukan di tempat
```
Amplitudo hanya 1,5% dan periode 1,6s. `pause(0.8)` memilih posisi netral supaya tidak ada
lompatan saat user kembali aktif.

### 8. Nav yang menginversi warna dengan durasi seragam 0,4s
`nav-dark` / `nav-light` / `nav-color` dipasang lewat pasangan ScrollTrigger:
`start: "top+=Xpx top+=1px"` untuk logo dan `start: "top+=Xpx bottom-=90px"` untuk tombol sound
(dua ambang berbeda karena elemennya berada di dua ujung layar). SEMUA properti — `borderColor`,
`backgroundColor`, `color`, `alpha` — memakai `duration: 0.4` tanpa kecuali. Pada `nav-color`,
warna diambil runtime dari `getComputedStyle(breadcrumbItem).backgroundColor`, jadi menambah bab
baru tidak butuh kode baru.

### 9. Nav overlay: wheel vertikal diterjemahkan jadi scroll horizontal
```js
navMenu.addEventListener("wheel", e => { e.preventDefault(); e.stopPropagation();
  navTrack.scrollLeft += deltaX + deltaY; });        // Firefox: delta < 10 dikali 10
```

### 10. Page exit
`window.onbeforeunload` -> `gsap.to("body", { opacity: 0, duration: .3 })` + `scrollTo(0,0)`;
`pageshow` dengan `event.persisted` -> `location.reload()` (bfcache dimatikan supaya scroll state
tidak korup). Section resources memakai `scrub: 3` — smoothing 3 detik, tiga kali lebih berat
daripada `scrub: 1` di section lain.

## Timing & Feel

Teramati langsung di browser (scroll bertahap 60-120px per langkah, bukan lompat):

| Momen | Angka terverifikasi |
| --- | --- |
| Lenis settle | `duration: 2`, easing `1.001 - 2^(-10t)` |
| Section pinned #1 (`.ui.first`) | scroll 5967 -> 12807 = **6840px**, `scrub: true`, `pin: true`, `anticipatePin: 1` |
| Section pinned #2 (`.ui`) | 13707 -> 20547 = **6840px**, parameter identik |
| Intro MotionPath | 2120 -> 5967 = **3847px**, `scrub: 1` |
| Rail interactive | 21912 -> 22764 = **852px** (= scrollWidth 2292 - vw 1440), `ease: "sine.out"`, `scrub: 1`, pin |
| Resources | pin, `scrub: 3`, panjang = `1.5*vw + (scrollWidth - vw) + listsHeight` |
| Ball follow scroll | `gsap.to(ball, { y, ease: "none", duration: .02 })` per `onUpdate` — lag 20ms |
| Transisi bola antar-section | y `duration .45` -> x `duration .7` (`+= 0.375*vw`) -> y `duration .7 ease "bounceSmall"` (parallel `"<"`) |
| Reveal/kolaps video | `.7` masuk, `.7` keluar; alpha video `.6` dengan `delay .1` |
| Inversi nav | `.4` untuk semua properti |
| Fade keluar halaman | `.3` |
| Stagger panah resources | `stagger = a/4` di mana `a = parseInt(1.5*vw / total * 100)` — seperempat durasi elemen itu sendiri |

Kualitas yang membuatnya terasa berbeda: **tidak ada satu pun easing "cantik" di jalur scroll**.
Semua rasa datang dari (a) kurva Lenis, (b) bobot durasi yang tidak rata di dalam timeline
scrubbed, (c) `scrub` yang berbeda per section (`true` / `1` / `3`). Bounce hanya muncul 2 kali
di seluruh situs, keduanya pada momen "mendarat".

## Kenapa Terasa Premium

1. **Satu objek membawa seluruh narasi.** Bola 18px yang sama muncul di hero, menempuh MotionPath
   3847px, jadi penanda posisi di section pinned, lalu mendarat dengan `bounce`. Kontinuitas
   subjek mengalahkan variasi efek.
2. **Motion diverifikasi terhadap frame time nyata**, bukan diasumsikan: gaya repel Matter.js
   dinormalisasi `1000/60/lastDelta`, dan Windows 11 diberi `timeScale 0.35` — mereka menguji di
   mesin yang berbeda dan menuliskan perbaikannya.
3. **Disiplin durasi**. Hampir semua transisi UI = `0.4s`, reveal media = `0.7s`, keluar halaman =
   `0.3s`. Tiga angka untuk seluruh situs.
4. **Video diperlakukan sebagai state, bukan aset**: `play()` setelah reveal, `pause()` saat keluar,
   dengan `playbackRate` bisa diubah user lewat tombol `data-speed`.
5. **Warna sebagai penanda bab, bukan dekorasi**: 8 ground pastel + inversi nav otomatis
   dari `getComputedStyle` breadcrumb.
6. **Satu famili tipografi (dua cut) menopang 14px-215px** — rasio display:body 13,4x. Body memakai
   cut Inktrap (ink trap terlihat di ukuran kecil), display memakai cut Plain. Serif Magilio muncul
   3 kali saja, sebagai tanda kutip editorial.
7. **Nol WebGL.** Semua ini DOM, SVG, `clip-path`, video, dan satu canvas 2D. Bukti bahwa "mahal"
   adalah soal koreografi, bukan soal shader.

## Yang TIDAK Cocok untuk Portfolio Billy

- Ground pastel per-bab (`#C8CFE8` dst) adalah sistem pedagogis, bukan palet brand. Jangan disalin.
- Situs ini bergantung pada 52 video demo pihak ketiga (Dribbble shots) — kalau videonya dihapus,
  yang tersisa tinggal tipografi dan bola. Untuk Billy, aturan "hapus videonya, harus masih ada
  karya" tetap berlaku.
- Panjang 64.670px = ~72 viewport. Itu skala kurikulum, bukan skala portofolio.

## Section-by-Section

### 1. Hero (`assets/zajno-motion-desktop.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Simetris ekstrem: hairline 1px selebar 1440px di y=450, lingkaran outline 100px + bola isi 18px tepat di tengahnya; lead 2 baris ter-center di y=650; chrome pill di 4 sudut dengan gutter 34px. Nol masthead, nol CTA |
| Typography | PP Neue Machina Plain 400, 28px / lh 44px (1.57) / tracking normal, `#FDFCFA`. Label pill 16px/-0.5px |
| Motion | Idle: bola diam. Scroll: divider kiri & kanan `scaleX: 1 -> 0` `duration 1` dengan `transformOrigin` "center right"/"center left" (dua tween, `"<"` sejajar), lalu `.anim-ball-border` `scale: 1 -> 0` `duration .5`. Pupil logo mengikuti kursor (Lottie `header_logo_big_pupils.json`) |
| Color | Ground `#0C0B0B`, ink `#FDFCFA`, hairline `#FDFCFA` alpha rendah. Nol aksen |
| Konsep | Bola = "objek yang akan dianimasikan". Garis = timeline. Hero adalah *keadaan awal* sebuah demo, bukan poster |
| Teknik | Lottie eye-tracking, `scaleX` divider dengan transform-origin berlawanan, GSAP ScrollTrigger `onEnter`/`onEnterBack` simetris (reverse ditulis eksplisit, bukan mengandalkan auto-reverse) |

### 2. Introduction — MotionPath journey (`assets/zajno-motion-introduction.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Broken grid: SVG path hairline putih memenuhi viewport sebagai "rel"; pill kata diletakkan di titik-titik tetap sepanjang rel dengan rotasi berbeda-beda. Tinggi section 18.877px |
| Typography | Kata di pill: PP Neue Machina Plain **300** 64px / -0.7px / lh 64px (leading 1.0) — satu-satunya tempat weight 300 dipakai. Statement di sekitarnya `h3` 140px / -5px / lh 144px |
| Motion | `motionPath` 5 segmen, `curviness: 2`, `alignOrigin: [.5,.5]`, bobot durasi 4/7/18/14/27, breakpoint progres `[.1477, .43367, .61329, 1]` (desktop). Setiap `onComplete` memicu `gsap.to(word, { y: 0 })` dan `onReverseComplete` mengembalikan `y: "100%"` — reveal mask dua arah. Trigger `.intro-wrap` `start "top center"` `end "bottom+=textHeight/2 center"` `scrub: 1` (3847px) |
| Color | Ground `#0C0B0B`, rel hairline `#FDFCFA` ~0.4, pill `#FDFCFA` solid dengan ink `#0C0B0B` |
| Konsep | Kalimat "It also controls your attention" dibaca oleh bola, bukan oleh mata — literal demonstrasi dari kalimatnya sendiri |
| Teknik | GSAP MotionPathPlugin di atas `<path>` SVG panjang 4916,91 unit; mask-reveal `y: 100% -> 0` per kata; path berbeda per breakpoint (`#vrtx` / `#vrtx-tablet` / `#vrtx-mobile`) |

### 3. UI showcase — rail video pinned (`assets/zajno-motion-ui-showcase.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Split asimetris saat transisi: panel gelap 25vw (360px) di kiri menahan bola, panel terang 75vw (1080px) di kanan berisi video ber-chrome browser. Caption ter-center di bawah video |
| Typography | Caption PP Neue Machina Inktrap 400 18px / lh 32px (1.78), `#0C0B0B` di atas terang |
| Motion | Pinned 6840px, `scrub: true`, `anticipatePin: 1`. `.ui-track` `x: -75vw` (desktop) / `-100vw` (mobile) bobot 4; `.ui-slide` `width: 25vw -> 75vw` bobot 4 dengan offset per slide `8*i`; reveal `clip-path: circle(9px -> 1440px at 50% 50%)` `duration .7`; `.ui-text` `fromTo` clipPath polygon (mobile: `0 100% -> 0 0`); bola mengikuti scroll dengan `duration .02` |
| Color | Dua ground berdampingan dalam satu layar: `#0C0B0B` dan `#FDFCFA` — pergantian ritme terjadi HORIZONTAL, bukan vertikal |
| Konsep | Contoh nyata dari klaim di section sebelumnya; browser-chrome frame menandai "ini situs orang lain", bukan karya Zajno |
| Teknik | Pin + horizontal track + `clip-path: circle()` reveal + kontrol `video.play()/pause()` per-slide + tombol `data-speed` yang mengubah `video.playbackRate` |

### 4. Interactive — Matter.js vs Lottie (`assets/zajno-motion-interactive.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Rail horizontal 2292px digeser -852px; dua lingkaran outline berdiameter ~568px berdampingan, label ter-center di dalam masing-masing. Ground terang, padding-top section 295px |
| Typography | Label `p3-bold` PP Neue Machina Inktrap **700** 16px / lh 24px / -0.3px — satu-satunya pemakaian weight 700. Judul section `h2` 160px / -6.4px / lh 170px, x=186 w=1068 |
| Motion | `gsap.to(".height-section.is-interactive", { x: -852, ease: "sine.out", scrollTrigger: { pin: true, anticipatePin: 1, scrub: 1 } })`. Di dalamnya fisika real-time: `gravity.y 1`, `gravity.scale 0.0025`, `gravity.x = -direction/2` (dikembalikan 0 saat `scrollEnd`), repel `0.03*mass*(1000/60/lastDelta)` pada hover, drag `MouseConstraint stiffness 0.2` |
| Color | Ground `#FDFCFA`, bola `fill #0C0B0B` `stroke white` lineWidth 2 (grup 15) / 1 (grup 20). Chrome nav ikut membalik ke light |
| Konsep | Definisi "real-time vs not real-time" dibuktikan alih-alih dijelaskan: kiri bisa didorong, kanan hanya memutar rekaman |
| Teknik | Matter.js 0.18.0 (35 body, 32 peg statis radial, `clip-path: circle(50%)`) berdampingan dengan Lottie `not_real_time.json`; audio tabrakan WebAudio dengan `panner` mengikuti posisi-x tumbukan, threshold penetrasi 1.5 |

### 5. Bab teknik — the basics of easing (`assets/zajno-motion-easing-chapter.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Dua kolom tidak setara: nomor bab + judul kiri (x=250, lebar ~440px), paragraf definisi kanan (x=820, lebar ~477px). Di bawahnya carousel kartu lingkaran diameter ~344px dengan tombol panah lingkaran 80px flush di tepi kiri/kanan. Deskripsi kartu aktif turun ke bawah lewat garis leader vertikal |
| Typography | Judul bab `h4` PP Neue Machina Plain 400 140px / -5px / lh 144px; paragraf Inktrap 400 18px / lh 32px; label kartu Inktrap 16px (aktif = underline); marquee `LET'S LOOK AT AN EXAMPLE` 215px / -8.99999px / lh 220px melebar 2816px (196% viewport) |
| Motion | Ground bab masuk lewat perubahan `nav-color` -> semua chrome ber-transisi `duration .4` ke `#C8CFE8`; breadcrumb pill "the basics of easing" muncul di samping logo (`alpha` `.4`). Tiap kartu memutar grafik x/t dengan titik yang menempuh kurvanya sendiri (Lottie per easing: `linear.json`, `ease.json`, `ease_in.json`, `ease_out.json`, `cubic.json` — file yang sama dimuat 2x untuk kartu + demo) |
| Color | Ground `#C8CFE8`, ink `#0C0B0B`, sumbu grafik biru muda. Ikon suara mewarisi warna ground bab |
| Konsep | Ajarkan easing dengan menunjukkan kurvanya DAN gerakannya berdampingan; perbandingan 3 kolom "Missing easing & delay / Correct easing / Correct delay & animation" (grid 3 x 391,336px, gap 0) |
| Teknik | Carousel per-bab, Lottie kurva easing, marquee overflow horizontal, sistem `nav-color` yang membaca warna dari `getComputedStyle` breadcrumb sehingga bab baru = nol kode baru |

### 6. Resources (`assets/zajno-motion-resources.png`, mid-animasi: `assets/zajno-motion-resources-arrows.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Rail horizontal: kolom kiri berisi 3 panah besar bertumpuk + kutipan serif vertikal (rotate 90deg); tengah kartu preview `border-radius` besar; kanan daftar 10 courses + 4 sources dengan hairline separator, judul "COURSES" 74px |
| Typography | Kutipan Magilio 400 34px / lh 37px vertikal ("YOU ARE ALWAYS A STUDENT, NEVER A MASTER"); judul kategori PP Neue Machina Plain 74px / -3px / lh 80px; item daftar Inktrap 18px / lh 32px |
| Motion | Pin dengan `scrub: 3` (paling berat di situs). Timeline 3 segmen berbobot persen: panah `x: 0.84*vw` bobot `a` dengan `stagger: a/4`; `.resources-track` `x: -(scrollWidth - vw)` bobot `s`; `.resources-lists` `yPercent: -100` bobot `l`; `onUpdate` menyorot header kategori dengan membandingkan `getBoundingClientRect()` header vs tiap list |
| Color | Ground `#FDFCFA`, ink `#0C0B0B`. Chrome membalik ke `nav-light` |
| Konsep | Bab penutup = "kamu selalu murid" — daftar bacaan diletakkan sebagai bagian kurikulum, bukan footer link |
| Teknik | Pin + rail horizontal + list vertikal DALAM satu timeline (tiga sumbu gerak berurutan); hover item merotasi kartu preview `rotate(0 -> -3 -> -6deg)` dengan maksimum 3 gambar aktif dan `z-index` naik tiap hover |

## Catatan Verifikasi

- Screenshot diambil dengan Playwright pada viewport CSS **1440x900** (desktop) dan **390x844**
  (mobile) — lebar CSS benar, tetapi `devicePixelRatio` browser = **1**, jadi berkas PNG 1440x900
  dan 390x844, bukan 2x/3x seperti standar `SCHEMA.md`. Semua angka tipografi diukur pada lebar
  CSS yang benar, jadi tidak ada risiko salah-ukur seperti kasus quantumbody.
- Chrome DevTools MCP tidak bisa dipakai pada sesi ini (profil `chrome-devtools-mcp` sudah dikunci
  instance lain), sehingga `emulate` dengan DPR tidak tersedia.
- Situs adalah SPA satu halaman: seluruh 8 bab + resources ada di `/`; tidak ada subhalaman
  (`a[href]` internal hanya `#hero #easing #delay #fade #morph #masking #dimension #parallax #zoom #resources`).
- Inkonsistensi internal yang terlihat: menu menamai bab ke-6 **"scale"**, sementara heading dan
  `id` section menyebutnya **"DIMENSION"**.
