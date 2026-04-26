import { defineStore } from 'pinia'
import type { TokenPair } from '~/types'

export const useAuthStore = defineStore('auth', () => {
  const accessToken = useCookie<string | null>('fotify_access', { default: () => null })
  const refreshToken = useCookie<string | null>('fotify_refresh', { default: () => null, maxAge: 60 * 60 * 24 * 30 })
  const role = useCookie<string | null>('fotify_role', { default: () => null })

  const isAuthenticated = computed(() => !!accessToken.value)
  const isPhotographer = computed(() => role.value === 'photographer' || role.value === 'admin')
  const isAdmin = computed(() => role.value === 'admin')

  const tokens = computed(() => ({
    access: accessToken.value,
    refresh: refreshToken.value,
  }))

  function setTokens(pair: TokenPair) {
    accessToken.value = pair.access_token ?? null
    refreshToken.value = pair.refresh_token ?? null
    role.value = pair.role ?? null
  }

  async function refresh() {
    if (!refreshToken.value) return
    try {
      const data = await $fetch<{ data: TokenPair }>('/auth/refresh', {
        baseURL: useRuntimeConfig().public.apiBase,
        method: 'POST',
        body: { refresh_token: refreshToken.value },
      })
      if (data.data) setTokens(data.data)
    }
    catch {
      logout()
    }
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    role.value = null
    navigateTo('/')
  }

  return { tokens, isAuthenticated, isPhotographer, isAdmin, setTokens, refresh, logout }
})
