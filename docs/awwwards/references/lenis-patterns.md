# Lenis Smooth Scroll Patterns

Lenis by Darkroom Engineering — smooth scroll library di balik banyak Awwwards SOTD/SOTY.

## Install

```bash
pnpm add lenis
```

## Vanilla Setup

```js
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  smoothWheel: true,
  touchMultiplier: 2,
})

function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)
```

## Lenis + GSAP ScrollTrigger (CRITICAL SYNC)

```js
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const lenis = new Lenis()

// Sync Lenis scroll with GSAP ticker
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0) // disable GSAP lag smoothing
```

## Vue/Nuxt Composable

```ts
// composables/useLenis.ts
import { onMounted, onUnmounted, shallowRef } from 'vue'
import Lenis from 'lenis'

export function useLenis() {
  const lenis = shallowRef<Lenis>()

  onMounted(() => {
    lenis.value = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    function raf(time: number) {
      lenis.value?.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  })

  onUnmounted(() => lenis.value?.destroy())

  return lenis
}
```

## React/Next.js Setup

```tsx
'use client'
import { ReactLenis } from 'lenis/react'

export function LenisProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  )
}
```

## API Quick Reference

```js
// Scroll to element
lenis.scrollTo('#section', { duration: 1.5, offset: -80 })

// Instant jump
lenis.scrollTo(0, { immediate: true })

// Events
lenis.on('scroll', ({ scroll, velocity, direction, progress }) => {
  // scroll: position, velocity: speed, direction: 1/-1, progress: 0-1
})

// Control
lenis.stop()
lenis.start()
lenis.destroy() // cleanup — WAJIB on unmount
```

## Notes

- `touchMultiplier: 2` untuk mobile feel yang responsive
- `smoothWheel: true` hanya affect mouse wheel — touch tetap native
- JANGAN combine dengan CSS `scroll-behavior: smooth` (conflict)
- SELALU `destroy()` on unmount/route change
