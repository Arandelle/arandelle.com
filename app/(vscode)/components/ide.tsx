"use client";

import { useEffect } from "react";
import { GitBranch, Circle, Terminal as TerminalIcon, MessageSquare, Menu, X } from "lucide-react";
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
  const { toggleBottomPanel, bottomPanelOpen, toggleChat, chatOpen, isMobile, toggleSidebar, sidebarOpen } = usePortfolio();

  return (
    <div className="h-8 bg-[var(--vscode-titlebar-bg)] border-b border-[var(--vscode-border)] flex items-center px-3 text-[12px] shrink-0">
      {/* Mobile hamburger */}
      {isMobile && (
        <button
          onClick={toggleSidebar}
          className="mr-2 p-1 rounded hover:bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] transition-colors"
        >
          {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>
      )}

      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <div className="w-4 h-4 bg-[var(--vscode-accent)] rounded-sm flex items-center justify-center">
          <span className="text-white text-[9px] font-bold">A</span>
        </div>
      </div>

      {/* Desktop menu items */}
      <div className="hidden md:flex items-center gap-1">
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

      {/* Mobile action buttons */}
      {isMobile && (
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={toggleBottomPanel}
            className={`p-1.5 rounded transition-colors ${
              bottomPanelOpen
                ? "bg-[var(--vscode-line-highlight)] text-[var(--vscode-text)]"
                : "text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]"
            }`}
          >
            <TerminalIcon size={14} />
          </button>
          <button
            onClick={toggleChat}
            className={`p-1.5 rounded transition-colors ${
              chatOpen
                ? "bg-[var(--vscode-line-highlight)] text-[var(--vscode-text)]"
                : "text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]"
            }`}
          >
            <MessageSquare size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function IDEShell() {
  const { chatOpen, activeTabId, openTabs, closeTab, bottomPanelOpen, isMobile } = usePortfolio();

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

      <div className="flex flex-1 overflow-hidden relative">
        {/* Activity bar + sidebar: hidden on mobile unless toggled */}
        <div className={isMobile ? "hidden" : "contents"}>
          <ActivityBar />
        </div>
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
              <TabBar />
              <div className="flex-1 overflow-auto">
                <Editor />
              </div>
            </div>
            {/* Chat panel: inline on desktop, overlay on mobile */}
            {chatOpen && !isMobile && <ChatPanel />}
          </div>

          {/* Bottom panel: inline on desktop, overlay on mobile */}
          {bottomPanelOpen && !isMobile && <BottomPanel />}
        </div>

        {/* Mobile overlays */}
        {isMobile && chatOpen && (
          <div className="absolute inset-0 z-50 bg-[var(--vscode-bg)]">
            <ChatPanel />
          </div>
        )}
        {isMobile && bottomPanelOpen && (
          <div className="absolute inset-0 z-50 bg-[var(--vscode-bg)]">
            <BottomPanel />
          </div>
        )}
      </div>

      {/* Status bar */}
      <div className="h-[var(--statusbar-height)] bg-[var(--vscode-statusbar-bg)] flex items-center px-3 text-[11px] text-white/90 shrink-0 gap-4">
        <div className="flex items-center gap-1.5">
          <GitBranch size={12} />
          <span className="hidden sm:inline">main</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <Circle size={8} className="fill-current" />
          <span>0 errors</span>
        </div>
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {activeTab && (
            <>
              <span className="hidden sm:inline">Ln 1, Col 1</span>
              <span className="hidden sm:inline">Spaces: 2</span>
              <span className="hidden sm:inline">UTF-8</span>
              <span className="hidden sm:inline">
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
