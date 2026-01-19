<script setup lang="ts">
interface Props {
  size?: number
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 48,
  animated: true,
})

const logoRef = ref<HTMLElement | null>(null)
const isHovered = ref(false)

onMounted(async () => {
  if (!props.animated || !logoRef.value)
    return

  const { gsap } = await import('gsap')

  gsap.fromTo(
    logoRef.value.querySelectorAll('.logo-path'),
    { strokeDashoffset: 300, opacity: 0 },
    {
      strokeDashoffset: 0,
      opacity: 1,
      duration: 1.5,
      stagger: 0.2,
      ease: 'power3.out',
    },
  )
})

function handleMouseEnter() {
  isHovered.value = true
}

function handleMouseLeave() {
  isHovered.value = false
}
</script>

<template>
  <div
    ref="logoRef"
    class="logo-container"
    :style="{ width: `${size}px`, height: `${size}px` }"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      class="logo-svg"
      :class="{ 'is-hovered': isHovered }"
    >
      <rect
        class="logo-border"
        x="2"
        y="2"
        width="96"
        height="96"
        stroke="currentColor"
        stroke-width="3"
        fill="none"
      />

      <path
        class="logo-path"
        d="M20 20 L20 80 L35 80 L35 55 L45 55 C55 55 60 50 60 40 C60 30 55 25 45 25 L20 25 L20 20"
        stroke="#CDFF00"
        stroke-width="4"
        fill="none"
        stroke-linecap="square"
        stroke-dasharray="300"
      />
      <path
        class="logo-path logo-b-curve"
        d="M35 25 L45 25 C50 25 52 28 52 35 C52 42 50 45 45 45 L35 45"
        stroke="#CDFF00"
        stroke-width="4"
        fill="none"
        stroke-linecap="square"
        stroke-dasharray="300"
      />

      <path
        class="logo-path"
        d="M55 20 L55 80"
        stroke="#FF3366"
        stroke-width="4"
        fill="none"
        stroke-linecap="square"
        stroke-dasharray="300"
      />
      <path
        class="logo-path"
        d="M55 20 L75 50 L55 80"
        stroke="#FF3366"
        stroke-width="4"
        fill="none"
        stroke-linecap="square"
        stroke-linejoin="miter"
        stroke-dasharray="300"
      />
      <path
        class="logo-path"
        d="M75 50 L80 20 L80 80 L75 50"
        stroke="#FF3366"
        stroke-width="4"
        fill="none"
        stroke-linecap="square"
        stroke-dasharray="300"
      />

      <rect
        class="logo-accent"
        x="85"
        y="85"
        width="10"
        height="10"
        fill="#00FFFF"
      />
    </svg>
  </div>
</template>

<style scoped>
.logo-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.logo-container:hover {
  transform: scale(1.05);
}

.logo-svg {
  transition: all 0.3s ease;
}

.logo-svg.is-hovered .logo-border {
  stroke: #CDFF00;
}

.logo-svg.is-hovered .logo-accent {
  animation: pulse 0.5s ease infinite alternate;
}

.logo-path {
  transition: all 0.3s ease;
}

@keyframes pulse {
  from {
    opacity: 1;
  }
  to {
    opacity: 0.5;
  }
}
</style>
