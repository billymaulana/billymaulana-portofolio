<script setup lang="ts">
/**
 * AppCursor — 3-state hologram cursor with inertia
 *
 * 3 layers:
 * - Inner dot (6px, white, instant position)
 * - Outer ring (40px, 1px border, lerp 0.15 inertia)
 * - Label (text on hover states)
 *
 * States:
 * - Default: dot + ring
 * - Hover link/button: ring expands 64px, label shows
 * - Hover text: ring shrinks 24px
 * - Hidden: on input/textarea focus, cursor hides
 *
 * mix-blend-mode: difference on entire container
 * Hidden on touch devices
 */

type CursorState = 'default' | 'hover' | 'text' | 'hidden'

const dotRef = ref<HTMLElement>()
const ringRef = ref<HTMLElement>()
const labelRef = ref<HTMLElement>()

const cursorState = ref<CursorState>('default')
const labelText = ref('')
const isVisible = ref(false)
const isTouch = ref(false)

// Position tracking
let targetX = 0
let targetY = 0
let dotX = 0
let dotY = 0
let ringX = 0
let ringY = 0
let animId = 0

const RING_LERP = 0.15

// ─── Ring sizes per state ───
const RING_SIZES: Record<CursorState, number> = {
  default: 40,
  hover: 64,
  text: 24,
  hidden: 0,
}

// ─── Label text mapping ───
const CURSOR_LABELS: Record<string, string> = {
  view: 'VIEW',
  open: 'OPEN',
  link: 'VIEW',
  drag: 'DRAG',
  play: 'PLAY',
  close: 'CLOSE',
}

// ─── Mouse tracking ───

function onMouseMove(e: MouseEvent) {
  targetX = e.clientX
  targetY = e.clientY

  if (!isVisible.value) {
    isVisible.value = true
    // Jump to position instantly on first move
    dotX = targetX
    dotY = targetY
    ringX = targetX
    ringY = targetY
  }
}

function onViewportEnter() {
  isVisible.value = true
}

function onViewportLeave() {
  isVisible.value = false
}

// ─── State detection via event delegation ───

function detectCursorState(target: HTMLElement): { state: CursorState, label: string } {
  // Check for explicit data-cursor attribute first
  const cursorEl = target.closest('[data-cursor]') as HTMLElement | null
  if (cursorEl) {
    const cursorType = cursorEl.getAttribute('data-cursor') || ''
    if (cursorType === 'hide')
      return { state: 'hidden', label: '' }
    if (cursorType === 'text')
      return { state: 'text', label: '' }
    return { state: 'hover', label: CURSOR_LABELS[cursorType] || '' }
  }

  // Check for data-cursor-label (legacy attribute from existing components)
  const labelEl = target.closest('[data-cursor-label]') as HTMLElement | null
  if (labelEl) {
    const cursorLabel = labelEl.getAttribute('data-cursor-label') || ''
    return { state: 'hover', label: cursorLabel }
  }

  // Check for interactive elements (a, button)
  const interactive = target.closest('a, button') as HTMLElement | null
  if (interactive) {
    return { state: 'hover', label: '' }
  }

  // Check for text inputs — hide cursor
  const input = target.closest('input, textarea, select') as HTMLElement | null
  if (input) {
    return { state: 'hidden', label: '' }
  }

  return { state: 'default', label: '' }
}

function onElementEnter(e: Event) {
  const target = e.target as HTMLElement
  if (!target?.closest)
    return

  const { state, label } = detectCursorState(target)
  cursorState.value = state
  labelText.value = label
}

function onElementLeave(e: Event) {
  const target = e.target as HTMLElement
  if (!target?.closest)
    return

  const interactive = target.closest('a, button, [data-cursor], [data-cursor-label], input, textarea, select')
  if (interactive) {
    cursorState.value = 'default'
    labelText.value = ''
  }
}

// ─── Animation loop ───

function animate() {
  // Inner dot: direct follow (no lerp, instant)
  dotX = targetX
  dotY = targetY

  // Outer ring: lerp for inertia feel
  ringX += (targetX - ringX) * RING_LERP
  ringY += (targetY - ringY) * RING_LERP

  // Apply transforms
  if (dotRef.value) {
    dotRef.value.style.transform = `translate(${dotX - 3}px, ${dotY - 3}px)`
  }

  if (ringRef.value) {
    const size = RING_SIZES[cursorState.value]
    const offset = size / 2
    ringRef.value.style.transform = `translate(${ringX - offset}px, ${ringY - offset}px)`
  }

  if (labelRef.value) {
    labelRef.value.style.transform = `translate(${ringX + 24}px, ${ringY + 24}px)`
  }

  animId = requestAnimationFrame(animate)
}

// ─── Lifecycle ───

onMounted(() => {
  isTouch.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  if (isTouch.value)
    return

  window.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseenter', onElementEnter, true)
  document.addEventListener('mouseleave', onElementLeave, true)
  document.documentElement.addEventListener('mouseenter', onViewportEnter)
  document.documentElement.addEventListener('mouseleave', onViewportLeave)

  animate()
})

onUnmounted(() => {
  if (isTouch.value)
    return

  window.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseenter', onElementEnter, true)
  document.removeEventListener('mouseleave', onElementLeave, true)
  document.documentElement.removeEventListener('mouseenter', onViewportEnter)
  document.documentElement.removeEventListener('mouseleave', onViewportLeave)
  cancelAnimationFrame(animId)
})
</script>

<template>
  <div
    v-if="!isTouch"
    class="cursor"
    :class="{
      'cursor--hidden': !isVisible || cursorState === 'hidden',
    }"
    aria-hidden="true"
  >
    <!-- Layer 1: Inner dot — 6px, instant position -->
    <div
      ref="dotRef"
      class="cursor__dot"
      :class="{
        'cursor__dot--hover': cursorState === 'hover',
        'cursor__dot--text': cursorState === 'text',
      }"
    />

    <!-- Layer 2: Outer ring — 40px default, lerp inertia -->
    <div
      ref="ringRef"
      class="cursor__ring"
      :class="{
        'cursor__ring--hover': cursorState === 'hover',
        'cursor__ring--text': cursorState === 'text',
      }"
    />

    <!-- Layer 3: Label — appears on hover states -->
    <div
      ref="labelRef"
      class="cursor__label"
      :class="{ 'cursor__label--visible': labelText }"
    >
      {{ labelText }}
    </div>
  </div>
</template>

<style scoped>
/* ═══ Hide default cursor globally (scoped to this component's existence) ═══ */
:global(*) {
  cursor: none;
}

/* ═══ Cursor Container ═══ */
.cursor {
  position: fixed;
  top: 0;
  left: 0;
  z-index: var(--z-cursor);
  pointer-events: none;
  mix-blend-mode: difference;
  transition: opacity 0.3s var(--ease-out-expo);
}

.cursor--hidden {
  opacity: 0;
}

/* ═══ Layer 1: Inner Dot — 6px circle ═══ */
.cursor__dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: white;
  will-change: transform;
  transition:
    width var(--duration-fast) var(--ease-out-expo),
    height var(--duration-fast) var(--ease-out-expo),
    opacity var(--duration-fast) var(--ease-out-expo);
}

.cursor__dot--hover {
  width: 4px;
  height: 4px;
  opacity: 0.6;
}

.cursor__dot--text {
  width: 2px;
  height: 2px;
  opacity: 0.4;
}

/* ═══ Layer 2: Outer Ring — 40px default ═══ */
.cursor__ring {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.4);
  will-change: transform;
  transition:
    width 0.4s var(--ease-out-expo),
    height 0.4s var(--ease-out-expo),
    border-color var(--duration-fast) var(--ease-out-expo),
    border-width var(--duration-fast) var(--ease-out-expo);
}

.cursor__ring--hover {
  width: 64px;
  height: 64px;
  border-color: rgba(255, 255, 255, 0.6);
}

.cursor__ring--text {
  width: 24px;
  height: 24px;
  border-color: rgba(255, 255, 255, 0.2);
}

/* ═══ Layer 3: Label ═══ */
.cursor__label {
  position: absolute;
  top: 0;
  left: 0;
  font-family: var(--font-mono);
  font-size: 0.5625rem;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: white;
  white-space: nowrap;
  opacity: 0;
  will-change: transform;
  transition: opacity 0.25s var(--ease-out-expo);
}

.cursor__label--visible {
  opacity: 1;
}

/* ═══ Reduced Motion ═══ */
@media (prefers-reduced-motion: reduce) {
  .cursor__dot,
  .cursor__ring,
  .cursor__label {
    transition: none;
  }
}
</style>
