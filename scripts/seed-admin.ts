import { prisma } from '../lib/prisma';
import { hashPassword } from '../lib/auth';

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || 'admin@arandelle.com';
  const password = process.env.ADMIN_PASSWORD || 'changeme123';
  const name = process.env.ADMIN_NAME || 'Arandelle';

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({ where: { email } });
  if (existingAdmin) {
    console.log(`Admin already exists: ${email}`);
    return;
  }

  // Hash password and create admin
  const hashedPassword = await hashPassword(password);
  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });

  console.log(`✅ Admin created: ${admin.email}`);
  console.log(`   Name: ${admin.name}`);
  console.log(`   ID: ${admin.id}`);
  console.log('');
  console.log('You can now login at dev.arandelle.com/admin/login');
}

seedAdmin()
  .catch((e) => {
    console.error('❌ Failed to seed admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
