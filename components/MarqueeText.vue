<script setup lang="ts">
interface Props {
  text: string
  speed?: number
  reverse?: boolean
  separator?: string
}

const props = withDefaults(defineProps<Props>(), {
  speed: 30,
  reverse: false,
  separator: ' — ',
})

const marqueeRef = ref<HTMLElement | null>(null)

const repeatedText = computed(() => {
  const items = []
  for (let i = 0; i < 10; i++) {
    items.push(props.text)
  }
  return items
})

onMounted(async () => {
  if (!marqueeRef.value)
    return

  const { gsap } = await import('gsap')

  const content = marqueeRef.value.querySelector('.marquee-content')
  if (!content)
    return

  const totalWidth = content.scrollWidth / 2

  gsap.to(content, {
    x: props.reverse ? totalWidth : -totalWidth,
    duration: props.speed,
    repeat: -1,
    ease: 'none',
    modifiers: {
      x: gsap.utils.unitize((x) => {
        const val = Number.parseFloat(x)
        if (props.reverse) {
          return val > totalWidth ? val - totalWidth : val
        }
        return val < -totalWidth ? val + totalWidth : val
      }),
    },
  })
})
</script>

<template>
  <div
    ref="marqueeRef"
    class="marquee-wrapper overflow-hidden py-6 border-y-3 border-text/10"
  >
    <div class="marquee-content flex whitespace-nowrap">
      <span
        v-for="(item, index) in repeatedText"
        :key="index"
        class="text-fluid-4xl font-accent uppercase text-text/10 hover:text-primary/30 transition-colors duration-500 mx-4"
      >
        {{ item }}{{ separator }}
      </span>
    </div>
  </div>
</template>
