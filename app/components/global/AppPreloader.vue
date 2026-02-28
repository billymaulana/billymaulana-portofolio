<script setup lang="ts">
/**
 * Concept 3 Preloader: "Assembly"
 * Letters of "BILLY MAULANA" start as scrambled random characters
 * and settle one-by-one left-to-right, like a typewriter finding the right keys.
 */

const emit = defineEmits<{
  complete: []
  done: []
}>()

const TARGET = 'BILLY MAULANA'
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?<>{}[]'
const SCRAMBLE_INTERVAL = 40 // ms between random char cycles
const SETTLE_DELAY = 80 // ms between each character settling

const preloaderRef = ref<HTMLElement>()
const displayChars = ref<string[]>(TARGET.split('').map(() => ''))
const settledMask = ref<boolean[]>(TARGET.split('').map(() => false))
const progress = ref(0)
const phase = ref<'scramble' | 'settle' | 'progress' | 'exit'>('scramble')
const isVisible = ref(true)

function randomChar(): string {
  return CHARS[Math.floor(Math.random() * CHARS.length)] ?? 'X'
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    emit('complete')
    emit('done')
    isVisible.value = false
    return
  }

  const hasVisited = sessionStorage.getItem('bm-visited')
  if (hasVisited) {
    runQuickReveal()
    return
  }

  sessionStorage.setItem('bm-visited', '1')
  runAssembly()
})

async function runQuickReveal() {
  // Quick reveal for returning visitors
  displayChars.value = TARGET.split('')
  settledMask.value = TARGET.split('').map(() => true)
  progress.value = 100
  phase.value = 'exit'

  await sleep(200)
  emit('complete')

  if (preloaderRef.value) {
    preloaderRef.value.style.transition = 'opacity 0.3s ease'
    preloaderRef.value.style.opacity = '0'
  }

  await sleep(300)
  isVisible.value = false
  emit('done')
}

async function runAssembly() {
  // Phase 1: Scramble (0.0s - 0.5s)
  phase.value = 'scramble'
  const scrambleLoop = setInterval(() => {
    displayChars.value = TARGET.split('').map((char) => {
      if (char === ' ')
        return ' '
      return randomChar()
    })
  }, SCRAMBLE_INTERVAL)

  await sleep(500)
  clearInterval(scrambleLoop)

  // Phase 2: Settle left-to-right (0.5s - 1.5s)
  phase.value = 'settle'
  for (let i = 0; i < TARGET.length; i++) {
    const char = TARGET[i] ?? ''
    if (char === ' ') {
      displayChars.value[i] = ' '
      settledMask.value[i] = true
      // Trigger reactivity
      displayChars.value = [...displayChars.value]
      settledMask.value = [...settledMask.value]
      continue
    }

    // Quick scramble for this position before settling
    for (let j = 0; j < 3; j++) {
      displayChars.value[i] = randomChar()
      displayChars.value = [...displayChars.value]
      await sleep(SCRAMBLE_INTERVAL)
    }

    // Settle to correct character
    displayChars.value[i] = char
    settledMask.value[i] = true
    displayChars.value = [...displayChars.value]
    settledMask.value = [...settledMask.value]

    await sleep(SETTLE_DELAY)
  }

  // Phase 3: Progress bar fill (1.5s - 2.0s)
  phase.value = 'progress'
  const progressDuration = 500
  const progressStart = Date.now()

  await new Promise<void>((resolve) => {
    function updateProgress() {
      const elapsed = Date.now() - progressStart
      const t = Math.min(elapsed / progressDuration, 1)
      // Expo easing for snappy fill
      progress.value = Math.round((1 - (1 - t) ** 3) * 100)

      if (t < 1) {
        requestAnimationFrame(updateProgress)
      }
      else {
        resolve()
      }
    }
    requestAnimationFrame(updateProgress)
  })

  await sleep(200)

  // Phase 4: Exit — scale up and fade out (2.0s - 2.5s)
  phase.value = 'exit'
  emit('complete')

  if (preloaderRef.value) {
    const el = preloaderRef.value
    el.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)'
    el.style.transform = 'scale(1.05)'
    el.style.opacity = '0'
  }

  await sleep(500)
  isVisible.value = false
  emit('done')
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getProgressBar(pct: number): string {
  const total = 12
  const filled = Math.round((pct / 100) * total)
  const empty = total - filled
  return '\u2588'.repeat(filled) + '\u2591'.repeat(empty)
}
</script>

<template>
  <div
    v-if="isVisible"
    ref="preloaderRef"
    class="preloader"
    aria-label="Loading"
    role="progressbar"
    :aria-valuenow="progress"
  >
    <!-- Noise grain overlay -->
    <div class="preloader__grain" aria-hidden="true" />

    <div class="preloader__center">
      <!-- Scrambling name -->
      <div class="preloader__name" aria-live="polite">
        <span
          v-for="(char, i) in displayChars"
          :key="i"
          class="preloader__char"
          :class="{
            'preloader__char--settled': settledMask[i],
            'preloader__char--space': char === ' ',
          }"
        >{{ char }}</span>
      </div>

      <!-- Text-based progress bar -->
      <div
        class="preloader__progress"
        :class="{ 'preloader__progress--visible': phase === 'progress' || phase === 'exit' }"
      >
        <span class="preloader__bar">{{ getProgressBar(progress) }}</span>
        <span class="preloader__pct">{{ progress }}%</span>
      </div>
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
  background: var(--color-bg);
  will-change: transform, opacity;
}

/* Noise grain — subtle texture */
.preloader__grain {
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: 256px 256px;
  opacity: 0.5;
  pointer-events: none;
  mix-blend-mode: overlay;
}

.preloader__center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1.5rem, 3vh, 2.5rem);
}

/* Name display */
.preloader__name {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
}

.preloader__char {
  font-family: var(--font-display);
  font-variation-settings: 'wght' 700;
  font-size: clamp(2rem, 6vw, 4.5rem);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  transition: color 0.15s ease;
  display: inline-block;
  min-width: 0.6em;
  text-align: center;
}

.preloader__char--settled {
  color: var(--color-text-primary);
}

.preloader__char--space {
  min-width: 0.4em;
}

/* Progress bar */
.preloader__progress {
  display: flex;
  align-items: center;
  gap: 0.75em;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.preloader__progress--visible {
  opacity: 1;
}

.preloader__bar {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  letter-spacing: 0;
  line-height: 1;
}

.preloader__pct {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--color-text-secondary);
  letter-spacing: 0.05em;
  min-width: 3.5em;
  text-align: right;
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .preloader {
    transition: none;
  }

  .preloader__char {
    color: var(--color-text-primary);
    transition: none;
  }
}
</style>
