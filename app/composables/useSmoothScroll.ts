/**
 * Smooth scroll composable.
 * TODO: Add Lenis when more sections are built (pnpm add lenis)
 */

export function useSmoothScroll() {
  function init() {
    // Lenis will be initialized here once installed
  }

  function scrollTo(_target: string | number | HTMLElement, _options?: { offset?: number, duration?: number }) {
    // Lenis scrollTo will be wired here
  }

  function stop() {
    //
  }
  function start() {
    //
  }
  function destroy() {
    //
  }
  function getInstance() {
    return null
  }

  return {
    init,
    scrollTo,
    stop,
    start,
    destroy,
    getInstance,
  }
}
