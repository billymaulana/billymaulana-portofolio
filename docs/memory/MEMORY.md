# Project Memory

## Active Concept: "Editorial Void x Liquid Intelligence"

Branch: `mac-explorer-design` (nama branch = eksplorasi design, BUKAN konsep mac/OS)
Concept doc: `docs/plans/2026-03-01-editorial-void-concept.md`
Status: AWAITING USER REVIEW

Bukan metaphor. Pure visual experience. Portfolio = galeri gelap dimana typography = sculpture, liquid = cahaya.

## User Taste DNA (COMPREHENSIVE — v2.0)

### Style Signatures
1. **"Editorial Void x Liquid Intelligence"** — Swiss editorial hening → hidup lewat liquid/glass/chroma. Tenang, confident, mahal.
2. **"Mythic Chrome x Anti-Mainstream"** — Secondary influence. Artsy, berani, nyeleneh berkelas.

### Emotional Arc
- Calm → meledak lewat motion. BUKAN flat energy.
- "Membuat user terdiam, lalu terpukau"

### Typography = HERO UTAMA
- Serif editorial BESAR sebagai statement (Canela, GT Super Display, Saol Display, Noe Display)
- Sans cold sebagai penyeimbang (Neue Montreal, Suisse Int'l, ABC Diatype, Söhne)
- Experimental typography HEMAT (variable font, shader-based, SVG — untuk momen spesial)
- Weight: Bold→Extra Bold. Tracking: Tight. Alignment: Left/Swiss. Hierarki: SANGAT kontras.
- Text BOLEH rusak, terbelah, kena efek — tapi tetap powerful

### Color Philosophy
- **70% monochrome** (black, white, grey) — kanvas
- **20% chrome/silver** — material quality, kesan mahal
- **10% chromatic event** (blue, cyan, violet) — HANYA saat interaksi, reward user
- Accent TIDAK muncul di hero awal → muncul saat interaksi → Zeigarnik tension
- Warna "datang dengan alasan" bukan sekadar estetik

### Motion Philosophy
- Motion = simbol KELAS, bukan gimmick
- Favorit: Liquid/ink/chroma, Glass distortion, Morphing geometry, Scroll storytelling, Cursor sebagai alat eksplorasi
- Timing: Slow start, decisive end. Delay mikro = choreography.
- BANNED: Bounce, elastic playful, over-smooth "Apple style", fade-in tanpa karakter
- Semua mouse-driven ATAU scroll-triggered — NO auto-play chaos

### Layout
- Swiss grid KETAT → lalu dilanggar secara SADAR
- Hero rapi → section berikutnya mulai "rusak"
- Text keluar grid saat hover/scroll
- Object menabrak layout

### Materials
- Glass, Prism, Crystal, Chrome, Liquid metal, Transparent stone
- Luxury + teknologi + seni

### Reference Sites (6 total)
- **daspritam.in**: Liquid sim, bold declaration, "CREATIVE DEV"
- **kaitonote.com**: Black bg, grid, gradient orb, counter, object transition opening→hero
- **art-yakushev.com**: Content sections motion+typography, numbered projects, SOTD winner
- **chdartmaker.com**: HERO — viewport-filling text-as-mask, images through letters
- **latchezarboyadjiev.com**: HERO — massive name split + glass object overlap, chromatic shift
- **junji-yamazaki.design**: Project hover mockups, numbered services, clean minimal

### UX Philosophy
- Experience-centric avant-garde, BUKAN user-centric konvensional
- Tidak semua harus langsung dimengerti
- Rasa penasaran > kecepatan

## 7x "AI Slop" Failure Record

Claude TUJUH kali gagal. Root cause BUKAN knowledge gap tapi TASTE LEVEL + TECHNIQUE SELECTION + WORK PRIORITIZATION.
- See `failure-patterns.md` for detailed analysis
- SOTD requires 8+/10. Claude keeps building 5-6/10.
- **Attempt 7**: Spent entire session on CSS token migration (font swaps, color renames, opacity tweaks). ZERO visual objects created. User: "creative tidak ada."
- SELALU screenshot dan minta user feedback sebelum lanjut.

## HARD RULES — Session Output Gates

1. **CSS polish/token migration COMES LAST** — NEVER start with cosmetic CSS work before visual objects exist and preloader is built
2. **Every session MUST produce at least 1 new**: canvas element, SVG animation, WebGL effect, or interactive visual. Token swaps alone = failed session.
3. **Priority order**: (1) Preloader/splashscreen, (2) Fluid sim quality fix, (3) Hamburger close, (4) Section visual objects, (5) Cursor states, (6) THEN polish

## Missing Critical Features (as of Attempt 7)
- Preloader/splashscreen: **DOES NOT EXIST** — #1 priority
- Hamburger close state: **BROKEN** — basic UX bug
- Fluid simulation: **"masih jelek"** per user — needs serious quality work
- Section visual objects: **ZERO** across all sections — only text + gradients
- Page/section transitions: **NONE** — no scene cuts
- Sound design: **NONE**

## Technical State
- Branch: `mac-explorer-design` (from `text-effect-prisma`)
- Stack: Nuxt 4.3 + GSAP + Lenis + WebGL2
- Fluid sim: `useFluidSimulation.ts` (WebGL2 Navier-Stokes, text-as-mask) — APPROVED, KEEP
- Build: clean (typecheck + lint + build pass)
- Lenis bridge: `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add()`
- Composables: useMagnetic.ts, useTextScramble.ts

## References
- `failure-patterns.md` — 6x AI slop failure analysis
- `sotd-techniques.md` — SOTD winner techniques
