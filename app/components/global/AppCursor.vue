<script setup lang="ts">
/**
 * Concept 3 Cursor: "Typing Cursor"
 * 2px wide × 24px tall blinking bar.
 * On hover over interactive: stops blinking, shows label.
 * Pure CSS blink + JS lerp position.
 */

const cursorRef = ref<HTMLElement>()
const labelRef = ref<HTMLElement>()
const label = ref('')
const isHovering = ref(false)
const isTouch = ref(false)

let targetX = 0
let targetY = 0
let currentX = 0
let currentY = 0
let labelCurrentX = 0
let labelCurrentY = 0
let animId = 0

const CURSOR_LERP = 0.18
const LABEL_LERP = 0.1

onMounted(() => {
  isTouch.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  if (isTouch.value)
    return

  document.body.style.cursor = 'none'

  window.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseenter', onElementEnter, true)
  document.addEventListener('mouseleave', onElementLeave, true)

  animate()
})

onUnmounted(() => {
  if (isTouch.value)
    return
  document.body.style.cursor = ''
  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseenter', onElementEnter, true)
  document.removeEventListener('mouseleave', onElementLeave, true)
  cancelAnimationFrame(animId)
})

function onMouseMove(e: MouseEvent) {
  targetX = e.clientX
  targetY = e.clientY
}

function onElementEnter(e: Event) {
  const target = e.target as HTMLElement
  if (!target?.closest)
    return

  const interactive = target.closest('a, button, [data-cursor-label]')
  if (interactive) {
    isHovering.value = true
    const cursorLabel = interactive.getAttribute('data-cursor-label')
    if (cursorLabel)
      label.value = cursorLabel
  }
}

function onElementLeave(e: Event) {
  const target = e.target as HTMLElement
  if (!target?.closest)
    return

  const interactive = target.closest('a, button, [data-cursor-label]')
  if (interactive) {
    isHovering.value = false
    label.value = ''
  }
}

function animate() {
  currentX += (targetX - currentX) * CURSOR_LERP
  currentY += (targetY - currentY) * CURSOR_LERP
  labelCurrentX += (targetX - labelCurrentX) * LABEL_LERP
  labelCurrentY += (targetY - labelCurrentY) * LABEL_LERP

  if (cursorRef.value) {
    cursorRef.value.style.transform = `translate(${currentX - 1}px, ${currentY - 12}px)`
  }

  if (labelRef.value) {
    labelRef.value.style.transform = `translate(${labelCurrentX + 16}px, ${labelCurrentY + 16}px)`
  }

  animId = requestAnimationFrame(animate)
}
</script>

<template>
  <div v-if="!isTouch" class="cursor-wrapper" aria-hidden="true">
    <!-- Typing cursor bar -->
    <div
      ref="cursorRef"
      class="typing-cursor"
      :class="{
        'typing-cursor--hover': isHovering,
        'typing-cursor--blink': !isHovering,
      }"
    />

    <!-- Label -->
    <div
      ref="labelRef"
      class="cursor-label"
      :class="{ 'cursor-label--visible': label }"
    >
      {{ label }}
    </div>
  </div>
</template>

<style scoped>
.cursor-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  z-index: var(--z-cursor);
  pointer-events: none;
  mix-blend-mode: difference;
}

/* Typing cursor: 2px × 24px bar */
.typing-cursor {
  position: absolute;
  top: 0;
  left: 0;
  width: 2px;
  height: 24px;
  background: white;
  will-change: transform, opacity;
  transition: height 0.2s var(--ease-expo),
              width 0.2s var(--ease-expo);
}

/* Blink animation — 530ms is standard cursor blink rate */
.typing-cursor--blink {
  animation: cursor-blink 1.06s step-end infinite;
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Hover: stop blinking, expand slightly */
.typing-cursor--hover {
  width: 3px;
  height: 28px;
  animation: none;
  opacity: 1;
}

/* Label */
.cursor-label {
  position: absolute;
  top: 0;
  left: 0;
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: white;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s ease;
  mix-blend-mode: normal;
  will-change: transform;
}

.cursor-label--visible {
  opacity: 1;
}
</style>
