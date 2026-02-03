<script setup lang="ts">
interface Props {
  target: number
  duration?: number
  suffix?: string
  prefix?: string
  decimals?: number
}

const props = withDefaults(defineProps<Props>(), {
  duration: 2000,
  suffix: '',
  prefix: '',
  decimals: 0,
})

const counterRef = ref<HTMLElement | null>(null)
const currentValue = ref(0)
const hasAnimated = ref(false)

function animateCounter() {
  if (hasAnimated.value)
    return
  hasAnimated.value = true

  const startTime = performance.now()
  const startValue = 0

  function update(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / props.duration, 1)

    // Ease out cubic
    const easeProgress = 1 - (1 - progress) ** 3

    currentValue.value = startValue + (props.target - startValue) * easeProgress

    if (progress < 1) {
      requestAnimationFrame(update)
    }
    else {
      currentValue.value = props.target
    }
  }

  requestAnimationFrame(update)
}

const displayValue = computed(() => {
  const value = currentValue.value.toFixed(props.decimals)
  return `${props.prefix}${value}${props.suffix}`
})

onMounted(async () => {
  // Dynamically import GSAP for ScrollTrigger
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  if (counterRef.value) {
    ScrollTrigger.create({
      trigger: counterRef.value,
      start: 'top 80%',
      onEnter: animateCounter,
      once: true,
    })
  }
})
</script>

<template>
  <span ref="counterRef" class="counter-animation">
    {{ displayValue }}
  </span>
</template>

<style scoped>
.counter-animation {
  font-variant-numeric: tabular-nums;
}
</style>
