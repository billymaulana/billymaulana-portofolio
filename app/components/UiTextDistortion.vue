<script setup lang="ts">
const props = defineProps<{
  lines: { text: string, indent: number }[]
  startDelay?: number
}>()

const canvasRef = ref<HTMLCanvasElement>()
const isReady = ref(false)
const glitchClass = ref('')
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

function startGlitchCycle() {
  function scheduleGlitch() {
    const delay = 3000 + Math.random() * 5000
    glitchTimeoutId = setTimeout(() => {
      const roll = Math.random()

      if (roll > 0.6) {
        // Subtle chromatic shift — brief hue + brightness flicker
        glitchClass.value = 'text-distortion--glitch-chromatic'
        setTimeout(() => {
          glitchClass.value = ''
          scheduleGlitch()
        }, 60 + Math.random() * 60)
      }
      else if (roll > 0.25) {
        // Micro displacement — single quick horizontal snap
        glitchClass.value = 'text-distortion--glitch-shift'
        setTimeout(() => {
          glitchClass.value = ''
          scheduleGlitch()
        }, 50 + Math.random() * 40)
      }
      else {
        // Double flicker — two rapid pulses
        glitchClass.value = 'text-distortion--glitch-chromatic'
        setTimeout(() => {
          glitchClass.value = ''
          setTimeout(() => {
            glitchClass.value = 'text-distortion--glitch-shift'
            setTimeout(() => {
              glitchClass.value = ''
              scheduleGlitch()
            }, 40)
          }, 30)
        }, 50)
      }
    }, delay)
  }
  scheduleGlitch()
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
  <div
    class="text-distortion"
    :class="[
      { 'text-distortion--ready': isReady },
      glitchClass,
    ]"
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

/* ─── Glitch variant: chromatic shift ─── */
.text-distortion--glitch-chromatic .text-distortion__canvas {
  filter: brightness(1.15) saturate(1.3);
  text-shadow: none;
}

/* ─── Glitch variant: horizontal micro-displacement ─── */
.text-distortion--glitch-shift .text-distortion__canvas {
  transform: translateX(1.5px);
  filter: brightness(1.08);
}

@media (prefers-reduced-motion: reduce) {
  .text-distortion--glitch-chromatic .text-distortion__canvas,
  .text-distortion--glitch-shift .text-distortion__canvas {
    filter: none;
    transform: none;
  }
}
</style>
