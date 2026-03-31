import Link, { LinkProps } from "next/link";
import { ReactNode } from "react";

import { cn } from "@/lib";
import { Button } from "./button";

export interface IconLinkButtonProps extends LinkProps{
  variant: 'primary' | 'secondary' | 'ghost' | 'outline';
  children: ReactNode;
  classes?: string
}

export function IconLinkButton({ href, variant, children, classes, ...props}: IconLinkButtonProps) {
  const commonClasses = "flex items-center justify-center gap-1";

  return (
    <Link  href={href} className={cn(commonClasses)} {...props}>
      <Button type='button' size="icon" className={cn("rounded-full", classes)} variant={variant}>
        {children}
      </Button>
    </Link>
  );
}; 
