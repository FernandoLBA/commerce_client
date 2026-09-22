'use client';

import {
  Heart,
  LogOut,
  MapPin,
  Package,
  Settings,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { Loading } from '@/components/ui/loading';
import { ROUTES } from '@/constants/ui';
import { useAuthStore, useAuthHydrated } from '@/store/auth';

const ACCOUNT_NAVIGATION = [
  { name: 'Mi Perfil', href: ROUTES.USER.PROFILE, icon: User },
  { name: 'Mis Pedidos', href: ROUTES.USER.ORDERS, icon: Package },
  { name: 'Direcciones', href: ROUTES.USER.ADDRESSES, icon: MapPin },
  { name: 'Lista de Deseos', href: ROUTES.USER.WISHLIST, icon: Heart },
  { name: 'Configuración', href: '/account/settings', icon: Settings },
] as const;

interface AccountLayoutProps {
  children: React.ReactNode;
}

export default function AccountLayout({ children }: AccountLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const hasHydrated = useAuthHydrated();

  useEffect(() => {
    // Only redirect after hydration is complete and user is definitely not authenticated
    if (hasHydrated && !isAuthenticated) {
      router.replace(`${ROUTES.AUTH.LOGIN}?redirect=${pathname}`);
    }
  }, [hasHydrated, isAuthenticated, router, pathname]);

  const handleLogout = () => {
    clearAuth();
    router.push(ROUTES.HOME);
  };

  // Show loading while hydrating OR while not authenticated (before redirect)
  if (!hasHydrated || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 lg:py-8">
        {/* Header - visible on all screens */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Mi Cuenta
          </h1>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">
            Bienvenido, {user?.firstName || user?.email}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Desktop Sidebar navigation - hidden on mobile */}
          <aside className="hidden lg:col-span-1 lg:block">
            <nav className="sticky top-24 rounded-xl bg-white p-4 shadow-sm">
              <ul className="space-y-1">
                {ACCOUNT_NAVIGATION.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                          isActive
                            ? 'bg-primary-50 text-primary-600'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-5 w-5" />
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main content */}
          <main className="lg:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
