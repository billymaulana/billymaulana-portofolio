export function useHeroStage() {
  const clockText = ref('00:00:00')
  let clockTimer: ReturnType<typeof setInterval> | null = null
  let rotatorTimer: ReturnType<typeof setInterval> | null = null

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

  function destroy() {
    if (clockTimer) {
      clearInterval(clockTimer)
      clockTimer = null
    }
    if (rotatorTimer) {
      clearInterval(rotatorTimer)
      rotatorTimer = null
    }
  }

  return {
    clockText,
    startClock,
    startStatusRotator,
    destroy,
  }
}
