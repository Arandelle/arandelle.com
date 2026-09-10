"use client";

import { Code2 } from "lucide-react";
import { usePortfolio } from "../context";
import { FileCode2, FileText } from "lucide-react";

export function Welcome() {
  const { openFile } = usePortfolio();

  const shortcuts = [
    { id: "about", name: "about.tsx", icon: FileCode2, iconColor: "#4ec9b0", label: "Open about.tsx" },
    { id: "experience", name: "experience.tsx", icon: FileCode2, iconColor: "#4ec9b0", label: "Open experience.tsx" },
    { label: "Toggle Search", action: "search" as const },
  ];

  return (
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
        {shortcuts.map((s, i) => {
          if ("action" in s) {
            return (
              <div
                key={i}
                className="flex items-center gap-3 text-[13px] text-[var(--vscode-text-muted)]"
              >
                <kbd className="px-1.5 py-0.5 bg-[var(--vscode-input-bg)] border border-[var(--vscode-border)] rounded text-[11px] font-mono">
                  Ctrl+Shift+F
                </kbd>
                <span>{s.label}</span>
              </div>
            );
          }
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => openFile(s.id, s.name, s.icon, s.iconColor)}
              className="flex items-center gap-3 text-[13px] text-[var(--vscode-accent)] hover:text-[var(--vscode-accent-hover)] transition-colors"
            >
              <Icon
                size={14}
                style={{ color: s.iconColor }}
                strokeWidth={1.5}
              />
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
