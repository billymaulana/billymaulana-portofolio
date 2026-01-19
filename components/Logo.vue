<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  animated?: boolean
  glitch?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  animated: true,
  glitch: true,
})

const logoRef = ref<HTMLElement | null>(null)
const isHovered = ref(false)

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
}

const pixelSize = computed(() => sizeMap[props.size])

onMounted(async () => {
  if (!props.animated || !logoRef.value)
    return

  try {
    const { gsap } = await import('gsap')

    // Initial reveal animation
    gsap.fromTo(
      logoRef.value,
      { scale: 0, rotation: -180, opacity: 0 },
      { scale: 1, rotation: 0, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.5)', delay: 0.2 },
    )

    // Animate paths
    gsap.fromTo(
      logoRef.value.querySelectorAll('.logo-path'),
      { strokeDashoffset: 300, opacity: 0 },
      {
        strokeDashoffset: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.5,
      },
    )

    // Rotating ring
    gsap.to(logoRef.value.querySelector('.rotating-ring'), {
      rotation: 360,
      duration: 20,
      repeat: -1,
      ease: 'none',
      transformOrigin: '50% 50%',
    })
  }
  catch (error) {
    console.warn('Logo animation failed:', error)
  }
})
</script>

<template>
  <div
    ref="logoRef"
    class="logo-container relative"
    :style="{ width: `${pixelSize}px`, height: `${pixelSize}px` }"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- Glow effect -->
    <div
      class="absolute inset-0 rounded-full transition-opacity duration-500"
      :class="isHovered ? 'opacity-100' : 'opacity-0'"
      :style="{
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, transparent 70%)',
        filter: 'blur(10px)',
        transform: 'scale(1.5)',
      }"
    />

    <svg
      :width="pixelSize"
      :height="pixelSize"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="logo-svg relative z-10"
      :class="{ 'is-hovered': isHovered, 'glitch-active': glitch && isHovered }"
    >
      <defs>
        <!-- Main gradient -->
        <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#A855F7" />
          <stop offset="50%" stop-color="#FF2D92" />
          <stop offset="100%" stop-color="#00F0FF" />
        </linearGradient>

        <!-- Animated gradient -->
        <linearGradient id="animatedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#A855F7">
            <animate attributeName="stop-color" values="#A855F7;#FF2D92;#00F0FF;#A855F7" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stop-color="#00F0FF">
            <animate attributeName="stop-color" values="#00F0FF;#A855F7;#FF2D92;#00F0FF" dur="2s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>

      <!-- Outer rotating ring -->
      <circle
        class="rotating-ring"
        cx="50"
        cy="50"
        r="47"
        stroke="url(#animatedGradient)"
        stroke-width="1"
        stroke-dasharray="8 4"
        fill="none"
        opacity="0.6"
      />

      <!-- Main border -->
      <rect
        class="logo-border transition-all duration-300"
        x="8"
        y="8"
        width="84"
        height="84"
        :stroke="isHovered ? 'url(#purpleGradient)' : '#A855F7'"
        stroke-width="2"
        fill="none"
      />

      <!-- Inner frame -->
      <rect
        class="transition-all duration-300"
        x="14"
        y="14"
        width="72"
        height="72"
        stroke="#A855F7"
        stroke-width="0.5"
        fill="none"
        opacity="0.3"
      />

      <!-- B Letter -->
      <g class="logo-letter-b">
        <path
          class="logo-path"
          d="M25 22 L25 78"
          stroke="#A855F7"
          stroke-width="5"
          fill="none"
          stroke-linecap="square"
          stroke-dasharray="300"
        />
        <path
          class="logo-path"
          d="M25 22 L45 22 C55 22 60 28 60 36 C60 44 55 48 45 48 L25 48"
          stroke="#A855F7"
          stroke-width="5"
          fill="none"
          stroke-linecap="square"
          stroke-linejoin="round"
          stroke-dasharray="300"
        />
        <path
          class="logo-path"
          d="M25 48 L48 48 C60 48 65 54 65 64 C65 74 58 78 45 78 L25 78"
          stroke="#A855F7"
          stroke-width="5"
          fill="none"
          stroke-linecap="square"
          stroke-linejoin="round"
          stroke-dasharray="300"
        />
      </g>

      <!-- M Letter (overlapping) -->
      <g class="logo-letter-m">
        <path
          class="logo-path"
          d="M50 78 L50 45 L62 60 L74 45 L74 78"
          stroke="#FF2D92"
          stroke-width="4"
          fill="none"
          stroke-linecap="square"
          stroke-linejoin="miter"
          stroke-dasharray="300"
        />
      </g>

      <!-- Decorative elements -->
      <circle cx="82" cy="22" r="4" fill="#00F0FF" class="transition-all duration-300" :class="{ 'animate-pulse': isHovered }" />
      <rect x="12" y="12" width="8" height="8" fill="none" stroke="#FF2D92" stroke-width="1" :transform="isHovered ? 'rotate(45 16 16)' : ''" class="transition-all duration-500" />

      <!-- Corner brackets -->
      <path d="M5 5 L15 5 M5 5 L5 15" stroke="#A855F7" stroke-width="1.5" fill="none" />
      <path d="M95 5 L85 5 M95 5 L95 15" stroke="#FF2D92" stroke-width="1.5" fill="none" />
      <path d="M5 95 L15 95 M5 95 L5 85" stroke="#00F0FF" stroke-width="1.5" fill="none" />
      <path d="M95 95 L85 95 M95 95 L95 85" stroke="#A855F7" stroke-width="1.5" fill="none" />
    </svg>

    <!-- RGB Glitch layers -->
    <svg
      v-if="glitch && isHovered"
      :width="pixelSize"
      :height="pixelSize"
      viewBox="0 0 100 100"
      class="absolute inset-0 z-0 glitch-red"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#FF0040" stroke-width="5" fill="none" opacity="0.5">
        <path d="M25 22 L25 78" />
        <path d="M25 22 L45 22 C55 22 60 28 60 36 C60 44 55 48 45 48 L25 48" />
        <path d="M25 48 L48 48 C60 48 65 54 65 64 C65 74 58 78 45 78 L25 78" />
      </g>
    </svg>
    <svg
      v-if="glitch && isHovered"
      :width="pixelSize"
      :height="pixelSize"
      viewBox="0 0 100 100"
      class="absolute inset-0 z-0 glitch-cyan"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="#00FFFF" stroke-width="5" fill="none" opacity="0.5">
        <path d="M25 22 L25 78" />
        <path d="M25 22 L45 22 C55 22 60 28 60 36 C60 44 55 48 45 48 L25 48" />
        <path d="M25 48 L48 48 C60 48 65 54 65 64 C65 74 58 78 45 78 L25 78" />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.logo-container:hover {
  transform: scale(1.08);
}

.logo-svg {
  transition: all 0.3s ease;
}

.logo-path {
  transition: all 0.3s ease;
}

.glitch-red {
  animation: glitch-offset-red 0.2s steps(2) infinite;
}

.glitch-cyan {
  animation: glitch-offset-cyan 0.2s steps(2) infinite;
}

@keyframes glitch-offset-red {
  0%, 100% { transform: translate(-2px, 0); }
  50% { transform: translate(2px, 1px); }
}

@keyframes glitch-offset-cyan {
  0%, 100% { transform: translate(2px, 0); }
  50% { transform: translate(-2px, -1px); }
}

.glitch-active {
  animation: logo-shake 0.15s steps(2) infinite;
}

@keyframes logo-shake {
  0%, 100% { transform: translate(0); }
  25% { transform: translate(-1px, 1px); }
  50% { transform: translate(1px, -1px); }
  75% { transform: translate(-1px, -1px); }
}
</style>
