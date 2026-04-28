<template>
  <div>
    <!-- Loading skeleton (event still fetching) -->
    <div v-if="eventLoading" class="px-5 lg:px-12">
      <!-- Breadcrumb placeholder -->
      <div class="pt-5 pb-0 flex items-center gap-2">
        <div class="h-3 w-12 rounded bg-white/5 animate-pulse" />
        <div class="h-3 w-2 rounded bg-white/5 animate-pulse" />
        <div class="h-3 w-20 rounded bg-white/5 animate-pulse" />
        <div class="h-3 w-2 rounded bg-white/5 animate-pulse" />
        <div class="h-3 w-40 rounded bg-white/5 animate-pulse" />
      </div>
      <!-- Hero placeholder -->
      <div class="pt-8 pb-10">
        <div class="h-5 w-24 rounded-full bg-white/5 animate-pulse mb-4" />
        <div class="h-10 w-2/3 rounded-xl bg-white/5 animate-pulse mb-3" />
        <div class="h-10 w-1/2 rounded-xl bg-white/[0.03] animate-pulse mb-6" />
        <div class="flex gap-4">
          <div class="h-4 w-28 rounded bg-white/5 animate-pulse" />
          <div class="h-4 w-20 rounded bg-white/5 animate-pulse" />
        </div>
      </div>
      <!-- Grid placeholder -->
      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-12">
        <div v-for="n in 9" :key="n" class="rounded-xl bg-night-2 border border-border animate-pulse aspect-[3/4]" />
      </div>
    </div>

    <!-- Not found (only after fetch completed) -->
    <div v-else-if="!event" class="flex flex-col items-center justify-center py-32 px-5 text-center">
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
                  <img
                    :src="getThumbUrl(photo)"
                    :alt="`Foto ${photoIndex + 1}`"
                    class="w-full h-full object-cover transition-all duration-300"
                    :class="!auth.isAuthenticated ? 'blur-sm scale-110' : ''"
                  />

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

                  <!-- Expand (lightbox) button — always visible, top right -->
                  <button
                    v-if="auth.isAuthenticated"
                    class="absolute top-2 right-2 w-7 h-7 rounded-lg bg-white shadow-md flex items-center justify-center z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-150 hover:scale-110 active:scale-95"
                    @click.stop="openLightbox(photo, photoIndex)"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                    </svg>
                  </button>

                  <!-- Hover select label -->
                  <div v-if="auth.isAuthenticated" class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-end p-3">
                    <div
                      class="w-full backdrop-blur-sm text-white text-[11px] font-semibold py-2 rounded-lg text-center translate-y-1 group-hover:translate-y-0 transition-transform duration-200"
                      :class="photo.id !== undefined && cart.has(photo.id) ? 'bg-violet/80' : 'bg-coral/80'"
                    >
                      {{ photo.id !== undefined && cart.has(photo.id) ? '✓ Quitar' : '+ Seleccionar' }}
                    </div>
                  </div>
                  <div v-else class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-end p-3">
                    <div class="w-full bg-night-2/80 backdrop-blur-sm text-white/60 text-[11px] font-semibold py-2 rounded-lg text-center">
                      Iniciar sesión para seleccionar
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
                <!-- Pack applied badge -->
                <Transition name="slide-up">
                  <div v-if="packApplied && auth.isAuthenticated" class="bg-green-500/10 border border-green-500/25 rounded-xl px-3 py-2 flex items-center gap-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span class="text-[11px] text-green-400 font-semibold">Pack aplicado · ahorras {{ currency }} {{ packSaving }}</span>
                  </div>
                </Transition>

                <!-- "N fotos más para el pack" nudge -->
                <Transition name="slide-up">
                  <div v-if="!packApplied && photosToNextPack > 0 && auth.isAuthenticated && cart.hasPhotos" class="bg-violet/10 border border-violet/20 rounded-xl px-3 py-2 text-[11px] text-violet/80 text-center">
                    Selecciona {{ photosToNextPack }} foto{{ photosToNextPack > 1 ? 's' : '' }} más y activa el precio de pack
                  </div>
                </Transition>

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
              <div class="flex items-center gap-2">
                <div class="text-[13px] font-semibold text-white">{{ cart.count }} foto{{ cart.count > 1 ? 's' : '' }}</div>
                <span v-if="packApplied" class="text-[9px] font-bold text-green-400 bg-green-500/15 px-1.5 py-0.5 rounded-full uppercase tracking-wide">Pack</span>
              </div>
              <div class="text-[11px]" :class="packApplied ? 'text-green-400' : 'text-white/40'">{{ currency }} {{ cartTotal }}</div>
              <div v-if="!packApplied && photosToNextPack > 0" class="text-[10px] text-violet/70 mt-0.5">
                +{{ photosToNextPack }} para activar pack
              </div>
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

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lightbox-fade">
        <div
          v-if="lightboxPhoto"
          class="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          @click.self="closeLightbox"
        >
          <!-- Close -->
          <button
            class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            @click="closeLightbox"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <!-- Prev arrow -->
          <button
            v-if="lightboxIndex > 0"
            class="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            @click="lightboxPrev"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <!-- Next arrow -->
          <button
            v-if="lightboxIndex < photos.length - 1"
            class="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors z-10"
            @click="lightboxNext"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <!-- Photo + actions -->
          <div class="flex flex-col items-center gap-4 px-16 sm:px-20 max-h-screen w-full">
            <!-- Counter -->
            <div class="text-[12px] text-white/40 font-medium">
              {{ lightboxIndex + 1 }} / {{ photos.length }}
            </div>

            <!-- Image -->
            <div class="relative rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl" style="min-width:280px;min-height:360px;max-height:75vh;">
              <!-- Loading skeleton + Fotify logo -->
              <Transition name="lightbox-fade">
                <div
                  v-if="lightboxImgLoading && !lightboxImgError"
                  class="absolute inset-0 bg-night-2 flex flex-col items-center justify-center gap-3 z-10"
                >
                  <!-- Animated Fotify logo mark -->
                  <div class="relative">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" class="animate-pulse">
                      <circle cx="24" cy="24" r="22" stroke="#7C3AED" stroke-width="1.5" stroke-dasharray="4 3" opacity="0.4"/>
                      <circle cx="24" cy="24" r="10" fill="#7C3AED" opacity="0.15"/>
                      <path d="M18 24a6 6 0 1 1 12 0 6 6 0 0 1-12 0" fill="#7C3AED" opacity="0.5"/>
                      <path d="M24 16v2M24 30v2M16 24h2M30 24h2" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
                    </svg>
                  </div>
                  <span class="font-display text-[11px] font-bold tracking-[4px] text-white/20 uppercase">FOTIFY</span>
                </div>
              </Transition>

              <!-- Error state -->
              <div
                v-if="lightboxImgError"
                class="absolute inset-0 bg-night-2 flex flex-col items-center justify-center gap-2"
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity="0.3">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" />
                </svg>
                <span class="text-[11px] text-white/25">No se pudo cargar la imagen</span>
              </div>

              <!-- Actual image -->
              <img
                :key="`lb-${lightboxPhoto?.id}-${lightboxIndex}`"
                :src="lightboxPhoto ? getThumbUrl(lightboxPhoto, 800, 1200) : ''"
                :alt="`Foto ${lightboxIndex + 1}`"
                class="max-h-[75vh] max-w-full object-contain transition-opacity duration-300"
                :class="lightboxImgLoading ? 'opacity-0' : 'opacity-100'"
                @load="lightboxImgLoading = false"
                @error="lightboxImgLoading = false; lightboxImgError = true"
              />

              <!-- FOTIFY watermark -->
              <div v-if="!lightboxImgLoading && !lightboxImgError" class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span class="font-display text-white/[0.06] text-[22px] font-bold -rotate-[30deg] select-none tracking-[10px]">FOTIFY</span>
              </div>
            </div>

            <!-- Select / deselect button -->
            <div v-if="event && event.status !== 'closed'" class="flex items-center gap-3">
              <button
                class="flex items-center gap-2 font-semibold text-[14px] px-6 py-3 rounded-xl transition-colors"
                :class="lightboxPhoto.id !== undefined && cart.has(lightboxPhoto.id)
                  ? 'bg-violet/20 border border-violet/40 text-violet hover:bg-violet/30'
                  : 'bg-coral hover:bg-[#e62d5a] text-white'"
                @click="toggleFromLightbox"
              >
                <svg v-if="lightboxPhoto.id !== undefined && cart.has(lightboxPhoto.id)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                {{ lightboxPhoto.id !== undefined && cart.has(lightboxPhoto.id) ? 'Quitar selección' : 'Seleccionar foto' }}
              </button>
            </div>

            <!-- Price hint -->
            <div v-if="event?.photo_price" class="text-[11px] text-white/25">
              {{ currency }} {{ event.photo_price }} por foto · Sin marca de agua · Descarga HD
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { apiFetch } from '~/composables/useApi'
import { useDemoPhoto } from '~/composables/useDemoPhoto'
import type { EventResponse, PhotoResponse, SingleEnvelope, ListEnvelope } from '~/types'

const LIMIT = 24

const route = useRoute()
const auth = useAuthStore()
const cart = useCartStore()
const showAuth = useAuthModal()
const { getThumbUrl } = useDemoPhoto()

// Lightbox state
const lightboxPhoto = ref<PhotoResponse | null>(null)
const lightboxIndex = ref(0)

const lightboxImgLoading = ref(true)
const lightboxImgError = ref(false)

function openLightbox(photo: PhotoResponse, index: number) {
  lightboxPhoto.value = photo
  lightboxIndex.value = index
  lightboxImgLoading.value = true
  lightboxImgError.value = false
}

function closeLightbox() {
  lightboxPhoto.value = null
}

function lightboxPrev() {
  if (lightboxIndex.value > 0) {
    lightboxIndex.value--
    lightboxPhoto.value = photos.value[lightboxIndex.value] ?? null
    lightboxImgLoading.value = true
    lightboxImgError.value = false
  }
}

function lightboxNext() {
  if (lightboxIndex.value < photos.value.length - 1) {
    lightboxIndex.value++
    lightboxPhoto.value = photos.value[lightboxIndex.value] ?? null
    lightboxImgLoading.value = true
    lightboxImgError.value = false
  }
}

// Keyboard navigation for lightbox
onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
function onKeydown(e: KeyboardEvent) {
  if (!lightboxPhoto.value) return
  if (e.key === 'Escape') closeLightbox()
  if (e.key === 'ArrowLeft') lightboxPrev()
  if (e.key === 'ArrowRight') lightboxNext()
}

const slug = route.params.slug as string

const event = ref<EventResponse | null>(null)
const eventId = computed(() => event.value?.id)
const eventLoading = ref(true)
const photosLoading = ref(true)
const photos = ref<PhotoResponse[]>([])
const totalPhotos = ref(0)
const loadingMore = ref(false)

onMounted(async () => {
  try {
    const evRes = await apiFetch<SingleEnvelope<EventResponse>>(`/events/slug/${slug}`)
    event.value = evRes.data ?? null
    if (event.value?.id) cart.setEvent(event.value.id)
  }
  catch { /* not found state handled by template */ }
  finally {
    eventLoading.value = false
  }

  if (!event.value?.id) {
    photosLoading.value = false
    return
  }

  try {
    const photosRes = await apiFetch<ListEnvelope<PhotoResponse>>('/photos', {
      query: { event_id: event.value.id, limit: LIMIT, offset: 0 },
    })
    photos.value = photosRes.data?.items ?? []
    totalPhotos.value = photosRes.data?.total ?? event.value?.total_photos ?? 0
  }
  finally {
    photosLoading.value = false
  }
})

const hasMore = computed(() => photos.value.length < totalPhotos.value)

async function loadMore() {
  if (!eventId.value || loadingMore.value) return
  loadingMore.value = true
  try {
    const res = await apiFetch<ListEnvelope<PhotoResponse>>('/photos', {
      query: { event_id: eventId.value, limit: LIMIT, offset: photos.value.length },
    })
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
  if (!event.value?.pack_size || !event.value?.photo_price) return '0.00'
  return (event.value.pack_size * event.value.photo_price).toFixed(2)
})

const packSaving = computed(() => {
  if (!event.value?.pack_price || !event.value?.pack_size || !event.value?.photo_price) return '0.00'
  const original = event.value.pack_size * event.value.photo_price
  return (original - event.value.pack_price).toFixed(2)
})

// Cart total: apply pack pricing when possible.
// e.g. pack_size=3, pack_price=47.9, photo_price=18
//   5 photos → 1 pack (47.9) + 2 singles (36) = 83.9
const cartTotal = computed(() => {
  const price = event.value?.photo_price
  if (!price) return '0.00'
  const packSize = event.value?.pack_size
  const packPrice = event.value?.pack_price
  if (packSize && packPrice && cart.count >= packSize) {
    const packs = Math.floor(cart.count / packSize)
    const singles = cart.count % packSize
    return (packs * packPrice + singles * price).toFixed(2)
  }
  return (cart.count * price).toFixed(2)
})

// True when at least one full pack is applied
const packApplied = computed(() => {
  const packSize = event.value?.pack_size
  const packPrice = event.value?.pack_price
  return !!(packSize && packPrice && cart.count >= packSize)
})

// How many photos until the next pack kicks in
const photosToNextPack = computed(() => {
  const packSize = event.value?.pack_size
  const packPrice = event.value?.pack_price
  if (!packSize || !packPrice) return 0
  const remainder = cart.count % packSize
  return remainder === 0 ? 0 : packSize - remainder
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

function toggleFromLightbox() {
  const photo = lightboxPhoto.value
  if (!photo || photo.id === undefined || !eventId.value) return
  cart.setEvent(eventId.value)
  cart.toggle(photo.id)
}

useSeoMeta({
  title: () => event.value ? `${event.value.name} — Fotify` : 'Evento — Fotify',
  description: () => event.value
    ? `Encuentra tus fotos del ${event.value.name}. ${totalPhotos.value} fotos disponibles.`
    : '',
  ogTitle: () => event.value ? `${event.value.name} — Fotify` : 'Evento — Fotify',
  ogDescription: () => event.value ? `Busca tus fotos con IA. ${totalPhotos.value} fotos disponibles.` : '',
  ogImage: () => event.value?.cover_image_url ?? undefined,
})
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }

.lightbox-fade-enter-active, .lightbox-fade-leave-active { transition: opacity 0.2s ease; }
.lightbox-fade-enter-from, .lightbox-fade-leave-to { opacity: 0; }
</style>
