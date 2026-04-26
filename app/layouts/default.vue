<template>
  <div class="min-h-screen flex flex-col bg-night text-white" style="font-family: 'DM Sans', sans-serif;">
    <!-- Google Fonts -->
    <Head>
      <Link rel="preconnect" href="https://fonts.googleapis.com" />
      <Link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
      <Link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap" />
    </Head>

    <!-- NAVBAR -->
    <nav class="sticky top-0 z-50 bg-night/85 backdrop-blur-md border-b border-border h-16 flex items-center justify-between px-5 md:px-10 lg:px-12">
      <NuxtLink to="/" class="flex items-center gap-2.5 no-underline">
        <svg width="30" height="30" viewBox="0 0 44 44" fill="none">
          <ellipse cx="22" cy="22" rx="22" ry="22" fill="#7C3AED"/>
          <path d="M14 22 C14 14 20 8 28 12 C32 14 32 20 28 24 C24 28 18 26 14 22Z" fill="white" opacity="0.95"/>
          <circle cx="22" cy="22" r="4.5" fill="#7C3AED"/>
          <circle cx="22" cy="22" r="2" fill="white" opacity="0.6"/>
        </svg>
        <span class="font-display font-bold text-[19px] tracking-tight text-white">Fotify</span>
      </NuxtLink>

      <ul class="hidden lg:flex items-center gap-8 list-none">
        <li><NuxtLink to="/events" class="text-sm text-white/55 hover:text-white transition-colors">Explorar eventos</NuxtLink></li>
        <li><NuxtLink to="/for-photographers" class="text-sm text-white/55 hover:text-white transition-colors">Para fotógrafos</NuxtLink></li>
        <li><NuxtLink to="/how-it-works" class="text-sm text-white/55 hover:text-white transition-colors">Cómo funciona</NuxtLink></li>
      </ul>

      <div class="hidden lg:flex items-center gap-3">
        <template v-if="auth.isAuthenticated">
          <NuxtLink v-if="auth.isPhotographer" to="/dashboard" class="text-sm text-white/55 hover:text-white px-4 py-2 transition-colors">
            Mi panel
          </NuxtLink>
          <button class="text-sm text-white/55 hover:text-white px-4 py-2 transition-colors" @click="auth.logout">
            Salir
          </button>
        </template>
        <template v-else>
          <button class="text-sm text-white/55 hover:text-white px-4 py-2 transition-colors" @click="showAuth = true">
            Iniciar sesión
          </button>
          <button class="text-sm font-medium bg-violet text-white px-4 py-2 rounded-lg hover:bg-violet-deep transition-colors" @click="showAuth = true">
            Crear cuenta
          </button>
        </template>
      </div>

      <!-- Hamburger -->
      <button class="lg:hidden flex flex-col gap-[5px] p-1.5 bg-transparent border-none cursor-pointer" aria-label="Menú" @click="drawerOpen = true">
        <span class="block w-[22px] h-[2px] bg-white rounded" />
        <span class="block w-[22px] h-[2px] bg-white rounded" />
        <span class="block w-[14px] h-[2px] bg-white/50 rounded" />
      </button>
    </nav>

    <!-- Drawer overlay -->
    <Transition name="fade">
      <div
        v-if="drawerOpen"
        class="fixed inset-0 bg-night/70 backdrop-blur-sm z-[200]"
        @click="drawerOpen = false"
      />
    </Transition>

    <!-- Side drawer -->
    <Transition name="slide">
      <div v-if="drawerOpen" class="fixed top-0 right-0 bottom-0 w-[min(320px,85vw)] bg-night-2 border-l border-border z-[201] flex flex-col">
        <div class="flex items-center justify-between px-5 py-[18px] border-b border-border">
          <NuxtLink to="/" class="flex items-center gap-2" @click="drawerOpen = false">
            <svg width="26" height="26" viewBox="0 0 44 44" fill="none">
              <ellipse cx="22" cy="22" rx="22" ry="22" fill="#7C3AED"/>
              <path d="M14 22 C14 14 20 8 28 12 C32 14 32 20 28 24 C24 28 18 26 14 22Z" fill="white" opacity="0.95"/>
              <circle cx="22" cy="22" r="4.5" fill="#7C3AED"/>
            </svg>
            <span class="font-display font-bold text-[17px] tracking-tight">Fotify</span>
          </NuxtLink>
          <button class="w-[34px] h-[34px] rounded-lg bg-white/5 border border-border text-white flex items-center justify-center hover:bg-white/10 transition-colors" @click="drawerOpen = false">✕</button>
        </div>

        <div class="flex-1 flex flex-col gap-1 p-3">
          <NuxtLink to="/events" class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium text-white/65 hover:bg-violet/10 hover:text-white transition-colors" @click="drawerOpen = false">
            Explorar eventos
          </NuxtLink>
          <NuxtLink to="/for-photographers" class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium text-white/65 hover:bg-violet/10 hover:text-white transition-colors" @click="drawerOpen = false">
            Para fotógrafos
          </NuxtLink>
          <NuxtLink to="/how-it-works" class="flex items-center gap-3 px-4 py-3.5 rounded-xl text-[15px] font-medium text-white/65 hover:bg-violet/10 hover:text-white transition-colors" @click="drawerOpen = false">
            Cómo funciona
          </NuxtLink>
        </div>

        <div class="flex flex-col gap-2.5 p-4 border-t border-border">
          <button class="block text-center text-[14px] text-white/60 py-3 rounded-xl border border-border hover:text-white hover:border-white/20 transition-colors" @click="showAuth = true; drawerOpen = false">
            Iniciar sesión
          </button>
          <button class="block text-center text-[14px] font-semibold bg-coral text-white py-3.5 rounded-xl hover:bg-[#e62d5a] transition-colors" @click="showAuth = true; drawerOpen = false">
            Crear cuenta
          </button>
        </div>
      </div>
    </Transition>

    <!-- Auth modal -->
    <AuthModal v-model="showAuth" />

    <!-- Page content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- FOOTER -->
    <footer class="border-t border-border px-5 md:px-10 lg:px-12 pt-12 pb-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] gap-8 mb-12">
        <div>
          <NuxtLink to="/" class="flex items-center gap-2 mb-3">
            <svg width="26" height="26" viewBox="0 0 44 44" fill="none">
              <ellipse cx="22" cy="22" rx="22" ry="22" fill="#7C3AED"/>
              <path d="M14 22 C14 14 20 8 28 12 C32 14 32 20 28 24 C24 28 18 26 14 22Z" fill="white" opacity="0.95"/>
              <circle cx="22" cy="22" r="4.5" fill="#7C3AED"/>
            </svg>
            <span class="font-display font-bold text-[17px] tracking-tight">Fotify</span>
          </NuxtLink>
          <p class="text-[13px] text-muted leading-relaxed max-w-[240px]">Marketplace de fotografía de eventos deportivos y sociales en Perú.</p>
        </div>
        <div>
          <div class="text-[11px] font-semibold tracking-[2px] uppercase text-white/20 mb-4">Plataforma</div>
          <ul class="flex flex-col gap-2.5 list-none">
            <li><NuxtLink to="/events" class="text-[13px] text-muted hover:text-white transition-colors">Explorar eventos</NuxtLink></li>
            <li><NuxtLink to="/for-photographers" class="text-[13px] text-muted hover:text-white transition-colors">Para fotógrafos</NuxtLink></li>
            <li><NuxtLink to="/how-it-works" class="text-[13px] text-muted hover:text-white transition-colors">Cómo funciona</NuxtLink></li>
          </ul>
        </div>
        <div>
          <div class="text-[11px] font-semibold tracking-[2px] uppercase text-white/20 mb-4">Soporte</div>
          <ul class="flex flex-col gap-2.5 list-none">
            <li><NuxtLink to="/purchases" class="text-[13px] text-muted hover:text-white transition-colors">Mis pedidos</NuxtLink></li>
          </ul>
        </div>
        <div>
          <div class="text-[11px] font-semibold tracking-[2px] uppercase text-white/20 mb-4">Legal</div>
          <ul class="flex flex-col gap-2.5 list-none">
            <li><NuxtLink to="/legal" class="text-[13px] text-muted hover:text-white transition-colors">Términos de uso</NuxtLink></li>
            <li><NuxtLink to="/legal" class="text-[13px] text-muted hover:text-white transition-colors">Privacidad</NuxtLink></li>
            <li><NuxtLink to="/legal" class="text-[13px] text-muted hover:text-white transition-colors">Datos biométricos</NuxtLink></li>
          </ul>
        </div>
      </div>
      <div class="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p class="text-[12px] text-white/20">© {{ new Date().getFullYear() }} Fotify. Todos los derechos reservados. Hecho en Perú 🇵🇪</p>
        <div class="text-[11px] tracking-[3px] uppercase text-violet/40">Identify the moment</div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const drawerOpen = ref(false)
const showAuth = useAuthModal()
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
