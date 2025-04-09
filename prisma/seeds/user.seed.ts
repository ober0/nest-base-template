import { PrismaClient } from '@prisma/client'
import { PermissionEnum } from '../../src/common/constants/permission.enum'
import * as bcrypt from 'bcryptjs'

export async function seedUser(prisma: PrismaClient) {
    await createAdmin(prisma)
}

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

async function createAdmin(prisma: PrismaClient) {
    const hashedPassword = await hashPassword('string')
    await prisma.user.upsert({
        where: { email: 'string@gmail.com' },
        update: {},
        create: {
            email: 'string@gmail.com',
            hashedPassword,
            twoFactor: false,
            firstName: 'string',
            lastName: 'string',
            username: 'string',
            roleUuid: (
                await prisma.role.findFirst({
                    where: {
                        name: 'admin'
                    }
                })
            ).uuid
        }
    })
}
