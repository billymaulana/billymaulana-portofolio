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
        <div class="hero__scroll-track">
          <div class="hero__scroll-dot" />
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  background-color: #000000;
  /* Push center down: nav is ~96px tall, so top exclusion needs to be generous */
  padding-top: clamp(7rem, 15vh, 12rem);
  padding-bottom: clamp(4rem, 8vh, 6rem);
}

/* ─ Main content ─ */
.hero__content {
  position: relative;
  z-index: var(--z-content, 10);
  display: flex;
  flex-direction: column;
}

.hero__name {
  width: 88%;
  max-width: 88%;
}

.hero__distortion {
  position: relative;
  z-index: 2;
}

/* ─ Bottom bar — subtitle + scroll ─ */
.hero__bottom {
  position: absolute;
  bottom: clamp(2rem, 4vh, 3.5rem);
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
  gap: 0.875rem;
}

.hero__scroll-label {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-tertiary);
  letter-spacing: 0.25em;
  text-transform: uppercase;
}

.hero__scroll-track {
  position: relative;
  width: 1px;
  height: 48px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 1px;
  overflow: hidden;
}

.hero__scroll-dot {
  position: absolute;
  top: 0;
  left: 50%;
  width: 3px;
  height: 10px;
  margin-left: -1.5px;
  border-radius: 2px;
  background: var(--color-accent);
  box-shadow: 0 0 6px rgba(0, 71, 255, 0.5);
  animation: scrollDotDrop 2.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
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

@keyframes scrollDotDrop {
  0% {
    top: -10px;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    top: 48px;
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .hero__name {
    width: 100%;
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .hero__scroll-track {
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
  .hero__scroll-dot {
    animation: none;
    top: 0;
    opacity: 0.5;
  }
}
</style>
