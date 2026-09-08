import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedAdmin } from '@/lib/auth-middleware';
import { expertiseSchema } from '@/lib/validation';

export async function GET() {
  const expertise = await prisma.expertise.findMany({
    orderBy: { order: 'asc' },
  });
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

  const expertise = await prisma.expertise.create({ data: validation.data });
  return NextResponse.json(expertise, { status: 201 });
}
