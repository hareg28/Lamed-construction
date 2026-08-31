'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum(['residential', 'commercial', 'mixed_use', 'special', 'renovation'], {
    required_error: 'Please select a project type',
  }),
  status: z.enum(['new_contract', 'under_construction', 'finished'], {
    required_error: 'Please select a status',
  }),
  clientName: z.string().min(2, 'Client name is required'),
  contractValue: z.coerce.number().min(1, 'Contract value must be greater than 0'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  location: z.string().min(3, 'Location is required'),
  coverImage: z.string().min(5, 'Cover image URL is required'),
  gallery: z.string().optional(),
  featured: z.boolean().default(false),
});

type ProjectForm = z.infer<typeof projectSchema>;

export default function NewProjectPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      type: 'commercial',
      status: 'new_contract',
      clientName: '',
      contractValue: 0,
      startDate: '',
      endDate: '',
      location: '',
      coverImage: '',
      gallery: '',
      featured: false,
    },
  });

  const onSubmit = async (data: ProjectForm) => {
    try {
      const galleryArray = data.gallery
        ? data.gallery.split('\n').map((l) => l.trim()).filter(Boolean)
        : [];

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          gallery: galleryArray,
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success('Project created', {
          description: 'Now add timeline updates for this project.',
        });
        router.push(`/projects/${result.data.id}/updates`);
        router.refresh();
      } else {
        toast.error('Failed to create project', {
          description: result.error || 'Please check your inputs.',
        });
      }
    } catch {
      toast.error('Connection error');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/projects"
          className="p-2.5 rounded-lg hover:bg-white text-navy-600 hover:text-navy-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-navy-800">New Project</h1>
          <p className="text-navy-500 text-sm">Add a new construction project</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-navy-800 border-b border-navy-100 pb-3 mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                className={`w-full px-4 py-3 rounded-lg border ${errors.title ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                placeholder="e.g. East College Building"
              />
              {errors.title && (
                <p className="mt-1.5 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className={`w-full px-4 py-3 rounded-lg border ${errors.description ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none`}
                placeholder="Describe the project scope, specifications, and key details..."
              />
              {errors.description && (
                <p className="mt-1.5 text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Project Type <span className="text-red-500">*</span>
              </label>
              <select
                {...register('type')}
                className={`w-full px-4 py-3 rounded-lg border ${errors.type ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
              >
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="mixed_use">Mixed Use</option>
                <option value="special">Special</option>
                <option value="renovation">Renovation</option>
              </select>
              {errors.type && (
                <p className="mt-1.5 text-sm text-red-500">{errors.type.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                {...register('status')}
                className={`w-full px-4 py-3 rounded-lg border ${errors.status ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
              >
                <option value="new_contract">New Contract</option>
                <option value="under_construction">Under Construction</option>
                <option value="finished">Finished</option>
              </select>
              {errors.status && (
                <p className="mt-1.5 text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-navy-800 border-b border-navy-100 pb-3 mb-4">
            Client & Contract
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Client Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('clientName')}
                className={`w-full px-4 py-3 rounded-lg border ${errors.clientName ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                placeholder="Client company or person name"
              />
              {errors.clientName && (
                <p className="mt-1.5 text-sm text-red-500">{errors.clientName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Contract Value (ETB) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register('contractValue')}
                className={`w-full px-4 py-3 rounded-lg border ${errors.contractValue ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                placeholder="e.g. 85000000"
              />
              {errors.contractValue && (
                <p className="mt-1.5 text-sm text-red-500">{errors.contractValue.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                {...register('startDate')}
                className={`w-full px-4 py-3 rounded-lg border ${errors.startDate ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
              />
              {errors.startDate && (
                <p className="mt-1.5 text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                End Date <span className="text-navy-400">(Optional)</span>
              </label>
              <input
                type="date"
                {...register('endDate')}
                className="w-full px-4 py-3 rounded-lg border border-navy-200 bg-navy-50/50 text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('location')}
                className={`w-full px-4 py-3 rounded-lg border ${errors.location ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                placeholder="e.g. Bole, Addis Ababa"
              />
              {errors.location && (
                <p className="mt-1.5 text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card p-6 space-y-5">
          <h2 className="text-lg font-semibold text-navy-800 border-b border-navy-100 pb-3 mb-4">
            Media & Settings
          </h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Cover Image URL <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('coverImage')}
                className={`w-full px-4 py-3 rounded-lg border ${errors.coverImage ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                placeholder="/assets/images/project.jpg or https://..."
              />
              {errors.coverImage && (
                <p className="mt-1.5 text-sm text-red-500">{errors.coverImage.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Gallery Images <span className="text-navy-400">(One URL per line)</span>
              </label>
              <textarea
                {...register('gallery')}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-navy-200 bg-navy-50/50 text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none font-mono text-sm"
                placeholder={"/assets/images/gallery1.jpg\n/assets/images/gallery2.jpg\n/assets/images/gallery3.jpg"}
              />
            </div>
            <div className="flex items-center gap-3 bg-navy-50/70 p-4 rounded-lg">
              <input
                type="checkbox"
                id="featured"
                {...register('featured')}
                className="w-4.5 h-4.5 text-amber-500 border-navy-300 rounded focus:ring-amber-500"
              />
              <div>
                <label htmlFor="featured" className="text-sm font-medium text-navy-800 cursor-pointer">
                  Featured Project
                </label>
                <p className="text-xs text-navy-500 mt-0.5">
                  Show this project prominently on the homepage and featured sections
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/projects"
            className="px-5 py-3 rounded-lg font-medium text-navy-700 hover:bg-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-lg shadow-amber-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4.5 w-4.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            <Save className="w-4.5 h-4.5" />
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </form>
    </div>
  );
}
