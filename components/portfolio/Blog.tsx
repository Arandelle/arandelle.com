import React from 'react';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { articles, type Article } from '@/lib/data';

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface BlogProps {
  onSelect: (article: Article) => void;
}

const Blog: React.FC<BlogProps> = ({ onSelect }) => {
  return (
    <div>
      <div className="space-y-3">
        {articles.map((article) => (
          <button
            key={article.slug}
            onClick={() => onSelect(article)}
            className="group block w-full rounded-xl border border-gray-200 bg-gray-50 p-4 text-left shadow-card transition-all duration-350 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-card-hover"
          >
            <div className="flex items-center gap-3 font-mono-label text-[9px] uppercase tracking-[1px] text-gray-400">
              <span className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(article.date)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {article.readingTime}
              </span>
            </div>
            <h3 className="mt-2 flex items-center justify-between text-[15px] font-semibold tracking-tight text-foreground">
              {article.title}
              <ArrowRight className="h-4 w-4 shrink-0 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-foreground" />
            </h3>
            <p className="mt-1.5 font-serif text-[14px] leading-6 text-gray-500">{article.excerpt}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Blog;
