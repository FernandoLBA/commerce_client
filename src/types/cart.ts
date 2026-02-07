import type { BaseEntity } from './common';
import type { Product, ProductVariant } from './product';

/**
 * Cart entity
 */
export interface Cart extends BaseEntity {
  userId: string | null;
  sessionId: string | null;
  items: CartItem[];
}

/**
 * Cart item entity
 */
export interface CartItem extends BaseEntity {
  cartId: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  product: Product;
  variant: ProductVariant | null;
}

/**
 * Cart with calculated totals
 */
export interface CartWithTotals extends Cart {
  subtotal: number;
  itemCount: number;
}

/**
 * Add to cart data
 */
export interface AddToCartData {
  productId: string;
  variantId?: string;
  quantity?: number;
}

/**
 * Update cart item data
 */
export interface UpdateCartItemData {
  quantity: number;
}

/**
 * Cart validation result
 */
export interface CartValidationResult {
  isValid: boolean;
  errors: CartValidationError[];
  warnings: CartValidationWarning[];
}

/**
 * Cart validation error
 */
export interface CartValidationError {
  itemId: string;
  productId: string;
  variantId: string | null;
  type: 'OUT_OF_STOCK' | 'INSUFFICIENT_STOCK' | 'PRODUCT_INACTIVE' | 'VARIANT_INACTIVE';
  message: string;
  availableStock?: number;
}

/**
 * Cart validation warning
 */
export interface CartValidationWarning {
  itemId: string;
  productId: string;
  type: 'PRICE_CHANGED' | 'LOW_STOCK';
  message: string;
  oldPrice?: string;
  newPrice?: string;
}
