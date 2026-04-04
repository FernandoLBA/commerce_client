'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, PencilIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';

import { Button, EmptyData, IconButton, IconLinkButton, Input, Loading, Spinner, UploadButton } from '@/components/ui';
import { allowedFileTypes, FILE_SIZES, ROUTES } from '@/constants';
import { useCategories, useProduct, useUpdateProduct, useUploadFiles } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { toast } from '@/store';
import { useUploadProductImages } from '../../hooks';
import { productSchema } from '../../schemas';
import { ProductFormData } from '../../types';

export default function FeatureBackofficeProductEditPage({ productSlug }:{productSlug: string}) {
  const [isSubmittingImages, setIsSubmittingImages] = useState<boolean>(false);
  const { files, errors: fileErrors, handleErrors, handleUploadFiles } = useUploadFiles("IMAGE");
  const router = useRouter();

  const { data: product, isLoading } = useProduct(productSlug);
  const updateProduct = useUpdateProduct();
  const createProductImages = useUploadProductImages();
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
        slug: productSlug,
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

  const handleSubmitImage = async() => {
    try {
      setIsSubmittingImages(true);
      await createProductImages.mutateAsync({
        productId: product!.id,
        files
      })
      
      toast.success('Actualizado', `${files.length > 1 ? "Imágenes subidas" : "Imagen subida" } correctamente`);
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    } finally {
      setIsSubmittingImages(false);
    }
  }

  if (isLoading) {
    return <Loading className="py-20" />;
  }

  if (!product) {
    return (
      <EmptyData href={ROUTES.BACKOFFICE.PRODUCTS} />
    );
  }

  console.log({fileErrors, files});

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <IconLinkButton href={ROUTES.BACKOFFICE.PRODUCTS} variant='primary'>
          <ArrowLeft size={18} />
        </IconLinkButton>
        <h1 className="text-2xl font-bold text-gray-900">Editar producto</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
        <div className='w-full'>
          { false ?
            <div className="relative flex justify-start h-full mb-5 rounded-md">
              <Image
                alt="Category image"
                height={150}
                width={150}
                src=""
                className="rounded-md w-full h-32 object-cover"
              />

              <IconButton variant='secondary' type='button' className='absolute right-2 bottom-2' onClick={()=>{}}>
                <PencilIcon size={18} />
              </IconButton>
            </div>
          :
            <div>
              <UploadButton 
                onUpload={ handleUploadFiles }
                accept={allowedFileTypes.IMAGE}
                multiple
                maxSize={ FILE_SIZES.IMAGE }
                maxFiles={ 6 }
                showPreview
                variant={ fileErrors.length > 0 ? 'danger' : 'primary' }
                onError={ (error) => handleErrors([error]) }
                isSubmit
                onSubmit={ handleSubmitImage }
                isSubmitting={isSubmittingImages}
                // loading={uploadCategoryImage.isPending}
                // disabled={uploadCategoryImage.isPending}
              >
                Cargar imagen
              </UploadButton>
              {/* {fileErrors && <p className="mt-1 text-sm text-red-600">{fileErrors}</p>} */}
            </div>
          }
        </div>

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
