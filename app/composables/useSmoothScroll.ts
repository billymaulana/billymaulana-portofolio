import Lenis from 'lenis'

const lenisInstance = shallowRef<Lenis | null>(null)

export function useSmoothScroll() {
  async function init() {
    if (lenisInstance.value)
      return

    // Dynamically import GSAP + ScrollTrigger for proper bridge
    const gsap = (await import('gsap')).default
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)

    const lenis = new Lenis({
      duration: 1.8,
      easing: (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.5,
    })

    // CRITICAL: Bridge Lenis → ScrollTrigger
    // Without this, scroll-driven animations desync from smooth scroll
    lenis.on('scroll', ScrollTrigger.update)

    // Sync Lenis RAF to GSAP ticker (single unified loop)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    lenisInstance.value = lenis
  }

  function scrollTo(target: string | number | HTMLElement, options?: { offset?: number, duration?: number }) {
    lenisInstance.value?.scrollTo(target, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 2.0,
      easing: (t: number) => 1 - (1 - t) ** 4,
    })
  }

  function stop() {
    lenisInstance.value?.stop()
  }

  function start() {
    lenisInstance.value?.start()
  }

  function destroy() {
    lenisInstance.value?.destroy()
    lenisInstance.value = null
  }

  function getInstance() {
    return lenisInstance.value
  }

  return { init, scrollTo, stop, start, destroy, getInstance }
}
