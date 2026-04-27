<script setup lang="ts">
definePageMeta({ ssr: false })

const activeTab = ref<'overview' | 'events' | 'photographers' | 'payments' | 'users' | 'ai'>('overview')
const mobileSidebarOpen = ref(false)

function switchTab(tab: typeof activeTab.value) {
  activeTab.value = tab
  mobileSidebarOpen.value = false
}

// ── Events tab state ──
const eventSearch = ref('')
const eventSportFilter = ref('all')
const eventStatusFilter = ref('all')

const events = [
  { id: 1, icon: '🏃', name: 'Maratón Lima 42K', date: '15 mar 2025', city: 'Lima', photographer: '@carlosrios', photos: 3900, gmv: 5133, status: 'active' },
  { id: 2, icon: '🏊', name: 'Triatlón IronMan Lima', date: '8 mar 2025', city: 'Lunahuaná', photographer: '@trifotos_pe', photos: 4200, gmv: 7820, status: 'active' },
  { id: 3, icon: '🚴', name: 'Ciclismo Miraflores Classic', date: '2 mar 2025', city: 'Lima', photographer: '@mphoto_pe', photos: 2100, gmv: 2987, status: 'processing' },
  { id: 4, icon: '🏔️', name: 'Trail Larcomar 10K', date: '22 feb 2025', city: 'Lima', photographer: '@andresphoto', photos: 980, gmv: 1240, status: 'active' },
  { id: 5, icon: '🏃', name: 'Media Maratón Miraflores', date: '14 feb 2025', city: 'Lima', photographer: '@carlosrios', photos: 2800, gmv: 3650, status: 'closed' },
]

const filteredEvents = computed(() => {
  return events.filter(e => {
    if (eventSearch.value && !e.name.toLowerCase().includes(eventSearch.value.toLowerCase())) return false
    if (eventSportFilter.value !== 'all') {
      const map: Record<string, string[]> = { running: ['🏃'], triathlon: ['🏊'], cycling: ['🚴'], trail: ['🏔️'] }
      if (!map[eventSportFilter.value]?.includes(e.icon)) return false
    }
    if (eventStatusFilter.value !== 'all' && e.status !== eventStatusFilter.value) return false
    return true
  })
})

// ── Photographers tab state ──
const pendingPhotographers = ref([
  { id: 1, initials: 'JL', name: 'Juan López', email: 'juanl@gmail.com', city: 'Cusco' },
  { id: 2, initials: 'PS', name: 'Patricia S.', email: 'patri@foto.pe', city: 'Arequipa' },
  { id: 3, initials: 'MQ', name: 'Manuel Q.', email: 'mq_foto@gmail.com', city: 'Trujillo' },
])

function approvePhotographer(id: number) {
  pendingPhotographers.value = pendingPhotographers.value.filter(p => p.id !== id)
}
function rejectPhotographer(id: number) {
  pendingPhotographers.value = pendingPhotographers.value.filter(p => p.id !== id)
}

// ── Payments tab state ──
const processingPayment = ref(false)
async function processPayment() {
  processingPayment.value = true
  await new Promise(r => setTimeout(r, 1800))
  processingPayment.value = false
}

const statusLabel: Record<string, string> = { active: 'Activo', processing: 'Procesando', closed: 'Cerrado' }
const statusClass: Record<string, string> = {
  active: 'bg-green-400/15 text-green-400',
  processing: 'bg-blue-400/15 text-blue-400',
  closed: 'bg-white/10 text-white/40',
}
</script>

<template>
  <div class="min-h-screen bg-[#0F0A1E] text-white font-sans">

    <!-- TOP NAV -->
    <nav class="fixed top-0 left-0 right-0 h-14 z-50 flex items-center px-4 lg:px-6 border-b border-[#2A1F4A]"
         style="background:rgba(15,10,30,.97);backdrop-filter:blur(12px)">
      <button class="lg:hidden mr-3 p-1.5 text-white/60 hover:text-white"
              @click="mobileSidebarOpen = true">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <rect y="2" width="18" height="2" rx="1" fill="currentColor"/>
          <rect y="8" width="18" height="2" rx="1" fill="currentColor"/>
          <rect y="14" width="18" height="2" rx="1" fill="currentColor"/>
        </svg>
      </button>
      <NuxtLink to="/" class="flex items-center gap-2 mr-4">
        <svg width="24" height="24" viewBox="0 0 44 44" fill="none">
          <ellipse cx="22" cy="22" rx="22" ry="22" fill="#7C3AED"/>
          <path d="M14 22 C14 14 20 8 28 12 C32 14 32 20 28 24 C24 28 18 26 14 22Z" fill="white" opacity="0.95"/>
          <circle cx="22" cy="22" r="4.5" fill="#7C3AED"/>
          <circle cx="22" cy="22" r="2" fill="white" opacity="0.6"/>
        </svg>
        <span class="font-display text-sm text-white">Fotify</span>
      </NuxtLink>
      <span class="hidden lg:block text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FF3D6B]/20 text-[#FF3D6B]">Admin</span>

      <div class="ml-auto flex items-center gap-3">
        <button class="relative p-2 text-white/50 hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 2C5.8 2 4 3.8 4 6V10H12V6C12 3.8 10.2 2 8 2Z" stroke="currentColor" stroke-width="1.3"/>
            <path d="M3 10H13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
            <path d="M6.5 10V11C6.5 11.8 7.2 12.5 8 12.5C8.8 12.5 9.5 11.8 9.5 11V10" stroke="currentColor" stroke-width="1.3"/>
          </svg>
          <span class="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FF3D6B] rounded-full"></span>
        </button>
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-[#FF3D6B]/80 flex items-center justify-center text-xs font-semibold">AD</div>
          <span class="hidden lg:block text-xs text-white/60">Admin</span>
        </div>
      </div>
    </nav>

    <!-- MOBILE SIDEBAR OVERLAY -->
    <Transition name="fade">
      <div v-if="mobileSidebarOpen" class="fixed inset-0 z-[200] lg:hidden">
        <div class="absolute inset-0 bg-[#0F0A1E]/80 backdrop-blur-sm" @click="mobileSidebarOpen = false"/>
        <aside class="absolute left-0 top-0 bottom-0 w-60 bg-[#1A1030] border-r border-[#2A1F4A] overflow-y-auto">
          <div class="p-4 border-b border-[#2A1F4A] flex items-center justify-between">
            <span class="text-xs font-semibold text-[#FF3D6B] uppercase tracking-wider">Admin Panel</span>
            <button class="text-white/50 hover:text-white" @click="mobileSidebarOpen = false">✕</button>
          </div>
          <nav class="p-3">
            <AdminNav :active="activeTab" @switch="switchTab"/>
          </nav>
        </aside>
      </div>
    </Transition>

    <div class="pt-14 flex min-h-screen">

      <!-- DESKTOP SIDEBAR -->
      <aside class="hidden lg:flex flex-col w-52 flex-shrink-0 border-r border-[#2A1F4A] bg-[#1A1030] fixed top-14 bottom-0 left-0 overflow-y-auto">
        <nav class="p-3 flex-1">
          <div class="text-[10px] text-white/25 uppercase tracking-widest px-3 py-2 mt-1">General</div>
          <button class="sidebar-link w-full text-left" :class="{ active: activeTab === 'overview' }" @click="switchTab('overview')">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" stroke-width="1.2"/>
            </svg>
            Resumen
          </button>

          <div class="text-[10px] text-white/25 uppercase tracking-widest px-3 py-2 mt-3">Gestión</div>
          <button class="sidebar-link w-full text-left" :class="{ active: activeTab === 'events' }" @click="switchTab('events')">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="2" width="14" height="12" rx="2" stroke="currentColor" stroke-width="1.2"/>
              <path d="M5 2V0.5M11 2V0.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              <path d="M1 6H15" stroke="currentColor" stroke-width="1.2"/>
            </svg>
            Eventos
            <span class="ml-auto text-[10px] bg-blue-400/15 text-blue-400 px-1.5 py-0.5 rounded-full">247</span>
          </button>
          <button class="sidebar-link w-full text-left" :class="{ active: activeTab === 'photographers' }" @click="switchTab('photographers')">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="5" r="3" stroke="currentColor" stroke-width="1.2"/>
              <path d="M2 14C2 11 4.7 9 8 9C11.3 9 14 11 14 14" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            Fotógrafos
            <span class="ml-auto text-[10px] bg-green-400/15 text-green-400 px-1.5 py-0.5 rounded-full">120</span>
          </button>
          <button class="sidebar-link w-full text-left" :class="{ active: activeTab === 'payments' }" @click="switchTab('payments')">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="4" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.2"/>
              <path d="M1 8H15" stroke="currentColor" stroke-width="1.2"/>
              <path d="M4 12H7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            Pagos
            <span class="ml-auto text-[10px] bg-yellow-400/15 text-yellow-400 px-1.5 py-0.5 rounded-full">18</span>
          </button>
          <button class="sidebar-link w-full text-left" :class="{ active: activeTab === 'users' }" @click="switchTab('users')">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
              <circle cx="5" cy="5" r="2.5" stroke="currentColor" stroke-width="1.2"/>
              <circle cx="11" cy="5" r="2.5" stroke="currentColor" stroke-width="1.2"/>
              <path d="M1 14C1 11.5 2.8 10 5 10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              <path d="M15 14C15 11.5 13.2 10 11 10C9.5 10 8.2 10.7 7.5 11.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            Atletas
            <span class="ml-auto text-[10px] bg-[#7C3AED]/20 text-[#7C3AED] px-1.5 py-0.5 rounded-full">4.2K</span>
          </button>

          <div class="text-[10px] text-white/25 uppercase tracking-widest px-3 py-2 mt-3">Sistema</div>
          <button class="sidebar-link w-full text-left" :class="{ active: activeTab === 'ai' }" @click="switchTab('ai')">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="3" stroke="currentColor" stroke-width="1.2"/>
              <path d="M8 1V3M8 13V15M1 8H3M13 8H15" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              <path d="M3.5 3.5L4.9 4.9M11.1 11.1L12.5 12.5M3.5 12.5L4.9 11.1M11.1 4.9L12.5 3.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            IA & Procesamiento
          </button>
          <button class="sidebar-link w-full text-left">
            <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="1.2"/>
              <path d="M8 5V8.5L10.5 10" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
            Configuración
          </button>
        </nav>
      </aside>

      <!-- MAIN CONTENT -->
      <main class="flex-1 lg:ml-52 px-4 lg:px-8 py-6">

        <!-- ════════ OVERVIEW ════════ -->
        <div v-show="activeTab === 'overview'">
          <div class="flex items-center justify-between mb-6">
            <h1 class="text-xl font-display text-white">Dashboard Admin</h1>
            <div class="flex items-center gap-3">
              <select class="bg-[#221840] border border-[#2A1F4A] text-white/60 text-xs rounded-lg px-3 py-2 outline-none">
                <option>Últimos 30 días</option>
                <option>Este mes</option>
                <option>Último trimestre</option>
                <option>Este año</option>
              </select>
              <button class="bg-[#7C3AED] hover:bg-[#5B21B6] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors">
                Exportar CSV
              </button>
            </div>
          </div>

          <!-- KPIs -->
          <div class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
            <div v-for="kpi in [
              { label: 'GMV total', value: 'S/ 248K', delta: '↑ +22%', deltaClass: 'text-green-400' },
              { label: 'Comisión Fotify', value: 'S/ 74K', valueClass: 'text-[#7C3AED]', delta: '↑ +22%', deltaClass: 'text-green-400' },
              { label: 'Transacciones', value: '4,218', delta: '↑ +18%', deltaClass: 'text-green-400' },
              { label: 'Atletas activos', value: '4,200', delta: '↑ +340', deltaClass: 'text-green-400' },
              { label: 'Fotógrafos activos', value: '120', delta: '↑ +14', deltaClass: 'text-green-400' },
              { label: 'Conversión IA', value: '97%', delta: 'estable', deltaClass: 'text-white/40' },
            ]" :key="kpi.label"
            class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-4">
              <div class="text-xs text-white/40 mb-2">{{ kpi.label }}</div>
              <div class="font-display text-xl text-white" :class="kpi.valueClass">{{ kpi.value }}</div>
              <div class="text-xs mt-1" :class="kpi.deltaClass">{{ kpi.delta }}</div>
            </div>
          </div>

          <!-- Chart + Distribution -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            <div class="lg:col-span-2 bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-5">
              <div class="flex items-center justify-between mb-5">
                <div class="text-sm font-medium text-white">Ingresos mensuales (GMV)</div>
                <div class="flex gap-3 text-xs text-white/60">
                  <span class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-[#7C3AED] inline-block"></span>GMV
                  </span>
                  <span class="flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-[#FF3D6B] inline-block"></span>Comisión
                  </span>
                </div>
              </div>
              <div class="flex items-end gap-2 h-32 mb-2">
                <div v-for="bar in [
                  { gmv: 45, com: 14 }, { gmv: 60, com: 18 }, { gmv: 52, com: 16 },
                  { gmv: 80, com: 24 }, { gmv: 68, com: 20 }, { gmv: 100, com: 30 },
                ]" :key="bar.gmv" class="flex-1 flex flex-col gap-0.5 items-stretch">
                  <div class="rounded-t" :style="`height:${bar.gmv}px;background:#7C3AED;opacity:.8`"></div>
                  <div class="rounded-b" :style="`height:${bar.com}px;background:#FF3D6B;opacity:.6`"></div>
                </div>
              </div>
              <div class="flex justify-between text-xs text-white/25">
                <span>Oct</span><span>Nov</span><span>Dic</span><span>Ene</span><span>Feb</span><span>Mar</span>
              </div>
            </div>

            <div class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-5">
              <div class="text-sm font-medium text-white mb-4">Por deporte</div>
              <div class="flex flex-col gap-3">
                <div v-for="sport in [
                  { label: '🏃 Running', pct: 48 },
                  { label: '🏊 Triatlón', pct: 22 },
                  { label: '🚴 Ciclismo', pct: 15 },
                  { label: '🏔️ Trail', pct: 10 },
                  { label: 'Otros', pct: 5 },
                ]" :key="sport.label">
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-white/60">{{ sport.label }}</span>
                    <span class="text-white">{{ sport.pct }}%</span>
                  </div>
                  <div class="w-full h-1.5 bg-[#2A1F4A] rounded-full overflow-hidden">
                    <div class="h-full bg-[#7C3AED] rounded-full" :style="`width:${sport.pct}%`"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Transactions + Alerts -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            <div class="lg:col-span-2 bg-[#1A1030] border border-[#2A1F4A] rounded-2xl overflow-hidden">
              <div class="px-5 py-4 border-b border-[#2A1F4A] flex items-center justify-between">
                <div class="text-sm font-medium text-white">Transacciones recientes</div>
                <button class="text-xs text-[#7C3AED] hover:underline" @click="switchTab('payments')">Ver todas</button>
              </div>
              <div class="overflow-x-auto">
                <table class="w-full text-xs">
                  <thead>
                    <tr class="border-b border-[#2A1F4A]">
                      <th class="text-left py-3 px-4 text-white/30 font-medium uppercase tracking-wider">ID</th>
                      <th class="text-left py-3 px-4 text-white/30 font-medium uppercase tracking-wider">Atleta</th>
                      <th class="text-left py-3 px-4 text-white/30 font-medium uppercase tracking-wider hidden lg:table-cell">Evento</th>
                      <th class="text-left py-3 px-4 text-white/30 font-medium uppercase tracking-wider">Monto</th>
                      <th class="text-left py-3 px-4 text-white/30 font-medium uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-[#2A1F4A]">
                    <tr v-for="tx in [
                      { id: '#FT-28491', athlete: 'Laura A.', event: 'Maratón Lima 42K', amount: 59, status: 'Completo', statusClass: 'badge-green' },
                      { id: '#FT-28490', athlete: 'Jorge M.', event: 'Maratón Lima 42K', amount: 99, status: 'Completo', statusClass: 'badge-green' },
                      { id: '#FT-28489', athlete: 'Ana P.', event: 'Trail Larcomar 10K', amount: 38, status: 'Pendiente', statusClass: 'badge-yellow' },
                      { id: '#FT-28488', athlete: 'Diego R.', event: 'Ciclismo Miraflores', amount: 129, status: 'Completo', statusClass: 'badge-green' },
                      { id: '#FT-28487', athlete: 'Sofía C.', event: 'Triatlón Huacachina', amount: 15, status: 'Reembolso', statusClass: 'badge-red' },
                    ]" :key="tx.id"
                    class="hover:bg-[#221840]/40 transition-colors cursor-pointer">
                      <td class="py-3 px-4 text-white/50">{{ tx.id }}</td>
                      <td class="py-3 px-4 text-white">{{ tx.athlete }}</td>
                      <td class="py-3 px-4 text-white/50 hidden lg:table-cell">{{ tx.event }}</td>
                      <td class="py-3 px-4 font-semibold text-white">S/ {{ tx.amount }}</td>
                      <td class="py-3 px-4"><span :class="['badge', tx.statusClass]">{{ tx.status }}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-5">
              <div class="text-sm font-medium text-white mb-4">Alertas del sistema</div>
              <div class="flex flex-col gap-3">
                <div class="bg-yellow-400/8 border border-yellow-400/25 rounded-xl p-3 cursor-pointer hover:bg-yellow-400/12 transition-colors"
                     @click="switchTab('payments')">
                  <div class="flex items-start gap-2">
                    <span class="text-yellow-400 mt-0.5">⚠</span>
                    <div>
                      <div class="text-xs font-semibold text-yellow-400 mb-1">18 pagos a fotógrafos pendientes</div>
                      <div class="text-xs text-white/50">Lunes 14 abr · S/ 24,800 total</div>
                    </div>
                  </div>
                </div>
                <div class="bg-blue-400/8 border border-blue-400/25 rounded-xl p-3 cursor-pointer hover:bg-blue-400/12 transition-colors"
                     @click="switchTab('photographers')">
                  <div class="flex items-start gap-2">
                    <span class="text-blue-400 mt-0.5">ℹ</span>
                    <div>
                      <div class="text-xs font-semibold text-blue-400 mb-1">{{ pendingPhotographers.length }} fotógrafos esperan aprobación</div>
                      <div class="text-xs text-white/50">Registros nuevos pendientes</div>
                    </div>
                  </div>
                </div>
                <div class="bg-red-400/8 border border-red-400/25 rounded-xl p-3">
                  <div class="flex items-start gap-2">
                    <span class="text-red-400 mt-0.5">✕</span>
                    <div>
                      <div class="text-xs font-semibold text-red-400 mb-1">1 reembolso solicitado</div>
                      <div class="text-xs text-white/50">#FT-28487 · Sofía C. · S/ 15</div>
                    </div>
                  </div>
                </div>
                <div class="bg-green-400/8 border border-green-400/25 rounded-xl p-3">
                  <div class="flex items-start gap-2">
                    <span class="text-green-400 mt-0.5">✓</span>
                    <div>
                      <div class="text-xs font-semibold text-green-400 mb-1">IA procesando normalmente</div>
                      <div class="text-xs text-white/50">97.2% precisión · 0 errores hoy</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Top photographers -->
          <div class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl overflow-hidden">
            <div class="px-5 py-4 border-b border-[#2A1F4A] flex items-center justify-between">
              <div class="text-sm font-medium text-white">Top fotógrafos este mes</div>
              <button class="text-xs text-[#7C3AED] hover:underline" @click="switchTab('photographers')">Ver todos (120)</button>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-[#2A1F4A]">
                    <th class="text-left py-3 px-5 text-xs text-white/30 font-medium uppercase tracking-wider">#</th>
                    <th class="text-left py-3 px-4 text-xs text-white/30 font-medium uppercase tracking-wider">Fotógrafo</th>
                    <th class="text-left py-3 px-4 text-xs text-white/30 font-medium uppercase tracking-wider hidden lg:table-cell">Eventos</th>
                    <th class="text-left py-3 px-4 text-xs text-white/30 font-medium uppercase tracking-wider">GMV</th>
                    <th class="text-left py-3 px-4 text-xs text-white/30 font-medium uppercase tracking-wider hidden lg:table-cell">Comisión</th>
                    <th class="text-left py-3 px-4 text-xs text-white/30 font-medium uppercase tracking-wider">Plan</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#2A1F4A]">
                  <tr v-for="(ph, i) in [
                    { initials: 'CR', name: 'Carlos Ríos', handle: '@carlosrios', events: 12, gmv: 5486, com: 1646, plan: 'Pro', avatarBg: 'linear-gradient(135deg,#7C3AED,#FF3D6B)', planClass: 'badge-green' },
                    { initials: 'MP', name: 'María P.', handle: '@mphoto_pe', events: 8, gmv: 4820, com: 1446, plan: 'Pro', avatarBg: 'rgba(124,58,237,.3)', planClass: 'badge-green' },
                    { initials: 'AL', name: 'Andrés L.', handle: '@andresphoto', events: 6, gmv: 3200, com: 960, plan: 'Estándar', avatarBg: 'rgba(255,61,107,.2)', planClass: 'badge-blue' },
                    { initials: 'RV', name: 'Ricardo V.', handle: '@trifotos_pe', events: 5, gmv: 2940, com: 882, plan: 'Estándar', avatarBg: 'rgba(74,222,128,.2)', planClass: 'badge-blue' },
                  ]" :key="ph.handle"
                  class="hover:bg-[#221840]/30 transition-colors cursor-pointer">
                    <td class="py-3 px-5 text-white/50 font-semibold text-xs">{{ i + 1 }}</td>
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-2">
                        <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 text-white"
                             :style="`background:${ph.avatarBg}`">{{ ph.initials }}</div>
                        <div>
                          <div class="text-xs font-medium text-white">{{ ph.name }}</div>
                          <div class="text-xs text-white/40">{{ ph.handle }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-xs text-white/70 hidden lg:table-cell">{{ ph.events }}</td>
                    <td class="py-3 px-4 text-xs font-semibold text-white">S/ {{ ph.gmv.toLocaleString() }}</td>
                    <td class="py-3 px-4 text-xs text-[#7C3AED] hidden lg:table-cell">S/ {{ ph.com.toLocaleString() }}</td>
                    <td class="py-3 px-4"><span :class="['badge', ph.planClass]">{{ ph.plan }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ════════ EVENTS ════════ -->
        <div v-show="activeTab === 'events'">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-display text-white">Gestión de eventos</h2>
            <NuxtLink to="/dashboard/events/new"
              class="bg-[#7C3AED] hover:bg-[#5B21B6] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors">
              + Crear evento
            </NuxtLink>
          </div>
          <div class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl overflow-hidden">
            <div class="px-5 py-4 border-b border-[#2A1F4A] flex gap-3 flex-wrap">
              <input v-model="eventSearch" type="text" placeholder="Buscar evento..."
                class="bg-[#221840] border border-[#2A1F4A] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#7C3AED]/60 flex-1 min-w-48 placeholder:text-white/30"/>
              <select v-model="eventSportFilter" class="bg-[#221840] border border-[#2A1F4A] rounded-lg px-3 py-2 text-sm text-white/70 outline-none">
                <option value="all">Todos los deportes</option>
                <option value="running">Running</option>
                <option value="triathlon">Triatlón</option>
                <option value="cycling">Ciclismo</option>
                <option value="trail">Trail</option>
              </select>
              <select v-model="eventStatusFilter" class="bg-[#221840] border border-[#2A1F4A] rounded-lg px-3 py-2 text-sm text-white/70 outline-none">
                <option value="all">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="processing">Procesando</option>
                <option value="closed">Cerrado</option>
              </select>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-[#2A1F4A]">
                    <th class="text-left py-3 px-5 text-xs text-white/30 font-medium uppercase tracking-wider">Evento</th>
                    <th class="text-left py-3 px-4 text-xs text-white/30 font-medium uppercase tracking-wider">Fotógrafo</th>
                    <th class="text-left py-3 px-4 text-xs text-white/30 font-medium uppercase tracking-wider hidden lg:table-cell">Fotos</th>
                    <th class="text-left py-3 px-4 text-xs text-white/30 font-medium uppercase tracking-wider">GMV</th>
                    <th class="text-left py-3 px-4 text-xs text-white/30 font-medium uppercase tracking-wider">Estado</th>
                    <th class="py-3 px-4"></th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#2A1F4A]">
                  <tr v-if="filteredEvents.length === 0">
                    <td colspan="6" class="py-12 text-center text-white/30 text-sm">No se encontraron eventos</td>
                  </tr>
                  <tr v-for="ev in filteredEvents" :key="ev.id"
                      class="hover:bg-[#221840]/30 transition-colors">
                    <td class="py-4 px-5">
                      <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-lg bg-[#7C3AED]/15 flex items-center justify-center flex-shrink-0">{{ ev.icon }}</div>
                        <div>
                          <div class="text-sm text-white font-medium">{{ ev.name }}</div>
                          <div class="text-xs text-white/40">{{ ev.date }} · {{ ev.city }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-4 px-4 text-xs text-white/60">{{ ev.photographer }}</td>
                    <td class="py-4 px-4 text-xs text-white/60 hidden lg:table-cell">{{ ev.photos.toLocaleString() }}</td>
                    <td class="py-4 px-4 text-xs font-semibold text-white">S/ {{ ev.gmv.toLocaleString() }}</td>
                    <td class="py-4 px-4">
                      <span :class="['badge', statusClass[ev.status]]">{{ statusLabel[ev.status] }}</span>
                    </td>
                    <td class="py-4 px-4">
                      <div class="flex gap-3">
                        <NuxtLink :to="`/events/${ev.id}`" class="text-xs text-[#7C3AED] hover:underline">Ver</NuxtLink>
                        <button class="text-xs text-white/40 hover:text-white transition-colors">Editar</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="px-5 py-3 border-t border-[#2A1F4A] flex items-center justify-between text-xs text-white/40">
              <span>Mostrando {{ filteredEvents.length }} de 247 eventos</span>
              <div class="flex gap-1.5">
                <button class="px-2 py-1 rounded border border-[#2A1F4A] hover:text-white transition-colors">← Ant.</button>
                <button class="px-2 py-1 rounded bg-[#7C3AED] text-white">1</button>
                <button class="px-2 py-1 rounded border border-[#2A1F4A] hover:text-white transition-colors">2</button>
                <button class="px-2 py-1 rounded border border-[#2A1F4A] hover:text-white transition-colors">3</button>
                <button class="px-2 py-1 rounded border border-[#2A1F4A] hover:text-white transition-colors">Sig. →</button>
              </div>
            </div>
          </div>
        </div>

        <!-- ════════ PHOTOGRAPHERS ════════ -->
        <div v-show="activeTab === 'photographers'">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-display text-white">Fotógrafos</h2>
            <span v-if="pendingPhotographers.length > 0"
              class="text-xs text-white/40 bg-[#1A1030] border border-[#2A1F4A] px-3 py-2 rounded-full">
              {{ pendingPhotographers.length }} pendientes de aprobación
            </span>
          </div>

          <!-- Pending -->
          <Transition name="slide-down">
            <div v-if="pendingPhotographers.length > 0"
                 class="bg-yellow-400/5 border border-yellow-400/20 rounded-2xl p-5 mb-5">
              <div class="text-xs text-yellow-400 font-semibold uppercase tracking-widest mb-4">Esperando aprobación</div>
              <div class="flex flex-col gap-3">
                <div v-for="ph in pendingPhotographers" :key="ph.id"
                     class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-full bg-yellow-400/20 flex items-center justify-center text-sm font-semibold text-yellow-400">
                      {{ ph.initials }}
                    </div>
                    <div>
                      <div class="text-sm text-white">{{ ph.name }}</div>
                      <div class="text-xs text-white/40">{{ ph.email }} · {{ ph.city }}</div>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button class="text-xs bg-green-400/15 text-green-400 px-3 py-1.5 rounded-full hover:bg-green-400/25 transition-colors"
                            @click="approvePhotographer(ph.id)">Aprobar</button>
                    <button class="text-xs bg-red-400/15 text-red-400 px-3 py-1.5 rounded-full hover:bg-red-400/25 transition-colors"
                            @click="rejectPhotographer(ph.id)">Rechazar</button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>

          <div v-if="pendingPhotographers.length === 0"
               class="bg-green-400/5 border border-green-400/20 rounded-2xl p-4 mb-5 flex items-center gap-3">
            <span class="text-green-400">✓</span>
            <span class="text-sm text-green-400">No hay fotógrafos pendientes de aprobación</span>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div v-for="stat in [
              { label: 'Fotógrafos activos', value: '120', color: 'text-white' },
              { label: 'Plan estándar', value: '74', color: 'text-[#7C3AED]' },
              { label: 'Plan Pro', value: '46', color: 'text-[#FF3D6B]' },
            ]" :key="stat.label"
            class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-4 text-center">
              <div class="font-display text-2xl mb-1" :class="stat.color">{{ stat.value }}</div>
              <div class="text-xs text-white/40">{{ stat.label }}</div>
            </div>
          </div>

          <!-- Active list preview -->
          <div class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl overflow-hidden">
            <div class="px-5 py-4 border-b border-[#2A1F4A]">
              <div class="text-sm font-medium text-white">Fotógrafos activos</div>
            </div>
            <div class="divide-y divide-[#2A1F4A]">
              <div v-for="ph in [
                { initials: 'CR', name: 'Carlos Ríos', handle: '@carlosrios', city: 'Lima', events: 12, plan: 'Pro', avatarBg: 'linear-gradient(135deg,#7C3AED,#FF3D6B)', planClass: 'badge-green' },
                { initials: 'MP', name: 'María P.', handle: '@mphoto_pe', city: 'Lima', events: 8, plan: 'Pro', avatarBg: 'rgba(124,58,237,.3)', planClass: 'badge-green' },
                { initials: 'AL', name: 'Andrés L.', handle: '@andresphoto', city: 'Arequipa', events: 6, plan: 'Estándar', avatarBg: 'rgba(255,61,107,.2)', planClass: 'badge-blue' },
                { initials: 'RV', name: 'Ricardo V.', handle: '@trifotos_pe', city: 'Lima', events: 5, plan: 'Estándar', avatarBg: 'rgba(74,222,128,.2)', planClass: 'badge-blue' },
              ]" :key="ph.handle"
              class="flex items-center justify-between px-5 py-3 hover:bg-[#221840]/30 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
                       :style="`background:${ph.avatarBg}`">{{ ph.initials }}</div>
                  <div>
                    <div class="text-sm text-white">{{ ph.name }}</div>
                    <div class="text-xs text-white/40">{{ ph.handle }} · {{ ph.city }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-4">
                  <span class="text-xs text-white/40 hidden sm:block">{{ ph.events }} eventos</span>
                  <span :class="['badge', ph.planClass]">{{ ph.plan }}</span>
                  <button class="text-xs text-white/40 hover:text-white transition-colors">Ver</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ════════ PAYMENTS ════════ -->
        <div v-show="activeTab === 'payments'">
          <h2 class="text-xl font-display text-white mb-6">Pagos a fotógrafos</h2>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-5">
              <div class="text-xs text-white/40 mb-2">Pendiente de pago</div>
              <div class="font-display text-2xl text-yellow-400">S/ 24,800</div>
              <div class="text-xs text-white/40 mt-1">18 fotógrafos · Lunes 14 abr</div>
            </div>
            <div class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-5">
              <div class="text-xs text-white/40 mb-2">Pagado este mes</div>
              <div class="font-display text-2xl text-white">S/ 48,200</div>
              <div class="text-xs text-green-400 mt-1">102 transferencias</div>
            </div>
            <div class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-5">
              <div class="text-xs text-white/40 mb-2">Reembolsos</div>
              <div class="font-display text-2xl text-red-400">S/ 380</div>
              <div class="text-xs text-white/40 mt-1">8 casos este mes</div>
            </div>
          </div>

          <!-- Process payment CTA -->
          <div class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-6 text-center mb-6">
            <button
              class="bg-[#FF3D6B] hover:opacity-90 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-full text-sm transition-opacity flex items-center gap-2 mx-auto"
              :disabled="processingPayment"
              @click="processPayment">
              <svg v-if="processingPayment" class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="60" stroke-dashoffset="15"/>
              </svg>
              {{ processingPayment ? 'Procesando...' : 'Procesar pago quincenal — S/ 24,800' }}
            </button>
            <p class="text-xs text-white/30 mt-3">Transfiere automáticamente a las 18 cuentas bancarias configuradas</p>
          </div>

          <!-- Payments table -->
          <div class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl overflow-hidden">
            <div class="px-5 py-4 border-b border-[#2A1F4A]">
              <div class="text-sm font-medium text-white">Detalle de pagos pendientes</div>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs">
                <thead>
                  <tr class="border-b border-[#2A1F4A]">
                    <th class="text-left py-3 px-5 text-white/30 font-medium uppercase tracking-wider">Fotógrafo</th>
                    <th class="text-left py-3 px-4 text-white/30 font-medium uppercase tracking-wider hidden lg:table-cell">Banco</th>
                    <th class="text-left py-3 px-4 text-white/30 font-medium uppercase tracking-wider hidden lg:table-cell">Eventos</th>
                    <th class="text-left py-3 px-4 text-white/30 font-medium uppercase tracking-wider">Monto</th>
                    <th class="text-left py-3 px-4 text-white/30 font-medium uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#2A1F4A]">
                  <tr v-for="pay in [
                    { initials: 'CR', name: 'Carlos Ríos', bank: 'BCP', events: 12, amount: 3828, status: 'pending' },
                    { initials: 'MP', name: 'María P.', bank: 'Interbank', events: 8, amount: 3374, status: 'pending' },
                    { initials: 'AL', name: 'Andrés L.', bank: 'BBVA', events: 6, amount: 2240, status: 'pending' },
                    { initials: 'RV', name: 'Ricardo V.', bank: 'BCP', events: 5, amount: 2058, status: 'pending' },
                  ]" :key="pay.name"
                  class="hover:bg-[#221840]/30 transition-colors">
                    <td class="py-3 px-5">
                      <div class="flex items-center gap-2">
                        <div class="w-6 h-6 rounded-full bg-[#7C3AED]/30 flex items-center justify-center text-xs font-semibold text-white/70">{{ pay.initials }}</div>
                        <span class="text-white">{{ pay.name }}</span>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-white/50 hidden lg:table-cell">{{ pay.bank }}</td>
                    <td class="py-3 px-4 text-white/50 hidden lg:table-cell">{{ pay.events }}</td>
                    <td class="py-3 px-4 font-semibold text-white">S/ {{ pay.amount.toLocaleString() }}</td>
                    <td class="py-3 px-4"><span class="badge badge-yellow">Pendiente</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- ════════ USERS / ATHLETES ════════ -->
        <div v-show="activeTab === 'users'">
          <h2 class="text-xl font-display text-white mb-6">Atletas registrados</h2>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div v-for="stat in [
              { label: 'Total registrados', value: '4,200', color: 'text-white' },
              { label: 'Nuevos este mes', value: '+340', color: 'text-green-400' },
              { label: 'Compradores únicos', value: '1,840', color: 'text-[#7C3AED]' },
              { label: 'Tasa de conversión', value: '43%', color: 'text-white' },
            ]" :key="stat.label"
            class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-4 text-center">
              <div class="font-display text-2xl mb-1" :class="stat.color">{{ stat.value }}</div>
              <div class="text-xs text-white/40">{{ stat.label }}</div>
            </div>
          </div>

          <!-- Search bar -->
          <div class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl overflow-hidden">
            <div class="px-5 py-4 border-b border-[#2A1F4A]">
              <input type="text" placeholder="Buscar atleta por nombre, correo o dorsal..."
                class="w-full bg-[#221840] border border-[#2A1F4A] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#7C3AED]/60 placeholder:text-white/30"/>
            </div>
            <div class="divide-y divide-[#2A1F4A]">
              <div v-for="user in [
                { initials: 'LA', name: 'Laura A.', email: 'laura@gmail.com', purchases: 3, spent: 59 + 38 + 99 },
                { initials: 'JM', name: 'Jorge M.', email: 'jorge.m@gmail.com', purchases: 2, spent: 99 + 59 },
                { initials: 'AP', name: 'Ana P.', email: 'anapablo@gmail.com', purchases: 1, spent: 38 },
                { initials: 'DR', name: 'Diego R.', email: 'dr_atleta@gmail.com', purchases: 4, spent: 129 + 59 + 38 + 15 },
                { initials: 'SC', name: 'Sofía C.', email: 'sofiac@gmail.com', purchases: 1, spent: 15, refund: true },
              ]" :key="user.email"
              class="flex items-center justify-between px-5 py-3 hover:bg-[#221840]/30 transition-colors">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-full bg-[#7C3AED]/20 flex items-center justify-center text-xs font-semibold text-[#7C3AED]">
                    {{ user.initials }}
                  </div>
                  <div>
                    <div class="text-sm text-white">{{ user.name }}</div>
                    <div class="text-xs text-white/40">{{ user.email }}</div>
                  </div>
                </div>
                <div class="flex items-center gap-4 text-xs">
                  <span class="text-white/40 hidden sm:block">{{ user.purchases }} compras</span>
                  <span class="font-semibold text-white">S/ {{ user.spent }}</span>
                  <span v-if="user.refund" class="badge badge-red">Reembolso</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ════════ AI ════════ -->
        <div v-show="activeTab === 'ai'">
          <h2 class="text-xl font-display text-white mb-6">IA & Procesamiento</h2>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div v-for="stat in [
              { label: 'Precisión IA', value: '97.2%', color: 'text-green-400', sub: 'Último rolling 7 días' },
              { label: 'Fotos procesadas hoy', value: '12,400', color: 'text-white', sub: '3 eventos activos' },
              { label: 'Tiempo promedio', value: '18s', color: 'text-white', sub: 'Por búsqueda de atleta' },
            ]" :key="stat.label"
            class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl p-5">
              <div class="text-xs text-white/40 mb-2">{{ stat.label }}</div>
              <div class="font-display text-2xl mb-1" :class="stat.color">{{ stat.value }}</div>
              <div class="text-xs text-white/40">{{ stat.sub }}</div>
            </div>
          </div>

          <!-- Status -->
          <div class="bg-green-400/8 border border-green-400/20 rounded-2xl p-5 text-center mb-6">
            <div class="flex items-center justify-center gap-2 mb-2">
              <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse inline-block"></span>
              <span class="text-sm font-semibold text-green-400">Sistema IA operando normalmente</span>
            </div>
            <p class="text-xs text-white/40">Todos los workers activos · 0 errores críticos en las últimas 24h</p>
          </div>

          <!-- Job queue -->
          <div class="bg-[#1A1030] border border-[#2A1F4A] rounded-2xl overflow-hidden">
            <div class="px-5 py-4 border-b border-[#2A1F4A]">
              <div class="text-sm font-medium text-white">Cola de procesamiento activa</div>
            </div>
            <div class="divide-y divide-[#2A1F4A]">
              <div v-for="job in [
                { event: 'Maratón Lima 42K', progress: 100, photos: '3,900 / 3,900', status: 'done' },
                { event: 'Triatlón IronMan Lima', progress: 78, photos: '3,276 / 4,200', status: 'processing' },
                { event: 'Ciclismo Miraflores', progress: 42, photos: '882 / 2,100', status: 'processing' },
              ]" :key="job.event"
              class="px-5 py-4">
                <div class="flex items-center justify-between mb-2">
                  <span class="text-sm text-white">{{ job.event }}</span>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-white/40">{{ job.photos }}</span>
                    <span :class="['badge', job.status === 'done' ? 'badge-green' : 'badge-blue']">
                      {{ job.status === 'done' ? 'Completo' : 'Procesando' }}
                    </span>
                  </div>
                </div>
                <div class="w-full h-1.5 bg-[#2A1F4A] rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-500"
                       :class="job.status === 'done' ? 'bg-green-400' : 'bg-[#7C3AED]'"
                       :style="`width:${job.progress}%`"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  </div>
</template>

<style scoped>
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.5);
  transition: background 0.15s, color 0.15s;
  cursor: pointer;
}
.sidebar-link:hover {
  background: #221840;
  color: #fff;
}
.sidebar-link.active {
  background: rgba(124, 58, 237, 0.15);
  color: #7C3AED;
  font-weight: 500;
}
.badge {
  font-size: 10px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 999px;
  display: inline-block;
}
.badge-green  { background: rgba(74, 222, 128, 0.15); color: #4ade80; }
.badge-red    { background: rgba(248, 113, 113, 0.15); color: #f87171; }
.badge-blue   { background: rgba(96, 165, 250, 0.15); color: #60a5fa; }
.badge-yellow { background: rgba(250, 204, 21, 0.15); color: #facc15; }
.badge-gray   { background: rgba(255, 255, 255, 0.07); color: rgba(255, 255, 255, 0.4); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-8px); }

@keyframes spin { to { transform: rotate(360deg); } }
.animate-spin { animation: spin 0.8s linear infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.animate-pulse { animation: pulse 2s ease-in-out infinite; }
</style>
