import { cache } from 'react';
import {
  query,
  queryOne,
  type ProjectRow,
  type ExperienceRow,
  type CertificationRow,
  type ArticleRow,
  type ExpertiseRow,
} from './db';

// Cached loaders for server components — prevents redundant DB queries.
// These use plain SQL (see lib/db.ts) against PostgreSQL, not the Prisma ORM.

export const getProjects = cache(async () => {
  // tags come back as a real Postgres TEXT[] array — no JSON parsing needed
  return query<ProjectRow>('SELECT * FROM "Project" ORDER BY "createdAt" DESC' );
});

export const getExperiences = cache(async () => {
  return query<ExperienceRow>('SELECT * FROM "Experience" ORDER BY "startDate" DESC');
});

export const getCertifications = cache(async () => {
  return query<CertificationRow>('SELECT * FROM "Certification" ORDER BY "date" DESC');
});

export const getPublishedArticles = cache(async () => {
  return query<ArticleRow>(
    'SELECT * FROM "Article" WHERE "published" = true ORDER BY "date" DESC'
  );
});

export const getArticleBySlug = cache(async (slug: string) => {
  return queryOne<ArticleRow>('SELECT * FROM "Article" WHERE "slug" = $1', slug);
});

export const getExpertise = cache(async () => {
  // skills come back as a real Postgres TEXT[] array — no JSON parsing needed
  return query<ExpertiseRow>('SELECT * FROM "Expertise" ORDER BY "order" ASC');
});

export const getProfile = cache(async () => {
  // For now, profile is still in lib/data.ts, but this is the future hook
  return null;
});
