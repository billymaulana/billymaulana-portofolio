<script setup lang="ts">
const props = withDefaults(defineProps<{
  tag?: string
  strength?: number
}>(), {
  tag: 'button',
  strength: 0.3,
})

const el = ref<HTMLElement>()
const position = reactive({ x: 0, y: 0 })
let rafId = 0

function onMouseMove(e: MouseEvent) {
  if (!el.value)
    return
  const rect = el.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const distX = (e.clientX - centerX) * props.strength
  const distY = (e.clientY - centerY) * props.strength

  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => {
    position.x = distX
    position.y = distY
  })
}

function onMouseLeave() {
  cancelAnimationFrame(rafId)
  position.x = 0
  position.y = 0
}

const style = computed(() => ({
  transform: `translate(${position.x}px, ${position.y}px)`,
  transition: position.x === 0 && position.y === 0 ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
}))
</script>

<template>
  <component
    :is="props.tag"
    ref="el"
    :style="style"
    class="magnetic-btn"
    @mousemove="onMouseMove"
    @mouseleave="onMouseLeave"
  >
    <slot />
  </component>
</template>

<style scoped>
.magnetic-btn {
  display: inline-flex;
  will-change: transform;
}
</style>
