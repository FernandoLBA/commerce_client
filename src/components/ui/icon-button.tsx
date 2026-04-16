import { ReactNode } from "react";

import { cn } from "@/lib";
import { Button, ButtonProps } from "./button";
import { Loading } from "./loading";

export interface IconButtonProps extends ButtonProps{
  children?: ReactNode;
  className?: string;
  loading?: boolean;
}

export function IconButton({ variant, children, className, loading = false, ...props}: IconButtonProps) {
  const commonClasses = "flex items-center justify-center gap-1";

  return (
    <div className={commonClasses}>
      <Button size="icon" className={cn("rounded-full", className)} variant={variant} {...props}>
        {loading ? <Loading message="" /> : children}
      </Button>
    </div>
  );
}; 
