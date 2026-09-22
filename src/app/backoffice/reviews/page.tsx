'use client';

import { useState } from 'react';
import { Search, Check, Trash2 } from 'lucide-react';
import { Button, Input, Loading, Rating } from '@/components/ui';
import { useAdminReviews, useApproveReview, useAdminDeleteReview } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { cn, formatDate } from '@/lib/utils';
import { toast } from '@/store';

export default function BackofficeReviewsPage() {
  const [search, setSearch] = useState('');
  const [approvedFilter, setApprovedFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminReviews({
    search: search || undefined,
    isApproved: approvedFilter === '' ? undefined : approvedFilter === 'true',
    page,
    limit: 15,
  });

  const approveReview = useApproveReview();
  const deleteReview = useAdminDeleteReview();

  const handleApprove = async (id: string) => {
    try {
      await approveReview.mutateAsync(id);
      toast.success('Aprobada', 'Reseña aprobada correctamente');
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta reseña? Esta acción no se puede deshacer.')) return;
    try {
      await deleteReview.mutateAsync(id);
      toast.success('Eliminada', 'Reseña eliminada correctamente');
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reseñas</h1>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar reseñas..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <select
          value={approvedFilter}
          onChange={(e) => { setApprovedFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Todas</option>
          <option value="true">Aprobadas</option>
          <option value="false">Pendientes</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-sm">
        {isLoading ? (
          <Loading className="py-20" />
        ) : !data?.data.length ? (
          <p className="py-16 text-center text-sm text-gray-500">No se encontraron reseñas</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {data.data.map((review) => (
              <div key={review.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between hover:bg-gray-50">
                <div className="flex-1 space-y-1">
                  {/* Rating & title */}
                  <div className="flex items-center gap-2">
                    <Rating value={review.rating} size="sm" />
                    {review.title && (
                      <span className="text-sm font-medium text-gray-900">{review.title}</span>
                    )}
                  </div>
                  {/* Comment */}
                  {review.comment && (
                    <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                  )}
                  {/* Meta */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                    {review.user && (
                      <span>
                        {review.user.firstName && review.user.lastName
                          ? `${review.user.firstName} ${review.user.lastName}`
                          : 'Usuario'}
                      </span>
                    )}
                    {review.product && (
                      <span className="text-primary-600">{review.product.name}</span>
                    )}
                    <span>{formatDate(review.createdAt, { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    {review.isVerifiedPurchase && (
                      <span className="text-green-600">✓ Compra verificada</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium',
                      review.isApproved
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    )}
                  >
                    {review.isApproved ? 'Aprobada' : 'Pendiente'}
                  </span>
                  {!review.isApproved && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleApprove(review.id)}
                      aria-label="Aprobar reseña"
                      className="text-green-600 hover:bg-green-50"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(review.id)}
                    aria-label="Eliminar reseña"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
            <p className="text-sm text-gray-500">
              {data.meta.total} reseñas · página {data.meta.page} de {data.meta.totalPages}
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
