import React, { useState } from "react";
import {
  Sun,
  Moon,
  Monitor,
  ArrowUpRight,
  Mail,
  Calendar,
  Command,
  Menu,
  X,
} from "lucide-react";
import { profile, BOOKING_URL } from "@/lib/data";
import type { TabId } from "./Sidebar";
import { ThemeToggle } from "../theme-toggle";

const navItems: { id: TabId; label: string }[] = [
  { id: "about", label: "about" },
  { id: "experience", label: "experience" },
  { id: "stack", label: "stack" },
  { id: "projects", label: "projects" },
  { id: "certifications", label: "certifications" },
  { id: "writing", label: "writing" },
  { id: "recommendations", label: "recommendations" },
];

interface MobileNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
  const [open, setOpen] = useState(false);

  const handleTabChange = (tab: TabId) => {
    onTabChange(tab);
    setOpen(false);
  };

  return (
    <>
      {/* Sticky top bar */}
      <div className="fixed top-0 left-0 right-0 z-40 border-b border-gray-200 bg-background/90 backdrop-blur-md lg:hidden transition-colors duration-500">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="font-pixel text-[1.2rem] leading-none lowercase tracking-tight text-foreground">
            {profile.name}
          </h1>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center justify-center h-9 w-9 rounded-md border border-gray-200 text-gray-400 transition-colors hover:text-foreground hover:border-gray-300"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Full-screen overlay menu */}
      {open && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md lg:hidden animate-fade-in transition-colors duration-500">
          <div className="flex h-full flex-col px-6 pt-20 pb-8">
            {/* Nav items */}
            <nav className="flex flex-col gap-1.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className={`group flex items-center gap-1.5 px-3 py-2 rounded-md font-pixel text-[1.2rem] lowercase tracking-tight transition-colors ${
                    activeTab === item.id
                      ? "text-foreground"
                      : "text-gray-400 hover:text-foreground"
                  }`}
                >
                  {activeTab === item.id && (
                    <span className="text-[10px] font-mono-label">→</span>
                  )}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4" />

            {/* Actions */}
            <nav className="flex flex-col gap-1.5">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-3 py-2 rounded-md font-mono-label text-[12px] text-gray-400 transition-colors hover:text-foreground"
              >
                <Calendar className="h-3.5 w-3.5" />
                Schedule a Call
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="group flex items-center gap-2 px-3 py-2 rounded-md font-mono-label text-[12px] text-gray-400 transition-colors hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5" />
                Send Email
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </nav>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4" />

            {/* Command palette trigger */}
            <button className="flex items-center gap-2 px-3 py-2 rounded-md font-mono-label text-[12px] text-gray-400 transition-colors hover:text-foreground">
              <Command className="h-3.5 w-3.5" />
              Ask anything
              <kbd className="ml-auto font-mono-label text-[9px] text-gray-400 border border-gray-200 rounded px-1 py-0.5">
                ⌘K
              </kbd>
            </button>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Theme toggle */}
            <div className="border-t border-gray-200 pt-4 flex items-center gap-3">
              <ThemeToggle />
            </div>

            {/* Contact */}
            <div className="mt-4">
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
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
