export interface PublicPlan {
	name: string
	slug: string
	description?: string
	monthly_price?: number
	annual_price?: number
	commission_rate?: number
	per_photo_cost?: number
	photo_limit?: number
	max_active_events?: number
	features: string[]
}

export function usePlans() {
	const plans = useState<PublicPlan[]>("plans", () => [])
	const fetched = useState<boolean>("plans-fetched", () => false)

	async function fetchPlans() {
		if (fetched.value) return
		fetched.value = true
		try {
			const res = await apiFetch<{ data?: PublicPlan[] }>("/plans")
			plans.value = res.data ?? []
		} catch {
			// API unreachable — computed fallbacks handle defaults
		}
	}

	const starterPlan = computed(() => plans.value.find((p) => p.slug === "starter"))
	const proPlan = computed(() => plans.value.find((p) => p.slug === "pro_events"))

	const starterCommissionPct = computed(() =>
		starterPlan.value?.commission_rate != null
			? Math.round((1 - starterPlan.value.commission_rate) * 100)
			: 92,
	)
	const proCommissionPct = computed(() =>
		proPlan.value?.commission_rate != null
			? Math.round((1 - proPlan.value.commission_rate) * 100)
			: 88,
	)

	return {
		plans,
		loaded: fetched,
		fetchPlans,
		starterPlan,
		proPlan,
		starterCommissionPct,
		proCommissionPct,
	}
}
