import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { profile } from '@/lib/data';

const ChatButton: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-72 rounded-xl border border-gray-200 bg-background p-4 shadow-modal">
          <p className="text-[15px] font-semibold tracking-tight text-foreground">Say hello</p>
          <p className="mt-1 font-mono-label text-[11px] leading-5 text-gray-500">
            Have a question or an opportunity? Drop me a line and I&apos;ll get back to you.
          </p>
          <a
            href={`mailto:${profile.email}`}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md bg-foreground px-3 py-2 font-mono-label text-[12px] text-background transition-colors hover:opacity-90"
          >
            <Send className="h-3.5 w-3.5" />
            Email me
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open chat"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-card transition-colors hover:opacity-90"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </div>
  );
};

export default ChatButton;
