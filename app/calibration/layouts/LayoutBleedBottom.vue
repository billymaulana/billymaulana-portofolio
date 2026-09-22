<script setup lang="ts">
import { useSpecimenContent } from '~/calibration/useSpecimenContent'

const c = useSpecimenContent()
</script>

<template>
  <div class="bleed">
    <p class="bleed__lede sp-b">
      {{ c.tagline }} {{ c.years }} tahun di Vue.js, {{ c.count }} proyek, 80M+ pengguna.
    </p>

    <p class="sp-m bleed__meta">
      {{ c.role }} — {{ c.location }}
    </p>

    <h2 class="sp-d bleed__mark" data-flip>
      {{ c.full }}
    </h2>
  </div>
</template>

<style scoped>
.bleed {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 34ch) 1fr;
  align-content: space-between;
  height: 100%;
  row-gap: 2rem;
}

.bleed__lede {
  grid-column: 1;
  max-width: 34ch;
}

.bleed__meta {
  grid-column: 2;
  justify-self: end;
  align-self: start;
  text-align: right;
}

/* Menembus tepi kiri dan bawah — pola Möbius: halaman terasa lebih besar dari layar. */
.bleed__mark {
  grid-column: 1 / -1;
  margin: 0;
  margin-inline-start: -0.06em;
  margin-block-end: -0.16em;
  white-space: nowrap;
}
</style>
