"use client";

import type { LucideIcon } from "lucide-react";
import { Code2, ArrowUpRight, Terminal, ChevronUp, ChevronDown, AlertCircle, Bug, Plug, X, Plus, Trash2, ChevronRight, ChevronDownIcon, Monitor } from "lucide-react";
import { usePortfolio } from "../context";
import { FileCode2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import AsciiPortrait from "@/components/portfolio/AsciiPortrait";
import type { FileId } from "../types";

interface Shortcut {
  id: FileId;
  name: string;
  icon: LucideIcon;
  iconColor: string;
  label: string;
  keyCombo: string;
}

export function Welcome() {
  const { openFile } = usePortfolio();
  const router = useRouter();
  const [panelHeight, setPanelHeight] = useState(36);
  const [activeTab, setActiveTab] = useState("terminal");
  const [isDragging, setIsDragging] = useState(false);
  const [showTerminalSelector, setShowTerminalSelector] = useState(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const selectorRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: "problems", label: "PROBLEMS", icon: AlertCircle, count: 0 },
    { id: "output", label: "OUTPUT", icon: ChevronRight },
    { id: "debug", label: "DEBUG CONSOLE", icon: Bug },
    { id: "terminal", label: "TERMINAL", icon: Terminal },
    { id: "ports", label: "PORTS", icon: Plug },
  ];

  const shortcuts: Shortcut[] = [
    { id: "about", name: "about.tsx", icon: FileCode2, iconColor: "#4ec9b0", label: "Open about.tsx", keyCombo: "Ctrl+Shift+A" },
  ];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger when typing in inputs
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
      return;
    }

    // Ctrl+Shift+A -> Open about.tsx
    if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "A") {
      e.preventDefault();
      openFile("about", "about.tsx", FileCode2, "#4ec9b0");
    }
    
    // Ctrl+` -> Toggle terminal panel
    if (e.ctrlKey && e.key === "`") {
      e.preventDefault();
      setPanelHeight((h) => (h > 36 ? 36 : 300));
    }
  }, [openFile]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Drag to resize handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartHeight.current = panelHeight;
  }, [panelHeight]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = dragStartY.current - e.clientY;
      const newHeight = Math.max(36, Math.min(600, dragStartHeight.current + delta));
      setPanelHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  // Close terminal selector when clicking outside
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
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Main welcome area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <Code2
          size={80}
          strokeWidth={1}
          className="text-[var(--vscode-border)] mb-8"
        />
        <h1
          className="text-[28px] font-light text-[var(--vscode-text-bright)] mb-2"
          style={{ fontFamily: "var(--font-vscode)" }}
        >
          Arandelle Paguinto
        </h1>
        <p className="text-[var(--vscode-text-muted)] mb-10 text-[14px]">
          Fullstack Web Developer — Select a file from the Explorer to get started
        </p>

        <div className="space-y-2 text-left">
          <div className="text-[11px] uppercase tracking-wider text-[var(--vscode-text-muted)] mb-3">
            Quick Access
          </div>
          {shortcuts.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => openFile(s.id, s.name, s.icon, s.iconColor)}
                className="flex items-center gap-3 w-full text-[13px] text-[var(--vscode-text)] hover:text-[var(--vscode-accent-hover)] hover:bg-[var(--vscode-line-highlight)] px-2 py-1 rounded-sm transition-colors"
              >
                <Icon
                  size={14}
                  style={{ color: s.iconColor }}
                  strokeWidth={1.5}
                />
                <span className="flex-1 text-left">{s.label}</span>
                <kbd className="px-1.5 py-0.5 bg-[var(--vscode-input-bg)] border border-[var(--vscode-border)] rounded text-[11px] font-mono text-[var(--vscode-text-muted)]">
                  {s.keyCombo}
                </kbd>
              </button>
            );
          })}

          {/* v0 link */}
          <div className="pt-3 border-t border-[var(--vscode-border)] mt-3">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-3 text-[13px] text-[var(--vscode-text)] hover:text-[var(--vscode-accent-hover)] transition-colors"
            >
              <ArrowUpRight size={14} style={{ color: "#569cd6" }} strokeWidth={1.5} />
              <span>Open v0 Portfolio</span>
              <span className="ml-auto text-[11px] text-[var(--vscode-text-muted)] font-mono">
                / →
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* VS Code Bottom Panel - Resizable */}
      <div 
        ref={panelRef}
        className="border-t border-[var(--vscode-border)] bg-[var(--vscode-panel-bg,#1e1e1e)] flex flex-col"
        style={{ height: panelHeight }}
      >
        {/* Drag handle */}
        <div
          onMouseDown={handleMouseDown}
          className={`h-1 cursor-row-resize ${isDragging ? "bg-[var(--vscode-accent)]" : "hover:bg-[var(--vscode-accent-hover,#444)]"} transition-colors`}
        />
        
        {/* Tab bar */}
        <div className="flex items-center border-b border-[var(--vscode-border)] bg-[var(--vscode-titlebar-bg,#252526)]">
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
                  <span className="ml-1 px-1.5 py-0.5 text-[9px] bg-[var(--vscode-badge-bg,#4d4d4d)] text-[var(--vscode-badge-text,#fff)] rounded-full">
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
              onClick={() => setPanelHeight(0)}
              className="p-1 hover:bg-[var(--vscode-line-highlight)] rounded text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]"
            >
              <X size={14} />
            </button>
          </div>
        </div>
        
        {/* Panel content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === "terminal" && panelHeight > 36 && (
            <div className="h-full flex flex-col">
              {/* Terminal selector bar */}
              <div className="flex items-center justify-between px-2 py-1 bg-[var(--vscode-titlebar-bg,#252526)] border-b border-[var(--vscode-border)]">
                <div className="flex items-center gap-1">
                  <button 
                    onClick={() => setShowTerminalSelector(!showTerminalSelector)}
                    className="flex items-center gap-1.5 px-2 py-0.5 text-[11px] hover:bg-[var(--vscode-line-highlight)] rounded transition-colors"
                  >
                    <Monitor size={12} className="text-[#012456]" />
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
                <div ref={selectorRef} className="absolute z-50 mt-6 left-2 bg-[var(--vscode-dropdown-bg,#3c3c3c)] border border-[var(--vscode-dropdown-border,#454545)] rounded shadow-lg">
                  <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-[var(--vscode-text-muted)]">Select Default Profile</div>
                  <button className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] hover:bg-[var(--vscode-list-hover,#2a2d2e)] text-[var(--vscode-text)]">
                    <Monitor size={14} className="text-[#012456]" />
                    <span>PowerShell</span>
                    <span className="ml-auto text-[10px] text-[var(--vscode-text-muted)]">Default</span>
                  </button>
                  <button className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] hover:bg-[var(--vscode-list-hover,#2a2d2e)] text-[var(--vscode-text)]">
                    <Terminal size={14} className="text-[var(--vscode-text-muted)]" />
                    <span>Command Prompt</span>
                  </button>
                  <button className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] hover:bg-[var(--vscode-list-hover,#2a2d2e)] text-[var(--vscode-text)]">
                    <Terminal size={14} className="text-[#4ec9b0]" />
                    <span>Git Bash</span>
                  </button>
                  <button className="flex items-center gap-2 w-full px-3 py-1.5 text-[12px] hover:bg-[var(--vscode-list-hover,#2a2d2e)] text-[var(--vscode-text)]">
                    <Terminal size={14} className="text-[#e6461d]" />
                    <span>Ubuntu (WSL)</span>
                  </button>
                </div>
              )}
              
              {/* ASCII Art content - SSH session style */}
              <div className="flex-1 overflow-auto p-3 bg-[var(--vscode-terminal-bg,#1e1e1e)] font-mono text-[12px]">
                <div className="text-[#012456]">Windows PowerShell</div>
                <div className="text-[var(--vscode-text-muted)]">Copyright (C) Microsoft Corporation. All rights reserved.</div>
                <div className="mt-2">
                  <span className="text-[var(--vscode-text-muted)]">Install the latest PowerShell for new features and improvements!</span>
                  <span className="text-[var(--vscode-accent,#569cd6)]"> https://aka.ms/PSWindows</span>
                </div>
                <div className="mt-3">
                  <span className="text-[#4ec9b0]">PS C:\Users\benjamaeb\OneDrive\Documents\arandelle\arandelle.com&gt;</span>
                  <span className="text-[var(--vscode-text)]"> ssh root@143.198.1.27</span>
                </div>
                <div className="mt-2 text-[var(--vscode-text-muted)]">
                  <div>Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_64)</div>
                  <div className="mt-1"> * Documentation:  https://help.ubuntu.com</div>
                  <div> * Management:     https://landscape.canonical.com</div>
                  <div> * Support:        https://ubuntu.com/advantage</div>
                </div>
                <div className="mt-3 text-[#4ec9b0]">
                  <div>   _____                        _   _       _           </div>
                  <div>  |  ___| __ __ _ _ __ ___   __ _| |_(_) __| | ___ _ __ </div>
                  <div>  | |_ | '__/ _` | '_ ` _ \ / _` | __| |/ _` |/ _ \ '__|</div>
                  <div>  |  _|| | | (_| | | | | | | (_| | |_| | (_| |  __/ |   </div>
                  <div>  |_|  |_|  \__,_|_| |_| |_|\__,_|\__|_|\__,_|\___|_|   </div>
                </div>
                <div className="mt-3">
                  <span className="text-[#4ec9b0]">root@portfolio</span>
                  <span className="text-[var(--vscode-text)]">:</span>
                  <span className="text-[#569cd6]">~</span>
                  <span className="text-[var(--vscode-text)]">$ </span>
                  <span className="text-[var(--vscode-text)]">cat portrait.ascii</span>
                </div>
                <div className="mt-2">
                  <AsciiPortrait width={50} />
                </div>
                <div className="mt-2">
                  <span className="text-[#4ec9b0]">root@portfolio</span>
                  <span className="text-[var(--vscode-text)]">:</span>
                  <span className="text-[#569cd6]">~</span>
                  <span className="text-[var(--vscode-text)]">$ </span>
                  <span className="inline-block w-2 h-4 bg-[var(--vscode-text)] animate-pulse"></span>
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
              <div className="text-[var(--vscode-text)]">[Info  - 10:42:16] Server running on http://localhost:3000</div>
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
    </div>
  );
}
