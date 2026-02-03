<script setup lang="ts">
import { useTextScramble } from '~/composables/useTextScramble'

const navItems = [
  { label: 'Work', href: '#works' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const navRefs = ref<HTMLElement[]>([])
const logoRef = ref<HTMLImageElement | null>(null)
const { setupHoverScramble } = useTextScramble()
const isScrolled = ref(false)

onMounted(async () => {
  // Setup text scramble on nav items
  navRefs.value.forEach((el) => {
    if (el)
      setupHoverScramble(el)
  })

  // Setup scroll listener
  window.addEventListener('scroll', onScroll, { passive: true })

  // Logo entrance animation
  if (logoRef.value) {
    const { gsap } = await import('gsap')
    gsap.fromTo(logoRef.value, {
      opacity: 0,
      scale: 0.8,
      filter: 'blur(10px)',
    }, {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power3.out',
      delay: 0.3,
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function onScroll() {
  isScrolled.value = window.scrollY > 50
}

function setNavRef(el: HTMLElement | null, index: number) {
  if (el)
    navRefs.value[index] = el
}
</script>

<template>
  <header
    class="header"
    :class="{ 'is-scrolled': isScrolled }"
  >
    <div class="header-inner">
      <a href="/" class="header-logo" data-cursor-label="Home">
        <img
          ref="logoRef"
          src="/assets/images/logo/billy-maulana-logo-white.svg"
          alt="Billy Maulana"
          class="logo-img"
        >
      </a>

      <nav class="header-nav">
        <a
          v-for="(item, index) in navItems"
          :key="item.label"
          :ref="(el) => setNavRef(el as HTMLElement, index)"
          :href="item.href"
          class="nav-link"
          data-cursor-hover
        >
          {{ item.label }}
        </a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 1.5rem 2rem;
  transition: background 0.3s ease, padding 0.3s ease;
}

.header.is-scrolled {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  padding: 1rem 2rem;
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1440px;
  margin: 0 auto;
}

.header-logo {
  display: flex;
  align-items: center;
}

.logo-img {
  height: 42px;
  width: auto;
  transition: opacity 0.3s ease, transform 0.3s ease, filter 0.3s ease;
}

.logo-img:hover {
  opacity: 0.9;
  transform: scale(1.05);
  filter: drop-shadow(0 0 12px rgba(0, 245, 255, 0.4));
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.nav-link {
  font-family: 'Satoshi', sans-serif;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.3s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 1px;
  background: #00F5FF;
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: white;
}

.nav-link:hover::after {
  width: 100%;
}

@media (max-width: 768px) {
  .header {
    padding: 1rem;
  }

  .header-nav {
    gap: 1.5rem;
  }

  .nav-link {
    font-size: 12px;
  }
}
</style>
