import { Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { BackofficeSidebar } from '@/components/layout';
import { Button, Loading } from '@/components/ui';
import { ROUTES } from '@/constants';
import { useAuthHydrated, useAuthStore, useIsAdmin } from '@/store';

interface BackofficeLayoutProps {
  children: React.ReactNode;
}

export default function FeatureDashboardLayout({ children }: BackofficeLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const hasHydrated = useAuthHydrated();
  const isAdmin = useIsAdmin();

  useEffect(() => {
    if (hasHydrated && !isAdmin) {
      router.replace(ROUTES.HOME);
    }
  }, [hasHydrated, isAdmin, router]);

  if (!hasHydrated || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Loading />
      </div>
    );
  }

  const handleLogout = () => {
    clearAuth();
    router.push(ROUTES.HOME);
  };

  return (
    <>
      <div className="h-fit border-4 border-orange-500">
        <div className="fixed flex w-full">
          <div className="flex h-fit w-fit flex-1">
            <BackofficeSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          </div>

          <div className='flex h-fit flex-col border-4 border-green-400 w-full'>
            {/* Top bar */}
            <div className="flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
              {/* menu icon mobile */}
              <Button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
                aria-label="Abrir menú"
                variant="ghost"
              >
                <Menu className="h-5 w-5" />
              </Button>

              {/* user info */}
              <div className="ml-auto flex items-center gap-4">
                <span className="hidden text-sm text-gray-600 sm:block">
                  {user?.firstName ?? user?.email}
                </span>
              </div>
            </div>

          {/* Page content */}
          <main className="h-full overflow-y-auto p-4 sm:p-6 border-4 border-blue-500">{children}</main>
          </div>
        </div>
      </div>

      {/* <div className="mt-16 flex h-screen w-full overflow-y-auto border-4 border-blue-500 bg-gray-400">
        <div className="flex min-w-0 flex-1 flex-col"> */}
      {/* Top bar */}

      {/* Page content */}
      {/* <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
        </div>
      </div> */}

      {/* VIEJO */}
      {/* <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="ml-auto flex items-center gap-4">
            <span className="hidden text-sm text-gray-600 sm:block">
              {user?.firstName ?? user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </header> */}
    </>
  );
}
