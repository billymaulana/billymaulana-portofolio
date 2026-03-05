<script setup lang="ts">
/**
 * SectionHero — "The Statement"
 * Atmospheric Fluid x WebGL Text Distortion
 *
 * Layer Stack (bottom → top):
 * 0. Section bg: void-blue with subtle atmospheric gradients
 * 1. .hero__canvas: WebGL fluid sim as full-viewport atmospheric background (mix-blend-mode: screen)
 * 2. .hero__grain: noise texture overlay (mix-blend-mode: overlay)
 * 3. .hero__content: WebGL text distortion canvas + subtitle (mix-blend-mode: difference)
 * 4. .hero__scroll: vertical line scroll indicator + "Explore"
 *
 * WOW MOMENT: Full-viewport fluid simulation that reacts to mouse
 * movement. Text is rendered via WebGL with FBM noise displacement,
 * swirl vortex, ripple waves, and chromatic aberration — pixels of
 * the letterforms organically warp around the cursor (CRZ.STUDIO technique).
 * Text-fluid interaction via mix-blend-mode: difference on content layer.
 *
 * Reference: crz.studio (WebGL text vertex displacement),
 * daspritam.in (fluid background, blended via screen mode).
 */

import { useFluidSimulation } from '~/composables/useFluidSimulation'
import { useTextScramble } from '~/composables/useTextScramble'

const sectionRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const contentRef = ref<HTMLElement>()
const textCanvasRef = ref<HTMLCanvasElement>()
const subtitleRef = ref<HTMLElement>()
const scrollRef = ref<HTMLElement>()
const scrollLineRef = ref<HTMLElement>()

const fluid = useFluidSimulation()
const { scramble: scrambleText } = useTextScramble({ speed: 25, iterations: 4 })
let gsapCtx: gsap.Context | null = null
let resizeObserver: ResizeObserver | null = null
let fluidActivated = false

/* ─── Text Distortion (WebGL) ─── */
let textDistortion: ReturnType<typeof import('~/composables/useTextDistortion').useTextDistortion> | null = null
let textResizeHandler: (() => void) | null = null
const isTextReady = ref(false)

/** Compute actual font size from CSS custom property --text-hero */
function computeHeroFontSize(): number {
  const styles = getComputedStyle(document.documentElement)
  const heroSize = styles.getPropertyValue('--text-hero').trim()
  const clampMatch = heroSize.match(/clamp\(\s*([\d.]+)rem\s*,\s*([\d.]+)vw\s*,\s*([\d.]+)rem\s*\)/)
  if (clampMatch) {
    const rootFs = Number.parseFloat(styles.fontSize) || 16
    const minPx = Number.parseFloat(clampMatch[1]!) * rootFs
    const vwPx = (Number.parseFloat(clampMatch[2]!) / 100) * window.innerWidth
    const maxPx = Number.parseFloat(clampMatch[3]!) * rootFs
    return Math.min(Math.max(minPx, Math.min(vwPx, maxPx)), 400)
  }
  const vwMatch = heroSize.match(/([\d.]+)vw/)
  if (vwMatch)
    return Math.min((Number.parseFloat(vwMatch[1]!) / 100) * window.innerWidth, 400)
  return 200
}

/* ─── Lifecycle ─── */

onMounted(async () => {
  if (!canvasRef.value)
    return

  const success = fluid.init(canvasRef.value, { skipInitialSplats: true })
  if (!success)
    return

  // Start with canvas invisible — fluid activates on first mouse move
  canvasRef.value.style.opacity = '0'

  // Resize handling — fluid auto-adapts to viewport
  resizeObserver = new ResizeObserver(() => {
    fluid.resize()
  })
  resizeObserver.observe(canvasRef.value)

  // Skip animations for reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced)
    return

  // ── Init WebGL text distortion (CRZ.STUDIO-inspired displacement shader) ──
  if (textCanvasRef.value) {
    const { useTextDistortion } = await import('~/composables/useTextDistortion')
    await document.fonts.ready

    const sim = useTextDistortion({
      fontSize: computeHeroFontSize(),
      intensity: 0.06,
      chromaticSpread: 0,
      lines: [
        { text: 'BILLY', indent: 0 },
        { text: 'MAULANA', indent: 160 },
      ],
    })

    const initOk = sim.init(textCanvasRef.value)
    if (initOk) {
      textDistortion = sim
      textResizeHandler = () => {
        textDistortion?.updateFontSize(computeHeroFontSize())
      }
      window.addEventListener('resize', textResizeHandler)

      // Start with slight delay for coordinated entrance
      setTimeout(() => {
        sim.start()
        isTextReady.value = true
      }, 300)
    }
  }

  // ── First mouse move → activate fluid ──
  function onFirstPointerMove() {
    if (fluidActivated || !canvasRef.value)
      return
    fluidActivated = true
    import('gsap').then(({ default: g }) => {
      g.to(canvasRef.value!, {
        opacity: 1,
        duration: 1.2,
        ease: 'power2.out',
      })
    })
  }
  sectionRef.value?.addEventListener('pointermove', onFirstPointerMove)

  // ── GSAP setup ──
  const gsapModule = await import('gsap')
  const gsap = gsapModule.default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  gsapCtx = gsap.context(() => {
    // ══════════════════════════════════════════════════════════
    // ENTRANCE SEQUENCE — choreographed reveal
    // Text canvas fades in via CSS transition (isTextReady),
    // then subtitle + scroll indicator follow via GSAP timeline.
    // ══════════════════════════════════════════════════════════

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

    // Subtitle: ScrambleText reveal — chars scramble then resolve elegantly
    if (subtitleRef.value) {
      const subEl = subtitleRef.value
      subEl.style.opacity = '0'
      tl.call(() => {
        subEl.style.opacity = '1'
        scrambleText(subEl)
      }, [], 1.0)
    }

    // Scroll indicator: line extends + text appears
    if (scrollLineRef.value) {
      tl.fromTo(scrollLineRef.value, {
        scaleY: 0,
      }, {
        scaleY: 1,
        duration: 1,
        ease: 'expo.inOut',
      }, 1.4)
    }

    if (scrollRef.value) {
      const scrollText = scrollRef.value.querySelector('.hero__scroll-text')
      if (scrollText) {
        tl.from(scrollText, {
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
        }, 1.8)
      }
    }

    // ══════════════════════════════════════════════════════════
    // SCROLL-DRIVEN PARALLAX + FADE
    // ══════════════════════════════════════════════════════════

    if (sectionRef.value && contentRef.value) {
      // Content parallax
      gsap.to(contentRef.value, {
        yPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })

      // Content fade
      gsap.to(contentRef.value, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: '50% top',
          scrub: true,
        },
      })
    }

    // Canvas parallax (slower — creates depth)
    if (sectionRef.value && canvasRef.value) {
      gsap.to(canvasRef.value, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
    }

    // Scroll indicator fades on scroll
    if (sectionRef.value && scrollRef.value) {
      gsap.to(scrollRef.value, {
        opacity: 0,
        y: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: '15% top',
          scrub: true,
        },
      })
    }
  })
})

onUnmounted(() => {
  gsapCtx?.revert()
  fluid.destroy()
  textDistortion?.destroy()
  textDistortion = null
  resizeObserver?.disconnect()
  if (textResizeHandler)
    window.removeEventListener('resize', textResizeHandler)
})
</script>

<template>
  <section
    ref="sectionRef"
    class="hero"
    aria-label="Billy Maulana — Frontend Architect & Creative Developer"
  >
    <!-- Layer 1: WebGL fluid simulation (atmospheric background, blended via screen) -->
    <canvas
      ref="canvasRef"
      class="hero__canvas"
      aria-hidden="true"
    />

    <!-- Layer 3: Film grain overlay -->
    <div class="hero__grain" aria-hidden="true" />

    <!-- Layer 5: Content — WebGL text distortion + subtitle, blended with fluid via difference -->
    <div ref="contentRef" class="hero__content">
      <!-- WebGL text distortion: renders text to offscreen canvas, applies
           FBM noise displacement + swirl + chromatic aberration via fragment shader.
           Ported from hero-liquid branch (CRZ.STUDIO-inspired technique). -->
      <div class="hero__name-wrapper" :class="{ 'hero__name-wrapper--ready': isTextReady }">
        <canvas
          ref="textCanvasRef"
          class="hero__text-canvas"
          aria-hidden="true"
        />
        <h1 class="sr-only">
          Billy Maulana
        </h1>
      </div>

      <p ref="subtitleRef" class="hero__subtitle">
        Frontend Architect / Creative Developer
      </p>
    </div>

    <!-- Layer 6: Scroll indicator — vertical line + "Explore" -->
    <div ref="scrollRef" class="hero__scroll" aria-hidden="true">
      <span ref="scrollLineRef" class="hero__scroll-line" />
      <span class="hero__scroll-text">Explore</span>
    </div>
  </section>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════
   HERO — "The Statement"
   Atmospheric fluid background (mix-blend-mode: screen) with
   WebGL text distortion (CRZ.STUDIO technique). Text-fluid interaction
   via mix-blend-mode: difference on content layer.
   ═══════════════════════════════════════════════════════════════════════ */

.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  /* Void-blue base — NOT flat black, slight depth */
  background:
    radial-gradient(ellipse 70% 50% at 50% 50%, rgba(6, 6, 16, 0.6) 0%, transparent 70%),
    var(--void-blue, #060610);
}

/* ─── Layer 1: WebGL Canvas (atmospheric fluid, blended via screen) ─── */
.hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: auto;
  mix-blend-mode: screen;
}

/* ─── Layer 3: Film grain overlay ─── */
.hero__grain {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  opacity: 0.05;
  mix-blend-mode: overlay;
  background-image: url('/assets/textures/grain.png');
  background-size: 200px 200px;
  background-repeat: repeat;
}

/* ─── Layer 5: Content — blended with fluid via difference ─── */
.hero__content {
  position: absolute;
  inset: 0;
  z-index: 7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: var(--page-margin);
  pointer-events: none;
  /* Text-fluid blend interaction: when fluid (screen-blended) passes under text,
     difference blend creates color shift. Reference: bluxstudio (exclusion), latchezar (difference).
     Math: |text_color - composited_bg| — fluid bright areas invert text color. */
  mix-blend-mode: difference;
}

/* ─── WebGL Text Distortion Canvas ─── */
.hero__name-wrapper {
  position: relative;
  width: 100%;
  max-width: calc(100vw - var(--page-margin) * 2);
}

.hero__text-canvas {
  display: block;
  width: 100%;
  height: auto;
  opacity: 0;
  transition: opacity 0.8s ease;
}

.hero__name-wrapper--ready .hero__text-canvas {
  opacity: 1;
}

/* ─── Subtitle ─── */
.hero__subtitle {
  margin-top: clamp(2rem, 4vh, 3rem);
  font-family: var(--font-interface);
  font-size: clamp(0.75rem, 0.9vw, 0.9rem);
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--chrome-mid);
  pointer-events: none;
  transition: opacity 0.3s ease;
}

/* ─── Layer 6: Scroll indicator ─── */
.hero__scroll {
  position: absolute;
  bottom: clamp(2rem, 4vh, 3rem);
  right: var(--page-margin);
  z-index: 8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  pointer-events: none;
}

.hero__scroll-line {
  display: block;
  width: 1px;
  height: 48px;
  background: var(--chrome-dark);
  transform-origin: top;
}

.hero__scroll-text {
  font-family: var(--font-system);
  font-size: var(--text-micro);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--text-muted);
  writing-mode: vertical-rl;
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .hero__content {
    padding-inline: var(--page-margin);
  }

  .hero__subtitle {
    font-size: clamp(0.625rem, 2.5vw, 0.8rem);
  }

  .hero__scroll {
    right: var(--page-margin);
    bottom: 1.5rem;
  }

  .hero__scroll-line {
    height: 32px;
  }
}

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  .hero__canvas {
    display: none;
  }

  .hero__text-canvas {
    transition: none;
  }
}
</style>
