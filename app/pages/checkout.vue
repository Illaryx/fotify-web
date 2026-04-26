<template>
  <div class="min-h-[70vh]">

    <!-- Loading guard (before onMounted resolves) -->
    <div v-if="!auth.isAuthenticated || !cart.hasPhotos" class="flex items-center justify-center py-32">
      <svg class="animate-spin text-violet/40" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
    </div>

    <template v-else>

      <!-- ── SUCCESS OVERLAY ───────────────────────────────────────────────── -->
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="step === 'success'" class="fixed inset-0 bg-night/95 backdrop-blur-md z-[300] flex items-center justify-center p-5">
            <div class="bg-night-2 border border-border rounded-3xl p-8 max-w-sm w-full text-center">
              <div class="w-20 h-20 rounded-full bg-green-500/15 border-2 border-green-500/30 flex items-center justify-center mx-auto mb-6">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.9)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="font-display font-bold text-[22px] text-white mb-2 tracking-tight">¡Pago exitoso!</div>
              <p class="text-[13px] text-white/40 mb-6 leading-relaxed">
                Tus <strong class="text-white">{{ successPhotoCount }} foto{{ successPhotoCount !== 1 ? 's' : '' }} en HD</strong> están listas.
                Revisa tu correo <strong class="text-violet">{{ userEmail }}</strong> o descarga directamente.
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
                Confirmación enviada a {{ userEmail }}
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>

      <!-- ── PROGRESS STEPS ─────────────────────────────────────────────────── -->
      <div class="px-5 md:px-10 lg:px-12 py-5">
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

      <!-- ── MAIN CHECKOUT ──────────────────────────────────────────────────── -->
      <section class="px-5 md:px-10 lg:px-12 pb-16">
        <div class="flex flex-col lg:flex-row gap-8 lg:items-start">

          <!-- ── LEFT: Form ───────────────────────────────────────────────── -->
          <div class="w-full lg:flex-1 order-2 lg:order-1">

            <!-- Mobile order summary -->
            <div class="lg:hidden mb-6 bg-night-2 border border-border rounded-2xl overflow-hidden">
              <div class="px-4 py-3 border-b border-border flex items-center justify-between">
                <span class="text-[12px] font-semibold text-white/50">Tu pedido</span>
                <span class="font-display font-bold text-[16px] text-white">{{ formattedTotal }}</span>
              </div>
              <div class="px-4 py-3 text-[12px] text-white/40">
                {{ cart.count }} foto{{ cart.count !== 1 ? 's' : '' }} seleccionada{{ cart.count !== 1 ? 's' : '' }}<span v-if="event"> · {{ event.name }}</span>
              </div>
            </div>

            <!-- ── QR AWAITING STATE (Yape / Plin) ────────────────────────── -->
            <div v-if="step === 'awaiting-qr'" class="flex flex-col items-center py-4">
              <div class="relative w-48 h-48 bg-white rounded-2xl flex items-center justify-center mb-4 p-3">
                <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
                  <rect x="5" y="5" width="30" height="30" rx="3" fill="#0F0A1E"/>
                  <rect x="9" y="9" width="22" height="22" rx="1" fill="white"/>
                  <rect x="13" y="13" width="14" height="14" rx="1" fill="#0F0A1E"/>
                  <rect x="65" y="5" width="30" height="30" rx="3" fill="#0F0A1E"/>
                  <rect x="69" y="9" width="22" height="22" rx="1" fill="white"/>
                  <rect x="73" y="13" width="14" height="14" rx="1" fill="#0F0A1E"/>
                  <rect x="5" y="65" width="30" height="30" rx="3" fill="#0F0A1E"/>
                  <rect x="9" y="69" width="22" height="22" rx="1" fill="white"/>
                  <rect x="13" y="73" width="14" height="14" rx="1" fill="#0F0A1E"/>
                  <rect x="43" y="5" width="7" height="7" fill="#0F0A1E"/>
                  <rect x="53" y="5" width="7" height="7" fill="#0F0A1E"/>
                  <rect x="43" y="15" width="4" height="4" fill="#0F0A1E"/>
                  <rect x="50" y="20" width="10" height="4" fill="#0F0A1E"/>
                  <rect x="43" y="43" width="14" height="4" fill="#0F0A1E"/>
                  <rect x="60" y="43" width="10" height="7" fill="#0F0A1E"/>
                  <rect x="75" y="43" width="4" height="4" fill="#0F0A1E"/>
                  <rect x="83" y="43" width="12" height="7" fill="#0F0A1E"/>
                  <rect x="43" y="53" width="4" height="10" fill="#0F0A1E"/>
                  <rect x="50" y="57" width="7" height="4" fill="#0F0A1E"/>
                  <rect x="60" y="55" width="4" height="10" fill="#0F0A1E"/>
                  <rect x="67" y="55" width="10" height="4" fill="#0F0A1E"/>
                  <rect x="80" y="53" width="15" height="4" fill="#0F0A1E"/>
                  <rect x="43" y="67" width="7" height="4" fill="#0F0A1E"/>
                  <rect x="53" y="67" width="4" height="10" fill="#0F0A1E"/>
                  <rect x="60" y="72" width="10" height="4" fill="#0F0A1E"/>
                  <rect x="73" y="65" width="4" height="7" fill="#0F0A1E"/>
                  <rect x="80" y="65" width="15" height="4" fill="#0F0A1E"/>
                  <rect x="73" y="75" width="22" height="7" fill="#0F0A1E"/>
                  <rect x="5" y="43" width="30" height="4" fill="#0F0A1E"/>
                  <rect x="5" y="50" width="14" height="4" fill="#0F0A1E"/>
                  <rect x="22" y="50" width="10" height="7" fill="#0F0A1E"/>
                  <rect x="5" y="58" width="7" height="7" fill="#0F0A1E"/>
                  <rect x="15" y="60" width="7" height="5" fill="#0F0A1E"/>
                  <rect x="25" y="58" width="10" height="4" fill="#0F0A1E"/>
                  <rect x="42" y="42" width="16" height="16" rx="3" :fill="payMethod === 'plin' ? '#22C55E' : '#7C3AED'"/>
                  <circle cx="50" cy="50" r="4" fill="white" opacity="0.9"/>
                  <circle cx="50" cy="50" r="2" :fill="payMethod === 'plin' ? '#22C55E' : '#7C3AED'"/>
                </svg>
                <!-- Yape countdown ring -->
                <svg v-if="payMethod === 'yape'" class="absolute inset-0 w-full h-full qr-ring" viewBox="0 0 192 192" fill="none">
                  <circle cx="96" cy="96" r="90" stroke="#7C3AED" stroke-width="3" stroke-dasharray="565" stroke-dashoffset="420" stroke-linecap="round" opacity="0.4"/>
                </svg>
              </div>
              <div class="font-display font-bold text-[22px] text-white mb-1">{{ formattedTotal }}</div>
              <div class="text-[12px] text-white/40 mb-3">
                {{ cart.count }} foto{{ cart.count !== 1 ? 's' : '' }}<span v-if="event"> · {{ event.name }}</span>
              </div>
              <div :class="['flex items-center gap-1.5 text-[12px] font-medium', payMethod === 'plin' ? 'text-green-400' : 'text-violet']">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                {{ qrTimerDisplay }}
              </div>
              <div class="mt-5 bg-night-2 border border-border rounded-xl px-4 py-3 max-w-xs text-center">
                <p class="text-[12px] text-white/40 leading-relaxed">
                  Abre <span class="text-white font-medium">{{ payMethod === 'yape' ? 'Yape' : 'Plin' }}</span>,
                  {{ payMethod === 'yape' ? 'toca el ícono de QR' : 'selecciona pagar con QR' }} y apunta al código.
                  El pago se confirma en segundos.
                </p>
              </div>
              <div class="mt-4 flex items-center gap-2 text-[12px] text-white/30">
                <svg class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                Esperando confirmación de pago...
              </div>
            </div>

            <!-- ── PAYMENT FORM ─────────────────────────────────────────────── -->
            <template v-else>

              <!-- Contact -->
              <div class="mb-6">
                <h2 class="font-display font-bold text-[15px] text-white tracking-tight mb-1">Contacto</h2>
                <p class="text-[12px] text-white/35 mb-4">Te enviaremos el link de descarga a este correo</p>
                <div class="relative">
                  <input
                    v-model="userEmail"
                    type="email"
                    placeholder="tu@email.com"
                    :class="[
                      'w-full bg-night-2 border rounded-xl px-4 py-[14px] text-[14px] text-white placeholder-white/20 outline-none transition-all pr-12',
                      emailValid ? 'border-green-500/40' : 'border-border focus:border-violet/60 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.12)]'
                    ]"
                  />
                  <div v-if="emailValid" class="absolute right-4 top-1/2 -translate-y-1/2">
                    <div class="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(34,197,94,0.9)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <p class="text-[11px] text-white/25 mt-2 flex items-center gap-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  No compartimos tu email con nadie
                </p>
              </div>

              <!-- Payment method -->
              <div class="mb-5">
                <h2 class="font-display font-bold text-[15px] text-white tracking-tight mb-4">Método de pago</h2>
                <div class="grid grid-cols-3 gap-3 mb-5">
                  <!-- Card -->
                  <button
                    :class="['border rounded-xl px-4 py-[14px] cursor-pointer transition-all flex items-center gap-2.5', payMethod === 'card' ? 'border-violet bg-violet/[0.08]' : 'border-border hover:border-white/15']"
                    @click="payMethod = 'card'"
                  >
                    <div class="w-8 h-6 bg-night-2 border border-border/60 rounded flex items-center justify-center flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" :stroke="payMethod === 'card' ? 'rgba(124,58,237,0.8)' : 'rgba(255,255,255,0.3)'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                    </div>
                    <div class="text-left min-w-0">
                      <div class="text-[12px] font-semibold text-white leading-tight">Tarjeta</div>
                      <div class="text-[10px] text-white/35">Visa · MC · Amex</div>
                    </div>
                  </button>
                  <!-- Yape -->
                  <button
                    :class="['border rounded-xl px-4 py-[14px] cursor-pointer transition-all flex items-center gap-2.5', payMethod === 'yape' ? 'border-violet bg-violet/[0.08]' : 'border-border hover:border-white/15']"
                    @click="payMethod = 'yape'"
                  >
                    <div class="w-8 h-6 bg-[#4B0082]/30 border border-purple-800/40 rounded flex items-center justify-center flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(180,100,255,0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
                      </svg>
                    </div>
                    <div class="text-left min-w-0">
                      <div class="text-[12px] font-semibold text-white leading-tight">Yape</div>
                      <div class="text-[10px] text-white/35">QR · Rápido</div>
                    </div>
                  </button>
                  <!-- Plin -->
                  <button
                    :class="['border rounded-xl px-4 py-[14px] cursor-pointer transition-all flex items-center gap-2.5', payMethod === 'plin' ? 'border-violet bg-violet/[0.08]' : 'border-border hover:border-white/15']"
                    @click="payMethod = 'plin'"
                  >
                    <div class="w-8 h-6 bg-[#006400]/20 border border-green-800/40 rounded flex items-center justify-center flex-shrink-0">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(74,222,128,0.8)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M15 21V9"/>
                      </svg>
                    </div>
                    <div class="text-left min-w-0">
                      <div class="text-[12px] font-semibold text-white leading-tight">Plin</div>
                      <div class="text-[10px] text-white/35">QR · Rápido</div>
                    </div>
                  </button>
                </div>

                <!-- Card form -->
                <div v-if="payMethod === 'card'">
                  <div class="mb-4">
                    <label class="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">Número de tarjeta</label>
                    <div class="relative">
                      <input
                        :value="cardNumber"
                        type="text"
                        placeholder="0000  0000  0000  0000"
                        maxlength="19"
                        class="w-full bg-night-2 border border-border rounded-xl px-4 py-[14px] text-[14px] text-white placeholder-white/20 outline-none focus:border-violet/60 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.12)] transition-all pr-20 tracking-[2px]"
                        @input="onCardNumberInput"
                      />
                      <div class="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1.5">
                        <div class="w-8 h-5 bg-[#1A6FBF]/80 rounded text-[6px] font-bold text-white flex items-center justify-center tracking-wide">VISA</div>
                      </div>
                    </div>
                  </div>
                  <div class="grid grid-cols-2 gap-3 mb-4">
                    <div>
                      <label class="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">Vencimiento</label>
                      <input
                        :value="cardExpiry"
                        type="text"
                        placeholder="MM / AA"
                        maxlength="7"
                        class="w-full bg-night-2 border border-border rounded-xl px-4 py-[14px] text-[14px] text-white placeholder-white/20 outline-none focus:border-violet/60 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.12)] transition-all"
                        @input="onExpiryInput"
                      />
                    </div>
                    <div>
                      <label class="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">CVV</label>
                      <input
                        v-model="cardCvv"
                        type="text"
                        placeholder="•••"
                        maxlength="4"
                        class="w-full bg-night-2 border border-border rounded-xl px-4 py-[14px] text-[14px] text-white placeholder-white/20 outline-none focus:border-violet/60 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.12)] transition-all"
                      />
                    </div>
                  </div>
                  <div class="mb-4">
                    <label class="block text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-2">Nombre en la tarjeta</label>
                    <input
                      v-model="cardName"
                      type="text"
                      placeholder="NOMBRE APELLIDO"
                      class="w-full bg-night-2 border border-border rounded-xl px-4 py-[14px] text-[14px] text-white placeholder-white/20 outline-none focus:border-violet/60 focus:shadow-[0_0_0_3px_rgba(124,58,237,0.12)] transition-all"
                    />
                  </div>
                  <div class="flex items-center gap-2 bg-night-2/60 border border-border rounded-xl px-4 py-3">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(124,58,237,0.7)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
                    </svg>
                    <p class="text-[11px] text-white/40">Puedes pagar en <span class="text-violet font-medium">hasta 3 cuotas sin intereses</span> con Visa o Mastercard.</p>
                  </div>
                </div>

                <!-- Yape / Plin instruction -->
                <div v-else class="text-[13px] text-white/40 text-center py-2 leading-relaxed max-w-xs mx-auto">
                  Al confirmar se generará el QR de pago. Ábrelo en
                  <span class="text-white font-medium">{{ payMethod === 'yape' ? 'Yape' : 'Plin' }}</span> y escanea para pagar.
                </div>
              </div>

              <!-- Coupon accordion -->
              <div class="mb-6 border border-border rounded-2xl overflow-hidden">
                <button class="w-full flex items-center justify-between px-4 py-3.5 text-left" @click="couponOpen = !couponOpen">
                  <div class="flex items-center gap-2.5 text-[13px] text-white/40">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
                      <line x1="7" y1="7" x2="7.01" y2="7"/>
                    </svg>
                    ¿Tienes un cupón de descuento?
                  </div>
                  <svg :class="['w-3.5 h-3.5 transition-transform duration-200 text-white/25', couponOpen ? 'rotate-180' : '']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </button>
                <Transition name="coupon">
                  <div v-if="couponOpen" class="px-4 pb-4 flex gap-2">
                    <input
                      v-model="couponCode"
                      type="text"
                      placeholder="Ej: FOTIFY20"
                      class="flex-1 bg-night-2 border border-border rounded-xl px-4 py-2.5 text-[13px] text-white placeholder-white/20 outline-none focus:border-violet/60 transition-all"
                    />
                    <button class="flex-shrink-0 bg-violet/15 hover:bg-violet/25 border border-violet/30 text-violet text-[13px] font-medium px-4 py-2.5 rounded-xl transition-colors">
                      Aplicar
                    </button>
                  </div>
                </Transition>
              </div>

              <!-- Terms -->
              <label class="flex items-start gap-3 cursor-pointer mb-6 group">
                <div class="flex-shrink-0 mt-0.5">
                  <input v-model="termsAccepted" type="checkbox" class="sr-only" />
                  <div :class="['w-5 h-5 rounded-[5px] border bg-night-2 flex items-center justify-center transition-all group-hover:border-violet/50', termsAccepted ? 'bg-violet border-violet' : 'border-border']">
                    <svg v-if="termsAccepted" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>
                </div>
                <span class="text-[12px] text-white/35 leading-relaxed">
                  Acepto los <NuxtLink to="/legal" class="text-violet hover:text-white transition-colors underline underline-offset-2">Términos de uso</NuxtLink> y la <NuxtLink to="/legal" class="text-violet hover:text-white transition-colors underline underline-offset-2">Política de privacidad</NuxtLink> de Fotify. Entiendo que la descarga es digital e inmediata.
                </span>
              </label>

              <!-- Error -->
              <p v-if="orderError" class="text-[13px] text-coral text-center mb-4">{{ orderError }}</p>

              <!-- Pay CTA -->
              <button
                :disabled="step === 'processing'"
                class="w-full bg-coral hover:bg-[#e62d5a] text-white font-bold text-[16px] py-4 rounded-2xl transition-colors flex items-center justify-center gap-3 shadow-lg shadow-coral/25 active:scale-[.98] disabled:opacity-60 disabled:cursor-not-allowed"
                @click="handlePay"
              >
                <svg v-if="step === 'processing'" class="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
                <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                {{ payLabel }}
              </button>
              <p class="text-[11px] text-white/20 text-center mt-3">Procesado por Culqi · Datos encriptados TLS 1.3</p>

            </template>
          </div><!-- /LEFT -->

          <!-- ── RIGHT: Order summary (sticky, desktop) ─────────────────────── -->
          <div class="w-full lg:w-[360px] flex-shrink-0 order-1 lg:order-2 hidden lg:block sticky top-20">
            <div class="bg-night-2 border border-border rounded-2xl overflow-hidden">

              <!-- Header -->
              <div class="px-5 pt-5 pb-4 border-b border-border">
                <div class="text-[11px] font-semibold tracking-[2px] uppercase text-violet mb-1">Tu pedido</div>
                <div class="font-display font-bold text-[16px] text-white tracking-tight">
                  {{ event?.name ?? 'Cargando...' }}
                </div>
                <div v-if="event?.event_date" class="text-[12px] text-white/35 mt-0.5 flex items-center gap-1.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                    <circle cx="12" cy="13" r="4"/>
                  </svg>
                  {{ formatDate(event.event_date) }}
                </div>
              </div>

              <!-- Photo thumbnails -->
              <div class="px-5 pt-4 pb-3">
                <div class="text-[11px] text-white/30 mb-3 font-medium">
                  {{ cart.count }} foto{{ cart.count !== 1 ? 's' : '' }} seleccionada{{ cart.count !== 1 ? 's' : '' }}
                </div>
                <div class="grid grid-cols-5 gap-2">
                  <div
                    v-for="i in Math.min(4, cart.count)"
                    :key="i"
                    class="aspect-[3/4] rounded-lg border border-border bg-night overflow-hidden flex items-center justify-center"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                  </div>
                  <div v-if="cart.count > 4" class="aspect-[3/4] rounded-lg border border-border bg-night flex items-center justify-center">
                    <span class="text-[11px] font-bold text-white/40">+{{ cart.count - 4 }}</span>
                  </div>
                </div>
                <NuxtLink
                  v-if="backLink"
                  :to="backLink"
                  class="flex items-center gap-1 text-[11px] text-white/25 hover:text-white/50 mt-3 transition-colors w-fit"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M19 12H5M12 5l-7 7 7 7"/>
                  </svg>
                  Cambiar selección
                </NuxtLink>
              </div>

              <!-- Pricing -->
              <div class="px-5 py-4 border-t border-border flex flex-col gap-2.5">
                <div class="flex items-center justify-between text-[13px]">
                  <span class="text-white/50">
                    {{ cart.count }} foto{{ cart.count !== 1 ? 's' : '' }}
                    <span v-if="event?.photo_price"> × S/ {{ event.photo_price }}</span>
                  </span>
                  <span class="text-white/50">{{ formattedTotal }}</span>
                </div>
              </div>

              <!-- Total -->
              <div class="px-5 py-4 border-t border-border">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-[13px] text-white/50 mb-0.5">Total a pagar</div>
                    <div class="font-display font-bold text-[28px] text-white tracking-tight leading-none">{{ formattedTotal }}</div>
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

              <!-- Trust badges -->
              <div class="px-5 py-4 border-t border-border grid grid-cols-2 gap-3">
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
                <div class="flex items-center gap-1.5 text-[11px] text-white/35">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(251,191,36,0.6)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  Garantía 7 días
                </div>
              </div>

              <!-- Processor badges -->
              <div class="px-5 pb-4 flex items-center gap-3 flex-wrap">
                <span class="text-[10px] text-white/20">Procesado por</span>
                <div class="flex items-center gap-2">
                  <div class="h-5 px-2 bg-night border border-border rounded flex items-center text-[9px] font-bold text-white/30 tracking-widest">CULQI</div>
                  <div class="h-5 w-8 bg-[#1A6FBF]/40 border border-[#1A6FBF]/30 rounded flex items-center justify-center text-[7px] font-bold text-white/40">VISA</div>
                  <div class="h-5 w-10 bg-[#EB001B]/10 border border-[#EB001B]/20 rounded flex items-center justify-center">
                    <div class="flex">
                      <div class="w-3 h-3 rounded-full bg-[#EB001B]/40"></div>
                      <div class="w-3 h-3 rounded-full bg-[#F79E1B]/40 -ml-1.5"></div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div><!-- /RIGHT -->

        </div>
      </section>

    </template>
  </div>
</template>

<script setup lang="ts">
import type { EventResponse, OrderResponse, CreateOrderInput, ConfirmPaymentInput, SingleEnvelope } from '~/types'

definePageMeta({ ssr: false })

const auth = useAuthStore()
const cart = useCartStore()
const config = useRuntimeConfig()
const showAuth = useAuthModal()
const route = useRoute()

type Step = 'form' | 'processing' | 'awaiting-qr' | 'success'
type PayMethod = 'card' | 'yape' | 'plin'

const step = ref<Step>('form')
const payMethod = ref<PayMethod>('card')
const event = ref<EventResponse | null>(null)
const userEmail = ref('')
const orderId = ref<number | null>(null)
const successPhotoCount = ref(0)

const termsAccepted = ref(false)
const couponOpen = ref(false)
const couponCode = ref('')
const orderError = ref<string | null>(null)

const cardNumber = ref('')
const cardExpiry = ref('')
const cardCvv = ref('')
const cardName = ref('')

const qrSeconds = ref(600)
let qrInterval: ReturnType<typeof setInterval> | null = null
let pollInterval: ReturnType<typeof setInterval> | null = null

// Computed
const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.value))

const totalAmount = computed(() => {
  if (!event.value?.photo_price || !cart.count) return 0
  return cart.count * event.value.photo_price
})

const formattedTotal = computed(() => `S/ ${totalAmount.value.toFixed(2)}`)

const qrTimerDisplay = computed(() => {
  const m = Math.floor(qrSeconds.value / 60).toString().padStart(2, '0')
  const s = (qrSeconds.value % 60).toString().padStart(2, '0')
  return `QR válido por ${m}:${s}`
})

const payLabel = computed(() => {
  if (step.value === 'processing') return 'Procesando...'
  if (payMethod.value === 'yape') return 'Confirmar pago con Yape'
  if (payMethod.value === 'plin') return 'Confirmar pago con Plin'
  return `Pagar ${formattedTotal.value} de forma segura`
})

const backLink = computed(() => {
  const slug = route.query.event_slug as string | undefined
  if (slug) return `/events/${slug}`
  return '/events'
})

// Init
onMounted(async () => {
  if (!auth.isAuthenticated) {
    showAuth.value = true
    return
  }
  if (!cart.hasPhotos) {
    await navigateTo('/events')
    return
  }
  await Promise.all([fetchEvent(), fetchUserEmail()])
})

onUnmounted(() => {
  if (qrInterval) clearInterval(qrInterval)
  if (pollInterval) clearInterval(pollInterval)
})

async function fetchEvent() {
  if (!cart.eventId) return
  try {
    const res = await $fetch<SingleEnvelope<EventResponse>>(
      `${config.public.apiBase}/events/${cart.eventId}`,
      { headers: { Authorization: `Bearer ${auth.tokens.access}` } },
    )
    event.value = res.data ?? null
  }
  catch { /* optional context */ }
}

async function fetchUserEmail() {
  try {
    const res = await $fetch<{ data?: { email?: string } }>(
      `${config.public.apiBase}/auth/me`,
      { headers: { Authorization: `Bearer ${auth.tokens.access}` } },
    )
    userEmail.value = res.data?.email ?? ''
  }
  catch { /* not critical */ }
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function onCardNumberInput(e: Event) {
  const v = (e.target as HTMLInputElement).value.replace(/\D/g, '').substring(0, 16)
  cardNumber.value = v.replace(/(.{4})/g, '$1  ').trim()
}

function onExpiryInput(e: Event) {
  let v = (e.target as HTMLInputElement).value.replace(/\D/g, '').substring(0, 4)
  if (v.length >= 3) v = `${v.substring(0, 2)} / ${v.substring(2)}`
  cardExpiry.value = v
}

function startQrTimer() {
  qrSeconds.value = 600
  if (qrInterval) clearInterval(qrInterval)
  qrInterval = setInterval(() => {
    if (qrSeconds.value <= 0) { clearInterval(qrInterval!); qrInterval = null; return }
    qrSeconds.value--
  }, 1000)
}

watch(payMethod, (m) => {
  if (m === 'yape' || m === 'plin') startQrTimer()
  else {
    if (qrInterval) { clearInterval(qrInterval); qrInterval = null }
  }
})

async function handlePay() {
  if (!termsAccepted.value) {
    orderError.value = 'Acepta los términos de uso para continuar.'
    return
  }
  if (!emailValid.value) {
    orderError.value = 'Ingresa un correo válido.'
    return
  }
  if (payMethod.value === 'card' && !isCardValid()) {
    orderError.value = 'Completa los datos de la tarjeta correctamente.'
    return
  }

  orderError.value = null
  step.value = 'processing'
  successPhotoCount.value = cart.count

  try {
    const orderRes = await $fetch<{ data?: OrderResponse }>(
      `${config.public.apiBase}/orders`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.tokens.access}` },
        body: {
          event_id: cart.eventId!,
          payment_gateway: 'culqi',
          photo_ids: [...cart.photoIds],
          ...(cart.searchSessionId ? { search_session_id: cart.searchSessionId } : {}),
          type: 'single',
        } as CreateOrderInput,
      },
    )

    const oid = orderRes.data?.id!
    orderId.value = oid

    if (payMethod.value === 'card') {
      const token = await tokenizeCard()
      await $fetch(`${config.public.apiBase}/orders/${oid}/confirm-payment`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${auth.tokens.access}` },
        body: {
          payment_method: 'card',
          payment_ref: token,
          status: 'paid',
        } as ConfirmPaymentInput,
      })
      persistOrderPhotos(oid, [...cart.photoIds])
      cart.clear()
      step.value = 'success'
    }
    else {
      // Yape / Plin: show QR + poll
      step.value = 'awaiting-qr'
      startQrTimer()
      pollOrderStatus(oid)
    }
  }
  catch (err: any) {
    step.value = 'form'
    orderError.value = err?.data?.error || err?.message || 'Error al procesar el pago. Intenta de nuevo.'
  }
}

function isCardValid(): boolean {
  const num = cardNumber.value.replace(/\s+/g, '')
  const parts = cardExpiry.value.split('/')
  return (
    num.length === 16
    && cardCvv.value.length >= 3
    && parts.length === 2
    && parts[0].trim().length === 2
    && parts[1].trim().length === 2
    && !!cardName.value.trim()
  )
}

// Culqi v4 card tokenization
async function tokenizeCard(): Promise<string> {
  const win = window as any
  if (!win.Culqi) throw new Error('Culqi SDK no cargado. Recarga la página.')
  const culqiKey = config.public.culqiKey as string
  if (!culqiKey) throw new Error('Pasarela de pago no configurada.')

  win.Culqi.publicKey = culqiKey

  return new Promise((resolve, reject) => {
    win.culqi = (token: any) => {
      if (token.object === 'error') reject(new Error(token.user_message || 'Tarjeta inválida'))
      else resolve(token.id as string)
    }
    const [month, rawYear] = cardExpiry.value.split('/').map((s: string) => s.trim())
    win.Culqi.createToken({
      card_number: cardNumber.value.replace(/\s+/g, ''),
      cvv: cardCvv.value,
      expiration_month: month.padStart(2, '0'),
      expiration_year: rawYear.length === 2 ? `20${rawYear}` : rawYear,
      email: userEmail.value,
    })
  })
}

function pollOrderStatus(oid: number) {
  if (pollInterval) clearInterval(pollInterval)
  pollInterval = setInterval(async () => {
    try {
      const res = await $fetch<{ data?: OrderResponse }>(
        `${config.public.apiBase}/orders/${oid}`,
        { headers: { Authorization: `Bearer ${auth.tokens.access}` } },
      )
      if (res.data?.status === 'paid') {
        clearInterval(pollInterval!)
        pollInterval = null
        persistOrderPhotos(oid, [...cart.photoIds])
        cart.clear()
        step.value = 'success'
      }
    }
    catch { /* ignore poll errors */ }
  }, 3000)
}

function persistOrderPhotos(oid: number, ids: number[]) {
  try {
    const key = `fotify_order_photos_${oid}`
    localStorage.setItem(key, JSON.stringify(ids))
  } catch { /* ignore storage errors */ }
}

function navigateToDownloads() {
  if (orderId.value) navigateTo(`/downloads/${orderId.value}`)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.coupon-enter-active, .coupon-leave-active {
  transition: max-height 0.3s ease, opacity 0.2s ease;
  overflow: hidden;
}
.coupon-enter-from, .coupon-leave-to { max-height: 0; opacity: 0; }
.coupon-enter-to, .coupon-leave-from { max-height: 80px; opacity: 1; }

.qr-ring { animation: spin-slow 10s linear infinite; }
@keyframes spin-slow { to { transform: rotate(360deg); } }
</style>
