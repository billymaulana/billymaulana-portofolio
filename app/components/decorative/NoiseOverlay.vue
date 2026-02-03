<script setup lang="ts">
interface Props {
  opacity?: number
  blend?: 'overlay' | 'multiply' | 'screen' | 'soft-light' | 'normal'
}

const props = withDefaults(defineProps<Props>(), {
  opacity: 0.03,
  blend: 'overlay',
})
</script>

<template>
  <div
    class="noise-overlay"
    :style="{
      'opacity': props.opacity,
      '--blend-mode': props.blend,
    } as any"
  />
</template>

<style scoped>
.noise-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: var(--blend-mode);
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-repeat: repeat;
}
</style>
