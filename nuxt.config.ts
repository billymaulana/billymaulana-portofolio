export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
  ],
   experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },
  css: [
    '@unocss/reset/tailwind.css',
  ],
  colorMode: {
    classSuffix: '',
  },
  nitro: {
    preset: "vercel",
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },

  app: {
    head: {
      title: 'Billy Maulana',
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: "Billy Maulana Portfolio" },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
    },
  },
})
