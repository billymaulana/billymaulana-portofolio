import { onUnmounted, ref } from 'vue'

interface MagneticOptions {
  strength?: number
  radius?: number
  ease?: number
}

export function useMagneticEffect(options: MagneticOptions = {}) {
  const { strength = 0.3, radius = 100, ease = 0.15 } = options

  const isHovering = ref(false)
  const position = ref({ x: 0, y: 0 })

  let animationId: number | null = null
  let targetX = 0
  let targetY = 0
  let currentX = 0
  let currentY = 0

  function lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor
  }

  function animate() {
    currentX = lerp(currentX, targetX, ease)
    currentY = lerp(currentY, targetY, ease)
    position.value = { x: currentX, y: currentY }

    if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
      animationId = requestAnimationFrame(animate)
    }
  }

  function setupMagnetic(element: HTMLElement): () => void {
    const onMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const distX = e.clientX - centerX
      const distY = e.clientY - centerY
      const distance = Math.sqrt(distX * distX + distY * distY)

      if (distance < radius) {
        isHovering.value = true
        targetX = distX * strength
        targetY = distY * strength

        if (!animationId) {
          animationId = requestAnimationFrame(animate)
        }
      }
    }

    const onMouseLeave = () => {
      isHovering.value = false
      targetX = 0
      targetY = 0

      if (!animationId) {
        animationId = requestAnimationFrame(animate)
      }
    }

    element.addEventListener('mousemove', onMouseMove)
    element.addEventListener('mouseleave', onMouseLeave)

    return () => {
      element.removeEventListener('mousemove', onMouseMove)
      element.removeEventListener('mouseleave', onMouseLeave)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }

  onUnmounted(() => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  })

  return {
    setupMagnetic,
    position,
    isHovering,
  }
}
