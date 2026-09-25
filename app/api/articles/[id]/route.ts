import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { queryOne, execute, type ArticleRow } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth-middleware';
import { articleSchema } from '@/lib/validation';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = await queryOne<ArticleRow>('SELECT * FROM "Article" WHERE "id" = $1', id);
  if (!article) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(article);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const validation = articleSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.errors },
      { status: 400 }
    );
  }

  const { slug, title, excerpt, content, published, date } = validation.data;

  await execute(
    `UPDATE "Article"
       SET "slug" = $1, "title" = $2, "excerpt" = $3, "content" = $4,
           "published" = $5, "date" = $6, "updatedAt" = now()
     WHERE "id" = $7`,
    slug,
    title,
    excerpt,
    content,
    published,
    date,
    id
  );

  const article = await queryOne<ArticleRow>('SELECT * FROM "Article" WHERE "id" = $1', id);
  revalidatePath('/');
  return NextResponse.json(article);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await execute('DELETE FROM "Article" WHERE "id" = $1', id);
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
