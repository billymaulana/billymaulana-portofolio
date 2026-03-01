<script setup lang="ts">
/**
 * SectionHero — "The Statement"
 * Atmospheric Fluid x Bold Typography
 *
 * Layer Stack (bottom → top):
 * 0. Section bg: void-blue with subtle atmospheric gradients
 * 1. .hero__canvas: WebGL fluid sim as full-viewport atmospheric background (mix-blend-mode: screen)
 * 2. .hero__grain: noise texture overlay (mix-blend-mode: overlay)
 * 3. .hero__content: massive visible h1 + visible subtitle
 * 4. .hero__scroll: vertical line scroll indicator + "Explore"
 *
 * WOW MOMENT: Full-viewport fluid simulation that reacts to mouse
 * movement with chromatic aberration. Text is massive serif (PP Editorial
 * New Ultrabold) with velocity-driven RGB split. Fluid is VISIBLE
 * across entire viewport — NOT masked to text.
 *
 * Reference: daspritam.in — fluid distorts/warps on mouse movement,
 * visible as atmospheric background layer blended via screen mode.
 */

import { useFluidSimulation } from '~/composables/useFluidSimulation'

const sectionRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const contentRef = ref<HTMLElement>()
const subtitleRef = ref<HTMLElement>()
const scrollRef = ref<HTMLElement>()
const scrollLineRef = ref<HTMLElement>()
const coordsRef = ref<HTMLElement>()
const gridRef = ref<SVGSVGElement>()

const fluid = useFluidSimulation()
let gsapCtx: gsap.Context | null = null
let resizeObserver: ResizeObserver | null = null

/* ─── Chromatic Aberration (mouse velocity → RGB split) ─── */
let lastMouseX = 0
let lastMouseY = 0
let lastMouseTime = 0
let chromaRaf = 0
const chromaX = ref(0)
const chromaY = ref(0)

function updateChromaFromPosition(cx: number, cy: number) {
  const now = performance.now()
  const dt = now - lastMouseTime
  if (dt > 0 && lastMouseTime > 0) {
    const dx = cx - lastMouseX
    const dy = cy - lastMouseY
    const speed = Math.sqrt(dx * dx + dy * dy) / dt // px/ms
    // Clamp to 0-4px offset based on velocity
    const intensity = Math.min(4, speed * 3)
    const dirX = dx === 0 ? 0 : dx / Math.abs(dx)
    const dirY = dy === 0 ? 0 : dy / Math.abs(dy)
    chromaX.value = dirX * intensity
    chromaY.value = dirY * intensity
  }
  lastMouseX = cx
  lastMouseY = cy
  lastMouseTime = now
}

function handleHeroMouseMove(e: MouseEvent) {
  updateChromaFromPosition(e.clientX, e.clientY)
}

function handleHeroTouchMove(e: TouchEvent) {
  const touch = e.touches[0]
  if (touch)
    updateChromaFromPosition(touch.clientX, touch.clientY)
}

function decayChroma() {
  chromaX.value *= 0.92
  chromaY.value *= 0.92
  if (Math.abs(chromaX.value) > 0.01 || Math.abs(chromaY.value) > 0.01) {
    chromaRaf = requestAnimationFrame(decayChroma)
  }
  else {
    chromaX.value = 0
    chromaY.value = 0
  }
}

function startChromaDecay() {
  cancelAnimationFrame(chromaRaf)
  chromaRaf = requestAnimationFrame(decayChroma)
}

const chromaStyle = computed(() => ({
  '--chroma-x': `${chromaX.value}px`,
  '--chroma-y': `${chromaY.value}px`,
}))

/* ─── Lifecycle ─── */

onMounted(async () => {
  if (!canvasRef.value)
    return

  const success = fluid.init(canvasRef.value)
  if (!success)
    return

  // Resize handling — fluid auto-adapts to viewport
  resizeObserver = new ResizeObserver(() => {
    fluid.resize()
  })
  resizeObserver.observe(canvasRef.value)

  // Skip animations for reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced)
    return

  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  gsapCtx = gsap.context(() => {
    // ══════════════════════════════════════════════════════════
    // ENTRANCE SEQUENCE — minimal, confident
    // ══════════════════════════════════════════════════════════

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

    // Corner coordinate labels: per-char blur-to-sharp stagger
    if (coordsRef.value) {
      const labels = coordsRef.value.querySelectorAll('.hero__coord')
      labels.forEach((label) => {
        const text = label.textContent || ''
        label.textContent = ''
        text.split('').forEach((char) => {
          const span = document.createElement('span')
          span.textContent = char === ' ' ? '\u00A0' : char
          span.style.display = 'inline-block'
          span.classList.add('hero__coord-char')
          label.appendChild(span)
        })
      })
      const allCoordChars = coordsRef.value.querySelectorAll('.hero__coord-char')
      tl.from(allCoordChars, {
        filter: 'blur(6px)',
        opacity: 0,
        duration: 0.4,
        stagger: 0.015,
        ease: 'power3.out',
      }, 0.3)
    }

    // SVG accent grid: lines scale in, crosshairs pop
    if (gridRef.value) {
      const hLines = gridRef.value.querySelectorAll('.hero__grid-h')
      const vLines = gridRef.value.querySelectorAll('.hero__grid-v')
      const crosses = gridRef.value.querySelectorAll('.hero__grid-cross')

      if (hLines.length) {
        tl.from(hLines, {
          scaleX: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'expo.out',
        }, 0.5)
      }
      if (vLines.length) {
        tl.from(vLines, {
          scaleY: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: 'expo.out',
        }, 0.55)
      }
      if (crosses.length) {
        tl.from(crosses, {
          scale: 0,
          rotation: 90,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'elastic.out(1, 0.5)',
        }, 0.7)
      }
    }

    // Subtitle: per-character blur-to-sharp reveal
    if (subtitleRef.value) {
      const text = subtitleRef.value.textContent || ''
      subtitleRef.value.textContent = ''
      subtitleRef.value.setAttribute('aria-label', text)

      text.split('').forEach((char) => {
        const span = document.createElement('span')
        span.textContent = char === ' ' ? '\u00A0' : char
        span.style.display = 'inline-block'
        span.classList.add('hero__char')
        subtitleRef.value!.appendChild(span)
      })

      const chars = subtitleRef.value.querySelectorAll('.hero__char')
      tl.from(chars, {
        filter: 'blur(8px)',
        opacity: 0,
        y: 8,
        duration: 0.6,
        stagger: 0.02,
        ease: 'power3.out',
      }, 0.8)
    }

    // Scroll indicator: line extends + text appears
    if (scrollLineRef.value) {
      tl.fromTo(scrollLineRef.value, {
        scaleY: 0,
      }, {
        scaleY: 1,
        duration: 1,
        ease: 'expo.inOut',
      }, 1.2)
    }

    if (scrollRef.value) {
      const scrollText = scrollRef.value.querySelector('.hero__scroll-text')
      if (scrollText) {
        tl.from(scrollText, {
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
        }, 1.6)
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

    // Corner labels + grid fade on scroll
    if (sectionRef.value && coordsRef.value) {
      gsap.to(coordsRef.value, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: '40% top',
          scrub: true,
        },
      })
    }

    if (sectionRef.value && gridRef.value) {
      gsap.to(gridRef.value, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: '40% top',
          scrub: true,
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
  resizeObserver?.disconnect()
  cancelAnimationFrame(chromaRaf)
})
</script>

<template>
  <section
    ref="sectionRef"
    class="hero"
    aria-label="Billy Maulana — Frontend Architect & Creative Developer"
    @mousemove="handleHeroMouseMove"
    @mouseleave="startChromaDecay"
    @touchmove.passive="handleHeroTouchMove"
    @touchend="startChromaDecay"
  >
    <!-- Layer 1: WebGL fluid simulation (atmospheric background, blended via screen) -->
    <canvas
      ref="canvasRef"
      class="hero__canvas"
      aria-hidden="true"
    />

    <!-- Layer 2: SVG accent grid — Swiss registration marks -->
    <svg
      ref="gridRef"
      class="hero__grid"
      aria-hidden="true"
      viewBox="0 0 1440 900"
      preserveAspectRatio="none"
    >
      <!-- Horizontal hairlines at 20% and 80% -->
      <line class="hero__grid-h" x1="0" y1="180" x2="1440" y2="180" />
      <line class="hero__grid-h" x1="0" y1="720" x2="1440" y2="720" />
      <!-- Vertical hairlines at page margins -->
      <line class="hero__grid-v" x1="72" y1="0" x2="72" y2="900" />
      <line class="hero__grid-v" x1="1368" y1="0" x2="1368" y2="900" />
      <!-- Crosshair marks at intersections -->
      <g class="hero__grid-cross" transform="translate(72, 180)">
        <line x1="-6" y1="0" x2="6" y2="0" />
        <line x1="0" y1="-6" x2="0" y2="6" />
      </g>
      <g class="hero__grid-cross" transform="translate(1368, 180)">
        <line x1="-6" y1="0" x2="6" y2="0" />
        <line x1="0" y1="-6" x2="0" y2="6" />
      </g>
      <g class="hero__grid-cross" transform="translate(72, 720)">
        <line x1="-6" y1="0" x2="6" y2="0" />
        <line x1="0" y1="-6" x2="0" y2="6" />
      </g>
      <g class="hero__grid-cross" transform="translate(1368, 720)">
        <line x1="-6" y1="0" x2="6" y2="0" />
        <line x1="0" y1="-6" x2="0" y2="6" />
      </g>
    </svg>

    <!-- Layer 3: Film grain overlay -->
    <div class="hero__grain" aria-hidden="true" />

    <!-- Layer 4: Corner coordinate labels (museum plate) -->
    <div ref="coordsRef" class="hero__coords" aria-hidden="true">
      <span class="hero__coord hero__coord--tl">PLATE I</span>
      <span class="hero__coord hero__coord--tr">51.5074 N, 0.1278 W</span>
      <span class="hero__coord hero__coord--bl">MMXXVI</span>
      <span class="hero__coord hero__coord--br">FRONTEND ARCHITECT</span>
    </div>

    <!-- Layer 5: Content — visible h1 + subtitle + velocity chromatic aberration -->
    <div ref="contentRef" class="hero__content" :style="chromaStyle">
      <h1 class="hero__name" aria-label="Billy Maulana">
        <span class="hero__name-line hero__name-first">Billy</span>
        <span class="hero__name-line hero__name-second">Maulana</span>
      </h1>
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
   massive serif typography visible on top. Reference: daspritam.in.
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

/* ─── Layer 2: SVG Accent Grid (Swiss Registration Marks) ─── */
.hero__grid {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 3;
  pointer-events: none;
}

.hero__grid-h {
  stroke: rgba(0, 71, 255, 0.12);
  stroke-width: 0.5;
  transform-origin: left center;
}

.hero__grid-v {
  stroke: rgba(0, 71, 255, 0.12);
  stroke-width: 0.5;
  transform-origin: center top;
}

.hero__grid-cross line {
  stroke: rgba(0, 71, 255, 0.2);
  stroke-width: 0.75;
}

/* ─── Layer 4: Corner Coordinate Labels ─── */
.hero__coords {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
}

.hero__coord {
  position: absolute;
  font-family: var(--font-system);
  font-size: var(--text-micro);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--chrome-dark);
  opacity: 0.5;
  white-space: nowrap;
}

.hero__coord--tl {
  top: clamp(1.5rem, 3vh, 2.5rem);
  left: var(--page-margin);
}

.hero__coord--tr {
  top: clamp(1.5rem, 3vh, 2.5rem);
  right: var(--page-margin);
}

.hero__coord--bl {
  bottom: clamp(2rem, 4vh, 3rem);
  left: var(--page-margin);
}

.hero__coord--br {
  bottom: clamp(2rem, 4vh, 3rem);
  right: var(--page-margin);
}

.hero__coord-char {
  display: inline-block;
  will-change: opacity, filter;
}

/* ─── Layer 5: Content ─── */
.hero__content {
  position: absolute;
  inset: 0;
  z-index: 7;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: var(--page-margin);
  pointer-events: none;
}

/* Massive visible name — primary visual statement */
.hero__name {
  font-family: var(--font-statement);
  font-size: var(--text-hero);
  font-weight: 800;
  letter-spacing: var(--tracking-hero);
  line-height: var(--leading-hero);
  text-transform: uppercase;
  margin: 0;
  color: var(--text-primary);
}

.hero__name-line {
  display: block;
}

/* Counter-position: MAULANA indented → creates diagonal reading line */
.hero__name-second {
  padding-left: clamp(3rem, 12vw, 15rem);
}

/* Subtitle — visible text, not masked */
.hero__subtitle {
  margin-top: clamp(2rem, 4vh, 3rem);
  font-family: var(--font-interface);
  font-size: clamp(0.75rem, 0.9vw, 0.9rem);
  font-weight: 500;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--chrome-mid);
  pointer-events: none;
}

.hero__subtitle :deep(.hero__char) {
  display: inline-block;
  will-change: transform, filter, opacity;
}

/* ─── Chromatic Aberration (velocity-driven RGB split) ─── */
.hero__content {
  --chroma-x: 0px;
  --chroma-y: 0px;
}

.hero__name {
  text-shadow:
    var(--chroma-x) var(--chroma-y) 0 rgba(0, 71, 255, 0.4),
    calc(var(--chroma-x) * -0.7) calc(var(--chroma-y) * -0.7) 0 rgba(161, 224, 231, 0.3);
}

.hero__subtitle {
  text-shadow:
    var(--chroma-x) var(--chroma-y) 0 rgba(255, 50, 50, 0.6),
    calc(var(--chroma-x) * -1) calc(var(--chroma-y) * -1) 0 rgba(50, 100, 255, 0.6);
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

  .hero__name-second {
    padding-left: clamp(1.5rem, 8vw, 4rem);
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

  /* Hide coordinate labels on mobile — too cluttered */
  .hero__coord--tr,
  .hero__coord--bl {
    display: none;
  }

  .hero__coord {
    font-size: 0.5rem;
  }

  /* Simplify grid on mobile */
  .hero__grid-cross {
    display: none;
  }
}

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  .hero__canvas {
    display: none;
  }
}
</style>
