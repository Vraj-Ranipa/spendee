
import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaTiDBCloud } from '@tidbcloud/prisma-adapter'

const adapter = new PrismaTiDBCloud({
    url: process.env.DATABASE_URL as string
})

const prisma = new PrismaClient({ adapter })

async function main() {
    try {
        const email = 'admin@example.com'
        const newPassword = 'admin123'

        // Update the password. Note: Using plain text because the app has a fallback
        // and it's easier for the user to remember.
        const result = await prisma.users.update({
            where: { EmailAddress: email },
            data: { Password: newPassword }
        })

        console.log(`Password for ${email} has been reset to: ${newPassword}`)
    } catch (error) {
        console.error('Error resetting password:', error)
    }
}

main().finally(() => prisma.$disconnect())
