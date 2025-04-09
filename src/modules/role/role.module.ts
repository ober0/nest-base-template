import { forwardRef, Module } from '@nestjs/common'
import { RoleService } from './role.service'
import { RoleController } from './role.controller'
import { RolePermissionModule } from '../role-permission/role-permission.module'
import { UserModule } from '../user/user.module'
import { RoleRepository } from './role.repository'
import { PermissionModule } from '../permission/permission.module'
import { PrismaModule } from '../prisma/prisma.module'

@Module({
    imports: [PermissionModule, forwardRef(() => UserModule), RolePermissionModule, PrismaModule],
    controllers: [RoleController],
    providers: [RoleService, RoleRepository],
    exports: [RoleService, RoleRepository]
})
export class RoleModule {}
