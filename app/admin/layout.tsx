'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

const ADMIN_SUBDOMAIN = 'dev';

const baseNavItems = [
  { label: 'Dashboard', path: '', icon: '📊' },
  { label: 'Projects', path: '/projects', icon: '📁' },
  { label: 'Experience', path: '/experience', icon: '💼' },
  { label: 'Certifications', path: '/certifications', icon: '🏆' },
  { label: 'Articles', path: '/articles', icon: '📝' },
  { label: 'Expertise', path: '/expertise', icon: '🛠️' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isDevSubdomain =
    typeof window !== 'undefined' &&
    window.location.hostname.startsWith(`${ADMIN_SUBDOMAIN}.`);

  const prefix = (path: string) => (isDevSubdomain ? path : `/admin${path}`);
  const navItems = baseNavItems.map((item) => ({
    ...item,
    href: prefix(item.path),
  }));
  const loginPath = prefix('/login');
  const homePath = prefix('');

  // On dev subdomain pathname is /, /projects, etc.
  // On normal domain pathname is /admin, /admin/projects, etc.
  const basePath = isDevSubdomain
    ? pathname
    : pathname?.replace(/^\/admin/, '') || '/';

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/verify');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          if (isLoginPage) {
            router.push(homePath);
          }
        } else if (!isLoginPage) {
          router.push(loginPath);
        }
      } catch {
        if (!isLoginPage) {
          router.push(loginPath);
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router, isLoginPage, homePath, loginPath]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push(loginPath);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm font-mono text-gray-500">Loading...</p>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <h1 className="font-pixel text-xl text-ink dark:text-gray-100 lowercase">
            arandelle
          </h1>
          <p className="text-xs font-mono text-gray-500 mt-1">admin panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.path === ''
                ? basePath === '/' || basePath === ''
                : basePath?.startsWith(item.path);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-gray-100 dark:bg-gray-800 text-ink dark:text-gray-100 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="mb-3 px-3">
            <p className="text-sm text-ink dark:text-gray-100">{user?.name}</p>
            <p className="text-xs font-mono text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-ink dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg text-left transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-56 p-8">{children}</main>
    </div>
  );
}
