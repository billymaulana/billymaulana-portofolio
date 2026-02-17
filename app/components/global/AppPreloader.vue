<script setup lang="ts">
const emit = defineEmits<{
  complete: []
}>()

const progress = ref(0)
const isExiting = ref(false)
const isComplete = ref(false)

onMounted(async () => {
  const gsap = (await import('gsap')).default

  // Animate counter
  const obj = { val: 0 }
  gsap.to(obj, {
    val: 100,
    duration: 2.2,
    ease: 'power2.inOut',
    onUpdate: () => {
      progress.value = Math.round(obj.val)
    },
    onComplete: () => {
      setTimeout(() => {
        isExiting.value = true
        setTimeout(() => {
          isComplete.value = true
          emit('complete')
        }, 800)
      }, 300)
    },
  })
})
</script>

<template>
  <Transition name="preloader">
    <div v-if="!isComplete" class="preloader" :class="{ exiting: isExiting }">
      <!-- Logo -->
      <div class="preloader__logo">
        <svg viewBox="0 0 60 60" class="preloader__logo-svg">
          <text x="50%" y="55%" text-anchor="middle" dominant-baseline="central" class="preloader__logo-text">
            BM
          </text>
          <rect x="1" y="1" width="58" height="58" rx="8" class="preloader__logo-border" />
        </svg>
      </div>

      <!-- Counter -->
      <div class="preloader__counter">
        {{ String(progress).padStart(3, '0') }}
      </div>

      <!-- Progress Bar -->
      <div class="preloader__bar">
        <div class="preloader__bar-fill" :style="{ width: `${progress}%` }" />
      </div>

      <!-- Curtains -->
      <div class="preloader__curtain preloader__curtain--left" />
      <div class="preloader__curtain preloader__curtain--right" />
    </div>
  </Transition>
</template>

<style scoped>
.preloader {
  position: fixed;
  inset: 0;
  z-index: var(--z-preloader);
  background: var(--color-bg-primary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

.preloader__logo {
  opacity: 0;
  animation: logoFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
}

.preloader__logo-svg {
  width: 60px;
  height: 60px;
}

.preloader__logo-text {
  fill: var(--color-text-primary);
  font-family: 'Satoshi', sans-serif;
  font-weight: 900;
  font-size: 22px;
}

.preloader__logo-border {
  fill: none;
  stroke: var(--color-accent);
  stroke-width: 1.5;
  stroke-dasharray: 232;
  stroke-dashoffset: 232;
  animation: drawBorder 2s cubic-bezier(0.16, 1, 0.3, 1) 0.4s forwards;
}

.preloader__counter {
  font-size: clamp(3rem, 8vw, 6rem);
  font-weight: 900;
  font-variant-numeric: tabular-nums;
  color: var(--color-text-primary);
  letter-spacing: -0.04em;
  opacity: 0;
  animation: logoFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
}

.preloader__bar {
  width: min(300px, 60vw);
  height: 2px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  opacity: 0;
  animation: logoFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.7s forwards;
}

.preloader__bar-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: var(--radius-full);
  transition: width 0.1s linear;
}

/* Curtain split exit */
.preloader__curtain {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  background: var(--color-bg-primary);
  z-index: 1;
  transition: transform 0.8s cubic-bezier(0.76, 0, 0.24, 1);
}

.preloader__curtain--left {
  left: 0;
}

.preloader__curtain--right {
  right: 0;
}

.preloader.exiting .preloader__curtain--left {
  transform: translateX(-100%);
}

.preloader.exiting .preloader__curtain--right {
  transform: translateX(100%);
}

.preloader.exiting .preloader__logo,
.preloader.exiting .preloader__counter,
.preloader.exiting .preloader__bar {
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.4s cubic-bezier(0.76, 0, 0.24, 1);
}

@keyframes logoFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes drawBorder {
  to {
    stroke-dashoffset: 0;
  }
}

.preloader-leave-active {
  transition: opacity 0.3s ease;
}

.preloader-leave-to {
  opacity: 0;
}
</style>
