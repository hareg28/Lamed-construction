'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Save, Award } from 'lucide-react';

export default function NewCertificatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    issuer: '',
    year: new Date().getFullYear().toString(),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.image.trim()) {
      toast.error('Image URL is required');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/certificates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Certificate added successfully!');
        router.push('/certificates');
        router.refresh();
      } else {
        toast.error(data.error || 'Failed to add certificate');
      }
    } catch {
      toast.error('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/certificates"
          className="p-2 rounded-lg text-navy-600 hover:bg-navy-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Add New Certificate</h1>
          <p className="text-navy-500 text-sm">Upload certification details to display on the company website</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-card border border-navy-100 p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-sm font-bold text-navy-700 mb-2">
            Certificate Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. ISO 9001 Quality Management Certification"
            className="w-full px-4 py-3 bg-navy-50/50 border border-navy-200 rounded-xl text-navy-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-navy-700 mb-2">
            Image URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            required
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            placeholder="/assets/images/certeficate.jpg"
            className="w-full px-4 py-3 bg-navy-50/50 border border-navy-200 rounded-xl text-navy-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
          <p className="text-xs text-navy-400 mt-1">
            Provide a direct image URL for the certificate or award photo.
          </p>
        </div>

        {formData.image && (
          <div className="p-4 bg-navy-50 rounded-xl space-y-2">
            <span className="text-xs font-semibold text-navy-600 block">Image Preview:</span>
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-navy-200 max-h-48">
              <img
                src={formData.image}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-navy-700 mb-2">
              Issuing Organization / Authority
            </label>
            <input
              type="text"
              value={formData.issuer}
              onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
              placeholder="e.g. Ministry of Urban Development"
              className="w-full px-4 py-3 bg-navy-50/50 border border-navy-200 rounded-xl text-navy-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-navy-700 mb-2">
              Year Awarded
            </label>
            <input
              type="text"
              value={formData.year}
              onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              placeholder="2025"
              className="w-full px-4 py-3 bg-navy-50/50 border border-navy-200 rounded-xl text-navy-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-3 border-t border-navy-100">
          <Link
            href="/certificates"
            className="px-6 py-3 rounded-xl border border-navy-200 text-navy-700 font-semibold text-sm hover:bg-navy-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? 'Saving...' : 'Save Certificate'}
          </button>
        </div>
      </form>
    </div>
  );
}
