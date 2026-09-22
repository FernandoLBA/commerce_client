'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button, Input, Loading } from '@/components/ui';
import { useAdminUsers, useAdminUpdateUser } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { cn, formatDate } from '@/lib/utils';
import { toast } from '@/store';
import { UserRole } from '@/constants';

const ROLE_OPTIONS = [
  { value: '', label: 'Todos los roles' },
  { value: UserRole.USER, label: 'Usuario' },
  { value: UserRole.ADMIN, label: 'Admin' },
];

export default function BackofficeUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useAdminUsers({
    search: search || undefined,
    role: roleFilter || undefined,
    page,
    limit: 15,
  });

  const updateUser = useAdminUpdateUser();

  const handleToggleActive = async (id: string, currentState: boolean, email: string) => {
    try {
      await updateUser.mutateAsync({ id, data: { isActive: !currentState } });
      toast.success(
        'Actualizado',
        `${email} fue ${!currentState ? 'activado' : 'desactivado'}`
      );
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await updateUser.mutateAsync({ id, data: { role: newRole } });
      toast.success('Actualizado', 'Rol de usuario actualizado');
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-sm">
        {isLoading ? (
          <Loading className="py-20" />
        ) : !data?.data.length ? (
          <p className="py-16 text-center text-sm text-gray-500">No se encontraron usuarios</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">Usuario</th>
                  <th className="px-4 py-3 font-medium text-gray-500 hidden md:table-cell">Registro</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-center">Rol</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.data.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.email}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      {formatDate(user.createdAt, { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={cn(
                          'rounded-full border-0 px-2.5 py-0.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary-500',
                          user.role === UserRole.ADMIN
                            ? 'bg-purple-100 text-purple-700'
                            : 'bg-gray-100 text-gray-700'
                        )}
                      >
                        <option value={UserRole.USER}>Usuario</option>
                        <option value={UserRole.ADMIN}>Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleActive(user.id, user.isActive, user.email)}
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium transition-opacity hover:opacity-75',
                          user.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-600'
                        )}
                      >
                        {user.isActive ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {data && data.meta.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3">
            <p className="text-sm text-gray-500">
              {data.meta.total} usuarios · página {data.meta.page} de {data.meta.totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!data.meta.hasPrevPage}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!data.meta.hasNextPage}
                onClick={() => setPage((p) => p + 1)}
              >
                Siguiente
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
