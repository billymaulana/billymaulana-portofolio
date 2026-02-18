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

/* ─── Mouse-reactive liquid glass ─── */
const panelRef = ref<HTMLElement>()
const mousePos = reactive({ x: 50, y: 50 })
const targetPos = reactive({ x: 50, y: 50 })
let rafId = 0

/* Mouse drives noise shift + water lens position */
const liquidStyle = computed(() => ({
  '--lx': `${(mousePos.x - 50) * 0.18}px`,
  '--ly': `${(mousePos.y - 50) * 0.18}px`,
  '--mx': `${mousePos.x}%`,
  '--my': `${mousePos.y}%`,
}))

function handlePanelMove(e: PointerEvent) {
  const el = panelRef.value
  if (!el)
    return
  const rect = el.getBoundingClientRect()
  targetPos.x = ((e.clientX - rect.left) / rect.width) * 100
  targetPos.y = ((e.clientY - rect.top) / rect.height) * 100
}

function animateLiquid() {
  mousePos.x += (targetPos.x - mousePos.x) * 0.035
  mousePos.y += (targetPos.y - mousePos.y) * 0.035
  rafId = requestAnimationFrame(animateLiquid)
}

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
  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(rafId)
  })
})

watch(isMenuOpen, (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    mousePos.x = 50
    mousePos.y = 50
    targetPos.x = 50
    targetPos.y = 50
    rafId = requestAnimationFrame(animateLiquid)
  }
  else {
    cancelAnimationFrame(rafId)
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

    <!-- Liquid Glass SVG filter — teleported to body to avoid scoped attribute issues -->
    <Teleport to="body">
      <svg style="position:absolute;width:0;height:0;overflow:hidden;pointer-events:none" aria-hidden="true">
        <defs>
          <!-- Liquid glass: smooth fluid refraction — large slow waves, not noisy -->
          <filter id="liquid-glass-distort" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
            <feTurbulence type="turbulence" baseFrequency="0.003 0.005" numOctaves="3" seed="31" result="waves" />
            <feGaussianBlur in="waves" stdDeviation="3" result="smooth" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="smooth"
              scale="55"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </Teleport>

    <!-- Overlay: backdrop + side panel -->
    <Transition name="menu" :duration="{ enter: 1100, leave: 850 }">
      <div v-if="isMenuOpen" class="nav__overlay">
        <div class="nav__backdrop" @click="toggleMenu" />
        <div ref="panelRef" class="nav__panel" :style="liquidStyle" @pointermove="handlePanelMove">
          <!-- Layer 0: SVG displacement — organic edge blobs, follows mouse -->
          <div class="nav__glass-refract" />
          <!-- Layer 0.5: Mouse-following water lens — localized refraction hotspot -->
          <div class="nav__glass-lens" />
          <!-- Layer 1: Frosted blur + tinted overlay -->
          <div class="nav__glass-frost" />
          <!-- Layer 2: Specular highlights — glass depth -->
          <div class="nav__glass-specular" />
          <!-- Layer 3: Content -->
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

.nav__bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 34px;
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

.nav__logo-img {
  height: 28px;
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
  border-radius: 1px;
  background: rgba(255, 255, 255, 0.8);
  transform-origin: center;
}

/* ─ Asymmetric widths — visual rhythm ─ */
.nav__trigger-bar:nth-child(1) {
  width: 26px;
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.06s,
    opacity 0.3s,
    background 0.3s;
}

.nav__trigger-bar:nth-child(2) {
  width: 16px;
  transition:
    opacity 0.25s ease 0.12s,
    transform 0.25s ease 0.12s,
    width 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.04s,
    background 0.3s;
}

.nav__trigger-bar:nth-child(3) {
  width: 21px;
  transition:
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.4s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s,
    background 0.3s;
}

/* Hover (closed): bars equalize + brighten */
.nav__trigger:hover .nav__trigger-bar {
  width: 26px;
  background: #fff;
}

/* ─── Open: clean × — no glass, just bars ─── */
.nav__trigger--open .nav__trigger-bar:nth-child(1) {
  width: 24px;
  background: rgba(255, 255, 255, 0.85);
  transform: translateY(9px) rotate(45deg);
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
  width: 24px;
  background: rgba(255, 255, 255, 0.85);
  transform: translateY(-9px) rotate(-45deg);
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

/* Panel — liquid glass container */
.nav__panel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Layer 0: Water-like refraction — organic blobs at edges, not a uniform ring */
.nav__glass-refract {
  position: absolute;
  inset: -8px;
  z-index: 0;
  backdrop-filter: url(#liquid-glass-distort) blur(6px) saturate(160%) brightness(0.7);
  -webkit-backdrop-filter: blur(6px) saturate(160%) brightness(0.7);
  /* Scale from cursor origin creates parallax-like water bending */
  transform-origin: var(--mx, 50%) var(--my, 50%);
  transform: translate(var(--lx, 0px), var(--ly, 0px)) scale(1.04);
  will-change: transform;
  animation: refractBreathe 12s ease-in-out infinite;
  /* Organic blobs at corners & edges — asymmetric, fluid shapes */
  mask-image:
    radial-gradient(ellipse 40% 34% at 94% 6%, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.35) 42%, transparent 72%),
    radial-gradient(ellipse 34% 30% at 4% 92%, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.3) 38%, transparent 68%),
    radial-gradient(ellipse 22% 40% at 2% 38%, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 35%, transparent 65%),
    radial-gradient(ellipse 32% 26% at 90% 94%, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.25) 36%, transparent 64%),
    radial-gradient(ellipse 26% 20% at 14% 5%, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.15) 32%, transparent 58%),
    radial-gradient(ellipse 18% 28% at 50% 98%, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.12) 30%, transparent 55%);
  mask-composite: add;
  -webkit-mask-image:
    radial-gradient(ellipse 40% 34% at 94% 6%, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.35) 42%, transparent 72%),
    radial-gradient(ellipse 34% 30% at 4% 92%, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.3) 38%, transparent 68%),
    radial-gradient(ellipse 22% 40% at 2% 38%, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 35%, transparent 65%),
    radial-gradient(ellipse 32% 26% at 90% 94%, rgba(0, 0, 0, 0.6) 0%, rgba(0, 0, 0, 0.25) 36%, transparent 64%),
    radial-gradient(ellipse 26% 20% at 14% 5%, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.15) 32%, transparent 58%),
    radial-gradient(ellipse 18% 28% at 50% 98%, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.12) 30%, transparent 55%);
  -webkit-mask-composite: source-over;
}

/* Layer 1: Dark opaque base — organic multi-blob coverage, ~80% dark */
.nav__glass-frost {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(6, 6, 8, 0.92);
  backdrop-filter: blur(2px) saturate(120%);
  -webkit-backdrop-filter: blur(2px) saturate(120%);
  /* Organic center mass — multiple overlapping blobs create irregular dark area */
  mask-image:
    radial-gradient(ellipse 72% 60% at 52% 46%, black 0%, black 35%, rgba(0, 0, 0, 0.7) 55%, rgba(0, 0, 0, 0.25) 74%, transparent 90%),
    radial-gradient(ellipse 34% 28% at 80% 20%, black 0%, rgba(0, 0, 0, 0.55) 42%, transparent 78%),
    radial-gradient(ellipse 30% 32% at 20% 80%, black 0%, rgba(0, 0, 0, 0.45) 38%, transparent 72%),
    radial-gradient(ellipse 22% 36% at 88% 62%, black 0%, rgba(0, 0, 0, 0.35) 40%, transparent 70%),
    radial-gradient(ellipse 28% 18% at 35% 12%, black 0%, rgba(0, 0, 0, 0.3) 35%, transparent 65%);
  mask-composite: add;
  -webkit-mask-image:
    radial-gradient(ellipse 72% 60% at 52% 46%, black 0%, black 35%, rgba(0, 0, 0, 0.7) 55%, rgba(0, 0, 0, 0.25) 74%, transparent 90%),
    radial-gradient(ellipse 34% 28% at 80% 20%, black 0%, rgba(0, 0, 0, 0.55) 42%, transparent 78%),
    radial-gradient(ellipse 30% 32% at 20% 80%, black 0%, rgba(0, 0, 0, 0.45) 38%, transparent 72%),
    radial-gradient(ellipse 22% 36% at 88% 62%, black 0%, rgba(0, 0, 0, 0.35) 40%, transparent 70%),
    radial-gradient(ellipse 28% 18% at 35% 12%, black 0%, rgba(0, 0, 0, 0.3) 35%, transparent 65%);
  -webkit-mask-composite: source-over;
}

/* Layer 0.5: Mouse-following water lens — localized refraction at cursor */
.nav__glass-lens {
  position: absolute;
  width: clamp(180px, 22vw, 280px);
  height: clamp(180px, 22vw, 280px);
  border-radius: 50%;
  z-index: 0;
  left: var(--mx, 50%);
  top: var(--my, 50%);
  transform: translate(-50%, -50%);
  will-change: left, top;
  backdrop-filter: url(#liquid-glass-distort) blur(18px) saturate(200%) brightness(0.68) contrast(1.08);
  -webkit-backdrop-filter: blur(18px) saturate(200%) brightness(0.68) contrast(1.08);
  /* Soft circular falloff — strong center, feathered edges */
  mask-image: radial-gradient(
    circle,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.3) 22%,
    rgba(0, 0, 0, 0.12) 45%,
    rgba(0, 0, 0, 0.04) 62%,
    transparent 78%
  );
  -webkit-mask-image: radial-gradient(
    circle,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.3) 22%,
    rgba(0, 0, 0, 0.12) 45%,
    rgba(0, 0, 0, 0.04) 62%,
    transparent 78%
  );
  pointer-events: none;
}

/* Caustic specular highlight inside lens */
.nav__glass-lens::after {
  content: '';
  position: absolute;
  inset: 18%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.02) 35%,
    transparent 65%
  );
}

/* Layer 2: Bevel + specular — soft glass depth, no hard borders */
.nav__glass-specular {
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    linear-gradient(150deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.02) 14%, transparent 35%),
    radial-gradient(ellipse 60% 40% at 15% 8%, rgba(255, 255, 255, 0.06) 0%, transparent 60%),
    radial-gradient(ellipse 40% 25% at 80% 90%, rgba(255, 255, 255, 0.02) 0%, transparent 50%);
  /* Soft inset glow instead of hard border — fluid glass edge */
  box-shadow:
    inset 0 1px 12px rgba(255, 255, 255, 0.06),
    inset 0 -1px 12px rgba(0, 0, 0, 0.15),
    inset 1px 0 8px rgba(255, 255, 255, 0.03),
    inset -1px 0 8px rgba(0, 0, 0, 0.08);
  pointer-events: none;
}

.nav__panel-inner {
  position: relative;
  z-index: 3;
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
  color: rgba(255, 255, 255, 0.35);
  text-decoration: none;
  perspective: 600px;
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
  color: rgba(255, 255, 255, 0.15);
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

/* Slow organic drift — refraction blobs subtly shift like light on water */
@keyframes refractBreathe {
  0% { mask-position: 0 0, 0 0, 0 0, 0 0, 0 0, 0 0; }
  33% { mask-position: -4px 3px, 3px -2px, -2px 4px, 4px -3px, -3px 2px, 2px -1px; }
  66% { mask-position: 3px -2px, -3px 4px, 4px -1px, -2px 3px, 2px -4px, -1px 3px; }
  100% { mask-position: 0 0, 0 0, 0 0, 0 0, 0 0, 0 0; }
}

/* ─── Transition: Mobile (clip-path circle) — soft, no harsh flash ─── */
.menu-enter-active {
  transition:
    clip-path 1.05s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.9s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-leave-active {
  transition:
    clip-path 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.35s 0.25s ease,
    filter 0.65s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-enter-from {
  clip-path: circle(0% at calc(100% - 3rem) 2rem);
  opacity: 0;
  filter: brightness(1.15) blur(14px);
}

.menu-enter-to {
  clip-path: circle(150% at calc(100% - 3rem) 2rem);
  opacity: 1;
  filter: brightness(1) blur(0);
}

.menu-leave-from {
  clip-path: circle(150% at calc(100% - 3rem) 2rem);
  opacity: 1;
  filter: brightness(1) blur(0);
}

.menu-leave-to {
  clip-path: circle(0% at calc(100% - 3rem) 2rem);
  opacity: 0;
  filter: brightness(1.15) blur(14px);
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
    width: 40vw;
    min-width: 420px;
    max-width: 640px;
    flex-shrink: 0;
  }

  /* Desktop: organic refraction blobs at left edge + corners */
  .nav__glass-refract {
    mask-image:
      radial-gradient(ellipse 45% 30% at 0% 25%, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 40%, transparent 70%),
      radial-gradient(ellipse 35% 25% at 0% 72%, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.2) 38%, transparent 65%),
      radial-gradient(ellipse 30% 28% at 95% 10%, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 35%, transparent 62%),
      radial-gradient(ellipse 25% 22% at 92% 88%, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.18) 32%, transparent 58%),
      radial-gradient(ellipse 20% 35% at 0% 50%, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.15) 30%, transparent 55%);
    mask-composite: add;
    -webkit-mask-image:
      radial-gradient(ellipse 45% 30% at 0% 25%, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 40%, transparent 70%),
      radial-gradient(ellipse 35% 25% at 0% 72%, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.2) 38%, transparent 65%),
      radial-gradient(ellipse 30% 28% at 95% 10%, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 35%, transparent 62%),
      radial-gradient(ellipse 25% 22% at 92% 88%, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.18) 32%, transparent 58%),
      radial-gradient(ellipse 20% 35% at 0% 50%, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.15) 30%, transparent 55%);
    -webkit-mask-composite: source-over;
  }

  .nav__glass-frost {
    background: rgba(6, 6, 8, 0.92);
    /* Desktop: organic dark center with left-edge organic windows */
    mask-image:
      radial-gradient(ellipse 85% 65% at 55% 48%, black 0%, black 30%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.3) 70%, transparent 88%),
      radial-gradient(ellipse 30% 25% at 75% 18%, black 0%, rgba(0, 0, 0, 0.5) 40%, transparent 72%),
      radial-gradient(ellipse 25% 30% at 65% 82%, black 0%, rgba(0, 0, 0, 0.4) 35%, transparent 68%);
    mask-composite: add;
    -webkit-mask-image:
      radial-gradient(ellipse 85% 65% at 55% 48%, black 0%, black 30%, rgba(0, 0, 0, 0.7) 50%, rgba(0, 0, 0, 0.3) 70%, transparent 88%),
      radial-gradient(ellipse 30% 25% at 75% 18%, black 0%, rgba(0, 0, 0, 0.5) 40%, transparent 72%),
      radial-gradient(ellipse 25% 30% at 65% 82%, black 0%, rgba(0, 0, 0, 0.4) 35%, transparent 68%);
    -webkit-mask-composite: source-over;
  }

  .nav__glass-specular {
    /* Soft left-edge glow — no hard border line */
    box-shadow:
      inset 0 1px 12px rgba(255, 255, 255, 0.06),
      inset 0 -1px 12px rgba(0, 0, 0, 0.15),
      inset 3px 0 16px rgba(255, 255, 255, 0.04),
      inset -1px 0 8px rgba(0, 0, 0, 0.08),
      -20px 0 60px rgba(0, 0, 0, 0.25);
  }

  .nav__glass-lens {
    width: clamp(150px, 16vw, 220px);
    height: clamp(150px, 16vw, 220px);
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

  /* Backdrop fade — soft, gradual */
  .menu-enter-active .nav__backdrop {
    transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .menu-enter-from .nav__backdrop {
    opacity: 0;
  }

  .menu-leave-active .nav__backdrop {
    transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .menu-leave-to .nav__backdrop {
    opacity: 0;
  }

  /* Panel slide from right — smooth glide */
  .menu-enter-active .nav__panel {
    transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .menu-enter-from .nav__panel {
    transform: translateX(100%);
  }

  .menu-leave-active .nav__panel {
    transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  }

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

  .nav__glass-refract {
    animation: none;
  }
}
</style>
