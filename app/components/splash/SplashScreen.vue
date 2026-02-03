<script setup lang="ts">
const emit = defineEmits<{
  complete: []
}>()

const splashRef = ref<HTMLElement | null>(null)
const videoRef = ref<HTMLVideoElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)

const isVisible = ref(true)
const progress = ref(0)

onMounted(async () => {
  const { gsap } = await import('gsap')

  // Start video
  if (videoRef.value) {
    videoRef.value.play()
  }

  // Animate progress bar and text
  const tl = gsap.timeline()

  // Text entrance - character by character
  if (textRef.value) {
    const chars = textRef.value.querySelectorAll('.splash-char')
    tl.fromTo(chars, { y: 100, opacity: 0, rotateX: -90 }, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      duration: 0.8,
      stagger: 0.05,
      ease: 'power3.out',
    })
  }

  // Progress bar animation
  tl.to(progress, {
    value: 100,
    duration: 2.5,
    ease: 'power2.inOut',
    onUpdate: () => {
      if (progressRef.value) {
        progressRef.value.style.width = `${progress.value}%`
      }
    },
  }, '-=0.5')

  // Exit animation
  tl.to(splashRef.value, {
    clipPath: 'circle(0% at 50% 50%)',
    duration: 1.2,
    ease: 'power4.inOut',
    onComplete: () => {
      isVisible.value = false
      emit('complete')
    },
  }, '+=0.3')

  // Text exit before clip
  if (textRef.value) {
    const chars = textRef.value.querySelectorAll('.splash-char')
    tl.to(chars, {
      y: -50,
      opacity: 0,
      rotateX: 90,
      duration: 0.5,
      stagger: 0.02,
      ease: 'power2.in',
    }, '-=1.5')
  }
})

const name = 'Billy Maulana'.split('')
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      ref="splashRef"
      class="splash"
    >
      <!-- Background Video (Spiral) -->
      <video
        ref="videoRef"
        class="splash-video"
        src="/videos/spiral.mp4"
        muted
        playsinline
        loop
      />

      <!-- Overlay -->
      <div class="splash-overlay" />

      <!-- Content -->
      <div class="splash-content">
        <!-- Name with character animation -->
        <h1 ref="textRef" class="splash-name">
          <span
            v-for="(char, i) in name"
            :key="i"
            class="splash-char"
            :class="{ 'splash-space': char === ' ' }"
          >
            {{ char === ' ' ? '&nbsp;' : char }}
          </span>
        </h1>

        <!-- Progress Bar -->
        <div class="splash-progress">
          <div ref="progressRef" class="splash-progress-bar" />
        </div>

        <!-- Loading Text -->
        <span class="splash-loading">Loading Experience...</span>
      </div>

      <!-- Corner Decorations -->
      <div class="splash-corner splash-corner-tl" />
      <div class="splash-corner splash-corner-br" />
    </div>
  </Teleport>
</template>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  clip-path: circle(150% at 50% 50%);
}

.splash-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.15;
  filter: grayscale(100%) contrast(1.2);
}

.splash-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 0%, #000 70%);
}

.splash-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}

.splash-name {
  font-family: 'Satoshi', sans-serif;
  font-size: clamp(40px, 10vw, 120px);
  font-weight: 900;
  text-transform: lowercase;
  letter-spacing: -0.03em;
  color: #fff;
  margin: 0;
  perspective: 1000px;
  display: flex;
}

.splash-char {
  display: inline-block;
  transform-style: preserve-3d;
}

.splash-space {
  width: 0.3em;
}

.splash-progress {
  width: 200px;
  height: 2px;
  background: #1A1A1A;
  overflow: hidden;
}

.splash-progress-bar {
  height: 100%;
  width: 0;
  background: #00F5FF;
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.5);
}

.splash-loading {
  font-family: 'Satoshi', sans-serif;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #555;
}

/* Corner decorations */
.splash-corner {
  position: absolute;
  width: 60px;
  height: 60px;
  border-color: #00F5FF;
  border-style: solid;
  border-width: 0;
  opacity: 0.3;
}

.splash-corner-tl {
  top: 40px;
  left: 40px;
  border-top-width: 1px;
  border-left-width: 1px;
}

.splash-corner-br {
  bottom: 40px;
  right: 40px;
  border-bottom-width: 1px;
  border-right-width: 1px;
}

@media (max-width: 768px) {
  .splash-corner {
    width: 40px;
    height: 40px;
  }

  .splash-corner-tl {
    top: 20px;
    left: 20px;
  }

  .splash-corner-br {
    bottom: 20px;
    right: 20px;
  }
}
</style>
