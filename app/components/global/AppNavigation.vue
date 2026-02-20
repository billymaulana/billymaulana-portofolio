<script setup lang="ts">
import { profile } from '~/constants/profile'

const { scrollTo } = useSmoothScroll()

const logoSrc = '/assets/images/logo/logo-bm-white-origin.svg'

// ─── Refs ───
const triggerRef = ref<HTMLElement | null>(null)
const flowCanvasRef = ref<HTMLCanvasElement | null>(null)
const inkCanvasRef = ref<HTMLCanvasElement | null>(null)

const isScrolled = ref(false)
const isHidden = ref(false)
const isMenuOpen = ref(false)
let lastScrollY = 0

// WebGL & filter support
const hasWebGL = ref(true)
const supportsSvgFilter = ref(true)
const glassVisible = ref(false)

// ─── Composables ───
const liquidMorph = useLiquidMorph()

const flowShader = useGlassShader({
  reducedMotion: typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false,
})

const { displacementScale, displacementMapUri, startCoupling, stopCoupling } = useLiquidGlass()

// ─── Nav items ───
const navItems = [
  { index: '01', label: 'About', href: '#about' },
  { index: '02', label: 'Work', href: '#work' },
  { index: '03', label: 'Contact', href: '#contact' },
]

// ─── Ink distortion (lazy, desktop only) ───
type InkState = ReturnType<typeof import('~/composables/useMenuInkDistortion').useMenuInkDistortion>
let inkDistortion: InkState | null = null

// ─── Mouse state ───
let mouseTarget = { x: 0.5, y: 0.5 }

// Track whether flow shader has been initialized
let flowInitialized = false

// ─── Responsive font size for ink canvas ───
function computeMenuFontSize(): number {
  return Math.min(Math.max(window.innerWidth * 0.035, 34), 56)
}

// ─── Handlers ───
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

function handleInkCanvasClick(e: MouseEvent) {
  if (!inkDistortion)
    return
  const href = inkDistortion.hitTest(e.clientX, e.clientY)
  if (href)
    handleNavClick(href)
}

// ─── Escape key ───
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isMenuOpen.value) {
    isMenuOpen.value = false
  }
}

// ─── Lifecycle ───
onMounted(() => {
  // Test SVG filter support in backdrop-filter
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
  window.addEventListener('keydown', onKeydown)

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('keydown', onKeydown)
    flowShader.destroy()
    liquidMorph.kill()
    if (inkDistortion)
      inkDistortion.destroy()
  })
})

// ─── Menu open/close orchestration ───
watch(isMenuOpen, async (open) => {
  document.documentElement.style.overflow = open ? 'hidden' : ''
  document.body.style.overflow = open ? 'hidden' : ''
  document.documentElement.classList.toggle('menu-open', open)

  if (open) {
    // Start circle clip-path expansion from trigger button
    if (triggerRef.value) {
      liquidMorph.open(triggerRef.value)
    }

    // Wait for v-if DOM to render
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
      startCoupling(() => flowShader.getFlowIntensity())

      // Inject splats at button position (top-right area) for liquid expansion feel
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          flowShader.injectSplat(0.85, 0.05, 1.2 - i * 0.15)
        }, i * 60)
      }
    }

    // Init ink distortion on first open (desktop only, >= 768px)
    if (window.innerWidth >= 768 && inkCanvasRef.value) {
      try {
        const { useMenuInkDistortion: createInk } = await import('~/composables/useMenuInkDistortion')
        inkDistortion = createInk({
          fontSize: computeMenuFontSize(),
          items: navItems,
        })
        inkDistortion.init(inkCanvasRef.value)
        inkDistortion.start()
      }
      catch {
        // Ink distortion is optional — fail silently
      }
    }

    // Show glass body after morph transition has progressed
    setTimeout(() => {
      glassVisible.value = true
    }, 300)
  }
  else {
    // Hide glass body immediately before close animation
    glassVisible.value = false

    // Close circle clip-path
    liquidMorph.close()

    // Stop flow shader & coupling
    flowShader.setOpenProgress(0)
    flowShader.stop()
    stopCoupling()

    // Destroy ink distortion (re-init on next open for clean state)
    if (inkDistortion) {
      inkDistortion.destroy()
      inkDistortion = null
    }
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
        ref="triggerRef"
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
  </header>

  <!-- Teleported to body: escapes nav stacking context so backdrop-filter can see page content -->
  <Teleport to="body">
    <div
      v-if="isMenuOpen"
      class="nav__overlay"
      :style="{ clipPath: liquidMorph.clipPath.value }"
    >
      <div class="nav__backdrop" @click="toggleMenu" />
      <div class="nav__panel" @pointermove="handlePanelMove">
        <!-- SVG Filter Definitions -->
        <UiLiquidGlassFilter :displacement-scale="displacementScale" :displacement-map-uri="displacementMapUri" />

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
          <!-- WebGL Ink Distortion Canvas (renders menu text with liquid effect) -->
          <canvas
            ref="inkCanvasRef"
            class="nav__ink-canvas"
            aria-hidden="true"
            @click="handleInkCanvasClick"
          />

          <!-- DOM menu (accessible fallback + hit areas) -->
          <ul class="nav__menu" role="list">
            <li
              v-for="(item, i) in navItems"
              :key="item.href"
              class="nav__menu-item"
              :style="{ '--delay': `${0.5 + i * 0.1}s` }"
            >
              <a
                :href="item.href"
                class="nav__menu-link"
                @click.prevent="handleNavClick(item.href)"
              >
                <span class="nav__menu-index">{{ item.index }}</span>
                <span class="nav__menu-label">{{ item.label }}</span>
              </a>
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
  </Teleport>
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
  /* Above overlay (z:150) so the × button remains clickable */
  z-index: 160;
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
  z-index: 150;
  overflow: hidden;
  /* clip-path is applied via inline style from GSAP — no CSS transition needed */
}

/* ─── Backdrop ─── */
/* Hidden on mobile, covers left side on desktop */
.nav__backdrop {
  display: none;
}

/* ─── Panel — liquid glass container ─── */
.nav__panel {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
}

/* ─── Glass Body: SVG displacement + edge-heavy luminance ─── */
.nav__glass-body {
  position: absolute;
  inset: 0;
  z-index: 0;
  border-radius: inherit;
  /* Subtle backdrop frosting — just enough for glass depth */
  backdrop-filter: blur(1px) brightness(1.15);
  -webkit-backdrop-filter: blur(1px) brightness(1.15);
  /* SVG displacement: edge-concentrated refraction + chromatic aberration on the glass surface.
     Chrome doesn't support feDisplacementMap in backdrop-filter, so we use regular filter
     which applies to the composited element (gradient + noise + border = visible displacement). */
  filter: url(#liquid-glass);
  /* Multi-layer glass tint: brighter at edges where displacement is strongest.
     Edge glow gives the displacement visible content to refract. */
  background:
    /* Left edge glow — glass edge catching ambient light */
    linear-gradient(90deg, rgba(180, 200, 230, 0.18) 0%, transparent 35%),
    /* Top specular highlight — light source above-left */
    linear-gradient(180deg, rgba(200, 210, 230, 0.13) 0%, transparent 25%),
    /* Bottom-left corner ambient — subtle depth cue */
    radial-gradient(ellipse at 10% 90%, rgba(160, 180, 220, 0.08), transparent 50%),
    /* Base glass tint */
    linear-gradient(160deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(255, 255, 255, 0.05) 100%);
  /* Edge glow insets — traces the rounded edge like real glass */
  box-shadow:
    inset 2px 0 0 rgba(255, 255, 255, 0.12),
    inset 0 2px 0 rgba(255, 255, 255, 0.08),
    inset -1px 0 0 rgba(255, 255, 255, 0.04),
    0 0 40px rgba(80, 120, 200, 0.04);
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
  opacity: 0.07;
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

@keyframes borderPulse {
  0%, 100% { border-color: rgba(255, 255, 255, 0.14); }
  50% { border-color: rgba(255, 255, 255, 0.08); }
}

/* Subtle inner border glow — traces the glass edge for definition on dark backgrounds */
.nav__glass-body::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
  /* Inner border — visible edge definition, stronger for liquid glass visibility */
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-right: none;
  /* Highlight concentrated on top-left edge (light source direction) */
  mask-image: linear-gradient(160deg, rgba(0,0,0,0.9), rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.4));
  -webkit-mask-image: linear-gradient(160deg, rgba(0,0,0,0.9), rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.4));
  /* Subtle pulse animation for living glass feel */
  animation: borderPulse 6s ease-in-out infinite;
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
  backdrop-filter: blur(8px) saturate(1.2);
  -webkit-backdrop-filter: blur(8px) saturate(1.2);
  background: rgba(255, 255, 255, 0.05);
}

/* ─── Ink Canvas (WebGL menu text distortion) ─── */
.nav__ink-canvas {
  position: relative;
  width: 100%;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.5s var(--ease-out-expo);
}

/* ─── Panel Inner ─── */
.nav__panel-inner {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: clamp(5.5rem, 11vh, 8rem) clamp(2.125rem, 5vw, 3.4375rem) clamp(2.125rem, 4vh, 3.4375rem);
}

/* ─── Menu links (base / mobile) ─── */
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

/* ─── Menu label ─── */
.nav__menu-label {
  font-family: 'Clash Display', 'Satoshi', system-ui, sans-serif;
  font-size: clamp(2.5rem, 8vw, 5.5rem);
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.02em;
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

/* ─── Desktop: Ink canvas visible, DOM menu sr-only ─── */
@media (min-width: 768px) {
  /* DOM menu is visually hidden — ink canvas handles visuals, links stay for a11y */
  .nav__menu {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .nav__ink-canvas {
    display: block;
  }
}

/* ─── Mobile: DOM menu visible, ink canvas hidden ─── */
@media (max-width: 767px) {
  .nav__ink-canvas {
    display: none;
  }

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
    padding: clamp(1rem, 1.8vh, 1.5rem) 0;
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    transition: color 0.5s cubic-bezier(0.45, 0, 0.55, 1);
  }

  .nav__menu-link:hover {
    color: #fff;
  }

  .nav__menu-index {
    font-size: var(--text-caption);
    font-weight: 500;
    color: rgba(255, 255, 255, 0.2);
    letter-spacing: 0.15em;
  }

  .nav__menu-label {
    font-family: 'Clash Display', 'Satoshi', system-ui, sans-serif;
    font-size: clamp(2.5rem, 8vw, 5.5rem);
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.02em;
  }
}

/* ─── Desktop: Side panel layout ─── */
@media (min-width: 1024px) {
  .nav__backdrop {
    display: block;
    position: absolute;
    inset: 0;
    /* Stop before the glass panel so backdrop-filter sees raw page content */
    right: clamp(400px, 36vw, 540px);
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    cursor: pointer;
    transition: opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .nav__panel {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    width: 36vw;
    min-width: 400px;
    max-width: 540px;
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

  .nav__menu-label {
    font-size: clamp(2.125rem, 3.5vw, 3.5rem);
  }
}

@media (max-width: 480px) {
  .nav__menu-label {
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

  .nav__menu-link::after {
    transition: none;
  }

  .nav__trigger-bar {
    transition: none !important;
  }

  .nav__glass-body::before {
    animation: none;
  }

  .nav__glass-body::after {
    animation: none;
  }

  .nav__chromatic-text {
    text-shadow: none;
    -webkit-text-stroke: none;
  }

  .nav__ink-canvas {
    transition: none;
  }
}
</style>
