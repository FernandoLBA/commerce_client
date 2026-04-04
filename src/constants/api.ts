/**
 * API endpoints configuration
 * Centralized endpoint management to avoid magic strings
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    VALIDATE: '/auth/validate',
    ACTIVATE: '/auth/activate',
    RESEND_ACTIVATION_TOKEN: '/auth/resend-activation',
    FORGOT_PASSWORD: '/auth/forgot-password',
    PASSWORD_RESET: '/auth/password-reset',
  },

  // Users
  USERS: {
    PROFILE: '/users/profile',
    ADDRESSES: '/users/addresses',
    ADDRESS_BY_ID: (id: string) => `/users/addresses/${id}`,
    SET_DEFAULT_ADDRESS: (id: string) => `/users/addresses/${id}/default`,
  },

  // Products
  PRODUCTS: {
    BASE: '/products',
    BY_SEARCH: (search: string) => `/products/${search}`,
    UPLOAD_IMAGES: (productId: string) => `/products/${productId}/files/upload`
  },

  // Categories
  CATEGORIES: {
    BASE: '/categories',
    BY_SEARCH: (slug: string) => `/categories/${slug}`,
    UPLOAD_IMAGE: (slug: string) => `/categories/${slug}/files/upload`
  },

  // Cart
  CART: {
    BASE: '/cart',
    ITEMS: '/cart/items',
    ITEM_BY_ID: (itemId: string) => `/cart/items/${itemId}`,
    VALIDATE: '/cart/validate',
  },

  // Orders
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id: string) => `/orders/${id}`,
    BY_NUMBER: (orderNumber: string) => `/orders/number/${orderNumber}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    ADMIN: '/orders/admin',
  },

  // Wishlist
  WISHLIST: {
    BASE: '/wishlist',
    BY_ID: (id: string) => `/wishlist/${id}`,
    COUNT: '/wishlist/count',
    CHECK: '/wishlist/check',
    MOVE_TO_CART: (id: string) => `/wishlist/${id}/move-to-cart`,
  },

  // Reviews
  REVIEWS: {
    BASE: '/reviews',
    BY_ID: (id: string) => `/reviews/${id}`,
    PRODUCT_RATING: (productId: string) => `/reviews/product/${productId}/rating`,
    MY_REVIEWS: '/reviews/my-reviews',
    HELPFUL: (id: string) => `/reviews/${id}/helpful`,
  },

  // Coupons
  COUPONS: {
    VALIDATE: '/coupons/validate',
    APPLY: '/coupons/apply',
  },

  // Payments
  PAYMENTS: {
    CREATE_INTENT: '/payments/create-intent',
    CONFIRM: '/payments/confirm',
  },

  // Shipping
  SHIPPING: {
    RATES: '/shipping/rates',
    TRACK: (trackingNumber: string) => `/shipping/track/${trackingNumber}`,
  },

  // Admin
  ADMIN: {
    STATS: '/admin/stats',
    USERS: '/admin/users',
    USER_BY_ID: (id: string) => `/admin/users/${id}`,
    REVIEWS: '/admin/reviews',
    REVIEW_APPROVE: (id: string) => `/admin/reviews/${id}/approve`,
  },
} as const;
