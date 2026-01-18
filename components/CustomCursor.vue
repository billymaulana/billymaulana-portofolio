<script setup lang="ts">
const cursorRef = ref<HTMLElement | null>(null)
const followerRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const isHovering = ref(false)

const { x, y } = useMouse()
const isTouchDevice = ref(false)

onMounted(() => {
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  if (isTouchDevice.value)
    return

  isVisible.value = true

  const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]')

  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      isHovering.value = true
    })
    el.addEventListener('mouseleave', () => {
      isHovering.value = false
    })
  })
})

watch([x, y], async ([newX, newY]) => {
  if (!cursorRef.value || !followerRef.value || isTouchDevice.value)
    return

  const { gsap } = await import('gsap')

  gsap.to(cursorRef.value, {
    x: newX,
    y: newY,
    duration: 0.1,
    ease: 'power2.out',
  })

  gsap.to(followerRef.value, {
    x: newX,
    y: newY,
    duration: 0.3,
    ease: 'power2.out',
  })
})
</script>

<template>
  <div v-if="!isTouchDevice">
    <div
      ref="cursorRef"
      class="cursor"
      :class="{ 'cursor-hover': isHovering }"
      :style="{ opacity: isVisible ? 1 : 0 }"
    />
    <div
      ref="followerRef"
      class="cursor-follower"
      :class="{ 'cursor-hover': isHovering }"
      :style="{ opacity: isVisible ? 1 : 0 }"
    />
  </div>
</template>

<style scoped>
.cursor {
  position: fixed;
  width: 20px;
  height: 20px;
  border: 2px solid #CDFF00;
  border-radius: 50%;
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
  transition: width 0.2s ease, height 0.2s ease, border-color 0.2s ease;
  mix-blend-mode: difference;
}

.cursor-follower {
  position: fixed;
  width: 40px;
  height: 40px;
  background-color: rgba(205, 255, 0, 0.1);
  border-radius: 50%;
  pointer-events: none;
  z-index: 99998;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease, height 0.3s ease, background-color 0.3s ease;
}

.cursor.cursor-hover {
  width: 50px;
  height: 50px;
  border-color: #FF3366;
  background-color: rgba(255, 51, 102, 0.1);
}

.cursor-follower.cursor-hover {
  width: 80px;
  height: 80px;
  background-color: rgba(255, 51, 102, 0.05);
}
</style>
