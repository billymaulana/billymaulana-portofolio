<script setup lang="ts">
import { useSmoothScroll } from '~/composables/useSmoothScroll'

const { setupAnchorLinks } = useSmoothScroll()

onMounted(() => {
  setupAnchorLinks()
})
</script>

<template>
  <div class="app-layout">
    <!-- Custom Cursor -->
    <ClientOnly>
      <BaseCustomCursor />
    </ClientOnly>

    <!-- Header -->
    <LayoutTheHeader />

    <!-- Main Content -->
    <main>
      <slot />
    </main>
  </div>
</template>

<style>
.app-layout {
  min-height: 100vh;
  background: #000;
  color: #fff;
  cursor: none;
}

/* Hide default cursor on desktop */
@media (hover: hover) and (pointer: fine) {
  .app-layout,
  .app-layout * {
    cursor: none !important;
  }
}

/* Show cursor on touch devices */
@media (hover: none) and (pointer: coarse) {
  .app-layout,
  .app-layout * {
    cursor: auto !important;
  }
}

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}

/* Selection color - Acid Lime accent */
::selection {
  background: #7C3AED;
  color: #000;
}
</style>
