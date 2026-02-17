<script setup lang="ts">
useHead({
  title: '404 — Lost in the Spectrum',
})

const fragments = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 20 + Math.random() * 40,
  x: Math.random() * 100,
  y: Math.random() * 100,
  rotation: Math.random() * 360,
  delay: Math.random() * 2,
  gradient: [
    'linear-gradient(135deg, #0047FF, #8B00FF)',
    'linear-gradient(135deg, #FF3333, #FF6B00)',
    'linear-gradient(135deg, #00FF88, #00F5FF)',
    'linear-gradient(135deg, #FFD600, #FF6B00)',
    'linear-gradient(135deg, #8B00FF, #FF3333)',
    'linear-gradient(135deg, #0047FF, #00F5FF)',
  ][i % 6],
}))
</script>

<template>
  <main class="not-found">
    <!-- Shattered Prism Fragments -->
    <div class="not-found__fragments" aria-hidden="true">
      <div
        v-for="frag in fragments"
        :key="frag.id"
        class="not-found__fragment"
        :style="{
          width: `${frag.size}px`,
          height: `${frag.size}px`,
          left: `${frag.x}%`,
          top: `${frag.y}%`,
          transform: `rotate(${frag.rotation}deg)`,
          background: frag.gradient,
          animationDelay: `${frag.delay}s`,
        }"
      />
    </div>

    <div class="not-found__content">
      <span class="not-found__code text-display">404</span>
      <h1 class="not-found__title text-h2">
        Lost in the Spectrum
      </h1>
      <p class="not-found__desc text-body">
        The prism shattered. This page doesn't exist in any wavelength.
      </p>
      <NuxtLink to="/" class="not-found__cta btn-primary">
        Back to Light
        <span class="i-carbon-arrow-right" aria-hidden="true" />
      </NuxtLink>
    </div>
  </main>
</template>

<style scoped>
.not-found {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  background: var(--color-bg-primary);
}

.not-found__fragments {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.not-found__fragment {
  position: absolute;
  opacity: 0.1;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  animation: fragmentFloat 8s ease-in-out infinite;
}

.not-found__content {
  position: relative;
  z-index: 2;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
}

.not-found__code {
  color: transparent;
  -webkit-text-stroke: 2px rgba(255, 255, 255, 0.1);
  line-height: 1;
}

.not-found__title {
  color: var(--color-text-primary);
}

.not-found__desc {
  color: var(--color-text-secondary);
  max-width: 400px;
}

@keyframes fragmentFloat {
  0%, 100% {
    transform: translateY(0) rotate(var(--rotation, 0deg));
    opacity: 0.08;
  }
  50% {
    transform: translateY(-20px) rotate(calc(var(--rotation, 0deg) + 15deg));
    opacity: 0.15;
  }
}
</style>
