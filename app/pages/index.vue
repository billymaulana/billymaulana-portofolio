<script setup lang="ts">
useSeoMeta({
  title: 'Billy Maulana — Frontend Architect & Creative Developer',
  ogTitle: 'Billy Maulana — Frontend Architect & Creative Developer',
  description: 'Frontend Architect with 7+ years crafting interfaces that move millions. Vue.js, TypeScript, Motion Design.',
  ogDescription: 'Frontend Architect with 7+ years crafting interfaces that move millions.',
})
</script>

<template>
  <main id="main" class="portfolio">
    <!-- 01: Hero — Massive type + fluid distortion -->
    <SectionHero />

    <!-- 02: Manifesto — Scrubbed per-word reveal -->
    <SectionManifesto />

    <!-- 03: About — Golden ratio 2-col + stats -->
    <SectionAbout />

    <!-- 04: Projects — Staggered asymmetric grid -->
    <SectionProjects />

    <!-- 05: Marquee — Infinite kinetic ticker -->
    <SectionMarquee />

    <!-- 06: CTA — Full-screen invitation -->
    <SectionCTA />

    <!-- 07: Footer — Closing credits -->
    <SectionFooter />
  </main>
</template>

<style scoped>
.portfolio {
  position: relative;
  z-index: var(--z-content);
}
</style>
