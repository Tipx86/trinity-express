import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient | null {
  try {
    return new PrismaClient({
      log: ['error'],
    });
  } catch (e) {
    console.warn('Failed to initialize PrismaClient:', e);
    return null;
  }
}

export const prisma = globalForPrisma.prisma ?? (createPrismaClient() as any);

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma;
}

export default prisma;
