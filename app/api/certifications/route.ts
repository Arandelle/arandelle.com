import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedAdmin } from '@/lib/auth-middleware';
import { certificationSchema } from '@/lib/validation';

export async function GET() {
  const certifications = await prisma.certification.findMany({
    orderBy: { date: 'desc' },
  });
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

  const certification = await prisma.certification.create({
    data: validation.data,
  });
  return NextResponse.json(certification, { status: 201 });
}
