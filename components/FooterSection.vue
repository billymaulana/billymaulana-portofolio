<script setup lang="ts">
const currentYear = new Date().getFullYear()

const socialLinks = [
  { icon: 'i-simple-icons-linkedin', href: 'https://linkedin.com/in/billy-maulana', label: 'LinkedIn' },
  { icon: 'i-simple-icons-github', href: 'https://github.com/billymaulana', label: 'GitHub' },
  { icon: 'i-carbon-email', href: 'mailto:billymaulana1999@gmail.com', label: 'Email' },
]

const footerRef = ref<HTMLElement | null>(null)

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')

  gsap.registerPlugin(ScrollTrigger)

  gsap.fromTo(
    footerRef.value,
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1,
      scrollTrigger: {
        trigger: footerRef.value,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
    },
  )
})
</script>

<template>
  <footer ref="footerRef" class="py-12 border-t-3 border-text/10 relative">
    <div class="container-custom px-6">
      <div class="flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-4">
          <Logo :size="32" :animated="false" />
          <div>
            <p class="font-display font-bold">Billy Maulana</p>
            <p class="font-mono text-xs text-text-muted">Frontend Developer</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <a
            v-for="link in socialLinks"
            :key="link.label"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="w-10 h-10 border-2 border-text/20 flex items-center justify-center hover:border-primary hover:bg-primary group transition-all"
            :aria-label="link.label"
          >
            <div :class="link.icon" class="w-4 h-4 group-hover:text-surface transition-colors" />
          </a>
        </div>
      </div>

      <div class="mt-8 pt-8 border-t border-text/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p class="font-mono text-xs text-text-muted">
          &copy; {{ currentYear }} Billy Maulana. All rights reserved.
        </p>
        <p class="font-mono text-xs text-text-muted">
          Built with <span class="text-primary">Nuxt</span> + <span class="text-secondary">GSAP</span> + <span class="text-accent">UnoCSS</span>
        </p>
      </div>
    </div>
  </footer>
</template>
