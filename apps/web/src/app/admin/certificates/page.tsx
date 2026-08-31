'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Plus, Trash2, Award, ExternalLink, Calendar, Building2 } from 'lucide-react';
import type { Certificate } from '@/types';

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Certificate | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadCertificates() {
    setLoading(true);
    try {
      const res = await fetch('/api/certificates');
      const data = await res.json();
      if (data.success) setCerts(data.data);
    } catch {
      toast.error('Failed to load certificates');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCertificates();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/certificates/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Certificate removed', {
          description: `"${deleteTarget.title}" has been deleted.`,
        });
        setCerts((prev) => prev.filter((c) => c.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast.error('Failed to delete certificate');
      }
    } catch {
      toast.error('Connection error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Certificates & Awards</h1>
          <p className="text-navy-500 text-sm">Manage certifications, awards, and official credentials</p>
        </div>
        <Link
          href="/admin/certificates/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium rounded-lg shadow-lg shadow-emerald-500/25 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Certificate
        </Link>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-card p-12 text-center text-navy-500">
          Loading certificates...
        </div>
      ) : certs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-card p-12 text-center space-y-3">
          <Award className="w-12 h-12 text-navy-300 mx-auto" />
          <h3 className="text-lg font-bold text-navy-800">No Certificates Added Yet</h3>
          <p className="text-navy-500 text-sm max-w-sm mx-auto">
            Add company licenses, awards, and certifications to display them on the About page.
          </p>
          <Link
            href="/admin/certificates/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors mt-2"
          >
            <Plus className="w-4 h-4" />
            Add First Certificate
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-xl shadow-card border border-navy-100 overflow-hidden group hover:shadow-card-hover transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-navy-50 overflow-hidden">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => setDeleteTarget(cert)}
                    className="p-2 rounded-lg bg-red-500/90 text-white hover:bg-red-600 transition-colors shadow-md"
                    title="Delete certificate"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-bold text-navy-800 text-lg leading-tight mb-2">
                    {cert.title}
                  </h3>
                  <div className="space-y-1 text-xs text-navy-500">
                    {cert.issuer && (
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-navy-400 shrink-0" />
                        <span>{cert.issuer}</span>
                      </div>
                    )}
                    {cert.year && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-navy-400 shrink-0" />
                        <span>{cert.year}</span>
                      </div>
                    )}
                  </div>
                </div>

                <a
                  href={cert.image}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors pt-2 border-t border-navy-100"
                >
                  View full image
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-navy-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-bold text-navy-800">Delete Certificate</h3>
            <p className="text-navy-600 text-sm">
              Are you sure you want to delete <span className="font-semibold text-navy-800">"{deleteTarget.title}"</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-navy-200 text-navy-700 text-sm font-medium hover:bg-navy-50 transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
