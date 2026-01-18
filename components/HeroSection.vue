<script setup lang="ts">
const heroRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const scrollIndicatorRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  try {
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')

    gsap.registerPlugin(ScrollTrigger)

    const tl = gsap.timeline({
      defaults: { ease: 'power4.out' },
      delay: 0.5,
    })

    if (titleRef.value) {
      tl.fromTo(
        titleRef.value,
        { y: 150, opacity: 0, skewY: 7 },
        { y: 0, opacity: 1, skewY: 0, duration: 1.2 },
      )
    }

    if (subtitleRef.value) {
      tl.fromTo(
        subtitleRef.value,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        '-=0.8',
      )
    }

    if (descRef.value) {
      tl.fromTo(
        descRef.value,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.6',
      )
    }

    if (ctaRef.value) {
      tl.fromTo(
        ctaRef.value,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.4',
      )
    }

    if (scrollIndicatorRef.value) {
      tl.fromTo(
        scrollIndicatorRef.value,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.2',
      )

      gsap.to(scrollIndicatorRef.value, {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 1.5,
        ease: 'power1.inOut',
      })
    }

    if (heroRef.value) {
      const decorElements = heroRef.value.querySelectorAll('.decor-element')
      decorElements.forEach((el, index) => {
        gsap.to(el, {
          y: 'random(-20, 20)',
          x: 'random(-10, 10)',
          rotation: 'random(-5, 5)',
          duration: 'random(3, 5)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.2,
        })
      })
    }
  }
  catch (error) {
    console.warn('Hero animation failed:', error)
  }
})

function scrollToAbout() {
  const aboutSection = document.querySelector('#about')
  if (aboutSection) {
    aboutSection.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section
    id="home"
    ref="heroRef"
    class="min-h-screen flex flex-col justify-center relative overflow-hidden grid-bg"
  >
    <div class="absolute inset-0 pointer-events-none">
      <div class="decor-element absolute top-20 left-10 w-32 h-32 border-3 border-primary/20" />
      <div class="decor-element absolute bottom-40 right-20 w-24 h-24 bg-secondary/10" />
      <div class="decor-element absolute top-1/3 right-1/4 w-16 h-16 border-3 border-accent/20 rotate-45" />
      <div class="decor-element absolute bottom-1/4 left-1/3 w-20 h-20 bg-electric/10 rounded-full" />
      <div class="decor-element absolute top-1/2 left-10 w-8 h-8 bg-primary/10" />
      <div class="decor-element absolute top-20 right-1/3 w-12 h-12 border-2 border-warning/20 rounded-full" />
    </div>

    <div class="container-custom section-padding relative z-10">
      <div class="max-w-5xl">
        <div ref="subtitleRef" class="mb-4 opacity-0">
          <span class="font-mono text-primary text-sm md:text-base uppercase tracking-widest">
            Frontend Developer
          </span>
        </div>

        <h1
          ref="titleRef"
          class="text-fluid-hero font-accent leading-none mb-6 opacity-0"
        >
          <span class="block">BILLY</span>
          <span class="block text-primary">MAULANA</span>
        </h1>

        <div ref="descRef" class="max-w-2xl mb-8 opacity-0">
          <p class="text-fluid-lg text-text-muted leading-relaxed">
            Versatile Front-End Developer with
            <span class="text-primary font-bold">7+ years</span> of experience.
            Specializing in <span class="text-secondary">SPA development</span> utilizing
            <span class="text-accent">Vue.js Ecosystem</span>.
            Crafting complex web applications with stunning animations.
          </p>
        </div>

        <div ref="ctaRef" class="flex flex-wrap gap-4 opacity-0">
          <button class="btn-filled magnetic-btn" @click="scrollToAbout">
            Explore My Work
          </button>
          <a
            href="mailto:billymaulana1999@gmail.com"
            class="btn magnetic-btn"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </div>

    <div
      ref="scrollIndicatorRef"
      class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer opacity-0"
      @click="scrollToAbout"
    >
      <span class="font-mono text-xs text-text-muted uppercase tracking-widest">Scroll</span>
      <div class="w-px h-12 bg-gradient-to-b from-primary to-transparent" />
    </div>

    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
  </section>
</template>
