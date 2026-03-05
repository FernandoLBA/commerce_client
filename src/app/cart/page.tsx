'use client';

import { Button, Loading } from '@/components/ui';
import { APP_CONFIG, ROUTES } from '@/constants';
import { useCart, useClearCart, useRemoveCartItem, useUpdateCartItem } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { cn, formatCurrency } from '@/lib/utils';
import { toast } from '@/store';
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();

  const handleUpdateQuantity = async (itemId: string, quantity: number) => {
    try {
      await updateItem.mutateAsync({ itemId, data: { quantity } });
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeItem.mutateAsync(itemId);
      toast.success('Eliminado', 'Producto eliminado del carrito');
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      try {
        await clearCart.mutateAsync();
        toast.success('Carrito vacío', 'Se han eliminado todos los productos');
      } catch (error) {
        toast.error('Error', getErrorMessage(error));
      }
    }
  };

  if (isLoading) {
    return <Loading message="Cargando carrito..." className="py-20" />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Tu carrito está vacío
          </h1>
          <p className="mt-2 text-gray-600">
            Parece que aún no has agregado ningún producto
          </p>
          <Link href={ROUTES.SHOP.PRODUCTS} className="mt-6 inline-block">
            <Button size="lg">
              Ver productos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Carrito de compras</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearCart}
          disabled={clearCart.isPending}
          className="text-red-600 hover:text-red-700"
        >
          Vaciar carrito
        </Button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="divide-y divide-gray-200 rounded-lg border border-gray-200">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 sm:p-6">
                {/* Image */}
                <Link
                  href={ROUTES.SHOP.PRODUCT_DETAIL(item.product.id)}
                  className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md bg-gray-100 sm:h-32 sm:w-32"
                >
                  {item.product.images?.[0] ? (
                    <Image
                      src={item.product.images[0].url}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-gray-400">
                      Sin imagen
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <Link
                      href={ROUTES.SHOP.PRODUCT_DETAIL(item.product.id)}
                      className="font-medium text-gray-900 hover:text-primary-600"
                    >
                      {item.product.name}
                    </Link>
                    {item.variant && (
                      <p className="mt-1 text-sm text-gray-500">
                        {item.variant.sku}
                      </p>
                    )}
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    {/* Quantity controls */}
                    <div className="flex items-center rounded-md border border-gray-300">
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity - 1)
                        }
                        disabled={
                          item.quantity <= APP_CONFIG.MIN_CART_ITEM_QUANTITY ||
                          updateItem.isPending
                        }
                        className="p-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-50 sm:p-2"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-medium sm:w-10">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateQuantity(item.id, item.quantity + 1)
                        }
                        disabled={
                          item.quantity >= APP_CONFIG.MAX_CART_ITEM_QUANTITY ||
                          updateItem.isPending
                        }
                        className="p-1.5 text-gray-600 hover:text-gray-900 disabled:opacity-50 sm:p-2"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Price and remove */}
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(
                          parseFloat(
                            item.variant?.price.toString() ?? item.product.price.toString()
                          ) * item.quantity
                        )}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removeItem.isPending}
                        className={cn(
                          'text-gray-400 hover:text-red-600 transition-colors',
                          removeItem.isPending && 'opacity-50'
                        )}
                        aria-label="Eliminar producto"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="sticky top-24 rounded-lg border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Resumen del pedido
            </h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.itemCount} items)</span>
                <span>{formatCurrency(cart.total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="text-sm">Calculado al finalizar</span>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-semibold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(cart.total)}</span>
                </div>
              </div>
            </div>

            <Link href={ROUTES.CHECKOUT.CHECKOUT} className="mt-6 block">
              <Button
                size="lg"
                className="w-full"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Continuar al pago
              </Button>
            </Link>

            <Link
              href={ROUTES.SHOP.PRODUCTS}
              className="mt-4 block text-center text-sm text-primary-600 hover:text-primary-500"
            >
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
