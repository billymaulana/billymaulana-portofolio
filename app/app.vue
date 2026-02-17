<script setup lang="ts">
useHead({
  htmlAttrs: { lang: 'en' },
})
</script>

<template>
  <div class="app">
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
