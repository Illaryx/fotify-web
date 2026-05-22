import { defineStore } from 'pinia'

export type OrderType = 'single' | 'pack' | 'full_event'

export const useCartStore = defineStore('cart', () => {
  const eventId = ref<number | null>(null)
  const photoIds = ref<number[]>([])
  const searchSessionId = ref<number | null>(null)
  const orderType = ref<OrderType>('single')

  const count = computed(() => photoIds.value.length)
  const hasPhotos = computed(() => photoIds.value.length > 0)

  function setEvent(id: number) {
    if (eventId.value !== id) {
      eventId.value = id
      photoIds.value = []
      orderType.value = 'single'
    }
  }

  function toggle(id: number) {
    const idx = photoIds.value.indexOf(id)
    if (idx >= 0) photoIds.value.splice(idx, 1)
    else photoIds.value.push(id)
    // When individually selecting photos, always single
    orderType.value = 'single'
  }

  function has(id: number): boolean {
    return photoIds.value.includes(id)
  }

  function setSession(id: number) {
    searchSessionId.value = id
  }

  function setPack(ids: number[], eventID: number) {
    eventId.value = eventID
    photoIds.value = [...ids]
    orderType.value = 'pack'
  }

  function setFullEvent(ids: number[], eventID: number) {
    eventId.value = eventID
    photoIds.value = [...ids]
    orderType.value = 'full_event'
  }

  function clear() {
    photoIds.value = []
    eventId.value = null
    searchSessionId.value = null
    orderType.value = 'single'
  }

  return {
    eventId, photoIds, searchSessionId, orderType,
    count, hasPhotos,
    setEvent, setSession, toggle, has, setPack, setFullEvent, clear,
  }
})
