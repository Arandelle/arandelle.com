"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User, MessageSquare, ChevronRight } from "lucide-react";
import { usePortfolio } from "@/context/vscode-context";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatPanel() {
  const { closeChat, data, chatExpanded, toggleChatExpand } = usePortfolio();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hi! I'm an AI assistant for Arandelle's portfolio. Ask me anything about their experience, projects, or skills!`,
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const q = userMessage.content.toLowerCase();
      let response: string;

      if (q.includes("experience") || q.includes("work") || q.includes("job")) {
        const exp = data.experiences?.[0];
        response = exp
          ? `Arandelle is currently a ${exp.title ?? exp.role} at ${exp.company}. ${exp.description}`
          : "Arandelle is a Fullstack Web Developer at JPSC Group Holdings Inc., working with React, Next.js, Node.js, and MongoDB.";
      } else if (q.includes("project")) {
        const names = data.projects?.map((p) => p.name).join(", ");
        response = names
          ? `Arandelle has worked on: ${names}. Each project showcases different skills and technologies.`
          : "Arandelle has worked on several projects including restaurant ordering platforms and AI-powered tools.";
      } else if (q.includes("skill") || q.includes("tech") || q.includes("stack")) {
        response =
          "Arandelle works with JavaScript/TypeScript, React, Next.js, Node.js, Express, MongoDB, Tailwind CSS, Docker, and Git. Also experienced in Figma design and UI/UX.";
      } else if (q.includes("education")) {
        response =
          "Arandelle holds a BS in Information Technology from Cavite State University – Tanza Campus (2020–2025).";
      } else if (q.includes("contact") || q.includes("email") || q.includes("hire")) {
        response =
          "You can reach Arandelle at hello@arandelle.com, or connect on LinkedIn and GitHub.";
      } else {
        response =
          "That's a great question! I'm a demo AI for now, but feel free to explore the file tree to learn more about Arandelle's work. Try opening about.tsx or experience.tsx!";
      }

      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    }, 500);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeChat();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [closeChat]);

  return (
    <div 
      className={`bg-[var(--vscode-sidebar-bg)] border-l border-[var(--vscode-border)] flex flex-col shrink-0 transition-all duration-200 ${
        chatExpanded ? "w-[320px] sm:w-[360px]" : "w-[48px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-2.5 border-b border-[var(--vscode-border)]">
        {!chatExpanded ? (
          <button
            onClick={toggleChatExpand}
            className="p-1 rounded hover:bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] transition-colors w-full flex items-center justify-center"
            title="Expand AI Chat"
          >
            <MessageSquare size={18} />
          </button>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Bot size={16} className="text-[var(--vscode-accent)]" />
              <span className="text-[13px] font-medium text-[var(--vscode-text-bright)]">
                AI Chat
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={toggleChatExpand}
                className="p-1 rounded hover:bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] transition-colors"
                title="Collapse"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={closeChat}
                className="p-1 rounded hover:bg-[var(--vscode-line-highlight)] text-[var(--vscode-text-muted)] hover:text-[var(--vscode-text)] transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </>
        )}
      </div>

      {chatExpanded && (
        <>
          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                    msg.role === "assistant"
                      ? "bg-[var(--vscode-accent)]"
                      : "bg-[var(--vscode-badge-bg)]"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Bot size={12} className="text-white" />
                  ) : (
                    <User size={12} className="text-white" />
                  )}
                </div>
                <div
                  className={`text-[13px] leading-relaxed max-w-[80%] rounded-lg px-3 py-2 ${
                    msg.role === "assistant"
                      ? "bg-[var(--vscode-input-bg)] text-[var(--vscode-text)]"
                      : "bg-[var(--vscode-accent)] text-white"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-[var(--vscode-border)]"
          >
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Arandelle..."
                className="flex-1 px-3 py-2 text-[13px] bg-[var(--vscode-input-bg)] border border-[var(--vscode-input-border)] rounded text-[var(--vscode-text)] focus:outline-none focus:border-[var(--vscode-accent)]"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-[var(--vscode-accent)] hover:bg-[var(--vscode-accent-hover)] rounded text-white transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
