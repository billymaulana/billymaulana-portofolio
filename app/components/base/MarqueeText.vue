<script setup lang="ts">
interface Props {
  items: string[]
  speed?: number
  direction?: 'left' | 'right'
  separator?: string
  pauseOnHover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  speed: 50,
  direction: 'left',
  separator: '◆',
  pauseOnHover: true,
})

const marqueeRef = ref<HTMLElement | null>(null)
const isPaused = ref(false)

const duration = computed(() => {
  // Base duration adjusted by speed
  const baseItems = props.items.length * 4
  return `${baseItems * (100 / props.speed)}s`
})

const animationDirection = computed(() => {
  return props.direction === 'left' ? 'normal' : 'reverse'
})

function onMouseEnter() {
  if (props.pauseOnHover) {
    isPaused.value = true
  }
}

function onMouseLeave() {
  isPaused.value = false
}
</script>

<template>
  <div
    ref="marqueeRef"
    class="marquee"
    :class="{ 'is-paused': isPaused }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div
      class="marquee-content"
      :style="{
        animationDuration: duration,
        animationDirection,
      }"
    >
      <template v-for="(item, index) in items" :key="`a-${index}`">
        <span class="marquee-item">{{ item }}</span>
        <span class="marquee-separator">{{ separator }}</span>
      </template>
    </div>
    <div
      class="marquee-content"
      aria-hidden="true"
      :style="{
        animationDuration: duration,
        animationDirection,
      }"
    >
      <template v-for="(item, index) in items" :key="`b-${index}`">
        <span class="marquee-item">{{ item }}</span>
        <span class="marquee-separator">{{ separator }}</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
.marquee {
  display: flex;
  overflow: hidden;
  user-select: none;
  gap: 0;
  mask-image: linear-gradient(
    to right,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
}

.marquee-content {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  gap: 0;
  animation: marquee-scroll linear infinite;
  will-change: transform;
}

.marquee.is-paused .marquee-content {
  animation-play-state: paused;
}

.marquee-item {
  flex-shrink: 0;
  padding: 0 0.5em;
  font-family: 'Satoshi', sans-serif;
  font-weight: 700;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.marquee-item:hover {
  color: #7C3AED;
}

.marquee-separator {
  flex-shrink: 0;
  padding: 0 0.5em;
  color: #7C3AED;
  opacity: 0.6;
}

@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
</style>
