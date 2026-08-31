'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@lamed/shared';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  FolderKanban,
  Newspaper,
  Mail,
  Settings,
  LogOut,
  Building2,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/inquiries', label: 'Inquiries', icon: Mail },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setLoading(false);
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      logout();
      toast.success('Logged out successfully');
      router.push('/login');
      router.refresh();
    } catch (err) {
      toast.error('Logout failed');
    }
  };

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-navy-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-navy-600">
          <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-navy-50/50">
      <div className="lg:flex">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-64 bg-navy-800 transform transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="p-6 border-b border-navy-700">
              <Link href="/" className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-white font-bold text-lg font-serif-display leading-tight">
                    Lamed
                  </h1>
                  <p className="text-navy-400 text-xs">Admin Panel</p>
                </div>
              </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/admin' && pathname?.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-amber-500/10 text-amber-400 border-l-4 border-amber-500'
                        : 'text-navy-300 hover:bg-navy-700/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium text-sm">{item.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-navy-700 space-y-4">
              <div className="px-3 py-3 rounded-lg bg-navy-700/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">
                      {user?.name || 'Admin'}
                    </p>
                    <p className="text-navy-400 text-xs truncate">{user?.email}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Logout</span>
              </button>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-navy-900/60 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="lg:ml-64 flex-1 min-h-screen flex flex-col">
          <header className="bg-white/80 backdrop-blur-sm border-b border-navy-100 sticky top-0 z-20">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-navy-100 text-navy-600"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className={`lg:hidden p-2 rounded-lg hover:bg-navy-100 text-navy-600 ${sidebarOpen ? '' : 'hidden'}`}
                >
                  <X className="w-5 h-5" />
                </button>
                <div>
                  <h2 className="text-lg font-semibold text-navy-800">
                    {navItems.find(
                      (n) =>
                        pathname === n.href ||
                        (n.href !== '/' && pathname?.startsWith(n.href))
                    )?.label || 'Dashboard'}
                  </h2>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
