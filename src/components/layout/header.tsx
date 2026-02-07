'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingCart,
  Heart,
  User,
  Search,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_CONFIG, ROUTES } from '@/constants';
import { useAuthStore, useCartItemCount, useUIStore } from '@/store';
import { Button } from '@/components/ui';

/**
 * Main navigation header
 */
export function Header() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const cartItemCount = useCartItemCount();
  const { isMobileMenuOpen, toggleMobileMenu, openSearch } = useUIStore();

  const navLinks = [
    { href: ROUTES.HOME, label: 'Inicio' },
    { href: ROUTES.SHOP.PRODUCTS, label: 'Productos' },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={ROUTES.HOME} className="text-xl font-bold text-primary-600">
              {APP_CONFIG.NAME}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-600',
                  pathname === link.href ? 'text-primary-600' : 'text-gray-700'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={openSearch}
              aria-label="Buscar"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            {isAuthenticated && APP_CONFIG.FEATURES.WISHLIST_ENABLED && (
              <Link href={ROUTES.USER.WISHLIST}>
                <Button variant="ghost" size="icon" aria-label="Lista de deseos">
                  <Heart className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link href={ROUTES.CHECKOUT.CART}>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Carrito"
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-xs font-medium text-white">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User */}
            {isAuthenticated ? (
              <Link href={ROUTES.USER.PROFILE}>
                <Button variant="ghost" size="icon" aria-label="Mi cuenta">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href={ROUTES.AUTH.LOGIN} className="hidden sm:block">
                <Button variant="primary" size="sm">
                  Iniciar sesión
                </Button>
              </Link>
            )}

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              className="md:hidden"
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="border-t border-gray-200 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                  onClick={toggleMobileMenu}
                >
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link href={ROUTES.AUTH.LOGIN} onClick={toggleMobileMenu}>
                  <Button variant="primary" className="w-full">
                    Iniciar sesión
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
