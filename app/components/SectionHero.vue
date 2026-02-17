<script setup lang="ts">
onMounted(async () => {
  const gsap = (await import('gsap')).default

  const tl = gsap.timeline({ delay: 0.6 })

  tl.from('.hero__name', {
    y: 60,
    opacity: 0,
    duration: 1.4,
    ease: 'power4.out',
  })

  tl.from('.hero__meta', {
    opacity: 0,
    y: -15,
    duration: 0.8,
    ease: 'power3.out',
  }, '-=0.9')

  tl.from('.hero__tagline', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  }, '-=0.5')

  tl.from('.hero__bottom-left', {
    opacity: 0,
    y: 10,
    duration: 0.6,
    ease: 'power2.out',
  }, '-=0.3')

  tl.from('.hero__scroll', {
    opacity: 0,
    y: -10,
    duration: 0.6,
    ease: 'power2.out',
  }, '-=0.3')
})

const distortionLines = [
  { text: 'BILLY', indent: 0 },
  { text: 'MAULANA', indent: 60 },
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
      :initial-splats="2"
    />

    <div class="hero__meta">
      <span class="hero__meta-label">
        Frontend Engineer<br>from Indonesia
      </span>
    </div>

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

      <p class="hero__tagline">
        Crafting digital experiences with<br>precision and intention
      </p>
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
  background-color: #000000;
}

/* ─ Role meta — positioned top-right for diagonal flow ─ */
.hero__meta {
  position: absolute;
  top: clamp(7rem, 14vh, 10rem);
  right: var(--page-margin);
  z-index: var(--z-content, 10);
  text-align: right;
}

.hero__meta-label {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-tertiary);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  line-height: 1.8;
}

/* ─ Main content — left-aligned editorial ─ */
.hero__center {
  position: relative;
  z-index: var(--z-content, 10);
  width: 100%;
  padding-left: var(--page-margin);
  padding-right: var(--page-margin);
}

.hero__name {
  width: 85%;
  max-width: 85%;
}

.hero__distortion {
  position: relative;
  z-index: 2;
}

.hero__tagline {
  margin-top: clamp(1.5rem, 3vw, 2.5rem);
  font-size: var(--text-label);
  font-weight: 400;
  color: var(--color-text-tertiary);
  letter-spacing: 0.08em;
  line-height: 1.7;
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

@media (max-width: 768px) {
  .hero__name {
    width: 100%;
    max-width: 100%;
  }

  .hero__meta {
    top: clamp(5.5rem, 10vh, 7rem);
  }
}

@media (max-width: 480px) {
  .hero__bottom-left {
    display: none;
  }

  .hero__scroll-line {
    height: 32px;
  }

  .hero__meta {
    position: relative;
    top: auto;
    right: auto;
    text-align: left;
    margin-bottom: 1.5rem;
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
