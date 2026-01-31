<script setup lang="ts">
const boxRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  if (!boxRef.value)
    return

  const { gsap } = await import('gsap')

  gsap.from(boxRef.value, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
  })
})
</script>

<template>
  <div class="container py-20">
    <div ref="boxRef" class="text-center">
      <h1 class="mb-4 text-4xl font-bold">
        Nuxt Boilerplate
      </h1>
      <p class="mb-8 text-lg text-gray-600 dark:text-gray-400">
        A minimal starter with UnoCSS, GSAP, Pinia, and more.
      </p>

      <div class="flex justify-center gap-4">
        <button class="btn-primary">
          Get Started
        </button>
        <button class="btn-outline">
          Learn More
        </button>
      </div>
    </div>
  </div>
</template>
