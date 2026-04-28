<template>
  <div class="min-h-screen bg-night">

    <!-- NAV -->
    <nav class="sticky top-0 z-50 h-14 flex items-center px-5 lg:px-12 border-b border-border" style="background:rgba(15,10,30,.95);backdrop-filter:blur(12px);">
      <NuxtLink to="/dashboard" class="flex items-center gap-2 text-white/50 hover:text-white mr-4 transition-colors text-sm">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        Panel
      </NuxtLink>
      <div class="h-4 w-px bg-border mr-4"></div>
      <NuxtLink to="/" class="flex items-center gap-2">
        <svg width="24" height="24" viewBox="0 0 44 44" fill="none">
          <ellipse cx="22" cy="22" rx="22" ry="22" fill="#7C3AED"/>
          <path d="M14 22 C14 14 20 8 28 12 C32 14 32 20 28 24 C24 28 18 26 14 22Z" fill="white" opacity="0.95"/>
          <circle cx="22" cy="22" r="4.5" fill="#7C3AED"/>
          <circle cx="22" cy="22" r="2" fill="white" opacity="0.6"/>
        </svg>
        <span class="font-display text-sm text-white">Fotify</span>
      </NuxtLink>
      <div class="ml-auto">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold" style="background:linear-gradient(135deg,#7C3AED,#FF3D6B)">
          {{ avatarInitials }}
        </div>
      </div>
    </nav>

    <!-- PROGRESS -->
    <div class="px-5 lg:px-12 py-4 border-b border-border bg-night-2">
      <div class="max-w-3xl mx-auto flex items-center gap-3">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-violet flex items-center justify-center text-xs font-semibold text-white">1</div>
          <span class="text-sm font-medium text-white hidden sm:block">Datos del evento</span>
        </div>
        <div class="flex-1 h-px bg-border"></div>
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full border border-border flex items-center justify-center text-xs text-white/30">2</div>
          <span class="text-sm text-white/30 hidden sm:block">Subir fotos</span>
        </div>
        <div class="flex-1 h-px bg-border"></div>
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full border border-border flex items-center justify-center text-xs text-white/30">3</div>
          <span class="text-sm text-white/30 hidden sm:block">Publicado</span>
        </div>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="px-5 lg:px-12 py-8">
      <div class="max-w-3xl mx-auto">
        <div class="mb-6">
          <h1 class="font-display text-xl text-white mb-1">Crear nuevo evento</h1>
          <p class="text-sm text-white/45">Configura los datos del evento. Después podrás subir las fotos.</p>
        </div>

        <div class="flex flex-col lg:flex-row gap-6">

          <!-- LEFT: form -->
          <div class="flex-1 flex flex-col gap-5">

            <!-- Información básica -->
            <div class="bg-night-2 border border-border rounded-2xl p-6">
              <h2 class="text-sm font-semibold text-white mb-5">Información básica</h2>
              <div class="flex flex-col gap-4">
                <div>
                  <label class="text-xs text-white/45 block mb-1.5">Nombre del evento *</label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="Ej: Maratón Lima 42K 2025"
                    class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors"
                  />
                </div>
                <div>
                  <label class="text-xs text-white/45 block mb-1.5">Descripción corta</label>
                  <textarea
                    v-model="form.description"
                    rows="2"
                    placeholder="Ej: La maratón más importante de Lima, edición primavera"
                    class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            <!-- Tipo de evento -->
            <div class="bg-night-2 border border-border rounded-2xl p-6">
              <h2 class="text-sm font-semibold text-white mb-4">Tipo de evento *</h2>
              <div class="grid grid-cols-5 gap-2">
                <button
                  v-for="sport in sports"
                  :key="sport.label"
                  :class="[
                    'flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border transition-all',
                    selectedSport.label === sport.label
                      ? 'border-violet bg-violet/10'
                      : 'border-border hover:border-violet/40',
                  ]"
                  @click="selectedSport = sport"
                >
                  <span class="text-xl">{{ sport.icon }}</span>
                  <span :class="['text-[10px] text-center font-medium', selectedSport.label === sport.label ? 'text-violet' : 'text-white/50']">{{ sport.label }}</span>
                </button>
              </div>
            </div>

            <!-- Fecha y lugar -->
            <div class="bg-night-2 border border-border rounded-2xl p-6">
              <h2 class="text-sm font-semibold text-white mb-4">Fecha y lugar</h2>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label class="text-xs text-white/45 block mb-1.5">Fecha del evento *</label>
                  <input
                    v-model="form.event_date"
                    type="date"
                    class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet/60 transition-colors"
                    style="color-scheme:dark"
                  />
                </div>
                <div>
                  <label class="text-xs text-white/45 block mb-1.5">Ciudad *</label>
                  <select
                    v-model="form.city"
                    class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet/60 transition-colors"
                  >
                    <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>
                <div class="lg:col-span-2">
                  <label class="text-xs text-white/45 block mb-1.5">Ubicación específica</label>
                  <input
                    v-model="form.location"
                    type="text"
                    placeholder="Ej: Parque Kennedy, Miraflores"
                    class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors"
                  />
                </div>
              </div>
            </div>

            <!-- Dorsales -->
            <div class="bg-night-2 border border-border rounded-2xl p-6">
              <h2 class="text-sm font-semibold text-white mb-1">Búsqueda por dorsal <span class="text-white/30 font-normal">(opcional)</span></h2>
              <p class="text-xs text-white/40 mb-4 leading-relaxed">Si el evento tiene dorsales, los atletas podrán buscar sus fotos por número como alternativa a la IA facial.</p>
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <label class="text-xs text-white/45 block mb-1.5">Dorsal mínimo</label>
                  <input v-model="form.bib_min" type="number" placeholder="1" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors" />
                </div>
                <div>
                  <label class="text-xs text-white/45 block mb-1.5">Dorsal máximo</label>
                  <input v-model="form.bib_max" type="number" placeholder="5000" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors" />
                </div>
                <div>
                  <label class="text-xs text-white/45 block mb-1.5">Distancia (km)</label>
                  <input v-model="form.distance" type="text" placeholder="42, 21, 10..." class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors" />
                </div>
              </div>
            </div>

            <!-- Configuración -->
            <div class="bg-night-2 border border-border rounded-2xl p-6">
              <h2 class="text-sm font-semibold text-white mb-4">Configuración</h2>
              <div class="flex flex-col gap-4">
                <label v-for="toggle in toggles" :key="toggle.key" class="flex items-start justify-between gap-3 cursor-pointer">
                  <div>
                    <div class="text-sm text-white">{{ toggle.label }}</div>
                    <div class="text-xs text-white/40 mt-0.5">{{ toggle.hint }}</div>
                  </div>
                  <div class="relative flex-shrink-0 mt-0.5">
                    <input v-model="(form as any)[toggle.key]" type="checkbox" class="sr-only peer" />
                    <div class="w-10 h-5 bg-border peer-checked:bg-violet rounded-full transition-colors"></div>
                    <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 pointer-events-none"></div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Error -->
            <p v-if="formError" class="text-sm text-coral text-center">{{ formError }}</p>

            <!-- Actions -->
            <div class="flex gap-3 pb-8">
              <button
                :disabled="savingDraft"
                class="flex-1 border border-border text-white/60 hover:text-white hover:border-white/20 py-3.5 rounded-full text-sm transition-colors disabled:opacity-50"
                @click="createEvent(true)"
              >
                {{ savingDraft ? 'Guardando...' : 'Guardar borrador' }}
              </button>
              <button
                :disabled="saving"
                class="flex-1 bg-coral hover:opacity-90 text-white font-semibold py-3.5 rounded-full text-sm transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
                @click="createEvent(false)"
              >
                <svg v-if="saving" class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                {{ saving ? 'Creando...' : 'Crear y subir fotos →' }}
              </button>
            </div>
          </div>

          <!-- RIGHT: preview + pricing -->
          <div class="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-20 lg:self-start">

            <!-- Live preview card -->
            <div class="bg-night-2 border border-border rounded-2xl overflow-hidden mb-3">
              <div class="h-28 relative flex items-center justify-center" style="background:linear-gradient(135deg,rgba(124,58,237,.35),rgba(91,33,182,.2));">
                <span class="text-5xl">{{ selectedSport.icon }}</span>
                <div class="absolute top-3 left-3 bg-green-400/20 text-green-400 text-[10px] font-semibold px-2.5 py-1 rounded-full">Fotos listas</div>
              </div>
              <div class="p-4">
                <div class="text-[10px] text-violet font-semibold uppercase tracking-widest mb-1">{{ selectedSport.label }} · {{ form.city }}</div>
                <h3 class="text-sm font-semibold text-white mb-1 truncate">{{ form.name || 'Nombre del evento' }}</h3>
                <div class="text-xs text-white/40 mb-2">{{ previewDate }}</div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-white/40">@fotógrafo</span>
                  <span class="font-semibold text-white">Desde S/ {{ form.photo_price }}</span>
                </div>
              </div>
            </div>
            <p class="text-xs text-white/25 text-center mb-4">Vista previa del evento</p>

            <!-- Pricing reminder -->
            <div class="bg-night-2 border border-border rounded-2xl p-4">
              <div class="text-[10px] text-white/40 uppercase tracking-widest mb-3">Precios estándar</div>
              <div class="flex flex-col gap-1.5 text-xs">
                <div class="flex justify-between"><span class="text-white/50">1 foto</span><span class="text-white">S/ 15</span></div>
                <div class="flex justify-between"><span class="text-white/50">Pack 3</span><span class="text-white">S/ 38</span></div>
                <div class="flex justify-between"><span class="text-white/50">Pack 5</span><span class="text-white">S/ 59</span></div>
                <div class="flex justify-between"><span class="text-white/50">Pack 10</span><span class="text-white">S/ 99</span></div>
                <div class="flex justify-between"><span class="text-white/50">Todas</span><span class="text-white">S/ 129</span></div>
              </div>
              <p class="mt-3 text-[10px] text-white/25 leading-relaxed">Precios optimizados para máxima conversión. Editables en plan Pro.</p>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { CreateEventInput, EventResponse, PhotographerResponse, SingleEnvelope } from '~/types'

definePageMeta({ ssr: false, middleware: 'photographer' })

const auth = useAuthStore()
const config = useRuntimeConfig()

const sports = [
  { icon: '🏃', label: 'Running' },
  { icon: '🏊', label: 'Triatlón' },
  { icon: '🚴', label: 'Ciclismo' },
  { icon: '🏔️', label: 'Trail' },
  { icon: '🏋️', label: 'Crossfit' },
  { icon: '🏊', label: 'Natación' },
  { icon: '⚽', label: 'Fútbol' },
  { icon: '🎓', label: 'Graduación' },
  { icon: '🎉', label: 'Social' },
  { icon: '📸', label: 'Otro' },
]

const cities = ['Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Ica', 'Piura', 'Otra']

const toggles = [
  { key: 'publish_on_upload', label: 'Publicar automáticamente al subir fotos', hint: 'Las fotos estarán disponibles de inmediato' },
  { key: 'public_search', label: 'Permitir búsqueda pública', hint: 'El evento aparece en Explorar eventos' },
  { key: 'watermark', label: 'Marca de agua en previews', hint: 'Protege tus fotos antes del pago' },
]

const selectedSport = ref(sports[0])
const formError = ref<string | null>(null)
const saving = ref(false)
const savingDraft = ref(false)
const profile = ref<PhotographerResponse | null>(null)

const form = reactive({
  name: '',
  description: '',
  event_date: '',
  city: 'Lima',
  location: '',
  bib_min: '',
  bib_max: '',
  distance: '',
  photo_price: 15,
  pack_size: 3,
  pack_price: 38,
  publish_on_upload: true,
  public_search: true,
  watermark: true,
})

const avatarInitials = computed(() => {
  const name = profile.value?.display_name ?? ''
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'FT'
})

const previewDate = computed(() => {
  if (!form.event_date) return 'Fecha por definir'
  return new Date(form.event_date + 'T00:00:00').toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })
})

function generateSlug(name: string): string {
  const base = name.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .substring(0, 40)
  return `${base}-${Math.random().toString(36).slice(2, 6)}`
}

async function createEvent(isDraft: boolean) {
  if (!form.name.trim()) { formError.value = 'El nombre del evento es requerido.'; return }
  if (!form.event_date) { formError.value = 'La fecha del evento es requerida.'; return }
  formError.value = null

  if (isDraft) savingDraft.value = true
  else saving.value = true

  try {
    const body: CreateEventInput = {
      name: form.name.trim(),
      description: form.description || undefined,
      event_date: form.event_date,
      location: [form.location, form.city].filter(Boolean).join(', ') || undefined,
      slug: generateSlug(form.name),
      photo_price: form.photo_price,
      pack_size: form.pack_size || undefined,
      pack_price: form.pack_price || undefined,
      currency: 'PEN',
    }

    const res = await $fetch<SingleEnvelope<EventResponse>>(
      `${config.public.apiBase}/events`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.tokens.access}` },
        body,
      },
    )

    const eventId = res.data?.id
    if (!eventId) throw new Error('No se recibió el ID del evento.')

    await navigateTo(isDraft ? '/dashboard' : `/dashboard/upload?event_id=${eventId}`)
  }
  catch (err: any) {
    formError.value = err?.data?.error || err?.message || 'Error al crear el evento. Intenta de nuevo.'
  }
  finally {
    saving.value = false
    savingDraft.value = false
  }
}

onMounted(async () => {
  if (!auth.isAuthenticated) { await navigateTo('/dashboard'); return }
  try {
    const res = await $fetch<SingleEnvelope<PhotographerResponse>>(
      `${config.public.apiBase}/photographers/me`,
      { headers: { Authorization: `Bearer ${auth.tokens.access}` } },
    )
    profile.value = res.data ?? null
  }
  catch { /* optional */ }
})
</script>
