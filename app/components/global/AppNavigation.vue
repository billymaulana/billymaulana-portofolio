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

/* Mouse gently shifts the noise pattern — NOT the mask */
const liquidStyle = computed(() => ({
  '--lx': `${(mousePos.x - 50) * 0.14}px`,
  '--ly': `${(mousePos.y - 50) * 0.14}px`,
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
            <feTurbulence type="turbulence" baseFrequency="0.0025 0.004" numOctaves="2" seed="31" result="waves" />
            <feGaussianBlur in="waves" stdDeviation="4" result="smooth" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="smooth"
              scale="38"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </Teleport>

    <!-- Overlay: backdrop + side panel -->
    <Transition name="menu" :duration="{ enter: 850, leave: 600 }">
      <div v-if="isMenuOpen" class="nav__overlay">
        <div class="nav__backdrop" @click="toggleMenu" />
        <div ref="panelRef" class="nav__panel" @pointermove="handlePanelMove">
          <!-- Layer 0: SVG displacement — edge-only, follows mouse -->
          <div class="nav__glass-refract" :style="liquidStyle" />
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

/* Logo stays visible when menu is open */

.nav__logo-img {
  height: 28px;
  width: auto;
  filter: brightness(1.1);
}

/* ─── Trigger: clean button (no glass when closed) ─── */
.nav__trigger {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border: 1px solid transparent;
  border-radius: 50%;
  box-shadow: none;
  cursor: pointer;
  padding: 0;
  isolation: isolate;
  -webkit-tap-highlight-color: transparent;
  transition:
    background 0.5s var(--ease-out-expo),
    box-shadow 0.5s var(--ease-out-expo),
    border-color 0.5s var(--ease-out-expo),
    backdrop-filter 0.5s var(--ease-out-expo);
}

/* Specular highlight — only visible when menu open */
.nav__trigger::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(
    155deg,
    rgba(255, 255, 255, 0.22) 0%,
    rgba(255, 255, 255, 0.06) 30%,
    transparent 55%
  );
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s var(--ease-out-expo);
}

/* Refraction ring — light catching on circular glass edge */
.nav__trigger::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  background: conic-gradient(
    from 135deg,
    transparent 0%,
    rgba(255, 255, 255, 0.14) 10%,
    transparent 25%,
    rgba(255, 255, 255, 0.06) 45%,
    transparent 60%,
    rgba(255, 255, 255, 0.10) 78%,
    transparent 90%
  );
  mask: radial-gradient(circle, transparent 56%, black 62%, black 100%);
  -webkit-mask: radial-gradient(circle, transparent 56%, black 62%, black 100%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s var(--ease-out-expo);
}

.nav__trigger:hover {
  background: rgba(255, 255, 255, 0.04);
}

/* Liquid glass close button — magnifying lens refraction */
.nav__trigger--open {
  background: rgba(255, 255, 255, 0.07);
  backdrop-filter: blur(24px) saturate(200%) brightness(1.08);
  -webkit-backdrop-filter: blur(24px) saturate(200%) brightness(1.08);
  border-color: rgba(255, 255, 255, 0.10);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.22),
    inset 0 -0.5px 0 rgba(0, 0, 0, 0.12),
    0 4px 20px rgba(0, 0, 0, 0.20),
    0 0 0 0.5px rgba(255, 255, 255, 0.04);
}

.nav__trigger--open::before {
  opacity: 1;
}

.nav__trigger--open::after {
  opacity: 1;
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
/* Base transitions → these play during CLOSE animation */
.nav__trigger-bar:nth-child(1) {
  width: 26px;
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.35s cubic-bezier(0.22, 1, 0.36, 1) 0.08s,
    opacity 0.3s,
    background 0.3s;
}

.nav__trigger-bar:nth-child(2) {
  width: 16px;
  transition:
    opacity 0.25s ease 0.15s,
    transform 0.25s ease 0.15s,
    width 0.3s cubic-bezier(0.22, 1, 0.36, 1) 0.04s,
    background 0.3s;
}

.nav__trigger-bar:nth-child(3) {
  width: 21px;
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1),
    width 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s,
    background 0.3s;
}

/* Hover (closed): bars equalize + brighten */
.nav__trigger:hover .nav__trigger-bar {
  width: 26px;
  background: rgba(255, 255, 255, 1);
}

/* ─── Open: smooth CSS transition to × ─── */
/* Open transitions → these play during OPEN animation */
.nav__trigger--open .nav__trigger-bar:nth-child(1) {
  width: 26px;
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(9px) rotate(45deg);
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.08s,
    width 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.3s;
}

.nav__trigger--open .nav__trigger-bar:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    width 0.2s ease,
    background 0.3s;
}

.nav__trigger--open .nav__trigger-bar:nth-child(3) {
  width: 26px;
  background: rgba(255, 255, 255, 0.9);
  transform: translateY(-9px) rotate(-45deg);
  transition:
    transform 0.45s cubic-bezier(0.22, 1, 0.36, 1) 0.08s,
    width 0.35s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.3s;
}

/* Hover (open): enhance glass + brighten × */
.nav__trigger--open:hover {
  background: rgba(255, 255, 255, 0.11);
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.28),
    inset 0 -0.5px 0 rgba(0, 0, 0, 0.14),
    0 6px 24px rgba(0, 0, 0, 0.25),
    0 0 0 0.5px rgba(255, 255, 255, 0.06);
}

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

/* Panel — liquid glass container */
.nav__panel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Layer 0: Liquid at edges only — mouse gently shifts the noise pattern */
.nav__glass-refract {
  position: absolute;
  inset: -8px;
  z-index: 0;
  backdrop-filter: url(#liquid-glass-distort) blur(0.5px);
  -webkit-backdrop-filter: blur(0.5px);
  /* Mouse shifts the displacement noise, not the mask */
  transform: translate(var(--lx, 0px), var(--ly, 0px));
  will-change: transform;
  /* Fixed edge mask: ~85% transparent center, thin liquid rim at very outer edges */
  mask-image:
    radial-gradient(
      ellipse 80% 75% at 50% 50%,
      transparent 0%,
      transparent 65%,
      rgba(0, 0, 0, 0.04) 74%,
      rgba(0, 0, 0, 0.12) 82%,
      rgba(0, 0, 0, 0.3) 90%,
      rgba(0, 0, 0, 0.55) 96%,
      rgba(0, 0, 0, 0.7) 100%
    );
  -webkit-mask-image:
    radial-gradient(
      ellipse 80% 75% at 50% 50%,
      transparent 0%,
      transparent 65%,
      rgba(0, 0, 0, 0.04) 74%,
      rgba(0, 0, 0, 0.12) 82%,
      rgba(0, 0, 0, 0.3) 90%,
      rgba(0, 0, 0, 0.55) 96%,
      rgba(0, 0, 0, 0.7) 100%
    );
}

/* Layer 1: Transparent tint — liquid edges visible through */
.nav__glass-frost {
  position: absolute;
  inset: 0;
  z-index: 1;
  background: rgba(8, 8, 10, 0.35);
  backdrop-filter: blur(1px) saturate(180%);
  -webkit-backdrop-filter: blur(1px) saturate(180%);
}

/* Layer 2: Bevel + specular — deep glass refraction highlights */
.nav__glass-specular {
  position: absolute;
  inset: 0;
  z-index: 2;
  background:
    linear-gradient(150deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 12%, transparent 32%),
    radial-gradient(ellipse 60% 40% at 15% 8%, rgba(255, 255, 255, 0.07) 0%, transparent 60%),
    radial-gradient(ellipse 40% 25% at 80% 90%, rgba(255, 255, 255, 0.03) 0%, transparent 50%);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    inset 0 2px 8px rgba(255, 255, 255, 0.10),
    inset 0 -2px 8px rgba(0, 0, 0, 0.20),
    inset 2px 0 4px rgba(255, 255, 255, 0.06),
    inset -2px 0 4px rgba(0, 0, 0, 0.12);
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
  display: flex;
  align-items: baseline;
  gap: clamp(0.8125rem, 1.5vw, 1.3125rem);
  padding: clamp(0.8125rem, 1.5vh, 1.3125rem) 0;
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
  letter-spacing: 0.15em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  transition: color 0.4s var(--ease-out-expo);
}

.nav__menu-link:hover .nav__menu-index {
  color: var(--color-text-secondary);
}

/* ─── Per-character 3D cube (crz.studio style) ─── */
.nav__menu-word {
  display: inline-flex;
  font-family: 'Clash Display', 'Satoshi', system-ui, sans-serif;
  font-size: clamp(2.5rem, 8vw, 5.5rem);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.02em;
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
  transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
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
  color: var(--color-text-tertiary);
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

  /* Desktop side panel: thin liquid rim only at panel edges */
  .nav__glass-refract {
    mask-image:
      radial-gradient(
        ellipse 72% 68% at 50% 50%,
        transparent 0%,
        transparent 62%,
        rgba(0, 0, 0, 0.04) 72%,
        rgba(0, 0, 0, 0.14) 80%,
        rgba(0, 0, 0, 0.35) 88%,
        rgba(0, 0, 0, 0.55) 95%,
        rgba(0, 0, 0, 0.7) 100%
      );
    -webkit-mask-image:
      radial-gradient(
        ellipse 72% 68% at 50% 50%,
        transparent 0%,
        transparent 62%,
        rgba(0, 0, 0, 0.04) 72%,
        rgba(0, 0, 0, 0.14) 80%,
        rgba(0, 0, 0, 0.35) 88%,
        rgba(0, 0, 0, 0.55) 95%,
        rgba(0, 0, 0, 0.7) 100%
      );
  }

  .nav__glass-frost {
    background: rgba(8, 8, 10, 0.30);
  }

  .nav__glass-specular {
    border-left: 1px solid rgba(255, 255, 255, 0.10);
    box-shadow:
      inset 0 2px 8px rgba(255, 255, 255, 0.10),
      inset 0 -2px 8px rgba(0, 0, 0, 0.20),
      inset 3px 0 6px rgba(255, 255, 255, 0.06),
      inset -2px 0 4px rgba(0, 0, 0, 0.12),
      -20px 0 60px rgba(0, 0, 0, 0.30);
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

  .nav__trigger::before,
  .nav__trigger::after {
    display: none;
  }

  .nav__trigger-bar {
    transition: none !important;
  }
}
</style>
