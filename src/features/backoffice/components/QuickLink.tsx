import Link from "next/link";

import { cn } from "@/lib";

interface QuickLinkProps {
  href: string;
  label: string;
  color: string;
}

export function QuickLink({ href, label, color }: QuickLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium text-white transition-colors',
        color
      )}
    >
      {label}
    </Link>
  );
}