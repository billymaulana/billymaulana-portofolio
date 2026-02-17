<script setup lang="ts">
const { scrollTo } = useSmoothScroll()

const isScrolled = ref(false)
const isHidden = ref(false)
const isMobileOpen = ref(false)
let lastScrollY = 0

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

function handleNavClick(href: string) {
  isMobileOpen.value = false
  scrollTo(href, { offset: -80 })
}

onMounted(() => {
  function onScroll() {
    const currentY = window.scrollY
    isScrolled.value = currentY > 50
    isHidden.value = currentY > lastScrollY && currentY > 300
    lastScrollY = currentY
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>

<template>
  <header
    class="nav"
    :class="{
      'nav--scrolled': isScrolled,
      'nav--hidden': isHidden && !isMobileOpen,
    }"
  >
    <nav class="nav__inner page-max page-margin flex-between" aria-label="Main navigation">
      <UiMagneticButton tag="a" href="#" :strength="0.2" class="nav__logo" aria-label="Billy Maulana — Home" @click.prevent="scrollTo(0)">
        <span class="text-[1.25rem] tracking-[-0.02em] font-900">BM</span>
        <span class="nav__logo-dot" />
      </UiMagneticButton>

      <ul class="nav__links" role="list">
        <li v-for="item in navItems" :key="item.href">
          <UiMagneticButton tag="a" :href="item.href" :strength="0.15" class="nav__link link-underline" @click.prevent="handleNavClick(item.href)">
            {{ item.label }}
          </UiMagneticButton>
        </li>
      </ul>

      <button
        class="nav__hamburger"
        :class="{ open: isMobileOpen }"
        aria-label="Toggle menu"
        :aria-expanded="isMobileOpen"
        @click="isMobileOpen = !isMobileOpen"
      >
        <span />
        <span />
      </button>
    </nav>

    <!-- Mobile Menu -->
    <Transition name="mobile-menu">
      <div v-if="isMobileOpen" class="nav__mobile">
        <ul role="list">
          <li v-for="(item, i) in navItems" :key="item.href" :style="{ transitionDelay: `${i * 80}ms` }">
            <a :href="item.href" class="nav__mobile-link" @click.prevent="handleNavClick(item.href)">
              {{ item.label }}
            </a>
          </li>
        </ul>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-nav);
  padding: 1.5rem 0;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav--scrolled {
  padding: 1rem 0;
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.nav--hidden {
  transform: translateY(-100%);
}

.nav__inner {
  height: 40px;
}

.nav__logo {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-text-primary);
  cursor: pointer;
}

.nav__logo-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
}

.nav__links {
  display: flex;
  gap: 2.5rem;
  list-style: none;
}

.nav__link {
  font-size: var(--text-small);
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: color 0.3s;
  cursor: pointer;
}

.nav__link:hover {
  color: var(--color-text-primary);
}

.nav__hamburger {
  display: none;
  flex-direction: column;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}

.nav__hamburger span {
  display: block;
  width: 24px;
  height: 2px;
  background: var(--color-text-primary);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav__hamburger.open span:first-child {
  transform: rotate(45deg) translate(3px, 3px);
}

.nav__hamburger.open span:last-child {
  transform: rotate(-45deg) translate(3px, -3px);
}

.nav__mobile {
  position: fixed;
  inset: 0;
  background: var(--color-bg-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: -1;
}

.nav__mobile ul {
  list-style: none;
  text-align: center;
}

.nav__mobile li {
  opacity: 0;
  transform: translateY(20px);
  animation: mobileItemIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.nav__mobile-link {
  font-size: var(--text-h1);
  font-weight: 900;
  color: var(--color-text-primary);
  display: block;
  padding: 0.5rem 0;
  transition: color 0.3s;
}

.nav__mobile-link:hover {
  color: var(--color-accent);
}

@keyframes mobileItemIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.mobile-menu-enter-active {
  transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.mobile-menu-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .nav__links {
    display: none;
  }

  .nav__hamburger {
    display: flex;
  }
}
</style>
