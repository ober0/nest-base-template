import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { PermissionRepository } from './permission.repository'
import { I18nService } from 'nestjs-i18n'
import { getCurrentLang } from '../../i18n/utils'

@Injectable()
export class PermissionService {
    private readonly logger = new Logger('Permission')

    constructor(
        private readonly permissionRepository: PermissionRepository,
        private readonly i18n: I18nService
    ) {}

    async findAll() {
        const permissions = await this.permissionRepository.findAll()
        if (!permissions.length) {
            this.logger.error(`Права не найдены`)
            throw new NotFoundException(
                this.i18n.t('errors.permission.not_found', {
                    lang: getCurrentLang()
                })
            )
        }
        this.logger.log(`Права найдены: ${permissions.length}`)
        return permissions
    }

    async findOne(id: string) {
        const permission = await this.permissionRepository.findOne(id)
        if (!permission) {
            this.logger.error(`Право ${id} не найдено`)
            throw new NotFoundException(
                this.i18n.t('errors.permission.not_found', {
                    lang: getCurrentLang()
                })
            )
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
