import type { UseFetchOptions } from 'nuxt/app'

export function useApi<T>(path: string, options: UseFetchOptions<T> = {}) {
  const config = useRuntimeConfig()
  const { tokens, refresh } = useAuthStore()

  return useFetch<T>(`${config.public.apiBase}${path}`, {
    ...options,
    onRequest({ options }) {
      if (tokens.access) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${tokens.access}`,
        }
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401 && tokens.refresh) {
        await refresh()
      }
    },
  })
}

export function useApiPost<T>(path: string, body: unknown, options: UseFetchOptions<T> = {}) {
  return useApi<T>(path, { method: 'POST', body, ...options })
}
