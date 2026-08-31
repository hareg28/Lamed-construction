"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-navy-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            "w-full h-11 px-4 rounded-lg border border-navy-200 bg-white",
            "text-navy-800 text-sm placeholder:text-navy-400",
            "transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-navy-50",
            error && "border-red-500 focus:ring-red-500/40 focus:border-red-500",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
