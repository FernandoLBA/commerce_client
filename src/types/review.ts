import type { BaseEntity } from './common';
import type { User } from './user';
import type { Product } from './product';

/**
 * Review entity
 */
export interface Review extends BaseEntity {
  userId: string;
  productId: string;
  rating: number;
  title: string | null;
  comment: string | null;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  helpfulCount: number;
  images: string[];
  adminResponse: string | null;
  adminResponseAt: string | null;
  user?: Pick<User, 'id' | 'firstName' | 'lastName'>;
  product?: Product;
}

/**
 * Create review data
 */
export interface CreateReviewData {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
  images?: string[];
}

/**
 * Update review data
 */
export interface UpdateReviewData {
  rating?: number;
  title?: string;
  comment?: string;
  images?: string[];
}

/**
 * Review filter parameters
 */
export interface ReviewFilterParams {
  productId?: string;
  page?: number;
  limit?: number;
  onlyVerified?: boolean;
}
