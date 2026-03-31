'use client';

import { useParams } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Link from 'next/link';
import { Button, Input, Loading } from '@/components/ui';
import { useAdminOrder, useUpdateOrder } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { toast } from '@/store';
import { ORDER_STATUS_CONFIG, OrderStatus, ROUTES } from '@/constants';

const STATUS_OPTIONS = Object.values(OrderStatus);

const updateOrderSchema = yup.object({
  status: yup.string().oneOf(STATUS_OPTIONS).required('El estado es requerido'),
  adminNotes: yup.string().optional(),
  trackingNumber: yup.string().optional(),
  trackingUrl: yup.string().url('Ingresa una URL válida').optional(),
});

interface UpdateOrderFormData {
  status: string;
  adminNotes?: string;
  trackingNumber?: string;
  trackingUrl?: string;
}

export default function BackofficeOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useAdminOrder(id);
  const updateOrder = useUpdateOrder();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateOrderFormData>({
    resolver: yupResolver(updateOrderSchema) as unknown as Resolver<UpdateOrderFormData>,
    values: order
      ? {
          status: order.status,
          adminNotes: order.adminNotes ?? '',
          trackingNumber: order.trackingNumber ?? '',
          trackingUrl: order.trackingUrl ?? '',
        }
      : undefined,
  });

  const onSubmit = async (data: UpdateOrderFormData) => {
    try {
      await updateOrder.mutateAsync({
        id,
        data: {
          status: data.status as typeof OrderStatus[keyof typeof OrderStatus],
          adminNotes: data.adminNotes || undefined,
          trackingNumber: data.trackingNumber || undefined,
          trackingUrl: data.trackingUrl || undefined,
        },
      });
      toast.success('Actualizado', 'Pedido guardado correctamente');
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  if (isLoading) return <Loading className="py-20" />;
  if (!order) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Pedido no encontrado</p>
        <Link href={ROUTES.BACKOFFICE.ORDERS} className="mt-4 inline-block text-sm text-primary-600 hover:underline">
          ← Volver a pedidos
        </Link>
      </div>
    );
  }

  const statusCfg = ORDER_STATUS_CONFIG[order.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link href={ROUTES.BACKOFFICE.ORDERS} className="text-sm text-gray-500 hover:text-gray-700">
            ← Pedidos
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">#{order.orderNumber}</h1>
        </div>
        <span className={cn('self-start rounded-full px-3 py-1 text-sm font-medium sm:self-auto', statusCfg?.color)}>
          {statusCfg?.label}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-gray-700">Productos</h2>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-gray-900">{item.productName}</p>
                    {item.variantAttributes && Object.keys(item.variantAttributes).length > 0 && (
                      <p className="text-xs text-gray-500">
                        {Object.entries(item.variantAttributes)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ')}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">Cant: {item.quantity}</p>
                  </div>
                  <span className="font-medium">{formatCurrency(parseFloat(item.subtotal))}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 border-t border-gray-200 pt-4 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>{formatCurrency(parseFloat(order.subtotal))}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Envío</span>
                <span>{formatCurrency(parseFloat(order.shippingCost))}</span>
              </div>
              {parseFloat(order.discount) > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento</span>
                  <span>-{formatCurrency(parseFloat(order.discount))}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-gray-900">
                <span>Total</span>
                <span>{formatCurrency(parseFloat(order.total))}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-gray-700">Dirección de envío</h2>
            <address className="not-italic text-sm text-gray-600 space-y-0.5">
              <p className="font-medium text-gray-900">{order.shippingAddress.recipientName}</p>
              <p>{order.shippingAddress.phone}</p>
              <p>{order.shippingAddress.street} {order.shippingAddress.number}</p>
              {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
              <p>{order.shippingAddress.district}, {order.shippingAddress.city}</p>
              <p>{order.shippingAddress.department}</p>
            </address>
          </div>
        </div>

        {/* Admin panel */}
        <div className="space-y-4">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-base font-semibold text-gray-700">Info del pedido</h2>
            <p className="mb-4 text-xs text-gray-500">{formatDate(order.createdAt)}</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Estado *</label>
                <select
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  {...register('status')}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {ORDER_STATUS_CONFIG[s]?.label}
                    </option>
                  ))}
                </select>
                {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status.message}</p>}
              </div>
              <Input
                label="N° de seguimiento"
                placeholder="TRACK123456"
                error={errors.trackingNumber?.message}
                {...register('trackingNumber')}
              />
              <Input
                label="URL de seguimiento"
                placeholder="https://..."
                error={errors.trackingUrl?.message}
                {...register('trackingUrl')}
              />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Notas internas</label>
                <textarea
                  rows={3}
                  placeholder="Notas visibles solo para el equipo"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  {...register('adminNotes')}
                />
              </div>
              <Button variant="primary" type="submit" isLoading={isSubmitting} className="w-full">
                Guardar cambios
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
