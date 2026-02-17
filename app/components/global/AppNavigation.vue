<script setup lang="ts">
import { profile } from '~/constants/profile'

const { scrollTo } = useSmoothScroll()

const isScrolled = ref(false)
const isHidden = ref(false)
const isMenuOpen = ref(false)
let lastScrollY = 0

const navItems = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Contact', href: '#contact' },
]

function handleNavClick(href: string) {
  isMenuOpen.value = false
  setTimeout(() => scrollTo(href, { offset: -80 }), 400)
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
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

watch(isMenuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})
</script>

<template>
  <header
    class="nav"
    :class="{
      'nav--scrolled': isScrolled && !isMenuOpen,
      'nav--hidden': isHidden && !isMenuOpen,
      'nav--open': isMenuOpen,
    }"
  >
    <nav class="nav__bar page-margin" aria-label="Main navigation">
      <a
        href="#"
        class="nav__logo"
        aria-label="Billy Maulana — Home"
        @click.prevent="() => { isMenuOpen = false; scrollTo(0) }"
      >
        <img
          src="/assets/images/logo/billy-maulana-logo-white.svg"
          alt="BM"
          class="nav__logo-img"
        >
      </a>

      <button
        class="nav__trigger"
        :class="{ 'nav__trigger--open': isMenuOpen }"
        :aria-expanded="isMenuOpen"
        aria-label="Toggle menu"
        @click="toggleMenu"
      >
        <span class="nav__trigger-label">{{ isMenuOpen ? 'Close' : 'Menu' }}</span>
        <span class="nav__trigger-icon">
          <span class="nav__trigger-line" />
          <span class="nav__trigger-line" />
        </span>
      </button>
    </nav>

    <!-- Full-screen overlay -->
    <Transition name="menu">
      <div v-if="isMenuOpen" class="nav__overlay">
        <div class="nav__overlay-inner page-margin">
          <ul class="nav__menu" role="list">
            <li
              v-for="(item, i) in navItems"
              :key="item.href"
              class="nav__menu-item"
              :style="{ '--delay': `${0.15 + i * 0.08}s` }"
            >
              <a
                :href="item.href"
                class="nav__menu-link"
                @click.prevent="handleNavClick(item.href)"
              >
                <span class="nav__menu-index">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="nav__menu-text">{{ item.label }}</span>
              </a>
              <span class="nav__menu-divider" />
            </li>
          </ul>

          <div class="nav__overlay-footer">
            <div class="nav__footer-col">
              <span class="nav__footer-label">Get in touch</span>
              <a :href="`mailto:${profile.email}`" class="nav__footer-link">{{ profile.email }}</a>
            </div>
            <div class="nav__footer-col">
              <span class="nav__footer-label">Social</span>
              <div class="nav__footer-socials">
                <a :href="profile.github" target="_blank" rel="noopener" class="nav__footer-link">GitHub</a>
                <a :href="profile.linkedin" target="_blank" rel="noopener" class="nav__footer-link">LinkedIn</a>
                <a :href="profile.instagram" target="_blank" rel="noopener" class="nav__footer-link">Instagram</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
/* ─── Nav bar ─── */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: var(--z-nav);
  padding: 1.75rem 0;
  transition: padding 0.5s var(--ease-out-expo), background 0.5s var(--ease-out-expo), transform 0.5s var(--ease-out-expo);
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

.nav--open {
  background: transparent;
  backdrop-filter: none;
  border-bottom: none;
}

.nav__bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  position: relative;
  z-index: 2;
}

/* ─── Logo ─── */
.nav__logo {
  display: flex;
  align-items: center;
  color: var(--color-text-primary);
  cursor: pointer;
  padding: 0.25rem;
  transition: opacity 0.4s var(--ease-out-expo);
}

.nav--open .nav__logo {
  opacity: 0;
  pointer-events: none;
}

.nav__logo-img {
  height: 56px;
  width: auto;
  filter: brightness(1.1);
}

/* ─── Trigger button ─── */
.nav__trigger {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.625rem 1rem;
  color: var(--color-text-primary);
  transition: color 0.3s;
}

.nav__trigger-label {
  font-size: var(--text-caption);
  font-weight: 500;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  transition: color 0.4s;
}

.nav__trigger:hover .nav__trigger-label {
  color: var(--color-text-primary);
}

.nav__trigger-icon {
  position: relative;
  width: 28px;
  height: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.nav__trigger-line {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--color-text-secondary);
  transform-origin: center;
  transition: transform 0.5s var(--ease-out-expo), background 0.4s;
}

.nav__trigger:hover .nav__trigger-line {
  background: var(--color-text-primary);
}

.nav__trigger--open .nav__trigger-line:first-child {
  transform: translateY(7px) rotate(45deg);
}

.nav__trigger--open .nav__trigger-line:last-child {
  transform: translateY(-7px) rotate(-45deg);
}

/* When menu is open — hover brightens to white */
.nav__trigger--open .nav__trigger-label {
  color: var(--color-text-secondary);
}

.nav__trigger--open:hover .nav__trigger-label {
  color: var(--color-text-primary);
}

/* ─── Overlay ─── */
.nav__overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.97);
  z-index: 1;
  display: flex;
  align-items: center;
  backdrop-filter: blur(40px);
}

.nav__overlay-inner {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: clamp(3rem, 6vh, 5rem);
  padding-top: 6rem;
  padding-bottom: clamp(2rem, 4vh, 4rem);
  min-height: 100vh;
}

/* ─── Menu links ─── */
.nav__menu {
  list-style: none;
}

.nav__menu-item {
  animation: menuItemIn 0.7s var(--ease-out-expo) both;
  animation-delay: var(--delay);
}

.nav__menu-link {
  display: flex;
  align-items: baseline;
  gap: clamp(1rem, 2vw, 2rem);
  padding: clamp(1rem, 2vh, 1.5rem) 0;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.4s, transform 0.5s var(--ease-out-expo), letter-spacing 0.4s;
}

.nav__menu-link:hover {
  color: var(--color-text-primary);
  transform: translateX(1.5rem);
  letter-spacing: 0.02em;
}

.nav__menu-index {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-tertiary);
  letter-spacing: 0.1em;
  font-variant-numeric: tabular-nums;
  transition: color 0.4s;
}

.nav__menu-link:hover .nav__menu-index {
  color: var(--color-accent);
}

.nav__menu-text {
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.nav__menu-divider {
  display: block;
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  transition: background 0.4s;
}

.nav__menu-item:hover .nav__menu-divider {
  background: rgba(255, 255, 255, 0.15);
}

/* ─── Footer section in overlay ─── */
.nav__overlay-footer {
  display: flex;
  gap: clamp(2rem, 6vw, 6rem);
  margin-top: auto;
  animation: menuItemIn 0.7s var(--ease-out-expo) both;
  animation-delay: 0.45s;
}

.nav__footer-col {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.nav__footer-label {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-tertiary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.nav__footer-link {
  font-size: var(--text-label);
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.3s;
}

.nav__footer-link:hover {
  color: var(--color-text-primary);
}

.nav__footer-socials {
  display: flex;
  gap: 1.25rem;
}

/* ─── Animations ─── */
@keyframes menuItemIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.menu-enter-active {
  transition: clip-path 0.7s var(--ease-out-expo), opacity 0.4s;
}

.menu-leave-active {
  transition: clip-path 0.6s var(--ease-in-out), opacity 0.3s 0.2s;
}

.menu-enter-from {
  clip-path: circle(0% at calc(100% - 3rem) 2rem);
  opacity: 0;
}

.menu-enter-to {
  clip-path: circle(150% at calc(100% - 3rem) 2rem);
  opacity: 1;
}

.menu-leave-from {
  clip-path: circle(150% at calc(100% - 3rem) 2rem);
  opacity: 1;
}

.menu-leave-to {
  clip-path: circle(0% at calc(100% - 3rem) 2rem);
  opacity: 0;
}

/* ─── Responsive ─── */
@media (max-width: 480px) {
  .nav__trigger-label {
    display: none;
  }

  .nav__menu-text {
    font-size: clamp(2rem, 10vw, 3.5rem);
  }

  .nav__overlay-footer {
    flex-direction: column;
    gap: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .nav__menu-item {
    animation: none;
    opacity: 1;
  }

  .nav__overlay-footer {
    animation: none;
    opacity: 1;
  }

  .menu-enter-active,
  .menu-leave-active {
    transition: opacity 0.3s;
  }

  .menu-enter-from,
  .menu-leave-to {
    clip-path: none;
    opacity: 0;
  }
}
</style>
