import { PrismaClient } from '@prisma/client';
import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter';

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Database connection will fail.");
}

// 1. Initialize the adapter with the config object directly
const adapter = new PrismaTiDBCloud({
  url: process.env.DATABASE_URL as string
});

// 2. Start Prisma with the adapter
const prisma = new PrismaClient({ adapter });

export { prisma };