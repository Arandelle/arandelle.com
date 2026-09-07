import { z } from 'zod';

// ─── Admin Auth Validation ───────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ─── Project Validation ──────────────────────────────────────────────

export const projectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description is too long'),
  url: z.string().url('Invalid URL'),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')),
  tags: z.array(z.string().min(1).max(30)).max(10, 'Maximum 10 tags allowed'),
  featured: z.boolean().default(false),
});

export type ProjectInput = z.infer<typeof projectSchema>;

// ─── Experience Validation ───────────────────────────────────────────

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required').max(100, 'Company is too long'),
  role: z.string().min(1, 'Role is required').max(100, 'Role is too long'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description is too long'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().or(z.literal('')),
  current: z.boolean().default(false),
});

export type ExperienceInput = z.infer<typeof experienceSchema>;

// ─── Certification Validation ────────────────────────────────────────

export const certificationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150, 'Name is too long'),
  issuer: z.string().min(1, 'Issuer is required').max(100, 'Issuer is too long'),
  url: z.string().url('Invalid URL').optional().or(z.literal('')),
  date: z.string().min(1, 'Date is required'),
});

export type CertificationInput = z.infer<typeof certificationSchema>;

// ─── Article Validation ──────────────────────────────────────────────

export const articleSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100, 'Slug is too long')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase with hyphens'),
  title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
  excerpt: z.string().min(1, 'Excerpt is required').max(300, 'Excerpt is too long'),
  content: z.string().min(1, 'Content is required'),
  published: z.boolean().default(false),
  date: z.string().min(1, 'Date is required'),
});

export type ArticleInput = z.infer<typeof articleSchema>;

// ─── Expertise Validation ────────────────────────────────────────────

export const expertiseSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
  skills: z.array(z.string().min(1).max(50)).min(1, 'At least 1 skill required').max(20),
  order: z.number().int().min(0).default(0),
});

export type ExpertiseInput = z.infer<typeof expertiseSchema>;
