/**
 * useParticleAttraction — Ambient particle field with cursor gravity
 *
 * Particles drift slowly in noise field, attracted toward cursor on hover.
 * Creates "gravitational pull" atmosphere for CTA sections.
 * Particles are small dots in blue palette.
 */

// ─── Minimal noise (hash-based, lighter than simplex) ───

function hash(x: number, y: number): number {
  let h = x * 374761393 + y * 668265263
  h = ((h ^ (h >> 13)) * 1274126177) | 0
  return (h ^ (h >> 16)) / 2147483648
}

function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const sx = fx * fx * (3 - 2 * fx)
  const sy = fy * fy * (3 - 2 * fy)

  const n00 = hash(ix, iy)
  const n10 = hash(ix + 1, iy)
  const n01 = hash(ix, iy + 1)
  const n11 = hash(ix + 1, iy + 1)

  const nx0 = n00 + (n10 - n00) * sx
  const nx1 = n01 + (n11 - n01) * sx
  return nx0 + (nx1 - nx0) * sy
}

// ─── Particle ───

interface Dot {
  x: number
  y: number
  vx: number
  vy: number
  baseX: number
  baseY: number
  size: number
  alpha: number
  hue: number
}

// ─── Composable ───

interface ParticleAttractionOptions {
  count?: number
  attractRadius?: number
  attractStrength?: number
  driftSpeed?: number
  trailAlpha?: number
}

export function useParticleAttraction(
  canvasRef: Ref<HTMLCanvasElement | undefined>,
  containerRef: Ref<HTMLElement | undefined>,
  options: ParticleAttractionOptions = {},
) {
  const {
    count = 120,
    attractRadius = 200,
    attractStrength = 0.03,
    driftSpeed = 0.3,
    trailAlpha = 0.08,
  } = options

  let animId = 0
  let dots: Dot[] = []
  let mouseX = -999
  let mouseY = -999
  let isHovering = false
  let displayW = 0
  let displayH = 0

  function handleMouseMove(e: MouseEvent) {
    if (!containerRef.value)
      return
    const rect = containerRef.value.getBoundingClientRect()
    mouseX = e.clientX - rect.left
    mouseY = e.clientY - rect.top
    isHovering = true
  }

  function handleTouchMove(e: TouchEvent) {
    const touch = e.touches[0]
    if (!touch || !containerRef.value)
      return
    const rect = containerRef.value.getBoundingClientRect()
    mouseX = touch.clientX - rect.left
    mouseY = touch.clientY - rect.top
    isHovering = true
  }

  function handleTouchEnd() {
    isHovering = false
  }

  function handleMouseLeave() {
    isHovering = false
  }

  function init() {
    const canvas = canvasRef.value
    const container = containerRef.value
    if (!canvas || !container)
      return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx)
      return

    const rect = container.getBoundingClientRect()
    displayW = rect.width
    displayH = rect.height
    const dpr = Math.min(window.devicePixelRatio, 2)
    canvas.width = Math.floor(displayW * dpr)
    canvas.height = Math.floor(displayH * dpr)
    canvas.style.width = `${displayW}px`
    canvas.style.height = `${displayH}px`
    ctx.scale(dpr, dpr)

    // Spawn particles across the field
    dots = []
    for (let i = 0; i < count; i++) {
      const x = Math.random() * displayW
      const y = Math.random() * displayH
      dots.push({
        x,
        y,
        vx: 0,
        vy: 0,
        baseX: x,
        baseY: y,
        size: 1 + Math.random() * 2.5,
        alpha: 0.15 + Math.random() * 0.4,
        hue: 210 + Math.random() * 35,
      })
    }

    container.addEventListener('mousemove', handleMouseMove, { passive: true })
    container.addEventListener('mouseleave', handleMouseLeave)
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd)

    let time = 0

    function render() {
      time++
      const t = time * 0.003

      // Fade trail
      ctx!.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`
      ctx!.fillRect(0, 0, displayW, displayH)

      for (const dot of dots) {
        // Noise-based drift
        const noiseAngle = smoothNoise(dot.x * 0.003 + t, dot.y * 0.003 + t * 0.5) * Math.PI * 4
        dot.vx += Math.cos(noiseAngle) * driftSpeed * 0.05
        dot.vy += Math.sin(noiseAngle) * driftSpeed * 0.05

        // Gentle return to base position
        dot.vx += (dot.baseX - dot.x) * 0.001
        dot.vy += (dot.baseY - dot.y) * 0.001

        // Cursor attraction
        if (isHovering) {
          const dx = mouseX - dot.x
          const dy = mouseY - dot.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < attractRadius && dist > 1) {
            const force = (attractRadius - dist) / attractRadius * attractStrength
            dot.vx += (dx / dist) * force * 8
            dot.vy += (dy / dist) * force * 8
          }
        }

        // Friction
        dot.vx *= 0.94
        dot.vy *= 0.94

        dot.x += dot.vx
        dot.y += dot.vy

        // Wrap edges
        if (dot.x < -10)
          dot.x = displayW + 10
        if (dot.x > displayW + 10)
          dot.x = -10
        if (dot.y < -10)
          dot.y = displayH + 10
        if (dot.y > displayH + 10)
          dot.y = -10

        // Draw dot
        const brightness = 50 + (isHovering ? 15 : 0)
        ctx!.beginPath()
        ctx!.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2)
        ctx!.fillStyle = `hsla(${dot.hue}, 80%, ${brightness}%, ${dot.alpha})`
        ctx!.fill()
      }

      // Draw faint connection lines between nearby particles
      ctx!.strokeStyle = 'rgba(0, 71, 255, 0.06)'
      ctx!.lineWidth = 0.5
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i]!.x - dots[j]!.x
          const dy = dots[i]!.y - dots[j]!.y
          const dist = dx * dx + dy * dy
          if (dist < 8000) {
            ctx!.beginPath()
            ctx!.moveTo(dots[i]!.x, dots[i]!.y)
            ctx!.lineTo(dots[j]!.x, dots[j]!.y)
            ctx!.stroke()
          }
        }
      }

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
  }

  function destroy() {
    if (animId)
      cancelAnimationFrame(animId)
    const container = containerRef.value
    if (container) {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
    dots = []
  }

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      return
    requestAnimationFrame(() => init())
  })

  onUnmounted(() => {
    destroy()
  })

  return { init, destroy }
}
