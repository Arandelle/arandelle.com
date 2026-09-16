"use client";

import {
  Terminal,
  ChevronDown,
  AlertCircle,
  Bug,
  Plug,
  X,
  Plus,
  Trash2,
  ChevronRight,
  ChevronDownIcon,
  Monitor,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import AsciiPortrait from "@/components/portfolio/AsciiPortrait";
import { usePortfolio } from "@/context/vscode-context";

const tabs = [
  { id: "problems", label: "PROBLEMS", icon: AlertCircle, count: 0 },
  { id: "output", label: "OUTPUT", icon: ChevronRight },
  { id: "debug", label: "DEBUG CONSOLE", icon: Bug },
  { id: "terminal", label: "TERMINAL", icon: Terminal },
  { id: "ports", label: "PORTS", icon: Plug },
];

export function BottomPanel() {
  const [panelHeight, setPanelHeight] = useState(300);
  const [activeTab, setActiveTab] = useState("terminal");
  const [isDragging, setIsDragging] = useState(false);
  const [showTerminalSelector, setShowTerminalSelector] = useState(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);
  const { closeBottomPanel } = usePortfolio();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "`") {
      e.preventDefault();
      setPanelHeight((h) => (h > 36 ? 36 : 300));
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      dragStartY.current = e.clientY;
      dragStartHeight.current = panelHeight;
    },
    [panelHeight],
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = dragStartY.current - e.clientY;
      const newHeight = Math.max(36, Math.min(900, dragStartHeight.current + delta));
      setPanelHeight(newHeight);
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    if (!showTerminalSelector) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(e.target as Node)) {
        setShowTerminalSelector(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showTerminalSelector]);

  return (
    <div
      ref={panelRef}
      className="border-t border-[var(--vscode-border)] bg-[var(--vscode-panel-bg)] flex flex-col shrink-0"
      style={{ height: panelHeight }}
    >
      {/* Drag handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`h-1 cursor-row-resize ${isDragging ? "bg-[var(--vscode-accent)]" : "hover:bg-[var(--vscode-accent-hover,#444)]"} transition-colors`}
      />

      {/* Tab bar */}
      <div className="flex items-center border-b border-[var(--vscode-border)] bg-[var(--vscode-titlebar-bg)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (panelHeight < 100) setPanelHeight(200);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-[11px] uppercase tracking-wide border-b-2 transition-colors ${
                isActive
                  ? "text-[var(--vscode-text-bright)] border-[var(--vscode-accent)]"
                  : "text-[var(--vscode-text-muted)] border-transparent hover:text-[var(--vscode-text)]"
              }`}
            >
              <Icon size={12} />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[9px] bg-[var(--vscode-badge-bg)] text-white rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-1 px-2">
          <button className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]">
            <Plus size={14} />
          </button>
          <button className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]">
            <Trash2 size={14} />
          </button>
          <button
            onClick={() => setPanelHeight(36)}
            className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]"
          >
            <ChevronDown size={14} />
          </button>
          <button
            onClick={closeBottomPanel}
            className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === "terminal" && panelHeight > 36 && (
          <div className="h-full flex flex-col">
            {/* Terminal selector bar */}
            <div className="flex items-center justify-between px-2 py-1 bg-[var(--vscode-titlebar-bg)] border-b border-[var(--vscode-border)]">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowTerminalSelector(!showTerminalSelector)}
                  className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] hover:bg-[var(--vscode-line-highlight)] rounded transition-colors"
                >
                  <Monitor size={12} className="text-[var(--vscode-terminal-banner)]" />
                  <span className="text-[var(--vscode-text)]">PowerShell</span>
                  <ChevronDownIcon size={10} className="text-[var(--vscode-text-muted)]" />
                </button>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-0.5 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]">
                  <Plus size={12} />
                </button>
                <button className="p-0.5 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]">
                  <Trash2 size={12} />
                </button>
                <button className="p-0.5 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]">
                  <ChevronDown size={12} />
                </button>
                <button className="p-0.5 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]">
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Terminal selector dropdown */}
            {showTerminalSelector && (
              <div
                ref={selectorRef}
                className="absolute z-50 mt-6 left-2 bg-[var(--vscode-dropdown-bg)] border border-[var(--vscode-dropdown-border)] rounded shadow-lg"
              >
                <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-[var(--vscode-text-muted)]">
                  Select Default Profile
                </div>
                <button className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] hover:bg-[var(--vscode-list-hover)] text-[var(--vscode-text)]">
                  <Monitor size={14} className="text-[var(--vscode-terminal-banner)]" />
                  <span>PowerShell</span>
                  <span className="ml-auto text-[10px] text-[var(--vscode-text-muted)]">Default</span>
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] hover:bg-[var(--vscode-list-hover)] text-[var(--vscode-text)]">
                  <Terminal size={14} className="text-[var(--vscode-text-muted)]" />
                  <span>Command Prompt</span>
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] hover:bg-[var(--vscode-list-hover)] text-[var(--vscode-text)]">
                  <Terminal size={14} className="text-[var(--vscode-terminal-green)]" />
                  <span>Git Bash</span>
                </button>
                <button className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] hover:bg-[var(--vscode-list-hover)] text-[var(--vscode-text)]">
                  <Terminal size={14} className="text-[#e6461d]" />
                  <span>Ubuntu (WSL)</span>
                </button>
              </div>
            )}

            {/* Terminal content */}
            <div className="flex-1 overflow-auto p-3 bg-[var(--vscode-terminal-bg)] font-mono text-[12px]">
              <div className="text-[var(--vscode-terminal-banner)]">Windows PowerShell</div>
              <div className="text-[var(--vscode-text-muted)]">
                Copyright (C) Microsoft Corporation. All rights reserved.
              </div>
              <div className="mt-2">
                <span className="text-[var(--vscode-text-muted)]">
                  Install the latest PowerShell for new features and improvements!
                </span>
                <span className="text-[var(--vscode-accent)]"> https://aka.ms/PSWindows</span>
              </div>
              <div className="mt-3">
                <span className="text-[var(--vscode-terminal-green)]">
                  PS C:\Users\benjamaeb\OneDrive\Documents\arandelle\arandelle.com&gt;
                </span>
                <span className="text-[var(--vscode-text)]"> ssh root@143.198.1.27</span>
              </div>
              <div className="mt-2 text-[var(--vscode-text-muted)]">
                <div>Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_64)</div>
                <div className="mt-1"> * Documentation:  https://help.ubuntu.com</div>
                <div> * Management:     https://landscape.canonical.com</div>
                <div> * Support:        https://ubuntu.com/advantage</div>
              </div>
              <div className="mt-3 text-[var(--vscode-terminal-green)]">
                <div>   _____                        _   _       _           </div>
                <div>  |  ___| __ __ _ _ __ ___   __ _| |_(_) __| | ___ _ __ </div>
                <div>  | |_ | &apos;__/ _` | &apos;_ ` _ \ / _` | __| |/ _` |/ _ \ &apos;__|</div>
                <div>  |  _|| | | (_| | | | | | | (_| | |_| | (_| |  __/ |   </div>
                <div>  |_|  |_|  \__,_|_| |_| |_|\__,_|\__|_|\__,_|\___|_|   </div>
              </div>
              <div className="mt-3">
                <span className="text-[var(--vscode-terminal-green)]">root@portfolio</span>
                <span className="text-[var(--vscode-text)]">:</span>
                <span className="text-[var(--vscode-terminal-blue)]">~</span>
                <span className="text-[var(--vscode-text)]">$ </span>
                <span className="text-[var(--vscode-text)]">cat portrait.ascii</span>
              </div>
              <div className="mt-2">
                <AsciiPortrait width={50} />
              </div>
              <div className="mt-2">
                <span className="text-[var(--vscode-terminal-green)]">root@portfolio</span>
                <span className="text-[var(--vscode-text)]">:</span>
                <span className="text-[var(--vscode-terminal-blue)]">~</span>
                <span className="text-[var(--vscode-text)]">$ </span>
                <span className="inline-block w-2 h-4 bg-[var(--vscode-text)] animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "problems" && panelHeight > 36 && (
          <div className="p-4 text-[12px] text-[var(--vscode-text-muted)] font-mono">
            No problems have been detected in the workspace.
          </div>
        )}

        {activeTab === "output" && panelHeight > 36 && (
          <div className="p-4 text-[12px] text-[var(--vscode-text-muted)] font-mono">
            <div>[Info  - 10:42:15] Starting portfolio server...</div>
            <div className="text-[var(--vscode-text)]">
              [Info  - 10:42:16] Server running on http://localhost:3000
            </div>
            <div>[Info  - 10:42:16] Watching for file changes...</div>
          </div>
        )}

        {activeTab === "debug" && panelHeight > 36 && (
          <div className="p-4 text-[12px] text-[var(--vscode-text-muted)] font-mono">
            Debug console not active. Press F5 to start debugging.
          </div>
        )}

        {activeTab === "ports" && panelHeight > 36 && (
          <div className="p-4 text-[12px] text-[var(--vscode-text-muted)] font-mono">
            No ports forwarded.
          </div>
        )}
      </div>
    </div>
  );
}
