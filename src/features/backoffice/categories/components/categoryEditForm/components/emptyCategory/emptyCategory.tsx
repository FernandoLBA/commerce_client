import Link from "next/link";

export default function EmptyCategory() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-2xl font-semibold">Categoría no encontrada</h2>
      <p className="text-gray-600">La categoría que estás intentando editar no existe.</p>
      <Link href="/backoffice/categories" className="text-primary-600 hover:underline">
        Volver a la lista de categorías
      </Link>
    </div>
  );
}