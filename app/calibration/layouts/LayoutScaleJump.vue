<script setup lang="ts">
import { useSpecimenContent } from '~/calibration/useSpecimenContent'

const c = useSpecimenContent()
</script>

<template>
  <div class="jump">
    <span class="jump__index" aria-hidden="true">{{ String(c.count).padStart(2, '0') }}</span>

    <div class="jump__front">
      <p class="sp-m">
        {{ c.role }} — {{ c.location }}
      </p>
      <h2 class="sp-d jump__mark" data-flip>
        {{ c.full }}
      </h2>
      <p class="jump__lede sp-b">
        {{ c.tagline }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.jump {
  position: relative;
  display: grid;
  place-items: center start;
  height: 100%;
}

/* Angka indeks raksasa sebagai elemen grafis di belakang, bukan sebagai teks yang dibaca —
   pola Norvin. Tumpang tindih menghasilkan kedalaman tanpa shadow. */
.jump__index {
  position: absolute;
  inset-inline-end: -0.04em;
  inset-block-start: 50%;
  translate: 0 -50%;
  font-family: var(--sp-display-family);
  font-size: clamp(10rem, min(34vw, 52vh), 30rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--sp-ink);
  opacity: 0.09;
  pointer-events: none;
  user-select: none;
}

.jump__front {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.jump__mark {
  margin: 0;
  margin-inline-start: -0.05em;
}

.jump__lede {
  max-width: 40ch;
}
</style>
