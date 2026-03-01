# Studio Workflows & Process — Awwwards Winners

Bagaimana studio-studio pemenang Awwwards mengorganisir project dari brief sampai launch.

---

## Model Umum: 5-7 Fase

### Fase 1: Discovery & Strategy (1-3 minggu)
- Memahami brand, audiens, tujuan bisnis
- Riset kompetitor dan referensi visual
- Mood boards (patterns, colors, history) — Lusion memulai semua project dengan ini
- Definisi tone, mood, personality

### Fase 2: Art Direction & Concept (2-4 minggu)
- Style frames, typographic exploration
- Motion studies awal di After Effects — Pixelflakes validasi konsep animasi di fase ini
- Technical R&D bersamaan (shader prototyping, WebGL feasibility)
- "4 Key Steps to Art Direction" — Marcus Brown (Resn): visual identity ikonik melalui typography, warna, interaktivitas

### Fase 3: Design (3-6 minggu)
- UI design di Figma
- Design system dan component library
- Motion specification detail (duration, easing, stagger values)
- Daily recordings/screenshots untuk feedback — Thomas Monavon & Gregory Lalle mengirim ini setiap hari

### Fase 4: Development (6-12 minggu)
- Frontend build (framework + WebGL + GSAP)
- Design dan development berjalan PARALLEL, bukan sequential
- Progressive enhancement (mobile graceful degradation)
- Integration CMS/backend jika ada

### Fase 5: QA & Optimization (2-4 minggu)
- Cross-browser testing
- Performance optimization (GPU compression, lazy loading, code splitting)
- Accessibility audit (reduced motion, keyboard nav, screen reader)

### Fase 6: Launch & Submission
- Deployment (Vercel/Netlify)
- Awwwards submission preparation (thumbnail, video, deskripsi)

---

## Timeline Realistis per Tipe Project

| Tipe Project | Duration | Contoh |
|---|---|---|
| Portfolio kreatif (solo dev) | 2-6 bulan | Stefan Vitasovic (Next.js + R3F), Federico Pian (Nuxt 3) |
| Studio website | 6-12 bulan | Lusion v3 (~1 tahun), Immersive Garden |
| Client project (mid-size) | 3-6 bulan | Pixelflakes, Editorial by Locomotive |
| Client project (enterprise) | 6-12+ bulan | Columbia Pictures by Exo Ape |
| Internal/experimental | 2-6 bulan | Nomadic Tribe (Makemepulse) — SOTY 2019 |

---

## Studio-Specific Workflows

### Exo Ape — Fluid Team Model
- **Core:** 3 co-founders — Robbert (Creative Director), Ronald (Digital & Motion), Rob (Technical Director)
- **Scaling:** Flexibly extend dengan global network of specialists
- **Prinsip:** "A vision should never be handed off or diluted as it moves through the studio"
- **Kekuatan:** Rob dimulai sebagai designer, jadi punya "design-driven eye" — crucial untuk collaboration
- Setiap project adalah collective responsibility dari konsep sampai launch

### Lusion — Mood Board to Production Pipeline
1. **Mood Board:** Patterns, colors, history untuk definisikan visual style
2. **Visual References:** Inspirational images dan video dari karya artist lain
3. **Prototyping:** Prototype di Houdini, kadang sacrifice effects karena complexity
4. **Production:** Reproduce prototype di real-time WebGL, optimize performance
- Tim desain dan development bekerja BERSAMA pada 3D assets — bukan waterfall
- Brainstorming dianggap fase paling esensial

### Locomotive — Small Team, Big Impact
- 25 orang, 7x Awwwards Agency of the Year
- Mengembangkan open-source **locomotive-scroll** (standar industri)
- Tim kecil dengan ikatan yang melampaui tempat kerja
- Quentin Hocde memimpin front-end team, kontribusi ke open-source library

### Immersive Garden — Balance Minimalism & Function
- Studio of the Year 2024
- Dipimpin Dilshan Arukatti (Creative Director) + Daisy Potfer (Producer)
- Menghabiskan lebih banyak waktu MENGHAPUS elemen yang tidak perlu daripada menambahkan
- Automated pipeline: gltf-transform + custom Blender scripts
- GPU compression (KTX) server-side untuk 3D assets
- "Backstage Section" di website sebagai behind-the-scenes documentary

### Active Theory — Custom Framework "Hydra"
- Framework internal sejak 2012: setiap developer bekerja dalam struktur kode yang sama
- **Hydra 3D Engine:** Custom WebGL renderer — throughput grafis maksimal, CPU usage minimal
- **Nuke:** Real-time post-processing engine (chromatic aberration, depth of field)
- WebGL2 jika tersedia, fallback ke WebGL1 tanpa impact ke development
- "Identify strengths and weaknesses of tools, then build new tools streamlined for our workflow"

### Makemepulse — Narrative-First Approach
- Produksi: producers, developers, creatives — dipengaruhi video games, film, seni
- "Tell stories instead of doing tech for the sole sake of interactivity"
- Internal project space untuk eksperimen — Nomadic Tribe = SOTY 2019
- "Users should be amazed by creativity and emotion without noticing the tech"

### Cuberto — Developers & Designers Side by Side
- 2 bersaudara (Roman & Dmitri), Awwwards Agency of the Year
- Developer bekerja berdampingan dengan designer, strategis, analis
- Build product PERSIS seperti fase desain — tanpa shortcut atau simplifikasi

### Hello Monday — Flat Management
- Studios di New York, Copenhagen, Aarhus
- "Flat management for real" — 97 FWA Awards
- "Drive toward established conventions — and then veer hard right"
- "Ask 'Why not?' and use that as inspiration for a new direction"

### Jam3 — Dedicated Team per Project
- Lead creative, lead dev, lead producer per project — full ownership
- Tim dibentuk bespoke untuk setiap project
- "If you're bouncing around from project to project, you lose focus and the end product suffers"

---

## Key Pattern: Design & Code Bukan Sequential

**Lusion:** Pindah dari "creatives -> design -> development" ke tim yang bekerja bersama pada assets.

**Thomas Monavon & Gregory Lalle:** Daily recordings/screenshots untuk gather feedback — menghemat waktu, menghindari kesalahpahaman.

**Codrops Developer Spotlight (2025):**
> "By sitting down with designers early and hashing out ideas together, you often find the smartest approach to bring concepts to life. Technical difficulties should be approached as creative challenges."
>
> "It's not about tools or ideal routines and workflows, but rather about the mindset, aesthetics, and ideas."

---

## Prototyping Before Code

### Motion Studies di After Effects
Pixelflakes validasi konsep melalui rough motion studies selama fase UX design. Setiap interaksi, slider, dan transisi mendapat perhatian detail — drawing inspiration from motion studies crafted in AE.

### Technical Prototyping
Lusion membuat concept prototype video sebelum implementasi WebGL. Brainstorming sebelum kode ditulis — fase yang dianggap paling esensial.

### CodePen & Experimental Playground
Creative developers secara luas menggunakan CodePen untuk prototyping dan eksperimen.

### Internal R&D Projects
Makemepulse: "One of the primary benefits of internal studio projects is to give teams freedom to push boundaries of creativity and provide space for experimentation with novel concepts, techniques, and technologies."

---

## Unseen Studio — "(Im)Perfect Process"
Di Awwwards Conference 2024, Nathan Riley dan Tom Anderson transparently shared trial and error mereka. Key takeaway: "being intentional with time and resources."

---

## Sumber
- [Active Theory - The Story of Technology Built](https://medium.com/active-theory/the-story-of-technology-built-at-active-theory-5d17ae0e3fb4)
- [Lusion - From Concept to Production](https://medium.com/lusion-ltd/from-concept-prototyping-to-production-in-a-creative-studio-f2083e96c4b9)
- [Immersive Garden Case Study](https://www.awwwards.com/case-study-immersive-gardens-new-website.html)
- [Immersive Garden Interview](https://www.awwwards.com/interview-immersive-garden-win-studio-and-developer-site-of-the-year.html)
- [Exo Ape - Codrops](https://tympanus.net/codrops/2026/02/09/exo-ape-crafting-unforgettable-digital-journeys/)
- [Pixelflakes Case Study](https://www.awwwards.com/pixelflakes-behind-the-scenes-case-study.html)
- [Thomas Monavon & Gregory Lalle - Codrops](https://tympanus.net/codrops/2025/02/25/from-concept-to-code-inside-the-creative-process-of-thomas-monavon-gregory-lalle/)
- [Jam3 - Ways We Work](http://wayswework.io/spotlights/a-day-with-jam-3)
- [Makemepulse - Internal Studio Projects](https://www.makemepulse.com/news/article-the-value-and-interest-of-internal-studio-projects)
- [Awwwards Conference 2024](https://blog.amigopartnership.com/blog/awwwards-conference-2024-creativity-ai-and-the-power-of-small-teams)
- [Hello Monday - Communication Arts](https://www.commarts.com/features/hello-monday)
- [Cuberto About](https://cuberto.com/about/)
