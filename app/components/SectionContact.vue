<script setup lang="ts">
/**
 * Contact: "The Blue Moment"
 * Full-viewport CTA. "LET'S" in white, "TALK" in #0047FF.
 * Scroll-driven: clip-path reveal + weight morph on "TALK".
 * This is the ONLY section with the accent color — maximum impact.
 */

const sectionRef = ref<HTMLElement>()
const letsRef = ref<HTMLElement>()
const talkRef = ref<HTMLElement>()
const emailRef = ref<HTMLElement>()

let scrollCtx: gsap.Context | null = null

onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (prefersReduced)
    return

  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  scrollCtx = gsap.context(() => {
    if (!sectionRef.value)
      return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: 'top 70%',
        end: 'top 20%',
        scrub: 1,
      },
    })

    // "LET'S" — clip-path reveal from left
    if (letsRef.value) {
      gsap.set(letsRef.value, {
        clipPath: 'inset(0 100% 0 0)',
        fontVariationSettings: `'wght' 200`,
      })

      tl.to(letsRef.value, {
        clipPath: 'inset(0 0% 0 0)',
        fontVariationSettings: `'wght' 700`,
        duration: 0.5,
        ease: 'power3.out',
      })
    }

    // "TALK" — clip-path reveal from right + weight morph
    if (talkRef.value) {
      gsap.set(talkRef.value, {
        clipPath: 'inset(0 0 0 100%)',
        fontVariationSettings: `'wght' 200`,
      })

      tl.to(talkRef.value, {
        clipPath: 'inset(0 0 0 0%)',
        fontVariationSettings: `'wght' 700`,
        duration: 0.5,
        ease: 'power3.out',
      }, '-=0.3')
    }

    // Email fade in
    if (emailRef.value) {
      gsap.set(emailRef.value, { opacity: 0 })

      tl.to(emailRef.value, {
        opacity: 1,
        duration: 0.3,
      })
    }
  })
})

onUnmounted(() => {
  scrollCtx?.revert()
})
</script>

<template>
  <section
    id="contact"
    ref="sectionRef"
    class="section-contact"
    aria-label="Contact"
  >
    <div class="section-contact__inner page-margin">
      <h2 class="section-contact__heading">
        <span ref="letsRef" class="section-contact__line">
          LET'S
        </span>
        <span ref="talkRef" class="section-contact__line section-contact__line--accent">
          TALK
        </span>
      </h2>
      <a
        ref="emailRef"
        href="mailto:billymaulana1999@gmail.com"
        class="section-contact__email"
        data-cursor-label="Email"
      >
        billymaulana1999@gmail.com
      </a>
    </div>

    <!-- Ghost section number -->
    <span class="section-contact__ghost" aria-hidden="true">06</span>
  </section>
</template>

<style scoped>
.section-contact {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
  overflow: hidden;
}

.section-contact__inner {
  text-align: center;
}

.section-contact__heading {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.section-contact__line {
  font-family: var(--font-display);
  font-variation-settings: 'wght' 700;
  font-size: var(--text-cta);
  line-height: var(--leading-crush);
  letter-spacing: var(--tracking-tight);
  color: var(--color-text-primary);
  text-transform: uppercase;
  will-change: clip-path, font-variation-settings;
}

/* THE one blue accent moment in the entire site */
.section-contact__line--accent {
  color: var(--color-accent);
}

.section-contact__email {
  display: inline-block;
  font-family: var(--font-mono);
  font-size: var(--text-small);
  color: var(--color-text-secondary);
  letter-spacing: var(--tracking-wide);
  margin-top: clamp(1.5rem, 3vh, 3rem);
  transition: color 0.4s var(--ease-expo);
}

.section-contact__email:hover {
  color: var(--color-accent);
}

/* Ghost section number */
.section-contact__ghost {
  position: absolute;
  bottom: clamp(2rem, 5vh, 4rem);
  right: var(--page-margin);
  font-family: var(--font-mono);
  font-size: clamp(5rem, 12vw, 12rem);
  font-weight: 400;
  line-height: 1;
  color: var(--color-text-ghost);
  opacity: 0.03;
  pointer-events: none;
  user-select: none;
}

/* Responsive */
@media (max-width: 768px) {
  .section-contact__line {
    font-size: clamp(3rem, 15vw, 6rem);
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .section-contact__line {
    clip-path: none;
    font-variation-settings: 'wght' 700;
  }
}
</style>
