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
  document.documentElement.style.overflow = open ? 'hidden' : ''
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
          src="/assets/images/logo/logo-bm-white-origin.svg"
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
        <span class="nav__trigger-box">
          <span class="nav__trigger-bar" />
          <span class="nav__trigger-bar" />
          <span class="nav__trigger-bar" />
        </span>
      </button>
    </nav>

    <!-- Overlay: backdrop + side panel -->
    <Transition name="menu" :duration="{ enter: 850, leave: 600 }">
      <div v-if="isMenuOpen" class="nav__overlay">
        <div class="nav__backdrop" @click="toggleMenu" />
        <div class="nav__panel">
          <div class="nav__panel-inner">
            <ul class="nav__menu" role="list">
              <li
                v-for="(item, i) in navItems"
                :key="item.href"
                class="nav__menu-item"
                :style="{ '--delay': `${0.2 + i * 0.1}s` }"
              >
                <a
                  :href="item.href"
                  class="nav__menu-link"
                  @click.prevent="handleNavClick(item.href)"
                >
                  <span class="nav__menu-index">{{ String(i + 1).padStart(2, '0') }}</span>
                  <span class="nav__menu-word">
                    <span
                      v-for="(char, ci) in item.label.split('')"
                      :key="ci"
                      class="nav__menu-char"
                    >
                      <span class="nav__menu-char-inner">
                        <span class="nav__menu-char-face">{{ char }}</span>
                        <span class="nav__menu-char-face nav__menu-char-face--alt">{{ char }}</span>
                      </span>
                    </span>
                  </span>
                </a>
                <span class="nav__menu-divider" :style="{ '--delay': `${0.2 + i * 0.1}s` }" />
              </li>
            </ul>

            <div class="nav__panel-footer">
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
  cursor: pointer;
  padding: 0.25rem 0.25rem 0.25rem 0;
  transition: opacity 0.4s var(--ease-out-expo);
}

.nav--open .nav__logo {
  opacity: 0;
  pointer-events: none;
}

.nav__logo-img {
  height: 36px;
  width: auto;
  filter: brightness(1.1);
}

/* ─── Trigger: Fluid morphing lines ─── */
.nav__trigger {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 48px;
  height: 48px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

/* Soft circle backdrop — breathes in on hover */
.nav__trigger::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0);
  transform: scale(0.8);
  transition: background 0.5s var(--ease-out-expo), transform 0.5s var(--ease-out-expo);
}

.nav__trigger:hover::before {
  background: rgba(255, 255, 255, 0.04);
  transform: scale(1);
}

.nav__trigger-box {
  position: relative;
  width: 26px;
  height: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.nav__trigger-bar {
  display: block;
  height: 2px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.6);
  transform-origin: center;
}

/* ─ Asymmetric widths — visual rhythm ─ */
.nav__trigger-bar:nth-child(1) {
  width: 26px;
  transition:
    width 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.06s,
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s,
    background 0.3s;
}

.nav__trigger-bar:nth-child(2) {
  width: 16px;
  transition:
    width 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.03s,
    transform 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.25s,
    background 0.3s;
}

.nav__trigger-bar:nth-child(3) {
  width: 21px;
  transition:
    width 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s,
    background 0.3s;
}

/* Hover (closed): bars equalize + brighten */
.nav__trigger:hover .nav__trigger-bar {
  width: 26px;
  background: rgba(255, 255, 255, 1);
}

/* ─── Open: bars morph to fluid × ─── */

/* Bar 1 → rotates 45° with elastic overshoot */
.nav__trigger--open .nav__trigger-bar:nth-child(1) {
  width: 26px;
  transform: translateY(9px) rotate(45deg);
  background: rgba(255, 255, 255, 0.85);
  transition:
    width 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.05s,
    opacity 0.3s,
    background 0.3s;
}

/* Bar 2 → collapses to zero width + fades */
.nav__trigger--open .nav__trigger-bar:nth-child(2) {
  width: 0;
  opacity: 0;
  transform: scaleX(0);
  transition:
    width 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.15s,
    background 0.3s;
}

/* Bar 3 → rotates -45° with elastic overshoot */
.nav__trigger--open .nav__trigger-bar:nth-child(3) {
  width: 26px;
  transform: translateY(-9px) rotate(-45deg);
  background: rgba(255, 255, 255, 0.85);
  transition:
    width 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.55s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.05s,
    opacity 0.3s,
    background 0.3s;
}

/* Hover (open): brighten × + playful micro-tilt */
.nav__trigger--open:hover .nav__trigger-bar {
  background: rgba(255, 255, 255, 1);
}

/* ─── Overlay ─── */
.nav__overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  display: flex;
  overflow: hidden;
}

/* Backdrop — hidden on mobile, visible on desktop */
.nav__backdrop {
  display: none;
}

/* Panel — fullscreen on mobile */
.nav__panel {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.97);
  backdrop-filter: blur(40px);
  overflow: hidden;
}

.nav__panel-inner {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: clamp(6rem, 12vh, 9rem) clamp(2rem, 5vw, 3rem) clamp(2rem, 4vh, 3rem);
}

/* ─── Menu links ─── */
.nav__menu {
  list-style: none;
}

.nav__menu-item {
  animation: menuItemIn 0.9s var(--ease-out-expo) both;
  animation-delay: var(--delay);
}

.nav__menu-link {
  display: flex;
  align-items: baseline;
  gap: clamp(0.75rem, 1.5vw, 1.5rem);
  padding: clamp(0.75rem, 1.5vh, 1.25rem) 0;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 0.4s var(--ease-out-expo);
}

.nav__menu-link:hover {
  color: var(--color-text-primary);
}

.nav__menu-index {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-tertiary);
  letter-spacing: 0.1em;
  font-variant-numeric: tabular-nums;
  transition: color 0.4s var(--ease-out-expo);
}

.nav__menu-link:hover .nav__menu-index {
  color: var(--color-text-secondary);
}

/* ─── Per-character 3D cube (crz.studio style) ─── */
.nav__menu-word {
  display: inline-flex;
  font-size: clamp(3rem, 10vw, 7rem);
  font-weight: 900;
  line-height: 1.1;
}

.nav__menu-char {
  display: inline-block;
  height: 1.15em;
  overflow: hidden;
  perspective: 1000px;
}

.nav__menu-char-inner {
  display: block;
  height: 1.15em;
  transform-style: preserve-3d;
  transition: transform 0.5s var(--ease-out-expo);
}

.nav__menu-char-face {
  display: block;
  backface-visibility: hidden;
}

/* Front face */
.nav__menu-char-face:first-child {
  transform: translateZ(0.575em);
}

/* Bottom face — revealed on hover */
.nav__menu-char-face--alt {
  position: absolute;
  top: 0;
  left: 0;
  color: var(--color-text-primary);
  transform: rotateX(-90deg) translateZ(0.575em);
}

/* Hover: all characters rotate simultaneously — no stagger */
.nav__menu-link:hover .nav__menu-char-inner {
  transform: rotateX(90deg);
}

.nav__menu-divider {
  display: block;
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  transition: background 0.5s var(--ease-out-expo);
  transform-origin: left;
  animation: menuDividerIn 0.6s var(--ease-out-expo) both;
  animation-delay: calc(var(--delay, 0.15s) + 0.1s);
}

.nav__menu-item:hover .nav__menu-divider {
  background: rgba(255, 255, 255, 0.15);
}

/* ─── Panel footer ─── */
.nav__panel-footer {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: auto;
  padding-top: clamp(2rem, 4vh, 3rem);
  animation: menuItemIn 0.9s var(--ease-out-expo) both;
  animation-delay: 0.55s;
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
  transition: color 0.3s var(--ease-out-expo);
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
    transform: translateY(40px) skewY(2deg);
    filter: blur(6px);
  }
  60% {
    filter: blur(0);
  }
  to {
    opacity: 1;
    transform: translateY(0) skewY(0);
    filter: blur(0);
  }
}

@keyframes menuDividerIn {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

/* ─── Transition: Mobile (clip-path circle) ─── */
.menu-enter-active {
  transition: clip-path 0.85s var(--ease-out-expo), opacity 0.3s, filter 0.7s var(--ease-out-expo);
}

.menu-leave-active {
  transition: clip-path 0.6s var(--ease-in-out), opacity 0.2s 0.15s, filter 0.5s;
}

.menu-enter-from {
  clip-path: circle(0% at calc(100% - 3rem) 2rem);
  opacity: 0;
  filter: brightness(1.6) saturate(2) blur(30px);
}

.menu-enter-to {
  clip-path: circle(150% at calc(100% - 3rem) 2rem);
  opacity: 1;
  filter: brightness(1) saturate(1) blur(0);
}

.menu-leave-from {
  clip-path: circle(150% at calc(100% - 3rem) 2rem);
  opacity: 1;
  filter: brightness(1) saturate(1) blur(0);
}

.menu-leave-to {
  clip-path: circle(0% at calc(100% - 3rem) 2rem);
  opacity: 0;
  filter: brightness(1.6) saturate(2) blur(30px);
}

/* ─── Desktop: Side panel (40vw) + slide transition ─── */
@media (min-width: 1024px) {
  .nav--open .nav__logo {
    opacity: 1;
    pointer-events: auto;
  }

  .nav__backdrop {
    display: block;
    flex: 1;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    cursor: pointer;
  }

  .nav__panel {
    width: 40vw;
    min-width: 420px;
    max-width: 640px;
    flex-shrink: 0;
    background: rgba(8, 8, 8, 0.98);
    border-left: 1px solid rgba(255, 255, 255, 0.06);
    backdrop-filter: blur(60px);
  }

  .nav__menu-word {
    font-size: clamp(2.5rem, 4vw, 4.5rem);
  }

  /* Override mobile clip-path — use panel slide instead */
  .menu-enter-active,
  .menu-leave-active {
    transition: none;
  }

  .menu-enter-from,
  .menu-enter-to,
  .menu-leave-from,
  .menu-leave-to {
    clip-path: none;
    opacity: 1;
    filter: none;
  }

  /* Backdrop fade */
  .menu-enter-active .nav__backdrop {
    transition: opacity 0.5s var(--ease-out-expo);
  }

  .menu-enter-from .nav__backdrop {
    opacity: 0;
  }

  .menu-leave-active .nav__backdrop {
    transition: opacity 0.4s var(--ease-in-out);
  }

  .menu-leave-to .nav__backdrop {
    opacity: 0;
  }

  /* Panel slide from right */
  .menu-enter-active .nav__panel {
    transition: transform 0.7s var(--ease-out-expo);
  }

  .menu-enter-from .nav__panel {
    transform: translateX(100%);
  }

  .menu-leave-active .nav__panel {
    transition: transform 0.5s var(--ease-in-out);
  }

  .menu-leave-to .nav__panel {
    transform: translateX(100%);
  }
}

/* ─── Mobile ─── */
@media (max-width: 480px) {
  .nav__menu-word {
    font-size: clamp(2rem, 10vw, 3.5rem);
  }
}

/* ─── Reduced motion ─── */
@media (prefers-reduced-motion: reduce) {
  .nav__menu-item {
    animation: none;
    opacity: 1;
  }

  .nav__panel-footer {
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
    filter: none;
  }

  .nav__menu-char-inner {
    transition: none;
    transform-style: flat;
  }

  .nav__menu-char-face:first-child {
    transform: none;
  }

  .nav__menu-char-face--alt {
    display: none;
  }

  .nav__trigger::before {
    display: none;
  }

  .nav__trigger-bar {
    transition: none !important;
  }
}
</style>
