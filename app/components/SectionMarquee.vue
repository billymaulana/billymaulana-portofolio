<script setup lang="ts">
/**
 * SectionMarquee — "The Kinetic Bridge"
 * 3-row infinite ticker with alternating directions and velocity response.
 *
 * Row 1: moves RIGHT, weight 700, large text
 * Row 2: moves LEFT, weight 300, stroke-only text
 * Row 3: moves RIGHT, weight 700, large text
 *
 * Entrance: Elastic overshoot from offset per row direction
 * Visual object: SVG diamond separators + velocity-responsive speed
 * Motion: CSS infinite scroll + GSAP ScrollTrigger velocity boost
 */

const SKILLS = [
  'VUE.JS',
  'NUXT',
  'TYPESCRIPT',
  'GSAP',
  'THREE.JS',
  'WEBGL',
  'DESIGN SYSTEMS',
  'ANIMATION',
  'PERFORMANCE',
  'CREATIVE DEV',
]

const sectionRef = ref<HTMLElement>()
const row1Ref = ref<HTMLElement>()
const row2Ref = ref<HTMLElement>()
const row3Ref = ref<HTMLElement>()

let ctx: gsap.Context | null = null

onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced)
    return

  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    if (!sectionRef.value)
      return

    // Entrance: elastic overshoot — rows slide from offset
    const rows = [
      { el: row1Ref.value, from: -120 }, // from left
      { el: row2Ref.value, from: 120 }, // from right
      { el: row3Ref.value, from: -120 }, // from left
    ]

    rows.forEach((row) => {
      if (!row.el)
        return

      gsap.from(row.el, {
        x: row.from,
        opacity: 0,
        duration: 1.4,
        ease: 'elastic.out(1, 0.75)',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 85%',
        },
      })
    })

    // Velocity response: detect scroll speed and adjust animation duration
    const tracks = sectionRef.value.querySelectorAll('.marquee__track')
    let lastScrollTop = 0
    let velocityTimeout: ReturnType<typeof setTimeout> | null = null

    ScrollTrigger.create({
      trigger: sectionRef.value,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate(self) {
        const velocity = Math.abs(self.getVelocity())
        const speedFactor = Math.max(0.3, 1 - velocity / 5000)

        tracks.forEach((track) => {
          const el = track as HTMLElement
          const baseDuration = el.dataset.baseDuration || '25'
          const newDuration = Number.parseFloat(baseDuration) * speedFactor
          el.style.animationDuration = `${newDuration}s`
        })

        // Reset speed after scroll stops
        if (velocityTimeout)
          clearTimeout(velocityTimeout)

        velocityTimeout = setTimeout(() => {
          tracks.forEach((track) => {
            const el = track as HTMLElement
            const baseDuration = el.dataset.baseDuration || '25'
            el.style.animationDuration = `${baseDuration}s`
          })
        }, 200)
      },
    })

    void lastScrollTop // suppress unused warning
    lastScrollTop = 0
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    ref="sectionRef"
    class="marquee"
    aria-label="Skills marquee"
  >
    <!-- Row 1: Bold filled, RIGHT, 25s -->
    <div ref="row1Ref" class="marquee__row">
      <div class="marquee__track marquee__track--right" data-base-duration="25">
        <template v-for="(skill, i) in SKILLS" :key="`r1a-${i}`">
          <span class="marquee__item marquee__item--bold">{{ skill }}</span>
          <svg class="marquee__diamond" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" fill="none" stroke="currentColor" stroke-width="1" />
          </svg>
        </template>
        <!-- Duplicate for seamless loop -->
        <template v-for="(skill, i) in SKILLS" :key="`r1b-${i}`">
          <span class="marquee__item marquee__item--bold" aria-hidden="true">{{ skill }}</span>
          <svg class="marquee__diamond" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" fill="none" stroke="currentColor" stroke-width="1" />
          </svg>
        </template>
      </div>
    </div>

    <!-- Row 2: Stroke-only, LEFT, 30s -->
    <div ref="row2Ref" class="marquee__row">
      <div class="marquee__track marquee__track--left" data-base-duration="30">
        <template v-for="(skill, i) in SKILLS" :key="`r2a-${i}`">
          <span class="marquee__item marquee__item--stroke">{{ skill }}</span>
          <svg class="marquee__diamond marquee__diamond--muted" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" fill="none" stroke="currentColor" stroke-width="1" />
          </svg>
        </template>
        <!-- Duplicate for seamless loop -->
        <template v-for="(skill, i) in SKILLS" :key="`r2b-${i}`">
          <span class="marquee__item marquee__item--stroke" aria-hidden="true">{{ skill }}</span>
          <svg class="marquee__diamond marquee__diamond--muted" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" fill="none" stroke="currentColor" stroke-width="1" />
          </svg>
        </template>
      </div>
    </div>

    <!-- Row 3: Bold filled, RIGHT, 20s -->
    <div ref="row3Ref" class="marquee__row">
      <div class="marquee__track marquee__track--right marquee__track--fast" data-base-duration="20">
        <template v-for="(skill, i) in SKILLS" :key="`r3a-${i}`">
          <span class="marquee__item marquee__item--bold">{{ skill }}</span>
          <svg class="marquee__diamond" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" fill="none" stroke="currentColor" stroke-width="1" />
          </svg>
        </template>
        <!-- Duplicate for seamless loop -->
        <template v-for="(skill, i) in SKILLS" :key="`r3b-${i}`">
          <span class="marquee__item marquee__item--bold" aria-hidden="true">{{ skill }}</span>
          <svg class="marquee__diamond" width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
            <rect x="2" y="2" width="8" height="8" transform="rotate(45 6 6)" fill="none" stroke="currentColor" stroke-width="1" />
          </svg>
        </template>
      </div>
    </div>

    <!-- Edge fade masks -->
    <div class="marquee__edge marquee__edge--left" aria-hidden="true" />
    <div class="marquee__edge marquee__edge--right" aria-hidden="true" />

    <!-- Atmospheric gradient streak -->
    <div class="marquee__atmosphere" aria-hidden="true" />

    <!-- Ghost section number -->
    <span class="marquee__ghost" aria-hidden="true">05</span>
  </section>
</template>

<style scoped>
/* ═══ Keyframes ═══ */

@keyframes marquee-scroll-right {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes marquee-scroll-left {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}

/* ═══ Section ═══ */

.marquee {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: clamp(3rem, 6vh, 6rem) 0;
  background: var(--bg-abyss);
  border-top: 1px solid var(--bg-subtle);
  border-bottom: 1px solid var(--bg-subtle);
}

/* ═══ Row ═══ */

.marquee__row {
  width: 100%;
  overflow: hidden;
}

.marquee__row + .marquee__row {
  margin-top: 1rem;
}

/* ═══ Track ═══ */

.marquee__track {
  display: flex;
  align-items: center;
  gap: clamp(1.5rem, 3vw, 3rem);
  white-space: nowrap;
  width: max-content;
  will-change: transform;
}

.marquee__track--right {
  animation: marquee-scroll-right 25s linear infinite;
}

.marquee__track--left {
  animation: marquee-scroll-left 30s linear infinite;
}

.marquee__track--fast {
  animation-duration: 20s;
}

/* ═══ Item base ═══ */

.marquee__item {
  font-family: var(--font-display);
  line-height: 1;
  letter-spacing: var(--tracking-tight);
  text-transform: uppercase;
  flex-shrink: 0;
}

/* ═══ Bold filled (rows 1 & 3) ═══ */

.marquee__item--bold {
  font-weight: 700;
  font-size: clamp(2.5rem, 5vw, 5rem);
  color: var(--text-primary);
}

/* ═══ Stroke-only (row 2) ═══ */

.marquee__item--stroke {
  font-weight: 300;
  font-size: clamp(1.5rem, 3vw, 3rem);
  color: transparent;
  -webkit-text-stroke: 1px var(--text-primary);
  -webkit-text-fill-color: transparent;
}

/* ═══ SVG Diamond separator ═══ */

.marquee__diamond {
  flex-shrink: 0;
  color: var(--accent-primary);
  opacity: 0.8;
}

.marquee__diamond--muted {
  color: var(--text-tertiary);
  opacity: 0.4;
}

/* ═══ Edge fade masks ═══ */

.marquee__edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 10%;
  z-index: 2;
  pointer-events: none;
}

.marquee__edge--left {
  left: 0;
  background: linear-gradient(90deg, var(--bg-abyss) 0%, transparent 100%);
}

.marquee__edge--right {
  right: 0;
  background: linear-gradient(270deg, var(--bg-abyss) 0%, transparent 100%);
}

/* ═══ Atmospheric gradient ═══ */

.marquee__atmosphere {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 71, 255, 0.04) 30%,
    rgba(0, 163, 255, 0.03) 50%,
    transparent 100%
  );
}

/* ═══ Ghost section number ═══ */

.marquee__ghost {
  position: absolute;
  bottom: clamp(1rem, 3vh, 2rem);
  right: var(--page-margin);
  font-family: var(--font-mono);
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 400;
  line-height: 1;
  color: var(--text-disabled);
  opacity: 0.03;
  pointer-events: none;
  user-select: none;
  mix-blend-mode: difference;
  z-index: 0;
}

/* ═══ Responsive ═══ */

@media (max-width: 768px) {
  .marquee__item--bold {
    font-size: clamp(2rem, 8vw, 3.5rem);
  }

  .marquee__item--stroke {
    font-size: clamp(1.25rem, 5vw, 2rem);
  }
}

/* ═══ Reduced Motion ═══ */

@media (prefers-reduced-motion: reduce) {
  .marquee__track {
    animation: none;
  }
}
</style>
