<script setup lang="ts">
import { useSpecimenContent } from '~/calibration/useSpecimenContent'

const c = useSpecimenContent()
</script>

<template>
  <div class="value">
    <p class="sp-m value__meta">
      {{ c.role }} — {{ c.location }}
    </p>

    <h2 class="sp-d value__mark">
      <span class="value__line" data-flip>{{ c.first }}</span>
      <span class="value__line value__line--muted" data-flip>{{ c.last }}</span>
    </h2>

    <p class="value__lede sp-b">
      {{ c.tagline }}
    </p>
  </div>
</template>

<style scoped>
.value {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.75rem;
  height: 100%;
}

/* Dua baris berukuran SAMA, dibedakan hanya oleh nilai — pola Mugen.
   Kedalaman muncul tanpa satu pun efek. */
.value__mark {
  display: flex;
  flex-direction: column;
  margin: 0;
  margin-inline-start: -0.05em;
}

.value__line {
  display: block;
}

.value__line--muted {
  color: var(--sp-muted);
}

.value__lede {
  max-width: 44ch;
}
</style>
