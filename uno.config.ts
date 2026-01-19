import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  theme: {
    colors: {
      primary: '#CDFF00',
      secondary: '#FF3366',
      accent: '#00FFFF',
      warning: '#FF6B00',
      electric: '#7B61FF',
      surface: {
        DEFAULT: '#0A0A0A',
        light: '#141414',
        lighter: '#1A1A1A',
      },
      text: {
        DEFAULT: '#FFFFFF',
        muted: '#888888',
        dark: '#0A0A0A',
      },
    },
    fontFamily: {
      display: ['Space Grotesk', 'system-ui', 'sans-serif'],
      body: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      accent: ['Bebas Neue', 'system-ui', 'sans-serif'],
    },
    animation: {
      keyframes: {
        'marquee': '{ from { transform: translateX(0) } to { transform: translateX(-50%) } }',
        'marquee-reverse': '{ from { transform: translateX(-50%) } to { transform: translateX(0) } }',
        'float': '{ 0%, 100% { transform: translateY(0) } 50% { transform: translateY(-20px) } }',
        'pulse-glow': '{ 0%, 100% { box-shadow: 0 0 20px rgba(205, 255, 0, 0.3) } 50% { box-shadow: 0 0 40px rgba(205, 255, 0, 0.6) } }',
        'glitch': `{
          0%, 100% { transform: translate(0) }
          20% { transform: translate(-2px, 2px) }
          40% { transform: translate(-2px, -2px) }
          60% { transform: translate(2px, 2px) }
          80% { transform: translate(2px, -2px) }
        }`,
        'border-dance': `{
          0%, 100% { border-color: #CDFF00 }
          25% { border-color: #FF3366 }
          50% { border-color: #00FFFF }
          75% { border-color: #7B61FF }
        }`,
        'gradient-shift': `{
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }`,
      },
      durations: {
        'marquee': '30s',
        'marquee-reverse': '30s',
        'float': '6s',
        'pulse-glow': '2s',
        'glitch': '0.3s',
        'border-dance': '4s',
        'gradient-shift': '3s',
      },
      timingFns: {
        'marquee': 'linear',
        'marquee-reverse': 'linear',
        'float': 'ease-in-out',
        'pulse-glow': 'ease-in-out',
        'glitch': 'steps(1)',
        'border-dance': 'linear',
        'gradient-shift': 'ease',
      },
      counts: {
        'marquee': 'infinite',
        'marquee-reverse': 'infinite',
        'float': 'infinite',
        'pulse-glow': 'infinite',
        'glitch': 'infinite',
        'border-dance': 'infinite',
        'gradient-shift': 'infinite',
      },
    },
  },
  shortcuts: [
    ['btn', 'px-6 py-3 font-bold uppercase tracking-wider border-3 border-primary bg-transparent text-primary hover:bg-primary hover:text-surface transition-all duration-300 cursor-pointer'],
    ['btn-filled', 'px-6 py-3 font-bold uppercase tracking-wider bg-primary text-surface border-3 border-primary hover:bg-transparent hover:text-primary transition-all duration-300 cursor-pointer'],
    ['btn-ghost', 'px-6 py-3 font-bold uppercase tracking-wider border-3 border-text bg-transparent text-text hover:border-primary hover:text-primary transition-all duration-300 cursor-pointer'],
    ['text-gradient', 'bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent'],
    ['text-gradient-animated', 'bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent bg-size-200 animate-gradient-shift'],
    ['text-display', 'font-display font-bold tracking-tight'],
    ['text-accent-font', 'font-accent uppercase tracking-widest'],
    ['section-padding', 'px-6 md:px-12 lg:px-24 py-20 md:py-32'],
    ['container-custom', 'max-w-7xl mx-auto'],
    ['brutalist-border', 'border-3 border-text'],
    ['brutalist-border-primary', 'border-3 border-primary'],
    ['brutalist-box', 'border-3 border-text p-6 bg-surface'],
    ['brutalist-card', 'border-3 border-text bg-surface-light p-6 hover:border-primary transition-colors duration-300'],
    ['glow-primary', 'shadow-[0_0_30px_rgba(205,255,0,0.3)]'],
    ['glow-secondary', 'shadow-[0_0_30px_rgba(255,51,102,0.3)]'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-primary'],
    ['hover-lift', 'transition-transform duration-300 hover:-translate-y-1'],
    ['hover-scale', 'transition-transform duration-300 hover:scale-105'],
    ['grid-brutalist', 'grid gap-4 md:gap-6'],
  ],
  rules: [
    ['bg-noise', { 'background-image': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }],
    ['text-stroke', { '-webkit-text-stroke': '1px currentColor', 'text-stroke': '1px currentColor' }],
    ['text-stroke-2', { '-webkit-text-stroke': '2px currentColor', 'text-stroke': '2px currentColor' }],
    ['clip-path-none', { 'clip-path': 'none' }],
    ['bg-size-200', { 'background-size': '200% 200%' }],
    [/^translate-z-(\d+)$/, ([, d]) => ({ transform: `translateZ(${d}px)` })],
    ['perspective-1000', { perspective: '1000px' }],
    ['preserve-3d', { 'transform-style': 'preserve-3d' }],
    ['backface-hidden', { 'backface-visibility': 'hidden' }],
  ],
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography({
      cssExtend: {
        'h1, h2, h3, h4, h5, h6': {
          'font-family': 'Space Grotesk, system-ui, sans-serif',
          'font-weight': '700',
        },
        'code': {
          'font-family': 'JetBrains Mono, ui-monospace, monospace',
        },
      },
    }),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: [
    'text-primary',
    'text-secondary',
    'text-accent',
    'text-electric',
    'text-warning',
    'bg-primary',
    'bg-secondary',
    'bg-accent',
    'border-primary',
    'border-secondary',
    'border-accent',
  ],
})
