<script setup lang="ts">
import { useCharProximity } from '~/composables/useCharProximity'

const NAME_LINE_1 = 'BILLY'
const NAME_LINE_2 = 'MAULANA'

const sectionRef = ref<HTMLElement>()
const nameRef = ref<HTMLElement>()
const charRefs = ref<HTMLElement[]>([])

const proximity = useCharProximity({
  radius: 350,
  minWeight: 200,
  maxWeight: 700,
  smoothing: 0.08,
})

let scrollCtx: gsap.Context | null = null

function collectCharRef(el: unknown) {
  if (el instanceof HTMLElement) {
    charRefs.value.push(el)
  }
}

onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Start cursor proximity (even with reduced motion, weight shift is non-motion)
  if (charRefs.value.length) {
    proximity.setCharElements(charRefs.value)

    // Only start cursor tracking on non-touch devices
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (!isTouch) {
      proximity.start()
    }
    else {
      // On touch: set all to mid-weight for visual interest
      charRefs.value.forEach((el) => {
        el.style.fontVariationSettings = `'wght' 500`
      })
    }
  }

  if (prefersReduced)
    return

  // Scroll-driven: shrink name, expand spacing, reduce opacity
  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  scrollCtx = gsap.context(() => {
    if (!sectionRef.value || !nameRef.value)
      return

    gsap.to(nameRef.value, {
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      },
      letterSpacing: '0.15em',
      opacity: 0.15,
      scale: 0.6,
      ease: 'none',
    })
  })
})

onUnmounted(() => {
  proximity.stop()
  scrollCtx?.revert()
})
</script>

<template>
  <section
    ref="sectionRef"
    class="section-hero"
    aria-label="Billy Maulana — Frontend Architect"
  >
    <!-- Noise grain overlay -->
    <div class="section-hero__grain" aria-hidden="true" />

    <!-- Name: fills viewport -->
    <div ref="nameRef" class="section-hero__name-container">
      <!-- Line 1: BILLY -->
      <div class="section-hero__line">
        <span
          v-for="(char, i) in NAME_LINE_1.split('')"
          :key="`l1-${i}`"
          :ref="collectCharRef"
          class="section-hero__char"
        >{{ char }}</span>
      </div>
      <!-- Line 2: MAULANA -->
      <div class="section-hero__line">
        <span
          v-for="(char, i) in NAME_LINE_2.split('')"
          :key="`l2-${i}`"
          :ref="collectCharRef"
          class="section-hero__char"
        >{{ char }}</span>
      </div>
    </div>

    <!-- Sub-role: bottom-right -->
    <div class="section-hero__meta page-margin">
      <span class="section-hero__role">Frontend Architect</span>
      <span class="section-hero__location">Bandung, ID</span>
    </div>

    <!-- Scroll indicator -->
    <div class="section-hero__scroll" aria-hidden="true">
      <span class="section-hero__scroll-text">SCROLL</span>
      <span class="section-hero__scroll-line" />
    </div>
  </section>
</template>

<style scoped>
.section-hero {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  overflow: hidden;
}

/* Noise grain — subtle texture for non-flat feel */
.section-hero__grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 256px 256px;
  opacity: 0.5;
  pointer-events: none;
  mix-blend-mode: overlay;
  z-index: 1;
}

/* Name container — centered, fills viewport width */
.section-hero__name-container {
  position: relative;
  z-index: var(--z-content);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-inline: var(--page-margin);
  will-change: transform, opacity, letter-spacing;
}

.section-hero__line {
  display: flex;
  line-height: var(--leading-crush);
}

/* Per-character styling */
.section-hero__char {
  font-family: var(--font-display);
  font-variation-settings: 'wght' 200;
  font-size: var(--text-hero);
  line-height: var(--leading-crush);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-primary);
  text-transform: uppercase;
  display: inline-block;
  will-change: font-variation-settings;
  cursor: default;
  user-select: none;
}

/* Sub-role meta: bottom-right, quiet */
.section-hero__meta {
  position: absolute;
  bottom: var(--page-margin);
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.35rem;
  z-index: var(--z-content);
}

.section-hero__role {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: var(--text-caption);
  letter-spacing: var(--tracking-ultra);
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.section-hero__location {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-text-tertiary);
}

/* Scroll indicator: bottom-center */
.section-hero__scroll {
  position: absolute;
  bottom: var(--page-margin);
  left: var(--page-margin);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: var(--z-content);
}

.section-hero__scroll-text {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--tracking-mega);
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  writing-mode: vertical-lr;
}

.section-hero__scroll-line {
  width: 1px;
  height: 40px;
  background: var(--color-text-tertiary);
  animation: scroll-pulse 2s ease-in-out infinite;
}

@keyframes scroll-pulse {
  0%, 100% { opacity: 0.3; transform: scaleY(0.5); transform-origin: top; }
  50% { opacity: 1; transform: scaleY(1); transform-origin: top; }
}

/* Responsive */
@media (max-width: 768px) {
  .section-hero__char {
    font-size: clamp(3rem, 15vw, 6rem);
  }

  .section-hero__meta {
    bottom: clamp(1rem, 3vh, 2rem);
  }

  .section-hero__scroll {
    display: none;
  }
}

@media (max-width: 480px) {
  .section-hero__char {
    font-size: clamp(2.5rem, 13vw, 4rem);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .section-hero__scroll-line {
    animation: none;
    opacity: 0.5;
  }
}
</style>
