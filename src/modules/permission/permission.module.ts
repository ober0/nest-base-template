import { forwardRef, Module } from '@nestjs/common'
import { PermissionService } from './permission.service'
import { PermissionController } from './permission.controller'
import { RolePermissionModule } from '../role-permission/role-permission.module'
import { UserModule } from '../user/user.module'
import { PermissionRepository } from './permission.repository'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
    imports: [forwardRef(() => UserModule), RolePermissionModule, PrismaModule],
    controllers: [PermissionController],
    providers: [PermissionService, PermissionRepository],
    exports: [PermissionService, PermissionRepository]
})
export class PermissionModule {}
