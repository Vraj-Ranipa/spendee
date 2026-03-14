import dotenv from 'dotenv';
dotenv.config();

import { prisma } from './src/lib/prisma';

async function main() {
    try {
        const users = await prisma.users.findMany({
            take: 5,
            select: { UserID: true, UserName: true, Role: true }
        });
        console.log('Successfully fetched users:', JSON.stringify(users, null, 2));

        const people = await prisma.peoples.findMany({
            take: 5,
            include: { users: true }
        });
        console.log('Successfully fetched people with users:', JSON.stringify(people, null, 2));
    } catch (error: any) {
        console.error('Prisma Error:', error.message);
        if (error.cause) console.error('Error Cause:', error.cause);
        if (error.code) console.error('Error Code:', error.code);
    } finally {
        await prisma.$disconnect();
    }
}

main();
