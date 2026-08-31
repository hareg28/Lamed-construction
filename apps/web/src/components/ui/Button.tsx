"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 shadow-sm shadow-emerald-500/20 focus-visible:ring-emerald-400/40",
  secondary:
    "bg-navy-800 text-white hover:bg-navy-700 active:bg-navy-900 shadow-sm focus-visible:ring-navy-500/40",
  outline:
    "bg-transparent text-emerald-700 border border-emerald-500 hover:bg-emerald-50 active:bg-emerald-100 focus-visible:ring-emerald-500/40",
  ghost:
    "bg-transparent text-navy-700 hover:bg-navy-100 active:bg-navy-200 focus-visible:ring-navy-400/40",
  danger:
    "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm shadow-red-600/20 focus-visible:ring-red-500/40",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-13 px-7 text-base gap-2",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon
        )}
        {children && <span className="whitespace-nowrap">{children}</span>}
        {!loading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
