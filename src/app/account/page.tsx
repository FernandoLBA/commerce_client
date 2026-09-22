'use client';

import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/ui';

export default function AccountPage() {
  redirect(ROUTES.USER.PROFILE);
}
