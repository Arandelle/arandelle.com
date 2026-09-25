import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { queryOne, execute, type ExpertiseRow } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth-middleware';
import { expertiseSchema } from '@/lib/validation';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const expertise = await queryOne<ExpertiseRow>('SELECT * FROM "Expertise" WHERE "id" = $1', id);
  if (!expertise) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(expertise);
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
  const validation = expertiseSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.errors },
      { status: 400 }
    );
  }

  const { name, skills, order } = validation.data;

  await execute(
    `UPDATE "Expertise"
       SET "name" = $1, "skills" = $2, "order" = $3, "updatedAt" = now()
     WHERE "id" = $4`,
    name,
    skills,
    order,
    id
  );

  const expertise = await queryOne<ExpertiseRow>('SELECT * FROM "Expertise" WHERE "id" = $1', id);
  revalidatePath('/');
  return NextResponse.json(expertise);
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
  await execute('DELETE FROM "Expertise" WHERE "id" = $1', id);
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
