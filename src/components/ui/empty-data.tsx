import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { IconLinkButton } from "./icon-link-button";

export interface EmptyDataProps {
  title?: string;
  subTitle?: string;
  linkText?: string;
  href: string;
}

export function EmptyData({
  title = 'Data no encontrada',
  subTitle = 'La data que estás intentando usar, no existe.',
  linkText = 'Regresar',
  href,
}:EmptyDataProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="text-gray-600">{subTitle}</p>
      <div className="flex items-center gap-4">
        <IconLinkButton href={href} variant="primary" >
          <ArrowLeft size={18} />
        </IconLinkButton>
        <Link href={href} className="text-primary-600 hover:underline">
          {linkText}
        </Link>
      </div>
    </div>
  );
}