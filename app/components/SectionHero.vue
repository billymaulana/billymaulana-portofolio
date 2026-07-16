<script setup lang="ts">
import type { DistortionLine } from '~/composables/useTextDistortion'
import { useFluidSimulation } from '~/composables/useFluidSimulation'
import { useHeroStage } from '~/composables/useHeroStage'
import { distortionTextPadding, useMastheadRaster } from '~/composables/useTextDistortion'
import { profile } from '~/constants/profile'

const MASTHEAD_TEXT = 'BILLYMAULANA'
const NAME_FONT = '\'Bebas Neue\', \'Anton\', Impact, sans-serif'
const NAME_TRACKING_EM = -0.04
const NAME_MEASURE_BASE_PX = 100
const NAME_Y_FRAC = 0.89
const NAME_OVERSHOOT_RIGHT_FRAC = 0

const SOCIAL_LINKS = [
  { label: 'GitHub', href: profile.github },
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'Instagram', href: profile.instagram },
]

const sectionRef = ref<HTMLElement>()
const fluidCanvasRef = ref<HTMLCanvasElement>()
const contentRef = ref<HTMLElement>()
const namesRef = ref<HTMLElement>()
const nameRef = ref<HTMLElement>()
const taglineRef = ref<HTMLElement>()
const monoBRef = ref<HTMLElement>()
const monoMRef = ref<HTMLElement>()
const metaRef = ref<HTMLElement>()

const fluid = useFluidSimulation()
const heroStage = useHeroStage()
const { clockText } = heroStage

let gsapCtx: gsap.Context | null = null
let resizeObserver: ResizeObserver | null = null
let fluidReady = false
let textResizeHandler: (() => void) | null = null

let nameChars: HTMLElement[] = []

let mastheadHit: { left: number, right: number, top: number, bottom: number } | null = null

/* Gate splat fluid ke pita ink masthead: efek hanya lahir saat cursor
   menyentuh teks (permintaan eksplisit user), bukan di seluruh hero.
   Bounds di-cache dari layoutMasthead — tanpa measureText per event.
   0.73em ≈ cap height Bebas Neue; 0.06em toleransi bawah baseline */
function mastheadPointerGate(u: number, v: number): boolean {
  const section = sectionRef.value
  if (!section || !mastheadHit)
    return false
  const x = u * section.clientWidth
  const y = (1 - v) * section.clientHeight
  return x >= mastheadHit.left && x <= mastheadHit.right
    && y >= mastheadHit.top && y <= mastheadHit.bottom
}

const mastheadRaster = useMastheadRaster({
  fontFamily: NAME_FONT,
  fontWeight: 400,
  letterSpacingEm: NAME_TRACKING_EM,
  lines: [],
})

function uploadMasthead() {
  const section = sectionRef.value
  if (!section || !fluidReady)
    return
  mastheadRaster.updateLines(buildDistortionLines())
  const dpr = window.devicePixelRatio || 1
  fluid.setContentCanvas(mastheadRaster.render(section.clientWidth, section.clientHeight, dpr))
}

interface MastheadMetrics {
  pad: number
  fontSize: number
  left: number
  baselineFromTop: number
}

/* Fit & posisi berbasis lebar INK (actualBoundingBox), bukan advance width:
   side bearing font membuat tepi visual B/A meleset dari pad bila memakai
   advance — semua metric diukur di base size lalu diskala linear (letter-
   spacing px ikut fontSize sehingga skala tetap linear). Overshoot optik
   kanan dihapus (frac 0): user meminta tepi "A" terkunci persis di garis
   grid hamburger/M — presisi grid menang atas kompensasi diagonal glyph */
function measureMasthead(width: number): MastheadMetrics {
  const ctx = document.createElement('canvas').getContext('2d')!
  ctx.font = `400 ${NAME_MEASURE_BASE_PX}px ${NAME_FONT}`
  if ('letterSpacing' in ctx)
    ctx.letterSpacing = `${NAME_MEASURE_BASE_PX * NAME_TRACKING_EM}px`
  const metrics = ctx.measureText(MASTHEAD_TEXT)
  const inkWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
  const pad = distortionTextPadding(width)
  const targetWidth = width - 2 * pad
  const scale = (targetWidth * (1 + NAME_OVERSHOOT_RIGHT_FRAC)) / inkWidth
  const ascent = metrics.fontBoundingBoxAscent
  const descent = metrics.fontBoundingBoxDescent
  return {
    pad,
    fontSize: NAME_MEASURE_BASE_PX * scale,
    left: pad + metrics.actualBoundingBoxLeft * scale,
    baselineFromTop: ((NAME_MEASURE_BASE_PX - (ascent + descent)) / 2 + ascent) * scale,
  }
}

/* mono/meta diposisikan CSS by box sedangkan masthead by ink: side bearing
   dan trailing letter-spacing membuat tepi visualnya meleset dari garis grid
   yang sama. Glyph panah CTA tidak ada di Switzer dan jatuh ke font fallback
   sistem — metriknya berbeda antar-OS, jadi gap diukur runtime dan tidak
   boleh dikonstankan. */
function inkGap(el: HTMLElement, edge: 'left' | 'right'): number {
  const ctx = document.createElement('canvas').getContext('2d')
  if (!ctx)
    return 0
  const style = getComputedStyle(el)
  const raw = el.textContent?.trim() ?? ''
  if (!raw)
    return 0
  const text = style.textTransform === 'uppercase'
    ? raw.toUpperCase()
    : style.textTransform === 'lowercase' ? raw.toLowerCase() : raw
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  if ('letterSpacing' in ctx)
    ctx.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing
  const metrics = ctx.measureText(text)
  const gap = edge === 'left'
    ? -metrics.actualBoundingBoxLeft
    : metrics.width - metrics.actualBoundingBoxRight
  return Number.isFinite(gap) ? gap : 0
}

const INK_EDGES: [selector: string, cssVar: string, edge: 'left' | 'right'][] = [
  ['.hero__mono--b', '--ink-mono-b', 'left'],
  ['.hero__mono--m', '--ink-mono-m', 'right'],
  ['.hero__meta-clock', '--ink-clock', 'left'],
  ['.hero__meta-arrow', '--ink-cta', 'right'],
]

function layoutInkEdges() {
  const section = sectionRef.value
  if (!section)
    return
  for (const [selector, cssVar, edge] of INK_EDGES) {
    const el = section.querySelector<HTMLElement>(selector)
    if (el)
      document.documentElement.style.setProperty(cssVar, `${inkGap(el, edge).toFixed(3)}px`)
  }
}

/* --hero-pad diset di document.documentElement dengan distortionTextPadding
   yang sama dengan pengukuran masthead: fallback clamp CSS memakai vw
   (termasuk scrollbar) sehingga bisa meleset dari clientWidth — satu sumber
   di root = meta/tagline section DAN logo/burger AppNavigation sejajar
   piksel dengan ink masthead */
function layoutMasthead() {
  const section = sectionRef.value
  const name = nameRef.value
  if (!section || !name)
    return

  const m = measureMasthead(section.clientWidth)
  const baselineY = NAME_Y_FRAC * section.clientHeight
  document.documentElement.style.setProperty('--hero-pad', `${m.pad}px`)
  name.style.left = `${m.left}px`
  name.style.top = `${baselineY - m.baselineFromTop}px`
  name.style.fontSize = `${m.fontSize}px`
  /* fit-to-width diukur dengan NAME_TRACKING_EM: bila tracking hanya hidup di
     CSS, DOM melebar ~120px dari raster WebGL dan crossfade tampak melompat */
  name.style.letterSpacing = `${NAME_TRACKING_EM}em`
  name.style.visibility = 'inherit'
  mastheadHit = {
    left: m.pad,
    right: section.clientWidth - m.pad,
    top: baselineY - m.fontSize * 0.73,
    bottom: baselineY + m.fontSize * 0.06,
  }
}

/* renderPositionedText menaruh origin baris kiri di pad + indent*(fontSize/200):
   indent dikonversi dari offset ink (m.left - m.pad) supaya tepi ink texture
   WebGL identik piksel dengan overlay DOM saat crossfade */
function buildDistortionLines(): DistortionLine[] {
  const width = sectionRef.value?.clientWidth ?? window.innerWidth
  const m = measureMasthead(width)
  return [{
    text: MASTHEAD_TEXT,
    xAlign: 'left',
    yFrac: NAME_Y_FRAC,
    fontSize: m.fontSize,
    indent: (m.left - m.pad) * (200 / m.fontSize),
  }]
}

function buildNameChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? ''
  el.textContent = ''
  const chars: HTMLElement[] = []
  for (const ch of text) {
    const span = document.createElement('span')
    span.className = 'hero__name-char'
    span.textContent = ch
    el.appendChild(span)
    chars.push(span)
  }
  return chars
}

onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReduced) {
    /* fonts.ready bisa resolve sebelum Bebas Neue di-fetch (font baru dimuat
       saat dipakai) — tanpa load eksplisit, fit-to-width terukur dengan
       metrics fallback dan lebar masthead meleset */
    await document.fonts.load(`400 100px ${NAME_FONT}`)
    await document.fonts.ready
    layoutMasthead()
    heroStage.startClock()
    textResizeHandler = layoutMasthead
    window.addEventListener('resize', textResizeHandler)
    return
  }

  const gsapModule = await import('gsap')
  const gsap = gsapModule.default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  gsap.set(
    [namesRef.value, taglineRef.value, monoBRef.value, monoMRef.value, metaRef.value].filter(Boolean),
    { autoAlpha: 0 },
  )

  if (fluidCanvasRef.value) {
    /* Hue dikunci ke identity palette (cyan #a1e0e7 → blue #0047FF →
       indigo #0f0a72 → violet): chromatic event hanya dalam keluarga warna
       brand, tetap multi-color (taste-dna melarang single-tint) */
    fluidReady = fluid.init(fluidCanvasRef.value, {
      skipInitialSplats: true,
      hueMin: 0.52,
      hueMax: 0.75,
      curl: 20,
      splatRadius: 0.3,
      contentDisplay: true,
      pointerGate: mastheadPointerGate,
    })
    if (fluidReady) {
      fluidCanvasRef.value.style.opacity = '0'
      resizeObserver = new ResizeObserver(() => {
        fluid.resize()
        uploadMasthead()
      })
      resizeObserver.observe(fluidCanvasRef.value)
    }
  }

  /* fonts.ready bisa resolve sebelum Bebas Neue di-fetch (font baru dimuat
     saat dipakai) — tanpa load eksplisit, fit-to-width terukur dengan
     metrics fallback dan lebar masthead meleset */
  await document.fonts.load(`400 100px ${NAME_FONT}`)
  await document.fonts.ready
  layoutMasthead()
  layoutInkEdges()
  nameChars = nameRef.value ? buildNameChars(nameRef.value) : []

  uploadMasthead()

  textResizeHandler = () => {
    layoutMasthead()
    layoutInkEdges()
    uploadMasthead()
  }
  window.addEventListener('resize', textResizeHandler)

  /* Pengukuran saat init masih bisa memakai metrics fallback walau
     fonts.load di-await (race pemuatan face 400) — akses fonts.ready BARU
     setelah render memberi promise segar; refresh sekali menjamin fit
     presisi, selesai di balik preloader */
  document.fonts.ready.then(() => textResizeHandler?.())

  gsapCtx = gsap.context(() => {
    const taglineLines = taglineRef.value
      ? Array.from(taglineRef.value.querySelectorAll<HTMLElement>('.hero__tagline-line'))
      : []
    const metaBlocks = metaRef.value
      ? Array.from(metaRef.value.querySelectorAll<HTMLElement>('.hero__meta-block'))
      : []

    gsap.set(nameChars, { yPercent: 100, filter: 'blur(8px)' })
    gsap.set(taglineLines, { autoAlpha: 0, y: 16, filter: 'blur(10px)' })
    if (monoBRef.value)
      gsap.set(monoBRef.value, { autoAlpha: 0, x: -12 })
    if (monoMRef.value)
      gsap.set(monoMRef.value, { autoAlpha: 0, x: 12 })
    gsap.set(metaBlocks, { autoAlpha: 0 })
    gsap.set(
      [namesRef.value, taglineRef.value, metaRef.value].filter(Boolean),
      { autoAlpha: 1 },
    )

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

    if (nameChars.length) {
      tl.to(nameChars, {
        yPercent: 0,
        filter: 'blur(0px)',
        duration: 1,
        stagger: 0.02,
        ease: 'power4.out',
      }, 0)
    }

    if (taglineLines.length) {
      tl.to(taglineLines, {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      }, 0.5)
    }

    for (const mono of [monoBRef.value, monoMRef.value]) {
      if (mono)
        tl.to(mono, { autoAlpha: 1, x: 0, duration: 0.8, ease: 'power3.out' }, 0.8)
    }

    metaBlocks.forEach((block, i) => {
      tl.to(block, { autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 1 + i * 0.09)
    })

    tl.call(() => {
      heroStage.startClock()
    }, [], 1)

    if (fluidReady && fluidCanvasRef.value && namesRef.value) {
      tl.to(fluidCanvasRef.value, { opacity: 1, duration: 0.6, ease: 'power3.out' }, 1.35)
      tl.to(namesRef.value, { autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 1.4)
      tl.set(namesRef.value, { display: 'none' }, 2.15)
    }

    if (sectionRef.value && contentRef.value) {
      gsap.to([contentRef.value, fluidCanvasRef.value].filter(Boolean), {
        yPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })

      const fadeTrigger = () => ({
        trigger: sectionRef.value,
        start: 'top top',
        end: '50% top',
        scrub: true,
      })

      gsap.to(
        [contentRef.value, taglineRef.value, monoBRef.value, monoMRef.value, metaRef.value].filter(Boolean),
        {
          opacity: 0,
          ease: 'none',
          scrollTrigger: fadeTrigger(),
        },
      )

      /* Kanvas dipisah dengan start eksplisit: opacity-nya juga ditulis
         timeline entrance (0 → 1 pada 1.35s). Tanpa fromTo, tween scrub
         merekam nilai saat render pertama — yang masih 0 — sehingga menjadi
         0 → 0 dan kanvas tak pernah muncul lagi sampai reload */
      if (fluidCanvasRef.value) {
        gsap.fromTo(
          fluidCanvasRef.value,
          { opacity: 1 },
          {
            opacity: 0,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: fadeTrigger(),
          },
        )
      }
    }
  })
})

onUnmounted(() => {
  /* Tanpa dilepas, nilai px terakhir menempel di root dan jadi stale saat
     resize di halaman lain — fallback clamp CSS mengambil alih kembali */
  document.documentElement.style.removeProperty('--hero-pad')
  for (const [, cssVar] of INK_EDGES)
    document.documentElement.style.removeProperty(cssVar)
  gsapCtx?.revert()
  fluid.destroy()
  heroStage.destroy()
  resizeObserver?.disconnect()
  if (textResizeHandler)
    window.removeEventListener('resize', textResizeHandler)
})
</script>

<template>
  <section
    ref="sectionRef"
    class="hero"
    aria-label="Billy Maulana — Frontend Architect & Creative Developer"
  >
    <canvas
      ref="fluidCanvasRef"
      class="hero__canvas"
      aria-hidden="true"
    />

    <div class="hero__grain" aria-hidden="true" />

    <div ref="contentRef" class="hero__content">
      <div ref="namesRef" class="hero__names" aria-hidden="true">
        <span ref="nameRef" class="hero__name">BILLYMAULANA</span>
      </div>
      <h1 class="sr-only">
        Billy Maulana
      </h1>
    </div>

    <p ref="taglineRef" class="hero__tagline">
      <span class="hero__tagline-line"><em class="hero__tagline-voice">A Frontend Architect</em> <span class="hero__tagline-craft">crafting</span> <span class="hero__tagline-quiet">interfaces</span></span>
      <br aria-hidden="true">
      <span class="hero__tagline-line"><span class="hero__tagline-craft">that move millions of</span> <span class="hero__tagline-quiet">people.</span></span>
    </p>

    <span ref="monoBRef" class="hero__mono hero__mono--b" aria-hidden="true">B</span>
    <span ref="monoMRef" class="hero__mono hero__mono--m" aria-hidden="true">M</span>

    <div ref="metaRef" class="hero__meta">
      <p class="hero__meta-block hero__meta-clock">
        Bandung — {{ clockText }} GMT+7
      </p>
      <ul class="hero__meta-block hero__meta-socials" aria-label="Social links">
        <li v-for="social in SOCIAL_LINKS" :key="social.href">
          <a class="hero__meta-link" :href="social.href" target="_blank" rel="noopener noreferrer">{{ social.label }}</a>
        </li>
      </ul>
      <div class="hero__meta-block hero__meta-slot">
        <a class="hero__meta-cta" href="#contact">
          <span class="hero__meta-cta-label">Open to work <span class="hero__meta-arrow" aria-hidden="true">↗</span></span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background:
    radial-gradient(ellipse 70% 50% at 50% 50%, rgba(6, 6, 16, 0.6) 0%, transparent 70%),
    var(--void-blue, #060610);
}

.hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 5;
  pointer-events: auto;
  mix-blend-mode: difference;
}

.hero__grain {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  opacity: 0.05;
  mix-blend-mode: overlay;
  background-image: url('/assets/textures/grain.png');
  background-size: 200px 200px;
  background-repeat: repeat;
}

.hero__content {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  mix-blend-mode: difference;
}

.hero__names {
  position: absolute;
  inset: 0;
}

.hero__name {
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  font-family: 'Bebas Neue', 'Anton', Impact, sans-serif;
  font-weight: 400;
  font-size: 24vw;
  line-height: 1;
  color: #F2EFEA;
  white-space: nowrap;
}

.hero__name-char {
  display: inline-block;
  will-change: transform, filter, opacity;
}

.hero__tagline {
  position: absolute;
  top: clamp(4.5rem, 11vh, 7rem);
  left: var(--hero-pad, clamp(1.5rem, 4vw, 4rem));
  right: var(--hero-pad, clamp(1.5rem, 4vw, 4rem));
  z-index: 6;
  margin-inline: auto;
  max-width: 38ch;
  pointer-events: none;
  text-align: center;
  text-wrap: balance;
  font-family: var(--font-hero);
  font-weight: 400;
  font-size: clamp(1.25rem, 1.9vw, 1.71rem);
  line-height: 1.3;
  letter-spacing: -0.02em;
  font-feature-settings: 'kern' 1, 'liga' 1;
  color: rgba(242, 239, 234, 0.96);
}

.hero__tagline-line {
  display: inline-block;
}

.hero__tagline-voice {
  font-family: 'Cormorant', var(--font-statement);
  font-style: italic;
  font-weight: 600;
  font-size: 1.08em;
  letter-spacing: -0.015em;
  padding-right: 0.06em;
  color: rgba(242, 239, 234, 0.96);
}

.hero__tagline-craft {
  color: rgba(242, 239, 234, 0.96);
}

.hero__tagline-quiet {
  color: rgba(242, 239, 234, 0.45);
}

.hero__mono {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 6;
  pointer-events: none;
  font-family: var(--font-hero);
  font-weight: 400;
  font-size: 1.875rem;
  line-height: 1;
  letter-spacing: -0.02em;
  color: rgba(242, 239, 234, 0.9);
}

.hero__mono--b {
  left: calc(var(--hero-pad, clamp(1.5rem, 4vw, 4rem)) - var(--ink-mono-b, 0px));
}

.hero__mono--m {
  right: calc(var(--hero-pad, clamp(1.5rem, 4vw, 4rem)) - var(--ink-mono-m, 0px));
}

.hero__meta {
  position: absolute;
  left: var(--hero-pad, clamp(1.5rem, 4vw, 4rem));
  right: var(--hero-pad, clamp(1.5rem, 4vw, 4rem));
  bottom: var(--hero-pad-v);
  z-index: 6;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  pointer-events: none;
  font-family: var(--font-hero);
  font-weight: 500;
  font-size: 0.625rem;
  line-height: 1;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(242, 239, 234, 0.92);
}

.hero__meta-clock {
  position: relative;
  left: calc(0px - var(--ink-clock, 0px));
  flex: 1 1 0;
  font-variant-numeric: tabular-nums;
}

.hero__meta-socials {
  flex: 0 0 auto;
  display: flex;
  align-items: baseline;
  gap: 0.75em;
}

.hero__meta-socials li {
  display: flex;
  align-items: baseline;
  gap: 0.75em;
}

.hero__meta-socials li + li::before {
  content: '/';
  color: rgba(208, 208, 216, 0.3);
}

.hero__meta-slot {
  flex: 1 1 0;
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
}

.hero__meta-cta {
  pointer-events: auto;
  position: relative;
  display: inline-flex;
  align-items: baseline;
  gap: 0.75rem;
  margin-right: calc(0px - var(--ink-cta, 0px));
  color: inherit;
  transition: color 0.3s var(--ease-out-expo);
}

.hero__meta-cta::after {
  content: '';
  position: absolute;
  inset: -0.5rem 0;
}

.hero__meta-cta:hover {
  color: #F2EFEA;
}

.hero__meta-arrow {
  display: inline-block;
  letter-spacing: 0;
  transition: transform 0.3s var(--ease-out-expo);
}

.hero__meta-cta:hover .hero__meta-arrow {
  transform: translate(2px, -2px);
}

.hero__meta-link {
  pointer-events: auto;
  position: relative;
  color: inherit;
  transition: color 0.3s var(--ease-out-expo);
}

.hero__meta-link::after {
  content: '';
  position: absolute;
  inset: -0.5rem 0;
}

.hero__meta-link:hover {
  color: #F2EFEA;
}

@media (max-width: 768px) {
  .hero__mono,
  .hero__meta-socials {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__canvas {
    display: none;
  }
}
</style>
