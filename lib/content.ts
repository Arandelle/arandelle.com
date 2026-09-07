import { prisma } from './prisma';
import { cache } from 'react';

// Cached loaders for server components — prevents redundant DB queries
export const getProjects = cache(async () => {
  return prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
});

export const getExperiences = cache(async () => {
  return prisma.experience.findMany({ orderBy: { startDate: 'desc' } });
});

export const getCertifications = cache(async () => {
  return prisma.certification.findMany({ orderBy: { date: 'desc' } });
});

export const getPublishedArticles = cache(async () => {
  return prisma.article.findMany({
    where: { published: true },
    orderBy: { date: 'desc' },
  });
});

export const getArticleBySlug = cache(async (slug: string) => {
  return prisma.article.findUnique({ where: { slug } });
});

export const getExpertise = cache(async () => {
  return prisma.expertise.findMany({ orderBy: { order: 'asc' } });
});

export const getProfile = cache(async () => {
  // For now, profile is still in lib/data.ts, but this is the future hook
  return null;
});
