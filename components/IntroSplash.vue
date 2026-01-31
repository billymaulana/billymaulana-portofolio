<script setup lang="ts">
const emit = defineEmits<{
  complete: []
}>()

const containerRef = ref<HTMLElement | null>(null)
const counterRef = ref<HTMLElement | null>(null)
const nameRef = ref<HTMLElement | null>(null)
const roleRef = ref<HTMLElement | null>(null)
const lineRef = ref<HTMLElement | null>(null)
const yearRef = ref<HTMLElement | null>(null)

const counter = ref(0)
const isRevealing = ref(false)

onMounted(async () => {
  if (!containerRef.value)
    return

  const { gsap } = await import('gsap')

  const masterTl = gsap.timeline({
    onComplete: () => {
      emit('complete')
    },
  })

  // Phase 1: Counter animation (0 to 100)
  masterTl.to(counter, {
    value: 100,
    duration: 2,
    ease: 'power2.inOut',
    snap: { value: 1 },
    onUpdate: () => {
      if (counterRef.value) {
        counterRef.value.textContent = String(Math.floor(counter.value)).padStart(3, '0')
      }
    },
  })

  // Phase 2: Counter fades and scales
  masterTl.to(counterRef.value, {
    scale: 0.5,
    opacity: 0,
    duration: 0.5,
    ease: 'power3.in',
  })

  // Phase 3: Reveal name
  masterTl.add(() => {
    isRevealing.value = true
  })

  masterTl.fromTo(
    nameRef.value,
    {
      opacity: 0,
      y: 100,
      clipPath: 'inset(100% 0 0 0)',
    },
    {
      opacity: 1,
      y: 0,
      clipPath: 'inset(0% 0 0 0)',
      duration: 1.2,
      ease: 'power4.out',
    },
    '-=0.2',
  )

  // Animate each letter with stagger
  if (nameRef.value) {
    const letters = nameRef.value.querySelectorAll('.char')
    masterTl.fromTo(
      letters,
      {
        y: 120,
        opacity: 0,
        rotateX: -90,
      },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.03,
        ease: 'back.out(1.7)',
      },
      '-=0.8',
    )
  }

  // Phase 4: Role text slides in
  masterTl.fromTo(
    roleRef.value,
    {
      opacity: 0,
      x: -50,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      ease: 'power3.out',
    },
    '-=0.3',
  )

  // Line expands
  masterTl.fromTo(
    lineRef.value,
    {
      scaleX: 0,
      transformOrigin: 'left center',
    },
    {
      scaleX: 1,
      duration: 0.8,
      ease: 'power3.out',
    },
    '-=0.4',
  )

  // Year fades in
  masterTl.fromTo(
    yearRef.value,
    {
      opacity: 0,
      y: 20,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.5,
      ease: 'power3.out',
    },
    '-=0.3',
  )

  // Phase 5: Hold then exit
  masterTl.to({}, { duration: 1 })

  // Exit animation
  masterTl.to(containerRef.value, {
    clipPath: 'inset(0 0 100% 0)',
    duration: 1,
    ease: 'power4.inOut',
  })
})

function splitText(text: string): string[] {
  return text.split('')
}
</script>

<template>
  <div
    ref="containerRef"
    class="intro-splash"
  >
    <!-- Counter Phase -->
    <div
      ref="counterRef"
      class="counter"
      :class="{ hidden: isRevealing }"
    >
      000
    </div>

    <!-- Main Reveal -->
    <div
      class="reveal-content"
      :class="{ visible: isRevealing }"
    >
      <!-- Decorative Elements -->
      <div class="decor decor-tl" />
      <div class="decor decor-br" />

      <!-- Role -->
      <div ref="roleRef" class="role">
        <span class="role-line" />
        <span class="role-text">FRONTEND DEVELOPER</span>
      </div>

      <!-- Main Name -->
      <h1 ref="nameRef" class="name">
        <span class="name-line">
          <span
            v-for="(char, i) in splitText('BILLY')"
            :key="`b-${i}`"
            class="char"
          >{{ char }}</span>
        </span>
        <span class="name-line">
          <span
            v-for="(char, i) in splitText('MAULANA')"
            :key="`m-${i}`"
            class="char"
          >{{ char }}</span>
        </span>
      </h1>

      <!-- Bottom Line -->
      <div ref="lineRef" class="bottom-line" />

      <!-- Year -->
      <div ref="yearRef" class="year">
        <span class="year-label">PORTFOLIO</span>
        <span class="year-number">© 2026</span>
      </div>
    </div>

    <!-- Noise Overlay -->
    <div class="noise" />
  </div>
</template>

<style scoped>
.intro-splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

/* Counter */
.counter {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(8rem, 20vw, 16rem);
  font-weight: 700;
  color: #fff;
  letter-spacing: -0.05em;
  transition: opacity 0.3s ease;
}

.counter.hidden {
  pointer-events: none;
}

/* Reveal Content */
.reveal-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  opacity: 0;
  pointer-events: none;
}

.reveal-content.visible {
  opacity: 1;
  pointer-events: auto;
}

/* Decorative Elements */
.decor {
  position: absolute;
  width: 100px;
  height: 100px;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.decor-tl {
  top: 2rem;
  left: 2rem;
  border-right: none;
  border-bottom: none;
}

.decor-br {
  bottom: 2rem;
  right: 2rem;
  border-left: none;
  border-top: none;
}

/* Role */
.role {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.role-line {
  width: 40px;
  height: 1px;
  background: #fff;
}

.role-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.625rem, 1.5vw, 0.875rem);
  color: rgba(255, 255, 255, 0.6);
  letter-spacing: 0.3em;
}

/* Name */
.name {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 0.85;
  perspective: 1000px;
}

.name-line {
  display: flex;
  overflow: hidden;
}

.char {
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: clamp(4rem, 15vw, 14rem);
  font-weight: 900;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: -0.03em;
  transform-style: preserve-3d;
}

.name-line:nth-child(2) .char {
  color: transparent;
  -webkit-text-stroke: 2px #fff;
  text-stroke: 2px #fff;
}

/* Bottom Line */
.bottom-line {
  width: min(80%, 600px);
  height: 2px;
  background: linear-gradient(90deg, transparent, #fff, transparent);
  margin-top: 2rem;
}

/* Year */
.year {
  display: flex;
  justify-content: space-between;
  width: min(80%, 600px);
  margin-top: 1rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.625rem, 1vw, 0.75rem);
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.2em;
}

/* Noise */
.noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
}

/* Mobile Adjustments */
@media (max-width: 768px) {
  .decor {
    width: 50px;
    height: 50px;
  }

  .name-line:nth-child(2) .char {
    -webkit-text-stroke-width: 1px;
  }
}
</style>
