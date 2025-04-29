import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class PermissionRepository {
    constructor(private readonly prisma: PrismaService) {}

    async findAll() {
        return this.prisma.permission.findMany()
    }

    async findOne(id: string) {
        return this.prisma.permission.findUnique({ where: { id } })
    }

    async exists(id: string): Promise<boolean> {
        const result = await this.prisma.$queryRaw<{ exists: boolean }[]>`
            SELECT EXISTS(
				SELECT 1 
				FROM "Permission" 
				WHERE "id" = ${id})
        `
        return result[0]?.exists || false
    }

    async existsMany(ids: string[]): Promise<boolean> {
        const permissionExistsResults = await Promise.all(ids.map((id) => this.exists(id)))
        return permissionExistsResults.every((exists) => exists)
    }
}
