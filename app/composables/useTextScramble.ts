/**
 * useTextScramble — Typewriter scramble effect
 *
 * On trigger, text cycles through random characters then resolves
 * to original text, character by character from left to right.
 * Creates an "expensive machine" feel.
 *
 * Usage:
 *   const { scramble, reset } = useTextScramble()
 *   scramble(element)
 */

interface ScrambleOptions {
  /** Characters to cycle through */
  chars?: string
  /** Speed per scramble step in ms. Default 30 */
  speed?: number
  /** How many random iterations per char before settling. Default 3 */
  iterations?: number
}

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*'

export function useTextScramble(options: ScrambleOptions = {}) {
  const {
    chars = DEFAULT_CHARS,
    speed = 30,
    iterations = 3,
  } = options

  const activeTimers: ReturnType<typeof setInterval>[] = []

  function scramble(el: HTMLElement): Promise<void> {
    return new Promise((resolve) => {
      const originalText = el.dataset.originalText || el.textContent || ''

      // Store original text for reset
      if (!el.dataset.originalText) {
        el.dataset.originalText = originalText
      }

      let iteration = 0
      const totalIterations = originalText.length * iterations

      const timer = setInterval(() => {
        const currentCharIndex = Math.floor(iteration / iterations)

        el.textContent = originalText
          .split('')
          .map((char, i) => {
            // Already resolved characters
            if (i < currentCharIndex)
              return originalText[i]

            // Space stays space
            if (char === ' ')
              return ' '

            // Random character
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join('')

        iteration++

        if (iteration >= totalIterations) {
          clearInterval(timer)
          el.textContent = originalText
          resolve()
        }
      }, speed)

      activeTimers.push(timer)
    })
  }

  function reset(el: HTMLElement) {
    const original = el.dataset.originalText
    if (original) {
      el.textContent = original
    }
  }

  function cleanup() {
    activeTimers.forEach(timer => clearInterval(timer))
    activeTimers.length = 0
  }

  onUnmounted(() => {
    cleanup()
  })

  return {
    scramble,
    reset,
    cleanup,
  }
}
