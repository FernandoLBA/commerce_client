import Image from "next/image";

export interface AppImageProps {
  src: string;
  alt?: string;
  sizes?: string;
  height?: number;
  width?: number;
  loading?: "eager" | "lazy" | undefined;
  className?: string;
}

export const AppImage = ({ 
  src, 
  alt = `image-${Date.now()}`,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  height = 50,
  width = 50,
  loading = 'eager',
  className,
}: AppImageProps) => {
  return (
    <Image
      alt={ alt }
      src={ src } 
      height={ height }
      width={ width }
      loading={ loading }
      sizes={ sizes }
      className={ className }
    />
  )
}