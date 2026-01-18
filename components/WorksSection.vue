<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const worksRef = ref<HTMLElement | null>(null)

interface Project {
  title: string
  description: string
  tags: string[]
  color: string
  link?: string
}

const projects: Project[] = [
  {
    title: 'GPay Dashboard',
    description: 'Fintech payment dashboard with real-time transaction monitoring and analytics visualization.',
    tags: ['Vue 3', 'TypeScript', 'TailwindCSS', 'Chart.js'],
    color: 'primary',
  },
  {
    title: 'KreditPlus Portal',
    description: 'Multi-purpose loan management system with complex form workflows and document processing.',
    tags: ['Nuxt 3', 'Pinia', 'REST API', 'SCSS'],
    color: 'secondary',
  },
  {
    title: 'IndoChat App',
    description: 'Real-time messaging application with WebSocket integration and multimedia support.',
    tags: ['Vue 3', 'WebSocket', 'IndexedDB', 'PWA'],
    color: 'accent',
  },
  {
    title: 'Vhiweb Projects',
    description: 'Multiple client projects including e-commerce, corporate sites, and web applications.',
    tags: ['Vue 2/3', 'Nuxt', 'Laravel', 'GraphQL'],
    color: 'electric',
  },
  {
    title: 'HWTours Platform',
    description: 'Travel booking platform with accommodation, flight, and tour package management.',
    tags: ['PHP', 'Laravel', 'MySQL', 'jQuery'],
    color: 'warning',
  },
  {
    title: 'Open Source',
    description: 'Contributing to Vue ecosystem and maintaining personal open-source libraries.',
    tags: ['Vue', 'TypeScript', 'NPM', 'GitHub'],
    color: 'primary',
  },
]

onMounted(async () => {
  try {
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')

    gsap.registerPlugin(ScrollTrigger)

    const cards = worksRef.value?.querySelectorAll('.work-card')

    cards?.forEach((card) => {
      gsap.fromTo(
        card,
        { y: 100, opacity: 0, rotateX: -15 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    })
  }
  catch (error) {
    console.warn('Works animation failed:', error)
  }
})
</script>

<template>
  <section
    id="works"
    ref="sectionRef"
    class="py-20 md:py-32 relative"
  >
    <div class="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-accent/50 to-transparent" />

    <div class="container-custom section-padding">
      <div class="text-center mb-16">
        <span class="font-mono text-primary text-sm uppercase tracking-widest mb-4 block">
          Portfolio
        </span>
        <h2 class="text-fluid-3xl font-accent">
          FEATURED<br>
          <span class="text-primary">WORKS</span>
        </h2>
      </div>

      <div ref="worksRef" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <article
          v-for="project in projects"
          :key="project.title"
          class="work-card brutalist-card group cursor-pointer perspective-card"
          :class="`hover:border-${project.color}`"
        >
          <div class="perspective-card-inner">
            <div class="mb-4 flex items-center justify-between">
              <div class="w-3 h-3" :class="`bg-${project.color}`" />
              <div class="i-carbon-arrow-up-right w-5 h-5 text-text-muted group-hover:text-primary transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>

            <h3 class="font-display font-bold text-xl mb-2 group-hover:text-primary transition-colors">
              {{ project.title }}
            </h3>

            <p class="text-text-muted text-sm mb-4 line-clamp-3">
              {{ project.description }}
            </p>

            <div class="flex flex-wrap gap-2 mt-auto">
              <span
                v-for="tag in project.tags"
                :key="tag"
                class="font-mono text-xs px-2 py-1 bg-surface-lighter text-text-muted"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </article>
      </div>

      <div class="mt-12 text-center">
        <a
          href="https://github.com/billymaulana"
          target="_blank"
          rel="noopener noreferrer"
          class="btn-ghost inline-flex items-center gap-2"
        >
          <span class="i-simple-icons-github" />
          View More on GitHub
        </a>
      </div>
    </div>
  </section>
</template>
