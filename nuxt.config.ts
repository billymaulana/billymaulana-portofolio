export default defineNuxtConfig({
  modules: [
    'nuxt-typed-router',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
  ],
  build: {
    transpile: ['gsap'],
  },
  imports: {
    autoImport: true
  },
  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
  },
  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/styles/main.css',
  ],
  colorMode: {
    classSuffix: '',
  },
  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: "en",
      },
      title: 'Billy Maulana | Frontend Developer',
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: "Billy Maulana Portfolio, I'm a Front-End Web Developer based in Bandung, Indonesia." },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        {
          name: "keywords",
          content:
            "Web Developer, Front End Developer, Frontend Developer, Junior Web Developer, Software Developer, Software Engineer, Po Yi Zhi, Yi Zhi, Po YZ, YZ Po, eazypau, Malaysia",
        },
      ],
    },
  },

  devtools: {
    enabled: true,
  },
})
