<script setup lang="ts">
const emit = defineEmits<{
  complete: []
}>()

const containerRef = ref<HTMLElement | null>(null)
const textRef = ref<HTMLElement | null>(null)
const thermalTextRef = ref<HTMLElement | null>(null)

// Thermal color palette from the tutorial
const thermalColors = [
  '#000000',
  '#214F89',
  '#4A8497',
  '#E5504C',
  '#EF7E01',
  '#F9BA3B',
  '#FDEBD1',
  '#FFFFFF',
]

const turbulenceRef = ref<SVGFETurbulenceElement | null>(null)
const displacementRef = ref<SVGFEDisplacementMapElement | null>(null)

onMounted(async () => {
  if (!containerRef.value || !textRef.value)
    return

  const { gsap } = await import('gsap')

  const mainText = textRef.value
  const thermalText = thermalTextRef.value
  const turbulence = turbulenceRef.value
  const displacement = displacementRef.value

  // Initial state
  gsap.set(mainText, {
    opacity: 0,
    filter: 'blur(30px)',
  })
  gsap.set(thermalText, {
    opacity: 1,
  })

  const master = gsap.timeline({
    onComplete: () => emit('complete'),
  })

  // Phase 1: Animate turbulence evolution (creates the thermal shimmer)
  if (turbulence) {
    master.fromTo(
      { seed: 0 },
      { seed: 100 },
      {
        duration: 3,
        ease: 'none',
        onUpdate() {
          // Animate baseFrequency for organic movement
          const progress = this.progress()
          const freq = 0.008 + Math.sin(progress * Math.PI * 4) * 0.004
          turbulence.setAttribute('baseFrequency', `${freq}`)
          turbulence.setAttribute('seed', String(Math.floor(this.targets()[0].seed)))
        },
      },
    )
  }

  // Phase 2: Reduce displacement scale (distortion settles)
  if (displacement) {
    master.to(
      { scale: 80 },
      {
        scale: 0,
        duration: 2.5,
        ease: 'power2.out',
        onUpdate() {
          displacement.setAttribute('scale', String(this.targets()[0].scale))
        },
      },
      0,
    )
  }

  // Phase 3: Fade in main text, reduce blur
  master.to(
    mainText,
    {
      opacity: 1,
      filter: 'blur(0px)',
      duration: 2.5,
      ease: 'power2.out',
    },
    0.5,
  )

  // Phase 4: Fade out thermal overlay
  master.to(
    thermalText,
    {
      opacity: 0,
      duration: 2,
      ease: 'power2.in',
    },
    1.5,
  )

  // Hold
  master.to({}, { duration: 1 })

  // Exit: Quick blur out and slide
  master.to(textRef.value, {
    filter: 'blur(12px)',
    opacity: 0,
    y: -40,
    duration: 0.6,
    ease: 'power3.in',
  })

  master.to(
    containerRef.value,
    {
      opacity: 0,
      duration: 0.4,
    },
    '-=0.3',
  )
})

// Generate thermal gradient CSS
const thermalGradient = computed(() => {
  const stops = thermalColors.map((color, i) => {
    const percent = (i / (thermalColors.length - 1)) * 100
    return `${color} ${percent}%`
  }).join(', ')
  return `linear-gradient(180deg, ${stops})`
})
</script>

<template>
  <div ref="containerRef" class="splash">
    <!-- SVG Filters for displacement effect -->
    <svg class="filters" aria-hidden="true">
      <defs>
        <!-- Thermal displacement filter -->
        <filter id="thermal-displacement" x="-50%" y="-50%" width="200%" height="200%">
          <feTurbulence
            ref="turbulenceRef"
            type="fractalNoise"
            base-frequency="0.008"
            num-octaves="3"
            seed="0"
            result="noise"
          />
          <feDisplacementMap
            ref="displacementRef"
            in="SourceGraphic"
            in2="noise"
            scale="80"
            x-channel-selector="R"
            y-channel-selector="G"
          />
        </filter>

        <!-- Glow filter -->
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>

    <!-- Background with subtle thermal gradient -->
    <div class="bg" />

    <!-- Main text (reveals from blur) -->
    <div ref="textRef" class="text-container">
      <h1 class="text main-text">
        BILLY
      </h1>
      <p class="subtext">
        MAULANA
      </p>
    </div>

    <!-- Thermal text overlay (with displacement + gradient) -->
    <div ref="thermalTextRef" class="text-container thermal-layer">
      <h1 class="text thermal-text" :style="{ backgroundImage: thermalGradient }">
        BILLY
      </h1>
    </div>

    <!-- Noise grain -->
    <div class="noise" />
  </div>
</template>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.filters {
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
}

.bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, #0a0a12 0%, #000 100%);
}

.text-container {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.text {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: clamp(4rem, 15vw, 10rem);
  font-weight: 800;
  letter-spacing: 0.02em;
  line-height: 1;
  margin: 0;
  text-transform: uppercase;
}

.main-text {
  color: #fff;
}

.subtext {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: clamp(0.8rem, 2.5vw, 1.2rem);
  font-weight: 400;
  letter-spacing: 0.5em;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
  text-transform: uppercase;
}

/* Thermal overlay layer */
.thermal-layer {
  filter: url(#thermal-displacement) url(#glow);
  mix-blend-mode: screen;
  pointer-events: none;
}

.thermal-text {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: blur(2px);
}

/* Noise overlay */
.noise {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* Responsive */
@media (max-width: 640px) {
  .text {
    font-size: clamp(2.5rem, 18vw, 5rem);
  }

  .subtext {
    font-size: clamp(0.6rem, 3vw, 0.9rem);
    letter-spacing: 0.4em;
  }
}
</style>
