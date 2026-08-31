"use client";

import * as React from "react";
import { useEffect } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
      duration: 0.2,
    },
  },
  exit: { opacity: 0, y: 10, scale: 0.98 },
};

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnBackdropClick = true,
  showCloseButton = true,
  className,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-navy-900/60 backdrop-blur-sm"
            onClick={closeOnBackdropClick ? onClose : undefined}
            aria-hidden="true"
          />

          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            className={cn(
              "relative w-full rounded-2xl bg-white shadow-2xl flex flex-col max-h-[90vh]",
              sizeClasses[size],
              className
            )}
          >
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-6 py-5 border-b border-navy-100 shrink-0">
                {title ? (
                  <h2
                    id="modal-title"
                    className="text-lg font-semibold text-navy-900"
                  >
                    {title}
                  </h2>
                ) : (
                  <div />
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    aria-label="Close"
                    className="p-2 -mr-2 rounded-lg text-navy-500 hover:text-navy-700 hover:bg-navy-100 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {children}
            </div>

            {footer && (
              <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-navy-100 bg-navy-50/50 rounded-b-2xl shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
