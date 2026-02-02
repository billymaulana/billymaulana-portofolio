<script setup lang="ts">
const isLoading = ref(true)
const splashKey = ref(0)

// Reset splash on HMR
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    isLoading.value = true
    splashKey.value++
  })
}

function handleSplashComplete() {
  isLoading.value = false
}

useHead({
  htmlAttrs: { lang: 'en' },
  bodyAttrs: { class: 'bg-black' },
})
</script>

<template>
  <div class="app">
    <IntroSplash v-if="isLoading" :key="splashKey" @complete="handleSplashComplete" />

    <div v-show="!isLoading">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>
