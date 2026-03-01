---
name: awwwards
description: Design vocabulary dan sensibilitas dari studio award-winning. Bukan checklist — ini cara berpikir yang membedakan situs biasa dari SOTD. Evolves dengan taste DNA user.
metadata:
  author: billymaulana
  version: "5.0"
  sources: tympanus.net/codrops, awwwards.com, medium.com, blog.maximeheckel.com
---

# Awwwards Design Vocabulary

Ini bukan aturan. Ini vocabulary — kumpulan teknik, sensibilitas, dan cara berpikir yang dipelajari dari praktisi nyata. Gunakan sebagai referensi saat membuat keputusan desain, bukan sebagai checklist yang harus dipenuhi.

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

---

## File Reference

### Industry & Strategy (NEW v3.0)
| File | Kapan Baca |
|------|-----------|
| `references/studio-workflows.md` | **Workflow studio pemenang**: Exo Ape, Lusion, Locomotive, Immersive Garden, Active Theory, Makemepulse, Cuberto — dari brief ke launch, timeline, prototyping, QA |
| `references/team-roles.md` | **Roles & tim**: Creative Director, Creative Developer, Motion Designer, 3D Artist — skill tree, salary, collaboration patterns, solo winners (Aristide Benoist, Bruno Simon) |
| `references/tech-stack-blueprint.md` | **Tech stack pemenang**: Next.js/Nuxt/Astro, GSAP (sekarang gratis), Lenis, Three.js/OGL, Barba.js, performance optimization, ideal stack blueprint |
| `references/soty-winners-analysis.md` | **SOTY 2019-2024**: Setiap winner dianalisis, scoring system detail, submission strategy ($60), tips timing, kenapa sites tidak menang, SOTD→SOTM→SOTY progression |
| `references/creative-dev-techniques.md` | **Code patterns**: Scroll storytelling, page transitions, cursor, text animation (SplitText, scramble, variable font), image effects, WebGL post-processing, preloader, sound design — dengan code snippets |

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
1. Baca `taste-dna.md` — apa preferensi user saat ini?
2. Tanyakan: "Apa yang ingin DIRASAKAN user di section ini?" (baca `emotional-design.md`)
3. Pilih teknik dari vocabulary yang cocok dengan intent
4. Check 3 levels: visceral (terlihat wow?), behavioral (terasa smooth?), reflective (diingat?)
5. Check persuasion layer: bias mana yang aktif di section ini? (baca `dark-psychology-for-portfolio.md`)
6. Jangan paksa teknik hanya karena "award-winning"

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
