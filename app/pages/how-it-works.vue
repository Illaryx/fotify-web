<template>
  <div>
    <!-- Hero -->
    <section class="pt-16 pb-12 px-5 lg:px-12 text-center">
      <div class="max-w-2xl mx-auto">
        <div class="text-xs text-violet font-semibold uppercase tracking-widest mb-4">La plataforma</div>
        <h1 class="font-display text-3xl lg:text-4xl text-white mb-4">Cómo funciona Fotify</h1>
        <p class="text-white/55 text-base lg:text-lg">
          Conectamos atletas con sus mejores momentos. Fotógrafos ganan sin esfuerzo extra. La IA hace el trabajo pesado.
        </p>
      </div>
    </section>

    <!-- Audience tabs -->
    <section class="px-5 lg:px-12 pb-4">
      <div class="max-w-3xl mx-auto">
        <div class="flex border-b border-border mb-10">
          <button
            class="relative pb-3 px-6 text-sm font-medium transition-colors"
            :class="activeTab === 'atleta' ? 'text-white' : 'text-white/60 hover:text-white/80'"
            @click="activeTab = 'atleta'"
          >
            🏃 Soy atleta
            <span
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-violet transition-transform origin-left"
              :class="activeTab === 'atleta' ? 'scale-x-100' : 'scale-x-0'"
            />
          </button>
          <button
            class="relative pb-3 px-6 text-sm font-medium transition-colors"
            :class="activeTab === 'foto' ? 'text-white' : 'text-white/60 hover:text-white/80'"
            @click="activeTab = 'foto'"
          >
            📷 Soy fotógrafo
            <span
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-violet transition-transform origin-left"
              :class="activeTab === 'foto' ? 'scale-x-100' : 'scale-x-0'"
            />
          </button>
        </div>

        <!-- Athlete flow -->
        <div v-show="activeTab === 'atleta'">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-0 mb-16 relative">
            <div class="hidden lg:block absolute left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-violet/40 via-violet/20 to-transparent" style="top:28px;" />

            <div class="flex flex-col items-center text-center px-4 mb-8 lg:mb-0 relative">
              <div class="w-14 h-14 rounded-full bg-violet flex items-center justify-center mb-4 z-10 relative">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 21L16.5 16.5M19 11C19 15.4 15.4 19 11 19C6.6 19 3 15.4 3 11C3 6.6 6.6 3 11 3C15.4 3 19 6.6 19 11Z" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>
              </div>
              <div class="text-xs text-violet font-semibold uppercase tracking-widest mb-1">Paso 1</div>
              <h3 class="font-semibold text-white text-sm mb-2">Busca tu evento</h3>
              <p class="text-xs text-white/50 leading-relaxed">Entra a Fotify y busca la carrera, triatlón o evento en que participaste</p>
            </div>

            <div class="flex flex-col items-center text-center px-4 mb-8 lg:mb-0">
              <div class="w-14 h-14 rounded-full bg-violet flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke="white" stroke-width="1.8"/><circle cx="12" cy="10" r="3" stroke="white" stroke-width="1.8"/><path d="M6 20C6 17 8.7 15 12 15C15.3 15 18 17 18 20" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>
              </div>
              <div class="text-xs text-violet font-semibold uppercase tracking-widest mb-1">Paso 2</div>
              <h3 class="font-semibold text-white text-sm mb-2">Sube tu selfie</h3>
              <p class="text-xs text-white/50 leading-relaxed">La IA compara tu rostro con las 5,000+ fotos del evento en segundos</p>
            </div>

            <div class="flex flex-col items-center text-center px-4 mb-8 lg:mb-0">
              <div class="w-14 h-14 rounded-full bg-violet flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="16" rx="2" stroke="white" stroke-width="1.8"/><path d="M7 8H12M7 12H10" stroke="white" stroke-width="1.8" stroke-linecap="round"/><circle cx="16" cy="10" r="3" stroke="white" stroke-width="1.8" fill="none"/><path d="M14.5 13.5L12.5 15.5" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>
              </div>
              <div class="text-xs text-violet font-semibold uppercase tracking-widest mb-1">Paso 3</div>
              <h3 class="font-semibold text-white text-sm mb-2">Elige tus fotos</h3>
              <p class="text-xs text-white/50 leading-relaxed">Revisa los resultados, selecciona las que más te gusten y elige tu pack</p>
            </div>

            <div class="flex flex-col items-center text-center px-4 mb-8 lg:mb-0">
              <div class="w-14 h-14 rounded-full bg-coral flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 4V14M12 14L8 10M12 14L16 10" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 18H20" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>
              </div>
              <div class="text-xs text-coral font-semibold uppercase tracking-widest mb-1">Paso 4</div>
              <h3 class="font-semibold text-white text-sm mb-2">Descarga y comparte</h3>
              <p class="text-xs text-white/50 leading-relaxed">Paga con Yape, Plin o tarjeta. Descarga en alta resolución al instante</p>
            </div>
          </div>

          <!-- Visual demo -->
          <div class="bg-night-2 border border-border rounded-3xl p-6 lg:p-10 mb-10">
            <div class="text-xs text-white/30 uppercase tracking-widest text-center mb-8">Así se ve la búsqueda</div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
              <div class="bg-night-3 rounded-2xl p-5 border border-border">
                <div class="text-xs text-violet font-semibold uppercase tracking-widest mb-3">Buscar mis fotos</div>
                <div class="w-full aspect-square bg-border rounded-xl mb-3 flex items-center justify-center overflow-hidden relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="w-20 h-20 rounded-full bg-violet/20 border-2 border-violet/40 flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="12" r="6" stroke="#7C3AED" stroke-width="1.5"/><path d="M6 28C6 23 10.5 19 16 19C21.5 19 26 23 26 28" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/></svg>
                    </div>
                  </div>
                  <div class="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-violet" />
                  <div class="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-violet" />
                  <div class="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-violet" />
                  <div class="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-violet" />
                </div>
                <button class="w-full bg-violet text-white text-xs font-semibold py-2.5 rounded-full">📷 Subir selfie</button>
              </div>

              <div class="hidden lg:flex items-center justify-center">
                <div class="flex flex-col items-center gap-2">
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-px bg-violet/50" />
                    <span class="text-violet text-xl">→</span>
                  </div>
                  <div class="bg-violet/10 border border-violet/30 rounded-full px-3 py-1 text-xs text-violet text-center">IA · 97% acierto</div>
                </div>
              </div>

              <div class="bg-night-3 rounded-2xl p-4 border border-border">
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                  <span class="text-xs text-green-400 font-medium">14 fotos encontradas</span>
                </div>
                <div class="grid grid-cols-3 gap-1.5">
                  <div v-for="i in 5" :key="i" class="aspect-square rounded-lg bg-gradient-to-br from-violet/30 to-violet-deep/20 relative overflow-hidden">
                    <div class="absolute inset-0 flex items-center justify-center text-[6px] text-white/20 font-bold tracking-widest -rotate-30">FOTIFY</div>
                  </div>
                  <div class="aspect-square rounded-lg bg-border flex items-center justify-center text-xs text-white/40">+9</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div class="bg-night-2 border border-border rounded-xl p-4 text-center">
              <div class="text-xs text-white/40 mb-1">1 foto</div>
              <div class="font-display text-lg text-white">S/ 15</div>
            </div>
            <div class="bg-night-2 border border-border rounded-xl p-4 text-center">
              <div class="text-xs text-white/40 mb-1">Pack 3</div>
              <div class="font-display text-lg text-white">S/ 38</div>
              <div class="text-xs text-green-400">-S/ 7</div>
            </div>
            <div class="bg-violet/10 border border-violet/40 rounded-xl p-4 text-center">
              <div class="text-xs text-violet mb-1">Pack 5 🔥</div>
              <div class="font-display text-lg text-white">S/ 59</div>
              <div class="text-xs text-green-400">-S/ 16</div>
            </div>
            <div class="bg-night-2 border border-border rounded-xl p-4 text-center">
              <div class="text-xs text-white/40 mb-1">Pack 10</div>
              <div class="font-display text-lg text-white">S/ 99</div>
              <div class="text-xs text-green-400">-S/ 51</div>
            </div>
            <div class="bg-night-2 border border-border rounded-xl p-4 text-center">
              <div class="text-xs text-white/40 mb-1">Todas</div>
              <div class="font-display text-lg text-white">S/ 129</div>
              <div class="text-xs text-green-400">Mejor valor</div>
            </div>
          </div>
        </div>

        <!-- Photographer flow -->
        <div v-show="activeTab === 'foto'">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-0 mb-16 relative">
            <div class="hidden lg:block absolute left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-violet/40 via-violet/20 to-transparent" style="top:28px;" />

            <div class="flex flex-col items-center text-center px-4 mb-8 lg:mb-0">
              <div class="w-14 h-14 rounded-full bg-violet flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="white" stroke-width="1.8"/><path d="M9 4V2M15 4V2" stroke="white" stroke-width="1.8" stroke-linecap="round"/><path d="M3 9H21" stroke="white" stroke-width="1.8"/><path d="M8 14H11M8 17H13" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>
              </div>
              <div class="text-xs text-violet font-semibold uppercase tracking-widest mb-1">Paso 1</div>
              <h3 class="font-semibold text-white text-sm mb-2">Crea el evento</h3>
              <p class="text-xs text-white/50 leading-relaxed">Registra nombre, fecha, ubicación y categoría del evento en tu dashboard</p>
            </div>

            <div class="flex flex-col items-center text-center px-4 mb-8 lg:mb-0">
              <div class="w-14 h-14 rounded-full bg-violet flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 4V14M12 4L8 8M12 4L16 8" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M4 18H20" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>
              </div>
              <div class="text-xs text-violet font-semibold uppercase tracking-widest mb-1">Paso 2</div>
              <h3 class="font-semibold text-white text-sm mb-2">Sube tus fotos</h3>
              <p class="text-xs text-white/50 leading-relaxed">Arrastra hasta 2,000 fotos (5,000 con Plan Pro). La IA procesa los rostros automáticamente</p>
            </div>

            <div class="flex flex-col items-center text-center px-4 mb-8 lg:mb-0">
              <div class="w-14 h-14 rounded-full bg-violet flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="white" stroke-width="1.8"/><path d="M12 8V12.5L15 14.5" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>
              </div>
              <div class="text-xs text-violet font-semibold uppercase tracking-widest mb-1">Paso 3</div>
              <h3 class="font-semibold text-white text-sm mb-2">La IA trabaja sola</h3>
              <p class="text-xs text-white/50 leading-relaxed">Los atletas llegan, encuentran sus fotos y compran. Sin que hagas nada más</p>
            </div>

            <div class="flex flex-col items-center text-center px-4 mb-8 lg:mb-0">
              <div class="w-14 h-14 rounded-full bg-coral flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="white" stroke-width="1.8"/><path d="M3 10H21" stroke="white" stroke-width="1.8"/><path d="M7 15H10M14 15H17" stroke="white" stroke-width="1.8" stroke-linecap="round"/></svg>
              </div>
              <div class="text-xs text-coral font-semibold uppercase tracking-widest mb-1">Paso 4</div>
              <h3 class="font-semibold text-white text-sm mb-2">Cobras cada 15 días</h3>
              <p class="text-xs text-white/50 leading-relaxed">Transferencia automática a tu cuenta. 70% de cada venta es tuyo</p>
            </div>
          </div>

          <!-- Dashboard preview -->
          <div class="bg-night-2 border border-border rounded-3xl p-6 lg:p-8 mb-10">
            <div class="text-xs text-white/30 uppercase tracking-widest text-center mb-6">Así se ve tu dashboard</div>
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <div class="bg-night-3 rounded-xl p-4 text-center">
                <div class="text-xl font-display text-white">S/ 3,840</div>
                <div class="text-xs text-white/40 mt-1">Este mes</div>
              </div>
              <div class="bg-night-3 rounded-xl p-4 text-center">
                <div class="text-xl font-display text-violet">247</div>
                <div class="text-xs text-white/40 mt-1">Ventas</div>
              </div>
              <div class="bg-night-3 rounded-xl p-4 text-center">
                <div class="text-xl font-display text-white">12</div>
                <div class="text-xs text-white/40 mt-1">Eventos activos</div>
              </div>
              <div class="bg-night-3 rounded-xl p-4 text-center">
                <div class="text-xl font-display text-green-400">4.9★</div>
                <div class="text-xs text-white/40 mt-1">Rating</div>
              </div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="bg-night-3 rounded-xl px-4 py-3 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-violet/20 flex items-center justify-center text-sm">🏃</div>
                  <div>
                    <div class="text-sm text-white">Maratón Lima 42K</div>
                    <div class="text-xs text-white/40">3,900 fotos · 15 mar</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-semibold text-white">S/ 1,240</div>
                  <div class="text-xs text-green-400">87 ventas</div>
                </div>
              </div>
              <div class="bg-night-3 rounded-xl px-4 py-3 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-violet/20 flex items-center justify-center text-sm">🚴</div>
                  <div>
                    <div class="text-sm text-white">Ciclismo Miraflores Classic</div>
                    <div class="text-xs text-white/40">2,100 fotos · 8 mar</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-semibold text-white">S/ 860</div>
                  <div class="text-xs text-green-400">61 ventas</div>
                </div>
              </div>
            </div>
          </div>

          <NuxtLink
            to="/for-photographers"
            class="flex items-center justify-center gap-2 w-full bg-coral hover:opacity-90 text-white font-semibold py-4 rounded-full transition-opacity text-sm"
          >
            Ver todo sobre ser fotógrafo en Fotify →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- AI section -->
    <section class="px-5 lg:px-12 py-16 bg-night-2 border-y border-border">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <div class="text-xs text-violet font-semibold uppercase tracking-widest mb-3">La tecnología detrás</div>
          <h2 class="font-display text-2xl lg:text-3xl text-white mb-4">IA de reconocimiento facial deportivo</h2>
          <p class="text-white/55 max-w-xl mx-auto text-sm">Entrenada específicamente para eventos deportivos donde los atletas llevan dorsal, gorra, gafas y están en movimiento.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-12">
          <div class="bg-night-3 border border-border rounded-2xl p-6 text-center">
            <div class="font-display text-3xl text-violet mb-2">97%</div>
            <div class="text-sm font-medium text-white mb-2">Tasa de coincidencia</div>
            <div class="text-xs text-white/45 leading-relaxed">Incluso con gorra, gafas de sol o en plena carrera. Mejor que cualquier competidor.</div>
          </div>
          <div class="bg-night-3 border border-border rounded-2xl p-6 text-center">
            <div class="font-display text-3xl text-white mb-2">&lt;30s</div>
            <div class="text-sm font-medium text-white mb-2">Tiempo de análisis</div>
            <div class="text-xs text-white/45 leading-relaxed">El atleta sube su selfie y en menos de 30 segundos tiene todos sus resultados.</div>
          </div>
          <div class="bg-night-3 border border-border rounded-2xl p-6 text-center">
            <div class="font-display text-3xl text-white mb-2">5K+</div>
            <div class="text-sm font-medium text-white mb-2">Fotos por evento</div>
            <div class="text-xs text-white/45 leading-relaxed">Analiza miles de fotos en minutos. Sin límite de rostros por imagen.</div>
          </div>
        </div>

        <!-- Privacy note -->
        <div class="bg-night-3 border border-border rounded-2xl p-6 flex gap-4">
          <div class="w-10 h-10 rounded-full bg-green-400/10 flex items-center justify-center flex-shrink-0">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L17 5V9C17 13.5 14 17 10 18C6 17 3 13.5 3 9V5L10 2Z" stroke="#4ade80" stroke-width="1.5" stroke-linejoin="round"/><path d="M7 10L9 12L13 8" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <div>
            <div class="text-sm font-semibold text-white mb-1">Tu privacidad está protegida</div>
            <p class="text-xs text-white/55 leading-relaxed">Las selfies se usan solo para búsqueda y se eliminan en 24h. Los datos biométricos nunca se almacenan permanentemente. Cumplimos con la Ley N° 29733 de Protección de Datos Personales del Perú.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Comparison table -->
    <section class="px-5 lg:px-12 py-16">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-10">
          <h2 class="font-display text-2xl lg:text-3xl text-white">Fotify vs. la competencia</h2>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left py-3 px-4 text-white/40 font-medium text-xs uppercase tracking-wider">Característica</th>
                <th class="py-3 px-4 text-center">
                  <span class="bg-violet text-white text-xs font-semibold px-3 py-1 rounded-full">Fotify</span>
                </th>
                <th class="py-3 px-4 text-center text-white/40 text-xs font-medium">Fotop</th>
                <th class="py-3 px-4 text-center text-white/40 text-xs font-medium">LEN</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-for="row in comparisonRows" :key="row.feature">
                <td class="py-4 px-4 text-white/70">{{ row.feature }}</td>
                <td class="py-4 px-4 text-center" :class="row.fotify === '✓' ? 'text-green-400' : 'text-yellow-400'">{{ row.fotify }}</td>
                <td class="py-4 px-4 text-center" :class="row.fotop === '✓' ? 'text-green-400' : row.fotop === '✗' ? 'text-white/30' : 'text-yellow-400'">{{ row.fotop }}</td>
                <td class="py-4 px-4 text-center" :class="row.len === '✓' ? 'text-green-400' : row.len === '✗' ? 'text-white/30' : 'text-yellow-400'">{{ row.len }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- Dual CTA -->
    <section class="px-5 lg:px-12 py-16 bg-night-2 border-y border-border">
      <div class="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div class="bg-night-3 border border-border rounded-2xl p-8 text-center">
          <div class="text-3xl mb-4">🏃</div>
          <h3 class="font-display text-lg text-white mb-3">Soy atleta</h3>
          <p class="text-sm text-white/55 mb-6">Busca tus fotos de carrera con IA. Resultado en segundos.</p>
          <NuxtLink
            to="/events"
            class="block bg-violet hover:bg-violet-deep text-white font-semibold py-3 rounded-full text-sm transition-colors"
          >
            Buscar mis fotos →
          </NuxtLink>
        </div>

        <div class="bg-gradient-to-br from-coral/10 to-transparent border border-coral/30 rounded-2xl p-8 text-center">
          <div class="text-3xl mb-4">📷</div>
          <h3 class="font-display text-lg text-white mb-3">Soy fotógrafo</h3>
          <p class="text-sm text-white/55 mb-6">Empieza a ganar con tus fotos deportivas. Es gratis.</p>
          <NuxtLink
            to="/for-photographers"
            class="block bg-coral hover:opacity-90 text-white font-semibold py-3 rounded-full text-sm transition-opacity"
          >
            Registrarme como fotógrafo →
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Cómo funciona — Fotify',
  description: 'Descubre cómo Fotify conecta atletas con sus mejores fotos usando IA de reconocimiento facial. Para atletas y fotógrafos deportivos.',
})

const activeTab = ref<'atleta' | 'foto'>('atleta')

const comparisonRows = [
  { feature: 'Búsqueda por IA facial', fotify: '✓', fotop: '✗', len: '✗' },
  { feature: 'Pack pricing (ahorro)', fotify: '✓', fotop: '✗', len: '✗' },
  { feature: 'Yape / Plin', fotify: '✓', fotop: '✗', len: '✗' },
  { feature: 'Dashboard fotógrafo', fotify: '✓', fotop: 'Básico', len: '✗' },
  { feature: 'Dark mode moderno', fotify: '✓', fotop: '✗', len: '✗' },
  { feature: 'Descarga inmediata', fotify: '✓', fotop: '✓', len: '24-48h' },
]
</script>
