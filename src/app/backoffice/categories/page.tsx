'use client';

import { ImageIcon, Pencil, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button, Loading } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useDeleteCategory, useUpdateCategory } from '@/features';
import { useCategories } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { cn } from '@/lib/utils';
import { toast } from '@/store';
import { Category } from '@/types';


export default function BackofficeCategoriesPage() {
  const { data: categories, isLoading } = useCategories();
  const deleteCategory = useDeleteCategory();
  const updateCategory = useUpdateCategory();

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`¿Eliminar la categoría "${name}"? Los productos asociados quedarán sin categoría.`)) return;
    try {
      await deleteCategory.mutateAsync(slug);
      toast.success('Eliminada', `"${name}" fue eliminada`);
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  const handleToggleActive = async (slug: string, currentState: boolean) => {
    try {
      await updateCategory.mutateAsync({ slug, data: { isActive: !currentState } });
      toast.success('Actualizada', `Categoría ${!currentState ? 'activada' : 'desactivada'}`);
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
        <Link href={ROUTES.BACKOFFICE.CATEGORY_NEW}>
          <Button variant="primary" size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Nueva categoría
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-sm">
        {isLoading ? (
          <Loading className="py-20" />
        ) : !categories?.length ? (
          <p className="py-16 text-center text-sm text-gray-500">No hay categorías</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">Imagen</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Nombre</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Categoría padre</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-center hidden md:table-cell">Orden</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-center">Estado</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {categories.map((category: Category) => (
                  <tr key={category.id} className="hover:bg-gray-50">
                    <td className='px-4 py-3'>
                      <Link
                      href={ROUTES.BACKOFFICE.CATEGORY_EDIT(category.slug)}
                      className="hover:text-primary-600 hover:underline"
                      >
                          {category?.image ? (
                            <Image 
                              src={category.image}
                              alt='Category'
                              width={60}
                              height={60}
                              className='rounded-md object-cover h-15 w-15'
                            />
                            ):(
                                <div className='flex items-center justify-center border-2 border-gray-400 text-gray-400 bg-gray-100 px-4 py-3 rounded-md h-15 w-15'>
                                <ImageIcon size={30} />
                              </div>
                            )
                          }
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <Link
                        href={ROUTES.BACKOFFICE.CATEGORY_EDIT(category.slug)}
                        className="hover:text-primary-600 hover:underline"
                      >
                        {category.name}
                      </Link>
                      {category.slug && (
                        <span className="ml-2 text-xs text-gray-400">/{category.slug}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                      {category.parent?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500 hidden md:table-cell">
                      {category.displayOrder}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleActive(category.id, category.isActive)}
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-75',
                          category.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        )}
                      >
                        {category.isActive ? 'Activa' : 'Inactiva'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={ROUTES.BACKOFFICE.CATEGORY_EDIT(category.slug)}>
                          <Button variant="ghost" size="icon" aria-label="Editar">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category.id, category.name)}
                          aria-label="Eliminar"
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
