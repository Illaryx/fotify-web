import { vi } from "vitest"
import { ref, computed, type Ref } from "vue"

// Mock Nuxt auto-imports
const stateStore = new Map<string, Ref>()

function useStateMock(key: string, init?: () => unknown) {
	if (!stateStore.has(key)) {
		stateStore.set(key, ref(init ? init() : undefined))
	}
	return stateStore.get(key)!
}

vi.stubGlobal("useState", useStateMock)
vi.stubGlobal("computed", computed)
vi.stubGlobal("apiFetch", vi.fn())

beforeEach(() => {
	stateStore.clear()
	vi.clearAllMocks()
})
