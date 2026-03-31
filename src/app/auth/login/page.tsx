'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useLogin } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { toast } from '@/store';

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await loginMutation.mutateAsync(data);
      toast.success('¡Bienvenido!', 'Has iniciado sesión correctamente');
      router.push(ROUTES.HOME);
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Iniciar sesión</h1>
          
          <p className="mt-2 text-gray-600">
            Ingresa tus credenciales para acceder a tu cuenta
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@email.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />

              <span className="text-sm text-gray-600">Recordarme</span>
            </label>

            <Link
              href={ROUTES.AUTH.FORGOT_PASSWORD}
              className="text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isSubmitting || loginMutation.isPending}
          >
            Iniciar sesión
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes una cuenta?{' '}
          <Link
            href={ROUTES.AUTH.REGISTER}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
