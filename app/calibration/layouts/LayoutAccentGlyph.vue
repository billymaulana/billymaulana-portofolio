<script setup lang="ts">
import { useSpecimenContent } from '~/calibration/useSpecimenContent'

defineProps<{ accent: string | null }>()

const c = useSpecimenContent()
</script>

<template>
  <div class="glyph">
    <p class="sp-m glyph__meta">
      {{ c.role }} — {{ c.location }}
    </p>

    <h2 class="sp-d glyph__mark">
      <span data-flip>{{ c.full }}</span><span class="glyph__mark-accent" :style="accent ? { color: accent } : undefined" data-flip>®</span>
    </h2>

    <p class="glyph__lede sp-b">
      {{ c.tagline }}
    </p>
  </div>
</template>

<style scoped>
.glyph {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.75rem;
  height: 100%;
}

/* Satu glyph diberi warna, sisanya netral — pola Viper. Aksen jadi peristiwa, bukan dekorasi. */
.glyph__mark {
  margin: 0;
  margin-inline-start: -0.05em;
  text-wrap: balance;
}

.glyph__mark-accent {
  font-size: 0.42em;
  vertical-align: super;
  letter-spacing: 0;
}

.glyph__lede {
  max-width: 44ch;
}
</style>
