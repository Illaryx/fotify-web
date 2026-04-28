/**
 * Returns a stable placeholder image URL for development when a real
 * thumbnail/compressed URL is not yet available (e.g. photo not yet processed).
 * Uses picsum.photos with a deterministic seed so the same photo ID always
 * resolves to the same placeholder image across page reloads.
 */
export function useDemoPhoto() {
  function getDemoUrl(photoId: number, width = 400, height = 600): string {
    return `https://picsum.photos/seed/fotify-${photoId}/${width}/${height}`
  }

  function getThumbUrl(photo: { id?: number; thumbnail_url?: string | null }, width = 400, height = 600): string {
    if (photo.thumbnail_url) return photo.thumbnail_url
    return getDemoUrl(photo.id ?? 0, width, height)
  }

  return { getDemoUrl, getThumbUrl }
}
