<script setup lang="ts">
interface Props {
  src: string
  alt?: string
  followCursor?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  followCursor: true,
})

const containerRef = ref<HTMLElement | null>(null)
const imageRef = ref<HTMLElement | null>(null)
const isHovering = ref(false)
const position = ref({ x: 0, y: 0 })

function onMouseMove(e: MouseEvent) {
  if (!props.followCursor || !containerRef.value)
    return

  const rect = containerRef.value.getBoundingClientRect()
  position.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }
}

function onMouseEnter() {
  isHovering.value = true
}

function onMouseLeave() {
  isHovering.value = false
}

const imageStyle = computed(() => {
  if (!props.followCursor) {
    return {}
  }
  return {
    left: `${position.value.x}px`,
    top: `${position.value.y}px`,
  }
})
</script>

<template>
  <div
    ref="containerRef"
    class="photo-reveal"
    :class="{ 'is-hovering': isHovering }"
    @mousemove="onMouseMove"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <slot />

    <div
      ref="imageRef"
      class="photo-reveal-image"
      :class="{ 'follow-cursor': followCursor }"
      :style="imageStyle"
    >
      <img :src="src" :alt="alt">
    </div>
  </div>
</template>

<style scoped>
.photo-reveal {
  position: relative;
}

.photo-reveal-image {
  position: absolute;
  pointer-events: none;
  z-index: 10;
  width: 300px;
  height: 400px;
  overflow: hidden;
  opacity: 0;
  transform: rotate(-3deg) scale(0.9);
  transition: opacity 0.4s ease, transform 0.4s ease;
  border: 1px solid rgba(124, 58, 237, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(124, 58, 237, 0.2);
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
}

.photo-reveal-image.follow-cursor {
  transform: translate(-50%, -50%) rotate(-3deg) scale(0.9);
}

.photo-reveal.is-hovering .photo-reveal-image {
  opacity: 1;
  transform: rotate(-3deg) scale(1);
}

.photo-reveal.is-hovering .photo-reveal-image.follow-cursor {
  transform: translate(-50%, -50%) rotate(-3deg) scale(1);
}

.photo-reveal-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  clip-path: inset(100% 0 0 0);
  transition: clip-path 0.5s cubic-bezier(0.77, 0, 0.175, 1);
}

.photo-reveal.is-hovering .photo-reveal-image img {
  clip-path: inset(0% 0 0 0);
}
</style>
