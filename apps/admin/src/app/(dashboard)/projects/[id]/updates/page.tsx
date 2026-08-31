'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Plus,
  Calendar,
  Pencil,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import type { Project, ProjectUpdate, ProjectStatus } from '@lamed/shared';

const updateSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: z.string().optional(),
});

type UpdateForm = z.infer<typeof updateSchema>;

const statusColors: Record<ProjectStatus, string> = {
  new_contract: 'bg-blue-100 text-blue-700 border-blue-200',
  under_construction: 'bg-amber-100 text-amber-700 border-amber-200',
  finished: 'bg-green-100 text-green-700 border-green-200',
};

const statusLabels: Record<ProjectStatus, string> = {
  new_contract: 'New Contract',
  under_construction: 'Under Construction',
  finished: 'Finished',
};

export default function ProjectUpdatesPage() {
  const params = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateForm>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      title: '',
      description: '',
      image: '',
    },
  });

  async function loadData() {
    setLoading(true);
    try {
      const [projRes, updRes] = await Promise.all([
        fetch(`/api/projects/${params.id}`).then((r) => r.json()),
        fetch(`/api/projects/${params.id}/updates`).then((r) => r.json()),
      ]);
      if (projRes.success) setProject(projRes.data);
      if (updRes.success) setUpdates(updRes.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [params.id]);

  const onSubmit = async (data: UpdateForm) => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${params.id}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: data.date,
          title: data.title,
          description: data.description,
          image: data.image || undefined,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success('Update added', {
          description: 'Project timeline has been updated.',
        });
        setUpdates((prev) => [...prev, result.data]);
        reset({
          date: new Date().toISOString().split('T')[0],
          title: '',
          description: '',
          image: '',
        });
      } else {
        toast.error('Failed to add update', {
          description: result.error,
        });
      }
    } catch {
      toast.error('Connection error');
    } finally {
      setSubmitting(false);
    }
  };

  const sortedUpdates = [...updates].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 max-w-5xl mx-auto">
        <div className="flex items-center gap-3 text-navy-600">
          <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading project updates...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/projects"
            className="p-2.5 rounded-lg hover:bg-white text-navy-600 hover:text-navy-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-navy-800">
                {project?.title || 'Project'}
              </h1>
              {project && (
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[project.status]}`}
                >
                  {statusLabels[project.status]}
                </span>
              )}
            </div>
            <p className="text-navy-500 text-sm mt-1">Timeline Updates</p>
          </div>
        </div>
        <Link
          href={`/projects/${params.id}/edit`}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-navy-200 hover:border-amber-500 text-navy-700 hover:text-amber-600 font-medium rounded-lg transition-all"
        >
          <Pencil className="w-4.5 h-4.5" />
          Edit Project
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-card p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-navy-800 mb-1 flex items-center gap-2">
              <Plus className="w-5 h-5 text-amber-500" />
              Add New Update
            </h2>
            <p className="text-xs text-navy-500 mb-5">
              Post a milestone or progress update to the project timeline.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  <Calendar className="w-3.5 h-3.5 inline mr-1.5" />
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('date')}
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.date ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm`}
                />
                {errors.date && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.date.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  Update Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('title')}
                  placeholder="e.g. Foundation Complete"
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.title ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm`}
                />
                {errors.title && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="Describe the update in detail..."
                  className={`w-full px-4 py-2.5 rounded-lg border ${errors.description ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm resize-none`}
                />
                {errors.description && (
                  <p className="mt-1.5 text-xs text-red-500">{errors.description.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  <ImageIcon className="w-3.5 h-3.5 inline mr-1.5" />
                  Image URL <span className="text-navy-400">(Optional)</span>
                </label>
                <input
                  type="text"
                  {...register('image')}
                  placeholder="/assets/images/update.jpg"
                  className="w-full px-4 py-2.5 rounded-lg border border-navy-200 bg-navy-50/50 text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-lg shadow-amber-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-sm"
              >
                {submitting && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                <Plus className="w-4 h-4" />
                {submitting ? 'Adding...' : 'Post Update'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-card overflow-hidden">
            <div className="px-6 py-4 border-b border-navy-100">
              <h2 className="text-lg font-semibold text-navy-800">Project Timeline</h2>
              <p className="text-xs text-navy-500 mt-0.5">
                {sortedUpdates.length} update{sortedUpdates.length !== 1 ? 's' : ''}
              </p>
            </div>
            {sortedUpdates.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="w-16 h-16 rounded-2xl bg-navy-50 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-navy-300" />
                </div>
                <p className="text-navy-600 font-medium mb-1">No updates yet</p>
                <p className="text-sm text-navy-400">
                  Post the first progress update using the form on the left.
                </p>
              </div>
            ) : (
              <div className="relative px-6 py-6">
                <div className="absolute left-10 top-6 bottom-6 w-0.5 bg-navy-100" />
                <div className="space-y-6">
                  {sortedUpdates.map((update, idx) => (
                    <div key={update.id} className="relative flex gap-5">
                      <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <span className="text-[10px] font-bold">{idx + 1}</span>
                      </div>
                      <div className="flex-1 bg-navy-50/60 rounded-xl p-5 border border-navy-100 hover:border-amber-200 transition-colors">
                        <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                          <div>
                            <p className="font-semibold text-navy-800">{update.title}</p>
                            <p className="text-xs text-navy-500 mt-0.5 flex items-center gap-1.5">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(update.date), 'MMMM d, yyyy')}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 rounded-md text-navy-400 hover:bg-white hover:text-navy-600 transition-colors">
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1.5 rounded-md text-navy-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-navy-600 leading-relaxed whitespace-pre-wrap">
                          {update.description}
                        </p>
                        {update.image && (
                          <div className="mt-4 rounded-lg overflow-hidden border border-navy-100">
                            <img
                              src={update.image}
                              alt={update.title}
                              className="w-full max-h-60 object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
