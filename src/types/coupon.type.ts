import type { DiscountType } from '@/constants';
import type { BaseEntity } from './common.type';

/**
 * Coupon entity
 */
export interface Coupon extends BaseEntity {
  code: string;
  description: string | null;
  discountType: DiscountType;
  discountValue: string;
  minPurchaseAmount: string | null;
  maxDiscountAmount: string | null;
  usageLimit: number | null;
  usageCount: number;
  usageLimitPerUser: number | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  applicableCategories: string[];
  applicableProducts: string[];
  excludedProducts: string[];
  isFirstPurchaseOnly: boolean;
}

/**
 * Validate coupon response
 */
export interface CouponValidationResponse {
  isValid: boolean;
  coupon: Coupon | null;
  discountAmount: number;
  message: string;
}

/**
 * Apply coupon data
 */
export interface ApplyCouponData {
  code: string;
  cartTotal: number;
  productIds: string[];
  categoryIds: string[];
}
