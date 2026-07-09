import React from 'react';
import { Sun, Moon, Monitor, ArrowUpRight, Mail, Calendar, Command } from 'lucide-react';
import { profile, BOOKING_URL } from '@/lib/data';
import { ThemeToggle } from '../theme-toggle';

type TabId = 'about' | 'experience' | 'stack' | 'projects' | 'certifications' | 'writing' | 'recommendations';

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const navItems: { id: TabId; label: string }[] = [
  { id: 'about', label: 'about' },
  { id: 'experience', label: 'experience' },
  { id: 'stack', label: 'stack' },
  { id: 'projects', label: 'projects' },
  { id: 'certifications', label: 'certifications' },
  { id: 'writing', label: 'writing' },
  { id: 'recommendations', label: 'recommendations' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
 
  return (
    <aside className="fixed left-0 top-0 h-screen w-[14rem] border-r border-gray-200 bg-background/95 backdrop-blur-sm overflow-y-auto hidden lg:flex flex-col p-5 transition-colors duration-500">
      {/* Identity */}
      <div className="mb-5">
        <h1 className="font-pixel text-[1.5rem] leading-none lowercase tracking-tight text-foreground">
          {profile.name}
        </h1>
        <p className="mt-1 font-mono-label text-[9px] uppercase tracking-[1px] text-gray-400">
          {profile.location}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-1" />

      {/* Main navigation */}
      <nav className="flex flex-col gap-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`group flex items-center gap-1.5 px-2 py-1.5 rounded-md font-mono-label text-[12px] transition-colors duration-200 ${
              activeTab === item.id
                ? 'text-foreground'
                : 'text-gray-400 hover:text-foreground'
            }`}
          >
            {activeTab === item.id && (
              <span className="text-[10px]">→</span>
            )}
            {item.label}
          </button>
        ))}
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-200 my-3" />

      {/* Action links */}
      <nav className="flex flex-col gap-0.5">
        <a
          href={BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-1.5 px-2 py-1.5 rounded-md font-mono-label text-[12px] text-gray-400 transition-colors hover:text-foreground"
        >
          <Calendar className="h-3.5 w-3.5" />
          Schedule a Call
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
        <a
          href={`mailto:${profile.email}`}
          className="group flex items-center gap-1.5 px-2 py-1.5 rounded-md font-mono-label text-[12px] text-gray-400 transition-colors hover:text-foreground"
        >
          <Mail className="h-3.5 w-3.5" />
          Send Email
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </nav>

      {/* Divider */}
      <div className="border-t border-gray-200 my-3" />

      {/* Command palette trigger */}
      <button
        className="flex items-center gap-2 px-2 py-1.5 rounded-md font-mono-label text-[12px] text-gray-400 transition-colors hover:text-foreground"
        onClick={() => {
          // Placeholder — command palette not yet implemented
        }}
      >
        <Command className="h-3.5 w-3.5" />
        Ask anything
        <kbd className="ml-auto font-mono-label text-[9px] text-gray-400 border border-gray-200 rounded px-1 py-0.5">⌘K</kbd>
      </button>

      {/* Divider */}
      <div className="border-t border-gray-200 my-3" />

      {/* Theme toggle */}
      <div className="flex items-center gap-2 px-2">
      <ThemeToggle />
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Contact */}
      <div className="border-t border-gray-200 pt-3">
        <p className="font-mono-label text-[9px] uppercase tracking-[1px] text-gray-400 mb-1">
          Reach me at
        </p>
        <a
          href={`mailto:${profile.email}`}
          className="font-mono-label text-[12px] text-gray-500 transition-colors hover:text-foreground underline decoration-gray-200 underline-offset-2 hover:decoration-foreground"
        >
          {profile.email}
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
export type { TabId };
