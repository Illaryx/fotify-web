<template>
  <div>
    <!-- HERO -->
    <section class="pt-20 pb-16 lg:pb-28 px-5 lg:px-16 xl:px-24 relative overflow-hidden" style="background: linear-gradient(135deg, #1A1030 0%, #0F0A1E 60%, #1A0A2E 100%);">
      <div class="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-10 pointer-events-none" style="background: radial-gradient(circle, #7C3AED 0%, transparent 70%);" />
      <div class="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-[0.08] pointer-events-none" style="background: radial-gradient(circle, #FF3D6B 0%, transparent 70%);" />

      <div class="max-w-7xl mx-auto relative z-10">
        <div class="flex flex-col lg:flex-row lg:items-center gap-12 lg:gap-16">

          <!-- LEFT: copy -->
          <div class="flex-1 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 bg-violet/15 border border-violet/30 rounded-full px-4 py-1.5 text-sm text-violet font-medium mb-6">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="7" fill="#7C3AED"/><path d="M4 7.5L6 9.5L10 5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              +120 fotógrafos ya ganan en Fotify
            </div>

            <h1 class="font-display font-bold text-3xl lg:text-5xl xl:text-6xl text-white leading-tight mb-6">
              Convierte tus fotos<br>deportivas en<br><span class="text-violet">ingresos reales</span>
            </h1>
            <p class="text-white/60 text-lg lg:text-xl max-w-lg mx-auto lg:mx-0 mb-10">
              Sube tus fotos a cualquier evento. Nuestra IA las entrega a los atletas que aparecen en ellas. Tú cobras, sin perseguir a nadie.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                class="bg-coral hover:opacity-90 text-white font-semibold px-8 py-4 rounded-full text-base transition-opacity"
                @click="showAuth = true"
              >
                Empezar a ganar — es gratis
              </button>
              <NuxtLink
                to="/how-it-works"
                class="border border-border hover:border-violet/60 text-white/80 hover:text-white font-medium px-8 py-4 rounded-full text-base transition-colors"
              >
                Ver cómo funciona
              </NuxtLink>
            </div>

            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-5 mt-10 text-white/40 text-xs">
              <span class="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L8.8 5.2L13 5.6L10 8.3L10.8 12.5L7 10.3L3.2 12.5L4 8.3L1 5.6L5.2 5.2L7 1Z" stroke="#7C3AED" stroke-width="1.2" fill="none"/></svg>
                Sin costo inicial
              </span>
              <span class="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="2" stroke="#7C3AED" stroke-width="1.2"/><path d="M5 7L6.5 8.5L9 6" stroke="#7C3AED" stroke-width="1.2" stroke-linecap="round"/></svg>
                70% de cada venta es tuyo
              </span>
              <span class="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="#7C3AED" stroke-width="1.2"/><path d="M7 4V7.5L9 9" stroke="#7C3AED" stroke-width="1.2" stroke-linecap="round"/></svg>
                Pago cada 15 días
              </span>
              <span class="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1L13 4V8C13 11 10 13 7 13C4 13 1 11 1 8V4L7 1Z" stroke="#7C3AED" stroke-width="1.2" fill="none"/></svg>
                Tus fotos protegidas
              </span>
            </div>
          </div>

          <!-- RIGHT: dashboard preview (desktop only) -->
          <div class="hidden lg:block w-[420px] xl:w-[480px] flex-shrink-0">
            <div class="bg-night-2 border border-border rounded-2xl overflow-hidden shadow-[0_24px_80px_rgba(124,58,237,0.2)]">
              <!-- Mini top bar -->
              <div class="px-4 py-3 border-b border-border flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span class="text-xs text-white/50 font-medium">Dashboard · Maratón Lima 42K</span>
                </div>
                <span class="text-xs text-violet font-semibold">En vivo</span>
              </div>
              <!-- Revenue banner -->
              <div class="px-5 pt-5 pb-4 border-b border-border">
                <div class="text-xs text-white/30 mb-1">Ingresos este evento</div>
                <div class="font-display text-3xl text-white font-bold">S/ 1,240.00</div>
                <div class="text-xs text-green-400 mt-1 flex items-center gap-1">
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M6 9V3M3 6L6 3L9 6" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  +18% vs evento anterior
                </div>
              </div>
              <!-- Mini photo grid -->
              <div class="p-4 grid grid-cols-4 gap-1.5">
                <div v-for="n in 8" :key="n" class="aspect-[3/4] rounded-lg overflow-hidden bg-night-3 relative">
                  <img :src="`https://picsum.photos/seed/fp-${n}/120/160`" class="w-full h-full object-cover opacity-80" />
                  <div v-if="n === 3 || n === 5 || n === 7" class="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-violet border border-white/30 flex items-center justify-center">
                    <svg width="7" height="7" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  </div>
                </div>
              </div>
              <!-- Stats row -->
              <div class="px-4 pb-5 grid grid-cols-3 gap-3">
                <div class="bg-night-3 rounded-xl p-3 text-center">
                  <div class="font-display text-lg text-white font-bold">127</div>
                  <div class="text-[10px] text-white/35 mt-0.5">Ventas</div>
                </div>
                <div class="bg-night-3 rounded-xl p-3 text-center">
                  <div class="font-display text-lg text-violet font-bold">2,400</div>
                  <div class="text-[10px] text-white/35 mt-0.5">Fotos</div>
                </div>
                <div class="bg-night-3 rounded-xl p-3 text-center">
                  <div class="font-display text-lg text-coral font-bold">97%</div>
                  <div class="text-[10px] text-white/35 mt-0.5">IA match</div>
                </div>
              </div>
            </div>
            <!-- Floating notification -->
            <div class="mt-3 ml-4 bg-night-2 border border-green-500/30 rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg w-fit">
              <div class="w-7 h-7 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <svg width="13" height="13" viewBox="0 0 14 14" fill="none"><path d="M3 7L6 10L11 4" stroke="#4ade80" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </div>
              <div>
                <div class="text-xs text-white font-semibold">Nueva venta · S/ 18.00</div>
                <div class="text-[10px] text-white/40">Atleta #4821 · hace 2 min</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- STAT CARDS -->
    <section class="px-5 lg:px-16 xl:px-24 -mt-10 pb-16 relative z-10">
      <div class="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="bg-night-2 border border-border rounded-2xl p-5 text-center">
          <div class="font-display text-2xl lg:text-3xl text-white mb-1">S/ 3,800</div>
          <div class="text-xs text-white/50">Promedio mensual<br>fotógrafo activo</div>
        </div>
        <div class="bg-night-2 border border-border rounded-2xl p-5 text-center">
          <div class="font-display text-2xl lg:text-3xl text-violet mb-1">70%</div>
          <div class="text-xs text-white/50">Comisión que<br>te llevás</div>
        </div>
        <div class="bg-night-2 border border-border rounded-2xl p-5 text-center">
          <div class="font-display text-2xl lg:text-3xl text-white mb-1">4,200+</div>
          <div class="text-xs text-white/50">Atletas comprando<br>cada mes</div>
        </div>
        <div class="bg-night-2 border border-border rounded-2xl p-5 text-center">
          <div class="font-display text-2xl lg:text-3xl text-coral mb-1">97%</div>
          <div class="text-xs text-white/50">Tasa de coincidencia<br>de la IA facial</div>
        </div>
      </div>
    </section>

    <!-- CÓMO FUNCIONA -->
    <section class="px-5 lg:px-16 xl:px-24 py-16">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <div class="text-xs text-violet font-semibold uppercase tracking-widest mb-3">Proceso simplificado</div>
          <h2 class="font-display font-bold text-2xl lg:text-4xl text-white">Solo 4 pasos para empezar a ganar</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <div class="bg-night-2 border border-border rounded-2xl p-6">
            <div class="w-10 h-10 rounded-full bg-violet/20 border border-violet/40 flex items-center justify-center font-display text-sm text-violet mb-5">1</div>
            <h3 class="font-semibold text-white text-base mb-3">Registra el evento</h3>
            <p class="text-sm text-muted leading-relaxed">Crea el evento en tu dashboard. Sube las fotos mientras aún estás en la meta. La plataforma lo gestiona todo.</p>
            <div class="mt-5 bg-night-3 rounded-xl p-4 flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-violet/20 flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="2" stroke="#7C3AED" stroke-width="1.3"/><path d="M5 3V2M11 3V2" stroke="#7C3AED" stroke-width="1.3" stroke-linecap="round"/><path d="M2 7H14" stroke="#7C3AED" stroke-width="1.3"/></svg>
              </div>
              <span class="text-xs text-white/60">Ej: Maratón Lima 42K — 15 mar 2025</span>
            </div>
          </div>

          <div class="bg-night-2 border border-border rounded-2xl p-6">
            <div class="w-10 h-10 rounded-full bg-violet/20 border border-violet/40 flex items-center justify-center font-display text-sm text-violet mb-5">2</div>
            <h3 class="font-semibold text-white text-base mb-3">Sube tus fotos</h3>
            <p class="text-sm text-muted leading-relaxed">Arrastra hasta 2,000 fotos por evento (5,000 con Plan Pro). Nuestra IA procesa los rostros y los vincula automáticamente a cada atleta.</p>
            <div class="mt-5 bg-night-3 rounded-xl p-4">
              <div class="flex items-center gap-2 mb-2">
                <div class="flex-1 h-1.5 bg-border rounded-full overflow-hidden">
                  <div class="h-full bg-violet rounded-full" style="width:78%" />
                </div>
                <span class="text-xs text-white/50">78%</span>
              </div>
              <span class="text-xs text-white/40">3,900 / 5,000 fotos procesadas</span>
            </div>
          </div>

          <div class="bg-night-2 border border-border rounded-2xl p-6">
            <div class="w-10 h-10 rounded-full bg-violet/20 border border-violet/40 flex items-center justify-center font-display text-sm text-violet mb-5">3</div>
            <h3 class="font-semibold text-white text-base mb-3">La IA trabaja sola</h3>
            <p class="text-sm text-muted leading-relaxed">Los atletas suben su selfie y la IA les encuentra en segundos entre miles de fotos. Sin que hagas nada más.</p>
            <div class="mt-5 bg-night-3 rounded-xl p-4 flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0"></div>
              <span class="text-xs text-white/60">97% precisión · 0 errores hoy</span>
            </div>
          </div>

          <div class="bg-night-2 border border-border rounded-2xl p-6">
            <div class="w-10 h-10 rounded-full bg-violet/20 border border-violet/40 flex items-center justify-center font-display text-sm text-violet mb-5">4</div>
            <h3 class="font-semibold text-white text-base mb-3">Cobras cada 15 días</h3>
            <p class="text-sm text-muted leading-relaxed">Los atletas compran solos. Recibes transferencia a tu cuenta cada quincena, automáticamente.</p>
            <div class="mt-5 bg-night-3 rounded-xl p-4 flex items-center justify-between">
              <div>
                <div class="text-xs text-white/40 mb-0.5">Próximo pago</div>
                <div class="text-sm font-semibold text-white">S/ 1,240.00</div>
              </div>
              <div class="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">Lunes 20 mar</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- EARNINGS CALCULATOR -->
    <section class="px-5 lg:px-16 xl:px-24 py-16 bg-night-2 border-y border-border">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10">
          <div class="text-xs text-violet font-semibold uppercase tracking-widest mb-3">Calculadora de ganancias</div>
          <h2 class="font-display font-bold text-2xl lg:text-4xl text-white">¿Cuánto puedes ganar?</h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div class="flex flex-col gap-6">
            <div>
              <div class="flex justify-between mb-2">
                <label class="text-sm text-white/70">Fotos por evento</label>
                <span class="text-sm font-semibold text-white">{{ photosLabel }}</span>
              </div>
              <input v-model.number="calcPhotos" type="range" min="500" max="5000" step="500" class="w-full accent-violet cursor-pointer" />
              <div class="flex justify-between mt-1 text-xs text-white/30"><span>500</span><span>5,000</span></div>
            </div>

            <div>
              <div class="flex justify-between mb-2">
                <label class="text-sm text-white/70">Eventos por mes</label>
                <span class="text-sm font-semibold text-white">{{ calcEvents }} evento{{ calcEvents > 1 ? 's' : '' }}</span>
              </div>
              <input v-model.number="calcEvents" type="range" min="1" max="8" step="1" class="w-full accent-violet cursor-pointer" />
              <div class="flex justify-between mt-1 text-xs text-white/30"><span>1</span><span>8</span></div>
            </div>

            <div>
              <div class="flex justify-between mb-2">
                <label class="text-sm text-white/70">Tasa de conversión estimada</label>
                <span class="text-sm font-semibold text-white">{{ calcConv }}%</span>
              </div>
              <input v-model.number="calcConv" type="range" min="5" max="35" step="5" class="w-full accent-violet cursor-pointer" />
              <div class="flex justify-between mt-1 text-xs text-white/30"><span>5%</span><span>35%</span></div>
            </div>
          </div>

          <div class="bg-night-3 border border-border rounded-2xl p-6">
            <div class="text-xs text-white/40 uppercase tracking-widest mb-4">Estimado mensual</div>
            <div class="font-display text-4xl text-white mb-1">S/ {{ calcYours.toLocaleString() }}</div>
            <div class="text-xs text-white/40 mb-6">después de comisión Fotify (30%)</div>

            <div class="flex flex-col gap-3 text-sm">
              <div class="flex justify-between">
                <span class="text-white/50">Atletas alcanzados</span>
                <span class="text-white">{{ calcAthletes.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">Compradores estimados</span>
                <span class="text-white">{{ calcBuyers.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-white/50">Ticket promedio</span>
                <span class="text-white">S/ 59</span>
              </div>
              <div class="border-t border-border pt-3 flex justify-between font-medium">
                <span class="text-white/70">Ingreso bruto</span>
                <span class="text-white">S/ {{ calcGross.toLocaleString() }}</span>
              </div>
              <div class="flex justify-between font-semibold">
                <span class="text-violet">Tu 70%</span>
                <span class="text-violet">S/ {{ calcYours.toLocaleString() }}</span>
              </div>
            </div>

            <button
              class="mt-6 w-full bg-coral hover:opacity-90 text-white font-semibold py-3 rounded-full text-sm transition-opacity"
              @click="showAuth = true"
            >
              Quiero ganar así — Registrarme
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- BENEFICIOS -->
    <section class="px-5 lg:px-16 xl:px-24 py-16">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <h2 class="font-display font-bold text-2xl lg:text-4xl text-white">Por qué Fotify es diferente</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          <div v-for="benefit in benefits" :key="benefit.title" class="bg-night-2 border border-border rounded-2xl p-6 flex gap-4">
            <div class="w-12 h-12 rounded-xl bg-violet/15 flex items-center justify-center flex-shrink-0" v-html="benefit.icon" />
            <div>
              <h3 class="font-semibold text-white mb-2">{{ benefit.title }}</h3>
              <p class="text-sm text-muted leading-relaxed">{{ benefit.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TESTIMONIALS -->
    <section class="px-5 lg:px-16 xl:px-24 py-16 bg-night-2 border-y border-border">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-12">
          <div class="text-xs text-violet font-semibold uppercase tracking-widest mb-3">Fotógrafos reales</div>
          <h2 class="font-display font-bold text-2xl lg:text-4xl text-white">Ellos ya están ganando</h2>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div v-for="t in testimonials" :key="t.name" class="bg-night-3 border border-border rounded-2xl p-6">
            <div class="text-yellow-400 text-sm mb-4">★★★★★</div>
            <p class="text-sm text-white/70 leading-relaxed mb-5">{{ t.quote }}</p>
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0" :style="`background: linear-gradient(135deg, ${t.gradFrom}, ${t.gradTo})`">{{ t.initials }}</div>
              <div>
                <div class="text-sm font-medium text-white">{{ t.name }}</div>
                <div class="text-xs text-white/40">{{ t.location }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- PLANES -->
    <section class="px-5 lg:px-16 xl:px-24 py-16">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-12">
          <div class="text-xs text-violet font-semibold uppercase tracking-widest mb-3">Sin sorpresas</div>
          <h2 class="font-display font-bold text-2xl lg:text-4xl text-white mb-3">Modelo simple y justo</h2>
          <p class="text-muted text-sm">Sin cuotas mensuales. Solo pagamos juntos cuando vendes.</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <!-- Free -->
          <div class="bg-night-2 border border-border rounded-2xl p-7">
            <div class="text-xs text-white/40 uppercase tracking-widest mb-4">Estándar</div>
            <div class="font-display text-3xl text-white mb-1">Gratis</div>
            <div class="text-xs text-white/40 mb-6">Para siempre · sin tarjeta</div>
            <ul class="flex flex-col gap-3 text-sm mb-8">
              <li v-for="f in freePlan" :key="f.text" class="flex items-center gap-2" :class="f.active ? 'text-white/70' : 'text-white/40'">
                <span :class="f.active ? 'text-violet' : 'text-white/20'">{{ f.active ? '✓' : '○' }}</span>
                {{ f.text }}
              </li>
            </ul>
            <button class="w-full border border-violet text-violet hover:bg-violet hover:text-white font-semibold py-3 rounded-full text-sm transition-colors" @click="showAuth = true">
              Empezar gratis
            </button>
          </div>

          <!-- Pro -->
          <div class="bg-gradient-to-br from-violet/20 to-violet-deep/10 border border-violet/40 rounded-2xl p-7 relative shadow-[0_0_40px_rgba(124,58,237,0.25)]">
            <div class="absolute -top-3 left-1/2 -translate-x-1/2">
              <span class="bg-violet text-white text-xs font-semibold px-3 py-1 rounded-full">Más popular</span>
            </div>
            <div class="text-xs text-violet uppercase tracking-widest mb-4">Pro</div>
            <div class="flex items-baseline gap-1 mb-1">
              <div class="font-display text-3xl text-white">S/ 49</div>
              <div class="text-sm text-white/50">/mes</div>
            </div>
            <div class="text-xs text-white/40 mb-6">o S/ 490/año · ahorra 2 meses</div>
            <ul class="flex flex-col gap-3 text-sm mb-8">
              <li v-for="f in proPlan" :key="f" class="flex items-center gap-2 text-white/70">
                <span class="text-violet">✓</span>{{ f }}
              </li>
            </ul>
            <button class="w-full bg-coral hover:opacity-90 text-white font-semibold py-3 rounded-full text-sm transition-opacity" @click="showAuth = true">
              Probar Pro — 30 días gratis
            </button>
          </div>
        </div>

        <p class="text-center text-xs text-white/30 mt-6">
          ¿Organizas más de 20 eventos al mes?
          <a href="mailto:hola@fotify.pe" class="text-violet hover:underline">Habla con nosotros</a> para plan Enterprise.
        </p>
      </div>
    </section>

    <!-- FAQ -->
    <section class="px-5 lg:px-16 xl:px-24 py-16 bg-night-2 border-y border-border">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-10">
          <h2 class="font-display font-bold text-2xl text-white">Preguntas frecuentes</h2>
        </div>

        <div class="flex flex-col divide-y divide-border">
          <div v-for="(item, i) in faq" :key="i" class="py-4 cursor-pointer" @click="toggleFaq(i)">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-white">{{ item.q }}</span>
              <svg
                class="w-4 h-4 text-white/40 transition-transform flex-shrink-0 ml-3"
                :class="openFaq === i ? 'rotate-180' : ''"
                viewBox="0 0 16 16" fill="none"
              >
                <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              </svg>
            </div>
            <div v-show="openFaq === i" class="mt-3 text-sm text-muted leading-relaxed">{{ item.a }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="px-5 lg:px-16 xl:px-24 py-24">
      <div class="max-w-2xl mx-auto text-center">
        <div class="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style="background: linear-gradient(135deg, #7C3AED, #5B21B6);">
          <svg width="36" height="36" viewBox="0 0 44 44" fill="none">
            <ellipse cx="22" cy="22" rx="22" ry="22" fill="#7C3AED"/>
            <path d="M14 22 C14 14 20 8 28 12 C32 14 32 20 28 24 C24 28 18 26 14 22Z" fill="white" opacity="0.95"/>
            <circle cx="22" cy="22" r="4.5" fill="#7C3AED"/>
          </svg>
        </div>
        <h2 class="font-display font-bold text-2xl lg:text-4xl text-white mb-4">¿Listo para empezar?</h2>
        <p class="text-muted text-base mb-8 max-w-lg mx-auto">Únete a los fotógrafos que ya monetizan su trabajo sin esfuerzo extra. El registro toma menos de 2 minutos.</p>
        <button
          class="bg-coral hover:opacity-90 text-white font-semibold px-10 py-4 rounded-full text-base transition-opacity"
          @click="showAuth = true"
        >
          Crear mi cuenta gratis →
        </button>
        <p class="text-xs text-white/30 mt-4">Sin tarjeta de crédito · Sin compromisos · Cancela cuando quieras</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Para fotógrafos — Fotify',
  description: 'Convierte tus fotos deportivas en ingresos reales. Sube tus fotos, la IA las vende. 70% de cada venta es tuyo.',
  ogTitle: 'Para fotógrafos — Fotify',
  ogDescription: 'Convierte tus fotos deportivas en ingresos reales. Sube tus fotos, la IA las vende.',
})

const showAuth = useAuthModal()

// Calculator
const calcPhotos = ref(2000)
const calcEvents = ref(2)
const calcConv = ref(15)

const photosLabel = computed(() => calcPhotos.value.toLocaleString() + ' fotos')
const calcAthletes = computed(() => Math.round(calcPhotos.value * calcEvents.value * 0.3))
const calcBuyers = computed(() => Math.round(calcAthletes.value * calcConv.value / 100))
const calcGross = computed(() => calcBuyers.value * 59)
const calcYours = computed(() => Math.round(calcGross.value * 0.7))

// FAQ
const openFaq = ref<number | null>(null)
function toggleFaq(i: number) {
  openFaq.value = openFaq.value === i ? null : i
}

const faq = [
  {
    q: '¿Necesito equipo especial para subir fotos?',
    a: 'No. Cualquier archivo JPG o RAW exportado funciona. Puedes subir desde tu computadora, disco externo, o directamente desde Lightroom con nuestro plugin (próximamente).',
  },
  {
    q: '¿Qué pasa si el atleta no se encuentra con la IA?',
    a: 'El atleta también puede buscar por número de dorsal. Además, nuestro sistema aprende y mejora constantemente. La tasa de coincidencia actual es del 97%.',
  },
  {
    q: '¿Cómo recibo mis pagos?',
    a: 'Transferencia bancaria directa (BCP, BBVA, Interbank, Scotiabank) o Yape. El pago se genera el 1 y 15 de cada mes para las ventas del período anterior. Mínimo de retiro: S/ 50.',
  },
  {
    q: '¿Puedo establecer mis propios precios?',
    a: 'Actualmente los precios son estándar (S/ 15 / pack 3 S/ 38 / pack 5 S/ 59 etc.) para asegurar conversión óptima. Los precios personalizados están disponibles con el plan Pro.',
  },
  {
    q: '¿Las fotos siguen siendo mías?',
    a: 'Sí. Tú mantienes todos los derechos de autor. Fotify opera como tu agente de ventas, no como propietario. Puedes retirar tus fotos en cualquier momento.',
  },
]

const benefits = [
  {
    title: 'IA que vende por ti',
    desc: 'Nuestra IA de reconocimiento facial identifica a cada atleta en tus fotos y las pone delante de ellos automáticamente. Sin que tú hagas nada extra.',
    icon: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="4" stroke="#7C3AED" stroke-width="1.5"/><path d="M11 4V2M11 20V18M4 11H2M20 11H18M6.3 6.3L4.9 4.9M17.1 17.1L15.7 15.7M17.1 6.3L15.7 4.9M6.3 17.1L4.9 18.5" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/></svg>',
  },
  {
    title: 'Tus fotos, siempre protegidas',
    desc: 'Marca de agua automática antes del pago. Los atletas ven una preview con "FOTIFY" superpuesto. Solo quien paga descarga la foto limpia en alta resolución.',
    icon: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><rect x="3" y="3" width="16" height="16" rx="3" stroke="#7C3AED" stroke-width="1.5"/><path d="M7 11L10 14L15 9" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  },
  {
    title: 'Dashboard con analytics real',
    desc: 'Ve cuántas personas vieron tus fotos, cuántas compraron, qué eventos rinden más. Datos para que crezcas como profesional.',
    icon: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M3 7H19M3 12H15M3 17H11" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/></svg>',
  },
  {
    title: 'Perfil público y reputación',
    desc: 'Tu perfil en Fotify muestra todos tus eventos y portfolio. Los atletas te siguen y vuelven a buscar tus fotos en próximas carreras.',
    icon: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M12 3L14.5 9H21L16 13L18 19L12 15.5L6 19L8 13L3 9H9.5L12 3Z" stroke="#7C3AED" stroke-width="1.5" stroke-linejoin="round" fill="none"/></svg>',
  },
  {
    title: 'Pagos automáticos cada 15 días',
    desc: 'Sin trámites, sin esperas. Cada quincena recibes tu dinero directo a tu cuenta bancaria o billetera digital. Solo en Perú por ahora.',
    icon: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><circle cx="11" cy="11" r="8" stroke="#7C3AED" stroke-width="1.5"/><path d="M11 7V11.5L14 13.5" stroke="#7C3AED" stroke-width="1.5" stroke-linecap="round"/></svg>',
  },
  {
    title: 'Acceso a miles de eventos en LATAM',
    desc: 'Conectamos fotógrafos con organizadores de eventos. Tú solo fotografía. Nosotros te ponemos en el mapa de las carreras más grandes de la región.',
    icon: '<svg width="22" height="22" viewBox="0 0 22 22" fill="none"><path d="M18 9A6 6 0 0 0 6 9C6 14 12 19 12 19C12 19 18 14 18 9Z" stroke="#7C3AED" stroke-width="1.5" stroke-linejoin="round"/><circle cx="12" cy="9" r="2" stroke="#7C3AED" stroke-width="1.5"/></svg>',
  },
]

const testimonials = [
  {
    quote: '"Antes vendía 3-4 fotos por evento si tenía suerte. Con Fotify en el primer mes ya vendí 127 fotos en la Maratón Lima. La IA es lo que marca la diferencia."',
    name: 'Carlos R.',
    initials: 'CR',
    location: 'Lima · Running & Triatlón',
    gradFrom: '#7C3AED',
    gradTo: '#FF3D6B',
  },
  {
    quote: '"Lo que más me gustó fue que no tengo que perseguir a nadie. Subo las fotos y el dinero llega solo cada quincena. Gano más que en trabajos corporativos por hora."',
    name: 'María P.',
    initials: 'MP',
    location: 'Arequipa · Ciclismo & Trail',
    gradFrom: '#5B21B6',
    gradTo: '#7C3AED',
  },
  {
    quote: '"Trabajo 3 eventos al mes y saco S/ 4,200 limpios. Mi récord fue la IronMan Huacachina: 340 fotos vendidas. Ahora esto es mi trabajo principal."',
    name: 'Andrés L.',
    initials: 'AL',
    location: 'Lima · Triatlón & Natación',
    gradFrom: '#FF3D6B',
    gradTo: '#7C3AED',
  },
]

const freePlan = [
  { text: 'Hasta 3 eventos activos', active: true },
  { text: '2,000 fotos por evento', active: true },
  { text: 'IA facial incluida', active: true },
  { text: '70% de comisión', active: true },
  { text: 'Perfil público', active: true },
  { text: 'Analytics avanzado', active: false },
  { text: 'Eventos ilimitados', active: false },
]

const proPlan = [
  'Eventos ilimitados',
  '5,000 fotos por evento',
  'IA facial prioritaria',
  '75% de comisión',
  'Analytics avanzado',
  'Soporte prioritario',
  'Badge verificado en perfil',
]
</script>
