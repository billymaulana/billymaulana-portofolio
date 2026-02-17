<script setup lang="ts">
import { profile } from '~/constants/profile'

const sectionRef = ref<HTMLElement>()
const emailRef = ref<HTMLElement>()
const emailMouse = reactive({ x: 0, y: 0 })

function onEmailMouseMove(e: MouseEvent) {
  if (!emailRef.value)
    return
  const rect = emailRef.value.getBoundingClientRect()
  emailMouse.x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
  emailMouse.y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
}

function onEmailMouseLeave() {
  emailMouse.x = 0
  emailMouse.y = 0
}

const emailStyle = computed(() => ({
  '--email-x': `${emailMouse.x * 4}px`,
  '--email-y': `${emailMouse.y * 4}px`,
}))

const socials = [
  { name: 'GitHub', url: profile.github, icon: 'i-carbon-logo-github' },
  { name: 'LinkedIn', url: profile.linkedin, icon: 'i-carbon-logo-linkedin' },
  { name: 'Instagram', url: profile.instagram, icon: 'i-carbon-logo-instagram' },
]

onMounted(async () => {
  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  if (!sectionRef.value)
    return

  gsap.from('.contact__content > *', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: sectionRef.value,
      start: 'top 75%',
    },
  })
})
</script>

<template>
  <section id="contact" ref="sectionRef" class="contact section-padding" aria-label="Contact">
    <div class="contact__content page-max">
      <span class="contact__label text-label">Get in Touch</span>

      <h2 class="contact__heading text-h1">
        Let's Talk
      </h2>

      <!-- Email link with chromatic hover -->
      <a
        ref="emailRef"
        :href="`mailto:${profile.email}`"
        class="contact__email"
        :style="emailStyle"
        data-cursor-label="Email"
        @mousemove="onEmailMouseMove"
        @mouseleave="onEmailMouseLeave"
      >
        {{ profile.email }}
      </a>

      <!-- Location -->
      <p class="contact__location text-body">
        <span class="i-carbon-location" aria-hidden="true" />
        {{ profile.location }}
      </p>

      <!-- Socials -->
      <div class="contact__socials">
        <UiMagneticButton
          v-for="social in socials"
          :key="social.name"
          tag="a"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="contact__social"
          :aria-label="social.name"
          :data-cursor-label="social.name"
        >
          <span :class="social.icon" />
          <span class="contact__social-name">{{ social.name }}</span>
        </UiMagneticButton>
      </div>

      <!-- Decorative elements -->
      <div class="contact__decor" aria-hidden="true">
        <div class="contact__decor-circle" />
        <div class="contact__decor-line" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact {
  position: relative;
  overflow: hidden;
}

.contact__content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.contact__label {
  color: var(--color-accent-light);
  margin-bottom: 1rem;
}

.contact__heading {
  margin-bottom: 2.5rem;
}

.contact__email {
  --email-x: 0px;
  --email-y: 0px;
  font-size: clamp(1.25rem, 3vw, 2.5rem);
  font-weight: 700;
  color: var(--color-text-primary);
  padding: 1rem 2rem;
  border-radius: var(--radius-lg);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  text-shadow:
    var(--email-x) var(--email-y) 0 rgba(255, 51, 51, 0.3),
    calc(var(--email-x) * -1) calc(var(--email-y) * -1) 0 rgba(0, 71, 255, 0.3);
  margin-bottom: 1.5rem;
  word-break: break-all;
}

.contact__email:hover {
  background: rgba(255, 255, 255, 0.03);
  transform: scale(1.02);
}

.contact__location {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-secondary);
  margin-bottom: 3rem;
}

.contact__socials {
  display: flex;
  gap: 1rem;
}

.contact__social {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-full);
  color: var(--color-text-secondary);
  font-size: var(--text-small);
  font-weight: 500;
  transition: all 0.3s;
}

.contact__social:hover {
  color: var(--color-text-primary);
  border-color: var(--color-accent);
  background: rgba(0, 71, 255, 0.05);
}

.contact__social span:first-child {
  font-size: 1.25rem;
}

.contact__decor {
  position: absolute;
  bottom: -100px;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
}

.contact__decor-circle {
  width: 400px;
  height: 400px;
  border-radius: 50%;
  border: 1px solid rgba(0, 71, 255, 0.1);
  animation: ringRotate 30s linear infinite;
}

.contact__decor-line {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1px;
  height: 200px;
  background: linear-gradient(to bottom, var(--color-accent-glow), transparent);
}

@keyframes ringRotate {
  to {
    transform: translateX(-50%) rotate(360deg);
  }
}

@media (max-width: 640px) {
  .contact__socials {
    flex-direction: column;
    width: 100%;
  }

  .contact__social {
    justify-content: center;
  }

  .contact__social-name {
    display: inline;
  }
}
</style>
