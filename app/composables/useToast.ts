const visible = ref(false)
const message = ref("")
const variant = ref<"success" | "error" | "warning">("success")
let timer: ReturnType<typeof setTimeout> | null = null

export function useToast() {
	function show(msg: string, opts?: { type?: "success" | "error" | "warning"; duration?: number }) {
		message.value = msg
		variant.value = opts?.type ?? "success"
		visible.value = true
		if (timer) clearTimeout(timer)
		timer = setTimeout(() => {
			visible.value = false
		}, opts?.duration ?? 4000)
	}

	return { visible, message, variant, show }
}
