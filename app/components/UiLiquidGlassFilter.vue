<script setup lang="ts">
const props = withDefaults(defineProps<{
  displacementScale?: number
}>(), {
  displacementScale: 10,
})

// Compute R/G/B scales for chromatic aberration (~10% spread)
const scaleR = computed(() => Math.round(props.displacementScale * 0.97))
const scaleG = computed(() => props.displacementScale)
const scaleB = computed(() => Math.round(props.displacementScale * 1.03))
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="0"
    height="0"
    style="position: absolute; overflow: hidden; pointer-events: none;"
    aria-hidden="true"
  >
    <defs>
      <!-- Main liquid glass filter -->
      <filter id="liquid-glass" x="0%" y="0%" width="100%" height="100%" color-interpolation-filters="sRGB">
        <!-- 1. Organic noise texture -->
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.006 0.006"
          numOctaves="3"
          seed="42"
          result="noise"
        />

        <!-- 2. Smooth the noise for displacement -->
        <feGaussianBlur in="noise" stdDeviation="1.5" result="smoothNoise" />

        <!-- 3. Use smoothed noise directly as displacement source (no edge map = no rectangular artifacts) -->

        <!-- 4a. Red channel displacement -->
        <feDisplacementMap
          in="SourceGraphic"
          in2="smoothNoise"
          :scale="scaleR"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displacedR"
        />
        <feColorMatrix in="displacedR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="redOnly" />

        <!-- 5b. Green channel displacement -->
        <feDisplacementMap
          in="SourceGraphic"
          in2="smoothNoise"
          :scale="scaleG"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displacedG"
        />
        <feColorMatrix in="displacedG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="greenOnly" />

        <!-- 5c. Blue channel displacement -->
        <feDisplacementMap
          in="SourceGraphic"
          in2="smoothNoise"
          :scale="scaleB"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displacedB"
        />
        <feColorMatrix in="displacedB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blueOnly" />

        <!-- 5d. Recombine R+G+B with screen blend -->
        <feBlend in="redOnly" in2="greenOnly" mode="screen" result="rg" />
        <feBlend in="rg" in2="blueOnly" mode="screen" />
      </filter>
    </defs>
  </svg>
</template>
