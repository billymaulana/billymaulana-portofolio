---
type: reference
slug: daspritam
title: daspritam.in
source_url: https://www.daspritam.in/
captured: 2026-07-16
awwwards_status: Honorable Mention
category: [portfolio]
style: [liquid, kinetic-type]
fonts: [Satoshi]
grid: Counter-position Swiss: nama kiri-atas, lokasi kanan, copy + CTA kiri-bawah, role kanan-bawah; negative space luas di tengah
grid_type: [swiss, asymmetric, edge-anchored]
motion: [mouse-reactive, text-reveal, chromatic-aberration]
libraries: [ogl, gsap]
mood: [kinetic, organic, premium]
verdict: "effect liquid ketika mouse movement dan text effect ketika mengenai text... detail liquidnya membuat terasa mahal dan keren"
influence: new
thumb: assets/daspritam-desktop.png
typography:
  primary: Satoshi
---

## Apa yang Menarik

| Aspek | Detail |
|-------|--------|
| **Liquid text masking** | Fluid simulation di-render MELALUI text shapes — text jadi "window" ke liquid |
| **Red/aqua chromatic split** | R channel stays, G+B shift = organik red/cyan bleeding |
| **Velocity-driven color** | Splat color = mouse velocity direction, bukan warna static |
| **Section 2 impact** | Teks "CREATE WEBSITE THAT TRULY INSPIRES" dengan liquid merah detail di background |
| **Full-page canvas** | Satu fixed WebGL canvas untuk SEMUA headings — konsistensi physics |

## Teknik yang Diidentifikasi

| Teknik | Implementation | Purpose |
|--------|----------------|---------|
| Navier-Stokes fluid sim | OGL v1.3.1, double FBO ping-pong, Jacobi pressure solve | Organic, physically-accurate liquid behavior |
| Text-to-texture pipeline | DOM text → offscreen canvas (fillText) → toDataURL → WebGL mesh | Text shapes sebagai mask untuk fluid |
| Chromatic aberration shader | `fluid.rg * 0.001` UV displacement + `fluid * 0.003` RGB split | Red/cyan color bleeding yang responsive |
| Gaussian splat | `exp(-dot(p,p)/radius) * color` pada mouse velocity | Natural falloff dari mouse interaction |
| Image cover shader | SDF rounded-rect + object-fit cover di GPU | Smooth border-radius tanpa CSS limitation |
| Counter-position layout | Name top-left, role bottom-right, generous negative space | Swiss asymmetric tension |
| Circular narrative | Footer = mirror of hero | Site terasa "loop", bukan "end" |

## Timing & Feel

- Fluid dissipation: natural fade (no explicit easing)
- Splat multiplier: `dx*5, dy*-5` — moderate sensitivity
- UV displacement: `0.001` — subtle text warping
- Chromatic: `0.003` — visible but not overwhelming
- Text reveal: GSAP SplitText 3.13.0, likely power3/expo easing

## Kenapa Terasa Premium

1. **Physics-based** — real Navier-Stokes, bukan approximation
2. **Text AS the reveal** — kamu melihat liquid MELALUI huruf, bukan effect DI ATAS text
3. **Velocity = color** — setiap gerakan mouse menghasilkan warna berbeda berdasarkan ARAH
4. **Chromatic split** — R/GB separation menciptakan depth dan "expensive" look
5. **Full-page continuity** — satu canvas, satu fluid system, semua heading
6. **Subtlety** — multiplier 0.001/0.003 = just right, tidak overwhelming

## Mobile Handling

- WebGL dimatikan di bawah `lg` breakpoint
- Text menjadi visible (`md:text-white`)
- Static image (me7.webp) menggantikan fluid background
- Layout stack vertikal

## Accessibility

- Semantic HTML terjaga (h1, h2, section)
- Mobile fallback tanpa WebGL
- **Gap**: Tidak ada reduced-motion handling (area improvement)

## Influence ke Taste Profile

- **Memperkuat**: Fluid simulation, mouse-reactive effects, dark cinematic
- **Menambah baru**: Chromatic aberration as color strategy, text-as-mask technique, velocity-driven color
- **Konfirmasi**: Font Satoshi (sama dengan portfolio Billy) — validasi pilihan font

## Section-by-Section

### 1. Hero — IAM PRITAM (`assets/daspritam-desktop.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Counter-position Swiss: 'IAM PRITAM' kiri-atas (Satoshi ~165px), 'BASED IN [India]' kanan, copy 'I MAKE DESIGNS AND DEVELOP...' + 'BOOK A CALL' kiri-bawah, 'CREATIVE DEV' mulai kanan-bawah; negative space luas |
| Typography | Satoshi ~165px uppercase display; body caps kecil mono-ish; skala ekstrem |
| Motion | Preloader 'INITIALIZING' -> hero reveal (SplitText); fluid liquid mouse-reactive (tak tampak saat diam) |
| Color | Pure black + putih; liquid merah/aqua muncul saat mouse bergerak |
| Konsep | Intro designer/developer; nama sebagai statement |
| Teknik | OGL Navier-Stokes fluid (full-page canvas), Satoshi extreme scale, counter-position Swiss, SplitText reveal |

### 2. Create Website That Truly Inspires (liquid) (`assets/daspritam-inspires.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Statement raksasa 'CREATE WEBSITE THAT TRULY [INSPIRES]' tengah; copy kiri 'I CREATE WEBSITE WITH FULL OF PASSION AND DEDICATION.', kanan 'STAY AHEAD OF THE CROWD.' |
| Typography | Satoshi ~165px uppercase; body caps kecil di sudut |
| Motion | Fluid liquid MERAH mengikuti mouse velocity, menembus text (text-as-mask); chromatic red/aqua split |
| Color | Black + putih + liquid MERAH velocity-driven, chromatic aberration |
| Konsep | Impact statement — detail liquid yang bikin Billy bilang 'mahal dan keren' |
| Teknik | Text-to-texture mask + OGL fluid render MELALUI huruf, velocity-driven color, chromatic aberration shader (0.003) |

### 3. Footer — Circular Narrative (`assets/daspritam-footer.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Identik hero: 'IAM PRITAM / BASED IN... / BOOK A CALL / CREATIVE DEV' (mirror hero) |
| Typography | Satoshi ~165px (sama seperti hero) |
| Motion | Fluid liquid tetap aktif; circular narrative |
| Color | Black + putih + liquid |
| Konsep | Circular narrative: footer = hero, site terasa loop bukan end |
| Teknik | Full-page fluid canvas yang sama, circular narrative mirror |

