# E-Commerce Frontend — Project Manual

> This manual describes the **actual** state of the code in `src/` (audited 2026-09-22). For the history of discrepancies found against previous versions of this document, see [`../INCONSISTENCIES.md`](./INCONSISTENCIES.md) (kept in Spanish).

## 📋 Overview

Frontend for an e-commerce application built with Next.js (App Router) and TypeScript. It covers two surfaces:

- **Public storefront**: product catalog, product detail with reviews, cart, checkout, user account (profile, orders, addresses, wishlist).
- **Backoffice / admin**: management of products, categories, orders, users, and reviews, protected by the `ADMIN` role.

## 🚀 Technologies Used

| Technology | Version (package.json) | Purpose |
|------------|---------|-----------|
| **Next.js** | 16.2.1 | React framework with App Router |
| **React** | 19.2.3 | UI |
| **TypeScript** | 5.x | Static typing |
| **Tailwind CSS** | 4.x | Utility styling (CSS-first config, no `tailwind.config.ts`) |
| **TanStack Query** | 5.90.x | Server state and caching |
| **Zustand** | 5.0.x | Client global state |
| **React Hook Form** | 7.71.x | Form handling |
| **Yup** | 1.7.x | Schema validation |
| **Axios** | 1.13.x | HTTP client |
| **Lucide React** | 0.563.x | Icons |
| **clsx / tailwind-merge** | — | Conditional class composition (`cn()`) |

No testing library is currently installed (see [Testing](#-testing)).

## 📁 Project Structure

```
commerce_client/
├── docs/                              # Documentation
│   ├── CODING_RULES.md               # Coding rules and conventions
│   └── PROJECT_MANUAL.md             # This file
│
├── public/
│   ├── images/                        # Image assets (includes the logo)
│   └── *.svg                          # Loose icons (inherited from the Next.js template)
│
├── src/
│   ├── app/                           # Next.js App Router — ROUTES ONLY
│   │   ├── layout.tsx                # Root layout (Header, Footer, ToastContainer, Providers)
│   │   ├── page.tsx                  # Home
│   │   ├── globals.css               # Global styles + Tailwind 4 theme
│   │   ├── auth/                     # login, register, activate-account/[token],
│   │   │                             # activate-notification, forgot-password,
│   │   │                             # password-reset/[token], resend-activation
│   │   ├── products/                 # Listing and detail ([slug])
│   │   ├── cart/                     # Cart
│   │   ├── checkout/                 # Checkout
│   │   ├── account/                  # Layout + profile, orders (+ [orderId]),
│   │   │                             # addresses, wishlist, settings
│   │   └── backoffice/               # Layout + dashboard, products (+ [slug], new),
│   │                                 # categories (+ [slug], new), orders (+ [id]),
│   │                                 # users, reviews
│   │
│   ├── components/
│   │   ├── ui/                       # Base components: button, input, modal, badge,
│   │   │                             # rating, loading (Skeleton/Spinner), toast,
│   │   │                             # app-image, empty-data, icon-button,
│   │   │                             # icon-link-button, no-image, return-button,
│   │   │                             # upload-button/ (subfolder with its own hooks/components)
│   │   └── layout/                   # header, footer, backoffice-sidebar
│   │
│   ├── features/                     # Feature-based modules (page logic + UI)
│   │   └── backoffice/
│   │       ├── layout.tsx / page.tsx
│   │       ├── components/           # quick-link, stat-card
│   │       ├── categories/           # hooks, schemas (Yup), types, page components
│   │       └── products/             # hooks, schemas (Yup), types, page components
│   │
│   ├── constants/
│   │   ├── index.ts                  # Barrel export
│   │   ├── enums.ts                  # Enums mirroring the backend (UserRole, OrderStatus,
│   │   │                             # PaymentStatus, PaymentMethod, ShippingCarrier,
│   │   │                             # ShippingStatus, MovementType, DiscountType)
│   │   ├── api.ts                    # API_ENDPOINTS per domain
│   │   ├── app.ts                    # APP_CONFIG, STORAGE_KEYS, QUERY_KEYS,
│   │   │                             # HTTP_STATUS, VALIDATION, FILE_SIZES
│   │   ├── ui.ts                     # ROUTES, BREAKPOINTS, Z_INDEX,
│   │   │                             # ANIMATION_DURATION, *_CONFIG (enum display config)
│   │   └── allowed-file-types.ts     # Allowed file types for uploads
│   │
│   ├── hooks/
│   │   ├── api/                      # TanStack Query hooks: use-auth, use-admin,
│   │   │                             # use-cart, use-categories, use-orders,
│   │   │                             # use-products, use-reviews, use-users, use-wishlist
│   │   ├── use-disclosure.ts         # Utility hook (open/close/toggle)
│   │   └── use-upload.ts             # File upload hook
│   │
│   ├── lib/
│   │   ├── api/                      # client.ts (Axios) + per-domain services
│   │   │                             # (auth, products, categories, cart, orders,
│   │   │                             # users, wishlist, reviews, admin)
│   │   ├── utils.ts                  # cn, formatCurrency, formatDate,
│   │   │                             # formatRelativeTime, truncateText, getInitials,
│   │   │                             # slugify, debounce, calculateDiscountPercentage,
│   │   │                             # isEmpty, generateId, formatFileSize
│   │   ├── cookies.ts                # set/removeAuthCookie (cookie read by the middleware)
│   │   └── validations.ts            # Yup schemas
│   │
│   ├── providers/
│   │   ├── index.tsx                 # Providers (wraps QueryProvider + AuthProvider)
│   │   ├── query-provider.tsx        # QueryClientProvider + Devtools
│   │   └── auth-provider.tsx         # Auth store hydration
│   │
│   ├── store/                        # Zustand stores
│   │   ├── auth.ts                   # useAuthStore (persist), useAuthHydrated,
│   │   │                             # useIsAdmin, useUserId
│   │   ├── cart.ts                   # Local cart (unauthenticated users)
│   │   └── ui.ts                     # Sidebar, mobile menu, search, toasts,
│   │                                 # modals, theme, global loading; `toast` helper
│   │
│   ├── types/                        # Domain types, one file per entity
│   │   ├── common.type.ts, user.type.ts, product.type.ts, cart.type.ts,
│   │   │   order.type.ts, wishlist.type.ts, review.type.ts, coupon.type.ts,
│   │   │   admin.type.ts
│   │   └── css.d.ts                  # Declarations for CSS/SVG imports
│   │
│   └── regex/                        # Shared regular expressions
│
├── .env.example                       # Reference environment variables
├── next.config.ts                     # Next.js config (image remotePatterns)
├── eslint.config.mjs                  # ESLint flat config (eslint-config-next)
├── .prettierrc                        # Prettier + prettier-plugin-tailwindcss
├── tsconfig.json                      # TypeScript config + path aliases
└── package.json                       # Dependencies and scripts
```

> **Note**: `tailwind.config.ts` does not exist. Tailwind 4 is configured via CSS (`@import "tailwindcss"` and an `@theme inline` block in `src/app/globals.css`), not a JS/TS config file.

## 🔧 Installation and Setup

### Prerequisites

- Node.js ≥ 20.x (LTS recommended)
- pnpm ≥ 9.x — the only supported package manager (the repo ships `pnpm-lock.yaml`, not `package-lock.json` or `yarn.lock`)
- A running, reachable backend API

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd commerce_client

# Install dependencies
pnpm install

# Configure environment variables
cp .env.example .env.local

# Start the dev server
pnpm dev
```

### Environment Variables

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_NAME=E-commerce Brand
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ENABLE_REVIEWS=true
NEXT_PUBLIC_ENABLE_WISHLIST=true
```

All of them default in `src/constants/app.ts` (`APP_CONFIG`). If `.env.local` doesn't exist, the app still works pointing at `http://localhost:3001`, with `APP_CONFIG.FEATURES.REVIEWS_ENABLED` and `WISHLIST_ENABLED` defaulting to `false` (note that this differs from the `.env.example` defaults).

`APP_CONFIG` also fixes `CURRENCY: 'PEN'` and `LOCALE: 'es-PE'` as constants that are not configurable via environment — the current target market is Peru.

## 🏗️ Architecture

### Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Component  │ ──► │    Hook     │ ──► │   API Svc   │
│ (app/ or    │ ◄── │ (hooks/api, │ ◄── │  (lib/api,  │
│  features/) │     │  TanStack)  │     │   Axios)    │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │                   ▼
       │            ┌─────────────┐
       │            │ Query Cache │
       │            └─────────────┘
       ▼
┌─────────────┐
│   Zustand   │  (auth, local cart, ui)
└─────────────┘
```

### Application Layers

1. **Presentation** (`app/`, `features/*/components`, `components/`): UI and composition.
2. **Hooks** (`hooks/api/`): connect components to TanStack Query.
3. **Services** (`lib/api/`): HTTP communication with the backend via Axios.
4. **State** (`store/`): persistent/ephemeral client state with Zustand.
5. **Types** (`types/`): data contracts per domain.
6. **Constants** (`constants/`): endpoints, routes, enums, configuration — single source of truth for repeated strings/values.

### Feature-based pattern (`src/features/`)

The products and categories backoffice follows a feature-based pattern: each submodule groups its own `hooks/`, `schemas/` (Yup), `types/`, and page components, instead of scattering them across the global `src/hooks`, `src/lib`, or `src/types` folders. This is the pattern to follow for new, large, self-contained modules (e.g. a future `features/checkout/`); small or cross-cutting modules (Header, Footer, `ui/` components) keep living in the global folders.

> ⚠️ Inside `features/`, several components that are **not** Next.js routes are named `page.tsx` (e.g. `features/backoffice/categories/components/category-edit-form/page.tsx`). This is an inherited, confusing convention — don't repeat it in new code; name these files after what they render (`category-edit-form.tsx`). See [`INCONSISTENCIES.md`](./INCONSISTENCIES.md#5-patrón-pagetsx-reutilizado-para-archivos-que-no-son-rutas).

## 📦 Core Modules

Actual hooks exported by `src/hooks/api/` (check each file for the exact signature; this is a reference map, not a literal copy):

### Authentication (`hooks/api/use-auth.ts`, `store/auth.ts`)

```typescript
useLogin()
useRegister()
useLogout()
// + activation / password recovery hooks (activate, resend-activation,
//   forgot-password, password-reset) — see routes under app/auth/*

useAuthStore()
- user: User | null
- token: string | null
- isAuthenticated: boolean
- setAuth(user, token)
- clearAuth()
- updateUser(partialUser)

useAuthHydrated()   // true once the Zustand persist middleware has finished hydrating
useIsAdmin()        // selector: user?.role === 'ADMIN'
useUserId()         // selector: user?.id ?? null
```

On login/registration, session state is written to **three** places: `localStorage[STORAGE_KEYS.AUTH_TOKEN]`, `localStorage[STORAGE_KEYS.USER]` (manual write in `use-auth.ts`), the persisted Zustand store (`STORAGE_KEYS.AUTH_STORE`), and the `auth_token` cookie (`lib/cookies.ts`, read by `middleware.ts`). This is intentional — the cookie and the plain `localStorage` entries are needed because the edge middleware and the Axios interceptor can't access the Zustand store directly — but they must be kept in sync whenever the auth flow is touched.

### Products (`hooks/api/use-products.ts`, `features/backoffice/products/`)

```typescript
// Supported filters (see src/types/product.type.ts for the exact contract)
interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  // + additional filters defined in the domain type
}
```

Admin management (create/edit/delete product, image uploads) lives in `features/backoffice/products/`.

### Cart (`hooks/api/use-cart.ts`, `store/cart.ts`)

Remote cart via TanStack Query for authenticated users; `store/cart.ts` keeps a local Zustand cart for unauthenticated flows.

### Orders (`hooks/api/use-orders.ts`)

Order statuses (`OrderStatus`, in `constants/enums.ts`, mirroring the backend enum):

```typescript
PENDING | CONFIRMED | PROCESSING | SHIPPED | DELIVERED | CANCELLED | REFUNDED
```

Each status has its visual representation (label, color, icon) in `ORDER_STATUS_CONFIG` (`constants/ui.ts`) — use that config instead of mapping the string manually in the component.

### Wishlist (`hooks/api/use-wishlist.ts`)

Toggleable via `NEXT_PUBLIC_ENABLE_WISHLIST`.

### Reviews (`hooks/api/use-reviews.ts`)

Toggleable via `NEXT_PUBLIC_ENABLE_REVIEWS`.

### Admin (`hooks/api/use-admin.ts`, `features/backoffice/`)

Stats, user management, and review approval from the backoffice; protected by `useIsAdmin()` and the route middleware.

## 🎨 UI Components (`src/components/ui/`)

Actual exports (`src/components/ui/index.ts`): `AppImage`, `Badge` (+ `DiscountBadge`, `StockBadge`), `Button`, `EmptyData`, `IconButton`, `IconLinkButton`, `Input`, `Loading` (+ `Skeleton`, `Spinner`, `ProductCardSkeleton`, `ProductGridSkeleton`, `UploadButtonSkeleton`), `Modal`, `Rating` (+ `RatingInput`), `ToastContainer`, `UploadButton`. `NoImage` and `ReturnButton` exist as files but are imported directly (they're not in the `index.ts` barrel).

### Toast (Notifications)

Global system via `store/ui.ts`, rendered by `<ToastContainer />` in the root layout.

```tsx
// Recommended usage
import { toast } from '@/store';

toast.success('Title', 'Optional message');
toast.error('Error', 'Error description');
toast.warning('Warning', 'Warning message');
toast.info('Info', 'Informational message');

// Explicit usage (equivalent)
import { useUIStore } from '@/store';

const { addToast } = useUIStore();
addToast({
  type: 'success' | 'error' | 'warning' | 'info',
  title: 'Required title',
  message: 'Optional message',
  duration: 5000, // ms, default 5000, use 0 to disable auto-close
});
```

`store/ui.ts` also centralizes: sidebar (`isSidebarOpen`), mobile menu, search (`isSearchOpen`, `searchQuery`), generic modals (`activeModal`), and a global loading overlay (`isGlobalLoading`).

## 🔐 Authentication

### Login Flow

1. User enters credentials at `/auth/login`.
2. `useLogin()` calls `authApi.login()` (`lib/api/auth.ts`).
3. Backend returns `{ user, access_token }`.
4. Persisted to `localStorage` (`AUTH_TOKEN`, `USER`), to the cookie (`setAuthCookie`), and to `useAuthStore` (`setAuth`).
5. Redirect to the target route (supports `?redirect=` set by the middleware).

### Route Protection

Two independent layers of protection, both active:

1. **Next.js middleware** (`src/middleware.ts`, runs at the edge): reads the `auth_token` cookie and redirects before rendering. Protects `ROUTES.ACCOUNT.BASE`, `ROUTES.CHECKOUT`, `ROUTES.BACKOFFICE.BASE`; redirects away from `/auth/login` and `/auth/register` if a cookie is already present.
2. **Client-side** (recommended pattern in components/layouts that need loading UX before the redirect):

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useAuthHydrated } from '@/store/auth';

export default function ProtectedPage() {
  const router = useRouter();
  const isHydrated = useAuthHydrated();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated || !isAuthenticated) {
    return <Loading />;
  }

  return <div>Protected content</div>;
}
```

The middleware already blocks access at the route level; this second layer avoids flashes of protected content while the Zustand store hydrates on the client.

### Token Interceptor (`src/lib/api/client.ts`)

- Adds `Authorization: Bearer <token>` (read from `localStorage`) to every request.
- On `401`, clears `localStorage` and the cookie, and redirects to `/auth/login` (if not already there).
- Exposes `apiRequest<T>(method, url, data?, config?)` as a typed helper and `getErrorMessage(error)` to normalize API errors.

## 🌐 API Integration

### Endpoints (`src/constants/api.ts`, `API_ENDPOINTS`)

| Module | Main endpoints |
|--------|-----------|
| Auth | `/auth/register`, `/auth/login`, `/auth/validate`, `/auth/activate`, `/auth/resend-activation`, `/auth/forgot-password`, `/auth/password-reset` |
| Users | `/users/profile`, `/users/addresses`, `/users/addresses/:id` (+ `/default`) |
| Products | `/products`, `/products/:search`, `/products/:id/files/upload`, `/products/:id/files/delete` |
| Categories | `/categories`, `/categories/:search`, `/categories/:slug/files/upload` |
| Cart | `/cart`, `/cart/items`, `/cart/items/:id`, `/cart/validate` |
| Orders | `/orders`, `/orders/:id`, `/orders/number/:orderNumber`, `/orders/:id/cancel`, `/orders/admin` |
| Wishlist | `/wishlist`, `/wishlist/:id`, `/wishlist/count`, `/wishlist/check`, `/wishlist/:id/move-to-cart` |
| Reviews | `/reviews`, `/reviews/:id`, `/reviews/product/:id/rating`, `/reviews/my-reviews`, `/reviews/:id/helpful` |
| Coupons | `/coupons/validate`, `/coupons/apply` |
| Payments | `/payments/create-intent`, `/payments/confirm` |
| Shipping | `/shipping/rates`, `/shipping/track/:trackingNumber` |
| Admin | `/admin/stats`, `/admin/users`, `/admin/users/:id`, `/admin/reviews`, `/admin/reviews/:id/approve` |

Don't assume every one of these endpoints is implemented on the current backend — this is the contract defined on the frontend side; verify against the real API before relying on a new one.

## 📱 Responsive Design

Mobile-first, standard Tailwind breakpoints (also defined in `constants/ui.ts` → `BREAKPOINTS` for use in JS/TS):

```
sm: 640px   md: 768px   lg: 1024px   xl: 1280px   2xl: 1536px
```

## 🧪 Testing

**There is no testing infrastructure in the repository at the moment**: no `__tests__/` folder, no `test` script in `package.json`, and no testing dependencies installed.

Before writing tests, the stack needs to be introduced (suggested: **Vitest** + **React Testing Library** for unit/integration, **Playwright** for E2E) along with the corresponding scripts. Until then, change validation relies on:

- `pnpm lint` (ESLint)
- `pnpm build` (strict TypeScript compilation via `next build`)
- Manual verification in `pnpm dev`

## 🚀 How to Work in This Project

### Day-to-day workflow

1. Always start from an up-to-date `develop`: `git checkout develop && git pull`.
2. Create a descriptive branch: `feature/<name>`, `fix/<name>`, or `hotfix/<name>`.
3. Before touching a module, check whether it already follows the feature-based pattern (`src/features/`) or the classic pattern (global `hooks/`, `lib/api/`, `types/`) and **keep the existing pattern** for that module instead of mixing them.
4. Reuse what already exists in `constants/` (`ROUTES`, `API_ENDPOINTS`, `QUERY_KEYS`, `STORAGE_KEYS`, enums) before introducing new strings/values.
5. Run `pnpm lint` and `pnpm build` before opening a PR (there are no automated tests to catch issues for you, see [Testing](#-testing)).
6. Follow Conventional Commits (`feat(scope): ...`, `fix(scope): ...`) — see [`CODING_RULES.md`](./CODING_RULES.md#git--commits).
7. Open a PR against `develop`, wait for code review (checklist in `CODING_RULES.md`).

### Where new code goes

| What you're adding | Where it goes |
|---|---|
| Generic, reusable UI component (no business logic) | `src/components/ui/` |
| Global layout component (header, footer, sidebars) | `src/components/layout/` |
| Large, self-contained module (has its own hooks, schemas, types) | `src/features/<module>/` |
| Remote data hook (TanStack Query) for an existing entity | `src/hooks/api/use-<entity>.ts` |
| HTTP service for an existing entity | `src/lib/api/<entity>.ts` |
| New domain type | `src/types/<entity>.type.ts` + export in `src/types/index.ts` |
| Constant used in 2+ files | `src/constants/<domain>.ts` |
| Constant used in a single file | Declared locally in that file (don't create a file in `constants/` just for that) |

### Before opening a PR — quick checklist

- [ ] `pnpm lint` passes with no errors
- [ ] `pnpm build` compiles with no TypeScript errors
- [ ] No new unjustified `any`
- [ ] Repeated strings/values live in `constants/`, not hardcoded
- [ ] If you touched the auth flow, you reviewed the 4 session-state locations — see [Authentication](#-authentication)
- [ ] If you added a component under `features/`, it isn't named `page.tsx` unless it's a real `app/` route
- [ ] Mobile-first verified (tested at a narrow viewport)
- [ ] Reviewed the full checklist in [`CODING_RULES.md`](./CODING_RULES.md#checklist-de-code-review)

## 🚀 Deployment

### Production Build

```bash
pnpm build
pnpm start
```

There is no `Dockerfile` or CI/CD pipeline in the repository yet — any automated deployment needs to be set up from scratch (e.g. Vercel, which detects Next.js with no extra configuration).

### Production Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.your-domain.com
NEXT_PUBLIC_APP_NAME=Your Store
NEXT_PUBLIC_APP_URL=https://your-domain.com
NEXT_PUBLIC_ENABLE_REVIEWS=true
NEXT_PUBLIC_ENABLE_WISHLIST=true
```

## 🐛 Troubleshooting

**Error: "Hydration mismatch"**
- Cause: mismatch between server and client (typically from reading `localStorage`/Zustand before hydration).
- Fix: wait for `useAuthHydrated()` (or another mount guard) before rendering client-dependent content.

**Error: "Cannot read properties of null/undefined"**
- Cause: data not loaded yet.
- Fix: check TanStack Query's `isLoading`/`isError` before accessing `data`.

```tsx
if (isLoading) return <Loading />;
if (isError) return <EmptyData />;
```

**"Ghost" session (redirects to login despite having a token, or vice versa)**
- Cause: the 4 session-state locations (see [Authentication](#-authentication)) went out of sync — e.g. `localStorage` was cleared but not the cookie, or vice versa.
- Fix: verify that login/logout always touch all four (`AUTH_TOKEN`, `USER` in localStorage; the `auth_token` cookie; `useAuthStore`).

**`pnpm install` fails or warns about blocked builds for native dependencies**
- Cause: pnpm blocks `postinstall` scripts of native packages (`sharp`, `unrs-resolver`) for security.
- Fix: make sure `pnpm-workspace.yaml` (`allowBuilds`) is present and tracked; see [`INCONSISTENCIES.md`](./INCONSISTENCIES.md#3-pnpm-workspaceyaml-sin-trackear-de-propósito-poco-claro).

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)

## 👥 Contributing

1. Create a branch from `develop`.
2. Make changes following the [coding rules](./CODING_RULES.md) and the [How to Work in This Project](#-how-to-work-in-this-project) section.
3. `pnpm lint` and `pnpm build` passing.
4. Open a Pull Request against `develop`.
5. Code review using the checklist in `CODING_RULES.md`.
6. Merge to `develop`.

## 📄 License

This project is private and confidential.
