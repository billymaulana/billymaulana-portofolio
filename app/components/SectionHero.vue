<script setup lang="ts">
import type { DistortionLine } from '~/composables/useTextDistortion'
import { useFluidSimulation } from '~/composables/useFluidSimulation'
import { useHeroStage } from '~/composables/useHeroStage'
import { distortionTextPadding, useMastheadRaster } from '~/composables/useTextDistortion'
import { profile } from '~/constants/profile'

/* Satu-satunya tempat menyetel efek liquid hero. Motion = parameter eksak
   daspritam (port Pavel Dobryakov). Ubah `mode`/`color`/dst di sini saja —
   tak perlu menyentuh shader. mode 'faithful' = mekanik asli daspritam
   (fluid invisible, teks meleleh + chromatic aberration ber-tint `color`);
   mode 'dye' = tubuh cairan `color` terlihat dengan inti putih. */
const FLUID = {
  mode: 'faithful' as 'faithful' | 'dye',
  color: '#0047FF',
  curl: 20,
  splatRadius: 0.3,
  splatForce: 7200,
  displace: 0.001,
  chromatic: 0.003,
  whiteCore: 0.95,
}

const MASTHEAD_TEXT = 'BILLYMAULANA'
const NAME_FONT = '\'Bebas Neue\', Impact, sans-serif'
const NAME_TRACKING_EM = -0.015
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
    : style.textTransform === 'lowercase'
      ? raw.toLowerCase()
      : raw
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
  if ('letterSpacing' in ctx) {
    ctx.letterSpacing = style.letterSpacing === 'normal'
      ? '0px'
      : style.letterSpacing
  }
  const metrics = ctx.measureText(text)
  const gap = edge === 'left'
    ? -metrics.actualBoundingBoxLeft
    : metrics.width - metrics.actualBoundingBoxRight
  return Number.isFinite(gap)
    ? gap
    : 0
}

const INK_EDGES: [selector: string, cssVar: string, edge: 'left' | 'right'][] = [
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
}

/* renderPositionedText menaruh origin baris kiri di pad + indent*(fontSize/200):
   indent dikonversi dari offset ink (m.left - m.pad) supaya tepi ink texture
   WebGL identik piksel dengan overlay DOM saat crossfade */
function buildDistortionLines(): DistortionLine[] {
  const width = sectionRef.value?.clientWidth ?? window.innerWidth
  const m = measureMasthead(width)
  return [
    {
      text: MASTHEAD_TEXT,
      xAlign: 'left',
      yFrac: NAME_Y_FRAC,
      fontSize: m.fontSize,
      indent: (m.left - m.pad) * (200 / m.fontSize),
    },
  ]
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
    [
      namesRef.value,
      taglineRef.value,
      monoBRef.value,
      monoMRef.value,
      metaRef.value,
    ].filter(Boolean),
    { autoAlpha: 0 },
  )

  if (fluidCanvasRef.value) {
    /* Fluid merespons di seluruh hero (paritas daspritam), tanpa gate ke pita
       teks. Semua parameter dari konstanta FLUID di atas */
    fluidReady = fluid.init(fluidCanvasRef.value, {
      skipInitialSplats: true,
      contentDisplay: true,
      displayMode: FLUID.mode,
      color: FLUID.color,
      curl: FLUID.curl,
      splatRadius: FLUID.splatRadius,
      splatForce: FLUID.splatForce,
      displace: FLUID.displace,
      chromatic: FLUID.chromatic,
      whiteCore: FLUID.whiteCore,
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
  nameChars = nameRef.value
    ? buildNameChars(nameRef.value)
    : []

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

    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
    })

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
      if (mono) {
        tl.to(mono, {
          autoAlpha: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
        }, 0.8)
      }
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
        [
          contentRef.value,
          taglineRef.value,
          monoBRef.value,
          monoMRef.value,
          metaRef.value,
        ].filter(Boolean),
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

    <span ref="monoBRef" class="hero__mono hero__mono--b" aria-hidden="true">
      <svg viewBox="0 0 88 61" fill="none" stroke="currentColor" stroke-width="1.179" stroke-linecap="round" stroke-linejoin="round"><path d="M44 1v59m43-29.5C87 46.794 67.748 60 44 60S1 46.794 1 30.5C1 14.21 20.252 1 44 1s43 13.21 43 29.5" /><path d="M75.758 30.5C75.758 46.794 61.54 60 44 60c-17.536 0-31.755-13.206-31.755-29.5C12.245 14.21 26.465 1 44 1c17.54 0 31.758 13.21 31.758 29.5" /><path d="M62.987 30.5C62.987 46.794 54.488 60 44 60c-10.484 0-18.987-13.206-18.987-29.5C25.013 14.21 33.516 1 44 1c10.488 0 18.987 13.21 18.987 29.5M1 30.5h86" /><path fill="currentColor" stroke="none" d="M62.987 30.5a.61.61 0 0 1-.612.616c-9.805 0-17.756 7.95-17.756 17.76 0 .344-.28.613-.611.613a.61.61 0 0 1-.616-.613c0-9.81-7.947-17.76-17.752-17.76h-.011a.62.62 0 0 1-.616-.616c0-.332.284-.616.616-.616h.01c9.806 0 17.753-7.95 17.753-17.76 0-.344.272-.616.615-.616.333 0 .612.272.612.616 0 9.81 7.951 17.76 17.756 17.76.344 0 .612.284.612.616" /></svg>
    </span>
    <span ref="monoMRef" class="hero__mono hero__mono--m" aria-hidden="true">
      <svg viewBox="0 0 80 80" fill="currentColor" stroke="currentColor" stroke-width="4" stroke-linejoin="round"><path d="M40.0004 0L40.0081 39.9606L55.3078 3.04481L40.0226 39.9668L68.2846 11.7157L40.0336 39.9777L76.9555 24.6926L40.0397 39.9923L80.0004 40L40.0397 40.0077L76.9555 55.3074L40.0336 40.0223L68.2846 68.2842L40.0226 40.0332L55.3078 76.9552L40.0081 40.0394L40.0004 80L39.9926 40.0394L24.6929 76.9552L39.9781 40.0332L11.7161 68.2842L39.9671 40.0223L3.04517 55.3074L39.961 40.0077L0.000366211 40L39.961 39.9923L3.04517 24.6926L39.9671 39.9777L11.7161 11.7157L39.9781 39.9668L24.6929 3.04481L39.9926 39.9606L40.0004 0Z" /></svg>
    </span>

    <div ref="metaRef" class="hero__meta">
      <p class="hero__meta-block hero__meta-clock">
        Bandung — {{ clockText }} GMT+7
      </p>
      <ul class="hero__meta-block hero__meta-socials" aria-label="Social links">
        <li v-for="social in SOCIAL_LINKS" :key="social.href">
          <a class="hero__meta-link" :href="social.href" target="_blank" rel="noopener noreferrer">{{ social.label }}</a>
        </li>
      </ul>
      <nav class="hero__meta-block hero__meta-slot" aria-label="Sections">
        <a class="hero__meta-link" href="#work">Work</a>
        <a class="hero__meta-link" href="#about">About</a>
        <a class="hero__meta-link" href="#contact">Contact</a>
      </nav>
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
  mix-blend-mode: screen;
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
  font-family: 'Obviously', 'Bebas Neue', Impact, sans-serif;
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
  top: clamp(1.25rem, 4vh, 1.75rem);
  left: var(--hero-pad, clamp(1.5rem, 4vw, 4rem));
  right: var(--hero-pad, clamp(1.5rem, 4vw, 4rem));
  z-index: 6;
  margin-inline: auto;
  max-width: 45rem;
  pointer-events: none;
  text-align: center;
  text-wrap: balance;
  font-family: 'Suisse', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 400;
  font-size: clamp(1.0625rem, 1.9vw, 2.28rem);
  line-height: 1.3;
  letter-spacing: -0.02em;
  font-feature-settings: 'kern' 1, 'liga' 1;
  color: #F2EFEA;
}

.hero__tagline-line {
  display: inline-block;
}

.hero__tagline-voice {
  font-family: 'Apparel', var(--font-statement), Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 1em;
}

.hero__mono {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 6;
  pointer-events: none;
  width: clamp(1.75rem, 2.4vw, 2.6rem);
  color: #F2EFEA;
}

.hero__mono svg {
  display: block;
  width: 100%;
  height: auto;
}

.hero__mono--b {
  left: var(--hero-pad, clamp(1.5rem, 4vw, 4rem));
}

.hero__mono--m {
  right: var(--hero-pad, clamp(1.5rem, 4vw, 4rem));
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
  gap: 1.1em;
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
