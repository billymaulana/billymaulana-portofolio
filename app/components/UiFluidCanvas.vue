<script setup lang="ts">
const props = defineProps<{
  /** Delay in ms before starting the fluid simulation */
  startDelay?: number
  /** Number of initial splats when simulation starts */
  initialSplats?: number
}>()

const canvasRef = ref<HTMLCanvasElement>()
let fluidInstance: ReturnType<typeof import('~/composables/useFluidSimulation').useFluidSimulation> | null = null
const isReady = ref(false)

onMounted(async () => {
  if (!canvasRef.value)
    return

  const { useFluidSimulation } = await import('~/composables/useFluidSimulation')
  const sim = useFluidSimulation()
  const success = sim.init(canvasRef.value)

  if (!success)
    return

  fluidInstance = sim

  // Delayed start (waits for preloader / entrance animation)
  const delay = props.startDelay ?? 300
  setTimeout(() => {
    sim.start()
    isReady.value = true

    // Initial splats for a dramatic entrance
    if (props.initialSplats) {
      sim.splat(props.initialSplats)
    }
  }, delay)
})

onUnmounted(() => {
  fluidInstance?.destroy()
  fluidInstance = null
})

function splat(count?: number) {
  fluidInstance?.splat(count)
}

defineExpose({ splat })
</script>

<template>
  <canvas
    ref="canvasRef"
    class="fluid-canvas"
    :class="{ 'fluid-canvas--ready': isReady }"
    aria-hidden="true"
  />
</template>

<style scoped>
.fluid-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: var(--z-fluid, 1);
  opacity: 0;
  transition: opacity 1.5s ease;
  pointer-events: none;
}

.fluid-canvas--ready {
  opacity: 0.45;
}

@media (prefers-reduced-motion: reduce) {
  .fluid-canvas {
    transition: none;
  }
}
</style>
