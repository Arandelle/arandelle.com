'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Stats {
  projects: number;
  experiences: number;
  certifications: number;
  articles: number;
  expertise: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, experiences, certifications, articles, expertise] =
          await Promise.all([
            fetch('/api/projects').then((r) => r.json()),
            fetch('/api/experience').then((r) => r.json()),
            fetch('/api/certifications').then((r) => r.json()),
            fetch('/api/articles').then((r) => r.json()),
            fetch('/api/expertise').then((r) => r.json()),
          ]);

        setStats({
          projects: projects.length || 0,
          experiences: experiences.length || 0,
          certifications: certifications.length || 0,
          articles: articles.length || 0,
          expertise: expertise.length || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = stats
    ? [
        { label: 'Projects', count: stats.projects, href: '/projects', icon: '📁' },
        { label: 'Experience', count: stats.experiences, href: '/experience', icon: '💼' },
        { label: 'Certifications', count: stats.certifications, href: '/certifications', icon: '🏆' },
        { label: 'Articles', count: stats.articles, href: '/articles', icon: '📝' },
        { label: 'Expertise', count: stats.expertise, href: '/expertise', icon: '🛠️' },
      ]
    : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-pixel text-2xl text-ink dark:text-gray-100 lowercase mb-2">
          dashboard
        </h1>
        <p className="text-sm font-mono text-gray-500">
          Manage your portfolio content
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24 mb-2" />
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-12" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <Link
              key={stat.href}
              href={stat.href}
              className="border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 p-6 hover:shadow-[0_18px_36px_-20px_rgba(10,10,10,0.4)] hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </span>
                <span className="text-xl">{stat.icon}</span>
              </div>
              <p className="text-3xl font-pixel text-ink dark:text-gray-100">
                {stat.count}
              </p>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
        <h2 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-2">
          01 — quick start
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Use the sidebar to navigate and manage your portfolio content. All
          changes are saved to the database and reflected on your public
          portfolio immediately.
        </p>
      </div>
    </div>
  );
}
