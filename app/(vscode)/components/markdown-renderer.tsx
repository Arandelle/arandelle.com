"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <div className="markdown-body px-4 sm:px-6 md:px-8 py-4 max-w-[800px] font-sans text-[14px] leading-[1.7] text-[var(--vscode-text)]">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
