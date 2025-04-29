import { forwardRef, Module } from '@nestjs/common'
import { UserService } from './user.service'
import { AuthModule } from '../auth/auth.module'
import { PasswordModule } from '../password/password.module'
import { UserRepository } from './user.repository'
import { RoleModule } from '../role/role.module'
import { SmtpModule } from '../smtp/smtp.module'
import { PrismaModule } from '../prisma/prisma.module'
import { RedisModule } from '../redis/redis.module'
import { CryptModule } from '../crypt/crypt.module'
import { UserController } from './user.controller'
import { PermissionModule } from '../permission/permission.module'
import { RolePermissionModule } from '../role-permission/role-permission.module'

@Module({
    imports: [forwardRef(() => AuthModule), forwardRef(() => RoleModule), PasswordModule, PrismaModule, PasswordModule, RedisModule, SmtpModule, CryptModule, PermissionModule, RolePermissionModule],
    providers: [UserService, UserRepository],
    controllers: [UserController],
    exports: [UserService, UserRepository]
})
export class UserModule {}
