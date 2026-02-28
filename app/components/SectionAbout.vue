<script setup lang="ts">
/**
 * About: "Text Portrait"
 * Split layout — kinetic counting numbers (left) + bio text (right).
 * Numbers count up on scroll AND their weight oscillates.
 * NO photo — the numbers ARE the visual.
 */

interface Stat {
  value: string
  numericTarget: number
  label: string
}

const STATS: Stat[] = [
  { value: '7', numericTarget: 7, label: 'Years' },
  { value: '23', numericTarget: 23, label: 'Projects' },
  { value: '80M', numericTarget: 80, label: 'Users Reached' },
  { value: '4', numericTarget: 4, label: 'Companies' },
]

const sectionRef = ref<HTMLElement>()
const statNumberRefs = ref<HTMLElement[]>([])
const bioRef = ref<HTMLElement>()

function collectStatRef(el: unknown) {
  if (el instanceof HTMLElement) {
    statNumberRefs.value.push(el)
  }
}

let scrollCtx: gsap.Context | null = null

onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReduced)
    return

  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  scrollCtx = gsap.context(() => {
    if (!sectionRef.value)
      return

    // Count-up numbers on scroll
    statNumberRefs.value.forEach((el, i) => {
      const stat = STATS[i]
      if (!stat)
        return

      // Set initial
      gsap.set(el, {
        textContent: '0',
        fontVariationSettings: `'wght' 200`,
      })

      // Count up
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
        textContent: stat.numericTarget,
        snap: { textContent: 1 },
        fontVariationSettings: `'wght' 700`,
        modifiers: {
          textContent: (value: string) => {
            const num = Math.round(Number.parseFloat(value))
            // Append suffix if needed (M for millions)
            if (stat.value.includes('M'))
              return `${num}M+`
            if (stat.value.includes('+'))
              return `${num}+`
            return num.toString()
          },
        },
      })
    })

    // Weight oscillation (independent loop, NOT scroll-driven)
    statNumberRefs.value.forEach((el) => {
      gsap.to(el, {
        fontVariationSettings: `'wght' 300`,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 1.5, // Stagger oscillation start
      })
    })

    // Bio text fade-in
    if (bioRef.value) {
      gsap.from(bioRef.value, {
        scrollTrigger: {
          trigger: bioRef.value,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 0.8,
        },
        opacity: 0,
        y: 30,
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
    id="about"
    ref="sectionRef"
    class="section-about"
    aria-label="About Billy Maulana"
  >
    <div class="section-about__inner page-margin">
      <!-- Section label -->
      <div class="section-about__label">
        <span class="section-about__label-num">03</span>
        <span class="section-about__label-text">ABOUT</span>
      </div>

      <div class="section-about__grid">
        <!-- Left: Kinetic stats -->
        <div class="section-about__stats">
          <div
            v-for="(stat, i) in STATS"
            :key="i"
            class="section-about__stat"
          >
            <span
              :ref="collectStatRef"
              class="section-about__stat-number"
            >0</span>
            <span class="section-about__stat-label">{{ stat.label }}</span>
          </div>
        </div>

        <!-- Right: Bio text -->
        <div ref="bioRef" class="section-about__bio">
          <p class="section-about__bio-text">
            I'm Billy Maulana, a frontend architect based in Bandung with 7+ years
            crafting interfaces that serve millions.
          </p>
          <p class="section-about__bio-text">
            I push the boundary between design and engineering — building
            design systems, complex animations, and high-performance
            applications with Vue.js and TypeScript.
          </p>
          <p class="section-about__bio-text">
            Typography is my first love. Every letterform is a design decision.
            Every pixel carries intent.
          </p>
        </div>
      </div>
    </div>

    <!-- Ghost section number -->
    <span class="section-about__ghost" aria-hidden="true">03</span>
  </section>
</template>

<style scoped>
.section-about {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: var(--section-gap) 0;
  background: var(--color-bg);
  overflow: hidden;
}

.section-about__inner {
  width: 100%;
}

/* Section label */
.section-about__label {
  display: flex;
  align-items: baseline;
  gap: 1em;
  margin-bottom: clamp(3rem, 6vh, 5rem);
}

.section-about__label-num {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
  letter-spacing: 0.15em;
}

.section-about__label-text {
  font-family: var(--font-body);
  font-size: var(--text-caption);
  font-weight: 500;
  letter-spacing: var(--tracking-mega);
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

/* Grid: stats left, bio right */
.section-about__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(3rem, 6vw, 8rem);
  align-items: start;
}

/* Stats column */
.section-about__stats {
  display: flex;
  flex-direction: column;
  gap: clamp(2rem, 4vh, 3.5rem);
}

.section-about__stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-about__stat-number {
  font-family: var(--font-display);
  font-variation-settings: 'wght' 700;
  font-size: var(--text-display);
  line-height: var(--leading-crush);
  color: var(--color-text-primary);
  will-change: font-variation-settings;
}

.section-about__stat-label {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: var(--text-caption);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

/* Bio column */
.section-about__bio {
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2vh, 1.5rem);
  padding-top: clamp(0.5rem, 1vh, 1rem);
}

.section-about__bio-text {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: var(--text-body);
  line-height: var(--leading-body);
  color: var(--color-text-primary);
  max-width: 45ch;
}

.section-about__bio-text:last-child {
  color: var(--color-text-secondary);
  font-style: italic;
}

/* Ghost */
.section-about__ghost {
  position: absolute;
  bottom: clamp(2rem, 5vh, 4rem);
  right: var(--page-margin);
  font-family: var(--font-mono);
  font-size: clamp(5rem, 12vw, 12rem);
  font-weight: 400;
  line-height: 1;
  color: var(--color-text-ghost);
  opacity: 0.03;
  pointer-events: none;
  user-select: none;
}

/* Responsive */
@media (max-width: 768px) {
  .section-about__grid {
    grid-template-columns: 1fr;
    gap: clamp(2rem, 4vh, 3rem);
  }

  .section-about__stats {
    flex-direction: row;
    flex-wrap: wrap;
    gap: clamp(1.5rem, 3vw, 2.5rem);
  }

  .section-about__stat {
    flex: 1;
    min-width: 120px;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .section-about__stat-number {
    font-variation-settings: 'wght' 700;
  }
}
</style>
