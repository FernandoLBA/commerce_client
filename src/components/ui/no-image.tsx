import { ImageIcon } from "lucide-react";

import { cn } from "@/lib";

export interface NoImageProps {
  className?: string;
  height?: number;
  width?: number;
}

export const NoImage = ({ className, height, width }: NoImageProps) => {
  return (
    <div className={cn('flex items-center justify-center border-2 border-gray-400 text-gray-400 bg-gray-100 px-4 py-3 rounded-md', className)} style={{ height, width }}>
      <ImageIcon size={30} />
    </div>
  )
}