import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { query, queryOne, execute, newId, type ExpertiseRow } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth-middleware';
import { expertiseSchema } from '@/lib/validation';

export async function GET() {
  const expertise = await query<ExpertiseRow>('SELECT * FROM "Expertise" ORDER BY "order" ASC');
  return NextResponse.json(expertise);
}

export async function POST(request: NextRequest) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = expertiseSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.errors },
      { status: 400 }
    );
  }

  const { name, skills, order } = validation.data;
  const id = newId();

  await execute(
    `INSERT INTO "Expertise" ("id", "name", "skills", "order")
     VALUES ($1, $2, $3, $4)`,
    id,
    name,
    skills,
    order
  );

  const expertise = await queryOne<ExpertiseRow>('SELECT * FROM "Expertise" WHERE "id" = $1', id);
  revalidatePath('/');
  return NextResponse.json(expertise, { status: 201 });
}
