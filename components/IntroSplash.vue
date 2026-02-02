<script setup lang="ts">
/**
 * IntroSplash - AWWWARDS Level Animation (True Hypnotic Spiral)
 * ═══════════════════════════════════════════════════════════════
 * Inspired by: Skizophonic (https://www.skizophonic.com/)
 * Pure SVG spiral with rotation animation - No video
 */

const emit = defineEmits<{
  complete: []
}>()

let isInitialized = false
let spiralRotation: gsap.core.Tween | null = null

// ═══════════════════════════════════════════════════════════════════════════
// ARCHIMEDEAN SPIRAL PATH GENERATION (Skizophonic-style hypnotic effect)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate Skizophonic-style hypnotic spiral
 * - Fewer turns (3) for bolder, chunkier bands
 * - Variable arm width that tapers toward center
 * - Smooth organic curves
 *
 * When rotated clockwise, creates optical illusion of "pulling inward"
 */
function generateSpiralArm(offsetAngle: number): string {
  const cx = 500 // center x
  const cy = 500 // center y
  const turns = 3 // fewer turns = chunkier bands like Skizophonic
  const startRadius = 550 // slightly larger to fill viewport
  const endRadius = 8 // tiny center point
  const points: string[] = []
  const steps = 180 // smoothness

  const maxTheta = turns * 2 * Math.PI

  // Generate outer edge of spiral arm (going inward)
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const theta = t * maxTheta + offsetAngle
    // Use eased radius for more organic feel
    const easeT = t * t * (3 - 2 * t) // smoothstep easing
    const r = startRadius - (startRadius - endRadius) * easeT

    const x = cx + r * Math.cos(theta)
    const y = cy + r * Math.sin(theta)

    if (i === 0) {
      points.push(`M ${x.toFixed(2)},${y.toFixed(2)}`)
    }
    else {
      points.push(`L ${x.toFixed(2)},${y.toFixed(2)}`)
    }
  }

  // Generate inner edge of spiral arm (going outward)
  // Arm width = half turn (180°) for equal black/white distribution
  const armWidth = Math.PI
  for (let i = steps; i >= 0; i--) {
    const t = i / steps
    const theta = t * maxTheta + offsetAngle + armWidth
    const easeT = t * t * (3 - 2 * t)
    const r = startRadius - (startRadius - endRadius) * easeT

    const x = cx + r * Math.cos(theta)
    const y = cy + r * Math.sin(theta)

    points.push(`L ${x.toFixed(2)},${y.toFixed(2)}`)
  }

  points.push('Z')
  return points.join(' ')
}

// Two spiral arms offset by 180° for classic hypnotic pattern
const spiralPath1 = computed(() => generateSpiralArm(0))
const spiralPath2 = computed(() => generateSpiralArm(Math.PI))

async function initAnimation() {
  if (isInitialized)
    return
  isInitialized = true

  const container = document.querySelector('.splash') as HTMLElement
  if (!container)
    return

  const { gsap } = await import('gsap')

  // ═══════════════════════════════════════════════════════════════
  // ELEMENT REFERENCES
  // ═══════════════════════════════════════════════════════════════
  const logo = container.querySelector('.logo')
  const logoGlow = container.querySelector('.logo-glow')
  const spiralWrapper = container.querySelector('.spiral-wrapper')
  const spiralSvg = container.querySelector('.hypnotic-spiral')
  const textContainer = container.querySelector('.text-container')
  const titleChars = container.querySelectorAll('.title .char')
  const subtitle = container.querySelector('.subtitle')
  const whiteFlash = container.querySelector('.white-flash')
  const exitOverlay = container.querySelector('.exit-overlay')

  // ═══════════════════════════════════════════════════════════════
  // INITIAL STATES
  // ═══════════════════════════════════════════════════════════════
  gsap.set(logo, {
    opacity: 0,
    scale: 0.7,
    rotation: -3,
    filter: 'blur(12px)',
    y: 20,
  })
  gsap.set(logoGlow, { opacity: 0, scale: 0.4 })
  gsap.set(spiralWrapper, { clipPath: 'circle(0% at 50% 50%)', opacity: 1 })
  gsap.set(textContainer, { autoAlpha: 0 })
  gsap.set(titleChars, {
    yPercent: 130,
    opacity: 0,
    rotation: 12,
    scale: 0.85,
    transformOrigin: 'left bottom',
  })
  gsap.set(subtitle, {
    yPercent: 80,
    opacity: 0,
    letterSpacing: '1em',
    filter: 'blur(8px)',
    scale: 0.95,
  })
  gsap.set(whiteFlash, { autoAlpha: 0 })
  gsap.set(exitOverlay, { autoAlpha: 0 })

  // ═══════════════════════════════════════════════════════════════
  // HYPNOTIC SPIRAL ROTATION (Skizophonic style)
  // Clockwise rotation creates "pulling inward" illusion
  // 6s duration = optimal hypnotic speed (not too fast, not too slow)
  // ═══════════════════════════════════════════════════════════════
  spiralRotation = gsap.to(spiralSvg, {
    rotation: 360,
    duration: 6,
    ease: 'none',
    repeat: -1,
    transformOrigin: 'center center',
  })

  // ═══════════════════════════════════════════════════════════════
  // MASTER TIMELINE (GPU-accelerated for 60fps)
  // ═══════════════════════════════════════════════════════════════
  gsap.defaults({ force3D: true }) // GPU acceleration

  const master = gsap.timeline({
    defaults: {
      ease: 'power3.out',
      force3D: true,
    },
  })

  // ───────────────────────────────────────────────────────────────
  // PHASE 1: LOGO ENTRANCE
  // ───────────────────────────────────────────────────────────────

  master.to(logoGlow, {
    opacity: 0.15,
    scale: 0.7,
    duration: 0.8,
    ease: 'sine.out',
  })

  master.to(logo, {
    opacity: 1,
    scale: 1,
    rotation: 0,
    filter: 'blur(0px)',
    y: 0,
    duration: 1.4,
    ease: 'expo.out',
  }, '-=0.5')

  master.to(logoGlow, {
    opacity: 0.5,
    scale: 1.3,
    duration: 1.2,
    ease: 'power2.inOut',
  }, '-=1.0')

  master.to(logoGlow, {
    opacity: 0.35,
    scale: 1.15,
    duration: 0.8,
    ease: 'sine.inOut',
  }, '-=0.3')

  master.to({}, { duration: 0.15 })

  // ───────────────────────────────────────────────────────────────
  // PHASE 2: LOGO → SPIRAL (Skizophonic style clip-path reveal)
  // ───────────────────────────────────────────────────────────────

  master.to(logo, {
    opacity: 0,
    scale: 1.08,
    filter: 'blur(25px)',
    y: -10,
    duration: 1.6,
    ease: 'power2.inOut',
  })

  master.to(logoGlow, {
    opacity: 0,
    scale: 2.8,
    duration: 1.8,
    ease: 'power2.in',
  }, '<+0.1')

  // Clip-path circle reveal (exactly like Skizophonic)
  master.to(spiralWrapper, {
    clipPath: 'circle(100% at 50% 50%)',
    duration: 2,
    ease: 'power3.inOut',
  }, '<+0.3')

  // ───────────────────────────────────────────────────────────────
  // PHASE 3: TEXT ENTRANCE (with mix-blend-mode difference)
  // ───────────────────────────────────────────────────────────────

  master.to(textContainer, {
    autoAlpha: 1,
    duration: 0.01,
  }, '-=1.4')

  master.to(titleChars, {
    yPercent: 0,
    opacity: 1,
    rotation: 0,
    scale: 1,
    duration: 1.0,
    ease: 'power4.out',
    stagger: {
      each: 0.035,
      from: 'start',
      ease: 'power1.in',
    },
  }, '-=1.2')

  master.to(subtitle, {
    yPercent: 0,
    opacity: 0.85,
    letterSpacing: '0.3em',
    filter: 'blur(0px)',
    scale: 1,
    duration: 1.1,
    ease: 'power3.out',
  }, '-=0.5')

  // ───────────────────────────────────────────────────────────────
  // PHASE 4: HOLD
  // ───────────────────────────────────────────────────────────────

  master.to({}, { duration: 1.8 })

  // ───────────────────────────────────────────────────────────────
  // PHASE 5: TEXT EXIT (MIND-BLOWING VAPORIZE EFFECT)
  // Glitch → Chromatic split → Explosive scatter → Dissolve
  // ───────────────────────────────────────────────────────────────

  const totalChars = titleChars.length
  const centerIndex = totalChars / 2

  // Step 1: Anticipation "breath" - slight expansion
  master.to([titleChars, subtitle], {
    scale: 1.03,
    duration: 0.2,
    ease: 'power2.out',
  })

  // Step 2: Glitch micro-shake (creates tension)
  master.to(titleChars, {
    x: (i: number) => (i % 2 === 0 ? 3 : -3),
    duration: 0.05,
    ease: 'none',
  })
  master.to(titleChars, {
    x: (i: number) => (i % 2 === 0 ? -2 : 2),
    duration: 0.05,
    ease: 'none',
  })
  master.to(titleChars, {
    x: 0,
    scale: 1,
    duration: 0.08,
    ease: 'power2.out',
  })

  // Step 3: Subtitle - ethereal dissolve upward
  master.to(subtitle, {
    yPercent: -80,
    opacity: 0,
    letterSpacing: '2em',
    filter: 'blur(30px)',
    scale: 1.3,
    duration: 1.0,
    ease: 'power2.in',
  })

  // Step 4: Title chars - EXPLOSIVE VAPORIZE from center
  // Each char gets unique physics-based trajectory
  master.to(titleChars, {
    yPercent: (i: number) => {
      const distFromCenter = i - centerIndex
      const direction = distFromCenter < 0 ? -1 : 1
      // Parabolic trajectory - chars arc outward
      return -150 - (Math.abs(distFromCenter) * 25 * direction * 0.3)
    },
    xPercent: (i: number) => {
      const distFromCenter = i - centerIndex
      // Exponential spread - chars accelerate outward
      return distFromCenter * 35
    },
    rotation: (i: number) => {
      const distFromCenter = i - centerIndex
      // Spinning as they fly - more spin for outer chars
      return distFromCenter * -8
    },
    scale: (i: number) => {
      // Chars shrink as they "vaporize"
      return 0.2
    },
    opacity: 0,
    filter: 'blur(20px)',
    duration: 1.2,
    ease: 'expo.in',
    stagger: {
      each: 0.03,
      from: 'center',
      ease: 'power4.in',
    },
  }, '-=0.85')

  // Hide text container
  master.to(textContainer, {
    autoAlpha: 0,
    duration: 0.15,
  }, '-=0.3')

  // ───────────────────────────────────────────────────────────────
  // PHASE 6: SPIRAL EXIT (BLACK HOLE COLLAPSE)
  // Pulse → Hyper-rotation → Deep implosion → Explosive release
  // ───────────────────────────────────────────────────────────────

  // Step 1: Ominous pulse - spiral "breathes" before collapse
  master.to(spiralWrapper, {
    scale: 1.08,
    duration: 0.25,
    ease: 'power2.out',
  }, '-=1.0')

  master.to(spiralWrapper, {
    scale: 1,
    duration: 0.15,
    ease: 'power2.in',
  })

  // Step 2: HYPER rotation acceleration (warp drive engaging)
  master.to(spiralSvg, {
    rotation: '+=1800', // 5 full rotations - intense!
    duration: 2.2,
    ease: 'power4.in',
  }, '-=0.1')

  // Step 3: Deep implosion - black hole sucking in
  master.to(spiralWrapper, {
    scale: 0.6,
    filter: 'blur(5px)',
    duration: 0.5,
    ease: 'power3.in',
  }, '-=2.0')

  // Step 4: EXPLOSIVE release - supernova expansion
  master.to(spiralWrapper, {
    scale: 8,
    filter: 'blur(50px)',
    duration: 1.5,
    ease: 'expo.in',
  })

  // Step 5: Rapid fade during explosion
  master.to(spiralWrapper, {
    opacity: 0,
    duration: 0.9,
    ease: 'power4.in',
  }, '<+0.5')

  // Step 6: DOUBLE FLASH - Cinematic impact (like camera flash)
  // First flash - sharp burst
  master.to(whiteFlash, {
    autoAlpha: 0.9,
    duration: 0.08,
    ease: 'power4.out',
  }, '-=0.7')

  master.to(whiteFlash, {
    autoAlpha: 0.3,
    duration: 0.12,
    ease: 'power2.in',
  })

  // Second flash - softer afterglow
  master.to(whiteFlash, {
    autoAlpha: 0.6,
    duration: 0.1,
    ease: 'power3.out',
  }, '+=0.02')

  master.to(whiteFlash, {
    autoAlpha: 0,
    duration: 0.6,
    ease: 'power2.inOut',
  })

  // Final black overlay - smooth cinematic wipe
  master.to(exitOverlay, {
    autoAlpha: 1,
    duration: 0.7,
    ease: 'power3.inOut',
    onComplete: () => {
      if (spiralRotation) {
        spiralRotation.kill()
      }
      emit('complete')
    },
  }, '-=0.5')
}

onMounted(() => {
  setTimeout(() => initAnimation(), 50)
})

onUnmounted(() => {
  if (spiralRotation) {
    spiralRotation.kill()
  }
})
</script>

<template>
  <div class="splash">
    <!-- Logo with glow -->
    <div class="logo-container">
      <div class="logo-glow" />
      <img src="/assets/images/logo/logo-bm-white.png" alt="BM" class="logo">
    </div>

    <!-- Hypnotic Spiral SVG (True Archimedean Spiral - Skizophonic style) -->
    <div class="spiral-wrapper">
      <svg
        ref="spiralSvgRef"
        class="hypnotic-spiral"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Background -->
        <rect width="1000" height="1000" fill="#fff" />

        <!--
          True Archimedean Spiral Arms
          Generated mathematically: r = startRadius - (startRadius * θ / maxTheta)
          Creates authentic hypnotic "inward pull" illusion when rotated
        -->
        <path :d="spiralPath1" fill="#000" />
        <path :d="spiralPath2" fill="#000" />
      </svg>
    </div>

    <!-- Exit effect -->
    <div class="white-flash" />

    <!-- Text -->
    <div class="text-container">
      <h1 class="title">
        <span class="char">B</span><span class="char">I</span><span class="char">L</span><span class="char">L</span><span class="char">Y</span>
        <span class="char space">&nbsp;</span>
        <span class="char">M</span><span class="char">A</span><span class="char">U</span><span class="char">L</span><span class="char">A</span><span class="char">N</span><span class="char">A</span>
      </h1>
      <div class="subtitle-wrapper">
        <p class="subtitle">Frontend Developer</p>
      </div>
    </div>

    <!-- Exit overlay -->
    <div class="exit-overlay" />
  </div>
</template>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #000;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Logo */
.logo-container {
  position: absolute;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-glow {
  position: absolute;
  width: clamp(400px, 70vw, 800px);
  height: clamp(400px, 70vw, 800px);
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  will-change: transform, opacity;
}

.logo {
  position: relative;
  width: clamp(280px, 55vw, 600px);
  will-change: transform, opacity, filter;
}

/* Hypnotic Spiral */
.spiral-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  transform-origin: center center;
  will-change: clip-path, transform, opacity, filter;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hypnotic-spiral {
  width: 150%;
  height: 150%;
  min-width: 150vmax;
  min-height: 150vmax;
  will-change: transform;
}

/* Text */
.text-container {
  position: relative;
  z-index: 60;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #000;
  color: #fff;
  mix-blend-mode: difference;
}

.title {
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: clamp(38px, 12vw, 150px);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1.1;
  margin: 0;
  text-transform: uppercase;
  display: flex;
  overflow: hidden;
}

.char {
  display: inline-block;
  will-change: transform, opacity, filter;
}

.space {
  width: 0.25em;
}

.subtitle-wrapper {
  overflow: hidden;
  margin-top: 1rem;
}

.subtitle {
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: clamp(14px, 2.5vw, 24px);
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  will-change: transform, opacity, letter-spacing, filter;
}

/* White flash */
.white-flash {
  position: absolute;
  inset: 0;
  z-index: 51;
  pointer-events: none;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.5) 35%,
    rgba(255, 255, 255, 0.15) 60%,
    transparent 80%
  );
  will-change: opacity;
}

/* Exit overlay */
.exit-overlay {
  position: absolute;
  inset: 0;
  background: #000;
  z-index: 200;
  pointer-events: none;
}

@media (max-width: 768px) {
  .logo { width: 240px; }
  .logo-glow { width: 320px; height: 320px; }
  .title { font-size: 32px; letter-spacing: -0.02em; }
  .subtitle { font-size: 12px; letter-spacing: 0.2em; }
  .space { width: 0.15em; }
}
</style>
