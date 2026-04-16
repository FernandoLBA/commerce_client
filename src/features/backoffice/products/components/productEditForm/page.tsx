'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';

import { AppImage, Button, EmptyData, IconButton, IconLinkButton, Input, Loading, Skeleton, Spinner, UploadButton } from '@/components/ui';
import { allowedFileTypes, FILE_SIZES, ROUTES } from '@/constants';
import { useCategories, useDisclosure, useProduct, useUpdateProduct, useUpload } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { toast } from '@/store';
import { Category, ProductImage } from '@/types';
import { useDeleteProductImage, useUploadProductImages } from '../../hooks';
import { productSchema } from '../../schemas';
import { ProductFormData } from '../../types';

export default function FeatureBackofficeProductEditPage({ productSlug }:{ productSlug: string }) {
  const [isSubmittingImages, setIsSubmittingImages] = useState<boolean>(false);
  const { isOpen: isEditting ,handleToggle: handleToggleEditting} = useDisclosure();
  const { files, errorMessage, handleUploadFiles, clearFiles, handleDeleteFile } = useUpload({
    accept: allowedFileTypes.IMAGE,
    maxSize: FILE_SIZES.IMAGE,
    maxFiles: 6,
  });

  const router = useRouter();

  const { data: product, isLoading } = useProduct(productSlug);
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const updateProduct = useUpdateProduct();
  const createProductImages = useUploadProductImages();
  const deleteProductImage = useDeleteProductImage();

  const loading = useMemo(() => isLoading || deleteProductImage.isPending || createProductImages.isPending, 
  [isLoading, deleteProductImage.isPending, createProductImages.isPending]);

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
      console.log(">>>>>>>>>>Submitting images", files);
      setIsSubmittingImages(true);
      await createProductImages.mutateAsync({
        productId: product!.id,
        files
      })
      
      toast.success('Actualizado', `${files.length > 1 ? "Imágenes subidas" : "Imagen subida" } correctamente`);
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    } finally {
      // setIsSubmittingImages(false);
      // setIsEditingImages(false);
      handleToggleEditting();
      clearFiles();
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    try {
      const isConfirmed = confirm('¿Estás seguro de que deseas eliminar esta imagen?');

      if(!isConfirmed) return;

      await deleteProductImage.mutateAsync({ imageId })
      toast.success('Eliminada', 'Imagen eliminada correctamente');
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  }

  if (isLoading) return <Loading className="py-20" />;

  if (!product) return <EmptyData href={ROUTES.BACKOFFICE.PRODUCTS} />;

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
          { !isEditting && product.images.length > 0 ?
            <div className="flex flex-col items-start gap-4">
              <div className='w-full flex flex-wrap justify-start gap-4'>
                {product.images.map((image: ProductImage) => (
                  <div
                    key={image.id}
                    className='relative h-32 w-32 overflow-hidden'
                  >
                    <IconButton 
                      variant='secondary' 
                      type='button'
                      className='absolute right-1.5 top-1.5 z-10 rounded-full p-1'
                      onClick={() => handleDeleteImage(image.id)}
                    >
                      <X size={18} />
                    </IconButton>
                    
                    {/* // TODO: Corregir el loading  */ }
                    {loading ? (
                      <Skeleton className='h-full w-full rounded-md' />
                    ):(
                      <AppImage
                        alt={image.alt || "Category image"}
                        src={image.url || ''}
                        className="rounded-md object-cover h-full w-full"
                      />
                    )}
                  </div>
              ))}
              </div>

              {product.images.length < 6 &&
                <Button variant='primary' type='button' className='w-full md:w-fit md:self-end' onClick={handleToggleEditting}>
                  Agregar imagen
                </Button>
              }
            </div>
          :
            <UploadButton 
              files={files}
              onUpload={ handleUploadFiles }
              onClearFiles={clearFiles}
              onDeleteFile={handleDeleteFile}
              onCancel={ handleToggleEditting }
              error={errorMessage}
              onSubmit={ handleSubmitImage }
              accept={allowedFileTypes.IMAGE}
              loading={loading}
              multiple
              maxSize={ FILE_SIZES.IMAGE }
              maxFiles={ 6 }
              filesUploaded={product.images.length}
            >
              Cargar imagen
            </UploadButton>
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
                {categories?.map((cat: Category) => (
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
            <Button variant="outline" type="button" onClick={handleToggleEditting}>Cancelar</Button>
          </Link>
          <Button variant="primary" type="submit" isLoading={isSubmitting}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
