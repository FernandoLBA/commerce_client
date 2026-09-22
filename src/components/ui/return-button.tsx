import Link, { LinkProps } from "next/link";

export interface ReturnButtonProps extends LinkProps{
  variant: 'primary' | 'secondary';
  text?: string;
}

export function ReturnButton({ href, variant, text }: ReturnButtonProps) {
  const commonClasses = "flex items-center justify-center";
  const baseClasses = `text-sm hover:text-gray-700 capitalize gap-1 ${commonClasses}`;
  const variantClasses = variant === 'primary'
    ? "text-primary-600"
    : "text-gray-500";
  const returnButtonBaseClasses = `h-5 w-5 font-bold rounded-full ${commonClasses}`;
  const returnButtonClasses = variant === 'primary'
    ? "bg-primary-600 text-gray-100 hover:bg-primary-200"
    : "border-gray-500 bg-gray-100 hover:bg-gray-200";

  return (
    <Link  href={href} className={`${baseClasses} ${variantClasses}`}>
      <div className={`${returnButtonBaseClasses} ${returnButtonClasses}`}>
        {"<"}
      </div>
      {text || "Volver"}
    </Link>
  );
}; 