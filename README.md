# Commerce Client

Frontend for an e-commerce platform built with **Next.js 16 (App Router)**, **React 19**, and **TypeScript**. It includes a public storefront (catalog, cart, checkout, user account) and an admin panel (backoffice) for managing products, categories, orders, users, and reviews.

## Tech stack

| Category | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/docs) (App Router) |
| UI | [React 19](https://react.dev) + [TypeScript 5](https://www.typescriptlang.org/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/docs) (CSS-first config, no `tailwind.config.ts`) |
| Server state | [TanStack Query 5](https://tanstack.com/query/latest) |
| Client global state | [Zustand 5](https://docs.pmnd.rs/zustand) |
| Forms | [React Hook Form 7](https://react-hook-form.com/) + [Yup](https://github.com/jquense/yup) |
| HTTP client | [Axios](https://axios-http.com/) |
| Icons | [Lucide React](https://lucide.dev/) |
| Linting / Formatting | ESLint 9 (flat config) + Prettier 3 (`prettier-plugin-tailwindcss`) |
| Package manager | [pnpm](https://pnpm.io/) |

## Prerequisites

- **Node.js** ≥ 20 LTS (recommended; the team currently develops on Node 22)
- **pnpm** ≥ 9 (the repo is not set up for `npm`/`yarn`, see [Inconsistencies](./docs/INCONSISTENCIES.md))
- A running, reachable backend API (this repo is frontend-only, it does not include the server)

## Getting started

```bash
# 1. Clone the repository
git clone <repo-url>
cd commerce_client

# 2. Install dependencies
pnpm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with the real backend values

# 4. Start the dev server
pnpm dev
```

The app is available at [http://localhost:3000](http://localhost:3000).

## Environment variables

Defined in `.env.example`. All of them are public (`NEXT_PUBLIC_` prefix) because they're consumed from the client.

| Variable | Description | Code default |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Base URL of the backend API | `http://localhost:3001` |
| `NEXT_PUBLIC_APP_NAME` | Store name, used in metadata and UI | `Commerce Store` |
| `NEXT_PUBLIC_APP_URL` | Public URL of the frontend | `http://localhost:3000` |
| `NEXT_PUBLIC_ENABLE_REVIEWS` | Feature flag for the reviews module | `false` |
| `NEXT_PUBLIC_ENABLE_WISHLIST` | Feature flag for the wishlist | `false` |

Defaults live in [`src/constants/app.ts`](./src/constants/app.ts) (`APP_CONFIG`), so the app boots even without `.env.local`, pointing at `localhost:3001`.

## Available scripts

| Script | Description |
|---|---|
| `pnpm dev` | Development server (`next dev`) |
| `pnpm build` | Production build |
| `pnpm build:dev` | Build followed by `next dev` (verify the build locally) |
| `pnpm start` | Serves the production build |
| `pnpm lint` | Runs ESLint across the project |
| `pnpm reinstall` | Removes `node_modules`, `pnpm-lock.yaml`, and `.next`, reinstalls, and prunes dependencies |

> There is no `test` or `format` script configured yet. See [Inconsistencies](./docs/INCONSISTENCIES.md).

## Project structure

```
src/
├── app/                 # Next.js App Router routes (storefront, account, auth, backoffice)
├── components/
│   ├── ui/               # Reusable primitive components (Button, Input, Modal, Toast…)
│   └── layout/            # Header, Footer, BackofficeSidebar
├── features/             # Feature-based modules (today: backoffice/categories, backoffice/products)
├── hooks/
│   ├── api/               # TanStack Query hooks (use-auth, use-products, use-cart…)
│   └── use-*.ts           # Utility hooks (use-disclosure, use-upload)
├── lib/
│   ├── api/               # Axios client + per-domain services
│   ├── utils.ts           # Helpers (cn, formatCurrency, slugify, debounce…)
│   ├── cookies.ts         # Session cookie handling
│   └── validations.ts     # Yup schemas
├── providers/            # QueryProvider, AuthProvider
├── store/                 # Zustand stores (auth, cart, ui)
├── constants/             # Enums, endpoints, routes, app configuration
├── types/                 # Domain types (`*.type.ts`)
├── regex/                 # Shared regular expressions
└── middleware.ts          # Route protection (auth) at the Next.js middleware level
```

### Import aliases (`tsconfig.json`)

```
@/*            → src/*
@/components/* → src/components/*
@/hooks/*      → src/hooks/*
@/lib/*        → src/lib/*
@/store/*      → src/store/*
@/types/*      → src/types/*
@/constants/*  → src/constants/*
@/features/*   → src/features/*
```

> `@/services/*` and `@/utils/*` are declared in `tsconfig.json` but have no matching folder — don't use them (see [Inconsistencies](./docs/INCONSISTENCIES.md)).

## Architecture

```
Component (app/ or features/)
      │
      ▼
Hook (hooks/api/*)  ──  TanStack Query (cache + network state)
      │
      ▼
Service (lib/api/*)  ──  Axios (lib/api/client.ts, auth interceptors)
      │
      ▼
Backend API
```

- **Server state** (remote data: products, cart, orders…) is handled with **TanStack Query** via hooks in `hooks/api/`.
- **Client state** (auth, UI, local cart) is handled with **Zustand** in `store/`.
- **Authentication**: the token is stored in `localStorage` (read by the Axios interceptor) and in a cookie (`auth_token`, see `lib/cookies.ts`) that `middleware.ts` uses to protect `/account`, `/checkout`, and `/backoffice` at the edge.
- **Backoffice**: lives partly in `src/app/backoffice/*` (routes) and `src/features/backoffice/*` (page logic and components), managing products, categories, orders, users, and reviews.

## Code conventions

The full set of standards (naming, component structure, hook patterns, Tailwind rules, Git flow) lives in [`AGENTS.md`](./AGENTS.md) and in the project manual (`docs/PROJECT_MANUAL.md`). Quick summary:

- React components: `PascalCase` export, `kebab-case` filename (`product-card.tsx`).
- Hooks: `camelCase` with a `use` prefix (`use-products.ts` → `useProducts`).
- Domain types: `PascalCase`, `kebab-case.type.ts` filename in `src/types/`.
- Shared constants: `SCREAMING_SNAKE_CASE`, grouped by domain in `src/constants/`.
- Commits: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `refactor:`, `chore:`…).
- Branching: `main` (production), `develop` (integration), `feature/*`, `fix/*`, `hotfix/*`.

## Additional documentation

- [`AGENTS.md`](./AGENTS.md) — frontend development standards for this repo.
- [`docs/PROJECT_MANUAL.md`](./docs/PROJECT_MANUAL.md) — detailed project manual (architecture, modules, auth flow, troubleshooting).
- [`docs/CODING_RULES.md`](./docs/CODING_RULES.md) — coding rules and code review checklist.
- [`INCONSISTENCIES.md`](./docs/INCONSISTENCIES.md) — audit of discrepancies between prior documentation, repo configuration, and the actual code, with recommended actions (kept in Spanish).

## Deployment

The project is a standard Next.js app, deployable on any compatible platform (Vercel, a Node container, etc.):

```bash
pnpm build
pnpm start
```

There is no `Dockerfile` or CI/CD configuration in the repository yet.

## License

Private and confidential project.
