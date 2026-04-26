<template>
  <NuxtLink
    :to="`/events/${event.slug}`"
    class="bg-night-2 border border-border rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:border-violet/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all duration-200 block"
  >
    <!-- Cover image / placeholder -->
    <div class="aspect-video bg-night-3 relative flex items-center justify-center">
      <NuxtImg
        :src="event.cover_image_url || demoCover(event.id ?? 1)"
        :alt="event.name"
        class="w-full h-full object-cover absolute inset-0"
      />

      <!-- Status badge -->
      <span v-if="statusBadge" :class="statusBadge.class" class="absolute top-3 left-3 text-[9px] font-bold tracking-wide uppercase px-2 py-0.5 rounded flex items-center gap-1">
        <span v-if="event.status === 'active'" class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
        {{ statusBadge.label }}
      </span>
    </div>

    <div class="p-4">
      <div class="font-display font-bold text-[14px] text-white truncate mb-1.5">{{ event.name }}</div>
      <div class="flex items-center gap-3 text-[12px] text-muted mb-4">
        <span class="flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {{ formattedDate }}
        </span>
        <span v-if="event.location" class="flex items-center gap-1">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          {{ event.location }}
        </span>
      </div>

      <div class="flex items-center justify-between pt-3 border-t border-border">
        <template v-if="event.status === 'draft'">
          <div class="text-[13px] text-muted">Disponible pronto</div>
          <button class="bg-transparent border border-border text-white text-[12px] font-medium px-3.5 py-2 rounded-lg hover:border-white/30 transition-colors" @click.prevent>
            Notificarme
          </button>
        </template>
        <template v-else>
          <div class="text-[13px] font-semibold text-white">
            Desde {{ event.currency }} {{ event.photo_price }}
            <span class="text-[11px] font-normal text-muted">/ foto</span>
          </div>
          <span class="bg-coral text-white text-[12px] font-semibold px-3.5 py-2 rounded-lg">Ver fotos</span>
        </template>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { EventResponse } from '~/types'
import { demoCover } from '~/utils/demophotos'

const props = defineProps<{ event: EventResponse }>()

const formattedDate = computed(() => {
  if (!props.event.event_date) return ''
  return new Date(props.event.event_date).toLocaleDateString('es-PE', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
})

const statusBadge = computed(() => {
  switch (props.event.status) {
    case 'active': return { label: 'En vivo', class: 'bg-green-500/15 border border-green-500/25 text-green-400' }
    case 'draft': return { label: 'Pronto', class: 'bg-coral/10 border border-coral/20 text-[#FF8FAB]' }
    case 'closed': return { label: 'Cerrado', class: 'bg-white/5 border border-white/10 text-white/40' }
    default: return null
  }
})
</script>
