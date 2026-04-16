import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, PencilIcon, Trash } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';

import { AppImage, Button, EmptyData, IconButton, IconLinkButton, Input, Loading, Skeleton, UploadButton } from '@/components/ui';
import { allowedFileTypes, FILE_SIZES, ROUTES } from '@/constants';
import { useCategories, useDisclosure, useUpload } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { toast } from '@/store';
import { useUpdateCategory, useUploadCategoryImage } from '../../hooks';
import { categorySchema } from '../../schemas';
import { CategoryFormData } from '../../types';

export function CategoryEditForm({ categorySlug }: { categorySlug: string }) {
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const { isOpen: editImage, handleIsOpen: handleOpen, handleIsClose: handleClose } = useDisclosure(false);
  const { data: categories, isLoading } = useCategories();

  const {files, errorMessage, handleUploadFiles, clearFiles, handleDeleteFile } = useUpload({
    accept: allowedFileTypes.IMAGE,
    maxSize: FILE_SIZES.IMAGE,
    maxFiles: 1,
  });

  const updateCategory = useUpdateCategory();
  const uploadCategoryImage = useUploadCategoryImage();

  const currentCategory = categories?.find((category) => category.slug === categorySlug);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema) as unknown as Resolver<CategoryFormData>,
  });
  
  const onUpload = async(files: File[]) => {
    handleUploadFiles(files);
  }
  
  const onSubmitFiles = async() => {
    try {
      if (!files.length) return;
      
      await uploadCategoryImage.mutateAsync({
        slug: categorySlug,
        file: files[0] as File,
      })

      setImageError(null)
    } catch (error) {
      toast.error("Error", getErrorMessage(error));
    } finally {
      handleClose();
      clearFiles();
    }
  }

  useEffect(() => {
    if (currentCategory) {
      reset({
        name: currentCategory.name,
        description: currentCategory.description ?? '',
        slug: currentCategory.slug ?? '',
        parentId: currentCategory.parentId ?? '',
        isActive: currentCategory.isActive,
        image: currentCategory.image ?? undefined,
        displayOrder: currentCategory.displayOrder ?? undefined,
      });
    }
  }, [currentCategory, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    const currentImage = isDeletingImage ? "" : currentCategory?.image || undefined;

    try {
      await updateCategory.mutateAsync({
        slug: categorySlug,
        data: { ...data, parentId: data.parentId || undefined, image: currentImage },
      });
      toast.success('Actualizada', 'Categoría guardada correctamente');
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  if (isLoading) return <Loading className="py-20" />;

  if (!currentCategory) {
    return (
      <EmptyData href={ROUTES.BACKOFFICE.CATEGORIES}  />
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="flex items-center gap-4">
          <IconLinkButton href={ROUTES.BACKOFFICE.CATEGORIES} variant="primary">
            <ArrowLeft size={18} />
          </IconLinkButton>
        <h1 className="text-2xl font-bold text-gray-900">Editar categoría</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 rounded-xl bg-white p-6 shadow-sm">
        <div className='w-full'>
          { currentCategory.image && !editImage ?
            <div className="relative flex justify-start h-full mb-5 rounded-md">
              {uploadCategoryImage.isPending || updateCategory.isPending ? (
                <Skeleton className='h-37.5 w-full rounded-md' />
              ):( 
                <AppImage
                  alt="Category image"
                  height={150}
                  width={150}
                  src={typeof currentCategory.image === "string" ? currentCategory.image : ""}
                  className="rounded-md w-full h-32 object-cover"
                />
              )}

              <div className='absolute right-2 bottom-2 flex flex-end gap-2'>
                <IconButton type='button' variant='primary' onClick={handleOpen}>
                  <PencilIcon size={18} />
                </IconButton>

                <IconButton loading={updateCategory.isPending} variant='danger' onClick={() => setIsDeletingImage(true)}>
                  <Trash size={18} />
                </IconButton>
              </div>
            </div>
          :
            <div>
              <UploadButton 
                onUpload={ onUpload }
                accept={ allowedFileTypes.IMAGE }
                maxSize={ FILE_SIZES.IMAGE }
                maxFiles={ 1 }
                files={files}
                onCancel={handleClose}
                onClearFiles={clearFiles}
                onDeleteFile={handleDeleteFile}
                error={ imageError || errorMessage }
                loading={uploadCategoryImage.isPending}
                disabled={updateCategory.isPending}
                onSubmit={onSubmitFiles}
              >
                Cargar imagen
              </UploadButton>
            </div>
          }
        </div>

        <Input
          label="Nombre *"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
        label='Slug (URL amigable'
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
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

        <Input
          label='Posicionamiento *'
          type="number"
          error={errors.displayOrder?.message}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          {...register('displayOrder')}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Categoría padre</label>

          <select
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            {...register('parentId')}
          >
            <option value="">Sin categoría padre (raíz)</option>
            {categories
              ?.filter((c) => c.slug !== categorySlug)
              .map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

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
