<template>
  <div class="min-h-screen" style="background: radial-gradient(ellipse at top, #1A1030 0%, #0F0A1E 60%);">

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-40">
      <svg class="animate-spin text-violet/40" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
    </div>

    <!-- Error / not found -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-40 px-5 text-center">
      <div class="text-white/30 text-5xl mb-4">✕</div>
      <p class="text-white/50 text-sm mb-6">{{ error }}</p>
      <NuxtLink to="/purchases" class="text-violet hover:underline text-sm">← Mis compras</NuxtLink>
    </div>

    <template v-else-if="order">

      <!-- SUCCESS HERO -->
      <section class="pt-14 pb-10 px-5 text-center">
        <div class="bounce-in w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center relative"
          style="background: radial-gradient(circle,rgba(74,222,128,.2) 0%,rgba(74,222,128,.05) 100%); border: 2px solid rgba(74,222,128,.4);">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path d="M8 20L16 28L32 12" stroke="#4ade80" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="absolute inset-0 rounded-full" style="border: 2px solid rgba(74,222,128,.15); transform: scale(1.25)"></div>
        </div>

        <div class="fade-up fade-up-1">
          <h1 class="font-display text-2xl lg:text-3xl text-white mb-2">¡Pago exitoso!</h1>
          <p class="text-white/55 text-sm lg:text-base">
            Tus <strong class="text-white">{{ order.item_count }} foto{{ order.item_count !== 1 ? 's' : '' }}</strong>
            {{ eventName ? `de ${eventName}` : '' }} están listas para descargar.
          </p>
        </div>

        <!-- Order meta -->
        <div class="fade-up fade-up-2 flex items-center justify-center gap-4 mt-4 text-xs text-white/35 flex-wrap">
          <span>Orden #FT-{{ String(order.id).padStart(5, '0') }}</span>
          <span>·</span>
          <span>{{ order.item_count }} foto{{ order.item_count !== 1 ? 's' : '' }} · S/ {{ order.subtotal?.toFixed(2) }}</span>
          <span>·</span>
          <span>{{ order.paid_at ? formatDate(order.paid_at) : formatDate(order.created_at!) }}</span>
        </div>

        <!-- Download all CTA -->
        <div class="fade-up fade-up-3 mt-8" v-if="photoIds.length > 0">
          <button
            :disabled="downloadingAll"
            @click="downloadAll"
            class="bg-coral hover:opacity-90 disabled:opacity-50 text-white font-semibold px-10 py-4 rounded-full text-base transition-opacity inline-flex items-center gap-3"
          >
            <svg v-if="!downloadingAll" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 3V12M9 12L5.5 8.5M9 12L12.5 8.5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3 15H15" stroke="white" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
            <svg v-else class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            {{ downloadingAll ? 'Preparando descargas…' : `Descargar mis ${order.item_count} fotos` }}
          </button>
          <p class="text-xs text-white/30 mt-3">Alta resolución · Sin marca de agua · Acceso permanente</p>
        </div>

        <!-- No photo IDs available (access from other device) -->
        <div v-else class="fade-up fade-up-3 mt-6">
          <p class="text-sm text-white/40">Revisa el correo de confirmación para los links de descarga.</p>
        </div>
      </section>

      <!-- PHOTO GRID -->
      <section class="px-5 lg:px-12 pb-10">
        <div class="max-w-3xl mx-auto">
          <div class="text-xs text-white/35 uppercase tracking-widest mb-4 text-center">Tus fotos</div>

          <!-- Grid placeholders -->
          <div class="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
            <div
              v-for="(photoId, idx) in gridItems"
              :key="photoId ?? idx"
              class="photo-card aspect-square group cursor-pointer"
              :style="cardGradient(idx)"
              @click="photoId ? triggerSingleDownload(photoId) : undefined"
            >
              <div v-if="photoId" class="absolute inset-0 flex items-center justify-center">
                <div v-if="downloadingPhoto.has(photoId)" class="w-10 h-10 flex items-center justify-center">
                  <svg class="animate-spin text-white/60" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                </div>
                <div v-else class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M9 3V12M9 12L5.5 8.5M9 12L12.5 8.5" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 15H15" stroke="white" stroke-width="1.6" stroke-linecap="round"/>
                  </svg>
                </div>
              </div>
              <div class="absolute top-2 left-2 bg-black/50 rounded-full px-2 py-0.5 text-xs text-white/70">#{{ idx + 1 }}</div>
            </div>
          </div>

          <!-- Individual download list -->
          <div v-if="photoIds.length > 0" class="text-center mb-8">
            <button class="text-sm text-violet hover:underline" @click="showIndividual = !showIndividual">
              {{ showIndividual ? 'Ocultar descarga individual' : 'Descargar fotos por separado' }}
            </button>
          </div>

          <Transition name="slide-down">
            <div v-if="showIndividual && photoIds.length > 0" class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-5 mb-8">
              <div class="text-xs text-white/40 uppercase tracking-widest mb-4">Descarga individual</div>
              <div class="flex flex-col gap-2">
                <div v-for="(photoId, idx) in photoIds" :key="photoId" class="flex items-center gap-3 py-2">
                  <div class="w-10 h-10 rounded-lg flex-shrink-0" :style="cardGradient(idx)"></div>
                  <div class="flex-1 text-sm text-white/80">Foto #{{ idx + 1 }}</div>
                  <button
                    :disabled="downloadingPhoto.has(photoId)"
                    class="text-xs text-violet hover:underline disabled:opacity-40 flex items-center gap-1"
                    @click="triggerSingleDownload(photoId)"
                  >
                    <svg v-if="downloadingPhoto.has(photoId)" class="animate-spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    <span v-else>↓</span>
                    Descargar
                  </button>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Trust badges -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <div class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-4 flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2L17 5V9C17 13.5 14 17 10 18C6 17 3 13.5 3 9V5L10 2Z" stroke="#4ade80" stroke-width="1.4" stroke-linejoin="round"/>
                <path d="M7 10L9 12L13 8" stroke="#4ade80" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div>
                <div class="text-xs font-medium text-white">Acceso permanente</div>
                <div class="text-xs text-white/40">Descarga cuando quieras</div>
              </div>
            </div>
            <div class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-4 flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="6" width="16" height="12" rx="2" stroke="#7C3AED" stroke-width="1.4"/>
                <path d="M6 6V4C6 2.9 7.3 2 10 2C12.7 2 14 2.9 14 4V6" stroke="#7C3AED" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              <div>
                <div class="text-xs font-medium text-white">Alta resolución</div>
                <div class="text-xs text-white/40">Sin marca de agua</div>
              </div>
            </div>
            <div class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-4 flex items-center gap-3">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C6.7 2 4 4.7 4 8V10L3 11V13H17V11L16 10V8C16 4.7 13.3 2 10 2Z" stroke="#facc15" stroke-width="1.4" stroke-linejoin="round"/>
                <path d="M8 13V14C8 15.1 8.9 16 10 16C11.1 16 12 15.1 12 14V13" stroke="#facc15" stroke-width="1.4" stroke-linecap="round"/>
              </svg>
              <div>
                <div class="text-xs font-medium text-white">Garantía 7 días</div>
                <div class="text-xs text-white/40">Si algo falla, te devolvemos</div>
              </div>
            </div>
          </div>

          <!-- Email confirmation -->
          <div v-if="userEmail" class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-5 mb-8 flex items-start gap-4">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" class="flex-shrink-0 mt-0.5">
              <rect x="2" y="5" width="18" height="13" rx="2" stroke="#7C3AED" stroke-width="1.5"/>
              <path d="M2 8L11 13L20 8" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <div class="flex-1">
              <div class="text-sm font-medium text-white mb-1">Recibo enviado por email</div>
              <p class="text-xs text-white/50">
                Enviamos el comprobante y los links de descarga a <span class="text-white">{{ userEmail }}</span>. Revisa spam si no ves el email.
              </p>
            </div>
          </div>

          <!-- Next actions -->
          <div class="text-center mb-6">
            <div class="text-xs text-white/35 uppercase tracking-widest mb-4">¿Qué más te gustaría?</div>
            <div class="flex flex-wrap justify-center gap-3">
              <NuxtLink
                to="/events"
                class="flex items-center gap-2 border border-[#2A1F4A] hover:border-violet/40 text-white/70 hover:text-white text-sm px-5 py-2.5 rounded-full transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L13 4V8C13 11 10 13 7 13C4 13 1 11 1 8V4L7 1Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>
                </svg>
                Ver más eventos
              </NuxtLink>
              <NuxtLink
                to="/purchases"
                class="flex items-center gap-2 border border-[#2A1F4A] hover:border-violet/40 text-white/70 hover:text-white text-sm px-5 py-2.5 rounded-full transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" stroke-width="1.3"/>
                  <path d="M5 7L6.5 8.5L9 6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                Mis compras
              </NuxtLink>
            </div>
          </div>

          <!-- Upsell: more photos from event -->
          <div v-if="order.event_id" class="bg-gradient-to-r from-violet/10 to-transparent border border-violet/25 rounded-2xl p-5">
            <div class="flex items-start justify-between gap-4">
              <div>
                <div class="text-xs text-violet font-semibold uppercase tracking-widest mb-2">¿Quieres más fotos?</div>
                <p class="text-sm text-white/70 mb-3">
                  Puede que haya más fotos tuyas en {{ eventName ?? 'este evento' }} sin descargar.
                </p>
                <NuxtLink
                  v-if="eventSlug"
                  :to="`/search?event_slug=${eventSlug}`"
                  class="text-sm font-semibold text-violet hover:underline"
                >
                  Buscar más fotos →
                </NuxtLink>
              </div>
              <div class="flex -space-x-2 flex-shrink-0">
                <div class="w-10 h-10 rounded-lg border-2 border-[#0F0A1E]" style="background: linear-gradient(135deg,rgba(124,58,237,.4),rgba(91,33,182,.2))"></div>
                <div class="w-10 h-10 rounded-lg border-2 border-[#0F0A1E]" style="background: linear-gradient(135deg,rgba(91,33,182,.3),rgba(124,58,237,.3))"></div>
                <div class="w-10 h-10 rounded-lg bg-[#2A1F4A] border-2 border-[#0F0A1E] flex items-center justify-center text-xs text-white/60">+</div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </template>

  </div>
</template>

<script setup lang="ts">
import type { OrderResponse, EventResponse, DownloadResponse, SingleEnvelope } from '~/types'

definePageMeta({ ssr: false, middleware: 'auth' })

const route = useRoute()
const config = useRuntimeConfig()
const auth = useAuthStore()

const orderId = computed(() => Number(route.params.orderId))

const loading = ref(true)
const error = ref<string | null>(null)
const order = ref<OrderResponse | null>(null)
const event = ref<EventResponse | null>(null)
const photoIds = ref<number[]>([])
const userEmail = ref('')
const showIndividual = ref(false)
const downloadingAll = ref(false)
const downloadingPhoto = ref(new Set<number>())

const eventName = computed(() => event.value?.name ?? null)
const eventSlug = computed(() => event.value?.slug ?? null)

const gridItems = computed<(number | null)[]>(() => {
  const count = order.value?.item_count ?? 0
  const ids = photoIds.value
  if (ids.length > 0) return ids.slice(0, count)
  return Array.from({ length: Math.min(count, 10) }, () => null)
})

const gradients = [
  'background: linear-gradient(135deg,rgba(124,58,237,.3),rgba(91,33,182,.2))',
  'background: linear-gradient(135deg,rgba(124,58,237,.2),rgba(91,33,182,.3))',
  'background: linear-gradient(135deg,rgba(91,33,182,.4),rgba(124,58,237,.15))',
  'background: linear-gradient(135deg,rgba(124,58,237,.35),rgba(91,33,182,.2))',
  'background: linear-gradient(135deg,rgba(91,33,182,.25),rgba(124,58,237,.4))',
]

function cardGradient(idx: number): string {
  return gradients[idx % gradients.length]
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function loadStoredPhotoIds(oid: number): number[] {
  try {
    const raw = localStorage.getItem(`fotify_order_photos_${oid}`)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as number[]) : []
  } catch {
    return []
  }
}

async function fetchDownloadUrl(photoId: number): Promise<string | null> {
  try {
    const res = await $fetch<SingleEnvelope<DownloadResponse>>(
      `${config.public.apiBase}/photos/${photoId}/download`,
      { headers: { Authorization: `Bearer ${auth.tokens.access}` } },
    )
    return res.data?.download_url ?? null
  } catch {
    return null
  }
}

function triggerBrowserDownload(url: string, filename: string) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.target = '_blank'
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

async function triggerSingleDownload(photoId: number) {
  if (downloadingPhoto.value.has(photoId)) return
  downloadingPhoto.value = new Set([...downloadingPhoto.value, photoId])
  try {
    const url = await fetchDownloadUrl(photoId)
    if (url) triggerBrowserDownload(url, `fotify-photo-${photoId}.jpg`)
  } finally {
    const next = new Set(downloadingPhoto.value)
    next.delete(photoId)
    downloadingPhoto.value = next
  }
}

async function downloadAll() {
  if (downloadingAll.value || photoIds.value.length === 0) return
  downloadingAll.value = true
  try {
    const urls = await Promise.allSettled(photoIds.value.map(id => fetchDownloadUrl(id)))
    urls.forEach((result, idx) => {
      if (result.status === 'fulfilled' && result.value) {
        setTimeout(() => {
          triggerBrowserDownload(result.value!, `fotify-photo-${photoIds.value[idx]}.jpg`)
        }, idx * 300)
      }
    })
  } finally {
    setTimeout(() => { downloadingAll.value = false }, photoIds.value.length * 300 + 500)
  }
}

onMounted(async () => {
  if (!auth.isAuthenticated) {
    await navigateTo('/')
    return
  }

  const oid = orderId.value
  if (!oid || isNaN(oid)) {
    error.value = 'Orden no encontrada.'
    loading.value = false
    return
  }

  photoIds.value = loadStoredPhotoIds(oid)

  try {
    const [orderRes, meRes] = await Promise.allSettled([
      $fetch<SingleEnvelope<OrderResponse>>(
        `${config.public.apiBase}/orders/${oid}`,
        { headers: { Authorization: `Bearer ${auth.tokens.access}` } },
      ),
      $fetch<{ data?: { email?: string } }>(
        `${config.public.apiBase}/auth/me`,
        { headers: { Authorization: `Bearer ${auth.tokens.access}` } },
      ),
    ])

    if (orderRes.status === 'fulfilled') {
      const o = orderRes.value.data
      if (!o) { error.value = 'Orden no encontrada.'; loading.value = false; return }
      order.value = o

      if (o.event_id) {
        try {
          const evRes = await $fetch<SingleEnvelope<EventResponse>>(
            `${config.public.apiBase}/events/${o.event_id}`,
            { headers: { Authorization: `Bearer ${auth.tokens.access}` } },
          )
          event.value = evRes.data ?? null
        } catch { /* non-critical */ }
      }
    } else {
      const fetchErr = orderRes.reason as any
      if (fetchErr?.status === 403 || fetchErr?.status === 404) {
        error.value = 'No tienes acceso a esta orden o no existe.'
      } else {
        error.value = 'Error al cargar la orden. Intenta de nuevo.'
      }
      loading.value = false
      return
    }

    if (meRes.status === 'fulfilled') {
      userEmail.value = meRes.value.data?.email ?? ''
    }
  } catch {
    error.value = 'Error al cargar la orden. Intenta de nuevo.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.photo-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
}

.bounce-in {
  animation: bounce-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes bounce-in {
  0%   { transform: scale(0.5); opacity: 0; }
  70%  { transform: scale(1.05); }
  100% { transform: scale(1); opacity: 1; }
}

.fade-up { animation: fade-up 0.4s ease both; }
.fade-up-1 { animation-delay: 0.15s; }
.fade-up-2 { animation-delay: 0.3s; }
.fade-up-3 { animation-delay: 0.45s; }

@keyframes fade-up {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}
.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}
.slide-down-enter-to, .slide-down-leave-from {
  opacity: 1;
  max-height: 600px;
}
</style>
