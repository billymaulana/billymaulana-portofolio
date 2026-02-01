<script setup lang="ts">
/**
 * IntroSplash - Optimized for 60fps performance
 * Lightweight with smooth radial transitions
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
  const logoWrapper = container.querySelector('.logo-wrapper')
  const glitchLayers = container.querySelectorAll('.glitch-layer')
  const textContainer = container.querySelector('.text-container')
  const mainText = container.querySelector('.main-text')
  const textSlices = container.querySelectorAll('.text-slice')
  const rgbLayers = container.querySelectorAll('.rgb-layer')
  const subtitle = container.querySelector('.subtitle')
  const radialReveal = container.querySelector('.radial-reveal')
  const radialClose = container.querySelector('.radial-close')
  const pulseRings = container.querySelectorAll('.pulse-ring')
  const coreGlow = container.querySelector('.core-glow')
  const noise = container.querySelector('.noise-overlay')
  const scanlines = container.querySelector('.scanlines')
  const glitchFlash = container.querySelector('.glitch-flash')

  // Initial states
  gsap.set(logoWrapper, { opacity: 0, scale: 0.5 })
  gsap.set(glitchLayers, { opacity: 0 })
  gsap.set(textContainer, { opacity: 0 })
  gsap.set(mainText, { opacity: 0 })
  gsap.set(textSlices, { opacity: 0, y: 20, rotationX: -30, scale: 0.9 })
  gsap.set(rgbLayers, { opacity: 0 })
  gsap.set(subtitle, { opacity: 0, y: 12 })
  gsap.set(radialReveal, { '--reveal-progress': 0 })
  gsap.set(radialClose, { '--close-progress': 0, 'opacity': 0 })
  gsap.set(pulseRings, { scale: 0.3, opacity: 0 })
  gsap.set(coreGlow, { scale: 0.2, opacity: 0 })
  gsap.set(noise, { opacity: 0 })
  gsap.set(scanlines, { opacity: 0 })
  gsap.set(glitchFlash, { opacity: 0 })

  // Glitch burst - optimized
  function glitchBurst(intensity = 1) {
    const tl = gsap.timeline()
    const base = 40 * intensity

    for (let i = 0; i < 4; i++) {
      const t = i * 0.04
      tl.to(glitchLayers[0], { x: -Math.random() * base - 10, opacity: 0.8, duration: 0.03 }, t)
      tl.to(glitchLayers[1], { x: Math.random() * base + 10, opacity: 0.8, duration: 0.03 }, t)
    }
    tl.to(glitchLayers, { x: 0, opacity: 0, duration: 0.05 })
    return tl
  }

  // Signal/noise burst - for transitions
  function signalBurst(intensity = 1) {
    const tl = gsap.timeline()
    const noiseOpacity = 0.08 * intensity
    const flashOpacity = 0.15 * intensity

    // Quick noise flash
    tl.to(noise, { opacity: noiseOpacity, duration: 0.02 })
    tl.to(glitchFlash, { opacity: flashOpacity, duration: 0.02 }, '<')
    tl.to(scanlines, { opacity: 0.15, duration: 0.03 }, '<')

    // Flicker
    tl.to(noise, { opacity: noiseOpacity * 0.5, duration: 0.03 })
    tl.to(glitchFlash, { opacity: 0, duration: 0.04 }, '<')

    tl.to(noise, { opacity: noiseOpacity * 0.8, duration: 0.02 })
    tl.to(noise, { opacity: 0, duration: 0.06 })
    tl.to(scanlines, { opacity: 0, duration: 0.08 }, '-=0.04')

    return tl
  }

  // RGB split - optimized
  function rgbSplit(intensity = 1) {
    const tl = gsap.timeline()
    const base = 30 * intensity

    tl.to(rgbLayers[0], { x: -base, opacity: 0.7, duration: 0.06 })
    tl.to(rgbLayers[1], { x: base, opacity: 0.7, duration: 0.06 }, '<')
    tl.to(rgbLayers, { x: 0, opacity: 0, duration: 0.08 })
    return tl
  }

  // Slice wave - optimized
  function sliceWave(direction = 1, intensity = 1) {
    const tl = gsap.timeline()
    const sliceArr = Array.from(textSlices)

    sliceArr.forEach((slice, idx) => {
      tl.to(slice, {
        x: direction * (Math.random() * 60 + 20) * intensity,
        duration: 0.04,
        ease: 'power2.out',
      }, idx * 0.015)
    })

    tl.to(textSlices, {
      x: 0,
      duration: 0.08,
      ease: 'power2.inOut',
      stagger: 0.01,
    }, '+=0.04')

    return tl
  }

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
  })

  // ═══════════════════════════════════════════════════════════════
  // PHASE 1: SMOOTH RADIAL REVEAL (IRIS-IN) + SIGNAL INTRO
  // ═══════════════════════════════════════════════════════════════

  gsap.set(container, { opacity: 1 })

  // Initial signal burst
  tl.add(signalBurst(0.8))

  // Smoother iris opening with longer duration and better easing
  tl.to(radialReveal, {
    '--reveal-progress': 1,
    'duration': 0.9,
    'ease': 'power3.inOut',
  }, '-=0.1')

  // Subtle noise during reveal
  tl.to(noise, { opacity: 0.04, duration: 0.4 }, '-=0.7')
  tl.to(noise, { opacity: 0, duration: 0.3 }, '-=0.3')

  // Core glow fades in smoothly
  tl.to(coreGlow, {
    scale: 0.7,
    opacity: 1,
    duration: 0.6,
    ease: 'power2.out',
  }, '-=0.6')

  // Pulse rings stagger in with smooth timing
  tl.to(pulseRings, {
    scale: 0.7,
    opacity: 1,
    duration: 0.5,
    stagger: 0.1,
    ease: 'power2.out',
  }, '-=0.5')

  // ═══════════════════════════════════════════════════════════════
  // PHASE 2: LOGO REVEAL + GROW TOGETHER
  // ═══════════════════════════════════════════════════════════════

  // Logo appears
  tl.to(logoWrapper, {
    opacity: 1,
    scale: 0.8,
    duration: 0.3,
    ease: 'power3.out',
  })

  tl.add(glitchBurst(1), '-=0.15')

  // Hold briefly
  tl.to({}, { duration: 0.2 })

  // ═══════════════════════════════════════════════════════════════
  // PHASE 3: LOGO + RADIALS GROW BIGGER TOGETHER
  // ═══════════════════════════════════════════════════════════════

  // Everything scales up together
  tl.to(logoWrapper, {
    scale: 1.3,
    duration: 0.5,
    ease: 'power2.inOut',
  })

  tl.to(coreGlow, {
    scale: 1.5,
    duration: 0.5,
    ease: 'power2.inOut',
  }, '<')

  tl.to(pulseRings, {
    scale: 1.4,
    duration: 0.5,
    stagger: 0.03,
    ease: 'power2.inOut',
  }, '<')

  tl.add(glitchBurst(0.6), '-=0.3')

  // ═══════════════════════════════════════════════════════════════
  // PHASE 4: SMOOTH TRANSITION - LOGO/RADIALS EXPLODE INTO TEXT
  // ═══════════════════════════════════════════════════════════════

  // Signal burst during transition
  tl.add(signalBurst(1.2))

  // Logo and radials expand and fade out smoothly
  tl.to(logoWrapper, {
    scale: 2.5,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.in',
  }, '-=0.15')

  tl.to(coreGlow, {
    scale: 4,
    opacity: 0,
    duration: 0.6,
    ease: 'power2.in',
  }, '<')

  tl.to(pulseRings, {
    scale: 3,
    opacity: 0,
    duration: 0.5,
    stagger: 0.02,
    ease: 'power2.in',
  }, '<')

  // Noise flicker during explosion
  tl.to(noise, { opacity: 0.06, duration: 0.1 }, '-=0.4')
  tl.to(noise, { opacity: 0, duration: 0.15 }, '-=0.2')

  // ═══════════════════════════════════════════════════════════════
  // PHASE 5: TEXT EMERGES FROM EXPANSION
  // ═══════════════════════════════════════════════════════════════

  // Text appears as logo fades - overlapping transition
  tl.to(textContainer, { opacity: 1, duration: 0.01 }, '-=0.4')

  // Text slices emerge from center with scale
  tl.to(textSlices, {
    opacity: 1,
    y: 0,
    rotationX: 0,
    scale: 1,
    duration: 0.5,
    ease: 'power3.out',
    stagger: { each: 0.03, from: 'center' },
  }, '-=0.35')

  tl.to(mainText, { opacity: 1, duration: 0.1 }, '-=0.3')
  tl.add(rgbSplit(1.5), '-=0.25')

  // ═══════════════════════════════════════════════════════════════
  // PHASE 6: GLITCH EFFECTS
  // ═══════════════════════════════════════════════════════════════

  tl.add(sliceWave(1, 1), '+=0.06')
  tl.add(rgbSplit(0.8), '-=0.06')
  tl.add(sliceWave(-1, 0.5), '+=0.03')

  // ═══════════════════════════════════════════════════════════════
  // PHASE 7: SUBTITLE
  // ═══════════════════════════════════════════════════════════════

  tl.to(subtitle, {
    opacity: 1,
    y: 0,
    duration: 0.3,
    ease: 'power2.out',
  }, '-=0.08')

  tl.add(rgbSplit(0.3))

  // ═══════════════════════════════════════════════════════════════
  // PHASE 8: HOLD
  // ═══════════════════════════════════════════════════════════════

  tl.to({}, { duration: 0.25 })
  tl.add(sliceWave(1, 0.25))

  // ═══════════════════════════════════════════════════════════════
  // PHASE 9: RADIAL EXIT (IRIS-OUT) + SIGNAL OUTRO
  // ═══════════════════════════════════════════════════════════════

  tl.add(sliceWave(-1, 1))
  tl.add(rgbSplit(1.2), '-=0.06')

  // Signal burst before exit
  tl.add(signalBurst(1))

  // Text exits - converge to center
  tl.to(textSlices, {
    opacity: 0,
    scale: 0.85,
    duration: 0.4,
    ease: 'power3.inOut',
    stagger: { each: 0.015, from: 'edges' },
  }, '-=0.1')

  tl.to(subtitle, {
    opacity: 0,
    y: 12,
    duration: 0.3,
    ease: 'power3.inOut',
  }, '-=0.3')

  // Final noise flicker
  tl.to(noise, { opacity: 0.05, duration: 0.08 }, '-=0.2')
  tl.to(scanlines, { opacity: 0.12, duration: 0.1 }, '<')

  // Final radial close
  tl.to(radialClose, { opacity: 1, duration: 0.01 }, '-=0.1')
  tl.to(radialClose, {
    '--close-progress': 1,
    'duration': 0.5,
    'ease': 'power3.inOut',
  })

  // Fade out noise/scanlines
  tl.to([noise, scanlines], { opacity: 0, duration: 0.2 }, '-=0.3')

  tl.call(() => emit('complete'))
}

onMounted(() => {
  setTimeout(() => initAnimation(), 50)
})
</script>

<template>
  <div class="splash">
    <!-- Radial Reveal Overlay -->
    <div class="radial-reveal" />

    <!-- Noise/Signal Effects -->
    <div class="noise-overlay" />
    <div class="scanlines" />
    <div class="glitch-flash" />

    <!-- Background -->
    <div class="bg">
      <!-- Simple gradient background -->
      <div class="bg-gradient" />

      <!-- Central glow system -->
      <div class="center-effects">
        <!-- Core glow -->
        <div class="core-glow" />

        <!-- Pulse rings - controlled by GSAP only -->
        <div class="pulse-ring ring-1" />
        <div class="pulse-ring ring-2" />
        <div class="pulse-ring ring-3" />
      </div>
    </div>

    <!-- Logo -->
    <div class="logo-wrapper">
      <img src="/assets/images/logo/logo-bm-white.png" alt="" class="glitch-layer glitch-r" aria-hidden="true">
      <img src="/assets/images/logo/logo-bm-white.png" alt="" class="glitch-layer glitch-b" aria-hidden="true">
      <img src="/assets/images/logo/logo-bm-white.png" alt="BM" class="logo">
    </div>

    <!-- Text Container -->
    <div class="text-container">
      <span class="rgb-layer rgb-r" aria-hidden="true">BILLY MAULANA</span>
      <span class="rgb-layer rgb-b" aria-hidden="true">BILLY MAULANA</span>

      <h1 class="main-text">
        BILLY MAULANA
      </h1>

      <div class="sliced-text">
        <div class="text-slice" style="--slice: 0;">
          BILLY MAULANA
        </div>
        <div class="text-slice" style="--slice: 1;">
          BILLY MAULANA
        </div>
        <div class="text-slice" style="--slice: 2;">
          BILLY MAULANA
        </div>
        <div class="text-slice" style="--slice: 3;">
          BILLY MAULANA
        </div>
        <div class="text-slice" style="--slice: 4;">
          BILLY MAULANA
        </div>
        <div class="text-slice" style="--slice: 5;">
          BILLY MAULANA
        </div>
        <div class="text-slice" style="--slice: 6;">
          BILLY MAULANA
        </div>
        <div class="text-slice" style="--slice: 7;">
          BILLY MAULANA
        </div>
      </div>
    </div>

    <!-- Subtitle -->
    <p class="subtitle">
      FRONTEND DEVELOPER
    </p>

    <!-- Radial Close Overlay -->
    <div class="radial-close" />
  </div>
</template>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #030305;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ═══════════════════════════════════════════════════════════════
   NOISE / SIGNAL / GLITCH EFFECTS
   ═══════════════════════════════════════════════════════════════ */

.noise-overlay {
  position: absolute;
  inset: -10%;
  width: 120%;
  height: 120%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 90;
  mix-blend-mode: overlay;
}

.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 2px,
    rgba(59, 130, 246, 0.03) 2px,
    rgba(59, 130, 246, 0.03) 4px
  );
  pointer-events: none;
  z-index: 91;
}

.glitch-flash {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(59, 130, 246, 0.15) 20%,
    rgba(139, 92, 246, 0.2) 50%,
    rgba(59, 130, 246, 0.15) 80%,
    transparent 100%
  );
  pointer-events: none;
  z-index: 92;
}

/* Radial overlays */
.radial-reveal {
  --reveal-progress: 0;
  position: absolute;
  inset: 0;
  z-index: 100;
  background: #030305;
  mask-image: radial-gradient(
    circle at center,
    transparent calc(var(--reveal-progress) * 150%),
    black calc(var(--reveal-progress) * 150% + 2px)
  );
  -webkit-mask-image: radial-gradient(
    circle at center,
    transparent calc(var(--reveal-progress) * 150%),
    black calc(var(--reveal-progress) * 150% + 2px)
  );
  pointer-events: none;
}

.radial-close {
  --close-progress: 0;
  position: absolute;
  inset: 0;
  z-index: 100;
  background: #030305;
  mask-image: radial-gradient(
    circle at center,
    black calc((1 - var(--close-progress)) * 150%),
    transparent calc((1 - var(--close-progress)) * 150% + 2px)
  );
  -webkit-mask-image: radial-gradient(
    circle at center,
    black calc((1 - var(--close-progress)) * 150%),
    transparent calc((1 - var(--close-progress)) * 150% + 2px)
  );
  pointer-events: none;
}

/* Background */
.bg {
  position: absolute;
  inset: 0;
}

.bg-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      ellipse 80% 70% at 50% 50%,
      rgba(139, 92, 246, 0.12) 0%,
      rgba(124, 58, 237, 0.06) 50%,
      transparent 80%
    );
}

/* Center effects */
.center-effects {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.core-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.9) 10%,
    rgba(99, 102, 241, 1) 25%,
    rgba(139, 92, 246, 0.8) 45%,
    rgba(59, 130, 246, 0.4) 65%,
    transparent 100%
  );
  filter: blur(30px);
  will-change: transform, opacity;
  animation: corePulse 2.5s ease-in-out infinite;
}

@keyframes corePulse {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.85;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.12);
    opacity: 1;
  }
}

.pulse-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 2px solid;
  will-change: transform, opacity;
}

.ring-1 {
  width: 100px;
  height: 100px;
  border-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.7), 0 0 40px rgba(139, 92, 246, 0.5);
  animation: ringPulse1 2.5s ease-in-out infinite;
}

.ring-2 {
  width: 200px;
  height: 200px;
  border-color: rgba(99, 102, 241, 0.6);
  box-shadow: 0 0 25px rgba(59, 130, 246, 0.6), 0 0 50px rgba(139, 92, 246, 0.4);
  animation: ringPulse2 3s ease-in-out infinite;
}

.ring-3 {
  width: 320px;
  height: 320px;
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3);
  animation: ringPulse3 3.5s ease-in-out infinite;
}

@keyframes ringPulse1 {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.06);
    opacity: 1;
  }
}

@keyframes ringPulse2 {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.7;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.04);
    opacity: 0.95;
  }
}

@keyframes ringPulse3 {
  0%, 100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.55;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.02);
    opacity: 0.8;
  }
}

/* Logo */
.logo-wrapper {
  position: absolute;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: center;
  will-change: transform, opacity;
}

.logo {
  width: clamp(180px, 40vw, 400px);
  height: auto;
  filter:
    drop-shadow(0 0 15px rgba(255, 255, 255, 0.8))
    drop-shadow(0 0 30px rgba(59, 130, 246, 0.6))
    drop-shadow(0 0 55px rgba(139, 92, 246, 0.5));
  z-index: 3;
}

.glitch-layer {
  position: absolute;
  width: clamp(180px, 40vw, 400px);
  height: auto;
  pointer-events: none;
  will-change: transform, opacity;
}

.glitch-r {
  z-index: 1;
  filter: brightness(1.2) sepia(1) saturate(20) hue-rotate(240deg);
  mix-blend-mode: screen;
}

.glitch-b {
  z-index: 2;
  filter: brightness(1.4) sepia(1) saturate(25) hue-rotate(250deg);
  mix-blend-mode: screen;
}

/* Text container */
.text-container {
  position: absolute;
  z-index: 45;
  perspective: 800px;
}

/* RGB layers */
.rgb-layer {
  position: absolute;
  top: 0;
  left: 0;
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: clamp(32px, 10vw, 120px);
  font-weight: 900;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  white-space: nowrap;
  pointer-events: none;
  will-change: transform, opacity;
}

.rgb-r {
  color: #8b5cf6;
  text-shadow: 0 0 50px rgba(139, 92, 246, 1);
  mix-blend-mode: screen;
}

.rgb-b {
  color: #3b82f6;
  text-shadow: 0 0 50px rgba(59, 130, 246, 1);
  mix-blend-mode: screen;
}

/* Main text */
.main-text {
  position: relative;
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: clamp(32px, 10vw, 120px);
  font-weight: 900;
  letter-spacing: 0.03em;
  line-height: 1;
  margin: 0;
  text-transform: uppercase;
  white-space: nowrap;
  color: transparent;
  z-index: 1;
}

/* Sliced text */
.sliced-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  overflow: visible;
}

.text-slice {
  position: absolute;
  top: 0;
  left: 0;
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: clamp(32px, 10vw, 120px);
  font-weight: 900;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  white-space: nowrap;
  color: #fff;
  text-shadow:
    0 0 8px #fff,
    0 0 20px rgba(255, 255, 255, 0.9),
    0 0 35px rgba(59, 130, 246, 0.7),
    0 0 60px rgba(139, 92, 246, 0.5),
    0 0 90px rgba(59, 130, 246, 0.3);
  will-change: transform, opacity;
  transform-style: preserve-3d;

  clip-path: polygon(
    0 calc(var(--slice) * 12.5%),
    100% calc(var(--slice) * 12.5%),
    100% calc((var(--slice) + 1) * 12.5%),
    0 calc((var(--slice) + 1) * 12.5%)
  );
}

/* Subtitle */
.subtitle {
  position: absolute;
  top: calc(50% + clamp(70px, 14vw, 140px));
  z-index: 45;
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: clamp(10px, 1.3vw, 14px);
  font-weight: 500;
  letter-spacing: 0.4em;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  will-change: transform, opacity;
}

/* Responsive */
@media (max-width: 768px) {
  .logo,
  .glitch-layer {
    width: 150px;
  }

  .main-text,
  .rgb-layer,
  .text-slice {
    font-size: 26px;
    letter-spacing: 0.02em;
  }

  .subtitle {
    letter-spacing: 0.3em;
    top: calc(50% + 60px);
  }

  .core-glow {
    width: 80px;
    height: 80px;
  }

  .ring-1 { width: 60px; height: 60px; }
  .ring-2 { width: 110px; height: 110px; }
  .ring-3 { width: 170px; height: 170px; }
}
</style>
