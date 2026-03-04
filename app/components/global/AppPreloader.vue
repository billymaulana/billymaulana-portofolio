<script setup lang="ts">
/**
 * AppPreloader — CRZ.STUDIO Goo/Metaball Pipeline (cinematic version)
 *
 * Architecture: 2-pass WebGL rendering
 *   Pass 1: BM logo (PNG) on black → WebGLRenderTarget
 *   Pass 2: Goo/metaball postprocessing → screen
 *
 * Designed as ONE continuous cinematic experience:
 *   Emergence → Resolve → Branding Moment → Cinematic Exit → Reveal
 *
 * Total duration: ~8s
 */
import { useLiquidBlobs } from '~/composables/useLiquidBlobs'

const emit = defineEmits<{
  complete: []
  done: []
}>()

const canvasRef = ref<HTMLCanvasElement>()
const cornersRef = ref<HTMLElement>()
const curtainRef = ref<HTMLElement>()

const blob = useLiquidBlobs()

onMounted(async () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    emit('complete')
    await nextTick()
    emit('done')
    return
  }

  runCinematic()
})

onBeforeUnmount(() => {
  blob.destroy()
})

async function runCinematic() {
  const gsap = (await import('gsap')).default

  // Init goo/metaball postprocessing pipeline
  if (canvasRef.value) {
    const ok = await blob.init(canvasRef.value)
    if (ok)
      blob.start()
  }

  // Debug: expose blob API + pause on ?debug
  const isDebug = new URLSearchParams(window.location.search).has('debug')
  if (isDebug)
    (window as any).__blob = blob

  // Initial state: nearly invisible — film starts in darkness
  blob.setExplode(1.0)
  blob.setStrength(1.5)
  blob.setFill(0.04)
  blob.setFadeToBlack(0)
  blob.setOpacity(0)
  // Identity blue tint — goo fragments echo hero fluid palette
  blob.setTint(0.45, 0.65, 1.0)

  if (canvasRef.value)
    gsap.set(canvasRef.value, { scale: 1.15, transformOrigin: '50% 50%', filter: 'blur(0px)' })
  if (curtainRef.value)
    gsap.set(curtainRef.value, { yPercent: 0 })

  // Corner labels — per-char split for stagger
  if (cornersRef.value) {
    const labels = cornersRef.value.querySelectorAll('.preloader__corner')
    labels.forEach((label) => {
      const text = label.textContent || ''
      label.textContent = ''
      for (const char of text) {
        const span = document.createElement('span')
        span.textContent = char
        span.classList.add('preloader__corner-char')
        label.appendChild(span)
      }
    })
    const allChars = cornersRef.value.querySelectorAll('.preloader__corner-char')
    gsap.set(allChars, { opacity: 0, filter: 'blur(6px)' })
  }

  const tl = gsap.timeline({
    onComplete: () => { emit('done') },
  })

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PROLOGUE (0s → 0.6s)
  // Film starts in darkness — deliberate beat before first light
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  tl.to({}, { duration: 0.6 })

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ACT 1: AWAKENING (0.6s → 4.0s)
  // Ultra-slow emergence — goo breathes into existence
  // Camera slowly settles (zoom 1.15 → 1.0)
  // Fill barely brightens: ghostly whisper of the logo
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Canvas opacity: 0 → 1 (slow, atmospheric)
  tl.to({}, {
    duration: 1.5,
    ease: 'power3.out',
    onUpdate() {
      blob.setOpacity(this.progress())
    },
  })

  // Camera settles — slow zoom out gives "breathing in" feel
  if (canvasRef.value) {
    tl.to(canvasRef.value, {
      scale: 1.0,
      duration: 3.4,
      ease: 'power2.out',
    }, '<')
  }

  // Fill: 0.04 → 0.20 — logo is a ghost, just enough for goo to distort
  tl.to({}, {
    duration: 3.4,
    ease: 'expo.out',
    onUpdate() {
      blob.setFill(0.04 + 0.16 * this.progress())
    },
  }, '<')

  // Debug: pause at end of Act 1 for goo inspection
  if (isDebug) {
    tl.add(() => {
      blob.setFill(0.5)
      tl.pause()
      // eslint-disable-next-line no-console
      console.log('[preloader debug] Paused at Act 1 end. window.__blob available.')
    })
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ACT 2: COALESCENCE (4.0s → 7.0s)
  // Logo gradually materializes from the goo — S-curve motion
  // Explode, strength, fill all breathe together as one gesture
  // Longest act — this is where "fluid" feeling lives
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Explode: 1.0 → 0 (smooth S-curve — goo structure dissolves organically)
  tl.to({}, {
    duration: 2.8,
    ease: 'power2.inOut',
    onUpdate() {
      blob.setExplode(1.0 * (1 - this.progress()))
    },
  })

  // Strength: 1.5 → 0 (distortion fades — slightly longer for trailing feel)
  tl.to({}, {
    duration: 2.5,
    ease: 'power2.inOut',
    onUpdate() {
      blob.setStrength(1.5 * (1 - this.progress()))
    },
  }, '<+0.3')

  // Fill: 0.20 → 1.0 (logo brightens — delayed start so goo dissolves first)
  tl.to({}, {
    duration: 2.0,
    ease: 'power3.out',
    onUpdate() {
      blob.setFill(0.20 + 0.80 * this.progress())
    },
  }, '<+0.5')

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ACT 3: PRESENCE (7.0s → 8.4s)
  // Logo sharp + corner labels stagger in — the "money shot"
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (cornersRef.value) {
    const allChars = cornersRef.value.querySelectorAll('.preloader__corner-char')
    tl.to(allChars, {
      opacity: 0.5,
      filter: 'blur(0px)',
      duration: 1.0,
      stagger: 0.018,
      ease: 'power3.out',
    }, '-=0.3')
  }

  // Hold — let the branding breathe
  tl.to({}, { duration: 0.6 })

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ACT 4: DEPARTURE (8.4s → 10.0s)
  // Cinematic exit — slow fade + zoom + depth-of-field blur
  // Camera pulls away from the logo as it vanishes
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Fade to black via shader — slow dramatic build
  tl.to({}, {
    duration: 1.4,
    ease: 'power3.in',
    onUpdate() {
      blob.setFadeToBlack(this.progress())
    },
  })

  // Camera pulls away — cinematic zoom out
  if (canvasRef.value) {
    tl.to(canvasRef.value, {
      scale: 1.18,
      filter: 'blur(6px)',
      duration: 1.4,
      ease: 'power3.in',
    }, '<')
  }

  // Corner labels fade out with blur
  if (cornersRef.value) {
    const allChars = cornersRef.value.querySelectorAll('.preloader__corner-char')
    tl.to(allChars, {
      opacity: 0,
      filter: 'blur(8px)',
      duration: 0.6,
      stagger: 0.01,
      ease: 'power2.in',
    }, '<')
  }

  // Emit complete → hero starts preparing
  tl.add(() => {
    emit('complete')
  })

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ACT 5: GRAND REVEAL (10.0s → 11.8s)
  // Curtain wipe reveals the hero — the grand entrance
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  if (curtainRef.value) {
    tl.to(curtainRef.value, {
      yPercent: -100,
      duration: 1.6,
      ease: 'expo.inOut',
    }, '+=0.2')
  }
}
</script>

<template>
  <div
    class="preloader"
    aria-live="polite"
    aria-label="Loading portfolio"
    role="status"
  >
    <!-- Atmospheric depth — matches hero void-blue -->
    <div class="preloader__atmosphere" aria-hidden="true" />

    <!-- WebGL goo/metaball canvas (CRZ.STUDIO pipeline) -->
    <canvas ref="canvasRef" class="preloader__canvas" aria-hidden="true" />

    <!-- Film grain — matches hero grain overlay -->
    <div class="preloader__grain" aria-hidden="true" />

    <!-- Corner coordinate labels -->
    <div ref="cornersRef" class="preloader__corners" aria-hidden="true">
      <span class="preloader__corner preloader__corner--tl">MONOGRAPH NO. 001</span>
      <span class="preloader__corner preloader__corner--tr">BILLY MAULANA</span>
      <span class="preloader__corner preloader__corner--bl">BANDUNG, ID</span>
      <span class="preloader__corner preloader__corner--br">MMXXVI</span>
    </div>

    <!-- Curtain wipe overlay -->
    <div ref="curtainRef" class="preloader__curtain" aria-hidden="true" />
  </div>
</template>

<style scoped>
.preloader {
  position: fixed;
  inset: 0;
  z-index: var(--z-preloader);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--void-blue, #060610);
  overflow: hidden;
}

.preloader__atmosphere {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0, 71, 255, 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 30% 60%, rgba(6, 6, 16, 0.8) 0%, transparent 60%);
  pointer-events: none;
}

.preloader__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  will-change: transform;
}

.preloader__grain {
  position: absolute;
  inset: 0;
  z-index: 3;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 128px;
  mix-blend-mode: overlay;
  opacity: 0.04;
  pointer-events: none;
}

/* ─── Corner Labels — Exhibition Plate ─── */
.preloader__corners {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.preloader__corner {
  position: absolute;
  font-family: var(--font-system);
  font-size: var(--text-micro);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--chrome-dark);
  opacity: 0;
  white-space: nowrap;
}

.preloader__corner--tl {
  top: clamp(1.5rem, 3vh, 2.5rem);
  left: var(--page-margin);
}

.preloader__corner--tr {
  top: clamp(1.5rem, 3vh, 2.5rem);
  right: var(--page-margin);
}

.preloader__corner--bl {
  bottom: clamp(2rem, 4vh, 3rem);
  left: var(--page-margin);
}

.preloader__corner--br {
  bottom: clamp(2rem, 4vh, 3rem);
  right: var(--page-margin);
}

.preloader__corner-char {
  display: inline-block;
  will-change: opacity, filter;
}

.preloader__curtain {
  position: absolute;
  inset: 0;
  background: var(--void-blue, #060610);
  z-index: -1;
  pointer-events: none;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .preloader {
    display: none;
  }
}
</style>
