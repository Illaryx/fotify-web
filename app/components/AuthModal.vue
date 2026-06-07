<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[300] flex items-center justify-center p-5"
        style="background: rgba(10, 6, 20, 0.7); backdrop-filter: blur(6px);"
      >
        <div
          class="relative w-full max-w-[420px] bg-night-2 border border-border rounded-3xl p-8 shadow-[0_32px_80px_rgba(0,0,0,.6),0_0_0_1px_rgba(124,58,237,.1)]"
          :class="{ shake: shaking }"
          @animationend="shaking = false"
        >
          <!-- Close -->
          <button
            class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/8 text-white/40 hover:text-white transition-colors"
            @click="close"
          >✕</button>

          <!-- Logo -->
          <div class="flex items-center gap-2 mb-6">
            <svg width="26" height="26" viewBox="0 0 44 44" fill="none">
              <ellipse cx="22" cy="22" rx="22" ry="22" fill="#7C3AED"/>
              <path d="M14 22 C14 14 20 8 28 12 C32 14 32 20 28 24 C24 28 18 26 14 22Z" fill="white" opacity="0.95"/>
              <circle cx="22" cy="22" r="4.5" fill="#7C3AED"/>
              <circle cx="22" cy="22" r="2" fill="white" opacity="0.6"/>
            </svg>
            <span class="font-display text-sm text-white">Fotify</span>
          </div>

          <!-- ─── LOGIN ─── -->
          <div v-if="view === 'login'">
            <div class="flex border-b border-border mb-6">
              <button class="flex-1 py-2 text-sm font-medium text-white border-b-2 border-violet -mb-px">Iniciar sesión</button>
              <button class="flex-1 py-2 text-sm font-medium text-white/40 border-b-2 border-transparent -mb-px hover:text-white transition-colors" @click="switchTo('register')">Crear cuenta</button>
            </div>

            <form class="flex flex-col gap-4" @submit.prevent="handleLogin">
              <div>
                <label class="text-xs text-white/45 block mb-1.5">Email</label>
                <input v-model="loginForm.email" type="email" placeholder="tucorreo@email.com" autocomplete="email" class="auth-input" />
              </div>
              <div>
                <div class="flex justify-between mb-1.5">
                  <label class="text-xs text-white/45">Contraseña</label>
                  <button type="button" class="text-xs text-violet hover:underline" @click="switchTo('forgot')">¿Olvidaste tu contraseña?</button>
                </div>
                <div class="relative">
                  <input
                    v-model="loginForm.password"
                    :type="showLoginPass ? 'text' : 'password'"
                    placeholder="••••••••"
                    autocomplete="current-password"
                    class="auth-input pr-10"
                  />
                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors" @click="showLoginPass = !showLoginPass">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.3"/></svg>
                  </button>
                </div>
              </div>

              <div v-if="loginError" class="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
                {{ loginError }}
              </div>

              <button type="submit" :disabled="loginLoading || isLoginLocked" class="w-full bg-coral hover:opacity-90 disabled:opacity-60 text-white font-semibold py-3 rounded-full text-sm transition-opacity flex items-center justify-center gap-2 mt-1">
                <svg v-if="loginLoading" class="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2A6 6 0 0 1 14 8" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>
                {{ isLoginLocked ? `Espera ${loginLockRemaining}s` : loginLoading ? 'Entrando...' : 'Entrar' }}
              </button>
            </form>

            <!-- Google OAuth: fase 2 (AUTH-02) -->

            <p class="text-center text-xs text-white/30 mt-5">
              ¿Eres fotógrafo?
              <a :href="`${dashboardBase}/photographers/register`" class="text-violet hover:underline" @click="close">Regístrate aquí →</a>
            </p>
          </div>

          <!-- ─── REGISTER ─── -->
          <div v-else-if="view === 'register'">
            <div class="flex border-b border-border mb-6">
              <button class="flex-1 py-2 text-sm font-medium text-white/40 border-b-2 border-transparent -mb-px hover:text-white transition-colors" @click="switchTo('login')">Iniciar sesión</button>
              <button class="flex-1 py-2 text-sm font-medium text-white border-b-2 border-violet -mb-px">Crear cuenta</button>
            </div>

            <form class="flex flex-col gap-4" @submit.prevent="handleRegister">
              <div>
                <label class="text-xs text-white/45 block mb-1.5">Nombre completo</label>
                <input v-model="registerForm.full_name" type="text" placeholder="Tu nombre" autocomplete="name" class="auth-input" />
              </div>
              <div>
                <label class="text-xs text-white/45 block mb-1.5">Email</label>
                <input v-model="registerForm.email" type="email" placeholder="tucorreo@email.com" autocomplete="email" class="auth-input" />
              </div>
              <div>
                <label class="text-xs text-white/45 block mb-1.5">Contraseña</label>
                <div class="relative">
                  <input
                    v-model="registerForm.password"
                    :type="showRegisterPass ? 'text' : 'password'"
                    placeholder="Mínimo 8 caracteres"
                    autocomplete="new-password"
                    class="auth-input pr-10"
                  />
                  <button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors" @click="showRegisterPass = !showRegisterPass">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z" stroke="currentColor" stroke-width="1.3"/><circle cx="8" cy="8" r="2" stroke="currentColor" stroke-width="1.3"/></svg>
                  </button>
                </div>
                <div class="mt-2 flex gap-1">
                  <div v-for="i in 4" :key="i" class="flex-1 h-1 bg-border rounded-full overflow-hidden">
                    <div
                      class="h-full rounded-full transition-all duration-300"
                      :style="{ width: passwordStrength >= i ? '100%' : '0%', background: strengthBarColor }"
                    />
                  </div>
                </div>
                <div class="text-xs mt-1" :style="{ color: strengthLabelColor }">{{ strengthLabel }}</div>
              </div>

              <div v-if="registerError" class="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-3 py-2">
                {{ registerError }}
              </div>

              <label class="flex items-start gap-2.5 cursor-pointer">
                <input v-model="registerForm.terms" type="checkbox" class="mt-0.5 w-4 h-4 accent-violet flex-shrink-0" />
                <span class="text-xs text-white/45 leading-relaxed">
                  Acepto los
                  <NuxtLink to="/legal" class="text-violet hover:underline" @click="close">Términos de uso</NuxtLink>
                  y la
                  <NuxtLink to="/legal" class="text-violet hover:underline" @click="close">Política de privacidad</NuxtLink>
                </span>
              </label>

              <button type="submit" :disabled="registerLoading" class="w-full bg-coral hover:opacity-90 disabled:opacity-60 text-white font-semibold py-3 rounded-full text-sm transition-opacity flex items-center justify-center gap-2 mt-1">
                <svg v-if="registerLoading" class="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2A6 6 0 0 1 14 8" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>
                {{ registerLoading ? 'Creando cuenta...' : 'Crear cuenta gratis' }}
              </button>
            </form>

            <!-- Google OAuth: fase 2 (AUTH-02) -->

            <p class="text-center text-xs text-white/30 mt-5">
              ¿Eres fotógrafo?
              <a :href="`${dashboardBase}/photographers/register`" class="text-violet hover:underline" @click="close">Regístrate aquí →</a>
            </p>
          </div>

          <!-- ─── FORGOT ─── -->
          <div v-else-if="view === 'forgot'">
            <button class="flex items-center gap-1.5 text-xs text-white/40 hover:text-white mb-6 transition-colors" @click="switchTo('login')">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7L9 11" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
              Volver
            </button>

            <h2 class="font-display text-lg text-white mb-2">¿Olvidaste tu contraseña?</h2>
            <p class="text-sm text-white/50 mb-6 leading-relaxed">Ingresa tu email y te enviamos un enlace para restablecerla.</p>

            <form class="flex flex-col gap-4" @submit.prevent="handleForgot">
              <div>
                <label class="text-xs text-white/45 block mb-1.5">Email</label>
                <input v-model="forgotEmail" type="email" placeholder="tucorreo@email.com" class="auth-input" />
              </div>
              <button type="submit" :disabled="forgotLoading" class="w-full bg-violet hover:bg-violet-deep disabled:opacity-60 text-white font-semibold py-3 rounded-full text-sm transition-colors flex items-center justify-center gap-2">
                <svg v-if="forgotLoading" class="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2A6 6 0 0 1 14 8" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>
                {{ forgotLoading ? 'Enviando...' : 'Enviar enlace' }}
              </button>
            </form>
          </div>

          <!-- ─── FORGOT SUCCESS ─── -->
          <div v-else-if="view === 'forgot-success'" class="text-center py-4">
            <div class="pop-in w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style="background:rgba(124,58,237,.15);border:2px solid rgba(124,58,237,.35);">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="7" width="22" height="16" rx="3" stroke="#7C3AED" stroke-width="1.8"/><path d="M3 11L14 17L25 11" stroke="#7C3AED" stroke-width="1.8" stroke-linecap="round"/></svg>
            </div>
            <h3 class="font-display text-base text-white mb-2">Revisa tu correo</h3>
            <p class="text-sm text-white/50 mb-6 leading-relaxed">
              Enviamos el enlace a <span class="text-white font-medium">{{ forgotEmail }}</span>. Revisa también en spam.
            </p>
            <button class="text-sm text-violet hover:underline" @click="switchTo('login')">Volver al inicio de sesión</button>
          </div>

          <!-- ─── REGISTER SUCCESS ─── -->
          <div v-else-if="view === 'register-success'" class="text-center py-4">
            <div class="pop-in w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style="background:rgba(74,222,128,.1);border:2px solid rgba(74,222,128,.3);">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M6 14L11 19L22 9" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <h3 class="font-display text-base text-white mb-2">¡Bienvenido!</h3>
            <p class="text-sm text-white/50 mb-6">Tu cuenta está lista. Ya puedes buscar tus fotos.</p>
            <button class="block w-full bg-coral hover:opacity-90 text-white font-semibold py-3 rounded-full text-sm transition-opacity" @click="close">
              Explorar eventos →
            </button>
          </div>

          <!-- ─── PANEL REDIRECT ─── -->
          <div v-else-if="view === 'panel-redirect'" class="text-center py-4">
            <div class="pop-in w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style="background:rgba(124,58,237,.15);border:2px solid rgba(124,58,237,.35);">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M6 14L11 19L22 9" stroke="#7C3AED" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </div>
            <h3 class="font-display text-base text-white mb-2">¡Hola de nuevo!</h3>
            <p class="text-sm text-white/50 mb-6 leading-relaxed">¿A dónde quieres ir?</p>
            <div class="flex flex-col gap-3">
              <a
                :href="dashboardBase"
                class="block w-full bg-violet hover:opacity-90 text-white font-semibold py-3 rounded-full text-sm transition-opacity"
                @click="close"
              >
                Ir al Panel de Fotify →
              </a>
              <button class="block w-full border border-border text-white/60 hover:text-white py-3 rounded-full text-sm transition-colors" @click="close">
                Ver mis compras
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { apiFetch } from "~/composables/useApi"
import type { LoginInput, RegisterInput, SingleEnvelope, TokenPair } from "~/types"

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ "update:modelValue": [value: boolean] }>()

const auth = useAuthStore()
const dashboardBase = useRuntimeConfig().public.dashboardBase

type View =
	| "login"
	| "register"
	| "forgot"
	| "forgot-success"
	| "register-success"
	| "panel-redirect"
const view = ref<View>("login")
const shaking = ref(false)

const loginForm = reactive<LoginInput>({ email: "", password: "" })
const showLoginPass = ref(false)
const loginLoading = ref(false)
const loginError = ref("")
const loginAttempts = ref(0)
const loginLockedUntil = ref(0)
const loginLockRemaining = ref(0)
let loginLockTimer: ReturnType<typeof setInterval> | null = null

const registerForm = reactive<RegisterInput & { terms: boolean }>({
	full_name: "",
	email: "",
	password: "",
	terms: false,
})
const showRegisterPass = ref(false)
const registerLoading = ref(false)
const registerError = ref("")

const forgotEmail = ref("")
const forgotLoading = ref(false)

const passwordChecks = computed(() => {
	const val = registerForm.password
	return {
		length: val.length >= 8,
		uppercase: /[A-Z]/.test(val),
		number: /[0-9]/.test(val),
		special: /[^A-Za-z0-9]/.test(val),
	}
})

const passwordStrength = computed(() => {
	const c = passwordChecks.value
	return [c.length, c.uppercase, c.number, c.special].filter(Boolean).length
})

const isPasswordValid = computed(() => passwordStrength.value === 4)

const strengthBarColor = computed(
	() => ["#ef4444", "#ef4444", "#f59e0b", "#4ade80"][passwordStrength.value - 1] ?? "#2A1F4A",
)
const strengthLabelColor = computed(() => {
	if (!registerForm.password) return "rgba(255,255,255,.25)"
	return ["#ef4444", "#ef4444", "#f59e0b", "#4ade80"][passwordStrength.value - 1] ?? "#ef4444"
})
const strengthLabel = computed(() => {
	if (!registerForm.password) return "Escribe para verificar seguridad"
	return (
		["Muy débil", "Débil", "Media", "Fuerte"][passwordStrength.value - 1] ?? "Muy débil"
	)
})

function triggerShake() {
	shaking.value = false
	nextTick(() => {
		shaking.value = true
	})
}

function switchTo(target: View) {
	loginError.value = ""
	registerError.value = ""
	view.value = target
}

function close() {
	emit("update:modelValue", false)
}

function startLoginLock(seconds: number) {
	loginLockedUntil.value = Date.now() + seconds * 1000
	loginLockRemaining.value = seconds
	if (loginLockTimer) clearInterval(loginLockTimer)
	loginLockTimer = setInterval(() => {
		const left = Math.ceil((loginLockedUntil.value - Date.now()) / 1000)
		if (left <= 0) {
			loginLockRemaining.value = 0
			if (loginLockTimer) clearInterval(loginLockTimer)
			loginLockTimer = null
		} else {
			loginLockRemaining.value = left
		}
	}, 1000)
}

const isLoginLocked = computed(() => loginLockRemaining.value > 0)

async function handleLogin() {
	loginError.value = ""
	if (isLoginLocked.value) return
	if (!loginForm.email || !loginForm.password) {
		loginError.value = "Por favor completa todos los campos."
		triggerShake()
		return
	}
	loginLoading.value = true
	try {
		const res = await apiFetch<SingleEnvelope<TokenPair>>("/auth/login", {
			method: "POST",
			body: { email: loginForm.email, password: loginForm.password },
		})
		loginAttempts.value = 0
		if (res.data) {
			auth.setTokens(res.data)
			if (auth.isPhotographer || auth.isAdmin) {
				view.value = "panel-redirect"
				return
			}
		}
		close()
	} catch (e: unknown) {
		const fetchErr = e as { status?: number; data?: { error?: string } }
		if (fetchErr?.status === 429) {
			loginError.value = "Demasiados intentos. Espera un momento antes de reintentar."
			startLoginLock(30)
			triggerShake()
			return
		}
		loginAttempts.value++
		if (loginAttempts.value >= 5) {
			const lockSeconds = Math.min(30 * 2 ** (loginAttempts.value - 5), 300)
			loginError.value = `Demasiados intentos. Espera ${lockSeconds} segundos.`
			startLoginLock(lockSeconds)
		} else {
			const msg = fetchErr?.data?.error
			loginError.value = msg ?? "Email o contraseña incorrectos. Inténtalo de nuevo."
		}
		triggerShake()
	} finally {
		loginLoading.value = false
	}
}

async function handleRegister() {
	registerError.value = ""
	if (!registerForm.full_name || !registerForm.email || !registerForm.password) {
		registerError.value = "Por favor completa todos los campos."
		triggerShake()
		return
	}
	if (!registerForm.terms) {
		registerError.value = "Debes aceptar los términos de uso."
		triggerShake()
		return
	}
	if (!isPasswordValid.value) {
		const missing: string[] = []
		const c = passwordChecks.value
		if (!c.length) missing.push("8 caracteres")
		if (!c.uppercase) missing.push("1 mayúscula")
		if (!c.number) missing.push("1 número")
		if (!c.special) missing.push("1 carácter especial")
		registerError.value = `La contraseña necesita: ${missing.join(", ")}.`
		triggerShake()
		return
	}
	registerLoading.value = true
	try {
		const res = await apiFetch<SingleEnvelope<TokenPair>>("/auth/register", {
			method: "POST",
			body: {
				email: registerForm.email,
				full_name: registerForm.full_name,
				password: registerForm.password,
			},
		})
		if (res.data) auth.setTokens(res.data)
		view.value = "register-success"
	} catch (e: unknown) {
		const msg = (e as { data?: { error?: string } })?.data?.error
		registerError.value = msg ?? "No se pudo crear la cuenta. Intenta de nuevo."
		triggerShake()
	} finally {
		registerLoading.value = false
	}
}

async function handleForgot() {
	if (!forgotEmail.value) return
	forgotLoading.value = true
	try {
		await apiFetch("/auth/forgot-password", {
			method: "POST",
			body: { email: forgotEmail.value },
		})
	} catch {
		// Always show success to prevent email enumeration
	} finally {
		forgotLoading.value = false
	}
	view.value = "forgot-success"
}

watch(
	() => props.modelValue,
	(open) => {
		if (!open) {
			setTimeout(() => {
				view.value = "login"
				loginForm.email = ""
				loginForm.password = ""
				loginError.value = ""
				showLoginPass.value = false
				registerForm.full_name = ""
				registerForm.email = ""
				registerForm.password = ""
				registerForm.terms = false
				registerError.value = ""
				showRegisterPass.value = false
				forgotEmail.value = ""
			}, 300)
		}
	},
)
</script>

<style scoped>
.auth-input {
  width: 100%;
  background: #221840;
  border: 1px solid #2A1F4A;
  border-radius: 12px;
  padding: 12px 14px;
  font-size: .875rem;
  color: #fff;
  outline: none;
  transition: border-color .15s;
  font-family: 'DM Sans', sans-serif;
}
.auth-input:focus { border-color: rgba(124,58,237,.7); }
.auth-input::placeholder { color: rgba(255,255,255,.25); }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25%       { transform: translateX(-6px); }
  75%       { transform: translateX(6px); }
}
.shake { animation: shake .3s ease; }

@keyframes pop-in {
  0%   { transform: scale(.4); opacity: 0; }
  70%  { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
.pop-in { animation: pop-in .4s cubic-bezier(.34,1.56,.64,1) both; }

.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity .25s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }
</style>
