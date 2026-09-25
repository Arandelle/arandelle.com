import { queryOne, execute, newId, pool, type AdminRow } from '../lib/db';
import { hashPassword } from '../lib/auth';

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@arandelle.com';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';
  const name = process.env.ADMIN_NAME || 'Arandelle';

  // Check if admin already exists
  const existingAdmin = await queryOne<AdminRow>(
    'SELECT * FROM "Admin" WHERE "email" = $1',
    email
  );
  if (existingAdmin) {
    console.log(`Admin already exists: ${email}`);
    return;
  }

  // Hash password and create admin (createdAt/updatedAt default to now())
  const hashedPassword = await hashPassword(password);
  const id = newId();

  await execute(
    `INSERT INTO "Admin" ("id", "email", "password", "name")
     VALUES ($1, $2, $3, $4)`,
    id,
    email,
    hashedPassword,
    name
  );

  console.log(`✅ Admin created: ${email}`);
  console.log(`   Name: ${name}`);
  console.log(`   ID: ${id}`);
  console.log('');
  console.log('You can now login at dev.arandelle.com/admin/login');
}

(async () => {
  try {
    await seedAdmin();
  } catch (e) {
    console.error('❌ Failed to seed admin:', e);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
