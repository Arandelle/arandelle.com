'use client';

import { useState, useEffect, FormEvent } from 'react';
import { certificationSchema, CertificationInput } from '@/lib/validation';

interface Certification {
  id: string;
  name: string;
  issuer: string;
  url: string | null;
  date: string;
}

export default function CertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [url, setUrl] = useState('');
  const [date, setDate] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCerts();
  }, []);

  const fetchCerts = async () => {
    try {
      const res = await fetch('/api/certifications');
      const data = await res.json();
      setCerts(data);
    } catch {
      console.error('Failed to fetch certifications');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setIssuer('');
    setUrl('');
    setDate('');
    setFormError('');
    setEditingCert(null);
    setShowForm(false);
  };

  const openEdit = (cert: Certification) => {
    setEditingCert(cert);
    setName(cert.name);
    setIssuer(cert.issuer);
    setUrl(cert.url || '');
    setDate(cert.date);
    setFormError('');
    setShowForm(true);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError('');

    const validation = certificationSchema.safeParse({
      name,
      issuer,
      url: url || undefined,
      date,
    });

    if (!validation.success) {
      setFormError(validation.error.errors[0].message);
      return;
    }

    setSaving(true);
    try {
      const method = editingCert ? 'PUT' : 'POST';
      const endpoint = editingCert
        ? `/api/certifications/${editingCert.id}`
        : '/api/certifications';

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
      fetchCerts();
    } catch {
      setFormError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certification?')) return;
    try {
      const res = await fetch(`/api/certifications/${id}`, { method: 'DELETE' });
      if (res.ok) fetchCerts();
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
            certifications
          </h1>
          <p className="text-xs font-mono text-gray-500">
            {certs.length} certification{certs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="px-4 py-2 bg-ink dark:bg-gray-100 text-background dark:text-gray-900 rounded-lg text-sm font-medium hover:opacity-90"
        >
          + New Certification
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900">
          <h2 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">
            {editingCert ? 'Edit Certification' : 'New Certification'}
          </h2>
          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{formError}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono" required />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Issuer</label>
              <input type="text" value={issuer} onChange={(e) => setIssuer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono" required />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">URL (optional)</label>
              <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono" />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider mb-1">Date</label>
              <input type="text" value={date} onChange={(e) => setDate(e.target.value)} placeholder="Jan 2024"
                className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm font-mono" required />
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
        {certs.map((cert) => (
          <div key={cert.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 flex items-start justify-between">
            <div>
              <h3 className="text-sm font-medium text-ink dark:text-gray-100 mb-1">{cert.name}</h3>
              <p className="text-xs font-mono text-gray-500">{cert.issuer} · {cert.date}</p>
              {cert.url && (
                <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-gray-400 hover:text-ink dark:hover:text-gray-200 mt-1 inline-block">
                  View credential ↗
                </a>
              )}
            </div>
            <div className="flex gap-2 ml-4">
              <button onClick={() => openEdit(cert)} className="px-3 py-1 text-xs font-mono text-gray-600 dark:text-gray-400 hover:text-ink dark:hover:text-gray-100">Edit</button>
              <button onClick={() => handleDelete(cert.id)} className="px-3 py-1 text-xs font-mono text-red-600 hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
