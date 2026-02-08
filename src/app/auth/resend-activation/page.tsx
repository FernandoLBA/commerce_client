'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { Mail, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Button, Input } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useResendActivationEmail } from '@/hooks/api';
import { getErrorMessage } from '@/lib/api';
import { toast } from '@/store';

const resendEmailSchema = yup.object({
  email: yup
    .string()
    .required('El correo electrónico es requerido')
    .email('Ingresa un correo electrónico válido'),
});

type ResendEmailFormData = yup.InferType<typeof resendEmailSchema>;

export default function ResendActivationEmailPage() {
  const resendMutation = useResendActivationEmail();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resendEmailSchema),
  });

  const onSubmit = async (data: ResendEmailFormData) => {
    try {
      await resendMutation.mutateAsync(data.email);
      toast.success(
        '¡Correo enviado!',
        'Revisa tu bandeja de entrada para activar tu cuenta'
      );
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  if(resendMutation.isSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
              <Mail className="h-8 w-8 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              ¡Correo enviado!
            </h1>
            <p className="mt-2 text-gray-600">
              Revisa tu bandeja de entrada para activar tu cuenta
            </p>
          </div>
      </div>
    </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
            <RefreshCw className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Reenviar correo de activación
          </h1>
          <p className="mt-2 text-gray-600">
            Ingresa tu correo electrónico y te enviaremos un nuevo enlace de activación
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

          <Button
            type="submit"
            className="w-full"
            isLoading={resendMutation.isPending}
          >
            <Mail className="mr-2 h-4 w-4" />
            Enviar correo de activación
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600">
          ¿Ya activaste tu cuenta?{' '}
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