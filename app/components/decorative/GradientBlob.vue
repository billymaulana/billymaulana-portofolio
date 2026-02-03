<script setup lang="ts">
interface Props {
  color1?: string
  color2?: string
  color3?: string
  size?: string
  blur?: string
  opacity?: number
  animate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color1: '#00F5FF',
  color2: '#00FFFF',
  color3: '#FF0080',
  size: '600px',
  blur: '100px',
  opacity: 0.6,
  animate: true,
})
</script>

<template>
  <div
    class="gradient-blob"
    :class="{ 'blob-animated': props.animate }"
    :style="{
      '--color1': props.color1,
      '--color2': props.color2,
      '--color3': props.color3,
      '--size': props.size,
      '--blur': props.blur,
      '--opacity': props.opacity,
    }"
  />
</template>

<style scoped>
.gradient-blob {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: conic-gradient(
    from 180deg at 50% 50%,
    var(--color1) 0deg,
    var(--color2) 120deg,
    var(--color3) 240deg,
    var(--color1) 360deg
  );
  border-radius: 50%;
  filter: blur(var(--blur));
  opacity: var(--opacity);
  pointer-events: none;
  will-change: transform;
}

.blob-animated {
  animation: blob-morph 20s ease-in-out infinite, blob-rotate 30s linear infinite;
}

@keyframes blob-morph {
  0%, 100% {
    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    transform: scale(1);
  }
  25% {
    border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
    transform: scale(1.05);
  }
  50% {
    border-radius: 50% 60% 30% 60% / 30% 50% 70% 50%;
    transform: scale(0.95);
  }
  75% {
    border-radius: 40% 60% 60% 40% / 70% 30% 50% 60%;
    transform: scale(1.02);
  }
}

@keyframes blob-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
