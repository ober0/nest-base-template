import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class RolePermissionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findPermissionsByRoleId(roleId: string) {
        return this.prisma.rolePermission.findMany({
            where: { roleId },
            select: { permission: true }
        })
    }
}
