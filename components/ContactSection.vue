<script setup lang="ts">
const sectionRef = ref<HTMLElement | null>(null)
const formRef = ref<HTMLElement | null>(null)

interface ContactLink {
  label: string
  value: string
  href: string
  icon: string
}

const contactLinks: ContactLink[] = [
  {
    label: 'Email',
    value: 'billymaulana1999@gmail.com',
    href: 'mailto:billymaulana1999@gmail.com',
    icon: 'i-carbon-email',
  },
  {
    label: 'Phone',
    value: '+62 838 4047 4590',
    href: 'tel:+6283840474590',
    icon: 'i-carbon-phone',
  },
  {
    label: 'LinkedIn',
    value: 'billy-maulana',
    href: 'https://linkedin.com/in/billy-maulana',
    icon: 'i-simple-icons-linkedin',
  },
  {
    label: 'Location',
    value: 'Bandung, Indonesia',
    href: 'https://maps.google.com/?q=Bandung,Indonesia',
    icon: 'i-carbon-location',
  },
]

onMounted(async () => {
  const { gsap } = await import('gsap')
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')

  gsap.registerPlugin(ScrollTrigger)

  gsap.fromTo(
    formRef.value,
    { y: 100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    },
  )
})
</script>

<template>
  <section
    id="contact"
    ref="sectionRef"
    class="py-20 md:py-32 relative"
  >
    <div class="absolute inset-0 grid-bg opacity-30" />

    <div class="container-custom section-padding relative z-10">
      <div class="text-center mb-16">
        <span class="font-mono text-primary text-sm uppercase tracking-widest mb-4 block">
          Let's Connect
        </span>
        <h2 class="text-fluid-3xl font-accent">
          GET IN<br>
          <span class="text-primary">TOUCH</span>
        </h2>
        <p class="mt-4 text-text-muted max-w-xl mx-auto">
          I'm always open to discussing new projects, creative ideas,
          or opportunities to be part of your vision.
        </p>
      </div>

      <div ref="formRef" class="max-w-4xl mx-auto">
        <div class="grid md:grid-cols-2 gap-6 mb-12">
          <a
            v-for="link in contactLinks"
            :key="link.label"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="brutalist-card group flex items-center gap-4 hover:border-primary transition-colors"
          >
            <div
              class="w-12 h-12 border-2 border-text flex items-center justify-center group-hover:border-primary group-hover:bg-primary transition-all"
            >
              <div :class="link.icon" class="w-5 h-5 group-hover:text-surface transition-colors" />
            </div>
            <div>
              <span class="font-mono text-xs text-text-muted uppercase tracking-wider block">
                {{ link.label }}
              </span>
              <span class="font-display font-medium group-hover:text-primary transition-colors">
                {{ link.value }}
              </span>
            </div>
          </a>
        </div>

        <div class="text-center">
          <p class="text-text-muted mb-6">
            Prefer a direct approach?
          </p>
          <a
            href="mailto:billymaulana1999@gmail.com?subject=Hello Billy!"
            class="btn-filled inline-flex items-center gap-2"
          >
            <span class="i-carbon-send" />
            Send Me an Email
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
