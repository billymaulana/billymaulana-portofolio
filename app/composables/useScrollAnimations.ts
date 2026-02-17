export function useScrollAnimations() {
  const cleanups: (() => void)[] = []

  async function getGsap() {
    const gsap = (await import('gsap')).default
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')
    gsap.registerPlugin(ScrollTrigger)
    return { gsap, ScrollTrigger }
  }

  async function fadeInUp(
    elements: string | HTMLElement | HTMLElement[],
    options?: {
      trigger?: string | HTMLElement
      stagger?: number
      duration?: number
      y?: number
      start?: string
    },
  ) {
    const { gsap } = await getGsap()

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: options?.trigger || (typeof elements === 'string' ? elements : undefined),
        start: options?.start || 'top 85%',
        toggleActions: 'play none none none',
      },
    })

    tl.from(elements, {
      y: options?.y ?? 60,
      opacity: 0,
      duration: options?.duration ?? 1,
      stagger: options?.stagger ?? 0.1,
      ease: 'power3.out',
    })

    cleanups.push(() => {
      tl.scrollTrigger?.kill()
      tl.kill()
    })

    return tl
  }

  async function revealText(
    container: string | HTMLElement,
    options?: {
      start?: string
      end?: string
    },
  ) {
    const { gsap } = await getGsap()

    const el = typeof container === 'string' ? document.querySelector(container) : container
    if (!el)
      return

    const words = el.querySelectorAll('.word')
    if (!words.length)
      return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: options?.start || 'top 70%',
        end: options?.end || 'bottom 30%',
        scrub: 0.5,
      },
    })

    tl.from(words, {
      opacity: 0.15,
      stagger: 0.05,
      duration: 0.5,
    })

    cleanups.push(() => {
      tl.scrollTrigger?.kill()
      tl.kill()
    })

    return tl
  }

  async function parallax(
    element: string | HTMLElement,
    options?: {
      speed?: number
      trigger?: string | HTMLElement
    },
  ) {
    const { gsap, ScrollTrigger } = await getGsap()

    const speed = options?.speed ?? 50

    const tl = gsap.to(element, {
      yPercent: speed,
      ease: 'none',
      scrollTrigger: {
        trigger: options?.trigger || element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    cleanups.push(() => {
      ScrollTrigger.getAll().forEach(st => st.kill())
      if (tl && 'kill' in tl)
        (tl as gsap.core.Tween).kill()
    })

    return tl
  }

  async function counterAnimation(
    element: HTMLElement,
    endValue: number,
    options?: {
      duration?: number
      trigger?: string | HTMLElement
      suffix?: string
    },
  ) {
    const { gsap } = await getGsap()

    const obj = { value: 0 }
    const suffix = options?.suffix ?? ''

    const tl = gsap.to(obj, {
      value: endValue,
      duration: options?.duration ?? 2,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: options?.trigger || element,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      onUpdate: () => {
        element.textContent = `${Math.round(obj.value)}${suffix}`
      },
    })

    cleanups.push(() => {
      if (tl && 'kill' in tl)
        (tl as gsap.core.Tween).kill()
    })

    return tl
  }

  function cleanup() {
    cleanups.forEach(fn => fn())
    cleanups.length = 0
  }

  onUnmounted(cleanup)

  return {
    fadeInUp,
    revealText,
    parallax,
    counterAnimation,
    cleanup,
  }
}
