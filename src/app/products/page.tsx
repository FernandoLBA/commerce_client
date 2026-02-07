'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Grid3X3, List, SlidersHorizontal } from 'lucide-react';
import { Button, ProductGridSkeleton, Badge } from '@/components/ui';
import { useProducts, useCategories } from '@/hooks';
import { formatCurrency, calculateDiscountPercentage, cn } from '@/lib/utils';
import { ROUTES } from '@/constants';

type ViewMode = 'grid' | 'list';

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: products, isLoading: productsLoading } = useProducts(
    selectedCategory ? { categoryId: selectedCategory } : undefined
  );
  const { data: categories } = useCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
        <p className="mt-2 text-gray-600">
          Explora nuestra colección de productos
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Categorías</h3>
              <ul className="mt-4 space-y-2">
                <li>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={cn(
                      'w-full text-left text-sm transition-colors',
                      !selectedCategory
                        ? 'font-medium text-primary-600'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    Todas las categorías
                  </button>
                </li>
                {categories?.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        'w-full text-left text-sm transition-colors',
                        selectedCategory === category.id
                          ? 'font-medium text-primary-600'
                          : 'text-gray-600 hover:text-gray-900'
                      )}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {products?.length ?? 0} productos encontrados
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' ? 'bg-gray-100' : ''}
                aria-label="Ver en grilla"
              >
                <Grid3X3 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-gray-100' : ''}
                aria-label="Ver en lista"
              >
                <List className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="sm" className="lg:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filtros
              </Button>
            </div>
          </div>

          {/* Products grid */}
          {productsLoading ? (
            <ProductGridSkeleton count={8} />
          ) : products && products.length > 0 ? (
            <div
              className={cn(
                viewMode === 'grid'
                  ? 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'
                  : 'space-y-4'
              )}
            >
              {products.map((product) => {
                const discount = product.compareAtPrice
                  ? calculateDiscountPercentage(product.compareAtPrice, product.price)
                  : 0;

                return (
                  <Link
                    key={product.id}
                    href={ROUTES.SHOP.PRODUCT_DETAIL(product.slug)}
                    className={cn(
                      'group overflow-hidden rounded-lg border border-gray-200 bg-white transition-shadow hover:shadow-md',
                      viewMode === 'list' ? 'flex' : ''
                    )}
                  >
                    {/* Image */}
                    <div
                      className={cn(
                        'relative bg-gray-100',
                        viewMode === 'grid' ? 'aspect-square' : 'h-40 w-40 shrink-0'
                      )}
                    >
                      {product.images?.[0] ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.images[0].alt ?? product.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-gray-400">
                          Sin imagen
                        </div>
                      )}
                      {discount > 0 && (
                        <Badge
                          variant="error"
                          className="absolute left-2 top-2 font-bold"
                        >
                          -{discount}%
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-primary-600">
                        {product.name}
                      </h3>
                      {viewMode === 'list' && product.shortDescription && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {product.shortDescription}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(product.price)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {formatCurrency(product.compareAtPrice)}
                          </span>
                        )}
                      </div>
                      {product.stock <= 0 && (
                        <Badge variant="error" className="mt-2">
                          Agotado
                        </Badge>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500">No se encontraron productos</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
