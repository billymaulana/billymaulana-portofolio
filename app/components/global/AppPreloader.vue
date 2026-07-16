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
  // PHASE 2: GOO RESOLVE — LOGO EMERGES (1.2s → 6.2s)
  // CRZ-style: explode 3→0, strength 1.2→residual.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /*
   * Each physical quantity gets its own clock: one uniform ease across all
   * uniforms makes the liquid "complete itself" mechanically and land hard.
   * Big mass motion (explode) finishes early, position gathering (converge)
   * next, surface noise (strength/flow) lives longest.
   */
  const shader = {
    explode: 3.0,
    strength: 1.2,
    converge: 0,
    flow: 0.12,
    fill: 0.85,
    pulse: 0,
  }

  if (isDebug) {
    /*
     * seek() suppresses tween onUpdate, so scrubbing from the console needs
     * direct access to the timeline and the shader value proxy to re-push
     * uniforms after a jump.
     */
    ;(window as any).__tl = tl
    ;(window as any).__shader = shader
  }

  tl.addLabel('resolve')

  /*
   * power3.out instead of expo.out: uExplode is clamped to 0..1 in the
   * shader, so the 3→1 stretch is invisible dead travel. expo.out burns
   * through it plus most of the visible morph in the first second;
   * power3.out keeps the same early-mass intent but spreads the readable
   * goo→logo window across ~2.2s.
   */
  tl.to(shader, {
    explode: 0,
    duration: 3.2,
    ease: 'power3.out',
    onUpdate: () => blob.setExplode(shader.explode),
  }, 'resolve')

  tl.to(shader, {
    strength: 0.12,
    duration: 3.4,
    ease: 'power3.out',
    onUpdate: () => blob.setStrength(shader.strength),
  }, 'resolve+=0.4')

  /*
   * Surface-tension overshoot lives on uStrength because uConverge and
   * uExplode are both clamped to 0..1 in the goo shader (values past the
   * final pose are no-ops there). Strength crosses through zero into a
   * brief outward rebound, then settles at a small positive residual —
   * exactly zero would freeze the surface entirely since every
   * displacement term in the shader is multiplied by uStrength.
   */
  tl.to(shader, {
    strength: -0.04,
    duration: 0.4,
    ease: 'expo.inOut',
    onUpdate: () => blob.setStrength(shader.strength),
  }, 'resolve+=3.8')

  tl.to(shader, {
    strength: 0.05,
    duration: 0.8,
    ease: 'power3.out',
    onUpdate: () => blob.setStrength(shader.strength),
  }, 'resolve+=4.2')

  tl.to(shader, {
    converge: 0.97,
    duration: 2.8,
    ease: 'expo.inOut',
    onUpdate: () => blob.setConverge(shader.converge),
  }, 'resolve+=0.6')

  tl.to(shader, {
    converge: 1.0,
    duration: 0.9,
    ease: 'power3.out',
    onUpdate: () => blob.setConverge(shader.converge),
  }, 'resolve+=3.4')

  tl.to(shader, {
    flow: 0.03,
    duration: 4.6,
    ease: 'power3.out',
    onUpdate: () => blob.setFlowIntensity(shader.flow),
  }, 'resolve')

  tl.to(shader, {
    fill: 1.0,
    duration: 2.2,
    ease: 'power3.out',
    onUpdate: () => blob.setFill(shader.fill),
  }, 'resolve+=1.6')

  /*
   * Dim pulse masks the recognition threshold; sine of eased progress
   * returns to zero at both ends so the seams carry no visible step.
   */
  tl.to(shader, {
    pulse: 1,
    duration: 2.6,
    ease: 'expo.inOut',
    onUpdate: () => blob.setFadeToBlack(Math.sin(shader.pulse * Math.PI) * 0.05),
  }, 'resolve+=0.4')

  // Vignette focuses attention on center during resolve
  if (vignetteRef.value) {
    tl.to(vignetteRef.value, {
      opacity: 0.3,
      duration: 5.0,
      ease: 'expo.inOut',
    }, 'resolve')
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PHASE 3: LOGO HOLDS — RECOGNITION (6.2s → 7.05s)
  // Clear BM logo, brief cinematic pause.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Recognition pulse — logo breathes at the moment of clarity
  tl.to({}, {
    duration: 0.5,
    ease: 'power3.out',
    onUpdate() {
      const p = this.progress()
      const ping = Math.sin(p * Math.PI)
      blob.setFill(1.0 + 0.05 * ping)
      /*
       * Baseline 0.03 matches the flow residual left by PHASE 2 so the
       * pulse splices in without a step.
       */
      blob.setFlowIntensity(0.03 + 0.03 * ping)
    },
  })

  // Canvas micro-breathe — logo feels alive
  if (canvasRef.value) {
    tl.to(canvasRef.value, {
      scale: 1.015,
      duration: 0.25,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 1,
    }, '<')
  }

  // Corner labels sharpen into full focus
  if (cornersRef.value) {
    const focusChars = cornersRef.value.querySelectorAll('.preloader__corner-char')
    tl.to(focusChars, {
      opacity: 0.65,
      duration: 0.5,
      stagger: 0.006,
      ease: 'power2.out',
    }, '<')
  }

  // Vignette opens slightly — breath before the exit
  if (vignetteRef.value) {
    tl.to(vignetteRef.value, {
      opacity: 0.15,
      duration: 0.5,
      ease: 'power2.out',
    }, '<')
  }

  // Brief hold — let the beat land
  tl.to({}, { duration: 0.35 })

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PHASE 4: CLIP-PATH REVEAL EXIT
  // Circle shrinks from edges → center, revealing hero behind.
  // Logo is last thing visible — cinematic focal point.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  tl.add(() => {
    emit('complete')
  })

  // Corner labels blur-fade out
  if (cornersRef.value) {
    const allChars = cornersRef.value.querySelectorAll('.preloader__corner-char')
    tl.to(allChars, {
      opacity: 0,
      filter: 'blur(4px)',
      duration: 0.4,
      stagger: 0.01,
      ease: 'power2.in',
    })
  }

  // Clip-path circle shrinks — reveals hero from edges inward
  if (containerRef.value) {
    gsap.set(containerRef.value, { clipPath: 'circle(100% at 50% 50%)' })
    tl.to(containerRef.value, {
      clipPath: 'circle(0% at 50% 50%)',
      duration: 1.2,
      ease: 'expo.inOut',
    })
  }

  // Vignette crunch — tunnel vision as circle closes
  if (vignetteRef.value) {
    tl.to(vignetteRef.value, {
      opacity: 0.7,
      duration: 1.2,
      ease: 'power2.in',
    }, '<')
  }

  // Canvas subtle zoom — depth effect into logo
  if (canvasRef.value) {
    tl.to(canvasRef.value, {
      scale: 1.08,
      duration: 1.2,
      ease: 'power2.in',
    }, '<')
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
