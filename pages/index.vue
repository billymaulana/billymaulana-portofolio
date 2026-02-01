<script setup lang="ts">
/**
 * Hero Section - Portfolio Landing Page
 * Style: Premium Dark Editorial with oversized typography
 * Reference: lokasasmita.com, creativeapes.design
 */

const heroRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  const { gsap } = await import('gsap')

  const hero = heroRef.value
  if (!hero)
    return

  const title = hero.querySelector('.hero-title')
  const subtitle = hero.querySelector('.hero-subtitle')
  const role = hero.querySelector('.hero-role')
  const cta = hero.querySelector('.hero-cta')

  // Initial states
  gsap.set([title, subtitle, role, cta], { opacity: 0, y: 40 })

  // Entrance animation
  const tl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    delay: 0.3,
  })

  tl.to(title, { opacity: 1, y: 0, duration: 1 })
  tl.to(subtitle, { opacity: 0.5, y: 0, duration: 0.8 }, '-=0.6')
  tl.to(role, { opacity: 1, y: 0, duration: 0.8 }, '-=0.5')
  tl.to(cta, { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
})
</script>

<template>
  <div ref="heroRef" class="hero">
    <div class="hero-content">
      <!-- Oversized Name -->
      <h1 class="hero-title">
        Billy<br>Maulana
      </h1>

      <!-- Subtitle -->
      <p class="hero-subtitle">
        Creative Frontend Developer
      </p>

      <!-- Role -->
      <p class="hero-role">
        Building premium digital experiences with modern web technologies.
        Focused on performance, accessibility, and delightful interactions.
      </p>

      <!-- CTA -->
      <div class="hero-cta">
        <a href="#work" class="cta-btn">View Work</a>
        <a href="#contact" class="cta-link">Get in Touch</a>
      </div>
    </div>

    <!-- Subtle gradient background -->
    <div class="hero-bg" />
  </div>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  width: 100%;
}

/* HUGE lowercase typography (lokasasmita style) */
.hero-title {
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: clamp(64px, 18vw, 220px);
  font-weight: 900;
  line-height: 0.85;
  letter-spacing: -0.04em;
  color: #fff;
  margin: 0;
  text-transform: lowercase;
}

.hero-subtitle {
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: clamp(12px, 1.5vw, 16px);
  font-weight: 500;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 32px;
}

.hero-role {
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: clamp(16px, 2vw, 22px);
  font-weight: 400;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.7);
  max-width: 540px;
  margin-top: 24px;
}

.hero-cta {
  display: flex;
  align-items: center;
  gap: 32px;
  margin-top: 48px;
}

.cta-btn {
  display: inline-flex;
  align-items: center;
  padding: 16px 32px;
  background: #fff;
  color: #000;
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 0;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(255, 255, 255, 0.15);
}

.cta-link {
  font-family: 'Satoshi', system-ui, sans-serif;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 0.3s ease;
}

.cta-link:hover {
  color: #fff;
}

/* Subtle gradient background */
.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse 60% 40% at 80% 100%, rgba(99, 102, 241, 0.05) 0%, transparent 40%);
  z-index: 1;
}

@media (max-width: 768px) {
  .hero {
    padding: 60px 20px;
    align-items: flex-end;
    padding-bottom: 100px;
  }

  .hero-title {
    line-height: 0.9;
  }

  .hero-cta {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }
}
</style>
