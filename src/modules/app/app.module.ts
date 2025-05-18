import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from '../prisma/prisma.module'
import { RedisModule } from '../redis/redis.module'
import { CryptModule } from '../crypt/crypt.module'
import { PasswordModule } from '../password/password.module'
import { SmtpModule } from '../smtp/smtp.module'
import { AuthModule } from '../auth/auth.module'
import { UserModule } from '../user/user.module'
import { ConfigModule } from '@nestjs/config'
import config from 'src/config/config'
import { PermissionModule } from '../permission/permission.module'
import { RoleModule } from '../role/role.module'
import { RolePermissionModule } from '../role-permission/role-permission.module'
import { I18nModule, AcceptLanguageResolver } from 'nestjs-i18n'
import { LoginHistoryModule } from '../login-history/login-history.module'

@Module({
    imports: [
        PrismaModule,
        RedisModule,
        CryptModule,
        PasswordModule,
        SmtpModule,
        UserModule,
        PermissionModule,
        RoleModule,
        RolePermissionModule,
        AuthModule,
        ConfigModule.forRoot({ isGlobal: true, load: [config] }),
        I18nModule.forRoot({
            fallbackLanguage: 'ru',
            fallbacks: {
                'ru-*': 'ru'
            },
            loaderOptions: {
                path: `./src/i18n/`,
                watch: true
            },
            resolvers: [AcceptLanguageResolver]
        }),
        LoginHistoryModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
