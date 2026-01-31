<script setup lang="ts">
const isLoading = ref(true)

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
    <IntroSplash v-if="isLoading" @complete="handleSplashComplete" />

    <div v-show="!isLoading">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>
