import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedAdmin } from '@/lib/auth-middleware';
import { experienceSchema } from '@/lib/validation';

export async function GET() {
  const experiences = await prisma.experience.findMany({
    orderBy: { startDate: 'desc' },
  });
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

  const experience = await prisma.experience.create({ data: validation.data });
  revalidatePath('/');
  return NextResponse.json(experience, { status: 201 });
}
