/**
 * Application-wide configuration constants
 */
export const APP_CONFIG = {
  /** Application name */
  NAME: process.env.NEXT_PUBLIC_APP_NAME ?? 'Commerce Store',

  /** API base URL */
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',

  /** Application URL */
  APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',

  /** Default currency */
  CURRENCY: 'PEN',

  /** Currency symbol */
  CURRENCY_SYMBOL: 'S/',

  /** Default locale */
  LOCALE: 'es-PE',

  /** Items per page for pagination */
  ITEMS_PER_PAGE: 12,

  /** Maximum quantity per cart item */
  MAX_CART_ITEM_QUANTITY: 99,

  /** Minimum quantity per cart item */
  MIN_CART_ITEM_QUANTITY: 1,

  /** Review rating range */
  RATING: {
    MIN: 1,
    MAX: 5,
  },

  /** Feature flags */
  FEATURES: {
    REVIEWS_ENABLED: process.env.NEXT_PUBLIC_ENABLE_REVIEWS === 'true',
    WISHLIST_ENABLED: process.env.NEXT_PUBLIC_ENABLE_WISHLIST === 'true',
  },
};

/**
 * Local storage keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  AUTH_STORE: 'auth_store',
  USER: 'user',
  CART_ID: 'cart_id',
  THEME: 'theme',
  RECENTLY_VIEWED: 'recently_viewed',
} as const;

/**
 * Query keys for TanStack Query
 */
export const QUERY_KEYS = {
  // Auth
  USER: ['user'],
  PROFILE: ['profile'],

  // Products
  PRODUCTS: ['products'],
  PRODUCT: (id: string) => ['products', id],
  PRODUCT_BY_SLUG: (slug: string) => ['products', 'slug', slug],

  // Categories
  CATEGORIES: ['categories'],
  CATEGORY: (slug: string) => ['categories', slug],

  // Cart
  CART: ['cart'],
  CART_VALIDATION: ['cart', 'validation'],

  // Orders
  ORDERS: ['orders'],
  ORDER: (id: string) => ['orders', id],

  // Wishlist
  WISHLIST: ['wishlist'],
  WISHLIST_COUNT: ['wishlist', 'count'],
  WISHLIST_CHECK: (productId: string, variantId?: string) => [
    'wishlist',
    'check',
    productId,
    variantId,
  ],

  // Reviews
  REVIEWS: (productId?: string) => ['reviews', productId],
  PRODUCT_RATING: (productId: string) => ['reviews', 'rating', productId],
  MY_REVIEWS: ['reviews', 'my'],

  // Addresses
  ADDRESSES: ['addresses'],
  ADDRESS: (id: string) => ['addresses', id],

  // Shipping
  SHIPPING_RATES: ['shipping', 'rates'],

  // Admin
  ADMIN_STATS: ['admin', 'stats'],
  ADMIN_PRODUCTS: (filters?: unknown) => ['admin', 'products', filters],
  ADMIN_PRODUCT: (id: string) => ['admin', 'products', id],
  ADMIN_ORDERS: (filters?: unknown) => ['admin', 'orders', filters],
  ADMIN_ORDER: (id: string) => ['admin', 'orders', id],
  ADMIN_USERS: (filters?: unknown) => ['admin', 'users', filters],
  ADMIN_REVIEWS: (filters?: unknown) => ['admin', 'reviews', filters],
} as const;

/**
 * HTTP status codes
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

/**
 * Validation constants
 */
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  PHONE_MIN_LENGTH: 9,
  PHONE_MAX_LENGTH: 15,
  REVIEW_TITLE_MAX_LENGTH: 100,
  REVIEW_COMMENT_MAX_LENGTH: 1000,
} as const;

export const FILE_SIZES = {
  IMAGE: 1 * 1024 * 1024,
} as const;