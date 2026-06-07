import { defineStore } from "pinia"
import type { TokenPair } from "~/types"

export const useAuthStore = defineStore("auth", () => {
	const accessToken = useCookie<string | null>("fotify_access", { default: () => null })
	const refreshToken = useCookie<string | null>("fotify_refresh", {
		default: () => null,
		maxAge: 60 * 60 * 24 * 30,
	})
	const role = useCookie<string | null>("fotify_role", { default: () => null })

	const isAuthenticated = computed(() => !!accessToken.value)
	const isPhotographer = computed(() => role.value === "photographer" || role.value === "admin")
	const isAdmin = computed(() => role.value === "admin")

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
			const data = await $fetch<{ data: TokenPair }>("/auth/refresh", {
				baseURL: useRuntimeConfig().public.apiBase,
				method: "POST",
				body: { refresh_token: refreshToken.value },
			})
			if (data.data) setTokens(data.data)
		} catch {
			const { show } = useToast()
			show("Tu sesión expiró. Por favor inicia sesión nuevamente.", { type: "warning" })
			logout()
		}
	}

	let authChannel: BroadcastChannel | null = null
	if (import.meta.client) {
		authChannel = new BroadcastChannel("fotify_auth")
		authChannel.onmessage = (e) => {
			if (e.data === "logout") {
				accessToken.value = null
				refreshToken.value = null
				role.value = null
				navigateTo("/")
			}
		}
	}

	async function logout(broadcast = true) {
		if (refreshToken.value) {
			try {
				await $fetch("/auth/logout", {
					baseURL: useRuntimeConfig().public.apiBase,
					method: "POST",
					body: { refresh_token: refreshToken.value },
				})
			} catch {
				// Best-effort — clear local state regardless
			}
		}
		accessToken.value = null
		refreshToken.value = null
		role.value = null
		if (broadcast) authChannel?.postMessage("logout")
		navigateTo("/")
	}

	return { tokens, isAuthenticated, isPhotographer, isAdmin, setTokens, refresh, logout }
})
