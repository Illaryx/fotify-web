<template>
  <div>
    <!-- Not found -->
    <div v-if="!event" class="flex flex-col items-center justify-center py-32 px-5 text-center">
      <div class="font-display font-bold text-[28px] text-white mb-3">Evento no encontrado</div>
      <p class="text-muted mb-6">El evento que buscas no existe o fue removido.</p>
      <NuxtLink to="/events" class="bg-violet text-white font-semibold px-6 py-3 rounded-xl hover:bg-violet-deep transition-colors">
        Ver todos los eventos
      </NuxtLink>
    </div>

    <template v-else>
      <!-- Closed banner -->
      <div v-if="event.status === 'closed'" class="bg-white/[0.03] border-b border-border px-5 lg:px-12 py-3">
        <div class="flex items-center gap-2 text-[13px] text-white/40">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Este evento está cerrado. La galería es de solo visualización.
        </div>
      </div>

      <!-- Breadcrumb -->
      <nav class="px-5 lg:px-12 pt-5">
        <div class="flex items-center gap-2 text-[12px] text-white/25">
          <NuxtLink to="/" class="hover:text-white/50 transition-colors">Inicio</NuxtLink>
          <span>/</span>
          <NuxtLink to="/events" class="hover:text-white/50 transition-colors">Eventos</NuxtLink>
          <span>/</span>
          <span class="text-white/50 truncate max-w-[200px]">{{ event.name }}</span>
        </div>
      </nav>

      <!-- Hero / Event Header -->
      <header class="relative overflow-hidden px-5 lg:px-12 pt-8 pb-10">
        <!-- Cover image -->
        <div v-if="event.cover_image_url" class="absolute inset-0">
          <NuxtImg :src="event.cover_image_url" :alt="event.name ?? ''" class="w-full h-full object-cover" />
          <div class="absolute inset-0 bg-gradient-to-b from-night/75 via-night/55 to-night" />
        </div>
        <!-- Fallback glow -->
        <div v-else class="absolute top-0 left-0 w-[500px] h-[260px] rounded-full bg-violet/8 blur-[100px] pointer-events-none -translate-x-1/3" />

        <div class="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pt-4" :class="event.cover_image_url ? 'min-h-[200px] justify-end' : ''">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <span
                class="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                :class="{
                  'bg-green-500/15 border border-green-500/25 text-green-400': event.status === 'active',
                  'bg-white/5 border border-white/10 text-white/40': event.status === 'closed',
                  'bg-coral/10 border border-coral/20 text-[#FF8FAB]': event.status === 'draft',
                }"
              >
                <span v-if="event.status === 'active'" class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse-dot inline-block" />
                {{ statusLabel }}
              </span>
              <span v-if="event.location" class="text-[11px] text-white/30 font-medium">{{ event.location }}</span>
            </div>

            <h1 class="font-display font-bold text-[26px] sm:text-[34px] lg:text-[42px] tracking-tight leading-[1.1] text-white mb-4">
              {{ event.name }}
            </h1>

            <div class="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/40">
              <span v-if="event.event_date" class="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {{ formattedDate }}
              </span>
              <span v-if="event.location" class="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {{ event.location }}
              </span>
            </div>
          </div>

          <div v-if="totalPhotos" class="flex items-center gap-3 flex-wrap">
            <div class="bg-night-2/80 backdrop-blur-sm border border-border rounded-xl px-4 py-3 text-center min-w-[90px]">
              <div class="font-display font-bold text-[20px] text-white tracking-tight">{{ totalPhotos.toLocaleString('es-PE') }}</div>
              <div class="text-[11px] text-white/30 mt-0.5">fotos</div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main content -->
      <section class="px-5 lg:px-12 pb-40 lg:pb-20">
        <div class="flex flex-col lg:flex-row gap-6 lg:items-start">

          <!-- LEFT: CTA + gallery -->
          <div class="w-full lg:flex-1">

            <!-- AI CTA card -->
            <div v-if="event.status !== 'closed'" class="bg-gradient-to-br from-violet/12 to-violet-deep/8 border border-violet/30 rounded-2xl p-5 sm:p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-xl bg-violet/20 border border-violet/30 flex items-center justify-center flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <div>
                  <div class="font-display font-bold text-[15px] text-white mb-1">¿Saliste en las fotos?</div>
                  <p class="text-[13px] text-white/50 leading-relaxed max-w-[340px]">Nuestra IA te encuentra en segundos. Sube una selfie y listo.</p>
                </div>
              </div>
              <NuxtLink
                :to="`/search?event_id=${event.id}`"
                class="flex-shrink-0 w-full sm:w-auto text-center bg-coral hover:bg-[#e62d5a] text-white font-semibold text-[14px] px-6 py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                </svg>
                Buscar mis fotos con IA
              </NuxtLink>
            </div>

            <!-- Mobile pricing strip -->
            <div v-if="hasPricing && event.status !== 'closed'" class="block lg:hidden mb-6">
              <div class="text-[10px] font-semibold text-white/25 uppercase tracking-widest mb-2">Precios disponibles</div>
              <div class="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
                <div class="flex-shrink-0 bg-night-2 border border-border rounded-xl px-4 py-3 text-center min-w-[90px]">
                  <div class="font-display font-bold text-[14px] text-white">{{ currency }} {{ event.photo_price }}</div>
                  <div class="text-[10px] text-white/35 mt-0.5">1 foto</div>
                </div>
                <div v-if="event.pack_size && event.pack_price" class="flex-shrink-0 bg-night-2 border border-border rounded-xl px-4 py-3 text-center min-w-[110px]">
                  <div class="font-display font-bold text-[14px] text-white">{{ currency }} {{ event.pack_price }}</div>
                  <div class="text-[10px] text-white/35 mt-0.5">Pack {{ event.pack_size }}</div>
                </div>
                <div v-if="event.full_event_price" class="flex-shrink-0 border border-coral/30 bg-coral/5 rounded-xl px-4 py-3 text-center min-w-[120px] relative">
                  <div class="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-coral text-white text-[8px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap">Mejor valor</div>
                  <div class="font-display font-bold text-[14px] text-white">{{ currency }} {{ event.full_event_price }}</div>
                  <div class="text-[10px] text-white/35 mt-0.5">Todas las fotos</div>
                </div>
              </div>
            </div>

            <!-- Gallery header -->
            <div class="flex items-center justify-between mb-5 gap-4">
              <div>
                <div class="text-[11px] font-semibold tracking-[3px] uppercase text-violet mb-1">Galería completa</div>
                <div class="font-display font-bold text-[20px] sm:text-[24px] tracking-tight text-white">
                  {{ totalPhotos ? totalPhotos.toLocaleString('es-PE') + ' fotos' : 'Galería' }}
                </div>
              </div>
            </div>

            <!-- Loading skeleton -->
            <div v-if="photosLoading" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div v-for="n in 9" :key="n" class="rounded-xl bg-night-2 border border-border animate-pulse" :class="n % 3 === 0 ? 'aspect-video' : 'aspect-[3/4]'" />
            </div>

            <!-- Photo grid -->
            <div v-else-if="photos.length" class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div
                v-for="(photo, photoIndex) in photos"
                :key="photo.id"
                class="rounded-xl overflow-hidden border group cursor-pointer relative transition-all duration-200 select-none"
                :class="photo.id !== undefined && cart.has(photo.id) ? 'border-violet shadow-[0_0_0_2px_rgba(124,58,237,0.35)]' : 'border-border hover:border-violet/40'"
                @click="handlePhotoClick(photo)"
              >
                <div class="aspect-[3/4] bg-night-2 relative flex items-center justify-center">
                  <NuxtImg
                    v-if="photo.thumbnail_url"
                    :src="photo.thumbnail_url"
                    :alt="`Foto ${photoIndex + 1}`"
                    class="w-full h-full object-cover transition-all duration-300"
                    :class="!auth.isAuthenticated ? 'blur-sm scale-110' : ''"
                  />
                  <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity="0.15">
                    <path d="M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0" /><path d="M7.5 17.5 10 12l3 3 2-4 2.5 6.5" /><path d="M3 12h18" />
                  </svg>

                  <!-- FOTIFY watermark -->
                  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span class="font-display text-white/[0.07] text-[13px] font-bold -rotate-[30deg] select-none tracking-[6px]">FOTIFY</span>
                  </div>

                  <!-- Lock overlay (unauthenticated) -->
                  <div v-if="!auth.isAuthenticated" class="absolute inset-0 bg-night/30 flex items-center justify-center">
                    <div class="w-9 h-9 rounded-full bg-night-2/90 border border-border flex items-center justify-center">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.5">
                        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  </div>

                  <!-- Selected check badge -->
                  <div v-if="auth.isAuthenticated && photo.id !== undefined && cart.has(photo.id)" class="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-violet border-2 border-white flex items-center justify-center z-10">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>

                  <!-- Hover action label -->
                  <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-end p-3">
                    <div class="w-full bg-coral/90 backdrop-blur-sm text-white text-[11px] font-semibold py-2 rounded-lg text-center translate-y-1 group-hover:translate-y-0 transition-transform duration-200">
                      {{ auth.isAuthenticated ? (photo.id !== undefined && cart.has(photo.id) ? 'Quitar selección' : 'Seleccionar') : 'Iniciar sesión para ver' }}
                    </div>
                  </div>
                </div>

                <div class="px-3 py-2 bg-night-2 flex items-center justify-between">
                  <div class="text-[10px] text-white/30">#{{ String(photoIndex + 1).padStart(3, '0') }}</div>
                  <div v-if="event.photo_price" class="text-[12px] font-medium text-white">{{ currency }} {{ event.photo_price }}</div>
                </div>
              </div>
            </div>

            <div v-else class="bg-night-2 border border-border rounded-2xl py-16 text-center">
              <svg class="mx-auto mb-3" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity="0.3">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
              </svg>
              <p class="text-muted text-[14px]">No hay fotos disponibles aún.</p>
            </div>

            <!-- Load more -->
            <div v-if="hasMore" class="mt-8 flex flex-col items-center gap-2">
              <button
                class="px-8 py-3 rounded-xl border border-border text-[14px] font-medium text-white/60 hover:text-white hover:border-white/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                :disabled="loadingMore"
                @click="loadMore"
              >
                <svg v-if="loadingMore" class="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                {{ loadingMore ? 'Cargando...' : `Ver más fotos (${totalPhotos - photos.length} restantes)` }}
              </button>
              <p class="text-[11px] text-white/20">{{ photos.length }} de {{ totalPhotos }} fotos</p>
            </div>
          </div>

          <!-- RIGHT: Sticky pricing panel -->
          <div v-if="hasPricing" class="hidden lg:block w-[280px] flex-shrink-0 sticky top-[84px]">
            <div class="bg-night-2 border border-border rounded-2xl overflow-hidden">
              <div class="px-5 pt-5 pb-3 border-b border-border">
                <div class="text-[11px] font-semibold tracking-[2px] uppercase text-violet mb-1">Precios</div>
                <div class="font-display font-bold text-[16px] text-white tracking-tight">Elige tu pack</div>
                <p class="text-[11px] text-muted mt-1.5">Sin marca de agua · Descarga HD</p>
              </div>

              <div class="p-4 flex flex-col gap-2.5">
                <!-- Single -->
                <div class="border border-border rounded-xl p-3.5 flex items-center gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="text-[13px] font-semibold text-white">1 foto</div>
                    <div class="text-[11px] text-muted mt-0.5">precio por unidad</div>
                  </div>
                  <div class="font-display font-bold text-[15px] text-white">{{ currency }} {{ event.photo_price }}</div>
                </div>

                <!-- Pack -->
                <div v-if="event.pack_size && event.pack_price" class="border border-border rounded-xl p-3.5 flex items-center gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="text-[13px] font-semibold text-white">Pack {{ event.pack_size }}</div>
                    <div class="text-[11px] text-green-400/70 mt-0.5">ahorras {{ currency }} {{ packSaving }}</div>
                  </div>
                  <div class="text-right">
                    <div class="font-display font-bold text-[15px] text-white">{{ currency }} {{ event.pack_price }}</div>
                    <div class="text-[10px] text-white/25 line-through">{{ currency }} {{ packOriginalPrice }}</div>
                  </div>
                </div>

                <!-- Full event -->
                <div v-if="event.full_event_price" class="border border-coral/30 bg-coral/5 rounded-xl p-3.5 flex items-center gap-3 relative mt-1">
                  <div class="absolute -top-2.5 left-3 bg-coral text-white text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">Mejor valor</div>
                  <div class="flex-1 min-w-0">
                    <div class="text-[13px] font-semibold text-white">Todas las fotos</div>
                    <div class="text-[11px] text-muted mt-0.5">evento completo</div>
                  </div>
                  <div class="font-display font-bold text-[15px] text-white">{{ currency }} {{ event.full_event_price }}</div>
                </div>
              </div>

              <div class="px-4 pb-5 flex flex-col gap-2">
                <!-- Cart CTA (when photos selected) -->
                <NuxtLink
                  v-if="auth.isAuthenticated && cart.hasPhotos && event.status !== 'closed'"
                  :to="`/checkout?event_slug=${route.params.slug}`"
                  class="w-full bg-violet hover:bg-violet-deep text-white font-semibold text-[14px] py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  Comprar {{ cart.count }} foto{{ cart.count > 1 ? 's' : '' }} · {{ currency }} {{ cartTotal }}
                </NuxtLink>

                <!-- Search CTA -->
                <NuxtLink
                  v-if="event.status !== 'closed'"
                  :to="`/search?event_id=${event.id}`"
                  class="w-full text-white font-semibold text-[14px] py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                  :class="cart.hasPhotos && auth.isAuthenticated ? 'border border-border text-white/60 hover:text-white hover:border-white/20' : 'bg-coral hover:bg-[#e62d5a]'"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                  </svg>
                  Buscar mis fotos con IA
                </NuxtLink>

                <p class="text-[10px] text-white/20 text-center">Descarga HD instantánea · Sin marca de agua</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Mobile sticky cart bar (selected photos) -->
      <Transition name="slide-up">
        <div v-if="auth.isAuthenticated && cart.hasPhotos && event.status !== 'closed'" class="lg:hidden fixed bottom-0 left-0 right-0 z-50">
          <div class="bg-night-2/95 backdrop-blur-xl border-t border-border px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] flex items-center gap-3">
            <div class="flex-1 min-w-0">
              <div class="text-[13px] font-semibold text-white">{{ cart.count }} foto{{ cart.count > 1 ? 's' : '' }} seleccionada{{ cart.count > 1 ? 's' : '' }}</div>
              <div class="text-[11px] text-white/40">{{ currency }} {{ cartTotal }}</div>
            </div>
            <NuxtLink
              :to="`/checkout?event_slug=${route.params.slug}`"
              class="flex-shrink-0 bg-violet hover:bg-violet-deep text-white font-semibold text-[14px] px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              Ir al pago
            </NuxtLink>
          </div>
        </div>
      </Transition>

      <!-- Mobile sticky search CTA (no photos selected) -->
      <div v-if="!cart.hasPhotos && event.status !== 'closed'" class="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div class="bg-night-2/95 backdrop-blur-xl border-t border-border px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <NuxtLink
            :to="`/search?event_id=${event.id}`"
            class="w-full bg-coral hover:bg-[#e62d5a] text-white font-semibold text-[15px] py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            Buscar mis fotos con IA
          </NuxtLink>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { EventResponse, PhotoResponse, SingleEnvelope, ListEnvelope } from '~/types'

const LIMIT = 24

const route = useRoute()
const config = useRuntimeConfig()
const auth = useAuthStore()
const cart = useCartStore()
const showAuth = useAuthModal()

const slug = route.params.slug as string

// #1 — event_id as computed ref so useFetch query is reactive
const { data: eventData } = await useFetch<SingleEnvelope<EventResponse>>(
  `${config.public.apiBase}/events/slug/${slug}`,
  { key: `event-${slug}` },
)

const event = computed(() => eventData.value?.data ?? null)
const eventId = computed(() => event.value?.id)

// Sync cart to this event so selectedIds survive navigation to /checkout
watch(eventId, (id) => { if (id) cart.setEvent(id) }, { immediate: true })

// Initial SSR fetch — first page
const { data: photosData, pending: photosLoading } = await useFetch<ListEnvelope<PhotoResponse>>(
  `${config.public.apiBase}/photos`,
  {
    key: `event-photos-${slug}`,
    query: { event_id: eventId, limit: LIMIT, offset: 0 },
    immediate: !!eventId.value,
  },
)

// #5 — Local state for pagination (load more appends to this)
const photos = ref<PhotoResponse[]>(photosData.value?.data?.items ?? [])
const totalPhotos = ref(photosData.value?.data?.total ?? event.value?.total_photos ?? 0)
const loadingMore = ref(false)

const hasMore = computed(() => photos.value.length < totalPhotos.value)

async function loadMore() {
  if (!eventId.value || loadingMore.value) return
  loadingMore.value = true
  try {
    const res = await $fetch<ListEnvelope<PhotoResponse>>(
      `${config.public.apiBase}/photos`,
      { query: { event_id: eventId.value, limit: LIMIT, offset: photos.value.length } },
    )
    photos.value = [...photos.value, ...(res.data?.items ?? [])]
    totalPhotos.value = res.data?.total ?? totalPhotos.value
  }
  finally {
    loadingMore.value = false
  }
}

const currency = computed(() => event.value?.currency ?? 'S/')

const hasPricing = computed(() =>
  !!(event.value?.photo_price || event.value?.pack_price || event.value?.full_event_price),
)

const packOriginalPrice = computed(() => {
  if (!event.value?.pack_size || !event.value?.photo_price) return 0
  return event.value.pack_size * event.value.photo_price
})

const packSaving = computed(() => {
  if (!event.value?.pack_price) return 0
  return packOriginalPrice.value - event.value.pack_price
})

// #2 — Cart total based on individual photo_price × selected count
const cartTotal = computed(() => {
  if (!event.value?.photo_price) return '0.00'
  return (cart.count * event.value.photo_price).toFixed(2)
})

const formattedDate = computed(() => {
  if (!event.value?.event_date) return ''
  return new Date(event.value.event_date).toLocaleDateString('es-PE', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
})

const statusLabel = computed(() => {
  switch (event.value?.status) {
    case 'active': return 'Fotos disponibles'
    case 'closed': return 'Evento cerrado'
    case 'draft': return 'Próximamente'
    default: return ''
  }
})

function handlePhotoClick(photo: PhotoResponse) {
  if (!auth.isAuthenticated) {
    showAuth.value = true
    return
  }
  if (photo.id === undefined || !eventId.value) return
  cart.setEvent(eventId.value)
  cart.toggle(photo.id)
}

// #4 — ogImage only when cover_image_url is defined
if (event.value) {
  useSeoMeta({
    title: `${event.value.name} — Fotify`,
    description: `Encuentra tus fotos del ${event.value.name}. ${totalPhotos.value} fotos disponibles.`,
    ogTitle: `${event.value.name} — Fotify`,
    ogDescription: `Busca tus fotos con IA. ${totalPhotos.value} fotos disponibles.`,
    ...(event.value.cover_image_url && { ogImage: event.value.cover_image_url }),
  })
}
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
