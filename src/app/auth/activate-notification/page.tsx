import { CheckCircle, Mail } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui';
import { ROUTES } from '@/constants';

export default function ActivateNotificationPage() {
  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
            <Mail className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Revisa tu correo
          </h1>
          <p className="mt-4 text-gray-600">
            Hemos enviado un enlace de activación a tu correo electrónico.
            Por favor, haz clic en el enlace para completar el registro.
          </p>
        </div>

        <div className="mt-8 rounded-xl bg-gray-50 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary-500" />
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900">¿No recibiste el correo?</p>
              <p className="mt-1">
                Revisa tu carpeta de spam o {' '}
                <Link 
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                  href={ROUTES.AUTH.RESEND_ACTIVATION_EMAIL}>solicita un nuevo enlace de activación.
                </Link>  
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href={ROUTES.AUTH.LOGIN}>
            <Button variant="primary" className="w-full">
              Volver a iniciar sesión
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}