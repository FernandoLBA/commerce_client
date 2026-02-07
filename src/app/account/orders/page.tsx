'use client';

import { ChevronRight, Package, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading';
import { OrderStatus } from '@/constants/enums';
import { ORDER_STATUS_CONFIG, ROUTES } from '@/constants/ui';
import { useOrders } from '@/hooks/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Order } from '@/types';

const STATUS_FILTERS = [
  { value: '', label: 'Todos' },
  { value: OrderStatus.PENDING, label: 'Pendientes' },
  { value: OrderStatus.PROCESSING, label: 'En proceso' },
  { value: OrderStatus.SHIPPED, label: 'Enviados' },
  { value: OrderStatus.DELIVERED, label: 'Entregados' },
  { value: OrderStatus.CANCELLED, label: 'Cancelados' },
] as const;

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: orders = [], isLoading } = useOrders({
    status: statusFilter as OrderStatus || undefined,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <Skeleton className="mb-6 h-8 w-48" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Mis Pedidos
        </h2>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => {
                  setStatusFilter(filter.value);
                }}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  statusFilter === filter.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pedido..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:w-64"
            />
          </div>
        </div>

        {/* Orders list */}
        {orders.length === 0 ? (
          <div className="py-12 text-center">
            <Package className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No tienes pedidos
            </h3>
            <p className="mt-2 text-gray-600">
              {statusFilter
                ? 'No hay pedidos con este estado'
                : 'Cuando realices tu primer pedido, aparecerá aquí'}
            </p>
            <Link href={ROUTES.SHOP.PRODUCTS} className="mt-6 inline-block">
              <Button>Explorar productos</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders
              .filter(
                (order: Order) =>
                  !searchQuery ||
                  order.orderNumber
                    ?.toLowerCase()
                    .includes(searchQuery.toLowerCase())
              )
              .map((order: Order) => (
                <OrderCard key={order.id} order={order} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface OrderCardProps {
  order: Order;
}

function OrderCard({ order }: OrderCardProps) {
  const statusConfig = ORDER_STATUS_CONFIG[order.status];

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-gray-500">Pedido</span>
            <p className="font-medium text-gray-900">
              #{order.orderNumber || order.id.slice(0, 8)}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Fecha</span>
            <p className="font-medium text-gray-900">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Total</span>
            <p className="font-medium text-gray-900">
              {formatCurrency(order.total)}
            </p>
          </div>
        </div>
        <Badge className={statusConfig.color}>{statusConfig.label}</Badge>
      </div>

      {/* Items preview */}
      <div className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-4">
            {order.items?.slice(0, 3).map((item, index) => (
              <div
                key={item.id}
                className="relative h-12 w-12 overflow-hidden rounded-lg border-2 border-white bg-gray-100"
                style={{ zIndex: 3 - index }}
              >
                {item.product?.images?.[0] ? (
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-gray-400">
                    N/A
                  </div>
                )}
              </div>
            ))}
            {(order.items?.length ?? 0) > 3 && (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-white bg-gray-200 text-xs font-medium text-gray-600">
                +{(order.items?.length ?? 0) - 3}
              </div>
            )}
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-600">
              {order.items?.length ?? 0}{' '}
              {(order.items?.length ?? 0) === 1 ? 'producto' : 'productos'}
            </p>
          </div>

          <Link href={ROUTES.USER.ORDER_DETAIL(order.id)}>
            <Button variant="ghost" size="sm">
              Ver detalles
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
