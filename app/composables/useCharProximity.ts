/**
 * useCharProximity — Variable font weight based on cursor distance
 *
 * Each character's weight (200-700) is determined by its distance from the cursor.
 * Close characters become heavy (700), distant ones become light (200).
 * Uses lerp smoothing for organic feel.
 */

interface CharProximityOptions {
  /** Max influence radius in px */
  radius?: number
  /** Min font weight */
  minWeight?: number
  /** Max font weight */
  maxWeight?: number
  /** Lerp smoothing factor (0-1, lower = smoother) */
  smoothing?: number
}

export function useCharProximity(options: CharProximityOptions = {}) {
  const {
    radius = 300,
    minWeight = 200,
    maxWeight = 700,
    smoothing = 0.08,
  } = options

  const charElements = ref<HTMLElement[]>([])
  const isActive = ref(true)

  // Current interpolated weights per character
  let currentWeights: number[] = []
  let targetWeights: number[] = []
  let mouseX = 0
  let mouseY = 0
  let animId = 0

  function setCharElements(elements: HTMLElement[]) {
    charElements.value = elements
    const defaultWeight = minWeight
    currentWeights = elements.map(() => defaultWeight)
    targetWeights = elements.map(() => defaultWeight)

    // Set initial state
    elements.forEach((el) => {
      el.style.fontVariationSettings = `'wght' ${defaultWeight}`
    })
  }

  function onMouseMove(e: MouseEvent) {
    mouseX = e.clientX
    mouseY = e.clientY
    updateTargetWeights()
  }

  function onMouseLeave() {
    // Reset all to min weight when cursor leaves
    targetWeights = targetWeights.map(() => minWeight)
  }

  function updateTargetWeights() {
    const elements = charElements.value
    if (!elements.length)
      return

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i]
      if (!el)
        continue

      const rect = el.getBoundingClientRect()
      const charCenterX = rect.left + rect.width / 2
      const charCenterY = rect.top + rect.height / 2

      const distance = Math.hypot(mouseX - charCenterX, mouseY - charCenterY)
      const normalized = Math.min(distance / radius, 1)

      // Smoothstep for nicer falloff (not linear)
      const t = normalized * normalized * (3 - 2 * normalized)
      targetWeights[i] = Math.round(maxWeight - t * (maxWeight - minWeight))
    }
  }

  function animate() {
    if (!isActive.value) {
      animId = requestAnimationFrame(animate)
      return
    }

    const elements = charElements.value
    let needsUpdate = false

    for (let i = 0; i < elements.length; i++) {
      const target = targetWeights[i] ?? minWeight
      const current = currentWeights[i] ?? minWeight

      // Lerp toward target
      const diff = target - current
      if (Math.abs(diff) > 0.5) {
        currentWeights[i] = current + diff * smoothing
        needsUpdate = true
      }
      else {
        currentWeights[i] = target
      }
    }

    if (needsUpdate) {
      for (let i = 0; i < elements.length; i++) {
        const el = elements[i]
        if (el) {
          const w = Math.round(currentWeights[i] ?? minWeight)
          el.style.fontVariationSettings = `'wght' ${w}`
        }
      }
    }

    animId = requestAnimationFrame(animate)
  }

  function start() {
    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    animate()
  }

  function stop() {
    window.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseleave', onMouseLeave)
    cancelAnimationFrame(animId)
  }

  function pause() {
    isActive.value = false
  }

  function resume() {
    isActive.value = true
  }

  return {
    setCharElements,
    start,
    stop,
    pause,
    resume,
  }
}
