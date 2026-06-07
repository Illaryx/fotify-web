let refreshPromise: Promise<void> | null = null

export async function apiFetch<T>(
	path: string,
	options: Parameters<typeof $fetch>[1] = {},
): Promise<T> {
	const config = useRuntimeConfig()
	const { $pinia } = useNuxtApp()
	const { tokens, refresh } = useAuthStore($pinia)

	const doFetch = () =>
		$fetch(`${config.public.apiBase}${path}`, {
			...options,
			headers: {
				...options.headers,
				...(tokens.access ? { Authorization: `Bearer ${tokens.access}` } : {}),
			},
		}) as Promise<T>

	try {
		return await doFetch()
	} catch (err: unknown) {
		const fetchErr = err as { status?: number }
		if (fetchErr?.status === 401 && tokens.refresh) {
			if (!refreshPromise) {
				refreshPromise = refresh().finally(() => {
					refreshPromise = null
				})
			}
			await refreshPromise
			return await doFetch()
		}
		throw err
	}
}
