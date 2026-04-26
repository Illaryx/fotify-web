<template>
  <div class="min-h-screen">

    <!-- Loading skeleton -->
    <template v-if="pending">
      <div class="h-48 lg:h-64 bg-night-2 animate-pulse" />
      <div class="max-w-4xl mx-auto px-4 -mt-16 relative z-10">
        <div class="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">
          <div class="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-night-3 animate-pulse flex-shrink-0 ring-4 ring-night" />
          <div class="flex-1 sm:pb-2 space-y-2.5">
            <div class="h-7 bg-night-3 rounded-lg animate-pulse w-56" />
            <div class="h-4 bg-night-3 rounded animate-pulse w-40" />
          </div>
        </div>
        <div class="h-4 bg-night-3 rounded animate-pulse mb-2 max-w-2xl" />
        <div class="h-4 bg-night-3 rounded animate-pulse mb-2 max-w-lg" />
        <div class="grid grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden mt-8 mb-8">
          <div v-for="n in 4" :key="n" class="bg-night-2 h-16 animate-pulse" />
        </div>
        <div class="grid grid-cols-3 lg:grid-cols-4 gap-2 auto-rows-[140px] mb-10">
          <div v-for="n in 8" :key="n" :class="n === 1 ? 'row-span-2' : ''" class="bg-night-3 rounded-lg animate-pulse" />
        </div>
      </div>
    </template>

    <!-- 404 state -->
    <template v-else-if="!photographer">
      <div class="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div class="w-16 h-16 rounded-2xl bg-violet/10 border border-violet/20 flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="12" /><circle cx="11" cy="16" r="0.5" fill="#7C3AED" stroke="none" />
          </svg>
        </div>
        <h1 class="font-display font-bold text-2xl text-white mb-2">Fotógrafo no encontrado</h1>
        <p class="text-muted text-sm mb-6 max-w-xs">El perfil que buscas no existe o fue eliminado.</p>
        <NuxtLink
          to="/events"
          class="bg-violet hover:bg-violet-deep text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          Ver eventos
        </NuxtLink>
      </div>
    </template>

    <!-- Profile content -->
    <template v-else>

      <!-- ─── 1. Hero Cover ────────────────────────────────────────────── -->
      <div
        class="h-48 lg:h-64 relative overflow-hidden"
        style="background: linear-gradient(135deg, #1A0A2E 0%, #221840 50%, #1A1030 100%)"
      >
        <!-- Decorative grid -->
        <div class="absolute inset-0 grid grid-cols-6 opacity-20 pointer-events-none">
          <div
            v-for="n in 48"
            :key="n"
            class="border border-violet/10"
            :style="{ backgroundColor: n % 7 === 0 ? 'rgba(124,58,237,0.18)' : n % 11 === 0 ? 'rgba(124,58,237,0.08)' : 'transparent' }"
          />
        </div>
        <!-- Bottom fade -->
        <div class="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-night to-transparent pointer-events-none" />
      </div>

      <!-- ─── 2. Main section ──────────────────────────────────────────── -->
      <div class="max-w-4xl mx-auto px-4 -mt-16 relative z-10">

        <!-- Avatar + Name + Actions -->
        <div class="flex flex-col sm:flex-row sm:items-end gap-4 mb-6">

          <!-- Avatar -->
          <div class="flex-shrink-0">
            <div class="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl border-2 border-violet/40 overflow-hidden bg-violet/20 flex items-center justify-center ring-4 ring-night">
              <NuxtImg
                v-if="photographer.avatar_url"
                :src="photographer.avatar_url"
                :alt="photographer.display_name ?? 'Fotógrafo'"
                class="w-full h-full object-cover"
              />
              <span v-else class="font-display font-bold text-xl lg:text-2xl text-white select-none">
                {{ initials }}
              </span>
            </div>
          </div>

          <!-- Name + meta + buttons -->
          <div class="flex-1 sm:pb-2">
            <div class="flex flex-wrap items-center gap-2 mb-2">
              <h1 class="font-display font-bold text-2xl lg:text-3xl text-white">
                {{ photographer.display_name ?? 'Fotógrafo' }}
              </h1>
              <span
                v-if="photographer.verified"
                class="flex items-center gap-1 bg-violet/15 text-violet border border-violet/25 text-[11px] font-semibold px-2 py-0.5 rounded-full"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 3.8 2.4-7.4L2 9.4h7.6z" />
                </svg>
                Verificado
              </span>
              <span :class="planBadge.cls" class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                {{ planBadge.label }}
              </span>
            </div>

            <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
              <span v-if="eventsTotal > 0" class="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {{ eventsTotal }} evento{{ eventsTotal !== 1 ? 's' : '' }}
              </span>
              <span v-if="locationFromBio" class="flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                {{ locationFromBio }}
              </span>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="flex gap-2 sm:pb-2 flex-shrink-0">
            <a
              v-if="photographer.portfolio_url"
              :href="photographer.portfolio_url"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 bg-night-2 border border-border hover:border-violet/40 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Portfolio
            </a>
            <NuxtLink
              :to="`/search?photographer_id=${photographer.id}`"
              class="flex items-center gap-1.5 bg-violet hover:bg-violet-deep text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Buscar mis fotos
            </NuxtLink>
          </div>
        </div>

        <!-- Bio -->
        <p v-if="photographer.bio" class="text-[15px] text-white/80 leading-relaxed mb-6 max-w-2xl">
          {{ photographer.bio }}
        </p>

        <!-- Stats bar -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border mb-8">
          <div class="bg-night-2 px-5 py-4 text-center">
            <div class="font-display font-bold text-xl text-white">{{ eventsTotal || '–' }}</div>
            <div class="text-xs text-muted mt-0.5">Eventos</div>
          </div>
          <div class="bg-night-2 px-5 py-4 text-center">
            <div class="font-display font-bold text-xl text-white">{{ photosTotal || '–' }}</div>
            <div class="text-xs text-muted mt-0.5">Fotos</div>
          </div>
          <div class="bg-night-2 px-5 py-4 text-center">
            <div class="font-display font-bold text-xl text-white">{{ totalSales || '–' }}</div>
            <div class="text-xs text-muted mt-0.5">Ventas</div>
          </div>
          <div class="bg-night-2 px-5 py-4 text-center">
            <div class="font-display font-bold text-xl text-white">{{ sinceYear }}</div>
            <div class="text-xs text-muted mt-0.5">Desde</div>
          </div>
        </div>

      </div>

      <!-- ─── 3. Specialty pills ────────────────────────────────────────── -->
      <div class="max-w-4xl mx-auto px-4 mb-8">
        <div class="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <span
            v-for="pill in specialtyPills"
            :key="pill"
            class="flex-shrink-0 bg-violet/10 border border-violet/20 text-violet text-[13px] font-medium px-3.5 py-1.5 rounded-full"
          >
            {{ pill }}
          </span>
        </div>
      </div>

      <!-- ─── 4. Photo grid ─────────────────────────────────────────────── -->
      <div v-if="photos.length > 0" class="max-w-4xl mx-auto px-4 mb-10">
        <h2 class="font-display font-bold text-lg text-white mb-4">Portfolio reciente</h2>
        <div class="grid grid-cols-3 lg:grid-cols-4 gap-2 auto-rows-[140px] lg:auto-rows-[150px]">
          <div
            v-for="(photo, i) in photos"
            :key="photo.id ?? i"
            :class="i === 0 ? 'row-span-2' : ''"
            class="relative overflow-hidden rounded-lg bg-night-3 group cursor-pointer"
          >
            <img
              :src="photo.thumbnail_url ?? demoThumb(photo.id ?? i)"
              :alt="`Foto ${i + 1}`"
              class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end p-2">
              <span class="text-[11px] text-white font-medium truncate w-full">
                {{ (photo.event_id != null && eventMap[photo.event_id]) ? eventMap[photo.event_id] : 'Evento fotográfico' }}
              </span>
            </div>
          </div>
        </div>
        <p class="text-center text-xs text-muted mt-3">
          Previews con marca de agua · Descarga disponible al comprar
        </p>
      </div>

      <!-- ─── 5. Recent events ──────────────────────────────────────────── -->
      <div class="max-w-4xl mx-auto px-4 mb-10">
        <h2 class="font-display font-bold text-lg text-white mb-4">Eventos recientes</h2>

        <div v-if="events.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <EventCard
            v-for="event in events"
            :key="event.id"
            :event="event"
          />
        </div>

        <div
          v-else
          class="flex flex-col items-center justify-center py-12 text-center border border-border rounded-2xl bg-night-2"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mb-3 opacity-40">
            <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <p class="text-white/50 text-sm">Próximamente nuevos eventos</p>
        </div>
      </div>

      <!-- ─── 6. CTA final ─────────────────────────────────────────────── -->
      <div class="max-w-4xl mx-auto px-4 mb-16">
        <div
          class="rounded-2xl border border-border p-8 lg:p-12 text-center"
          style="background: linear-gradient(135deg, rgba(124,58,237,0.10) 0%, rgba(26,16,48,0.95) 100%)"
        >
          <h2 class="font-display font-bold text-xl lg:text-2xl text-white mb-2">
            ¿Estuviste en uno de sus eventos?
          </h2>
          <p class="text-muted text-sm mb-6">Busca tus fotos con reconocimiento facial en segundos</p>
          <NuxtLink
            to="/search"
            class="inline-flex items-center gap-2 bg-violet hover:bg-violet-deep text-white font-semibold px-8 py-3.5 rounded-xl transition-colors text-sm"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            Busca tus fotos con IA
          </NuxtLink>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup lang="ts">
import { demoThumb } from '~/utils/demophotos'
import type { PhotographerResponse, PhotoResponse, EventResponse, ListEnvelope } from '~/types'

const route = useRoute()
const config = useRuntimeConfig()
const id = route.params.id as string
const base = config.public.apiBase

type PhotographerEnvelope = { data?: PhotographerResponse; success?: boolean }

const { data, pending } = await useAsyncData(`photographer-profile-${id}`, async () => {
  const [pResult, photosResult, eventsResult] = await Promise.allSettled([
    $fetch<PhotographerEnvelope>(`${base}/photographers/${id}`),
    $fetch<ListEnvelope<PhotoResponse>>(`${base}/photos`, {
      query: { photographer_id: id, status: 'indexed', limit: 8 },
    }),
    $fetch<ListEnvelope<EventResponse>>(`${base}/events`, {
      query: { photographer_id: id, status: 'active', limit: 6 },
    }),
  ])

  return {
    photographer: pResult.status === 'fulfilled' ? (pResult.value.data ?? null) : null,
    photos: photosResult.status === 'fulfilled' ? (photosResult.value.data?.items ?? []) : [],
    events: eventsResult.status === 'fulfilled' ? (eventsResult.value.data?.items ?? []) : [],
    photosTotal: photosResult.status === 'fulfilled' ? (photosResult.value.data?.total ?? 0) : 0,
    eventsTotal: eventsResult.status === 'fulfilled' ? (eventsResult.value.data?.total ?? 0) : 0,
  }
})

const photographer = computed(() => data.value?.photographer ?? null)
const photos = computed(() => data.value?.photos ?? [])
const events = computed(() => data.value?.events ?? [])
const photosTotal = computed(() => data.value?.photosTotal ?? 0)
const eventsTotal = computed(() => data.value?.eventsTotal ?? 0)

const initials = computed(() => {
  const name = photographer.value?.display_name ?? ''
  return name.split(' ').map(w => w[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || '?'
})

const planBadge = computed(() => {
  switch (photographer.value?.plan) {
    case 'pro':    return { label: 'Pro',    cls: 'bg-violet/20 text-violet border border-violet/30' }
    case 'studio': return { label: 'Studio', cls: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' }
    default:       return { label: 'Free',   cls: 'bg-white/5 text-muted border border-white/10' }
  }
})

const CITIES = ['Lima', 'Cusco', 'Arequipa', 'Trujillo', 'Chiclayo', 'Iquitos', 'Piura', 'Huancayo', 'Tacna', 'Puno', 'Ica', 'Cajamarca', 'Ayacucho']

const locationFromBio = computed(() => {
  const bio = photographer.value?.bio ?? ''
  return CITIES.find(city => new RegExp(`\\b${city}\\b`, 'i').test(bio)) ?? null
})

const specialtyPills = computed(() => {
  const bio = (photographer.value?.bio ?? '').toLowerCase()
  const checks: { keywords: string[]; label: string }[] = [
    { keywords: ['running', 'corredor', 'corredores'],           label: 'Running' },
    { keywords: ['maratón', 'marathon', 'maratones', 'maraton'], label: 'Maratón' },
    { keywords: ['trail'],                                        label: 'Trail Running' },
    { keywords: ['triatlón', 'triathlon', 'triatlon'],           label: 'Triatlón' },
    { keywords: ['ciclismo', 'cycling', 'bicicleta', 'ciclista'],label: 'Ciclismo' },
    { keywords: ['natación', 'natacion', 'swimming', 'nadador'], label: 'Natación' },
    { keywords: ['atletismo', 'atleta'],                         label: 'Atletismo' },
    { keywords: ['fútbol', 'futbol', 'soccer'],                  label: 'Fútbol' },
    { keywords: ['crossfit'],                                     label: 'CrossFit' },
    { keywords: ['trekking', 'hiking', 'montaña'],               label: 'Trekking' },
    { keywords: ['surf'],                                         label: 'Surf' },
  ]
  const found = checks.filter(c => c.keywords.some(kw => bio.includes(kw))).map(c => c.label)
  return found.length > 0 ? found : ['Fotografía deportiva', 'Eventos al aire libre', 'Captura en acción']
})

const eventMap = computed(() => {
  const map: Record<number, string> = {}
  for (const ev of events.value) {
    if (ev.id != null && ev.name) map[ev.id] = ev.name
  }
  return map
})

const sinceYear = computed(() => {
  const years = events.value
    .map(e => e.event_date ?? e.created_at ?? e.published_at)
    .filter((d): d is string => !!d)
    .map(d => new Date(d).getFullYear())
    .filter(y => !isNaN(y))
  return years.length > 0 ? String(Math.min(...years)) : '–'
})

const totalSales = computed(() =>
  events.value.reduce((sum, ev) => sum + (ev.total_sales ?? 0), 0),
)

useSeoMeta({
  title: () => photographer.value?.display_name
    ? `${photographer.value.display_name} — Fotógrafo deportivo | Fotify`
    : 'Fotógrafo | Fotify',
  description: () => photographer.value?.bio ?? 'Perfil público de fotógrafo deportivo en Fotify.',
  ogTitle: () => photographer.value?.display_name ?? 'Fotógrafo deportivo',
  ogDescription: () => photographer.value?.bio ?? '',
  ogImage: () => photographer.value?.avatar_url ?? undefined,
})
</script>
