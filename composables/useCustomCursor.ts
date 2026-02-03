import { onMounted, onUnmounted, reactive, ref } from 'vue'

interface CursorState {
  x: number
  y: number
  isHovering: boolean
  isPointer: boolean
  label: string
  scale: number
}

export function useCustomCursor() {
  const cursor = reactive<CursorState>({
    x: 0,
    y: 0,
    isHovering: false,
    isPointer: false,
    label: '',
    scale: 1,
  })

  const isVisible = ref(false)
  let animationId: number | null = null
  let targetX = 0
  let targetY = 0

  function lerp(start: number, end: number, factor: number): number {
    return start + (end - start) * factor
  }

  function animate() {
    cursor.x = lerp(cursor.x, targetX, 0.15)
    cursor.y = lerp(cursor.y, targetY, 0.15)
    animationId = requestAnimationFrame(animate)
  }

  function onMouseMove(e: MouseEvent) {
    targetX = e.clientX
    targetY = e.clientY

    if (!isVisible.value) {
      isVisible.value = true
      cursor.x = e.clientX
      cursor.y = e.clientY
    }
  }

  function onMouseEnterInteractive(e: Event) {
    const target = e.currentTarget as HTMLElement
    cursor.isHovering = true
    cursor.label = target.dataset.cursorLabel || ''
    cursor.scale = Number.parseFloat(target.dataset.cursorScale || '2')

    if (target.tagName === 'A' || target.tagName === 'BUTTON') {
      cursor.isPointer = true
    }
  }

  function onMouseLeaveInteractive() {
    cursor.isHovering = false
    cursor.isPointer = false
    cursor.label = ''
    cursor.scale = 1
  }

  function setupInteractiveElements() {
    const interactiveElements = document.querySelectorAll(
      'a, button, [data-cursor-hover], [data-cursor-label]',
    )

    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterInteractive)
      el.addEventListener('mouseleave', onMouseLeaveInteractive)
    })

    return () => {
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterInteractive)
        el.removeEventListener('mouseleave', onMouseLeaveInteractive)
      })
    }
  }

  onMounted(() => {
    window.addEventListener('mousemove', onMouseMove)
    animationId = requestAnimationFrame(animate)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', onMouseMove)
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  })

  return {
    cursor,
    isVisible,
    setupInteractiveElements,
  }
}
