"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, rows = 4, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-navy-700 mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            "w-full px-4 py-3 rounded-lg border border-navy-200 bg-white",
            "text-navy-800 text-sm placeholder:text-navy-400",
            "transition-all duration-200 resize-y",
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

Textarea.displayName = "Textarea";

export default Textarea;
