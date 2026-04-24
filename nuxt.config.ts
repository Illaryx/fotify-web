import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  vite: {
    plugins: [tailwindcss()],
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? 'http://localhost:8080/api/v1',
    },
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/events', '/photographers'],
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
    '/dashboard/**': { ssr: false },
    '/admin/**': { ssr: false },
  },

  image: {
    domains: ['cdn.fotify.pe'],
  },

  typescript: {
    strict: true,
  },
})
