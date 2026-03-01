<script setup lang="ts">
/**
 * SectionCTA — "The Invitation"
 * Full-viewport CTA with massive typography, text-scramble email,
 * magnetic hover, and atmospheric glow rings.
 *
 * Entrance: Scale+blur (LET'S/WORK), clip-path wipe (email), stagger (socials)
 * Visual object: Concentric pulse rings + animated radial glow
 * Hover: Text-scramble on email, animated underline on socials
 */

import { useParticleAttraction } from '~/composables/useParticleAttraction'
import { profile } from '~/constants/profile'

const { scramble } = useTextScramble({ speed: 25, iterations: 4 })

const sectionRef = ref<HTMLElement>()
const letsRef = ref<HTMLElement>()
const workRef = ref<HTMLElement>()
const emailRef = ref<HTMLElement>()
const emailTextRef = ref<HTMLElement>()
const socialsRef = ref<HTMLElement>()
const particleCanvasRef = ref<HTMLCanvasElement>()

// Particle attraction field — ambient dots with cursor gravity
useParticleAttraction(particleCanvasRef, sectionRef, {
  count: 100,
  attractRadius: 250,
  attractStrength: 0.04,
  driftSpeed: 0.25,
  trailAlpha: 0.06,
})

// Magnetic hover on email
useMagnetic(emailRef, { strength: 0.15, ease: 0.08 })

let ctx: gsap.Context | null = null

function handleEmailEnter() {
  if (emailTextRef.value) {
    scramble(emailTextRef.value)
  }
}

const socialLinks = [
  { label: 'GitHub', url: profile.github },
  { label: 'LinkedIn', url: profile.linkedin },
  { label: 'Instagram', url: profile.instagram },
]

onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced)
    return

  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    if (!sectionRef.value)
      return

    // 1. "LET'S" — scale from 1.5 + blur(20px) → 1 + blur(0)
    if (letsRef.value) {
      gsap.from(letsRef.value, {
        scale: 1.5,
        filter: 'blur(20px)',
        opacity: 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 70%',
        },
      })
    }

    // 2. "WORK" — follows 0.2s later, same effect
    if (workRef.value) {
      gsap.from(workRef.value, {
        scale: 1.5,
        filter: 'blur(20px)',
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 70%',
        },
      })
    }

    // 3. Email — clipPath wipe from right
    if (emailRef.value) {
      gsap.from(emailRef.value, {
        clipPath: 'inset(0 100% 0 0)',
        duration: 0.8,
        delay: 0.5,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 60%',
        },
      })
    }

    // 4. Social links — stagger reveal
    if (socialsRef.value) {
      const links = socialsRef.value.querySelectorAll('.cta__social-link')
      const separators = socialsRef.value.querySelectorAll('.cta__social-sep')

      gsap.from([...links, ...separators], {
        opacity: 0,
        yPercent: 60,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 55%',
        },
      })
    }
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    id="contact"
    ref="sectionRef"
    class="cta"
    aria-label="Get in Touch"
  >
    <!-- Particle attraction field — ambient dots with cursor gravity -->
    <canvas ref="particleCanvasRef" class="cta__particles" aria-hidden="true" />

    <!-- Animated radial glow — breathing CSS animation -->
    <div class="cta__glow" aria-hidden="true" />

    <!-- Concentric pulse rings -->
    <div class="cta__rings" aria-hidden="true">
      <div class="cta__ring" />
      <div class="cta__ring" />
      <div class="cta__ring" />
      <div class="cta__ring" />
    </div>

    <!-- Content -->
    <div class="cta__content">
      <!-- Heading -->
      <div class="cta__heading">
        <span ref="letsRef" class="cta__heading-line cta__heading-line--stroke">LET'S</span>
        <span ref="workRef" class="cta__heading-line cta__heading-line--fill">WORK</span>
      </div>

      <!-- Email with scramble + magnetic -->
      <a
        ref="emailRef"
        :href="`mailto:${profile.email}`"
        class="cta__email"
        data-cursor="link"
        @mouseenter="handleEmailEnter"
      >
        <span ref="emailTextRef" :data-original-text="profile.email">{{ profile.email }}</span>
      </a>

      <!-- Social links -->
      <nav ref="socialsRef" class="cta__socials" aria-label="Social links">
        <template v-for="(link, i) in socialLinks" :key="link.label">
          <a
            :href="link.url"
            class="cta__social-link"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
          >{{ link.label }}</a>
          <span v-if="i < socialLinks.length - 1" class="cta__social-sep" aria-hidden="true">/</span>
        </template>
      </nav>
    </div>

    <!-- Ghost section number -->
    <span class="cta__ghost" aria-hidden="true">06</span>
  </section>
</template>

<style scoped>
/* ═══ Section ═══ */

.cta {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--void-warm);
  overflow: hidden;
}

/* ═══ Particle attraction canvas ═══ */

.cta__particles {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  mix-blend-mode: screen;
}

/* ═══ Animated radial glow — breathing ═══ */

.cta__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 60vmax;
  height: 60vmax;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(0, 71, 255, 0.12) 0%,
    rgba(0, 71, 255, 0.05) 40%,
    transparent 70%
  );
  z-index: 0;
  pointer-events: none;
  animation: cta-breathe 4s ease-in-out infinite;
}

@keyframes cta-breathe {
  0%, 100% {
    opacity: 0.15;
    transform: translate(-50%, -50%) scale(0.95);
  }
  50% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

/* ═══ Concentric pulse rings ═══ */

.cta__rings {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.cta__ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(0, 71, 255, 0.15);
  animation: cta-ring-pulse 6s ease-in-out infinite;
}

.cta__ring:nth-child(1) {
  width: 200px;
  height: 200px;
  animation-delay: 0s;
}

.cta__ring:nth-child(2) {
  width: 400px;
  height: 400px;
  animation-delay: -1.5s;
  border-color: rgba(0, 71, 255, 0.1);
}

.cta__ring:nth-child(3) {
  width: 600px;
  height: 600px;
  animation-delay: -3s;
  border-color: rgba(0, 163, 255, 0.08);
}

.cta__ring:nth-child(4) {
  width: 800px;
  height: 800px;
  animation-delay: -4.5s;
  border-color: rgba(0, 245, 255, 0.06);
}

@keyframes cta-ring-pulse {
  0%, 100% {
    transform: scale(0.95);
    opacity: 0.4;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

/* ═══ Content ═══ */

.cta__content {
  position: relative;
  z-index: var(--z-content);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding-inline: var(--page-margin);
  text-align: center;
}

/* ═══ Heading ═══ */

.cta__heading {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.cta__heading-line {
  display: block;
  font-family: var(--font-statement);
  font-size: clamp(4rem, 12vw, 12rem);
  font-weight: 800;
  line-height: var(--leading-hero);
  letter-spacing: var(--tracking-hero);
  text-transform: uppercase;
  will-change: transform, filter;
}

.cta__heading-line--stroke {
  color: transparent;
  -webkit-text-stroke: 2px rgba(0, 71, 255, 0.6);
  -webkit-text-fill-color: transparent;
}

.cta__heading-line--fill {
  color: var(--text-primary);
}

/* ═══ Email link — scramble + magnetic ═══ */

.cta__email {
  position: relative;
  display: inline-block;
  font-family: var(--font-interface);
  font-size: clamp(1rem, 2vw, 2rem);
  font-weight: 500;
  color: var(--chrome-mid);
  letter-spacing: var(--tracking-label);
  text-decoration: none;
  transition: color 0.4s var(--ease-out-expo);
  will-change: transform;
  clip-path: inset(0);
}

.cta__email:hover {
  color: var(--text-primary);
}

.cta__email::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, var(--event-blue), var(--event-cyan));
  box-shadow: 0 0 8px rgba(0, 71, 255, 0.3);
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.5s var(--ease-out-expo);
}

.cta__email:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

/* ═══ Social links ═══ */

.cta__socials {
  display: flex;
  align-items: center;
  gap: clamp(0.75rem, 1.5vw, 1.5rem);
}

.cta__social-link {
  position: relative;
  font-family: var(--font-system);
  font-size: var(--text-small);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--chrome-dark);
  text-decoration: none;
  transition: color 0.3s var(--ease-out-expo);
}

.cta__social-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--accent-light);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s var(--ease-out-expo);
}

.cta__social-link:hover {
  color: var(--text-primary);
}

.cta__social-link:hover::after {
  transform: scaleX(1);
}

.cta__social-sep {
  font-family: var(--font-system);
  font-size: var(--text-small);
  color: var(--chrome-dark);
  opacity: 0.4;
  user-select: none;
}

/* ═══ Ghost section number ═══ */

.cta__ghost {
  position: absolute;
  bottom: clamp(2rem, 5vh, 4rem);
  right: var(--page-margin);
  font-family: var(--font-statement);
  font-size: clamp(5rem, 12vw, 12rem);
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.02em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(0, 71, 255, 0.08);
  -webkit-text-fill-color: transparent;
  pointer-events: none;
  user-select: none;
  mix-blend-mode: difference;
}

/* ═══ Responsive ═══ */

@media (max-width: 768px) {
  .cta__heading-line {
    font-size: clamp(3rem, 16vw, 6rem);
  }

  .cta__heading-line--stroke {
    -webkit-text-stroke-width: 1.5px;
  }

  .cta__email {
    font-size: clamp(0.875rem, 3.5vw, 1.25rem);
  }

  .cta__socials {
    gap: 0.75rem;
  }
}

/* ═══ Reduced Motion ═══ */

@media (prefers-reduced-motion: reduce) {
  .cta__glow {
    animation: none;
    opacity: 0.08;
  }

  .cta__ring {
    animation: none;
    opacity: 0.5;
  }

  .cta__email {
    transition: none;
  }

  .cta__social-link {
    transition: none;
  }
}
</style>
