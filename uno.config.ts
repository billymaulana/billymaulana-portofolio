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
  ],

  theme: {
    colors: {
      primary: '#3b82f6',
      secondary: '#64748b',
      // Purple palette for splash/branding
      purple: {
        50: '#faf5ff',
        100: '#f3e8ff',
        200: '#e9d5ff',
        300: '#d8b4fe',
        400: '#c084fc',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7c3aed',
        800: '#6b21a8',
        900: '#581c87',
      },
      violet: {
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
      },
      indigo: {
        400: '#818cf8',
        500: '#6366f1',
      },
    },
    fontFamily: {
      satoshi: ['Satoshi', 'system-ui', 'sans-serif'],
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
