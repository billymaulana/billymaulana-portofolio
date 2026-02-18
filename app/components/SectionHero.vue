<script setup lang="ts">
onMounted(async () => {
  const gsap = (await import('gsap')).default

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

      <div class="hero__name">
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
          <svg class="hero__scroll-arrow" viewBox="0 0 10 26" fill="none" aria-hidden="true">
            <line x1="5" y1="0" x2="5" y2="21" stroke="currentColor" stroke-width="1" stroke-linecap="round" />
            <path d="M1.5 18L5 23.5 8.5 18" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  height: 100dvh;
  display: grid;
  grid-template-rows: 1fr auto;
  overflow: hidden;
  background-color: #000000;
}

.hero__content {
  position: relative;
  z-index: var(--z-content, 10);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: clamp(4rem, 8vh, 6rem);
}

.hero__name {
  width: 100%;
  max-width: 55%;
}

.hero__distortion {
  position: relative;
  z-index: 2;
}

.hero__subtitle {
  font-size: var(--text-label);
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-top: clamp(0.75rem, 1.5vh, 1.25rem);
}

.hero__subtitle-sep {
  color: var(--color-text-tertiary);
  margin: 0 0.15em;
}

.hero__bottom {
  position: relative;
  z-index: var(--z-content, 10);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: clamp(2rem, 4vh, 3rem);
}

.hero__meta-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.hero__meta {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-tertiary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* ─── Rotating circle scroll ─── */
.hero__scroll-ring {
  position: relative;
  width: clamp(64px, 6vw, 80px);
  height: clamp(64px, 6vw, 80px);
}

.hero__scroll-svg {
  width: 100%;
  height: 100%;
  animation: scrollRotate 15s linear infinite;
}

.hero__scroll-text {
  font-size: 8px;
  fill: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  font-family: 'Satoshi', system-ui, sans-serif;
  font-weight: 500;
}

.hero__scroll-arrow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 22px;
  color: rgba(255, 255, 255, 0.4);
  transform: translate(-50%, -50%);
  animation: scrollArrowFloat 2.4s ease-in-out infinite;
}

@keyframes scrollRotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes scrollArrowFloat {
  0%, 100% { opacity: 0.3; transform: translate(-50%, -55%); }
  50% { opacity: 0.7; transform: translate(-50%, -45%); }
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

@media (max-width: 768px) {
  .hero__name {
    max-width: 75%;
  }

  .hero__subtitle {
    font-size: var(--text-caption);
  }
}

@media (max-width: 480px) {
  .hero__name {
    max-width: 90%;
  }

  .hero__subtitle-sep,
  .hero__subtitle-sep ~ * {
    display: none;
  }

  .hero__scroll-ring {
    width: 56px;
    height: 56px;
  }
}

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
