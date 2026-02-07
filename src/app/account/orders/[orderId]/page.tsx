'use client';

import {
  CheckCircle,
  ChevronLeft,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Truck,
  XCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading';
import { OrderStatus } from '@/constants/enums';
import { ORDER_STATUS_CONFIG, ROUTES } from '@/constants/ui';
import { useOrder } from '@/hooks/api';
import { formatCurrency, formatDate } from '@/lib/utils';

interface OrderDetailPageProps {
  params: Promise<{ orderId: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = use(params);
  const { data: order, isLoading, error } = useOrder(orderId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <Skeleton className="mb-4 h-6 w-64" />
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-xl bg-white p-6 text-center shadow-sm">
        <XCircle className="mx-auto h-16 w-16 text-red-400" />
        <h2 className="mt-4 text-lg font-medium text-gray-900">
          Pedido no encontrado
        </h2>
        <p className="mt-2 text-gray-600">
          El pedido que buscas no existe o no tienes acceso
        </p>
        <Link href={ROUTES.USER.ORDERS} className="mt-6 inline-block">
          <Button>Ver mis pedidos</Button>
        </Link>
      </div>
    );
  }

  const statusConfig = ORDER_STATUS_CONFIG[order.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href={ROUTES.USER.ORDERS}
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600"
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Volver a mis pedidos
        </Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              Pedido #{order.orderNumber || order.id.slice(0, 8)}
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Realizado el {formatDate(order.createdAt)}
            </p>
          </div>
          <Badge className={`text-sm ${statusConfig.color}`}>
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      {/* Order Timeline */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-900">Estado del pedido</h2>
        <OrderTimeline status={order.status} />
      </div>

      {/* Order Items */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-900">
          Productos ({order.items?.length ?? 0})
        </h2>
        <div className="divide-y divide-gray-200">
          {order.items?.map((item) => (
            <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                {item.product?.images?.[0] ? (
                  <Image
                    src={item.product.images[0].url}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="flex-1">
                <Link
                  href={ROUTES.SHOP.PRODUCT_DETAIL(item.product?.slug || item.productId)}
                  className="font-medium text-gray-900 hover:text-primary-600"
                >
                  {item.productName || item.product?.name || 'Producto'}
                </Link>
                {item.variant && (
                  <p className="mt-1 text-sm text-gray-500">
                    Variante: {item.variant.sku}
                  </p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Cantidad: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  {formatCurrency(item.subtotal)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatCurrency(item.unitPrice)} c/u
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary & Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Shipping Info */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <MapPin className="h-5 w-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Dirección de envío</h2>
          </div>
          {order.shippingAddress ? (
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900">
                {order.shippingAddress.recipientName}
              </p>
              <p>{order.shippingAddress.street} {order.shippingAddress.number}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.department}{' '}
                {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.district}</p>
              {order.shippingAddress.phone && (
                <p className="mt-2">{order.shippingAddress.phone}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Información no disponible</p>
          )}
        </div>

        {/* Payment Info */}
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-gray-600" />
            <h2 className="font-semibold text-gray-900">Información de pago</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Método</span>
              <span className="font-medium text-gray-900">
                {order.payments?.[0]?.method || 'N/A'}
              </span>
            </div>
            {order.payments?.[0] && (
              <div className="flex justify-between">
                <span className="text-gray-600">Estado</span>
                <span className="font-medium text-gray-900">
                  {order.payments[0].status}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Total */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-semibold text-gray-900">Resumen</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">{formatCurrency(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Envío</span>
            <span className="text-gray-900">
              {parseFloat(order.shippingCost) === 0
                ? 'Gratis'
                : formatCurrency(order.shippingCost)}
            </span>
          </div>
          {parseFloat(order.discount) > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Descuento</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-semibold">
            <span className="text-gray-900">Total</span>
            <span className="text-primary-600">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface OrderTimelineProps {
  status: OrderStatus;
}

const TIMELINE_STEPS = [
  { status: OrderStatus.PENDING, label: 'Pedido recibido', icon: Clock },
  { status: OrderStatus.PROCESSING, label: 'En preparación', icon: Package },
  { status: OrderStatus.SHIPPED, label: 'Enviado', icon: Truck },
  { status: OrderStatus.DELIVERED, label: 'Entregado', icon: CheckCircle },
] as const;

function OrderTimeline({ status }: OrderTimelineProps) {
  const currentIndex = TIMELINE_STEPS.findIndex((step) => step.status === status);
  const isCancelled = status === OrderStatus.CANCELLED;

  if (isCancelled) {
    return (
      <div className="flex items-center gap-4 rounded-lg bg-red-50 p-4 text-red-600">
        <XCircle className="h-8 w-8" />
        <div>
          <p className="font-medium">Pedido cancelado</p>
          <p className="text-sm">Este pedido ha sido cancelado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      {TIMELINE_STEPS.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step.status} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  isCompleted
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                } ${isCurrent ? 'ring-4 ring-primary-100' : ''}`}
              >
                <step.icon className="h-5 w-5" />
              </div>
              <span
                className={`mt-2 text-xs font-medium ${
                  isCompleted ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < TIMELINE_STEPS.length - 1 && (
              <div
                className={`mx-2 h-1 flex-1 rounded ${
                  index < currentIndex ? 'bg-primary-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
