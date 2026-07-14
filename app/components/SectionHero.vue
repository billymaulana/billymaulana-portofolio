<script setup lang="ts">
import type { DistortionLine } from '~/composables/useTextDistortion'
import { useFluidSimulation } from '~/composables/useFluidSimulation'
import { useHeroStage } from '~/composables/useHeroStage'
import { distortionTextPadding, useTextDistortion } from '~/composables/useTextDistortion'
import { useTextScramble } from '~/composables/useTextScramble'

const NAME_FIRST = 'BILLY'
const NAME_LAST = 'MAULANA'
const NAME_FONT = '\'Switzer\', \'Helvetica Neue\', sans-serif'
const NAME_TRACKING_EM = -0.035
/* yFrac dihitung dari baseline: BILLY hasil fit 52vw punya ascent ~0.75em —
   yFrac di bawah 0.4 membuat huruf terpotong tepi atas viewport */
const NAME_FIRST_YFRAC = 0.42
const NAME_LAST_YFRAC = 0.82
const NAME_FIRST_WIDTH_FRAC = 0.52
const NAME_LAST_WIDTH_FRAC = 0.78
const NAME_MEASURE_BASE_PX = 100

const STATUS_LINES = [
  'AVAILABLE FOR SELECT WORK',
  'VUE · NUXT · TYPESCRIPT',
  'WEBGL · GSAP · MOTION',
]

const sectionRef = ref<HTMLElement>()
const fluidCanvasRef = ref<HTMLCanvasElement>()
const contentRef = ref<HTMLElement>()
const textCanvasRef = ref<HTMLCanvasElement>()
const namesRef = ref<HTMLElement>()
const firstNameRef = ref<HTMLElement>()
const lastNameRef = ref<HTMLElement>()
const ghostWrapRef = ref<HTMLElement>()
const ghostRef = ref<HTMLElement>()
const metaRef = ref<HTMLElement>()
const statusDotRef = ref<HTMLElement>()
const indexNumRef = ref<HTMLElement>()
const statusRef = ref<HTMLElement>()
const clockRef = ref<HTMLElement>()
const scrollRef = ref<HTMLElement>()
const scrollLineRef = ref<HTMLElement>()

const fluid = useFluidSimulation()
const stage = useHeroStage()
const { scramble: scrambleText } = useTextScramble({ speed: 25, iterations: 4 })
const { scramble: scrambleDigits } = useTextScramble({ chars: '0123456789', speed: 45, iterations: 8 })
const { clockText } = stage

let gsapCtx: gsap.Context | null = null
let resizeObserver: ResizeObserver | null = null
let fluidActivated = false
let fluidReady = false
let textDistortion: ReturnType<typeof useTextDistortion> | null = null
let ghostDrift: ReturnType<typeof stage.attachGhostDrift> | null = null
let textResizeHandler: (() => void) | null = null
let sectionPointerHandler: ((e: PointerEvent) => void) | null = null

interface NameFontSizes {
  first: number
  last: number
}

/* Ukuran per baris dihitung dari pengukuran teks (scale = targetWidth /
   measuredWidth), bukan vw statis — letterSpacing px ikut skala fontSize
   sehingga lebar terukur linear terhadap fontSize dan hasil fit eksak */
function measureNameFontSizes(width: number): NameFontSizes {
  const ctx = document.createElement('canvas').getContext('2d')!
  ctx.font = `700 ${NAME_MEASURE_BASE_PX}px ${NAME_FONT}`
  if ('letterSpacing' in ctx)
    ctx.letterSpacing = `${NAME_MEASURE_BASE_PX * NAME_TRACKING_EM}px`

  function fitTo(text: string, widthFrac: number): number {
    return (width * widthFrac) / ctx.measureText(text).width * NAME_MEASURE_BASE_PX
  }

  return {
    first: fitTo(NAME_FIRST, NAME_FIRST_WIDTH_FRAC),
    last: fitTo(NAME_LAST, NAME_LAST_WIDTH_FRAC),
  }
}

function buildDistortionLines(): DistortionLine[] {
  const width = sectionRef.value?.clientWidth ?? window.innerWidth
  const sizes = measureNameFontSizes(width)
  return [
    { text: NAME_FIRST, xAlign: 'left', yFrac: NAME_FIRST_YFRAC, fontSize: sizes.first },
    { text: NAME_LAST, xAlign: 'right', yFrac: NAME_LAST_YFRAC, fontSize: sizes.last },
  ]
}

/* Overlay DOM diposisikan dengan metrics canvas yang sama dengan offscreen
   texture, supaya crossfade DOM → WebGL tidak menimbulkan pergeseran visual */
function layoutNames() {
  const section = sectionRef.value
  const first = firstNameRef.value
  const last = lastNameRef.value
  if (!section || !first || !last)
    return

  const w = section.clientWidth
  const h = section.clientHeight
  const pad = distortionTextPadding(w)
  const sizes = measureNameFontSizes(w)

  const ctx = document.createElement('canvas').getContext('2d')!

  function placeName(el: HTMLElement, text: string, fontSize: number, align: 'left' | 'right', yFrac: number) {
    ctx.font = `700 ${fontSize}px ${NAME_FONT}`
    if ('letterSpacing' in ctx)
      ctx.letterSpacing = `${fontSize * NAME_TRACKING_EM}px`
    const metrics = ctx.measureText(text)
    const x = align === 'left' ? pad : w - pad - metrics.width
    const ascent = metrics.fontBoundingBoxAscent
    const descent = metrics.fontBoundingBoxDescent
    const baselineFromTop = (fontSize - (ascent + descent)) / 2 + ascent
    el.style.left = `${x}px`
    el.style.top = `${yFrac * h - baselineFromTop}px`
    el.style.fontSize = `${fontSize}px`
  }

  placeName(first, NAME_FIRST, sizes.first, 'left', NAME_FIRST_YFRAC)
  placeName(last, NAME_LAST, sizes.last, 'right', NAME_LAST_YFRAC)
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
    await document.fonts.ready
    layoutNames()
    textResizeHandler = layoutNames
    window.addEventListener('resize', textResizeHandler)
    stage.startClock()
    return
  }

  const gsapModule = await import('gsap')
  const gsap = gsapModule.default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  gsap.set(
    [namesRef.value, metaRef.value, scrollRef.value].filter(Boolean),
    { autoAlpha: 0 },
  )

  /* Transform diambil alih GSAP secara eksplisit: parsing matrix dari CSS
     translate(-50%,-50%) menghasilkan x/y dalam px yang akan tertimpa oleh
     quickTo drift — xPercent/yPercent menjaga centering tetap utuh */
  if (ghostRef.value) {
    gsap.set(ghostRef.value, {
      xPercent: -50,
      yPercent: -50,
      x: 0,
      y: 0,
      rotation: -4,
      opacity: 0,
      filter: 'blur(18px)',
    })
  }

  if (fluidCanvasRef.value) {
    /* Hue dikunci ke identity palette (cyan #a1e0e7 → blue #0047FF →
       indigo #0f0a72 → violet): chromatic event hanya dalam keluarga warna
       brand, tetap multi-color (taste-dna melarang single-tint) */
    fluidReady = fluid.init(fluidCanvasRef.value, { skipInitialSplats: true, hueMin: 0.52, hueMax: 0.75 })
    if (fluidReady) {
      fluidCanvasRef.value.style.opacity = '0'
      resizeObserver = new ResizeObserver(() => {
        fluid.resize()
      })
      resizeObserver.observe(fluidCanvasRef.value)
    }
  }

  await document.fonts.ready
  layoutNames()
  const firstChars = firstNameRef.value ? buildNameChars(firstNameRef.value) : []
  const lastChars = lastNameRef.value ? buildNameChars(lastNameRef.value) : []

  if (textCanvasRef.value) {
    const sim = useTextDistortion({
      intensity: 0.075,
      chromaticSpread: 0.015,
      letterSpacingEm: NAME_TRACKING_EM,
      lines: buildDistortionLines(),
    })
    if (sim.init(textCanvasRef.value))
      textDistortion = sim
  }

  textResizeHandler = () => {
    layoutNames()
    textDistortion?.updateLines(buildDistortionLines())
  }
  window.addEventListener('resize', textResizeHandler)

  if (ghostRef.value)
    ghostDrift = stage.attachGhostDrift(gsap, ghostRef.value)

  sectionPointerHandler = (e: PointerEvent) => {
    ghostDrift?.onPointerMove(e)
    if (fluidReady && !fluidActivated && fluidCanvasRef.value) {
      fluidActivated = true
      gsap.to(fluidCanvasRef.value, {
        opacity: 1,
        duration: 1.2,
        ease: 'power3.out',
      })
    }
  }
  sectionRef.value?.addEventListener('pointermove', sectionPointerHandler, { passive: true })

  gsapCtx = gsap.context(() => {
    const metaItems = metaRef.value
      ? Array.from(metaRef.value.querySelectorAll<HTMLElement>('.hero__meta-item'))
      : []
    const scrollText = scrollRef.value?.querySelector<HTMLElement>('.hero__scroll-text') ?? null

    gsap.set(firstChars, { opacity: 0, x: -24, filter: 'blur(16px)' })
    gsap.set(lastChars, { opacity: 0, x: 24, filter: 'blur(16px)' })
    gsap.set(metaItems, { autoAlpha: 0 })
    if (clockRef.value)
      gsap.set(clockRef.value, { autoAlpha: 0 })
    if (scrollLineRef.value)
      gsap.set(scrollLineRef.value, { scaleY: 0 })
    if (scrollText)
      gsap.set(scrollText, { opacity: 0 })
    gsap.set(
      [namesRef.value, metaRef.value, scrollRef.value].filter(Boolean),
      { autoAlpha: 1 },
    )

    const ghostBreath = ghostRef.value
      ? gsap.to(ghostRef.value, {
          opacity: 0.17,
          duration: 3.5,
          ease: 'expo.inOut',
          repeat: -1,
          yoyo: true,
          paused: true,
        })
      : null

    const dotPulse = statusDotRef.value
      ? gsap.to(statusDotRef.value, {
          scale: 1.35,
          opacity: 0.55,
          duration: 1.1,
          ease: 'expo.inOut',
          repeat: -1,
          yoyo: true,
          paused: true,
        })
      : null

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

    if (firstChars.length) {
      tl.to(firstChars, {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        stagger: 0.022,
        ease: 'power4.out',
      }, 0.15)
    }

    if (lastChars.length) {
      tl.to(lastChars, {
        opacity: 1,
        x: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        stagger: { each: 0.022, from: 'end' },
        ease: 'power4.out',
      }, 0.35)
    }

    if (ghostRef.value) {
      tl.to(ghostRef.value, {
        opacity: 0.12,
        filter: 'blur(0px)',
        duration: 1.1,
        ease: 'power3.out',
      }, 0.75)
      tl.call(() => {
        ghostBreath?.play()
      }, [], 1.85)
    }

    metaItems.forEach((item, i) => {
      const at = 0.75 + i * 0.09
      tl.to(item, { autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, at)
      const label = item.querySelector<HTMLElement>('.hero__meta-scramble')
      if (label) {
        tl.call(() => {
          scrambleText(label)
        }, [], at)
      }
    })

    tl.call(() => {
      if (indexNumRef.value)
        scrambleDigits(indexNumRef.value)
      stage.startClock()
      if (statusRef.value)
        stage.startStatusRotator(statusRef.value, STATUS_LINES, scrambleText)
      dotPulse?.play()
    }, [], 1.05)

    if (clockRef.value)
      tl.to(clockRef.value, { autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 1.05)

    if (scrollLineRef.value)
      tl.to(scrollLineRef.value, { scaleY: 1, duration: 1, ease: 'expo.inOut' }, 1.15)
    if (scrollText)
      tl.to(scrollText, { opacity: 1, duration: 0.6, ease: 'power3.out' }, 1.55)

    if (textDistortion && textCanvasRef.value && namesRef.value) {
      tl.call(() => {
        textDistortion?.start()
      }, [], 1.25)
      tl.to(textCanvasRef.value, { opacity: 1, duration: 0.6, ease: 'power3.out' }, 1.35)
      tl.to(namesRef.value, { autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 1.4)
      tl.set(namesRef.value, { display: 'none' }, 2.15)
    }

    if (sectionRef.value && contentRef.value) {
      gsap.to(contentRef.value, {
        yPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })

      gsap.to(
        [contentRef.value, metaRef.value, ghostWrapRef.value].filter(Boolean),
        {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top top',
            end: '50% top',
            scrub: true,
          },
        },
      )
    }

    if (sectionRef.value && fluidCanvasRef.value) {
      gsap.to(fluidCanvasRef.value, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
    }

    if (sectionRef.value && scrollRef.value) {
      gsap.to(scrollRef.value, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: '15% top',
          scrub: true,
        },
      })
    }
  })
})

onUnmounted(() => {
  gsapCtx?.revert()
  stage.destroy()
  fluid.destroy()
  textDistortion?.destroy()
  textDistortion = null
  ghostDrift = null
  resizeObserver?.disconnect()
  if (textResizeHandler)
    window.removeEventListener('resize', textResizeHandler)
  if (sectionPointerHandler)
    sectionRef.value?.removeEventListener('pointermove', sectionPointerHandler)
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

    <div ref="ghostWrapRef" class="hero__ghost" aria-hidden="true">
      <span ref="ghostRef" class="hero__ghost-text">frontend architect</span>
    </div>

    <div ref="contentRef" class="hero__content">
      <canvas
        ref="textCanvasRef"
        class="hero__text-canvas"
        aria-hidden="true"
      />
      <div ref="namesRef" class="hero__names" aria-hidden="true">
        <span ref="firstNameRef" class="hero__name">BILLY</span>
        <span ref="lastNameRef" class="hero__name">MAULANA</span>
      </div>
      <h1 class="sr-only">
        Billy Maulana
      </h1>
    </div>

    <div ref="metaRef" class="hero__meta">
      <div class="hero__meta-item hero__meta-edition" aria-hidden="true">
        <span class="hero__meta-scramble">PORTFOLIO — 2026</span>
        <span class="hero__meta-version">V.3</span>
      </div>
      <div class="hero__meta-item hero__meta-index" aria-hidden="true">
        <span class="hero__meta-index-rule" />
        <span ref="indexNumRef" class="hero__meta-index-num">01 — 05</span>
      </div>
      <div class="hero__meta-item hero__meta-status" aria-hidden="true">
        <span ref="statusDotRef" class="hero__meta-dot" />
        <span ref="statusRef" class="hero__meta-scramble">AVAILABLE FOR SELECT WORK</span>
      </div>
      <div class="hero__meta-item hero__meta-location" aria-hidden="true">
        <span class="hero__meta-scramble">BANDUNG 6.9°S 107.6°E</span>
        <span ref="clockRef" class="hero__meta-clock">— {{ clockText }}</span>
      </div>
    </div>

    <div ref="scrollRef" class="hero__scroll" aria-hidden="true">
      <span ref="scrollLineRef" class="hero__scroll-line" />
      <span class="hero__scroll-text">Explore</span>
    </div>
  </section>
</template>

<style scoped>
.hero {
  --hero-margin: clamp(1.5rem, 4vw, 4rem);
  --hero-bottom: clamp(2rem, 4vh, 3rem);

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
  z-index: 3;
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

.hero__ghost {
  position: absolute;
  left: 50%;
  top: 56%;
  z-index: 4;
  pointer-events: none;
}

.hero__ghost-text {
  display: inline-block;
  transform: translate(-50%, -50%) rotate(-4deg);
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  font-size: 7vw;
  letter-spacing: 0.01em;
  line-height: 1;
  white-space: nowrap;
  color: rgb(208, 208, 216);
  opacity: 0;
  will-change: transform, filter, opacity;
}

.hero__content {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  mix-blend-mode: difference;
}

.hero__text-canvas {
  position: absolute;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.hero__names {
  position: absolute;
  inset: 0;
}

.hero__name {
  position: absolute;
  top: 0;
  left: 0;
  font-family: 'Switzer', 'Helvetica Neue', sans-serif;
  font-weight: 700;
  font-size: 13vw;
  letter-spacing: -0.035em;
  line-height: 1;
  color: #fff;
  white-space: nowrap;
}

.hero__name-char {
  display: inline-block;
  will-change: transform, filter, opacity;
}

.hero__meta {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
  font-family: var(--font-hero);
  font-weight: 500;
  font-size: 0.625rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(208, 208, 216, 0.62);
  font-feature-settings: 'tnum' 1;
  font-variant-numeric: tabular-nums;
}

.hero__meta-item {
  position: absolute;
}

.hero__meta-edition {
  top: clamp(4.5rem, 9vh, 6.5rem);
  right: var(--hero-margin);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
  text-align: right;
}

.hero__meta-version {
  opacity: 0.55;
}

.hero__meta-index {
  top: 50%;
  left: var(--hero-margin);
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.hero__meta-index-rule {
  width: 1px;
  height: 28px;
  background: rgba(208, 208, 216, 0.35);
}

.hero__meta-index-num {
  writing-mode: vertical-rl;
}

.hero__meta-status {
  bottom: var(--hero-bottom);
  left: var(--hero-margin);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.hero__meta-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent-primary, #0047FF);
  flex-shrink: 0;
}

.hero__meta-location {
  bottom: var(--hero-bottom);
  right: var(--hero-margin);
  text-align: right;
}

.hero__meta-clock {
  margin-left: 0.6ch;
}

.hero__scroll {
  position: absolute;
  bottom: var(--hero-bottom);
  left: 50%;
  transform: translateX(-50%);
  z-index: 8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  pointer-events: none;
  mix-blend-mode: difference;
}

.hero__scroll-line {
  display: block;
  width: 1px;
  height: 28px;
  background: var(--text-primary);
  transform-origin: top;
}

.hero__scroll-text {
  font-family: var(--font-display);
  font-size: clamp(0.6rem, 0.7vw, 0.7rem);
  font-weight: 600;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--text-primary);
  writing-mode: vertical-rl;
}

@media (max-width: 768px) {
  .hero__meta-edition,
  .hero__meta-index,
  .hero__meta-status {
    display: none;
  }

  .hero__scroll {
    bottom: 1.5rem;
  }

  .hero__scroll-line {
    height: 32px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__canvas {
    display: none;
  }

  .hero__ghost-text {
    opacity: 0.14;
  }
}
</style>
