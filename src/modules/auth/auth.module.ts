import { forwardRef, Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { UserModule } from '../user/user.module'
import { TokenModule } from '../token/token.module'
import { RedisModule } from '../redis/redis.module'
import { CryptModule } from '../crypt/crypt.module'
import { PasswordModule } from '../password/password.module'
import { SmtpModule } from '../smtp/smtp.module'

@Module({
    imports: [forwardRef(() => UserModule), TokenModule, PasswordModule, CryptModule, RedisModule, SmtpModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {}
