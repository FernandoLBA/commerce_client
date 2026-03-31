import Link from "next/link"

import { ROUTES } from "@/constants"

export const EmptyCategory = () => {
  return (
    <div className="py-20 text-center">
        <p className="text-gray-500">Categoría no encontrada</p>
        <Link href={ROUTES.BACKOFFICE.CATEGORIES} className="mt-4 inline-block text-sm text-primary-600 hover:underline">
          ← Volver a categorías
        </Link>
      </div>
  )
}