<script setup lang="ts">
import { useSpecimenContent } from '~/calibration/useSpecimenContent'

const c = useSpecimenContent()
</script>

<template>
  <div class="dense">
    <span class="sp-d dense__num" aria-hidden="true" data-flip>{{ String(c.years).padStart(2, '0') }}</span>

    <div class="dense__col">
      <p class="sp-m">
        {{ c.role }} — {{ c.location }}
      </p>
      <h2 class="dense__name" data-flip>
        {{ c.full }}
      </h2>
      <p class="dense__lede sp-b">
        {{ c.tagline }}
      </p>
    </div>

    <ul class="dense__rows">
      <li v-for="p in c.rows" :key="p.id" class="dense__row sp-b" data-flip>
        <span>{{ p.name }}</span>
        <span class="dense__year">{{ p.year }}</span>
        <span class="dense__stack">{{ p.technologies.join(' · ') }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Angka bab besar kiri, teks kanan, daftar di bawah — pola Creative Web Manual.
   Kepadatan berasal dari konten nyata, bukan dari metadata implementasi. */
.dense {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-content: center;
  gap: 1.75rem 3rem;
  height: 100%;
}

.dense__num {
  grid-row: 1 / 3;
  align-self: start;
  line-height: 0.8;
}

.dense__col {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.dense__name {
  margin: 0;
  font-family: var(--sp-display-family);
  font-size: clamp(1.75rem, 4vw, 3.25rem);
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1;
}

.dense__lede {
  max-width: 46ch;
}

.dense__rows {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dense__row {
  display: grid;
  grid-template-columns: minmax(0, 13rem) 4.5rem minmax(0, 1fr);
  gap: 1.25rem;
  border-top: 1px solid currentcolor;
  padding-block-start: 0.4rem;
}

.dense__year {
  font-variant-numeric: tabular-nums;
  opacity: 0.6;
}

.dense__stack {
  opacity: 0.45;
}
</style>
