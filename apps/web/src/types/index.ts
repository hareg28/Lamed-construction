export type ProjectStatus = 'new_contract' | 'under_construction' | 'finished';

export type ProjectType = 'residential' | 'commercial' | 'mixed_use' | 'special' | 'renovation';

export type InquiryStatus = 'unread' | 'read' | 'replied';

export interface ProjectUpdate {
  id: string;
  projectId: string;
  date: string;
  title: string;
  description: string;
  image?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  type: ProjectType;
  status: ProjectStatus;
  clientName: string;
  contractValue: number;
  startDate: string;
  endDate?: string;
  location: string;
  coverImage: string;
  gallery: string[];
  updates: ProjectUpdate[];
  createdAt: string;
  updatedAt: string;
  featured: boolean;
}

export interface NewsPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  author: string;
  publishedAt: string;
  createdAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
}

export interface Certificate {
  id: string;
  title: string;
  image: string;
  issuer?: string;
  year?: string;
  description?: string;
  createdAt: string;
}
