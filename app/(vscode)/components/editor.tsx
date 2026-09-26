"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  forwardRef,
  useLayoutEffect,
} from "react";
import { usePortfolio } from "@/context/vscode-context";
import { Welcome } from "./welcome";
import {
  projects as staticProjects,
  articles as staticArticles,
  profile as staticProfile,
  experiences as staticExperiences,
  expertise as staticExpertise,
  certifications as staticCertifications,
  socials as staticSocials,
} from "@/lib/data";
import { useTextareaCaret } from "@/app/hooks/useTextareaCaret";

const LINE_HEIGHT = 22;

export function Editor() {
  const { activeTabId, isMobile, openTabs, dbFiles, isAdmin, createFile, createSandboxFile, openFile, refreshFiles } = usePortfolio();
  const [creating, setCreating] = useState(false);

  const handleCreateFile = useCallback(async () => {
    if (!activeTabId || creating) return;
    setCreating(true);

    if (activeTabId.startsWith("file-")) {
      const dbFileId = activeTabId.replace("file-", "");
      const tab = openTabs.find(t => t.id === activeTabId);
      const fileName = tab?.name || "untitled.mdx";
      const existingFile = dbFiles.find(f => f.id === dbFileId);
      const folderId = existingFile?.folderId || null;

      if (isAdmin) {
        const file = await createFile(fileName, folderId);
        if (file) {
          await refreshFiles();
          openFile(`file-${file.id}`, file.name, tab?.icon || FileText, tab?.iconColor || "#569cd6");
        }
      } else {
        const file = createSandboxFile(fileName);
        openFile(`sandbox-${file.id}`, file.name, tab?.icon || FileText, tab?.iconColor || "#569cd6");
      }
    } else {
      const urlName = activeTabId.replace(/^(files|sandbox)-/, "");
      const fileName = urlName && !urlName.includes("-") ? urlName : "untitled.mdx";

      if (isAdmin) {
        const file = await createFile(fileName);
        if (file) {
          await refreshFiles();
          openFile(`file-${file.id}`, file.name, FileText, "#569cd6");
        }
      } else {
        const file = createSandboxFile(fileName);
        openFile(`sandbox-${file.id}`, file.name, FileText, "#569cd6");
      }
    }

    setCreating(false);
  }, [activeTabId, creating, openTabs, dbFiles, isAdmin, createFile, createSandboxFile, openFile, refreshFiles]);

  if (!activeTabId) return <Welcome />;

  // Sandbox files: id starts with "sandbox-"
  if (activeTabId.startsWith("sandbox-")) {
    const sandboxId = activeTabId.replace("sandbox-", "");
    return (
      <div className="flex-1 h-full flex overflow-hidden">
        <SandboxFileEditor sandboxId={sandboxId} />
      </div>
    );
  }

  // DB files: id starts with "file-"
  if (activeTabId.startsWith("file-")) {
    const dbFileId = activeTabId.replace("file-", "");
    return (
      <div className="flex-1 h-full flex overflow-hidden">
        <DbFileEditor fileId={dbFileId} />
      </div>
    );
  }

  // Unknown file prefix — file not found
  return (
    <div className="flex-1 h-full flex flex-col gap-3 items-center justify-center cursor-text overflow-hidden">
      <CircleX className="text-red-400" size={isMobile ? 24 : 45} />
      <p className="text-sm font-thin">The editor could not be opened because the file was not found.</p>
      <button
        onClick={handleCreateFile}
        disabled={creating}
        className="text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-2 px-3 rounded-sm transition-colors"
      >
        {creating ? "Creating..." : "Create File"}
      </button>
    </div>
  );
}

/* ── Sandbox File Editor (local-only, always editable) ─────────────── */

function SandboxFileEditor({ sandboxId }: { sandboxId: string }) {
  const { sandboxFiles, updateSandboxFile } = usePortfolio();
  const file = sandboxFiles.find((f) => f.id === sandboxId);
  const [lines, setLines] = useState<string[]>([""]);
  const [cursorLine, setCursorLine] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLines((file?.content ?? "").split("\n"));
    setCursorLine(0);
  }, [file?.id]); // Only reset when switching files, not on every content change

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newLines = e.target.value.split("\n");
      setLines(newLines);
      updateSandboxFile(sandboxId, { content: e.target.value });
    },
    [sandboxId, updateSandboxFile],
  );

  const handleSelect = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const textBefore = ta.value.slice(0, pos);
    setCursorLine(textBefore.split("\n").length - 1);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        return;
      }

      const ta = textareaRef.current;
      if (!ta) return;

      const PAIRS: Record<string, string> = { "[": "]", "{": "}", "(": ")", '"': '"', "'": "'", "`": "`" };
      const CLOSERS = new Set(Object.values(PAIRS));

      if (PAIRS[e.key]) {
        e.preventDefault();
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const val = ta.value;
        const closing = PAIRS[e.key];
        const selected = val.slice(start, end);
        if (selected.length > 0) {
          ta.value = val.slice(0, start) + e.key + selected + closing + val.slice(end);
          ta.selectionStart = start + 1;
          ta.selectionEnd = end + 1;
        } else {
          ta.value = val.slice(0, start) + e.key + closing + val.slice(end);
          ta.selectionStart = ta.selectionEnd = start + 1;
        }
        const newLines = ta.value.split("\n");
        setLines(newLines);
        updateSandboxFile(sandboxId, { content: ta.value });
        return;
      }

      if (CLOSERS.has(e.key)) {
        const start = ta.selectionStart;
        if (ta.value[start] === e.key) {
          e.preventDefault();
          ta.selectionStart = ta.selectionEnd = start + 1;
          return;
        }
      }

      if (e.key === "Backspace") {
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        if (start === end && start > 0) {
          const before = ta.value[start - 1];
          const after = ta.value[start];
          if (PAIRS[before] === after) {
            e.preventDefault();
            const val = ta.value;
            ta.value = val.slice(0, start - 1) + val.slice(start + 1);
            ta.selectionStart = ta.selectionEnd = start - 1;
            const newLines = ta.value.split("\n");
            setLines(newLines);
            updateSandboxFile(sandboxId, { content: ta.value });
            return;
          }
        }
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const start = ta.selectionStart;
        const val = ta.value;
        const lineStart = val.lastIndexOf("\n", start - 1) + 1;
        const currentLine = val.slice(lineStart, start);
        const indent = currentLine.match(/^(\s*)/)?.[1] ?? "";
        const charBefore = val[start - 1];
        const charAfter = val[start];
        let insertion: string;
        let cursorOffset: number;
        if (PAIRS[charBefore] === charAfter) {
          insertion = "\n" + indent + "  \n" + indent;
          cursorOffset = indent.length + 3;
        } else {
          insertion = "\n" + indent;
          cursorOffset = indent.length + 1;
        }
        ta.value = val.slice(0, start) + insertion + val.slice(start);
        ta.selectionStart = ta.selectionEnd = start + cursorOffset;
        const newLines = ta.value.split("\n");
        setLines(newLines);
        updateSandboxFile(sandboxId, { content: ta.value });
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const val = ta.value;
        ta.value = val.slice(0, start) + "  " + val.slice(end);
        ta.selectionStart = ta.selectionEnd = start + 2;
        const newLines = ta.value.split("\n");
        setLines(newLines);
        updateSandboxFile(sandboxId, { content: ta.value });
      }
    },
    [sandboxId, updateSandboxFile],
  );

  const handleScroll = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (overlayRef.current) {
      overlayRef.current.scrollTop = ta.scrollTop;
      overlayRef.current.scrollLeft = ta.scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = ta.scrollTop;
    }
  }, []);

  const editorFontStyle: React.CSSProperties = {
    fontFamily:
      '"Geist Mono", ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace',
    fontSize: "13px",
    lineHeight: "22px",
    letterSpacing: "normal",
    wordSpacing: "normal",
    tabSize: 2,
    whiteSpace: "pre",
    overflowWrap: "normal",
    wordBreak: "keep-all",
    padding: "0 24px",
    margin: 0,
    border: "none",
  };

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center text-[var(--vscode-text-muted)] text-[13px]">
        File not found
      </div>
    );
  }

  const rawText = lines.join("\n");

  return (
    <>
      <Gutter
        ref={gutterRef}
        lineCount={lines.length}
        activeLine={cursorLine}
      />
      <div className="flex-1 min-w-0 relative h-full overflow-hidden">
        <div className="absolute inset-0 max-w-[800px]">
          <div
            ref={overlayRef}
            className="absolute inset-0 pointer-events-none overflow-hidden"
            style={{ ...editorFontStyle }}
            aria-hidden
          >
            {lines.map((line, i) => (
              <div key={i} style={{ minHeight: LINE_HEIGHT }}>
                <ColorizedLine text={line} fileId="" />
                {line === "" && "\n"}
              </div>
            ))}
          </div>

          <textarea
            ref={textareaRef}
            value={rawText}
            onChange={handleChange}
            onSelect={handleSelect}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            className="absolute inset-0 w-full h-full outline-none resize-none bg-transparent text-transparent caret-[var(--vscode-accent)] selection:bg-[var(--vscode-selection)] overflow-auto"
            style={editorFontStyle}
          />
        </div>

        {/* Always-visible sandbox badge */}
        <div className="absolute bottom-4 right-4 z-10 px-3 py-1.5 bg-[var(--vscode-line-highlight)] border border-[var(--vscode-border)] rounded text-[11px] font-mono text-[var(--vscode-text-muted)]">
          Sandbox mode — changes are local only
        </div>
      </div>
    </>
  );
}

/* ── DB File Editor (markdown files from database) ───────────────────── */

function DbFileEditor({ fileId }: { fileId: string }) {
  const { isAdmin, isMobile, getFileContent, updateFile, createFile, openTabs, dbFiles, openFile, refreshFiles } = usePortfolio();
  const [lines, setLines] = useState<string[]>([""]);
  const [originalLines, setOriginalLines] = useState<string[]>([""]);
  const [cursorLine, setCursorLine] = useState(0);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [creating, setCreating] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">(
    "idle",
  );
  const [showWarning, setShowWarning] = useState(false);
  const [warningStyle, setWarningStyle] = useState<React.CSSProperties | null>(
    null,
  );
  // Increments on every showReadOnlyWarning() call, even ones that don't
  // flip `showWarning` false→true (e.g. rapid keystrokes within the 2s
  // window). The reposition effect depends on THIS, not on showWarning,
  // so it reliably reruns every time — that's the actual fix.
  const [warningToken, setWarningToken] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const editorAreaRef = useRef<HTMLDivElement>(null);
  const warningRef = useRef<HTMLDivElement>(null);
  const warningTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const { getCaretCoordinates } = useTextareaCaret();

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    getFileContent(fileId).then((c) => {
      if (c === null) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const loaded = c.split("\n");
      setLines(loaded);
      setOriginalLines(loaded);
      setLoading(false);
      setDirty(false);
      setSaveStatus("idle");
      setCursorLine(0);
    });
  }, [fileId, getFileContent]);

  const handleRecreate = useCallback(async () => {
    if (creating) return;
    setCreating(true);
    const tab = openTabs.find(t => t.id === `file-${fileId}`);
    const fileName = tab?.name || "untitled.mdx";
    const existingFile = dbFiles.find(f => f.id === fileId);
    const folderId = existingFile?.folderId || null;

    const file = await createFile(fileName, folderId);
    if (file) {
      await refreshFiles();
      openFile(`file-${file.id}`, file.name, tab?.icon || FileText, tab?.iconColor || "#569cd6");
    }
    setCreating(false);
  }, [creating, fileId, openTabs, dbFiles, createFile, openFile, refreshFiles]);

  // Build breadcrumb path from dbFiles tree
  const breadcrumbPath = useMemo(() => {
    const parts: string[] = [];
    const tab = openTabs.find(t => t.id === `file-${fileId}`);
    const file = dbFiles.find(f => f.id === fileId);

    if (file) {
      let current = file;
      while (current.folderId) {
        const parent = dbFiles.find(f => f.id === current.folderId);
        if (parent) {
          parts.unshift(parent.name);
          current = parent;
        } else break;
      }
    }

    parts.push(tab?.name || file?.name || "unknown");
    return parts;
  }, [fileId, openTabs, dbFiles]);

  const getLocalCaretPos = useCallback(() => {
    const ta = textareaRef.current;
    const container = editorAreaRef.current;
    if (!ta || !container) return null;
    const { x, y } = getCaretCoordinates(ta);
    const containerRect = container.getBoundingClientRect();
    return {
      x: x - containerRect.left,
      y: y - containerRect.top,
    };
  }, [getCaretCoordinates]);

  const showReadOnlyWarning = useCallback(() => {
    const pos = getLocalCaretPos();
    if (!pos) return;

    setWarningStyle({
      left: pos.x + 12,
      top: pos.y,
      transform: "translateY(-50%)",
      visibility: "hidden",
    });
    setShowWarning(true);
    setWarningToken((t) => t + 1); // always changes, unlike showWarning

    if (warningTimeout.current) clearTimeout(warningTimeout.current);
    warningTimeout.current = setTimeout(() => {
      setShowWarning(false);
      setWarningStyle(null);
    }, 2000);
  }, [getLocalCaretPos]);

  // Depends on warningToken (not showWarning) so it reruns on every single
  // call to showReadOnlyWarning, including rapid repeats while the previous
  // warning is still on screen.
  useLayoutEffect(() => {
    if (!showWarning) return;
    const tooltip = warningRef.current;
    const container = editorAreaRef.current;
    if (!tooltip || !container) return;

    const pos = getLocalCaretPos();
    if (!pos) return;
    const caretHeight = LINE_HEIGHT;

    const containerRect = container.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const gap = 12;

    let left = pos.x + gap;
    const overflowsRight = left + tooltipRect.width > containerRect.width;
    if (overflowsRight) {
      const leftSide = pos.x - gap - tooltipRect.width;
      left =
        leftSide >= 0
          ? leftSide
          : Math.max(0, containerRect.width - tooltipRect.width);
    }

    let top = pos.y;
    let transform = "translateY(-50%)";
    const halfHeight = tooltipRect.height / 2;
    if (top - halfHeight < 0) {
      top = pos.y + caretHeight / 2 + 4;
      transform = "none";
    } else if (top + halfHeight > containerRect.height) {
      top = pos.y - caretHeight / 2 - 4;
      transform = "translateY(-100%)";
    }

    setWarningStyle({ left, top, transform, visibility: "visible" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [warningToken]);

  const handleBeforeInput = useCallback(
    (e: React.FormEvent<HTMLTextAreaElement>) => {
      if (!isAdmin) {
        e.preventDefault();
        showReadOnlyWarning();
      }
    },
    [isAdmin, showReadOnlyWarning],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!isAdmin) return;
      setLines(e.target.value.split("\n"));
      setDirty(true);
      setSaveStatus("idle");
    },
    [isAdmin],
  );

  const handleSelect = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const pos = ta.selectionStart;
    const textBefore = ta.value.slice(0, pos);
    const linesBefore = textBefore.split("\n");
    setCursorLine(linesBefore.length - 1);
  }, []);

  const handleSave = useCallback(async () => {
    if (!isAdmin) {
      showReadOnlyWarning();
      return;
    }
    if (!dirty) return;
    setSaving(true);
    const content = lines.join("\n");
    const ok = await updateFile(fileId, { content });
    setSaving(false);
    if (ok) {
      setDirty(false);
      setOriginalLines([...lines]);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } else {
      setSaveStatus("error");
    }
  }, [isAdmin, fileId, lines, dirty, updateFile, showReadOnlyWarning]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        if (!isAdmin) {
          showReadOnlyWarning();
        } else {
          handleSave();
        }
        return;
      }

      const ta = textareaRef.current;
      if (!ta) return;

      const PAIRS: Record<string, string> = { "[": "]", "{": "}", "(": ")", '"': '"', "'": "'", "`": "`" };
      const CLOSERS = new Set(Object.values(PAIRS));

      if (PAIRS[e.key]) {
        e.preventDefault();
        if (!isAdmin) {
          showReadOnlyWarning();
          return;
        }
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const val = ta.value;
        const closing = PAIRS[e.key];
        const selected = val.slice(start, end);
        if (selected.length > 0) {
          ta.value = val.slice(0, start) + e.key + selected + closing + val.slice(end);
          ta.selectionStart = start + 1;
          ta.selectionEnd = end + 1;
        } else {
          ta.value = val.slice(0, start) + e.key + closing + val.slice(end);
          ta.selectionStart = ta.selectionEnd = start + 1;
        }
        setLines(ta.value.split("\n"));
        setDirty(true);
        return;
      }

      if (CLOSERS.has(e.key)) {
        const start = ta.selectionStart;
        if (ta.value[start] === e.key) {
          e.preventDefault();
          ta.selectionStart = ta.selectionEnd = start + 1;
          return;
        }
      }

      if (e.key === "Backspace") {
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        if (start === end && start > 0) {
          const before = ta.value[start - 1];
          const after = ta.value[start];
          if (PAIRS[before] === after) {
            e.preventDefault();
            if (!isAdmin) {
              showReadOnlyWarning();
              return;
            }
            const val = ta.value;
            ta.value = val.slice(0, start - 1) + val.slice(start + 1);
            ta.selectionStart = ta.selectionEnd = start - 1;
            setLines(ta.value.split("\n"));
            setDirty(true);
            return;
          }
        }
      }

      if (e.key === "Enter") {
        e.preventDefault();
        if (!isAdmin) {
          showReadOnlyWarning();
          return;
        }
        const start = ta.selectionStart;
        const val = ta.value;
        const lineStart = val.lastIndexOf("\n", start - 1) + 1;
        const currentLine = val.slice(lineStart, start);
        const indent = currentLine.match(/^(\s*)/)?.[1] ?? "";
        const charBefore = val[start - 1];
        const charAfter = val[start];
        let insertion: string;
        let cursorOffset: number;
        if (PAIRS[charBefore] === charAfter) {
          insertion = "\n" + indent + "  \n" + indent;
          cursorOffset = indent.length + 3;
        } else {
          insertion = "\n" + indent;
          cursorOffset = indent.length + 1;
        }
        ta.value = val.slice(0, start) + insertion + val.slice(start);
        ta.selectionStart = ta.selectionEnd = start + cursorOffset;
        setLines(ta.value.split("\n"));
        setDirty(true);
        return;
      }

      if (e.key === "Tab") {
        e.preventDefault();
        if (!isAdmin) {
          showReadOnlyWarning();
          return;
        }
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const val = ta.value;
        ta.value = val.slice(0, start) + "  " + val.slice(end);
        ta.selectionStart = ta.selectionEnd = start + 2;
        setLines(ta.value.split("\n"));
        setDirty(true);
      }
    },
    [isAdmin, handleSave, showReadOnlyWarning],
  );

  const handleScroll = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    if (overlayRef.current) {
      overlayRef.current.scrollTop = ta.scrollTop;
      overlayRef.current.scrollLeft = ta.scrollLeft;
    }
    if (gutterRef.current) {
      gutterRef.current.scrollTop = ta.scrollTop;
    }
  }, []);

  const editorFontStyle: React.CSSProperties = {
    fontFamily:
      '"Geist Mono", ui-monospace, "Cascadia Code", "Source Code Pro", Menlo, Consolas, "DejaVu Sans Mono", monospace',
    fontSize: "13px",
    lineHeight: "22px",
    letterSpacing: "normal",
    wordSpacing: "normal",
    tabSize: 2,
    whiteSpace: "pre",
    overflowWrap: "normal",
    wordBreak: "keep-all",
    padding: "0 24px",
    margin: 0,
    border: "none",
  };

  if (notFound) {
    return (
      <div className="flex-1 h-full flex flex-col gap-3 items-center justify-center overflow-hidden">
        <CircleX className="text-red-400" size={isMobile ? 24 : 45} />
        <p className="text-sm font-thin">File not found in database.</p>
        {breadcrumbPath.length > 0 && (
          <div className="flex items-center gap-1 text-[11px] font-mono text-[var(--vscode-text-muted)]">
            {breadcrumbPath.map((part, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight size={10} />}
                <span>{part}</span>
              </span>
            ))}
          </div>
        )}
        <button
          onClick={handleRecreate}
          disabled={creating}
          className="text-xs bg-blue-600 hover:bg-blue-700 disabled:opacity-50 py-2 px-3 rounded-sm transition-colors"
        >
          {creating ? "Creating..." : "Create File"}
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-[var(--vscode-text-muted)] text-[13px]">
        Loading...
      </div>
    );
  }

  const rawText = lines.join("\n");

  return (
    <div className="flex flex-col flex-1">
      {breadcrumbPath.length > 1 && (
        <div className="flex items-center gap-1 px-4 py-1 text-[11px] font-mono text-[var(--vscode-text-muted)] border-b border-[var(--vscode-border)] shrink-0 bg-[var(--vscode-sidebar-bg)]">
          {breadcrumbPath.map((part, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={10} />}
              <span className={i === breadcrumbPath.length - 1 ? "text-[var(--vscode-text)]" : ""}>{part}</span>
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-1 w-full">
        <Gutter
          ref={gutterRef}
          lineCount={lines.length}
          activeLine={cursorLine}
        />
        <div className="flex-1 min-w-0 relative h-full overflow-hidden">
          <div ref={editorAreaRef} className="absolute inset-0 max-w-[800px]">
            <div
              ref={overlayRef}
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{ ...editorFontStyle }}
              aria-hidden
            >
              {lines.map((line, i) => (
                <div key={i} style={{ minHeight: LINE_HEIGHT }}>
                  <ColorizedLine text={line} fileId="" />
                  {line === "" && "\n"}
                </div>
              ))}
            </div>
            <textarea
              ref={textareaRef}
              value={rawText}
              onBeforeInput={handleBeforeInput}
              onChange={handleChange}
              onSelect={handleSelect}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              className="absolute inset-0 w-full h-full outline-none resize-none bg-transparent text-transparent caret-[var(--vscode-accent)] selection:bg-[var(--vscode-selection)] overflow-auto"
              style={editorFontStyle}
            />
          </div>
          {!isAdmin && showWarning && warningStyle && (
            <div
              ref={warningRef}
              className="absolute z-50 px-3 py-1.5 bg-[var(--vscode-titlebar-bg)] border border-[var(--vscode-border)] rounded shadow-lg text-[11px] font-mono text-[var(--vscode-text-muted)] whitespace-nowrap pointer-events-none animate-[fadeIn_150ms_ease-out]"
              style={warningStyle}
            >
              🔒 Read-only mode
            </div>
          )}
          {isAdmin && (
            <div className="absolute top-2 right-4 flex items-center gap-2 z-10">
              {dirty && (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-3 py-1 text-[11px] font-mono bg-[var(--vscode-accent)] hover:bg-[var(--vscode-accent-hover)] text-white rounded-sm transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Ctrl+S to save"}
                </button>
              )}
              {saveStatus === "saved" && (
                <span className="text-[11px] font-mono text-green-500">
                  ✓ Saved
                </span>
              )}
              {saveStatus === "error" && (
                <span className="text-[11px] font-mono text-red-500">
                  ✗ Save failed
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Gutter ───────────────────────────────────────────────────────────── */

const Gutter = forwardRef<
  HTMLDivElement,
  { lineCount: number; activeLine: number }
>(function Gutter({ lineCount, activeLine }, ref) {
  const nums = useMemo(
    () => Array.from({ length: lineCount }, (_, i) => i + 1),
    [lineCount],
  );

  return (
    <div
      ref={ref}
      className="hidden md:flex flex-col shrink-0 w-12 pr-4 text-right border-r border-[var(--vscode-border)] select-none overflow-hidden"
    >
      {nums.map((n) => (
        <div
          key={n}
          className={`text-[11px] font-mono shrink-0 ${
            n - 1 === activeLine
              ? "text-[var(--vscode-text-bright)]"
              : "text-[var(--vscode-text-muted)]"
          }`}
          style={{ height: LINE_HEIGHT, lineHeight: `${LINE_HEIGHT}px` }}
        >
          {n}
        </div>
      ))}
    </div>
  );
});

/* ── Syntax colorization ──────────────────────────────────────────────── */

function ColorizedLine({ text, fileId }: { text: string; fileId: string }) {
  if (!text) return null;

  // Comments
  if (text.trimStart().startsWith("//")) {
    return <span className="text-[var(--vscode-text-muted)]">{text}</span>;
  }
  if (
    text.trimStart().startsWith("/*") ||
    text.trimStart().startsWith("*") ||
    text.trimStart().endsWith("*/")
  ) {
    return (
      <span className="text-[var(--vscode-text-muted)] italic">{text}</span>
    );
  }

  // Tokenize and colorize
  const parts: React.ReactNode[] = [];
  const tokenRegex =
    /\b(export|const|let|var|function|return|import|from|type|interface|class|default|async|await|if|else|for|while|switch|case|break|true|false|null|undefined|extends|readonly|implements)\b|("[^"]*"|'[^']*'|`[^`]*`)|([{}\[\]()])/g;

  let lastIdx = 0;
  let m;
  while ((m = tokenRegex.exec(text)) !== null) {
    if (m.index > lastIdx) {
      parts.push(
        <span key={`t-${lastIdx}`} className="text-[var(--vscode-text)]">
          {text.slice(lastIdx, m.index)}
        </span>,
      );
    }
    if (m[1]) {
      // keyword
      parts.push(
        <span key={`k-${m.index}`} className="text-[#c586c0]">
          {m[0]}
        </span>,
      );
    } else if (m[2]) {
      // string
      parts.push(
        <span key={`s-${m.index}`} className="text-[#ce9178]">
          {m[0]}
        </span>,
      );
    } else if (m[3]) {
      // bracket
      parts.push(
        <span key={`b-${m.index}`} className="text-[#ffd700]">
          {m[0]}
        </span>,
      );
    }
    lastIdx = m.index + m[0].length;
  }
  if (lastIdx < text.length) {
    parts.push(
      <span key={`t-${lastIdx}`} className="text-[var(--vscode-text)]">
        {text.slice(lastIdx)}
      </span>,
    );
  }

  return <>{parts}</>;
}

/* ── Content generator: turns structured data into text lines ─────────── */

function escapeStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function generateFileContent(
  fileId: string,
  data: ReturnType<typeof usePortfolio>["data"],
): string {
  if (fileId === "about") return generateAbout(data);
  if (fileId === "experience") return generateExperience(data);
  if (fileId.startsWith("project-")) return generateProject(fileId, data);
  if (fileId.startsWith("article-")) return generateArticle(fileId, data);
  return "// File not found";
}

function generateAbout(data: ReturnType<typeof usePortfolio>["data"]): string {
  const profile = data.profile ?? staticProfile;
  const expertiseData = data.expertise ?? staticExpertise;
  const certs = data.certifications ?? staticCertifications;
  const socials = data.socials ?? staticSocials;

  const lines: string[] = [];
  lines.push("about.tsx");
  lines.push("");
  lines.push(`// ${profile.name}`);
  lines.push(`// ${profile.role}`);
  lines.push(`// ${profile.location} · ${profile.email}`);
  lines.push("");
  lines.push("export const bio = [");
  for (const p of profile.bioParagraphs) {
    lines.push(`  "${escapeStr(p)}",`);
  }
  lines.push("];");
  lines.push("");
  lines.push("export const expertise = {");
  for (const group of expertiseData) {
    const heading =
      group.heading ??
      ((group as Record<string, unknown>).name as string) ??
      "";
    lines.push(`  "${escapeStr(heading)}": [`);
    for (const skill of group.skills ?? []) {
      lines.push(`    "${escapeStr(skill)}",`);
    }
    lines.push("  ],");
  }
  lines.push("};");
  lines.push("");

  if (certs.length > 0) {
    lines.push("export const certifications = [");
    for (const cert of certs) {
      const year = cert.date
        ? typeof cert.date === "string"
          ? cert.date
          : new Date(cert.date).getFullYear()
        : "";
      lines.push(
        `  { name: "${escapeStr(cert.name)}", issuer: "${escapeStr(cert.issuer)}"${year ? `, date: "${year}"` : ""} },`,
      );
    }
    lines.push("];");
    lines.push("");
  }

  lines.push("export const socials = [");
  for (const s of socials) {
    lines.push(
      `  { label: "${escapeStr(s.label)}", href: "${escapeStr(s.href)}" },`,
    );
  }
  lines.push("];");

  return lines.join("\n");
}

function generateExperience(
  data: ReturnType<typeof usePortfolio>["data"],
): string {
  const experiences = data.experiences ?? staticExperiences;
  const lines: string[] = [];
  lines.push("experience.tsx");
  lines.push("");
  lines.push("export const experiences = [");

  for (const exp of experiences) {
    const raw = exp as Record<string, unknown>;
    const title = (exp.title ?? raw.role ?? "Developer") as string;
    const isCurrent = (raw.current ?? exp.isCurrent ?? false) as boolean;
    const startDate = exp.startDate
      ? typeof exp.startDate === "string"
        ? exp.startDate
        : new Date(exp.startDate).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
      : "";
    const endDate = exp.endDate
      ? typeof exp.endDate === "string"
        ? exp.endDate
        : new Date(exp.endDate).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })
      : "Present";
    const techs = (raw.technologies as string[] | undefined) ?? [];

    lines.push("  {");
    lines.push(`    title: "${escapeStr(title)}",`);
    lines.push(`    company: "${escapeStr(exp.company)}",`);
    if (raw.location)
      lines.push(`    location: "${escapeStr(raw.location as string)}",`);
    lines.push(
      `    period: "${escapeStr(startDate)} — ${isCurrent ? "Present" : escapeStr(endDate)}",`,
    );
    lines.push(`    description: "${escapeStr(exp.description)}",`);
    if (techs.length) {
      lines.push(`    technologies: [`);
      for (const t of techs) lines.push(`      "${escapeStr(t)}",`);
      lines.push(`    ],`);
    }
    lines.push("  },");
    lines.push("");
  }

  lines.push("];");
  return lines.join("\n");
}

function generateProject(
  fileId: string,
  data: ReturnType<typeof usePortfolio>["data"],
): string {
  const projects = data.projects ?? staticProjects;
  const slug = fileId.replace("project-", "");
  const project = projects.find(
    (p) => p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug,
  );

  if (!project) return "// Project not found";

  const tags =
    ((project as unknown as Record<string, unknown>).tags as
      | string[]
      | undefined) ?? [];
  const image = (project as unknown as Record<string, unknown>).image as
    | string
    | null
    | undefined;
  const lines: string[] = [];

  lines.push(`${slug}.tsx`);
  lines.push("");
  lines.push(`// ${project.name}`);
  lines.push("");
  lines.push(`const description = "${escapeStr(project.description)}";`);
  lines.push("");

  if (tags.length) {
    lines.push("const techStack = [");
    for (const tag of tags) lines.push(`  "${escapeStr(tag)}",`);
    lines.push("];");
    lines.push("");
  }

  if (image) {
    lines.push(`// preview: ${image}`);
    lines.push("");
  }

  if (project.url && project.url !== "#") {
    lines.push(`export const liveUrl = "${project.url}";`);
  }

  return lines.join("\n");
}

function generateArticle(
  fileId: string,
  data: ReturnType<typeof usePortfolio>["data"],
): string {
  const articles = data.articles ?? staticArticles;
  const slug = fileId.replace("article-", "");
  const article = articles.find((a) => a.slug === slug);

  if (!article) return "// Article not found";

  const date = article.date
    ? typeof article.date === "string"
      ? article.date
      : new Date(article.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
    : "";

  const lines: string[] = [];
  lines.push(`${slug}.mdx`);
  lines.push("");
  lines.push(`// ${date}`);
  lines.push("");
  lines.push(`# ${article.title}`);
  lines.push("");
  lines.push(`/* ${article.excerpt} */`);
  lines.push("");
  lines.push(article.content);

  return lines.join("\n");
}

/* ── Parse edited text back to structured data ──────────────────────── */

function parseFileContent(
  fileId: string,
  content: string,
): Partial<ReturnType<typeof usePortfolio>["data"]> | null {
  try {
    if (fileId === "about") return parseAbout(content);
    if (fileId === "experience") return parseExperience(content);
    if (fileId.startsWith("article-")) return parseArticle(fileId, content);
    // Projects are simpler — just update description/url from text
    if (fileId.startsWith("project-")) return parseProject(fileId, content);
    return null;
  } catch {
    return null;
  }
}

function extractStringArray(text: string, varName: string): string[] {
  const regex = new RegExp(`${varName}\\s*=\\s*\\[([\\s\\S]*?)\\]`);
  const match = text.match(regex);
  if (!match) return [];
  const inner = match[1];
  const items: string[] = [];
  const strRegex = /"([^"]*)"/g;
  let m;
  while ((m = strRegex.exec(inner)) !== null) {
    items.push(m[1]);
  }
  return items;
}

function extractString(text: string, varName: string): string {
  const regex = new RegExp(`${varName}\\s*=\\s*"([^"]*)"`);
  const match = text.match(regex);
  return match ? match[1] : "";
}

function parseAbout(
  content: string,
): Partial<ReturnType<typeof usePortfolio>["data"]> {
  const bioParagraphs = extractStringArray(content, "bio");

  // Parse expertise object
  const expertiseMatch = content.match(
    /export const expertise = \{([\s\S]*?)\};/,
  );
  let expertise: { heading: string; skills: string[] }[] = [];
  if (expertiseMatch) {
    const block = expertiseMatch[1];
    const groupRegex = /"([^"]*)":\s*\[([\s\S]*?)\]/g;
    let gm;
    while ((gm = groupRegex.exec(block)) !== null) {
      const heading = gm[1];
      const skills: string[] = [];
      const skillRegex = /"([^"]*)"/g;
      let sm;
      while ((sm = skillRegex.exec(gm[2])) !== null) {
        skills.push(sm[1]);
      }
      expertise.push({ heading, skills });
    }
  }

  // Parse profile from comments
  const nameMatch = content.match(/^\/\/ (.+)$/m);
  const roleLine = content
    .split("\n")
    .find((l) => l.startsWith("// ") && !l.includes("·"));
  const contactLine = content.split("\n").find((l) => l.includes("·"));

  const result: Partial<ReturnType<typeof usePortfolio>["data"]> = {};
  if (bioParagraphs.length) {
    result.profile = {
      name: nameMatch ? nameMatch[1] : staticProfile.name,
      role: roleLine ? roleLine.replace("// ", "") : staticProfile.role,
      location: contactLine
        ? contactLine.replace("// ", "").split(" · ")[0]
        : staticProfile.location,
      email: contactLine
        ? contactLine.split(" · ")[1]?.trim() || staticProfile.email
        : staticProfile.email,
      bioParagraphs,
    };
  }
  if (expertise.length) result.expertise = expertise;

  return result;
}

function parseExperience(
  content: string,
): Partial<ReturnType<typeof usePortfolio>["data"]> {
  // Simple parse: extract experience blocks
  const experiences: ReturnType<typeof usePortfolio>["data"]["experiences"] =
    [];
  const blocks = content
    .split(/^\s*\},?\s*$/m)
    .filter((b) => b.trim().startsWith("{"));

  for (const block of blocks) {
    const title = extractString(block, "title");
    const company = extractString(block, "company");
    const description = extractString(block, "description");
    const technologies = extractStringArray(block, "technologies");
    if (title && company) {
      experiences.push({ title, company, description, technologies });
    }
  }

  return experiences.length ? { experiences } : {};
}

function parseArticle(
  fileId: string,
  content: string,
): Partial<ReturnType<typeof usePortfolio>["data"]> {
  const slug = fileId.replace("article-", "");
  const lines = content.split("\n");

  let title = "";
  let excerpt = "";
  let dateStr = "";
  const contentLines: string[] = [];
  let inContent = false;

  for (const line of lines) {
    if (line.startsWith("# ")) {
      title = line.slice(2);
    } else if (line.startsWith("/* ") && line.endsWith(" */")) {
      excerpt = line.slice(3, -3);
    } else if (line.startsWith("// ") && !dateStr) {
      dateStr = line.slice(3);
    } else if (title && excerpt) {
      inContent = true;
    }
    if (inContent) contentLines.push(line);
  }

  if (!title) return {};

  return {
    articles: [
      {
        slug,
        title,
        date: dateStr || new Date().toISOString(),
        excerpt,
        content: contentLines.join("\n").trim(),
      },
    ],
  };
}

function parseProject(
  fileId: string,
  content: string,
): Partial<ReturnType<typeof usePortfolio>["data"]> {
  const slug = fileId.replace("project-", "");
  const description = extractString(content, "description");
  const liveUrl = extractString(content, "liveUrl");

  if (!description) return {};

  return {
    projects: [
      {
        name: slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        description,
        url: liveUrl || "#",
      },
    ],
  };
}

/* ── Save to API ──────────────────────────────────────────────────────── */

async function saveToApi(
  fileId: string,
  parsed: Partial<ReturnType<typeof usePortfolio>["data"]>,
): Promise<void> {
  // Map parsed data to appropriate API calls
  if (parsed.articles?.length) {
    const article = parsed.articles[0];
    const res = await fetch(`/api/articles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(article),
    });
    if (!res.ok) throw new Error("Failed to save article");
  }

  if (parsed.projects?.length) {
    const project = parsed.projects[0];
    const res = await fetch(`/api/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error("Failed to save project");
  }

  // For profile/experience/expertise, we'd need specific endpoints
  // For now, updates are reflected in-memory via setData
}

/* ── Types (re-exported for compatibility) ────────────────────────────── */

import { CircleX, ChevronRight, FileText, X, type LucideIcon } from "lucide-react";

export type FileId = string;

export interface FileItem {
  id: FileId;
  name: string;
  icon: LucideIcon;
  iconColor?: string;
  children?: FileItem[];
}

export interface Tab {
  id: FileId;
  name: string;
  icon: LucideIcon;
  iconColor?: string;
}

export interface PortfolioData {
  experiences?: {
    title?: string;
    role?: string;
    company: string;
    description: string;
    startDate?: string | Date | null;
    endDate?: string | Date | null;
    current?: boolean;
    isCurrent?: boolean;
    technologies?: string[];
    companyUrl?: string | null;
    location?: string | null;
  }[];
  projects?: {
    id?: string;
    name: string;
    description: string;
    url: string;
    image?: string | null;
    tags?: string[];
    featured?: boolean;
  }[];
  articles?: {
    id?: string;
    slug: string;
    title: string;
    date: string | Date | null;
    readingTime?: string | null;
    excerpt: string;
    content: string;
    published?: boolean;
  }[];
  expertise?: {
    heading?: string;
    name?: string;
    skills: string[];
  }[];
  certifications?: {
    name: string;
    issuer: string;
    url?: string | null;
    date?: string | Date | null;
  }[];
  timeline?: {
    title: string;
    org: string;
    startDate: string;
    endDate: string;
  }[];
  profile: {
    name: string;
    location: string;
    email: string;
    role: string;
    bioParagraphs: string[];
  };
  socials?: {
    label: string;
    href: string;
    icon: string;
  }[];
}

export type SidebarPanel =
  | "explorer"
  | "search"
  | "source-control"
  | "extensions"
  | "settings"
  | "account";
