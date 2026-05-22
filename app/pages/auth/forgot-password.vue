<template>
  <div class="min-h-screen flex items-center justify-center px-5" style="background: radial-gradient(ellipse at top, #1A1030 0%, #0F0A1E 60%);">
    <div class="w-full max-w-md">

      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block font-display text-2xl font-bold text-white mb-6">fotify</NuxtLink>
        <h1 class="text-xl font-semibold text-white mb-2">¿Olvidaste tu contraseña?</h1>
        <p class="text-sm text-white/50">Ingresa tu email y te enviaremos un enlace para restablecerla.</p>
      </div>

      <div class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-8">

        <!-- Success state -->
        <div v-if="sent" class="text-center py-2">
          <div class="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <p class="text-white font-medium mb-2">Revisa tu bandeja de entrada</p>
          <p class="text-sm text-white/50 mb-6">
            Si <span class="text-white">{{ email }}</span> tiene una cuenta, recibirás un enlace en los próximos minutos. Revisa también en spam.
          </p>
          <NuxtLink to="/" class="text-sm text-violet hover:underline">← Volver al inicio</NuxtLink>
        </div>

        <!-- Form state -->
        <form v-else @submit.prevent="submit">
          <label class="block text-xs font-medium text-white/70 mb-1.5">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="tucorreo@email.com"
            class="w-full bg-[#0F0A1E] border border-[#2A1F4A] rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet/60 mb-5"
          />

          <p v-if="errorMsg" class="text-xs text-red-400 mb-4">{{ errorMsg }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-violet hover:bg-violet-deep disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2A6 6 0 0 1 14 8" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            {{ loading ? 'Enviando...' : 'Enviar enlace' }}
          </button>

          <div class="text-center mt-5">
            <NuxtLink to="/" class="text-xs text-white/40 hover:text-white/70 transition-colors">← Volver al inicio</NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: false })

const email = ref('')
const loading = ref(false)
const sent = ref(false)
const errorMsg = ref('')

async function submit() {
  if (!email.value) return
  loading.value = true
  errorMsg.value = ''
  try {
    await apiFetch('/auth/forgot-password', {
      method: 'POST',
      body: { email: email.value },
    })
    sent.value = true
  }
  catch {
    // Always show success to prevent email enumeration
    sent.value = true
  }
  finally {
    loading.value = false
  }
}
</script>
