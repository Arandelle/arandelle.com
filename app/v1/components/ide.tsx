"use client";

import { useEffect } from "react";
import { GitBranch, Circle } from "lucide-react";
import { PortfolioProvider, usePortfolio } from "../context";
import { ActivityBar } from "./activity-bar";
import { Sidebar } from "./sidebar";
import { TabBar } from "./tab-bar";
import { Editor } from "./editor";
import { ChatPanel } from "./chat-panel";
import { BottomPanel } from "./bottom-panel";
import type { PortfolioData } from "../types";
import "../vscode.css";

function IDEShell() {
  const { chatOpen, activeTabId, openTabs, closeTab } = usePortfolio();

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
    <div className="vscode-ide flex flex-col">
      <div className="flex flex-1">
        {/* Activity bar — full height, far left */}
        <ActivityBar />
        {/* Sidebar — full height */}
        <Sidebar />
        {/* Editor + terminal + statusbar stacked */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex flex-1 flex-col min-h-0">
            <TabBar />
            <Editor />
          </div>
          {/* Bottom panel — only under the editor */}
          <BottomPanel />
        </div>
      </div>

              {/* Status bar */}
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
                <span>{activeTab.name.endsWith(".tsx") ? "TypeScript React" : "MDX"}</span>
              </>
            )}
            <span className="opacity-70">portfolio v1.0</span>
          </div>
        </div>

      {chatOpen && <ChatPanel />}
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
