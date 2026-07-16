<script setup lang="ts">
import { useFluidSimulation } from '~/composables/useFluidSimulation'

const MASTHEAD_TEXT = 'BILLYMAULANA'
const NAME_FONT = '\'Bebas Neue\', Impact, sans-serif'
const NAME_TRACKING_EM = -0.01
const NAME_MEASURE_BASE_PX = 100
const NAME_Y_FRAC = 0.4

const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const CROSSING_STRIPES = 7

const sectionRef = ref<HTMLElement>()
const fluidCanvasRef = ref<HTMLCanvasElement>()
const nameRef = ref<HTMLElement>()
const navRef = ref<HTMLElement>()
const crossingRef = ref<HTMLElement>()
const crossingBeltRef = ref<HTMLElement>()
const footRef = ref<HTMLElement>()
const statusDotRef = ref<HTMLElement>()

const fluid = useFluidSimulation()

let gsapCtx: gsap.Context | null = null
let resizeObserver: ResizeObserver | null = null
let fluidReady = false
let resizeHandler: (() => void) | null = null
let nameChars: HTMLElement[] = []

interface MastheadMetrics {
  pad: number
  fontSize: number
  left: number
  baselineFromTop: number
}

function heroPadding(width: number): number {
  const rootFs = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  return Math.min(Math.max(1.5 * rootFs, width * 0.04), 4 * rootFs)
}

/* Fit & posisi berbasis lebar INK (actualBoundingBox), bukan advance width:
   side bearing font membuat tepi visual B/A meleset dari pad bila memakai
   advance — semua metric diukur di base size lalu diskala linear (letter-
   spacing px ikut fontSize sehingga skala tetap linear) */
function measureMasthead(width: number): MastheadMetrics {
  const ctx = document.createElement('canvas').getContext('2d')!
  ctx.font = `400 ${NAME_MEASURE_BASE_PX}px ${NAME_FONT}`
  if ('letterSpacing' in ctx)
    ctx.letterSpacing = `${NAME_MEASURE_BASE_PX * NAME_TRACKING_EM}px`
  const metrics = ctx.measureText(MASTHEAD_TEXT)
  const inkWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
  const pad = heroPadding(width)
  const scale = (width - 2 * pad) / inkWidth
  const ascent = metrics.fontBoundingBoxAscent
  const descent = metrics.fontBoundingBoxDescent
  return {
    pad,
    fontSize: NAME_MEASURE_BASE_PX * scale,
    left: pad + metrics.actualBoundingBoxLeft * scale,
    baselineFromTop: ((NAME_MEASURE_BASE_PX - (ascent + descent)) / 2 + ascent) * scale,
  }
}

/* --v3-pad diset dari JS dengan formula pad yang sama dengan pengukuran
   masthead: fallback clamp CSS memakai vw (termasuk scrollbar) sehingga bisa
   meleset dari clientWidth — satu sumber = nav/index/kaki sejajar piksel
   dengan ink masthead */
function layoutMasthead() {
  const section = sectionRef.value
  const name = nameRef.value
  if (!section || !name)
    return

  const m = measureMasthead(section.clientWidth)
  section.style.setProperty('--v3-pad', `${m.pad}px`)
  name.style.left = `${m.left}px`
  name.style.top = `${NAME_Y_FRAC * section.clientHeight - m.baselineFromTop}px`
  name.style.fontSize = `${m.fontSize}px`
}

function buildNameChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? ''
  el.textContent = ''
  const chars: HTMLElement[] = []
  for (const ch of text) {
    const span = document.createElement('span')
    span.className = 'v3__name-char'
    span.textContent = ch
    el.appendChild(span)
    chars.push(span)
  }
  return chars
}

onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  /* fonts.ready bisa resolve sebelum Bebas Neue di-fetch (font baru dimuat
     saat dipakai) — tanpa load eksplisit, fit-to-width terukur dengan
     metrics fallback dan lebar masthead meleset */
  await document.fonts.load(`400 100px ${NAME_FONT}`)
  await document.fonts.ready

  if (prefersReduced) {
    layoutMasthead()
    resizeHandler = layoutMasthead
    window.addEventListener('resize', resizeHandler)
    return
  }

  const gsapModule = await import('gsap')
  const gsap = gsapModule.default

  gsap.set(
    [nameRef.value, navRef.value, crossingRef.value, footRef.value].filter(Boolean),
    { autoAlpha: 0 },
  )

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

  layoutMasthead()
  nameChars = nameRef.value ? buildNameChars(nameRef.value) : []

  resizeHandler = layoutMasthead
  window.addEventListener('resize', resizeHandler)

  /* Pengukuran saat init masih bisa memakai metrics fallback walau
     fonts.load di-await (race pemuatan face 400) — refresh sekali setelah
     render menjamin fit presisi, selesai di balik preloader */
  document.fonts.ready.then(() => resizeHandler?.())

  gsapCtx = gsap.context(() => {
    const navItems = navRef.value
      ? Array.from(navRef.value.querySelectorAll<HTMLElement>('.v3__nav-item'))
      : []
    const footBlocks = footRef.value
      ? Array.from(footRef.value.querySelectorAll<HTMLElement>('.v3__foot-block'))
      : []

    gsap.set(nameChars, { opacity: 0, y: 40, filter: 'blur(12px)' })
    gsap.set([...navItems, ...footBlocks], { autoAlpha: 0 })
    if (crossingRef.value)
      gsap.set(crossingRef.value, { clipPath: 'inset(100% 0% 0% 0%)' })
    gsap.set(
      [nameRef.value, navRef.value, crossingRef.value, footRef.value].filter(Boolean),
      { autoAlpha: 1 },
    )

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

    if (nameChars.length) {
      tl.to(nameChars, {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        stagger: 0.018,
        ease: 'power4.out',
      }, 0.15)
    }

    navItems.forEach((item, i) => {
      tl.to(item, { autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 0.7 + i * 0.08)
    })

    if (crossingRef.value) {
      tl.to(crossingRef.value, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.4,
        ease: 'expo.inOut',
      }, 0.95)
    }

    if (crossingBeltRef.value) {
      gsap.to(crossingBeltRef.value, {
        yPercent: 100 / CROSSING_STRIPES,
        duration: 14,
        ease: 'none',
        repeat: -1,
      })
    }

    footBlocks.forEach((block, i) => {
      tl.to(block, { autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 0.95 + i * 0.1)
    })

    tl.call(() => {
      dotPulse?.play()
    }, [], 1.05)

    if (fluidReady && fluidCanvasRef.value)
      tl.to(fluidCanvasRef.value, { opacity: 1, duration: 2, ease: 'power3.out' }, 1.5)
  })
})

onUnmounted(() => {
  gsapCtx?.revert()
  fluid.destroy()
  resizeObserver?.disconnect()
  if (resizeHandler)
    window.removeEventListener('resize', resizeHandler)
})
</script>

<template>
  <section
    ref="sectionRef"
    class="v3"
    aria-label="Billy Maulana — Frontend Architect & Creative Developer"
  >
    <div ref="crossingRef" class="v3__crossing" aria-hidden="true">
      <div ref="crossingBeltRef" class="v3__crossing-belt">
        <div v-for="n in CROSSING_STRIPES" :key="n" class="v3__crossing-stripe" />
      </div>
    </div>

    <canvas
      ref="fluidCanvasRef"
      class="v3__canvas"
      aria-hidden="true"
    />

    <div class="v3__grain" aria-hidden="true" />

    <div class="v3__content">
      <div class="v3__names" aria-hidden="true">
        <span ref="nameRef" class="v3__name">BILLYMAULANA</span>
      </div>
      <h1 class="sr-only">
        Billy Maulana
      </h1>
    </div>

    <nav ref="navRef" class="v3__nav" aria-label="Hero navigation">
      <ul class="v3__nav-links">
        <li v-for="link in NAV_LINKS" :key="link.href" class="v3__nav-item">
          <a class="v3__nav-link" :href="link.href">{{ link.label }}</a>
        </li>
      </ul>
      <div class="v3__nav-item v3__nav-status">
        <span ref="statusDotRef" class="v3__nav-dot" aria-hidden="true" />
        <span class="v3__nav-status-label">Available for select work</span>
      </div>
    </nav>

    <div ref="footRef" class="v3__foot">
      <div class="v3__foot-block v3__foot-role">
        <p class="v3__foot-lines">
          Frontend Architect &amp;<br>Creative Developer
        </p>
        <a class="v3__foot-link" href="#about">Explore <span aria-hidden="true">&#8600;</span></a>
      </div>
      <div class="v3__foot-block v3__foot-scroll" aria-hidden="true">
        Scroll
      </div>
      <div class="v3__foot-block v3__foot-clients">
        <p class="v3__foot-lines">
          PLN Mobile, Flexben,<br>UNESCO IHP
        </p>
        <a class="v3__foot-link" href="#work">View work <span aria-hidden="true">&#8600;</span></a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.v3 {
  --v3-pad: clamp(1.5rem, 4vw, 4rem);
  --v3-bottom: clamp(2rem, 4vh, 3rem);

  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  background:
    radial-gradient(ellipse 70% 50% at 50% 50%, rgba(6, 6, 16, 0.6) 0%, transparent 70%),
    #060610;
}

.v3__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: auto;
  mix-blend-mode: screen;
}

.v3__grain {
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

.v3__content {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  mix-blend-mode: difference;
}

.v3__names {
  position: absolute;
  inset: 0;
}

.v3__name {
  position: absolute;
  top: 0;
  left: 0;
  font-family: 'Bebas Neue', Impact, sans-serif;
  font-weight: 400;
  font-size: 24vw;
  letter-spacing: -0.01em;
  line-height: 1;
  text-transform: uppercase;
  color: #F2EFEA;
  white-space: nowrap;
}

.v3__name :deep(.v3__name-char) {
  display: inline-block;
  will-change: transform, filter, opacity;
}

.v3__nav {
  position: absolute;
  top: calc(40% + clamp(1.75rem, 3.5vh, 3rem));
  left: var(--v3-pad);
  right: var(--v3-pad);
  z-index: 6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  pointer-events: none;
  font-family: 'Satoshi', 'Inter', system-ui, sans-serif;
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(232, 232, 236, 0.78);
}

.v3__nav-links {
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 2.75rem);
}

.v3__nav-link {
  pointer-events: auto;
  color: rgba(232, 232, 236, 0.78);
  transition: color 0.3s var(--ease-out-expo);
}

.v3__nav-link:hover {
  color: #F2EFEA;
}

.v3__nav-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: rgba(208, 208, 216, 0.62);
}

.v3__nav-status-label {
  margin-right: -0.18em;
}

.v3__nav-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--accent-primary, #0047FF);
  flex-shrink: 0;
}

.v3__crossing {
  --v3-stripe: clamp(1.5rem, 4.2vh, 2.6rem);

  position: absolute;
  top: 50%;
  bottom: 18%;
  left: -20vw;
  right: -20vw;
  z-index: 2;
  overflow: hidden;
  pointer-events: none;
  transform: perspective(900px) rotateX(58deg);
  transform-origin: bottom center;
}

.v3__crossing-belt {
  position: absolute;
  top: calc(var(--v3-stripe) * -2);
  left: 0;
  right: 0;
  height: calc(var(--v3-stripe) * 14);
  will-change: transform;
}

.v3__crossing-stripe {
  height: var(--v3-stripe);
  margin-bottom: var(--v3-stripe);
  background: rgba(242, 239, 234, 0.92);
}

.v3__foot {
  position: absolute;
  bottom: var(--v3-bottom);
  left: var(--v3-pad);
  right: var(--v3-pad);
  z-index: 6;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  pointer-events: none;
  font-family: 'Satoshi', 'Inter', system-ui, sans-serif;
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(208, 208, 216, 0.62);
}

.v3__foot-lines {
  line-height: 1.7;
}

.v3__foot-link {
  display: inline-block;
  margin-top: 0.85rem;
  pointer-events: auto;
  color: rgba(232, 232, 236, 0.78);
  transition: color 0.3s var(--ease-out-expo);
}

.v3__foot-link:hover {
  color: #F2EFEA;
}

.v3__foot-scroll {
  color: rgba(208, 208, 216, 0.62);
}

.v3__foot-clients {
  text-align: right;
  margin-right: -0.18em;
}

@media (max-width: 768px) {
  .v3__nav {
    font-size: 0.6875rem;
  }

  .v3__nav-status {
    display: none;
  }

  .v3__foot {
    bottom: 1.5rem;
  }

  .v3__foot-scroll,
  .v3__foot-clients {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .v3__canvas {
    display: none;
  }
}
</style>
