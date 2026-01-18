<script setup lang="ts">
const isLoading = ref(true)

function handleLoadingComplete() {
  isLoading.value = false
}

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')

  gsap.registerPlugin(ScrollTrigger)

  if (typeof window !== 'undefined') {
    const Lenis = (await import('lenis')).default

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)
  }
})
</script>

<template>
  <div class="app-container">
    <LoadingScreen v-if="isLoading" @complete="handleLoadingComplete" />
    <template v-else>
      <CustomCursor />
      <Navigation />
      <main>
        <NuxtPage />
      </main>
      <div class="noise-bg" />
    </template>
  </div>
</template>
