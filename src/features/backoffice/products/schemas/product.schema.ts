import * as yup from 'yup';

export const productSchema = yup.object({
  name: yup.string().required('El nombre es requerido').min(2, 'Mínimo 2 caracteres'),
  slug: yup.string().optional(),
  description: yup.string().optional(),
  shortDescription: yup.string().optional(),
  price: yup.number().required('El precio es requerido').positive('Debe ser mayor a 0').typeError('Ingresa un número válido'),
  compareAtPrice: yup.number().optional().positive('Debe ser mayor a 0').nullable().typeError('Ingresa un número válido'),
  stock: yup.number().required('El stock es requerido').min(0, 'No puede ser negativo').integer('Debe ser un entero').typeError('Ingresa un número válido'),
  isActive: yup.boolean().default(true),
  categoryId: yup.string().optional(),
});