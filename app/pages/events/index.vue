<template>
  <div>
    <!-- Header -->
    <section class="px-5 lg:px-12 pt-12 pb-8">
      <div class="max-w-2xl">
        <h1 class="font-display font-bold text-[32px] md:text-[40px] tracking-tight text-white mb-2">
          Explorar eventos
        </h1>
        <p class="text-[15px] text-white/50">Miles de eventos en Perú y LATAM</p>
      </div>
    </section>

    <!-- Filters — sticky on desktop -->
    <div class="sticky top-16 z-30 bg-night/96 backdrop-blur-md border-b border-border">
      <div class="px-5 lg:px-12 py-4 space-y-3">
        <!-- Row 1: Search + City + Sort -->
        <div class="flex flex-col sm:flex-row gap-3">
          <!-- Search -->
          <div class="relative flex-1">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
              width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              v-model="query"
              type="text"
              placeholder="Buscar por nombre, ciudad o fotógrafo…"
              class="w-full bg-night-2 border border-border rounded-xl pl-9 pr-4 py-2.5 text-[14px] text-white placeholder:text-white/30 focus:outline-none focus:border-violet/50 transition-colors"
            />
          </div>

          <!-- City -->
          <select
            v-model="cityFilter"
            class="bg-night-2 border border-border rounded-xl px-4 py-2.5 text-[14px] text-white focus:outline-none focus:border-violet/50 transition-colors sm:min-w-[140px] appearance-none"
          >
            <option v-for="city in CITIES" :key="city" :value="city">{{ city }}</option>
          </select>

          <!-- Sort -->
          <select
            v-model="sortBy"
            class="bg-night-2 border border-border rounded-xl px-4 py-2.5 text-[14px] text-white focus:outline-none focus:border-violet/50 transition-colors sm:min-w-[160px] appearance-none"
          >
            <option v-for="opt in SORT_OPTIONS" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
        </div>

        <!-- Row 2: Category pills -->
        <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button
            v-for="cat in CATEGORIES"
            :key="cat"
            class="flex-shrink-0 text-[12px] font-medium px-3.5 py-1.5 rounded-full border transition-all duration-150"
            :class="categoryFilter === cat
              ? 'bg-violet border-violet text-white'
              : 'bg-transparent border-border text-white/50 hover:border-white/30 hover:text-white/70'"
            @click="categoryFilter = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <main class="px-5 lg:px-12 py-8">
      <!-- Counter row -->
      <div v-if="!loading && !error" class="flex items-center justify-between mb-6">
        <p class="text-[13px] text-white/40">
          <span class="text-white font-semibold">{{ displayedEvents.length }}</span>
          <template v-if="total > events.length"> de {{ total }}</template>
          eventos disponibles
        </p>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="n in 6" :key="n" class="bg-night-2 border border-border rounded-2xl overflow-hidden animate-pulse">
          <div class="aspect-video bg-night-3" />
          <div class="p-4 space-y-3">
            <div class="h-4 bg-night-3 rounded w-3/4" />
            <div class="h-3 bg-night-3 rounded w-1/2" />
            <div class="h-px bg-border mt-2" />
            <div class="flex justify-between items-center pt-2">
              <div class="h-4 bg-night-3 rounded w-1/3" />
              <div class="h-8 bg-night-3 rounded-lg w-20" />
            </div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="flex flex-col items-center py-24 text-center">
        <svg class="mb-4 text-white/20" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p class="text-white/50 text-[15px] mb-6">{{ error }}</p>
        <button
          class="bg-violet text-white font-semibold px-6 py-3 rounded-xl hover:bg-violet-deep transition-colors text-[14px]"
          @click="fetchEvents"
        >
          Reintentar
        </button>
      </div>

      <!-- Empty state -->
      <div v-else-if="displayedEvents.length === 0" class="flex flex-col items-center py-24 text-center">
        <svg class="mb-4 text-white/20" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        <p class="text-white/50 text-[15px] mb-6">No encontramos eventos con ese filtro</p>
        <button
          class="bg-night-2 border border-border text-white font-semibold px-6 py-3 rounded-xl hover:border-white/30 transition-colors text-[14px]"
          @click="clearFilters"
        >
          Limpiar filtros
        </button>
      </div>

      <!-- Events grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <EventCard v-for="event in displayedEvents" :key="event.id" :event="event" />
      </div>

      <!-- Load more -->
      <div v-if="!loading && !error && hasMore && displayedEvents.length > 0" class="mt-10 flex justify-center">
        <button
          class="bg-night-2 border border-border text-white font-semibold px-8 py-3 rounded-xl hover:border-violet/40 hover:bg-violet/5 transition-all text-[14px] disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="loadingMore"
          @click="loadMore"
        >
          <span v-if="loadingMore" class="flex items-center gap-2">
            <svg class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            Cargando…
          </span>
          <span v-else>Cargar más eventos</span>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { EventResponse, ListEnvelope } from '~/types'

useSeoMeta({
  title: 'Explorar eventos — Fotify',
  description: 'Descubre miles de eventos deportivos en Perú y LATAM. Maratones, triatlones, ciclismo y más.',
})

const config = useRuntimeConfig()

const LIMIT = 24
const CATEGORIES = ['Todos', 'Maratón', 'Triatlón', 'Ciclismo', 'Trail', 'Natación', 'Crossfit', 'Otro']
const CITIES = ['Todas', 'Lima', 'Arequipa', 'Cusco']
const SORT_OPTIONS = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'photos', label: 'Más fotos' },
  { value: 'upcoming', label: 'Próximos' },
]

// Filter state
const query = ref('')
const debouncedQuery = ref('')
const cityFilter = ref('Todas')
const categoryFilter = ref('Todos')
const sortBy = ref('newest')

// Data state
const events = ref<EventResponse[]>([])
const total = ref(0)
const loading = ref(false)
const loadingMore = ref(false)
const error = ref<string | null>(null)
const page = ref(1)

// Initial fetch — server: true enables SSR for prerender, lazy on client avoids blocking render
const { data: initialData, error: initialError, pending: initialPending } = await useFetch<ListEnvelope<EventResponse>>(
  `${config.public.apiBase}/events`,
  { query: { status: 'active', limit: LIMIT, page: 1 }, server: true, lazy: true },
)

loading.value = initialPending.value

watch(initialPending, (pending) => {
  loading.value = pending
  if (!pending) {
    if (initialError.value) {
      error.value = 'No se pudo cargar los eventos. Inténtalo de nuevo.'
    } else {
      events.value = initialData.value?.data?.items ?? []
      total.value = initialData.value?.data?.total ?? 0
    }
  }
}, { immediate: true })

// Debounce search
let debounceTimer: ReturnType<typeof setTimeout>
watch(query, (val) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => { debouncedQuery.value = val }, 300)
})

// Re-fetch when API-level filters change
watch([debouncedQuery, cityFilter, sortBy], () => { fetchEvents() })

// Client-side category filter (API has no sport field)
const displayedEvents = computed(() => {
  if (categoryFilter.value === 'Todos') return events.value
  const cat = categoryFilter.value.toLowerCase()
  return events.value.filter(e => e.name?.toLowerCase().includes(cat))
})

const hasMore = computed(() => events.value.length < total.value)

function buildQuery(p: number): Record<string, string | number> {
  const q: Record<string, string | number> = { status: 'active', limit: LIMIT, page: p }
  if (debouncedQuery.value) q.search = debouncedQuery.value
  if (cityFilter.value !== 'Todas') q.location = cityFilter.value
  return q
}

async function fetchEvents() {
  loading.value = true
  error.value = null
  page.value = 1
  try {
    const data = await $fetch<ListEnvelope<EventResponse>>(`${config.public.apiBase}/events`, {
      query: buildQuery(1),
    })
    events.value = data?.data?.items ?? []
    total.value = data?.data?.total ?? 0
  }
  catch {
    error.value = 'No se pudo cargar los eventos. Inténtalo de nuevo.'
  }
  finally {
    loading.value = false
  }
}

async function loadMore() {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  try {
    const nextPage = page.value + 1
    const data = await $fetch<ListEnvelope<EventResponse>>(`${config.public.apiBase}/events`, {
      query: buildQuery(nextPage),
    })
    events.value.push(...(data?.data?.items ?? []))
    page.value = nextPage
  }
  catch {
    // silent — user can retry via load more button
  }
  finally {
    loadingMore.value = false
  }
}

function clearFilters() {
  query.value = ''
  debouncedQuery.value = ''
  cityFilter.value = 'Todas'
  categoryFilter.value = 'Todos'
  sortBy.value = 'newest'
}
</script>

<style scoped>
.scrollbar-hide {
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
