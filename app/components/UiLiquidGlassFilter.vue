<script setup lang="ts">
const props = withDefaults(defineProps<{
  displacementScale?: number
}>(), {
  displacementScale: 77,
})

// Compute R/G/B scales for chromatic aberration (~10% spread)
const scaleR = computed(() => Math.round(props.displacementScale * 0.91))
const scaleG = computed(() => props.displacementScale)
const scaleB = computed(() => Math.round(props.displacementScale * 1.09))
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
      <filter id="liquid-glass" x="-10%" y="-10%" width="120%" height="120%" color-interpolation-filters="sRGB">
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

        <!-- 3. Edge-concentrated displacement image -->
        <!-- Red channel = X displacement, Green channel = Y displacement -->
        <!-- Neutral center (128,128) = no displacement; edges ramp to 0 or 255 -->
        <feImage
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cdefs%3E%3ClinearGradient id='lx' x1='0' y1='0' x2='1' y2='0'%3E%3Cstop offset='0%25' stop-color='%23FF0000'/%3E%3Cstop offset='15%25' stop-color='%23800000'/%3E%3Cstop offset='50%25' stop-color='%23808000'/%3E%3Cstop offset='85%25' stop-color='%23008000'/%3E%3Cstop offset='100%25' stop-color='%2300FF00'/%3E%3C/linearGradient%3E%3ClinearGradient id='ly' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%230000FF'/%3E%3Cstop offset='15%25' stop-color='%23000080'/%3E%3Cstop offset='50%25' stop-color='%23000080'/%3E%3Cstop offset='85%25' stop-color='%23000080'/%3E%3Cstop offset='100%25' stop-color='%230000FF'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23lx)'/%3E%3Crect width='200' height='200' fill='url(%23ly)' style='mix-blend-mode:screen'/%3E%3Crect x='30' y='30' width='140' height='140' rx='20' fill='%23808080' filter='blur(15px)'/%3E%3C/svg%3E"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
          result="edgeMap"
        />

        <!-- 4. Merge organic noise with edge map -->
        <feComposite in="smoothNoise" in2="edgeMap" operator="arithmetic" k1="0.5" k2="0.5" k3="0" k4="0" result="mergedDisplacement" />

        <!-- 5a. Red channel displacement -->
        <feDisplacementMap
          in="SourceGraphic"
          in2="mergedDisplacement"
          :scale="scaleR"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displacedR"
        />
        <feColorMatrix in="displacedR" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="redOnly" />

        <!-- 5b. Green channel displacement -->
        <feDisplacementMap
          in="SourceGraphic"
          in2="mergedDisplacement"
          :scale="scaleG"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displacedG"
        />
        <feColorMatrix in="displacedG" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="greenOnly" />

        <!-- 5c. Blue channel displacement -->
        <feDisplacementMap
          in="SourceGraphic"
          in2="mergedDisplacement"
          :scale="scaleB"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displacedB"
        />
        <feColorMatrix in="displacedB" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="blueOnly" />

        <!-- 5d. Recombine R+G+B with screen blend -->
        <feBlend in="redOnly" in2="greenOnly" mode="screen" result="rg" />
        <feBlend in="rg" in2="blueOnly" mode="screen" result="chromatic" />

        <!-- 6. Fresnel edge glow -->
        <feMorphology in="SourceGraphic" operator="dilate" radius="3" result="dilated" />
        <feGaussianBlur in="dilated" stdDeviation="4" result="glowBlur" />
        <feComposite in="glowBlur" in2="SourceGraphic" operator="out" result="edgeGlow" />
        <feColorMatrix in="edgeGlow" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.15 0" result="fresnelGlow" />

        <!-- 7. Final composite: chromatic refraction + Fresnel glow -->
        <feComposite in="fresnelGlow" in2="chromatic" operator="over" result="final" />
      </filter>
    </defs>
  </svg>
</template>
