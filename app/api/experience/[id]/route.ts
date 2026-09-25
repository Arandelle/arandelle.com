import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { queryOne, execute, type ExperienceRow } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth-middleware';
import { experienceSchema } from '@/lib/validation';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const experience = await queryOne<ExperienceRow>('SELECT * FROM "Experience" WHERE "id" = $1', id);
  if (!experience) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(experience);
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
  const validation = experienceSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.errors },
      { status: 400 }
    );
  }

  const { company, role, description, startDate, endDate, current } = validation.data;

  await execute(
    `UPDATE "Experience"
       SET "company" = $1, "role" = $2, "description" = $3, "startDate" = $4,
           "endDate" = $5, "current" = $6, "updatedAt" = now()
     WHERE "id" = $7`,
    company,
    role,
    description,
    startDate,
    endDate,
    current,
    id
  );

  const experience = await queryOne<ExperienceRow>('SELECT * FROM "Experience" WHERE "id" = $1', id);
  revalidatePath('/');
  return NextResponse.json(experience);
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
  await execute('DELETE FROM "Experience" WHERE "id" = $1', id);
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
