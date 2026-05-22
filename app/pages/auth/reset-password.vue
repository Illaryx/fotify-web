<template>
  <div class="min-h-screen flex items-center justify-center px-5" style="background: radial-gradient(ellipse at top, #1A1030 0%, #0F0A1E 60%);">
    <div class="w-full max-w-md">

      <div class="text-center mb-8">
        <NuxtLink to="/" class="inline-block font-display text-2xl font-bold text-white mb-6">fotify</NuxtLink>
        <h1 class="text-xl font-semibold text-white mb-2">Nueva contraseña</h1>
        <p class="text-sm text-white/50">Elige una contraseña segura de al menos 8 caracteres.</p>
      </div>

      <div class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-8">

        <!-- Invalid / expired token -->
        <div v-if="tokenInvalid" class="text-center py-2">
          <div class="w-14 h-14 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </div>
          <p class="text-white font-medium mb-2">Enlace inválido o expirado</p>
          <p class="text-sm text-white/50 mb-6">El enlace de restablecimiento expiró o ya fue utilizado. Solicita uno nuevo.</p>
          <NuxtLink to="/auth/forgot-password" class="inline-block bg-violet hover:bg-violet-deep text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors">
            Solicitar nuevo enlace
          </NuxtLink>
        </div>

        <!-- Success -->
        <div v-else-if="success" class="text-center py-2">
          <div class="w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
          <p class="text-white font-medium mb-2">¡Contraseña actualizada!</p>
          <p class="text-sm text-white/50 mb-6">Ya puedes iniciar sesión con tu nueva contraseña.</p>
          <NuxtLink to="/" class="inline-block bg-violet hover:bg-violet-deep text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors">
            Ir al inicio
          </NuxtLink>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="submit">
          <div class="mb-4">
            <label class="block text-xs font-medium text-white/70 mb-1.5">Nueva contraseña</label>
            <input
              v-model="password"
              type="password"
              required
              minlength="8"
              placeholder="Mínimo 8 caracteres"
              class="w-full bg-[#0F0A1E] border border-[#2A1F4A] rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet/60"
            />
          </div>

          <div class="mb-5">
            <label class="block text-xs font-medium text-white/70 mb-1.5">Confirmar contraseña</label>
            <input
              v-model="confirm"
              type="password"
              required
              placeholder="Repite la contraseña"
              class="w-full bg-[#0F0A1E] border border-[#2A1F4A] rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-violet/60"
            />
          </div>

          <p v-if="errorMsg" class="text-xs text-red-400 mb-4">{{ errorMsg }}</p>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-violet hover:bg-violet-deep disabled:opacity-60 text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            <svg v-if="loading" class="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2A6 6 0 0 1 14 8" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            {{ loading ? 'Guardando...' : 'Guardar contraseña' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: false })

const route = useRoute()
const token = computed(() => route.query.token as string | undefined)

const password = ref('')
const confirm = ref('')
const loading = ref(false)
const success = ref(false)
const tokenInvalid = ref(false)
const errorMsg = ref('')

onMounted(() => {
  if (!token.value) tokenInvalid.value = true
})

async function submit() {
  errorMsg.value = ''
  if (password.value.length < 8) {
    errorMsg.value = 'La contraseña debe tener al menos 8 caracteres.'
    return
  }
  if (password.value !== confirm.value) {
    errorMsg.value = 'Las contraseñas no coinciden.'
    return
  }
  if (!token.value) {
    tokenInvalid.value = true
    return
  }

  loading.value = true
  try {
    await apiFetch('/auth/reset-password', {
      method: 'POST',
      body: { token: token.value, new_password: password.value },
    })
    success.value = true
  }
  catch (err: any) {
    const status = err?.status ?? err?.data?.status
    if (status === 400 || status === 401) {
      tokenInvalid.value = true
    }
    else {
      errorMsg.value = 'Error al guardar la contraseña. Intenta de nuevo.'
    }
  }
  finally {
    loading.value = false
  }
}
</script>
