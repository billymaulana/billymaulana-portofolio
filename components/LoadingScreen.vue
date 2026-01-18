<script setup lang="ts">
const emit = defineEmits<{
  complete: []
}>()

const containerRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const counterRef = ref<HTMLElement | null>(null)
const progress = ref(0)

onMounted(async () => {
  const { gsap } = await import('gsap')

  const tl = gsap.timeline({
    onComplete: () => {
      emit('complete')
    },
  })

  tl.to(progress, {
    value: 100,
    duration: 2,
    ease: 'power2.inOut',
    onUpdate: () => {
      if (progressRef.value) {
        progressRef.value.style.width = `${progress.value}%`
      }
    },
  })
    .to(textRef.value, {
      opacity: 0,
      y: -30,
      duration: 0.5,
      ease: 'power2.in',
    }, '-=0.3')
    .to(containerRef.value, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power4.inOut',
    })
})
</script>

<template>
  <div
    ref="containerRef"
    class="fixed inset-0 z-[100] bg-surface flex flex-col items-center justify-center"
  >
    <div ref="textRef" class="text-center">
      <Logo :size="80" class="mb-8" />
      <h1 class="font-accent text-3xl md:text-5xl mb-2">
        BILLY MAULANA
      </h1>
      <p class="font-mono text-sm text-text-muted uppercase tracking-widest">
        Frontend Developer
      </p>

      <div class="mt-12 w-64 md:w-80">
        <div class="h-1 bg-surface-light relative overflow-hidden">
          <div
            ref="progressRef"
            class="h-full bg-gradient-to-r from-primary via-secondary to-accent"
            style="width: 0%"
          />
        </div>
        <p ref="counterRef" class="font-mono text-xs text-text-muted mt-2">
          {{ Math.round(progress) }}%
        </p>
      </div>
    </div>
  </div>
</template>
