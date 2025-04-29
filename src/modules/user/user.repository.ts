import { Injectable } from '@nestjs/common'
import { SelfUserUpdateDto, TwoFactorAuthDto } from 'src/modules/auth/dto'
import { PrismaService } from '../prisma/prisma.service'
import { USER_INCLUDE } from './consts/include.const'
import { UserSearchDto } from './dto/search.dto'
import { mapSearch } from '../prisma/dto/map.search'
import { mapSort } from '../prisma/dto/map.sort'
import { SortTypes } from '../../common/dto/sort-types.dto'
import { mapPagination } from '../prisma/dto/map.pagination'

@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) {}

    async create(data: { email: string; firstName: string; lastName: string; phoneNumber: string; hashedPassword: string; roleId: string }) {
        return this.prisma.user.create({
            data: {
                email: data.email,
                password: {
                    create: {
                        password: data.hashedPassword
                    }
                },
                role: {
                    connect: { id: data.roleId }
                },
                person: {
                    create: {
                        firstName: data.firstName,
                        lastName: data.lastName,
                        phone: data.phoneNumber
                    }
                }
            },
            ...USER_INCLUDE
        })
    }

    async findOneByEmail(email: string) {
        return this.prisma.user.findFirst({
            where: { email },
            ...USER_INCLUDE
        })
    }

    async findOneById(id: string) {
        return this.prisma.user.findFirst({
            where: { id },
            ...USER_INCLUDE
        })
    }

    async existsByEmail(email: string): Promise<boolean> {
        const result = await this.prisma.$queryRaw<{ exists: boolean }[]>`
            SELECT EXISTS(SELECT 1 FROM "User" WHERE "email" = ${email})
        `
        return result[0]?.exists || false
    }

    async existsById(id: string): Promise<boolean> {
        const result = await this.prisma.$queryRaw<{ exists: boolean }[]>`
            SELECT EXISTS(SELECT 1 FROM "User" WHERE "id" = ${id})
        `
        return result[0]?.exists || false
    }

    async update(id: string, userUpdateDto: SelfUserUpdateDto) {
        return this.prisma.user.update({
            where: { id },
            data: {
                person: {
                    update: {
                        ...userUpdateDto
                    }
                }
            },
            ...USER_INCLUDE
        })
    }

    async updatePassword(id: string, password_hash: string) {
        return this.prisma.user.update({
            where: {
                id
            },
            data: {
                password: {
                    update: {
                        password: password_hash
                    }
                }
            },
            ...USER_INCLUDE
        })
    }

    async updateTwoFactor(id: string, twoFactorAuthDto: TwoFactorAuthDto) {
        return this.prisma.user.update({
            where: {
                id
            },
            data: {
                twoFactor: twoFactorAuthDto.on
            },
            ...USER_INCLUDE
        })
    }

    async buildWhere(dto: UserSearchDto) {
        return {
            ...mapSearch(dto.filters, ['roleIds', 'firstName', 'lastName'], dto.query, ['email', 'person.firstName', 'person.lastName', 'role.name']),
            role: dto.filters?.roleIds
                ? {
                      id: {
                          in: dto.filters.roleIds
                      }
                  }
                : undefined,
            person:
                dto.filters?.firstName || dto.filters?.lastName
                    ? {
                          firstName: dto.filters?.firstName,
                          lastName: dto.filters?.lastName
                      }
                    : undefined
        }
    }

    async search(dto: UserSearchDto) {
        return this.prisma.user.findMany({
            where: await this.buildWhere(dto),
            orderBy: [
                ...mapSort(dto.sorts, ['role', 'firstName', 'lastName']),
                {
                    role: dto.sorts?.role
                        ? {
                              name: dto.sorts.role === SortTypes.ASC ? 'asc' : 'desc'
                          }
                        : undefined
                },
                {
                    person: dto.sorts?.firstName
                        ? {
                              firstName: dto.sorts.firstName === SortTypes.ASC ? 'asc' : 'desc'
                          }
                        : undefined
                },
                {
                    person: dto.sorts?.lastName
                        ? {
                              lastName: dto.sorts.lastName === SortTypes.ASC ? 'asc' : 'desc'
                          }
                        : undefined
                }
            ],
            ...mapPagination(dto.pagination),
            ...USER_INCLUDE
        })
    }

    async count(dto: UserSearchDto) {
        return this.prisma.user.count({
            where: await this.buildWhere(dto)
        })
    }
}
