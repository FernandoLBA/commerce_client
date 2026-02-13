'use client';

import { ArrowRight, CreditCard, Headphones, Shield, Truck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { Rating } from '@/components/ui/rating';
import { ROUTES } from '@/constants/ui';
import { useCategories, useProducts } from '@/hooks/api';
import { calculateDiscountPercentage, formatCurrency } from '@/lib/utils';
import type { Category, Product } from '@/types';

const HERO_CONTENT = {
  title: 'Descubre productos increíbles',
  subtitle: 'Explora nuestra colección de productos de alta calidad con los mejores precios del mercado',
  cta: 'Ver productos',
};

const FEATURES = [
  {
    icon: Truck,
    title: 'Envío Gratis',
    description: 'En pedidos mayores a $50',
  },
  {
    icon: Shield,
    title: 'Compra Segura',
    description: 'Protección garantizada',
  },
  {
    icon: CreditCard,
    title: 'Pagos Flexibles',
    description: 'Múltiples métodos de pago',
  },
  {
    icon: Headphones,
    title: 'Soporte 24/7',
    description: 'Atención al cliente',
  },
] as const;

const FEATURED_PRODUCTS_LIMIT = 8;
const CATEGORIES_LIMIT = 6;

export default function HomePage() {
  const { data: productsData, isLoading: productsLoading } = useProducts({
    limit: FEATURED_PRODUCTS_LIMIT,
    isActive: true,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useCategories();

  const products: Product[] = productsData ?? [];
  const categories: Category[] = categoriesData?.slice(0, CATEGORIES_LIMIT) ?? [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {HERO_CONTENT.title}
            </h1>
            <p className="mb-10 text-lg text-primary-100 sm:text-xl">
              {HERO_CONTENT.subtitle}
            </p>
            <Link href={ROUTES.SHOP.PRODUCTS}>
              <Button size="lg" variant="secondary" className="group">
                {HERO_CONTENT.cta}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative shapes */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full"
          >
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-4 rounded-xl bg-gray-50 p-6 transition-colors hover:bg-gray-100"
              >
                <div className="rounded-lg bg-primary-100 p-3 text-primary-600">
                  <feature.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Categorías
              </h2>
              <p className="mt-2 text-gray-600">
                Explora nuestras categorías más populares
              </p>
            </div>
            <Link href={ROUTES.SHOP.PRODUCTS} className="hidden sm:block">
              <Button variant="outline">
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {categoriesLoading ? (
            <div className="flex justify-center py-12">
              <Loading />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {categories.map((category: Category) => (
                <Link
                  key={category.id}
                  href={`${ROUTES.SHOP.PRODUCTS}?categoryId=${category.id}`}
                  className="group"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-linear-to-br from-primary-100 to-primary-200">
                        <span className="text-4xl font-bold text-primary-600">
                          {category.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-semibold text-white">{category.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6 text-center sm:hidden">
            <Link href={ROUTES.SHOP.PRODUCTS}>
              <Button variant="outline">
                Ver todas las categorías
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                Productos Destacados
              </h2>
              <p className="mt-2 text-gray-600">
                Los productos más populares de nuestra tienda
              </p>
            </div>
            <Link href={ROUTES.SHOP.PRODUCTS} className="hidden sm:block">
              <Button variant="outline">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          {productsLoading ? (
            <div className="flex justify-center py-12">
              <Loading />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product: Product) => {
                const hasDiscount =
                  product.compareAtPrice &&
                  product.compareAtPrice > product.price;
                const discountPercentage = hasDiscount
                  ? calculateDiscountPercentage(
                      product.compareAtPrice!,
                      product.price
                    )
                  : 0;

                return (
                  <Link key={product.id} href={`${ROUTES.SHOP.PRODUCTS}/${product.id}`}>
                    <div className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md">
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        {product.images && product.images.length > 0 && product.images[0] ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.images[0].alt ?? product.name}
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
                      </div>

                      <div className="p-4">
                        <h3 className="mb-1 line-clamp-2 font-medium text-gray-900 group-hover:text-primary-600">
                          {product.name}
                        </h3>

                        {product.averageRating !== undefined &&
                          product.averageRating > 0 && (
                            <div className="mb-2 flex items-center gap-2">
                              <Rating value={product.averageRating} />
                              <span className="text-sm text-gray-500">
                                ({product.reviewCount || 0})
                              </span>
                            </div>
                          )}

                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-primary-600">
                            {formatCurrency(product.price)}
                          </span>
                          {hasDiscount && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatCurrency(product.compareAtPrice!)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center sm:hidden">
            <Link href={ROUTES.SHOP.PRODUCTS}>
              <Button variant="outline">
                Ver todos los productos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
            ¿Listo para comprar?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-primary-100">
            Únete a miles de clientes satisfechos y descubre por qué somos la
            mejor opción para tus compras en línea.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href={ROUTES.SHOP.PRODUCTS}>
              <Button variant="secondary" size="lg">
                Explorar productos
              </Button>
            </Link>
            <Link href={ROUTES.AUTH.REGISTER}>
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-primary-600"
              >
                Crear cuenta
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
