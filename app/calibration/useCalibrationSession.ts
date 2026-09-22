import { pairs } from '~/calibration/pairs'

export interface Assertion {
  pair: string
  dim: string
  a: string
  b: string
  pick: 'a' | 'b' | 'skip'
  note: string
  toggles: number
  ts: string
}

const STORAGE_KEY = 'taste-calibration-v3'

export function useCalibrationSession(onToggle?: () => void) {
  const index = ref(0)
  const note = ref('')
  const side = ref<'a' | 'b'>('a')
  const ghostOn = ref(false)
  const toggles = ref(0)
  const answers = ref<Record<string, Assertion>>({})

  const current = computed(() => pairs[index.value])
  const answered = computed(() => Object.keys(answers.value).length)
  const activeVariant = computed(() => (current.value ? current.value[side.value] : null))
  const ghostVariant = computed(() => {
    if (!current.value || !ghostOn.value)
      return null
    return current.value[side.value === 'a' ? 'b' : 'a']
  })

  const jsonl = computed(() =>
    pairs
      .map(p => answers.value[p.id])
      .filter((a): a is Assertion => Boolean(a))
      .map(a => JSON.stringify(a))
      .join('\n'),
  )

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers.value))
  }

  function toggle() {
    if (!current.value)
      return
    side.value = side.value === 'a' ? 'b' : 'a'
    toggles.value += 1
    onToggle?.()
  }

  function record(pick: Assertion['pick']) {
    const pair = current.value
    if (!pair)
      return
    answers.value[pair.id] = {
      pair: pair.id,
      dim: pair.dim,
      a: pair.a.label,
      b: pair.b.label,
      pick,
      note: note.value.trim(),
      toggles: toggles.value,
      ts: new Date().toISOString(),
    }
    persist()
    note.value = ''
    toggles.value = 0
    side.value = 'a'
    ghostOn.value = false
    index.value += 1
  }

  function goBack() {
    if (index.value > 0) {
      index.value -= 1
      side.value = 'a'
      toggles.value = 0
    }
  }

  function restart() {
    answers.value = {}
    index.value = 0
    note.value = ''
    side.value = 'a'
    toggles.value = 0
    localStorage.removeItem(STORAGE_KEY)
  }

  function resume() {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved)
      return
    answers.value = JSON.parse(saved)
    const next = pairs.findIndex(p => !answers.value[p.id])
    index.value = next === -1 ? pairs.length : next
  }

  function onKeyDown(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement)
      return
    if (!current.value)
      return
    const key = e.key.toLowerCase()
    if (key === ' ') {
      e.preventDefault()
      toggle()
    }
    else if (key === 'd' && !ghostOn.value) {
      ghostOn.value = true
    }
    else if (key === '1') {
      record('a')
    }
    else if (key === '2') {
      record('b')
    }
    else if (key === 's') {
      record('skip')
    }
    else if (key === 'arrowleft') {
      goBack()
    }
  }

  function onKeyUp(e: KeyboardEvent) {
    if (e.key.toLowerCase() === 'd')
      ghostOn.value = false
  }

  onMounted(() => {
    resume()
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
  })

  return {
    pairs,
    index,
    note,
    side,
    ghostOn,
    toggles,
    current,
    answered,
    activeVariant,
    ghostVariant,
    jsonl,
    toggle,
    record,
    goBack,
    restart,
  }
}
