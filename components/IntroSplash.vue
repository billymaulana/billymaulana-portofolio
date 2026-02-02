<script setup lang="ts">
/**
 * IntroSplash - AWWWARDS Level Animation (SVG Hypnotic Spiral)
 * ═══════════════════════════════════════════════════════════════
 * Inspired by: Skizophonic (https://www.skizophonic.com/)
 * No video - Pure SVG + GSAP animation
 */

const emit = defineEmits<{
  complete: []
}>()

let isInitialized = false
let spiralAnimation: gsap.core.Tween | null = null

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
  const spiralCircles = container.querySelectorAll('.hypnotic-spiral .circle')
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
  gsap.set(spiralCircles, { transformOrigin: 'center center' })
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
  // HYPNOTIC SPIRAL ANIMATION (Skizophonic style)
  // ═══════════════════════════════════════════════════════════════
  spiralAnimation = gsap.from(spiralCircles, {
    scale: 0.88,
    duration: 0.9,
    ease: 'back(3)',
    stagger: {
      each: -0.055,
      repeat: -1,
      yoyo: true,
    },
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
  // PHASE 2: LOGO → SPIRAL
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

  master.to(spiralWrapper, {
    clipPath: 'circle(100% at 50% 50%)',
    duration: 2.2,
    ease: 'power3.inOut',
  }, '<+0.3')

  // ───────────────────────────────────────────────────────────────
  // PHASE 3: TEXT ENTRANCE
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
      // Stop spiral animation when complete
      if (spiralAnimation) {
        spiralAnimation.kill()
      }
      emit('complete')
    },
  }, '-=0.3')
}

onMounted(() => {
  setTimeout(() => initAnimation(), 50)
})

onUnmounted(() => {
  if (spiralAnimation) {
    spiralAnimation.kill()
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

    <!-- Hypnotic Spiral SVG (Skizophonic style) -->
    <div class="spiral-wrapper">
      <svg
        class="hypnotic-spiral"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 1000"
        preserveAspectRatio="xMidYMid slice"
      >
        <!-- Outer circles -->
        <circle class="circle" cx="500" cy="500" r="500" fill="#000" />
        <circle class="circle" cx="500" cy="500" r="450" fill="#fff" />
        <circle class="circle" cx="500" cy="500" r="400" fill="#000" />
        <circle class="circle" cx="500" cy="500" r="355" fill="#fff" />
        <circle class="circle" cx="500" cy="500" r="310" fill="#000" />
        <circle class="circle" cx="500" cy="500" r="270" fill="#fff" />
        <circle class="circle" cx="500" cy="500" r="230" fill="#000" />
        <circle class="circle" cx="500" cy="500" r="195" fill="#fff" />
        <circle class="circle" cx="500" cy="500" r="160" fill="#000" />
        <circle class="circle" cx="500" cy="500" r="130" fill="#fff" />
        <circle class="circle" cx="500" cy="500" r="100" fill="#000" />
        <circle class="circle" cx="500" cy="500" r="75" fill="#fff" />
        <circle class="circle" cx="500" cy="500" r="50" fill="#000" />
        <circle class="circle" cx="500" cy="500" r="30" fill="#fff" />
        <circle class="circle" cx="500" cy="500" r="12" fill="#000" />
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
  width: 100%;
  height: 100%;
  min-width: 100vw;
  min-height: 100vh;
}

.hypnotic-spiral .circle {
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
