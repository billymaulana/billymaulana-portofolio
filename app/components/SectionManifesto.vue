<script setup lang="ts">
const manifestoRef = ref<HTMLElement>()
const manifestoText = 'I don\'t just write code — I craft digital experiences that users feel. Every pixel intentional. Every transition meaningful. Every interface a conversation between human and machine.'

const words = manifestoText.split(' ')

onMounted(async () => {
  const gsap = (await import('gsap')).default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsap.registerPlugin(ScrollTrigger)

  if (!manifestoRef.value)
    return

  const wordEls = manifestoRef.value.querySelectorAll('.manifesto__word')

  gsap.timeline({
    scrollTrigger: {
      trigger: manifestoRef.value,
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: 0.5,
    },
  }).from(wordEls, {
    opacity: 0.12,
    stagger: 0.03,
    duration: 0.3,
  })
})
</script>

<template>
  <section ref="manifestoRef" class="manifesto section-padding" aria-label="Manifesto">
    <div class="page-max">
      <p class="manifesto__text">
        <span
          v-for="(word, i) in words"
          :key="i"
          class="manifesto__word"
          :class="{ 'manifesto__word--accent': ['craft', 'feel.', 'intentional.', 'meaningful.', 'conversation'].includes(word) }"
        >
          {{ word }}{{ ' ' }}
        </span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.manifesto {
  position: relative;
}

.manifesto__text {
  font-size: var(--text-h2);
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.02em;
  max-width: 1000px;
}

.manifesto__word {
  display: inline-block;
  will-change: opacity;
  margin-right: 0.15em;
}

.manifesto__word--accent {
  color: var(--color-accent-light);
}
</style>
