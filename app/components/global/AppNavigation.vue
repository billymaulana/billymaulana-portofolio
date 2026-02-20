<script setup lang="ts">
import { profile } from '~/constants/profile'

const { scrollTo } = useSmoothScroll()

const logoSrc = '/assets/images/logo/logo-bm-white-origin.svg'

const isScrolled = ref(false)
const isHidden = ref(false)
const isMenuOpen = ref(false)
let lastScrollY = 0

// Flow field (WebGL blue liquid)
const flowCanvasRef = ref<HTMLCanvasElement | null>(null)
const hasWebGL = ref(true)

const flowShader = useGlassShader({
  reducedMotion: typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false,
})

// SVG filter displacement coupling
const { displacementScale, startCoupling, stopCoupling } = useLiquidGlass()

// Check SVG filter support in backdrop-filter
const supportsSvgFilter = ref(true)

// Glass body visibility — controlled via JS to avoid white card flash during transitions
const glassVisible = ref(false)

// Mouse state
let mouseTarget = { x: 0.5, y: 0.5 }

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

function handlePanelMove(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  const rect = el.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height
  const dx = x - mouseTarget.x
  const dy = y - mouseTarget.y
  mouseTarget.x = x
  mouseTarget.y = y
  flowShader.setMouse(x, y, dx, dy)
}

// Track whether flow shader has been initialized
let flowInitialized = false

onMounted(() => {
  // Test if backdrop-filter: url(#test) works
  const testEl = document.createElement('div')
  testEl.style.backdropFilter = 'url(#nonexistent)'
  supportsSvgFilter.value = testEl.style.backdropFilter !== ''

  function onScroll() {
    const currentY = window.scrollY
    isScrolled.value = currentY > 50
    isHidden.value = currentY > lastScrollY && currentY > 300
    lastScrollY = currentY
  }

  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    flowShader.destroy()
  })
})

watch(isMenuOpen, async (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
  document.body.style.overflow = open ? 'hidden' : ''
  document.documentElement.classList.toggle('menu-open', open)

  if (open) {
    // Wait for v-if canvas to enter DOM
    await nextTick()
    mouseTarget = { x: 0.5, y: 0.5 }

    // Init flow shader on first open (canvas is inside v-if)
    if (!flowInitialized && flowCanvasRef.value) {
      hasWebGL.value = flowShader.init(flowCanvasRef.value)
      flowInitialized = hasWebGL.value
    }

    if (hasWebGL.value) {
      flowShader.setOpenProgress(1)
      flowShader.resize()
      flowShader.start()
      // Start SVG-WebGL displacement coupling
      startCoupling(() => flowShader.getFlowIntensity())
    }

    // Show glass body AFTER panel slide starts (prevents white card flash on open)
    setTimeout(() => {
      glassVisible.value = true
    }, 200)
  }
  else {
    // Hide glass body IMMEDIATELY before panel starts sliding (prevents static white card on close)
    glassVisible.value = false

    flowShader.setOpenProgress(0)
    flowShader.stop()
    stopCoupling()
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
    <Transition name="menu" :duration="{ enter: 1100, leave: 850 }">
      <div v-if="isMenuOpen" class="nav__overlay">
        <div class="nav__backdrop" @click="toggleMenu" />
        <div class="nav__panel" @pointermove="handlePanelMove">
          <!-- SVG Filter Definitions -->
          <UiLiquidGlassFilter :displacement-scale="displacementScale" />

          <!-- Glass body: SVG filter + noise grain -->
          <div
            class="nav__glass-body"
            :class="{
              'nav__glass-body--fallback': !supportsSvgFilter,
              'nav__glass-body--visible': glassVisible,
            }"
          />

          <!-- WebGL Blue Flow Canvas (overlay, pointer-events: none) -->
          <canvas
            v-if="hasWebGL"
            ref="flowCanvasRef"
            class="nav__flow-canvas"
            :class="{ 'nav__flow-canvas--visible': glassVisible }"
          />

          <!-- Content (z-index 2, above glass) -->
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
                  class="nav__menu-link nav__chromatic-text"
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
                <a :href="`mailto:${profile.email}`" class="nav__footer-link nav__chromatic-text">{{ profile.email }}</a>
              </div>
              <div class="nav__footer-col">
                <span class="nav__footer-label">Social</span>
                <div class="nav__footer-socials">
                  <a :href="profile.github" target="_blank" rel="noopener" class="nav__footer-link nav__chromatic-text">GitHub</a>
                  <a :href="profile.linkedin" target="_blank" rel="noopener" class="nav__footer-link nav__chromatic-text">LinkedIn</a>
                  <a :href="profile.instagram" target="_blank" rel="noopener" class="nav__footer-link nav__chromatic-text">Instagram</a>
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
  overflow: hidden;
}

/* Backdrop — hidden on mobile, covers full overlay on desktop */
.nav__backdrop {
  display: none;
}

/* Panel — liquid glass container */
.nav__panel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
}

/* ─── Glass Body: SVG filter + organic border ─── */
.nav__glass-body {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  /* Liquid glass: SVG filter for refraction + blur — visible even on dark backgrounds */
  backdrop-filter: url(#liquid-glass) blur(12px) saturate(1.4) brightness(1.15);
  -webkit-backdrop-filter: url(#liquid-glass) blur(12px) saturate(1.4) brightness(1.15);
  /* Glass tint: visible shape on pure black — subtle gradient + left-edge highlight */
  background: linear-gradient(
    160deg,
    rgba(255, 255, 255, 0.10) 0%,
    rgba(255, 255, 255, 0.04) 35%,
    rgba(255, 255, 255, 0.07) 100%
  );
  /* Soft edge glow on left side — traces the rounded edge like real glass catching light */
  box-shadow: inset 1px 0 0 rgba(255, 255, 255, 0.06),
              inset 0 1px 0 rgba(255, 255, 255, 0.04);
  border: none;
  overflow: hidden;
  /* Start invisible — JS toggles --visible class to prevent white card flash */
  opacity: 0;
  transition: opacity 0.4s var(--ease-out-expo);
}

/* Show glass body only when JS signals the panel is settled */
.nav__glass-body--visible {
  opacity: 1;
}

/* Noise/grain texture overlay */
.nav__glass-body::before {
  content: '';
  position: absolute;
  inset: -50%;
  z-index: 0;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  opacity: 0.055;
  mix-blend-mode: overlay;
  pointer-events: none;
  animation: grainShimmer 30s linear infinite;
}

@keyframes grainShimmer {
  0% { transform: translate(0, 0); }
  25% { transform: translate(-2px, 1px); }
  50% { transform: translate(1px, -2px); }
  75% { transform: translate(-1px, -1px); }
  100% { transform: translate(0, 0); }
}

/* Subtle inner border glow — traces the glass edge for definition on dark backgrounds */
.nav__glass-body::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  /* Inner border — visible edge definition on dark backgrounds */
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-right: none;
  /* Highlight concentrated on top-left edge (light source direction) */
  mask-image: linear-gradient(160deg, rgba(0,0,0,0.8), rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.35));
  -webkit-mask-image: linear-gradient(160deg, rgba(0,0,0,0.8), rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.35));
  pointer-events: none;
}

/* ─── Flow Canvas (WebGL blue liquid overlay) ─── */
.nav__flow-canvas {
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mix-blend-mode: screen;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.4s var(--ease-out-expo);
}

.nav__flow-canvas--visible {
  opacity: 1;
}

/* CSS fallback when SVG filter in backdrop-filter is unsupported */
.nav__glass-body--fallback {
  backdrop-filter: blur(18px) saturate(1.3);
  -webkit-backdrop-filter: blur(18px) saturate(1.3);
  background: rgba(255, 255, 255, 0.08);
}

.nav__panel-inner {
  position: relative;
  z-index: 2;
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

/* ─── Chromatic text effect (RGB split) ─── */
.nav__chromatic-text {
  text-shadow:
    -1px 0 0 rgba(255, 0, 0, 0.12),
    1px 0 0 rgba(0, 100, 255, 0.12),
    0 0 4px rgba(255, 255, 255, 0.08);
  -webkit-text-stroke: 0.3px rgba(255, 255, 255, 0.2);
  transition: text-shadow 0.4s var(--ease-out-expo);
}

.nav__chromatic-text:hover {
  text-shadow:
    -3px 0 0 rgba(255, 0, 0, 0.18),
    3px 0 0 rgba(0, 100, 255, 0.18),
    0 0 8px rgba(255, 255, 255, 0.12);
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

/* ─── Desktop: Side panel + slide transition ─── */
@media (min-width: 1024px) {
  .nav__backdrop {
    display: block;
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    cursor: pointer;
  }

  .nav__panel {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 30vw;
    min-width: 360px;
    max-width: 480px;
    transform: translateX(0);
    transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
    /* clip-path reliably clips backdrop-filter at compositing level
       (overflow:hidden + border-radius fails to clip backdrop-filter in some GPUs) */
    clip-path: inset(0 0 0 0 round 28px 0 0 28px);
    border-radius: 28px 0 0 28px;
  }

  .nav__glass-body {
    border-radius: 28px 0 0 28px;
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

@media (max-width: 480px) {
  .nav__menu-word {
    font-size: clamp(1.75rem, 9vw, 3rem);
  }
}

/* ─── Reduced motion — disable WebGL animations, simplify transitions ─── */
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

  .nav__glass-body::before {
    animation: none;
  }

  .nav__chromatic-text {
    text-shadow: none;
    -webkit-text-stroke: none;
  }
}
</style>
