# GSAP + ScrollTrigger Implementation Patterns

## Setup

```js
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
```

## Core Patterns

### Timeline — Orchestrated Sequence
```js
const tl = gsap.timeline()
tl.from('.hero-title', { y: 80, opacity: 0, duration: 1, ease: 'power4.out' })
  .from('.hero-subtitle', { y: 40, opacity: 0, duration: 0.8 }, '-=0.5')
  .from('.hero-cta', { scale: 0.8, opacity: 0, duration: 0.6 }, '-=0.3')
```

### ScrollTrigger — Fade In On Scroll
```js
gsap.from('.card', {
  scrollTrigger: {
    trigger: '.card',
    start: 'top 80%',
    end: 'top 20%',
    toggleActions: 'play none none reverse',
  },
  y: 60, opacity: 0, duration: 0.8,
})
```

### Pin + Scrub
```js
gsap.to('.panel', {
  scrollTrigger: {
    trigger: '.panel',
    start: 'top top',
    end: '+=500',
    pin: true,
    scrub: 1,
  },
  x: 500,
})
```

## Awwwards Patterns

### Staggered Grid Reveal
```js
gsap.from('.grid-item', {
  scrollTrigger: { trigger: '.grid', start: 'top 75%' },
  y: 80, opacity: 0, duration: 0.8,
  stagger: { amount: 0.6, grid: 'auto', from: 'start' },
  ease: 'power3.out',
})
```

### Horizontal Scroll Section
```js
const sections = gsap.utils.toArray('.h-panel')
gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: 'none',
  scrollTrigger: {
    trigger: '.h-container',
    pin: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    end: () => '+=' + document.querySelector('.h-container').offsetWidth,
  },
})
```

### Text Split Reveal (SplitText)
```js
import { SplitText } from 'gsap/SplitText'
gsap.registerPlugin(SplitText)

const split = new SplitText('.reveal-text', { type: 'lines,words' })
gsap.from(split.lines, {
  scrollTrigger: { trigger: '.reveal-text', start: 'top 80%' },
  y: '100%', opacity: 0, duration: 0.8,
  stagger: 0.1, ease: 'power4.out',
})
```

### Image Sequence Scrub
```js
const frameCount = 120
const images = Array.from({ length: frameCount }, (_, i) => {
  const img = new Image()
  img.src = `/frames/frame-${String(i).padStart(4, '0')}.webp`
  return img
})

const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
const obj = { frame: 0 }

gsap.to(obj, {
  frame: frameCount - 1,
  snap: 'frame',
  ease: 'none',
  scrollTrigger: {
    trigger: '.sequence-section',
    start: 'top top',
    end: '+=3000',
    scrub: 0.5,
    pin: true,
  },
  onUpdate: () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(images[Math.round(obj.frame)], 0, 0, canvas.width, canvas.height)
  },
})
```

### Parallax
```js
gsap.to('.bg-image', {
  scrollTrigger: { trigger: '.section', scrub: true },
  y: -100,
})
```

## Easing Cheatsheet

| Ease | Feel | Use For |
|------|------|---------|
| `expo.inOut` | Billy's favorite | Page transitions, hero |
| `power3.out` | Confident | Hero entrances |
| `power4.out` | Dramatic | Text reveals |
| `back.out(1.7)` | Overshoot | Playful elements |
| `elastic.out(1, 0.3)` | Springy | Attention-grab |
| `expo.out` | Premium decel | General premium |
| `none` | Linear | Scrubbed scroll only |

## Vue/Nuxt Integration

```vue
<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref<HTMLElement>()
const ctx = ref<gsap.Context>()

onMounted(() => {
  ctx.value = gsap.context((self) => {
    self.add('reveal', () => {
      gsap.from('.animate-in', {
        scrollTrigger: { trigger: sectionRef.value, start: 'top 80%' },
        y: 60, opacity: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out',
      })
    })
    self.reveal()
  }, sectionRef.value)
})

onUnmounted(() => ctx.value?.revert()) // WAJIB: cleanup
</script>

<template>
  <section ref="sectionRef">
    <h2 class="animate-in">Title</h2>
    <p class="animate-in">Content</p>
  </section>
</template>
```

## Performance Rules

1. **gsap.context()** — ALWAYS revert on unmount (Vue/React)
2. **will-change: transform** hanya selama animasi
3. **ScrollTrigger.batch()** untuk 50+ elements
4. **Hanya animate** `transform`, `opacity`, `clipPath` — NEVER `width`/`height`
5. **scrub: true** lebih ringan dari `scrub: 1`
6. **Kill on route change**: `ScrollTrigger.getAll().forEach(t => t.kill())`

## Pitfalls

- No `gsap.context().revert()` = memory leak + zombie triggers
- `toggleActions` + `scrub` bersamaan = conflict (pilih satu)
- Animate `height`/`width` = layout thrashing
- Lupa `ScrollTrigger.refresh()` setelah dynamic content
- Nested ScrollTriggers = chaos
