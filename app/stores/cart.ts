import { defineStore } from "pinia"

export type OrderType = "single" | "pack" | "full_event"

export interface CartPhoto {
	id: number
	thumbnailUrl: string
}

const STORAGE_KEY = "fotify_cart"

export const useCartStore = defineStore("cart", () => {
	const eventId = ref<number | null>(null)
	const photos = ref<CartPhoto[]>([])
	const searchSessionId = ref<number | null>(null)
	const orderType = ref<OrderType>("single")

	// Hydrate from localStorage on first client load
	if (import.meta.client) {
		try {
			const saved = localStorage.getItem(STORAGE_KEY)
			if (saved) {
				const data = JSON.parse(saved)
				eventId.value = data.eventId ?? null
				// Backward compat: migrate old photoIds format to photos
				if (Array.isArray(data.photos)) {
					photos.value = data.photos
				} else if (Array.isArray(data.photoIds)) {
					photos.value = data.photoIds.map((id: number) => ({ id, thumbnailUrl: "" }))
				}
				searchSessionId.value = data.searchSessionId ?? null
				orderType.value = data.orderType ?? "single"
			}
		} catch {
			/* corrupted data — start fresh */
		}
	}

	// Persist on any state change
	watch(
		[eventId, photos, searchSessionId, orderType],
		() => {
			if (!import.meta.client) return
			localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					eventId: eventId.value,
					photos: photos.value,
					searchSessionId: searchSessionId.value,
					orderType: orderType.value,
				}),
			)
		},
		{ deep: true },
	)

	const photoIds = computed(() => photos.value.map((p) => p.id))
	const count = computed(() => photos.value.length)
	const hasPhotos = computed(() => photos.value.length > 0)

	function setEvent(id: number) {
		if (eventId.value !== id) {
			eventId.value = id
			photos.value = []
			orderType.value = "single"
		}
	}

	function toggle(photo: CartPhoto) {
		const idx = photos.value.findIndex((p) => p.id === photo.id)
		if (idx >= 0) photos.value.splice(idx, 1)
		else photos.value.push(photo)
		orderType.value = "single"
	}

	function has(id: number): boolean {
		return photos.value.some((p) => p.id === id)
	}

	function setSession(id: number) {
		searchSessionId.value = id
	}

	function setPack(items: CartPhoto[], eventID: number) {
		eventId.value = eventID
		photos.value = [...items]
		orderType.value = "pack"
	}

	function setFullEvent(items: CartPhoto[], eventID: number) {
		eventId.value = eventID
		photos.value = [...items]
		orderType.value = "full_event"
	}

	function removePhotos(ids: number[]) {
		const toRemove = new Set(ids)
		photos.value = photos.value.filter((p) => !toRemove.has(p.id))
		if (photos.value.length === 0) {
			orderType.value = "single"
		}
	}

	function clear() {
		photos.value = []
		eventId.value = null
		searchSessionId.value = null
		orderType.value = "single"
		if (import.meta.client) localStorage.removeItem(STORAGE_KEY)
	}

	return {
		eventId,
		photos,
		photoIds,
		searchSessionId,
		orderType,
		count,
		hasPhotos,
		setEvent,
		setSession,
		toggle,
		has,
		setPack,
		setFullEvent,
		removePhotos,
		clear,
	}
})
