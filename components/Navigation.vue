<script setup lang="ts">
const isMenuOpen = ref(false)
const navRef = ref<HTMLElement | null>(null)
const isScrolled = ref(false)

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Works', href: '#works' },
  { label: 'Contact', href: '#contact' },
]

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  }
  else {
    document.body.style.overflow = ''
  }
}

function closeMenu() {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

function scrollToSection(href: string) {
  closeMenu()
  const element = document.querySelector(href)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

onMounted(async () => {
  const { gsap } = await import('gsap')

  gsap.fromTo(
    navRef.value,
    { y: -100, opacity: 0 },
    { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: 'power3.out' },
  )

  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 50
  })
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <nav
    ref="navRef"
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :class="[isScrolled ? 'bg-surface/90 backdrop-blur-md' : 'bg-transparent']"
  >
    <div class="container-custom px-6 py-4 flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-3" @click="scrollToSection('#home')">
        <Logo :size="40" :animated="false" />
        <span class="font-display font-bold text-xl hidden sm:block">BILLY<span class="text-primary">.</span></span>
      </NuxtLink>

      <div class="hidden lg:flex items-center gap-8">
        <button
          v-for="item in navItems"
          :key="item.href"
          class="font-mono text-sm uppercase tracking-wider text-text-muted hover:text-primary transition-colors duration-300 hover-underline"
          @click="scrollToSection(item.href)"
        >
          {{ item.label }}
        </button>
      </div>

      <div class="flex items-center gap-4">
        <a
          href="https://linkedin.com/in/billy-maulana"
          target="_blank"
          rel="noopener noreferrer"
          class="icon-btn"
          aria-label="LinkedIn"
        >
          <div class="i-simple-icons-linkedin w-5 h-5" />
        </a>
        <a
          href="https://github.com/billymaulana"
          target="_blank"
          rel="noopener noreferrer"
          class="icon-btn"
          aria-label="GitHub"
        >
          <div class="i-simple-icons-github w-5 h-5" />
        </a>

        <button
          class="lg:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
          @click="toggleMenu"
        >
          <span
            class="w-6 h-0.5 bg-text transition-all duration-300"
            :class="{ 'rotate-45 translate-y-2': isMenuOpen }"
          />
          <span
            class="w-6 h-0.5 bg-text transition-all duration-300"
            :class="{ 'opacity-0': isMenuOpen }"
          />
          <span
            class="w-6 h-0.5 bg-text transition-all duration-300"
            :class="{ '-rotate-45 -translate-y-2': isMenuOpen }"
          />
        </button>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="menu">
        <div
          v-if="isMenuOpen"
          class="fixed inset-0 bg-surface z-40 lg:hidden flex flex-col items-center justify-center"
        >
          <div class="flex flex-col items-center gap-8">
            <button
              v-for="(item, index) in navItems"
              :key="item.href"
              class="font-accent text-4xl sm:text-5xl uppercase tracking-wider text-text hover:text-primary transition-colors duration-300"
              :style="{ animationDelay: `${index * 0.1}s` }"
              @click="scrollToSection(item.href)"
            >
              {{ item.label }}
            </button>
          </div>

          <div class="absolute bottom-10 flex items-center gap-6">
            <a
              href="mailto:billymaulana1999@gmail.com"
              class="font-mono text-sm text-text-muted hover:text-primary transition-colors"
            >
              billymaulana1999@gmail.com
            </a>
          </div>
        </div>
      </Transition>
    </Teleport>
  </nav>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: all 0.5s cubic-bezier(0.77, 0, 0.175, 1);
}

.menu-enter-from,
.menu-leave-to {
  clip-path: circle(0% at calc(100% - 40px) 40px);
  opacity: 0;
}

.menu-enter-to,
.menu-leave-from {
  clip-path: circle(150% at calc(100% - 40px) 40px);
  opacity: 1;
}
</style>
