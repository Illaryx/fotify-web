<template>
  <div class="min-h-screen bg-night">

    <!-- NAV minimal -->
    <nav class="sticky top-0 z-50 h-14 flex items-center px-5 lg:px-12 border-b border-border" style="background:rgba(15,10,30,.95);backdrop-filter:blur(12px);">
      <NuxtLink to="/" class="flex items-center gap-2">
        <svg width="26" height="26" viewBox="0 0 44 44" fill="none">
          <ellipse cx="22" cy="22" rx="22" ry="22" fill="#7C3AED"/>
          <path d="M14 22 C14 14 20 8 28 12 C32 14 32 20 28 24 C24 28 18 26 14 22Z" fill="white" opacity="0.95"/>
          <circle cx="22" cy="22" r="4.5" fill="#7C3AED"/>
          <circle cx="22" cy="22" r="2" fill="white" opacity="0.6"/>
        </svg>
        <span class="font-display text-sm text-white">Fotify</span>
      </NuxtLink>
      <div class="ml-auto text-xs text-white/40">
        ¿Ya tienes cuenta?
        <button class="text-violet hover:underline ml-1" @click="showAuth = true">Inicia sesión</button>
      </div>
    </nav>

    <div class="px-5 lg:px-12 py-8 max-w-2xl mx-auto">

      <!-- Hero -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 bg-violet/10 border border-violet/25 rounded-full px-3 py-1 text-xs text-violet font-medium mb-4">
          Para fotógrafos
        </div>
        <h1 class="font-display text-2xl lg:text-3xl text-white mb-2">Crea tu cuenta gratis</h1>
        <p class="text-sm text-white/50">Empieza a ganar con tus fotos deportivas en minutos.</p>
      </div>

      <!-- Step indicator -->
      <div class="flex items-center mb-10">
        <div v-for="(s, i) in steps" :key="s.key" class="flex items-center flex-1 last:flex-none">
          <div class="flex flex-col items-center">
            <div :class="[
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all',
              currentStep > i + 1 ? 'bg-violet text-white' : currentStep === i + 1 ? 'bg-violet/20 border-2 border-violet text-violet' : 'bg-white/6 border-2 border-border text-white/30',
            ]">
              <svg v-if="currentStep > i + 1" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7L5.5 9.5L11 4" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span v-else>{{ i + 1 }}</span>
            </div>
            <span :class="['text-xs mt-1.5 font-medium', currentStep >= i + 1 ? 'text-violet' : 'text-white/30']">{{ s.label }}</span>
          </div>
          <div v-if="i < steps.length - 1" :class="['flex-1 h-px mx-3 mb-5', currentStep > i + 1 ? 'bg-violet/40' : 'bg-border']"></div>
        </div>
      </div>

      <!-- ── STEP 1: Cuenta ── -->
      <div v-if="currentStep === 1">
        <div class="bg-night-2 border border-border rounded-2xl p-6 lg:p-8">
          <h2 class="font-semibold text-white text-base mb-5">Datos de acceso</h2>
          <div class="flex flex-col gap-4">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label class="text-xs text-white/45 block mb-1.5">Nombre *</label>
                <input v-model="step1.first_name" type="text" placeholder="Tu nombre" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors" />
              </div>
              <div>
                <label class="text-xs text-white/45 block mb-1.5">Apellido *</label>
                <input v-model="step1.last_name" type="text" placeholder="Tu apellido" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors" />
              </div>
            </div>
            <div>
              <label class="text-xs text-white/45 block mb-1.5">Email profesional *</label>
              <input v-model="step1.email" type="email" placeholder="foto@tudominio.com" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors" />
            </div>
            <div>
              <label class="text-xs text-white/45 block mb-1.5">Teléfono (WhatsApp)</label>
              <div class="flex gap-2">
                <select class="bg-night-3 border border-border rounded-xl px-3 py-3 text-sm text-white outline-none focus:border-violet/60 transition-colors w-24 flex-shrink-0">
                  <option>+51</option><option>+57</option><option>+56</option><option>+52</option>
                </select>
                <input v-model="step1.phone" type="tel" placeholder="999 000 000" class="flex-1 bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors" />
              </div>
            </div>
            <div>
              <label class="text-xs text-white/45 block mb-1.5">Contraseña *</label>
              <input v-model="step1.password" type="password" placeholder="Mínimo 8 caracteres" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors" />
            </div>
            <div>
              <label class="text-xs text-white/45 block mb-1.5">Confirmar contraseña *</label>
              <input v-model="step1.confirm" type="password" placeholder="Repite tu contraseña" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors" @keydown.enter="goNext" />
            </div>
            <label class="flex items-start gap-2.5 cursor-pointer">
              <input v-model="step1.terms" type="checkbox" class="mt-0.5 w-4 h-4 rounded flex-shrink-0" style="accent-color:#7C3AED" />
              <span class="text-xs text-white/45 leading-relaxed">
                Acepto los <NuxtLink to="/legal" class="text-violet hover:underline">Términos de uso</NuxtLink>, la <NuxtLink to="/legal" class="text-violet hover:underline">Política de privacidad</NuxtLink> y el <NuxtLink to="/legal?tab=fotografo" class="text-violet hover:underline">Acuerdo de fotógrafo</NuxtLink>
              </span>
            </label>
          </div>
        </div>
        <p v-if="stepError" class="text-sm text-coral text-center mt-3">{{ stepError }}</p>
        <button
          :disabled="stepLoading"
          class="w-full mt-4 bg-coral hover:opacity-90 disabled:opacity-60 text-white font-semibold py-3.5 rounded-full text-sm transition-opacity flex items-center justify-center gap-2"
          @click="goNext"
        >
          <svg v-if="stepLoading" class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
          {{ stepLoading ? 'Creando cuenta...' : 'Continuar →' }}
        </button>
        <p class="text-center text-xs text-white/30 mt-3">
          ¿Solo quieres comprar fotos?
          <button class="text-violet hover:underline ml-1" @click="showAuth = true">Crea una cuenta de atleta</button>
        </p>
      </div>

      <!-- ── STEP 2: Especialidad ── -->
      <div v-if="currentStep === 2">
        <div class="bg-night-2 border border-border rounded-2xl p-6 lg:p-8 mb-4">
          <h2 class="font-semibold text-white text-base mb-1">Tu especialidad</h2>
          <p class="text-xs text-white/40 mb-5 leading-relaxed">Selecciona los deportes que fotografías. Esto ayuda a que los organizadores te encuentren.</p>

          <!-- Sports -->
          <div class="flex flex-wrap gap-2 mb-6">
            <button
              v-for="sport in allSports"
              :key="sport"
              :class="['text-xs px-3.5 py-2 rounded-full border transition-colors font-medium', selectedSports.has(sport) ? 'border-violet bg-violet/12 text-violet' : 'border-border text-white/55 hover:border-violet/40 hover:text-white']"
              @click="toggleSport(sport)"
            >
              {{ sport }}
            </button>
          </div>

          <!-- Cities -->
          <div class="border-t border-border pt-5 mb-5">
            <h3 class="text-sm font-medium text-white mb-3">Ciudad(es) donde trabajas</h3>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="city in allCities"
                :key="city"
                :class="['text-xs px-3.5 py-2 rounded-full border transition-colors font-medium', selectedCities.has(city) ? 'border-violet bg-violet/12 text-violet' : 'border-border text-white/55 hover:border-violet/40 hover:text-white']"
                @click="toggleCity(city)"
              >
                {{ city }}
              </button>
            </div>
          </div>

          <!-- Username -->
          <div class="border-t border-border pt-5 mb-5">
            <label class="text-xs text-white/45 block mb-1.5">Username público (tu URL en Fotify)</label>
            <div class="flex items-center">
              <span class="text-sm text-white/35 bg-night-3 border border-border rounded-l-xl px-3 py-3 border-r-0 whitespace-nowrap">fotify.pe/</span>
              <input
                v-model="step2.username"
                type="text"
                placeholder="tu-nombre"
                class="flex-1 bg-night-3 border border-border rounded-r-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors"
              />
            </div>
          </div>

          <!-- Bio -->
          <div>
            <label class="text-xs text-white/45 block mb-1.5">Bio (aparece en tu perfil público)</label>
            <textarea
              v-model="step2.bio"
              rows="3"
              maxlength="200"
              placeholder="Ej: Fotógrafo deportivo con 8 años cubriendo maratones y triatlones en Lima..."
              class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors resize-none"
            />
            <div class="flex justify-between mt-1">
              <span class="text-xs text-white/25">Opcional pero recomendado</span>
              <span class="text-xs text-white/25">{{ step2.bio.length }} / 200</span>
            </div>
          </div>
        </div>

        <!-- Portfolio upload zone -->
        <div class="bg-night-2 border border-border rounded-2xl p-6 mb-4">
          <h3 class="text-sm font-medium text-white mb-1">Portafolio <span class="text-white/30 font-normal">(opcional)</span></h3>
          <p class="text-xs text-white/40 mb-4">Sube 3–5 fotos de ejemplo. Aumenta un 40% la confianza de los atletas.</p>
          <div class="border-2 border-dashed border-border hover:border-violet/40 rounded-2xl p-8 text-center cursor-pointer transition-colors">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" class="mx-auto mb-3 opacity-40">
              <path d="M14 5V18M14 5L9 10M14 5L19 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M5 22H23" stroke="white" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <p class="text-sm text-white/40 mb-1">Arrastra fotos o <span class="text-violet">selecciona archivos</span></p>
            <p class="text-xs text-white/25">JPG, PNG · Máx 10MB por foto</p>
          </div>
        </div>

        <p v-if="stepError" class="text-sm text-coral text-center mb-3">{{ stepError }}</p>
        <div class="flex gap-3">
          <button class="flex-1 border border-border text-white/60 hover:text-white py-3.5 rounded-full text-sm transition-colors" @click="currentStep = 1">← Atrás</button>
          <button
            :disabled="stepLoading"
            class="flex-1 bg-coral hover:opacity-90 disabled:opacity-60 text-white font-semibold py-3.5 rounded-full text-sm transition-opacity flex items-center justify-center gap-2"
            @click="goNext"
          >
            <svg v-if="stepLoading" class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            {{ stepLoading ? 'Guardando...' : 'Continuar →' }}
          </button>
        </div>
      </div>

      <!-- ── STEP 3: Cobros ── -->
      <div v-if="currentStep === 3">
        <div class="bg-night-2 border border-border rounded-2xl p-6 lg:p-8 mb-4">
          <h2 class="font-semibold text-white text-base mb-1">Datos de cobro</h2>
          <p class="text-xs text-white/40 mb-5 leading-relaxed">Necesitamos esto para transferirte tus ganancias. Puedes editarlo después.</p>

          <div class="flex flex-col gap-4">
            <!-- Account type -->
            <div>
              <label class="text-xs text-white/45 block mb-2">Tipo de cuenta</label>
              <div class="flex gap-2">
                <label :class="['flex items-center gap-2 flex-1 border rounded-xl p-3 cursor-pointer transition-colors', step3.account_type === 'persona' ? 'border-violet bg-violet/8' : 'border-border hover:border-violet/40']">
                  <input v-model="step3.account_type" type="radio" value="persona" class="w-3.5 h-3.5" style="accent-color:#7C3AED" />
                  <div>
                    <div class="text-sm text-white font-medium">Persona natural</div>
                    <div class="text-xs text-white/40">RUC o DNI</div>
                  </div>
                </label>
                <label :class="['flex items-center gap-2 flex-1 border rounded-xl p-3 cursor-pointer transition-colors', step3.account_type === 'empresa' ? 'border-violet bg-violet/8' : 'border-border hover:border-violet/40']">
                  <input v-model="step3.account_type" type="radio" value="empresa" class="w-3.5 h-3.5" style="accent-color:#7C3AED" />
                  <div>
                    <div class="text-sm text-white font-medium">Empresa</div>
                    <div class="text-xs text-white/40">RUC empresa</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label class="text-xs text-white/45 block mb-1.5">DNI / RUC</label>
              <input v-model="step3.document" type="text" placeholder="12345678" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors" />
            </div>

            <div>
              <label class="text-xs text-white/45 block mb-1.5">Banco</label>
              <select v-model="step3.bank" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet/60 transition-colors">
                <option value="">Selecciona tu banco</option>
                <option>BCP</option>
                <option>BBVA</option>
                <option>Interbank</option>
                <option>Scotiabank</option>
                <option>Banco de la Nación</option>
                <option>Yape (BCP)</option>
                <option>Plin</option>
              </select>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label class="text-xs text-white/45 block mb-1.5">Tipo de cuenta</label>
                <select v-model="step3.account_subtype" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-violet/60 transition-colors">
                  <option>Cuenta de ahorros</option>
                  <option>Cuenta corriente</option>
                </select>
              </div>
              <div>
                <label class="text-xs text-white/45 block mb-1.5">N° de cuenta</label>
                <input v-model="step3.account_number" type="text" placeholder="0011-0123-0100000000" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors" />
              </div>
            </div>

            <div>
              <label class="text-xs text-white/45 block mb-1.5">CCI (Código de cuenta interbancario)</label>
              <input v-model="step3.cci" type="text" placeholder="002-011-000000000000-00" class="w-full bg-night-3 border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-violet/60 transition-colors" />
            </div>
          </div>

          <div class="mt-5 bg-violet/8 border border-violet/20 rounded-xl p-4 flex items-start gap-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="flex-shrink-0 mt-0.5"><circle cx="8" cy="8" r="7" stroke="#7C3AED" stroke-width="1.3"/><path d="M8 7V11" stroke="#7C3AED" stroke-width="1.3" stroke-linecap="round"/><circle cx="8" cy="5" r="0.75" fill="#7C3AED"/></svg>
            <p class="text-xs text-white/50 leading-relaxed">Los pagos se procesan el 1 y 15 de cada mes. Mínimo S/ 50 para solicitar retiro. Tus datos bancarios están cifrados y nunca se comparten.</p>
          </div>
        </div>

        <p v-if="stepError" class="text-sm text-coral text-center mb-3">{{ stepError }}</p>
        <div class="flex gap-3">
          <button class="flex-1 border border-border text-white/60 hover:text-white py-3.5 rounded-full text-sm transition-colors" @click="currentStep = 2">← Atrás</button>
          <button
            :disabled="stepLoading"
            class="flex-1 bg-coral hover:opacity-90 disabled:opacity-60 text-white font-semibold py-3.5 rounded-full text-sm transition-opacity flex items-center justify-center gap-2"
            @click="goNext"
          >
            <svg v-if="stepLoading" class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            {{ stepLoading ? 'Finalizando...' : 'Finalizar registro →' }}
          </button>
        </div>
      </div>

      <!-- ── STEP 4: Éxito ── -->
      <div v-if="currentStep === 4" class="py-8 text-center">
        <div class="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center" style="background:rgba(124,58,237,.15);border:2px solid rgba(124,58,237,.4);">
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <ellipse cx="22" cy="22" rx="22" ry="22" fill="#7C3AED"/>
            <path d="M14 22 C14 14 20 8 28 12 C32 14 32 20 28 24 C24 28 18 26 14 22Z" fill="white" opacity="0.95"/>
            <circle cx="22" cy="22" r="4.5" fill="#7C3AED"/>
            <circle cx="22" cy="22" r="2" fill="white" opacity="0.6"/>
          </svg>
        </div>

        <h2 class="font-display text-2xl text-white mb-3">¡Cuenta creada!</h2>
        <p class="text-sm text-white/55 max-w-sm mx-auto mb-2 leading-relaxed">Tu cuenta está siendo revisada por nuestro equipo. Normalmente tarda menos de 24 horas.</p>
        <p class="text-sm text-white/55 max-w-sm mx-auto mb-8 leading-relaxed">
          Te enviamos un email de confirmación a <span class="text-white font-medium">{{ step1.email }}</span>
        </p>

        <!-- Status card -->
        <div class="bg-night-2 border border-border rounded-2xl p-5 mb-8 text-left max-w-sm mx-auto">
          <div class="flex flex-col gap-3">
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L4.5 8.5L10 3" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <span class="text-sm text-white">Cuenta creada</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                <div class="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></div>
              </div>
              <span class="text-sm text-white/70">Revisión del equipo Fotify</span>
              <span class="text-xs text-yellow-400 ml-auto">~24h</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 rounded-full bg-border flex items-center justify-center flex-shrink-0">
                <span class="text-xs text-white/20">3</span>
              </div>
              <span class="text-sm text-white/30">Acceso al dashboard</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 max-w-xs mx-auto">
          <NuxtLink to="/dashboard" class="block bg-violet hover:bg-violet-deep text-white font-semibold py-3 rounded-full text-sm transition-colors">
            Ver mi panel →
          </NuxtLink>
          <NuxtLink to="/how-it-works" class="block border border-border text-white/60 hover:text-white py-3 rounded-full text-sm transition-colors">
            Cómo funciona Fotify
          </NuxtLink>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import type { RegisterInput, SingleEnvelope, CreateProfileInput, PhotographerResponse } from '~/types'

definePageMeta({ ssr: false })

const auth = useAuthStore()
const config = useRuntimeConfig()
const showAuth = useAuthModal()

const allSports = ['🏃 Running', '🏊 Triatlón', '🚴 Ciclismo', '🏔️ Trail', '🏋️ Crossfit', '🏊 Natación', '⚽ Fútbol', '🎓 Graduaciones', '🎉 Eventos sociales', 'Otro']
const allCities = ['Lima', 'Arequipa', 'Cusco', 'Trujillo', 'Piura', 'Ica', 'Toda la región']

const steps = [
  { key: 'cuenta', label: 'Cuenta' },
  { key: 'especialidad', label: 'Especialidad' },
  { key: 'cobros', label: 'Cobros' },
  { key: 'listo', label: 'Listo' },
]

const currentStep = ref(1)
const stepLoading = ref(false)
const stepError = ref<string | null>(null)

const selectedSports = reactive(new Set<string>())
const selectedCities = reactive(new Set<string>(['Lima']))

const step1 = reactive({
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  password: '',
  confirm: '',
  terms: false,
})

const step2 = reactive({
  username: '',
  bio: '',
})

const step3 = reactive({
  account_type: 'persona',
  document: '',
  bank: '',
  account_subtype: 'Cuenta de ahorros',
  account_number: '',
  cci: '',
})

let registeredUserId: number | null = null

function toggleSport(sport: string) {
  if (selectedSports.has(sport)) selectedSports.delete(sport)
  else selectedSports.add(sport)
}

function toggleCity(city: string) {
  if (selectedCities.has(city)) selectedCities.delete(city)
  else selectedCities.add(city)
}

async function goNext() {
  stepError.value = null
  stepLoading.value = true

  try {
    if (currentStep.value === 1) {
      if (!step1.first_name.trim() || !step1.last_name.trim()) throw new Error('Ingresa tu nombre y apellido.')
      if (!step1.email.includes('@')) throw new Error('Ingresa un email válido.')
      if (step1.password.length < 8) throw new Error('La contraseña debe tener al menos 8 caracteres.')
      if (step1.password !== step1.confirm) throw new Error('Las contraseñas no coinciden.')
      if (!step1.terms) throw new Error('Debes aceptar los términos para continuar.')

      const res = await $fetch<{ data?: { id?: number } }>(
        `${config.public.apiBase}/auth/register`,
        {
          method: 'POST',
          body: {
            full_name: `${step1.first_name.trim()} ${step1.last_name.trim()}`,
            email: step1.email.trim(),
            password: step1.password,
            phone: step1.phone || undefined,
          } as RegisterInput,
        },
      )
      registeredUserId = res.data?.id ?? null

      await auth.login({ email: step1.email, password: step1.password })
    }

    if (currentStep.value === 2) {
      const displayName = `${step1.first_name.trim()} ${step1.last_name.trim()}`
      await $fetch<SingleEnvelope<PhotographerResponse>>(
        `${config.public.apiBase}/photographers`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${auth.tokens.access}` },
          body: {
            display_name: displayName,
            bio: step2.bio || undefined,
            portfolio_url: undefined,
          } as CreateProfileInput,
        },
      )
    }

    if (currentStep.value === 3) {
      // Bank data stored for post-approval onboarding — no dedicated endpoint yet
    }

    currentStep.value += 1
  }
  catch (err: any) {
    stepError.value = err?.data?.error || err?.message || 'Error inesperado. Intenta de nuevo.'
  }
  finally {
    stepLoading.value = false
  }
}

onMounted(() => {
  if (auth.isAuthenticated) navigateTo('/dashboard')
})
</script>
