'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import { Button, Input, Loading } from '@/components/ui';
import { useCategories, useUpdateCategory } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { toast } from '@/store';
import { ROUTES } from '@/constants';

const categorySchema = yup.object({
  name: yup.string().required('El nombre es requerido').min(2, 'Mínimo 2 caracteres'),
  slug: yup.string().optional(),
  description: yup.string().optional(),
  parentId: yup.string().optional(),
  displayOrder: yup.number().optional().min(0).integer().typeError('Ingresa un número válido'),
  isActive: yup.boolean().default(true),
});

interface CategoryFormData {
  name: string;
  slug?: string;
  description?: string;
  parentId?: string;
  displayOrder?: number;
  isActive: boolean;
}

export default function BackofficeCategoryEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: categories, isLoading } = useCategories();
  const updateCategory = useUpdateCategory();

  const currentCategory = categories?.find((c) => c.id === id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema) as unknown as Resolver<CategoryFormData>,
  });

  useEffect(() => {
    if (currentCategory) {
      reset({
        name: currentCategory.name,
        slug: currentCategory.slug,
        description: currentCategory.description ?? '',
        parentId: currentCategory.parentId ?? '',
        displayOrder: currentCategory.displayOrder,
        isActive: currentCategory.isActive,
      });
    }
  }, [currentCategory, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await updateCategory.mutateAsync({
        id,
        data: { ...data, parentId: data.parentId || undefined },
      });
      toast.success('Actualizada', 'Categoría guardada correctamente');
      router.push(ROUTES.BACKOFFICE.CATEGORIES);
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  if (isLoading) return <Loading className="py-20" />;

  if (!currentCategory) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Categoría no encontrada</p>
        <Link href={ROUTES.BACKOFFICE.CATEGORIES} className="mt-4 inline-block text-sm text-primary-600 hover:underline">
          ← Volver a categorías
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href={ROUTES.BACKOFFICE.CATEGORIES} className="text-sm text-gray-500 hover:text-gray-700">
          ← Categorías
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar categoría</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
        <Input
          label="Nombre *"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Slug (URL amigable)"
          error={errors.slug?.message}
          {...register('slug')}
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            {...register('description')}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Categoría padre</label>
          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            {...register('parentId')}
          >
            <option value="">Sin categoría padre (raíz)</option>
            {categories
              ?.filter((c) => c.id !== id)
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>
        <Input
          label="Orden de visualización"
          type="number"
          error={errors.displayOrder?.message}
          {...register('displayOrder')}
        />
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            {...register('isActive')}
          />
          <span className="text-sm font-medium text-gray-700">Categoría activa</span>
        </label>

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <Link href={ROUTES.BACKOFFICE.CATEGORIES}>
            <Button variant="outline" type="button">Cancelar</Button>
          </Link>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
