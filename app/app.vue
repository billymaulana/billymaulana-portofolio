<script setup lang="ts">
import { useFaviconPulse } from '~/composables/useFaviconPulse'
import { useSmoothScroll } from '~/composables/useSmoothScroll'

const route = useRoute()
const isStandalone = computed(() => route.meta.standalone === true)

const isLoaded = ref(false)
const showContent = ref(false)
const { init: initScroll } = useSmoothScroll()
useFaviconPulse()

async function onPreloaderComplete() {
  // Hero mounts behind preloader (preloader still visible, fading out)
  showContent.value = true
  await nextTick()
  await initScroll()
}

function onPreloaderDone() {
  // Preloader fully dissolved — remove from DOM, unlock scroll
  isLoaded.value = true
  document.body.style.overflow = ''
}

onMounted(() => {
  if (isStandalone.value) {
    isLoaded.value = true
    showContent.value = true
    return
  }

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
    <!-- Skip to content (a11y) -->
    <a href="#main" class="skip-link">Skip to content</a>

    <!-- Preloader: SVG Logo Stroke Draw + Counter -->
    <AppPreloader
      v-if="!isLoaded && !isStandalone"
      @complete="onPreloaderComplete"
      @done="onPreloaderDone"
    />

    <!-- Navigation -->
    <AppNavigation v-if="showContent && !isStandalone" />

    <!-- Custom Cursor: 3-layer (dot + circle + label) -->
    <AppCursor />

    <!-- Atmospheric overlays -->
    <template v-if="!isStandalone">
      <div class="atmosphere-noise" aria-hidden="true" />
      <div class="atmosphere-vignette" aria-hidden="true" />
    </template>

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
