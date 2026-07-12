<script setup lang="ts">
import { useLiquidType } from '~/composables/useLiquidType'

const props = withDefaults(defineProps<{
  lines: { text: string, indent: number }[]
  fontSize?: number
  showFps?: boolean
}>(), {
  fontSize: 240,
  showFps: false,
})

const canvasRef = ref<HTMLCanvasElement>()
const rootRef = ref<HTMLElement>()
const usesFallback = ref(false)

const liquid = useLiquidType({
  lines: props.lines,
  fontSize: props.fontSize,
})

const { fps } = liquid

let observer: IntersectionObserver | null = null

onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced || !canvasRef.value) {
    usesFallback.value = true
    return
  }

  await document.fonts.ready
  const ok = liquid.init(canvasRef.value)
  if (!ok) {
    usesFallback.value = true
    return
  }

  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting)
        liquid.start()
      else
        liquid.pause()
    }
  }, { threshold: 0.05 })
  if (rootRef.value)
    observer.observe(rootRef.value)
})

onUnmounted(() => {
  observer?.disconnect()
  liquid.destroy()
})
</script>

<template>
  <div ref="rootRef" class="liquid-type">
    <canvas
      v-if="!usesFallback"
      ref="canvasRef"
      class="liquid-type__canvas"
      aria-hidden="true"
    />
    <p v-else class="liquid-type__fallback">
      <span v-for="(l, i) in lines" :key="i" class="liquid-type__line" :style="{ paddingLeft: `${l.indent / 16}rem` }">
        {{ l.text }}
      </span>
    </p>
    <span v-if="showFps && !usesFallback" class="liquid-type__fps">{{ fps }} FPS</span>
  </div>
</template>

<style scoped>
.liquid-type {
  position: relative;
  width: 100%;
}

.liquid-type__canvas {
  display: block;
  width: 100%;
  height: auto;
}

.liquid-type__fallback {
  display: flex;
  flex-direction: column;
  font-family: 'PP Editorial New', Georgia, serif;
  font-weight: 800;
  font-size: clamp(4rem, 13vw, 16rem);
  line-height: 0.94;
  color: #F2EFEA;
}

.liquid-type__line {
  display: block;
}

.liquid-type__fps {
  position: absolute;
  top: -2rem;
  right: 0;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  color: #8A8A8A;
  font-variant-numeric: tabular-nums;
}
</style>
