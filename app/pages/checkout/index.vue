<template>
  <div class="flex flex-col lg:flex-row gap-8 lg:items-start">

    <!-- ── LEFT: Photo detail / Payment form ──────────────────────────────── -->
    <div class="w-full lg:flex-1 order-2 lg:order-1">

      <!-- Validating skeleton -->
      <div v-if="ck.isValidating.value" class="flex items-center justify-center py-16">
        <svg class="animate-spin text-violet/40" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
        <span class="ml-3 text-[13px] text-white/40">Verificando disponibilidad...</span>
      </div>

      <template v-else>

        <!-- Mobile order summary -->
        <div v-if="cart.hasPhotos" class="lg:hidden mb-6 bg-night-2 border border-border rounded-2xl overflow-hidden">
          <div class="px-4 py-3 border-b border-border flex items-center justify-between">
            <span class="text-[12px] font-semibold text-white/50">Tu pedido</span>
            <span class="font-display font-bold text-[16px] text-white">{{ ck.formattedTotal.value }}</span>
          </div>
          <div class="px-4 py-3">
            <div class="text-[12px] text-white/40 mb-1">
              {{ cart.count }} foto{{ cart.count !== 1 ? 's' : '' }} seleccionada{{ cart.count !== 1 ? 's' : '' }}<span v-if="ck.event.value"> · {{ ck.event.value.name }}</span>
            </div>
          </div>
        </div>

        <!-- ── CARD FORM (Izipay Krypton) ─────────────────────────────────── -->
        <div v-if="ck.step.value === 'payment-form'" class="max-w-md">
          <button
            class="flex items-center gap-1.5 text-[12px] text-white/40 hover:text-violet transition-colors mb-4"
            @click="backToDetail"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Volver al detalle
          </button>
          <div class="mb-4">
            <h2 class="font-display font-bold text-[17px] text-white tracking-tight mb-1">Datos de tarjeta</h2>
            <p class="text-[12px] text-white/35">Completa los datos para finalizar tu compra.</p>
          </div>

          <div class="space-y-3">
            <div class="kr-embedded" v-bind="krPublicKey ? {'kr-public-key': krPublicKey} : {}" style="display:contents">
              <!-- Card number -->
              <div>
                <p class="text-[11px] text-white/40 mb-1.5 font-medium">Número de tarjeta</p>
                <div class="bg-night-2 border border-border rounded-xl px-4 py-3.25 transition-colors focus-within:border-violet/60 focus-within:shadow-[0_0_0_3px_rgba(124,58,237,0.10)]">
                  <div class="kr-pan"></div>
                </div>
              </div>
              <!-- Expiry + CVV -->
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <p class="text-[11px] text-white/40 mb-1.5 font-medium">Vencimiento</p>
                  <div class="bg-night-2 border border-border rounded-xl px-4 py-3.25 transition-colors focus-within:border-violet/60">
                    <div class="kr-expiry"></div>
                  </div>
                </div>
                <div>
                  <p class="text-[11px] text-white/40 mb-1.5 font-medium">CVV</p>
                  <div class="bg-night-2 border border-border rounded-xl px-4 py-3.25 transition-colors focus-within:border-violet/60">
                    <div class="kr-security-code"></div>
                  </div>
                </div>
              </div>
              <!-- Cardholder name -->
              <div>
                <p class="text-[11px] text-white/40 mb-1.5 font-medium">Nombre del titular</p>
                <div class="bg-night-2 border border-border rounded-xl px-4 py-3.25 transition-colors focus-within:border-violet/60">
                  <div class="kr-card-holder-name"></div>
                </div>
              </div>
            </div>
            <!-- Security note -->
            <div class="flex items-center gap-2 pt-1">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.5)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <p class="text-[11px] text-white/25">Cifrado TLS 1.3 · Nunca almacenamos datos de tu tarjeta</p>
            </div>
          </div>

          <!-- Card submit (mobile) -->
          <div class="lg:hidden mt-6">
            <p v-if="krError" class="text-[13px] text-coral text-center mb-3">{{ krError }}</p>
            <button
              :disabled="krSubmitting"
              class="w-full bg-coral hover:bg-[#e62d5a] text-white font-bold text-[16px] py-4 rounded-2xl transition-colors flex items-center justify-center gap-3 shadow-lg shadow-coral/25 active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed"
              @click="handleCardSubmit"
            >
              <svg v-if="krSubmitting" class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              {{ krSubmitting ? 'Procesando...' : 'Pagar de forma segura' }}
            </button>
          </div>
        </div>

        <!-- ── PHOTO DETAIL GRID (default state) ─────────────────────────── -->
        <template v-else>

          <!-- Section header -->
          <div v-if="cart.hasPhotos" class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div>
              <h2 class="font-display font-bold text-[17px] text-white tracking-tight mb-1">Detalle de tu compra</h2>
              <p class="text-[12px] text-white/35">
                {{ cart.count }} foto{{ cart.count !== 1 ? 's' : '' }} seleccionada{{ cart.count !== 1 ? 's' : '' }}
                <span v-if="ck.event.value"> · {{ ck.event.value.name }}</span>
              </p>
            </div>
            <div class="flex items-center gap-4">
              <NuxtLink
                v-if="ck.backLink.value"
                :to="ck.backLink.value"
                class="flex items-center gap-1.5 text-[12px] text-white/35 hover:text-violet transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M19 12H5M12 5l-7 7 7 7"/>
                </svg>
                Cambiar selección
              </NuxtLink>
              <button
                v-if="cart.count > 0"
                class="flex items-center gap-1.5 text-[12px] text-white/35 hover:text-coral transition-colors"
                @click="cart.clear()"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Vaciar carrito
              </button>
            </div>
          </div>

          <!-- Photo grid -->
          <div v-if="cart.hasPhotos" class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
            <div
              v-for="photo in cart.photos"
              :key="photo.id"
              class="aspect-[3/4] rounded-xl border border-border bg-night overflow-hidden relative group"
            >
              <img
                v-if="photo.thumbnailUrl"
                :src="photo.thumbnailUrl"
                :alt="`Foto ${photo.id}`"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center bg-night-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
                </svg>
              </div>
              <!-- Remove button -->
              <button
                class="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-night/80 border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                @click="cart.toggle(photo)"
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
              <!-- Photo ID badge -->
              <span class="absolute bottom-1 left-1.5 bg-black/50 rounded px-1 py-px text-[8px] leading-none font-medium text-white/60">#{{ photo.id }}</span>
            </div>
          </div>

          <!-- Unavailable photos (CART-02) -->
          <template v-if="ck.unavailablePhotos.value.length > 0">
            <div class="bg-night-2 border border-coral/20 rounded-2xl p-5 mb-6">
              <div class="flex items-center gap-2 mb-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,70,100,0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
                <span class="text-[13px] font-semibold text-coral/80">
                  {{ ck.unavailablePhotos.value.length }} foto{{ ck.unavailablePhotos.value.length !== 1 ? 's' : '' }} no disponible{{ ck.unavailablePhotos.value.length !== 1 ? 's' : '' }}
                </span>
              </div>
              <p class="text-[12px] text-white/35 mb-4">
                {{ cart.hasPhotos
                  ? 'Estas fotos fueron eliminadas o ya no están disponibles. Descártalas para continuar.'
                  : 'Todas las fotos de tu carrito ya no están disponibles.' }}
              </p>
              <div class="grid grid-cols-5 sm:grid-cols-6 gap-2 mb-4">
                <div
                  v-for="photo in ck.unavailablePhotos.value"
                  :key="photo.id"
                  class="aspect-[3/4] rounded-lg border border-coral/20 bg-night overflow-hidden relative opacity-40"
                >
                  <img v-if="photo.thumbnailUrl" :src="photo.thumbnailUrl" :alt="`Foto ${photo.id}`" class="w-full h-full object-cover grayscale" />
                  <div class="absolute inset-0 flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,70,100,0.8)" stroke-width="2.5" stroke-linecap="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </div>
                </div>
              </div>
              <button
                v-if="cart.hasPhotos"
                class="text-[12px] text-coral/70 hover:text-coral font-medium transition-colors"
                @click="ck.dismissUnavailable()"
              >
                Entendido
              </button>
              <NuxtLink
                v-else
                :to="ck.backLink.value"
                class="inline-flex items-center gap-1.5 text-[12px] text-coral/70 hover:text-coral font-medium transition-colors"
              >
                Entendido, volver al evento →
              </NuxtLink>
            </div>
          </template>

          <!-- Mobile: terms + pay -->
          <div v-if="cart.hasPhotos" class="lg:hidden">
            <!-- Terms -->
            <label class="flex items-start gap-3 cursor-pointer mb-5 group">
              <div class="flex-shrink-0 mt-0.5">
                <input v-model="termsAccepted" type="checkbox" class="sr-only" />
                <div :class="['w-5 h-5 rounded-[5px] border bg-night-2 flex items-center justify-center transition-all group-hover:border-violet/50', termsAccepted ? 'bg-violet border-violet' : 'border-border']">
                  <svg v-if="termsAccepted" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
              </div>
              <span class="text-[12px] text-white/35 leading-relaxed">
                Acepto los <NuxtLink to="/legal?tab=terminos" class="text-violet hover:text-white transition-colors underline underline-offset-2" @click.stop>Términos de uso</NuxtLink> y la <NuxtLink to="/legal?tab=privacidad" class="text-violet hover:text-white transition-colors underline underline-offset-2" @click.stop>Política de privacidad</NuxtLink> de Fotify. Entiendo que la compra es de contenido digital con descarga inmediata y no admite devoluciones.
              </span>
            </label>

            <p v-if="orderError" class="text-[13px] text-coral text-center mb-4">{{ orderError }}</p>

            <button
              :disabled="!termsAccepted || ck.step.value === 'processing' || ck.unavailablePhotos.value.length > 0 || cart.count === 0"
              class="w-full bg-coral hover:bg-[#e62d5a] text-white font-bold text-[16px] py-4 rounded-2xl transition-colors flex items-center justify-center gap-3 shadow-lg shadow-coral/25 active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed"
              @click="handlePay"
            >
              <svg v-if="ck.step.value === 'processing'" class="animate-spin flex-shrink-0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              {{ payLabel }}
            </button>
            <p class="text-[11px] text-white/20 text-center mt-3">Procesado por Izipay · Datos encriptados TLS 1.3</p>
          </div>

        </template>

      </template>
    </div><!-- /LEFT -->

    <!-- ── RIGHT: Order summary (sticky, desktop) ─────────────────────────── -->
    <div v-if="cart.hasPhotos" class="w-full lg:w-[360px] flex-shrink-0 order-1 lg:order-2 hidden lg:block sticky top-20">
      <div class="bg-night-2 border border-border rounded-2xl overflow-hidden">

        <!-- Header -->
        <div class="px-5 pt-5 pb-4 border-b border-border">
          <div class="text-[11px] font-semibold tracking-[2px] uppercase text-violet mb-1">Tu pedido</div>
          <div class="font-display font-bold text-[16px] text-white tracking-tight">
            {{ ck.event.value?.name ?? 'Cargando...' }}
          </div>
          <div v-if="ck.event.value?.event_date" class="text-[12px] text-white/35 mt-0.5 flex items-center gap-1.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            {{ ck.formatDate(ck.event.value.event_date) }}
          </div>
        </div>

        <!-- Pricing -->
        <div class="px-5 py-4 border-t border-border flex flex-col gap-2.5">
          <div class="flex items-center justify-between text-[13px]">
            <span class="text-white/50">
              {{ cart.count }} foto{{ cart.count !== 1 ? 's' : '' }}
              <span v-if="ck.event.value?.photo_price"> × S/ {{ ck.event.value.photo_price }}</span>
            </span>
            <span class="text-white/50">{{ ck.formattedTotal.value }}</span>
          </div>
        </div>

        <!-- Total -->
        <div class="px-5 py-4 border-t border-border">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-[13px] text-white/50 mb-0.5">Total a pagar</div>
              <div class="font-display font-bold text-[28px] text-white tracking-tight leading-none">{{ ck.formattedTotal.value }}</div>
            </div>
            <div class="flex flex-col gap-0.5 text-right">
              <span class="text-[10px] text-white/35 flex items-center gap-1 justify-end">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Descarga HD
              </span>
              <span class="text-[10px] text-white/35 flex items-center gap-1 justify-end">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Sin marca de agua
              </span>
              <span class="text-[10px] text-white/35 flex items-center gap-1 justify-end">
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                Acceso permanente
              </span>
            </div>
          </div>
        </div>

        <!-- Terms + Pay CTA -->
        <div class="px-5 py-4 border-t border-border">
          <!-- Terms checkbox -->
          <label class="flex items-start gap-2.5 cursor-pointer mb-4 group">
            <div class="flex-shrink-0 mt-0.5">
              <input v-model="termsAccepted" type="checkbox" class="sr-only" />
              <div :class="['w-[18px] h-[18px] rounded-[4px] border bg-night-2 flex items-center justify-center transition-all group-hover:border-violet/50', termsAccepted ? 'bg-violet border-violet' : 'border-border']">
                <svg v-if="termsAccepted" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            </div>
            <span class="text-[11px] text-white/35 leading-relaxed">
              Acepto los <NuxtLink to="/legal?tab=terminos" class="text-violet hover:text-white transition-colors underline underline-offset-2" @click.stop>Términos de uso</NuxtLink> y la <NuxtLink to="/legal?tab=privacidad" class="text-violet hover:text-white transition-colors underline underline-offset-2" @click.stop>Política de privacidad</NuxtLink>. Compra digital sin devoluciones.
            </span>
          </label>

          <p v-if="orderError" class="text-[12px] text-coral text-center mb-3">{{ orderError }}</p>

          <!-- Pay button (default) -->
          <button
            v-if="ck.step.value !== 'payment-form'"
            :disabled="!termsAccepted || ck.step.value === 'processing' || ck.unavailablePhotos.value.length > 0 || cart.count === 0"
            class="w-full bg-coral hover:bg-[#e62d5a] text-white font-bold text-[15px] py-4 rounded-2xl transition-colors flex items-center justify-center gap-2.5 shadow-lg shadow-coral/25 active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed"
            @click="handlePay"
          >
            <svg v-if="ck.step.value === 'processing'" class="animate-spin flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            {{ payLabel }}
          </button>

          <!-- Card confirm button -->
          <template v-else>
            <p v-if="krError" class="text-[12px] text-coral text-center mb-2">{{ krError }}</p>
            <button
              :disabled="krSubmitting"
              class="w-full bg-coral hover:bg-[#e62d5a] text-white font-bold text-[15px] py-4 rounded-2xl transition-colors flex items-center justify-center gap-2.5 shadow-lg shadow-coral/25 active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed"
              @click="handleCardSubmit"
            >
              <svg v-if="krSubmitting" class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              {{ krSubmitting ? 'Procesando...' : 'Pagar de forma segura' }}
            </button>
          </template>
        </div>

        <!-- Trust badges -->
        <div class="px-5 py-4 border-t border-border grid grid-cols-3 gap-3">
          <div class="flex items-center gap-1.5 text-[11px] text-white/35">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Pago 100% seguro
          </div>
          <div class="flex items-center gap-1.5 text-[11px] text-white/35">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(124,58,237,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            Descarga inmediata
          </div>
          <div class="flex items-center gap-1.5 text-[11px] text-white/35">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            Acceso permanente
          </div>
        </div>

        <!-- Processor badge -->
        <div class="px-5 pb-4 flex items-center gap-2.5">
          <span class="text-[10px] text-white/20">Procesado por</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="53" height="18" viewBox="0 0 71 24" fill="none" class="opacity-30">
            <path d="M3.88444 6.2428H0.485596V18.7283H3.88444V6.2428Z" fill="white"/>
            <path d="M3.6763 0.624277C3.46821 0.416185 3.26012 0.277456 2.98266 0.138728C2.7052 0 2.42774 0 2.15029 0C1.87283 0 1.59538 0.0693634 1.31792 0.138728C1.04046 0.277456 0.832371 0.416185 0.624279 0.624277C0.416186 0.83237 0.277455 1.04046 0.138726 1.31792C0 1.59538 0 1.87283 0 2.15029C0 2.42774 0.0693621 2.7052 0.138726 2.98266C0.277455 3.26011 0.416186 3.46821 0.624279 3.6763C0.832371 3.88439 1.04046 4.02312 1.31792 4.16185C1.59538 4.30058 1.87283 4.30058 2.15029 4.30058C2.42774 4.30058 2.7052 4.23121 2.98266 4.16185C3.26012 4.02312 3.46821 3.88439 3.6763 3.6763C3.8844 3.46821 4.02312 3.26011 4.16185 2.98266C4.30058 2.7052 4.30058 2.42774 4.30058 2.15029C4.30058 1.87283 4.23121 1.59538 4.16185 1.31792C4.02312 1.04046 3.81503 0.83237 3.6763 0.624277Z" fill="white"/>
            <path d="M23.7226 0.624277C23.5145 0.416185 23.3064 0.277456 23.0289 0.138728C22.7515 0 22.474 0 22.1966 0C21.9191 0 21.6416 0.0693634 21.3642 0.138728C21.0867 0.277456 20.8786 0.416185 20.6705 0.624277C20.4625 0.83237 20.3237 1.04046 20.185 1.31792C20.0463 1.59538 20.0463 1.87283 20.0463 2.15029C20.0463 2.42774 20.1156 2.7052 20.185 2.98266C20.3237 3.26011 20.4625 3.46821 20.6705 3.6763C20.8786 3.88439 21.0867 4.02312 21.3642 4.16185C21.6416 4.30058 21.9191 4.30058 22.1966 4.30058C22.474 4.30058 22.7515 4.23121 23.0289 4.16185C23.3064 4.02312 23.5145 3.88439 23.7226 3.6763C23.9307 3.46821 24.0694 3.26011 24.2081 2.98266C24.3468 2.7052 24.3468 2.42774 24.3468 2.15029C24.3468 1.87283 24.2775 1.59538 24.2081 1.31792C24.0694 1.04046 23.9307 0.83237 23.7226 0.624277Z" fill="white"/>
            <path d="M23.9306 6.2428H20.5317V18.7283H23.9306V6.2428Z" fill="white"/>
            <path d="M38.1503 7.8381C37.5953 7.28319 36.9711 6.79764 36.2081 6.45082C35.4451 6.104 34.6821 5.96527 33.7803 5.96527C32.9479 5.96527 32.1849 6.104 31.5607 6.45082C30.9364 6.79764 30.4508 7.21383 30.0347 7.69938V6.31209H26.7745V24H30.104V17.5491C30.5202 18.0346 31.0058 18.4508 31.63 18.7283C32.2543 19.0057 32.9479 19.1445 33.7803 19.1445C34.6127 19.1445 35.4451 19.0057 36.2081 18.6589C36.9711 18.3121 37.5953 17.8959 38.1503 17.2716C38.7052 16.7167 39.1214 16.0231 39.3988 15.1907C39.6763 14.3583 39.8844 13.526 39.8844 12.5549C39.8844 11.5838 39.7456 10.7514 39.3988 9.91903C39.1214 9.08666 38.7052 8.39302 38.1503 7.8381ZM36.2081 13.8728C36.0693 14.289 35.8612 14.6358 35.5838 14.9826C35.3063 15.2601 34.9595 15.5375 34.5433 15.7456C34.1271 15.9537 33.711 16.0231 33.2254 16.0231C32.7399 16.0231 32.3237 15.9537 31.9075 15.7456C31.4913 15.6069 31.1445 15.3294 30.867 15.052C30.5896 14.7745 30.3815 14.3583 30.2427 13.9422C30.104 13.526 30.0347 13.0404 30.0347 12.5549C30.0347 12.0693 30.104 11.5838 30.2427 11.1676C30.3815 10.7514 30.5896 10.4046 30.867 10.0578C31.1445 9.7803 31.4913 9.50284 31.9075 9.36412C32.3237 9.22539 32.7399 9.08666 33.2254 9.08666C33.711 9.08666 34.1965 9.15602 34.5433 9.36412C34.9595 9.57221 35.3063 9.7803 35.5838 10.1271C35.8612 10.4046 36.0693 10.8208 36.2081 11.2369C36.3468 11.6531 36.4162 12.1387 36.4162 12.5549C36.4162 12.9711 36.3468 13.4566 36.2081 13.8728Z" fill="white"/>
            <path d="M51.5376 7.63004C51.1214 7.14449 50.6358 6.72831 50.0116 6.38148C49.3873 6.03466 48.6936 5.89594 47.7919 5.89594C46.9595 5.89594 46.1272 6.03466 45.3642 6.38148C44.6012 6.72831 43.9769 7.14449 43.422 7.76877C42.8671 8.32368 42.4509 9.01732 42.1734 9.84969C41.896 10.6821 41.6879 11.5144 41.6879 12.4855C41.6879 13.4566 41.8266 14.289 42.1734 15.1214C42.4509 15.9537 42.9364 16.6474 43.422 17.2023C43.9769 17.7572 44.6012 18.2428 45.3642 18.5896C46.1272 18.9364 46.8902 19.0751 47.7919 19.0751C48.6243 19.0751 49.3873 18.9364 50.0116 18.5896C50.6358 18.2428 51.1214 17.8959 51.5376 17.341V18.7283H54.7977V6.24276H51.5376V7.63004ZM51.3988 13.8728C51.2601 14.289 51.052 14.6358 50.7746 14.9826C50.4971 15.2601 50.1503 15.5376 49.7341 15.6763C49.3179 15.815 48.9017 15.9537 48.4162 15.9537C47.9306 15.9537 47.5144 15.8844 47.0983 15.6763C46.6821 15.4682 46.3353 15.2601 46.0578 14.9133C45.7803 14.6358 45.5723 14.2196 45.4335 13.8034C45.2948 13.3873 45.2254 12.9017 45.2254 12.4855C45.2254 12 45.2948 11.5838 45.4335 11.1676C45.5723 10.7514 45.7803 10.4046 46.0578 10.0578C46.3353 9.78033 46.6821 9.50287 47.0983 9.29478C47.5144 9.08669 47.9306 9.01732 48.4162 9.01732C48.9017 9.01732 49.3179 9.08669 49.7341 9.29478C50.1503 9.43351 50.4971 9.71096 50.7746 9.98842C51.052 10.2659 51.2601 10.6821 51.3988 11.0982C51.5376 11.5144 51.6069 12 51.6069 12.4855C51.6069 12.9711 51.5376 13.4566 51.3988 13.8728Z" fill="white"/>
            <path d="M66.9365 6.2428L63.607 12.6937L60.1388 6.2428H56.3237L61.7341 16.0925L57.3642 24H61.0405L70.6128 6.2428H66.9365Z" fill="white"/>
            <path d="M10.5434 15.9538L11.8613 14.7052L10.4047 12.2775L6.52026 15.9538L7.21391 18.7283L17.8266 18.7977L17.133 15.9538H10.5434Z" fill="white"/>
            <path d="M17.8266 9.15607L17.133 6.31213H6.79773L7.56073 9.0867L13.8035 9.15607L12.4856 10.3353L13.8729 12.8324L17.8266 9.15607Z" fill="white"/>
          </svg>
        </div>

      </div>
    </div><!-- /RIGHT -->

  </div>
</template>

<script setup lang="ts">
import { apiFetch } from "~/composables/useApi"
import { useCheckout } from "~/composables/useCheckout"
import type { CreateOrderInput, OrderResponse } from "~/types"

const cart = useCartStore()
const izipay = useIzipay()
const ck = useCheckout()

// Local state
const termsAccepted = ref(false)
const orderError = ref<string | null>(null)
const krSubmitting = ref(false)
const krError = ref<string | null>(null)
const krPublicKey = ref("")

// Computed
const payLabel = computed(() => {
  if (ck.step.value === "processing") return "Preparando pago..."
  return "Pagar de forma segura"
})

onUnmounted(() => {
  izipay.destroy()
})

function backToDetail() {
  izipay.destroy()
  ck.step.value = "detail"
  krPublicKey.value = ""
  krError.value = null
  krSubmitting.value = false
}

// Payment flow — defaults to card
async function handlePay() {
  if (!termsAccepted.value) {
    orderError.value = "Acepta los términos de uso para continuar."
    return
  }

  orderError.value = null
  ck.step.value = "processing"
  ck.successPhotoCount.value = cart.count

  try {
    // Reuse existing order if retrying (avoids creating duplicate orders)
    let oid = ck.orderId.value

    if (!oid) {
      const orderRes = await apiFetch<{ data?: OrderResponse }>("/orders", {
        method: "POST",
        body: {
          event_id: cart.eventId,
          payment_gateway: "izipay",
          photo_ids: [...cart.photoIds],
          ...(cart.searchSessionId ? { search_session_id: cart.searchSessionId } : {}),
          type: cart.orderType,
        } as CreateOrderInput,
      })

      oid = orderRes.data?.id ?? null
      if (!oid) throw new Error("No se recibió un ID de orden válido")
      ck.orderId.value = oid
    }

    // Card flow (default)
    const tokenRes = await apiFetch<{ data?: { form_token: string; public_key: string } }>(
      `/orders/${oid}/payment-token`,
      { method: "POST" },
    )

    if (!tokenRes.data) throw new Error("No se recibió token de pago")
    const { form_token, public_key } = tokenRes.data

    krPublicKey.value = public_key
    ck.step.value = "payment-form"

    await nextTick()
    await izipay.initForm(form_token, public_key)

    izipay.onPaymentResult(async (krAnswer: string, krHash: string) => {
      krSubmitting.value = false
      try {
        await apiFetch(`/orders/${oid}/confirm-payment`, {
          method: "POST",
          body: { kr_answer: krAnswer, kr_hash: krHash },
        })
        ck.persistOrderPhotos(oid, [...cart.photoIds])
        ck.step.value = "success"
        cart.clear()
      } catch (err: unknown) {
        ck.step.value = "failed"
        const e = err as { data?: { error?: string }; message?: string }
        ck.failedError.value = e?.data?.error || e?.message || "Pago no completado."
      }
    })
  } catch (err: unknown) {
    ck.step.value = "failed"
    const e = err as { data?: { error?: string }; message?: string }
    ck.failedError.value = e?.data?.error || e?.message || "Error al procesar el pago."
  }
}

async function handleCardSubmit() {
  krError.value = null
  krSubmitting.value = true
  try {
    await izipay.submit()
    // onPaymentResult callback takes over
  } catch (err: unknown) {
    const e = err as { message?: string }
    krError.value = e?.message || "Revisa los datos de la tarjeta e intenta de nuevo."
    krSubmitting.value = false
  }
}


</script>

<style scoped>

/* ── Krypton injected elements ────────────────────────────────────────── */
:deep(.kr-payment-button) { display: none !important; }

:deep(.kr-installment-count),
:deep(.kr-do-register) {
  width: 100%;
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

:deep(.kr-installment-count select),
:deep(.kr-do-register select) {
  width: 100%;
  background-color: #1A1030;
  border: 1px solid #2A1F4A;
  border-radius: 0.75rem;
  padding: 0.8125rem 2.5rem 0.8125rem 1rem;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-family: "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.25)' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

:deep(.kr-installment-count select:focus),
:deep(.kr-do-register select:focus) {
  border-color: rgba(124, 58, 237, 0.6);
  box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.10);
}

:deep(.kr-installment-count select option),
:deep(.kr-do-register select option) {
  background-color: #1A1030;
  color: white;
}
</style>
