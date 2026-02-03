<script setup lang="ts">
import { useMagneticEffect } from '~/composables/useMagneticEffect'

interface Props {
  tag?: 'button' | 'a' | 'div'
  href?: string
  target?: string
  strength?: number
  cursorLabel?: string
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'button',
  strength: 0.3,
})

const buttonRef = ref<HTMLElement | null>(null)
const { setupMagnetic, position, isHovering } = useMagneticEffect({
  strength: props.strength,
})

onMounted(() => {
  if (buttonRef.value) {
    setupMagnetic(buttonRef.value)
  }
})
</script>

<template>
  <component
    :is="tag"
    ref="buttonRef"
    :href="href"
    :target="target"
    class="magnetic-button"
    :class="{ 'is-hovering': isHovering }"
    :data-cursor-label="cursorLabel"
    :data-cursor-hover="true"
  >
    <span
      class="magnetic-button-content"
      :style="{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }"
    >
      <slot />
    </span>
  </component>
</template>

<style scoped>
.magnetic-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0;
  text-decoration: none;
  color: inherit;
}

.magnetic-button-content {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.1s ease-out;
  will-change: transform;
}

.magnetic-button.is-hovering .magnetic-button-content {
  transition: none;
}
</style>
