import { defineStore } from "pinia"

export type OrderType = "single" | "pack" | "full_event"

const STORAGE_KEY = "fotify_cart"

export const useCartStore = defineStore("cart", () => {
	const eventId = ref<number | null>(null)
	const photoIds = ref<number[]>([])
	const searchSessionId = ref<number | null>(null)
	const orderType = ref<OrderType>("single")

	// Hydrate from sessionStorage on first client load
	if (import.meta.client) {
		try {
			const saved = sessionStorage.getItem(STORAGE_KEY)
			if (saved) {
				const data = JSON.parse(saved)
				eventId.value = data.eventId ?? null
				photoIds.value = data.photoIds ?? []
				searchSessionId.value = data.searchSessionId ?? null
				orderType.value = data.orderType ?? "single"
			}
		} catch {
			/* corrupted data — start fresh */
		}
	}

	// Persist on any state change
	watch(
		[eventId, photoIds, searchSessionId, orderType],
		() => {
			if (!import.meta.client) return
			sessionStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({
					eventId: eventId.value,
					photoIds: photoIds.value,
					searchSessionId: searchSessionId.value,
					orderType: orderType.value,
				}),
			)
		},
		{ deep: true },
	)

	const count = computed(() => photoIds.value.length)
	const hasPhotos = computed(() => photoIds.value.length > 0)

	function setEvent(id: number) {
		if (eventId.value !== id) {
			eventId.value = id
			photoIds.value = []
			orderType.value = "single"
		}
	}

	function toggle(id: number) {
		const idx = photoIds.value.indexOf(id)
		if (idx >= 0) photoIds.value.splice(idx, 1)
		else photoIds.value.push(id)
		orderType.value = "single"
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
		orderType.value = "pack"
	}

	function setFullEvent(ids: number[], eventID: number) {
		eventId.value = eventID
		photoIds.value = [...ids]
		orderType.value = "full_event"
	}

	function clear() {
		photoIds.value = []
		eventId.value = null
		searchSessionId.value = null
		orderType.value = "single"
		if (import.meta.client) sessionStorage.removeItem(STORAGE_KEY)
	}

	return {
		eventId,
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
		clear,
	}
})
