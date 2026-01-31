<script setup lang="ts">
useSeoMeta({
  title: 'Billy Maulana | Frontend Developer',
  description: 'Versatile Frontend Developer specializing in Vue.js ecosystem with stunning animations.',
})

const heroRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!heroRef.value)
    return

  const { gsap } = await import('gsap')

  gsap.from(heroRef.value, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out',
  })
})
</script>

<template>
  <div class="page-home">
    <section ref="heroRef" class="flex min-h-screen items-center justify-center">
      <div class="text-center">
        <h1 class="text-6xl font-bold mb-4">
          Welcome
        </h1>
        <p class="text-xl text-gray-400">
          Portfolio content coming soon...
        </p>
      </div>
    </section>
  </div>
</template>
