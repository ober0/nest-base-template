import { forwardRef, Global, Module } from '@nestjs/common'
import { UserService } from './user.service'
import { AuthModule } from '../auth/auth.module'
import { PasswordModule } from '../password/password.module'
import { UserRepository } from './user.repository'
import { SmtpModule } from '../smtp/smtp.module'
import { RedisModule } from '../redis/redis.module'
import { CryptModule } from '../crypt/crypt.module'
import { UserController } from './user.controller'

@Global()
@Module({
    imports: [forwardRef(() => AuthModule), PasswordModule, RedisModule, SmtpModule, CryptModule],
    providers: [UserService, UserRepository],
    controllers: [UserController],
    exports: [UserService, UserRepository]
})
export class UserModule {}
