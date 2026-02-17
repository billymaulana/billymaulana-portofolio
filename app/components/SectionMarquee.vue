<script setup lang="ts">
import { marqueeSkills, marqueeStats } from '~/constants/skills'

const marqueeRef = ref<HTMLElement>()
const speed = ref(1)

onMounted(async () => {
  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  // Speed up marquee based on scroll velocity
  ScrollTrigger.create({
    trigger: marqueeRef.value,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => {
      const velocity = Math.abs(self.getVelocity() / 1000)
      speed.value = 1 + Math.min(velocity, 3)
    },
  })
})

const animDuration = computed(() => `${40 / speed.value}s`)
</script>

<template>
  <section ref="marqueeRef" class="marquee" aria-label="Skills marquee">
    <!-- Row 1: Left to Right -->
    <div class="marquee__row">
      <div class="marquee__track" :style="{ animationDuration: animDuration }">
        <template v-for="n in 4" :key="`skills-${n}`">
          <span v-for="skill in marqueeSkills" :key="`${skill}-${n}`" class="marquee__item">
            {{ skill }}
            <span class="marquee__diamond" aria-hidden="true">&#x25C6;</span>
          </span>
        </template>
      </div>
    </div>

    <!-- Row 2: Right to Left -->
    <div class="marquee__row marquee__row--reverse">
      <div class="marquee__track marquee__track--reverse" :style="{ animationDuration: animDuration }">
        <template v-for="n in 4" :key="`stats-${n}`">
          <span v-for="stat in marqueeStats" :key="`${stat}-${n}`" class="marquee__item marquee__item--stroke">
            {{ stat }}
            <span class="marquee__diamond" aria-hidden="true">&#x25C6;</span>
          </span>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee {
  padding: 3rem 0;
  overflow: hidden;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  user-select: none;
}

.marquee__row {
  overflow: hidden;
  white-space: nowrap;
}

.marquee__row + .marquee__row {
  margin-top: 1rem;
}

.marquee__track {
  display: inline-flex;
  animation: marqueeScroll 40s linear infinite;
  will-change: transform;
}

.marquee__track--reverse {
  animation-name: marqueeScrollReverse;
}

.marquee__item {
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0 1.5rem;
  font-size: clamp(2rem, 4vw, 4rem);
  font-weight: 900;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.marquee__item--stroke {
  color: transparent;
  -webkit-text-stroke: 1.5px var(--color-text-secondary);
}

.marquee__diamond {
  font-size: 0.5em;
  color: var(--color-accent);
  -webkit-text-stroke: 0;
}

@keyframes marqueeScroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-25%);
  }
}

@keyframes marqueeScrollReverse {
  from {
    transform: translateX(-25%);
  }
  to {
    transform: translateX(0);
  }
}
</style>
