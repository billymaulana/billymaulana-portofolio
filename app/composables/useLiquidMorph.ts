/**
 * useLiquidMorph — Animate a circle clip-path from a trigger element,
 * expanding organically to reveal a full-screen overlay.
 *
 * Uses GSAP to tween a progress value (0→1), computing
 * `circle(radius at originX originY)` on each frame. The origin is
 * derived from the trigger element's center via getBoundingClientRect.
 *
 * Supports `prefers-reduced-motion`: if enabled, progress jumps
 * instantly to the target value (no GSAP tween).
 */

interface MorphState {
  clipPath: Ref<string>
  isAnimating: Ref<boolean>
  open: (triggerEl: HTMLElement) => Promise<void>
  close: () => Promise<void>
  kill: () => void
}

export function useLiquidMorph(): MorphState {
  const clipPath = ref('circle(0px at 50% 50%)')
  const isAnimating = ref(false)

  // Internal state
  let originX = '50%'
  let originY = '50%'
  let maxRadius = 0
  let currentTween: { kill: () => void } | null = null

  const progress = { value: 0 }

  function updateClipPath() {
    const r = progress.value * maxRadius
    clipPath.value = `circle(${r}px at ${originX} ${originY})`
  }

  function computeOrigin(triggerEl: HTMLElement) {
    const rect = triggerEl.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2

    originX = `${cx}px`
    originY = `${cy}px`

    // Max radius = viewport diagonal (ensures full coverage)
    const vw = window.innerWidth
    const vh = window.innerHeight
    maxRadius = Math.sqrt(vw * vw + vh * vh)
  }

  function prefersReducedMotion(): boolean {
    return typeof window !== 'undefined'
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  async function open(triggerEl: HTMLElement): Promise<void> {
    kill()
    computeOrigin(triggerEl)

    // Reduced motion: jump instantly
    if (prefersReducedMotion()) {
      progress.value = 1
      updateClipPath()
      return
    }

    isAnimating.value = true

    const gsap = (await import('gsap')).default

    return new Promise<void>((resolve) => {
      currentTween = gsap.to(progress, {
        value: 1,
        duration: 1.05,
        ease: 'expo.out',
        onUpdate: updateClipPath,
        onComplete: () => {
          isAnimating.value = false
          currentTween = null
          resolve()
        },
      })
    })
  }

  async function close(): Promise<void> {
    kill()

    // Reduced motion: jump instantly
    if (prefersReducedMotion()) {
      progress.value = 0
      updateClipPath()
      return
    }

    isAnimating.value = true

    const gsap = (await import('gsap')).default

    return new Promise<void>((resolve) => {
      currentTween = gsap.to(progress, {
        value: 0,
        duration: 0.8,
        ease: 'power3.inOut',
        onUpdate: updateClipPath,
        onComplete: () => {
          isAnimating.value = false
          currentTween = null
          resolve()
        },
      })
    })
  }

  function kill() {
    if (currentTween) {
      currentTween.kill()
      currentTween = null
    }
    isAnimating.value = false
  }

  onUnmounted(() => {
    kill()
  })

  return {
    clipPath,
    isAnimating,
    open,
    close,
    kill,
  }
}
