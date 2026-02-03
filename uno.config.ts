import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    // Typography shortcuts - Monochrome System
    ['text-display', 'font-satoshi font-900 leading-[0.9] tracking-[-0.03em]'],
    ['text-headline', 'font-satoshi font-700 leading-[1.1] tracking-[-0.02em]'],
    ['text-title', 'font-satoshi font-600 leading-[1.2]'],
    ['text-body', 'font-satoshi font-500 leading-[1.6] text-mono-secondary'],
    ['text-label', 'font-satoshi font-500 text-[11px] uppercase tracking-[0.2em]'],
    ['text-micro', 'font-satoshi font-400 text-[11px] uppercase tracking-[0.15em]'],

    // Button variants - Monochrome + Single Accent
    ['btn-accent', 'px-8 py-4 bg-accent text-black font-600 text-[13px] uppercase tracking-[0.1em] transition-all duration-300 hover:shadow-[0_0_40px_rgba(124,58,237,0.4)]'],
    ['btn-ghost', 'px-8 py-4 bg-transparent border border-mono-border text-white font-600 text-[13px] uppercase tracking-[0.1em] transition-all duration-300 hover:border-accent hover:text-accent'],
    ['btn-text', 'text-mono-secondary font-500 text-[13px] uppercase tracking-[0.1em] transition-colors duration-300 hover:text-white'],

    // Text utilities
    ['text-outline', 'text-transparent [-webkit-text-stroke:1px_currentColor]'],
    ['text-outline-accent', 'text-transparent [-webkit-text-stroke:2px_#7C3AED]'],
    ['text-outline-white', 'text-transparent [-webkit-text-stroke:2px_white]'],

    // Layout utilities
    ['section-padding', 'px-6 md:px-12 lg:px-16'],
    ['section-gap', 'py-20 md:py-32 lg:py-40'],
    ['container-narrow', 'max-w-[1200px] mx-auto'],
    ['container-wide', 'max-w-[1440px] mx-auto'],
  ],

  theme: {
    colors: {
      // Monochrome Foundation (95% of UI)
      'mono': {
        'bg': '#000000', // Pure black - main background
        'bg-secondary': '#0A0A0A', // Near black - cards, sections
        'bg-tertiary': '#111111', // Subtle elevation
        'bg-elevated': '#1A1A1A', // Hover states, modals
        'primary': '#FFFFFF', // Headlines, important text
        'secondary': '#888888', // Body text, descriptions
        'tertiary': '#555555', // Muted, captions
        'disabled': '#333333', // Inactive states
        'border': '#1A1A1A', // Subtle dividers
        'border-default': '#333333', // Default borders
        'border-strong': '#555555', // Emphasis borders
      },

      // Single Accent Color (5% of UI - Strategic Use Only)
      'accent': '#7C3AED',
      'accent-hover': '#D4FF4D',
      'accent-muted': 'rgba(124, 58, 237, 0.1)',
      'accent-glow': 'rgba(124, 58, 237, 0.4)',

      // Semantic aliases
      'background': '#000000',
      'foreground': '#FFFFFF',
    },
    fontFamily: {
      satoshi: ['Satoshi', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      // Display Scale (3x jump ratio for impact)
      'display-hero': ['clamp(72px, 12vw, 160px)', { lineHeight: '0.9', fontWeight: '900', letterSpacing: '-0.03em' }],
      'display-lg': ['clamp(48px, 8vw, 96px)', { lineHeight: '0.95', fontWeight: '900', letterSpacing: '-0.02em' }],
      'display-md': ['clamp(32px, 5vw, 56px)', { lineHeight: '1', fontWeight: '700', letterSpacing: '-0.02em' }],

      // Content Scale
      'lead': ['clamp(20px, 2.5vw, 28px)', { lineHeight: '1.5', fontWeight: '400' }],
      'body': ['16px', { lineHeight: '1.6', fontWeight: '500' }],
      'small': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
      'micro': ['11px', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.1em' }],

      // Marquee
      'marquee': ['clamp(40px, 6vw, 80px)', { lineHeight: '1', fontWeight: '700' }],
    },
    spacing: {
      // 8px grid system
      18: '72px', // Nav height
      22: '88px',
      26: '104px',
      30: '120px',
      34: '136px',
      38: '152px',
      42: '168px',
    },
    animation: {
      keyframes: {
        'float': '{0%, 100% { transform: translateY(0) } 50% { transform: translateY(-20px) }}',
        'pulse-accent': '{0%, 100% { opacity: 1 } 50% { opacity: 0.5 }}',
        'fade-in': '{from { opacity: 0 } to { opacity: 1 }}',
        'slide-up': '{from { opacity: 0; transform: translateY(40px) } to { opacity: 1; transform: translateY(0) }}',
        'line-expand': '{from { transform: scaleX(0) } to { transform: scaleX(1) }}',
      },
      durations: {
        'float': '6s',
        'pulse-accent': '2s',
        'fade-in': '0.6s',
        'slide-up': '0.8s',
        'line-expand': '0.6s',
      },
      timingFns: {
        'float': 'ease-in-out',
        'pulse-accent': 'ease-in-out',
        'fade-in': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'slide-up': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'line-expand': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      counts: {
        'float': 'infinite',
        'pulse-accent': 'infinite',
      },
    },
  },

  presets: [
    presetWind4(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetTypography(),
  ],

  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
