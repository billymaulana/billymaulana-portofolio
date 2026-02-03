<script setup lang="ts">
interface Props {
  count?: number
  colors?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  count: 20,
  colors: () => ['#7C3AED', '#00FFFF', '#FF0080', '#7C3AED'],
})

const particles = computed(() => {
  return Array.from({ length: props.count }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * -20,
    color: props.colors[Math.floor(Math.random() * props.colors.length)],
  }))
})
</script>

<template>
  <div class="floating-particles">
    <div
      v-for="p in particles"
      :key="p.id"
      class="particle"
      :style="{
        '--size': `${p.size}px`,
        '--x': `${p.x}%`,
        '--y': `${p.y}%`,
        '--duration': `${p.duration}s`,
        '--delay': `${p.delay}s`,
        '--color': p.color,
      }"
    />
  </div>
</template>

<style scoped>
.floating-particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  left: var(--x);
  top: var(--y);
  background: var(--color);
  border-radius: 50%;
  opacity: 0.6;
  animation: particle-float var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
  filter: blur(1px);
}

@keyframes particle-float {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.6;
  }
  25% {
    transform: translate(30px, -50px) scale(1.2);
    opacity: 0.8;
  }
  50% {
    transform: translate(-20px, -100px) scale(0.8);
    opacity: 0.4;
  }
  75% {
    transform: translate(40px, -30px) scale(1.1);
    opacity: 0.7;
  }
}
</style>
