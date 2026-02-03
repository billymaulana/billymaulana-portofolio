<script setup lang="ts">
import { useTextScramble } from '~/composables/useTextScramble'
import { featuredProjects } from '~/data/projects'

const sectionRef = ref<HTMLElement | null>(null)
const projectRefs = ref<HTMLElement[]>([])
const imageRef = ref<HTMLElement | null>(null)
const { setupHoverScramble } = useTextScramble()

// Hover image state
const hoverState = reactive({
  isVisible: false,
  x: 0,
  y: 0,
  currentImage: '',
  currentProject: '',
})

function setProjectRef(el: HTMLElement | null, index: number) {
  if (el)
    projectRefs.value[index] = el
}

function formatIndex(index: number): string {
  return String(index + 1).padStart(2, '0')
}

function onProjectEnter(project: typeof featuredProjects[0], e: MouseEvent) {
  hoverState.isVisible = true
  hoverState.currentImage = project.thumbnail || '/assets/images/accent/Escultures.png'
  hoverState.currentProject = project.name
  updateImagePosition(e)
}

function onProjectMove(e: MouseEvent) {
  updateImagePosition(e)
}

function onProjectLeave() {
  hoverState.isVisible = false
}

function updateImagePosition(e: MouseEvent) {
  hoverState.x = e.clientX
  hoverState.y = e.clientY
}

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  // Setup text scramble on project names
  projectRefs.value.forEach((el) => {
    const nameEl = el?.querySelector('.project-name')
    if (nameEl) {
      setupHoverScramble(nameEl as HTMLElement)
    }
  })

  // Animate section title with dramatic clip-path reveal
  const titleEl = sectionRef.value?.querySelector('.section-title')
  if (titleEl) {
    const lines = titleEl.querySelectorAll('.title-line')
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: titleEl,
        start: 'top 85%',
      },
    })

    tl.fromTo(lines, {
      y: 120,
      opacity: 0,
      filter: 'blur(20px)',
      rotateX: -45,
    }, {
      y: 0,
      opacity: 1,
      filter: 'blur(0px)',
      rotateX: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'expo.out',
    })
  }

  // Animate section meta
  const metaEl = sectionRef.value?.querySelector('.section-meta')
  if (metaEl) {
    gsap.fromTo(metaEl, {
      opacity: 0,
      x: 30,
    }, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: metaEl,
        start: 'top 85%',
      },
    })
  }

  // Animate project items with premium stagger
  projectRefs.value.forEach((el) => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
      },
    })

    // Line draws first
    const line = el.querySelector('.project-line')
    if (line) {
      tl.fromTo(line, { scaleX: 0 }, {
        scaleX: 1,
        duration: 0.8,
        ease: 'power3.inOut',
      }, 0)
    }

    // Content fades in with blur
    tl.fromTo(el.querySelector('.project-link'), {
      opacity: 0,
      y: 40,
      filter: 'blur(10px)',
    }, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: 'power3.out',
    }, 0.2)

    // Index number slides in
    tl.fromTo(el.querySelector('.project-index'), {
      opacity: 0,
      x: -20,
    }, {
      opacity: 1,
      x: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, 0.3)
  })

  // View all button entrance
  const ctaEl = sectionRef.value?.querySelector('.works-cta')
  if (ctaEl) {
    gsap.fromTo(ctaEl, {
      opacity: 0,
      y: 30,
      scale: 0.95,
    }, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: ctaEl,
        start: 'top 90%',
      },
    })
  }
})
</script>

<template>
  <section id="works" ref="sectionRef" class="works-section">
    <!-- Floating hover image -->
    <Teleport to="body">
      <div
        ref="imageRef"
        class="hover-image"
        :class="{ 'is-visible': hoverState.isVisible }"
        :style="{
          transform: `translate(${hoverState.x}px, ${hoverState.y}px)`,
        }"
      >
        <div class="hover-image-inner">
          <img :src="hoverState.currentImage" :alt="hoverState.currentProject">
        </div>
      </div>
    </Teleport>

    <div class="works-header">
      <h2 class="section-title">
        <span class="title-line">Selected</span>
        <span class="title-line title-outline">Works</span>
      </h2>
      <div class="section-meta">
        <span class="section-count">({{ String(featuredProjects.length).padStart(2, '0') }})</span>
        <span class="section-label">Featured</span>
      </div>
    </div>

    <div class="works-list">
      <article
        v-for="(project, index) in featuredProjects"
        :key="project.id"
        :ref="(el: any) => setProjectRef(el as unknown as HTMLElement, index)"
        class="project-item"
        @mouseenter="(e) => onProjectEnter(project, e)"
        @mousemove="onProjectMove"
        @mouseleave="onProjectLeave"
      >
        <a :href="`/projects/${project.id}`" class="project-link" data-cursor-label="View" data-cursor-mode="view">
          <span class="project-index">{{ formatIndex(index) }}</span>

          <div class="project-info">
            <h3 class="project-name">
              {{ project.name }}
            </h3>
          </div>

          <span class="project-category">{{ project.category }}</span>

          <div class="project-arrow">
            <NuxtIcon name="ph:arrow-up-right" />
          </div>
        </a>
        <div class="project-line" />
      </article>
    </div>

    <!-- View All CTA -->
    <div class="works-cta">
      <a href="/projects" class="view-all-btn" data-cursor-label="All" data-cursor-mode="view">
        View All Projects
      </a>
    </div>
  </section>
</template>

<style scoped>
.works-section {
  padding: 160px 64px;
  max-width: 1440px;
  margin: 0 auto;
  position: relative;
  background: #000;
}

@media (max-width: 1024px) {
  .works-section {
    padding: 120px 48px;
  }
}

@media (max-width: 768px) {
  .works-section {
    padding: 80px 24px;
  }
}

/* Hover Image - Grayscale */
.hover-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 400px;
  height: 280px;
  pointer-events: none;
  z-index: 100;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hover-image.is-visible {
  opacity: 1;
}

.hover-image-inner {
  width: 100%;
  height: 100%;
  overflow: hidden;
  transform: scale(0.9) rotate(-3deg);
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
}

.hover-image.is-visible .hover-image-inner {
  transform: scale(1) rotate(0deg);
}

.hover-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(100%) contrast(1.1);
  transition: filter 0.4s ease;
}

.hover-image.is-visible img {
  filter: grayscale(0%) contrast(1);
}

/* Header */
.works-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 80px;
  padding-bottom: 48px;
  border-bottom: 1px solid rgba(124, 58, 237, 0.15);
}

.section-title {
  font-family: 'Satoshi', sans-serif;
  font-size: clamp(48px, 10vw, 120px);
  font-weight: 900;
  line-height: 0.9;
  letter-spacing: -0.03em;
  text-transform: lowercase;
  margin: 0;
  color: #fff;
}

.title-line {
  display: block;
}

/* White outline for "Works" */
.title-outline {
  -webkit-text-stroke: 2px #fff;
  -webkit-text-fill-color: transparent;
}

.section-meta {
  text-align: right;
}

.section-count {
  display: block;
  font-family: 'Satoshi', sans-serif;
  font-size: 32px;
  font-weight: 700;
  color: rgba(124, 58, 237, 0.5);
  line-height: 1;
}

.section-label {
  font-family: 'Satoshi', sans-serif;
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: rgba(255, 255, 255, 0.4);
}

/* Project List */
.works-list {
  display: flex;
  flex-direction: column;
}

.project-item {
  position: relative;
}

.project-link {
  display: grid;
  grid-template-columns: 60px 1fr auto auto;
  align-items: center;
  padding: 32px 0;
  text-decoration: none;
  color: inherit;
  gap: 32px;
  transition: padding 0.3s ease;
}

.project-item:hover .project-link {
  padding-left: 20px;
}

/* Line with purple tint */
.project-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(124, 58, 237, 0.15);
  transform-origin: left;
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.project-item:hover .project-line {
  background: #7C3AED;
  box-shadow: 0 0 20px rgba(124, 58, 237, 0.4);
}

.project-index {
  font-family: 'Satoshi', sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(124, 58, 237, 0.4);
  transition: color 0.3s ease;
}

.project-item:hover .project-index {
  color: #7C3AED;
}

.project-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.project-name {
  font-family: 'Satoshi', sans-serif;
  font-size: clamp(24px, 4vw, 48px);
  font-weight: 700;
  margin: 0;
  color: #fff;
  transition: color 0.3s ease, transform 0.3s ease;
}

.project-item:hover .project-name {
  color: #7C3AED;
  transform: translateX(10px);
}

.project-category {
  font-family: 'Satoshi', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.4);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.project-arrow {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(124, 58, 237, 0.3);
  border-radius: 50%;
  font-size: 20px;
  color: rgba(124, 58, 237, 0.5);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateX(-20px);
}

.project-item:hover .project-arrow {
  opacity: 1;
  transform: translateX(0);
  border-color: #7C3AED;
  color: #7C3AED;
}

/* View All CTA */
.works-cta {
  display: flex;
  justify-content: center;
  margin-top: 80px;
}

.view-all-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  background: transparent;
  border: 1px solid rgba(124, 58, 237, 0.3);
  font-family: 'Satoshi', sans-serif;
  font-size: 13px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: white;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.view-all-btn:hover {
  background: #7C3AED;
  border-color: #7C3AED;
  color: #000;
  box-shadow: 0 0 40px rgba(124, 58, 237, 0.4);
}

/* Responsive */
@media (max-width: 1024px) {
  .hover-image {
    display: none;
  }
}

@media (max-width: 768px) {
  .works-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 48px;
    padding-bottom: 32px;
  }

  .section-meta {
    text-align: left;
  }

  .title-outline {
    -webkit-text-stroke: 1.5px #fff;
  }

  .project-link {
    grid-template-columns: 40px 1fr auto;
    gap: 16px;
    padding: 24px 0;
  }

  .project-category {
    display: none;
  }

  .project-arrow {
    width: 40px;
    height: 40px;
    opacity: 1;
    transform: none;
  }
}
</style>
