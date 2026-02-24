<script setup lang="ts">
const props = defineProps<{
  lines: { text: string, indent: number }[]
  startDelay?: number
}>()

const canvasRef = ref<HTMLCanvasElement>()
const isReady = ref(false)
let distortionInstance: ReturnType<typeof import('~/composables/useTextDistortion').useTextDistortion> | null = null
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

  const { useTextDistortion } = await import('~/composables/useTextDistortion')

  // Wait for Clash Display to load before rendering text to canvas
  await document.fonts.ready

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
  }, delay)
})

onUnmounted(() => {
  distortionInstance?.destroy()
  distortionInstance = null
  if (resizeHandler)
    window.removeEventListener('resize', resizeHandler)
})
</script>

<template>
  <div
    class="text-distortion"
    :class="{ 'text-distortion--ready': isReady }"
  >
    <canvas
      ref="canvasRef"
      class="text-distortion__canvas"
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

@media (prefers-reduced-motion: reduce) {
  .text-distortion__canvas {
    transition: none;
  }
}
</style>
