import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { query, queryOne, execute, newId, type ArticleRow } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth-middleware';
import { articleSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const published = searchParams.get('published');

  // Optionally filter by published state (a real Postgres BOOLEAN column).
  const params: unknown[] = [];
  let sql = 'SELECT * FROM "Article"';
  if (published) {
    sql += ' WHERE "published" = $1';
    params.push(published === 'true');
  }
  sql += ' ORDER BY "date" DESC';

  const articles = await query<ArticleRow>(sql, ...params);
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

  const { slug, title, excerpt, content, published, date } = validation.data;
  const id = newId();

  await execute(
    `INSERT INTO "Article"
       ("id", "slug", "title", "excerpt", "content", "published", "date")
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    id,
    slug,
    title,
    excerpt,
    content,
    published,
    date
  );

  const article = await queryOne<ArticleRow>('SELECT * FROM "Article" WHERE "id" = $1', id);
  revalidatePath('/');
  return NextResponse.json(article, { status: 201 });
}
