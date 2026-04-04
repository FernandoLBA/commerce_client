export interface ProductFormData {  
  name: string;
  slug?: string;
  description?: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  isActive: boolean;
  categoryId?: string;
}