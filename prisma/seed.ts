import prisma from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const adminEmail = 'admin@rentnest.com';

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    console.log('Admin user already exists, skipping.');
    return;
  }

  const hashedPassword = await bcrypt.hash('admin123456', 12);

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      phone: '01234567890',
      address: 'System Admin',
      role: 'ADMIN',
    },
  });

  console.log('Admin user seeded successfully.');
  console.log('Email: admin@rentnest.com');
  console.log('Password: admin123456');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
