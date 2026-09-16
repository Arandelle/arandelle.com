"use client";

import type { LucideIcon } from "lucide-react";
import { Code2, ArrowUpRight } from "lucide-react";
import { usePortfolio } from "@/context/vscode-context";
import { FileCode2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
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

  const shortcuts: Shortcut[] = [
    { id: "about", name: "about.tsx", icon: FileCode2, iconColor: "#4ec9b0", label: "Open about.tsx", keyCombo: "Ctrl+Shift+A" },
  ];

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) {
      return;
    }

    if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "A") {
      e.preventDefault();
      openFile("about", "about.tsx", FileCode2, "#4ec9b0");
    }
  }, [openFile]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

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
              onClick={() => router.push("/me")}
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
    </div>
  );
}
