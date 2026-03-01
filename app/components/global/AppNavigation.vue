<script setup lang="ts">
import { useSmoothScroll } from '~/composables/useSmoothScroll'
/**
 * AppNavigation — Hidden full-screen menu with magnetic trigger
 *
 * Structure:
 * - BM logo (top-left, fixed, mix-blend-mode: difference)
 * - MENU/CLOSE trigger (top-right, fixed, magnetic hover)
 * - Full-screen overlay with stacked menu items
 * - Text scramble on hover for each item
 * - clipPath entrance animation
 */
import { useTextScramble } from '~/composables/useTextScramble'

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
const { scramble } = useTextScramble({ speed: 25, iterations: 4 })

let gsapModule: typeof import('gsap').default | null = null
let timeline: gsap.core.Timeline | null = null
let magnetAnimId = 0
let magnetTargetX = 0
let magnetTargetY = 0
let magnetCurrentX = 0
let magnetCurrentY = 0
const MAGNET_RADIUS = 40
const MAGNET_STRENGTH = 0.35
const MAGNET_LERP = 0.12

// ─── Magnetic trigger effect ───

function onTriggerMouseMove(e: MouseEvent) {
  const el = triggerRef.value
  if (!el)
    return

  const rect = el.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const distX = e.clientX - centerX
  const distY = e.clientY - centerY
  const distance = Math.hypot(distX, distY)

  if (distance < MAGNET_RADIUS + rect.width / 2) {
    magnetTargetX = distX * MAGNET_STRENGTH
    magnetTargetY = distY * MAGNET_STRENGTH
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

  if (triggerRef.value) {
    triggerRef.value.style.transform = `translate(${magnetCurrentX}px, ${magnetCurrentY}px)`
  }

  magnetAnimId = requestAnimationFrame(animateMagnet)
}

// ─── Menu open/close ───

async function toggleMenu() {
  if (!gsapModule) {
    gsapModule = (await import('gsap')).default
  }

  if (isOpen.value) {
    closeMenu()
  }
  else {
    openMenu()
  }
}

function openMenu() {
  if (!gsapModule || !overlayRef.value)
    return

  isOpen.value = true
  document.body.style.overflow = 'hidden'

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReduced) {
    if (overlayRef.value) {
      overlayRef.value.style.clipPath = 'inset(0)'
      overlayRef.value.style.visibility = 'visible'
    }
    return
  }

  if (timeline) {
    timeline.kill()
  }

  timeline = gsapModule.timeline({ defaults: { ease: 'expo.inOut' } })

  timeline.set(overlayRef.value, { visibility: 'visible' })

  timeline.fromTo(
    overlayRef.value,
    { clipPath: 'inset(0 0 100% 0)' },
    { clipPath: 'inset(0 0 0% 0)', duration: 0.6 },
  )

  timeline.fromTo(
    itemRefs.value,
    { xPercent: 20, opacity: 0, filter: 'blur(8px)' },
    {
      xPercent: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.5,
      ease: 'expo.out',
      stagger: 0.08,
    },
    '-=0.25',
  )
}

function closeMenu() {
  if (!gsapModule || !overlayRef.value)
    return

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReduced) {
    isOpen.value = false
    document.body.style.overflow = ''
    if (overlayRef.value) {
      overlayRef.value.style.visibility = 'hidden'
      overlayRef.value.style.clipPath = 'inset(0 0 100% 0)'
    }
    return
  }

  if (timeline) {
    timeline.kill()
  }

  timeline = gsapModule.timeline({
    defaults: { ease: 'expo.inOut' },
    onComplete: () => {
      isOpen.value = false
      document.body.style.overflow = ''
    },
  })

  timeline.to(itemRefs.value, {
    xPercent: -20,
    opacity: 0,
    filter: 'blur(8px)',
    duration: 0.35,
    ease: 'expo.in',
    stagger: 0.04,
  })

  timeline.to(
    overlayRef.value,
    {
      clipPath: 'inset(100% 0 0 0)',
      duration: 0.5,
    },
    '-=0.15',
  )

  timeline.set(overlayRef.value, { visibility: 'hidden' })
}

// ─── Navigation ───

async function navigateToSection(target: string) {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  closeMenu()

  if (prefersReduced) {
    setTimeout(() => {
      const el = document.querySelector(target)
      if (el)
        scrollTo(el as HTMLElement, { duration: 2.0 })
    }, 0)
    return
  }

  if (!gsapModule)
    gsapModule = (await import('gsap')).default

  // Target the main content area for blur (not the nav itself)
  const mainContent = document.querySelector('.app') as HTMLElement
  if (!mainContent)
    return

  // Phase 1: Progressive blur-in while menu closes
  gsapModule.to(mainContent, {
    filter: 'blur(12px)',
    scale: 0.985,
    opacity: 0.6,
    duration: 0.45,
    ease: 'power3.in',
  })

  // Phase 2: Scroll to target after menu mostly closed
  setTimeout(() => {
    const el = document.querySelector(target)
    if (el)
      scrollTo(el as HTMLElement, { duration: 1.4 })

    // Phase 3: Unblur after scroll is underway — cinematic refocus
    setTimeout(() => {
      gsapModule!.to(mainContent, {
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
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReduced) {
    scrollTo(0, { duration: 2.0 })
    return
  }

  if (!gsapModule)
    gsapModule = (await import('gsap')).default

  const mainContent = document.querySelector('.app') as HTMLElement
  if (!mainContent) {
    scrollTo(0, { duration: 2.0 })
    return
  }

  // Blur-in → scroll → unblur
  gsapModule.to(mainContent, {
    filter: 'blur(12px)',
    scale: 0.985,
    opacity: 0.6,
    duration: 0.45,
    ease: 'power3.in',
  })

  setTimeout(() => {
    scrollTo(0, { duration: 1.4 })

    setTimeout(() => {
      gsapModule!.to(mainContent, {
        filter: 'blur(0px)',
        scale: 1,
        opacity: 1,
        duration: 0.7,
        ease: 'expo.out',
      })
    }, 900)
  }, 300)
}

// ─── Text scramble on hover ───

function onItemHover(e: MouseEvent) {
  const target = (e.currentTarget as HTMLElement)?.querySelector('.nav-menu__item-text')
  if (target) {
    scramble(target as HTMLElement)
  }
}

// ─── Keyboard handling ───

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    closeMenu()
  }
}

// ─── Lifecycle ───

onMounted(() => {
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  if (!isTouch) {
    animateMagnet()
  }

  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  cancelAnimationFrame(magnetAnimId)
  document.removeEventListener('keydown', onKeydown)

  if (timeline) {
    timeline.kill()
    timeline = null
  }

  // Ensure body scroll is restored
  if (isOpen.value) {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <!-- BM Logo — top-left, always visible -->
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
      width="32"
      height="32"
    >
  </a>

  <!-- MENU/CLOSE Trigger — top-right, always visible -->
  <button
    ref="triggerRef"
    class="nav-trigger"
    :class="{ 'nav-trigger--open': isOpen }"
    :aria-expanded="isOpen"
    aria-controls="nav-menu-overlay"
    aria-label="Toggle menu"
    data-cursor="link"
    @click="toggleMenu"
    @mousemove="onTriggerMouseMove"
    @mouseleave="onTriggerMouseLeave"
  >
    <span class="nav-trigger__text">{{ isOpen ? 'CLOSE' : 'MENU' }}</span>
  </button>

  <!-- Full-screen Menu Overlay -->
  <div
    id="nav-menu-overlay"
    ref="overlayRef"
    class="nav-menu"
    :class="{ 'nav-menu--open': isOpen }"
    role="dialog"
    :aria-hidden="!isOpen"
    aria-label="Navigation menu"
  >
    <nav class="nav-menu__inner" aria-label="Main navigation">
      <a
        v-for="(item, index) in MENU_ITEMS"
        :key="item.label"
        :ref="(el) => { if (el) itemRefs[index] = el as HTMLElement }"
        class="nav-menu__item"
        :href="item.target"
        :data-cursor-label="item.label"
        role="menuitem"
        :tabindex="isOpen ? 0 : -1"
        @click.prevent="navigateToSection(item.target)"
        @mouseenter="onItemHover"
      >
        <span class="nav-menu__item-index">{{ String(index + 1).padStart(2, '0') }}</span>
        <span class="nav-menu__item-text">{{ item.label }}</span>
      </a>
    </nav>

    <!-- Decorative bottom line -->
    <div class="nav-menu__footer">
      <span class="nav-menu__footer-text">Billy Maulana</span>
      <span class="nav-menu__footer-divider">/</span>
      <span class="nav-menu__footer-text">Frontend Architect</span>
    </div>
  </div>
</template>

<style scoped>
/* ═══ BM Logo — top-left fixed ═══ */
.nav-logo {
  position: fixed;
  top: clamp(1.5rem, 4vh, 2.5rem);
  left: var(--page-margin);
  z-index: var(--z-nav);
  mix-blend-mode: difference;
  display: flex;
  align-items: center;
  text-decoration: none;
}

.nav-logo__img {
  width: 32px;
  height: auto;
  display: block;
}

/* ═══ Menu Trigger — top-right fixed ═══ */
.nav-trigger {
  position: fixed;
  top: clamp(1.5rem, 4vh, 2.5rem);
  right: var(--page-margin);
  z-index: var(--z-nav);
  mix-blend-mode: difference;

  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border: none;
  background: none;
  cursor: pointer;
  will-change: transform;
}

.nav-trigger__text {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  font-variant: all-small-caps;
  letter-spacing: var(--tracking-wide);
  color: var(--text-primary);
  transition: opacity var(--duration-fast) var(--ease-out-expo);
  user-select: none;
}

.nav-trigger:hover .nav-trigger__text {
  opacity: 0.7;
}

/* ═══ Full-screen Menu Overlay ═══ */
.nav-menu {
  position: fixed;
  inset: 0;
  z-index: var(--z-menu);
  background: var(--bg-abyss);
  visibility: hidden;
  clip-path: inset(0 0 100% 0);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.nav-menu__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(1rem, 3vh, 2rem);
}

/* ═══ Menu Item ═══ */
.nav-menu__item {
  display: flex;
  align-items: baseline;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  text-decoration: none;
  color: var(--text-primary);
  will-change: transform, opacity, filter;
  opacity: 0;
}

.nav-menu__item-index {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  letter-spacing: var(--tracking-wide);
  color: var(--text-tertiary);
  transition: color var(--duration-fast) var(--ease-out-expo);
}

.nav-menu__item-text {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 700;
  letter-spacing: var(--tracking-tight);
  line-height: var(--leading-heading);
  text-transform: uppercase;
  transition: color var(--duration-fast) var(--ease-out-expo),
              letter-spacing var(--duration-normal) var(--ease-out-expo);
}

.nav-menu__item:hover .nav-menu__item-text {
  color: var(--accent-light);
  letter-spacing: 0.02em;
}

.nav-menu__item:hover .nav-menu__item-index {
  color: var(--accent-primary);
}

/* Focus visible for keyboard nav */
.nav-menu__item:focus-visible {
  outline: 2px solid var(--accent-primary);
  outline-offset: 8px;
}

/* ═══ Menu Footer (decorative) ═══ */
.nav-menu__footer {
  position: absolute;
  bottom: clamp(1.5rem, 4vh, 2.5rem);
  left: var(--page-margin);
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-menu__footer-text {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-tertiary);
}

.nav-menu__footer-divider {
  font-family: var(--font-mono);
  font-size: var(--text-micro);
  color: var(--text-disabled);
}

/* ═══ Reduced Motion ═══ */
@media (prefers-reduced-motion: reduce) {
  .nav-trigger {
    will-change: auto;
    transform: none !important;
  }

  .nav-trigger__text {
    transition: none;
  }

  .nav-menu__item-text {
    transition: none;
  }

  .nav-menu__item-index {
    transition: none;
  }
}

/* ═══ Mobile adjustments ═══ */
@media (max-width: 768px) {
  .nav-menu__item-text {
    font-size: clamp(2.5rem, 12vw, 5rem);
  }

  .nav-menu__footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .nav-menu__footer-divider {
    display: none;
  }
}
</style>
