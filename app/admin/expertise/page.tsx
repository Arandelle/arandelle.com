'use client';

import { useState, useEffect, FormEvent } from 'react';
import { expertiseSchema, ExpertiseInput } from '@/lib/validation';

interface Expertise {
  id: string;
  name: string;
  skills: string[];
  order: number;
}

export default function ExpertisePage() {
  const [expertiseList, setExpertiseList] = useState<Expertise[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingExpertise, setEditingExpertise] = useState<Expertise | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [order, setOrder] = useState(0);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchExpertise();
  }, []);

  const fetchExpertise = async () => {
    try {
      const res = await fetch('/api/expertise');
      const data = await res.json();
      setExpertiseList(data);
    } catch {
      console.error('Failed to fetch expertise');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setSkillsInput('');
    setOrder(0);
    setFormError('');
    setEditingExpertise(null);
    setShowForm(false);
  };

  const openEdit = (expertise: Expertise) => {
    setEditingExpertise(expertise);
    setName(expertise.name);
    setSkillsInput(expertise.skills.join(', '));
    setOrder(expertise.order);
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    const skills = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const validation = expertiseSchema.safeParse({
      name,
      skills,
      order,
    });

    if (!validation.success) {
      setFormError(validation.error.errors[0].message);
      return;
    }

    setSaving(true);
    try {
      const method = editingExpertise ? 'PUT' : 'POST';
      const endpoint = editingExpertise
        ? `/api/expertise/${editingExpertise.id}`
        : '/api/expertise';

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
      fetchExpertise();
    } catch {
      setFormError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this expertise group?')) return;
    try {
      const res = await fetch(`/api/expertise/${id}`, { method: 'DELETE' });
      if (res.ok) fetchExpertise();
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
            expertise
          </h1>
          <p className="text-xs font-mono text-gray-500">
            {expertiseList.length} group{expertiseList.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-ink dark:bg-gray-100 text-background dark:text-gray-900 rounded-lg text-sm font-medium hover:opacity-90"
        >
          + New Group
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
          <h2 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">
            {editingExpertise ? 'Edit Expertise' : 'New Expertise'}
          </h2>
          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Frontend"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono" required />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Skills (comma-separated)</label>
              <input type="text" value={skillsInput} onChange={(e) => setSkillsInput(e.target.value)} placeholder="React, TypeScript, Next.js"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono" />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Order</label>
              <input type="number" value={order} onChange={(e) => setOrder(parseInt(e.target.value) || 0)} min={0}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono" />
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
        {expertiseList.map((expertise) => (
          <div key={expertise.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium text-ink dark:text-gray-100">{expertise.name}</h3>
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-gray-500 border border-gray-300 dark:border-gray-600 rounded-full">
                  #{expertise.order}
                </span>
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                {expertise.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-gray-500 border border-gray-300 dark:border-gray-600 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => openEdit(expertise)} className="px-3 py-1 text-xs font-mono text-gray-600 dark:text-gray-400 hover:text-ink dark:hover:text-gray-100">Edit</button>
              <button onClick={() => handleDelete(expertise.id)} className="px-3 py-1 text-xs font-mono text-red-600 hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
