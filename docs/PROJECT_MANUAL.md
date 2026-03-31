# E-Commerce Frontend - Manual del Proyecto

## 📋 Descripción General

Este es el frontend de una aplicación de comercio electrónico construida con tecnologías modernas. Está diseñado para ser escalable, mantenible y testeable, siguiendo las mejores prácticas de desarrollo.

## 🚀 Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Next.js** | 15+ | Framework React con App Router |
| **TypeScript** | 5+ | Tipado estático |
| **Tailwind CSS** | 4+ | Estilos utilitarios |
| **TanStack Query** | 5+ | Estado del servidor y caché |
| **Zustand** | 5+ | Estado global del cliente |
| **React Hook Form** | 7+ | Manejo de formularios |
| **Yup** | 1+ | Validación de schemas |
| **Axios** | 1+ | Cliente HTTP |
| **Lucide React** | - | Iconos |

## 📁 Estructura del Proyecto

```
client/
├── docs/                          # Documentación
│   ├── CODING_RULES.md           # Reglas de código
│   └── PROJECT_MANUAL.md         # Este archivo
│
├── public/                        # Archivos estáticos
│
├── src/
│   ├── app/                       # App Router de Next.js
│   │   ├── layout.tsx            # Layout principal
│   │   ├── page.tsx              # Página de inicio
│   │   ├── globals.css           # Estilos globales
│   │   ├── auth/                 # Autenticación
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── products/             # Productos
│   │   │   ├── page.tsx          # Listado
│   │   │   └── [slug]/           # Detalle
│   │   ├── cart/                 # Carrito
│   │   ├── checkout/             # Proceso de compra
│   │   └── account/              # Área de usuario
│   │       ├── layout.tsx        # Layout de cuenta
│   │       ├── profile/          # Perfil
│   │       ├── orders/           # Pedidos
│   │       ├── addresses/        # Direcciones
│   │       ├── wishlist/         # Lista de deseos
│   │       └── settings/         # Configuración
│   │
│   ├── components/               # Componentes React
│   │   ├── ui/                   # Componentes base
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loading.tsx
│   │   │   ├── Rating.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Toast.tsx
│   │   └── layout/               # Componentes de layout
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   │
│   ├── constants/                # Constantes y enums
│   │   ├── index.ts              # Re-exports
│   │   ├── enums.ts              # Enumeraciones
│   │   ├── api.ts                # Config de API
│   │   ├── app.ts                # Config general
│   │   └── ui.ts                 # Constantes de UI
│   │
│   ├── hooks/                    # Custom hooks
│   │   └── api/                  # Hooks de TanStack Query
│   │       ├── index.ts
│   │       ├── useAuth.ts
│   │       ├── useProducts.ts
│   │       ├── useCategories.ts
│   │       ├── useCart.ts
│   │       ├── useOrders.ts
│   │       ├── useUsers.ts
│   │       ├── useWishlist.ts
│   │       └── useReviews.ts
│   │
│   ├── lib/                      # Utilidades
│   │   ├── api/                  # Servicios de API
│   │   │   ├── client.ts         # Cliente Axios
│   │   │   ├── auth.ts
│   │   │   ├── products.ts
│   │   │   ├── categories.ts
│   │   │   ├── cart.ts
│   │   │   ├── orders.ts
│   │   │   ├── users.ts
│   │   │   ├── wishlist.ts
│   │   │   └── reviews.ts
│   │   ├── utils.ts              # Funciones utilitarias
│   │   └── validations.ts        # Schemas de Yup
│   │
│   ├── providers/                # Context Providers
│   │   ├── index.tsx             # Provider combinado
│   │   ├── QueryProvider.tsx     # TanStack Query
│   │   └── AuthProvider.tsx      # Hidratación de auth
│   │
│   ├── store/                    # Zustand Stores
│   │   ├── index.ts
│   │   ├── authStore.ts          # Estado de autenticación
│   │   ├── cartStore.ts          # Carrito local
│   │   └── uiStore.ts            # UI (toasts, modals)
│   │
│   └── types/                    # Tipos TypeScript
│       └── index.ts              # Todas las interfaces
│
├── .env.example                   # Variables de entorno
├── next.config.ts                 # Config de Next.js
├── tailwind.config.ts             # Config de Tailwind
├── tsconfig.json                  # Config de TypeScript
└── package.json                   # Dependencias
```

## 🔧 Instalación y Configuración

### Requisitos Previos

- Node.js >= 18.x
- pnpm >= 8.x (recomendado) o npm
- Backend API ejecutándose

### Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd client

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env.local

# Iniciar en desarrollo
pnpm dev
```

### Variables de Entorno

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Mi Tienda
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## 🏗️ Arquitectura

### Flujo de Datos

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Component  │ ──► │    Hook     │ ──► │   API Svc   │
│             │ ◄── │ (TanStack)  │ ◄── │   (Axios)   │
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │
       │                   ▼
       │            ┌─────────────┐
       │            │    Cache    │
       │            │ (Query)     │
       │            └─────────────┘
       │
       ▼
┌─────────────┐
│   Zustand   │
│   (Local)   │
└─────────────┘
```

### Capas de la Aplicación

1. **Presentación (Components)**: UI y lógica de presentación
2. **Hooks**: Conexión entre componentes y datos
3. **Servicios (lib/api)**: Comunicación con backend
4. **Estado (store)**: Estado local de la aplicación
5. **Tipos**: Contratos de datos

## 📦 Módulos Principales

### Autenticación

```typescript
// Hooks disponibles
useLogin()        // Iniciar sesión
useRegister()     // Registrar usuario
useLogout()       // Cerrar sesión
useCurrentUser()  // Usuario actual
useUpdateProfile() // Actualizar perfil
useUpdatePassword() // Cambiar contraseña

// Store
useAuthStore()
- user: User | null
- token: string | null
- isAuthenticated: boolean
- login(user, token)
- logout()
- setUser(user)
```

### Productos

```typescript
// Hooks disponibles
useProducts(filters)     // Listar productos
useProduct(slug)         // Detalle de producto
useProductReviews(id)    // Reseñas de producto
useCreateReview()        // Crear reseña

// Filtros soportados
interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
  isActive?: boolean;
}
```

### Carrito

```typescript
// Hooks disponibles
useCart()              // Obtener carrito
useAddToCart()         // Agregar item
useUpdateCartItem()    // Actualizar cantidad
useRemoveFromCart()    // Eliminar item
useClearCart()         // Vaciar carrito

// Store local (para usuarios no autenticados)
useCartStore()
- items: CartItem[]
- addItem(item)
- updateQuantity(id, quantity)
- removeItem(id)
- clearCart()
- getTotal()
```

### Pedidos

```typescript
// Hooks disponibles
useOrders(filters)     // Listar pedidos
useOrder(id)           // Detalle de pedido
useCreateOrder()       // Crear pedido
useCancelOrder()       // Cancelar pedido

// Estados de pedido
enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}
```

### Wishlist

```typescript
// Hooks disponibles
useWishlist()           // Obtener lista
useAddToWishlist()      // Agregar producto
useRemoveFromWishlist() // Eliminar producto
```

## 🎨 Componentes UI

### Button

```tsx
<Button 
  variant="primary" | "secondary" | "outline" | "ghost" | "danger"
  size="sm" | "md" | "lg"
  isLoading={boolean}
  disabled={boolean}
>
  Click me
</Button>
```

### Input

```tsx
<Input
  label="Email"
  type="email"
  error="Mensaje de error"
  helperText="Texto de ayuda"
  {...register('email')}
/>
```

### Modal

```tsx
<Modal
  isOpen={boolean}
  onClose={function}
  title="Título"
  size="sm" | "md" | "lg" | "xl"
>
  Contenido
</Modal>
```

### Badge

```tsx
<Badge variant="default" | "success" | "warning" | "error" | "info">
  Etiqueta
</Badge>
```

### Rating

```tsx
<Rating 
  value={4.5} 
  readonly={boolean}
  onChange={function}
  size="sm" | "md" | "lg"
/>
```

### Loading

```tsx
<Loading size="sm" | "md" | "lg" />
<Skeleton className="h-4 w-32" />
```

### Toast (Notificaciones)

El sistema de notificaciones usa un store global y un componente `ToastContainer` que se renderiza en el layout principal.

```tsx
// Usando helpers (recomendado)
import { toast } from '@/store';

// Tipos disponibles
toast.success('Título', 'Mensaje opcional');
toast.error('Error', 'Descripción del error');
toast.warning('Advertencia', 'Mensaje de advertencia');
toast.info('Información', 'Mensaje informativo');

// Usando el store directamente
import { useUIStore } from '@/store';

const { addToast } = useUIStore();

addToast({
  type: 'success' | 'error' | 'warning' | 'info',
  title: 'Título requerido',
  message: 'Mensaje opcional',
  duration: 5000 // ms, default 5000, usar 0 para no auto-cerrar
});
```

**Características:**
- Aparecen en esquina inferior derecha
- Se auto-cierran después del `duration`
- Animación de entrada/salida
- Botón para cerrar manualmente
- Accesibles con `aria-live`

## 🔐 Autenticación

### Flujo de Login

1. Usuario ingresa credenciales
2. Se envía petición a `/auth/login`
3. Backend retorna `{ user, token }`
4. Token se guarda en `localStorage` (via Zustand persist)
5. Usuario se redirige a la página destino

### Protección de Rutas

```tsx
// En layouts o páginas
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function ProtectedPage() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isHydrated, isAuthenticated, router]);

  if (!isHydrated || !isAuthenticated) {
    return <Loading />;
  }

  return <div>Contenido protegido</div>;
}
```

### Interceptor de Token

El cliente Axios automáticamente:
- Agrega el token a todas las peticiones
- Maneja errores 401 (redirige a login)
- Limpia el estado en caso de token expirado

## 🌐 API Integration

### Cliente Base

```typescript
// lib/api/client.ts
import axios from 'axios';
import { API_BASE_URL } from '@/constants/api';
import { useAuthStore } from '@/store/authStore';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - agrega token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Endpoints Disponibles

| Módulo | Endpoints |
|--------|-----------|
| Auth | POST /auth/login, POST /auth/register, GET /auth/me |
| Products | GET /products, GET /products/:slug |
| Categories | GET /categories |
| Cart | GET /cart, POST /cart/items, PATCH /cart/items/:id, DELETE /cart/items/:id |
| Orders | GET /orders, GET /orders/:id, POST /orders |
| Users | GET /users/me, PATCH /users/me, GET /users/addresses |
| Wishlist | GET /wishlist, POST /wishlist, DELETE /wishlist/:id |
| Reviews | GET /products/:id/reviews, POST /reviews |

## 📱 Responsive Design

El diseño sigue un enfoque **mobile-first**:

```css
/* Breakpoints de Tailwind */
sm: 640px   /* Móviles grandes */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktop */
2xl: 1536px /* Desktop grande */
```

### Ejemplo de Grid Responsivo

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {products.map(product => (
    <ProductCard key={product.id} product={product} />
  ))}
</div>
```

## 🎯 Funcionalidades Implementadas

### ✅ Completadas

- [x] Autenticación (login/registro)
- [x] Listado de productos con filtros
- [x] Detalle de producto
- [x] Sistema de reseñas
- [x] Carrito de compras
- [x] Proceso de checkout
- [x] Gestión de direcciones
- [x] Lista de deseos
- [x] Historial de pedidos
- [x] Perfil de usuario
- [x] Configuración de cuenta

### 📝 Pendientes / Mejoras Futuras

- [ ] Sistema de búsqueda avanzado
- [ ] Filtros de productos en tiempo real
- [ ] Paginación infinita
- [ ] PWA (Progressive Web App)
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)
- [ ] Tests unitarios y E2E
- [ ] SEO optimizado
- [ ] Analytics

## 🧪 Testing

### Ejecutar Tests

```bash
# Tests unitarios
pnpm test

# Tests con coverage
pnpm test:coverage

# Tests E2E
pnpm test:e2e
```

### Estructura de Tests

```
__tests__/
├── components/          # Tests de componentes
│   └── Button.test.tsx
├── hooks/               # Tests de hooks
│   └── useProducts.test.ts
├── utils/               # Tests de utilidades
│   └── formatCurrency.test.ts
└── e2e/                 # Tests end-to-end
    └── checkout.spec.ts
```

## 🚀 Despliegue

### Build de Producción

```bash
# Crear build optimizado
pnpm build

# Iniciar en producción
pnpm start
```

### Variables de Entorno para Producción

```env
NEXT_PUBLIC_API_URL=https://api.mitienda.com
NEXT_PUBLIC_APP_NAME=Mi Tienda
NEXT_PUBLIC_APP_URL=https://mitienda.com
```

### Despliegue en Vercel

1. Conectar repositorio en Vercel
2. Configurar variables de entorno
3. Desplegar

### Despliegue con Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY . .
RUN pnpm build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

## 🐛 Troubleshooting

### Errores Comunes

**Error: "Hydration mismatch"**
- Causa: Diferencia entre servidor y cliente
- Solución: Usar `useEffect` para estado que depende del cliente

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!mounted) return null;
```

**Error: "Cannot read properties of null"**
- Causa: Datos no cargados
- Solución: Verificar estado de loading

```tsx
if (isLoading) return <Loading />;
if (!data) return <EmptyState />;
```

**Error: "Token expired"**
- Causa: Sesión expirada
- Solución: El interceptor maneja esto automáticamente

## 📚 Recursos Adicionales

- [Next.js Documentation](https://nextjs.org/docs)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)

## 👥 Contribución

1. Crear branch desde `develop`
2. Hacer cambios siguiendo las [reglas de código](./CODING_RULES.md)
3. Crear Pull Request
4. Code review
5. Merge a `develop`

## 📄 Licencia

Este proyecto es privado y confidencial.
