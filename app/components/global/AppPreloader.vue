<script setup lang="ts">
import { toRaw } from 'vue'

const emit = defineEmits<{
  complete: []
}>()

const isComplete = ref(false)
const orbRef = ref<HTMLElement>()
const svgRef = ref<SVGSVGElement>()
const counterRef = ref<HTMLElement>()
const curtainLeft = ref<HTMLElement>()
const curtainRight = ref<HTMLElement>()

// 3-column slot machine: hundreds → "1", tens → "0", units → "0"
// Each column scrolls through different amounts for staggered visual speed
const digitColumns = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
]
const targetIndices = [11, 20, 20]

const digitStrips = ref<HTMLElement[]>([])
const cornerEls = ref<HTMLElement[]>([])

function setDigitStrip(el: HTMLElement | null, i: number) {
  if (el)
    digitStrips.value[i] = el
}

function setCornerEl(el: HTMLElement | null, i: number) {
  if (el)
    cornerEls.value[i] = el
}

onMounted(async () => {
  const gsap = (await import('gsap')).default
  const { CustomEase } = await import('gsap/CustomEase')
  gsap.registerPlugin(CustomEase)

  // Reduced motion: skip immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isComplete.value = true
    emit('complete')
    return
  }

  // Guard: all critical refs must be mounted
  const orb = orbRef.value
  const counter = counterRef.value
  const svg = svgRef.value
  const curtainL = curtainLeft.value
  const curtainR = curtainRight.value
  if (!orb || !counter || !svg || !curtainL || !curtainR)
    return

  // Bespoke ease curves — the two signatures of this intro
  // SVG cubic bezier: C requires exactly 6 numbers (cp1x,cp1y cp2x,cp2y ex,ey)
  // bloom: near-zero start, explosive mid at 30%, long gentle settle
  CustomEase.create('bloom', 'M0,0 C0.08,0 0.3,1 1,1')
  // settle: fast initial shoot, very long deceleration tail
  CustomEase.create('settle', 'M0,0 C0.11,0.9 0.44,1 1,1')
  // curtainExit: hard push then decelerate
  CustomEase.create('curtainExit', 'M0,0 C0.76,0 0.24,1 1,1')

  const arcOuter = svg.querySelector<SVGCircleElement>('.preloader__arc--outer')
  const arcInner = svg.querySelector<SVGCircleElement>('.preloader__arc--inner')
  const lineH = svg.querySelector<SVGLineElement>('.preloader__line--h')
  const lineV = svg.querySelector<SVGLineElement>('.preloader__line--v')

  // Circumferences for stroke-dashoffset draw simulation (DrawSVG workaround)
  const outerCircumference = 2 * Math.PI * 160 // ≈ 1005.31
  const innerCircumference = 2 * Math.PI * 100 // ≈ 628.32

  // Initial states — all invisible
  gsap.set(arcOuter, { strokeDasharray: outerCircumference, strokeDashoffset: outerCircumference })
  gsap.set(arcInner, { strokeDasharray: innerCircumference, strokeDashoffset: innerCircumference })
  gsap.set([lineH, lineV], { strokeDasharray: 320, strokeDashoffset: 320 })

  // Orb: GSAP owns the transform (xPercent/yPercent avoid CSS transform conflict)
  gsap.set(orb, { xPercent: -50, yPercent: -50, scale: 0.15, opacity: 0 })

  // Counter: GSAP owns centering transform
  gsap.set(counter, { xPercent: -50, yPercent: -50, opacity: 1 })

  // Corner labels — start hidden below
  gsap.set(toRaw(cornerEls.value), { opacity: 0, y: 8 })

  // Measure digit height at runtime (clamp-based, viewport-dependent)
  const digitHeight = digitStrips.value[0]?.parentElement?.offsetHeight ?? 100

  // startExit as arrow function (not declaration) — preserves TS narrowing in closure
  const startExit = () => {
    const exitTl = gsap.timeline({
      onComplete: () => {
        isComplete.value = true
        emit('complete')
      },
    })

    // All center content fades — counter lifts slightly
    exitTl.to([counter, orb, svg, ...toRaw(cornerEls.value)], {
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut',
    })
    exitTl.to(counter, { y: '-=30', duration: 0.4, ease: 'power3.inOut' }, '<')

    // Curtain split — cinematic page reveal
    exitTl.to(curtainL, { x: '-100%', duration: 0.9, ease: 'curtainExit' }, '+=0.05')
    exitTl.to(curtainR, { x: '100%', duration: 0.9, ease: 'curtainExit' }, '<')
  }

  const tl = gsap.timeline({ onComplete: startExit })

  // t=0.2s — SVG precision arcs draw in (stroke-dashoffset simulation)
  tl.to(arcOuter, { strokeDashoffset: 0, duration: 2.5, ease: 'power2.inOut' }, 0.2)
  tl.to(arcInner, { strokeDashoffset: 0, duration: 2.5, ease: 'power2.inOut' }, 0.4)

  // t=0.5s — Grid crosshair lines extend
  tl.to(lineH, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }, 0.5)
  tl.to(lineV, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }, 0.7)

  // t=0.8s — Gradient orb blooms from center (CustomEase "bloom")
  tl.to(orb, { scale: 1, opacity: 0.6, duration: 3, ease: 'bloom' }, 0.8)

  // t=1.0s — Slot machine counter spins to 100 (CustomEase "settle", stagger per column)
  // noUncheckedIndexedAccess: use ?? 0 fallback for array access
  toRaw(digitStrips.value).forEach((strip, i) => {
    tl.to(strip, {
      y: -((targetIndices[i] ?? 0) * digitHeight),
      duration: 2.75,
      ease: 'settle',
    }, 1.0 + i * 0.05)
  })

  // t=2.0s — Corner labels appear (expo.out, stagger 0.15s)
  tl.to(toRaw(cornerEls.value), {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'expo.out',
    stagger: 0.15,
  }, 2.0)

  // Hold at 100 — brief pause before exit
  tl.to({}, { duration: 0.5 })
})
</script>

<template>
  <Transition name="preloader-fade">
    <div v-if="!isComplete" class="preloader">
      <!-- Atmospheric gradient orb -->
      <div ref="orbRef" class="preloader__orb" />

      <!-- SVG precision engineering grid: 2 arcs + crosshair -->
      <svg
        ref="svgRef"
        class="preloader__grid"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          class="preloader__arc preloader__arc--outer"
          cx="200"
          cy="200"
          r="160"
        />
        <circle
          class="preloader__arc preloader__arc--inner"
          cx="200"
          cy="200"
          r="100"
        />
        <line
          class="preloader__line preloader__line--h"
          x1="40"
          y1="200"
          x2="360"
          y2="200"
        />
        <line
          class="preloader__line preloader__line--v"
          x1="200"
          y1="40"
          x2="200"
          y2="360"
        />
      </svg>

      <!-- Corner labels — Swiss grid identity markers -->
      <div
        v-for="(label, i) in ['FRONTEND', 'ARCHITECT', 'BILLY MAULANA', '2026']"
        :key="label"
        :ref="(el) => setCornerEl(el as HTMLElement, i)"
        class="preloader__corner"
        :class="`preloader__corner--${['tl', 'tr', 'bl', 'br'][i]}`"
      >
        {{ label }}
      </div>

      <!-- 3-column slot-machine counter: 000 → 100 -->
      <div ref="counterRef" class="preloader__counter">
        <div
          v-for="(col, i) in digitColumns"
          :key="i"
          class="preloader__digit"
        >
          <div
            :ref="(el) => setDigitStrip(el as HTMLElement, i)"
            class="preloader__digit-strip"
          >
            <span
              v-for="(n, j) in col"
              :key="j"
            >{{ n }}</span>
          </div>
        </div>
      </div>

      <!-- Split curtain exit panels -->
      <div ref="curtainLeft" class="preloader__curtain preloader__curtain--left" />
      <div ref="curtainRight" class="preloader__curtain preloader__curtain--right" />
    </div>
  </Transition>
</template>

<style scoped>
/* ─── Preloader Root ─────────────────────────────── */
.preloader {
  position: fixed;
  inset: 0;
  z-index: var(--z-preloader);
  background: transparent; /* curtains provide all background coverage */
  overflow: hidden;
}

/* ─── Curtain Panels ─────────────────────────────── */
.preloader__curtain {
  position: absolute;
  top: 0;
  height: 100%;
  width: 50%;
  background: #000;
  z-index: 1;
}

.preloader__curtain--left {
  left: 0;
}

.preloader__curtain--right {
  right: 0;
}

/* ─── Atmospheric Gradient Orb ───────────────────── */
/* Positioned via margin to avoid CSS transform conflict with GSAP */
.preloader__orb {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80vmax;
  height: 80vmax;
  border-radius: 50%;
  background: radial-gradient(
    ellipse at center,
    #0f0a72 0%,
    #0166c9 45%,
    #a1e0e7 100%
  );
  filter: blur(80px);
  z-index: 2;
  pointer-events: none;
  /* xPercent/yPercent set by GSAP — no CSS transform conflict */
}

/* ─── SVG Precision Grid ─────────────────────────── */
.preloader__grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: min(400px, 80vmin);
  height: min(400px, 80vmin);
  overflow: visible;
  z-index: 2;
  pointer-events: none;
}

.preloader__arc {
  fill: none;
  stroke: var(--color-accent);
  stroke-width: 0.5;
}

.preloader__line {
  stroke: var(--color-accent);
  stroke-width: 0.5;
  opacity: 0.5;
}

/* ─── Corner Labels ──────────────────────────────── */
.preloader__corner {
  position: absolute;
  font-family: 'Satoshi', sans-serif;
  font-size: var(--text-label);
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  z-index: 2;
}

.preloader__corner--tl {
  top: var(--page-margin);
  left: var(--page-margin);
}

.preloader__corner--tr {
  top: var(--page-margin);
  right: var(--page-margin);
}

.preloader__corner--bl {
  bottom: var(--page-margin);
  left: var(--page-margin);
}

.preloader__corner--br {
  bottom: var(--page-margin);
  right: var(--page-margin);
}

/* ─── Slot Machine Counter ───────────────────────── */
.preloader__counter {
  --digit-size: clamp(80px, 15vw, 160px);
  position: absolute;
  top: 50%;
  left: 50%;
  /* xPercent/yPercent centering managed by GSAP */
  display: flex;
  gap: 0.01em;
  z-index: 3;
  pointer-events: none;
}

.preloader__digit {
  overflow: hidden;
  height: var(--digit-size);
}

.preloader__digit-strip {
  display: flex;
  flex-direction: column;
  will-change: transform;
}

.preloader__digit-strip span {
  display: block;
  height: var(--digit-size);
  line-height: var(--digit-size);
  font-family: 'Satoshi', sans-serif;
  font-size: var(--digit-size);
  font-weight: 900;
  letter-spacing: -0.04em;
  color: var(--color-text-primary);
  text-align: center;
  /* Ensure consistent digit width across 0-9 */
  min-width: 0.62em;
  font-variant-numeric: tabular-nums;
}

/* ─── Leave Transition ───────────────────────────── */
/* Instant — curtains already off-screen when isComplete fires */
.preloader-fade-leave-active {
  transition: opacity 0.1s linear;
}

.preloader-fade-leave-to {
  opacity: 0;
}
</style>
