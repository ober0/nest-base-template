import { PrismaClient } from '@prisma/client'
import { seedRole } from './role.seed'
import { seedPermission } from './permission.seed'
import { seedUser } from './user.seed'

const prisma = new PrismaClient()

async function main() {
    await seedPermission(prisma)
    console.log('[+] Права созданы')

    await seedRole(prisma)
    console.log('[+] Роли созданы')

    await seedUser(prisma)
    console.log('[+] Пользователи созданы')

    console.log('[+] Все готово')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
