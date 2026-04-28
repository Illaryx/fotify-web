import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

export default defineNuxtPlugin((nuxt) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,   // 1 min — evita refetch inmediato al re-montar
        retry: 1,            // 1 reintento en error de red
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 0,
      },
    },
  })

  nuxt.vueApp.use(VueQueryPlugin, { queryClient })
})
