<script setup lang="ts">
import { marqueeSkills, marqueeStats } from '~/data/skills'

const sectionRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  if (sectionRef.value) {
    const row1 = sectionRef.value.querySelector('.marquee-row-1')
    const row2 = sectionRef.value.querySelector('.marquee-row-2')
    const divider = sectionRef.value.querySelector('.marquee-divider')

    // Entrance animation timeline
    const entranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 85%',
      },
    })

    // Row 1 slides in from left with blur
    if (row1) {
      entranceTl.fromTo(row1, {
        x: -100,
        opacity: 0,
        filter: 'blur(10px)',
      }, {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power3.out',
      }, 0)
    }

    // Row 2 slides in from right with blur
    if (row2) {
      entranceTl.fromTo(row2, {
        x: 100,
        opacity: 0,
        filter: 'blur(10px)',
      }, {
        x: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 1.2,
        ease: 'power3.out',
      }, 0.2)
    }

    // Divider fades in with scale
    if (divider) {
      entranceTl.fromTo(divider, {
        opacity: 0,
        scale: 0.8,
      }, {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: 'back.out(1.5)',
      }, 0.4)
    }

    // Parallax speed effect on scroll
    if (row1) {
      gsap.to(row1, {
        x: -100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }

    if (row2) {
      gsap.to(row2, {
        x: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }
  }
})
</script>

<template>
  <section ref="sectionRef" class="marquee-section">
    <!-- Row 1: Skills -->
    <div class="marquee-row marquee-row-1">
      <div class="marquee-track">
        <div class="marquee-content">
          <span v-for="(skill, i) in [...marqueeSkills, ...marqueeSkills]" :key="`skill-${i}`" class="marquee-item">
            <span class="item-dot" />
            <span class="item-text">{{ skill }}</span>
          </span>
        </div>
        <div class="marquee-content" aria-hidden="true">
          <span v-for="(skill, i) in [...marqueeSkills, ...marqueeSkills]" :key="`skill-dup-${i}`" class="marquee-item">
            <span class="item-dot" />
            <span class="item-text">{{ skill }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="marquee-divider">
      <div class="divider-line" />
      <div class="divider-dot" />
      <div class="divider-line" />
    </div>

    <!-- Row 2: Stats (reverse direction) -->
    <div class="marquee-row marquee-row-2">
      <div class="marquee-track reverse">
        <div class="marquee-content">
          <span v-for="(stat, i) in [...marqueeStats, ...marqueeStats]" :key="`stat-${i}`" class="marquee-item stat-item">
            <span class="item-text">{{ stat }}</span>
            <span class="item-dot" />
          </span>
        </div>
        <div class="marquee-content" aria-hidden="true">
          <span v-for="(stat, i) in [...marqueeStats, ...marqueeStats]" :key="`stat-dup-${i}`" class="marquee-item stat-item">
            <span class="item-text">{{ stat }}</span>
            <span class="item-dot" />
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.marquee-section {
  padding: 120px 0;
  overflow: hidden;
  background: #000;
  position: relative;
  border-top: 1px solid rgba(0, 245, 255, 0.15);
  border-bottom: 1px solid rgba(0, 245, 255, 0.15);
}

.marquee-row {
  width: 100%;
  overflow: hidden;
}

.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 40s linear infinite;
}

.marquee-track.reverse {
  animation-direction: reverse;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.marquee-content {
  display: flex;
  align-items: center;
  gap: 48px;
  padding: 0 24px;
}

.marquee-item {
  display: flex;
  align-items: center;
  gap: 16px;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.marquee-item:hover {
  transform: scale(1.02);
}

/* Monochrome dot - only lime accent */
.item-dot {
  width: 6px;
  height: 6px;
  background: #00F5FF;
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.marquee-item:hover .item-dot {
  opacity: 1;
}

/* Ghost text style - visible with purple tint */
.item-text {
  font-family: 'Satoshi', sans-serif;
  font-size: clamp(40px, 6vw, 80px);
  font-weight: 700;
  color: rgba(0, 245, 255, 0.3);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

.marquee-item:hover .item-text {
  color: rgba(0, 245, 255, 0.6);
  text-shadow: 0 0 40px rgba(0, 245, 255, 0.4);
}

/* Stats row - purple outline style */
.stat-item .item-text {
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(0, 245, 255, 0.4);
  -webkit-text-fill-color: transparent;
  transition: all 0.3s ease;
}

.stat-item:hover .item-text {
  -webkit-text-stroke: 2px #00F5FF;
  filter: drop-shadow(0 0 30px rgba(0, 245, 255, 0.5));
}

/* Divider - minimal */
.marquee-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 48px 0;
}

.divider-line {
  width: 80px;
  height: 1px;
  background: rgba(0, 245, 255, 0.2);
}

.divider-dot {
  width: 6px;
  height: 6px;
  background: #00F5FF;
  border-radius: 50%;
}

/* Responsive */
@media (max-width: 768px) {
  .marquee-section {
    padding: 80px 0;
  }

  .marquee-content {
    gap: 32px;
  }

  .marquee-divider {
    padding: 32px 0;
  }

  .divider-line {
    width: 40px;
  }
}
</style>
