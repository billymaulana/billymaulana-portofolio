<script setup lang="ts">
import { profile } from '~/constants/profile'

const { scrollTo } = useSmoothScroll()

const logoSrc = '/assets/images/logo/logo-bm-white-origin.svg'

const isScrolled = ref(false)
const isHidden = ref(false)
const isMenuOpen = ref(false)
let lastScrollY = 0

const lensRef = ref<HTMLElement | null>(null)
const isGlassReady = ref(false)
let mouseTarget = { x: 0.5, y: 0.5 }
let mouseCurrent = { x: 0.5, y: 0.5 }
let lensRafId: number | null = null

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

function onAfterEnter() {
  isGlassReady.value = true
}

function onLeave() {
  isGlassReady.value = false
}

function handlePanelMove(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  mouseTarget.x = (e.clientX - rect.left) / rect.width
  mouseTarget.y = (e.clientY - rect.top) / rect.height
}

function animateLens() {
  mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.06
  mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.06

  if (lensRef.value) {
    lensRef.value.style.setProperty('--lx', `${mouseCurrent.x * 100}%`)
    lensRef.value.style.setProperty('--ly', `${mouseCurrent.y * 100}%`)
  }

  lensRafId = requestAnimationFrame(animateLens)
}

onMounted(() => {
  function onScroll() {
    const currentY = window.scrollY
    isScrolled.value = currentY > 50
    isHidden.value = currentY > lastScrollY && currentY > 300
    lastScrollY = currentY
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    if (lensRafId)
      cancelAnimationFrame(lensRafId)
  })
})

watch(isMenuOpen, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
  document.body.style.overflow = open ? 'hidden' : ''
  document.documentElement.classList.toggle('menu-open', open)

  if (open) {
    mouseCurrent = { x: 0.5, y: 0.5 }
    mouseTarget = { x: 0.5, y: 0.5 }
    lensRafId = requestAnimationFrame(animateLens)
  }
  else {
    if (lensRafId)
      cancelAnimationFrame(lensRafId)
    lensRafId = null
    isGlassReady.value = false
  }
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
          :src="logoSrc"
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
    <Transition name="menu" :duration="{ enter: 1100, leave: 850 }" @after-enter="onAfterEnter" @leave="onLeave">
      <div v-if="isMenuOpen" class="nav__overlay">
        <div class="nav__backdrop" @click="toggleMenu" />
        <div class="nav__panel" @pointermove="handlePanelMove">
          <!-- Layer 1: Glass backdrop — blur + transparency -->
          <div class="nav__glass-backdrop" :class="{ 'nav__glass--ready': isGlassReady }" />
          <!-- Layer 2: Mouse-following liquid lens -->
          <div ref="lensRef" class="nav__glass-lens" />
          <!-- Layer 3: Specular light bands + shimmer -->
          <div class="nav__glass-specular" />
          <!-- Layer 4: Chromatic edge glow -->
          <div class="nav__glass-edge" />
          <!-- Layer 5: Content -->
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
                      :style="{ '--ci': ci }"
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
  padding: clamp(1.3125rem, 2.8vh, 2.125rem) 0;
  transition: padding 0.5s var(--ease-out-expo), background 0.5s var(--ease-out-expo), transform 0.5s var(--ease-out-expo);
}

.nav--scrolled {
  padding: 0.8125rem 0;
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

/* Nav bar height uses Fibonacci 55px — logo at 34px creates φ ratio (34/55 ≈ 0.618) */
.nav__bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: clamp(42px, 3.4vw, 55px);
  position: relative;
  z-index: 2;
  isolation: isolate;
}

/* ─── Logo ─── */
.nav__logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.25rem 0.25rem 0.25rem 0;
  transition: opacity 0.4s var(--ease-out-expo);
}

/* Logo dims when menu is open — visible but subdued */
.nav--open .nav__logo {
  opacity: 0.3;
}

/* Logo height 34px (Fibonacci) — φ ratio with nav bar height (34/55 ≈ 0.618) */
.nav__logo-img {
  height: clamp(30px, 2.1vw, 38px);
  width: auto;
  filter: brightness(1.1);
}

/* ─── Trigger: minimal button ─── */
.nav__trigger {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: transparent;
  border: none;
  border-radius: 0;
  cursor: pointer;
  padding: 0;
  -webkit-tap-highlight-color: transparent;
}

.nav__trigger-box {
  position: relative;
  width: 22px;
  height: 18px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.nav__trigger-bar {
  display: block;
  height: 2px;
  border-radius: 1px;
  background: rgba(255, 255, 255, 0.8);
  transform-origin: center;
}

/* ─ Asymmetric widths — visual rhythm ─ */
.nav__trigger-bar:nth-child(1) {
  width: 22px;
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.06s,
    opacity 0.3s,
    background 0.3s;
}

.nav__trigger-bar:nth-child(2) {
  width: 13px;
  transition:
    opacity 0.25s ease 0.12s,
    transform 0.25s ease 0.12s,
    width 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.04s,
    background 0.3s;
}

.nav__trigger-bar:nth-child(3) {
  width: 17px;
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s,
    background 0.3s;
}

/* Hover (closed): bars equalize + brighten */
.nav__trigger:hover .nav__trigger-bar {
  width: 22px;
  background: #fff;
}

/* ─── Open: clean × — no glass, just bars ─── */
.nav__trigger--open .nav__trigger-bar:nth-child(1) {
  width: 20px;
  background: rgba(255, 255, 255, 0.85);
  transform: translateY(8px) rotate(45deg);
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.06s,
    width 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.4s;
}

.nav__trigger--open .nav__trigger-bar:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.nav__trigger--open .nav__trigger-bar:nth-child(3) {
  width: 20px;
  background: rgba(255, 255, 255, 0.85);
  transform: translateY(-8px) rotate(-45deg);
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.06s,
    width 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.4s;
}

/* Hover (open): just brighten the × */
.nav__trigger--open:hover .nav__trigger-bar {
  background: #fff;
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

/* Panel — liquid glass container (transparent base lets glass layers shine) */
.nav__panel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
}

/* ─── Liquid Glass Layers (Apple-inspired) ─── */

/* Layer 1: Glass backdrop — transparent blur */
/* Mobile: solid fallback during clip-path anim, fades to blur via @after-enter */
.nav__glass-backdrop {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(10, 12, 18, 0.88);
  transition: background 0.6s ease, backdrop-filter 0.6s ease;
}

/* After clip-path animation completes — enable blur safely */
.nav__glass--ready {
  backdrop-filter: blur(20px) saturate(1.6);
  -webkit-backdrop-filter: blur(20px) saturate(1.6);
  background: rgba(10, 12, 18, 0.5);
}

/* Layer 2: Mouse-following liquid lens — chromatic aberration */
.nav__glass-lens {
  position: absolute;
  inset: 0;
  z-index: 2;
  --lx: 50%;
  --ly: 50%;
  background:
    /* Blue offset — left of cursor */
    radial-gradient(
      ellipse 220px 220px at calc(var(--lx) - 3px) var(--ly),
      rgba(0, 71, 255, 0.07) 0%,
      transparent 70%
    ),
    /* Cyan offset — right of cursor */
    radial-gradient(
      ellipse 220px 220px at calc(var(--lx) + 3px) var(--ly),
      rgba(0, 245, 255, 0.05) 0%,
      transparent 70%
    ),
    /* Core highlight — bright center */
    radial-gradient(
      ellipse 180px 180px at var(--lx) var(--ly),
      rgba(255, 255, 255, 0.09) 0%,
      rgba(255, 255, 255, 0.02) 40%,
      transparent 70%
    );
  mix-blend-mode: screen;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.8s ease;
}

/* Lens fades in after glass is ready */
.nav__glass--ready ~ .nav__glass-lens {
  opacity: 1;
}

/* Layer 3: Specular highlights — light bands for glass depth */
.nav__glass-specular {
  position: absolute;
  inset: 0;
  z-index: 3;
  background:
    /* Top edge — brightest specular rim */
    linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 8%, transparent 22%),
    /* Left edge caustic */
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, transparent 14%),
    /* Diagonal caustic band — gives 3D curvature feel */
    linear-gradient(135deg, transparent 25%, rgba(255, 255, 255, 0.025) 38%, transparent 52%);
  pointer-events: none;
}

/* Animated shimmer — slow-drifting light across glass surface */
.nav__glass-specular::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    transparent 15%,
    rgba(255, 255, 255, 0.035) 32%,
    transparent 50%,
    rgba(255, 255, 255, 0.02) 72%,
    transparent 90%
  );
  background-size: 250% 250%;
  animation: liquidShimmer 10s ease-in-out infinite alternate;
  pointer-events: none;
}

/* Layer 4: Chromatic edge glow — refraction at glass borders */
.nav__glass-edge {
  position: absolute;
  inset: 0;
  z-index: 4;
  box-shadow:
    /* Blue left edge — primary refraction color */
    inset 1px 0 0 rgba(0, 71, 255, 0.2),
    inset 2px 0 8px rgba(0, 71, 255, 0.06),
    /* Cyan right edge — complementary refraction */
    inset -1px 0 0 rgba(0, 245, 255, 0.1),
    /* White top edge — specular rim light */
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 2px 12px rgba(255, 255, 255, 0.03),
    /* Purple bottom edge — chromatic aberration */
    inset 0 -1px 0 rgba(68, 0, 255, 0.08);
  pointer-events: none;
}

@keyframes liquidShimmer {
  0% { background-position: 100% 0%; }
  100% { background-position: 0% 100%; }
}

.nav__panel-inner {
  position: relative;
  z-index: 5;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: clamp(5.5rem, 11vh, 8rem) clamp(2.125rem, 5vw, 3.4375rem) clamp(2.125rem, 4vh, 3.4375rem);
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
  position: relative;
  display: flex;
  align-items: baseline;
  gap: clamp(0.8125rem, 1.5vw, 1.3125rem);
  padding: clamp(1rem, 1.8vh, 1.5rem) 0;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  perspective: 600px;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.6);
  transition: color 0.5s cubic-bezier(0.45, 0, 0.55, 1);
}

/* Underline sweep — draws from left on hover */
.nav__menu-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.08));
  transform: scaleX(0);
  transform-origin: left center;
  transition: transform 0.5s cubic-bezier(0.45, 0, 0.55, 1);
}

.nav__menu-link:hover {
  color: #fff;
}

.nav__menu-link:hover::after {
  transform: scaleX(1);
}

/* Dim siblings when one is hovered */
.nav__menu:hover .nav__menu-link:not(:hover) {
  color: rgba(255, 255, 255, 0.2);
}

.nav__menu-index {
  font-size: var(--text-caption);
  font-weight: 500;
  color: rgba(255, 255, 255, 0.2);
  letter-spacing: 0.15em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  transition: color 0.5s cubic-bezier(0.45, 0, 0.55, 1), opacity 0.5s cubic-bezier(0.45, 0, 0.55, 1);
}

.nav__menu-link:hover .nav__menu-index {
  color: rgba(255, 255, 255, 0.6);
}

.nav__menu:hover .nav__menu-link:not(:hover) .nav__menu-index {
  opacity: 0.3;
}

/* ─── Cube flip text ─── */
.nav__menu-word {
  display: inline-flex;
  font-family: 'Clash Display', 'Satoshi', system-ui, sans-serif;
  font-size: clamp(2.5rem, 8vw, 5.5rem);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.02em;
  transform-origin: center bottom;
  transition: transform 0.4s cubic-bezier(0.45, 0, 0.55, 1);
}

/* Subtle 3D tilt — makes the slide feel like a physical cube rotating */
.nav__menu-link:hover .nav__menu-word {
  transform: rotateX(4deg);
}

.nav__menu-char {
  display: inline-block;
  height: 1.15em;
  overflow: hidden;
}

.nav__menu-char-inner {
  display: flex;
  flex-direction: column;
  /* Symmetric easing — no "pause" when reversing mid-flip */
  transition: transform 0.38s cubic-bezier(0.45, 0, 0.55, 1);
  will-change: transform;
}

.nav__menu-char-face {
  display: block;
  height: 1.15em;
  line-height: 1.15em;
}

/* Alt face — second face of the 2D cube, slides up on hover */
.nav__menu-char-face--alt {
  color: #fff;
}

/* 2D cube: smooth vertical slide to reveal alt face */
.nav__menu-link:hover .nav__menu-char-inner {
  transform: translateY(-1.15em);
}

.nav__menu-divider {
  display: block;
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  transition: background 0.5s cubic-bezier(0.45, 0, 0.55, 1), opacity 0.5s cubic-bezier(0.45, 0, 0.55, 1);
  transform-origin: left;
  animation: menuDividerIn 0.6s var(--ease-out-expo) both;
  animation-delay: calc(var(--delay, 0.15s) + 0.1s);
}

.nav__menu-item:hover .nav__menu-divider {
  background: rgba(255, 255, 255, 0.12);
}

.nav__menu:hover .nav__menu-item:not(:hover) .nav__menu-divider {
  opacity: 0.4;
}

/* ─── Panel footer ─── */
.nav__panel-footer {
  display: flex;
  flex-direction: column;
  gap: 1.3125rem;
  margin-top: auto;
  padding-top: clamp(2.125rem, 4vh, 3.4375rem);
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
  color: var(--color-text-secondary);
  letter-spacing: 0.2em;
  line-height: 1.618;
  text-transform: uppercase;
}

.nav__footer-link {
  font-size: var(--text-label);
  color: var(--color-text-secondary);
  text-decoration: none;
  letter-spacing: 0.01em;
  line-height: 1.618;
  transition: color 0.3s var(--ease-out-expo);
}

.nav__footer-link:hover {
  color: var(--color-text-primary);
}

.nav__footer-socials {
  display: flex;
  gap: 1.3125rem;
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

/* ─── Transition: Mobile (clip-path circle) — soft, no harsh flash ─── */
.menu-enter-active {
  transition:
    clip-path 1.05s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-leave-active {
  transition:
    clip-path 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.35s 0.25s ease;
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

/* ─── Desktop: Side panel (40vw) + slide transition ─── */
@media (min-width: 1024px) {
  .nav__backdrop {
    display: block;
    flex: 1;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    cursor: pointer;
  }

  .nav__panel {
    width: 30vw;
    min-width: 360px;
    max-width: 480px;
    flex-shrink: 0;
    /* Transition always active — panel slides via transform class toggle */
    transform: translateX(0);
    transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
  }

  /* Desktop: always enable blur (no clip-path conflict) */
  .nav__glass-backdrop {
    backdrop-filter: blur(20px) saturate(1.6);
    -webkit-backdrop-filter: blur(20px) saturate(1.6);
    background: rgba(10, 12, 18, 0.5);
  }

  /* Lens visible immediately on desktop */
  .nav__glass-lens {
    opacity: 1;
  }

  .nav__menu-word {
    font-size: clamp(2.125rem, 3.5vw, 3.5rem);
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
  .nav__backdrop {
    transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .menu-enter-from .nav__backdrop {
    opacity: 0;
  }

  .menu-leave-to .nav__backdrop {
    opacity: 0;
  }

  /* Panel slide — enter from right */
  .menu-enter-from .nav__panel {
    transform: translateX(100%);
  }

  /* Panel slide — leave to right */
  .menu-leave-to .nav__panel {
    transform: translateX(100%);
  }
}

/* ─── Mobile ─── */
@media (max-width: 480px) {
  .nav__menu-word {
    font-size: clamp(1.75rem, 9vw, 3rem);
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

  .nav__menu-link::after {
    transition: none;
  }

  .nav__menu-char-inner {
    transition: none;
  }

  .nav__menu-char-face--alt {
    display: none;
  }

  .nav__trigger-bar {
    transition: none !important;
  }
}
</style>
