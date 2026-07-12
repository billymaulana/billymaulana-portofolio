<script setup lang="ts">
useSeoMeta({
  title: 'Rehearsal — Liquid Type Spike',
  robots: 'noindex',
})

const lines = [
  { text: 'BILLY', indent: 0 },
  { text: 'MAULANA', indent: 120 },
]
</script>

<template>
  <div class="rehearsal">
    <span class="rehearsal__label">REHEARSAL 001 — LIQUID TYPE FEASIBILITY</span>
    <TheatreLiquidType :lines="lines" :font-size="260" show-fps />
    <span class="rehearsal__hint">move the pointer through the letters</span>
  </div>
</template>

<style scoped>
.rehearsal {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2.5rem;
  min-height: 100vh;
  padding-inline: clamp(1.5rem, 5vw, 6rem);
  background: #0A0A0A;
}

.rehearsal__label,
.rehearsal__hint {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6E6E6E;
}
</style>
