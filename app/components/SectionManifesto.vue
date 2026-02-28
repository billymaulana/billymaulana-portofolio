<script setup lang="ts">
/**
 * Manifesto: "One Word Per Line"
 * 6 words, each with DIFFERENT typographic treatment.
 * Scroll reveals words with weight morphing.
 */

interface ManifestoWord {
  text: string
  treatment: string
}

const WORDS: ManifestoWord[] = [
  { text: 'I', treatment: 'whisper' },
  { text: 'BUILD', treatment: 'statement' },
  { text: 'INTERFACES', treatment: 'outlined' },
  { text: 'THAT', treatment: 'bridge' },
  { text: 'FEEL', treatment: 'expressive' },
  { text: 'ALIVE', treatment: 'chromatic' },
]

const wordRefs = ref<HTMLElement[]>([])

function collectWordRef(el: unknown) {
  if (el instanceof HTMLElement) {
    wordRefs.value.push(el)
  }
}

let scrollCtx: gsap.Context | null = null

onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReduced) {
    wordRefs.value.forEach((el) => {
      el.style.opacity = '1'
      el.style.transform = 'none'
    })
    return
  }

  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  scrollCtx = gsap.context(() => {
    wordRefs.value.forEach((wordEl) => {
      // Initial state
      gsap.set(wordEl, {
        opacity: 0,
        y: 50,
        fontVariationSettings: `'wght' 200`,
      })

      // Get target weight from data attribute
      const targetWeight = wordEl.dataset.targetWeight || '700'

      gsap.to(wordEl, {
        scrollTrigger: {
          trigger: wordEl,
          start: 'top 85%',
          end: 'top 40%',
          scrub: 0.8,
        },
        opacity: 1,
        y: 0,
        fontVariationSettings: `'wght' ${targetWeight}`,
        ease: 'power2.out',
      })
    })
  })
})

onUnmounted(() => {
  scrollCtx?.revert()
})
</script>

<template>
  <section
    class="section-manifesto"
    aria-label="Manifesto — I build interfaces that feel alive"
  >
    <div class="section-manifesto__inner page-margin">
      <div
        v-for="(word, i) in WORDS"
        :key="i"
        :ref="collectWordRef"
        class="section-manifesto__word"
        :class="`section-manifesto__word--${word.treatment}`"
        :data-target-weight="
          word.treatment === 'whisper' ? '300'
          : word.treatment === 'bridge' ? '300'
            : word.treatment === 'expressive' ? '500'
              : '700'
        "
      >
        {{ word.text }}
        <!-- Chromatic shadow clones for "ALIVE" -->
        <template v-if="word.treatment === 'chromatic'">
          <span class="section-manifesto__shadow section-manifesto__shadow--r" aria-hidden="true">{{ word.text }}</span>
          <span class="section-manifesto__shadow section-manifesto__shadow--b" aria-hidden="true">{{ word.text }}</span>
        </template>
      </div>
    </div>

    <!-- Section number ghost -->
    <span class="section-manifesto__ghost" aria-hidden="true">02</span>
  </section>
</template>

<style scoped>
.section-manifesto {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding: var(--section-gap) 0;
  background: var(--color-bg);
  overflow: hidden;
}

.section-manifesto__inner {
  display: flex;
  flex-direction: column;
  gap: clamp(0.5rem, 1vh, 1rem);
}

/* Base word styling */
.section-manifesto__word {
  position: relative;
  font-family: var(--font-display);
  text-transform: uppercase;
  line-height: var(--leading-tight);
  will-change: transform, opacity, font-variation-settings;
}

/* Treatment: whisper — small, light */
.section-manifesto__word--whisper {
  font-variation-settings: 'wght' 300;
  font-size: var(--text-title);
  color: var(--color-text-secondary);
  letter-spacing: var(--tracking-wide);
}

/* Treatment: statement — bold, large */
.section-manifesto__word--statement {
  font-variation-settings: 'wght' 700;
  font-size: var(--text-word-stack);
  color: var(--color-text-primary);
  letter-spacing: var(--tracking-tight);
}

/* Treatment: outlined — huge, stroke only */
.section-manifesto__word--outlined {
  font-variation-settings: 'wght' 700;
  font-size: var(--text-display);
  color: transparent;
  -webkit-text-stroke: 1.5px var(--color-text-primary);
  letter-spacing: var(--tracking-tight);
}

/* Treatment: bridge — small, light (same as whisper but different position) */
.section-manifesto__word--bridge {
  font-variation-settings: 'wght' 300;
  font-size: var(--text-title);
  color: var(--color-text-secondary);
  letter-spacing: var(--tracking-wide);
}

/* Treatment: expressive — italic, medium */
.section-manifesto__word--expressive {
  font-variation-settings: 'wght' 500;
  font-size: var(--text-word-stack);
  font-style: italic;
  color: var(--color-text-primary);
  letter-spacing: var(--tracking-normal);
}

/* Treatment: chromatic — bold with RGB shadow clones */
.section-manifesto__word--chromatic {
  font-variation-settings: 'wght' 700;
  font-size: var(--text-display);
  color: var(--color-text-primary);
  letter-spacing: var(--tracking-tight);
}

/* Chromatic shadow pseudo-layers */
.section-manifesto__shadow {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  user-select: none;
}

.section-manifesto__shadow--r {
  color: rgba(255, 0, 50, 0.2);
  transform: translate(3px, -2px);
  mix-blend-mode: screen;
}

.section-manifesto__shadow--b {
  color: rgba(0, 71, 255, 0.2);
  transform: translate(-3px, 2px);
  mix-blend-mode: screen;
}

/* Ghost section number */
.section-manifesto__ghost {
  position: absolute;
  bottom: clamp(2rem, 5vh, 4rem);
  right: var(--page-margin);
  font-family: var(--font-mono);
  font-size: clamp(5rem, 12vw, 12rem);
  font-weight: 400;
  line-height: 1;
  letter-spacing: -0.02em;
  color: var(--color-text-ghost);
  opacity: 0.03;
  pointer-events: none;
  user-select: none;
}

/* Responsive */
@media (max-width: 768px) {
  .section-manifesto__word--outlined {
    -webkit-text-stroke: 1px var(--color-text-primary);
  }

  .section-manifesto__ghost {
    font-size: clamp(4rem, 18vw, 8rem);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .section-manifesto__word {
    opacity: 1;
    transform: none;
  }
}
</style>
