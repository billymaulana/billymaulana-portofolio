<script setup lang="ts">
import { useSpecimenContent } from '~/calibration/useSpecimenContent'

const c = useSpecimenContent()
</script>

<template>
  <div class="min">
    <p class="min__lede sp-b">
      {{ c.tagline }}
    </p>

    <h2 class="sp-d min__mark" data-flip>
      {{ c.full }}
    </h2>

    <p class="sp-m min__meta">
      {{ c.role }} — {{ c.location }}
    </p>
  </div>
</template>

<style scoped>
/* Sedikit elemen, banyak ruang — pola Portrixe. Leading display longgar sengaja dibiarkan. */
.min {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2.5rem;
  height: 100%;
  text-align: center;
}

.min__mark {
  margin: 0;
  text-wrap: balance;
}

.min__lede {
  max-width: 30ch;
}
</style>
