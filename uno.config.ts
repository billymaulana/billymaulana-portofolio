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
      // Vibrant purple primary palette
      primary: '#A855F7',
      'primary-light': '#C084FC',
      'primary-dark': '#7C3AED',
      // Electric accents
      secondary: '#FF2D92',
      accent: '#00F0FF',
      neon: '#39FF14',
      warning: '#FF6B00',
      electric: '#6366F1',
      // Glitch colors for RGB split
      glitch: {
        red: '#FF0040',
        cyan: '#00FFFF',
        purple: '#A855F7',
      },
      surface: {
        DEFAULT: '#050505',
        light: '#0D0D0D',
        lighter: '#151515',
        dark: '#000000',
      },
      text: {
        DEFAULT: '#FFFFFF',
        muted: '#6B7280',
        dim: '#4B5563',
        dark: '#050505',
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
        'float': '{ 0%, 100% { transform: translateY(0) rotate(0deg) } 50% { transform: translateY(-20px) rotate(2deg) } }',
        'pulse-glow': '{ 0%, 100% { box-shadow: 0 0 20px rgba(168, 85, 247, 0.4) } 50% { box-shadow: 0 0 60px rgba(168, 85, 247, 0.8) } }',
        'glitch': `{
          0%, 100% { transform: translate(0) }
          10% { transform: translate(-3px, 3px) }
          20% { transform: translate(3px, -3px) }
          30% { transform: translate(-3px, -3px) }
          40% { transform: translate(3px, 3px) }
          50% { transform: translate(-3px, 3px) }
          60% { transform: translate(3px, -3px) }
          70% { transform: translate(-3px, -3px) }
          80% { transform: translate(3px, 3px) }
          90% { transform: translate(-3px, 3px) }
        }`,
        'glitch-skew': `{
          0%, 100% { transform: skew(0deg) }
          20% { transform: skew(-2deg) }
          40% { transform: skew(2deg) }
          60% { transform: skew(-1deg) }
          80% { transform: skew(1deg) }
        }`,
        'rgb-split': `{
          0%, 100% { text-shadow: -2px 0 #FF0040, 2px 0 #00FFFF }
          25% { text-shadow: 2px 0 #FF0040, -2px 0 #00FFFF }
          50% { text-shadow: -1px 2px #FF0040, 1px -2px #00FFFF }
          75% { text-shadow: 1px -1px #FF0040, -1px 1px #00FFFF }
        }`,
        'border-dance': `{
          0%, 100% { border-color: #A855F7 }
          25% { border-color: #FF2D92 }
          50% { border-color: #00F0FF }
          75% { border-color: #39FF14 }
        }`,
        'gradient-shift': `{
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }`,
        'text-flicker': `{
          0%, 100% { opacity: 1 }
          3% { opacity: 0.4 }
          6% { opacity: 1 }
          7% { opacity: 0.4 }
          8% { opacity: 1 }
          9% { opacity: 0.4 }
          10% { opacity: 1 }
          89% { opacity: 1 }
          90% { opacity: 0.4 }
          100% { opacity: 1 }
        }`,
        'scan-line': `{
          0% { transform: translateY(-100%) }
          100% { transform: translateY(100vh) }
        }`,
        'distort': `{
          0%, 100% { transform: scaleX(1) scaleY(1) }
          25% { transform: scaleX(1.02) scaleY(0.98) }
          50% { transform: scaleX(0.98) scaleY(1.02) }
          75% { transform: scaleX(1.01) scaleY(0.99) }
        }`,
        'rotate-slow': `{
          from { transform: rotate(0deg) }
          to { transform: rotate(360deg) }
        }`,
        'shake': `{
          0%, 100% { transform: translateX(0) }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px) }
          20%, 40%, 60%, 80% { transform: translateX(5px) }
        }`,
        'noise': `{
          0%, 100% { background-position: 0 0 }
          10% { background-position: -5% -10% }
          20% { background-position: -15% 5% }
          30% { background-position: 7% -25% }
          40% { background-position: 20% 25% }
          50% { background-position: -25% 10% }
          60% { background-position: 15% 5% }
          70% { background-position: 0% 15% }
          80% { background-position: 25% 35% }
          90% { background-position: -10% 10% }
        }`,
      },
      durations: {
        'marquee': '25s',
        'marquee-reverse': '25s',
        'float': '6s',
        'pulse-glow': '2s',
        'glitch': '0.5s',
        'glitch-skew': '0.5s',
        'rgb-split': '0.4s',
        'border-dance': '4s',
        'gradient-shift': '3s',
        'text-flicker': '3s',
        'scan-line': '8s',
        'distort': '0.5s',
        'rotate-slow': '20s',
        'shake': '0.5s',
        'noise': '1s',
      },
      timingFns: {
        'marquee': 'linear',
        'marquee-reverse': 'linear',
        'float': 'ease-in-out',
        'pulse-glow': 'ease-in-out',
        'glitch': 'steps(1)',
        'glitch-skew': 'ease-in-out',
        'rgb-split': 'steps(1)',
        'border-dance': 'linear',
        'gradient-shift': 'ease',
        'text-flicker': 'linear',
        'scan-line': 'linear',
        'distort': 'ease-in-out',
        'rotate-slow': 'linear',
        'shake': 'ease-in-out',
        'noise': 'steps(5)',
      },
      counts: {
        'marquee': 'infinite',
        'marquee-reverse': 'infinite',
        'float': 'infinite',
        'pulse-glow': 'infinite',
        'glitch': 'infinite',
        'glitch-skew': 'infinite',
        'rgb-split': 'infinite',
        'border-dance': 'infinite',
        'gradient-shift': 'infinite',
        'text-flicker': 'infinite',
        'scan-line': 'infinite',
        'distort': 'infinite',
        'rotate-slow': 'infinite',
        'shake': '1',
        'noise': 'infinite',
      },
    },
  },
  shortcuts: [
    // Buttons
    ['btn', 'px-8 py-4 font-bold uppercase tracking-widest border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-surface transition-all duration-300 cursor-pointer relative overflow-hidden'],
    ['btn-filled', 'px-8 py-4 font-bold uppercase tracking-widest bg-primary text-surface border-2 border-primary hover:bg-transparent hover:text-primary transition-all duration-300 cursor-pointer'],
    ['btn-glitch', 'px-8 py-4 font-bold uppercase tracking-widest border-2 border-primary bg-transparent text-primary hover:animate-glitch cursor-pointer relative'],

    // Text styles
    ['text-gradient', 'bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent'],
    ['text-gradient-animated', 'bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent bg-size-200 animate-gradient-shift'],
    ['text-display', 'font-display font-bold tracking-tighter'],
    ['text-accent-font', 'font-accent uppercase tracking-widest'],
    ['text-glitch', 'relative hover:animate-rgb-split'],
    ['text-outline', 'text-transparent text-stroke-2'],

    // Layout
    ['section-padding', 'px-6 md:px-12 lg:px-24 py-24 md:py-40'],
    ['container-custom', 'max-w-8xl mx-auto'],

    // Brutalist elements
    ['brutalist-border', 'border-2 border-text'],
    ['brutalist-border-primary', 'border-2 border-primary'],
    ['brutalist-box', 'border-2 border-text p-8 bg-surface'],
    ['brutalist-card', 'border-2 border-text/20 bg-surface-light p-8 hover:border-primary transition-all duration-500'],

    // Glows
    ['glow-primary', 'shadow-[0_0_40px_rgba(168,85,247,0.4)]'],
    ['glow-secondary', 'shadow-[0_0_40px_rgba(255,45,146,0.4)]'],
    ['glow-accent', 'shadow-[0_0_40px_rgba(0,240,255,0.4)]'],

    // Hovers
    ['hover-lift', 'transition-transform duration-500 hover:-translate-y-2'],
    ['hover-scale', 'transition-transform duration-500 hover:scale-105'],
    ['hover-glitch', 'hover:animate-glitch'],
    ['hover-glow', 'hover:glow-primary transition-shadow duration-500'],

    // Experimental
    ['experimental-bg', 'bg-surface relative overflow-hidden'],
    ['noise-overlay', 'pointer-events-none absolute inset-0 opacity-5 bg-noise'],
    ['scan-line-overlay', 'pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-scan-line'],

    // Grid
    ['grid-brutalist', 'grid gap-6 md:gap-8'],
    ['asymmetric-grid', 'grid grid-cols-12 gap-4'],
  ],
  rules: [
    // Noise background
    ['bg-noise', {
      'background-image': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
      'background-size': '256px 256px',
    }],

    // Text strokes
    ['text-stroke', { '-webkit-text-stroke': '1px currentColor', 'text-stroke': '1px currentColor' }],
    ['text-stroke-2', { '-webkit-text-stroke': '2px currentColor', 'text-stroke': '2px currentColor' }],
    ['text-stroke-primary', { '-webkit-text-stroke': '2px #A855F7', 'text-stroke': '2px #A855F7' }],

    // Clip paths
    ['clip-path-none', { 'clip-path': 'none' }],
    ['clip-glitch', { 'clip-path': 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }],

    // Background size
    ['bg-size-200', { 'background-size': '200% 200%' }],
    ['bg-size-400', { 'background-size': '400% 400%' }],

    // 3D transforms
    [/^translate-z-(\d+)$/, ([, d]) => ({ transform: `translateZ(${d}px)` })],
    ['perspective-1000', { perspective: '1000px' }],
    ['perspective-2000', { perspective: '2000px' }],
    ['preserve-3d', { 'transform-style': 'preserve-3d' }],
    ['backface-hidden', { 'backface-visibility': 'hidden' }],

    // Glitch effects
    ['glitch-effect', {
      'position': 'relative',
      'animation': 'glitch 0.5s infinite',
    }],

    // RGB split text shadow
    ['rgb-split', {
      'text-shadow': '-2px 0 #FF0040, 2px 0 #00FFFF',
    }],

    // Grain overlay
    ['grain-overlay', {
      'background-image': 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'grain\'%3E%3CfeTurbulence type=\'turbulence\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23grain)\'/%3E%3C/svg%3E")',
      'opacity': '0.08',
      'pointer-events': 'none',
      'position': 'absolute',
      'inset': '0',
    }],

    // Cursor styles
    ['cursor-none', { cursor: 'none' }],

    // Mix blend modes
    ['mix-difference', { 'mix-blend-mode': 'difference' }],
    ['mix-exclusion', { 'mix-blend-mode': 'exclusion' }],
    ['mix-overlay', { 'mix-blend-mode': 'overlay' }],
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
          'letter-spacing': '-0.02em',
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
    'text-primary-light',
    'text-primary-dark',
    'text-secondary',
    'text-accent',
    'text-neon',
    'text-electric',
    'bg-primary',
    'bg-secondary',
    'bg-accent',
    'border-primary',
    'border-secondary',
    'border-accent',
    'glow-primary',
    'glow-secondary',
    'glow-accent',
    'animate-glitch',
    'animate-rgb-split',
    'animate-text-flicker',
    'animate-distort',
  ],
})
