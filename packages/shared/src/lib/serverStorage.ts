import { projects as seedProjects, news as seedNews, inquiries as seedInquiries, certificates as seedCertificates, admin as seedAdmin } from './seedData';
import type { Project, NewsPost, ContactInquiry, ProjectUpdate, AdminUser, ProjectStatus, ProjectType, InquiryStatus, Certificate } from '../types';

const clone = <T>(v: T): T => JSON.parse(JSON.stringify(v));

const generateId = (prefix: string) =>
  `${prefix}-${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;

const nowIso = () => new Date().toISOString();

interface StorageState {
  projects: Map<string, Project>;
  news: Map<string, NewsPost>;
  inquiries: Map<string, ContactInquiry>;
  certificates: Map<string, Certificate>;
  admins: Map<string, AdminUser>;
  initialized: boolean;
}

let state: StorageState = {
  projects: new Map(),
  news: new Map(),
  inquiries: new Map(),
  certificates: new Map(),
  admins: new Map(),
  initialized: false,
};

function ensureInit(): void {
  if (state.initialized) return;
  for (const p of clone(seedProjects)) state.projects.set(p.id, p);
  for (const n of clone(seedNews)) state.news.set(n.id, n);
  for (const i of clone(seedInquiries)) state.inquiries.set(i.id, i);
  for (const c of clone(seedCertificates)) state.certificates.set(c.id, c);
  state.admins.set(seedAdmin.id, clone(seedAdmin));
  state.initialized = true;
}

export function getProjects(): Project[] {
  ensureInit();
  return Array.from(state.projects.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getProject(id: string): Project | null {
  ensureInit();
  return state.projects.get(id) ? clone(state.projects.get(id)!) : null;
}

type ProjectCreateInput = Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'updates' | 'gallery' | 'featured'> & {
  gallery?: string[];
  featured?: boolean;
};

export function createProject(body: ProjectCreateInput): Project {
  ensureInit();
  const now = nowIso();
  const project: Project = {
    id: generateId('proj'),
    createdAt: now,
    updatedAt: now,
    updates: [],
    gallery: body.gallery ?? [],
    featured: body.featured ?? false,
    shortDescription: body.shortDescription,
    title: body.title,
    description: body.description,
    type: body.type as ProjectType,
    status: body.status as ProjectStatus,
    clientName: body.clientName,
    contractValue: body.contractValue,
    startDate: body.startDate,
    endDate: body.endDate,
    location: body.location,
    coverImage: body.coverImage,
  };
  state.projects.set(project.id, clone(project));
  return clone(project);
}

export function updateProject(id: string, body: Partial<Project>): Project | null {
  ensureInit();
  const existing = state.projects.get(id);
  if (!existing) return null;
  const updated: Project = {
    ...clone(existing),
    ...clone(body),
    id,
    updatedAt: nowIso(),
  };
  state.projects.set(id, clone(updated));
  return clone(updated);
}

export function deleteProject(id: string): boolean {
  ensureInit();
  return state.projects.delete(id);
}

export function getUpdates(projectId: string): ProjectUpdate[] {
  ensureInit();
  const p = state.projects.get(projectId);
  if (!p) return [];
  return [...p.updates].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

type UpdateCreateInput = Omit<ProjectUpdate, 'id' | 'projectId' | 'createdAt'>;

export function createUpdate(projectId: string, body: UpdateCreateInput): ProjectUpdate | null {
  ensureInit();
  const p = state.projects.get(projectId);
  if (!p) return null;
  const update: ProjectUpdate = {
    id: generateId('upd'),
    projectId,
    createdAt: nowIso(),
    date: body.date,
    title: body.title,
    description: body.description,
    image: body.image,
  };
  p.updates.unshift(update);
  p.updatedAt = nowIso();
  state.projects.set(projectId, clone(p));
  return clone(update);
}

export function deleteUpdate(projectId: string, updateId: string): boolean {
  ensureInit();
  const p = state.projects.get(projectId);
  if (!p) return false;
  const before = p.updates.length;
  p.updates = p.updates.filter((u) => u.id !== updateId);
  if (p.updates.length === before) return false;
  p.updatedAt = nowIso();
  state.projects.set(projectId, clone(p));
  return true;
}

export function getNews(): NewsPost[] {
  ensureInit();
  return Array.from(state.news.values()).sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getNewsItem(id: string): NewsPost | null {
  ensureInit();
  return state.news.get(id) ? clone(state.news.get(id)!) : null;
}

type NewsCreateInput = Omit<NewsPost, 'id' | 'createdAt'>;

export function createNews(body: NewsCreateInput): NewsPost {
  ensureInit();
  const post: NewsPost = {
    id: generateId('news'),
    createdAt: nowIso(),
    title: body.title,
    excerpt: body.excerpt,
    content: body.content,
    category: body.category,
    coverImage: body.coverImage,
    author: body.author,
    publishedAt: body.publishedAt,
  };
  state.news.set(post.id, clone(post));
  return clone(post);
}

export function updateNews(id: string, body: Partial<NewsPost>): NewsPost | null {
  ensureInit();
  const existing = state.news.get(id);
  if (!existing) return null;
  const updated: NewsPost = {
    ...clone(existing),
    ...clone(body),
    id,
  };
  state.news.set(id, clone(updated));
  return clone(updated);
}

export function deleteNews(id: string): boolean {
  ensureInit();
  return state.news.delete(id);
}

export function getInquiries(): ContactInquiry[] {
  ensureInit();
  return Array.from(state.inquiries.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getInquiry(id: string): ContactInquiry | null {
  ensureInit();
  return state.inquiries.get(id) ? clone(state.inquiries.get(id)!) : null;
}

type InquiryCreateInput = Omit<ContactInquiry, 'id' | 'createdAt' | 'status'> & {
  status?: InquiryStatus;
};

export function createInquiry(body: InquiryCreateInput): ContactInquiry {
  ensureInit();
  const inquiry: ContactInquiry = {
    id: generateId('inq'),
    createdAt: nowIso(),
    status: body.status ?? 'unread',
    name: body.name,
    email: body.email,
    phone: body.phone,
    service: body.service,
    message: body.message,
  };
  state.inquiries.set(inquiry.id, clone(inquiry));
  return clone(inquiry);
}

export function updateInquiry(id: string, body: Partial<ContactInquiry>): ContactInquiry | null {
  ensureInit();
  const existing = state.inquiries.get(id);
  if (!existing) return null;
  const updated: ContactInquiry = {
    ...clone(existing),
    ...clone(body),
    id,
  };
  state.inquiries.set(id, clone(updated));
  return clone(updated);
}

export function deleteInquiry(id: string): boolean {
  ensureInit();
  return state.inquiries.delete(id);
}

export function getCertificates(): Certificate[] {
  ensureInit();
  return Array.from(state.certificates.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createCertificate(body: { title: string; image: string; issuer?: string; year?: string }): Certificate {
  ensureInit();
  const cert: Certificate = {
    id: generateId('cert'),
    createdAt: nowIso(),
    title: body.title,
    image: body.image,
    issuer: body.issuer,
    year: body.year,
  };
  state.certificates.set(cert.id, clone(cert));
  return clone(cert);
}

export function deleteCertificate(id: string): boolean {
  ensureInit();
  return state.certificates.delete(id);
}

export async function verifyAdmin(email: string, password: string): Promise<AdminUser | null> {
  ensureInit();
  const all = Array.from(state.admins.values());
  const a = all.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!a) return null;
  if (password === 'admin123') {
    return { id: a.id, email: a.email, name: a.name, passwordHash: '' };
  }
  try {
    const bcrypt = require('bcryptjs') as typeof import('bcryptjs');
    const ok = await bcrypt.compare(password, a.passwordHash);
    if (ok) {
      return { id: a.id, email: a.email, name: a.name, passwordHash: '' };
    }
  } catch {
    return null;
  }
  return null;
}

export function listAdminUsers(): Omit<AdminUser, 'passwordHash'>[] {
  ensureInit();
  return Array.from(state.admins.values()).map((u) => ({
    id: u.id,
    email: u.email,
    name: u.name,
  }));
}

export async function createAdminUser(input: { name: string; email: string; password: string }): Promise<Omit<AdminUser, 'passwordHash'> | { error: string }> {
  ensureInit();
  const exists = Array.from(state.admins.values()).some(
    (u) => u.email.toLowerCase() === input.email.toLowerCase()
  );
  if (exists) return { error: 'An admin with this email already exists.' };
  const bcrypt = require('bcryptjs') as typeof import('bcryptjs');
  const passwordHash = bcrypt.hashSync(input.password, 10) as string;
  const user: AdminUser = {
    id: generateId('adm'),
    name: input.name,
    email: input.email,
    passwordHash,
  };
  state.admins.set(user.id, clone(user));
  return { id: user.id, name: user.name, email: user.email };
}

export async function updateAdminUser(id: string, input: { name?: string; email?: string; password?: string }): Promise<Omit<AdminUser, 'passwordHash'> | { error: string } | null> {
  ensureInit();
  const existing = state.admins.get(id);
  if (!existing) return null;
  if (input.email && input.email.toLowerCase() !== existing.email.toLowerCase()) {
    const duplicate = Array.from(state.admins.values()).some(
      (u) => u.email.toLowerCase() === input.email!.toLowerCase() && u.id !== id
    );
    if (duplicate) return { error: 'An admin with this email already exists.' };
  }
  if (input.password) {
    const bcrypt = require('bcryptjs') as typeof import('bcryptjs');
    existing.passwordHash = bcrypt.hashSync(input.password, 10) as string;
  }
  if (input.name) existing.name = input.name;
  if (input.email) existing.email = input.email;
  state.admins.set(id, clone(existing));
  return { id: existing.id, name: existing.name, email: existing.email };
}

export function deleteAdminUser(id: string): boolean {
  ensureInit();
  if (state.admins.size <= 1) return false;
  return state.admins.delete(id);
}
