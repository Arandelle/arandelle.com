import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { query, queryOne, execute, newId, type ProjectRow } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth-middleware';
import { projectSchema } from '@/lib/validation';

// GET all projects
export async function GET() {
  const projects = await query<ProjectRow>('SELECT * FROM "Project" ORDER BY "createdAt" DESC');
  return NextResponse.json(projects);
}

// Create a new project
export async function POST(request: NextRequest) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = projectSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.errors },
      { status: 400 }
    );
  }

  const { name, description, url, image, tags, featured } = validation.data;
  const id = newId();

  await execute(
    `INSERT INTO "Project"
       ("id", "name", "description", "url", "image", "tags", "featured")
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    id,
    name,
    description,
    url,
    image,
    tags,
    featured
  );

  const project = await queryOne<ProjectRow>('SELECT * FROM "Project" WHERE "id" = $1', id);
  revalidatePath('/');
  return NextResponse.json(project, { status: 201 });
}
