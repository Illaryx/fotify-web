import { describe, it, expect, vi } from "vitest"
import { usePricing } from "~/composables/usePricing"

describe("usePricing", () => {
	it("returns fallback defaults before fetch", () => {
		const { photoPrice, packs, fullEventPrice } = usePricing()
		expect(photoPrice.value).toBe(15)
		expect(packs.value).toHaveLength(3)
		expect(fullEventPrice.value).toBe(129)
	})

	it("returns default fee percentages when no fees in data", () => {
		const { platformCommissionPct, gatewayFeePct, taxIgvPct } = usePricing()
		expect(platformCommissionPct.value).toBe(8)
		expect(gatewayFeePct.value).toBe(3.99)
		expect(taxIgvPct.value).toBe(18)
	})

	it("fetchPricing updates pricing from API", async () => {
		const apiData = {
			data: {
				photo_price: 20,
				packs: [{ quantity: 5, price: 80 }],
				full_event_price: 200,
				fees: {
					platform_commission_pct: 10,
					payment_gateway_fee_pct: 4.5,
					tax_igv_pct: 18,
				},
			},
		}
		vi.mocked(apiFetch).mockResolvedValueOnce(apiData)

		const { fetchPricing, photoPrice, packs, fullEventPrice, platformCommissionPct, gatewayFeePct, taxIgvPct } =
			usePricing()

		await fetchPricing()

		expect(apiFetch).toHaveBeenCalledWith("/web/config/pricing")
		expect(photoPrice.value).toBe(20)
		expect(packs.value).toEqual([{ quantity: 5, price: 80 }])
		expect(fullEventPrice.value).toBe(200)
		expect(platformCommissionPct.value).toBe(10)
		expect(gatewayFeePct.value).toBe(4.5)
		expect(taxIgvPct.value).toBe(18)
	})

	it("fetchPricing is idempotent (second call skips API)", async () => {
		vi.mocked(apiFetch).mockResolvedValue({ data: { photo_price: 25, packs: [], full_event_price: 300 } })

		const { fetchPricing } = usePricing()
		await fetchPricing()

		const { fetchPricing: fetchAgain } = usePricing()
		await fetchAgain()

		expect(apiFetch).toHaveBeenCalledTimes(1)
	})

	it("fetchPricing keeps fallbacks on API error", async () => {
		vi.mocked(apiFetch).mockRejectedValueOnce(new Error("network"))

		const { fetchPricing, photoPrice, fullEventPrice } = usePricing()
		await fetchPricing()

		expect(photoPrice.value).toBe(15)
		expect(fullEventPrice.value).toBe(129)
	})

	it("savingsAmount calculates correctly", () => {
		const { savingsAmount } = usePricing()
		expect(savingsAmount({ quantity: 5, price: 59 })).toBe(5 * 15 - 59)
	})

	it("savingsPct calculates correct percentage", () => {
		const { savingsPct } = usePricing()
		const pct = savingsPct({ quantity: 10, price: 99 })
		expect(pct).toBe(Math.round(((150 - 99) / 150) * 100))
	})

	it("savingsPct returns 0 when full price is 0", async () => {
		vi.mocked(apiFetch).mockResolvedValueOnce({
			data: { photo_price: 0, packs: [], full_event_price: 0 },
		})
		const { fetchPricing, savingsPct } = usePricing()
		await fetchPricing()

		expect(savingsPct({ quantity: 5, price: 10 })).toBe(0)
	})
})
