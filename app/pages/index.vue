<script setup lang="ts">
useSeoMeta({
  title: 'Billy Maulana — Frontend Architect & Creative Developer',
  ogTitle: 'Billy Maulana — Frontend Architect & Creative Developer',
  description: 'Frontend Architect with 7+ years crafting interfaces that move millions. Vue.js, TypeScript, Motion Design.',
  ogDescription: 'Frontend Architect with 7+ years crafting interfaces that move millions.',
})
</script>

<template>
  <main class="portfolio">
    <!-- 01: Hero — Variable font proximity + WebGL displacement -->
    <SectionHero />

    <!-- 02: Manifesto — Scroll-scrub word reveal (blur-to-sharp) -->
    <SectionManifesto />

    <!-- 03: About — Kinetic stats + text treatments -->
    <SectionAbout />

    <!-- 04: Projects — Horizontal scroll typography -->
    <SectionProjects />

    <!-- 05: Marquee — Infinite scroll ticker -->
    <SectionMarquee />

    <!-- 06: Contact — CTA with blue accent moment -->
    <SectionContact />

    <!-- 07: Footer — Mirror of hero (circular narrative) -->
    <SectionFooter />
  </main>
</template>

<style scoped>
.portfolio {
  position: relative;
  z-index: var(--z-content);
}
</style>
