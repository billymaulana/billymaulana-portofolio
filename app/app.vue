<script setup lang="ts">
const isLoading = ref(true)
const showContent = ref(false)
const splashKey = ref(0)
const mainContentRef = ref<HTMLElement | null>(null)

// Reset splash on HMR
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    isLoading.value = true
    showContent.value = false
    splashKey.value++
  })
}

// Pre-load GSAP
let gsapModule: typeof import('gsap') | null = null
onMounted(async () => {
  gsapModule = await import('gsap')
})

async function handleSplashComplete() {
  // Show content first (but it's invisible via CSS)
  showContent.value = true

  // Small delay to ensure DOM is ready
  await new Promise(resolve => setTimeout(resolve, 50))
  await nextTick()

  // Hide splash after content is ready
  isLoading.value = false

  const gsap = gsapModule?.gsap || (await import('gsap')).gsap

  if (mainContentRef.value) {
    // Get hero elements
    const heroName = mainContentRef.value.querySelector('.hero-name')
    const heroSubtitle = mainContentRef.value.querySelector('.hero-subtitle')
    const heroScroll = mainContentRef.value.querySelector('.hero-scroll')
    const heroCorners = mainContentRef.value.querySelectorAll('.corner')
    const decorLines = mainContentRef.value.querySelectorAll('.decor-line')

    // Set initial states for all elements
    gsap.set(mainContentRef.value, { opacity: 0 })

    if (heroName) {
      const chars = heroName.querySelectorAll('.hero-char')
      gsap.set(chars, {
        y: 80,
        opacity: 0,
        rotateX: -30,
      })
    }

    if (heroSubtitle) {
      const words = heroSubtitle.querySelectorAll('.subtitle-word')
      gsap.set(words, {
        y: 30,
        opacity: 0,
      })
    }

    if (decorLines.length) {
      gsap.set(decorLines, { scaleX: 0 })
    }

    if (heroCorners.length) {
      gsap.set(heroCorners, { opacity: 0 })
    }

    if (heroScroll) {
      gsap.set(heroScroll, { opacity: 0, y: 20 })
    }

    // Create smooth entrance timeline
    const tl = gsap.timeline()

    // Fade in main content smoothly
    tl.to(mainContentRef.value, {
      opacity: 1,
      duration: 0.6,
      ease: 'power2.out',
    })

    // Hero name characters
    if (heroName) {
      const chars = heroName.querySelectorAll('.hero-char')
      tl.to(chars, {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 1,
        stagger: 0.02,
        ease: 'power3.out',
      }, '-=0.3')
    }

    // Subtitle words
    if (heroSubtitle) {
      const words = heroSubtitle.querySelectorAll('.subtitle-word')
      tl.to(words, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.06,
        ease: 'power2.out',
      }, '-=0.7')
    }

    // Decorative lines
    if (decorLines.length) {
      tl.to(decorLines, {
        scaleX: 1,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power2.inOut',
      }, '-=0.5')
    }

    // Corners
    if (heroCorners.length) {
      tl.to(heroCorners, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.03,
        ease: 'power2.out',
      }, '-=0.4')
    }

    // Scroll indicator
    if (heroScroll) {
      tl.to(heroScroll, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.2')
    }
  }
}

useHead({
  htmlAttrs: { lang: 'en' },
  bodyAttrs: { class: 'bg-black' },
})
</script>

<template>
  <div class="app">
    <!-- Splash Screen -->
    <IntroSplash v-if="isLoading" :key="splashKey" @complete="handleSplashComplete" />

    <!-- Main Content with Transition -->
    <div v-show="showContent" ref="mainContentRef" class="main-content">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  background: #000;
  overflow: hidden;
}

.main-content {
  will-change: opacity, transform;
  opacity: 0;
}
</style>
