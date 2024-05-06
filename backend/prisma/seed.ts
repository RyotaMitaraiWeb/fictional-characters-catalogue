import { PrismaClient } from '@prisma/client';
import { roles } from '../src/common/constants/roles';

const prisma = new PrismaClient();
async function main() {
  const userRole = await prisma.role.upsert({
    where: { name: roles.user.name },
    update: {},
    create: {
      id: roles.user.id,
      name: roles.user.name,
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: roles.admin.name },
    update: {},
    create: {
      id: roles.admin.id,
      name: roles.admin.name,
    },
  });

  console.log(userRole);
  console.log(adminRole);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
