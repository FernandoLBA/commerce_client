'use client';

import FeatureDashboardLayout from '@/features/backoffice/layout';

interface BackofficeLayoutProps {
  children: React.ReactNode;
}

export default function BackofficeLayout({ children }: BackofficeLayoutProps) {
  return (
    <FeatureDashboardLayout>
      {children}
    </FeatureDashboardLayout>
  );
}
