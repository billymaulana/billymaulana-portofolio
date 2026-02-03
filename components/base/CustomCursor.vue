<script setup lang="ts">
const cursorDotRef = ref<HTMLElement | null>(null)
const cursorRingRef = ref<HTMLElement | null>(null)

const state = reactive({
  x: 0,
  y: 0,
  dotX: 0,
  dotY: 0,
  ringX: 0,
  ringY: 0,
  isVisible: false,
  isHovering: false,
  isPointer: false,
  isPressed: false,
  label: '',
  mode: 'default' as 'default' | 'view' | 'drag' | 'link' | 'text',
  velocity: { x: 0, y: 0 },
})

let rafId: number | null = null
let prevX = 0
let prevY = 0

function lerp(start: number, end: number, factor: number) {
  return start + (end - start) * factor
}

function animate() {
  // Smooth follow for dot (fast)
  state.dotX = lerp(state.dotX, state.x, 0.35)
  state.dotY = lerp(state.dotY, state.y, 0.35)

  // Smooth follow for ring (slower, creates trail effect)
  state.ringX = lerp(state.ringX, state.x, 0.15)
  state.ringY = lerp(state.ringY, state.y, 0.15)

  // Calculate velocity for skew effect
  state.velocity.x = state.x - prevX
  state.velocity.y = state.y - prevY
  prevX = state.x
  prevY = state.y

  rafId = requestAnimationFrame(animate)
}

function onMouseMove(e: MouseEvent) {
  state.x = e.clientX
  state.y = e.clientY
  state.isVisible = true
}

function onMouseLeave() {
  state.isVisible = false
}

function onMouseDown() {
  state.isPressed = true
}

function onMouseUp() {
  state.isPressed = false
}

function setupInteractiveElements() {
  // Links and buttons
  document.querySelectorAll('a, button, [data-cursor]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      state.isHovering = true
      const label = el.getAttribute('data-cursor-label')
      const mode = el.getAttribute('data-cursor-mode') as typeof state.mode
      if (label)
        state.label = label
      if (mode)
        state.mode = mode
      else if (el.tagName === 'A' || el.tagName === 'BUTTON')
        state.mode = 'link'
    })

    el.addEventListener('mouseleave', () => {
      state.isHovering = false
      state.label = ''
      state.mode = 'default'
    })
  })

  // Text elements for text cursor
  document.querySelectorAll('[data-cursor-text]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      state.isHovering = true
      state.mode = 'text'
      state.label = el.getAttribute('data-cursor-text') || ''
    })

    el.addEventListener('mouseleave', () => {
      state.isHovering = false
      state.mode = 'default'
      state.label = ''
    })
  })
}

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseleave', onMouseLeave)
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)

  animate()

  // Setup after DOM ready
  setTimeout(setupInteractiveElements, 200)

  // Re-setup on route change
  const nuxtApp = useNuxtApp()
  nuxtApp.hook('page:finish', () => {
    setTimeout(setupInteractiveElements, 200)
  })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseleave', onMouseLeave)
  window.removeEventListener('mousedown', onMouseDown)
  window.removeEventListener('mouseup', onMouseUp)
  if (rafId)
    cancelAnimationFrame(rafId)
})

const skewX = computed(() => Math.min(Math.max(state.velocity.x * 0.5, -15), 15))
const skewY = computed(() => Math.min(Math.max(state.velocity.y * 0.5, -15), 15))
</script>

<template>
  <Teleport to="body">
    <!-- Main cursor ring -->
    <div
      ref="cursorRingRef"
      class="cursor-ring"
      :class="{
        'is-visible': state.isVisible,
        'is-hovering': state.isHovering,
        'is-pressed': state.isPressed,
        [`mode-${state.mode}`]: true,
      }"
      :style="{
        transform: `translate(${state.ringX}px, ${state.ringY}px) skew(${skewX}deg, ${skewY}deg)`,
      }"
    >
      <span v-if="state.label" class="cursor-label">{{ state.label }}</span>
    </div>

    <!-- Cursor dot -->
    <div
      ref="cursorDotRef"
      class="cursor-dot"
      :class="{
        'is-visible': state.isVisible,
        'is-hovering': state.isHovering,
        'is-pressed': state.isPressed,
      }"
      :style="{
        transform: `translate(${state.dotX}px, ${state.dotY}px)`,
      }"
    />
  </Teleport>
</template>

<style scoped>
.cursor-ring,
.cursor-dot {
  position: fixed;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cursor-ring.is-visible,
.cursor-dot.is-visible {
  opacity: 1;
}

/* Cursor Dot - Acid Lime accent */
.cursor-dot {
  width: 8px;
  height: 8px;
  margin: -4px 0 0 -4px;
  background: #7C3AED;
  border-radius: 50%;
  transition: width 0.2s ease, height 0.2s ease, margin 0.2s ease, background 0.2s ease;
  z-index: 10000;
}

.cursor-dot.is-hovering {
  width: 4px;
  height: 4px;
  margin: -2px 0 0 -2px;
}

.cursor-dot.is-pressed {
  transform: scale(0.5);
}

/* Cursor Ring - Monochrome */
.cursor-ring {
  width: 40px;
  height: 40px;
  margin: -20px 0 0 -20px;
  border: 1px solid #333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.4s cubic-bezier(0.19, 1, 0.22, 1),
              height 0.4s cubic-bezier(0.19, 1, 0.22, 1),
              margin 0.4s cubic-bezier(0.19, 1, 0.22, 1),
              border-color 0.3s ease,
              background 0.3s ease,
              border-radius 0.3s ease;
}

/* Hover state - expand with lime accent */
.cursor-ring.is-hovering {
  width: 80px;
  height: 80px;
  margin: -40px 0 0 -40px;
  background: rgba(124, 58, 237, 0.05);
  border-color: #7C3AED;
}

.cursor-ring.is-pressed {
  transform: scale(0.9);
}

/* Mode: Link - subtle gray expansion */
.cursor-ring.mode-link.is-hovering {
  width: 60px;
  height: 60px;
  margin: -30px 0 0 -30px;
  background: rgba(255, 255, 255, 0.03);
  border-color: #555;
}

/* Mode: View - larger lime ring */
.cursor-ring.mode-view.is-hovering {
  width: 100px;
  height: 100px;
  margin: -50px 0 0 -50px;
  background: rgba(124, 58, 237, 0.08);
  border-color: #7C3AED;
}

/* Mode: Drag - square shape */
.cursor-ring.mode-drag.is-hovering {
  width: 70px;
  height: 70px;
  margin: -35px 0 0 -35px;
  background: rgba(255, 255, 255, 0.03);
  border-color: #555;
  border-radius: 8px;
}

/* Mode: Text - pill shape with lime bg */
.cursor-ring.mode-text.is-hovering {
  width: auto;
  height: auto;
  padding: 12px 24px;
  margin: -25px 0 0 -50px;
  background: #7C3AED;
  border-color: #7C3AED;
  border-radius: 100px;
}

/* Label */
.cursor-label {
  font-family: 'Satoshi', sans-serif;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: white;
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cursor-ring.is-hovering .cursor-label {
  opacity: 1;
}

.cursor-ring.mode-text .cursor-label {
  color: #000;
}

/* Hide on touch devices */
@media (hover: none) and (pointer: coarse) {
  .cursor-ring,
  .cursor-dot {
    display: none !important;
  }
}
</style>
