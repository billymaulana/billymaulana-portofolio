<script setup lang="ts">
/**
 * AppPreloader — Liquid Blob Cinematic (v5)
 *
 * Liquid blobs emerge from darkness, come alive, then cinematic zoom exit.
 * No SVG logo phase — single cohesive animation.
 */
import { useLiquidBlobs } from '~/composables/useLiquidBlobs'

const emit = defineEmits<{
  complete: []
  done: []
}>()

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const cornersRef = ref<HTMLElement>()
const vignetteRef = ref<HTMLElement>()

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

  // Init canvas liquid (hidden, running in background)
  if (canvasRef.value) {
    const ok = await blob.init(canvasRef.value)
    if (ok)
      blob.start()
  }

  const isDebug = new URLSearchParams(window.location.search).has('debug')
  if (isDebug)
    (window as any).__blob = blob

  // ━━━ INITIAL STATE: CRZ-style — full goo, abstract liquid ━━━
  // Shader designed for this direction: liquid → logo (resolve)
  blob.setExplode(3.0)
  blob.setStrength(1.2)
  blob.setFill(0.85)
  blob.setFadeToBlack(0)
  blob.setConverge(0)
  blob.setFlowIntensity(0.12)
  blob.setMelt(0)
  blob.setOpacity(0)
  blob.setTint(1.0, 1.0, 1.0)

  if (canvasRef.value)
    gsap.set(canvasRef.value, { scale: 1, transformOrigin: '50% 50%', filter: 'blur(0px)' })

  if (vignetteRef.value)
    gsap.set(vignetteRef.value, { opacity: 0 })

  // Corner labels — per-char split
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
  // PHASE 1: ABSTRACT LIQUID FADES IN (0 → 1.2s)
  // Heavy goo — mysterious, abstract liquid blobs.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  tl.to({}, { duration: 0.2 })

  // Canvas fades in — abstract liquid visible
  tl.to({}, {
    duration: 1.0,
    ease: 'power3.out',
    onUpdate() {
      blob.setOpacity(this.progress())
    },
  })

  // Corner labels reveal alongside
  if (cornersRef.value) {
    const allChars = cornersRef.value.querySelectorAll('.preloader__corner-char')
    tl.to(allChars, {
      opacity: 0.5,
      filter: 'blur(0px)',
      duration: 0.6,
      stagger: 0.012,
      ease: 'power3.out',
    }, '<+0.3')
  }

  if (isDebug) {
    tl.add(() => {
      tl.pause()
      // eslint-disable-next-line no-console
      console.log('[preloader debug] Paused after liquid fade in.')
    })
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PHASE 2: GOO RESOLVE — LOGO EMERGES (1.2s → 4.2s)
  // CRZ-style: explode 3→0, strength 1.2→0.
  // Liquid resolves into clear BM logo. Shader designed for this.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  tl.to({}, {
    duration: 3.0,
    ease: 'power3.inOut',
    onUpdate() {
      const p = this.progress()
      // Explode: 3.0 → 0 (goo resolves)
      blob.setExplode(3.0 * (1.0 - p))
      // Strength: 1.2 → 0 (distortion clears)
      blob.setStrength(1.2 * (1.0 - p))
      // Flow: 0.12 → 0.02 (motion calms)
      blob.setFlowIntensity(0.12 - 0.10 * p)
    },
  })

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PHASE 3: LOGO HOLDS — RECOGNITION (4.2s → 4.8s)
  // Clear BM logo, brief cinematic pause.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  tl.to({}, { duration: 0.6 })

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PHASE 5: CINEMATIC ZOOM EXIT (5.8s → 7.8s)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  tl.add(() => {
    emit('complete')
  })

  // Zoom: 1 → 6
  if (canvasRef.value) {
    tl.to(canvasRef.value, {
      scale: 6,
      filter: 'blur(8px)',
      duration: 2.0,
      ease: 'expo.in',
    })
  }

  // Tunnel vignette
  if (vignetteRef.value) {
    tl.to(vignetteRef.value, {
      opacity: 1,
      duration: 2.0,
      ease: 'power2.in',
    }, '<')
  }

  // Flow spikes during zoom
  tl.to({}, {
    duration: 2.0,
    ease: 'expo.in',
    onUpdate() {
      blob.setFlowIntensity(0.24 + 0.50 * this.progress())
    },
  }, '<')

  // Corner labels fade
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

  // Container dissolves
  if (containerRef.value) {
    tl.to(containerRef.value, {
      opacity: 0,
      duration: 1.0,
      ease: 'power3.in',
    }, '-=1.0')
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
    <!-- Atmospheric depth -->
    <div class="preloader__atmosphere" aria-hidden="true" />

    <!-- Canvas liquid (hidden, revealed during melt) -->
    <canvas ref="canvasRef" class="preloader__canvas" aria-hidden="true" />

    <!-- Film grain -->
    <div class="preloader__grain" aria-hidden="true" />

    <!-- Zoom tunnel vignette -->
    <div ref="vignetteRef" class="preloader__zoom-vignette" aria-hidden="true" />

    <!-- Corner labels -->
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
  will-change: transform, filter;
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

.preloader__zoom-vignette {
  position: absolute;
  inset: 0;
  z-index: 4;
  background: radial-gradient(
    circle at 50% 50%,
    transparent 10%,
    rgba(6, 6, 16, 0.4) 40%,
    rgba(6, 6, 16, 0.9) 75%
  );
  opacity: 0;
  pointer-events: none;
  will-change: opacity;
}

.preloader__corners {
  position: absolute;
  inset: 0;
  z-index: 5;
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
