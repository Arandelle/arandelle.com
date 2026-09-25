import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { queryOne, execute, type ProjectRow } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth-middleware';
import { projectSchema } from '@/lib/validation';

// GET single project
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await queryOne<ProjectRow>('SELECT * FROM "Project" WHERE "id" = $1', id);

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json(project);
}

// UPDATE project
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
  const validation = projectSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.errors },
      { status: 400 }
    );
  }

  const { name, description, url, image, tags, featured } = validation.data;

  await execute(
    `UPDATE "Project"
       SET "name" = $1, "description" = $2, "url" = $3, "image" = $4,
           "tags" = $5, "featured" = $6, "updatedAt" = now()
     WHERE "id" = $7`,
    name,
    description,
    url,
    image,
    tags,
    featured,
    id
  );

  const project = await queryOne<ProjectRow>('SELECT * FROM "Project" WHERE "id" = $1', id);
  revalidatePath('/');
  return NextResponse.json(project);
}

// DELETE project
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  await execute('DELETE FROM "Project" WHERE "id" = $1', id);

  revalidatePath('/');
  return NextResponse.json({ success: true });
}
