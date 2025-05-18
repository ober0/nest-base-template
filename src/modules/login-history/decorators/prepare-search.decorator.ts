import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { LoginHistorySearchDto } from '../dto/login-history-search.dto'
import { RolesEnum } from '../../role/enum/roles.enum'

export const PrepareLoginHistorySearch = createParamDecorator((data: unknown, ctx: ExecutionContext): LoginHistorySearchDto => {
    const request: any = ctx.switchToHttp().getRequest()
    const user: any = request.user
    const body: LoginHistorySearchDto = request.body

    if (!user) throw new UnauthorizedException()

    if (user.userRole?.role.name === RolesEnum.Admin) {
        return {
            ...body,
            filters: {
                ...body?.filters,
                user: {
                    ...body?.filters?.user,
                    email: body?.filters?.user?.email ?? user.email
                }
            }
        } as LoginHistorySearchDto
    }

    return {
        ...body,
        filters: {
            ...body?.filters,
            user: {
                ...body?.filters?.user,
                email: user.email
            }
        }
    } as LoginHistorySearchDto
})
