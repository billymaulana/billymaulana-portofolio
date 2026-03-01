<script setup lang="ts">
/**
 * SectionManifesto — "The Revelation"
 * Full-screen PINNED section. 800vh scroll distance.
 * Per-word blur-to-sharp reveal scrubbed to scroll.
 *
 * WOW MOMENT: Words materialize from blur haze as user scrolls,
 * with key words in PP Editorial New italic accent. Cloned text
 * shadow behind main text adds depth via mix-blend-mode: difference.
 * Atmospheric gradient shifts throughout the scroll.
 *
 * Entrance: Scroll-scrubbed pin (unique from all other sections)
 * Visual object: Chromatic text shadow clone + gradient shift
 */

const MANIFESTO_TEXT = 'I don\'t just write code — I architect experiences that move millions of people every single day'

const KEYWORDS = new Set(['architect', 'experiences', 'millions'])

const words = MANIFESTO_TEXT.split(' ')

function isKeyword(word: string): boolean {
  const clean = word.replace(/[—.,!?;:'"]/g, '').toLowerCase()
  return KEYWORDS.has(clean)
}

const sectionRef = ref<HTMLElement>()
const statementRef = ref<HTMLElement>()
const glowRef = ref<HTMLElement>()

let ctx: gsap.Context | null = null

onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced)
    return

  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    if (!sectionRef.value || !statementRef.value)
      return

    const wordEls = statementRef.value.querySelectorAll('.manifesto__word')

    // Pin the section for 800vh scroll distance
    // Each word transitions: blur(16px) + opacity:0 + y:8 → clear + opacity:1 + y:0
    gsap.fromTo(
      wordEls,
      {
        opacity: 0,
        y: 8,
        filter: 'blur(16px)',
      },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        stagger: 0.05,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          pin: statementRef.value.closest('.manifesto__pin-container') || statementRef.value.parentElement!,
        },
      },
    )

    // Atmospheric gradient shift during scroll
    if (glowRef.value) {
      gsap.fromTo(
        glowRef.value,
        { opacity: 0 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top top',
            end: '50% top',
            scrub: true,
          },
        },
      )

      gsap.fromTo(
        glowRef.value,
        { opacity: 1 },
        {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: '50% top',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      )
    }

    // Final glow on complete sentence — subtle scale pulse
    const shadowEl = sectionRef.value.querySelector('.manifesto__shadow')
    if (shadowEl) {
      gsap.fromTo(
        shadowEl,
        { opacity: 0 },
        {
          opacity: 0.1,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: '60% top',
            end: 'bottom bottom',
            scrub: true,
          },
        },
      )
    }

    // SVG accent lines entrance
    const accentLines = sectionRef.value.querySelectorAll('.manifesto__accent-line')
    const accentCircles = sectionRef.value.querySelectorAll('.manifesto__accent-circle')
    const accentCrosses = sectionRef.value.querySelectorAll('.manifesto__accent-cross')

    if (accentLines.length) {
      gsap.from(accentLines, {
        scaleX: 0,
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 70%',
        },
      })
    }

    if (accentCircles.length) {
      gsap.from(accentCircles, {
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        stagger: 0.15,
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 65%',
        },
      })
    }

    if (accentCrosses.length) {
      gsap.from(accentCrosses, {
        scale: 0,
        rotation: 90,
        opacity: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 60%',
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
    ref="sectionRef"
    class="manifesto"
    aria-label="Manifesto"
  >
    <!-- SVG accent lines (VISUAL OBJECT) -->
    <svg class="manifesto__accents" aria-hidden="true" viewBox="0 0 1440 800" preserveAspectRatio="none">
      <!-- Horizontal accent lines -->
      <line class="manifesto__accent-line" x1="0" y1="120" x2="300" y2="120" />
      <line class="manifesto__accent-line manifesto__accent-line--right" x1="1140" y1="200" x2="1440" y2="200" />
      <line class="manifesto__accent-line" x1="0" y1="600" x2="200" y2="600" />
      <line class="manifesto__accent-line manifesto__accent-line--right" x1="1240" y1="680" x2="1440" y2="680" />
      <!-- Decorative circles -->
      <circle class="manifesto__accent-circle" cx="300" cy="120" r="4" />
      <circle class="manifesto__accent-circle" cx="1140" cy="200" r="4" />
      <circle class="manifesto__accent-circle" cx="200" cy="600" r="3" />
      <circle class="manifesto__accent-circle" cx="1240" cy="680" r="3" />
      <!-- Cross marks -->
      <g class="manifesto__accent-cross" transform="translate(100, 400)">
        <line x1="-6" y1="0" x2="6" y2="0" />
        <line x1="0" y1="-6" x2="0" y2="6" />
      </g>
      <g class="manifesto__accent-cross" transform="translate(1340, 500)">
        <line x1="-6" y1="0" x2="6" y2="0" />
        <line x1="0" y1="-6" x2="0" y2="6" />
      </g>
    </svg>

    <!-- Pin container: this is what gets pinned to viewport center -->
    <div class="manifesto__pin-container">
      <!-- Cloned text shadow (VISUAL OBJECT — chromatic depth layer) -->
      <p class="manifesto__shadow" aria-hidden="true">
        <span
          v-for="(word, i) in words"
          :key="`s-${i}`"
          class="manifesto__shadow-word"
          :class="{ 'manifesto__shadow-word--keyword': isKeyword(word) }"
        >{{ word }}{{ i < words.length - 1 ? ' ' : '' }}</span>
      </p>

      <!-- Main statement -->
      <p ref="statementRef" class="manifesto__statement">
        <span
          v-for="(word, i) in words"
          :key="i"
          class="manifesto__word"
          :class="{ 'manifesto__word--keyword': isKeyword(word) }"
        >{{ word }}{{ i < words.length - 1 ? ' ' : '' }}</span>
      </p>
    </div>

    <!-- Atmospheric glow — shifts during scroll -->
    <div ref="glowRef" class="manifesto__atmosphere" aria-hidden="true" />

    <!-- Ghost section number -->
    <span class="manifesto__ghost" aria-hidden="true">02</span>
  </section>
</template>

<style scoped>
/* ═══ Section — 800vh for scroll-scrub distance ═══ */
.manifesto {
  position: relative;
  width: 100%;
  height: 800vh;
  background: var(--bg-base);
  overflow: hidden;
}

/* ═══ Pin Container — pinned to viewport center during scroll ═══ */
.manifesto__pin-container {
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ═══ Statement paragraph ═══ */
.manifesto__statement {
  position: relative;
  z-index: var(--z-content);
  max-width: min(60ch, 85vw);
  text-align: center;
  padding-inline: var(--page-margin);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 4.5rem);
  font-weight: 600;
  line-height: 1.2;
  color: var(--text-primary);
  letter-spacing: var(--tracking-heading);
  margin: 0;
}

/* ═══ Word spans ═══ */
.manifesto__word {
  display: inline;
  will-change: opacity, filter, transform;
  opacity: 0;
  filter: blur(16px);
}

/* ═══ Keyword spans — PP Editorial New italic accent ═══ */
.manifesto__word--keyword {
  font-family: var(--font-serif);
  font-style: italic;
  color: var(--accent-cyan);
}

/* ═══ Cloned text shadow — chromatic depth layer ═══ */
.manifesto__shadow {
  position: absolute;
  z-index: 5;
  max-width: min(60ch, 85vw);
  text-align: center;
  padding-inline: var(--page-margin);
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 4.5rem);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: var(--tracking-heading);
  margin: 0;
  color: var(--text-primary);
  opacity: 0;
  transform: translate(3px, 3px);
  mix-blend-mode: difference;
  pointer-events: none;
  user-select: none;
}

.manifesto__shadow-word--keyword {
  font-family: var(--font-serif);
  font-style: italic;
}

/* ═══ SVG Accent Lines ═══ */
.manifesto__accents {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100vh;
  z-index: 3;
  pointer-events: none;
}

.manifesto__accent-line {
  stroke: rgba(0, 71, 255, 0.2);
  stroke-width: 0.5;
  fill: none;
  transform-origin: left center;
}

.manifesto__accent-line--right {
  transform-origin: right center;
}

.manifesto__accent-circle {
  fill: none;
  stroke: rgba(0, 163, 255, 0.25);
  stroke-width: 0.5;
}

.manifesto__accent-cross line {
  stroke: rgba(0, 163, 255, 0.15);
  stroke-width: 0.5;
}

/* ═══ Atmospheric glow — gradient shift ═══ */
.manifesto__atmosphere {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: var(--z-atmosphere);
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(
    ellipse 60% 50% at 50% 50%,
    rgba(15, 10, 114, 0.08) 0%,
    transparent 70%
  );
}

/* ═══ Ghost section number ═══ */
.manifesto__ghost {
  position: fixed;
  bottom: clamp(2rem, 5vh, 4rem);
  right: var(--page-margin);
  font-family: var(--font-mono);
  font-size: clamp(5rem, 12vw, 12rem);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--text-disabled);
  opacity: 0.03;
  pointer-events: none;
  user-select: none;
  mix-blend-mode: difference;
}

/* ═══ Reduced Motion ═══ */
@media (prefers-reduced-motion: reduce) {
  .manifesto {
    height: auto;
    min-height: 80vh;
  }

  .manifesto__word {
    opacity: 1 !important;
    filter: none !important;
  }

  .manifesto__word--keyword {
    color: var(--accent-cyan) !important;
  }

  .manifesto__shadow {
    display: none;
  }

  .manifesto__atmosphere {
    position: absolute;
    opacity: 0.08 !important;
  }

  .manifesto__ghost {
    position: absolute;
  }
}

/* ═══ Responsive ═══ */
@media (max-width: 768px) {
  .manifesto {
    height: 500vh;
  }

  .manifesto__statement {
    font-size: clamp(1.5rem, 6vw, 2.5rem);
  }

  .manifesto__shadow {
    font-size: clamp(1.5rem, 6vw, 2.5rem);
  }
}
</style>
