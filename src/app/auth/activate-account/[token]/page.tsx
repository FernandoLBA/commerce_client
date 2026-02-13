'use client';

import { Button } from "@/components";
import { ROUTES } from "@/constants";
import { useActivateAccount } from "@/hooks/api/use-auth";
import Link from "next/link";
import { use } from "react";

interface ActivateNotificationPageProps {
  params: Promise<{ token: string }>;
}

export default function ActivateNotificationPage({ params }: ActivateNotificationPageProps) {
  const resolvedParams = use(params);
  const { token } = resolvedParams;
  const activateAccountMutation = useActivateAccount();

  const handleActivateAccount = () => {
    activateAccountMutation.mutateAsync(token);
  };

  if(activateAccountMutation.isPending) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-8 w-8 animate-spin text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="4" stroke="currentColor" fill="none" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeWidth="4" stroke="currentColor" fill="none" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">Activando tu cuenta...</h2>
          <p className="text-gray-600 mb-6">
            Estamos activando tu cuenta. Esto puede tardar unos segundos, por favor espera.
          </p>
        </div>
      </div>
    );
  }

  if(activateAccountMutation.isSuccess) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-4">¡Cuenta Activada!</h2>
          <p className="text-gray-600">
            Tu cuenta ha sido activada exitosamente.
          </p>
          <p className="text-gray-600 mb-6">
            Ahora puedes iniciar sesión y comenzar a disfrutar de nuestros servicios.
          </p>
          <div className="mt-8 text-center">
            <Link href={ROUTES.AUTH.LOGIN}>
              <Button variant="primary" className="w-full">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
          <svg className="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-4">¡Activa tu Cuenta!</h2>
        <p className="text-gray-600 mb-6">
          Presiona el botón <b>Activar Cuenta</b> para activar tu cuenta.
        </p>
        <p className="text-gray-600 mb-6">
            <Button 
              variant="primary" 
              className="w-full" 
              isLoading={activateAccountMutation.isPending} 
              onClick={handleActivateAccount} 
            >Activar Cuenta</Button>
        </p>

        <div className="mt-8 text-center">
          <Link href={ROUTES.AUTH.LOGIN}>
            <Button variant="outline" className="w-full">
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}