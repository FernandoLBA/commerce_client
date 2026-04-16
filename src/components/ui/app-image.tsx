import { ImageProps } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";

type BaseProps = {
  src: ImageProps["src"];
  alt?: string;
  className?: string;
  priority?: boolean;
}

type FillMode = {
  fill: true;
  sizes?: string;
  width?: never;
  height?: never;
}

type SizeMode = {
  fill?: false;
  sizes?: string;
  width?: number;
  height?: number;
}

export type AppImageProps = BaseProps & (FillMode | SizeMode);

export const AppImage = ({ 
  src, 
  alt = "",
  className,
  priority = false,
  fill = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...rest
}: AppImageProps) => {
  if (fill) {
    return (
      <Image
        alt={ alt }
        src={ src } 
        fill
        sizes={ sizes }
        priority={ priority }
        className={ className }
      />
    )
  }

  const { width = 50, height = 50 } = rest as SizeMode;

  return (
    <Image
      src={ src } 
      alt={ alt }
      width={ width }
      height={ height }
      priority={ priority }
      className={ className }
    />
  )
}