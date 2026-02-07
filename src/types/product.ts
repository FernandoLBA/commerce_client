import type { BaseEntity } from './common';

/**
 * Category entity
 */
export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  parentId: string | null;
  isActive: boolean;
  displayOrder: number;
  parent?: Category;
  children?: Category[];
}

/**
 * Product entity
 */
export interface Product extends BaseEntity {
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isActive: boolean;
  hasVariants: boolean;
  categoryId: string | null;
  category?: Category | null;
  variants?: ProductVariant[];
  images?: ProductImage[];
  averageRating?: number;
  reviewCount?: number;
}

/**
 * Product with all relations loaded
 */
export interface ProductWithDetails extends Product {
  category: Category | null;
  variants: ProductVariant[];
  images: ProductImage[];
  rating?: ProductRating;
}

/**
 * Product variant entity
 */
export interface ProductVariant extends BaseEntity {
  productId: string;
  sku: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isActive: boolean;
  attributeValues?: VariantAttributeValue[];
}

/**
 * Product image entity
 */
export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  publicId: string | null;
  alt: string | null;
  width: number | null;
  height: number | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product attribute (e.g., "Color", "Size")
 */
export interface ProductAttribute extends BaseEntity {
  name: string;
  values?: ProductAttributeValue[];
}

/**
 * Product attribute value (e.g., "Red", "XL")
 */
export interface ProductAttributeValue extends BaseEntity {
  attributeId: string;
  value: string;
  attribute?: ProductAttribute;
}

/**
 * Variant attribute value relation
 */
export interface VariantAttributeValue {
  variantId: string;
  attributeValueId: string;
  attributeValue: ProductAttributeValue & {
    attribute: ProductAttribute;
  };
}

/**
 * Product rating summary
 */
export interface ProductRating {
  average: number;
  count: number;
  distribution: Record<number, number>;
}

/**
 * Product filter parameters
 */
export interface ProductFilterParams {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
  search?: string;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

/**
 * Create product data (admin)
 */
export interface CreateProductData {
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  stock?: number;
  isActive?: boolean;
  categoryId?: string;
}

/**
 * Update product data (admin)
 */
export type UpdateProductData = Partial<CreateProductData>;

/**
 * Create category data (admin)
 */
export interface CreateCategoryData {
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  parentId?: string;
  isActive?: boolean;
  displayOrder?: number;
}

/**
 * Update category data (admin)
 */
export type UpdateCategoryData = Partial<CreateCategoryData>;
