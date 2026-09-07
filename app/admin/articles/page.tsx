'use client';

import { useState, useEffect, FormEvent } from 'react';
import { articleSchema, ArticleInput } from '@/lib/validation';

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  published: boolean;
  date: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(false);
  const [date, setDate] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      const data = await res.json();
      setArticles(data);
    } catch {
      console.error('Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSlug('');
    setTitle('');
    setExcerpt('');
    setContent('');
    setPublished(false);
    setDate('');
    setFormError('');
    setEditingArticle(null);
    setShowForm(false);
  };

  const openEdit = (article: Article) => {
    setEditingArticle(article);
    setSlug(article.slug);
    setTitle(article.title);
    setExcerpt(article.excerpt);
    setContent(article.content);
    setPublished(article.published);
    setDate(article.date);
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    const validation = articleSchema.safeParse({
      slug,
      title,
      excerpt,
      content,
      published,
      date,
    });

    if (!validation.success) {
      setFormError(validation.error.errors[0].message);
      return;
    }

    setSaving(true);
    try {
      const method = editingArticle ? 'PUT' : 'POST';
      const endpoint = editingArticle
        ? `/api/articles/${editingArticle.id}`
        : '/api/articles';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      });

      if (!res.ok) {
        const error = await res.json();
        setFormError(error.error || 'Failed to save');
        return;
      }

      resetForm();
      fetchArticles();
    } catch {
      setFormError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' });
      if (res.ok) fetchArticles();
    } catch {
      console.error('Failed to delete');
    }
  };

  if (loading) return <p className="text-sm font-mono text-gray-500">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-pixel text-2xl text-ink dark:text-gray-100 lowercase mb-1">
            articles
          </h1>
          <p className="text-xs font-mono text-gray-500">
            {articles.length} article{articles.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-ink dark:bg-gray-100 text-background dark:text-gray-900 rounded-lg text-sm font-medium hover:opacity-90"
        >
          + New Article
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
          <h2 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">
            {editingArticle ? 'Edit Article' : 'New Article'}
          </h2>
          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Slug</label>
                <input type="text" value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="my-article"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono" required />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Date</label>
                <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Jan 2024"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono" required />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono" required />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Excerpt</label>
              <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono" required />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Content (MDX)</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono" required />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="published" checked={published} onChange={(e) => setPublished(e.target.checked)} className="rounded border-gray-300" />
              <label htmlFor="published" className="text-sm font-mono text-gray-600 dark:text-gray-400">Publish immediately</label>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={saving} className="px-4 py-2 bg-ink dark:bg-gray-100 text-background dark:text-gray-900 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button type="button" onClick={resetForm} className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {articles.map((article) => (
          <div key={article.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-ink dark:text-gray-100">{article.title}</h3>
                {article.published && (
                  <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-ink text-background rounded-full">Published</span>
                )}
              </div>
              <p className="text-xs font-mono text-gray-500">{article.slug} · {article.date}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{article.excerpt}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => openEdit(article)} className="px-3 py-1 text-xs font-mono text-gray-600 dark:text-gray-400 hover:text-ink dark:hover:text-gray-100">Edit</button>
              <button onClick={() => handleDelete(article.id)} className="px-3 py-1 text-xs font-mono text-red-600 hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
