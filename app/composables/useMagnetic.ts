/**
 * useMagnetic — Magnetic hover effect
 *
 * Element follows cursor within a trigger zone, creating a
 * physics-like "attracted to cursor" feel. Uses lerp for organic motion.
 * On mouseleave, springs back to original position.
 *
 * Usage:
 *   const buttonRef = ref<HTMLElement>()
 *   useMagnetic(buttonRef, { strength: 0.3 })
 */

interface MagneticOptions {
  /** How far element moves toward cursor (0-1). Default 0.3 */
  strength?: number
  /** Lerp smoothing factor. Lower = smoother. Default 0.1 */
  ease?: number
  /** Trigger zone multiplier relative to element size. Default 1.5 */
  triggerArea?: number
}

export function useMagnetic(
  element: Ref<HTMLElement | undefined>,
  options: MagneticOptions = {},
) {
  const {
    strength = 0.3,
    ease = 0.1,
    triggerArea = 1.5,
  } = options

  let currentX = 0
  let currentY = 0
  let targetX = 0
  let targetY = 0
  let animId = 0
  let isHovering = false

  function onMouseMove(e: MouseEvent) {
    const el = element.value
    if (!el)
      return

    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distX = e.clientX - centerX
    const distY = e.clientY - centerY
    const distance = Math.hypot(distX, distY)

    // Trigger zone = element diagonal * multiplier
    const triggerRadius = Math.hypot(rect.width, rect.height) / 2 * triggerArea

    if (distance < triggerRadius) {
      isHovering = true
      targetX = distX * strength
      targetY = distY * strength
    }
    else {
      isHovering = false
      targetX = 0
      targetY = 0
    }
  }

  function onMouseLeave() {
    isHovering = false
    targetX = 0
    targetY = 0
  }

  function animate() {
    // Lerp toward target
    currentX += (targetX - currentX) * ease
    currentY += (targetY - currentY) * ease

    // Snap to zero when close enough
    if (Math.abs(currentX) < 0.01 && Math.abs(currentY) < 0.01 && !isHovering) {
      currentX = 0
      currentY = 0
    }

    const el = element.value
    if (el) {
      el.style.transform = `translate(${currentX}px, ${currentY}px)`
    }

    animId = requestAnimationFrame(animate)
  }

  onMounted(() => {
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch)
      return

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    animate()
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseleave', onMouseLeave)
    cancelAnimationFrame(animId)

    // Reset transform
    const el = element.value
    if (el) {
      el.style.transform = ''
    }
  })
}
