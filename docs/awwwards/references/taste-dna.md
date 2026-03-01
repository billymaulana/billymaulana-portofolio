# Taste DNA — Billy Maulana

Living document. Berkembang setiap kali user memberikan reference baru, feedback, atau preferensi.

**Terakhir diupdate**: 2026-02-28 (48 new Framer partials added, pattern summary updated, taste profile expanded with text blending + hologram cursor + marquee footer patterns)

---
## Preferensi yang Teridentifikasi

### Dari Feedback Langsung
- **Anti-monoton**: variasi antar section penting — setiap section harus punya identitas visual sendiri
- **Anti-AI slop**: hasil harus terasa human-crafted, bukan generated. Planned imperfection > algorithmic perfection
- **Anti-checklist**: desain bukan soal centang requirement. Desain soal FEEL dan TASTE

### Dari Pilihan Referensi (7 Artikel Codrops)
User memilih studi tentang:
- Jason Bergh: cinematic, analog grit, camera-metaphor interaction
- 1820 Productions: minimal tapi penuh craft, motion sebagai material
- Serhii Polyvanyi: blending modes, chaos-with-rhythm, analog tech aesthetic
- Exo Ape: atmospheric, narrative, sensory
- Vladyslav Penev: production-quality motion systems
- Naked City Films: brutalist, perpetual motion, CRT aesthetic
- Daniele Buffa: bespoke, rule-breaking

**Pattern yang muncul**: preferensi ke dark/cinematic/atmospheric aesthetic dengan motion yang purposeful. Suka teknik yang terasa analog/physical (film grain, CRT, garis persistent). Tidak suka yang bersih/sterile/corporate.

---

## Taste Profile

### Atmosphere: Dark Cinematic
- Deep darks (bukan pure black)
- Warm accents (cream, amber tones) DAN cool accents (electric blue, cyan)
- Noise/grain texture
- Blending modes untuk depth
- Atmospheric glow (radial gradients, fluid color bleed)

### Motion: Purposeful Physics
- Inertia-driven (bukan position-only)
- Layered speeds (parallax depth)
- Persistent elements antar navigasi
- Planned imperfection dalam timing
- **Fluid simulation** — real physics (Navier-Stokes), bukan fake sine waves
- **Velocity-driven color** — warna respons terhadap ARAH gerakan, bukan random
- **Blur-to-sharp reveal** — per-char blur(10px) → blur(0px) scrubbed to scroll (art-yakushev.com)
- **Text shuffle on hover** — per-char random shuffle selama 400ms lalu reset (art-yakushev.com)
- **Stagger link hover** — yPercent slide -96% dengan expo.inOut, stagger 0.011s (art-yakushev.com)
- **Scroll-scrubbed section morphing** — satu pinned timeline 1300% viewport, clip-path circle() expand/collapse antar section, logo scale 20x + rotate 45deg sebagai transition. Seluruh page = satu continuous scroll narrative (skizophonic.com)
- **Concentric circle morphing** — SVG circles B&W dengan staggered scale + yoyo + back easing menciptakan breathing/pulsating organic motion (skizophonic.com)
- **Glitch as brutalist texture** — 3-layer CSS clip-path polygon animation, RGB channel colors (#ff0047, #00ffc7, gray), translate offset + scale3d(-1,-1,1) inversion. Controlled chaos with `steps(1)` rotation (skizophonic.com)
- **CustomEase intro choreography** — counter 000→100 (3-digit columns, y: -90%), SVG drawSVG circles drawn on, gradient orb scale 0.25→1, all orchestrated with two bespoke cubic bezier CustomEase curves over ~7s sequence (kaitonote.com)
- **Scroll-scrubbed circle shrink + work scatter** — pinned section: circles/gradient scale→0 (power3.in) sementara work images scatter outward via x/y/z positioning (expo.out), manifesto text revealed per-char. Section "melahirkan" content dari dalam lingkaran (kaitonote.com)
- **Lottie as morphing decorative object** — thin geometric shapes (circles, crosshairs, lines) di-render pada sticky 2D canvas via Lottie, berubah seiring scroll melewati service items. Decorative object yang hidup (kaitonote.com)
- **Three.js flowmap text distortion** — AVIF image logo di-distort via WebGL flowmap shader: mouse velocity → UV displacement + chromatic aberration (0.004). Ping-pong FBO, dissipation 0.965, falloff 0.18. Text "berubah bentuk" mengikuti mouse — glitch yang organic (supersolid.agency)
- **Chromatic shadow clone — 3 layer RGB split** — teks di-clone 3x: pink `rgb(234,51,247)` z:3, cyan `rgb(117,251,253)` z:2, yellow `rgb(241,254,103)` z:1. Positioned absolute di belakang original (z:-1). Offset di-drive oleh scroll/velocity → chromatic aberration pada typography (supersolid.agency)
- **SVG wordmark sliced into 3 horizontal strips** — "SUPERSOLID" dipotong jadi 3 SVG (top 47px, middle 65px, bottom 103px viewBox), masing-masing di-animate `yPercent: 110` → 0 dengan stagger from "end", ease custom. Saat scroll, strips offset berbeda → glitch/slice effect (supersolid.agency)
- **Blur-to-sharp text reveal on scroll** — `filter: blur(5px)` + `yPercent: 20` + `opacity: 0` → clear, per-line stagger 0.055s, custom ease "0.16, 1, 0.35, 1". Lebih subtle dari art-yakushev (blur 5px vs 10px) (supersolid.agency)

### Typography: Extreme Contrast
- Heavy headlines vs light body
- Negative letter-spacing pada display
- **Serif + sans-serif pairing** — editorial contrast (Apparel italic serif + Suisse sans-serif dari art-yakushev.com)
- **Text as visual material** — bukan hanya content, tapi MEDIUM untuk effect (liquid through text, chromatic split)
- **Per-character custom kerning** — letter-spacing berbeda per karakter untuk optical balance (art-yakushev: "A" -8.64px, "Y" -36.72px)
- **Condensed display font at extreme size** — BebasNeue 267px untuk hero (chdartmaker.com). Condensed = lebih banyak karakter di viewport = more impact
- **Aggressive negative tracking on display** — letter-spacing -4px pada 100px headings (chdartmaker.com) — tighter = more premium
- **Condensed + geometric pairing** — BebasNeue (condensed) + Okomito (geometric sans) — dua personality berbeda (chdartmaker.com)
- **Counter-positioned dual H1** — nama depan left-aligned + nama belakang right-aligned dalam satu hero. Swiss asymmetric tension maksimal (latchezarboyadjiev.com)
- **Light weight 300 headline + serif italic accent** — Kumbh Sans 50px weight 300 (light, bukan bold) untuk hero headline. Kata tertentu ("Digital", "For", "and") di-wrap programmatik dengan Noto Serif Display italic via `wrapSpecificText()`. Contrast weight/style WITHIN satu headline — elegant, bukan brutal (kaitonote.com)
- **Manifesto at large center-aligned** — 53px weight 300 center-aligned manifesto text. Generous white space. Revealed per-char saat circles shrink ke 0 — text "lahir" dari dalam lingkaran (kaitonote.com)
- **Number scramble as counter** — `scrambleText` plugin chars "0123456789", speed 1.5, duration 1.5s — service numbers (01, 02, 03) "dihitung" dengan visual noise sebelum settle. Micro-detail yang mahal (kaitonote.com)
- **Display font Joyride Alt** — rounded/playful display font untuk hero wordmark, dipasangkan dengan Montserrat 700 untuk body headings dan Sono (monospace) untuk labels. Tiga personality: playful (Joyride) + professional (Montserrat) + technical (Sono) (supersolid.agency — partial)

### Interaction: Physical Metaphor
- Cursor dengan massa (multi-layer)
- Magnetic/displacement hover
- Scroll-driven state changes
- Preloader sebagai scene opening
- **Mouse-reactive fluid** — liquid ink/chroma pada mouse movement
- **Cursor negative space reveal** — cursor sebagai revealer konten tersembunyi di negative space, kesan brutalist (junji-yamazaki.design)
- **Text pixel distortion on touch** — text berubah jadi pixel saat mouse/touch (creativewebmanual.com)
- **Navbar logo animation** — logo di navbar beranimasi saat interaksi — micro-craft (sileent.com)
- **Mouse spawns random objects** — mouse movement mengeluarkan object random, creative dan artsy (airborne.studio)
- **Cursor magnifying glass / liquid glass** — cursor sebagai efek kaca pembesar + liquid glass (inspirux.com)
- **Hologram/silver cursor** — cursor dengan gradient silver + blend-mode negative/difference effect. Kesan futuristic premium (kaitoresume, portx)
- **Context-aware cursor** — cursor berubah state/bentuk saat hover interactive elements (card, video, button). Cursor sebagai UX feedback, bukan hanya decorative (mobius)
- **Mouse-reactive hero parallax** — hero elements tilt/shift berdasarkan posisi mouse, hero yang "hidup" (operator-template)

### Text Effects: Blending & Material (NEW — dari 48 Framer references)
- **Aluminum/chrome text** — text dengan metallic/brushed aluminum visual treatment, bukan flat white (effica, lumos-portfolio, unfixedstudio)
- **Negative space text** — text sebagai mask/cutout yang reveal konten di belakangnya via mix-blend-mode difference atau clip-path (raelle, td-alexfolio, lumos-portfolio)
- **Text-image collision** — text berinteraksi visual saat overlap dengan image (archar "Simplicity through design & Strategy"). Elements saling berinteraksi, bukan hidup sendiri
- **Text blending/composite** — mix-blend-mode pada typography untuk create depth dan dimensi (palmer-template, agents, vyzn, effica)
- **Logo blend-on-collision** — logo/element blend saat bertabrakan dengan element lain (effica)

### Footer: Closing Statement (NEW)
- **Marquee footer** — horizontal scrolling text di footer sebagai closing visual statement (bravestudio). Marquee BUKAN filler, tapi design element
- **Premium footer dengan accent rules** — garis-garis dekoratif + bold typography di footer (nivora). Footer = closing credits, bukan afterthought
- **3D objects in marquee** — mixed objects (text + 3D) dalam marquee loop (bravestudio)
- **Anti-video preference** — user menghindari video-heavy approach, prefer solusi kreatif non-video (sileent.com feedback)
- **Wave marquee text** — marquee text membentuk wave dan jadi lurus saat scroll (farrynheight.com)

### Layout: Content-Driven + Swiss Grid Foundation
- Setiap section punya spatial logic sendiri
- Asymmetric tapi purposeful
- Ruang negatif sebagai elemen desain
- Counter-positioned typography (name top-left, role bottom-right)
- **Swiss Grid sebagai foundational system** — bukan aksen tapi VOCABULARY layout utama. Columns, Van de Graaf, rectangular grid diterapkan konsisten (creativewebmanual.com, grids.obys.agency, eseagency.ch, sileent.com, shanecollierdesign.ca, abgd.it)
- **Typography scale play dalam grid** — permainan besar/kecil, vertical text, unconventional arrangements (creativewebmanual.com, synchronized.studio)
- **Services section sebagai premium showcase** — grid layout di services/work section dengan kesan elegan (junji-yamazaki.design, sileent.com, kaitonote.com)
- **Holistic craft** — setiap section dan detail terasa intentional, bukan hanya hero yang bagus (sileent.com)
- **Circular narrative** — footer mirrors hero → site terasa "loop" (daspritam.in + art-yakushev.com + chdartmaker.com)
- **SVG monogram/mask footer** — oversized brand mark sebagai visual anchor (art-yakushev.com)
- **Numbered portfolio grid** — 00-1, 00-2 indexing dengan PREVIEW toggle (art-yakushev.com)
- **Sticky hero text + blend transition** — title sticky di top, mix-blend-mode: difference, auto-invert saat scroll dari dark ke light section (chdartmaker.com)
- **3D render as texture layer** — monochrome image at opacity 0.7 di belakang text menciptakan ilusi silver/glass reflection (chdartmaker.com)
- **Scroll-driven process arrow** — "Conception → Réalisation" dengan line yang memanjang driven by `--progress` CSS variable, tied to scroll position (chdartmaker.com)
- **GSAP Flip scaling asset** — glass sculpture video dari 192x128 → fullscreen via GSAP Flip plugin on scroll. Object "grows" into hero background (latchezarboyadjiev.com)
- **Systematic blend mode strategy** — luminosity (hero text), difference (nav, content, about, contact), color (button overlays) — bukan satu blend mode, tapi SISTEM blend modes per section (latchezarboyadjiev.com)
- **Pinned scroll timeline as narrative** — seluruh homepage = satu ScrollTrigger pin 1300% viewport. Sections morph via clip-path circle(), text via SplitText word stagger, background via color transition. Scroll = camera movement through scenes (skizophonic.com)
- **Video-as-spiral with mix-blend-difference** — pre-rendered B&W spiral video, logo overlay `bg-black text-white mix-blend-difference` = spiral terlihat melalui logo secara inverse. Text "ditabrak" oleh spiral movement (skizophonic.com)
- **SVG circle grid as premium accent** — SVG ellipses (viewBox 825.5x825.5, strokeWidth 0.5px white/gray) + bg_circle.png (opacity 0.7) di hero. Grid lines tipis + lingkaran besar = kesan precision engineering di atas deep black + blue gradient. Entrance via drawSVG "100% live" + scaleX/Y 0→1 (kaitonote.com)
- **Sticky Lottie canvas next to service items** — 2D canvas 328x328 sticky di kiri, Lottie canvas renderer (loop, autoplay false, driven by scroll). Thin geometric shapes (circles, crosshairs, lines) berubah seiring scroll melewati service items — decorative object yang hidup tanpa WebGL (kaitonote.com)
- **Cloned text + mix-blend-difference shadow** — setiap text line di-clone, clone positioned absolute z[-1] dengan `text-gray-600 mix-blend-difference`. Menciptakan "ghost shadow" layer yang invert di atas gradient background — depth tanpa CSS shadow (kaitonote.com)
- **Corner labels as service categories** — "MOTION DESIGN", "WEB DEVELOPMENT", "VISUAL DESIGN", "ART DIRECTION" di empat corner hero — framing content + menyatakan expertise dalam satu gesture (kaitonote.com)
- **Fixed nav with mix-blend-mode: difference** — navbar `position: fixed; z-index: 200; mix-blend-mode: difference` — logo dan links auto-invert hitam/putih saat melewati section gelap/terang. Terasa "glass/prisma/silver" tanpa shader (supersolid.agency)

### Color: Chromatic Contrast
- **Suka**: Red/aqua chromatic split dari fluid simulation (daspritam.in)
- **Suka**: Electric blue (#0047FF) pada dark background
- **Suka**: mix-blend-mode: difference menciptakan prismatic color shifts dari video (art-yakushev.com)
- **Suka**: mix-blend-mode: luminosity — text mengambil brightness sendiri, chrominance dari video di belakang → silver/prismatic/glass effect tanpa shader (latchezarboyadjiev.com)
- **Suka**: Video rotating glass sculpture sebagai chromatic source — video bukan konten, tapi MATERIAL warna untuk text blending (latchezarboyadjiev.com)
- **Suka**: Glitch RGB channels — #ff0047 (merah) + #00ffc7 (cyan-green) + gray, clip-path slicing horizontal, translate offset berlawanan. "Kesan bebas brutalist kreatif dan artsy" (skizophonic.com)
- **Suka**: Deep indigo→blue→cyan tri-tone gradient — `#0f0a72` (deep indigo) → `#0166c9` (vibrant blue) → `#a1e0e7` (light cyan). Gradient orb sebagai JPG image (bukan shader), 1920x1079, di-center absolute. Warna "hidup" karena scale animation pada intro + fade pada scroll (kaitonote.com)
- **Suka**: color-burn overlay layers — dua elemen overlay (fixed + absolute) dengan `mix-blend-mode: color-burn`, menciptakan warm tonal richness di atas gradient. Subtle tapi menambah depth (kaitonote.com)
- **Suka**: Deep purple/violet vibrant + glow effects — "style vibrant deep ungunya saya suka dengan glow glow effectnya" (davidlangarica.dev)
- **Suka**: Purple vibrant + glass cubic objects (changers.studio)
- **Suka**: Silver/logam/metal text effects — text yang terlihat silver/logam/kaca pada hero terkesan premium (bluxstudio.com, jeffkoonsmoonphases.com, kfadv.it)
- **Suka**: Neon bold colors — design bold + warna neon (rise2.studio)
- **Suka**: Blue mouse movement effect — "birunya saya suka cuman sayang terlalu pudar" — vibrant > pudar (leeroy.ca)
- **TIDAK suka**: Pastel/muted colors di hero — "ungu pastel saya tidak suka" (synchronized.studio)
- **TIDAK suka**: Hijau di hero/dark background (junji-yamazaki.design)
- **TIDAK suka**: Full bright backgrounds (kuning, orange) — accent boleh, background tidak (eseagency.ch)
- **TIDAK suka**: Warna terlalu pudar/muted — harus vibrant (leeroy.ca)
- **Pattern**: Warna yang muncul dari INTERAKSI (fluid, displacement, blend mode), bukan static decoration
- **Pattern baru**: User sangat prefer VIBRANT > PASTEL/MUTED. Accent colors harus bold dan saturated. Background tetap dark

---

## Reference Sites

Setiap site dianalisis dengan framework "Don't Copy, Understand" (lihat `site-analysis-framework.md`).

### 1. daspritam.in
- **URL**: https://www.daspritam.in/
- **Awwwards Status**: Honorable Mention / nominee-level
- **User Verdict**: "effect liquid ketika mouse movement dan text effect ketika mengenai text... detail liquidnya membuat terasa mahal dan keren"

#### Apa yang Menarik
| Aspek | Detail |
|-------|--------|
| **Liquid text masking** | Fluid simulation di-render MELALUI text shapes — text jadi "window" ke liquid |
| **Red/aqua chromatic split** | R channel stays, G+B shift = organik red/cyan bleeding |
| **Velocity-driven color** | Splat color = mouse velocity direction, bukan warna static |
| **Section 2 impact** | Teks "CREATE WEBSITE THAT TRULY INSPIRES" dengan liquid merah detail di background |
| **Full-page canvas** | Satu fixed WebGL canvas untuk SEMUA headings — konsistensi physics |

#### Teknik yang Diidentifikasi
| Teknik | Implementation | Purpose |
|--------|----------------|---------|
| Navier-Stokes fluid sim | OGL v1.3.1, double FBO ping-pong, Jacobi pressure solve | Organic, physically-accurate liquid behavior |
| Text-to-texture pipeline | DOM text → offscreen canvas (fillText) → toDataURL → WebGL mesh | Text shapes sebagai mask untuk fluid |
| Chromatic aberration shader | `fluid.rg * 0.001` UV displacement + `fluid * 0.003` RGB split | Red/cyan color bleeding yang responsive |
| Gaussian splat | `exp(-dot(p,p)/radius) * color` pada mouse velocity | Natural falloff dari mouse interaction |
| Image cover shader | SDF rounded-rect + object-fit cover di GPU | Smooth border-radius tanpa CSS limitation |
| Counter-position layout | Name top-left, role bottom-right, generous negative space | Swiss asymmetric tension |
| Circular narrative | Footer = mirror of hero | Site terasa "loop", bukan "end" |

#### Timing & Feel
- Fluid dissipation: natural fade (no explicit easing)
- Splat multiplier: `dx*5, dy*-5` — moderate sensitivity
- UV displacement: `0.001` — subtle text warping
- Chromatic: `0.003` — visible but not overwhelming
- Text reveal: GSAP SplitText 3.13.0, likely power3/expo easing

#### Kenapa Terasa Premium
1. **Physics-based** — real Navier-Stokes, bukan approximation
2. **Text AS the reveal** — kamu melihat liquid MELALUI huruf, bukan effect DI ATAS text
3. **Velocity = color** — setiap gerakan mouse menghasilkan warna berbeda berdasarkan ARAH
4. **Chromatic split** — R/GB separation menciptakan depth dan "expensive" look
5. **Full-page continuity** — satu canvas, satu fluid system, semua heading
6. **Subtlety** — multiplier 0.001/0.003 = just right, tidak overwhelming

#### Mobile Handling
- WebGL dimatikan di bawah `lg` breakpoint
- Text menjadi visible (`md:text-white`)
- Static image (me7.webp) menggantikan fluid background
- Layout stack vertikal

#### Accessibility
- Semantic HTML terjaga (h1, h2, section)
- Mobile fallback tanpa WebGL
- **Gap**: Tidak ada reduced-motion handling (area improvement)

#### Influence ke Taste Profile
- **Memperkuat**: Fluid simulation, mouse-reactive effects, dark cinematic
- **Menambah baru**: Chromatic aberration as color strategy, text-as-mask technique, velocity-driven color
- **Konfirmasi**: Font Satoshi (sama dengan portfolio Billy) — validasi pilihan font

### 2. art-yakushev.com
- **URL**: https://www.art-yakushev.com/
- **Awwwards Status**: SOTD (Awwwards), CSS Design Awards WOTD, DP Awards, Honorable Mention
- **User Verdict**: "motionnya smooth, typography keren, text di hero terlihat seperti prisma atau silver, scroll terasa smooth, typography boldnya saya suka, footernya text blend dengan warna dibelakangnya, secara keseluruhan motion dan feel terasa mahal, splashscreennya smooth"

#### Apa yang Menarik
| Aspek | Detail |
|-------|--------|
| **Prisma/silver text effect** | `mix-blend-mode: difference` pada `.hero-wrap` — white text over red Vimeo video → cyan/blue prismatic shifts. Area gelap video → text jadi silver/metallic |
| **Editorial serif/sans pairing** | "Artiom" dalam Suisse (sans-serif), "Yakushev" dalam Apparel (italic serif) — satu baris, dua personality |
| **Per-character kerning** | Custom letter-spacing per span: "A" -8.64px, "r" +2.16px, "Y" -36.72px — optical precision, bukan uniform |
| **Cinematic splashscreen** | Logo blur(20px)→sharp + scale 5x→1x + split dari center, lalu hero video blur-to-sharp, text chars slide dari bawah |
| **SVG monogram mask footer** | "AR-26" sebagai SVG cutout — video background terlihat melalui bentuk huruf → text "blend" dengan warna di belakang |
| **Scroll-driven text blur** | Per-char blur(10px)→blur(0px) scrubbed to scroll position — text terbaca seiring scroll |
| **Text shuffle hover** | Chars acak selama 400ms lalu reset ke asli — playful micro-interaction |
| **Circular narrative** | Footer menampilkan hero lagi (nama, video, tagline) — site terasa loop, bukan end |

#### Teknik yang Diidentifikasi
| Teknik | Implementation | Purpose |
|--------|----------------|---------|
| mix-blend-mode: difference | `.hero-wrap` wrapper over Vimeo iframe | Prismatic color inversion — white menjadi complement dari video color |
| Vimeo background video | iframe `background=1&muted=1&loop=1`, object-fit cover | Atmospheric cinematic backdrop tanpa loading overhead sendiri |
| SplitType + GSAP SplitText | `new SplitType(el, { types: "words, chars, lines" })` | Granular per-char animation control |
| ScrambleTextPlugin | Hover shuffle pada nav/link text | Playful randomness yang controlled |
| Blur-to-sharp scroll reveal | `filter: blur(10px)` → `blur(0px)`, ScrollTrigger scrub: 0.15 | Progressive readability tied to scroll position |
| Logo cinematic intro | `filter: blur(20px)` + `scale: 5` + `x: ±43vw` → normal, expo.inOut 2s | Dramatic entrance dari center-split |
| Hero char slide-up | `yPercent: 150` → 0, stagger from center each 0.03s, expo.inOut 1.5s | Chars muncul dari bawah overflow clip |
| Stagger link hover | `yPercent: -96`, expo.inOut 0.5s, stagger each 0.011s | Per-char slide-up hover — premium feel |
| SVG monogram mask | SVG path dengan black fill, letter cutouts, z-index: -1 | Video terlihat melalui cutout → blend effect |
| Lenis smooth scroll | Lenis 1.2.3 via unpkg CDN | Buttery smooth scroll feel |
| Scroll lock during intro | Body fixed + prevent wheel/touch/key events | Memaksa user menonton intro sequence |
| Responsive breakpoint reload | localStorage scroll position + sessionStorage reload flag | Clean re-init saat breakpoint berubah |

#### Timing & Feel
- **Intro timeline**: ~6-7s total (logo blur+scale 2s, hero bg blur 3s, text slide 1.5s overlapping)
- **Logo entrance**: blur(20px)→sharp, scale 5x→1x, x ±43vw→0, expo.inOut 2s
- **Hero text chars**: yPercent 150→0, from center, each 0.03s stagger, expo.inOut 1.5s
- **Scroll text blur**: blur(10px)→0, scrub 0.15, start "top 80%" end "bottom 20%"
- **Nav stagger hover**: yPercent 0→-96, expo.inOut 0.5s, stagger each 0.011s
- **Big stagger hover**: yPercent 0→-116, expo.inOut 0.65s, stagger each 0.02s
- **Text shuffle**: random chars every 100ms for 400ms, then reset
- **Dominant easing**: expo.inOut (intro), power2.out (reveals), power1.out (scroll)

#### Kenapa Terasa Premium
1. **Video-as-atmosphere** — Vimeo video bukan konten, tapi MATERIAL visual yang berinteraksi dengan typography via blend mode
2. **mix-blend-mode: difference** — satu CSS property yang menciptakan seluruh prismatic identity. White → cyan over red, white → silver over dark
3. **Per-character kerning obsession** — "A" punya spacing berbeda dari "r", "Y" punya spacing berbeda dari "akushev". Optical, bukan mathematical
4. **Intro scroll lock** — memaksa user menonton cinematic opening, menciptakan moment of awe sebelum explore
5. **Blur-to-sharp readability** — text tidak langsung terbaca, tapi MENJADI terbaca seiring scroll — engagement through gradual reveal
6. **Circular narrative** — footer = hero repeat dengan video background → site tidak "berakhir"
7. **will-change management** — setiap animasi set willChange sebelum dan clear setelah → performance-conscious engineering
8. **Zero canvas/WebGL** — semua efek premium dicapai dengan CSS + GSAP saja → lightweight, accessible

#### Mobile Handling
- Breakpoint di 1200px: intro timeline berbeda (line-based bukan char-based)
- 768-1200: tablet variant dengan `.text-hero_mob` (line stagger, bukan char stagger)
- < 768: blur element-level (bukan per-char), stagger links disabled
- Breakpoint change → page reload dengan scroll position preserved (localStorage)
- `.hero_social-mob` dan `.text-hero-mob_wrapp` sebagai mobile-specific elements

#### Accessibility
- Semantic HTML terjaga (h1, h2, h4, section divs)
- Keyboard nav: scroll lock prevents keyboard during intro (restored after)
- **Gap**: Tidak ada explicit `prefers-reduced-motion` handling — intro selalu play
- **Gap**: Scroll lock bisa frustrasi user yang ingin skip intro

#### Influence ke Taste Profile
- **Memperkuat**: Cinematic intro/preloader, smooth scroll (Lenis), per-char text animation, dark atmospheric aesthetic
- **Menambah baru**: mix-blend-mode: difference as prismatic strategy, serif/sans editorial pairing, blur-to-sharp scroll reveal, SVG monogram mask footer, video-as-visual-material (bukan content), per-character optical kerning
- **Konfirmasi**: expo.inOut sebagai dominant easing (sama dengan preference existing), circular narrative (sama pattern dengan daspritam.in)

### 3. chdartmaker.com
- **URL**: https://www.chdartmaker.com/
- **Awwwards Status**: Not submitted / studio-atelier portfolio (made by TROA agency)
- **User Verdict**: "backgroundnya hitam terasa premium, hero layout dan typographynya bold, effect pada fontnya ada pantulan abu seakan silver/kaca, scroll text hero mengenai layar putih terjadi mix blend warnanya premium unik, Conception → Réalisation arrow interaction bagus. **Aspek yang saya suka adalah typography dan layoutnya saja.**"

#### Apa yang Menarik (Typography & Layout Only)
| Aspek | Detail |
|-------|--------|
| **BebasNeue 267px hero title** | Condensed display font at extreme size — per-letter wrapped in individual spans, `line-height: 1`, uppercase. Huruf memenuhi viewport width |
| **Sticky text + mix-blend-mode: difference** | `.o-heroHome_largeHeader` sticky di `top: 30px`, `z-index: 3`. White text di black hero → saat scroll ke white section, text auto-invert jadi hitam. Satu CSS property, dua identity |
| **3D render as reflection layer** | Monochrome image (Rick Owens sleeping pod) at `opacity: 0.7`, `position: absolute`, behind white text. Menciptakan ilusi silver/glass reflection tanpa shader |
| **Conception → Réalisation scroll arrow** | Okomito 72px uppercase, `letter-spacing: -2.88px`. Line 3px hitam + SVG chevron between words. Width driven by `--progress` CSS variable dari Locomotive Scroll (`data-scroll-offset="20%,50%"`) |
| **Expertises 100px typography** | Okomito 700, 100px, `letter-spacing: -4px` — extreme negative tracking. White on black, stacked vertically. Tiap item = link dengan hover reveal |
| **Circular narrative footer** | "CHDARTMAKER" title di footer identik dengan hero — same font, same per-letter spans, same 3D image behind. Site terasa loop |
| **City marquee ticker** | "PARIS FR SHANGHAI CN LONDRES UK NYC USA VENISE IT MTP FR" — horizontal auto-scroll di footer area. Geographic authority |

#### Teknik yang Diidentifikasi
| Teknik | Implementation | Purpose |
|--------|----------------|---------|
| Sticky + mix-blend-mode: difference | `position: sticky; top: 30px; mix-blend-mode: difference; z-index: 3` | Auto color inversion saat scroll melintasi section boundaries — satu teknik, premium feel |
| Per-letter span wrapping | `.o-heroHome_letterWrapper` spans per huruf | Granular control untuk entrance animation (translateY -105%) |
| Locomotive Scroll CSS progress | `data-scroll-css-progress` + `_setCssProgress()` → `--progress` CSS variable | Scroll position → 0-1 float → CSS variable → drive any CSS animation |
| anime.js v4.1.3 | `ls(elements, { translateY: "-105%", easing: outQuad, duration: 400, delay: stagger(20) })` | Entrance/exit per-letter animations |
| Barba.js page transitions | `@barba/core` v2.10.3 + lifecycle hooks (beforeLeave, afterEnter, etc.) | Smooth page transitions tanpa full reload |
| Image opacity layering | `<img> position: absolute; opacity: 0.7` behind text | "Silver reflection" effect — monochrome 3D render at reduced opacity creates glass illusion |
| CSS variable line animation | `--line-width` + `--progress` computed in JS, applied via `style.setProperty()` | Arrow grows from left label to right label driven by scroll |
| Condensed + geometric font pairing | BebasNeue (condensed display) + Okomito (geometric sans-serif body) | Maximum impact on headlines, clarity on body — two distinct personalities |

#### Timing & Feel
- **Hero entrance**: translateY -105% → 0, easing outQuad, duration 400ms, stagger 20ms per letter
- **Hero exit (on navigate)**: translateY 0 → -105%, same easing, same stagger
- **Scroll line progress**: scrubbed 0→1 over `scrollOffset: "20%,50%"` — line visible early, completes mid-scroll
- **Scroll CSS progress**: `_setCssProgress(progress)` sets `--progress` 0→1 pada el.style
- **Dominant library**: anime.js (NOT GSAP) — outQuad easing dominant
- **Smooth scroll**: Lenis (embedded in Locomotive Scroll module)

#### Kenapa Terasa Premium (Typography & Layout)
1. **Extreme font size** — 267px BebasNeue = text IS the design. Tidak ada elemen lain yang compete dengan hero typography
2. **mix-blend-mode: difference sebagai state machine** — satu CSS property menangani dua konteks warna. Elegant engineering
3. **Opacity-as-texture** — 3D render at 0.7 opacity bukan ilustrasi, tapi MATERIAL visual yang memberikan depth ke flat text. Terlihat silver/glass tanpa WebGL
4. **Negative tracking obsession** — -4px pada 100px text, -2.88px pada 72px text. Tighter = more premium, lebih banyak huruf terkompresi = more authority
5. **Black background as luxury** — pure black (#000) memberikan maximum contrast. Text putih pada hitam = immediate premium perception
6. **Circular narrative confirmation** — pattern ketiga (setelah daspritam.in + art-yakushev.com) yang footer mirrors hero. Ini bukan coincidence — ini PATTERN award-winning

#### Mobile Handling
- Breakpoint di 1023px: isMobile check pada ExpertisesPush (hover disabled di mobile)
- Hero likely responsive (font-size via viewport units atau media queries in CSS, not in JS)
- Barba.js transitions tetap bekerja di mobile
- Locomotive Scroll handles touch events

#### Accessibility
- Semantic HTML: h1, h2, h3, section, nav, main, footer — proper hierarchy
- Skip link: "Aller directement au contenu" (skip to main content) — excellent
- `aria-hidden="true"` pada SVG icons
- `focusable="false"` pada decorative SVGs
- **Gap**: Tidak ada explicit `prefers-reduced-motion` handling
- **Gap**: mix-blend-mode: difference bisa mengurangi readability pada beberapa color combinations

#### Influence ke Taste Profile
- **Memperkuat**: Black background as premium, circular narrative (pattern ketiga!), mix-blend-mode: difference (pattern kedua setelah art-yakushev.com), negative letter-spacing pada display
- **Menambah baru**: Condensed display font at extreme size, image-opacity-as-reflection-layer (no shader needed), scroll-driven CSS variable animation, sticky text with auto-inversion, condensed + geometric font pairing
- **Konfirmasi**: Uppercase hero title, aggressive negative tracking, per-letter animation control

### 4. latchezarboyadjiev.com
- **URL**: https://www.latchezarboyadjiev.com/
- **Awwwards Status**: Not submitted / artist portfolio (Webflow)
- **User Verdict**: "layout heronya saya suka, typography boldnya saya suka, effect pantulan pada text heronya terlihat seperti glass/prisma/silver dan blendingnya di hero dan beberapa section, assets hero yang seperti kaca saya suka. **Background warna putih saya tidak begitu suka.** Hanya itu saja yang saya suka."

#### Apa yang Menarik (Hero Layout, Typography, Glass Effect, Blend, Glass Assets Only)
| Aspek | Detail |
|-------|--------|
| **Maximanouva 216px hero** | Custom font at 700 weight, color #ededed (light gray, bukan pure white). Dua H1: "Latchezar" left-aligned, "BOYADJIEV" right-aligned — counter-position Swiss tension |
| **mix-blend-mode: luminosity on hero text** | `.hero-heading-wrapper.is-luminosity` — text mengambil BRIGHTNESS sendiri (#ededed), CHROMINANCE dari video glass sculpture di belakang. Hasilnya: text terlihat silver/prismatic/glass tanpa shader |
| **Systematic blend mode strategy** | `luminosity` (hero heading + lightbox icons), `difference` (cursor, nav, content, about, contact), `color` (button overlays blue #5691EF) — bukan satu trick, tapi SISTEM per section |
| **Glass sculpture video as material** | MP4 1280x720, rotating glass art, autoplay/loop/muted, z-index -100, object-fit cover — video bukan konten, tapi CHROMATIC SOURCE untuk text blending |
| **GSAP Flip scaling asset** | `.scaling-video` starts 192x128px → scales fullscreen via GSAP Flip plugin. Glass sculpture "grows" dari thumbnail ke hero background on scroll |
| **Sub-nav concept tags** | "Fluidity", "Light", "Emotion" — 16px, weight 400, `mix-blend-mode: difference` — conceptual anchors, bukan navigation biasa |
| **About: "THE ART OF SHAPING GLASS"** | Maximanouva 144px, 700 weight, line-height 144px, `mix-blend-mode: difference` pada wrapper — text inverts over dark/light zones |

#### Teknik yang Diidentifikasi
| Teknik | Implementation | Purpose |
|--------|----------------|---------|
| mix-blend-mode: luminosity | `.hero-heading-wrapper.is-luminosity` over video background | Silver/prismatic text — text brightness stays, color from video |
| mix-blend-mode: difference | `.hero-content-wrapper.is-difference`, nav, about, contact wrappers | Auto-inverting text across dark/light zones — consistent readability |
| mix-blend-mode: color | `.button-image-overlay.is-blue` (`rgb(86,145,239)`) | Blue tint overlay on buttons — subtle brand color injection |
| GSAP Flip plugin | `data-flip-element="wrapper"` + `data-flip-element="target"` on scaling-video | Morph glass asset from thumbnail → fullscreen with layout animation |
| Video-as-chromatic-source | MP4 autoplay/loop/muted, z-index -100, object-fit cover | Glass sculpture video provides color palette for luminosity text blend |
| Counter-positioned H1s | H1 "Latchezar" text-align-left + H1 "BOYADJIEV" text-align-right | Maximum asymmetric tension — diagonal reading path |
| GSAP 3.13.0 full suite | ScrollTrigger, Flip, Draggable, CustomEase, InertiaPlugin | 54 ScrollTrigger instances — heavy scroll-driven animation system |
| Lenis smooth scroll | Lenis (via CDN) | Smooth scroll feel, same as portfolio stack |
| Swiper slider | Swiper v8 for gallery sections | Touch-friendly gallery/artwork browsing |

#### Timing & Feel
- **54 ScrollTrigger instances** — extremely scroll-driven, setiap section punya trigger
- **Flip scale animation**: small → fullscreen, likely power3/expo easing (CustomEase loaded)
- **Lenis smooth scroll**: consistent buttery feel
- **Videos**: all autoplay, loop, muted — ambient background material, bukan content
- **Dominant library**: GSAP 3.13.0 (NOT anime.js — berbeda dari chdartmaker.com)

#### Kenapa Terasa Premium (Glass/Prisma/Silver Effect)
1. **mix-blend-mode: luminosity** — teknik BARU yang belum ditemui di reference sebelumnya. Berbeda dari `difference` (inversi) — luminosity mengambil brightness dari foreground + chrominance dari background. Hasilnya HALUS, silver, prismatic
2. **Video sebagai palette** — glass sculpture yang berputar menciptakan warna yang terus berubah. Text "menampilkan" warna glass secara organik
3. **Systematic blend strategy** — bukan hanya hero trick. `luminosity` di hero, `difference` di nav/about/contact, `color` di buttons. Setiap blend mode punya TUJUAN spesifik
4. **Counter-positioned typography** — dua H1 di axis berbeda (kiri/kanan) menciptakan diagonal tension yang memaksa mata membaca dari top-left ke bottom-right
5. **Glass asset scaling** — GSAP Flip dari thumbnail ke fullscreen adalah "cinematic zoom" yang membuat glass sculpture terasa monumental
6. **Zero WebGL** — semua efek premium dicapai dengan CSS blend modes + video + GSAP. Lightweight, accessible

#### Mobile Handling
- Webflow responsive system (breakpoints via CSS media queries)
- Videos likely degraded/hidden on mobile (Webflow standard practice)
- GSAP ScrollTrigger handles touch events natively
- Lenis handles touch scroll

#### Accessibility
- Webflow generates semantic HTML (sections, headings, nav, links)
- Videos: autoplay/loop/muted — no audio distraction
- `w-background-video` pattern has built-in poster fallback
- **Gap**: Tidak ada explicit `prefers-reduced-motion` handling (common Webflow limitation)
- **Gap**: Luminosity blend bisa mengurangi contrast ratio pada beberapa video frames
- **Gap**: 54 ScrollTrigger instances = heavy animation tanpa reduced-motion opt-out

#### Influence ke Taste Profile
- **Memperkuat**: Bold typography at extreme sizes (pattern ke-4), mix-blend-mode strategies (pattern ke-3 setelah art-yakushev + chdartmaker), video-as-visual-material (pattern ke-2 setelah art-yakushev), counter-positioned layout
- **Menambah baru**: `mix-blend-mode: luminosity` (teknik baru — silver/prismatic text), GSAP Flip scaling animation, systematic blend mode per-section, video-as-chromatic-source (bukan hanya atmosphere), sub-nav concept tags
- **Konfirmasi**: GSAP + Lenis combo (sama dengan portfolio Billy), zero-WebGL premium aesthetic achievable with CSS blend modes
- **TIDAK disukai**: White background — user explicitly prefers dark

### 5. kaitonote.com
- **URL**: https://kaitonote.com/
- **Awwwards Status**: Not submitted / Japanese creative studio portfolio (Alpine.js + GSAP 3.12.7 + Lenis)
- **User Verdict**: "circle transisi masuk ke hero lalu memudar, warna biru dan gradasinya stunning, accent grid dan lingkaran premium di atas hitam + biru, typography dan layout bagus, scroll motion circle membesar + manifesto blending sangat suka, circle biru pallettenya sangat suka, services section vibrant nuansa premium + thin object yang berubah-ubah di sebelah kiri"

#### Apa yang Menarik
| Aspek | Detail |
|-------|--------|
| **Intro circle transition** | Counter 000→100 (3 digit columns, y: -90%, 2.75s), SVG drawSVG circles drawn on, gradient orb scale 0.25→1 (3s), circle container width 0→"100%" + opacity→0.5. Dua bespoke CustomEase curves. ~7s total choreography |
| **Deep indigo→blue→cyan gradient** | `#0f0a72` → `#0166c9` → `#a1e0e7` tri-tone. Gradient orb = JPG image 1920x1079, bukan shader. Dua color-burn overlay layers menambah warm tonal depth |
| **SVG circle grid accents** | SVG ellipses (viewBox 825.5x825.5, strokeWidth 0.5px white/gray) + bg_circle.png (1441x1441, opacity 0.7). Grid lines tipis = precision engineering aesthetic |
| **Corner labels** | "MOTION DESIGN", "WEB DEVELOPMENT", "VISUAL DESIGN", "ART DIRECTION" di empat corner hero — framing + expertise declaration |
| **Scroll-scrubbed circle shrink + manifesto** | Pinned section (600vh): gradient/circles scale→0 (power3.in), work images scatter outward via x/y/z (expo.out, stagger 0.075), manifesto text revealed per-char. Lingkaran "melahirkan" konten |
| **Manifesto text blending** | Cloned text technique: setiap EN line di-clone, positioned absolute z[-1], `text-gray-600 mix-blend-difference` — ghost shadow yang invert di atas gradient |
| **Lottie morphing thin objects** | Sticky 2D canvas 328x328, Lottie canvas renderer, loop autoplay false. Thin geometric shapes (circles, crosshairs, lines) berubah seiring scroll melewati service items |

#### Teknik yang Diidentifikasi
| Teknik | Implementation | Purpose |
|--------|----------------|---------|
| CustomEase intro choreography | `CustomEase.create("custom","M0,0 C0.11,0.282...")` — dua bespoke curves, counter+circle+orb sequenced | Intro yang terasa bespoke, bukan generic ease |
| drawSVG progressive reveal | `drawSVG: "0% 100%"` (semi-circles 2.5s) + `"100% live"` (ellipses 1s) + scaleX/Y 0→1 (lines 2-2.5s) | Grid "tergambar" secara perlahan — crafted entrance |
| Pinned scroll timeline | `ScrollTrigger { trigger: [data-reel], start: "top-=15% top", end: "bottom bottom", scrub: true }` | Continuous narrative scroll, bukan section jump |
| Work images scatter | `x/y/z rem` positioning, `expo.out`, stagger `0.075` per image, 10 images z[-1]→z[-10] | Images "meledak" keluar dari lingkaran — dramatic reveal |
| Cloned text + blend-difference | `.cloneNode(true)` → add classes `z-[-1] text-gray-600 mix-blend-difference` | Ghost shadow layer tanpa CSS box-shadow — depth via blend |
| wrapSpecificText() | DOM text node search → wrap matching words ("four","both","digital experiences") with `font-noto italic` | Programmatic serif italic injection — elegant inline accent |
| Lottie canvas renderer | `lottie.loadAnimation({ container, renderer:"canvas", loop:true, autoplay:false, animationData })` | Morphing decorative objects tanpa WebGL overhead |
| scrambleText numbers | GSAP registered effect: `chars:"0123456789"`, speed 1.5, duration 1.5s | Service numbering (01, 02, 03) dengan visual noise |
| Per-char service title | `inText(chars, { stagger: 0.05 })` — Kumbh Sans 300, 53px | Premium text entrance pada service items |
| SplitText nested lines | Split lines → nested split for double-level animation control | Granular reveal: line-by-line lalu per-char |

#### Timing & Feel
- **Intro**: ~7s total. Counter 2.75s, circles 2.5s, orb 3s (overlapping dari show+3.75). Dua CustomEase curves (custom bezier)
- **Scroll reel**: scrub true (direct), pin start "top top", end dynamic `window.innerHeight`. Gradient fade 1s, circles shrink 2s, images scatter 1.5s, video scale 1s
- **Service entrance**: per-char stagger 0.05s, number scramble 1.5s
- **Lottie**: loop true, autoplay false (scroll-driven), canvas renderer 328x328
- **Registered effects**: inTitle (CustomEase, stagger 0.1, 1.6s), inText (easeOutExpo, 2.4s), inScrambleText (scramble, 1.5s)
- **Dominant easing**: power3.in/out (structural), expo.out (scatter), CustomEase (intro)

#### Kenapa Terasa Premium
1. **Gradient orb sebagai JPG** — bukan shader yang berat, tapi image yang di-animate dengan GSAP. Simple tech, stunning result
2. **Tri-tone gradient palette** — `#0f0a72` deep indigo → `#0166c9` vibrant blue → `#a1e0e7` light cyan. Bukan monochrome, bukan rainbow — curated 3-stop palette
3. **SVG grid accents** — strokeWidth 0.5px = hampir invisible tapi TERASA. Precision tanpa noise
4. **Circle sebagai universal motif** — intro circles, hero grid circles, scroll shrink circles, gradient orb circle, Lottie circles. Satu vocabulary visual yang kohesif
5. **Cloned text blend** — bukan CSS shadow, bukan text-shadow — DOM clone + mix-blend-difference. Engineering effort yang terlihat subtle
6. **Lottie sebagai craft indicator** — thin morphing objects bukan fungsional tapi communicates "we animate EVERYTHING"
7. **Two bespoke CustomEase curves** — bukan preset ease, bukan cubic-bezier standard. Custom-plotted curves = attention to feel
8. **Zero WebGL** — semua efek premium via 2D canvas (Lottie) + GSAP + CSS blend modes. Lightweight, accessible, performa tinggi

#### Mobile Handling
- Responsive font sizing (Kumbh Sans scales with viewport)
- Lottie canvas likely smaller on mobile (328px → responsive)
- Gradient orb JPG scales naturally
- SVG grid viewBox-based = resolution independent
- Lenis handles touch scroll

#### Accessibility
- Corner labels provide context (expertise areas)
- Videos: no autoplay audio
- Canvas Lottie: `aria-hidden` implicit (decorative)
- **Gap**: Tidak ada explicit `prefers-reduced-motion` handling pada intro 7s sequence
- **Gap**: mix-blend-difference cloned text bisa mengurangi contrast pada certain gradient positions
- **Gap**: Pinned 600vh scroll section tanpa reduced-motion fallback

#### Influence ke Taste Profile
- **Memperkuat**: Dark premium aesthetic (black + blue, pattern ke-6), mix-blend-mode: difference (pattern ke-5), circles as visual motif (pattern ke-2 setelah skizophonic), per-char text stagger, GSAP + Lenis combo
- **Menambah baru**: Tri-tone gradient palette (indigo→blue→cyan), SVG grid accent system, Lottie as decorative morphing object, cloned-text blend shadow technique, programmatic italic wrapping (`wrapSpecificText`), scrambleText for numbers, CustomEase bespoke curves, color-burn overlay layers, corner labels as expertise framing, JPG-as-gradient-orb (simple tech for stunning visual)
- **Konfirmasi**: Zero WebGL bisa achieve premium feel (CSS + GSAP + 2D canvas sufficient), circle as universal shape language (sama dengan skizophonic.com), light weight typography can be premium (300 ≠ weak, 300 = elegant)
- **Nuansa baru**: Kaitonote menunjukkan bahwa ELEGANT (light, airy, blue) bisa sepremium BRUTAL (heavy, dark, glitch). User suka keduanya — portfolio Billy bisa blend kedua sensibilitas

### 6. creativewebmanual.com
- **URL**: https://www.creativewebmanual.com/
- **User Verdict**: "grid layout swiss grid saya suka, text effect pixel di hero ketika disentuh/mouse movement, grid & layout swiss grid di section Design & Development saya suka stylenya dan layoutnya, motion scroll per-section terutama grid layout, text effect di section practice, permainan typography besar kecil dan layout grid hampir semua suka"

#### Apa yang Menarik
| Aspek | Detail |
|-------|--------|
| **Swiss grid layout sistematik** | Grid diterapkan konsisten di hampir SEMUA section — bukan aksen tapi FONDASI visual |
| **Text pixel effect on touch** | Hero text berubah menjadi pixel saat mouse/touch movement — interactive distortion |
| **Typography scale play** | Permainan besar/kecil typography dalam grid — hierarchy melalui dramatic size contrast |
| **Per-section scroll motion** | Setiap section punya motion identity sendiri saat scroll |
| **Design & Development grid** | Swiss grid spesifik yang menjadi highlight layout |

#### Kenapa Masuk Taste DNA
1. **Swiss grid sebagai vocabulary** — bukan inspirasi tapi METODE layout. User suka hampir semua section-nya
2. **Typography play** — besar/kecil dalam satu komposisi grid = visual hierarchy yang kuat
3. **Interactive text** — pixel distortion menambah layer engagement pada hero

#### Influence ke Taste Profile
- **Memperkuat**: Typography sebagai art, per-section motion identity
- **Menambah baru**: Swiss grid sebagai foundational layout system (pattern DOMINAN), text pixel distortion, typography scale play

### 7. grids.obys.agency
- **URL**: https://grids.obys.agency/rectangular_others/
- **Awwwards Status**: SOTM September 2021 (educational grid showcase by Obys Agency)
- **User Verdict**: "grid layout dan motion ketika scroll saya suka, perpaduan warna hitam dan putih simple tapi keren, swiss grid hampir di semua section saya suka"

#### Apa yang Menarik
| Aspek | Detail |
|-------|--------|
| **Swiss grid as pure visual system** | Grid bukan hanya layout tool tapi visual IDENTITY — grid IS the design |
| **B&W palette execution** | Hitam-putih yang terasa keren bukan karena warna, tapi karena GRID yang kuat |
| **Scroll-driven grid motion** | Elemen grid bergerak/reveal saat scroll — motion memperkuat grid structure |

#### Kenapa Masuk Taste DNA
1. **Grid sebagai design** — proof bahwa grid layout alone bisa stunning tanpa effect mewah
2. **B&W bisa premium** — jika didukung grid structure yang kuat
3. **Educational value** — 4 tipe grid (Columns, Van de Graaf, Rectangular, Others) sebagai vocabulary

#### Influence ke Taste Profile
- **Memperkuat**: Swiss grid (pattern semakin dominan), motion on scroll, dark/B&W premium
- **Konfirmasi**: Grid structure > decoration. Simplicity dengan strong foundation = keren

### 8. eseagency.ch
- **URL**: https://www.eseagency.ch/en
- **User Verdict**: "smooth scroll, text hero bold suka, grid dan layout hero suka, style bold dan vibrant suka di hero tapi TIDAK suka full color kuning/orange, motion scroll suka"

#### Apa yang Menarik
| Aspek | Detail |
|-------|--------|
| **Bold hero typography** | Text hero yang berani dan impactful |
| **Grid layout di hero** | Structured hero layout |
| **Bold vibrant style** | Vibrant tanpa overwhelming — accent, bukan background |
| **Smooth scroll** | Consistent scroll feel |

#### Kenapa Masuk Taste DNA
1. **Bold + vibrant yang terkontrol** — accent colors boleh vibrant, background tetap dark/neutral
2. **Hero layout structure** — grid-based hero yang kuat

#### Constraint Baru
- **TIDAK disukai**: Full color backgrounds (kuning, orange) — vibrant boleh sebagai accent, BUKAN background fill

#### Influence ke Taste Profile
- **Memperkuat**: Bold typography, smooth scroll, grid hero layout
- **Klarifikasi penting**: Vibrant = ACCENT only. Background harus tetap dark/neutral

### 9. junji-yamazaki.design
- **URL**: https://junji-yamazaki.design/
- **User Verdict**: "font typography hero suka, cursor negative space effect suka terkesan brutalist, layout grid dan motion di services premium dan elegan, warna hijau hero TIDAK suka, mendekati style saya bentuk ekspresinya tapi overall belum begitu impressive"

#### Apa yang Menarik
| Aspek | Detail |
|-------|--------|
| **Cursor negative space reveal** | Cursor mengenai negative space mengungkap konten — brutalist interaction |
| **Services grid premium** | Grid layout di services section dengan kesan premium dan elegan |
| **Hero typography** | Font yang kuat di hero |
| **Brutalist expression** | Kesan brutalist yang "paling mendekati style saya" |

#### Kenapa Masuk Taste DNA
1. **Cursor-as-revealer** — konsep baru: cursor bukan hanya pointer tapi TOOL untuk reveal hidden content
2. **Brutalist-meets-premium** — services section membuktikan brutalist bisa terasa elegan
3. **Paling mendekati style user** — user mengatakan "ini style yang mendekati saya bentuk ekspresinya"

#### Constraint Baru
- **TIDAK disukai**: Warna hijau di hero

#### Influence ke Taste Profile
- **Menambah baru**: Cursor negative space reveal, brutalist-premium fusion
- **Memperkuat**: Grid services layout, bold hero typography
- **Validasi**: Brutalist expression yang premium = sweet spot taste user

### 10. sileent.com
- **URL**: https://www.sileent.com/
- **User Verdict**: "konsep suka, motion scroll suka, animasi navbar logo suka, grid layout suka, overall bagus, MENGHINDARI video"

#### Apa yang Menarik
| Aspek | Detail |
|-------|--------|
| **Holistic concept** | Setiap elemen punya intention — terasa cohesive |
| **Scroll motion** | Motion saat scroll yang engaging |
| **Navbar logo animation** | Logo di navbar beranimasi saat interaksi — micro-craft |
| **Grid layout** | Layout grid yang solid |

#### Kenapa Masuk Taste DNA
1. **Holistic craft** — site yang terasa "semua dipikirkan", bukan hanya hero yang bagus
2. **Navbar interaction** — logo yang hidup di navbar = attention to detail level tinggi
3. **No video** — user explicitly menyatakan menghindari video → constraint penting

#### Constraint Baru
- **MENGHINDARI video** — preferensi untuk solusi kreatif non-video

#### Influence ke Taste Profile
- **Memperkuat**: Grid layout, scroll motion, holistic craft, attention to micro-details
- **Menambah baru**: Navbar logo animation as micro-craft, anti-video preference
- **Konfirmasi**: Site yang overall "bagus" = setiap section dan detail terasa intentional

---

## Partial References (Teknik Spesifik, Bukan Taste Utama)

Site-site di bawah ini TIDAK menjadi referensi utama taste DNA, tapi memiliki teknik spesifik yang disukai dan bisa di-adopt.

### P1. skizophonic.com
- **URL**: https://www.skizophonic.com/
- **Stack**: Nuxt 4.3 + GSAP + Lenis + Tailwind (open source: github.com/skabeche/skizophonic-nuxt)
- **User Verdict**: "efek spiral hero, morphing saat scroll, blending hitam putih, button glitch artsy. **Selebihnya biasa saja.**"
- **Status**: Dipindahkan dari full reference — user hanya suka 3 aspek spesifik

#### Teknik yang Di-adopt
| Teknik | Detail | Relevansi |
|--------|--------|-----------|
| **Scroll-scrubbed section morphing** | Pinned timeline 1300% viewport, clip-path circle() expand/collapse, scrub: 2. Seluruh page = satu continuous scroll narrative | Choreography pattern — scroll sebagai film scrubbing |
| **Concentric circle morphing** | 9 SVG circles B&W, staggered scale + yoyo + back(3.8), stagger -0.061 | Hypnotic pulsing motif — organic breathing |
| **CSS glitch as brutalist texture** | 3-layer clip-path polygon, #ff0047/#00ffc7/gray, translate3d + scale3d(-1,-1,1), steps(1) 6s | Controlled chaos — glitch bukan noise tapi designed brutalism |
| **mix-blend-difference sistematik** | Hero, logo, button semua pakai → cohesive visual language | Pattern ke-4 dari blend-mode usage |
| **Pre-rendered video as texture** | Spiral MP4 bukan real-time shader — video = designable asset, zero WebGL overhead | Performance-first premium |

#### Key Timing
- Scroll scrub: 2 (delayed), pin 1300% viewport
- Text enter: yPercent 100→0, blur 4px→0, power4.out, stagger 0.015s
- Circles expand: back.out (overshoot), collapse: power4.inOut
- Glitch: CSS steps(1) 6s infinite
- Color palette: B&W + #ff0047 (red) + #00ffc7 (cyan) only

### P2. supersolid.agency
- **URL**: https://www.supersolid.agency/
- **Stack**: Webflow + GSAP 3.14.2 + Three.js r160 + Lenis 1.0.23 + Barba.js + SplitText + CustomEase
- **User Verdict**: "saya hanya suka pada effect textnya saja: glitch dan berubah bentuk hero, footer SUPERSOLID clone 3 bagian terpotong, text pink pada 'lets find your ROIdeas'. Text blurry scroll lumayan suka. Logo navbar blending hitam putih inverse suka. Typography lumayan bagus. **Secara keseluruhan kurang impress karna terlalu biasa saja.**"

#### Teknik yang Di-adopt
| Teknik | Detail | Relevansi |
|--------|--------|-----------|
| **Three.js flowmap text distortion** | AVIF image logo → WebGL flowmap shader: mouse velocity → UV displacement (0.08) + chromatic aberration (0.004). Ping-pong FBO, dissipation 0.965, falloff 0.18, velocityDamping 0.85 | Text "berubah bentuk" mengikuti mouse — glitch yang organic, bukan random |
| **Chromatic shadow clone — 3 layer RGB split** | Teks di-clone 3x: pink `rgb(234,51,247)` z:3, cyan `rgb(117,251,253)` z:2, yellow `rgb(241,254,103)` z:1. Absolute z:-1 behind original. Offset driven by scroll/velocity | Chromatic aberration pada typography — premium tanpa shader |
| **SVG wordmark sliced into 3 strips** | "SUPERSOLID" dipotong jadi 3 SVG horizontal (viewBox 47/65/103px height), fill-opacity 0.3. Entrance: yPercent 110→0, stagger from "end", amount 0.25 | Glitch/slice effect pada wordmark — editorial |
| **Fixed nav mix-blend-mode: difference** | Navbar fixed z:200, `mix-blend-mode: difference` — logo auto-invert hitam/putih saat melewati section gelap/terang | Glass/prisma/silver feel tanpa shader |
| **Blur-to-sharp text reveal** | `filter: blur(5px)` + yPercent 20 + opacity 0 → clear, per-line stagger 0.055s, custom ease "0.16, 1, 0.35, 1" | Subtle scroll reveal — lebih halus dari art-yakushev (5px vs 10px) |
| **Hero WebGL 3D entry** | rotationY: 24, rotationX: -48, rotationZ: 3, y: 100, x: 100, scale: 0.8 → normal, ease "0.25, 1, 0.5, 1", duration 1.5s | Dramatic 3D rotation entrance untuk hero element |

#### Key Timing
- Custom eases: "0.16, 1, 0.35, 1" (secondary), "0.25, 1, 0.5, 1" (preloader), "0.76, 0, 0.24, 1" (fade)
- Text stagger: 0.055s universal
- Hero WebGL entry: 1.5s duration
- Lenis: duration 0.8, vertical default
- Barba page transition: scaleY 1 + yPercent 0, 1s duration
- Flowmap: dissipation 0.965, falloff 0.18, alpha 0.97, chromaticAberration 0.004

### P3. shanecollierdesign.ca
- **URL**: https://shanecollierdesign.ca/
- **Suka**: Swiss grid layout, konsep nyeleneh (intentional typo yang membuat bingung lalu tersenyum), SVG objects
- **Tidak Suka**: Style card di bawah Collaborated dan Sandbox
- **Teknik untuk Di-adopt**: Intentional imperfection as concept — typo-as-design, SVG decorative objects, Swiss grid layout

### P4. airborne.studio
- **URL**: https://www.airborne.studio/
- **Suka**: Grid layout hero, typography hero, effect mouse movement mengeluarkan object random (creative, artsy), motion scroll + text stretch memanjang, footer
- **Teknik untuk Di-adopt**: Mouse-spawns-random-objects interaction, text stretch on scroll, creative hero layout

### P5. buttermax.net
- **URL**: https://buttermax.net/
- **Suka**: Liquid effect pada mouse movement, 3D object yang berubah terkena tinta di hero, liquid scroll mengenai card. "feels so creative and ekspresif"
- **Teknik untuk Di-adopt**: Liquid/fluid interacting with 3D objects, liquid-on-card scroll reveal, creative ekspresif motion

### P6. grit.pictures
- **URL**: https://grit.pictures/
- **Suka**: Konsep artsy dan brutalis dengan assets-assetnya
- **Teknik untuk Di-adopt**: Brutalist concept with curated assets, artsy aesthetic

### P7. promo.emotion-agency.com
- **URL**: https://promo.emotion-agency.com/
- **Suka**: 3D storytelling, warna vibrant stunning cool palette, motion interaction
- **Teknik untuk Di-adopt**: 3D scroll storytelling, vibrant cool palette, immersive motion

### P8. rejouice.com
- **URL**: https://www.rejouice.com/
- **Suka**: Splashscreen seperti storytelling, grid layout hero, smooth scroll yang feelnya premium
- **Teknik untuk Di-adopt**: Storytelling preloader, grid hero layout, premium smooth scroll feel

### P9. farrynheight.com
- **URL**: https://farrynheight.com/
- **Suka**: Animasi marquee text di hero membentuk wave, saat scroll menjadi lurus
- **Teknik untuk Di-adopt**: Wave-to-straight marquee text animation driven by scroll — unique marquee variant

### P10. kota.co.uk
- **URL**: https://kota.co.uk/
- **Suka**: Typography, liquid effect di hero, grid layout, 3D object di "Celebrating 12 years"
- **Teknik untuk Di-adopt**: Liquid hero effect, 3D celebratory object, grid + liquid combination

### P11. stellapetkova.com
- **URL**: https://www.stellapetkova.com/
- **Suka**: Animasi splashscreen, grid layout hero
- **Teknik untuk Di-adopt**: Creative splashscreen animation, structured grid hero

### P12. arkon.digital
- **URL**: https://arkon.digital/
- **Suka**: Grid layout + typography di hero, planet object di hero dengan warna vibrant stunning aesthetic, planet objects berpindah pages
- **Teknik untuk Di-adopt**: Celestial/planet objects as hero assets, vibrant stunning colors on dark, persistent objects across page transitions

### P13. itsneat.digital
- **URL**: https://www.itsneat.digital/
- **Suka**: HANYA SVG objects saja. "selebihnya monoton dan boring"
- **Teknik untuk Di-adopt**: SVG decorative shapes with personality — geometric accents

### P14. leeroy.ca
- **URL**: https://www.leeroy.ca/
- **Suka**: Text effect splashscreen, mouse movement effect di hero (warna biru), section "Un collectif créatif" background + object stunning, biru suka, hover effect + scroll motion
- **Tidak Suka**: Warna terlalu pudar — "mungkin jika lebih vibrant saya bisa suka", dominasi ungu muda kurang suka
- **Teknik untuk Di-adopt**: Blue mouse movement effect (lebih vibrant), object + background composition, text splash effect

### P15. yogindersuria.live
- **URL**: https://www.yogindersuria.live/
- **Suka**: Assets bertema Yunani, object retro/vintage + nyeleneh namun artsy — Greek, Renaissance, Monalisa, sculpted art
- **Teknik untuk Di-adopt**: Greek/Renaissance/sculptural art assets — classical meets digital aesthetic

### P16. kfadv.it
- **URL**: https://www.kfadv.it/
- **Suka**: Object liquid plasma/prisma/glass, blur effect pada text hero, motion animasi text + object sebelum footer
- **Tidak Suka**: "selebihnya monoton dan boring"
- **Teknik untuk Di-adopt**: Liquid plasma/prisma/glass objects, blurry text hero effect, pre-footer motion sequence

### P17. crz.studio
- **URL**: https://www.crz.studio/
- **Suka**: Liquid effect di splashscreen, text touch effect di hero (tapi daspritam lebih keren)
- **Tidak Suka**: "section project grid mepet, section I'm a developer mepet", selebihnya biasa
- **Teknik untuk Di-adopt**: Liquid splashscreen, text touch distortion. **Anti-pattern**: cramped/mepet grid spacing

### P18. davidlangarica.dev
- **URL**: https://www.davidlangarica.dev/
- **Suka**: Konsep + sculpture Yunani objects, motion scroll object, motion di works section + stunning objects, style vibrant deep ungu + glow effects
- **Teknik untuk Di-adopt**: Sculptural art with scroll-driven motion, deep purple vibrant palette + glow effects, object-driven storytelling

### P19. azizkhaldi.com
- **URL**: https://azizkhaldi.com/
- **Suka**: HANYA object prisma/liquid/glass, grid layout di hero, neon marker saat scroll
- **Tidak Suka**: "selebihnya flat"
- **Teknik untuk Di-adopt**: Prisma/glass hero object, neon marker scroll reveal, hero grid layout

### P20. jesseermens.nl
- **URL**: https://www.jesseermens.nl/
- **Suka**: HANYA object prisma/logam/silver dengan lighting + blending text hero (premium), object di sections + motion object bergerak
- **Teknik untuk Di-adopt**: Prisma/logam/silver material objects with realistic lighting, object-text blending for premium feel

### P21. loandbehold.studio
- **URL**: https://loandbehold.studio/
- **Suka**: HANYA object liquid glass transparent di hero + motion object bergerak saat scroll
- **Tidak Suka**: Full white website
- **Teknik untuk Di-adopt**: Transparent glass/liquid object in hero, scroll-driven object motion

### P22. pashaink.com
- **URL**: https://pashaink.com/
- **Suka**: Grid layout hero, object pada hero (hypno effect + blurry + lighting → kesan mahal premium)
- **Tidak Suka**: "selebihnya monoton boring dan basic"
- **Teknik untuk Di-adopt**: Hypnotic blur object with lighting as hero centrepiece, grid hero layout

### P23. poison.studio
- **URL**: https://www.poison.studio/
- **Suka**: Sculpture art di hero, grid layout hero, text hover effect (artsy)
- **Tidak Suka**: "pinknya tidak begitu suka", "selebihnya terlalu template"
- **Teknik untuk Di-adopt**: Sculptural art hero, artsy text hover. **Anti-pattern**: template-looking design

### P24. abgd.it
- **URL**: https://www.abgd.it/
- **Suka**: HANYA Swiss grid layout saja
- **Teknik untuk Di-adopt**: Swiss grid layout reference

### P25. inspirux.com
- **URL**: https://inspirux.com/
- **Suka**: Cursor effect seperti kaca pembesar + liquid glass. "selebihnya biasa saja"
- **Teknik untuk Di-adopt**: Cursor-as-magnifying-glass with liquid glass effect — unique cursor interaction

### P26. studiobauhaus.eu
- **URL**: https://studiobauhaus.eu/
- **Suka**: Text effect di hero — inverse sebagian, negative space, blend mode hitam putih
- **Tidak Suka**: "selebihnya biasa saja boring dan monoton"
- **Teknik untuk Di-adopt**: Text inverse/negative space blend — partial black/white inversion on text

### P27. bluxstudio.com
- **URL**: https://bluxstudio.com/
- **Suka**: Text effect di hero seperti silver/logam/kaca → terkesan premium
- **Tidak Suka**: "selebihnya biasa saja"
- **Teknik untuk Di-adopt**: Silver/metallic/glass text effect on hero — premium text material feel

### P28. maxmartinez.com
- **URL**: https://www.maxmartinez.com/
- **Suka**: Konsep text acak yang menyatu saat scroll + object lingkaran. Bagus tapi tidak wow
- **Tidak Suka**: "selebihnya biasa saja boring dan monoton"
- **Teknik untuk Di-adopt**: Scattered-to-unified text scroll animation + circle motif

### P29. synchronized.studio
- **URL**: https://synchronized.studio/
- **Suka**: Typography, SVG accent (matahari berputar), vertical text "just about" (brutalist bebas), font hero + "selected case", Swiss grid text menu (about/work/recognition/contact + margin ke archive + arrow), typography "Awards and recognitions" section mewah di background hitam
- **Tidak Suka**: Warna ungu pastel di hero dan footer
- **Teknik untuk Di-adopt**: SVG rotating accent, vertical text (brutalist), Swiss grid menu layout, awards typography on dark

### P30. damngoodbrands.com
- **URL**: https://damngoodbrands.com/
- **Suka**: Splashscreen awal keren (saat masih fill putih berputar, SEBELUM berubah jadi real object), hero layout hitam bold, coretan merah artsy saat scroll
- **Tidak Suka**: Object realistik (dadu, kuda catur, ban, turbulence pesawat) — tidak suka, juga saat huruf 'd' berubah jadi warna/object
- **Teknik untuk Di-adopt**: Abstract geometric splash (pre-object phase), artsy red hand-drawn marks on scroll

### P31. designcanada.com
- **URL**: https://designcanada.com/watch
- **Suka**: Layout + typography style bold, text effect pada footer "watch"
- **Teknik untuk Di-adopt**: Bold typography, footer text effect

### P32. astralab.framer.website
- **URL**: https://astralab.framer.website/
- **Suka**: Text effect "Astra", layout melengkung unik (grid curves, hitam putih siang/malam), Projects section menu layout, Swiss grid setelah Pricing
- **Tidak Suka**: "kurang impress, terlalu clean, tidak dapat wow effect"
- **Teknik untuk Di-adopt**: Curved grid layout, B&W section transitions, project menu layout

### P33. thomasbarrial.dev
- **URL**: https://www.thomasbarrial.dev/
- **Suka**: Blending text effect di hero — element menabrak text heronya, motion hover selected works + cursor
- **Teknik untuk Di-adopt**: Element-through-text blending effect, creative hover on works with custom cursor

### P34. vitalinabender.com
- **URL**: https://www.vitalinabender.com/
- **Suka**: Grid + layout + style bold + typography di hero (SANGAT suka keseluruhan hero), text "where arts living on skill"
- **Tidak Suka**: "selebihnya biasa saja"
- **Teknik untuk Di-adopt**: Bold hero grid composition, typography hierarchy in hero

### P35. evmdsgn.com
- **URL**: https://www.evmdsgn.com/
- **Suka**: Text effect hero, grid layout hero. "feels aesthetic"
- **Teknik untuk Di-adopt**: Hero text effect + grid layout — aesthetic feel

### P36. olhalazarieva.com
- **URL**: https://www.olhalazarieva.com/
- **Suka**: Splashscreen (SANGAT suka), grid layout hero, scroll recent works POV berubah
- **Tidak Suka**: Background putih
- **Teknik untuk Di-adopt**: Creative splashscreen, scroll-driven POV change on work items

### P37. 15th.plus-ex.com
- **URL**: https://15th.plus-ex.com/
- **Suka**: Splashscreen, rotating object seiring scroll (elegan), motion text di "plus" section, grid typography REBIRTH (bold), smooth scroll
- **Teknik untuk Di-adopt**: Scroll-driven rotating object, bold REBIRTH-style grid typography, elegant motion choreography

### P38. timrijkse.nl
- **URL**: https://timrijkse.nl/
- **Suka**: Mouse interaction + scroll, beberapa konsep storytelling
- **Tidak Suka**: "overall terlalu biasa saja, boring, tidak ada wow effect yang diingat, feelnya kurang"
- **Teknik untuk Di-adopt**: Scroll storytelling concept (limited — execution kurang impressive)

### P39. changers.studio
- **URL**: https://changers.studio/
- **Suka**: Layout grid + glass cubic object, object di belakang "At our studio" dengan warna vibrant ungu, typography, motion scroll
- **Teknik untuk Di-adopt**: Glass cubic objects, vibrant purple behind text, grid + object composition

### P40. jeffkoonsmoonphases.com
- **URL**: https://jeffkoonsmoonphases.com/
- **Suka**: Silver text di hero, layout grid overview, typography title italic (Lunar Moon Phases Sculpture)
- **Teknik untuk Di-adopt**: Silver text effect, italic in title typography, grid overview layout

### P41. akaru.fr
- **URL**: https://akaru.fr/
- **Suka**: Motion interaction + rotating object di "Nos prix" — elegan
- **Teknik untuk Di-adopt**: Rotating object with elegant motion in awards/prix section

### P42. rise2.studio
- **URL**: https://rise2.studio/
- **Suka**: Text effect hero, design bold, warna neon
- **Tidak Suka**: "overall kurang karna kesannya terlalu sporty"
- **Teknik untuk Di-adopt**: Bold neon text hero effect. **Anti-pattern**: terlalu sporty aesthetic

### P43. deformo.framer.website
- **URL**: https://deformo.framer.website/
- **Suka**: Liquid effect di hero, typography di hero, motion scroll yang cinematic lalu muncul "We approach" secara perlahan
- **Tidak Suka**: Selebihnya tidak suka — hanya hero liquid + typography + cinematic scroll reveal yang menarik
- **Teknik untuk Di-adopt**: Liquid hero effect + cinematic scroll-to-reveal text ("We approach" perlahan muncul) — kombinasi liquid hero → scroll cinematic → slow text reveal sebagai narrative sequence

### P44. vertical.framer.media
- **URL**: https://vertical.framer.media/
- **Suka**: Layout grid hero, motion transisi ke section berikutnya, style bold dan vibrant. "overall style ini adalah style yang saya suka"
- **Tidak Suka**: Warna hijau neon
- **Teknik untuk Di-adopt**: Bold vibrant hero grid layout, cinematic section-to-section transition motion. **Anti-pattern**: hijau neon

### P45. kaitoresume.framer.website
- **URL**: https://kaitoresume.framer.website/
- **Suka**: Hero grid layout, motion + mouse effect ketika menyentuh text, motion tiap scroll "berasa mahal dan premium", typography bold, custom cursor hologram silver negative effect
- **Teknik untuk Di-adopt**: Text-on-hover mouse effect, per-section premium scroll motion, hologram/silver cursor dengan blend-mode negative effect

### P46. Framer Premium Templates (Marketplace)
- **URL**: https://www.framer.com/marketplace/templates/category/portfolio/?pricing=paid
- **Catatan**: User menyukai motion-motion dari Framer templates premium secara umum — smooth, cinematic scroll transitions. Framer sebagai benchmark motion quality: scroll yang terasa premium, section transitions yang cinematic, dan mouse interactions yang responsive
- **Teknik untuk Di-adopt**: Framer-level scroll smoothness dan cinematic motion sebagai quality benchmark — setiap section transition harus terasa se-smooth Framer templates premium

### P47. fieldtheory.framer.website
- **URL**: https://fieldtheory.framer.website/
- **Suka**: "sangat suka sekali layout grid hero disini sangat bold dan style vibrantnya, typography di heronya"
- **Teknik untuk Di-adopt**: Bold grid hero layout dengan vibrant color accents, luxury fashion aesthetic yang tetap bold — bukan muted/subtle

### P48. mobius.framer.website
- **URL**: https://mobius.framer.website/
- **Suka**: Font hero, UX dan accessibility (cursor berubah di card/video/clickable elements)
- **Teknik untuk Di-adopt**: Context-aware cursor — cursor berubah bentuk/state saat hover interactive elements (card, video, link). Cursor sebagai UX feedback, bukan hanya decorative

### P49. nivora.framer.website
- **URL**: https://nivora.framer.website/
- **Suka**: Text effect pada hero, footer premium dengan accent garis-garis dan typography
- **Teknik untuk Di-adopt**: Hero text reveal effect, premium footer dengan accent rule lines + bold typography. Footer bukan afterthought — footer = closing statement

### P50. mino-area.framer.website
- **URL**: https://mino-area.framer.website/
- **Suka**: Text effect pada hero
- **Teknik untuk Di-adopt**: Hero text animation effect — per-char atau per-word kinetic reveal

### P51. bravestudio.framer.website
- **URL**: https://bravestudio.framer.website/
- **Suka**: Text effect pada hero, animasi transition pada text hero, layout typography di section EVOLUTION, marquee text pada footer, design footer, font dan typography, object di marquee
- **Teknik untuk Di-adopt**: Hero text transition animation (kinetic type), EVOLUTION-style editorial typography layout, marquee footer dengan 3D/mixed objects, bold condensed display font. **Key pattern**: marquee sebagai design element, bukan filler

### P52. palmer-template.framer.website
- **URL**: https://palmer-template.framer.website/
- **Suka**: Splash animation dan transisi animasi masuk ke landing, grid layout bold, typography style "Blending design", font typography bold, blending text
- **Teknik untuk Di-adopt**: Cinematic splash→landing transition, bold grid layout, text blending/composite effects (mix-blend-mode pada typography), font bold condensed. Japanese katakana accent text (イメージ) sebagai visual texture

### P53. nakula.framer.website
- **URL**: https://nakula.framer.website/
- **Suka**: "layout grid heronya, bold", typography hero
- **Teknik untuk Di-adopt**: Bold grid hero layout dengan asymmetric placement, strong typographic hierarchy. Simple tapi impactful — tidak butuh banyak ornamen kalau grid + typography sudah kuat

### P54. porto-template.framer.website
- **URL**: https://porto-template.framer.website/
- **Suka**: Grid layout hero, typography hero bold, font, garis vertical hero
- **Teknik untuk Di-adopt**: Vertical accent lines di hero sebagai grid framework, bold condensed hero typography, structured grid layout. Vertical lines = Swiss grid DNA yang visible

### P55. auvra.framer.website
- **URL**: https://auvra.framer.website/
- **Suka**: Splashscreen, font
- **Teknik untuk Di-adopt**: Cinematic splashscreen/preloader, premium display font

### P56. raelle.framer.website
- **URL**: https://raelle.framer.website/
- **Suka**: Text effect hero "ada effect negative spacenya"
- **Teknik untuk Di-adopt**: Negative space text effect — text sebagai mask/cutout yang reveal konten di belakangnya. mix-blend-mode difference atau clip-path text masking

### P57. ivorytemplate.framer.website
- **URL**: https://ivorytemplate.framer.website/
- **Suka**: Custom cursor
- **Teknik untuk Di-adopt**: Custom cursor design — multi-layer, context-aware, blend-mode interactions

### P58. glyphdesign.framer.website
- **URL**: https://glyphdesign.framer.website/
- **Suka**: "typography full width di heronya kesan bold"
- **Teknik untuk Di-adopt**: Full-width viewport-filling typography di hero. Text = entire hero, bukan text + image combo. Typography IS the design

### P59. deformo.framer.website
- **URL**: https://deformo.framer.website/
- **Suka**: "effect cinematic di section", "background hero video liquidnya waternya"
- **Teknik untuk Di-adopt**: Cinematic section transitions, liquid/water video background (muted, looped, sebagai material — bukan content). Video sebagai atmospheric texture

### P60. pixelhivestudio.framer.website
- **URL**: https://pixelhivestudio.framer.website/
- **Suka**: Font typography
- **Teknik untuk Di-adopt**: Premium display font choice — font yang punya personality

### P61. najm.framer.website
- **URL**: https://najm.framer.website/
- **Suka**: "object liquid glass di hero"
- **Teknik untuk Di-adopt**: 3D liquid glass object sebagai hero centerpiece. Glass refraction + liquid animation = high-end feel. Connects dengan existing liquid glass nav preference

### P62. td-lovera.framer.website
- **URL**: https://td-lovera.framer.website/
- **Suka**: "sculpture heronya"
- **Teknik untuk Di-adopt**: 3D sculpture/statue sebagai hero visual element — Greek/Renaissance aesthetic yang sudah ada di object preferences

### P63. fabrica.framer.media
- **URL**: https://fabrica.framer.media/
- **Suka**: Splashscreen
- **Teknik untuk Di-adopt**: Cinematic splashscreen design — preloader sebagai first impression

### P64. effica.framer.ai
- **URL**: https://effica.framer.ai/
- **Suka**: "effect blending seperti di logo jika bertabrakkan", "text hero typography dengan blending effect seperti alumunium"
- **Teknik untuk Di-adopt**: Logo blend-on-collision effect (mix-blend-mode saat overlap), aluminum/chrome text effect pada hero typography. **Key**: metallic text treatment — bukan flat white, tapi reflective/brushed metal feel

### P65. arpeggio.framer.website
- **URL**: https://arpeggio.framer.website/
- **Suka**: "warnanya playful namun tetap artistic dan elegan", typography, color palette "pas, vibrant dan bold"
- **Teknik untuk Di-adopt**: Vibrant color palette yang tetap elegant (bukan childish). Bold warna + restrained layout = sweet spot. Color confidence tanpa mengorbankan sophistication

### P66. vyzn.framer.website
- **URL**: https://vyzn.framer.website/
- **Suka**: "motion cinematicnya", "text effect blendingnya di hero"
- **Teknik untuk Di-adopt**: Cinematic motion choreography, hero text blending effect — text dengan mix-blend-mode atau composite operation

### P67. portx.framer.ai
- **URL**: https://portx.framer.ai/
- **Suka**: "custom cursor dengan efek seperti hologram silver negative effectnya", "filter photo di UI DESIGNER"
- **Teknik untuk Di-adopt**: Hologram/silver cursor effect (blend-mode + gradient), photo filter effects pada portfolio images

### P68. lorris.framer.website
- **URL**: https://lorris.framer.website/
- **Suka**: "configurasi color palette semua begitu pas"
- **Teknik untuk Di-adopt**: Harmonious color palette configuration — warna yang saling mendukung, bukan random. Color theory mastery

### P69. mikebennet.framer.website
- **URL**: https://mikebennet.framer.website/
- **Suka**: Typography dan font
- **Teknik untuk Di-adopt**: Premium font pairing dengan strong personality

### P70. re-birth.framer.website
- **URL**: https://re-birth.framer.website/
- **Suka**: Font dan typography
- **Teknik untuk Di-adopt**: Bold display typography

### P71. kp9-portfolio-template.framer.website
- **URL**: https://kp9-portfolio-template.framer.website/
- **Suka**: "layout typography dan fontnya"
- **Teknik untuk Di-adopt**: Structured typography layout — hierarchy yang jelas antara display, body, dan label text

### P72. baseform.framer.website
- **URL**: https://baseform.framer.website/
- **Suka**: "layout grid heronya dan typographynya"
- **Teknik untuk Di-adopt**: Bold grid hero + typography combination

### P73. olyver.framer.website
- **URL**: https://olyver.framer.website/
- **Suka**: "fontnya keren", typography
- **Teknik untuk Di-adopt**: Distinctive display font

### P74. pixelcraft-studio.framer.website
- **URL**: https://pixelcraft-studio.framer.website/
- **Suka**: "motionnya ketika hover-hover dan accent-accentnya objectnya, konsepnya bagus, typographynya bagus. vibe: premium berkelas elegan"
- **Teknik untuk Di-adopt**: Hover micro-interactions pada objects/accents, premium elegant vibe tanpa over-design. Motion sebagai quality indicator — setiap hover terasa "mahal"

### P75. elwood.framer.website
- **URL**: https://elwood.framer.website/
- **Suka**: Font
- **Teknik untuk Di-adopt**: Distinctive font choice

### P76. benjamin.framer.wiki
- **URL**: https://benjamin.framer.wiki/
- **Suka**: "grid layout dan typographynya", "style seperti stiker di text 'Let's Create Something Amazing'"
- **Teknik untuk Di-adopt**: Bold grid layout + typography, sticker/badge style text treatment — text dengan background shape/border yang terasa seperti stiker. Playful detail tanpa mengorbankan professional feel

### P77. maverick.framer.ai
- **URL**: https://maverick.framer.ai/
- **Suka**: Grid layout hero, typography
- **Teknik untuk Di-adopt**: Bold grid hero layout, strong typography hierarchy

### P78. operator-template.framer.website
- **URL**: https://operator-template.framer.website/
- **Suka**: "motion mouse movement di heronya"
- **Teknik untuk Di-adopt**: Mouse movement reactive hero — parallax/tilt/displacement yang respond terhadap posisi mouse. Hero yang "hidup" mengikuti cursor

### P79. lumos-portfolio.framer.website
- **URL**: https://lumos-portfolio.framer.website/
- **Suka**: "section sesudah hero ada text effect silvernya dan negative space", font dan typography
- **Teknik untuk Di-adopt**: Silver/metallic text effect, negative space typography — text yang bermain dengan positive/negative space untuk create depth

### P80. td-senrifolio.framer.ai
- **URL**: https://td-senrifolio.framer.ai/
- **Suka**: "animasi intronya di hero begitu cinematic"
- **Teknik untuk Di-adopt**: Cinematic hero intro animation — choreographed entrance sequence yang terasa seperti film opening

### P81. archar.framer.website
- **URL**: https://archar.framer.website/
- **Suka**: "text effect dan fontnya ketika menabrak gambar di text 'Simplicity through design & Strategy'", "text effect ketika menabrak yang lain di 'Pushing boundaries'", "motion di 'Visual Feed' tiba-tiba layar membesar"
- **Teknik untuk Di-adopt**: Text-image collision effect (text berinteraksi visual saat overlap dengan image), viewport expansion animation (section yang tiba-tiba full-screen). **Key**: elemen yang saling berinteraksi, bukan hidup sendiri

### P82. andrew-williams.framer.website
- **URL**: https://andrew-williams.framer.website/
- **Suka**: "konsepnya, font dan typography bagus, feelnya simple dan cool"
- **Teknik untuk Di-adopt**: Simple + cool aesthetic — minimal tapi punya personality. Not boring-simple, tapi confident-simple

### P83. amelie.framer.media
- **URL**: https://amelie.framer.media/
- **Suka**: Layout hero, grid layout, typography
- **Teknik untuk Di-adopt**: Editorial grid layout, structured hero typography

### P84. brog.framer.website
- **URL**: https://brog.framer.website/
- **Suka**: "heronya, layout heronya, warna heronya, font dan typographynya" — semua aspek hero disukai
- **Teknik untuk Di-adopt**: Complete hero package — grid layout + color palette + bold typography yang semua bekerja harmonis. Hero sebagai total composition

### P85. agents.framer.website
- **URL**: https://agents.framer.website/
- **Suka**: "heronya keren, vibe: cool dan elegan", text effect blending
- **Teknik untuk Di-adopt**: Cool + elegant hero vibe, text blending effect. Art direction image + typography yang saling melengkapi

### P86. td-alexfolio.framer.website
- **URL**: https://td-alexfolio.framer.website/
- **Suka**: "heronya bold", "text effectnya negative space di hero"
- **Teknik untuk Di-adopt**: Bold hero + negative space text effect. Text sebagai cutout/mask

### P87. anderson-x-fahlevi.framer.website
- **URL**: https://anderson-x-fahlevi.framer.website/
- **Suka**: "object rubik alumunium glassnya", font
- **Teknik untuk Di-adopt**: 3D aluminum/glass geometric object (rubik cube style). Metallic + glass material = premium. Chrome/brushed metal aesthetic

### P88. oberg.framer.website
- **URL**: https://oberg.framer.website/
- **Suka**: "heronya bold"
- **Teknik untuk Di-adopt**: Bold hero presence — typography dan layout yang commanding

### P89. apexfilms.framer.website
- **URL**: https://apexfilms.framer.website/
- **Suka**: "typography boldnya, font family, hero layout grid"
- **Teknik untuk Di-adopt**: Bold cinematic typography, grid hero layout, premium font family

### P90. photographers.framer.website
- **URL**: https://photographers.framer.website/
- **Suka**: "text effect di hero", "bold hero"
- **Teknik untuk Di-adopt**: Hero text effect + bold presence

### P91. vanza.framer.website
- **URL**: https://vanza.framer.website/
- **Suka**: "text effect filternya", "typography dan font familynya"
- **Teknik untuk Di-adopt**: Text filter/distortion effect, premium font family selection

### P92. quomi.framer.website
- **URL**: https://quomi.framer.website/
- **Suka**: "object seperti barcodenya"
- **Teknik untuk Di-adopt**: Barcode/data-viz style decorative objects — technical/code aesthetic sebagai visual element. Pattern yang terasa "engineered"

### P93. unfixedstudio.framer.website
- **URL**: https://unfixedstudio.framer.website/
- **Suka**: "motion typography ketika scrollnya", "object silver cahayanya", "text animation di creative services"
- **Teknik untuk Di-adopt**: Scroll-driven kinetic typography, silver/chrome reflective objects, per-section text animation. Silver light = premium material

### P94. matteolucien.framer.website
- **URL**: https://matteolucien.framer.website/
- **Suka**: "heronya, typographynya bold dan vibrant, warna palletenya, grid layoutnya"
- **Teknik untuk Di-adopt**: Bold vibrant hero typography, cohesive color palette, structured grid layout. NY-based modern digital designer aesthetic — bold tanpa ornamen berlebihan

---

## Anti-Patterns (Yang TIDAK Disukai)

Dari feedback langsung dan implied:
- Monoton — semua section terasa sama
- AI slop — output yang terasa generated, formulaic
- Checklist design — desain yang "technically correct" tapi lifeless
- Sterile/corporate — terlalu bersih, terlalu rapi, tanpa personality
- Generic reveal animation — `opacity:0, y:30 → opacity:1, y:0` pada SEMUA elemen
- Static decoration — warna/effect yang tidak responsive terhadap user interaction
- **White background** — user explicitly menyatakan "dari segi background warna putih saya tidak begitu suka" (latchezarboyadjiev.com, loandbehold.studio, olhalazarieva.com feedback)
- **Full bright color backgrounds** — kuning, orange, atau warna solid penuh sebagai background hero. "saya tidak suka full color seperti kuning dan orange" (eseagency.ch)
- **Video-heavy design** — terlalu bergantung pada video. "saya menghindari video" (sileent.com)
- **Template-looking design** — "terlalu template" / generic layout yang terasa mass-produced (poison.studio)
- **Tight/cramped grid** — "grid mepet" tanpa breathing room (crz.studio: "section project saya tidak suka grid mepet, juga section I'm a developer mepet")
- **Too clean without wow** — "terlalu clean dan tidak terlalu dapat wow effectnya" (astralab.framer.website)
- **Pastel/muted colors on hero** — warna pudar/pastel di hero. "ungu pastel di hero saya tidak suka" (synchronized.studio). "terlalu pudar saya tidak begitu suka" (leeroy.ca)
- **Green on hero/dark background** — "warna hijaunya di heronya saya tidak suka" (junji-yamazaki.design)
- **Too sporty aesthetic** — "kesannya terlalu sporty" (rise2.studio)
- **Object di cards below fold yang generic** — "saya tidak suka style style card di bawah" (shanecollierdesign.ca)
- **Flat/boring without standout moment** — "selebihnya flat", "monoton boring dan basic" — site yang tidak punya memorable moment (pashaink.com, azizkhaldi.com, maxmartinez.com, dll)
- **Dadu/kuda catur/real-world objects** — object realistik random yang tidak cohesive dengan concept (damngoodbrands.com)

---

## Pattern Summary (Emerging from 100 References)

Sintesis dari seluruh reference — pattern yang muncul berulang kali membentuk identitas desain yang jelas.

### Top 10 Strongest Patterns

| Pattern | Frequency | Key References |
|---------|-----------|----------------|
| **Bold Hero Typography** | 40+ sites | Dominant pattern — hampir SEMUA references. Font condensed viewport-filling, extreme weight contrast |
| **Grid Layout Hero** | 25+ sites | fieldtheory, nakula, porto-template, baseform, benjamin, maverick, amelie, brog, matteolucien, kaitoresume, apexfilms, dll |
| **Swiss Grid as Layout Foundation** | 15+ sites | creativewebmanual, grids.obys, eseagency, porto-template (vertical lines), kaitonote, dll |
| **Text Blending / Negative Space Effects** | 15+ sites | raelle, effica, agents, vyzn, td-alexfolio, lumos-portfolio, archar, palmer-template, photographers, vanza |
| **Dark Background = Premium** | 15+ sites | daspritam, art-yakushev, chdartmaker, kaitonote, brog, matteolucien, agents, dll |
| **Cinematic Splash/Intro** | 10+ sites | palmer-template, auvra, fabrica, td-senrifolio, vyzn, deformo + existing main refs |
| **mix-blend-mode Strategies** | 10+ sites | art-yakushev, chdartmaker, latchezarboyadjiev, effica (aluminum), raelle (negative), agents, palmer-template |
| **Liquid/Glass Material** | 10+ sites | daspritam, najm, anderson-x-fahlevi, deformo + existing refs. Glass + liquid = signature |
| **Custom Cursor (Hologram/Silver/Context)** | 8+ sites | kaitoresume, portx, ivorytemplate, mobius, junji-yamazaki, inspirux |
| **Premium Hover Micro-interactions** | 7+ sites | pixelcraft-studio, mobius, operator-template, bravestudio, unfixedstudio |

### Object/Asset Preferences
| Suka | Tidak Suka |
|------|------------|
| Glass/prisma/liquid material | Dadu, kuda catur, real-world random |
| Greek/Renaissance sculpture (td-lovera) | Generic 3D objects |
| Aluminum/chrome geometric objects (anderson-x-fahlevi) | Sporty aesthetics |
| Silver/reflective light objects (unfixedstudio) | Full-color backgrounds |
| SVG geometric accents | Object yang tidak cohesive |
| Barcode/data-viz technical objects (quomi) | Template-looking elements |
| Thin morphing shapes (Lottie) | Pastel/muted palettes |

### Color Hierarchy
1. **Electric blue + cyan + indigo gradients** (PALING disukai — kaitonote, leeroy, portofolio sendiri)
2. **Vibrant + bold + playful tapi tetap elegant** (arpeggio, matteolucien — "pas, vibrant dan bold")
3. **Deep purple/violet vibrant + glow** (davidlangarica, changers)
4. **Red/aqua chromatic split** (daspritam — fluid)
5. **Silver/chrome/aluminum metallic** (effica, lumos-portfolio, unfixedstudio, anderson-x-fahlevi — MENINGKAT signifikan)
6. **Neon accents on dark** (rise2, arkon)
7. **HINDARI**: pastel, muted, hijau, kuning/orange full, pudar

### Footer Design Pattern (NEW)
- **Marquee text** — horizontal scrolling sebagai closing visual (bravestudio)
- **Accent rule lines** — garis dekoratif + bold typography (nivora)
- **Footer = closing credits** — bukan afterthought, tapi bagian dari narrative
- **3D objects in marquee** — mixed media (bravestudio)

### User's Sweet Spot (Identitas Desain — Updated)
```
Brutalist Expression + Premium Feel + Swiss Grid Structure
+ Dark Cinematic Background + Vibrant Accent Colors
+ Liquid/Glass Material Interaction + Bold Typography
+ Text Blending/Negative Space Effects + Metallic Material Accents
+ Hologram/Context-Aware Cursor + Cinematic Splash-to-Landing Transition
+ Marquee Footer as Closing Statement
= Billy Maulana's Design DNA (v2)
```

Site yang paling mendekati: **junji-yamazaki.design** ("ini style yang mendekati saya")
Effect yang paling stunning: **daspritam.in** ("most stunning")
Layout yang paling sering disuka: **Bold Grid Hero** (25+ references — DOMINAN)
Font yang paling sering disuka: **Condensed bold display** (40+ references)
Feel yang dicari: **"terasa mahal dan premium"** (muncul di 15+ verdicts)
Hero yang paling sering disuka: **Bold grid + condensed typography + text effect** (kombinasi 3 pattern)
Cursor yang dicari: **Hologram/silver/negative + context-aware** (8+ references)
Footer yang dicari: **Marquee + accent rules + bold typography** (3+ references)
Material yang dicari: **Chrome/aluminum/silver/glass** (10+ references — MENINGKAT)
