"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Newspaper,
  MessageSquare,
  Settings,
  LogOut,
  ChevronDown,
  Plus,
  List,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoImage from "../../../assets/logo.jpg";

interface SubNavItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface NavItem {
  href?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: SubNavItem[];
}

const navItems: NavItem[] = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    icon: FolderKanban,
    subItems: [
      { href: "/admin/projects", label: "All Projects", icon: List },
      { href: "/admin/projects/new", label: "New Project", icon: Plus },
    ],
  },
  {
    label: "News",
    icon: Newspaper,
    subItems: [
      { href: "/admin/news", label: "All News", icon: List },
      { href: "/admin/news/new", label: "New Post", icon: Plus },
    ],
  },
  {
    label: "Certificates",
    icon: Award,
    subItems: [
      { href: "/admin/certificates", label: "All Certificates", icon: List },
      { href: "/admin/certificates/new", label: "Add Certificate", icon: Plus },
    ],
  },
  {
    href: "/admin/inquiries",
    label: "Inquiries",
    icon: MessageSquare,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

const mobileTabItems = [
  { href: "/admin", label: "Home", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/news", label: "News", icon: Newspaper },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
];

function AdminSidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(["Projects", "News"]);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((i) => i !== label)
        : [...prev, label]
    );
  };

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const isParentActive = (item: NavItem) => {
    if (item.href) return isActive(item.href);
    if (item.subItems) {
      return item.subItems.some((sub) => isActive(sub.href));
    }
    return false;
  };

  return (
    <>
      <div className="flex items-center gap-3 px-6 py-6 border-b border-navy-700">
        <div className="relative w-10 h-10 aspect-square bg-white rounded-lg p-0.5 shrink-0">
          <Image
            src={logoImage || "/assets/logo.jpg"}
            alt="Lamed Logo"
            fill
            className="object-contain"
          />
        </div>
        <div>
          <span className="font-serif-display text-white font-bold tracking-wider text-sm block">
            LAMED
          </span>
          <span className="text-xs text-navy-400">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedItems.includes(item.label);
          const active = isParentActive(item);

          return (
            <div key={item.label}>
              {item.href ? (
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-l-4",
                    active
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500"
                      : "text-navy-300 hover:bg-navy-700/50 hover:text-white border-transparent"
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleExpand(item.label)}
                    className={cn(
                      "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 border-l-4",
                      active
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500"
                        : "text-navy-300 hover:bg-navy-700/50 hover:text-white border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        isExpanded ? "rotate-180" : ""
                      )}
                    />
                  </button>
                  {item.subItems && isExpanded && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const subActive = isActive(subItem.href);
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            onClick={onNavigate}
                            className={cn(
                              "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all duration-200 border-l-4",
                              subActive
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500"
                                : "text-navy-400 hover:bg-navy-700/50 hover:text-navy-200 border-transparent"
                            )}
                          >
                            {SubIcon && <SubIcon className="w-4 h-4 shrink-0" />}
                            <span>{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-navy-700">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-navy-300 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200">
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 bg-navy-800 z-40 border-r border-navy-700">
        <AdminSidebarContent />
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-navy-800 border-t border-navy-700 z-40 px-2 py-2 pb-4 safe-area-pb">
        <div className="flex items-center justify-around">
          {mobileTabItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200",
                  active
                    ? "text-amber-400 bg-amber-500/10"
                    : "text-navy-400 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export { AdminSidebarContent };
