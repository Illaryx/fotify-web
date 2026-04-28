export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) return navigateTo('/')
  if (!auth.isPhotographer) return navigateTo('/')
})
