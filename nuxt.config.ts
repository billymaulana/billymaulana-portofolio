export default defineNuxtConfig({
  modules: [
    'nuxt-typed-router',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxt/image',
  ],

  build: {
    transpile: ['gsap'],
  },

  imports: {
    autoImport: true,
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },

  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/styles/main.css',
  ],

  nitro: {
    preset: 'netlify',
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
  },

  routeRules: {
    '/': { prerender: true },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: 'Billy Maulana | Frontend Developer',
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png', sizes: '180x180' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Bebas+Neue&display=swap' },
        { rel: 'canonical', href: 'https://billymaulana.com' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Billy Maulana - Versatile Front-End Developer with 7+ years of experience specializing in Vue.js ecosystem. Building complex web apps with stunning animations and interactions.' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'theme-color', content: '#0A0A0A' },
        { name: 'author', content: 'Billy Maulana' },
        { name: 'robots', content: 'index, follow' },
        { name: 'keywords', content: 'Billy Maulana, Frontend Developer, Vue.js Developer, Nuxt Developer, Web Developer, Bandung, Indonesia, GSAP, Animation, UI/UX' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Billy Maulana | Frontend Developer' },
        { property: 'og:description', content: 'Versatile Front-End Developer with 7+ years of experience specializing in Vue.js ecosystem.' },
        { property: 'og:url', content: 'https://billymaulana.com' },
        { property: 'og:site_name', content: 'Billy Maulana Portfolio' },
        { property: 'og:image', content: 'https://billymaulana.com/og-image.svg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Billy Maulana | Frontend Developer' },
        { name: 'twitter:description', content: 'Versatile Front-End Developer with 7+ years of experience specializing in Vue.js ecosystem.' },
        { name: 'twitter:image', content: 'https://billymaulana.com/og-image.svg' },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  devtools: {
    enabled: true,
  },

  compatibilityDate: '2024-11-01',
})
