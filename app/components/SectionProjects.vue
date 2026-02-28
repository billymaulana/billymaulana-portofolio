<script setup lang="ts">
import { featuredProjects } from '~/constants/projects'

/**
 * Projects: "Type as Showcase"
 * Each project = full viewport, title at 15vw.
 * Horizontal scroll-snap via GSAP pin.
 * 5 distinct title treatments (no two alike).
 * Background color shifts subtly per project.
 */

const PROJECT_COLORS = [
  '#000000', // Pure black
  '#020208', // Hint of blue-black
  '#050200', // Hint of warm-black
  '#000205', // Hint of deep navy
  '#030003', // Hint of purple-black
]

const containerRef = ref<HTMLElement>()
const trackRef = ref<HTMLElement>()
const projectCount = featuredProjects.length

let scrollCtx: gsap.Context | null = null

onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced)
    return

  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  scrollCtx = gsap.context(() => {
    if (!containerRef.value || !trackRef.value)
      return

    // Horizontal scroll-snap
    gsap.to(trackRef.value, {
      xPercent: -100 * (projectCount - 1),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.value,
        pin: true,
        scrub: 1,
        snap: 1 / (projectCount - 1),
        end: () => `+=${window.innerWidth * projectCount}`,
      },
    })
  })
})

onUnmounted(() => {
  scrollCtx?.revert()
})

function getTreatmentClass(index: number): string {
  const treatments = [
    'condensed', // Project 1: Bold condensed uppercase
    'outlined', // Project 2: Outlined with fill on hover
    'italic', // Project 3: Mixed case, italic, wide tracking
    'ultralight', // Project 4: Extra light, massive
    'gradient', // Project 5: Gradient fill
  ]
  return treatments[index] ?? 'condensed'
}
</script>

<template>
  <section
    id="work"
    ref="containerRef"
    class="section-projects"
    aria-label="Selected Projects"
  >
    <!-- Section label -->
    <div class="section-projects__label page-margin">
      <span class="section-projects__label-num">04</span>
      <span class="section-projects__label-text">WORK</span>
    </div>

    <!-- Horizontal scroll track -->
    <div ref="trackRef" class="section-projects__track">
      <article
        v-for="(project, index) in featuredProjects"
        :key="project.id"
        class="section-projects__slide"
        :style="{ backgroundColor: PROJECT_COLORS[index] || '#000' }"
      >
        <!-- Project number -->
        <span class="section-projects__number page-margin">
          {{ String(index + 1).padStart(2, '0') }}
        </span>

        <!-- Project title — distinct treatment per project -->
        <div class="section-projects__title-wrap page-margin">
          <h3
            class="section-projects__title"
            :class="`section-projects__title--${getTreatmentClass(index)}`"
          >
            {{ project.name }}
          </h3>
        </div>

        <!-- Project meta — bottom -->
        <div class="section-projects__meta page-margin">
          <div class="section-projects__meta-left">
            <span class="section-projects__category">{{ project.category }}</span>
            <span class="section-projects__year">{{ project.year }}</span>
          </div>
          <div class="section-projects__tech">
            <span
              v-for="tech in project.technologies"
              :key="tech"
              class="section-projects__tag"
            >{{ tech }}</span>
          </div>
        </div>

        <!-- Full-panel link -->
        <a
          v-if="project.url || project.playStore"
          :href="project.url || project.playStore"
          target="_blank"
          rel="noopener noreferrer"
          class="section-projects__link"
          :aria-label="`View ${project.name}`"
          data-cursor-label="View"
        />
      </article>
    </div>
  </section>
</template>

<style scoped>
.section-projects {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  background: var(--color-bg);
  overflow: hidden;
}

/* Section label — fixed top-left during scroll */
.section-projects__label {
  position: absolute;
  top: clamp(1.5rem, 3vh, 2.5rem);
  left: 0;
  display: flex;
  align-items: baseline;
  gap: 1em;
  z-index: 2;
}

.section-projects__label-num {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
  letter-spacing: 0.15em;
}

.section-projects__label-text {
  font-family: var(--font-body);
  font-size: var(--text-caption);
  font-weight: 500;
  letter-spacing: var(--tracking-mega);
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

/* Horizontal track */
.section-projects__track {
  display: flex;
  width: fit-content;
  height: 100%;
}

/* Each project slide */
.section-projects__slide {
  position: relative;
  width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}

/* Project number */
.section-projects__number {
  position: absolute;
  top: clamp(4rem, 8vh, 6rem);
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
  letter-spacing: 0.15em;
}

/* Title wrapper */
.section-projects__title-wrap {
  flex: 1;
  display: flex;
  align-items: center;
}

/* Base title */
.section-projects__title {
  font-family: var(--font-display);
  font-size: var(--text-project);
  line-height: var(--leading-crush);
  color: var(--color-text-primary);
  text-transform: uppercase;
  user-select: none;
}

/* Treatment 1: Condensed bold */
.section-projects__title--condensed {
  font-variation-settings: 'wght' 700;
  letter-spacing: var(--tracking-tight);
}

/* Treatment 2: Outlined — stroke only, fill on hover */
.section-projects__title--outlined {
  font-variation-settings: 'wght' 700;
  -webkit-text-stroke: 2px var(--color-text-primary);
  color: transparent;
  letter-spacing: var(--tracking-tight);
  transition: color 0.5s var(--ease-expo);
}

.section-projects__slide:hover .section-projects__title--outlined {
  color: var(--color-text-primary);
}

/* Treatment 3: Italic wide tracking */
.section-projects__title--italic {
  font-variation-settings: 'wght' 500;
  font-style: italic;
  letter-spacing: var(--tracking-ultra);
  text-transform: none;
}

/* Treatment 4: Ultra-light, massive scale */
.section-projects__title--ultralight {
  font-variation-settings: 'wght' 200;
  font-size: calc(var(--text-project) * 1.3);
  letter-spacing: var(--tracking-wide);
}

/* Treatment 5: Gradient fill */
.section-projects__title--gradient {
  font-variation-settings: 'wght' 700;
  background: linear-gradient(90deg, #fff 0%, #666 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Project meta — bottom */
.section-projects__meta {
  position: absolute;
  bottom: clamp(1.5rem, 3vh, 2.5rem);
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.section-projects__meta-left {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.section-projects__category {
  font-family: var(--font-body);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
  letter-spacing: 0.02em;
}

.section-projects__year {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-tertiary);
  letter-spacing: 0.05em;
}

.section-projects__tech {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.section-projects__tag {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: var(--color-text-tertiary);
  padding: 0.15rem 0.5rem;
  border: 1px solid var(--color-text-ghost);
  letter-spacing: 0.02em;
}

/* Full-panel link overlay */
.section-projects__link {
  position: absolute;
  inset: 0;
  z-index: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .section-projects__title {
    font-size: clamp(2rem, 10vw, 4rem);
  }

  .section-projects__title--ultralight {
    font-size: clamp(2.5rem, 12vw, 5rem);
  }

  .section-projects__meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .section-projects__tech {
    justify-content: flex-start;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .section-projects__title--outlined {
    transition: none;
  }
}
</style>
