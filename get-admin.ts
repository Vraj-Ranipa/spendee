
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter'

const adapter = new PrismaTiDBCloud({
    url: process.env.DATABASE_URL as string
})

const prisma = new PrismaClient({ adapter })

async function main() {
    try {
        const users = await prisma.$queryRaw`SELECT UserID, UserName, EmailAddress, Role FROM users`
        console.log(JSON.stringify(users, null, 2))
    } catch (error) {
        console.error('Error fetching users:', error)
    }
}

main().finally(() => prisma.$disconnect())
