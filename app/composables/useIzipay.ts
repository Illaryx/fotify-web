interface KryptonClient {
	setFormConfig(config: Record<string, unknown>): Promise<void>
	onSubmit(callback: (data: KryptonSubmitEvent) => void): void
	submit(): Promise<void>
	destroy(): Promise<void>
}

interface KryptonSubmitEvent {
	clientAnswer: Record<string, unknown> // Krypton returns a parsed object, not a raw string
	hash: string // kr-hash: HMAC-SHA256 of the serialized clientAnswer
}

declare global {
	interface Window {
		KR?: KryptonClient
	}
}

export function useIzipay() {
	async function initForm(formToken: string, publicKey: string): Promise<void> {
		const KR = window.KR
		if (!KR) throw new Error("Krypton Client no cargado. Recarga la página.")

		await KR.setFormConfig({
			formToken,
			"kr-public-key": publicKey,
			"kr-language": "es-PE",
		})
	}

	function onPaymentResult(callback: (krAnswer: string, krHash: string) => void): void {
		const KR = window.KR
		if (!KR) return

		KR.onSubmit((event: KryptonSubmitEvent) => {
			const answer =
				typeof event.clientAnswer === "string"
					? event.clientAnswer
					: JSON.stringify(event.clientAnswer)
			callback(answer, event.hash)
		})
	}

	// Programmatically submit the Krypton form. Call this from your own Pay button
	// instead of relying on Krypton's default kr-payment-button.
	async function submit(): Promise<void> {
		const KR = window.KR
		if (!KR) throw new Error("Krypton Client no cargado.")
		await KR.submit()
	}

	async function destroy(): Promise<void> {
		if (window.KR && typeof window.KR.destroy === "function") {
			await window.KR.destroy()
		}
	}

	return { initForm, onPaymentResult, submit, destroy }
}
