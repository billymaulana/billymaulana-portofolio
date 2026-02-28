<script setup lang="ts">
/**
 * Marquee: "3-Layer Speed Ticker"
 * 3 rows scrolling at DIFFERENT speeds and directions.
 * Row 1: Outlined, slow right
 * Row 2: Bold filled, fast left (hero row)
 * Row 3: Light, medium right
 * GSAP-driven infinite loop. Weight shifts on scroll proximity.
 */

const SKILLS_ROW_1 = ['Vue.js', 'TypeScript', 'Nuxt', 'GSAP', 'WebGL', 'Design Systems', 'Motion Design']
const SKILLS_ROW_2 = ['Frontend Architecture', 'Performance', 'Accessibility', 'Animation', 'Creative Development']
const SKILLS_ROW_3 = ['Component Libraries', 'Storybook', 'CI/CD', 'Responsive', 'PWA', 'SEO', 'Testing']

const sectionRef = ref<HTMLElement>()
const row1Ref = ref<HTMLElement>()
const row2Ref = ref<HTMLElement>()
const row3Ref = ref<HTMLElement>()

let scrollCtx: gsap.Context | null = null

onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced)
    return

  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  scrollCtx = gsap.context(() => {
    const rows = [
      { el: row1Ref.value, speed: 80, direction: 1 },
      { el: row2Ref.value, speed: 150, direction: -1 },
      { el: row3Ref.value, speed: 100, direction: 1 },
    ]

    rows.forEach(({ el, speed, direction }) => {
      if (!el)
        return

      // Infinite scroll: translate by half (since content is duplicated)
      gsap.to(el, {
        xPercent: -50 * direction,
        ease: 'none',
        duration: speed,
        repeat: -1,
        modifiers: {
          xPercent: gsap.utils.wrap(-50, 0),
        },
      })
    })

    // Parallax speed shift on scroll
    if (sectionRef.value && row2Ref.value) {
      gsap.to(row2Ref.value, {
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        x: -200,
        ease: 'none',
      })
    }
  })
})

onUnmounted(() => {
  scrollCtx?.revert()
})
</script>

<template>
  <section
    ref="sectionRef"
    class="section-marquee"
    aria-label="Skills marquee"
  >
    <!-- Row 1: Outlined, slow -->
    <div class="section-marquee__row section-marquee__row--outlined">
      <div ref="row1Ref" class="section-marquee__track">
        <span
          v-for="(skill, i) in SKILLS_ROW_1"
          :key="`r1-${i}`"
          class="section-marquee__item section-marquee__item--outlined"
        >{{ skill }}</span>
        <span
          v-for="(skill, i) in SKILLS_ROW_1"
          :key="`r1d-${i}`"
          class="section-marquee__item section-marquee__item--outlined"
          aria-hidden="true"
        >{{ skill }}</span>
      </div>
    </div>

    <!-- Row 2: Bold filled, fast (hero row) -->
    <div class="section-marquee__row section-marquee__row--bold">
      <div ref="row2Ref" class="section-marquee__track">
        <span
          v-for="(skill, i) in SKILLS_ROW_2"
          :key="`r2-${i}`"
          class="section-marquee__item section-marquee__item--bold"
        >{{ skill }}</span>
        <span
          v-for="(skill, i) in SKILLS_ROW_2"
          :key="`r2d-${i}`"
          class="section-marquee__item section-marquee__item--bold"
          aria-hidden="true"
        >{{ skill }}</span>
      </div>
    </div>

    <!-- Row 3: Light, medium speed -->
    <div class="section-marquee__row section-marquee__row--light">
      <div ref="row3Ref" class="section-marquee__track">
        <span
          v-for="(skill, i) in SKILLS_ROW_3"
          :key="`r3-${i}`"
          class="section-marquee__item section-marquee__item--light"
        >{{ skill }}</span>
        <span
          v-for="(skill, i) in SKILLS_ROW_3"
          :key="`r3d-${i}`"
          class="section-marquee__item section-marquee__item--light"
          aria-hidden="true"
        >{{ skill }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.section-marquee {
  position: relative;
  width: 100%;
  overflow: hidden;
  padding: clamp(3rem, 6vh, 6rem) 0;
  background: var(--color-bg);
  border-top: 1px solid var(--color-text-ghost);
  border-bottom: 1px solid var(--color-text-ghost);
}

.section-marquee__row {
  width: 100%;
  overflow: hidden;
}

.section-marquee__row + .section-marquee__row {
  margin-top: clamp(0.5rem, 1vh, 1rem);
}

.section-marquee__track {
  display: flex;
  gap: clamp(2rem, 4vw, 4rem);
  white-space: nowrap;
  width: max-content;
  will-change: transform;
}

/* Item base */
.section-marquee__item {
  font-family: var(--font-display);
  line-height: 1;
  letter-spacing: var(--tracking-tight);
  text-transform: uppercase;
  flex-shrink: 0;
}

/* Item separator (CSS-only bullet between items) */
.section-marquee__item::after {
  content: '\00B7';
  margin-left: clamp(2rem, 4vw, 4rem);
  color: var(--color-text-ghost);
}

/* Row 1: Outlined */
.section-marquee__item--outlined {
  font-variation-settings: 'wght' 700;
  font-size: clamp(2rem, 4vw, 4rem);
  color: transparent;
  -webkit-text-stroke: 1px var(--color-text-tertiary);
}

.section-marquee__item--outlined::after {
  -webkit-text-stroke: 0;
}

/* Row 2: Bold filled — hero row */
.section-marquee__item--bold {
  font-variation-settings: 'wght' 700;
  font-size: clamp(3rem, 6vw, 7rem);
  color: var(--color-text-primary);
}

/* Row 3: Light */
.section-marquee__item--light {
  font-variation-settings: 'wght' 200;
  font-size: clamp(1.5rem, 3vw, 3rem);
  color: var(--color-text-tertiary);
}

/* Responsive */
@media (max-width: 768px) {
  .section-marquee__item--bold {
    font-size: clamp(2rem, 8vw, 4rem);
  }
}

/* Reduced motion: still visible, no scroll */
@media (prefers-reduced-motion: reduce) {
  .section-marquee__track {
    animation: none;
  }
}
</style>
