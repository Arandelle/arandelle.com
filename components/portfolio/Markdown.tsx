import React from 'react';

// Render inline tokens: **bold**, *italic*, `code`
function renderInline(text: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(
        <strong key={key++} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith('`')) {
      nodes.push(
        <code
          key={key++}
          className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono-label text-[13px] text-foreground"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      nodes.push(
        <em key={key++} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

const Markdown: React.FC<{ content: string }> = ({ content }) => {
  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const code: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(lines[i]);
        i++;
      }
      i++;
      blocks.push(
        <pre
          key={key++}
          className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50 p-4 font-mono-label text-[13px] leading-6 text-foreground"
        >
          <code className="font-mono">{code.join('\n')}</code>
        </pre>,
      );
      continue;
    }

    // Headings
    if (line.startsWith('### ')) {
      blocks.push(
        <h3 key={key++} className="mt-8 font-serif text-[1.1rem] font-semibold tracking-tight text-foreground">
          {renderInline(line.slice(4))}
        </h3>,
      );
      i++;
      continue;
    }
    if (line.startsWith('## ')) {
      blocks.push(
        <h2 key={key++} className="mt-8 font-serif text-[1.3rem] font-semibold tracking-tight text-foreground">
          {renderInline(line.slice(3))}
        </h2>,
      );
      i++;
      continue;
    }
    if (line.startsWith('# ')) {
      blocks.push(
        <h1 key={key++} className="mt-8 font-serif text-[1.6rem] font-semibold tracking-tight text-foreground">
          {renderInline(line.slice(2))}
        </h1>,
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quote.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <blockquote
          key={key++}
          className="border-l border-gray-200 pl-4 font-serif text-[17px] italic leading-[1.75] text-gray-500"
        >
          {renderInline(quote.join(' '))}
        </blockquote>,
      );
      continue;
    }

    // Unordered list
    if (/^[-*] /.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i].trim())) {
        items.push(lines[i].trim().slice(2));
        i++;
      }
      blocks.push(
        <ul key={key++} className="ml-5 list-disc space-y-1.5 font-serif text-[17px] leading-[1.75] text-gray-500">
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (/^\d+\.\s/.test(line.trim())) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s/, ''));
        i++;
      }
      blocks.push(
        <ol
          key={key++}
          className="ml-5 list-decimal space-y-1.5 font-serif text-[17px] leading-[1.75] text-gray-500"
        >
          {items.map((it, idx) => (
            <li key={idx}>{renderInline(it)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    // Blank line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('> ') &&
      !lines[i].trim().startsWith('```') &&
      !/^[-*] /.test(lines[i].trim()) &&
      !/^\d+\.\s/.test(lines[i].trim())
    ) {
      para.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={key++} className="font-serif text-[17px] leading-[1.75] text-gray-500">
        {renderInline(para.join(' '))}
      </p>,
    );
  }

  return <div className="space-y-4">{blocks}</div>;
};

export default Markdown;
