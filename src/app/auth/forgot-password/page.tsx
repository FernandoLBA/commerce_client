'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations';
import { useForgotPassword } from '@/hooks';
import { getErrorMessage } from '@/lib/api';
import { ROUTES } from '@/constants';
import { toast } from '@/store';

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const forgotPasswordMutation = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await forgotPasswordMutation.mutateAsync(data.email);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
      toast.success('Correo enviado', 'Revisa tu bandeja de entrada');
    } catch (error) {
      toast.error('Error', getErrorMessage(error));
    }
  };

  if (isSubmitted) {
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
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Revisa tu correo</h1>
          <p className="mt-3 text-gray-600">
            Hemos enviado las instrucciones para restablecer tu contraseña a{' '}
            <span className="font-medium text-gray-900">{submittedEmail}</span>
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
          </p>
          <div className="mt-8 space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setIsSubmitted(false)}
            >
              Intentar con otro correo
            </Button>
            <Link
              href={ROUTES.AUTH.LOGIN}
              className="block text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Volver a iniciar sesión
            </Link>
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
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="mt-2 text-gray-600">
            Ingresa tu correo electrónico y te enviaremos las instrucciones para
            restablecerla
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
            size="lg"
            isLoading={forgotPasswordMutation.isPending}
          >
            Enviar instrucciones
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