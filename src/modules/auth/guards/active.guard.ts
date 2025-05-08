import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { UserService } from 'src/modules/user/user.service'
import { getCurrentLang } from '../../../i18n/utils'
import { I18nService } from 'nestjs-i18n'

@Injectable()
export class ActiveGuard implements CanActivate {
    constructor(
        private readonly userService: UserService,
        private readonly i18n: I18nService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { user } = context.switchToHttp().getRequest()

        const canActivate = await this.userService.findOneById(user.id)

        if (canActivate.isActive && !canActivate.isForbidden) {
            return true
        } else if (!canActivate.isActive) {
            throw new ForbiddenException(
                this.i18n.t('errors.user.deactivated', {
                    lang: getCurrentLang()
                })
            )
        } else if (canActivate.isForbidden) {
            throw new ForbiddenException(
                this.i18n.t('errors.user.forbidden', {
                    lang: getCurrentLang()
                })
            )
        }
        throw new UnauthorizedException()
    }
}
