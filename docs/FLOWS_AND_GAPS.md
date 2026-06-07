# Fotify Web - Flujos y Gaps

> Documento de referencia para resolver gaps en distintas sesiones.
> Ultima actualizacion: 2026-06-07

---

## Convenciones

- **Estado**: `[ ]` pendiente | `[~]` en progreso | `[x]` resuelto
- **Severidad**: ALTA | MEDIA | BAJA
- **Archivos clave** listados por flujo para contexto rapido

---

## 1. AUTENTICACION

**Archivos**: `components/AuthModal.vue`, `stores/auth.ts`, `composables/useApi.ts`, `middleware/auth.ts`, `pages/auth/forgot-password.vue`, `pages/auth/reset-password.vue`

### Flujo actual

1. Usuario abre modal (login o register)
2. **Login**: email + password -> POST `/auth/login` -> setTokens -> si es fotografo muestra panel-redirect, si no cierra modal
3. **Registro**: nombre + email + password + terms -> POST `/auth/register` -> setTokens -> pantalla de exito -> cierra modal
4. **Forgot password**: email -> (actualmente simulado con setTimeout) -> pantalla de exito
5. **Reset password**: token de URL -> nuevo password -> POST `/auth/reset-password`

### Gaps

| # | Gap | Severidad | Estado | Notas |
|---|-----|-----------|--------|-------|
| AUTH-01 | **No hay verificacion de email post-registro** — registro hace setTokens de inmediato sin confirmar email | ALTA | [ ] | `AuthModal.vue:379-387` — POST `/auth/register` retorna tokens y se setean directo |
| AUTH-02 | **Login social (Google)** — botones removidos de UI, implementar OAuth en fase 2 (requiere AUTH-11 pagina `/login`) | MEDIA | [~] |
| AUTH-11 | **Sin pagina `/login` dedicada** — login solo funciona via modal; necesario para deep linking, redirects de middleware, y OAuth callbacks | MEDIA | [ ] | `AuthModal.vue:78,161` — Decidir si implementar o remover UI |
| AUTH-03 | **Race condition en token refresh** — multiples requests 401 concurrentes disparan refresh simultaneos sin mutex | ALTA | [x] | `useApi.ts:22-25` — No hay queue ni lock; N requests = N refresh calls |
| AUTH-04 | **Logout no llama al API** — solo borra cookies locales, token sigue valido en backend Redis | ALTA | [x] | `auth.ts:41-46` — Endpoint `/auth/logout` existe en API pero nunca se llama |
| AUTH-05 | **Sin rate limiting en login** — no hay throttling, backoff ni CAPTCHA tras intentos fallidos | ALTA | [x] | `AuthModal.vue:330-357` — handleLogin sin ningun control de intentos |
| AUTH-06 | **Sin feedback de sesion expirada** — 401 causa logout silencioso sin notificar al usuario | MEDIA | [x] | `auth.ts:36-37` — catch en refresh() hace logout() sin aviso |
| AUTH-07 | **Middleware auth incompleto** — solo aplicado en `/account`, falta en `/purchases`, `/checkout`, `/downloads/*` | MEDIA | [x] | `middleware/auth.ts` tiene 4 lineas; solo `account.vue` lo usa con `definePageMeta` |
| AUTH-08 | **Sin sincronizacion cross-tab** — logout en Tab A no se refleja en Tab B hasta refresh | MEDIA | [x] | `auth.ts` usa `useCookie` que es compartido pero Pinia state no se sincroniza reactivamente |
| AUTH-09 | **Validacion de password debil** — solo min 8 chars, sin requisitos de mayusculas/numeros/especiales | MEDIA | [x] | Frontend y API resueltos | `AuthModal.vue:372` — `password.length < 8` es la unica validacion; strength bar es solo visual |
| AUTH-10 | **Forgot password simulado** — handleForgot usa setTimeout en vez de llamar al API | ALTA | [x] | `AuthModal.vue:398-403` — `await new Promise(r => setTimeout(r, 1000))` — nunca llama al backend |

---

## 2. BUSQUEDA FACIAL (IA)

**Archivos**: `pages/search.vue`, `stores/cart.ts`, `composables/useAuthModal.ts`

### Flujo actual

1. Auth gate: si no autenticado, pide login
2. Consent: primera vez muestra modal de consentimiento biometrico
3. Upload: usuario sube selfie (JPG/PNG, max 10MB)
4. Search: POST `/search/init` -> PUT a S3 (presigned URL) -> POST `/search/execute`
5. Results: muestra fotos encontradas con confianza >= 85% (o parciales 70-85%)
6. Selection: usuario selecciona fotos -> "Ir al pago"

### Gaps

| # | Gap | Severidad | Estado | Notas |
|---|-----|-----------|--------|-------|
| SEARCH-01 | **Sin timeout en llamadas API** — si `/search/init`, upload S3 o `/search/execute` cuelgan, usuario queda atrapado en "buscando" | ALTA | [ ] | `search.vue` — No hay AbortController ni timeout en ninguna de las 3 llamadas secuenciales |
| SEARCH-02 | **Sin retry en upload de selfie** — fallo en PUT a S3 muestra error generico sin reintento automatico | MEDIA | [ ] | Upload usa `$fetch` raw sin retry ni backoff |
| SEARCH-03 | **Boton atras rompe el flujo** — state machine client-side; back button pierde paso actual mientras search ejecuta en servidor | MEDIA | [ ] | Step refs no estan sincronizados con browser history |
| SEARCH-04 | **Sin cancelacion de busqueda** — usuario no puede abortar una busqueda en progreso | BAJA | [ ] | No hay AbortController expuesto al UI |
| SEARCH-05 | **Sin cache de resultados** — si usuario navega fuera y vuelve, pierde resultados y debe buscar de nuevo | MEDIA | [ ] | Cart guarda photoIds pero no los resultados de busqueda con thumbnails |

---

## 3. CARRITO

**Archivos**: `stores/cart.ts`

### Flujo actual

1. Usuario selecciona fotos desde search o event detail
2. Cart almacena: eventId, photoIds, sessionId, orderType
3. State se persiste en sessionStorage
4. Al ir a checkout, cart provee los datos de la orden

### Gaps

| # | Gap | Severidad | Estado | Notas |
|---|-----|-----------|--------|-------|
| CART-01 | **sessionStorage se pierde al cerrar tab** — carrito desaparece si usuario cierra pestana | ALTA | [ ] | `cart.ts:14-24` — Deberia usar localStorage para persistir entre sesiones |
| CART-02 | **Sin validacion de fotos stale** — si admin elimina fotos despues de agregarlas al carrito, checkout falla con error generico | MEDIA | [ ] | No hay pre-check de existencia de fotos antes de crear orden |

---

## 4. CHECKOUT Y PAGOS

**Archivos**: `pages/checkout.vue`, `composables/useIzipay.ts`, `stores/cart.ts`

### Flujo actual

1. Auth check + cart validation
2. Mostrar progress steps (Seleccionar -> Checkout -> Descargar)
3. Confirmar/ingresar email
4. Seleccionar metodo de pago (Tarjeta, Yape, Plin)
5. **Tarjeta**: aceptar terms -> POST `/orders` -> init Izipay Krypton form -> pago -> callback
6. **QR (Yape/Plin)**: aceptar terms -> POST `/orders` -> mostrar QR -> polling cada 3s por 10min
7. Exito: overlay con opcion de descarga
8. Error: mensaje con opcion de reintentar

### Gaps

| # | Gap | Severidad | Estado | Notas |
|---|-----|-----------|--------|-------|
| CHECKOUT-01 | **Sin idempotencia en creacion de orden** — boton "Pagar" no se deshabilita inmediatamente, posible doble cobro | ALTA | [ ] | `checkout.vue` — `step` cambia a 'processing' DESPUES del POST, no antes; sin idempotency key |
| CHECKOUT-02 | **QR expirado sin recovery** — timer de 10min llega a 0 pero no pasa nada, usuario atrapado en pantalla de QR muerto | ALTA | [ ] | Timer `qrSeconds` llega a 0, interval se limpia, pero no hay cambio de estado ni CTA de retry |
| CHECKOUT-03 | **Izipay CDN caido = checkout muerto** — si script Krypton no carga, error duro sin fallback | MEDIA | [ ] | `useIzipay.ts:38` — `window.KR` check lanza error sin retry ni degradacion |
| CHECKOUT-04 | **Cierre de browser durante pago = orden perdida** — orderId solo se guarda en localStorage tras exito | MEDIA | [ ] | No hay mecanismo de recovery; usuario debe re-buscar y re-ordenar |
| CHECKOUT-05 | **Email solo validacion de formato** — sin verificacion real antes de crear orden | MEDIA | [ ] | Regex basico; typo = confirmacion va a inbox equivocado, usuario no puede descargar |
| CHECKOUT-06 | **Sin loading guard especifico** — guard muestra spinner si !auth o !cart pero no dice cual fallo | BAJA | [ ] | `checkout.vue:5-9` — Mismo spinner para "no logueado" y "carrito vacio" |

---

## 5. DESCARGAS

**Archivos**: `pages/downloads/[orderId].vue`, `pages/purchases.vue`

### Flujo actual

1. `/purchases`: lista de ordenes con stats, filtro por estado, infinite scroll
2. Click "Descargar" -> `/downloads/[orderId]`
3. Download page: boton "Descargar mis X fotos" (bulk) o individual por foto
4. Cada descarga pide signed URL al API -> descarga desde S3

### Gaps

| # | Gap | Severidad | Estado | Notas |
|---|-----|-----------|--------|-------|
| DOWNLOAD-01 | **URLs firmadas sin aviso de expiracion** — si link S3 expira, usuario ve 403 sin boton de "regenerar" | MEDIA | [ ] | Signed URLs tipicamente expiran en 15min-1hr; no hay retry en UI |
| DOWNLOAD-02 | **Descarga masiva sin manejo de errores** — `Promise.allSettled()` ignora fotos que fallan silenciosamente | MEDIA | [ ] | `downloadAll()` no notifica al usuario cuales fotos fallaron |
| DOWNLOAD-03 | **Sin acceso cross-device** — photo_ids caen a localStorage fallback; desde otro dispositivo grilla vacia sin explicacion | MEDIA | [ ] | Deberia obtener photo_ids siempre del API, no de localStorage |
| DOWNLOAD-04 | **Empty state en purchases sin skeleton** — no hay loading skeleton en fetch inicial | BAJA | [ ] | |
| DOWNLOAD-05 | **Sin flujo de reembolso** — badges de estado muestran "Reembolsado" pero no hay UI para solicitar uno | BAJA | [ ] | |

---

## 6. CUENTA DE USUARIO

**Archivos**: `pages/account.vue`

### Flujo actual

1. Tabs: Perfil, Seguridad, Notificaciones, Privacidad
2. **Perfil**: editar nombre, email, telefono, ciudad, deportes -> PATCH `/auth/me`
3. **Seguridad**: cambiar password, ver sesiones, cuentas conectadas
4. **Notificaciones**: toggles de preferencias
5. **Privacidad**: eliminar datos biometricos, descargar datos, eliminar cuenta

### Gaps

| # | Gap | Severidad | Estado | Notas |
|---|-----|-----------|--------|-------|
| ACCOUNT-01 | **"Eliminar cuenta" es solo UI** — boton solo muestra toast, no llama a ningun endpoint | ALTA | [ ] | `account.vue` — `@click="showToast()"` sin API call |
| ACCOUNT-02 | **"Eliminar datos biometricos" es solo UI** — toast sin API call | ALTA | [ ] | Mismo patron que eliminar cuenta |
| ACCOUNT-03 | **"Descargar mis datos (JSON)" sin implementar** — boton sin click handler | MEDIA | [ ] | |
| ACCOUNT-04 | **Email no se puede cambiar** — input editable pero `saveProfile()` no envia email en el PATCH | MEDIA | [ ] | Solo envia `full_name` y `phone` |
| ACCOUNT-05 | **Ciudades hardcodeadas** — solo 4 ciudades fijas (Lima, Arequipa, Cusco), no se cargan del servidor | BAJA | [ ] | |
| ACCOUNT-06 | **Notificaciones con defaults hardcodeados** — preferencias iniciales no se traen del servidor al montar | BAJA | [ ] | Siempre muestra defaults en vez de fetch de `/auth/notification-preferences` |

---

## 7. EVENTOS Y NAVEGACION

**Archivos**: `pages/index.vue`, `pages/events/index.vue`, `pages/events/[slug].vue`

### Flujo actual

1. Homepage: hero con buscador, eventos destacados, categorias, CTA fotografos
2. `/events`: grid con filtros por categoria, ciudad y ordenamiento
3. `/events/[slug]`: detalle con galeria, precios, boton de busqueda o seleccion directa

### Gaps

| # | Gap | Severidad | Estado | Notas |
|---|-----|-----------|--------|-------|
| EVENTS-01 | **Sin compartir en redes sociales** — detalle de evento no tiene botones de share | MEDIA | [ ] | No hay WhatsApp, Facebook, Twitter/X share |
| EVENTS-02 | **SEO incompleto en evento** — falta canonical URL, structured data AggregateOffer | MEDIA | [ ] | `events/[slug].vue` — tiene og tags pero falta schema.org |
| EVENTS-03 | **Busqueda sin autocomplete en `/events`** — input sin sugerencias mientras se escribe | BAJA | [ ] | Homepage SI tiene autocomplete, pero la pagina de listado no |
| EVENTS-04 | **Ciudades hardcodeadas en filtro** — solo Lima, Arequipa, Cusco | BAJA | [ ] | Misma limitacion que en account |

---

## 8. INFRAESTRUCTURA TRANSVERSAL

| # | Gap | Severidad | Estado | Notas |
|---|-----|-----------|--------|-------|
| INFRA-01 | **Sin analytics/tracking** — no hay GA, Mixpanel ni event tracking | MEDIA | [ ] | No hay tracking de search, checkout, errores ni engagement |
| INFRA-02 | **Accesibilidad deficiente** — sin focus trap en modales, sin skip links, contraste insuficiente | MEDIA | [ ] | `AuthModal.vue` no tiene focus trap; `text-white/30` no cumple WCAG AA |
| INFRA-03 | **Sin manejo offline** — no hay service worker ni UI de "sin conexion" | BAJA | [ ] | |
| INFRA-04 | **Sin i18n** — todo hardcodeado en espanol | BAJA | [ ] | De momento mercado es Peru, pero limita expansion |
| INFRA-05 | **Error page limitada** — solo 404 y 500, sin "reportar bug" ni "volver atras" | BAJA | [ ] | `error.vue` — solo 2 tipos de error manejados |

---

## Resumen de prioridades

### Criticos (resolver primero)
1. ~~`AUTH-10` Forgot password simulado~~ ✅ 2026-06-07
2. ~~`AUTH-04` Logout no invalida token en backend~~ ✅ 2026-06-07
3. ~~`AUTH-03` Race condition en token refresh~~ ✅ 2026-06-07
4. `CHECKOUT-01` Doble cobro por falta de idempotencia
5. `CHECKOUT-02` QR expirado sin recovery
6. `AUTH-01` Registro sin verificacion de email — pendiente decision cliente
7. `CART-01` Carrito en sessionStorage

### Importantes (segunda ronda)
8. ~~`AUTH-05` Rate limiting en login~~ ✅ 2026-06-07
9. ~~`AUTH-07` Middleware auth incompleto~~ ✅ 2026-06-07 (ya estaba resuelto)
10. `ACCOUNT-01` Eliminar cuenta solo UI
11. `ACCOUNT-02` Eliminar datos biometricos solo UI
12. `SEARCH-01` Timeout en busqueda
13. `CHECKOUT-03` Fallback cuando Izipay CDN falla
14. `DOWNLOAD-03` Acceso cross-device

### Mejoras (tercera ronda)
15. ~~`AUTH-06` Feedback de sesion expirada~~ ✅ 2026-06-07
16. ~~`AUTH-08` Sync cross-tab~~ ✅ 2026-06-07
17. ~~`AUTH-09` Validacion de password mas fuerte~~ ✅ 2026-06-07 (frontend + API)
18. `EVENTS-01` Share en redes sociales
19. `EVENTS-02` SEO structured data
20. `INFRA-01` Analytics
21. `INFRA-02` Accesibilidad

### Fase 2
22. `AUTH-02` Login social (Google OAuth) — requiere AUTH-11
23. `AUTH-11` Pagina `/login` dedicada — deep linking, OAuth callbacks, redirects de middleware

---

## Notas para sesiones futuras

- Cada gap tiene un ID unico (ej: `AUTH-04`) para referencia rapida
- Al resolver un gap, cambiar `[ ]` a `[x]` y agregar fecha
- Los archivos clave estan listados por flujo para contexto inmediato
- Las lineas de codigo referenciadas son aproximadas — verificar antes de editar
