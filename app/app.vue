<script setup lang="ts">
import { useSmoothScroll } from '~/composables/useSmoothScroll'

const isLoaded = ref(false)
const showContent = ref(false)
const { init: initScroll } = useSmoothScroll()

async function onPreloaderComplete() {
  showContent.value = true
  await nextTick()
  await initScroll()
}

function onPreloaderDone() {
  isLoaded.value = true
  document.body.style.overflow = ''
}

onMounted(() => {
  document.body.style.overflow = 'hidden'

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReducedMotion) {
    isLoaded.value = true
    showContent.value = true
    document.body.style.overflow = ''
    nextTick(async () => {
      await initScroll()
    })
  }
})
</script>

<template>
  <div class="app">
    <!-- Preloader: Text Scramble Assembly -->
    <AppPreloader
      v-if="!isLoaded"
      @complete="onPreloaderComplete"
      @done="onPreloaderDone"
    />

    <!-- Navigation -->
    <AppNavigation v-if="showContent" />

    <!-- Custom Cursor: Typing cursor (2px × 24px blink) -->
    <AppCursor />

    <!-- Main Content -->
    <NuxtLayout>
      <NuxtPage v-if="showContent" />
    </NuxtLayout>
  </div>
</template>

<style scoped>
.app {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
}
</style>
