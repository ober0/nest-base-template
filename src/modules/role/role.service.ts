import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { RoleCreateDto, RoleUpdateDto } from './dto'
import { PermissionService } from '../permission/permission.service'
import { RoleRepository } from './role.repository'
import { PrismaService } from '../prisma/prisma.service'
import { I18nService } from 'nestjs-i18n'
import { getCurrentLang } from '../../i18n/utils'

@Injectable()
export class RoleService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly roleRepository: RoleRepository,
        private readonly permissionService: PermissionService,
        private readonly i18n: I18nService
    ) {}

    async create({ permissions, ...roleDto }: RoleCreateDto) {
        await Promise.all([this.ensureRoleNameUnique(roleDto.name), this.ensurePermissionsAreUnique(permissions), this.ensurePermissionsExist(permissions)])

        return this.prisma.$transaction(async (transactionClient) => {
            const newRole = await this.roleRepository.create(roleDto, transactionClient)
            await this.roleRepository.createRolePermissions(
                permissions.map((permissionId) => ({
                    roleId: newRole.id,
                    permissionId
                })),
                transactionClient
            )
            return newRole
        })
    }

    async update(roleId: string, { permissions, ...roleDto }: RoleUpdateDto) {
        await Promise.all([this.ensureRoleExists(roleId), this.ensurePermissionsAreUnique(permissions), this.ensurePermissionsExist(permissions)])

        return this.prisma.$transaction(async (transactionClient) => {
            const updatedRole = await this.roleRepository.update(roleId, roleDto, transactionClient)
            await this.roleRepository.deleteRolePermissions(roleId, transactionClient)
            await this.roleRepository.createRolePermissions(
                permissions.map((permissionId) => ({
                    roleId,
                    permissionId
                })),
                transactionClient
            )
            return updatedRole
        })
    }

    async findOne(id: string) {
        const roleWithPermissions = await this.prisma.role.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                rolePermissions: {
                    select: {
                        permission: {
                            select: {
                                id: true,
                                name: true,
                                description: true
                            }
                        }
                    }
                }
            }
        })
        if (!roleWithPermissions)
            throw new NotFoundException(
                this.i18n.t('errors.role.not_found', {
                    lang: getCurrentLang()
                })
            )
        return roleWithPermissions
    }

    async findOneByName(name: string) {
        const role = await this.roleRepository.findByName(name)
        if (!role)
            throw new NotFoundException(
                this.i18n.t('errors.role.not_found', {
                    lang: getCurrentLang()
                })
            )
        return role
    }

    async findAll() {
        const roles = await this.prisma.role.findMany({
            select: {
                id: true,
                name: true,
                rolePermissions: {
                    select: {
                        permission: {
                            select: {
                                id: true,
                                name: true,
                                description: true
                            }
                        }
                    }
                }
            }
        })
        if (!roles.length) {
            throw new NotFoundException(
                this.i18n.t('errors.role.not_found_many', {
                    lang: getCurrentLang()
                })
            )
        }
        return roles
    }

    async delete(id: string) {
        await this.ensureRoleExists(id)
        return this.roleRepository.delete(id)
    }

    private async ensureRoleNameUnique(name: string) {
        if (await this.roleRepository.existsByName(name)) {
            throw new ConflictException(
                this.i18n.t('errors.user.exists', {
                    lang: getCurrentLang()
                })
            )
        }
    }

    private async ensureRoleExists(id: string) {
        if (!(await this.roleRepository.existsById(id))) {
            throw new NotFoundException(
                this.i18n.t('errors.role.not_found', {
                    lang: getCurrentLang()
                })
            )
        }
    }

    private async ensurePermissionsAreUnique(permissions: string[]) {
        if (new Set(permissions).size !== permissions.length) {
            throw new BadRequestException(
                this.i18n.t('errors.user.exists', {
                    lang: getCurrentLang()
                })
            )
        }
    }

    private async ensurePermissionsExist(permissions: string[]) {
        if (!(await this.permissionService.existsMany(permissions))) {
            throw new NotFoundException()
        }
    }
}
