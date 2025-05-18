import { Module } from '@nestjs/common'
import { LoginHistoryController } from './login-history.controller'
import { LoginHistoryService } from './login-history.service'
import { LoginHistoryRepository } from './login-history.repository'

@Module({
    controllers: [LoginHistoryController],
    providers: [LoginHistoryService, LoginHistoryRepository],
    exports: [LoginHistoryService]
})
export class LoginHistoryModule {}
