<script setup lang="ts">
const cursorRef = ref<HTMLElement | null>(null)
const followerRef = ref<HTMLElement | null>(null)
const trailRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const isHovering = ref(false)
const isClicking = ref(false)
const cursorText = ref('')

const { x, y } = useMouse()
const isTouchDevice = ref(false)

// Trail effect positions
const trailPositions = ref<Array<{ x: number; y: number }>>([])
const maxTrailLength = 8

onMounted(() => {
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  if (isTouchDevice.value)
    return

  isVisible.value = true

  // Add event listeners for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, [data-cursor-hover]')
  const textElements = document.querySelectorAll('[data-cursor-text]')

  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      isHovering.value = true
    })
    el.addEventListener('mouseleave', () => {
      isHovering.value = false
      cursorText.value = ''
    })
  })

  textElements.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorText.value = el.getAttribute('data-cursor-text') || ''
    })
    el.addEventListener('mouseleave', () => {
      cursorText.value = ''
    })
  })

  // Click effect
  document.addEventListener('mousedown', () => {
    isClicking.value = true
  })
  document.addEventListener('mouseup', () => {
    isClicking.value = false
  })
})

watch([x, y], async ([newX, newY]) => {
  if (!cursorRef.value || !followerRef.value || isTouchDevice.value)
    return

  // Update trail positions
  trailPositions.value.unshift({ x: newX, y: newY })
  if (trailPositions.value.length > maxTrailLength) {
    trailPositions.value.pop()
  }

  const { gsap } = await import('gsap')

  // Cursor follows immediately
  gsap.to(cursorRef.value, {
    x: newX,
    y: newY,
    duration: 0.1,
    ease: 'power2.out',
  })

  // Follower has slight delay
  gsap.to(followerRef.value, {
    x: newX,
    y: newY,
    duration: 0.4,
    ease: 'power3.out',
  })
})
</script>

<template>
  <div v-if="!isTouchDevice" class="cursor-wrapper">
    <!-- Trail effect -->
    <div
      v-for="(pos, index) in trailPositions"
      :key="index"
      class="cursor-trail"
      :style="{
        left: `${pos.x}px`,
        top: `${pos.y}px`,
        opacity: 1 - (index / maxTrailLength),
        transform: `translate(-50%, -50%) scale(${1 - (index / maxTrailLength) * 0.5})`,
      }"
    />

    <!-- Main cursor dot -->
    <div
      ref="cursorRef"
      class="cursor"
      :class="{
        'cursor-hover': isHovering,
        'cursor-click': isClicking,
      }"
      :style="{ opacity: isVisible ? 1 : 0 }"
    />

    <!-- Cursor follower ring -->
    <div
      ref="followerRef"
      class="cursor-follower"
      :class="{
        'cursor-hover': isHovering,
        'cursor-click': isClicking,
        'cursor-text-visible': cursorText,
      }"
      :style="{ opacity: isVisible ? 1 : 0 }"
    >
      <!-- Text inside cursor -->
      <span v-if="cursorText" class="cursor-label">
        {{ cursorText }}
      </span>
    </div>

    <!-- RGB glitch effect on hover -->
    <div
      v-if="isHovering"
      class="cursor-glitch-red"
      :style="{
        left: `${x - 2}px`,
        top: `${y}px`,
      }"
    />
    <div
      v-if="isHovering"
      class="cursor-glitch-cyan"
      :style="{
        left: `${x + 2}px`,
        top: `${y}px`,
      }"
    />
  </div>
</template>

<style scoped>
.cursor-wrapper {
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 99999;
}

.cursor {
  position: fixed;
  width: 12px;
  height: 12px;
  background: #A855F7;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: width 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              height 0.2s cubic-bezier(0.16, 1, 0.3, 1),
              background 0.2s ease;
  mix-blend-mode: difference;
  z-index: 99999;
}

.cursor.cursor-hover {
  width: 8px;
  height: 8px;
  background: #FF2D92;
}

.cursor.cursor-click {
  transform: translate(-50%, -50%) scale(0.8);
}

.cursor-follower {
  position: fixed;
  width: 40px;
  height: 40px;
  border: 1px solid #A855F7;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              height 0.4s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.3s ease,
              background 0.3s ease;
  z-index: 99998;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cursor-follower.cursor-hover {
  width: 80px;
  height: 80px;
  border-color: #FF2D92;
  background: rgba(255, 45, 146, 0.05);
}

.cursor-follower.cursor-click {
  transform: translate(-50%, -50%) scale(0.9);
  border-width: 2px;
}

.cursor-follower.cursor-text-visible {
  width: 120px;
  height: 120px;
  background: rgba(168, 85, 247, 0.1);
  border-color: #A855F7;
}

.cursor-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #A855F7;
  white-space: nowrap;
}

.cursor-trail {
  position: fixed;
  width: 6px;
  height: 6px;
  background: #A855F7;
  border-radius: 50%;
  pointer-events: none;
  transition: opacity 0.1s ease;
  z-index: 99997;
}

.cursor-glitch-red,
.cursor-glitch-cyan {
  position: fixed;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 99996;
  opacity: 0.5;
}

.cursor-glitch-red {
  background: #FF0040;
  animation: glitch-cursor 0.15s steps(2) infinite;
}

.cursor-glitch-cyan {
  background: #00FFFF;
  animation: glitch-cursor 0.15s steps(2) infinite reverse;
}

@keyframes glitch-cursor {
  0%, 100% { transform: translate(-50%, -50%) translate(0, 0); }
  50% { transform: translate(-50%, -50%) translate(2px, -1px); }
}

/* Hide on touch devices */
@media (hover: none) and (pointer: coarse) {
  .cursor-wrapper {
    display: none !important;
  }
}
</style>
