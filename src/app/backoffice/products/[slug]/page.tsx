'use client';

import { useParams } from "next/navigation";

import FeatureBackofficeProductEditPage from "@/features/backoffice/products/components/productEditForm/page";

export default function BackofficeProductEditPage() {
  const { slug } = useParams<{ slug: string }>();
  
  return (
    <FeatureBackofficeProductEditPage productSlug={slug} />
  );
}
