<script setup lang="ts">
onMounted(async () => {
  const gsap = (await import('gsap')).default

  const tl = gsap.timeline({ delay: 0.5 })

  tl.from('.hero__name', {
    y: 80,
    opacity: 0,
    duration: 1.8,
    ease: 'expo.out',
  })

  tl.from('.hero__bottom', {
    opacity: 0,
    y: 15,
    duration: 1.2,
    ease: 'expo.out',
  }, '-=1.2')
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
    <UiFluidCanvas
      :start-delay="200"
    />

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
    </div>

    <div class="hero__bottom page-margin">
      <div class="hero__subtitle">
        <span class="hero__role">Frontend Developer</span>
        <span class="hero__separator">/</span>
        <span class="hero__location">Indonesia</span>
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
  background-color: #000000;
}

/* ─ Main content ─ */
.hero__content {
  position: relative;
  z-index: var(--z-content, 10);
  display: flex;
  flex-direction: column;
}

.hero__name {
  width: 90%;
  max-width: 90%;
}

.hero__distortion {
  position: relative;
  z-index: 2;
}

/* ─ Bottom bar — subtitle + scroll ─ */
.hero__bottom {
  position: absolute;
  bottom: clamp(1.5rem, 3vh, 2.5rem);
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  z-index: var(--z-content, 10);
}

.hero__subtitle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.hero__role {
  font-size: var(--text-label);
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hero__separator {
  font-size: var(--text-label);
  color: var(--color-text-tertiary);
}

.hero__location {
  font-size: var(--text-label);
  font-weight: 400;
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

@media (max-width: 768px) {
  .hero__name {
    width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .hero__scroll-line {
    height: 32px;
  }

  .hero__subtitle {
    gap: 0.5rem;
  }

  .hero__bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .hero__scroll {
    align-self: flex-end;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__scroll-line {
    animation: none;
    opacity: 0.5;
  }
}
</style>
