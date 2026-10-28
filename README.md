# MARN — Agency Portal

Production-grade SaaS platform for agencies in Qatar to manage daily operations.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| UI | Shadcn UI |
| Forms | React Hook Form + Zod |
| Data Fetching | TanStack Query + Axios |
| State | Zustand |
| i18n | next-intl (en / ar RTL) |
| Animation | Framer Motion *(Module 4)* |
| Charts | Recharts *(Module 5)* |

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Google Maps (location picker)

The dashboard header location modal uses **Google Maps Platform** (Maps JavaScript + Places + Geocoding).

1. Create an API key in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Maps JavaScript API**, **Places API (New)**, and **Geocoding API**
3. Set **Application restrictions → HTTP referrers**:
   - `http://localhost:3000/*`
   - `https://your-production-domain/*`
4. Prefer **API restrictions** limited to those three APIs
5. Add to `.env.local`:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

Without a key, the modal still opens but shows a setup message instead of the map.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |
| `npm run typecheck` | TypeScript type check |

## Architecture

This project follows **Feature-Based Architecture** with **Clean Architecture** principles:

```
UI (components/) → Features (features/) → Services (services/) → API
```

Business logic never lives inside `app/`. The App Router is a thin routing layer only.

## Folder Structure

```
agency-portal/
├── app/                    # Next.js App Router — routing only ([locale] segment)
├── components/             # Shared design system & UI primitives
├── features/               # Domain features (business logic home)
├── services/               # API layer (axios, repositories)
├── store/                  # Global Zustand stores
├── hooks/                  # Shared React hooks
├── providers/              # React context providers (Theme, Locale, Auth, Query, Toast)
├── i18n/                   # next-intl routing, navigation, locale config
├── messages/               # Translation catalogs (en.json, ar.json)
├── config/                 # App configuration & env
├── constants/              # App-wide constants
├── types/                  # Shared TypeScript types
├── lib/                    # Core libraries (cn, query client, middleware helpers)
├── utils/                  # Shared utility functions
├── styles/                 # Global CSS & design tokens
├── assets/                 # Static assets (images, fonts)
├── schemas/                # Shared Zod schemas
├── public/                 # Public static files
└── middleware.ts           # next-intl locale middleware entry point
```

---

### `app/` — Routing Layer

**Purpose:** Next.js App Router pages, layouts, and route groups only. No business logic.

| Path | Purpose |
|------|---------|
| `[locale]/` | Locale-prefixed routes (`/en/...`, `/ar/...`) |
| `[locale]/(auth)/` | Unauthenticated routes (login, forgot-password) |
| `[locale]/(dashboard)/` | Authenticated app shell (dashboard, agencies, etc.) |
| `layout.tsx` | Root HTML shell, fonts, metadata |
| `[locale]/layout.tsx` | Locale validation, providers, static params |
| `[locale]/loading.tsx` | Locale Suspense fallback |
| `[locale]/error.tsx` | Locale error boundary |
| `[locale]/not-found.tsx` | Locale 404 page |

**Rule:** Pages import from `@/features/*` and `@/components/*`. Never call Axios here.

---

### `components/` — Design System

**Purpose:** Reusable, domain-agnostic UI building blocks.

| Subfolder | Purpose |
|-----------|---------|
| `ui/` | Shadcn primitives (Button, Input, Dialog…) |
| `forms/` | Reusable form field wrappers |
| `layout/` | Page shells, containers, grids |
| `table/` | DataTable and table utilities |
| `charts/` | Recharts wrappers |
| `dialogs/` | Modal/dialog patterns |
| `cards/` | Stat cards, info cards |
| `loaders/` | Skeletons, spinners |
| `icons/` | Custom icon components |
| `navigation/` | Sidebar, navbar, breadcrumbs |

---

### `features/` — Domain Modules

**Purpose:** Self-contained business domains. Each feature owns its UI, logic, types, and validation.

```
features/<name>/
├── components/     # Feature-specific UI
├── hooks/          # Feature-specific React hooks
├── services/       # Feature-level service orchestration
├── types/          # Feature TypeScript types
├── schemas/        # Zod validation schemas
├── constants/      # Feature constants
├── utils/          # Feature utilities
└── index.ts        # Barrel export (public API)
```

| Feature | Domain |
|---------|--------|
| `agencies/` | Agency management (multi-tenant) |
| `dashboard/` | Analytics & overview widgets |
| `users/` | User management & roles |
| `projects/` | Project tracking |
| `clients/` | Client management |
| `invoices/` | Billing & invoicing |
| `authentication/` | Auth, JWT, RBAC, permissions |

**Rule:** Features must not import from other features directly. Share via `types/`, `services/`, or `lib/`.

---

### `services/` — API Layer

**Purpose:** All HTTP communication. Components and features never call Axios directly.

| File | Purpose |
|------|---------|
| `axios.ts` | Configured Axios instance (`baseURL`, timeout, credentials) |
| `interceptors.ts` | Auth bearer injection, 401 refresh-token retry, error normalization |
| `api.ts` | Typed helpers (`get`, `getPaginated`, `post`, `patch`, `delete`) |
| `errors.ts` | `AppApiError` — normalized errors for UI/hooks |
| `repositories/` | One repository per entity (`AgencyRepository`, `UserRepository`, `ClientRepository`) |

**Rule:** UI → feature hooks → repositories → `api` → Axios. Never skip layers.

---

### `store/` — Global State

**Purpose:** Zustand stores for cross-feature state. Feature-specific stores live inside features.

| Store | Purpose |
|-------|---------|
| `auth.store.ts` | Session, tokens, role/agency helpers (Module 6 expands flows) |
| `ui.store.ts` | Sidebar open/collapsed prefs |

**Rule:** No single giant store. One store per concern.

---

### `hooks/` — Shared Hooks

**Purpose:** Reusable React hooks not tied to a single feature (e.g., `useAuth`).

Feature data hooks live in `features/<name>/hooks` and call repositories via TanStack Query.

---

### `providers/` — React Providers

**Purpose:** Composed provider tree wired in `providers/providers.tsx`.

| Provider | Status | Role |
|----------|--------|------|
| `LocaleProvider` | ✅ | next-intl client messages |
| `ThemeProvider` | ✅ | Light / dark / system via next-themes |
| `ToastProvider` | ✅ | Sonner toasts |
| `QueryProvider` | ✅ | TanStack Query + Devtools |
| `AuthProvider` | Shell | Zustand `useAuthStore` — Module 6 expands |
| `DocumentAttributes` | ✅ | Syncs `lang` + `dir` on `<html>` for RTL |

---

### `i18n/` + `messages/` — Internationalization

**Purpose:** English + Arabic (RTL) with path-based locales.

| File | Purpose |
|------|---------|
| `i18n/config.ts` | Locales, RTL helpers, locale names |
| `i18n/routing.ts` | `defineRouting` config |
| `i18n/request.ts` | Server request config + message loading |
| `i18n/navigation.ts` | Locale-aware `Link`, `redirect`, `useRouter` |
| `messages/en.json` | English catalog |
| `messages/ar.json` | Arabic catalog |

**Usage:** Prefer `getTranslations` (RSC) / `useTranslations` (client). Never hardcode UI copy.

---

### `config/` — Configuration

**Purpose:** Environment variables, feature flags, app-wide settings.

---

### `constants/` — Constants

**Purpose:** App-wide immutable values (app name, pagination defaults). Use `UPPER_CASE`. Locale constants live in `i18n/config.ts`.

---

### `types/` — Shared Types

**Purpose:** Cross-cutting TypeScript types (`ApiResponse`, `PaginatedResponse`, `ID`).

---

### `lib/` — Core Libraries

**Purpose:** Framework integrations (`cn`, auth helpers, query client factory). Shadcn uses `@/lib/utils`.

---

### `utils/` — Utilities

**Purpose:** Pure helper functions. Re-exports `cn` from `@/lib/utils` for alias compatibility. No React, no side effects.

---

### `styles/` — Global Styles

**Purpose:** Tailwind entry, CSS variables (design tokens), dark/light theme variables.

---

### `assets/` — Static Assets

**Purpose:** Images, fonts, and other bundled assets not served from `public/`.

---

### `schemas/` — Shared Schemas

**Purpose:** Cross-feature Zod schemas. Feature-specific schemas live in `features/<name>/schemas/`.

---

### `middleware.ts`

**Purpose:** Request interception for locale (Module 2). Auth and tenant helpers will live in `lib/middleware/` and compose here in Module 6.

---

### `public/` — Public Files

**Purpose:** Static files served at root URL (favicon, robots.txt, OG images).

---

## Path Aliases

Configured in `tsconfig.json`:

| Alias | Maps to |
|-------|---------|
| `@/*` | Project root |
| `@/components/*` | `./components/*` |
| `@/features/*` | `./features/*` |
| `@/services/*` | `./services/*` |
| `@/hooks/*` | `./hooks/*` |
| `@/lib/*` | `./lib/*` |
| `@/types/*` | `./types/*` |
| `@/store/*` | `./store/*` |
| `@/config/*` | `./config/*` |
| `@/constants/*` | `./constants/*` |
| `@/utils/*` | `./utils/*` |
| `@/providers/*` | `./providers/*` |
| `@/schemas/*` | `./schemas/*` |
| `@/styles/*` | `./styles/*` |
| `@/assets/*` | `./assets/*` |

## Module Roadmap

| Module | Scope | Status |
|--------|-------|--------|
| **1** | Foundation, folder structure, tooling | ✅ Complete |
| **2** | Shadcn UI, Theme Provider, next-intl, Providers | ✅ Complete |
| **3** | Axios, React Query, Zustand, API repositories | ✅ Complete |
| **4** | Layout, Sidebar, Navbar, Form components | Pending |
| **5** | Agencies feature, Dashboard, DataTable, Charts | Pending |
| **6** | Authentication, RBAC, protected routes, middleware | Pending |

## Code Standards

- **Components:** PascalCase (`AgencyCard.tsx`)
- **Functions:** camelCase (`formatCurrency`)
- **Constants:** UPPER_CASE (`DEFAULT_PAGE_SIZE`)
- **No hardcoded colors** — use CSS variables / Tailwind tokens
- **No Axios in components** — use repositories
- **Every form** has `schema.ts`, `form.tsx`, `types.ts`
- **Barrel exports** via `index.ts` for public APIs

## License

Proprietary — MARN Agency Portal
