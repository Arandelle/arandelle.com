"use client";

import {FileCode2 } from "lucide-react";
import {
  useState,
  useEffect,
  useCallback,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import AsciiPortrait from "@/components/portfolio/AsciiPortrait";
import { usePortfolio } from "@/context/vscode-context";
import { CustomIcon } from "@/components/CustomIcon";

interface TerminalLine {
  type: "command" | "output";
  content: React.ReactNode;
}

type ShellType = "powershell" | "bash" | "cmd";

interface TerminalInstance {
  id: string;
  shell: ShellType;
  history: TerminalLine[];
  input: string;
}

const SHELL_OPTIONS: { type: ShellType; label: string, icon: string }[] = [
  { type: "powershell", label: "PowerShell", icon: "Terminal" },
  { type: "bash", label: "Bash", icon: "Command" },
  { type: "cmd", label: "Command Prompt", icon: "SquareTerminal" },
];

const tabs = [
  { id: "problems", label: "PROBLEMS", count: 99 },
  { id: "output", label: "OUTPUT" },
  { id: "debug", label: "DEBUG CONSOLE" },
  { id: "terminal", label: "TERMINAL" },
  { id: "ports", label: "PORTS" },
];

let nextTerminalId = 1;

function createTerminal(shell: ShellType): TerminalInstance {
  return { id: `term-${nextTerminalId++}`, shell, history: [], input: "" };
}

function getPrompt(shell: ShellType) {
  if (shell === "powershell")
    return {
      prefix: "PS C:\\Users\\my-portfolio\\arandelle\\arandelle.com>",
      sep: "",
      suffix: "$",
    };
  if (shell === "bash")
    return { prefix: "root@portfolio", sep: ":", suffix: "$" };
  return { prefix: "C:\\Users\\my-portfolio>", sep: "", suffix: "" };
}

export const RightPanelButton = ({
  icon,
  onClick,
}: {
  icon: {
    name: string;
    size?: number;
    classname?: string;
  };
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className="p-1 hover:bg-(--vscode-line-highlight) rounded text-(--vscode-text-muted) hover:text-(--vscode-text)"
    >
      <CustomIcon
        name={icon.name}
        size={icon.size}
        className={icon.classname}
      />
    </button>
  );
};

export function BottomPanel() {
  const [activeTab, setActiveTab] = useState("terminal");
  const [isDragging, setIsDragging] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [showShellMenu, setShowShellMenu] = useState(false);

  const [terminals, setTerminals] = useState<TerminalInstance[]>(() => {
    const ps = createTerminal("powershell");
    const bash = createTerminal("bash");
    return [ps, bash];
  });
  const [activeTermId, setActiveTermId] = useState(() => terminals[0].id);

  const dragStartY = useRef(0);
  const dragStartHeight = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const shellMenuRef = useRef<HTMLDivElement>(null);
  const { closeBottomPanel, isMobile, toggleChat, chatOpen, openFile } =
    usePortfolio();

  const [panelHeight, setPanelHeight] = useState(isMobile ? 20 : 300);
  const prevHeight = useRef(300);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const terminalInputRef = useRef<HTMLInputElement>(null);

  const activeTerm =
    terminals.find((t) => t.id === activeTermId) ?? terminals[0];

  const updateActiveTerm = useCallback(
    (updater: (t: TerminalInstance) => Partial<TerminalInstance>) => {
      setTerminals((prev) =>
        prev.map((t) => (t.id === activeTermId ? { ...t, ...updater(t) } : t)),
      );
    },
    [activeTermId],
  );

  const addTerminal = useCallback(
    (shell?: ShellType) => {
      const s = shell ?? activeTerm.shell;
      const term = createTerminal(s);
      setTerminals((prev) => [...prev, term]);
      setActiveTermId(term.id);
      setShowShellMenu(false);
    },
    [activeTerm.shell],
  );

  const removeTerminal = useCallback(
    (id: string) => {
      setTerminals((prev) => {
        const next = prev.filter((t) => t.id !== id);
        if (next.length === 0) {
          const fresh = createTerminal("powershell");
          setActiveTermId(fresh.id);
          return [fresh];
        }
        if (id === activeTermId) setActiveTermId(next[next.length - 1].id);
        return next;
      });
    },
    [activeTermId],
  );

  const toggleMaximize = useCallback(() => {
    setMaximized((m) => {
      if (!m) {
        prevHeight.current = panelHeight;
        setPanelHeight(window.innerHeight - 40);
      } else {
        setPanelHeight(prevHeight.current);
      }
      return !m;
    });
  }, [panelHeight]);

  // Close shell menu on outside click
  useEffect(() => {
    if (!showShellMenu) return;
    const handler = (e: MouseEvent) => {
      if (
        shellMenuRef.current &&
        !shellMenuRef.current.contains(e.target as Node)
      ) {
        setShowShellMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showShellMenu]);

  const handleTerminalSubmit = useCallback(() => {
    const cmd = activeTerm.input.trim();
    if (!cmd) return;

    const newLines: TerminalLine[] = [{ type: "command", content: cmd }];
    const lower = cmd.toLowerCase();

    if (lower === "help") {
      newLines.push({
        type: "output",
        content: (
          <div className="text-(--vscode-text-muted)">
            <div>Available commands:</div>
            <div className="ml-2 mt-1">about — Open about.tsx</div>
            <div className="ml-2">chat — Open AI Chat</div>
            <div className="ml-2">clear — Clear terminal</div>
            <div className="ml-2">help — Show this message</div>
          </div>
        ),
      });
    } else if (lower === "about") {
      openFile("about", "about.tsx", FileCode2, "#4ec9b0");
    } else if (lower === "chat" || lower === "ai chat") {
      if (!chatOpen) toggleChat();
      newLines.push({
        type: "output",
        content: (
          <span className="text-(--vscode-text-muted)">
            {chatOpen ? "AI Chat is already open." : "Opening AI Chat..."}
          </span>
        ),
      });
    } else if (lower === "clear") {
      updateActiveTerm(() => ({ history: [], input: "" }));
      return;
    } else {
      newLines.push({
        type: "output",
        content: (
          <span className="text-(--vscode-text-muted)">
            Command not found: {cmd}. Type <span className="italic">help</span>{" "}
            for available commands.
          </span>
        ),
      });
    }

    updateActiveTerm((t) => ({
      history: [...t.history, ...newLines],
      input: "",
    }));
  }, [activeTerm.input, toggleChat, chatOpen, openFile, updateActiveTerm]);

  const handleTerminalKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleTerminalSubmit();
      }
    },
    [handleTerminalSubmit],
  );

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTerm.history]);

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
      const newHeight = Math.max(
        36,
        Math.min(900, dragStartHeight.current + delta),
      );
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

  if (isMobile) {
    return (
      <div className="flex flex-col h-full bg-(--vscode-panel-bg)">
        {/* Mobile header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-(--vscode-border) bg-(--vscode-titlebar-bg)">
          <span className="text-[12px] font-semibold uppercase tracking-wider text-(--vscode-text-muted)">
            {tabs.find((t) => t.id === activeTab)?.label ?? "Terminal"}
          </span>
          <button
            onClick={closeBottomPanel}
            className="p-1.5 rounded hover:bg-(--vscode-line-highlight) text-(--vscode-text-muted) hover:text-(--vscode-text)"
          >
            <CustomIcon name="X" size={18} />
          </button>
        </div>

        {/* Mobile tab bar */}
        <div className="flex items-center border-b border-(--vscode-border) overflow-x-auto shrink-0">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2 text-[11px] uppercase tracking-wide border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? "text-(--vscode-text-bright) border-(--vscode-accent)"
                    : "text-(--vscode-text-muted) border-transparent hover:text-(--vscode-text)"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile content */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === "terminal" && (
            <TerminalContent
              term={activeTerm}
              terminals={terminals}
              activeTermId={activeTermId}
              setActiveTermId={setActiveTermId}
              removeTerminal={removeTerminal}
              terminalInputRef={terminalInputRef}
              terminalEndRef={terminalEndRef}
              handleTerminalKeyDown={handleTerminalKeyDown}
              updateActiveTerm={updateActiveTerm}
              isMobile
            />
          )}

          {activeTab === "problems" && (
            <div className="p-4 text-[12px] text-(--vscode-text-muted) font-mono">
              No problems have been detected in the workspace.
            </div>
          )}

          {activeTab === "output" && (
            <div className="p-4 text-[12px] text-(--vscode-text-muted) font-mono">
              <div>[Info - 10:42:15] Starting portfolio server...</div>
              <div className="text-(--vscode-text)">
                [Info - 10:42:16] Server running on http://localhost:3000
              </div>
              <div>[Info - 10:42:16] Watching for file changes...</div>
            </div>
          )}

          {activeTab === "debug" && (
            <div className="p-4 text-[12px] text-(--vscode-text-muted) font-mono">
              Debug console not active. Press F5 to start debugging.
            </div>
          )}

          {activeTab === "ports" && (
            <div className="p-4 text-[12px] text-(--vscode-text-muted) font-mono">
              No ports forwarded.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className="border-t border-(--vscode-border) bg-(--vscode-panel-bg) flex flex-col shrink-0"
      style={{ height: panelHeight }}
    >
      {/* Drag handle */}
      <div
        onMouseDown={handleMouseDown}
        className={`h-1 cursor-row-resize ${isDragging ? "bg-(--vscode-accent)" : "hover:bg-(--vscode-accent-hover,#444)"} transition-colors`}
      />

      {/* Tab bar */}
      <div className="flex items-center border-b border-(--vscode-border) bg-(--vscode-titlebar-bg)">
        {tabs.map((tab) => {
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
                  ? "text-(--vscode-text-bright) border-(--vscode-accent)"
                  : "text-(--vscode-text-muted) border-transparent hover:text-(--vscode-text)"
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[9px] bg-(--vscode-terminal-banner) text-white rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-1 px-2">
          {activeTab === "terminal" && (
            <div className="relative flex items-center" ref={shellMenuRef}>
              <RightPanelButton
                icon={{ name: "Plus" }}
                onClick={() => addTerminal()}
              />
              <RightPanelButton
                icon={{ name: "ChevronDown" }}
                onClick={() => setShowShellMenu((v) => !v)}
              />
              {showShellMenu && (
                <div className="absolute top-full right-0 mt-1 w-44 bg-(--vscode-titlebar-bg) border border-(--vscode-border) rounded shadow-lg z-50 py-1">
                  {SHELL_OPTIONS.map((opt) => (
                    <button
                      key={opt.type}
                      onClick={() => addTerminal(opt.type)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-[11px] font-mono text-(--vscode-text-muted) hover:bg-(--vscode-line-highlight) hover:text-(--vscode-text)"
                    >
                      <CustomIcon name={opt.icon} size={12} />
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <RightPanelButton
            icon={{ name: maximized ? "Minimize" : "Maximize" }}
            onClick={toggleMaximize}
          />
          <RightPanelButton
            icon={{ name: "ChevronDown" }}
            onClick={() => setPanelHeight((h) => (h > 36 ? 36 : 300))}
          />
          <RightPanelButton icon={{ name: "X" }} onClick={closeBottomPanel} />
        </div>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-hidden relative">
        {activeTab === "terminal" && panelHeight > 36 && (
          <TerminalContent
            term={activeTerm}
            terminals={terminals}
            activeTermId={activeTermId}
            setActiveTermId={setActiveTermId}
            removeTerminal={removeTerminal}
            terminalInputRef={terminalInputRef}
            terminalEndRef={terminalEndRef}
            handleTerminalKeyDown={handleTerminalKeyDown}
            updateActiveTerm={updateActiveTerm}
          />
        )}

        {activeTab === "problems" && panelHeight > 36 && (
          <div className="p-4 text-[12px] text-(--vscode-text-muted) font-mono">
            No problems have been detected in the workspace.
          </div>
        )}

        {activeTab === "output" && panelHeight > 36 && (
          <div className="p-4 text-[12px] text-(--vscode-text-muted) font-mono">
            <div>[Info - 10:42:15] Starting portfolio server...</div>
            <div className="text-(--vscode-text)">
              [Info - 10:42:16] Server running on http://localhost:3000
            </div>
            <div>[Info - 10:42:16] Watching for file changes...</div>
          </div>
        )}

        {activeTab === "debug" && panelHeight > 36 && (
          <div className="p-4 text-[12px] text-(--vscode-text-muted) font-mono">
            Debug console not active. Press F5 to start debugging.
          </div>
        )}

        {activeTab === "ports" && panelHeight > 36 && (
          <div className="p-4 text-[12px] text-(--vscode-text-muted) font-mono">
            No ports forwarded.
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Shared Terminal Content ─────────────────────────────────────────── */

const INITIAL_LINES: Record<ShellType, TerminalLine[]> = {
  powershell: [{ type: "command", content: "ssh root@143.198.1.27" }],
  bash: [
    { type: "command", content: "git add ." },
    {
      type: "command",
      content: 'git commit -m "feat: growth is not linear, neither is code"',
    },
    {
      type: "output",
      content: (
        <div className="text-(--vscode-text-muted)">
          <div>[main f9c60fd] feat: growth is not linear, neither is code</div>
          <div> 3 files changed, 47 insertions(+), 12 deletions(-)</div>
        </div>
      ),
    },
    { type: "command", content: "git push origin main" },
    {
      type: "output",
      content: (
        <div className="text-(--vscode-text-muted)">
          <div>
            Total 0 (delta 0), reused 0 (delta 0), pack-reused 0 (from 0)
          </div>
          <div>
            To{" "}
            <a
              href="https://github.com/Arandelle/arandelle.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-(--vscode-accent)"
            >
              https://github.com/Arandelle/arandelle.com.git
            </a>
          </div>
          <div className="text-(--vscode-text)">
            {" "}
            1563ed0..f9c60fd main -&gt; main
          </div>
        </div>
      ),
    },
  ],
  cmd: [],
};

function TerminalPrompt({ shell }: { shell: ShellType }) {
  const p = getPrompt(shell);
  if (shell === "powershell") {
    return (
      <>
        <span className="text-(--vscode-terminal-green) shrink-0">
          {p.prefix}
        </span>
        <span className="text-(--vscode-text) shrink-0"> </span>
      </>
    );
  }
  if (shell === "bash") {
    return (
      <>
        <span className="text-(--vscode-terminal-green) shrink-0">
          {p.prefix}
        </span>
        <span className="text-(--vscode-text) shrink-0">{p.sep}</span>
        <span className="text-(--vscode-terminal-blue) shrink-0">~</span>
        <span className="text-(--vscode-text) shrink-0">{p.suffix} </span>
      </>
    );
  }
  return <span className="text-(--vscode-text) shrink-0">{p.prefix} </span>;
}

function TerminalContent({
  term,
  terminals,
  activeTermId,
  setActiveTermId,
  removeTerminal,
  terminalInputRef,
  terminalEndRef,
  handleTerminalKeyDown,
  updateActiveTerm,
  isMobile,
}: {
  term: TerminalInstance;
  terminals: TerminalInstance[];
  activeTermId: string;
  setActiveTermId: (id: string) => void;
  removeTerminal: (id: string) => void;
  terminalInputRef: React.RefObject<HTMLInputElement | null>;
  terminalEndRef: React.RefObject<HTMLDivElement | null>;
  handleTerminalKeyDown: (e: ReactKeyboardEvent<HTMLInputElement>) => void;
  updateActiveTerm: (
    updater: (t: TerminalInstance) => Partial<TerminalInstance>,
  ) => void;
  isMobile?: boolean;
}) {
  const showSideTabs = terminals.length > 1;
  const initialLines = INITIAL_LINES[term.shell];
  const allLines = [...initialLines, ...term.history];

  return (
    <div className="h-full flex">
      {/* Main terminal area */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <div
          onMouseDown={(e) => {
            const t = e.target as HTMLElement;
            if (t.tagName !== "INPUT" && t.tagName !== "A") {
              e.preventDefault();
              terminalInputRef.current?.focus();
            }
          }}
          className="flex-1 overflow-auto p-3 bg-(--vscode-terminal-bg) font-mono text-[12px] cursor-text select-none"
        >
          {!isMobile && term.shell === "powershell" && allLines.length <= 1 && (
            <div className="mt-2">
              <AsciiPortrait width={50} />
            </div>
          )}
          {isMobile && term.shell === "powershell" && allLines.length <= 1 && (
            <div className="mt-2">
              <AsciiPortrait width={40} />
            </div>
          )}
          {allLines.map((line, i) => (
            <div key={`${term.id}-${i}`} className="mt-1">
              {line.type === "command" ? (
                <div>
                  <TerminalPrompt shell={term.shell} />
                  <span className="text-(--vscode-text)">
                    {String(line.content)}
                  </span>
                </div>
              ) : (
                <div>{line.content}</div>
              )}
            </div>
          ))}
          <div className="mt-2 flex items-center">
            <TerminalPrompt shell={term.shell} />
            <input
              ref={terminalInputRef}
              type="text"
              value={term.input}
              onChange={(e) =>
                updateActiveTerm(() => ({ input: e.target.value }))
              }
              onKeyDown={handleTerminalKeyDown}
              placeholder="Type help for commands"
              className="flex-1 bg-transparent border-none outline-none text-(--vscode-text) font-mono text-[12px] placeholder:text-(--vscode-text-muted) placeholder:italic min-w-0"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div ref={terminalEndRef} />
        </div>
      </div>

      {/* Right-side terminal tabs (only when >1 terminal) */}
      {showSideTabs && !isMobile && (
        <div className="w-48 shrink-0 border-l border-(--vscode-border) bg-(--vscode-sidebar-bg) flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {terminals.map((t) => {
              const isActive = t.id === activeTermId;
              return (
                <div
                  key={t.id}
                  onClick={() => setActiveTermId(t.id)}
                  className={`group flex items-center justify-between px-3 py-1.5 text-[11px] font-mono cursor-pointer border-l-2 transition-colors ${
                    isActive
                      ? "border-(--vscode-accent) bg-(--vscode-line-highlight) text-(--vscode-text-bright)"
                      : "border-transparent text-(--vscode-text-muted) hover:text-(--vscode-text) hover:bg-(--vscode-line-highlight)"
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <CustomIcon
                      name={SHELL_OPTIONS.find((o) => o.type === t.shell)?.icon ?? "Terminal"}
                      size={11}
                    />
                    {SHELL_OPTIONS.find((o) => o.type === t.shell)?.label ?? t.shell}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTerminal(t.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-(--vscode-border) text-(--vscode-text-muted) hover:text-(--vscode-text) transition-opacity"
                  >
                    <CustomIcon name="X" size={10} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
