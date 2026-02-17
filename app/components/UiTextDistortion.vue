<script setup lang="ts">
const props = defineProps<{
  lines: { text: string, indent: number }[]
  startDelay?: number
}>()

const canvasRef = ref<HTMLCanvasElement>()
const isReady = ref(false)
const isGlitching = ref(false)
let distortionInstance: ReturnType<typeof import('~/composables/useTextDistortion').useTextDistortion> | null = null
let glitchTimeoutId: ReturnType<typeof setTimeout> | null = null
let resizeHandler: (() => void) | null = null

function computeFontSize(): number {
  const styles = getComputedStyle(document.documentElement)
  const displaySize = styles.getPropertyValue('--text-display').trim()
  const clampMatch = displaySize.match(/clamp\(\s*([\d.]+)rem\s*,\s*([\d.]+)vw\s*,\s*([\d.]+)rem\s*\)/)
  if (clampMatch) {
    const rootFs = Number.parseFloat(styles.fontSize) || 16
    const minPx = Number.parseFloat(clampMatch[1]!) * rootFs
    const vwPx = (Number.parseFloat(clampMatch[2]!) / 100) * window.innerWidth
    const maxPx = Number.parseFloat(clampMatch[3]!) * rootFs
    return Math.min(Math.max(minPx, Math.min(vwPx, maxPx)), 300)
  }
  const vwMatch = displaySize.match(/([\d.]+)vw/)
  if (vwMatch)
    return Math.min((Number.parseFloat(vwMatch[1]!) / 100) * window.innerWidth, 300)
  return 200
}

onMounted(async () => {
  if (!canvasRef.value)
    return

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced)
    return

  const { useTextDistortion } = await import('~/composables/useTextDistortion')

  const sim = useTextDistortion({
    fontSize: computeFontSize(),
    lines: props.lines,
  })

  const success = sim.init(canvasRef.value)
  if (!success)
    return

  distortionInstance = sim

  resizeHandler = () => {
    distortionInstance?.updateFontSize(computeFontSize())
  }
  window.addEventListener('resize', resizeHandler)

  const delay = props.startDelay ?? 300
  setTimeout(() => {
    sim.start()
    isReady.value = true
    startGlitchCycle()
  }, delay)
})

function startGlitchCycle() {
  function scheduleGlitch() {
    const delay = 2000 + Math.random() * 4000
    glitchTimeoutId = setTimeout(() => {
      isGlitching.value = true
      setTimeout(() => {
        isGlitching.value = false
        scheduleGlitch()
      }, 50 + Math.random() * 100)
    }, delay)
  }
  scheduleGlitch()
}

onUnmounted(() => {
  distortionInstance?.destroy()
  distortionInstance = null
  if (glitchTimeoutId)
    clearTimeout(glitchTimeoutId)
  if (resizeHandler)
    window.removeEventListener('resize', resizeHandler)
})
</script>

<template>
  <div class="text-distortion" :class="{ 'text-distortion--ready': isReady }">
    <canvas
      ref="canvasRef"
      class="text-distortion__canvas"
      aria-hidden="true"
    />

    <div
      v-if="isGlitching"
      class="text-distortion__glitch"
      aria-hidden="true"
    />
  </div>
</template>

<style scoped>
.text-distortion {
  position: relative;
  width: 100%;
}

.text-distortion__canvas {
  display: block;
  width: 100%;
  height: auto;
  opacity: 0;
  transition: opacity 0.6s ease;
}

.text-distortion--ready .text-distortion__canvas {
  opacity: 1;
}

.text-distortion__glitch {
  position: absolute;
  inset: 0;
  pointer-events: none;
  clip-path: polygon(
    0% 15%, 100% 15%, 100% 18%, 0% 18%,
    0% 45%, 100% 45%, 100% 50%, 0% 50%,
    0% 72%, 100% 72%, 100% 75%, 0% 75%
  );
  background: inherit;
  transform: translateX(3px);
  mix-blend-mode: screen;
  opacity: 0.6;
}

@media (prefers-reduced-motion: reduce) {
  .text-distortion__glitch {
    display: none;
  }
}
</style>
