import { Inject, Injectable, Logger } from '@nestjs/common'
import { LoginHistoryRepository } from './login-history.repository'
import { LoginHistorySearchDto } from './dto/login-history-search.dto'
import { LoginHistoryCreateDto } from './dto/login-history-create.dto'

@Injectable()
export class LoginHistoryService {
    private readonly logger = new Logger(LoginHistoryService.name)

    constructor(private readonly repository: LoginHistoryRepository) {}

    async search(dto: LoginHistorySearchDto) {
        const [data, count] = await Promise.all([this.repository.search(dto), this.repository.count(dto)])

        return { data, count }
    }

    async create(dto: LoginHistoryCreateDto) {
        return this.repository.create(dto)
    }
}
