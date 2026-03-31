'use client';

import Link from 'next/link';
import { BarChart3, Package, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { Loading } from '@/components/ui';
import { useAdminStats, useAdminOrders } from '@/hooks';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { ORDER_STATUS_CONFIG, ROUTES } from '@/constants';

export default function BackofficeDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: recentOrders, isLoading: ordersLoading } = useAdminOrders({ limit: 8 });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats grid */}
      {statsLoading ? (
        <Loading className="py-10" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Ingresos totales"
            value={formatCurrency(stats?.totalRevenue ?? 0)}
            subtitle={`Este mes: ${formatCurrency(stats?.monthlyRevenue ?? 0)}`}
            icon={TrendingUp}
            color="bg-green-500"
          />
          <StatCard
            title="Pedidos"
            value={stats?.totalOrders ?? 0}
            subtitle={`${stats?.pendingOrders ?? 0} pendientes`}
            icon={ShoppingBag}
            color="bg-primary-500"
          />
          <StatCard
            title="Productos"
            value={stats?.totalProducts ?? 0}
            subtitle={`${stats?.activeProducts ?? 0} activos`}
            icon={Package}
            color="bg-purple-500"
          />
          <StatCard
            title="Usuarios"
            value={stats?.totalUsers ?? 0}
            subtitle={`${stats?.activeUsers ?? 0} activos`}
            icon={Users}
            color="bg-orange-500"
          />
        </div>
      )}

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-3">
        <QuickLink
          href={ROUTES.BACKOFFICE.PRODUCT_NEW}
          label="+ Nuevo producto"
          color="bg-primary-600 hover:bg-primary-700"
        />
        <QuickLink
          href={ROUTES.BACKOFFICE.ORDERS}
          label="Ver pedidos"
          color="bg-gray-700 hover:bg-gray-800"
        />
        <QuickLink
          href={ROUTES.BACKOFFICE.USERS}
          label="Gestionar usuarios"
          color="bg-gray-700 hover:bg-gray-800"
        />
      </div>

      {/* Recent orders table */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Pedidos recientes</h2>
          </div>
          <Link
            href={ROUTES.BACKOFFICE.ORDERS}
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Ver todos →
          </Link>
        </div>

        {ordersLoading ? (
          <Loading />
        ) : !recentOrders?.data?.length ? (
          <p className="py-8 text-center text-sm text-gray-500">No hay pedidos aún</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left">
                  <th className="pb-3 font-medium text-gray-500">N° Pedido</th>
                  <th className="pb-3 font-medium text-gray-500">Estado</th>
                  <th className="pb-3 font-medium text-gray-500 text-right">Total</th>
                  <th className="pb-3 font-medium text-gray-500 hidden sm:table-cell">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.data.map((order) => {
                  const cfg = ORDER_STATUS_CONFIG[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="py-3">
                        <Link
                          href={ROUTES.BACKOFFICE.ORDER_DETAIL(order.id)}
                          className="font-medium text-primary-600 hover:underline"
                        >
                          #{order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3">
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                            cfg?.color
                          )}
                        >
                          {cfg?.label}
                        </span>
                      </td>
                      <td className="py-3 text-right font-medium">
                        {formatCurrency(parseFloat(order.total))}
                      </td>
                      <td className="py-3 text-gray-500 hidden sm:table-cell">
                        {formatDate(order.createdAt, { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  color: string;
}

function StatCard({ title, value, subtitle, icon: Icon, color }: StatCardProps) {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={cn('rounded-full p-3 text-white', color)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

interface QuickLinkProps {
  href: string;
  label: string;
  color: string;
}

function QuickLink({ href, label, color }: QuickLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-white transition-colors',
        color
      )}
    >
      {label}
    </Link>
  );
}
