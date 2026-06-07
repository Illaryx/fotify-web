<template>
  <div class="min-h-[70vh]">

    <!-- Loading guard -->
    <div v-if="!auth.isAuthenticated || (!cart.hasPhotos && ck.unavailablePhotos.value.length === 0)" class="flex items-center justify-center py-32">
      <svg class="animate-spin text-violet/40" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
    </div>

    <template v-else>

      <!-- ── SUCCESS OVERLAY ───────────────────────────────────────────────── -->
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="ck.step.value === 'success'" class="fixed inset-0 bg-night/95 backdrop-blur-md z-[300] flex items-center justify-center p-5">
            <div class="bg-night-2 border border-border rounded-3xl p-8 max-w-sm w-full text-center">
              <div class="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-6">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.9)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="font-display font-bold text-[22px] text-white mb-2 tracking-tight">¡Pago exitoso!</div>
              <p class="text-[13px] text-white/40 mb-6 leading-relaxed">
                Tus <strong class="text-white">{{ ck.successPhotoCount.value }} foto{{ ck.successPhotoCount.value !== 1 ? 's' : '' }} en HD</strong> están listas.
                Revisa tu correo <strong class="text-violet">{{ ck.userEmail.value }}</strong> o descarga directamente.
              </p>
              <button
                class="w-full bg-coral hover:bg-[#e62d5a] text-white font-bold text-[15px] py-4 rounded-2xl transition-colors mb-3 flex items-center justify-center gap-2"
                @click="navigateToDownloads"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Descargar mis fotos
              </button>
              <NuxtLink to="/" class="block text-white/30 hover:text-white text-[13px] py-2 transition-colors">
                Volver al inicio
              </NuxtLink>
              <div class="mt-5 pt-4 border-t border-border flex items-center justify-center gap-1.5 text-[11px] text-white/20">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Confirmación enviada a {{ ck.userEmail.value }}
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- ── PROGRESS STEPS ─────────────────────────────────────────────────── -->
      <div v-show="ck.step.value !== 'failed'" class="px-5 md:px-10 lg:px-12 py-5">
        <div class="flex items-center max-w-sm mx-auto lg:mx-0">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-violet flex items-center justify-center flex-shrink-0">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <span class="text-[11px] font-medium text-white/40 hidden sm:block">Seleccionar</span>
          </div>
          <div class="flex-1 h-px bg-violet mx-3"></div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-coral flex items-center justify-center flex-shrink-0 ring-4 ring-coral/20">
              <span class="text-[10px] font-bold text-white">2</span>
            </div>
            <span class="text-[11px] font-semibold text-white hidden sm:block">Checkout</span>
          </div>
          <div class="flex-1 h-px bg-border mx-3"></div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full border border-border flex items-center justify-center flex-shrink-0">
              <span class="text-[10px] font-medium text-white/25">3</span>
            </div>
            <span class="text-[11px] font-medium text-white/25 hidden sm:block">Descarga</span>
          </div>
        </div>
      </div>

      <!-- ── FAILED STATE ──────────────────────────────────────────────────── -->
      <section v-if="ck.step.value === 'failed'" class="px-5 md:px-10 lg:px-12 pb-16">
        <div class="flex flex-col lg:flex-row gap-8 lg:items-start">

          <!-- LEFT: error + reasons + actions -->
          <div class="w-full lg:flex-1 order-2 lg:order-1">

            <!-- Error header -->
            <div class="bg-night-2 border border-red-500/20 rounded-2xl p-6 mb-5 text-center">
              <div class="w-16 h-16 rounded-full bg-red-500/15 border-2 border-red-500/25 flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(239,68,68,0.9)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </div>
              <h2 class="font-display font-bold text-[20px] text-white mb-2 tracking-tight">Pago no procesado</h2>
              <p v-if="ck.failedError.value" class="inline-block bg-red-500/10 text-red-400 text-[12px] font-medium px-3 py-1.5 rounded-full">{{ ck.failedError.value }}</p>
            </div>

            <!-- What happened? -->
            <div class="bg-night-2 border border-border rounded-2xl p-5 mb-5">
              <div class="text-[13px] font-semibold text-white mb-3">¿Qué puede haber pasado?</div>
              <div class="flex flex-col gap-2">
                <button
                  v-for="(reason, i) in failReasons"
                  :key="i"
                  :class="['flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-all', selectedFailReason === i ? 'border-violet bg-violet/10 text-white' : 'border-border text-white/55 hover:border-violet/40 hover:text-white/80']"
                  @click="selectedFailReason = i"
                >
                  <div :class="['w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center', selectedFailReason === i ? 'border-violet' : 'border-border']">
                    <div v-if="selectedFailReason === i" class="w-2 h-2 rounded-full bg-violet"></div>
                  </div>
                  <span class="text-[13px]">{{ reason }}</span>
                </button>
              </div>
            </div>

            <!-- What to do? -->
            <div class="text-[13px] font-semibold text-white mb-3">¿Qué puedes hacer?</div>
            <div class="flex flex-col gap-3">

              <!-- Retry -->
              <div class="bg-night-2 border border-border rounded-2xl p-5 flex items-center justify-between gap-4">
                <div>
                  <div class="text-[13px] font-semibold text-white mb-0.5">Reintentar el pago</div>
                  <p class="text-[11px] text-white/45">Vuelve al detalle y revisa los datos de tu tarjeta.</p>
                </div>
                <button
                  class="flex-shrink-0 bg-violet hover:bg-violet-deep text-white font-semibold text-[13px] px-4 py-2.5 rounded-xl transition-colors"
                  @click="retryPayment"
                >
                  Reintentar →
                </button>
              </div>

            </div>
          </div><!-- /LEFT -->

          <!-- RIGHT: cart summary preserved -->
          <div class="w-full lg:w-[360px] flex-shrink-0 order-1 lg:order-2 hidden lg:block sticky top-20">
            <div class="bg-night-2 border border-border rounded-2xl overflow-hidden">
              <div class="px-5 pt-5 pb-4 border-b border-border">
                <div class="text-[11px] font-semibold tracking-[2px] uppercase text-red-400 mb-1">Pago fallido</div>
                <div class="font-display font-bold text-[16px] text-white tracking-tight">{{ ck.event.value?.name ?? 'Tu pedido' }}</div>
              </div>
              <div class="px-5 py-4">
                <div class="text-[11px] text-white/30 mb-3">{{ cart.count }} foto{{ cart.count !== 1 ? 's' : '' }} reservada{{ cart.count !== 1 ? 's' : '' }}</div>
                <div class="grid grid-cols-5 gap-2 mb-4">
                  <div
                    v-for="photo in cart.photos.slice(0, 4)"
                    :key="photo.id"
                    class="aspect-[3/4] rounded-lg border border-border bg-night overflow-hidden opacity-50"
                  >
                    <img v-if="photo.thumbnailUrl" :src="photo.thumbnailUrl" :alt="`Foto ${photo.id}`" class="w-full h-full object-cover" />
                  </div>
                  <div v-if="cart.count > 4" class="aspect-[3/4] rounded-lg border border-border bg-night flex items-center justify-center opacity-50">
                    <span class="text-[11px] font-bold text-white/40">+{{ cart.count - 4 }}</span>
                  </div>
                </div>
                <div class="flex items-center justify-between text-[14px] border-t border-border pt-3">
                  <span class="text-white/50">Total</span>
                  <span class="font-display font-bold text-white">{{ ck.formattedTotal.value }}</span>
                </div>
              </div>
              <div class="px-5 pb-5 pt-2">
                <div class="flex items-start gap-2 text-[11px] text-white/30">
                  <svg width="12" height="12" class="flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Tu selección está guardada. Puedes reintentar el pago sin perder tus fotos.
                </div>
              </div>
            </div>
          </div><!-- /RIGHT -->

        </div>
      </section>

      <!-- ── NESTED ROUTE (detail / payment) ────────────────────────────────── -->
      <section v-show="ck.step.value !== 'failed' && ck.step.value !== 'success'" class="px-5 md:px-10 lg:px-12 pb-16">
        <NuxtPage />
      </section>

    </template>
  </div>
</template>

<script setup lang="ts">
import { validateCartPhotos } from "~/composables/useApi"
import { provideCheckout } from "~/composables/useCheckout"

definePageMeta({ ssr: false, middleware: "auth" })
useSeoMeta({ title: "Checkout — Fotify" })

const auth = useAuthStore()
const cart = useCartStore()
const showAuth = useAuthModal()

const ck = provideCheckout()

const selectedFailReason = ref(-1)

const failReasons = [
  "Fondos insuficientes en la cuenta",
  "Datos de tarjeta incorrectos",
  "Tarjeta bloqueada o vencida",
  "Otro motivo",
]

// Guards + initialization
onMounted(async () => {
  if (!auth.isAuthenticated) {
    showAuth.value = true
    ck.isValidating.value = false
    return
  }
  if (!cart.hasPhotos) {
    ck.isValidating.value = false
    await navigateTo("/events")
    return
  }

  await Promise.all([ck.fetchEvent(), ck.fetchUserEmail()])

  // Validate cart photos still exist (CART-02)
  if (cart.eventId && cart.hasPhotos) {
    try {
      const res = await validateCartPhotos(cart.eventId, [...cart.photoIds])
      if (res.invalid.length > 0) {
        const invalidSet = new Set(res.invalid)
        ck.unavailablePhotos.value = cart.photos.filter((p) => invalidSet.has(p.id))

        if (cart.orderType === "full_event") {
          cart.orderType = "single"
        }

        cart.removePhotos(res.invalid)

        // If all photos are invalid, keep the page visible so the user
        // can see which ones were unavailable (CART-02).
      }
    } catch {
      // Network error — skip validation, POST /orders validates server-side
    }
  }

  ck.isValidating.value = false
})

// Redirect when cart becomes empty (e.g. user clicks "Vaciar carrito")
// Skip redirect when unavailable photos are being shown (all-invalid scenario)
watch(() => cart.hasPhotos, (has) => {
  if (!has && ck.step.value !== "success" && ck.unavailablePhotos.value.length === 0) {
    navigateTo(ck.backLink.value)
  }
})

function retryPayment() {
  ck.step.value = "detail"
  ck.failedError.value = null
  selectedFailReason.value = -1
}

function navigateToDownloads() {
  if (ck.orderId.value) navigateTo(`/downloads/${ck.orderId.value}`)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
