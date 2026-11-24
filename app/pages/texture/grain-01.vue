<script setup lang="ts">
definePageMeta({
  standalone: true,
  title: 'Grain 01',
})

useSeoMeta({
  title: 'Grain 01',
  robots: 'noindex',
})
</script>

<template>
  <main class="g1">
    <h1 class="g1-title">
      Grain 01
    </h1>
    <div class="g1-grain" aria-hidden="true" />
  </main>
</template>

<style scoped>
.g1 {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 100svh;
  background: #050507;
}

.g1-title {
  position: absolute;
  overflow: hidden;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  clip-path: inset(50%);
  white-space: nowrap;
}

.g1-grain {
  position: absolute;
  z-index: 50;
  inset: 0;
  background: url('/assets/textures/grain-generated-film-1024.png') repeat;
  background-size: 512px;
  mix-blend-mode: screen;
  opacity: 0.08;
  filter: contrast(1.9) brightness(0.62);
  pointer-events: none;
}
</style>
