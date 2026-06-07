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
3. State se persiste en localStorage
4. Al ir a checkout, cart provee los datos de la orden

### Gaps

| # | Gap | Severidad | Estado | Notas |
|---|-----|-----------|--------|-------|
| CART-01 | **sessionStorage se pierde al cerrar tab** — carrito desaparece si usuario cierra pestana | ALTA | [x] | `cart.ts` — Migrado a localStorage. Resuelto 2026-06-07 |
| CART-02 | **Sin validacion de fotos stale** — si admin elimina fotos despues de agregarlas al carrito, checkout falla con error generico | MEDIA | [x] | `checkout.vue:onMounted` valida con `POST /events/{id}/photos/validate`; fotos invalidas se muestran opacadas en zona separada, pago bloqueado hasta descartarlas. Resuelto 2026-06-07 |
| CART-02a | ~~Fotos invalidas se remueven automaticamente~~ | MEDIA | [x] | Corregido: se muestran opacadas con grayscale + X, zona "no disponibles" separada, boton "Descartar". Resuelto 2026-06-07 |
| CART-02b | ~~`isValidating` no se resetea en early returns~~ | BAJA | [x] | Corregido: early returns ahora hacen `isValidating.value = false`. Resuelto 2026-06-07 |
| CART-02c | ~~Redirect de carrito vacio usa eventId en vez de slug~~ | BAJA | [x] | Corregido: usa `backLink` computed que resuelve a slug via query param. Resuelto 2026-06-07 |

---

## 4. CHECKOUT Y PAGOS

**Archivos**: `pages/checkout.vue`, `pages/checkout/index.vue`, `composables/useCheckout.ts`, `composables/useIzipay.ts`, `stores/cart.ts`

### Flujo actual (refactorizado 2026-06-07)

> Simplificado a un solo paso. Se elimino la pagina de pago separada (`payment.vue`), el selector de metodo de pago (solo se usa tarjeta/Izipay), el campo de email (se obtiene de `/auth/me`), y QR/Yape/Plin.

**Estructura de archivos:**
- `checkout.vue` — Parent route: guards, progress steps, success overlay (teleport), failed state, NuxtPage
- `checkout/index.vue` — Child: grid de fotos + sidebar resumen + form Izipay Krypton
- `useCheckout.ts` — Composable con provide/inject para compartir estado entre parent e hijo

**Steps:** `detail` → `processing` → `payment-form` → `success` | `failed`

**Flujo:**
1. **Guard**: si no autenticado muestra modal login; si carrito vacio redirige a `/events` (excepto si hay fotos no disponibles mostrándose)
2. **Init**: carga en paralelo evento (`GET /events/{id}`) y email (`GET /auth/me`)
3. **Validacion CART-02**: `POST /events/{id}/photos/validate` → fotos invalidas se muestran en zona separada con grayscale
   - Si algunas invalidas: boton "Entendido" las descarta y continua con las validas
   - Si todas invalidas: muestra zona y link "Entendido, volver al evento →"
4. **Detail** (paso unico): grid de fotos con remove buttons + sidebar con precio, TyC checkbox, boton "Pagar de forma segura"
5. **handlePay()**: valida TyC → `step = processing` → crea orden `POST /orders` (o reutiliza orderId existente si es retry) → pide token `POST /orders/{id}/payment-token`
6. **payment-form**: renderiza form Izipay Krypton (kr-pan, kr-expiry, kr-security-code, kr-card-holder-name). Boton "Volver al detalle" disponible.
7. **handleCardSubmit()**: llama `izipay.submit()` → callback `onPaymentResult` confirma con `POST /orders/{id}/confirm-payment`
8. **Success**: `step = success` (ANTES de `cart.clear()` para evitar race condition con watch) → overlay teleported con boton "Descargar mis fotos"
9. **Failed**: pantalla con razones seleccionables + "Reintentar →" (vuelve a detail, reutiliza orderId)

**UI responsive:**
- Desktop: grid izquierda + sidebar sticky derecha
- Mobile: resumen colapsado arriba + grid + terms/pay abajo
- Card form: reemplaza grid via v-if/v-else

### Gaps

| # | Gap | Severidad | Estado | Notas |
|---|-----|-----------|--------|-------|
| CHECKOUT-01 | **Sin idempotencia en creacion de orden** — sin idempotency key en header del POST | MEDIA | [ ] | El boton se deshabilita con `step = processing` antes del POST. Riesgo reducido pero no eliminado. Ideal: enviar `Idempotency-Key` header |
| CHECKOUT-02 | ~~QR expirado sin recovery~~ | — | N/A | QR/Yape/Plin eliminados del flujo |
| CHECKOUT-03 | **Izipay CDN caido = checkout muerto** — si script Krypton no carga, error duro sin fallback | MEDIA | [ ] | `useIzipay.ts` — No hay retry ni degradacion graciosa |
| CHECKOUT-04 | **Cierre de browser durante pago = orden perdida** — orderId solo se persiste en success | MEDIA | [ ] | Mejora posible: guardar orderId en localStorage al crearlo para recovery |
| CHECKOUT-05 | ~~Email solo validacion de formato~~ | — | N/A | Email ya no es input del usuario; se obtiene de `/auth/me` |
| CHECKOUT-06 | **Sin loading guard especifico** — guard muestra spinner si !auth o !cart pero no dice cual fallo | BAJA | [ ] | `checkout.vue:5` — Mismo spinner para ambos casos |
| CHECKOUT-07 | ~~QR timer arranca al seleccionar metodo~~ | — | N/A | QR eliminado |
| CHECKOUT-08 | ~~Polling no se detiene si QR expira~~ | — | N/A | QR eliminado |
| CHECKOUT-09 | **Orden huerfana si usuario cierra tab** — orden queda pendiente en backend | MEDIA | [ ] | Depende de TTL/cleanup en backend |
| CHECKOUT-10 | **Reintentar crea orden duplicada** | MEDIA | [x] | Resuelto 2026-06-07: `handlePay` reutiliza `ck.orderId.value` existente |
| CHECKOUT-11 | **`krSubmitting` se resetea antes de confirmar pago** — spinner desaparece durante `confirm-payment` | BAJA | [ ] | `onPaymentResult` hace `krSubmitting = false` al inicio del callback |
| CHECKOUT-12 | ~~Cupon sin funcionalidad~~ | — | N/A | Cupon eliminado de la UI |
| CHECKOUT-13 | **Race condition success/redirect** — `cart.clear()` disparaba watch antes de `step = success` | ALTA | [x] | Resuelto 2026-06-07: se invirtio orden (`step = success` antes de `cart.clear()`) |
| CHECKOUT-14 | **NuxtLink en label togglea checkbox** — click en TyC/Privacidad activaba/desactivaba checkbox | BAJA | [x] | Resuelto 2026-06-07: agregado `@click.stop` a NuxtLinks dentro de labels |

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
4. ~~`CHECKOUT-13` Race condition success/redirect~~ ✅ 2026-06-07
5. ~~`CART-01` Carrito en sessionStorage~~ ✅ 2026-06-07
6. `CHECKOUT-01` Idempotency key en creacion de orden
7. `AUTH-01` Registro sin verificacion de email — pendiente decision cliente

### Importantes (segunda ronda)
8. ~~`AUTH-05` Rate limiting en login~~ ✅ 2026-06-07
9. ~~`AUTH-07` Middleware auth incompleto~~ ✅ 2026-06-07
10. ~~`CHECKOUT-10` Reintentar crea orden duplicada~~ ✅ 2026-06-07
11. ~~`CART-02` Validacion de fotos stale~~ ✅ 2026-06-07
12. `ACCOUNT-01` Eliminar cuenta solo UI
13. `ACCOUNT-02` Eliminar datos biometricos solo UI
14. `SEARCH-01` Timeout en busqueda
15. `CHECKOUT-03` Fallback cuando Izipay CDN falla
16. `CHECKOUT-09` Ordenes huerfanas sin cleanup (backend TTL)
17. `CHECKOUT-04` Recovery de orden si se cierra browser
18. `DOWNLOAD-03` Acceso cross-device

### Mejoras (tercera ronda)
19. ~~`AUTH-06` Feedback de sesion expirada~~ ✅ 2026-06-07
20. ~~`AUTH-08` Sync cross-tab~~ ✅ 2026-06-07
21. ~~`AUTH-09` Validacion de password mas fuerte~~ ✅ 2026-06-07
22. ~~`CHECKOUT-14` NuxtLink togglea checkbox~~ ✅ 2026-06-07
23. `CHECKOUT-11` krSubmitting se resetea antes de confirmar
24. `CHECKOUT-06` Loading guard sin feedback especifico
25. `EVENTS-01` Share en redes sociales
26. `EVENTS-02` SEO structured data
27. `INFRA-01` Analytics
28. `INFRA-02` Accesibilidad

### Fase 2
29. `AUTH-02` Login social (Google OAuth) — requiere AUTH-11
30. `AUTH-11` Pagina `/login` dedicada — deep linking, OAuth callbacks, redirects de middleware

### Eliminados (N/A por refactor checkout 2026-06-07)
- ~~`CHECKOUT-02` QR expirado~~ — QR/Yape/Plin eliminados
- ~~`CHECKOUT-05` Email validacion~~ — Email ya no es input
- ~~`CHECKOUT-07` QR timer~~ — QR eliminado
- ~~`CHECKOUT-08` Polling QR~~ — QR eliminado
- ~~`CHECKOUT-12` Cupon~~ — Cupon eliminado de UI

---

## Notas para sesiones futuras

- Cada gap tiene un ID unico (ej: `AUTH-04`) para referencia rapida
- Al resolver un gap, cambiar `[ ]` a `[x]` y agregar fecha
- Los archivos clave estan listados por flujo para contexto inmediato
- Las lineas de codigo referenciadas son aproximadas — verificar antes de editar
