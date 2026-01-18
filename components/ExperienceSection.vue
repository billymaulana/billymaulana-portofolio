<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const timelineRef = ref<HTMLElement | null>(null)

const experiences = [
  {
    title: 'Front-End Developer',
    company: 'GPay',
    type: 'Contract',
    period: 'Jan 2025 - Present',
    description: 'A fintech company dedicated to innovation, providing consumers with seamless and secure cashless transactions anytime, anywhere.',
    highlights: [
      'Transforming UI/UX designs into responsive, high-quality web applications',
      'Developed scalable frontend components with optimal performance',
      'Collaborated closely with product designers, QA, PM and stakeholders',
      'Implemented best practices in code quality and accessibility',
    ],
    color: 'primary',
  },
  {
    title: 'Front-End Developer',
    company: 'KreditPlus',
    type: 'Contract',
    period: 'Jan 2023 - Dec 2024',
    description: 'A finance company offering multipurpose and installment loans for consumer goods, vehicles, and property.',
    highlights: [
      'Translating designs and wireframes into high quality code',
      'Building reusable components and front-end libraries',
      'Maintain and optimize existing code for web performance',
      'Assistant Lead Developer role',
    ],
    color: 'secondary',
  },
  {
    title: 'Front-End Developer',
    company: 'IndoChat',
    type: 'Contract',
    period: 'Aug 2022 - Jan 2023',
    description: 'A chat and social media app that keeps you connected with your loved ones and the world.',
    highlights: [
      'Delivering a complete application',
      'Ensuring high performance on application',
      'Maintain code quality and improve application performance',
    ],
    color: 'accent',
  },
  {
    title: 'Front-End Developer',
    company: 'Vhiweb',
    type: 'Fulltime',
    period: 'Jan 2018 - Aug 2022',
    description: 'A Modern Digital Agency with a strong passion for solving client\'s real-world digital problems.',
    highlights: [
      'Translating designs and wireframes into high quality code',
      'Building reusable components and front-end libraries',
      'Learning business process with stakeholders',
      'Lead Developer role',
    ],
    color: 'electric',
  },
  {
    title: 'Full-Stack Developer',
    company: 'HWTours',
    type: 'Fulltime',
    period: 'Aug 2017 - Dec 2017',
    description: 'A Travel Agent providing accommodation services, hotels, tour packages, domestic, international flight, Hajj and Umroh.',
    highlights: [
      'Developed dynamic and interactive website',
      'Achieved 40% increase in sales revenue',
      'Maintain, update, and improve existing company websites',
    ],
    color: 'warning',
  },
  {
    title: 'Back-End Developer',
    company: 'Smoeets',
    type: 'Internship',
    period: 'Jan 2016 - Apr 2016',
    description: 'A Programmer Outsourcing company with reliable developers and development processes.',
    highlights: [
      'Assist in the design, coding using Laravel framework',
      'Develops new and maintains existing applications',
      'Work closely with Project Manager and Team Leads',
    ],
    color: 'primary',
  },
]

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')

  gsap.registerPlugin(ScrollTrigger)

  const items = timelineRef.value?.querySelectorAll('.timeline-item')

  items?.forEach((item, index) => {
    gsap.fromTo(
      item,
      { x: index % 2 === 0 ? -100 : 100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      },
    )
  })
})
</script>

<template>
  <section
    id="experience"
    ref="sectionRef"
    class="py-20 md:py-32 relative"
  >
    <div class="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-secondary/50 to-transparent" />

    <div class="container-custom section-padding">
      <div class="text-center mb-16">
        <span class="font-mono text-primary text-sm uppercase tracking-widest mb-4 block">
          Career Journey
        </span>
        <h2 class="text-fluid-3xl font-accent">
          WORK<br>
          <span class="text-primary">EXPERIENCE</span>
        </h2>
      </div>

      <div ref="timelineRef" class="relative">
        <div class="absolute left-1/2 top-0 bottom-0 w-px bg-text/20 hidden lg:block" />

        <div class="space-y-8 lg:space-y-0">
          <div
            v-for="(exp, index) in experiences"
            :key="exp.company"
            class="timeline-item lg:grid lg:grid-cols-2 lg:gap-8 relative"
            :class="index % 2 === 0 ? '' : 'lg:direction-rtl'"
          >
            <div
              class="absolute left-1/2 top-8 w-4 h-4 -translate-x-1/2 hidden lg:block z-10"
              :class="`bg-${exp.color}`"
            />

            <div
              class="brutalist-card lg:mb-8"
              :class="[
                index % 2 === 0 ? 'lg:text-right lg:mr-8' : 'lg:col-start-2 lg:ml-8 lg:direction-ltr',
                `hover:border-${exp.color}`,
              ]"
            >
              <div class="flex flex-wrap items-center gap-2 mb-2" :class="index % 2 === 0 ? 'lg:justify-end' : ''">
                <span class="font-mono text-xs px-2 py-1 bg-surface-lighter" :class="`text-${exp.color}`">
                  {{ exp.type }}
                </span>
                <span class="font-mono text-xs text-text-muted">
                  {{ exp.period }}
                </span>
              </div>

              <h3 class="text-xl font-display font-bold mb-1">
                {{ exp.title }}
              </h3>
              <p class="font-mono text-sm mb-4" :class="`text-${exp.color}`">
                @ {{ exp.company }}
              </p>

              <p class="text-text-muted text-sm mb-4">
                {{ exp.description }}
              </p>

              <ul class="space-y-2">
                <li
                  v-for="highlight in exp.highlights"
                  :key="highlight"
                  class="text-sm text-text-muted flex items-start gap-2"
                  :class="index % 2 === 0 ? 'lg:flex-row-reverse lg:text-right' : ''"
                >
                  <span class="w-1.5 h-1.5 mt-2 flex-shrink-0" :class="`bg-${exp.color}`" />
                  {{ highlight }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.direction-rtl {
  direction: rtl;
}

.direction-ltr {
  direction: ltr;
}
</style>
