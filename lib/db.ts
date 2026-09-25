import { Pool } from 'pg';
import { randomUUID } from 'node:crypto';

// ─── Connection ────────────────────────────────────────────────────────
// The app talks to a hosted PostgreSQL (Neon) with plain SQL — no ORM.
// A single pg.Pool is created once and cached on globalThis so Next.js dev
// hot-reloads don't open a brand-new pool (and exhaust connections) on every
// file change. DATABASE_URL is the Neon connection string, e.g.
//   postgresql://user:pass@ep-xxx-pooler.region.aws.neon.tech/db?sslmode=require

const globalForDb = globalThis as unknown as { __pgPool?: Pool };

function makePool(): Pool {
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // Neon requires SSL
  });
}

export const pool = globalForDb.__pgPool ?? makePool();

if (process.env.NODE_ENV !== 'production') globalForDb.__pgPool = pool;

// ─── Row types (shape returned after normalization) ─────────────────────
// PostgreSQL returns real booleans and real TEXT[] arrays, so the only value
// we normalize is TIMESTAMPTZ -> ISO string. That keeps the API/frontend
// contract (createdAt/updatedAt as strings) identical to before.

export interface AdminRow {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectRow {
  id: string;
  name: string;
  description: string;
  url: string;
  image: string | null;
  tags: string[]; // native Postgres TEXT[]
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ExperienceRow {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CertificationRow {
  id: string;
  name: string;
  issuer: string;
  url: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArticleRow {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  published: boolean;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpertiseRow {
  id: string;
  name: string;
  skills: string[]; // native Postgres TEXT[]
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface FileRow {
  id: string;
  name: string;
  folderId: string | null;
  isFolder: boolean;
  content: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Value coercion ─────────────────────────────────────────────────────

/**
 * pg rejects `undefined` bind parameters, but optional fields (image, endDate,
 * url, folderId, ...) legitimately arrive as undefined. Map them to NULL so the
 * routes can pass values straight through, exactly like the old SQLite layer did.
 */
function toPgParams(params: unknown[]): unknown[] {
  return params.map((value) => (value === undefined ? null : value));
}

/** Convert any TIMESTAMPTZ (JS Date) values to ISO strings; leave the rest. */
function normalizeRow<T>(row: Record<string, unknown>): T {
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(row)) {
    const value = row[key];
    out[key] = value instanceof Date ? value.toISOString() : value;
  }
  return out as T;
}

// ─── Query helpers (this is where the raw SQL runs) ─────────────────────
// PostgreSQL uses $1, $2, ... placeholders (not SQLite's ?).

/** Run a SELECT that returns many rows. */
export async function query<T = Record<string, unknown>>(
  sql: string,
  ...params: unknown[]
): Promise<T[]> {
  const { rows } = await pool.query(sql, toPgParams(params));
  return rows.map((row) => normalizeRow<T>(row));
}

/** Run a SELECT that returns at most one row. */
export async function queryOne<T = Record<string, unknown>>(
  sql: string,
  ...params: unknown[]
): Promise<T | undefined> {
  const { rows } = await pool.query(sql, toPgParams(params));
  return rows[0] ? normalizeRow<T>(rows[0]) : undefined;
}

/** Run an INSERT / UPDATE / DELETE. */
export async function execute(sql: string, ...params: unknown[]): Promise<void> {
  await pool.query(sql, toPgParams(params));
}

/** Run a batch of statements (used by the schema init script). Takes no params. */
export async function executeBatch(sql: string): Promise<void> {
  await pool.query(sql);
}

// ─── Small utilities ────────────────────────────────────────────────────

/** Generate a primary key (a UUID, stored in a TEXT column). */
export function newId(): string {
  return randomUUID();
}
