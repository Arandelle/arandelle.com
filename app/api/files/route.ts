import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedAdmin } from '@/lib/auth-middleware';
import { fileSchema } from '@/lib/validation';

export async function GET() {
  const files = await prisma.file.findMany({
    orderBy: [{ folderId: 'asc' }, { order: 'asc' }, { name: 'asc' }],
  });
  return NextResponse.json(files);
}

export async function POST(request: NextRequest) {
  const admin = await getAuthenticatedAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = fileSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: validation.error.errors },
      { status: 400 }
    );
  }

  const file = await prisma.file.create({ data: validation.data });
  return NextResponse.json(file, { status: 201 });
}
