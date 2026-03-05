<script setup lang="ts">
/**
 * AppPreloader — "The Still Surface" (v2)
 *
 * Silver monochrome fairy tale preloader.
 * Narrative: "Every creation begins in the dark."
 * Per-word stagger, organic lake-scale metaballs, ~12s contemplative pace.
 *
 * 4 Acts:
 *   Prologue (void) → Narrative (word-by-word) →
 *   Awakening (silver water breathes) → Convergence (logo) → Departure
 */
import { useLiquidBlobs } from '~/composables/useLiquidBlobs'

const emit = defineEmits<{
  complete: []
  done: []
}>()

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const cornersRef = ref<HTMLElement>()
const narrativeRef = ref<HTMLElement>()

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

  // ─── Initial state: darkness, silver still water ───
  blob.setExplode(1.0)
  blob.setStrength(1.5)
  blob.setFill(0.06)
  blob.setFadeToBlack(0)
  blob.setConverge(0)
  blob.setFlowIntensity(0.05)
  blob.setOpacity(0)
  // Identity blue — deep indigo start
  blob.setTint(0.05, 0.12, 0.45)

  if (canvasRef.value)
    gsap.set(canvasRef.value, { scale: 1.12, transformOrigin: '50% 50%', filter: 'blur(0px)' })

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

  // Narrative words — setup
  const words = narrativeRef.value?.querySelectorAll('.preloader__word')
  if (words?.length)
    gsap.set(words, { opacity: 0, y: 14, filter: 'blur(5px)' })

  const tl = gsap.timeline({
    onComplete: () => { emit('done') },
  })

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PROLOGUE (0s → 1.5s) — Extended darkness. Stillness.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  tl.to({}, { duration: 1.5 })

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ACT 1: THE NARRATIVE (1.5s → 5.5s)
  // Words rise from depth one by one.
  // Silver water barely visible behind — still surface.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Words stagger in: opacity, y, blur — each word rises from depth
  if (words?.length) {
    tl.to(words, {
      opacity: 0.7,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      stagger: 0.25,
      ease: 'power3.out',
    })
  }

  // Canvas opacity: 0 → 0.6 (silver tendrils clearly visible)
  tl.to({}, {
    duration: 3.0,
    ease: 'power2.out',
    onUpdate() {
      blob.setOpacity(0.6 * this.progress())
    },
  }, '<+0.5')

  // Fill: 0.06 → 0.22 (tendrils become substance)
  tl.to({}, {
    duration: 3.0,
    ease: 'expo.out',
    onUpdate() {
      blob.setFill(0.06 + 0.16 * this.progress())
    },
  }, '<')

  // Camera settles slowly
  if (canvasRef.value) {
    tl.to(canvasRef.value, {
      scale: 1.04,
      duration: 3.5,
      ease: 'power2.out',
    }, '<')
  }

  // Narrative hold — let words breathe
  tl.to({}, { duration: 1.0 })

  // Debug: pause at end of Act 1
  if (isDebug) {
    tl.add(() => {
      tl.pause()
      // eslint-disable-next-line no-console
      console.log('[preloader debug] Paused at Act 1 end. window.__blob available.')
    })
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ACT 2: AWAKENING (5.5s → 8.5s)
  // Words dissolve. Silver water breathes.
  // Flow intensity rises. Liquid becomes prominent.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Narrative words dissolve upward
  if (words?.length) {
    tl.to(words, {
      opacity: 0,
      y: -8,
      filter: 'blur(4px)',
      duration: 1.2,
      stagger: 0.08,
      ease: 'power2.in',
    })
  }

  // Flow intensity: 0.05 → 0.14 (tendrils stretch and flow)
  tl.to({}, {
    duration: 3.0,
    ease: 'power2.inOut',
    onUpdate() {
      blob.setFlowIntensity(0.05 + 0.09 * this.progress())
    },
  }, '<')

  // Canvas opacity: 0.6 → 0.9 (silver tendrils become dominant)
  tl.to({}, {
    duration: 2.5,
    ease: 'power2.out',
    onUpdate() {
      blob.setOpacity(0.6 + 0.3 * this.progress())
    },
  }, '<+0.5')

  // Fill: 0.22 → 0.35 (substance materializes)
  tl.to({}, {
    duration: 2.5,
    ease: 'power2.out',
    onUpdate() {
      blob.setFill(0.22 + 0.13 * this.progress())
    },
  }, '<')

  // Tint: deep indigo → electric blue
  tl.to({}, {
    duration: 2.5,
    ease: 'power2.inOut',
    onUpdate() {
      const p = this.progress()
      blob.setTint(
        0.05 + 0.05 * p, // r: 0.05 → 0.10
        0.12 + 0.18 * p, // g: 0.12 → 0.30
        0.45 + 0.40 * p, // b: 0.45 → 0.85
      )
    },
  }, '<')

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ACT 3: CONVERGENCE (8.5s → 11.5s)
  // Metaballs gather gradually. Logo forms from silver water.
  // Smooth, extended transition — like reflection becoming sharp.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Converge: 0 → 1 (metaballs gather — extended duration for smoothness)
  tl.to({}, {
    duration: 2.0,
    ease: 'expo.inOut',
    onUpdate() {
      blob.setConverge(this.progress())
    },
  })

  // Explode: 1.0 → 0 (goo dissolves — slow, overlapping)
  tl.to({}, {
    duration: 2.5,
    ease: 'expo.inOut',
    onUpdate() {
      blob.setExplode(1.0 * (1 - this.progress()))
    },
  }, '<+0.3')

  // Strength: 1.5 → 0 (distortion fades — trailing)
  tl.to({}, {
    duration: 2.2,
    ease: 'expo.inOut',
    onUpdate() {
      blob.setStrength(1.5 * (1 - this.progress()))
    },
  }, '<+0.3')

  // Fill: 0.35 → 1.0 (logo sharpens from liquid — gradual)
  tl.to({}, {
    duration: 2.0,
    ease: 'power3.out',
    onUpdate() {
      blob.setFill(0.35 + 0.65 * this.progress())
    },
  }, '<+0.5')

  // Canvas full opacity
  tl.to({}, {
    duration: 1.5,
    ease: 'power2.out',
    onUpdate() {
      blob.setOpacity(0.9 + 0.1 * this.progress())
    },
  }, '<')

  // Tint: electric blue → bright cyan-blue (logo moment)
  tl.to({}, {
    duration: 2.0,
    ease: 'power2.out',
    onUpdate() {
      const p = this.progress()
      blob.setTint(
        0.10 + 0.10 * p, // r: 0.10 → 0.20
        0.30 + 0.20 * p, // g: 0.30 → 0.50
        0.85 + 0.15 * p, // b: 0.85 → 1.00
      )
    },
  }, '<')

  // Flow intensity settles: 0.12 → 0.12 (stays)
  // Camera settles to 1.0
  if (canvasRef.value) {
    tl.to(canvasRef.value, {
      scale: 1.0,
      duration: 2.0,
      ease: 'power3.out',
    }, '<')
  }

  // Corner labels stagger in (branding moment)
  if (cornersRef.value) {
    const allChars = cornersRef.value.querySelectorAll('.preloader__corner-char')
    tl.to(allChars, {
      opacity: 0.5,
      filter: 'blur(0px)',
      duration: 0.6,
      stagger: 0.015,
      ease: 'power3.out',
    }, '-=0.6')
  }

  // Brief hold — branding breathes
  tl.to({}, { duration: 0.4 })

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ACT 4: DEPARTURE (11.5s → 13.0s)
  // Fade to black. Container dissolve. Exit.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Emit complete → hero starts mounting behind preloader
  tl.add(() => {
    emit('complete')
  })

  // Shader fade to black
  tl.to({}, {
    duration: 1.2,
    ease: 'power3.in',
    onUpdate() {
      blob.setFadeToBlack(this.progress())
    },
  })

  // Camera pulls away + blur
  if (canvasRef.value) {
    tl.to(canvasRef.value, {
      scale: 1.15,
      filter: 'blur(4px)',
      duration: 1.2,
      ease: 'power3.in',
    }, '<')
  }

  // Corner labels fade out
  if (cornersRef.value) {
    const allChars = cornersRef.value.querySelectorAll('.preloader__corner-char')
    tl.to(allChars, {
      opacity: 0,
      filter: 'blur(6px)',
      duration: 0.6,
      stagger: 0.01,
      ease: 'power2.in',
    }, '<')
  }

  // Container dissolve — preloader fades out revealing hero behind
  if (containerRef.value) {
    tl.to(containerRef.value, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.in',
    }, '-=0.4')
  }
}
</script>

<template>
  <div
    ref="containerRef"
    class="preloader"
    aria-live="polite"
    aria-label="Loading portfolio"
    role="status"
  >
    <!-- Atmospheric depth — silver void -->
    <div class="preloader__atmosphere" aria-hidden="true" />

    <!-- WebGL goo/metaball canvas -->
    <canvas ref="canvasRef" class="preloader__canvas" aria-hidden="true" />

    <!-- Film grain -->
    <div class="preloader__grain" aria-hidden="true" />

    <!-- Narrative text — per-word stagger -->
    <div ref="narrativeRef" class="preloader__narrative" aria-hidden="true">
      <span class="preloader__line">
        <span class="preloader__word">Every</span>
        <span class="preloader__word">creation</span>
      </span>
      <span class="preloader__line">
        <span class="preloader__word">begins</span>
        <span class="preloader__word">in</span>
        <span class="preloader__word">the</span>
        <span class="preloader__word">dark.</span>
      </span>
    </div>

    <!-- Corner coordinate labels -->
    <div ref="cornersRef" class="preloader__corners" aria-hidden="true">
      <span class="preloader__corner preloader__corner--tl">MONOGRAPH NO. 001</span>
      <span class="preloader__corner preloader__corner--tr">BILLY MAULANA</span>
      <span class="preloader__corner preloader__corner--bl">BANDUNG, ID</span>
      <span class="preloader__corner preloader__corner--br">MMXXVI</span>
    </div>
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
  will-change: opacity;
}

.preloader__atmosphere {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0, 20, 60, 0.08) 0%, transparent 70%),
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

/* ─── Narrative Text — Per-Word Stagger ─── */
.preloader__narrative {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3em;
  pointer-events: none;
}

.preloader__line {
  display: flex;
  gap: 0.35em;
}

.preloader__word {
  display: inline-block;
  font-family: var(--font-statement);
  font-style: italic;
  font-size: clamp(1.125rem, 2vw, 1.75rem);
  letter-spacing: 0.03em;
  color: var(--moonlit-text, #c8c8cc);
  opacity: 0;
  will-change: opacity, transform, filter;
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

@media (prefers-reduced-motion: reduce) {
  .preloader {
    display: none;
  }
}
</style>
