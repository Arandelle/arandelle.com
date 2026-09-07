# Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL

You have two options:

**Option A: Local PostgreSQL**
- Install PostgreSQL locally or via Docker
- Create a database: `createdb arandelle_db`
- Update `.env` with your connection string:
  ```
  DATABASE_URL="postgresql://user:password@localhost:5432/arandelle_db?schema=public"
  ```

**Option B: Neon PostgreSQL (Recommended for Vercel)**
- Sign up for [Neon](https://neon.tech) (free tier: 3 projects, 500MB storage)
- Create a new project → database is provisioned instantly
- Copy the connection string from the dashboard (it looks like `postgresql://user:pass@ep-xyz.region.aws.neon.tech/dbname`)
- Paste it into `.env`:
  ```
  DATABASE_URL="postgresql://user:pass@ep-xyz.region.aws.neon.tech/dbname?sslmode=require"
  ```
  Neon natively integrates with Vercel — same database for dev and production.

### 3. Run Database Migrations

```bash
npm run db:generate
npm run db:migrate
```

### 4. Create Admin Account

```bash
npm run db:seed
```

This creates the first admin user with credentials from your `.env` file:
- Email: `admin@arandelle.com`
- Password: `changeme123`

**Change these credentials!** Edit `.env` before running the seed script in production.

### 5. Start the Dev Server

```bash
npm run dev
```

- Public portfolio: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin` (or `http://dev.localhost:3000`)

### 6. Configure DNS (Production)

To access the admin panel via `dev.arandelle.com`:

1. In Vercel, add your domain `arandelle.com`
2. Add a DNS CNAME record: `dev.arandelle.com → cname.vercel-dns.com`
3. The middleware automatically routes `dev.*` requests to `/admin/*`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret for signing JWT tokens | Required (generate with `openssl rand -base64 32`) |
| `ADMIN_EMAIL` | Email for initial admin account | `admin@arandelle.com` |
| `ADMIN_PASSWORD` | Password for initial admin account | `changeme123` |
| `ADMIN_NAME` | Display name for initial admin account | `Arandelle` |
| `NEXT_PUBLIC_SITE_URL` | Public site URL | `https://arandelle.com` |
| `ADMIN_SUBDOMAIN` | Admin subdomain | `dev` |

## Database Commands

| Command | Description |
|---------|-------------|
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema changes to database (dev only) |
| `npm run db:migrate` | Create and apply migration |
| `npm run db:studio` | Open Prisma Studio (visual DB browser) |
| `npm run db:seed` | Create initial admin account |

## Admin Panel Routes

| Route | Description |
|-------|-------------|
| `/admin` | Dashboard overview |
| `/admin/projects` | Manage portfolio projects |
| `/admin/experience` | Manage work experience |
| `/admin/certifications` | Manage certifications |
| `/admin/articles` | Manage blog articles |
| `/admin/expertise` | Manage expertise/skills |
| `/admin/login` | Login page |

## Security Notes

1. **Change the default admin password** after first login
2. **Generate a strong JWT secret** — use at least 32 random bytes
3. **Never commit `.env`** — it's already in `.gitignore`
4. The admin panel is protected by JWT authentication via httpOnly cookies
5. All API routes validate input with Zod on both client and server

## Architecture

```
dev.arandelle.com  →  Middleware rewrites to  /admin/* routes
arandelle.com      →  Public portfolio

Authentication: JWT tokens in httpOnly cookies (7-day expiry)
Database: PostgreSQL via Prisma ORM
Validation: Zod schemas (shared between client and server)
```
