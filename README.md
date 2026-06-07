# fotify-web

Frontend web de Fotify — marketplace de fotos de eventos con reconocimiento facial.

## Stack

- Nuxt 3 + Vue 3 (Composition API + `<script setup>`)
- TypeScript
- Pinia (stores)
- TanStack Query (vue-query)
- Tailwind CSS

## Setup

```bash
npm install
cp .env.example .env
```

## Development

```bash
npm run dev   # http://localhost:3000
```

Requiere `fotify-api` corriendo en `localhost:8080` (via docker-compose) o `localhost:8000` (local).

## Build

```bash
npm run build
npm run preview   # preview de produccion en localhost:3000
```

## Dependencias de otros repos

- **fotify-api** — todos los endpoints REST consumidos desde `composables/useApi.ts`
- **fotify-db** — schema es fuente de verdad (este repo no tiene migraciones)
- **fotify-mockups** — referencia visual de las paginas
