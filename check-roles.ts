
import { PrismaClient } from '@prisma/client';
import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter';
import dotenv from 'dotenv';

dotenv.config();

const adapter = new PrismaTiDBCloud({
    url: process.env.DATABASE_URL
});
const prisma = new PrismaClient({ adapter });

async function main() {
    try {
        const users: any[] = await prisma.$queryRawUnsafe(`SELECT Role, COUNT(*) as count FROM users GROUP BY Role`);
        console.log('User roles in database:', JSON.stringify(users, (key, value) => typeof value === 'bigint' ? value.toString() : value, 2));
    } catch (error) {
        console.error('Error querying roles:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
