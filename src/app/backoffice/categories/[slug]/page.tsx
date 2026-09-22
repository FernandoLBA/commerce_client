'use client';

import { CategoryEditForm } from '@/features/backoffice';
import {
  useParams,
} from 'next/navigation';


export default function BackofficeCategoryEditPage() {
  const { slug } = useParams<{ slug: string }>();
  
  return (
    <CategoryEditForm categorySlug={slug} />
  )
}
