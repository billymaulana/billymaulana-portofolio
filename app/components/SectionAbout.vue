<script setup lang="ts">
/**
 * SectionAbout — "The Architect's Blueprint"
 *
 * Counter-positioned asymmetric grid layout.
 * Left ~60%: Bio + Experience Timeline with vertical connector line
 * Right ~40%: Photo placeholder with blueprint grid + corner brackets
 * Stats: horizontal strip below with counter animation
 *
 * VISUAL OBJECTS:
 * 1. Photo placeholder with SVG blueprint grid, corner brackets, pulse
 * 2. SVG ruled-line accent system behind bio (drawSVG entrance)
 * 3. Experience timeline with glowing dot markers
 *
 * ENTRANCE: Diagonal clip-path polygon reveal (unique from neighbors)
 * Adjacent above: SectionManifesto — scroll-scrubbed pin word reveal
 * Adjacent below: SectionProjects — clipPath inset per card
 */
import { useNoisePortrait } from '~/composables/useNoisePortrait'
import { experiences, profile } from '~/constants/profile'

const STATS = [
  { value: '7+', label: 'Years Experience' },
  { value: '23+', label: 'Projects Delivered' },
  { value: '80M+', label: 'Users Impacted' },
  { value: '4', label: 'Companies' },
]

// Parse stat values into odometer-friendly character arrays
interface OdoChar {
  char: string
  isDigit: boolean
  digit: number // 0-9 if isDigit, 0 otherwise
}

function parseStatValue(value: string): OdoChar[] {
  return value.split('').map(char => ({
    char,
    isDigit: /\d/.test(char),
    digit: /\d/.test(char) ? Number.parseInt(char, 10) : 0,
  }))
}

const parsedStats = computed(() =>
  STATS.map(stat => ({
    ...stat,
    chars: parseStatValue(stat.value),
  })),
)

const TECH = ['Vue.js', 'Nuxt', 'TypeScript', 'GSAP', 'WebGL', 'Three.js', 'Figma']

const bioParagraphs = computed(() =>
  profile.bio.split('\n\n').filter(Boolean),
)

function formatYear(start: number, end: number | null): string {
  return end === null ? `${start} — Present` : `${start} — ${end}`
}

// Template refs
const sectionRef = ref<HTMLElement>()
const contentRef = ref<HTMLElement>()
const photoRef = ref<HTMLElement>()
const bioRef = ref<HTMLElement>()
const timelineRef = ref<HTMLElement>()
const statsRef = ref<HTMLElement>()
const techRef = ref<HTMLElement>()
const svgGridRef = ref<SVGElement>()
const blueprintRef = ref<SVGElement>()
const noiseCanvasRef = ref<HTMLCanvasElement>()

// Generative noise portrait — particle flow field forming head silhouette
useNoisePortrait(noiseCanvasRef, photoRef, {
  particleCount: 1600,
  frequency: 0.004,
  speed: 0.7,
  trailAlpha: 0.035,
})

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

    // 1. Main content — diagonal clip-path reveal
    if (contentRef.value) {
      gsap.fromTo(
        contentRef.value,
        { clipPath: 'polygon(0 0, 0% 0, 0% 0%, 0 0%)' },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          duration: 1.6,
          ease: 'expo.inOut',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top 75%',
          },
        },
      )
    }

    // 2. Photo placeholder — cinematic focus pull
    if (photoRef.value) {
      gsap.fromTo(
        photoRef.value,
        {
          scale: 1.08,
          filter: 'blur(6px)',
          opacity: 0,
        },
        {
          scale: 1,
          filter: 'blur(0px)',
          opacity: 1,
          duration: 1.4,
          delay: 0.3,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: photoRef.value,
            start: 'top 80%',
          },
        },
      )
    }

    // 3. Blueprint SVG grid — breathing pulse on scroll
    if (blueprintRef.value) {
      gsap.to(blueprintRef.value, {
        scale: 1.02,
        opacity: 0.12,
        duration: 2.5,
        ease: 'power2.inOut',
        yoyo: true,
        repeat: -1,
        scrollTrigger: {
          trigger: photoRef.value,
          start: 'top 80%',
          toggleActions: 'play pause resume pause',
        },
      })
    }

    // 4. SVG accent grid lines — drawSVG-style strokeDashoffset
    if (svgGridRef.value) {
      const lines = svgGridRef.value.querySelectorAll('.about__grid-line')
      lines.forEach((line) => {
        const el = line as SVGLineElement
        const length = el.getTotalLength()
        gsap.set(el, {
          strokeDasharray: length,
          strokeDashoffset: length,
        })
        gsap.to(el, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top 70%',
          },
        })
      })

      // Accent line — the one with stronger color
      const accentLine = svgGridRef.value.querySelector('.about__grid-accent')
      if (accentLine) {
        const accentEl = accentLine as SVGLineElement
        const accentLength = accentEl.getTotalLength()
        gsap.set(accentEl, {
          strokeDasharray: accentLength,
          strokeDashoffset: accentLength,
        })
        gsap.to(accentEl, {
          strokeDashoffset: 0,
          duration: 2.2,
          delay: 0.4,
          ease: 'expo.inOut',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top 70%',
          },
        })
      }
    }

    // 5. Bio paragraphs — blur-to-sharp stagger
    if (bioRef.value) {
      const paragraphs = bioRef.value.querySelectorAll('.about__bio-paragraph')
      gsap.from(paragraphs, {
        y: 25,
        opacity: 0,
        filter: 'blur(4px)',
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: bioRef.value,
          start: 'top 82%',
        },
      })
    }

    // 6. Experience entries — stagger from left
    if (timelineRef.value) {
      // Timeline line grow
      const timelineLine = timelineRef.value.querySelector('.about__timeline-line')
      if (timelineLine) {
        gsap.from(timelineLine, {
          scaleY: 0,
          transformOrigin: 'top center',
          duration: 1.2,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: timelineRef.value,
            start: 'top 80%',
          },
        })
      }

      // Timeline dots glow
      const dots = timelineRef.value.querySelectorAll('.about__timeline-dot')
      gsap.from(dots, {
        scale: 0,
        opacity: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)',
        stagger: 0.12,
        delay: 0.4,
        scrollTrigger: {
          trigger: timelineRef.value,
          start: 'top 80%',
        },
      })

      // Experience entries
      const entries = timelineRef.value.querySelectorAll('.about__timeline-entry')
      gsap.from(entries, {
        x: -20,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        delay: 0.3,
        scrollTrigger: {
          trigger: timelineRef.value,
          start: 'top 80%',
        },
      })
    }

    // 7. Stats odometer animation — translateY per digit column
    if (statsRef.value) {
      const columns = statsRef.value.querySelectorAll('.odo__column')
      columns.forEach((col, i) => {
        const el = col as HTMLElement
        const target = Number.parseInt(el.dataset.target || '0', 10)
        // Each digit is 1em tall; move up by target * 1em
        gsap.fromTo(el, {
          yPercent: 0,
        }, {
          yPercent: -target * 10, // -10% per digit (10 digits = 100%)
          duration: 1.8 + (i * 0.15),
          ease: 'expo.out',
          scrollTrigger: {
            trigger: statsRef.value,
            start: 'top 85%',
          },
        })
      })

      // Static chars (M, +) — fade in with stagger
      const statics = statsRef.value.querySelectorAll('.odo__static')
      gsap.from(statics, {
        opacity: 0,
        yPercent: 30,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.05,
        delay: 0.6,
        scrollTrigger: {
          trigger: statsRef.value,
          start: 'top 85%',
        },
      })

      // Stats labels stagger
      const labels = statsRef.value.querySelectorAll('.about__stat-label')
      gsap.from(labels, {
        y: 10,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out',
        stagger: 0.06,
        delay: 0.8,
        scrollTrigger: {
          trigger: statsRef.value,
          start: 'top 85%',
        },
      })
    }

    // 8. Tech stack — stagger fade from bottom
    if (techRef.value) {
      const items = techRef.value.querySelectorAll('.about__tech-tag')
      gsap.from(items, {
        y: 12,
        opacity: 0,
        scale: 0.92,
        duration: 0.45,
        ease: 'power3.out',
        stagger: 0.04,
        scrollTrigger: {
          trigger: techRef.value,
          start: 'top 90%',
        },
      })
    }
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    id="about"
    ref="sectionRef"
    class="about"
    aria-label="About"
  >
    <!-- SVG Ruled-Line Accent System (VISUAL OBJECT 2) — Swiss grid overlay -->
    <svg
      ref="svgGridRef"
      class="about__svg-grid"
      aria-hidden="true"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="none"
    >
      <!-- Horizontal ruled lines — "ruled paper" effect -->
      <line class="about__grid-line" x1="0" y1="140" x2="580" y2="140" />
      <line class="about__grid-line" x1="0" y1="220" x2="550" y2="220" />
      <line class="about__grid-line" x1="0" y1="300" x2="520" y2="300" />
      <line class="about__grid-line" x1="0" y1="380" x2="540" y2="380" />
      <line class="about__grid-line" x1="0" y1="460" x2="500" y2="460" />
      <line class="about__grid-line" x1="0" y1="540" x2="530" y2="540" />
      <line class="about__grid-line" x1="0" y1="620" x2="480" y2="620" />
      <line class="about__grid-line" x1="0" y1="700" x2="510" y2="700" />
      <line class="about__grid-line" x1="0" y1="780" x2="460" y2="780" />
      <!-- Vertical column markers for Swiss grid structure -->
      <line class="about__grid-line about__grid-line--vert" x1="60" y1="100" x2="60" y2="850" />
      <line class="about__grid-line about__grid-line--vert" x1="540" y1="100" x2="540" y2="850" />
      <!-- Accent lines — stronger color, marking key grid divisions -->
      <line class="about__grid-accent" x1="0" y1="300" x2="620" y2="300" />
      <line class="about__grid-accent" x1="0" y1="620" x2="560" y2="620" />
      <!-- Cross marks at intersections -->
      <g class="about__grid-cross" transform="translate(60, 300)">
        <line x1="-6" y1="0" x2="6" y2="0" />
        <line x1="0" y1="-6" x2="0" y2="6" />
      </g>
      <g class="about__grid-cross" transform="translate(540, 300)">
        <line x1="-6" y1="0" x2="6" y2="0" />
        <line x1="0" y1="-6" x2="0" y2="6" />
      </g>
      <g class="about__grid-cross" transform="translate(60, 620)">
        <line x1="-6" y1="0" x2="6" y2="0" />
        <line x1="0" y1="-6" x2="0" y2="6" />
      </g>
      <!-- Small circle markers at key nodes -->
      <circle class="about__grid-node" cx="60" cy="140" r="2.5" />
      <circle class="about__grid-node" cx="540" cy="140" r="2.5" />
      <circle class="about__grid-node" cx="60" cy="780" r="2.5" />
    </svg>

    <!-- Atmospheric glow -->
    <div class="about__atmosphere" aria-hidden="true" />

    <!-- Ghost section number -->
    <span class="about__ghost" aria-hidden="true">03</span>

    <!-- Main content wrapper with clip-path entrance -->
    <div ref="contentRef" class="about__content page-margin">
      <!-- Section header -->
      <header class="about__header">
        <span class="about__label">03</span>
        <h2 class="about__title">
          ABOUT
        </h2>
      </header>

      <!-- Asymmetric grid: 60% bio + 40% photo -->
      <div class="about__grid">
        <!-- Left: Bio + Timeline (wider) -->
        <div class="about__left">
          <!-- Bio -->
          <div ref="bioRef" class="about__bio">
            <p
              v-for="(paragraph, i) in bioParagraphs"
              :key="i"
              class="about__bio-paragraph"
            >
              {{ paragraph }}
            </p>
          </div>

          <!-- Experience Timeline (VISUAL OBJECT 3) -->
          <div ref="timelineRef" class="about__timeline">
            <h3 class="about__timeline-heading">
              Experience
            </h3>
            <div class="about__timeline-track">
              <!-- Vertical connector line -->
              <div class="about__timeline-line" aria-hidden="true" />

              <div
                v-for="(exp, i) in experiences"
                :key="i"
                class="about__timeline-entry"
              >
                <!-- Dot marker -->
                <div
                  class="about__timeline-dot"
                  :class="{ 'about__timeline-dot--active': exp.endYear === null }"
                  aria-hidden="true"
                />
                <div class="about__timeline-content">
                  <span class="about__timeline-year">
                    {{ formatYear(exp.startYear, exp.endYear) }}
                  </span>
                  <span class="about__timeline-company">{{ exp.company }}</span>
                  <span class="about__timeline-role">{{ exp.role }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Generative Noise Portrait (VISUAL OBJECT 1) -->
        <div ref="photoRef" class="about__photo-frame">
          <!-- Noise portrait canvas — particle flow field forming head silhouette -->
          <canvas
            ref="noiseCanvasRef"
            class="about__noise-canvas"
            aria-hidden="true"
          />

          <!-- Blueprint grid SVG -->
          <svg
            ref="blueprintRef"
            class="about__blueprint"
            aria-hidden="true"
            viewBox="0 0 300 400"
            preserveAspectRatio="none"
          >
            <!-- Vertical grid lines -->
            <line v-for="n in 11" :key="`v-${n}`" :x1="n * 25" y1="0" :x2="n * 25" y2="400" />
            <!-- Horizontal grid lines -->
            <line v-for="n in 15" :key="`h-${n}`" :x1="0" :y1="n * 25" :x2="300" :y2="n * 25" />
            <!-- Center crosshair -->
            <line x1="140" y1="190" x2="160" y2="190" class="about__blueprint-center" />
            <line x1="150" y1="180" x2="150" y2="210" class="about__blueprint-center" />
            <!-- Diagonal measurement lines -->
            <line x1="0" y1="0" x2="60" y2="60" class="about__blueprint-diag" />
            <line x1="300" y1="0" x2="240" y2="60" class="about__blueprint-diag" />
            <line x1="0" y1="400" x2="60" y2="340" class="about__blueprint-diag" />
            <line x1="300" y1="400" x2="240" y2="340" class="about__blueprint-diag" />
          </svg>

          <!-- Corner brackets (viewfinder marks) -->
          <div class="about__bracket about__bracket--tl" aria-hidden="true" />
          <div class="about__bracket about__bracket--tr" aria-hidden="true" />
          <div class="about__bracket about__bracket--bl" aria-hidden="true" />
          <div class="about__bracket about__bracket--br" aria-hidden="true" />

          <!-- Center label with cursor blink -->
          <span class="about__photo-label" aria-hidden="true">
            <span class="about__photo-label-text">SCANNING</span>
            <span class="about__photo-cursor" />
          </span>

          <!-- Coordinate labels -->
          <span class="about__coord about__coord--tl" aria-hidden="true">X:0 Y:0</span>
          <span class="about__coord about__coord--br" aria-hidden="true">X:300 Y:400</span>
        </div>
      </div>

      <!-- Stats horizontal strip — odometer digits -->
      <div ref="statsRef" class="about__stats">
        <div class="about__stats-line" aria-hidden="true" />
        <div class="about__stats-row">
          <div
            v-for="(stat, si) in parsedStats"
            :key="si"
            class="about__stat"
          >
            <span class="about__stat-value" :data-value="stat.value">
              <span
                v-for="(ch, ci) in stat.chars"
                :key="`${si}-${ci}`"
                class="odo__char"
                :class="{ 'odo__char--digit': ch.isDigit }"
              >
                <!-- Digit: vertical column 0-9, animated via translateY -->
                <span v-if="ch.isDigit" class="odo__column" :data-target="ch.digit">
                  <span v-for="d in 10" :key="d" class="odo__digit" aria-hidden="true">{{ d - 1 }}</span>
                </span>
                <!-- Non-digit: static character (M, +, etc.) -->
                <span v-else class="odo__static">{{ ch.char }}</span>
              </span>
            </span>
            <span class="about__stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <!-- Tech stack strip -->
      <div ref="techRef" class="about__tech">
        <span class="about__tech-label">Stack</span>
        <div class="about__tech-list">
          <span
            v-for="(tech, i) in TECH"
            :key="i"
            class="about__tech-tag"
          >
            {{ tech }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════════
   SECTION: ABOUT — "The Architect's Blueprint"
   ═══════════════════════════════════════════════════════════════ */

.about {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: var(--section-gap) 0;
  background: var(--void);
  overflow: hidden;
}

/* ─── Atmospheric glow ─── */

.about__atmosphere {
  position: absolute;
  inset: 0;
  z-index: var(--z-atmosphere);
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 45% 55% at 25% 40%,
      rgba(0, 71, 255, 0.09) 0%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 30% 40% at 75% 70%,
      rgba(15, 10, 114, 0.06) 0%,
      transparent 60%
    );
}

/* ─── Ghost section number ─── */

.about__ghost {
  position: absolute;
  bottom: clamp(2rem, 5vh, 4rem);
  right: var(--page-margin);
  font-family: var(--font-statement);
  font-size: clamp(8rem, 20vw, 20rem);
  font-weight: 800;
  line-height: 0.85;
  letter-spacing: -0.04em;
  color: var(--text-primary);
  opacity: 0.03;
  pointer-events: none;
  user-select: none;
  mix-blend-mode: difference;
  -webkit-text-stroke: 1.5px rgba(0, 71, 255, 0.08);
  -webkit-text-fill-color: transparent;
}

/* ─── SVG Ruled-Line Accent Grid (VISUAL OBJECT 2) ─── */

.about__svg-grid {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
}

.about__grid-line {
  stroke: rgba(0, 71, 255, 0.15);
  stroke-width: 0.5;
  fill: none;
}

.about__grid-line--vert {
  stroke: rgba(0, 71, 255, 0.08);
  stroke-dasharray: 6 8;
}

.about__grid-accent {
  stroke: rgba(0, 71, 255, 0.25);
  stroke-width: 0.7;
  fill: none;
}

.about__grid-cross line {
  stroke: rgba(0, 163, 255, 0.35);
  stroke-width: 0.8;
}

.about__grid-node {
  fill: rgba(0, 71, 255, 0.3);
  stroke: none;
}

/* ─── Content (clip-path entrance) ─── */

.about__content {
  position: relative;
  z-index: var(--z-content);
  will-change: clip-path;
}

/* ─── Header ─── */

.about__header {
  display: flex;
  align-items: baseline;
  gap: 1em;
  margin-bottom: var(--content-gap);
}

.about__label {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--text-tertiary);
  letter-spacing: var(--tracking-wide);
}

.about__title {
  font-family: var(--font-statement);
  font-size: clamp(3rem, 7vw, 6rem);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: var(--tracking-tight);
  text-transform: uppercase;
  line-height: 0.9;
}

/* ─── Asymmetric Grid (60 / 40) ─── */

.about__grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: clamp(2rem, 4vw, 5rem);
  align-items: start;
}

/* ─── Left Column: Bio + Timeline ─── */

.about__left {
  display: flex;
  flex-direction: column;
  gap: var(--content-gap);
}

/* ─── Bio ─── */

.about__bio {
  display: flex;
  flex-direction: column;
  gap: clamp(1rem, 2vh, 1.5rem);
}

.about__bio-paragraph {
  font-family: var(--font-body);
  font-size: var(--text-body);
  font-weight: 500;
  line-height: var(--leading-body);
  color: var(--text-body-color);
  letter-spacing: var(--tracking-body);
  max-width: 50ch;
  will-change: transform, opacity, filter;
}

/* ─── Experience Timeline (VISUAL OBJECT 3) ─── */

.about__timeline {
  position: relative;
}

.about__timeline-heading {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--text-tertiary);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  margin-bottom: var(--space-6);
}

.about__timeline-track {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  padding-left: var(--space-7);
}

/* Vertical connector line */
.about__timeline-line {
  position: absolute;
  left: 5px;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(
    180deg,
    rgba(0, 71, 255, 0.3) 0%,
    rgba(0, 71, 255, 0.08) 100%
  );
  will-change: transform;
}

.about__timeline-entry {
  position: relative;
  display: flex;
  align-items: flex-start;
  will-change: transform, opacity;
}

/* Dot markers */
.about__timeline-dot {
  position: absolute;
  left: calc(var(--space-7) * -1 + 1px);
  top: 6px;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  border: 1.5px solid var(--accent-primary);
  background: var(--bg-abyss);
  will-change: transform, opacity;
}

.about__timeline-dot--active {
  background: var(--accent-primary);
  box-shadow: 0 0 12px rgba(0, 71, 255, 0.5), 0 0 24px rgba(0, 71, 255, 0.2);
}

.about__timeline-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.about__timeline-year {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: var(--accent-light);
  letter-spacing: var(--tracking-label);
}

.about__timeline-company {
  font-family: var(--font-display);
  font-size: var(--text-h3);
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: var(--tracking-heading);
  line-height: var(--leading-heading);
}

.about__timeline-role {
  font-family: var(--font-serif);
  font-size: var(--text-small);
  font-style: italic;
  color: var(--text-secondary);
  letter-spacing: var(--tracking-body);
}

/* ─── Photo Placeholder — "Signal Monitor" (VISUAL OBJECT 1) ─── */

.about__photo-frame {
  position: relative;
  aspect-ratio: 3 / 4;
  border: 1px solid rgba(0, 71, 255, 0.2);
  /* Topographic contour map — concentric rings like terrain scan */
  background:
    repeating-radial-gradient(
      circle at 35% 38%,
      transparent 0px, transparent 18px,
      rgba(0, 71, 255, 0.05) 18px, rgba(0, 71, 255, 0.05) 19px
    ),
    repeating-radial-gradient(
      circle at 65% 55%,
      transparent 0px, transparent 24px,
      rgba(0, 71, 255, 0.035) 24px, rgba(0, 71, 255, 0.035) 25px
    ),
    repeating-radial-gradient(
      circle at 50% 48%,
      transparent 0px, transparent 32px,
      rgba(0, 71, 255, 0.025) 32px, rgba(0, 71, 255, 0.025) 33px
    ),
    var(--surface-1);
  overflow: hidden;
  will-change: transform, filter, opacity;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Noise portrait canvas */
.about__noise-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  mix-blend-mode: screen;
}

/* Animated scanlines overlay */
.about__photo-frame::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 71, 255, 0.02) 2px,
    rgba(0, 71, 255, 0.02) 4px
  );
  background-size: 100% 4px;
  animation: about-scanlines 12s linear infinite;
}

/* Sweeping scan beam */
.about__photo-frame::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 3;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 71, 255, 0.4) 20%,
    rgba(0, 163, 255, 0.6) 50%,
    rgba(0, 71, 255, 0.4) 80%,
    transparent 100%
  );
  box-shadow: 0 0 20px rgba(0, 71, 255, 0.3), 0 0 60px rgba(0, 71, 255, 0.1);
  animation: about-sweep 6s cubic-bezier(0.45, 0, 0.55, 1) infinite;
}

@keyframes about-scanlines {
  from { background-position: 0 0; }
  to { background-position: 0 200px; }
}

@keyframes about-sweep {
  0%, 100% { top: -2px; opacity: 0; }
  5% { opacity: 1; }
  50% { top: 100%; opacity: 0.8; }
  55% { opacity: 0; }
}

/* Blueprint grid SVG inside photo frame */
.about__blueprint {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0.25;
}

.about__blueprint line {
  stroke: rgba(0, 71, 255, 0.25);
  stroke-width: 0.5;
}

.about__blueprint-center {
  stroke: rgba(0, 163, 255, 0.6);
  stroke-width: 1.5;
}

.about__blueprint-diag {
  stroke: rgba(0, 71, 255, 0.18);
  stroke-width: 0.4;
  stroke-dasharray: 4 4;
}

/* Corner brackets — viewfinder / architectural marks with glow pulse */
.about__bracket {
  position: absolute;
  width: 28px;
  height: 28px;
  z-index: 5;
  animation: about-bracket-pulse 3s ease-in-out infinite;
}

.about__bracket--tl {
  top: 10px;
  left: 10px;
  border-top: 1.5px solid var(--accent-primary);
  border-left: 1.5px solid var(--accent-primary);
  animation-delay: 0s;
}

.about__bracket--tr {
  top: 10px;
  right: 10px;
  border-top: 1.5px solid var(--accent-primary);
  border-right: 1.5px solid var(--accent-primary);
  animation-delay: 0.75s;
}

.about__bracket--bl {
  bottom: 10px;
  left: 10px;
  border-bottom: 1.5px solid var(--accent-primary);
  border-left: 1.5px solid var(--accent-primary);
  animation-delay: 1.5s;
}

.about__bracket--br {
  bottom: 10px;
  right: 10px;
  border-bottom: 1.5px solid var(--accent-primary);
  border-right: 1.5px solid var(--accent-primary);
  animation-delay: 2.25s;
}

@keyframes about-bracket-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; filter: drop-shadow(0 0 6px rgba(0, 71, 255, 0.4)); }
}

/* Center "SIGNAL PENDING" label with blinking cursor */
.about__photo-label {
  position: relative;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 2px;
}

.about__photo-label-text {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--accent-primary);
  opacity: 0.5;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

.about__photo-cursor {
  display: inline-block;
  width: 7px;
  height: 14px;
  background: var(--accent-primary);
  opacity: 0.6;
  animation: about-cursor-blink 1s step-end infinite;
}

@keyframes about-cursor-blink {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0; }
}

/* Coordinate labels */
.about__coord {
  position: absolute;
  z-index: 5;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: var(--accent-primary);
  opacity: 0.25;
  letter-spacing: 0.05em;
}

.about__coord--tl {
  top: 40px;
  left: 16px;
}

.about__coord--br {
  bottom: 40px;
  right: 16px;
}

/* ─── Stats Horizontal Strip ─── */

.about__stats {
  position: relative;
  margin-top: var(--content-gap);
  padding-top: var(--content-gap);
}

.about__stats-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    var(--accent-primary) 0%,
    rgba(0, 71, 255, 0.25) 30%,
    rgba(0, 71, 255, 0.08) 70%,
    transparent 100%
  );
  box-shadow: 0 0 12px rgba(0, 71, 255, 0.15);
}

.about__stats-row {
  display: flex;
  gap: clamp(2rem, 4vw, 5rem);
}

.about__stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.about__stat-value {
  display: flex;
  align-items: flex-start;
  font-family: var(--font-display);
  font-size: var(--text-h2);
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1;
  letter-spacing: var(--tracking-tight);
  text-shadow: 0 0 30px rgba(0, 71, 255, 0.3);
}

/* ─── Odometer System ─── */

.odo__char {
  display: inline-block;
  position: relative;
}

.odo__char--digit {
  height: 1em;
  overflow: hidden;
}

.odo__column {
  display: flex;
  flex-direction: column;
  will-change: transform;
}

.odo__digit {
  display: block;
  height: 1em;
  line-height: 1;
  text-align: center;
}

.odo__static {
  display: inline-block;
  line-height: 1;
}

.about__stat-label {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  font-weight: 500;
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-tertiary);
}

/* ─── Tech Stack Strip ─── */

.about__tech {
  display: flex;
  align-items: center;
  gap: var(--space-5);
  margin-top: var(--space-7);
  padding-top: var(--space-5);
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.about__tech-label {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: var(--text-tertiary);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  flex-shrink: 0;
}

.about__tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.about__tech-tag {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--text-secondary);
  letter-spacing: 0;
  padding: var(--space-1) var(--space-3);
  border: 1px solid rgba(0, 71, 255, 0.1);
  border-radius: 2px;
  background: rgba(0, 71, 255, 0.03);
  will-change: transform, opacity;
  transition: border-color var(--duration-fast) var(--ease-out-expo),
              background var(--duration-fast) var(--ease-out-expo);
}

.about__tech-tag:hover {
  border-color: rgba(0, 71, 255, 0.3);
  background: rgba(0, 71, 255, 0.06);
}

/* ═══════════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════════ */

@media (max-width: 768px) {
  .about__grid {
    grid-template-columns: 1fr;
  }

  .about__photo-frame {
    display: none;
  }

  .about__stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--content-gap);
  }

  .about__tech {
    flex-direction: column;
    align-items: flex-start;
  }

  .about__svg-grid {
    display: none;
  }

  .about__timeline-track {
    padding-left: var(--space-6);
  }

  .about__timeline-dot {
    left: calc(var(--space-6) * -1 + 1px);
  }
}

/* ═══════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
  .about__content {
    clip-path: none !important;
  }

  .about__photo-frame {
    opacity: 1 !important;
    filter: none !important;
    transform: none !important;
  }

  .about__bio-paragraph {
    opacity: 1 !important;
    filter: none !important;
    transform: none !important;
  }

  .about__timeline-entry {
    opacity: 1 !important;
    transform: none !important;
  }

  .about__timeline-dot {
    opacity: 1 !important;
    transform: none !important;
  }

  .about__timeline-line {
    transform: none !important;
  }

  .about__tech-tag {
    opacity: 1 !important;
    transform: none !important;
  }
}
</style>
