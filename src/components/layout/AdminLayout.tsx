"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, User, LogOut, Settings, ChevronDown, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdminSidebar, { AdminSidebarContent } from "./AdminSidebar";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    router.push("/admin/login");
  };

  const handleNavigate = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-navy-50">
      <AdminSidebar />

      <div className="lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 bg-white border-b border-navy-100 shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-navy-700 hover:bg-navy-100 transition-colors"
                aria-label="Open sidebar"
              >
                <Menu size={22} />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-navy-800 hidden sm:block">
                  Admin Dashboard
                </h1>
                <Link
                  href="/"
                  className="text-sm text-navy-500 hover:text-amber-600 transition-colors flex items-center gap-1"
                >
                  <LayoutDashboard className="w-3 h-3" />
                  View Public Site
                </Link>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 sm:gap-3 px-3 py-2 rounded-lg hover:bg-navy-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-navy-700 flex items-center justify-center text-white">
                  <User className="w-5 h-5" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-navy-800">Admin</p>
                  <p className="text-xs text-navy-500">Admin User</p>
                </div>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-navy-500 transition-transform duration-200 hidden sm:block",
                    isUserMenuOpen ? "rotate-180" : ""
                  )}
                />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-navy-100 py-2 z-50"
                    >
                      <Link
                        href="/admin/settings"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-navy-700 hover:bg-navy-50 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </Link>
                      <div className="border-t border-navy-100 my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-28 lg:pb-8">
          {children}
        </main>
      </div>

      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-navy-900/60 z-40 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-screen w-72 max-w-[85vw] bg-navy-800 z-50 lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-navy-700">
                <span className="font-semibold text-white text-sm">Navigation</span>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 rounded-lg text-navy-300 hover:bg-navy-700 transition-colors"
                  aria-label="Close sidebar"
                >
                  <X size={20} />
                </button>
              </div>
              <AdminSidebarContent onNavigate={handleNavigate} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
