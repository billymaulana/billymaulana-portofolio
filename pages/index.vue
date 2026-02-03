<script setup lang="ts">
import { profile } from '~/data/profile'

// SEO Meta
useHead({
  title: `${profile.name} - ${profile.title}`,
  meta: [
    { name: 'description', content: profile.tagline },
    { property: 'og:title', content: `${profile.name} - ${profile.title}` },
    { property: 'og:description', content: profile.tagline },
    { property: 'og:type', content: 'website' },
  ],
})
</script>

<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <SectionsHeroSection />

    <!-- Marquee Section -->
    <SectionsMarqueeSection />

    <!-- Selected Works Section -->
    <SectionsWorksSection />

    <!-- About Section -->
    <SectionsAboutSection />

    <!-- Contact Section -->
    <SectionsContactSection />
  </div>
</template>

<style scoped>
.landing-page {
  overflow-x: hidden;
}
</style>
