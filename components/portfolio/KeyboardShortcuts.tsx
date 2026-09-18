'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const shortcuts = [
  { key: 'A', label: 'About', action: 'about' as const },
  { key: 'P', label: 'Projects', action: 'projects' as const },
  { key: 'C', label: 'Contact', action: 'contact' as const },
  { key: 'V', label: 'v1 Portfolio', action: 'v1' as const },
];

const sectionMap: Record<string, string> = {
  about: 'about',
  projects: 'projects',
  contact: 'contact',
};

export default function KeyboardShortcuts() {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);
  const [lastAction, setLastAction] = useState<string | null>(null);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger when typing in inputs, textareas, or contenteditable
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable ||
        target.closest('[data-ignore-shortcuts]')
      ) {
        return;
      }

      // Toggle overlay with ? or Shift+/
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setShowOverlay((prev) => !prev);
        return;
      }

      // Hide overlay with Escape
      if (e.key === 'Escape') {
        setShowOverlay(false);
        return;
      }

      const match = shortcuts.find(
        (s) => s.key === e.key.toUpperCase()
      );

      if (match) {
        e.preventDefault();
        setLastAction(match.label);

        if (match.action === 'v1') {
          router.push('/v1');
        } else {
          const sectionId = sectionMap[match.action];
          if (sectionId) {
            scrollToSection(sectionId);
          }
        }

        // Clear the toast after 1.5s
        clearTimeout(timeout);
        timeout = setTimeout(() => setLastAction(null), 1500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
    };
  }, [router, scrollToSection]);

  return (
    <>
      {/* Toast notification */}
      {lastAction && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-fade-up">
          <div className="bg-ink text-background dark:bg-white dark:text-black px-5 py-2.5 rounded-full font-mono text-[12px] uppercase tracking-wider shadow-lg">
            {lastAction}
          </div>
        </div>
      )}

      {/* Shortcuts overlay (toggled with ?) */}
      {showOverlay && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 dark:bg-black/50 backdrop-blur-sm"
          onClick={() => setShowOverlay(false)}
        >
          <div
            className="bg-background border border-gray-200 dark:border-gray-800 rounded-2xl p-8 max-w-sm w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-pixel text-2xl mb-6 text-ink dark:text-ink">
              shortcuts
            </h3>
            <div className="space-y-3">
              {shortcuts.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center justify-between"
                >
                  <span className="font-mono text-[11px] uppercase tracking-widest text-gray-500">
                    {s.label}
                  </span>
                  <kbd className="inline-flex items-center justify-center h-7 w-7 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-mono text-sm text-ink dark:text-ink shadow-sm">
                    {s.key}
                  </kbd>
                </div>
              ))}
            </div>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-widest text-gray-400">
              Press ? to toggle this panel
            </p>
          </div>
        </div>
      )}
    </>
  );
}
