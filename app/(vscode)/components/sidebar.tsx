"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  ChevronRight,
  FileCode2,
  Folder,
  FolderOpen,
  FileText,
  Search,
  GitBranch,
  ExternalLink,
  Mail,
  Globe,
  Code2,
  Plus,
  FolderPlus,
  RefreshCw,
  ChevronsUpDown,
  Trash2,
  Moon,
  Ellipsis,
} from "lucide-react";
import { usePortfolio } from "@/context/vscode-context";
import {
  projects as staticProjects,
  articles as staticArticles,
  timeline as staticTimeline,
  socials as staticSocials,
  profile as staticProfile,
} from "@/lib/data";
import type { FileItem, SidebarPanel } from "../types";
import { ThemeToggle } from "@/components/theme-toggle";

export function Sidebar() {
  const { sidebarPanel, sidebarOpen, closeSidebar, isMobile, setSidebarPanel } = usePortfolio();

  const panelTitles: Record<string, string> = {
    explorer: "EXPLORER",
    search: "SEARCH",
    "source-control": "SOURCE CONTROL",
    extensions: "EXTENSIONS",
    settings: "SETTINGS",
    account: "ACCOUNT",
  };

  if (!sidebarOpen) return null;

  if (isMobile) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeSidebar}
        />
        <aside className="fixed left-0 top-8 bottom-[var(--statusbar-height)] w-[80vw] max-w-[320px] z-50 bg-[var(--vscode-sidebar-bg)] border-r border-[var(--vscode-border)] flex flex-col shadow-xl">
          <div className="flex items-center border-b border-[var(--vscode-border)] overflow-x-auto shrink-0">
            {(Object.keys(panelTitles) as SidebarPanel[]).map((panel) => (
              <button
                key={panel}
                onClick={() => setSidebarPanel(panel)}
                className={`px-3 py-2 text-[11px] uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${sidebarPanel === panel
                  ? "text-[var(--vscode-text-bright)] border-[var(--vscode-accent)]"
                  : "text-[var(--vscode-text-muted)] border-transparent hover:text-[var(--vscode-text)]"
                  }`}
              >
                {panelTitles[panel]}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {sidebarPanel === "explorer" && <ExplorerPanel />}
            {sidebarPanel === "search" && <SearchPanel />}
            {sidebarPanel === "source-control" && <SourceControlPanel />}
            {sidebarPanel === "extensions" && <ExtensionsPanel />}
            {sidebarPanel === "settings" && <SettingsPanel />}
            {sidebarPanel === "account" && <AccountPanel />}
          </div>
        </aside>
      </>
    );
  }

  return (
    <aside className="w-[var(--sidebar-width)] shrink-0 bg-[var(--vscode-sidebar-bg)] border-r border-[var(--vscode-border)] flex flex-col">
      <div className="px-4 py-3 text-[11px] flex items-center justify-between font-semibold tracking-wider text-[var(--vscode-text-muted)] uppercase">
        {panelTitles[sidebarPanel]}

        <Ellipsis size={14} />

      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {sidebarPanel === "explorer" && <ExplorerPanel />}
        {sidebarPanel === "search" && <SearchPanel />}
        {sidebarPanel === "source-control" && <SourceControlPanel />}
        {sidebarPanel === "extensions" && <ExtensionsPanel />}
        {sidebarPanel === "settings" && <SettingsPanel />}
        {sidebarPanel === "account" && <AccountPanel />}
      </div>
    </aside>
  );
}

/* ── Explorer Panel ─────────────────────────────────────────────────────── */

function ExplorerPanel() {
  const {
    data, openFile, closeSidebar, activeTabId, isAdmin,
    dbFiles, sandboxFiles, refreshFiles, createFile, createSandboxFile,
    createFolder, deleteFile, deleteSandboxFile, updateFile, updateSandboxFile,
  } = usePortfolio();

  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(new Set());
  const [inlineInput, setInlineInput] = useState<{ folderId: string | null; type: "file" | "folder"; sandbox?: boolean } | null>(null);
  const [inlineValue, setInlineValue] = useState("");
  const inlineRef = useRef<HTMLInputElement>(null);

  // Focus inline input when it appears
  useEffect(() => {
    if (inlineInput && inlineRef.current) {
      inlineRef.current.focus();
    }
  }, [inlineInput]);

  const toggleFolder = useCallback((folderId: string) => {
    setCollapsedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  }, []);

  const collapseAll = useCallback(() => {
    const folderIds = dbFiles.filter(f => f.isFolder).map(f => f.id);
    setCollapsedFolders(new Set(folderIds));
  }, [dbFiles]);

  const handleInlineSubmit = useCallback(async () => {
    if (!inlineInput || !inlineValue.trim()) {
      setInlineInput(null);
      setInlineValue("");
      return;
    }
    const name = inlineValue.trim();
    if (inlineInput.type === "file") {
      if (inlineInput.sandbox) {
        // Visitor sandbox file — local only
        const file = createSandboxFile(name);
        openFile(`sandbox-${file.id}`, file.name, FileText, "#569cd6");
        if (window.innerWidth < 768) closeSidebar();
      } else {
        // Admin DB file
        const file = await createFile(name, inlineInput.folderId);
        if (file) {
          openFile(`file-${file.id}`, file.name, FileText, "#569cd6");
          if (window.innerWidth < 768) closeSidebar();
        }
      }
    } else {
      await createFolder(name, inlineInput.folderId);
    }
    setInlineInput(null);
    setInlineValue("");
  }, [inlineInput, inlineValue, createFile, createSandboxFile, createFolder, openFile, closeSidebar]);

  const handleInlineKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleInlineSubmit();
    if (e.key === "Escape") {
      setInlineInput(null);
      setInlineValue("");
    }
  }, [handleInlineSubmit]);

  // Build tree from flat DB files + hardcoded files
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

  // Hardcoded files (always present)
  const hardcodedFiles: FileItem[] = [
    { id: "about", name: "about.tsx", icon: FileCode2, iconColor: "#4ec9b0" },
    { id: "experience", name: "experience.tsx", icon: FileCode2, iconColor: "#4ec9b0" },
    { id: "projects-folder", name: "projects", icon: Folder, iconColor: "#dcdcaa", children: projectFiles },
    { id: "blogs-folder", name: "blogs", icon: Folder, iconColor: "#dcdcaa", children: articleFiles },
  ];

  // DB files grouped by folder
  const rootDbFiles = dbFiles.filter(f => !f.folderId);

  const handleFileClick = (item: FileItem) => {
    if (item.children) return;
    openFile(item.id, item.name, item.icon, item.iconColor);
    if (window.innerWidth < 768) closeSidebar();
  };

  const handleDbFileClick = (file: typeof dbFiles[0]) => {
    if (file.isFolder) {
      toggleFolder(file.id);
      return;
    }
    // Everyone can open DB files — visitors get read-only editor with warning on type
    openFile(`file-${file.id}`, file.name, FileText, "#569cd6");
    if (window.innerWidth < 768) closeSidebar();
  };

  return (
    <div className="pb-4">
      {/* Header with actions */}
      <div className="flex items-center justify-between px-4 py-1 explorer-row group relative">
        <span className="text-[11px] font-semibold text-[var(--vscode-text-muted)] uppercase tracking-wider">
          Portfolio
        </span>
        <div className="explorer-actions flex items-center gap-0.5">
          <button
            onClick={() => { setInlineInput({ folderId: null, type: "file", sandbox: !isAdmin }); setInlineValue(""); }}
            className="p-1 rounded hover:bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]"
            title={isAdmin ? "New File" : "New Sandbox File"}
          >
            <Plus size={14} />
          </button>
          {isAdmin && (
            <>
              <button
                onClick={() => { setInlineInput({ folderId: null, type: "folder" }); setInlineValue(""); }}
                className="p-1 rounded hover:bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]"
                title="New Folder"
              >
                <FolderPlus size={14} />
              </button>
              <button
                onClick={refreshFiles}
                className="p-1 rounded hover:bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]"
                title="Refresh"
              >
                <RefreshCw size={14} />
              </button>
              <button
                onClick={collapseAll}
                className="p-1 rounded hover:bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]"
                title="Collapse All"
              >
                <ChevronsUpDown size={14} />
              </button>
            </>
          )}
        </div>

      </div>

      {/* Inline creation input at root level */}
      {inlineInput && inlineInput.folderId === null && (
        <div className="px-2 py-0.5" style={{ paddingLeft: "28px" }}>
          <input
            ref={inlineRef}
            value={inlineValue}
            onChange={(e) => setInlineValue(e.target.value)}
            onKeyDown={handleInlineKeyDown}
            onBlur={handleInlineSubmit}
            placeholder={inlineInput.type === "file" ? "filename.mdx" : "folder name"}
            className="w-full px-1.5 py-0.5 text-[13px] bg-[var(--vscode-input-bg)] border border-[var(--vscode-accent)] rounded-sm text-[var(--vscode-text)] outline-none"
          />
        </div>
      )}

      {/* DB files (root level) */}
      {rootDbFiles.map(file => (
        <DbFileNode
          key={file.id}
          file={file}
          allFiles={dbFiles}
          depth={0}
          activeTabId={activeTabId}
          collapsedFolders={collapsedFolders}
          isAdmin={isAdmin}
          onClick={() => handleDbFileClick(file)}
          onToggleFolder={toggleFolder}
          onDelete={deleteFile}
          onRename={updateFile}
          onCreateInFolder={(folderId, type) => { setInlineInput({ folderId, type }); setInlineValue(""); }}
          inlineInput={inlineInput}
          inlineValue={inlineValue}
          setInlineValue={setInlineValue}
          onInlineSubmit={handleInlineSubmit}
          onInlineKeyDown={handleInlineKeyDown}
          inlineRef={inlineRef}
        />
      ))}

      {/* Sandbox files (visitor-created, local only) */}
      {sandboxFiles.length > 0 && (
        <>
          <div className="mt-2 px-2 py-1 flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[var(--vscode-text-muted)] uppercase tracking-wider">
              sandbox
            </span>
            <span className="text-[9px] font-mono text-[var(--vscode-accent)] uppercase">local only</span>
          </div>
          {sandboxFiles.map(file => (
            <SandboxFileNode
              key={file.id}
              file={file}
              activeTabId={activeTabId}
              onUpdate={updateSandboxFile}
              onDelete={deleteSandboxFile}
            />
          ))}
        </>
      )}

      {/* Hardcoded portfolio tree — shown only when the DB has no files yet.
          Once admins add files to the DB, those take over and this fallback hides. */}
      {dbFiles.length === 0 && (
        <>
          <div className="mt-2 px-4 py-1">
            <span className="text-[11px] font-semibold text-[var(--vscode-text-muted)] uppercase tracking-wider">
              portfolio
            </span>
          </div>
          {hardcodedFiles.map((item) => (
            <TreeNode
              key={item.id}
              item={item}
              depth={0}
              activeTabId={activeTabId}
              onFileClick={handleFileClick}
            />
          ))}
        </>
      )}
    </div>
  );
}

/* ── DB File Node (recursive for folders) ──────────────────────────────── */

function DbFileNode({
  file, allFiles, depth, activeTabId, collapsedFolders, isAdmin,
  onClick, onToggleFolder, onDelete, onRename, onCreateInFolder,
  inlineInput, inlineValue, setInlineValue, onInlineSubmit, onInlineKeyDown, inlineRef,
}: {
  file: { id: string; name: string; isFolder: boolean; folderId: string | null };
  allFiles: { id: string; name: string; isFolder: boolean; folderId: string | null }[];
  depth: number;
  activeTabId: string | null;
  collapsedFolders: Set<string>;
  isAdmin: boolean;
  onClick: () => void;
  onToggleFolder: (id: string) => void;
  onDelete: (id: string) => Promise<boolean>;
  onRename: (id: string, updates: { name?: string }) => Promise<boolean>;
  onCreateInFolder: (folderId: string, type: "file" | "folder") => void;
  inlineInput: { folderId: string | null; type: "file" | "folder" } | null;
  inlineValue: string;
  setInlineValue: (v: string) => void;
  onInlineSubmit: () => void;
  onInlineKeyDown: (e: React.KeyboardEvent) => void;
  inlineRef: React.RefObject<HTMLInputElement | null>;
}) {
  const isActive = !file.isFolder && activeTabId === `file-${file.id}`;
  const isExpanded = !collapsedFolders.has(file.id);
  const children = file.isFolder ? allFiles.filter(f => f.folderId === file.id) : [];
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(file.name);
  const renameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renaming && renameRef.current) renameRef.current.focus();
  }, [renaming]);

  const handleRenameSubmit = async () => {
    if (renameValue.trim() && renameValue !== file.name) {
      await onRename(file.id, { name: renameValue.trim() });
    }
    setRenaming(false);
  };

  return (
    <div>
      <div className={`explorer-row group flex items-center w-full py-[3px] pr-2 text-[13px] rounded-sm transition-colors ${isActive
        ? "bg-[var(--vscode-list-hover)] text-[var(--vscode-text-bright)]"
        : "hover:bg-[var(--vscode-line-highlight)]"
        }`} style={{ paddingLeft: `${12 + depth * 16}px` }}>
        {/* Clickable area */}
        <button
          onClick={onClick}
          onDoubleClick={() => isAdmin && !file.isFolder && setRenaming(true)}
          className="flex items-center flex-1 min-w-0"
        >
          {file.isFolder ? (
            <>
              <ChevronRight
                size={14}
                className={`mr-1 shrink-0 transition-transform text-[var(--vscode-text-muted)] ${isExpanded ? "rotate-90" : ""}`}
              />
              {isExpanded
                ? <FolderOpen size={16} className="mr-1.5 shrink-0 text-[#dcdcaa]" strokeWidth={1.5} />
                : <Folder size={16} className="mr-1.5 shrink-0 text-[#dcdcaa]" strokeWidth={1.5} />
              }
            </>
          ) : (
            <>
              <span className="w-[14px] mr-1 shrink-0" />
              <FileText size={16} className="mr-1.5 shrink-0 text-[#569cd6]" strokeWidth={1.5} />
            </>
          )}
          {renaming ? (
            <input
              ref={renameRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameSubmit();
                if (e.key === "Escape") setRenaming(false);
              }}
              onBlur={handleRenameSubmit}
              className="flex-1 px-1 py-0 text-[13px] bg-[var(--vscode-input-bg)] border border-[var(--vscode-accent)] rounded-sm text-[var(--vscode-text)] outline-none min-w-0"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="truncate text-[var(--vscode-text)]">{file.name}</span>
          )}
        </button>

        {/* Hover actions for admin */}
        {isAdmin && !renaming && (
          <div className="explorer-actions flex items-center gap-0.5 ml-1 shrink-0">
            {file.isFolder && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); onCreateInFolder(file.id, "file"); }}
                  className="p-0.5 rounded hover:bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]"
                  title="New File"
                >
                  <Plus size={12} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onCreateInFolder(file.id, "folder"); }}
                  className="p-0.5 rounded hover:bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)]"
                  title="New Folder"
                >
                  <FolderPlus size={12} />
                </button>
              </>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
              className="p-0.5 rounded hover:bg-red-500/20 text-[var(--vscode-text-muted)] hover:text-red-400"
              title="Delete"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Inline creation input inside this folder */}
      {file.isFolder && isExpanded && inlineInput && inlineInput.folderId === file.id && (
        <div className="py-0.5" style={{ paddingLeft: `${28 + (depth + 1) * 16}px` }}>
          <input
            ref={inlineRef}
            value={inlineValue}
            onChange={(e) => setInlineValue(e.target.value)}
            onKeyDown={onInlineKeyDown}
            onBlur={onInlineSubmit}
            placeholder={inlineInput.type === "file" ? "filename.mdx" : "folder name"}
            className="w-full px-1.5 py-0.5 text-[13px] bg-[var(--vscode-input-bg)] border border-[var(--vscode-accent)] rounded-sm text-[var(--vscode-text)] outline-none"
          />
        </div>
      )}

      {/* Children (if folder and expanded) */}
      {file.isFolder && isExpanded && children.map(child => (
        <DbFileNodeChild
          key={child.id}
          file={child}
          allFiles={allFiles}
          depth={depth + 1}
          activeTabId={activeTabId}
          collapsedFolders={collapsedFolders}
          isAdmin={isAdmin}
          onToggleFolder={onToggleFolder}
          onDelete={onDelete}
          onRename={onRename}
          onCreateInFolder={onCreateInFolder}
          inlineInput={inlineInput}
          inlineValue={inlineValue}
          setInlineValue={setInlineValue}
          onInlineSubmit={onInlineSubmit}
          onInlineKeyDown={onInlineKeyDown}
          inlineRef={inlineRef}
        />
      ))}
    </div>
  );
}

/* ── DB File Node Child (uses context directly for openFile) ─────────── */

function DbFileNodeChild({
  file, allFiles, depth, activeTabId, collapsedFolders, isAdmin,
  onToggleFolder, onDelete, onRename, onCreateInFolder,
  inlineInput, inlineValue, setInlineValue, onInlineSubmit, onInlineKeyDown, inlineRef,
}: {
  file: { id: string; name: string; isFolder: boolean; folderId: string | null };
  allFiles: { id: string; name: string; isFolder: boolean; folderId: string | null }[];
  depth: number;
  activeTabId: string | null;
  collapsedFolders: Set<string>;
  isAdmin: boolean;
  onToggleFolder: (id: string) => void;
  onDelete: (id: string) => Promise<boolean>;
  onRename: (id: string, updates: { name?: string }) => Promise<boolean>;
  onCreateInFolder: (folderId: string, type: "file" | "folder") => void;
  inlineInput: { folderId: string | null; type: "file" | "folder" } | null;
  inlineValue: string;
  setInlineValue: (v: string) => void;
  onInlineSubmit: () => void;
  onInlineKeyDown: (e: React.KeyboardEvent) => void;
  inlineRef: React.RefObject<HTMLInputElement | null>;
}) {
  const { openFile, closeSidebar } = usePortfolio();

  const handleClick = () => {
    if (file.isFolder) {
      onToggleFolder(file.id);
    } else {
      openFile(`file-${file.id}`, file.name, FileText, "#569cd6");
      if (window.innerWidth < 768) closeSidebar();
    }
  };

  return (
    <DbFileNode
      file={file}
      allFiles={allFiles}
      depth={depth}
      activeTabId={activeTabId}
      collapsedFolders={collapsedFolders}
      isAdmin={isAdmin}
      onClick={handleClick}
      onToggleFolder={onToggleFolder}
      onDelete={onDelete}
      onRename={onRename}
      onCreateInFolder={onCreateInFolder}
      inlineInput={inlineInput}
      inlineValue={inlineValue}
      setInlineValue={setInlineValue}
      onInlineSubmit={onInlineSubmit}
      onInlineKeyDown={onInlineKeyDown}
      inlineRef={inlineRef}
    />
  );
}

/* ── Sandbox File Node (local-only, editable by anyone) ─────────────── */

function SandboxFileNode({
  file, activeTabId, onUpdate, onDelete,
}: {
  file: { id: string; name: string };
  activeTabId: string | null;
  onUpdate: (id: string, updates: { name?: string; content?: string }) => void;
  onDelete: (id: string) => void;
}) {
  const { openFile, closeSidebar } = usePortfolio();
  const isActive = activeTabId === `sandbox-${file.id}`;
  const [renaming, setRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(file.name);
  const renameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (renaming && renameRef.current) renameRef.current.focus();
  }, [renaming]);

  const handleRenameSubmit = () => {
    if (renameValue.trim() && renameValue !== file.name) {
      onUpdate(file.id, { name: renameValue.trim() });
    }
    setRenaming(false);
  };

  return (
    <div className="explorer-row group flex items-center w-full py-[3px] pr-2 text-[13px] rounded-sm hover:bg-[var(--vscode-line-highlight)] transition-colors"
      style={{ paddingLeft: "12px" }}>
      <button
        onClick={() => {
          openFile(`sandbox-${file.id}`, file.name, FileText, "#569cd6");
          if (window.innerWidth < 768) closeSidebar();
        }}
        onDoubleClick={() => setRenaming(true)}
        className={`flex items-center flex-1 min-w-0 ${isActive ? "text-[var(--vscode-text-bright)]" : ""}`}
      >
        <span className="w-[14px] mr-1 shrink-0" />
        <FileText size={16} className="mr-1.5 shrink-0 text-[#569cd6]" strokeWidth={1.5} />
        {renaming ? (
          <input
            ref={renameRef}
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleRenameSubmit();
              if (e.key === "Escape") setRenaming(false);
            }}
            onBlur={handleRenameSubmit}
            className="flex-1 px-1 py-0 text-[13px] bg-[var(--vscode-input-bg)] border border-[var(--vscode-accent)] rounded-sm text-[var(--vscode-text)] outline-none min-w-0"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <span className="truncate text-[var(--vscode-text)]">{file.name}</span>
        )}
      </button>
      {!renaming && (
        <div className="explorer-actions flex items-center gap-0.5 ml-1 shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
            className="p-0.5 rounded hover:bg-red-500/20 text-[var(--vscode-text-muted)] hover:text-red-400"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </div>
  );
}

// Original TreeNode for hardcoded files
function TreeNode({
  item,
  depth,
  activeTabId,
  onFileClick,
}: {
  item: FileItem;
  depth: number;
  activeTabId: string | null;
  onFileClick: (item: FileItem) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const isFolder = !!item.children;
  const isActive = !isFolder && activeTabId === item.id;
  const Icon = item.icon;

  return (
    <div>
      <button
        onClick={() => {
          if (isFolder) setExpanded((p) => !p);
          else onFileClick(item);
        }}
        className={`flex items-center w-full py-[3px] pr-2 text-[13px] rounded-sm transition-colors ${isActive
          ? "bg-[var(--vscode-list-hover)] text-[var(--vscode-text-bright)]"
          : "hover:bg-[var(--vscode-line-highlight)]"
          }`}
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
              activeTabId={activeTabId}
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

/* ── Settings Panel ─────────────────────────────────────────────────────── */

function SettingsPanel() {
  return (
    <div className="px-3 pb-4">
      <div className="mb-4 p-3 border border-[var(--vscode-border)] rounded-md bg-[var(--vscode-line-highlight)]">
        <div className="text-[13px] font-medium text-[var(--vscode-text-bright)] mb-2">
          Color Theme
        </div>
        <div className="text-[11px] text-[var(--vscode-text-muted)] mb-3">
          Switch between VS Code Light+ and Dark+
        </div>
        <ThemeToggle />
      </div>

      <div className="text-[11px] text-[var(--vscode-text-muted)] uppercase tracking-wider mb-2 px-1">
        Editor
      </div>
      <div className="space-y-0.5">
        {[
          { label: "Font Size", value: "13px" },
          { label: "Tab Size", value: "2" },
          { label: "Word Wrap", value: "off" },
          { label: "Minimap", value: "disabled" },
        ].map((setting) => (
          <div
            key={setting.label}
            className="flex items-center justify-between px-2 py-1.5 hover:bg-[var(--vscode-line-highlight)] rounded-sm"
          >
            <span className="text-[13px] text-[var(--vscode-text)]">
              {setting.label}
            </span>
            <span className="text-[12px] text-[var(--vscode-text-muted)] font-mono">
              {setting.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Account Panel ──────────────────────────────────────────────────────── */

function AccountPanel() {
  const { data, isAdmin, adminUser, login, logout } = usePortfolio();
  const profile = data.profile ?? staticProfile;
  const socials = data.socials ?? staticSocials;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="px-3 pb-4">
      {/* Admin auth section */}
      {isAdmin ? (
        <div className="mb-4 p-3 border border-[var(--vscode-accent)]/30 rounded-md bg-[var(--vscode-line-highlight)]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--vscode-accent)]">
              Admin Mode
            </span>
          </div>
          <div className="text-[13px] text-[var(--vscode-text-bright)] mb-1">
            {adminUser?.name}
          </div>
          <div className="text-[11px] text-[var(--vscode-text-muted)] mb-3">
            {adminUser?.email}
          </div>
          <button
            onClick={logout}
            className="w-full px-3 py-1.5 text-[12px] font-mono border border-[var(--vscode-border)] rounded-sm text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] hover:border-[var(--vscode-text-muted)] transition-colors"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="mb-4 p-3 border border-[var(--vscode-border)] rounded-md bg-[var(--vscode-line-highlight)]">
          <div className="text-[11px] font-mono uppercase tracking-wider text-[var(--vscode-text-muted)] mb-3">
            Admin Login
          </div>
          <form onSubmit={handleLogin} className="space-y-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-2.5 py-1.5 text-[13px] bg-[var(--vscode-input-bg)] border border-[var(--vscode-input-border)] rounded-sm text-[var(--vscode-text)] focus:outline-none focus:border-[var(--vscode-accent)]"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full px-2.5 py-1.5 text-[13px] bg-[var(--vscode-input-bg)] border border-[var(--vscode-input-border)] rounded-sm text-[var(--vscode-text)] focus:outline-none focus:border-[var(--vscode-accent)]"
            />
            {error && (
              <div className="text-[11px] text-red-500">{error}</div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-3 py-1.5 text-[12px] font-mono bg-[var(--vscode-accent)] hover:bg-[var(--vscode-accent-hover)] text-white rounded-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      )}

      {/* Profile info (always visible) */}
      <div className="flex items-center gap-3 mb-4 px-1">
        <div className="w-10 h-10 rounded-full bg-[var(--vscode-accent)] flex items-center justify-center text-white text-[16px] font-semibold shrink-0">
          {profile.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <div className="text-[14px] font-medium text-[var(--vscode-text-bright)] truncate">
            {profile.name}
          </div>
          <div className="text-[12px] text-[var(--vscode-text-muted)] truncate">
            {profile.role}
          </div>
        </div>
      </div>

      <div className="text-[11px] text-[var(--vscode-text-muted)] uppercase tracking-wider mb-2 px-1">
        Contact
      </div>
      <div className="space-y-0.5 mb-4">
        <a
          href={`mailto:${profile.email}`}
          className="flex items-center gap-2 px-2 py-1.5 text-[13px] hover:bg-[var(--vscode-line-highlight)] rounded-sm transition-colors"
        >
          <Mail size={14} className="text-[var(--vscode-accent)] shrink-0" />
          <span className="text-[var(--vscode-text)] truncate">
            {profile.email}
          </span>
        </a>
      </div>

      <div className="text-[11px] text-[var(--vscode-text-muted)] uppercase tracking-wider mb-2 px-1">
        Social
      </div>
      <div className="space-y-0.5">
        {socials.map((social) => {
          const Icon = social.icon === "github" ? Code2 : Globe;
          return (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-2 py-1.5 text-[13px] hover:bg-[var(--vscode-line-highlight)] rounded-sm transition-colors group"
            >
              <Icon
                size={14}
                className="text-[var(--vscode-text-muted)] group-hover:text-[var(--vscode-accent)] shrink-0 transition-colors"
              />
              <span className="text-[var(--vscode-text)] truncate">
                {social.label}
              </span>
              <ExternalLink
                size={11}
                className="ml-auto text-[var(--vscode-text-muted)] opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </a>
          );
        })}
      </div>
    </div>
  );
}
