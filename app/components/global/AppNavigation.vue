<script setup lang="ts">
import { useSmoothScroll } from '~/composables/useSmoothScroll'

const navRef = ref<HTMLElement>()
const isVisible = ref(false)
const isScrolled = ref(false)
const { scrollTo } = useSmoothScroll()

let lastScrollY = 0
let ticking = false
let gsapModule: typeof import('gsap').default | null = null
let scrollTriggers: gsap.plugins.ScrollTriggerInstance[] = []

onMounted(async () => {
  gsapModule = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsapModule.registerPlugin(ScrollTrigger)

  // Show nav after scrolling past hero
  scrollTriggers.push(ScrollTrigger.create({
    trigger: 'body',
    start: '100px top',
    onEnter: () => { isVisible.value = true },
    onLeaveBack: () => { isVisible.value = false },
  }))

  // Backdrop on deep scroll
  scrollTriggers.push(ScrollTrigger.create({
    trigger: 'body',
    start: '50vh top',
    onEnter: () => { isScrolled.value = true },
    onLeaveBack: () => { isScrolled.value = false },
  }))

  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  scrollTriggers.forEach(st => st.kill())
  scrollTriggers = []
})

function onScroll() {
  if (ticking || !gsapModule)
    return
  ticking = true

  requestAnimationFrame(() => {
    const currentY = window.scrollY
    const delta = currentY - lastScrollY

    if (delta > 10 && currentY > 300) {
      if (navRef.value) {
        gsapModule!.to(navRef.value, {
          y: '-100%',
          duration: 0.5,
          ease: 'expo.out',
        })
      }
    }
    else if (delta < -5) {
      if (navRef.value) {
        gsapModule!.to(navRef.value, {
          y: '0%',
          duration: 0.5,
          ease: 'expo.out',
        })
      }
    }

    lastScrollY = currentY
    ticking = false
  })
}

function scrollToSection(selector: string) {
  const el = document.querySelector(selector)
  if (el)
    scrollTo(el as HTMLElement, { duration: 2.0 })
}
</script>

<template>
  <nav
    ref="navRef"
    class="nav"
    :class="{ 'nav--visible': isVisible, 'nav--scrolled': isScrolled }"
    role="navigation"
    aria-label="Main navigation"
  >
    <div class="nav__inner page-margin">
      <!-- Logo: monogram in display font -->
      <a
        class="nav__logo"
        href="#"
        aria-label="Back to top"
        data-cursor-label="Top"
        @click.prevent="scrollToSection('.section-hero')"
      >
        BM
      </a>

      <!-- Links -->
      <div class="nav__links">
        <a
          class="nav__link"
          href="#work"
          data-cursor-label="View"
          @click.prevent="scrollToSection('#work')"
        >
          Work
        </a>
        <a
          class="nav__link"
          href="#contact"
          data-cursor-label="Say hi"
          @click.prevent="scrollToSection('#contact')"
        >
          Contact
        </a>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-nav);
  opacity: 0;
  transition: opacity 0.4s var(--ease-expo),
              background-color 0.4s var(--ease-expo);
  pointer-events: none;
}

.nav--visible {
  opacity: 1;
  pointer-events: auto;
}

.nav--scrolled {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: clamp(3rem, 5vh, 4rem);
}

.nav__logo {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  color: var(--color-text-primary);
  text-decoration: none;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  transition: color 0.3s var(--ease-expo);
}

.nav__logo:hover {
  color: var(--color-accent);
}

.nav__links {
  display: flex;
  gap: clamp(1.5rem, 3vw, 2.5rem);
}

.nav__link {
  position: relative;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  text-decoration: none;
  color: var(--color-text-secondary);
  transition: color 0.3s var(--ease-expo);
}

.nav__link:hover {
  color: var(--color-text-primary);
}

/* Underline wipe on hover */
.nav__link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--color-text-primary);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s var(--ease-expo);
}

.nav__link:hover::after {
  transform: scaleX(1);
}
</style>
