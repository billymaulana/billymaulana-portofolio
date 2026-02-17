import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetWebFonts,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    // Layout
    ['flex-center', 'flex items-center justify-center'],
    ['flex-between', 'flex items-center justify-between'],
  ],

  theme: {
    // Breakpoints (mobile-first)
    breakpoints: {
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },

    // Color structure (fill values later)
    colors: {
      accent: {},
      bg: {},
      mono: {},
    },

    // Typography structure
    fontFamily: {
      sans: ['Satoshi', 'system-ui', '-apple-system', 'sans-serif'],
    },

    // Spacing extends Tailwind defaults
    spacing: {},
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
    presetWebFonts({
      provider: 'fontshare',
      fonts: {
        satoshi: [
          { name: 'Satoshi', weights: ['500', '700', '900'] },
        ],
      },
    }),
  ],

  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
})
