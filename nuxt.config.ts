import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/sitemap',
  ],

  site: {
    url: 'https://fotify.pe',
    name: 'Fotify',
  },

  sitemap: {
    exclude: ['/search/**', '/checkout', '/purchases', '/downloads/**', '/account', '/auth/**'],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:8080/api/v1',
      dashboardBase: process.env.NUXT_PUBLIC_DASHBOARD_BASE ?? 'http://localhost:3001',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'es-PE' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      meta: [
        { name: 'description', content: 'Marketplace de fotografía deportiva con IA. Sube tu selfie y encuentra tus fotos en segundos.' },
        { property: 'og:site_name', content: 'Fotify' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'es_PE' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@fotify_pe' },
      ],
      script: [
        {
          src: 'https://static.micuentaweb.pe/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js',
          defer: true,
        },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'dns-prefetch', href: 'https://cdn.fotify.pe' },
      ],
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/events'],
    },
  },

  routeRules: {
    '/': { prerender: true },
    '/events': { prerender: true },
    '/events/**': { prerender: true },
    '/photographers/**': { prerender: true },
    '/for-photographers': { prerender: true },
    '/how-it-works': { prerender: true },
    '/legal': { prerender: true },

    '/search/**': { ssr: false },
    '/checkout': { ssr: false },
    '/purchases': { ssr: false },
    '/downloads/**': { ssr: false },
  },

  image: {
    domains: ['cdn.fotify.pe'],
  },

  typescript: {
    strict: true,
  },
})
