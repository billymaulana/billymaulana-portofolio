<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'en' },
})

const isPreloaderComplete = ref(false)

function handlePreloaderComplete() {
  isPreloaderComplete.value = true
}

provide('preloaderComplete', readonly(isPreloaderComplete))
</script>

<template>
  <div class="app">
    <AppPreloader @complete="handlePreloaderComplete" />
    <AppNavigation />
    <AppCursor />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--color-bg);
}
</style>
