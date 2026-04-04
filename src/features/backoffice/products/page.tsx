import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { Button, Input, Loading } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useAdminProducts, useDeleteProduct, useUpdateProduct } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { cn, formatCurrency } from '@/lib/utils';
import { toast } from '@/store';

export default function FeatureBackofficeProductsPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);

  const { data, isLoading, isError, error } = useAdminProducts({
    search: search || undefined,
    page,
    limit: 15,
    isActive: isActiveFilter,
  });

  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar el producto "${name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteProduct.mutateAsync(id);
      toast.success('Eliminado', `"${name}" fue eliminado correctamente`);
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  const handleToggleActive = async (slug: string, currentState: boolean) => {
    try {
      await updateProduct.mutateAsync({ slug, data: { isActive: !currentState } });
      toast.success('Actualizado', `Producto ${!currentState ? 'activado' : 'desactivado'}`);
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
        <Link href={ROUTES.BACKOFFICE.PRODUCT_NEW}>
          <Button variant="primary" size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Nuevo producto
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <select
          value={isActiveFilter === undefined ? '' : String(isActiveFilter)}
          onChange={(e) => {
            setIsActiveFilter(e.target.value === '' ? undefined : e.target.value === 'true');
            setPage(1);
          }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Todos los estados</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-sm">
        {isLoading ? (
          <Loading className="py-20" />
        ) : isError ? (
          <div className="py-16 text-center">
            <p className="text-sm font-medium text-red-600">Error al cargar productos</p>
            <p className="mt-1 text-xs text-gray-500">{getErrorMessage(error)}</p>
          </div>
        ) : !data?.data?.length ? (
          <p className="py-16 text-center text-sm text-gray-500">No se encontraron productos</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">Nombre</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Categoría</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-right">Precio</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-right hidden sm:table-cell">Stock</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-center">Estado</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.data.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      <Link
                        href={ROUTES.BACKOFFICE.PRODUCT_EDIT(product.slug)}
                        className="hover:text-primary-600 hover:underline"
                      >
                        {product.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {product.category?.name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-4 py-3 text-right hidden sm:table-cell">
                      <span
                        className={cn(
                          'font-medium',
                          product.stock === 0 && 'text-red-600',
                          product.stock <= 5 && product.stock > 0 && 'text-yellow-600'
                        )}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleActive(product.slug, product.isActive)}
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-75',
                          product.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-500'
                        )}
                      >
                        {product.isActive ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={ROUTES.BACKOFFICE.PRODUCT_EDIT(product.slug)}>
                          <Button variant="ghost" size="icon" aria-label="Editar">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.slug, product.name)}
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

        {/* Pagination */}
        {data && data?.meta?.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
            <p className="text-sm text-gray-500">
              {data.meta.total} productos · página {data.meta.page} de {data.meta.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!data.meta.hasPrevPage}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!data.meta.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
