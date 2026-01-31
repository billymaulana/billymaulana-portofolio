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
