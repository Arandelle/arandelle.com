import { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { queryOne } from '@/lib/db';

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

  const admin = await queryOne<AuthenticatedAdmin>(
    'SELECT "id", "email", "name" FROM "Admin" WHERE "id" = $1',
    payload.adminId
  );

  return admin ?? null;
}
