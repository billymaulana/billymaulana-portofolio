<script setup lang="ts">
interface Props {
  variant?: 'gradient' | 'dots' | 'line' | 'wave'
  color?: string
}

withDefaults(defineProps<Props>(), {
  variant: 'gradient',
  color: '#7C3AED',
})
</script>

<template>
  <div class="section-divider" :class="`variant-${variant}`">
    <div v-if="variant === 'gradient'" class="gradient-line" :style="{ '--color': color }" />

    <div v-else-if="variant === 'dots'" class="dots-container">
      <span v-for="i in 5" :key="i" class="dot" :style="{ animationDelay: `${i * 0.1}s` }" />
    </div>

    <div v-else-if="variant === 'line'" class="line" :style="{ '--color': color }" />

    <svg v-else-if="variant === 'wave'" class="wave" viewBox="0 0 1440 100" preserveAspectRatio="none">
      <path
        :fill="color"
        fill-opacity="0.1"
        d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,25 1440,50 L1440,100 L0,100 Z"
      />
    </svg>
  </div>
</template>

<style scoped>
.section-divider {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 0;
  overflow: hidden;
}

/* Gradient Line */
.gradient-line {
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--color), transparent);
  position: relative;
}

.gradient-line::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8px;
  height: 8px;
  background: var(--color);
  border-radius: 50%;
  box-shadow: 0 0 20px var(--color);
}

/* Dots */
.dots-container {
  display: flex;
  gap: 12px;
}

.dot {
  width: 6px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  animation: dot-pulse 2s ease-in-out infinite;
}

@keyframes dot-pulse {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.5); opacity: 1; }
}

/* Line */
.line {
  width: 100px;
  height: 1px;
  background: var(--color);
  opacity: 0.3;
}

/* Wave */
.wave {
  width: 100%;
  height: 100px;
}
</style>
