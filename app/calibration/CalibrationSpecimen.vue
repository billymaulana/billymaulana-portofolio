<script setup lang="ts">
import type { SpecimenComposition } from '~/calibration/pairs'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import LayoutAccentGlyph from '~/calibration/layouts/LayoutAccentGlyph.vue'
import LayoutBleedBottom from '~/calibration/layouts/LayoutBleedBottom.vue'
import LayoutEditorialDense from '~/calibration/layouts/LayoutEditorialDense.vue'
import LayoutMinimal from '~/calibration/layouts/LayoutMinimal.vue'
import LayoutScaleJump from '~/calibration/layouts/LayoutScaleJump.vue'
import LayoutSplitBlocks from '~/calibration/layouts/LayoutSplitBlocks.vue'
import LayoutValueHierarchy from '~/calibration/layouts/LayoutValueHierarchy.vue'

const props = defineProps<{
  comp: SpecimenComposition
  ghost: SpecimenComposition | null
}>()

gsap.registerPlugin(Flip)

const LAYOUTS = {
  'bleed-bottom': LayoutBleedBottom,
  'split-blocks': LayoutSplitBlocks,
  'value-hierarchy': LayoutValueHierarchy,
  'scale-jump': LayoutScaleJump,
  'accent-glyph': LayoutAccentGlyph,
  'minimal': LayoutMinimal,
  'editorial-dense': LayoutEditorialDense,
}

const applied = ref<SpecimenComposition>(props.comp)
const root = ref<HTMLElement | null>(null)

function vars(c: SpecimenComposition) {
  return {
    '--sp-ground': c.ground,
    '--sp-ink': c.ink,
    '--sp-muted': c.muted,
    '--sp-display-family': c.displayFamily,
    '--sp-display-size': c.displaySize,
    '--sp-display-weight': String(c.displayWeight),
    '--sp-display-tracking': c.displayTracking,
    '--sp-display-leading': String(c.displayLeading),
    '--sp-display-case': c.displayCase,
    '--sp-body-family': c.bodyFamily,
    '--sp-body-size': c.bodySize,
    '--sp-body-weight': String(c.bodyWeight),
    '--sp-body-tracking': c.bodyTracking,
    '--sp-body-leading': String(c.bodyLeading),
  }
}

const current = computed(() => LAYOUTS[applied.value.layout])
const ghostLayout = computed(() => (props.ghost ? LAYOUTS[props.ghost.layout] : null))

function targets() {
  return root.value?.querySelectorAll('[data-flip]') ?? []
}

/* Generasi menjaga transisi yang tertimpa: menekan Space/S lebih cepat dari durasi wipe
   membuat morph lama menulis state usang dan layout berhenti sinkron dengan pasangan aktif.
   Setiap tahap async karena itu membaca props.comp terkini, bukan argumen saat dipanggil. */
let generation = 0

/* Layout sama → Flip, supaya selisih token terbaca sebagai jarak tempuh huruf.
   Layout beda → wipe, karena Flip antar struktur yang tidak sepadan hanya menghasilkan kekacauan. */
async function morph() {
  const el = root.value
  if (!el)
    return

  const mine = ++generation

  if (props.comp.layout === applied.value.layout) {
    const state = Flip.getState(targets())
    applied.value = props.comp
    await nextTick()
    if (mine !== generation)
      return
    Flip.from(state, { duration: 0.9, ease: 'expo.inOut', stagger: { each: 0.012, from: 'center' } })
    return
  }

  await gsap.to(el, { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.42, ease: 'expo.in' })
  if (mine !== generation)
    return

  applied.value = props.comp
  await nextTick()
  if (mine !== generation)
    return

  gsap.fromTo(
    el,
    { clipPath: 'inset(100% 0% 0% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.62, ease: 'expo.out', clearProps: 'clipPath' },
  )
}

watch(() => props.comp, (next) => {
  if (next !== applied.value)
    morph()
})
</script>

<template>
  <div class="wrap" :style="{ background: applied.ground }">
    <article ref="root" class="stage" :style="vars(applied)">
      <component :is="current" :accent="applied.accent" />
    </article>

    <article v-if="ghost && ghostLayout" class="stage stage--ghost" :style="vars(ghost)" aria-hidden="true">
      <component :is="ghostLayout" :accent="ghost.accent" />
    </article>
  </div>
</template>

<style scoped>
.wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  transition: background 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.stage {
  position: absolute;
  inset: 0;
  padding: clamp(1rem, 2.5vw, 2.5rem);
  color: var(--sp-ink);
}

.stage--ghost {
  mix-blend-mode: difference;
  pointer-events: none;
}

.stage :deep(.sp-d) {
  font-family: var(--sp-display-family);
  font-size: var(--sp-display-size);
  font-weight: var(--sp-display-weight);
  letter-spacing: var(--sp-display-tracking);
  line-height: var(--sp-display-leading);
  text-transform: var(--sp-display-case);
  text-wrap: balance;
}

.stage :deep(.sp-b) {
  font-family: var(--sp-body-family);
  font-size: var(--sp-body-size);
  font-weight: var(--sp-body-weight);
  letter-spacing: var(--sp-body-tracking);
  line-height: var(--sp-body-leading);
  color: var(--sp-muted);
  text-wrap: pretty;
  margin: 0;
}

.stage :deep(.sp-m) {
  font-family: var(--sp-body-family);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.2;
  color: var(--sp-muted);
  font-variant-numeric: tabular-nums;
  margin: 0;
}
</style>
