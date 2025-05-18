import { PrismaClient } from '@prisma/client'
import { PermissionEnum } from '../../src/common/constants/permission.enum'
import * as bcrypt from 'bcryptjs'
import { RolesEnum } from '../../src/modules/role/enum/roles.enum'

export async function seedUser(prisma: PrismaClient) {
    await createAdmin(prisma)
}

async function hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

async function createAdmin(prisma: PrismaClient) {
    const hashedPassword = await hashPassword('string')

    const adminRoleId: string = (
        await prisma.role.findFirst({
            where: {
                name: RolesEnum.Admin
            }
        })
    ).id

    await prisma.user.upsert({
        where: { email: 'string@gmail.com' },
        update: {},
        create: {
            email: 'string@gmail.com',
            password: {
                create: {
                    password: hashedPassword
                }
            },
            person: {
                create: {
                    firstName: 'string',
                    lastName: 'string'
                }
            },
            twoFactor: false,
            role: {
                connect: {
                    id: adminRoleId
                }
            }
        }
    })
}
