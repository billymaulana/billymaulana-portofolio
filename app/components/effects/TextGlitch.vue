<script setup lang="ts">
interface Props {
  text: string
  tag?: string
  glitchOnHover?: boolean
  glitchColors?: [string, string]
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'span',
  glitchOnHover: true,
  glitchColors: () => ['#00FFFF', '#FF0080'],
})

const isHovering = ref(false)

function onMouseEnter() {
  if (props.glitchOnHover)
    isHovering.value = true
}

function onMouseLeave() {
  if (props.glitchOnHover)
    isHovering.value = false
}
</script>

<template>
  <component
    :is="tag"
    class="text-glitch"
    :class="{ 'is-glitching': isHovering }"
    :data-text="text"
    :style="{
      '--glitch-color-1': glitchColors[0],
      '--glitch-color-2': glitchColors[1],
    }"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <slot>{{ text }}</slot>
  </component>
</template>

<style scoped>
.text-glitch {
  position: relative;
  display: inline-block;
}

.text-glitch::before,
.text-glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  pointer-events: none;
}

.text-glitch::before {
  color: var(--glitch-color-1);
  z-index: -1;
}

.text-glitch::after {
  color: var(--glitch-color-2);
  z-index: -2;
}

.text-glitch.is-glitching::before,
.text-glitch.is-glitching::after {
  opacity: 0.8;
}

.text-glitch.is-glitching::before {
  animation: glitch-1 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite;
}

.text-glitch.is-glitching::after {
  animation: glitch-2 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse infinite;
}

@keyframes glitch-1 {
  0% {
    clip-path: inset(40% 0 61% 0);
    transform: translate(-2px, -2px);
  }
  20% {
    clip-path: inset(92% 0 1% 0);
    transform: translate(1px, 2px);
  }
  40% {
    clip-path: inset(43% 0 1% 0);
    transform: translate(-1px, -1px);
  }
  60% {
    clip-path: inset(25% 0 58% 0);
    transform: translate(2px, 1px);
  }
  80% {
    clip-path: inset(54% 0 7% 0);
    transform: translate(-2px, 2px);
  }
  100% {
    clip-path: inset(58% 0 43% 0);
    transform: translate(1px, -1px);
  }
}

@keyframes glitch-2 {
  0% {
    clip-path: inset(65% 0 0% 0);
    transform: translate(2px, 2px);
  }
  20% {
    clip-path: inset(10% 0 85% 0);
    transform: translate(-1px, -2px);
  }
  40% {
    clip-path: inset(1% 0 75% 0);
    transform: translate(1px, 1px);
  }
  60% {
    clip-path: inset(77% 0 20% 0);
    transform: translate(-2px, -1px);
  }
  80% {
    clip-path: inset(35% 0 50% 0);
    transform: translate(2px, -2px);
  }
  100% {
    clip-path: inset(50% 0 30% 0);
    transform: translate(-1px, 1px);
  }
}
</style>
