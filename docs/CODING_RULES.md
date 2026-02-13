# Coding Rules & Conventions - E-Commerce Frontend

Este documento establece las reglas y convenciones de código para el proyecto frontend de e-commerce. Todas las contribuciones deben seguir estas directrices para mantener la consistencia y calidad del código.

## 📋 Tabla de Contenidos

1. [Principios Generales](#principios-generales)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [TypeScript](#typescript)
4. [React & Next.js](#react--nextjs)
5. [Estilos con Tailwind CSS](#estilos-con-tailwind-css)
6. [Estado Global (Zustand)](#estado-global-zustand)
7. [Data Fetching (TanStack Query)](#data-fetching-tanstack-query)
8. [Formularios](#formularios)
9. [Componentes](#componentes)
10. [Constantes y Enums](#constantes-y-enums)
11. [Manejo de Errores](#manejo-de-errores)
12. [Testing](#testing)
13. [Git & Commits](#git--commits)

---

## Principios Generales

### ✅ Hacer

- **DRY (Don't Repeat Yourself)**: Abstraer código repetido en funciones o componentes reutilizables
- **KISS (Keep It Simple, Stupid)**: Preferir soluciones simples sobre complejas
- **Composición sobre herencia**: Usar composición de componentes
- **Separación de responsabilidades**: Un componente = una responsabilidad
- **Inmutabilidad**: No mutar estado directamente

### ❌ No Hacer

- Usar `any` en TypeScript
- Usar strings/números mágicos (definir constantes)
- Ignorar errores de TypeScript/ESLint
- Crear componentes con más de 300 líneas
- Anidar más de 3 niveles de componentes

---

## Estructura del Proyecto

```
src/
├── app/                    # Rutas de Next.js App Router
│   ├── (public)/          # Rutas públicas (sin layout de auth)
│   ├── account/           # Páginas de cuenta de usuario
│   ├── auth/              # Páginas de autenticación
│   └── layout.tsx         # Layout principal
│
├── components/            # Componentes React
│   ├── ui/               # Componentes UI base (Button, Input, Modal)
│   ├── layout/           # Componentes de layout (Header, Footer)
│   ├── features/         # Componentes específicos de features
│   └── shared/           # Componentes compartidos
│
├── constants/            # Constantes y enums
│   ├── enums.ts         # Todos los enums de la aplicación
│   ├── api.ts           # Endpoints y configuración de API
│   ├── app.ts           # Configuración de la aplicación
│   └── ui.ts            # Constantes de UI (rutas, breakpoints)
│
├── hooks/               # Custom hooks
│   ├── api/            # Hooks de TanStack Query
│   └── use*.ts         # Otros hooks personalizados
│
├── lib/                 # Utilidades y configuración
│   ├── api/            # Cliente axios y servicios
│   ├── utils.ts        # Funciones utilitarias
│   └── validations.ts  # Schemas de Yup
│
├── providers/          # Context providers
│
├── store/             # Zustand stores
│
└── types/             # Definiciones de TypeScript
```

### Convenciones de Nombres de Archivos

| Tipo | Convención | Ejemplo |
|------|------------|---------|
| Componentes | PascalCase | `ProductCard.tsx` |
| Hooks | camelCase con prefijo `use` | `useProducts.ts` |
| Utilidades | camelCase | `formatCurrency.ts` |
| Constantes | camelCase | `apiEndpoints.ts` |
| Tipos | PascalCase | `Product.ts` |
| Páginas Next.js | lowercase | `page.tsx` |

---

## TypeScript

### Tipado Estricto

```typescript
// ✅ Correcto
interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  showRating?: boolean;
}

// ❌ Incorrecto - usar any
interface ProductCardProps {
  product: any;
  onAddToCart: Function;
}
```

### Usar Type vs Interface

- **Interface**: Para objetos y contratos de API
- **Type**: Para unions, intersections y tipos utilitarios

```typescript
// Interface para objetos
interface User {
  id: string;
  email: string;
  firstName: string;
}

// Type para unions
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

// Type para utilidades
type PartialUser = Partial<User>;
```

### Enums vs Union Types

Preferir union types para conjuntos pequeños, enums para conjuntos grandes con valores asociados:

```typescript
// Union type para valores simples
type Size = 'sm' | 'md' | 'lg';

// Enum para valores con significado en backend
enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
```

### Evitar Type Assertions

```typescript
// ❌ Evitar
const user = data as User;

// ✅ Preferir validación
if (isUser(data)) {
  const user = data;
}
```

---

## React & Next.js

### Componentes Funcionales

Siempre usar componentes funcionales con TypeScript:

```typescript
// ✅ Correcto
interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return <div>{product.name}</div>;
}

// ❌ Incorrecto - Class components
class ProductCard extends React.Component {}
```

### Hooks

Seguir las reglas de hooks de React:

```typescript
// ✅ Correcto - hooks al inicio del componente
function ProductList() {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProducts({ page });
  
  // Derivar estado cuando sea posible
  const hasProducts = data?.length > 0;
  
  // ...
}

// ❌ Incorrecto - hooks condicionales
function ProductList({ show }: { show: boolean }) {
  if (show) {
    const [page, setPage] = useState(1); // Error!
  }
}
```

### Server vs Client Components

```typescript
// Server Component (por defecto en App Router)
// Para: fetch de datos, acceso a backend, sin interactividad
export default async function ProductsPage() {
  const products = await fetchProducts();
  return <ProductList products={products} />;
}

// Client Component (con 'use client')
// Para: interactividad, hooks de estado, eventos
'use client';

export function AddToCartButton({ productId }: { productId: string }) {
  const handleClick = () => { /* ... */ };
  return <button onClick={handleClick}>Add to Cart</button>;
}
```

### Memoización

Usar `useMemo` y `useCallback` con propósito:

```typescript
// ✅ Correcto - cálculo costoso
const sortedProducts = useMemo(() => 
  products.sort((a, b) => a.price - b.price),
  [products]
);

// ✅ Correcto - callback pasado a componente memoizado
const handleClick = useCallback(() => {
  onAddToCart(productId);
}, [onAddToCart, productId]);

// ❌ Incorrecto - memoización innecesaria
const name = useMemo(() => product.name, [product.name]);
```

---

## Estilos con Tailwind CSS

### Organización de Clases

Seguir este orden lógico:

1. Layout (display, position)
2. Box model (width, height, padding, margin)
3. Typography (font, text)
4. Visual (bg, border, shadow)
5. States (hover, focus)
6. Responsive (sm:, md:, lg:)

```typescript
// ✅ Correcto - orden lógico
<div className="flex items-center justify-between w-full p-4 text-sm font-medium bg-white border rounded-lg shadow-sm hover:shadow-md sm:p-6">
```

### Usar cn() para Clases Condicionales

```typescript
import { cn } from '@/lib/utils';

// ✅ Correcto
<button
  className={cn(
    'px-4 py-2 rounded-lg font-medium',
    variant === 'primary' && 'bg-primary-600 text-white',
    variant === 'secondary' && 'bg-gray-100 text-gray-900',
    disabled && 'opacity-50 cursor-not-allowed'
  )}
>
```

### Variables CSS para Colores de Marca

```css
/* En globals.css */
:root {
  --color-primary-50: #eff6ff;
  --color-primary-600: #2563eb;
  /* ... */
}
```

### Responsive Design

Mobile-first approach:

```typescript
// ✅ Correcto - mobile first
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

// ❌ Incorrecto - desktop first
<div className="grid grid-cols-4 md:grid-cols-2 sm:grid-cols-1">
```

---

## Estado Global (Zustand)

### Estructura del Store

```typescript
// store/authStore.ts
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

### Selectores para Rendimiento

```typescript
// ✅ Correcto - selector específico
const user = useAuthStore((state) => state.user);

// ❌ Evitar - suscribirse a todo el store
const { user, token, isAuthenticated } = useAuthStore();
```

### Separar Concerns

- `authStore.ts`: Autenticación
- `cartStore.ts`: Carrito local
- `uiStore.ts`: Estado de UI (modals, toasts, sidebar)

---

## Data Fetching (TanStack Query)

### Estructura de Hooks

```typescript
// hooks/api/useProducts.ts
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

### Manejo de Estados

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

## Formularios

### React Hook Form + Yup

```typescript
// lib/validations.ts
import * as yup from 'yup';

export const loginSchema = yup.object({
  email: yup
    .string()
    .required('El email es requerido')
    .email('Email inválido'),
  password: yup
    .string()
    .required('La contraseña es requerida')
    .min(6, 'Mínimo 6 caracteres'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
```

```typescript
// Uso en componente
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
        label="Contraseña"
        type="password"
        {...register('password')}
        error={errors.password?.message}
      />
      <Button type="submit" isLoading={isSubmitting}>
        Iniciar sesión
      </Button>
    </form>
  );
}
```

---

## Componentes

### Estructura de un Componente

```typescript
// components/ui/Button.tsx
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

### Props: Desestructuración y Defaults

```typescript
// ✅ Correcto
function ProductCard({
  product,
  showRating = true,
  onAddToCart,
}: ProductCardProps) {
  // ...
}

// ❌ Evitar - props object
function ProductCard(props: ProductCardProps) {
  const showRating = props.showRating ?? true;
  // ...
}
```

---

## Constantes y Enums

### Ubicación

Todas las constantes en `/src/constants/`:

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

### Uso

```typescript
// ✅ Correcto
import { OrderStatus } from '@/constants/enums';
import { ROUTES } from '@/constants/ui';

if (order.status === OrderStatus.PENDING) { /* ... */ }
router.push(ROUTES.PRODUCTS);

// ❌ Incorrecto - strings mágicos
if (order.status === 'PENDING') { /* ... */ }
router.push('/products');
```

---

## Manejo de Errores

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
        error.response?.data?.message || 'Error de conexión',
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

### Mostrar Errores al Usuario

```typescript
// Opción 1: Usando helpers de toast (recomendado)
import { toast } from '@/store';

try {
  await mutation.mutateAsync(data);
  toast.success('Operación exitosa', 'Los cambios fueron guardados');
} catch (error) {
  toast.error(
    'Error',
    error instanceof ApiError ? error.message : 'Error inesperado'
  );
}

// Opción 2: Usando el UI Store directamente
const { addToast } = useUIStore();

addToast({ 
  type: 'success', 
  title: 'Producto agregado',
  message: 'Se añadió al carrito correctamente',
  duration: 5000 // opcional, default 5000ms
});
```

---

## Testing

### Estructura

```
__tests__/
├── components/
│   └── Button.test.tsx
├── hooks/
│   └── useProducts.test.ts
└── utils/
    └── formatCurrency.test.ts
```

### Convenciones

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

### Formato de Commits

Usar Conventional Commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Documentación
- `style`: Formateo, sin cambios de código
- `refactor`: Refactorización
- `test`: Tests
- `chore`: Tareas de mantenimiento

**Ejemplos:**
```
feat(cart): add remove item functionality
fix(auth): handle token expiration correctly
docs(readme): update installation instructions
refactor(products): extract ProductCard component
```

### Branches

```
main              # Producción
develop           # Desarrollo
feature/cart-page # Nueva funcionalidad
fix/login-error   # Corrección
```

---

## Checklist de Code Review

- [ ] Sin `any` en TypeScript
- [ ] Sin strings/números mágicos
- [ ] Componentes < 300 líneas
- [ ] Tests para nueva funcionalidad
- [ ] Errores manejados correctamente
- [ ] Mobile-first responsive
- [ ] Accesibilidad básica (aria, focus)
- [ ] Código documentado cuando es complejo
- [ ] Imports ordenados
- [ ] Sin console.log en producción

---

## Reglas Visuales para Flujos de Autenticación

- Todas las páginas de flujos de autenticación (recuperación de contraseña, activación de cuenta, etc.) deben mostrar un ícono visual relevante arriba del título principal.
- El ícono debe estar dentro de un círculo de color (ejemplo: azul, verde, amarillo) y debe ser representativo del estado o acción (por ejemplo: mail, check, spinner).
- Esta regla aplica tanto para estados de éxito, formulario inicial y loading.
- El objetivo es mejorar la comprensión del usuario y mantener consistencia visual en todos los flujos.
