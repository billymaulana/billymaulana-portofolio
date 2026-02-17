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

onMounted(async () => {
  if (!canvasRef.value)
    return

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced)
    return

  const { useTextDistortion } = await import('~/composables/useTextDistortion')

  const computed = getComputedStyle(document.documentElement)
  const displaySize = computed.getPropertyValue('--text-display').trim()
  const vwMatch = displaySize.match(/([\d.]+)vw/)
  const fontSize = vwMatch
    ? (Number.parseFloat(vwMatch[1]!) / 100) * window.innerWidth
    : 200

  const sim = useTextDistortion({
    fontSize: Math.min(fontSize, 300),
    lines: props.lines,
  })

  const success = sim.init(canvasRef.value)
  if (!success)
    return

  distortionInstance = sim

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

    <div class="text-distortion__grain" aria-hidden="true" />

    <div class="text-distortion__scanlines" aria-hidden="true" />
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

.text-distortion__grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 256px 256px;
  animation: grainShift 0.5s steps(4) infinite;
  mix-blend-mode: overlay;
}

@keyframes grainShift {
  0% { background-position: 0 0; }
  25% { background-position: -64px -32px; }
  50% { background-position: 32px -64px; }
  75% { background-position: -32px 64px; }
  100% { background-position: 64px 32px; }
}

.text-distortion__scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.03;
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 2px,
    rgba(255, 255, 255, 0.05) 2px,
    rgba(255, 255, 255, 0.05) 4px
  );
}

@media (prefers-reduced-motion: reduce) {
  .text-distortion__grain {
    animation: none;
    display: none;
  }

  .text-distortion__glitch {
    display: none;
  }

  .text-distortion__scanlines {
    display: none;
  }
}
</style>
