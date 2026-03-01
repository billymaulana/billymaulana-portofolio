<script setup lang="ts">
/**
 * SectionProjects: "The Evidence"
 *
 * Full-width stacked case studies. Each project is a horizontal
 * composition with oversized index numbers, SVG-patterned image areas,
 * corner brackets, and clip-path hover reveals.
 *
 * Entrance: clipPath inset(100% 0 0 0) → inset(0) per card
 * Adjacent above: SectionAbout — diagonal clip-path reveal
 * Adjacent below: SectionMarquee — elastic overshoot from offsets
 *
 * Visual objects:
 *  - SVG dot-grid pattern overlay per image area
 *  - Corner bracket L-shapes (architectural markup)
 *  - Oversized stroke index numbers with inverse parallax
 *  - Horizontal scroll-progress line
 *  - clipPath "VIEW PROJECT" hover reveal
 */

import type { Project } from '~/constants/projects'
import { featuredProjects } from '~/constants/projects'

function getProjectUrl(project: Project): string | undefined {
  return project.url || project.playStore || project.appStore
}

function formatIndex(i: number): string {
  return String(i + 1).padStart(2, '0')
}

const { scramble, reset } = useTextScramble({ speed: 25, iterations: 4 })

function handleLinkEnter(event: Event) {
  const target = event.currentTarget as HTMLElement
  const textEl = target.querySelector('.projects__link-text') as HTMLElement | null
  if (textEl)
    scramble(textEl)
}

function handleLinkLeave(event: Event) {
  const target = event.currentTarget as HTMLElement
  const textEl = target.querySelector('.projects__link-text') as HTMLElement | null
  if (textEl)
    reset(textEl)
}

// 3D tilt + spotlight tracking on project visuals
function handleVisualMouseMove(event: MouseEvent) {
  const visual = event.currentTarget as HTMLElement
  const rect = visual.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width // 0-1
  const y = (event.clientY - rect.top) / rect.height // 0-1
  visual.style.setProperty('--mx', `${x}`)
  visual.style.setProperty('--my', `${y}`)
}

function handleVisualTouchMove(event: TouchEvent) {
  const touch = event.touches[0]
  if (!touch)
    return
  const visual = event.currentTarget as HTMLElement
  const rect = visual.getBoundingClientRect()
  const x = (touch.clientX - rect.left) / rect.width
  const y = (touch.clientY - rect.top) / rect.height
  visual.style.setProperty('--mx', `${Math.max(0, Math.min(1, x))}`)
  visual.style.setProperty('--my', `${Math.max(0, Math.min(1, y))}`)
}

function handleVisualTouchEnd(event: Event) {
  const visual = event.currentTarget as HTMLElement
  visual.style.setProperty('--mx', '0.5')
  visual.style.setProperty('--my', '0.5')
}

function handleVisualMouseLeave(event: MouseEvent) {
  const visual = event.currentTarget as HTMLElement
  visual.style.setProperty('--mx', '0.5')
  visual.style.setProperty('--my', '0.5')
}

// Template refs
const sectionRef = ref<HTMLElement>()
const progressRef = ref<HTMLElement>()
const headerRef = ref<HTMLElement>()
const cardRefs = ref<HTMLElement[]>([])

let ctx: gsap.Context | null = null

onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced)
    return

  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  ctx = gsap.context(() => {
    if (!sectionRef.value)
      return

    // 1. Horizontal progress line — scrubbed to scroll across entire section
    if (progressRef.value) {
      gsap.fromTo(progressRef.value, {
        scaleX: 0,
      }, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: 0.3,
        },
      })
    }

    // 2. Header: clip-path wipe from bottom
    if (headerRef.value) {
      const labelEl = headerRef.value.querySelector('.projects__label')
      const titleEl = headerRef.value.querySelector('.projects__title')

      if (labelEl) {
        gsap.from(labelEl, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.value,
            start: 'top 85%',
          },
        })
      }

      if (titleEl) {
        gsap.from(titleEl, {
          clipPath: 'inset(100% 0 0 0)',
          duration: 1.2,
          ease: 'expo.inOut',
          scrollTrigger: {
            trigger: headerRef.value,
            start: 'top 85%',
          },
        })
      }
    }

    // 3. Per-card animations
    cardRefs.value.forEach((card) => {
      if (!card)
        return

      // Card reveal: clipPath from bottom
      gsap.from(card, {
        clipPath: 'inset(100% 0 0 0)',
        duration: 1.4,
        ease: 'expo.inOut',
        scrollTrigger: {
          trigger: card,
          start: 'top 88%',
        },
      })

      // Image area: slight parallax
      const imageArea = card.querySelector('.projects__visual')
      if (imageArea) {
        gsap.to(imageArea, {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        })
      }

      // Index number: inverse parallax (moves opposite)
      const indexNum = card.querySelector('.projects__index')
      if (indexNum) {
        gsap.to(indexNum, {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: {
            trigger: card,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        })
      }

      // Info children: staggered blur-to-sharp reveal
      const infoChildren = card.querySelectorAll('.projects__info > *')
      if (infoChildren.length) {
        gsap.from(infoChildren, {
          x: -20,
          opacity: 0,
          filter: 'blur(3px)',
          duration: 0.9,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
          },
        })
      }

      // Tech tags: rapid stagger
      const tags = card.querySelectorAll('.projects__tag')
      if (tags.length) {
        gsap.from(tags, {
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          stagger: 0.03,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 75%',
          },
        })
      }

      // View link arrow
      const arrow = card.querySelector('.projects__link-arrow')
      if (arrow) {
        gsap.from(arrow, {
          x: -10,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 75%',
          },
        })
      }
    })
  })
})

onUnmounted(() => {
  ctx?.revert()
})
</script>

<template>
  <section
    id="work"
    ref="sectionRef"
    class="projects"
    aria-label="Selected Work"
  >
    <!-- Atmospheric gradient -->
    <div class="projects__atmosphere" aria-hidden="true" />

    <!-- Horizontal scroll-progress line -->
    <div ref="progressRef" class="projects__progress" aria-hidden="true" />

    <!-- Section header -->
    <header ref="headerRef" class="projects__header">
      <span class="projects__label">04</span>
      <h2 class="projects__title">
        SELECTED WORK
      </h2>
    </header>

    <!-- Project entries -->
    <div class="projects__list">
      <article
        v-for="(project, index) in featuredProjects"
        :key="project.id"
        ref="cardRefs"
        class="projects__card"
        :class="{ 'projects__card--reversed': index % 2 !== 0 }"
      >
        <!-- Separator rule -->
        <div class="projects__rule" aria-hidden="true" />

        <div class="projects__layout">
          <!-- Visual area (image placeholder with SVG pattern + brackets) -->
          <div class="projects__visual-wrap">
            <div
              class="projects__visual"
              @mousemove="handleVisualMouseMove"
              @mouseleave="handleVisualMouseLeave"
              @touchmove.passive="handleVisualTouchMove"
              @touchend="handleVisualTouchEnd"
            >
              <!-- Mouse-tracking spotlight -->
              <div class="projects__spotlight" aria-hidden="true" />

              <!-- SVG dot grid overlay -->
              <svg
                class="projects__dot-grid"
                aria-hidden="true"
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    :id="`dot-pattern-${project.id}`"
                    x="0"
                    y="0"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="20" cy="20" r="1" fill="var(--accent-primary)" opacity="0.12" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" :fill="`url(#dot-pattern-${project.id})`" />
              </svg>

              <!-- Watermark project name -->
              <span class="projects__watermark" aria-hidden="true">
                {{ project.name }}
              </span>

              <!-- Corner brackets (architectural L-shapes) -->
              <span class="projects__bracket projects__bracket--tl" aria-hidden="true" />
              <span class="projects__bracket projects__bracket--tr" aria-hidden="true" />
              <span class="projects__bracket projects__bracket--bl" aria-hidden="true" />
              <span class="projects__bracket projects__bracket--br" aria-hidden="true" />

              <!-- "VIEW PROJECT" hover overlay -->
              <span class="projects__view-overlay" aria-hidden="true">
                VIEW PROJECT
              </span>
            </div>
          </div>

          <!-- Info column -->
          <div class="projects__info">
            <div class="projects__meta">
              <span class="projects__category">{{ project.category }}</span>
              <span class="projects__divider">/</span>
              <span class="projects__year">{{ project.year }}</span>
            </div>

            <h3 class="projects__name">
              {{ project.name }}
            </h3>

            <p class="projects__description">
              {{ project.description }}
            </p>

            <!-- Tech tags -->
            <div class="projects__tech">
              <span
                v-for="tech in project.technologies"
                :key="tech"
                class="projects__tag"
              >{{ tech }}</span>
            </div>

            <!-- View link -->
            <a
              v-if="getProjectUrl(project)"
              :href="getProjectUrl(project)"
              target="_blank"
              rel="noopener noreferrer"
              class="projects__link"
              :aria-label="`View ${project.name} project`"
              data-cursor-label="View"
              @mouseenter="handleLinkEnter"
              @mouseleave="handleLinkLeave"
            >
              <span class="projects__link-text">View</span>
              <span class="projects__link-arrow" aria-hidden="true">&rarr;</span>
            </a>
          </div>

          <!-- Oversized index number -->
          <span class="projects__index" aria-hidden="true">
            {{ formatIndex(index) }}
          </span>
        </div>
      </article>
    </div>

    <!-- Ghost section number -->
    <span class="projects__ghost" aria-hidden="true">04</span>
  </section>
</template>

<style scoped>
/* ═══════════════════════════════════════════════════════════════════════
   SECTION PROJECTS: "The Evidence"
   Full-width stacked case studies with architectural markup
   ═══════════════════════════════════════════════════════════════════════ */

.projects {
  position: relative;
  width: 100%;
  padding: var(--section-gap) 0;
  background: var(--void-warm);
  overflow: hidden;
}

/* ─── Atmospheric Gradient ─── */

.projects__atmosphere {
  position: absolute;
  inset: 0;
  z-index: var(--z-atmosphere);
  pointer-events: none;
  background:
    radial-gradient(
      ellipse 50% 40% at 80% 30%,
      rgba(0, 71, 255, 0.08) 0%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 40% 50% at 20% 70%,
      rgba(15, 10, 114, 0.06) 0%,
      transparent 60%
    );
}

/* ─── Scroll Progress Line ─── */

.projects__progress {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--accent-primary);
  box-shadow: 0 0 12px rgba(0, 71, 255, 0.3), 0 2px 20px rgba(0, 71, 255, 0.1);
  transform-origin: left center;
  transform: scaleX(0);
  z-index: var(--z-content);
  will-change: transform;
}

/* ─── Section Header ─── */

.projects__header {
  padding-inline: var(--page-margin);
  margin-bottom: clamp(3rem, 6vh, 5rem);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.projects__label {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--text-tertiary);
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.projects__title {
  font-family: var(--font-statement);
  font-size: clamp(3rem, 7vw, 6rem);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: var(--tracking-tight);
  text-transform: uppercase;
  line-height: 0.9;
  will-change: clip-path;
}

/* ─── Project List ─── */

.projects__list {
  display: flex;
  flex-direction: column;
  gap: clamp(6rem, 12vh, 10rem);
  padding-inline: var(--page-margin);
}

/* ─── Project Card ─── */

.projects__card {
  position: relative;
  will-change: clip-path;
}

.projects__rule {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(0, 71, 255, 0.2) 0%,
    rgba(0, 71, 255, 0.08) 50%,
    transparent 100%
  );
}

.projects__layout {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 4vw, 5rem);
  align-items: start;
  padding-top: var(--space-6);
}

/* Reversed layout for even-indexed cards */
.projects__card--reversed .projects__layout {
  direction: rtl;
}

.projects__card--reversed .projects__layout > * {
  direction: ltr;
}

/* ─── Visual Area (Image Placeholder + Patterns) ─── */

.projects__visual-wrap {
  position: relative;
  overflow: hidden;
}

.projects__visual {
  --mx: 0.5;
  --my: 0.5;
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--surface-1);
  border: 1px solid rgba(0, 71, 255, 0.12);
  overflow: hidden;
  will-change: transform;
  cursor: pointer;
  transition: filter 0.8s var(--ease-out-expo),
              border-color 0.6s var(--ease-out-expo),
              transform 0.6s var(--ease-out-expo);
  transform-style: preserve-3d;
  perspective: 800px;
}

/* 3D tilt on hover — subtle perspective shift driven by --mx/--my */
.projects__card:hover .projects__visual {
  filter: brightness(1.15);
  border-color: rgba(0, 71, 255, 0.3);
  transform:
    rotateY(calc((var(--mx) - 0.5) * 6deg))
    rotateX(calc((var(--my) - 0.5) * -4deg))
    scale(1.02);
}

/* Mouse-tracking spotlight — radial glow follows cursor */
.projects__spotlight {
  position: absolute;
  inset: 0;
  z-index: 4;
  pointer-events: none;
  opacity: 0;
  background: radial-gradient(
    circle 200px at calc(var(--mx) * 100%) calc(var(--my) * 100%),
    rgba(0, 71, 255, 0.15) 0%,
    transparent 70%
  );
  transition: opacity 0.4s var(--ease-out-expo);
}

.projects__card:hover .projects__spotlight {
  opacity: 1;
}

/* Per-project unique gradient backgrounds — each case study has distinct visual DNA */
.projects__card:nth-child(1) .projects__visual {
  background:
    radial-gradient(ellipse 60% 50% at 30% 40%, rgba(0, 71, 255, 0.08) 0%, transparent 70%),
    linear-gradient(135deg, rgba(0, 71, 255, 0.03) 0%, transparent 50%),
    var(--surface-1);
}

.projects__card:nth-child(2) .projects__visual {
  background:
    radial-gradient(ellipse 50% 60% at 70% 60%, rgba(15, 10, 114, 0.1) 0%, transparent 70%),
    linear-gradient(225deg, rgba(0, 71, 255, 0.04) 0%, transparent 50%),
    var(--surface-1);
}

.projects__card:nth-child(3) .projects__visual {
  background:
    radial-gradient(ellipse 55% 45% at 50% 35%, rgba(0, 163, 255, 0.06) 0%, transparent 70%),
    linear-gradient(180deg, rgba(0, 71, 255, 0.03) 0%, transparent 40%),
    var(--surface-1);
}

.projects__card:nth-child(4) .projects__visual {
  background:
    radial-gradient(ellipse 40% 55% at 25% 65%, rgba(0, 71, 255, 0.07) 0%, transparent 70%),
    linear-gradient(315deg, rgba(15, 10, 114, 0.05) 0%, transparent 50%),
    var(--surface-1);
}

.projects__card:nth-child(5) .projects__visual {
  background:
    radial-gradient(ellipse 65% 40% at 60% 50%, rgba(161, 224, 231, 0.04) 0%, transparent 70%),
    linear-gradient(90deg, rgba(0, 71, 255, 0.03) 0%, transparent 40%),
    var(--surface-1);
}

/* Scanline overlay on all visual areas */
.projects__visual::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 3px,
    rgba(0, 71, 255, 0.012) 3px,
    rgba(0, 71, 255, 0.012) 4px
  );
}

/* Sweep scan beam (slower, more subtle than About) */
.projects__visual::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(0, 71, 255, 0.25) 30%,
    rgba(0, 163, 255, 0.35) 50%,
    rgba(0, 71, 255, 0.25) 70%,
    transparent 100%
  );
  animation: projects-sweep 8s cubic-bezier(0.45, 0, 0.55, 1) infinite;
  opacity: 0.6;
}

@keyframes projects-sweep {
  0%, 100% { top: -1px; opacity: 0; }
  5% { opacity: 0.6; }
  50% { top: 100%; opacity: 0.4; }
  55% { opacity: 0; }
}

/* SVG dot grid overlay */
.projects__dot-grid {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  transition: opacity 0.6s var(--ease-out-expo);
}

.projects__card:hover .projects__dot-grid {
  opacity: 1;
  filter: brightness(2);
}

/* Watermark project name — visible as design element */
.projects__watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-statement);
  font-size: clamp(3rem, 8vw, 7rem);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: var(--tracking-tight);
  color: transparent;
  -webkit-text-stroke: 1px rgba(0, 71, 255, 0.1);
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
  z-index: 1;
  transition: -webkit-text-stroke-color 0.8s var(--ease-out-expo);
}

.projects__card:hover .projects__watermark {
  -webkit-text-stroke-color: rgba(0, 71, 255, 0.2);
}

/* ─── Corner Brackets (Architectural L-Shapes) ─── */

.projects__bracket {
  position: absolute;
  width: clamp(16px, 2vw, 28px);
  height: clamp(16px, 2vw, 28px);
  z-index: 3;
  pointer-events: none;
  transition: opacity 0.6s var(--ease-out-expo),
              width 0.6s var(--ease-out-expo),
              height 0.6s var(--ease-out-expo);
}

.projects__bracket--tl {
  top: clamp(8px, 1.5vw, 16px);
  left: clamp(8px, 1.5vw, 16px);
  border-top: 1.5px solid rgba(0, 71, 255, 0.3);
  border-left: 1.5px solid rgba(0, 71, 255, 0.3);
}

.projects__bracket--tr {
  top: clamp(8px, 1.5vw, 16px);
  right: clamp(8px, 1.5vw, 16px);
  border-top: 1.5px solid rgba(0, 71, 255, 0.3);
  border-right: 1.5px solid rgba(0, 71, 255, 0.3);
}

.projects__bracket--bl {
  bottom: clamp(8px, 1.5vw, 16px);
  left: clamp(8px, 1.5vw, 16px);
  border-bottom: 1.5px solid rgba(0, 71, 255, 0.3);
  border-left: 1.5px solid rgba(0, 71, 255, 0.3);
}

.projects__bracket--br {
  bottom: clamp(8px, 1.5vw, 16px);
  right: clamp(8px, 1.5vw, 16px);
  border-bottom: 1.5px solid rgba(0, 71, 255, 0.3);
  border-right: 1.5px solid rgba(0, 71, 255, 0.3);
}

/* Brackets expand on hover */
.projects__card:hover .projects__bracket {
  width: clamp(22px, 3vw, 40px);
  height: clamp(22px, 3vw, 40px);
}

.projects__card:hover .projects__bracket--tl,
.projects__card:hover .projects__bracket--tr,
.projects__card:hover .projects__bracket--bl,
.projects__card:hover .projects__bracket--br {
  border-color: rgba(0, 71, 255, 0.6);
}

/* ─── "VIEW PROJECT" Hover Overlay ─── */

.projects__view-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4;
  font-family: var(--font-mono);
  font-size: var(--text-small);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-primary);
  background: rgba(0, 0, 0, 0.5);
  clip-path: inset(50% 50% 50% 50%);
  transition: clip-path 0.6s var(--ease-cinematic);
  pointer-events: none;
}

.projects__card:hover .projects__view-overlay {
  clip-path: inset(0 0 0 0);
}

/* ─── Oversized Index Number ─── */

.projects__index {
  position: absolute;
  top: -0.15em;
  right: -2%;
  font-family: var(--font-statement);
  font-size: clamp(8rem, 20vw, 18rem);
  font-weight: 800;
  line-height: 0.85;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(0, 71, 255, 0.12);
  pointer-events: none;
  user-select: none;
  mix-blend-mode: difference;
  z-index: 0;
  will-change: transform;
  transition: -webkit-text-stroke-color 0.8s var(--ease-out-expo);
}

.projects__card:hover .projects__index {
  -webkit-text-stroke-color: rgba(0, 71, 255, 0.25);
}

/* For reversed cards, index goes to the left */
.projects__card--reversed .projects__index {
  right: auto;
  left: -2%;
}

/* ─── Info Column ─── */

.projects__info {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  padding-top: var(--space-4);
  position: relative;
  z-index: var(--z-content);
}

/* ─── Meta: Category / Year ─── */

.projects__meta {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

.projects__category,
.projects__year {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--text-secondary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.projects__divider {
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--text-tertiary);
}

/* ─── Project Name ─── */

.projects__name {
  font-family: var(--font-statement);
  font-size: var(--text-h2);
  font-weight: 800;
  color: var(--text-primary);
  letter-spacing: var(--tracking-tight);
  line-height: var(--leading-heading);
  text-transform: uppercase;
  transition: color 0.6s var(--ease-out-expo),
              text-shadow 0.6s var(--ease-out-expo);
}

.projects__card:hover .projects__name {
  color: var(--text-primary);
  text-shadow: 0 0 40px rgba(0, 71, 255, 0.3);
}

/* ─── Description ─── */

.projects__description {
  font-family: var(--font-body);
  font-size: var(--text-body);
  color: var(--text-body-color);
  line-height: var(--leading-body);
  max-width: 45ch;
}

/* ─── Tech Tags ─── */

.projects__tech {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.projects__tag {
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--text-tertiary);
  letter-spacing: 0.04em;
  padding: 0.25rem 0.65rem;
  border: 1px solid var(--bg-subtle);
  transition: border-color 0.4s var(--ease-out-expo),
              color 0.4s var(--ease-out-expo);
}

.projects__card:hover .projects__tag {
  border-color: var(--accent-primary);
  color: var(--text-secondary);
}

/* ─── View Link ─── */

.projects__link {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  font-family: var(--font-mono);
  font-size: var(--text-caption);
  color: var(--text-secondary);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  transition: color var(--duration-fast) var(--ease-out-expo);
  width: fit-content;
}

.projects__link:hover {
  color: var(--text-primary);
}

.projects__link-text {
  line-height: 1;
}

.projects__link-arrow {
  font-size: 1.2em;
  line-height: 1;
  transition: transform var(--duration-fast) var(--ease-out-expo);
  will-change: transform;
}

.projects__link:hover .projects__link-arrow {
  transform: translateX(6px);
}

/* ─── Ghost Section Number ─── */

.projects__ghost {
  position: absolute;
  bottom: clamp(2rem, 5vh, 4rem);
  right: var(--page-margin);
  font-family: var(--font-statement);
  font-size: clamp(8rem, 20vw, 20rem);
  font-weight: 800;
  line-height: 0.85;
  color: transparent;
  -webkit-text-stroke: 1.5px rgba(0, 71, 255, 0.06);
  pointer-events: none;
  user-select: none;
  mix-blend-mode: difference;
  z-index: var(--z-ghost);
}

/* ═══════════════════════════════════════════════════════════════════════
   RESPONSIVE
   ═══════════════════════════════════════════════════════════════════════ */

@media (max-width: 768px) {
  .projects__layout {
    grid-template-columns: 1fr;
    gap: var(--space-5);
  }

  /* Reset reversed direction on mobile */
  .projects__card--reversed .projects__layout {
    direction: ltr;
  }

  .projects__index {
    font-size: clamp(5rem, 25vw, 8rem);
    right: 0;
    top: -0.1em;
  }

  .projects__card--reversed .projects__index {
    right: 0;
    left: auto;
  }

  .projects__visual {
    aspect-ratio: 16 / 10;
  }

  .projects__description {
    max-width: none;
  }

  .projects__ghost {
    font-size: clamp(4rem, 20vw, 8rem);
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   REDUCED MOTION
   ═══════════════════════════════════════════════════════════════════════ */

@media (prefers-reduced-motion: reduce) {
  .projects__card {
    clip-path: none !important;
  }

  .projects__title {
    clip-path: none !important;
  }

  .projects__progress {
    transform: scaleX(1) !important;
  }

  .projects__visual,
  .projects__link-arrow,
  .projects__name,
  .projects__tag,
  .projects__bracket,
  .projects__view-overlay,
  .projects__dot-grid {
    transition: none !important;
  }
}

/* ═══════════════════════════════════════════════════════════════════════
   TOUCH-ONLY — prevent sticky hover states on touch devices
   ═══════════════════════════════════════════════════════════════════════ */
@media (hover: none) {
  /* Reduce 3D tilt intensity on touch */
  .projects__card:hover .projects__visual {
    transform:
      rotateY(calc((var(--mx) - 0.5) * 3deg))
      rotateX(calc((var(--my) - 0.5) * -2deg))
      scale(1.01);
  }

  /* Disable view overlay on touch — it blocks scrolling */
  .projects__view-overlay {
    display: none;
  }
}
</style>
