<script setup lang="ts">
const emit = defineEmits<{
  complete: []
}>()

const containerRef = ref<HTMLElement | null>(null)
const progressRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const linesRef = ref<HTMLElement | null>(null)
const progress = ref(0)
const glitchText = ref('LOADING')

const scrambleChars = '!<>-_\\/[]{}=+*^?#'

function randomGlitch() {
  const texts = ['LOADING', 'BILLY', 'MAULANA', 'DEV', 'CODE', 'CREATE']
  const randomText = texts[Math.floor(Math.random() * texts.length)]

  let iteration = 0
  const interval = setInterval(() => {
    glitchText.value = randomText
      .split('')
      .map((char, index) => {
        if (index < iteration) {
          return randomText[index]
        }
        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)]
      })
      .join('')

    iteration += 1 / 3

    if (iteration >= randomText.length) {
      clearInterval(interval)
      glitchText.value = randomText
    }
  }, 30)
}

onMounted(async () => {
  const { gsap } = await import('gsap')

  // Random glitch text effect
  const glitchInterval = setInterval(randomGlitch, 500)

  const tl = gsap.timeline({
    onComplete: () => {
      clearInterval(glitchInterval)
      emit('complete')
    },
  })

  // Animate scan lines
  if (linesRef.value) {
    const lines = linesRef.value.querySelectorAll('.scan-line')
    gsap.to(lines, {
      opacity: 0.3,
      stagger: {
        each: 0.1,
        repeat: -1,
        yoyo: true,
      },
      duration: 0.2,
    })
  }

  // Main progress animation
  tl.to(progress, {
    value: 100,
    duration: 2.5,
    ease: 'power1.inOut',
    onUpdate: () => {
      if (progressRef.value) {
        progressRef.value.style.width = `${progress.value}%`
      }
    },
  })
    .to(textRef.value, {
      opacity: 0,
      scale: 0.9,
      filter: 'blur(20px)',
      duration: 0.5,
      ease: 'power2.in',
    }, '-=0.3')
    .to(containerRef.value, {
      clipPath: 'inset(50% 0 50% 0)',
      duration: 0.8,
      ease: 'power4.inOut',
    })
    .to(containerRef.value, {
      opacity: 0,
      duration: 0.3,
    })
})
</script>

<template>
  <div
    ref="containerRef"
    class="fixed inset-0 z-[100] bg-surface flex flex-col items-center justify-center overflow-hidden"
    style="clip-path: inset(0 0 0 0)"
  >
    <!-- Scan lines effect -->
    <div ref="linesRef" class="absolute inset-0 pointer-events-none">
      <div v-for="i in 20" :key="i" class="scan-line absolute w-full h-px bg-primary/10" :style="{ top: `${i * 5}%` }" />
    </div>

    <!-- Grid background -->
    <div class="absolute inset-0 grid-bg opacity-30" />

    <!-- Abstract shapes -->
    <div class="absolute top-1/4 left-1/4 w-32 h-32 border border-primary/20 rotate-45 animate-pulse" />
    <div class="absolute bottom-1/4 right-1/4 w-24 h-24 border border-secondary/20 -rotate-12" />
    <div class="absolute top-1/3 right-1/3 w-16 h-16 bg-accent/5 rounded-full" />

    <!-- Main content -->
    <div ref="textRef" class="text-center relative z-10">
      <!-- Logo -->
      <Logo size="lg" :animated="true" :glitch="true" class="mb-8 mx-auto" />

      <!-- Glitch text -->
      <div class="relative mb-4 overflow-hidden">
        <h1 class="font-accent text-5xl md:text-7xl text-primary glitch" :data-text="glitchText">
          {{ glitchText }}
        </h1>
      </div>

      <!-- Subtitle with typing effect -->
      <p class="font-mono text-sm text-text-muted uppercase tracking-[0.3em] mb-12">
        <span class="text-secondary">&lt;</span>
        Creative Developer
        <span class="text-secondary">/&gt;</span>
      </p>

      <!-- Progress bar -->
      <div class="w-80 md:w-96 mx-auto">
        <div class="relative">
          <!-- Progress track -->
          <div class="h-px bg-text-dim/20 relative overflow-hidden">
            <div
              ref="progressRef"
              class="h-full bg-gradient-to-r from-primary via-secondary to-accent relative"
              style="width: 0%"
            >
              <!-- Glow effect -->
              <div class="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-accent rounded-full blur-md" />
            </div>
          </div>

          <!-- Progress markers -->
          <div class="flex justify-between mt-2">
            <span class="font-mono text-xs text-text-dim">00</span>
            <span class="font-mono text-xs text-primary">{{ Math.round(progress).toString().padStart(2, '0') }}</span>
            <span class="font-mono text-xs text-text-dim">100</span>
          </div>
        </div>
      </div>

      <!-- Loading indicator -->
      <div class="mt-8 flex items-center justify-center gap-2">
        <div class="w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div class="w-2 h-2 bg-secondary rounded-full animate-pulse" style="animation-delay: 0.2s" />
        <div class="w-2 h-2 bg-accent rounded-full animate-pulse" style="animation-delay: 0.4s" />
      </div>
    </div>

    <!-- Corner decorations -->
    <div class="absolute top-8 left-8 flex flex-col gap-1">
      <div class="w-8 h-px bg-primary" />
      <div class="w-4 h-px bg-primary/50" />
    </div>
    <div class="absolute top-8 right-8 flex flex-col gap-1 items-end">
      <div class="w-8 h-px bg-secondary" />
      <div class="w-4 h-px bg-secondary/50" />
    </div>
    <div class="absolute bottom-8 left-8 flex flex-col gap-1">
      <div class="w-4 h-px bg-accent/50" />
      <div class="w-8 h-px bg-accent" />
    </div>
    <div class="absolute bottom-8 right-8 flex flex-col gap-1 items-end">
      <div class="w-4 h-px bg-primary/50" />
      <div class="w-8 h-px bg-primary" />
    </div>

    <!-- Noise overlay -->
    <div class="noise-bg" />
  </div>
</template>

<style scoped>
.glitch {
  position: relative;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.glitch::before {
  animation: glitch-1 0.3s infinite linear alternate-reverse;
  color: #FF0040;
  clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
  transform: translate(-2px);
  opacity: 0.8;
}

.glitch::after {
  animation: glitch-2 0.3s infinite linear alternate-reverse;
  color: #00FFFF;
  clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
  transform: translate(2px);
  opacity: 0.8;
}

@keyframes glitch-1 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-3px, 2px); }
  40% { transform: translate(-3px, -2px); }
  60% { transform: translate(3px, 2px); }
  80% { transform: translate(3px, -2px); }
}

@keyframes glitch-2 {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(3px, -2px); }
  40% { transform: translate(3px, 2px); }
  60% { transform: translate(-3px, -2px); }
  80% { transform: translate(-3px, 2px); }
}
</style>
