import * as yup from 'yup';

import { CategoryFormData } from '../types/category-form-data.interface';

export const categorySchema = yup.object<CategoryFormData>({
  name: yup.string().required('El nombre es requerido').min(2, 'Mínimo 2 caracteres'),
  slug: yup.string().optional(),
  description: yup.string().optional(),
  parentId: yup.string().optional(),
  displayOrder: yup.number().required("El posicionamiento es requerido").min(0, "El número debe ser positivo").integer().default(7).typeError('Ingresa un número válido'),
  image: yup.string().optional().nullable(),
  isActive: yup.boolean().default(true),
});
