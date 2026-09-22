---
type: reference
slug: moyra-capsules
title: "Capsules® by Moyra (capsules.moyra.co)"
source_url: https://capsules.moyra.co/
captured: 2026-07-26
awwwards_status: SOTD
category: [product, editorial, experimental]
style: [editorial, swiss, minimalism, cinematic]
fonts: [Host Grotesk]
grid: "Tanpa CSS Grid sama sekali (display:grid = 0). Sistem satuan fluid: prefix @ = px pada design base 1920, dikali vw/1920 (=0.75 @1440, =0.2031 @390). Margin @px-[40] -> 30px kiri+kanan, content band 1380px. Welcome: 2 kolom flex-1 masing-masing 690px, batas tepat 720px = vw/2, gutter 0. Discover: kolom A 559px (@w-[745]) + gutter 141px (@ml-[188]) + kolom B 680px (@max-w-[907]) mulai x=730. Capsules: split-panel 2x709px, gutter @gap-[10] = 7.5px, outer inset 7.5px. Hero: card inset 7.5px + inner padding 22.5px = teks mendarat di x=30 (sama dengan margin section), radius @rounded-[60] -> 45px. Marquee track 8014px, pitch 1325px per unit, keluar viewport kiri -267px. Grid disembunyikan; satu-satunya garis adalah hairline data-row Discover 1.5px (@h-[2]) #F4EFE7 opacity 0.2 dengan fill 40%/80%/60%. Tanpa baseline grid: ritme vertikal dibuat negative margin per tier (@mt-[-130] -> -97.5px pada display, @mt-[-20] -> -15px pada statement)"
grid_type: [swiss, editorial, asymmetric, split-panel, full-bleed]
motion: [scroll-scrub, text-reveal, parallax, morph, cursor-driven]
libraries: [nuxt3, gsap, scrolltrigger, splittext, lenis, mousefollower, google-maps, video ×7]
mood: [serene, luxurious, cinematic]
verdict: "saya suka motionnya, dan suka typography juga grid dan layoutnya"
influence: strengthen
thumb: assets/moyra-capsules-desktop.png
summary: "saya suka motionnya, dan suka typography juga grid dan layoutnya"
typography:
  primary: "Host Grotesk 400 — SATU famili menopang seluruh skala 13.5px sampai 172.5px. Metrik TextMetrics @200px: cap-height 140 (0.700em), x-height 99.2 (0.496em), x:cap = 0.709, ascent 203, descent 63 — neo-grotesque ber-x-height tinggi, metrik identik di semua weight (satu optical size). Desktop @1440: display 172.5px w400 / tracking -3px (-0.0174em) / line-height 150px (0.870), pitch terukur 153px = 0.887; varian multi-baris pakai !leading-[1.2] -> 207px. Statement 75px w400 / -3px (-0.040em) / lh 90px (1.2) atau 72px (0.96). Nav item 89.1px w400 / -3px / lh 106.92px, pitch terukur 91.5px = 1.027. Subhead 36px w500 / -0.15px (-0.0042em) / lh 37.5px (1.042). Small 25.5px w400-600 / -0.15px / lh 28.5px (1.118). Body+label 13.5px w600 / -0.15px (-0.011em) / lh 17.25px (1.278). Rasio display:body 172.5/13.5 = 12.8x"
  secondary: "Mobile @390 BUKAN hasil skala — komponen terpisah dengan px TETAP: display text-[55px] leading-[50px] tracking-[-0.2px] (0.909); statement 35px/lh 42px (1.2); subhead 23px w500-600/lh 26px (1.13); small 20px/lh 22px (1.1); body+label 14px w600/lh 18px tracking -0.2px (1.286). Rasio mobile 55/14 = 3.93x. Margin 20px. scrollHeight 10.433px vs 18.619px desktop"
  label: "Nol monospace. Angka teknis (01/03, 2000 USD / Night, 22m2, 3-5h duration, July 2026) semuanya Host Grotesk sentence case, tanpa tabular-nums, tanpa uppercase ber-tracking positif"
  traits: [single-family-satu-file-woff2, tracking-terkunci-px-bukan-em, leading-dikunci-per-tier, rasio-12.8x, negative-margin-sebagai-leading-optis, tanpa-monospace, mobile-punya-skala-sendiri]
color:
  bg: "#181717"
  mode: dark
  accent: ["#F4EFE7", "#B1A696", "#2A2725", "#332E2B"]
---

> **Fokus capture ini: MOTION + TYPOGRAPHY + GRID + LAYOUT.** Billy menyebut empat dimensi itu
> secara eksplisit di verdict-nya. Angka motion di bawah diekstrak dari chunk terkirim
> (`_nuxt/B6B0VPXw.js` 147.720 karakter, `_nuxt/DSmL5V-B.js` 120.011 karakter), bukan ditebak
> dari tampilan; angka tipografi/grid dari `getComputedStyle` + `TextMetrics` pada situs hidup.

## Apa yang Menarik

Situs konsep hotel kapsul gurun California, dibuat agensi Moyra sebagai showcase kapabilitas
(copy footer verbatim: *"This website is just the concept work done by—Moyra to showcase our
capabilities."*). Menang **SOTD** — badge di DOM menaut ke `awwwards.com/sites/capsules-r`.

Yang membuatnya tidak biasa: **nol canvas, nol WebGL, nol Three.js.**
`document.querySelectorAll('canvas').length === 0`. Seluruh efek dibangun dari `clip-path`,
`transform`, `mix-blend-mode`, dan 7 elemen `<video>` asap ber-`hard-light`. Ini SOTD yang
dimenangkan tanpa satu baris shader pun — relevan langsung untuk pertanyaan "apakah harus
WebGL untuk menang".

Yang kedua: **satu famili, satu file font.** Network hanya memuat
`Host_Grotesk-normal-400-latin.CBa0fl4q.woff2` (20 KB). Hierarki seluruh situs — dari label
13.5px sampai display 172.5px, rasio **12,8x** — dibangun murni dari lompatan ukuran, weight
400/500/600, dan penguncian leading per tier.

Yang ketiga: **sistem satuan fluid berbasis design width 1920.** Prefix `@` pada setiap kelas
(`@text-[230]`, `@px-[40]`, `@rounded-[60]`, `@tracking-[-4]`) adalah nilai px pada mockup
1920, dikalikan `vw/1920` saat render. Terverifikasi: `@text-[230]` menghasilkan **172,5px**
@1440 (faktor 0,75) dan **46,72px** @390 (faktor 0,2031); `@tracking-[-4]` menghasilkan
**-3px** dan **-0,8125px**. Konsekuensinya tracking terkunci dalam **px, bukan em** — nilai em
otomatis berbeda antar tier meski token tracking-nya sama.

## Teknik yang Diidentifikasi

Stack terverifikasi dari `performance.getEntriesByType('resource')` + string-analysis bundle:

| Item | Bukti |
| --- | --- |
| Nuxt (SSG) | `window.__NUXT__`, `/_payload.json`, `_nuxt/builds/meta/*.json` |
| GSAP + ScrollTrigger + SplitText | 119 / 7 / 2 kemunculan di vendor chunk `x5_w19NA.js` (265 KB) |
| Lenis | `<html class="lenis">`, panggilan `lenis.stop() / start() / resize()` di 4 komponen |
| MouseFollower (Cuberto) | node `.mf-cursor` ada di DOM |
| Google Maps JS API | `libraries=places,marker` untuk section Map |
| WebGL / Three.js | **TIDAK ADA** — 0 canvas |
| Font | 1 file `Host_Grotesk-normal-400-latin.woff2`, @nuxt/fonts |

**Teknik inti #1 — read-along wipe per baris (section Welcome).**
`new SplitText(el, { type: "lines,words" })`. Tiap baris digandakan: baris asli diwarnai
`text-darkBrown` **#2A2725** (hanya ~10 nilai luminance di atas ground **#181717**, praktis
hantu), lalu klon identik ber-warna **#F4EFE7** ditumpuk di atasnya dan di-`clip-path`.

```js
gsap.to(clones, {
  clipPath: 'inset(0% 0 0% 0)',       // dari inset(0 0 100% 0)
  stagger: 0.38,
  scrollTrigger: { trigger: textRoot, start: 'top 80%', end: 'bottom 50%', scrub: true },
})
```

State mid-reveal terverifikasi (bukan inferred), 6 baris:

| scrollY | baris 1 | baris 2 | baris 3 | baris 4 | baris 5 | baris 6 |
| --- | --- | --- | --- | --- | --- | --- |
| 500 | 0% | **37,21%** | 100% | 100% | 100% | 100% |
| 650 | 0% | 0% | **38,44%** | 100% | 100% | 100% |
| 800 | 0% | 0% | 0% | **39,69%** | 100% | 100% |
| 950 | 0% | 0% | 0% | 0% | **40,96%** | 100% |

(angka = sisa `inset` bawah; 100% = belum terungkap). Satu baris selesai per ±150px scroll.

**Teknik inti #2 — masked word/char reveal.**
Setelah SplitText, tiap `word` (Choose, Capsules) atau `char` (Gallery) dibungkus manual:

```html
<!-- Choose -->
<span class="relative block translate-y-[-100%] will-change-transform clip-text-choose">…</span>
<!-- Gallery -->
<span class="relative block translate-x-[100%] clip-text-gallery">…</span>
```

parent-nya diberi `relative block overflow-hidden`. Reveal-nya `gsap.to(..., { y: 0 })` /
`{ x: 0 }` di-scrub. Vertikal untuk teks baca, horizontal untuk wordmark.

**Teknik inti #3 — border-radius yang dihitung dari lebar viewport.**
Gallery memakai timeline pinned dengan radius interpolatif, bukan nilai tetap:

```js
gsap.timeline({ scrollTrigger: { trigger, start: 'bottom bottom', end: '200% bottom', scrub: 1, invalidateOnRefresh: true } })
  .to(card, { scale: 1, borderRadius: () => `${(60 / 1920 * window.innerWidth).toFixed(2)}px` })
```

Terukur saat scrub: scrollY 2960 → scale 0,5282 / radius **199px** / lebar 753px · 3050 →
0,5832 / **181px** / 831px · 3200 → 0,6749 / **151px** / 962px · selesai → 1 / **45px** / 1425px.
Radius menyusut seiring kartu membesar, sehingga *sudut fisiknya* terasa konstan.

**Teknik inti #4 — dua layer teks untuk swap (section Capsules).**
`clip-text-capsules1` (statis) + `clip-text-capsules2` (`translate-y-[-105%]`) di panel yang
sama; timeline berlabel `slide2` menukar keduanya sambil panel di-`clipPath` dari
`inset(0% 0% 100% 0%)` ke `inset(0% 0% 0% 0%)`.

**Blend mode** — `hard-light` pada 7 video asap (hero + gallery), `exclusion` pada caption 36px
di Gallery sehingga teks membalik nilainya di atas foto.

## Timing & Feel

Seluruh easing yang dipakai di dua chunk aplikasi:
`power1.inOut` · `power2.inOut` · `power2.out` · `power3.inOut` · `sine.inOut` · `linear` · `none`.
**Tidak ada CustomEase, tidak ada cubic-bezier kustom, tidak ada expo / elastic / back.**
Stagger yang dipakai: `0.001` · `0.01` · `0.04` · `0.05` · `0.38`.
Durasi: `0.1` · `0.3` · `0.4` · `0.5` · `0.6` · `0.9` · `1` · `1.5` · `2` · `25`.
Scrub: `1` dan `true`. Pin: `pin: true` (hanya Gallery).

**Preloader** (scroll dikunci; `lenis.start()` + `lenis.resize()` baru dipanggil di `onComplete`):

| Urutan | Elemen | Dari → ke | Durasi | Easing |
| --- | --- | --- | --- | --- |
| set | path logo SVG | `clipPath: inset(0% 100% 0% 0%)`, `x = lebar path terlebar` | — | — |
| 1 | overlay | opacity → 1 | 0,3s | power2.inOut |
| 2 (label `logo`) | path logo | `inset(0% 0% 0% 0%)` + `x: 0`, **stagger 0,01** | 0,6s | power1.inOut |
| 3 (paralel) | progress bar | width → 50% | 1s | power1.inOut |
| 4 | progress bar | width → 60% | 1s | power2.inOut |
| 5 | progress bar | width → 100% | 0,6s | power2.inOut |
| 6 (label `dissapear`) | path logo | balik ke `inset(0% 100% 0% 0%)`, stagger 0,01 | 0,6s | power1.inOut |
| 7 (paralel) | overlay | opacity → 0 | 0,5s | power2.inOut |
| 8 | curtain | CSS var `--height` → `innerHeight px` | 0,9s | power1.inOut |

**Hero** — intro `gsap.timeline({ delay: 2 })`, dua tween paralel di label `start`:

| Elemen | Dari → ke | Durasi | Easing |
| --- | --- | --- | --- |
| `<img src="/images/cap1.png">` | `scale-[1.2]` → `scale: 1` | 2s | power2.inOut |
| video asap (`mix-blend-hard-light`) | `opacity-0 scale-[1.75]` → `opacity: .6, scale: 1` | 2s | power2.inOut |
| judul + subjudul | wrapper reveal | — | `delay: 2.8` |

Lalu scroll: `scrollTrigger { trigger: #hero, start: 'top top', end: 'bottom top', scrub: 1 }` →
gambar `scale: 1.1` **sine.inOut**, asap `scale: 1.4` **linear**. Dua kecepatan berbeda pada
lapisan yang bertumpuk = parallax tanpa translate.

**Marquee / LogoCarousel** — `gsap.to(track, { x: '-100%', duration: 25, ease: 'linear', repeat: -1 })`.
**25 detik per siklus** (sangat lambat), ditambah parallax
`scrollTrigger { start: '-50% center', end: () => innerHeight/1.5 + 'px center', scrub: 1 }`.

**Menu** — `opacity → 1, duration 0.3, power2.inOut` + ikon burger `rotate: 135` (power1.inOut);
`onStart: lenis.stop()`, `onReverseComplete: lenis.start()`.
**Reservation** — `gsap.set(el, { clipPath: 'circle(0%)' })` → `circle(100%)`, scroll dikunci.

Katalog `start` / `end` ScrollTrigger yang benar-benar dipakai — perhatikan betapa jarang
nilai default muncul: start `top top` · `top 80%` · `top 70%` · `top 65%` · `top bottom` ·
`top+=100% 80%` · `20% bottom` · `20% 90%` · `40% 80%` · `60% center` · `70% 80%` · `80% 80%` ·
`-5% 80%` · `-50% center` · `bottom bottom`; end `bottom top` · `bottom 50%` · `bottom 80%` ·
`bottom center` · `30% 80%` · `40% bottom` · `50% 80%` · `50% bottom` · `60% 40%` ·
`80% bottom` · `200% bottom` · `max`.

Rasanya: **tenang tapi tidak mati.** Yang menghasilkan itu bukan satu efek besar, melainkan
tiga keputusan — (a) semua easing `inOut` sehingga tidak ada yang "menyentak", (b) marquee 25
detik yang nyaris tak terlihat bergerak, (c) `scrub: 1` (bukan `true`) di sebagian besar
timeline, yang menambahkan lag 1 detik sehingga elemen selalu terasa mengejar scroll, bukan
menempel padanya.

## Kenapa Terasa Premium

**Grid.** Satu angka mengatur seluruh situs: margin **30px** (`@px-[40]` pada base 1920).
Teks hero, judul Welcome, kolom Choose, tabel Discover, dan nomor Capsules semuanya mendarat
di x=30 — termasuk hero, yang mencapainya lewat penjumlahan `inset 7,5px + padding 22,5px`.
Tidak ada satu pun blok yang "hampir" sejajar.

**Layout per section berbeda tegas** (padding @1440):

| Section | Struktur | Padding |
| --- | --- | --- |
| Hero | full-bleed card radius 45px, inset 7,5px; wordmark 1030px design menembus tepi ATAS viewport (`overflow-hidden`), judul kiri-bawah, subjudul kanan-bawah = dua titik masuk baca | `7,5px` + `mb 90px` |
| Welcome | dua kolom 690px, batas di vw/2, tanpa gutter | inner `120px / 30px` |
| Choose | display 172,5px penuh 1380px, lalu split 720px: body kiri / pill tag kanan | `52,5px atas / 105px bawah` + `mt 157,5px` |
| Gallery | pinned, kartu di tengah, wordmark ticker LEWAT DI BELAKANG kartu | `0` (h-screen) |
| Capsules | split-panel 709 + 709, gutter 7,5px; panel kiri `#2A2725` polos, panel kanan foto penuh | `0` (h-screen) |
| Discover | kolom A 559px (tabel data) + gutter 141px + kolom B 680px (prosa) | `52,5px / 105px` + `mt 157,5px` |

Tidak ada dua tetangga yang memakai padding sama, dan tidak ada yang memakai `grid-template-columns`.

**Teknik komposisi yang terpakai** (dari daftar yang Billy cari):
- Wordmark menembus tepi viewport — hero, "Capsules®" ter-crop di atas
- Wordmark dipecah blok dan tertutup objek — gallery, "…sules® | Caps…" lewat di belakang kartu
- Angka besar sebagai elemen grafis — counter `01 / 03` dalam lingkaran 39px di sudut kiri-bawah panel
- Hierarki lewat nilai abu pada ukuran sama — Welcome: `#2A2725` vs `#F4EFE7`, ukuran identik 75px
- Dua titik masuk baca — hero kiri-bawah (judul) dan kanan-bawah (subjudul), tanpa satu pun elemen tengah kecuali pill Menu

**Warna.** Lima nilai saja, semuanya hangat: ground `#181717`, panel `#2A2725`, gradient tengah
`#332E2B` (`linear-gradient(#181717, #332E2B, #181717)` di Discover), ink `#F4EFE7`, sekunder
`#B1A696`. **Nol aksen kromatik.** Satu-satunya kroma di layar datang dari fotografi —
matahari terbenam gurun, amber ±`#E08A2E`. Rasio kasar: ground ~55% area · fotografi hangat
~35% · tipografi krem ~10%.

**Measure terukur** — body 36px = **32 karakter** (591px), body 13,5px = **81 karakter**
(559px), subjudul hero 13,5px = **±37 karakter** (256px). Prosa panjang dipegang tier 36px
(32 karakter, sangat pendek), sementara 81 karakter hanya dipakai untuk label pendek satu baris.

**Detail craft yang mudah terlewat:** leading dideklarasikan longgar lalu ditarik rapat dengan
negative margin, bukan dikecilkan langsung. Display `@text-[230] @leading-[200]` = 172,5px/150px,
tiap baris hasil SplitText diberi `@mt-[-130]` (−97,5px) sehingga **pitch terukur 153px = 0,887**.
Alasannya struktural: kotak baris tetap perlu tinggi 251px agar mask `overflow-hidden` punya
ruang untuk `translate-y(-100%)`; yang dirapatkan adalah jarak optisnya. Pola sama di statement
75px (`@mt-[-20]` = −15px) dan nav 89,1px (pitch terukur 91–92px, rata-rata 91,8px = 1,030).

## Section-by-Section

### 1. Hero (`assets/moyra-capsules-desktop.png`)

| Aspek | Detail |
| --- | --- |
| Layout | `<section id="hero" class="@p-[10] h-svh @mb-[120]">` — card full-bleed radius `@rounded-[60]` = 45px, inset 7,5px, margin-bawah 90px. Wordmark SVG `@w-[1030]` (772,5px) di sudut kiri-atas dengan `overflow-hidden` sehingga cap "C" ter-crop tepi viewport. Judul kiri-bawah x=30, subjudul kanan-bawah x=1147 (w 256px), pill "Reserve" kanan-atas, pill "Menu" `@w-[63] @h-[64]` fixed di tengah-bawah `@bottom-[50]` |
| Typography | Judul `@text-[48] font-medium @leading-[50] @tracking-[-0.2]` = 36px w500 / -0,15px / lh 37,5px (1,042), teks "Closer to / Nature—Closer / to Yourself". Subjudul `@text-[18] font-semibold @leading-[23]` = 13,5px w600 / -0,15px / lh 17,25px (1,278). Wordmark = SVG path, bukan teks |
| Motion | **Teramati.** Intro `timeline({delay: 2})`: gambar `scale-[1.2]` → 1 (2s power2.inOut), video asap `opacity-0 scale-[1.75]` → `opacity .6 scale 1` (2s power2.inOut), teks `delay: 2.8`. Scroll `start "top top" end "bottom top" scrub 1`: gambar → `scale 1.1` sine.inOut, asap → `scale 1.4` linear |
| Color | Ground `#181717`; foto gurun senja (amber ±`#E08A2E`) mengisi kartu; ink `#F4EFE7`; video asap `mix-blend-mode: hard-light` opacity 0,6 |
| Konsep | Kapsul sebagai objek tunggal di tengah gurun; wordmark yang ter-crop memberi kesan brand terlalu besar untuk bingkainya |
| Teknik | `mix-blend-mode: hard-light` pada video asap · dual-speed scrub parallax tanpa translate · `overflow-hidden` sebagai alat crop tipografi |

### 2. Welcome — read-along wipe (`assets/moyra-capsules-welcome.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Blok teks tunggal `@py-[160] @px-[40]` = padding 120px/30px, 6 baris, lebar 1200px. Di bawahnya baris dua kolom 690px + 690px berbatas tepat di 720px |
| Typography | 75px w400 / tracking -3px (**-0,040em**) / line-height 90px, tiap baris ditarik `@mt-[-20]` = −15px sehingga pitch optis 75px (ratio 1,0) |
| Motion | **Teramati.** Per-baris `clipPath: inset(0 0 100% 0)` → `inset(0% 0 0% 0)`, `stagger: 0.38`, `scrollTrigger { start "top 80%", end "bottom 50%", scrub: true }`. Sisa inset terverifikasi: 37,21% @500 · 38,44% @650 · 39,69% @800 · 40,96% @950 |
| Color | Baris "belum dibaca" `#2A2725` di atas ground `#181717` (selisih luminance ±10 nilai = praktis hantu); baris terungkap `#F4EFE7` |
| Konsep | Teks yang "menyala saat dibaca" — scroll = tempo membaca |
| Teknik | Dual-layer clone (asli redup + klon terang) yang di-`clip-path`, bukan warna yang di-tween. Ini yang membuat tepi wipe tajam, bukan fade |

### 3. Choose (`assets/moyra-capsules-choose.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Display dua baris memenuhi 1380px, lalu split 720px: kolom kiri prosa 591px, kolom kanan label 13,5px + 6 pill tag dua baris. Padding `52,5px atas / 105px bawah` + margin-atas 157,5px |
| Typography | Display `@text-[230] @leading-[200] @tracking-[-4]` + `!leading-[1.2]` = 172,5px w400 / -3px / lh 207px. Prosa 36px w400 `#B1A696`, measure **32 karakter**. Label 13,5px w600. Pill teks 36px w400/500 |
| Motion | **Teramati (kode).** SplitText `type: "lines,words"`, tiap word dibungkus `translate-y-[-100%] will-change-transform clip-text-choose`, parent `overflow-hidden`, lalu `gsap.to(words, { y: 0, scrollTrigger { start "top 80%" … scrub } })`. Baris diberi `@mt-[-130]` = −97,5px |
| Color | Ground `#181717`, display `#F4EFE7`, prosa `#B1A696`. Pill: 2 dari 6 ber-border+ink `#F4EFE7` (aktif), 4 sisanya `#B1A696` — hierarki lewat nilai abu, bukan warna |
| Konsep | Tiga rumah kapsul disaring lewat enam atribut; pill = filter visual |
| Teknik | Masked word reveal vertikal · pill sebagai token tipografi berukuran display (36px), bukan komponen UI kecil |

### 4. Gallery — pinned scrub (`assets/moyra-capsules-gallery-mid-scrub.png`, `assets/moyra-capsules-gallery.png`)

| Aspek | Detail |
| --- | --- |
| Layout | `h-screen` pinned. Kartu foto di tengah membesar dari 753px ke 1425px; wordmark ticker horizontal melintas **di belakang** kartu sehingga hanya potongan kiri ("…sules®") dan kanan ("Caps…") terlihat. Wordmark hero berubah jadi mark pill mungil di kiri-atas |
| Typography | Wordmark ticker = SVG. Caption `@text-[48]` = 36px w400 absolute kanan. Nama kapsul dispasi manual: "C l a s s i c  C a p s u l e ®" 75px dengan `!@tracking-[-3]` = -2,25px |
| Motion | **Teramati.** `timeline({ scrollTrigger { trigger, start "bottom bottom", end "200% bottom", scrub: 1, invalidateOnRefresh: true } })`; kartu `scale` → 1 dengan `borderRadius: () => 60/1920*innerWidth`. Terukur: 0,5282/199px/753px → 0,5832/181px/831px → 0,6749/151px/962px → 1/45px/1425px. SplitText `type: "chars"`, tiap char `translate-x-[100%]` → 0 |
| Color | Ground gradient `#181717` → `#332E2B`; foto amber; caption `mix-blend-mode: exclusion` sehingga membalik nilai di atas foto |
| Konsep | Kartu tumbuh menelan viewport sementara nama brand mengalir di belakangnya — objek di depan, identitas di belakang |
| Teknik | `borderRadius` proporsional viewport (radius menyusut saat kartu membesar) · char-level horizontal mask reveal · `mix-blend-mode: exclusion` pada teks |

### 5. Capsules — split-panel (`assets/moyra-capsules-capsules.png`)

| Aspek | Detail |
| --- | --- |
| Layout | `flex @p-[10] @gap-[10]` = dua panel **709px + 709px**, gutter 7,5px, outer inset 7,5px, `h-screen`. Panel kiri kosong 80% tingginya: judul menempel di atas (y=30), counter `01 / 03` di lingkaran 39px kiri-bawah, deskripsi 13,5px di bawah-tengah. Panel kanan foto penuh |
| Typography | Judul 36px w500 `#B1A696` (4 baris, measure ±22 karakter). Counter 13,5px. Deskripsi 13,5px w600 `#F4EFE7` |
| Motion | **Teramati (kode).** Panel `clipPath: inset(0% 0% 100% 0%)` → `inset(0% 0% 0% 0%)`; dua layer SplitText `clip-text-capsules1` (statis) + `clip-text-capsules2` (`translate-y-[-105%]`) bertukar pada label timeline `slide2`; foto `scale` di-tween pada label yang sama |
| Color | Panel kiri `#2A2725` polos (satu-satunya panel berwarna solid di situs), panel kanan foto; ground section `#181717` |
| Konsep | Tiga fitur kapsul dibaca sebagai slide bernomor — bukan card grid |
| Teknik | Void internal besar sebagai elemen desain (80% panel kiri sengaja kosong) · panel wipe `clip-path` · dual-layer text swap |

### 6. Discover — tabel data + grid (`assets/moyra-capsules-discover.png`, overlay: `assets/moyra-capsules-grid-overlay.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Display dua baris menembus tepi atas viewport. Di bawahnya: **kolom A 559px** (`@w-[745]`) berisi tabel Easy/Medium/Hard, **gutter 141px** (`@ml-[188]`), **kolom B 680px** (`@max-w-[907]`) berisi prosa. Tiap baris tabel `flex justify-between` — nama kiri, durasi kanan |
| Typography | Display 172,5px w400 / -3px, pitch terukur 153px (**0,887**). Label kolom 13,5px w600. Nama tingkat 25,5px w400 `#B1A696`. Durasi 13,5px rata kanan. Prosa kolom B 36px w400 `#B1A696` |
| Motion | **Teramati (kode).** Display per-kata: "Discover" (x30 w653) + "the" (x733 w246) / "desert" (x30 w484) + "activities" (x564 w661), tiap kata `overflow-hidden` + reveal. Fill hairline `scale-x-[0]` → 1 |
| Color | Ground `linear-gradient(#181717, #332E2B, #181717)`. Hairline track `#F4EFE7` @ opacity 0,2 setinggi `@h-[2]` = **1,5px**; fill `#F4EFE7` opacity 1 dengan lebar **40% / 80% / 60%** |
| Konsep | Tingkat kesulitan aktivitas dibaca sebagai instrumen ukur, bukan daftar |
| Teknik | Hairline bar ganda (track redup + fill terang) sebagai grafik data yang tetap tipografis · `justify-between` sebagai pengganti tabel · satu-satunya garis yang diperlihatkan di seluruh situs |

### 7. Menu overlay (`assets/moyra-capsules-menu.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Overlay `#2A2725` menutupi kiri 1380px; daftar nav 6 item x=38 mulai y=38, pitch **91–92px**; panel foto kanan dengan wordmark ticker melintasinya; ikon sosial 4 lingkaran kiri-bawah; pill "Close" tengah-bawah |
| Typography | Nav 89,1px w400 / -3px / lh 106,92px, pitch terukur 91–92px, rata-rata 91,8px (**1,030**). Disclaimer 13,5px w600 |
| Motion | **Teramati.** `opacity → 1, duration 0.3, pointerEvents "all", power2.inOut`; ikon burger `rotate: 135` power1.inOut (garis jadi silang); `onStart: lenis.stop()`, `onReverseComplete: lenis.start()` |
| Color | Nav item `#B1A696` (bukan `#F4EFE7`) — menu sengaja lebih redup dari konten; foto amber di kanan |
| Konsep | Menu sebagai halaman indeks, bukan dropdown |
| Teknik | Scroll-lock via Lenis · rotasi 135° (bukan 45°) sehingga garis burger melewati posisi silang dan terasa "over-rotate" |

### 8. Mobile (`assets/moyra-capsules-mobile.png`)

| Aspek | Detail |
| --- | --- |
| Layout | **Komponen terpisah, bukan hasil skala.** Hero desktop = teks di ATAS foto; hero mobile = tumpukan editorial: wordmark full-width → judul → subjudul → kartu foto persegi → pill Menu. Margin 20px; section padding `0 20px` / `0 10px`. scrollHeight 10.433px (desktop 18.619px) |
| Typography | px TETAP, bukan `@` fluid: display `text-[55px] leading-[50px] tracking-[-0.2px]` (0,909) · statement 35px/lh 42px · subhead 23px w500–600/lh 26px · small 20px/lh 22px · body+label 14px w600/lh 18px/-0,2px. Rasio display:body **3,93x** |
| Motion | Carousel mobile memakai timing sama: `x: "-100%", duration: 25, linear, repeat: -1` |
| Color | Identik desktop |
| Konsep | Mobile dibangun ulang sebagai halaman baca, bukan desktop yang diperkecil |
| Teknik | Dua pohon komponen terpisah (`MobileFooter.css`, `MobileMenuCarousel`, `TouchDevicesCapsules`) dengan skala tipografi sendiri |

## Kontradiksi terhadap Taste Engine sekarang

Empat temuan berbenturan atau menambah nuansa pada dokumen yang ada. Tidak ada file lain yang
saya ubah — catatan ini hanya melaporkan selisihnya.

**1. Tracking pada tier 60–120px.**
- Klaim lama (`CLAUDE.md` § Hard Constraints — Typography, dan `personal-taste-profile.md`
  baris 315): *"−3px at 120px → −1px at 60px → normal di ≤40px"*.
- Temuan baru: pada **75px**, moyra memakai **−3px = −0,040em** — tiga kali lebih rapat dari
  ambang "−1px at 60px". Sementara pada **172,5px** justru hanya **−3px = −0,0174em**, lebih
  longgar dari median tier 160–299px (−0,03em) di `typography-execution-patterns.md` §1.
- Angkanya: 172,5px → −0,0174em · 89,1px → −0,0337em · 75px → −0,040em · 36px → −0,0042em ·
  13,5px → −0,011em.
- Penyebabnya struktural dan belum tercatat di mana pun: **tracking di situs ini dikunci dalam
  px, bukan em.** Token `@tracking-[-4]` dipakai identik pada `@text-[230]` dan `@text-[100]`,
  sehingga nilai em-nya otomatis berbanding terbalik dengan ukuran. Ini menjelaskan kurva-U di
  `typography-execution-patterns.md` §1 dari sisi implementasi, dan berarti tabel "tracking per
  ambang ukuran" tidak bisa dipakai apa adanya untuk situs yang memakai satuan fluid px.

**2. "Aksen selalu satu warna saturated" tidak berlaku di sini.**
- Klaim lama (`personal-taste-profile.md` § Ground & aksen): *"Aksen selalu satu warna
  saturated: `#FF0000` · `#FF462E` · `#F9452D` · `#0019FF` · `#81FF28`"*, dan `CLAUDE.md`
  § Hard Constraints — Colors: *"BANNED: pastel/muted accents"*.
- Temuan baru: moyra-capsules **tidak punya aksen kromatik sama sekali**. Lima nilai palet
  seluruhnya netral hangat: `#181717` · `#2A2725` · `#332E2B` · `#B1A696` · `#F4EFE7`.
  Saturasi tertinggi di palet token adalah `#B1A696` (S ≈ 15% HSL).
- Kroma satu-satunya berasal dari **fotografi**, bukan token: senja gurun ±`#E08A2E`.
- Artinya: pada referensi yang Billy sukai ini, peran "chromatic event" diambil alih oleh
  konten foto. Aturannya perlu dibaca sebagai *"harus ada sumber kroma yang jelas"*, bukan
  *"harus ada token aksen saturated"*.

**3. Rasio display:body ≥5x tidak dipertahankan lintas breakpoint.**
- Klaim lama (`personal-taste-profile.md` baris 334): syarat single-family adalah *"rasio ≥5x
  antara display dan body dan leading dikunci per tier"*.
- Temuan baru: desktop **12,8x** (172,5 / 13,5) — lolos jauh. Mobile **3,93x** (55 / 14) —
  **di bawah ambang**. Leading tetap dikunci per tier di kedua breakpoint (0,909 / 1,13 / 1,286
  di mobile).
- Ini bukan kegagalan eksekusi: mobile adalah pohon komponen terpisah dengan skala sendiri.
  Yang perlu diperjelas di aturan adalah **rasio itu diukur di breakpoint mana**.

**4. Gap "easing dan durasi belum diukur" — sebagian terisi.**
- `typography-execution-patterns.md` § Yang masih belum diketahui menyatakan: *"Easing dan
  durasi belum diukur untuk batch mana pun. Semua catatan motion di library masih berupa daftar
  library terdeteksi, bukan angka timing."*
- Note ini menyediakan angka lengkap dari bundle terkirim: 7 easing (`power1.inOut`,
  `power2.inOut`, `power2.out`, `power3.inOut`, `sine.inOut`, `linear`, `none`), 5 nilai stagger
  (0,001 / 0,01 / 0,04 / 0,05 / 0,38), 10 nilai durasi (0,1 s/d 25s), 2 mode scrub (1 dan true),
  dan 27 pasangan `start`/`end` ScrollTrigger.
- Temuan yang menonjol untuk dibandingkan nanti: **nol CustomEase dan nol cubic-bezier kustom**
  pada situs SOTD ini — seluruh feel dihasilkan dari easing bawaan GSAP plus pilihan `scrub: 1`.

**Konfirmasi (bukan kontradiksi), untuk kelengkapan:**
- Leading per tier `CLAUDE.md` (display 0,85 · statement 1,0 · body 1,3) → terukur **0,887 /
  1,042 / 1,278**. Cocok bertiga.
- Single-family DIIZINKAN (revisi 2026-07-26) → dikonfirmasi kuat: satu famili, satu file
  woff2, SOTD.
- Larangan monospace → dikonfirmasi bisa dijalankan penuh: nol mono, termasuk pada counter
  `01/03`, harga `2000 USD / Night`, luas `22m2`, dan durasi `3-5h`.
- Weight ringan pada ukuran besar (`typography-execution-patterns.md` §10) → display 172,5px
  memakai weight **400**.
- Larangan 3-column card grid → dihindari total: tidak ada `display: grid` sama sekali di
  seluruh dokumen.
