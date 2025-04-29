import { Injectable } from '@nestjs/common'
import { RolePermissionRepository } from './role-permission.repository'
import { UserService } from '../user/user.service'

@Injectable()
export class RolePermissionService {
    constructor(
        private readonly rolePermissionRepository: RolePermissionRepository,
        private readonly userService: UserService
    ) {}

    async checkPermission(permission: string, userId: string) {
        const userRoleId = await this.getUserRoleId(userId)
        const rolePermissions = await this.rolePermissionRepository.findPermissionsByRoleId(userRoleId)

        return rolePermissions.some((rolePermission) => rolePermission.permission.name === permission)
    }

    private async getUserRoleId(userId: string) {
        const user = await this.userService.findOneById(userId)
        return user.role.id
    }
}
