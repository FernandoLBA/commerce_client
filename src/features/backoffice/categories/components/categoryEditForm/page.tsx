import { yupResolver } from '@hookform/resolvers/yup';
import { ArrowLeft, PencilIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm, type Resolver } from 'react-hook-form';

import { Button, IconButton, IconLinkButton, Input, Loading } from '@/components/ui';
import { UploadButton } from '@/components/ui/upload-button';
import { FILE_SIZES, ROUTES } from '@/constants';
import { useCategories, useDisclosure } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { toast } from '@/store';

import { useUpdateCategory, useUploadCategoryImage } from '../../hooks';
import { EmptyCategory } from './components';
import { categorySchema } from './schemas/category.schema';
import { CategoryFormData } from './types/category-form-data.interface';

export function CategoryEditForm({ categorySlug }: { categorySlug: string }) {
  const [imageError, setImageError] = useState<string | null>(null);
  const { isOpen: editImage, handleIsOpen: openEditImage, handleIsClose: closeEditImage } = useDisclosure(false)
  const { data: categories, isLoading } = useCategories();
  const updateCategory = useUpdateCategory();
  const uploadCategoryImage = useUploadCategoryImage();
  const router = useRouter();

  const currentCategory = categories?.find((category) => category.slug === categorySlug);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema) as unknown as Resolver<CategoryFormData>,
  });
  const handleUpload = async(files: File[]) => {
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
      closeEditImage()
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
    try {
      await updateCategory.mutateAsync({
        slug: categorySlug,
        data: { ...data, parentId: data.parentId || undefined, image: data.image || undefined },
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
      <EmptyCategory />
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
              <Image
                alt="Category image"
                height={150}
                width={150}
                src={typeof currentCategory.image === "string" ? currentCategory.image : ""}
                className="rounded-md w-full h-32 object-cover"
              />

              <IconButton variant='secondary' type='button' className='absolute right-2 bottom-2' onClick={openEditImage}>
                <PencilIcon size={18} />
              </IconButton>
            </div>
          :
            <div>
              <UploadButton 
                onUpload={ handleUpload }
                accept='image/jpeg, image/png'
                multiple={ false }
                maxSize={ FILE_SIZES.IMAGE }
                maxFiles={ 1 }
                showPreview={ true }
                variant={ imageError ? 'danger' : 'primary' }
                onError={ setImageError }
                loading={uploadCategoryImage.isPending}
                disabled={uploadCategoryImage.isPending}
              >
                Cargar imagen
              </UploadButton>
              {imageError && <p className="mt-1 text-sm text-red-600">{imageError}</p>}
            </div>
          }

        </div>

        <Input
          label="Nombre *"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
        label='Slug'
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
