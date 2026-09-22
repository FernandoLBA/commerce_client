'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Button, Input, Loading } from '@/components/ui';
import { useAdminOrders } from '@/hooks';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { ORDER_STATUS_CONFIG, OrderStatus, ROUTES } from '@/constants';

const STATUS_OPTIONS = [
  { value: '', label: 'Todos los estados' },
  { value: OrderStatus.PENDING, label: 'Pendiente' },
  { value: OrderStatus.CONFIRMED, label: 'Confirmado' },
  { value: OrderStatus.PROCESSING, label: 'Procesando' },
  { value: OrderStatus.SHIPPED, label: 'Enviado' },
  { value: OrderStatus.DELIVERED, label: 'Entregado' },
  { value: OrderStatus.CANCELLED, label: 'Cancelado' },
  { value: OrderStatus.REFUNDED, label: 'Reembolsado' },
] as const;

export default function BackofficeOrdersPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminOrders({
    search: search || undefined,
    status: (statusFilter as typeof OrderStatus[keyof typeof OrderStatus]) || undefined,
    page,
    limit: 15,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pedidos</h1>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por N° de pedido o usuario..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-sm">
        {isLoading ? (
          <Loading className="py-20" />
        ) : !data?.data?.length ? (
          <p className="py-16 text-center text-sm text-gray-500">No se encontraron pedidos</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">N° Pedido</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Estado</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-right">Total</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden sm:table-cell">Fecha</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.data.map((order) => {
                  const cfg = ORDER_STATUS_CONFIG[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900">#{order.orderNumber}</span>
                        <div className="mt-0.5 flex md:hidden">
                          <span className={cn('inline-flex rounded-full px-2 py-0.5 text-xs font-medium', cfg?.color)}>
                            {cfg?.label}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', cfg?.color)}>
                          {cfg?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium">
                        {formatCurrency(parseFloat(order.total))}
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                        {formatDate(order.createdAt, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link href={ROUTES.BACKOFFICE.ORDER_DETAIL(order.id)}>
                          <Button variant="ghost" size="sm">Ver</Button>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data?.meta?.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
            <p className="text-sm text-gray-500">
              {data.meta.total} pedidos · página {data.meta.page} de {data.meta.totalPages}
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
