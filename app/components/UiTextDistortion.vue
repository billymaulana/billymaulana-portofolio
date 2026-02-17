<script setup lang="ts">
const props = defineProps<{
  lines: { text: string, indent: number }[]
  startDelay?: number
}>()

const canvasRef = ref<HTMLCanvasElement>()
const isReady = ref(false)
const glitchActive = ref(false)
const glitchIntense = ref(false)
const glitchRedStyle = ref<Record<string, string>>({})
const glitchBlueStyle = ref<Record<string, string>>({})
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

function generateSliceClipPath(count: number): string {
  const parts: string[] = []
  for (let i = 0; i < count; i++) {
    const y = Math.random() * 92
    const h = 1.5 + Math.random() * 5
    parts.push(
      `0% ${y.toFixed(1)}%`,
      `100% ${y.toFixed(1)}%`,
      `100% ${(y + h).toFixed(1)}%`,
      `0% ${(y + h).toFixed(1)}%`,
    )
  }
  return `polygon(${parts.join(', ')})`
}

function startGlitchCycle() {
  function scheduleGlitch() {
    const delay = 2000 + Math.random() * 4000
    glitchTimeoutId = setTimeout(() => {
      const burstCount = 1 + Math.floor(Math.random() * 3)
      let i = 0

      function runMicroGlitch() {
        const intensity = Math.random()
        const isIntense = intensity > 0.55
        const sliceCount = isIntense ? 4 + Math.floor(Math.random() * 3) : 2 + Math.floor(Math.random() * 2)
        const shiftRange = isIntense ? 8 : 3

        glitchActive.value = true
        glitchIntense.value = isIntense
        glitchRedStyle.value = {
          clipPath: generateSliceClipPath(sliceCount),
          transform: `translateX(${-(1 + Math.random() * shiftRange).toFixed(1)}px)`,
        }
        glitchBlueStyle.value = {
          clipPath: generateSliceClipPath(sliceCount),
          transform: `translateX(${(1 + Math.random() * shiftRange).toFixed(1)}px)`,
        }

        const duration = 40 + Math.random() * 80
        setTimeout(() => {
          glitchActive.value = false
          i++
          if (i < burstCount) {
            setTimeout(runMicroGlitch, 15 + Math.random() * 35)
          }
          else {
            scheduleGlitch()
          }
        }, duration)
      }

      runMicroGlitch()
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
    :class="{
      'text-distortion--ready': isReady,
      'text-distortion--glitch': glitchActive,
    }"
  >
    <canvas
      ref="canvasRef"
      class="text-distortion__canvas"
      aria-hidden="true"
    />

    <template v-if="glitchActive">
      <div
        class="text-distortion__glitch text-distortion__glitch--red"
        :style="glitchRedStyle"
        aria-hidden="true"
      />
      <div
        class="text-distortion__glitch text-distortion__glitch--blue"
        :style="glitchBlueStyle"
        aria-hidden="true"
      />
      <div
        v-if="glitchIntense"
        class="text-distortion__scanlines"
        aria-hidden="true"
      />
    </template>
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

/* Canvas jitter during glitch — real displacement */
.text-distortion--glitch .text-distortion__canvas {
  animation: glitchJitter 0.06s steps(2) infinite;
}

@keyframes glitchJitter {
  0% { transform: translate(0, 0); }
  25% { transform: translate(1.5px, 0); }
  50% { transform: translate(-1px, 0); }
  75% { transform: translate(0, 0.5px); }
}

/* RGB split overlay layers */
.text-distortion__glitch {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.text-distortion__glitch--red {
  background: rgba(255, 20, 60, 0.12);
  mix-blend-mode: lighten;
}

.text-distortion__glitch--blue {
  background: rgba(0, 71, 255, 0.18);
  mix-blend-mode: lighten;
}

/* Scanline texture on intense glitches */
.text-distortion__scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.015) 2px,
    rgba(255, 255, 255, 0.015) 4px
  );
  mix-blend-mode: overlay;
}

@media (prefers-reduced-motion: reduce) {
  .text-distortion__glitch,
  .text-distortion__scanlines {
    display: none;
  }

  .text-distortion--glitch .text-distortion__canvas {
    animation: none;
  }
}
</style>
