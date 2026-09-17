"use client";

import { useEffect } from "react";
import { GitBranch, Circle, Terminal as TerminalIcon, MessageSquare } from "lucide-react";
import { PortfolioProvider, usePortfolio } from "@/context/vscode-context";
import { ActivityBar } from "./activity-bar";
import { Sidebar } from "./sidebar";
import { TabBar } from "./tab-bar";
import { Editor } from "./editor";
import { ChatPanel } from "./chat-panel";
import { BottomPanel } from "./bottom-panel";
import type { PortfolioData } from "../types";
import "../vscode.css";

function MenuBar() {
  const { toggleBottomPanel, bottomPanelOpen, toggleChat, chatOpen } = usePortfolio();

  return (
    <div className="h-8 bg-[var(--vscode-titlebar-bg)] border-b border-[var(--vscode-border)] flex items-center px-3 text-[12px] shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-4 h-4 bg-[var(--vscode-accent)] rounded-sm flex items-center justify-center">
          <span className="text-white text-[9px] font-bold">A</span>
        </div>
      </div>

      {/* Menu items */}
      <div className="flex items-center gap-1">
        <button className="px-2 py-0.5 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] transition-colors">
          File
        </button>
        <button className="px-2 py-0.5 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] transition-colors">
          Edit
        </button>
        <button className="px-2 py-0.5 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] transition-colors">
          Selection
        </button>
        <button className="px-2 py-0.5 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] transition-colors">
          View
        </button>
        <button className="px-2 py-0.5 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] transition-colors">
          Go
        </button>
        <button className="px-2 py-0.5 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] transition-colors">
          Run
        </button>
        <button
          onClick={toggleBottomPanel}
          className={`px-2 py-0.5 rounded transition-colors ${
            bottomPanelOpen
              ? "bg-[var(--vscode-line-highlight)] text-[var(--vscode-text)]"
              : "hover:bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]"
          }`}
        >
          <TerminalIcon size={12} className="inline mr-1" />
          Terminal
        </button>
        <button
          onClick={toggleChat}
          className={`px-2 py-0.5 rounded transition-colors ${
            chatOpen
              ? "bg-[var(--vscode-line-highlight)] text-[var(--vscode-text)]"
              : "hover:bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]"
          }`}
        >
          <MessageSquare size={12} className="inline mr-1" />
          AI Chat
        </button>
        <button className="px-2 py-0.5 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] transition-colors">
          Help
        </button>
      </div>
    </div>
  );
}

function IDEShell() {
  const { chatOpen, activeTabId, openTabs, closeTab, bottomPanelOpen } = usePortfolio();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "w") {
        e.preventDefault();
        if (activeTabId) closeTab(activeTabId);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeTabId, closeTab]);

  const activeTab = openTabs.find((t) => t.id === activeTabId);

  return (
    <div className="vscode-ide flex flex-col h-screen">
      <MenuBar />

      <div className="flex flex-1 overflow-hidden">
        <ActivityBar />
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
              <TabBar />
              <div className="flex-1 overflow-auto">
                <Editor />
              </div>
            </div>
            {chatOpen && <ChatPanel />}
          </div>

          {bottomPanelOpen && <BottomPanel />}
        </div>
      </div>

      <div className="h-[var(--statusbar-height)] bg-[var(--vscode-statusbar-bg)] flex items-center px-3 text-[11px] text-white/90 shrink-0 gap-4">
        <div className="flex items-center gap-1.5">
          <GitBranch size={12} />
          <span>main</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Circle size={8} className="fill-current" />
          <span>0 errors</span>
        </div>
        <div className="ml-auto flex items-center gap-4">
          {activeTab && (
            <>
              <span>Ln 1, Col 1</span>
              <span>Spaces: 2</span>
              <span>UTF-8</span>
              <span>
                {activeTab.name.endsWith(".tsx") ? "TypeScript React" : "MDX"}
              </span>
            </>
          )}
          <span className="opacity-70">portfolio v1.0</span>
        </div>
      </div>
    </div>
  );
}

export function IDE({ data }: { data: PortfolioData }) {
  return (
    <PortfolioProvider data={data}>
      <IDEShell />
    </PortfolioProvider>
  );
}
