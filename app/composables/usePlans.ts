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
			const res = await apiFetch<{ data?: PublicPlan[] }>("/web/plans")
			plans.value = res.data ?? []
		} catch {
			// API unreachable — computed fallbacks handle defaults
		}
	}

	const starterPlan = computed(() => plans.value.find((p) => p.slug === "starter"))
	const proPlan = computed(() => plans.value.find((p) => p.slug === "pro_events"))
	const enterprisePlan = computed(() => plans.value.find((p) => p.slug === "enterprise"))
	const payPerUsePlan = computed(() => plans.value.find((p) => p.slug === "pay_per_use"))

	function commissionPct(plan: PublicPlan | undefined, fallback: number): number {
		return plan?.commission_rate != null ? Math.round((1 - plan.commission_rate) * 100) : fallback
	}

	const starterCommissionPct = computed(() => commissionPct(starterPlan.value, 92))
	const proCommissionPct = computed(() => commissionPct(proPlan.value, 88))

	return {
		plans,
		loaded: fetched,
		fetchPlans,
		starterPlan,
		proPlan,
		enterprisePlan,
		payPerUsePlan,
		starterCommissionPct,
		proCommissionPct,
		commissionPct,
	}
}
