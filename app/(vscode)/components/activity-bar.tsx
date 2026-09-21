"use client";

import {
  Files,
  Search,
  GitBranch,
  MessageSquare,
  Blocks,
  Settings,
  User,
} from "lucide-react";
import { usePortfolio } from "@/context/vscode-context";
import type { SidebarPanel } from "../types";

const TOP_ACTIVITIES: {
  id: SidebarPanel | "chat";
  icon: typeof Files;
  label: string;
}[] = [
  { id: "explorer", icon: Files, label: "Explorer" },
  { id: "search", icon: Search, label: "Search" },
  { id: "source-control", icon: GitBranch, label: "Source Control" },
  { id: "extensions", icon: Blocks, label: "Extensions" },
  { id: "chat", icon: MessageSquare, label: "AI Chat" },
];

const BOTTOM_ACTIVITIES: {
  id: SidebarPanel;
  icon: typeof Files;
  label: string;
}[] = [
  { id: "account", icon: User, label: "Account" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export function ActivityBar() {
  const { sidebarPanel, chatOpen, setSidebarPanel, toggleChat } =
    usePortfolio();

  const renderButton = (activity: { id: SidebarPanel | "chat"; icon: typeof Files; label: string }) => {
    const isActive =
      activity.id === "chat"
        ? chatOpen
        : sidebarPanel === activity.id;
    const Icon = activity.icon;

    return (
      <button
        key={activity.id}
        onClick={() => {
          if (activity.id === "chat") {
            toggleChat();
          } else {
            setSidebarPanel(activity.id as SidebarPanel);
          }
        }}
        className={`relative w-12 h-12 flex items-center justify-center transition-colors ${
          isActive
            ? "text-[var(--vscode-text-bright)]"
            : "text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]"
        }`}
        title={activity.label}
      >
        {isActive && activity.id !== "chat" && (
          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-6 bg-[var(--vscode-text-bright)] rounded-r" />
        )}
        <Icon size={24} strokeWidth={1.5} />
      </button>
    );
  };

  return (
    <nav className="flex flex-col items-center shrink-0 border-r border-[var(--vscode-border)] bg-[var(--vscode-activitybar-bg)] w-[var(--activitybar-width)]">
      <div className="flex flex-col items-center py-2 gap-1">
        {TOP_ACTIVITIES.map(renderButton)}
      </div>
      <div className="mt-auto flex flex-col items-center pb-2 gap-1">
        {BOTTOM_ACTIVITIES.map(renderButton)}
      </div>
    </nav>
  );
}
