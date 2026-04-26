<template>
  <div class="min-h-[70vh]">

    <!-- ── AUTH GATE ─────────────────────────────────────────────────────────── -->
    <div v-if="step === 'auth-gate'" class="flex flex-col items-center justify-center py-24 px-5">
      <div class="max-w-sm w-full text-center">
        <div class="w-16 h-16 rounded-2xl bg-violet/15 border border-violet/30 flex items-center justify-center mx-auto mb-5">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <h1 class="font-display font-bold text-[22px] text-white mb-2 tracking-tight">Busca tus fotos con IA</h1>
        <p class="text-[14px] text-muted leading-relaxed mb-6">Inicia sesión para usar el buscador facial y encontrar todas tus fotos del evento.</p>
        <button
          class="w-full bg-violet hover:bg-violet-deep text-white font-semibold text-[15px] py-3.5 rounded-xl transition-colors"
          @click="showAuth = true"
        >
          Iniciar sesión
        </button>
        <NuxtLink v-if="eventSlugBack" :to="`/events/${eventSlugBack}`" class="inline-block mt-4 text-[13px] text-white/30 hover:text-white/60 transition-colors">
          ← Volver al evento
        </NuxtLink>
      </div>
    </div>

    <!-- ── CONSENT ────────────────────────────────────────────────────────────── -->
    <div v-else-if="step === 'consent'" class="flex flex-col items-center justify-center py-16 px-5">
      <div class="max-w-md w-full">
        <div class="bg-night-2 border border-border rounded-2xl overflow-hidden">
          <div class="px-6 pt-6 pb-4 border-b border-border">
            <div class="flex items-center gap-3 mb-1">
              <div class="w-10 h-10 rounded-xl bg-violet/15 border border-violet/25 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <div class="font-display font-bold text-[15px] text-white tracking-tight">Datos biométricos</div>
                <div class="text-[11px] text-muted">Consentimiento requerido</div>
              </div>
            </div>
          </div>
          <div class="px-6 py-5">
            <p class="text-[13px] text-white/65 leading-relaxed mb-4">
              Para encontrar tus fotos, Fotify utiliza reconocimiento facial (AWS Rekognition) que procesa tu selfie como dato biométrico.
            </p>
            <ul class="flex flex-col gap-2.5 mb-5">
              <li class="flex items-start gap-2.5 text-[12px] text-white/50">
                <svg class="flex-shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Tu selfie se usa únicamente para la búsqueda y no se almacena permanentemente.
              </li>
              <li class="flex items-start gap-2.5 text-[12px] text-white/50">
                <svg class="flex-shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Los vectores faciales se eliminan automáticamente tras la búsqueda.
              </li>
              <li class="flex items-start gap-2.5 text-[12px] text-white/50">
                <svg class="flex-shrink-0 mt-0.5" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Puedes revocar tu consentimiento en cualquier momento desde tu perfil.
              </li>
            </ul>
            <NuxtLink to="/legal" class="text-[11px] text-violet/60 hover:text-violet transition-colors">
              Leer política de datos biométricos →
            </NuxtLink>
          </div>
          <div class="px-6 pb-6 flex flex-col gap-2.5">
            <p v-if="consentError" class="text-[12px] text-coral text-center">{{ consentError }}</p>
            <button
              class="w-full bg-violet hover:bg-violet-deep text-white font-semibold text-[14px] py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="consentLoading"
              @click="acceptConsent"
            >
              <svg v-if="consentLoading" class="animate-spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              Acepto y continuar
            </button>
            <button
              class="w-full border border-border text-[13px] text-white/40 hover:text-white/70 py-3 rounded-xl transition-colors"
              @click="declineConsent"
            >
              No acepto
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── UPLOAD ─────────────────────────────────────────────────────────────── -->
    <div v-else-if="step === 'upload'">
      <!-- Breadcrumb -->
      <nav class="px-5 lg:px-12 pt-5">
        <div class="flex items-center gap-2 text-[12px] text-white/25">
          <NuxtLink to="/" class="hover:text-white/50 transition-colors">Inicio</NuxtLink>
          <span>/</span>
          <NuxtLink v-if="event" :to="`/events/${event.slug}`" class="hover:text-white/50 transition-colors truncate max-w-[180px]">{{ event.name }}</NuxtLink>
          <NuxtLink v-else to="/events" class="hover:text-white/50 transition-colors">Eventos</NuxtLink>
          <span>/</span>
          <span class="text-white/50">Buscar mis fotos</span>
        </div>
      </nav>

      <div class="px-5 lg:px-12 py-8 max-w-lg mx-auto lg:mx-0">
        <div class="mb-6">
          <div class="text-[11px] font-semibold tracking-[3px] uppercase text-violet mb-1">Búsqueda IA</div>
          <h1 class="font-display font-bold text-[24px] sm:text-[28px] tracking-tight text-white leading-tight">
            {{ event ? `Busca en "${event.name}"` : 'Buscar mis fotos' }}
          </h1>
          <p class="text-[13px] text-muted mt-2">Sube una selfie clara y la IA te encontrará en segundos.</p>
        </div>

        <!-- Selfie upload area -->
        <div
          class="relative border-2 rounded-2xl mb-5 overflow-hidden transition-all duration-200 cursor-pointer group"
          :class="selfiePreview ? 'border-violet/50' : 'border-border border-dashed hover:border-violet/40'"
          @click="triggerFileInput"
        >
          <!-- Preview -->
          <div v-if="selfiePreview" class="relative aspect-[4/3] bg-night-2">
            <img :src="selfiePreview" alt="Selfie" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-t from-night/60 to-transparent" />
            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span class="text-[12px] text-white/70 font-medium">{{ selfieFileName }}</span>
              <button
                class="text-[11px] text-white/50 hover:text-white bg-night-2/80 border border-border px-2.5 py-1 rounded-lg transition-colors"
                @click.stop="clearSelfie"
              >
                Cambiar
              </button>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else class="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div class="w-14 h-14 rounded-2xl bg-violet/10 border border-violet/20 flex items-center justify-center mb-4 group-hover:bg-violet/15 transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div class="text-[15px] font-semibold text-white mb-1">Sube tu selfie</div>
            <p class="text-[12px] text-muted">JPG, PNG · Cara visible y de frente · Sin gafas de sol</p>
          </div>
        </div>

        <input ref="fileInputRef" type="file" accept="image/jpeg,image/png,image/webp" class="hidden" @change="onFileSelect" />

        <p v-if="uploadError" class="text-[12px] text-coral mb-4">{{ uploadError }}</p>

        <!-- Tips -->
        <div v-if="!selfiePreview" class="grid grid-cols-3 gap-2.5 mb-5">
          <div v-for="tip in selfieTips" :key="tip.label" class="bg-night-2 border border-border rounded-xl p-3 text-center">
            <div class="text-[18px] mb-1">{{ tip.icon }}</div>
            <div class="text-[10px] text-muted leading-tight">{{ tip.label }}</div>
          </div>
        </div>

        <button
          class="w-full bg-coral hover:bg-[#e62d5a] text-white font-semibold text-[15px] py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="!selfiePreview"
          @click="startSearch"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          Buscar mis fotos con IA
        </button>
      </div>
    </div>

    <!-- ── SEARCHING ───────────────────────────────────────────────────────────── -->
    <div v-else-if="step === 'searching'" class="flex flex-col items-center justify-center py-32 px-5">
      <div class="text-center max-w-xs">
        <!-- Animated avatar -->
        <div class="relative w-20 h-20 mx-auto mb-6">
          <div class="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet/30 to-violet-deep/50 border border-violet/30 flex items-center justify-center overflow-hidden">
            <img v-if="selfiePreview" :src="selfiePreview" alt="" class="w-full h-full object-cover" />
            <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(124,58,237,0.6)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <!-- Pulse ring -->
          <div class="absolute inset-0 rounded-2xl border-2 border-violet/40 animate-ping opacity-50" />
        </div>

        <div class="font-display font-bold text-[18px] text-white mb-2">Buscando tus fotos...</div>
        <p class="text-[13px] text-muted mb-5">La IA está analizando {{ event ? event.total_photos?.toLocaleString('es-PE') ?? '' : '' }} fotos del evento.</p>

        <div class="flex flex-col gap-2 text-[12px] text-white/30">
          <div v-for="(msg, i) in searchingMessages" :key="msg" class="flex items-center gap-2 justify-center" :style="`animation-delay: ${i * 0.8}s`">
            <span class="w-1 h-1 rounded-full bg-violet/40" />
            {{ msg }}
          </div>
        </div>
      </div>
    </div>

    <!-- ── RESULTS ─────────────────────────────────────────────────────────────── -->
    <template v-else-if="step === 'results'">
      <!-- Breadcrumb -->
      <nav class="px-5 lg:px-12 pt-5">
        <div class="flex items-center gap-2 text-[12px] text-white/25">
          <NuxtLink to="/" class="hover:text-white/50 transition-colors">Inicio</NuxtLink>
          <span>/</span>
          <NuxtLink v-if="event" :to="`/events/${event.slug}`" class="hover:text-white/50 transition-colors truncate max-w-[180px]">{{ event.name }}</NuxtLink>
          <NuxtLink v-else to="/events" class="hover:text-white/50 transition-colors">Eventos</NuxtLink>
          <span>/</span>
          <span class="text-white/50">Tus fotos</span>
        </div>
      </nav>

      <!-- Results header -->
      <header class="px-5 lg:px-12 pt-5 pb-6 relative overflow-hidden">
        <div
          class="absolute top-0 left-0 w-[500px] h-[260px] rounded-full blur-[120px] pointer-events-none -translate-x-1/4"
          :class="resultVariant === 'success' ? 'bg-green-500/5' : resultVariant === 'partial' ? 'bg-amber-500/5' : 'bg-red-500/5'"
        />

        <div class="relative z-10">
          <!-- Empty state -->
          <template v-if="resultVariant === 'empty'">
            <div class="flex flex-col items-center justify-center py-8 text-center max-w-sm mx-auto">
              <div class="relative w-20 h-20 mx-auto mb-5">
                <div class="w-20 h-20 rounded-2xl bg-violet/15 border border-violet/25 flex items-center justify-center overflow-hidden">
                  <img v-if="selfiePreview" :src="selfiePreview" alt="" class="w-full h-full object-cover" />
                  <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(124,58,237,0.5)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div class="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-red-400/20 border-2 border-night flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </div>
              </div>
              <h1 class="font-display font-bold text-[20px] text-white mb-2 tracking-tight">No encontramos tus fotos</h1>
              <p class="text-[13px] text-muted leading-relaxed">La IA revisó las fotos del evento pero no encontró coincidencias con tu selfie.</p>
            </div>
          </template>

          <!-- Found / Partial banner -->
          <template v-else>
            <div
              class="rounded-2xl px-5 py-4 flex items-center gap-4 mb-5 border"
              :class="resultVariant === 'success'
                ? 'bg-green-500/10 border-green-500/20'
                : 'bg-amber-500/10 border-amber-500/25'"
            >
              <!-- Selfie avatar -->
              <div class="relative flex-shrink-0">
                <div
                  class="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden border-2"
                  :class="resultVariant === 'success' ? 'bg-green-500/20 border-green-400/40' : 'bg-amber-500/20 border-amber-400/40'"
                >
                  <img v-if="selfiePreview" :src="selfiePreview" alt="Selfie" class="w-full h-full object-cover" />
                  <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <div
                  class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-night"
                  :class="resultVariant === 'success' ? 'bg-green-500' : 'bg-amber-500'"
                >
                  <svg v-if="resultVariant === 'success'" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4M12 17h.01"/></svg>
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 flex-wrap mb-1">
                  <h1 class="font-display font-bold text-[16px] sm:text-[18px] text-white tracking-tight">
                    {{ resultVariant === 'success' ? `¡Encontramos ${matchesFound} foto${matchesFound > 1 ? 's' : ''} tuya${matchesFound > 1 ? 's' : ''}!` : `Encontramos ${matchesFound} foto${matchesFound > 1 ? 's' : ''} tuya${matchesFound > 1 ? 's' : ''}` }}
                  </h1>
                  <span
                    class="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full border"
                    :class="resultVariant === 'success' ? 'bg-green-500/15 border-green-500/25 text-green-400' : 'bg-amber-500/15 border-amber-500/25 text-amber-400'"
                  >
                    <span class="w-1.5 h-1.5 rounded-full animate-pulse-dot inline-block" :class="resultVariant === 'success' ? 'bg-green-400' : 'bg-amber-400'" />
                    IA · {{ confidenceLabel }}
                  </span>
                </div>
                <p class="text-[12px] text-white/40">
                  {{ event?.name }}{{ event?.name ? ' · ' : '' }}{{ formattedSearchDate }}
                </p>
              </div>

              <button
                class="hidden sm:flex flex-shrink-0 items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 border border-border hover:border-white/20 rounded-xl px-3 py-2 transition-all whitespace-nowrap"
                @click="resetSearch"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Nueva búsqueda
              </button>
            </div>

            <!-- Partial tip card -->
            <div v-if="resultVariant === 'partial'" class="bg-night-2 border border-border rounded-xl px-4 py-3.5 flex items-start gap-3 mb-2">
              <div class="w-8 h-8 rounded-lg bg-violet/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
              </div>
              <div>
                <div class="text-[13px] font-semibold text-white mb-1.5">¿Faltan fotos?</div>
                <div class="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-white/45">
                  <span class="flex items-center gap-1.5"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Usa selfie de frente y bien iluminada</span>
                  <span class="flex items-center gap-1.5"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Sin gafas de sol ni gorra</span>
                  <span>
                    <button class="text-violet hover:underline" @click="resetSearch">Reintentar con otra foto →</button>
                  </span>
                </div>
              </div>
            </div>
          </template>
        </div>
      </header>

      <!-- Empty state: actions -->
      <section v-if="resultVariant === 'empty'" class="px-5 lg:px-12 pb-20">
        <div class="max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-5">
          <!-- Retry -->
          <div class="bg-night-2 border border-border rounded-2xl p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-violet/15 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </div>
              <div class="text-[14px] font-semibold text-white">Reintentar con otra selfie</div>
            </div>
            <ul class="flex flex-col gap-2 text-[12px] text-white/50 mb-4">
              <li class="flex items-start gap-1.5"><span class="text-violet">→</span>Cara bien iluminada y de frente</li>
              <li class="flex items-start gap-1.5"><span class="text-violet">→</span>Sin gafas de sol ni gorra</li>
              <li class="flex items-start gap-1.5"><span class="text-violet">→</span>Fondo sin mucho ruido visual</li>
            </ul>
            <button class="w-full bg-violet hover:bg-violet-deep text-white font-semibold py-2.5 rounded-xl text-[13px] transition-colors" @click="resetSearch">
              Subir nueva selfie →
            </button>
          </div>
          <!-- Browse event -->
          <div v-if="event" class="bg-night-2 border border-border rounded-2xl p-5">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-10 h-10 rounded-xl bg-violet/15 flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
              <div class="text-[14px] font-semibold text-white">Explorar la galería completa</div>
            </div>
            <p class="text-[12px] text-white/50 mb-4 leading-relaxed">Busca manualmente entre todas las fotos del evento y selecciona las tuyas.</p>
            <NuxtLink :to="`/events/${event.slug}`" class="block w-full text-center border border-border hover:border-violet/40 text-white/60 hover:text-white py-2.5 rounded-xl text-[13px] transition-colors">
              Ver todas las fotos →
            </NuxtLink>
          </div>
        </div>
      </section>

      <!-- Found / Partial: gallery + pricing -->
      <section v-else class="px-5 lg:px-12 pb-40 lg:pb-20">
        <div class="flex flex-col lg:flex-row gap-6 lg:items-start">

          <!-- LEFT: gallery -->
          <div class="w-full lg:flex-1">
            <!-- Gallery header -->
            <div class="flex items-center justify-between mb-4 gap-3">
              <div>
                <div class="text-[11px] font-semibold tracking-[3px] uppercase mb-1" :class="resultVariant === 'success' ? 'text-violet' : 'text-amber-400'">Tus fotos</div>
                <div class="font-display font-bold text-[18px] sm:text-[22px] tracking-tight text-white">{{ matchesFound }} foto{{ matchesFound > 1 ? 's' : '' }} encontrada{{ matchesFound > 1 ? 's' : '' }}</div>
              </div>
              <button
                v-if="auth.isAuthenticated && searchResults.length > 1"
                class="hidden sm:flex items-center gap-1.5 text-[12px] font-medium text-white/40 hover:text-white border border-border hover:border-white/20 rounded-lg px-3 py-2 transition-all"
                @click="toggleSelectAll"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><polyline points="9 11 12 14 22 4"/></svg>
                {{ allSelected ? 'Deseleccionar todas' : 'Seleccionar todas' }}
              </button>
            </div>

            <!-- Photo grid -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div
                v-for="(result, resultIndex) in searchResults"
                :key="result.photo_id"
                class="rounded-xl overflow-hidden border group relative transition-all duration-200 select-none"
                :class="[
                  result.already_purchased ? 'border-green-500/30 cursor-default' : 'cursor-pointer',
                  !result.already_purchased && result.photo_id !== undefined && cart.has(result.photo_id) ? 'border-violet shadow-[0_0_0_2px_rgba(124,58,237,0.35)]' : '',
                  !result.already_purchased && !(result.photo_id !== undefined && cart.has(result.photo_id)) ? 'border-border hover:border-violet/40' : '',
                ]"
                @click="handleResultClick(result)"
              >
                <div class="aspect-[3/4] bg-night-2 relative flex items-center justify-center">
                  <img
                    v-if="result.thumbnail_url"
                    :src="result.thumbnail_url"
                    :alt="`Foto ${resultIndex + 1}`"
                    class="w-full h-full object-cover"
                  />
                  <svg v-else width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" opacity="0.15">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>

                  <!-- FOTIFY watermark -->
                  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span class="font-display text-white/[0.07] text-[13px] font-bold -rotate-[30deg] select-none tracking-[6px]">FOTIFY</span>
                  </div>

                  <!-- "Tu foto" badge -->
                  <div class="absolute top-2 left-2 flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wide px-2 py-1 rounded-full z-10">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Tu foto
                  </div>

                  <!-- Confidence dot -->
                  <div
                    v-if="result.similarity_score"
                    class="absolute top-2 right-2 w-2 h-2 rounded-full z-10"
                    :class="(result.similarity_score ?? 0) >= 0.9 ? 'bg-green-400' : (result.similarity_score ?? 0) >= 0.8 ? 'bg-amber-400' : 'bg-orange-400'"
                  />

                  <!-- Already purchased badge -->
                  <div v-if="result.already_purchased" class="absolute inset-0 bg-night/40 flex items-center justify-center z-10">
                    <div class="bg-green-500/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      Ya comprado
                    </div>
                  </div>

                  <!-- Selected check badge -->
                  <div v-if="!result.already_purchased && result.photo_id !== undefined && cart.has(result.photo_id)" class="absolute top-2.5 left-8 w-6 h-6 rounded-full bg-violet border-2 border-white flex items-center justify-center z-20">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>

                  <!-- Hover action -->
                  <div v-if="!result.already_purchased" class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-end p-3 z-10">
                    <div class="w-full bg-coral/90 backdrop-blur-sm text-white text-[11px] font-semibold py-2 rounded-lg text-center translate-y-1 group-hover:translate-y-0 transition-transform duration-200">
                      {{ result.photo_id !== undefined && cart.has(result.photo_id) ? 'Quitar selección' : 'Seleccionar' }}
                    </div>
                  </div>
                </div>

                <div class="px-3 py-2 bg-night-2 flex items-center justify-between">
                  <div class="text-[10px] text-white/30">#{{ String(resultIndex + 1).padStart(3, '0') }}</div>
                  <div v-if="result.price" class="text-[12px] font-medium text-white">{{ currency }} {{ result.price }}</div>
                </div>
              </div>
            </div>

            <!-- Mobile: re-search link -->
            <div class="mt-5 sm:hidden flex justify-center">
              <button class="flex items-center gap-1.5 text-[12px] text-white/30 hover:text-white/60 transition-colors" @click="resetSearch">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Nueva búsqueda
              </button>
            </div>
          </div>

          <!-- RIGHT: Pricing panel -->
          <div v-if="hasPricing" class="hidden lg:block w-[280px] flex-shrink-0 sticky top-[84px]">
            <div class="bg-night-2 border border-border rounded-2xl overflow-hidden">
              <div class="px-5 pt-5 pb-3 border-b border-border">
                <div class="text-[11px] font-semibold tracking-[2px] uppercase text-violet mb-1">Precios</div>
                <div class="font-display font-bold text-[16px] text-white tracking-tight">Elige tu pack</div>
                <p class="text-[11px] text-muted mt-1.5">
                  {{ cart.count === 0 ? 'Selecciona fotos para ver tu precio.' : `${cart.count} foto${cart.count > 1 ? 's' : ''} seleccionada${cart.count > 1 ? 's' : ''}` }}
                </p>
              </div>

              <div class="p-4 flex flex-col gap-2.5">
                <div v-if="event?.photo_price" class="border border-border rounded-xl p-3.5 flex items-center gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="text-[13px] font-semibold text-white">1 foto</div>
                    <div class="text-[11px] text-muted mt-0.5">precio por unidad</div>
                  </div>
                  <div class="font-display font-bold text-[15px] text-white">{{ currency }} {{ event.photo_price }}</div>
                </div>
                <div v-if="event?.pack_size && event?.pack_price" class="border border-border rounded-xl p-3.5 flex items-center gap-3">
                  <div class="flex-1 min-w-0">
                    <div class="text-[13px] font-semibold text-white">Pack {{ event.pack_size }}</div>
                    <div class="text-[11px] text-green-400/70 mt-0.5">ahorras {{ currency }} {{ packSaving }}</div>
                  </div>
                  <div class="text-right">
                    <div class="font-display font-bold text-[15px] text-white">{{ currency }} {{ event.pack_price }}</div>
                    <div class="text-[10px] text-white/25 line-through">{{ currency }} {{ packOriginalPrice }}</div>
                  </div>
                </div>
                <div v-if="event?.full_event_price" class="border border-coral/30 bg-coral/5 rounded-xl p-3.5 flex items-center gap-3 relative mt-1">
                  <div class="absolute -top-2.5 left-3 bg-coral text-white text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full">Mejor valor</div>
                  <div class="flex-1 min-w-0">
                    <div class="text-[13px] font-semibold text-white">Todas las mías</div>
                    <div class="text-[11px] text-muted mt-0.5">fotos del evento</div>
                  </div>
                  <div class="font-display font-bold text-[15px] text-white">{{ currency }} {{ event.full_event_price }}</div>
                </div>
              </div>

              <div class="px-4 pb-5 flex flex-col gap-2">
                <NuxtLink
                  v-if="cart.hasPhotos"
                  :to="`/checkout${eventSlugBack ? `?event_slug=${eventSlugBack}` : ''}`"
                  class="w-full bg-coral hover:bg-[#e62d5a] text-white font-semibold text-[14px] py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  Comprar {{ cart.count }} foto{{ cart.count > 1 ? 's' : '' }} · {{ currency }} {{ cartTotal }}
                </NuxtLink>
                <button
                  v-else
                  class="w-full bg-coral/40 text-white/50 font-semibold text-[14px] py-3.5 rounded-xl cursor-not-allowed"
                  disabled
                >
                  Selecciona fotos primero
                </button>
                <p class="text-[10px] text-white/20 text-center">Descarga HD instantánea · Sin marca de agua</p>
              </div>

              <div class="border-t border-border px-5 py-3">
                <button class="flex items-center gap-2 text-[12px] text-white/25 hover:text-white/50 transition-colors" @click="resetSearch">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                  ¿No ves todas tus fotos? Buscar de nuevo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Mobile sticky cart bar -->
      <Transition name="slide-up">
        <div v-if="cart.hasPhotos && resultVariant !== 'empty'" class="lg:hidden fixed bottom-0 left-0 right-0 z-50">
          <div class="bg-night-2/95 backdrop-blur-xl border-t border-border px-4 py-3 pb-[max(12px,env(safe-area-inset-bottom))] flex items-center gap-3">
            <div class="flex-1 min-w-0">
              <div class="text-[13px] font-semibold text-white">{{ cart.count }} foto{{ cart.count > 1 ? 's' : '' }} seleccionada{{ cart.count > 1 ? 's' : '' }}</div>
              <div class="text-[11px] text-white/40">{{ currency }} {{ cartTotal }}</div>
            </div>
            <NuxtLink
              :to="`/checkout${eventSlugBack ? `?event_slug=${eventSlugBack}` : ''}`"
              class="flex-shrink-0 bg-coral hover:bg-[#e62d5a] text-white font-semibold text-[14px] px-6 py-3 rounded-xl flex items-center gap-2 transition-colors"
            >
              Ir al pago
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </template>

  </div>
</template>

<script setup lang="ts">
import type { EventResponse, InitSearchResponse, SearchResponse, SearchResultResponse, SingleEnvelope } from '~/types'

type SearchStep = 'auth-gate' | 'consent' | 'upload' | 'searching' | 'results'

const route = useRoute()
const config = useRuntimeConfig()
const auth = useAuthStore()
const cart = useCartStore()
const showAuth = useAuthModal()

// ── Query params ─────────────────────────────────────────────────────────────
const eventId = computed(() => route.query.event_id ? Number(route.query.event_id) : undefined)
const eventSlugBack = computed(() => route.query.event_slug as string | undefined)

// ── Page step ────────────────────────────────────────────────────────────────
const step = ref<SearchStep>('auth-gate')

// ── Event data (optional context) ────────────────────────────────────────────
const event = ref<EventResponse | null>(null)

async function fetchEvent() {
  if (!eventId.value) return
  try {
    const res = await $fetch<SingleEnvelope<EventResponse>>(
      `${config.public.apiBase}/events/${eventId.value}`,
      auth.tokens.access ? { headers: { Authorization: `Bearer ${auth.tokens.access}` } } : {},
    )
    event.value = res.data ?? null
  }
  catch { /* event context is optional — fail silently */ }
}

// ── Consent ──────────────────────────────────────────────────────────────────
const consentLoading = ref(false)
const consentError = ref<string | null>(null)

async function acceptConsent() {
  consentLoading.value = true
  consentError.value = null
  try {
    await $fetch(`${config.public.apiBase}/search/consent`, {
      method: 'POST',
      body: { accepted: true },
      headers: { Authorization: `Bearer ${auth.tokens.access}` },
    })
    localStorage.setItem('fotify_consented', 'true')
    step.value = 'upload'
  }
  catch {
    consentError.value = 'Error al registrar consentimiento. Intenta de nuevo.'
  }
  finally {
    consentLoading.value = false
  }
}

function declineConsent() {
  if (event.value?.slug) navigateTo(`/events/${event.value.slug}`)
  else navigateTo('/events')
}

// ── File upload ───────────────────────────────────────────────────────────────
const fileInputRef = ref<HTMLInputElement | null>(null)
const selfieFile = ref<File | null>(null)
const selfiePreview = ref<string | null>(null)
const selfieFileName = ref('')
const uploadError = ref<string | null>(null)

function triggerFileInput() {
  fileInputRef.value?.click()
}

function onFileSelect(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    uploadError.value = 'Por favor sube una imagen válida (JPG o PNG).'
    return
  }
  if (file.size > 10 * 1024 * 1024) {
    uploadError.value = 'La imagen es demasiado grande. Máximo 10 MB.'
    return
  }
  selfieFile.value = file
  selfieFileName.value = file.name
  selfiePreview.value = URL.createObjectURL(file)
  uploadError.value = null
}

function clearSelfie() {
  selfieFile.value = null
  selfiePreview.value = null
  selfieFileName.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
}

// ── Search flow ───────────────────────────────────────────────────────────────
const searchResults = ref<SearchResultResponse[]>([])
const matchesFound = ref(0)
const searchDate = ref(new Date())

async function startSearch() {
  if (!selfieFile.value) return
  step.value = 'searching'
  uploadError.value = null

  try {
    // 1. Get S3 presigned URL
    const initRes = await $fetch<{ data: InitSearchResponse }>(
      `${config.public.apiBase}/search/init`,
      {
        method: 'POST',
        body: { event_id: eventId.value },
        headers: { Authorization: `Bearer ${auth.tokens.access}` },
      },
    )
    const initData = initRes.data
    if (!initData?.upload_url || !initData?.session_id) throw new Error('init_failed')

    // 2. Upload selfie directly to S3 (no auth header — presigned URL handles it)
    await $fetch(initData.upload_url, {
      method: 'PUT',
      body: selfieFile.value,
      headers: { 'Content-Type': selfieFile.value.type },
    })

    // 3. Execute facial search
    const searchRes = await $fetch<{ data: SearchResponse }>(
      `${config.public.apiBase}/search/execute`,
      {
        method: 'POST',
        body: { session_id: initData.session_id },
        headers: { Authorization: `Bearer ${auth.tokens.access}` },
      },
    )

    searchResults.value = searchRes.data?.results ?? []
    matchesFound.value = searchRes.data?.matches_found ?? 0
    searchDate.value = new Date()

    // Sync session and event to cart
    cart.setSession(initData.session_id)
    if (eventId.value) cart.setEvent(eventId.value)

    step.value = 'results'
  }
  catch {
    step.value = 'upload'
    uploadError.value = 'Error durante la búsqueda. Verifica tu conexión e intenta de nuevo.'
  }
}

function resetSearch() {
  clearSelfie()
  searchResults.value = []
  matchesFound.value = 0
  cart.clear()
  step.value = 'upload'
}

// ── Result helpers ────────────────────────────────────────────────────────────
const avgConfidence = computed(() => {
  if (!searchResults.value.length) return 0
  const sum = searchResults.value.reduce((acc, r) => acc + (r.similarity_score ?? 0), 0)
  return sum / searchResults.value.length
})

const resultVariant = computed((): 'success' | 'partial' | 'empty' => {
  if (matchesFound.value === 0) return 'empty'
  if (avgConfidence.value < 0.85) return 'partial'
  return 'success'
})

const confidenceLabel = computed(() => {
  const pct = Math.round(avgConfidence.value * 100)
  return `${pct}% confianza`
})

const formattedSearchDate = computed(() =>
  searchDate.value.toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' }),
)

// ── Cart / selection ──────────────────────────────────────────────────────────
const currency = computed(() => event.value?.currency ?? 'S/')

const allSelected = computed(() => {
  const eligible = searchResults.value.filter(r => !r.already_purchased && r.photo_id !== undefined)
  return eligible.length > 0 && eligible.every(r => cart.has(r.photo_id!))
})

function handleResultClick(result: SearchResultResponse) {
  if (result.already_purchased || result.photo_id === undefined) return
  if (eventId.value) cart.setEvent(eventId.value)
  cart.toggle(result.photo_id)
}

function toggleSelectAll() {
  const eligible = searchResults.value.filter(r => !r.already_purchased && r.photo_id !== undefined)
  if (allSelected.value) {
    eligible.forEach(r => { if (r.photo_id !== undefined) cart.toggle(r.photo_id) })
  }
  else {
    if (eventId.value) cart.setEvent(eventId.value)
    eligible.forEach(r => { if (r.photo_id !== undefined && !cart.has(r.photo_id)) cart.toggle(r.photo_id) })
  }
}

// ── Pricing ───────────────────────────────────────────────────────────────────
const hasPricing = computed(() =>
  !!(event.value?.photo_price || searchResults.value.some(r => r.price)),
)

const packOriginalPrice = computed(() => {
  if (!event.value?.pack_size || !event.value?.photo_price) return 0
  return event.value.pack_size * event.value.photo_price
})

const packSaving = computed(() => {
  if (!event.value?.pack_price) return 0
  return packOriginalPrice.value - event.value.pack_price
})

const cartTotal = computed(() => {
  if (!cart.count) return '0.00'
  const perPhoto = event.value?.photo_price ?? searchResults.value[0]?.price ?? 0
  return (cart.count * perPhoto).toFixed(2)
})

// ── Static content ────────────────────────────────────────────────────────────
const selfieTips = [
  { icon: '☀️', label: 'Buena iluminación' },
  { icon: '😊', label: 'Cara de frente' },
  { icon: '🚫', label: 'Sin gafas de sol' },
]

const searchingMessages = [
  'Analizando rasgos faciales...',
  'Comparando con las fotos del evento...',
  'Calculando similitud...',
]

// ── Init ──────────────────────────────────────────────────────────────────────
onMounted(async () => {
  await fetchEvent()

  if (!auth.isAuthenticated) {
    step.value = 'auth-gate'
    return
  }

  const hasConsented = localStorage.getItem('fotify_consented') === 'true'
  step.value = hasConsented ? 'upload' : 'consent'
})

// React to login while on page (auth modal closed after login)
watch(() => auth.isAuthenticated, async (val) => {
  if (val && step.value === 'auth-gate') {
    const hasConsented = localStorage.getItem('fotify_consented') === 'true'
    step.value = hasConsented ? 'upload' : 'consent'
  }
})

useSeoMeta({
  title: event.value ? `Buscar mis fotos — ${event.value.name} · Fotify` : 'Buscar mis fotos con IA — Fotify',
  description: 'Encuentra tus fotos del evento usando reconocimiento facial. Sube una selfie y la IA te encuentra en segundos.',
})
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); }
</style>
