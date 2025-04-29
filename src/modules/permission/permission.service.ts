import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PermissionRepository } from './permission.repository'

@Injectable()
export class PermissionService {
    private readonly logger = new Logger('Permission')

    constructor(private readonly permissionRepository: PermissionRepository) {}

    async findAll() {
        const permissions = await this.permissionRepository.findAll()
        if (!permissions.length) {
            this.logger.error(`Права не найдены`)
            throw new NotFoundException('Права не найдены')
        }
        this.logger.log(`Права найдены: ${permissions.length}`)
        return permissions
    }

    async findOne(id: string) {
        const permission = await this.permissionRepository.findOne(id)
        if (!permission) {
            this.logger.error(`Право ${id} не найдено`)
            throw new NotFoundException(`Право ${id} не найдено`)
        }
        this.logger.log(`Право ${permission.name} найдено`)
        return permission
    }

    async exists(id: string) {
        return this.permissionRepository.exists(id)
    }

    async existsMany(ids: string[]): Promise<boolean> {
        return this.permissionRepository.existsMany(ids)
    }
}
