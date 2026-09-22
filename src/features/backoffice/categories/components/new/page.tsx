import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';

import { Button, IconLinkButton, Input, Spinner } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useCategories, useCreateCategory } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { toast } from '@/store';
import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft } from 'lucide-react';
import { categorySchema } from '../../schemas';
import { CategoryFormData } from '../../types';

export default function CategoryNewPage() {
  const router = useRouter();
  const createCategory = useCreateCategory();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema) as unknown as Resolver<CategoryFormData>,
    defaultValues: { isActive: true, displayOrder: 0 },
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const created = await createCategory.mutateAsync({
        ...data,
        parentId: data.parentId || undefined,
      });
      toast.success('Creada', `"${created.name}" fue creada correctamente`);
      router.push(ROUTES.BACKOFFICE.CATEGORIES);
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-4">
        <IconLinkButton href={ROUTES.BACKOFFICE.CATEGORIES} variant='primary'>
          <ArrowLeft size={18} />
        </IconLinkButton>
        <h1 className="text-2xl font-bold text-gray-900">Nueva categoría</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
        <Input
          label="Nombre *"
          placeholder="Nombre de la categoría"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Slug (URL amigable)"
          placeholder="nombre-de-la-categoria"
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
          {categoriesLoading ? (
            <Spinner />
          ) : (
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              {...register('parentId')}
            >
              <option value="">Sin categoría padre (raíz)</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
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
            Crear categoría
          </Button>
        </div>
      </form>
    </div>
  );
}
