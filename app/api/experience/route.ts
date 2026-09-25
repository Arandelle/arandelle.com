import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { query, queryOne, execute, newId, type ExperienceRow } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth-middleware';
import { experienceSchema } from '@/lib/validation';

export async function GET() {
  const experiences = await query<ExperienceRow>(
    'SELECT * FROM "Experience" ORDER BY "startDate" DESC'
  );
  return NextResponse.json(experiences);
}

export async function POST(request: NextRequest) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = experienceSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.errors },
      { status: 400 }
    );
  }

  const { company, role, description, startDate, endDate, current } = validation.data;
  const id = newId();

  await execute(
    `INSERT INTO "Experience"
       ("id", "company", "role", "description", "startDate", "endDate", "current")
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    id,
    company,
    role,
    description,
    startDate,
    endDate,
    current
  );

  const experience = await queryOne<ExperienceRow>('SELECT * FROM "Experience" WHERE "id" = $1', id);
  revalidatePath('/');
  return NextResponse.json(experience, { status: 201 });
}
