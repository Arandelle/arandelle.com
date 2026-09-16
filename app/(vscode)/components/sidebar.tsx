"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import {
  ChevronRight,
  FileCode2,
  Folder,
  FileText,
  Search,
  GitBranch,
  Blocks,
  Sun,
  Moon,
  Monitor,
  Palette,
} from "lucide-react";
import { usePortfolio } from "@/context/vscode-context";
import {
  projects as staticProjects,
  articles as staticArticles,
  timeline as staticTimeline,
} from "@/lib/data";
import type { FileItem } from "../types";

export function Sidebar() {
  const { sidebarPanel, sidebarOpen, closeSidebar } = usePortfolio();

  const panelTitles: Record<string, string> = {
    explorer: "EXPLORER",
    search: "SEARCH",
    "source-control": "SOURCE CONTROL",
    extensions: "EXTENSIONS",
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`${
          sidebarOpen
            ? "w-[72vw] sm:w-[var(--sidebar-width)]"
            : "w-0 overflow-hidden"
        } shrink-0 bg-[var(--vscode-sidebar-bg)] border-r border-[var(--vscode-border)] flex flex-col transition-[width] duration-150 z-40 md:z-auto fixed md:relative left-0 top-0 h-full`}
      >
        <div className="px-4 py-3 text-[11px] font-semibold tracking-wider text-[var(--vscode-text-muted)] uppercase">
          {panelTitles[sidebarPanel]}
        </div>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {sidebarPanel === "explorer" && <ExplorerPanel />}
          {sidebarPanel === "search" && <SearchPanel />}
          {sidebarPanel === "source-control" && <SourceControlPanel />}
          {sidebarPanel === "extensions" && <ExtensionsPanel />}
        </div>
      </aside>
    </>
  );
}

/* ── Explorer Panel ─────────────────────────────────────────────────────── */

function ExplorerPanel() {
  const { data, openFile, closeSidebar } = usePortfolio();

  const projects = data.projects ?? staticProjects;
  const articles = data.articles ?? staticArticles;

  const projectFiles: FileItem[] = projects.map((p) => ({
    id: `project-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name: `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.tsx`,
    icon: FileCode2,
    iconColor: "#4ec9b0",
  }));

  const articleFiles: FileItem[] = articles.map((a) => ({
    id: `article-${a.slug}`,
    name: `${a.slug}.mdx`,
    icon: FileText,
    iconColor: "#569cd6",
  }));

  const fileTree: FileItem[] = [
    { id: "about", name: "about.tsx", icon: FileCode2, iconColor: "#4ec9b0" },
    {
      id: "experience",
      name: "experience.tsx",
      icon: FileCode2,
      iconColor: "#4ec9b0",
    },
    {
      id: "projects-folder",
      name: "projects",
      icon: Folder,
      iconColor: "#dcdcaa",
      children: projectFiles,
    },
    {
      id: "blogs-folder",
      name: "blogs",
      icon: Folder,
      iconColor: "#dcdcaa",
      children: articleFiles,
    },
  ];

  const handleFileClick = (item: FileItem) => {
    if (item.children) return;
    openFile(item.id, item.name, item.icon, item.iconColor);
    if (window.innerWidth < 768) closeSidebar();
  };

  return (
    <div className="px-2 pb-4">
      <div className="px-2 py-1 text-[11px] font-semibold text-[var(--vscode-text-muted)] uppercase tracking-wider">
        portfolio
      </div>
      {fileTree.map((item) => (
        <TreeNode
          key={item.id}
          item={item}
          depth={0}
          onFileClick={handleFileClick}
        />
      ))}
    </div>
  );
}

function TreeNode({
  item,
  depth,
  onFileClick,
}: {
  item: FileItem;
  depth: number;
  onFileClick: (item: FileItem) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const isFolder = !!item.children;
  const Icon = item.icon;

  return (
    <div>
      <button
        onClick={() => {
          if (isFolder) setExpanded((p) => !p);
          else onFileClick(item);
        }}
        className="flex items-center w-full py-[3px] pr-2 text-[13px] hover:bg-[var(--vscode-line-highlight)] rounded-sm transition-colors"
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {isFolder && (
          <ChevronRight
            size={14}
            className={`mr-1 shrink-0 transition-transform text-[var(--vscode-text-muted)] ${expanded ? "rotate-90" : ""}`}
          />
        )}
        {!isFolder && <span className="w-[14px] mr-1 shrink-0" />}
        <Icon
          size={16}
          className="mr-1.5 shrink-0"
          style={{ color: item.iconColor }}
          strokeWidth={1.5}
        />
        <span className="truncate text-[var(--vscode-text)]">{item.name}</span>
      </button>
      {isFolder && expanded && (
        <div>
          {item.children!.map((child) => (
            <TreeNode
              key={child.id}
              item={child}
              depth={depth + 1}
              onFileClick={onFileClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Search Panel ───────────────────────────────────────────────────────── */

function SearchPanel() {
  const { data, openFile, closeSidebar } = usePortfolio();
  const [query, setQuery] = useState("");

  const experiences = data.experiences ?? [];
  const projects = data.projects ?? staticProjects;
  const articles = data.articles ?? staticArticles;

  const q = query.toLowerCase().trim();

  const results = q
    ? [
        ...experiences
          .filter(
            (e) =>
              (e.title ?? e.role ?? "")
                .toLowerCase()
                .includes(q) ||
              e.company.toLowerCase().includes(q) ||
              e.description.toLowerCase().includes(q),
          )
          .map((e) => ({
            id: "experience",
            name: "experience.tsx",
            match:
              e.title ?? e.role ?? e.company,
          })),
        ...projects
          .filter(
            (p) =>
              p.name.toLowerCase().includes(q) ||
              p.description.toLowerCase().includes(q),
          )
          .map((p) => ({
            id: `project-${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            name: `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.tsx`,
            match: p.name,
          })),
        ...articles
          .filter(
            (a) =>
              a.title.toLowerCase().includes(q) ||
              a.excerpt.toLowerCase().includes(q),
          )
          .map((a) => ({
            id: `article-${a.slug}`,
            name: `${a.slug}.mdx`,
            match: a.title,
          })),
      ]
    : [];

  const handleClick = (r: { id: string; name: string }) => {
    openFile(r.id, r.name, FileCode2, "#4ec9b0");
    if (window.innerWidth < 768) closeSidebar();
  };

  return (
    <div className="px-3 pb-4">
      <div className="relative mb-3">
        <Search
          size={14}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--vscode-text-muted)]"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search across portfolio..."
          className="w-full pl-8 pr-3 py-1.5 text-[13px] bg-[var(--vscode-input-bg)] border border-[var(--vscode-input-border)] rounded-sm text-[var(--vscode-text)] focus:outline-none focus:border-[var(--vscode-accent)]"
        />
      </div>

      {q && (
        <div className="text-[11px] text-[var(--vscode-text-muted)] mb-2">
          {results.length} result{results.length !== 1 ? "s" : ""}
        </div>
      )}

      <div className="space-y-0.5">
        {results.map((r, i) => (
          <button
            key={`${r.id}-${i}`}
            onClick={() => handleClick(r)}
            className="flex items-center w-full px-2 py-1.5 text-[13px] hover:bg-[var(--vscode-line-highlight)] rounded-sm transition-colors"
          >
            <FileCode2
              size={14}
              className="mr-2 shrink-0"
              style={{ color: "#4ec9b0" }}
              strokeWidth={1.5}
            />
            <div className="truncate">
              <div className="text-[var(--vscode-text)]">{r.match}</div>
              <div className="text-[11px] text-[var(--vscode-text-muted)]">
                {r.name}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Source Control Panel ───────────────────────────────────────────────── */

function SourceControlPanel() {
  const { data } = usePortfolio();

  const timeline = data.timeline ?? staticTimeline;

  const commits = timeline.map((item) => ({
    hash: Math.random().toString(16).slice(2, 9),
    message: `feat: ${item.title.toLowerCase()} at ${item.org}`,
    date: item.startDate,
    author: "arandelle",
  }));

  return (
    <div className="px-3 pb-4">
      <div className="flex items-center gap-2 mb-4 px-1">
        <GitBranch
          size={14}
          className="text-[var(--vscode-text-muted)]"
        />
        <span className="text-[13px] text-[var(--vscode-text)]">main</span>
        <span className="ml-auto text-[11px] text-[var(--vscode-text-muted)]">
          {commits.length} commits
        </span>
      </div>

      <div className="space-y-0">
        {commits.map((commit, i) => (
          <div
            key={i}
            className="flex gap-3 py-2 px-1 hover:bg-[var(--vscode-line-highlight)] rounded-sm"
          >
            <div className="flex flex-col items-center shrink-0">
              <div className="w-2 h-2 rounded-full bg-[var(--vscode-accent)] mt-1.5" />
              {i < commits.length - 1 && (
                <div className="w-px flex-1 bg-[var(--vscode-border)] mt-1" />
              )}
            </div>
            <div className="min-w-0 pb-2">
              <div className="text-[13px] text-[var(--vscode-text)] truncate">
                {commit.message}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-[var(--vscode-accent)] font-mono">
                  {commit.hash}
                </span>
                <span className="text-[11px] text-[var(--vscode-text-muted)]">
                  {commit.date}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Theme Toggle (shared with v0) ─────────────────────────────────────── */

type Theme = "light" | "dark" | "system";

function getThemeSnapshot(): Theme {
  return (localStorage.getItem("theme") as Theme) || "system";
}

function getServerSnapshot(): Theme {
  return "system";
}

function subscribeTheme(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("theme-change", callback);
  const mql = window.matchMedia("(prefers-color-scheme: dark)");
  mql.addEventListener("change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("theme-change", callback);
    mql.removeEventListener("change", callback);
  };
}

function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerSnapshot,
  );

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    window.dispatchEvent(new Event("theme-change"));

    const resolved =
      newTheme === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : newTheme;

    document.documentElement.classList.toggle("dark", resolved === "dark");
    document.documentElement.style.colorScheme =
      resolved === "dark" ? "dark" : "light";
  }, []);

  const themes = [
    { value: "light" as const, icon: Sun, label: "Light" },
    { value: "dark" as const, icon: Moon, label: "Dark" },
    { value: "system" as const, icon: Monitor, label: "System" },
  ];

  return (
    <div className="flex gap-1 mt-1">
      {themes.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex items-center justify-center h-7 w-7 rounded border transition-colors ${
            theme === value
              ? "border-[var(--vscode-accent)] text-[var(--vscode-accent)]"
              : "border-[var(--vscode-border)] text-[var(--vscode-text-muted)] hover:border-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]"
          }`}
          title={label}
          aria-label={label}
        >
          <Icon size={14} />
        </button>
      ))}
    </div>
  );
}

/* ── Extensions Panel ──────────────────────────────────────────────────── */

function ExtensionsPanel() {
  const extensions = [
    {
      name: "Coffee",
      publisher: "developer-essentials",
      description: "Required to run this developer",
      installs: "∞",
      icon: "☕",
    },
    {
      name: "Rubber Duck",
      publisher: "debug-tools",
      description: "Talk through your problems, literally",
      installs: "42K",
      icon: "🦆",
    },
    {
      name: "Stack Overflow",
      publisher: "copy-paste-inc",
      description: "Professional copy-paste assistant",
      installs: "99M+",
      icon: "📋",
    },
  ];

  return (
    <div className="px-3 pb-4">
      <input
        type="text"
        placeholder="Search Extensions in Marketplace"
        className="w-full px-3 py-1.5 mb-3 text-[13px] bg-[var(--vscode-input-bg)] border border-[var(--vscode-input-border)] rounded-sm text-[var(--vscode-text)] focus:outline-none focus:border-[var(--vscode-accent)]"
        readOnly
      />

      {/* Color Theme extension */}
      <div className="mb-4 p-3 border border-[var(--vscode-border)] rounded-md bg-[var(--vscode-line-highlight)]">
        <div className="flex items-center gap-2 mb-2">
          <Palette size={16} className="text-[var(--vscode-accent)]" />
          <span className="text-[13px] font-medium text-[var(--vscode-text-bright)]">
            Color Theme
          </span>
        </div>
        <div className="text-[11px] text-[var(--vscode-text-muted)] mb-2">
          Switch between VS Code Light+ and Dark+
        </div>
        <ThemeToggle />
      </div>

      <div className="text-[11px] text-[var(--vscode-text-muted)] uppercase tracking-wider mb-2 px-1">
        Installed
      </div>

      <div className="space-y-1">
        {extensions.map((ext) => (
          <div
            key={ext.name}
            className="flex gap-3 p-2 hover:bg-[var(--vscode-line-highlight)] rounded-sm cursor-default"
          >
            <div className="w-10 h-10 rounded flex items-center justify-center text-xl bg-[var(--vscode-input-bg)] border border-[var(--vscode-border)] shrink-0">
              {ext.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13px] text-[var(--vscode-text-bright)] font-medium">
                {ext.name}
              </div>
              <div className="text-[11px] text-[var(--vscode-text-muted)] truncate">
                {ext.description}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-[var(--vscode-text-muted)]">
                  {ext.publisher}
                </span>
                <span className="text-[11px] text-[var(--vscode-text-muted)]">
                  ⬇ {ext.installs}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
