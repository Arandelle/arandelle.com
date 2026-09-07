import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  name: string;
}

export async function getAuthenticatedAdmin(
  request: NextRequest
): Promise<AuthenticatedAdmin | null> {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload) {
    return null;
  }

  const admin = await prisma.admin.findUnique({
    where: { id: payload.adminId },
    select: { id: true, email: true, name: true },
  });

  return admin;
}
