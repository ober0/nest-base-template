import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { RoleCreateDto, RoleUpdateDto } from './dto'
import { PermissionService } from '../permission/permission.service'
import { RoleRepository } from './role.repository'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class RoleService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly roleRepository: RoleRepository,
        private readonly permissionService: PermissionService
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
        if (!roleWithPermissions) throw new NotFoundException('Роль не найдена')
        return roleWithPermissions
    }

    async findOneByName(name: string) {
        const role = await this.roleRepository.findByName(name)
        if (!role) throw new NotFoundException('Роль не найдена')
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
            throw new NotFoundException('Роли не найдены')
        }
        return roles
    }

    async delete(id: string) {
        await this.ensureRoleExists(id)
        return this.roleRepository.delete(id)
    }

    private async ensureRoleNameUnique(name: string) {
        if (await this.roleRepository.existsByName(name)) {
            throw new ConflictException('Роль существует')
        }
    }

    private async ensureRoleExists(id: string) {
        if (!(await this.roleRepository.existsById(id))) {
            throw new NotFoundException('Роль не найдена')
        }
    }

    private async ensurePermissionsAreUnique(permissions: string[]) {
        if (new Set(permissions).size !== permissions.length) {
            throw new BadRequestException('Дубликат')
        }
    }

    private async ensurePermissionsExist(permissions: string[]) {
        if (!(await this.permissionService.existsMany(permissions))) {
            throw new NotFoundException()
        }
    }
}
