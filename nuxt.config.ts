// Site metadata - centralized for SEO consistency
const siteConfig = {
  name: 'Billy Maulana',
  title: 'Billy Maulana | Frontend Architect',
  description: 'Frontend Architect with 7+ years experience building high-performance Vue.js applications. Crafted PLN Mobile serving 80M+ users. Specialized in design systems, animations, and user experience.',
  url: 'https://billymaulana.com',
  ogImage: '/assets/favicon/og-image.png',
  twitterHandle: '@billymaulana',
  locale: 'en_US',
}

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  // TODO: Re-enable SSR after Nuxt #vite-node Windows/pnpm fix
  ssr: false,

  experimental: {
    payloadExtraction: true,
  },

  modules: [
    '@unocss/nuxt',
    '@nuxt/icon',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
  ],

  // Site URL for sitemap/robots
  site: {
    zeroRuntime: true,
    url: siteConfig.url,
  },

  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/css/main.css',
  ],

  icon: {
    componentName: 'NuxtIcon',
    serverBundle: 'remote',
    clientBundle: {
      scan: true,
    },
  },

  image: {
    quality: 80,
    format: ['webp', 'avif', 'png', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
  },

  build: {
    transpile: ['gsap'],
  },

  // SSG Configuration - auto-detects platform (Netlify/Vercel)
  nitro: {
    preset: 'static',
    prerender: {
      crawlLinks: true,
      routes: ['/'],
      failOnError: false,
    },
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
  },

  // Route Rules for hybrid rendering (all prerendered for portfolio)
  routeRules: {
    '/': { prerender: true },
    '/**': { prerender: true },
  },

  // Comprehensive SEO Head Configuration
  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
      title: siteConfig.title,
      titleTemplate: '%s | Billy Maulana',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: siteConfig.description },

        // Theme & App
        { name: 'theme-color', content: '#000000' },
        { name: 'apple-mobile-web-app-title', content: siteConfig.name },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'mobile-web-app-capable', content: 'yes' },

        // SEO
        { name: 'author', content: siteConfig.name },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'googlebot', content: 'index, follow' },

        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: siteConfig.name },
        { property: 'og:title', content: siteConfig.title },
        { property: 'og:description', content: siteConfig.description },
        { property: 'og:url', content: siteConfig.url },
        { property: 'og:image', content: `${siteConfig.url}${siteConfig.ogImage}` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:locale', content: siteConfig.locale },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: siteConfig.twitterHandle },
        { name: 'twitter:creator', content: siteConfig.twitterHandle },
        { name: 'twitter:title', content: siteConfig.title },
        { name: 'twitter:description', content: siteConfig.description },
        { name: 'twitter:image', content: `${siteConfig.url}${siteConfig.ogImage}` },
      ],
      link: [
        // Favicon
        { rel: 'icon', type: 'image/svg+xml', href: '/assets/favicon/favicon.svg' },
        { rel: 'icon', type: 'image/png', sizes: '96x96', href: '/assets/favicon/favicon-96x96.png' },
        { rel: 'icon', type: 'image/x-icon', href: '/assets/favicon/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/assets/favicon/apple-touch-icon.png' },
        { rel: 'manifest', href: '/assets/favicon/site.webmanifest' },

        // Preconnect — Google Fonts (JetBrains Mono only)
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },

        // Preload critical self-hosted fonts (Clash Display + Satoshi)
        { rel: 'preload', href: '/assets/fonts/clash-display/ClashDisplay-Variable.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },
        { rel: 'preload', href: '/assets/fonts/satoshi/Satoshi-Variable.woff2', as: 'font', type: 'font/woff2', crossorigin: '' },

        // JetBrains Mono — monospace (used sparingly for counters/tags)
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap' },

        // Canonical URL
        { rel: 'canonical', href: siteConfig.url },
      ],
      script: [
        // JSON-LD Structured Data
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            'name': 'Billy Maulana',
            'jobTitle': 'Frontend Engineer',
            'description': siteConfig.description,
            'url': siteConfig.url,
            'image': `${siteConfig.url}${siteConfig.ogImage}`,
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': 'Bandung',
              'addressCountry': 'Indonesia',
            },
            'sameAs': [
              'https://linkedin.com/in/billy-maulana',
              'https://github.com/billymaulana',
            ],
            'knowsAbout': [
              'Vue.js',
              'Nuxt.js',
              'TypeScript',
              'Frontend Development',
              'Design Systems',
              'Web Performance',
              'User Experience',
            ],
          }),
        },
      ],
    },
  },

  devtools: { enabled: true },

  compatibilityDate: '2025-01-31',
})
