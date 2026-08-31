import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ProjectStatus, ProjectType, InquiryStatus } from '@/types';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  try {
    return new Intl.NumberFormat('en-ET', {
      style: 'currency',
      currency: 'ETB',
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `ETB ${value.toLocaleString('en-ET')}`;
  }
}

export function formatDate(input: string | Date): string {
  try {
    const date = typeof input === 'string' ? new Date(input) : input;
    return new Intl.DateTimeFormat('en-ET', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  } catch {
    return typeof input === 'string' ? input : input.toISOString().split('T')[0];
  }
}

const STATUS_LABELS: Record<ProjectStatus, string> = {
  new_contract: 'New Contract',
  under_construction: 'Under Construction',
  finished: 'Finished',
};

const TYPE_LABELS: Record<ProjectType, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  mixed_use: 'Mixed Use',
  special: 'Special',
  renovation: 'Renovation',
};

const INQUIRY_STATUS_LABELS: Record<InquiryStatus, string> = {
  unread: 'Unread',
  read: 'Read',
  replied: 'Replied',
};

const STATUS_COLORS: Record<ProjectStatus, string> = {
  new_contract: 'bg-sky-100 text-sky-800 ring-sky-200',
  under_construction: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  finished: 'bg-emerald-200 text-emerald-900 ring-emerald-300',
};

const INQUIRY_STATUS_COLORS: Record<InquiryStatus, string> = {
  unread: 'bg-rose-100 text-rose-800 ring-rose-200',
  read: 'bg-slate-100 text-slate-800 ring-slate-200',
  replied: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
};

export function statusLabel(status: ProjectStatus): string {
  return STATUS_LABELS[status] ?? status;
}

export function typeLabel(type: ProjectType): string {
  return TYPE_LABELS[type] ?? type;
}

export function inquiryStatusLabel(status: InquiryStatus): string {
  return INQUIRY_STATUS_LABELS[status] ?? status;
}

export function statusColor(status: ProjectStatus): string {
  return STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-800 ring-gray-200';
}

export function inquiryStatusColor(status: InquiryStatus): string {
  return INQUIRY_STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-800 ring-gray-200';
}
