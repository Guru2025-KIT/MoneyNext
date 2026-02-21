import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('í¼± Seeding database...');

  // Create categories
  const categories = [
    { name: 'Salary', type: 'INCOME', icon: 'í²°', color: '#10b981', isSystem: true },
    { name: 'Freelance', type: 'INCOME', icon: 'í²¼', color: '#3b82f6', isSystem: true },
    { name: 'Food', type: 'EXPENSE', icon: 'í½½ï¸', color: '#ef4444', isSystem: true },
    { name: 'Transport', type: 'EXPENSE', icon: 'íº—', color: '#f59e0b', isSystem: true },
    { name: 'Shopping', type: 'EXPENSE', icon: 'í»ï¸', color: '#ec4899', isSystem: true },
    { name: 'Entertainment', type: 'EXPENSE', icon: 'í¾¬', color: '#6366f1', isSystem: true },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { name_type: { name: category.name, type: category.type as any } },
      update: {},
      create: category as any,
    });
  }

  console.log('âœ… Categories created');

  // Create demo user
  const hashedPassword = await bcrypt.hash('demo123', 10);
  
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@moneynext.com' },
    update: {},
    create: {
      email: 'demo@moneynext.com',
      passwordHash: hashedPassword,
      firstName: 'Demo',
      lastName: 'User',
      emailVerified: true,
      role: 'USER',
      status: 'ACTIVE',
    },
  });

  console.log('âœ… Demo user created:', demoUser.email);
  console.log('í¾‰ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('âŒ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
