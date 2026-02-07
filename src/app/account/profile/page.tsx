'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { User, Mail, Phone, Edit2, Save, X } from 'lucide-react';

import { useUpdateProfile, useProfile } from '@/hooks/api';
import { useAuthStore } from '@/store';
import { useUIStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/loading';
import { profileSchema } from '@/lib/validations';
import type { UpdateProfileData } from '@/types';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const { user, updateUser } = useAuthStore();
  const { addToast } = useUIStore();

  const { data: currentUser, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(profileSchema),
  });

  useEffect(() => {
    if (currentUser) {
      reset({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        phone: currentUser.phone || '',
      });
    }
  }, [currentUser, reset]);

  const onSubmit = async (data: UpdateProfileData) => {
    try {
      const updatedUser = await updateProfileMutation.mutateAsync(data);
      updateUser(updatedUser);
      setIsEditing(false);
      addToast({
        type: 'success',
        title: 'Éxito',
        message: 'Perfil actualizado correctamente',
      });
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al actualizar el perfil',
      });
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (currentUser) {
      reset({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        phone: currentUser.phone || '',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <Skeleton className="mb-4 h-8 w-48" />
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const displayUser = currentUser || user;

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Información Personal
          </h2>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Editar
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Nombre"
                {...register('firstName')}
                error={errors.firstName?.message}
              />
              <Input
                label="Apellido"
                {...register('lastName')}
                error={errors.lastName?.message}
              />
            </div>
            <Input
              label="Email"
              type="email"
              value={currentUser?.email || ''}
              disabled
              helperText="El email no puede ser modificado"
            />
            <Input
              label="Teléfono"
              type="tel"
              {...register('phone')}
              error={errors.phone?.message}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                isLoading={updateProfileMutation.isPending}
              >
                <Save className="mr-2 h-4 w-4" />
                Guardar cambios
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                <X className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {displayUser?.firstName} {displayUser?.lastName}
                </h3>
                <p className="text-sm text-gray-500">
                  Miembro desde{' '}
                  {displayUser?.createdAt
                    ? new Date(displayUser.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                      })
                    : 'N/A'}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail className="h-5 w-5" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                <p className="mt-2 text-gray-900">{displayUser?.email}</p>
              </div>

              <div className="rounded-lg border border-gray-200 p-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone className="h-5 w-5" />
                  <span className="text-sm font-medium">Teléfono</span>
                </div>
                <p className="mt-2 text-gray-900">
                  {displayUser?.phone || 'No especificado'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="text-3xl font-bold text-primary-600">0</div>
          <p className="mt-1 text-sm text-gray-600">Pedidos realizados</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="text-3xl font-bold text-primary-600">0</div>
          <p className="mt-1 text-sm text-gray-600">Reseñas escritas</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="text-3xl font-bold text-primary-600">0</div>
          <p className="mt-1 text-sm text-gray-600">En lista de deseos</p>
        </div>
      </div>
    </div>
  );
}
