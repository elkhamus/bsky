const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const clearDatabase = async () => {
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.user.deleteMany();
};

beforeAll(async () => {
  await clearDatabase();
});

beforeEach(async () => {
  await clearDatabase();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await clearDatabase();
  await prisma.$disconnect();
});
