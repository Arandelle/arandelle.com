import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { query, queryOne, execute, newId, type CertificationRow } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth-middleware';
import { certificationSchema } from '@/lib/validation';

export async function GET() {
  const certifications = await query<CertificationRow>(
    'SELECT * FROM "Certification" ORDER BY "date" DESC'
  );
  return NextResponse.json(certifications);
}

export async function POST(request: NextRequest) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = certificationSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.errors },
      { status: 400 }
    );
  }

  const { name, issuer, url, date } = validation.data;
  const id = newId();

  await execute(
    `INSERT INTO "Certification" ("id", "name", "issuer", "url", "date")
     VALUES ($1, $2, $3, $4, $5)`,
    id,
    name,
    issuer,
    url,
    date
  );

  const certification = await queryOne<CertificationRow>(
    'SELECT * FROM "Certification" WHERE "id" = $1',
    id
  );
  revalidatePath('/');
  return NextResponse.json(certification, { status: 201 });
}
