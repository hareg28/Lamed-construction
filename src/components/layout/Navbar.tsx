"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import logoImage from "../../../assets/LAMED-Photoroom.png";
import ThemeToggle from "@/components/ui/ThemeToggle";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useLanguageStore } from "@/store/languageStore";
import { useTranslation } from "@/lib/i18n";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { language } = useLanguageStore();
  const t = useTranslation(language);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/about", label: t.nav.about },
    { href: "/services", label: t.nav.services },
    { href: "/projects", label: t.nav.projects },
    { href: "/news", label: t.nav.news },
    { href: "/contact", label: t.nav.contact },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };

    if (typeof window !== "undefined") {
      setIsScrolled(window.scrollY > 40);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 shadow-lg border-b border-green-400",
        isScrolled ? "shadow-2xl" : ""
      )}
      style={{ backgroundColor: "#3ecf8e" }}
    >
      <nav className="w-full relative flex items-center h-16 sm:h-20 lg:h-[5.5rem] px-4 sm:px-6 lg:px-10 xl:px-16 gap-3">

        {/* NAV LINKS — left side */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2" style={{ flex: "0 0 auto" }}>
          {navLinks.slice(0, 4).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 lg:px-4 xl:px-5 py-2 text-sm sm:text-base lg:text-base xl:text-lg font-bold transition-all duration-200 rounded-full",
                isActive(link.href)
                  ? "bg-white !text-emerald-800 shadow-md hover:bg-green-50"
                  : "!text-emerald-900 font-bold hover:bg-white/30 hover:!text-emerald-950"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* SPACER */}
        <div className="hidden md:block flex-1" />

        {/* LOGO — absolutely centered, large, no background */}
        <div className="absolute left-1/2 -translate-x-1/2 h-full flex items-center pointer-events-none">
          <Link href="/" className="flex items-center pointer-events-auto">
            <div
              className="relative hover:scale-105 transition-transform duration-200"
              style={{ width: "340px", height: "100px" }}
            >
              <Image
                src={logoImage}
                alt="Lamed Construction Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
        </div>

        {/* NAV LINKS — right side */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2" style={{ flex: "0 0 auto" }}>
          {navLinks.slice(4).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 lg:px-4 xl:px-5 py-2 text-sm sm:text-base lg:text-base xl:text-lg font-bold transition-all duration-200 rounded-full",
                isActive(link.href)
                  ? "bg-white !text-emerald-800 shadow-md hover:bg-green-50"
                  : "!text-emerald-900 font-bold hover:bg-white/30 hover:!text-emerald-950"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT SIDE controls */}
        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0 ml-auto" style={{ color: '#064e3b' }}>
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl bg-emerald-700 text-white hover:bg-emerald-600 transition-colors"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85vw] shadow-2xl z-50 lg:hidden flex flex-col"
              style={{ backgroundColor: "#064e3b" }}
            >
              <div className="flex items-center justify-between p-6 border-b border-emerald-700">
                <Link href="/" className="flex items-center gap-3">
                  <div className="relative bg-white rounded-xl" style={{ width: "140px", height: "48px" }}>
                    <Image
                      src={logoImage}
                      alt="Lamed Construction Logo"
                      fill
                      className="object-contain p-1.5"
                    />
                  </div>
                </Link>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg text-emerald-100 hover:bg-emerald-700 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "block px-4 py-3.5 rounded-xl text-lg font-bold transition-all duration-200",
                        isActive(link.href)
                          ? "bg-white text-emerald-900"
                          : "text-emerald-100 hover:bg-emerald-700 hover:text-white"
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="pt-6 mt-6 border-t border-emerald-700"
                >
                  <Link
                    href="/admin/login"
                    className="block px-4 py-2.5 rounded-xl text-xs font-semibold text-emerald-400 hover:text-white transition-colors text-center"
                  >
                    Admin Access
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
