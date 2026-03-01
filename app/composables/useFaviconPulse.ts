/**
 * useFaviconPulse — Animated favicon with subtle breathing pulse
 *
 * Draws BM monogram on a 32x32 canvas, applies a slow opacity/glow
 * pulse (sine wave), updates the favicon link element every ~250ms.
 * Pauses when tab is hidden (Page Visibility API).
 */

export function useFaviconPulse() {
  let intervalId: ReturnType<typeof setInterval> | null = null
  let canvas: HTMLCanvasElement | null = null
  let ctx: CanvasRenderingContext2D | null = null
  let linkEl: HTMLLinkElement | null = null
  let originalHref = ''
  let frame = 0

  function init() {
    // Find the SVG favicon link
    linkEl = document.querySelector('link[rel="icon"][type="image/svg+xml"]')
    if (!linkEl)
      return

    originalHref = linkEl.href

    canvas = document.createElement('canvas')
    canvas.width = 32
    canvas.height = 32
    ctx = canvas.getContext('2d')
    if (!ctx)
      return

    // Start animation loop — low framerate (4fps) to save CPU
    intervalId = setInterval(renderFrame, 250)

    // Pause when tab hidden
    document.addEventListener('visibilitychange', handleVisibility)
  }

  function renderFrame() {
    if (!ctx || !canvas || !linkEl)
      return

    frame++
    const t = frame * 0.08 // Slow progression
    const pulse = 0.7 + 0.3 * Math.sin(t) // Opacity oscillates 0.7–1.0
    const glowIntensity = Math.max(0, Math.sin(t)) * 6 // Glow 0–6px

    // Clear
    ctx.clearRect(0, 0, 32, 32)

    // Background circle with pulse
    ctx.globalAlpha = pulse
    ctx.fillStyle = '#050510'
    ctx.beginPath()
    ctx.arc(16, 16, 15, 0, Math.PI * 2)
    ctx.fill()

    // Subtle blue glow ring
    if (glowIntensity > 0.5) {
      ctx.globalAlpha = glowIntensity / 20
      ctx.strokeStyle = '#0047FF'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(16, 16, 14, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Draw "BM" text
    ctx.globalAlpha = pulse
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 14px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('BM', 16, 17)

    // Update favicon
    linkEl.href = canvas.toDataURL('image/png')
  }

  function handleVisibility() {
    if (document.hidden) {
      // Pause animation
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
    }
    else {
      // Resume animation
      if (!intervalId) {
        intervalId = setInterval(renderFrame, 250)
      }
    }
  }

  function destroy() {
    if (intervalId)
      clearInterval(intervalId)
    document.removeEventListener('visibilitychange', handleVisibility)

    // Restore original favicon
    if (linkEl && originalHref) {
      linkEl.href = originalHref
    }

    canvas = null
    ctx = null
    linkEl = null
  }

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return
    // Delay init to not interfere with preloader
    setTimeout(init, 7000)
  })

  onUnmounted(() => {
    destroy()
  })

  return { init, destroy }
}
