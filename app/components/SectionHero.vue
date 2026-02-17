<script setup lang="ts">
import { profile } from '~/constants/profile'

onMounted(async () => {
  const gsap = (await import('gsap')).default

  const tl = gsap.timeline({ delay: 0.6 })

  tl.from('.hero__name', {
    y: 60,
    opacity: 0,
    duration: 1.2,
    ease: 'power4.out',
  })

  tl.from('.hero__subtitle', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  }, '-=0.6')

  tl.from('.hero__bottom-left', {
    opacity: 0,
    y: 10,
    duration: 0.6,
    ease: 'power2.out',
  }, '-=0.4')

  tl.from('.hero__scroll', {
    opacity: 0,
    y: -10,
    duration: 0.6,
    ease: 'power2.out',
  }, '-=0.4')
})

const distortionLines = [
  { text: 'BILLY', indent: 0 },
  { text: 'MAULANA', indent: 80 },
]
</script>

<template>
  <section
    id="hero"
    class="hero"
    aria-label="Billy Maulana — Frontend Developer"
  >
    <UiFluidCanvas
      :start-delay="200"
      :initial-splats="5"
    />

    <div class="hero__ambient" />

    <div class="hero__center">
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

      <div class="hero__subtitle">
        <span class="hero__subtitle-line" />
        <span class="hero__subtitle-text">{{ profile.title }}</span>
      </div>
    </div>

    <div class="hero__bottom">
      <div class="hero__bottom-left">
        <span class="hero__avail-dot" />
        <span class="hero__avail-text">Available for work</span>
      </div>

      <div class="hero__scroll">
        <span class="hero__scroll-label">Scroll</span>
        <div class="hero__scroll-line" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  background-color: var(--color-bg);
}

.hero__ambient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0, 71, 255, 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 50% 70% at 20% 60%, rgba(0, 245, 255, 0.03) 0%, transparent 60%);
  pointer-events: none;
  z-index: 2;
}

/* ─ Main typography block ─ */
.hero__center {
  position: relative;
  z-index: var(--z-content, 10);
  padding-left: var(--page-margin);
  padding-right: var(--page-margin);
}

.hero__name {
  width: 100%;
}

.hero__distortion {
  position: relative;
  z-index: 2;
}

.hero__subtitle {
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 1.5vw, 1.5rem);
  margin-top: clamp(1rem, 2vw, 2rem);
  padding-left: clamp(0, 4vw, 5rem);
}

.hero__subtitle-line {
  width: clamp(2rem, 4vw, 4rem);
  height: 1px;
  background: var(--color-text-tertiary);
  flex-shrink: 0;
}

.hero__subtitle-text {
  font-size: var(--text-label);
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

/* ─ Bottom bar ─ */
.hero__bottom {
  position: absolute;
  bottom: clamp(1.5rem, 3vh, 2.5rem);
  left: var(--page-margin);
  right: var(--page-margin);
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: var(--z-content, 10);
}

.hero__bottom-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hero__avail-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00ff88;
  box-shadow: 0 0 8px rgba(0, 255, 136, 0.4);
  animation: pulse 2.5s ease-in-out infinite;
}

.hero__avail-text {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-tertiary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.hero__scroll {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.hero__scroll-label {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-tertiary);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hero__scroll-line {
  width: 1px;
  height: 48px;
  background: linear-gradient(to bottom, var(--color-text-tertiary), transparent);
  animation: scrollPulse 2.5s ease-in-out infinite;
}

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

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

@keyframes scrollPulse {
  0%, 100% {
    opacity: 1;
    transform: scaleY(1);
  }
  50% {
    opacity: 0.2;
    transform: scaleY(0.5);
  }
}

@media (max-width: 480px) {
  .hero__bottom-left {
    display: none;
  }

  .hero__subtitle-line {
    display: none;
  }

  .hero__scroll-line {
    height: 32px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__avail-dot {
    animation: none;
    opacity: 0.7;
  }

  .hero__scroll-line {
    animation: none;
    opacity: 0.5;
  }
}
</style>
