import { forwardRef, Module } from '@nestjs/common'
import { RolePermissionService } from './role-permission.service'
import { UserModule } from '../user/user.module'
import { RolePermissionRepository } from './role-permission.repository'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
    providers: [RolePermissionService, RolePermissionRepository],
    imports: [forwardRef(() => UserModule), PrismaModule],
    exports: [RolePermissionService, RolePermissionRepository]
})
export class RolePermissionModule {}
