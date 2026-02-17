<script setup lang="ts">
import { featuredProjects } from '~/constants/projects'

const sectionRef = ref<HTMLElement>()

const projectGradients = [
  'linear-gradient(135deg, #0047FF 0%, #8B00FF 100%)',
  'linear-gradient(135deg, #FF3333 0%, #FF6B00 100%)',
  'linear-gradient(135deg, #00FF88 0%, #00F5FF 100%)',
  'linear-gradient(135deg, #FFD600 0%, #FF6B00 100%)',
  'linear-gradient(135deg, #8B00FF 0%, #FF3333 100%)',
]

const projectPatterns = [
  'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.08) 0%, transparent 50%)',
  'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)',
  'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(255,255,255,0.06) 0%, transparent 30%)',
  'repeating-conic-gradient(rgba(255,255,255,0.03) 0% 25%, transparent 0% 50%) 50% / 40px 40px',
  'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 40%), linear-gradient(0deg, rgba(255,255,255,0.04) 0%, transparent 30%)',
]

onMounted(async () => {
  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  if (!sectionRef.value)
    return

  // Header animation
  gsap.from('.projects__header', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 80%',
    },
  })

  // Cards stagger
  gsap.from('.project-card', {
    y: 80,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.projects__grid',
      start: 'top 85%',
    },
  })
})
</script>

<template>
  <section id="work" ref="sectionRef" class="projects section-padding" aria-label="Selected Work">
    <div class="page-max">
      <!-- Header -->
      <div class="projects__header">
        <h2 class="text-h2">
          Selected Work
        </h2>
        <span class="projects__count glass">{{ featuredProjects.length }}</span>
      </div>

      <!-- Grid -->
      <div class="projects__grid">
        <article
          v-for="(project, index) in featuredProjects"
          :key="project.id"
          class="project-card"
          :data-cursor-label="project.url ? 'View' : 'Details'"
        >
          <!-- Visual -->
          <div class="project-card__visual">
            <div
              class="project-card__gradient"
              :style="{
                background: projectGradients[index % projectGradients.length],
              }"
            />
            <div
              class="project-card__pattern"
              :style="{
                background: projectPatterns[index % projectPatterns.length],
              }"
            />
            <span class="project-card__year text-label">{{ project.year }}</span>
          </div>

          <!-- Info -->
          <div class="project-card__info">
            <span class="project-card__category text-label">{{ project.category }}</span>
            <h3 class="project-card__title text-h3">
              {{ project.name }}
            </h3>
            <p class="project-card__description text-small">
              {{ project.description }}
            </p>
            <div class="project-card__tech">
              <span v-for="tech in project.technologies" :key="tech" class="project-card__tag">
                {{ tech }}
              </span>
            </div>
          </div>

          <!-- Link overlay -->
          <a
            v-if="project.url"
            :href="project.url"
            target="_blank"
            rel="noopener noreferrer"
            class="project-card__link"
            :aria-label="`View ${project.name}`"
          />
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.projects__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.projects__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  font-size: var(--text-small);
  font-weight: 700;
}

.projects__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--grid-gap);
}

.project-card {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--color-bg-secondary);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.project-card:first-child {
  grid-column: span 2;
}

.project-card__visual {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.project-card:first-child .project-card__visual {
  aspect-ratio: 21 / 9;
}

.project-card__gradient {
  position: absolute;
  inset: 0;
  opacity: 0.8;
  transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.project-card:hover .project-card__gradient {
  transform: scale(1.05);
}

.project-card__pattern {
  position: absolute;
  inset: 0;
}

.project-card__year {
  position: absolute;
  top: 1rem;
  right: 1rem;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(0, 0, 0, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-full);
  backdrop-filter: blur(10px);
}

.project-card__info {
  padding: 1.5rem;
}

.project-card__category {
  color: var(--color-accent-light);
  margin-bottom: 0.5rem;
  display: block;
}

.project-card__title {
  margin-bottom: 0.75rem;
}

.project-card__description {
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-card__tech {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.project-card__tag {
  font-size: var(--text-label);
  font-weight: 500;
  color: var(--color-text-tertiary);
  padding: 0.25rem 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
}

.project-card__link {
  position: absolute;
  inset: 0;
  z-index: 1;
}

@media (max-width: 768px) {
  .projects__grid {
    grid-template-columns: 1fr;
  }

  .project-card:first-child {
    grid-column: span 1;
  }

  .project-card:first-child .project-card__visual {
    aspect-ratio: 16 / 9;
  }
}
</style>
