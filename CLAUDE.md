# Fotify Web — Project Context

## What is this

Fotify is a sports photography marketplace (Peru market). Athletes find their event photos via facial recognition AI, purchase HD downloads. Photographers upload and monetize event photos.

## Tech Stack

- **Framework**: Nuxt 3 (Vue 3, Composition API, `<script setup>`, TypeScript)
- **Styling**: Tailwind CSS (dark theme, custom colors: `night`, `night-2`, `violet`, `coral`, `border`)
- **State**: Pinia stores with localStorage persistence
- **API**: Custom `apiFetch` wrapper (`composables/useApi.ts`) with automatic 401 token refresh
- **Payments**: Izipay Krypton Smart Form (`kr-smart-form`, card only, `payment_gateway: "izipay"` always)
- **Deploy**: Static/SSR via Nitro

## Key Architecture Decisions

- **Checkout**: Single-step (no separate payment page). Parent `checkout.vue` + child `checkout/index.vue` via NuxtPage. State shared via provide/inject (`useCheckout.ts`)
- **Cart**: localStorage-persisted Pinia store. Holds `eventId`, `photoIds`, `orderType`, `searchSessionId`
- **Auth**: JWT access + refresh tokens in cookies. Modal-based login (no `/login` page yet)
- **Demo photos**: `useDemoPhoto` composable generates picsum.photos fallbacks when API returns no thumbnail
- **Legal**: Single `/legal` page with tabs (terminos, privacidad, fotografo). Supports `?tab=` query param

## Conventions

- Code/vars/comments: **English**
- UI text / Jira / docs: **Spanish**
- Vue: Composition API + `<script setup>` + TypeScript (never Options API for new code)
- Follow existing patterns before introducing new ones

## Important Files

| Path | Purpose |
|------|---------|
| `app/pages/checkout.vue` | Checkout parent: guards, progress, success overlay, failed state |
| `app/pages/checkout/index.vue` | Checkout child: photo grid, sidebar, Izipay form |
| `app/composables/useCheckout.ts` | Checkout shared state (provide/inject) |
| `app/composables/useApi.ts` | `apiFetch` with 401 refresh, `validateCartPhotos` |
| `app/composables/useIzipay.ts` | Izipay Krypton SDK wrapper |
| `app/composables/useDemoPhoto.ts` | Thumbnail fallback generator |
| `app/stores/cart.ts` | Cart store (localStorage) |
| `app/stores/auth.ts` | Auth store (JWT tokens) |
| `app/pages/legal.vue` | Terms, Privacy, Photographer agreement |
| `docs/FLOWS_AND_GAPS.md` | Full flow documentation + known gaps |

## API Endpoints (checkout flow)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/events/{id}` | Event detail (name, date, photo_price) |
| GET | `/auth/me` | Current user email |
| POST | `/events/{id}/photos/validate` | Validate cart photo IDs still exist |
| POST | `/orders` | Create order (`payment_gateway: "izipay"`) |
| POST | `/orders/{id}/payment-token` | Get Izipay `form_token` + `public_key` |
| POST | `/orders/{id}/confirm-payment` | Confirm with `kr_answer` + `kr_hash` |

## Checkout Steps

```
detail → processing → payment-form → success
                   ↘ failed → (retry) → detail
```

## Known Bugs / Gaps

See `docs/FLOWS_AND_GAPS.md` for full list. Top pending:
- `CHECKOUT-01`: No idempotency key on order creation
- `CHECKOUT-03`: No fallback when Izipay CDN fails
- `CHECKOUT-09`: Orphan orders if user closes browser mid-payment
- `ACCOUNT-01/02`: Delete account/biometrics are UI-only (no API call)
- `SEARCH-01`: No timeout on search API calls
