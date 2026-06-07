<template>
  <div class="min-h-screen bg-gray-950 flex items-center justify-center px-6">
    <div class="text-center max-w-md">
      <h1 class="text-7xl font-extrabold text-purple-400 font-display">{{ error?.statusCode ?? 500 }}</h1>
      <p class="mt-4 text-xl text-white font-medium">
        {{ error?.statusCode === 404 ? 'Página no encontrada' : 'Algo salió mal' }}
      </p>
      <p class="mt-2 text-gray-400">
        {{ error?.statusCode === 404
          ? 'La página que buscas no existe o fue movida.'
          : 'Ocurrió un error inesperado. Intenta de nuevo más tarde.' }}
      </p>
      <div class="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <NuxtLink
          to="/"
          class="px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-500 text-white font-semibold transition"
        >
          Ir al inicio
        </NuxtLink>
        <NuxtLink
          to="/events"
          class="px-6 py-3 rounded-full border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold transition"
        >
          Ver eventos
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number; message: string } }>()

useSeoMeta({
	title: props.error?.statusCode === 404 ? "Página no encontrada — Fotify" : "Error — Fotify",
})
</script>
