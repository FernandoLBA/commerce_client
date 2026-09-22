/**
 * User roles enumeration - mirrors backend Role enum
 */
export const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

/**
 * Order status enumeration - mirrors backend OrderStatus enum
 */
export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

/**
 * Payment status enumeration - mirrors backend PaymentStatus enum
 */
export const PaymentStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
  CANCELLED: 'CANCELLED',
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

/**
 * Payment method enumeration - mirrors backend PaymentMethod enum
 */
export const PaymentMethod = {
  STRIPE: 'STRIPE',
  MERCADOPAGO: 'MERCADOPAGO',
  CASH_ON_DELIVERY: 'CASH_ON_DELIVERY',
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

/**
 * Shipping carrier enumeration - mirrors backend ShippingCarrier enum
 */
export const ShippingCarrier = {
  OLVA: 'OLVA',
  SHALOM: 'SHALOM',
  CRUZ_DEL_SUR: 'CRUZ_DEL_SUR',
  SERVIENTREGA: 'SERVIENTREGA',
  PICKUP: 'PICKUP',
} as const;

export type ShippingCarrier = (typeof ShippingCarrier)[keyof typeof ShippingCarrier];

/**
 * Shipping status enumeration - mirrors backend ShippingStatus enum
 */
export const ShippingStatus = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  IN_TRANSIT: 'IN_TRANSIT',
  OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
  DELIVERED: 'DELIVERED',
  FAILED: 'FAILED',
  RETURNED: 'RETURNED',
  CANCELLED: 'CANCELLED',
} as const;

export type ShippingStatus = (typeof ShippingStatus)[keyof typeof ShippingStatus];

/**
 * Inventory movement type enumeration - mirrors backend MovementType enum
 */
export const MovementType = {
  PURCHASE: 'PURCHASE',
  RETURN: 'RETURN',
  ADJUSTMENT_IN: 'ADJUSTMENT_IN',
  TRANSFER_IN: 'TRANSFER_IN',
  SALE: 'SALE',
  RESERVATION: 'RESERVATION',
  ADJUSTMENT_OUT: 'ADJUSTMENT_OUT',
  DAMAGED: 'DAMAGED',
  EXPIRED: 'EXPIRED',
  TRANSFER_OUT: 'TRANSFER_OUT',
  RELEASE: 'RELEASE',
} as const;

export type MovementType = (typeof MovementType)[keyof typeof MovementType];

/**
 * Discount type enumeration - mirrors backend DiscountType enum
 */
export const DiscountType = {
  PERCENTAGE: 'PERCENTAGE',
  FIXED_AMOUNT: 'FIXED_AMOUNT',
  FREE_SHIPPING: 'FREE_SHIPPING',
} as const;

export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];
