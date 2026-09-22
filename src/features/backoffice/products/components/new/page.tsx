import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';

import { Button, Input, Spinner } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useCategories, useCreateProduct } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { toast } from '@/store';
import { productSchema } from '../../schemas';
import { ProductFormData } from '../../types';

export default function FeatureBackofficeProductNewPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema) as unknown as Resolver<ProductFormData>,
    defaultValues: { isActive: true, stock: 0 },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      const created = await createProduct.mutateAsync({
        ...data,
        compareAtPrice: data.compareAtPrice ?? undefined,
        categoryId: data.categoryId || undefined,
      });
      toast.success('Creado', `"${created.name}" fue creado correctamente`);
      router.push(ROUTES.BACKOFFICE.PRODUCTS);
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={ROUTES.BACKOFFICE.PRODUCTS}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Productos
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo producto</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
        {/* Basic info */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-gray-700">Información básica</h2>
          <Input
            label="Nombre *"
            placeholder="Nombre del producto"
            error={errors.name?.message}
            {...register('name')}
          />
          <Input
            label="Slug (URL amigable)"
            placeholder="nombre-del-producto"
            error={errors.slug?.message}
            {...register('slug')}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Descripción corta</label>
            <textarea
              rows={2}
              placeholder="Breve descripción para listados"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              {...register('shortDescription')}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Descripción completa</label>
            <textarea
              rows={4}
              placeholder="Descripción detallada del producto"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              {...register('description')}
            />
          </div>
        </section>

        {/* Pricing & Stock */}
        <section className="space-y-4 border-t border-gray-100 pt-4">
          <h2 className="text-base font-semibold text-gray-700">Precio y stock</h2>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Precio *"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.price?.message}
              {...register('price')}
            />
            <Input
              label="Precio comparativo"
              type="number"
              step="0.01"
              placeholder="0.00"
              error={errors.compareAtPrice?.message}
              {...register('compareAtPrice')}
            />
          </div>
          <Input
            label="Stock *"
            type="number"
            placeholder="0"
            error={errors.stock?.message}
            {...register('stock')}
          />
        </section>

        {/* Category & Status */}
        <section className="space-y-4 border-t border-gray-100 pt-4">
          <h2 className="text-base font-semibold text-gray-700">Categoría y estado</h2>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Categoría</label>
            {categoriesLoading ? (
              <Spinner />
            ) : (
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                {...register('categoryId')}
              >
                <option value="">Sin categoría</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register('isActive')}
            />
            <span className="text-sm font-medium text-gray-700">Producto activo (visible en tienda)</span>
          </label>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <Link href={ROUTES.BACKOFFICE.PRODUCTS}>
            <Button variant="outline" type="button">Cancelar</Button>
          </Link>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            Crear producto
          </Button>
        </div>
      </form>
    </div>
  );
}
