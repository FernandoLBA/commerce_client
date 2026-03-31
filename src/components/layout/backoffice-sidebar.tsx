'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  Star,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/constants';

const BACKOFFICE_NAV = [
  { name: 'Dashboard', href: ROUTES.BACKOFFICE.DASHBOARD, icon: LayoutDashboard, exact: true },
  { name: 'Productos', href: ROUTES.BACKOFFICE.PRODUCTS, icon: Package, exact: false },
  { name: 'Categorías', href: ROUTES.BACKOFFICE.CATEGORIES, icon: Tags, exact: false },
  { name: 'Pedidos', href: ROUTES.BACKOFFICE.ORDERS, icon: ShoppingBag, exact: false },
  { name: 'Usuarios', href: ROUTES.BACKOFFICE.USERS, icon: Users, exact: false },
  { name: 'Reseñas', href: ROUTES.BACKOFFICE.REVIEWS, icon: Star, exact: false },
] as const;

interface BackofficeSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function BackofficeSidebar({ isOpen = true, onClose }: BackofficeSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-gray-900 transition-transform duration-300 lg:static lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-700 px-6">
          <span className="text-lg font-bold text-white">Backoffice</span>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-800 hover:text-white lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {BACKOFFICE_NAV.map((item) => {
              const isActive = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    )}
                  >
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className="flex-1">{item.name}</span>
                    {isActive && <ChevronRight className="h-4 w-4" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4">
          <Link
            href={ROUTES.HOME}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white"
          >
            ← Volver a la tienda
          </Link>
        </div>
      </aside>
    </>
  );
}
