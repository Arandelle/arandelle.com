"use client";

import { X } from "lucide-react";
import { usePortfolio } from "@/context/vscode-context";

export function TabBar() {
  const { openTabs, activeTabId, setActiveTab, closeTab, isMobile } = usePortfolio();

  if (openTabs.length === 0) return null;

  return (
    <div className="flex h-[var(--tabbar-height)] bg-[var(--vscode-sidebar-bg)] border-b border-[var(--vscode-border)] overflow-x-auto shrink-0">
      {openTabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        const Icon = tab.icon;

        return (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`group flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 h-full text-[12px] sm:text-[13px] cursor-pointer border-r border-[var(--vscode-border)] shrink-0 select-none transition-colors ${
              isActive
                ? "bg-[var(--vscode-tab-active)] text-[var(--vscode-text-bright)] border-t-2 border-t-[var(--vscode-accent)]"
                : "bg-[var(--vscode-tab-inactive)] text-[var(--vscode-text-muted)] hover:bg-[var(--vscode-tab-hover)]"
            }`}
          >
            <Icon
              size={isMobile ? 12 : 14}
              style={{ color: tab.iconColor }}
              strokeWidth={1.5}
            />
            <span className="whitespace-nowrap max-w-[100px] sm:max-w-none truncate">{tab.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className={`ml-0.5 p-0.5 rounded-sm hover:bg-[var(--vscode-line-highlight)] transition-opacity ${
                isMobile ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
            >
              <X size={isMobile ? 12 : 14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
