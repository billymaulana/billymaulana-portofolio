---
name: awwwards
description: Design vocabulary dan sensibilitas dari studio award-winning. Bukan checklist — ini cara berpikir yang membedakan situs biasa dari SOTD. Evolves dengan taste DNA user.
metadata:
  author: billymaulana
  version: "6.3"
  sources: tympanus.net/codrops, awwwards.com, medium.com, blog.maximeheckel.com, practicaltypography.com, developer.mozilla.org, emilkowal.ski
---

# Awwwards Design Vocabulary

Ini bukan aturan. Ini vocabulary — kumpulan teknik, sensibilitas, dan cara berpikir yang dipelajari dari praktisi nyata. Gunakan sebagai referensi saat membuat keputusan desain, bukan sebagai checklist yang harus dipenuhi.

## Router — baca ini dulu, jangan seluruh sistem

Taste Engine berisi **85 file / 156.254 kata** di luar 147 entri `references/library/`. Itu di atas
kapasitas satu sesi, jadi "baca semuanya" bukan instruksi yang bisa dijalankan — dan sistem yang
tidak bisa dimuat berakhir diabaikan seluruhnya. Diukur 2026-08-02: containment tekstual antar file
maksimal **7,6%**, jadi volume ini **bukan duplikasi** dan tidak boleh dipangkas. Yang dibutuhkan
jalur masuk, bukan penghapusan.

**Inti — dibaca setiap sesi visual, apa pun pekerjaannya (11.266 kata):**

| File | Kata | Isi |
|---|---|---|
| `personal-taste-profile.md` | 5.428 | sumber kanonik taste |
| `anti-slop-rules.md` | 5.838 | 87 rule dari kegagalan nyata |

**Lalu tambahkan SATU jalur sesuai pekerjaan:**

| Pekerjaan | Tambahan | Kata | Gate mesin |
|---|---|---|---|
| Shader · WebGL · efek prosedural | `references/visual/README.md` | +904 | `effect-audit` (idle + active, `--ref` bila meniru rute lain) |
| Tipografi · masthead · pemilihan font | `references/editorial/01-typography-fundamentals.md` + `references/typography-execution-patterns.md` | +4.504 | `taste-lint` · `ink-audit` |
| Layout · grid · komposisi section | `references/editorial/02-grid-fundamentals.md` + `references/editorial/04-hierarchy-spacing-balance.md` | +3.700 | `layout-audit` (7 viewport) |
| Motion · scroll · transisi | `references/motion-architecture.md` + `references/math-for-motion.md` | +3.902 | `taste-lint` (easing, animated-props) |
| Menilai hasil · Billy menolak | `references/editorial/03-art-direction.md` §7C + `failures/INDEX.md` | +3.852 | adjective decoder → `evaluation-system.md` |
| Billy mengirim URL referensi | `references/library/SCHEMA.md` | +600 | `taste-index.mjs` |

Satu jalur = 12–16 ribu kata. Muat dalam satu sesi dengan sisa ruang untuk kode.

Sisa file di bawah adalah **lookup** — dibuka saat sebuah pertanyaan spesifik muncul, bukan dibaca
di muka. Tidak satu pun dari mereka wajib.

## Mindset Inti

**"Ide dulu, tool belakangan."** — Serhii Polyvanyi

Situs award-winning tidak menang karena shader keren atau animasi kompleks. Mereka menang karena **clarity of intent** — tahu APA yang ingin dikomunikasikan, lalu pilih HOW yang paling cocok.

### Yang Sama di Semua Studio Award-Winning
1. **Motion bukan afterthought** — dipikirkan sama seriusnya dengan layout dan typography
2. **Deep research sebelum pixel** — tidak langsung lompat ke Figma/code
3. **Technology invisible** — user merasakan experience, bukan tech stack
4. **Content drives design** — bukan template yang dipaksakan ke konten
5. **Transitions = scenes** — page change bukan "load", tapi narrative cut
6. **Setiap halaman adalah scene** — termasuk preloader, error page, loading state

### Yang Berbeda (Tapi Sama-Sama Berhasil)
- **Exo Ape**: atmospheric, sensory, humanizing complexity
- **Naked City Films**: brutalist, perpetual motion, structure tanpa predictability
- **BL/S**: cinematic, analog grit, planned imperfection
- **1820 Productions**: minimal stripping, motion sebagai satu-satunya material
- **Daniele Buffa**: bespoke, context-specific, rule-breaking with purpose

**Tidak ada satu formula.** Pilih approach yang cocok dengan PROJECT, bukan yang "keren".

## Core Principles — Non-Negotiable

### 1. Typography as Art
Typography BUKAN hanya content — ini **primary visual element**. Oversized headings, custom kerning, dan "reveal" animations (per-char stagger, clip-path, blur-to-sharp). Jika typography tidak dramatic, section gagal.

### 2. Fluid Motion (The GSAP Standard)
Setiap elemen HARUS punya "life". Checklist per project:
- Smooth scrolling (Lenis)
- Parallax pada images (data-speed layers)
- Magnetic hover pada buttons/cursors
- SVG morphing atau masking pada transitions
- Baca `math-for-motion.md` untuk memahami KENAPA motion terasa natural

### 3. Non-Standard Layouts
Break the 12-column grid. Overlapping elements, asymmetric sections, horizontal scrolling untuk case studies. Layout yang predictable = layout yang boring.

### 4. Micro-Interactions = "Expensive Feel"
Setiap click dan hover harus terasa mahal. Subtle easing: `power4.out` atau `expo.out` — BUKAN `power1` atau `linear`. Jika interaction terasa "murah", ganti easing-nya.

### 5. Storytelling Flow
Preloader = opening scene. Sections = chapters. Footer = closing credits. User harus MERASAKAN perjalanan, bukan "scrolling through blocks". Seamless transitions antar section.

### 6. Editorial Craft — Lapisan Tak Terlihat (NEW v6.0)
Teknik Level 5 dengan fondasi editorial yang lemah tetap ditolak — sudah terbukti dua kali
(`failures/2026-07-25-specimen-001.md`). Yang membedakan "demo keren" dari "terasa mahal"
adalah lapisan yang tidak disadari user: **tracking per ambang ukuran, leading terkunci per
tier, hukum spacing antar grup, measure, widow/orphan, karakter tipografi yang benar,
`tabular-nums`, optical alignment.**

Aturan: sebelum menambah efek baru, pastikan lapisan ini sudah benar. Efek baru di atas
fondasi yang salah hanya memperbesar masalah. Baca `references/editorial/`.

---

## File Reference — LOOKUP, bukan bacaan wajib

Tabel-tabel di bawah adalah katalog: dibuka saat ada pertanyaan spesifik, tidak dibaca di muka.
Jalur wajib per pekerjaan sudah ditetapkan di § Router. Kalau sebuah file di bawah tidak menjawab
pertanyaan yang sedang dihadapi, tutup dan lanjutkan — membaca lebih banyak referensi bukan
pengganti mengukur hasil.

### Kalibrasi & Testing (NEW v6.1) — SISTEM PENGUKURAN
Sebelumnya sistem ini punya knowledge dan enforcement tapi tidak punya **pengukuran** — skor
critic tidak pernah divalidasi terhadap penilaian Billy, dan dua hero lolos semua gate lalu
ditolak. Tiga lapis di bawah menutup lubang itu.

| File | Kapan Pakai |
|------|-----------|
| `calibration/README.md` | **Baca sebelum menilai apa pun.** Prosedur ketiga lapis + peringatan bahwa lint hijau ≠ lolos taste |
| `scripts/layout-audit.mjs` | **WAJIB sebelum klaim selesai untuk kerja visual.** Mengukur tabrakan bounding box antar elemen di 7 viewport (termasuk 1440×780 dan 1366×768 yang paling sering terlewat), teks keluar viewport, scroll-x, tap target, font terlalu kecil. `taste-lint` TIDAK menggantikannya — 15 rule-nya semua properti satu elemen, nol geometri antar-elemen |
| `scripts/ink-audit.mjs` | **WAJIB bersama `layout-audit`, tidak menggantikannya.** Mengukur dari `TextMetrics`, bukan dari `getBoundingClientRect`: tabrakan tinta antar baris, jarak nol antar elemen berperan berbeda, dan leading yang jatuh di bawah rasio tinta famili. **`layout-audit` meluluskan `/hero-explore-3` v3 di 7 dari 7 viewport; `ink-audit` menemukan 11 kegagalan pada halaman yang sama.** Kotak CSS lebih pendek daripada glyph saat `line-height` < 1, jadi audit berbasis kotak secara struktural buta terhadap apa yang dilihat mata |
| `scripts/effect-audit.mjs` | **WAJIB untuk kerja shader/WebGL/efek prosedural — satu-satunya audit yang membaca PIKSEL.** Tiga audit lain bersumber dari elemen teks, jadi pada rute tanpa teks ketiganya **lolos secara kosong**; `/explore/liquid/liquid-1` mendapat "semua audit hijau" persis lewat lubang itu. Enam rule: kerapatan detail, bidang rata, cakupan saat idle, disiplin hue, kehadiran warna identitas, dan **kesetiaan terhadap sumber** (`--ref`). Terbukti memisahkan `hero-2` yang disetujui (4 pass · 0 fail) dari dua rute yang ditolak (2 dan 3 fail) |
| `scripts/taste-lint.mjs` | **Pre-flight tiap review.** 15 rule deterministik dari computed style: tracking per ambang, leading per tier, rasio display:body, measure, `text-wrap`, `tabular-nums`, opacity floor, easing & properti animasi. `--emit` untuk kolektor browser, `--script` untuk IIFE |
| `references/evaluation-system.md` | **A-score + T-score.** Rubrik Awwwards DAN rubrik taste. Gate = `min(A,T) ≥ 8.0`, bukan rata-rata |
| `calibration/expectations.json` | Pilihan yang diprediksi aturan sistem untuk tiap pasangan uji — dasar deteksi aturan yang terbantah |
| `scripts/taste-calibration.mjs` | Metrik: false-positive rate (utama), accuracy, MAE, mood Jaccard, drift + validasi rubrik retrospektif |
| `calibration/predictions.jsonl` | Prediksi tersegel critic sebelum hasil ditunjukkan, diisi `actual` setelah verdict Billy |
| `calibration/assertions.jsonl` | Hasil sesi A/B dari route `/calibration` (dihapus 2026-10-30) — dataset preferensi berlabel |

**Alur wajib per review**: `layout-audit` (7 viewport) → **`ink-audit` (7 viewport)** → `taste-lint`
→ **`effect-audit` bila ada shader/WebGL/efek prosedural** → dua skor → prediksi tersegel →
presentasi → isi `actual` → `taste-calibration`. Melewati langkah prediksi membuat sistem tidak
bisa membuktikan ia membaik; melewati `layout-audit` membuat elemen bertabrakan lolos ke mata
Billy — sudah terjadi 2026-07-26 dan dua iterasi berturut-turut tidak menangkapnya.

**Hijau di satu audit BUKAN bukti untuk audit yang lain.** Keempatnya mengukur hal yang berbeda
dan sudah terbukti tidak saling menutupi:

| Audit | Sumber data | Buta terhadap |
|---|---|---|
| `taste-lint` | computed style satu elemen | hubungan antar elemen |
| `layout-audit` | `getBoundingClientRect` | tinta glyph di luar line-box |
| `ink-audit` | `TextMetrics` | warna, kontras, komposisi |
| `effect-audit` | piksel screenshot | tipografi, semantik, struktur DOM |

**Tiga yang pertama membaca DOM teks.** Pada halaman tanpa teks ketiganya lolos tanpa memeriksa
apa pun — bukan hijau, melainkan kosong. Setiap kali sebuah rute dilaporkan "semua audit hijau",
periksa dulu apakah ada elemen yang benar-benar diperiksa; kalau jumlah elemen nol, laporan itu
tidak bernilai. Ini akar `/explore/liquid/liquid-1` (2026-08-02).

Tidak satu pun mengukur kualitas desain. Keempatnya hanya membuktikan tidak ada cacat mekanis.

**Prosedur `effect-audit`** (butuh dua screenshot, bukan satu):

```bash
# 1. idle — reload, tunggu 2-3s TANPA menyentuh mouse
node docs/awwwards/scripts/effect-audit.mjs shot-idle.png --idle --identity "#0047FF"

# 2. active — gerakkan kursor, screenshot saat efek hidup
node docs/awwwards/scripts/effect-audit.mjs shot-active.png --identity "#0047FF"

# 3. kalau efek diklaim diambil dari rute lain, WAJIB bandingkan
node docs/awwwards/scripts/effect-audit.mjs shot-active.png --ref sumber-active.png
```

### Editorial Foundations (NEW v6.0) — BACA DULUAN
Lapisan fundamental. Referensi lain mengajarkan teknik; folder ini menentukan apakah teknik
itu terlihat mahal atau terlihat seperti demo.

| File | Kapan Baca |
|------|-----------|
| `references/editorial/README.md` | **Peta + gate editorial 9 poin.** Mulai dari sini |
| `references/editorial/01-typography-fundamentals.md` | **Sebelum memilih font apa pun** — klasifikasi typeface (serif 4 grup, sans 4 grup), anatomi, display vs text cut / optical size, 3 jalur pairing + 5 dimensi kontras, type scale ganda (text 1.2 · display 1.5–1.618), tabel tracking/leading per ambang ukuran, micro-typography (karakter benar, OpenType, widow/orphan, hanging punctuation, optical alignment) |
| `references/editorial/02-grid-fundamentals.md` | **Sebelum menentukan layout** — anatomi 7 bagian, konstruksi Müller-Brockmann (measure → gutter → margin → kolom), 7 tipe grid, compound grid, 10 kesalahan umum, angka grid portfolio ini, baseline grid + debug overlay + `text-box-trim` |
| `references/editorial/03-art-direction.md` | **Di awal setiap project/redesign** — intake 9 pertanyaan, peta kompetitor, 8 slider kepribadian, brand values yang mengikat, aturan moodboard, dan **adjective decoder**: menerjemahkan "AI slop"/"biasa saja"/"terasa mahal" jadi dimensi terukur |
| `references/editorial/04-hierarchy-spacing-balance.md` | **Saat menyusun section** — hukum tiga alat, hukum spacing (antar grup ≥ 2× dalam grup), skala spacing terikat baseline, rumus bobot visual, kurva ritme 5 gerakan, aturan skala (rasio display:body ≥ 5×) |
| `references/editorial/05-developing-taste.md` | **Saat evaluasi & capture referensi** — taste gap, tiga praktik, **mood taxonomy 18 token + 5 anti-mood** dengan penanda terukur, mood target per section, filter referensi 3 pertanyaan, loop mingguan |

### Industry & Strategy (NEW v3.0)
| File | Kapan Baca |
|------|-----------|
| `references/studio-workflows.md` | **Workflow studio pemenang**: Exo Ape, Lusion, Locomotive, Immersive Garden, Active Theory, Makemepulse, Cuberto — dari brief ke launch, timeline, prototyping, QA |
| `references/team-roles.md` | **Roles & tim**: Creative Director, Creative Developer, Motion Designer, 3D Artist — skill tree, salary, collaboration patterns, solo winners (Aristide Benoist, Bruno Simon) |
| `references/tech-stack-blueprint.md` | **Tech stack pemenang**: Next.js/Nuxt/Astro, GSAP (sekarang gratis), Lenis, Three.js/OGL, Barba.js, performance optimization, ideal stack blueprint |
| `references/soty-winners-analysis.md` | **SOTY 2019-2024**: Setiap winner dianalisis, scoring system detail, submission strategy ($60), tips timing, kenapa sites tidak menang, SOTD→SOTM→SOTY progression |
| `references/creative-dev-techniques.md` | **Code patterns**: Scroll storytelling, page transitions, cursor, text animation (SplitText, scramble, variable font), image effects, WebGL post-processing, preloader, sound design — dengan code snippets |

### Taste Feedback Loop (WAJIB)
| File | Kapan Baca |
|------|-----------|
| `anti-slop-rules.md` | **Setiap awal job visual.** Rule append-only dari kegagalan nyata |
| `failures/INDEX.md` | **Sebelum memilih font/teknik.** Daftar font & pola yang sudah ditolak Billy |
| `failures/SCHEMA.md` | Saat Billy menolak output — format wajib failure note + screenshot |
| `references/library/SCHEMA.md` | Saat Billy memberi link referensi baru — field wajib + 5 dimensi analisis |
| `references/visual/README.md` | **Sebelum memilih palet atau teknik shader.** 26 poster/artwork yang Billy kirim, dipecah 7 kategori. Berisi ramp termal terkonsolidasi dan tabel teknik→shader |
| `references/typography-execution-patterns.md` | **Sebelum menetapkan tracking/leading/weight.** Pola terukur dari 104 situs; membantah asumsi monotonik tracking |
| `personal-taste-profile.md` | Sumber kanonik taste. Cek sebelum keputusan desain apa pun |

Protokol pemicunya ada di `CLAUDE.md`: **Rejection Protocol** (Billy bilang "jelek")
dan **Reference Capture Protocol** (Billy kirim URL).

### Design & Theory
| File | Kapan Baca |
|------|-----------|
| `references/visual-theory.md` | Fondasi teori visual: hierarchy (8 faktor), eye movement (F/Z pattern), Gestalt (7 prinsip), color theory, compositional balance, depth/layering, negative space, art direction |
| `references/visual-vocabulary.md` | Saat pilih typography, warna, layout, atmospheric detail |
| `references/typography-mastery.md` | **Typography mendalam** (NEW v4.0): type scale ratios, fluid clamp(), font pairing strategies, variable fonts, CSS techniques, GSAP SplitText, winner typography patterns |
| `references/color-mastery.md` | **Color mendalam** (NEW v4.0): OKLCH color space, color-mix(), dark theme layering, gradients, WebGL post-processing, CSS blend modes, winner color patterns |
| `references/style-dna-guide.md` | **Style DNA** (NEW v4.0): 14+ style categories (Swiss, Brutalist, Atmospheric, Cinematic, dll), studio signatures, style mixing rules, hybrid approaches |
| `references/emotional-design.md` | "How it feels": Don Norman 3 levels, Walter's hierarchy, 6 dimensi feel, emotion mapping per section |
| `references/dark-psychology-for-portfolio.md` | Dark psychology persuasi: Halo Effect, Zeigarnik, Cognitive Friction, Veblen, Peak-End, Von Restorff, Authority Bias — persuasion stack per section |
| `references/ux-laws-for-awwwards.md` | UX laws yang relevan untuk award-level design — Doherty, Peak-End, Von Restorff, dll |
| `references/ux-and-accessibility.md` | **UX & A11y** (NEW v4.0): Awwwards usability scoring criteria, WCAG compliance, reduced motion patterns, keyboard navigation, semantic HTML, performance metrics |

### Layout & Grid
| File | Kapan Baca |
|------|-----------|
| `references/grid-techniques.md` | **UPDATED v4.0**: Grid systems mendalam — Swiss grid, 4 tipe Obys, bento grid, breaking the grid (11 teknik), spacing ratios (Fibonacci, golden ratio, base-8), CSS subgrid, fluid spacing, grid + GSAP animation |
| `references/layout-composition.md` | **UPDATED v4.0**: Layout composition mendalam — hero patterns (staircase, counter-position, centered, overlapping), depth layering (5-layer z-stack), editorial grid details, footer composition, responsive strategy, negative space techniques |

### Motion & Code
| File | Kapan Baca |
|------|-----------|
| `references/motion-architecture.md` | Saat implement animasi, transition, cursor, scroll system |
| `references/motion-mastery.md` | 7 signature techniques (video scrub, parallax, micro-interactions, cinematic scroll, preloader, 3D text, SplitText) + GSAP ecosystem |
| `references/math-for-motion.md` | Matematika: lerp, bezier, spring physics, easing functions, trigonometry |
| `references/kinetic-typography.md` | Kinetic typography: motion vs fluid type, Three.js render target, SVG stroke drawing, variable font, MorphSVG |
| `references/shader-and-3d-craft.md` | Shader & 3D: GLSL, noise, particles, displacement — dari Book of Shaders & Three.js Journey |
| `references/interaction-craft.md` | Page transition, preloader, hover, DOM patterns |
| `references/liquid-advanced.md` | **NEW v5.0**: GSAP sebagai shader conductor — scroll velocity → uniform, CustomEase cinematic, Observer, Flip, liquid preloader, curl noise, reaction-diffusion, metaballs, chromatic aberration post-processing |
| `references/liquid-shaders.md` | **NEW v5.0**: GLSL code patterns — ripple distortion, liquid morph, heat haze, barrel distortion, LBM/SPH fluid sim, liquid glass refraction, Kawase blur, caustics, dispersion, text-as-liquid (MSDF, particles, fill), bloom pipeline, ACES tonemapping, feedback trail |

### Strategy & Analysis
| File | Kapan Baca |
|------|-----------|
| `references/evaluation-system.md` | Audit kesiapan site untuk submission — scoring criteria & strategy |
| `references/site-analysis-framework.md` | "Don't Copy, Understand" — framework 5-layer untuk analisis website award-winning |
| `references/case-study-methodology.md` | **Case studies** (NEW v4.0): Awwwards case study structure, Codrops format, portfolio presentation best practices |
| `references/taste-dna.md` | SELALU baca — taste preferences user, reference sites yang dianalisis |
| `references/awwwards-gap-analysis.md` | **NEW v5.0**: Gap analysis brutal — 8 critical gaps dari "fungsional" ke "stunning", studio analysis (Exo Ape, Lusion, Immersive Garden, Aristide Benoist, Bruno Simon), polish layer checklist, scoring breakdown |

### Education & Courses (NEW v4.0)
| File | Kapan Baca |
|------|-----------|
| `references/awwwards-academy-courses.md` | **20 Awwwards Academy courses** disintesis: Design/Art Direction (11), Animation/Motion (5), Creative Coding/3D/WebGL (4) — instructor insights, animation system framework, Floema architecture, 3D pipeline, priority layers, tool mapping ke Nuxt+GSAP+WebGL stack |

## Quick Decision Guide

### Sebelum Implement Apapun
1. Baca `personal-taste-profile.md` — sumber kanonik taste
2. Tulis **mood target** 2–3 token dari `references/editorial/05-developing-taste.md` §4
3. Tanyakan: "Apa yang ingin DIRASAKAN user di section ini?" (baca `emotional-design.md`)
4. Pilih teknik dari vocabulary yang cocok dengan intent
5. Check 3 levels: visceral (terlihat wow?), behavioral (terasa smooth?), reflective (diingat?)
6. Check persuasion layer: bias mana yang aktif di section ini? (baca `dark-psychology-for-portfolio.md`)
7. Jangan paksa teknik hanya karena "award-winning"

### Setelah Build, Sebelum Klaim Selesai
1. **`taste-lint` dulu** — `node docs/awwwards/scripts/taste-lint.mjs .nuxt/snap-<slug>.json` (prosedur: `calibration/README.md`)
2. **Gate editorial 9 poin** — `references/editorial/README.md` § Gate editorial
3. **5 tes anti-slop** — OBJECT / SWAP / EMPTY / WOW / NEIGHBOR (`anti-slop-rules.md`)
4. Squint test + grayscale test per section (`references/editorial/04-*.md` §1)
5. Verifikasi mood yang keluar = mood target; kalau meleset, sebutkan **penanda mana** yang gagal
6. **Dua skor + gate `min(A,T) ≥ 8.0`** — `references/evaluation-system.md`
7. **Prediksi tersegel** ke `calibration/predictions.jsonl` SEBELUM presentasi
8. Browser review wajib (Chrome DevTools MCP) — screenshot + console bersih

`taste-lint` hijau mengukur kebenaran eksekusi, **bukan** selera — dua route yang sudah ditolak
Billy mendapat jumlah PASS yang mirip dengan halaman utama. Jangan pernah menyajikannya sebagai
bukti kualitas desain.

### Saat User Menolak ("jelek" / "AI slop" / "biasa saja")
Jangan langsung memperbaiki. Terjemahkan dulu lewat **adjective decoder**
(`references/editorial/03-art-direction.md` §7C) → identifikasi baris mana yang benar-benar
gagal beserta angkanya → baru perbaiki yang itu. Lalu jalankan Rejection Protocol di `CLAUDE.md`.

### Saat Riset Inspirasi dari Website Lain
**Rule: Don't Copy, Understand** (baca `site-analysis-framework.md`)
1. Identify technique — APA animasi/layout yang dipakai?
2. Understand purpose — KENAPA teknik ini? Apa yang dikomunikasikan?
3. Analyze timing — Note easing, duration, stagger, multipliers
4. Map to implementation — BAGAIMANA build ini? Composable existing?
5. Adapt to context — COCOK tidak dengan project ini? Unique twist apa?
6. Simpan analisis di `taste-dna.md` section Reference Sites

### Motion: Kapan Pakai Apa
| Situasi | Teknik |
|---------|--------|
| Section reveal | clipPath, blur-to-sharp, atau per-char stagger — BUKAN opacity+y |
| Page transition | Freeze scroll + animate out/in sebagai scene cut |
| Hover feedback | Morphing, displacement, magnetic — bukan hanya opacity |
| Background ambiance | Inertia-driven parallax, noise texture, blending modes |
| Loading | Cinematic opening — preloader = first impression |

### Layout: Kapan Pakai Apa (baca `layout-composition.md`)
| Situasi | Pattern |
|---------|---------|
| Hero section | Staircase indent (safe), counter-position (bold), centered monumental (dramatic) |
| About/manifesto | Van de Graaf proportions, golden ratio 2-column |
| Projects showcase | Overlapping layers, bento grid, horizontal scroll |
| Contact/CTA | Full-screen centered, big typography |
| Footer | 3-column grid, marquee ticker, stacked reveal |
| Depth layering | 5-layer z-stack: background(1) → atmosphere(2-3) → ghost(3-5) → content(10) → overlay(50+) |

### Visual: Prinsip Universal
| Aspek | Prinsip |
|-------|---------|
| Warna | Punya narasi — pilih warna yang ceritakan sesuatu, bukan dari generator |
| Typography | Extreme contrast antara headline dan body (weight, size, spacing) |
| Layout | Content-responsive — setiap section dapat spatial logic yang cocok (baca `layout-composition.md` + `grid-techniques.md`) |
| Atmosphere | Noise, blending modes, subtle gradients — detail yang terasa tapi tidak mencolok |
| Imperfection | Planned — italic pertama, jittery motion, analog noise memberi soul |

## Research Sources

### Untuk Riset Design, Referensi UI/UX, Tutorial & Effect
| Site | URL | Gunakan Untuk |
|------|-----|---------------|
| Tympanus/Codrops | https://tympanus.net/ | Design reference, UI/UX inspiration, effect tutorials, creative coding demos |
| Awwwards | https://www.awwwards.com/ | Award-winning site showcase, SOTD/SOTY benchmark, design trends, studio portfolios |
| Awwwards Free Fonts | https://www.awwwards.com/awwwards/collections/free-fonts/ | Koleksi free fonts yang dipakai di situs award-winning |
| Laws of UX | https://lawsofux.com/ | UX laws & psychology principles untuk design decisions |
| The Book of Shaders | https://thebookofshaders.com/ | GLSL fundamentals — shaping functions, noise, patterns, image processing |
| Three.js Journey | https://threejs-journey.com/ | Three.js + shader techniques — particles, post-processing, scroll-driven 3D |
| Awwwards Academy (Motion) | https://www.awwwards.com/academy/courses/motion | Motion design courses — Louis Ansa, Daniele Buffa, animation systems |
| Made With GSAP | https://madewithgsap.com/ | 50 GSAP effects dengan step-by-step tutorial & downloadable code |
| JSMastery (GSAP) | https://jsmastery.com/course/gsap-animations-course | Awwwards-level GSAP course — scroll video scrub, cinematic effects |
| Easing Functions | https://easings.net/ | 30 easing functions visualized — cheat sheet untuk memilih curve |
| Maxime Heckel (Math) | https://blog.maximeheckel.com/posts/cubic-bezier-from-math-to-motion/ | Bezier math → motion, spring physics — deep dive matematika animasi |
| Codrops Kinetic Type | https://tympanus.net/codrops/2024/08/13/kinetic-typography-with-three-js/ | Three.js render target workflow — teks 2D pada permukaan 3D geometry |
| Codrops SVG Type Anim | https://tympanus.net/codrops/2025/01/08/bringing-letters-to-life-svg-typography-animation/ | SVG stroke-dashoffset letter drawing animation technique |
| Composite (Pacing) | https://www.composite.global/news/scroll-fatigue-and-the-case-for-digital-pacing | Scroll fatigue, digital pacing, rhythm & breathing space dalam web design |
| UXmatters (Emotion Zones) | https://www.uxmatters.com/mt/archives/2025/11/the-emotional-map-of-user-interface-zones.php | Emotional mapping of UI zones — header, middle, margins, footer psychology |
| Smashing (Web Audio) | https://www.smashingmagazine.com/2021/06/web-design-done-well-audio/ | Sound design for web — ambient, interaction SFX, narrative audio, implementation |
| GRIDS by Obys | https://grids.obys.agency/ | 4 tipe grid interaktif (Columns, Van De Graaf, Rectangular, Others) — SOTM Sep 2021, educational |
| Mew Design (Swiss) | https://docs.mew.design/blog/swiss-design-style/ | Swiss Style principles — grid, typography, color, whitespace, objectivity, modern applications |
| Pixeldarts (Swiss Web) | https://www.pixeldarts.com/post/swiss-style-web-design-a-comprehensive-guide | Swiss style applied to web — CSS Grid implementation, responsive, modern adaptation |
| Aguayo (Zeigarnik) | https://aguayo.co/en/blog-aguayo-user-experience/zeigarnik-effect-how-to-apply-it-in-ux/ | Zeigarnik Effect di UX — cognitive tension, progress indicators, incomplete task hooks |
| LearningLoop (Authority) | https://learningloop.io/plays/psychology/authority-bias | Authority bias — credential stacking, visual authority signals, ethical trust-building |
| Zajno motion.ed | https://motion.zajno.com/ | Kurikulum motion 8 bab (easing, offset/delay, fade, morph, masking, dimension, parallax, zoom) + pemetaan prinsip Disney; arsitektur scrub-first GSAP+Lenis terukur (bobot durasi sebagai rasio, tiga tingkat `scrub`, disiplin 0.3/0.4/0.7s). Bedah lengkap: `references/library/zajno-motion.md` |
| Practical Typography (Butterick) | https://practicaltypography.com/typography-in-ten-minutes.html | Angka fondasi: point size 15–25px web, line spacing 120–145%, measure 45–90 karakter |
| MDN — text-wrap | https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap | `balance` (≤6 baris Chromium / ≤10 Firefox) & `pretty` — Baseline sejak Maret 2024 |
| MDN — text-box-trim | https://developer.mozilla.org/en-US/docs/Web/CSS/text-box | Cap-height trimming untuk baseline presisi — Limited Availability, butuh fallback |
| MDN — hanging-punctuation | https://developer.mozilla.org/en-US/docs/Web/CSS/hanging-punctuation | Optical alignment tanda kutip — BUKAN Baseline, wajib fallback `text-indent` |
| Pixelambacht (Optical Size) | https://pixelambacht.nl/2021/optical-size-hidden-superpower/ | Sumbu `opsz` variable font — display vs text cut |
| Google Fonts Knowledge (OpenType) | https://fonts.google.com/knowledge/choosing_type/implementing_open_type_features_on_the_web | `font-variant-*` vs `font-feature-settings`, tabular-nums, ligature |
| Awwwards Academy (Cuchillo) | https://www.awwwards.com/academy/course/from-poster-to-screen-designing-editorial-based-websites | From Poster to Screen — editorial web design, know the rules & break them |
| Emil Kowalski (Taste) | https://emilkowal.ski/ui/developing-taste | Tiga praktik pengembangan taste — paparan, analisis, repetisi |
| Readymag (Train Taste) | https://blog.readymag.com/how-to-train-your-taste/ | Filter referensi spark/strength/service, moodboard sebagai alat berpikir |
| Grid Maker Pro (Baseline) | https://gridmakerpro.com/grids/typography-grids/baseline-grid/ | Baseline grid & vertical rhythm — unit, snapping, kapan dilonggarkan |
| Moyra Capsules | https://capsules.moyra.co/ | Single-family Host Grotesk 20 KB, rasio 12.8×, tracking dikunci px bukan em; sistem satuan fluid `@`-prefix pada design base 1920 tanpa CSS Grid; 7 easing tanpa CustomEase. Bedah lengkap: `references/library/moyra-capsules.md` |
| Texture & pattern sources | `references/texture-resources.md` | 14 sumber tekstur dengan lisensi terkutip verbatim + status curl, argumen prosedural vs raster berangka, pemetaan 5 kebutuhan tekstur proyek, snippet SVG `feTurbulence` & Bayer 8×8 GLSL |
| Texture asset manifest | `public/assets/textures/CREDITS.md` | Provenance + lisensi + SHA-256 tiap berkas tekstur yang di-commit; aturan CC0-only selama repo publik |

*(User akan menambahkan lebih banyak source seiring waktu)*

### Sumber Knowledge (v4.0 — 50+ Sumber)

**Codrops Developer Spotlights & Case Studies:**
1. Jason Bergh — cinematic presence, analog grit, planned imperfection
2. 1820 Productions — minimal design, maximal motion, monochrome
3. Serhii Polyvanyi (BL/S) — blending modes, asymmetric typography, noise
4. Exo Ape — narrative-led, atmospheric, human-centered, fluid team model
5. Vladyslav Penev — production motion systems, CSS variables architecture
6. Daniele Buffa — bespoke solutions, rule-breaking with purpose
7. Naked City Films — perpetual motion, brutalist foundation, CRT shaders
8. Thomas Monavon & Gregory Lalle — designer-developer duo, daily feedback loop
9. Stefan Vitasovic — Next.js + R3F + Framer Motion portfolio (SOTD 2025)
10. Quentin Hocde — ex-Locomotive, locomotive-scroll contributor, 10yr experience
11. Robin Payot — freelance WebGL specialist, UNIT9/84.Paris/Upperquad
12. Jorge Toloza — DDS Studio, Nuxt.js, vanilla JS preference
13. Adrian Gubrica — OGL optimization, procedural textures, OFF+BRAND
14. Roman Jean-Elie — R3F portfolio, MeshPortal, fold/curl effects
15. Stas Bondar — Astro + ordered dithering + GSAP Draggable portfolio
16. Federico Pian — Nuxt 3 + TresJs portfolio, Awwwards Academy student

**Studio Interviews & Case Studies (Awwwards/Medium):**
17. Active Theory — Hydra framework, Nuke post-processing, custom WebGL
18. Lusion — mood board → Houdini → WebGL production pipeline
19. Immersive Garden — Studio of the Year 2024, gltf-transform pipeline, KTX
20. Makemepulse — SOTY 2019 (Nomadic Tribe), narrative-first, internal R&D
21. Locomotive — 7x Agency of Year, 25 orang, open-source locomotive-scroll
22. Jam3 — dedicated team per project, lead ownership model
23. Cuberto — brothers-founded, developer-designer side-by-side
24. Pixelflakes — AE motion studies untuk prototype validation
25. Zajno — 7-year iteration, scroll-based architecture overhaul

**Individual Winners:**
26. Aristide Benoist — 3x Independent Dev of Year, vanilla WebGL, self-taught
27. Bruno Simon — Dev SOTY 2019, Three.js Journey teacher, 3D car portfolio
28. Niccolo Miranda — Awwwards Jury, Academy instructor, cinema-inspired

**Conference & Courses:**
29. Awwwards Conference 2024 — small teams, AI + creativity, Unseen Studio process
30. FrontendMasters (Matias Gonzalez) — Build Immersive Award-Winning Websites
31. Darkroom Engineering (Satus starter) — Next.js + Lenis + Theatre.js blueprint

**Awwwards Academy Courses (NEW v4.0 — 20 courses):**
32. Louis Ansa — Animation system framework, animated tokens (duration, easing, stagger), master components
33. Louis Paquet (TUX/Locomotive) — Purpose-driven motion: guide, emote, feedback
34. Luis Henrique Bizarro — Floema architecture (vanilla JS + OGL + GSAP + Prismic), SOTD winner, page transitions
35. Celia Lopez — 3D-to-WebGL pipeline: Four Rules (power-of-two, normals, centered, topology), C4D/Blender → glTF
36. Bruno Imbrizi — Creative Coding 2.0: particles, noise, Web Audio API, generative art
37. Helene Vetik & Karl Saluveer (AKU) — Nordic Design: restrained, functional, content-first
38. Viacheslav Olianishyn (Obys) — Creative Practices: brief-to-design pipeline, 10-module process
39. Mario Sestak (Bornfight) — Flawless Typography: theory-first, hierarchy, spacing, rule-breaking
40. Duarte Pires (Duall Studio) — Art Direction: briefing → moodboard → Figma → After Effects
41. Britton Stipetic (Rogue Studio) — Secret Sauce: Emotion/Culture/Aesthetics branding framework
42. Olga Shevchenko (Vintage) — Creative Web Design: custom grids, animation UX, case studies
43. Niccolo Miranda — Brand Identity & Website: digital-first process, Figma component library
44. Marek Suchanek (Creative Nights) — Contemporary Trends: SOTD/SOTM deconstruction checklist
45. Chiara Aliotta — Narrative Web: three-act UX structure, user-as-protagonist
46. Marcel Hita Baro + Jaume Mestre — Advanced 2D+3D Motion: styleframe-first, C4D + AE pipeline
47. Joseph Berry (Jomor Design) — Award Winning Webflow Animation: scroll, parallax, typography
48. Media.Monks team — Holistic Design: cross-discipline integration, prototyping, user testing

**Deep Research (v4.0):**
49. Typography research (4 sources) — type scale, font pairing, CSS techniques, winner patterns
50. Color research (3 sources) — OKLCH, color-mix(), dark themes, gradients, WebGL post-processing
51. Grid/Layout research (3 sources) — Swiss grid systems, spacing ratios, layout composition patterns
52. Style DNA research (2 sources) — 14+ categories, studio signatures, hybrid mixing rules
53. UX/Accessibility research — Awwwards usability criteria, WCAG, reduced motion, performance
