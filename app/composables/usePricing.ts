export interface PricingPack {
	quantity: number
	price: number
	highlighted?: boolean
}

export interface DefaultPricing {
	photo_price: number
	packs: PricingPack[]
	full_event_price: number
}

const FALLBACK: DefaultPricing = {
	photo_price: 15,
	packs: [
		{ quantity: 3, price: 38 },
		{ quantity: 5, price: 59, highlighted: true },
		{ quantity: 10, price: 99 },
	],
	full_event_price: 129,
}

export function usePricing() {
	const pricing = useState<DefaultPricing>("pricing", () => ({ ...FALLBACK }))
	const fetched = useState<boolean>("pricing-fetched", () => false)

	async function fetchPricing() {
		if (fetched.value) return
		fetched.value = true
		try {
			const res = await apiFetch<{ data?: DefaultPricing }>("/config/pricing")
			if (res.data) {
				pricing.value = res.data
			}
		} catch {
			// API unreachable — fallback defaults are already set
		}
	}

	const photoPrice = computed(() => pricing.value.photo_price)
	const packs = computed(() => pricing.value.packs)
	const fullEventPrice = computed(() => pricing.value.full_event_price)

	/** Compute savings amount: (quantity * photoPrice) - packPrice */
	function savingsAmount(pack: PricingPack): number {
		return pack.quantity * pricing.value.photo_price - pack.price
	}

	/** Compute savings percentage: rounded integer */
	function savingsPct(pack: PricingPack): number {
		const full = pack.quantity * pricing.value.photo_price
		if (full <= 0) return 0
		return Math.round(((full - pack.price) / full) * 100)
	}

	return {
		pricing,
		loaded: fetched,
		fetchPricing,
		photoPrice,
		packs,
		fullEventPrice,
		savingsAmount,
		savingsPct,
	}
}
