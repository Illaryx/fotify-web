<template>
  <div class="min-h-screen bg-night">

    <!-- NAV -->
    <nav class="sticky top-0 z-50 h-14 flex items-center px-5 lg:px-12 border-b border-border" style="background:rgba(15,10,30,.95);backdrop-filter:blur(12px);">
      <NuxtLink to="/dashboard" class="flex items-center gap-2 text-white/60 hover:text-white mr-4 transition-colors">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        <span class="text-sm">Panel</span>
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
    </nav>

    <!-- PROGRESS -->
    <div class="px-5 lg:px-12 py-5 border-b border-border bg-night-2">
      <div class="max-w-3xl mx-auto flex items-center gap-0">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-violet flex items-center justify-center flex-shrink-0">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <span class="text-xs text-white font-medium hidden sm:block">Evento</span>
        </div>
        <div class="flex-1 h-px bg-violet/40 mx-2"></div>
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-violet/20 border-2 border-violet flex items-center justify-center text-xs font-semibold text-violet flex-shrink-0">2</div>
          <span class="text-xs text-violet font-semibold hidden sm:block">Subir fotos</span>
        </div>
        <div class="flex-1 h-px bg-border mx-2"></div>
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full border border-border flex items-center justify-center text-xs text-white/30 flex-shrink-0">3</div>
          <span class="text-xs text-white/30 hidden sm:block">Procesando IA</span>
        </div>
        <div class="flex-1 h-px bg-border mx-2"></div>
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full border border-border flex items-center justify-center text-xs text-white/30 flex-shrink-0">4</div>
          <span class="text-xs text-white/30 hidden sm:block">Publicado</span>
        </div>
      </div>
    </div>

    <!-- CONTENT -->
    <div class="px-5 lg:px-12 py-8">
      <div class="max-w-3xl mx-auto">

        <!-- Header -->
        <div class="mb-7">
          <h1 class="font-display text-2xl text-white mb-3">Subir fotos al evento</h1>
          <div v-if="selectedEvent" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-violet/15 flex items-center justify-center text-base flex-shrink-0">📷</div>
            <div class="min-w-0">
              <span class="text-sm text-white truncate">{{ selectedEvent.name }}</span>
              <span v-if="selectedEvent.event_date" class="text-xs text-white/40 ml-2">· {{ formatDate(selectedEvent.event_date) }}</span>
            </div>
            <select
              v-if="events.length > 1"
              v-model="selectedEventId"
              class="ml-auto text-xs text-white/50 bg-transparent border-none outline-none cursor-pointer hover:text-white"
            >
              <option v-for="ev in events" :key="ev.id" :value="ev.id">{{ ev.name }}</option>
            </select>
          </div>
          <div v-else-if="loadingEvents" class="flex items-center gap-2 text-sm text-white/40">
            <svg class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            Cargando eventos...
          </div>
          <div v-else class="bg-night-2 border border-border rounded-xl p-4 text-sm text-white/50">
            No tienes eventos activos.
            <NuxtLink to="/dashboard/events/new" class="text-violet hover:underline ml-1">Crear uno →</NuxtLink>
          </div>
        </div>

        <div class="flex flex-col lg:flex-row gap-6">

          <!-- LEFT -->
          <div class="flex-1 flex flex-col gap-5">

            <!-- Drop zone -->
            <div
              :class="['border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all', isDragging ? 'border-violet bg-violet/8' : 'border-border hover:border-violet/40']"
              @click="fileInputRef?.click()"
              @dragover.prevent="isDragging = true"
              @dragleave="isDragging = false"
              @drop.prevent="onDrop"
            >
              <div class="w-16 h-16 rounded-2xl bg-violet/15 flex items-center justify-center mx-auto mb-5">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M14 5V18M14 5L9 10M14 5L19 10" stroke="#7C3AED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5 22H23" stroke="#7C3AED" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <h3 class="text-base font-semibold text-white mb-2">Arrastra tus fotos aquí</h3>
              <p class="text-sm text-white/45 mb-4">o haz clic para seleccionar archivos</p>
              <div class="flex flex-wrap gap-2 justify-center text-xs text-white/30">
                <span class="bg-night-3 px-2 py-1 rounded-lg">JPG / JPEG</span>
                <span class="bg-night-3 px-2 py-1 rounded-lg">PNG</span>
                <span class="bg-night-3 px-2 py-1 rounded-lg">WEBP</span>
              </div>
              <p class="text-xs text-white/25 mt-3">Hasta 5,000 fotos · Máx 50 MB por archivo</p>
              <input
                ref="fileInputRef"
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                class="hidden"
                @change="onFileSelect"
              />
            </div>

            <!-- Upload queue -->
            <div v-if="queue.length > 0" class="bg-night-2 border border-border rounded-2xl p-5">
              <div class="flex items-center justify-between mb-4">
                <span class="text-sm font-medium text-white">Subida en progreso</span>
                <span class="text-xs text-white/40">{{ uploadedCount }} / {{ queue.length }} fotos</span>
              </div>

              <!-- Overall progress -->
              <div class="mb-5">
                <div class="flex justify-between mb-1.5">
                  <span class="text-xs text-white/50">Progreso total</span>
                  <span class="text-xs text-violet font-semibold">{{ overallPct }}%</span>
                </div>
                <div class="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500" style="background:linear-gradient(90deg,#7C3AED,#5B21B6)" :style="{ width: overallPct + '%' }"></div>
                </div>
              </div>

              <!-- Individual items (show first 5) -->
              <div class="flex flex-col gap-3 max-h-60 overflow-y-auto">
                <div v-for="item in queue.slice(0, 20)" :key="item.id" class="flex items-center gap-3 px-3 py-2.5 bg-night-3 rounded-xl">
                  <div :class="['w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', item.status === 'done' ? 'bg-green-400/15' : item.status === 'error' ? 'bg-red-400/15' : item.status === 'uploading' ? 'bg-violet/20' : 'bg-border']">
                    <svg v-if="item.status === 'done'" width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.5 6.5L5 9L10.5 3.5" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    <svg v-else-if="item.status === 'uploading'" class="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    <svg v-else-if="item.status === 'error'" width="13" height="13" viewBox="0 0 13 13" fill="none"><line x1="3" y1="3" x2="10" y2="10" stroke="#f87171" stroke-width="1.5" stroke-linecap="round"/><line x1="10" y1="3" x2="3" y2="10" stroke="#f87171" stroke-width="1.5" stroke-linecap="round"/></svg>
                    <svg v-else width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 2V8M4.5 6L6.5 8L8.5 6" stroke="rgba(255,255,255,.3)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs text-white/70 truncate mb-1.5">{{ item.file.name }}</div>
                    <div class="w-full h-1 bg-border rounded-full overflow-hidden">
                      <div
                        class="h-full rounded-full transition-all"
                        :style="{
                          width: item.progress + '%',
                          background: item.status === 'done' ? 'linear-gradient(90deg,#4ade80,#22c55e)' : 'linear-gradient(90deg,#7C3AED,#5B21B6)'
                        }"
                      ></div>
                    </div>
                  </div>
                  <span :class="['text-xs flex-shrink-0', item.status === 'done' ? 'text-green-400' : item.status === 'error' ? 'text-red-400' : 'text-white/40']">
                    {{ item.status === 'done' ? '✓' : item.status === 'error' ? '✗' : item.status === 'uploading' ? `${item.progress}%` : '—' }}
                  </span>
                </div>
                <div v-if="queue.length > 20" class="text-center text-xs text-white/30 py-2">
                  +{{ queue.length - 20 }} archivos más en cola
                </div>
              </div>
            </div>

            <!-- Tips -->
            <div class="bg-night-2 border border-border rounded-2xl p-5">
              <div class="text-xs text-white/40 uppercase tracking-widest mb-3">Consejos para mejor IA</div>
              <ul class="flex flex-col gap-2">
                <li v-for="tip in tips" :key="tip" class="flex items-start gap-2 text-sm text-white/60">
                  <span class="text-violet mt-0.5">✓</span>{{ tip }}
                </li>
              </ul>
            </div>
          </div>

          <!-- RIGHT -->
          <div class="w-full lg:w-72 flex-shrink-0 flex flex-col gap-5">

            <!-- Event summary -->
            <div v-if="selectedEvent" class="bg-night-2 border border-border rounded-2xl p-5">
              <div class="text-xs text-white/40 uppercase tracking-widest mb-4">Evento actual</div>
              <div class="flex items-center gap-3 mb-4">
                <div class="w-10 h-10 rounded-xl bg-violet/15 flex items-center justify-center text-xl">📷</div>
                <div class="min-w-0">
                  <div class="text-sm font-semibold text-white truncate">{{ selectedEvent.name }}</div>
                  <div class="text-xs text-white/40">{{ selectedEvent.event_date ? formatDate(selectedEvent.event_date) : '—' }}</div>
                </div>
              </div>
              <div class="flex flex-col gap-2 text-xs">
                <div class="flex justify-between">
                  <span class="text-white/50">Fotos subidas</span>
                  <span class="text-white">{{ uploadedCount }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-white/50">En cola</span>
                  <span class="text-white">{{ queue.length - uploadedCount }}</span>
                </div>
                <div class="w-full h-1.5 bg-border rounded-full overflow-hidden mt-1">
                  <div class="h-full rounded-full bg-violet transition-all" :style="{ width: (selectedEvent.total_photos ?? 0) / 50 + '%' }"></div>
                </div>
                <div class="text-white/30 text-right">{{ selectedEvent.total_photos ?? 0 }} / 5,000 del límite</div>
              </div>
            </div>

            <!-- Config toggles -->
            <div class="bg-night-2 border border-border rounded-2xl p-5">
              <div class="text-xs text-white/40 uppercase tracking-widest mb-4">Configuración</div>
              <div class="flex flex-col gap-4">
                <label v-for="t in uploadToggles" :key="t.key" class="flex items-start justify-between gap-3 cursor-pointer">
                  <div>
                    <div class="text-sm text-white mb-0.5">{{ t.label }}</div>
                    <div class="text-xs text-white/40">{{ t.hint }}</div>
                  </div>
                  <div class="relative flex-shrink-0 mt-0.5">
                    <input v-model="(uploadConfig as any)[t.key]" type="checkbox" class="sr-only peer" />
                    <div class="w-10 h-5 bg-border peer-checked:bg-violet rounded-full transition-colors cursor-pointer"></div>
                    <div class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5 pointer-events-none"></div>
                  </div>
                </label>
              </div>
            </div>

            <!-- CTAs -->
            <div class="flex flex-col gap-3">
              <button
                :disabled="!selectedEventId || isUploading || queue.length === 0"
                class="w-full bg-coral hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-full text-sm transition-opacity flex items-center justify-center gap-2"
                @click="publishEvent"
              >
                <svg v-if="publishing" class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                {{ publishing ? 'Publicando...' : 'Publicar evento ahora' }}
              </button>
              <button
                :disabled="!selectedEventId || isUploading"
                class="w-full border border-border text-white/60 hover:text-white hover:border-white/20 disabled:opacity-40 py-3 rounded-full text-sm transition-colors"
                @click="saveDraft"
              >
                Guardar borrador
              </button>
            </div>

            <!-- IA status (when uploading) -->
            <div v-if="queue.length > 0" class="bg-violet/10 border border-violet/25 rounded-2xl p-4">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-2 h-2 rounded-full bg-violet animate-pulse"></div>
                <span class="text-xs text-violet font-semibold">IA procesando</span>
              </div>
              <p class="text-xs text-white/50 leading-relaxed mb-3">El reconocimiento facial avanza en segundo plano. Puedes cerrar esta página. Te notificamos cuando termina.</p>
              <div class="flex justify-between text-xs mb-1">
                <span class="text-white/40">Fotos indexadas</span>
                <span class="text-white">{{ uploadedCount }} / {{ queue.length }}</span>
              </div>
              <div class="w-full h-1.5 bg-border rounded-full overflow-hidden">
                <div class="h-full rounded-full bg-violet transition-all" :style="{ width: overallPct + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SUCCESS OVERLAY -->
    <Transition name="fade">
      <div v-if="published" class="fixed inset-0 bg-night/95 backdrop-blur-md z-[300] flex items-center justify-center p-5">
        <div class="text-center max-w-sm mx-auto">
          <div class="w-24 h-24 rounded-full bg-green-400/15 border border-green-400/30 flex items-center justify-center mx-auto mb-6">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <path d="M8 18L14 24L28 10" stroke="#4ade80" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h2 class="font-display text-2xl text-white mb-3">¡Evento publicado!</h2>
          <p class="text-sm text-white/55 mb-2 leading-relaxed">La IA seguirá procesando las fotos en segundo plano.</p>
          <p class="text-sm text-white/55 mb-8 leading-relaxed">Los atletas ya pueden buscar sus fotos en <span class="text-violet">{{ selectedEvent?.name }}</span>.</p>
          <div class="flex flex-col gap-3">
            <NuxtLink
              v-if="selectedEvent?.slug"
              :to="`/events/${selectedEvent.slug}`"
              class="block bg-violet hover:bg-violet-deep text-white font-semibold py-3 rounded-full text-sm transition-colors"
            >
              Ver el evento publicado →
            </NuxtLink>
            <NuxtLink to="/dashboard" class="block border border-border text-white/60 hover:text-white py-3 rounded-full text-sm transition-colors">
              Volver al panel
            </NuxtLink>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import type { EventResponse, InitUploadInput, InitUploadResponse, SingleEnvelope, ListEnvelope } from '~/types'

definePageMeta({ ssr: false, middleware: 'photographer' })

const auth = useAuthStore()
const config = useRuntimeConfig()
const route = useRoute()

interface UploadItem {
  id: string
  file: File
  status: 'pending' | 'uploading' | 'done' | 'error'
  progress: number
  photoId?: number
}

const tips = [
  'Fotos con rostro visible (sin blur excesivo)',
  'Mínimo 800px de ancho para mejor reconocimiento',
  'Incluye fotos de adelante y de lado',
  'Los dorsales en la foto ayudan como respaldo',
]

const uploadToggles = [
  { key: 'publish_on_finish', label: 'Publicar al terminar', hint: 'Las fotos estarán disponibles inmediatamente' },
  { key: 'watermark', label: 'Marca de agua automática', hint: 'FOTIFY superpuesto en previews' },
  { key: 'notify', label: 'Notificar a seguidores', hint: 'Email a atletas que siguen tus eventos' },
]

const uploadConfig = reactive({ publish_on_finish: true, watermark: true, notify: false })

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const queue = ref<UploadItem[]>([])
const isUploading = ref(false)
const publishing = ref(false)
const published = ref(false)

const events = ref<EventResponse[]>([])
const loadingEvents = ref(false)
const selectedEventId = ref<number | null>(null)

const selectedEvent = computed(() => events.value.find(e => e.id === selectedEventId.value) ?? null)

const uploadedCount = computed(() => queue.value.filter(i => i.status === 'done').length)

const overallPct = computed(() => {
  if (!queue.value.length) return 0
  const total = queue.value.reduce((s, i) => s + i.progress, 0)
  return Math.round(total / queue.value.length)
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const files = Array.from(e.dataTransfer?.files ?? []).filter(f => f.type.startsWith('image/'))
  addToQueue(files)
}

function onFileSelect(e: Event) {
  const files = Array.from((e.target as HTMLInputElement).files ?? [])
  addToQueue(files)
  if (fileInputRef.value) fileInputRef.value.value = ''
}

function addToQueue(files: File[]) {
  for (const file of files) {
    if (file.size > 50 * 1024 * 1024) continue
    queue.value.push({ id: crypto.randomUUID(), file, status: 'pending', progress: 0 })
  }
  if (!isUploading.value) startUpload()
}

async function startUpload() {
  if (!selectedEventId.value) return
  isUploading.value = true

  for (const item of queue.value) {
    if (item.status !== 'pending') continue
    await uploadOne(item)
  }

  isUploading.value = false
}

async function uploadOne(item: UploadItem) {
  if (!selectedEventId.value) return
  item.status = 'uploading'
  item.progress = 5

  try {
    const contentType = item.file.type as 'image/jpeg' | 'image/png' | 'image/webp'
    const initRes = await $fetch<SingleEnvelope<InitUploadResponse>>(
      `${config.public.apiBase}/photos/upload/init`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.tokens.access}` },
        body: {
          event_id: selectedEventId.value,
          file_name: item.file.name,
          content_type: contentType,
        } as InitUploadInput,
      },
    )

    const { upload_url, photo_id } = initRes.data ?? {}
    if (!upload_url || !photo_id) throw new Error('No upload URL')
    item.photoId = photo_id
    item.progress = 20

    await $fetch(upload_url, {
      method: 'PUT',
      body: item.file,
      headers: { 'Content-Type': item.file.type },
    })
    item.progress = 80

    await $fetch(`${config.public.apiBase}/photos/upload/${photo_id}/confirm`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${auth.tokens.access}` },
    })

    item.progress = 100
    item.status = 'done'
  }
  catch {
    item.status = 'error'
    item.progress = 0
  }
}

async function publishEvent() {
  if (!selectedEventId.value) return
  publishing.value = true
  try {
    await $fetch(
      `${config.public.apiBase}/events/${selectedEventId.value}/publish`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.tokens.access}` },
      },
    )
    published.value = true
  }
  catch { /* silent */ }
  finally {
    publishing.value = false
  }
}

async function saveDraft() {
  await navigateTo('/dashboard')
}

onMounted(async () => {
  if (!auth.isAuthenticated) { await navigateTo('/dashboard'); return }
  loadingEvents.value = true
  try {
    const res = await $fetch<ListEnvelope<EventResponse>>(
      `${config.public.apiBase}/events`,
      { headers: { Authorization: `Bearer ${auth.tokens.access}` }, query: { my_events: true, limit: 50 } },
    )
    events.value = res.data?.items ?? []
  }
  finally {
    loadingEvents.value = false
  }

  const qid = route.query.event_id
  if (qid) {
    selectedEventId.value = Number(qid)
  }
  else if (events.value.length) {
    selectedEventId.value = events.value[0].id ?? null
  }
})
</script>
