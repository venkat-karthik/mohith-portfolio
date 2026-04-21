// TypeScript types matching Prisma schema models

export interface User {
  id: string;
  username: string;
  password: string;
}

export interface Hero {
  id: string;
  name: string;
  identityStatement: string;
  valueProposition: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  isAvailable: boolean;
  scrollCtaText: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string;
  outcome: string;
  demoLink: string | null;
  githubLink: string | null;
  imageUrl: string | null;
  isPinned: boolean;
  order: number;
  createdAt: Date;
}

export interface About {
  id: string;
  content: string;
  imageUrl: string | null;
}

export interface SkillCategory {
  id: string;
  name: string;
  order: number;
  skills: Skill[];
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  order: number;
  categoryId: string;
  category?: SkillCategory;
}

export interface TimelineItem {
  id: string;
  title: string;
  type: string;
  date: string;
  description: string;
  order: number;
}

export interface Achievement {
  id: string;
  title: string;
  type: string;
  date: string;
  description: string;
  imageUrl: string | null;
  isPinned: boolean;
  order: number;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  readingTime: string;
  date: Date;
  category: string;
  coverImage: string | null;
  isPinned: boolean;
  isPublished: boolean;
  order: number;
}

export interface Testimonial {
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  authorContext: string | null;
  order: number;
}

export interface Contact {
  id: string;
  email: string;
  linkedin: string;
  github: string;
  twitter: string | null;
}

// API Response types
export interface ApiError {
  error: string;
  details?: unknown;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  details?: unknown;
}
