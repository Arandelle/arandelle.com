import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne, execute, newId, type FileRow } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth-middleware';
import { fileSchema } from '@/lib/validation';

export async function GET() {
  const files = await query<FileRow>(
    'SELECT * FROM "File" ORDER BY "folderId" ASC, "order" ASC, "name" ASC'
  );
  return NextResponse.json(files);
}

export async function POST(request: NextRequest) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = fileSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.errors },
      { status: 400 }
    );
  }

  const { name, folderId, isFolder, content, order } = validation.data;
  const id = newId();

  await execute(
    `INSERT INTO "File"
       ("id", "name", "folderId", "isFolder", "content", "order")
     VALUES ($1, $2, $3, $4, $5, $6)`,
    id,
    name,
    folderId,
    isFolder,
    content,
    order
  );

  const file = await queryOne<FileRow>('SELECT * FROM "File" WHERE "id" = $1', id);
  return NextResponse.json(file, { status: 201 });
}
