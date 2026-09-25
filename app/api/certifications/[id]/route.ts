import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { queryOne, execute, type CertificationRow } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth-middleware';
import { certificationSchema } from '@/lib/validation';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const cert = await queryOne<CertificationRow>('SELECT * FROM "Certification" WHERE "id" = $1', id);
  if (!cert) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(cert);
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
  const validation = certificationSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.errors },
      { status: 400 }
    );
  }

  const { name, issuer, url, date } = validation.data;

  await execute(
    `UPDATE "Certification"
       SET "name" = $1, "issuer" = $2, "url" = $3, "date" = $4, "updatedAt" = now()
     WHERE "id" = $5`,
    name,
    issuer,
    url,
    date,
    id
  );

  const cert = await queryOne<CertificationRow>('SELECT * FROM "Certification" WHERE "id" = $1', id);
  revalidatePath('/');
  return NextResponse.json(cert);
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
  await execute('DELETE FROM "Certification" WHERE "id" = $1', id);
  revalidatePath('/');
  return NextResponse.json({ success: true });
}
