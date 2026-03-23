<script setup lang="ts">
/**
 * AppNavigation — Minimal hamburger + full-screen overlay
 *
 * Hamburger: 2 lines → X animation (CSS transform)
 * Logo: BM monogram, top-left, mix-blend-mode: difference
 * Overlay: full-screen with stacked menu items + text scramble
 */
import { useSmoothScroll } from '~/composables/useSmoothScroll'

interface MenuItem {
  label: string
  target: string
}

const MENU_ITEMS: MenuItem[] = [
  { label: 'Work', target: '#work' },
  { label: 'About', target: '#about' },
  { label: 'Manifesto', target: '.section-manifesto' },
  { label: 'Contact', target: '#contact' },
]

const isOpen = ref(false)
const triggerRef = ref<HTMLElement>()
const overlayRef = ref<HTMLElement>()
const itemRefs = ref<HTMLElement[]>([])

const { scrollTo } = useSmoothScroll()
let gsapModule: typeof import('gsap').default | null = null
let timeline: gsap.core.Timeline | null = null
let magnetAnimId = 0
let magnetTargetX = 0
let magnetTargetY = 0
let magnetCurrentX = 0
let magnetCurrentY = 0
const MAGNET_RADIUS = 50
const MAGNET_STRENGTH = 0.3
const MAGNET_LERP = 0.1

// ─── Magnetic trigger ───

function onTriggerMouseMove(e: MouseEvent) {
  const el = triggerRef.value
  if (!el)
    return
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const dx = e.clientX - cx
  const dy = e.clientY - cy
  const dist = Math.hypot(dx, dy)
  if (dist < MAGNET_RADIUS + rect.width / 2) {
    magnetTargetX = dx * MAGNET_STRENGTH
    magnetTargetY = dy * MAGNET_STRENGTH
  }
  else {
    magnetTargetX = 0
    magnetTargetY = 0
  }
}

function onTriggerMouseLeave() {
  magnetTargetX = 0
  magnetTargetY = 0
}

function animateMagnet() {
  magnetCurrentX += (magnetTargetX - magnetCurrentX) * MAGNET_LERP
  magnetCurrentY += (magnetTargetY - magnetCurrentY) * MAGNET_LERP
  if (Math.abs(magnetCurrentX) < 0.01 && Math.abs(magnetCurrentY) < 0.01
    && magnetTargetX === 0 && magnetTargetY === 0) {
    magnetCurrentX = 0
    magnetCurrentY = 0
  }
  if (triggerRef.value)
    triggerRef.value.style.transform = `translate(${magnetCurrentX}px, ${magnetCurrentY}px)`
  magnetAnimId = requestAnimationFrame(animateMagnet)
}

// ─── Circle clip-path from hamburger position ───
function circleClip(size: string): string {
  if (!triggerRef.value)
    return `circle(${size} at 95% 3%)`
  const rect = triggerRef.value.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  return `circle(${size} at ${x}px ${y}px)`
}

// ─── Menu open/close ───

async function toggleMenu() {
  if (!gsapModule)
    gsapModule = (await import('gsap')).default
  if (isOpen.value)
    closeMenu()
  else
    openMenu()
}

function openMenu() {
  if (!gsapModule || !overlayRef.value)
    return
  isOpen.value = true
  document.body.style.overflow = 'hidden'

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    overlayRef.value.style.clipPath = 'inset(0)'
    overlayRef.value.style.visibility = 'visible'
    return
  }

  if (timeline)
    timeline.kill()

  timeline = gsapModule.timeline({ defaults: { ease: 'expo.inOut' } })
  timeline.set(overlayRef.value, { visibility: 'visible' })
  timeline.fromTo(overlayRef.value, { clipPath: circleClip('0%') }, { clipPath: circleClip('150%'), duration: 0.8 })
  timeline.fromTo(itemRefs.value, { yPercent: 40, opacity: 0, filter: 'blur(8px)' }, { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 0.5, ease: 'expo.out', stagger: 0.08 }, '-=0.25')
}

function closeMenu() {
  if (!gsapModule || !overlayRef.value)
    return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    isOpen.value = false
    document.body.style.overflow = ''
    overlayRef.value.style.visibility = 'hidden'
    overlayRef.value.style.clipPath = circleClip('0%')
    return
  }

  if (timeline)
    timeline.kill()

  timeline = gsapModule.timeline({
    defaults: { ease: 'expo.inOut' },
    onComplete: () => {
      isOpen.value = false
      document.body.style.overflow = ''
    },
  })

  timeline.to(itemRefs.value, {
    yPercent: -30,
    opacity: 0,
    filter: 'blur(8px)',
    duration: 0.35,
    ease: 'expo.in',
    stagger: 0.04,
  })
  timeline.fromTo(overlayRef.value, { clipPath: circleClip('150%') }, { clipPath: circleClip('0%'), duration: 0.6 }, '-=0.15')
  timeline.set(overlayRef.value, { visibility: 'hidden' })
}

// ─── Navigation ───

async function navigateToSection(target: string) {
  closeMenu()
  if (!gsapModule)
    gsapModule = (await import('gsap')).default

  const main = document.querySelector('.app') as HTMLElement
  if (!main)
    return

  gsapModule.to(main, {
    filter: 'blur(12px)',
    scale: 0.985,
    opacity: 0.6,
    duration: 0.45,
    ease: 'power3.in',
  })

  setTimeout(() => {
    const el = document.querySelector(target)
    if (el)
      scrollTo(el as HTMLElement, { duration: 1.4 })
    setTimeout(() => {
      gsapModule!.to(main, {
        filter: 'blur(0px)',
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: 'expo.out',
      })
    }, 900)
  }, 500)
}

async function scrollToTop() {
  if (!gsapModule)
    gsapModule = (await import('gsap')).default
  const main = document.querySelector('.app') as HTMLElement
  if (!main) {
    scrollTo(0, { duration: 2.0 })
    return
  }
  gsapModule.to(main, {
    filter: 'blur(12px)',
    scale: 0.985,
    opacity: 0.6,
    duration: 0.45,
    ease: 'power3.in',
  })
  setTimeout(() => {
    scrollTo(0, { duration: 1.4 })
    setTimeout(() => {
      gsapModule!.to(main, {
        filter: 'blur(0px)',
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: 'expo.out',
      })
    }, 900)
  }, 300)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value)
    closeMenu()
}

onMounted(() => {
  if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0)
    animateMagnet()
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  cancelAnimationFrame(magnetAnimId)
  document.removeEventListener('keydown', onKeydown)
  if (timeline) {
    timeline.kill()
    timeline = null
  }
  if (isOpen.value)
    document.body.style.overflow = ''
})
</script>

<template>
  <!-- BM Logo — top-left -->
  <a
    class="nav-logo"
    href="#"
    aria-label="Back to top"
    data-cursor="link"
    @click.prevent="scrollToTop"
  >
    <img
      src="/assets/images/logo/logo-bm-white-origin.svg"
      alt="BM"
      class="nav-logo__img"
      width="28"
      height="28"
    >
  </a>

  <!-- Hamburger trigger — top-right -->
  <button
    ref="triggerRef"
    class="nav-burger"
    :class="{ 'is-open': isOpen }"
    :aria-expanded="isOpen"
    aria-controls="nav-overlay"
    aria-label="Toggle menu"
    data-cursor="link"
    @click="toggleMenu"
    @mousemove="onTriggerMouseMove"
    @mouseleave="onTriggerMouseLeave"
  >
    <span class="nav-burger__line nav-burger__line--top" />
    <span class="nav-burger__line nav-burger__line--bot" />
    <!-- Close icon: visible when menu is open -->
    <svg
      class="nav-burger__close-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <line x1="6" y1="6" x2="18" y2="18" />
      <line x1="18" y1="6" x2="6" y2="18" />
    </svg>
  </button>

  <!-- Full-screen overlay -->
  <div
    id="nav-overlay"
    ref="overlayRef"
    class="nav-overlay"
    :class="{ 'nav-overlay--open': isOpen }"
    role="dialog"
    :aria-hidden="!isOpen"
    aria-label="Navigation menu"
  >
    <nav class="nav-overlay__inner" aria-label="Main navigation">
      <a
        v-for="(item, index) in MENU_ITEMS"
        :key="item.label"
        :ref="(el) => { if (el) itemRefs[index] = el as HTMLElement }"
        class="nav-menu__item"
        :href="item.target"
        role="menuitem"
        :tabindex="isOpen ? 0 : -1"
        @click.prevent="navigateToSection(item.target)"
      >
        <span class="nav-menu__num">{{ String(index + 1).padStart(2, '0') }}</span>
        <span class="nav-menu__label">{{ item.label }}</span>
      </a>
    </nav>
  </div>
</template>

<style scoped>
/* ═══ Logo ═══ */
.nav-logo {
  position: fixed;
  top: clamp(1.25rem, 3vh, 2rem);
  left: var(--page-margin);
  z-index: var(--z-nav);
  mix-blend-mode: difference;
  display: flex;
  align-items: center;
}

.nav-logo__img {
  width: 28px;
  height: auto;
  display: block;
}

/* ═══ Hamburger — 2 lines → X ═══ */
.nav-burger {
  position: fixed;
  top: clamp(1.25rem, 3vh, 2rem);
  right: var(--page-margin);
  z-index: var(--z-nav);
  mix-blend-mode: difference;
  width: 32px;
  height: 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 7px;
  padding: 0;
  border: none;
  background: none;
  cursor: pointer;
  will-change: transform;
}

.nav-burger__line {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--text-primary);
  border-radius: 1px;
  transition:
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    background 0.3s ease,
    box-shadow 0.3s ease;
  transform-origin: center;
}

/* Hamburger hover — blue glow */
.nav-burger:hover .nav-burger__line {
  background: var(--event-blue, #0047FF);
  box-shadow: 0 0 8px rgba(0, 71, 255, 0.4);
}

/* Close icon — hidden by default, visible when menu is open */
.nav-burger__close-icon {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  color: var(--event-cyan, #a1e0e7);
  opacity: 0;
  transform: rotate(-90deg) scale(0.6);
  transition:
    opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
}

/* When open: bring burger above overlay, disable difference blend, show close icon */
.nav-burger.is-open {
  z-index: calc(var(--z-menu) + 1);
  mix-blend-mode: normal;
}

.nav-burger.is-open .nav-burger__line {
  opacity: 0;
  transform: scaleX(0);
}

.nav-burger.is-open .nav-burger__close-icon {
  opacity: 1;
  transform: rotate(0deg) scale(1);
  filter: drop-shadow(0 0 8px rgba(161, 224, 231, 0.4));
}

/* ═══ Overlay — atmospheric dark, matches liquid theme ═══ */
.nav-overlay {
  position: fixed;
  inset: 0;
  z-index: var(--z-menu);
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0, 71, 255, 0.1) 0%, transparent 60%),
    radial-gradient(ellipse 50% 50% at 80% 80%, rgba(15, 10, 114, 0.12) 0%, transparent 50%),
    var(--void-blue, #060610);
  visibility: hidden;
  clip-path: circle(0% at calc(100% - var(--page-margin) - 16px) clamp(1.25rem, 3vh, 2rem));
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Grain inside overlay */
.nav-overlay::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  mix-blend-mode: overlay;
  background-image: url('/assets/textures/grain.png');
  background-size: 200px 200px;
  background-repeat: repeat;
}

.nav-overlay__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(0.5rem, 2vh, 1.25rem);
}

/* ═══ Menu items ═══ */
.nav-menu__item {
  display: flex;
  align-items: baseline;
  gap: clamp(0.5rem, 1.5vw, 1rem);
  text-decoration: none;
  color: var(--text-primary);
  will-change: transform, opacity, filter;
  opacity: 0;
  position: relative;
}

/* Hover underline sweep — metallic gradient matching hero */
.nav-menu__item::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, var(--event-cyan, #a1e0e7), var(--event-blue, #0047FF), var(--event-cyan, #a1e0e7));
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-menu__item:hover::after {
  transform: scaleX(1);
  transform-origin: left;
}

.nav-menu__num {
  font-family: var(--font-mono, monospace);
  font-size: var(--text-caption);
  letter-spacing: var(--tracking-wide);
  color: var(--event-blue);
  opacity: 0.4;
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.nav-menu__label {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 7vw, 7rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1;
  text-transform: uppercase;
  color: var(--text-primary);
  transition:
    letter-spacing 0.4s cubic-bezier(0.16, 1, 0.3, 1),
    filter 0.3s ease;
}

/* Hover: metallic gradient fill matching hero + cyan glow */
.nav-menu__item:hover .nav-menu__label {
  background: linear-gradient(
    110deg,
    #808080 0%,
    var(--event-cyan, #a1e0e7) 30%,
    #ffffff 50%,
    var(--event-blue, #0047FF) 70%,
    #d0d0d0 100%
  );
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.02em;
  filter: drop-shadow(0 0 20px rgba(161, 224, 231, 0.3));
}

.nav-menu__item:hover .nav-menu__num {
  opacity: 1;
}

.nav-menu__item:focus-visible {
  outline: 1px solid var(--event-blue);
  outline-offset: 8px;
}

/* ═══ Reduced motion ═══ */
@media (prefers-reduced-motion: reduce) {
  .nav-burger {
    will-change: auto;
    transform: none !important;
  }

  .nav-burger__line {
    transition: none;
  }

  .nav-menu__label,
  .nav-menu__num {
    transition: none;
  }
}

/* ═══ Mobile ═══ */
@media (max-width: 768px) {
  .nav-menu__label {
    font-size: clamp(2rem, 11vw, 4rem);
  }
}
</style>
