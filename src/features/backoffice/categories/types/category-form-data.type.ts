export interface CategoryFormData {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  displayOrder?: number;
  isActive: boolean;
  image?: string;
}