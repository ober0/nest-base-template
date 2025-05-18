import { Injectable } from '@nestjs/common'
import { LoginHistoryCreateDto } from './dto/login-history-create.dto'
import { LoginHistorySearchDto } from './dto/login-history-search.dto'
import { PrismaService } from '../prisma/prisma.service'
import { LOGIN_HISTORY_INCLUDE } from './consts/login-history.include'
import { mapSearch } from '../prisma/dto/map.search'
import { mapSort } from '../prisma/dto/map.sort'
import { mapPagination } from '../prisma/dto/map.pagination'
@Injectable()
export class LoginHistoryRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create({ userId, ...data }: LoginHistoryCreateDto) {
        return this.prisma.loginHistory.create({
            data: {
                ...data,
                user: { connect: { id: userId } }
            }
        })
    }

    async search(data: LoginHistorySearchDto) {
        return this.prisma.loginHistory.findMany({
            where: {
                ...mapSearch(data.filters),
                user: {
                    ...mapSearch(data.filters?.user)
                }
            },
            orderBy: mapSort(data.sorts),
            ...mapPagination(data.pagination),
            ...LOGIN_HISTORY_INCLUDE
        })
    }

    async count(data: LoginHistorySearchDto) {
        return this.prisma.loginHistory.count({
            where: {
                ...mapSearch(data.filters),
                user: {
                    ...mapSearch(data.filters?.user)
                }
            }
        })
    }
}
