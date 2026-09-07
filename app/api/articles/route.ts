import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedAdmin } from '@/lib/auth-middleware';
import { articleSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const published = searchParams.get('published');

  const where = published ? { published: published === 'true' } : {};

  const articles = await prisma.article.findMany({
    where,
    orderBy: { date: 'desc' },
  });
  return NextResponse.json(articles);
}

export async function POST(request: NextRequest) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = articleSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.errors },
      { status: 400 }
    );
  }

  const article = await prisma.article.create({ data: validation.data });
  return NextResponse.json(article, { status: 201 });
}
