'use client';

import { useState, useEffect, FormEvent } from 'react';
import { experienceSchema, ExperienceInput } from '@/lib/validation';

interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [current, setCurrent] = useState(false);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const res = await fetch('/api/experience');
      const data = await res.json();
      setExperiences(data);
    } catch {
      console.error('Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCompany('');
    setRole('');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setCurrent(false);
    setFormError('');
    setEditingExp(null);
    setShowForm(false);
  };

  const openEdit = (exp: Experience) => {
    setEditingExp(exp);
    setCompany(exp.company);
    setRole(exp.role);
    setDescription(exp.description);
    setStartDate(exp.startDate);
    setEndDate(exp.endDate || '');
    setCurrent(exp.current);
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    const validation = experienceSchema.safeParse({
      company,
      role,
      description,
      startDate,
      endDate: endDate || undefined,
      current,
    });

    if (!validation.success) {
      setFormError(validation.error.errors[0].message);
      return;
    }

    setSaving(true);
    try {
      const method = editingExp ? 'PUT' : 'POST';
      const endpoint = editingExp
        ? `/api/experience/${editingExp.id}`
        : '/api/experience';

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
      fetchExperiences();
    } catch {
      setFormError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this experience?')) return;
    try {
      const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' });
      if (res.ok) fetchExperiences();
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
            experience
          </h1>
          <p className="text-xs font-mono text-gray-500">
            {experiences.length} role{experiences.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-ink dark:bg-gray-100 text-background dark:text-gray-900 rounded-lg text-sm font-medium hover:opacity-90"
        >
          + Add Role
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
          <h2 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">
            {editingExp ? 'Edit Experience' : 'New Experience'}
          </h2>
          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Company</label>
              <input type="text" value={company} onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono" required />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Role</label>
              <input type="text" value={role} onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono" required />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Start Date</label>
                <input type="text" value={startDate} onChange={(e) => setStartDate(e.target.value)} placeholder="Jan 2024"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono" required />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">End Date (or Present)</label>
                <input type="text" value={endDate} onChange={(e) => setEndDate(e.target.value)} placeholder="Present"
                  className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="current" checked={current} onChange={(e) => setCurrent(e.target.checked)} className="rounded border-gray-300" />
              <label htmlFor="current" className="text-sm font-mono text-gray-600 dark:text-gray-400">Current role</label>
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
        {experiences.map((exp) => (
          <div key={exp.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-ink dark:text-gray-100">{exp.role}</h3>
                {exp.current && (
                  <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider bg-ink text-background rounded-full">Current</span>
                )}
              </div>
              <p className="text-xs font-mono text-gray-500">{exp.company} · {exp.startDate} — {exp.endDate || 'Present'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{exp.description}</p>
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => openEdit(exp)} className="px-3 py-1 text-xs font-mono text-gray-600 dark:text-gray-400 hover:text-ink dark:hover:text-gray-100">Edit</button>
              <button onClick={() => handleDelete(exp.id)} className="px-3 py-1 text-xs font-mono text-red-600 hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
