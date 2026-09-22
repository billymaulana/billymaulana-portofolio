<script setup lang="ts">
import { useSpecimenContent } from '~/calibration/useSpecimenContent'

const c = useSpecimenContent()
</script>

<template>
  <div class="blocks">
    <p class="sp-m blocks__meta">
      {{ c.role }} — {{ c.location }}
    </p>

    <h2 class="sp-d blocks__mark">
      <span v-for="(b, i) in c.blocks" :key="i" class="blocks__line" :style="{ opacity: 1 - i * 0.22 }" data-flip>{{ b }}</span>
    </h2>

    <ul class="blocks__rows">
      <li v-for="p in c.rows" :key="p.id" class="blocks__row sp-b" data-flip>
        <span>{{ p.name }}</span>
        <span class="blocks__year">{{ p.year }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.blocks {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 22ch);
  grid-template-rows: auto 1fr;
  align-items: start;
  gap: 1.5rem 3rem;
  height: 100%;
}

.blocks__meta {
  grid-column: 1 / -1;
}

/* Wordmark dipecah jadi blok bertumpuk dengan intensitas menurun — pola Vertical.
   Mata membaca ke bawah, bukan ke samping. */
.blocks__mark {
  grid-column: 1;
  display: flex;
  flex-direction: column;
  margin: 0;
  margin-inline-start: -0.05em;
}

.blocks__line {
  display: block;
}

.blocks__rows {
  grid-column: 2;
  align-self: end;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.blocks__row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid currentcolor;
  padding-block-start: 0.35rem;
}

.blocks__year {
  font-variant-numeric: tabular-nums;
  opacity: 0.55;
}
</style>
