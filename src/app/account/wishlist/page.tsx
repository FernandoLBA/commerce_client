'use client';

import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/loading';
import { Rating } from '@/components/ui/rating';
import { ROUTES } from '@/constants/ui';
import { useAddToCart, useRemoveFromWishlist, useWishlist } from '@/hooks/api';
import { calculateDiscountPercentage, formatCurrency } from '@/lib/utils';
import { useUIStore } from '@/store';

export default function WishlistPage() {
  const { addToast } = useUIStore();
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [addingToCartIds, setAddingToCartIds] = useState<Set<string>>(new Set());

  const { data: wishlist, isLoading } = useWishlist();
  const removeFromWishlistMutation = useRemoveFromWishlist();
  const addToCartMutation = useAddToCart();

  const handleRemove = async (itemId: string) => {
    setRemovingIds((prev) => new Set(prev).add(itemId));
    try {
      await removeFromWishlistMutation.mutateAsync(itemId);
      addToast({
        type: 'success',
        title: 'Éxito',
        message: 'Producto eliminado de la lista de deseos',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al eliminar el producto',
      });
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  const handleAddToCart = async (productId: string, variantId?: string, itemId?: string) => {
    if (!itemId) return;
    setAddingToCartIds((prev) => new Set(prev).add(itemId));
    try {
      await addToCartMutation.mutateAsync({
        productId,
        variantId,
        quantity: 1,
      });
      addToast({
        type: 'success',
        title: 'Éxito',
        message: 'Producto agregado al carrito',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al agregar al carrito',
      });
    } finally {
      setAddingToCartIds((prev) => {
        const next = new Set(prev);
        next.delete(itemId);
        return next;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <Skeleton className="mb-6 h-8 w-48" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const items = wishlist ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Lista de Deseos
          </h2>
          {items.length > 0 && (
            <span className="text-sm text-gray-500">
              {items.length} {items.length === 1 ? 'producto' : 'productos'}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-12 text-center">
            <Heart className="mx-auto h-16 w-16 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Tu lista de deseos está vacía
            </h3>
            <p className="mt-2 text-gray-600">
              Guarda los productos que te gustan para comprarlos más tarde
            </p>
            <Link href={ROUTES.SHOP.PRODUCTS} className="mt-6 inline-block">
              <Button>Explorar productos</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;

              const hasDiscount =
                product.compareAtPrice &&
                product.compareAtPrice > product.price;
              const discountPercentage = hasDiscount
                ? calculateDiscountPercentage(
                    product.compareAtPrice!,
                    product.price
                  )
                : 0;
              const isOutOfStock = (product.stock ?? 0) <= 0;
              const isRemoving = removingIds.has(item.id);
              const isAddingToCart = addingToCartIds.has(item.id);

              return (
                <div
                  key={item.id}
                  className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
                >
                  <Link href={ROUTES.SHOP.PRODUCT_DETAIL(product.slug)}>
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      {product.images && product.images.length > 0 && product.images[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].alt || product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center bg-gray-200">
                          <span className="text-gray-400">Sin imagen</span>
                        </div>
                      )}

                      {hasDiscount && (
                        <Badge
                          variant="error"
                          className="absolute left-3 top-3"
                        >
                          -{discountPercentage}%
                        </Badge>
                      )}

                      {isOutOfStock && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <span className="rounded bg-white px-3 py-1 text-sm font-medium text-gray-900">
                            Agotado
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <Link href={ROUTES.SHOP.PRODUCT_DETAIL(product.slug)}>
                      <h3 className="mb-1 line-clamp-2 font-medium text-gray-900 group-hover:text-primary-600">
                        {product.name}
                      </h3>
                    </Link>

                    {product.averageRating !== undefined &&
                      product.averageRating > 0 && (
                        <div className="mb-2 flex items-center gap-2">
                          <Rating value={product.averageRating} size="sm" />
                          <span className="text-xs text-gray-500">
                            ({product.reviewCount || 0})
                          </span>
                        </div>
                      )}

                    <div className="mb-4 flex items-center gap-2">
                      <span className="text-lg font-bold text-primary-600">
                        {formatCurrency(product.price)}
                      </span>
                      {hasDiscount && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatCurrency(product.compareAtPrice!)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1"
                        disabled={isOutOfStock || isAddingToCart}
                        isLoading={isAddingToCart}
                        onClick={() =>
                          handleAddToCart(product.id, undefined, item.id)
                        }
                      >
                        <ShoppingCart className="mr-1 h-4 w-4" />
                        {isOutOfStock ? 'Agotado' : 'Agregar'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemove(item.id)}
                        isLoading={isRemoving}
                        className="text-red-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
