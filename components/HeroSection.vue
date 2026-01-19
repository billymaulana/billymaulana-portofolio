<script setup lang="ts">
const heroRef = ref<HTMLElement | null>(null)
const titleRef = ref<HTMLElement | null>(null)
const nameRef = ref<HTMLElement | null>(null)
const subtitleRef = ref<HTMLElement | null>(null)
const descRef = ref<HTMLElement | null>(null)
const ctaRef = ref<HTMLElement | null>(null)
const scrollIndicatorRef = ref<HTMLElement | null>(null)
const yearRef = ref<HTMLElement | null>(null)

// Text scramble effect
const scrambleChars = '!<>-_\\/[]{}=+*^?#@$%&'
const scrambledText = ref('BILLY MAULANA')
const isScrambling = ref(false)

function scrambleText(finalText: string, duration: number = 1500) {
  isScrambling.value = true
  const length = finalText.length
  let iteration = 0
  const totalIterations = duration / 30

  const interval = setInterval(() => {
    scrambledText.value = finalText
      .split('')
      .map((char, index) => {
        if (char === ' ') return ' '
        if (index < iteration / (totalIterations / length)) {
          return finalText[index]
        }
        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
      })
      .join('')

    iteration++

    if (iteration >= totalIterations) {
      clearInterval(interval)
      scrambledText.value = finalText
      isScrambling.value = false
    }
  }, 30)
}

onMounted(async () => {
  try {
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')

    gsap.registerPlugin(ScrollTrigger)

    // Initial scramble
    scrambleText('BILLY MAULANA', 2000)

    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      delay: 0.3,
    })

    // Animate year
    if (yearRef.value) {
      tl.fromTo(
        yearRef.value,
        { opacity: 0, x: -50 },
        { opacity: 0.1, x: 0, duration: 1 },
        0,
      )
    }

    // Animate subtitle with glitch
    if (subtitleRef.value) {
      tl.fromTo(
        subtitleRef.value,
        { opacity: 0, x: -100, skewX: 10 },
        { opacity: 1, x: 0, skewX: 0, duration: 1.2 },
        0.2,
      )
    }

    // Animate main title
    if (titleRef.value) {
      const chars = titleRef.value.querySelectorAll('.char')
      tl.fromTo(
        chars,
        { y: 200, opacity: 0, rotateX: -90 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.4,
          stagger: 0.03,
          ease: 'expo.out',
        },
        0.4,
      )
    }

    // Animate name with reveal
    if (nameRef.value) {
      tl.fromTo(
        nameRef.value,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power4.inOut' },
        0.8,
      )
    }

    // Description reveal
    if (descRef.value) {
      tl.fromTo(
        descRef.value,
        { opacity: 0, y: 60, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1 },
        1,
      )
    }

    // CTA buttons
    if (ctaRef.value) {
      const buttons = ctaRef.value.querySelectorAll('button, a')
      tl.fromTo(
        buttons,
        { opacity: 0, y: 40, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.1 },
        1.2,
      )
    }

    // Scroll indicator
    if (scrollIndicatorRef.value) {
      tl.fromTo(
        scrollIndicatorRef.value,
        { opacity: 0, y: -30 },
        { opacity: 1, y: 0, duration: 0.8 },
        1.4,
      )

      gsap.to(scrollIndicatorRef.value.querySelector('.scroll-line'), {
        scaleY: 1.5,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: 'power1.inOut',
      })
    }

    // Floating decorative elements
    if (heroRef.value) {
      const decorElements = heroRef.value.querySelectorAll('.decor-element')
      decorElements.forEach((el, index) => {
        gsap.set(el, { opacity: 0 })
        gsap.to(el, {
          opacity: 1,
          duration: 1,
          delay: 1.5 + index * 0.1,
        })
        gsap.to(el, {
          y: 'random(-30, 30)',
          x: 'random(-20, 20)',
          rotation: 'random(-15, 15)',
          duration: 'random(4, 7)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.3,
        })
      })

      // Abstract circles animation
      const circles = heroRef.value.querySelectorAll('.abstract-circle')
      circles.forEach((el, index) => {
        gsap.to(el, {
          scale: 'random(0.8, 1.2)',
          x: 'random(-50, 50)',
          y: 'random(-50, 50)',
          duration: 'random(5, 8)',
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: index * 0.5,
        })
      })
    }

    // Parallax effect on scroll
    if (heroRef.value && titleRef.value) {
      gsap.to(titleRef.value, {
        yPercent: 50,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
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

// Re-scramble on hover
function handleNameHover() {
  if (!isScrambling.value) {
    scrambleText('BILLY MAULANA', 800)
  }
}
</script>

<template>
  <section
    id="home"
    ref="heroRef"
    class="min-h-screen flex flex-col justify-center relative overflow-hidden"
  >
    <!-- Abstract Background Circles -->
    <div class="absolute inset-0 pointer-events-none overflow-hidden">
      <div class="abstract-circle w-96 h-96 bg-primary/20 -top-48 -right-48" />
      <div class="abstract-circle w-80 h-80 bg-secondary/15 bottom-20 -left-40" />
      <div class="abstract-circle w-64 h-64 bg-accent/10 top-1/3 right-1/4" />
    </div>

    <!-- Grid Background -->
    <div class="absolute inset-0 grid-bg opacity-50" />

    <!-- Decorative Elements -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="decor-element absolute top-20 left-10 w-32 h-32 border border-primary/30 rotate-12" />
      <div class="decor-element absolute bottom-40 right-20 w-24 h-24 border border-secondary/20 -rotate-12" />
      <div class="decor-element absolute top-1/3 right-1/4 w-16 h-16 border border-accent/30 rotate-45" />
      <div class="decor-element absolute bottom-1/4 left-1/3 w-20 h-1 bg-primary/40" />
      <div class="decor-element absolute top-1/2 left-10 w-1 h-20 bg-secondary/30" />
      <div class="decor-element absolute top-20 right-1/3 w-12 h-12 border border-electric/20 rounded-full" />
      <!-- Floating dots -->
      <div class="decor-element absolute top-32 right-40 w-2 h-2 bg-primary rounded-full" />
      <div class="decor-element absolute bottom-32 left-1/4 w-3 h-3 bg-secondary rounded-full" />
      <div class="decor-element absolute top-2/3 right-1/3 w-2 h-2 bg-accent rounded-full" />
    </div>

    <!-- Year Watermark -->
    <div
      ref="yearRef"
      class="absolute top-20 right-10 md:right-20 text-[20vw] font-accent text-white/5 leading-none select-none pointer-events-none"
    >
      25
    </div>

    <!-- Main Content -->
    <div class="container-custom section-padding relative z-10">
      <div class="max-w-6xl">
        <!-- Subtitle -->
        <div ref="subtitleRef" class="mb-6 opacity-0">
          <div class="flex items-center gap-4">
            <div class="w-12 h-px bg-gradient-to-r from-primary to-transparent" />
            <span class="font-mono text-primary text-sm md:text-base uppercase tracking-[0.3em]">
              Frontend Developer
            </span>
          </div>
        </div>

        <!-- Main Title with Glitch -->
        <div class="overflow-hidden mb-2">
          <h1
            ref="titleRef"
            class="text-fluid-display font-accent leading-[0.85] tracking-tight perspective-1000"
            @mouseenter="handleNameHover"
          >
            <span class="block overflow-hidden">
              <span
                v-for="(char, index) in scrambledText.split('')"
                :key="index"
                class="char inline-block"
                :class="[
                  char === ' ' ? 'w-4' : '',
                  index < 5 ? 'text-white' : 'text-primary',
                ]"
                :style="{ transitionDelay: `${index * 0.02}s` }"
              >
                {{ char === ' ' ? '&nbsp;' : char }}
              </span>
            </span>
          </h1>
        </div>

        <!-- Glitch Name Effect -->
        <div
          ref="nameRef"
          class="mb-8"
        >
          <div class="glitch text-2xl md:text-4xl font-mono text-text-muted tracking-widest" data-text="< CREATIVE DEVELOPER />">
            &lt; CREATIVE DEVELOPER /&gt;
          </div>
        </div>

        <!-- Description -->
        <div ref="descRef" class="max-w-2xl mb-10 opacity-0">
          <p class="text-lg md:text-xl text-text-muted leading-relaxed">
            Crafting <span class="text-primary font-semibold rgb-split-hover">immersive digital experiences</span>
            with <span class="text-secondary">7+ years</span> of expertise.
            Specializing in <span class="text-accent hover-underline cursor-pointer">Vue.js Ecosystem</span>,
            <span class="text-neon hover-underline cursor-pointer">animations</span>, and
            <span class="text-electric hover-underline cursor-pointer">interactive interfaces</span>.
          </p>
        </div>

        <!-- CTA Buttons -->
        <div ref="ctaRef" class="flex flex-wrap gap-6 opacity-0">
          <button
            class="group relative px-8 py-4 bg-primary text-surface font-bold uppercase tracking-widest overflow-hidden magnetic-btn"
            @click="scrollToAbout"
          >
            <span class="relative z-10 flex items-center gap-3">
              <span>Explore Work</span>
              <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
            <div class="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </button>

          <a
            href="mailto:billymaulana1999@gmail.com"
            class="group relative px-8 py-4 border-2 border-primary text-primary font-bold uppercase tracking-widest overflow-hidden magnetic-btn hover-glitch"
          >
            <span class="relative z-10">Get In Touch</span>
            <div class="absolute inset-0 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
            <span class="absolute inset-0 flex items-center justify-center text-surface opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-150 z-20">
              Get In Touch
            </span>
          </a>
        </div>

        <!-- Tech Stack Pills -->
        <div class="mt-12 flex flex-wrap gap-3">
          <span
            v-for="tech in ['Vue.js', 'Nuxt', 'TypeScript', 'GSAP', 'Three.js']"
            :key="tech"
            class="px-4 py-1 text-xs font-mono text-text-muted border border-text-dim/30 hover:border-primary hover:text-primary transition-colors duration-300 cursor-default"
          >
            {{ tech }}
          </span>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div
      ref="scrollIndicatorRef"
      class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 cursor-pointer opacity-0 group"
      @click="scrollToAbout"
    >
      <span class="font-mono text-xs text-text-muted uppercase tracking-[0.2em] group-hover:text-primary transition-colors">
        Scroll
      </span>
      <div class="relative h-16 w-px">
        <div class="scroll-line absolute inset-0 bg-gradient-to-b from-primary via-secondary to-transparent origin-top" />
      </div>
    </div>

    <!-- Bottom Gradient Line -->
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

    <!-- Noise Overlay -->
    <div class="noise-bg" />
  </section>
</template>

<style scoped>
.text-fluid-display {
  font-size: clamp(3rem, 12vw, 12rem);
}

.char {
  will-change: transform, opacity;
  transform-style: preserve-3d;
}

.abstract-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}
</style>
