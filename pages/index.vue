<script setup lang="ts">
useSeoMeta({
  title: 'Billy Maulana | Frontend Developer',
  description: 'Versatile Front-End Developer with 7+ years of experience specializing in Vue.js ecosystem. Building complex web apps with stunning animations.',
  ogTitle: 'Billy Maulana | Frontend Developer',
  ogDescription: 'Versatile Front-End Developer with 7+ years of experience specializing in Vue.js ecosystem.',
  ogUrl: 'https://billymaulana.com',
  twitterTitle: 'Billy Maulana | Frontend Developer',
  twitterDescription: 'Versatile Front-End Developer with 7+ years of experience specializing in Vue.js ecosystem.',
})
</script>

<template>
  <div class="page-home">
    <HeroSection />

    <MarqueeText text="FRONTEND DEVELOPER" :speed="40" />

    <AboutSection />

    <MarqueeText text="VUE.JS • NUXT • TYPESCRIPT • GSAP" :speed="35" reverse />

    <ExperienceSection />

    <SkillsSection />

    <MarqueeText text="CLEAN CODE • PERFORMANCE • ACCESSIBILITY" :speed="45" />

    <WorksSection />

    <ContactSection />

    <MarqueeText text="LET'S BUILD SOMETHING AMAZING" :speed="30" reverse />

    <FooterSection />
  </div>
</template>
