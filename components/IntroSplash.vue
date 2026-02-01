<script setup lang="ts">
/**
 * IntroSplash - Hypnotic Spiral + Logo + Text Reveal
 * Inspired by: skizophonic.com, stellapetkova.com
 *
 * Sequence: Logo → Circles expand → Text reveal
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
  const circles = container.querySelectorAll('.circle')
  const textChars = container.querySelectorAll('.char')
  const subtitle = container.querySelector('.subtitle')

  // Initial states - everything hidden
  gsap.set(logo, { opacity: 0, scale: 0.5 })
  gsap.set(circles, { scale: 0 })
  gsap.set(textChars, { y: 100, opacity: 0, rotateX: -40 })
  gsap.set(subtitle, { opacity: 0, y: 20 })

  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: () => {
      gsap.to(container, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => emit('complete'),
      })
    },
  })

  // Phase 1: Logo appears
  tl.to(logo, {
    opacity: 1,
    scale: 1,
    duration: 1,
    ease: 'back.out(1.2)',
  })

  // Phase 2: Hold logo
  tl.to({}, { duration: 0.8 })

  // Phase 3: Logo fades out completely before circles
  tl.to(logo, {
    opacity: 0,
    scale: 0.8,
    duration: 0.6,
    ease: 'power2.inOut',
  })

  // Phase 4: Circles bloom from center (smooth stagger)
  tl.to(circles, {
    scale: 1,
    duration: 1.4,
    ease: 'power2.out',
    stagger: {
      each: 0.1,
      from: 'end',
    },
  }, '-=0.4')

  // Phase 5: Text characters reveal (smooth cascade)
  tl.to(textChars, {
    y: 0,
    opacity: 1,
    rotateX: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger: {
      each: 0.035,
      ease: 'power2.in',
    },
  }, '-=0.8')

  // Phase 6: Subtitle fades in
  tl.to(subtitle, {
    opacity: 0.5,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
  }, '-=0.4')

  // Phase 7: Hold to appreciate
  tl.to({}, { duration: 2 })

  // Phase 8: Exit - circles expand out
  tl.to(circles, {
    scale: 2,
    opacity: 0,
    duration: 1,
    ease: 'power2.in',
    stagger: {
      each: 0.06,
      from: 'start',
    },
  })

  // Phase 9: Text and logo exit
  tl.to(textChars, {
    y: -60,
    opacity: 0,
    duration: 0.5,
    ease: 'power3.in',
    stagger: 0.02,
  }, '-=0.8')

  tl.to(subtitle, {
    opacity: 0,
    y: -30,
    duration: 0.4,
    ease: 'power2.in',
  }, '-=0.5')
}

onMounted(() => {
  setTimeout(() => initAnimation(), 100)
})
</script>

<template>
  <div class="splash">
    <!-- Logo -->
    <div class="logo-container">
      <img
        src="/assets/images/logo/logo-bm-white.png"
        alt="BM"
        class="logo"
      >
    </div>

    <!-- Concentric circles -->
    <div class="circles-container">
      <div class="circle circle-1" />
      <div class="circle circle-2" />
      <div class="circle circle-3" />
      <div class="circle circle-4" />
      <div class="circle circle-5" />
      <div class="circle circle-6" />
      <div class="circle circle-7" />
    </div>

    <!-- Text overlay with blend mode -->
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

    <!-- Subtitle outside blend mode for visibility -->
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

/* Logo */
.logo-container {
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

/* Concentric circles */
.circles-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
}

/* More circles for smoother gradient effect */
.circle-1 {
  width: 200vmax;
  height: 200vmax;
  background: #fff;
}

.circle-2 {
  width: 170vmax;
  height: 170vmax;
  background: #000;
}

.circle-3 {
  width: 140vmax;
  height: 140vmax;
  background: #fff;
}

.circle-4 {
  width: 110vmax;
  height: 110vmax;
  background: #000;
}

.circle-5 {
  width: 80vmax;
  height: 80vmax;
  background: #fff;
}

.circle-6 {
  width: 50vmax;
  height: 50vmax;
  background: #000;
}

.circle-7 {
  width: 25vmax;
  height: 25vmax;
  background: #fff;
}

/* Text with difference blend */
.text-container {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  mix-blend-mode: difference;
  perspective: 500px;
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
  .logo {
    width: 280px;
  }

  .title {
    letter-spacing: -0.02em;
  }

  .subtitle {
    letter-spacing: 0.2em;
    bottom: 35%;
  }
}
</style>
