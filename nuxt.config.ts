export default defineNuxtConfig({
  modules: [
    '@unocss/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@pinia/nuxt',
  ],

  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/css/main.css',
  ],

  icon: {
    serverBundle: 'remote',
    clientBundle: {
      scan: true,
    },
  },

  build: {
    transpile: ['gsap'],
  },

  nitro: {
    preset: 'netlify',
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Nuxt Boilerplate',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A Nuxt 3 boilerplate with UnoCSS, GSAP, and more.' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
    },
  },

  devtools: { enabled: true },

  compatibilityDate: '2025-01-31',
})
