import { ref } from 'vue'

const chars = '!<>-_\\/[]{}—=+*^?#@$%&'

export function useTextScramble() {
  const isScrambling = ref(false)

  function scramble(
    element: HTMLElement,
    newText?: string,
    options: { duration?: number, delay?: number } = {},
  ): Promise<void> {
    const { duration = 600, delay = 0 } = options
    const originalText = element.textContent || ''
    const targetText = newText || originalText

    return new Promise((resolve) => {
      setTimeout(() => {
        isScrambling.value = true
        const length = Math.max(originalText.length, targetText.length)
        const frameRate = 30
        const totalFrames = Math.floor(duration / (1000 / frameRate))
        let frame = 0

        const interval = setInterval(() => {
          let output = ''
          const progress = frame / totalFrames

          for (let i = 0; i < length; i++) {
            const charProgress = progress * length

            if (i < charProgress) {
              output += targetText[i] || ''
            }
            else if (i < charProgress + 3) {
              output += chars[Math.floor(Math.random() * chars.length)]
            }
            else {
              output += originalText[i] || ''
            }
          }

          element.textContent = output
          frame++

          if (frame >= totalFrames) {
            clearInterval(interval)
            element.textContent = targetText
            isScrambling.value = false
            resolve()
          }
        }, 1000 / frameRate)
      }, delay)
    })
  }

  function setupHoverScramble(element: HTMLElement): () => void {
    const originalText = element.textContent || ''

    const onEnter = () => {
      if (!isScrambling.value) {
        scramble(element)
      }
    }

    element.addEventListener('mouseenter', onEnter)

    return () => {
      element.removeEventListener('mouseenter', onEnter)
      element.textContent = originalText
    }
  }

  return {
    scramble,
    setupHoverScramble,
    isScrambling,
  }
}
