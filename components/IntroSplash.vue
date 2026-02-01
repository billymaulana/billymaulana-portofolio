<script setup lang="ts">
/**
 * IntroSplash - Cinematic Iris Wipe + Glitch Effect
 * Inspired by: skizophonic.com
 *
 * Sequence: Glitch in → Logo → Iris wipe → Text reveal → Glitch out
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
  const logo = container.querySelector('.logo-wrapper')
  const logoImg = container.querySelector('.logo')
  const logoGlitchLayers = container.querySelectorAll('.glitch-layer')
  const irisSegments = container.querySelectorAll('.iris-segment')
  const scanlines = container.querySelector('.scanlines')
  const noise = container.querySelector('.noise')
  const textChars = container.querySelectorAll('.char')
  const subtitle = container.querySelector('.subtitle')

  // Initial states
  gsap.set(logo, { opacity: 0, scale: 0.9 })
  gsap.set(logoGlitchLayers, { opacity: 0 })
  gsap.set(irisSegments, { scale: 0, rotation: 0 })
  gsap.set(scanlines, { opacity: 0 })
  gsap.set(noise, { opacity: 0 })
  gsap.set(textChars, { y: 120, opacity: 0, rotateX: -60 })
  gsap.set(subtitle, { opacity: 0, y: 30 })

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      gsap.to(container, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2.inOut',
        onComplete: () => emit('complete'),
      })
    },
  })

  // === PHASE 1: Glitch intro + Logo appears ===
  // Noise flash
  tl.to(noise, {
    opacity: 0.15,
    duration: 0.1,
  })

  tl.to(noise, {
    opacity: 0,
    duration: 0.1,
  })

  // Scanlines appear
  tl.to(scanlines, {
    opacity: 0.4,
    duration: 0.2,
  }, '-=0.1')

  // Logo with glitch effect
  tl.to(logo, {
    opacity: 1,
    scale: 1,
    duration: 0.8,
    ease: 'power2.out',
  })

  // RGB split glitch on entry
  tl.to(logoGlitchLayers[0], {
    opacity: 0.8,
    x: -4,
    duration: 0.05,
  }, '-=0.6')

  tl.to(logoGlitchLayers[1], {
    opacity: 0.8,
    x: 4,
    duration: 0.05,
  }, '-=0.55')

  // Glitch flicker
  tl.to(logoGlitchLayers, {
    opacity: 0,
    x: 0,
    duration: 0.1,
  }, '-=0.4')

  tl.to(logoGlitchLayers[0], {
    opacity: 0.6,
    x: -6,
    duration: 0.03,
  }, '-=0.2')

  tl.to(logoGlitchLayers[1], {
    opacity: 0.6,
    x: 6,
    duration: 0.03,
  }, '-=0.18')

  tl.to(logoGlitchLayers, {
    opacity: 0,
    x: 0,
    duration: 0.15,
  })

  // Scanlines fade
  tl.to(scanlines, {
    opacity: 0.1,
    duration: 0.5,
  }, '-=0.3')

  // === PHASE 2: Hold logo ===
  tl.to({}, { duration: 0.6 })

  // === PHASE 3: Logo exit with glitch ===
  // Glitch burst before exit
  tl.to(noise, {
    opacity: 0.2,
    duration: 0.05,
  })

  tl.to(logoGlitchLayers[0], {
    opacity: 0.9,
    x: -8,
    y: 2,
    duration: 0.04,
  }, '-=0.03')

  tl.to(logoGlitchLayers[1], {
    opacity: 0.9,
    x: 8,
    y: -2,
    duration: 0.04,
  }, '-=0.03')

  tl.to([logo, logoGlitchLayers, noise], {
    opacity: 0,
    scale: 0.95,
    duration: 0.3,
    ease: 'power2.in',
  })

  // === PHASE 4: Iris wipe reveal ===
  tl.to(irisSegments, {
    scale: 1,
    rotation: (i) => i * 30,
    duration: 1.2,
    ease: 'power3.inOut',
    stagger: {
      each: 0.04,
      from: 'center',
    },
  }, '-=0.1')

  // === PHASE 5: Text reveal ===
  tl.to(textChars, {
    y: 0,
    opacity: 1,
    rotateX: 0,
    duration: 1,
    ease: 'power3.out',
    stagger: {
      each: 0.04,
      ease: 'power2.in',
    },
  }, '-=0.6')

  // Subtitle
  tl.to(subtitle, {
    opacity: 0.5,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
  }, '-=0.5')

  // === PHASE 6: Appreciate ===
  tl.to({}, { duration: 1.8 })

  // === PHASE 7: Exit with glitch ===
  // Subtle glitch flash
  tl.to(scanlines, {
    opacity: 0.5,
    duration: 0.1,
  })

  tl.to(noise, {
    opacity: 0.1,
    duration: 0.08,
  })

  // Iris segments expand out
  tl.to(irisSegments, {
    scale: 2.5,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.in',
    stagger: {
      each: 0.03,
      from: 'edges',
    },
  }, '-=0.1')

  // Text exit
  tl.to(textChars, {
    y: -80,
    opacity: 0,
    duration: 0.5,
    ease: 'power3.in',
    stagger: 0.02,
  }, '-=0.7')

  tl.to(subtitle, {
    opacity: 0,
    y: -40,
    duration: 0.4,
    ease: 'power2.in',
  }, '-=0.5')

  // Final cleanup
  tl.to([scanlines, noise], {
    opacity: 0,
    duration: 0.2,
  }, '-=0.3')
}

onMounted(() => {
  setTimeout(() => initAnimation(), 100)
})
</script>

<template>
  <div class="splash">
    <!-- Noise overlay -->
    <div class="noise" />

    <!-- Scanlines -->
    <div class="scanlines" />

    <!-- Logo with glitch layers -->
    <div class="logo-wrapper">
      <!-- RGB Glitch layers -->
      <img
        src="/assets/images/logo/logo-bm-white.png"
        alt=""
        class="glitch-layer glitch-r"
        aria-hidden="true"
      >
      <img
        src="/assets/images/logo/logo-bm-white.png"
        alt=""
        class="glitch-layer glitch-b"
        aria-hidden="true"
      >
      <!-- Main logo -->
      <img
        src="/assets/images/logo/logo-bm-white.png"
        alt="BM"
        class="logo"
      >
    </div>

    <!-- Iris wipe segments -->
    <div class="iris-container">
      <div class="iris-segment seg-1" />
      <div class="iris-segment seg-2" />
      <div class="iris-segment seg-3" />
      <div class="iris-segment seg-4" />
      <div class="iris-segment seg-5" />
      <div class="iris-segment seg-6" />
      <div class="iris-segment seg-7" />
      <div class="iris-segment seg-8" />
      <div class="iris-segment seg-9" />
      <div class="iris-segment seg-10" />
      <div class="iris-segment seg-11" />
      <div class="iris-segment seg-12" />
    </div>

    <!-- Text with blend mode -->
    <div class="text-container">
      <h1 class="title">
        <span class="char">B</span>
        <span class="char">i</span>
        <span class="char">l</span>
        <span class="char">l</span>
        <span class="char">y</span>
        <span class="char space">&nbsp;</span>
        <span class="char">M</span>
        <span class="char">a</span>
        <span class="char">u</span>
        <span class="char">l</span>
        <span class="char">a</span>
        <span class="char">n</span>
        <span class="char">a</span>
      </h1>
    </div>

    <p class="subtitle">
      Frontend Developer
    </p>
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

/* Noise overlay */
.noise {
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0;
  pointer-events: none;
  z-index: 100;
  animation: noiseShift 0.1s steps(2) infinite;
}

@keyframes noiseShift {
  0% { transform: translate(0, 0); }
  50% { transform: translate(-5%, -5%); }
  100% { transform: translate(5%, 5%); }
}

/* Scanlines */
.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.3) 2px,
    rgba(0, 0, 0, 0.3) 4px
  );
  pointer-events: none;
  z-index: 99;
  opacity: 0;
}

/* Logo */
.logo-wrapper {
  position: absolute;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  width: clamp(320px, 65vw, 700px);
  height: auto;
  position: relative;
  z-index: 2;
}

.glitch-layer {
  position: absolute;
  width: clamp(320px, 65vw, 700px);
  height: auto;
  pointer-events: none;
}

.glitch-r {
  z-index: 1;
  filter: hue-rotate(-60deg) saturate(2);
  mix-blend-mode: screen;
}

.glitch-b {
  z-index: 3;
  filter: hue-rotate(180deg) saturate(2);
  mix-blend-mode: screen;
}

/* Iris wipe segments */
.iris-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 5;
}

.iris-segment {
  position: absolute;
  width: 250vmax;
  height: 250vmax;
  clip-path: polygon(50% 50%, 50% 0%, 100% 0%);
  transform-origin: center;
}

/* Alternating black and white segments */
.seg-1 { background: #fff; transform: rotate(0deg); }
.seg-2 { background: #000; transform: rotate(30deg); }
.seg-3 { background: #fff; transform: rotate(60deg); }
.seg-4 { background: #000; transform: rotate(90deg); }
.seg-5 { background: #fff; transform: rotate(120deg); }
.seg-6 { background: #000; transform: rotate(150deg); }
.seg-7 { background: #fff; transform: rotate(180deg); }
.seg-8 { background: #000; transform: rotate(210deg); }
.seg-9 { background: #fff; transform: rotate(240deg); }
.seg-10 { background: #000; transform: rotate(270deg); }
.seg-11 { background: #fff; transform: rotate(300deg); }
.seg-12 { background: #000; transform: rotate(330deg); }

/* Text */
.text-container {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  mix-blend-mode: difference;
  perspective: 600px;
}

.title {
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: clamp(40px, 14vw, 160px);
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 0.95;
  color: #fff;
  margin: 0;
  text-transform: uppercase;
  display: flex;
  overflow: hidden;
}

.char {
  display: inline-block;
  will-change: transform, opacity;
  transform-style: preserve-3d;
}

.space {
  width: 0.2em;
}

.subtitle {
  position: absolute;
  bottom: 38%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: clamp(12px, 2vw, 18px);
  font-weight: 500;
  letter-spacing: 0.35em;
  color: #fff;
  text-transform: uppercase;
  mix-blend-mode: difference;
}

@media (max-width: 768px) {
  .logo,
  .glitch-layer {
    width: 280px;
  }

  .title {
    letter-spacing: -0.02em;
  }

  .subtitle {
    letter-spacing: 0.2em;
    bottom: 35%;
  }

  .iris-segment {
    width: 300vmax;
    height: 300vmax;
  }
}
</style>
