<script setup lang="ts">
import { profile } from '~/constants/profile'

onMounted(async () => {
  const gsap = (await import('gsap')).default

  const tl = gsap.timeline({ delay: 0.6 })

  tl.from('.hero__meta', {
    y: -10,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
  })

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
    aria-label="Billy Maulana — Frontend Engineer"
  >
    <UiFluidCanvas
      :start-delay="200"
      :initial-splats="3"
    />

    <div class="hero__ambient" />

    <div class="hero__meta">
      <span class="hero__meta-role">{{ profile.title }} — {{ profile.location }}</span>
      <span class="hero__meta-years">({{ String(profile.yearsExperience).padStart(2, '0') }})</span>
    </div>

    <div class="hero__content">
      <h1 class="sr-only">
        Billy Maulana
      </h1>

      <UiTextDistortion
        :lines="distortionLines"
        :start-delay="600"
        class="hero__distortion"
      />
    </div>

    <div class="hero__scroll">
      <span class="hero__scroll-label">Scroll</span>
      <div class="hero__scroll-line" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 85vh;
  height: 85dvh;
  max-height: 900px;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: var(--color-bg);
}

.hero__ambient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0, 71, 255, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 60% 80% at 30% 60%, rgba(0, 245, 255, 0.04) 0%, transparent 60%);
  pointer-events: none;
  z-index: 2;
}

.hero__meta {
  position: absolute;
  top: clamp(1.5rem, 3vh, 2.5rem);
  left: var(--page-margin);
  right: var(--page-margin);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: var(--z-content, 10);
}

.hero__meta-role {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.hero__meta-years {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-tertiary);
  letter-spacing: 0.1em;
  font-variant-numeric: tabular-nums;
}

.hero__content {
  position: relative;
  z-index: var(--z-content, 10);
  width: 100%;
  padding-left: var(--page-margin);
  padding-right: var(--page-margin);
}

.hero__distortion {
  position: relative;
  z-index: 2;
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

.hero__scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  z-index: var(--z-content, 10);
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

@media (prefers-reduced-motion: reduce) {
  .hero__scroll-line {
    animation: none;
    opacity: 0.5;
  }
}
</style>
