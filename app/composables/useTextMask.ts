/**
 * useTextMask — Render text to offscreen Canvas2D, apply as CSS mask-image.
 * Used by SectionHero to make fluid simulation visible only inside letterforms.
 *
 * Technique: daspritam.in style text-as-window-to-liquid.
 * The mask is regenerated on resize (debounced).
 */

interface TextMaskLine {
  text: string
  italic?: boolean
  letterSpacing?: number // em units, e.g. -0.04
}

interface TextMaskOptions {
  lines: TextMaskLine[]
  fontFamily: string
  fontWeight: number
  fontSize: {
    min: number // rem
    preferred: number // vw
    max: number // rem
  }
  mobileFontSize?: {
    min: number
    preferred: number
    max: number
  }
  lineHeight: number
  atmosphericBase: number // 0-1, opacity of base mask layer
  mobileBreakpoint?: number
}

export function useTextMask(
  canvasEl: Ref<HTMLCanvasElement | undefined>,
  containerEl: Ref<HTMLElement | undefined>,
  options: TextMaskOptions,
) {
  let resizeObserver: ResizeObserver | null = null
  let debounceTimer: ReturnType<typeof setTimeout> | null = null

  function generate() {
    if (!canvasEl.value || !containerEl.value) {
      return
    }

    const w = containerEl.value.offsetWidth
    const h = containerEl.value.offsetHeight
    if (w === 0 || h === 0) {
      return
    }

    const dpr = Math.min(window.devicePixelRatio, 1.5)
    const off = document.createElement('canvas')
    off.width = Math.round(w * dpr)
    off.height = Math.round(h * dpr)
    const ctx = off.getContext('2d')
    if (!ctx) {
      return
    }

    ctx.scale(dpr, dpr)

    // Atmospheric base — subtle fluid glow everywhere
    ctx.fillStyle = `rgba(255, 255, 255, ${options.atmosphericBase})`
    ctx.fillRect(0, 0, w, h)

    // Radial vignette: stronger at center, fades at edges
    const maxDim = Math.max(w, h)
    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, maxDim * 0.55)
    grad.addColorStop(0, `rgba(255, 255, 255, ${options.atmosphericBase * 0.75})`)
    grad.addColorStop(0.6, `rgba(255, 255, 255, ${options.atmosphericBase * 0.35})`)
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, w, h)

    // Compute font size from clamp-like values
    const rootFs = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    const vwUnit = w / 100
    const bp = options.mobileBreakpoint ?? 768
    const isMobile = w <= bp

    const sizeOpts = (isMobile && options.mobileFontSize) ? options.mobileFontSize : options.fontSize
    const fontSize = Math.max(
      sizeOpts.min * rootFs,
      Math.min(sizeOpts.preferred * vwUnit, sizeOpts.max * rootFs),
    )

    const lh = options.lineHeight
    const lineCount = options.lines.length
    const totalH = fontSize * lh * lineCount
    const centerY = h / 2

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#ffffff'

    const ctxAny = ctx as CanvasRenderingContext2D & { letterSpacing?: string }

    options.lines.forEach((line, i) => {
      const style = line.italic ? 'italic ' : ''
      ctx.font = `${style}${options.fontWeight} ${fontSize}px ${options.fontFamily}`

      if ('letterSpacing' in ctx) {
        const ls = (line.letterSpacing ?? -0.04) * fontSize
        ctxAny.letterSpacing = `${ls}px`
      }

      const y = centerY - totalH / 2 + fontSize * lh / 2 + i * fontSize * lh
      ctx.fillText(line.text.toUpperCase(), w / 2, y)
    })

    // Apply as CSS mask
    const url = off.toDataURL('image/png')
    const el = canvasEl.value
    el.style.setProperty('-webkit-mask-image', `url(${url})`)
    el.style.setProperty('mask-image', `url(${url})`)
    el.style.setProperty('-webkit-mask-size', '100% 100%')
    el.style.setProperty('mask-size', '100% 100%')
    el.style.setProperty('-webkit-mask-repeat', 'no-repeat')
    el.style.setProperty('mask-repeat', 'no-repeat')
  }

  function debouncedGenerate() {
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
    debounceTimer = setTimeout(generate, 80)
  }

  async function init() {
    await document.fonts.ready

    const fontCheck = `${options.fontWeight} 100px ${options.fontFamily.split(',')[0]!.trim()}`
    if (document.fonts.check(fontCheck)) {
      generate()
    }

    if (canvasEl.value) {
      resizeObserver = new ResizeObserver(debouncedGenerate)
      resizeObserver.observe(canvasEl.value)
    }
  }

  function destroy() {
    resizeObserver?.disconnect()
    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }
  }

  return { init, generate, debouncedGenerate, destroy }
}
