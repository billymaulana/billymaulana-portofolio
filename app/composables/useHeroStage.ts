type GsapStatic = typeof import('gsap')['gsap']

interface GhostDrift {
  onPointerMove: (e: PointerEvent) => void
  destroy: () => void
}

const GHOST_DRIFT_MAX_PX = 18

export function useHeroStage() {
  const clockText = ref('00:00:00')
  let clockTimer: ReturnType<typeof setInterval> | null = null
  let rotatorTimer: ReturnType<typeof setInterval> | null = null
  let ghostDrift: GhostDrift | null = null

  function startClock() {
    if (clockTimer)
      return
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    const tick = () => {
      clockText.value = formatter.format(new Date())
    }
    tick()
    clockTimer = setInterval(tick, 1000)
  }

  function startStatusRotator(
    el: HTMLElement,
    statuses: string[],
    scramble: (el: HTMLElement) => Promise<void>,
    intervalMs = 8000,
  ) {
    if (rotatorTimer || statuses.length < 2)
      return
    let index = 0
    rotatorTimer = setInterval(() => {
      index = (index + 1) % statuses.length
      el.dataset.originalText = statuses[index]!
      scramble(el)
    }, intervalMs)
  }

  function attachGhostDrift(gsap: GsapStatic, target: HTMLElement): GhostDrift {
    let halfW = window.innerWidth / 2
    let halfH = window.innerHeight / 2
    const refreshViewport = () => {
      halfW = window.innerWidth / 2
      halfH = window.innerHeight / 2
    }
    window.addEventListener('resize', refreshViewport)

    const xTo = gsap.quickTo(target, 'x', { duration: 0.8, ease: 'expo.out' })
    const yTo = gsap.quickTo(target, 'y', { duration: 0.8, ease: 'expo.out' })

    function onPointerMove(e: PointerEvent) {
      xTo(((e.clientX - halfW) / halfW) * GHOST_DRIFT_MAX_PX)
      yTo(((e.clientY - halfH) / halfH) * GHOST_DRIFT_MAX_PX)
    }

    ghostDrift = {
      onPointerMove,
      destroy: () => {
        window.removeEventListener('resize', refreshViewport)
        ghostDrift = null
      },
    }
    return ghostDrift
  }

  function destroy() {
    if (clockTimer) {
      clearInterval(clockTimer)
      clockTimer = null
    }
    if (rotatorTimer) {
      clearInterval(rotatorTimer)
      rotatorTimer = null
    }
    ghostDrift?.destroy()
  }

  return {
    clockText,
    startClock,
    startStatusRotator,
    attachGhostDrift,
    destroy,
  }
}
