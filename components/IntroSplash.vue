<script setup lang="ts">
/**
 * IntroSplash - Enhanced Smooth Transitions
 * ═══════════════════════════════════════════════════════════════
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

  // Elements
  const logo = container.querySelector('.logo')
  const logoGlow = container.querySelector('.logo-glow')
  const spiralWrapper = container.querySelector('.spiral-wrapper')
  const video = container.querySelector('.spiral-video') as HTMLVideoElement
  const textContainer = container.querySelector('.text-container')
  const titleChars = container.querySelectorAll('.title .char')
  const subtitle = container.querySelector('.subtitle')
  const exitOverlay = container.querySelector('.exit-overlay')

  // Initial states
  gsap.set(logo, { opacity: 0, scale: 0.85 })
  gsap.set(logoGlow, { opacity: 0, scale: 0.8 })
  // Start with spiral visible for testing - will animate clip-path
  gsap.set(spiralWrapper, { clipPath: 'circle(0% at 50% 50%)', opacity: 1 })
  gsap.set(textContainer, { autoAlpha: 0 })
  gsap.set(titleChars, {
    yPercent: 110,
    opacity: 0,
  })
  gsap.set(subtitle, {
    yPercent: 100,
    opacity: 0,
  })
  gsap.set(exitOverlay, { autoAlpha: 0 })

  // Ensure video plays
  if (video) {
    video.play().catch(() => {})
  }

  const tl = gsap.timeline()

  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: LOGO ENTRANCE
  // ═══════════════════════════════════════════════════════════════

  tl.to(logoGlow, {
    opacity: 0.3,
    scale: 1,
    duration: 0.8,
    ease: 'power2.out',
  })

  tl.to(logo, {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: 'power2.out',
  }, '-=0.6')

  tl.to(logoGlow, {
    opacity: 0.5,
    scale: 1.2,
    duration: 0.8,
    ease: 'sine.inOut',
  }, '-=0.4')

  tl.to({}, { duration: 0.3 })

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: LOGO → SPIRAL (smooth crossfade)
  // ═══════════════════════════════════════════════════════════════

  tl.to(logo, {
    opacity: 0,
    scale: 0.95,
    filter: 'blur(4px)',
    duration: 1,
    ease: 'power2.inOut',
  })

  tl.to(logoGlow, {
    opacity: 0,
    scale: 1.8,
    duration: 1.2,
    ease: 'power2.inOut',
  }, '<')

  tl.to(spiralWrapper, {
    clipPath: 'circle(100% at 50% 50%)',
    duration: 2.5,
    ease: 'power3.inOut',
  }, '-=0.8')

  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: TEXT ENTRANCE (slide up mask reveal)
  // ═══════════════════════════════════════════════════════════════

  // Show text container
  tl.to(textContainer, {
    autoAlpha: 1,
    duration: 0.1,
  }, '-=1.8')

  // Title characters - clean slide up reveal
  tl.to(titleChars, {
    yPercent: 0,
    opacity: 1,
    duration: 1,
    ease: 'power4.out',
    stagger: {
      each: 0.04,
      from: 'start',
    },
  }, '-=1.6')

  // Subtitle - slide up after title
  tl.to(subtitle, {
    yPercent: 0,
    opacity: 0.8,
    duration: 0.8,
    ease: 'power3.out',
  }, '-=0.5')


  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: HOLD
  // ═══════════════════════════════════════════════════════════════

  tl.to({}, { duration: 2 })

  // ═══════════════════════════════════════════════════════════════
  // PHASE 5: TEXT EXIT (slide up mask out)
  // ═══════════════════════════════════════════════════════════════

  // Subtitle - slide up out
  tl.to(subtitle, {
    yPercent: -110,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.in',
  })

  // Title characters - slide up out with stagger
  tl.to(titleChars, {
    yPercent: -110,
    opacity: 0,
    duration: 0.8,
    ease: 'power4.in',
    stagger: {
      each: 0.03,
      from: 'end',
    },
  }, '-=0.4')

  // Hide text container
  tl.to(textContainer, {
    autoAlpha: 0,
    duration: 0.2,
  }, '-=0.2')

  // ═══════════════════════════════════════════════════════════════
  // PHASE 6: SPIRAL EXIT - Accelerated Infinity Zoom
  // ═══════════════════════════════════════════════════════════════
  // Concept: Slow start → RAPID acceleration into the spiral
  // expo.in = starts gentle, ends FAST (like being sucked in)

  const whiteFlash = container.querySelector('.white-flash')

  // Initialize
  gsap.set(whiteFlash, { autoAlpha: 0 })

  // Create sub-timeline for orchestrated exit
  const exitTl = gsap.timeline()

  // 1. Accelerated zoom - EXPO easing for dramatic speed ramp
  //    Starts slow, then RAPIDLY accelerates at the end
  exitTl.to(spiralWrapper, {
    scale: 3,
    duration: 1.4,
    ease: 'expo.in', // Dramatic acceleration curve
  })

  // 2. Spiral fades - matched timing with zoom
  exitTl.to(spiralWrapper, {
    opacity: 0,
    duration: 1.0,
    ease: 'power4.in', // Aggressive fade at the end
  }, '-=1.0')

  // 3. Quick flash at breakthrough moment
  exitTl.to(whiteFlash, {
    autoAlpha: 0.2,
    duration: 0.15,
    ease: 'power2.out',
  }, '-=0.25')

  exitTl.to(whiteFlash, {
    autoAlpha: 0,
    duration: 0.4,
    ease: 'power2.out',
  })

  // 4. Snap to black - quick, decisive finish
  exitTl.to(exitOverlay, {
    autoAlpha: 1,
    duration: 0.5,
    ease: 'power3.out',
    onComplete: () => emit('complete'),
  }, '-=0.35')

  // Add exit timeline to main timeline
  tl.add(exitTl, '-=0.1')
}

onMounted(() => {
  setTimeout(() => initAnimation(), 100)
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
  will-change: clip-path, transform, opacity, filter;
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
  will-change: transform, opacity;
}

/* White flash - subtle breakthrough moment */
.white-flash {
  position: absolute;
  inset: 0;
  z-index: 51;
  pointer-events: none;
  background: radial-gradient(
    circle at 50% 50%,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.6) 30%,
    rgba(255, 255, 255, 0.2) 60%,
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
