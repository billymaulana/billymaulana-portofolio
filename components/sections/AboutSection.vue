<script setup lang="ts">
import { experiences, profile } from '~/data/profile'

const sectionRef = ref<HTMLElement | null>(null)
const photoRef = ref<HTMLElement | null>(null)
const statsRef = ref<HTMLElement | null>(null)
const timelineRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  // Animate section title with dramatic reveal
  const titleEl = sectionRef.value?.querySelector('.section-title')
  if (titleEl) {
    gsap.fromTo(titleEl, {
      y: 100,
      opacity: 0,
      filter: 'blur(15px)',
    }, {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: titleEl,
        start: 'top 85%',
      },
    })
  }

  // Animate photo with premium clip-path + scale
  if (photoRef.value) {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: photoRef.value,
        start: 'top 80%',
      },
    })

    tl.fromTo(photoRef.value, {
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
      scale: 1.2,
    }, {
      clipPath: 'polygon(0 0%, 100% 0%, 100% 100%, 0 100%)',
      scale: 1,
      duration: 1.4,
      ease: 'expo.out',
    })
  }

  // Animate stats with counter effect already there, add entrance
  if (statsRef.value) {
    const statItems = statsRef.value.querySelectorAll('.stat-item')
    gsap.fromTo(statItems, {
      y: 50,
      opacity: 0,
      filter: 'blur(10px)',
    }, {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 0.8,
      stagger: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: statsRef.value,
        start: 'top 85%',
      },
    })
  }

  // Animate headline with split effect
  const headlineEl = sectionRef.value?.querySelector('.about-headline')
  if (headlineEl) {
    gsap.fromTo(headlineEl, {
      y: 60,
      opacity: 0,
      letterSpacing: '0.1em',
    }, {
      y: 0,
      opacity: 1,
      letterSpacing: '-0.02em',
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: headlineEl,
        start: 'top 85%',
      },
    })
  }

  // Animate bio paragraphs
  const bioEl = sectionRef.value?.querySelector('.about-bio')
  if (bioEl) {
    const paragraphs = bioEl.querySelectorAll('p')
    gsap.fromTo(paragraphs, {
      y: 30,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      stagger: 0.15,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: bioEl,
        start: 'top 85%',
      },
    })
  }

  // Animate CTA buttons
  const ctaEl = sectionRef.value?.querySelector('.about-cta')
  if (ctaEl) {
    const buttons = ctaEl.querySelectorAll('a, button')
    gsap.fromTo(buttons, {
      y: 20,
      opacity: 0,
      scale: 0.95,
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: ctaEl,
        start: 'top 90%',
      },
    })
  }

  // Animate timeline with premium sequence
  if (timelineRef.value) {
    const line = timelineRef.value.querySelector('.timeline-line-progress')
    const dots = timelineRef.value.querySelectorAll('.timeline-dot')
    const items = timelineRef.value.querySelectorAll('.timeline-item')

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: timelineRef.value,
        start: 'top 80%',
      },
    })

    // Line draws across
    tl.fromTo(line, { scaleX: 0 }, {
      scaleX: 1,
      duration: 1.5,
      ease: 'power2.inOut',
    }, 0)

    // Dots pop in sequence
    tl.fromTo(dots, {
      scale: 0,
      opacity: 0,
    }, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      stagger: 0.2,
      ease: 'back.out(2)',
    }, 0.3)

    // Items fade up
    tl.fromTo(items, {
      y: 20,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.15,
      ease: 'power2.out',
    }, 0.5)
  }
})

const timelineExperiences = computed(() => {
  return experiences.slice(0, 4).reverse()
})
</script>

<template>
  <section id="about" ref="sectionRef" class="about-section">
    <h2 class="section-title">
      <span class="title-solid">about</span>
    </h2>

    <div class="about-content">
      <div class="about-left">
        <div ref="photoRef" class="about-photo">
          <img
            src="/assets/images/profile/bm-glitch.png"
            alt="Billy Maulana"
            class="photo-image"
          >
        </div>

        <div ref="statsRef" class="about-stats">
          <div class="stat-item">
            <CounterAnimation
              :target="profile.yearsExperience"
              suffix="+"
              class="stat-number"
            />
            <span class="stat-label">Years Experience</span>
          </div>

          <div class="stat-item">
            <CounterAnimation
              :target="profile.projectsCount"
              suffix="+"
              class="stat-number"
            />
            <span class="stat-label">Projects</span>
          </div>

          <div class="stat-item">
            <CounterAnimation
              :target="profile.companiesCount"
              class="stat-number"
            />
            <span class="stat-label">Companies</span>
          </div>
        </div>
      </div>

      <div class="about-right">
        <h3 class="about-headline">
          I obsess over the details that make users stay.
        </h3>

        <div class="about-bio">
          <p v-for="(paragraph, index) in profile.bio.split('\n\n')" :key="index">
            {{ paragraph }}
          </p>
        </div>

        <div class="about-cta">
          <MagneticButton
            tag="a"
            :href="profile.resumeUrl"
            target="_blank"
            class="btn-outline"
            cursor-label="Download"
          >
            Download Resume
          </MagneticButton>

          <MagneticButton
            tag="a"
            href="#contact"
            class="btn-text"
            cursor-label="Connect"
          >
            Let's Connect →
          </MagneticButton>
        </div>
      </div>
    </div>

    <div ref="timelineRef" class="about-timeline">
      <div class="timeline-line">
        <div class="timeline-line-progress" />
      </div>

      <div class="timeline-items">
        <div
          v-for="exp in timelineExperiences"
          :key="exp.company"
          class="timeline-item"
        >
          <div class="timeline-dot" />
          <span class="timeline-year">{{ exp.startYear }}</span>
          <span class="timeline-company">{{ exp.company }}</span>
          <span class="timeline-role">{{ exp.role }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about-section {
  padding: 160px 64px;
  max-width: 1440px;
  margin: 0 auto;
  background: #000;
}

@media (max-width: 1024px) {
  .about-section {
    padding: 120px 48px;
  }
}

@media (max-width: 768px) {
  .about-section {
    padding: 80px 24px;
  }
}

.section-title {
  font-family: 'Satoshi', sans-serif;
  font-size: clamp(48px, 10vw, 120px);
  font-weight: 900;
  text-transform: lowercase;
  letter-spacing: -0.03em;
  margin: 0 0 64px;
  padding-bottom: 32px;
  border-bottom: 1px solid rgba(124, 58, 237, 0.15);
  color: #fff;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 64px;
  margin-bottom: 96px;
}

.about-left {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.about-photo {
  position: relative;
  width: 100%;
  max-width: 400px;
  aspect-ratio: 4 / 5;
  overflow: hidden;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%) contrast(1.1);
  transition: filter 0.5s ease;
}

.about-photo:hover .photo-image {
  filter: grayscale(0%) contrast(1);
}

.about-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Stat number - white with lime accent on hover group */
.stat-number {
  font-family: 'Satoshi', sans-serif;
  font-size: 56px;
  font-weight: 900;
  color: #fff;
  line-height: 1;
}

.stat-item:hover .stat-number {
  color: #7C3AED;
}

.stat-label {
  font-family: 'Satoshi', sans-serif;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.4);
}

.about-right {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.about-headline {
  font-family: 'Satoshi', sans-serif;
  font-size: clamp(28px, 4vw, 48px);
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 32px;
  color: #fff;
}

.about-bio {
  color: rgba(255, 255, 255, 0.6);
  font-family: 'Satoshi', sans-serif;
  font-size: 18px;
  line-height: 1.7;
}

.about-bio p {
  margin: 0 0 24px;
}

.about-bio p:last-child {
  margin-bottom: 0;
}

.about-cta {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-top: 40px;
}

/* Purple accent button */
.btn-outline {
  padding: 16px 32px;
  border: 1px solid rgba(124, 58, 237, 0.3);
  font-family: 'Satoshi', sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-outline:hover {
  border-color: #7C3AED;
  background: rgba(124, 58, 237, 0.1);
  color: #7C3AED;
  box-shadow: 0 0 30px rgba(124, 58, 237, 0.3);
}

.btn-text {
  font-family: 'Satoshi', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

.btn-text:hover {
  color: #7C3AED;
  text-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
}

/* Timeline - purple accent */
.about-timeline {
  position: relative;
  padding-top: 48px;
  border-top: 1px solid rgba(124, 58, 237, 0.15);
}

.timeline-line {
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(124, 58, 237, 0.15);
}

.timeline-line-progress {
  height: 100%;
  background: #7C3AED;
  transform-origin: left;
}

.timeline-items {
  display: flex;
  justify-content: space-between;
  padding-top: 32px;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  flex: 1;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #7C3AED;
  position: absolute;
  top: -32px;
  transform: translateY(-50%);
}

.timeline-year {
  font-family: 'Satoshi', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #7C3AED;
  margin-bottom: 8px;
}

.timeline-company {
  font-family: 'Satoshi', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 4px;
}

.timeline-role {
  font-family: 'Satoshi', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

@media (max-width: 1024px) {
  .about-content {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .about-left {
    flex-direction: row;
    align-items: flex-start;
    gap: 32px;
  }

  .about-photo {
    max-width: 250px;
  }

  .about-stats {
    flex-direction: column;
    gap: 24px;
  }

  .stat-number {
    font-size: 48px;
  }
}

@media (max-width: 768px) {
  .about-left {
    flex-direction: column;
  }

  .about-photo {
    max-width: 100%;
  }

  .about-stats {
    flex-direction: row;
    justify-content: space-between;
  }

  .about-cta {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .timeline-items {
    flex-wrap: wrap;
    gap: 32px;
  }

  .timeline-item {
    flex: 1 1 45%;
  }
}
</style>
