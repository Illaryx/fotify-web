<template>
  <Transition name="toast">
    <div
      v-if="visible"
      class="fixed bottom-6 left-1/2 -translate-x-1/2 text-sm px-5 py-3 rounded-full z-[200] whitespace-nowrap border"
      :class="variantClasses"
    >
      {{ message }}
    </div>
  </Transition>
</template>

<script setup lang="ts">
const { visible, message, variant } = useToast()

const variantClasses = computed(() => {
	switch (variant.value) {
		case "error":
			return "bg-night-2 border-red-400/40 text-red-400"
		case "warning":
			return "bg-night-2 border-yellow-400/40 text-yellow-400"
		default:
			return "bg-night-2 border-green-400/40 text-green-400"
	}
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
	transition: opacity 0.3s, transform 0.3s;
}
.toast-enter-from,
.toast-leave-to {
	opacity: 0;
	transform: translate(-50%, 12px);
}
</style>
