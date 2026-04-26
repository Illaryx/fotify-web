import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', () => {
  const eventId = ref<number | null>(null)
  const photoIds = ref<number[]>([])
  const searchSessionId = ref<number | null>(null)

  const count = computed(() => photoIds.value.length)
  const hasPhotos = computed(() => photoIds.value.length > 0)

  function setEvent(id: number) {
    if (eventId.value !== id) {
      eventId.value = id
      photoIds.value = []
    }
  }

  function toggle(id: number) {
    const idx = photoIds.value.indexOf(id)
    if (idx >= 0) photoIds.value.splice(idx, 1)
    else photoIds.value.push(id)
  }

  function has(id: number): boolean {
    return photoIds.value.includes(id)
  }

  function setSession(id: number) {
    searchSessionId.value = id
  }

  function clear() {
    photoIds.value = []
    eventId.value = null
    searchSessionId.value = null
  }

  return { eventId, photoIds, searchSessionId, count, hasPhotos, setEvent, setSession, toggle, has, clear }
})
