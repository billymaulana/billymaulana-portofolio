export default defineNuxtConfig({
  ssr: false, // Disable SSR to fix client-side hydration issues

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
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Billy Maulana - Portfolio',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Billy Maulana - Portfolio' },
        { name: 'theme-color', content: '#000000' },
        { name: 'apple-mobile-web-app-title', content: 'Billy Maulana' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/assets/favicon/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/assets/favicon/favicon-96x96.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/assets/favicon/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/assets/favicon/apple-touch-icon.png' },
        { rel: 'manifest', href: '/assets/favicon/site.webmanifest' },
      ],
    },
  },

  devtools: { enabled: true },

  compatibilityDate: '2025-01-31',
})
