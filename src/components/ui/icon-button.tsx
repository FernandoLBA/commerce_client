import { ReactNode } from "react";

import { cn } from "@/lib";
import { Button, ButtonProps } from "./button";

export interface IconButtonProps extends ButtonProps{
  children?: ReactNode;
  className?: string;
}

export function IconButton({ variant, children, className, ...props}: IconButtonProps) {
  const commonClasses = "flex items-center justify-center gap-1";

  return (
    <div className={commonClasses}>
      <Button size="icon" className={cn("rounded-full", className)} variant={variant} {...props}>
        {children}
      </Button>
    </div>
  );
}; 
