'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button, Input } from '@/components/ui';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations';
import { useResetPassword } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { ROUTES } from '@/constants';
import { toast } from '@/store';

export default function ResetPasswordPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  const [isSuccess, setIsSuccess] = useState(false);
  const resetPasswordMutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      await resetPasswordMutation.mutateAsync({ token, password: data.password });
      setIsSuccess(true);
      toast.success('¡Listo!', 'Tu contraseña ha sido actualizada');
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  if (isSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Contraseña actualizada
          </h1>
          <p className="mt-3 text-gray-600">
            Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar
            sesión con tu nueva contraseña.
          </p>
          <div className="mt-8">
            <Button
              className="w-full"
              size="lg"
              onClick={() => router.push(ROUTES.AUTH.LOGIN)}
            >
              Iniciar sesión
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Restablecer contraseña
          </h1>
          <p className="mt-2 text-gray-600">
            Ingresa tu nueva contraseña
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <Input
            label="Nueva contraseña"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={resetPasswordMutation.isPending}
          >
            Restablecer contraseña
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Recordaste tu contraseña?{' '}
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
