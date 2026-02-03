<script setup lang="ts">
import { profile } from '~/data/profile'

const sectionRef = ref<HTMLElement | null>(null)
const headlineRef = ref<HTMLElement | null>(null)

const socialLinks = [
  { name: 'LinkedIn', url: profile.linkedin, icon: 'mdi:linkedin' },
  { name: 'GitHub', url: profile.github, icon: 'mdi:github' },
]

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  // Animate headline with dramatic 3D entrance
  if (headlineRef.value) {
    const words = headlineRef.value.querySelectorAll('.headline-word')
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: headlineRef.value,
        start: 'top 80%',
      },
    })

    tl.fromTo(words, {
      y: 150,
      opacity: 0,
      rotateX: -60,
      filter: 'blur(20px)',
    }, {
      y: 0,
      opacity: 1,
      rotateX: 0,
      filter: 'blur(0px)',
      duration: 1.2,
      stagger: 0.12,
      ease: 'expo.out',
    })

    // Special animation for accent word - pulse glow
    const accentWord = headlineRef.value.querySelector('.headline-accent')
    if (accentWord) {
      tl.to(accentWord, {
        textShadow: '0 0 80px rgba(124,58,237,0.6)',
        duration: 0.5,
        ease: 'power2.out',
      }, '-=0.3')
    }
  }

  // Animate prism with parallax float
  const prismEl = sectionRef.value?.querySelector('.contact-prism')
  if (prismEl) {
    gsap.fromTo(prismEl, {
      opacity: 0,
      scale: 0.5,
      rotation: -30,
    }, {
      opacity: 0.6,
      scale: 1,
      rotation: 0,
      duration: 1.5,
      ease: 'elastic.out(1, 0.5)',
      scrollTrigger: {
        trigger: prismEl,
        start: 'top 85%',
      },
    })
  }

  // Animate CTA button
  const ctaEl = sectionRef.value?.querySelector('.contact-cta')
  if (ctaEl) {
    gsap.fromTo(ctaEl, {
      y: 40,
      opacity: 0,
      scale: 0.9,
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.7)',
      scrollTrigger: {
        trigger: ctaEl,
        start: 'top 90%',
      },
    })
  }

  // Animate footer elements
  const footerEl = sectionRef.value?.querySelector('.contact-footer')
  if (footerEl) {
    const socials = footerEl.querySelectorAll('.social-link')

    gsap.fromTo(socials, {
      y: 20,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: footerEl,
        start: 'top 90%',
      },
    })
  }
})
</script>

<template>
  <section id="contact" ref="sectionRef" class="contact-section">
    <div class="contact-content">
      <h2 ref="headlineRef" class="contact-headline">
        <span class="headline-word">Ready</span>
        <span class="headline-word">to</span>
        <span class="headline-word">build</span>
        <span class="headline-word headline-accent">together?</span>
      </h2>

      <div class="contact-prism">
        <img
          src="/assets/images/accent/Escultures.png"
          alt="Prism"
          class="prism-image"
        >
      </div>

      <MagneticButton
        tag="a"
        :href="`mailto:${profile.email}`"
        class="contact-cta"
        cursor-label="Start"
      >
        Let's Talk →
      </MagneticButton>
    </div>

    <footer class="contact-footer">
      <div class="footer-left">
        <img
          src="/assets/images/logo/billy-maulana-logo-white.svg"
          alt="Billy Maulana"
          class="footer-logo"
        >
      </div>

      <div class="footer-socials">
        <MagneticButton
          v-for="social in socialLinks"
          :key="social.name"
          tag="a"
          :href="social.url"
          target="_blank"
          :cursor-label="social.name"
          class="social-link"
        >
          <NuxtIcon :name="social.icon" />
          <span class="social-name">{{ social.name }}</span>
        </MagneticButton>
      </div>

      <div class="footer-bottom">
        <span class="footer-copyright">© 2025 {{ profile.name }}</span>
        <span class="footer-location">{{ profile.location }}</span>
      </div>

      <p class="footer-tagline">
        Engineering seamless digital experiences
      </p>
    </footer>
  </section>
</template>

<style scoped>
.contact-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 160px 64px 48px;
  background: #000;
}

@media (max-width: 1024px) {
  .contact-section {
    padding: 120px 48px 40px;
  }
}

@media (max-width: 768px) {
  .contact-section {
    padding: 80px 24px 32px;
  }
}

.contact-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 100px;
  position: relative;
}

.contact-headline {
  font-family: 'Satoshi', sans-serif;
  font-size: clamp(48px, 12vw, 160px);
  font-weight: 900;
  line-height: 0.9;
  text-transform: lowercase;
  letter-spacing: -0.03em;
  margin: 0;
  color: #fff;
}

.headline-word {
  display: block;
  overflow: hidden;
}

/* Purple accent outline with glow */
.headline-accent {
  -webkit-text-stroke: 2px #7C3AED;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 20px rgba(124, 58, 237, 0.2));
}

/* Prism - with purple tint */
.contact-prism {
  position: absolute;
  right: -100px;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  height: 300px;
  opacity: 0.6;
  pointer-events: none;
}

.prism-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: grayscale(50%) brightness(1.1) hue-rotate(260deg);
  animation: prism-float 6s ease-in-out infinite;
}

@keyframes prism-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(10deg); }
}

/* CTA - purple gradient button with white text */
.contact-cta {
  margin-top: 72px;
  padding: 22px 56px;
  background: linear-gradient(135deg, #7C3AED 0%, #9333EA 100%);
  font-family: 'Satoshi', sans-serif;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #fff;
  text-decoration: none;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}

.contact-cta::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #9333EA 0%, #7C3AED 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.contact-cta:hover {
  box-shadow:
    0 0 60px rgba(124, 58, 237, 0.5),
    0 0 100px rgba(124, 58, 237, 0.3);
  transform: translateY(-2px);
}

.contact-cta:hover::before {
  opacity: 1;
}

/* Footer - enhanced colors */
.contact-footer {
  padding-top: 80px;
  border-top: 1px solid rgba(124, 58, 237, 0.15);
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
}

.footer-left {
  margin-bottom: 32px;
}

.footer-logo {
  height: 36px;
  width: auto;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.footer-logo:hover {
  opacity: 1;
  filter: drop-shadow(0 0 10px rgba(124, 58, 237, 0.3));
}

.footer-socials {
  display: flex;
  gap: 32px;
  margin-bottom: 48px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Satoshi', sans-serif;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  color: #7C3AED;
  text-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
}

.social-link .nuxt-icon {
  font-size: 20px;
}

.social-name {
  display: none;
}

@media (min-width: 768px) {
  .social-name {
    display: inline;
  }
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
}

.footer-copyright,
.footer-location {
  font-family: 'Satoshi', sans-serif;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
}

.footer-tagline {
  font-family: 'Satoshi', sans-serif;
  font-size: 12px;
  color: rgba(124, 58, 237, 0.4);
  text-align: center;
  margin: 20px 0 0;
}

@media (max-width: 1024px) {
  .contact-prism {
    display: none;
  }
}

@media (max-width: 768px) {
  .contact-content {
    padding-bottom: 80px;
  }

  .headline-accent {
    -webkit-text-stroke: 1.5px #7C3AED;
  }

  .contact-cta {
    margin-top: 56px;
    padding: 18px 40px;
  }

  .footer-socials {
    flex-wrap: wrap;
    gap: 20px;
  }

  .footer-bottom {
    flex-direction: column;
    gap: 8px;
    text-align: center;
  }
}
</style>
