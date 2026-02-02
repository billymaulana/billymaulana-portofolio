<script setup lang="ts">
/**
 * IntroSplash - AWWWARDS Level Animation Orchestration
 * ═══════════════════════════════════════════════════════════════
 * Inspired by: Skizophonic, Zajno, Linear, Stripe
 * Key: Smooth overlaps, micro-delays, premium easing curves
 */

const emit = defineEmits<{
  complete: []
}>()

let isInitialized = false

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
  const video = container.querySelector('.spiral-video') as HTMLVideoElement
  const textContainer = container.querySelector('.text-container')
  const titleChars = container.querySelectorAll('.title .char')
  const subtitle = container.querySelector('.subtitle')
  const whiteFlash = container.querySelector('.white-flash')
  const exitOverlay = container.querySelector('.exit-overlay')

  // ═══════════════════════════════════════════════════════════════
  // INITIAL STATES - Prepared for cinematic reveals
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

  // Ensure video plays
  if (video) {
    video.play().catch(() => {})
  }

  // ═══════════════════════════════════════════════════════════════
  // MASTER TIMELINE - Awwwards-level orchestration
  // ═══════════════════════════════════════════════════════════════
  const master = gsap.timeline({
    defaults: {
      ease: 'power3.out', // Default smooth ease
    },
  })

  // ───────────────────────────────────────────────────────────────
  // PHASE 1: LOGO ENTRANCE - Ethereal Materialization
  // ───────────────────────────────────────────────────────────────

  // Glow fades in first - prepares the stage
  master.to(logoGlow, {
    opacity: 0.15,
    scale: 0.7,
    duration: 0.8,
    ease: 'sine.out',
  })

  // Logo materializes with smooth deceleration
  master.to(logo, {
    opacity: 1,
    scale: 1,
    rotation: 0,
    filter: 'blur(0px)',
    y: 0,
    duration: 1.4,
    ease: 'expo.out', // Fast start, smooth landing
  }, '-=0.5') // 62% overlap - seamless flow

  // Glow breathes outward
  master.to(logoGlow, {
    opacity: 0.5,
    scale: 1.3,
    duration: 1.2,
    ease: 'power2.inOut',
  }, '-=1.0') // Overlaps with logo settle

  // Glow subtle pulse back
  master.to(logoGlow, {
    opacity: 0.35,
    scale: 1.15,
    duration: 0.8,
    ease: 'sine.inOut',
  }, '-=0.3')

  // Micro-pause for visual breathing
  master.to({}, { duration: 0.15 })

  // ───────────────────────────────────────────────────────────────
  // PHASE 2: LOGO → SPIRAL - Dimensional Crossfade
  // ───────────────────────────────────────────────────────────────

  // Logo begins ethereal dissolve
  master.to(logo, {
    opacity: 0,
    scale: 1.08,
    filter: 'blur(25px)',
    y: -10,
    duration: 1.6,
    ease: 'power2.inOut',
  })

  // Glow expands and dissolves
  master.to(logoGlow, {
    opacity: 0,
    scale: 2.8,
    duration: 1.8,
    ease: 'power2.in',
  }, '<+0.1') // Slight delay for depth

  // Spiral iris wipe - perfectly timed with dissolve
  master.to(spiralWrapper, {
    clipPath: 'circle(100% at 50% 50%)',
    duration: 2.2,
    ease: 'power3.inOut', // Smooth S-curve
  }, '<+0.3') // Starts after dissolve begins

  // ───────────────────────────────────────────────────────────────
  // PHASE 3: TEXT ENTRANCE - Choreographed Reveal
  // ───────────────────────────────────────────────────────────────

  // Activate text container mid-spiral reveal
  master.to(textContainer, {
    autoAlpha: 1,
    duration: 0.01,
  }, '-=1.4')

  // Title characters cascade with rotation unwind
  master.to(titleChars, {
    yPercent: 0,
    opacity: 1,
    rotation: 0,
    scale: 1,
    duration: 1.0,
    ease: 'power4.out', // Sharp deceleration
    stagger: {
      each: 0.035, // Tight stagger for flow
      from: 'start',
      ease: 'power1.in', // Accelerating stagger
    },
  }, '-=1.2')

  // Subtitle contracts and sharpens
  master.to(subtitle, {
    yPercent: 0,
    opacity: 0.85,
    letterSpacing: '0.3em',
    filter: 'blur(0px)',
    scale: 1,
    duration: 1.1,
    ease: 'power3.out',
  }, '-=0.5') // Overlaps title finish

  // ───────────────────────────────────────────────────────────────
  // PHASE 4: HOLD - Let it breathe
  // ───────────────────────────────────────────────────────────────

  master.to({}, { duration: 1.8 })

  // ───────────────────────────────────────────────────────────────
  // PHASE 5: TEXT EXIT - Accelerated Departure
  // ───────────────────────────────────────────────────────────────

  // Subtitle disperses first
  master.to(subtitle, {
    yPercent: -60,
    opacity: 0,
    letterSpacing: '0.8em',
    filter: 'blur(10px)',
    scale: 0.98,
    duration: 0.6,
    ease: 'power3.in',
  })

  // Title characters accelerate out with reverse cascade
  master.to(titleChars, {
    yPercent: -130,
    opacity: 0,
    rotation: -8,
    scale: 0.9,
    duration: 0.75,
    ease: 'power4.in', // Strong acceleration
    stagger: {
      each: 0.02,
      from: 'end', // Reverse direction
      ease: 'power2.in',
    },
  }, '-=0.45') // Tight overlap

  // Container fade
  master.to(textContainer, {
    autoAlpha: 0,
    duration: 0.1,
  }, '-=0.1')

  // ───────────────────────────────────────────────────────────────
  // PHASE 6: SPIRAL EXIT - Hyperdrive Zoom
  // ───────────────────────────────────────────────────────────────

  // Spiral accelerates into infinity
  master.to(spiralWrapper, {
    scale: 3.5,
    duration: 1.2,
    ease: 'expo.in', // Dramatic exponential acceleration
  }, '-=0.05')

  // Spiral fades during zoom
  master.to(spiralWrapper, {
    opacity: 0,
    duration: 0.9,
    ease: 'power3.in',
  }, '<+0.3')

  // Breakthrough flash
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

  // Final black takeover
  master.to(exitOverlay, {
    autoAlpha: 1,
    duration: 0.45,
    ease: 'power2.out',
    onComplete: () => emit('complete'),
  }, '-=0.3')
}

onMounted(() => {
  setTimeout(() => initAnimation(), 50)
})
</script>

<template>
  <div class="splash">
    <!-- Logo with glow -->
    <div class="logo-container">
      <div class="logo-glow" />
      <img src="/assets/images/logo/logo-bm-white.png" alt="BM" class="logo">
    </div>

    <!-- Spiral Video -->
    <div class="spiral-wrapper">
      <video
        class="spiral-video"
        preload="auto"
        autoplay
        muted
        loop
        playsinline
        disablepictureinpicture
      >
        <source src="/videos/spiral.mp4" type="video/mp4">
      </video>
    </div>

    <!-- Exit effect - subtle white flash -->
    <div class="white-flash" />

    <!-- Text with character animation -->
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

/* Spiral Video Wrapper */
.spiral-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 50;
  transform-origin: center center;
  will-change: clip-path, transform, opacity;
}

.spiral-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #000;
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

/* White flash - breakthrough moment */
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
