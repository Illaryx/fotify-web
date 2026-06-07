import { apiFetch, validateCartPhotos } from "~/composables/useApi"
import type { EventResponse, SingleEnvelope } from "~/types"
import type { CartPhoto } from "~/stores/cart"

export type CheckoutStep = "detail" | "processing" | "payment-form" | "success" | "failed"

const CHECKOUT_KEY = Symbol("checkout") as InjectionKey<ReturnType<typeof createCheckoutState>>

function createCheckoutState() {
	const cart = useCartStore()
	const route = useRoute()

	// Shared state
	const step = ref<CheckoutStep>("detail")
	const event = ref<EventResponse | null>(null)
	const userEmail = ref("")
	const orderId = ref<number | null>(null)
	const successPhotoCount = ref(0)
	const isValidating = ref(true)
	const unavailablePhotos = ref<CartPhoto[]>([])
	const failedError = ref<string | null>(null)

	// Computed
	const totalAmount = computed(() => {
		if (!event.value?.photo_price || !cart.count) return 0
		return cart.count * event.value.photo_price
	})

	const formattedTotal = computed(() => `S/ ${totalAmount.value.toFixed(2)}`)

	const backLink = computed(() => {
		const slug = route.query.event_slug as string | undefined
		if (slug) return `/events/${slug}`
		return "/events"
	})

	// Actions
	async function fetchEvent() {
		if (!cart.eventId) return
		try {
			const res = await apiFetch<SingleEnvelope<EventResponse>>(`/events/${cart.eventId}`)
			event.value = res.data ?? null
		} catch {
			/* optional context */
		}
	}

	async function fetchUserEmail() {
		try {
			const res = await apiFetch<{ data?: { email?: string } }>("/auth/me")
			userEmail.value = res.data?.email ?? ""
		} catch {
			/* not critical */
		}
	}

	async function validateCart() {
		if (!cart.eventId || !cart.hasPhotos) return

		try {
			const res = await validateCartPhotos(cart.eventId, [...cart.photoIds])
			if (res.invalid.length > 0) {
				const invalidSet = new Set(res.invalid)
				unavailablePhotos.value = cart.photos.filter((p) => invalidSet.has(p.id))

				if (cart.orderType === "full_event") {
					cart.orderType = "single"
				}

				cart.removePhotos(res.invalid)
			}
		} catch {
			// Network error — skip validation, POST /orders validates server-side
		}
	}

	function dismissUnavailable() {
		unavailablePhotos.value = []
	}

	function formatDate(dateStr: string): string {
		return new Date(dateStr).toLocaleDateString("es-PE", {
			day: "numeric",
			month: "short",
			year: "numeric",
		})
	}

	function persistOrderPhotos(oid: number, ids: number[]) {
		try {
			localStorage.setItem(`fotify_order_photos_${oid}`, JSON.stringify(ids))
		} catch {
			/* ignore storage errors */
		}
	}

	return {
		step,
		event,
		userEmail,
		orderId,
		successPhotoCount,
		isValidating,
		unavailablePhotos,
		failedError,
		totalAmount,
		formattedTotal,
		backLink,
		fetchEvent,
		fetchUserEmail,
		validateCart,
		dismissUnavailable,
		formatDate,
		persistOrderPhotos,
	}
}

export function provideCheckout() {
	const state = createCheckoutState()
	provide(CHECKOUT_KEY, state)
	return state
}

export function useCheckout() {
	const state = inject(CHECKOUT_KEY)
	if (!state) throw new Error("useCheckout() must be used inside a checkout route")
	return state
}
