<script setup lang="ts">
import CalibrationSpecimen from '~/calibration/CalibrationSpecimen.vue'
import { useCalibrationSession } from '~/calibration/useCalibrationSession'
import { useSpecimenField } from '~/calibration/useSpecimenField'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'

definePageMeta({
  standalone: true,
})

useSeoMeta({
  title: 'Optical Bench — Taste Calibration',
  robots: 'noindex, nofollow',
})

const field = useSpecimenField()
const canvas = ref<HTMLCanvasElement | null>(null)

const {
  pairs,
  index,
  note,
  side,
  ghostOn,
  toggles,
  current,
  answered,
  activeVariant,
  ghostVariant,
  jsonl,
  toggle,
  record,
  goBack,
  restart,
} = useCalibrationSession(() => field.pulse())

async function copyJsonl() {
  await navigator.clipboard.writeText(jsonl.value)
}

onMounted(() => {
  if (canvas.value)
    field.mount(canvas.value)
})

onUnmounted(() => field.destroy())
</script>

<template>
  <main class="bench">
    <canvas ref="canvas" class="bench__field" aria-hidden="true" />
    <div class="bench__rules" aria-hidden="true" />

    <template v-if="current && activeVariant">
      <header class="bench__head">
        <span class="bench__dim">{{ current.dim }} — {{ current.question }}</span>
        <span class="bench__count">{{ String(index + 1).padStart(2, '0') }} / {{ String(pairs.length).padStart(2, '0') }}</span>
      </header>

      <div class="bench__body">
        <section class="bench__stage" @click="toggle">
          <CalibrationSpecimen :comp="activeVariant.comp" :ghost="ghostVariant?.comp ?? null" />
        </section>

        <aside class="bench__readout">
          <p class="bench__side">
            <span :class="{ 'is-on': side === 'a' }">A</span>
            <span class="bench__slash">/</span>
            <span :class="{ 'is-on': side === 'b' }">B</span>
          </p>
          <h2 class="bench__variant">
            {{ activeVariant.label }}
          </h2>
          <p class="bench__spec">
            {{ activeVariant.spec }}
          </p>
          <p class="bench__question">
            {{ current.hypothesis }}
          </p>
          <p class="bench__meta">
            {{ String(toggles).padStart(2, '0') }} toggle
          </p>
        </aside>
      </div>

      <footer class="bench__controls">
        <button type="button" class="bench__key" @click="toggle">
          Space — tukar
        </button>
        <button type="button" class="bench__key" :class="{ 'is-on': ghostOn }" @pointerdown="ghostOn = true" @pointerup="ghostOn = false" @pointerleave="ghostOn = false">
          D — bandingkan
        </button>
        <span class="bench__gap" />
        <button type="button" class="bench__key bench__key--pick" @click="record('a')">
          1 — pilih A
        </button>
        <button type="button" class="bench__key bench__key--pick" @click="record('b')">
          2 — pilih B
        </button>
        <button type="button" class="bench__key" @click="record('skip')">
          S — lewati
        </button>
        <input v-model="note" class="bench__note" type="text" placeholder="Kenapa? (kata-kata Anda sendiri)">
        <button type="button" class="bench__key" :disabled="index === 0" @click="goBack">
          ←
        </button>
      </footer>
    </template>

    <section v-else class="bench__done">
      <p class="bench__dim">
        Sesi selesai
      </p>
      <h1 class="bench__title">
        {{ answered }} penilaian tercatat
      </h1>
      <pre class="bench__jsonl">{{ jsonl }}</pre>
      <div class="bench__controls">
        <button type="button" class="bench__key bench__key--pick" @click="copyJsonl">
          Salin JSONL
        </button>
        <button type="button" class="bench__key" @click="restart">
          Ulangi
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.bench {
  position: relative;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto;
  gap: clamp(1rem, 2vw, 2rem);
  height: 100dvh;
  padding: clamp(1rem, 2vw, 2rem) clamp(1.25rem, 4vw, 6rem);
  background: #050505;
  color: #fff;
  overflow: hidden;
}

/* align-items harus stretch: dengan center, stage mengikuti tinggi kontennya dan varian
   ber-leading longgar meluap menimpa header serta kontrol. */
.bench__body {
  position: relative;
  z-index: 20;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  min-height: 0;
}

@media (min-width: 1024px) {
  .bench__body {
    grid-template-columns: minmax(0, 1fr) 19rem;
    gap: clamp(2rem, 4vw, 5rem);
  }
}

.bench__field {
  position: fixed;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
}

.bench__rules {
  position: fixed;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  background:
    linear-gradient(to right, rgb(255 255 255 / 0.07) 1px, transparent 1px) 16.666% 0 / 33.333% 100% no-repeat,
    linear-gradient(to right, rgb(255 255 255 / 0.07) 1px, transparent 1px) 83.333% 0 / 33.333% 100% no-repeat;
}

.bench__head,
.bench__stage,
.bench__readout,
.bench__controls,
.bench__done {
  position: relative;
  z-index: 20;
}

.bench__head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.bench__dim,
.bench__count,
.bench__meta {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  line-height: 1.2;
  text-transform: uppercase;
}

.bench__spec {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.2;
}

.bench__dim {
  color: #0047ff;
}

.bench__count {
  color: rgb(255 255 255 / 0.4);
  font-variant-numeric: tabular-nums;
}

.bench__stage {
  position: relative;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgb(255 255 255 / 0.1);
}

.bench__readout {
  align-self: center;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-block-start: 1rem;
  border-top: 1px solid rgb(255 255 255 / 0.16);
}

.bench__side {
  display: flex;
  gap: 0.4rem;
  margin: 0 0 0.5rem;
  font-family: 'Switzer', sans-serif;
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 0.85;
  color: rgb(255 255 255 / 0.28);
}

.bench__variant {
  margin: 0;
  color: #fff;
  font-family: 'Switzer', sans-serif;
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: -0.005em;
  line-height: 1.3;
  text-wrap: balance;
}

.bench__question {
  margin: 0;
  color: rgb(255 255 255 / 0.44);
  font-family: 'Switzer', sans-serif;
  font-size: 0.9375rem;
  line-height: 1.3;
  text-wrap: pretty;
}

.bench__side .is-on {
  color: #fff;
}

.bench__slash {
  color: rgb(255 255 255 / 0.16);
}

.bench__spec {
  margin: 0;
  color: rgb(255 255 255 / 0.72);
}

.bench__meta {
  margin: 0;
  color: rgb(255 255 255 / 0.34);
  font-variant-numeric: tabular-nums;
}

.bench__controls {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.bench__gap {
  flex: 0 0 1.5rem;
}

.bench__key {
  padding: 0.6rem 1rem;
  border: 1px solid rgb(255 255 255 / 0.16);
  background: transparent;
  color: rgb(255 255 255 / 0.62);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  line-height: 1.2;
  text-transform: uppercase;
  cursor: pointer;
  transition: color 0.5s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.bench__key:hover:not(:disabled),
.bench__key.is-on {
  border-color: #0047ff;
  color: #fff;
}

.bench__key--pick {
  color: #fff;
}

.bench__key:disabled {
  opacity: 0.28;
  cursor: not-allowed;
}

.bench__note {
  flex: 1;
  min-width: 14rem;
  padding: 0.6rem 1rem;
  border: 1px solid rgb(255 255 255 / 0.16);
  background: transparent;
  color: #fff;
  font-family: 'Switzer', sans-serif;
  font-size: 0.9375rem;
  line-height: 1.3;
}

.bench__note::placeholder {
  color: rgb(255 255 255 / 0.3);
}

.bench__done {
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  max-width: 92rem;
}

.bench__title {
  margin: 0;
  font-family: 'Clash Display', sans-serif;
  font-size: clamp(3rem, 9vw, 8rem);
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 0.85;
  text-wrap: balance;
}

.bench__jsonl {
  max-height: 40vh;
  padding: 1.25rem;
  overflow: auto;
  border: 1px solid rgb(255 255 255 / 0.14);
  color: rgb(255 255 255 / 0.6);
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
