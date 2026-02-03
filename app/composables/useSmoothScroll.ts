export function useSmoothScroll() {
  function scrollTo(target: string | HTMLElement, offset = 0): void {
    const element = typeof target === 'string'
      ? document.querySelector(target)
      : target

    if (!element)
      return

    const top = element.getBoundingClientRect().top + window.scrollY - offset

    window.scrollTo({
      top,
      behavior: 'smooth',
    })
  }

  function setupAnchorLinks(): () => void {
    const handleClick = (e: Event) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement

      if (anchor) {
        e.preventDefault()
        const href = anchor.getAttribute('href')
        if (href && href !== '#') {
          scrollTo(href, 100)
        }
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }

  return {
    scrollTo,
    setupAnchorLinks,
  }
}

export function useScrollProgress() {
  let scrollY = 0
  let progress = 0

  function getProgress(): number {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    scrollY = window.scrollY
    progress = Math.min(scrollY / docHeight, 1)
    return progress
  }

  function setupScrollListener(callback: (progress: number) => void): () => void {
    const onScroll = () => {
      callback(getProgress())
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }

  return {
    getProgress,
    setupScrollListener,
  }
}
