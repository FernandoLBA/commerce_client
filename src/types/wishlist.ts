import type { BaseEntity } from './common';
import type { Product, ProductVariant } from './product';

/**
 * Wishlist item entity
 */
export interface WishlistItem extends Omit<BaseEntity, 'updatedAt'> {
  userId: string;
  productId: string;
  variantId: string | null;
  notes: string | null;
  priceWhenAdded: string | null;
  notifyOnPriceDrop: boolean;
  notifyOnBackInStock: boolean;
  product: Product;
  variant: ProductVariant | null;
}

/**
 * Add to wishlist data
 */
export interface AddToWishlistData {
  productId: string;
  variantId?: string;
  notes?: string;
  notifyOnPriceDrop?: boolean;
  notifyOnBackInStock?: boolean;
}

/**
 * Update wishlist item data
 */
export interface UpdateWishlistItemData {
  notes?: string;
  notifyOnPriceDrop?: boolean;
  notifyOnBackInStock?: boolean;
}

/**
 * Wishlist count response
 */
export interface WishlistCountResponse {
  count: number;
}

/**
 * Wishlist check response
 */
export interface WishlistCheckResponse {
  isInWishlist: boolean;
  itemId: string | null;
}
