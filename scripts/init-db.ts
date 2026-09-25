import { executeBatch, query, pool } from '../lib/db';

// Raw SQL schema — the "basic SQL" equivalent of the old Prisma schema, now
// using real PostgreSQL types (BOOLEAN, TIMESTAMPTZ, TEXT[]).
// IF NOT EXISTS makes it safe to re-run and it won't clobber existing data.
const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS "Admin" (
  "id"        TEXT PRIMARY KEY,
  "email"     TEXT NOT NULL UNIQUE,
  "password"  TEXT NOT NULL,
  "name"      TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Project" (
  "id"          TEXT PRIMARY KEY,
  "name"        TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "url"         TEXT NOT NULL,
  "image"       TEXT,
  "tags"        TEXT[] NOT NULL DEFAULT '{}',
  "featured"    BOOLEAN NOT NULL DEFAULT false,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Experience" (
  "id"          TEXT PRIMARY KEY,
  "company"     TEXT NOT NULL,
  "role"        TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "startDate"   TEXT NOT NULL,
  "endDate"     TEXT,
  "current"     BOOLEAN NOT NULL DEFAULT false,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Certification" (
  "id"        TEXT PRIMARY KEY,
  "name"      TEXT NOT NULL,
  "issuer"    TEXT NOT NULL,
  "url"       TEXT,
  "date"      TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Article" (
  "id"        TEXT PRIMARY KEY,
  "slug"      TEXT NOT NULL UNIQUE,
  "title"     TEXT NOT NULL,
  "excerpt"   TEXT NOT NULL,
  "content"   TEXT NOT NULL,
  "published" BOOLEAN NOT NULL DEFAULT false,
  "date"      TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "Expertise" (
  "id"        TEXT PRIMARY KEY,
  "name"      TEXT NOT NULL,
  "skills"    TEXT[] NOT NULL DEFAULT '{}',
  "order"     INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "File" (
  "id"        TEXT PRIMARY KEY,
  "name"      TEXT NOT NULL,
  "folderId"  TEXT,
  "isFolder"  BOOLEAN NOT NULL DEFAULT false,
  "content"   TEXT NOT NULL DEFAULT '',
  "order"     INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now(),
  "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);
`;

async function initDb() {
  await executeBatch(SCHEMA_SQL);
  const tables = await query<{ tablename: string }>(
    "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename"
  );
  console.log('✅ Schema ready. Tables:', tables.map((t) => t.tablename).join(', '));
}

(async () => {
  try {
    await initDb();
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
