'use client';

import React, { useState } from 'react';
import { ArrowUpRight, X } from 'lucide-react';
import { articles } from '@/lib/data';
import type { Article } from '@/lib/data';
import { useReveal } from '@/lib/useReveal';

const BlogSection: React.FC = () => {
  const ref = useReveal();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <section
      id="blog"
      ref={ref}
      className="relative py-32 sm:py-40 px-6 sm:px-12 lg:px-20 bg-gray-50/80 dark:bg-white/[0.02]"
    >
  
      <div className="relative max-w-6xl mx-auto">
        {/* Section label */}
        <div className="reveal">
          <span className="font-mono text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500">
            06 — Blog
          </span>
        </div>

        {/* Big heading */}
        <div className="mt-8 reveal" style={{ transitionDelay: '100ms' }}>
          <h2 className="display-text text-5xl sm:text-6xl md:text-7xl">
            Thoughts &{' '}
            <span className="text-angled">writing.</span>
          </h2>
        </div>

        {/* Article list */}
        <div className="mt-16 space-y-6">
          {articles.map((article, i) => (
            <button
              key={article.slug}
              onClick={() => setSelectedArticle(article)}
              className="reveal group w-full text-left"
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div className="relative rounded-2xl border border-gray-200 dark:border-gray-200/40 bg-white dark:bg-gray-100/60 p-8 transition-all hover:border-gray-400 dark:hover:border-gray-300">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Meta */}
                    <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-gray-400">
                      <span>
                        {new Date(article.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </span>
                      <span>·</span>
                      <span>{article.readingTime}</span>
                    </div>

                    {/* Title */}
                    <h3 className="mt-3 text-xl sm:text-2xl font-bold group-hover:text-ink dark:group-hover:text-white transition-colors">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="mt-3 text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl">
                      {article.excerpt}
                    </p>
                  </div>

                  <ArrowUpRight className="h-5 w-5 text-gray-400 flex-shrink-0 transition-all group-hover:text-ink dark:group-hover:text-white group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Article modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-sm"
          onClick={() => setSelectedArticle(null)}
        >
          <div
            className="relative w-full max-w-3xl max-h-[80vh] overflow-y-auto rounded-2xl bg-white dark:bg-gray-100 p-8 sm:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full border border-gray-200 dark:border-gray-200/40 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-200/40 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Meta */}
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-gray-400">
              <span>
                {new Date(selectedArticle.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span>·</span>
              <span>{selectedArticle.readingTime}</span>
            </div>

            {/* Title */}
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold">
              {selectedArticle.title}
            </h2>

            {/* Content */}
            <div className="mt-8 prose prose-gray dark:prose-invert max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedArticle.content
                    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                    .replace(/^\> (.*$)/gm, '<blockquote>$1</blockquote>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/`(.*?)`/g, '<code>$1</code>')
                    .replace(/^- (.*$)/gm, '<li>$1</li>')
                    .replace(/^(\d+)\. (.*$)/gm, '<li>$2</li>')
                    .replace(/\n\n/g, '</p><p>')
                    .replace(/^(?!<[hbl])/gm, '<p>')
                    .replace(/<\/li>\n<li>/g, '</li><li>'),
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BlogSection;
