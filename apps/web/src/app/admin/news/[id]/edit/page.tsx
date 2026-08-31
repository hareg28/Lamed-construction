'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import type { NewsPost } from '@/types';

const newsSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  category: z.string().min(2, 'Category is required'),
  coverImage: z.string().min(5, 'Cover image URL is required'),
  author: z.string().min(2, 'Author name is required'),
  publishedAt: z.string().min(1, 'Publish date is required'),
});

type NewsForm = z.infer<typeof newsSchema>;

export default function EditNewsPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<NewsForm>({
    resolver: zodResolver(newsSchema),
    defaultValues: {
      title: '',
      excerpt: '',
      content: '',
      category: '',
      coverImage: '',
      author: '',
      publishedAt: '',
    },
  });

  useEffect(() => {
    async function loadPost() {
      try {
        const res = await fetch(`/api/news/${params.id}`);
        const data = await res.json();
        if (data.success) {
          const post = data.data as NewsPost;
          reset({
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            category: post.category,
            coverImage: post.coverImage,
            author: post.author,
            publishedAt: post.publishedAt.split('T')[0],
          });
        } else {
          toast.error('Post not found');
          router.push('/admin/news');
        }
      } catch {
        toast.error('Failed to load post');
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [params.id, reset, router]);

  const onSubmit = async (data: NewsForm) => {
    try {
      const res = await fetch(`/api/news/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          publishedAt: new Date(data.publishedAt).toISOString(),
        }),
      });

      const result = await res.json();

      if (result.success) {
        toast.success('Post updated', {
          description: 'Changes have been saved.',
        });
        router.push('/admin/news');
        router.refresh();
      } else {
        toast.error('Failed to update post', {
          description: result.error || 'Please check your inputs.',
        });
      }
    } catch {
      toast.error('Connection error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 max-w-4xl mx-auto">
        <div className="flex items-center gap-3 text-navy-600">
          <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading post...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/news"
          className="p-2.5 rounded-lg hover:bg-white text-navy-600 hover:text-navy-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-navy-800">Edit News Post</h1>
          <p className="text-navy-500 text-sm">Update article content and settings</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-xl shadow-card p-6 space-y-5">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Post Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                {...register('title')}
                className={`w-full px-4 py-3 rounded-lg border ${errors.title ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-lg font-medium`}
              />
              {errors.title && (
                <p className="mt-1.5 text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Excerpt <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('excerpt')}
                rows={2}
                className={`w-full px-4 py-3 rounded-lg border ${errors.excerpt ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none`}
              />
              {errors.excerpt && (
                <p className="mt-1.5 text-sm text-red-500">{errors.excerpt.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-2">
                Full Content <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register('content')}
                rows={10}
                className={`w-full px-4 py-3 rounded-lg border ${errors.content ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none leading-relaxed`}
              />
              {errors.content && (
                <p className="mt-1.5 text-sm text-red-500">{errors.content.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-3">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('category')}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.category ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                />
                {errors.category && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.category.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('author')}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.author ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                />
                {errors.author && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.author.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  Publish Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  {...register('publishedAt')}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.publishedAt ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                />
                {errors.publishedAt && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.publishedAt.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-2">
                  Cover Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('coverImage')}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.coverImage ? 'border-red-400 bg-red-50' : 'border-navy-200 bg-navy-50/50'} text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all`}
                />
                {errors.coverImage && (
                  <p className="mt-1.5 text-sm text-red-500">{errors.coverImage.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/news"
            className="px-5 py-3 rounded-lg font-medium text-navy-700 hover:bg-white transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-lg shadow-amber-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting && (
              <svg className="animate-spin h-4.5 w-4.5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            <Save className="w-4.5 h-4.5" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
