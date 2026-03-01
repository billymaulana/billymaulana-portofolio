<script setup lang="ts">
/**
 * SectionHero — 8-layer composition with WebGL fluid text-mask
 *
 * Layer Stack (bottom → top):
 * 0. Section bg: radial gradient atmosphere (CSS)
 * 1. .hero__atmosphere: multi-gradient depth (0.15+ opacity)
 * 2. .hero__canvas: WebGL fluid sim (ambient glow + text-mask)
 * 3. .hero__grain: noise texture overlay (mix-blend-mode: overlay)
 * 4. .hero__accents: SVG brackets + grid rules (animated entrance)
 * 5. .hero__content: invisible DOM text (a11y) + subtitle
 * 6. .hero__corners: Swiss-grid corner labels
 * 7. .hero__ghost: oversized "01" section number
 * 8. .hero__scroll: scroll indicator
 *
 * WOW MOMENT: Fluid simulation visible as ambient glow across ENTIRE
 * viewport + concentrated brightness through letter shapes. Background
 * is NEVER flat black — always alive with color.
 */

import { useFluidSimulation } from '~/composables/useFluidSimulation'

const sectionRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const contentRef = ref<HTMLElement>()
const subtitleRef = ref<HTMLElement>()
const accentsRef = ref<HTMLElement>()
const cornerTLRef = ref<HTMLElement>()
const cornerTRRef = ref<HTMLElement>()
const ghostRef = ref<HTMLElement>()
const scrollIndicatorRef = ref<HTMLElement>()

const fluid = useFluidSimulation()
let gsapCtx: gsap.Context | null = null
let resizeObserver: ResizeObserver | null = null

function getComputedFontSize(): number {
  const probe = document.createElement('span')
  probe.style.cssText = `
    font-size: clamp(4rem, 14vw, 13rem);
    position: absolute;
    visibility: hidden;
    pointer-events: none;
  `
  document.body.appendChild(probe)
  const size = Number.parseFloat(getComputedStyle(probe).fontSize)
  document.body.removeChild(probe)
  return size
}

function renderTextMask() {
  if (!canvasRef.value)
    return

  const dpr = Math.min(window.devicePixelRatio, 2)
  const vw = window.innerWidth
  const vh = window.innerHeight

  const maskCanvas = document.createElement('canvas')
  maskCanvas.width = vw * dpr
  maskCanvas.height = vh * dpr

  const ctx = maskCanvas.getContext('2d')
  if (!ctx)
    return

  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, vw, vh)

  const fontSize = getComputedFontSize()
  const lineHeight = 0.85
  const letterSpacing = -0.05 * fontSize

  const centerX = vw / 2
  const totalTextHeight = fontSize * 2 * lineHeight
  const baseY = vh / 2 - totalTextHeight / 2 + fontSize * lineHeight

  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  ctx.font = `700 ${fontSize}px "Clash Display", sans-serif`

  drawTextWithTracking(ctx, 'BILLY', centerX, baseY, letterSpacing)
  drawTextWithTracking(ctx, 'MAULANA', centerX, baseY + fontSize * lineHeight, letterSpacing)

  fluid.setTextMask(maskCanvas)
}

function drawTextWithTracking(
  ctx: CanvasRenderingContext2D,
  text: string,
  centerX: number,
  y: number,
  tracking: number,
) {
  const chars = text.split('')
  const charWidths = chars.map(c => ctx.measureText(c).width)
  const totalWidth = charWidths.reduce((sum, w) => sum + w, 0) + tracking * (chars.length - 1)

  let x = centerX - totalWidth / 2
  for (let i = 0; i < chars.length; i++) {
    ctx.fillText(chars[i]!, x + charWidths[i]! / 2, y)
    x += charWidths[i]! + tracking
  }
}

onMounted(async () => {
  if (!canvasRef.value)
    return

  const success = fluid.init(canvasRef.value)
  if (!success)
    return

  await nextTick()
  if (document.fonts)
    await document.fonts.ready

  renderTextMask()

  resizeObserver = new ResizeObserver(() => {
    fluid.resize()
    renderTextMask()
  })
  resizeObserver.observe(canvasRef.value)

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced)
    return

  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  gsapCtx = gsap.context(() => {
    // ══════════════════════════════════════════════════════════
    // CINEMATIC ENTRANCE SEQUENCE — staggered layer reveals
    // ══════════════════════════════════════════════════════════

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })

    // 1. Corner brackets — clip-path reveal from corner origins
    if (accentsRef.value) {
      const brackets = accentsRef.value.querySelectorAll('.hero__bracket')
      tl.from(brackets, {
        scale: 0,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'back.out(1.4)',
      }, 0.2)

      // Grid rules — draw in from center
      const rules = accentsRef.value.querySelectorAll('.hero__rule')
      tl.from(rules, {
        scaleX: 0,
        scaleY: 0,
        opacity: 0,
        duration: 1,
        stagger: 0.06,
        ease: 'expo.inOut',
      }, 0.4)

      // Center dot — pop in
      const dot = accentsRef.value.querySelector('.hero__dot')
      if (dot) {
        tl.from(dot, {
          scale: 0,
          opacity: 0,
          duration: 0.5,
          ease: 'back.out(2)',
        }, 0.7)
      }
    }

    // 2. Subtitle — per-character blur-to-sharp
    if (subtitleRef.value) {
      const text = subtitleRef.value.textContent || ''
      subtitleRef.value.textContent = ''
      subtitleRef.value.setAttribute('aria-label', text)

      text.split('').forEach((char) => {
        const span = document.createElement('span')
        span.textContent = char === ' ' ? '\u00A0' : char
        span.style.display = 'inline-block'
        span.classList.add('hero__subtitle-char')
        subtitleRef.value!.appendChild(span)
      })

      const chars = subtitleRef.value.querySelectorAll('.hero__subtitle-char')
      tl.from(chars, {
        filter: 'blur(12px)',
        opacity: 0,
        y: 10,
        duration: 0.7,
        stagger: 0.025,
        ease: 'power3.out',
      }, 0.6)
    }

    // 3. Corner labels — slide + fade
    const corners = [cornerTLRef.value, cornerTRRef.value].filter(Boolean)
    if (corners.length) {
      tl.from(corners, {
        opacity: 0,
        yPercent: 50,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power4.out',
      }, 0.8)
    }

    // 4. Ghost number — scale + blur reveal
    if (ghostRef.value) {
      tl.from(ghostRef.value, {
        scale: 1.3,
        filter: 'blur(20px)',
        opacity: 0,
        duration: 1.2,
        ease: 'expo.out',
      }, 0.5)
    }

    // 5. Scroll indicator — fade up
    if (scrollIndicatorRef.value) {
      tl.from(scrollIndicatorRef.value, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
      }, 1.2)

      const arrow = scrollIndicatorRef.value.querySelector('.hero__scroll-arrow')
      if (arrow) {
        gsap.to(arrow, {
          y: 6,
          duration: 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut',
        })
      }
    }

    // ══════════════════════════════════════════════════════════
    // SCROLL-DRIVEN PARALLAX + FADE
    // ══════════════════════════════════════════════════════════

    if (sectionRef.value && contentRef.value) {
      gsap.to(contentRef.value, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })

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

    // Canvas parallax (slower rate)
    if (sectionRef.value && canvasRef.value) {
      gsap.to(canvasRef.value, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
    }

    // Accents parallax (medium rate)
    if (sectionRef.value && accentsRef.value) {
      gsap.to(accentsRef.value, {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
    }

    // Ghost number parallax (fastest — creates depth separation)
    if (sectionRef.value && ghostRef.value) {
      gsap.to(ghostRef.value, {
        yPercent: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })
    }
  })
})

onUnmounted(() => {
  gsapCtx?.revert()
  fluid.destroy()
  resizeObserver?.disconnect()
})
</script>

<template>
  <section
    ref="sectionRef"
    class="hero"
    aria-label="Billy Maulana — Frontend Architect"
  >
    <!-- Layer 1: Multi-gradient atmospheric depth -->
    <div class="hero__atmosphere" aria-hidden="true" />

    <!-- Layer 2: WebGL fluid simulation (ambient glow + text-mask) -->
    <canvas
      ref="canvasRef"
      class="hero__canvas"
      aria-hidden="true"
    />

    <!-- Layer 3: Film grain overlay -->
    <div class="hero__grain" aria-hidden="true" />

    <!-- Layer 4: Geometric accent system — brackets + grid rules -->
    <div ref="accentsRef" class="hero__accents" aria-hidden="true">
      <!-- Corner brackets — architectural registration marks -->
      <span class="hero__bracket hero__bracket--tl" />
      <span class="hero__bracket hero__bracket--tr" />
      <span class="hero__bracket hero__bracket--bl" />
      <span class="hero__bracket hero__bracket--br" />
      <!-- Grid rules — thin lines at 1/3 positions -->
      <span class="hero__rule hero__rule--h-top" />
      <span class="hero__rule hero__rule--h-bot" />
      <span class="hero__rule hero__rule--v-left" />
      <span class="hero__rule hero__rule--v-right" />
      <!-- Center crosshair dot -->
      <span class="hero__dot" />
    </div>

    <!-- Layer 5: Content (invisible text for a11y + subtitle) -->
    <div ref="contentRef" class="hero__content">
      <h1 class="hero__name" aria-label="Billy Maulana">
        <span class="hero__name-line">Billy</span>
        <span class="hero__name-line">Maulana</span>
      </h1>
      <p ref="subtitleRef" class="hero__subtitle">
        Frontend Architect
      </p>
    </div>

    <!-- Layer 6: Corner labels — Swiss-grid metadata -->
    <div class="hero__corners" aria-hidden="true">
      <span ref="cornerTLRef" class="hero__corner hero__corner--tl">Bandung, ID</span>
      <span ref="cornerTRRef" class="hero__corner hero__corner--tr">2017&mdash;Present</span>
    </div>

    <!-- Layer 7: Ghost section number -->
    <span ref="ghostRef" class="hero__ghost" aria-hidden="true">01</span>

    <!-- Layer 8: Scroll indicator -->
    <div ref="scrollIndicatorRef" class="hero__scroll" aria-hidden="true">
      <span class="hero__scroll-arrow">&darr;</span>
      <span class="hero__scroll-label">Scroll</span>
    </div>
  </section>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════
   HERO — 8-layer composition with WebGL fluid text-mask
   NEVER flat black. Always alive. Always atmospheric.
   ═══════════════════════════════════════════════════════════════════════ */

.hero {
  position: relative;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  /* Layer 0: base with subtle radial warmth — NOT flat black */
  background:
    radial-gradient(ellipse 80% 60% at 50% 45%, rgba(0, 20, 80, 0.18) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 20% 70%, rgba(15, 10, 114, 0.12) 0%, transparent 50%),
    radial-gradient(ellipse 40% 35% at 85% 25%, rgba(0, 100, 200, 0.08) 0%, transparent 45%),
    #060610;
}

/* ─── Layer 1: Multi-gradient atmospheric depth ─── */
.hero__atmosphere {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 60% 50% at 50% 50%,
      rgba(0, 71, 255, 0.15) 0%,
      rgba(0, 71, 255, 0.04) 50%,
      transparent 75%
    ),
    radial-gradient(
      ellipse 40% 35% at 30% 65%,
      rgba(15, 10, 114, 0.12) 0%,
      transparent 60%
    ),
    radial-gradient(
      ellipse 35% 30% at 75% 35%,
      rgba(0, 163, 255, 0.08) 0%,
      transparent 55%
    ),
    conic-gradient(
      from 200deg at 50% 50%,
      rgba(0, 71, 255, 0.04) 0deg,
      transparent 60deg,
      rgba(0, 245, 255, 0.03) 120deg,
      transparent 180deg,
      rgba(15, 10, 114, 0.05) 240deg,
      transparent 360deg
    );
  mix-blend-mode: screen;
}

/* ─── Layer 2: WebGL Canvas ─── */
.hero__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: auto;
}

/* ─── Layer 3: Film grain overlay ─── */
.hero__grain {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  opacity: 0.06;
  mix-blend-mode: overlay;
  background-image: url('/assets/textures/grain.png');
  background-size: 200px 200px;
  background-repeat: repeat;
}

/* ─── Layer 4: Geometric accent system ─── */
.hero__accents {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
}

/* Corner brackets — architectural registration marks */
.hero__bracket {
  position: absolute;
  width: clamp(24px, 3.5vw, 50px);
  height: clamp(24px, 3.5vw, 50px);
  will-change: transform, opacity;
}

.hero__bracket--tl {
  top: 18%;
  left: 6%;
  border-top: 1px solid rgba(0, 71, 255, 0.3);
  border-left: 1px solid rgba(0, 71, 255, 0.3);
}

.hero__bracket--tr {
  top: 18%;
  right: 6%;
  border-top: 1px solid rgba(0, 71, 255, 0.3);
  border-right: 1px solid rgba(0, 71, 255, 0.3);
}

.hero__bracket--bl {
  bottom: 22%;
  left: 6%;
  border-bottom: 1px solid rgba(0, 71, 255, 0.3);
  border-left: 1px solid rgba(0, 71, 255, 0.3);
}

.hero__bracket--br {
  bottom: 22%;
  right: 6%;
  border-bottom: 1px solid rgba(0, 71, 255, 0.3);
  border-right: 1px solid rgba(0, 71, 255, 0.3);
}

/* Grid rules — thin lines at grid positions */
.hero__rule {
  position: absolute;
  background: rgba(0, 71, 255, 0.1);
  will-change: transform, opacity;
}

.hero__rule--h-top {
  top: 30%;
  left: 8%;
  right: 8%;
  height: 1px;
  transform-origin: center;
}

.hero__rule--h-bot {
  bottom: 28%;
  left: 8%;
  right: 8%;
  height: 1px;
  transform-origin: center;
}

.hero__rule--v-left {
  top: 20%;
  bottom: 25%;
  left: 33.33%;
  width: 1px;
  transform-origin: center;
}

.hero__rule--v-right {
  top: 20%;
  bottom: 25%;
  right: 33.33%;
  width: 1px;
  transform-origin: center;
}

/* Center crosshair dot */
.hero__dot {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(0, 163, 255, 0.4);
  transform: translate(-50%, -50%);
  box-shadow: 0 0 12px rgba(0, 163, 255, 0.3);
  will-change: transform, opacity;
}

/* ─── Layer 5: Content wrapper ─── */
.hero__content {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  pointer-events: none;
}

/* Invisible text — fluid renders through mask, this is a11y only */
.hero__name {
  font-family: var(--font-display);
  font-size: var(--text-hero);
  font-weight: 700;
  letter-spacing: var(--tracking-hero);
  line-height: var(--leading-hero);
  text-transform: uppercase;
  text-align: center;
  margin: 0;
  color: transparent;
  -webkit-text-fill-color: transparent;
}

.hero__name-line {
  display: block;
}

/* Subtitle */
.hero__subtitle {
  margin-top: clamp(1.5rem, 3vh, 2.5rem);
  font-family: var(--font-serif);
  font-size: clamp(1rem, 1.5vw, 1.5rem);
  font-weight: 400;
  font-style: italic;
  letter-spacing: var(--tracking-body);
  line-height: var(--leading-body);
  color: var(--accent-light);
  text-align: center;
}

.hero__subtitle :deep(.hero__subtitle-char) {
  display: inline-block;
  will-change: transform, filter, opacity;
}

/* ─── Layer 6: Corner labels ─── */
.hero__corners {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
}

.hero__corner {
  position: absolute;
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--text-secondary);
  opacity: 0.6;
}

.hero__corner--tl {
  top: var(--page-margin);
  left: var(--page-margin);
}

.hero__corner--tr {
  top: var(--page-margin);
  right: var(--page-margin);
  text-align: right;
}

/* ─── Layer 7: Ghost section number ─── */
.hero__ghost {
  position: absolute;
  bottom: clamp(3rem, 8vh, 6rem);
  left: var(--page-margin);
  z-index: 7;
  font-family: var(--font-display);
  font-size: clamp(6rem, 15vw, 14rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  color: transparent;
  -webkit-text-stroke: 1px rgba(0, 71, 255, 0.12);
  pointer-events: none;
  user-select: none;
  mix-blend-mode: difference;
  will-change: transform, filter, opacity;
}

/* ─── Layer 8: Scroll indicator ─── */
.hero__scroll {
  position: absolute;
  bottom: clamp(1.5rem, 3vh, 2.5rem);
  left: 50%;
  transform: translateX(-50%);
  z-index: 8;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  pointer-events: none;
}

.hero__scroll-label {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--text-tertiary);
}

.hero__scroll-arrow {
  font-size: var(--text-small);
  color: var(--text-tertiary);
  will-change: transform;
}

/* ─── Responsive ─── */
@media (max-width: 768px) {
  .hero__corners {
    display: none;
  }

  .hero__subtitle {
    font-size: clamp(0.875rem, 3.5vw, 1.125rem);
    padding-inline: var(--page-margin);
  }

  .hero__bracket {
    width: 20px;
    height: 20px;
  }

  .hero__rule--v-left,
  .hero__rule--v-right {
    display: none;
  }

  .hero__ghost {
    font-size: clamp(4rem, 20vw, 8rem);
    -webkit-text-stroke-width: 0.5px;
  }
}

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  .hero__scroll-arrow {
    animation: none;
  }
}
</style>
