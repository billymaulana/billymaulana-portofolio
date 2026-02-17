<script setup lang="ts">
const cursor = ref<HTMLElement>()
const follower = ref<HTMLElement>()
const isVisible = ref(false)
const isHovering = ref(false)
const cursorLabel = ref('')
const isTouch = ref(false)

const mouse = reactive({ x: 0, y: 0 })
const pos = reactive({ x: 0, y: 0 })
const followerPos = reactive({ x: 0, y: 0 })

onMounted(() => {
  isTouch.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  if (isTouch.value)
    return

  const lerp = (a: number, b: number, n: number) => a + (b - a) * n

  function onMouseMove(e: MouseEvent) {
    mouse.x = e.clientX
    mouse.y = e.clientY
    if (!isVisible.value)
      isVisible.value = true
  }

  function animate() {
    pos.x = lerp(pos.x, mouse.x, 0.15)
    pos.y = lerp(pos.y, mouse.y, 0.15)
    followerPos.x = lerp(followerPos.x, mouse.x, 0.08)
    followerPos.y = lerp(followerPos.y, mouse.y, 0.08)

    if (cursor.value) {
      cursor.value.style.transform = `translate(${pos.x}px, ${pos.y}px)`
    }
    if (follower.value) {
      follower.value.style.transform = `translate(${followerPos.x}px, ${followerPos.y}px) scale(${isHovering.value ? 2.5 : 1})`
    }

    requestAnimationFrame(animate)
  }

  function onMouseEnterInteractive(e: Event) {
    isHovering.value = true
    const target = e.target as HTMLElement
    cursorLabel.value = target.dataset.cursorLabel || ''
  }

  function onMouseLeaveInteractive() {
    isHovering.value = false
    cursorLabel.value = ''
  }

  window.addEventListener('mousemove', onMouseMove)
  requestAnimationFrame(animate)

  // Observe interactive elements
  const observer = new MutationObserver(() => {
    document.querySelectorAll('a, button, [data-cursor], [role="button"]').forEach((el) => {
      el.removeEventListener('mouseenter', onMouseEnterInteractive)
      el.removeEventListener('mouseleave', onMouseLeaveInteractive)
      el.addEventListener('mouseenter', onMouseEnterInteractive)
      el.addEventListener('mouseleave', onMouseLeaveInteractive)
    })
  })

  observer.observe(document.body, { childList: true, subtree: true })

  // Initial bind
  document.querySelectorAll('a, button, [data-cursor], [role="button"]').forEach((el) => {
    el.addEventListener('mouseenter', onMouseEnterInteractive)
    el.addEventListener('mouseleave', onMouseLeaveInteractive)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    observer.disconnect()
  })
})
</script>

<template>
  <div v-if="!isTouch" class="cursor-wrapper" :class="{ visible: isVisible }">
    <div ref="cursor" class="cursor-dot" />
    <div ref="follower" class="cursor-follower" :class="{ hovering: isHovering }">
      <span v-if="cursorLabel" class="cursor-label">{{ cursorLabel }}</span>
    </div>
  </div>
</template>

<style scoped>
.cursor-wrapper {
  position: fixed;
  inset: 0;
  z-index: var(--z-cursor);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s;
  mix-blend-mode: difference;
}

.cursor-wrapper.visible {
  opacity: 1;
}

.cursor-dot {
  position: fixed;
  top: -4px;
  left: -4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  will-change: transform;
}

.cursor-follower {
  position: fixed;
  top: -20px;
  left: -20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.5);
  will-change: transform;
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    height 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    border-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cursor-follower.hovering {
  border-color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
}

.cursor-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #fff;
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.2s;
}

@media (hover: none) {
  .cursor-wrapper {
    display: none;
  }
}
</style>
