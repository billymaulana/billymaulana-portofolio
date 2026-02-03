<script setup lang="ts">
/**
 * HeroSection - Awwwards Level Typography & Animation
 * ═══════════════════════════════════════════════════════════════
 * Bold, minimal, typography-focused hero with premium animations
 * Inspired by: Locomotive, Studio Freight, Aristide Benoist
 */

import { useTextScramble } from '~/composables/useTextScramble'
import { profile } from '~/data/profile'

const heroRef = ref<HTMLElement | null>(null)
const nameRef = ref<HTMLElement | null>(null)
const firstNameRef = ref<HTMLElement | null>(null)
const lastNameRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const scrollRef = ref<HTMLElement | null>(null)
const decorRef = ref<HTMLElement | null>(null)

const { setupHoverScramble } = useTextScramble()

// Split text into characters
const firstName = profile.firstName.toUpperCase().split('')
const lastName = profile.lastName.toUpperCase().split('')

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  // Setup text scramble on name hover
  if (firstNameRef.value)
    setupHoverScramble(firstNameRef.value)
  if (lastNameRef.value)
    setupHoverScramble(lastNameRef.value)

  // ═══════════════════════════════════════════════════════════════
  // SCROLL PARALLAX - Enhanced
  // (Entrance animations are handled by app.vue after splash)
  // ═══════════════════════════════════════════════════════════════
  if (heroRef.value && nameRef.value) {
    // Name moves up on scroll with blur
    gsap.to(nameRef.value, {
      y: -180,
      filter: 'blur(3px)',
      opacity: 0.3,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.value,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
      },
    })

    // Subtitle moves slower with fade
    if (subtitleRef.value) {
      gsap.to(subtitleRef.value, {
        y: -100,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.value,
          start: 'top top',
          end: '80% top',
          scrub: 1,
        },
      })
    }

    // Decorative lines expand on scroll
    if (decorRef.value) {
      gsap.to(decorRef.value.querySelectorAll('.decor-line'), {
        scaleX: 2,
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }
  }
})
</script>

<template>
  <section ref="heroRef" class="hero">
    <!-- Background Grid with Gradient -->
    <div class="hero-bg">
      <div class="hero-grid" />
      <div class="hero-gradient" />
    </div>

    <!-- Decorative Lines -->
    <div ref="decorRef" class="hero-decor">
      <div class="decor-line decor-line-1" />
      <div class="decor-line decor-line-2" />
      <div class="decor-line decor-line-3" />
    </div>

    <!-- Main Content -->
    <div class="hero-content">
      <!-- Name - MASSIVE Typography -->
      <h1 ref="nameRef" class="hero-name">
        <span ref="firstNameRef" class="name-line name-scramble" data-cursor-mode="text">
          <span v-for="(char, i) in firstName" :key="`first-${i}`" class="hero-char">
            {{ char }}
          </span>
        </span>
        <span ref="lastNameRef" class="name-line name-outline name-scramble" data-cursor-mode="text">
          <span v-for="(char, i) in lastName" :key="`last-${i}`" class="hero-char">
            {{ char }}
          </span>
        </span>
      </h1>

      <!-- Subtitle with Enhanced Colors -->
      <div ref="subtitleRef" class="hero-subtitle">
        <span class="subtitle-word">Transforming</span>
        <span class="subtitle-word accent">pixels</span>
        <span class="subtitle-word">into</span>
        <span class="subtitle-word highlight">performance.</span>
      </div>
    </div>

    <!-- Scroll Indicator - Centered -->
    <div ref="scrollRef" class="hero-scroll">
      <span class="scroll-text">scroll down</span>
      <div class="scroll-line">
        <div class="scroll-progress" />
      </div>
    </div>

    <!-- Corner Accents -->
    <div class="hero-corners">
      <div class="corner corner-tl" />
      <div class="corner corner-tr" />
      <div class="corner corner-bl" />
      <div class="corner corner-br" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 140px 64px 100px;
  position: relative;
  background: #000;
  overflow: hidden;
}

/* Background */
.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(0, 245, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 245, 255, 0.03) 1px, transparent 1px);
  background-size: 80px 80px;
}

.hero-gradient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0, 245, 255, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 100% 100%, rgba(0, 245, 255, 0.05) 0%, transparent 50%);
}

/* Decorative Lines */
.hero-decor {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.decor-line {
  position: absolute;
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(0, 245, 255, 0.3) 50%, transparent 100%);
  transform-origin: center;
}

.decor-line-1 {
  top: 25%;
  left: 10%;
  width: 30%;
}

.decor-line-2 {
  top: 60%;
  right: 5%;
  width: 25%;
}

.decor-line-3 {
  bottom: 20%;
  left: 20%;
  width: 20%;
}

/* Content */
.hero-content {
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  position: relative;
  z-index: 1;
}

/* ═══════════════════════════════════════════════════════════════
   NAME TYPOGRAPHY - Locomotive Style Enhanced
   ═══════════════════════════════════════════════════════════════ */
.hero-name {
  font-family: 'Satoshi', sans-serif;
  font-weight: 900;
  font-size: clamp(60px, 14vw, 200px);
  line-height: 0.88;
  text-transform: uppercase;
  letter-spacing: -0.04em;
  margin: 0 0 3.5rem;
  color: #fff;
  perspective: 1000px;
}

.name-line {
  display: block;
  overflow: hidden;
  cursor: pointer;
  transition: color 0.4s ease, text-shadow 0.4s ease;
}

/* Hover effect with glow */
.name-scramble:hover {
  color: #00F5FF;
  text-shadow: 0 0 60px rgba(0, 245, 255, 0.3);
}

.name-outline.name-scramble:hover {
  -webkit-text-stroke-color: #00F5FF;
  filter: drop-shadow(0 0 30px rgba(0, 245, 255, 0.3));
}

.hero-char {
  display: inline-block;
  transform-style: preserve-3d;
  will-change: transform, opacity, filter;
}

/* Outlined text for last name with purple stroke */
.name-outline {
  -webkit-text-stroke: 2px rgba(0, 245, 255, 0.6);
  -webkit-text-fill-color: transparent;
  transition: -webkit-text-stroke-color 0.4s ease, filter 0.4s ease;
}

/* ═══════════════════════════════════════════════════════════════
   SUBTITLE - Enhanced Colors
   ═══════════════════════════════════════════════════════════════ */
.hero-subtitle {
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.5em;
  font-family: 'Satoshi', sans-serif;
  font-size: clamp(18px, 3vw, 32px);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 4rem;
  max-width: 650px;
}

.subtitle-word {
  display: inline-block;
  will-change: transform, opacity, filter;
}

/* Purple accent word */
.subtitle-word.accent {
  color: rgba(0, 245, 255, 0.9);
  font-weight: 500;
}

/* Highlight with glow */
.subtitle-word.highlight {
  color: #00F5FF;
  font-weight: 600;
  text-shadow: 0 0 30px rgba(0, 245, 255, 0.3);
}

/* ═══════════════════════════════════════════════════════════════
   SCROLL INDICATOR - Centered Minimal Style
   ═══════════════════════════════════════════════════════════════ */
.hero-scroll {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  z-index: 10;
}

.scroll-text {
  font-family: 'Satoshi', sans-serif;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.3s ease;
}

.hero-scroll:hover .scroll-text {
  color: #00F5FF;
}

.scroll-line {
  width: 1px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.scroll-progress {
  width: 100%;
  height: 20px;
  background: linear-gradient(180deg, #00F5FF 0%, transparent 100%);
  position: absolute;
  top: 0;
  animation: scroll-pulse 2s ease-in-out infinite;
}

@keyframes scroll-pulse {
  0% {
    top: -20px;
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  100% {
    top: 60px;
    opacity: 0;
  }
}

/* ═══════════════════════════════════════════════════════════════
   CORNER ACCENTS
   ═══════════════════════════════════════════════════════════════ */
.hero-corners {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 40px;
  height: 40px;
  border-color: rgba(0, 245, 255, 0.2);
  border-style: solid;
  border-width: 0;
}

.corner-tl {
  top: 32px;
  left: 32px;
  border-top-width: 1px;
  border-left-width: 1px;
}

.corner-tr {
  top: 32px;
  right: 32px;
  border-top-width: 1px;
  border-right-width: 1px;
}

.corner-bl {
  bottom: 32px;
  left: 32px;
  border-bottom-width: 1px;
  border-left-width: 1px;
}

.corner-br {
  bottom: 32px;
  right: 32px;
  border-bottom-width: 1px;
  border-right-width: 1px;
}

/* ═══════════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════════ */
@media (max-width: 1024px) {
  .hero {
    padding: 120px 48px 80px;
  }

  .hero-scroll {
    bottom: 40px;
  }

  .corner {
    width: 30px;
    height: 30px;
  }

  .corner-tl, .corner-bl { left: 24px; }
  .corner-tr, .corner-br { right: 24px; }
  .corner-tl, .corner-tr { top: 24px; }
  .corner-bl, .corner-br { bottom: 24px; }
}

@media (max-width: 768px) {
  .hero {
    padding: 100px 24px 60px;
    justify-content: center;
  }

  .hero-name {
    font-size: clamp(44px, 16vw, 90px);
    margin-bottom: 2.5rem;
  }

  .name-outline {
    -webkit-text-stroke: 1.5px rgba(0, 245, 255, 0.6);
  }

  .hero-subtitle {
    font-size: 16px;
    margin-bottom: 3rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .hero-scroll {
    bottom: 30px;
  }

  .scroll-line {
    height: 40px;
  }

  .scroll-text {
    font-size: 10px;
    letter-spacing: 0.2em;
  }

  .hero-decor {
    display: none;
  }

  .corner {
    width: 24px;
    height: 24px;
  }

  .corner-tl, .corner-bl { left: 16px; }
  .corner-tr, .corner-br { right: 16px; }
  .corner-tl, .corner-tr { top: 16px; }
  .corner-bl, .corner-br { bottom: 16px; }
}
</style>
