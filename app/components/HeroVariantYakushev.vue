<script setup lang="ts">
import { useFluidSimulation } from '~/composables/useFluidSimulation'
import { useHeroStage } from '~/composables/useHeroStage'
import { profile } from '~/constants/profile'

const NAME_MEASURE_BASE_PX = 100
const NAME_LINE_HEIGHT = 0.81
const NAME_BASELINE_FRAC = 0.86
const NAME_OVERSHOOT_RIGHT_FRAC = 0.004

/* x-height Cormorant lebih kecil dari Switzer: tanpa upscale 1.07em run
   serif tampak mengecil di samping run sans — nilai ini juga dipakai saat
   mengukur line box Cormorant supaya posisi baseline tetap akurat */
const MAULANA_SCALE = 1.07
const NAME_RUNS = [
  { font: `500 ${NAME_MEASURE_BASE_PX}px Switzer`, size: NAME_MEASURE_BASE_PX },
  { font: `italic 600 ${NAME_MEASURE_BASE_PX * MAULANA_SCALE}px Cormorant`, size: NAME_MEASURE_BASE_PX * MAULANA_SCALE },
]

const SOCIAL_LINKS = [
  { label: 'GitHub', href: profile.github },
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'Instagram', href: profile.instagram },
]

const NAV_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const sectionRef = ref<HTMLElement>()
const fluidCanvasRef = ref<HTMLCanvasElement>()
const nameRef = ref<HTMLElement>()
const taglineRef = ref<HTMLElement>()
const monoLeftRef = ref<HTMLElement>()
const monoRightRef = ref<HTMLElement>()
const metaRef = ref<HTMLElement>()

const fluid = useFluidSimulation()
const heroStage = useHeroStage()
const { clockText } = heroStage

let gsapCtx: gsap.Context | null = null
let resizeObserver: ResizeObserver | null = null
let fluidReady = false
let resizeHandler: (() => void) | null = null
let nameChars: HTMLElement[] = []

function heroPadding(width: number): number {
  const rootFs = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  return Math.min(Math.max(1.5 * rootFs, width * 0.04), 4 * rootFs)
}

/* Baseline dihitung dari line box CSS (line-height < 1 memberi half-leading
   negatif): tanpa ini, top yang menempatkan baseline di 0.86 viewport tidak
   bisa diturunkan dari font-size saja. Dua run diukur pada ukuran masing-
   masing (Cormorant 1.07x) karena run italic bisa menaikkan tinggi line box
   melebihi strut Switzer */
function measureBaselineFromTop(fontSize: number): number {
  const ctx = document.createElement('canvas').getContext('2d')!
  let maxBaseline = 0
  for (const run of NAME_RUNS) {
    ctx.font = run.font
    const m = ctx.measureText('BillyMaulana')
    const contentHeight = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent
    const baseline = (NAME_LINE_HEIGHT * run.size - contentHeight) / 2 + m.fontBoundingBoxAscent
    if (baseline > maxBaseline)
      maxBaseline = baseline
  }
  return maxBaseline * (fontSize / NAME_MEASURE_BASE_PX)
}

/* Fit diukur lewat DOM rect, bukan canvas: nama terdiri dari dua run font
   (Switzer + Cormorant italic) sehingga concat metrics canvas rapuh —
   letter-spacing em-based membuat skala tetap linear dari base 100px.
   Tepi kanan diberi overshoot optik +0.4% dari target width: terminal "a"
   Cormorant bundar tampak masuk tanpa overshoot — tepi kiri "B" (bowl
   datar) tetap presisi di pad */
function layoutName() {
  const section = sectionRef.value
  const name = nameRef.value
  if (!section || !name)
    return

  const width = section.clientWidth
  const pad = heroPadding(width)
  section.style.setProperty('--yk-pad', `${pad}px`)

  name.style.fontSize = `${NAME_MEASURE_BASE_PX}px`
  const measured = name.getBoundingClientRect().width
  const fontSize = measured > 0
    ? NAME_MEASURE_BASE_PX * (((width - 2 * pad) * (1 + NAME_OVERSHOOT_RIGHT_FRAC)) / measured)
    : NAME_MEASURE_BASE_PX

  name.style.fontSize = `${fontSize}px`
  name.style.left = `${pad}px`
  name.style.top = `${NAME_BASELINE_FRAC * section.clientHeight - measureBaselineFromTop(fontSize)}px`
}

function buildNameChars(el: HTMLElement): HTMLElement[] {
  const chars: HTMLElement[] = []
  for (const run of Array.from(el.children)) {
    const text = run.textContent ?? ''
    run.textContent = ''
    for (const ch of text) {
      const span = document.createElement('span')
      span.className = 'yk__name-char'
      span.textContent = ch
      run.appendChild(span)
      chars.push(span)
    }
  }
  return chars
}

onMounted(async () => {
  heroStage.startClock()

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* fonts.ready bisa resolve sebelum face di-fetch (font dimuat saat pertama
     dipakai) — tanpa load eksplisit fit-to-width terukur dengan fallback
     metrics dan lebar nama meleset */
  await Promise.all(NAME_RUNS.map(run => document.fonts.load(run.font)))
  await document.fonts.ready

  if (prefersReduced) {
    layoutName()
    resizeHandler = layoutName
    window.addEventListener('resize', resizeHandler)
    return
  }

  const gsapModule = await import('gsap')
  const gsap = gsapModule.default

  gsap.set(
    [nameRef.value, taglineRef.value, monoLeftRef.value, monoRightRef.value, metaRef.value].filter(Boolean),
    { autoAlpha: 0 },
  )

  if (fluidCanvasRef.value) {
    fluidReady = fluid.init(fluidCanvasRef.value, { skipInitialSplats: true, hueMin: 0.52, hueMax: 0.75 })
    if (fluidReady) {
      fluidCanvasRef.value.style.opacity = '0'
      resizeObserver = new ResizeObserver(() => {
        fluid.resize()
      })
      resizeObserver.observe(fluidCanvasRef.value)
    }
  }

  layoutName()
  nameChars = nameRef.value ? buildNameChars(nameRef.value) : []

  resizeHandler = layoutName
  window.addEventListener('resize', resizeHandler)

  /* Pengukuran awal masih bisa memakai metrics fallback walau fonts.load
     di-await (race pemuatan face) — refresh sekali setelah render menjamin
     fit presisi, selesai di balik preloader */
  document.fonts.ready.then(() => resizeHandler?.())

  gsapCtx = gsap.context(() => {
    const metaBlocks = metaRef.value
      ? Array.from(metaRef.value.querySelectorAll<HTMLElement>('.yk__meta-block'))
      : []

    gsap.set(nameChars, { yPercent: 100, opacity: 0, filter: 'blur(8px)' })
    gsap.set(metaBlocks, { autoAlpha: 0 })
    gsap.set(nameRef.value ? [nameRef.value] : [], { autoAlpha: 1 })
    gsap.set(metaRef.value ? [metaRef.value] : [], { autoAlpha: 1 })

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    if (nameChars.length) {
      tl.to(nameChars, {
        yPercent: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.9,
        stagger: 0.02,
        ease: 'power4.out',
      }, 0.15)
    }

    if (taglineRef.value) {
      tl.fromTo(
        taglineRef.value,
        { filter: 'blur(6px)' },
        { autoAlpha: 1, filter: 'blur(0px)', duration: 0.8 },
        0.75,
      )
    }

    const monos = [monoLeftRef.value, monoRightRef.value].filter((el): el is HTMLElement => Boolean(el))
    if (monos.length)
      tl.to(monos, { autoAlpha: 1, duration: 0.6, stagger: 0.1 }, 0.95)

    metaBlocks.forEach((block, i) => {
      tl.to(block, { autoAlpha: 1, duration: 0.6 }, 1.1 + i * 0.1)
    })

    if (fluidReady && fluidCanvasRef.value)
      tl.to(fluidCanvasRef.value, { opacity: 1, duration: 2 }, 1.4)
  })
})

onUnmounted(() => {
  gsapCtx?.revert()
  fluid.destroy()
  heroStage.destroy()
  resizeObserver?.disconnect()
  if (resizeHandler)
    window.removeEventListener('resize', resizeHandler)
})
</script>

<template>
  <section
    ref="sectionRef"
    class="yk"
    aria-label="Billy Maulana — Frontend Architect"
  >
    <canvas
      ref="fluidCanvasRef"
      class="yk__canvas"
      aria-hidden="true"
    />

    <div class="yk__grain" aria-hidden="true" />

    <p ref="taglineRef" class="yk__tagline">
      <span class="yk__tagline-serif">A Frontend Architect</span> crafting <span class="yk__tagline-dim">interfaces</span><br>
      that move millions of <span class="yk__tagline-dim">people.</span>
    </p>

    <span ref="monoLeftRef" class="yk__mono yk__mono--left" aria-hidden="true">B</span>
    <span ref="monoRightRef" class="yk__mono yk__mono--right" aria-hidden="true">M</span>

    <div class="yk__name-stage" aria-hidden="true">
      <span ref="nameRef" class="yk__name"><span class="yk__name-billy">Billy</span><span class="yk__name-maulana">Maulana</span></span>
    </div>
    <h1 class="sr-only">
      Billy Maulana
    </h1>

    <div ref="metaRef" class="yk__meta">
      <p class="yk__meta-block yk__meta-place">
        Bandung — {{ clockText }} GMT+7
      </p>
      <ul class="yk__meta-block yk__meta-links">
        <li v-for="link in SOCIAL_LINKS" :key="link.label">
          <a class="yk__meta-link" :href="link.href" target="_blank" rel="noopener">{{ link.label }}</a>
        </li>
      </ul>
      <nav class="yk__meta-block yk__meta-nav" aria-label="Hero navigation">
        <a
          v-for="link in NAV_LINKS"
          :key="link.label"
          class="yk__meta-link"
          :href="link.href"
        >{{ link.label }}</a>
      </nav>
    </div>
  </section>
</template>

<style scoped>
.yk {
  --yk-pad: clamp(1.5rem, 4vw, 4rem);

  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background:
    radial-gradient(ellipse 70% 50% at 50% 50%, rgba(6, 6, 16, 0.6) 0%, transparent 70%),
    #060610;
}

.yk__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: auto;
  mix-blend-mode: screen;
}

.yk__grain {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  opacity: 0.05;
  mix-blend-mode: overlay;
  background-image: url('/assets/textures/grain.png');
  background-size: 200px 200px;
  background-repeat: repeat;
}

.yk__tagline {
  position: absolute;
  top: clamp(2.5rem, 7vh, 4.5rem);
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  width: max-content;
  max-width: 38ch;
  pointer-events: none;
  text-align: center;
  font-family: 'Switzer', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  font-size: clamp(1.25rem, 1.9vw, 1.71rem);
  letter-spacing: -0.02em;
  line-height: 1.3;
  color: #FFFFFF;
}

.yk__tagline-serif {
  font-family: 'Cormorant', 'Georgia', serif;
  font-style: italic;
  font-weight: 600;
}

.yk__tagline-dim {
  color: rgba(255, 255, 255, 0.45);
}

.yk__mono {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 5;
  pointer-events: none;
  font-family: 'Switzer', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  font-size: 1.875rem;
  line-height: 1;
  color: rgba(242, 239, 234, 0.9);
}

.yk__mono--left {
  left: var(--yk-pad);
}

.yk__mono--right {
  right: var(--yk-pad);
}

.yk__name-stage {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}

.yk__name {
  position: absolute;
  top: 0;
  left: 0;
  white-space: nowrap;
  font-family: 'Switzer', 'Helvetica Neue', sans-serif;
  font-weight: 400;
  font-size: 14.8vw;
  letter-spacing: -0.06em;
  line-height: 0.81;
  color: #F2EFEA;
}

.yk__name-billy {
  font-weight: 500;
  letter-spacing: -0.045em;
  font-feature-settings: 'kern' 1;
}

.yk__name-maulana {
  font-family: 'Cormorant', 'Georgia', serif;
  font-style: italic;
  font-weight: 600;
  font-size: 1.07em;
  letter-spacing: -0.02em;
  margin-left: -0.01em;
  vertical-align: baseline;
}

.yk__name :deep(.yk__name-char) {
  display: inline-block;
  will-change: transform, filter, opacity;
}

.yk__meta {
  position: absolute;
  bottom: clamp(1.25rem, 2.6vh, 2rem);
  left: var(--yk-pad);
  right: var(--yk-pad);
  z-index: 6;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  pointer-events: none;
  font-family: 'Switzer', 'Helvetica Neue', sans-serif;
  font-weight: 500;
  font-size: 0.625rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(208, 208, 216, 0.62);
}

.yk__meta-links {
  display: flex;
  align-items: baseline;
  gap: clamp(1rem, 2vw, 1.75rem);
}

.yk__meta-nav {
  display: flex;
  align-items: baseline;
  gap: clamp(1rem, 2vw, 1.75rem);
}

.yk__meta-link {
  pointer-events: auto;
  color: rgba(208, 208, 216, 0.62);
  transition: color 0.3s var(--ease-out-expo);
}

.yk__meta-link:hover {
  color: #F2EFEA;
}

@media (max-width: 768px) {
  .yk__mono,
  .yk__meta-links {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .yk__canvas {
    display: none;
  }
}
</style>
