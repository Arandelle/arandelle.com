'use client';

import { useState, useEffect, FormEvent } from 'react';
import { projectSchema, ProjectInput } from '@/lib/validation';

interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
  image: string | null;
  tags: string[];
  featured: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [featured, setFeatured] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch {
      console.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setUrl('');
    setImage('');
    setTagsInput('');
    setFeatured(false);
    setFormError('');
    setEditingProject(null);
    setShowForm(false);
  };

  const openEditForm = (project: Project) => {
    setEditingProject(project);
    setName(project.name);
    setDescription(project.description);
    setUrl(project.url);
    setImage(project.image || '');
    setTagsInput(project.tags.join(', '));
    setFeatured(project.featured);
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const validation = projectSchema.safeParse({
      name,
      description,
      url,
      image: image || undefined,
      tags,
      featured,
    });

    if (!validation.success) {
      setFormError(validation.error.errors[0].message);
      return;
    }

    setSaving(true);

    try {
      const method = editingProject ? 'PUT' : 'POST';
      const endpoint = editingProject
        ? `/api/projects/${editingProject.id}`
        : '/api/projects';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validation.data),
      });

      if (!res.ok) {
        const error = await res.json();
        setFormError(error.error || 'Failed to save project');
        return;
      }

      resetForm();
      fetchProjects();
    } catch {
      setFormError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProjects();
      }
    } catch {
      console.error('Failed to delete project');
    }
  };

  if (loading) {
    return <p className="text-sm font-mono text-gray-500">Loading...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-pixel text-2xl text-ink dark:text-gray-100 lowercase mb-1">
            projects
          </h1>
          <p className="text-xs font-mono text-gray-500">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 bg-ink dark:bg-gray-100 text-background dark:text-gray-900 rounded-lg text-sm font-medium hover:opacity-90"
        >
          + New Project
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
          <h2 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">
            {editingProject ? 'Edit Project' : 'New Project'}
          </h2>

          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
                URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
                Image URL (optional)
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Next.js, React, TypeScript"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="featured" className="text-sm font-mono text-gray-600 dark:text-gray-400">
                Featured project
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-ink dark:bg-gray-100 text-background dark:text-gray-900 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-mono text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 flex items-start justify-between"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-ink dark:text-gray-100">
                  {project.name}
                </h3>
                {project.featured && (
                  <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-ink text-background rounded-full">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {project.description}
              </p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-gray-500 border border-gray-300 dark:border-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => openEditForm(project)}
                className="px-3 py-1 text-xs font-mono text-gray-600 dark:text-gray-400 hover:text-ink dark:hover:text-gray-100"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="px-3 py-1 text-xs font-mono text-red-600 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
