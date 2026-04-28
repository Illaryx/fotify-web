<template>
  <div class="min-h-[70vh]">

    <!-- ── LOADING ──────────────────────────────────────────────────────────── -->
    <div v-if="loading" class="flex items-center justify-center py-32">
      <svg class="animate-spin text-violet/40" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
    </div>

    <template v-else>
      <!-- ── PAGE HEADER ──────────────────────────────────────────────────── -->
      <section class="px-5 md:px-10 lg:px-12 py-8">
        <div class="max-w-3xl mx-auto">

          <div class="flex items-start justify-between mb-6">
            <div>
              <h1 class="font-display font-bold text-[24px] text-white mb-1 tracking-tight">Mis compras</h1>
              <p class="text-[14px] text-white/50">
                <span v-if="userName">Hola {{ firstName }} — </span>aquí están todas tus fotos compradas en Fotify
              </p>
            </div>
            <div v-if="userName" class="hidden lg:flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white" style="background: linear-gradient(135deg, #7C3AED, #FF3D6B)">
                {{ userInitials }}
              </div>
              <div>
                <div class="text-[14px] font-medium text-white">{{ userName }}</div>
                <div class="text-[12px] text-white/40">{{ userEmail }}</div>
              </div>
            </div>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-4 mb-8">
            <div class="bg-night-2 border border-border rounded-2xl p-4 text-center">
              <div class="font-display font-bold text-[22px] text-white mb-1">{{ total }}</div>
              <div class="text-[11px] text-white/45">Compras</div>
            </div>
            <div class="bg-night-2 border border-border rounded-2xl p-4 text-center">
              <div class="font-display font-bold text-[22px] text-violet mb-1">{{ totalPhotos }}</div>
              <div class="text-[11px] text-white/45">Fotos descargadas</div>
            </div>
            <div class="bg-night-2 border border-border rounded-2xl p-4 text-center">
              <div class="font-display font-bold text-[22px] text-white mb-1">S/ {{ totalSpent.toFixed(0) }}</div>
              <div class="text-[11px] text-white/45">Total gastado</div>
            </div>
          </div>

          <!-- Filter tabs -->
          <div class="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
            <button
              :class="['text-[12px] font-medium px-4 py-1.5 rounded-full whitespace-nowrap transition-colors', activeFilter === 'all' ? 'bg-violet text-white' : 'text-white/60 hover:text-white border border-border']"
              @click="activeFilter = 'all'"
            >
              Todas ({{ total }})
            </button>
            <button
              :class="['text-[12px] font-medium px-4 py-1.5 rounded-full whitespace-nowrap transition-colors', activeFilter === 'paid' ? 'bg-violet text-white' : 'text-white/60 hover:text-white border border-border']"
              @click="activeFilter = 'paid'"
            >
              Disponibles ({{ paidCount }})
            </button>
          </div>

          <!-- Error -->
          <div v-if="fetchError" class="text-[13px] text-coral text-center py-8">{{ fetchError }}</div>

          <!-- ── Empty state ──────────────────────────────────────────────── -->
          <div v-else-if="filteredOrders.length === 0" class="text-center py-16">
            <div class="w-16 h-16 rounded-2xl bg-violet/10 border border-violet/20 flex items-center justify-center mx-auto mb-4">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="rgba(124,58,237,0.6)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <div class="text-[16px] font-semibold text-white mb-2">
              {{ activeFilter === 'paid' ? 'No hay compras disponibles' : 'Aún no tienes compras' }}
            </div>
            <p class="text-[13px] text-white/40 mb-6 max-w-xs mx-auto leading-relaxed">
              {{ activeFilter === 'paid' ? 'Todas tus órdenes están pendientes o canceladas.' : 'Encuentra tus fotos en eventos deportivos y sociales.' }}
            </p>
            <NuxtLink to="/events" class="inline-flex items-center gap-2 bg-violet hover:bg-violet-deep text-white font-semibold text-[14px] px-6 py-3 rounded-full transition-colors">
              Explorar eventos →
            </NuxtLink>
          </div>

          <!-- ── Order list ───────────────────────────────────────────────── -->
          <div v-else class="flex flex-col gap-4">
            <div
              v-for="order in filteredOrders"
              :key="order.id"
              :ref="(el) => { if (el) observeCard(el as HTMLElement, order.event_id!) }"
              class="bg-night-2 border border-border rounded-2xl overflow-hidden"
            >
              <!-- Card header -->
              <div class="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
                <div class="min-w-0">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="text-[14px] font-medium text-white truncate">
                      {{ eventsMap[order.event_id!]?.name ?? `Evento #${order.event_id}` }}
                    </span>
                    <span v-if="isNew(order.created_at)" class="bg-green-400/15 text-green-400 text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                      Nuevo
                    </span>
                    <span v-if="order.status === 'pending'" class="bg-yellow-400/15 text-yellow-400 text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                      Pendiente
                    </span>
                    <span v-if="order.status === 'cancelled'" class="bg-white/5 text-white/30 text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                      Cancelado
                    </span>
                    <span v-if="order.status === 'refunded'" class="bg-coral/15 text-coral text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                      Reembolsado
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-[11px] text-white/40 flex-wrap">
                    <span>Orden {{ formatOrderId(order.id!) }}</span>
                    <span v-if="order.created_at">· {{ formatDate(order.created_at) }}</span>
                    <span v-if="order.subtotal">· S/ {{ order.subtotal.toFixed(2) }}</span>
                  </div>
                </div>
                <NuxtLink
                  v-if="order.status === 'paid'"
                  :to="`/downloads/${order.id}`"
                  class="flex items-center gap-1.5 bg-coral hover:opacity-90 text-white text-[12px] font-semibold px-4 py-2 rounded-full transition-opacity flex-shrink-0"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M6 2V8M6 8L3.5 5.5M6 8L8.5 5.5" stroke="white" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M2 10H10" stroke="white" stroke-width="1.3" stroke-linecap="round"/>
                  </svg>
                  Descargar ({{ order.item_count ?? 0 }})
                </NuxtLink>
                <button
                  v-else-if="order.status === 'pending'"
                  class="flex items-center gap-1.5 border border-border text-white/30 text-[12px] font-semibold px-4 py-2 rounded-full flex-shrink-0 cursor-not-allowed"
                  disabled
                >
                  Pendiente de pago
                </button>
              </div>

              <!-- Card body: thumbnails -->
              <div class="px-5 py-4">
                <div class="flex gap-2 mb-3">
                  <div
                    v-for="i in Math.min(4, order.item_count ?? 0)"
                    :key="i"
                    class="w-[52px] h-[52px] rounded-[10px] flex-shrink-0"
                    :style="`background: linear-gradient(135deg, rgba(124,58,237,${0.2 + (i % 3) * 0.1}), rgba(91,33,182,${0.15 + (i % 2) * 0.2}))`"
                  ></div>
                  <div
                    v-if="(order.item_count ?? 0) > 4"
                    class="w-[52px] h-[52px] rounded-[10px] bg-night border border-border flex items-center justify-center flex-shrink-0"
                  >
                    <span class="text-[12px] font-bold text-white/40">+{{ (order.item_count ?? 0) - 4 }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between text-[11px] text-white/40">
                  <span>{{ order.item_count ?? 0 }} foto{{ (order.item_count ?? 0) !== 1 ? 's' : '' }}</span>
                  <NuxtLink
                    v-if="eventsMap[order.event_id!]?.slug"
                    :to="`/events/${eventsMap[order.event_id!].slug}`"
                    class="text-violet hover:underline"
                  >
                    Ver evento
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Infinite scroll sentinel -->
            <div ref="sentinel" class="h-px" />

            <!-- Loading more spinner -->
            <div v-if="loadingMore" class="flex justify-center py-4">
              <svg class="animate-spin text-violet/40" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
            </div>
          </div>

          <!-- Explore more CTA -->
          <div v-if="filteredOrders.length > 0 && !hasMore" class="mt-8 text-center">
            <div class="text-[12px] text-white/30 mb-4">¿Corres más eventos? Busca tus fotos con IA</div>
            <NuxtLink to="/events" class="inline-flex items-center gap-2 bg-violet hover:bg-violet-deep text-white font-semibold text-[14px] px-6 py-3 rounded-full transition-colors">
              Explorar más eventos →
            </NuxtLink>
          </div>

        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { OrderResponse, EventResponse, SingleEnvelope } from '~/types'

definePageMeta({ ssr: false, middleware: 'auth' })

useSeoMeta({ title: 'Mis compras — Fotify' })

const auth = useAuthStore()
const showAuth = useAuthModal()

const LIMIT = 25

const loading = ref(true)
const loadingMore = ref(false)
const fetchError = ref<string | null>(null)
const orders = ref<OrderResponse[]>([])
const total = ref(0)
const eventsMap = ref<Record<number, EventResponse>>({})

const userName = ref('')
const userEmail = ref('')

type Filter = 'all' | 'paid'
const activeFilter = ref<Filter>('all')

// Infinite scroll sentinel
const sentinel = ref<HTMLElement | null>(null)

// Per-card lazy event fetch observer
let cardObserver: IntersectionObserver | null = null

// Computed
const firstName = computed(() => userName.value.split(' ')[0])
const userInitials = computed(() =>
  userName.value.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
)
const filteredOrders = computed(() =>
  activeFilter.value === 'paid'
    ? orders.value.filter(o => o.status === 'paid')
    : orders.value,
)
const hasMore = computed(() => orders.value.length < total.value)
const paidCount = computed(() => orders.value.filter(o => o.status === 'paid').length)
const totalPhotos = computed(() =>
  orders.value.filter(o => o.status === 'paid').reduce((acc, o) => acc + (o.item_count ?? 0), 0),
)
const totalSpent = computed(() =>
  orders.value.filter(o => o.status === 'paid').reduce((acc, o) => acc + (o.subtotal ?? 0), 0),
)

onMounted(async () => {
  if (!auth.isAuthenticated) {
    showAuth.value = true
    loading.value = false
    return
  }
  setupCardObserver()
  await Promise.all([fetchOrders(), fetchUserInfo()])
  loading.value = false
})

onUnmounted(() => {
  cardObserver?.disconnect()
})

// Infinite scroll via VueUse
useIntersectionObserver(sentinel, ([{ isIntersecting }]) => {
  if (isIntersecting && hasMore.value && !loadingMore.value) {
    loadMoreOrders()
  }
})

// ── Per-card lazy event fetch ─────────────────────────────────────────────────
function setupCardObserver() {
  cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const eventId = Number((entry.target as HTMLElement).dataset.eventId)
        cardObserver?.unobserve(entry.target)
        if (eventId && !eventsMap.value[eventId]) {
          fetchEventById(eventId)
        }
      })
    },
    { rootMargin: '100px' },
  )
}

function observeCard(el: HTMLElement, eventId: number) {
  if (!cardObserver || !eventId) return
  if (eventsMap.value[eventId]) return // already fetched
  el.dataset.eventId = String(eventId)
  cardObserver.observe(el)
}

async function fetchEventById(id: number) {
  try {
    const res = await apiFetch<SingleEnvelope<EventResponse>>(`/events/${id}`)
    if (res.data) eventsMap.value = { ...eventsMap.value, [id]: res.data }
  }
  catch { /* optional context, fail silently */ }
}

// ── Orders fetch / pagination ─────────────────────────────────────────────────
async function fetchOrders() {
  fetchError.value = null
  try {
    const res = await apiFetch<{ data?: { items?: OrderResponse[]; total?: number } }>(
      '/orders',
      { query: { limit: LIMIT, offset: 0 } },
    )
    orders.value = res.data?.items ?? []
    total.value = res.data?.total ?? 0
  }
  catch {
    fetchError.value = 'Error al cargar tus compras. Intenta de nuevo.'
  }
}

async function loadMoreOrders() {
  if (!hasMore.value || loadingMore.value) return
  loadingMore.value = true
  try {
    const res = await apiFetch<{ data?: { items?: OrderResponse[]; total?: number } }>(
      '/orders',
      { query: { limit: LIMIT, offset: orders.value.length } },
    )
    orders.value = [...orders.value, ...(res.data?.items ?? [])]
    total.value = res.data?.total ?? total.value
  }
  catch { /* ignore load-more errors */ }
  finally {
    loadingMore.value = false
  }
}

async function fetchUserInfo() {
  try {
    const res = await apiFetch<{ data?: { email?: string; full_name?: string } }>('/auth/me')
    userEmail.value = res.data?.email ?? ''
    userName.value = res.data?.full_name ?? ''
  }
  catch { /* not critical */ }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatOrderId(id: number): string {
  return `#FT-${String(id).padStart(5, '0')}`
}

function isNew(createdAt?: string): boolean {
  if (!createdAt) return false
  return Date.now() - new Date(createdAt).getTime() < 7 * 24 * 60 * 60 * 1000
}
</script>
