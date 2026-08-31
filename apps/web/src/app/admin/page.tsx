'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { format, formatDistanceToNow } from 'date-fns';
import {
  FolderKanban,
  FileSignature,
  HardHat,
  CheckCircle2,
  Inbox,
  DollarSign,
  Eye,
  Clock,
  ArrowRight,
  Pencil,
} from 'lucide-react';
import type { Project, ContactInquiry, ProjectStatus, InquiryStatus } from '@/types';

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

const inquiryStatusColors: Record<InquiryStatus, string> = {
  unread: 'bg-red-100 text-red-700 border-red-200',
  read: 'bg-navy-100 text-navy-700 border-navy-200',
  replied: 'bg-green-100 text-green-700 border-green-200',
};

const inquiryStatusLabels: Record<InquiryStatus, string> = {
  unread: 'Unread',
  read: 'Read',
  replied: 'Replied',
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'ETB',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projectsRes, inquiriesRes] = await Promise.all([
          fetch('/api/projects').then((r) => r.json()),
          fetch('/api/inquiries').then((r) => r.json()),
        ]);
        if (projectsRes.success) setProjects(projectsRes.data);
        if (inquiriesRes.success) setInquiries(inquiriesRes.data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats = [
    {
      label: 'Total Projects',
      value: projects.length,
      icon: FolderKanban,
      border: 'border-navy-500',
      bg: 'bg-navy-50',
      iconBg: 'bg-navy-500',
    },
    {
      label: 'New Contracts',
      value: projects.filter((p) => p.status === 'new_contract').length,
      icon: FileSignature,
      border: 'border-blue-500',
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-500',
    },
    {
      label: 'Under Construction',
      value: projects.filter((p) => p.status === 'under_construction').length,
      icon: HardHat,
      border: 'border-amber-500',
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-500',
    },
    {
      label: 'Finished Projects',
      value: projects.filter((p) => p.status === 'finished').length,
      icon: CheckCircle2,
      border: 'border-green-500',
      bg: 'bg-green-50',
      iconBg: 'bg-green-500',
    },
    {
      label: 'Pending Inquiries',
      value: inquiries.filter((i) => i.status === 'unread').length,
      icon: Inbox,
      border: 'border-red-500',
      bg: 'bg-red-50',
      iconBg: 'bg-red-500',
    },
  ];

  const totalRevenue = projects.reduce((sum, p) => sum + p.contractValue, 0);
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  const recentInquiries = [...inquiries]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-navy-600">
          <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800 mb-1">Dashboard</h1>
        <p className="text-navy-500 text-sm">
          Welcome back! Here&apos;s what&apos;s happening with your projects today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-white rounded-xl p-5 shadow-card border-l-4 ${stat.border} hover:shadow-card-hover transition-shadow`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-navy-500 text-xs font-medium uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-navy-800">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.iconBg} text-white p-2.5 rounded-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-card border-l-4 border-amber-500">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 text-white p-3 rounded-xl shadow-lg shadow-amber-500/20">
              <DollarSign className="w-7 h-7" />
            </div>
            <div>
              <p className="text-navy-500 text-sm font-medium">Revenue Overview</p>
              <p className="text-3xl font-bold text-navy-800 mt-1">
                {formatCurrency(totalRevenue)}
              </p>
              <p className="text-navy-400 text-xs mt-1">
                Total contract value across {projects.length} projects
              </p>
            </div>
          </div>
          <div className="flex gap-2 text-xs">
            <span className="px-3 py-1 rounded-full bg-navy-50 text-navy-600 border border-navy-200">
              Avg: {formatCurrency(Math.round(totalRevenue / (projects.length || 1)))}
            </span>
            <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
              {projects.filter((p) => p.status === 'finished').length} Completed
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-navy-100">
            <div>
              <h2 className="text-lg font-semibold text-navy-800">Recent Projects</h2>
              <p className="text-xs text-navy-500 mt-0.5">Latest 5 projects</p>
            </div>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy-50/50">
                <tr>
                  <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-3">
                    Title
                  </th>
                  <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-3">
                    Client
                  </th>
                  <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-3">
                    Value
                  </th>
                  <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-3">
                    Date
                  </th>
                  <th className="text-right text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-100">
                {recentProjects.map((project) => (
                  <tr key={project.id} className="hover:bg-navy-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-navy-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img
                            src={project.coverImage}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                        <span className="font-medium text-navy-800 text-sm line-clamp-1">
                          {project.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-600">
                      {project.clientName}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[project.status]}`}
                      >
                        {statusLabels[project.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-navy-800">
                      {formatCurrency(project.contractValue)}
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-500 whitespace-nowrap">
                      {format(new Date(project.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-navy-600 hover:bg-navy-100 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentProjects.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-navy-400 text-sm">
                      No projects yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-navy-100">
            <div>
              <h2 className="text-lg font-semibold text-navy-800">Recent Inquiries</h2>
              <p className="text-xs text-navy-500 mt-0.5">Latest 5 messages</p>
            </div>
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 font-medium"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-navy-100">
            {recentInquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="px-6 py-4 hover:bg-navy-50/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-navy-800 truncate">
                        {inquiry.name}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${inquiryStatusColors[inquiry.status]}`}
                      >
                        {inquiryStatusLabels[inquiry.status]}
                      </span>
                    </div>
                    <p className="text-xs text-navy-500 truncate">{inquiry.email}</p>
                    {inquiry.service && (
                      <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {inquiry.service}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-navy-400 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    <span className="whitespace-nowrap">
                      {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {recentInquiries.length === 0 && (
              <div className="px-6 py-12 text-center text-navy-400 text-sm">
                No inquiries yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
