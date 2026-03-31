'use client';

import { Button } from '@/components/ui';
import { APP_CONFIG, ROUTES } from '@/constants';
import { useCart } from '@/hooks';
import { cn } from '@/lib/utils';
import { useAuthStore, useUIStore } from '@/store';
import {
  Heart,
  LogOut,
  MapPin,
  Menu,
  Package,
  Search,
  Settings,
  ShoppingCart,
  User,
  X,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { logo } from '../../../public/images';

const NAV_LINKS = [
  { href: ROUTES.HOME, label: 'Inicio' },
  { href: ROUTES.SHOP.PRODUCTS, label: 'Productos' },
];

const ACCOUNT_LINKS = [
  { name: 'Mi Perfil', href: ROUTES.USER.PROFILE, icon: User },
  { name: 'Mis Pedidos', href: ROUTES.USER.ORDERS, icon: Package },
  { name: 'Direcciones', href: ROUTES.USER.ADDRESSES, icon: MapPin },
  { name: 'Lista de Deseos', href: ROUTES.USER.WISHLIST, icon: Heart },
  { name: 'Configuración', href: '/account/settings', icon: Settings },
];

/**
 * Main navigation header
 */
export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, clearAuth } = useAuthStore();
  const { data: cart } = useCart();
  const cartItemCount = cart?.itemCount ?? 0;
  const { isMobileMenuOpen, toggleMobileMenu, openSearch } = useUIStore();

  const handleLogout = () => {
    clearAuth();
    toggleMobileMenu();
    router.push(ROUTES.HOME);
  };

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={ROUTES.HOME} className="text-xl font-bold text-primary-600">
            <Image src={logo} alt="Logo" className="h-50 w-auto mr-2" />
              {/* {APP_CONFIG.NAME} */}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-8">
            {NAV_LINKS.map((link) => (
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
              <Link href={ROUTES.USER.WISHLIST} className="hidden sm:block">
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
                  <span className={`absolute -right-1 -top-1 flex ${cartItemCount > 99 ? 'text-[8px]' : 'text-xs'} h-5 w-5 items-center justify-center rounded-full bg-primary-600 font-bold text-white`}>
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* User - Desktop only */}
            {isAuthenticated ? (
              <Link href={ROUTES.USER.PROFILE} className="hidden md:block">
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
            <div className="flex flex-col gap-1">
              {/* Main navigation */}
              <div className="mb-2">
                <span className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Navegación
                </span>
              </div>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                  onClick={toggleMobileMenu}
                >
                  {link.label}
                </Link>
              ))}

              {/* Divider */}
              <div className="my-3 border-t border-gray-200" />

              {/* Account section */}
              {isAuthenticated ? (
                <>
                  <div className="mb-2">
                    <span className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Mi Cuenta
                    </span>
                  </div>
                  {ACCOUNT_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-700 hover:bg-gray-50'
                        )}
                        onClick={toggleMobileMenu}
                      >
                        <link.icon className="h-5 w-5" />
                        {link.name}
                      </Link>
                    );
                  })}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    Cerrar Sesión
                  </button>
                </>
              ) : (
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
