'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useRegister } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { registerSchema, type RegisterFormData } from '@/lib/validations';
import { toast } from '@/store';

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegister();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting},
  } = useForm({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;
      await registerMutation.mutateAsync(registerData);
      toast.success('¡Gracias por registrarte!', 'Te enviamos un mail a tu correo para verificar tu cuenta.');
      router.push(ROUTES.AUTH.ACTIVATE_NOTIFICATION);
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Crear cuenta</h1>
          <p className="mt-2 text-gray-600">
            Únete y disfruta de todos los beneficios
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre"
              placeholder="Tu nombre"
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...register('firstName')}
            />

            <Input
              label="Apellido"
              placeholder="Tu apellido"
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

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
            placeholder="Mínimo 8 caracteres"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            placeholder="Repite tu contraseña"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              Acepto los{' '}
              <Link
                href={ROUTES.STATIC.TERMS}
                className="text-primary-600 hover:text-primary-500"
              >
                términos y condiciones
              </Link>{' '}
              y la{' '}
              <Link
                href={ROUTES.STATIC.PRIVACY}
                className="text-primary-600 hover:text-primary-500"
              >
                política de privacidad
              </Link>
            </label>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isSubmitting || registerMutation.isPending}
          >
            Crear cuenta
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link
            href={ROUTES.AUTH.LOGIN}
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
