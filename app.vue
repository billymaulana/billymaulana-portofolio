<script setup>
const { isLoadingScreen } = useWelcomeScreen()
</script>
<template>
  <WelcomeScreen v-if="isLoadingScreen"/>
  <NuxtLayout v-else>
    <NuxtPage :key="'welcomeScreen'"></NuxtPage>
  </NuxtLayout>
</template>
