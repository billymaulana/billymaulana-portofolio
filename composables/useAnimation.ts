export function useAnimation() {
  const initScrollTrigger = async () => {
    if (typeof window === 'undefined')
      return null

    const { gsap } = await import('gsap')
    const { ScrollTrigger } = await import('gsap/ScrollTrigger')

    gsap.registerPlugin(ScrollTrigger)

    return { gsap, ScrollTrigger }
  }

  const animateOnScroll = async (
    element: HTMLElement | null,
    fromVars: gsap.TweenVars,
    toVars: gsap.TweenVars,
    triggerOptions: ScrollTrigger.Vars = {},
  ) => {
    if (!element)
      return

    const modules = await initScrollTrigger()
    if (!modules)
      return

    const { gsap } = modules

    gsap.fromTo(element, fromVars, {
      ...toVars,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
        ...triggerOptions,
      },
    })
  }

  const staggerOnScroll = async (
    elements: NodeListOf<Element> | Element[] | null,
    fromVars: gsap.TweenVars,
    toVars: gsap.TweenVars,
    stagger: number = 0.1,
    trigger?: HTMLElement | null,
  ) => {
    if (!elements || elements.length === 0)
      return

    const modules = await initScrollTrigger()
    if (!modules)
      return

    const { gsap } = modules

    gsap.fromTo(elements, fromVars, {
      ...toVars,
      stagger,
      scrollTrigger: {
        trigger: trigger || elements[0],
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    })
  }

  return {
    initScrollTrigger,
    animateOnScroll,
    staggerOnScroll,
  }
}
