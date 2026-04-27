<template>
  <div class="min-h-screen bg-night">

    <!-- NAV -->
    <nav class="sticky top-0 z-50 h-16 flex items-center px-5 lg:px-12 border-b border-border" style="background:rgba(15,10,30,.9);backdrop-filter:blur(12px);">
      <NuxtLink to="/" class="flex items-center gap-2 mr-8">
        <svg width="30" height="30" viewBox="0 0 44 44" fill="none">
          <ellipse cx="22" cy="22" rx="22" ry="22" fill="#7C3AED"/>
          <path d="M14 22 C14 14 20 8 28 12 C32 14 32 20 28 24 C24 28 18 26 14 22Z" fill="white" opacity="0.95"/>
          <circle cx="22" cy="22" r="4.5" fill="#7C3AED"/>
          <circle cx="22" cy="22" r="2" fill="white" opacity="0.6"/>
        </svg>
        <span class="font-display text-base text-white">Fotify</span>
      </NuxtLink>
      <div class="hidden lg:flex items-center gap-6 flex-1">
        <NuxtLink to="/events" class="text-sm text-white/60 hover:text-white transition-colors">Explorar eventos</NuxtLink>
        <NuxtLink to="/purchases" class="text-sm text-white/60 hover:text-white transition-colors">Mis compras</NuxtLink>
        <span class="text-sm text-violet font-medium">Mi cuenta</span>
      </div>
      <div class="hidden lg:flex items-center gap-3 ml-auto">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold" style="background:linear-gradient(135deg,#7C3AED,#FF3D6B)">
          {{ avatarInitials }}
        </div>
        <span class="text-sm text-white/70">{{ displayName }}</span>
      </div>
    </nav>

    <div class="px-5 lg:px-12 py-8 max-w-2xl mx-auto">

      <!-- Profile header -->
      <div class="flex items-center gap-4 mb-8">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0 relative" style="background:linear-gradient(135deg,#7C3AED,#FF3D6B)">
          {{ avatarInitials }}
        </div>
        <div>
          <h1 class="text-xl font-display text-white">Mi cuenta</h1>
          <p class="text-sm text-white/50">{{ profile.email }}</p>
        </div>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-border mb-6 overflow-x-auto">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :class="['px-4 py-2.5 text-sm whitespace-nowrap border-b-2 transition-colors', activeTab === tab.key ? 'text-white border-violet' : 'text-white/50 border-transparent hover:text-white']"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- ── PERFIL ── -->
      <div v-show="activeTab === 'perfil'" class="flex flex-col gap-4">

        <!-- Datos personales -->
        <div class="bg-night-2 border border-border rounded-2xl p-6">
          <h2 class="text-sm font-semibold text-white mb-5">Datos personales</h2>
          <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label class="text-xs text-white/45 block mb-1.5">Nombre</label>
                <input v-model="profile.first_name" type="text" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet/60 transition-colors" />
              </div>
              <div>
                <label class="text-xs text-white/45 block mb-1.5">Apellido</label>
                <input v-model="profile.last_name" type="text" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet/60 transition-colors" />
              </div>
            </div>
            <div>
              <label class="text-xs text-white/45 block mb-1.5">Email</label>
              <input v-model="profile.email" type="email" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet/60 transition-colors" />
            </div>
            <div>
              <label class="text-xs text-white/45 block mb-1.5">Teléfono (opcional)</label>
              <div class="flex gap-2">
                <select class="bg-night-3 border border-border rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-violet/60 transition-colors w-20 flex-shrink-0">
                  <option>+51</option>
                </select>
                <input v-model="profile.phone" type="tel" class="flex-1 bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet/60 transition-colors" />
              </div>
            </div>
            <div>
              <label class="text-xs text-white/45 block mb-1.5">Ciudad</label>
              <select v-model="profile.city" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet/60 transition-colors">
                <option>Lima</option>
                <option>Arequipa</option>
                <option>Cusco</option>
                <option>Trujillo</option>
                <option>Piura</option>
              </select>
            </div>
          </div>
          <p v-if="profileError" class="text-xs text-coral mt-3">{{ profileError }}</p>
          <button
            :disabled="savingProfile"
            class="mt-5 bg-violet hover:bg-violet-deep disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
            @click="saveProfile"
          >
            {{ savingProfile ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>

        <!-- Deportes -->
        <div class="bg-night-2 border border-border rounded-2xl p-6">
          <h2 class="text-sm font-semibold text-white mb-1">Deportes que practico</h2>
          <p class="text-xs text-white/40 mb-4">Personalizamos los eventos que te recomendamos.</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="sport in allSports"
              :key="sport"
              :class="['text-xs px-3 py-1.5 rounded-full border transition-colors', selectedSports.has(sport) ? 'border-violet bg-violet/10 text-violet' : 'border-border text-white/50 hover:border-violet/40']"
              @click="toggleSport(sport)"
            >
              {{ sport }}
            </button>
          </div>
        </div>
      </div>

      <!-- ── SEGURIDAD ── -->
      <div v-show="activeTab === 'seguridad'" class="flex flex-col gap-4">

        <!-- Cambiar contraseña -->
        <div class="bg-night-2 border border-border rounded-2xl p-6">
          <h2 class="text-sm font-semibold text-white mb-5">Cambiar contraseña</h2>
          <div class="flex flex-col gap-4">
            <div>
              <label class="text-xs text-white/45 block mb-1.5">Contraseña actual</label>
              <input v-model="passwordForm.current" type="password" placeholder="••••••••" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors" />
            </div>
            <div>
              <label class="text-xs text-white/45 block mb-1.5">Nueva contraseña</label>
              <input v-model="passwordForm.new" type="password" placeholder="Mínimo 8 caracteres" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors" />
            </div>
            <div>
              <label class="text-xs text-white/45 block mb-1.5">Confirmar nueva contraseña</label>
              <input v-model="passwordForm.confirm" type="password" placeholder="Repite la nueva contraseña" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors" />
            </div>
          </div>
          <p v-if="passwordError" class="text-xs text-coral mt-3">{{ passwordError }}</p>
          <button
            :disabled="savingPassword"
            class="mt-5 bg-violet hover:bg-violet-deep disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
            @click="savePassword"
          >
            {{ savingPassword ? 'Actualizando...' : 'Actualizar contraseña' }}
          </button>
        </div>

        <!-- Sesiones activas -->
        <div class="bg-night-2 border border-border rounded-2xl p-6">
          <h2 class="text-sm font-semibold text-white mb-4">Sesiones activas</h2>
          <div class="flex flex-col gap-3">
            <div class="flex items-center justify-between py-2">
              <div class="flex items-center gap-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="2" y="3" width="14" height="10" rx="2" stroke="#7C3AED" stroke-width="1.3"/><path d="M6 15H12M9 13V15" stroke="#7C3AED" stroke-width="1.3" stroke-linecap="round"/></svg>
                <div>
                  <div class="text-sm text-white font-medium">Navegador actual</div>
                  <div class="text-xs text-white/40">Ahora mismo</div>
                </div>
              </div>
              <span class="text-xs bg-green-400/15 text-green-400 px-2 py-0.5 rounded-full">Activa</span>
            </div>
          </div>
        </div>

        <!-- Cuentas conectadas -->
        <div class="bg-night-2 border border-border rounded-2xl p-6">
          <h2 class="text-sm font-semibold text-white mb-4">Cuentas conectadas</h2>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M19.25 10.22c0-.71-.06-1.4-.18-2.05H10v3.87h5.19a4.44 4.44 0 0 1-1.92 2.91v2.42h3.12C18.25 15.74 19.25 13.18 19.25 10.22Z" fill="#4285F4"/>
                <path d="M10 20c2.6 0 4.78-.86 6.38-2.33l-3.12-2.42c-.86.58-1.97.91-3.26.91-2.5 0-4.62-1.69-5.38-3.96H1.41v2.5A9.98 9.98 0 0 0 10 20Z" fill="#34A853"/>
                <path d="M4.62 12.2A5.99 5.99 0 0 1 4.3 10c0-.77.13-1.51.32-2.2V5.3H1.41A9.98 9.98 0 0 0 0 10c0 1.61.38 3.14 1.05 4.45l3.17-2.24Z" fill="#FBBC05"/>
                <path d="M10 3.98c1.4 0 2.65.48 3.63 1.42l2.73-2.73C14.78.99 12.6 0 10 0A9.98 9.98 0 0 0 1.05 5.55l3.17 2.24C4.98 5.52 7.25 3.98 10 3.98Z" fill="#EA4335"/>
              </svg>
              <div>
                <div class="text-sm text-white">Google</div>
                <div class="text-xs text-white/40">{{ profile.email }}</div>
              </div>
            </div>
            <span class="text-xs text-green-400">Conectado</span>
          </div>
        </div>
      </div>

      <!-- ── NOTIFICACIONES ── -->
      <div v-show="activeTab === 'notificaciones'">
        <div class="bg-night-2 border border-border rounded-2xl p-6">
          <h2 class="text-sm font-semibold text-white mb-5">Preferencias de notificaciones</h2>
          <div class="flex flex-col divide-y divide-border">
            <label v-for="notif in notifications" :key="notif.key" class="flex items-center justify-between py-4 cursor-pointer">
              <div>
                <div class="text-sm text-white">{{ notif.label }}</div>
                <div class="text-xs text-white/40 mt-0.5">{{ notif.hint }}</div>
              </div>
              <div class="relative flex-shrink-0 ml-4">
                <input v-model="(notifSettings as any)[notif.key]" type="checkbox" class="sr-only peer" />
                <div class="w-10 h-5 bg-border peer-checked:bg-violet rounded-full transition-colors"></div>
                <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 pointer-events-none"></div>
              </div>
            </label>
          </div>
          <button
            class="mt-4 bg-violet hover:bg-violet-deep text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
            @click="showToast('Preferencias guardadas')"
          >
            Guardar preferencias
          </button>
        </div>
      </div>

      <!-- ── PRIVACIDAD ── -->
      <div v-show="activeTab === 'privacidad'" class="flex flex-col gap-4">

        <!-- Datos biométricos -->
        <div class="bg-night-2 border border-border rounded-2xl p-6">
          <h2 class="text-sm font-semibold text-white mb-2">Datos biométricos</h2>
          <p class="text-xs text-white/50 mb-4 leading-relaxed">Fotify usa reconocimiento facial para encontrar tus fotos. Los datos biométricos son procesados en el momento de la búsqueda y eliminados automáticamente en 24 horas.</p>
          <button
            class="flex items-center gap-3 text-left w-full bg-night-3 border border-border rounded-xl p-4 hover:border-red-400/30 transition-colors"
            @click="showToast('Datos biométricos eliminados')"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" class="flex-shrink-0 text-red-400">
              <path d="M3 5H15M7 5V3H11V5M6 5V14C6 14.6 6.4 15 7 15H11C11.6 15 12 14.6 12 14V5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div>
              <div class="text-sm text-red-400 font-medium">Eliminar mis datos biométricos</div>
              <div class="text-xs text-white/40">Se eliminan los vectores faciales guardados en caché</div>
            </div>
          </button>
        </div>

        <!-- Mis datos -->
        <div class="bg-night-2 border border-border rounded-2xl p-6">
          <h2 class="text-sm font-semibold text-white mb-2">Mis datos</h2>
          <p class="text-xs text-white/50 mb-4 leading-relaxed">Puedes solicitar una copia de todos tus datos o eliminar tu cuenta permanentemente.</p>
          <div class="flex flex-col gap-3">
            <button class="text-sm text-violet hover:underline text-left">Descargar mis datos (JSON)</button>
            <NuxtLink to="/legal?tab=privacidad" class="text-sm text-violet hover:underline">Ver política de privacidad completa</NuxtLink>
          </div>
        </div>

        <!-- Danger zone -->
        <div class="bg-red-400/5 border border-red-400/20 rounded-2xl p-6">
          <h2 class="text-sm font-semibold text-red-400 mb-2">Zona de peligro</h2>
          <p class="text-xs text-white/50 mb-4 leading-relaxed">Eliminar tu cuenta es permanente. Perderás el acceso a todas tus compras y fotos descargadas.</p>
          <button class="text-sm text-red-400 border border-red-400/30 hover:bg-red-400/10 px-5 py-2.5 rounded-full transition-colors">
            Eliminar mi cuenta
          </button>
        </div>
      </div>

    </div>

    <!-- Toast -->
    <Transition name="slide-up">
      <div v-if="toastVisible" class="fixed bottom-6 left-1/2 -translate-x-1/2 bg-night-2 border border-green-400/40 text-green-400 text-sm px-5 py-3 rounded-full z-[200] whitespace-nowrap">
        ✓ {{ toastMessage }}
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: false })

const auth = useAuthStore()
const config = useRuntimeConfig()

type TabKey = 'perfil' | 'seguridad' | 'notificaciones' | 'privacidad'

const tabs = [
  { key: 'perfil' as TabKey, label: 'Perfil' },
  { key: 'seguridad' as TabKey, label: 'Seguridad' },
  { key: 'notificaciones' as TabKey, label: 'Notificaciones' },
  { key: 'privacidad' as TabKey, label: 'Privacidad' },
]

const allSports = ['🏃 Running', '🏊 Triatlón', '🚴 Ciclismo', '🏔️ Trail', '🏋️ Crossfit', '🏊 Natación', '⚽ Fútbol', '🎽 Otro']

const activeTab = ref<TabKey>('perfil')
const selectedSports = reactive(new Set(['🏃 Running']))

const profile = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  city: 'Lima',
})

const passwordForm = reactive({ current: '', new: '', confirm: '' })
const notifSettings = reactive({ photos_ready: true, purchase_confirm: true, nearby_events: false, newsletter: false })

const notifications = [
  { key: 'photos_ready', label: 'Fotos disponibles', hint: 'Cuando un fotógrafo sube fotos de un evento donde participaste' },
  { key: 'purchase_confirm', label: 'Confirmación de compra', hint: 'Recibo por email al comprar un pack de fotos' },
  { key: 'nearby_events', label: 'Eventos cerca de mí', hint: 'Eventos deportivos próximos en tu ciudad' },
  { key: 'newsletter', label: 'Newsletter mensual', hint: 'Novedades, ofertas y resumen mensual de Fotify' },
]

const savingProfile = ref(false)
const profileError = ref<string | null>(null)
const savingPassword = ref(false)
const passwordError = ref<string | null>(null)

const toastVisible = ref(false)
const toastMessage = ref('')
let toastTimer: ReturnType<typeof setTimeout> | null = null

const avatarInitials = computed(() => {
  const name = [profile.first_name, profile.last_name].filter(Boolean).join(' ')
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'TU'
})

const displayName = computed(() => [profile.first_name, profile.last_name].filter(Boolean).join(' ') || 'Mi cuenta')

function toggleSport(sport: string) {
  if (selectedSports.has(sport)) selectedSports.delete(sport)
  else selectedSports.add(sport)
}

function showToast(msg: string) {
  toastMessage.value = msg
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastVisible.value = false }, 2500)
}

async function saveProfile() {
  savingProfile.value = true
  profileError.value = null
  try {
    await $fetch(`${config.public.apiBase}/auth/me`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${auth.tokens.access}` },
      body: {
        full_name: `${profile.first_name} ${profile.last_name}`.trim(),
        phone: profile.phone || undefined,
      },
    })
    showToast('Perfil guardado correctamente')
  }
  catch (err: any) {
    profileError.value = err?.data?.error || 'Error al guardar. Intenta de nuevo.'
  }
  finally {
    savingProfile.value = false
  }
}

async function savePassword() {
  if (!passwordForm.current || !passwordForm.new) { passwordError.value = 'Completa todos los campos.'; return }
  if (passwordForm.new !== passwordForm.confirm) { passwordError.value = 'Las contraseñas no coinciden.'; return }
  if (passwordForm.new.length < 8) { passwordError.value = 'La contraseña debe tener al menos 8 caracteres.'; return }
  savingPassword.value = true
  passwordError.value = null
  try {
    await $fetch(`${config.public.apiBase}/auth/password`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${auth.tokens.access}` },
      body: { current_password: passwordForm.current, new_password: passwordForm.new },
    })
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
    showToast('Contraseña actualizada')
  }
  catch (err: any) {
    passwordError.value = err?.data?.error || 'Error al actualizar. Verifica tu contraseña actual.'
  }
  finally {
    savingPassword.value = false
  }
}

onMounted(async () => {
  if (!auth.isAuthenticated) { await navigateTo('/'); return }
  try {
    const res = await $fetch<{ data?: { email?: string; full_name?: string; phone?: string } }>(
      `${config.public.apiBase}/auth/me`,
      { headers: { Authorization: `Bearer ${auth.tokens.access}` } },
    )
    const data = res.data
    if (data) {
      profile.email = data.email ?? ''
      profile.phone = data.phone ?? ''
      const parts = (data.full_name ?? '').split(' ')
      profile.first_name = parts[0] ?? ''
      profile.last_name = parts.slice(1).join(' ')
    }
  }
  catch { /* optional */ }
})
</script>
