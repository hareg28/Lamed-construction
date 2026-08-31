'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Filter,
  X,
  Star,
} from 'lucide-react';
import type { Project, ProjectStatus, ProjectType } from '@lamed/shared';

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

const typeLabels: Record<ProjectType, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  mixed_use: 'Mixed Use',
  special: 'Special',
  renovation: 'Renovation',
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadProjects() {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      if (data.success) setProjects(data.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/projects/${deleteTarget.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Project deleted', {
          description: `${deleteTarget.title} has been removed.`,
        });
        setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        toast.error('Failed to delete project');
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
          <h1 className="text-2xl font-bold text-navy-800">Projects</h1>
          <p className="text-navy-500 text-sm">Manage your construction projects</p>
        </div>
        <Link
          href="/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow-lg shadow-amber-500/25 transition-all"
        >
          <Plus className="w-4.5 h-4.5" />
          New Project
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-card p-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-navy-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or client..."
            className="w-full pl-10 pr-4 py-2.5 bg-navy-50/50 border border-navy-200 rounded-lg text-navy-800 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4.5 h-4.5 text-navy-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-navy-50/50 border border-navy-200 rounded-lg text-navy-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="new_contract">New Contract</option>
            <option value="under_construction">Under Construction</option>
            <option value="finished">Finished</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy-50/50 border-b border-navy-100">
              <tr>
                <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-4">
                  Project
                </th>
                <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-4">
                  Type
                </th>
                <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-4">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-4">
                  Client
                </th>
                <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-4">
                  Value
                </th>
                <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-4">
                  Start
                </th>
                <th className="text-right text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-navy-400 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading projects...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-navy-400 text-sm">
                    No projects found
                  </td>
                </tr>
              ) : (
                filtered.map((project) => (
                  <tr key={project.id} className="hover:bg-navy-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-lg bg-navy-100 flex items-center justify-center overflow-hidden flex-shrink-0 border border-navy-100">
                          <img
                            src={project.coverImage}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-navy-800 line-clamp-1">
                              {project.title}
                            </p>
                            {project.featured && (
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-navy-400 line-clamp-1 mt-0.5">
                            {project.location}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-600">
                      {typeLabels[project.type]}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[project.status]}`}
                      >
                        {statusLabels[project.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-600">
                      {project.clientName}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-navy-800 whitespace-nowrap">
                      {formatCurrency(project.contractValue)}
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-500 whitespace-nowrap">
                      {format(new Date(project.startDate), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/projects/${project.id}/edit`}
                          className="p-2 rounded-lg text-navy-600 hover:bg-navy-100 hover:text-navy-800 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4.5 h-4.5" />
                        </Link>
                        <Link
                          href={`/projects/${project.id}/updates`}
                          className="p-2 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors text-xs font-medium"
                          title="Updates"
                        >
                          Updates
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(project)}
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
            Showing {filtered.length} of {projects.length} projects
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
                Delete Project
              </h3>
              <p className="text-sm text-navy-500 mb-1">
                Are you sure you want to delete this project?
              </p>
              <p className="text-sm font-medium text-navy-700 bg-navy-50 rounded-lg px-3 py-2 mb-6">
                {deleteTarget.title}
              </p>
              <p className="text-xs text-red-500 mb-6">
                This action cannot be undone. All project updates will be permanently removed.
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
                  {deleting ? 'Deleting...' : 'Delete Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

