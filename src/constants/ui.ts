/**
 * UI-related constants
 */

/**
 * Route paths for navigation
 */
export const ROUTES = {
  HOME: '/',
  
  // Auth routes
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: (token: string) => `/auth/password-reset/${token}`,
    ACTIVATE_NOTIFICATION: '/auth/activate-notification',
    RESEND_ACTIVATION_EMAIL: '/auth/resend-activation',
    FORGOT_PASSWORD_NOTIFICATION: '/auth/forgot-password-notification',
  },

  // Account routes
  ACCOUNT: {
    BASE: '/account',
    PROFILE: '/account/profile',
    ORDERS: '/account/orders',
    ADDRESSES: '/account/addresses',
    WISHLIST: '/account/wishlist',
  },

  // Shop routes
  SHOP: {
    PRODUCTS: '/products',
    SEARCH: '/search',
    BACKOFFICE: '/backoffice',
    PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
    CATEGORY: (slug: string) => `/categories/${slug}`,
  },

  // User routes
  USER: {
    PROFILE: '/account/profile',
    ORDERS: '/account/orders',
    ORDER_DETAIL: (id: string) => `/account/orders/${id}`,
    ADDRESSES: '/account/addresses',
    WISHLIST: '/account/wishlist',
    REVIEWS: '/account/reviews',
  },

  // Checkout routes
  CHECKOUT: {
    CART: '/cart',
    CHECKOUT: '/checkout',
    PAYMENT: '/checkout/payment',
    CONFIRMATION: '/checkout/confirmation',
  },

  // Static pages
  STATIC: {
    ABOUT: '/about',
    CONTACT: '/contact',
    TERMS: '/terms',
    PRIVACY: '/privacy',
    FAQ: '/faq',
  },

  // Backoffice routes (admin)
  BACKOFFICE: {
    BASE: '/backoffice',
    DASHBOARD: '/backoffice',
    PRODUCTS: '/backoffice/products',
    PRODUCT_NEW: '/backoffice/products/new',
    PRODUCT_EDIT: (slug: string) => `/backoffice/products/${slug}`,
    CATEGORIES: '/backoffice/categories',
    CATEGORY_NEW: '/backoffice/categories/new',
    CATEGORY_EDIT: (slug: string) => `/backoffice/categories/${slug}`,
    ORDERS: '/backoffice/orders',
    ORDER_DETAIL: (id: string) => `/backoffice/orders/${id}`,
    USERS: '/backoffice/users',
    REVIEWS: '/backoffice/reviews',
  },
} as const;

/**
 * Breakpoint values for responsive design
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536,
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  DROPDOWN: 10,
  STICKY: 20,
  FIXED: 30,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  POPOVER: 60,
  TOOLTIP: 70,
  TOAST: 80,
} as const;

/**
 * Animation durations in milliseconds
 */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

/**
 * Toast notification durations in milliseconds
 */
export const TOAST_DURATION = {
  SHORT: 3000,
  NORMAL: 5000,
  LONG: 8000,
} as const;

/**
 * Order status display configuration
 */
export const ORDER_STATUS_CONFIG = {
  PENDING: {
    label: 'Pendiente',
    color: 'bg-primary-100 text-primary-800',
    icon: 'Clock',
  },
  CONFIRMED: {
    label: 'Confirmado',
    color: 'bg-primary-200 text-primary-900',
    icon: 'CheckCircle',
  },
  PROCESSING: {
    label: 'Procesando',
    color: 'bg-primary-200 text-primary-800',
    icon: 'Package',
  },
  SHIPPED: {
    label: 'Enviado',
    color: 'bg-primary-300 text-primary-900',
    icon: 'Truck',
  },
  DELIVERED: {
    label: 'Entregado',
    color: 'bg-green-100 text-green-800',
    icon: 'CheckCircle2',
  },
  CANCELLED: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800',
    icon: 'XCircle',
  },
  REFUNDED: {
    label: 'Reembolsado',
    color: 'bg-gray-100 text-gray-800',
    icon: 'RotateCcw',
  },
} as const;

/**
 * Payment method display configuration
 */
export const PAYMENT_METHOD_CONFIG = {
  STRIPE: {
    label: 'Tarjeta de Crédito/Débito',
    icon: 'CreditCard',
  },
  MERCADOPAGO: {
    label: 'MercadoPago',
    icon: 'Wallet',
  },
  CASH_ON_DELIVERY: {
    label: 'Pago contra entrega',
    icon: 'Banknote',
  },
} as const;

/**
 * Shipping carrier display configuration
 */
export const SHIPPING_CARRIER_CONFIG = {
  OLVA: {
    label: 'Olva Courier',
    estimatedDays: '2-3',
  },
  SHALOM: {
    label: 'Shalom',
    estimatedDays: '3-5',
  },
  CRUZ_DEL_SUR: {
    label: 'Cruz del Sur',
    estimatedDays: '2-4',
  },
  SERVIENTREGA: {
    label: 'Servientrega',
    estimatedDays: '3-5',
  },
  PICKUP: {
    label: 'Recojo en tienda',
    estimatedDays: '1',
  },
} as const;
