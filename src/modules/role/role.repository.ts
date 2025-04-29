import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class RoleRepository {
    constructor(private readonly prisma: PrismaService) {}

    create(roleDto: Prisma.RoleCreateInput, transactionClient: Prisma.TransactionClient = this.prisma) {
        return transactionClient.role.create({ data: roleDto })
    }

    findById(id: string, transactionClient: Prisma.TransactionClient = this.prisma) {
        return transactionClient.role.findUnique({ where: { id } })
    }

    findByName(name: string, transactionClient: Prisma.TransactionClient = this.prisma) {
        return transactionClient.role.findUnique({ where: { name } })
    }

    findAll(transactionClient: Prisma.TransactionClient = this.prisma) {
        return transactionClient.role.findMany()
    }

    update(id: string, roleDto: Prisma.RoleUpdateInput, transactionClient: Prisma.TransactionClient = this.prisma) {
        return transactionClient.role.update({
            where: { id },
            data: roleDto
        })
    }

    delete(id: string, transactionClient: Prisma.TransactionClient = this.prisma) {
        return transactionClient.role.delete({ where: { id } })
    }

    createRolePermissions(permissions: { roleId: string; permissionId: string }[], transactionClient: Prisma.TransactionClient = this.prisma) {
        return transactionClient.rolePermission.createMany({
            data: permissions
        })
    }

    deleteRolePermissions(roleId: string, transactionClient: Prisma.TransactionClient = this.prisma) {
        return transactionClient.rolePermission.deleteMany({
            where: { roleId }
        })
    }

    async existsByName(name: string) {
        return !!(await this.findByName(name))
    }

    async existsById(id: string) {
        return !!(await this.findById(id))
    }
}
