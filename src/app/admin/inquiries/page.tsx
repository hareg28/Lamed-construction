'use client';

import { useEffect, useState } from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import {
  Eye,
  CheckCheck,
  Reply,
  Trash2,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  X,
  Inbox,
} from 'lucide-react';
import type { ContactInquiry, InquiryStatus } from '@/types';

type TabFilter = 'all' | 'unread' | 'replied';

const tabs: { key: TabFilter; label: string; icon: typeof Inbox }[] = [
  { key: 'all', label: 'All', icon: Inbox },
  { key: 'unread', label: 'Unread', icon: Mail },
  { key: 'replied', label: 'Replied', icon: Reply },
];

const statusColors: Record<InquiryStatus, string> = {
  unread: 'bg-red-100 text-red-700 border-red-200',
  read: 'bg-navy-100 text-navy-700 border-navy-200',
  replied: 'bg-green-100 text-green-700 border-green-200',
};

const statusLabels: Record<InquiryStatus, string> = {
  unread: 'Unread',
  read: 'Read',
  replied: 'Replied',
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>('all');
  const [viewing, setViewing] = useState<ContactInquiry | null>(null);

  async function loadInquiries() {
    setLoading(true);
    try {
      const res = await fetch('/api/inquiries');
      const data = await res.json();
      if (data.success) setInquiries(data.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInquiries();
  }, []);

  const filtered = inquiries.filter((i) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return i.status === 'unread';
    if (activeTab === 'replied') return i.status === 'replied';
    return true;
  });

  const updateStatus = async (id: string, status: InquiryStatus, successMsg: string) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(successMsg);
        setInquiries((prev) =>
          prev.map((i) => (i.id === id ? { ...i, status } : i))
        );
        if (viewing && viewing.id === id) {
          setViewing({ ...viewing, status });
        }
      } else {
        toast.error('Action failed');
      }
    } catch {
      toast.error('Connection error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Inquiry deleted');
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        if (viewing && viewing.id === id) setViewing(null);
      } else {
        toast.error('Failed to delete');
      }
    } catch {
      toast.error('Connection error');
    }
  };

  const countUnread = inquiries.filter((i) => i.status === 'unread').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-navy-800">Inquiries Inbox</h1>
        <p className="text-navy-500 text-sm">Manage contact inquiries from potential clients</p>
      </div>

      <div className="bg-white rounded-xl shadow-card overflow-hidden">
        <div className="flex border-b border-navy-100 px-2 sm:px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            const count =
              tab.key === 'all'
                ? inquiries.length
                : inquiries.filter((i) =>
                    tab.key === 'unread' ? i.status === 'unread' : i.status === 'replied'
                  ).length;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3 sm:px-5 py-4 text-sm font-medium border-b-2 -mb-px transition-all ${
                  isActive
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-navy-500 hover:text-navy-700 hover:border-navy-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-amber-500 text-white'
                      : 'bg-navy-100 text-navy-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy-50/50">
              <tr>
                <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-3">
                  Name
                </th>
                <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-3">
                  Email
                </th>
                <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-3">
                  Service
                </th>
                <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-3">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-3">
                  Status
                </th>
                <th className="text-right text-xs font-semibold text-navy-600 uppercase tracking-wider px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-navy-400 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Loading inquiries...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-navy-50 flex items-center justify-center mx-auto mb-4">
                      <Inbox className="w-8 h-8 text-navy-300" />
                    </div>
                    <p className="text-navy-600 font-medium mb-1">Inbox empty</p>
                    <p className="text-sm text-navy-400">
                      No inquiries in this category.
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((inquiry) => (
                  <tr
                    key={inquiry.id}
                    className={`transition-colors ${
                      inquiry.status === 'unread'
                        ? 'bg-amber-50/30 hover:bg-amber-50/50'
                        : 'hover:bg-navy-50/30'
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                            inquiry.status === 'unread'
                              ? 'bg-gradient-to-br from-amber-400 to-amber-600'
                              : 'bg-navy-400'
                          }`}
                        >
                          {inquiry.name.charAt(0)}
                        </div>
                        <span
                          className={`font-medium ${
                            inquiry.status === 'unread'
                              ? 'text-navy-900'
                              : 'text-navy-700'
                          }`}
                        >
                          {inquiry.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-600">
                      {inquiry.email}
                    </td>
                    <td className="px-6 py-4">
                      {inquiry.service ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-navy-50 text-navy-700 border border-navy-200">
                          {inquiry.service}
                        </span>
                      ) : (
                        <span className="text-xs text-navy-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-navy-500 whitespace-nowrap">
                      {format(new Date(inquiry.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[inquiry.status]}`}
                      >
                        {statusLabels[inquiry.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setViewing(inquiry);
                            if (inquiry.status === 'unread') {
                              updateStatus(inquiry.id, 'read', 'Marked as read');
                            }
                          }}
                          className="p-2 rounded-lg text-navy-600 hover:bg-navy-100 hover:text-navy-800 transition-colors"
                          title="View"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                        {inquiry.status !== 'read' && inquiry.status !== 'replied' && (
                          <button
                            onClick={() =>
                              updateStatus(inquiry.id, 'read', 'Marked as read')
                            }
                            className="p-2 rounded-lg text-navy-500 hover:bg-navy-100 transition-colors"
                            title="Mark as Read"
                          >
                            <CheckCheck className="w-4.5 h-4.5" />
                          </button>
                        )}
                        {inquiry.status !== 'replied' && (
                          <button
                            onClick={() =>
                              updateStatus(inquiry.id, 'replied', 'Marked as replied')
                            }
                            className="p-2 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                            title="Mark as Replied"
                          >
                            <Reply className="w-4.5 h-4.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(inquiry.id)}
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
      </div>

      {viewing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/60 backdrop-blur-sm"
          onClick={() => setViewing(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-6 border-b border-navy-100">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${
                    viewing.status === 'unread'
                      ? 'bg-gradient-to-br from-amber-400 to-amber-600'
                      : 'bg-navy-500'
                  }`}
                >
                  {viewing.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-navy-800">
                    {viewing.name}
                  </h3>
                  <p className="text-sm text-navy-500">{viewing.email}</p>
                </div>
              </div>
              <button
                onClick={() => setViewing(null)}
                className="p-1.5 rounded-lg hover:bg-navy-100 text-navy-400 hover:text-navy-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-navy-50/50">
                  <Mail className="w-5 h-5 text-navy-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-navy-500 font-medium uppercase tracking-wide">
                      Email
                    </p>
                    <p className="text-sm text-navy-800 mt-0.5 break-all">
                      {viewing.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-navy-50/50">
                  <Phone className="w-5 h-5 text-navy-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-navy-500 font-medium uppercase tracking-wide">
                      Phone
                    </p>
                    <p className="text-sm text-navy-800 mt-0.5">
                      {viewing.phone || '—'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-navy-50/50">
                  <Briefcase className="w-5 h-5 text-navy-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-navy-500 font-medium uppercase tracking-wide">
                      Service Interest
                    </p>
                    <p className="text-sm text-navy-800 mt-0.5">
                      {viewing.service || 'Not specified'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-navy-50/50">
                  <Calendar className="w-5 h-5 text-navy-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-navy-500 font-medium uppercase tracking-wide">
                      Received
                    </p>
                    <p className="text-sm text-navy-800 mt-0.5">
                      {formatDistanceToNow(new Date(viewing.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-navy-600 uppercase tracking-wide">
                    Message
                  </p>
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[viewing.status]}`}
                  >
                    {statusLabels[viewing.status]}
                  </span>
                </div>
                <div className="p-5 rounded-xl bg-white border border-navy-100 shadow-sm">
                  <p className="text-sm text-navy-700 leading-relaxed whitespace-pre-wrap">
                    {viewing.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 p-4 border-t border-navy-100 bg-navy-50/30 flex-wrap">
              {viewing.status !== 'replied' && (
                <button
                  onClick={() =>
                    updateStatus(viewing.id, 'replied', 'Marked as replied').then(
                      () => setViewing((v) => (v ? { ...v, status: 'replied' } : v))
                    )
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/25 transition-all text-sm"
                >
                  <Reply className="w-4 h-4" />
                  Mark as Replied
                </button>
              )}
              <a
                href={`mailto:${viewing.email}`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/25 transition-all text-sm"
              >
                <Mail className="w-4 h-4" />
                Reply via Email
              </a>
              <button
                onClick={() => setViewing(null)}
                className="px-4 py-2.5 rounded-lg font-medium text-navy-700 hover:bg-white transition-colors text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
