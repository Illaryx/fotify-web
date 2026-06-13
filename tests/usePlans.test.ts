import { describe, it, expect, vi } from "vitest"
import { usePlans, type PublicPlan } from "~/composables/usePlans"

const makePlan = (overrides: Partial<PublicPlan> & { slug: string }): PublicPlan => ({
	name: overrides.slug,
	features: [],
	...overrides,
})

describe("usePlans", () => {
	it("returns empty plans before fetch", () => {
		const { plans, starterPlan, proPlan, enterprisePlan, payPerUsePlan } = usePlans()
		expect(plans.value).toEqual([])
		expect(starterPlan.value).toBeUndefined()
		expect(proPlan.value).toBeUndefined()
		expect(enterprisePlan.value).toBeUndefined()
		expect(payPerUsePlan.value).toBeUndefined()
	})

	it("fetchPlans populates all plan computed refs", async () => {
		const apiPlans = [
			makePlan({ slug: "starter", commission_rate: 0.08 }),
			makePlan({ slug: "pro_events", commission_rate: 0.12 }),
			makePlan({ slug: "enterprise", commission_rate: 0.05 }),
			makePlan({ slug: "pay_per_use", commission_rate: 0.05 }),
		]
		vi.mocked(apiFetch).mockResolvedValueOnce({ data: apiPlans })

		const { fetchPlans, starterPlan, proPlan, enterprisePlan, payPerUsePlan } = usePlans()
		await fetchPlans()

		expect(apiFetch).toHaveBeenCalledWith("/web/plans")
		expect(starterPlan.value?.slug).toBe("starter")
		expect(proPlan.value?.slug).toBe("pro_events")
		expect(enterprisePlan.value?.slug).toBe("enterprise")
		expect(payPerUsePlan.value?.slug).toBe("pay_per_use")
	})

	it("fetchPlans is idempotent (second call skips API)", async () => {
		vi.mocked(apiFetch).mockResolvedValue({ data: [] })

		const { fetchPlans } = usePlans()
		await fetchPlans()

		const { fetchPlans: fetchAgain } = usePlans()
		await fetchAgain()

		expect(apiFetch).toHaveBeenCalledTimes(1)
	})

	it("fetchPlans keeps empty array on API error", async () => {
		vi.mocked(apiFetch).mockRejectedValueOnce(new Error("network"))

		const { fetchPlans, plans } = usePlans()
		await fetchPlans()

		expect(plans.value).toEqual([])
	})

	it("commissionPct converts commission_rate to percentage", () => {
		const { commissionPct } = usePlans()

		expect(commissionPct(makePlan({ slug: "s", commission_rate: 0.08 }), 92)).toBe(92)
		expect(commissionPct(makePlan({ slug: "s", commission_rate: 0.12 }), 88)).toBe(88)
		expect(commissionPct(makePlan({ slug: "s", commission_rate: 0 }), 50)).toBe(100)
		expect(commissionPct(makePlan({ slug: "s", commission_rate: 1 }), 50)).toBe(0)
	})

	it("commissionPct returns fallback when commission_rate is undefined", () => {
		const { commissionPct } = usePlans()
		expect(commissionPct(makePlan({ slug: "s" }), 92)).toBe(92)
		expect(commissionPct(undefined, 88)).toBe(88)
	})

	it("starterCommissionPct uses fallback 92 when no plan", () => {
		const { starterCommissionPct } = usePlans()
		expect(starterCommissionPct.value).toBe(92)
	})

	it("proCommissionPct uses fallback 88 when no plan", () => {
		const { proCommissionPct } = usePlans()
		expect(proCommissionPct.value).toBe(88)
	})

	it("starterCommissionPct computes from API data", async () => {
		vi.mocked(apiFetch).mockResolvedValueOnce({
			data: [makePlan({ slug: "starter", commission_rate: 0.1 })],
		})

		const { fetchPlans, starterCommissionPct } = usePlans()
		await fetchPlans()

		expect(starterCommissionPct.value).toBe(90)
	})
})
