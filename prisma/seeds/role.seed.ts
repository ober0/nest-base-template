import { PrismaClient } from '@prisma/client'
import { PermissionEnum } from '../../src/common/constants/permission.enum'

export async function seedRole(prisma: PrismaClient) {
    await createUser(prisma)
    await createAdmin(prisma)
}

async function createAdmin(prisma: PrismaClient, role: string = 'admin') {
    const existing = await prisma.role.findUnique({ where: { name: role } })
    if (existing) return

    await prisma.$transaction(async (tx) => {
        const createdRole = await tx.role.create({ data: { name: role } })
        const permissions = await tx.permission.findMany()
        const rolePermissions = permissions.map((permission) => ({
            roleId: createdRole.id,
            permissionId: permission.id
        }))
        await tx.rolePermission.createMany({ data: rolePermissions })
    })
}

async function createUser(prisma: PrismaClient) {
    const existing = await prisma.role.findUnique({ where: { name: 'user' } })
    if (existing) return

    await prisma.$transaction(async (tx) => {
        const createdRole = await tx.role.create({ data: { name: 'user' } })

        const userPermissions: PermissionEnum[] = []

        const permissions = await tx.permission.findMany({
            where: {
                name: { in: userPermissions }
            }
        })

        const rolePermissions = permissions.map((permission) => ({
            roleId: createdRole.id,
            permissionId: permission.id
        }))
        await tx.rolePermission.createMany({ data: rolePermissions })
    })
}
