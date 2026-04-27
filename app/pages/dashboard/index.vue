<template>
  <div class="min-h-screen bg-night">

    <!-- Loading / auth guard -->
    <div v-if="!ready" class="flex items-center justify-center min-h-screen">
      <svg class="animate-spin text-violet/40" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>
    </div>

    <template v-else>

      <!-- TOP NAV -->
      <nav class="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-4 lg:px-6 border-b border-border" style="background:rgba(15,10,30,.95);backdrop-filter:blur(12px);">
        <button class="lg:hidden mr-3 p-1.5 text-white/60 hover:text-white" @click="mobileSidebarOpen = true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect y="2" width="20" height="2" rx="1" fill="currentColor"/>
            <rect y="9" width="20" height="2" rx="1" fill="currentColor"/>
            <rect y="16" width="20" height="2" rx="1" fill="currentColor"/>
          </svg>
        </button>
        <NuxtLink to="/" class="flex items-center gap-2 mr-6">
          <svg width="26" height="26" viewBox="0 0 44 44" fill="none">
            <ellipse cx="22" cy="22" rx="22" ry="22" fill="#7C3AED"/>
            <path d="M14 22 C14 14 20 8 28 12 C32 14 32 20 28 24 C24 28 18 26 14 22Z" fill="white" opacity="0.95"/>
            <circle cx="22" cy="22" r="4.5" fill="#7C3AED"/>
            <circle cx="22" cy="22" r="2" fill="white" opacity="0.6"/>
          </svg>
          <span class="font-display text-sm text-white">Fotify</span>
        </NuxtLink>
        <span class="hidden lg:block text-xs text-white/30">Panel fotógrafo</span>
        <div class="ml-auto flex items-center gap-3">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0" style="background:linear-gradient(135deg,#7C3AED,#FF3D6B)">
            {{ avatarInitials }}
          </div>
        </div>
      </nav>

      <!-- Mobile sidebar overlay -->
      <Transition name="fade">
        <div v-if="mobileSidebarOpen" class="fixed inset-0 z-[200]" @click.self="mobileSidebarOpen = false">
          <div class="absolute inset-0 bg-night/75 backdrop-blur-sm" @click="mobileSidebarOpen = false"/>
          <aside class="absolute left-0 top-0 bottom-0 w-64 bg-night-2 border-r border-border overflow-y-auto">
            <div class="p-4 border-b border-border flex items-center justify-between">
              <span class="font-display text-sm text-white">Panel</span>
              <button class="text-white/50 hover:text-white" @click="mobileSidebarOpen = false">✕</button>
            </div>
            <nav class="p-3">
              <SidebarLink v-for="link in navLinks" :key="link.section" v-bind="link" :active="activeSection === link.section" @click="switchSection(link.section)" />
              <div class="border-t border-border mt-3 pt-3">
                <NuxtLink to="/dashboard/upload" class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm text-violet bg-violet/10 hover:bg-violet/20 transition-colors">
                  <IconUpload />
                  Subir fotos
                </NuxtLink>
              </div>
            </nav>
          </aside>
        </div>
      </Transition>

      <!-- LAYOUT -->
      <div class="pt-14 flex min-h-screen">

        <!-- Desktop sidebar -->
        <aside class="hidden lg:flex flex-col w-56 flex-shrink-0 border-r border-border bg-night-2 fixed top-14 bottom-0 left-0 overflow-y-auto">
          <div class="p-4 border-b border-border">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0" style="background:linear-gradient(135deg,#7C3AED,#FF3D6B)">
                {{ avatarInitials }}
              </div>
              <div class="min-w-0">
                <div class="text-sm font-medium text-white truncate">{{ profile?.display_name || 'Fotógrafo' }}</div>
                <div class="text-xs text-white/40">{{ planLabel }}</div>
              </div>
            </div>
          </div>
          <nav class="p-3 flex-1">
            <SidebarLink v-for="link in navLinks" :key="link.section" v-bind="link" :active="activeSection === link.section" @click="switchSection(link.section)" />
          </nav>
          <div class="p-3 border-t border-border">
            <NuxtLink to="/dashboard/upload" class="flex items-center justify-center gap-2 bg-violet hover:bg-violet-deep text-white text-sm font-semibold py-2.5 px-4 rounded-full transition-colors">
              <IconUpload />
              Subir fotos
            </NuxtLink>
          </div>
        </aside>

        <!-- Main content -->
        <main class="flex-1 lg:ml-56 px-5 lg:px-8 py-6">

          <!-- ── RESUMEN ─────────────────────────────────────────────── -->
          <section v-show="activeSection === 'overview'">

            <!-- First-time onboarding -->
            <template v-if="isFirstTime">
              <div class="mb-7">
                <h1 class="font-display font-bold text-[22px] text-white mb-1">¡Bienvenido a Fotify, {{ firstName }}! 👋</h1>
                <p class="text-sm text-white/40">Empieza creando tu primer evento y monetiza tus fotos.</p>
              </div>

              <!-- Zero KPI (dimmed) -->
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 opacity-40 pointer-events-none select-none">
                <div class="bg-night-2 border border-border rounded-2xl p-5">
                  <div class="text-xs text-white/40 mb-2">Ganancias acumuladas</div>
                  <div class="font-display text-2xl text-white mb-1">S/ 0</div>
                  <div class="text-xs text-white/40">sin pagos aún</div>
                </div>
                <div class="bg-night-2 border border-border rounded-2xl p-5">
                  <div class="text-xs text-white/40 mb-2">Fotos subidas</div>
                  <div class="font-display text-2xl text-white mb-1">0</div>
                  <div class="text-xs text-white/40">en 0 eventos</div>
                </div>
                <div class="bg-night-2 border border-border rounded-2xl p-5">
                  <div class="text-xs text-white/40 mb-2">Eventos activos</div>
                  <div class="font-display text-2xl text-white mb-1">0</div>
                  <div class="text-xs text-white/40">de 0 totales</div>
                </div>
                <div class="bg-night-2 border border-border rounded-2xl p-5">
                  <div class="text-xs text-white/40 mb-2">Pendiente de cobro</div>
                  <div class="font-display text-2xl text-violet mb-1">S/ 0</div>
                  <div class="text-xs text-white/40">sin pagos pendientes</div>
                </div>
              </div>

              <!-- Create first event CTA -->
              <div class="bg-night-2 border border-violet/20 rounded-2xl p-6 mb-6">
                <div class="text-center mb-5">
                  <div class="font-display font-bold text-[18px] text-white mb-1">Crea tu primer evento</div>
                  <p class="text-sm text-white/45">Elige el deporte y comienza a monetizar tus fotos.</p>
                </div>
                <div class="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-5">
                  <button
                    v-for="sport in sports"
                    :key="sport.name"
                    class="flex flex-col items-center gap-2 bg-night-3 hover:bg-violet/15 border border-border hover:border-violet/40 rounded-xl p-3 transition-colors"
                  >
                    <span class="text-2xl">{{ sport.icon }}</span>
                    <span class="text-[10px] text-white/55 font-medium">{{ sport.name }}</span>
                  </button>
                </div>
                <NuxtLink to="/dashboard/events/new" class="block w-full text-center bg-violet hover:bg-violet-deep text-white font-bold py-3.5 rounded-2xl text-[15px] transition-colors">
                  Crear evento →
                </NuxtLink>
              </div>

              <!-- Secondary cards -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div class="bg-night-2 border border-border rounded-2xl p-5">
                  <div class="flex items-center justify-between mb-3">
                    <div class="text-sm font-medium text-white">Completa tu perfil</div>
                    <span class="text-xs text-white/40">40%</span>
                  </div>
                  <div class="w-full bg-border rounded-full h-1.5 mb-3">
                    <div class="bg-violet h-1.5 rounded-full" style="width:40%"></div>
                  </div>
                  <button class="text-xs text-violet hover:underline" @click="switchSection('profile')">Completar →</button>
                </div>
                <div class="bg-night-2 border border-border rounded-2xl p-5 opacity-50">
                  <div class="flex items-center gap-2 mb-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    <div class="text-sm font-medium text-white">Conecta tu banco</div>
                  </div>
                  <p class="text-xs text-white/40 mb-3">Disponible cuando tengas tu primer evento activo.</p>
                  <span class="text-[10px] font-semibold bg-white/8 text-white/40 px-2 py-0.5 rounded-full">Bloqueado</span>
                </div>
                <div class="bg-night-2 border border-border rounded-2xl p-5">
                  <div class="text-sm font-medium text-white mb-2">Ver cómo funciona</div>
                  <p class="text-xs text-white/40 mb-3">Aprende a crear eventos, subir fotos y recibir pagos.</p>
                  <NuxtLink to="/how-it-works" class="text-xs text-violet hover:underline">Ver tutorial →</NuxtLink>
                </div>
              </div>

              <!-- Explore panel -->
              <div class="mb-6">
                <div class="text-sm font-medium text-white mb-3">Explora tu panel</div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    v-for="link in navLinks.filter(l => l.section !== 'overview')"
                    :key="link.section"
                    class="bg-night-2 border border-border hover:border-violet/40 rounded-2xl p-4 text-left transition-colors"
                    @click="switchSection(link.section)"
                  >
                    <div class="text-sm font-medium text-white mb-1">{{ link.label }}</div>
                    <div class="text-xs text-violet">→</div>
                  </button>
                </div>
              </div>

              <!-- Getting started checklist -->
              <div class="bg-night-2 border border-border rounded-2xl p-5">
                <div class="text-sm font-semibold text-white mb-4">Primeros pasos</div>
                <div class="flex flex-col gap-3">
                  <div v-for="item in onboardingSteps" :key="item.label" class="flex items-center gap-3">
                    <div :class="['w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0', item.done ? 'bg-green-400/20' : 'bg-border']">
                      <svg v-if="item.done" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                      <div v-else class="w-2 h-2 rounded-full bg-white/20"></div>
                    </div>
                    <span :class="['text-sm', item.done ? 'text-white/50 line-through' : 'text-white']">{{ item.label }}</span>
                  </div>
                </div>
              </div>
            </template>

            <!-- Normal overview (has events) -->
            <template v-else>
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h1 class="text-xl font-display text-white">Buenas, {{ firstName }} 👋</h1>
                  <p class="text-sm text-white/45 mt-0.5">{{ todayLabel }}</p>
                </div>
              </div>

              <!-- KPI cards -->
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div class="bg-night-2 border border-border rounded-2xl p-5">
                  <div class="text-xs text-white/40 mb-2">Ganancias acumuladas</div>
                  <div class="font-display text-2xl text-white mb-1">S/ {{ totalEarnings.toFixed(0) }}</div>
                  <div class="text-xs text-white/40">{{ payouts.length }} pago{{ payouts.length !== 1 ? 's' : '' }} recibido{{ payouts.length !== 1 ? 's' : '' }}</div>
                </div>
                <div class="bg-night-2 border border-border rounded-2xl p-5">
                  <div class="text-xs text-white/40 mb-2">Fotos subidas</div>
                  <div class="font-display text-2xl text-white mb-1">{{ totalPhotos.toLocaleString() }}</div>
                  <div class="text-xs text-white/40">en {{ events.length }} evento{{ events.length !== 1 ? 's' : '' }}</div>
                </div>
                <div class="bg-night-2 border border-border rounded-2xl p-5">
                  <div class="text-xs text-white/40 mb-2">Eventos activos</div>
                  <div class="font-display text-2xl text-white mb-1">{{ activeEventsCount }}</div>
                  <div class="text-xs text-white/40">de {{ events.length }} totales</div>
                </div>
                <div class="bg-night-2 border border-border rounded-2xl p-5">
                  <div class="text-xs text-white/40 mb-2">Pendiente de cobro</div>
                  <div class="font-display text-2xl text-violet mb-1">S/ {{ pendingAmount.toFixed(0) }}</div>
                  <div class="text-xs text-white/40">{{ pendingPayouts.length > 0 ? 'próximo pago programado' : 'sin pagos pendientes' }}</div>
                </div>
              </div>

              <!-- Recent events table -->
              <div class="bg-night-2 border border-border rounded-2xl overflow-hidden mb-6">
                <div class="px-5 py-4 border-b border-border flex items-center justify-between">
                  <div class="text-sm font-medium text-white">Eventos recientes</div>
                  <button class="text-xs text-violet hover:underline" @click="switchSection('events')">Ver todos</button>
                </div>
                <div v-if="loadingEvents" class="py-10 flex justify-center">
                  <svg class="animate-spin text-violet/40" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                </div>
                <div v-else class="overflow-x-auto">
                  <table class="w-full text-sm">
                    <thead>
                      <tr class="border-b border-border">
                        <th class="text-left py-3 px-5 text-xs text-white/35 font-medium uppercase tracking-wider">Evento</th>
                        <th class="text-left py-3 px-4 text-xs text-white/35 font-medium uppercase tracking-wider hidden md:table-cell">Fecha</th>
                        <th class="text-left py-3 px-4 text-xs text-white/35 font-medium uppercase tracking-wider">Estado</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-border">
                      <tr v-for="event in recentEvents" :key="event.id" class="hover:bg-night-3/50 transition-colors">
                        <td class="py-4 px-5">
                          <div class="text-sm text-white font-medium">{{ event.name }}</div>
                          <div class="text-xs text-white/40">S/ {{ event.photo_price }} / foto</div>
                        </td>
                        <td class="py-4 px-4 text-sm text-white/60 hidden md:table-cell">
                          {{ event.event_date ? formatDate(event.event_date) : '—' }}
                        </td>
                        <td class="py-4 px-4">
                          <span :class="statusBadge(event.status)">{{ statusLabel(event.status) }}</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Quick actions -->
              <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <NuxtLink to="/dashboard/upload" class="bg-night-2 border border-border hover:border-violet/50 rounded-2xl p-5 flex flex-col items-center gap-3 text-center transition-colors group">
                  <div class="w-10 h-10 rounded-full bg-violet/20 flex items-center justify-center group-hover:bg-violet/30 transition-colors">
                    <IconUpload class="text-violet" />
                  </div>
                  <span class="text-xs text-white/70 group-hover:text-white">Subir fotos</span>
                </NuxtLink>
                <button class="bg-night-2 border border-border hover:border-violet/50 rounded-2xl p-5 flex flex-col items-center gap-3 text-center transition-colors group" @click="switchSection('events')">
                  <div class="w-10 h-10 rounded-full bg-violet/20 flex items-center justify-center group-hover:bg-violet/30 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect x="2" y="3" width="14" height="12" rx="2" stroke="#7C3AED" stroke-width="1.5"/>
                      <path d="M6 3V1M12 3V1" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/>
                      <path d="M2 7H16" stroke="#7C3AED" stroke-width="1.5"/>
                      <path d="M6 11H9" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <span class="text-xs text-white/70 group-hover:text-white">Mis eventos</span>
                </button>
                <NuxtLink v-if="profile?.id" :to="`/photographers/${profile.id}`" class="bg-night-2 border border-border hover:border-violet/50 rounded-2xl p-5 flex flex-col items-center gap-3 text-center transition-colors group">
                  <div class="w-10 h-10 rounded-full bg-violet/20 flex items-center justify-center group-hover:bg-violet/30 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <circle cx="9" cy="7" r="3" stroke="#7C3AED" stroke-width="1.5"/>
                      <path d="M3 16C3 13 5.7 11 9 11C12.3 11 15 13 15 16" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <span class="text-xs text-white/70 group-hover:text-white">Ver perfil público</span>
                </NuxtLink>
                <button class="bg-night-2 border border-border hover:border-violet/50 rounded-2xl p-5 flex flex-col items-center gap-3 text-center transition-colors group" @click="switchSection('earnings')">
                  <div class="w-10 h-10 rounded-full bg-violet/20 flex items-center justify-center group-hover:bg-violet/30 transition-colors">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <rect x="3" y="5" width="12" height="9" rx="2" stroke="#7C3AED" stroke-width="1.5"/>
                      <path d="M3 8H15" stroke="#7C3AED" stroke-width="1.5"/>
                      <path d="M7 11H11" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/>
                    </svg>
                  </div>
                  <span class="text-xs text-white/70 group-hover:text-white">Mis ganancias</span>
                </button>
              </div>
            </template>

          </section>

          <!-- ── EVENTOS ────────────────────────────────────────────── -->
          <section v-show="activeSection === 'events'">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-display text-white">Mis eventos</h2>
            </div>

            <!-- Status filter tabs -->
            <div class="flex gap-2 mb-5 overflow-x-auto pb-1">
              <button
                v-for="tab in eventTabs"
                :key="tab.key"
                :class="[
                  'text-xs font-medium px-4 py-1.5 rounded-full whitespace-nowrap transition-colors',
                  eventFilter === tab.key
                    ? 'bg-violet text-white'
                    : 'text-white/60 hover:text-white border border-border',
                ]"
                @click="eventFilter = tab.key"
              >
                {{ tab.label }} ({{ tab.count }})
              </button>
            </div>

            <div v-if="loadingEvents" class="py-10 flex justify-center">
              <svg class="animate-spin text-violet/40" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </div>
            <div v-else-if="filteredEvents.length === 0" class="py-10 text-center text-sm text-white/40">
              No hay eventos en esta categoría.
            </div>
            <div v-else class="flex flex-col gap-3">
              <div
                v-for="event in filteredEvents"
                :key="event.id"
                :class="['bg-night-2 border border-border rounded-2xl px-5 py-4 flex items-center gap-4 transition-opacity', event.status === 'closed' || event.status === 'archived' ? 'opacity-60' : '']"
              >
                <div class="w-12 h-12 rounded-xl bg-violet/15 flex items-center justify-center text-xl flex-shrink-0">📷</div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1 flex-wrap">
                    <span class="text-sm font-medium text-white">{{ event.name }}</span>
                    <span :class="statusBadge(event.status)">{{ statusLabel(event.status) }}</span>
                  </div>
                  <div class="flex items-center gap-3 text-xs text-white/40 flex-wrap">
                    <span>{{ event.event_date ? formatDate(event.event_date) : '—' }}</span>
                    <span v-if="event.location">· {{ event.location }}</span>
                    <span>· S/ {{ event.photo_price }} / foto</span>
                  </div>
                </div>
                <div class="flex items-center gap-3 flex-shrink-0">
                  <NuxtLink v-if="event.status === 'active'" to="/dashboard/upload" class="text-xs text-violet hover:underline">+ fotos</NuxtLink>
                  <NuxtLink v-if="event.slug" :to="`/events/${event.slug}`" class="text-xs text-white/40 hover:text-white">Ver →</NuxtLink>
                </div>
              </div>
            </div>
          </section>

          <!-- ── GANANCIAS ──────────────────────────────────────────── -->
          <section v-show="activeSection === 'earnings'">
            <h2 class="text-xl font-display text-white mb-6">Ganancias</h2>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div class="bg-night-2 border border-border rounded-2xl p-5">
                <div class="text-xs text-white/40 mb-2">Total acumulado</div>
                <div class="font-display text-2xl text-white">S/ {{ totalEarnings.toFixed(2) }}</div>
                <div class="text-xs text-green-400 mt-1">{{ paidPayouts.length }} pago{{ paidPayouts.length !== 1 ? 's' : '' }} recibido{{ paidPayouts.length !== 1 ? 's' : '' }}</div>
              </div>
              <div class="bg-night-2 border border-border rounded-2xl p-5">
                <div class="text-xs text-white/40 mb-2">Pendiente de cobro</div>
                <div class="font-display text-2xl text-violet">S/ {{ pendingAmount.toFixed(2) }}</div>
                <div class="text-xs text-white/40 mt-1">{{ pendingPayouts.length > 0 ? 'en proceso' : 'sin pagos pendientes' }}</div>
              </div>
              <div class="bg-night-2 border border-border rounded-2xl p-5">
                <div class="text-xs text-white/40 mb-2">Promedio por pago</div>
                <div class="font-display text-2xl text-white">S/ {{ avgPayout.toFixed(2) }}</div>
                <div class="text-xs text-white/40 mt-1">por transferencia</div>
              </div>
            </div>

            <div class="bg-night-2 border border-border rounded-2xl overflow-hidden">
              <div class="px-5 py-4 border-b border-border">
                <div class="text-sm font-medium text-white">Historial de pagos</div>
              </div>
              <div v-if="loadingPayouts" class="py-10 flex justify-center">
                <svg class="animate-spin text-violet/40" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              </div>
              <div v-else-if="payouts.length === 0" class="py-10 text-center text-sm text-white/40">
                Aún no tienes pagos registrados.
              </div>
              <div v-else class="divide-y divide-border">
                <div v-for="payout in payouts" :key="payout.id" class="px-5 py-4 flex items-center justify-between">
                  <div>
                    <div class="text-sm text-white">{{ payout.created_at ? formatDate(payout.created_at) : '—' }}</div>
                    <div class="text-xs text-white/40">
                      <span v-if="payout.transfer_ref">{{ payout.transfer_ref }}</span>
                      <span v-else-if="payout.transfer_method">{{ payout.transfer_method }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="text-sm font-semibold text-white">S/ {{ payout.amount?.toFixed(2) }}</div>
                    <span :class="payoutBadge(payout.status)">{{ payoutStatusLabel(payout.status) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- ── FOTOS ──────────────────────────────────────────────── -->
          <section v-show="activeSection === 'photos'">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-display text-white">Mis fotos</h2>
              <NuxtLink to="/dashboard/upload" class="flex items-center gap-2 bg-violet hover:bg-violet-deep text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors">
                <IconUpload />
                Subir más fotos
              </NuxtLink>
            </div>

            <!-- Event selector -->
            <div v-if="events.length > 0" class="mb-4">
              <select
                v-model="photoEventId"
                class="bg-night-3 border border-border text-white/70 text-xs rounded-lg px-3 py-2 outline-none focus:border-violet/60 max-w-xs"
                @change="loadPhotos"
              >
                <option v-for="event in events" :key="event.id" :value="event.id">{{ event.name }}</option>
              </select>
            </div>

            <div v-if="loadingPhotos" class="py-10 flex justify-center">
              <svg class="animate-spin text-violet/40" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </div>
            <div v-else-if="photos.length === 0" class="py-10 text-center text-sm text-white/40">
              No hay fotos en este evento aún.
              <NuxtLink to="/dashboard/upload" class="block mt-2 text-violet hover:underline">Subir fotos →</NuxtLink>
            </div>
            <div v-else>
              <div class="grid grid-cols-3 lg:grid-cols-6 gap-2">
                <div
                  v-for="(photo, idx) in photos"
                  :key="photo.id"
                  class="aspect-square rounded-xl relative group overflow-hidden cursor-pointer"
                  :style="photoCardStyle(idx)"
                >
                  <NuxtImg v-if="photo.thumbnail_url" :src="photo.thumbnail_url" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span class="text-xs text-white">Ver</span>
                  </div>
                </div>
                <!-- Add more slot -->
                <NuxtLink to="/dashboard/upload" class="aspect-square rounded-xl border-2 border-dashed border-border hover:border-violet/50 flex items-center justify-center transition-colors">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4V16M4 10H16" stroke="#2A1F4A" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                </NuxtLink>
              </div>
              <p class="text-xs text-white/30 text-center mt-4">Mostrando {{ photos.length }} foto{{ photos.length !== 1 ? 's' : '' }}</p>
            </div>
          </section>

          <!-- ── MI PERFIL ──────────────────────────────────────────── -->
          <section v-show="activeSection === 'profile'">
            <h2 class="text-xl font-display text-white mb-6">Mi perfil</h2>

            <div class="bg-night-2 border border-border rounded-2xl p-6 mb-5">
              <!-- Profile header -->
              <div class="flex items-start gap-5 mb-6">
                <div class="w-16 h-16 rounded-full flex items-center justify-center text-xl font-semibold flex-shrink-0" style="background:linear-gradient(135deg,#7C3AED,#FF3D6B)">
                  {{ avatarInitials }}
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 class="text-lg font-semibold text-white">{{ profile?.display_name || 'Sin nombre' }}</h3>
                    <span v-if="profile?.plan" class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-yellow-400/15 text-yellow-400">{{ profile.plan }}</span>
                    <span v-if="profile?.verified" class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-400/15 text-green-400">Verificado ✓</span>
                  </div>
                  <div class="text-sm text-white/50 mb-3">{{ profile?.email }}</div>
                  <div class="flex gap-4 text-xs text-white/40 flex-wrap">
                    <span><b class="text-white">{{ events.length }}</b> eventos</span>
                  </div>
                </div>
                <NuxtLink v-if="profile?.id" :to="`/photographers/${profile.id}`" class="text-xs text-violet hover:underline flex-shrink-0">Ver perfil público</NuxtLink>
              </div>

              <!-- Profile form -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label class="text-xs text-white/40 block mb-1">Nombre público</label>
                  <input
                    v-model="profileForm.display_name"
                    type="text"
                    class="w-full bg-night-3 border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet/60 transition-colors"
                  />
                </div>
                <div>
                  <label class="text-xs text-white/40 block mb-1">Portfolio URL</label>
                  <input
                    v-model="profileForm.portfolio_url"
                    type="url"
                    placeholder="https://..."
                    class="w-full bg-night-3 border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet/60 transition-colors placeholder:text-white/20"
                  />
                </div>
                <div class="lg:col-span-2">
                  <label class="text-xs text-white/40 block mb-1">Bio</label>
                  <textarea
                    v-model="profileForm.bio"
                    rows="3"
                    class="w-full bg-night-3 border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet/60 resize-none transition-colors"
                  />
                </div>
              </div>

              <div class="mt-5 flex items-center gap-3">
                <button
                  :disabled="savingProfile"
                  class="bg-violet hover:bg-violet-deep disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors flex items-center gap-2"
                  @click="saveProfile"
                >
                  <svg v-if="savingProfile" class="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                  {{ savingProfile ? 'Guardando…' : 'Guardar cambios' }}
                </button>
                <button class="border border-border text-white/60 text-sm px-5 py-2 rounded-full hover:border-violet/40 transition-colors" @click="resetProfileForm">Cancelar</button>
                <span v-if="profileSaved" class="text-xs text-green-400">✓ Guardado</span>
                <span v-if="profileError" class="text-xs text-coral">{{ profileError }}</span>
              </div>
            </div>

            <!-- Bank account -->
            <div class="bg-night-2 border border-border rounded-2xl p-6">
              <div class="text-sm font-medium text-white mb-5">Configuración de cobros</div>
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <label class="text-xs text-white/40 block mb-1">Tipo de cuenta</label>
                  <select
                    v-model="bankForm.type"
                    class="w-full bg-night-3 border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet/60"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="BCP">BCP</option>
                    <option value="BBVA">BBVA</option>
                    <option value="Interbank">Interbank</option>
                    <option value="Scotiabank">Scotiabank</option>
                    <option value="Yape">Yape</option>
                    <option value="Plin">Plin</option>
                  </select>
                </div>
                <div>
                  <label class="text-xs text-white/40 block mb-1">Titular</label>
                  <input
                    v-model="bankForm.holder"
                    type="text"
                    class="w-full bg-night-3 border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet/60 transition-colors"
                  />
                </div>
                <div>
                  <label class="text-xs text-white/40 block mb-1">CCI (cuenta interbancaria)</label>
                  <input
                    v-model="bankForm.cci"
                    type="text"
                    placeholder="20 dígitos"
                    class="w-full bg-night-3 border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet/60 transition-colors placeholder:text-white/20"
                  />
                </div>
                <div>
                  <label class="text-xs text-white/40 block mb-1">Teléfono (Yape/Plin)</label>
                  <input
                    v-model="bankForm.phone"
                    type="tel"
                    placeholder="9xx xxx xxx"
                    class="w-full bg-night-3 border border-border rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-violet/60 transition-colors placeholder:text-white/20"
                  />
                </div>
              </div>
              <div class="mt-5 flex items-center gap-3">
                <button
                  :disabled="savingProfile"
                  class="bg-violet hover:bg-violet-deep disabled:opacity-50 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors"
                  @click="saveProfile"
                >
                  Guardar cuenta
                </button>
              </div>
            </div>
          </section>

        </main>
      </div>

    </template>
  </div>
</template>

<script setup lang="ts">
import type {
  PhotographerResponse,
  EventResponse,
  PayoutResponse,
  PhotoResponse,
  UpdateProfileInput,
  ListEnvelope,
  SingleEnvelope,
} from '~/types'

definePageMeta({ ssr: false })

// ── inline sub-components ────────────────────────────────────────────────────

const SidebarLink = defineComponent({
  props: {
    section: String,
    label: String,
    active: Boolean,
  },
  emits: ['click'],
  template: `
    <button
      :class="[
        'flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm transition-colors text-left',
        active ? 'bg-violet/15 text-violet font-medium' : 'text-white/55 hover:bg-night-3 hover:text-white'
      ]"
      @click="$emit('click')"
    >
      <slot />
      {{ label }}
    </button>
  `,
})

const IconUpload = defineComponent({
  template: `
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 2V9M7 2L4.5 4.5M7 2L9.5 4.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 11H12" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/>
    </svg>
  `,
})

// ── stores & config ──────────────────────────────────────────────────────────

const config = useRuntimeConfig()
const auth = useAuthStore()

// ── state ────────────────────────────────────────────────────────────────────

type Section = 'overview' | 'events' | 'earnings' | 'photos' | 'profile'

const ready = ref(false)
const activeSection = ref<Section>('overview')
const mobileSidebarOpen = ref(false)

const profile = ref<PhotographerResponse | null>(null)
const events = ref<EventResponse[]>([])
const payouts = ref<PayoutResponse[]>([])
const photos = ref<PhotoResponse[]>([])
const photoEventId = ref<number | null>(null)

const loadingEvents = ref(false)
const loadingPayouts = ref(false)
const loadingPhotos = ref(false)

const savingProfile = ref(false)
const profileSaved = ref(false)
const profileError = ref<string | null>(null)

const profileForm = reactive({ display_name: '', bio: '', portfolio_url: '' })
const bankForm = reactive({ type: '', holder: '', cci: '', phone: '' })

// ── nav links config ─────────────────────────────────────────────────────────

const navLinks = [
  { section: 'overview' as Section, label: 'Resumen' },
  { section: 'events' as Section, label: 'Mis eventos' },
  { section: 'earnings' as Section, label: 'Ganancias' },
  { section: 'photos' as Section, label: 'Fotos' },
  { section: 'profile' as Section, label: 'Mi perfil' },
]

// ── computed ─────────────────────────────────────────────────────────────────

const avatarInitials = computed(() => {
  const name = profile.value?.display_name ?? ''
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'FT'
})

const firstName = computed(() => profile.value?.display_name?.split(' ')[0] ?? 'fotógrafo')

const planLabel = computed(() => {
  const p = profile.value?.plan
  if (!p) return 'Fotógrafo'
  return p === 'pro' ? 'Fotógrafo Pro ⭐' : p === 'enterprise' ? 'Fotógrafo Enterprise' : 'Fotógrafo'
})

const todayLabel = computed(() => {
  return new Date().toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
})

const paidPayouts = computed(() => payouts.value.filter(p => p.status === 'completed'))
const pendingPayouts = computed(() => payouts.value.filter(p => p.status === 'pending' || p.status === 'processing'))
const totalEarnings = computed(() => paidPayouts.value.reduce((s, p) => s + (p.amount ?? 0), 0))
const pendingAmount = computed(() => pendingPayouts.value.reduce((s, p) => s + (p.amount ?? 0), 0))
const avgPayout = computed(() => paidPayouts.value.length ? totalEarnings.value / paidPayouts.value.length : 0)

const activeEventsCount = computed(() => events.value.filter(e => e.status === 'active').length)
const isFirstTime = computed(() => !loadingEvents.value && events.value.length === 0)
const totalPhotos = computed(() => photos.value.length)

const sports = [
  { icon: '🏃', name: 'Maratón' },
  { icon: '🚴', name: 'Ciclismo' },
  { icon: '⛰️', name: 'Trail' },
  { icon: '🏊', name: 'Natación' },
  { icon: '🏆', name: 'Triatlón' },
  { icon: '⭐', name: 'Otro' },
]

const onboardingSteps = computed(() => [
  { label: 'Registro completado', done: true },
  { label: 'Cuenta aprobada', done: !!profile.value },
  { label: 'Crear tu primer evento', done: events.value.length > 0 },
  { label: 'Subir tus primeras fotos', done: photos.value.length > 0 },
])

const recentEvents = computed(() => events.value.slice(0, 5))

// ── event filter ─────────────────────────────────────────────────────────────

const eventFilter = ref<'all' | 'active' | 'draft' | 'closed'>('all')

const eventTabs = computed(() => [
  { key: 'all' as const, label: 'Todos', count: events.value.length },
  { key: 'active' as const, label: 'Activos', count: events.value.filter(e => e.status === 'active').length },
  { key: 'draft' as const, label: 'Borrador', count: events.value.filter(e => e.status === 'draft').length },
  { key: 'closed' as const, label: 'Cerrados', count: events.value.filter(e => e.status === 'closed' || e.status === 'archived').length },
])

const filteredEvents = computed(() => {
  if (eventFilter.value === 'all') return events.value
  if (eventFilter.value === 'closed') return events.value.filter(e => e.status === 'closed' || e.status === 'archived')
  return events.value.filter(e => e.status === eventFilter.value)
})

// ── helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-PE', { day: 'numeric', month: 'short', year: 'numeric' })
}

function statusLabel(status?: string): string {
  const map: Record<string, string> = { draft: 'Borrador', active: 'Activo', closed: 'Cerrado', archived: 'Archivado' }
  return map[status ?? ''] ?? status ?? '—'
}

function statusBadge(status?: string): string {
  const base = 'text-[10px] font-semibold px-2 py-0.5 rounded-full'
  if (status === 'active') return `${base} bg-green-400/15 text-green-400`
  if (status === 'draft') return `${base} bg-blue-400/15 text-blue-400`
  return `${base} bg-white/8 text-white/40`
}

function payoutStatusLabel(status?: string): string {
  const map: Record<string, string> = { pending: 'Pendiente', processing: 'Procesando', completed: 'Pagado', failed: 'Fallido' }
  return map[status ?? ''] ?? status ?? '—'
}

function payoutBadge(status?: string): string {
  const base = 'text-[10px] font-semibold px-2 py-0.5 rounded-full'
  if (status === 'completed') return `${base} bg-green-400/15 text-green-400`
  if (status === 'pending' || status === 'processing') return `${base} bg-yellow-400/15 text-yellow-400`
  return `${base} bg-white/8 text-white/40`
}

const photoGradients = [
  'background:linear-gradient(135deg,rgba(124,58,237,.3),rgba(91,33,182,.2))',
  'background:linear-gradient(135deg,rgba(124,58,237,.25),rgba(91,33,182,.15))',
  'background:linear-gradient(135deg,rgba(91,33,182,.4),rgba(124,58,237,.15))',
  'background:linear-gradient(135deg,rgba(124,58,237,.35),rgba(91,33,182,.2))',
  'background:linear-gradient(135deg,rgba(91,33,182,.25),rgba(124,58,237,.4))',
]

function photoCardStyle(idx: number): string {
  return photoGradients[idx % photoGradients.length]
}

// ── section switching ─────────────────────────────────────────────────────────

async function switchSection(section: Section) {
  activeSection.value = section
  mobileSidebarOpen.value = false

  if (section === 'earnings' && payouts.value.length === 0 && !loadingPayouts.value) {
    await fetchPayouts()
  }
  if (section === 'photos' && photos.value.length === 0 && !loadingPhotos.value && photoEventId.value) {
    await loadPhotos()
  }
}

// ── API calls ─────────────────────────────────────────────────────────────────

const authHeader = computed(() => ({ Authorization: `Bearer ${auth.tokens.access}` }))

async function fetchProfile() {
  const res = await $fetch<SingleEnvelope<PhotographerResponse>>(
    `${config.public.apiBase}/photographers/me`,
    { headers: authHeader.value },
  )
  profile.value = res.data ?? null
}

async function fetchEvents() {
  loadingEvents.value = true
  try {
    const res = await $fetch<ListEnvelope<EventResponse>>(
      `${config.public.apiBase}/events`,
      { headers: authHeader.value, query: { my_events: true, limit: 50 } },
    )
    events.value = res.data?.items ?? []
    if (events.value.length > 0) {
      photoEventId.value = events.value[0].id ?? null
    }
  } finally {
    loadingEvents.value = false
  }
}

async function fetchPayouts() {
  if (!profile.value?.id) return
  loadingPayouts.value = true
  try {
    const res = await $fetch<ListEnvelope<PayoutResponse>>(
      `${config.public.apiBase}/payouts/mine`,
      { headers: authHeader.value, query: { photographer_id: profile.value.id, limit: 50 } },
    )
    payouts.value = res.data?.items ?? []
  } finally {
    loadingPayouts.value = false
  }
}

async function loadPhotos() {
  if (!photoEventId.value) return
  loadingPhotos.value = true
  try {
    const res = await $fetch<ListEnvelope<PhotoResponse>>(
      `${config.public.apiBase}/photos`,
      { headers: authHeader.value, query: { event_id: photoEventId.value, limit: 48 } },
    )
    photos.value = res.data?.items ?? []
  } finally {
    loadingPhotos.value = false
  }
}

function resetProfileForm() {
  if (!profile.value) return
  profileForm.display_name = profile.value.display_name ?? ''
  profileForm.bio = profile.value.bio ?? ''
  profileForm.portfolio_url = profile.value.portfolio_url ?? ''
  profileError.value = null
  profileSaved.value = false
}

async function saveProfile() {
  savingProfile.value = true
  profileSaved.value = false
  profileError.value = null
  try {
    const body: UpdateProfileInput = {
      display_name: profileForm.display_name || undefined,
      bio: profileForm.bio || undefined,
      portfolio_url: profileForm.portfolio_url || undefined,
      bank_account: (bankForm.type || bankForm.cci || bankForm.phone) ? {
        type: bankForm.type || undefined,
        holder: bankForm.holder || undefined,
        cci: bankForm.cci || undefined,
        phone: bankForm.phone || undefined,
      } : undefined,
    }
    const res = await $fetch<SingleEnvelope<PhotographerResponse>>(
      `${config.public.apiBase}/photographers/me`,
      { method: 'PUT', headers: authHeader.value, body },
    )
    profile.value = res.data ?? profile.value
    profileSaved.value = true
    setTimeout(() => { profileSaved.value = false }, 3000)
  } catch (err: any) {
    profileError.value = err?.data?.error || 'Error al guardar. Intenta de nuevo.'
  } finally {
    savingProfile.value = false
  }
}

// ── mount ─────────────────────────────────────────────────────────────────────

onMounted(async () => {
  if (!auth.isAuthenticated || !auth.isPhotographer) {
    await navigateTo('/')
    return
  }

  try {
    await Promise.allSettled([fetchProfile(), fetchEvents()])
    resetProfileForm()
    if (profile.value) {
      const ba = (profile.value as any).bank_account
      if (ba) {
        bankForm.type = ba.type ?? ''
        bankForm.holder = ba.holder ?? ''
        bankForm.cci = ba.cci ?? ''
        bankForm.phone = ba.phone ?? ''
      }
    }
  } finally {
    ready.value = true
  }
})
</script>

<style scoped>
.animate-spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
