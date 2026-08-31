"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "info" | "danger" | "default";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  success:
    "bg-green-100 text-green-800 border-green-200",
  warning:
    "bg-emerald-100 text-emerald-800 border-emerald-200",
  info:
    "bg-blue-100 text-blue-800 border-blue-200",
  danger:
    "bg-red-100 text-red-800 border-red-200",
  default:
    "bg-navy-100 text-navy-800 border-navy-200",
};

function Badge({
  className,
  variant = "default",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-3 py-0.5 text-xs font-medium border transition-colors",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export default Badge;
