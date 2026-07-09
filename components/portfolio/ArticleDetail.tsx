import React from 'react';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import Markdown from './Markdown';
import { formatDate } from './Blog';
import { type Article } from '@/lib/data';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
}

const ArticleDetail: React.FC<ArticleDetailProps> = ({ article, onBack }) => {
  return (
    <article>
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 font-mono-label text-[12px] text-gray-400 transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to all writing
      </button>

      <header className="mt-8 border-b border-gray-200 pb-8">
        <h1 className="font-serif text-[1.6rem] font-semibold tracking-tight text-foreground leading-[1.2]">{article.title}</h1>
        <div className="mt-3 flex items-center gap-4 font-mono-label text-[9px] uppercase tracking-[1px] text-gray-400">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(article.date)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readingTime}
          </span>
        </div>
      </header>

      <div className="mt-8">
        <Markdown content={article.content} />
      </div>

      <div className="mt-12 border-t border-gray-200 pt-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 font-mono-label text-[12px] text-gray-400 transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to all writing
        </button>
      </div>
    </article>
  );
};

export default ArticleDetail;
