/**
 * useLiquidGlass — manages SVG filter displacement coupling with WebGL flow field.
 * Reads flow intensity from useGlassShader and computes displacement scale.
 */

interface LiquidGlassState {
  displacementScale: Ref<number>
  flowIntensity: Ref<number>
  startCoupling: (getIntensity: () => number) => void
  stopCoupling: () => void
}

export function useLiquidGlass(): LiquidGlassState {
  const BASE_SCALE = 77
  const MAX_SCALE = 180
  const LERP_SPEED = 0.06

  const displacementScale = ref(BASE_SCALE)
  const flowIntensity = ref(0)

  let rafId = 0
  let running = false
  let getIntensityFn: (() => number) | null = null

  function update() {
    if (!running)
      return

    // Read current flow intensity
    const intensity = getIntensityFn ? getIntensityFn() : 0
    flowIntensity.value = intensity

    // Compute target displacement scale (77 → 180 based on blue flow)
    const targetScale = BASE_SCALE + (MAX_SCALE - BASE_SCALE) * Math.min(intensity * 2.0, 1.0)

    // Smooth lerp toward target
    displacementScale.value += (targetScale - displacementScale.value) * LERP_SPEED

    rafId = requestAnimationFrame(update)
  }

  function startCoupling(getIntensity: () => number) {
    getIntensityFn = getIntensity
    running = true
    rafId = requestAnimationFrame(update)
  }

  function stopCoupling() {
    running = false
    cancelAnimationFrame(rafId)
    // Reset to base
    displacementScale.value = BASE_SCALE
    flowIntensity.value = 0
  }

  onUnmounted(() => {
    stopCoupling()
  })

  return {
    displacementScale,
    flowIntensity,
    startCoupling,
    stopCoupling,
  }
}
