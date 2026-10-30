<script setup lang="ts">
import { useFluidSimulation } from '~/composables/useFluidSimulation'
import { useHeroStage } from '~/composables/useHeroStage'
import { distortionTextPadding, useMastheadRaster } from '~/composables/useTextDistortion'
import { profile } from '~/constants/profile'

definePageMeta({
  standalone: true,
})

useSeoMeta({
  title: 'Billy Maulana — Frontend Engineer',
  robots: 'noindex',
})

/* Back to the one configuration Billy approved. /checkpoint/liquid/liquid-2 was called "keren", and
   its numbers are reproduced here exactly: curl 8, sim 128, dye 512, density 1.8, velocity 1.2,
   pressure 20. Every departure from them in this route — sim 256/320, curl 12/16/20, pressure 3,
   fast decay — was my own initiative, and every one was rejected.

   Mode 'plasmaText' puts the masthead raster into the field's heat term, so the name is the hottest
   matter inside the plasma rather than a white slab under a cloud. The melt, ignition, ember and
   char layers built on top of it are switched off here: each was rejected in turn (dissolved the
   name, blew the band out to white, read as a cartoon outline), and the engine keeps them as options
   only for a route that asks for them. */
const FLUID = {
  mode: 'plasmaText' as const,
  color: '#0047FF',
  curl: 8,
  simResolution: 128,
  dyeResolution: 512,
  splatRadius: 0.3,
  splatForce: 7200,
  displace: 0.001,
  chromatic: 0.003,
  whiteCore: 0.95,
  densityDissipation: 1.8,
  velocityDissipation: 1.2,
  pressureIterations: 20,
  meltSpan: 0,
  ignite: 0,
  ember: 0,
  char: 0,
}

const MASTHEAD_TEXT = 'BILLYMAULANA'
const NAME_FONT = '\'Bebas Neue\', Impact, sans-serif'
const NAME_TRACKING_EM = -0.015
const NAME_MEASURE_BASE_PX = 100
const NAME_Y_FRAC = 0.86

const SOCIAL_LINKS = [
  { label: 'GitHub', href: profile.github },
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'Instagram', href: profile.instagram },
]

const sectionRef = ref<HTMLElement>()
const fluidCanvasRef = ref<HTMLCanvasElement>()
const namesRef = ref<HTMLElement>()
const nameRef = ref<HTMLElement>()
const taglineRef = ref<HTMLElement>()
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

interface MastheadMetrics {
  pad: number
  fontSize: number
  left: number
  baselineFromTop: number
}

function measureMasthead(width: number): MastheadMetrics {
  const ctx = document.createElement('canvas').getContext('2d')!
  ctx.font = `400 ${NAME_MEASURE_BASE_PX}px ${NAME_FONT}`
  if ('letterSpacing' in ctx)
    ctx.letterSpacing = `${NAME_MEASURE_BASE_PX * NAME_TRACKING_EM}px`
  const metrics = ctx.measureText(MASTHEAD_TEXT)
  const inkWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
  const pad = distortionTextPadding(width)
  const targetWidth = width - 2 * pad
  const scale = targetWidth / inkWidth
  const ascent = metrics.fontBoundingBoxAscent
  const descent = metrics.fontBoundingBoxDescent
  return {
    pad,
    fontSize: NAME_MEASURE_BASE_PX * scale,
    left: pad + metrics.actualBoundingBoxLeft * scale,
    baselineFromTop: ((NAME_MEASURE_BASE_PX - (ascent + descent)) / 2 + ascent) * scale,
  }
}

function layoutMasthead() {
  const section = sectionRef.value
  const name = nameRef.value
  if (!section || !name)
    return
  const m = measureMasthead(section.clientWidth)
  const baselineY = NAME_Y_FRAC * section.clientHeight
  name.style.left = `${m.left}px`
  name.style.top = `${baselineY - m.baselineFromTop}px`
  name.style.fontSize = `${m.fontSize}px`
  name.style.letterSpacing = `${NAME_TRACKING_EM}em`
  name.style.visibility = 'inherit'
}

function buildDistortionLines() {
  const width = sectionRef.value?.clientWidth ?? window.innerWidth
  const m = measureMasthead(width)
  return [
    {
      text: MASTHEAD_TEXT,
      xAlign: 'left' as const,
      yFrac: NAME_Y_FRAC,
      fontSize: m.fontSize,
      indent: (m.left - m.pad) * (200 / m.fontSize),
    },
  ]
}

function uploadMasthead() {
  const section = sectionRef.value
  if (!section)
    return
  mastheadRaster.updateLines(buildDistortionLines())
  const dpr = window.devicePixelRatio || 1
  const canvas = mastheadRaster.render(section.clientWidth, section.clientHeight, dpr)
  if (fluidReady)
    fluid.setContentCanvas(canvas)
}

function buildNameChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? ''
  el.textContent = ''
  const chars: HTMLElement[] = []
  for (const ch of text) {
    const span = document.createElement('span')
    span.className = 'h4__name-char'
    span.textContent = ch
    el.appendChild(span)
    chars.push(span)
  }
  return chars
}

onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReduced) {
    await document.fonts.load(`400 100px ${NAME_FONT}`)
    await document.fonts.ready
    layoutMasthead()
    heroStage.startClock()
    textResizeHandler = layoutMasthead
    window.addEventListener('resize', textResizeHandler)
    return
  }

  /* The face fetch starts before the gsap chunk is awaited, not after it: a font is only requested
     when something asks for it, so serialising the two made the masthead wait for the import and
     the download end to end. Passing the masthead string targets the glyphs actually drawn. */
  const mastheadFont = document.fonts.load(`400 100px ${NAME_FONT}`, MASTHEAD_TEXT).catch(() => [])

  const gsapModule = await import('gsap')
  const gsapLib = gsapModule.default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsapLib.registerPlugin(ScrollTrigger)

  gsapLib.set(
    [namesRef.value, taglineRef.value, metaRef.value].filter(Boolean),
    { autoAlpha: 0 },
  )

  if (fluidCanvasRef.value) {
    fluidReady = fluid.init(fluidCanvasRef.value, {
      skipInitialSplats: true,
      contentDisplay: true,
      displayMode: FLUID.mode,
      color: FLUID.color,
      curl: FLUID.curl,
      simResolution: FLUID.simResolution,
      dyeResolution: FLUID.dyeResolution,
      splatRadius: FLUID.splatRadius,
      splatForce: FLUID.splatForce,
      displace: FLUID.displace,
      chromatic: FLUID.chromatic,
      whiteCore: FLUID.whiteCore,
      densityDissipation: FLUID.densityDissipation,
      velocityDissipation: FLUID.velocityDissipation,
      pressureIterations: FLUID.pressureIterations,
      meltSpan: FLUID.meltSpan,
      ignite: FLUID.ignite,
      ember: FLUID.ember,
      char: FLUID.char,
      interpolateSegments: true,
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

  await mastheadFont
  await document.fonts.ready
  layoutMasthead()
  nameChars = nameRef.value
    ? buildNameChars(nameRef.value)
    : []

  uploadMasthead()

  textResizeHandler = () => {
    layoutMasthead()
    uploadMasthead()
  }
  window.addEventListener('resize', textResizeHandler)
  document.fonts.ready.then(() => textResizeHandler?.())

  gsapCtx = gsapLib.context(() => {
    const taglineLines = taglineRef.value
      ? Array.from(taglineRef.value.querySelectorAll<HTMLElement>('.h4__tagline-line'))
      : []
    const metaBlocks = metaRef.value
      ? Array.from(metaRef.value.querySelectorAll<HTMLElement>('.h4__meta-block'))
      : []

    gsapLib.set(nameChars, { yPercent: 100, filter: 'blur(8px)' })
    gsapLib.set(taglineLines, { autoAlpha: 0, y: 16, filter: 'blur(10px)' })
    gsapLib.set(metaBlocks, { autoAlpha: 0 })
    gsapLib.set(
      [namesRef.value, taglineRef.value, metaRef.value].filter(Boolean),
      { autoAlpha: 1 },
    )

    const tl = gsapLib.timeline({
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

    metaBlocks.forEach((block, i) => {
      tl.to(block, { autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 1 + i * 0.09)
    })

    tl.call(() => {
      heroStage.startClock()
    }, [], 1)

    if (fluidReady && fluidCanvasRef.value)
      tl.to(fluidCanvasRef.value, { opacity: 1, duration: 0.6, ease: 'power3.out' }, 1.35)

    /* The DOM masthead only leaves once the fluid display can redraw it; without WebGL it stays. */
    if (fluidReady && namesRef.value) {
      tl.to(namesRef.value, { autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 1.40)
      tl.set(namesRef.value, { display: 'none' }, 2.15)
    }

    if (sectionRef.value) {
      const parallaxTargets = [taglineRef.value, metaRef.value, fluidCanvasRef.value].filter(Boolean)
      gsapLib.to(parallaxTargets, {
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

      gsapLib.to(
        [taglineRef.value, metaRef.value].filter(Boolean),
        {
          opacity: 0,
          ease: 'none',
          scrollTrigger: fadeTrigger(),
        },
      )

      if (fluidCanvasRef.value) {
        gsapLib.fromTo(
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
    class="h4-root bg-[#050507] h-[100dvh] w-full relative overflow-hidden"
    aria-label="Billy Maulana — Frontend Architect & Creative Developer"
  >
    <canvas
      ref="fluidCanvasRef"
      class="h4__fluid h-full w-full pointer-events-auto inset-0 absolute z-3 mix-blend-screen"
      aria-hidden="true"
    />

    <div class="h4__grain opacity-[0.07] pointer-events-none inset-0 absolute z-4 mix-blend-overlay" aria-hidden="true" />

    <div ref="namesRef" class="h4__names pointer-events-none inset-0 absolute z-5">
      <span ref="nameRef" class="h4__name">{{ MASTHEAD_TEXT }}</span>
      <h1 class="sr-only">
        Billy Maulana
      </h1>
    </div>

    <p ref="taglineRef" class="h4__tagline text-center pointer-events-none absolute z-6">
      <span class="h4__tagline-line"><em class="h4__tagline-voice">A Frontend Architect</em> crafting interfaces</span>
      <br aria-hidden="true">
      <span class="h4__tagline-line">that move millions of people.</span>
    </p>

    <div ref="metaRef" class="h4__meta flex pointer-events-none items-baseline justify-between absolute z-6">
      <p class="h4__meta-block h4__meta-clock">
        Bandung — {{ clockText }} GMT+7
      </p>
      <ul class="h4__meta-block h4__meta-socials" aria-label="Social links">
        <li v-for="social in SOCIAL_LINKS" :key="social.href">
          <a class="h4__meta-link" :href="social.href" target="_blank" rel="noopener noreferrer">{{ social.label }}</a>
        </li>
      </ul>
      <nav class="h4__meta-block h4__meta-nav" aria-label="Sections">
        <a class="h4__meta-link" href="#work">Work</a>
        <a class="h4__meta-link" href="#about">About</a>
        <a class="h4__meta-link" href="#contact">Contact</a>
      </nav>
    </div>
  </section>
</template>

<style>
.h4-root {
  --h4-pad: clamp(1.25rem, 3.2vw, 3rem);
}

.h4__grain {
  background-image: url('/assets/textures/grain.png');
  background-size: 200px 200px;
  background-repeat: repeat;
}

.h4__name {
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  font-family: 'Bebas Neue', Impact, sans-serif;
  font-weight: 400;
  line-height: 1;
  color: #F2EFEA;
  white-space: nowrap;
}

.h4__name-char {
  display: inline-block;
  will-change: transform, filter, opacity;
}

.h4-root .sr-only {
  font-family: 'Suisse', 'Helvetica Neue', Arial, sans-serif;
}

.h4__tagline {
  top: clamp(1.25rem, 4vh, 1.75rem);
  left: var(--h4-pad);
  right: var(--h4-pad);
  margin-inline: auto;
  max-width: 45rem;
  text-wrap: balance;
  font-family: 'Suisse', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 400;
  font-size: clamp(1.0625rem, 1.9vw, 2.28rem);
  line-height: 1.3;
  letter-spacing: -0.02em;
  font-feature-settings: 'kern' 1, 'liga' 1;
  color: #F2EFEA;
}

.h4__tagline-line {
  display: inline-block;
}

.h4__tagline-voice {
  font-family: 'Apparel', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 1em;
}

.h4__meta {
  left: var(--h4-pad);
  right: var(--h4-pad);
  bottom: var(--h4-pad);
  font-family: 'Suisse', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 400;
  font-size: 0.625rem;
  line-height: 1;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(242, 239, 234, 0.92);
  column-gap: 1rem;
}

.h4__meta-clock {
  flex: 1 1 0;
  font-variant-numeric: tabular-nums;
}

.h4__meta-socials {
  flex: 0 0 auto;
  display: flex;
  align-items: baseline;
  gap: 0.75em;
}

.h4__meta-socials li {
  display: flex;
  align-items: baseline;
  gap: 0.75em;
}

.h4__meta-socials li + li::before {
  content: '/';
  color: rgba(208, 208, 216, 0.3);
}

.h4__meta-nav {
  flex: 1 1 0;
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 1.1em;
}

.h4__meta-link {
  pointer-events: auto;
  position: relative;
  color: inherit;
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.h4__meta-link::after {
  content: '';
  position: absolute;
  inset: -0.5rem 0;
}

.h4__meta-link:hover {
  color: #F2EFEA;
}

@media (max-width: 767px) {
  .h4__meta-socials {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .h4__fluid {
    display: none;
  }
}
</style>
