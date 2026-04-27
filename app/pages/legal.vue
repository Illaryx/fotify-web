<template>
  <div>
    <!-- Hero -->
    <div class="bg-night-2 border-b border-border">
      <div class="max-w-6xl mx-auto px-5 py-10">
        <p class="text-violet text-xs font-semibold uppercase tracking-widest mb-2">Legal</p>
        <h1 class="font-display font-bold text-2xl lg:text-3xl mb-2">Términos y Políticas</h1>
        <p class="text-white/50 text-sm max-w-xl">Última actualización: 8 de abril de 2026. Lee estos documentos para entender tus derechos y obligaciones al usar Fotify.</p>
      </div>
    </div>

    <!-- Main layout -->
    <div class="max-w-6xl mx-auto px-5 py-8">
      <div class="flex flex-col lg:flex-row gap-8 items-start">

        <!-- Left: tab content -->
        <div class="w-full lg:flex-1">

          <!-- Tab bar -->
          <div class="flex gap-6 border-b border-border mb-8 overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              class="relative pb-3 text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0"
              :class="activeTab === tab.key ? 'text-violet' : 'text-white/60 hover:text-white/80'"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
              <span
                class="absolute bottom-0 left-0 right-0 h-0.5 bg-violet transition-transform origin-left"
                :class="activeTab === tab.key ? 'scale-x-100' : 'scale-x-0'"
              />
            </button>
          </div>

          <!-- Panel: Términos de Uso -->
          <div v-show="activeTab === 'terminos'" class="legal-prose">
            <div class="legal-highlight">
              <p>Estos Términos de Uso rigen el uso de la plataforma Fotify operada por <strong>Fotify Technologies S.A.C.</strong>, empresa constituida en Lima, Perú (RUC: 20612345678). Al crear una cuenta o usar nuestros servicios, aceptas estos términos en su totalidad.</p>
            </div>

            <h2>1. Definiciones</h2>
            <p>En este documento, los siguientes términos tienen el significado que se indica:</p>
            <ul>
              <li><strong>«Plataforma»</strong>: el sitio web fotify.pe y todos sus subdominios.</li>
              <li><strong>«Atleta»</strong>: usuario registrado que busca y adquiere fotografías de eventos.</li>
              <li><strong>«Fotógrafo»</strong>: usuario registrado que sube y comercializa fotografías a través de la Plataforma.</li>
              <li><strong>«Evento»</strong>: competencia deportiva u actividad registrada en la Plataforma.</li>
              <li><strong>«Contenido»</strong>: fotografías, metadatos, descripciones y cualquier otro material publicado en la Plataforma.</li>
              <li><strong>«Pack»</strong>: paquete de fotografías adquiridas bajo una de las tarifas disponibles.</li>
            </ul>

            <h2>2. Elegibilidad y Registro</h2>
            <p>Para usar Fotify debes tener al menos 18 años de edad o contar con el consentimiento de un tutor legal. Al registrarte, te comprometes a proporcionar información veraz, completa y actualizada. Una cuenta por persona; el uso de cuentas múltiples para evadir restricciones resulta en suspensión permanente.</p>
            <h3>2.1 Verificación de identidad</h3>
            <p>Fotify se reserva el derecho de solicitar documentación adicional para verificar la identidad de cualquier usuario, especialmente Fotógrafos, como condición para activar la cuenta o procesar pagos.</p>

            <h2>3. Uso del Servicio</h2>
            <h3>3.1 Usos permitidos</h3>
            <ul>
              <li>Buscar tus propias fotografías tomadas en eventos deportivos.</li>
              <li>Adquirir Packs de fotografías para uso personal.</li>
              <li>Subir y comercializar fotografías de eventos como Fotógrafo registrado.</li>
              <li>Compartir tus fotografías adquiridas en redes sociales sin fines comerciales.</li>
            </ul>
            <h3>3.2 Usos prohibidos</h3>
            <ul>
              <li>Revender fotografías adquiridas en la plataforma.</li>
              <li>Usar la Plataforma para actividades ilegales o fraudulentas.</li>
              <li>Intentar eludir los sistemas de watermark o protección de contenido.</li>
              <li>Subir contenido que infrinja derechos de autor de terceros.</li>
              <li>Usar herramientas automatizadas (bots, scrapers) para acceder a la Plataforma.</li>
            </ul>

            <h2>4. Derechos de las Fotografías</h2>
            <p>Al comprar un Pack, el Atleta adquiere una <strong>licencia de uso personal no exclusiva</strong> para las fotografías incluidas. Esta licencia permite:</p>
            <ul>
              <li>Imprimir las fotografías para uso personal.</li>
              <li>Compartirlas en redes sociales personales con fines no comerciales.</li>
              <li>Usarlas como foto de perfil o portada en plataformas personales.</li>
            </ul>
            <p>La licencia <strong>no permite</strong>: uso comercial, edición mayor para reventa, sublicenciamiento, ni uso en publicidad sin acuerdo expreso con el Fotógrafo.</p>
            <h3>4.1 Propiedad del contenido</h3>
            <p>Los Fotógrafos retienen todos los derechos de autor sobre sus fotografías. Al publicar en Fotify, otorgan a la plataforma una licencia no exclusiva para mostrar, distribuir y comercializar el contenido según las condiciones del Acuerdo de Fotógrafo.</p>

            <h2>5. Pagos y Reembolsos</h2>
            <h3>5.1 Precios y comisiones</h3>
            <p>Los precios mostrados incluyen IGV (18%). Fotify retiene una comisión del 30% de cada venta; el 70% restante se acredita al Fotógrafo. Las tarifas vigentes son:</p>
            <ul>
              <li>1 foto: S/ 15.00</li>
              <li>Pack 3 fotos: S/ 38.00 (ahorro 15%)</li>
              <li>Pack 5 fotos: S/ 59.00 (ahorro 21%)</li>
              <li>Pack 10 fotos: S/ 99.00 (ahorro 34%)</li>
              <li>Todas mis fotos: S/ 129.00 (ahorro 43%)</li>
            </ul>
            <h3>5.2 Política de reembolsos</h3>
            <p>Las compras de fotografías digitales son <strong>no reembolsables</strong> una vez que la descarga ha sido completada. Si por error técnico no puedes acceder a tus fotos dentro de las 48h siguientes a la compra, escribe a soporte@fotify.pe y procesaremos el reembolso en 5–10 días hábiles.</p>
            <p>Los pagos rechazados por el procesador de pagos no generan cargo alguno. La selección de fotos se mantiene por 48h después de un pago fallido.</p>

            <h2>6. Reconocimiento Facial e IA</h2>
            <p>Fotify utiliza tecnología de reconocimiento facial para ayudar a los Atletas a encontrar sus fotografías. Este procesamiento se realiza conforme a nuestra Política de Privacidad y la Ley 29733 (Ley de Protección de Datos Personales del Perú). La selfie proporcionada se usa únicamente para la búsqueda y no se almacena más de 24h sin consentimiento expreso.</p>

            <h2>7. Limitación de Responsabilidad</h2>
            <p>Fotify no garantiza que la IA de reconocimiento facial encuentre el 100% de tus fotografías en todos los eventos. La precisión varía según calidad de la selfie, condiciones de luz y ángulo de captura. En ningún caso la responsabilidad de Fotify excederá el monto pagado en la transacción en cuestión.</p>

            <h2>8. Modificaciones a los Términos</h2>
            <p>Fotify puede modificar estos Términos con 15 días de aviso previo por correo electrónico. El uso continuado de la Plataforma tras la fecha de entrada en vigor constituye aceptación de los nuevos términos.</p>

            <h2>9. Ley Aplicable y Jurisdicción</h2>
            <p>Estos Términos se rigen por las leyes de la República del Perú. Las partes se someten a la jurisdicción de los Juzgados y Tribunales de Lima, renunciando a cualquier otro fuero que pudiera corresponderles.</p>
            <p>Para consultas legales: legal@fotify.pe</p>
          </div>

          <!-- Panel: Política de Privacidad -->
          <div v-show="activeTab === 'privacidad'" class="legal-prose">
            <div class="legal-highlight">
              <p>Fotify cumple con la <strong>Ley 29733</strong> — Ley de Protección de Datos Personales del Perú y su Reglamento (D.S. 003-2013-JUS). El banco de datos personales de Fotify está inscrito ante la ANPDP con código <strong>BDP-2024-00789</strong>.</p>
            </div>

            <h2>1. Responsable del Tratamiento</h2>
            <p><strong>Fotify Technologies S.A.C.</strong><br>RUC: 20612345678<br>Av. Reducto 1310, Miraflores, Lima 15074, Perú<br>Email: privacidad@fotify.pe</p>

            <h2>2. Datos que Recopilamos</h2>
            <h3>2.1 Datos de registro</h3>
            <ul>
              <li>Nombre completo y correo electrónico.</li>
              <li>Nombre de usuario y contraseña (almacenada como hash bcrypt, nunca en texto plano).</li>
              <li>Número de DNI/CE o pasaporte (solo Fotógrafos, para verificación y pagos).</li>
              <li>Número de cuenta bancaria o billetera digital (solo Fotógrafos, para pagos).</li>
            </ul>
            <h3>2.2 Datos biométricos (Atletas)</h3>
            <p>La selfie que proporcionas para la búsqueda de fotos es un <strong>dato biométrico sensible</strong> bajo la Ley 29733. Su tratamiento sigue estas reglas:</p>
            <ul>
              <li>Se procesa en tiempo real para generar un vector facial.</li>
              <li>La imagen original se elimina automáticamente a las <strong>24 horas</strong> de la búsqueda.</li>
              <li>El vector facial (no la imagen) se retiene hasta 72h para permitir búsquedas adicionales en el mismo evento.</li>
              <li>Nunca compartimos datos biométricos con terceros.</li>
              <li>Puedes solicitar eliminación inmediata en Ajustes → Privacidad → «Eliminar mis datos biométricos».</li>
            </ul>
            <h3>2.3 Datos de transacciones</h3>
            <ul>
              <li>Historial de compras y eventos consultados.</li>
              <li>Último 4 dígitos de tarjeta de crédito/débito (nunca el número completo; procesado por <strong>Culqi</strong>).</li>
              <li>Registros de pagos Yape/Plin (código de operación, monto, fecha).</li>
            </ul>
            <h3>2.4 Datos de uso</h3>
            <ul>
              <li>Dirección IP, tipo de navegador, sistema operativo.</li>
              <li>Páginas visitadas, tiempo de sesión, acciones en la plataforma.</li>
              <li>Cookies de sesión y preferencias (ver sección 6).</li>
            </ul>

            <h2>3. Finalidades del Tratamiento</h2>
            <ul>
              <li><strong>Prestación del servicio:</strong> búsqueda de fotos, gestión de compras, descarga de contenido.</li>
              <li><strong>Pagos:</strong> procesamiento de transacciones y transferencias a Fotógrafos.</li>
              <li><strong>Comunicaciones:</strong> confirmaciones de compra, notificaciones de nuevos eventos y alertas de seguridad.</li>
              <li><strong>Marketing (con consentimiento):</strong> newsletters y promociones. Puedes optar por no recibirlos en Ajustes → Notificaciones.</li>
              <li><strong>Mejora del servicio:</strong> análisis de uso anónimo y entrenamiento del modelo de IA (solo con consentimiento explícito).</li>
              <li><strong>Cumplimiento legal:</strong> obligaciones tributarias y respuesta a requerimientos de autoridades.</li>
            </ul>

            <h2>4. Base Legal del Tratamiento</h2>
            <ul>
              <li><strong>Ejecución del contrato</strong> (Art. 13, Ley 29733): datos necesarios para prestarte el servicio.</li>
              <li><strong>Consentimiento explícito</strong>: datos biométricos, marketing y entrenamiento de IA.</li>
              <li><strong>Obligación legal</strong>: retención de datos de transacciones según legislación tributaria peruana (SUNAT, 5 años).</li>
              <li><strong>Interés legítimo</strong>: seguridad de la plataforma y prevención de fraude.</li>
            </ul>

            <h2>5. Plazos de Retención</h2>
            <ul>
              <li>Selfie original: <strong>24 horas</strong></li>
              <li>Vector facial: <strong>72 horas</strong></li>
              <li>Datos de cuenta activa: mientras la cuenta esté activa + 1 año</li>
              <li>Historial de compras: <strong>5 años</strong> (obligación tributaria SUNAT)</li>
              <li>Logs de seguridad: <strong>12 meses</strong></li>
              <li>Datos de cuenta eliminada: 30 días para posible reactivación, luego eliminación definitiva</li>
            </ul>

            <h2>6. Cookies</h2>
            <p>Usamos los siguientes tipos de cookies:</p>
            <ul>
              <li><strong>Esenciales:</strong> sesión de usuario, carrito/selección de fotos. No desactivables.</li>
              <li><strong>Funcionales:</strong> preferencias de idioma, historial de eventos. Desactivables.</li>
              <li><strong>Analíticas:</strong> Google Analytics 4 (anonimizado). Desactivables.</li>
              <li><strong>Marketing:</strong> Meta Pixel, Google Ads. Solo con consentimiento explícito.</li>
            </ul>

            <h2>7. Terceros Receptores de Datos</h2>
            <ul>
              <li><strong>Culqi</strong> (procesador de pagos) — Lima, Perú</li>
              <li><strong>Amazon Web Services</strong> (infraestructura cloud) — región us-east-1, con cláusulas contractuales estándar</li>
              <li><strong>SendGrid</strong> (correos transaccionales) — bajo DPA conforme a GDPR/Ley 29733</li>
              <li><strong>Google Analytics</strong> (analítica) — datos anonimizados</li>
              <li><strong>SUNAT y autoridades peruanas</strong> — cuando sea requerido por ley</li>
            </ul>

            <h2>8. Tus Derechos (ARCO + portabilidad)</h2>
            <p>Bajo la Ley 29733, tienes derecho a:</p>
            <ul>
              <li><strong>Acceso:</strong> solicitar copia de tus datos personales.</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos.</li>
              <li><strong>Cancelación:</strong> solicitar eliminación de tus datos (sujeto a obligaciones legales de retención).</li>
              <li><strong>Oposición:</strong> oponerte al tratamiento para marketing o entrenamiento de IA.</li>
              <li><strong>Portabilidad:</strong> obtener tus datos en formato estructurado (JSON/CSV) desde Ajustes → Privacidad → «Descargar mis datos».</li>
            </ul>
            <p>Plazo de respuesta: <strong>20 días hábiles</strong> desde la solicitud. Escribe a: privacidad@fotify.pe</p>
            <p>Si consideras que hemos vulnerado tus derechos, puedes presentar una queja ante la <strong>Autoridad Nacional de Protección de Datos Personales (ANPDP)</strong>.</p>

            <h2>9. Seguridad</h2>
            <ul>
              <li>Cifrado TLS 1.3 en tránsito.</li>
              <li>Cifrado AES-256 en reposo para datos sensibles.</li>
              <li>Contraseñas almacenadas con bcrypt (factor 12).</li>
              <li>Auditorías de seguridad trimestrales.</li>
              <li>Notificación de brechas en ≤72h según Ley 29733.</li>
            </ul>
          </div>

          <!-- Panel: Acuerdo de Fotógrafo -->
          <div v-show="activeTab === 'fotografo'" class="legal-prose">
            <div class="legal-highlight">
              <p>Este Acuerdo complementa los Términos de Uso y aplica exclusivamente a los usuarios registrados como <strong>Fotógrafos Profesionales</strong> en Fotify. Es vinculante desde la activación de tu cuenta de fotógrafo.</p>
            </div>

            <h2>1. Requisitos para ser Fotógrafo Fotify</h2>
            <ul>
              <li>Ser persona natural mayor de 18 años o persona jurídica legalmente constituida en Perú.</li>
              <li>Proporcionar DNI/CE válido o RUC activo para efectos de pago y tributación.</li>
              <li>Indicar cuenta bancaria, Yape o Plin activos para recibir pagos.</li>
              <li>Contar con al menos 3 fotografías de muestra en tu perfil.</li>
              <li>Aceptar este Acuerdo y los Términos de Uso generales.</li>
            </ul>
            <p>Fotify se reserva el derecho de aprobar o rechazar solicitudes de registro de Fotógrafos a su criterio.</p>

            <h2>2. Licencia de Contenido</h2>
            <h3>2.1 Licencia otorgada a Fotify</h3>
            <p>Al subir fotografías a la Plataforma, otorgas a Fotify una licencia <strong>no exclusiva, mundial, sublicenciable</strong> para:</p>
            <ul>
              <li>Mostrar las fotografías en la Plataforma (con watermark).</li>
              <li>Generar miniaturas y versiones optimizadas para web.</li>
              <li>Distribuir las fotografías a los Atletas que las adquieran.</li>
              <li>Usar versiones watermarked con fines de marketing de la Plataforma.</li>
            </ul>
            <p>Esta licencia <strong>no otorga</strong> a Fotify el derecho de sublicenciar las fotos a terceros distintos de los Atletas compradores, ni de usarlas con fines distintos a los indicados.</p>
            <h3>2.2 Retención de derechos</h3>
            <p>Conservas todos los derechos de autor sobre tus fotografías. Puedes publicar las mismas fotos en otras plataformas simultáneamente. Fotify no exige exclusividad.</p>

            <h2>3. Contenido Prohibido</h2>
            <p>No puedes subir fotografías que:</p>
            <ul>
              <li>Muestren menores de edad en situación de vulnerabilidad o con enfoque explícito.</li>
              <li>Contengan material sexual explícito.</li>
              <li>Estén protegidas por derechos de autor de terceros sin autorización.</li>
              <li>Hayan sido manipuladas para alterar identidades o resultados deportivos.</li>
              <li>Incluyan datos personales visibles de terceros (documentos, placas, etc.) sin difuminado.</li>
            </ul>
            <p>El incumplimiento conlleva eliminación inmediata del contenido y posible suspensión de la cuenta.</p>

            <h2>4. Estructura de Pagos</h2>
            <h3>4.1 División de ingresos</h3>
            <ul>
              <li>Fotógrafo: <strong>70%</strong> del precio de venta (sin IGV).</li>
              <li>Fotify: <strong>30%</strong> (comisión de plataforma, incluye procesamiento de pagos e infraestructura).</li>
            </ul>
            <h3>4.2 Calendario de pagos</h3>
            <p>Los pagos se realizan <strong>los días 1 y 15 de cada mes</strong> para saldos acumulados superiores a S/ 50.00. Saldos menores se acumulan hasta alcanzar el mínimo o hasta el final del mes siguiente.</p>
            <h3>4.3 Método de pago</h3>
            <p>Transferencia bancaria, Yape o Plin según el método registrado en tu perfil. Para persona jurídica, se emite constancia de retención de 1.5% (Régimen de 4ta Categoría) o según régimen tributario correspondiente.</p>
            <h3>4.4 Retenciones y tributos</h3>
            <p>Eres responsable de declarar y pagar los impuestos que correspondan a tus ingresos. Para personas naturales peruanas, Fotify puede aplicar retención de 4ta categoría cuando corresponda. Recibirás los reportes necesarios para tu declaración anual.</p>

            <h2>5. Gestión de Eventos</h2>
            <h3>5.1 Crear eventos</h3>
            <p>Puedes crear eventos en la Plataforma siempre que cuentes con autorización del organizador del evento deportivo. Al crear un evento, declaras tener dicha autorización. Fotify no verifica esto pero puede solicitarlo en cualquier momento.</p>
            <h3>5.2 Subida de fotografías</h3>
            <ul>
              <li>Formato aceptado: JPEG, PNG, HEIF (mínimo 2MP, recomendado 12MP+).</li>
              <li>Tamaño máximo por imagen: 50 MB.</li>
              <li>Tiempo de procesamiento IA: 30–120 minutos según volumen.</li>
              <li>Fotografías publicadas automáticamente tras revisión de IA (salvo configuración de revisión manual).</li>
            </ul>
            <h3>5.3 Disponibilidad del evento</h3>
            <p>Los eventos permanecen activos y disponibles para compra durante <strong>90 días</strong> desde la fecha del evento. Después, pasan a modo archivo (visible pero no comprable) durante 12 meses adicionales, luego se eliminan.</p>

            <h2>6. Obligaciones del Fotógrafo</h2>
            <ul>
              <li>Mantener datos bancarios actualizados para no interrumpir pagos.</li>
              <li>Responder a notificaciones de Fotify en un plazo máximo de 5 días hábiles.</li>
              <li>Notificar a Fotify si el evento fue cancelado después de subir fotos.</li>
              <li>No cobrar directamente a Atletas por fotografías publicadas en Fotify.</li>
              <li>Mantener al menos el 80% de las fotos de un evento disponibles durante los 90 días activos.</li>
            </ul>

            <h2>7. Plan Pro Fotógrafo</h2>
            <p>El Plan Pro (S/ 49/mes o S/ 399/año) incluye:</p>
            <ul>
              <li>Comisión reducida: <strong>75%</strong> para el fotógrafo (vs. 70% en plan gratuito).</li>
              <li>Eventos ilimitados (plan gratuito: máximo 3 eventos activos simultáneos).</li>
              <li>Analytics avanzados: tasa de conversión por foto, heatmap de selección.</li>
              <li>Perfil destacado en búsquedas y página de exploración.</li>
              <li>Acceso prioritario al soporte.</li>
              <li>Marca de agua personalizable con tu logo.</li>
            </ul>

            <h2>8. Terminación del Acuerdo</h2>
            <h3>8.1 Por el fotógrafo</h3>
            <p>Puedes solicitar la eliminación de tu cuenta en cualquier momento desde Ajustes → Privacidad. Los eventos activos permanecerán disponibles 30 días adicionales para que los atletas que ya pagaron puedan descargar sus fotos. Recibirás el pago pendiente en el siguiente ciclo.</p>
            <h3>8.2 Por Fotify</h3>
            <p>Fotify puede suspender o terminar tu cuenta por incumplimiento de este Acuerdo o de los Términos de Uso, con o sin aviso previo según la gravedad de la infracción. En caso de terminación por causa imputable al Fotógrafo, los saldos pendientes pueden ser retenidos hasta 60 días mientras se procesan posibles reclamaciones de Atletas.</p>

            <h2>9. Contacto</h2>
            <p>Para consultas sobre pagos: pagos@fotify.pe<br>
            Para soporte técnico: soporte@fotify.pe<br>
            Para temas legales: legal@fotify.pe</p>
          </div>
        </div>

        <!-- Right: sidebar -->
        <div class="hidden lg:block w-64 flex-shrink-0 sticky top-20">

          <!-- TOC -->
          <div class="bg-night-2 border border-border rounded-xl p-5 mb-4">
            <p class="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">En esta sección</p>

            <div v-show="activeTab === 'terminos'" class="flex flex-col">
              <a v-for="item in tocTerminos" :key="item" class="toc-link">{{ item }}</a>
            </div>
            <div v-show="activeTab === 'privacidad'" class="flex flex-col">
              <a v-for="item in tocPrivacidad" :key="item" class="toc-link">{{ item }}</a>
            </div>
            <div v-show="activeTab === 'fotografo'" class="flex flex-col">
              <a v-for="item in tocFotografo" :key="item" class="toc-link">{{ item }}</a>
            </div>
          </div>

          <!-- Compliance badges -->
          <div class="bg-night-2 border border-border rounded-xl p-5 mb-4">
            <p class="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3">Cumplimiento</p>
            <div class="space-y-2">
              <div v-for="badge in complianceBadges" :key="badge" class="flex items-center gap-2">
                <div class="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <svg class="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <span class="text-xs text-white/60">{{ badge }}</span>
              </div>
            </div>
          </div>

          <!-- Contact -->
          <div class="bg-violet/10 border border-violet/30 rounded-xl p-5">
            <p class="text-xs font-semibold text-violet uppercase tracking-widest mb-2">¿Dudas legales?</p>
            <p class="text-xs text-white/50 mb-3 leading-relaxed">Nuestro equipo responde en 2 días hábiles.</p>
            <a
              href="mailto:legal@fotify.pe"
              class="block w-full text-center text-xs font-semibold py-2 px-3 rounded-lg bg-violet/20 hover:bg-violet/30 text-violet transition-colors"
            >
              legal@fotify.pe
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Términos y Políticas — Fotify',
  description: 'Términos de uso, política de privacidad y acuerdo de fotógrafo de Fotify. Cumplimiento Ley 29733 Perú.',
})

const activeTab = ref<'terminos' | 'privacidad' | 'fotografo'>('terminos')

const tabs = [
  { key: 'terminos' as const, label: 'Términos de Uso' },
  { key: 'privacidad' as const, label: 'Política de Privacidad' },
  { key: 'fotografo' as const, label: 'Acuerdo de Fotógrafo' },
]

const tocTerminos = [
  '01 — Definiciones',
  '02 — Elegibilidad',
  '03 — Uso del servicio',
  '04 — Derechos de fotos',
  '05 — Pagos y reembolsos',
  '06 — Reconocimiento IA',
  '07 — Responsabilidad',
  '08 — Modificaciones',
  '09 — Ley aplicable',
]

const tocPrivacidad = [
  '01 — Responsable',
  '02 — Datos recopilados',
  '03 — Finalidades',
  '04 — Base legal',
  '05 — Retención',
  '06 — Cookies',
  '07 — Terceros',
  '08 — Tus derechos',
  '09 — Seguridad',
]

const tocFotografo = [
  '01 — Requisitos',
  '02 — Licencia',
  '03 — Contenido prohibido',
  '04 — Pagos',
  '05 — Gestión eventos',
  '06 — Obligaciones',
  '07 — Plan Pro',
  '08 — Terminación',
]

const complianceBadges = [
  'Ley 29733 (Perú)',
  'ANPDP registrado',
  'TLS 1.3 + AES-256',
  'Pagos via Culqi PCI-DSS',
  'Biométricos eliminados en 24h',
]
</script>

<style scoped>
.legal-prose :deep(h2) {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  margin: 2rem 0 0.75rem;
  padding-top: 1.5rem;
  border-top: 1px solid #2A1F4A;
}
.legal-prose :deep(h2:first-child) {
  border-top: none;
  padding-top: 0;
  margin-top: 0;
}
.legal-prose :deep(h3) {
  font-size: 0.875rem;
  font-weight: 600;
  color: #c4b5fd;
  margin: 1.25rem 0 0.5rem;
}
.legal-prose :deep(p) {
  font-size: 0.875rem;
  line-height: 1.75;
  color: #a78bfa;
  margin-bottom: 0.75rem;
}
.legal-prose :deep(ul) {
  list-style: disc;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}
.legal-prose :deep(ul li) {
  font-size: 0.875rem;
  line-height: 1.75;
  color: #a78bfa;
  margin-bottom: 0.25rem;
}
.legal-prose :deep(strong) {
  color: #ddd6fe;
  font-weight: 600;
}

.legal-highlight {
  background: #221840;
  border: 1px solid #2A1F4A;
  border-left: 3px solid #7C3AED;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.5rem;
}
.legal-highlight :deep(p) {
  margin: 0;
  color: #c4b5fd;
}

.toc-link {
  display: block;
  font-size: 0.8125rem;
  color: #8b7fd4;
  padding: 0.375rem 0;
  border-bottom: 1px solid #2A1F4A;
  cursor: default;
  transition: color 0.2s;
}
.toc-link:last-child {
  border-bottom: none;
}
</style>
