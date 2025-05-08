import { Global, Module } from '@nestjs/common'
import { RolePermissionService } from './role-permission.service'
import { RolePermissionRepository } from './role-permission.repository'

@Global()
@Module({
    providers: [RolePermissionService, RolePermissionRepository],
    exports: [RolePermissionService, RolePermissionRepository]
})
export class RolePermissionModule {}
