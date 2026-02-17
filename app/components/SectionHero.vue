<script setup lang="ts">
import { profile } from '~/constants/profile'

const heroRef = ref<HTMLElement>()
const titleRef = ref<HTMLElement>()
const mouse = reactive({ x: 0, y: 0 })
const smoothMouse = reactive({ x: 0, y: 0 })
let rafId = 0

function lerp(a: number, b: number, n: number) {
  return a + (b - a) * n
}

function onMouseMove(e: MouseEvent) {
  if (!heroRef.value)
    return
  const rect = heroRef.value.getBoundingClientRect()
  mouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
  mouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
}

function animateMouse() {
  smoothMouse.x = lerp(smoothMouse.x, mouse.x, 0.06)
  smoothMouse.y = lerp(smoothMouse.y, mouse.y, 0.06)

  if (titleRef.value) {
    const offsetX = smoothMouse.x * 4
    const offsetY = smoothMouse.y * 4
    titleRef.value.style.setProperty('--chromatic-x', `${offsetX}px`)
    titleRef.value.style.setProperty('--chromatic-y', `${offsetY}px`)
  }

  rafId = requestAnimationFrame(animateMouse)
}

onMounted(async () => {
  rafId = requestAnimationFrame(animateMouse)

  const gsap = (await import('gsap')).default

  const tl = gsap.timeline({ delay: 0.3 })

  tl.from('.hero__char', {
    y: '110%',
    duration: 1.0,
    stagger: 0.04,
    ease: 'power3.out',
  })

  tl.from('.hero__meta', {
    y: -10,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
  }, '-=0.3')

  tl.from('.hero__scroll', {
    opacity: 0,
    y: -10,
    duration: 0.6,
    ease: 'power2.out',
  }, '-=0.2')
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
})

const firstName = 'BILLY'.split('')
const lastName = 'MAULANA'.split('')

const distortionLines = [
  { text: 'BILLY', indent: 0 },
  { text: 'MAULANA', indent: 60 },
]
</script>

<template>
  <section
    id="hero"
    ref="heroRef"
    class="hero"
    aria-label="Billy Maulana — Frontend Engineer"
    @mousemove="onMouseMove"
  >
    <UiFluidCanvas
      :start-delay="300"
      :initial-splats="5"
    />

    <div class="hero__ambient" />

    <div class="hero__meta">
      <span class="hero__meta-role">{{ profile.title }} — {{ profile.location }}</span>
      <span class="hero__meta-years">({{ String(profile.yearsExperience).padStart(2, '0') }})</span>
    </div>

    <div ref="titleRef" class="hero__content">
      <UiTextDistortion
        :lines="distortionLines"
        :start-delay="600"
        class="hero__distortion"
      />

      <div class="hero__title-accessible" aria-hidden="false">
        <div class="hero__title-wrap">
          <h1 class="hero__title hero__title--first" aria-label="Billy">
            <span
              v-for="(char, i) in firstName"
              :key="`first-${i}`"
              class="hero__char-wrap"
            >
              <span class="hero__char">{{ char }}</span>
            </span>
          </h1>
        </div>

        <div class="hero__title-wrap">
          <h1 class="hero__title hero__title--last" aria-label="Maulana">
            <span
              v-for="(char, i) in lastName"
              :key="`last-${i}`"
              class="hero__char-wrap"
            >
              <span class="hero__char">{{ char }}</span>
            </span>
          </h1>
        </div>
      </div>
    </div>

    <div class="hero__scroll">
      <span class="hero__scroll-label">Scroll</span>
      <div class="hero__scroll-line" />
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  align-items: center;
  overflow: hidden;
  background-color: var(--color-bg);
}

.hero__ambient {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0, 71, 255, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 60% 80% at 30% 60%, rgba(0, 245, 255, 0.04) 0%, transparent 60%);
  pointer-events: none;
  z-index: 2;
}

.hero__meta {
  position: absolute;
  top: clamp(1.5rem, 3vh, 2.5rem);
  left: var(--page-margin);
  right: var(--page-margin);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: var(--z-content, 10);
}

.hero__meta-role {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-secondary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.hero__meta-years {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-tertiary);
  letter-spacing: 0.1em;
  font-variant-numeric: tabular-nums;
}

.hero__content {
  --chromatic-x: 0px;
  --chromatic-y: 0px;
  position: relative;
  z-index: var(--z-content, 10);
  width: 100%;
  padding-left: var(--page-margin);
  padding-right: var(--page-margin);
}

.hero__distortion {
  position: relative;
  z-index: 2;
}

.hero__title-accessible {
  position: relative;
  z-index: 1;
}

.hero__distortion:deep(.text-distortion--ready) ~ .hero__title-accessible {
  opacity: 0;
  pointer-events: none;
  position: absolute;
  inset: 0;
}

.hero__title-wrap {
  overflow: hidden;
  line-height: 1;
}

.hero__title {
  font-size: var(--text-display);
  font-weight: 900;
  line-height: 0.84;
  letter-spacing: -0.04em;
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  text-shadow:
    var(--chromatic-x) var(--chromatic-y) 0 rgba(255, 51, 51, 0.25),
    calc(var(--chromatic-x) * -1) calc(var(--chromatic-y) * -1) 0 rgba(0, 71, 255, 0.3);
}

.hero__title--last {
  padding-left: clamp(1rem, 5vw, 6rem);
}

.hero__char-wrap {
  display: inline-block;
  overflow: hidden;
}

.hero__char {
  display: inline-block;
  will-change: transform;
}

.hero__scroll {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  z-index: var(--z-content, 10);
}

.hero__scroll-label {
  font-size: var(--text-caption);
  font-weight: 500;
  color: var(--color-text-tertiary);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hero__scroll-line {
  width: 1px;
  height: 48px;
  background: linear-gradient(to bottom, var(--color-text-tertiary), transparent);
  animation: scrollPulse 2.5s ease-in-out infinite;
}

@keyframes scrollPulse {
  0%, 100% {
    opacity: 1;
    transform: scaleY(1);
  }
  50% {
    opacity: 0.2;
    transform: scaleY(0.5);
  }
}

@media (max-width: 768px) {
  .hero__title--last {
    padding-left: 0.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__scroll-line {
    animation: none;
    opacity: 0.5;
  }
}
</style>
