import { PrismaClient } from '@prisma/client';

// ─── STANDBY (not used by the app at runtime) ───────────────────────────
// The app now talks to SQLite with raw SQL — see lib/db.ts. Prisma is kept
// installed and this client is kept around as a fallback / convenience, and
// the schema in prisma/schema.prisma is still handy for tooling such as
// `npm run db:push` (create/refresh tables) and `npm run db:studio` (browse data).
// Nothing in app/ or lib/ imports this file anymore.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
