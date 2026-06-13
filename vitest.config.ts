import { defineConfig } from "vitest/config"
import { resolve } from "node:path"

export default defineConfig({
	resolve: {
		alias: {
			"~": resolve(__dirname, "app"),
			"#app": resolve(__dirname, "node_modules/nuxt/dist/app"),
		},
	},
	test: {
		environment: "happy-dom",
		globals: true,
		setupFiles: ["./tests/setup.ts"],
		include: ["tests/**/*.test.ts"],
	},
})
