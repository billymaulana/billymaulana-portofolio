<script setup lang="ts">
/**
 * Footer: "Circular Narrative"
 * Mirrors the hero — same name, opposite weight (hero: 200, footer: 700).
 * Scroll-driven: letters animate from weight 200 to 700 as you approach.
 * The site LOOPS, not ends.
 */

const NAME = 'BILLY MAULANA'
const currentYear = new Date().getFullYear()

const sectionRef = ref<HTMLElement>()
const nameRef = ref<HTMLElement>()

let scrollCtx: gsap.Context | null = null

onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced)
    return

  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  scrollCtx = gsap.context(() => {
    if (!sectionRef.value || !nameRef.value)
      return

    // Name weight morph: 200 → 700 as footer scrolls into view
    gsap.fromTo(nameRef.value, {
      fontVariationSettings: `'wght' 200`,
      opacity: 0.3,
    }, {
      fontVariationSettings: `'wght' 700`,
      opacity: 1,
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1,
      },
    })
  })
})

onUnmounted(() => {
  scrollCtx?.revert()
})
</script>

<template>
  <footer
    ref="sectionRef"
    class="section-footer"
    aria-label="Footer"
  >
    <div class="section-footer__inner page-margin">
      <!-- Name: mirrors hero -->
      <div class="section-footer__top">
        <span ref="nameRef" class="section-footer__name">
          {{ NAME }}
        </span>
        <span class="section-footer__role">FRONTEND ARCHITECT</span>
      </div>

      <!-- Bottom bar -->
      <div class="section-footer__bottom">
        <span class="section-footer__copy">&copy; {{ currentYear }}</span>
        <nav class="section-footer__links" aria-label="Social links">
          <a
            href="https://github.com/billymaulana"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-label="GitHub"
          >GITHUB</a>
          <a
            href="https://linkedin.com/in/billy-maulana"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-label="LinkedIn"
          >LINKEDIN</a>
        </nav>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.section-footer {
  position: relative;
  width: 100%;
  padding: clamp(4rem, 8vh, 8rem) 0 clamp(1.5rem, 3vh, 3rem);
  background: var(--color-bg);
  border-top: 1px solid var(--color-text-ghost);
}

.section-footer__inner {
  display: flex;
  flex-direction: column;
  gap: clamp(4rem, 8vh, 8rem);
}

.section-footer__top {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Name mirrors hero — same font, opposite weight */
.section-footer__name {
  font-family: var(--font-display);
  font-variation-settings: 'wght' 700;
  font-size: var(--text-display);
  line-height: var(--leading-crush);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-primary);
  text-transform: uppercase;
  will-change: font-variation-settings, opacity;
}

.section-footer__role {
  font-family: var(--font-body);
  font-size: var(--text-caption);
  font-weight: 400;
  letter-spacing: var(--tracking-ultra);
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

/* Bottom bar */
.section-footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-footer__copy {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: var(--color-text-tertiary);
  letter-spacing: 0.05em;
}

.section-footer__links {
  display: flex;
  gap: 2rem;
}

.section-footer__links a {
  position: relative;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  text-decoration: none;
  transition: color 0.3s var(--ease-expo);
}

/* Underline wipe on hover */
.section-footer__links a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-text-primary);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s var(--ease-expo);
}

.section-footer__links a:hover {
  color: var(--color-text-primary);
}

.section-footer__links a:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* Responsive */
@media (max-width: 768px) {
  .section-footer__name {
    font-size: clamp(2rem, 10vw, 4rem);
  }

  .section-footer__bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .section-footer__name {
    font-variation-settings: 'wght' 700;
    opacity: 1;
  }

  .section-footer__links a::after {
    transition: none;
  }
}
</style>
