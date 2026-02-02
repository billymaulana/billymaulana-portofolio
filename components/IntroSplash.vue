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
  // ═══════════════════════════════════════════════════════════════
  spiralRotation = gsap.to(spiralSvg, {
    rotation: 360,
    duration: 8,
    ease: 'none',
    repeat: -1,
    transformOrigin: 'center center',
  })

  // ═══════════════════════════════════════════════════════════════
  // MASTER TIMELINE
  // ═══════════════════════════════════════════════════════════════
  const master = gsap.timeline({
    defaults: {
      ease: 'power3.out',
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
  // PHASE 5: TEXT EXIT
  // ───────────────────────────────────────────────────────────────

  master.to(subtitle, {
    yPercent: -60,
    opacity: 0,
    letterSpacing: '0.8em',
    filter: 'blur(10px)',
    scale: 0.98,
    duration: 0.6,
    ease: 'power3.in',
  })

  master.to(titleChars, {
    yPercent: -130,
    opacity: 0,
    rotation: -8,
    scale: 0.9,
    duration: 0.75,
    ease: 'power4.in',
    stagger: {
      each: 0.02,
      from: 'end',
      ease: 'power2.in',
    },
  }, '-=0.45')

  master.to(textContainer, {
    autoAlpha: 0,
    duration: 0.1,
  }, '-=0.1')

  // ───────────────────────────────────────────────────────────────
  // PHASE 6: SPIRAL EXIT
  // ───────────────────────────────────────────────────────────────

  master.to(spiralWrapper, {
    scale: 3.5,
    duration: 1.2,
    ease: 'expo.in',
  }, '-=0.05')

  master.to(spiralWrapper, {
    opacity: 0,
    duration: 0.9,
    ease: 'power3.in',
  }, '<+0.3')

  master.to(whiteFlash, {
    autoAlpha: 0.25,
    duration: 0.12,
    ease: 'power2.out',
  }, '-=0.2')

  master.to(whiteFlash, {
    autoAlpha: 0,
    duration: 0.35,
    ease: 'power2.out',
  })

  master.to(exitOverlay, {
    autoAlpha: 1,
    duration: 0.45,
    ease: 'power2.out',
    onComplete: () => {
      if (spiralRotation) {
        spiralRotation.kill()
      }
      emit('complete')
    },
  }, '-=0.3')
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

    <!-- Hypnotic Spiral SVG (True spiral - Skizophonic style) -->
    <div class="spiral-wrapper">
      <svg
        class="hypnotic-spiral"
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <!-- Gradient for smooth spiral -->
          <linearGradient id="spiralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#000" />
            <stop offset="100%" stop-color="#000" />
          </linearGradient>
        </defs>

        <!-- Background -->
        <rect width="1000" height="1000" fill="#fff" />

        <!-- True Archimedean Spiral Arms (12 arms for hypnotic effect) -->
        <g fill="#000">
          <!-- Spiral arm 1 -->
          <path d="M500,500 Q500,100 900,500 Q500,900 500,500" />
          <!-- Spiral arm 2 -->
          <path d="M500,500 Q900,500 500,900 Q100,500 500,500" />

          <!-- Create hypnotic spiral using wedges -->
          <path d="M500,500 L500,0 A500,500 0 0,1 1000,500 Z" />
          <path d="M500,500 L1000,500 A500,500 0 0,1 500,1000 Z" />

          <!-- Inner spiral layers -->
          <circle cx="500" cy="500" r="400" fill="#fff" />
          <path d="M500,500 L500,100 A400,400 0 0,1 900,500 Z" />
          <path d="M500,500 L900,500 A400,400 0 0,1 500,900 Z" />

          <circle cx="500" cy="500" r="300" fill="#fff" />
          <path d="M500,500 L500,200 A300,300 0 0,1 800,500 Z" />
          <path d="M500,500 L800,500 A300,300 0 0,1 500,800 Z" />

          <circle cx="500" cy="500" r="220" fill="#fff" />
          <path d="M500,500 L500,280 A220,220 0 0,1 720,500 Z" />
          <path d="M500,500 L720,500 A220,220 0 0,1 500,720 Z" />

          <circle cx="500" cy="500" r="160" fill="#fff" />
          <path d="M500,500 L500,340 A160,160 0 0,1 660,500 Z" />
          <path d="M500,500 L660,500 A160,160 0 0,1 500,660 Z" />

          <circle cx="500" cy="500" r="110" fill="#fff" />
          <path d="M500,500 L500,390 A110,110 0 0,1 610,500 Z" />
          <path d="M500,500 L610,500 A110,110 0 0,1 500,610 Z" />

          <circle cx="500" cy="500" r="70" fill="#fff" />
          <path d="M500,500 L500,430 A70,70 0 0,1 570,500 Z" />
          <path d="M500,500 L570,500 A70,70 0 0,1 500,570 Z" />

          <circle cx="500" cy="500" r="40" fill="#fff" />
          <path d="M500,500 L500,460 A40,40 0 0,1 540,500 Z" />
          <path d="M500,500 L540,500 A40,40 0 0,1 500,540 Z" />

          <circle cx="500" cy="500" r="18" fill="#fff" />
          <path d="M500,500 L500,482 A18,18 0 0,1 518,500 Z" />
          <path d="M500,500 L518,500 A18,18 0 0,1 500,518 Z" />
        </g>
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
  will-change: clip-path, transform, opacity;
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
  will-change: transform, opacity;
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
