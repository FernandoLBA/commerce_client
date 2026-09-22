import * as yup from 'yup';

export const categorySchema = yup.object({
  name: yup.string().required('El nombre es requerido').min(2, 'Mínimo 2 caracteres'),
  slug: yup.string().optional(),
  description: yup.string().optional(),
  parentId: yup.string().optional(),
  displayOrder: yup.number().optional().min(0).integer().typeError('Ingresa un número válido'),
  isActive: yup.boolean().default(true),
});