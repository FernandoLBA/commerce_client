# Coding Rules & Conventions — E-Commerce Frontend

This document establishes the coding rules and conventions for the e-commerce frontend project. All contributions should follow these guidelines to keep the codebase consistent and maintainable.

## 📋 Table of Contents

1. [General Principles](#general-principles)
2. [Project Structure](#project-structure)
3. [TypeScript](#typescript)
4. [React & Next.js](#react--nextjs)
5. [Styling with Tailwind CSS](#styling-with-tailwind-css)
6. [Global State (Zustand)](#global-state-zustand)
7. [Data Fetching (TanStack Query)](#data-fetching-tanstack-query)
8. [Forms](#forms)
9. [Components](#components)
10. [Constants and Enums](#constants-and-enums)
11. [Error Handling](#error-handling)
12. [Testing](#testing)
13. [Git & Commits](#git--commits)

---

## General Principles

### ✅ Do

- **DRY (Don't Repeat Yourself)**: abstract repeated code into reusable functions or components
- **KISS (Keep It Simple, Stupid)**: prefer simple solutions over complex ones
- **Composition over inheritance**: use component composition
- **Separation of concerns**: one component = one responsibility
- **Immutability**: don't mutate state directly

### ❌ Don't

- Use `any` in TypeScript
- Use magic strings/numbers (define constants instead)
- Ignore TypeScript/ESLint errors
- Create components over 300 lines
- Nest components more than 3 levels deep

---

## Project Structure

> The layout below reflects the intended convention. For the actual current folder-by-folder structure, see [`PROJECT_MANUAL.md`](./PROJECT_MANUAL.md); some items here (`app/(public)/`, `components/features/`, `components/shared/`) are aspirational and not yet present in the codebase — see [`../INCONSISTENCIES.md`](./INCONSISTENCIES.md) for details.

```
src/
├── app/                    # Next.js App Router routes
│   ├── (public)/          # Public routes (no auth layout)
│   ├── account/           # User account pages
│   ├── auth/              # Authentication pages
│   └── layout.tsx         # Root layout
│
├── components/            # React components
│   ├── ui/               # Base UI components (Button, Input, Modal)
│   ├── layout/           # Layout components (Header, Footer)
│   ├── features/         # Feature-specific components
│   └── shared/            # Shared components
│
├── constants/            # Constants and enums
│   ├── enums.ts         # All application enums
│   ├── api.ts           # API endpoints and configuration
│   ├── app.ts           # Application configuration
│   └── ui.ts            # UI constants (routes, breakpoints)
│
├── hooks/               # Custom hooks
│   ├── api/            # TanStack Query hooks
│   └── use*.ts         # Other custom hooks
│
├── lib/                 # Utilities and configuration
│   ├── api/            # Axios client and services
│   ├── utils.ts        # Utility functions
│   └── validations.ts  # Yup schemas
│
├── providers/          # Context providers
│
├── store/             # Zustand stores
│
└── types/             # TypeScript definitions
```

### File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `ProductCard.tsx` |
| Hooks | camelCase with `use` prefix | `useProducts.ts` |
| Utilities | camelCase | `formatCurrency.ts` |
| Constants | camelCase | `apiEndpoints.ts` |
| Types | PascalCase | `Product.ts` |
| Next.js pages | lowercase | `page.tsx` |

> Note: the actual codebase currently uses **kebab-case** filenames for components, hooks, stores, and types (e.g. `product-card.tsx`, `use-products.ts`, `product.type.ts`), not the PascalCase/camelCase shown above. Treat the table above as the target convention going forward and align new files to it; see [`../INCONSISTENCIES.md`](./INCONSISTENCIES.md) for the full list of naming discrepancies found in the existing code.

---

## TypeScript

### Strict Typing

```typescript
// ✅ Correct
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  showRating?: boolean;
}

// ❌ Incorrect - using any
interface ProductCardProps {
  product: any;
  onAddToCart: Function;
}
```

### Type vs Interface

- **Interface**: for objects and API contracts
- **Type**: for unions, intersections, and utility types

```typescript
// Interface for objects
interface User {
  id: string;
  email: string;
  firstName: string;
}

// Type for unions
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

// Type for utilities
type PartialUser = Partial<User>;
```

### Enums vs Union Types

Prefer union types for small sets of values, enums for larger sets with associated meaning:

```typescript
// Union type for simple values
type Size = 'sm' | 'md' | 'lg';

// Enum for values with meaning on the backend
enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
```

### Avoid Type Assertions

```typescript
// ❌ Avoid
const user = data as User;

// ✅ Prefer validation
if (isUser(data)) {
  const user = data;
}
```

---

## React & Next.js

### Functional Components

Always use functional components with TypeScript:

```typescript
// ✅ Correct
interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return <div>{product.name}</div>;
}

// ❌ Incorrect - class components
class ProductCard extends React.Component {}
```

### Hooks

Follow React's rules of hooks:

```typescript
// ✅ Correct - hooks at the top of the component
function ProductList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProducts({ page });
  
  // Derive state when possible
  const hasProducts = data?.length > 0;
  
  // ...
}

// ❌ Incorrect - conditional hooks
function ProductList({ show }: { show: boolean }) {
  if (show) {
    const [page, setPage] = useState(1); // Error!
  }
}
```

### Server vs Client Components

```typescript
// Server Component (default in App Router)
// For: data fetching, backend access, no interactivity
export default async function ProductsPage() {
  const products = await fetchProducts();
  return <ProductList products={products} />;
}

// Client Component (with 'use client')
// For: interactivity, state hooks, event handlers
'use client';

export function AddToCartButton({ productId }: { productId: string }) {
  const handleClick = () => { /* ... */ };
  return <button onClick={handleClick}>Add to Cart</button>;
}
```

### Memoization

Use `useMemo` and `useCallback` with purpose:

```typescript
// ✅ Correct - expensive computation
const sortedProducts = useMemo(() => 
  products.sort((a, b) => a.price - b.price),
  [products]
);

// ✅ Correct - callback passed to a memoized component
const handleClick = useCallback(() => {
  onAddToCart(productId);
}, [onAddToCart, productId]);

// ❌ Incorrect - unnecessary memoization
const name = useMemo(() => product.name, [product.name]);
```

---

## Styling with Tailwind CSS

### Class Organization

Follow this logical order:

1. Layout (display, position)
2. Box model (width, height, padding, margin)
3. Typography (font, text)
4. Visual (bg, border, shadow)
5. States (hover, focus)
6. Responsive (sm:, md:, lg:)

```typescript
// ✅ Correct - logical order
<div className="flex items-center justify-between w-full p-4 text-sm font-medium bg-white border rounded-lg shadow-sm hover:shadow-md sm:p-6">
```

### Use cn() for Conditional Classes

```typescript
import { cn } from '@/lib/utils';

// ✅ Correct
<button
  className={cn(
    'px-4 py-2 rounded-lg font-medium',
    variant === 'primary' && 'bg-primary-600 text-white',
    variant === 'secondary' && 'bg-gray-100 text-gray-900',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
>
```

### CSS Variables for Brand Colors

```css
/* In globals.css */
:root {
  --color-primary-50: #eff6ff;
  --color-primary-600: #2563eb;
  /* ... */
}
```

> The project uses Tailwind CSS 4, configured CSS-first (`@import "tailwindcss"` + `@theme inline` in `globals.css`) — there is no `tailwind.config.ts`. Brand colors currently live under the `--color-primary-*` scale, not `--color-primary-600` alone as a single accent.

### Responsive Design

Mobile-first approach:

```typescript
// ✅ Correct - mobile first
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

// ❌ Incorrect - desktop first
<div className="grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
```

---

## Global State (Zustand)

### Store Structure

```typescript
// store/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  
  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      token: null,
      isAuthenticated: false,
      
      // Actions
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
```

### Selectors for Performance

```typescript
// ✅ Correct - specific selector
const user = useAuthStore((state) => state.user);

// ❌ Avoid - subscribing to the whole store
const { user, token, isAuthenticated } = useAuthStore();
```

### Separate Concerns

- `auth.ts`: authentication
- `cart.ts`: local cart
- `ui.ts`: UI state (modals, toasts, sidebar)

---

## Data Fetching (TanStack Query)

### Hook Structure

```typescript
// hooks/api/use-products.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
};

// Query Hook
export function useProducts(filters: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => productsApi.getAll(filters),
  });
}

// Mutation Hook
export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
}
```

### Handling States

```typescript
function ProductList() {
  const { data, isLoading, isError, error } = useProducts(filters);
  
  if (isLoading) return <Loading />;
  if (isError) return <Error message={error.message} />;
  if (!data?.length) return <EmptyState />;
  
  return <ProductGrid products={data} />;
}
```

### Optimistic Updates

```typescript
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsApi.update,
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries({ queryKey: productKeys.detail(newProduct.id) });
      const previousProduct = queryClient.getQueryData(productKeys.detail(newProduct.id));
      queryClient.setQueryData(productKeys.detail(newProduct.id), newProduct);
      return { previousProduct };
    },
    onError: (err, newProduct, context) => {
      queryClient.setQueryData(productKeys.detail(newProduct.id), context?.previousProduct);
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(data!.id) });
    },
  });
}
```

---

## Forms

### React Hook Form + Yup

```typescript
// lib/validations.ts
import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email'),
  password: yup
    .string()
    .required('Password is required')
    .min(6, 'Minimum 6 characters'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
```

```typescript
// Usage in a component
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema, LoginFormData } from '@/lib/validations';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });
  
  const onSubmit = async (data: LoginFormData) => {
    await loginMutation.mutateAsync(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        {...register('email')}
        error={errors.email?.message}
      />
      <Input
        label="Password"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      <Button type="submit" isLoading={isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}
```

---

## Components

### Component Structure

```typescript
// components/ui/button.tsx
'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// 1. Types/Interfaces
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

// 2. Constants
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  // ...
};

const SIZE_STYLES: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

// 3. Component
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          VARIANT_STYLES[variant],
          SIZE_STYLES[size],
          className
        )}
        {...props}
      >
        {isLoading && <Spinner className="mr-2" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

### Props: Destructuring and Defaults

```typescript
// ✅ Correct
function ProductCard({
  product,
  showRating = true,
  onAddToCart,
}: ProductCardProps) {
  // ...
}

// ❌ Avoid - props object
function ProductCard(props: ProductCardProps) {
  const showRating = props.showRating ?? true;
  // ...
}
```

---

## Constants and Enums

### Location

All constants in `/src/constants/`:

```typescript
// constants/enums.ts
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

// constants/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    ME: '/auth/me',
  },
  PRODUCTS: '/products',
  // ...
} as const;

// constants/ui.ts
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  CART: '/cart',
  // ...
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;
```

### Usage

```typescript
// ✅ Correct
import { OrderStatus } from '@/constants/enums';
import { ROUTES } from '@/constants/ui';

if (order.status === OrderStatus.PENDING) { /* ... */ }
router.push(ROUTES.PRODUCTS);

// ❌ Incorrect - magic strings
if (order.status === 'PENDING') { /* ... */ }
router.push('/products');
```

---

## Error Handling

### API Errors

```typescript
// lib/api/client.ts
import axios from 'axios';

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error)) {
      throw new ApiError(
        error.response?.data?.message || 'Connection error',
        error.response?.status || 500,
        error.response?.data
      );
    }
    throw error;
  }
);
```

### Error Boundaries

```typescript
// components/ErrorBoundary.tsx
'use client';

import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### Showing Errors to the User

```typescript
// Option 1: using toast helpers (recommended)
import { toast } from '@/store';

try {
  await mutation.mutateAsync(data);
  toast.success('Success', 'Your changes were saved');
} catch (error) {
  toast.error(
    'Error',
    error instanceof ApiError ? error.message : 'Unexpected error'
  );
}

// Option 2: using the UI Store directly
const { addToast } = useUIStore();

addToast({ 
  type: 'success', 
  title: 'Product added',
  message: 'Successfully added to cart',
  duration: 5000 // optional, default 5000ms
});
```

---

## Testing

> There is currently no testing infrastructure set up in this repository (no test runner installed, no `test` script, no `__tests__/` folder). The structure and conventions below are the target to adopt once a testing stack (suggested: Vitest + React Testing Library + Playwright) is introduced. See [`PROJECT_MANUAL.md`](./PROJECT_MANUAL.md#-testing) and [`../INCONSISTENCIES.md`](./INCONSISTENCIES.md).

### Structure

```
__tests__/
├── components/
│   └── Button.test.tsx
├── hooks/
│   └── useProducts.test.ts
└── utils/
    └── formatCurrency.test.ts
```

### Conventions

```typescript
// __tests__/components/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading spinner when isLoading', () => {
    render(<Button isLoading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

## Git & Commits

### Commit Format

Use Conventional Commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation
- `style`: formatting, no code changes
- `refactor`: refactoring
- `test`: tests
- `chore`: maintenance tasks

**Examples:**
```
feat(cart): add remove item functionality
fix(auth): handle token expiration correctly
docs(readme): update installation instructions
refactor(products): extract ProductCard component
```

### Branches

```
main              # Production
develop           # Development
feature/cart-page # New feature
fix/login-error   # Bug fix
```

---

## Code Review Checklist

- [ ] No `any` in TypeScript
- [ ] No magic strings/numbers
- [ ] Components < 300 lines
- [ ] Tests for new functionality
- [ ] Errors handled correctly
- [ ] Mobile-first responsive
- [ ] Basic accessibility (aria, focus)
- [ ] Code documented when complex
- [ ] Imports ordered
- [ ] No `console.log` in production

---

## Visual Rules for Authentication Flows

- All authentication flow pages (password recovery, account activation, etc.) must display a relevant visual icon above the main title.
- The icon must sit inside a colored circle (e.g. blue, green, yellow) and be representative of the state or action (e.g. mail, check, spinner).
- This rule applies to success states, the initial form, and loading states alike.
- The goal is to improve user comprehension and keep visual consistency across all flows.
