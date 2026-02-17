<script setup lang="ts">
import { experiences, profile } from '~/constants/profile'

const sectionRef = ref<HTMLElement>()
const yearsRef = ref<HTMLElement>()
const projectsRef = ref<HTMLElement>()
const companiesRef = ref<HTMLElement>()

onMounted(async () => {
  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  if (!sectionRef.value)
    return

  // Entrance animations
  gsap.from('.about__visual', {
    x: -60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 75%',
    },
  })

  gsap.from('.about__content > *', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.about__content',
      start: 'top 80%',
    },
  })

  // Counter animations
  const counters = [
    { el: yearsRef.value, val: profile.yearsExperience, suffix: '+' },
    { el: projectsRef.value, val: profile.projectsCount, suffix: '+' },
    { el: companiesRef.value, val: profile.companiesCount, suffix: '' },
  ]

  counters.forEach(({ el, val, suffix }) => {
    if (!el)
      return
    const obj = { v: 0 }
    gsap.to(obj, {
      v: val,
      duration: 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        el.textContent = `${Math.round(obj.v)}${suffix}`
      },
    })
  })
})
</script>

<template>
  <section id="about" ref="sectionRef" class="about section-padding" aria-label="About Billy Maulana">
    <div class="about__inner page-max">
      <!-- Visual Column -->
      <div class="about__visual">
        <div class="about__frame">
          <!-- Programmatic abstract portrait -->
          <div class="about__portrait">
            <div class="about__portrait-circle" />
            <div class="about__portrait-ring about__portrait-ring--1" />
            <div class="about__portrait-ring about__portrait-ring--2" />
            <div class="about__portrait-ring about__portrait-ring--3" />
            <svg class="about__portrait-initials" viewBox="0 0 200 200" aria-hidden="true">
              <text x="50%" y="55%" text-anchor="middle" dominant-baseline="central">BM</text>
            </svg>
          </div>
        </div>
      </div>

      <!-- Content Column -->
      <div class="about__content">
        <span class="about__label text-label">About</span>
        <h2 class="about__title text-h2">
          Frontend Architect with<br>
          <span class="text-gradient">{{ profile.yearsExperience }}+ years</span> of craft
        </h2>

        <!-- Bio -->
        <div class="about__bio">
          <p v-for="(paragraph, i) in profile.bio.split('\n\n')" :key="i" class="about__bio-text text-body">
            {{ paragraph }}
          </p>
        </div>

        <!-- Stats -->
        <div class="about__stats">
          <div class="about__stat">
            <span ref="yearsRef" class="about__stat-value">0+</span>
            <span class="about__stat-label text-label">Years</span>
          </div>
          <div class="about__stat">
            <span ref="projectsRef" class="about__stat-value">0+</span>
            <span class="about__stat-label text-label">Projects</span>
          </div>
          <div class="about__stat">
            <span ref="companiesRef" class="about__stat-value">0</span>
            <span class="about__stat-label text-label">Companies</span>
          </div>
        </div>

        <!-- Experience -->
        <div class="about__experience">
          <h3 class="about__exp-title text-h4">
            Experience
          </h3>
          <div class="about__exp-list">
            <div v-for="exp in experiences.slice(0, 4)" :key="exp.company" class="about__exp-item">
              <div class="about__exp-left">
                <span class="about__exp-company">{{ exp.company }}</span>
                <span class="about__exp-role text-small">{{ exp.role }}</span>
              </div>
              <span class="about__exp-year text-small">
                {{ exp.startYear }}–{{ exp.endYear ?? 'Present' }}
              </span>
            </div>
          </div>
        </div>

        <!-- CTA -->
        <div class="about__cta">
          <UiMagneticButton tag="a" :href="profile.resumeUrl" target="_blank" class="btn-primary">
            Download Resume
            <span class="i-carbon-download" aria-hidden="true" />
          </UiMagneticButton>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about__inner {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 4rem;
  align-items: start;
}

/* Visual Column */
.about__visual {
  position: sticky;
  top: 6rem;
}

.about__frame {
  aspect-ratio: 3 / 4;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
}

.about__portrait {
  position: relative;
  width: 80%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about__portrait-circle {
  position: absolute;
  width: 60%;
  height: 60%;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-spectrum-violet) 100%);
  opacity: 0.15;
  filter: blur(30px);
}

.about__portrait-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid;
}

.about__portrait-ring--1 {
  width: 70%;
  height: 70%;
  border-color: rgba(0, 71, 255, 0.2);
  animation: ringRotate 12s linear infinite;
}

.about__portrait-ring--2 {
  width: 85%;
  height: 85%;
  border-color: rgba(139, 0, 255, 0.15);
  animation: ringRotate 18s linear infinite reverse;
}

.about__portrait-ring--3 {
  width: 100%;
  height: 100%;
  border-color: rgba(255, 255, 255, 0.05);
  animation: ringRotate 24s linear infinite;
}

.about__portrait-initials {
  width: 50%;
  height: 50%;
  position: relative;
  z-index: 1;
}

.about__portrait-initials text {
  fill: var(--color-text-primary);
  font-family: 'Satoshi', sans-serif;
  font-weight: 900;
  font-size: 48px;
  opacity: 0.8;
}

@keyframes ringRotate {
  to {
    transform: rotate(360deg);
  }
}

/* Content Column */
.about__label {
  color: var(--color-accent-light);
  display: block;
  margin-bottom: 1rem;
}

.about__title {
  margin-bottom: 2rem;
}

.about__bio-text {
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.about__bio-text:last-child {
  margin-bottom: 0;
}

.about__bio {
  margin-bottom: 3rem;
}

/* Stats */
.about__stats {
  display: flex;
  gap: 3rem;
  margin-bottom: 3rem;
  padding: 2rem;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.about__stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.about__stat-value {
  font-size: var(--text-h2);
  font-weight: 900;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
  font-variant-numeric: tabular-nums;
}

.about__stat-label {
  color: var(--color-text-tertiary);
}

/* Experience */
.about__exp-title {
  margin-bottom: 1.5rem;
}

.about__exp-list {
  margin-bottom: 2.5rem;
}

.about__exp-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.about__exp-item:first-child {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.about__exp-left {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.about__exp-company {
  font-weight: 700;
}

.about__exp-role {
  color: var(--color-text-secondary);
}

.about__exp-year {
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

@media (max-width: 768px) {
  .about__inner {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .about__visual {
    position: relative;
    top: 0;
    max-width: 280px;
    margin: 0 auto;
  }

  .about__stats {
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .about__stat {
    flex: 1 1 auto;
    min-width: 80px;
  }
}
</style>
