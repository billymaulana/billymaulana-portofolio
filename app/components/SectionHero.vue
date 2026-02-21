<script setup lang="ts">
onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const gsap = (await import('gsap')).default

  if (prefersReduced) {
    // Reduced motion: show content immediately, no animation.
    // gsap.set ensures elements are visible even if called after a brief delay.
    gsap.set(['.hero__name', '.hero__subtitle', '.hero__meta', '.hero__scroll'], {
      opacity: 1,
      clearProps: 'all',
    })
    return
  }

  // Full motion: rich entrance with translation + easing
  const tl = gsap.timeline({ delay: 0.3 })

  tl.from('.hero__name', {
    y: 60,
    opacity: 0,
    duration: 1.4,
    ease: 'expo.out',
  })

  tl.from('.hero__subtitle', {
    opacity: 0,
    y: 12,
    duration: 0.8,
    ease: 'expo.out',
  }, '-=0.6')

  tl.from('.hero__meta', {
    opacity: 0,
    y: 10,
    duration: 0.8,
    ease: 'expo.out',
    stagger: 0.1,
  }, '-=0.4')

  tl.from('.hero__scroll', {
    opacity: 0,
    scale: 0.8,
    duration: 1,
    ease: 'expo.out',
    clearProps: 'all',
  }, '-=0.4')
})

const distortionLines = [
  { text: 'BILLY', indent: 0 },
  { text: 'MAULANA', indent: 0 },
]
</script>

<template>
  <section
    id="hero"
    class="hero"
    aria-label="Billy Maulana — Frontend Developer"
  >
    <UiFluidCanvas :start-delay="200" />

    <!-- ─── Name + Subtitle ─── -->
    <div class="hero__content page-margin">
      <h1 class="sr-only">
        Billy Maulana
      </h1>

      <div class="hero__name font-display">
        <UiTextDistortion
          :lines="distortionLines"
          :start-delay="600"
          class="hero__distortion"
        />
      </div>

      <p class="hero__subtitle">
        Frontend Engineer <span class="hero__subtitle-sep">&mdash;</span> Shaping Meaningful Digital Experiences
      </p>
    </div>

    <!-- ─── Bottom anchors ─── -->
    <div class="hero__bottom page-margin">
      <div class="hero__meta-group">
        <span class="hero__meta">Open to Purposeful Collaborations</span>
        <span class="hero__meta">Curated Works &middot; &copy;2026</span>
      </div>

      <!-- Rotating circle scroll indicator -->
      <div class="hero__scroll">
        <div class="hero__scroll-ring">
          <svg class="hero__scroll-svg" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <path id="scrollCircle" d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" fill="none" />
            </defs>
            <text class="hero__scroll-text">
              <textPath href="#scrollCircle">SCROLL · DISCOVER · SCROLL · DISCOVER ·&nbsp;</textPath>
            </text>
          </svg>
          <!-- Center: arrow icon -->
          <svg class="hero__scroll-arrow" viewBox="0 0 12 28" fill="none" aria-hidden="true">
            <circle cx="6" cy="3" r="1.5" fill="currentColor" opacity="0.7" />
            <line x1="6" y1="6" x2="6" y2="22" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
            <path d="M2.5 19L6 24.5 9.5 19" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ═══════════════════════════════════════════
   HERO — Golden Ratio Grid (φ = 1.618)
   Fibonacci spacing: 8 · 13 · 21 · 34 · 55 · 89
   ═══════════════════════════════════════════ */

.hero {
  position: relative;
  height: 100vh;
  height: 100dvh;
  display: grid;
  grid-template-rows: 1fr auto;
  overflow: hidden;
  background-color: #000000;
}

/* ─── Content — Golden section vertical position ─── */
/* φ spacing: logo→name = 89px(Fib), name→subtitle = 34px(Fib), subtitle→meta = natural */
.hero__content {
  position: relative;
  z-index: var(--z-content, 10);
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* padding-top clears nav + golden section offset: Fibonacci 89px base */
  padding-top: clamp(5.5625rem, 10vh, 8.5rem);
  padding-bottom: clamp(3.4375rem, 8vh, 5.5rem);
}

/* ─── Name — φ width (61.8% of content area) ─── */
.hero__name {
  width: 100%;
  max-width: 61.8%;
}

.hero__distortion {
  position: relative;
  z-index: 2;
}

/* ─── Subtitle — refined uppercase label ─── */
/* φ gap: name → subtitle = Fibonacci 34px (2.125rem), scales to 21px (1.3125rem) on small screens */
.hero__subtitle {
  font-size: var(--text-label);
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  line-height: 1.618;
  margin-top: clamp(1.3125rem, 3vh, 2.125rem);
}

.hero__subtitle-sep {
  color: var(--color-text-tertiary);
  margin: 0 0.4em;
}

/* ─── Bottom — anchored footer bar ─── */
.hero__bottom {
  position: relative;
  z-index: var(--z-content, 10);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: clamp(2.125rem, 4.5vh, 3.4375rem);
}

.hero__meta-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.hero__meta {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  line-height: 1.618;
}

/* ─── Scroll indicator — rotating ring + center dot & line ─── */
.hero__scroll-ring {
  position: relative;
  width: clamp(58px, 5.2vw, 76px);
  height: clamp(58px, 5.2vw, 76px);
}

.hero__scroll-svg {
  width: 100%;
  height: 100%;
  animation: scrollRotate 18s linear infinite;
}

.hero__scroll-text {
  font-size: 6.8px;
  fill: rgba(255, 255, 255, 0.5);
  letter-spacing: 0.28em;
  text-transform: uppercase;
  font-family: 'Satoshi', system-ui, sans-serif;
  font-weight: 500;
}

/* Center arrow — floats subtly inside the rotating ring */
.hero__scroll-arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 12px;
  height: 24px;
  color: rgba(255, 255, 255, 0.7);
  transform: translate(-50%, -50%);
  animation: scrollArrowFloat 2.4s ease-in-out infinite;
}

@keyframes scrollRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes scrollArrowFloat {
  0%, 100% { opacity: 0.45; transform: translate(-50%, -55%); }
  50% { opacity: 0.85; transform: translate(-50%, -45%); }
}

/* ─── Utilities ─── */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* ─── Responsive: Tablet landscape ─── */
@media (max-width: 1024px) {
  .hero__name {
    max-width: 70%;
  }

  .hero__content {
    padding-top: clamp(5rem, 9vh, 7rem);
    padding-bottom: clamp(2.125rem, 6vh, 3.4375rem);
  }
}

/* ─── Responsive: Tablet portrait ─── */
@media (max-width: 768px) {
  .hero__name {
    max-width: 76.4%;
  }

  .hero__subtitle {
    font-size: var(--text-caption);
    letter-spacing: 0.18em;
    margin-top: clamp(0.8125rem, 2vh, 1.3125rem);
  }

  .hero__bottom {
    padding-bottom: clamp(1.3125rem, 3vh, 2.125rem);
  }
}

/* ─── Responsive: Mobile ─── */
@media (max-width: 480px) {
  .hero__name {
    max-width: 92%;
  }

  .hero__content {
    justify-content: flex-start;
    padding-top: clamp(7.5rem, 28vh, 15rem);
    padding-bottom: clamp(1.3125rem, 4vh, 2.125rem);
  }

  .hero__subtitle-sep,
  .hero__subtitle-sep ~ * {
    display: none;
  }

  .hero__subtitle {
    margin-top: clamp(0.5rem, 1.5vh, 0.8125rem);
  }

  .hero__meta-group {
    gap: 0.3125rem;
  }

  .hero__scroll-ring {
    width: 48px;
    height: 48px;
  }
}

.hero__scroll {
  /* Transition applied after GSAP entrance completes — avoid conflict with .from() */
}

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  .hero__scroll-svg {
    animation: none;
  }

  .hero__scroll-arrow {
    animation: none;
    opacity: 0.4;
  }
}
</style>
