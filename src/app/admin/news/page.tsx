'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
} from 'lucide-react';
import type { NewsPost } from '@/types';

export default function AdminNewsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<NewsPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadPosts() {
    setLoading(true);
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      if (data.success) setPosts(data.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, []);

  const filtered = posts.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase()) ||
      n.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/news/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Post deleted', {
          description: `"${deleteTarget.title}" has been removed.`,
        });
        setPosts((prev) => prev.filter((n) => n.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast.error('Failed to delete post');
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
          <h1 className="text-2xl font-bold text-navy-800">News & Articles</h1>
          <p className="text-navy-500 text-sm">Manage company news and blog posts</p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-lg shadow-amber-500/25 transition-all"
        >
          <Plus className="w-4.5 h-4.5" />
          New Post
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-card p-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts by title, category, author..."
            className="w-full pl-10 pr-4 py-2.5 bg-navy-50/50 border border-navy-200 rounded-lg text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy-50/50 border-b border-navy-100">
              <tr>
                <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-4">
                  Post
                </th>
                <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-4">
                  Category
                </th>
                <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-4">
                  Author
                </th>
                <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-4">
                  Published
                </th>
                <th className="text-right text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-navy-400 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading posts...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-navy-400 text-sm">
                    No posts found
                  </td>
                </tr>
              ) : (
                filtered.map((post) => (
                  <tr key={post.id} className="hover:bg-navy-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg bg-navy-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-navy-100">
                          <img
                            src={post.coverImage}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-navy-800 line-clamp-1">
                            {post.title}
                          </p>
                          <p className="text-xs text-navy-400 line-clamp-1 mt-0.5">
                            {post.excerpt}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-600">
                      {post.author}
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-500 whitespace-nowrap">
                      {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/news/${post.id}/edit`}
                          className="p-2 rounded-lg text-navy-600 hover:bg-navy-100 hover:text-navy-800 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4.5 h-4.5" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(post)}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length > 0 && (
          <div className="px-6 py-4 border-t border-navy-100 bg-navy-50/30 text-sm text-navy-500">
            Showing {filtered.length} of {posts.length} posts
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="p-1.5 rounded-lg hover:bg-navy-100 text-navy-400 hover:text-navy-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-navy-800 mb-2">
                Delete News Post
              </h3>
              <p className="text-sm text-navy-500 mb-1">
                Are you sure you want to delete this post?
              </p>
              <p className="text-sm font-medium text-navy-700 bg-navy-50 rounded-lg px-3 py-2 mb-6">
                {deleteTarget.title}
              </p>
              <p className="text-xs text-red-500 mb-6">
                This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleting}
                  className="px-4 py-2.5 rounded-lg font-medium text-navy-700 hover:bg-navy-100 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-2.5 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-red-500/25 flex items-center gap-2"
                >
                  {deleting && (
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  {deleting ? 'Deleting...' : 'Delete Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
