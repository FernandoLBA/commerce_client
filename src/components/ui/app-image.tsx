import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

export interface AppImageProps {
  src: string | StaticImport;
  alt?: string;
  sizes?: string;
  height?: number;
  width?: number;
  loading?: "eager" | "lazy" | undefined;
  className?: string;
  fill?: boolean;
}

export const AppImage = ({ 
  src, 
  alt = `image-${Date.now()}`,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  height = 50,
  width = 50,
  loading = 'eager',
  className,
  fill = false,
}: AppImageProps) => {
  return fill ? (
    <Image
      alt={ alt }
      src={ src } 
      fill
      loading={ loading }
      priority
      sizes={ sizes }
      className={ className }
      />
    ) : (
      <Image
      alt={ alt }
      src={ src } 
      height={ height }
      width={ width }
      loading={ loading }
      priority
      sizes={ sizes }
      className={ className }
    />
  )
}