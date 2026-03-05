'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import { Button, Input, Loading, Spinner } from '@/components/ui';
import { useProduct, useUpdateProduct, useCategories } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { toast } from '@/store';
import { ROUTES } from '@/constants';

const productSchema = yup.object({
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

interface ProductFormData {
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

export default function BackofficeProductEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id);
  const updateProduct = useUpdateProduct();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema) as unknown as Resolver<ProductFormData>,
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        slug: product.slug,
        description: product.description ?? '',
        shortDescription: product.shortDescription ?? '',
        price: product.price,
        compareAtPrice: product.compareAtPrice ?? undefined,
        stock: product.stock,
        isActive: product.isActive,
        categoryId: product.categoryId ?? '',
      });
    }
  }, [product, reset]);

  const onSubmit = async (data: ProductFormData) => {
    try {
      await updateProduct.mutateAsync({
        id,
        data: {
          ...data,
          compareAtPrice: data.compareAtPrice ?? undefined,
          categoryId: data.categoryId || undefined,
        },
      });
      toast.success('Actualizado', 'Producto guardado correctamente');
      router.push(ROUTES.BACKOFFICE.PRODUCTS);
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  if (isLoading) {
    return <Loading className="py-20" />;
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Producto no encontrado</p>
        <Link href={ROUTES.BACKOFFICE.PRODUCTS} className="mt-4 inline-block text-sm text-primary-600 hover:underline">
          ← Volver a productos
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={ROUTES.BACKOFFICE.PRODUCTS} className="text-sm text-gray-500 hover:text-gray-700">
          ← Productos
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Editar producto</h1>
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
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              {...register('shortDescription')}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Descripción completa</label>
            <textarea
              rows={4}
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
              error={errors.price?.message}
              {...register('price')}
            />
            <Input
              label="Precio comparativo"
              type="number"
              step="0.01"
              error={errors.compareAtPrice?.message}
              {...register('compareAtPrice')}
            />
          </div>
          <Input
            label="Stock *"
            type="number"
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
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
