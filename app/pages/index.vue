<script setup lang="ts">
useSeoMeta({
  title: 'Billy Maulana — Frontend Architect & Creative Developer',
  ogTitle: 'Billy Maulana — Frontend Architect & Creative Developer',
  description: 'Frontend Architect with 7+ years crafting interfaces that move millions. Vue.js, TypeScript, Motion Design.',
  ogDescription: 'Frontend Architect with 7+ years crafting interfaces that move millions.',
})

const dividers: HTMLElement[] = []

function collectDivider(el: unknown) {
  const node = el as HTMLElement | null
  if (node && !dividers.includes(node))
    dividers.push(node)
}

onMounted(async () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches)
    return

  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  dividers.forEach((el) => {
    gsap.fromTo(el, {
      scaleX: 0,
    }, {
      scaleX: 1,
      duration: 1.5,
      ease: 'expo.inOut',
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
      },
    })
  })
})
</script>

<template>
  <main id="main" class="portfolio">
    <!-- 01: Hero — Massive type + fluid distortion -->
    <SectionHero />

    <div :ref="collectDivider" class="section-divider" aria-hidden="true" />

    <!-- 02: Manifesto — Scrubbed per-word reveal -->
    <SectionManifesto />

    <div :ref="collectDivider" class="section-divider" aria-hidden="true" />

    <!-- 03: About — Golden ratio 2-col + stats -->
    <SectionAbout />

    <div :ref="collectDivider" class="section-divider" aria-hidden="true" />

    <!-- 04: Projects — Staggered asymmetric grid -->
    <SectionProjects />

    <div :ref="collectDivider" class="section-divider" aria-hidden="true" />

    <!-- 05: Marquee — Infinite kinetic ticker -->
    <SectionMarquee />

    <div :ref="collectDivider" class="section-divider" aria-hidden="true" />

    <!-- 06: CTA — Full-screen invitation -->
    <SectionCTA />

    <div :ref="collectDivider" class="section-divider" aria-hidden="true" />

    <!-- 07: Footer — Closing credits -->
    <SectionFooter />
  </main>
</template>

<style scoped>
.portfolio {
  position: relative;
  z-index: var(--z-content);
}

/* Monograph page dividers — 1px accent line between sections */
.section-divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 71, 255, 0.25) 20%,
    rgba(0, 71, 255, 0.4) 50%,
    rgba(0, 71, 255, 0.25) 80%,
    transparent 100%
  );
  transform-origin: center;
  transform: scaleX(0);
  margin-inline: var(--page-margin);
  position: relative;
  z-index: var(--z-content);
}
</style>
