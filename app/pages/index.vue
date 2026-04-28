<template>
  <div>
    <!-- HERO -->
    <section class="relative overflow-hidden" style="height: calc(100vh - 64px); min-height: 560px;">

      <!-- Slider backgrounds (full bleed) -->
      <div class="absolute inset-0">
        <div
          v-for="(slide, i) in heroSlides"
          :key="i"
          class="absolute inset-0 transition-opacity duration-700"
          :class="i === activeSlide ? 'opacity-100' : 'opacity-0'"
        >
          <img
            :src="slide.image"
            :alt="slide.name"
            class="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Tint layer -->
      <div class="absolute inset-0 pointer-events-none" style="background: rgba(13,11,26,0.20);" />

      <!-- Mobile/tablet: vertical gradient -->
      <div class="absolute inset-0 pointer-events-none lg:hidden" style="background: linear-gradient(180deg, rgba(13,11,26,0.55) 0%, rgba(13,11,26,0.45) 35%, rgba(13,11,26,0.85) 75%, #0F0A1E 100%);" />

      <!-- Desktop: lateral gradient -->
      <div class="absolute inset-0 pointer-events-none hidden lg:block" style="background: linear-gradient(to right, rgba(13,11,26,0.97) 0%, rgba(13,11,26,0.88) 25%, rgba(13,11,26,0.55) 45%, rgba(13,11,26,0.15) 65%, transparent 100%);" />

      <!-- Content overlay -->
      <div
        class="relative z-10 h-full flex flex-col justify-end lg:justify-center px-5 md:px-10 lg:px-12 pb-10 md:pb-14 lg:pb-0 pt-8 lg:pt-0"
        @mouseenter="pauseSlider"
        @mouseleave="resumeSlider"
      >
        <div class="w-full md:max-w-[560px] lg:max-w-[50%]">
          <!-- AI Badge -->
          <div class="inline-flex items-center gap-2 bg-violet/25 backdrop-blur-md border border-violet/40 rounded-full px-3.5 py-1.5 mb-5 lg:mb-7">
            <span class="w-1.5 h-1.5 rounded-full bg-violet animate-pulse-dot" />
            <span class="text-[11px] font-medium text-purple-200 tracking-wide">IA activa · Reconocimiento facial</span>
          </div>

          <!-- Title -->
          <h1
            class="font-display font-bold text-[40px] md:text-[56px] lg:text-[64px] xl:text-[72px] leading-[1.05] tracking-[-2px] mb-4 lg:mb-5 text-white"
            style="text-shadow: 0 2px 16px rgba(0,0,0,0.5);"
          >
            Tu foto<br>
            en <span style="color:#B794F6;">segundos.</span>
          </h1>

          <!-- Subtitle -->
          <p
            class="text-[14px] md:text-[16px] lg:text-[18px] font-light text-white/80 leading-[1.6] mb-6 lg:mb-8 md:max-w-[440px] lg:max-w-[480px]"
            style="text-shadow: 0 1px 8px rgba(0,0,0,0.5);"
          >
            Sube una selfie y encuentra todos tus momentos en el evento. Sin buscar foto por foto.
          </p>

          <!-- Search -->
          <div class="w-full md:max-w-[480px] lg:max-w-[520px] relative z-30 mb-3">
            <div class="flex w-full bg-night-2/85 backdrop-blur-md border border-violet/60 rounded-xl p-1.5 shadow-[0_0_0_3px_rgba(124,58,237,0.18),0_20px_40px_rgba(0,0,0,0.4)]">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Busca tu evento…"
                class="flex-1 min-w-0 bg-transparent border-none outline-none text-[14px] lg:text-[15px] text-white placeholder-muted px-3 py-3"
                @focus="searchFocused = true"
                @blur="onSearchBlur"
              />
              <NuxtLink
                :to="searchQuery ? `/events?q=${searchQuery}` : '/events'"
                class="flex-shrink-0 inline-flex items-center justify-center bg-coral text-white text-[13px] lg:text-[14px] font-semibold px-4 lg:px-5 py-2.5 rounded-[8px] hover:bg-[#e62d5a] transition-colors"
              >
                Buscar
              </NuxtLink>
            </div>

            <!-- Autocomplete -->
            <div
              v-if="searchFocused && filteredEvents.length"
              class="absolute left-0 right-0 mt-1.5 bg-night-2 border border-violet/30 rounded-xl overflow-hidden shadow-[0_20px_48px_rgba(0,0,0,0.6)] z-40"
            >
              <NuxtLink
                v-for="ev in filteredEvents.slice(0, 4)"
                :key="ev.id"
                :to="`/events/${ev.slug}`"
                class="flex items-center gap-3 px-4 py-3 hover:bg-violet/10 cursor-pointer border-b border-border last:border-b-0 transition-colors"
                @click="searchFocused = false"
              >
                <div class="w-11 h-9 rounded-lg bg-night-3 flex items-center justify-center flex-shrink-0">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M13 4a1 1 0 1 0 2 0 1 1 0 0 0-2 0"/><path d="M7.5 17.5 10 12l3 3 2-4 2.5 6.5"/><path d="M3 12h18"/>
                  </svg>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-[13px] font-medium text-white truncate">{{ ev.name }}</div>
                  <div class="text-[11px] text-muted">{{ ev.location }} · {{ ev.total_photos }} fotos</div>
                </div>
                <span v-if="ev.status === 'active'" class="flex-shrink-0 text-[9px] font-bold tracking-wide uppercase bg-green-500/15 text-green-400 border border-green-500/25 px-2 py-0.5 rounded flex items-center gap-1">
                  <span class="w-1 h-1 rounded-full bg-green-400 inline-block" />En vivo
                </span>
              </NuxtLink>
            </div>
          </div>

          <p class="text-[12px] lg:text-[13px] text-white/55">
            ¿Prefieres con tu cara?
            <NuxtLink to="/search" class="text-purple-300 hover:text-white transition-colors font-medium">Sube tu selfie →</NuxtLink>
          </p>
        </div>
      </div>

      <!-- Slider dots -->
      <div class="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-1.5">
        <button
          v-for="(_, i) in heroSlides"
          :key="i"
          class="h-1 rounded-full transition-all duration-300 cursor-pointer"
          :class="i === activeSlide ? 'bg-white' : 'bg-white/40'"
          :style="{ width: i === activeSlide ? '24px' : '4px' }"
          @click="goToSlide(i)"
        />
      </div>

      <!-- Floating match card (desktop only, bottom-right) -->
      <div class="hidden lg:flex absolute bottom-10 right-10 xl:right-16 z-20 bg-night-2/90 backdrop-blur-md border border-violet/40 rounded-2xl px-4 py-3.5 items-center gap-3 shadow-[0_20px_60px_rgba(0,0,0,0.5)] min-w-[230px]">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-violet to-violet-deep flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div>
          <div class="text-[13px] font-semibold text-white">14 fotos encontradas</div>
          <div class="text-[11px] text-muted mt-0.5">Maratón Lima 2025</div>
        </div>
        <div class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[11px] ml-auto flex-shrink-0">✓</div>
      </div>
    </section>

    <!-- EVENTS -->
    <section class="px-5 md:px-10 lg:px-12 py-16 md:py-20">
      <div class="flex items-end justify-between mb-8 gap-4">
        <div>
          <div class="text-[11px] font-semibold tracking-[3px] uppercase text-violet mb-2">Eventos destacados</div>
          <div class="font-display font-bold text-[24px] md:text-[28px] tracking-tight">Encuentra tu evento</div>
        </div>
        <NuxtLink to="/events" class="hidden sm:flex items-center gap-1.5 text-[13px] text-muted hover:text-white transition-colors whitespace-nowrap mb-1">Ver todos →</NuxtLink>
      </div>

      <!-- Category pills -->
      <div class="pills-scroll mb-8">
        <button
          v-for="pill in categoryPills"
          :key="pill"
          class="flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] font-medium transition-colors cursor-pointer"
          :class="activePill === pill
            ? 'bg-violet/15 border border-violet text-white'
            : 'border border-border text-muted hover:text-white hover:border-violet/40'"
          @click="activePill = pill"
        >
          {{ pill }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="eventsLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="n in 6" :key="n" class="bg-night-2 border border-border rounded-2xl overflow-hidden animate-pulse">
          <div class="aspect-video bg-night-3" />
          <div class="p-4 flex flex-col gap-2">
            <div class="h-4 bg-night-3 rounded w-3/4" />
            <div class="h-3 bg-night-3 rounded w-1/2" />
          </div>
        </div>
      </div>

      <!-- Events grid -->
      <div v-else-if="events.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <EventCard v-for="ev in events" :key="ev.id" :event="ev" />
      </div>

      <div class="mt-8 sm:hidden text-center">
        <NuxtLink to="/events" class="inline-block border border-border text-white text-[14px] font-medium px-6 py-3 rounded-xl hover:border-white/30 transition-colors">
          Ver todos los eventos →
        </NuxtLink>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="bg-night-2 border-y border-border px-5 md:px-10 lg:px-12 py-16 md:py-20">
      <div class="mb-10">
        <div class="text-[11px] font-semibold tracking-[3px] uppercase text-violet mb-2">¿Cómo funciona?</div>
        <div class="font-display font-bold text-[24px] md:text-[28px] tracking-tight">Menos de un minuto.</div>
      </div>

      <!-- Mobile (<768px): horizontal snap scroll -->
      <div class="hiw-scroll hiw-mobile">
        <div v-for="(step, i) in steps" :key="i" class="hiw-card hiw-card-mobile" :class="i === 1 ? 'hiw-card-featured' : 'hiw-card-default'" style="padding: 24px;">
          <div class="hiw-bg-num">{{ String(i + 1).padStart(2, '0') }}</div>
          <span v-if="i === 1" class="absolute top-4 right-4 text-[9px] font-bold tracking-wider uppercase bg-violet/25 text-purple-200 border border-violet/40 px-2 py-0.5 rounded">IA</span>
          <div class="relative pt-10">
            <div class="hiw-icon-box mb-4" :class="i === 2 ? 'hiw-icon-coral' : ''">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="i === 2 ? '#FF3D6B' : '#B794F6'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="step.iconPath" />
            </div>
            <div class="font-display font-bold text-[15px] text-white mb-2 leading-snug">{{ step.title }}</div>
            <p class="text-[13px] text-muted leading-relaxed">{{ step.description }}</p>
          </div>
        </div>
      </div>

      <!-- Tablet + Desktop (≥768px): 3-column grid with connector -->
      <div class="hiw-desktop relative grid grid-cols-3 gap-4 lg:gap-8">
        <!-- Connector line (lg+ only) -->
        <div class="hidden lg:block hiw-connector" />

        <div v-for="(step, i) in steps" :key="i" class="hiw-card relative z-10" :class="i === 1 ? 'hiw-card-featured' : 'hiw-card-default'" style="padding: 20px;">
          <div class="hiw-bg-num">{{ String(i + 1).padStart(2, '0') }}</div>
          <span v-if="i === 1" class="absolute top-4 right-4 text-[9px] font-bold tracking-wider uppercase bg-violet/25 text-purple-200 border border-violet/40 px-2 py-0.5 rounded">IA</span>
          <div class="relative pt-8 lg:pt-12">
            <div class="hiw-icon-box mb-4" :class="i === 2 ? 'hiw-icon-coral' : ''">
              <svg class="lg:hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" :stroke="i === 2 ? '#FF3D6B' : '#B794F6'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="step.iconPath" />
              <svg class="hidden lg:block" width="20" height="20" viewBox="0 0 24 24" fill="none" :stroke="i === 2 ? '#FF3D6B' : '#B794F6'" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" v-html="step.iconPath" />
            </div>
            <div class="font-display font-bold text-[14px] lg:text-[16px] text-white mb-2 leading-snug">{{ step.title }}</div>
            <p class="text-[12px] lg:text-[13px] text-muted leading-relaxed">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PHOTOGRAPHER CTA -->
    <section class="px-5 md:px-10 lg:px-12 py-16 md:py-20">
      <div class="bg-gradient-to-br from-violet/12 to-violet-deep/8 border border-violet/25 rounded-3xl p-8 md:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:gap-12 items-center">
        <div>
          <div class="text-[11px] font-semibold tracking-[3px] uppercase text-violet mb-4">Para fotógrafos</div>
          <div class="font-display font-bold text-[26px] md:text-[32px] tracking-tight leading-snug mb-4">
            Sube tus fotos.<br>Nosotros las vendemos.
          </div>
          <p class="text-[15px] text-white/55 leading-relaxed max-w-[520px]">
            Conecta con miles de atletas que buscan sus fotos. Tú fotografías, nosotros indexamos, ellos compran. Cobros automáticos, sin complicaciones.
          </p>
        </div>
        <div class="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-center gap-3">
          <NuxtLink to="/for-photographers" class="w-full sm:w-auto text-center bg-coral text-white font-semibold text-[15px] px-8 py-4 rounded-xl hover:bg-[#e62d5a] transition-colors">
            Empezar a vender
          </NuxtLink>
          <NuxtLink to="/for-photographers" class="text-[13px] text-muted hover:text-white transition-colors px-2">
            Conocer más →
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { apiFetch } from '~/composables/useApi'
import type { ListEnvelope, EventResponse } from '~/types'

// Hero slider
const heroSlides = [
  { name: 'Maratón Lima 2025', image: demoHero(10) },
  { name: 'Triatlón Costa Verde', image: demoHero(35) },
  { name: 'Ciclismo Andes 2025', image: demoHero(60) },
]

const activeSlide = ref(0)

const { pause: pauseSlider, resume: resumeSlider } = useIntervalFn(() => {
  activeSlide.value = (activeSlide.value + 1) % heroSlides.length
}, 4000)

function goToSlide(i: number) {
  activeSlide.value = i
  pauseSlider()
  resumeSlider()
}

const searchQuery = ref('')
const searchFocused = ref(false)

// Fetch events
const eventsLoading = ref(true)
const eventsItems = ref<EventResponse[]>([])

onMounted(async () => {
  try {
    const res = await apiFetch<ListEnvelope<EventResponse>>('/events', { query: { limit: 20 } })
    eventsItems.value = res.data?.items ?? []
  }
  finally {
    eventsLoading.value = false
  }
})

const events = computed(() => eventsItems.value.slice(0, 6))
const allEvents = computed(() => eventsItems.value)

const filteredEvents = computed(() => {
  if (!searchQuery.value.trim()) return allEvents.value
  const q = searchQuery.value.toLowerCase()
  return allEvents.value.filter(ev => ev.name?.toLowerCase().includes(q) || ev.location?.toLowerCase().includes(q))
})

function onSearchBlur() {
  setTimeout(() => { searchFocused.value = false }, 150)
}

// How it works
const steps = [
  {
    title: 'Encuentra tu evento',
    description: 'Busca por nombre o fecha. Más de 48 eventos activos en Perú.',
    iconPath: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
  },
  {
    title: 'Sube tu selfie',
    description: 'Nuestra IA escanea todas las fotos del evento y te encuentra en segundos.',
    iconPath: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  },
  {
    title: 'Compra y descarga HD',
    description: 'Elige tus fotos, paga seguro y descarga al instante sin marca de agua.',
    iconPath: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  },
]

// Category pills
const categoryPills = ['Todos', 'Running', 'Ciclismo', 'Triatlón', 'Social', 'Trail', 'Fitness']
const activePill = ref('Todos')

useSeoMeta({
  title: 'Fotify — Encuentra tus fotos del evento',
  description: 'Marketplace de fotografía deportiva con IA. Sube tu selfie y encuentra tus fotos en segundos.',
  ogTitle: 'Fotify — Encuentra tus fotos del evento',
  ogDescription: 'Sube una selfie y encuentra todos tus momentos en el evento. Sin buscar foto por foto.',
})
</script>

<style scoped>
/* ── Mobile horizontal scroll snap for How It Works ── */
.hiw-scroll {
  gap: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 4px 20px 20px;
  margin: 0 -20px;
}
.hiw-scroll::-webkit-scrollbar { display: none; }

/* Responsive show/hide: mobile vs desktop variants */
.hiw-mobile { display: flex; }
.hiw-desktop { display: none; }
@media (min-width: 768px) {
  .hiw-mobile { display: none; }
  .hiw-desktop { display: grid; }
}

/* ── Card base ── */
.hiw-card {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
}
.hiw-card-mobile {
  flex: 0 0 280px;
  scroll-snap-align: center;
}
.hiw-card-default {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
}
.hiw-card-featured {
  background: rgba(123, 92, 246, 0.07);
  border: 1px solid rgba(123, 92, 246, 0.20);
}

/* ── Background watermark number ── */
.hiw-bg-num {
  position: absolute;
  top: 8px;
  left: 14px;
  font-family: 'Unbounded', sans-serif;
  font-weight: 800;
  line-height: 0.9;
  color: rgba(123, 92, 246, 0.08);
  letter-spacing: -3px;
  pointer-events: none;
  user-select: none;
  font-size: 80px;
}
@media (min-width: 768px) and (max-width: 1023px) {
  .hiw-bg-num { font-size: 52px; }
}

/* ── Icon box ── */
.hiw-icon-box {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(123, 92, 246, 0.12);
  border: 1px solid rgba(123, 92, 246, 0.25);
}
@media (min-width: 1024px) {
  .hiw-icon-box { width: 44px; height: 44px; border-radius: 12px; }
}
.hiw-icon-coral {
  background: rgba(255, 61, 107, 0.10);
  border-color: rgba(255, 61, 107, 0.30);
}

/* ── Desktop step connector ── */
.hiw-connector {
  position: absolute;
  top: 96px;
  left: 14%;
  right: 14%;
  height: 1px;
  border-top: 1px dashed rgba(123, 92, 246, 0.25);
  pointer-events: none;
  z-index: 0;
}

/* ── Category pills horizontal scroll ── */
.pills-scroll {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding-bottom: 4px;
}
.pills-scroll::-webkit-scrollbar { display: none; }
</style>
