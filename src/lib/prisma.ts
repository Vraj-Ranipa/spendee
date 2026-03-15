import { PrismaClient } from '@prisma/client';
import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter';

// PrismaClient is attached to the `global` object to prevent
// multiple instances of Prisma Client in development (hot reloads).
// In production (Vercel), each lambda invocation gets its own instance.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error(
            'DATABASE_URL environment variable is not set. Please configure it in your Vercel project settings or .env file.'
        );
    }

    const adapter = new PrismaTiDBCloud({ url: connectionString });
    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// Only cache client globally in development to allow hot-reload singleton.
// In production, Vercel manages the lifecycle.
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}