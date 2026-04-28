export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore()
  if (!auth.isAuthenticated) return navigateTo('/')
  // Admins go to their own panel, not the photographer dashboard
  if (auth.isAdmin) return navigateTo('/admin')
  if (!auth.isPhotographer) return navigateTo('/')
})
