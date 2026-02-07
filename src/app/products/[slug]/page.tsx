'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, Minus, Plus, Check } from 'lucide-react';
import { Button, Badge, Rating, Loading } from '@/components/ui';
import { useProductBySlug, useAddToCart, useAddToWishlist } from '@/hooks';
import { formatCurrency, calculateDiscountPercentage, cn } from '@/lib/utils';
import { APP_CONFIG } from '@/constants';
import { toast } from '@/store';
import { getErrorMessage } from '@/lib/api';
import type { ProductVariant } from '@/types';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const { data: product, isLoading } = useProductBySlug(resolvedParams.slug);
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return <Loading message="Cargando producto..." className="py-20" />;
  }

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Producto no encontrado</h1>
      </div>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const comparePrice = selectedVariant
    ? selectedVariant.compareAtPrice
    : product.compareAtPrice;
  const stock = selectedVariant ? selectedVariant.stock : product.stock;
  const discount = comparePrice
    ? calculateDiscountPercentage(comparePrice, currentPrice)
    : 0;

  const handleAddToCart = async () => {
    try {
      await addToCart.mutateAsync({
        productId: product.id,
        variantId: selectedVariant?.id,
        quantity,
      });
      toast.success('¡Agregado!', 'Producto agregado al carrito');
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist.mutateAsync({
        productId: product.id,
        variantId: selectedVariant?.id,
      });
      toast.success('¡Agregado!', 'Producto agregado a tu lista de deseos');
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  const incrementQuantity = () => {
    if (quantity < Math.min(stock, APP_CONFIG.MAX_CART_ITEM_QUANTITY)) {
      setQuantity((q) => q + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > APP_CONFIG.MIN_CART_ITEM_QUANTITY) {
      setQuantity((q) => q - 1);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div className="space-y-4">
          {/* Main image */}
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
            {product.images?.[selectedImage] ? (
              <Image
                src={product.images[selectedImage].url}
                alt={product.images[selectedImage].alt ?? product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}
            {discount > 0 && (
              <Badge variant="error" className="absolute left-4 top-4 text-lg font-bold">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    'relative h-20 w-20 shrink-0 overflow-hidden rounded-md border-2',
                    selectedImage === index
                      ? 'border-primary-600'
                      : 'border-transparent hover:border-gray-300'
                  )}
                >
                  <Image
                    src={image.url}
                    alt={image.alt ?? `${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-6">
          {/* Category */}
          {product.category && (
            <p className="text-sm text-primary-600">{product.category.name}</p>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

          {/* Rating */}
          {product.rating && (
            <Rating
              value={product.rating.average}
              showValue
              reviewCount={product.rating.count}
            />
          )}

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-gray-900">
              {formatCurrency(currentPrice)}
            </span>
            {comparePrice && (
              <span className="text-xl text-gray-500 line-through">
                {formatCurrency(comparePrice)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.shortDescription && (
            <p className="text-gray-600">{product.shortDescription}</p>
          )}

          {/* Variants */}
          {product.hasVariants && product.variants && product.variants.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-900">Variantes</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.stock <= 0}
                    className={cn(
                      'rounded-md border px-4 py-2 text-sm font-medium transition-colors',
                      selectedVariant?.id === variant.id
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : variant.stock <= 0
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'border-gray-300 hover:border-gray-400'
                    )}
                  >
                    {variant.sku}
                    {selectedVariant?.id === variant.id && (
                      <Check className="ml-1 inline h-4 w-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-medium text-gray-900">Cantidad</h3>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center rounded-lg border border-gray-300">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= APP_CONFIG.MIN_CART_ITEM_QUANTITY}
                  className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  aria-label="Disminuir cantidad"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= Math.min(stock, APP_CONFIG.MAX_CART_ITEM_QUANTITY)}
                  className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                  aria-label="Aumentar cantidad"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-sm text-gray-500">
                {stock > 0 ? `${stock} disponibles` : 'Sin stock'}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={stock <= 0 || addToCart.isPending}
              isLoading={addToCart.isPending}
              leftIcon={<ShoppingCart className="h-5 w-5" />}
            >
              Agregar al carrito
            </Button>
            {APP_CONFIG.FEATURES.WISHLIST_ENABLED && (
              <Button
                variant="outline"
                size="lg"
                onClick={handleAddToWishlist}
                disabled={addToWishlist.isPending}
                isLoading={addToWishlist.isPending}
                aria-label="Agregar a lista de deseos"
              >
                <Heart className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Full description */}
          {product.description && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">Descripción</h3>
              <div className="prose prose-sm mt-4 text-gray-600">
                {product.description}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
