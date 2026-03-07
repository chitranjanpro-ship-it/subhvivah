import { prisma } from '../app';

beforeAll(async () => {
  // Setup database, etc.
});

afterAll(async () => {
  await prisma.$disconnect();
});
