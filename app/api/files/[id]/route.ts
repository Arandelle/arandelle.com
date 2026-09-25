import { NextRequest, NextResponse } from 'next/server';
import { queryOne, execute, type FileRow } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth-middleware';
import { fileUpdateSchema } from '@/lib/validation';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const file = await queryOne<FileRow>('SELECT * FROM "File" WHERE "id" = $1', id);
  if (!file) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(file);
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
  const validation = fileUpdateSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.errors },
      { status: 400 }
    );
  }

  // Build the SET clause dynamically — only the provided fields are updated.
  const { name, content, order } = validation.data;
  const sets: string[] = [];
  const values: unknown[] = [];

  if (name !== undefined) {
    values.push(name);
    sets.push(`"name" = $${values.length}`);
  }
  if (content !== undefined) {
    values.push(content);
    sets.push(`"content" = $${values.length}`);
  }
  if (order !== undefined) {
    values.push(order);
    sets.push(`"order" = $${values.length}`);
  }

  if (sets.length > 0) {
    sets.push('"updatedAt" = now()');
    values.push(id);
    await execute(
      `UPDATE "File" SET ${sets.join(', ')} WHERE "id" = $${values.length}`,
      ...values
    );
  }

  const file = await queryOne<FileRow>('SELECT * FROM "File" WHERE "id" = $1', id);
  return NextResponse.json(file);
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

  // If it's a folder, delete all children first
  const file = await queryOne<FileRow>('SELECT * FROM "File" WHERE "id" = $1', id);
  if (!file) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  if (file.isFolder) {
    await execute('DELETE FROM "File" WHERE "folderId" = $1', id);
  }

  await execute('DELETE FROM "File" WHERE "id" = $1', id);
  return NextResponse.json({ success: true });
}
