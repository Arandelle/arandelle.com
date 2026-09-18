"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminUser {
  id: string;
  email: string;
  name: string;
}

const navItems = [
  { label: "Dashboard", href: "/", icon: "📊" },
  { label: "Projects", href: "/projects", icon: "📁" },
  { label: "Experience", href: "/experience", icon: "💼" },
  { label: "Certifications", href: "/certifications", icon: "🏆" },
  { label: "Articles", href: "/articles", icon: "📝" },
  { label: "Expertise", href: "/expertise", icon: "🛠️" },
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

  const isLoginPage = pathname === "/login";

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/verify");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          if (isLoginPage) {
            router.push("/");
          }
        } else if (!isLoginPage) {
          router.push("/login");
        }
      } catch {
        if (!isLoginPage) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
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
              item.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-gray-100 dark:bg-gray-800 text-ink dark:text-gray-100 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
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
