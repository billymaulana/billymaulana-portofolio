/**
 * useNoisePortrait — Particle flow field forming a head silhouette
 *
 * 2000 particles drift through a simplex noise vector field,
 * constrained to a head/shoulders silhouette mask.
 * Mouse proximity warps the flow field, creating organic distortion.
 *
 * Technique: Bruno Imbrizi style particle flow field
 * (Awwwards Academy Creative Coding)
 *
 * Performance: ~2000 noise lookups/frame vs 30k+ for per-pixel.
 * Trail effect via low-alpha canvas clear.
 */

// ─── Simplex Noise 2D (self-contained) ───

const GRAD3 = [
  [1, 1],
  [-1, 1],
  [1, -1],
  [-1, -1],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
]

function buildPermutation(): number[] {
  const p: number[] = []
  for (let i = 0; i < 256; i++) p[i] = i
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = p[i]!
    p[i] = p[j]!
    p[j] = tmp
  }
  return [...p, ...p]
}

const F2 = 0.5 * (Math.sqrt(3) - 1)
const G2 = (3 - Math.sqrt(3)) / 6

function simplex2D(xin: number, yin: number, perm: number[]): number {
  const s = (xin + yin) * F2
  const i = Math.floor(xin + s)
  const j = Math.floor(yin + s)
  const t = (i + j) * G2
  const x0 = xin - (i - t)
  const y0 = yin - (j - t)

  let i1: number
  let j1: number
  if (x0 > y0) {
    i1 = 1
    j1 = 0
  }
  else {
    i1 = 0
    j1 = 1
  }

  const x1 = x0 - i1 + G2
  const y1 = y0 - j1 + G2
  const x2 = x0 - 1 + 2 * G2
  const y2 = y0 - 1 + 2 * G2

  const ii = i & 255
  const jj = j & 255

  let n0 = 0
  let n1 = 0
  let n2 = 0

  let t0 = 0.5 - x0 * x0 - y0 * y0
  if (t0 >= 0) {
    t0 *= t0
    const gi0 = perm[ii + perm[jj]!]! % 8
    n0 = t0 * t0 * (GRAD3[gi0]![0]! * x0 + GRAD3[gi0]![1]! * y0)
  }

  let t1 = 0.5 - x1 * x1 - y1 * y1
  if (t1 >= 0) {
    t1 *= t1
    const gi1 = perm[ii + i1 + perm[jj + j1]!]! % 8
    n1 = t1 * t1 * (GRAD3[gi1]![0]! * x1 + GRAD3[gi1]![1]! * y1)
  }

  let t2 = 0.5 - x2 * x2 - y2 * y2
  if (t2 >= 0) {
    t2 *= t2
    const gi2 = perm[ii + 1 + perm[jj + 1]!]! % 8
    n2 = t2 * t2 * (GRAD3[gi2]![0]! * x2 + GRAD3[gi2]![1]! * y2)
  }

  return 70 * (n0 + n1 + n2)
}

// ─── Head Silhouette SDF (returns 0-1, 0 = outside) ───

function headMask(
  nx: number, // normalized 0-1
  ny: number, // normalized 0-1
): number {
  // Center at 0.5, 0.45 (head slightly above center)
  const cx = 0.5
  const cy = 0.42

  // Head ellipse
  const headRx = 0.28
  const headRy = 0.28
  const headD = ((nx - cx) / headRx) ** 2 + ((ny - cy) / headRy) ** 2
  if (headD < 1)
    return 1 - headD * 0.3

  // Neck
  const neckTop = cy + headRy * 0.7
  const neckBot = 0.72
  const neckW = 0.08
  if (ny > neckTop && ny < neckBot && Math.abs(nx - cx) < neckW) {
    return 0.6 * (1 - Math.abs(nx - cx) / neckW)
  }

  // Shoulders — wide ellipse
  const sCy = 0.82
  const sRx = 0.46
  const sRy = 0.16
  const sD = ((nx - cx) / sRx) ** 2 + ((ny - sCy) / sRy) ** 2
  if (sD < 1 && ny < sCy + sRy * 0.3) {
    return 0.5 * (1 - sD * 0.4)
  }

  // Feathered edge (soft glow around head)
  if (headD < 1.6) {
    return (1.6 - headD) / 0.6 * 0.15
  }

  return 0
}

// ─── Particle ───

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  hue: number // slight color variation
}

function spawnParticle(w: number, h: number): Particle {
  // Spawn within head silhouette
  let x: number, y: number, mask: number
  let attempts = 0
  do {
    x = Math.random() * w
    y = Math.random() * h
    mask = headMask(x / w, y / h)
    attempts++
  } while (mask < 0.1 && attempts < 50)

  return {
    x,
    y,
    vx: 0,
    vy: 0,
    life: 0,
    maxLife: 120 + Math.random() * 180,
    size: 0.8 + Math.random() * 1.5,
    hue: 215 + Math.random() * 30, // 215-245 blue range
  }
}

// ─── Composable ───

interface NoisePortraitOptions {
  /** Number of particles. Default 1800 */
  particleCount?: number
  /** Noise frequency. Default 0.004 */
  frequency?: number
  /** Particle speed multiplier. Default 0.8 */
  speed?: number
  /** Trail length (alpha clear). Lower = longer trails. Default 0.04 */
  trailAlpha?: number
}

export function useNoisePortrait(
  canvasRef: Ref<HTMLCanvasElement | undefined>,
  containerRef: Ref<HTMLElement | undefined>,
  options: NoisePortraitOptions = {},
) {
  const {
    particleCount = 1800,
    frequency = 0.004,
    speed = 0.8,
    trailAlpha = 0.04,
  } = options

  let animId = 0
  let perm: number[] = []
  let particles: Particle[] = []
  let mouseNX = -1 // normalized 0-1
  let mouseNY = -1
  let isHovering = false
  let hoverStrength = 0 // smoothed
  let canvasW = 0
  let canvasH = 0
  let displayW = 0
  let displayH = 0

  function handleMouseMove(e: MouseEvent) {
    if (!containerRef.value)
      return
    const rect = containerRef.value.getBoundingClientRect()
    mouseNX = (e.clientX - rect.left) / rect.width
    mouseNY = (e.clientY - rect.top) / rect.height
    isHovering = true
  }

  function handleTouchMove(e: TouchEvent) {
    const touch = e.touches[0]
    if (!touch || !containerRef.value)
      return
    const rect = containerRef.value.getBoundingClientRect()
    mouseNX = (touch.clientX - rect.left) / rect.width
    mouseNY = (touch.clientY - rect.top) / rect.height
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

    perm = buildPermutation()

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx)
      return

    // Size canvas
    const rect = container.getBoundingClientRect()
    displayW = rect.width
    displayH = rect.height
    const dpr = Math.min(window.devicePixelRatio, 2)
    canvasW = Math.floor(displayW * dpr)
    canvasH = Math.floor(displayH * dpr)
    canvas.width = canvasW
    canvas.height = canvasH
    canvas.style.width = `${displayW}px`
    canvas.style.height = `${displayH}px`
    ctx.scale(dpr, dpr)

    // Spawn particles
    particles = []
    for (let i = 0; i < particleCount; i++) {
      particles.push(spawnParticle(displayW, displayH))
    }

    // Mouse + touch events
    container.addEventListener('mousemove', handleMouseMove, { passive: true })
    container.addEventListener('mouseleave', handleMouseLeave)
    container.addEventListener('touchmove', handleTouchMove, { passive: true })
    container.addEventListener('touchend', handleTouchEnd)

    // ─── Render loop ───
    let time = 0

    function render() {
      time++
      const t = time * 0.002

      // Smooth hover
      const target = isHovering ? 1 : 0
      hoverStrength += (target - hoverStrength) * 0.03

      // Fade canvas (trail effect)
      ctx!.fillStyle = `rgba(0, 0, 0, ${trailAlpha + hoverStrength * 0.02})`
      ctx!.fillRect(0, 0, displayW, displayH)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!
        p.life++

        // Respawn if dead or outside mask
        const mask = headMask(p.x / displayW, p.y / displayH)
        if (p.life > p.maxLife || mask < 0.02) {
          particles[i] = spawnParticle(displayW, displayH)
          continue
        }

        // Noise-based flow field
        const angle = simplex2D(
          p.x * frequency + t,
          p.y * frequency + t * 0.7,
          perm,
        ) * Math.PI * 2

        // Second noise layer for turbulence
        const turbulence = simplex2D(
          p.x * frequency * 3 + t * 1.5 + 500,
          p.y * frequency * 3 - t * 0.5 + 500,
          perm,
        ) * 0.3

        p.vx += (Math.cos(angle + turbulence) * speed * 0.15)
        p.vy += (Math.sin(angle + turbulence) * speed * 0.15)

        // Mouse warp — push particles outward from cursor
        if (hoverStrength > 0.01) {
          const dx = p.x / displayW - mouseNX
          const dy = p.y / displayH - mouseNY
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 0.25 && dist > 0.001) {
            const force = (0.25 - dist) / 0.25 * hoverStrength * 2
            p.vx += (dx / dist) * force * 0.4
            p.vy += (dy / dist) * force * 0.4
          }
        }

        // Friction
        p.vx *= 0.92
        p.vy *= 0.92

        p.x += p.vx
        p.y += p.vy

        // Wrap particles back inside silhouette
        if (p.x < 0)
          p.x = displayW
        if (p.x > displayW)
          p.x = 0
        if (p.y < 0)
          p.y = displayH
        if (p.y > displayH)
          p.y = 0

        // Draw
        const lifeFade = p.life < 30
          ? p.life / 30
          : p.life > p.maxLife - 30
            ? (p.maxLife - p.life) / 30
            : 1

        const alpha = mask * lifeFade * (0.5 + hoverStrength * 0.35)
        if (alpha < 0.01)
          continue

        const brightness = 50 + mask * 40 + hoverStrength * 15
        ctx!.fillStyle = `hsla(${p.hue}, 85%, ${brightness}%, ${alpha})`

        const s = p.size * (0.8 + mask * 0.5)
        ctx!.fillRect(
          p.x - s * 0.5,
          p.y - s * 0.5,
          s,
          s,
        )
      }

      // Subtle glow overlay at head center
      if (hoverStrength > 0.05) {
        const gradient = ctx!.createRadialGradient(
          mouseNX * displayW,
          mouseNY * displayH,
          0,
          mouseNX * displayW,
          mouseNY * displayH,
          displayW * 0.2,
        )
        gradient.addColorStop(0, `rgba(0, 71, 255, ${hoverStrength * 0.06})`)
        gradient.addColorStop(1, 'rgba(0, 71, 255, 0)')
        ctx!.fillStyle = gradient
        ctx!.fillRect(0, 0, displayW, displayH)
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
    particles = []
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
