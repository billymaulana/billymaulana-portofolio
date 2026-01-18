<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const gridRef = ref<HTMLElement | null>(null)

interface Skill {
  name: string
  icon: string
  color: string
  category: string
}

const skills: Skill[] = [
  { name: 'Vue.js', icon: 'i-logos-vue', color: 'primary', category: 'Frontend' },
  { name: 'Nuxt', icon: 'i-logos-nuxt-icon', color: 'primary', category: 'Frontend' },
  { name: 'TypeScript', icon: 'i-logos-typescript-icon', color: 'accent', category: 'Language' },
  { name: 'JavaScript', icon: 'i-logos-javascript', color: 'warning', category: 'Language' },
  { name: 'React', icon: 'i-logos-react', color: 'accent', category: 'Frontend' },
  { name: 'Next.js', icon: 'i-logos-nextjs-icon', color: 'text', category: 'Frontend' },
  { name: 'GSAP', icon: 'i-logos-greensock-icon', color: 'primary', category: 'Animation' },
  { name: 'Three.js', icon: 'i-logos-threejs', color: 'text', category: 'Animation' },
  { name: 'Tailwind', icon: 'i-logos-tailwindcss-icon', color: 'accent', category: 'Styling' },
  { name: 'UnoCSS', icon: 'i-logos-unocss', color: 'text', category: 'Styling' },
  { name: 'Pinia', icon: 'i-logos-pinia', color: 'warning', category: 'State' },
  { name: 'GraphQL', icon: 'i-logos-graphql', color: 'secondary', category: 'API' },
  { name: 'Node.js', icon: 'i-logos-nodejs-icon', color: 'primary', category: 'Backend' },
  { name: 'Docker', icon: 'i-logos-docker-icon', color: 'accent', category: 'DevOps' },
  { name: 'Git', icon: 'i-logos-git-icon', color: 'secondary', category: 'Tools' },
  { name: 'Figma', icon: 'i-logos-figma', color: 'electric', category: 'Design' },
  { name: 'Vite', icon: 'i-logos-vitejs', color: 'electric', category: 'Tools' },
  { name: 'Webpack', icon: 'i-logos-webpack', color: 'accent', category: 'Tools' },
]

const categories = computed(() => {
  const map = new Map<string, Skill[]>()
  for (const skill of skills) {
    const existing = map.get(skill.category) || []
    existing.push(skill)
    map.set(skill.category, existing)
  }
  return map
})

onMounted(async () => {
  try {
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')

    gsap.registerPlugin(ScrollTrigger)

    const items = gridRef.value?.querySelectorAll('.skill-card')

    if (items && items.length > 0) {
      gsap.fromTo(
        items,
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: gridRef.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    }
  }
  catch (error) {
    console.warn('Skills animation failed:', error)
  }
})
</script>

<template>
  <section
    id="skills"
    ref="sectionRef"
    class="py-20 md:py-32 relative overflow-hidden"
  >
    <div class="absolute inset-0 grid-bg opacity-50" />

    <div class="container-custom section-padding relative z-10">
      <div class="text-center mb-16">
        <span class="font-mono text-primary text-sm uppercase tracking-widest mb-4 block">
          Technical Arsenal
        </span>
        <h2 class="text-fluid-3xl font-accent">
          SKILLS &<br>
          <span class="text-primary">TECHNOLOGIES</span>
        </h2>
      </div>

      <div ref="gridRef" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
        <div
          v-for="skill in skills"
          :key="skill.name"
          class="skill-card brutalist-card flex flex-col items-center justify-center p-4 aspect-square group cursor-pointer"
        >
          <div
            class="w-10 h-10 md:w-12 md:h-12 mb-2 transition-transform duration-300 group-hover:scale-110"
            :class="skill.icon"
          />
          <span class="font-mono text-xs text-center text-text-muted group-hover:text-primary transition-colors">
            {{ skill.name }}
          </span>
        </div>
      </div>

      <div class="mt-16 grid md:grid-cols-3 gap-6">
        <div class="brutalist-card text-center">
          <div class="i-carbon-code w-8 h-8 text-primary mx-auto mb-4" />
          <h3 class="font-display font-bold text-lg mb-2">Clean Code</h3>
          <p class="text-sm text-text-muted">
            Writing maintainable, scalable, and well-documented code following best practices
          </p>
        </div>
        <div class="brutalist-card text-center">
          <div class="i-carbon-lightning w-8 h-8 text-secondary mx-auto mb-4" />
          <h3 class="font-display font-bold text-lg mb-2">Performance</h3>
          <p class="text-sm text-text-muted">
            Optimizing for speed with lazy loading, code splitting, and efficient algorithms
          </p>
        </div>
        <div class="brutalist-card text-center">
          <div class="i-carbon-accessibility w-8 h-8 text-accent mx-auto mb-4" />
          <h3 class="font-display font-bold text-lg mb-2">Accessibility</h3>
          <p class="text-sm text-text-muted">
            Building inclusive experiences that work for everyone, following WCAG guidelines
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
