/**
 * Masthead rasterizer — menggambar teks hero ke offscreen 2D canvas sebagai
 * sumber texture untuk display pass useFluidSimulation. Displacement dan
 * chromatic split kini terjadi di GPU pass fluid, bukan di modul ini.
 */

export interface DistortionLine {
  text: string
  xAlign?: 'left' | 'center' | 'right'
  yFrac?: number
  indent?: number
  fontSize?: number
}

export interface MastheadRasterConfig {
  fontFamily: string
  fontWeight: number
  letterSpacingEm: number
  lines: DistortionLine[]
}

export function distortionTextPadding(width: number): number {
  const rootFs = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  return Math.min(Math.max(1.5 * rootFs, width * 0.04), 4 * rootFs)
}

export function useMastheadRaster(config: MastheadRasterConfig) {
  const cfg = { ...config, lines: [...config.lines] }
  const canvas = document.createElement('canvas')

  function applyFont(ctx: CanvasRenderingContext2D, fontSize: number) {
    ctx.font = `${cfg.fontWeight} ${fontSize}px ${cfg.fontFamily}`
    if ('letterSpacing' in ctx)
      ctx.letterSpacing = `${fontSize * cfg.letterSpacingEm}px`
  }

  /* Latar HITAM opak, bukan transparan: display pass fluid memakai shader
     referensi tanpa alpha handling — kompositing ke halaman terjadi lewat
     mix-blend-mode: difference pada elemen canvas (hitam = identity) */
  function render(cssWidth: number, cssHeight: number, scale: number): HTMLCanvasElement {
    const width = Math.max(1, Math.floor(cssWidth * scale))
    const height = Math.max(1, Math.floor(cssHeight * scale))
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = '#ffffff'
    ctx.textBaseline = 'alphabetic'

    const pad = distortionTextPadding(cssWidth) * scale

    for (let i = 0; i < cfg.lines.length; i++) {
      const line = cfg.lines[i]!
      const fontSize = (line.fontSize ?? 200) * scale
      applyFont(ctx, fontSize)
      const metrics = ctx.measureText(line.text)
      const indentPx = (line.indent ?? 0) * (fontSize / 200)
      const align = line.xAlign ?? 'left'
      let x = pad + indentPx
      if (align === 'right')
        x = width - pad - metrics.width - indentPx
      else if (align === 'center')
        x = (width - metrics.width) / 2 + indentPx
      const yFrac = line.yFrac ?? (i + 1) / (cfg.lines.length + 1)
      ctx.fillText(line.text, x, yFrac * height)
    }

    return canvas
  }

  function updateLines(lines: DistortionLine[]) {
    cfg.lines = lines
  }

  return { render, updateLines }
}
