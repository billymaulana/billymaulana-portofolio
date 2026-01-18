<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const statsRef = ref<HTMLElement | null>(null)

const stats = [
  { value: '7+', label: 'Years Experience' },
  { value: '50+', label: 'Projects Completed' },
  { value: '6', label: 'Companies Worked' },
  { value: '100%', label: 'Client Satisfaction' },
]

onMounted(async () => {
  try {
    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')

    gsap.registerPlugin(ScrollTrigger)

    if (contentRef.value && sectionRef.value) {
      gsap.fromTo(
        contentRef.value,
        { x: -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    }

    if (statsRef.value?.children) {
      gsap.fromTo(
        statsRef.value.children,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statsRef.value,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      )
    }
  }
  catch (error) {
    console.warn('About animation failed:', error)
  }
})
</script>

<template>
  <section
    id="about"
    ref="sectionRef"
    class="min-h-screen flex items-center relative py-20 md:py-32"
  >
    <div class="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent" />

    <div class="container-custom section-padding">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div ref="contentRef" class="opacity-0">
          <span class="font-mono text-primary text-sm uppercase tracking-widest mb-4 block">
            About Me
          </span>
          <h2 class="text-fluid-3xl font-accent mb-6">
            CRAFTING DIGITAL<br>
            <span class="text-primary">EXPERIENCES</span>
          </h2>

          <div class="space-y-4 text-text-muted text-fluid-base leading-relaxed">
            <p>
              I'm a passionate Front-End Developer based in <span class="text-accent">Bandung, Indonesia</span>.
              With over 7 years of experience, I specialize in building complex web applications
              and internal frameworks using the Vue.js ecosystem.
            </p>
            <p>
              My journey in web development started at <span class="text-secondary">SMK Negeri 2 Bandung</span>,
              where I studied Software Engineering. Since then, I've worked with various companies
              including fintech startups, digital agencies, and enterprise solutions.
            </p>
            <p>
              I believe in creating <span class="text-primary">pixel-perfect</span>, accessible,
              and performant web experiences. When I'm not coding, you'll find me exploring
              new technologies and contributing to open-source projects.
            </p>
          </div>

          <div class="mt-8 flex flex-wrap gap-4">
            <a
              href="https://linkedin.com/in/billy-maulana"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-ghost"
            >
              <span class="i-simple-icons-linkedin mr-2" />
              LinkedIn
            </a>
            <a
              href="mailto:billymaulana1999@gmail.com"
              class="btn"
            >
              <span class="i-carbon-email mr-2" />
              Email Me
            </a>
          </div>
        </div>

        <div ref="statsRef" class="grid grid-cols-2 gap-4">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="brutalist-card group opacity-0"
          >
            <span class="text-fluid-4xl font-accent text-primary block mb-2 group-hover:text-secondary transition-colors">
              {{ stat.value }}
            </span>
            <span class="font-mono text-sm text-text-muted uppercase tracking-wider">
              {{ stat.label }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
