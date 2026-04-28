export async function apiFetch<T>(
  path: string,
  options: Parameters<typeof $fetch>[1] = {},
): Promise<T> {
  const config = useRuntimeConfig()
  const { tokens, refresh } = useAuthStore()

  const doFetch = () =>
    $fetch<T>(`${config.public.apiBase}${path}`, {
      ...options,
      headers: {
        ...options.headers,
        ...(tokens.access ? { Authorization: `Bearer ${tokens.access}` } : {}),
      },
    })

  try {
    return await doFetch()
  }
  catch (err: any) {
    if (err?.status === 401 && tokens.refresh) {
      await refresh()
      return await doFetch()
    }
    throw err
  }
}
