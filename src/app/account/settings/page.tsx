'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  AlertTriangle,
  Bell,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUIStore } from '@/store';
// import { useUpdatePassword } from '@/hooks/api';

// Password change schema
const passwordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('La contraseña actual es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  newPassword: yup
    .string()
    .required('La nueva contraseña es requerida')
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Debe contener mayúsculas, minúsculas y números'
    ),
  confirmPassword: yup
    .string()
    .required('Confirma tu nueva contraseña')
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden'),
});

type PasswordFormData = yup.InferType<typeof passwordSchema>;

// Notification preferences (mock - would need backend support)
const NOTIFICATION_PREFERENCES = [
  {
    id: 'orderUpdates',
    label: 'Actualizaciones de pedidos',
    description: 'Recibe notificaciones sobre el estado de tus pedidos',
  },
  {
    id: 'promotions',
    label: 'Promociones y ofertas',
    description: 'Entérate de descuentos especiales y ofertas exclusivas',
  },
  {
    id: 'newsletter',
    label: 'Newsletter',
    description: 'Recibe nuestro boletín semanal con novedades',
  },
  {
    id: 'productUpdates',
    label: 'Novedades de productos',
    description: 'Notificaciones sobre nuevos productos en categorías de interés',
  },
] as const;

export default function SettingsPage() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    productUpdates: false,
  });

  const { addToast } = useUIStore();
  // const updatePasswordMutation = useUpdatePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: yupResolver(passwordSchema),
  });

  const onPasswordSubmit = async (_data: PasswordFormData) => {
    try {
      // await updatePasswordMutation.mutateAsync({
      //   currentPassword: data.currentPassword,
      //   newPassword: data.newPassword,
      // });
      addToast({
        type: 'success',
        title: 'Éxito',
        message: 'Contraseña actualizada correctamente',
      });
      reset();
    } catch (_error) {
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Error al actualizar la contraseña. Verifica tu contraseña actual.',
      });
    }
  };

  const handleNotificationChange = (id: string) => {
    setNotifications((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    addToast({
      type: 'success',
      title: 'Preferencias',
      message: 'Preferencias actualizadas',
    });
  };

  return (
    <div className="space-y-6">
      {/* Security Settings */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <Lock className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">Seguridad</h2>
        </div>

        <form
          onSubmit={handleSubmit(onPasswordSubmit)}
          className="max-w-md space-y-4"
        >
          <div className="relative">
            <Input
              label="Contraseña actual"
              type={showCurrentPassword ? 'text' : 'password'}
              {...register('currentPassword')}
              error={errors.currentPassword?.message}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showCurrentPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Nueva contraseña"
              type={showNewPassword ? 'text' : 'password'}
              {...register('newPassword')}
              error={errors.newPassword?.message}
              helperText="Mínimo 8 caracteres, con mayúsculas, minúsculas y números"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <Input
            label="Confirmar nueva contraseña"
            type="password"
            {...register('confirmPassword')}
            error={errors.confirmPassword?.message}
          />

          <Button
            type="submit"
            // isLoading={updatePasswordMutation.isPending}
          >
            Cambiar contraseña
          </Button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            Notificaciones
          </h2>
        </div>

        <div className="space-y-4">
          {NOTIFICATION_PREFERENCES.map((pref) => (
            <label
              key={pref.id}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
            >
              <div>
                <p className="font-medium text-gray-900">{pref.label}</p>
                <p className="text-sm text-gray-500">{pref.description}</p>
              </div>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={notifications[pref.id] ?? false}
                  onChange={() => handleNotificationChange(pref.id)}
                  className="sr-only"
                />
                <div
                  className={`h-6 w-11 rounded-full transition-colors ${
                    notifications[pref.id] ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform ${
                      notifications[pref.id]
                        ? 'translate-x-5'
                        : 'translate-x-0.5'
                    } mt-0.5`}
                  />
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <div className="mb-4 flex items-center gap-2 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          <h2 className="text-lg font-semibold">Zona de peligro</h2>
        </div>

        <p className="mb-4 text-sm text-red-700">
          Las siguientes acciones son irreversibles. Por favor, procede con
          precaución.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-100"
            onClick={() =>
              addToast({
                type: 'info',
                title: 'En desarrollo',
                message: 'Funcionalidad en desarrollo',
              })
            }
          >
            Desactivar cuenta
          </Button>
          <Button
            variant="danger"
            onClick={() =>
              addToast({
                type: 'info',
                title: 'En desarrollo',
                message: 'Funcionalidad en desarrollo',
              })
            }
          >
            Eliminar cuenta
          </Button>
        </div>
      </div>
    </div>
  );
}
